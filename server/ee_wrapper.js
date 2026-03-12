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
    scale = 30,
    textureSize = 3,
    oilThresholdDb = -20,
    fastMode = true,
    includeDistributions = false,
    textureScale = 120,
    oilAreaScale = 60
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

      let aoi = ee.Geometry(geometryInput);
      if (fastMode) {
        aoi = aoi.simplify(30);
      }

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

      const base = ee.Image(
        collection
          .sort('system:time_start', false)
          .first()
      )
        .select([polarization]);

      const image = base.clip(aoi);

      const meanStdReducer = ee.Reducer.mean().combine({
        reducer2: ee.Reducer.stdDev(),
        sharedInputs: true
      });

      const vvStats = await image
        .reduceRegion({
          reducer: meanStdReducer,
          geometry: aoi,
          scale,
          maxPixels: 1e8,
          bestEffort: true,
          tileScale: 4
        })
        .getInfo();

      const vvBandName = polarization;
      const meanKey = `${vvBandName}_mean`;
      const stdKey = `${vvBandName}_stdDev`;

      const vvMean = vvStats ? vvStats[meanKey] : null;
      const vvStd = vvStats ? vvStats[stdKey] : null;

      const vvPercentiles = includeDistributions
        ? await image
            .reduceRegion({
              reducer: ee.Reducer.percentile([5, 25, 50, 75, 95]),
              geometry: aoi,
              scale,
              maxPixels: 1e9,
              bestEffort: true
            })
            .getInfo()
        : null;

      const vvHistogram = includeDistributions
        ? await image
            .reduceRegion({
              reducer: ee.Reducer.histogram({ maxBuckets: 64 }),
              geometry: aoi,
              scale,
              maxPixels: 1e9,
              bestEffort: true
            })
            .getInfo()
        : null;

      const vvForTexture = image.select([vvBandName]).multiply(10).toInt();
      const texture = vvForTexture.glcmTexture({ size: textureSize });
      const contrastBand = texture.select([`${vvBandName}_contrast`]);
      const homogeneityBand = texture.select([`${vvBandName}_idm`]);

      let textureStats = null;
      try {
        textureStats = await ee.Image.cat([contrastBand, homogeneityBand])
          .reduceRegion({
            reducer: ee.Reducer.mean(),
            geometry: aoi,
            scale: fastMode ? textureScale : scale,
            maxPixels: 1e8,
            bestEffort: true,
            tileScale: 4
          })
          .getInfo();
      } catch (e) {
        textureStats = null;
      }

      const textureContrastMean = textureStats ? textureStats[`${vvBandName}_contrast_mean`] : null;
      const textureHomogeneityMean = textureStats ? textureStats[`${vvBandName}_idm_mean`] : null;

      const oilMask = image.select([vvBandName]).lt(oilThresholdDb);
      const pixelArea = ee.Image.pixelArea();
      let oilAreaDict = null;
      try {
        oilAreaDict = await pixelArea
          .updateMask(oilMask)
          .reduceRegion({
            reducer: ee.Reducer.sum(),
            geometry: aoi,
            scale: fastMode ? oilAreaScale : scale,
            maxPixels: 1e8,
            bestEffort: true,
            tileScale: 4
          })
          .getInfo();
      } catch (e) {
        oilAreaDict = null;
      }

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
          fastMode,
          includeDistributions,
          textureScale: fastMode ? textureScale : scale,
          oilAreaScale: fastMode ? oilAreaScale : scale,
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
