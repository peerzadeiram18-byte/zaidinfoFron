// import { useState } from "react";
// import { createCategory } from "../../../services/categoryService";
// import "./AddCategory.css";
// import { toast } from "react-toastify";

// function AddCategory() {

//   const [category, setCategory] = useState({
//     name: "",
//     image: null,
//     description: "",
//   });

//   const [preview, setPreview] = useState("");

//   // Text Input
//   const handleChange = (e) => {

//     setCategory({
//       ...category,
//       [e.target.name]: e.target.value,
//     });

//   };

//   // Image
//   const handleImageChange = (e) => {

//     const file = e.target.files[0];

//     if (!file) return;

//     setCategory({
//       ...category,
//       image: file,
//     });

//     setPreview(URL.createObjectURL(file));

//   };

//   // Submit
//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     try {

//       const formData = new FormData();

//       formData.append("name", category.name);
//       formData.append("description", category.description);

//       if (category.image) {
//         formData.append("image", category.image);
//       }

//       const res = await createCategory(formData);

//       toast.error(res.data.message);

//       setCategory({
//         name: "",
//         image: null,
//         description: "",
//       });

//       setPreview("");

//       e.target.reset();

//     } catch (error) {

//       console.log(error);

//       toast.error(
//         error.response?.data?.message ||
//         "Unable To Create Category"
//       );

//     }

//   };

//   return (

//     <div className="add-category-page">

//       <div className="category-box">

//         <h2>Add Category</h2>

//         <form onSubmit={handleSubmit}>

//           <input
//             type="text"
//             name="name"
//             placeholder="Category Name"
//             value={category.name}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//           />

//           {preview && (

//             <img
//               src={preview}
//               alt="Preview"
//               className="category-preview"
//             />

//           )}

//           <textarea
//             name="description"
//             placeholder="Description"
//             value={category.description}
//             onChange={handleChange}
//           />

//           <button type="submit">
//             Create Category
//           </button>

//         </form>

//       </div>

//     </div>

//   );

// }

// export default AddCategory;

import { useState } from "react";
import { createCategory } from "../../../services/categoryService";
import "./AddCategory.css";

function AddCategory() {
  const [category, setCategory] = useState({
    name: "",
    image: null,
    description: "",
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle Text Inputs
  const handleChange = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Image Selection and Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCategory({
      ...category,
      image: file,
    });

    setPreview(URL.createObjectURL(file));
  };

  // Remove Image Selection
  const handleRemoveImage = () => {
    setCategory({ ...category, image: null });
    setPreview("");
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("name", category.name);
      formData.append("description", category.description);

      if (category.image) {
        formData.append("image", category.image);
      }

      const res = await createCategory(formData);

      setMessage({
        type: "success",
        text: res.data?.message || "Category created successfully!",
      });

      // Reset form state
      setCategory({
        name: "",
        image: null,
        description: "",
      });
      setPreview("");
      e.target.reset();
    } catch (error) {
      console.error("Error creating category:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to create category. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-category-page">
      <div className="category-card">
        <div className="card-header">
          <h2>Add New Category</h2>
          <p>Create a product category to organize your inventory.</p>
        </div>

        {message.text && (
          <div className={`alert-box ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label htmlFor="name">Category Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Laptops & Computers"
              value={category.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category Image</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="category-image-input"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <label htmlFor="category-image-input" className="file-upload-btn">
                Choose Image File
              </label>
              <span className="file-name-display">
                {category.image ? category.image.name : "No file selected"}
              </span>
            </div>

            {preview && (
              <div className="preview-wrapper">
                <img
                  src={preview}
                  alt="Category Preview"
                  className="category-preview"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={handleRemoveImage}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              placeholder="Enter a brief description for this category..."
              value={category.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                setCategory({ name: "", image: null, description: "" });
                setPreview("");
                setMessage({ type: "", text: "" });
              }}
            >
              Reset
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Saving Category..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCategory;