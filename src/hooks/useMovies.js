import { useState, useEffect } from "react";
import { safeGetItem, safeSetItem } from "../utils/storage";
import { validateTitle } from "../utils/validation";
import { logger } from "../utils/logger";
import { STORAGE_KEYS } from "../constants";

export function useMovies(pageId) {
  const storageKey = STORAGE_KEYS.MOVIES(pageId);
  
  const [movies, setMovies] = useState(() => {
    const saved = safeGetItem(storageKey, []);
    // Validate data structure
    if (!Array.isArray(saved)) {
      logger.warn("Invalid movies data structure, using empty array");
      return [];
    }
    return saved;
  });

  useEffect(() => {
    try {
      safeSetItem(storageKey, movies);
    } catch (error) {
      logger.error("Failed to save movies:", error);
    }
  }, [movies, storageKey]);

  const addMovie = (title) => {
    // Validate title consistently with other hooks
    const validation = validateTitle(title);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const newMovie = {
      id: crypto.randomUUID(),
      title: title.trim(),
      watched: false,
      createdAt: new Date().toISOString(),
      watchedAt: null,
    };
    setMovies((prev) => [newMovie, ...prev]);
  };

  const updateMovie = (id, updates) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === id ? { ...movie, ...updates } : movie
      )
    );
  };

  const deleteMovie = (id) => {
    setMovies((prev) => prev.filter((movie) => movie.id !== id));
  };

  const toggleWatched = (id) => {
    setMovies((prev) =>
      prev.map((movie) => {
        if (movie.id !== id) return movie;
        return {
          ...movie,
          watched: !movie.watched,
          watchedAt: !movie.watched ? new Date().toISOString() : null,
        };
      })
    );
  };

  return {
    movies,
    addMovie,
    updateMovie,
    deleteMovie,
    toggleWatched,
  };
}

