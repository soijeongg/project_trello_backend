import { CardsService } from './card.service.js';
import {
  columnIdSchema,
  createCardSchema,
  updateCardSchema,
} from './card.joi.js';
export class CardsController {
  getCards = async (req, res, next) => {
    try {
      const columnIdError = columnIdSchema.validate(req.params).error;
      if (columnIdError) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }
      const { columnId } = req.params;
      const cards = await CardsService.findAllCardWithColumnId(columnId);
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
        const error = new Error('요청 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }

      const { columnId } = req.params;
      const cardData = req.body;
      const cardWriterId = res.locals.user.userId;
      await CardsService.createCard(columnId, cardWriterId, cardData);
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
      await CardsService.updateCard(cardId, cardWriterId, cardData);
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
      await CardsService.deleteCard(cardId);
      res.status(200).json({ message: '성공적으로 카드가 삭제되었습니다.' });
    } catch (err) {
      next(err);
    }
  };
}
