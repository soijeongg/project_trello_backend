import { CardService } from './card.service.js';

export class CardController {
  getCards = async (req, res, next) => {
    try {
      const { columnId } = req.params;
      const cardData = await CardService.findAllCardWithColumnId(columnId);
      res.status(200).json(cardData);
    } catch (err) {
      next(err);
    }
  };
  createCard = async (req, res, next) => {
    try {
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
      const { cardId } = req.params;
      await CardService.deleteCard(cardId);
      res.status(200).json({ message: '성공적으로 카드가 삭제되었습니다.' });
    } catch (err) {
      next(err);
    }
  };
}
