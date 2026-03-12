const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { register, login } = require('./controllers/authController');
const { authenticateToken } = require('./middleware/auth');
const EarthEngineAPI = require('./ee_wrapper');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_DB_URI || 'mongodb://localhost:27017/oilspill')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  console.log('Register request received:', req.body);
  register(req, res);
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  login(req, res);
});

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Oil Spill Prediction API Running' });
});

// Add new data endpoint (without database)
app.post('/api/data/manual', (req, res) => {
  const newData = req.body;
  console.log('Received data:', newData);
  res.json({ 
    message: 'Data received successfully', 
    data: newData,
    timestamp: new Date()
  });
});

app.post('/api/sentinel1/aoi-metrics', async (req, res) => {
  try {
    const {
      geojson,
      startDate,
      endDate,
      orbitPass,
      instrumentMode,
      polarization,
      scale,
      textureSize,
      oilThresholdDb
    } = req.body || {};

    const eeAPI = new EarthEngineAPI();
    const metrics = await eeAPI.getSentinel1AoiMetrics({
      geojson,
      startDate,
      endDate,
      orbitPass,
      instrumentMode,
      polarization,
      scale,
      textureSize,
      oilThresholdDb
    });

    res.json(metrics);
  } catch (error) {
    console.error('Error computing Sentinel-1 AOI metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compute Sentinel-1 AOI metrics',
      error: error.message
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});