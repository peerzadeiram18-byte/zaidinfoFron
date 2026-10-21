// // import { useEffect, useState } from "react";
// // import { getCategories } from "../../../services/categoryService";
// // import "./CategoryList.css";

// // const API_URL = import.meta.env.VITE_API_URL;

// // // Remove /api from API URL for uploaded images/files
// // const SERVER_URL = API_URL
// //     ? API_URL.replace(/\/api\/?$/, "")
// //     : "";

// // function CategoryList() {
// //     const [categories, setCategories] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [searchTerm, setSearchTerm] = useState("");

// //     // =====================================================
// //     // LOAD CATEGORIES
// //     // =====================================================

// //     useEffect(() => {
// //         loadCategories();
// //     }, []);

// //     const loadCategories = async () => {
// //         try {
// //             setLoading(true);

// //             const res = await getCategories();

// //             console.log("CATEGORY LIST RESPONSE:", res?.data);

// //             // Handle different backend response structures
// //             const categoryData =
// //                 Array.isArray(res?.data)
// //                     ? res.data
// //                     : Array.isArray(res?.data?.data)
// //                         ? res.data.data
// //                         : Array.isArray(res?.data?.categories)
// //                             ? res.data.categories
// //                             : [];

// //             console.log("CATEGORIES:", categoryData);

// //             setCategories(categoryData);
// //         } catch (error) {
// //             console.error(
// //                 "ERROR FETCHING CATEGORIES:",
// //                 error
// //             );

// //             setCategories([]);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     // =====================================================
// //     // IMAGE URL HELPER
// //     // =====================================================

// //     const getImageUrl = (image) => {
// //         if (!image) {
// //             return null;
// //         }

// //         // Backend may return:
// //         // { url: "/uploads/categories/image.jpg" }

// //         if (typeof image === "object") {
// //             image =
// //                 image?.url ||
// //                 image?.path ||
// //                 image?.filename ||
// //                 "";
// //         }

// //         if (
// //             !image ||
// //             typeof image !== "string"
// //         ) {
// //             return null;
// //         }

// //         image = image.trim();

// //         if (!image) {
// //             return null;
// //         }

// //         // Already complete URL
// //         if (
// //             image.startsWith("http://") ||
// //             image.startsWith("https://")
// //         ) {
// //             return image;
// //         }

// //         // Backend path starts with /
// //         if (image.startsWith("/")) {
// //             return `${SERVER_URL}${image}`;
// //         }

// //         // Backend path without /
// //         return `${SERVER_URL}/${image}`;
// //     };

// //     // =====================================================
// //     // FILTER CATEGORIES
// //     // =====================================================

// //     const filteredCategories = categories.filter(
// //         (category) => {
// //             const name = (
// //                 category?.name || ""
// //             ).toLowerCase();

// //             const description = (
// //                 category?.description || ""
// //             ).toLowerCase();

// //             const query = searchTerm
// //                 .toLowerCase()
// //                 .trim();

// //             return (
// //                 name.includes(query) ||
// //                 description.includes(query)
// //             );
// //         }
// //     );

// //     // =====================================================
// //     // RENDER
// //     // =====================================================

// //     return (
// //         <div className="category-list-container">

// //             <div className="category-card">

// //                 {/* =================================================
// //                     HEADER
// //                 ================================================= */}

// //                 <div className="card-header">

// //                     <div>

// //                         <h2>
// //                             Category Directory
// //                         </h2>

// //                         <p>
// //                             Manage product categories,
// //                             media, and visibility status.
// //                         </p>

// //                     </div>

// //                     <span className="category-badge">
// //                         {filteredCategories.length} Categories
// //                     </span>

// //                 </div>

// //                 {/* =================================================
// //                     TOOLBAR
// //                 ================================================= */}

// //                 <div className="toolbar">

// //                     <input
// //                         type="text"
// //                         className="search-input"
// //                         placeholder="Search categories by name or description..."
// //                         value={searchTerm}
// //                         onChange={(e) =>
// //                             setSearchTerm(
// //                                 e.target.value
// //                             )
// //                         }
// //                     />

// //                     <button
// //                         type="button"
// //                         className="refresh-btn"
// //                         onClick={loadCategories}
// //                         disabled={loading}
// //                     >
// //                         {loading
// //                             ? "Refreshing..."
// //                             : "Refresh"}
// //                     </button>

// //                 </div>

// //                 {/* =================================================
// //                     TABLE
// //                 ================================================= */}

// //                 <div className="table-wrapper">

// //                     {loading ? (

// //                         <div className="loading-state">

