# System Architecture

BlockAI follows a clean **client-server architecture** with a React frontend, Node.js backend, and multiple external data providers.

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                      │
│  React + TypeScript + Vite                                │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Dashboard │ Chat │ Market │ Scanner │ Contracts   │   │
│  └──────────────────────┬─────────────────────────────┘   │
│                         │ HTTPS / JWT                      │
└─────────────────────────┼────────────────────────────────┘
                          │
┌─────────────────────────┼────────────────────────────────┐
│                     BACKEND (API)                          │
│  Node.js + Express + TypeScript                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │   Auth   │ │ Billing  │ │ AI Proxy │ │ Activity │    │
│  │  Service │ │  Service │ │  Service │ │  Service │    │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘    │
│       │            │            │             │           │
│  ┌────┴────────────┴────────────┴─────────────┴────┐     │
│  │              Prisma ORM → Database               │     │
│  └──────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
  ┌──────────┐     ┌──────────┐     ┌──────────┐
  │ ChainGPT │     │ Etherscan│     │ CoinGecko│
  │  (5 APIs)│     │   V2 API │     │    API   │
  └──────────┘     └──────────┘     └──────────┘
```

## Frontend Architecture

| Component        | Technology            | Purpose                                 |
| ---------------- | --------------------- | --------------------------------------- |
| Framework        | React 18 + TypeScript | Component-based UI                      |
| Build Tool       | Vite                  | Sub-second hot reload, optimized builds |
| Routing          | React Router v6       | Client-side SPA navigation              |
| State Management | React Context + Hooks | Auth state, user preferences            |
| Animation        | Framer Motion         | Page transitions, micro-interactions    |
| Charts           | Recharts              | Market data visualization               |
| Icons            | Phosphor Icons        | Consistent iconography                  |
| Wallet           | ThirdWeb SDK          | Multi-wallet connection                 |
| Styling          | Tailwind CSS          | Utility-first styling                   |

## Backend Architecture

| Component | Technology          | Purpose                        |
| --------- | ------------------- | ------------------------------ |
| Runtime   | Node.js + Express   | REST API server                |
| Language  | TypeScript          | Type safety                    |
| ORM       | Prisma              | Database abstraction           |
| Database  | SQLite → PostgreSQL | User data, activity, billing   |
| Auth      | JWT + bcrypt        | Token-based authentication     |
| API Proxy | Express middleware  | Secure proxy for external APIs |

## External Services

| Service               | Used For                                       | API Type  |
| --------------------- | ---------------------------------------------- | --------- |
| ChainGPT              | AI Chat, Contract Gen, Auditing, NFT Gen, News | REST      |
| Etherscan V2          | On-chain transaction data, wallet history      | REST      |
| CoinGecko             | Market prices, charts, market cap data         | REST      |
| ThirdWeb              | Wallet connection, balance queries             | SDK       |
| Google/GitHub/Twitter | OAuth authentication                           | OAuth 2.0 |

## Request Flow

1. User initiates action (e.g., "Analyze wallet 0x...")
2. Frontend sends authenticated request to BlockAI backend
3. Backend validates JWT token
4. Backend checks credit balance
5. Backend calls appropriate external API (ChainGPT/Etherscan)
6. Response processed and formatted
7. Credits deducted, activity logged
8. Response returned to frontend
9. Frontend renders with streaming animation
