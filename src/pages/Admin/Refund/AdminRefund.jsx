// import React, { useEffect, useState } from "react";
// import {
//   getAllRefunds,
//   approveRefund,
//   rejectRefund,
//   processRefund
// } from "../../../services/refundService";
// import './AdminRefund.css'

// const AdminRefund = () => {
//   const [refunds, setRefunds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);

//   const fetchRefunds = async () => {
//     try {
//       setLoading(true);
//       const res = await getAllRefunds();
//       const list =
//         res?.data?.refunds ||
//         res?.refunds ||
//         res?.data ||
//         [];
//       setRefunds(Array.isArray(list) ? list : []);
//     } catch (err) {
//       console.error("Failed to load refunds:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRefunds();
//   }, []);

//   const handleAction = async (actionFn, ...args) => {
//     try {
//       setActionLoading(true);
//       await actionFn(...args);
//       await fetchRefunds();
//     } catch (err) {
//       alert(err?.response?.data?.message || err?.message || "Action failed");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleReject = (id) => {
//     const notes = prompt("Enter notes for refund rejection:");
//     if (notes && notes.trim()) {
//       handleAction(rejectRefund, id, notes.trim());
//     }
//   };

//   if (loading) return <div>Loading Refunds...</div>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Refund Management</h2>
//       <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead>
//           <tr style={{ background: "#f2f2f2", textAlign: "left" }}>
//             <th>Refund ID</th>
//             <th>Order ID</th>
//             <th>Amount</th>
//             <th>Status</th>
//             <th>Reason / Notes</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {refunds.length === 0 ? (
//             <tr>
//               <td colSpan="6" style={{ textAlign: "center" }}>No refund requests found.</td>
//             </tr>
//           ) : (
//             refunds.map((ref) => {
//               const refId = ref?._id || ref?.id;
//               const orderId = ref?.order?._id || ref?.orderId || ref?.order;
//               const status = ref?.status || "PENDING";

//               return (
//                 <tr key={refId}>
//                   <td>{refId}</td>
//                   <td>{orderId}</td>
//                   <td>₹ {ref?.amount ?? 0}</td>
//                   <td><strong>{status}</strong></td>
//                   <td>{ref?.reason || ref?.notes || "N/A"}</td>
//                   <td>
//                     {status === "PENDING" && (
//                       <>
//                         <button
//                           disabled={actionLoading}
//                           onClick={() => handleAction(approveRefund, refId)}
//                         >
//                           Approve
//                         </button>{" "}
//                         <button
//                           disabled={actionLoading}
//                           onClick={() => handleReject(refId)}
//                         >
//                           Reject
//                         </button>
//                       </>
//                     )}

//                     {status === "APPROVED" && (
//                       <button
//                         disabled={actionLoading}
//                         onClick={() => handleAction(processRefund, refId)}
//                       >
//                         Process Refund
//                       </button>
//                     )}

//                     {["PROCESSED", "COMPLETED", "REJECTED"].includes(status) && (
//                       <span>Completed ({status})</span>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminRefund;

import React, { useEffect, useState } from "react";
import {
  getAllRefunds,
  approveRefund,
  rejectRefund,
  processRefund
} from "../../../services/refundService";
import "./AdminRefund.css";

const AdminRefund = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const res = await getAllRefunds();
      const list =
        res?.data?.refunds ||
        res?.refunds ||
        res?.data ||
        [];
      setRefunds(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load refunds:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const handleAction = async (actionFn, ...args) => {
    try {
      setActionLoading(true);
      await actionFn(...args);
      await fetchRefunds();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = (id) => {
    const notes = prompt("Enter notes for refund rejection:");
    if (notes && notes.trim()) {
      handleAction(rejectRefund, id, notes.trim());
    }
  };

  if (loading) {
    return (
      <div className="admin-refund-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading refunds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-refund-page">
      {/* Top Header */}
      <div className="admin-refund-header">
        <div>
          <h2>Refund Management</h2>
        </div>
        <span className="stats-badge">
          Total Requests: {refunds.length}
        </span>
      </div>

      {/* Main Table Card */}
      <div className="refund-table-card">
        <div className="refund-table-wrapper">
          <table className="modern-refund-table">
            <thead>
              <tr>
                <th>Refund ID</th>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Reason / Notes</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {refunds.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">No refund requests found.</div>
                  </td>
                </tr>
              ) : (
                refunds.map((ref) => {
                  const refId = ref?._id || ref?.id || "N/A";
                  const orderId = ref?.order?._id || ref?.orderId || ref?.order || "N/A";
                  const status = (ref?.status || "PENDING").toUpperCase();

                  return (
                    <tr key={refId}>
                      <td data-label="Refund ID">
                        <span className="refund-code">{refId.slice(-8)}</span>
                      </td>
                      <td data-label="Order ID">
                        <span className="refund-code">{orderId.slice(-8)}</span>
                      </td>
                      <td data-label="Amount">
                        <span className="refund-amount">₹ {Number(ref?.amount ?? 0).toLocaleString()}</span>
                      </td>
                      <td data-label="Status">
                        <span className={`status-badge status-${status.toLowerCase()}`}>
                          {status}
                        </span>
                      </td>
                      <td data-label="Reason">
                        {ref?.reason || ref?.notes || "—"}
                      </td>
                      <td data-label="Actions">
                        <div className="action-group">
                          {status === "PENDING" && (
                            <>
                              <button
                                className="btn btn-approve"
                                disabled={actionLoading}
                                onClick={() => handleAction(approveRefund, refId)}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-reject"
                                disabled={actionLoading}
                                onClick={() => handleReject(refId)}
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {status === "APPROVED" && (
                            <button
                              className="btn btn-process"
                              disabled={actionLoading}
                              onClick={() => handleAction(processRefund, refId)}
                            >
                              Process Refund
                            </button>
                          )}

                          {["PROCESSED", "COMPLETED", "REJECTED"].includes(status) && (
                            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                              No Action
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRefund;