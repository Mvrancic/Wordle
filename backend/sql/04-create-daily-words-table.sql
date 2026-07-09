-- Migration: Create daily_words table
-- This script creates the daily_words table for the Daily Word game mode
-- Run this in Supabase SQL Editor

-- Create daily_words table if it doesn't exist
CREATE TABLE IF NOT EXISTS daily_words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word VARCHAR(5) NOT NULL,
    date DATE NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on date for faster lookups
CREATE INDEX IF NOT EXISTS idx_daily_words_date ON daily_words(date);

-- Create index on word for faster lookups
CREATE INDEX IF NOT EXISTS idx_daily_words_word ON daily_words(word);


