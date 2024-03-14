// import { CommentService } from './comment.service.js';
import { createCommentSchema, cardIdSchema, commentIdSchema } from './comment.joi.js';

export class CommentController {
    constructor(commentService) {
        this.commentservice = commentService;
        this.createCommentSchema = createCommentSchema;
        this.cardIdSchema = cardIdSchema;
        this.commentIdSchema = commentIdSchema;
    }

  createComment = async (req, res, next) => {
    try{
        const { cardId } = await this.cardIdSchema.validateAsync(req.params);
        const { commentContent } = await this.createCommentSchema.validateAsync(req.body);
    
        const createComment = await this.commentservice.createComment(
            cardId, commentContent
        )
    
        return res.status(201).json(createComment)
    }catch(error){
        res.status(400).json({ error: error.message });
    }
  };

  updateComment = async(req,res,next) => {
    try{
        const { cardId } = await this.cardIdSchema.validateAsync(req.params);
        const { commentId } = await this.commentIdSchema.validateAsync(req.params);

        const {commentContent} = await this.createCommentSchema.validateAsync(req.body);
    
        const newComment = await this.commentservice.updateComment(
            cardId,commentId,commentContent
        )
        return res.status(200).json(newComment)
    }catch(error){
        res.status(400).json({ error: error.message });
    }
  }

  deleteComment = async(req,res,next) => {
    try{
        const { cardId } = await this.cardIdSchema.validateAsync(req.params);
        const { commentId } = await this.commentIdSchema.validateAsync(req.params);
    
        const deleteComment = await this.commentservice.deleteComment(
            cardId,commentId
        )
        return res.status(200)
    }catch(error){
        res.status(400).json({ error: error.message });
    }
  }
}
