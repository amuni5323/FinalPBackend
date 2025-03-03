const express = require('express');
const multer = require('multer');
const path = require('path');
const imageController = require('../controllers/imageController');
const Image = require('../models/Images'); // Import the Image model

const router = express.Router();

// Multer storage configuration to handle the uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

// POST route for uploading an image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Assuming the image is stored in the `req.file` object
    const imageUrl = '/uploads/' + req.file.filename; // This should be the image URL you want to store

    // Call the controller's createImage function (or create image in the database directly)
    await imageController.createImage(req, res, imageUrl);
    
    res.status(200).json({ message: 'Image uploaded successfully!', imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: 'Error uploading image.' });
  }
});

// Fetch image by name
router.get("/image/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const entity = await Image.findOne({ name: name });

    if (entity) {
      res.json({ imageUrl: entity.image }); // Return Cloudinary image URL or local URL
    } else {
      res.status(404).json({ error: "Image not found." });
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Error fetching image." });
  }
});

module.exports = router;
