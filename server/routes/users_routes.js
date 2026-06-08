const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    addFavorite,
    removeFavorite
} = require('../controllers/userController');

// Register new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Add lesson to favorites
router.post('/favorites/:lessonId', addFavorite);

// Remove lesson from favorites
router.delete('/favorites/:lessonId', removeFavorite);

module.exports = router;