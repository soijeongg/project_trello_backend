import express from 'express';
import cardRoutes from './card/card.router.js';
import columnRouter from './column/column.router.js'
import commentRouter from './comment/comment.router.js'

const router = express.Router();

router.use('/boards/:boardId/columns',columnRouter)
router.use('/columns/:columnId/cards', cardRoutes);
router.use('/cards/:cardld/comments',commentRouter)


export default router;
