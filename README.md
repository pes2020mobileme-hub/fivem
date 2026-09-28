# FiveM Bot Ultimate V3 ULTIMATE

**Production-ready** FiveM server management system with Discord Bot, Cyberpunk Web Dashboard, AI Assistant (OpenRouter), and full ESX / QBCore support.

![Version](https://img.shields.io/badge/version-3.0.0-cyan)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D20-green)

---

## Features

- **Live Server Monitor** — Real-time players, resources, status via `/info.json`, `/players.json`, `/dynamic.json`
- **Discord Bot (v14)** — Slash commands: `/status`, `/players`, `/kick`, `/ban`, `/announce`, `/ai`, and more
- **Web Dashboard** — Cyberpunk + Glassmorphism UI, Dark/Light mode, fully responsive
- **AI Studio** — OpenRouter integration (GLM-5.3-Free, DeepSeek V3/R1, Z.ai) for admin help, Lua generation, log analysis, resource builder
- **Player / Economy / Vehicle / Inventory Manager** — Full CRUD with ESX & QBCore support
- **Ban Manager** — Temporary, permanent, global bans with Discord sync
- **Whitelist System** — Discord OAuth + role sync + approve/reject workflow
- **Server Console** — Resource start/stop/restart + txAdmin API
- **Prisma + MySQL** — Complete schema with migrations & seed
- **Docker Compose** — MySQL, Redis, Dashboard, Bot, AI Gateway
- **Vercel Ready** + **GitHub Actions CI/CD**

---

## Tech Stack

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Frontend    | Next.js 15, TypeScript, Tailwind, Framer Motion, Lucide |
| Backend     | Next.js API Routes, Prisma ORM, MySQL |
| Bot         | Discord.js v14                       |
| AI          | OpenRouter API                       |
| Realtime    | Socket.IO (ready)                    |
| Infra       | Docker, Vercel, GitHub Actions       |

---

## Project Structure

```
FiveM-Bot-Ultimate-V3/
├── apps/
│   ├── dashboard/          # Next.js 15 Web Dashboard
│   ├── discord-bot/        # Discord.js Bot
│   ├── ai-gateway/         # AI proxy service
│   └── api/                # Shared API (optional)
├── prisma/
│   ├── schema.prisma       # Full database schema
│   └── seed.ts             # Seed jobs, admin, coupons
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.dashboard
│   ├── Dockerfile.bot
│   └── Dockerfile.ai
├── resources/              # FiveM resource templates
│   ├── qbcore/
│   ├── esx/
│   ├── standalone/
│   └── ai-npc/
├── .github/workflows/ci.yml
└── package.json
```

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd FiveM-Bot-Ultimate-V3
cp .env.example .env
# Edit .env with your keys
npm install
```

### 2. Database

```bash
# Start MySQL via Docker
docker compose -f docker/docker-compose.yml up -d mysql redis

# Generate client & push schema
npm run db:generate
npm run db:push
npm run db:seed
```

### 3. Run Development

```bash
# Terminal 1 — Dashboard
npm run dashboard:dev

# Terminal 2 — Discord Bot
npm run bot:dev

# Terminal 3 — AI Gateway (optional)
npm run ai:dev
```

Dashboard: http://localhost:3000

---

## Environment Variables

See `.env.example` for the full list.

| Variable              | Description                          |
|-----------------------|--------------------------------------|
| `DATABASE_URL`        | MySQL connection string              |
| `JWT_SECRET`          | Session secret (min 32 chars)        |
| `DISCORD_TOKEN`       | Bot token                            |
| `DISCORD_CLIENT_ID`   | OAuth client ID                      |
| `DISCORD_CLIENT_SECRET` | OAuth secret                       |
| `OPENROUTER_API_KEY`  | OpenRouter API key                   |
| `AI_MODEL`            | Default model (e.g. `glm-5.3-free`)  |
| `FIVEM_SERVER`        | e.g. `http://127.0.0.1:30120`        |
| `TXADMIN_URL`         | Optional txAdmin endpoint            |
| `TXADMIN_TOKEN`       | Optional txAdmin token               |

---

## Discord Bot Setup

1. Create application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Create Bot → copy token → `DISCORD_TOKEN`
3. OAuth2 → add redirect `http://localhost:3000/api/auth/callback/discord`
4. Invite bot with scopes: `bot`, `applications.commands`
5. Create roles: **Admin**, **Moderator**, **Support**

### Slash Commands

| Command     | Permission | Description              |
|-------------|------------|--------------------------|
| `/status`   | Everyone   | Server status            |
| `/players`  | Everyone   | Online player list       |
| `/kick`     | Moderator  | Kick player by ID        |
| `/ban`      | Moderator  | Ban by identifier        |
| `/announce` | Admin      | Server announcement      |
| `/ai`       | Everyone   | Ask AI assistant         |

---

## OpenRouter AI

1. Get API key at [openrouter.ai](https://openrouter.ai)
2. Set `OPENROUTER_API_KEY` and `AI_MODEL`
3. Supported locked models: `glm-5.3-free`, DeepSeek V3, DeepSeek R1, Z.ai

AI Studio modes:
- **Admin Assistant** — general help
- **Lua Script** — generate production Lua
- **Log Analyzer** — crash / error analysis
- **Resource Builder** — generate full resources

---

## Docker Production

```bash
# Build & start all services
docker compose -f docker/docker-compose.yml up -d --build

# Logs
docker compose -f docker/docker-compose.yml logs -f
```

Services:
- **dashboard** → :3000
- **discord-bot**
- **ai-gateway** → :3002
- **mysql** → :3306
- **redis** → :6379

---

## Vercel Deploy

1. Push repo to GitHub
2. Import project in Vercel with **Root Directory = `apps/dashboard`**
3. Leave Framework Preset on `Next.js` — no build command override needed
4. Set environment variables in Vercel dashboard
5. Deploy

`apps/dashboard/vercel.json` must sit next to `next.config.ts`; Vercel only reads
`vercel.json` from the configured Root Directory. Note that Hobby plan only
allows the `iad1` region, so no `regions` key is set.

`prisma generate` runs automatically via the `prebuild` script in
`apps/dashboard/package.json`, so no manual build step is required.

---

## Prisma

```bash
npm run db:generate   # Generate client
npm run db:push       # Push schema (dev)
npm run db:migrate    # Create migration
npm run db:seed       # Seed data
npm run db:studio     # Prisma Studio UI
```

Models: User, Character, Vehicle, InventoryItem, Transaction, Job, Ban, Whitelist, Log, Ticket, Coupon, AIHistory

---

## Connecting Real FiveM Server

Set `FIVEM_SERVER=http://YOUR_SERVER_IP:30120`

The dashboard and bot will automatically fetch:
- `/info.json` — server info & resources
- `/players.json` — online players
- `/dynamic.json` — hostname, max clients, etc.

Ensure your server allows external access to these endpoints (or use a reverse proxy).

---

## Troubleshooting

| Issue                    | Solution                                      |
|--------------------------|-----------------------------------------------|
| Server shows Offline     | Check `FIVEM_SERVER` URL & firewall           |
| Discord commands missing | Restart bot; commands register on ready       |
| AI returns error         | Verify `OPENROUTER_API_KEY` and model name    |
| Prisma connection fail   | Check `DATABASE_URL` and MySQL is running     |
| OAuth redirect error     | Match `DISCORD_REDIRECT_URI` exactly          |

---

## License

MIT — Use freely for your FiveM community servers.

---

**FiveM Bot Ultimate V3** — Built for production. Not a demo.
