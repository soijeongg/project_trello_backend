import * as boardRepository from './board.repository.js';

export const joinBoard = async (boardCode) => {
  const board = await boardRepository.findBoardByCode(boardCode);
  if (!board) {
    throw new Error('해당 보드가 존재하지 않습니다.');
  }
  return '보드에 참여하셨습니다.';
};

export const getBoards = async ({ id }) => {
  return await boardRepository.findAllBoardsForUser(id);
};

export const createBoard = async (boardData, { id }) => {
  const newBoardData = {
    ...boardData,
    userId: id,
    boardWriterId: id,
  };
  await boardRepository.createBoard(newBoardData);
  return '보드가 생성됐습니다.';
};

export const updateBoard = async (boardId, boardData) => {
  await boardRepository.updateBoardById(boardId, boardData);
  return '보드가 수정됐습니다.';
};

export const deleteBoard = async (boardId) => {
  await boardRepository.deleteBoardById(boardId);
  return '보드가 삭제됐습니다.';
};
