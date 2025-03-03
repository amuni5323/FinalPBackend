const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/register", adminController.register); // Register route
router.post("/login", adminController.login); // Login route

module.exports = router;

// Route to fetch unapproved events
router.get('/unapproved', async (req, res) => {
  try {
    // Adjust your Event model and query accordingly
    const unapprovedEvents = await Event.find({ approved: false }); // Assuming 'approved' is a field
    res.json(unapprovedEvents);
  } catch (err) {
    console.error("Error fetching unapproved events:", err);
    res.status(500).json({ message: 'Error fetching unapproved events', error: err });
  }
});

// Route to fetch approved events
router.get('/approved', async (req, res) => {
  try {
    const approvedEvents = await Event.find({ status: 'approved' }); // Assuming 'status' is the field for approved events
    res.json(approvedEvents);
  } catch (error) {
    console.error("Error fetching approved events:", error);
    res.status(500).json({ message: 'Error fetching approved events', error: error });
  }
});

// Simple logging middleware for debugging
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`); // Logs the method and URL
  next();
});

module.exports = router;
