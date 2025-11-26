import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToBoxDto } from './dto/add-to-box.dto';
import { RemoveFromBoxDto } from './dto/remove-from-box.dto';

@Injectable()
export class BuyerBoxService {
  constructor(private prisma: PrismaService) {}

  /**
   * Add a card to buyer's box
   * - Creates buyer box if it doesn't exist
   * - Reserves the card (status: reserved)
   * - Adds to BuyerBoxItem
   */
  async addToBox(dto: AddToBoxDto) {
    const { buyerId, cardId } = dto;

    // Check if card exists and is available
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      throw new NotFoundException(`Card with ID ${cardId} not found`);
    }

    if (card.status !== 'active') {
      throw new BadRequestException(
        `Card is not available (status: ${card.status})`,
      );
    }

    // Get or create buyer box
    let buyerBox = await this.prisma.buyerBox.findUnique({
      where: { buyerId },
    });

    if (!buyerBox) {
      buyerBox = await this.prisma.buyerBox.create({
        data: { buyerId },
      });
    }

    // Check if card is already in box
    const existing = await this.prisma.buyerBoxItem.findUnique({
      where: {
        buyerBoxId_cardId: {
          buyerBoxId: buyerBox.id,
          cardId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Card is already in your box');
    }

    // Transaction: Add to box + reserve card
    const [boxItem] = await this.prisma.$transaction([
      this.prisma.buyerBoxItem.create({
        data: {
          buyerBoxId: buyerBox.id,
          cardId,
        },
        include: {
          card: true,
        },
      }),
      this.prisma.card.update({
        where: { id: cardId },
        data: { status: 'reserved' },
      }),
    ]);

    return boxItem;
  }

  /**
   * Remove a card from buyer's box
   * - Removes from BuyerBoxItem
   * - Unreserves the card (status: active)
   */
  async removeFromBox(dto: RemoveFromBoxDto) {
    const { buyerId, cardId } = dto;

    const buyerBox = await this.prisma.buyerBox.findUnique({
      where: { buyerId },
    });

    if (!buyerBox) {
      throw new NotFoundException('Buyer box not found');
    }

    const boxItem = await this.prisma.buyerBoxItem.findUnique({
      where: {
        buyerBoxId_cardId: {
          buyerBoxId: buyerBox.id,
          cardId,
        },
      },
    });

    if (!boxItem) {
      throw new NotFoundException('Card not found in your box');
    }

    // Transaction: Remove from box + unreserve card
    await this.prisma.$transaction([
      this.prisma.buyerBoxItem.delete({
        where: { id: boxItem.id },
      }),
      this.prisma.card.update({
        where: { id: cardId },
        data: { status: 'active' },
      }),
    ]);

    return { message: 'Card removed from box' };
  }

  /**
   * Get buyer's box contents
   */
  async getBox(buyerId: string) {
    const buyerBox = await this.prisma.buyerBox.findUnique({
      where: { buyerId },
      include: {
        items: {
          include: {
            card: true,
          },
          orderBy: {
            addedAt: 'desc',
          },
        },
      },
    });

    if (!buyerBox) {
      // Return empty box if doesn't exist yet
      return {
        id: null,
        buyerId,
        items: [],
        totalItems: 0,
        totalPriceCents: 0,
      };
    }

    const totalPriceCents = buyerBox.items.reduce(
      (sum, item) => sum + item.card.priceCents,
      0,
    );

    return {
      ...buyerBox,
      totalItems: buyerBox.items.length,
      totalPriceCents,
    };
  }

  /**
   * Clear entire buyer box
   * - Removes all items
   * - Unreserves all cards
   */
  async clearBox(buyerId: string) {
    const buyerBox = await this.prisma.buyerBox.findUnique({
      where: { buyerId },
      include: {
        items: {
          include: {
            card: true,
          },
        },
      },
    });

    if (!buyerBox || buyerBox.items.length === 0) {
      return { message: 'Box is already empty' };
    }

    const cardIds = buyerBox.items.map((item) => item.cardId);

    // Transaction: Delete all items + unreserve all cards
    await this.prisma.$transaction([
      this.prisma.buyerBoxItem.deleteMany({
        where: { buyerBoxId: buyerBox.id },
      }),
      this.prisma.card.updateMany({
        where: { id: { in: cardIds } },
        data: { status: 'active' },
      }),
    ]);

    return { message: 'Box cleared', itemsRemoved: cardIds.length };
  }
}
