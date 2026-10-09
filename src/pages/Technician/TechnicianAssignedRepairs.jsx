// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import {
//   FiTool,
//   FiSearch,
//   FiPhone,
//   FiMail,
//   FiCalendar,
//   FiCheckCircle,
//   FiClock,
//   FiAlertCircle,
//   FiRefreshCw,
//   FiInbox,
//   FiUserCheck,
// } from "react-icons/fi";
// import { toast } from "react-toastify";
// import "./TechnicianWorkOrders2.css";

// const STATUS_OPTIONS = [
//      "Received",
//       "In Progress",
//       "Assigned",
//       "Waiting for Parts",
//       "Completed",
//       "Cancelled"
      
// ];

// // const BASE_URL = "http://localhost:5000/api/newRepair";

// const BASE_URL = `${import.meta.env.VITE_API_URL}/newRepair`;

// export default function TechnicianAssignedTasks() {
//   const [repairs, setRepairs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");
//   const [updatingId, setUpdatingId] = useState(null);

//   const token = localStorage.getItem("token");

//   // Read logged-in technician from localStorage
//   const loggedInUser = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user")) || {};
//     } catch {
//       return {};
//     }
//   }, []);

//   const loggedInTechId = loggedInUser._id || loggedInUser.id || "";
//   const loggedInFullName = (
//     loggedInUser.name ||
//     loggedInUser.fullName ||
//     `${loggedInUser.firstName || ""} ${loggedInUser.lastName || ""}`
//   ).trim().toLowerCase();

//   const getAuthConfig = () => ({
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   // Fetch all repair tickets created by receptionist
//   const fetchAllRepairs = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE_URL}/`, getAuthConfig());
//       const data =
//         res.data?.repairs ||
//         res.data?.data ||
//         (Array.isArray(res.data) ? res.data : []);
//       setRepairs(data);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load repair tasks");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllRepairs();
//   }, []);

//   // Update status directly from table
//   const handleStatusChange = async (repairId, newStatus) => {
//     try {
//       setUpdatingId(repairId);
//       await axios.patch(
//         `${BASE_URL}/${repairId}/status`,
//         { status: newStatus },
//         getAuthConfig()
//       );
//       toast.success(`Task status updated to "${newStatus}"`);
//       setRepairs((prev) =>
//         prev.map((item) =>
//           item._id === repairId ? { ...item, status: newStatus } : item
//         )
//       );
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error updating repair status");
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   // Filter ONLY the repairs assigned to THIS logged-in technician (e.g. Priya Prakash)
//   const myAssignedJobs = useMemo(() => {
//     return repairs.filter((repair) => {
//       // 1. Match by ObjectId if assignedTechnician is populated or stored as ID
//       const assignedId =
//         typeof repair.assignedTechnician === "object"
//           ? repair.assignedTechnician?._id || repair.assignedTechnician?.id
//           : repair.assignedTechnician;

//       if (loggedInTechId && assignedId && String(assignedId) === String(loggedInTechId)) {
//         return true;
//       }

//       // 2. Match by technicianName string (e.g. "Priya Prakash")
//       const recordName = (repair.technicianName || "").trim().toLowerCase();
//       if (loggedInFullName && recordName) {
//         if (
//           recordName === loggedInFullName ||
//           recordName.includes(loggedInFullName) ||
//           loggedInFullName.includes(recordName)
//         ) {
//           return true;
//         }
//       }

//       return false;
//     });
//   }, [repairs, loggedInTechId, loggedInFullName]);

//   // Apply search & status filters
//   const filteredJobs = useMemo(() => {
//     const q = searchTerm.toLowerCase().trim();
//     return myAssignedJobs.filter((job) => {
//       const model = job.deviceModel || job.laptopModel || "";
//       const matchesSearch =
//         !q ||
//         (job.customerName && job.customerName.toLowerCase().includes(q)) ||
//         (job.customerPhone && job.customerPhone.includes(q)) ||
//         (job.repairNumber && job.repairNumber.toLowerCase().includes(q)) ||
//         model.toLowerCase().includes(q);

//       const matchesStatus =
//         statusFilter === "ALL" ||
//         String(job.status || "Received").toLowerCase() === statusFilter.toLowerCase();

//       return matchesSearch && matchesStatus;
//     });
//   }, [myAssignedJobs, searchTerm, statusFilter]);

