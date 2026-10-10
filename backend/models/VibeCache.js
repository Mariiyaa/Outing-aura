const mongoose = require('mongoose');

const vibeCacheSchema = new mongoose.Schema({
  queryKey: { type: String, required: true, unique: true },
  placesData: { type: Array, default: [] }, // Flexible object array
  aiVibeSummary: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now, expires: 21600 }
});

module.exports = mongoose.model('VibeCache', vibeCacheSchema);