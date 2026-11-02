# BUG-001: Blank task submission did not provide clear feedback

**Status:** Fixed in portfolio demo

**Severity:** Medium

## Environment

- Release Taskboard demo
- Chromium, local development server

## Steps to reproduce

1. Open the taskboard.
2. Leave the task title blank.
3. Submit the form.

## Expected result

The user receives a clear message that a task title is required and no task is created.

## Actual result before the fix

The API rejected the request but the UI did not give the user actionable feedback.

## Evidence and resolution

The API contract test verifies the `400` response and the UI test verifies the visible feedback. The application now presents `A task title is required.` and preserves the task list state.
