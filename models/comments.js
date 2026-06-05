const mongoose = require('mongoose');

// Schema for lesson comments
const commentSchema = new mongoose.Schema({

    // The lesson this comment belongs to
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
        required: true
    },

    // The user who wrote the comment
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Comment content
    text: {
        type: String,
        required: true,
        trim: true
    }

}, {

    // Automatically creates createdAt and updatedAt
    timestamps: true

});

module.exports = mongoose.model("Comment", commentSchema);