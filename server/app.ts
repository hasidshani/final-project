import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import usersRoutes from './routes/users_routes';
import lessonsRoutes from './routes/lessons_routes';
import commentsRoutes from './routes/comments_routes';

import logger from './middleware/logger';
import globalErrorHandler from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Parse JSON
app.use(express.json());

// Request logger
app.use(logger);

// Rate limit all API routes
app.use('/api', apiLimiter);

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/comments', commentsRoutes);

// Global error handler — must be last
app.use(globalErrorHandler);

export default app;
