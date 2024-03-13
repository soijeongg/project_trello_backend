import express from 'express';
import { CardController } from './card.controller.js';
const router = express.Router();

const cardController = new CardController();
router.get('/', cardController.getCards);
router.post('/', cardController.createCard);
router.update('/:cardId', cardController.updateCard);
router.delete('/:cardId', cardController.deleteCard);

export default router;
