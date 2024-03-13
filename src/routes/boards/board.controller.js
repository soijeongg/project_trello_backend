import * as boardService from './board.service.js';
import {
  joinBoardSchema,
  createBoardSchema,
  updateBoardSchema,
  boardIdSchema,
} from './board.joi.js';

export const joinBoard = async (req, res) => {
  const { error } = joinBoardSchema.validate(req.body);
  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');
    return res.status(400).json({ error: message });
  }

  try {
    const { boardCode } = req.body;
    const message = await boardService.joinBoard(boardCode);
    res.json({ message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getBoards = async (req, res) => {
  try {
    const boards = await boardService.getBoards(req.cookies);
    res.json(boards);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createBoard = async (req, res) => {
  const { error } = createBoardSchema.validate(req.body);
  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');
    return res.status(400).json({ error: message });
  }

  try {
    const boardData = req.body;
    const message = await boardService.createBoard(boardData, req.cookies);
    res.json({ message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateBoard = async (req, res) => {
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
    const message = await boardService.updateBoard(
      boardId,
      boardData,
      req.cookies
    );
    res.json({ message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteBoard = async (req, res) => {
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
    const message = await boardService.deleteBoard(boardId, req.cookies);
    res.json({ message });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
