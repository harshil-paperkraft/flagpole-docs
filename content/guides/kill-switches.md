---
title: Kill switches
description: Permanent flags that let on-call disable a dependency or feature in seconds.
---

A kill switch is a permanent boolean flag wrapped around something that can hurt you: a third-party API, an expensive query, a non-essential feature under load.

## The pattern

Name it after what turns **off**, and default it to **on**:

```js
// Flag: recommendations-enabled   (permanent, default true)
if (flags.bool('recommendations-enabled', ctx, true)) {
  items = await recommendations.fetch(user, { timeout: 300 });
} else {
  items = popularItemsCache.get();
}
```

Two details matter:

- **Code default `true`.** If Flagpole is unreachable, the feature keeps working. A kill switch that kills the feature when the flag service blips is worse than no switch.
- **A real fallback.** "Off" must still render a working page. Test the off path in CI (see [Testing with flags](./testing-with-flags.md)).

## Make them findable

During an incident nobody wants to search. Tag every kill switch `kill-switch` and add it to your runbook:

```markdown
### Recommendations service is slow or down
1. Open https://app.flagpole.dev/checkout/prod/flags?tag=kill-switch
2. Turn off `recommendations-enabled`
3. Confirm p95 on /home drops within 2 minutes
```

## Permissions

Give on-call engineers the **Kill switch operator** role in production. It can toggle targeting on flags tagged `kill-switch` — and nothing else — without approval, even when the environment requires approval for other changes.

## Partial kill

Sometimes you only want to shed load from one region or one noisy tenant. Add a rule above the fallthrough:

| Rule                            | Serve   |
| ------------------------------- | ------- |
| `region is one of ap-south-1`   | `false` |
| Fallthrough                     | `true`  |
