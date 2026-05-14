-- HR+ World Food — initial schema
-- Apply with `pnpm exec drizzle-kit push` once TURSO_* env vars are set.

CREATE TABLE IF NOT EXISTS `reservations` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `phone` text NOT NULL,
  `email` text,
  `date` text NOT NULL,
  `time` text NOT NULL,
  `people` integer NOT NULL,
  `notes` text,
  `source` text DEFAULT 'web',
  `created_at` text DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS `idx_reservations_date` ON `reservations` (`date`);

CREATE TABLE IF NOT EXISTS `app_install_clicks` (
  `id` text PRIMARY KEY NOT NULL,
  `action` text NOT NULL,
  `ua` text,
  `platform` text,
  `created_at` text DEFAULT CURRENT_TIMESTAMP
);
