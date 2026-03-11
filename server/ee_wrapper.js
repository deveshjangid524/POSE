const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

class EarthEngineAPI {
  constructor() {
    this.pythonScript = path.join(__dirname, 'ee_python.py');
  }

  async executePythonCommand(args) {
    return new Promise((resolve, reject) => {
      console.log(`Executing Python command: python ${this.pythonScript} ${args.join(' ')}`);
      
      const python = spawn('python', [this.pythonScript, ...args], {
        env: {
          ...process.env,
          CLIENT_ID: process.env.CLIENT_ID,
          CLIENT_SECRET: process.env.CLIENT_SECRET,
          REDIRECT_URI: process.env.REDIRECT_URI,
          PROJECT_ID: process.env.PROJECT_ID
        }
      });

      let data = '';
      let error = '';

      python.stdout.on('data', (chunk) => {
        const chunkStr = chunk.toString();
        data += chunkStr;
        console.log('Python stdout:', chunkStr.trim());
      });

      python.stderr.on('data', (chunk) => {
        const chunkStr = chunk.toString();
        error += chunkStr;
        console.log('Python stderr:', chunkStr.trim());
      });

      python.on('close', (code) => {
        console.log(`Python process exited with code: ${code}`);
        
        if (code !== 0) {
          reject(new Error(`Python script failed with code ${code}: ${error}`));
          return;
        }

        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (parseError) {
          console.error('Failed to parse Python output:', data);
          reject(new Error(`Failed to parse Python output: ${parseError.message}`));
        }
      });

      python.on('error', (err) => {
        console.error('Failed to start Python process:', err);
        reject(new Error(`Failed to start Python process: ${err.message}`));
      });
    });
  }

  async initialize() {
    try {
      console.log('🔧 Initializing Earth Engine Python API...');
      const result = await this.executePythonCommand(['init']);
      
      if (result.success) {
        console.log('✅ Earth Engine Python API initialized successfully!');
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Failed to initialize Earth Engine:', error.message);
      throw error;
    }
  }

  async getImageInfo(imageId) {
    try {
      console.log(`📊 Getting info for image: ${imageId}`);
      const result = await this.executePythonCommand(['image_info', imageId]);
      
      if (result.success) {
        console.log('✅ Image info retrieved successfully!');
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Failed to get image info:', error.message);
      throw error;
    }
  }

  async calculateMeanValues(imageId, geometry) {
    try {
      console.log('📈 Calculating mean values...');
      const geometryJson = JSON.stringify(geometry);
      const result = await this.executePythonCommand(['mean_values', imageId, geometryJson]);
      
      if (result.success) {
        console.log('✅ Mean values calculated successfully!');
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Failed to calculate mean values:', error.message);
      throw error;
    }
  }

  async listCollections() {
    try {
      console.log('📋 Listing available collections...');
      const result = await this.executePythonCommand(['collections']);
      
      if (result.success) {
        console.log('✅ Collections listed successfully!');
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Failed to list collections:', error.message);
      throw error;
    }
  }

  async getSentinel1Data() {
    try {
      console.log('🛰️ Fetching latest Sentinel-1 data...');
      const result = await this.executePythonCommand(['sentinel1']);
      
      if (result.success) {
        console.log('✅ Sentinel-1 data retrieved successfully!');
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Failed to fetch Sentinel-1 data:', error.message);
      throw error;
    }
  }
}

// Test function
async function testEarthEnginePython() {
  console.log('🚀 Testing Earth Engine Python API Integration...');
  
  try {
    // Check environment variables
    if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REDIRECT_URI) {
      throw new Error('Missing environment variables');
    }
    
    console.log('🔐 Environment variables loaded successfully');
    
    const eeAPI = new EarthEngineAPI();
    
    // Test 1: Initialize
    await eeAPI.initialize();
    
    // Test 2: Get image info
    const imageInfo = await eeAPI.getImageInfo('LANDSAT/LC08/C01/T1_SR/LC08_044034_20140318');
    console.log('📊 Image Info:', imageInfo);
    
    // Test 3: Calculate mean values
    const geometry = [-122.5, 37.0, -122.0, 37.5];
    const meanValues = await eeAPI.calculateMeanValues('LANDSAT/LC08/C01/T1_SR/LC08_044034_20140318', geometry);
    console.log('📈 Mean Values:', meanValues);
    
    // Test 4: List collections
    const collections = await eeAPI.listCollections();
    console.log('📋 Collections:', collections);
    
    console.log('🎉 All Earth Engine Python API tests passed!');
    
  } catch (error) {
    console.error('❌ Earth Engine Python API test failed:', error.message);
    
    if (error.message.includes('Python')) {
      console.log('💡 Hint: Make sure Python 3 and earthengine-api are installed:');
      console.log('   pip install earthengine-api');
      console.log('   earthengine authenticate');
    }
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testEarthEnginePython();
}

module.exports = EarthEngineAPI;
