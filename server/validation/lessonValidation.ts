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
    image: Joi.string().allow('').optional()
});
