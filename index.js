const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Define a schema for your data
const dataSchema = new mongoose.Schema({
  alert_id: String,
  alert_desc: String,
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    required: true
  },
  deviceId: String,
  buildingId: mongoose.Schema.Types.ObjectId
});

// Create a model based on the schema
const Data = mongoose.model('Data', dataSchema);

// Connect to MongoDB
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB', error));

// Create an Express app
const app = express();
app.use(cors()); // Enable CORS for all routes

// Define a route to fetch data from MongoDB
app.get('/api/data', async (req, res) => {
  try {
    // Fetch data from MongoDB using Mongoose
    const data = await Data.find();
    // Send the data as a response
    res.json(data);
  } catch (error) {
    console.error('Failed to fetch data', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Start the server
const port = process.env.PORT || 3000; // Use environment variable for PORT or fallback to 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
