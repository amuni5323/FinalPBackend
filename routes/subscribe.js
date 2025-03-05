const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

router.post('/', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Check if email already exists
        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ message: 'Email is already subscribed' });
        }

        // Save to MongoDB
        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        res.status(200).json({ message: 'Subscription successful!' });
    } catch (error) {
        console.error('❌ Error saving to database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
