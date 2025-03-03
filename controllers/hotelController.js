const Hotel = require("../models/Hotel");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


exports.createHotel = async (req, res) => {
  try {
    // Check if the file exists
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Upload the image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "hotels", // Store the images in the 'hotels' folder in Cloudinary
    });

    // Get hotel details from request body
    const { name, description, location, contact, email, roomsAvailable, pricePerNight, amenities, rating } = req.body;

    // Create new hotel instance
    const hotel = new Hotel({
      name,
      description,
      location,
      contact,
      email,
      roomsAvailable,
      pricePerNight,
      amenities,
      rating,
      image: uploadResponse.secure_url, // Store the image URL from Cloudinary
      public_id: uploadResponse.public_id, // Store the public ID from Cloudinary
    });

    // Save the hotel to the database
    await hotel.save();

    // Send response back to client
    res.status(201).json(hotel);
  } catch (error) {
    console.error("Error while creating hotel:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.addHotel = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Extract image URLs from Cloudinary
    const imageUrls = req.files.map((file) => file.path);

    // Here, save the image URLs along with hotel details to the database
    // Example: Assuming you're using MongoDB with Mongoose
    const newHotel = new Hotel({
      name: req.body.name,
      location: req.body.location,
      images: imageUrls, // Store image URLs in the database
    });

    await newHotel.save();

    res.status(201).json({ message: "Hotel added successfully!", hotel: newHotel });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
