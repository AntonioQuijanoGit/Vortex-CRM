import { useMediaQuery } from './useMediaQuery';

/**
 * Hook para detectar si el dispositivo es móvil (< 768px)
 * Reemplaza las múltiples implementaciones duplicadas
 * 
 * @returns {boolean} - true si el viewport es móvil
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)');
}

