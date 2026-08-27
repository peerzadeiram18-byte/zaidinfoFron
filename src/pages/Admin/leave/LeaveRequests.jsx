// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import {
//   getAllLeaves,
//   approveLeave,
//   rejectLeave,
// } from "../../../services/leaveService";
// import "./LeaveRequests.css";

// const LeaveRequests = () => {
//   // ======================================================
//   // STATES
//   // ======================================================

//   const [leaves, setLeaves] = useState([]);

//   const [loading, setLoading] = useState(false);

//   const [processingId, setProcessingId] = useState(null);

//   const [error, setError] = useState("");

//   const [filter, setFilter] = useState("ALL");

//   const [showModal, setShowModal] = useState(false);

//   const [selectedLeave, setSelectedLeave] = useState(null);

//   const [actionType, setActionType] = useState("");

//   const [adminRemark, setAdminRemark] = useState("");

//   // ======================================================
//   // TOKEN
//   // ======================================================

//   const getToken = () => {
//     return localStorage.getItem("token");
//   };

//   // ======================================================
//   // LOAD LEAVE REQUESTS
//   // ======================================================

//   const loadLeaves = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = getToken();

//       console.log("=================================");
//       console.log("LOAD ADMIN LEAVE REQUESTS");
//       console.log("TOKEN EXISTS:", Boolean(token));
//       console.log("=================================");

//       if (!token) {
//         throw new Error(
//           "Authentication token missing. Please login again."
//         );
//       }

//       const response = await getAllLeaves();

//       console.log("ALL LEAVES RESPONSE:", response);

//       const list = Array.isArray(response?.leaves)
//         ? response.leaves
//         : Array.isArray(response?.data)
//         ? response.data
//         : Array.isArray(response)
//         ? response
//         : [];

//       setLeaves(list);
//     } catch (error) {
//       console.error("LOAD LEAVES ERROR:", error);

//       const message =
//         error?.response?.data?.message ||
//         error?.message ||
//         "Failed to load leave requests.";

//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ======================================================
//   // INITIAL LOAD
//   // ======================================================

//   useEffect(() => {
//     loadLeaves();
//   }, []);

//   // ======================================================
//   // STATUS
//   // ======================================================

//   const getStatus = (leave) => {
//     return (
//       leave?.status ||
//       leave?.leaveStatus ||
//       "PENDING"
//     ).toUpperCase();
//   };

//   // ======================================================
//   // FILTER
//   // ======================================================

//   const filteredLeaves =
//     filter === "ALL"
//       ? leaves
//       : leaves.filter(
//           (leave) => getStatus(leave) === filter
//         );

//   // ======================================================
//   // COUNTS
//   // ======================================================

//   const totalCount = leaves.length;

//   const pendingCount = leaves.filter(
//     (leave) => getStatus(leave) === "PENDING"
//   ).length;

//   const approvedCount = leaves.filter(
//     (leave) => getStatus(leave) === "APPROVED"
//   ).length;

//   const rejectedCount = leaves.filter(
//     (leave) => getStatus(leave) === "REJECTED"
//   ).length;

//   // ======================================================
//   // EMPLOYEE NAME
//   // ======================================================

//   const getEmployeeName = (leave) => {
//     const employee =
//       leave?.employee ||
//       leave?.user ||
//       leave?.appliedBy;

//     if (!employee) {
//       return "Unknown Employee";
//     }

//     if (
//       employee.firstName ||
//       employee.lastName
//     ) {
//       return `${employee.firstName || ""} ${
//         employee.lastName || ""
//       }`.trim();
//     }

//     if (employee.name) {
//       return employee.name;
//     }

//     return employee.email || "Employee";
//   };

//   // ======================================================
//   // EMPLOYEE EMAIL
//   // ======================================================

//   const getEmployeeEmail = (leave) => {
//     const employee =
//       leave?.employee ||
//       leave?.user ||
//       leave?.appliedBy;

//     return employee?.email || "-";
//   };

//   // ======================================================
//   // LEAVE TYPE
//   // ======================================================

