import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    // 100 was tripping during normal interactive browsing (many pages each
    // fire several authenticated fetches on mount) — 300/15min still blocks
    // real abuse/scraping while giving a real single user enough headroom.
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again after 15 minutes.' }
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    // Only failed attempts count toward the limit — successful logins/registrations
    // don't. Without this, everyone testing from the same IP (family members on one
    // router, or one dev machine) shares a single 10-request budget and real,
    // successful logins get blocked as if they were brute-force attempts.
    skipSuccessfulRequests: true,
    message: { success: false, message: 'Too many login attempts, please try again later.' }
});
