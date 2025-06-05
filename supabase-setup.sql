-- WordCraft Waitlist Table
-- Run this in your Supabase SQL editor

-- Create the waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'invited', 'unsubscribed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Create an index on joined_at for ordering
CREATE INDEX IF NOT EXISTS idx_waitlist_joined_at ON waitlist(joined_at);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (for the waitlist form)
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT WITH CHECK (true);

-- Create policy to allow admins to read all waitlist entries
-- Note: You'll need to create a user with the 'admin' role or modify this policy
CREATE POLICY "Admins can view waitlist" ON waitlist
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_waitlist_updated_at 
  BEFORE UPDATE ON waitlist 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for waitlist statistics
CREATE OR REPLACE VIEW waitlist_stats AS
SELECT 
  COUNT(*) as total_signups,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_signups,
  COUNT(CASE WHEN status = 'invited' THEN 1 END) as invited_signups,
  COUNT(CASE WHEN joined_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as signups_last_7_days,
  COUNT(CASE WHEN joined_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as signups_last_30_days
FROM waitlist; 