const HeadOffice = require('../models/HeadOffice');

// Admin only - Create new HeadOffice
const createHeadOffice = async (req, res) => {
    try {
        const { name, location, contactNumber, description, image } = req.body;

        const newHeadOffice = new HeadOffice({
            name, location, contactNumber, description, image
        });

        await newHeadOffice.save();
        res.status(201).json({ message: 'Head Office added successfully!', headOffice: newHeadOffice });
    } catch (error) {
        res.status(500).json({ message: 'Error adding Head Office', error });
    }
};

// User can search for Head Offices
const searchHeadOffices = async (req, res) => {
    try {
        const { name, location } = req.query;
        let filter = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        const headOffices = await HeadOffice.find(filter);
        res.status(200).json(headOffices);
    } catch (error) {
        res.status(500).json({ message: 'Error searching Head Offices', error });
    }
};

// Get all head offices
const getAllHeadOffices = async (req, res) => {
    try {
        const headOffices = await HeadOffice.find();
        res.status(200).json(headOffices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all head offices', error });
    }
};

module.exports = { createHeadOffice, searchHeadOffices, getAllHeadOffices };
