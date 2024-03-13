// import { ColumnRepository } from './column.repository.js';

export class ColumnService {
  constructor(columnRepository) {
    this.columnRepository = columnRepository;
  }

  validateBoardId = async (boardId) => {
    const board = await prisma.board.findUnique({
      where: {
        boardId: +boardId,
      },
    });

    if (!board) {
      throw new Error('보드X');
    }
  };
  validateColumnId = async (columnId) => {
    const column = await prisma.board.findUnique({
      where: {
        column: +columnId,
      },
    });

    if (!column) {
      throw new Error('컬럼X');
    }
  };

  findAllColumns = async (boardId) => {
    await this.validateBoardId(boardId);

    const columns = await this.columnRepository.findAllColumns(boardId);

    return columns;
  };

  createColumn = async (boardId, columnTitle, columnWriterid) => {
    await this.validateBoardId(boardId);

    const createColumn = await this.columnRepository.createColumn(
      boardId,
      columnTitle,
      columnWriterid
    );

    return createColumn;
  };

  updateColumn = async (
    boardId,
    columnId,
    columnTitle,
    columnOrder,
    columnWriterid
  ) => {
    await this.validateBoardId(columnId);

    const updateColumn = await this.columnRepository.updateColumn(
      boardId,
      columnId,
      columnTitle,
      columnOrder,
      columnWriterid
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
