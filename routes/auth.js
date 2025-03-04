const express = require('express');
const { verifyEmail } = require('../controllers/authController'); // Ensure path is correct

const router = express.Router();

// Email verification route
router.get('/verify-email/:token', verifyEmail);

module.exports = router;
