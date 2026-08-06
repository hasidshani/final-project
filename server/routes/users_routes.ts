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
    updatePhone,
    updateProfile,
    changePassword,
    updateMatchPreference
} from '../controllers/userController';

import { authMiddleware } from '../middleware/authMiddleware';
import { authLimiter } from '../middleware/rateLimiter';
import validate from '../middleware/validate';
import { registerSchema, loginSchema, updatePhoneSchema, updateProfileSchema, changePasswordSchema, updateMatchPreferenceSchema } from '../validation/userValidation';

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

// Update logged-in user's editable profile fields (name, email, phone, profile picture)
router.patch('/profile', authMiddleware, validate(updateProfileSchema), updateProfile);

// Change logged-in user's password
router.patch('/password', authMiddleware, validate(changePasswordSchema), changePassword);

// Update logged-in user's match-request opt-in preference
router.patch('/match-preference', authMiddleware, validate(updateMatchPreferenceSchema), updateMatchPreference);

// Add lesson to favorites
router.post('/favorites/:lessonId', authMiddleware, addFavorite);

// Remove lesson from favorites
router.delete('/favorites/:lessonId', authMiddleware, removeFavorite);

export default router;