//   const getStatusClass = (status) =>
//     status ? `tat-status-${String(status).toLowerCase().replaceAll(" ", "-")}` : "tat-status-received";

//   return (
//     <div className="tat-container">
//       {/* Top Header */}
//       <header className="tat-header">
//         <div>
//           <span className="tat-eyebrow">TECHNICIAN WORKBENCH</span>
//           <h1>My Assigned Repair Tasks</h1>
//           <p>
//             Logged in as:{" "}
//             <strong>
//               {loggedInUser.firstName
//                 ? `${loggedInUser.firstName} ${loggedInUser.lastName || ""}`
//                 : loggedInUser.name || "Technician"}
//             </strong>{" "}
//             • Review and update device repairs assigned to you.
//           </p>
//         </div>

//         <button
//           type="button"
//           className="tat-btn-refresh"
//           onClick={fetchAllRepairs}
//           disabled={loading}
//         >
//           <FiRefreshCw className={loading ? "tat-spin" : ""} />
//           <span>Sync Tasks</span>
//         </button>
//       </header>

//       {/* Quick Summary Metrics */}
//       <section className="tat-metrics">
//         <div className="tat-metric-card">
//           <div className="tat-metric-icon icon-blue"><FiTool /></div>
//           <div>
//             <span className="tat-metric-label">Total Assigned Jobs</span>
//             <strong className="tat-metric-count">{myAssignedJobs.length}</strong>
//           </div>
//         </div>
//         <div className="tat-metric-card">
//           <div className="tat-metric-icon icon-amber"><FiClock /></div>
//           <div>
//             <span className="tat-metric-label">In Progress / Pending</span>
//             <strong className="tat-metric-count">
//               {
//                 myAssignedJobs.filter((r) =>
//                   ["assigned", "in progress", "received", "waiting for parts"].includes(
//                     String(r.status || "received").toLowerCase()
//                   )
//                 ).length
//               }
//             </strong>
//           </div>
//         </div>
//         <div className="tat-metric-card">
//           <div className="tat-metric-icon icon-green"><FiCheckCircle /></div>
//           <div>
//             <span className="tat-metric-label">Ready / Completed</span>
//             <strong className="tat-metric-count">
//               {
//                 myAssignedJobs.filter((r) =>
//                   ["ready for delivery", "completed", "delivered"].includes(
//                     String(r.status || "").toLowerCase()
//                   )
//                 ).length
//               }
//             </strong>
//           </div>
//         </div>
//       </section>

//       {/* Main Task List Card */}
//       <section className="tat-card">
//         <div className="tat-toolbar">
//           <div className="tat-search-wrap">
//             <FiSearch className="tat-search-ico" />
//             <input
//               type="text"
//               placeholder="Search customer, phone, device model, ticket #..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="tat-filter-wrap">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="tat-select"
//             >
//               <option value="ALL">All Statuses</option>
//               {STATUS_OPTIONS.map((status) => (
//                 <option key={status} value={status}>
//                   {status}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {loading ? (
//           <div className="tat-state-box">
//             <div className="tat-spinner"></div>
//             <p>Loading your assigned repair tickets...</p>
//           </div>
//         ) : filteredJobs.length === 0 ? (
//           <div className="tat-state-box">
//             <div className="tat-empty-icon"><FiInbox /></div>
//             <h3>No Assigned Jobs Found</h3>
//             <p>There are currently no customer repair orders assigned to your profile.</p>
//           </div>
//         ) : (
//           <div className="tat-table-wrap">
//             <table className="tat-table">
//               <thead>
//                 <tr>
//                   <th>Job Ticket</th>
//                   <th>Customer Information</th>
//                   <th>Device / Hardware</th>
//                   <th>Reported Issue</th>
//                   <th>Counter Remarks</th>
//                   <th>Est. Target Date</th>
//                   <th>Current Status</th>
//                   <th className="tat-th-right">Update Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredJobs.map((job) => (
//                   <tr key={job._id}>
//                     <td>
//                       <span className="tat-ticket-code">
//                         {job.repairNumber || job._id.slice(-6).toUpperCase()}
//                       </span>
//                     </td>

//                     <td>
//                       <div className="tat-customer-cell">
//                         <strong>{job.customerName || "Walk-in Customer"}</strong>
//                         <span className="tat-sub-txt"><FiPhone /> {job.customerPhone}</span>
//                         {job.customerEmail && (
//                           <span className="tat-sub-txt"><FiMail /> {job.customerEmail}</span>
//                         )}
//                       </div>
//                     </td>

