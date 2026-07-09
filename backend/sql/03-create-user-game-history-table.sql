-- Migration: Create user_game_history table
-- Run this in the Supabase SQL Editor, after create-users-table.sql.

CREATE TABLE IF NOT EXISTS user_game_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mode VARCHAR(50) NOT NULL,
    -- Comma-separated for multi-board modes (e.g. "CRANE,BLAST,SNIPE,GHOST")
    target_word VARCHAR(255) NOT NULL,
    won BOOLEAN NOT NULL,
    attempts_used INTEGER NOT NULL,
    time_limit INTEGER,
    time_taken INTEGER,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_game_history_user_id ON user_game_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_game_history_played_at ON user_game_history(played_at DESC);
