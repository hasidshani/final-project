import express from 'express';

import {
    createLesson,
    getAllLessons,
    getLessonById,
    joinLesson,
    deleteLesson
} from '../controllers/lessonController';

import { authMiddleware } from '../middleware/authMiddleware';
import validate from '../middleware/validate';
import { createLessonSchema } from '../validation/lessonValidation';

const router = express.Router();

// Create lesson — protected + validated
router.post('/', authMiddleware, validate(createLessonSchema), createLesson);

// Get all lessons — public
router.get('/', getAllLessons);

// Get lesson by id — public
router.get('/:id', getLessonById);

// Join lesson — protected
router.post('/:id/join', authMiddleware, joinLesson);

// Delete lesson — protected
router.delete('/:id', authMiddleware, deleteLesson);

export default router;
