const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController'); // Ensure the correct path

// POST route to create a new emergency
router.post('/', emergencyController.createEmergency); // This will create a new emergency

// GET route to retrieve all emergencies
router.get('/', emergencyController.getAllEmergencies); // This will get all emergencies

module.exports = router;
