# Security Overview

## Our Approach

Security is foundational to BlockAI's architecture, not an afterthought. Every component is designed with the principle of **minimum privilege** and **defense in depth**.

## Security Layers

### 1. Authentication & Authorization

- **JWT-based sessions** with 24-hour expiry
- **bcrypt password hashing** with salt rounds
- **OAuth 2.0** for social login (Google, GitHub, Twitter)
- **Automatic session invalidation** on 401/403 API responses
- **Background token validation** on page refresh

### 2. API Security

- **Server-side API key management** — third-party keys never reach the browser
- **Input validation** on all user-submitted data
- **Credit-based rate limiting** — natural throttling for AI endpoints
- **CORS configuration** restricting allowed origins

### 3. Wallet Security

- **Read-only wallet connections** via ThirdWeb
- **No private key access** — BlockAI never touches seed phrases
- **No fund custody** — all on-chain actions require user wallet approval
- **Public address only** — we store wallet addresses, not keys

### 4. Data Security

- **HTTPS/TLS encryption** on all communications
- **Chat messages not persisted** — only exist in browser session
- **Environment variable management** via platform-native secret stores
- **Database encryption** in production environment

## Vulnerability Disclosure

If you discover a security vulnerability, please report it responsibly:

- **Email:** security@blockai.live
- **Response time:** We aim to acknowledge reports within 48 hours

Do **not** publicly disclose vulnerabilities before we've had a chance to address them.

## Audit Status

| Component                      | Status                         |
| ------------------------------ | ------------------------------ |
| Smart Contract code generation | AI-audited (ChainGPT)          |
| Backend API                    | Internal review completed      |
| Authentication flow            | Tested and hardened            |
| Third-party integrations       | Validated via production usage |
| Full external audit            | Planned for Q3 2026            |
