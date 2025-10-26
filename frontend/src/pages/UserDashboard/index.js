import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { MoviesTable } from "../../components";
import { Loading } from "../../components/common";

const UserDashboard = (props) => {
  const [userLists, setUserLists] = useState({
    wishlist: [],
    bookmarks: [],
    ongoingMovies: [],
    completedMovies: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("wishlist");

  useEffect(() => {
    if (props.loggedIn) {
      fetchUserLists();
    }
  }, [props.loggedIn]);

  const fetchUserLists = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get("/api/users/me/lists", {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setUserLists(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user lists:", error);
      setLoading(false);
    }
  };

  if (!props.loggedIn) {
    return (
      <div className="background-container pt-5">
        <div className="container">
          <h2 className="text-white">Please log in to view your dashboard.</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="background-container pt-5">
        <Loading />
      </div>
    );
  }

  const renderMovieList = (movies, listType) => {
    if (movies.length === 0) {
      return (
        <div className="text-center">
          <p className="text-muted">No movies in your {listType} yet.</p>
        </div>
      );
    }

    return (
      <MoviesTable
        pageSize={12}
        currentPage={1}
        movies={movies}
        showUserActions={true}
        onListUpdate={fetchUserLists}
      />
    );
  };

  return (
    <div className="background-container">
      <div className="mx-5 py-5">
        <h1 className="text-white mb-4">My Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="row mb-4">
          <div className="col-12">
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className={`nav-link ${activeTab === "wishlist" ? "active" : ""}`}
                  onClick={() => setActiveTab("wishlist")}
                  type="button"
                >
                  Wishlist ({userLists.wishlist.length})
                </button>
                <button
                  className={`nav-link ${activeTab === "bookmarks" ? "active" : ""}`}
                  onClick={() => setActiveTab("bookmarks")}
                  type="button"
                >
                  Bookmarks ({userLists.bookmarks.length})
                </button>
                <button
                  className={`nav-link ${activeTab === "ongoing" ? "active" : ""}`}
                  onClick={() => setActiveTab("ongoing")}
                  type="button"
                >
                  Ongoing ({userLists.ongoingMovies.length})
                </button>
                <button
                  className={`nav-link ${activeTab === "completed" ? "active" : ""}`}
                  onClick={() => setActiveTab("completed")}
                  type="button"
                >
                  Completed ({userLists.completedMovies.length})
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="row">
          <div className="col-12">
            {activeTab === "wishlist" && renderMovieList(userLists.wishlist, "wishlist")}
            {activeTab === "bookmarks" && renderMovieList(userLists.bookmarks, "bookmarks")}
            {activeTab === "ongoing" && renderMovieList(userLists.ongoingMovies, "ongoing list")}
            {activeTab === "completed" && renderMovieList(userLists.completedMovies, "completed list")}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loggedIn: state.auth.loggedIn,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(UserDashboard);