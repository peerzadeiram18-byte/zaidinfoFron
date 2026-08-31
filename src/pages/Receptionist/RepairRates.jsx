import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RepairRates.css';

const REPAIR_RATE_URL = 'http://localhost:5000/api/repair-service';

const RepairRates = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${REPAIR_RATE_URL}/get-services`, getHeaders());
      setServices(res.data?.services || res.data || []);
    } catch (err) {
      console.log("Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to load service charges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter((item) =>
    (item.name || item.serviceName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (item.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="table-wrapper">
      <div className="table-card">
        {/* Header Section */}
        <div className="table-header">
          <div>
            <h2 className="table-title">Repair Service Rates</h2>
            <p className="table-subtitle">Overview of standard repair charges and estimated durations</p>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search service or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* State Indicators */}
        {loading && (
          <div className="state-container">
            <div className="spinner"></div>
            <p>Loading repair rates...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={fetchServices} className="retry-btn">Retry</button>
          </div>
        )}

       {/* Table Content */}
{!loading && !error && (
  <div className="responsive-table-container">
    <table className="modern-table">
      <thead>
        <tr>
          <th>Service Details</th>
          <th>Category</th>
          <th>Est. Time</th>
          <th>Status</th>
          <th className="cost-column">Labor Cost</th>
          <th className="cost-column">Part Cost</th>
          <th className="cost-column total-column">Total Cost</th>
        </tr>
      </thead>

      <tbody>
        {filteredServices.length > 0 ? (
          filteredServices.map((service, index) => (
            <tr key={service._id || service.id || index}>

              {/* Service */}
              <td data-label="Service">
                <div className="service-info">
                  <span className="service-name">
                    {service.name ||
                      service.serviceName ||
                      "Standard Repair"}
                  </span>

                  <span className="service-desc">
                    {service.description ||
                      "General diagnosis & fix"}
                  </span>
                </div>
              </td>

              {/* Category */}
              <td data-label="Category">
                <span className="category-tag">
                  {service.category || "General"}
                </span>
              </td>

              {/* Estimated Time */}
              <td data-label="Est. Time">
                <span className="time-badge">
                  {service.estimatedTime || "1-2 hrs"}
                </span>
              </td>

              {/* Status */}
              <td data-label="Status">
                <span
                  className={`status-pill ${
                    service.status === "Inactive"
                      ? "inactive"
                      : "active"
                  }`}
                >
                  {service.status || "Available"}
                </span>
              </td>

              {/* Labor Cost */}
              <td
                data-label="Labor Cost"
                className="cost-column"
              >
                <span className="labor-cost">
                  ₹{Number(service.laborCost || 0).toFixed(2)}
                </span>
              </td>

              {/* Part Cost */}
              <td
                data-label="Part Cost"
                className="cost-column"
              >
                <span className="part-cost">
                  ₹{Number(service.partCost || 0).toFixed(2)}
                </span>
              </td>

              {/* Total Cost */}
              <td
                data-label="Total Cost"
                className="cost-column total-column"
              >
                <span className="total-cost">
                  ₹{Number(
                    service.totalCost ||
                    (Number(service.laborCost || 0) +
                      Number(service.partCost || 0))
                  ).toFixed(2)}
                </span>
              </td>

            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="empty-message">
              No repair services found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)}
      </div>
    </div>
  );
};

export default RepairRates;