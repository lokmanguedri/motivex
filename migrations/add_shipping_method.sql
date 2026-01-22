-- Add ShippingMethod enum and column to orders table
-- Run this in Supabase SQL Editor

-- Step 1: Create the enum type
CREATE TYPE "ShippingMethod" AS ENUM ('YALIDINE', 'GUEPEX');

-- Step 2: Add the column to orders table with default value
ALTER TABLE "orders" 
ADD COLUMN "shipping_method" "ShippingMethod" NOT NULL DEFAULT 'YALIDINE';

-- Step 3: Create index for faster queries
CREATE INDEX "orders_shipping_method_idx" ON "orders"("shipping_method");

-- Verification query
SELECT 
  id, 
  payment_code, 
  shipping_method, 
  created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;
