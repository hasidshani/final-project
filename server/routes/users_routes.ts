import express from 'express';

import {
    registerUser,
    loginUser,
    logout,
    refresh,
    getMe,
    addFavorite,
    removeFavorite,
    googleSignin
} from '../controllers/userController';

import { authMiddleware } from '../middleware/authMiddleware';
import { authLimiter } from '../middleware/rateLimiter';
import validate from '../middleware/validate';
import { registerSchema, loginSchema } from '../validation/userValidation';

const router = express.Router();

// Get current logged-in user
router.get('/me', authMiddleware, getMe);

// Register user
router.post('/register', authLimiter, validate(registerSchema), registerUser);

// Login user
router.post('/login', authLimiter, validate(loginSchema), loginUser);

// Logout user
router.post('/logout', logout);

// Refresh token
router.post('/refresh', refresh);

// Google Sign-In
router.post('/google', googleSignin);

// Add lesson to favorites
router.post('/favorites/:lessonId', authMiddleware, addFavorite);

// Remove lesson from favorites
router.delete('/favorites/:lessonId', authMiddleware, removeFavorite);

export default router;
