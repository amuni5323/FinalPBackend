const { createFeedback, getAllFeedback } = require('../controllers/feedbackController');
const express = require('express');
const router = express.Router();

router.post('/', createFeedback);
router.get('/', getAllFeedback);

module.exports = router;
