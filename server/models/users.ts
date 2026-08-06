import mongoose, { Document, Schema } from 'mongoose';

// User document interface
export interface IUser extends Document {
    // User full name
    name: string;
    // User email address
    email: string;
    // User password
    password: string;
    // Optional phone number
    phone?: string;
    // Optional profile picture (Cloudinary secure_url), visible to other users
    profilePicture?: string;
    // Whether the user is open to being introduced to other participants
    // they share a lesson with (drives the match-request feature)
    openToMatch: boolean;
    // Required to enable openToMatch — match requests are only ever offered
    // between opposite genders (see matchRequestController)
    gender?: 'זכר' | 'נקבה';
    // Favorite lessons
    favorites: mongoose.Types.ObjectId[];
    // Active refresh tokens
    refreshTokens: string[];

}

// User schema
const userSchema = new Schema<IUser>({
    // User full name
    name: {
        type: String,
        required: true
    },
    // User email address
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
    },
    // Optional profile picture (Cloudinary secure_url), visible to other users
    profilePicture: {
        type: String,
        default: ''
    },
    // Whether the user is open to being introduced to other participants
    // they share a lesson with (drives the match-request feature)
    openToMatch: {
        type: Boolean,
        default: false
    },
    // Required to enable openToMatch — match requests are only ever offered
    // between opposite genders (see matchRequestController)
    gender: {
        type: String,
        enum: ['זכר', 'נקבה']
    },
    // Lessons marked as favorites by the user
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
     // Active refresh tokens
    refreshTokens: [{
        type: String
    }]

}, {
    // Automatically creates createdAt and updatedAt
    timestamps: true
});

// User model
const User = mongoose.model<IUser>(
    'User',
    userSchema
);

export default User;