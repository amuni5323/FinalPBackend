const PoliceStation = require('../models/PoliceStation');

// Create a new police station
const createPoliceStation = async (req, res) => {
  try {
    const { name, location, contact, description } = req.body;

    const newPoliceStation = new PoliceStation({
      name,
      location,
      contact,
      description,
      // createdBy: req.user.id,
    });

    await newPoliceStation.save();
    res.status(201).json({ message: 'Police station created', policeStation: newPoliceStation });
  } catch (err) {
    res.status(500).json({ message: 'Error creating police station', error: err.message });
  }
};

// Get all police stations
const getAllPoliceStations = async (req, res) => {
  try {
    const policeStations = await PoliceStation.find();
    res.status(200).json(policeStations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching police stations', error: err.message });
  }
};

// ✅ Make sure to export functions correctly
module.exports = { createPoliceStation, getAllPoliceStations };
