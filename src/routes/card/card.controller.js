import { CardService } from './card.service.js';
import {
  columnIdScehma,
  createCardSchema,
  updateCardSchema,
} from './card.joi.js';
export class CardController {
  getCards = async (req, res, next) => {
    try {
      const { error } = columnIdScehma.validate(req.parans);
      if (error) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }
      const { columnId } = req.params;
      const cards = await CardService.findAllCardWithColumnId(columnId);
      res.status(200).json(cards);
    } catch (err) {
      next(err);
    }
  };
  createCard = async (req, res, next) => {
    try {
      const { paramserror } = columnIdScehma.validate(req.parans);
      if (error) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }
      const { error } = createCardSchema.validate(req.body);
      if (error) {
        const error = new Error('요청 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }
      const { columnId } = req.params;
      const cardData = req.body;
      await CardService.createCard(columnId, cardData);
      res.status(201).json({ message: '성공적으로 카드가 생성되었습니다.' });
    } catch (err) {
      next(err);
    }
  };
  updateCard = async (req, res, next) => {
    try {
      const { error } = columnIdScehma.validate(req.parans);
      if (error) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }
      const { cardId } = req.params;
      const cardData = req.body;
      await CardService.updateCard(cardId, cardData);
      res.status(200).json({ message: '성공적으로 카드가 수정되었습니다.' });
    } catch (err) {
      next(err);
    }
  };
  deleteCard = async (req, res, next) => {
    try {
      const { error } = columnIdScehma.validate(req.parans);
      if (error) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }
      const { cardId } = req.params;
      await CardService.deleteCard(cardId);
      res.status(200).json({ message: '성공적으로 카드가 삭제되었습니다.' });
    } catch (err) {
      next(err);
    }
  };
}
