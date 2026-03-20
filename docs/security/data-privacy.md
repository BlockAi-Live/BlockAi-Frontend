# Data Privacy

## What We Collect

| Data           | Purpose                            | Stored         |
| -------------- | ---------------------------------- | -------------- |
| Email address  | Account identification, login      | Yes (database) |
| Full name      | Display name in UI                 | Yes (database) |
| Wallet address | Portfolio tracking, wallet connect | Yes (database) |
| Activity logs  | Usage tracking, credit accounting  | Yes (database) |
| Credit balance | AI feature access control          | Yes (database) |

## What We Do NOT Collect

| Data                        | Reason                                            |
| --------------------------- | ------------------------------------------------- |
| Private keys / seed phrases | Never accessed — wallet connections are read-only |
| Chat message content        | Messages exist only in your browser session       |
| Wallet transaction history  | Queried on-demand, not stored                     |
| Browsing activity           | No analytics tracking beyond basic page views     |
| IP addresses                | Not logged or stored                              |

## Data Processing

### AI Queries

When you use an AI feature, your query is:

1. Sent to BlockAI's backend over HTTPS
2. Forwarded to ChainGPT or Gemini for processing
3. Response returned to your browser
4. **Query content is NOT stored** by BlockAI

ChainGPT's data handling is governed by their own [privacy policy](https://www.chaingpt.org/privacy).

### Market Data

Market data (prices, charts) is fetched from CoinGecko's public API. No user data is sent to CoinGecko.

### Wallet Data

Wallet balances and transactions are queried from Etherscan's public API using only your **public wallet address** — a piece of information that is already publicly visible on the blockchain.

## Data Retention

| Data Type           | Retention                                    |
| ------------------- | -------------------------------------------- |
| User account        | Until account deletion requested             |
| Activity logs       | Indefinite                                   |
| Credit transactions | Indefinite                                   |
| Chat messages       | Browser session only (cleared on page close) |

## Your Rights

- **Access:** View your data via the dashboard and settings page
- **Deletion:** Request account deletion via support
- **Portability:** Export your activity data (planned feature)
- **Correction:** Update your profile information at any time

## Contact

For data privacy inquiries: privacy@blockai.live
