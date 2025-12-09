import React, { useState } from "react";
import { useMovies } from "../hooks/useMovies";
import { Icons } from "../utils/icons";
import "./MovieTracker.css";

export default function MovieTracker({ pageId }) {
  const { movies, addMovie, updateMovie, deleteMovie, toggleWatched } =
    useMovies(pageId);
  const [newMovie, setNewMovie] = useState("");
  const [filter, setFilter] = useState("all"); // all, watched, unwatched

  const filteredMovies = movies.filter((movie) => {
    if (filter === "watched") return movie.watched;
    if (filter === "unwatched") return !movie.watched;
    return true;
  });

  const handleAdd = () => {
    if (newMovie.trim()) {
      addMovie(newMovie);
      setNewMovie("");
    }
  };

  return (
    <div className="movie-tracker">
      <div className="movie-header">
        <h2>Movie Tracker</h2>
        <p>Keep track of movies you want to watch</p>
      </div>

      <div className="movie-form">
        <input
          type="text"
          className="movie-input"
          placeholder="Add a movie..."
          value={newMovie}
          onChange={(e) => setNewMovie(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button className="movie-add-btn" onClick={handleAdd}>
          Add
        </button>
      </div>

      <div className="movie-filters">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({movies.length})
        </button>
        <button
          className={`filter-btn ${filter === "watched" ? "active" : ""}`}
          onClick={() => setFilter("watched")}
        >
          Watched ({movies.filter((m) => m.watched).length})
        </button>
        <button
          className={`filter-btn ${filter === "unwatched" ? "active" : ""}`}
          onClick={() => setFilter("unwatched")}
        >
          To Watch ({movies.filter((m) => !m.watched).length})
        </button>
      </div>

      <div className="movie-list">
        {filteredMovies.length === 0 ? (
          <div className="movie-empty">No movies yet. Add one above!</div>
        ) : (
          filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className={`movie-card ${movie.watched ? "watched" : ""}`}
            >
              <button
                className="movie-checkbox"
                onClick={() => toggleWatched(movie.id)}
                aria-label={
                  movie.watched ? "Mark as unwatched" : "Mark as watched"
                }
              >
                {movie.watched ? Icons.check : ""}
              </button>
              <span className="movie-title">{movie.title}</span>
              <div className="movie-actions">
                <button
                  className="movie-delete"
                  onClick={() => deleteMovie(movie.id)}
                  aria-label="Delete movie"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
