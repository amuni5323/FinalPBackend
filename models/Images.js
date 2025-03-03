const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,  // Name of the image or its description
    },
    image: {
      type: String,  // This will store the URL or filename of the image
      required: true,  // Ensuring the image URL is always provided
    },
    public_id: {
      type: String,  // Cloudinary public_id for image management
      required: true,  // Cloudinary public_id to manage the image (delete, update, etc.)
    },
    url: { type: String, required: true },
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Image', ImageSchema);
