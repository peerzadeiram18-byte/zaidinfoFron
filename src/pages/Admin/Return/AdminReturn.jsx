// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import axios from "axios";
// import "./AdminReturn.css";

// const API_BASE_URL = "http://localhost:5000/api/returns";
// // Backend me refund router jis path pe mount hai wahi likho
// const REFUND_API_URL = "http://localhost:5000/api/refunds";

// const getAuthHeaders = () => {
//   const token =
//     localStorage.getItem("token") ||
//     localStorage.getItem("adminToken") ||
//     localStorage.getItem("userToken") ||
//     "";

//   return {
//     headers: {
//       Authorization: token ? `Bearer ${token}` : "",
//       "Content-Type": "application/json"
//     }
//   };
// };

// const extractList = (res) => {
//   const list =
//     res?.data?.returns ||
//     res?.data?.data ||
//     (Array.isArray(res?.data) ? res?.data : []);
//   return Array.isArray(list) ? list : [];
// };

// const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

// const EMPTY_REFUND_FORM = {
//   amount: "",
//   maxAmount: 0,
//   method: "RAZORPAY",
//   reason: "",
//   notes: "",
//   upiId: "",
//   accountHolderName: "",
//   accountNumber: "",
//   ifscCode: "",
//   bankName: ""
// };

// const AdminReturn = () => {
//   const [returns, setReturns] = useState([]);
//   const [refunds, setRefunds] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);

//   // Picked up tracking state
//   const [trackingNumber, setTrackingNumber] = useState("");
//   const [activeTrackingId, setActiveTrackingId] = useState(null);

//   // Inspection modal state
//   const [inspectingReturn, setInspectingReturn] = useState(null);
//   const [inspectionData, setInspectionData] = useState([]);

//   // Refund modal state
//   const [refundingReturn, setRefundingReturn] = useState(null);
//   const [refundForm, setRefundForm] = useState(EMPTY_REFUND_FORM);

//   // ==================================================
//   // FETCH
//   // ==================================================
//   const fetchReturns = useCallback(async () => {
//     try {
//       const res = await axios.get(API_BASE_URL, getAuthHeaders());
//       setReturns(extractList(res));
//     } catch (err) {
//       console.error("Failed to load returns:", err);
//     }
//   }, []);

//   const fetchRefunds = useCallback(async () => {
//     try {
//       const res = await axios.get(REFUND_API_URL, getAuthHeaders());
//       setRefunds(extractList(res));
//     } catch (err) {
//       // Refund load fail hone par bhi returns table chalti rahe
//       console.error("Failed to load refunds:", err);
//     }
//   }, []);

//   const fetchAll = useCallback(async () => {
//     await Promise.all([fetchReturns(), fetchRefunds()]);
//   }, [fetchReturns, fetchRefunds]);

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       await fetchAll();
//       setLoading(false);
//     })();
//   }, [fetchAll]);

//   // returnId -> latest relevant refund (active refund ko priority)
//   const refundByReturn = useMemo(() => {
//     const map = {};
//     refunds.forEach((r) => {
//       const key = String(r?.returnRequest?._id || r?.returnRequest || "");
//       if (!key) return;
//       const dead = ["REJECTED", "CANCELLED"].includes(r?.status);
//       if (!map[key] || (map[key]._dead && !dead)) {
//         map[key] = { ...r, _dead: dead };
//       }
//     });
//     return map;
//   }, [refunds]);

//   // ==================================================
//   // COMMON ACTION HANDLER
//   // returns true on success so modals close only then
//   // ==================================================
//   const handleApiAction = async (url, payload = {}, method = "patch") => {
//     try {
//       setActionLoading(true);
//       await axios.request({
//         method,
//         url,
//         data: payload,
//         ...getAuthHeaders()
//       });
//       await fetchAll();
//       return true;
//     } catch (err) {
//       alert(err?.response?.data?.message || err?.message || "Action failed");
//       return false;
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ==================================================
//   // RETURN ACTIONS
//   // ==================================================
//   const handleApprove = (id) => handleApiAction(`${API_BASE_URL}/${id}/approve`);

//   const handleReject = (id) => {
//     const reason = prompt("Enter rejection reason:");
//     if (reason && reason.trim()) {
//       handleApiAction(`${API_BASE_URL}/${id}/reject`, {
//         rejectionReason: reason.trim()
//       });
//     }
//   };

//   const handleRequestPickup = (id) =>
//     handleApiAction(`${API_BASE_URL}/${id}/pickup-request`);

//   const handlePickedUpSubmit = (id) => {
//     if (!trackingNumber.trim()) {
//       alert("Please provide a tracking number");
//       return;
//     }
//     handleApiAction(`${API_BASE_URL}/${id}/picked-up`, {
//       trackingNumber: trackingNumber.trim()
//     });
//     setActiveTrackingId(null);
//     setTrackingNumber("");
//   };

//   const handleReceive = (id) => handleApiAction(`${API_BASE_URL}/${id}/receive`);

//   const openInspectModal = (ret) => {
//     setInspectingReturn(ret);

//     const initialItems = (ret?.items || []).map((item) => {
//       const productId =
//         (item?.product && typeof item.product === "object"
//           ? item.product._id
//           : item?.product) || null;

//       return {
//         productId,
//         title: item?.title || item?.productName || "Product",
//         condition: "GOOD",
//         inspectionNote: ""
//       };
//     });
//     setInspectionData(initialItems);
//   };

//   const submitInspection = async () => {
//     if (!inspectingReturn) return;

//     const missing = inspectionData.filter((item) => !item.productId);
//     if (missing.length > 0) {
//       alert(
//         `Could not resolve product for: ${missing
//           .map((m) => m.title)
//           .join(", ")}. Please refresh and try again.`
//       );
//       return;
//     }

//     const payload = {
//       inspectedItems: inspectionData.map((item) => ({
//         productId: String(item.productId),
//         condition: item.condition,
//         inspectionNote: item.inspectionNote
//       }))
//     };

