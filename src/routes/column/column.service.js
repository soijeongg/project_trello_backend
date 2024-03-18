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
    const board = await this.columnRepository.findBoardById(boardId)    
    if(!board){
      const error = new Error('보드가 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }
    const columnnum = await this.columnRepository.findAllColumns(boardId); // 현재 해당 보드에 몇개의 컬럼이 있는지 저장
    const columnOrder = columnnum.length; 
    const createColumn = await this.columnRepository.createColumn(boardId, columnTitle, columnOrder, columnWriterId);

    return createColumn;
  };
  updateColumn = async (
    boardId,
    columnId,
    columnTitle,
    columnOrder,
    // columnWriterId
  ) => {
    const column = await this.columnRepository.findColumnById(boardId,columnId)
    if(!column){
      const error = new Error('컬럼이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }

    const updateColumn = await this.columnRepository.updateColumn(
      boardId,
      columnId,
      columnTitle,
      columnOrder,
      // columnWriterId
    );
    return updateColumn;
  };

  deletedColumn = async (boardId, columnId, userId) => {
    const column = await this.columnRepository.findColumnById(boardId, columnId);
    if (!column) {
      const error = new Error('컬럼이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }

    if (column.columnWriterId !== userId) {
      throw new Error('삭제할 수 있는 권한이 없습니다.');
    }

    const deletedColumn = await this.columnRepository.deletedColumn(boardId, columnId);
    return deletedColumn;
  };

}