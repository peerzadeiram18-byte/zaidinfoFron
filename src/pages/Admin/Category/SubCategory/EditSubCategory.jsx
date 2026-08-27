import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getCategories,
  updateCategory,
} from "../../../../services/categoryService";

import "./AddSubCategory.css";

function EditSubCategory() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    parentCategory: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });


  // ======================================================
  // LOAD
  // ======================================================

  useEffect(() => {
    loadData();
  }, [id]);


  const loadData = async () => {

    try {

      setLoading(true);

      const response = await getCategories();

      const data =
        Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
            ? response.data.data
            : Array.isArray(response?.data?.categories)
              ? response.data.categories
              : [];


      setCategories(data);


      const subcategory = data.find(
        (item) => item?._id === id
      );


      if (!subcategory) {

        setMessage({
          type: "error",
          text: "Subcategory not found.",
        });

        return;
      }


      const parentId =
        typeof subcategory.parentCategory ===
        "object"
          ? subcategory.parentCategory?._id
          : subcategory.parentCategory;


      setForm({
        name: subcategory.name || "",
        parentCategory: parentId || "",
        description:
          subcategory.description || "",
      });


    } catch (error) {

      console.error(
        "EDIT SUBCATEGORY LOAD ERROR:",
        error
      );

      setMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          "Unable to load subcategory.",
      });

    } finally {

      setLoading(false);

    }

  };


  // ======================================================
  // CHANGE
  // ======================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // ======================================================
  // SAVE
  // ======================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.name.trim()) {

      setMessage({
        type: "error",
        text: "Subcategory name is required.",
      });

      return;
    }


    if (!form.parentCategory) {

      setMessage({
        type: "error",
        text: "Parent category is required.",
      });

      return;
    }


    try {

      setSaving(true);

      const formData = new FormData();

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "parentCategory",
        form.parentCategory
      );


      const response =
        await updateCategory(
          id,
          formData
        );


      console.log(
        "SUBCATEGORY UPDATED:",
        response?.data
      );


      alert(
        response?.data?.message ||
        "Subcategory updated successfully."
      );


      navigate("/subcategories");


    } catch (error) {

      console.error(
        "UPDATE SUBCATEGORY ERROR:",
        error
      );

      setMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          "Unable to update subcategory.",
      });

    } finally {

      setSaving(false);

    }

  };


  if (loading) {

    return (
      <div className="add-subcategory-page">
        <div className="add-subcategory-card">
          Loading subcategory...
        </div>
      </div>
    );

  }


  return (

    <div className="add-subcategory-page">

      <div className="add-subcategory-card">

        <div className="subcategory-header">

          <div>
            <h1>
              Edit Subcategory
            </h1>

            <p>
              Update subcategory information.
            </p>
          </div>


          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate("/subcategories")
            }
          >
            ← Back
          </button>

        </div>


        {message.text && (
          <div
            className={`subcategory-message ${message.type}`}
          >
            {message.text}
          </div>
        )}


        <form
          className="subcategory-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>
              Subcategory Name *
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>
              Parent Category *
            </label>

            <select
              name="parentCategory"
              value={form.parentCategory}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Parent Category
              </option>


              {categories
                .filter(
                  (category) =>
                    category?._id !== id &&
                    category?.isDeleted !== true &&
                    !category?.parentCategory
                )
                .map((category) => (

                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>

                ))}

            </select>

          </div>


          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              rows="5"
              value={form.description}
              onChange={handleChange}
            />

          </div>


          <div className="form-actions">

            <button
              type="button"
              className="btn-reset"
              onClick={() =>
                navigate("/subcategories")
              }
              disabled={saving}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="btn-create"
              disabled={saving}
            >
              {saving
                ? "Updating..."
                : "Update Subcategory"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );
}

export default EditSubCategory;