import {
    Request,
    Response,
    NextFunction
} from 'express';

import jwt from 'jsonwebtoken';

// JWT payload
type TokenPayload = {
    userId: string;
};

// Authentication middleware
export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const authHeader =
        req.headers['authorization'];

    const token =
        authHeader &&
        authHeader.split(' ')[1];

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Missing token'
        });
    }

    // Check configuration
    if (!process.env.TOKEN_SECRET) {
        return res.status(400).json({
            success: false,
            message: 'Missing auth configuration'
        });
    }

    jwt.verify(
        token,
        process.env.TOKEN_SECRET,
        (err, data) => {

            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid token'
                });
            }

            const payload =
                data as TokenPayload;

            req.userId =
                payload.userId;

            next();
        }
    );
};

// Optional authentication — for public routes that reveal extra data to
// logged-in users. Sets req.userId when a valid token is present, but never
// rejects the request (missing/invalid token just means "anonymous").
export const optionalAuth = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {

    const authHeader =
        req.headers['authorization'];

    const token =
        authHeader &&
        authHeader.split(' ')[1];

    if (!token || !process.env.TOKEN_SECRET) {
        return next();
    }

    jwt.verify(
        token,
        process.env.TOKEN_SECRET,
        (err, data) => {

            if (!err && data) {
                req.userId =
                    (data as TokenPayload).userId;
            }

            next();
        }
    );
};