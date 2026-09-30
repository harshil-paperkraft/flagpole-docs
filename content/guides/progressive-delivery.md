---
title: Progressive delivery
description: A rollout plan that moves from 1% to 100% with clear checkpoints and a rollback you've already tested.
---

Progressive delivery means exposing a change to a growing share of traffic while you watch whether it's healthy. The flag is the throttle; your metrics are the gauge.

## Before you start

Write down, in the flag's description:

- **The metric that would make you stop.** For example: checkout error rate > 0.5%, or p95 latency +50 ms.
- **Where you'll look.** A dashboard link, not "Grafana".
- **Who can roll back.** Ideally anyone on call.

## A typical schedule

| Stage | Audience                        | Hold for        | Check                              |
| ----- | ------------------------------- | --------------- | ---------------------------------- |
| 0     | `internal-staff` segment        | 1 day           | Nothing broken for people who'll tell you |
| 1     | 1%                              | 1 hour          | Error rate, latency, logs          |
| 2     | 10%                             | Half a day      | Business metric not moving the wrong way |
| 3     | 50%                             | 1 day           | Load on dependencies at peak       |
| 4     | 100%                            | 7 days          | Then schedule the cleanup          |

Adjust the holds for your traffic. At 1% you need enough requests to see a problem: if 1% is ten requests an hour, hold for longer or start at 5%.

## Scheduled rollouts

Instead of clicking through each stage, set a schedule on the flag:

```bash
curl -X PUT https://api.flagpole.dev/v1/projects/checkout/flags/new-checkout/environments/prod/schedule \
  -H "Authorization: Bearer $FLAGPOLE_TOKEN" \
  -d '{
    "steps": [
      {"at": "2026-10-06T09:00:00Z", "rollout": {"true": 1}},
      {"at": "2026-10-06T13:00:00Z", "rollout": {"true": 10}},
      {"at": "2026-10-07T09:00:00Z", "rollout": {"true": 50}},
      {"at": "2026-10-08T09:00:00Z", "rollout": {"true": 100}}
    ],
    "pause_on_alert": "checkout-error-rate"
  }'
```

`pause_on_alert` links a monitor from your alerting integration. If it fires, the schedule pauses and the flag's owner is notified. It does **not** roll back automatically — that decision stays with a person.

## Rolling back

Set the rollout back to 0% or turn targeting off. Changes reach SDKs within about a second. Rehearse this at stage 0 so the first time you do it isn't during an incident.

> [!WARNING]
> Rolling back the flag doesn't roll back data. If the new code path writes in a new format, make sure the old path can read it before you go past 1%.
