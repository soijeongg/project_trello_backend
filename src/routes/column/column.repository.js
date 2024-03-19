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
      include: {
        Cards: {
          select: {
            cardTitle: true,
            cardWriterId: true,
          },
        },
      },
      orderBy: { columnOrder: 'asc' },
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

  createColumn = async (boardId, columnTitle, columnOrder, columnWriterId) => {
    const randomColor = Math.floor(Math.random() * 7) + 1;

    const column = await this.prisma.column.create({
      data: {
        boardId: +boardId,
        columnTitle,
        columnWriterId: +columnWriterId,
        columnOrder: +columnOrder + 1,
        columnColor: randomColor,
      },
    });
    return column;
  };

  updateColumn = async (boardId, columnId, columnTitle, columnOrder) => {
    //현재 현재컬름의 Order를 찾기 위함
    const currentColumn = await this.prisma.column.findFirst({
      where: {
        boardId: +boardId,
        columnId: +columnId,
      },
    });
    const currentOrder = currentColumn.columnOrder;

    //바꿀 Order
    const requestedOrder = +columnOrder;

    //해당 board에 존재하는 컬럼중 가장큰 Order찾기
    const maxOrderColumn = await this.prisma.column.findFirst({
      where: {
        boardId: +boardId,
      },
      orderBy: {
        columnOrder: 'desc',
      },
    });

    const maxOrder = maxOrderColumn.columnOrder;

    //입력한 Order가 최대 Order보다 클경우 대비
    const finalOrder = Math.min(requestedOrder, maxOrder);

    // 순서가 변경된 칼럼과 다른 칼럼들
    if (finalOrder !== currentOrder) {
      const delta = finalOrder > currentOrder ? -1 : 1;

      // 현재 칼럼 이외의 다른 칼럼들 가져오기
      const affectedColumns = await this.prisma.column.findMany({
        where: {
          boardId: +boardId,
          columnOrder: {
            gte: Math.min(currentOrder, finalOrder),
            lte: Math.max(currentOrder, finalOrder),
            not: currentOrder,
          },
        },
      });

      // 각 칼럼의 순서를 조정
      for (const column of affectedColumns) {
        const updatedOrder = column.columnOrder === currentOrder ? finalOrder : column.columnOrder + delta;
        await this.prisma.column.update({
          where: {
            boardId: +boardId,
            columnId: column.columnId,
          },
          data: {
            columnOrder: updatedOrder,
          },
        });
      }
    }

    // 변경된 타이틀 업데이트
    const filnalUpdateColumn = await this.prisma.column.update({
      where: {
        boardId: +boardId,
        columnId: +columnId,
      },
      data: {
        columnOrder: finalOrder,
        columnTitle: columnTitle,
      },
    });
    return { message: '수정 완료' };
  };

  deletedColumn = async (boardId, columnId) => {
    try {
      const deletedColumn = await this.prisma.column.findFirst({
        where: {
          columnId: +columnId,
        },
      });
      // 삭제된 열보다 큰 columnOrder를 가진 열들
      const columnsToUpdate = await this.prisma.column.findMany({
        where: {
          boardId: +boardId,
          columnOrder: {
            gt: deletedColumn.columnOrder,
          },
        },
      });
      await this.prisma.column.delete({
        where: {
          columnId: +columnId,
        },
      });

      for (const column of columnsToUpdate) {
        await this.prisma.column.update({
          where: {
            columnId: column.columnId,
          },
          data: {
            columnOrder: column.columnOrder - 1,
          },
        });
      }

      return { message: '컬럼삭제' };
    } catch (error) {
      return { error: '컬럼이 존재하지 않습니다.' };
    }
  };
}
