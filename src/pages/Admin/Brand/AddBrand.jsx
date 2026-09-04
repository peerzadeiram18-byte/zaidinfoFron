// import { useEffect, useState } from "react";
// import { createBrand } from "../../../services/brandService";
// import { getCategories } from "../../../services/categoryService";
// import "./AddBrand.css";
// import { toast } from "react-toastify";

// function AddBrand() {
//   const [categories, setCategories] = useState([]);
//   const [preview, setPreview] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   const [brand, setBrand] = useState({
//     name: "",
//     logo: null,
//     description: "",
//     category: "",
//     status: "ACTIVE",
//   });

//   useEffect(() => {
//     loadCategories();
//   }, []);

//   const loadCategories = async () => {
//     try {
//       const res = await getCategories();
//       // Safely set categories regardless of response structure
//       setCategories(res?.data?.data || res?.data || []);
//     } catch (error) {
//       console.error("Failed to load categories:", error);
//     }
//   };

//   const handleChange = (e) => {
//     setBrand({
//       ...brand,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setBrand({
//       ...brand,
//       logo: file,
//     });

//     setPreview(URL.createObjectURL(file));
//   };

//   const handleRemoveLogo = () => {
//     setBrand({ ...brand, logo: null });
//     setPreview("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       const formData = new FormData();
//       formData.append("name", brand.name);
//       formData.append("description", brand.description);
//       formData.append("category", brand.category);
//       formData.append("status", brand.status);

//       if (brand.logo) {
//         formData.append("logo", brand.logo);
//       }

//       const res = await createBrand(formData);

//       setMessage({
//         type: "success",
//         text: res.data?.message || "Brand created successfully!",
//       });

//       // Reset form
//       setBrand({
//         name: "",
//         logo: null,
//         description: "",
//         category: "",
//         status: "ACTIVE",
//       });
//       setPreview("");
//       e.target.reset();
//     } catch (error) {
//       console.error("Error creating brand:", error);
//       setMessage({
//         type: "error",
//         text:
//           error.response?.data?.message ||
//           "Unable to create brand. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="add-brand-page">
//       <div className="brand-card">
//         <div className="card-header">
//           <h2>Add New Brand</h2>
//           <p>Register a brand and link it with an existing category.</p>
//         </div>

//         {message.text && (
//           <div className={`alert-box ${message.type}`}>
//             {message.text}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="brand-form">
//           <div className="form-grid">
//             {/* Brand Name */}
//             <div className="form-group">
//               <label htmlFor="name">Brand Name *</label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 placeholder="e.g. Samsung, Nike"
//                 value={brand.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Category */}
//             <div className="form-group">
//               <label htmlFor="category">Assigned Category *</label>
//               <select
//                 id="category"
//                 name="category"
//                 value={brand.category}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((category) => (
//                   <option key={category._id} value={category._id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Status */}
//             <div className="form-group">
//               <label htmlFor="status">Initial Status</label>
//               <select
//                 id="status"
//                 name="status"
//                 value={brand.status}
//                 onChange={handleChange}
//               >
//                 <option value="ACTIVE">ACTIVE</option>
//                 <option value="INACTIVE">INACTIVE</option>
//               </select>
//             </div>

//             {/* Logo File */}
//             <div className="form-group">
//               <label>Brand Logo</label>
//               <div className="file-upload-wrapper">
//                 <input
//                   type="file"
//                   id="brand-logo-input"
//                   accept="image/*"
//                   onChange={handleLogoChange}
//                   className="file-input"
//                 />
//                 <label htmlFor="brand-logo-input" className="file-upload-btn">
//                   Choose Logo File
//                 </label>
//                 <span className="file-name-display">
//                   {brand.logo ? brand.logo.name : "No file selected"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Logo Preview */}
//           {preview && (
//             <div className="preview-container">
//               <label className="preview-title">Logo Preview</label>
//               <div className="preview-wrapper">
//                 <img
//                   src={preview}
//                   alt="Brand Logo Preview"
//                   className="brand-preview"
//                 />
//                 <button
//                   type="button"
//                   className="remove-logo-btn"
//                   onClick={handleRemoveLogo}
//                 >
//                   Remove Logo
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Description */}
//           <div className="form-group">
//             <label htmlFor="description">Description</label>
//             <textarea
//               id="description"
//               name="description"
//               rows="3"
//               placeholder="Enter a brief description for this brand..."
//               value={brand.description}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Form Actions */}
//           <div className="form-actions">
//             <button
//               type="button"
//               className="btn-cancel"
//               onClick={() => {
//                 setBrand({
//                   name: "",
//                   logo: null,
//                   description: "",
//                   category: "",
//                   status: "ACTIVE",
//                 });
//                 setPreview("");
//                 setMessage({ type: "", text: "" });
//               }}
//             >
//               Reset
//             </button>
//             <button type="submit" className="btn-submit" disabled={loading}>
//               {loading ? "Creating..." : "Create Brand"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddBrand;

import { useEffect, useState } from "react";
import { createBrand } from "../../../services/brandService";
import { getCategories } from "../../../services/categoryService";
import "./AddBrand.css";
import { toast } from "react-toastify";

