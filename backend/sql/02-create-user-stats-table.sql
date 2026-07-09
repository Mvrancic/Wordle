-- Migration: Create user_stats table + update_user_stats_after_game()
-- Run this in the Supabase SQL Editor, after create-users-table.sql.

CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    games_played INTEGER NOT NULL DEFAULT 0,
    games_won INTEGER NOT NULL DEFAULT 0,
    win_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    max_streak INTEGER NOT NULL DEFAULT 0,
    avg_attempts NUMERIC(4, 2) NOT NULL DEFAULT 0.0,
    last_played_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applies the result of one finished game to a user's running stats.
-- avg_attempts tracks the average attempts across WON games only, which is
-- the standard Wordle convention (losses don't have a meaningful "attempts
-- to solve").
CREATE OR REPLACE FUNCTION update_user_stats_after_game(
    p_user_id UUID,
    p_won BOOLEAN,
    p_attempts_used INTEGER
) RETURNS void AS $$
BEGIN
    UPDATE user_stats
    SET
        games_played = games_played + 1,
        games_won = games_won + CASE WHEN p_won THEN 1 ELSE 0 END,
        current_streak = CASE WHEN p_won THEN current_streak + 1 ELSE 0 END,
        max_streak = CASE
            WHEN p_won THEN GREATEST(max_streak, current_streak + 1)
            ELSE max_streak
        END,
        avg_attempts = CASE
            WHEN p_won AND games_won + 1 > 0
                THEN ((avg_attempts * games_won) + p_attempts_used) / (games_won + 1)
            ELSE avg_attempts
        END,
        win_rate = ROUND(
            ((games_won + CASE WHEN p_won THEN 1 ELSE 0 END)::NUMERIC / (games_played + 1)) * 100,
            2
        ),
        last_played_at = NOW(),
        updated_at = NOW()
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
