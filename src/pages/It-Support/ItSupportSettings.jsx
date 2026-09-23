import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ItSupportSettings.css";

const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default function ItSupportSettings() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoadingProfile(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage({
          type: "error",
          text: "Authentication token not found. Please login again.",
        });
        return;
      }

      const res = await axios.get(
        `${API_URL}/itsupport/profile`,
        getHeaders()
      );

      if (res.data?.success && res.data?.data) {
        setProfile({
          name: res.data.data.name || "",
          email: res.data.data.email || "",
          phone: res.data.data.phone || "",
        });
      }
    } catch (error) {
      console.error("PROFILE ERROR:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to load profile data.",
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setSavingProfile(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.put(
        `${API_URL}/itsupport/profile`,
        profile,
        getHeaders()
      );

      setMessage({
        type: "success",
        text: res.data?.message || "Profile updated successfully.",
      });

      if (res.data?.data) {
        setProfile({
          name: res.data.data.name || "",
          email: res.data.data.email || "",
          phone: res.data.data.phone || "",
        });
      }
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Could not update profile.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setMessage({ type: "", text: "" });

    if (!passwords.currentPassword) {
      setMessage({
        type: "error",
        text: "Enter your current password.",
      });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "New password must be at least 6 characters long.",
      });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      return;
    }

    if (passwords.currentPassword === passwords.newPassword) {
      setMessage({
        type: "error",
        text: "New password must be different from current password.",
      });
      return;
    }

    setLoadingPass(true);

    try {
      const res = await axios.put(
        `${API_URL}/itsupport/change-password`,
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
        getHeaders()
      );

      setMessage({
        type: "success",
        text: res.data?.message || "Password changed successfully.",
      });

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("PASSWORD ERROR:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Password update failed.",
      });
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="its-settings-wrapper">
      <div className="its-settings-title">
        <h2>IT Support Settings</h2>
        <p>Manage your account profile and security preferences</p>
      </div>

      {message.text && (
        <div className={`its-banner its-banner-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="its-grid-layout">
        <div className="its-card-box">
          <div className="its-card-head">
            <h3>Personal Information</h3>
            <p>Update your personal details</p>
          </div>

          {loadingProfile ? (
            <div className="its-loading">Loading profile...</div>
          ) : (
            <form
              onSubmit={handleProfileSubmit}
              className="its-form-group"
            >
              <div className="its-input-row">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="its-input-row">
                <label>Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="its-input-row">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      phone: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                className="its-action-btn primary"
                disabled={savingProfile}
              >
                {savingProfile
                  ? "Saving Changes..."
                  : "Save Profile"}
              </button>
            </form>
          )}
        </div>

        <div className="its-card-box">
          <div className="its-card-head">
            <h3>Change Password</h3>
            <p>Ensure your account stays secure</p>
          </div>

          <form
            onSubmit={handlePasswordSubmit}
            className="its-form-group"
          >
            <div className="its-input-row">
              <label>Current Password</label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="its-input-row">
              <label>New Password</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    newPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="its-input-row">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="its-action-btn success"
              disabled={loadingPass}
            >
              {loadingPass
                ? "Updating Password..."
                : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}