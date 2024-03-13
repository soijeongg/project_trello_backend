import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findBoardByCode = async (boardCode) => {
  return await prisma.board.findUnique({
    where: {
      boardCode,
    },
  });
};

export const findAllBoardsForUser = async (userId) => {
  return await prisma.board.findMany({
    where: {
      userId,
    },
    include: {
      Columns: true,
    },
  });
};

export const createBoard = async (boardData) => {
  return await prisma.board.create({
    data: boardData,
  });
};

export const updateBoardById = async (boardId, boardData) => {
  return await prisma.board.update({
    where: {
      boardId,
    },
    data: boardData,
  });
};

export const deleteBoardById = async (boardId) => {
  return await prisma.board.delete({
    where: {
      boardId,
    },
  });
};
