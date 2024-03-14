export class BoardService {
  constructor(boardRepository) {
    this.boardRepository = boardRepository;
  }

  joinBoard = async (boardCode) => {
    const board = await this.boardRepository.findBoardByCode(boardCode);
    if (!board) {
      throw new Error('해당 보드가 존재하지 않습니다.');
    }
    return '보드에 참여하셨습니다.';
  };

  getBoards = async ({ id }) => {
    return await this.boardRepository.findAllBoardsForUser(id);
  };

  createBoard = async (boardData, id) => {
    const newBoardData = {
      ...boardData,
      userId: id,
      boardWriterId: id,
    };
    console.table(newBoardData);
    await this.boardRepository.createBoard(newBoardData);
    return '보드가 생성됐습니다.';
  };

  updateBoard = async (boardId, boardData) => {
    await this.boardRepository.updateBoardById(boardId, boardData);
    return '보드가 수정됐습니다.';
  };

  deleteBoard = async (boardId) => {
    await this.boardRepository.deleteBoardById(boardId);
    return '보드가 삭제됐습니다.';
  };
}
