const getColorCode = () => {
  return Math.floor(Math.random() * 7);
};
const getDateTimeFormat = (timeObject) => {
  const year = +timeObject['year'];
  const month = +timeObject['month'];
  const day = +timeObject['day'];
  const hour = +timeObject['hour'];
  const minute = +timeObject['minute'];
  const date = new Date(year, month - 1, day, hour, minute);
  // ISO 8601 형식으로 변환 (UTC 기준)
  const dateTimeFormat = date.toISOString();
  return dateTimeFormat;
};

export class CardsService {
  constructor(CardsRepository) {
    this.CardsRepository = CardsRepository;
  }
  findColumn = async (columnId) => {
    const column = await this.CardsRepository.findColumn(columnId);
    return column;
  };
  findAllCardWithColumnId = async (columnId) => {
    const Cards = await this.CardsRepository.findAllCardsWithColumnId(columnId);
    return Cards;
  };
  //카드 생성 함수
  createCard = async (columnId, cardWriterId, cardData) => {
    const column = await this.CardsRepository.findColumn(columnId);
    if (!column) {
      const error = new Error('컬럼이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }
    //카드의 색상을 랜덤으로 지정
    cardData.cardColor = getColorCode();
    //시작시간의 시간 형식을 변경
    cardData.cardStartTime = getDateTimeFormat(cardData.cardStartTime);
    //종료시간의 시간 형식을 변경
    cardData.cardEndTime = getDateTimeFormat(cardData.cardEndTime);
    if (cardData.cardStartTime > cardData.cardEndTime) {
      const error = new Error('시작 시간은 종료시간보다 빠를 수 없습니다.');
      error.status = 400;
      throw error;
    }
    //카드의 순서를 결정하기 위해 컬럼에 속한 카드 중 가장 마지막 카드의 순서를 가져옴
    const lastCardOrder = await this.CardsRepository.findLastCardOrder(columnId);
    const newCardData = {
      ...cardData,
      cardOrder: lastCardOrder + 1,
    };
    const card = await this.CardsRepository.createCard(columnId, cardWriterId, newCardData);
    return card;
  };
  //카드 업데이트 함수
  updateCard = async (cardId, cardData) => {
    let targetCard = await this.CardsRepository.findCard(cardId);
    if (!targetCard) {
      const error = new Error('카드가 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }
    if (cardData.columnId) {
      const column = await this.CardsRepository.findColumn(cardData.columnId);
      if (!column) {
        const error = new Error('수정하려는 컬럼 번호에 해당하는 컬럼이 존재하지 않습니다.');
        error.status = 404;
        throw error;
      }
    }

    let cardStartTime = targetCard.cardStartTime;
    let cardEndTime = targetCard.cardEndTime;
    //시작시간을 수정하는 경우 시간 형식을 변경
    if (cardData.cardStartTime) {
      cardStartTime = getDateTimeFormat(cardData.cardStartTime);
    }
    //종료시간을 수정하는 경우 시간 형식을 변경
    if (cardData.cardEndTime) {
      cardEndTime = getDateTimeFormat(cardData.cardEndTime);
    }
    if (cardStartTime > cardEndTime) {
      const error = new Error('시작 시간은 종료시간보다 빠를 수 없습니다.');
      error.status = 400;
      throw error;
    }
    cardData.cardStartTime = cardStartTime;
    cardData.cardEndTime = cardEndTime;
    //cardData에는  카드의 변경 요청 사항이 담겨있음
    //targetData는 변경하려는 카드의 정보가 담겨있음
    if (cardData.columnId) {
      // 변경하려는 컬럼의 마지막 카드의 순서를 가져옴
      const lastCardOrder = await this.CardsRepository.findLastCardOrder(cardData.columnId);
      if (!cardData.cardOrder) {
        cardData.cardOrder = lastCardOrder + 1;
      }
      let beforeColumnId = targetCard.columnId;
      await this.CardsRepository.updateOnlyColumnId(cardId, cardData.columnId);
      await this.CardsRepository.updateOnlyCardOrder(cardId, lastCardOrder + 1);
      targetCard = await this.CardsRepository.findCard(cardId);
      await this.CardsRepository.updateCardOrderWithSwap(targetCard.columnId, targetCard.cardOrder, cardData.cardOrder);
      const card = await this.CardsRepository.updateCardWithOutOrderAndComlumnId(cardId, cardData);
      await this.CardsRepository.cardOrderCompression(beforeColumnId);
      return card;
    }
    await this.CardsRepository.updateCardOrderWithSwap(targetCard.columnId, targetCard.cardOrder, cardData.cardOrder);
    const card = await this.CardsRepository.updateCardWithOutOrderAndComlumnId(cardId, cardData);
    return card;
  };
  deleteCard = async (cardId, userId) => {
    const targetCard = await this.CardsRepository.findCard(cardId);
    if (!targetCard) {
      const error = new Error('카드가 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }
    if (userId !== targetCard.cardWriterId) {
      const error = new Error('카드를 삭제할 권한이 없습니다.');
      error.status = 403;
      throw error;
    }
    let beforeColumnId = targetCard.columnId;
    const card = await this.CardsRepository.deleteCard(cardId);
    await this.CardsRepository.cardOrderCompression(beforeColumnId);
    return card;
  };
}
