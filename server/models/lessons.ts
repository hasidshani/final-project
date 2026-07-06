import mongoose, { Document, Schema } from 'mongoose';

// Lesson document interface
export interface ILesson extends Document {

    // Lesson title
    title: string;

    // Lesson description
    description: string;

    // Lesson category
    category: string;

    // Lesson city
    city: string;

    // Lesson date
    date: Date;

    // Lesson time
    time: string;

    // Lesson image
    image: string;

    // Lesson creator
    creator: mongoose.Types.ObjectId;

    // Lesson participants
    participants: mongoose.Types.ObjectId[];

    // Maximum participants
    maxParticipants: number;

    // Average rating (0-5)
    rating: number;

    // Individual ratings from participants
    ratings: Array<{ user: mongoose.Types.ObjectId; value: number }>;
}

// Lesson schema
const lessonSchema = new Schema<ILesson>({

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
            'חסידות',
            'מוסר',
            'הלכה',
            'משנה',
            'גמרא',
            'פרשת שבוע'
        ]
    },

    // City where the lesson takes place
    city: {
        type: String,
        required: true,
        enum: [
            'נתניה',
            'פרדס חנה'
        ]
    },

    // Lesson date
    date: {
        type: Date,
        required: true
    },

    // Lesson time
    time: {
        type: String,
        required: true
    },

    // Lesson image path
    image: {
        type: String,
        default: ''
    },

    // User who created the lesson
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Users who joined the lesson
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Maximum participants
    maxParticipants: {
        type: Number,
        default: 50
    },

    // Average rating
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    // Individual ratings from participants
    ratings: [{
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        value: { type: Number, required: true, min: 1, max: 5 }
    }]

}, {

    // Automatically creates createdAt and updatedAt
    timestamps: true

});

// Lesson model
const Lesson = mongoose.model<ILesson>(
    'Lesson',
    lessonSchema
);

export default Lesson;