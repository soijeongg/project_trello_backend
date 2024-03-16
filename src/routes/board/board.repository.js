export class BoardRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findBoardByCode = async (boardCode) => {
    return await this.prisma.board.findFirst({
      where: {
        boardCode,
      },
    });
  };

  findAllBoardsForUser = async (userId) => {
    return await this.prisma.board.findMany({
      where: {
        OR: [{ userId: userId }, { UserBoards: { some: { userId: userId } } }],
      },
      include: {
        Columns: true,
        User: true,
      },
    });
  };

  findBoardById = async (boardId) => {
    return await this.prisma.board.findUnique({
      where: {
        boardId: boardId,
      },
    });
  };

  createBoard = async (boardData) => {
    return await this.prisma.board.create({
      data: {
        ...boardData,
      },
    });
  };

  createUserBoard = async (userBoardData) => {
    return await this.prisma.UserBoard.create({
      data: {
        ...userBoardData,
      },
    });
  };

  updateBoardById = async (boardId, boardData) => {
    return await this.prisma.board.update({
      where: {
        boardId,
      },
      data: boardData,
    });
  };

  deleteBoardById = async (boardId) => {
    return await this.prisma.board.delete({
      where: {
        boardId,
      },
    });
  };
}
