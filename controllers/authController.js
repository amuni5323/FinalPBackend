const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/sendEmail'); // Ensure this is imported

const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        // Step 1: Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(400).json({ message: 'Invalid verification link.' });
        }

        // Step 2: Check if the user is already verified
        if (user.isVerified) {
            return res.send(`
                <html>
                <head>
                    <meta http-equiv="refresh" content="5;url=https://final-p-frontend-vkim.vercel.app/login" />
                    <title>Email Already Verified</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                        .message { color: orange; font-size: 18px; }
                    </style>
                </head>
                <body>
                    <h2 class="message">⚠️ Your email is already verified!</h2>
                    <p>Go to <a href="https://final-p-frontend-vkim.vercel.app/login">Login Page</a>.</p>
                </body>
                </html>
            `);
        }

        // Step 3: Check if the token has expired (1-hour expiration limit)
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp < now) {
            // If expired, send a new verification email
            const verificationUrl = `https://final-p-frontend-vkim.vercel.app/login`; // You can customize this URL
            sendVerificationEmail(user.email, verificationUrl);

            return res.send(`
                <html>
                <head>
                    <title>Verification Link Expired</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                        .message { color: red; font-size: 18px; }
                    </style>
                </head>
                <body>
                    <h2 class="message">❌ Verification link has expired!</h2>
                    <p>Please check your email for a new verification link.</p>
                </body>
                </html>
            `);
        }

        // Step 4: If the token is valid and not expired, verify the user
        user.isVerified = true;
        await user.save();

        res.send(`
            <html>
            <head>
                <meta http-equiv="refresh" content="5;url=https://final-p-frontend-vkim.vercel.app/login" />
                <title>Email Verified</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                    .message { color: green; font-size: 18px; }
                </style>
            </head>
            <body>
                <h2 class="message">✅ Email Verified Successfully!</h2>
                <p>You will be redirected to the login page in 5 seconds...</p>
                <p>If not redirected, <a href="https://final-p-frontend-vkim.vercel.app/login">click here</a>.</p>
            </body>
            </html>
        `);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    verifyEmail,
};
