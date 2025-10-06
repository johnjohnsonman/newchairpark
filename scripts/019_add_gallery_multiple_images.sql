-- Add multiple images support to gallery table
ALTER TABLE public.gallery 
  ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS featured_image_index INTEGER DEFAULT 0;

-- Update existing records to have their image_url as the first image in the array
UPDATE public.gallery 
SET images = jsonb_build_array(image_url)
WHERE images = '[]'::jsonb AND image_url IS NOT NULL AND image_url != '';

-- Add comment
COMMENT ON COLUMN public.gallery.images IS 'Array of image URLs in display order';
COMMENT ON COLUMN public.gallery.featured_image_index IS 'Index of the featured/primary image in the images array';

