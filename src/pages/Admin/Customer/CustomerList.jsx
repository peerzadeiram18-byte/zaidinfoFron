// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./CustomerList.css";
// import { toast } from "react-toastify";
// const API_URL = import.meta.env.VITE_API_URL;


// function CustomerList() {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     getCustomers();
//   }, []);

//   const getCustomers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       // const res = await axios.get("http://localhost:5000/api/users", {
//       //   headers: {
//       //     Authorization: `Bearer ${token}`,
//       //   },
//       // });

//       // Filter only users with role "CUSTOMER"
      
// const res = await axios.get(
//   `${API_URL}/users`,
//   {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   }
// );  
      
//       const userList = res.data?.users || res.data || [];
//       const onlyCustomers = userList.filter(
//         (item) => item.role === "CUSTOMER" || item.role === "customer"
//       );

//       setCustomers(onlyCustomers);
//       setError("");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Failed to fetch customer data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter customers by search term
//   const filteredCustomers = customers.filter((customer) => {
//     const fullName = `${customer.firstName || ""} ${customer.lastName || ""}`.toLowerCase();
//     const email = (customer.email || "").toLowerCase();
//     const phone = (customer.phone || "").toLowerCase();
//     const query = searchTerm.toLowerCase();

//     return fullName.includes(query) || email.includes(query) || phone.includes(query);
//   });

//   return (
//     <div className="customer-list-container">
//       <div className="customer-card">
        
//         {/* Header Section */}
//         <div className="card-header">
//           <div>
//             <h2>Customer Directory</h2>
//             <p>View and manage all registered customers.</p>
//           </div>
//           <span className="customer-badge">{filteredCustomers.length} Total</span>
//         </div>

//         {/* Toolbar Section */}
//         <div className="toolbar">
//           <input
//             type="text"
//             className="search-input"
//             placeholder="Search by name, email, or phone..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <button className="refresh-btn" onClick={getCustomers} disabled={loading}>
//             {loading ? "Refreshing..." : "Refresh List"}
//           </button>
//         </div>

//         {/* Error Alert */}
//         {error && <div className="alert-error">{error}</div>}

//         {/* Table Content */}
//         <div className="table-wrapper">
//           {loading ? (
//             <div className="loading-state">
//               <div className="spinner"></div>
//               <p>Loading customers...</p>
//             </div>
//           ) : filteredCustomers.length === 0 ? (
//             <div className="empty-state">
//               <p>No customers found.</p>
//             </div>
//           ) : (
//             <table className="custom-table">
//               <thead>
//                 <tr>
//                   <th>Customer Name</th>
//                   <th>Email Address</th>
//                   <th>Phone Number</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredCustomers.map((item) => (
//                   <tr key={item._id}>
//                     <td>
//                       <div className="user-avatar-group">
//                         <div className="avatar">
//                           {(item.firstName?.[0] || item.email?.[0] || "C").toUpperCase()}
//                         </div>
//                         <span className="user-name">
//                           {item.firstName || item.lastName
//                             ? `${item.firstName || ""} ${item.lastName || ""}`.trim()
//                             : item.name || "N/A"}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="text-muted">{item.email}</td>
//                     <td className="text-muted">{item.phone || "N/A"}</td>
//                     <td>
//                       <span className={`status-pill ${item.isVerified ? "active" : "pending"}`}>
//                         {item.isVerified ? "Active" : "Pending"}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }

// export default CustomerList;



