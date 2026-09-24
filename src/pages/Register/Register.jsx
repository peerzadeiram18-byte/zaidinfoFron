// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { registerUser } from "../../services/authService";

// import {
//   FaUser,
//   FaEnvelope,
//   FaPhone,
//   FaLock,
//   FaArrowRight,
// } from "react-icons/fa";

// import { BiDesktop } from "react-icons/bi";

// import { toast } from "react-toastify";

// import "./Register.css";

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

//   // =====================================================
//   // HANDLE INPUT CHANGE
//   // =====================================================

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // =====================================================
//   // SUBMIT
//   // =====================================================

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (loading) return;

//     // -----------------------------------------------
//     // BASIC VALIDATION
//     // -----------------------------------------------

//     if (!formData.firstName.trim()) {
//       toast.error("First name is required");
//       return;
//     }

//     if (!formData.lastName.trim()) {
//       toast.error("Last name is required");
//       return;
//     }

//     if (!formData.email.trim()) {
//       toast.error("Email is required");
//       return;
//     }

//     if (!formData.phone.trim()) {
//       toast.error("Phone number is required");
//       return;
//     }

//     if (!formData.password) {
//       toast.error("Password is required");
//       return;
//     }

//     if (formData.password.length < 6) {
//       toast.error("Password must be at least 6 characters");
//       return;
//     }

//     try {
//       setLoading(true);

//       // =================================================
//       // CUSTOMER REGISTRATION
//       // =================================================

//       const data = {
//         firstName: formData.firstName.trim(),
//         lastName: formData.lastName.trim(),
//         email: formData.email.trim().toLowerCase(),
//         phone: formData.phone.trim(),
//         password: formData.password,

//         // IMPORTANT
//         role: "CUSTOMER",
//       };

//       console.log("REGISTER CUSTOMER DATA:", {
//         ...data,
//         password: "***",
//       });

//       const res = await registerUser(data);

//       console.log("REGISTER RESPONSE:", res);

//       // =================================================
//       // SUCCESS
//       // =================================================

//       toast.success(
//         res?.data?.message ||
//           "Registration successful. Please verify your email."
//       );

//       // Save email also so VerifyEmail page can use it
//       localStorage.setItem(
//         "verificationEmail",
//         data.email
//       );

//       // Navigate to OTP page
//       navigate("/verify-email", {
//         state: {
//           email: data.email,
//         },
//       });

//     } catch (error) {
//       console.error(
//         "REGISTER ERROR:",
//         error
//       );

//       const message =
//         error?.response?.data?.message ||
//         error?.message ||
//         "Registration failed";

//       toast.error(message);

//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // JSX
//   // =====================================================

//   return (
//     <div className="register-container">

//       {/* =================================================
//           LEFT SIDE
//       ================================================= */}

//       <div className="register-left">

//         <div className="left-content-inner">

//           {/* BRAND */}
//           <div className="brand-header">

//             <div className="brand-logo">
//               <BiDesktop
//                 style={{
//                   color: "blue",
//                 }}
//               />
//             </div>

//             <span className="brand-name">
//               TechHub
//             </span>

//           </div>

//           {/* HEADER */}
//           <div className="form-header">

//             <h2>
//               Create Customer Account
//             </h2>

//             <p>
//               Fill in your details below to
//               set up your account.
//             </p>

//           </div>

//           {/* FORM */}
//           <form
//             onSubmit={handleSubmit}
//             className="register-form"
//           >

//             {/* FIRST + LAST NAME */}

//             <div className="input-row">

//               {/* FIRST NAME */}
//               <div className="input-group">

//                 <label className="input-label">
//                   First Name
//                 </label>

//                 <div className="input-field">

//                   <FaUser className="input-icon" />

//                   <input
//                     type="text"
//                     name="firstName"
//                     placeholder="First Name"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     autoComplete="given-name"
//                     disabled={loading}
//                     required
//                   />

//                 </div>

//               </div>

//               {/* LAST NAME */}
//               <div className="input-group">

//                 <label className="input-label">
//                   Last Name
//                 </label>

