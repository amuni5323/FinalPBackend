const express = require('express');
const axios = require('axios');
const Court = require('../models/Court'); // Assuming you have a Court model set up
const router = express.Router();

// Middleware (if needed, for authorization)
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Google Maps API key (use an environment variable for security)
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

// Route to search courts
router.get('/courts', async (req, res) => {
    const query = req.query.query;  // Get search query from the URL

    try {
        // Search courts in the database (your local courts)
        const courtsFromDb = await Court.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },  // Case-insensitive search
                { location: { $regex: query, $options: 'i' } },
                { type: { $regex: query, $options: 'i' } }
            ]
        });

        // If the query is present, call Google Maps API to search for external courts
        const googleResponse = await axios.get(
            'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
            {
                params: {
                    location: '9.03,38.74',  // Example location (e.g., Addis Ababa, can be dynamic)
                    radius: 10000,  // Search within 10km
                    type: 'stadium',  // Search for stadium/court-like places
                    keyword: query,  // Use the search query for more accurate results
                    key: apiKey,  // Google Maps API key
                },
            }
        );

        // Merge data
        const courts = {
            local: courtsFromDb,  // Courts from your database
            external: googleResponse.data.results  // Courts from Google Maps
        };

        res.status(200).json(courts);  // Send merged results back to frontend

    } catch (error) {
        console.error('Error fetching courts:', error);
        res.status(500).json({ error: 'Error fetching courts' });
    }
});

module.exports = router;
