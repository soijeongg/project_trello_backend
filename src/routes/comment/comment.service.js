// import { CommentRepository } from './comment.repository.js';


export class CommentService {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  createComment = async (cardId, commentContent, commentWriterId) => {
    const card = await this.commentRepository.findCardById(cardId);
    if (!card) {
      const error = new Error('카드가 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }

    const createComment = await this.commentRepository.createComment(cardId, commentContent, commentWriterId);
    return createComment;
  };

  updateComment = async (cardId, commentId, commentContent, commentWriterId) => {
    const comment = await this.commentRepository.findCommentById(cardId, commentId);
    if (!comment) {
      const error = new Error('댓글이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }

    const updateComment = await this.commentRepository.updateComment(cardId, commentId, commentContent, commentWriterId);
    return updateComment;
  };

  deleteComment = async (cardId, commentId, userId) => {
    const comment = await this.commentRepository.findCommentById(cardId, commentId);
    if (!comment) {
      const error = new Error('댓글이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }
    if (comment.commentWriterId !== userId) {
      throw new Error('삭제할 수 있는 권한이 없습니다.');
    }

    const deleteComment = await this.commentRepository.deleteComment(cardId, commentId);
    return deleteComment;
  };
}