// controllers/feedbackController.js
const cloudinary = require('../config/cloudinary');
const Feedback = require('../models/Feedback');

const createFeedback = async (req, res) => {
  try {
    const { comment, rating, userId, serviceId, image } = req.body;

    if (!comment || !rating || !userId || !serviceId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let imageUrl = '';

    // If there's an image, upload it to Cloudinary
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'feedback_images', // Optional: set folder for organization
      });
      imageUrl = uploadResponse.secure_url; // Get the URL of the uploaded image
    }

    const newFeedback = new Feedback({
      comment,
      rating,
      userId,
      serviceId,
      image: imageUrl, // Save the image URL in the database
    });

    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating feedback', error: error.message });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find();
    res.status(200).json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
};

module.exports = { createFeedback, getAllFeedback };
