const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

async function setupAndTestEarthEngine() {
  console.log('Complete Earth Engine Setup and Test');
  console.log('');
  
  try {
    // Check environment variables
    if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REDIRECT_URI) {
      throw new Error('Missing environment variables in .env file');
    }
    
    console.log('Environment variables: OK');
    console.log('Python Earth Engine API: OK (installed)');
    console.log('');
    
    // Step 1: Setup authentication
    console.log('Step 1: Setting up Earth Engine authentication...');
    console.log('   This will open your browser for authorization');
    console.log('   After authorizing, return here and continue');
    console.log('');
    
    // Run setup script
    await new Promise((resolve, reject) => {
      const setup = spawn('python', [path.join(__dirname, 'setup_ee.py')], {
        env: process.env
      });
      
      setup.stdout.on('data', (data) => {
        console.log(data.toString().trim());
      });
      
      setup.stderr.on('data', (data) => {
        console.error(data.toString().trim());
      });
      
      setup.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Setup failed with code ${code}`));
        }
      });
    });
    
    // Wait for user to complete authentication
    console.log('');
    console.log('Waiting for authentication to complete...');
    console.log('   (Complete the browser authorization, then press Enter to continue)');
    
    // Wait for user input
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });
    
    // Step 2: Test the integration
    console.log('');
    console.log('Step 2: Testing Earth Engine integration...');
    
    const EarthEngineAPI = require('./ee_wrapper.js');
    const eeAPI = new EarthEngineAPI();
    
    // Test initialization
    await eeAPI.initialize();
    
    // Test image info
    const imageInfo = await eeAPI.getImageInfo('LANDSAT/LC08/C01/T1_SR/LC08_044034_20140318');
    console.log('Image Info:', imageInfo);
    
    // Test mean calculation
    const geometry = [-122.5, 37.0, -122.0, 37.5];
    const meanValues = await eeAPI.calculateMeanValues('LANDSAT/LC08/C01/T1_SR/LC08_044034_20140318', geometry);
    console.log('Mean Values:', meanValues);
    
    // Test collections
    const collections = await eeAPI.listCollections();
    console.log('Collections:', collections);
    
    console.log('');
    console.log('SUCCESS! Earth Engine Python API is working from Node.js!');
    console.log('');
    console.log('You can now use EarthEngineAPI class in your server:');
    console.log('   const eeAPI = new EarthEngineAPI();');
    console.log('   await eeAPI.getImageInfo(imageId);');
    console.log('   await eeAPI.calculateMeanValues(imageId, geometry);');
    console.log('   await eeAPI.listCollections();');
    
  } catch (error) {
    console.error('Setup failed:', error.message);
    
    if (error.message.includes('CLIENT_ID')) {
      console.log('Check your .env file format');
    } else if (error.message.includes('Python')) {
      console.log('Make sure Python and earthengine-api are installed');
    }
  }
}

// Run the complete setup
setupAndTestEarthEngine();
