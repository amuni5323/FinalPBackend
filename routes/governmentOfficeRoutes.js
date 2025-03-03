const express = require('express');
const router = express.Router();
const { createGovernmentOffice, getAllGovernmentOffices } = require('../controllers/governmentOfficeController');

// POST route to create a government office
router.post('/create', async (req, res, next) => {
    try {
        await createGovernmentOffice(req, res);
    } catch (error) {
        next(error);  // Pass errors to the error handler
    }
});

// GET route to fetch all government offices
router.get('/', async (req, res, next) => {
    try {
        await getAllGovernmentOffices(req, res);
    } catch (error) {
        next(error);  // Pass errors to the error handler
    }
});

module.exports = router;
