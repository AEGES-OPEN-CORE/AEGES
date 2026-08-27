# Security Policy

## Scope

AEGES Open Core is an early public demonstration and reference architecture. It must not be used to protect production assets, make financial or legal determinations, or control real quarantine or restoration actions.

## Reporting a vulnerability

Please report suspected vulnerabilities privately to:

- **Email:** security@bwrci.org

Include:

- affected file and commit;
- reproduction steps;
- expected and observed behavior;
- potential impact;
- whether secrets or sensitive data may be exposed.

Do not include private keys, credentials, customer records, regulated data, or unnecessary exploit payloads. Do not publicly disclose an unresolved vulnerability before maintainers have had a reasonable opportunity to assess it.

No PGP key or guaranteed response time is currently published. Receipt and remediation timing depend on maintainer availability.

## Current security boundary

The public repository includes ordinary application controls such as input checks, HTTP security headers, CORS configuration, rate limiting, and provider timeouts. These controls have not been independently audited.

The repository does **not** currently establish:

- production post-quantum cryptography;
- immutable records;
- hardware-enforced trust;
- HSM or secure-element custody;
- trusted monotonic time;
- remote attestation;
- a distributed validator network;
- asset custody or enforceable quarantine;
- certified compliance with any regulatory or security framework.

Security claims must remain tied to reproducible artifacts and explicit scope.
