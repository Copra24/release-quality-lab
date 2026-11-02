# Release Quality Engineering Lab

An independent QA engineering portfolio project by Clifford Folefac. It demonstrates a practical quality approach across UI, API, test data, CI, and Android automation setup. This is portfolio work, not client or employer work.

## What this repository demonstrates

| Area | Evidence in this repository |
| --- | --- |
| UI automation | Playwright + TypeScript tests covering task creation and completion |
| API testing | Playwright API checks, OpenAPI contract, and a Postman collection |
| Test data | SQL fixture and isolated in-memory demo data |
| CI | GitHub Actions workflow running the Playwright suite on every pull request |
| Mobile automation | Configurable Appium + UiAutomator2 Android smoke module |
| AI-assisted QA | Documented, review-gated workflow for accelerating test drafting and maintenance |

## Test strategy

The sample system is a release taskboard with a small web UI and REST API. Coverage is intentionally layered:

1. **API checks** validate successful creation, state updates, deletion, and invalid payload handling.
2. **UI checks** validate the highest-risk user journey: creating and completing a release task.
3. **Test data** remains independent of production data. `sql/test-data.sql` documents a repeatable fixture and data assertion.
4. **Mobile** is kept as a separate smoke layer because it needs a real emulator or device to be meaningful.

## Run locally

```bash
npm install
npx playwright install chromium
npm test
```

Useful focused runs:

```bash
npm run test:ui
npm run test:api
npm run test:report
```

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

## Sample bug report

See [`docs/bug-reports/BUG-001-empty-task-feedback.md`](docs/bug-reports/BUG-001-empty-task-feedback.md) for an example of a clear, reproducible defect report.

## Android Appium module

The Appium module is setup-ready but should only be described as **executed** after it runs against an emulator or device. Setup instructions are in [`appium/README.md`](appium/README.md).

## Suggested next evidence

After the first GitHub Actions run succeeds, add a screenshot of the workflow result to a GitHub issue or release note. After an Android run succeeds, add the command, device details, and a sanitized execution result. This keeps the portfolio honest and useful in interviews.

For an inspectable mapping of every claimed capability to an artifact, see [`docs/skills-evidence.md`](docs/skills-evidence.md).
