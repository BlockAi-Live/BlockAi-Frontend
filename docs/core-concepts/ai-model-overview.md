# AI Model Overview

BlockAI integrates multiple AI models, each optimized for specific blockchain use cases.

## Available Models

### ChainGPT

**Primary AI engine** for all crypto-native tasks.

ChainGPT's models are specifically fine-tuned on blockchain data, Solidity code, DeFi protocols, and crypto market patterns. Unlike generic LLMs, ChainGPT understands:

- Solidity syntax and common vulnerability patterns
- DeFi protocol mechanics (AMMs, lending, staking)
- On-chain data structures (transactions, events, logs)
- Crypto-native terminology and context

**Modules used:**

| Module             | Endpoint                     | Purpose                             | Credit Cost |
| ------------------ | ---------------------------- | ----------------------------------- | ----------- |
| General Chat       | `/chat`                      | Blockchain Q&A, analysis, education | 1 credit    |
| Contract Generator | `/smart-contract` (generate) | Natural language → Solidity         | 2 credits   |
| Contract Auditor   | `/smart-contract` (audit)    | Security analysis of Solidity       | 2 credits   |
| NFT Generator      | `/nft/generate`              | Text → NFT artwork                  | 3 credits   |
| Crypto News        | `/news`                      | AI-curated news feed                | Free        |

### BlockAI 3.0

**Secondary model** powered by Google Gemini, available in the chat interface.

BlockAI 3.0 complements ChainGPT by offering:

- Broader general knowledge for non-crypto-specific queries
- Code generation in languages beyond Solidity
- More conversational and detailed responses

## Model Selection

Users can switch between models in the chat interface via the **model picker** in the top-left corner:

- **ChainGPT** — Best for crypto-specific questions, contract analysis, and on-chain data
- **BlockAI 3.0** — Best for general programming, broader research, and detailed explanations

## How AI Responses Are Delivered

BlockAI uses a **typewriter streaming** pattern:

1. The full response is received from the AI provider
2. The frontend reveals the text word-by-word with variable speed
3. Sentences pause briefly at punctuation for natural reading rhythm
4. A blinking cursor indicates the response is still streaming
5. Once complete, the response supports full Markdown rendering

This creates a natural, conversational feel while maintaining response accuracy.
