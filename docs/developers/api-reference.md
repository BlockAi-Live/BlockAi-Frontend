# API Reference

BlockAI's backend exposes a RESTful API. All endpoints are served over HTTPS.

## Base URL

```
Production: https://api.blockai.live
Development: http://localhost:3000
```

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are obtained via the login/register endpoints and expire after 24 hours.

---

## Auth Endpoints

### POST `/api/auth/register`

Create a new account.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "fullName": "John Doe"
}
```

**Response:** `200 OK`

```json
{
  "token": "eyJhbG...",
  "user": { "id": "...", "email": "...", "fullName": "..." }
}
```

### POST `/api/auth/login`

Authenticate with email and password.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### POST `/api/auth/wallet-login`

Authenticate with a wallet address.

**Body:**

```json
{
  "walletAddress": "0x..."
}
```

### POST `/api/auth/wallet-register`

Register a new user with a wallet address.

**Body:**

```json
{
  "walletAddress": "0x...",
  "username": "trader123"
}
```

---

## AI Endpoints

### POST `/api/v1/chat` 🔐

Send a message to the AI chat.

**Body:**

```json
{
  "content": "What is the current state of Ethereum L2s?",
  "provider": "chaingpt"
}
```

**Response:**

```json
{
  "answer": "Ethereum L2s are currently..."
}
```

**Cost:** 1 credit

### POST `/api/v1/smart-contract` 🔐

Generate or audit a smart contract.

**Body (Generate):**

```json
{
  "content": "Create an ERC-20 with burn mechanism",
  "mode": "generate"
}
```

**Body (Audit):**

```json
{
  "content": "pragma solidity ^0.8.0; ...",
  "mode": "audit"
}
```

**Cost:** 2 credits

### POST `/api/v1/nft/generate` 🔐

Generate NFT artwork.

**Body:**

```json
{
  "prompt": "A futuristic cyberpunk city with neon lights"
}
```

**Cost:** 3 credits

---

## Data Endpoints

### POST `/api/v1/wallet-intel` 🔐

Analyze a wallet address.

**Body:**

```json
{
  "address": "0x..."
}
```

### POST `/api/v1/decode-tx` 🔐

Decode a transaction hash.

**Body:**

```json
{
  "txHash": "0x..."
}
```

### GET `/api/v1/signals` 🔐

Get AI market signals.

### GET `/api/v1/news?limit=5`

Get crypto news feed (public endpoint).

### GET `/api/v1/activity` 🔐

Get user's activity history.

### GET `/api/v1/me` 🔐

Get current user profile.

---

## Billing Endpoints

### GET `/api/billing/stats` 🔐

Get credit balance and usage stats.

**Response:**

```json
{
  "billing": {
    "credits": 15,
    "tier": "FREE",
    "dailyUsageCount": 3
  }
}
```

---

🔐 = Requires JWT authentication
