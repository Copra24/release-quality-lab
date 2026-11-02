# Skills Evidence Matrix

This matrix makes the portfolio easy for a recruiter or hiring manager to inspect. It distinguishes implemented work from environment-dependent execution.

| Capability | Evidence | Status |
| --- | --- | --- |
| Playwright + TypeScript UI automation | `tests/ui/tasks.ui.spec.ts` | Implemented; run after dependencies are installed |
| Mobile web QA | `tests/mobile/tasks.mobile.spec.ts` using Playwright Pixel 5 emulation and touch interaction | Implemented; CI-run once pushed |
| Playwright API testing | `tests/api/tasks.api.spec.ts` | Implemented; run after dependencies are installed |
| Test framework configuration | `playwright.config.ts` with retries, traces, screenshots, video, HTML report, and local web server | Implemented |
| CI/CD | `.github/workflows/quality.yml` | Implemented; runs when pushed to GitHub |
| REST API contract | `openapi/taskboard.openapi.yaml` | Implemented |
| Postman API checks | `postman/Taskboard.postman_collection.json` | Implemented |
| SQL test data | `sql/test-data.sql` | Implemented |
| Defect reporting | `docs/bug-reports/BUG-001-empty-task-feedback.md` | Implemented example |
| AI-assisted QA | README review-gated test generation and locator-remediation workflow | Implemented process documentation |
| Appium Android automation | `appium/android.smoke.ts` and [Sauce Labs execution evidence](execution-evidence/2026-11-02-sauce-labs-android-smoke.md) | Executed successfully on a Sauce Labs Samsung Galaxy S23 FE running Android 16 |

## Truthful CV wording after CI succeeds

“Built an independent QA portfolio with a TypeScript and Playwright UI/API test suite, OpenAPI and Postman API assets, SQL test data, and GitHub Actions quality checks. Executed an Appium Android smoke test on Sauce Labs and added a review-gated AI-assisted test design and maintenance workflow.”
