const ee = require('@google/earthengine');
require('dotenv').config();

const credentials = JSON.parse(process.env.EE_SERVICE_ACCOUNT);
credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

ee.data.authenticateViaPrivateKey(credentials, () => {
  ee.initialize(null, null, async () => {
    console.log("🛰️ Earth Engine initialized successfully!");
    
    try {
      // Load Sentinel-1 GRD collection
      const collection = ee.ImageCollection('COPERNICUS/S1_GRD');
      
      // Filter by date (last 30 days) and instrument mode
      const now = new Date();
      const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const eeNow = ee.Date(now.toISOString());
      const eeStartDate = ee.Date(startDate.toISOString());
      
      console.log(`📅 Filtering from ${startDate.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]}`);
      
      const filtered = collection
        .filterDate(eeStartDate, eeNow)
        .filter(ee.Filter.eq('instrumentMode', 'IW'))
        .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
        .limit(5);
      
      // Get collection info
      const collectionInfo = await filtered.getInfo();
      
      console.log(`\n📊 Found ${collectionInfo.features.length} Sentinel-1 images:\n`);
      
      // Extract and display first 5 images data
      const first5Images = [];
      for (let i = 0; i < Math.min(collectionInfo.features.length, 5); i++) {
        const image = collectionInfo.features[i];
        const imageData = {
          index: i + 1,
          id: image.id,
          properties: image.properties,
          bands: image.bands.map(band => band.id)
        };
        first5Images.push(imageData);
        
        console.log(`📸 Image ${i + 1}:`);
        console.log(`   ID: ${image.id}`);
        console.log(`   Date: ${image.properties.system_time_start || 'N/A'}`);
        console.log(`   Polarization: ${image.properties.polarization || 'N/A'}`);
        console.log(`   Instrument Mode: ${image.properties.instrumentMode || 'N/A'}`);
        console.log(`   Orbit Pass: ${image.properties.orbitProperties_pass || 'N/A'}`);
        console.log(`   Available Bands: ${image.bands.map(band => band.id).join(', ')}`);
        console.log('');
      }
      
      const result = {
        success: true,
        message: "Sentinel-1 data retrieved successfully",
        first_5_images: first5Images,
        total_images_in_collection: collectionInfo.features.length
      };
      
      console.log('✅ Sentinel-1 data retrieval completed!');
      console.log('📋 Result:', JSON.stringify(result, null, 2));
      
    } catch (error) {
      console.error('❌ Error fetching Sentinel-1 data:', error.message);
    }
  });
});
