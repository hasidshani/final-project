const express = require('express');
const router = express.Router();
// const Lesson = require('../models/Lesson'); // We will create this model blueprint later!

// The add lesson POST route using try/catch
router.post('/add', async (req, res) => {
    try {
        // 1. Create a new Lesson instance using data sent from your forms
        const newLesson = new Lesson({
            title: req.body.title,
            rabbi: req.body.rabbi,
            category: req.body.category
        });

        // 2. Await saving the lesson document to MongoDB
        const savedLesson = await newLesson.save();

        // 3. Send back a 201 Success status
        res.status(201).json(savedLesson);

    } catch (error) {
        // 4. Catch validation or connection errors
        res.status(400).json({ message: error.message });
    }
});
module.exports = router;