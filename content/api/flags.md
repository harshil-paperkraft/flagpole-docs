---
title: Flags
description: Create, read, update, archive and change targeting on flags.
---

## The flag object

```json
{
  "key": "new-checkout",
  "name": "New checkout",
  "description": "Single-page checkout. Stop if checkout error rate > 0.5%.",
  "type": "boolean",
  "variations": [
    { "id": "on",  "value": true },
    { "id": "off", "value": false }
  ],
  "tags": ["checkout", "q4"],
  "owner": "team-payments",
  "permanent": false,
  "client_side": true,
  "expected_removal": "2026-12-01",
  "created_at": "2026-09-14T10:22:03Z"
}
```

## List flags

```
GET /v1/projects/{project}/flags
```

| Query param    | Description                                           |
| -------------- | ----------------------------------------------------- |
| `tag`          | Only flags with this tag. Repeat for AND.             |
| `status`       | `active`, `stale`, `unused`, `archived`               |
| `environment`  | Required when filtering by `stale` or `unused`.       |
| `q`            | Substring match on key and name.                      |

## Create a flag

```
POST /v1/projects/{project}/flags
```

```bash
curl -X POST https://api.flagpole.dev/v1/projects/checkout/flags \
  -H "Authorization: Bearer $FLAGPOLE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "search-ranker",
    "type": "string",
    "variations": [{"id": "v1", "value": "bm25"}, {"id": "v2", "value": "hybrid"}],
    "defaults": {"off": "v1", "fallthrough": "v1"},
    "owner": "team-search"
  }'
```

Returns `201` with the flag. Targeting starts **off** in every environment.

## Update a flag

```
PATCH /v1/projects/{project}/flags/{key}
```

Changes metadata only (name, description, tags, owner, permanent). Key and type can't change.

## Update targeting

```
PUT /v1/projects/{project}/flags/{key}/environments/{env}/targeting
```

Replaces the whole targeting config for one environment. Send the `version` you last read; if someone changed it since, you'll get `409 version_conflict`.

```json
{
  "version": 14,
  "on": true,
  "rules": [
    { "clauses": [{ "attribute": "segment", "op": "in", "values": ["internal-staff"] }], "serve": "v2" }
  ],
  "fallthrough": { "rollout": { "v2": 20, "v1": 80 }, "bucket_by": "key" },
  "comment": "Staff + 20%"
}
```

## Archive a flag

```
DELETE /v1/projects/{project}/flags/{key}
```

Archives rather than deletes. SDKs stop receiving the flag and return code defaults. Restore within 90 days with `POST …/flags/{key}/restore`.
