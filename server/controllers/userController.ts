import {
    Request,
    Response,
    NextFunction
} from 'express';
import User from '../models/users';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
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
                email: user.email
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


// Authentication middleware
export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    // Get authorization header
    const authHeader =
        req.headers['authorization'];

    // Extract token from:
    // Authorization: Bearer <token>
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

    // Verify JWT token
    jwt.verify(
        token,
        process.env.TOKEN_SECRET,
        (
            err,
            data
        ) => {

            // Invalid token
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid token'
                });
            }

            // Extract payload
            const payload =
                data as TokenPayload;

            // Save user id for next middleware/controller
            req.query.userId =
                payload.userId;

            // Continue request
            next();
        }
    );
};


