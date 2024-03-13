// import { ColumnRepository } from './column.repository.js';

export class ColumnService {
  constructor(columnRepository) {
    this.columnRepository = columnRepository;
    // this.prisma = columnRepository.prisma
  }

  // validateBoardId = async (boardId) => {
  //   const board = await this.prisma.board.findUnique({
  //     where: {
  //       boardId: +boardId,
  //     },
  //   });

  //   if (!board) {
  //     throw new Error('보드X');
  //   }
  // };
  // validateColumnId = async (columnId) => {
  //   const column = await this.prisma.column.findUnique({
  //     where: {
  //       column: +columnId,
  //     },
  //   });

  //   if (!column) {
  //     throw new Error('컬럼X');
  //   }
  // };

  findAllColumns = async (boardId) => {
    await this.validateBoardId(boardId);

    const columns = await this.columnRepository.findAllColumns(boardId);

    return columns;
  };

  createColumn = async (boardId, columnTitle, columnWriterId) => {
    // await this.validateBoardId(boardId);

    const createColumn = await this.columnRepository.createColumn(
      boardId,
      columnTitle,
      columnWriterId
    );

    return createColumn;
  };

  updateColumn = async (
    boardId,
    columnId,
    columnTitle,
    columnOrder
    // columnWriterid
  ) => {
    await this.validateBoardId(columnId);

    const updateColumn = await this.columnRepository.updateColumn(
      boardId,
      columnId,
      columnTitle,
      columnOrder
      // columnWriterid
    );
    return updateColumn;
  };

  deletedColumn = async (boardId, columnId) => {
    await this.validateBoardId(columnId);

    const deletedColumn = await this.columnRepository.deletedColumn(
      boardId,
      columnId
    );
    return deletedColumn;
  };
}
