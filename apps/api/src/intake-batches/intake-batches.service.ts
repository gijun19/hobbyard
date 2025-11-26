import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIntakeBatchDto } from './dto/create-intake-batch.dto';
import { UpdateBatchStatusDto } from './dto/update-batch-status.dto';

@Injectable()
export class IntakeBatchesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateIntakeBatchDto) {
    return this.prisma.intakeBatch.create({
      data: {
        sellerId: dto.sellerId,
        status: 'pending',
      },
    });
  }

  async findAll(skip = 0, take = 50, status?: string) {
    const where = status ? { status } : {};

    const [batches, total] = await Promise.all([
      this.prisma.intakeBatch.findMany({
        where,
        skip,
        take,
        include: {
          cards: {
            select: {
              id: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.intakeBatch.count({ where }),
    ]);

    return {
      data: batches.map((batch) => ({
        ...batch,
        totalCards: batch.cards.length,
        activeCards: batch.cards.filter((c) => c.status === 'active').length,
        soldCards: batch.cards.filter((c) => c.status === 'sold').length,
      })),
      meta: {
        total,
        skip,
        take,
      },
    };
  }

  async findOne(id: string) {
    const batch = await this.prisma.intakeBatch.findUnique({
      where: { id },
      include: {
        cards: true,
      },
    });

    if (!batch) {
      throw new NotFoundException(`Intake batch with ID ${id} not found`);
    }

    return {
      ...batch,
      totalCards: batch.cards.length,
      activeCards: batch.cards.filter((c) => c.status === 'active').length,
      soldCards: batch.cards.filter((c) => c.status === 'sold').length,
    };
  }

  async findBySeller(sellerId: string) {
    const batches = await this.prisma.intakeBatch.findMany({
      where: { sellerId },
      include: {
        cards: {
          select: {
            id: true,
            status: true,
            priceCents: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return batches.map((batch) => ({
      ...batch,
      totalCards: batch.cards.length,
      activeCards: batch.cards.filter((c) => c.status === 'active').length,
      soldCards: batch.cards.filter((c) => c.status === 'sold').length,
      totalValueCents: batch.cards.reduce((sum, c) => sum + c.priceCents, 0),
    }));
  }

  async updateStatus(id: string, dto: UpdateBatchStatusDto) {
    await this.findOne(id); // Check exists

    return this.prisma.intakeBatch.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async delete(id: string) {
    // Check if batch exists and get cards
    const batch = await this.prisma.intakeBatch.findUnique({
      where: { id },
      include: { cards: true },
    });

    if (!batch) {
      throw new NotFoundException(`Intake batch with ID ${id} not found`);
    }

    if (batch.cards.length > 0) {
      throw new Error('Cannot delete batch with cards. Delete cards first.');
    }

    return this.prisma.intakeBatch.delete({
      where: { id },
    });
  }
}
