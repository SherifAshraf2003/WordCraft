-- WordCraft Leaderboard Database Schema
-- Run this in your Supabase SQL editor after the waitlist setup

-- Create users table for authentication and user management
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  display_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_guest BOOLEAN DEFAULT false
);

-- Create writing styles enum
CREATE TYPE writing_style AS ENUM (
  'technical', 
  'creative', 
  'marketing', 
  'professional', 
  'academic', 
  'casual',
  'persuasive',
  'informative'
);

-- Create games table to store individual game sessions
CREATE TABLE IF NOT EXISTS games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prompt_text TEXT NOT NULL,
  user_response TEXT NOT NULL,
  writing_style writing_style NOT NULL,
  
  -- Scores
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  style_specific_score INTEGER NOT NULL CHECK (style_specific_score >= 0 AND style_specific_score <= 100),
  
  -- Individual metrics
  clarity_score INTEGER CHECK (clarity_score >= 0 AND clarity_score <= 100),
  structure_score INTEGER CHECK (structure_score >= 0 AND structure_score <= 100),
  word_choice_score INTEGER CHECK (word_choice_score >= 0 AND word_choice_score <= 100),
  grammar_score INTEGER CHECK (grammar_score >= 0 AND grammar_score <= 100),
  
  -- AI analysis results
  strengths JSONB,
  weaknesses JSONB,
  style_specific_tips JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leaderboard materialized view for performance
CREATE MATERIALIZED VIEW leaderboard_view AS
SELECT 
  u.id as user_id,
  u.username,
  u.display_name,
  g.writing_style,
  MAX(g.overall_score) as best_score,
  MAX(g.style_specific_score) as best_style_score,
  COUNT(g.id) as total_games,
  AVG(g.overall_score) as avg_score,
  MAX(g.created_at) as last_played,
  ROW_NUMBER() OVER (
    PARTITION BY g.writing_style 
    ORDER BY MAX(g.overall_score) DESC, MAX(g.created_at) ASC
  ) as style_rank,
  ROW_NUMBER() OVER (
    ORDER BY MAX(g.overall_score) DESC, MAX(g.created_at) ASC
  ) as overall_rank
FROM users u
JOIN games g ON u.id = g.user_id
WHERE u.is_guest = false  -- Exclude guest users from leaderboard
GROUP BY u.id, u.username, u.display_name, g.writing_style;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_games_user_id ON games(user_id);
CREATE INDEX IF NOT EXISTS idx_games_writing_style ON games(writing_style);
CREATE INDEX IF NOT EXISTS idx_games_overall_score ON games(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_games_created_at ON games(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_is_guest ON users(is_guest);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id OR is_guest = true);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can create user profiles" ON users
  FOR INSERT WITH CHECK (true);

-- RLS Policies for games table
CREATE POLICY "Users can view their own games" ON games
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = games.user_id 
      AND (auth.uid() = users.id OR users.is_guest = true)
    )
  );

CREATE POLICY "Users can create their own games" ON games
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = games.user_id 
      AND (auth.uid() = users.id OR users.is_guest = true)
    )
  );

CREATE POLICY "Public leaderboard read access" ON games
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = games.user_id 
      AND users.is_guest = false
    )
  );

-- Function to refresh leaderboard materialized view
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW leaderboard_view;
END;
$$ LANGUAGE plpgsql;

-- Function to get leaderboard for a specific style
CREATE OR REPLACE FUNCTION get_leaderboard_by_style(style_filter writing_style DEFAULT NULL, limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
  username VARCHAR,
  display_name VARCHAR,
  writing_style writing_style,
  best_score INTEGER,
  best_style_score INTEGER,
  total_games BIGINT,
  avg_score NUMERIC,
  style_rank BIGINT,
  overall_rank BIGINT,
  last_played TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  IF style_filter IS NULL THEN
    RETURN QUERY
    SELECT DISTINCT ON (l.username) 
      l.username,
      l.display_name,
      l.writing_style,
      l.best_score,
      l.best_style_score,
      l.total_games,
      l.avg_score,
      l.style_rank,
      l.overall_rank,
      l.last_played
    FROM leaderboard_view l
    ORDER BY l.username, l.best_score DESC
    LIMIT limit_count;
  ELSE
    RETURN QUERY
    SELECT 
      l.username,
      l.display_name,
      l.writing_style,
      l.best_score,
      l.best_style_score,
      l.total_games,
      l.avg_score,
      l.style_rank,
      l.overall_rank,
      l.last_played
    FROM leaderboard_view l
    WHERE l.writing_style = style_filter
    ORDER BY l.best_score DESC, l.last_played ASC
    LIMIT limit_count;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create or get guest user
CREATE OR REPLACE FUNCTION get_or_create_guest_user(guest_username VARCHAR DEFAULT NULL)
RETURNS UUID AS $$
DECLARE
  user_id UUID;
  username_to_use VARCHAR;
BEGIN
  -- Generate a unique guest username if none provided
  IF guest_username IS NULL THEN
    username_to_use := 'Guest_' || substr(gen_random_uuid()::text, 1, 8);
  ELSE
    username_to_use := guest_username;
  END IF;
  
  -- Try to find existing guest user with this username
  SELECT id INTO user_id 
  FROM users 
  WHERE username = username_to_use AND is_guest = true;
  
  -- If not found, create new guest user
  IF user_id IS NULL THEN
    INSERT INTO users (username, is_guest, display_name)
    VALUES (username_to_use, true, username_to_use)
    RETURNING id INTO user_id;
  END IF;
  
  RETURN user_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at column
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at 
  BEFORE UPDATE ON games 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to refresh leaderboard when new games are added
CREATE OR REPLACE FUNCTION trigger_refresh_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  -- Refresh the materialized view asynchronously
  PERFORM pg_notify('refresh_leaderboard', 'new_game_added');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER refresh_leaderboard_on_game_insert
  AFTER INSERT ON games
  FOR EACH ROW
  EXECUTE FUNCTION trigger_refresh_leaderboard();

-- Initial refresh of the materialized view
SELECT refresh_leaderboard();

-- Create sample data for testing (optional)
-- Uncomment the following lines if you want some sample data

/*
-- Insert sample users
INSERT INTO users (username, display_name, is_guest) VALUES
  ('alex_johnson', 'Alex Johnson', false),
  ('jamie_smith', 'Jamie Smith', false),
  ('taylor_wilson', 'Taylor Wilson', false),
  ('morgan_lee', 'Morgan Lee', false),
  ('casey_brown', 'Casey Brown', false);

-- Insert sample games
INSERT INTO games (user_id, prompt_text, user_response, writing_style, overall_score, style_specific_score, clarity_score, structure_score, word_choice_score, grammar_score) 
SELECT 
  u.id,
  'Sample prompt: Explain the benefits of renewable energy.',
  'Renewable energy sources offer numerous advantages including environmental sustainability and long-term cost effectiveness.',
  'technical'::writing_style,
  85 + (random() * 15)::integer,
  80 + (random() * 20)::integer,
  85 + (random() * 15)::integer,
  80 + (random() * 20)::integer,
  75 + (random() * 25)::integer,
  90 + (random() * 10)::integer
FROM users u WHERE u.is_guest = false;

-- Refresh leaderboard with sample data
SELECT refresh_leaderboard();
*/ 