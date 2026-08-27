# AEGES Demonstration Deployment Notes

**Status:** Development reference  
**Not approved for production or protection of real assets**

## Scope

This document describes how to run the current public Node/Express demonstration in a local or isolated test environment.

The repository does not provide a production quarantine controller, distributed validator network, post-quantum implementation, blockchain custody system, regulator integration, trusted-time service, HSM configuration, remote-attestation path, or OCUP hardware gate.

## Recommended local mode

### Requirements

- Node.js 18 or later
- npm
- synthetic test data

```bash
git clone https://github.com/AEGES-OPEN-CORE/AEGES.git
cd AEGES
npm install
npm start
```

Inspect:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/demo
```

No external model credential is required for the mock adapter.

## Optional model-provider mode

The code includes adapters for xAI, OpenAI, and Anthropic. Users may provide their own credentials through environment variables:

```bash
export XAI_API_KEY="..."
export OPENAI_API_KEY="..."
export ANTHROPIC_API_KEY="..."
npm start
```

Provider APIs and model identifiers change independently. Confirm current provider documentation before testing.

Do not submit production, customer, private, financial, authentication, key, or regulated data. Model output is an analytical signal, not an enforceable governance decision or proof of fraud.

## Verified public path and remaining limits

A clean checkout has been verified for:

- dependency installation from `package-lock.json`;
- application startup;
- `GET /api/health`;
- `GET /api/demo`;
- `POST /api/analyze` through the normalized mock-provider path.

The package scripts now reference files present in the public tree. Nonexistent test, Kubernetes, metrics, and demo targets have been removed. Redis, PostgreSQL, and missing initialization scaffolding have been removed from Compose because the current service does not use them.

Remaining limits:

- no deterministic automated test suite is included yet;
- container execution has not been verified in an environment with Docker;
- external model-provider paths were not exercised during this bounded verification;
- provider APIs and model identifiers require current upstream confirmation;
- application health is not a security, custody, consensus, compliance, or production-readiness attestation.

## Container status

Docker and Compose files are retained as historical scaffolding. They should not be represented as verified deployment artifacts until a clean build demonstrates:

1. dependency installation from tracked inputs;
2. successful image creation;
3. non-root execution;
4. a passing health check using the correct file and declared dependencies;
5. no embedded default production credentials;
6. no missing bind-mounted or initialization files;
7. deterministic startup and shutdown;
8. vulnerability and secret scanning;
9. reproducible evidence tied to an exact commit.

## Production architecture requirements

A real AEGES deployment would additionally require:

### Enforcement

- a defined control point capable of holding or denying the target action;
- authenticated commands and canonical decision encoding;
- non-bypassable enforcement where claimed;
- fail-safe behavior when authority infrastructure is unavailable.

### Authority

- eligible validators or authorized human governance;
- fresh, scoped, time-valid decisions;
- replay, stale-context, duplicate, and one-consumption controls;
- trusted monotonic time and durable ordering;
- self-release and self-restoration denial.

### Evidence

- isolated signing-key custody;
- hash-linked or append-only records;
- authenticated evidence export;
- neutral or quorum witnessing;
- retention, privacy, and disclosure rules;
- proof that the governed host cannot rewrite, suppress, or backdate events.

### Operations

- explicit asset and jurisdiction scope;
- incident response and recovery;
- secrets rotation;
- dependency and supply-chain controls;
- observability without false “healthy” placeholders;
- capacity and failure testing;
- independent security review;
- legal authority for any hold, release, reporting, or restoration action.

### OCUP integration

Where OCUP hardware enforcement is claimed, the deployment must identify:

- the exact gated capability;
- the hardware and trust boundary;
- key and time sources;
- attestation path;
- validator-to-gate protocol;
- authority expiration behavior;
- closed-interval and fresh-authority rules;
- continuity and restart behavior;
- evidence exported from the enforcement boundary.

No such production integration is claimed by this public repository.

## Controlled-pilot checklist

A bounded pilot should define:

- exact scenario and acceptance predicates;
- synthetic or expressly authorized test assets;
- system owners and operators;
- threat model;
- authority and validator roles;
- quarantine and release policy;
- fail-safe state;
- evidence custody;
- exclusions and known limitations;
- stop conditions;
- incident contacts;
- data retention;
- final report and reproducibility package.

A pilot is not production certification, regulatory approval, or proof of general effectiveness.

## Claim policy

Do not infer or publish numerical claims for latency, accuracy, success rate, fraud reduction, loss avoidance, throughput, cost efficiency, scale, or availability from example configuration values or mock output.

Any future metric should identify:

- measured artifact and commit;
- environment;
- dataset or workload;
- sample size;
- methodology;
- result distribution;
- failure cases;
- independent reviewer, if any.

## Next deployment work

1. Reconcile `package.json` with the actual public tree.
2. Add deterministic tests.
3. repair and verify the container path.
4. remove unused infrastructure placeholders or implement them honestly.
5. add a minimal configuration template without secrets.
6. generate a reproducible local-demo evidence record.
7. define a separate controlled-pilot profile.
8. conduct independent review before any production claim.

See [README.md](README.md), [ARCHITECTURE.md](ARCHITECTURE.md), and [DEMO.md](DEMO.md) for the governing boundaries.

---

**Deployment configuration is not deployment evidence.**
