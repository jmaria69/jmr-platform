-- Add 2FA fields to admin_users table (if not already present)

ALTER TABLE "admin_users"
ADD COLUMN IF NOT EXISTS "totp_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "totp_secret" TEXT,
ADD COLUMN IF NOT EXISTS "recovery_codes" JSONB,
ADD COLUMN IF NOT EXISTS "last_login_at" TIMESTAMP(3);

-- Drop duplicate camelCase columns if they exist (from previous failed migration)
ALTER TABLE "admin_users"
DROP COLUMN IF EXISTS "totpEnabled",
DROP COLUMN IF EXISTS "totpSecret",
DROP COLUMN IF EXISTS "recoveryCodes",
DROP COLUMN IF EXISTS "lastLoginAt";
