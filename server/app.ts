import express from 'express';

import usersRoutes from './routes/users_routes';
import lessonsRoutes from './routes/lessons_routes';
import commentsRoutes from './routes/comments_routes';

const app = express();

// Parse JSON requests
app.use(
    express.json()
);

// User routes
app.use(
    '/api/users',
    usersRoutes
);

// Lesson routes
app.use(
    '/api/lessons',
    lessonsRoutes
);

// Comment routes
app.use(
    '/api/comments',
    commentsRoutes
);

export default app;
