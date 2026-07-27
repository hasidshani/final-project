import express from 'express';

import {
    createMatchRequest,
    respondToMatchRequest,
    getMyMatchRequests
} from '../controllers/matchRequestController';

import { authMiddleware } from '../middleware/authMiddleware';
import validate from '../middleware/validate';
import {
    createMatchRequestSchema,
    respondMatchRequestSchema
} from '../validation/matchRequestValidation';

const router = express.Router();

// Get all match requests (sent or received) for the logged-in user
router.get(
    '/me',
    authMiddleware,
    getMyMatchRequests
);

// Send a match request to another participant of a shared lesson
router.post(
    '/:toUserId',
    authMiddleware,
    validate(createMatchRequestSchema),
    createMatchRequest
);

// Accept or decline a match request (recipient only)
router.patch(
    '/:id',
    authMiddleware,
    validate(respondMatchRequestSchema),
    respondToMatchRequest
);

export default router;