//   const getLeaveTypeLabel = (type) => {
//     const labels = {
//       CASUAL: "Casual Leave",
//       SICK: "Sick Leave",
//       EARNED: "Earned Leave",
//       UNPAID: "Unpaid Leave",
//       OTHER: "Other",
//     };

//     return (
//       labels[type] ||
//       type
//         ?.replaceAll("_", " ")
//         ?.replace(
//           /\b\w/g,
//           (char) => char.toUpperCase()
//         ) ||
//       "-"
//     );
//   };

//   // ======================================================
//   // DATE FORMAT
//   // ======================================================

//   const formatDate = (date) => {
//     if (!date) {
//       return "-";
//     }

//     const parsedDate = new Date(date);

//     if (Number.isNaN(parsedDate.getTime())) {
//       return "-";
//     }

//     return parsedDate.toLocaleDateString(
//       "en-IN",
//       {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       }
//     );
//   };

//   // ======================================================
//   // DAYS
//   // ======================================================

//   const getDays = (leave) => {
//     if (
//       leave?.totalDays !== undefined &&
//       leave?.totalDays !== null
//     ) {
//       return leave.totalDays;
//     }

//     if (
//       leave?.days !== undefined &&
//       leave?.days !== null
//     ) {
//       return leave.days;
//     }

//     if (
//       leave?.startDate &&
//       leave?.endDate
//     ) {
//       const start = new Date(leave.startDate);
//       const end = new Date(leave.endDate);

//       const difference =
//         end.getTime() - start.getTime();

//       return (
//         Math.floor(
//           difference / (1000 * 60 * 60 * 24)
//         ) + 1
//       );
//     }

//     return "-";
//   };

//   // ======================================================
//   // OPEN APPROVE MODAL
//   // ======================================================

//   const openApproveModal = (leave) => {
//     setSelectedLeave(leave);
//     setActionType("APPROVE");
//     setAdminRemark("");
//     setShowModal(true);
//   };

//   // ======================================================
//   // OPEN REJECT MODAL
//   // ======================================================

//   const openRejectModal = (leave) => {
//     setSelectedLeave(leave);
//     setActionType("REJECT");
//     setAdminRemark("");
//     setShowModal(true);
//   };

//   // ======================================================
//   // CLOSE MODAL
//   // ======================================================

//   const closeModal = () => {
//     if (processingId) {
//       return;
//     }

//     setShowModal(false);
//     setSelectedLeave(null);
//     setActionType("");
//     setAdminRemark("");
//   };

//   // ======================================================
//   // APPROVE / REJECT
//   // ======================================================

//   const handleAction = async () => {
//     if (!selectedLeave?._id) {
//       toast.error("Invalid leave request.");
//       return;
//     }

//     try {
//       setProcessingId(selectedLeave._id);
//       setError("");

//       console.log("=================================");
//       console.log("LEAVE ACTION");
//       console.log("ID:", selectedLeave._id);
//       console.log("ACTION:", actionType);
//       console.log("REMARK:", adminRemark);
//       console.log("=================================");

//       if (actionType === "APPROVE") {
//         await approveLeave(
//           selectedLeave._id,
//           adminRemark
//         );

//         toast.success(
//           "Leave request approved successfully."
//         );
//       } else {
//         await rejectLeave(
//           selectedLeave._id,
//           adminRemark
//         );

//         toast.success(
//           "Leave request rejected successfully."
//         );
//       }

//       closeModal();

//       await loadLeaves();
//     } catch (error) {
//       console.error(
//         "LEAVE ACTION ERROR:",
//         error
//       );

//       const message =
//         error?.response?.data?.message ||
//         error?.message ||
//         "Failed to update leave request.";

//       setError(message);

//       toast.error(message);
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   // ======================================================
//   // RENDER
//   // ======================================================

//   return (
//     <div className="leave-requests-page">

//       {/* ==================================================
//           HEADER
//       ================================================== */}

//       <div className="leave-requests-header">

//         <div>
//           <h1>Leave Requests</h1>

