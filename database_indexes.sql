-- ============================================================================
-- MOTIVEX Production Performance Indexes
-- Run in Supabase SQL Editor
-- ============================================================================
-- These indexes optimize query performance for the most frequent operations
-- Safe to run multiple times (idempotent)
-- ============================================================================

BEGIN;

-- Orders table indexes

-- Index for user's orders lookup (/api/orders/me)
CREATE INDEX IF NOT EXISTS idx_orders_user_id 
ON orders(user_id);

-- Index for sorting orders by date (admin dashboard, user account)
CREATE INDEX IF NOT EXISTS idx_orders_created_at 
ON orders(created_at DESC);

-- Index for filtering by order status (admin dashboard)
CREATE INDEX IF NOT EXISTS idx_orders_status 
ON orders(status);

-- Composite index for user+status queries (if needed for filtering)
CREATE INDEX IF NOT EXISTS idx_orders_user_status 
ON orders(user_id, status);

-- Payments table indexes

-- Index for filtering by payment method (stats, admin filters)
CREATE INDEX IF NOT EXISTS idx_payments_method 
ON payments(method);

-- Index for filtering by payment status (stats, dashboard)
CREATE INDEX IF NOT EXISTS idx_payments_status 
ON payments(status);

-- Index for revenue calculations (delivered+paid)
CREATE INDEX IF NOT EXISTS idx_payments_method_status 
ON payments(method, status);

-- Products table indexes

-- Index for active products filter (public catalog)
CREATE INDEX IF NOT EXISTS idx_products_active 
ON products(is_active) 
WHERE is_active = true;

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_products_category 
ON products(category_id) 
WHERE is_active = true;

-- Index for stock availability checks
CREATE INDEX IF NOT EXISTS idx_products_stock 
ON products(stock) 
WHERE is_active = true AND stock > 0;

COMMIT;

-- ============================================================================
-- Verification Query
-- ============================================================================
-- Run this to verify all indexes were created:
-- 
-- SELECT 
--   schemaname,
--   tablename,
--   indexname
-- FROM pg_indexes
-- WHERE schemaname = 'public'
--   AND tablename IN ('orders', 'payments', 'products')
-- ORDER BY tablename, indexname;
-- ============================================================================
