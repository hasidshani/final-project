import Joi from 'joi';

// Shared Joi schema for any image URL field (lesson image, profile picture).
// Images may only come from our own Cloudinary account (uploaded via POST /api/file),
// never an arbitrary external URL.
export const cloudinaryImageSchema = () =>
    Joi.string().uri({ scheme: ['https'] }).allow('').optional().custom((value, helpers) => {
        if (!value) return value;
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const expectedPrefix = `https://res.cloudinary.com/${cloudName}/`;
        if (!value.startsWith(expectedPrefix)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).messages({
        'string.uri': 'כתובת התמונה אינה תקינה',
        'string.uriCustomScheme': 'כתובת התמונה אינה תקינה',
        'any.invalid': 'כתובת התמונה אינה תקינה'
    });
