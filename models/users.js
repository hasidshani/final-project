const mongoose = require('mongoose');

// Schema for application users
const userSchema = new mongoose.Schema({

    // User full name
    name: {
        type: String,
        required: true
    },

    // User email address
    // Must be unique for every user
    email: {
        type: String,
        required: true,
        unique: true
    },

    // User password
    password: {
        type: String,
        required: true
    },

    // Optional phone number
    phone: {
        type: String
    }

});

// Create a model based on the schema
// This model will interact with the "users" collection
module.exports = mongoose.model('User', userSchema);


