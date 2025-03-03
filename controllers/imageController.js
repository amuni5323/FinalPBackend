const Image = require("../models/Images");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config(); // Load environment variables

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Ensure this is correct
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage setup (for handling file uploads)
const storage = multer.diskStorage({});
const upload = multer({ storage });
exports.uploadMiddleware = upload.single("image"); // Middleware for routes

// Upload Image to Cloudinary & Save to Database
exports.createImage = async (req, res) => {
  try {
    // Ensure file exists
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "local-services",
    });

    // Save in MongoDB with all required fields
    const image = new Image({
      name: req.body.name, // Ensure the frontend sends "name" in the request body
      image: uploadResponse.secure_url, // Stores the image URL
      public_id: uploadResponse.public_id, // Cloudinary public ID
      url: uploadResponse.secure_url, // Store the URL
    });

    await image.save();

    return res.status(201).json({
      message: "Image uploaded and saved successfully!",
      data: image,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error while saving image" });
  }
};