import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerList.css";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userList = res.data?.users || res.data || [];

      const onlyCustomers = userList.filter(
        (item) =>
          item.role?.toUpperCase() === "CUSTOMER"
      );

      setCustomers(onlyCustomers);
    } catch (err) {
      console.error("Customer fetch error:", err);

      const message =
        err.response?.data?.message ||
        "Failed to fetch customer data.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${
      customer.firstName || ""
    } ${customer.lastName || ""}`.toLowerCase();

    const email = (customer.email || "").toLowerCase();
    const phone = (customer.phone || "").toLowerCase();
    const query = searchTerm.toLowerCase().trim();

    return (
      fullName.includes(query) ||
      email.includes(query) ||
      phone.includes(query)
    );
  });

  const getCustomerName = (customer) => {
    if (customer.firstName || customer.lastName) {
      return `${customer.firstName || ""} ${
        customer.lastName || ""
      }`.trim();
    }

    return customer.name || "N/A";
  };

  const getInitial = (customer) => {
    return (
      customer.firstName?.[0] ||
      customer.name?.[0] ||
      customer.email?.[0] ||
      "C"
    ).toUpperCase();
  };

  return (
    <div className="customer-list-container">
      <div className="customer-card">

        {/* Page Header */}
        <div className="customer-page-header">
          <div className="customer-heading-content">
            <div className="customer-heading-icon">
              <i className="fas fa-users" />
            </div>

            <div>
              <span className="customer-eyebrow">
                CUSTOMER MANAGEMENT
              </span>

              <h2>Customer Directory</h2>

              <p>
                Manage and monitor all your registered customers
                from one place.
              </p>
            </div>
          </div>

          <div className="customer-header-stats">
            <span className="stats-label">
              TOTAL CUSTOMERS
            </span>

            <div className="stats-value">
              {customers.length.toString().padStart(2, "0")}
            </div>

            <span className="stats-indicator">
              <span className="stats-dot" />
              Registered users
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="customer-toolbar">

          <div className="customer-search-wrapper">
            <i className="fas fa-search search-icon" />

            <input
              type="text"
              className="customer-search-input"
              placeholder="Search customers by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <i className="fas fa-times" />
              </button>
            )}
          </div>

          <button
            className="customer-refresh-btn"
            onClick={getCustomers}
            disabled={loading}
          >
            <i className={`fas fa-sync-alt ${
              loading ? "refresh-spinning" : ""
            }`} />

            <span>
              {loading ? "Refreshing..." : "Refresh"}
            </span>
          </button>
        </div>

        {/* Table Information */}
        <div className="customer-table-info">
          <div>
            <h3>All Customers</h3>
            <p>
              Showing {filteredCustomers.length} of {customers.length} customers
            </p>
          </div>

          <span className="customer-results-badge">
            {filteredCustomers.length} RESULTS
          </span>
        </div>

        {/* Table */}
        <div className="customer-table-container">

          {loading ? (
            <div className="customer-loading-state">
              <div className="customer-loader" />
              <h4>Loading customers</h4>
              <p>Please wait while we fetch customer information.</p>
            </div>
          ) : error && customers.length === 0 ? (
            <div className="customer-empty-state">
              <div className="empty-icon error-icon">
                <i className="fas fa-exclamation-triangle" />
              </div>

              <h3>Unable to load customers</h3>
              <p>{error}</p>

              <button
                className="customer-retry-btn"
                onClick={getCustomers}
              >
                <i className="fas fa-redo" />
                Try Again
              </button>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="customer-empty-state">
              <div className="empty-icon">
                <i className="fas fa-user-slash" />
              </div>

              <h3>No customers found</h3>

              <p>
                {searchTerm
                  ? "Try searching with a different name, email or phone number."
                  : "There are no registered customers yet."}
              </p>

              {searchTerm && (
                <button
                  className="customer-retry-btn"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="customer-table-scroll">
              <table className="customer-modern-table">

                <thead>
                  <tr>
                    <th className="customer-name-column">
                      CUSTOMER
                    </th>
                    <th>EMAIL ADDRESS</th>
                    <th>PHONE NUMBER</th>
                    <th>ACCOUNT STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((item) => (
                    <tr key={item._id}>

                      {/* Customer */}
                      <td>
                        <div className="customer-profile">
                          <div className="customer-avatar">
                            {getInitial(item)}
                          </div>

                          <div className="customer-profile-details">
                            <span className="customer-full-name">
                              {getCustomerName(item)}
                            </span>

                            <span className="customer-id">
                              ID: {item._id?.slice(-8).toUpperCase() || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td>
                        <div className="customer-contact">
                          <i className="far fa-envelope" />
                          <span>{item.email || "N/A"}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td>
                        <div className="customer-contact">
                          <i className="fas fa-phone-alt" />
                          <span>{item.phone || "N/A"}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`customer-status ${
                            item.isVerified ? "verified" : "unverified"
                          }`}
                        >
                          <span className="status-dot" />
                          {item.isVerified ? "Active" : "Pending"}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && filteredCustomers.length > 0 && (
          <div className="customer-table-footer">
            <span>
              Displaying <strong>{filteredCustomers.length}</strong> customer
              {filteredCustomers.length !== 1 ? "s" : ""}
            </span>

            <span className="customer-footer-secure">
              <i className="fas fa-shield-alt" />
              Customer data is protected
            </span>
          </div>
        )}

      </div>
    </div>
  );
}

export default CustomerList;