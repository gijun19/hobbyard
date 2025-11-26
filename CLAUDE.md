# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hobbyard is a low-end trading card marketplace focused on fast intake, simple selling, and efficient shipping. It's designed as a lightweight alternative to platforms like COMC with an emphasis on $1–$10 cards and batch shipping through Buyer Boxes.

## Core Business Concepts

### Card Lifecycle and Status Flow

Cards move through distinct states that drive the entire system:

- **active**: Listed on marketplace, visible to buyers
- **reserved**: In a buyer's box, hidden from marketplace
- **sold**: Completed transaction, card included in shipped order

This status field is the single source of truth for inventory state.

### Intake Batch Workflow

Sellers send cards in batches. Each IntakeBatch progresses through:

1. **pending**: Batch created, awaiting physical shipment
2. **received**: Physical cards arrived at facility
3. **processing**: Cards being scanned, photographed, priced, stored
4. **completed**: All cards cataloged and available

### Buyer Box Model

The Buyer Box is a critical differentiator from traditional e-commerce:

- Buyers accumulate low-value cards over time before shipping
- Adding a card to the box **reserves** it (status: reserved) and removes it from marketplace
- Cards stay reserved until buyer requests shipping
- On checkout, the entire box converts to an Order and box is cleared
- This allows efficient batch shipping of many $1-$10 cards

### Vault Storage

Cards have physical locations in bins/trays tracked via `slotLocation` field. This enables:

- Fast retrieval during order fulfillment
- Physical inventory management
- Integration with barcode scanning systems

## Architecture (Historical Context)

The repository was previously structured as a monorepo with:

**Backend (apps/api):**

- NestJS framework with TypeScript
- Prisma ORM for PostgreSQL database
- Modules: cards, buyer-box, order, search, storage
- File uploads handled via Multer (stored in `uploads/` directory)

**Frontend (apps/web):**

- React 18 with TypeScript
- Custom fetch-based API client (zero external HTTP dependencies)
- React Scripts for development and building

**Key Data Models:**

- Card: Core inventory with metadata, pricing, images, slot location
- BuyerBox: Container for buyer's reserved cards
- BuyerBoxItem: Join table linking cards to buyer boxes
- Order: Completed purchase from buyer box checkout
- OrderItem: Join table linking cards to orders

**Database Indexes:**
Critical for performance:

- Card: sellerId, status, slotLocation
- BuyerBoxItem: buyerBoxId, cardId
- Order: buyerId, status

## Development Commands (Historical)

Based on previous repository state:

**API Development:**

```bash
cd apps/api
pnpm run start:dev          # Start NestJS in watch mode
pnpm run build              # Build for production
pnpm run lint               # Lint TypeScript files
pnpm run test               # Run Jest unit tests
pnpm run test:e2e           # Run end-to-end tests
pnpm run test:watch         # Run tests in watch mode
```

**Web Development:**

```bash
cd apps/web
pnpm run dev                # Start React dev server
pnpm run build              # Build for production
pnpm run test               # Run React tests
pnpm run lint               # Lint source files
```

**Database:**

```bash
cd apps/api
npx prisma migrate dev      # Create and apply migration
npx prisma generate         # Generate Prisma client
npx prisma studio           # Open database GUI
npx prisma db push          # Push schema changes (dev only)
```

## Key Implementation Details

### Card Status Transitions

The status field must follow strict transition rules:

- `active` → `reserved`: When added to buyer box
- `reserved` → `active`: When removed from buyer box (before checkout)
- `reserved` → `sold`: When buyer box converts to order
- **Never** `sold` → any other status (immutable once sold)

### Buyer Box Checkout Flow

1. Fetch all BuyerBoxItems for buyer
2. Create Order with status "pending"
3. Create OrderItems for each card
4. Update all cards: status = "sold"
5. Delete all BuyerBoxItems (cascade delete clears the box)
6. Transaction must be atomic to prevent partial state

### Image Storage Strategy

Images stored in `apps/api/uploads/cards/`:

- Front images: `{cardId}-front.{ext}`
- Back images: `{cardId}-back.{ext}`
- Directory structure tracked with `.gitkeep` files
- Actual images excluded from git via app-specific `.gitignore`

### Search Implementation

The marketplace search supports:

- Player name autocomplete
- Set name filtering
- Parallel filtering (holo, non-holo, etc.)
- Price range queries

Only cards with `status = "active"` appear in search results.

## Current Repository State

The repository has been reset. Only `mvp-context.md` and `.gitignore` remain from the previous implementation. Future development will rebuild the monorepo structure.

## Important Constraints

- **Price in cents**: All monetary values stored as integers (e.g., 150 = $1.50) to avoid floating-point errors
- **Slot location required**: Every card must have a physical storage location before going active
- **Image URLs required**: Both front and back images must exist before card activation
- **Buyer box single owner**: Each BuyerBox is tied to exactly one buyerId
- **Order immutability**: Once created, OrderItems should not be modified (audit trail)
