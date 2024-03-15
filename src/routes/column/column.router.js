import express from 'express';
import { prisma } from '../../utils/prisma/index.js';
import { ColumnController } from './column.controller.js';
import { ColumnService } from './column.service.js';
import { ColumnRepository} from './column.repository.js';
import authMiddleware from '../../middlewares/authMiddleware.js';



const router = express.Router();
const columnRepository = new ColumnRepository(prisma);
const columnService = new ColumnService(columnRepository);
const columnController = new ColumnController(columnService);

router.get(
  '/boards/:boardId/columns', //authMiddleware,
  columnController.getColumns
);

router.post(
  '/boards/:boardId/columns', //authMiddleware,
  columnController.createColumn
);

router.put(
  '/boards/:boardId/columns/:columnId', //authMiddleware,
  columnController.updateColumn
);

router.delete(
  '/boards/:boardId/columns/:columnId', // authMiddleware,
  columnController.deleteColumn
);

export default router;
