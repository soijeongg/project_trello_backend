import {
  joinBoardSchema,
  createBoardSchema,
  updateBoardSchema,
  boardIdSchema,
} from './Joi/board.joi.js';

export class BoardController {
  constructor(boardService) {
    this.boardService = boardService;
  }

  joinBoard = async (req, res) => {
    const { error } = joinBoardSchema.validate(req.body);
    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: message });
    }

    try {
      const { boardCode } = req.body;
      const message = await this.boardService.joinBoard(boardCode);
      res.json({ message });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getBoards = async (req, res) => {
    try {
      const boards = await this.boardService.getBoards(req.cookies);
      res.json(boards);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  createBoard = async (req, res) => {
    const { error } = createBoardSchema.validate(req.body);
    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: message });
    }

    try {
      const boardData = req.body;
      let { userId } = res.locals.user;
      const message = await this.boardService.createBoard(boardData, userId);
      res.json({ message });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  updateBoard = async (req, res) => {
    const paramValidation = boardIdSchema.validate({
      boardId: parseInt(req.params.boardId, 10),
    });
    if (paramValidation.error) {
      const message = paramValidation.error.details
        .map((detail) => detail.message)
        .join(', ');
      return res.status(400).json({ error: message });
    }

    const { error } = updateBoardSchema.validate(req.body);
    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: message });
    }

    try {
      const { boardId } = req.params;
      const boardData = req.body;
      const message = await this.boardService.updateBoard(
        boardId,
        boardData,
        req.cookies
      );
      res.json({ message });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteBoard = async (req, res) => {
    const paramValidation = boardIdSchema.validate({
      boardId: parseInt(req.params.boardId, 10),
    });
    if (paramValidation.error) {
      const message = paramValidation.error.details
        .map((detail) => detail.message)
        .join(', ');
      return res.status(400).json({ error: message });
    }

    try {
      const { boardId } = req.params;
      const message = await this.boardService.deleteBoard(boardId, req.cookies);
      res.json({ message });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}
