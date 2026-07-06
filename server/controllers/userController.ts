import {
    Request,
    Response,
    NextFunction
} from 'express';
import User from '../models/users';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client();

// JWT payload type
type TokenPayload = {
    userId: string;
};

// Register new user
export const registerUser = async (
    req: Request,
    res: Response
) => {
    // Extract data sent from the registration form
    const { name, email, password, phone } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Name, email and password are required'
        });
    }
    try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({
            email: email
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }
        // Generate a salt for password hashing
        const salt = await bcrypt.genSalt(10);

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );
        // Create a new user document
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            phone: phone
        });
        // Save the user in MongoDB
        const savedUser = await newUser.save();

        // Send success response - 201 Created
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                _id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        });
    } catch (error) {

        // Handle unexpected errors
        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Unknown error'
        });
    }
};

// Generate access token and refresh token
const generateTokens = (
    userId: string
): {
    accessToken: string;
    refreshToken: string;
} | null => {
    const random = Math.floor(
        Math.random() * 1000000
    );
    if (!process.env.TOKEN_SECRET) {
    return null;
}
    const accessToken = jwt.sign(
        {
            userId: userId,
            random: random
        },
        process.env.TOKEN_SECRET as string,
        {
            expiresIn:
             process.env.TOKEN_EXPIRATION as jwt.SignOptions['expiresIn']
        }
    );

    const refreshToken = jwt.sign(
        {
            userId: userId,
            random: random
        },
        process.env.TOKEN_SECRET as string,
        {
            expiresIn:
               process.env.REFRESH_TOKEN_EXPIRATION as jwt.SignOptions['expiresIn']
        }
    );

    return {
        accessToken,
        refreshToken
    };
};



// Login existing user
export const loginUser = async (
    req: Request,
    res: Response
) => {
    // Extract login data from request body
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required'
        });
    }
    try {

        // Find user by email
        const user = await User.findOne({
            email: email
        });

        // Check if user exists
        if (!user) {
            return res.status(400).json({
                message: 'Wrong email or password'
            });
        }
        // Compare entered password with stored hashed password
        const validPassword = await bcrypt.compare(
            password,
            user.password
        );
        // Check if password is correct
        if (!validPassword) {
            return res.status(400).json({
                message: 'Wrong email or password'
            });
        }
        // Generate access token and refresh token
        const tokens = generateTokens(
            user._id.toString()
        );

        if (!tokens) {
            return res.status(400).json({
                success: false,
                message: 'Missing auth configuration'
            });
        }

        if (!user.refreshTokens) {
            user.refreshTokens = [];
        }

        user.refreshTokens.push(
            tokens.refreshToken
        );
        await user.save();
        // Send success response
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken:
            tokens.accessToken,
            refreshToken:
            tokens.refreshToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                favorites: user.favorites
            }
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


// Logout user
export const logout = async (
    req: Request,
    res: Response
) => {

    const refreshToken = req.body.refreshToken;

    // Validate input
    if (!refreshToken) {
        return res.status(400).json({
            success: false,
            message: 'Missing refresh token'
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
        refreshToken,
        process.env.TOKEN_SECRET,
        async (
            err: any,
            data: any
        ) => {

            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid token'
                });
            }

            const payload =
                data as TokenPayload;

            try {

                // Find user by token payload
                const user =
                    await User.findOne({
                        _id: payload.userId
                    });

                // User not found
                if (!user) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid token'
                    });
                }

                // Check token exists in user
                if (
                    !user.refreshTokens ||
                    !user.refreshTokens.includes(
                        refreshToken
                    )
                ) {

                    user.refreshTokens = [];

                    await user.save();

                    return res.status(400).json({
                        success: false,
                        message: 'Invalid token'
                    });
                }

                // Remove current refresh token
                user.refreshTokens =
                    user.refreshTokens.filter(
                        (token) =>
                            token !== refreshToken
                    );

                await user.save();

                return res.status(200).json({
                    success: true,
                    message: 'Logged out successfully'
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
        }
    );
};

