const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


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


const Data = mongoose.model('Data', dataSchema);


const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB', error));

const app = express();
app.use(cors()); 


app.get('/api/data', async (req, res) => {
  try {

    const data = await Data.find();
 
    res.json(data);
  } catch (error) {
    console.error('Failed to fetch data', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


const port = process.env.PORT || 3000; // Use environment variable for PORT or fallback to 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
