const express = require('express');
const router = express.Router();

const {
    createComment,
    getCommentsByLesson,
    deleteComment
} = require('../controllers/commentController');

// Create comment
router.post('/', createComment);

// Get comments of lesson
router.get('/lesson/:lessonId', getCommentsByLesson);

// Delete comment
router.delete('/:id', deleteComment);

module.exports = router;