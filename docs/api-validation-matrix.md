# API Validation Matrix

## Purpose

This matrix documents the data-driven validation cases for the release taskboard demo API. Each case is automated in `tests/api/tasks.validation.spec.ts` and is designed to protect the documented API contract from common input and state-transition defects.

## Create-task validation

| Input class | Example | Expected result |
| --- | --- | --- |
| Required field missing | `{}` | `400` with `title is required` |
| Empty value | `title: ""` | `400` with `title is required` |
| Whitespace-only value | `title: "   "` | `400` with `title is required` |
| Wrong type | `title: 42` | `400` with `title is required` |
| Boundary accepted | 120-character title with surrounding whitespace | `201`, trimmed title retained |
| Boundary rejected | 121-character title | `400` with a maximum-length error |

## Completion-state validation

`completed` must be a JSON boolean. The automated data set checks string, number, `null`, and object values. Every invalid value must return `400` with `completed must be boolean`.

## Why this is data-driven

The tests iterate a defined data set instead of duplicating nearly identical test code for each input. That makes validation rules easy to extend, keeps expected results visible in one place, and prevents a new invalid type from being omitted accidentally.

## Scope

This is independent portfolio coverage for a demo REST API. It demonstrates input-boundary and negative-path test design. It is not presented as a substitute for security testing, fuzzing, production traffic analysis, or complete service-level validation.
