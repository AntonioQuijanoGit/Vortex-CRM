import React from "react";
import { useMovies } from "../../hooks/useMovies";
import MovieTracker from "../MovieTracker";
import "./Block.css";

export default function MovieBlock({ pageId, data, onUpdate }) {
  // Use a unique key for this block's movies
  const blockPageId = pageId ? `${pageId}-movies` : "movies";
  return (
    <div className="block movie-block">
      <div className="block-header">
        <span className="block-icon">🎬</span>
        <h3 className="block-title">Movies</h3>
      </div>
      <MovieTracker pageId={blockPageId} />
    </div>
  );
}

