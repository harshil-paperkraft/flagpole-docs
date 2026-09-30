---
title: Testing with flags
description: Keep tests deterministic, cover both sides of a flag, and never call Flagpole from CI.
---

Tests shouldn't depend on what's in the dashboard today. Every SDK ships a **test client** that returns values you set explicitly.

## Unit tests

```js
import { TestFlagpole } from '@flagpole/node/testing';

test('shows new checkout when enabled', () => {
  const flags = new TestFlagpole({ 'new-checkout': true });
  const html = renderCart(cart, { flags });
  expect(html).toContain('data-checkout="v2"');
});

test('falls back to legacy checkout', () => {
  const flags = new TestFlagpole({ 'new-checkout': false });
  expect(renderCart(cart, { flags })).toContain('data-checkout="v1"');
});
```

Flags you didn't set return the code default, exactly like production when a flag is missing.

## Cover both sides

A flag doubles the paths through that code. At minimum, test:

- **On** and **off** for every flag in an active rollout.
- The **off** path for every kill switch — it's the one that runs during an incident.

You don't need every combination of every flag. If two flags interact, that's usually a sign they should be one flag with more variations.

## End-to-end tests

For browser tests, override values with a header instead of a real key. The client SDK honours it only when the environment has **Allow overrides** enabled (never enable it in production):

```
X-Flagpole-Override: new-checkout=true;search-ranker=v2
```

## Offline mode

Setting `offline: true` makes a client return code defaults and open no connections. Use it for local development without network access and in any process that shouldn't talk to Flagpole, like database migrations.
