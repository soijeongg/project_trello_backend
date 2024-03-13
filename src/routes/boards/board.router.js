import express from 'express';
import * as boardController from './board.controller.js';

const router = express.Router();

router.post('/joinPage', boardController.joinBoard);
router.get('/boards', boardController.getBoards);
router.post('/boards', boardController.createBoard);
router.put('/boards/:boardId', boardController.updateBoard);
router.delete('/boards/:boardId', boardController.deleteBoard);

export default router;