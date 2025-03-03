const express = require('express');
const router = express.Router();

// Correctly import the controller function
const { createShelter, getAllShelters } = require('../controllers/shelterController');

// Ensure the functions are attached to the correct routes
router.post('/create', createShelter);  // POST route to create shelter
router.get('/', getAllShelters);  // GET route to get shelters

module.exports = router;
