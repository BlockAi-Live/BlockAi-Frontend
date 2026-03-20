# FAQ

## General

### What is BlockAI?

BlockAI is an AI-powered Web3 intelligence platform that combines wallet analytics, smart contract tools, market analysis, and an AI copilot into a single command center.

### Is BlockAI free to use?

Yes. You get **20 free AI credits** when you sign up — no credit card required. Daily rewards allow you to earn additional points for free every day.

### What AI model does BlockAI use?

BlockAI integrates **ChainGPT** (crypto-native AI) and **BlockAI 3.0** (powered by Google Gemini). You can switch between models in the chat interface.

### What chains does BlockAI support?

Currently, BlockAI supports **Ethereum Mainnet** and **Base** for wallet connections. Wallet analysis via Etherscan supports all EVM-compatible chains. Multi-chain expansion (Polygon, Arbitrum, Optimism) is on the roadmap.

---

## Account & Authentication

### How do I create an account?

You can sign up with email/password, Google, GitHub, Twitter, or by connecting an EVM wallet (MetaMask, Coinbase Wallet, Rainbow, or Rabby).

### What happens if I forget my password?

Use the password reset flow on the login page. A reset link will be sent to your registered email address.

### Can I connect multiple wallets?

Currently, one wallet per account is supported. Multi-wallet support is planned for a future release.

---

## AI Features

### How many credits do AI features cost?

- **AI Chat:** 1 credit per message
- **Smart Contract Generation:** 2 credits
- **Smart Contract Audit:** 2 credits
- **NFT Generation:** 3 credits
- **Wallet Analysis:** 1-2 credits
- **Market Signals:** 1 credit

### Are AI responses stored?

No. Chat messages exist only in your browser session and are not saved to the server. Refreshing or closing the page clears your conversation.

### How accurate are AI-generated smart contracts?

ChainGPT generates production-quality Solidity code, but **you should always audit any contract before deployment**. Use BlockAI's built-in auditor as a first step, and consider a professional audit for high-value contracts.

### Can the AI execute transactions on my behalf?

No. BlockAI is an analysis and generation tool. All on-chain actions (transfers, deployments, interactions) require your explicit approval in your own wallet.

---

## Credits & Rewards

### How do I earn more credits?

- **Daily Rewards:** Claim points every day (5–50 PTS per day, escalating with streak)
- **Referrals:** Earn points when referred users sign up
- **Purchase:** Buy credit packs (coming soon)

### What's the difference between credits and points?

**Credits** are consumed when you use AI features. **Points** are earned through engagement (daily claims, referrals) and will convert to tokens when the BlockAI token launches.

### What happens if I run out of credits?

You'll need to wait for daily reward claims or purchase additional credits. The platform will notify you when your balance is low.

---

## Security & Privacy

### Does BlockAI have access to my wallet?

No. Wallet connections are **read-only** via ThirdWeb. We can see your public address and balance, but we **cannot** access your private keys, sign transactions, or move your funds.

### Is my data encrypted?

Yes. All communication uses HTTPS/TLS. Passwords are hashed with bcrypt. API keys are stored server-side in encrypted environment variables.

### Where is my data stored?

User accounts and activity logs are stored in our database hosted on Render (US). Chat messages are **not stored** — they exist only in your browser.

---

## Technical

### Can I use BlockAI's API in my own project?

Yes. BlockAI exposes a REST API. See the [API Reference](developers/api-reference.md) for full documentation.

### What browser do I need?

BlockAI works in all modern browsers — Chrome, Firefox, Safari, Edge. A wallet extension (MetaMask, Rabby, etc.) is recommended for wallet features.

### Is BlockAI open source?

Not currently. Open-sourcing specific components is being considered for the future roadmap.

---

## Getting Help

- **Documentation:** You're reading it! 📖
- **Email:** support@blockai.live
- **Twitter:** [@BlockAIProtocol](https://twitter.com/BlockAIProtocol)
- **Discord:** Coming soon
