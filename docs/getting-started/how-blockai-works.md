# How BlockAI Works

BlockAI operates as a **unified intelligence layer** that sits between you and the blockchain. It connects to multiple data sources and AI engines, then presents everything through a single, intuitive dashboard.

## Architecture at a Glance

```
┌─────────────────────────────────────────────────┐
│                  BlockAI Dashboard               │
│  ┌──────┐ ┌────────┐ ┌───────┐ ┌──────────────┐ │
│  │ Chat │ │ Market │ │ Scan  │ │  Contracts   │ │
│  └──┬───┘ └───┬────┘ └───┬───┘ └──────┬───────┘ │
│     │         │          │             │         │
├─────┴─────────┴──────────┴─────────────┴─────────┤
│              BlockAI Backend (API)                │
├──────────────────────────────────────────────────┤
│   ChainGPT    │  Etherscan  │  CoinGecko  │ ThirdWeb │
│   (5 APIs)    │  (On-chain) │  (Markets)  │ (Wallets)│
└───────────────┴─────────────┴─────────────┴──────────┘
```

## The Three Layers

### 1. Data Layer

BlockAI aggregates data from multiple sources in real-time:

- **Etherscan V2 API** — Transaction history, token balances, contract source code
- **CoinGecko API** — Market prices, charts, market cap, volume
- **ThirdWeb SDK** — Wallet connection, balance queries, contract deployment

### 2. Intelligence Layer

Raw data is processed through ChainGPT's AI models, which are purpose-built for blockchain:

- **Chat Model** — Answers blockchain questions with crypto-native context
- **Contract Generator** — Converts natural language to Solidity code
- **Contract Auditor** — Analyzes smart contracts for vulnerabilities
- **NFT Generator** — Creates NFT artwork from text prompts
- **News Engine** — Curates and summarizes crypto news

### 3. Presentation Layer

The React-based frontend presents everything in a clean, dark-mode dashboard:

- **Portfolio Dashboard** — Wallet balance, AI credits, activity, news
- **Interactive Charts** — Recharts-powered market visualization
- **Streaming AI Responses** — Word-by-word typewriter output for natural feel
- **Responsive Design** — Works on desktop and mobile

## Authentication

BlockAI supports three authentication methods:

| Method               | How It Works                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| **Email & Password** | Traditional registration with bcrypt-hashed passwords and JWT tokens                             |
| **OAuth**            | One-click sign-in via Google, GitHub, or Twitter                                                 |
| **Wallet Connect**   | Connect MetaMask, Coinbase Wallet, Rainbow, or Rabby. New wallets are prompted to set a username |

All methods issue a **JWT token** with 24-hour expiry. Tokens are validated on every API call.

## Credit System

BlockAI uses a **freemium credit model**:

- New users receive **20 free AI credits** on sign-up
- Each AI action (chat message, contract generation, audit, NFT) costs **1–3 credits**
- Credits can be purchased or earned through daily rewards and referrals
- Premium users get unlimited access
