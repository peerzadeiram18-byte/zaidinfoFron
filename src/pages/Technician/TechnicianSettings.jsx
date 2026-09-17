import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TechnicianSettings.css";

const TechnicianSettings = () => {
  // State for Profile Info
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // State for Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI States
  const [message, setMessage] = useState({ text: "", type: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ==========================================
  // 1. GET PROFILE DETAILS ON LOAD
  // ==========================================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return setMessage({
            text: "Session expired. Please log in again.",
            type: "error",
          });
        }

        const res = await axios.get("http://localhost:5000/api/newRepair/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.success && res.data?.data) {
          const { name, email, phone } = res.data.data;
          setProfile({
            name: name || "",
            email: email || "",
            phone: phone || "",
          });
        }
      } catch (err) {
        console.error("Profile load failed:", err);
        setMessage({
          text: err.response?.data?.message || "Failed to fetch profile details.",
          type: "error",
        });
      }
    };

    fetchProfile();
  }, []);

  // ==========================================
  // 2. UPDATE PROFILE (Name, Email, Phone)
  // ==========================================
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setMessage({ text: "", type: "" });

    const token = localStorage.getItem("token");
    if (!token) {
      setProfileLoading(false);
      return setMessage({
        text: "Session expired. Please log in again.",
        type: "error",
      });
    }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/newRepair/profile",
        {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        setMessage({
          text: res.data.message || "Profile updated successfully.",
          type: "success",
        });
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage({
        text: err.response?.data?.message || "Failed to update profile.",
        type: "error",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // ==========================================
  // 3. CHANGE PASSWORD
  // ==========================================
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setMessage({
        text: "New passwords do not match.",
        type: "error",
      });
    }

    if (passwordData.newPassword.length < 6) {
      return setMessage({
        text: "New password must be at least 6 characters.",
        type: "error",
      });
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return setMessage({
        text: "Session expired. Please log in again.",
        type: "error",
      });
    }

    setPasswordLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await axios.put(
        "http://localhost:5000/api/newRepair/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        setMessage({
          text: res.data.message || "Password updated successfully.",
          type: "success",
        });
        // Clear password form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.error("Password update error:", err);
      setMessage({
        text: err.response?.data?.message || "Failed to change password.",
        type: "error",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="tech-settings-wrapper">
      <div className="tech-settings-header">
        <h1>Account & Settings</h1>
        <p>Manage your contact details and security credentials.</p>
      </div>

      {/* Alert Notification */}
      {message.text && (
        <div className={`tech-alert ${message.type}`}>
          <span>{message.type === "success" ? "✓" : "✕"}</span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Form Card */}
      <section className="tech-card">
        <div className="tech-card-header">
          <h2>Technician Profile</h2>
          <p>Personal and contact information</p>
        </div>

        <form onSubmit={handleProfileSubmit}>
          <div className="form-grid-2">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                className="input-field"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="e.g. Priya Sharma"
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                className="input-field"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="tel"
                className="input-field"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-modern btn-modern-primary"
              disabled={profileLoading}
            >
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>

      {/* Password Change Form Card */}
      <section className="tech-card">
        <div className="tech-card-header">
          <h2>Security & Credentials</h2>
          <p>Update your authentication password periodically</p>
        </div>

        <form onSubmit={handlePasswordSubmit}>
          <div className="form-grid-3">
            <div className="input-group">
              <label>Current Password</label>
              <input
                type="password"
                className="input-field"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
                required
              />
            </div>

            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                className="input-field"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
                required
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                className="input-field"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-modern btn-modern-dark"
              disabled={passwordLoading}
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default TechnicianSettings;