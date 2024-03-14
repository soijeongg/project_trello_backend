// import { prisma } from '../../utils/prisma/index.js';

export class ColumnRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAllColumns = async (boardId) => {
    const columns = await this.prisma.column.findMany({
      where: {
        boardId: +boardId,
      },
      // include:{
      //     Cards:{
      //         select: {
      //             cardTitle: true,
      //             cardWriterId: true
      //         }
      //     }
      // },
      orderBy: [{ columnOrder: 'asc' }, { updatedAt: 'desc' }],
    });
    return columns;
  };

  findBoardById = async (boardId) => {
    const board = await this.prisma.board.findFirst({
      where: {
        boardId: +boardId,
      },
    });
    return board;
  };
  findColumnById = async (boardId, columnId) => {
    const column = await this.prisma.column.findFirst({
      where: {
        boardId: +boardId,
        columnId: +columnId,
      },
    });
    return column;
  };

  createColumn = async (boardId, columnTitle, columnWriterId) => {
    const randomColor = Math.floor(Math.random() * 7) + 1;

    const column = await this.prisma.column.create({
      data: {
        boardId: +boardId,
        columnTitle,
        columnWriterId: +columnWriterId,
        columnOrder: (await this.prisma.column.count()) + 1,
        columnColor: randomColor,
      },
    });
    return column;
  };
  updateColumn = async (boardId, columnId, columnTitle, columnOrder) => {
    const newColumn = await this.prisma.column.update({
      where: {
        boardId: +boardId,
        columnId: +columnId,
      },
      data: {
        columnTitle: columnTitle,
        columnOrder: +columnOrder,
        // columnWriterId: +columnWriterId,
      },
    });
    return newColumn;
  };

  deletedColumn = async (boardId, columnId) => {
    await this.prisma.column.delete({
      where: {
        boardId: +boardId,
        columnId: +columnId,
      },
    });
    return { message: '컬럼삭제' };
  };
}
