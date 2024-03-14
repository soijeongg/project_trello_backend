// import { ColumnService } from './column.service.js'
import { createColumnSchema, boardIdSchema, columnIdSchema } from './column.joi.js';
export class ColumnController {
  constructor(columnService) {
    this.columnService = columnService;
    // this.boardIdSchema = boardIdSchema;
    // this.columnIdSchema = columnIdSchema;
    // this.createColumnSchema = createColumnSchema;
  }

  getColumns = async (req, res, next) => {
    try {
      const boardIdError = boardIdSchema.validate(req.params).error;
      if (boardIdError) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }

      const { boardId } = req.params;

      const columns = await this.columnService.findAllColumns(boardId);

      return res.status(200).json(columns);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  createColumn = async (req, res, next) => {
    try {
      const boardIdError = boardIdSchema.validate(req.params).error;

      if (boardIdError) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }

      const { boardId } = req.params;

      const createColumnError = createColumnSchema.validate(req.body).error;
      if (createColumnError) {
        const error = new Error(createColumnError.message);
        error.status = 400;
        throw error;
      }

      const { columnTitle } = req.body;

      const columnWriterId = res.locals.user.userId;

      const createColumn = await this.columnService.createColumn(boardId, columnTitle, columnWriterId);
      return res.status(201).json(createColumn);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  updateColumn = async (req, res, next) => {
    try {
      const { boardId } = req.params;

      const boardIdError = boardIdSchema.validate({ boardId }).error;
      if (boardIdError) {
        const error = new Error('boardId 주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }

      const { columnId } = req.params;

      const columnIdError = columnIdSchema.validate({ columnId }).error;
      if (columnIdError !== undefined) {
        const error = new Error('columnId 주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }

      const createColumnError = createColumnSchema.validate(req.body).error;
      if (createColumnError) {
        const error = new Error(createColumnError.message);
        error.status = 400;
        throw error;
      }

      const { columnTitle, columnOrder } = req.body;

      const columnWriterId = res.locals.user.userId;

      const newColumn = await this.columnService.updateColumn(boardId, columnId, columnTitle, columnOrder, columnWriterId);
      return res.status(200).json(newColumn);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteColumn = async (req, res, next) => {
    try {
      const { boardId } = req.params;

      const boardIdError = boardIdSchema.validate({ boardId }).error;
      if (boardIdError) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }

      const { columnId } = req.params;

      const columnIdError = columnIdSchema.validate({ columnId }).error;
      if (columnIdError) {
        const error = new Error('주소 형식이 올바르지 않습니다.');
        error.status = 400;
        throw error;
      }

      const deletedColumn = await this.columnService.deletedColumn(boardId, columnId);
      return res.status(200).json({ message: '삭제완료' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}
