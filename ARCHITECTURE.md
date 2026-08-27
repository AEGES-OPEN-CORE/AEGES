# AEGES Architecture

**Status:** Public reference architecture  
**Scope:** Governed value protection, bounded quarantine, evidence, and restoration workflows  
**Relationship:** AEGES is an application layer aligned with OCUP Temporal Authority Governance

## Purpose

AEGES explores how transaction, wallet, bridge, and other value-bearing systems can respond to risk without allowing the governed system to control its own release or restoration.

The central AEGES rule is:

> **A system placed into quarantine must not be able to release itself.**

AEGES does not treat detection as authority. A model, heuristic, policy engine, or external alert may provide a risk signal; a separate governed path determines whether a capability or value flow is held, released, continued, or restored.

## Architectural relationship

| Layer | Responsibility |
|---|---|
| **OCUP** | Time-bounded operational authority, exact expiration, self-extension denial, and fail-closed capability gating |
| **QSAFP** | AI and autonomous-capability reference behavior beneath OCUP |
| **AEGES** | Risk inputs, bounded holds, quarantine evidence, independent release, and restoration workflows |
| **RAAVE** | Externally observable identity, compliance signaling, lifecycle visibility, and noncompliance detection |

AEGES can consume signals from many sources, but it should not grant those sources unilateral control over protected value or capability.

## Reference decision flow

```text
Transaction or action
        |
        v
Risk and policy inputs
        |
        v
Governed decision request
        |
        +---- insufficient or invalid authority ----> DENY / HOLD
        |
        v
Bounded quarantine or permitted action
        |
        v
Authenticated evidence record
        |
        v
Fresh external authority for release or restoration
```

A release is a new authority transaction. It is not a renewal, extension, or local override of the state that existed before quarantine.

## Logical components

### 1. Intake and normalization

Receives transaction or action data from an integration boundary and converts it into a defined request format.

Production requirements include:

- authenticated source identity;
- schema validation and canonical encoding;
- replay and duplicate detection;
- explicit jurisdiction, asset, scope, and policy context;
- separation of untrusted host fields from trusted authority state.

The current public Node service implements only basic application-level validation for demonstration inputs.

### 2. Risk-signal adapters

Risk inputs may include:

- deterministic policy rules;
- anomaly or behavioral indicators;
- model-provider output;
- provenance or credential failures;
- stale, missing, false, or inconsistent RAAVE signals;
- external regulatory or operator instructions.

A risk signal is not proof of wrongdoing and does not itself constitute authorization to seize, destroy, redirect, or permanently deny value.

The public repository includes mock and optional model-provider analysis paths. It does not establish validated fraud detection, forensic attribution, or autonomous legal determinations.

### 3. Authority evaluation

A production evaluator would determine whether a requested action is supported by fresh, correctly scoped, time-valid authority.

Relevant checks include:

- authorized decision origin;
- current boot or lifecycle generation;
- transaction identity and canonical request digest;
- expected prior state;
- permitted scope and duration;
- quorum and validator eligibility;
- trusted monotonic time;
- one-time consumption and replay rejection.

The governed application must not allocate its own trusted identity, enlarge its own scope, extend its own authority window, or fabricate the authority required to release itself.

### 4. Bounded quarantine

Quarantine is a governed safe state for a transaction, asset flow, wallet action, or related capability.

A production quarantine record should define:

- what is held or denied;
- why the state was entered;
- the authority and evidence supporting the decision;
- its temporal and jurisdictional scope;
- permitted review actions;
- expiration or escalation behavior;
- the exact fresh-authority conditions for release.

Quarantine is not destruction. AEGES does not claim that this public repository presently holds funds, controls a blockchain, freezes a bank account, or operates a regulatory wallet.

### 5. Evidence

Evidence should be append-only or tamper-evident and independently verifiable.

A production event record may include:

- canonical request digest;
- authority decision and reason code;
- validator or witness identities;
- trusted sequence, epoch, generation, and time data;
- prior-record linkage;
- applied capability state;
- release, denial, expiration, or restoration result;
- authenticated export metadata.

