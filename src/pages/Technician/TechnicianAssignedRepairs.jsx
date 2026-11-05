// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

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
//   FiMonitor,
//   FiMapPin,
//   FiChevronDown,
//   FiChevronUp,
// } from "react-icons/fi";

// import { toast } from "react-toastify";
// import "./TechnicianWorkOrders2.css";

// // ======================================================
// // API CONFIG
// // ======================================================

// const API_URL = import.meta.env.VITE_API_URL;

// const BASE_URL = `${API_URL}/newRepair`;
// const BRANCH_URL = `${API_URL}/branches`;

// const STATUS_OPTIONS = [
//   "Received",
//   "Assigned",
//   "In Progress",
//   "Waiting for Parts",
//   "Completed",
//   "Cancelled",
//   "Delivered",
// ];

// // ======================================================
// // HELPERS
// // ======================================================

// const getAuthToken = () =>
//   localStorage.getItem("token") ||
//   localStorage.getItem("accessToken") ||
//   "";

// const getAuthConfig = () => {
//   const token = getAuthToken();

//   return {
//     headers: {
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//   };
// };

// const getId = (value) => {
//   if (!value) return "";

//   if (typeof value === "object") {
//     return String(
//       value._id ||
//       value.id ||
//       value.$oid ||
//       ""
//     );
//   }

//   return String(value);
// };

// const getDisplayName = (user) =>
//   [
//     user?.firstName,
//     user?.lastName,
//   ]
//     .filter(Boolean)
//     .join(" ")
//     .trim() ||
//   user?.name ||
//   user?.fullName ||
//   "Technician";

// const formatDate = (value) => {
//   if (!value) return "Not Set";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return "Not Set";
//   }

//   return date.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const normalizeStatus = (status) =>
//   String(status || "Received")
//     .trim()
//     .toLowerCase();

// const getStatusClass = (status) =>
//   `tat-status-${normalizeStatus(status).replace(/\s+/g, "-")}`;

// const extractRepairs = (responseData) => {
//   const candidates = [
//     responseData?.repairs,
//     responseData?.data?.repairs,
//     responseData?.data,
//     responseData?.results,
//     responseData,
//   ];

//   return candidates.find(Array.isArray) || [];
// };

// const extractBranches = (responseData) => {
//   const candidates = [
//     responseData?.branches,
//     responseData?.data?.branches,
//     responseData?.data,
//     responseData?.results,
//     responseData,
//   ];

//   return candidates.find(Array.isArray) || [];
// };

// // ======================================================
// // BRANCH HELPERS
// // ======================================================

// const getBranchName = (branch) => {
//   if (!branch) return "";

//   if (typeof branch === "string") {
//     return "";
//   }

//   return (
//     branch.name ||
//     branch.branchName ||
//     branch.title ||
//     branch.locationName ||
//     ""
//   );
// };

// const getBranchCode = (branch) => {
//   if (!branch || typeof branch !== "object") return "";

//   return branch.code || branch.branchCode || "";
// };

// // ======================================================
// // COMPONENT
// // ======================================================

// export default function TechnicianAssignedTasks() {
//   const [repairs, setRepairs] = useState([]);
//   const [branches, setBranches] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [branchesLoading, setBranchesLoading] = useState(false);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");

//   const [updatingId, setUpdatingId] = useState(null);

//   // Tracks expanded issue descriptions independently per ticket.
//   const [expandedIssues, setExpandedIssues] = useState({});

//   const loggedInUser = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user") || "{}");
//     } catch {
//       return {};
//     }
//   }, []);

//   const loggedInTechId = getId(
//     loggedInUser._id || loggedInUser.id
//   );

//   const loggedInFullName = getDisplayName(
//     loggedInUser
//   ).toLowerCase();

//   // ====================================================
//   // BRANCH LOOKUP
//   // ====================================================

//   const getBranchDetails = useCallback(
//     (repair) => {
//       const branchValue =
//         repair?.branchId ||
//         repair?.branch ||
//         repair?.branchDetails ||
//         null;

//       if (!branchValue) return null;

//       // Populated branch document
//       if (typeof branchValue === "object") {
//         const populatedName = getBranchName(branchValue);

//         if (populatedName) {
//           return branchValue;
//         }
//       }

//       // Plain branch ID
//       const branchId = getId(branchValue);

//       if (!branchId) return null;

//       return (
//         branches.find(
//           (branch) => getId(branch) === branchId
//         ) || null
//       );
//     },
//     [branches]
//   );

//   const getBranchLabel = useCallback(
//     (repair) => {
//       const branchValue =
//         repair?.branchId ||
//         repair?.branch ||
//         repair?.branchDetails ||
//         null;

//       const branch = getBranchDetails(repair);

