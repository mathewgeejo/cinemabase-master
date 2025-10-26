import React from "react";

import MovieCard from "./MovieCard";
import "./style.css";

export default function MoviesTable({ movies, currentPage, pageSize, showUserActions, onListUpdate }) {
  const currentMovies = movies.slice(
    (currentPage - 1) * pageSize,
    pageSize * currentPage
  );

  return (
    <div className="movies-grid">
      {!!movies &&
        currentMovies.map((movie) => (
          <MovieCard 
            movie={movie} 
            key={movie._id} 
            showUserActions={showUserActions}
            onListUpdate={onListUpdate}
          />
        ))}
       
    </div>
  );
}