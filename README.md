# Hobbyard

A low-end **sports card** marketplace focused on fast intake, simple selling, and efficient shipping.

**MVP Focus:** Basketball, Football, and Baseball cards only

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

### Setup

```bash
# Install dependencies
pnpm install

# Start PostgreSQL
docker-compose up -d

# Set up environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Run database migrations
pnpm db:migrate

# Start development servers
pnpm dev:api    # API runs on http://localhost:3000
pnpm dev:web    # Web runs on http://localhost:5173
```

## Project Structure

```
hobbyard/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # Vite + React frontend
├── packages/
│   └── types/        # Shared TypeScript types
└── docker-compose.yml
```

## Development Commands

```bash
# Development
pnpm dev:api          # Start API in watch mode
pnpm dev:web          # Start web dev server

# Database
pnpm db:migrate       # Run Prisma migrations
pnpm db:studio        # Open Prisma Studio GUI
pnpm db:generate      # Generate Prisma client

# Build
pnpm build:api        # Build API for production
pnpm build:web        # Build web for production

# Lint & Test
pnpm lint             # Lint all packages
pnpm test             # Run all tests
```

## AWS Deployment

See [CLAUDE.md](./CLAUDE.md) for architecture details.

**Recommended AWS setup:**
- Frontend: S3 + CloudFront
- Backend: ECS Fargate or App Runner
- Database: RDS PostgreSQL
- Storage: S3

## Tech Stack

- **Backend**: NestJS, Prisma, PostgreSQL
- **Frontend**: React 18, TypeScript, Vite
- **Storage**: Local (dev) / S3 (prod)
