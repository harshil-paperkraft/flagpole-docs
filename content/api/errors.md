---
title: Errors
description: Error format, every error code, and what to do about each.
---

Errors use standard HTTP status codes and a consistent body:

```json
{
  "error": {
    "code": "version_conflict",
    "message": "Targeting for new-checkout in prod changed since version 14 (now 15).",
    "request_id": "req_01J8ZK3V9N"
  }
}
```

Include `request_id` when you contact support.

## Codes

| Status | Code                   | Cause                                               | What to do                                      |
| ------ | ---------------------- | --------------------------------------------------- | ----------------------------------------------- |
| 400    | `invalid_request`      | Body failed validation; `message` says which field  | Fix the request                                 |
| 400    | `invalid_rule`         | A clause uses an unknown operator or bad regex      | Check the operator table in [Targeting rules](../concepts/targeting-rules.md) |
| 401    | `unauthenticated`      | Missing, malformed or revoked token                 | Check the `Authorization` header                |
| 403    | `insufficient_scope`   | Token lacks the scope for this action               | Use a token with e.g. `flags:prod`              |
| 403    | `approval_required`    | Environment requires approval                       | A pending change was created; see `pending_change_id` |
| 404    | `not_found`            | Project, flag or environment doesn't exist          | Check keys — they're case-sensitive             |
| 409    | `already_exists`       | A flag with that key exists (possibly archived)     | Pick a new key or restore the archived flag     |
| 409    | `version_conflict`     | Someone changed targeting since you read it         | Re-read, reapply your change, retry             |
| 422    | `type_mismatch`        | Variation value doesn't match the flag type         | Send values of the flag's type                  |
| 429    | `rate_limited`         | Too many requests                                   | Wait for `Retry-After` seconds                  |
| 5xx    | `internal_error`       | Our problem                                         | Retry with backoff; check status.flagpole.dev   |

## Retrying

Safe to retry automatically: `429`, `502`, `503`, `504`. Use exponential backoff starting at 1 s with jitter, capped at 30 s.

`409 version_conflict` is safe to retry only after re-reading — resending the same body will fail again, and it should.
