import express from 'express';

import {
    registerUser,
    loginUser,
    logout,
    refresh,
    addFavorite,
    removeFavorite
} from '../controllers/userController';

import {
    authMiddleware
} from '../middleware/authMiddleware';
const router = express.Router();

// Register user
router.post(
    '/register',
    registerUser
);

// Login user
router.post(
    '/login',
    loginUser
);

// Logout user
router.post(
    '/logout',
    logout
);

// Refresh token
router.post(
    '/refresh',
    refresh
);

// Add lesson to favorites
router.post(
    '/favorites/:lessonId',
    authMiddleware,
    addFavorite
);

// Remove lesson from favorites
router.delete(
    '/favorites/:lessonId',
    authMiddleware,
    removeFavorite
);

export default router;





