import Joi from 'joi';

export const joinBoardSchema = Joi.object({
  boardCode: Joi.string().required(),
});

export const createBoardSchema = Joi.object({
  boardTitle: Joi.string().required(),
  boardContent: Joi.string().required(),
});

export const updateBoardSchema = Joi.object({
  boardTitle: Joi.string().required(),
  boardWriterId: Joi.number().integer().required(),
  boardContent: Joi.string().required(),
});

export const boardIdSchema = Joi.object({
  boardId: Joi.number().integer().required(),
});
