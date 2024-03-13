// import { ColumnService } from './column.service.js'
import { createColumnSchema, boardIdSchema, columnIdSchema } from './columnJoiSchemas.js'
export class ColumnController {
    constructor(columnService) {
        this.columnService = columnService;
        this.boardIdSchema = boardIdSchema;
        this.columnIdSchema = columnIdSchema;
        this.createColumnSchema = createColumnSchema;
    }

        getColumns = async(req,res,next)=>{
            try{
                // boardId 유효성 검사
                const { boardId } = await this.boardIdSchema.validateAsync(req.params);

                const columns = await this.columnService.findAllColumns(boardId)
                
                return res.status(200).json(columns)
                }catch(error){
                    res.status(400).json({ error: error.message });
                }
        }

        createColumn = async(req,res,next) => {
            try{
                // boardId 유효성 검사
                const { boardId } = await this.boardIdSchema.validateAsync(req.params);
                // const { boardId } = req.params

                const { columnTitle } = await this.createColumnSchema.validateAsync(req.body);
                const columnWriterid = req.user.userId

                const createColumn = await this.columnService.createColumn(
                    boardId,
                    columnTitle,
                    columnWriterid                    
                )
                return res.status(201).json(createColumn)
            }catch(error){
                res.status(400).json({ error: error.message });
            }
        }

        updateColumn = async(req, res, next) => {
            try{
                // boardId 유효성 검사
                const { boardId } = await this.boardIdSchema.validateAsync(req.params);
                // columnId 유효성 검사
                const { columnId } = await this.columnIdSchema.validateAsync(req.params);

                const { columnTitle, columnOrder } = await this.createColumnSchema.validateAsync(req.body);
    
                const columnWriterid = req.user.userId

                const newColumn = await this.columnService.updateColumn(
                    boardId,columnId,columnTitle,columnOrder,columnWriterid
                    )
                return res.status(200).json(newColumn)
            }catch(error){
                res.status(400).json({ error: error.message });
            }
        }

        deleteColumn = async(req,res,next) => {
            try{
        // boardId 유효성 검사
                const { boardId } = await this.boardIdSchema.validateAsync(req.params);
                // columnId 유효성 검사
                const { columnId } = await this.columnIdSchema.validateAsync(req.params);
    
                const deletedColumn = await this.columnService.deletedColumn(
                    boardId,columnId
                )
                return res.status(200).json({message:'삭제완료'})
            }catch(error){
                res.status(400).json({ error: error.message });
            }
        }
}