//           <p>
//             Review and manage employee leave
//             applications.
//           </p>
//         </div>

//         <button
//           type="button"
//           className="leave-request-refresh-btn"
//           onClick={loadLeaves}
//           disabled={loading}
//         >
//           ↻ Refresh
//         </button>

//       </div>

//       {/* ==================================================
//           ERROR
//       ================================================== */}

//       {error && (
//         <div className="leave-request-error">
//           {error}
//         </div>
//       )}

//       {/* ==================================================
//           SUMMARY
//       ================================================== */}

//       <div className="leave-request-summary">

//         <div className="leave-request-summary-card">
//           <span>Total Requests</span>
//           <strong>{totalCount}</strong>
//         </div>

//         <div className="leave-request-summary-card pending">
//           <span>Pending</span>
//           <strong>{pendingCount}</strong>
//         </div>

//         <div className="leave-request-summary-card approved">
//           <span>Approved</span>
//           <strong>{approvedCount}</strong>
//         </div>

//         <div className="leave-request-summary-card rejected">
//           <span>Rejected</span>
//           <strong>{rejectedCount}</strong>
//         </div>

//       </div>

//       {/* ==================================================
//           FILTER
//       ================================================== */}

//       <div className="leave-request-filter-card">

//         <div className="leave-request-filter-title">
//           Filter Requests
//         </div>

//         <div className="leave-request-filter-buttons">

//           <button
//             className={
//               filter === "ALL"
//                 ? "active"
//                 : ""
//             }
//             onClick={() => setFilter("ALL")}
//           >
//             All
//           </button>

//           <button
//             className={
//               filter === "PENDING"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setFilter("PENDING")
//             }
//           >
//             Pending
//           </button>

//           <button
//             className={
//               filter === "APPROVED"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setFilter("APPROVED")
//             }
//           >
//             Approved
//           </button>

//           <button
//             className={
//               filter === "REJECTED"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setFilter("REJECTED")
//             }
//           >
//             Rejected
//           </button>

//         </div>

//       </div>

//       {/* ==================================================
//           TABLE
//       ================================================== */}

//       <div className="leave-request-table-card">

//         <div className="leave-request-table-header">

//           <div>
//             <h2>Employee Leave Applications</h2>

//             <p>
//               Review pending requests and manage
//               employee leave.
//             </p>
//           </div>

//           <span>
//             {filteredLeaves.length} Requests
//           </span>

//         </div>

//         {loading ? (

//           <div className="leave-request-loading">
//             Loading leave requests...
//           </div>

//         ) : filteredLeaves.length === 0 ? (

//           <div className="leave-request-empty">

//             <div className="leave-request-empty-icon">
//               📋
//             </div>

//             <h3>
//               No Leave Requests Found
//             </h3>

//             <p>
//               There are no requests for the
//               selected filter.
//             </p>

//           </div>

//         ) : (

//           <div className="leave-request-table-wrapper">

//             <table className="leave-request-table">

//               <thead>

//                 <tr>
//                   <th>#</th>
//                   <th>Employee</th>
//                   <th>Leave Type</th>
//                   <th>From</th>
//                   <th>To</th>
//                   <th>Days</th>
//                   <th>Reason</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>

//               </thead>

//               <tbody>

//                 {filteredLeaves.map(
//                   (leave, index) => {

//                     const status =
//                       getStatus(leave);

//                     const isPending =
//                       status === "PENDING";

//                     return (
//                       <tr
//                         key={
//                           leave._id || index
//                         }
//                       >

//                         <td>
//                           {index + 1}
//                         </td>

//                         <td>

//                           <div className="leave-request-employee">

//                             <div className="leave-request-avatar">
//                               {getEmployeeName(
//                                 leave
//                               )
//                                 .charAt(0)
//                                 .toUpperCase()}
//                             </div>

//                             <div>

//                               <strong>
//                                 {getEmployeeName(
//                                   leave
//                                 )}
//                               </strong>

//                               <small>
//                                 {getEmployeeEmail(
//                                   leave
//                                 )}
//                               </small>

//                             </div>

//                           </div>

