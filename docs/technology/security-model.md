# Security Model

## Authentication Security

### Password Handling

- Passwords are hashed using **bcrypt** with a salt rounds factor of 10
- Plaintext passwords are **never stored** or logged
- Password comparison uses timing-safe bcrypt compare

### JWT Tokens

- Tokens are signed with a stable server-side secret
- Expiry is set to **24 hours**
- Tokens are validated on **every API request** via middleware
- Background token validation runs on page refresh
- Automatic logout on 401/403 responses from any API call

### OAuth

- Google, GitHub, and Twitter OAuth flows use standard OAuth 2.0
- Tokens from providers are exchanged server-side
- User sessions are managed via BlockAI's own JWT, not provider tokens

## API Security

### Key Management

- All third-party API keys (ChainGPT, Etherscan, CoinGecko) are stored as **environment variables** on the backend
- Keys are **never exposed** to the frontend
- The frontend communicates exclusively with BlockAI's own backend

### Rate Limiting

- Backend-level rate limiting via Express middleware
- Credit system provides natural throttling for AI-intensive endpoints
- CoinGecko rate limits handled gracefully with fallback UI states

### Request Validation

- JWT authentication required on all protected endpoints
- Input validation on user-submitted data
- Credit balance checked before any AI operation proceeds

## Wallet Security

### Read-Only Access

BlockAI **never** has access to private keys or seed phrases:

- Wallet connections are facilitated via ThirdWeb SDK
- We only receive the **public wallet address**
- Balance queries are read-only
- Transaction signing (for future contract deployment) happens in the user's own wallet
- BlockAI acts as a coordinator, not a custodian

### No Fund Custody

- BlockAI does not hold, transfer, or manage user funds
- All on-chain actions require explicit user wallet approval
- Smart contract deployments will use the user's own wallet for gas

## Data Security

### Data Minimization

- Chat messages are **not persisted** on the server — they exist only in the browser session
- Wallet data is queried on-demand and not cached long-term
- Activity logs store only action types and costs, not content

### Encryption

- All API communication uses **HTTPS/TLS**
- Database connections use encrypted channels in production
- Environment variables are managed through platform-native secret stores (Vercel, Render)
