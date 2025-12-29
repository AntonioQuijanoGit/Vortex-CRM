import { useState, useEffect } from 'react';
import { safeGetItem, safeSetItem } from '../utils/storage';

/**
 * Hook para detectar si es la primera vez que el usuario hace algo
 * y mostrar hints/tooltips contextuales
 * 
 * @param {string} key - Identificador único para esta "primera vez"
 * @param {Function} onFirstTime - Callback cuando se detecta primera vez
 * @returns {[boolean, Function]} - [isFirstTime, markAsDone]
 */
export function useFirstTime(key, onFirstTime = null) {
  const [isFirstTime, setIsFirstTime] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !safeGetItem(`first-time-${key}`, false);
  });

  useEffect(() => {
    if (isFirstTime && onFirstTime) {
      onFirstTime();
    }
  }, [isFirstTime, onFirstTime]);

  const markAsDone = () => {
    if (typeof window === 'undefined') return;
    safeSetItem(`first-time-${key}`, true);
    setIsFirstTime(false);
  };

  return [isFirstTime, markAsDone];
}

