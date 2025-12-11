import { MOCK_CARDS, Card } from './mockCards';

export type { Card };

export interface CardFilters {
  search?: string;
  minPriceCents?: number;
  maxPriceCents?: number;
  page?: number;
  pageSize?: number;
}

export interface CardResponse {
  items: Card[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchCards(filters: CardFilters = {}): Promise<CardResponse> {
  const {
    search = '',
    minPriceCents,
    maxPriceCents,
    page = 1,
    pageSize = 12,
  } = filters;

  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...MOCK_CARDS];

  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (card) =>
        card.playerName.toLowerCase().includes(query) ||
        card.setName.toLowerCase().includes(query)
    );
  }

  if (minPriceCents !== undefined) {
    filtered = filtered.filter((card) => card.priceCents >= minPriceCents);
  }

  if (maxPriceCents !== undefined) {
    filtered = filtered.filter((card) => card.priceCents <= maxPriceCents);
  }

  const total = filtered.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = filtered.slice(startIndex, endIndex);

  return {
    items,
    total,
    page,
    pageSize,
  };
}
