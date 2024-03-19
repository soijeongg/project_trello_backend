import Joi from 'joi';

export const createCommentSchema = Joi.object({
  commentContent: Joi.string().min(2).max(30).required().messages({
    'string.base': 'commentContent는 문자열이어야 합니다.',
    'string.empty': 'commentContent는 비워둘 수 없습니다.',
    'string.min': 'commentContent는 최소 2글자 이상이어야 합니다.',
    'string.max': 'commentContent는 최대 30글자 이하이어야 합니다.',
    'any.required': 'commentContent는 필수 항목입니다.',
  }),
});

export const cardIdSchema = Joi.object({
  cardId: Joi.number().integer().required(),
});

export const commentIdSchema = Joi.object({
  commentId: Joi.number().integer().required(),
});
