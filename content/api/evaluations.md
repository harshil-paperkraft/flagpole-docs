---
title: Evaluations
description: Evaluate flags for a context over HTTP, for environments where an SDK isn't an option.
---

Use an SDK whenever you can — it evaluates locally with no network call. This endpoint exists for shell scripts, edge functions and languages without an SDK.

## Evaluate all flags for a context

```
POST https://edge.flagpole.dev/v1/evaluate
```

Authenticated with a **server SDK key** or **client key**, not an API token.

```bash
curl -X POST https://edge.flagpole.dev/v1/evaluate \
  -H "Authorization: Bearer $FLAGPOLE_SDK_KEY" \
  -H "Content-Type: application/json" \
  -d '{"context": {"key": "user_1842", "plan": "pro", "country": "DE"}}'
```

```json
{
  "flags": {
    "new-checkout":  { "value": true,     "variation": "on", "reason": "RULE_MATCH", "rule_index": 0 },
    "search-ranker": { "value": "hybrid", "variation": "v2", "reason": "FALLTHROUGH" },
    "max-cart-items":{ "value": 200,      "variation": "default", "reason": "OFF" }
  }
}
```

With a client key, only flags marked **Available to client SDKs** are returned.

## Evaluate one flag

```
POST https://edge.flagpole.dev/v1/evaluate/{flagKey}
```

Same body; returns a single evaluation object. Unknown flags return `404 flag_not_found` — fall back to your default.

## Reasons

| Reason              | Meaning                                                   |
| ------------------- | --------------------------------------------------------- |
| `OFF`               | Targeting is off; served the off variation                |
| `TARGET_MATCH`      | Context key is in an individual target list               |
| `RULE_MATCH`        | Matched the rule at `rule_index`                          |
| `FALLTHROUGH`       | Targeting on, no rule matched                             |
| `PREREQUISITE_FAILED` | A prerequisite flag didn't serve the required variation |

## Latency

The edge runs in 14 regions and typically answers in under 30 ms. Still, cache the response for the length of a request rather than calling per flag check.
