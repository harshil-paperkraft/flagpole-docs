---
title: Cleaning up stale flags
description: Find flags that have finished their job and remove them from code before they become debt.
---

Every release flag is temporary. Once it serves one variation to everyone, the other branch is dead code that still has to be read, tested and reasoned about.

## How Flagpole marks a flag stale

A flag is **stale** in an environment when, for 30 days:

- it served a single variation to 100% of evaluations, **and**
- it isn't marked **permanent**.

A flag with **no evaluations** for 30 days is marked **unused** — often a flag whose code was already removed.

## Finding them

```bash
curl "https://api.flagpole.dev/v1/projects/checkout/flags?status=stale&environment=prod" \
  -H "Authorization: Bearer $FLAGPOLE_TOKEN"
```

Or use the CLI, which also greps your repo for references:

```bash
npx @flagpole/cli stale --project checkout --env prod --scan ./src

new-checkout      stale 41d  serving true   3 references
  src/cart/render.ts:88
  src/cart/render.ts:132
  src/api/orders.ts:19
legacy-tax-calc   unused 64d               0 references  → safe to archive
```

## Removing a flag

1. Replace each call with the winning branch. Delete the losing branch and its tests.
2. Ship that change to production.
3. Wait until the flag shows **unused** (no evaluations), which confirms no running version still asks for it.
4. **Archive** the flag. Archived flags stay in history and can be restored for 90 days.

> [!TIP]
> Set an **expected removal date** when you create a flag. Owners get a reminder a week before, and it gives reviewers something concrete to hold you to.
