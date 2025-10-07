-- Add brand and product_name columns to gallery table
ALTER TABLE gallery 
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS product_name TEXT;

-- Add indexes for better performance when filtering by brand or product
CREATE INDEX IF NOT EXISTS idx_gallery_brand ON gallery(brand);
CREATE INDEX IF NOT EXISTS idx_gallery_product_name ON gallery(product_name);

-- Update existing records to have default values if needed
-- UPDATE gallery SET brand = NULL WHERE brand IS NULL;
-- UPDATE gallery SET product_name = NULL WHERE product_name IS NULL;

-- Add comments to the new columns
COMMENT ON COLUMN gallery.brand IS 'Brand name (e.g., Herman Miller, Steelcase)';
COMMENT ON COLUMN gallery.product_name IS 'Product name (e.g., Aeron Chair, Gesture Chair)';
