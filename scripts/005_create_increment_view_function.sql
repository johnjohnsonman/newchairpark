-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(review_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE reviews
  SET view_count = view_count + 1
  WHERE id = review_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
