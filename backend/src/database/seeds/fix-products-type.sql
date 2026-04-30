-- Fix products table: ensure type column has proper values
-- Run this after adding the type column

-- Update any NULL type values to 'single'
UPDATE `products` SET `type` = 'single' WHERE `type` IS NULL;

-- Verify the update
SELECT COUNT(*) as total_products, 
       SUM(CASE WHEN `type` IS NULL THEN 1 ELSE 0 END) as null_types,
       SUM(CASE WHEN `type` = 'single' THEN 1 ELSE 0 END) as single_types,
       SUM(CASE WHEN `type` = 'collection' THEN 1 ELSE 0 END) as collection_types
FROM `products`;
