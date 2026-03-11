const ee = require('@google/earthengine');
require('dotenv').config();

class EarthEngineAPI {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    try {
      console.log('🔧 Initializing Earth Engine Node.js API...');
      
      const projectId = process.env.PROJECT_ID;
      
      // Try to initialize with default credentials
      await ee.initialize(null, null, projectId);
      console.log('✅ Earth Engine initialized successfully!');
      
      this.initialized = true;
      return { success: true, message: 'Earth Engine initialized successfully!' };
      
    } catch (error) {
      console.error('❌ Failed to initialize Earth Engine:', error.message);
      throw error;
    }
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  async getImageInfo(imageId) {
    try {
      await this.ensureInitialized();
      console.log(`📊 Getting info for image: ${imageId}`);
      
      const image = ee.Image(imageId);
      const info = await image.getInfo();
      
      return {
        id: info.get("id"),
        bands: info.get("bands", []).length,
        properties: info.get("properties", {}).length,
        band_names: info.get("bands", []).map(band => band.get("id"))
      };
      
    } catch (error) {
      console.error('❌ Failed to get image info:', error.message);
      throw error;
    }
  }

  async calculateMeanValues(imageId, geometryCoords, scale = 30) {
    try {
      await this.ensureInitialized();
      console.log('� Calculating mean values...');
      
      const image = ee.Image(imageId);
      const geometry = ee.Geometry.Rectangle(geometryCoords);
      
      const meanDict = await image.reduceRegion(
        ee.Reducer.mean(),
        geometry,
        scale,
        1e9
      ).getInfo();
      
      return {
        mean_values: meanDict,
        available_bands: Object.keys(meanDict)
      };
      
    } catch (error) {
      console.error('❌ Failed to calculate mean values:', error.message);
      throw error;
    }
  }

  async listCollections() {
    try {
      const collections = [
        "LANDSAT/LC08/C01/T1_SR",
        "LANDSAT/LE07/C01/T1_SR", 
        "LANDSAT/LT05/C01/T1_SR",
        "COPERNICUS/S2_SR",
        "MODIS/006/MOD13Q1"
      ];
      
      return {
        available_collections: collections,
        count: collections.length
      };
      
    } catch (error) {
      console.error('❌ Failed to list collections:', error.message);
      throw error;
    }
  }

  async getSentinel1Data() {
    try {
      await this.ensureInitialized();
      console.log('�️ Fetching latest Sentinel-1 data...');
      
      // Load Sentinel-1 GRD collection
      const collection = ee.ImageCollection('COPERNICUS/S1_GRD');
      
      // Filter by date (last 30 days) and instrument mode
      const now = new Date();
      const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const eeNow = ee.Date(now.toISOString());
      const eeStartDate = ee.Date(startDate.toISOString());
      
      const filtered = collection
        .filterDate(eeStartDate, eeNow)
        .filter(ee.Filter.eq('instrumentMode', 'IW'))
        .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
        .limit(5);
      
      // Get collection info
      const collectionInfo = await filtered.getInfo();
      
      // Extract first 5 images data
      const first5Images = [];
      const features = collectionInfo.get('features', []);
      
      for (let i = 0; i < Math.min(features.length, 5); i++) {
        const image = features[i];
        const imageData = {
          index: i + 1,
          id: image.get('id'),
          properties: image.get('properties', {}),
          bands: image.get('bands', []).map(band => band.get('id'))
        };
        first5Images.push(imageData);
      }
      
      return {
        message: "Sentinel-1 data retrieved successfully",
        first_5_images: first5Images,
        total_images_in_collection: features.length
      };
      
    } catch (error) {
      console.error('❌ Failed to fetch Sentinel-1 data:', error.message);
      throw error;
    }
  }
}

// Test function
async function testEarthEngineNodeJS() {
  console.log('🚀 Testing Earth Engine Node.js API Integration...');
  
  try {
    const eeAPI = new EarthEngineAPI();
    
    // Test 1: Initialize
    await eeAPI.initialize();
    
    // Test 2: Get Sentinel-1 data
    const sentinelData = await eeAPI.getSentinel1Data();
    console.log('�️ Sentinel-1 Data:', sentinelData);
    
    console.log('🎉 All Earth Engine Node.js API tests passed!');
    
  } catch (error) {
    console.error('❌ Earth Engine Node.js API test failed:', error.message);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testEarthEngineNodeJS();
}

module.exports = EarthEngineAPI;
