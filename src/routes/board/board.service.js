import crypto from 'crypto';
// boardColor를 랜덤으로 선택하는 함수
const getColorCode = () => {
  return Math.floor(Math.random() * 7);
};
export class BoardService {
  constructor(boardRepository) {
    this.boardRepository = boardRepository;
  }

  joinBoard = async (boardCode, userId) => {
    const board = await this.boardRepository.findBoardByCode(boardCode);
    if (!board) {
      throw new Error('해당 보드가 존재하지 않습니다.');
    }
    await this.boardRepository.createUserBoard({
      userId: userId,
      boardId: board.boardId,
    });
    return '보드에 참여하셨습니다.';
  };

  getBoards = async (userId) => {
    const boards = await this.boardRepository.findAllBoardsForUser(userId);

    // 작성자 닉네임 포함하여 새로운 객체 배열 생성
    const modifiedBoards = boards.map((board) => ({
      ...board,
      writerNickname: board.User.nickname, // User에서 닉네임 추가
      boardCode: board.boardCode.substring(0, 10), // boardCode 수정
    }));

    return modifiedBoards;
  };

  createBoard = async (boardData, userId) => {
    const uniqueInput = `boardData-${Date.now()}-${Math.random()}`;
    const shasum = crypto.createHash('sha512');
    shasum.update(uniqueInput);
    let boardCode = shasum.digest('hex');
    boardCode = boardCode.substring(0, 10);

    const boardColor = getColorCode();

    await this.boardRepository.createBoard({
      ...boardData,
      userId: userId,
      boardWriterId: userId,
      boardCode,
      boardColor,
    });
    return '보드가 생성됐습니다.';
  };

  createUserBoard = async (userId, id) => {
    await this.boardRepository.createBoard({
      userId: id,
      boardWriterId: userId,
    });
    return '보드가 생성됐습니다.';
  };

  updateBoard = async (boardId, boardData) => {
    await this.boardRepository.updateBoardById(boardId, boardData);
    return '보드가 수정됐습니다.';
  };

  deleteBoard = async (boardId, userId) => {
    const board = await this.boardRepository.findBoardById(boardId);
    if (!board) {
      throw new Error('해당 보드가 존재하지 않습니다.');
    }
    if (board.userId !== userId) {
      throw new Error('보드의 창작자만 삭제할 수 있습니다.');
    }

    await this.boardRepository.deleteBoardById(boardId);
    return '보드가 삭제됐습니다.';
  };


  finduserBoard = async(userId)=>{
    let findBoards = await this.boardRepository.findUserIdInuserBoard(userId);
    if(!findBoards){
      throw new Error("해당 보드가 존재하지 않습니다")
    }
    return findBoards
  }
}
