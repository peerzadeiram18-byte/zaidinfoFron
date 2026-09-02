import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaEnvelope,
    FaShieldAlt,
    FaArrowRight,
} from "react-icons/fa";

import { toast } from "react-toastify";

import {
    verifyEmail,
    resendEmailVerificationOtp,
} from "../../services/authService";

import "./VerifyEmail.css";

function VerifyEmail() {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [otp, setOtp] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [resendLoading, setResendLoading] =
        useState(false);

    const [countdown, setCountdown] =
        useState(0);

    // ==================================================
    // GET EMAIL
    // ==================================================

    useEffect(() => {

        const savedEmail =
            localStorage.getItem(
                "verificationEmail"
            );

        if (!savedEmail) {

            toast.error(
                "Verification email not found"
            );

            navigate("/login");

            return;
        }

        setEmail(savedEmail);

    }, [navigate]);

    // ==================================================
    // COUNTDOWN
    // ==================================================

    useEffect(() => {

        if (countdown <= 0) {
            return;
        }

        const timer =
            setInterval(() => {

                setCountdown(
                    (prev) =>
                        Math.max(
                            prev - 1,
                            0
                        )
                );

            }, 1000);

        return () =>
            clearInterval(timer);

    }, [countdown]);

    // ==================================================
    // OTP CHANGE
    // ==================================================

    const handleOtpChange = (e) => {

        const value =
            e.target.value
                .replace(/\D/g, "")
                .slice(0, 6);

        setOtp(value);

    };

    // ==================================================
    // VERIFY
    // ==================================================

    const handleVerify = async (e) => {

        e.preventDefault();

        if (!email) {

            toast.error(
                "Email is missing"
            );

            return;
        }

        if (otp.length !== 6) {

            toast.error(
                "Please enter a valid 6 digit OTP"
            );

            return;
        }

        try {

            setLoading(true);

            console.log(
                "VERIFY EMAIL REQUEST:",
                {
                    email,
                    otp,
                }
            );

            const res =
                await verifyEmail({
                    email,
                    otp,
                });

            console.log(
                "VERIFY EMAIL RESPONSE:",
                res
            );

            toast.success(
                res?.data?.message ||
                "Email verified successfully!"
            );

            // ==================================================
            // REMOVE VERIFICATION EMAIL
            // ==================================================

            localStorage.removeItem(
                "verificationEmail"
            );

            localStorage.removeItem(
                "verificationOtp"
            );

            // ==================================================
            // LOGIN PAGE
            // ==================================================

            setTimeout(() => {

                navigate("/login");

            }, 800);

        } catch (error) {

            console.error(
                "EMAIL VERIFICATION ERROR:",
                error
            );

            console.error(
                "EMAIL VERIFICATION RESPONSE:",
                error?.response?.data
            );

            toast.error(
                error?.response?.data?.message ||
                "Invalid or expired OTP"
            );

        } finally {

            setLoading(false);

        }

    };

    // ==================================================
    // RESEND OTP
    // ==================================================

    const handleResend = async () => {

        if (!email) {

            toast.error(
                "Email is missing"
            );

            return;
        }

        if (countdown > 0) {
            return;
        }

        try {

            setResendLoading(true);

            const res =
                await resendEmailVerificationOtp({
                    email,
                });

            toast.success(
                res?.data?.message ||
                "Verification OTP sent successfully"
            );

            setCountdown(60);

        } catch (error) {

            console.error(
                "RESEND OTP ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Unable to resend OTP"
            );

        } finally {

            setResendLoading(false);

        }

    };

    // ==================================================
    // UI
    // ==================================================

    return (

        <div className="verify-page">

            <div className="verify-card">

                {/* ICON */}

                <div className="verify-icon">
                    <FaShieldAlt />
                </div>

                {/* HEADER */}

                <h1>
                    Verify Your Email
                </h1>

                <p className="verify-description">

                    We have sent a 6-digit
                    verification code to
                    your email address.

                </p>

                {/* EMAIL */}

                <div className="email-box">

                    <FaEnvelope />

                    <span>
                        {email}
                    </span>

                </div>

                {/* FORM */}

                <form
                    onSubmit={
                        handleVerify
                    }
                    className="verify-form"
                >

                    <label>
                        Enter Verification Code
                    </label>

                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        value={otp}
                        onChange={
                            handleOtpChange
                        }
                        autoComplete="one-time-code"
                    />

                    <button
                        type="submit"
                        disabled={
                            loading ||
                            otp.length !== 6
                        }
                    >

                        {loading
                            ? "Verifying..."
                            : "Verify Email"
                        }

                        {!loading && (
                            <FaArrowRight />
                        )}

                    </button>

                </form>

                {/* RESEND */}

                <div className="resend-section">

                    <p>
                        Didn't receive the code?
                    </p>

                    <button
                        type="button"
                        onClick={
                            handleResend
                        }
                        disabled={
                            resendLoading ||
                            countdown > 0
                        }
                        className="resend-btn"
                    >

                        {resendLoading

                            ? "Sending..."

                            : countdown > 0

                                ? `Resend OTP in ${countdown}s`

                                : "Resend OTP"

                        }

                    </button>

                </div>

                {/* BACK */}

                <button
                    type="button"
                    className="back-login"
                    onClick={() =>
                        navigate("/login")
                    }
                >
                    Back to Login
                </button>

            </div>

        </div>

    );
}

export default VerifyEmail;