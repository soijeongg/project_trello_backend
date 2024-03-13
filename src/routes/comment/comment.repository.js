// import { prisma } from '../../utils/prisma/index.js';

export class CommentRepository{
    constructor(prisma) {
        this.prisma = prisma;
        }

    createComment = async(boardId, columnId, cardId, commentContent) => {
        const createComment = await this.prisma.comment.create({
            where:{
                cardId:+cardId
            },
            data:{
                commentContent
            }
        })
        return createComment
    }

    updateComment = async(boardId, columnId, cardId, commentContent, commentId) => {
        const updateComment = await this.prisma.comment.update({
            where:{
                cardId:+cardId,
                commentId:+commentId
            },
            data:{
                commentContent:commentContent
            }
        })
        return updateComment
    }

    deleteComment = async(boardId, columnId, cardId, commentContent, commentId) => {
        await this.prisma.comment.delete({
            where:{
                cardId:+cardId,
                commentId:+commentId
            }
        })
        return {message: "댓글삭제"}
    }
}