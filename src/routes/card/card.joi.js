const columnIdScehma = Joi.object({
  columnId: Joi.number().required(),
});
const cardTitleSchema = Joi.object({
  cardTitle: Joi.string().required(),
});
const cardContentSchema = Joi.object({
  cardContent: Joi.string().required(),
});

const createCardBodySchema = Joi.object({
  cardTitle: Joi.string().required(),
  cardContent: Joi.string().required(),
  cardStartTime: Joi.date().required(),
  cardEndTime: Joi.date().required(),
  cardStatus: Joi.string().required(),
  cardColor: Joi.string().required(),
});
