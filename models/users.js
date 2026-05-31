import mongoose from 'mongoose';
const mongoose = require('mongoose');
//create a schema (a template rulebook) for how i want the users to be stored in the database
const userSchema = new mongoose.Schema({
    name: { 
        type: String,     // Rule: The name MUST be text characters
        required: true    // Rule: You cannot leave this blank!
    },
    email: { 
        type: String,     // Rule: Must be text characters
        required: true,   // Rule: You cannot leave this blank!
        unique: true      // Rule: Two users cannot sign up with the exact same email address!
    },
    password: { 
        type: String,     // Rule: Must be text characters
        required: true    // Rule: You cannot leave this blank!
    },
    phone: {
        type: String,     // Rule: Must be text characters
        required: true    // Rule: You cannot leave this blank!
    }
});

// 2. You build the active tool (Model) out of that template rulebook
module.exports = mongoose.model('User', userSchema);

