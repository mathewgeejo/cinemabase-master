import React, { useState } from "react";
import "./style_new.css";

export default function MovieCard({ movie, showUserActions, onListUpdate }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const {
    _id,
    title,
    rate,
    genre,
    image,
    description,
    trailerLink,
    movieLength,
  } = movie;

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleTrailerClick = (e) => {
    e.stopPropagation();
    if (trailerLink) {
      window.open(trailerLink, '_blank');
    }
  };

  const placeholderImage = "https://via.placeholder.com/300x450/f5f5f5/666666?text=No+Image";
  const displayImage = image || placeholderImage;

  return (
    <div className="movie-card">
      <div className={`movie-card-inner ${isFlipped ? 'flipped' : ''}`} onClick={handleCardClick}>
        {/* Front of card */}
        <div className="movie-card-front">
          <div className="movie-image-container">
            <img 
              src={displayImage} 
              alt={title}
              className="movie-image"
              onError={(e) => {
                e.target.src = placeholderImage;
              }}
            />
            <div className="movie-overlay">
              <div className="movie-rating">
                <span className="rating-value">{rate || 'N/A'}</span>
                <span className="rating-label">★</span>
              </div>
              {trailerLink && (
                <button 
                  className="trailer-btn"
                  onClick={handleTrailerClick}
                  title="Watch Trailer"
                >
                  ▶
                </button>
              )}
            </div>
          </div>
          
          <div className="movie-info">
            <h3 className="movie-title">{title}</h3>
            <div className="movie-meta">
              {genre && <span className="movie-genre">{genre.name}</span>}
              {movieLength && <span className="movie-duration">{movieLength} min</span>}
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="movie-card-back">
          <div className="movie-description">
            <h3 className="movie-title">{title}</h3>
            <p className="description-text">
              {description || 'No description available.'}
            </p>
            
            <div className="movie-details">
              {genre && (
                <div className="detail-item">
                  <span className="detail-label">Genre:</span>
                  <span className="detail-value">{genre.name}</span>
                </div>
              )}
              {movieLength && (
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{movieLength} minutes</span>
                </div>
              )}
              {rate && (
                <div className="detail-item">
                  <span className="detail-label">Rating:</span>
                  <span className="detail-value">{rate}/10 ★</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User action buttons */}
      {showUserActions && (
        <div className="movie-actions">
          <button className="action-btn btn-wishlist" title="Add to Wishlist">
            ♡
          </button>
          <button className="action-btn btn-ongoing" title="Mark as Ongoing">
            ⏯
          </button>
          <button className="action-btn btn-completed" title="Mark as Completed">
            ✓
          </button>
        </div>
      )}
    </div>
  );
}