//                 <div className="input-field">

//                   <FaUser className="input-icon" />

//                   <input
//                     type="text"
//                     name="lastName"
//                     placeholder="Last Name"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     autoComplete="family-name"
//                     disabled={loading}
//                     required
//                   />

//                 </div>

//               </div>

//             </div>

//             {/* EMAIL */}

//             <div className="input-group">

//               <label className="input-label">
//                 Email Address
//               </label>

//               <div className="input-field">

//                 <FaEnvelope className="input-icon" />

//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email Address"
//                   value={formData.email}
//                   onChange={handleChange}
//                   autoComplete="email"
//                   disabled={loading}
//                   required
//                 />

//               </div>

//             </div>

//             {/* PHONE */}

//             <div className="input-group">

//               <label className="input-label">
//                 Mobile Number
//               </label>

//               <div className="input-field">

//                 <FaPhone className="input-icon" />

//                 <input
//                   type="tel"
//                   name="phone"
//                   placeholder="Mobile Number"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   autoComplete="tel"
//                   disabled={loading}
//                   required
//                 />

//               </div>

//             </div>

//             {/* PASSWORD */}

//             <div className="input-group">

//               <label className="input-label">
//                 Password
//               </label>

//               <div className="input-field">

//                 <FaLock className="input-icon" />

//                 <input
//                   type="password"
//                   name="password"
//                   placeholder="Password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   autoComplete="new-password"
//                   disabled={loading}
//                   minLength={6}
//                   required
//                 />

//               </div>

//             </div>

//             {/* SUBMIT */}

//             <button
//               type="submit"
//               className="submit-btn"
//               disabled={loading}
//             >

//               {loading
//                 ? "Please Wait..."
//                 : "Create Account"}

//               {!loading && (
//                 <FaArrowRight />
//               )}

//             </button>

//           </form>

//           {/* LOGIN */}

//           <p className="bottom-text">

//             Already have an account?{" "}

//             <span
//               onClick={() => {
//                 if (!loading) {
//                   navigate("/");
//                 }
//               }}
//               style={{
//                 cursor: loading
//                   ? "not-allowed"
//                   : "pointer",
//               }}
//             >
//               Login
//             </span>

//           </p>

//           {/* FOOTER */}

//           <footer className="form-footer">

//             © {new Date().getFullYear()}{" "}
//             TechHub Computer Store.
//             All rights reserved.

//           </footer>

//         </div>

//       </div>

//       {/* =================================================
//           RIGHT SIDE
//       ================================================= */}

//       <div className="register-right">

//         <div className="right-overlay"></div>

//         <div className="right-content">

//           <div className="badge">
//             PREMIUM HARDWARE & GEAR
//           </div>

//           <h1 className="hero-heading">
//             Elevate Your Setup
//           </h1>

//           <p className="hero-subtext">
//             Discover high-performance
//             workstations, gaming rigs, and
//             custom computer gear built for
//             ultimate performance.
//           </p>

//           <div className="features-list">

//             <div className="feature-item">

//               <span className="feature-dot" />

//               <span className="feature-text">
//                 Official Warranty & Guaranteed
//                 Support
//               </span>

//             </div>

//             <div className="feature-item">

//               <span className="feature-dot" />

//               <span className="feature-text">
//                 Ultra-Fast Priority Shipping
//               </span>

//             </div>

//           </div>

//         </div>

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
  FaArrowRight,
  FaBuilding,
  FaIdCard,
  FaBriefcase,
} from "react-icons/fa";

import { BiDesktop } from "react-icons/bi";

import { toast } from "react-toastify";

import "./Register.css";

