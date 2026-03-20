# First Workflow

This guide walks you through a complete end-to-end workflow: **analyzing a wallet → understanding a transaction → generating a contract → auditing it**.

## Scenario

You've noticed a whale wallet making large moves. You want to investigate it, understand what they're doing, and build a similar contract.

---

## Step 1: Scan the Whale Wallet

1. Open **Chain Scanner** from the sidebar
2. Paste the whale's Ethereum address
3. Click **Analyze**

BlockAI will return:

- ✅ **Wallet Profile** — Total value, age, transaction count
- ✅ **Token Holdings** — All ERC-20 tokens with balances
- ✅ **Transaction History** — Recent transactions decoded into human-readable format
- ✅ **AI Risk Assessment** — Is this wallet a bot? A fund? A fresh wallet?

## Step 2: Decode a Specific Transaction

From the wallet report, you spot an interesting contract interaction:

1. Copy the transaction hash
2. Switch to the **Transaction Decoder** tab
3. Paste the hash and click **Decode**

BlockAI breaks down:

- What function was called
- What tokens were transferred
- Dollar values at the time of transaction
- Plain English explanation of what happened

## Step 3: Ask the AI for Context

Open **AI Chat** and ask:

> _"The wallet 0x... just interacted with contract 0x... — what protocol is this, and what is the strategy they're executing?"_

The AI responds with protocol identification, strategy analysis, and potential risks.

## Step 4: Generate a Similar Contract

Based on your analysis, you want to create a staking contract:

1. Open **Smart Contracts** → **Generate**
2. Describe:

> _"Create an ERC-20 staking contract that accepts USDC deposits, distributes rewards proportionally every 24 hours, and allows withdrawal with a 7-day lock period"_

3. BlockAI generates the complete Solidity contract

## Step 5: Audit the Contract

1. Switch to **Audit** mode
2. Paste the generated contract (or click "Audit this" if available)
3. BlockAI returns a security report covering:
   - Reentrancy vulnerabilities
   - Access control issues
   - Integer overflow/underflow risks
   - Gas optimization suggestions

## Step 6: Set Alerts

1. Open **Smart Alerts**
2. Configure:
   - _"Alert me if the whale wallet moves more than 100 ETH"_
   - _"Alert me if USDC price depegs below $0.98"_
3. Choose notification channel (Telegram, Discord)

---

## Total Time: ~5 minutes

What would typically require Etherscan + Tenderly + ChatGPT + Remix + OpenZeppelin — five different tools — was accomplished in one place, in one session.
