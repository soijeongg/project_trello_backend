import express from 'express';
import { prisma } from '../../utils/prisma/index.js';
import { CommentController } from './comment.controller.js'
import { CommentService } from './comment.service.js'
import { CommentRepository } from './comment.repository.js'
import authMiddleware from '../../middlewares/authMiddleware.js';


const router = express.Router()

const commentRepository = new CommentRepository(prisma)
const commentService = new CommentService(commentRepository)
const commentController = new CommentController(commentService)

router.post('/cards/:cardld/comments', commentController.createComment);

router.put('/cards/:cardld/comments/:commentId', commentController.updateComment);

router.delete('/cards/:cardld/comments/:commentId', commentController.deleteComment);

export default router