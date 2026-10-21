// import { useEffect, useState } from "react";
// import { createBrand } from "../../../services/brandService";
// import { getBrands } from "../../../services/brandService";
// import "./BrandList.css";

// const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

// function BrandList() {
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     loadBrands();
//   }, []);

//   const loadBrands = async () => {
//     try {
//       setLoading(true);
//       const res = await getBrands();
//       // Safely access array data
//       setBrands(res?.data?.data || res?.data || []);
//     } catch (error) {
//       console.error("Error fetching brands:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Search filter implementation
//   const filteredBrands = brands.filter((brand) => {
//     const name = (brand.name || "").toLowerCase();
//     const categoryName = (brand.category?.name || "").toLowerCase();
//     const query = searchTerm.toLowerCase();

//     return name.includes(query) || categoryName.includes(query);
//   });

//   return (
//     <div className="brand-list-container">
//       <div className="brand-card5">
//         {/* Top bar: title + description on the left, badge + search + refresh on the right */}
//         <div className="page-header">
//           <div className="page-header-text">
//             <h2>Brand Directory</h2>
//             <p>Manage product brands, logos, and category associations.</p>
//           </div>

//           <div className="page-header-actions">
//             <span className="brand-badge">{filteredBrands.length} Brands</span>
//             <input
//               type="text"
//               className="search-input"
//               placeholder="Search brands by name or category..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button className="refresh-btn" onClick={loadBrands} disabled={loading}>
//               {loading ? "Refreshing..." : "Refresh"}
//             </button>
//           </div>
//         </div>

//         {/* Table Wrapper */}
//         <div className="table-wrapper">
//           {loading ? (
//             <div className="loading-state">
//               <div className="spinner"></div>
//               <p>Loading brands...</p>
//             </div>
//           ) : filteredBrands.length === 0 ? (
//             <div className="empty-state">
//               <p>No brands found.</p>
//             </div>
//           ) : (
//             <table className="custom-table">
//               <thead>
//                 <tr>
//                   <th>Logo</th>
//                   <th>Brand Name</th>
//                   <th>Category</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredBrands.map((brand) => {
//                   const logoUrl = brand.logo
//                     ? brand.logo.startsWith("http")
//                       ? brand.logo
//                       : `${BASE_URL}${brand.logo}`
//                     : null;

//                   return (
//                     <tr key={brand._id}>
//                       <td className="logo-cell">
//                         {logoUrl ? (
//                           <img
//                             src={logoUrl}
//                             alt={brand.name}
//                             className="brand-logo"
//                             onError={(e) => {
//                               e.target.onerror = null;
//                               e.target.src = "https://placehold.co/100x100?text=No+Image";
//                             }}
//                           />
//                         ) : (
//                           <div className="no-logo-placeholder">No Image</div>
//                         )}
//                       </td>
//                       <td className="brand-name1">{brand.name}</td>
//                       <td className="category-cell">
//                         {brand.category?.name ? (
//                           <span className="category-pill">{brand.category.name}</span>
//                         ) : (
//                           <span className="text-muted">Uncategorized</span>
//                         )}
//                       </td>
//                       <td>
//                         <span
//                           className={`status-pill ${
//                             brand.status === "ACTIVE" || brand.status === "Active"
//                               ? "active"
//                               : "inactive"
//                           }`}
//                         >
//                           {brand.status || "ACTIVE"}
//                         </span>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BrandList;




import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getBrands,
  updateBrand,
  deleteBrand,
} from "../../../services/brandService";

import {
  getCategories,
} from "../../../services/categoryService";

import "./BrandList.css";

// ======================================================
// API CONFIGURATION
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const API_ORIGIN = API_URL
  .replace(/\/api\/?$/i, "")
  .replace(/\/+$/, "");

// ======================================================
// HELPERS
// ======================================================

const extractArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.brands)) return payload.brands;
  if (Array.isArray(payload?.categories)) return payload.categories;
  if (Array.isArray(payload?.data?.brands))
    return payload.data.brands;
  if (Array.isArray(payload?.data?.categories))
    return payload.data.categories;
  return [];
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong.";

const getCategoryId = (brand) => {
  const category = brand?.category;

  if (!category) return "";

  if (typeof category === "object") {
    return String(category._id || category.id || "");
  }

  return String(category);
};

