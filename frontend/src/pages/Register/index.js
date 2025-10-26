import React from "react";
import Joi from "joi";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { signUp } from "../../actions/authAction";
import "./style.css";

class RegisterForm extends React.Component {
  state = {
    data: {
      email: "",
      password: "",
      passwordRepeat: "",
      role: "user",
    },
    errors: {},
    passwordError: "",
    isLoading: false,
  };

  componentDidUpdate(prevProps) {
    if (this.props.loggedIn && !prevProps.loggedIn) {
      // Show success toast
      if (window.showToast) {
        window.showToast('Registration successful! Welcome to CinemaBase.', 'success');
      }
      this.props.history.push("/");
    }
  }

  schema = {
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    password: Joi.string().min(8).required().label("Password"),
    passwordRepeat: Joi.string().required().label("Repeat Password"),
    role: Joi.string().valid("user", "admin").required().label("Role"),
  };

  validateProperty = (input) => {
    const { name, value } = input;
    const obj = { [name]: value };
    const subSchema = Joi.object({ [name]: this.schema[name] });
    const { error } = subSchema.validate(obj);
    return error ? error.details[0].message : null;
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    
    // Clear password error when user types
    if (input.name === 'password' || input.name === 'passwordRepeat') {
      this.setState({ passwordError: "" });
    }
    
    this.setState({ data, errors });
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.object(this.schema).validate(
      this.state.data,
      options
    );
    if (!error) return null;

    const errors = {};
    error.details.forEach(
      (element) => (errors[element.path[0]] = element.message)
    );
    return errors;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { password, passwordRepeat, email, role } = this.state.data;
    
    if (password !== passwordRepeat) {
      this.setState({ passwordError: "The passwords do not match." });
      return;
    }
    
    const validationErrors = this.validate();
    if (!validationErrors) {
      this.setState({ isLoading: true, passwordError: "" });
      this.props.signUp({ email, password, role }, this.props.history);
    }
  };

  render() {
    const { authMessage } = this.props;
    const { errors, passwordError, isLoading } = this.state;
    const { email, password, passwordRepeat, role } = this.state.data;
    const isDisabled = !!this.validate() || isLoading || !!passwordError;

    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join CinemaBase today</p>
          </div>

          <form onSubmit={this.handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                value={email}
                onChange={this.handleChange}
                autoFocus
                autoComplete="email"
              />
              {errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password (min 8 characters)"
                value={password}
                onChange={this.handleChange}
                autoComplete="new-password"
              />
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="passwordRepeat" className="form-label">
                Confirm Password
              </label>
              <input
                id="passwordRepeat"
                name="passwordRepeat"
                type="password"
                className={`form-input ${errors.passwordRepeat || passwordError ? 'error' : ''}`}
                placeholder="Confirm your password"
                value={passwordRepeat}
                onChange={this.handleChange}
                autoComplete="new-password"
              />
              {errors.passwordRepeat && (
                <span className="form-error">{errors.passwordRepeat}</span>
              )}
              {passwordError && (
                <span className="form-error">{passwordError}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={this.handleChange}
                className={`form-input ${errors.role ? 'error' : ''}`}
              >
                <option value="user">User - Browse and manage your watchlist</option>
                <option value="admin">Admin - Manage movies and content</option>
              </select>
              {errors.role && (
                <span className="form-error">{errors.role}</span>
              )}
            </div>

            {authMessage && (
              <div className="auth-message error">
                {authMessage}
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary btn-lg ${isDisabled ? 'disabled' : ''}`}
              disabled={isDisabled}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="auth-footer">
              <p className="auth-link-text">
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedIn: state.auth.loggedIn,
  authMessage: state.auth.authMessage,
});

const mapDispatchToProps = (dispatch) => ({
  signUp: (creds, history) => dispatch(signUp(creds, history)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
