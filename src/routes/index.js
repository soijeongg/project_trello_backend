import express from 'express';
// import cardRoutes from './card/card.router.js';
import columnRouter from './column/column.router.js';
import commentRouter from './comment/comment.router.js';
import userRouter from './user/user.router.js';

const router = express.Router();

router.use('/boards/:boardId/columns', columnRouter);
// router.use('/boards/:boardId/columns/:columnId/cards', cardRoutes);

router.use('/cards/:cardld/comments', commentRouter);
router.use('/', userRouter);

export default router;