A digital signature supports origin and integrity. It does not by itself prove that the signed event is true. Strong evidence also requires a production path the governed or enforcement system cannot unilaterally fabricate, suppress, rewrite, or backdate.

### 6. Independent release and restoration

Release or restoration requires fresh authority whose production is independent of the quarantined component.

A robust design rejects:

- self-release;
- reuse of the decision that created the prior authority;
- stale or replayed validator votes;
- host-selected trusted sequence values;
- pre-authorized successors that activate automatically;
- renewal while the prior capability remains active;
- release after continuity, time, identity, or evidence failure.

Where a closed interval is required, the capability remains inactive for the defined interval before a new grant can take effect.

## Trust boundaries

### Untrusted or conditionally trusted

- transaction submitter;
- governed host and operating system;
- application-local clocks and counters;
- model-generated conclusions;
- provider confidence scores;
- user-supplied request identifiers;
- network transport without authenticated context;
- mock and simulation output.

### Production trust anchors

Production deployment would require some combination of:

- hardware-rooted key custody or secure elements;
- trusted monotonic time and state continuity;
- authenticated validators with defined eligibility;
- durable, ordered decision persistence;
- remote attestation;
- signed evidence export;
- independent or quorum witnessing;
- hardware-enforced capability gates where non-bypassability is claimed.

These anchors are not implemented by the public AEGES repository.

## Failure behavior

AEGES uses fail-safe logic rather than a generalized kill-switch model.

When required authority, validator availability, trusted time, persistence, continuity, or evidence integrity is unavailable, protected actions should move to a defined denial or bounded-hold state. The system should not silently treat missing governance infrastructure as permission.

Recovery must not be controlled solely by the component whose operation is being examined.

## Public implementation boundary

The repository currently contains:

- an Express demonstration service;
- transaction-input validation;
- mock analysis;
- optional xAI, OpenAI, and Anthropic adapters;
- simple response aggregation;
- health and application metrics;
- example configuration and deployment material.

It does not currently contain a production implementation of:

- asset custody or enforceable quarantine;
- blockchain bridge control;
- distributed Byzantine consensus;
- regulator or multi-agency coordination;
- production post-quantum cryptography;
- HSM-backed keys;
- trusted monotonic time;
- remote attestation;
- OCUP FPGA RTL or bitstreams;
- verified rollback or forensic attribution;
- cross-jurisdiction legal enforcement.

## Deployment profiles

### Public demonstration

Synthetic inputs, mock responses, local execution, and no control of real value.

### Integration research

Authenticated test feeds, isolated test networks, deterministic scenarios, and explicit separation between model signals and policy decisions.

### Controlled pilot

A contractually bounded environment with defined assets, operators, acceptance tests, evidence custody, incident handling, and no unsupported production or compliance claims.

### Production

Requires independent security review, operational governance, hardware and key-custody decisions, verified enforcement integration, legal authority, validated evidence handling, recovery procedures, and domain-specific certification.

## Verification roadmap

1. Reconcile public code, package scripts, and documentation.
2. Add deterministic unit and integration tests for the demonstration service.
3. Define canonical quarantine-decision, evidence, and release schemas.
4. Test stale, duplicate, replayed, malformed, and unauthorized requests.
5. Require fresh external authority for release.
6. Bind authority to trusted sequence, monotonic time, and durable state.
7. Integrate signed export and independent witnessing.
8. Define OCUP capability-gate interfaces.
9. Test fail-safe behavior under network, validator, host, and continuity failures.
10. Obtain independent review before making operational protection claims.

## References

- [AEGES Open Core](https://github.com/AEGES-OPEN-CORE/AEGES)
- [AEGES project site](https://getaeges.org)
- [OCUP](https://ocup.ai)
- [QSAFP Open Core](https://github.com/QSAFP-Core/qsafp-open-core)

---

**Detect risk. Bound the response. Preserve the evidence. Require fresh authority.**
