
import React, { useState, useEffect } from "react";
import {
  getMyLeaves,
  applyLeave,
  cancelLeave,
  getHolidays,
} from "../../services/leaveService"
import "./ItSupportLeave.css";

export default function ItSupportLeave() {
  const [activeTab, setActiveTab] = useState("my-leaves");
  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");



  const [formData, setFormData] = useState({
    leaveType: "CASUAL",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [leavesRes, holidaysRes] = await Promise.all([
        getMyLeaves(),
        getHolidays(),
      ]);

      if (leavesRes?.success) setLeaves(leavesRes.leaves || []);
      if (holidaysRes?.success) setHolidays(holidaysRes.holidays || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load leave records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await applyLeave(formData);
      if (res?.success) {
        setSuccess("Leave request submitted successfully.");
        setFormData({
          leaveType: "CASUAL",
          fromDate: "",
          toDate: "",
          reason: "",
        });
        await loadData();
        setActiveTab("my-leaves");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Error submitting leave request."
      );
    }
  };

  const handleCancel = async (leaveId) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;

    try {
      const res = await cancelLeave(leaveId);
      if (res?.success) {
        await loadData();
      }
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to cancel leave request."
      );
    }
  };

  return (
    <div className="leave-wrapper">
      {/* Navigation Tabs */}
      <div className="leave-tab-bar">
        <button
          type="button"
          className={activeTab === "my-leaves" ? "tab active" : "tab"}
          onClick={() => setActiveTab("my-leaves")}
        >
          My Requests
        </button>
        <button
          type="button"
          className={activeTab === "apply" ? "tab active" : "tab"}
          onClick={() => setActiveTab("apply")}
        >
          Apply for Leave
        </button>
        <button
          type="button"
          className={activeTab === "holidays" ? "tab active" : "tab"}
          onClick={() => setActiveTab("holidays")}
        >
          Holidays Calendar
        </button>
      </div>

      {error && <div className="alert-box error">{error}</div>}
      {success && <div className="alert-box success">{success}</div>}

      {/* TAB 1: MY LEAVES */}
      {activeTab === "my-leaves" && (
        <div className="leave-card">
          {loading ? (
            <p className="loading-text">Loading records...</p>
          ) : leaves.length === 0 ? (
            <p className="empty-text">No leave requests found.</p>
          ) : (
            <div className="table-responsive">
              <table className="leave-table">
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Admin Remark</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((item) => (
                    <tr key={item._id}>
                      <td><strong>{item.leaveType}</strong></td>
                      <td>{new Date(item.fromDate).toLocaleDateString()}</td>
                      <td>{new Date(item.toDate).toLocaleDateString()}</td>
                      <td>{item.reason}</td>
                      <td>
                        <span className={`badge-status ${item.status?.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.adminRemark || "—"}</td>
                      <td>
                        {item.status === "PENDING" && (
                          <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => handleCancel(item._id)}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPLY FOR LEAVE */}
      {activeTab === "apply" && (
        <div className="leave-card">
          <form className="apply-form" onSubmit={handleApply}>
            <div className="field-group">
              <label>Leave Type</label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                required
              >
                <option value="CASUAL">Casual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="EMERGENCY">Emergency Leave</option>
              </select>
            </div>

            <div className="field-grid">
              <div className="field-group">
                <label>From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field-group">
                <label>To Date</label>
                <input
                  type="date"
                  name="toDate"
                  min={formData.fromDate}
                  value={formData.toDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label>Reason</label>
              <textarea
                name="reason"
                rows="3"
                placeholder="State your reason for leave..."
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-submit">
              Submit Leave Request
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: HOLIDAYS */}
      {activeTab === "holidays" && (
        <div className="leave-card">
          {holidays.length === 0 ? (
            <p className="empty-text">No company holidays scheduled.</p>
          ) : (
            <div className="holidays-grid">
              {holidays.map((h) => (
                <div key={h._id} className="holiday-chip">
                  <div className="holiday-name">{h.name || h.title}</div>
                  <div className="holiday-date">
                    {new Date(h.date || h.startDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}