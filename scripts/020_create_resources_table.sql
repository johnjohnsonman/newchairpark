-- Create resources table for storing brand documents and files
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_resources_brand_id ON resources(brand_id);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_file_type ON resources(file_type);

-- Enable RLS (Row Level Security)
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create policies for resources table
-- Allow everyone to read resources (public access)
CREATE POLICY "Allow public read access to resources" ON resources
  FOR SELECT USING (true);

-- Allow authenticated users to insert resources (for admin)
CREATE POLICY "Allow authenticated users to insert resources" ON resources
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update resources (for admin)
CREATE POLICY "Allow authenticated users to update resources" ON resources
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete resources (for admin)
CREATE POLICY "Allow authenticated users to delete resources" ON resources
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage bucket for resources if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('files', 'files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for files bucket
CREATE POLICY "Allow public read access to files" ON storage.objects
  FOR SELECT USING (bucket_id = 'files');

CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'files' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'files' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete files" ON storage.objects
  FOR DELETE USING (bucket_id = 'files' AND auth.role() = 'authenticated');

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_resources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_resources_updated_at();
