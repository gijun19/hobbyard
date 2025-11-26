// Card types
export type CardStatus = 'active' | 'reserved' | 'sold';
export type CardCondition = 'mint' | 'near-mint' | 'lightly-played' | 'played' | 'poor';
export type CardParallel = 'base' | 'holo' | 'reverse-holo' | 'refractor' | 'chrome' | 'prizm';

export interface Card {
  id: string;
  intakeBatchId?: string | null;
  sellerId: string;
  setName: string;
  playerName: string;
  teamName?: string | null;
  cardNumber?: string | null;
  parallel: string;
  condition: string;
  priceCents: number;
  frontImageUrl?: string | null;
  backImageUrl?: string | null;
  slotLocation?: string | null;
  status: CardStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Intake Batch types
export type IntakeBatchStatus = 'pending' | 'received' | 'processing' | 'completed';

export interface IntakeBatch {
  id: string;
  sellerId: string;
  status: IntakeBatchStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Buyer Box types
export interface BuyerBox {
  id: string;
  buyerId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BuyerBoxItem {
  id: string;
  buyerBoxId: string;
  cardId: string;
  addedAt: Date | string;
  card?: Card;
}

// Order types
export type OrderStatus = 'pending' | 'shipped' | 'completed';

export interface Order {
  id: string;
  buyerId: string;
  status: OrderStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  cardId: string;
  addedAt: Date | string;
  card?: Card;
}

// DTOs
export interface CreateCardDto {
  intakeBatchId?: string;
  sellerId: string;
  setName: string;
  playerName: string;
  teamName?: string;
  cardNumber?: string;
  parallel?: string;
  condition?: string;
  priceCents: number;
  slotLocation?: string;
}

export interface UpdateCardDto {
  setName?: string;
  playerName?: string;
  teamName?: string;
  cardNumber?: string;
  parallel?: string;
  condition?: string;
  priceCents?: number;
  slotLocation?: string;
  status?: CardStatus;
}

export interface CardFilters {
  playerName?: string;
  setName?: string;
  parallel?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: CardStatus;
}

export interface AddToBuyerBoxDto {
  buyerId: string;
  cardId: string;
}

export interface CreateOrderDto {
  buyerId: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}
