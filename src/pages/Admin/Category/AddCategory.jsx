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

  // Text Input
  const handleChange = (e) => {

    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });

  };

  // Image
  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setCategory({
      ...category,
      image: file,
    });

    setPreview(URL.createObjectURL(file));

  };

  // Submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const formData = new FormData();

      formData.append("name", category.name);
      formData.append("description", category.description);

      if (category.image) {
        formData.append("image", category.image);
      }

      const res = await createCategory(formData);

      alert(res.data.message);

      setCategory({
        name: "",
        image: null,
        description: "",
      });

      setPreview("");

      e.target.reset();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Unable To Create Category"
      );

    }

  };

  return (

    <div className="add-category-page">

      <div className="category-box">

        <h2>Add Category</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={category.name}
            onChange={handleChange}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {preview && (

            <img
              src={preview}
              alt="Preview"
              className="category-preview"
            />

          )}

          <textarea
            name="description"
            placeholder="Description"
            value={category.description}
            onChange={handleChange}
          />

          <button type="submit">
            Create Category
          </button>

        </form>

      </div>

    </div>

  );

}

export default AddCategory;