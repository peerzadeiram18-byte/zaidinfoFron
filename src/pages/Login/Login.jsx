// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../../services/authService";
// import {
//   FaEnvelope,
//   FaLock,
//   FaTimes,
//   FaEye,
//   FaEyeSlash,
//   FaUserShield,
//   FaArrowRight,
// } from "react-icons/fa";
// import { toast } from "react-toastify";
// import "./Login.css";

// function Login({ isOpen = true, onClose }) {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword((prev) => !prev);
//   };

//   // const handleLogin = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     setLoading(true);
//   //     const res = await loginUser(formData);
//   //     const { token, user } = res.data;

//   //     localStorage.setItem("token", token);
//   //     localStorage.setItem("user", JSON.stringify(user));

//   //     toast.success("Login Successful");

//   //     if (onClose) onClose();

//   //     const roleRoutes = {
//   //       ADMIN: "/admin-dashboard",
//   //       CUSTOMER: "/customer-dashboard",
//   //       RECEPTIONIST: "/receptionist-dashboard",
//   //       TECHNICIAN: "/technician-dashboard",
//   //       INVENTORY: "/inventory-dashboard",
//   //       ACCOUNTANT: "/accountant-dashboard",
//   //     };

//   //     if (roleRoutes[user.role]) {
//   //       navigate(roleRoutes[user.role]);
//   //     } else {
//   //       toast.error("Invalid User Role");
//   //       localStorage.removeItem("token");
//   //       localStorage.removeItem("user");
//   //       navigate("/login");
//   //     }
//   //   } catch (error) {
//   //     toast.error(error.response?.data?.message || "Login Failed");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


// const handleLogin = async (e) => {
//   e.preventDefault();

//   try {
//     setLoading(true);

//     const res = await loginUser(formData);

//     const { token, user } = res.data;

//     // ==============================
//     // SAVE LOGIN DATA
//     // ==============================

//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));

//     toast.success(res.data?.message || "Login Successful");

//     if (onClose) {
//       onClose();
//     }

//     // ==============================
//     // ROLE BASED REDIRECT
//     // ==============================

//     const roleRoutes = {
//       SUPER_ADMIN: "/admin-dashboard",
//       ADMIN: "/admin-dashboard",
//       CUSTOMER: "/customer-dashboard",
//       SALES: "/sales-dashboard",
//       TECHNICIAN: "/technician-dashboard",
//       INVENTORY: "/inventory-dashboard",
//       ACCOUNTANT: "/accountant-dashboard",
//       RECEPTIONIST: "/receptionist-dashboard",
//     };

//     const route = roleRoutes[user.role];

//     if (route) {
//       navigate(route);
//     } else {
//       toast.error("Invalid User Role");

//       localStorage.removeItem("token");
//       localStorage.removeItem("user");

//       navigate("/login");
//     }

//   } catch (error) {

//     console.log("LOGIN ERROR:", error);

//     // ==================================
//     // BACKEND ERROR MESSAGE
//     // ==================================

//     const message =
//       error?.response?.data?.message ||
//       "Login Failed";

//     // ==================================
//     // EMAIL NOT VERIFIED
//     // ==================================

//     if (
//       message.toLowerCase().includes("verify your email") ||
//       message.toLowerCase().includes("email")
//     ) {
//       toast.warning(message);

//       // Optional:
//       // verification page par bhejna
//       navigate("/verify-email", {
//         state: {
//           email: formData.email,
//         },
//       });

//       return;
//     }

//     // ==================================
//     // OTHER LOGIN ERRORS
//     // ==================================

//     toast.error(message);

//   } finally {

//     setLoading(false);

//   }
// };


//   return (
//     <div className="login-modal-overlay" onClick={onClose}>
//       <div
//         className="login-modal-container"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="modal-top-bar"></div>

//         {onClose && (
//           <button
//             className="modal-close-btn"
//             onClick={onClose}
//             aria-label="Close modal"
//           >
//             <FaTimes />
//           </button>
//         )}

//         <div className="login-header">
//           <div className="header-icon-badge">
//             <FaUserShield />
//           </div>
//           <h2>
//             ZAID <span>INFOTECH</span>
//           </h2>
//           <p>Welcome back! Login to access your portal.</p>
//         </div>

