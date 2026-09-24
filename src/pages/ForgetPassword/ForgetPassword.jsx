import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import { FaEnvelope, FaKey, FaArrowLeft, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "./AuthStyles.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your registered email address");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email.trim().toLowerCase());

      toast.success(res.data?.message || "Reset link sent to your email!");
      setIsSubmitted(true);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to process request";
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
            {isSubmitted ? <FaCheckCircle /> : <FaKey />}
          </div>
          <h2>
            Forgot <span>Password?</span>
          </h2>
          <p>
            {isSubmitted
              ? "Check your inbox for further instructions."
              : "Enter your registered email address to receive a secure password reset link."}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-field-wrapper">
                <span className="field-icon">
                  <FaEnvelope />
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <span className="spinner-container">
                  <span className="spinner"></span>
                  Sending Link...
                </span>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <FaPaperPlane className="btn-icon-right" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="success-action-box">
            <p className="success-note">
              We sent a verification link to <strong>{email}</strong>. Please click the link inside to set a new password.
            </p>
            <button
              type="button"
              className="auth-secondary-btn"
              onClick={() => setIsSubmitted(false)}
            >
              Didn't get an email? Try again
            </button>
          </div>
        )}

        <div className="bottom-text">
          <Link to="/login" className="back-link">
            <FaArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;