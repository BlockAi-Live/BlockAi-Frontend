# Infrastructure

## Current Deployment

| Component | Provider        | Tier    | Purpose                        |
| --------- | --------------- | ------- | ------------------------------ |
| Frontend  | Vercel          | Pro     | Static SPA hosting, global CDN |
| Backend   | Render          | Starter | Node.js API server             |
| Database  | Render (SQLite) | —       | Embedded file database         |
| DNS       | Custom          | —       | `blockai.live`                 |

## Scaling Strategy

### Phase 1: Current (0–5K MAU)

- Vercel handles frontend scaling via CDN
- Render auto-sleeps and wakes on traffic
- SQLite handles read-heavy workloads efficiently
- External API rate limits are the primary bottleneck

### Phase 2: Growth (5K–25K MAU)

- **Database migration** → PostgreSQL on Supabase or Neon
  - Connection pooling for concurrent writes
  - Proper indexing for activity and billing queries
- **Redis cache** for hot data (market prices, news feed)
- **API rate limit management** — enterprise tiers for ChainGPT and CoinGecko

### Phase 3: Scale (25K–100K+ MAU)

- **Queue system** (BullMQ) for async AI jobs
- **Worker processes** for Smart Alerts background polling
- **CDN layer** for static assets and cached API responses
- **Multi-region** backend deployment

## Monitoring

- **Vercel Analytics** — Frontend performance and Core Web Vitals
- **Render Logs** — Backend error tracking and request logging
- **Client-side error handling** — Graceful fallbacks for API failures

## Cost Structure

| Component       | Current Cost    | At 10K MAU             |
| --------------- | --------------- | ---------------------- |
| Vercel Frontend | ~$0 (free tier) | ~$20/mo                |
| Render Backend  | ~$0 (starter)   | ~$25/mo                |
| PostgreSQL      | —               | ~$25/mo                |
| ChainGPT APIs   | Credit-based    | Variable (user-funded) |
| CoinGecko API   | Free tier       | ~$130/mo (Pro)         |
| Domain/SSL      | ~$12/yr         | ~$12/yr                |

The **largest variable cost** is always AI API consumption, which scales with user activity. The credit system ensures users fund their own consumption.
