const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
// const { authMiddleware } = require('../middlewares/authMiddleware');

// Book an event (User authenticated)
router.post('/booking', bookController.bookEvent);
router.get('/booking/check', bookController.checkBooking);


module.exports = router;
