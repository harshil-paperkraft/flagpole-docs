---
title: Introduction
description: What Flagpole does, when to reach for it, and how the pieces fit together.
---

Flagpole separates **deploying** code from **releasing** it. You merge and deploy a change behind a flag, then decide — per environment, per customer, per percentage of traffic — who actually gets it. If something goes wrong, you turn the flag off. No revert, no redeploy, no waiting on CI.

## What you can do with it

- **Release gradually.** Turn a feature on for 1% of users, watch your dashboards, then 10%, 50%, 100%.
- **Target precisely.** Give a feature to internal staff, a beta cohort, one enterprise account, or everyone in `eu-west`.
- **Kill switches.** Wrap risky integrations so on-call can disable them in seconds without paging the owning team.
- **Remote config.** Serve strings, numbers and JSON — timeouts, copy, limits — and change them without shipping.

## How it works

```
 Dashboard / REST API ──► Flagpole control plane ──► Edge config (per environment)
                                                          │
                                   streaming (SSE) ◄──────┘
                                          │
                                   Your app + SDK  ──►  evaluates locally, in-memory
```

1. You define flags and targeting rules in the dashboard or through the [API](./api/overview.md).
2. Each SDK downloads the full ruleset for its environment on startup and keeps it current over a streaming connection.
3. Evaluation happens **inside your process**. A flag check is a hash lookup — no network call, typically under 1 µs.

Because evaluation is local, Flagpole being unreachable never blocks your app. SDKs keep serving the last ruleset they received, and fall back to the defaults in your code if they never received one.

## Where to go next

| If you want to…                         | Read                                                      |
| --------------------------------------- | --------------------------------------------------------- |
| Get a flag working in five minutes      | [Quickstart](./getting-started/quickstart.md)             |
| Understand variations and defaults      | [Flags](./concepts/flags.md)                               |
| Decide who sees what                    | [Targeting rules](./concepts/targeting-rules.md)           |
| Plan a real rollout                     | [Progressive delivery](./guides/progressive-delivery.md)   |
| Automate flag management                | [API overview](./api/overview.md)                          |