//     const id = inspectingReturn?._id || inspectingReturn?.id;
//     const ok = await handleApiAction(`${API_BASE_URL}/${id}/inspect`, payload);
//     if (ok) setInspectingReturn(null);
//   };

//   const handleComplete = (id) => {
//     if (window.confirm("Complete this return and update warehouse inventory?")) {
//       handleApiAction(`${API_BASE_URL}/${id}/complete`);
//     }
//   };

//   // ==================================================
//   // REFUND ACTIONS
//   // ==================================================
//   const openRefundModal = (ret) => {
//     const total = (ret?.items || []).reduce(
//       (sum, it) => sum + Number(it?.price || 0) * Number(it?.quantity || 1),
//       0
//     );

//     setRefundForm({
//       ...EMPTY_REFUND_FORM,
//       amount: String(total),
//       maxAmount: total,
//       reason: `Return ${ret?.returnNumber || ""} completed`
//     });
//     setRefundingReturn(ret);
//   };

//   const setRefundField = (field, value) =>
//     setRefundForm((prev) => ({ ...prev, [field]: value }));

//   const submitRefundRequest = async () => {
//     if (!refundingReturn) return;

//     const amount = Number(refundForm.amount);
//     if (!amount || amount <= 0) {
//       alert("Enter a valid refund amount");
//       return;
//     }
//     if (amount > refundForm.maxAmount) {
//       alert(`Refund cannot exceed ${money(refundForm.maxAmount)}`);
//       return;
//     }
//     if (refundForm.method === "UPI" && !refundForm.upiId.trim()) {
//       alert("Please enter customer's UPI ID");
//       return;
//     }
//     if (
//       refundForm.method === "BANK" &&
//       (!refundForm.accountHolderName.trim() ||
//         !refundForm.accountNumber.trim() ||
//         !refundForm.ifscCode.trim())
//     ) {
//       alert("Please fill account holder, account number and IFSC");
//       return;
//     }

//     const payload = {
//       returnId: refundingReturn._id || refundingReturn.id,
//       refundAmount: amount,
//       refundMethod: refundForm.method,
//       reason: refundForm.reason.trim(),
//       notes: refundForm.notes.trim(),
//       upiId: refundForm.upiId.trim(),
//       bankDetails: {
//         accountHolderName: refundForm.accountHolderName.trim(),
//         accountNumber: refundForm.accountNumber.trim(),
//         ifscCode: refundForm.ifscCode.trim(),
//         bankName: refundForm.bankName.trim()
//       }
//     };

//     const ok = await handleApiAction(REFUND_API_URL, payload, "post");
//     if (ok) setRefundingReturn(null);
//   };

//   const handleApproveRefund = (refundId) =>
//     handleApiAction(`${REFUND_API_URL}/${refundId}/approve`);

//   const handleRejectRefund = (refundId) => {
//     const notes = prompt("Enter refund rejection reason:");
//     if (notes && notes.trim()) {
//       handleApiAction(`${REFUND_API_URL}/${refundId}/reject`, {
//         notes: notes.trim()
//       });
//     }
//   };

//   const handleProcessRefund = (refund) => {
//     const amountText = money(refund.refundAmount);

//     if (refund.refundMethod === "RAZORPAY") {
//       if (
//         !window.confirm(
//           `${amountText} Razorpay ke through customer ko wapas bheja jayega. Continue?`
//         )
//       )
//         return;
//       handleApiAction(`${REFUND_API_URL}/${refund._id}/process`);
//       return;
//     }

//     if (refund.refundMethod === "CASH") {
//       if (!window.confirm(`Confirm: ${amountText} cash customer ko de diya?`))
//         return;
//       handleApiAction(`${REFUND_API_URL}/${refund._id}/process`);
//       return;
//     }

//     // BANK / UPI -> manual transfer ke baad UTR / reference
//     const ref = prompt(
//       `${refund.refundMethod} se ${amountText} bhejne ke baad UTR / Transaction ID daalo:`
//     );
//     if (ref && ref.trim()) {
//       handleApiAction(`${REFUND_API_URL}/${refund._id}/process`, {
//         transactionReference: ref.trim()
//       });
//     }
//   };

//   // ==================================================
//   // RENDER
//   // ==================================================
//   if (loading) {
//     return (
//       <div className="admin-return-page">
//         <div className="loading-state">
//           <div className="loading-spinner"></div>
//           <p>Loading return requests...</p>
//         </div>
//       </div>
//     );
//   }

//   const renderRefundCell = (refund) => {
//     if (!refund || refund._dead) {
//       return <span style={{ color: "var(--text-muted)" }}>—</span>;
//     }
//     const st = String(refund.status || "").toUpperCase();
//     return (
//       <div style={{ fontSize: "0.85rem" }}>
//         <span className={`status-badge status-${st.toLowerCase()}`}>{st}</span>
//         <div style={{ marginTop: 4 }}>
//           <strong>{money(refund.refundAmount)}</strong> · {refund.refundMethod}
//         </div>
//         <small style={{ color: "#888" }}>{refund.refundNumber}</small>
//       </div>
//     );
//   };

//   return (
//     <div className="admin-return-page">
//       {/* Header */}
//       <div className="admin-return-header">
//         <div>
//           <h2>Return Management</h2>
//         </div>
//         <span className="stats-badge">Total Requests: {returns.length}</span>
//       </div>

//       {/* Table Card */}
//       <div className="return-table-card">
//         <div className="return-table-wrapper">
//           <table className="modern-return-table">
//             <thead>
//               <tr>
//                 <th>Return No. / ID</th>
//                 <th>Order ID</th>
//                 <th>Customer Note</th>
//                 <th>Items (Reason)</th>
//                 <th>Status</th>
//                 <th>Refund</th>
//                 <th style={{ textAlign: "right" }}>Procedure Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {returns.length === 0 ? (
//                 <tr>
//                   <td colSpan="7">
//                     <div className="empty-state">No return requests found.</div>
//                   </td>
//                 </tr>
//               ) : (
//                 returns.map((ret) => {
//                   const retId = ret?._id || ret?.id;
//                   const returnNumber = ret?.returnNumber || retId.slice(-8);
//                   const orderId =
//                     ret?.order?._id || ret?.orderId || ret?.order || "N/A";
//                   const status = (ret?.status || "REQUESTED").toUpperCase();
//                   const refund = refundByReturn[String(retId)];
//                   const refundStatus = refund && !refund._dead ? refund.status : null;

