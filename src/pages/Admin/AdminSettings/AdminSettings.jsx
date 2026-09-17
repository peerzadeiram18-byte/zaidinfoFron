import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiUser,
  FiLock,
  FiMail,
  FiPhone,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiSave,
} from "react-icons/fi";
import "./AdminSettings.css";

const API = "http://localhost:5000/api/users";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API}/profile`,
        config
      );

      const user = response.data?.data;

      if (user) {
        setProfile({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await axios.put(
        `${API}/profile`,
        {
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
        },
        config
      );

      setMessage(
        response.data?.message ||
        "Profile updated successfully"
      );

      if (response.data?.data) {
        const updatedUser = response.data.data;

        setProfile({
          firstName: updatedUser.firstName || "",
          lastName: updatedUser.lastName || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone || "",
        });

        const storedUser =
          JSON.parse(localStorage.getItem("user") || "{}");

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            ...updatedUser,
          })
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    if (
      !password.oldPassword ||
      !password.newPassword ||
      !password.confirmPassword
    ) {
      setError("Please fill all password fields");
      setMessage("");
      return;
    }

    if (
      password.newPassword !==
      password.confirmPassword
    ) {
      setError("New passwords do not match");
      setMessage("");
      return;
    }

    if (
      password.oldPassword ===
      password.newPassword
    ) {
      setError(
        "New password must be different from old password"
      );
      setMessage("");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await axios.put(
        `${API}/change-password`,
        {
          oldPassword: password.oldPassword,
          newPassword: password.newPassword,
        },
        config
      );

      setMessage(
        response.data?.message ||
        "Password changed successfully"
      );

      setPassword({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <div>
          <span className="settings-label">ACCOUNT</span>
          <h1>Admin Settings</h1>
          <p>
            Manage your profile and account security.
          </p>
        </div>
      </div>

      {message && (
        <div className="settings-message success">
          {message}
        </div>
      )}

      {error && (
        <div className="settings-message error">
          {error}
        </div>
      )}

      <div className="settings-layout">
        <aside className="settings-menu">
          <button
            className={
              activeTab === "profile" ? "active" : ""
            }
            onClick={() => {
              setActiveTab("profile");
              setMessage("");
              setError("");
            }}
          >
            <FiUser />
            <span>Profile</span>
          </button>

          <button
            className={
              activeTab === "password" ? "active" : ""
            }
            onClick={() => {
              setActiveTab("password");
              setMessage("");
              setError("");
            }}
          >
            <FiLock />
            <span>Security</span>
          </button>
        </aside>

        <section className="settings-content">
          {activeTab === "profile" && (
            <form
              className="settings-card"
              onSubmit={updateProfile}
            >
              <div className="card-heading">
                <div className="heading-icon">
                  <FiUser />
                </div>

                <div>
                  <h2>Profile Information</h2>
                  <p>
                    Update your personal account information.
                  </p>
                </div>
              </div>

              <div className="profile-avatar">
                {profile.firstName?.charAt(0)?.toUpperCase() ||
                  "A"}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <div className="input-wrapper">
                    <FiUser />
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleProfileChange}
                      placeholder="First name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <div className="input-wrapper">
                    <FiUser />
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleProfileChange}
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <div className="input-wrapper disabled">
                    <FiMail />
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                    />
                  </div>
                  <small>
                    Email cannot be changed here.
                  </small>
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <div className="input-wrapper">
                    <FiPhone />
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="save-btn"
                  disabled={loading}
                >
                  <FiSave />
                  {loading
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "password" && (
            <form
              className="settings-card"
              onSubmit={updatePassword}
            >
              <div className="card-heading">
                <div className="heading-icon">
                  <FiLock />
                </div>

                <div>
                  <h2>Change Password</h2>
                  <p>
                    Keep your admin account secure with a
                    strong password.
                  </p>
                </div>
              </div>

              <div className="password-form">
                <div className="form-group">
                  <label>Current Password</label>

                  <div className="input-wrapper">
                    <FiLock />

                    <input
                      type={
                        showPassword.old
                          ? "text"
                          : "password"
                      }
                      name="oldPassword"
                      value={password.oldPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        togglePassword("old")
                      }
                    >
                      {showPassword.old ? (
                        <FiEyeOff />
                      ) : (
                        <FiEye />
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>New Password</label>

                  <div className="input-wrapper">
                    <FiLock />

                    <input
                      type={
                        showPassword.new
                          ? "text"
                          : "password"
                      }
                      name="newPassword"
                      value={password.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        togglePassword("new")
                      }
                    >
                      {showPassword.new ? (
                        <FiEyeOff />
                      ) : (
                        <FiEye />
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>

                  <div className="input-wrapper">
                    <FiLock />

                    <input
                      type={
                        showPassword.confirm
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={password.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        togglePassword("confirm")
                      }
                    >
                      {showPassword.confirm ? (
                        <FiEyeOff />
                      ) : (
                        <FiEye />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="password-note">
                <FiEdit3 />
                <span>
                  Use a strong password that you don't use
                  on other websites.
                </span>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="save-btn"
                  disabled={loading}
                >
                  <FiLock />
                  {loading
                    ? "Updating..."
                    : "Change Password"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminSettings;