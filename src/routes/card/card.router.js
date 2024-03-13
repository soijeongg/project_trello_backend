import express from 'express';
import { CardController } from './card.controller.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
const router = express.Router();

const cardController = new CardController();
router.get('/', authMiddleware, cardController.getCards);
router.post('/', authMiddleware, cardController.createCard);
router.update('/:cardId', authMiddleware, cardController.updateCard);
router.delete('/:cardId', authMiddleware, cardController.deleteCard);

export default router;
