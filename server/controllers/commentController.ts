import { Request, Response } from 'express';
import Comment from '../models/comments';

// Create new comment
export const createComment = async (
    req: Request,
    res: Response
) => {

    const lessonId =
        req.params.lessonId;

    const userId =
        req.userId as string;

    const { text } = req.body;

    // Validation
    if (!text) {
        return res.status(400).json({
            success: false,
            message: 'Comment text is required'
        });
    }

    try {

        const newComment =
            new Comment({
                lesson: lessonId,
                user: userId,
                text: text
            });

        const savedComment =
            await newComment.save();

        return res.status(201).json({
            success: true,
            message:
                'Comment created successfully',
            comment:
                savedComment
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Unknown error'
        });

    }
};


// Get comments by lesson id
export const getCommentsByLesson = async (
    req: Request,
    res: Response
) => {

    const lessonId =
        req.params.lessonId;

    try {

        const comments =
            await Comment.find({
                lesson: lessonId
            })
            .populate(
                'user',
                'name'
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            comments
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Unknown error'
        });

    }
};

// Delete comment
export const deleteComment = async (
    req: Request,
    res: Response
) => {

    const commentId =
        req.params.id;

    const userId =
        req.userId as string;

    try {

        const comment =
            await Comment.findById(
                commentId
            );

        if (!comment) {
            return res.status(404).json({
                success: false,
                message:
                    'Comment not found'
            });
        }

        // Only comment owner can delete
        if (
            comment.user.toString() !==
            userId
        ) {
            return res.status(403).json({
                success: false,
                message:
                    'Not authorized to delete this comment'
            });
        }

        await Comment.findByIdAndDelete(
            commentId
        );

        return res.status(200).json({
            success: true,
            message:
                'Comment deleted successfully'
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Unknown error'
        });

    }
};


