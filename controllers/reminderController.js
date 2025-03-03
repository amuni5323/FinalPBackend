const { sendEmail, sendVerificationEmail } = require('../utils/sendEmail');  // Import the sendEmail function

// Function for sending a reminder 1 day before the event
const sendEventReminder = async (email, event) => {
  const emailContent = `
    <h1>Event Reminder</h1>
    <p>Hi there,</p>
    <p>This is a reminder that the event "${event.name}" is happening tomorrow.</p>
    <p>Event Date: ${event.date}</p>
    <p>We look forward to seeing you!</p>
  `;
  
  await sendEmail(email, 'Event Reminder', emailContent);
};

// Function for sending a reminder 1 hour before the event
const sendOneHourReminder = async (email, event) => {
  const emailContent = `
    <h1>Event Starting Soon!</h1>
    <p>This is a reminder that the event "${event.name}" is starting in 1 hour!</p>
    <p>Event Date: ${event.date}</p>
    <p>Get ready!</p>
  `;
  
  await sendEmail(email, 'Event Starting Soon', emailContent);
};

// Export the functions for use in other parts of the app
module.exports = {
  sendEventReminder,
  sendOneHourReminder,
};