//       if (branch) {
//         const name = getBranchName(branch);
//         const code = getBranchCode(branch);

//         if (name && code) {
//           return `${name} (${code})`;
//         }

//         return name || code || "Branch";
//       }

//       const branchId = getId(branchValue);

//       if (branchId) {
//         return `Branch ID: ${branchId.slice(-6)}`;
//       }

//       return "Branch not assigned";
//     },
//     [getBranchDetails]
//   );

//   // ====================================================
//   // FETCH BRANCHES
//   // ====================================================

//   const fetchBranches = useCallback(async () => {
//     if (!API_URL || !getAuthToken()) return;

//     try {
//       setBranchesLoading(true);

//       const response = await axios.get(
//         BRANCH_URL,
//         getAuthConfig()
//       );

//       const data = extractBranches(response.data);

//       setBranches(data);

//       console.log("TECHNICIAN BRANCHES:", data);
//     } catch (error) {
//       console.error(
//         "FETCH BRANCHES ERROR:",
//         error.response?.data || error
//       );

//       setBranches([]);
//     } finally {
//       setBranchesLoading(false);
//     }
//   }, []);

//   // ====================================================
//   // FETCH ASSIGNED REPAIRS
//   // ====================================================

//   const fetchAssignedRepairs = useCallback(
//     async ({ showToast = false } = {}) => {
//       if (!API_URL) {
//         toast.error("VITE_API_URL is not configured.");
//         setLoading(false);
//         return;
//       }

//       if (!getAuthToken()) {
//         setRepairs([]);
//         setLoading(false);

//         toast.error(
//           "Session expired. Please log in again."
//         );

//         return;
//       }

//       try {
//         setLoading(true);

//         const response = await axios.get(
//           `${BASE_URL}/my-assigned-repairs`,
//           getAuthConfig()
//         );

//         const data = extractRepairs(response.data);

//         console.log("ASSIGNED REPAIRS RESPONSE:", data);

//         setRepairs(data);

//         if (showToast) {
//           toast.success(
//             "Assigned repair tasks refreshed."
//           );
//         }
//       } catch (error) {
//         console.error(
//           "FETCH ASSIGNED REPAIRS ERROR:",
//           error.response?.data || error
//         );

//         const statusCode = error.response?.status;

//         const message =
//           error.response?.data?.message ||
//           (statusCode === 401
//             ? "Session expired. Please log in again."
//             : statusCode === 403
//               ? "You do not have permission to view these repairs."
//               : "Failed to load assigned repair tasks.");

//         toast.error(message);
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   // ====================================================
//   // INITIAL LOAD
//   // ====================================================

//   useEffect(() => {
//     fetchAssignedRepairs();
//     fetchBranches();
//   }, [fetchAssignedRepairs, fetchBranches]);

//   // ====================================================
//   // VERIFY ASSIGNMENT
//   // ====================================================

//   const myAssignedJobs = useMemo(() => {
//     return repairs.filter((repair) => {
//       const assignedId = getId(
//         repair.assignedTechnician
//       );

//       if (loggedInTechId && assignedId) {
//         return assignedId === loggedInTechId;
//       }

//       const recordName = String(
//         repair.technicianName || ""
//       )
//         .trim()
//         .toLowerCase();

//       return Boolean(
//         loggedInFullName &&
//         recordName &&
//         recordName === loggedInFullName
//       );
//     });
//   }, [
//     repairs,
//     loggedInTechId,
//     loggedInFullName,
//   ]);

//   // ====================================================
//   // SEARCH AND STATUS FILTER
//   // ====================================================

//   const filteredJobs = useMemo(() => {
//     const query = searchTerm.trim().toLowerCase();

//     return myAssignedJobs.filter((job) => {
//       const model = String(
//         job.deviceModel ||
//         job.laptopModel ||
//         ""
//       );

//       const deviceType = String(
//         job.deviceType || ""
//       );

//       const ticketNumber = String(
//         job.repairNumber ||
//         job._id ||
//         ""
//       );

//       const customerName = String(
//         job.customerName || ""
//       );

//       const customerPhone = String(
//         job.customerPhone || ""
//       );

//       const branchName = getBranchLabel(job);

//       const matchesSearch =
//         !query ||
//         customerName.toLowerCase().includes(query) ||
//         customerPhone.includes(query) ||
//         ticketNumber.toLowerCase().includes(query) ||
//         model.toLowerCase().includes(query) ||
//         deviceType.toLowerCase().includes(query) ||
//         String(job.issueDescription || "")
//           .toLowerCase()
//           .includes(query) ||
//         branchName.toLowerCase().includes(query);

//       const matchesStatus =
//         statusFilter === "ALL" ||
//         normalizeStatus(job.status) ===
//           normalizeStatus(statusFilter);

