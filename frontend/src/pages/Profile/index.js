import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Input, Loading } from "../../components/common";
import "./style.css";

const Profile = (props) => {
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    avatar: "",
    email: "",
    role: "",
    joinedDate: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (props.loggedIn) {
      fetchProfile();
    } else {
      props.history.push("/login");
    }
  }, [props.loggedIn, props.history]);

  const fetchProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get("/api/users/me/profile", {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      
      const userData = response.data.user;
      setProfile({
        name: userData.profile.name || "",
        bio: userData.profile.bio || "",
        avatar: userData.profile.avatar || "",
        email: userData.email,
        role: userData.role,
        joinedDate: new Date(userData.profile.joinedDate || userData.createdAt).toLocaleDateString(),
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.put("/api/users/me/profile", {
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar,
      }, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });

      setMessage("Profile updated successfully!");
      setIsEditing(false);
      
      // Update local storage with new profile data
      const updatedUser = { ...user, user: response.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
    } catch (error) {
      setMessage("Error updating profile. Please try again.");
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!props.loggedIn) {
    return (
      <div className="background-container pt-5">
        <div className="container">
          <h2 className="text-white">Please log in to view your profile.</h2>
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

  return (
    <div className="background-container">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="profile-card">
              <div className="profile-header">
                <div className="avatar-container">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="avatar" />
                  ) : (
                    <div className="avatar-placeholder">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>
                <div className="profile-info">
                  <h2 className="profile-name">{profile.name || "No name set"}</h2>
                  <p className="profile-email">{profile.email}</p>
                  <span className={`role-badge ${profile.role}`}>
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </span>
                </div>
                <button
                  className="btn btn-outline-primary edit-btn"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {message && (
                <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
                  {message}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                  <Input
                    name="name"
                    label="Name"
                    type="text"
                    iconClass="fas fa-user"
                    onChange={handleChange}
                    placeholder="Enter your name..."
                    value={profile.name}
                  />
                  
                  <div className="form-group">
                    <label>Bio</label>
                    <div className="input-icon fas fa-edit" />
                    <textarea
                      name="bio"
                      className="form-control"
                      rows="4"
                      placeholder="Tell us about yourself..."
                      value={profile.bio}
                      onChange={handleChange}
                    />
                  </div>

                  <Input
                    name="avatar"
                    label="Avatar URL"
                    type="url"
                    iconClass="fas fa-image"
                    onChange={handleChange}
                    placeholder="Enter avatar image URL..."
                    value={profile.avatar}
                  />

                  <button
                    type="submit"
                    className="btn special-btn"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              ) : (
                <div className="profile-details">
                  <div className="detail-section">
                    <h4>About</h4>
                    <p>{profile.bio || "No bio available"}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Member Since</h4>
                    <p>{profile.joinedDate}</p>
                  </div>
                </div>
              )}
            </div>
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

export default connect(mapStateToProps)(Profile);