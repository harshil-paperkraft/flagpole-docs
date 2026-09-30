---
title: Environments
description: How environments isolate targeting, keys and permissions within a project.
---

A **project** usually maps to one product or service. Inside it, **environments** map to where your code runs: `development`, `staging`, `production`, and any others you create.

Flags are shared across a project's environments; **targeting is not**. `new-checkout` exists everywhere, but it can be on for everyone in staging and for 5% in production.

## What's per-environment

| Per project             | Per environment                        |
| ----------------------- | -------------------------------------- |
| Flag key, type, variations | Targeting on/off                    |
| Description, tags, owner | Rules, fallthrough, off variation     |
| Segments (definitions)  | SDK and client keys                    |
|                         | Audit history of targeting changes     |

## Production environments

Marking an environment **production** changes two things:

- Targeting changes require the `flags:prod` scope (or the **Production editor** role).
- If **Require approval** is on, a change creates a *pending change* that another member must approve before it applies.

## Copying targeting between environments

When a flag is ready to promote, use **Copy targeting → from Staging** on the production flag page. You'll see a diff before anything changes. Individual user targets are **not** copied by default, because user keys in staging rarely exist in production.

```bash
curl -X POST https://api.flagpole.dev/v1/projects/checkout/flags/new-checkout/copy \
  -H "Authorization: Bearer $FLAGPOLE_TOKEN" \
  -d '{"from": "staging", "to": "production", "include_individual_targets": false}'
```

## Naming

Environment keys are short and appear in SDK key prefixes, so keep them to a word: `dev`, `stage`, `prod`, `perf`. You can give them longer display names.
