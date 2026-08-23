/**
 * Token vault: envelope encryption using Cloud KMS.
 *
 * Stores encrypted_access_token, encrypted_refresh_token, wrapped_data_key, nonce per connection.
 * Only connector worker identity may decrypt.
 * Refresh rotation uses conditional UPDATE keyed by version to serialize concurrent refreshes.
 *
 * Derived from: docs/tdd/TDD-07-oauth-token-vault-connection-health.md sections 2, 8.2;
 * docs/architecture/ARCHITECTURE-18-database-erd-v2.md section 5.3 connection_token_vault
 */
