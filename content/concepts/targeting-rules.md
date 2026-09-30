---
title: Targeting rules
description: How Flagpole decides which variation a context receives, and how to write rules you can reason about.
---

When targeting is on, Flagpole evaluates a flag top to bottom and stops at the **first match**:

1. **Individual targets** — explicit lists of context keys per variation.
2. **Rules** — in the order you've arranged them.
3. **Fallthrough** — if nothing matched.

## Contexts

A context is whatever you pass to the SDK. It needs a `key`; everything else is an attribute.

```js
const ctx = {
  key: 'user_1842',
  email: 'ada@example.com',
  plan: 'pro',
  country: 'DE',
  accountId: 'acct_77',
  appVersion: '4.12.0',
};
```

Attributes are only used for matching. They are not stored unless **Context insights** is enabled for the environment.

## Rule clauses

A rule has one or more clauses. **All** clauses must match (AND). To express OR, write two rules that serve the same variation.

| Operator            | Matches when                                    | Example                              |
| ------------------- | ----------------------------------------------- | ------------------------------------ |
| `is one of`         | value equals any listed value                   | `plan is one of pro, enterprise`     |
| `ends with`         | string suffix                                   | `email ends with @flagpole.dev`      |
| `matches regex`     | RE2 regex                                       | `accountId matches ^acct_[78]`      |
| `semver >=`         | semantic version comparison                     | `appVersion semver >= 4.12.0`        |
| `before` / `after`  | RFC 3339 timestamp comparison                   | `signupAt after 2026-06-01`          |
| `in segment`        | context is in a saved segment                   | `in segment beta-testers`            |

Every operator can be negated (`is not one of`, `not in segment`).

## Segments

A segment is a reusable rule or list, defined once per project: `internal-staff`, `beta-testers`, `enterprise-eu`. Use them whenever the same audience appears in more than one flag. Changing a segment updates every flag that references it.

## Worked example

Goal: new search ranker for staff, then Pro customers on app 4.12+, then 20% of everyone else.

| Order | Rule                                                           | Serve |
| ----- | -------------------------------------------------------------- | ----- |
| 1     | `in segment internal-staff`                                    | `v2`  |
| 2     | `plan is one of pro, enterprise` AND `appVersion semver >= 4.12.0` | `v2`  |
| —     | Fallthrough: 20% `v2`, 80% `v1`                                | —     |

> [!TIP]
> Put the most specific rules first. A broad rule near the top quietly shadows everything below it — the dashboard warns when a rule can never match.
