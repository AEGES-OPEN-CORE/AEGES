# AEGES Model-Provider Integration Kit

**Status:** Public prototype for synthetic testing

This folder contains the provider-adapter used by the AEGES demonstration service.

## Present

- xAI, OpenAI, Anthropic, and mock adapter configuration;
- basic input validation;
- sequential provider fallback;
- parallel response collection when aggregation is enabled;
- application-local latency and usage metrics;
- a JSON API-description artifact.

## Not established

- validated fraud detection;
- enforceable quarantine or release;
- Byzantine or governance consensus;
- production performance targets;
- post-quantum cryptography;
- Kubernetes or enterprise deployment;
- hardware-enforced OCUP integration;
- provider endorsement or partnership.

The aggregation code combines provider responses and confidence fields. It must not be described as independent validator quorum or authoritative consensus.

See the root [README](../../README.md), [architecture](../../ARCHITECTURE.md), [demo guide](../../DEMO.md), and [deployment notes](../../deployment_guide.md).

Use synthetic, non-sensitive data only.
