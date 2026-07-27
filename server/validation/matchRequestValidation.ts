import Joi from 'joi';

export const createMatchRequestSchema = Joi.object({
    lessonId: Joi.string().required()
        .messages({
            'string.empty': 'חסר מזהה שיעור',
            'any.required': 'חסר מזהה שיעור'
        }),
    note: Joi.string().max(200).allow('').optional()
        .messages({
            'string.max': 'ההודעה יכולה להכיל עד 200 תווים'
        })
});

export const respondMatchRequestSchema = Joi.object({
    status: Joi.string().valid('accepted', 'declined').required()
        .messages({
            'any.only': 'סטטוס לא תקין',
            'any.required': 'יש לציין סטטוס'
        })
});