//                   return (
//                     <tr key={retId}>
//                       <td data-label="Return Number">
//                         <span className="return-code" title={retId}>
//                           {returnNumber}
//                         </span>
//                       </td>

//                       <td data-label="Order ID">
//                         <span className="return-code">
//                           {typeof orderId === "string" ? orderId.slice(-8) : "N/A"}
//                         </span>
//                       </td>

//                       <td data-label="Note">
//                         <span style={{ fontSize: "0.9rem" }}>
//                           {ret?.customerNote || "—"}
//                         </span>
//                       </td>

//                       <td data-label="Items">
//                         <div className="items-list">
//                           {ret?.items && ret.items.length > 0 ? (
//                             ret.items.map((item, i) => (
//                               <div
//                                 key={i}
//                                 className="item-chip"
//                                 style={{ display: "inline-block", margin: "2px" }}
//                               >
//                                 <strong>{item?.title || "Item"}</strong> (x
//                                 {item?.quantity || 1})
//                                 <br />
//                                 <small style={{ color: "#d9534f" }}>
//                                   [{item?.reason || "NO_REASON"}]
//                                 </small>
//                               </div>
//                             ))
//                           ) : (
//                             <span style={{ color: "var(--text-muted)" }}>—</span>
//                           )}
//                         </div>
//                       </td>

//                       <td data-label="Status">
//                         <span className={`status-badge status-${status.toLowerCase()}`}>
//                           {status}
//                         </span>
//                       </td>

//                       <td data-label="Refund">{renderRefundCell(refund)}</td>

//                       <td data-label="Actions">
//                         <div
//                           className="action-group"
//                           style={{ justifyContent: "flex-end", gap: "6px" }}
//                         >
//                           {/* 1. REQUESTED */}
//                           {status === "REQUESTED" && (
//                             <>
//                               <button
//                                 className="btn btn-approve"
//                                 disabled={actionLoading}
//                                 onClick={() => handleApprove(retId)}
//                               >
//                                 Approve
//                               </button>
//                               <button
//                                 className="btn btn-reject"
//                                 disabled={actionLoading}
//                                 onClick={() => handleReject(retId)}
//                               >
//                                 Reject
//                               </button>
//                             </>
//                           )}

//                           {/* 2. APPROVED */}
//                           {status === "APPROVED" && (
//                             <button
//                               className="btn btn-pickup"
//                               disabled={actionLoading}
//                               onClick={() => handleRequestPickup(retId)}
//                             >
//                               Request Pickup
//                             </button>
//                           )}

//                           {/* 3. PICKUP_REQUESTED */}
//                           {status === "PICKUP_REQUESTED" && (
//                             <div className="tracking-input-group">
//                               {activeTrackingId === retId ? (
//                                 <>
//                                   <input
//                                     className="tracking-input"
//                                     type="text"
//                                     placeholder="Courier AWB / Tracking #"
//                                     value={trackingNumber}
//                                     onChange={(e) => setTrackingNumber(e.target.value)}
//                                   />
//                                   <button
//                                     className="btn btn-approve"
//                                     disabled={actionLoading}
//                                     onClick={() => handlePickedUpSubmit(retId)}
//                                   >
//                                     Confirm
//                                   </button>
//                                   <button
//                                     className="btn btn-cancel"
//                                     onClick={() => {
//                                       setActiveTrackingId(null);
//                                       setTrackingNumber("");
//                                     }}
//                                   >
//                                     Cancel
//                                   </button>
//                                 </>
//                               ) : (
//                                 <button
//                                   className="btn btn-info"
//                                   onClick={() => setActiveTrackingId(retId)}
//                                 >
//                                   Mark Picked Up
//                                 </button>
//                               )}
//                             </div>
//                           )}

//                           {/* 4. PICKED_UP */}
//                           {status === "PICKED_UP" && (
//                             <button
//                               className="btn btn-purple"
//                               disabled={actionLoading}
//                               onClick={() => handleReceive(retId)}
//                             >
//                               Mark Received
//                             </button>
//                           )}

//                           {/* 5. RECEIVED */}
//                           {status === "RECEIVED" && (
//                             <button
//                               className="btn btn-info"
//                               disabled={actionLoading}
//                               onClick={() => openInspectModal(ret)}
//                             >
//                               Inspect Products
//                             </button>
//                           )}

//                           {/* 6. INSPECTED */}
//                           {status === "INSPECTED" && (
//                             <button
//                               className="btn btn-approve"
//                               disabled={actionLoading}
//                               onClick={() => handleComplete(retId)}
//                             >
//                               Complete Return
//                             </button>
//                           )}

//                           {/* 7. COMPLETED -> REFUND FLOW */}
//                           {status === "COMPLETED" && (
//                             <>
//                               {!refundStatus && (
//                                 <button
//                                   className="btn btn-purple"
//                                   disabled={actionLoading}
//                                   onClick={() => openRefundModal(ret)}
//                                 >
//                                   Initiate Refund
//                                 </button>
//                               )}

//                               {refundStatus === "REQUESTED" && (
//                                 <>
//                                   <button
//                                     className="btn btn-approve"
//                                     disabled={actionLoading}
//                                     onClick={() => handleApproveRefund(refund._id)}
//                                   >
//                                     Approve Refund
//                                   </button>
//                                   <button
//                                     className="btn btn-reject"
//                                     disabled={actionLoading}
//                                     onClick={() => handleRejectRefund(refund._id)}
//                                   >
//                                     Reject
//                                   </button>
//                                 </>
//                               )}

//                               {refundStatus === "APPROVED" && (
//                                 <button
//                                   className="btn btn-purple"
//                                   disabled={actionLoading}
//                                   onClick={() => handleProcessRefund(refund)}
//                                 >
//                                   Process Refund
//                                 </button>
//                               )}

