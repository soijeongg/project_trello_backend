export class CardsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  findAllCardsWithColumnId = async (columnId) => {
    const cards = await prisma.card.findMany({
      where: {
        columnId: +columnId,
      },
      orderBy: {
        cardOrder: 'asc',
        updatedAt: 'desc',
      },
    });
    return cards;
  };
  findCard = async (cardId) => {
    const card = await prisma.card.findFirst({
      where: {
        cardId: +cardId,
      },
    });
    return card;
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
    cardWriterId,
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
        cardWriterId: +cardWriterId,
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
    cardWriterId,
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
    const card = await prisma.card.delete({
      where: {
        cardId: +cardId,
      },
    });
    return card;
  };
}
