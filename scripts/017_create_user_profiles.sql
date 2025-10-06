-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add user_id to gallery table
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to recycle_items table
ALTER TABLE public.recycle_items ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies for gallery to allow user uploads
DROP POLICY IF EXISTS "Anyone can view gallery" ON public.gallery;
CREATE POLICY "Anyone can view gallery"
  ON public.gallery FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own gallery items" ON public.gallery;
CREATE POLICY "Users can insert their own gallery items"
  ON public.gallery FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own gallery items" ON public.gallery;
CREATE POLICY "Users can update their own gallery items"
  ON public.gallery FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own gallery items" ON public.gallery;
CREATE POLICY "Users can delete their own gallery items"
  ON public.gallery FOR DELETE
  USING (auth.uid() = user_id);

-- Update RLS policies for recycle_items to allow user uploads
DROP POLICY IF EXISTS "Anyone can view recycle items" ON public.recycle_items;
CREATE POLICY "Anyone can view recycle items"
  ON public.recycle_items FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own recycle items" ON public.recycle_items;
CREATE POLICY "Users can insert their own recycle items"
  ON public.recycle_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own recycle items" ON public.recycle_items;
CREATE POLICY "Users can update their own recycle items"
  ON public.recycle_items FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own recycle items" ON public.recycle_items;
CREATE POLICY "Users can delete their own recycle items"
  ON public.recycle_items FOR DELETE
  USING (auth.uid() = user_id);
