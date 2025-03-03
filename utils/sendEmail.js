const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Set up the email transporter (already configured with environment variables)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// General function to send email
const sendEmail = (to, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
}

// Specific function for verification email
const sendVerificationEmail = (email, token) => {
  const verificationLink = `http://localhost:5000/api/users/verify/${token}`;
  
  const emailContent = `
    <p>Click the link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>
  `;
  
  return sendEmail(email, 'Please verify your email', emailContent);
};

// Export the functions so they can be used in other parts of the application
module.exports = { sendEmail, sendVerificationEmail };
