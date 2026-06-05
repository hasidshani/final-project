const dotenv = require("dotenv").config()
const port = process.env.PORT


const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', error => { console.error(error) });
db.once('open', () => console.log('connected to mongo'));


/*
###

GET http://localhost:3000/users => home_page.htmlד
*/

