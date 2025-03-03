const Shelter = require('../models/Shelter');

// Function to create a shelter
const createShelter = async (req, res) => {
  try {
    const { name, location, contact, description } = req.body;

    const newShelter = new Shelter({
      name,
      location,
      contact,
      description,
      // createdBy: req.user.id,
    });

    await newShelter.save();
    res.status(201).json({ message: 'Shelter created', shelter: newShelter });
  } catch (err) {
    res.status(500).json({ message: 'Error creating shelter', error: err.message });
  }
};

// Function to get all shelters
const getAllShelters = async (req, res) => {
  try {
    const shelters = await Shelter.find();
    res.status(200).json(shelters);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching shelters', error: err.message });
  }
};

// Make sure to export the functions
module.exports = { createShelter, getAllShelters };
