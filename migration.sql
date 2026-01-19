BEGIN;

-- 1) Add orders.payment_code if missing
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_code TEXT;

-- 2) Add payments.reference if missing
ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS reference TEXT;

-- 3) Backfill payment_code for existing orders (where NULL)
--    Requires pgcrypto for gen_random_bytes
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  r record;
  y text := to_char(now(), 'YYYY');
  code text;
BEGIN
  FOR r IN
    SELECT id FROM public.orders WHERE payment_code IS NULL
  LOOP
    LOOP
      code := 'MX-' || y || '-' || upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 6));
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.orders WHERE payment_code = code);
    END LOOP;

    UPDATE public.orders
    SET payment_code = code
    WHERE id = r.id;
  END LOOP;
END $$;

-- 4) Set NOT NULL (after backfill)
ALTER TABLE public.orders
ALTER COLUMN payment_code SET NOT NULL;

-- 5) Ensure UNIQUE constraint/index exists (safe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname='public' AND indexname='orders_payment_code_key'
  ) THEN
    CREATE UNIQUE INDEX orders_payment_code_key
      ON public.orders(payment_code);
  END IF;
END $$;

-- 6) Optional: index on payments.reference (non-null only)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname='public' AND indexname='idx_payments_reference'
  ) THEN
    CREATE INDEX idx_payments_reference
      ON public.payments(reference)
      WHERE reference IS NOT NULL;
  END IF;
END $$;

COMMIT;
