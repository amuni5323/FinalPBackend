const mongoose = require('mongoose');
const QRCode = require('qrcode'); // Import QR code generator
const cloudinary = require('cloudinary').v2; // Import Cloudinary SDK
const { sendEmail } = require('../utils/sendEmail');
const Booking = require('../models/Booking');
const Event = require('../models/Event');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to handle event booking
const bookEvent = async (req, res) => {
    const { fullName, email } = req.body;
    const eventId = req.query.eventId;

    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: 'Invalid event ID' });
    }

    // Validate required fields
    if (!fullName || !email) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Find the event by ID
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Ensure the event date is in the future
        if (new Date(event.date) < Date.now()) {
            return res.status(400).json({ message: 'Event date has already passed' });
        }

        // Check if the user has already booked this event (case-insensitive email check)
        const existingBooking = await Booking.findOne({ email: email.toLowerCase(), eventId });
        if (existingBooking) {
            return res.status(400).json({ message: 'You have already booked this event' });
        }

        // Generate a unique booking code
        const bookingCode = new mongoose.Types.ObjectId().toString();

        // Create and save the new booking
        const newBooking = new Booking({
            fullName,
            email: email.toLowerCase(),
            eventId,
            bookingCode,
        });

        await newBooking.save();

        // Send booking confirmation email with QR code
        await sendBookingEmail(fullName, email, event, bookingCode);

        return res.status(201).json({ message: 'Booking successful', booking: newBooking });
    } catch (error) {
        console.error('Booking Error:', error);
        return res.status(500).json({ message: 'Error booking event', error: error.message });
    }
};


// Function to send the booking email with a QR code
const sendBookingEmail = async (fullName, email, event, bookingCode) => {
    try {
        // Generate the QR code image
        const qrCodeImageUrl = await uploadQRCodeToCloudinary(bookingCode);

        // Email content with the QR code and updated design
        const emailContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 10px; text-align: center; max-width: 600px; margin: auto;">
                <h1 style="color: #333;">Booking Confirmation</h1>
                <p style="font-size: 18px; color: #555;">Hello ${fullName},</p>
                <p style="font-size: 16px; color: #777;">Your booking for the event "<strong>${event.title}</strong>" has been confirmed!</p>

                <div style="border: 1px solid #ddd; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); margin-top: 30px;">
                    <h2 style="color: #333;">Event Details</h2>
                    <p><strong style="color: #555;">Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                    <p><strong style="color: #555;">Start Time:</strong> ${event.startTime}</p>
                    <p><strong style="color: #555;">End Time:</strong> ${event.endTime}</p>

                    <h3 style="color: #333; margin-top: 20px;">Your Unique QR Code:</h3>
                    <img src="${qrCodeImageUrl}" alt="QR Code" style="max-width: 300px; margin-top: 10px; border-radius: 5px;">
                </div>

                <p style="font-size: 16px; color: #777; margin-top: 20px;">Thank you for booking!</p>
            </div>
        `;

        // Send the email with the embedded QR code
        await sendEmail(email, 'Event Booking Confirmation', emailContent);
    } catch (error) {
        console.error('Error sending booking email:', error);
    }
};

// Function to upload QR Code to Cloudinary
const uploadQRCodeToCloudinary = async (data) => {
    try {
        // Generate QR code image as Base64 string
        const qrCodeDataURL = await QRCode.toDataURL(data, {
            errorCorrectionLevel: 'H', // High error correction
            width: 300, // Set a proper size for the QR code image
        });

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(qrCodeDataURL, {
            folder: 'qr_codes',
            resource_type: 'image',
        });

        return uploadResponse.secure_url; // Return the Cloudinary URL for the uploaded image
    } catch (error) {
        console.error('Error uploading QR Code to Cloudinary:', error);
        throw new Error('QR Code upload to Cloudinary failed');
    }
};

const checkBooking = async (req, res) => {
    const { eventId, email } = req.query;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: 'Invalid event ID' });
    }

    try {
        const existingBooking = await Booking.findOne({ email, eventId });
        return res.json({ alreadyBooked: !!existingBooking });
    } catch (error) {
        return res.status(500).json({ message: 'Error checking booking', error: error.message });
    }
};


module.exports = { bookEvent, checkBooking  };
