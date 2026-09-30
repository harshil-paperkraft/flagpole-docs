---
title: Percentage rollouts
description: How bucketing works, why users stay in their bucket, and how to roll out by account instead of by user.
---

A percentage rollout splits contexts between variations — say 10% `true`, 90% `false`. You can use one as the fallthrough or as the result of any rule.

## Bucketing is deterministic

Flagpole doesn't roll dice on each evaluation. It hashes the context key with the flag key and a salt:

```
bucket = sha1(flagKey + "." + salt + "." + contextKey) → 0–99,999
```

So the same user gets the same answer on every server and every request, with no shared state. Increasing from 10% to 20% keeps the original 10% and adds new users — nobody flips from on back to off.

## Bucketing by another attribute

By default the context `key` is used. For B2B products you usually want everyone in an account to see the same thing. Set **Bucket by** to `accountId`:

```js
flags.bool('new-billing', { key: user.id, accountId: user.accountId }, false);
```

Now all users in `acct_77` land in the same bucket. If `accountId` is missing from a context, that context falls back to its `key` and a warning is recorded in the flag's insights.

## Reshuffling

Changing a flag's salt (**Rollout → Reshuffle buckets**) reassigns everyone. Do this only when you intentionally want a fresh sample — for example, re-running an experiment — never in the middle of a rollout.

## Rollouts are not experiments

A rollout answers "is it safe?" An experiment answers "is it better?" Rollouts don't correct for sample-ratio mismatch or compute significance. If you need a result you'd defend in a planning meeting, use **Experiments**, which builds on the same bucketing.
