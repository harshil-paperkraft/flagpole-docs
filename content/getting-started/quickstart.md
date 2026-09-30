---
title: Quickstart
description: Create a flag, read it from a Node app, and flip it without redeploying — about five minutes.
---

This walkthrough uses Node. The same steps work in every SDK; only the syntax changes. See [Installation](./installation.md) for Python, Go, Ruby, Java and the browser.

## 1. Get a server key

In the dashboard open **Settings → Environments → Development** and copy the **server SDK key**. It starts with `fp_srv_dev_`.

```bash
export FLAGPOLE_SDK_KEY=fp_srv_dev_4f9c2a...
```

> [!WARNING]
> Server keys can read every flag in an environment, including targeting rules. Never ship them to a browser or mobile app — use a [client key](./authentication.md#client-keys) there.

## 2. Create a flag

Open **Flags → New flag** and fill in:

| Field       | Value               |
| ----------- | ------------------- |
| Key         | `new-checkout`      |
| Type        | Boolean             |
| Default     | `false`             |

Leave targeting off for now. Every user will get `false`.

## 3. Install the SDK and read the flag

```bash
npm install @flagpole/node
```

```js
import { Flagpole } from '@flagpole/node';

const flags = new Flagpole({ sdkKey: process.env.FLAGPOLE_SDK_KEY });
await flags.ready(); // resolves once the ruleset has loaded (or after 5s)

const user = { key: 'user_1842', email: 'ada@example.com', plan: 'pro' };

setInterval(() => {
  const enabled = flags.bool('new-checkout', user, false);
  console.log(new Date().toISOString(), 'new-checkout =', enabled);
}, 2000);
```

Run it. You'll see `new-checkout = false` every two seconds.

## 4. Flip it

Back in the dashboard, turn on targeting for `new-checkout` in **Development** and set the fallthrough to `true`. Within a second your terminal prints `true` — no restart, because the SDK receives the change over its streaming connection.

## What just happened

- `flags.bool(key, user, fallback)` evaluated the flag **locally** against the ruleset in memory.
- The third argument is the **code default**. It's used if the flag doesn't exist, the SDK hasn't loaded yet, or the flag's type isn't boolean. Always pass the value that's safe if Flagpole disappears.
- The `user` object is the **evaluation context**. Targeting rules match against its attributes.

## Next

- Target only `plan: 'pro'` users with a [targeting rule](../concepts/targeting-rules.md).
- Roll out to 10% with a [percentage rollout](../concepts/percentage-rollouts.md).
