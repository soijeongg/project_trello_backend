import express from 'express';
import cardRoutes from './card/card.router.js';

const router = express.Router();

router.use('/boards/:boardId/columns/:columnId/cards', cardRoutes);

export default router;
