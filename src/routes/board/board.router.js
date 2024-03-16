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

router.post('/joinPage', authMiddleware,boardController.joinBoard); //authMiddleware, 
router.get('/', authMiddleware, boardController.getBoards); //authMiddleware, 
router.post('/', authMiddleware,boardController.createBoard); //authMiddleware, 
router.put('/:boardId',authMiddleware, boardController.updateBoard); //authMiddleware, 
router.delete('/:boardId', authMiddleware, boardController.deleteBoard); //authMiddleware, 
router.get('/userBoard', authMiddleware, boardController.findUserBoard);

export default router;
