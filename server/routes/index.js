const express = require('express');
const router = express.Router();
const path = require('path');

// Home Page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pages/home_page.html'));
});

// Login Page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pages/login.html'));
});

// Register Page
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pages/register.html'));
});

// Dashboard Page
router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pages/dashboard.html'));
});

// All Lessons Page
router.get('/all-lessons', (req, res) => {S
    res.sendFile(path.join(__dirname, '../client/pages/all_lessons.html'));
});

// Create Lesson Page
router.get('/create-lesson', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pages/create_lesson.html'));
});

// Single Lesson Page
router.get('/lesson', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pages/single_lesson.html'));
});

// Teacher Profile Page
router.get('/teacher-profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pages/teacher_profile.html'));
});

// 404 Page - MUST BE LAST
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/pages/404.html'));
});

module.exports = router;