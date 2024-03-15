import express from 'express';
import { prisma } from '../../utils/prisma/index.js';
import { CommentController } from './comment.controller.js';
import { CommentService } from './comment.service.js';
import { CommentRepository } from './comment.repository.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = express.Router();

const commentRepository = new CommentRepository(prisma);
const commentService = new CommentService(commentRepository);
const commentController = new CommentController(commentService);
router.get('/cards/:cardId', authMiddleware, commentController.getCard);

router.get('/cards/:cardId/comments', authMiddleware, commentController.getComments);

router.post('/cards/:cardId/comments', authMiddleware, commentController.createComment);

router.put('/cards/:cardId/comments/:commentId', authMiddleware, commentController.updateComment);

router.delete('/cards/:cardId/comments/:commentId', authMiddleware, commentController.deleteComment);

export default router;
