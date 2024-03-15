// import { prisma } from '../../utils/prisma/index.js';

export class CommentRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  getCard = async (cardId) => {
    const card = await this.prisma.card.findFirst({
      where: {
        cardId: +cardId,
      },
    });
    return card;
  };
  getComments = async (cardId) => {
    const comments = await this.prisma.comment.findMany({
      where: {
        cardId: +cardId,
      },
    });
    return comments;
  };

  createComment = async (cardId, commentContent, commentWriterId) => {
    const createComment = await this.prisma.comment.create({
      data: {
        cardId: +cardId,
        commentContent,
        commentWriterId: +commentWriterId,
      },
    });
    return createComment;
  };

  findCardById = async (cardId) => {
    const card = await this.prisma.card.findFirst({
      where: {
        cardId: +cardId,
      },
    });
    return card; // 수정: 변수 이름을 card로 변경
  };

  findCommentById = async (cardId, commentId) => {
    const comment = await this.prisma.comment.findFirst({
      where: {
        cardId: +cardId,
        commentId: +commentId,
      },
    });
    return comment;
  };

  updateComment = async (cardId, commentId, commentContent, commentWriterId) => {
    const updateComment = await this.prisma.comment.update({
      where: {
        cardId: +cardId,
        commentId: +commentId,
      },
      data: {
        commentContent: commentContent,
        commentWriterId: +commentWriterId,
      },
    });
    return updateComment;
  };

  deleteComment = async (cardId, commentId, userId) => {
    await this.prisma.comment.delete({
      where: {
        cardId: +cardId,
        commentId: +commentId,
      },
    });
    return { message: '댓글삭제' };
  };
}
