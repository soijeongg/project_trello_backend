import Joi from 'joi';

const columnIdScehma = Joi.object({
  columnId: Joi.number().required(),
});
const timeSchema = Joi.object({
  year: Joi.number().min(2000).max(3000).required(),
  month: Joi.number().min(1).max(12).required(),
  day: Joi.number().min(1).max(31).required(),
  hour: Joi.number().min(0).max(23).required(),
  minute: Joi.number().min(0).max(59).required(),
});

const createCardSchema = Joi.object({
  columnId: Joi.number().required(),
  cardTitle: Joi.string().required(),
  cardContent: Joi.string().required(),
  cardStartTime: timeSchema,
  cardEndTime: timeSchema,
  cardStatus: Joi.string().valid('IN_PROGRESS', 'COMPLETED', 'CANCELED'),
});
const updateCardSchema = Joi.object({
  columnId: Joi.number(),
  cardTitle: Joi.string(),
  cardContent: Joi.string(),
  cardStartTime: timeSchema,
  cardEndTime: timeSchema,
  cardStatus: Joi.string().valid('IN_PROGRESS', 'COMPLETED', 'CANCELED'),
  cardOrder: Joi.number(),
});

export { columnIdScehma, createCardSchema, updateCardSchema };
