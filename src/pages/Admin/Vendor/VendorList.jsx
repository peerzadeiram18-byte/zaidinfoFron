import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./VendorList.css";


// ======================================================
// API BASE
// Keep this in sync with AddVendor.jsx — move both to a
// shared config/service file once you have one.
// ======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";


function VendorList() {

  const navigate = useNavigate();


  // ====================================================
  // STATE
  // ====================================================

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");


  // ====================================================
  // LOAD VENDORS
  // ====================================================

  const loadVendors = async () => {

    setLoading(true);
    setError("");

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/procurement/vendors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load vendors"
        );
      }

      setVendors(result.data || []);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadVendors();
  }, []);


  // ====================================================
  // FILTER (client-side, by name/phone/email/city)
  // ====================================================

  const filteredVendors = vendors.filter((vendor) => {

    if (!search.trim()) {
      return true;
    }

    const term = search.trim().toLowerCase();

    return (
      vendor.vendorName?.toLowerCase().includes(term) ||
      vendor.phone?.toLowerCase().includes(term) ||
      vendor.email?.toLowerCase().includes(term) ||
      vendor.city?.toLowerCase().includes(term)
    );
  });


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="vendor-list-page">

      <div className="vendor-list-header">
        <div>
          <h2>Vendors</h2>
          <p>All vendors you can place purchase orders with</p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => navigate("/add-vendor")}
        >
          + Add Vendor
        </button>
      </div>

      <div className="vendor-list-toolbar">
        <input
          type="text"
          placeholder="Search by name, phone, email or city..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading && (
        <div className="vendor-list-state">Loading vendors...</div>
      )}

      {!loading && error && (
        <div className="vendor-list-state error">{error}</div>
      )}

      {!loading && !error && filteredVendors.length === 0 && (
        <div className="vendor-list-state">
          {vendors.length === 0
            ? "No vendors added yet."
            : "No vendors match your search."}
        </div>
      )}

      {!loading && !error && filteredVendors.length > 0 && (
        <div className="vendor-table-wrapper">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Email</th>
                <th>City</th>
                <th>GST Number</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor) => (
                <tr
                  key={vendor._id}
                  onClick={() =>
                    navigate(`/vendors/${vendor._id}`)
                  }
                >
                  <td className="vendor-name-cell">
                    {vendor.vendorName}
                  </td>
                  <td>{vendor.contactPerson || "—"}</td>
                  <td>{vendor.phone}</td>
                  <td>{vendor.email || "—"}</td>
                  <td>{vendor.city || "—"}</td>
                  <td>{vendor.gstNumber || "—"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        vendor.isActive ? "active" : "inactive"
                      }`}
                    >
                      {vendor.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}


export default VendorList;
