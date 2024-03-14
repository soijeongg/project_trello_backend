export class BoardRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  findBoardByCode = async (boardCode) => {
    return await prisma.board.findUnique({
      where: {
        boardCode,
      },
    });
  };

  findAllBoardsForUser = async (userId) => {
    return await prisma.board.findMany({
      where: {
        userId,
      },
      include: {
        Columns: true,
      },
    });
  };

  createBoard = async (boardData) => {
    return await prisma.board.create({
      data: boardData,
    });
  };

  updateBoardById = async (boardId, boardData) => {
    return await prisma.board.update({
      where: {
        boardId,
      },
      data: boardData,
    });
  };

  deleteBoardById = async (boardId) => {
    return await prisma.board.delete({
      where: {
        boardId,
      },
    });
  };
}
