# Provider Token Vault

**Version:** 1.0  
**Date:** 2026-08-23  
**Status:** Ready for Development  
**Related:** v2/api/auth/oauth-flows.md  

---

## 1. Purpose

This document defines how CreatorOS stores and protects provider OAuth tokens.

Core rule:

> Mobile apps never receive, store, or refresh Google or Notion provider tokens.

The connector worker is the only component allowed to decrypt and use provider tokens.

---

## 2. Security Boundary

```
Mobile app
   ↓ Supabase JWT only
CreatorOS BFF
   ↓ never decrypts provider tokens
Connector worker
   ↓ decrypts tokens only for provider calls
Provider APIs
```

Provider access tokens and refresh tokens are not:

- Returned to mobile
- Sent through Supabase Realtime
- Placed in action receipts
- Written to logs, metrics, traces, or support tickets
- Stored in the primary Supabase/RLS-visible tables

---

## 3. Token Vault Table

Use a private Postgres schema, inaccessible to Supabase client roles.

```sql
create table private.provider_token_vault (
  connection_id text primary key references provider_connections(id) on delete cascade,
  key_version integer not null,
  access_token_ciphertext bytea not null,
  refresh_token_ciphertext bytea,
  token_type text,
  expires_at timestamptz,
  scope_snapshot text[],
  provider_token_metadata_ciphertext bytea,
  refreshed_at timestamptz,
  refresh_failures integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 4. Encryption Model

Use envelope encryption:

1. Cloud KMS manages a root key.
2. Generate a per-connection data encryption key (DEK).
3. Encrypt provider tokens with the DEK using authenticated encryption.
4. Wrap the DEK with the KMS root key.
5. Store ciphertext, wrapped DEK, key version, and nonce in the vault row.

Bind encryption to:

- `connection_id`
- Provider
- Environment
- Key version

This prevents copying ciphertext to another connection or environment.

---

## 5. Access Rules

Only the connector worker identity may decrypt.

The BFF may:

- Read connection metadata such as status, scopes, account label.
- Create and update connection rows.
- Never read token plaintext.

The mobile client may only read safe connection projections.

---

## 6. Token Refresh

Refresh happens only in the connector worker.

Before a provider call:

1. Read vault record.
2. If access token expires within 5 minutes, acquire per-connection refresh lock.
3. Recheck expiry.
4. Decrypt refresh token.
5. Call provider token endpoint.
6. Atomically persist new tokens.
7. Use the new access token.

Concurrent refresh protection:

- Postgres advisory lock on `connection_id`.
- Compare-and-swap token-vault update using `updated_at`.
- If update fails, reload and use the winner’s current token.

---

## 7. Notion Rotation Special Case

Notion refresh returns a new access token **and** a new refresh token.

The vault update must atomically replace both values.

Failure to do so causes the next refresh to fail with `invalid_grant`.

---

## 8. Google Testing vs Production

Google OAuth projects in Testing mode can issue refresh tokens that expire in 7 days.

Before beta scale:

- Move consent screen to Production.
- Request least privilege scopes.
- Complete OAuth verification if required.

Production readiness includes monitoring `invalid_grant` events and offering “Reconnect” from day one.

---

## 9. Disconnect and Deletion

On disconnect:

1. Mark connection `disconnecting`.
2. Drain/cancel queued provider jobs.
3. Attempt provider revocation best effort.
4. Delete token vault row.
5. Mark connection `disconnected`.

Never retain provider tokens just to retry revocation indefinitely.

---

## 10. Change Log

| Version | Date | Summary |
|---|---|---|
| 1.0 | 2026-08-23 | Created provider token vault specification. |
