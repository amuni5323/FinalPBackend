const Job = require('../models/Job');

// Create a new job listing (Admin)
const createJob = async (req, res) => {
  try {
    const { title, description, location, salary, company } = req.body;

    const newJob = new Job({
      title,
      description,
      location,
      salary,
      company,
      requirements,
      postedBy: req.userId,  // Admin creating the job listing
    });

    await newJob.save();
    res.status(201).json({ message: 'Job listing created successfully', job: newJob });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all job listings
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching jobs', error: err.message });
  }
};

// Get a job by ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching job', error: err.message });
  }
};

// Update a job listing (Admin)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.title = req.body.title || job.title;
    job.description = req.body.description || job.description;
    job.location = req.body.location || job.location;
    job.salary = req.body.salary || job.salary;
    job.company = req.body.company || job.company;

    await job.save();
    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (err) {
    res.status(500).json({ message: 'Error updating job', error: err.message });
  }
};

// Delete a job listing (Admin)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting job', error: err.message });
  }
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob };
