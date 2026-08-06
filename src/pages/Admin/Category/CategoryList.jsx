// import { useEffect,useState } from "react";

// import { getCategories } from "../../../services/categoryService";

// import "./CategoryList.css";

// const SERVER_URL = import.meta.env.VITE_API_URL.replace("/api", "");

// function CategoryList(){

// const [categories,setCategories]=useState([]);

// useEffect(()=>{

// loadCategories();

// },[]);

// const loadCategories=async()=>{

// try{

// const res=await getCategories();

// setCategories(res.data.data);

// }

// catch(error){

// console.log(error);

// }

// };

// return(

// <div className="category-list-page">

// <h2>Category List</h2>

// <table>

// <thead>

// <tr>

// <th>Name</th>

// <th>Image</th>

// <th>Description</th>

// <th>Status</th>

// </tr>

// </thead>

// <tbody>

// {

// categories.length===0?

// (

// <tr>

// <td colSpan="4">

// No Category Found

// </td>

// </tr>

// )

// :

// categories.map(category=>(

// <tr key={category._id}>

// <td>{category.name}</td>
// <td>

//   {category.image ? (

//     <img
//       // src={`http://localhost:5000${category.image}`}

//       src={`${SERVER_URL}${category.image}`}
//       alt={category.name}
//       className="category-image"
//       onError={(e) => {
//         e.target.src =
//           "https://via.placeholder.com/120x120?text=No+Image";
//       }}
//     />

//   ) : (

//     "No Image"

//   )}

// </td>

// <td>{category.description}</td>

// <td>{category.status}</td>

// </tr>

// ))

// }

// </tbody>

// </table>

// </div>

// );

// }

// export default CategoryList;


import { useEffect, useState } from "react";
import { getCategories } from "../../../services/categoryService";
import "./CategoryList.css";
const API_URL = import.meta.env.VITE_API_URL;


function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      // Gracefully handle nested data structures
      setCategories(res?.data?.data || res?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories by search input
  const filteredCategories = categories.filter((cat) => {
    const name = (cat.name || "").toLowerCase();
    const description = (cat.description || "").toLowerCase();
    const query = searchTerm.toLowerCase();

    return name.includes(query) || description.includes(query);
  });

  return (
    <div className="category-list-container">
      <div className="category-card">
        
        {/* Header Section */}
        <div className="card-header">
          <div>
            <h2>Category Directory</h2>
            <p>Manage product categories, media, and visibility status.</p>
          </div>
          <span className="category-badge">{filteredCategories.length} Categories</span>
        </div>

        {/* Toolbar Section */}
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search categories by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="refresh-btn" onClick={loadCategories} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Table Content */}
        <div className="table-wrapper">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="empty-state">
              <p>No categories found.</p>
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => {
                  // const imageUrl = category.image
                  //   ? category.image.startsWith("http")
                  //     ? category.image
                  //     : `http://localhost:5000${category.image}`
                  //   : null;
                  const imageUrl = category.image
  ? category.image.startsWith("http")
    ? category.image
    : `${import.meta.env.VITE_API_URL}${category.image}`
  : null;

                  return (
                    <tr key={category._id}>
                      <td className="image-cell">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={category.name}
                            className="category-thumbnail"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/80x80?text=No+Img";
                            }}
                          />
                        ) : (
                          <div className="no-image-placeholder">No Image</div>
                        )}
                      </td>
                      <td className="category-name">{category.name}</td>
                      <td className="text-muted description-cell">
                        {category.description || "No description provided."}
                      </td>
                      <td>
                        <span
                          className={`status-pill ${
                            category.status === "ACTIVE" || category.status === "Active"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {category.status || "ACTIVE"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

export default CategoryList;