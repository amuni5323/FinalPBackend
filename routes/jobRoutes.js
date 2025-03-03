const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authMiddleware, adminAuthMiddleware } = require('../middlewares/authMiddleware');

// Admin routes to create, update, and delete jobs
router.post('/create', adminAuthMiddleware, jobController.createJob);
router.put('/update/:jobId', adminAuthMiddleware, jobController.updateJob);
router.delete('/delete/:jobId', adminAuthMiddleware, jobController.deleteJob);

// User routes to view jobs
router.get('/', jobController.getAllJobs);
router.get('/:jobId', jobController.getJobById);

module.exports = router;
