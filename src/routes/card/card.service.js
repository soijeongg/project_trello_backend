import { CardsRepository } from './card.repository.js';

export class CardsService {
  CardsRepository = new CardsRepository();
  findAllCardWithColumnId = async (columnId) => {
    const Cards = await this.CardsRepository.findAllCardsWithColumnId(columnId);
    Cards.sort((a, b) => {
      return a.cardOrder - b.cardOrder;
    });
    return Cards;
  };
  createCard = async (columnId, cardData) => {
    const lastCardOrder = await this.CardsRepository.findLastCardOrder(
      cardData.columnId
    );
    const card = await this.CardsRepository.createCard(columnId, {
      ...cardData,
      cardOrder: lastCardOrder + 1,
    });
    return card;
  };
  updateCard = async (cardId, cardData) => {
    const card = await this.CardsRepository.updateCard(cardId, cardData);
    return card;
  };
  deleteCard = async (cardId) => {
    const card = await this.CardsRepository.deleteCard(cardId);
    return card;
  };
}
