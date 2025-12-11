import { useState, useEffect } from "react";
import { safeGetItem, safeSetItem } from "../utils/storage";
import { logger } from "../utils/logger";

export function useMovies(pageId) {
  const storageKey = pageId ? `movies-${pageId}` : "movies";
  
  const [movies, setMovies] = useState(() => {
    return safeGetItem(storageKey, []);
  });

  useEffect(() => {
    try {
      safeSetItem(storageKey, movies);
    } catch (error) {
      logger.error("Failed to save movies:", error);
    }
  }, [movies, storageKey]);

  const addMovie = (title) => {
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

