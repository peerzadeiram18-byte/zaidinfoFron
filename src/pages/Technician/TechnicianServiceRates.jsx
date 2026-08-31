import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaEdit, FaTools, FaClock } from "react-icons/fa";
import EditServiceModal from "./EditServiceModal";
import "./TechnicianServiceRates.css";

const CATEGORIES = [
  "Hardware Repair",
  "Hardware Replacement",
  "Software & OS",
  "Maintenance",
  "Diagnostics",
];

const API_BASE = "http://localhost:5000/api/repair-service";

export default function TechnicianServiceRates() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    serviceName: "",
    category: "Hardware Repair",
    partCost: "",
    laborCost: "",
    estimatedTime: "1-2 hours",
    description: "",
  });

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE}/get-services`, getHeaders());
      setServices(res.data?.services || res.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to load service charges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        partCost: Number(formData.partCost) || 0,
        laborCost: Number(formData.laborCost) || 0,
      };

      const res = await axios.post(`${API_BASE}/create-service`, payload, getHeaders());
      const newService = res.data?.service || res.data;

      if (newService) {
        setServices((prev) => [...prev, newService]);
      } else {
        fetchServices();
      }

      setFormData({
        serviceName: "",
        category: "Hardware Repair",
        partCost: "",
        laborCost: "",
        estimatedTime: "1-2 hours",
        description: "",
      });
      alert("Service rate saved successfully!");
    } catch (err) {
      console.error("Create Error:", err);
      alert(err.response?.data?.message || "Failed to add service rate.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this rate card item?")) return;
    try {
      await axios.delete(`${API_BASE}/delete-service/${id}`, getHeaders());
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
      alert(err.response?.data?.message || "Failed to delete service rate.");
    }
  };

  const handleEditClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleServiceUpdated = (updated) => {
    setServices((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
  };

  return (
    <div className="sr-page-wrapper">
      {/* Create Form Card */}
      <div className="sr-card sr-form-container">
        <div className="sr-card-header">
          <div className="sr-icon-badge">
            <FaTools />
          </div>
          <div>
            <h3>Add Service Rate & Labour Charge</h3>
            <p className="sr-subtitle">Configure standardized part & labor rates for front desk estimations</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="sr-form-grid">
          <div className="sr-form-group">
            <label>Service Title</label>
            <input
              type="text"
              name="serviceName"
              placeholder="e.g. Keyboard Replacement, RAM Upgrade"
              value={formData.serviceName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="sr-form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="sr-form-group">
            <label>Part Cost ($)</label>
            <input
              type="number"
              name="partCost"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.partCost}
              onChange={handleChange}
            />
          </div>

          <div className="sr-form-group">
            <label>Labour Cost ($)</label>
            <input
              type="number"
              name="laborCost"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.laborCost}
              onChange={handleChange}
              required
            />
          </div>

          <div className="sr-form-group">
            <label>Estimated Time</label>
            <input
              type="text"
              name="estimatedTime"
              placeholder="e.g. 45 mins, 1-2 hours"
              value={formData.estimatedTime}
              onChange={handleChange}
            />
          </div>

          <div className="sr-form-group sr-col-span-full">
            <label>Description / Technical Scope</label>
            <input
              type="text"
              name="description"
              placeholder="e.g. Involves opening chassis and replacing unit"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="sr-col-span-full">
            <button type="submit" className="sr-btn-primary">
              <FaPlus /> Save Service Rate
            </button>
          </div>
        </form>
      </div>

      {/* Table Card */}
      <div className="sr-card sr-table-container">
        <div className="sr-table-header">
          <div>
            <h3>Current Standard Rates</h3>
            <p className="sr-subtitle">All active repair rates visible to reception</p>
          </div>
          <span className="sr-count-badge">{services.length} Services Active</span>
        </div>

        {error && <div className="sr-error-banner">{error}</div>}

        {loading ? (
          <div className="sr-loading-state">Loading service catalog...</div>
        ) : (
          <div className="sr-table-responsive">
            <table className="sr-data-table">
              <thead>
                <tr>
                  <th>Service Details</th>
                  <th>Category</th>
                  <th>Part Cost</th>
                  <th>Labour Cost</th>
                  <th>Total Cost</th>
                  <th>Est. Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="sr-empty-state">
                      No standard service rates found. Add one above.
                    </td>
                  </tr>
                ) : (
                  services.map((item) => {
                    const total =
                      item.totalCost !== undefined
                        ? item.totalCost
                        : (Number(item.partCost) || 0) + (Number(item.laborCost) || 0);

                    return (
                      <tr key={item._id}>
                        <td>
                          <div className="sr-service-title">{item.serviceName}</div>
                          {item.description && (
                            <div className="sr-service-desc">{item.description}</div>
                          )}
                        </td>
                        <td>
                          <span className="sr-category-chip">{item.category}</span>
                        </td>
                        <td className="sr-cost-dim">${Number(item.partCost || 0).toFixed(2)}</td>
                        <td className="sr-cost-dim">${Number(item.laborCost || 0).toFixed(2)}</td>
                        <td className="sr-cost-total">${Number(total).toFixed(2)}</td>
                        <td>
                          <span className="sr-time-indicator">
                            <FaClock /> {item.estimatedTime || "1-2 hours"}
                          </span>
                        </td>
                        <td className="sr-action-buttons">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="sr-btn-edit"
                            title="Edit Service"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="sr-btn-delete"
                            title="Remove Service"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal Component */}
      <EditServiceModal
        isOpen={isModalOpen}
        service={selectedService}
        onClose={() => setIsModalOpen(false)}
        onServiceUpdated={handleServiceUpdated}
      />
    </div>
  );
}