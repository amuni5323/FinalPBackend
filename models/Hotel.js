const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    roomsAvailable: { type: Number, required: true },
    pricePerNight: { type: Number, required: true },
    amenities: { type: [String], required: true },
    rating: { type: Number, required: true },
    image: { type: String } // This will store the image URL or filename
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);
