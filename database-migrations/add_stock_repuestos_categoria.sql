-- Add item type to inventory so it can be filtered and identified in the catalog.
ALTER TABLE public.stock_repuestos
ADD COLUMN IF NOT EXISTS categoria TEXT NOT NULL DEFAULT 'repuesto';

UPDATE public.stock_repuestos
SET categoria = 'repuesto'
WHERE categoria IS NULL OR categoria NOT IN ('repuesto', 'accesorio', 'equipo');

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'stock_repuestos_categoria_check'
      AND conrelid = 'public.stock_repuestos'::regclass
  ) THEN
    ALTER TABLE public.stock_repuestos
    ADD CONSTRAINT stock_repuestos_categoria_check
    CHECK (categoria IN ('repuesto', 'accesorio', 'equipo'));
  END IF;
END;
$$;
