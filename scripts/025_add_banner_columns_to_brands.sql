-- Add banner-related columns to brands table
ALTER TABLE brands ADD COLUMN IF NOT EXISTS banner_images JSONB DEFAULT '[]';
ALTER TABLE brands ADD COLUMN IF NOT EXISTS banner_titles JSONB DEFAULT '[]';
ALTER TABLE brands ADD COLUMN IF NOT EXISTS banner_descriptions JSONB DEFAULT '[]';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_brands_banner_images ON brands USING GIN (banner_images);

-- Update existing brands to have empty banner arrays
UPDATE brands 
SET banner_images = '[]', 
    banner_titles = '[]', 
    banner_descriptions = '[]'
WHERE banner_images IS NULL 
   OR banner_titles IS NULL 
   OR banner_descriptions IS NULL;

-- Grant permissions
GRANT ALL ON brands TO authenticated;
GRANT ALL ON brands TO service_role;
