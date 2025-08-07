# 🔒 AEGES – AI-Enhanced Guardian for Economic Stability

AEGES is a sovereign-grade security system designed to safeguard national, institutional, and autonomous economic systems using AI-enhanced behavioral and cryptographic enforcement. As part of the QSAFP + AEGES security framework, AEGES deters economic manipulation, audits transactions, and protects the commons.

## 🚀 Core Features
- Cryptographic enforcement of community-defined rules
- Behavioral risk scoring and alerts
- Autonomous economic system readiness
- Compatible with CETE, DigiPie, and tokenization layers

## 📦 Repository Structure
```
/aeges
├── integration-kits/
│   ├── aeges_api_specification.json
│   ├── aeges_integration_examples.js
│   ├── aeges_mock_implementation.js
│   └── aeges_readme-xAI.md
├── LLMAdapter.js
├── .env.example
├── README.md
```

## 📘 Documentation
- [AEGES Academic Paper](./AEGES_%20AI-Enhanced%20Guardian%20for%20Economic%20Stability%20-%20Complete%20Academic%20Paper.pdf)
- [Integration Kit Specs](./aeges_api_specification.json)

## 🧠 LLM Integration Support

The integration kits now support a modular AI provider switch, enabling developers to use their preferred LLM (OpenAI, Claude, Grok, etc.) or fall back to mock mode.

### 🔧 How It Works

The `LLMAdapter.js` file provides a simple switchboard:

```js
import { getLLMResponse } from './LLMAdapter.js';

const response = await getLLMResponse("Explain AEGES security posture", "claude");
```

- Default provider is set via `.env` (`LLM_PROVIDER=mock`)
- Can be overridden per-call via a function argument

### 🛠️ Setup Instructions

1. Copy the example `.env` file and configure your keys:

```bash
cp .env.example .env
```

2. Fill in your preferred provider and credentials:

```env
LLM_PROVIDER=claude
CLAUDE_API_KEY=your-claude-api-key
```

3. Run a demo:

```bash
node integration-kits/aeges_integration_examples.js
```

### 🤖 Supported Providers
- `mock` (default, no API required)
- `openai`
- `claude`
- `grok`

Feel free to extend `LLMAdapter.js` to support more providers.

---

## 📫 Contributions
We welcome contributions across:
- Risk detection logic and alert systems
- Post-quantum cryptographic layers
- Integration examples and UI tooling

Fork the repo, submit a PR, and help build the guardian of global stability.

---

Max Davis · 2025 · DigiPie International / BWRCI