//                               {refundStatus === "PROCESSING" && (
//                                 <span style={{ fontSize: "0.85rem", color: "#b8860b" }}>
//                                   Refund processing...
//                                 </span>
//                               )}

//                               {refundStatus === "COMPLETED" && (
//                                 <span style={{ fontSize: "0.85rem", color: "#2e7d32" }}>
//                                   Refunded {money(refund.refundAmount)}
//                                 </span>
//                               )}
//                             </>
//                           )}

//                           {/* FINAL STATES */}
//                           {["REJECTED", "CANCELLED"].includes(status) && (
//                             <span
//                               style={{
//                                 fontSize: "0.85rem",
//                                 color: "var(--text-muted)"
//                               }}
//                             >
//                               Closed ({status})
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ====================================================== */}
//       {/* INSPECTION MODAL */}
//       {/* ====================================================== */}
//       {inspectingReturn && (
//         <div
//           className="admin-modal-overlay"
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: "rgba(0,0,0,0.5)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 9999
//           }}
//         >
//           <div
//             className="admin-modal"
//             style={{
//               background: "#fff",
//               padding: "24px",
//               borderRadius: "8px",
//               width: "550px",
//               maxWidth: "90%"
//             }}
//           >
//             <h3>Inspect Return Items</h3>
//             <p style={{ color: "#666", marginBottom: "16px" }}>
//               Return:{" "}
//               <strong>{inspectingReturn.returnNumber || inspectingReturn._id}</strong>
//             </p>

//             <div style={{ maxHeight: "320px", overflowY: "auto" }}>
//               {inspectionData.map((item, idx) => (
//                 <div
//                   key={idx}
//                   style={{
//                     border: "1px solid #ddd",
//                     padding: "12px",
//                     borderRadius: "6px",
//                     marginBottom: "12px"
//                   }}
//                 >
//                   <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>{item.title}</p>

//                   <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
//                     Condition:
//                   </label>
//                   <select
//                     value={item.condition}
//                     onChange={(e) => {
//                       const val = e.target.value;
//                       setInspectionData((prev) =>
//                         prev.map((it, i) => (i === idx ? { ...it, condition: val } : it))
//                       );
//                     }}
//                     style={{
//                       width: "100%",
//                       padding: "8px",
//                       marginBottom: "8px",
//                       borderRadius: "4px",
//                       border: "1px solid #ccc"
//                     }}
//                   >
//                     <option value="GOOD">GOOD (Can restock to Inventory)</option>
//                     <option value="DAMAGED">DAMAGED (Will not restock)</option>
//                     <option value="DEFECTIVE">DEFECTIVE (Will not restock)</option>
//                     <option value="MISSING_PARTS">MISSING_PARTS</option>
//                   </select>

//                   <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
//                     Inspection Note:
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="e.g., Box seal intact or scratches found"
//                     value={item.inspectionNote}
//                     onChange={(e) => {
//                       const val = e.target.value;
//                       setInspectionData((prev) =>
//                         prev.map((it, i) => (i === idx ? { ...it, inspectionNote: val } : it))
//                       );
//                     }}
//                     style={{
//                       width: "100%",
//                       padding: "8px",
//                       boxSizing: "border-box",
//                       borderRadius: "4px",
//                       border: "1px solid #ccc"
//                     }}
//                   />
//                 </div>
//               ))}
//             </div>

//             <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
//               <button
//                 className="btn btn-cancel"
//                 onClick={() => setInspectingReturn(null)}
//                 disabled={actionLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="btn btn-approve"
//                 onClick={submitInspection}
//                 disabled={actionLoading}
//               >
//                 {actionLoading ? "Submitting..." : "Save Inspection"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ====================================================== */}
//       {/* REFUND MODAL */}
//       {/* ====================================================== */}
//       {refundingReturn && (
//         <div
//           className="admin-modal-overlay"
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: "rgba(0,0,0,0.5)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 9999
//           }}
//         >
//           <div
//             className="admin-modal"
//             style={{
//               background: "#fff",
//               padding: "24px",
//               borderRadius: "8px",
//               width: "550px",
//               maxWidth: "90%",
//               maxHeight: "90vh",
//               overflowY: "auto"
//             }}
//           >
//             <h3>Initiate Refund</h3>
//             <p style={{ color: "#666", marginBottom: "12px" }}>
//               Return:{" "}
//               <strong>{refundingReturn.returnNumber || refundingReturn._id}</strong>
//             </p>

//             {/* Items summary */}
//             <div style={{ marginBottom: "12px", fontSize: "0.9rem" }}>
//               {(refundingReturn.items || []).map((it, i) => (
//                 <div
//                   key={i}
//                   style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}
//                 >
//                   <span>
//                     {it.title} × {it.quantity}
//                     {it.condition && it.condition !== "PENDING" && (
//                       <small style={{ color: it.condition === "GOOD" ? "#2e7d32" : "#d9534f" }}>
//                         {" "}
//                         [{it.condition}]
//                       </small>
//                     )}
//                   </span>
//                   <span>{money(Number(it.price) * Number(it.quantity))}</span>
//                 </div>
//               ))}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   borderTop: "1px solid #ddd",
//                   marginTop: 6,
//                   paddingTop: 6,
//                   fontWeight: "bold"
//                 }}
//               >
//                 <span>Max refundable</span>
//                 <span>{money(refundForm.maxAmount)}</span>
//               </div>
//             </div>

//             <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
//               Refund Amount (₹) — damaged item ho to kam kar sakte ho
//             </label>
//             <input
//               type="number"
//               min="0"
//               value={refundForm.amount}
//               onChange={(e) => setRefundField("amount", e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 marginBottom: "10px",
//                 boxSizing: "border-box",
//                 borderRadius: "4px",
//                 border: "1px solid #ccc"
//               }}
//             />

