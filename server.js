const express = require('express'); // Import Express framework
const path = require('path'); // Built-in Node.js module for handling file paths
const app = express();
// 1. Serve all your HTML and CSS files automatically from the project folder
app.use(express.static(__dirname)); 
// 2. Default route to open your home_page.html when visiting http://localhost:3000
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'pages', 'home_page.html'));
});



/*
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); 
require('dotenv').config();
const app = express();
/*
const app = require('./app'); // Import the configured app from app.js
require('dotenv').config(); // Load environment variables from .env
*/

//listening on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running remotely and listening on port http://localhost:${PORT}`);
});

