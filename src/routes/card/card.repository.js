export class CardsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
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
  updateCard = async (cardId, cardWriterId, columnId, cardTitle, cardContent, cardStartTime, cardEndTime, cardStatus, cardOrder) => {
    const card = await this.prisma.card.update({
      where: {
        cardId: +cardId,
      },
      data: {
        columnId: +columnId,
        cardTitle,
        cardWriterId: +cardWriterId,
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
    const card = await this.prisma.card.delete({
      where: {
        cardId: +cardId,
      },
    });
    return card;
  };
}
