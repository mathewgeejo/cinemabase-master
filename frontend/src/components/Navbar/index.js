import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { signOut } from "../../actions/authAction";
import "./style_new.css";

class Navbar extends Component {
  logout = () => {
    this.props.signOut();
  };

  render() {
    const { loggedIn, user } = this.props;

    return (
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo/Brand */}
          <Link to="/" className="navbar-brand">
            <span className="navbar-logo">◉</span>
            <span className="navbar-title">CINEMABASE</span>
          </Link>

          {/* Navigation Links */}
          <div className="navbar-nav">
            <Link to="/movies" className="nav-link">
              Movies
            </Link>

            {loggedIn ? (
              <>
                {user && user.role === "admin" && (
                  <>
                    <Link to="/movies/new" className="nav-link">
                      Add Movie
                    </Link>
                    <Link to="/genres/new" className="nav-link">
                      Add Genre
                    </Link>
                  </>
                )}
                
                {user && user.role === "user" && (
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                )}
                
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
                
                <button onClick={this.logout} className="nav-link nav-logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="nav-link nav-cta">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedIn: state.auth.loggedIn,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({
  signOut: () => dispatch(signOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
