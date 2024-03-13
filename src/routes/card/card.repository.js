import { prisma } from '../utils/prisma/index.js';

export class CardsRepository {
  findAllCardsWithColumnId = async (columnId) => {
    const cards = await prisma.card.findMany({
      where: {
        columnId: +columnId,
      },
      orderBy: {
        cardOrder: 'asc',
      },
    });
    return cards;
  };
  findLastCardOrder = async (columnId) => {
    const lastCard = await prisma.card.findFirst({
      where: {
        columnId: +columnId,
      },
      orderBy: {
        cardOrder: 'desc',
      },
    });
    return lastCard ? lastCard.cardOrder : 0;
  };
  createCard = async (
    columnId,
    cardTitle,
    cardContent,
    cardStartTime,
    cardEndTime,
    cardStatus,
    cardOrder,
    cardColor
  ) => {
    const card = await prisma.card.create({
      data: {
        columnId: +columnId,
        cardTitle,
        cardContent,
        cardStartTime,
        cardEndTime,
        cardStatus,
        cardOrder: +cardOrder,
        cardColor: +cardColor,
      },
    });
    return card;
  };
  updateCard = async (
    cardId,
    columnId,
    cardTitle,
    cardContent,
    cardStartTime,
    cardEndTime,
    cardStatus,
    cardOrder
  ) => {
    const card = await prisma.card.update({
      where: {
        cardId: +cardId,
      },
      data: {
        columnId: +columnId,
        cardTitle,
        cardContent,
        cardStartTime,
        cardEndTime,
        cardStatus,
        cardOrder: +cardOrder,
      },
    });
    return card;
  };
  deleteCard = async (cardId) => {
    const card = await prisma.card.delete({
      where: {
        cardId: +cardId,
      },
    });
    return card;
  };
}
