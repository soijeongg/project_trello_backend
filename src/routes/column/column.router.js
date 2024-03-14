import express from 'express';
import { prisma } from '../../utils/prisma/index.js';
import { ColumnController } from './column.controller.js';
import { ColumnService } from './column.service.js';
import { ColumnRepository} from './column.repository.js';

const router = express.Router();
const columnRepository = new ColumnRepository(prisma);
const columnService = new ColumnService(columnRepository);
const columnController = new ColumnController(columnService);

router.get('/', columnController.getColumns);

router.post('/', columnController.createColumn);

router.put('/:columnId', columnController.updateColumn);

router.delete('/:columnId', columnController.deleteColumn);

export default router;
