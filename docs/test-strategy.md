# Release Taskboard Test Strategy

## Purpose and scope

This strategy covers the release taskboard demo application, its REST API, browser UI, responsive mobile-web experience, and Android smoke launch. It is independent portfolio work and is designed to show how test effort is selected from product risk rather than from a tool checklist.

## Product risks and coverage

| Risk | Impact | Coverage approach | Evidence |
| --- | --- | --- | --- |
| A release task is created with incorrect or missing data | Release readiness can be misrepresented | API positive and negative tests, UI validation | `tests/api/tasks.api.spec.ts`, `tests/ui/tasks.ui.spec.ts` |
| A task completion state is lost or changed incorrectly | Teams may act on inaccurate release status | API state-transition test, UI completion journey | `tests/api/tasks.api.spec.ts`, `tests/ui/tasks.ui.spec.ts` |
| Critical user journey fails on a small touch screen | Mobile users cannot complete release work | Pixel 5 touch-based browser test | `tests/mobile/tasks.mobile.spec.ts` |
| The native application cannot start on a supported device | Mobile release is unusable at launch | Appium Android smoke check on Sauce Labs | `appium/android.smoke.ts`, `docs/execution-evidence/` |
| Assistive-technology users cannot access task entry | Product is inaccessible or non-compliant | axe WCAG A/AA scan and keyboard-first check, followed by manual validation | `tests/accessibility/taskboard.a11y.spec.ts` |
| A regression reaches release unnoticed | Customer-facing defect or rollback | Pull-request CI, test artifacts, risk-based release decision | `.github/workflows/quality.yml` |

## Test levels

- **API and integration:** REST status codes, payload validation, creation, update, deletion, and state transitions.
- **UI end-to-end:** high-risk browser workflows with user-visible assertions and stable locators.
- **Mobile web:** responsive browser interaction through Playwright's Pixel 5 profile. This is distinct from native mobile automation.
- **Native Android smoke:** cloud-device app launch and a visible product-content assertion using Appium, UiAutomator2, and Sauce Labs.
- **Accessibility:** automated WCAG A/AA rule scanning plus a keyboard-first task-entry flow. Manual checks remain required for screen readers, focus order, zoom/reflow, and content meaning.

## Entry criteria

1. Acceptance criteria are available and testable.
2. The build is deployable to the selected test environment.
3. Required test data is isolated and documented.
4. Known product risks have an assigned test approach.

## Exit criteria and release decision

- All critical API, UI, accessibility, and relevant mobile smoke checks pass.
- No open blocker or critical defects. High-severity defects require documented product-owner risk acceptance.
- New defects have reproducible evidence, environment details, and a clear owner.
- Test evidence and remaining risks are summarized in the release-quality report.

## Traceability

The risk table above links each risk to an executable suite or an explicit manual-validation activity. New acceptance criteria should be added to this table before implementation is considered release-ready.