//                         </td>

//                         <td>
//                           <span className="leave-request-type">
//                             {getLeaveTypeLabel(
//                               leave.leaveType
//                             )}
//                           </span>
//                         </td>

//                         <td>
//                           {formatDate(
//                             leave.startDate
//                           )}
//                         </td>

//                         <td>
//                           {formatDate(
//                             leave.endDate
//                           )}
//                         </td>

//                         <td>
//                           <strong>
//                             {getDays(leave)}
//                           </strong>
//                         </td>

//                         <td>

//                           <span className="leave-request-reason">
//                             {leave.reason ||
//                               leave.description ||
//                               "No reason provided"}
//                           </span>

//                         </td>

//                         <td>

//                           <span
//                             className={`leave-request-status ${status.toLowerCase()}`}
//                           >
//                             {status}
//                           </span>

//                         </td>

//                         <td>

//                           {isPending ? (

//                             <div className="leave-request-actions">

//                               <button
//                                 type="button"
//                                 className="leave-request-approve-btn"
//                                 onClick={() =>
//                                   openApproveModal(
//                                     leave
//                                   )
//                                 }
//                                 disabled={
//                                   processingId ===
//                                   leave._id
//                                 }
//                               >
//                                 Approve
//                               </button>

//                               <button
//                                 type="button"
//                                 className="leave-request-reject-btn"
//                                 onClick={() =>
//                                   openRejectModal(
//                                     leave
//                                   )
//                                 }
//                                 disabled={
//                                   processingId ===
//                                   leave._id
//                                 }
//                               >
//                                 Reject
//                               </button>

//                             </div>

//                           ) : (

//                             <span className="leave-request-completed">
//                               Completed
//                             </span>

//                           )}

//                         </td>

//                       </tr>
//                     );
//                   }
//                 )}

//               </tbody>

//             </table>

//           </div>

//         )}

//       </div>

//       {/* ==================================================
//           APPROVE / REJECT MODAL
//       ================================================== */}

//       {showModal && selectedLeave && (

//         <div
//           className="leave-request-modal-overlay"
//           onClick={closeModal}
//         >

//           <div
//             className="leave-request-modal"
//             onClick={(event) =>
//               event.stopPropagation()
//             }
//           >

//             <div className="leave-request-modal-header">

//               <div>

//                 <h2>
//                   {actionType === "APPROVE"
//                     ? "Approve Leave"
//                     : "Reject Leave"}
//                 </h2>

//                 <p>
//                   {getEmployeeName(
//                     selectedLeave
//                   )}
//                   {" — "}
//                   {getLeaveTypeLabel(
//                     selectedLeave.leaveType
//                   )}
//                 </p>

//               </div>

//               <button
//                 type="button"
//                 className="leave-request-modal-close"
//                 onClick={closeModal}
//                 disabled={Boolean(
//                   processingId
//                 )}
//               >
//                 ×
//               </button>

//             </div>

//             <div className="leave-request-modal-body">

//               <div className="leave-request-detail">

//                 <span>Leave Period</span>

//                 <strong>
//                   {formatDate(
//                     selectedLeave.startDate
//                   )}
//                   {" → "}
//                   {formatDate(
//                     selectedLeave.endDate
//                   )}
//                 </strong>

//               </div>

//               <div className="leave-request-detail">

//                 <span>Total Days</span>

//                 <strong>
//                   {getDays(selectedLeave)}
//                 </strong>

//               </div>

//               <div className="leave-request-detail">

//                 <span>Reason</span>

//                 <strong>
//                   {selectedLeave.reason ||
//                     selectedLeave.description ||
//                     "No reason provided"}
//                 </strong>

//               </div>

//               <div className="leave-request-form-group">

//                 <label>
//                   Admin Remark
//                   {actionType === "REJECT" && (
//                     <span> *</span>
//                   )}
//                 </label>