// //                             <div className="spinner"></div>

// //                             <p>
// //                                 Loading categories...
// //                             </p>

// //                         </div>

// //                     ) : filteredCategories.length === 0 ? (

// //                         <div className="empty-state">

// //                             <p>
// //                                 No categories found.
// //                             </p>

// //                         </div>

// //                     ) : (

// //                         <table className="custom-table">

// //                             <thead>

// //                                 <tr>

// //                                     <th>
// //                                         Image
// //                                     </th>

// //                                     <th>
// //                                         Name
// //                                     </th>

// //                                     <th>
// //                                         Description
// //                                     </th>

// //                                     <th>
// //                                         Status
// //                                     </th>

// //                                 </tr>

// //                             </thead>

// //                             <tbody>

// //                                 {filteredCategories.map(
// //                                     (category, index) => {

// //                                         const imageUrl =
// //                                             getImageUrl(
// //                                                 category?.image
// //                                             );

// //                                         return (

// //                                             <tr
// //                                                 key={
// //                                                     category?._id ||
// //                                                     index
// //                                                 }
// //                                             >

// //                                                 {/* IMAGE */}

// //                                                 <td className="image-cell">

// //                                                     {imageUrl ? (

// //                                                         <img
// //                                                             src={imageUrl}
// //                                                             alt={
// //                                                                 category?.name ||
// //                                                                 "Category"
// //                                                             }
// //                                                             className="category-thumbnail"
// //                                                             onError={(e) => {

// //                                                                 console.error(
// //                                                                     "CATEGORY IMAGE FAILED:",
// //                                                                     imageUrl
// //                                                                 );

// //                                                                 e.currentTarget.onerror =
// //                                                                     null;

// //                                                                 e.currentTarget.style.display =
// //                                                                     "none";

// //                                                                 const parent =
// //                                                                     e.currentTarget
// //                                                                         .parentElement;

// //                                                                 if (
// //                                                                     parent &&
// //                                                                     !parent.querySelector(
// //                                                                         ".no-image-placeholder"
// //                                                                     )
// //                                                                 ) {

// //                                                                     const placeholder =
// //                                                                         document.createElement(
// //                                                                             "div"
// //                                                                         );

// //                                                                     placeholder.className =
// //                                                                         "no-image-placeholder";

// //                                                                     placeholder.textContent =
// //                                                                         "No Image";

// //                                                                     parent.appendChild(
// //                                                                         placeholder
// //                                                                     );
// //                                                                 }

// //                                                             }}
// //                                                         />

// //                                                     ) : (

// //                                                         <div className="no-image-placeholder">
// //                                                             No Image
// //                                                         </div>

// //                                                     )}

// //                                                 </td>

// //                                                 {/* NAME */}

// //                                                 <td className="category-name">

// //                                                     {category?.name ||
// //                                                         "Unnamed Category"}

// //                                                 </td>

// //                                                 {/* DESCRIPTION */}

// //                                                 <td className="text-muted description-cell">

// //                                                     {category?.description ||
// //                                                         "No description provided."}

// //                                                 </td>

// //                                                 {/* STATUS */}

// //                                                 <td>

// //                                                     <span
// //                                                         className={`status-pill ${
// //                                                             category?.status ===
// //                                                                 "ACTIVE" ||
// //                                                             category?.status ===
// //                                                                 "Active"
// //                                                                 ? "active"
// //                                                                 : "inactive"
// //                                                         }`}
// //                                                     >

// //                                                         {category?.status ||
// //                                                             "ACTIVE"}

// //                                                     </span>

// //                                                 </td>

// //                                             </tr>

// //                                         );
// //                                     }
// //                                 )}

// //                             </tbody>

// //                         </table>

// //                     )}

// //                 </div>

// //             </div>

// //         </div>
// //     );
// // }

// // export default CategoryList;
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   getCategories,
//   updateCategory,
//   deleteCategory,
// } from "../../../services/categoryService";

// import "./CategoryList.css";

// const API_URL = import.meta.env.VITE_API_URL;

// const CategoryList = () => {
//   const [categories, setCategories] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState("");

//   const [search, setSearch] = useState("");

//   const [editingCategory, setEditingCategory] = useState(null);

//   const [editName, setEditName] = useState("");

//   const [editDescription, setEditDescription] =
//     useState("");

//   const [saving, setSaving] = useState(false);

//   const [deletingId, setDeletingId] =
//     useState(null);

//   // =====================================================
//   // FETCH CATEGORIES
//   // =====================================================

//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await getCategories();

