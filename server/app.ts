import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

import usersRoutes from './routes/users_routes';
import lessonsRoutes from './routes/lessons_routes';
import commentsRoutes from './routes/comments_routes';
import fileRoutes from './routes/file_routes';

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

// Serve uploaded images from public/ folder — allow cross-origin so the React
// frontend (port 5173) can load images served from the API (port 3000)
app.use('/public', (_req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.join(process.cwd(), 'public')));

// Keep old uploads path for backwards compatibility
app.use('/uploads', (_req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.join(process.cwd(), 'uploads')));

// Request logger
app.use(logger);

// Rate limit all API routes
app.use('/api', apiLimiter);

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/file', fileRoutes);

// Global error handler — must be last
app.use(globalErrorHandler);

export default app;
