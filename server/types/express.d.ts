// Extends Express's Request type to add a custom userId property
// This is set by authMiddleware after verifying the JWT
declare namespace Express {
    interface Request {
        userId?: string;
    }
}
