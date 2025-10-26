import Axios from "axios";
import { GET_MOVIES_SUCCESS, GET_MOVIES_ERROR } from "./actionTypes";

export const getMovies = () => {
  return async (dispatch) => {
    try {
      const result = await Axios.get("/api/movies");
      dispatch({ type: GET_MOVIES_SUCCESS, payload: result.data.movies });
    } catch (error) {
      dispatch({ type: GET_MOVIES_ERROR, error });
    }
  };
};

export const addMovie = (movie, history) => {
  return async (dispatch) => {
    console.log("Adding movie:", movie);
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.accessToken : null;
    const contentType = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    let formData = new FormData();
    formData.append("title", movie.title);
    formData.append("genre", movie.genre);
    formData.append("rate", movie.rate);
    formData.append("description", movie.description);
    
    // Only append image if it's actually a file
    if (movie.image && movie.image instanceof File) {
      formData.append("image", movie.image);
    }
    
    formData.append("trailerLink", movie.trailerLink || "");
    formData.append("movieLength", movie.movieLength);

    try {
      console.log("Sending POST request to /api/movies/addMovie");
      console.log("Token:", token);
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, ":", value);
      }
      
      const result = await Axios.post(
        "/api/movies/addMovie",
        formData,
        contentType
      );
      console.log("Received response from server:", result);
      dispatch({ type: GET_MOVIES_SUCCESS, payload: result.data.movies });
      history.push("/movies");
      
      // Refresh the movies list
      const updatedMovies = await Axios.get("/api/movies");
      dispatch({
        type: GET_MOVIES_SUCCESS,
        payload: updatedMovies.data.movies,
      });
    } catch (error) {
      console.error("Error sending request:", error);
      console.error("Error response:", error.response);
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
      }
      dispatch({ type: GET_MOVIES_ERROR, error });
      
      // Show user-friendly error message
      alert("Failed to add movie: " + (error.response?.data?.message || error.message));
    }
  };
};
