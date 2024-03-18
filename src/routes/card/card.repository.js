import nodemon from 'nodemon';

export class CardsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  findColumn = async (columnId) => {
    const column = await this.prisma.column.findFirst({
      where: {
        columnId: +columnId,
      },
    });
    return column;
  };

  findAllCardsWithColumnId = async (columnId) => {
    const cards = await this.prisma.card.findMany({
      where: {
        columnId: +columnId,
      },
      orderBy: [{ cardOrder: 'asc' }, { updatedAt: 'desc' }],
    });
    return cards;
  };
  findColumn = async (columnId) => {
    const column = await this.prisma.column.findFirst({
      where: {
        columnId: +columnId,
      },
    });
    return column;
  };

  findCard = async (cardId) => {
    const card = await this.prisma.card.findFirst({
      where: {
        cardId: +cardId,
      },
    });
    return card;
  };
  findLastCardOrder = async (columnId) => {
    const lastCard = await this.prisma.card.findFirst({
      where: {
        columnId: +columnId,
      },
      orderBy: {
        cardOrder: 'desc',
      },
    });
    return lastCard ? lastCard.cardOrder : 0;
  };
  createCard = async (columnId, cardWriterId, cardData) => {
    const card = await this.prisma.card.create({
      data: {
        columnId: +columnId,
        cardTitle: cardData.cardTitle,
        cardWriterId: +cardWriterId,
        cardContent: cardData.cardContent,
        cardStartTime: cardData.cardStartTime,
        cardEndTime: cardData.cardEndTime,
        cardStatus: cardData.cardStatus,
        cardOrder: +cardData.cardOrder,
        cardColor: +cardData.cardColor,
      },
    });
    return card;
  };
  updateOnlyColumnId = async (cardId, columnId) => {
    const card = await this.prisma.card.update({
      where: {
        cardId: +cardId,
      },
      data: {
        columnId: +columnId,
      },
    });
    return card;
  };
  updateOnlyCardOrder = async (cardId, cardOrder) => {
    const card = await this.prisma.card.update({
      where: {
        cardId: +cardId,
      },
      data: {
        cardOrder: +cardOrder,
      },
    });
    return card;
  };
  updateCardOrderWithSwap = async (columnId, targetOrder, nowOrder) => {
    const cards = await this.prisma.card.findMany({
      where: {
        columnId: +columnId,
      },
      orderBy: {
        cardOrder: 'asc',
      },
    });
    if (nowOrder < targetOrder) {
      for (let i = nowOrder - 1; i < targetOrder - 1; i++) {
        let tempOrder = cards[i].cardOrder;
        cards[i].cardOrder = cards[i + 1].cardOrder;
        cards[i + 1].cardOrder = tempOrder;
      }
    } else if (nowOrder > targetOrder) {
      for (let i = nowOrder - 1; i > targetOrder - 1; i--) {
        let tempOrder = cards[i].cardOrder;
        cards[i].cardOrder = cards[i - 1].cardOrder;
        cards[i - 1].cardOrder = tempOrder;
      }
    }
    for (let i = 0; i < cards.length; i++) {
      await this.prisma.card.update({
        where: {
          cardId: cards[i].cardId,
        },
        data: {
          cardOrder: cards[i].cardOrder,
        },
      });
    }
  };
  updateCardWithOutOrderAndComlumnId = async (cardId, cardData) => {
    const updateData = {
      ...(cardData.cardTitle !== undefined && { cardTitle: cardData.cardTitle }),
      ...(cardData.cardContent !== undefined && { cardContent: cardData.cardContent }),
      ...(cardData.cardStartTime !== undefined && { cardStartTime: cardData.cardStartTime }),
      ...(cardData.cardEndTime !== undefined && { cardEndTime: cardData.cardEndTime }),
      ...(cardData.cardStatus !== undefined && { cardStatus: cardData.cardStatus }),
    };
    const card = await this.prisma.card.update({
      where: {
        cardId: +cardId,
      },
      data: updateData,
    });
    return card;
  };
  deleteCard = async (cardId) => {
    const card = await this.prisma.card.delete({
      where: {
        cardId: +cardId,
      },
    });
    return card;
  };
  cardOrderCompression = async (columnId) => {
    const cards = await this.prisma.card.findMany({
      where: {
        columnId: +columnId,
      },
      orderBy: {
        cardOrder: 'asc',
      },
    });
    for (let i = 0; i < cards.length; i++) {
      await this.prisma.card.update({
        where: {
          cardId: cards[i].cardId,
        },
        data: {
          cardOrder: i + 1,
        },
      });
    }
  };
}
