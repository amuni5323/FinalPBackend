// backend/routes/hospitalRoutes.js

const express = require("express");
const router = express.Router();

// Import your controller here
const hospitalController = require("../controllers/hospitalController"); // Adjust the path to your controller

// Define routes
router.get("/", hospitalController.getHospitals);  // Ensure this method is defined in the controller

module.exports = router;