//       console.log(
//         "CATEGORY LIST RESPONSE:",
//         response
//       );

//       // Axios response
//       const responseData = response?.data;

//       let list = [];

//       // -----------------------------------------------
//       // SUPPORT ALL COMMON BACKEND RESPONSE FORMATS
//       // -----------------------------------------------

//       if (Array.isArray(responseData)) {
//         list = responseData;
//       } else if (
//         Array.isArray(responseData?.categories)
//       ) {
//         list = responseData.categories;
//       } else if (
//         Array.isArray(responseData?.data)
//       ) {
//         list = responseData.data;
//       } else if (
//         Array.isArray(responseData?.data?.categories)
//       ) {
//         list = responseData.data.categories;
//       }

//       console.log(
//         "FINAL CATEGORY ARRAY:",
//         list
//       );

//       setCategories(list);
//     } catch (err) {
//       console.error(
//         "CATEGORY LIST ERROR:",
//         err
//       );

//       setError(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Unable to load categories."
//       );

//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // LOAD
//   // =====================================================

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // =====================================================
//   // IMAGE URL
//   // =====================================================

//   const getImageUrl = (image) => {
//     if (!image) return "";

//     // Already full URL
//     if (
//       image.startsWith("http://") ||
//       image.startsWith("https://")
//     ) {
//       return image;
//     }

//     const baseUrl = API_URL?.replace(/\/$/, "");

//     const cleanImage =
//       image.startsWith("/")
//         ? image
//         : `/${image}`;

//     return `${baseUrl}${cleanImage}`;
//   };

//   // =====================================================
//   // PARENT CATEGORY NAME
//   // =====================================================

//   const getParentCategoryName = (
//     category
//   ) => {
//     if (!category?.parentCategory) {
//       return "—";
//     }

//     // populated object
//     if (
//       typeof category.parentCategory ===
//       "object"
//     ) {
//       return (
//         category.parentCategory.name ||
//         "—"
//       );
//     }

//     // ObjectId string
//     const parent = categories.find(
//       (item) =>
//         String(item._id) ===
//         String(
//           category.parentCategory
//         )
//     );

//     return parent?.name || "—";
//   };

//   // =====================================================
//   // SUBCATEGORY CHECK
//   // =====================================================

//   const isSubCategory = (category) => {
//     return Boolean(
//       category?.parentCategory
//     );
//   };

//   // =====================================================
//   // SEARCH
//   // =====================================================

//   const filteredCategories = useMemo(() => {
//     const value = search
//       .trim()
//       .toLowerCase();

//     if (!value) {
//       return categories;
//     }

//     return categories.filter(
//       (category) => {
//         const name = String(
//           category?.name || ""
//         ).toLowerCase();

//         const description =
//           String(
//             category?.description || ""
//           ).toLowerCase();

//         const parent =
//           getParentCategoryName(
//             category
//           ).toLowerCase();

//         return (
//           name.includes(value) ||
//           description.includes(value) ||
//           parent.includes(value)
//         );
//       }
//     );
//   }, [categories, search]);

//   // =====================================================
//   // EDIT
//   // =====================================================

//   const handleEdit = (category) => {
//     setEditingCategory(category);

//     setEditName(
//       category?.name || ""
//     );

//     setEditDescription(
//       category?.description || ""
//     );
//   };

//   // =====================================================
//   // CANCEL EDIT
//   // =====================================================

//   const handleCancelEdit = () => {
//     setEditingCategory(null);
//     setEditName("");
//     setEditDescription("");
//   };

//   // =====================================================
//   // SAVE EDIT
//   // =====================================================

//   const handleUpdate = async () => {
//     if (!editingCategory?._id) {
//       return;
//     }

//     if (!editName.trim()) {
//       alert("Category name is required.");
//       return;
//     }

//     try {
//       setSaving(true);

//       const payload = {
//         name: editName.trim(),
//         description:
//           editDescription.trim(),
//       };

//       const response =
//         await updateCategory(
//           editingCategory._id,
//           payload
//         );

//       console.log(
//         "CATEGORY UPDATE RESPONSE:",
//         response
//       );

//       await fetchCategories();

//       handleCancelEdit();
//     } catch (err) {
//       console.error(
//         "CATEGORY UPDATE ERROR:",
//         err
//       );

//       alert(
//         err?.response?.data?.message ||
//           "Unable to update category."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // =====================================================
//   // DELETE
//   // =====================================================

//   const handleDelete = async (category) => {
//     if (!category?._id) {
//       return;
//     }

//     const confirmed =
//       window.confirm(
//         `Are you sure you want to delete "${category.name}"?`
//       );

