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
| Appium Android automation | `appium/android.smoke.ts` | Setup-ready; execution requires Android emulator/device and target app identifiers |

## Truthful CV wording after CI succeeds

“Built an independent QA portfolio with a TypeScript and Playwright UI/API test suite, OpenAPI and Postman API assets, SQL test data, and GitHub Actions quality checks. Added a configurable Appium Android smoke module and a review-gated AI-assisted test design and maintenance workflow.”

Do not state that the Android module has been executed until a device or emulator run is recorded.
