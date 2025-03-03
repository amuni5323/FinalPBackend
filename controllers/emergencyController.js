const Emergency = require('../models/Emergency'); // Ensure this path is correct

// Function to create a new emergency
const createEmergency = async (req, res) => {
  try {
    // Destructure necessary data from the request body
    const { type, location, description, contact } = req.body;

    // Create a new Emergency document
    const newEmergency = new Emergency({
      type,
      location,
      description,
      contact,
    });

    // Save the new emergency record to the database
    await newEmergency.save();

    // Send a success response with the created emergency data
    res.status(201).json({ message: 'Emergency created', emergency: newEmergency });
  } catch (error) {
    // Catch any errors and send a failure response
    res.status(500).json({ message: 'Error creating emergency', error: error.message });
  }
};

// Function to retrieve all emergencies
const getAllEmergencies = async (req, res) => {
  try {
    // Retrieve all emergency records from the database
    const emergencies = await Emergency.find();

    // Send a success response with the list of emergencies
    res.status(200).json(emergencies);
  } catch (error) {
    // Catch any errors and send a failure response
    res.status(500).json({ message: 'Error fetching emergencies', error: error.message });
  }
};

// Export the controller functions for use in routes
module.exports = { createEmergency, getAllEmergencies };
