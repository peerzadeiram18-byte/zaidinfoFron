import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes, FaSave } from "react-icons/fa";

const CATEGORIES = [
  "Hardware Repair",
  "Hardware Replacement",
  "Software & OS",
  "Maintenance",
  "Diagnostics",
];

const API_BASE = "http://localhost:5000/api/repair-service";

export default function EditServiceModal({ isOpen, service, onClose, onServiceUpdated }) {
  const [formData, setFormData] = useState({
    serviceName: "",
    category: "Hardware Repair",
    partCost: "",
    laborCost: "",
    estimatedTime: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        serviceName: service.serviceName || "",
        category: service.category || "Hardware Repair",
        partCost: service.partCost !== undefined ? service.partCost : "",
        laborCost: service.laborCost !== undefined ? service.laborCost : "",
        estimatedTime: service.estimatedTime || "1-2 hours",
        description: service.description || "",
      });
    }
  }, [service]);

  if (!isOpen || !service) return null;

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        partCost: Number(formData.partCost) || 0,
        laborCost: Number(formData.laborCost) || 0,
      };

      const res = await axios.put(
        `${API_BASE}/update-service/${service._id}`,
        payload,
        getHeaders()
      );

      const updatedService = res.data?.service || res.data;
      onServiceUpdated(updatedService);
      onClose();
    } catch (err) {
      console.error("Update Error:", err);
      alert(err.response?.data?.message || "Failed to update service rate.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sr-modal-overlay">
      <div className="sr-modal-card">
        <div className="sr-modal-header">
          <h3>Edit Service Rate</h3>
          <button type="button" className="sr-btn-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="sr-form-grid">
          <div className="sr-form-group">
            <label>Service Title</label>
            <input
              type="text"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="sr-form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
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
              value={formData.estimatedTime}
              onChange={handleChange}
            />
          </div>

          <div className="sr-form-group sr-col-span-full">
            <label>Description / Technical Scope</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="sr-modal-actions sr-col-span-full">
            <button type="button" className="sr-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="sr-btn-primary" disabled={submitting}>
              <FaSave /> {submitting ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}