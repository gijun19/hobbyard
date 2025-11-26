import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { QueryCardsDto } from './dto/query-cards.dto';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async create(createCardDto: CreateCardDto) {
    return this.prisma.card.create({
      data: createCardDto,
    });
  }

  async findAll(query: QueryCardsDto) {
    const { skip = 0, take = 50, minPrice, maxPrice, ...filters } = query;

    const where: any = {};

    // Apply filters
    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.playerName) {
      where.playerName = {
        contains: filters.playerName,
        mode: 'insensitive',
      };
    }

    if (filters.setName) {
      where.setName = {
        contains: filters.setName,
        mode: 'insensitive',
      };
    }

    if (filters.parallel) {
      where.parallel = filters.parallel;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.priceCents = {};
      if (minPrice !== undefined) {
        where.priceCents.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.priceCents.lte = maxPrice;
      }
    }

    const [cards, total] = await Promise.all([
      this.prisma.card.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.card.count({ where }),
    ]);

    return {
      data: cards,
      meta: {
        total,
        skip,
        take,
      },
    };
  }

  async findOne(id: string) {
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: {
        intakeBatch: true,
      },
    });

    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    return card;
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    // Check if card exists
    await this.findOne(id);

    return this.prisma.card.update({
      where: { id },
      data: updateCardDto,
    });
  }

  async updateImages(id: string, frontImageUrl?: string, backImageUrl?: string) {
    const data: any = {};
    if (frontImageUrl) data.frontImageUrl = frontImageUrl;
    if (backImageUrl) data.backImageUrl = backImageUrl;

    return this.prisma.card.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    // Check if card exists
    await this.findOne(id);

    // Soft delete by marking as sold (or you could hard delete)
    return this.prisma.card.update({
      where: { id },
      data: { status: 'sold' },
    });
  }

  async hardDelete(id: string) {
    await this.findOne(id);

    return this.prisma.card.delete({
      where: { id },
    });
  }
}
