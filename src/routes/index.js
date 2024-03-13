import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import cardRoutes from './card/card.router.js';

const router = express.Router();

router.use('/boards/:boardId/columns/:columnId/cards', cardRoutes);

export default router;