//                     <td>
//                       <strong className="tat-device-name">
//                         {job.deviceModel || job.laptopModel || "Device Unspecified"}
//                       </strong>
//                     </td>

//                     <td className="tat-issue-col">
//                       <div className="tat-issue-text">
//                         <FiAlertCircle className="tat-issue-icon" />
//                         <span>{job.issueDescription}</span>
//                       </div>
//                     </td>

//                     <td className="tat-remarks-col">
//                       {job.remarks ? (
//                         <span className="tat-remarks-tag">{job.remarks}</span>
//                       ) : (
//                         <span className="tat-muted-dash">—</span>
//                       )}
//                     </td>

//                     <td>
//                       <span className="tat-date-badge">
//                         <FiCalendar />{" "}
//                         {job.estimatedCompletionDate
//                           ? new Date(job.estimatedCompletionDate).toLocaleDateString()
//                           : "Not Set"}
//                       </span>
//                     </td>

//                     <td>
//                       <span className={`tat-status-pill ${getStatusClass(job.status)}`}>
//                         {job.status || "Received"}
//                       </span>
//                     </td>

//                     <td className="tat-td-right">
//                       <select
//                         className="tat-status-changer"
//                         value={job.status || "Received"}
//                         disabled={updatingId === job._id}
//                         onChange={(e) => handleStatusChange(job._id, e.target.value)}
//                       >
//                         {STATUS_OPTIONS.map((status) => (
//                           <option key={status} value={status}>
//                             {status}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }



import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  FiMonitor,
  FiUserCheck,
} from "react-icons/fi";

import { toast } from "react-toastify";
import "./TechnicianWorkOrders2.css";

// ======================================================
// API CONFIG
// ======================================================

const API_URL = import.meta.env.VITE_API_URL;

const BASE_URL = `${API_URL}/newRepair`;

// Keep statuses consistent with repair.validation.js
const STATUS_OPTIONS = [
  "Received",
  "Assigned",
  "In Progress",
  "Waiting for Parts",
  "Completed",
  "Cancelled",
  "Delivered",
];

// ======================================================
// HELPERS
// ======================================================

const getAuthToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  "";

const getAuthConfig = () => {
  const token = getAuthToken();

  return {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return String(value._id || value.id || "");
  }

  return String(value);
};

