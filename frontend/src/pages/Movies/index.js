import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import { search, categorize, filterRating } from "../../utils";
import { MoviesTable, Pagination } from "../../components";
import { Input, Loading, ListGroup, Rating } from "../../components/common";
import AdminMovieManagement from "../../components/AdminMovieManagement";

import { getMovies } from "../../actions/moviesAction";
import { getGenres } from "../../actions/genreAction";
import "./style.css";

const Movies = (props) => {
  const [pageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentGenre, setCurrentGenre] = useState("All");
  const [searchFilter, setSearchFilter] = useState("");
  const [rating, setRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    props.getMovies();
    props.getGenres();
  }, [props.loggedIn, props.getMovies, props.getGenres]);

  const handleChange = (name, value) => {
    if (name === "currentGenre") {
      setCurrentGenre(value);
    } else if (name === "searchFilter") {
      setSearchFilter(value);
    } else if (name === "rating") {
      setRating(value);
    }
    setCurrentPage(1);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setCurrentGenre("All");
    setSearchFilter("");
    setRating(0);
    setCurrentPage(1);
  };

  const { movies, genres, loading } = props;
  const allGenres = [{ name: "All" }, ...(genres || [])];

  const filteredMovies = useMemo(() => {
    if (!movies || !Array.isArray(movies)) return [];
    let result = search(movies, searchFilter, "title");
    result = categorize(result, currentGenre);
    result = filterRating(result, Number(rating));
    return result;
  }, [movies, searchFilter, currentGenre, rating]);

  const hasActiveFilters = currentGenre !== "All" || searchFilter || rating > 0;

  if (loading) {
    return (
      <div className="movies-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading movies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movies-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Movie Collection</h1>
            <p className="page-subtitle">
              Discover and explore our extensive movie library
            </p>
          </div>
          
          {/* Admin Movie Management */}
          {props.loggedIn && props.user && props.user.role === "admin" && (
            <AdminMovieManagement />
          )}
        </div>

        {/* Search and Filters */}
        <div className="search-section">
          <div className="search-bar">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search movies..."
                className="search-input"
                value={searchFilter}
                onChange={(event) => handleChange("searchFilter", event.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <button 
              className="filter-toggle btn btn-ghost"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters {showFilters ? '−' : '+'}
            </button>
          </div>

          {/* Filters Panel */}
          <div className={`filters-panel ${showFilters ? 'open' : ''}`}>
            <div className="filters-grid">
              <div className="filter-group">
                <h4 className="filter-title">Genre</h4>
                <ListGroup
                  active={currentGenre}
                  onChange={(val) => handleChange("currentGenre", val)}
                  options={allGenres}
                />
              </div>
              
              <div className="filter-group">
                <h4 className="filter-title">Minimum Rating</h4>
                <Rating
                  total={10}
                  filled={rating}
                  onChange={(val) => handleChange("rating", val)}
                />
              </div>
            </div>
            
            {hasActiveFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p className="results-count">
            {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''} found
            {hasActiveFilters && ' with current filters'}
          </p>
          
          {hasActiveFilters && (
            <div className="active-filters">
              {currentGenre !== "All" && (
                <span className="filter-tag">
                  Genre: {currentGenre}
                  <button onClick={() => handleChange("currentGenre", "All")}>×</button>
                </span>
              )}
              {rating > 0 && (
                <span className="filter-tag">
                  Rating: {rating}+ ★
                  <button onClick={() => handleChange("rating", 0)}>×</button>
                </span>
              )}
              {searchFilter && (
                <span className="filter-tag">
                  Search: "{searchFilter}"
                  <button onClick={() => handleChange("searchFilter", "")}>×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <>
            <MoviesTable
              pageSize={pageSize}
              currentPage={currentPage}
              movies={filteredMovies}
              showUserActions={props.loggedIn && props.user && props.user.role === "user"}
            />
            
            <Pagination
              itemsCount={filteredMovies.length}
              pageSize={pageSize}
              onPageChange={onPageChange}
              currentPage={currentPage}
            />
          </>
        ) : (
          <div className="no-results">
            <div className="no-results-content">
              <span className="no-results-icon">🎬</span>
              <h3>No movies found</h3>
              <p>
                {hasActiveFilters 
                  ? "Try adjusting your filters to see more movies."
                  : "No movies are available at the moment."
                }
              </p>
              {hasActiveFilters && (
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  movies: state.movie.movies,
  genres: state.genre.genres,
  loggedIn: state.auth.loggedIn,
  user: state.auth.user,
  loading: state.movie.loading,
});

const mapDispatchToProps = (dispatch) => ({
  getMovies: () => dispatch(getMovies()),
  getGenres: () => dispatch(getGenres()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Movies);
