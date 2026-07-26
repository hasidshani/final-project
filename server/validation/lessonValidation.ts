import Joi from 'joi';

export const createLessonSchema = Joi.object({
    title: Joi.string().min(3).max(100).required()
        .messages({ 'string.min': 'Title must be at least 3 characters' }),
    description: Joi.string().min(10).max(1000).required()
        .messages({ 'string.min': 'Description must be at least 10 characters' }),
    category: Joi.string()
        .valid('חסידות', 'מוסר', 'הלכה', 'משנה', 'גמרא', 'פרשת שבוע')
        .required(),
    city: Joi.string()
        .valid('נתניה', 'פרדס חנה')
        .required(),
    date: Joi.string().required(),
    time: Joi.string().required(),
    maxParticipants: Joi.number().min(1).max(500).optional(),
    // Images may only come from our own Cloudinary account (uploaded via POST /api/file),
    // never an arbitrary external URL.
    image: Joi.string().uri({ scheme: ['https'] }).allow('').optional().custom((value, helpers) => {
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
    })
});
