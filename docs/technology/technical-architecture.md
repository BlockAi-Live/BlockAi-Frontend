# Technical Architecture

## Stack Overview

| Layer              | Technology                           | Version    |
| ------------------ | ------------------------------------ | ---------- |
| **Frontend**       | React + TypeScript                   | React 18   |
| **Build**          | Vite                                 | 5.x        |
| **Styling**        | Tailwind CSS                         | 3.x        |
| **Backend**        | Node.js + Express + TypeScript       | Node 20    |
| **Database**       | SQLite → PostgreSQL                  | Prisma 5.x |
| **Authentication** | JWT + bcrypt + OAuth 2.0             | Custom     |
| **Wallet**         | ThirdWeb SDK                         | v5         |
| **AI**             | ChainGPT REST API                    | Latest     |
| **Hosting**        | Vercel (frontend) + Render (backend) | —          |

## Frontend Details

### Application Structure

```
src/
├── pages/          # Route-level components
├── components/     # Reusable UI components
│   ├── home/       # Landing page & navbar
│   ├── chat/       # Chat interface components
│   ├── dashboard/  # Dashboard widgets
│   ├── settings/   # Settings panels
│   └── access/     # Access gateway
├── context/        # React Context providers (Auth)
├── lib/            # API clients, utilities
│   ├── api.ts      # Backend API wrapper
│   └── coingecko.ts # CoinGecko client
└── client.ts       # ThirdWeb client config
```

### Key Libraries

- **Framer Motion** — Page transitions, micro-animations
- **Recharts** — Market data charts (Area, Line)
- **React Markdown** — AI response rendering
- **Prism React Renderer** — Solidity syntax highlighting
- **Phosphor Icons** — Consistent icon set
- **Sonner** — Toast notifications
- **React Confetti** — Celebration effects

### State Management

BlockAI uses **React Context** for global state:

- `AuthContext` — User session, JWT token, login/logout, user updates
- Component-level state via `useState` and `useEffect` hooks
- No external state management library (Redux, Zustand) — kept intentionally simple

## Backend Details

### API Structure

```
routes/
├── auth/          # Login, register, wallet auth, OAuth
├── billing/       # Credit management, payment simulation
├── access/        # Waitlist, access codes, admin
├── v1/
│   ├── chat       # AI chat (ChainGPT + Gemini proxy)
│   ├── smart-contract  # Contract generation & auditing
│   ├── nft/generate    # NFT image generation
│   ├── wallet-intel    # Wallet analysis
│   ├── decode-tx       # Transaction decoding
│   ├── signals         # AI market signals
│   ├── news            # ChainGPT news feed
│   ├── activity        # User activity log
│   └── me              # Current user profile
```

### Database Schema (Prisma)

Key models:

- **User** — id, email, fullName, walletAddress, points, isAccessGranted
- **Billing** — credits, tier, dailyUsageCount
- **Activity** — action type, cost, timestamp
- **Waitlist** — email, status, referral data
- **AccessCode** — code, maxUses, usedCount

## Deployment

| Component | Platform                                | URL Pattern         |
| --------- | --------------------------------------- | ------------------- |
| Frontend  | Vercel                                  | `blockai.live`      |
| Backend   | Render                                  | `api.blockai.live`  |
| Database  | Render (SQLite) → Supabase (PostgreSQL) | Internal            |
| Docs      | GitBook                                 | `docs.blockai.live` |
