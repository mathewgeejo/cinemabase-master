import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  SIGNOUT,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
} from "./actionTypes";
import Axios from "axios";

export const signIn = (credentials, history) => {
  return async (dispatch) => {
    try {
      const result = await Axios.post("/api/auth/signIn", credentials);
      localStorage.setItem("user", JSON.stringify(result.data));
      dispatch({ type: LOGIN_SUCCESS, payload: result.data });
      
      // Show success message
      if (result.data.message) {
        dispatch({ type: "SET_AUTH_MESSAGE", payload: result.data.message });
      }
      
      history.push("/movies");
    } catch (error) {
      dispatch({ type: LOGIN_ERROR, error });
    }
  };
};

export const signUp = (credentials, history) => {
  return async (dispatch) => {
    try {
      const result = await Axios.post("/api/auth/signup", credentials);
      localStorage.setItem("user", JSON.stringify(result.data));
      dispatch({ type: SIGNUP_SUCCESS, payload: result.data });
      
      // Show success message
      if (result.data.message) {
        dispatch({ type: "SET_AUTH_MESSAGE", payload: result.data.message });
      }
      
      history.push("/movies");
    } catch (error) {
      dispatch({ type: SIGNUP_ERROR, error });
    }
  };
};

export const signOut = () => {
  return (dispatch) => {
    localStorage.removeItem("user");
    dispatch({ type: SIGNOUT });
  };
};

// Action to restore login state from localStorage
export const restoreLoginState = () => {
  return (dispatch) => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        dispatch({ type: LOGIN_SUCCESS, payload: userData });
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
  };
};

// Clear auth message
export const clearAuthMessage = () => {
  return { type: "CLEAR_AUTH_MESSAGE" };
};
