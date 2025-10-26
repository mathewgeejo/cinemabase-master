import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import "./style.css";

const AdminMovieManagement = ({ user, movies, onMovieDeleted }) => {
  const [showManagement, setShowManagement] = useState(false);
  const [deletingMovieId, setDeletingMovieId] = useState(null);

  if (!user || user.role !== "admin") {
    return null;
  }

  const handleDeleteMovie = async (movieId, movieTitle) => {
    if (window.confirm(`Are you sure you want to delete "${movieTitle}"? This action cannot be undone.`)) {
      setDeletingMovieId(movieId);
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        await axios.delete(`/api/movies/${movieId}`, {
          headers: { Authorization: `Bearer ${userData.accessToken}` },
        });
        
        // Notify parent component to refresh movies
        if (onMovieDeleted) {
          onMovieDeleted();
        }
        
        alert("Movie deleted successfully!");
      } catch (error) {
        console.error("Error deleting movie:", error);
        alert("Error deleting movie. Please try again.");
      } finally {
        setDeletingMovieId(null);
      }
    }
  };

  const handleEditMovie = (movieId) => {
    // For now, redirect to add movie page with edit mode
    // In a full implementation, you'd pass the movie data to edit
    window.location.href = `/movies/edit/${movieId}`;
  };

  return (
    <div className="admin-management-section">
      <div className="admin-header">
        <h3 className="text-white">
          <i className="fas fa-crown admin-icon"></i>
          Admin Movie Management
        </h3>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => setShowManagement(!showManagement)}
        >
          {showManagement ? "Hide" : "Show"} Management Panel
        </button>
      </div>

      {showManagement && (
        <div className="admin-panel">
          <div className="admin-actions">
            <Link to="/movies/new" className="btn btn-success mr-2">
              <i className="fas fa-plus"></i> Add New Movie
            </Link>
            <Link to="/genres/new" className="btn btn-info">
              <i className="fas fa-tags"></i> Add New Genre
            </Link>
          </div>

          <div className="movies-management">
            <h4 className="text-white mb-3">Manage Existing Movies</h4>
            {movies && movies.length > 0 ? (
              <div className="movie-list">
                {movies.slice(0, 10).map((movie) => (
                  <div key={movie._id} className="movie-item">
                    <div className="movie-info">
                      <img 
                        src={movie.image} 
                        alt={movie.title}
                        className="movie-thumbnail"
                        onError={(e) => {
                          e.target.src = '/placeholder-movie.jpg';
                        }}
                      />
                      <div className="movie-details">
                        <h6 className="movie-title">{movie.title}</h6>
                        <p className="movie-meta">
                          Rating: {movie.rate}/10 | 
                          {movie.genre && movie.genre.map(g => g.name).join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="movie-actions">
                      <button
                        className="btn btn-sm btn-outline-warning mr-2"
                        onClick={() => handleEditMovie(movie._id)}
                        title="Edit Movie"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteMovie(movie._id, movie.title)}
                        disabled={deletingMovieId === movie._id}
                        title="Delete Movie"
                      >
                        {deletingMovieId === movie._id ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <i className="fas fa-trash"></i>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
                {movies.length > 10 && (
                  <p className="text-muted text-center mt-3">
                    Showing first 10 movies. Use search to find specific movies.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted">No movies available to manage.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    movies: state.movie.movies,
  };
};

export default connect(mapStateToProps)(AdminMovieManagement);