//     if (!confirmed) {
//       return;
//     }

//     try {
//       setDeletingId(category._id);

//       await deleteCategory(
//         category._id
//       );

//       // Remove from UI immediately
//       setCategories(
//         (previous) =>
//           previous.filter(
//             (item) =>
//               item._id !==
//               category._id
//           )
//       );
//     } catch (err) {
//       console.error(
//         "CATEGORY DELETE ERROR:",
//         err
//       );

//       alert(
//         err?.response?.data?.message ||
//           "Unable to delete category."
//       );
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // =====================================================
//   // LOADING
//   // =====================================================

//   if (loading) {
//     return (
//       <div className="category-list-page">
//         <div className="category-loading">
//           Loading categories...
//         </div>
//       </div>
//     );
//   }

//   // =====================================================
//   // RENDER
//   // =====================================================

//   return (
//     <div className="category-list-page">

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div className="category-list-header">

//         <div>
//           <h1>
//             Categories
//           </h1>

//           <p>
//             Manage parent categories and
//             subcategories.
//           </p>
//         </div>

//         <div className="category-header-actions">

//           <button
//             type="button"
//             className="refresh-category-btn"
//             onClick={fetchCategories}
//           >
//             ↻ Refresh
//           </button>

//         </div>

//       </div>

//       {/* =================================================
//           ERROR
//       ================================================= */}

//       {error && (
//         <div className="category-error">
//           {error}
//         </div>
//       )}

//       {/* =================================================
//           SEARCH
//       ================================================= */}

//       <div className="category-toolbar">

//         <input
//           type="text"
//           placeholder="Search category, subcategory or parent..."
//           value={search}
//           onChange={(e) =>
//             setSearch(e.target.value)
//           }
//         />

//         <span>
//           {filteredCategories.length}{" "}
//           category
//           {filteredCategories.length !==
//           1
//             ? "ies"
//             : ""}
//         </span>

//       </div>

//       {/* =================================================
//           EMPTY
//       ================================================= */}

//       {!error &&
//         filteredCategories.length ===
//           0 && (
//           <div className="category-empty">

//             <div>
//               📂
//             </div>

//             <h2>
//               No Categories Found
//             </h2>

//             <p>
//               Create a category first.
//             </p>

//           </div>
//         )}

//       {/* =================================================
//           TABLE
//       ================================================= */}

//       {filteredCategories.length >
//         0 && (
//         <div className="category-table-wrapper">

//           <table className="category-table">

//             <thead>

//               <tr>

//                 <th>
//                   #
//                 </th>

//                 <th>
//                   Image
//                 </th>

//                 <th>
//                   Category Name
//                 </th>

//                 <th>
//                   Type
//                 </th>

//                 <th>
//                   Parent Category
//                 </th>

//                 <th>
//                   Description
//                 </th>

//                 <th>
//                   Status
//                 </th>

//                 <th>
//                   Actions
//                 </th>

//               </tr>

//             </thead>

//             <tbody>

//               {filteredCategories.map(
//                 (category, index) => {

//                   const subCategory =
//                     isSubCategory(
//                       category
//                     );

//                   return (
//                     <tr
//                       key={
//                         category._id
//                       }
//                     >

//                       {/* NUMBER */}

//                       <td>
//                         {index + 1}
//                       </td>

//                       {/* IMAGE */}

//                       <td>

//                         {category.image ? (
//                           <img
//                             src={getImageUrl(
//                               category.image
//                             )}
//                             alt={
//                               category.name
//                             }
//                             className="category-table-image"
//                             onError={(
//                               e
//                             ) => {
//                               e.currentTarget.style.display =
//                                 "none";
//                             }}
//                           />
//                         ) : (
//                           <div className="category-no-image">
//                             📁
//                           </div>
//                         )}

//                       </td>

//                       {/* NAME */}

//                       <td>

//                         <div className="category-name-cell">

//                           {subCategory && (
//                             <span className="subcategory-line">
//                               ↳
//                             </span>
//                           )}

//                           <strong>
//                             {
//                               category.name
//                             }
//                           </strong>

//                         </div>

//                       </td>

//                       {/* TYPE */}

//                       <td>

//                         {subCategory ? (
//                           <span className="category-type sub">
//                             Subcategory
//                           </span>
//                         ) : (
//                           <span className="category-type parent">
//                             Parent
//                           </span>
//                         )}

//                       </td>

//                       {/* PARENT */}

//                       <td>

