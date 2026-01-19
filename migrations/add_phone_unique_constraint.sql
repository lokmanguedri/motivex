-- Add unique constraint on phone (allows NULLs)
-- Idempotent: only adds if not exists
-- Run this in Supabase SQL Editor

DO $$
BEGIN
    -- Check if constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_phone_key'
    ) THEN
        -- Check for existing duplicates
        IF EXISTS (
            SELECT phone, COUNT(*) 
            FROM users 
            WHERE phone IS NOT NULL 
            GROUP BY phone 
            HAVING COUNT(*) > 1
        ) THEN
            RAISE NOTICE 'WARNING: Duplicate phone numbers exist. Clean data before adding constraint.';
            RAISE NOTICE 'Run: SELECT phone, COUNT(*) FROM users WHERE phone IS NOT NULL GROUP BY phone HAVING COUNT(*) > 1;';
        ELSE
            -- Add unique constraint
            ALTER TABLE users ADD CONSTRAINT users_phone_key UNIQUE (phone);
            RAISE NOTICE 'SUCCESS: Unique constraint added on users.phone';
        END IF;
    ELSE
        RAISE NOTICE 'INFO: Constraint users_phone_key already exists';
    END IF;
END $$;
