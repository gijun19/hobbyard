# Hobbyard API Documentation

Base URL: `http://localhost:3000`

## Health Check

### GET /
Get API health status

**Response:**
```json
{
  "status": "ok",
  "service": "hobbyard-api",
  "timestamp": "2025-11-25T00:00:00.000Z"
}
```

---

## Cards

### POST /cards
Create a new card

**Body:**
```json
{
  "sellerId": "seller_123",
  "category": "basketball",
  "setName": "2023-24 Panini Prizm",
  "playerName": "Victor Wembanyama",
  "teamName": "San Antonio Spurs",
  "cardNumber": "236",
  "parallel": "silver",
  "serialNumber": 25,
  "serialTotal": 99,
  "condition": "near-mint",
  "priceCents": 15000,
  "slotLocation": "A-12-3"
}
```

**Serial Numbering:**
- `serialNumber` - The specific serial number (e.g., 25)
- `serialTotal` - Total print run (e.g., 99)
- Display as: "25/99" in UI
- Both optional - omit for unnumbered cards
- Common examples:
  - One-of-one: `{"serialNumber": 1, "serialTotal": 1}`
  - Short print: `{"serialNumber": 42, "serialTotal": 99}`
  - Unnumbered: omit both fields

**Supported Categories (MVP):**
- `basketball`
- `football`
- `baseball`

**Future expansion:** pokemon, magic, yugioh, etc.

### GET /cards
List cards with filters

**Query Params:**
- `category` - Filter by category (basketball, football, baseball)
- `playerName` - Filter by player name (or character for TCG)
- `setName` - Filter by set name
- `parallel` - Filter by parallel type
- `minPrice` - Minimum price in cents
- `maxPrice` - Maximum price in cents
- `status` - Filter by status (active, reserved, sold)
- `skip` - Pagination offset (default: 0)
- `take` - Items per page (default: 50)

**Response:**
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "skip": 0,
    "take": 50
  }
}
```

### GET /cards/:id
Get a single card

### PATCH /cards/:id
Update a card

**Body:**
```json
{
  "category": "football",
  "serialNumber": 1,
  "serialTotal": 1,
  "priceCents": 50000,
  "slotLocation": "B-5-1",
  "status": "active"
}
```

**Note:** Can update serial numbering if card was incorrectly cataloged.

### POST /cards/:id/images
Upload card images (multipart/form-data)

**Form Fields:**
- `front` - Front image file
- `back` - Back image file

### DELETE /cards/:id
Soft delete (mark as sold)

### DELETE /cards/:id/hard
Permanently delete card

---

## Buyer Box

### POST /buyer-box/add
Add card to buyer's box

**Body:**
```json
{
  "buyerId": "buyer_123",
  "cardId": "card_456"
}
```

### POST /buyer-box/remove
Remove card from buyer's box

**Body:**
```json
{
  "buyerId": "buyer_123",
  "cardId": "card_456"
}
```

### GET /buyer-box/:buyerId
Get buyer's box contents

**Response:**
```json
{
  "id": "box_123",
  "buyerId": "buyer_123",
  "items": [...],
  "totalItems": 5,
  "totalPriceCents": 7500
}
```

### DELETE /buyer-box/:buyerId
Clear entire buyer box

---

## Orders

### POST /orders
Create order from buyer box (checkout)

**Body:**
```json
{
  "buyerId": "buyer_123"
}
```

**Response:**
```json
{
  "id": "order_123",
  "buyerId": "buyer_123",
  "status": "pending",
  "items": [...],
  "totalItems": 5,
  "totalPriceCents": 7500
}
```

### GET /orders
List all orders (admin)

**Query Params:**
- `skip` - Pagination offset
- `take` - Items per page

### GET /orders/buyer/:buyerId
Get all orders for a buyer

### GET /orders/:id
Get a single order

### PATCH /orders/:id/status
Update order status

**Body:**
```json
{
  "status": "shipped"
}
```

**Valid statuses:** `pending`, `shipped`, `completed`

---

## Intake Batches

### POST /intake-batches
Create a new intake batch

**Body:**
```json
{
  "sellerId": "seller_123"
}
```

### GET /intake-batches
List all batches

**Query Params:**
- `skip` - Pagination offset
- `take` - Items per page
- `status` - Filter by status (pending, received, processing, completed)

### GET /intake-batches/seller/:sellerId
Get all batches for a seller

### GET /intake-batches/:id
Get a single batch

**Response:**
```json
{
  "id": "batch_123",
  "sellerId": "seller_123",
  "status": "processing",
  "totalCards": 50,
  "activeCards": 45,
  "soldCards": 5
}
```

### PATCH /intake-batches/:id/status
Update batch status

**Body:**
```json
{
  "status": "completed"
}
```

**Valid statuses:** `pending`, `received`, `processing`, `completed`

### DELETE /intake-batches/:id
Delete batch (only if no cards)

---

## Search

### GET /search/suggest
Get autocomplete suggestions

**Query Params:**
- `query` - Search query
- `type` - Type of suggestion (`player`, `set`, `all`)

**Response:**
```json
{
  "players": ["Charizard", "Charmander"],
  "sets": ["Pokémon Base Set", "Pokémon Jungle"]
}
```

### GET /search/filter-options
Get available filter options

**Response:**
```json
{
  "categories": ["baseball", "basketball", "football"],
  "parallels": ["base", "prizm", "refractor", "silver"],
  "conditions": ["mint", "near-mint", "played"],
  "priceRange": {
    "min": 100,
    "max": 50000
  }
}
```

### GET /search/popular
Get popular searches

**Response:**
```json
{
  "players": [
    { "name": "Victor Wembanyama", "count": 150 },
    { "name": "Patrick Mahomes", "count": 142 }
  ],
  "sets": [
    { "name": "2023-24 Panini Prizm", "count": 300 },
    { "name": "2024 Bowman Chrome", "count": 250 }
  ]
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "statusCode": 404,
  "message": "Card with ID abc123 not found",
  "error": "Not Found"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (e.g., card already in box)
- `500` - Internal Server Error
