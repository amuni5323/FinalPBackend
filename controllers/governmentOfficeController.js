// controllers/governmentOfficeController.js
const GovernmentOffice = require('../models/GovernmentOffice'); // Mongoose model import

// Create Government Office (Admin POST)
const createGovernmentOffice = async (req, res) => {
    try {
        const { name, location, contact, email } = req.body;  // Capture the body data
        const newOffice = new GovernmentOffice({
            name,
            location,
            contact,
            email
        });

        await newOffice.save();  // Save the new office to MongoDB

        res.status(201).json({
            message: 'Government office created successfully',
            data: newOffice
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating government office', error: err.message });
    }
};

// Get All Government Offices (User GET)
const getAllGovernmentOffices = async (req, res) => {
    try {
        const searchQuery = req.query.search || '';  // Get the search query if any

        const offices = await GovernmentOffice.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { location: { $regex: searchQuery, $options: 'i' } }
            ]
        });

        if (offices.length === 0) {
            return res.status(404).json({ message: 'No government offices found' });
        }

        res.status(200).json(offices);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching government offices', error: err.message });
    }
};

module.exports = {
    createGovernmentOffice,
    getAllGovernmentOffices
};

