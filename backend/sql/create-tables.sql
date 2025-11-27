-- SQL Script para crear las tablas en Supabase
-- Ejecutar en el SQL Editor de Supabase
-- IMPORTANTE: Este script eliminará las tablas existentes si existen

-- Eliminar tablas en orden inverso de dependencias
DROP TABLE IF EXISTS guesses CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS game_mode_words CASCADE;
DROP TABLE IF EXISTS game_modes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Eliminar función si existe
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Tabla de usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de modos de juego
CREATE TABLE game_modes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de palabras por modo de juego
CREATE TABLE game_mode_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_mode_id UUID NOT NULL REFERENCES game_modes(id) ON DELETE CASCADE,
  word VARCHAR(255) NOT NULL,
  length INTEGER DEFAULT 5,
  language VARCHAR(10) DEFAULT 'es',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(game_mode_id, word)
);

-- Tabla de juegos
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_mode_id UUID NOT NULL REFERENCES game_modes(id) ON DELETE RESTRICT,
  target_word VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'playing' CHECK (status IN ('playing', 'won', 'lost')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 6,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de intentos (guesses)
CREATE TABLE guesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  word VARCHAR(255) NOT NULL,
  feedback TEXT NOT NULL,
  attempt_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_game_mode_words_game_mode_id ON game_mode_words(game_mode_id);
CREATE INDEX idx_game_mode_words_word ON game_mode_words(word);
CREATE INDEX idx_games_user_id ON games(user_id);
CREATE INDEX idx_games_game_mode_id ON games(game_mode_id);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_guesses_game_id ON guesses(game_id);
CREATE INDEX idx_guesses_attempt_number ON guesses(game_id, attempt_number);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_modes_updated_at
  BEFORE UPDATE ON game_modes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insertar modos de juego básicos
INSERT INTO game_modes (name, description) VALUES
  ('classic', 'Modo clásico ilimitado'),
  ('timer', 'Modo contrarreloj'),
  ('accented', 'Modo con tildes'),
  ('daily', 'Palabra del día'),
  ('hardcore', 'Modo hardcore')
ON CONFLICT (name) DO NOTHING;
