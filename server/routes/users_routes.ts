import express from 'express';

import {
    registerUser,
    loginUser,
    logout,
    refresh,
    getMe,
    addFavorite,
    removeFavorite,
    googleSignin,
    updatePhone
} from '../controllers/userController';

import { authMiddleware } from '../middleware/authMiddleware';
import { authLimiter } from '../middleware/rateLimiter';
import validate from '../middleware/validate';
import { registerSchema, loginSchema, updatePhoneSchema } from '../validation/userValidation';

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

// Update logged-in user's phone number
router.patch('/phone', authMiddleware, validate(updatePhoneSchema), updatePhone);

// Add lesson to favorites
router.post('/favorites/:lessonId', authMiddleware, addFavorite);

// Remove lesson from favorites
router.delete('/favorites/:lessonId', authMiddleware, removeFavorite);

export default router;
