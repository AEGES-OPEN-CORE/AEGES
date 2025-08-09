# 🔒 AEGES – AI-Enhanced Guardian for Economic Stability

AEGES is a sovereign-grade security system designed to safeguard national, institutional, and autonomous economic systems using AI-enhanced behavioral and cryptographic enforcement. As part of the QSAFP + AEGES security framework, AEGES deters economic manipulation, audits transactions, and protects the commons.
AEGES is a sovereign-grade security system designed to safeguard national, institutional, and autonomous economic systems using AI-enhanced behavioral and cryptographic enforcement. As part of the QSAFP + AEGES security framework, AEGES deters economic manipulation, audits transactions, and protects the commons.

**Standards Alignment:**  
AEGES integrates directly with the **NIST Cybersecurity Framework 2.0** and is engineered for compatibility with the **NIST Post-Quantum Cryptography (PQC) standards** — including Kyber, Dilithium, and Falcon — ensuring interoperability and compliance from day one.

AEGES complements NIST/OQS cryptographic standards by adding the **AI Behavior Evaluation Engine (ABEE)**, **tamper-evident tracing**, and **disincentivization protocols** for the critical infrastructure and economic stability domains.

## Where AEGES Fits in PQC

- **NIST / OQS:** Provide the quantum-safe math.
- **AEGES:** Protects the systems where failure is not an option, combining PQC math with continuous AI oversight and immutable fraud detection.

AEGES is not a replacement for universal encryption libraries.  
It is a specialized quantum-resistant security layer for **high-impact systems** where breaches would have catastrophic consequences.

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
## Future Roadmap

AEGES is purpose-built for **high-impact domains** such as economic stability and critical infrastructure protection.  
Expansion into general encryption and digital signature solutions will be evaluated as NIST PQC standards and global adoption mature.

Max Davis · 2025 · DigiPie International / BWRCI
