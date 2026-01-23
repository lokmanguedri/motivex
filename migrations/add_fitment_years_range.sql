-- ============================================================================
-- Migration: Add Fitment Years Range Support
-- Description: Add columns to support year ranges for product fitment (e.g., 2015-2020)
-- This is idempotent and safe to run multiple times
-- ============================================================================

-- Add fitment year range columns
ALTER TABLE "products"
ADD COLUMN IF NOT EXISTS "fitment_years_from" INTEGER,
ADD COLUMN IF NOT EXISTS "fitment_years_to" INTEGER,
ADD COLUMN IF NOT EXISTS "fitment_notes" TEXT;

-- Optional: Migrate existing single year values to range
-- Uncomment these lines if you want to copy existing 'year' values to the range columns:
-- UPDATE "products" 
-- SET "fitment_years_from" = "year", 
--     "fitment_years_to" = "year" 
-- WHERE "year" IS NOT NULL AND "fitment_years_from" IS NULL;

-- Create index for efficient filtering by year range
CREATE INDEX IF NOT EXISTS "products_fitment_years_idx" 
ON "products"("fitment_years_from", "fitment_years_to")
WHERE "fitment_years_from" IS NOT NULL OR "fitment_years_to" IS NOT NULL;

-- Verify columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products' 
AND column_name IN ('fitment_years_from', 'fitment_years_to', 'fitment_notes')
ORDER BY column_name;
