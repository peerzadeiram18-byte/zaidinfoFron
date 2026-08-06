// import { useEffect, useState } from "react";
// import { getBrands } from "../../../services/brandService";
// import "./BrandList.css";

// const SERVER_URL = import.meta.env.VITE_API_URL.replace("/api", "");


// function BrandList() {

//   const [brands, setBrands] = useState([]);

//   useEffect(() => {

//     loadBrands();

//   }, []);

//   const loadBrands = async () => {

//     try {

//       const res = await getBrands();

//       setBrands(res.data.data);

//     } catch (error) {

//       console.log(error);

//     }

//   };

//   return (

//     <div className="brand-list-page">

//       <h2>Brand List</h2>

//       <table>

//         <thead>

//           <tr>

//             <th>Logo</th>

//             <th>Name</th>

//             <th>Category</th>

//             <th>Status</th>

//           </tr>

//         </thead>

//         <tbody>

//           {

//             brands.length === 0 ?

//             (

//               <tr>

//                 <td colSpan="4">

//                   No Brand Found

//                 </td>

//               </tr>

//             )

//             :

//             brands.map((brand) => (

//               <tr key={brand._id}>

//                 <td>

//                   {

//                     brand.logo ?

//                     <img
//                       // src={`http://localhost:5000${brand.logo}`}
//                          src={`${SERVER_URL}${brand.logo}`}                     
//                       alt={brand.name}
//                       className="brand-logo"
//                       onError={(e) => {
//                         e.target.src =
//                           "https://placehold.co/100x100?text=No+Image";
//                       }}
//                     />

//                     :

//                     "No Image"

//                   }

//                 </td>

//                 <td>{brand.name}</td>

//                 <td>{brand.category?.name}</td>

//                 <td>{brand.status}</td>

//               </tr>

//             ))

//           }

//         </tbody>

//       </table>

//     </div>

//   );

// }

// export default BrandList;


import { useEffect, useState } from "react";
import { createBrand } from "../../../services/brandService";
import { getBrands } from "../../../services/brandService";
import "./BrandList.css";

const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

// const BASE_URL = API_URL.replace("/api", "");


function BrandList() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const res = await getBrands();
      // Safely access array data
      setBrands(res?.data?.data || res?.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search filter implementation
  const filteredBrands = brands.filter((brand) => {
    const name = (brand.name || "").toLowerCase();
    const categoryName = (brand.category?.name || "").toLowerCase();
    const query = searchTerm.toLowerCase();

    return name.includes(query) || categoryName.includes(query);
  });

  return (
    <div className="brand-list-container">
      <div className="brand-card">
        {/* Header Section */}
        <div className="card-header">
          <div>
            <h2>Brand Directory</h2>
            <p>Manage product brands, logos, and category associations.</p>
          </div>
          <span className="brand-badge">{filteredBrands.length} Brands</span>
        </div>

        {/* Toolbar Section */}
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search brands by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="refresh-btn" onClick={loadBrands} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Table Wrapper */}
        <div className="table-wrapper">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
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
                </tr>
              </thead>
              <tbody>
                {filteredBrands.map((brand) => {
                  // const logoUrl = brand.logo
                  //   ? brand.logo.startsWith("http")
                  //     ? brand.logo
                  //     : `http://localhost:5000${brand.logo}`
                  //   : null;


                  const logoUrl = brand.logo
  ? brand.logo.startsWith("http")
    ? brand.logo
    : `${BASE_URL}${brand.logo}`
  : null;


                  return (
                    <tr key={brand._id}>
                      <td className="logo-cell">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={brand.name}
                            className="brand-logo"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/100x100?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="no-logo-placeholder">No Image</div>
                        )}
                      </td>
                      <td className="brand-name">{brand.name}</td>
                      <td className="category-cell">
                        {brand.category?.name ? (
                          <span className="category-pill">{brand.category.name}</span>
                        ) : (
                          <span className="text-muted">Uncategorized</span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`status-pill ${
                            brand.status === "ACTIVE" || brand.status === "Active"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {brand.status || "ACTIVE"}
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

export default BrandList;