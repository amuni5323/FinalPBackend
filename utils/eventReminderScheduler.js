const cron = require('node-cron');
const Event = require('../models/Event');  // Import the Event model
const Booking = require('../models/Booking');  // Import the Booking model
const { sendEmail } = require('./sendEmail');  // Import the sendEmail function

// Schedule a job to check events every day
cron.schedule('0 0 * * *', async () => { // This runs every day at midnight
    const events = await Event.find({ date: { $gte: new Date() } });

    events.forEach(async (event) => {
        const oneDayBefore = new Date(event.date);
        oneDayBefore.setDate(oneDayBefore.getDate() - 1); // Subtract 1 day

        if (new Date() >= oneDayBefore) {
            // Send email reminder to all booked users for the event
            const bookings = await Booking.find({ eventId: event._id });
            bookings.forEach(async (booking) => {
                await sendReminderEmail(booking.email, event);
            });
        }
    });
});

// Function to send a reminder email
const sendReminderEmail = async (email, event) => {
    const emailContent = `
        <h1>Event Reminder</h1>
        <p>Hi there,</p>
        <p>This is a reminder that the event "${event.name}" is happening tomorrow.</p>
        <p>Event Date: ${event.date}</p>
        <p>We look forward to seeing you!</p>
    `;
    await sendEmail(email, "Event Reminder", emailContent);
};

// Schedule a job to send reminders 1 hour before the event
cron.schedule('0 * * * *', async () => { // This runs every hour
    const events = await Event.find({ date: { $gte: new Date() } });

    events.forEach(async (event) => {
        const oneHourBefore = new Date(event.date);
        oneHourBefore.setHours(oneHourBefore.getHours() - 1); // Subtract 1 hour

        if (new Date() >= oneHourBefore && new Date() < event.date) {
            // Send email to all users who have booked the event
            const bookings = await Booking.find({ eventId: event._id });
            bookings.forEach(async (booking) => {
                await sendOneHourReminderEmail(booking.email, event);
            });
        }
    });
});

// Function to send one-hour-before reminder email
const sendOneHourReminderEmail = async (email, event) => {
    const emailContent = `
        <h1>Event Starting Soon!</h1>
        <p>Hi there,</p>
        <p>This is a reminder that the event "${event.name}" is starting in one hour!</p>
        <p>Event Date: ${event.date}</p>
        <p>Get ready!</p>
    `;
    await sendEmail(email, "Event Starting Soon", emailContent);
};