//         <form onSubmit={handleLogin} className="login-form">
//           {/* Email Field */}
//           <div className="input-group">
//             <label htmlFor="email">Email Address</label>
//             <div className="input-field-wrapper">
//               <span className="field-icon">
//                 <FaEnvelope />
//               </span>
//               <input
//                 id="email"
//                 type="email"
//                 name="email"
//                 placeholder="name@company.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           {/* Password Field */}
//           <div className="input-group">
//             <label htmlFor="password">Password</label>
//             <div className="input-field-wrapper">
//               <span className="field-icon">
//                 <FaLock />
//               </span>
//               <input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="••••••••"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//               <button
//                 type="button"
//                 className="password-toggle-btn"
//                 onClick={togglePasswordVisibility}
//                 aria-label="Toggle password visibility"
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="login-submit-btn"
//             disabled={loading}
//           >
//             {loading ? (
//               <span className="spinner-container">
//                 <span className="spinner"></span> Processing...
//               </span>
//             ) : (
//               <>
//                 <span>Login to Portal</span>
//                 <FaArrowRight className="btn-arrow" />
//               </>
//             )}
//           </button>
//         </form>

//         <div className="bottom-text">
//           Don't have an account?{" "}
//           <span
//             className="register-link"
//             onClick={() => {
//               if (onClose) onClose();
//               navigate("/register");
//             }}
//           >
//             Register here
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

import {
  FaEnvelope,
  FaLock,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaUserShield,
  FaArrowRight,
} from "react-icons/fa";

import { toast } from "react-toastify";

import "./Login.css";

function Login({ isOpen = true, onClose }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  if (!isOpen) {
    return null;
  }

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // PASSWORD VISIBILITY
  // ==========================================

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      console.log("LOGIN REQUEST:", {
        email: formData.email,
      });

      const res = await loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      const token = res.data?.token;
      const user = res.data?.user;

      // ==========================================
      // CHECK RESPONSE
      // ==========================================

      if (!token || !user) {
        toast.error(
          res.data?.message ||
            "Login response is invalid"
        );

        return;
      }

      // ==========================================
      // SAVE AUTH DATA
      // ==========================================

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // ==========================================
      // ROLE
      // ==========================================

      const role = user.role;

      console.log("LOGIN USER:", user);
      console.log("LOGIN ROLE:", role);

      // ==========================================
      // ROLE ROUTES
      // ==========================================

      const roleRoutes = {
        SUPER_ADMIN: "/admin-dashboard",

        ADMIN: "/admin-dashboard",

        SALES: "/receptionist-dashboard",

        CUSTOMER: "/customer-dashboard",

        TECHNICIAN: "/technician-dashboard",

        INVENTORY: "/inventory-dashboard",

        ACCOUNTANT: "/accountant-dashboard",
      };

      const targetRoute = roleRoutes[role];

      // ==========================================
      // INVALID ROLE
      // ==========================================

      if (!targetRoute) {
        console.error(
          "INVALID USER ROLE:",
          role
        );

        toast.error(
          `Invalid user role: ${role || "Unknown"}`
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return;
      }

      // ==========================================
      // SUCCESS
      // ==========================================

      toast.success(
        res.data?.message ||
          "Login Successful"
      );

      if (onClose) {
        onClose();
      }

      // ==========================================
      // NAVIGATE
      // ==========================================

      navigate(targetRoute);

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      console.error(
        "LOGIN ERROR RESPONSE:",
        error.response?.data
      );

      const message =
        error.response?.data?.message ||
        "Login Failed";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      className="login-modal-overlay"
      onClick={onClose}
    >

      <div
        className="login-modal-container"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="modal-top-bar"></div>

        {onClose && (
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        )}

        {/* HEADER */}

        <div className="login-header">

          <div className="header-icon-badge">
            <FaUserShield />
          </div>

          <h2>
            ZAID <span>INFOTECH</span>
          </h2>

          <p>
            Welcome back! Login to access your portal.
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleLogin}
          className="login-form"
        >

          {/* EMAIL */}

          <div className="input-group">

            <label htmlFor="email">
              Email Address
            </label>

            <div className="input-field-wrapper">

              <span className="field-icon">
                <FaEnvelope />
              </span>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="input-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="input-field-wrapper">

              <span className="field-icon">
                <FaLock />
              </span>

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle-btn"
                onClick={
                  togglePasswordVisibility
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}

              </button>

            </div>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >

            {loading ? (

              <span className="spinner-container">

                <span className="spinner"></span>

                Processing...

              </span>

            ) : (

              <>
                <span>
                  Login to Portal
                </span>

                <FaArrowRight
                  className="btn-arrow"
                />
              </>

            )}

          </button>

        </form>

        {/* REGISTER */}

        <div className="bottom-text">

          Don't have an account?{" "}

          <span
            className="register-link"
            onClick={() => {

              if (onClose) {
                onClose();
              }

              navigate("/register");

            }}
          >
            Register here
          </span>

        </div>

      </div>

    </div>
  );
}

export default Login;