//                         {subCategory ? (
//                           <span className="parent-category-name">
//                             {
//                               getParentCategoryName(
//                                 category
//                               )
//                             }
//                           </span>
//                         ) : (
//                           <span className="no-parent">
//                             —
//                           </span>
//                         )}

//                       </td>

//                       {/* DESCRIPTION */}

//                       <td>

//                         <span className="category-description">

//                           {category.description ||
//                             "—"}

//                         </span>

//                       </td>

//                       {/* STATUS */}

//                       <td>

//                         <span
//                           className={`category-status ${
//                             String(
//                               category.status ||
//                                 "ACTIVE"
//                             ).toLowerCase()
//                           }`}
//                         >
//                           {
//                             category.status ||
//                             "ACTIVE"
//                           }
//                         </span>

//                       </td>

//                       {/* ACTIONS */}

//                       <td>

//                         <div className="category-actions">

//                           <button
//                             type="button"
//                             className="edit-category-btn"
//                             onClick={() =>
//                               handleEdit(
//                                 category
//                               )
//                             }
//                           >
//                             Edit
//                           </button>

//                           <button
//                             type="button"
//                             className="delete-category-btn"
//                             disabled={
//                               deletingId ===
//                               category._id
//                             }
//                             onClick={() =>
//                               handleDelete(
//                                 category
//                               )
//                             }
//                           >
//                             {deletingId ===
//                             category._id
//                               ? "Deleting..."
//                               : "Delete"}
//                           </button>

//                         </div>

//                       </td>

//                     </tr>
//                   );
//                 }
//               )}

//             </tbody>

//           </table>

//         </div>
//       )}

//       {/* =================================================
//           EDIT MODAL
//       ================================================= */}

//       {editingCategory && (
//         <div className="category-modal-overlay">

//           <div className="category-modal">

//             <div className="category-modal-header">

//               <div>
//                 <h2>
//                   Edit Category
//                 </h2>

//                 <p>
//                   Update category information.
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={
//                   handleCancelEdit
//                 }
//               >
//                 ×
//               </button>

//             </div>

//             <div className="category-modal-body">

//               <div className="category-form-group">

//                 <label>
//                   Category Name *
//                 </label>

//                 <input
//                   type="text"
//                   value={editName}
//                   onChange={(e) =>
//                     setEditName(
//                       e.target.value
//                     )
//                   }
//                 />

//               </div>

//               <div className="category-form-group">

//                 <label>
//                   Description
//                 </label>

//                 <textarea
//                   rows="4"
//                   value={
//                     editDescription
//                   }
//                   onChange={(e) =>
//                     setEditDescription(
//                       e.target.value
//                     )
//                   }
//                 />

//               </div>

//             </div>

//             <div className="category-modal-footer">

//               <button
//                 type="button"
//                 className="modal-cancel-btn"
//                 onClick={
//                   handleCancelEdit
//                 }
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 className="modal-save-btn"
//                 disabled={saving}
//                 onClick={
//                   handleUpdate
//                 }
//               >
//                 {saving
//                   ? "Saving..."
//                   : "Save Changes"}
//               </button>

//             </div>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// };

// export default CategoryList;



import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCategories,
  updateCategory,
  deleteCategory,
} from "../../../services/categoryService";

import "./CategoryList.css";

// ======================================================
// API URL
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const API_ORIGIN = API_URL
  .replace(/\/api\/?$/i, "")
  .replace(/\/$/, "");

// ======================================================
// HELPERS
// ======================================================

const extractCategories = (payload) => {
  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload?.categories)) {
    return payload.categories;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.categories)) {
    return payload.data.categories;
  }

  return [];
};

const errorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

const imageUrl = (path, version = "") => {
  if (!path || typeof path !== "string") {
    return "";
  }

  const raw = path.replace(/\\/g, "/");

  const url = /^(https?:|data:|blob:)/i.test(raw)
    ? raw
    : `${API_ORIGIN}/${raw.replace(/^\/+/, "")}`;

  if (!version || /^(data:|blob:)/i.test(url)) {
    return url;
  }

  return `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(
    version
  )}`;
};

const getParentId = (category) => {
  const parent = category?.parentCategory;

  if (!parent) return "";

  if (typeof parent === "object") {
    return String(parent._id || "");
  }

  return String(parent);
};

// ======================================================
// CATEGORY LIST COMPONENT
// ======================================================

