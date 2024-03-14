import express from 'express';
import { prisma } from '../../utils/prisma/index.js';
import { BoardRepository } from './board.repository.js';
import { BoardService } from './board.service.js';
import { BoardController } from './board.controller.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const boardRepository = new BoardRepository(prisma);
const boardService = new BoardService(boardRepository);
const boardController = new BoardController(boardService);

const router = express.Router();

router.post('/joinPage', boardController.joinBoard);
router.get('/boards', boardController.getBoards);
router.post('/boards', authMiddleware, boardController.createBoard);
router.put('/boards/:boardId', authMiddleware, boardController.updateBoard);
router.delete('/boards/:boardId', authMiddleware, boardController.deleteBoard);

export default router;