//                 <textarea
//                   value={adminRemark}
//                   onChange={(event) =>
//                     setAdminRemark(
//                       event.target.value
//                     )
//                   }
//                   placeholder={
//                     actionType === "APPROVE"
//                       ? "Optional remark..."
//                       : "Enter reason for rejection..."
//                   }
//                   rows="4"
//                   disabled={Boolean(
//                     processingId
//                   )}
//                 />

//               </div>

//             </div>

//             <div className="leave-request-modal-actions">

//               <button
//                 type="button"
//                 className="leave-request-cancel-btn"
//                 onClick={closeModal}
//                 disabled={Boolean(
//                   processingId
//                 )}
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 className={
//                   actionType === "APPROVE"
//                     ? "leave-request-confirm-approve"
//                     : "leave-request-confirm-reject"
//                 }
//                 onClick={handleAction}
//                 disabled={Boolean(
//                   processingId
//                 )}
//               >
//                 {processingId
//                   ? "Processing..."
//                   : actionType === "APPROVE"
//                   ? "Approve Leave"
//                   : "Reject Leave"}
//               </button>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>
//   );
// };

// export default LeaveRequests;


import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllLeaves } from "../../../services/leaveService";
import "./LeaveRequests.css";

const LeaveRequests = () => {
  // ======================================================
  // STATES
  // ======================================================

  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(false);

  const [selectedLeave, setSelectedLeave] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [remark, setRemark] = useState("");

  // ======================================================
  // LOAD ALL LEAVE REQUESTS
  // ======================================================

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      console.log("=================================");
      console.log("LOAD ADMIN LEAVE REQUESTS");
      console.log("TOKEN EXISTS:", !!token);
      console.log("=================================");

      const response = await getAllLeaves();

      console.log("ALL LEAVES RESPONSE:", response);

      // --------------------------------------------------
      // SUPPORT DIFFERENT API RESPONSE STRUCTURES
      // --------------------------------------------------

      let list = [];

      if (Array.isArray(response)) {
        list = response;
      } else if (Array.isArray(response?.leaves)) {
        list = response.leaves;
      } else if (Array.isArray(response?.data)) {
        list = response.data;
      } else if (Array.isArray(response?.data?.leaves)) {
        list = response.data.leaves;
      } else if (Array.isArray(response?.data?.data)) {
        list = response.data.data;
      }

      console.log("NORMALIZED LEAVES:", list);

      if (list.length > 0) {
        console.log("FIRST LEAVE:", list[0]);
        console.log("FROM DATE:", list[0]?.fromDate);
        console.log("TO DATE:", list[0]?.toDate);
        console.log("TOTAL DAYS:", list[0]?.totalDays);
      }

      setLeaves(list);
    } catch (error) {
      console.error(
        "LOAD ADMIN LEAVE REQUESTS ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load leave requests."
      );

      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DATE FORMAT
  // ======================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      const parsedDate = new Date(date);

      if (Number.isNaN(parsedDate.getTime())) {
        return "-";
      }

      return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "-";
    }
  };

  // ======================================================
  // GET EMPLOYEE NAME
  // ======================================================

  const getEmployeeName = (leave) => {
    if (leave?.user?.name) {
      return leave.user.name;
    }

    if (leave?.user?.fullName) {
      return leave.user.fullName;
    }

    if (leave?.user?.firstName || leave?.user?.lastName) {
      return `${leave?.user?.firstName || ""} ${
        leave?.user?.lastName || ""
      }`.trim();
    }

    if (leave?.employeeName) {
      return leave.employeeName;
    }

    if (leave?.employee?.name) {
      return leave.employee.name;
    }

    if (leave?.employee?.fullName) {
      return leave.employee.fullName;
    }

    if (leave?.employeeId) {
      return leave.employeeId;
    }

    return "Employee";
  };

  // ======================================================
  // GET EMPLOYEE ID
  // ======================================================

  const getEmployeeId = (leave) => {
    if (leave?.employeeId) {
      return leave.employeeId;
    }

    if (leave?.user?.employeeId) {
      return leave.user.employeeId;
    }

    if (leave?.employee?.employeeId) {
      return leave.employee.employeeId;
    }

    return "-";
  };

  // ======================================================
  // LEAVE TYPE LABEL
  // ======================================================

  const formatLeaveType = (type) => {
    if (!type) {
      return "-";
    }

    return String(type)
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // ======================================================
  // STATUS CLASS
  // ======================================================

  const getStatusClass = (status) => {
    switch (String(status || "").toUpperCase()) {
      case "APPROVED":
        return "approved";

      case "REJECTED":
        return "rejected";

      case "CANCELLED":
        return "cancelled";

      case "PENDING":
      default:
        return "pending";
    }
  };

  // ======================================================
  // OPEN DETAILS
  // ======================================================

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);

    setRemark(
      leave?.adminRemark ||
        leave?.remark ||
        ""
    );

    setShowModal(true);
  };

  // ======================================================
  // CLOSE DETAILS
  // ======================================================

  const handleCloseModal = () => {
    if (actionLoading) {
      return;
    }

    setShowModal(false);

    setSelectedLeave(null);

    setRemark("");
  };

  // ======================================================
  // APPROVE / REJECT
  // ======================================================

  const handleLeaveAction = async (status) => {
    if (!selectedLeave?._id) {
      toast.error("Leave request ID is missing.");
      return;
    }

    if (actionLoading) {
      return;
    }

    const normalizedStatus =
      String(status).toUpperCase();

    if (
      normalizedStatus !== "APPROVED" &&
      normalizedStatus !== "REJECTED"
    ) {
      toast.error("Invalid leave action.");
      return;
    }

    try {
      setActionLoading(true);

      console.log("=================================");
      console.log("LEAVE ACTION");
      console.log("ID:", selectedLeave._id);
      console.log("ACTION:", normalizedStatus);
      console.log("REMARK:", remark);
      console.log("=================================");

      /*
       * IMPORTANT:
       * This keeps the same service function structure.
       *
       * If your existing leaveService expects:
       * updateLeaveStatus(id, status, remark)
       * this will work directly.
       */

      const response = await updateLeaveStatus(
        selectedLeave._id,
        normalizedStatus,
        remark.trim()
      );

      console.log(
        "LEAVE ACTION RESPONSE:",
        response
      );

      toast.success(
        response?.message ||
          `Leave request ${
            normalizedStatus === "APPROVED"
              ? "approved"
              : "rejected"
          } successfully.`
      );

      // --------------------------------------------------
      // CLOSE MODAL
      // --------------------------------------------------

      setShowModal(false);

      setSelectedLeave(null);

      setRemark("");

      // --------------------------------------------------
      // RELOAD LIST
      // --------------------------------------------------

      await loadLeaves();
    } catch (error) {
      console.error(
        "LEAVE ACTION ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update leave request."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="leave-requests">

        <div className="leave-requests-header">
          <div>
            <h2>Leave Requests</h2>

            <p>
              Review and manage employee leave requests.
            </p>
          </div>
        </div>

        <div className="leave-loading">
          <div className="leave-loading-spinner">
            ⏳
          </div>

          <p>
            Loading leave requests...
          </p>
        </div>

      </div>
    );
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="leave-requests">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="leave-requests-header">

        <div>
          <h2>
            Leave Requests
          </h2>

          <p>
            Review and manage employee leave requests.
          </p>
        </div>

        <button
          type="button"
          className="leave-refresh-btn"
          onClick={loadLeaves}
          disabled={loading || actionLoading}
        >
          ↻ Refresh
        </button>

      </div>


      {/* ==================================================
          REQUEST COUNT
      ================================================== */}

      <div className="leave-request-count">
        <strong>
          {leaves.length}
        </strong>

        <span>
          {leaves.length === 1
            ? " Leave Request"
            : " Leave Requests"}
        </span>
      </div>


      {/* ==================================================
          EMPTY STATE
      ================================================== */}

      {leaves.length === 0 ? (
        <div className="leave-empty">

          <div className="leave-empty-icon">
            📋
          </div>

          <h3>
            No Leave Requests
          </h3>

          <p>
            Employee leave requests will appear here.
          </p>

          <button
            type="button"
            className="leave-refresh-btn"
            onClick={loadLeaves}
          >
            ↻ Refresh
          </button>

        </div>
      ) : (

        /* ==================================================
           TABLE
        ================================================== */

        <div className="leave-table-wrapper">

          <table className="leave-table">

            <thead>

              <tr>

                <th>
                  Employee
                </th>

                <th>
                  Employee ID
                </th>

                <th>
                  Leave Type
                </th>

                <th>
                  From Date
                </th>

                <th>
                  To Date
                </th>

                <th>
                  Total Days
                </th>

                <th>
                  Reason
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {leaves.map((leave) => (

                <tr key={leave._id}>

                  {/* EMPLOYEE */}

                  <td>

                    <div className="employee-cell">

                      <div className="employee-avatar">
                        {getEmployeeName(
                          leave
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <strong>
                          {getEmployeeName(
                            leave
                          )}
                        </strong>

                      </div>

                    </div>

                  </td>


                  {/* EMPLOYEE ID */}

                  <td>
                    {getEmployeeId(leave)}
                  </td>


                  {/* LEAVE TYPE */}

                  <td>

                    <span className="leave-type-badge">

                      {formatLeaveType(
                        leave.leaveType
                      )}

                    </span>

                  </td>


                  {/* FROM DATE */}

                  <td>

                    <div className="date-cell">

                      <span className="date-label">
                        From
                      </span>

                      <strong>
                        {formatDate(
                          leave.fromDate
                        )}
                      </strong>

                    </div>

                  </td>


                  {/* TO DATE */}

                  <td>

                    <div className="date-cell">

                      <span className="date-label">
                        To
                      </span>

                      <strong>
                        {formatDate(
                          leave.toDate
                        )}
                      </strong>

                    </div>

                  </td>


                  {/* TOTAL DAYS */}

                  <td>

                    <span className="days-badge">

                      {leave.totalDays ||
                        0}

                      {" "}

                      {Number(
                        leave.totalDays || 0
                      ) === 1
                        ? "Day"
                        : "Days"}

                    </span>

                  </td>


                  {/* REASON */}

                  <td>

                    <div className="reason-cell">

                      {leave.reason
                        ? leave.reason
                        : "-"}

                    </div>

                  </td>


                  {/* STATUS */}

                  <td>

                    <span
                      className={`status-badge ${getStatusClass(
                        leave.status
                      )}`}
                    >

                      {formatLeaveType(
                        leave.status ||
                          "PENDING"
                      )}

                    </span>

                  </td>


                  {/* ACTION */}

                  <td>

                    <button
                      type="button"
                      className="view-leave-btn"
                      onClick={() =>
                        handleViewDetails(
                          leave
                        )
                      }
                    >
                      View
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}


      {/* ==================================================
          DETAILS MODAL
      ================================================== */}

      {showModal &&
        selectedLeave && (

          <div
            className="leave-modal-overlay"
            onMouseDown={(event) => {

              if (
                event.target ===
                event.currentTarget
              ) {
                handleCloseModal();
              }

            }}
          >

            <div className="leave-modal">

              {/* MODAL HEADER */}

              <div className="leave-modal-header">

                <div>

                  <h3>
                    Leave Request Details
                  </h3>

                  <p>
                    Review employee leave information.
                  </p>

                </div>

                <button
                  type="button"
                  className="leave-modal-close"
                  onClick={
                    handleCloseModal
                  }
                  disabled={
                    actionLoading
                  }
                >
                  ×
                </button>

              </div>


              {/* MODAL BODY */}

              <div className="leave-modal-body">

                {/* EMPLOYEE */}

                <div className="detail-section">

                  <h4>
                    Employee Information
                  </h4>

                  <div className="detail-grid">

                    <div className="detail-item">

                      <span>
                        Employee
                      </span>

                      <strong>
                        {getEmployeeName(
                          selectedLeave
                        )}
                      </strong>

                    </div>


                    <div className="detail-item">

                      <span>
                        Employee ID
                      </span>

                      <strong>
                        {getEmployeeId(
                          selectedLeave
                        )}
                      </strong>

                    </div>

                  </div>

                </div>


                {/* LEAVE INFORMATION */}

                <div className="detail-section">

                  <h4>
                    Leave Information
                  </h4>

                  <div className="detail-grid">

                    {/* TYPE */}

                    <div className="detail-item">

                      <span>
                        Leave Type
                      </span>

                      <strong>
                        {formatLeaveType(
                          selectedLeave.leaveType
                        )}
                      </strong>

                    </div>


                    {/* FROM */}

                    <div className="detail-item">

                      <span>
                        From Date
                      </span>

                      <strong>
                        {formatDate(
                          selectedLeave.fromDate
                        )}
                      </strong>

                    </div>


                    {/* TO */}

                    <div className="detail-item">

                      <span>
                        To Date
                      </span>

                      <strong>
                        {formatDate(
                          selectedLeave.toDate
                        )}
                      </strong>

                    </div>


                    {/* TOTAL DAYS */}

                    <div className="detail-item">

                      <span>
                        Total Days
                      </span>

                      <strong>
                        {selectedLeave.totalDays ||
                          0}

                        {" "}

                        {Number(
                          selectedLeave.totalDays ||
                            0
                        ) === 1
                          ? "Day"
                          : "Days"}
                      </strong>

                    </div>


                    {/* STATUS */}

                    <div className="detail-item">

                      <span>
                        Status
                      </span>

                      <strong
                        className={`status-text ${getStatusClass(
                          selectedLeave.status
                        )}`}
                      >
                        {formatLeaveType(
                          selectedLeave.status ||
                            "PENDING"
                        )}
                      </strong>

                    </div>

                  </div>

                </div>


                {/* REASON */}

                <div className="detail-section">

                  <h4>
                    Leave Reason
                  </h4>

                  <div className="leave-reason-box">

                    {selectedLeave.reason ||
                      "No reason provided."}

                  </div>

                </div>


                {/* EXISTING ADMIN REMARK */}

                {selectedLeave.adminRemark && (

                  <div className="detail-section">

                    <h4>
                      Admin Remark
                    </h4>

                    <div className="leave-remark-box">

                      {
                        selectedLeave.adminRemark
                      }

                    </div>

                  </div>

                )}


                {/* ACTION REMARK */}

                {String(
                  selectedLeave.status ||
                    "PENDING"
                ).toUpperCase() ===
                  "PENDING" && (

                  <div className="detail-section">

                    <h4>
                      Admin Remark
                    </h4>

                    <textarea
                      value={remark}
                      onChange={(event) =>
                        setRemark(
                          event.target.value
                        )
                      }
                      placeholder="Enter remark for employee..."
                      rows={4}
                      disabled={
                        actionLoading
                      }
                      className="leave-remark-input"
                    />

                  </div>

                )}

              </div>


              {/* MODAL FOOTER */}

              <div className="leave-modal-footer">

                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={
                    handleCloseModal
                  }
                  disabled={
                    actionLoading
                  }
                >
                  Close
                </button>


                {/* ONLY PENDING REQUEST CAN BE ACTIONED */}

                {String(
                  selectedLeave.status ||
                    "PENDING"
                ).toUpperCase() ===
                  "PENDING" && (

                  <div className="modal-action-buttons">

                    <button
                      type="button"
                      className="reject-btn"
                      onClick={() =>
                        handleLeaveAction(
                          "REJECTED"
                        )
                      }
                      disabled={
                        actionLoading
                      }
                    >

                      {actionLoading
                        ? "Processing..."
                        : "✕ Reject"}

                    </button>


                    <button
                      type="button"
                      className="approve-btn"
                      onClick={() =>
                        handleLeaveAction(
                          "APPROVED"
                        )
                      }
                      disabled={
                        actionLoading
                      }
                    >

                      {actionLoading
                        ? "Processing..."
                        : "✓ Approve"}

                    </button>

                  </div>

                )}

              </div>

            </div>

          </div>

        )}

    </div>
  );
};

export default LeaveRequests;