const Court = require('../models/Court');

// Create a new court listing (Admin only)
const createCourt = async (req, res) => {
  try {
    const { name, location, contact, description } = req.body;

    const newCourt = new Court({
      name,
      location,
      contact,
      description,
      createdBy: req.user.id,
    });

    await newCourt.save();
    res.status(201).json({ message: 'Court created successfully', court: newCourt });
  } catch (err) {
    res.status(500).json({ message: 'Error creating court', error: err.message });
  }
};

// Get all courts (Everyone can view)
const getAllCourts = async (req, res) => {
  try {
    const courts = await Court.find();
    res.status(200).json(courts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courts', error: err.message });
  }
};

// Get a court by ID (Everyone can view)
const getCourtById = async (req, res) => {
  try {
    const court = await Court.findById(req.params.courtId);

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    res.status(200).json(court);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching court', error: err.message });
  }
};

// Update a court listing (Admin only)
const updateCourt = async (req, res) => {
  try {
    const court = await Court.findById(req.params.courtId);

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    court.name = req.body.name || court.name;
    court.location = req.body.location || court.location;
    court.contact = req.body.contact || court.contact;
    court.description = req.body.description || court.description;

    await court.save();
    res.status(200).json({ message: 'Court updated successfully', court });
  } catch (err) {
    res.status(500).json({ message: 'Error updating court', error: err.message });
  }
};

// Delete a court listing (Admin only)
const deleteCourt = async (req, res) => {
  try {
    const court = await Court.findByIdAndDelete(req.params.courtId);

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    res.status(200).json({ message: 'Court deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting court', error: err.message });
  }
};

module.exports = { createCourt, getAllCourts, getCourtById, updateCourt, deleteCourt };
