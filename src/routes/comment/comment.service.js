// import { CommentRepository } from './comment.repository.js';


export class CommentService {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
      }

    createComment = async( cardId, commentContent,commentWriterId) => {
        const createComment = await this.commentRepository.createComment(
            cardId, commentContent,commentWriterId
        )
        return createComment
    }

    updateComment = async(cardId, commentContent, commentId,commentWriterId) => {
        const updateComment = await this.commentRepository.updateComment(
            cardId, commentContent, commentId,commentWriterId
        )
        return updateComment
    }

    deleteComment = async(cardId, commentContent, commentId) => {
        const deleteComment = await this.commentRepository.deleteComment(
            (cardId, commentContent, commentId)
        )
        return deleteComment
    }
}