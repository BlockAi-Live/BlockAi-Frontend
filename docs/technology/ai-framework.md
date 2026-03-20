# AI Framework

## Core Philosophy

BlockAI uses **domain-specific AI** rather than generic models. All primary AI features are powered by ChainGPT — models specifically trained on blockchain data, Solidity code, and crypto market dynamics.

## ChainGPT Integration

### How We Connect

BlockAI's backend acts as a **secure proxy** between the user and ChainGPT's API:

1. User action triggers a request to BlockAI's backend
2. Backend validates authentication and credits
3. Backend calls ChainGPT's API with the appropriate endpoint
4. Response is processed, formatted, and returned
5. Credits are deducted and activity is logged

API keys are **never exposed** to the client.

### Modules

#### Chat AI

- **Endpoint:** ChainGPT General Chat
- **Use case:** Blockchain Q&A, market analysis, education
- **Input:** Natural language questions with optional chat history
- **Output:** Markdown-formatted AI responses

#### Smart Contract Generator

- **Endpoint:** ChainGPT Contract Generator
- **Use case:** Creating Solidity contracts from descriptions
- **Input:** Natural language description of desired contract
- **Output:** Complete Solidity source code with comments

#### Smart Contract Auditor

- **Endpoint:** ChainGPT Contract Auditor
- **Use case:** Security analysis of smart contract code
- **Input:** Solidity source code
- **Output:** Structured security report with vulnerability classifications

#### NFT Generator

- **Endpoint:** ChainGPT NFT Generator
- **Use case:** Creating NFT artwork from text prompts
- **Input:** Text description of desired artwork
- **Output:** Generated image URL

#### Crypto News

- **Endpoint:** ChainGPT News API
- **Use case:** AI-curated crypto news feed
- **Input:** Category filter, limit
- **Output:** Array of news articles with titles, sources, timestamps

## Secondary Model: BlockAI 3.0

For users who need broader AI capabilities beyond crypto-specific tasks, BlockAI 3.0 (powered by Google Gemini) is available in the chat interface. This model excels at:

- General programming questions
- Broader research topics
- Detailed explanations and comparisons
- Code generation in non-Solidity languages

## Response Streaming

All AI responses use a **typewriter streaming** pattern to create a natural conversation feel:

```
Receive full response → Split into words → Reveal 1-3 words per tick
→ Variable delay (20-50ms) → Pause at punctuation → Complete
```

This provides immediate feedback while maintaining response quality.
