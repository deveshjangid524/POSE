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

// Sentinel-1 data endpoint (optional authentication)
app.get('/api/sentinel1/latest', async (req, res) => {
  try {
    console.log('Fetching latest Sentinel-1 data...');
    const eeAPI = new EarthEngineAPI();
    const sentinelData = await eeAPI.getSentinel1Data();
    res.json(sentinelData);
  } catch (error) {
    console.error('Error fetching Sentinel-1 data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Sentinel-1 data',
      error: error.message
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});