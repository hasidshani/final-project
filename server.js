const express = require('express'); // Import Express framework
require('./app');
const path = require('path'); // Built-in Node.js module for handling file paths
const app = express();
// 1. Serve all your HTML and CSS files automatically from the project folder
app.use(express.static(__dirname)); 
// 2. Default route to open your home_page.html when visiting http://localhost:3000
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'pages', 'home_page.html'));
});
//listening on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running remotely and listening on port http://localhost:${PORT}`);
});



