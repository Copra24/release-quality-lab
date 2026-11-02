# API Performance Smoke Baseline

## Purpose

This lightweight check catches obvious API latency regressions before merge. It is a repeatable engineering smoke test, not a production load, stress, soak, capacity, or scalability assessment.

## Scenario

- Endpoint: `POST /api/tasks`
- Request body: valid release-task title
- Samples: 30 requests
- Concurrency: 5 workers
- Expected response: HTTP `201`
- Threshold: p95 response time at or below `1000 ms`

The script writes a sanitized JSON summary containing request counts, p95 latency, maximum latency, threshold, and pass status. GitHub Actions keeps this file as an artifact for 14 days.

## How to run

Start the demo API, then run:

```bash
npm run test:performance
```

Optional tuning is available through `PERFORMANCE_SAMPLES`, `PERFORMANCE_CONCURRENCY`, `PERFORMANCE_MAX_P95_MS`, and `PERFORMANCE_BASE_URL`.

## Interpreting results

A passing result demonstrates that the local test target handled the defined sample workload within the threshold. It does not represent a production service-level objective because the demo has no realistic network path, database, authentication, third-party dependencies, or production traffic shape. A production performance plan would add representative data, environment monitoring, ramp-up, sustained load, error budgets, and capacity targets agreed with stakeholders.