const getDisplayName = (user) =>
  [
    user?.firstName,
    user?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() ||
  user?.name ||
  user?.fullName ||
  "Technician";

const formatDate = (value) => {
  if (!value) return "Not Set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not Set";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeStatus = (status) =>
  String(status || "Received").trim().toLowerCase();

const getStatusClass = (status) =>
  `tat-status-${normalizeStatus(status).replace(/\s+/g, "-")}`;

// Handles common API response formats.
const extractRepairs = (responseData) => {
  const candidates = [
    responseData?.data,
    responseData?.repairs,
    responseData?.data?.repairs,
    responseData,
  ];

  return candidates.find(Array.isArray) || [];
};

// ======================================================
// COMPONENT
// ======================================================

export default function TechnicianAssignedTasks() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);

  const loggedInUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const loggedInTechId = getId(
    loggedInUser._id || loggedInUser.id
  );

  const loggedInFullName = getDisplayName(
    loggedInUser
  ).toLowerCase();

  // ====================================================
  // FETCH ONLY LOGGED-IN TECHNICIAN'S ASSIGNED REPAIRS
  // ====================================================

  const fetchAssignedRepairs = useCallback(
    async ({ showToast = false } = {}) => {
      if (!API_URL) {
        toast.error("VITE_API_URL is not configured.");
        setLoading(false);
        return;
      }

      if (!getAuthToken()) {
        setRepairs([]);
        setLoading(false);
        toast.error("Session expired. Please log in again.");
        return;
      }

      try {
        setLoading(true);

        // Backend route:
        // GET /api/newRepair/my-assigned-repairs
        const response = await axios.get(
          `${BASE_URL}/my-assigned-repairs`,
          getAuthConfig()
        );

        const data = extractRepairs(response.data);

        setRepairs(data);

        if (showToast) {
          toast.success("Assigned repair tasks refreshed.");
        }
      } catch (error) {
        console.error(
          "FETCH ASSIGNED REPAIRS ERROR:",
          error.response?.data || error
        );

        const statusCode = error.response?.status;

        const message =
          error.response?.data?.message ||
          (statusCode === 401
            ? "Session expired. Please log in again."
            : statusCode === 403
              ? "You do not have permission to view these repairs."
              : "Failed to load assigned repair tasks.");

        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchAssignedRepairs();
  }, [fetchAssignedRepairs]);

  // ====================================================
  // VERIFY ASSIGNMENT
  // ====================================================

  const myAssignedJobs = useMemo(() => {
    return repairs.filter((repair) => {
      const assignedId = getId(
        repair.assignedTechnician
      );

      // Prefer the authenticated technician's database ID.
      if (loggedInTechId && assignedId) {
        return assignedId === loggedInTechId;
      }

      // Fallback for older records that only have a name.
      const recordName = String(
        repair.technicianName || ""
      )
        .trim()
        .toLowerCase();

      return Boolean(
        loggedInFullName &&
        recordName &&
        recordName === loggedInFullName
      );
    });
  }, [
    repairs,
    loggedInTechId,
    loggedInFullName,
  ]);

  // ====================================================
  // SEARCH AND STATUS FILTER
  // ====================================================

  const filteredJobs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return myAssignedJobs.filter((job) => {
      const model = String(
        job.deviceModel ||
        job.laptopModel ||
        ""
      );

      const deviceType = String(
        job.deviceType || ""
      );

      const ticketNumber = String(
        job.repairNumber ||
        job._id ||
        ""
      );

      const customerName = String(
        job.customerName || ""
      );

      const customerPhone = String(
        job.customerPhone || ""
      );

      const matchesSearch =
        !query ||
        customerName.toLowerCase().includes(query) ||
        customerPhone.includes(query) ||
        ticketNumber.toLowerCase().includes(query) ||
        model.toLowerCase().includes(query) ||
        deviceType.toLowerCase().includes(query) ||
        String(job.issueDescription || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        normalizeStatus(job.status) ===
          normalizeStatus(statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [
    myAssignedJobs,
    searchTerm,
    statusFilter,
  ]);

  // ====================================================
  // UPDATE REPAIR STATUS
  // ====================================================

  const handleStatusChange = async (
    repairId,
    newStatus
  ) => {
    if (!repairId || !newStatus) return;

    const existingRepair = repairs.find(
      (repair) => repair._id === repairId
    );

    if (!existingRepair) {
      toast.error("Repair ticket not found.");
      return;
    }

    if (existingRepair.status === newStatus) {
      return;
    }

    try {
      setUpdatingId(repairId);

      const response = await axios.patch(
        `${BASE_URL}/${repairId}/status`,
        { status: newStatus },
        getAuthConfig()
      );

      const updatedRepair =
        response.data?.data || response.data?.repair;

      // Use the returned record if available.
      // Otherwise update the local status optimistically.
      setRepairs((previousRepairs) =>
        previousRepairs.map((repair) =>
          repair._id === repairId
            ? {
                ...repair,
                ...(updatedRepair || {}),
                status:
                  updatedRepair?.status || newStatus,
              }
            : repair
        )
      );

      toast.success(
        `Repair status updated to "${newStatus}".`
      );
    } catch (error) {
      console.error(
        "UPDATE REPAIR STATUS ERROR:",
        error.response?.data || error
      );

      const message =
        error.response?.data?.message ||
        "Failed to update repair status.";

      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  // ====================================================
  // SUMMARY COUNTS
  // ====================================================

  const pendingCount = myAssignedJobs.filter((job) =>
    [
      "received",
      "assigned",
      "in progress",
      "waiting for parts",
    ].includes(normalizeStatus(job.status))
  ).length;

  const completedCount = myAssignedJobs.filter((job) =>
    [
      "completed",
      "delivered",
    ].includes(normalizeStatus(job.status))
  ).length;

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="tat-container">
      <header className="tat-header">
        <div>
          <span className="tat-eyebrow">
            TECHNICIAN WORKBENCH
          </span>

          <h1>My Assigned Repair Tasks</h1>

          <p>
            Logged in as:{" "}
            <strong>
              {getDisplayName(loggedInUser)}
            </strong>{" "}
            • Review and update device repairs assigned
            to you.
          </p>
        </div>

        <button
          type="button"
          className="tat-btn-refresh"
          onClick={() =>
            fetchAssignedRepairs({ showToast: true })
          }
          disabled={loading}
        >
          <FiRefreshCw
            className={loading ? "tat-spin" : ""}
          />
          <span>
            {loading ? "Syncing..." : "Sync Tasks"}
          </span>
        </button>
      </header>

      {/* SUMMARY CARDS */}

      <section className="tat-metrics">
        <div className="tat-metric-card">
          <div className="tat-metric-icon icon-blue">
            <FiTool />
          </div>

          <div>
            <span className="tat-metric-label">
              Total Assigned Jobs
            </span>

            <strong className="tat-metric-count">
              {myAssignedJobs.length}
            </strong>
          </div>
        </div>

        <div className="tat-metric-card">
          <div className="tat-metric-icon icon-amber">
            <FiClock />
          </div>

          <div>
            <span className="tat-metric-label">
              In Progress / Pending
            </span>

            <strong className="tat-metric-count">
              {pendingCount}
            </strong>
          </div>
        </div>

        <div className="tat-metric-card">
          <div className="tat-metric-icon icon-green">
            <FiCheckCircle />
          </div>

          <div>
            <span className="tat-metric-label">
              Completed / Delivered
            </span>

            <strong className="tat-metric-count">
              {completedCount}
            </strong>
          </div>
        </div>
      </section>

      {/* TASK TABLE */}

      <section className="tat-card">
        <div className="tat-toolbar">
          <div className="tat-search-wrap">
            <FiSearch className="tat-search-ico" />

            <input
              type="text"
              placeholder="Search customer, phone, device, ticket..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <div className="tat-filter-wrap">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="tat-select"
            >
              <option value="ALL">
                All Statuses
              </option>

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
            <div className="tat-spinner" />
            <p>Loading your assigned repair tickets...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="tat-state-box">
            <div className="tat-empty-icon">
              <FiInbox />
            </div>

            <h3>No Assigned Jobs Found</h3>

            <p>
              There are currently no repair tickets assigned
              to your profile, or no tickets match your filters.
            </p>
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
                  <th>Job Date</th>
                  <th>Est. Target Date</th>
                  <th>Current Status</th>
                  <th className="tat-th-right">
                    Update Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <span className="tat-ticket-code">
                        {job.repairNumber ||
                          job._id?.slice(-6).toUpperCase() ||
                          "N/A"}
                      </span>
                    </td>

                    <td>
                      <div className="tat-customer-cell">
                        <strong>
                          {job.customerName ||
                            "Walk-in Customer"}
                        </strong>

                        <span className="tat-sub-txt">
                          <FiPhone />
                          {job.customerPhone || "No phone"}
                        </span>

                        {job.customerEmail && (
                          <span className="tat-sub-txt">
                            <FiMail />
                            {job.customerEmail}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="tat-customer-cell">
                        <strong className="tat-device-name">
                          {job.deviceType || "Device"}
                        </strong>

                        <span className="tat-sub-txt">
                          <FiMonitor />
                          {job.deviceModel ||
                            job.laptopModel ||
                            "Hardware not specified"}
                        </span>

                        {job.serialNumber && (
                          <span className="tat-sub-txt">
                            S/N: {job.serialNumber}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="tat-issue-col">
                      <div className="tat-issue-text">
                        <FiAlertCircle className="tat-issue-icon" />
                        <span>
                          {job.issueDescription || "No issue details"}
                        </span>
                      </div>
                    </td>

                    <td className="tat-remarks-col">
                      {job.remarks ? (
                        <span className="tat-remarks-tag">
                          {job.remarks}
                        </span>
                      ) : (
                        <span className="tat-muted-dash">
                          —
                        </span>
                      )}
                    </td>

                    <td>
                      <span className="tat-date-badge">
                        <FiCalendar />
                        {formatDate(job.jobDate || job.createdAt)}
                      </span>
                    </td>

                    <td>
                      <span className="tat-date-badge">
                        <FiCalendar />
                        {formatDate(job.estimatedCompletionDate)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`tat-status-pill ${getStatusClass(
                          job.status
                        )}`}
                      >
                        {job.status || "Received"}
                      </span>
                    </td>

                    <td className="tat-td-right">
                      <select
                        className="tat-status-changer"
                        value={job.status || "Received"}
                        disabled={updatingId === job._id}
                        onChange={(event) =>
                          handleStatusChange(
                            job._id,
                            event.target.value
                          )
                        }
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      {updatingId === job._id && (
                        <span className="tat-sub-txt">
                          Updating...
                        </span>
                      )}
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

