import { useState, useEffect, useCallback } from 'react';

let wordsCache: Set<string> | null = null;
let isLoadingWords = false;
let loadPromise: Promise<Set<string>> | null = null;

interface WordListData {
  word: string;
}

export function useWordDictionary() {
  const [isReady, setIsReady] = useState(wordsCache !== null);
  const [isLoading, setIsLoading] = useState(isLoadingWords);

  useEffect(() => {
    if (wordsCache) {
      setIsReady(true);
      return;
    }

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
        const words = wordListData.map(item => item.word.toUpperCase());
        wordsCache = new Set(words);
        isLoadingWords = false;
        setIsReady(true);
        setIsLoading(false);
        return wordsCache;
      })
      .catch(error => {
        isLoadingWords = false;
        setIsLoading(false);
        throw error;
      });
  }, []);

  const validateWord = useCallback((word: string): boolean => {
    if (!wordsCache) {
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
