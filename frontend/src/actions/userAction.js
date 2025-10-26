import { FAVOURITE_CARD_ERROR, FAVOURITE_CARD_SUCCESS } from "./actionTypes";
import Axios from "axios";

export const UpdateFavouriteMovies = (userID, favouriteMovies) => {
  return async (dispatch) => {
    await Axios.patch(`/api/users/${userID}`, favouriteMovies)
      .then((docs) =>
        dispatch({ type: FAVOURITE_CARD_SUCCESS, payload: docs.data })
      )
      .catch((error) => dispatch({ type: FAVOURITE_CARD_ERROR, error }));
  };
};

// New user list management actions
export const addToWishlist = (movieId) => {
  return async (dispatch) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await Axios.post(`/api/users/me/wishlist/${movieId}`, {}, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };
};

export const removeFromWishlist = (movieId) => {
  return async (dispatch) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await Axios.delete(`/api/users/me/wishlist/${movieId}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };
};

export const addToBookmarks = (movieId) => {
  return async (dispatch) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await Axios.post(`/api/users/me/bookmarks/${movieId}`, {}, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
    } catch (error) {
      console.error("Error adding to bookmarks:", error);
    }
  };
};

export const removeFromBookmarks = (movieId) => {
  return async (dispatch) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await Axios.delete(`/api/users/me/bookmarks/${movieId}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
    } catch (error) {
      console.error("Error removing from bookmarks:", error);
    }
  };
};

export const addToOngoing = (movieId) => {
  return async (dispatch) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await Axios.post(`/api/users/me/ongoing/${movieId}`, {}, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
    } catch (error) {
      console.error("Error adding to ongoing:", error);
    }
  };
};

export const removeFromOngoing = (movieId) => {
  return async (dispatch) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await Axios.delete(`/api/users/me/ongoing/${movieId}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
    } catch (error) {
      console.error("Error removing from ongoing:", error);
    }
  };
};

export const addToCompleted = (movieId) => {
  return async (dispatch) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await Axios.post(`/api/users/me/completed/${movieId}`, {}, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
    } catch (error) {
      console.error("Error adding to completed:", error);
    }
  };
};

export const removeFromCompleted = (movieId) => {
  return async (dispatch) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await Axios.delete(`/api/users/me/completed/${movieId}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
    } catch (error) {
      console.error("Error removing from completed:", error);
    }
  };
};

