# SDKs

## Current Status

BlockAI does not yet offer public SDKs. All AI and data features are accessible through the [REST API](api-reference.md).

## Planned SDKs

| SDK                | Language                | Status  | ETA     |
| ------------------ | ----------------------- | ------- | ------- |
| **BlockAI.js**     | JavaScript / TypeScript | Planned | Q3 2026 |
| **BlockAI Python** | Python                  | Planned | Q4 2026 |

### BlockAI.js (Planned)

```javascript
import { BlockAI } from "@blockai/sdk";

const client = new BlockAI({ apiKey: "your-api-key" });

// Chat
const response = await client.chat("What is the TVL of Aave?");

// Wallet Analysis
const report = await client.analyzeWallet("0x...");

// Smart Contract
const contract = await client.generateContract("ERC-20 with 1M supply");
const audit = await client.auditContract(contract.code);
```

## Integration Without SDK

You can integrate BlockAI into any application using standard HTTP requests:

```bash
curl -X POST https://api.blockai.live/api/v1/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "What is Ethereum?", "provider": "chaingpt"}'
```

See the [API Reference](api-reference.md) for complete endpoint documentation.
