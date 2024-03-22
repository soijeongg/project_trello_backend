// import { ColumnService } from './column.service.js'
import { createColumnSchema, boardIdSchema, columnIdSchema } from './column.joi.js';

const getCurrentTimeAndPlusOneDay = () => {
  const currentTime = new Date();
  const plusOneDay = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);

  const formatTime = (date) => ({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  });

  return {
    startTime: formatTime(currentTime),
    endTime: formatTime(plusOneDay),
  };
};

export class ColumnController {
  constructor(columnService, cardService) {
    this.columnService = columnService;
    this.cardService = cardService;
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
    const boardIdError = boardIdSchema.validate(req.params).error;
    if (boardIdError) {
      const error = new Error('주소 형식이 올바르지 않습니다.');
      error.status = 400;
      throw error;
    }
    const createColumnError = createColumnSchema.validate(req.body).error;
    if (createColumnError) {
      const error = new Error(createColumnError.message);
      error.status = 400;
      throw error;
    }

    try {
      const { boardId } = req.params;

      const { columnTitle } = req.body;
      const columnWriterId = res.locals.user.userId;
      // column 생성하는 부분
      const createColumn = await this.columnService.createColumn(boardId, columnTitle, columnWriterId);
      const columnId = createColumn.columnId;
      // default card 생성하는 부분
      const { startTime, endTime } = getCurrentTimeAndPlusOneDay();

      const childCardData = {
        cardTitle: '기본 Card',
        cardContent: '기본 Card입니다.',
        cardStartTime: startTime,
        cardEndTime: endTime,
        cardStatus: 'IN_PROGRESS',
      };
      const createChildCard = await this.cardService.createCard(columnId, columnWriterId, childCardData);

      res.status(201).json({ createColumn, createChildCard });
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

      const columns = await this.columnService.findAllColumns(boardId);
      const existingColumn = columns.find((c) => c.columnId === Number(columnId));

      if (!existingColumn) {
        const error = new Error('존재하지 않는 컬럼입니다.');
        error.status = 404;
        throw error;
      }

      const updateData = {};
      updateData.columnTitle = req.body.columnTitle !== undefined && req.body.columnTitle !== '' ? req.body.columnTitle : existingColumn.columnTitle;
      updateData.columnOrder = req.body.columnOrder !== undefined && req.body.columnOrder !== '' ? req.body.columnOrder : existingColumn.columnOrder;

      const createColumnError = createColumnSchema.validate(updateData).error;
      if (createColumnError) {
        const error = new Error(createColumnError.message);
        error.status = 400;
        throw error;
      }

      const newColumn = await this.columnService.updateColumn(boardId, columnId, updateData.columnTitle, updateData.columnOrder);
      return res.status(200).json(newColumn);
    } catch (error) {
      return res.status(400).json({ error: error.message });
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

      const userId = res.locals.user.userId;

      const deletedColumn = await this.columnService.deletedColumn(boardId, columnId, userId);
      return res.status(200).json({ message: '삭제완료' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}
