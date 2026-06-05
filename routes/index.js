const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'pages', 'home_page.html'));
});

module.exports = router;

const express = require('express');
const router = express.Router();
const path = require('path');

// ─── PAGE ROUTES ───────────────────────────────
// Each URL shows the matching HTML page

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/src/pages/home_page.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/src/pages/login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/src/pages/register.html'));
});

router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/src/pages/dashboard.html'));
});

router.get('/all-lessons', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/src/pages/all_lessons.html'));
});

router.get('/lesson', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/src/pages/single_lesson.html'));
});

router.get('/create-lesson', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/src/pages/create_lesson.html'));
});

router.get('/teacher', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/src/pages/teacher_profile.html'));
});

// ─── 404 — must be LAST ────────────────────────
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/src/pages/404.html'));
});

module.exports = router;