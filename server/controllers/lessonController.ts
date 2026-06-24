import { Request, Response } from 'express';
import Lesson from '../models/lessons';

// Create new lesson
export const createLesson = async (
    req: Request,
    res: Response
) => {

    const {
        title,
        description,
        category,
        city,
        date,
        time,
        image
    } = req.body;

    const userId =
        req.userId as string;

    // Basic validation
    if (
        !title ||
        !description ||
        !category ||
        !city ||
        !date ||
        !time
    ) {

        return res.status(400).json({
            success: false,
            message:
                'All required fields must be provided'
        });
    }

    try {

        const newLesson =
            new Lesson({

                title,
                description,
                category,
                city,
                date,
                time,

                image:
                    image || '',

                creator:
                    userId

            });

        const savedLesson =
            await newLesson.save();

        return res.status(201).json({
            success: true,
            message:
                'Lesson created successfully',
            lesson:
                savedLesson
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

// Get all lessons
export const getAllLessons = async (
    req: Request,
    res: Response
) => {

    try {

        const lessons =
            await Lesson.find()
                .populate(
                    'creator',
                    'name email'
                )
                .sort({
                    date: 1
                });

        return res.status(200).json({
            success: true,
            lessons
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


// Get single lesson by id
export const getLessonById = async (
    req: Request,
    res: Response
) => {

    const lessonId =
        req.params.id;

    try {

        const lesson =
            await Lesson.findById(
                lessonId
            )
            .populate(
                'creator',
                'name email phone'
            )
            .populate(
                'participants',
                'name email phone'
            );

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message:
                    'Lesson not found'
            });
        }

        return res.status(200).json({
            success: true,
            lesson
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


// Join lesson
export const joinLesson = async (
    req: Request,
    res: Response
) => {

    const lessonId =
        req.params.id;

    const userId =
        req.userId as string;

    try {

        const lesson =
            await Lesson.findById(
                lessonId
            );

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message:
                    'Lesson not found'
            });
        }

        // Check if user already joined
        const alreadyJoined =
            lesson.participants.some(
                (participant) =>
                    participant.toString() ===
                    userId
            );

        if (alreadyJoined) {
            return res.status(400).json({
                success: false,
                message:
                    'User already joined this lesson'
            });
        }

        // Check lesson capacity
        if (
            lesson.participants.length >=
            lesson.maxParticipants
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Lesson is full'
            });
        }

        // Add user to participants
        lesson.participants.push(
            userId as any
        );

        await lesson.save();

        return res.status(200).json({
            success: true,
            message:
                'Joined lesson successfully'
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


// Delete lesson
export const deleteLesson = async (
    req: Request,
    res: Response
) => {

    const lessonId =
        req.params.id;

    const userId =
        req.userId as string;

    try {

        const lesson =
            await Lesson.findById(
                lessonId
            );

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message:
                    'Lesson not found'
            });
        }

        // Only creator can delete lesson
        if (
            lesson.creator.toString() !==
            userId
        ) {
            return res.status(403).json({
                success: false,
                message:
                    'Not authorized to delete this lesson'
            });
        }

        await Lesson.findByIdAndDelete(
            lessonId
        );

        return res.status(200).json({
            success: true,
            message:
                'Lesson deleted successfully'
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

