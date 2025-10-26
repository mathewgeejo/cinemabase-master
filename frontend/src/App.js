import React, { Component } from "react";
import {
  Route,
  Redirect,
  Switch,
  BrowserRouter as Router,
} from "react-router-dom";

import Movies from "./pages/Movies";
import AddMovieForm from "./pages/AddMovie";
import AddGenre from "./pages/AddGenre";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import PillNav from "./components/PillNav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "./components/common";
// import MovieForm from './components/movieForm';

import "./App.css";

import { Provider, connect } from "react-redux";
import store from "./store";
import { restoreLoginState } from "./actions/authAction";

class App extends Component {
  componentDidMount() {
    // Restore login state from localStorage when app loads
    this.props.restoreLoginState();
  }

  render() {
    return (
      <div className="App">
        <PillNav 
          baseColor="#000000"
          pillColor="#ffffff"
          hoveredPillTextColor="#000000"
          pillTextColor="#000000"
          className="cinema-nav"
        />
        <Switch>
          <Route exact path="/addMovie" component={AddMovieForm} />
          <Route exact path="/addGenre" component={AddGenre} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/dashboard" component={UserDashboard} />
          <Route path="/register" component={Register} />
          <Route path="/" exact component={Movies} />

          <Redirect exact from="/movies" to="/" />
        </Switch>
        <ToastContainer />
      </div>
    );
  }
}

const ConnectedApp = connect(null, { restoreLoginState })(App);

class AppWrapper extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <ConnectedApp />
        </Router>
      </Provider>
    );
  }
}

export default AppWrapper;
