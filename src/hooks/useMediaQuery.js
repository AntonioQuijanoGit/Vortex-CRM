import { useState, useEffect } from 'react';

/**
 * Hook para detectar media queries de forma reactiva
 * @param {string} query - Media query string (ej: '(max-width: 768px)')
 * @returns {boolean} - true si la query coincide
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);
    
    // Compatibilidad con navegadores antiguos
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      // Establecer valor inicial
      setMatches(mediaQuery.matches);
      
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Fallback para navegadores antiguos
      mediaQuery.addListener(handler);
      setMatches(mediaQuery.matches);
      
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
}

