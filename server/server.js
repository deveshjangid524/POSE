const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});