import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchSuggestDto } from './dto/search-suggest.dto';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  /**
   * Autocomplete suggestions for search
   * Returns unique player names and set names matching the query
   */
  async suggest(dto: SearchSuggestDto) {
    const { query, type = 'all' } = dto;

    const results: any = {
      players: [],
      sets: [],
    };

    // Search only active cards for marketplace
    const where = {
      status: 'active',
    };

    // Get player name suggestions
    if (type === 'player' || type === 'all') {
      const players = await this.prisma.card.findMany({
        where: {
          ...where,
          playerName: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: {
          playerName: true,
        },
        distinct: ['playerName'],
        take: 10,
      });

      results.players = players.map((p) => p.playerName).sort();
    }

    // Get set name suggestions
    if (type === 'set' || type === 'all') {
      const sets = await this.prisma.card.findMany({
        where: {
          ...where,
          setName: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: {
          setName: true,
        },
        distinct: ['setName'],
        take: 10,
      });

      results.sets = sets.map((s) => s.setName).sort();
    }

    return results;
  }

  /**
   * Get available filter options for marketplace
   */
  async getFilterOptions() {
    // Get distinct categories
    const categories = await this.prisma.card.findMany({
      where: { status: 'active' },
      select: { category: true },
      distinct: ['category'],
    });

    // Get distinct parallels from active cards
    const parallels = await this.prisma.card.findMany({
      where: { status: 'active' },
      select: { parallel: true },
      distinct: ['parallel'],
    });

    // Get distinct conditions
    const conditions = await this.prisma.card.findMany({
      where: { status: 'active' },
      select: { condition: true },
      distinct: ['condition'],
    });

    // Get price range
    const priceStats = await this.prisma.card.aggregate({
      where: { status: 'active' },
      _min: { priceCents: true },
      _max: { priceCents: true },
    });

    return {
      categories: categories.map((c) => c.category).sort(),
      parallels: parallels.map((p) => p.parallel).sort(),
      conditions: conditions.map((c) => c.condition).sort(),
      priceRange: {
        min: priceStats._min.priceCents || 0,
        max: priceStats._max.priceCents || 0,
      },
    };
  }

  /**
   * Get popular searches (most common player/set names)
   */
  async getPopular() {
    const [topPlayers, topSets] = await Promise.all([
      this.prisma.card.groupBy({
        by: ['playerName'],
        where: { status: 'active' },
        _count: true,
        orderBy: {
          _count: {
            playerName: 'desc',
          },
        },
        take: 10,
      }),
      this.prisma.card.groupBy({
        by: ['setName'],
        where: { status: 'active' },
        _count: true,
        orderBy: {
          _count: {
            setName: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    return {
      players: topPlayers.map((p) => ({
        name: p.playerName,
        count: p._count,
      })),
      sets: topSets.map((s) => ({
        name: s.setName,
        count: s._count,
      })),
    };
  }
}
