import React from "react";
import { connect } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
  addToBookmarks,
  removeFromBookmarks,
  addToOngoing,
  removeFromOngoing,
  addToCompleted,
  removeFromCompleted,
} from "../../actions/userAction";

const UserActionButtons = ({ movie, user, loggedIn, onListUpdate, ...props }) => {
  if (!loggedIn || !user || user.role !== "user") {
    return null;
  }

  const handleAction = async (actionFunc) => {
    await actionFunc(movie._id);
    if (onListUpdate) {
      onListUpdate(); // Refresh the lists
    }
  };

  return (
    <div className="user-actions mt-2">
      <div className="btn-group-vertical w-100">
        <button
          className="btn btn-sm btn-outline-primary mb-1"
          onClick={() => handleAction(props.addToWishlist)}
          title="Add to Wishlist"
        >
          <i className="fas fa-heart"></i> Wishlist
        </button>
        
        <button
          className="btn btn-sm btn-outline-info mb-1"
          onClick={() => handleAction(props.addToBookmarks)}
          title="Bookmark"
        >
          <i className="fas fa-bookmark"></i> Bookmark
        </button>
        
        <button
          className="btn btn-sm btn-outline-warning mb-1"
          onClick={() => handleAction(props.addToOngoing)}
          title="Mark as Ongoing"
        >
          <i className="fas fa-play"></i> Ongoing
        </button>
        
        <button
          className="btn btn-sm btn-outline-success"
          onClick={() => handleAction(props.addToCompleted)}
          title="Mark as Completed"
        >
          <i className="fas fa-check"></i> Completed
        </button>
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

const mapDispatchToProps = (dispatch) => {
  return {
    addToWishlist: (movieId) => dispatch(addToWishlist(movieId)),
    removeFromWishlist: (movieId) => dispatch(removeFromWishlist(movieId)),
    addToBookmarks: (movieId) => dispatch(addToBookmarks(movieId)),
    removeFromBookmarks: (movieId) => dispatch(removeFromBookmarks(movieId)),
    addToOngoing: (movieId) => dispatch(addToOngoing(movieId)),
    removeFromOngoing: (movieId) => dispatch(removeFromOngoing(movieId)),
    addToCompleted: (movieId) => dispatch(addToCompleted(movieId)),
    removeFromCompleted: (movieId) => dispatch(removeFromCompleted(movieId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserActionButtons);