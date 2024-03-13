import express from 'express';
import { prisma } from '../../utils/prisma/index.js';
import { CardsRepository } from './card.repository.js';
import { CardsService } from './card.service.js';
import { CardsController } from './card.controller.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
const router = express.Router();
const cardsRepository = new CardsRepository(prisma);
const cardsService = new CardsService(cardsRepository);
const cardsController = new CardsController(cardsService);

router.get('/', authMiddleware, cardsController.getCards);
router.post('/', authMiddleware, cardsController.createCard);
router.put('/:cardId', authMiddleware, cardsController.updateCard);
router.delete('/:cardId', authMiddleware, cardsController.deleteCard);

export default router;
