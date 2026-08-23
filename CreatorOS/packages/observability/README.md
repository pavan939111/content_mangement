# Observability Package

## Purpose

Structured logging, metrics emission, correlation-ID propagation, and privacy denylist enforcement shared by BFF, worker, and connector-service.

## Technologies

- pino (Node structured logging)
- prom-client (Prometheus metrics)
- OpenTelemetry trace propagation utilities

## Key Documents

- `docs/tdd/TDD-08-rate-limiting-scheduling-observability.md` §10 for metric names, dimensions, alert thresholds
- `docs/requirements/non-functional/NFR-01-performance-v2.md` §4–5 for SLOs and alert alignment
- Privacy rules: never log tokens, request bodies, user content, or raw provider payloads

## Build & Run

<!-- Placeholder: logger initialization pattern, metrics registry setup -->
