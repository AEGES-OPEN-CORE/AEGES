# AEGES Public Demonstration Guide

**Status:** Reference demonstration only
**Data:** Synthetic inputs only
**Effect:** No real funds, wallets, chains, accounts, infrastructure, or regulators are controlled

## What this demo shows

The public AEGES service demonstrates a narrow software flow:

1. receive sample transaction data;
2. perform basic input validation;
3. route the request to a mock or optional model-provider adapter;
4. return analytical text and application metrics.

It is useful for examining integration shapes and discussing how risk signals could feed a governed quarantine workflow.

It does **not** prove fraud, freeze assets, stop ransomware, roll back a system, establish attribution, conduct regulatory reporting, or enforce an OCUP hardware decision.

## Local start

### Requirements

- Node.js 18 or later
- npm

```bash
git clone https://github.com/AEGES-OPEN-CORE/AEGES.git
cd AEGES
npm install
npm start
```

The service defaults to `http://localhost:3000`.

## Scenario 1: Health and provider visibility

```bash
curl http://localhost:3000/api/health
```

Expected behavior:

- the service returns its local process status;
- enabled provider adapters are listed;
- mock mode is available without external credentials;
- latency and success fields reflect this running process, not certified performance.

A healthy response means the demo endpoint responded. It is not a security, compliance, custody, consensus, or production-readiness attestation.

## Scenario 2: Generate a synthetic transaction

```bash
curl http://localhost:3000/api/demo
```

The endpoint creates example transaction data for local experimentation. Addresses, values, and identifiers are synthetic.

## Scenario 3: Submit a mock analysis request

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "transactionData": {
      "id": "demo-001",
      "amount": 1000,
      "from": "0x1111",
      "to": "0x2222",
      "timestamp": 1787788800000,
      "network": "demo"
    }
  }'
```

The service validates the required fields, creates an analysis prompt, and uses an enabled provider path. Without external credentials, the mock adapter returns simulated analytical text.

The response is not a risk oracle or enforceable decision.

## Scenario 4: Optional provider adapters

Users may supply their own provider credentials:

```bash
export XAI_API_KEY="..."
export OPENAI_API_KEY="..."
export ANTHROPIC_API_KEY="..."
```

Provider behavior, model names, API formats, pricing, rate limits, and availability may change independently of this repository.

Use only synthetic, non-sensitive inputs. Do not send customer data, private financial records, authentication material, private keys, production transactions, or regulated information through this reference service.

Model output must be treated as an untrusted or conditionally trusted risk signal. It must not directly authorize seizure, destruction, permanent denial, quarantine release, or restoration.

## Intended governed-quarantine scenario

The architecture anticipates a future deterministic scenario with separate signal and authority paths:

```text
Synthetic suspicious action
        |
        v
Risk signal produced
        |
        v
Governed policy evaluation
        |
        +---- invalid / insufficient authority ----> DENY or HOLD
        |
        v
Bounded quarantine record
        |
        v
Authenticated evidence
        |
        v
Fresh independent authority required for release
```

The key assertion is not “the model correctly identified a criminal.” It is:

> **The component placed into quarantine cannot release itself.**

A valid future test suite should verify:

| Test | Expected result |
|---|---|
| Self-release request | Denied |
| Replayed release decision | Denied |
| Stale validator context | Denied |
| Missing trusted time or continuity | Fail-safe hold |
| Duplicate transaction identity | Denied or idempotently resolved |
| Fresh authorized release with correct prior state | Accepted once |
| Second consumption of the same release authority | Denied |
| Evidence-chain mutation | Detected |

Those assertions require implementation and deterministic evidence. They are roadmap targets, not current public-repository test results.

## Historical scenarios

Older AEGES materials described bridge theft, wallet draining, ransomware response, cross-chain coordination, regulatory quarantine wallets, automatic recovery, and multimillion-dollar loss avoidance.

Treat those examples as design narratives unless a specific artifact provides:

- exact code and commit identity;
- reproducible test instructions;
- deterministic expected results;
- actual observed results;
- environment and dependency versions;
- evidence hashes or signed records;
- explicit limitations;
- independent review where claimed.

Illustrative dollar values, progress bars, model confidence values, mock latency, and console messages are not validation evidence.

## Safety boundaries

Do not use the public demo to:

- make real financial or legal determinations;
- transmit sensitive or regulated data;
- custody, redirect, freeze, or destroy value;
- represent model output as proof of fraud;
- claim NIST, ISO, regulator, financial-institution, or agency approval;
- claim production post-quantum protection;
- claim hardware-enforced OCUP integration;
- test malware against systems you do not own or lack permission to assess.

## Evidence contribution format

A useful public contribution should include:

1. scenario name and threat model;
2. repository commit SHA;
3. exact command;
4. clean-environment prerequisites;
5. expected and observed outputs;
6. pass/fail predicate;
7. evidence artifact and digest;
8. known limitations;
9. confirmation that only authorized synthetic or isolated test resources were used.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the target governance model and [README.md](README.md) for the current implementation boundary.

---

**A demonstration illustrates a claim. Reproducible evidence tests it.**
