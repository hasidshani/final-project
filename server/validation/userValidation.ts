import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required()
        .messages({ 'string.min': 'Name must be at least 2 characters' }),
    email: Joi.string().email().required()
        .messages({ 'string.email': 'Please provide a valid email' }),
    password: Joi.string().min(6).required()
        .messages({ 'string.min': 'Password must be at least 6 characters' }),
    phone: Joi.string().optional().allow('')
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const updatePhoneSchema = Joi.object({
    phone: Joi.string().min(7).max(15).required()
        .messages({ 'string.min': 'Please provide a valid phone number' })
});
