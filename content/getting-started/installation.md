---
title: Installation
description: Server and client SDKs, supported versions, and how to configure them.
---

## Server SDKs

Server SDKs download the full ruleset and evaluate locally. Use them in backends, workers and CLIs.

| Language | Package                          | Minimum version    |
| -------- | -------------------------------- | ------------------ |
| Node     | `npm install @flagpole/node`     | Node 18            |
| Python   | `pip install flagpole`           | Python 3.9         |
| Go       | `go get flagpole.dev/go`         | Go 1.21            |
| Ruby     | `gem install flagpole`           | Ruby 3.1           |
| Java     | `dev.flagpole:flagpole-java`     | Java 17            |

### Python

```python
from flagpole import Flagpole

flags = Flagpole(sdk_key=os.environ["FLAGPOLE_SDK_KEY"])
flags.wait_until_ready(timeout=5)

if flags.bool("new-checkout", {"key": user.id, "plan": user.plan}, False):
    return render_new_checkout()
```

### Go

```go
client, err := flagpole.New(os.Getenv("FLAGPOLE_SDK_KEY"))
if err != nil {
    log.Fatal(err)
}
defer client.Close()

ctx := flagpole.Context{Key: user.ID, Attributes: map[string]any{"plan": user.Plan}}
if client.Bool("new-checkout", ctx, false) {
    // ...
}
```

## Client SDKs

Client SDKs run in browsers and mobile apps. They **don't** download rules — they send the context to Flagpole's edge and receive only the evaluated values for that user. That keeps your targeting logic (and your customer list) private.

| Platform | Package                         |
| -------- | ------------------------------- |
| Browser  | `npm install @flagpole/browser` |
| React    | `npm install @flagpole/react`   |
| iOS      | Swift Package `flagpole-swift`  |
| Android  | `dev.flagpole:flagpole-android` |

```jsx
import { FlagpoleProvider, useFlag } from '@flagpole/react';

<FlagpoleProvider clientKey="fp_cli_prod_..." context={{ key: user.id }}>
  <App />
</FlagpoleProvider>

function CheckoutButton() {
  const newCheckout = useFlag('new-checkout', false);
  return newCheckout ? <NewCheckout /> : <LegacyCheckout />;
}
```

## Configuration options

All server SDKs accept the same options, named idiomatically for each language.

| Option             | Default                       | What it does                                                  |
| ------------------ | ----------------------------- | ------------------------------------------------------------- |
| `baseUrl`          | `https://edge.flagpole.dev`   | Where rulesets are fetched from. Change only for a relay proxy. |
| `stream`           | `true`                        | Receive updates over SSE. If `false`, poll instead.           |
| `pollInterval`     | `30s`                         | Used only when `stream` is `false`.                           |
| `readyTimeout`     | `5s`                          | How long `ready()` waits before resolving anyway.             |
| `sendEvents`       | `true`                        | Report evaluation counts for the flag insights view.          |
| `offline`          | `false`                       | Never connect; always return code defaults. Useful in tests.  |

> [!TIP]
> Create **one** client per process and share it. Each client holds a streaming connection and a copy of the ruleset.