function AddBrand() {
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [brand, setBrand] = useState({
    name: "",
    logo: null,
    description: "",
    category: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();

      // Same API response handling
      setCategories(res?.data?.data || res?.data || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleChange = (e) => {
    setBrand({
      ...brand,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Optional image validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    // Revoke previous preview URL
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setBrand({
      ...brand,
      logo: file,
    });

    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveLogo = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setBrand({
      ...brand,
      logo: null,
    });

    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();

      // SAME API PAYLOAD
      formData.append("name", brand.name);
      formData.append("description", brand.description);
      formData.append("category", brand.category);
      formData.append("status", brand.status);

      if (brand.logo) {
        formData.append("logo", brand.logo);
      }

      // SAME API SERVICE
      const res = await createBrand(formData);

      setMessage({
        type: "success",
        text: res.data?.message || "Brand created successfully!",
      });

      toast.success(
        res.data?.message || "Brand created successfully!"
      );

      // Reset form
      setBrand({
        name: "",
        logo: null,
        description: "",
        category: "",
        status: "ACTIVE",
      });

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setPreview("");

      // Reset actual file input
      e.target.reset();
    } catch (error) {
      console.error("Error creating brand:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Unable to create brand. Please try again.";

      setMessage({
        type: "error",
        text: errorMessage,
      });

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setBrand({
      name: "",
      logo: null,
      description: "",
      category: "",
      status: "ACTIVE",
    });

    setPreview("");
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="abx-page">
      <div className="abx-card">

        {/* =========================
            HEADER
        ========================== */}
        <div className="abx-header">
          <div className="abx-header-content">
            <div className="abx-header-icon">
              <span>✦</span>
            </div>

            <div>
              <h2 className="abx-title">Add New Brand</h2>

              <p className="abx-subtitle">
                Register a brand and link it with an existing category.
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            MESSAGE
        ========================== */}
        {message.text && (
          <div
            className={`abx-alert ${
              message.type === "success"
                ? "abx-alert-success"
                : "abx-alert-error"
            }`}
          >
            <span className="abx-alert-icon">
              {message.type === "success" ? "✓" : "!"}
            </span>

            <span>{message.text}</span>
          </div>
        )}

        {/* =========================
            FORM
        ========================== */}
        <form onSubmit={handleSubmit} className="abx-form">

          <div className="abx-form-grid">

            {/* Brand Name */}
            <div className="abx-field">
              <label
                htmlFor="abx-brand-name"
                className="abx-label"
              >
                Brand Name
                <span className="abx-required">*</span>
              </label>

              <input
                type="text"
                id="abx-brand-name"
                name="name"
                className="abx-input"
                placeholder="e.g. Samsung, Nike"
                value={brand.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category */}
            <div className="abx-field">
              <label
                htmlFor="abx-brand-category"
                className="abx-label"
              >
                Assigned Category
                <span className="abx-required">*</span>
              </label>

              <select
                id="abx-brand-category"
                name="category"
                className="abx-select"
                value={brand.category}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="abx-field">
              <label
                htmlFor="abx-brand-status"
                className="abx-label"
              >
                Initial Status
              </label>

              <select
                id="abx-brand-status"
                name="status"
                className="abx-select"
                value={brand.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">
                  ACTIVE
                </option>

                <option value="INACTIVE">
                  INACTIVE
                </option>
              </select>
            </div>

            {/* Logo */}
            <div className="abx-field">
              <label className="abx-label">
                Brand Logo
              </label>

              <div className="abx-upload-box">

                <input
                  type="file"
                  id="abx-logo-input"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="abx-file-input"
                />

                <label
                  htmlFor="abx-logo-input"
                  className="abx-upload-button"
                >
                  <span className="abx-upload-icon">
                    ↑
                  </span>

                  <span>
                    Choose Logo File
                  </span>
                </label>

                <span className="abx-file-name">
                  {brand.logo
                    ? brand.logo.name
                    : "No file selected"}
                </span>
              </div>
            </div>
          </div>

          {/* =========================
              LOGO PREVIEW
          ========================== */}
          {preview && (
            <div className="abx-preview-section">
              <div className="abx-preview-heading">
                <span className="abx-preview-title">
                  Logo Preview
                </span>

                <span className="abx-preview-hint">
                  Selected image
                </span>
              </div>

              <div className="abx-preview-card">

                <div className="abx-image-container">
                  <img
                    src={preview}
                    alt="Brand Logo Preview"
                    className="abx-preview-image"
                  />
                </div>

                <div className="abx-preview-info">
                  <strong>
                    {brand.logo?.name || "Brand Logo"}
                  </strong>

                  <span>
                    Ready to upload
                  </span>
                </div>

                <button
                  type="button"
                  className="abx-remove-button"
                  onClick={handleRemoveLogo}
                >
                  Remove Logo
                </button>
              </div>
            </div>
          )}

          {/* =========================
              DESCRIPTION
          ========================== */}
          <div className="abx-field abx-description-field">
            <label
              htmlFor="abx-brand-description"
              className="abx-label"
            >
              Description
            </label>

            <textarea
              id="abx-brand-description"
              name="description"
              rows="4"
              className="abx-textarea"
              placeholder="Enter a brief description for this brand..."
              value={brand.description}
              onChange={handleChange}
            />
          </div>

          {/* =========================
              FORM ACTIONS
          ========================== */}
          <div className="abx-actions">

            <button
              type="button"
              className="abx-reset-button"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>

            <button
              type="submit"
              className="abx-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="abx-button-spinner" />
                  Creating...
                </>
              ) : (
                <>
                  <span>+</span>
                  Create Brand
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBrand;