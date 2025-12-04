-- Create leaderboard table
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  player_name TEXT NOT NULL,
  time_ms INTEGER NOT NULL,
  time_display TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast top-5 queries
CREATE INDEX idx_leaderboard_time ON leaderboard(time_ms ASC);

-- Enable row-level security
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the leaderboard
CREATE POLICY "Anyone can read" ON leaderboard FOR SELECT USING (true);

-- Allow anyone to insert scores
CREATE POLICY "Anyone can insert" ON leaderboard FOR INSERT WITH CHECK (true);
