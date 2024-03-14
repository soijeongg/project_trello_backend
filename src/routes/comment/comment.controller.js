// import { CommentService } from './comment.service.js';
import { createCommentSchema, cardIdSchema, commentIdSchema } from './comment.joi.js';

export class CommentController {
  constructor(commentService) {
    this.commentService=commentService
  }

  createComment = async (req, res, next) => {
    try {
      const cardIdError = cardIdSchema.validate(req.params).error
      if (cardIdError) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }
      const { cardId } = req.params

      const createCommentError = createCommentSchema.validate(req.body).error
      if (createCommentError) {
        const error = new Error(createCommentError.message);
        error.status = 400;
        throw error;
      }
      const { commentContent } = req.body

      const commentWriterId = res.locals.user.userId;

      const createComment = await this.commentService.createComment(cardId, commentContent,commentWriterId);

      return res.status(201).json(createComment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  updateComment = async (req, res, next) => {
    try {
      const { cardId } = req.params

      const cardIdError = cardIdSchema.validate({ cardId }).error
      if (cardIdError) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }

      const { commentId } = req.params

      const commentIdError = commentIdSchema.validate({ commentId }).error
      if (commentIdError) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }

      const createCommentError = createCommentSchema.validate(req.body).error
      if (createCommentError) {
        const error = new Error(createCommentError.message);
        error.status = 400;
        throw error;
      }
      const { commentContent } = req.body

      const commentWriterId = res.locals.user.userId;


      const newComment = await this.commentService.updateComment(cardId, commentId, commentContent,commentWriterId);
      return res.status(200).json(newComment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteComment = async (req, res, next) => {
    try {
      const { cardId } = req.params

      const cardIdError = cardIdSchema.validate({ cardId }).error
      if (cardIdError) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }

      const { commentId } = req.params

      const commentIdError = commentIdSchema.validate({ commentId }).error
      if (commentIdError) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }


      const deleteComment = await this.commentService.deleteComment(cardId, commentId);
      return res.status(200);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}
