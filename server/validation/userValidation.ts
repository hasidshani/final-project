import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required()
        .messages({
            'string.min': 'השם חייב להכיל לפחות 2 תווים',
            'string.empty': 'יש להזין שם מלא',
            'any.required': 'יש להזין שם מלא'
        }),
    email: Joi.string().email().required()
        .messages({
            'string.email': 'יש להזין כתובת אימייל תקינה',
            'string.empty': 'יש להזין כתובת אימייל',
            'any.required': 'יש להזין כתובת אימייל'
        }),
    password: Joi.string().min(6).required()
        .messages({
            'string.min': 'הסיסמה חייבת להכיל לפחות 6 תווים',
            'string.empty': 'יש להזין סיסמה',
            'any.required': 'יש להזין סיסמה'
        }),
    phone: Joi.string().optional().allow('')
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required()
        .messages({
            'string.email': 'יש להזין כתובת אימייל תקינה',
            'string.empty': 'יש להזין כתובת אימייל',
            'any.required': 'יש להזין כתובת אימייל'
        }),
    password: Joi.string().required()
        .messages({
            'string.empty': 'יש להזין סיסמה',
            'any.required': 'יש להזין סיסמה'
        })
});

export const updatePhoneSchema = Joi.object({
    phone: Joi.string().min(7).max(15).required()
        .messages({
            'string.min': 'יש להזין מספר טלפון תקין',
            'string.empty': 'יש להזין מספר טלפון',
            'any.required': 'יש להזין מספר טלפון'
        })
});

export const updateMatchPreferenceSchema = Joi.object({
    openToMatch: Joi.boolean().required()
        .messages({
            'any.required': 'חסר ערך openToMatch'
        })
});
