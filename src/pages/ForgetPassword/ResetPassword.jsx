import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import "./AuthStyles.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword(token, password);

      toast.success(res.data?.message || "Password reset successful! Please log in.");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Password reset failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-top-accent"></div>

        <div className="auth-header">
          <div className="header-icon-badge">
            <FaShieldAlt />
          </div>
          <h2>
            Reset <span>Password</span>
          </h2>
          <p>Create a strong, new password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* NEW PASSWORD */}
          <div className="input-group">
            <label htmlFor="password">New Password</label>
            <div className="input-field-wrapper">
              <span className="field-icon">
                <FaLock />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="input-field-wrapper">
              <span className="field-icon">
                <FaLock />
              </span>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="spinner-container">
                <span className="spinner"></span>
                Updating Password...
              </span>
            ) : (
              <>
                <span>Update Password</span>
                <FaCheck className="btn-icon-right" />
              </>
            )}
          </button>
        </form>

        <div className="bottom-text">
          Remembered your credentials?{" "}
          <Link to="/login" className="register-link">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;