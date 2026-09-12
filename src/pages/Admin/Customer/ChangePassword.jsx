
import { useState } from "react";
import "./ChangePassword.css";


const ChangePassword = () => {
  const token = localStorage.getItem("token");

  

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmedNewPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordHandler = (e) => {
    const { value, name } = e.target;

    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const submitHandler = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const {
      currentPassword,
      newPassword,
      confirmedNewPassword,
    } = password;

    if (!currentPassword || !newPassword || !confirmedNewPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from the current password.");
      return;
    }

    if (newPassword !== confirmedNewPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (!token) {
      setError("Authentication token is missing. Please log in again.");
      return;
    }

    setLoading(true);

    fetch("http://localhost:5000/api/users/change-password", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: currentPassword,
        newPassword: newPassword,
      }),
    })
      .then((response) => {
        return response.json().then((data) => ({
          status: response.status,
          data,
        }));
      })
      .then(({ status, data }) => {
        if (status >= 200 && status < 300 && data.success) {
          setSuccess(data.message || "Password updated successfully.");

          setPassword({
            currentPassword: "",
            newPassword: "",
            confirmedNewPassword: "",
          });
        } else {
          setError(data.message || "Unable to change password.");
        }
      })
      .catch(() => {
        setError(
          "Unable to connect to the server. Please try again later."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="change-password-container">
      {success && (
        <div className="password-toast success-toast">
          <span className="toast-icon">✓</span>
          <span>{success}</span>
        </div>
      )}

      <div className="change-password-card">
        <div className="change-password-header">
          <h2>Change Password</h2>
          <p>Update your password to keep your account secure.</p>
        </div>

        <form onSubmit={submitHandler} className="change-password-form">
          <div className="password-field">
            <label htmlFor="currentPassword">
              Current Password
            </label>

            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={password.currentPassword}
              onChange={passwordHandler}
              placeholder="Enter current password"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <div className="password-field">
            <label htmlFor="newPassword">
              New Password
            </label>

            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={password.newPassword}
              onChange={passwordHandler}
              placeholder="Enter new password"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <div className="password-field">
            <label htmlFor="confirmedNewPassword">
              Confirm New Password
            </label>

            <input
              id="confirmedNewPassword"
              name="confirmedNewPassword"
              type="password"
              value={password.confirmedNewPassword}
              onChange={passwordHandler}
              placeholder="Confirm new password"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="password-error">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="change-password-button"
            disabled={loading}
          >
            {loading ? "Updating Password..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;