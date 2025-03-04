const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/sendEmail'); // Optional for future use

const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification link.' });
        }

        user.isVerified = true;
        await user.save();

        // Corrected the sendVerificationEmail usage to match expected parameters
        const verificationUrl = `https://final-p-frontend-vkim.vercel.app/login`; // Use the actual URL you want to redirect the user to

        sendVerificationEmail(user.email, verificationUrl); // Pass user email and the verification URL

        res.send(`
            <html>
            <head>
                <meta http-equiv="refresh" content="5;url=${verificationUrl}" />
                <title>Email Verified</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                    .message { color: green; font-size: 18px; }
                </style>
            </head>
            <body>
                <h2 class="message">✅ Email Verified Successfully!</h2>
                <p>You will be redirected to the login page in 5 seconds...</p>
                <p>If not redirected, <a href="${verificationUrl}">click here</a>.</p>
            </body>
            </html>
        `);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    verifyEmail,
};
