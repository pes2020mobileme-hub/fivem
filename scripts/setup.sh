#!/usr/bin/env bash
set -e

echo "🚀 FiveM Bot Ultimate V3 Setup"
echo "================================"

if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env from .env.example — please edit it with your keys"
else
  echo "ℹ️  .env already exists"
fi

echo "📦 Installing dependencies..."
npm install

echo "🗄️  Generating Prisma client..."
npx prisma generate --schema=./prisma/schema.prisma

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env with your Discord, OpenRouter, and database credentials"
echo "  2. Start MySQL: docker compose -f docker/docker-compose.yml up -d mysql redis"
echo "  3. Push schema:  npm run db:push"
echo "  4. Seed data:    npm run db:seed"
echo "  5. Run dashboard: npm run dashboard:dev"
echo "  6. Run bot:       npm run bot:dev"
