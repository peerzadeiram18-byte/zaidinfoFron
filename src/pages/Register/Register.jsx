// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { registerUser } from "../../services/authService";
// import "./Register.css";
// import { toast } from "react-toastify";

// function Register() {
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const data = {
//         ...formData,
//         role: "CUSTOMER",
//       };

//       const res = await registerUser(data);

//       toast.error(res.data.message);

//       navigate("/login");
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Registration Failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="register-page">
//       <div className="register-box">

//         <h2>Create Customer Account</h2>

//         <form onSubmit={handleSubmit}>

//           <input
//             type="text"
//             name="firstName"
//             placeholder="First Name"
//             value={formData.firstName}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="text"
//             name="lastName"
//             placeholder="Last Name"
//             value={formData.lastName}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="text"
//             name="phone"
//             placeholder="Mobile Number"
//             value={formData.phone}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />

//           <button type="submit">
//             {loading ? "Please Wait..." : "Create Account"}
//           </button>

//         </form>

//         <p className="bottom-text">
//           Already have an account?

//           <span onClick={() => navigate("/login")}>
//             Login
//           </span>

//         </p>

//       </div>
//     </div>
//   );
// }

// export default Register;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaLock, 
  FaDesktop, 
  FaArrowRight 
} from "react-icons/fa";
import "./Register.css";
import { BiDesktop } from "react-icons/bi";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = {
        ...formData,
        role: "CUSTOMER",
      };

      const res = await registerUser(data);
      alert(res.data?.message || "Registered Successfully");
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message || "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Left Column - Form */}
      <div className="register-left">
        <div className="left-content-inner">
          <div className="brand-header">
            <div className="brand-logo">
              <BiDesktop style={{color:"blue"}} />
            </div>
            <span className="brand-name">TechHub</span>
          </div>

          <div className="form-header">
            <h2>Create Customer Account</h2>
            <p>Fill in your details below to set up your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">First Name</label>
                <div className="input-field">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Last Name</label>
                <div className="input-field">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div className="input-field">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Mobile Number</label>
              <div className="input-field">
                <FaPhone className="input-icon" />
                <input
                  type="text"
                  name="phone"
                  placeholder="Mobile Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-field">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Please Wait..." : "Create Account"}
              <FaArrowRight />
            </button>
          </form>

          <p className="bottom-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>Login</span>
          </p>

          <footer className="form-footer">
            © {new Date().getFullYear()} TechHub Computer Store. All rights reserved.
          </footer>
        </div>
      </div>

      {/* Right Column - Hero Banner */}
      <div className="register-right">
        <div className="right-overlay"></div>
        <div className="right-content">
          <div className="badge">PREMIUM HARDWARE & GEAR</div>
          <h1 className="hero-heading">Elevate Your Setup</h1>
          <p className="hero-subtext">
            Discover high-performance workstations, gaming rigs, and custom computer gear built for ultimate performance.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-dot" />
              <span className="feature-text">Official Warranty & Guaranteed Support</span>
            </div>
            <div className="feature-item">
              <span className="feature-dot" />
              <span className="feature-text">Ultra-Fast Priority Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;