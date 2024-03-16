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

router.post('/joinPage', boardController.joinBoard); //authMiddleware, 
router.get('/',  boardController.getBoards); //authMiddleware, 
router.post('/', boardController.createBoard); //authMiddleware, 
router.put('/:boardId', boardController.updateBoard); //authMiddleware, 
router.delete('/:boardId',  boardController.deleteBoard); //authMiddleware, 

export default router;
