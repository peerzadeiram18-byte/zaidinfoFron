import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiAlertTriangle,
  FiCheckCircle,
  FiBox,
  FiDollarSign,
  FiLayers,
  FiRefreshCw,
  FiX,
  FiLink,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "./InventoryManagement.css";

const API_PARTS = "http://localhost:5000/api/repairInventory";
const API_REPAIRS = "http://localhost:5000/api/newRepair";

const CATEGORIES = [
  "Display / Screen",
  "Battery",
  "Motherboard / IC",
  "Storage / RAM",
  "Keyboard / Touchpad",
  "Cables / Ports",
  "Other",
];

const initialForm = {
  partName: "",
  partSku: "",
  category: "Display / Screen",
  compatibleModels: "",
  purchaseCost: "",
  sellingPrice: "",
  stockQuantity: "",
  minThreshold: 3,
  locationBin: "RACK-A1",
};

export default function InventoryManagement() {
  const [parts, setParts] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Modal States
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  // Consume / Attach to Device Modal State
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [selectedPartForDevice, setSelectedPartForDevice] = useState(null);
  const [selectedRepairId, setSelectedRepairId] = useState("");
  const [consumeQty, setConsumeQty] = useState(1);
  const [attaching, setAttaching] = useState(false);

  const token = localStorage.getItem("token");
  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resParts, resRepairs] = await Promise.all([
        axios.get(API_PARTS, getAuthConfig()),
        axios.get(`${API_REPAIRS}/`, getAuthConfig()),
      ]);

      setParts(resParts.data?.parts || []);
      console.log(resParts.data?.parts ,"All Parts")
      const repairsList = resRepairs.data?.repairs || resRepairs.data?.data || [];
      // Only show active customer repair jobs
      setRepairs(repairsList.filter((r) => !["completed", "delivered", "cancelled"].includes(String(r.status || "").toLowerCase())));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setShowFormModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (part) => {
    setEditingId(part._id);
    setFormData({
      partName: part.partName,
      partSku: part.partSku,
      category: part.category,
      compatibleModels: Array.isArray(part.compatibleModels) ? part.compatibleModels.join(", ") : part.compatibleModels,
      purchaseCost: part.purchaseCost,
      sellingPrice: part.sellingPrice,
      stockQuantity: part.stockQuantity,
      minThreshold: part.minThreshold,
      locationBin: part.locationBin,
    });
    setShowFormModal(true);
  };

  // Handle Form Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        await axios.put(`${API_PARTS}/${editingId}`, formData, getAuthConfig());
        toast.success("Part details updated successfully");
      } else {
        await axios.post(API_PARTS, formData, getAuthConfig());
        toast.success("New spare part registered");
      }
      setShowFormModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Part
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this part permanently?")) return;
    try {
      await axios.delete(`${API_PARTS}/${id}`, getAuthConfig());
      toast.success("Component deleted from inventory");
      setParts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // Open Attach to Device Modal
  const handleOpenAttach = (part) => {
    setSelectedPartForDevice(part);
    setConsumeQty(1);
    setSelectedRepairId(repairs[0]?._id || "");
    setShowAttachModal(true);
  };

  // Execute Stock Decrement & Customer Billing injection
  const handleExecuteAttach = async (e) => {
    e.preventDefault();
    if (!selectedRepairId) return toast.error("Please select a customer device ticket.");
    if (consumeQty > selectedPartForDevice.stockQuantity) {
      return toast.error("Requested quantity exceeds available stock.");
    }

    try {
      setAttaching(true);
      const res = await axios.post(
        `${API_PARTS}/consume-part`,
        {
          repairId: selectedRepairId,
          partId: selectedPartForDevice._id,
          quantity: Number(consumeQty),
        },
        getAuthConfig()
      );

      toast.success(res.data?.message || "Part attached to ticket successfully!");
      setShowAttachModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to attach part.");
    } finally {
      setAttaching(false);
    }
  };

  // Filter Search
  const filteredParts = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return parts.filter((part) => {
      const matchSearch =
        !q ||
        part.partName.toLowerCase().includes(q) ||
        part.partSku.toLowerCase().includes(q) ||
        part.locationBin.toLowerCase().includes(q) ||
        (Array.isArray(part.compatibleModels) && part.compatibleModels.some((m) => m.toLowerCase().includes(q)));

      const matchCategory = categoryFilter === "ALL" || part.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [parts, searchTerm, categoryFilter]);

  // Statistics
  const totalStockItems = parts.reduce((acc, p) => acc + (Number(p.stockQuantity) || 0), 0);
  const lowStockCount = parts.filter((p) => p.stockQuantity <= p.minThreshold).length;
  const totalValuation = parts.reduce((acc, p) => acc + p.stockQuantity * p.purchaseCost, 0);

  return (
    <div className="inv-container">
      {/* Header */}
      <header className="inv-header">
        <div>
          <span className="inv-eyebrow">WAREHOUSE & WORKSHOP</span>
          <h1>Repair Parts Inventory</h1>
          <p>Real-time hardware stock, threshold alerts, and instant customer ticket allocation.</p>
        </div>

        <div className="inv-header-actions">
          <button type="button" className="inv-btn inv-btn-sec" onClick={fetchData} disabled={loading}>
            <FiRefreshCw className={loading ? "inv-spin" : ""} /> Sync Stock
          </button>
          <button type="button" className="inv-btn inv-btn-pri" onClick={handleOpenCreate}>
            <FiPlus /> Add Spare Part
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="inv-metrics-grid">
        <div className="inv-metric-card">
          <div className="inv-icon-wrap icon-blue"><FiBox /></div>
          <div>
            <span className="inv-lbl">Total Components</span>
            <strong className="inv-val">{parts.length} Types ({totalStockItems} Units)</strong>
          </div>
        </div>

        <div className="inv-metric-card">
          <div className="inv-icon-wrap icon-amber"><FiAlertTriangle /></div>
          <div>
            <span className="inv-lbl">Low Stock Alerts</span>
            <strong className="inv-val" style={{ color: lowStockCount > 0 ? "#dc2626" : "#0f172a" }}>
              {lowStockCount} Items
            </strong>
          </div>
        </div>

        <div className="inv-metric-card">
          <div className="inv-icon-wrap icon-emerald"><FiDollarSign /></div>
          <div>
            <span className="inv-lbl">Inventory Asset Value</span>
            <strong className="inv-val">₹{totalValuation.toLocaleString()}</strong>
          </div>
        </div>
      </section>

      {/* Main Inventory Card */}
      <section className="inv-main-card">
        <div className="inv-toolbar">
          <div className="inv-search-wrap">
            <FiSearch className="inv-search-ico" />
            <input
              type="text"
              placeholder="Search component name, SKU, rack location, model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="inv-select"
          >
            <option value="ALL">All Hardware Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="inv-state-box">
            <div className="inv-spinner"></div>
            <p>Loading warehouse components...</p>
          </div>
        ) : filteredParts.length === 0 ? (
          <div className="inv-state-box">
            <FiBox className="inv-empty-ico" />
            <h3>No Inventory Parts Found</h3>
            <p>Register new replacement screens, batteries, or ICs to start tracking stock.</p>
          </div>
        ) : (
          <div className="inv-table-wrap">
            <table className="inv-table">
              <thead>
                <tr>
                  <th>SKU Code</th>
                  <th>Part Name & Category</th>
                  <th>Compatible Hardware</th>
                  <th>Location</th>
                  <th>Cost / Sale</th>
                  <th>Stock In Hand</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParts.map((item) => {
                  const isLow = item.stockQuantity <= item.minThreshold;
                  return (
                    <tr key={item._id} className={isLow ? "row-low-stock" : ""}>
                      <td>
                        <span className="inv-sku-pill">{item.partSku}</span>
                      </td>

                      <td>
                        <div className="inv-part-name-cell">
                          <strong>{item.partName}</strong>
                          <span className="inv-category-tag">{item.category}</span>
                        </div>
                      </td>

                      <td className="inv-compat-cell">
                        {item.compatibleModels && item.compatibleModels.length > 0 ? (
                          item.compatibleModels.map((m, idx) => (
                            <span key={idx} className="inv-model-chip">{m}</span>
                          ))
                        ) : (
                          <span className="text-muted">Universal</span>
                        )}
                      </td>

                      <td>
                        <span className="inv-rack-badge">{item.locationBin || "N/A"}</span>
                      </td>

                      <td>
                        <div className="inv-price-cell">
                          <span className="cost-buy">Buy: ₹{item.purchaseCost}</span>
                          <strong className="cost-sell">Sell: ₹{item.sellingPrice}</strong>
                        </div>
                      </td>

                      <td>
                        <div className="inv-stock-status">
                          <strong className={`stock-count ${isLow ? "low" : "ok"}`}>
                            {item.stockQuantity} Units
                          </strong>
                          {isLow && (
                            <span className="low-stock-alert">
                              <FiAlertTriangle /> Low
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="text-right">
                        <div className="inv-action-btns">
                          <button
                            type="button"
                            className="btn-attach"
                            title="Assign to active customer repair ticket"
                            disabled={item.stockQuantity <= 0}
                            onClick={() => handleOpenAttach(item)}
                          >
                            <FiLink /> <span>Use Part</span>
                          </button>
                          <button
                            type="button"
                            className="btn-icon-action"
                            title="Edit"
                            onClick={() => handleOpenEdit(item)}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            type="button"
                            className="btn-icon-action delete"
                            title="Delete"
                            onClick={() => handleDelete(item._id)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 1. CREATE / EDIT MODAL */}
      {showFormModal && (
        <div className="inv-modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && setShowFormModal(false)}>
          <div className="inv-modal-box">
            <div className="inv-modal-head">
              <div>
                <span className="inv-eyebrow">{editingId ? "UPDATE INVENTORY" : "REGISTRATION"}</span>
                <h2>{editingId ? "Edit Component Specs" : "Add Replacement Part"}</h2>
              </div>
              <button type="button" className="btn-close" onClick={() => setShowFormModal(false)}><FiX /></button>
            </div>

            <form onSubmit={handleSubmit} className="inv-form-stack">
              <div className="inv-grid-2">
                <div className="inv-field">
                  <label>Part / Hardware Name <span>*</span></label>
                  <input
                    type="text"
                    name="partName"
                    value={formData.partName}
                    onChange={handleChange}
                    placeholder="e.g. 15.6 FHD Display Panel 144Hz"
                    required
                  />
                </div>
                <div className="inv-field">
                  <label>Part SKU Code <span>*</span></label>
                  <input
                    type="text"
                    name="partSku"
                    value={formData.partSku}
                    onChange={handleChange}
                    placeholder="e.g. DISP-LN-156"
                    required
                  />
                </div>
              </div>

              <div className="inv-grid-2">
                <div className="inv-field">
                  <label>Component Category <span>*</span></label>
                  <select name="category" value={formData.category} onChange={handleChange} className="inv-select">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="inv-field">
                  <label>Storage Bin / Rack Location</label>
                  <input
                    type="text"
                    name="locationBin"
                    value={formData.locationBin}
                    onChange={handleChange}
                    placeholder="e.g. RACK-B2-04"
                  />
                </div>
              </div>

              <div className="inv-field">
                <label>Compatible Models (Comma Separated)</label>
                <input
                  type="text"
                  name="compatibleModels"
                  value={formData.compatibleModels}
                  onChange={handleChange}
                  placeholder="e.g. Lenovo V15, IdeaPad 3, ThinkBook 14"
                />
              </div>

              <div className="inv-grid-3">
                <div className="inv-field">
                  <label>Cost Price (₹) <span>*</span></label>
                  <input
                    type="number"
                    name="purchaseCost"
                    value={formData.purchaseCost}
                    onChange={handleChange}
                    min="0"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="inv-field">
                  <label>Customer Sale Price (₹) <span>*</span></label>
                  <input
                    type="number"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    min="0"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="inv-field">
                  <label>Stock Quantity <span>*</span></label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="inv-modal-footer">
                <button type="button" className="inv-btn inv-btn-sec" onClick={() => setShowFormModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="inv-btn inv-btn-pri" disabled={submitting}>
                  {submitting ? "Saving..." : editingId ? "Update Part" : "Save Part to Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ATTACH TO DEVICE MODAL */}
      {showAttachModal && selectedPartForDevice && (
        <div className="inv-modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && setShowAttachModal(false)}>
          <div className="inv-modal-box">
            <div className="inv-modal-head">
              <div>
                <span className="inv-eyebrow">EQUIPMENT ALLOCATION</span>
                <h2>Attach Part to Customer Ticket</h2>
                <p>Stock will decrement and charge will append automatically to the customer invoice.</p>
              </div>
              <button type="button" className="btn-close" onClick={() => setShowAttachModal(false)}><FiX /></button>
            </div>

            <form onSubmit={handleExecuteAttach} className="inv-form-stack">
              <div className="inv-selected-part-box">
                <div>
                  <strong>{selectedPartForDevice.partName}</strong>
                  <span className="sub-text">SKU: {selectedPartForDevice.partSku} • In Stock: {selectedPartForDevice.stockQuantity} Units</span>
                </div>
                <strong className="price-tag">₹{selectedPartForDevice.sellingPrice} / unit</strong>
              </div>

              <div className="inv-field">
                <label>Select Active Customer Repair Ticket <span>*</span></label>
                <select
                  className="inv-select"
                  value={selectedRepairId}
                  onChange={(e) => setSelectedRepairId(e.target.value)}
                  required
                >
                  {repairs.length === 0 ? (
                    <option value="">No active repair tickets available</option>
                  ) : (
                    repairs.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.repairNumber || r._id.slice(-6).toUpperCase()} — {r.customerName} ({r.deviceModel || r.laptopModel})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="inv-field">
                <label>Quantity to Consume</label>
                <input
                  type="number"
                  min="1"
                  max={selectedPartForDevice.stockQuantity}
                  value={consumeQty}
                  onChange={(e) => setConsumeQty(e.target.value)}
                  required
                />
              </div>

              <div className="inv-total-calc-box">
                <span>Total Added to Customer Invoice:</span>
                <strong>₹{(selectedPartForDevice.sellingPrice * (Number(consumeQty) || 1)).toLocaleString()}</strong>
              </div>

              <div className="inv-modal-footer">
                <button type="button" className="inv-btn inv-btn-sec" onClick={() => setShowAttachModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="inv-btn inv-btn-pri" disabled={attaching || repairs.length === 0}>
                  {attaching ? "Processing Deduction..." : "Confirm & Deduct Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}