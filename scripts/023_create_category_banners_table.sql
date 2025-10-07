-- Create category_banners table for managing brand banners and other category banners
CREATE TABLE IF NOT EXISTS category_banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    link_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_category_banners_category ON category_banners(category);
CREATE INDEX IF NOT EXISTS idx_category_banners_order ON category_banners(category, order_index);
CREATE INDEX IF NOT EXISTS idx_category_banners_active ON category_banners(is_active);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_category_banners_updated_at 
    BEFORE UPDATE ON category_banners 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
-- INSERT INTO category_banners (category, image_url, title, description, order_index) VALUES
-- ('brand-herman-miller', '/herman-miller-banner-1.jpg', 'Herman Miller Premium Chairs', 'Discover our collection of premium Herman Miller chairs', 0),
-- ('brand-steelcase', '/steelcase-banner-1.jpg', 'Steelcase Office Solutions', 'Innovative office furniture solutions', 0);

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL ON category_banners TO authenticated;
-- GRANT ALL ON category_banners TO service_role;
