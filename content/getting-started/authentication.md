---
title: Authentication
description: The three kinds of key, what each can do, and how to rotate them without downtime.
---

Flagpole has three kinds of credential. Pick by **where the code runs**, not by what it needs to do.

| Key type          | Prefix        | Used by                 | Can                                                 |
| ----------------- | ------------- | ----------------------- | --------------------------------------------------- |
| Server SDK key    | `fp_srv_`     | Server SDKs             | Read the full ruleset for one environment           |
| Client key        | `fp_cli_`     | Browser & mobile SDKs   | Request evaluated values for one context            |
| API token         | `fp_api_`     | REST API, CI, Terraform | Create, change and delete flags (scoped, see below) |

Every key is tied to one **project**. SDK and client keys are also tied to one **environment**; the environment is in the prefix (`fp_srv_prod_…`).

## Client keys

Client keys are safe to embed in public code. They can't list flags or read rules — they can only ask "what values does this context get?" for flags marked **Available to client SDKs**. Flags are server-only by default so that a new internal flag never leaks its name to the browser.

## API tokens

API tokens are created per person or per service under **Settings → API tokens** and carry scopes:

| Scope           | Allows                                                        |
| --------------- | ------------------------------------------------------------- |
| `flags:read`    | List and read flags, rules and history                        |
| `flags:write`   | Create and edit flags; change targeting in non-production     |
| `flags:prod`    | Change targeting in environments marked **production**        |
| `admin`         | Manage environments, keys, members and billing                |

Send the token as a bearer token:

```bash
curl https://api.flagpole.dev/v1/projects/checkout/flags \
  -H "Authorization: Bearer fp_api_7d1e..."
```

## Rotating keys

Every key can have **two active values** at once, so you can rotate without a gap:

1. **Settings → Environments → Production → Rotate server key.** A secondary key is created. Both work.
2. Deploy the new key to all services.
3. Check **Last used** on the old key. When it stops moving, click **Revoke old key**.

If a key has leaked, choose **Revoke immediately** instead. SDKs using it will stop receiving updates but continue serving their last-known ruleset until restarted.
