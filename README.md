# Release Quality Engineering Lab

[![Quality Checks](https://github.com/Copra24/release-quality-lab/actions/workflows/quality.yml/badge.svg)](https://github.com/Copra24/release-quality-lab/actions/workflows/quality.yml)

An independent QA engineering portfolio project by Clifford Folefac. It demonstrates a practical quality approach across UI, API, test data, CI, and Android automation setup. This is portfolio work, not client or employer work.

## What this repository demonstrates

| Area | Evidence in this repository |
| --- | --- |
| UI automation | Playwright + TypeScript tests covering task creation and completion |
| Cross-browser web QA | Chromium, Firefox, and WebKit projects for UI and accessibility regression coverage |
| Mobile web QA | Playwright Pixel 5 emulation with a touch-based release-task journey |
| API testing | Playwright API checks, OpenAPI contract, and a Postman collection |
| Test data | SQL fixture and isolated in-memory demo data |
| CI | GitHub Actions workflow running the Playwright suite on every pull request |
| Mobile automation | Appium + UiAutomator2 Android smoke test executed on Sauce Labs |
| Accessibility | Automated WCAG A/AA scan and keyboard-first release-task journey |
| Performance | API performance smoke with concurrent requests, p95 threshold, and CI artifact |
| AI-assisted QA | Documented, review-gated workflow for accelerating test drafting and maintenance |

## Test strategy

The sample system is a release taskboard with a small web UI and REST API. Coverage is intentionally layered:

1. **API checks** validate successful creation, state updates, deletion, and invalid payload handling.
2. **UI checks** validate the highest-risk user journey: creating and completing a release task.
3. **Test data** remains independent of production data. `sql/test-data.sql` documents a repeatable fixture and data assertion.
4. **Mobile** is kept as a separate smoke layer because it needs a real emulator or device to be meaningful.

The repository runs UI and accessibility coverage successfully on Chromium, Firefox, and WebKit. API checks run on Chromium because they exercise the service directly rather than browser rendering. It also runs a mobile-Chrome emulation project using Playwright's Pixel 5 device profile. This is browser-responsive and touch-interaction coverage. It is not presented as native Android or Appium execution. See the [cross-browser execution evidence](docs/execution-evidence/2026-11-02-cross-browser-quality-checks.md).

## Run locally

```bash
npm install
npx playwright install chromium firefox webkit
npm test
```

Useful focused runs:

```bash
npm run test:ui
npm run test:api
npm run test:a11y
npm run test:report
```

## Accessibility coverage

The Playwright accessibility suite uses axe-core to scan the release taskboard against WCAG A and AA rules. It also verifies the keyboard-first task-entry journey and accessible form control names. Automated scans are a safety net, not a substitute for manual checks of keyboard order, screen-reader announcements, zoom and reflow, and meaningful user journeys.

## API assets

- Contract: [`openapi/taskboard.openapi.yaml`](openapi/taskboard.openapi.yaml)
- Postman collection: [`postman/Taskboard.postman_collection.json`](postman/Taskboard.postman_collection.json)
- SQL test data: [`sql/test-data.sql`](sql/test-data.sql)

## AI-assisted testing workflow

AI is used as an accelerator, not an authority:

1. Draft test ideas from acceptance criteria and risk scenarios.
2. Review generated tests for stable selectors, meaningful assertions, data isolation, and business relevance.
3. Run the tests locally and in CI.
4. Investigate failures before changing tests. For locator failures, use AI-assisted remediation suggestions, then review and validate them manually.
5. Keep human accountability for test strategy, acceptance decisions, release evidence, and final code changes.

This provides a defensible explanation of AI-assisted test generation and maintenance without claiming unattended or autonomous quality decisions.

## Dependency security

The CI workflow runs `npm audit --omit=dev` to check runtime dependencies. The demo application has no known runtime dependency vulnerabilities. Development-tool findings are reviewed separately rather than fixed with breaking changes by default.

## Sample bug report

See [`docs/bug-reports/BUG-001-empty-task-feedback.md`](docs/bug-reports/BUG-001-empty-task-feedback.md) for an example of a clear, reproducible defect report.

## Test planning and release evidence

- [Risk-based test strategy](docs/test-strategy.md)
- [Release-quality report template](docs/release-quality-report-template.md)

These artifacts show the decisions that sit around automated checks: risk selection, test-level ownership, entry and exit criteria, remaining-risk communication, and a documented GO/NO-GO outcome.

## Performance smoke

The API performance smoke sends a small concurrent workload to `POST /api/tasks`, requires successful `201` responses, and enforces a p95 latency threshold. It publishes a JSON summary as a GitHub Actions artifact. Read the [scope and limitations](docs/performance-baseline.md) before interpreting it as a production performance result.

The [latest recorded Quality Checks execution](docs/execution-evidence/2026-11-02-quality-checks.md) passed both the Playwright and API performance jobs.

## Android Appium module

The Appium module was executed successfully on a Sauce Labs Samsung Galaxy S23 FE running Android 16. It includes a launch smoke check and a native cart journey that adds `Sauce Labs Backpack`, opens `My Cart`, and verifies the cart state through stable resource IDs and accessibility labels. See the [launch evidence](docs/execution-evidence/2026-11-02-sauce-labs-android-smoke.md) and [cart-journey evidence](docs/execution-evidence/2026-11-02-android-cart-journey.md). Setup instructions are in [`appium/README.md`](appium/README.md).

For a cloud-device run without Android Studio, see [`docs/sauce-labs-setup.md`](docs/sauce-labs-setup.md). The Sauce workflow is manual and uses GitHub secrets, so credentials are not committed or exposed in CI logs.

For an inspectable mapping of every claimed capability to an artifact, see [`docs/skills-evidence.md`](docs/skills-evidence.md).
