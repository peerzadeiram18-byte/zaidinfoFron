// import { useEffect, useState } from "react";
// import { createBrand } from "../../../services/brandService";
// import { getCategories } from "../../../services/categoryService";
// import "./AddBrand.css";
// import { toast } from "react-toastify";

// function AddBrand() {

//   const [categories, setCategories] = useState([]);

//   const [preview, setPreview] = useState("");

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

//       setCategories(res.data.data);

//     } catch (error) {

//       console.log(error);

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

//   const handleSubmit = async (e) => {

//     e.preventDefault();

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

//       toast.error(res.data.message);

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

//       console.log(error);

//       toast.error(
//         error.response?.data?.message ||
//         "Unable To Create Brand"
//       );

//     }

//   };

//   return (

//     <div className="add-brand-page">

//       <div className="brand-box">

//         <h2>Add Brand</h2>

//         <form onSubmit={handleSubmit}>

//           <input
//             type="text"
//             name="name"
//             placeholder="Brand Name"
//             value={brand.name}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleLogoChange}
//           />

//           {preview && (

//             <img
//               src={preview}
//               alt="Preview"
//               className="brand-preview"
//             />

//           )}

//           <textarea
//             name="description"
//             placeholder="Description"
//             value={brand.description}
//             onChange={handleChange}
//           />

//           <select
//             name="category"
//             value={brand.category}
//             onChange={handleChange}
//             required
//           >

//             <option value="">
//               Select Category
//             </option>

//             {categories.map((category) => (

//               <option
//                 key={category._id}
//                 value={category._id}
//               >

//                 {category.name}

//               </option>

//             ))}

//           </select>

//           <select
//             name="status"
//             value={brand.status}
//             onChange={handleChange}
//           >

//             <option value="ACTIVE">
//               ACTIVE
//             </option>

//             <option value="INACTIVE">
//               INACTIVE
//             </option>

//           </select>

//           <button type="submit">

//             Create Brand

//           </button>

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
      // Safely set categories regardless of response structure
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

    setBrand({
      ...brand,
      logo: file,
    });

    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveLogo = () => {
    setBrand({ ...brand, logo: null });
    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("name", brand.name);
      formData.append("description", brand.description);
      formData.append("category", brand.category);
      formData.append("status", brand.status);

      if (brand.logo) {
        formData.append("logo", brand.logo);
      }

      const res = await createBrand(formData);

      setMessage({
        type: "success",
        text: res.data?.message || "Brand created successfully!",
      });

      // Reset form
      setBrand({
        name: "",
        logo: null,
        description: "",
        category: "",
        status: "ACTIVE",
      });
      setPreview("");
      e.target.reset();
    } catch (error) {
      console.error("Error creating brand:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to create brand. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-brand-page">
      <div className="brand-card">
        <div className="card-header">
          <h2>Add New Brand</h2>
          <p>Register a brand and link it with an existing category.</p>
        </div>

        {message.text && (
          <div className={`alert-box ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="brand-form">
          <div className="form-grid">
            {/* Brand Name */}
            <div className="form-group">
              <label htmlFor="name">Brand Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g. Samsung, Nike"
                value={brand.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">Assigned Category *</label>
              <select
                id="category"
                name="category"
                value={brand.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="form-group">
              <label htmlFor="status">Initial Status</label>
              <select
                id="status"
                name="status"
                value={brand.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            {/* Logo File */}
            <div className="form-group">
              <label>Brand Logo</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="brand-logo-input"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="file-input"
                />
                <label htmlFor="brand-logo-input" className="file-upload-btn">
                  Choose Logo File
                </label>
                <span className="file-name-display">
                  {brand.logo ? brand.logo.name : "No file selected"}
                </span>
              </div>
            </div>
          </div>

          {/* Logo Preview */}
          {preview && (
            <div className="preview-container">
              <label className="preview-title">Logo Preview</label>
              <div className="preview-wrapper">
                <img
                  src={preview}
                  alt="Brand Logo Preview"
                  className="brand-preview"
                />
                <button
                  type="button"
                  className="remove-logo-btn"
                  onClick={handleRemoveLogo}
                >
                  Remove Logo
                </button>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              placeholder="Enter a brief description for this brand..."
              value={brand.description}
              onChange={handleChange}
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                setBrand({
                  name: "",
                  logo: null,
                  description: "",
                  category: "",
                  status: "ACTIVE",
                });
                setPreview("");
                setMessage({ type: "", text: "" });
              }}
            >
              Reset
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Creating..." : "Create Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBrand;