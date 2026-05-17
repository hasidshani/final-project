const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Imports your User schema blueprint

// The registration POST route using try/catch
router.post('/register', async (req, res) => {
    try {
        // 1. Create a new User instance using data sent from the browser form
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        // 2. Await saving the user document to MongoDB
        const savedUser = await newUser.save();

        // 3. Send back a 201 Success status if it worked perfectly
        res.status(201).json(savedUser);

    } catch (error) {
        // 4. If anything goes wrong (like a missing field), catch the error and send a 400 Bad Request
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
