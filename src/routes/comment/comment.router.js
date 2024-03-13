import express from 'express';
import { CommentController } from './comment.controller.js'

const router = express.Router()
const commentController = new CommentController()

router.post('/', commentController.createComment);

router.put('/:commentId', commentController.updateComment);

router.delete('/:commentId', commentController.deleteComment);

export default router