# Skills Evidence Matrix

This matrix makes the portfolio easy for a recruiter or hiring manager to inspect. It distinguishes implemented work from environment-dependent execution.

| Capability | Evidence | Status |
| --- | --- | --- |
| Playwright + TypeScript UI automation | `tests/ui/tasks.ui.spec.ts` | Implemented; run after dependencies are installed |
| Cross-browser web testing | Chromium, Firefox, and WebKit projects in `playwright.config.ts` with [execution evidence](execution-evidence/2026-11-02-cross-browser-quality-checks.md) | Executed successfully for UI and accessibility coverage |
| Mobile web QA | `tests/mobile/tasks.mobile.spec.ts` using Playwright Pixel 5 emulation and touch interaction | Implemented; CI-run once pushed |
| Playwright API testing | `tests/api/tasks.api.spec.ts` and [API contract CI evidence](execution-evidence/2026-11-04-api-contract-quality-checks.md) | Executed successfully in GitHub Actions for positive response and negative-path coverage |
| Test framework configuration | `playwright.config.ts` with retries, traces, screenshots, video, HTML report, and local web server | Implemented |
| CI/CD | `.github/workflows/quality.yml` | Implemented; runs when pushed to GitHub |
| REST API contract and negative paths | `openapi/taskboard.openapi.yaml`, `scripts/validate-openapi.js`, and `tests/api/tasks.api.spec.ts` | OpenAPI document validated in CI; response shapes, request validation, type errors, and not-found cases covered |
| Postman API checks | `postman/Taskboard.postman_collection.json` | Implemented |
| SQL test data | `sql/test-data.sql` | Implemented |
| Defect reporting | `docs/bug-reports/BUG-001-empty-task-feedback.md` | Implemented example |
| Test planning and release readiness | `docs/test-strategy.md` and `docs/release-quality-report-template.md` | Implemented templates with risk, traceability, entry/exit, and GO/NO-GO criteria |
| Performance testing fundamentals | `scripts/performance-smoke.js`, `docs/performance-baseline.md`, and [Quality Checks evidence](execution-evidence/2026-11-02-quality-checks.md) | Executed API smoke with concurrency, p95 threshold, and CI artifact. Not represented as production load testing. |
| AI-assisted QA | README review-gated test generation and locator-remediation workflow | Implemented process documentation |
| Appium Android automation | `appium/android.smoke.ts`, [launch evidence](execution-evidence/2026-11-02-sauce-labs-android-smoke.md), [cart-journey evidence](execution-evidence/2026-11-02-android-cart-journey.md), and [checkout-journey evidence](execution-evidence/2026-11-02-android-checkout-journey.md) | Executed launch, cart, and checkout-through-review journeys successfully on a Sauce Labs Samsung Galaxy S23 FE running Android 16 |

## Truthful CV wording after CI succeeds

“Built an independent QA portfolio with a TypeScript and Playwright UI/API test suite, OpenAPI and Postman API assets, SQL test data, and GitHub Actions quality checks. Executed an Appium Android smoke test on Sauce Labs and added a review-gated AI-assisted test design and maintenance workflow.”
