---
title: Flags
description: Flag types, variations, defaults, and the lifecycle of a flag from creation to removal.
---

A flag is a named decision your code asks Flagpole to make. It has a **key**, a **type**, a list of **variations** it can return, and per-environment **targeting** that decides which variation each context gets.

## Types

| Type      | Example use                          | Variations                              |
| --------- | ------------------------------------ | --------------------------------------- |
| Boolean   | Release gates, kill switches         | `true`, `false`                         |
| String    | Picking an algorithm or a copy variant | `"v1"`, `"v2"`, `"control"`           |
| Number    | Timeouts, limits, batch sizes        | `250`, `1000`, `5000`                   |
| JSON      | Structured config                    | `{"retries": 3, "backoff": "exp"}`      |

A flag's type can't change after creation. If you need a different type, create a new flag — it's a different decision.

## Keys

Keys are lowercase, use hyphens, and are **permanent**. They appear in your code, so treat renaming like renaming a function: create the new key, migrate callers, delete the old one.

Good keys describe the decision, not the ticket: `new-checkout`, `search-ranker`, `pdf-export-kill-switch`. Avoid `JIRA-4412` — nobody will remember what it means in six months.

## Three kinds of default

It's easy to confuse these, and the difference matters during an incident.

1. **Code default** — the last argument to `flags.bool('key', ctx, false)`. Used when the SDK can't evaluate at all: not loaded, flag deleted, type mismatch.
2. **Off variation** — what everyone gets when targeting is **off** in an environment.
3. **Fallthrough** — what a context gets when targeting is **on** but no rule matched.

> [!NOTE]
> Set the code default to the value that's safe if Flagpole is unreachable. For a new feature that's usually "off". For a kill switch it's usually "on" (the feature keeps working).

## Lifecycle

```
created ──► rolling out ──► fully released ──► code removed ──► archived
```

A flag that has served one variation to 100% of traffic for 30 days is marked **stale** in the dashboard. See [Cleaning up stale flags](../guides/cleaning-up-stale-flags.md).

Flags marked **permanent** (kill switches, remote config) are never marked stale.
