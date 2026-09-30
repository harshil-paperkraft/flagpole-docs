---
title: FAQ
description: Short answers to the questions support hears most.
---

### What happens to my app if Flagpole goes down?

Nothing visible. Server SDKs evaluate from the ruleset in memory and keep serving it. If a process starts while Flagpole is unreachable, it serves your code defaults until it connects. That's why code defaults should always be the safe value.

### How fast do changes reach my servers?

Typically under one second with streaming (the default). With polling, up to your `pollInterval`.

### Does Flagpole see my users' data?

Server SDKs evaluate locally, so contexts never leave your infrastructure unless you enable **Context insights**. Client SDKs send the context to our edge to evaluate; it's used for that request and not stored by default.

### How many flags can I have?

There's no hard limit. Projects with more than ~2,000 active flags usually have a cleanup problem, not a scale problem — see [Cleaning up stale flags](./guides/cleaning-up-stale-flags.md).

### Can I use one flag across several services?

Yes, if they're in the same project and environment. Pass the same context key so a user gets a consistent answer everywhere.

### Why does a user see a different value in the browser than on the server?

Usually the contexts differ: the browser sends `key: anonymous-7f3a` before login and the server uses the real user ID. Compare the contexts in the flag's **Evaluations** debugger.

### Is there a Terraform provider?

Yes: `flagpole/flagpole`. It manages flags, segments and environments. We recommend managing **targeting** in the dashboard, since it changes too often to go through a plan/apply cycle.