//       return matchesSearch && matchesStatus;
//     });
//   }, [
//     myAssignedJobs,
//     searchTerm,
//     statusFilter,
//     getBranchLabel,
//   ]);

//   // ====================================================
//   // ISSUE MORE / LESS
//   // ====================================================

//   const toggleIssue = (repairId) => {
//     setExpandedIssues((previous) => ({
//       ...previous,
//       [repairId]: !previous[repairId],
//     }));
//   };

//   const ISSUE_PREVIEW_LENGTH = 115;

//   const getIssueText = (job) =>
//     String(
//       job.issueDescription ||
//       job.problemDescription ||
//       job.issue ||
//       ""
//     ).trim();

//   // ====================================================
//   // UPDATE REPAIR STATUS
//   // ====================================================

//   const handleStatusChange = async (
//     repairId,
//     newStatus
//   ) => {
//     if (!repairId || !newStatus) return;

//     const existingRepair = repairs.find(
//       (repair) => repair._id === repairId
//     );

//     if (!existingRepair) {
//       toast.error("Repair ticket not found.");
//       return;
//     }

//     if (existingRepair.status === newStatus) {
//       return;
//     }

//     try {
//       setUpdatingId(repairId);

//       const response = await axios.patch(
//         `${BASE_URL}/${repairId}/status`,
//         { status: newStatus },
//         getAuthConfig()
//       );

//       const updatedRepair =
//         response.data?.data ||
//         response.data?.repair;

//       setRepairs((previousRepairs) =>
//         previousRepairs.map((repair) =>
//           repair._id === repairId
//             ? {
//                 ...repair,
//                 ...(updatedRepair || {}),
//                 status:
//                   updatedRepair?.status || newStatus,
//               }
//             : repair
//         )
//       );

//       toast.success(
//         `Repair status updated to "${newStatus}".`
//       );
//     } catch (error) {
//       console.error(
//         "UPDATE REPAIR STATUS ERROR:",
//         error.response?.data || error
//       );

//       toast.error(
//         error.response?.data?.message ||
//         "Failed to update repair status."
//       );
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   // ====================================================
//   // SUMMARY COUNTS
//   // ====================================================

//   const pendingCount = myAssignedJobs.filter((job) =>
//     [
//       "received",
//       "assigned",
//       "in progress",
//       "waiting for parts",
//     ].includes(normalizeStatus(job.status))
//   ).length;

//   const completedCount = myAssignedJobs.filter((job) =>
//     [
//       "completed",
//       "delivered",
//     ].includes(normalizeStatus(job.status))
//   ).length;

//   // ====================================================
//   // RENDER
//   // ====================================================

//   return (
//     <div className="tat-container">

//       {/* HEADER */}

//       <header className="tat-header">
//         <div>
//           <span className="tat-eyebrow">
//             TECHNICIAN WORKBENCH
//           </span>

//           <h1>My Assigned Repair Tasks</h1>

//           <p>
//             Logged in as:{" "}
//             <strong>
//               {getDisplayName(loggedInUser)}
//             </strong>{" "}
//             • Review and update device repairs assigned
//             to you.
//           </p>
//         </div>

//         <button
//           type="button"
//           className="tat-btn-refresh"
//           onClick={() => {
//             fetchAssignedRepairs({ showToast: true });
//             fetchBranches();
//           }}
//           disabled={loading}
//         >
//           <FiRefreshCw
//             className={loading ? "tat-spin" : ""}
//           />

//           <span>
//             {loading ? "Syncing..." : "Sync Tasks"}
//           </span>
//         </button>
//       </header>

//       {/* SUMMARY CARDS */}

//       <section className="tat-metrics">

//         <div className="tat-metric-card">
//           <div className="tat-metric-icon icon-blue">
//             <FiTool />
//           </div>

//           <div>
//             <span className="tat-metric-label">
//               Total Assigned Jobs
//             </span>

//             <strong className="tat-metric-count">
//               {myAssignedJobs.length}
//             </strong>
//           </div>
//         </div>

//         <div className="tat-metric-card">
//           <div className="tat-metric-icon icon-amber">
//             <FiClock />
//           </div>

//           <div>
//             <span className="tat-metric-label">
//               In Progress / Pending
//             </span>

//             <strong className="tat-metric-count">
//               {pendingCount}
//             </strong>
//           </div>
//         </div>

//         <div className="tat-metric-card">
//           <div className="tat-metric-icon icon-green">
//             <FiCheckCircle />
//           </div>

//           <div>
//             <span className="tat-metric-label">
//               Completed / Delivered
//             </span>

//             <strong className="tat-metric-count">
//               {completedCount}
//             </strong>
//           </div>
//         </div>

//       </section>

//       {/* TASK TABLE */}

//       <section className="tat-card">

//         <div className="tat-toolbar">

