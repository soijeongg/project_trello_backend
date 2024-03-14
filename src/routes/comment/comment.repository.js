// import { prisma } from '../../utils/prisma/index.js';

export class CommentRepository{
    constructor(prisma) {
        this.prisma = prisma;
        }

    createComment = async(cardId, commentContent,commentWriterId) => {
        const createComment = await this.prisma.comment.create({
            data:{
                cardId:+cardId,
                commentContent,
                commentWriterId:+commentWriterId
            }
        })
        return createComment
    }

    updateComment = async(cardId, commentContent, commentId,commentWriterId) => {
        const updateComment = await this.prisma.comment.update({
            where:{
                cardId:+cardId,
                commentId:+commentId
            },
            data:{
                commentContent:commentContent,
                commentWriterId:+commentWriterId
            }
        })
        return updateComment
    }

    deleteComment = async(cardId, commentId) => {
        await this.prisma.comment.delete({
            where:{
                cardId:+cardId,
                commentId:+commentId
            }
        })
        return {message: "댓글삭제"}
    }
}