//             <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
//               Refund Method
//             </label>
//             <select
//               value={refundForm.method}
//               onChange={(e) => setRefundField("method", e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 marginBottom: "10px",
//                 borderRadius: "4px",
//                 border: "1px solid #ccc"
//               }}
//             >
//               <option value="RAZORPAY">RAZORPAY (original payment me auto refund)</option>
//               <option value="UPI">UPI (manual transfer)</option>
//               <option value="BANK">BANK (manual transfer)</option>
//               <option value="CASH">CASH</option>
//             </select>

//             {refundForm.method === "UPI" && (
//               <input
//                 type="text"
//                 placeholder="Customer UPI ID (name@bank)"
//                 value={refundForm.upiId}
//                 onChange={(e) => setRefundField("upiId", e.target.value)}
//                 style={{
//                   width: "100%",
//                   padding: "8px",
//                   marginBottom: "10px",
//                   boxSizing: "border-box",
//                   borderRadius: "4px",
//                   border: "1px solid #ccc"
//                 }}
//               />
//             )}

//             {refundForm.method === "BANK" && (
//               <>
//                 {[
//                   ["accountHolderName", "Account holder name"],
//                   ["accountNumber", "Account number"],
//                   ["ifscCode", "IFSC code"],
//                   ["bankName", "Bank name (optional)"]
//                 ].map(([field, label]) => (
//                   <input
//                     key={field}
//                     type="text"
//                     placeholder={label}
//                     value={refundForm[field]}
//                     onChange={(e) => setRefundField(field, e.target.value)}
//                     style={{
//                       width: "100%",
//                       padding: "8px",
//                       marginBottom: "8px",
//                       boxSizing: "border-box",
//                       borderRadius: "4px",
//                       border: "1px solid #ccc"
//                     }}
//                   />
//                 ))}
//               </>
//             )}

//             <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
//               Reason
//             </label>
//             <input
//               type="text"
//               value={refundForm.reason}
//               onChange={(e) => setRefundField("reason", e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 marginBottom: "10px",
//                 boxSizing: "border-box",
//                 borderRadius: "4px",
//                 border: "1px solid #ccc"
//               }}
//             />

//             <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
//               Notes (optional)
//             </label>
//             <input
//               type="text"
//               value={refundForm.notes}
//               onChange={(e) => setRefundField("notes", e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 boxSizing: "border-box",
//                 borderRadius: "4px",
//                 border: "1px solid #ccc"
//               }}
//             />

//             <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
//               <button
//                 className="btn btn-cancel"
//                 onClick={() => setRefundingReturn(null)}
//                 disabled={actionLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="btn btn-approve"
//                 onClick={submitRefundRequest}
//                 disabled={actionLoading}
//               >
//                 {actionLoading ? "Submitting..." : "Create Refund Request"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminReturn;



import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import "./AdminReturn.css";

// API base URL sirf .env se aayega (VITE_API_URL)
const API = import.meta.env.VITE_API_URL || "";

const API_BASE_URL = `${API}/returns`;
// Backend me refund router jis path pe mount hai wahi likho
const REFUND_API_URL = `${API}/refunds`;

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("userToken") ||
    "";

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json"
    }
  };
};

const extractList = (res) => {
  const list =
    res?.data?.returns ||
    res?.data?.data ||
    (Array.isArray(res?.data) ? res?.data : []);
  return Array.isArray(list) ? list : [];
};

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const EMPTY_REFUND_FORM = {
  amount: "",
  maxAmount: 0,
  method: "RAZORPAY",
  reason: "",
  notes: "",
  upiId: "",
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  bankName: ""
};

