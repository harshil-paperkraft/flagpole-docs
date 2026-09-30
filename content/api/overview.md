---
title: API overview
description: Base URL, authentication, pagination, errors and versioning for the Flagpole REST API.
---

The REST API manages everything you can do in the dashboard: flags, targeting, segments, environments. It is **not** used for evaluation in your app — use an SDK for that.

## Base URL

```
https://api.flagpole.dev/v1
```

EU-hosted projects use `https://api.eu.flagpole.dev/v1`.

## Authentication

Send an [API token](../getting-started/authentication.md#api-tokens) as a bearer token. Requests without the required scope return `403 insufficient_scope`.

```bash
curl https://api.flagpole.dev/v1/projects \
  -H "Authorization: Bearer fp_api_7d1e..."
```

## Requests and responses

- Bodies are JSON. Send `Content-Type: application/json`.
- Timestamps are RFC 3339 in UTC.
- Resource IDs are the keys you chose (`checkout`, `new-checkout`), not opaque IDs.

## Pagination

List endpoints return up to `limit` items (default 50, max 200) and a cursor:

```json
{
  "data": [ ... ],
  "next_cursor": "eyJrIjoic2VhcmNoLXJhbmtlciJ9"
}
```

Pass `?cursor=…` to get the next page. `next_cursor` is `null` on the last page.

## Change comments

Every write accepts an optional `comment`, which appears in the audit log. In environments that require approval, it's required.

```json
{ "comment": "Stage 2 of rollout, see INC-2291 for why we paused" }
```

## Rate limits

| Token type        | Limit                 |
| ----------------- | --------------------- |
| Personal token    | 60 requests / minute  |
| Service token     | 600 requests / minute |

Responses include `X-RateLimit-Remaining` and `X-RateLimit-Reset`. Over the limit you get `429` with a `Retry-After` header.

## Versioning

The major version is in the path. Within `v1` we only make additive changes: new endpoints, new optional fields, new enum values. Treat unknown fields and enum values as expected.
