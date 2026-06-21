import dotenv from 'dotenv';
import mongoose from 'mongoose';

import app from './app';

// Load environment variables
dotenv.config({
    path: './server/.env'
});

// MongoDB connection
mongoose.connect(
    process.env.DATABASE_URL as string
);

const db = mongoose.connection;

// Connection error
db.on(
    'error',
    (error) => {
        console.error(error);
    }
);

// Connection success
db.once(
    'open',
    () => {
        console.log(
            'Connected to MongoDB'
        );
    }
);

// Server port
const PORT =
    process.env.PORT || 3000;

// Start server
app.listen(
    PORT,
    () => {
        console.log(
            `Server running on port ${PORT}`
        );
    }
);




