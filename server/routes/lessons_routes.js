const express = require('express');
const router = express.Router();

const {
    createLesson,
    getAllLessons,
    getLessonById,
    joinLesson,
    deleteLesson
} = require('../controllers/lessonController');

// Create lesson
router.post('/', createLesson);

// Get all lessons
router.get('/', getAllLessons);

// Get lesson by id
router.get('/:id', getLessonById);

// Join lesson
router.post('/:id/join', joinLesson);

// Delete lesson
router.delete('/:id', deleteLesson);

module.exports = router;