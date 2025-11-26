// Card types
export type CardStatus = 'active' | 'reserved' | 'sold';
export type CardCategory =
  | 'basketball'
  | 'football'
  | 'baseball'
  // Future TCG categories:
  // | 'pokemon'
  // | 'magic'
  // | 'yugioh'
  ;
export type CardCondition = 'mint' | 'near-mint' | 'lightly-played' | 'played' | 'poor';
// Note: Parallel is free-form string (too many variants to enumerate)
// Examples: "Silver Prizm", "Gold Refractor", "Red Wave", "Base", etc.

export interface Card {
  id: string;
  intakeBatchId?: string | null;
  sellerId: string;
  category: CardCategory;
  setName: string;
  playerName: string; // Player name (sports) or Character name (TCG)
  teamName?: string | null; // Team (sports) or Type/Attribute (TCG)
  cardNumber?: string | null; // Card number in set (e.g., "236")
  parallel: string;
  serialNumber?: number | null; // Serial number (e.g., 25 in "25/99")
  serialTotal?: number | null; // Total print run (e.g., 99 in "25/99")
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
  category: CardCategory;
  setName: string;
  playerName: string;
  teamName?: string;
  cardNumber?: string;
  parallel?: string;
  serialNumber?: number;
  serialTotal?: number;
  condition?: string;
  priceCents: number;
  slotLocation?: string;
}

export interface UpdateCardDto {
  category?: CardCategory;
  setName?: string;
  playerName?: string;
  teamName?: string;
  cardNumber?: string;
  parallel?: string;
  serialNumber?: number;
  serialTotal?: number;
  condition?: string;
  priceCents?: number;
  slotLocation?: string;
  status?: CardStatus;
}

export interface CardFilters {
  category?: CardCategory;
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
