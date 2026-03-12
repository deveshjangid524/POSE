const ee = require('@google/earthengine');
require('dotenv').config();

class EarthEngineAPI {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    try {
      console.log('🔧 Initializing Earth Engine with Service Account...');
      
      const credentials = JSON.parse(process.env.EE_SERVICE_ACCOUNT);
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
      
      return new Promise((resolve, reject) => {
        ee.data.authenticateViaPrivateKey(credentials, () => {
          ee.initialize(null, null, async () => {
            console.log("✅ Earth Engine initialized successfully!");
            this.initialized = true;
            resolve({ success: true, message: 'Earth Engine initialized successfully!' });
          });
        });
      });
      
    } catch (error) {
      console.error('❌ Failed to initialize Earth Engine:', error.message);
      console.error('💡 Make sure EE_SERVICE_ACCOUNT environment variable is set');
      throw error;
    }
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  async getSentinel1AoiMetrics({
    geojson,
    startDate,
    endDate,
    orbitPass = 'DESCENDING',
    instrumentMode = 'IW',
    polarization = 'VV',
    scale = 10,
    textureSize = 3,
    oilThresholdDb = -20
  }) {
    try {
      await this.ensureInitialized();

      if (!geojson) {
        throw new Error('geojson is required');
      }

      const geometryInput = geojson.type === 'Feature' ? geojson.geometry : geojson;
      if (!geometryInput || !geometryInput.type) {
        throw new Error('Invalid geojson: missing geometry');
      }

      const aoi = ee.Geometry(geometryInput);

      const now = new Date();
      const defaultEndDate = now.toISOString();
      const defaultStartDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const eeStart = ee.Date(startDate || defaultStartDate);
      const eeEnd = ee.Date(endDate || defaultEndDate);

      let collection = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filterBounds(aoi)
        .filterDate(eeStart, eeEnd)
        .filter(ee.Filter.eq('instrumentMode', instrumentMode));

      if (orbitPass) {
        collection = collection.filter(ee.Filter.eq('orbitProperties_pass', orbitPass));
      }

      if (polarization) {
        collection = collection.filter(ee.Filter.listContains('transmitterReceiverPolarisation', polarization));
      }

      const count = await collection.size().getInfo();
      if (!count || count < 1) {
        return {
          success: false,
          message: 'No Sentinel-1 images found for AOI and date range',
          meta: {
            startDate: startDate || defaultStartDate,
            endDate: endDate || defaultEndDate,
            orbitPass,
            instrumentMode,
            polarization
          }
        };
      }

      const image = collection
        .select([polarization])
        .median()
        .clip(aoi);

      const meanStdReducer = ee.Reducer.mean().combine({
        reducer2: ee.Reducer.stdDev(),
        sharedInputs: true
      });

      const vvStats = await image.reduceRegion({
        reducer: meanStdReducer,
        geometry: aoi,
        scale,
        maxPixels: 1e9,
        bestEffort: true
      }).getInfo();

      const vvBandName = polarization;
      const meanKey = `${vvBandName}_mean`;
      const stdKey = `${vvBandName}_stdDev`;

      const vvMean = vvStats ? vvStats[meanKey] : null;
      const vvStd = vvStats ? vvStats[stdKey] : null;

      const vvPercentiles = await image.reduceRegion({
        reducer: ee.Reducer.percentile([5, 25, 50, 75, 95]),
        geometry: aoi,
        scale,
        maxPixels: 1e9,
        bestEffort: true
      }).getInfo();

      const vvHistogram = await image.reduceRegion({
        reducer: ee.Reducer.histogram({ maxBuckets: 64 }),
        geometry: aoi,
        scale,
        maxPixels: 1e9,
        bestEffort: true
      }).getInfo();

      const vvForTexture = image.select([vvBandName]).multiply(10).toInt();
      const texture = vvForTexture.glcmTexture({ size: textureSize });
      const contrastBand = texture.select([`${vvBandName}_contrast`]);
      const homogeneityBand = texture.select([`${vvBandName}_idm`]);

      const textureStats = await ee.Image.cat([contrastBand, homogeneityBand])
        .reduceRegion({
          reducer: ee.Reducer.mean(),
          geometry: aoi,
          scale,
          maxPixels: 1e9,
          bestEffort: true
        })
        .getInfo();

      const textureContrastMean = textureStats ? textureStats[`${vvBandName}_contrast_mean`] : null;
      const textureHomogeneityMean = textureStats ? textureStats[`${vvBandName}_idm_mean`] : null;

      const oilMask = image.select([vvBandName]).lt(oilThresholdDb);
      const pixelArea = ee.Image.pixelArea();
      const oilAreaDict = await pixelArea
        .updateMask(oilMask)
        .reduceRegion({
          reducer: ee.Reducer.sum(),
          geometry: aoi,
          scale,
          maxPixels: 1e9,
          bestEffort: true
        })
        .getInfo();

      const oilAreaM2 = oilAreaDict ? oilAreaDict.area : null;

      return {
        success: true,
        meta: {
          startDate: startDate || defaultStartDate,
          endDate: endDate || defaultEndDate,
          orbitPass,
          instrumentMode,
          polarization,
          scale,
          textureSize,
          oilThresholdDb,
          imageCount: count
        },
        derived_metrics: {
          mean_backscatter: vvMean,
          std_backscatter: vvStd,
          vv_backscatter: vvMean,
          texture_contrast: textureContrastMean,
          texture_homogeneity: textureHomogeneityMean,
          oil_area_m2: oilAreaM2,
          oil_area_km2: oilAreaM2 == null ? null : oilAreaM2 / 1e6
        },
        supporting_fields: {
          vv_reduce_region: vvStats,
          vv_percentiles: vvPercentiles,
          vv_histogram: vvHistogram,
          texture_reduce_region_mean: textureStats
        }
      };
    } catch (error) {
      console.error('❌ Failed to compute Sentinel-1 AOI metrics:', error.message);
      throw error;
    }
  }
}

module.exports = EarthEngineAPI;
