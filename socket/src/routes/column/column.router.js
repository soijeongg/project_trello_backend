import express from 'express';
import { prisma } from '../../utils/prisma/index.js';
import { ColumnController } from './column.controller.js';
import { ColumnService } from './column.service.js';
import { ColumnRepository } from './column.repository.js';
import { CardsService } from '../card/card.service.js'; // columnController에서 cardService를 사용하기 위해 import!!
import { CardsRepository } from '../card/card.repository.js'; // columnController에서 cardService를 사용하기 위해 import!!
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = express.Router();
const columnRepository = new ColumnRepository(prisma);
const columnService = new ColumnService(columnRepository);
// columnController에서 cardService를 사용하기 위해 사용!!
const cardRepository = new CardsRepository(prisma);
const cardService = new CardsService(cardRepository);
const columnController = new ColumnController(columnService, cardService);

router.get('/boards/:boardId/columns', authMiddleware, columnController.getColumns);

router.post('/boards/:boardId/columns', authMiddleware, columnController.createColumn);

router.put('/boards/:boardId/columns/:columnId', authMiddleware, columnController.updateColumn);

router.delete('/boards/:boardId/columns/:columnId', authMiddleware, columnController.deleteColumn);

export default router;
