import { useState, useEffect, useCallback } from 'react';

// Cache global para el diccionario (cargar una sola vez)
let wordsCache: Set<string> | null = null;
let isLoadingWords = false;
let loadPromise: Promise<Set<string>> | null = null;

interface WordListData {
  word: string;
}

/**
 * Hook para cargar el diccionario de palabras válidas dinámicamente
 * Carga desde /word_list.json usando fetch (no bloquea el bundle)
 * Cache automático del navegador, fácil de actualizar sin recompilar
 */
export function useWordDictionary() {
  const [isReady, setIsReady] = useState(wordsCache !== null);
  const [isLoading, setIsLoading] = useState(isLoadingWords);

  useEffect(() => {
    // Si ya tenemos las palabras en caché, no hacer nada
    if (wordsCache) {
      setIsReady(true);
      return;
    }

    // Si ya hay una carga en progreso, esperar a que termine
    if (loadPromise) {
      loadPromise
        .then(() => {
          setIsReady(true);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
      return;
    }

    // Cargar las palabras dinámicamente
    setIsLoading(true);
    isLoadingWords = true;
    
    loadPromise = fetch('/word_list.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load word list');
        }
        return response.json() as Promise<WordListData[]>;
      })
      .then(wordListData => {
        // Extraer palabras y convertir a Set
        const words = wordListData.map(item => item.word.toUpperCase());
        wordsCache = new Set(words);
        isLoadingWords = false;
        setIsReady(true);
        setIsLoading(false);
        return wordsCache;
      })
      .catch(error => {
        console.error('Error loading word dictionary:', error);
        isLoadingWords = false;
        setIsLoading(false);
        throw error;
      });

    return () => {
      // Cleanup si el componente se desmonta
    };
  }, []);

  const validateWord = useCallback((word: string): boolean => {
    if (!wordsCache) {
      // Si el diccionario no está cargado, permitir la palabra
      // Para evitar bloqueos durante la carga inicial
      return true;
    }
    return wordsCache.has(word.toUpperCase());
  }, []);

  const getDictionary = useCallback((): Set<string> | null => {
    return wordsCache;
  }, []);

  const getWordList = useCallback((): string[] => {
    if (!wordsCache) {
      return [];
    }
    return Array.from(wordsCache);
  }, []);

  return {
    isReady,
    isLoading,
    validateWord,
    getDictionary,
    getWordList,
  };
}