// Refresh access token
export const refresh = async (
    req: Request,
    res: Response
) => {

    // First validate the refresh token
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({
            success: false,
            message: 'Invalid token'
        });
    }

    if (!process.env.TOKEN_SECRET) {
        return res.status(400).json({
            success: false,
            message: 'Missing auth configuration'
        });
    }

    jwt.verify(
        refreshToken,
        process.env.TOKEN_SECRET,
        async (
            err: any,
            data: any
        ) => {

            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid token'
                });
            }

            // Find the user
            const payload =
                data as TokenPayload;

            try {

                const user =
                    await User.findOne({
                        _id: payload.userId
                    });

                if (!user) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid token'
                    });
                }

                // Check that the token exists in the user
                if (
                    !user.refreshTokens ||
                    !user.refreshTokens.includes(
                        refreshToken
                    )
                ) {

                    user.refreshTokens = [];

                    await user.save();

                    return res.status(400).json({
                        success: false,
                        message: 'Invalid token'
                    });
                }

                // Generate new tokens
                const newTokens =
                    generateTokens(
                        user._id.toString()
                    );
                if (!newTokens) {
                    user.refreshTokens = [];
                    await user.save();
                    return res.status(400).json({
                    success: false,
                    message: 'Missing auth configuration'
                });
                 }
                // Delete the old refresh token
                user.refreshTokens =
                    user.refreshTokens.filter(
                        (token) =>
                            token !== refreshToken
                    );

                // Save the new refresh token
                user.refreshTokens.push(
                    newTokens.refreshToken
                );

                await user.save();

                // Return the new access token and refresh token
                return res.status(200).json({
                    success: true,
                    accessToken:
                        newTokens.accessToken,
                    refreshToken:
                        newTokens.refreshToken
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
        }
    );
};


// Get currently logged-in user (for session restore on page refresh)
export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = req.userId as string;
        const user = await User.findById(userId).select('-password -refreshTokens');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Add lesson to favorites
export const addFavorite = async (
    req: Request,
    res: Response
) => {

    const userId =
        req.userId as string;

    const lessonId =
        req.params.lessonId;

    try {

        const user =
            await User.findById(
                userId
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent duplicates
        if (
            user.favorites.includes(
                lessonId as any
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Lesson already in favorites'
            });
        }

        user.favorites.push(
            lessonId as any
        );

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                'Lesson added to favorites'
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

// Google Sign-In
export const googleSignin = async (req: Request, res: Response) => {
    const credential = req.body.credential;
    if (!credential) {
        return res.status(400).json({ success: false, message: 'Missing credential' });
    }
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload?.email) {
            return res.status(400).json({ success: false, message: 'Invalid Google token' });
        }

        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = await User.create({
                email: payload.email,
                name: payload.name ?? payload.email,
                password: 'google-signin',
            });
        }

        const tokens = generateTokens(user._id.toString());
        if (!tokens) {
            return res.status(500).json({ success: false, message: 'Token generation failed' });
        }

        if (!user.refreshTokens) user.refreshTokens = [];
        user.refreshTokens.push(tokens.refreshToken);
        await user.save();

        return res.status(200).json({
            success: true,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, favorites: user.favorites },
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: 'Google authentication failed' });
    }
};

// Update the logged-in user's phone number (used by the "add phone" prompt after Google login)
export const updatePhone = async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const { phone } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.phone = phone;
        await user.save();

        return res.status(200).json({
            success: true,
            user: { _id: user._id, name: user.name, email: user.email, phone: user.phone },
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Remove lesson from favorites
export const removeFavorite = async (
    req: Request,
    res: Response
) => {

    const userId =
        req.userId as string;

    const lessonId =
        req.params.lessonId;

    try {

        const user =
            await User.findById(
                userId
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.favorites =
            user.favorites.filter(
                (favorite) =>
                    favorite.toString() !==
                    lessonId
            );

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                'Lesson removed from favorites'
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



