// models/Feedback.js
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');

const feedbackSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: false },
  name: { type: String, require: false },
  image: { type: String, required: false }, // Store image URL from Cloudinary
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', feedbackSchema);
