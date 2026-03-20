# Data Flow

Understanding how data moves through BlockAI helps clarify what happens behind every user action.

## Core Data Flows

### 1. Authentication Flow

```
User → [Email/OAuth/Wallet] → Backend validates
     → JWT token issued (24h expiry)
     → Token stored in localStorage
     → Sent via Authorization header on every request
     → Background validation on page refresh
     → Auto-logout on 401/403 from any API call
```

### 2. AI Chat Flow

```
User types message
  → Frontend POST /api/v1/chat { content, provider }
  → Backend validates JWT
  → Backend checks credit balance ≥ 1
  → Backend calls ChainGPT/Gemini API
  → Response received
  → Credits deducted (1 credit)
  → Activity logged
  → Points awarded
  → Response returned to frontend
  → Frontend streams text word-by-word (typewriter effect)
```

### 3. Wallet Scan Flow

```
User pastes wallet address
  → Frontend POST /api/v1/wallet-intel { address }
  → Backend validates JWT
  → Backend calls Etherscan V2 API:
      - /api/v2?module=account&action=txlist
      - /api/v2?module=account&action=tokentx
      - /api/v2?module=account&action=balance
  → Raw on-chain data collected
  → Data formatted and sent to ChainGPT for analysis
  → AI generates human-readable wallet report
  → Combined response (raw data + AI analysis) returned
  → Frontend renders structured report
```

### 4. Market Data Flow

```
Dashboard loads
  → Frontend calls coingecko.getMarkets()
  → CoinGecko returns top coins (price, change, volume, cap)
  → Frontend renders Watchlist with sparkline charts
  → On coin select: coingecko.getMarketChart(coinId, days)
  → Chart data rendered via Recharts AreaChart
  → AI actions (Report, Alpha, TA) trigger ChainGPT analysis
```

### 5. Smart Contract Flow

```
User describes contract in natural language
  → Frontend POST /api/v1/smart-contract { content, mode: "generate" }
  → Backend proxies to ChainGPT Contract Generator
  → Solidity code returned with syntax highlighting
  → User can then switch to "audit" mode
  → POST /api/v1/smart-contract { content: solidity_code, mode: "audit" }
  → ChainGPT returns structured security report
```

## Data Storage

| Data                 | Where                            | Retention             |
| -------------------- | -------------------------------- | --------------------- |
| User accounts        | SQLite/PostgreSQL via Prisma     | Permanent             |
| Chat messages        | Client-side only (not persisted) | Session only          |
| Activity logs        | Database                         | Permanent             |
| Credit balance       | Database                         | Real-time updated     |
| Daily rewards streak | localStorage                     | Persistent per device |
| Wallet data          | Queried on-demand, not stored    | Not cached            |
| Market data          | Cached with short TTL            | Minutes               |

## Security Boundaries

- **API keys** (ChainGPT, Etherscan, CoinGecko) → Server-side only, never exposed to client
- **User passwords** → bcrypt-hashed, never stored in plaintext
- **JWT tokens** → Signed with server secret, validated on every request
- **Wallet connections** → Read-only via ThirdWeb, BlockAI never accesses private keys
