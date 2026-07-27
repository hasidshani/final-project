import { Request, Response } from 'express';
import MatchRequest from '../models/matchRequests';
import User from '../models/users';
import Lesson from '../models/lessons';

// Create a match request (requester -> target user), scoped to a shared lesson
export const createMatchRequest = async (
    req: Request,
    res: Response
) => {

    const fromId = req.userId as string;
    const toId = req.params.toUserId;
    const { lessonId, note } = req.body;

    if (fromId === toId) {
        return res.status(400).json({
            success: false,
            message: 'לא ניתן לשלוח בקשה לעצמך'
        });
    }

    try {

        const [fromUser, toUser, lesson] = await Promise.all([
            User.findById(fromId),
            User.findById(toId),
            Lesson.findById(lessonId)
        ]);

        if (!fromUser || !toUser) {
            return res.status(404).json({
                success: false,
                message: 'משתמש לא נמצא'
            });
        }

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: 'שיעור לא נמצא'
            });
        }

        if (!fromUser.openToMatch) {
            return res.status(400).json({
                success: false,
                message: 'יש להפעיל קודם את האפשרות \'פתוח/ה להיכרויות\' בלוח הבקרה'
            });
        }

        if (!toUser.openToMatch) {
            return res.status(400).json({
                success: false,
                message: 'המשתמש אינו פתוח להיכרויות כרגע'
            });
        }

        const isSharedLesson =
            lesson.participants.some(p => p.toString() === fromId) &&
            lesson.participants.some(p => p.toString() === toId);

        if (!isSharedLesson) {
            return res.status(400).json({
                success: false,
                message: 'ניתן ליצור קשר רק עם משתתפים בשיעור משותף'
            });
        }

        const existing = await MatchRequest.findOne({
            $or: [
                { from: fromId, to: toId },
                { from: toId, to: fromId }
            ],
            status: { $in: ['pending', 'accepted'] }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: existing.status === 'pending'
                    ? 'כבר קיימת בקשה ממתינה מולך'
                    : 'כבר יצרתם קשר בעבר'
            });
        }

        const newRequest = new MatchRequest({
            from: fromId,
            to: toId,
            lesson: lessonId,
            note: note || ''
        });

        const savedRequest = await newRequest.save();

        return res.status(201).json({
            success: true,
            message: 'הבקשה נשלחה בהצלחה',
            request: savedRequest
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        });

    }
};

// Accept or decline a match request (recipient only)
export const respondToMatchRequest = async (
    req: Request,
    res: Response
) => {

    const requestId = req.params.id;
    const userId = req.userId as string;
    const { status } = req.body;

    try {

        const matchRequest = await MatchRequest.findById(requestId);

        if (!matchRequest) {
            return res.status(404).json({
                success: false,
                message: 'הבקשה לא נמצאה'
            });
        }

        if (matchRequest.to.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'רק הנמען יכול להגיב לבקשה'
            });
        }

        if (matchRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'הבקשה כבר טופלה'
            });
        }

        matchRequest.status = status;
        await matchRequest.save();

        return res.status(200).json({
            success: true,
            message: status === 'accepted' ? 'הקשר אושר' : 'הבקשה נדחתה',
            request: matchRequest
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        });

    }
};

// Get all match requests involving the logged-in user (sent or received).
// Phone numbers are only ever included for requests that were accepted —
// this is the one place either party's phone number is exposed.
export const getMyMatchRequests = async (
    req: Request,
    res: Response
) => {

    const userId = req.userId as string;

    try {

        const matchRequests = await MatchRequest.find({
            $or: [{ from: userId }, { to: userId }]
        })
            .populate('from', 'name phone')
            .populate('to', 'name phone')
            .populate('lesson', 'title')
            .sort({ createdAt: -1 });

        const sanitized = matchRequests.map(r => {
            const plain = r.toObject();
            if (plain.status !== 'accepted') {
                if (plain.from && typeof plain.from === 'object') delete (plain.from as any).phone;
                if (plain.to && typeof plain.to === 'object') delete (plain.to as any).phone;
            }
            return plain;
        });

        return res.status(200).json({
            success: true,
            requests: sanitized
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        });

    }
};
