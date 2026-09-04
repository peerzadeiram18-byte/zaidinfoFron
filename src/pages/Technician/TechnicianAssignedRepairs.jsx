import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiTool,
  FiSearch,
  FiPhone,
  FiMail,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiRefreshCw,
  FiInbox,
  FiUserCheck,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "./TechnicianWorkOrders2.css";

const STATUS_OPTIONS = [
  "Received",
  "Assigned",
  "In Progress",
  "Waiting for Parts",
  "Ready for Delivery",
  "Completed",
  "Cancelled",
];

// const BASE_URL = "http://localhost:5000/api/newRepair";

const BASE_URL = `${import.meta.env.VITE_API_URL}/newRepair`;

export default function TechnicianAssignedTasks() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("token");

  // Read logged-in technician from localStorage
  const loggedInUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const loggedInTechId = loggedInUser._id || loggedInUser.id || "";
  const loggedInFullName = (
    loggedInUser.name ||
    loggedInUser.fullName ||
    `${loggedInUser.firstName || ""} ${loggedInUser.lastName || ""}`
  ).trim().toLowerCase();

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch all repair tickets created by receptionist
  const fetchAllRepairs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/`, getAuthConfig());
      const data =
        res.data?.repairs ||
        res.data?.data ||
        (Array.isArray(res.data) ? res.data : []);
      setRepairs(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load repair tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRepairs();
  }, []);

  // Update status directly from table
  const handleStatusChange = async (repairId, newStatus) => {
    try {
      setUpdatingId(repairId);
      await axios.patch(
        `${BASE_URL}/${repairId}/status`,
        { status: newStatus },
        getAuthConfig()
      );
      toast.success(`Task status updated to "${newStatus}"`);
      setRepairs((prev) =>
        prev.map((item) =>
          item._id === repairId ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating repair status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter ONLY the repairs assigned to THIS logged-in technician (e.g. Priya Prakash)
  const myAssignedJobs = useMemo(() => {
    return repairs.filter((repair) => {
      // 1. Match by ObjectId if assignedTechnician is populated or stored as ID
      const assignedId =
        typeof repair.assignedTechnician === "object"
          ? repair.assignedTechnician?._id || repair.assignedTechnician?.id
          : repair.assignedTechnician;

      if (loggedInTechId && assignedId && String(assignedId) === String(loggedInTechId)) {
        return true;
      }

      // 2. Match by technicianName string (e.g. "Priya Prakash")
      const recordName = (repair.technicianName || "").trim().toLowerCase();
      if (loggedInFullName && recordName) {
        if (
          recordName === loggedInFullName ||
          recordName.includes(loggedInFullName) ||
          loggedInFullName.includes(recordName)
        ) {
          return true;
        }
      }

      return false;
    });
  }, [repairs, loggedInTechId, loggedInFullName]);

  // Apply search & status filters
  const filteredJobs = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return myAssignedJobs.filter((job) => {
      const model = job.deviceModel || job.laptopModel || "";
      const matchesSearch =
        !q ||
        (job.customerName && job.customerName.toLowerCase().includes(q)) ||
        (job.customerPhone && job.customerPhone.includes(q)) ||
        (job.repairNumber && job.repairNumber.toLowerCase().includes(q)) ||
        model.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ||
        String(job.status || "Received").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [myAssignedJobs, searchTerm, statusFilter]);

  const getStatusClass = (status) =>
    status ? `tat-status-${String(status).toLowerCase().replaceAll(" ", "-")}` : "tat-status-received";

  return (
    <div className="tat-container">
      {/* Top Header */}
      <header className="tat-header">
        <div>
          <span className="tat-eyebrow">TECHNICIAN WORKBENCH</span>
          <h1>My Assigned Repair Tasks</h1>
          <p>
            Logged in as:{" "}
            <strong>
              {loggedInUser.firstName
                ? `${loggedInUser.firstName} ${loggedInUser.lastName || ""}`
                : loggedInUser.name || "Technician"}
            </strong>{" "}
            • Review and update device repairs assigned to you.
          </p>
        </div>

        <button
          type="button"
          className="tat-btn-refresh"
          onClick={fetchAllRepairs}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? "tat-spin" : ""} />
          <span>Sync Tasks</span>
        </button>
      </header>

      {/* Quick Summary Metrics */}
      <section className="tat-metrics">
        <div className="tat-metric-card">
          <div className="tat-metric-icon icon-blue"><FiTool /></div>
          <div>
            <span className="tat-metric-label">Total Assigned Jobs</span>
            <strong className="tat-metric-count">{myAssignedJobs.length}</strong>
          </div>
        </div>
        <div className="tat-metric-card">
          <div className="tat-metric-icon icon-amber"><FiClock /></div>
          <div>
            <span className="tat-metric-label">In Progress / Pending</span>
            <strong className="tat-metric-count">
              {
                myAssignedJobs.filter((r) =>
                  ["assigned", "in progress", "received", "waiting for parts"].includes(
                    String(r.status || "received").toLowerCase()
                  )
                ).length
              }
            </strong>
          </div>
        </div>
        <div className="tat-metric-card">
          <div className="tat-metric-icon icon-green"><FiCheckCircle /></div>
          <div>
            <span className="tat-metric-label">Ready / Completed</span>
            <strong className="tat-metric-count">
              {
                myAssignedJobs.filter((r) =>
                  ["ready for delivery", "completed", "delivered"].includes(
                    String(r.status || "").toLowerCase()
                  )
                ).length
              }
            </strong>
          </div>
        </div>
      </section>

      {/* Main Task List Card */}
      <section className="tat-card">
        <div className="tat-toolbar">
          <div className="tat-search-wrap">
            <FiSearch className="tat-search-ico" />
            <input
              type="text"
              placeholder="Search customer, phone, device model, ticket #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="tat-filter-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="tat-select"
            >
              <option value="ALL">All Statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="tat-state-box">
            <div className="tat-spinner"></div>
            <p>Loading your assigned repair tickets...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="tat-state-box">
            <div className="tat-empty-icon"><FiInbox /></div>
            <h3>No Assigned Jobs Found</h3>
            <p>There are currently no customer repair orders assigned to your profile.</p>
          </div>
        ) : (
          <div className="tat-table-wrap">
            <table className="tat-table">
              <thead>
                <tr>
                  <th>Job Ticket</th>
                  <th>Customer Information</th>
                  <th>Device / Hardware</th>
                  <th>Reported Issue</th>
                  <th>Counter Remarks</th>
                  <th>Est. Target Date</th>
                  <th>Current Status</th>
                  <th className="tat-th-right">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <span className="tat-ticket-code">
                        {job.repairNumber || job._id.slice(-6).toUpperCase()}
                      </span>
                    </td>

                    <td>
                      <div className="tat-customer-cell">
                        <strong>{job.customerName || "Walk-in Customer"}</strong>
                        <span className="tat-sub-txt"><FiPhone /> {job.customerPhone}</span>
                        {job.customerEmail && (
                          <span className="tat-sub-txt"><FiMail /> {job.customerEmail}</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <strong className="tat-device-name">
                        {job.deviceModel || job.laptopModel || "Device Unspecified"}
                      </strong>
                    </td>

                    <td className="tat-issue-col">
                      <div className="tat-issue-text">
                        <FiAlertCircle className="tat-issue-icon" />
                        <span>{job.issueDescription}</span>
                      </div>
                    </td>

                    <td className="tat-remarks-col">
                      {job.remarks ? (
                        <span className="tat-remarks-tag">{job.remarks}</span>
                      ) : (
                        <span className="tat-muted-dash">—</span>
                      )}
                    </td>

                    <td>
                      <span className="tat-date-badge">
                        <FiCalendar />{" "}
                        {job.estimatedCompletionDate
                          ? new Date(job.estimatedCompletionDate).toLocaleDateString()
                          : "Not Set"}
                      </span>
                    </td>

                    <td>
                      <span className={`tat-status-pill ${getStatusClass(job.status)}`}>
                        {job.status || "Received"}
                      </span>
                    </td>

                    <td className="tat-td-right">
                      <select
                        className="tat-status-changer"
                        value={job.status || "Received"}
                        disabled={updatingId === job._id}
                        onChange={(e) => handleStatusChange(job._id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}