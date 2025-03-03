const express = require('express');
const router = express.Router();
const { createPoliceStation, getAllPoliceStations } = require('../controllers/policeStationController');  // Correct import

// Public routes for view
router.get('/', getAllPoliceStations);  // This is for fetching all police stations
router.post('/create', createPoliceStation);  // This is for creating a new police station

module.exports = router;
