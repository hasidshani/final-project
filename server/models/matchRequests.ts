import mongoose, { Document, Schema } from 'mongoose';

// MatchRequest document interface
export interface IMatchRequest extends Document {

    // User who sent the request
    from: mongoose.Types.ObjectId;

    // User who received the request
    to: mongoose.Types.ObjectId;

    // The shared lesson that justifies the request
    lesson: mongoose.Types.ObjectId;

    // Optional short note from the requester
    note: string;

    // Request status
    status: 'pending' | 'accepted' | 'declined';
}

// MatchRequest schema
const matchRequestSchema = new Schema<IMatchRequest>({

    // User who sent the request
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // User who received the request
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // The shared lesson that justifies the request
    lesson: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },

    // Optional short note from the requester
    note: {
        type: String,
        default: '',
        maxlength: 200,
        trim: true
    },

    // Request status
    status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    }

}, {

    // Automatically creates createdAt and updatedAt
    timestamps: true

});

// MatchRequest model
const MatchRequest = mongoose.model<IMatchRequest>(
    'MatchRequest',
    matchRequestSchema
);

export default MatchRequest;
