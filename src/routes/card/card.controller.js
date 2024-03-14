import { columnIdSchema, createCardSchema, updateCardSchema } from './card.joi.js';
export class CardsController {
  constructor(CardsService) {
    this.CardsService = CardsService;
  }
  getCards = async (req, res, next) => {
    try {
      const columnIdError = columnIdSchema.validate(req.params).error;
      if (columnIdError) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }
      const { columnId } = req.params;
      const cards = await this.CardsService.findAllCardWithColumnId(columnId);
      res.status(200).json(cards);
    } catch (err) {
      next(err);
    }
  };
  createCard = async (req, res, next) => {
    try {
      const columnIdError = columnIdSchema.validate(req.params).error;
      if (columnIdError) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }

      const createCardError = createCardSchema.validate(req.body).error;
      if (createCardError) {
        console.log(createCardError);
        const error = new Error('요청 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }

      const { columnId } = req.params;
      const cardData = req.body;
      const cardWriterId = res.locals.user.userId;
      await this.CardsService.createCard(columnId, cardWriterId, cardData);
      res.status(201).json({ message: '성공적으로 카드가 생성되었습니다.' });
    } catch (err) {
      next(err);
    }
  };
  updateCard = async (req, res, next) => {
    try {
      const columnIdError = columnIdSchema.validate(req.params).error;
      if (columnIdError) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }
      const updateCardError = updateCardSchema.validate(req.body).error;
      if (updateCardError) {
        const error = new Error('요청 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }
      const { cardId } = req.params;
      const cardData = req.body;
      const cardWriterId = res.locals.user.userId;
      await this.CardsService.updateCard(cardId, cardWriterId, cardData);
      res.status(200).json({ message: '성공적으로 카드가 수정되었습니다.' });
    } catch (err) {
      next(err);
    }
  };
  deleteCard = async (req, res, next) => {
    try {
      const columnIdError = columnIdSchema.validate(req.params).error;
      if (columnIdError) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }
      const { cardId } = req.params;
      await this.CardsService.deleteCard(cardId);
      res.status(200).json({ message: '성공적으로 카드가 삭제되었습니다.' });
    } catch (err) {
      next(err);
    }
  };
}
