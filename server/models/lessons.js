const mongoose = require('mongoose');

// Schema for lessons created by users
const lessonSchema = new mongoose.Schema({

    // Lesson title
    title: {
        type: String,
        required: true,
        trim: true
    },

    // Lesson description
    description: {
        type: String,
        required: true
    },

    // Lesson category
    category: {
    type: String,
    required: true,
    enum: [
        "חסידות",
        "מוסר",
        "הלכה",
        "משנה",
        "גמרא",
        "פרשת שבוע"
    ]
},

    // City where the lesson takes place
    city: {
        type: String,
        required: true,
        enum: [
            "נתניה",
            "פרדס חנה"
        ]
    },

    // Date of the lesson
    date: {
        type: Date,
        required: true
    },

    // Lesson start time
    time: {
        type: String,
        required: true
    },

    // Lesson image path or URL
    image: {
        type: String,
        default: ""
    },

    // User who created the lesson
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Users who joined the lesson
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    // Maximum number of participants allowed
    maxParticipants: {
        type: Number,
        default: 50
},

    // Average lesson rating
    rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
}

}, {
    // Automatically creates createdAt and updatedAt
    timestamps: true
});

module.exports = mongoose.model("Lesson", lessonSchema);