const Event = require('../models/Event');
const User = require('../models/User');
const Admin = require('../models/Admin');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email to admin about the new event
async function sendEmailToAdmin(eventDetails) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'New Event Created – Approval Required',
    text: `A new event has been created and is awaiting approval.
    
    Event Details:
    - Title: ${eventDetails.title}
    - Description: ${eventDetails.description}
    - Date: ${eventDetails.date}
    - Location: ${eventDetails.location}
    
    Please review and approve/reject the event in the admin panel.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Admin approves the event (now with POST method)
const mongoose = require('mongoose');
  // Adjust the path if necessary

  const approveEvent = async (req, res) => {
    const { id } = req.params;  // Get ID from req.params, NOT req.body
    console.log("Event ID received:", id);
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }
  
    try {
      // Find event by ID
      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      // Check if already approved or rejected
      if (event.approved || event.status === 'rejected') {
        return res.status(400).json({ message: "Event is already approved or rejected" });
      }
  
      // Update approval status
      event.approved = true;
      event.status = 'approved'; // Change status to 'approved'
      await event.save();
  
      res.status(200).json({ success: true, message: "Event approved successfully", event });
    } catch (error) {
      console.error("Error approving event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
// Admin deletes the event
const deleteEvent = async (req, res) => {
    const { id } = req.params;  // Get ID from req.params, NOT req.body
    console.log("Event ID received:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
    }

    try {
        // Find event by ID
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if the event is already approved or rejected
        if (event.approved || event.status === 'rejected') {
            return res.status(400).json({ message: "Event is already approved or rejected" });
        }

        // If not approved or rejected, delete the event
        await Event.findByIdAndDelete(id);
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// Fetch all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

// Create an event
const createEvent = async (req, res) => {
  const { title, description, date, startTime, endTime, location, contact, organizerEmail } = req.body;

  if (!title || !description || !date || !startTime || !endTime || !location || !contact || !organizerEmail) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email: organizerEmail }) || await Admin.findOne({ email: organizerEmail });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const newEvent = new Event({
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      contact,
      approved: false,
      createdBy: organizerEmail,
    });

    await newEvent.save();
    await sendEmailToAdmin(newEvent);

    res.status(201).json({ message: 'Event created and awaiting approval', event: newEvent });
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ message: "Failed to save data. Please try again." });
  }
};

// Fetch only approved events
const viewEvents = async (req, res) => {
  try {
    const events = await Event.find({ approved: true });
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching  approved events' });
  }
};

// Admin updates an event
const updateEvent = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json({ message: 'Event updated', event: updatedEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating event' });
  }
};

// Get all unapproved events
const getUnapprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ approved: false });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify Admin Middleware
const verifyAdmin = async (req, res, next) => {
  try {
    // Check if Authorization header is present
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).send({ message: 'No token provided' });
    }

    // Extract the token
    const token = authHeader.replace('Bearer ', '');
    console.log('Token received:', token);

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Fetch user from database
    const user = await User.findById(decoded.userId);
    console.log('User fetched from DB:', user);

    // Check if user exists and has admin role
    if (!user) {
      console.log('User not found in database');
      return res.status(403).send({ message: 'Access denied: User not found' });
    }
    if (user.role !== 'admin') {
      console.log('User is not an admin:', user.email, 'Role:', user.role);
      return res.status(403).send({ message: 'Access denied: Admin access required' });
    }

    req.user = user; // Attach user object to request
    next();
  } catch (error) {
    console.error('Error in verifyAdmin middleware:', error);
    res.status(401).send({ message: 'Invalid token' });
  }
};

module.exports = { 
  createEvent, 
  approveEvent, 
  deleteEvent, 
  viewEvents, 
  updateEvent, 
  getAllEvents, 
  getUnapprovedEvents,
  verifyAdmin
};
