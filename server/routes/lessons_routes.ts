import express from 'express';

import {
    createLesson,
    getAllLessons,
    getLessonById,
    joinLesson,
    leaveLesson,
    updateLesson,
    deleteLesson,
    rateLesson
} from '../controllers/lessonController';

import { authMiddleware, optionalAuth } from '../middleware/authMiddleware';
import validate from '../middleware/validate';
import { createLessonSchema } from '../validation/lessonValidation';

const router = express.Router();

// Create lesson — protected + validated (image arrives as URL string in JSON body)
router.post('/', authMiddleware, validate(createLessonSchema), createLesson);

// Get all lessons — public
router.get('/', getAllLessons);

// Get lesson by id — public, but optionally authenticated: logged-in users
// see participant names, anonymous visitors only see the count
router.get('/:id', optionalAuth, getLessonById);

// Join lesson — protected
router.post('/:id/join', authMiddleware, joinLesson);

// Leave lesson — protected (cancel registration)
router.delete('/:id/join', authMiddleware, leaveLesson);

// Rate lesson — protected (participants only, after lesson date)
router.post('/:id/rate', authMiddleware, rateLesson);

// Update lesson — protected + validated (creator only, checked in controller)
router.patch('/:id', authMiddleware, validate(createLessonSchema), updateLesson);

// Delete lesson — protected
router.delete('/:id', authMiddleware, deleteLesson);

export default router;
