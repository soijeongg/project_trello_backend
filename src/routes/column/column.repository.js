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
        include:{
            Cards:{
                select: {
                    cardTitle: true,
                    cardWriterId: true
                }
            }
        }
        });
        return columns;
    };

    createColumn = async (boardId, columnTitle,columnWriterid) => {
        const column = await this.prisma.column.create({
        where: { 
            boardId: +boardId
        },
        data: {
            columnTitle,
            columnWriterid:columnWriterid,
            columnOrder: (await this.prisma.column.count()) + 1, 
        },
        });
        return column
    };
    updateColumn = async (boardId, columnId, columnTitle, columnOrder,columnWriterid) => {
        const newColumn = await this.prisma.column.update({
            where:{
                boardId:+boardId,
                columnId:+columnId
            },
            data:{
                columnTitle:columnTitle,
                columnOrder:columnOrder,
                columnWriterid: columnWriterid
            }
        })
        return newColumn
    }

    deletedColumn = async(boardId, columnId) => {
        await this.prisma.column.delete({
            where:{
                boardId:+boardId,
                columnId:+columnId
            }
        })
        return { message: '컬럼삭제' }
    }
}
