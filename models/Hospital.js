const mongoose = require("mongoose");

const hospitalSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['General', 'Dental', 'Eye', 'Specialized'], required: true },
    location: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    rating: { type: Number, default: 0 },
    image: { type: String }, // Image URL for the hospital (optional)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hospital", hospitalSchema);