// GSTIN format: 2 digits + 5 letters + 4 digits + 1 letter + 1 alphanumeric + Z + 1 alphanumeric
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // PERSONAL  = normal customer
  // BUSINESS  = corporate / bulk buyer
  const [customerType, setCustomerType] = useState("PERSONAL");

  const isBusiness = customerType === "BUSINESS";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",

    // Business only
    companyName: "",
    businessType: "",
    gstNumber: "",
    designation: "",
  });

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "gstNumber" ? value.toUpperCase() : value,
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    // -----------------------------------------------
    // BASIC VALIDATION
    // -----------------------------------------------

    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return;
    }

    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // -----------------------------------------------
    // BUSINESS VALIDATION
    // -----------------------------------------------

    if (isBusiness) {
      if (!formData.companyName.trim()) {
        toast.error("Company name is required");
        return;
      }

      if (!formData.businessType) {
        toast.error("Please select business type");
        return;
      }

      if (!GST_REGEX.test(formData.gstNumber.trim().toUpperCase())) {
        toast.error("Enter a valid 15-character GST number");
        return;
      }

      if (!formData.designation.trim()) {
        toast.error("Your designation is required");
        return;
      }
    }

    try {
      setLoading(true);

      // =================================================
      // CUSTOMER REGISTRATION (PERSONAL + BUSINESS)
      // =================================================

      const data = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,

        // IMPORTANT
        role: "CUSTOMER",
        customerType,

        // Only sent for business accounts
        ...(isBusiness && {
          designation: formData.designation.trim(),
          businessDetails: {
            companyName: formData.companyName.trim(),
            businessType: formData.businessType,
            gstNumber: formData.gstNumber.trim().toUpperCase(),
          },
        }),
      };

      console.log("REGISTER CUSTOMER DATA:", {
        ...data,
        password: "***",
      });

      const res = await registerUser(data);

      console.log("REGISTER RESPONSE:", res);

      // =================================================
      // SUCCESS
      // =================================================

      toast.success(
        res?.data?.message ||
          "Registration successful. Please verify your email."
      );

      // Save email also so VerifyEmail page can use it
      localStorage.setItem(
        "verificationEmail",
        data.email
      );

      // Navigate to OTP page
      navigate("/verify-email", {
        state: {
          email: data.email,
        },
      });

    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="register-container">

      {/* =================================================
          LEFT SIDE
      ================================================= */}

      <div className="register-left">

        <div className="left-content-inner">

          {/* BRAND */}
          <div className="brand-header">

            <div className="brand-logo">
              <BiDesktop
                style={{
                  color: "blue",
                }}
              />
            </div>

            <span className="brand-name">
              TechHub
            </span>

          </div>

          {/* HEADER */}
          <div className="form-header">

            <h2>
              {isBusiness
                ? "Create Business Account"
                : "Create Customer Account"}
            </h2>

            <p>
              {isBusiness
                ? "Register your company to buy laptops in bulk."
                : "Fill in your details below to set up your account."}
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="register-form"
          >

            {/* ACCOUNT TYPE TOGGLE */}

            <div className="account-toggle">

              <button
                type="button"
                className={
                  !isBusiness ? "active" : ""
                }
                onClick={() =>
                  setCustomerType("PERSONAL")
                }
                disabled={loading}
              >
                Individual
              </button>

              <button
                type="button"
                className={
                  isBusiness ? "active" : ""
                }
                onClick={() =>
                  setCustomerType("BUSINESS")
                }
                disabled={loading}
              >
                Business
              </button>

            </div>

            {/* FIRST + LAST NAME */}

            <div className="input-row">

              {/* FIRST NAME */}
              <div className="input-group">

                <label className="input-label">
                  First Name
                </label>

                <div className="input-field">

                  <FaUser className="input-icon" />

                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    disabled={loading}
                    required
                  />

                </div>

              </div>

              {/* LAST NAME */}
              <div className="input-group">

                <label className="input-label">
                  Last Name
                </label>

                <div className="input-field">

                  <FaUser className="input-icon" />

                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    disabled={loading}
                    required
                  />

                </div>

              </div>

            </div>

            {/* EMAIL */}

            <div className="input-group">

              <label className="input-label">
                {isBusiness
                  ? "Work Email"
                  : "Email Address"}
              </label>

              <div className="input-field">

                <FaEnvelope className="input-icon" />

                <input
                  type="email"
                  name="email"
                  placeholder={
                    isBusiness
                      ? "Work Email"
                      : "Email Address"
                  }
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                  required
                />

              </div>

            </div>

            {/* PHONE */}

            <div className="input-group">

              <label className="input-label">
                Mobile Number
              </label>

              <div className="input-field">

                <FaPhone className="input-icon" />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Mobile Number"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  disabled={loading}
                  required
                />

              </div>

            </div>

            {/* =============================================
                BUSINESS FIELDS (only for BUSINESS)
            ============================================= */}

            {isBusiness && (
              <>

                {/* COMPANY NAME */}

                <div className="input-group">

                  <label className="input-label">
                    Company Name
                  </label>

                  <div className="input-field">

                    <FaBuilding className="input-icon" />

                    <input
                      type="text"
                      name="companyName"
                      placeholder="Company Name"
                      value={formData.companyName}
                      onChange={handleChange}
                      autoComplete="organization"
                      disabled={loading}
                      required
                    />

                  </div>

                </div>

                {/* BUSINESS TYPE */}

                <div className="input-group">

                  <label className="input-label">
                    Business Type
                  </label>

                  <div className="input-field">

                    <FaBuilding className="input-icon" />

                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    >
                      <option value="">
                        Select Business Type
                      </option>
                      <option value="PROPRIETORSHIP">
                        Proprietorship
                      </option>
                      <option value="PARTNERSHIP">
                        Partnership
                      </option>
                      <option value="PRIVATE_LIMITED">
                        Private Limited
                      </option>
                      <option value="PUBLIC_LIMITED">
                        Public Limited
                      </option>
                      <option value="LLP">
                        LLP
                      </option>
                      <option value="OTHER">
                        Other
                      </option>
                    </select>

                  </div>

                </div>

                {/* GST NUMBER */}

                <div className="input-group">

                  <label className="input-label">
                    GST Number
                  </label>

                  <div className="input-field">

                    <FaIdCard className="input-icon" />

                    <input
                      type="text"
                      name="gstNumber"
                      placeholder="15-character GSTIN"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      maxLength={15}
                      disabled={loading}
                      required
                    />

                  </div>

                </div>

                {/* DESIGNATION */}

                <div className="input-group">

                  <label className="input-label">
                    Your Designation
                  </label>

                  <div className="input-field">

                    <FaBriefcase className="input-icon" />

                    <input
                      type="text"
                      name="designation"
                      placeholder="e.g. IT Manager"
                      value={formData.designation}
                      onChange={handleChange}
                      autoComplete="organization-title"
                      disabled={loading}
                      required
                    />

                  </div>

                </div>

              </>
            )}

            {/* PASSWORD */}

            <div className="input-group">

              <label className="input-label">
                Password
              </label>

              <div className="input-field">

                <FaLock className="input-icon" />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  disabled={loading}
                  minLength={6}
                  required
                />

              </div>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >

              {loading
                ? "Please Wait..."
                : "Create Account"}

              {!loading && (
                <FaArrowRight />
              )}

            </button>

          </form>

          {/* LOGIN */}

          <p className="bottom-text">

            Already have an account?{" "}

            <span
              onClick={() => {
                if (!loading) {
                  navigate("/");
                }
              }}
              style={{
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              Login
            </span>

          </p>

          {/* FOOTER */}

          <footer className="form-footer">

            © {new Date().getFullYear()}{" "}
            TechHub Computer Store.
            All rights reserved.

          </footer>

        </div>

      </div>

      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="register-right">

        <div className="right-overlay"></div>

        <div className="right-content">

          <div className="badge">
            PREMIUM HARDWARE & GEAR
          </div>

          <h1 className="hero-heading">
            Elevate Your Setup
          </h1>

          <p className="hero-subtext">
            Discover high-performance
            workstations, gaming rigs, and
            custom computer gear built for
            ultimate performance.
          </p>

          <div className="features-list">

            <div className="feature-item">

              <span className="feature-dot" />

              <span className="feature-text">
                Official Warranty & Guaranteed
                Support
              </span>

            </div>

            <div className="feature-item">

              <span className="feature-dot" />

              <span className="feature-text">
                Ultra-Fast Priority Shipping
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;
