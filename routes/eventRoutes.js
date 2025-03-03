// backend/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const  {adminAuthMiddleware, verifyAdmin } = require('../middlewares/adminAuthMiddleware');

// const{ verifyAdmin} = require('../middlewares/adminAuthMiddleware')
// Event routes
router.post('/create', eventController.createEvent);  // Ensure the function exists
router.post('/approve/:id',adminAuthMiddleware,verifyAdmin, eventController.approveEvent);  // Ensure approveEvent function exists
router.delete('/delete/:id',adminAuthMiddleware,verifyAdmin, eventController.deleteEvent);  // Ensure deleteEvent function exists
router.get('/all', eventController.getAllEvents);  // Ensure getAllEvents function exists
router.get('/unapproved', eventController.getUnapprovedEvents);  // Ensure getUnapprovedEvents function exists
// backend/routes/eventRoutes.js
router.get('/approve', eventController.viewEvents);  // Fetch approved events

module.exports = router;
