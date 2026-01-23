-- Add shipping tracking fields to orders table
-- This migration is idempotent and safe to run multiple times

-- Add shipping provider tracking columns
ALTER TABLE "orders" 
ADD COLUMN IF NOT EXISTS "shipping_provider" TEXT DEFAULT 'YALIDINE',
ADD COLUMN IF NOT EXISTS "shipping_tracking_id" TEXT,
ADD COLUMN IF NOT EXISTS "shipping_status" TEXT,
ADD COLUMN IF NOT EXISTS "shipping_last_sync" TIMESTAMP;

-- Create index for tracking ID lookups
CREATE INDEX IF NOT EXISTS "orders_tracking_id_idx" ON "orders"("shipping_tracking_id");

-- Verify columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders' 
AND column_name IN ('shipping_provider', 'shipping_tracking_id', 'shipping_status', 'shipping_last_sync')
ORDER BY column_name;
