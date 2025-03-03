const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Register user
router.post('/register', userController.registerUser);
router.get('/verify/:token', userController.verifyEmail);
// Login user
router.post('/login', userController.loginUser);

// Update profile (Authenticated)
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;
