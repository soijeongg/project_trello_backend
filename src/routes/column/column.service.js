// import { ColumnRepository } from './column.repository.js';
export class ColumnService {
  constructor(columnRepository) {
    this.columnRepository = columnRepository;
  }
  

    // 보드가 존재하지 않는 경우 예외를 던집니다.


  findAllColumns = async (boardId) => {
    const columns = await this.columnRepository.findAllColumns(boardId);
    return columns;
  };
  createColumn = async (boardId, columnTitle, columnWriterId) => {

    const createColumn = await this.columnRepository.createColumn(boardId, columnTitle, columnWriterId);
    return createColumn;
  };
  updateColumn = async (
    boardId,
    columnId,
    columnTitle,
    columnOrder,
    columnWriterId
  ) => {
    const updateColumn = await this.columnRepository.updateColumn(
      boardId,
      columnId,
      columnTitle,
      columnOrder,
      columnWriterId
    );
    return updateColumn;
  };
  deletedColumn = async (boardId, columnId) => {
    const deletedColumn = await this.columnRepository.deletedColumn(boardId, columnId);
    return deletedColumn;
  };

}