//           <div className="tat-search-wrap">
//             <FiSearch className="tat-search-ico" />

//             <input
//               type="text"
//               placeholder="Search customer, phone, device, ticket, branch..."
//               value={searchTerm}
//               onChange={(event) =>
//                 setSearchTerm(event.target.value)
//               }
//             />
//           </div>

//           <div className="tat-filter-wrap">
//             <select
//               value={statusFilter}
//               onChange={(event) =>
//                 setStatusFilter(event.target.value)
//               }
//               className="tat-select"
//             >
//               <option value="ALL">
//                 All Statuses
//               </option>

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
//             <div className="tat-spinner" />
//             <p>Loading your assigned repair tickets...</p>
//           </div>
//         ) : filteredJobs.length === 0 ? (
//           <div className="tat-state-box">
//             <div className="tat-empty-icon">
//               <FiInbox />
//             </div>

//             <h3>No Assigned Jobs Found</h3>

//             <p>
//               There are currently no repair tickets assigned
//               to your profile, or no tickets match your filters.
//             </p>
//           </div>
//         ) : (
//           <div className="tat-table-wrap">

//             <table className="tat-table">

//               <thead>
//                 <tr>
//                   <th>Job Ticket</th>
//                   <th>Customer Information</th>
//                   <th>Device / Hardware</th>
//                   <th>Branch</th>
//                   <th>Reported Issue</th>
//                   <th>Counter Remarks</th>
//                   <th>Job Date</th>
//                   <th>Est. Target Date</th>
//                   <th>Current Status</th>
//                   <th className="tat-th-right">
//                     Update Status
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredJobs.map((job) => {
//                   const issueText = getIssueText(job);
//                   const isExpanded =
//                     Boolean(expandedIssues[job._id]);

//                   const isLongIssue =
//                     issueText.length > ISSUE_PREVIEW_LENGTH;

//                   const displayedIssue =
//                     isLongIssue && !isExpanded
//                       ? `${issueText.slice(
//                           0,
//                           ISSUE_PREVIEW_LENGTH
//                         ).trim()}...`
//                       : issueText;

//                   return (
//                     <tr key={job._id}>

//                       {/* JOB TICKET */}

//                       <td>
//                         <span className="tat-ticket-code">
//                           {job.repairNumber ||
//                             job._id?.slice(-6).toUpperCase() ||
//                             "N/A"}
//                         </span>
//                       </td>

//                       {/* CUSTOMER */}

//                       <td>
//                         <div className="tat-customer-cell">
//                           <strong>
//                             {job.customerName ||
//                               "Walk-in Customer"}
//                           </strong>

//                           <span className="tat-sub-txt">
//                             <FiPhone />
//                             {job.customerPhone || "No phone"}
//                           </span>

//                           {job.customerEmail && (
//                             <span className="tat-sub-txt">
//                               <FiMail />
//                               {job.customerEmail}
//                             </span>
//                           )}
//                         </div>
//                       </td>

//                       {/* DEVICE */}

//                       <td>
//                         <div className="tat-customer-cell">
//                           <strong className="tat-device-name">
//                             {job.deviceType || "Device"}
//                           </strong>

//                           <span className="tat-sub-txt">
//                             <FiMonitor />
//                             {job.deviceModel ||
//                               job.laptopModel ||
//                               "Hardware not specified"}
//                           </span>

//                           {job.serialNumber && (
//                             <span className="tat-sub-txt">
//                               S/N: {job.serialNumber}
//                             </span>
//                           )}
//                         </div>
//                       </td>

//                       {/* BRANCH */}

//                       <td>
//                         <div className="tat-branch-cell">
//                           <span className="tat-branch-icon">
//                             <FiMapPin />
//                           </span>

//                           <div className="tat-branch-details">
//                             <strong>
//                               {getBranchLabel(job)}
//                             </strong>

//                             {getBranchDetails(job)?.address && (
//                               <span>
//                                 {getBranchDetails(job).address}
//                               </span>
//                             )}

//                             {branchesLoading && (
//                               <small>Loading branch...</small>
//                             )}
//                           </div>
//                         </div>
//                       </td>

//                       {/* REPORTED ISSUE + MORE / LESS */}

//                       <td className="tat-issue-col">
//                         <div className="tat-issue-box">
//                           <FiAlertCircle className="tat-issue-icon" />

//                           <div className="tat-issue-content">
//                             <span className="tat-issue-text">
//                               {displayedIssue ||
//                                 "No issue details"}
//                             </span>

//                             {isLongIssue && (
//                               <button
//                                 type="button"
//                                 className="tat-more-btn"
//                                 onClick={() =>
//                                   toggleIssue(job._id)
//                                 }
//                               >
//                                 {isExpanded ? (
//                                   <>
//                                     Less <FiChevronUp />
//                                   </>
//                                 ) : (
//                                   <>
//                                     More <FiChevronDown />
//                                   </>
//                                 )}
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </td>

//                       {/* COUNTER REMARKS */}

//                       <td className="tat-remarks-col">
//                         {job.remarks ? (
//                           <span className="tat-remarks-tag">
//                             {job.remarks}
//                           </span>
//                         ) : (
//                           <span className="tat-muted-dash">
//                             —
//                           </span>
//                         )}
//                       </td>

//                       {/* JOB DATE */}

//                       <td>
//                         <span className="tat-date-badge">
//                           <FiCalendar />
//                           {formatDate(
//                             job.jobDate || job.createdAt
//                           )}
//                         </span>
//                       </td>

//                       {/* TARGET DATE */}

//                       <td>
//                         <span className="tat-date-badge">
//                           <FiCalendar />
//                           {formatDate(
//                             job.estimatedCompletionDate
//                           )}
//                         </span>
//                       </td>

//                       {/* STATUS */}

//                       <td>
//                         <span
//                           className={`tat-status-pill ${getStatusClass(
//                             job.status
//                           )}`}
//                         >
//                           {job.status || "Received"}
//                         </span>
//                       </td>

//                       {/* UPDATE STATUS */}

//                       <td className="tat-td-right">
//                         <select
//                           className="tat-status-changer"
//                           value={job.status || "Received"}
//                           disabled={updatingId === job._id}
//                           onChange={(event) =>
//                             handleStatusChange(
//                               job._id,
//                               event.target.value
//                             )
//                           }
//                         >
//                           {STATUS_OPTIONS.map((status) => (
//                             <option
//                               key={status}
//                               value={status}
//                             >
//                               {status}
//                             </option>
//                           ))}
//                         </select>

//                         {updatingId === job._id && (
//                           <span className="tat-sub-txt tat-updating">
//                             Updating...
//                           </span>
//                         )}
//                       </td>

//                     </tr>
//                   );
//                 })}
//               </tbody>

//             </table>
//           </div>
//         )}

//         <div className="tat-table-footer">
//           Showing {filteredJobs.length} of {myAssignedJobs.length} assigned tasks
//         </div>

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
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

import { toast } from "react-toastify";
import "./TechnicianWorkOrders2.css";

// ======================================================
// API CONFIG
// ======================================================

const API_URL = String(
  import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

const BASE_URL = `${API_URL}/newRepair`;
const BRANCH_URL = `${API_URL}/branches`;

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
// AUTH HELPERS
// ======================================================

const getAuthToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  "";

const getAuthConfig = () => {
  const token = getAuthToken();

  return {
    headers: {
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    },
  };
};

// ======================================================
// COMMON HELPERS
// ======================================================

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return String(
      value._id ||
      value.id ||
      value.$oid ||
      ""
    );
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
  user?.username ||
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
  String(status || "Received")
    .trim()
    .toLowerCase();

const getStatusClass = (status) =>
  `tat-status-${normalizeStatus(status).replace(/\s+/g, "-")}`;

// ======================================================
// RESPONSE EXTRACTION HELPERS
// ======================================================

const extractRepairs = (responseData) => {
  const candidates = [
    responseData?.repairs,
    responseData?.data?.repairs,
    responseData?.data?.data?.repairs,
    responseData?.results,
    responseData?.data?.results,
    responseData?.data,
    responseData,
  ];

  return candidates.find(Array.isArray) || [];
};

const extractBranches = (responseData) => {
  const candidates = [
    responseData?.branches,
    responseData?.data?.branches,
    responseData?.data?.data?.branches,
    responseData?.results,
    responseData?.data?.results,
    responseData?.data,
    responseData,
  ];

  return candidates.find(Array.isArray) || [];
};

// ======================================================
// BRANCH HELPERS
// ======================================================

const getBranchName = (branch) => {
  if (!branch || typeof branch !== "object") {
    return "";
  }

  return (
    branch.name ||
    branch.branchName ||
    branch.title ||
    branch.locationName ||
    ""
  );
};

const getBranchCode = (branch) => {
  if (!branch || typeof branch !== "object") {
    return "";
  }

  return (
    branch.code ||
    branch.branchCode ||
    ""
  );
};

const getBranchAddress = (branch) => {
  if (!branch || typeof branch !== "object") {
    return "";
  }

  const address = branch.address;

  if (typeof address === "string") {
    return address;
  }

  if (address && typeof address === "object") {
    return [
      address.addressLine1,
      address.addressLine2,
      address.street,
      address.city,
      address.state,
      address.pincode,
    ]
      .filter(Boolean)
      .join(", ");
  }

  return [
    branch.addressLine1,
    branch.addressLine2,
    branch.city,
    branch.state,
    branch.pincode,
  ]
    .filter(Boolean)
    .join(", ");
};

const getBranchPhone = (branch) =>
  branch?.phone ||
  branch?.phoneNumber ||
  branch?.mobile ||
  "";

const getBranchEmail = (branch) =>
  branch?.email ||
  branch?.branchEmail ||
  "";

const getBranchCityState = (branch) =>
  [
    branch?.city,
    branch?.state,
  ]
    .filter(Boolean)
    .join(", ");

const getRepairBranchValue = (repair) =>
  repair?.branchId ||
  repair?.branch ||
  repair?.branchDetails ||
  repair?.branchInfo ||
  null;

// ======================================================
// COMPONENT
// ======================================================

export default function TechnicianAssignedTasks() {
  const [repairs, setRepairs] = useState([]);
  const [branches, setBranches] = useState([]);

  const [loading, setLoading] = useState(true);
  const [branchesLoading, setBranchesLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [updatingId, setUpdatingId] = useState(null);

  // Expanded issue descriptions
  const [expandedIssues, setExpandedIssues] = useState({});

  // ====================================================
  // LOGGED-IN USER
  // ====================================================

  const loggedInUser = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "{}"
      );
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
  // BRANCH LOOKUP
  // ====================================================

  const getBranchDetails = useCallback(
    (repair) => {
      const branchValue = getRepairBranchValue(repair);

      if (!branchValue) {
        return null;
      }

      // Case 1: Populated branch document
      if (
        typeof branchValue === "object" &&
        !Array.isArray(branchValue)
      ) {
        const populatedName = getBranchName(branchValue);

        // If the branch is populated with its name,
        // return it directly.
        if (populatedName) {
          return branchValue;
        }

        // Sometimes branchId is an object containing
        // only _id. Try finding the full branch below.
      }

      // Case 2: Branch ID stored as string or object
      const branchId = getId(branchValue);

      if (!branchId) {
        return null;
      }

      const foundBranch = branches.find(
        (branch) => getId(branch) === branchId
      );

      if (foundBranch) {
        return foundBranch;
      }

      // Case 3: Branch object exists but is not fully populated.
      // Return it as fallback so any available details show.
      if (
        typeof branchValue === "object" &&
        !Array.isArray(branchValue)
      ) {
        return branchValue;
      }

      return null;
    },
    [branches]
  );

  // ====================================================
  // BRANCH LABEL
  // ====================================================

  const getBranchLabel = useCallback(
    (repair) => {
      const branchValue = getRepairBranchValue(repair);
      const branch = getBranchDetails(repair);

      if (branch) {
        const name = getBranchName(branch);
        const code = getBranchCode(branch);

        if (name && code) {
          return `${name} (${code})`;
        }

        if (name) {
          return name;
        }

        if (code) {
          return code;
        }
      }

      const branchId = getId(branchValue);

      if (branchId) {
        return `Branch ID: ${branchId.slice(-6)}`;
      }

      // Legacy fallback, if old records stored branch name directly.
      if (repair?.branchName) {
        return repair.branchName;
      }

      return "Branch not assigned";
    },
    [getBranchDetails]
  );

  // ====================================================
  // FETCH BRANCHES
  // ====================================================

  const fetchBranches = useCallback(async () => {
    if (!API_URL) {
      console.warn(
        "VITE_API_URL is not configured. Branches cannot be loaded."
      );
      return;
    }

    if (!getAuthToken()) {
      return;
    }

    try {
      setBranchesLoading(true);

      const response = await axios.get(
        BRANCH_URL,
        getAuthConfig()
      );

      const data = extractBranches(response.data);

      // Remove deleted/invalid records.
      // Keep inactive branches too because older repair
      // tickets may belong to a branch that is now inactive.
      const validBranches = data.filter(
        (branch) =>
          branch &&
          typeof branch === "object" &&
          branch.isDeleted !== true
      );

      setBranches(validBranches);

      console.log(
        "TECHNICIAN BRANCHES:",
        validBranches
      );
    } catch (error) {
      console.error(
        "FETCH BRANCHES ERROR:",
        error.response?.data || error
      );

      setBranches([]);

      const statusCode = error.response?.status;

      if (statusCode === 401) {
        toast.error(
          "Session expired. Please log in again."
        );
      } else if (statusCode === 403) {
        console.warn(
          "Logged-in technician does not have permission to access the branch list."
        );
      }
    } finally {
      setBranchesLoading(false);
    }
  }, []);

  // ====================================================
  // FETCH ASSIGNED REPAIRS
  // ====================================================

  const fetchAssignedRepairs = useCallback(
    async ({ showToast = false } = {}) => {
      if (!API_URL) {
        toast.error(
          "VITE_API_URL is not configured."
        );

        setLoading(false);
        return;
      }

      if (!getAuthToken()) {
        setRepairs([]);
        setLoading(false);

        toast.error(
          "Session expired. Please log in again."
        );

        return;
      }

      try {
        setLoading(true);

        const response = await axios.get(
          `${BASE_URL}/my-assigned-repairs`,
          getAuthConfig()
        );

        const data = extractRepairs(response.data);

        console.log(
          "ASSIGNED REPAIRS RESPONSE:",
          response.data
        );

        console.log(
          "EXTRACTED ASSIGNED REPAIRS:",
          data
        );

        setRepairs(data);

        if (showToast) {
          toast.success(
            "Assigned repair tasks refreshed."
          );
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

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    fetchAssignedRepairs();
    fetchBranches();
  }, [
    fetchAssignedRepairs,
    fetchBranches,
  ]);

  // ====================================================
  // VERIFY ASSIGNMENT
  // ====================================================

  const myAssignedJobs = useMemo(() => {
    return repairs.filter((repair) => {
      const assignedId = getId(
        repair.assignedTechnician
      );

      // Primary check: technician ID
      if (loggedInTechId && assignedId) {
        return assignedId === loggedInTechId;
      }

      // Fallback: technician name
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

      const branchName = getBranchLabel(job);

      const branch = getBranchDetails(job);

      const branchAddress = getBranchAddress(branch);

      const branchCode = getBranchCode(branch);

      const matchesSearch =
        !query ||
        customerName.toLowerCase().includes(query) ||
        customerPhone.includes(query) ||
        ticketNumber.toLowerCase().includes(query) ||
        model.toLowerCase().includes(query) ||
        deviceType.toLowerCase().includes(query) ||
        String(job.issueDescription || "")
          .toLowerCase()
          .includes(query) ||
        String(job.remarks || "")
          .toLowerCase()
          .includes(query) ||
        branchName.toLowerCase().includes(query) ||
        branchAddress.toLowerCase().includes(query) ||
        branchCode.toLowerCase().includes(query);

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
    getBranchLabel,
    getBranchDetails,
  ]);

  // ====================================================
  // ISSUE MORE / LESS
  // ====================================================

  const toggleIssue = (repairId) => {
    setExpandedIssues((previous) => ({
      ...previous,
      [repairId]: !previous[repairId],
    }));
  };

  const ISSUE_PREVIEW_LENGTH = 115;

  const getIssueText = (job) =>
    String(
      job.issueDescription ||
      job.problemDescription ||
      job.issue ||
      ""
    ).trim();

  // ====================================================
  // UPDATE REPAIR STATUS
  // ====================================================

  const handleStatusChange = async (
    repairId,
    newStatus
  ) => {
    if (!repairId || !newStatus) {
      return;
    }

    const existingRepair = repairs.find(
      (repair) => repair._id === repairId
    );

    if (!existingRepair) {
      toast.error("Repair ticket not found.");
      return;
    }

    if (
      normalizeStatus(existingRepair.status) ===
      normalizeStatus(newStatus)
    ) {
      return;
    }

    try {
      setUpdatingId(repairId);

      const response = await axios.patch(
        `${BASE_URL}/${repairId}/status`,
        {
          status: newStatus,
        },
        getAuthConfig()
      );

      const updatedRepair =
        response.data?.repair ||
        response.data?.data?.repair ||
        response.data?.data ||
        null;

      setRepairs((previousRepairs) =>
        previousRepairs.map((repair) =>
          repair._id === repairId
            ? {
                ...repair,
                ...(updatedRepair &&
                typeof updatedRepair === "object"
                  ? updatedRepair
                  : {}),
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

      toast.error(
        error.response?.data?.message ||
        "Failed to update repair status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ====================================================
  // SUMMARY COUNTS
  // ====================================================

  const pendingCount = myAssignedJobs.filter(
    (job) =>
      [
        "received",
        "assigned",
        "in progress",
        "waiting for parts",
      ].includes(normalizeStatus(job.status))
  ).length;

  const completedCount = myAssignedJobs.filter(
    (job) =>
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

      {/* HEADER */}

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
          onClick={() => {
            fetchAssignedRepairs({
              showToast: true,
            });

            fetchBranches();
          }}
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
              placeholder="Search customer, phone, device, ticket, branch..."
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
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>
          </div>

        </div>

        {loading ? (
          <div className="tat-state-box">
            <div className="tat-spinner" />

            <p>
              Loading your assigned repair tickets...
            </p>
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
                  <th>Branch</th>
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
                {filteredJobs.map((job) => {
                  const issueText = getIssueText(job);

                  const isExpanded = Boolean(
                    expandedIssues[job._id]
                  );

                  const isLongIssue =
                    issueText.length >
                    ISSUE_PREVIEW_LENGTH;

                  const displayedIssue =
                    isLongIssue && !isExpanded
                      ? `${issueText
                          .slice(
                            0,
                            ISSUE_PREVIEW_LENGTH
                          )
                          .trim()}...`
                      : issueText;

                  const branch = getBranchDetails(job);

                  const branchName =
                    getBranchLabel(job);

                  const branchAddress =
                    getBranchAddress(branch);

                  const branchPhone =
                    getBranchPhone(branch);

                  const branchEmail =
                    getBranchEmail(branch);

                  const branchCityState =
                    getBranchCityState(branch);

                  const branchCode =
                    getBranchCode(branch);

                  return (
                    <tr key={job._id}>

                      {/* JOB TICKET */}

                      <td>
                        <span className="tat-ticket-code">
                          {job.repairNumber ||
                            job._id
                              ?.slice(-6)
                              .toUpperCase() ||
                            "N/A"}
                        </span>
                      </td>

                      {/* CUSTOMER */}

                      <td>
                        <div className="tat-customer-cell">
                          <strong>
                            {job.customerName ||
                              "Walk-in Customer"}
                          </strong>

                          <span className="tat-sub-txt">
                            <FiPhone />
                            {job.customerPhone ||
                              "No phone"}
                          </span>

                          {job.customerEmail && (
                            <span className="tat-sub-txt">
                              <FiMail />
                              {job.customerEmail}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* DEVICE */}

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

                          {job.deviceBrand && (
                            <span className="tat-sub-txt">
                              Brand: {job.deviceBrand}
                            </span>
                          )}

                          {job.serialNumber && (
                            <span className="tat-sub-txt">
                              S/N: {job.serialNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* BRANCH */}

                      <td>
                        <div className="tat-branch-cell">
                          <span className="tat-branch-icon">
                            <FiMapPin />
                          </span>

                          <div className="tat-branch-details">

                            <strong>
                              {branchName}
                            </strong>

                            {branchCode && (
                              <span>
                                Code: {branchCode}
                              </span>
                            )}

                            {branchAddress && (
                              <span>
                                {branchAddress}
                              </span>
                            )}

                            {branchCityState && (
                              <span>
                                {branchCityState}
                              </span>
                            )}

                            {branchPhone && (
                              <span>
                                <FiPhone />
                                {branchPhone}
                              </span>
                            )}

                            {branchEmail && (
                              <span>
                                <FiMail />
                                {branchEmail}
                              </span>
                            )}

                            {!branch &&
                              branchesLoading && (
                                <small>
                                  Loading branch...
                                </small>
                              )}

                            {!branch &&
                              !branchesLoading &&
                              !getId(
                                getRepairBranchValue(job)
                              ) && (
                                <small>
                                  No branch assigned
                                </small>
                              )}

                          </div>
                        </div>
                      </td>

                      {/* REPORTED ISSUE + MORE / LESS */}

                      <td className="tat-issue-col">
                        <div className="tat-issue-box">
                          <FiAlertCircle className="tat-issue-icon" />

                          <div className="tat-issue-content">
                            <span className="tat-issue-text">
                              {displayedIssue ||
                                "No issue details"}
                            </span>

                            {isLongIssue && (
                              <button
                                type="button"
                                className="tat-more-btn"
                                onClick={() =>
                                  toggleIssue(job._id)
                                }
                              >
                                {isExpanded ? (
                                  <>
                                    Less <FiChevronUp />
                                  </>
                                ) : (
                                  <>
                                    More <FiChevronDown />
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* COUNTER REMARKS */}

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

                      {/* JOB DATE */}

                      <td>
                        <span className="tat-date-badge">
                          <FiCalendar />

                          {formatDate(
                            job.jobDate || job.createdAt
                          )}
                        </span>
                      </td>

                      {/* TARGET DATE */}

                      <td>
                        <span className="tat-date-badge">
                          <FiCalendar />

                          {formatDate(
                            job.estimatedCompletionDate
                          )}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`tat-status-pill ${getStatusClass(
                            job.status
                          )}`}
                        >
                          {job.status || "Received"}
                        </span>
                      </td>

                      {/* UPDATE STATUS */}

                      <td className="tat-td-right">
                        <select
                          className="tat-status-changer"
                          value={
                            job.status || "Received"
                          }
                          disabled={
                            updatingId === job._id
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              job._id,
                              event.target.value
                            )
                          }
                        >
                          {STATUS_OPTIONS.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>

                        {updatingId === job._id && (
                          <span className="tat-sub-txt tat-updating">
                            Updating...
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}

        <div className="tat-table-footer">
          Showing {filteredJobs.length} of{" "}
          {myAssignedJobs.length} assigned tasks
        </div>

      </section>
    </div>
  );
}
