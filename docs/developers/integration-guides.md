# Integration Guides

## Embedding BlockAI in Your dApp

BlockAI's API can be integrated into any Web3 application to add AI-powered intelligence capabilities.

### Prerequisites

- A BlockAI account with API access
- A valid JWT authentication token
- Understanding of REST API patterns

### Basic Integration Flow

```
1. Authenticate → POST /api/auth/login → receive JWT
2. Use JWT in Authorization header for all subsequent calls
3. Call AI endpoints as needed
4. Monitor credit balance via /api/billing/stats
```

### Example: Adding AI Chat to Your dApp

```javascript
// 1. Authenticate
const authResponse = await fetch("https://api.blockai.live/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "user@example.com", password: "pass" }),
});
const { token } = await authResponse.json();

// 2. Send a chat message
const chatResponse = await fetch("https://api.blockai.live/api/v1/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    content: "Analyze the current ETH price action",
    provider: "chaingpt",
  }),
});
const { answer } = await chatResponse.json();
console.log(answer);
```

### Example: Wallet Analysis Integration

```javascript
const analysis = await fetch("https://api.blockai.live/api/v1/wallet-intel", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ address: "0x..." }),
});
const report = await analysis.json();
```

### Example: Smart Contract Generation

```javascript
const contract = await fetch("https://api.blockai.live/api/v1/smart-contract", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    content:
      "Create an ERC-721 NFT collection with 10,000 supply and whitelist minting",
    mode: "generate",
  }),
});
const { result } = await contract.json();
```

## Rate Limits

- AI endpoints are rate-limited by credit balance
- Each action deducts 1–3 credits
- Monitor your balance via the billing stats endpoint
- Contact us for enterprise rate limits

## Error Handling

All errors return standard HTTP status codes:

| Code | Meaning                                         |
| ---- | ----------------------------------------------- |
| 400  | Bad request — check your request body           |
| 401  | Unauthorized — token missing or expired         |
| 403  | Forbidden — insufficient permissions or credits |
| 429  | Rate limited — slow down requests               |
| 500  | Server error — try again later                  |
