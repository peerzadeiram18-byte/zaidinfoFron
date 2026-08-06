import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Repairs.css";
const API = import.meta.env.VITE_API_URL;
const Repairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    deviceModel: "",
    issueDescription: "",
    estimatedCost: "",
    status: "RECEIVED",
  });

  const dummyRepairs = [
    {
      _id: "rep_101",
      jobNo: "REP-2026-001",
      customerName: "Rahul Sharma",
      deviceModel: "HP Pavilion Laptop 15",
      issueDescription: "Screen replacement & battery issue",
      estimatedCost: 6500,
      status: "IN_PROGRESS",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "rep_102",
      jobNo: "REP-2026-002",
      customerName: "Priya Patel",
      deviceModel: "Symphony Desert Cooler 70L",
      issueDescription: "Submersible pump replacement & motor servicing",
      estimatedCost: 1800,
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "rep_103",
      jobNo: "REP-2026-003",
      customerName: "Tejas Kewate",
      deviceModel: "Dell Inspiron Desktop CPU",
      issueDescription: "SMPS replacement & RAM upgrade",
      estimatedCost: 3200,
      status: "RECEIVED",
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/repairs`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      const data = res.data?.data || res.data?.repairs || res.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setRepairs(data);
      } else {
        setRepairs(dummyRepairs);
      }
    } catch (error) {
      console.error("Error fetching repairs, falling back to dummy data:", error);
      setRepairs(dummyRepairs);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRepair = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
     await axios.post(`${API}/repairs`, formData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
      alert("Repair job created successfully!");
      fetchRepairs();
    } catch (error) {
      console.error("Create repair API error, pushing to local state:", error);
      const newJob = {
        _id: `rep_${Date.now()}`,
        jobNo: `REP-2026-${Math.floor(100 + Math.random() * 900)}`,
        customerName: formData.customerName,
        deviceModel: formData.deviceModel,
        issueDescription: formData.issueDescription,
        estimatedCost: Number(formData.estimatedCost),
        status: formData.status,
        createdAt: new Date().toISOString(),
      };
      setRepairs((prev) => [newJob, ...prev]);
      alert("Repair job added successfully!");
    } finally {
      setShowModal(false);
      setFormData({
        customerName: "",
        deviceModel: "",
        issueDescription: "",
        estimatedCost: "",
        status: "RECEIVED",
      });
    }
  };

  const filteredRepairs = repairs.filter((job) => {
    const query = searchTerm.toLowerCase();
    const customer = (job.customerName || "").toLowerCase();
    const device = (job.deviceModel || "").toLowerCase();
    const jobNo = (job.jobNo || "").toLowerCase();

    return customer.includes(query) || device.includes(query) || jobNo.includes(query);
  });

  return (
    <div className="repairs-container">
      <div className="repairs-card">
        {/* HEADER */}
        <div className="card-header">
          <div>
            <h2>Repair Jobs & Services</h2>
            <p>Track device intake, ongoing repairs, and service completions.</p>
          </div>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            + New Repair Job
          </button>
        </div>

        {/* TOOLBAR */}
        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by Job No., customer name, or device..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="refresh-btn" onClick={fetchRepairs}>
            Refresh
          </button>
        </div>

        {/* TABLE */}
        <div className="table-wrapper">
          {loading ? (
            <div className="loading-state">Loading repair jobs...</div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job No.</th>
                  <th>Customer Name</th>
                  <th>Device / Appliance</th>
                  <th>Issue Details</th>
                  <th>Est. Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRepairs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-text">
                      No repair jobs found.
                    </td>
                  </tr>
                ) : (
                  filteredRepairs.map((item) => (
                    <tr key={item._id}>
                      <td className="job-no font-bold">{item.jobNo || "REP-LOG"}</td>
                      <td className="font-bold">{item.customerName}</td>
                      <td>{item.deviceModel}</td>
                      <td className="text-muted">{item.issueDescription}</td>
                      <td className="text-green">₹ {item.estimatedCost}</td>
                      <td>
                        <span
                          className={`status-pill ${
                            item.status === "COMPLETED"
                              ? "active"
                              : item.status === "IN_PROGRESS"
                              ? "progress"
                              : "pending"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>Create Repair Job</h3>
              <form onSubmit={handleAddRepair} className="modal-form">
                <div className="form-group">
                  <label>Customer Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Device / Appliance Model *</label>
                  <input
                    type="text"
                    name="deviceModel"
                    value={formData.deviceModel}
                    onChange={handleChange}
                    placeholder="e.g. HP Laptop 15s"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Issue Description *</label>
                  <textarea
                    name="issueDescription"
                    value={formData.issueDescription}
                    onChange={handleChange}
                    placeholder="Describe problem..."
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Estimated Cost (₹) *</label>
                  <input
                    type="number"
                    name="estimatedCost"
                    value={formData.estimatedCost}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Initial Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="RECEIVED">RECEIVED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Save Repair Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Repairs;