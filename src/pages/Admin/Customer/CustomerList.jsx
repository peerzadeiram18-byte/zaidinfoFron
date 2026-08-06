// // import { useEffect, useState } from "react";
// // import axios from "axios";

// // function CustomerList() {

// //   const [customers, setCustomers] = useState([]);

// //   useEffect(() => {
// //     getCustomers();
// //   }, []);

// //   const getCustomers = async () => {
// //     try {

// //       const token = localStorage.getItem("token");

// //       const res = await axios.get(
// //         "http://localhost:5000/api/users",
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       const onlyCustomers = res.data.users.filter(
// //         (item) => item.role === "CUSTOMER"
// //       );

// //       setCustomers(onlyCustomers);

// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Customers</h2>

// //       <table border="1" cellPadding="10">

// //         <thead>
// //           <tr>
// //             <th>Name</th>
// //             <th>Email</th>
// //             <th>Phone</th>
// //           </tr>
// //         </thead>

// //         <tbody>

// //           {customers.map((item) => (

// //             <tr key={item._id}>
// //               <td>{item.firstName} {item.lastName}</td>
// //               <td>{item.email}</td>
// //               <td>{item.phone}</td>
// //             </tr>

// //           ))}

// //         </tbody>

// //       </table>

// //     </div>
// //   );
// // }

// // export default CustomerList;


// import { useEffect, useState } from "react";
// import axios from "axios";

// const API = import.meta.env.VITE_API_URL;

// function CustomerList() {
//   const [customers, setCustomers] = useState([]);

//   useEffect(() => {
//     getCustomers();
//   }, []);

//   const getCustomers = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `${API}/users`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const onlyCustomers = res.data.users.filter(
//         (item) => item.role === "CUSTOMER"
//       );

//       setCustomers(onlyCustomers);

//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div>
//       <h2>Customers</h2>

//       <table border="1" cellPadding="10">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Phone</th>
//           </tr>
//         </thead>

//         <tbody>
//           {customers.map((item) => (
//             <tr key={item._id}>
//               <td>{item.firstName} {item.lastName}</td>
//               <td>{item.email}</td>
//               <td>{item.phone}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default CustomerList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerList.css";
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
      const token = localStorage.getItem("token");

      // const res = await axios.get("http://localhost:5000/api/users", {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      // Filter only users with role "CUSTOMER"
      
const res = await axios.get(
  `${API_URL}/users`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);  
      
      const userList = res.data?.users || res.data || [];
      const onlyCustomers = userList.filter(
        (item) => item.role === "CUSTOMER" || item.role === "customer"
      );

      setCustomers(onlyCustomers);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch customer data.");
    } finally {
      setLoading(false);
    }
  };

  // Filter customers by search term
  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.firstName || ""} ${customer.lastName || ""}`.toLowerCase();
    const email = (customer.email || "").toLowerCase();
    const phone = (customer.phone || "").toLowerCase();
    const query = searchTerm.toLowerCase();

    return fullName.includes(query) || email.includes(query) || phone.includes(query);
  });

  return (
    <div className="customer-list-container">
      <div className="customer-card">
        
        {/* Header Section */}
        <div className="card-header">
          <div>
            <h2>Customer Directory</h2>
            <p>View and manage all registered customers.</p>
          </div>
          <span className="customer-badge">{filteredCustomers.length} Total</span>
        </div>

        {/* Toolbar Section */}
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="refresh-btn" onClick={getCustomers} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh List"}
          </button>
        </div>

        {/* Error Alert */}
        {error && <div className="alert-error">{error}</div>}

        {/* Table Content */}
        <div className="table-wrapper">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="empty-state">
              <p>No customers found.</p>
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Email Address</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="user-avatar-group">
                        <div className="avatar">
                          {(item.firstName?.[0] || item.email?.[0] || "C").toUpperCase()}
                        </div>
                        <span className="user-name">
                          {item.firstName || item.lastName
                            ? `${item.firstName || ""} ${item.lastName || ""}`.trim()
                            : item.name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="text-muted">{item.email}</td>
                    <td className="text-muted">{item.phone || "N/A"}</td>
                    <td>
                      <span className={`status-pill ${item.isVerified ? "active" : "pending"}`}>
                        {item.isVerified ? "Active" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

export default CustomerList;