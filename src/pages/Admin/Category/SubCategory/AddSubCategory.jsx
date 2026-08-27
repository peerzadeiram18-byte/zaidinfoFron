import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCategory,
  getCategories,
} from "../../../../services/categoryService";

import "./AddSubCategory.css";

function AddSubCategory() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [subcategory, setSubcategory] = useState({
    name: "",
    parentCategory: "",
    description: "",
  });

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });


  // ======================================================
  // LOAD PARENT CATEGORIES
  // ======================================================

  useEffect(() => {
    loadCategories();
  }, []);


  const loadCategories = async () => {
    try {
      setLoadingCategories(true);

      const response = await getCategories();

      console.log(
        "PARENT CATEGORIES RESPONSE:",
        response?.data
      );

      const data =
        Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
            ? response.data.data
            : Array.isArray(response?.data?.categories)
              ? response.data.categories
              : [];

      // Only ACTIVE + non-deleted categories
      const parentCategories = data.filter(
        (category) =>
          category?.isDeleted !== true &&
          (
            category?.status === "ACTIVE" ||
            category?.status === "Active" ||
            !category?.status
          )
      );

      setCategories(parentCategories);

    } catch (error) {
      console.error(
        "PARENT CATEGORY ERROR:",
        error
      );

      setMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          "Unable to load parent categories.",
      });

    } finally {
      setLoadingCategories(false);
    }
  };


  // ======================================================
  // INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSubcategory((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });


    if (!subcategory.name.trim()) {
      setMessage({
        type: "error",
        text: "Please enter subcategory name.",
      });

      return;
    }


    if (!subcategory.parentCategory) {
      setMessage({
        type: "error",
        text: "Please select a parent category.",
      });

      return;
    }


    try {
      setLoading(true);

      /*
        IMPORTANT:

        Same Category API use ho raha hai.

        Parent category ke ObjectId ko
        parentCategory me bhej rahe hain.

        Backend automatically isko
        subcategory ke roop me save karega.
      */

      const formData = new FormData();

      formData.append(
        "name",
        subcategory.name.trim()
      );

      formData.append(
        "description",
        subcategory.description.trim()
      );

      formData.append(
        "parentCategory",
        subcategory.parentCategory
      );


      const response = await createCategory(formData);

      console.log(
        "SUBCATEGORY CREATED:",
        response?.data
      );


      setMessage({
        type: "success",
        text:
          response?.data?.message ||
          "Subcategory created successfully!",
      });


      // Reset
      setSubcategory({
        name: "",
        parentCategory: "",
        description: "",
      });

    } catch (error) {
      console.error(
        "CREATE SUBCATEGORY ERROR:",
        error
      );

      setMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          "Unable to create subcategory.",
      });

    } finally {
      setLoading(false);
    }
  };


  // ======================================================
  // RESET
  // ======================================================

  const handleReset = () => {
    setSubcategory({
      name: "",
      parentCategory: "",
      description: "",
    });

    setMessage({
      type: "",
      text: "",
    });
  };


  return (
    <div className="add-subcategory-page">

      <div className="add-subcategory-card">

        {/* HEADER */}

        <div className="subcategory-header">

          <div>
            <h1>
              Add Subcategory
            </h1>

            <p>
              Create a subcategory under an existing
              parent category.
            </p>
          </div>

          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate("/subcategories")
            }
          >
            ← Subcategories
          </button>

        </div>


        {/* MESSAGE */}

        {message.text && (
          <div
            className={`subcategory-message ${message.type}`}
          >
            {message.text}
          </div>
        )}


        {/* FORM */}

        <form
          className="subcategory-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div className="form-group">

            <label htmlFor="subcategory-name">
              Subcategory Name *
            </label>

            <input
              id="subcategory-name"
              type="text"
              name="name"
              value={subcategory.name}
              onChange={handleChange}
              placeholder="e.g. Gaming Laptops"
              required
            />

          </div>


          {/* PARENT */}

          <div className="form-group">

            <label htmlFor="parentCategory">
              Parent Category *
            </label>

            <select
              id="parentCategory"
              name="parentCategory"
              value={subcategory.parentCategory}
              onChange={handleChange}
              required
              disabled={loadingCategories}
            >

              <option value="">
                {loadingCategories
                  ? "Loading categories..."
                  : "Select Parent Category"}
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

            {!loadingCategories &&
              categories.length === 0 && (
                <small className="form-help error-text">
                  No parent categories available.
                  Please create a category first.
                </small>
              )}

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              value={subcategory.description}
              onChange={handleChange}
              placeholder="Enter subcategory description..."
            />

          </div>


          {/* ACTIONS */}

          <div className="form-actions">

            <button
              type="button"
              className="btn-reset"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>


            <button
              type="submit"
              className="btn-create"
              disabled={
                loading ||
                loadingCategories ||
                categories.length === 0
              }
            >
              {loading
                ? "Creating..."
                : "Create Subcategory"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddSubCategory;