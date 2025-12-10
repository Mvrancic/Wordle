import { useState, useEffect, useCallback } from 'react';
import { useWordleEngine } from './useWordleEngine';
import { useWordDictionary } from './useWordDictionary';
import { dailyWordApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook específico para el modo Daily
 * Obtiene la palabra del día desde el backend
 */
export function useDailyGame() {
  const engine = useWordleEngine('wordle-daily-game-state');
  const { isReady: dictionaryReady, getWordList } = useWordDictionary();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false); // Cambiar a false inicialmente
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wordLoaded, setWordLoaded] = useState(false);
  const [previousGame, setPreviousGame] = useState<{ targetWord: string; won: boolean; attemptsUsed: number } | null>(null);
  
  // Reset engine state when component mounts to avoid loading old state from localStorage
  useEffect(() => {
    // Limpiar localStorage del modo daily al montar
    localStorage.removeItem('wordle-daily-game-state');
    engine.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Obtiene la palabra del día desde el backend
   * La lógica es:
   * 1. Obtener todas las palabras usadas desde el backend
   * 2. Comparar con word_list.json y seleccionar una palabra única
   * 3. Enviar esa palabra al backend para guardarla (si no existe para hoy)
   * 4. El backend devuelve la palabra del día (misma para todos)
   */
  const startNewGame = useCallback(async () => {
    if (wordLoaded) {
      return;
    }
    
    if (isLoading) {
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Get word list from frontend
      const wordList = getWordList();
      
      if (wordList.length === 0) {
        setIsLoading(false);
        return; // Esperar a que se cargue la lista
      }

      // 1. Obtener todas las palabras usadas desde el backend
      const usedWordsResponse = await dailyWordApi.getAllDailyWords();
      
      const usedWords: string[] = usedWordsResponse.success && usedWordsResponse.data 
        ? usedWordsResponse.data.words.map(w => w.toUpperCase())
        : [];

      // 2. Comparar con word_list.json y seleccionar una palabra única
      const allWords = wordList.map(w => w.toUpperCase());
      const usedSet = new Set(usedWords);
      const availableWords = allWords.filter(word => !usedSet.has(word.toUpperCase()));

      let selectedWord: string;
      if (availableWords.length === 0) {
        // Si todas las palabras han sido usadas, elegir una aleatoria de la lista completa
        selectedWord = allWords[Math.floor(Math.random() * allWords.length)];
      } else {
        // Seleccionar una palabra aleatoria de las disponibles
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        selectedWord = availableWords[randomIndex];
      }

      // 3. Enviar la palabra al backend para guardarla (si no existe para hoy)
      // El backend devuelve la palabra del día (puede ser la misma o diferente si ya existía)
      const response = await dailyWordApi.getTodayWord(selectedWord, user?.id);
      
      if (response.success && response.data) {
        const dailyWord = response.data.word;
        
        setHasPlayedToday(response.data.hasPlayed);
        
        // Si ya jugó hoy, cargar el juego anterior
        if (response.data.hasPlayed && response.data.todayGame) {
          const game = response.data.todayGame;
          setPreviousGame(game);
          
          // Cargar el estado del juego anterior en el engine
          engine.startNewGame(game.targetWord);
        } else {
          // 4. Iniciar el juego con la palabra del día (misma para todos)
          engine.startNewGame(dailyWord);
        }
        
        setWordLoaded(true);
      } else {
        throw new Error(response.error || 'Failed to get daily word');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load daily word';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [engine, user, getWordList, wordLoaded, isLoading]);

  // Cargar la palabra del día cuando el diccionario esté listo (solo una vez)
  useEffect(() => {
    // Solo intentar cargar si el diccionario está listo y aún no hemos cargado la palabra
    if (dictionaryReady && !wordLoaded && !isLoading) {
      startNewGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictionaryReady]);

  return {
    targetWord: engine.targetWord,
    attempts: engine.attempts,
    gameStatus: engine.gameStatus,
    currentAttempt: engine.currentAttempt,
    maxAttempts: engine.maxAttempts,
    isReady: dictionaryReady && !isLoading,
    isLoading,
    hasPlayedToday,
    previousGame, // Información del juego anterior si ya jugó hoy
    error,
    startNewGame,
    submitGuess: engine.submitGuess,
    reset: engine.reset,
  };
}

