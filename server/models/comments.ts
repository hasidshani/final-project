import mongoose, { Document, Schema } from 'mongoose';
// Comment document interface
export interface IComment extends Document {

    // Related lesson
    lesson: mongoose.Types.ObjectId;

    // Comment author
    user: mongoose.Types.ObjectId;

    // Comment text
    text: string;
}
// Comment schema
const commentSchema = new Schema<IComment>({

    // The lesson this comment belongs to
    lesson: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    // The user who wrote the comment
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
// Comment model
const Comment = mongoose.model<IComment>(
    'Comment',
    commentSchema
);
export default Comment;