const AdminReturn = () => {
  const [returns, setReturns] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Picked up tracking state
  const [trackingNumber, setTrackingNumber] = useState("");
  const [activeTrackingId, setActiveTrackingId] = useState(null);

  // Inspection modal state
  const [inspectingReturn, setInspectingReturn] = useState(null);
  const [inspectionData, setInspectionData] = useState([]);

  // Refund modal state
  const [refundingReturn, setRefundingReturn] = useState(null);
  const [refundForm, setRefundForm] = useState(EMPTY_REFUND_FORM);

  // ==================================================
  // FETCH
  // ==================================================
  const fetchReturns = useCallback(async () => {
    try {
      const res = await axios.get(API_BASE_URL, getAuthHeaders());
      setReturns(extractList(res));
    } catch (err) {
      console.error("Failed to load returns:", err);
    }
  }, []);

  const fetchRefunds = useCallback(async () => {
    try {
      const res = await axios.get(REFUND_API_URL, getAuthHeaders());
      setRefunds(extractList(res));
    } catch (err) {
      // Refund load fail hone par bhi returns table chalti rahe
      console.error("Failed to load refunds:", err);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchReturns(), fetchRefunds()]);
  }, [fetchReturns, fetchRefunds]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchAll();
      setLoading(false);
    })();
  }, [fetchAll]);

  // returnId -> latest relevant refund (active refund ko priority)
  const refundByReturn = useMemo(() => {
    const map = {};
    refunds.forEach((r) => {
      const key = String(r?.returnRequest?._id || r?.returnRequest || "");
      if (!key) return;
      const dead = ["REJECTED", "CANCELLED"].includes(r?.status);
      if (!map[key] || (map[key]._dead && !dead)) {
        map[key] = { ...r, _dead: dead };
      }
    });
    return map;
  }, [refunds]);

  // ==================================================
  // COMMON ACTION HANDLER
  // returns true on success so modals close only then
  // ==================================================
  const handleApiAction = async (url, payload = {}, method = "patch") => {
    try {
      setActionLoading(true);
      await axios.request({
        method,
        url,
        data: payload,
        ...getAuthHeaders()
      });
      await fetchAll();
      return true;
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Action failed");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // ==================================================
  // RETURN ACTIONS
  // ==================================================
  const handleApprove = (id) => handleApiAction(`${API_BASE_URL}/${id}/approve`);

  const handleReject = (id) => {
    const reason = prompt("Enter rejection reason:");
    if (reason && reason.trim()) {
      handleApiAction(`${API_BASE_URL}/${id}/reject`, {
        rejectionReason: reason.trim()
      });
    }
  };

  const handleRequestPickup = (id) =>
    handleApiAction(`${API_BASE_URL}/${id}/pickup-request`);

  const handlePickedUpSubmit = (id) => {
    if (!trackingNumber.trim()) {
      alert("Please provide a tracking number");
      return;
    }
    handleApiAction(`${API_BASE_URL}/${id}/picked-up`, {
      trackingNumber: trackingNumber.trim()
    });
    setActiveTrackingId(null);
    setTrackingNumber("");
  };

  const handleReceive = (id) => handleApiAction(`${API_BASE_URL}/${id}/receive`);

  const openInspectModal = (ret) => {
    setInspectingReturn(ret);

    const initialItems = (ret?.items || []).map((item) => {
      const productId =
        (item?.product && typeof item.product === "object"
          ? item.product._id
          : item?.product) || null;

      return {
        productId,
        title: item?.title || item?.productName || "Product",
        condition: "GOOD",
        inspectionNote: ""
      };
    });
    setInspectionData(initialItems);
  };

  const submitInspection = async () => {
    if (!inspectingReturn) return;

    const missing = inspectionData.filter((item) => !item.productId);
    if (missing.length > 0) {
      alert(
        `Could not resolve product for: ${missing
          .map((m) => m.title)
          .join(", ")}. Please refresh and try again.`
      );
      return;
    }

    const payload = {
      inspectedItems: inspectionData.map((item) => ({
        productId: String(item.productId),
        condition: item.condition,
        inspectionNote: item.inspectionNote
      }))
    };

    const id = inspectingReturn?._id || inspectingReturn?.id;
    const ok = await handleApiAction(`${API_BASE_URL}/${id}/inspect`, payload);
    if (ok) setInspectingReturn(null);
  };

  const handleComplete = (id) => {
    if (window.confirm("Complete this return and update warehouse inventory?")) {
      handleApiAction(`${API_BASE_URL}/${id}/complete`);
    }
  };

  // ==================================================
  // REFUND ACTIONS
  // ==================================================
  const openRefundModal = (ret) => {
    const total = (ret?.items || []).reduce(
      (sum, it) => sum + Number(it?.price || 0) * Number(it?.quantity || 1),
      0
    );

    setRefundForm({
      ...EMPTY_REFUND_FORM,
      amount: String(total),
      maxAmount: total,
      reason: `Return ${ret?.returnNumber || ""} completed`
    });
    setRefundingReturn(ret);
  };

  const setRefundField = (field, value) =>
    setRefundForm((prev) => ({ ...prev, [field]: value }));

  const submitRefundRequest = async () => {
    if (!refundingReturn) return;

    const amount = Number(refundForm.amount);
    if (!amount || amount <= 0) {
      alert("Enter a valid refund amount");
      return;
    }
    if (amount > refundForm.maxAmount) {
      alert(`Refund cannot exceed ${money(refundForm.maxAmount)}`);
      return;
    }
    if (refundForm.method === "UPI" && !refundForm.upiId.trim()) {
      alert("Please enter customer's UPI ID");
      return;
    }
    if (
      refundForm.method === "BANK" &&
      (!refundForm.accountHolderName.trim() ||
        !refundForm.accountNumber.trim() ||
        !refundForm.ifscCode.trim())
    ) {
      alert("Please fill account holder, account number and IFSC");
      return;
    }

    const payload = {
      returnId: refundingReturn._id || refundingReturn.id,
      refundAmount: amount,
      refundMethod: refundForm.method,
      reason: refundForm.reason.trim(),
      notes: refundForm.notes.trim(),
      upiId: refundForm.upiId.trim(),
      bankDetails: {
        accountHolderName: refundForm.accountHolderName.trim(),
        accountNumber: refundForm.accountNumber.trim(),
        ifscCode: refundForm.ifscCode.trim(),
        bankName: refundForm.bankName.trim()
      }
    };

    const ok = await handleApiAction(REFUND_API_URL, payload, "post");
    if (ok) setRefundingReturn(null);
  };

  const handleApproveRefund = (refundId) =>
    handleApiAction(`${REFUND_API_URL}/${refundId}/approve`);

  const handleRejectRefund = (refundId) => {
    const notes = prompt("Enter refund rejection reason:");
    if (notes && notes.trim()) {
      handleApiAction(`${REFUND_API_URL}/${refundId}/reject`, {
        notes: notes.trim()
      });
    }
  };

  const handleProcessRefund = (refund) => {
    const amountText = money(refund.refundAmount);

    if (refund.refundMethod === "RAZORPAY") {
      if (
        !window.confirm(
          `${amountText} Razorpay ke through customer ko wapas bheja jayega. Continue?`
        )
      )
        return;
      handleApiAction(`${REFUND_API_URL}/${refund._id}/process`);
      return;
    }

    if (refund.refundMethod === "CASH") {
      if (!window.confirm(`Confirm: ${amountText} cash customer ko de diya?`))
        return;
      handleApiAction(`${REFUND_API_URL}/${refund._id}/process`);
      return;
    }

    // BANK / UPI -> manual transfer ke baad UTR / reference
    const ref = prompt(
      `${refund.refundMethod} se ${amountText} bhejne ke baad UTR / Transaction ID daalo:`
    );
    if (ref && ref.trim()) {
      handleApiAction(`${REFUND_API_URL}/${refund._id}/process`, {
        transactionReference: ref.trim()
      });
    }
  };

  // ==================================================
  // RENDER
  // ==================================================
  if (loading) {
    return (
      <div className="admin-return-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading return requests...</p>
        </div>
      </div>
    );
  }

  const renderRefundCell = (refund) => {
    if (!refund || refund._dead) {
      return <span style={{ color: "var(--text-muted)" }}>—</span>;
    }
    const st = String(refund.status || "").toUpperCase();
    return (
      <div style={{ fontSize: "0.85rem" }}>
        <span className={`status-badge status-${st.toLowerCase()}`}>{st}</span>
        <div style={{ marginTop: 4 }}>
          <strong>{money(refund.refundAmount)}</strong> · {refund.refundMethod}
        </div>
        <small style={{ color: "#888" }}>{refund.refundNumber}</small>
      </div>
    );
  };

  return (
    <div className="admin-return-page">
      {/* Header */}
      <div className="admin-return-header">
        <div>
          <h2>Return Management</h2>
        </div>
        <span className="stats-badge">Total Requests: {returns.length}</span>
      </div>

      {/* Table Card */}
      <div className="return-table-card">
        <div className="return-table-wrapper">
          <table className="modern-return-table">
            <thead>
              <tr>
                <th>Return No. / ID</th>
                <th>Order ID</th>
                <th>Customer Note</th>
                <th>Items (Reason)</th>
                <th>Status</th>
                <th>Refund</th>
                <th style={{ textAlign: "right" }}>Procedure Actions</th>
              </tr>
            </thead>
            <tbody>
              {returns.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">No return requests found.</div>
                  </td>
                </tr>
              ) : (
                returns.map((ret) => {
                  const retId = ret?._id || ret?.id;
                  const returnNumber = ret?.returnNumber || retId.slice(-8);
                  const orderId =
                    ret?.order?._id || ret?.orderId || ret?.order || "N/A";
                  const status = (ret?.status || "REQUESTED").toUpperCase();
                  const refund = refundByReturn[String(retId)];
                  const refundStatus = refund && !refund._dead ? refund.status : null;

                  return (
                    <tr key={retId}>
                      <td data-label="Return Number">
                        <span className="return-code" title={retId}>
                          {returnNumber}
                        </span>
                      </td>

                      <td data-label="Order ID">
                        <span className="return-code">
                          {typeof orderId === "string" ? orderId.slice(-8) : "N/A"}
                        </span>
                      </td>

                      <td data-label="Note">
                        <span style={{ fontSize: "0.9rem" }}>
                          {ret?.customerNote || "—"}
                        </span>
                      </td>

                      <td data-label="Items">
                        <div className="items-list">
                          {ret?.items && ret.items.length > 0 ? (
                            ret.items.map((item, i) => (
                              <div
                                key={i}
                                className="item-chip"
                                style={{ display: "inline-block", margin: "2px" }}
                              >
                                <strong>{item?.title || "Item"}</strong> (x
                                {item?.quantity || 1})
                                <br />
                                <small style={{ color: "#d9534f" }}>
                                  [{item?.reason || "NO_REASON"}]
                                </small>
                              </div>
                            ))
                          ) : (
                            <span style={{ color: "var(--text-muted)" }}>—</span>
                          )}
                        </div>
                      </td>

                      <td data-label="Status">
                        <span className={`status-badge status-${status.toLowerCase()}`}>
                          {status}
                        </span>
                      </td>

                      <td data-label="Refund">{renderRefundCell(refund)}</td>

                      <td data-label="Actions">
                        <div
                          className="action-group"
                          style={{ justifyContent: "flex-end", gap: "6px" }}
                        >
                          {/* 1. REQUESTED */}
                          {status === "REQUESTED" && (
                            <>
                              <button
                                className="btn btn-approve"
                                disabled={actionLoading}
                                onClick={() => handleApprove(retId)}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-reject"
                                disabled={actionLoading}
                                onClick={() => handleReject(retId)}
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {/* 2. APPROVED */}
                          {status === "APPROVED" && (
                            <button
                              className="btn btn-pickup"
                              disabled={actionLoading}
                              onClick={() => handleRequestPickup(retId)}
                            >
                              Request Pickup
                            </button>
                          )}

                          {/* 3. PICKUP_REQUESTED */}
                          {status === "PICKUP_REQUESTED" && (
                            <div className="tracking-input-group">
                              {activeTrackingId === retId ? (
                                <>
                                  <input
                                    className="tracking-input"
                                    type="text"
                                    placeholder="Courier AWB / Tracking #"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                  />
                                  <button
                                    className="btn btn-approve"
                                    disabled={actionLoading}
                                    onClick={() => handlePickedUpSubmit(retId)}
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    className="btn btn-cancel"
                                    onClick={() => {
                                      setActiveTrackingId(null);
                                      setTrackingNumber("");
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button
                                  className="btn btn-info"
                                  onClick={() => setActiveTrackingId(retId)}
                                >
                                  Mark Picked Up
                                </button>
                              )}
                            </div>
                          )}

                          {/* 4. PICKED_UP */}
                          {status === "PICKED_UP" && (
                            <button
                              className="btn btn-purple"
                              disabled={actionLoading}
                              onClick={() => handleReceive(retId)}
                            >
                              Mark Received
                            </button>
                          )}

                          {/* 5. RECEIVED */}
                          {status === "RECEIVED" && (
                            <button
                              className="btn btn-info"
                              disabled={actionLoading}
                              onClick={() => openInspectModal(ret)}
                            >
                              Inspect Products
                            </button>
                          )}

                          {/* 6. INSPECTED */}
                          {status === "INSPECTED" && (
                            <button
                              className="btn btn-approve"
                              disabled={actionLoading}
                              onClick={() => handleComplete(retId)}
                            >
                              Complete Return
                            </button>
                          )}

                          {/* 7. COMPLETED -> REFUND FLOW */}
                          {status === "COMPLETED" && (
                            <>
                              {!refundStatus && (
                                <button
                                  className="btn btn-purple"
                                  disabled={actionLoading}
                                  onClick={() => openRefundModal(ret)}
                                >
                                  Initiate Refund
                                </button>
                              )}

                              {refundStatus === "REQUESTED" && (
                                <>
                                  <button
                                    className="btn btn-approve"
                                    disabled={actionLoading}
                                    onClick={() => handleApproveRefund(refund._id)}
                                  >
                                    Approve Refund
                                  </button>
                                  <button
                                    className="btn btn-reject"
                                    disabled={actionLoading}
                                    onClick={() => handleRejectRefund(refund._id)}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                              {refundStatus === "APPROVED" && (
                                <button
                                  className="btn btn-purple"
                                  disabled={actionLoading}
                                  onClick={() => handleProcessRefund(refund)}
                                >
                                  Process Refund
                                </button>
                              )}

                              {refundStatus === "PROCESSING" && (
                                <span style={{ fontSize: "0.85rem", color: "#b8860b" }}>
                                  Refund processing...
                                </span>
                              )}

                              {refundStatus === "COMPLETED" && (
                                <span style={{ fontSize: "0.85rem", color: "#2e7d32" }}>
                                  Refunded {money(refund.refundAmount)}
                                </span>
                              )}
                            </>
                          )}

                          {/* FINAL STATES */}
                          {["REJECTED", "CANCELLED"].includes(status) && (
                            <span
                              style={{
                                fontSize: "0.85rem",
                                color: "var(--text-muted)"
                              }}
                            >
                              Closed ({status})
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

      {/* ====================================================== */}
      {/* INSPECTION MODAL */}
      {/* ====================================================== */}
      {inspectingReturn && (
        <div
          className="admin-modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
        >
          <div
            className="admin-modal"
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "8px",
              width: "550px",
              maxWidth: "90%"
            }}
          >
            <h3>Inspect Return Items</h3>
            <p style={{ color: "#666", marginBottom: "16px" }}>
              Return:{" "}
              <strong>{inspectingReturn.returnNumber || inspectingReturn._id}</strong>
            </p>

            <div style={{ maxHeight: "320px", overflowY: "auto" }}>
              {inspectionData.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    borderRadius: "6px",
                    marginBottom: "12px"
                  }}
                >
                  <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>{item.title}</p>

                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
                    Condition:
                  </label>
                  <select
                    value={item.condition}
                    onChange={(e) => {
                      const val = e.target.value;
                      setInspectionData((prev) =>
                        prev.map((it, i) => (i === idx ? { ...it, condition: val } : it))
                      );
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginBottom: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc"
                    }}
                  >
                    <option value="GOOD">GOOD (Can restock to Inventory)</option>
                    <option value="DAMAGED">DAMAGED (Will not restock)</option>
                    <option value="DEFECTIVE">DEFECTIVE (Will not restock)</option>
                    <option value="MISSING_PARTS">MISSING_PARTS</option>
                  </select>

                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
                    Inspection Note:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Box seal intact or scratches found"
                    value={item.inspectionNote}
                    onChange={(e) => {
                      const val = e.target.value;
                      setInspectionData((prev) =>
                        prev.map((it, i) => (i === idx ? { ...it, inspectionNote: val } : it))
                      );
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                      borderRadius: "4px",
                      border: "1px solid #ccc"
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
              <button
                className="btn btn-cancel"
                onClick={() => setInspectingReturn(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-approve"
                onClick={submitInspection}
                disabled={actionLoading}
              >
                {actionLoading ? "Submitting..." : "Save Inspection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* REFUND MODAL */}
      {/* ====================================================== */}
      {refundingReturn && (
        <div
          className="admin-modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
        >
          <div
            className="admin-modal"
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "8px",
              width: "550px",
              maxWidth: "90%",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            <h3>Initiate Refund</h3>
            <p style={{ color: "#666", marginBottom: "12px" }}>
              Return:{" "}
              <strong>{refundingReturn.returnNumber || refundingReturn._id}</strong>
            </p>

            {/* Items summary */}
            <div style={{ marginBottom: "12px", fontSize: "0.9rem" }}>
              {(refundingReturn.items || []).map((it, i) => (
                <div
                  key={i}
                  style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}
                >
                  <span>
                    {it.title} × {it.quantity}
                    {it.condition && it.condition !== "PENDING" && (
                      <small style={{ color: it.condition === "GOOD" ? "#2e7d32" : "#d9534f" }}>
                        {" "}
                        [{it.condition}]
                      </small>
                    )}
                  </span>
                  <span>{money(Number(it.price) * Number(it.quantity))}</span>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #ddd",
                  marginTop: 6,
                  paddingTop: 6,
                  fontWeight: "bold"
                }}
              >
                <span>Max refundable</span>
                <span>{money(refundForm.maxAmount)}</span>
              </div>
            </div>

            <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
              Refund Amount (₹) — damaged item ho to kam kar sakte ho
            </label>
            <input
              type="number"
              min="0"
              value={refundForm.amount}
              onChange={(e) => setRefundField("amount", e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #ccc"
              }}
            />

            <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
              Refund Method
            </label>
            <select
              value={refundForm.method}
              onChange={(e) => setRefundField("method", e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc"
              }}
            >
              <option value="RAZORPAY">RAZORPAY (original payment me auto refund)</option>
              <option value="UPI">UPI (manual transfer)</option>
              <option value="BANK">BANK (manual transfer)</option>
              <option value="CASH">CASH</option>
            </select>

            {refundForm.method === "UPI" && (
              <input
                type="text"
                placeholder="Customer UPI ID (name@bank)"
                value={refundForm.upiId}
                onChange={(e) => setRefundField("upiId", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  boxSizing: "border-box",
                  borderRadius: "4px",
                  border: "1px solid #ccc"
                }}
              />
            )}

            {refundForm.method === "BANK" && (
              <>
                {[
                  ["accountHolderName", "Account holder name"],
                  ["accountNumber", "Account number"],
                  ["ifscCode", "IFSC code"],
                  ["bankName", "Bank name (optional)"]
                ].map(([field, label]) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={label}
                    value={refundForm[field]}
                    onChange={(e) => setRefundField(field, e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginBottom: "8px",
                      boxSizing: "border-box",
                      borderRadius: "4px",
                      border: "1px solid #ccc"
                    }}
                  />
                ))}
              </>
            )}

            <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
              Reason
            </label>
            <input
              type="text"
              value={refundForm.reason}
              onChange={(e) => setRefundField("reason", e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #ccc"
              }}
            />

            <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
              Notes (optional)
            </label>
            <input
              type="text"
              value={refundForm.notes}
              onChange={(e) => setRefundField("notes", e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #ccc"
              }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
              <button
                className="btn btn-cancel"
                onClick={() => setRefundingReturn(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-approve"
                onClick={submitRefundRequest}
                disabled={actionLoading}
              >
                {actionLoading ? "Submitting..." : "Create Refund Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReturn;