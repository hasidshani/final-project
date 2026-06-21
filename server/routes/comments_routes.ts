import express from 'express';

import {
    createComment,
    getCommentsByLesson,
    deleteComment
} from '../controllers/commentController';

import {
    authMiddleware
} from '../middleware/authMiddleware';

const router = express.Router();

// Create comment
router.post(
    '/:lessonId',
    authMiddleware,
    createComment
);

// Get comments of lesson
router.get(
    '/lesson/:lessonId',
    getCommentsByLesson
);

// Delete comment
router.delete(
    '/:id',
    authMiddleware,
    deleteComment
);

export default router;


