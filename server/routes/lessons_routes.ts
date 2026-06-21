import express from 'express';

import {
    createLesson,
    getAllLessons,
    getLessonById,
    joinLesson,
    deleteLesson
} from '../controllers/lessonController';

import {
    authMiddleware
} from '../middleware/authMiddleware';

const router = express.Router();

// Create lesson
router.post(
    '/',
    authMiddleware,
    createLesson
);

// Get all lessons
router.get(
    '/',
    getAllLessons
);

// Get lesson by id
router.get(
    '/:id',
    getLessonById
);

// Join lesson
router.post(
    '/:id/join',
    authMiddleware,
    joinLesson
);

// Delete lesson
router.delete(
    '/:id',
    authMiddleware,
    deleteLesson
);

export default router;
