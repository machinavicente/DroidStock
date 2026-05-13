-- Verificar estructura actual de la tabla stock_repuestos
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'stock_repuestos' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- O alternativamente, usar \d stock_repuestos si estás en psql
