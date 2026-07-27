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
        image = ''
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
                'name email'
            )
            .populate(
                // Phone numbers are intentionally excluded here — this route is
                // public/unauthenticated. Contact info is only ever revealed via
                // an accepted match request (see matchRequestController).
                'participants',
                'name email openToMatch'
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


// Leave lesson (cancel registration)
export const leaveLesson = async (
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

        const isParticipant =
            lesson.participants.some(
                (participant) =>
                    participant.toString() ===
                    userId
            );

        if (!isParticipant) {
            return res.status(400).json({
                success: false,
                message:
                    'You are not registered for this lesson'
            });
        }

        lesson.participants =
            lesson.participants.filter(
                (participant) =>
                    participant.toString() !==
                    userId
            );

        await lesson.save();

        return res.status(200).json({
            success: true,
            message:
                'Registration cancelled successfully'
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


// Rate lesson (participants only, after lesson date has passed)
export const rateLesson = async (
    req: Request,
    res: Response
) => {

    const lessonId = req.params.id;
    const userId   = req.userId as string;
    const { value } = req.body;

    const numValue = Number(value);
    if (!numValue || numValue < 1 || numValue > 5) {
        return res.status(400).json({
            success: false,
            message: 'Rating must be between 1 and 5'
        });
    }

    try {

        const lesson = await Lesson.findById(lessonId);

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: 'Lesson not found'
            });
        }

        // Only allow rating after the lesson date has passed
        if (new Date(lesson.date) > new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot rate a lesson that has not taken place yet'
            });
        }

        // Only participants can rate
        const isParticipant = lesson.participants.some(
            p => p.toString() === userId
        );
        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                message: 'Only participants can rate this lesson'
            });
        }

        // Update existing rating or add new one
        const existingIdx = lesson.ratings.findIndex(
            r => r.user.toString() === userId
        );
        if (existingIdx >= 0) {
            lesson.ratings[existingIdx].value = numValue;
        } else {
            lesson.ratings.push({ user: userId as any, value: numValue });
        }

        // Recompute average
        const avg = lesson.ratings.reduce((sum, r) => sum + r.value, 0) / lesson.ratings.length;
        lesson.rating = Math.round(avg * 10) / 10;

        await lesson.save();

        return res.status(200).json({
            success: true,
            message: 'Rating saved',
            rating: lesson.rating
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        });

    }
};


// Update lesson (creator only)
export const updateLesson = async (
    req: Request,
    res: Response
) => {

    const lessonId =
        req.params.id;

    const userId =
        req.userId as string;

    const {
        title,
        description,
        category,
        city,
        date,
        time,
        image = ''
    } = req.body;

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

        // Only creator can edit lesson
        if (
            lesson.creator.toString() !==
            userId
        ) {
            return res.status(403).json({
                success: false,
                message:
                    'Not authorized to edit this lesson'
            });
        }

        lesson.title = title;
        lesson.description = description;
        lesson.category = category;
        lesson.city = city;
        lesson.date = date;
        lesson.time = time;
        lesson.image = image || '';

        const updatedLesson =
            await lesson.save();

        return res.status(200).json({
            success: true,
            message:
                'Lesson updated successfully',
            lesson:
                updatedLesson
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

