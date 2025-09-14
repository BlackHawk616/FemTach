# Supabase Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

You need to create the following table in your Supabase database:

### Profiles Table

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  age INTEGER,
  height DECIMAL,
  weight DECIMAL,
  diet_preference TEXT CHECK (diet_preference IN ('vegetarian', 'non-vegetarian', 'vegan')),
  lifestyle_goals TEXT[],
  is_onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_onboarded)
  VALUES (NEW.id, NEW.email, FALSE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Authentication Flow

The login page now implements the following flow:

1. **Existing User Login**: Attempts to sign in with email/password
2. **Auto-Signup**: If login fails due to invalid credentials, automatically creates a new account
3. **Profile Creation**: Creates a profile record with `is_onboarded: false`
4. **Redirect Logic**:
   - New users → `/onboarding`
   - Existing users who haven't completed onboarding → `/onboarding`
   - Existing users who completed onboarding → `/dashboard`

## Next Steps

1. Set up your Supabase project at https://supabase.com
2. Copy your project URL and anon key to `.env.local`
3. Run the SQL commands above in your Supabase SQL editor
4. Test the authentication flow

## Security Features

- Row Level Security (RLS) enabled
- Users can only access their own profile data
- Automatic profile creation on signup
- Secure password handling via Supabase Auth
