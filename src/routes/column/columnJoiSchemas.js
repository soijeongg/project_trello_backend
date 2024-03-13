// joiSchemas.js
import Joi from 'joi';

export const createColumnSchema = Joi.object({
    columnTitle: Joi.string().min(2).max(15).required().messages({
        'string.base': 'columnTitle은 문자열이어야 합니다.',
        'string.empty': 'columnTitle은 비워둘 수 없습니다.',
        'string.min': 'columnTitle은 최소 2글자 이상이어야 합니다.',
        'string.max': 'columnTitle은 최대 15글자 이하이어야 합니다.',
        'any.required': 'columnTitle은 필수 항목입니다.',
    }),
    columnOrder: Joi.number().optional().messages({
        'number.base': 'columnOrder은 숫자여야 합니다.'
    }),
});

export const boardIdSchema = Joi.object({
    boardId: Joi.number().integer().required(),
});

export const columnIdSchema = Joi.object({
    columnId: Joi.number().integer().required()
});
