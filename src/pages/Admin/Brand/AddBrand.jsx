import { useEffect, useState } from "react";
import { createBrand } from "../../../services/brandService";
import { getCategories } from "../../../services/categoryService";
import "./AddBrand.css";

function AddBrand() {

  const [categories, setCategories] = useState([]);

  const [preview, setPreview] = useState("");

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

      setCategories(res.data.data);

    } catch (error) {

      console.log(error);

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

  const handleSubmit = async (e) => {

    e.preventDefault();

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

      alert(res.data.message);

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

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Unable To Create Brand"
      );

    }

  };

  return (

    <div className="add-brand-page">

      <div className="brand-box">

        <h2>Add Brand</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Brand Name"
            value={brand.name}
            onChange={handleChange}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
          />

          {preview && (

            <img
              src={preview}
              alt="Preview"
              className="brand-preview"
            />

          )}

          <textarea
            name="description"
            placeholder="Description"
            value={brand.description}
            onChange={handleChange}
          />

          <select
            name="category"
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

          <select
            name="status"
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

          <button type="submit">

            Create Brand

          </button>

        </form>

      </div>

    </div>

  );

}

export default AddBrand;