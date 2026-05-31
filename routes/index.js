const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'pages', 'home_page.html'));
});

module.exports = router;