export default function CategoryList() {
  // ----------------------------------------------------
  // LIST STATES
  // ----------------------------------------------------

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  // ----------------------------------------------------
  // EDIT STATES
  // ----------------------------------------------------

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] =
    useState("");
  const [editParentId, setEditParentId] =
    useState("");
  const [editStatus, setEditStatus] =
    useState("ACTIVE");

  const [editImage, setEditImage] = useState(null);
  const [imagePreview, setImagePreview] =
    useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState(null);

  const [imageVersions, setImageVersions] =
    useState({});

  // ====================================================
  // FETCH CATEGORIES
  // ====================================================

  const fetchCategories = useCallback(
    async (initial = false) => {
      try {
        if (initial) {
          setLoading(true);
        }

        setError("");

        const response = await getCategories();

        if (response?.data?.success === false) {
          throw new Error(
            response.data.message ||
              "Unable to load categories."
          );
        }

        const list = extractCategories(
          response.data
        );

        setCategories(list);
      } catch (err) {
        console.error(
          "CATEGORY LIST ERROR:",
          err
        );

        setError(
          errorMessage(
            err,
            "Unable to load categories."
          )
        );
      } finally {
        if (initial) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    fetchCategories(true);
  }, [fetchCategories]);

  // ====================================================
  // IMAGE PREVIEW
  // ====================================================

  useEffect(() => {
    if (!(editImage instanceof File)) {
      setImagePreview("");
      return;
    }

    const objectUrl =
      URL.createObjectURL(editImage);

    setImagePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [editImage]);

  // ====================================================
  // GET PARENT NAME
  // ====================================================

  const getParentName = (category) => {
    const parent = category?.parentCategory;

    if (!parent) return "—";

    if (typeof parent === "object") {
      return parent.name || "—";
    }

    const found = categories.find(
      (item) =>
        String(item._id) === String(parent)
    );

    return found?.name || "—";
  };

  // ====================================================
  // SEARCH FILTER
  // ====================================================

  const filteredCategories = useMemo(() => {
    const term = search
      .trim()
      .toLowerCase();

    if (!term) return categories;

    return categories.filter((category) => {
      const parentName =
        getParentName(category);

      const searchableValues = [
        category.name,
        category.description,
        parentName,
        getParentId(category),
        category.status,
      ];

      return searchableValues.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(term)
      );
    });
  }, [categories, search]);

  // ====================================================
  // OPEN EDIT MODAL
  // ====================================================

  const openEdit = (category) => {
    setNotice("");

    setEditingCategory(category);
    setEditName(category.name || "");
    setEditDescription(
      category.description || ""
    );
    setEditParentId(
      getParentId(category)
    );
    setEditStatus(
      category.status || "ACTIVE"
    );

    setEditImage(null);
    setImagePreview("");
  };

  // ====================================================
  // CLOSE EDIT MODAL
  // ====================================================

  const cancelEdit = () => {
    if (saving) return;

    setEditingCategory(null);
    setEditName("");
    setEditDescription("");
    setEditParentId("");
    setEditStatus("ACTIVE");
    setEditImage(null);
    setImagePreview("");
  };

  // ====================================================
  // IMAGE SELECTION
  // ====================================================

  const handleImageChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      setEditImage(null);
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
      setEditImage(null);
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      window.alert(
        "Image size must be 10 MB or less."
      );

      event.target.value = "";
      setEditImage(null);
      return;
    }

    setEditImage(file);
  };

  // ====================================================
  // UPDATE CATEGORY
  // ====================================================

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editingCategory?._id || saving) {
      return;
    }

    if (!editName.trim()) {
      window.alert(
        "Category name is required."
      );
      return;
    }

    if (
      editParentId ===
      String(editingCategory._id)
    ) {
      window.alert(
        "A category cannot be its own parent."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setNotice("");

      // ----------------------------------------------
      // FORM DATA
      // ----------------------------------------------

      const formData = new FormData();

      formData.append(
        "name",
        editName.trim()
      );

      formData.append(
        "description",
        editDescription.trim()
      );

      formData.append(
        "status",
        editStatus
      );

      // Only send parent when changed.
      if (
        editParentId !==
        getParentId(editingCategory)
      ) {
        formData.append(
          "parentCategory",
          editParentId
        );
      }

      // IMPORTANT:
      // Send only actual File objects.
      if (editImage instanceof File) {
        formData.append(
          "image",
          editImage,
          editImage.name
        );
      }

      // ----------------------------------------------
      // DEBUG REQUEST
      // ----------------------------------------------

      console.log(
        "CATEGORY UPDATE ID:",
        editingCategory._id
      );

      for (const [key, value] of formData.entries()) {
        console.log(
          "CATEGORY FORM FIELD:",
          key,
          value
        );
      }

      // ----------------------------------------------
      // API REQUEST
      // ----------------------------------------------

      const response = await updateCategory(
        editingCategory._id,
        formData
      );

      if (
        response?.data?.success === false
      ) {
        throw new Error(
          response.data.message ||
            "Unable to update category."
        );
      }

      const saved =
        response?.data?.data;

      // ----------------------------------------------
      // VERIFY IMAGE UPDATE
      // ----------------------------------------------

      if (editImage instanceof File) {
        if (!saved?.image) {
          throw new Error(
            "Image was not saved. Backend did not return an image path."
          );
        }

        if (
          saved.image ===
          editingCategory.image
        ) {
          throw new Error(
            "Backend returned the old image path. Check req.file and multipart upload."
          );
        }
      }

      // ----------------------------------------------
      // REFRESH IMAGE CACHE
      // ----------------------------------------------

      setImageVersions((previous) => ({
        ...previous,
        [editingCategory._id]:
          Date.now(),
      }));

      setNotice(
        "Category updated successfully."
      );

      setEditingCategory(null);
      setEditImage(null);
      setImagePreview("");

      await fetchCategories();
    } catch (err) {
      console.error(
        "CATEGORY UPDATE ERROR:",
        err?.response?.data || err
      );

      window.alert(
        errorMessage(
          err,
          "Unable to update category."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // DELETE CATEGORY
  // ====================================================

  const handleDelete = async (category) => {
    if (
      !category?._id ||
      deletingId
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${category.name}"?`
      );

    if (!confirmed) return;

    try {
      setDeletingId(category._id);
      setNotice("");

      const response =
        await deleteCategory(
          category._id
        );

      if (
        response?.data?.success === false
      ) {
        throw new Error(
          response.data.message ||
            "Unable to delete category."
        );
      }

      setCategories((previous) =>
        previous.filter(
          (item) =>
            String(item._id) !==
            String(category._id)
        )
      );

      setNotice(
        "Category deleted successfully."
      );
    } catch (err) {
      console.error(
        "CATEGORY DELETE ERROR:",
        err
      );

      window.alert(
        errorMessage(
          err,
          "Unable to delete category."
        )
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="category-list-page">
        <div className="category-loading">
          Loading categories...
        </div>
      </div>
    );
  }

  // ====================================================
  // JSX
  // ====================================================

  return (
    <div className="category-list-page">

      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <div className="category-list-header">
        <div>
          <h1>Categories</h1>

          <p>
            Manage parent categories and
            subcategories.
          </p>
        </div>

        <div className="category-header-actions">
          <button
            type="button"
            className="refresh-category-btn"
            onClick={() => fetchCategories()}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* ============================================= */}
      {/* MESSAGES */}
      {/* ============================================= */}

      {error && (
        <div
          className="category-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {notice && (
        <p role="status">
          {notice}
        </p>
      )}

      {/* ============================================= */}
      {/* SEARCH */}
      {/* ============================================= */}

      <div className="category-toolbar">
        <input
          type="search"
          placeholder="Search category, subcategory or parent..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <span>
          {filteredCategories.length}{" "}
          {filteredCategories.length === 1
            ? "category"
            : "categories"}
        </span>
      </div>

      {/* ============================================= */}
      {/* EMPTY STATE */}
      {/* ============================================= */}

      {!error &&
        filteredCategories.length === 0 && (
          <div className="category-empty">
            <div>📂</div>

            <h2>
              No Categories Found
            </h2>

            <p>
              Create a category first,
              or change your search.
            </p>
          </div>
        )}

      {/* ============================================= */}
      {/* CATEGORY TABLE */}
      {/* ============================================= */}

      {filteredCategories.length > 0 && (
        <div className="category-table-wrapper">
          <table className="category-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Category Name</th>
                <th>Type</th>
                <th>Parent Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map(
                (category, index) => {
                  const isSubcategory =
                    Boolean(
                      getParentId(category)
                    );

                  const currentImage =
                    imageUrl(
                      category.image,
                      imageVersions[
                        category._id
                      ] ||
                        category.updatedAt
                    );

                  return (
                    <tr key={category._id}>
                      <td>
                        {index + 1}
                      </td>

                      {/* IMAGE */}

                      <td>
                        {currentImage ? (
                          <img
                            src={currentImage}
                            alt={
                              category.name
                            }
                            className="category-table-image"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="category-no-image">
                            📁
                          </div>
                        )}
                      </td>

                      {/* NAME */}

                      <td>
                        <div className="category-name-cell">
                          {isSubcategory && (
                            <span className="subcategory-line">
                              ↳
                            </span>
                          )}

                          <strong>
                            {category.name}
                          </strong>
                        </div>
                      </td>

                      {/* TYPE */}

                      <td>
                        <span
                          className={`category-type ${
                            isSubcategory
                              ? "sub"
                              : "parent"
                          }`}
                        >
                          {isSubcategory
                            ? "Subcategory"
                            : "Parent"}
                        </span>
                      </td>

                      {/* PARENT */}

                      <td>
                        {isSubcategory ? (
                          <span className="parent-category-name">
                            {getParentName(
                              category
                            )}
                          </span>
                        ) : (
                          <span className="no-parent">
                            —
                          </span>
                        )}
                      </td>

                      {/* DESCRIPTION */}

                      <td>
                        <span className="category-description">
                          {category.description ||
                            "—"}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`category-status ${String(
                            category.status ||
                              "ACTIVE"
                          ).toLowerCase()}`}
                        >
                          {category.status ||
                            "ACTIVE"}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="category-actions">
                          <button
                            type="button"
                            className="edit-category-btn"
                            onClick={() =>
                              openEdit(category)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-category-btn"
                            disabled={
                              deletingId ===
                              category._id
                            }
                            onClick={() =>
                              handleDelete(
                                category
                              )
                            }
                          >
                            {deletingId ===
                            category._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================= */}
      {/* EDIT MODAL */}
      {/* ============================================= */}

      {editingCategory && (
        <div
          className="category-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              cancelEdit();
            }
          }}
        >
          <form
            className="category-modal"
            onSubmit={handleUpdate}
            role="dialog"
            aria-modal="true"
            aria-label="Edit Category"
          >
            {/* MODAL HEADER */}

            <div className="category-modal-header">
              <div>
                <h2>
                  Edit Category
                </h2>

                <p>
                  Update category information
                  and image.
                </p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={cancelEdit}
              >
                ×
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="category-modal-body">

              {/* NAME */}

              <div className="category-form-group">
                <label htmlFor="category-edit-name">
                  Category Name *
                </label>

                <input
                  id="category-edit-name"
                  required
                  value={editName}
                  onChange={(event) =>
                    setEditName(
                      event.target.value
                    )
                  }
                />
              </div>

              {/* DESCRIPTION */}

              <div className="category-form-group">
                <label htmlFor="category-edit-description">
                  Description
                </label>

                <textarea
                  id="category-edit-description"
                  rows={4}
                  value={editDescription}
                  onChange={(event) =>
                    setEditDescription(
                      event.target.value
                    )
                  }
                />
              </div>

              {/* PARENT CATEGORY */}

              <div className="category-form-group">
                <label htmlFor="category-edit-parent">
                  Parent Category
                </label>

                <select
                  id="category-edit-parent"
                  value={editParentId}
                  onChange={(event) =>
                    setEditParentId(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    No parent (main category)
                  </option>

                  {categories
                    .filter(
                      (category) =>
                        String(
                          category._id
                        ) !==
                          String(
                            editingCategory._id
                          ) &&
                        !getParentId(category)
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

              {/* STATUS */}

              <div className="category-form-group">
                <label htmlFor="category-edit-status">
                  Status
                </label>

                <select
                  id="category-edit-status"
                  value={editStatus}
                  onChange={(event) =>
                    setEditStatus(
                      event.target.value
                    )
                  }
                >
                  <option value="ACTIVE">
                    ACTIVE
                  </option>

                  <option value="INACTIVE">
                    INACTIVE
                  </option>
                </select>
              </div>

              {/* IMAGE */}

              <div className="category-form-group">
                <label htmlFor="category-edit-image">
                  Replace Image (optional)
                </label>

                <input
                  id="category-edit-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handleImageChange
                  }
                />

                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  {(imagePreview ||
                    editingCategory.image) && (
                    <img
                      src={
                        imagePreview ||
                        imageUrl(
                          editingCategory.image,
                          imageVersions[
                            editingCategory._id
                          ] ||
                            editingCategory.updatedAt
                        )
                      }
                      alt="Category preview"
                      style={{
                        width: 130,
                        height: 110,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  )}

                  {editImage && (
                    <p
                      style={{
                        fontSize: 12,
                      }}
                    >
                      New image:{" "}
                      {editImage.name}
                    </p>
                  )}

                  {!editImage &&
                    editingCategory.image && (
                      <p
                        style={{
                          fontSize: 12,
                        }}
                      >
                        Current image
                        (choose a file to
                        replace it)
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="category-modal-footer">
              <button
                type="button"
                className="modal-cancel-btn"
                disabled={saving}
                onClick={cancelEdit}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="modal-save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
