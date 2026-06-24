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