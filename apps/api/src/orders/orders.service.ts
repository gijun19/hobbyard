import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create order from buyer box (checkout)
   * This is the critical checkout flow:
   * 1. Get all items from buyer box
   * 2. Create order
   * 3. Create order items
   * 4. Update cards to 'sold'
   * 5. Clear buyer box
   */
  async create(dto: CreateOrderDto) {
    const { buyerId } = dto;

    // Get buyer box with items
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
      throw new BadRequestException('Buyer box is empty');
    }

    const cardIds = buyerBox.items.map((item) => item.cardId);

    // Verify all cards are still reserved
    const cards = await this.prisma.card.findMany({
      where: { id: { in: cardIds } },
    });

    const notReserved = cards.filter((card) => card.status !== 'reserved');
    if (notReserved.length > 0) {
      throw new BadRequestException(
        `Some cards are no longer reserved: ${notReserved.map((c) => c.id).join(', ')}`,
      );
    }

    // Transaction: Create order, add items, mark cards sold, clear box
    const order = await this.prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          buyerId,
          status: 'pending',
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: cardIds.map((cardId) => ({
          orderId: newOrder.id,
          cardId,
        })),
      });

      // Mark all cards as sold
      await tx.card.updateMany({
        where: { id: { in: cardIds } },
        data: { status: 'sold' },
      });

      // Clear buyer box
      await tx.buyerBoxItem.deleteMany({
        where: { buyerBoxId: buyerBox.id },
      });

      // Return order with items
      const createdOrder = await tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          items: {
            include: {
              card: true,
            },
          },
        },
      });

      if (!createdOrder) {
        throw new Error('Failed to create order');
      }

      return createdOrder;
    });

    // Calculate total
    const totalPriceCents = order.items.reduce(
      (sum, item) => sum + item.card.priceCents,
      0,
    );

    return {
      ...order,
      totalItems: order.items.length,
      totalPriceCents,
    };
  }

  /**
   * Get a single order by ID
   */
  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            card: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const totalPriceCents = order.items.reduce(
      (sum, item) => sum + item.card.priceCents,
      0,
    );

    return {
      ...order,
      totalItems: order.items.length,
      totalPriceCents,
    };
  }

  /**
   * Get all orders for a buyer
   */
  async findByBuyer(buyerId: string) {
    const orders = await this.prisma.order.findMany({
      where: { buyerId },
      include: {
        items: {
          include: {
            card: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((order) => ({
      ...order,
      totalItems: order.items.length,
      totalPriceCents: order.items.reduce(
        (sum, item) => sum + item.card.priceCents,
        0,
      ),
    }));
  }

  /**
   * Update order status
   */
  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: {
        items: {
          include: {
            card: true,
          },
        },
      },
    });
  }

  /**
   * Get all orders (admin)
   */
  async findAll(skip = 0, take = 50) {
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take,
        include: {
          items: {
            include: {
              card: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.order.count(),
    ]);

    return {
      data: orders.map((order) => ({
        ...order,
        totalItems: order.items.length,
        totalPriceCents: order.items.reduce(
          (sum, item) => sum + item.card.priceCents,
          0,
        ),
      })),
      meta: {
        total,
        skip,
        take,
      },
    };
  }
}
