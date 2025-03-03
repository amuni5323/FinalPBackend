const Hospital = require('../models/Hospital');

// Admin only - Create new Hospital
const createHospital = async (req, res) => {
    try {
        const { name, location, type, contactNumber, description, image } = req.body;

        const newHospital = new Hospital({
            name, location, type, contactNumber, description, image
        });

        await newHospital.save();
        res.status(201).json({ message: 'Hospital added successfully!', hospital: newHospital });
    } catch (error) {
        res.status(500).json({ message: 'Error adding hospital', error });
    }
};

// backend/controllers/hospitalController.js
const getHospitals = (req, res) => {
    // Fetch hospitals (you can replace this with actual database fetching logic)
    res.json({ message: "List of hospitals" });
  };
  


// User can search for Hospitals
const searchHospitals = async (req, res) => {
    try {
        const { name, location, type } = req.query;
        let filter = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        if (type) {
            filter.type = { $regex: type, $options: 'i' };
        }

        const hospitals = await Hospital.find(filter);
        res.status(200).json(hospitals);
    } catch (error) {
        res.status(500).json({ message: 'Error searching hospitals', error });
    }
};

module.exports = { createHospital, getHospitals,searchHospitals };
