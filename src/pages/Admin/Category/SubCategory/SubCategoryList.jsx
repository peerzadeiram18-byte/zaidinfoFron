import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCategories,
  deleteCategory,
} from "../../../../services/categoryService";

import "./SubCategoryList.css";

function SubCategoryList() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");


  // ======================================================
  // LOAD
  // ======================================================

  useEffect(() => {
    loadCategories();
  }, []);


  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategories();

      console.log(
        "SUBCATEGORY LIST RESPONSE:",
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

      setCategories(data);

    } catch (err) {
      console.error(
        "SUBCATEGORY LIST ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Unable to load categories."
      );

      setCategories([]);

    } finally {
      setLoading(false);
    }
  };


  // ======================================================
  // ONLY SUBCATEGORIES
  // ======================================================

  const subcategories = useMemo(() => {
    return categories.filter(
      (category) =>
        category?.isDeleted !== true &&
        category?.parentCategory
    );
  }, [categories]);


  // ======================================================
  // SEARCH
  // ======================================================

  const filteredSubcategories = useMemo(() => {
    const query = searchTerm
      .toLowerCase()
      .trim();

    if (!query) {
      return subcategories;
    }

    return subcategories.filter(
      (subcategory) => {

        const name = String(
          subcategory?.name || ""
        ).toLowerCase();

        const description = String(
          subcategory?.description || ""
        ).toLowerCase();

        const parentName =
          typeof subcategory?.parentCategory ===
          "object"
            ? String(
                subcategory?.parentCategory?.name ||
                ""
              ).toLowerCase()
            : "";

        return (
          name.includes(query) ||
          description.includes(query) ||
          parentName.includes(query)
        );
      }
    );

  }, [subcategories, searchTerm]);


  // ======================================================
  // PARENT NAME
  // ======================================================

  const getParentName = (parentCategory) => {

    if (!parentCategory) {
      return "No Parent";
    }

    if (typeof parentCategory === "object") {
      return (
        parentCategory?.name ||
        "Unknown Parent"
      );
    }

    const parent = categories.find(
      (category) =>
        category?._id === parentCategory
    );

    return (
      parent?.name ||
      "Unknown Parent"
    );
  };


  // ======================================================
  // DELETE
  // ======================================================

  const handleDelete = async (id, name) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {

      setDeletingId(id);

      await deleteCategory(id);

      // Remove immediately from UI
      setCategories((previous) =>
        previous.filter(
          (category) =>
            category?._id !== id
        )
      );

      alert(
        "Subcategory deleted successfully."
      );

    } catch (err) {

      console.error(
        "DELETE SUBCATEGORY ERROR:",
        err
      );

      alert(
        err?.response?.data?.message ||
        "Unable to delete subcategory."
      );

    } finally {
      setDeletingId(null);
    }
  };


  return (
    <div className="subcategory-list-page">

      <div className="subcategory-list-card">

        {/* HEADER */}

        <div className="subcategory-list-header">

          <div>
            <h1>
              Subcategory Directory
            </h1>

            <p>
              Manage your product subcategories
              and their parent categories.
            </p>
          </div>


          <button
            type="button"
            className="add-subcategory-btn"
            onClick={() =>
              navigate("/add-subcategory")
            }
          >
            + Add Subcategory
          </button>

        </div>


        {/* ERROR */}

        {error && (
          <div className="subcategory-error">
            {error}
          </div>
        )}


        {/* TOOLBAR */}

        <div className="subcategory-toolbar">

          <input
            type="text"
            placeholder="Search subcategory or parent category..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />


          <button
            type="button"
            onClick={loadCategories}
            disabled={loading}
            className="refresh-subcategory-btn"
          >
            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>


        {/* COUNT */}

        <div className="subcategory-count">
          Showing{" "}
          <strong>
            {filteredSubcategories.length}
          </strong>{" "}
          subcategories
        </div>


        {/* TABLE */}

        <div className="subcategory-table-wrapper">

          {loading ? (

            <div className="subcategory-loading">
              Loading subcategories...
            </div>

          ) : filteredSubcategories.length === 0 ? (

            <div className="subcategory-empty">

              <div className="empty-icon">
                📂
              </div>

              <h3>
                No Subcategories Found
              </h3>

              <p>
                Create your first subcategory
                under an existing category.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/add-subcategory")
                }
              >
                + Add Subcategory
              </button>

            </div>

          ) : (

            <table className="subcategory-table">

              <thead>

                <tr>

                  <th>
                    #
                  </th>

                  <th>
                    Subcategory
                  </th>

                  <th>
                    Parent Category
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredSubcategories.map(
                  (subcategory, index) => (

                    <tr
                      key={
                        subcategory?._id ||
                        index
                      }
                    >

                      {/* NUMBER */}

                      <td>
                        {index + 1}
                      </td>


                      {/* SUBCATEGORY */}

                      <td>

                        <div className="subcategory-name-cell">

                          <strong>
                            {subcategory?.name ||
                              "Unnamed"}
                          </strong>

                          <small>
                            ID:{" "}
                            {subcategory?._id ||
                              "-"}
                          </small>

                        </div>

                      </td>


                      {/* PARENT */}

                      <td>

                        <span className="parent-category-badge">

                          📁

                          <span>
                            {getParentName(
                              subcategory?.parentCategory
                            )}
                          </span>

                        </span>

                      </td>


                      {/* DESCRIPTION */}

                      <td className="description-cell">

                        {subcategory?.description ||
                          "No description"}

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`status-badge ${
                            subcategory?.status ===
                              "ACTIVE" ||
                            subcategory?.status ===
                              "Active"
                              ? "active"
                              : "inactive"
                          }`}
                        >

                          {subcategory?.status ||
                            "ACTIVE"}

                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="action-buttons">

                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() =>
                              navigate(
                                `/edit-subcategory/${subcategory._id}`
                              )
                            }
                          >
                            Edit
                          </button>


                          <button
                            type="button"
                            className="delete-btn"
                            disabled={
                              deletingId ===
                              subcategory._id
                            }
                            onClick={() =>
                              handleDelete(
                                subcategory._id,
                                subcategory.name
                              )
                            }
                          >
                            {deletingId ===
                            subcategory._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  );
}

export default SubCategoryList;