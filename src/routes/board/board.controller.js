import { joinBoardSchema, createBoardSchema, updateBoardSchema, boardIdSchema } from './board.joi.js';

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
      let { userId } = res.locals.user;
      const message = await this.boardService.joinBoard(boardCode, userId);
      res.json({ message });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  getBoards = async (req, res) => {
    try {
      let { userId } = res.locals.user; // 로그인한 사용자의 아이디를 response 객체에서 locals 객체에 있는 user 객체에서 가져옴
      const boards = await this.boardService.getBoards(userId);
      res.json(boards);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getBoardsId = async (req, res) => {
    try {
      const boardId = req.params.boardId;
      const boards = await this.boardService.getBoardsId(boardId);
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
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  };

  updateBoard = async (req, res) => {
    const paramValidation = boardIdSchema.validate({
      boardId: parseInt(req.params.boardId, 10),
    });
    if (paramValidation.error) {
      const message = paramValidation.error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: message });
    }

    const { error } = updateBoardSchema.validate(req.body);
    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: message });
    }

    try {
      const boardId = parseInt(req.params.boardId, 10);
      const boardData = req.body;
      const message = await this.boardService.updateBoard(boardId, boardData, req.cookies);
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
      const message = paramValidation.error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: message });
    }

    try {
      const boardId = parseInt(req.params.boardId, 10);
      let { userId } = res.locals.user;
      const message = await this.boardService.deleteBoard(boardId, userId);
      res.json({ message });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  //user에서 UserBoard로 접근
  findUserBoard = async (req, res) => {
    try {
      let { userId } = res.locals.user;
      let findManyUserBoard = await this.boardService.finduserBoard(userId);
      res.json(findManyUserBoard);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  };

  //board에서 UserBoard로 접근
  findUserBoard2 = async (req, res) => {
    try {
      let { boardId } = req.params;

      let findManyUserBoard2 = await this.boardService.finduserBoard2(boardId);
      res.json(findManyUserBoard2);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  };
}

