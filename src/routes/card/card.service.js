import { CardsRepository } from './card.repository.js';
getColorCode = () => {
  return Math.floor(Math.random() * 7);
};
getDateTimeFormat = (timeObject) => {
  const year = +timeObject['year'];
  const month = +timeObject['month'];
  const day = +timeObject['day'];
  const hour = +timeObject['hour'];
  const minute = +timeObject['minute'];
  const date = new Date(year, month - 1, day, hour, minute);
  const dateTimeFormat = date.toISOString().slice(0, 19).replace('T', ' ');
  return dateTimeFormat;
};

export class CardsService {
  CardsRepository = new CardsRepository();
  findAllCardWithColumnId = async (columnId) => {
    const Cards = await this.CardsRepository.findAllCardsWithColumnId(columnId);
    return Cards;
  };
  createCard = async (columnId, cardWriterId, cardData) => {
    //카드의 색상을 랜덤으로 지정
    cardData.colorCord = getColorCode();
    //시작시간의 시간 형식을 변경
    cardData.cardStartTime = getDateTimeFormat(cardData.cardStartTime);
    //종료시간의 시간 형식을 변경
    cardData.cardEndTime = getDateTimeFormat(cardData.cardEndTime);
    const lastCardOrder = await this.CardsRepository.findLastCardOrder(
      cardData.columnId
    );
    const card = await this.CardsRepository.createCard(columnId, cardWriterId, {
      ...cardData,
      cardOrder: lastCardOrder + 1,
    });
    return card;
  };
  updateCard = async (cardId, cardWriterId, cardData) => {
    //시작시간을 수정하는 경우 시간 형식을 변경
    if (cardData.cardStartTime) {
      cardData.cardStartTime = getDateTimeFormat(cardData.cardStartTime);
    }
    //종료시간을 수정하는 경우 시간 형식을 변경
    if (cardData.cardEndTime) {
      cardData.cardEndTime = getDateTimeFormat(cardData.cardEndTime);
    }
    const card = await this.CardsRepository.updateCard(
      cardId,
      cardWriterId,
      cardData
    );
    return card;
  };
  deleteCard = async (cardId) => {
    const card = await this.CardsRepository.deleteCard(cardId);
    return card;
  };
}
