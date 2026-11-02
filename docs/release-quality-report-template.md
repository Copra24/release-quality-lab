# Release Quality Report Template

> Template only. This document is not a claim that a production release occurred.

## Release details

| Field | Value |
| --- | --- |
| Release / build | `release-name-or-build` |
| Environment | `test / staging / production candidate` |
| Test window | `start time - end time` |
| QA owner | `name` |
| Decision | `GO / GO WITH RISK / NO-GO` |

## Coverage summary

| Area | Result | Evidence |
| --- | --- | --- |
| API and integration | `pass / fail / not run` | Test run or report link |
| Web UI regression | `pass / fail / not run` | Test run or report link |
| Mobile web | `pass / fail / not run` | Test run or report link |
| Native mobile smoke, if in scope | `pass / fail / not run` | Cloud-device session or report link |
| Accessibility | `pass / fail / manual follow-up` | axe result and manual-check notes |

## Defects and residual risks

| ID | Severity | Status | User impact | Release decision / mitigation |
| --- | --- | --- | --- | --- |
| `BUG-###` | `Blocker / Critical / High / Medium / Low` | `Open / Retest / Closed` | `brief impact` | `owner and action` |

## Decision rationale

Summarize what is covered, what remains uncertain, and why the release should proceed, proceed with documented risk, or stop. Link evidence rather than relying on a pass-count alone.
