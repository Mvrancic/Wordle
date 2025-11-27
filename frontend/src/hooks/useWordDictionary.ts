import { useState, useEffect, useCallback } from 'react';
import { gameApi } from '../services/api';

let wordsCache: Set<string> | null = null;
let isLoadingWords = false;
let loadPromise: Promise<Set<string>> | null = null;

/**
 * Hook para obtener y cachear el diccionario de palabras válidas
 * Descarga todas las palabras una sola vez y las almacena en memoria
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

    // Cargar las palabras
    setIsLoading(true);
    isLoadingWords = true;
    
    loadPromise = gameApi
      .getAllWords('classic')
      .then(words => {
        wordsCache = new Set(words.map(w => w.toUpperCase()));
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
      // El backend la validará de todas formas
      return true;
    }
    return wordsCache.has(word.toUpperCase());
  }, []);

  return {
    isReady,
    isLoading,
    validateWord,
  };
}