// Handles:
// /uploads/brands/file.png
// uploads/brands/file.png
// http://localhost:5000/uploads/brands/file.png
// /api/uploads/brands/file.png
// Windows-style paths
const getLogoUrl = (logo, version = "") => {
  if (typeof logo !== "string" || !logo.trim()) {
    return "";
  }

  let path = logo.trim().replace(/\\/g, "/");

  if (/^(data:|blob:)/i.test(path)) {
    return path;
  }

  let url = "";

  if (/^https?:\/\//i.test(path)) {
    url = path;
  } else {
    path = path.replace(/^\/+/, "");

    if (path.startsWith("api/uploads/")) {
      path = path.substring(4);
    }

    url = `${API_ORIGIN}/${path}`;
  }

  if (!version) return url;

  return `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(
    version
  )}`;
};

// ======================================================
// IMAGE COMPONENT
// ======================================================

function BrandLogo({ logo, name, version, large = false }) {
  const [failed, setFailed] = useState(false);

  const src = getLogoUrl(logo, version);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={
          large
            ? "no-logo-placeholder brand-preview-fallback"
            : "no-logo-placeholder"
        }
        title={
          failed
            ? `Image could not load: ${src}`
            : "No logo uploaded"
        }
      >
        No Image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || "Brand logo"}
      className={
        large
          ? "brand-edit-logo-preview"
          : "brand-logo"
      }
      loading={large ? "eager" : "lazy"}
      onError={() => {
        console.error("BRAND LOGO LOAD FAILED:", {
          brand: name,
          url: src,
        });
        setFailed(true);
      }}
    />
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function BrandList() {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] =
    useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [editingBrand, setEditingBrand] =
    useState(null);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] =
    useState("");
  const [editCategoryId, setEditCategoryId] =
    useState("");
  const [editStatus, setEditStatus] =
    useState("ACTIVE");

  const [editLogo, setEditLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [logoVersions, setLogoVersions] =
    useState({});

  // ====================================================
  // LOAD BRANDS
  // ====================================================

  const loadBrands = useCallback(async (
    showLoading = true
  ) => {
    try {
      if (showLoading) setLoading(true);

      setError("");

      const response = await getBrands();

      if (response?.data?.success === false) {
        throw new Error(
          response.data.message ||
          "Unable to load brands."
        );
      }

      const list = extractArray(response.data);

      console.log("BRANDS FROM API:", list);

      setBrands(list);
      return list;
    } catch (err) {
      console.error("GET BRANDS ERROR:", err);
      setError(getErrorMessage(err));
      return null;
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // ====================================================
  // LOAD CATEGORIES
  // ====================================================

  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);

      const response = await getCategories();

      if (response?.data?.success === false) {
        throw new Error(
          response.data.message ||
          "Unable to load categories."
        );
      }

      setCategories(extractArray(response.data));
    } catch (err) {
      console.error("GET CATEGORIES ERROR:", err);

      setError(
        "Categories could not be loaded. Please refresh."
      );
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBrands();
    loadCategories();
  }, [loadBrands, loadCategories]);

  // ====================================================
  // LOGO PREVIEW
  // ====================================================

  useEffect(() => {
    if (!(editLogo instanceof File)) {
      setLogoPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(editLogo);
    setLogoPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [editLogo]);

  // ====================================================
  // CATEGORY NAME
  // ====================================================

  const getCategoryName = (brand) => {
    if (
      brand?.category &&
      typeof brand.category === "object"
    ) {
      return brand.category.name || "Uncategorized";
    }

    const categoryId = getCategoryId(brand);

    const found = categories.find(
      (item) => String(item._id) === categoryId
    );

    return found?.name || "Uncategorized";
  };

  // ====================================================
  // SEARCH
  // ====================================================

  const filteredBrands = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return brands;

    return brands.filter((brand) => {
      const category = brand?.category;

      const categoryName =
        category && typeof category === "object"
          ? category.name
          : categories.find(
              (item) =>
                String(item._id) === getCategoryId(brand)
            )?.name;

      return [
        brand.name,
        brand.description,
        categoryName,
        brand.status,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [brands, categories, searchTerm]);

  // ====================================================
  // EDIT FORM
  // ====================================================

  const openEdit = (brand) => {
    setNotice("");
    setError("");

    setEditingBrand(brand);
    setEditName(brand.name || "");
    setEditDescription(brand.description || "");
    setEditCategoryId(getCategoryId(brand));
    setEditStatus(
      String(brand.status || "ACTIVE").toUpperCase()
    );
    setEditLogo(null);
  };

  const resetEditForm = () => {
    setEditingBrand(null);
    setEditName("");
    setEditDescription("");
    setEditCategoryId("");
    setEditStatus("ACTIVE");
    setEditLogo(null);
  };

  const closeEdit = () => {
    if (saving) return;
    resetEditForm();
  };

  // ====================================================
  // LOGO SELECTION
  // ====================================================

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setEditLogo(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      window.alert(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );
      event.target.value = "";
      setEditLogo(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      window.alert(
        "Logo size must be 10 MB or less."
      );
      event.target.value = "";
      setEditLogo(null);
      return;
    }

    setEditLogo(file);
  };

  // ====================================================
  // UPDATE BRAND
  // ====================================================

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editingBrand?._id || saving) return;

    if (!editName.trim()) {
      window.alert("Brand name is required.");
      return;
    }

    if (!editCategoryId) {
      window.alert("Please select a category.");
      return;
    }

    const brandId = editingBrand._id;
    const selectedLogo = editLogo;

    try {
      setSaving(true);
      setError("");
      setNotice("");

      const formData = new FormData();

      formData.append("name", editName.trim());
      formData.append(
        "description",
        editDescription.trim()
      );
      formData.append("category", editCategoryId);
      formData.append("status", editStatus);

      if (selectedLogo instanceof File) {
        formData.append(
          "logo",
          selectedLogo,
          selectedLogo.name
        );
      }

      console.log("BRAND UPDATE ID:", brandId);

      for (const [key, value] of formData.entries()) {
        console.log("BRAND UPDATE FIELD:", key, value);
      }

      const response = await updateBrand(
        brandId,
        formData
      );

      if (response?.data?.success === false) {
        throw new Error(
          response.data.message ||
          "Brand update failed."
        );
      }

      const saved = response?.data?.data;

      console.log("UPDATED BRAND:", saved);

      // Check whether the backend actually returned
      // a new logo path when a new file was selected.
      if (selectedLogo instanceof File) {
        if (!saved?.logo) {
          throw new Error(
            "Brand update returned no logo path. Check backend upload."
          );
        }

        if (saved.logo === editingBrand.logo) {
          throw new Error(
            "Brand details were saved, but the logo path did not change. Check backend upload logs."
          );
        }
      }

      setLogoVersions((previous) => ({
        ...previous,
        [brandId]: Date.now(),
      }));

      // Update the table immediately.
      if (saved?._id) {
        setBrands((previous) =>
          previous.map((brand) =>
            String(brand._id) === String(brandId)
              ? {
                  ...brand,
                  ...saved,
                }
              : brand
          )
        );
      }

      resetEditForm();
      setNotice("Brand updated successfully.");

      // Synchronize with the database.
      await loadBrands(false);
    } catch (err) {
      console.error(
        "UPDATE BRAND ERROR:",
        err?.response?.data || err
      );

      window.alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // DELETE BRAND
  // ====================================================

  const handleDelete = async (brand) => {
    if (!brand?._id || deletingId) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${brand.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(brand._id);
      setError("");
      setNotice("");

      const response = await deleteBrand(brand._id);

      if (response?.data?.success === false) {
        throw new Error(
          response.data.message ||
          "Unable to delete brand."
        );
      }

      setBrands((previous) =>
        previous.filter(
          (item) =>
            String(item._id) !== String(brand._id)
        )
      );

      setNotice("Brand deleted successfully.");
    } catch (err) {
      console.error("DELETE BRAND ERROR:", err);
      window.alert(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  // ====================================================
  // JSX
  // ====================================================

  return (
    <div className="brand-list-container">
      <div className="brand-card5">

        {/* HEADER */}

        <div className="page-header">
          <div className="page-header-text">
            <h2>Brand Directory</h2>
            <p>
              Manage product brands, logos,
              and category associations.
            </p>
          </div>

          <div className="page-header-actions">
            <span className="brand-badge">
              {filteredBrands.length} Brands
            </span>

            <input
              type="search"
              className="search-input"
              placeholder="Search brands by name or category..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

            <button
              type="button"
              className="refresh-btn"
              onClick={() => {
                loadBrands();
                loadCategories();
              }}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* MESSAGES */}

        {error && (
          <div
            className="brand-error-message"
            role="alert"
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            className="brand-success-message"
            role="status"
          >
            {notice}
          </div>
        )}

        {/* TABLE */}

        <div className="table-wrapper">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading brands...</p>
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="empty-state">
              <p>No brands found.</p>
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Brand Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBrands.map((brand) => {
                  const version =
                    logoVersions[brand._id] ||
                    brand.updatedAt;

                  const isActive =
                    String(
                      brand.status || "ACTIVE"
                    ).toUpperCase() === "ACTIVE";

                  return (
                    <tr key={brand._id}>
                      <td
                        className="logo-cell"
                        data-label="Logo"
                      >
                        <BrandLogo
                          logo={brand.logo}
                          name={brand.name}
                          version={version}
                        />
                      </td>

                      <td
                        className="brand-name1"
                        data-label="Brand Name"
                      >
                        {brand.name}
                      </td>

                      <td
                        className="category-cell"
                        data-label="Category"
                      >
                        {getCategoryName(brand) !==
                        "Uncategorized" ? (
                          <span className="category-pill">
                            {getCategoryName(brand)}
                          </span>
                        ) : (
                          <span className="text-muted">
                            Uncategorized
                          </span>
                        )}
                      </td>

                      <td data-label="Status">
                        <span
                          className={`status-pill ${
                            isActive
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {brand.status || "ACTIVE"}
                        </span>
                      </td>

                      <td data-label="Actions">
                        <div className="brand-row-actions">
                          <button
                            type="button"
                            className="brand-edit-btn"
                            onClick={() => openEdit(brand)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="brand-delete-btn"
                            disabled={
                              deletingId === brand._id
                            }
                            onClick={() =>
                              handleDelete(brand)
                            }
                          >
                            {deletingId === brand._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}

      {editingBrand && (
        <div
          className="brand-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEdit();
            }
          }}
        >
          <form
            className="brand-edit-modal"
            onSubmit={handleUpdate}
            role="dialog"
            aria-modal="true"
            aria-label="Edit Brand"
          >
            <div className="brand-modal-header">
              <div>
                <h3>Edit Brand</h3>
                <p>Update brand details and logo.</p>
              </div>

              <button
                type="button"
                className="brand-modal-close"
                disabled={saving}
                onClick={closeEdit}
                aria-label="Close edit modal"
              >
                ×
              </button>
            </div>

            <div className="brand-modal-body">

              <div className="brand-form-group">
                <label htmlFor="edit-brand-name">
                  Brand Name *
                </label>

                <input
                  id="edit-brand-name"
                  value={editName}
                  onChange={(event) =>
                    setEditName(event.target.value)
                  }
                  required
                />
              </div>

              <div className="brand-form-group">
                <label htmlFor="edit-brand-description">
                  Description
                </label>

                <textarea
                  id="edit-brand-description"
                  rows={3}
                  value={editDescription}
                  onChange={(event) =>
                    setEditDescription(event.target.value)
                  }
                />
              </div>

              <div className="brand-form-group">
                <label htmlFor="edit-brand-category">
                  Category *
                </label>

                <select
                  id="edit-brand-category"
                  value={editCategoryId}
                  onChange={(event) =>
                    setEditCategoryId(event.target.value)
                  }
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

                {categoriesLoading && (
                  <small>Loading categories...</small>
                )}
              </div>

              <div className="brand-form-group">
                <label htmlFor="edit-brand-status">
                  Status
                </label>

                <select
                  id="edit-brand-status"
                  value={editStatus}
                  onChange={(event) =>
                    setEditStatus(event.target.value)
                  }
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">
                    INACTIVE
                  </option>
                </select>
              </div>

              <div className="brand-form-group">
                <label htmlFor="edit-brand-logo">
                  Replace Logo (optional)
                </label>

                <input
                  id="edit-brand-logo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleLogoChange}
                />

                <div className="brand-logo-preview-area">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="New logo preview"
                      className="brand-edit-logo-preview"
                    />
                  ) : (
                    <BrandLogo
                      logo={editingBrand.logo}
                      name={editingBrand.name}
                      version={
                        logoVersions[editingBrand._id] ||
                        editingBrand.updatedAt
                      }
                      large
                    />
                  )}

                  {editLogo ? (
                    <p>New logo: {editLogo.name}</p>
                  ) : (
                    <p>
                      Current logo (choose a file
                      to replace it)
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="brand-modal-footer">
              <button
                type="button"
                className="brand-cancel-btn"
                disabled={saving}
                onClick={closeEdit}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="brand-save-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
