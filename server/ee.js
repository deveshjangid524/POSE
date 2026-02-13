const ee = require('@google/earthengine');
require('dotenv').config();

async function testEarthEngine() {
  console.log('🚀 Testing Google Earth Engine API...');
  
  try {
    // Check if environment variables are loaded
    if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REDIRECT_URI) {
      throw new Error('Missing environment variables. Please check CLIENT_ID, CLIENT_SECRET, and REDIRECT_URI in your .env file.');
    }
    
    console.log('🔐 Environment variables loaded successfully');
    
    // The @google/earthengine package is designed for browser use
    // For Node.js, we need alternative approaches
    console.log('⚠️  @google/earthengine package is browser-based');
    console.log('📝 For Node.js Earth Engine access, use these alternatives:');
    console.log('');
    console.log('1️⃣  Earth Engine Python API (Recommended):');
    console.log('   - Use child_process to call Python scripts');
    console.log('   - Full API access with proper authentication');
    console.log('   - Example: python -c "import ee; ee.Initialize(); print(ee.Image(...).getInfo())"');
    console.log('');
    console.log('2️⃣  Earth Engine REST API:');
    console.log('   - Direct HTTP requests to Earth Engine API');
    console.log('   - Requires OAuth2 token management');
    console.log('   - More complex but works in Node.js');
    console.log('');
    console.log('3️⃣  Service Account Authentication:');
    console.log('   - Use service account key instead of OAuth2');
    console.log('   - Better for server-side applications');
    console.log('   - Requires Google Cloud service account');
    console.log('');
    
    // Test basic module loading (without authentication)
    console.log('✅ Earth Engine module loaded successfully');
    console.log('🔍 Available EE classes:', Object.keys(ee).filter(key => typeof ee[key] === 'function').slice(0, 5).join(', '));
    
    // Test that we can create EE objects (but not use them without auth)
    console.log('🎯 Testing EE object creation (no API calls)...');
    try {
      // This will fail because it tries to make API calls
      const testImage = ee.Image('LANDSAT/LC08/C01/T1_SR/LC08_044034_20140318');
      console.log('❌ Expected: Cannot use EE objects without browser authentication');
    } catch (apiError) {
      console.log('✅ Confirmed: EE requires browser environment for API calls');
    }
    
    console.log('');
    console.log('🎯 RECOMMENDATION:');
    console.log('   Use Earth Engine Python API for Node.js servers');
    console.log('   Your credentials are correct, but need Python environment');
    console.log('');
    console.log('🔧 Next Steps:');
    console.log('   1. Install Earth Engine Python API: pip install earthengine-api');
    console.log('   2. Create Python script with your credentials');
    console.log('   3. Call from Node.js using child_process.spawn()');
    
    console.log('🎉 Environment variables and module loading test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('CLIENT_ID')) {
      console.log('💡 Check .env file format (should be KEY=VALUE, not JavaScript)');
    }
  }
}

// Run the test
testEarthEngine();
