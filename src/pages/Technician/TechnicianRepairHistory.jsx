// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import {
//   FiSearch,
//   FiPhone,
//   FiMail,
//   FiCheckCircle,
//   FiPrinter,
//   FiClock,
//   FiDollarSign,
//   FiRefreshCw,
//   FiInbox,
//   FiX,
//   FiPlus,
//   FiTrash2,
//   FiEdit3,
// } from "react-icons/fi";
// import { toast } from "react-toastify";
// import "./TechnicianRepairHistory.css";

// const BASE_URL = "http://localhost:5000/api/newRepair";
// const SERVICES_API = "http://localhost:5000/api/repair-service/get-services";

// export default function TechnicianRepairHistory() {
//   const [repairs, setRepairs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [dateFilter, setDateFilter] = useState("ALL");
//   const [selectedInvoice, setSelectedInvoice] = useState(null);

//   // Service Management States
//   const [availableServices, setAvailableServices] = useState([]);
//   const [serviceModalItem, setServiceModalItem] = useState(null);
//   const [appliedServices, setAppliedServices] = useState([]);
//   const [selectedServiceId, setSelectedServiceId] = useState("");
//   const [customServiceName, setCustomServiceName] = useState("");
//   const [customPartCost, setCustomPartCost] = useState("");
//   const [customLaborCost, setCustomLaborCost] = useState("");
//   const [savingServices, setSavingServices] = useState(false);

//   const token = localStorage.getItem("token");

//   const loggedInUser = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user")) || {};
//     } catch {
//       return {};
//     }
//   }, []);

//   const techId = loggedInUser._id || loggedInUser.id || "";
//   const techName = (
//     loggedInUser.name ||
//     loggedInUser.fullName ||
//     `${loggedInUser.firstName || ""} ${loggedInUser.lastName || ""}`
//   ).trim().toLowerCase();

//   const getAuthConfig = () => ({
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   // 1. Fetch Master Services List
//   const fetchAvailableServices = async () => {
//     try {
//       const res = await axios.get(SERVICES_API, getAuthConfig());
//       const data = res.data?.services || (Array.isArray(res.data) ? res.data : []);
//       setAvailableServices(data);
//     } catch (err) {
//       console.error("Failed to load standard repair services list", err);
//     }
//   };

//   // 2. Fetch Repair History
//   const fetchHistory = async () => {
//     try {
//       setLoading(true);
//       let res;
//       try {
//         res = await axios.get(`${BASE_URL}/my-assigned-repairs`, getAuthConfig());
//       } catch {
//         res = await axios.get(`${BASE_URL}/`, getAuthConfig());
//       }

//       const raw =
//         res.data?.repairs ||
//         res.data?.data ||
//         (Array.isArray(res.data) ? res.data : []);

//       setRepairs(raw);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load repair history");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//     fetchAvailableServices();
//   }, []);

//   // Filter completed/historical repairs for logged-in technician
//   const historyRecords = useMemo(() => {
//     return repairs.filter((r) => {
//       const assigned = r.assignedTechnician;
//       const assignedId =
//         typeof assigned === "object" ? assigned?._id || assigned?.id : assigned;

//       const matchesTech =
//         (techId && assignedId && String(assignedId) === String(techId)) ||
//         (techName &&
//           r.technicianName &&
//           (r.technicianName.toLowerCase() === techName ||
//             r.technicianName.toLowerCase().includes(techName) ||
//             techName.includes(r.technicianName.toLowerCase())));

//       if (!matchesTech) return false;

//       const status = String(r.status || "").toLowerCase();
//       return (
//         ["completed", "delivered", "ready for delivery", "cancelled"].includes(status) ||
//         r.isDelivered === true
//       );
//     });
//   }, [repairs, techId, techName]);

//   // Apply Search & Date Range Filters
//   const filteredRecords = useMemo(() => {
//     const q = searchTerm.toLowerCase().trim();
//     const now = new Date();

//     return historyRecords.filter((item) => {
//       const model = item.deviceModel || item.laptopModel || "";
//       const matchesSearch =
//         !q ||
//         item.customerName?.toLowerCase().includes(q) ||
//         item.customerPhone?.includes(q) ||
//         item.repairNumber?.toLowerCase().includes(q) ||
//         model.toLowerCase().includes(q);

//       let matchesDate = true;
//       const recordDate = new Date(item.updatedAt || item.createdAt || Date.now());

//       if (dateFilter === "30_DAYS") {
//         const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//         matchesDate = recordDate >= past30;
//       } else if (dateFilter === "THIS_MONTH") {
//         matchesDate =
//           recordDate.getMonth() === now.getMonth() &&
//           recordDate.getFullYear() === now.getFullYear();
//       }

//       return matchesSearch && matchesDate;
//     });
//   }, [historyRecords, searchTerm, dateFilter]);

//   const calculateTurnaround = (createdAt, updatedAt) => {
//     if (!createdAt) return "1 Day";
//     const start = new Date(createdAt);
//     const end = updatedAt ? new Date(updatedAt) : new Date();
//     const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
//     return `${diffDays} Day${diffDays > 1 ? "s" : ""}`;
//   };

//   const totalDelivered = filteredRecords.filter((r) =>
//     ["completed", "delivered"].includes(String(r.status || "").toLowerCase())
//   ).length;

//   const totalHistoricalRevenue = filteredRecords.reduce(
//     (sum, r) => sum + (Number(r.repairCost) || 0),
//     0
//   );

//   // Service Modal Helpers
//   const handleOpenServiceModal = (item) => {
//     setServiceModalItem(item);
//     setAppliedServices(
//       Array.isArray(item.services)
//         ? item.services.map((s) => ({
//             serviceId: s._id || s.serviceId,
//             serviceName: s.serviceName || s.name,
//             partCost: Number(s.partCost || 0),
//             laborCost: Number(s.laborCost || 0),
//             totalCost: Number(s.totalCost ?? (Number(s.partCost || 0) + Number(s.laborCost || 0))),
//           }))
//         : []
//     );
//     setSelectedServiceId("");
//     setCustomServiceName("");
//     setCustomPartCost("");
//     setCustomLaborCost("");
//   };

//   const handleAddPredefinedService = () => {
//     if (!selectedServiceId) return;
//     const found = availableServices.find((s) => String(s._id) === String(selectedServiceId));
//     if (!found) return;

//     const part = Number(found.partCost || 0);
//     const labor = Number(found.laborCost || 0);
//     const total = Number(found.totalCost ?? part + labor);

//     setAppliedServices((prev) => [
//       ...prev,
//       {
//         serviceId: found._id,
//         serviceName: found.serviceName,
//         category: found.category || "",
//         partCost: part,
//         laborCost: labor,
//         totalCost: total,
//       },
//     ]);
//     setSelectedServiceId("");
//   };

//   const handleAddCustomService = () => {
//     if (!customServiceName.trim()) {
//       toast.warn("Please enter a service name");
//       return;
//     }

//     const part = Number(customPartCost) || 0;
//     const labor = Number(customLaborCost) || 0;
//     const total = part + labor;

//     setAppliedServices((prev) => [
//       ...prev,
//       {
//         serviceName: customServiceName.trim(),
//         partCost: part,
//         laborCost: labor,
//         totalCost: total,
//       },
//     ]);
//     setCustomServiceName("");
//     setCustomPartCost("");
//     setCustomLaborCost("");
//   };

//   const handleRemoveService = (index) => {
//     setAppliedServices((prev) => prev.filter((_, i) => i !== index));
//   };

//   const calculatedModalTotal = useMemo(() => {
//     return appliedServices.reduce((sum, s) => sum + (Number(s.totalCost) || 0), 0);
//   }, [appliedServices]);

//   const handleSaveServices = async () => {
//     if (!serviceModalItem) return;
//     try {
//       setSavingServices(true);
//       const repairId = serviceModalItem._id || serviceModalItem.id;

//       const payload = {
//         services: appliedServices,
//         repairCost: calculatedModalTotal,
//       };

//       const res = await axios.put(`${BASE_URL}/${repairId}`, payload, getAuthConfig());
//       toast.success("Services and repair cost updated successfully");

//       const updatedRecord = res.data?.repair || res.data?.data || {
//         ...serviceModalItem,
//         ...payload,
//       };

//       setRepairs((prev) =>
//         prev.map((r) => (r._id === repairId ? { ...r, ...updatedRecord } : r))
//       );

//       if (selectedInvoice && selectedInvoice._id === repairId) {
//         setSelectedInvoice({ ...selectedInvoice, ...updatedRecord });
//       }

//       setServiceModalItem(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to update repair services");
//     } finally {
//       setSavingServices(false);
//     }
//   };

//   return (
//     <div className="trh-container">
//       {/* Header */}
//       <header className="trh-header">
//         <div>
//           <span className="trh-eyebrow">ARCHIVE & AUDIT</span>
//           <h1>Technician Repair History</h1>
//           <p>Historical records, customer delivery receipts, and resolved service tickets.</p>
//         </div>

//         <button
//           type="button"
//           className="trh-sync-btn"
//           onClick={fetchHistory}
//           disabled={loading}
//         >
//           <FiRefreshCw className={loading ? "trh-spin" : ""} />
//           <span>Sync Archive</span>
//         </button>
//       </header>

//       {/* Metrics Row */}
//       <section className="trh-metrics">
//         <div className="trh-metric-card">
//           <div className="trh-metric-ico icon-blue"><FiCheckCircle /></div>
//           <div>
//             <span className="trh-lbl">Delivered / Completed</span>
//             <strong className="trh-val">{totalDelivered} Jobs</strong>
//           </div>
//         </div>

//         <div className="trh-metric-card">
//           <div className="trh-metric-ico icon-purple"><FiDollarSign /></div>
//           <div>
//             <span className="trh-lbl">Total Completed Value</span>
//             <strong className="trh-val">₹{totalHistoricalRevenue.toLocaleString()}</strong>
//           </div>
//         </div>

//         <div className="trh-metric-card">
//           <div className="trh-metric-ico icon-amber"><FiClock /></div>
//           <div>
//             <span className="trh-lbl">Avg Resolution Speed</span>
//             <strong className="trh-val">~1.5 Days</strong>
//           </div>
//         </div>
//       </section>

//       {/* Main Table Card */}
//       <section className="trh-card">
//         <div className="trh-toolbar">
//           <div className="trh-search-wrap">
//             <FiSearch className="trh-search-ico" />
//             <input
//               type="text"
//               placeholder="Search by ticket, customer, phone, model..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="trh-filter-group">
//             <select
//               value={dateFilter}
//               onChange={(e) => setDateFilter(e.target.value)}
//               className="trh-select"
//             >
//               <option value="ALL">All Time History</option>
//               <option value="THIS_MONTH">This Month</option>
//               <option value="30_DAYS">Last 30 Days</option>
//             </select>
//           </div>
//         </div>

//         {loading ? (
//           <div className="trh-state-box">
//             <div className="trh-spinner"></div>
//             <p>Loading historical records...</p>
//           </div>
//         ) : filteredRecords.length === 0 ? (
//           <div className="trh-state-box">
//             <div className="trh-empty-ico"><FiInbox /></div>
//             <h3>No Completed History Found</h3>
//             <p>Closed and delivered repair tickets will automatically appear here.</p>
//           </div>
//         ) : (
//           <div className="trh-table-wrap">
//             <table className="trh-table">
//               <thead>
//                 <tr>
//                   <th>Ticket #</th>
//                   <th>Customer Info</th>
//                   <th>Device Model</th>
//                   <th>Diagnostic & Applied Services</th>
//                   <th>Turnaround</th>
//                   <th>Final Cost</th>
//                   <th>Status</th>
//                   <th className="trh-th-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredRecords.map((item) => (
//                   <tr key={item._id}>
//                     <td>
//                       <span className="trh-ticket-code">
//                         {item.repairNumber || item._id.slice(-6).toUpperCase()}
//                       </span>
//                     </td>

//                     <td>
//                       <div className="trh-cust-cell">
//                         <strong>{item.customerName}</strong>
//                         <span className="trh-sub-txt"><FiPhone /> {item.customerPhone}</span>
//                         {item.customerEmail && (
//                           <span className="trh-sub-txt"><FiMail /> {item.customerEmail}</span>
//                         )}
//                       </div>
//                     </td>

//                     <td>
//                       <strong className="trh-device-txt">
//                         {item.deviceModel || item.laptopModel || "Device Unspecified"}
//                       </strong>
//                     </td>

//                     <td className="trh-issue-cell">
//                       <p className="trh-issue-p">{item.issueDescription}</p>
//                       {item.remarks && (
//                         <span className="trh-remark-tag">Note: {item.remarks}</span>
//                       )}
//                       {Array.isArray(item.services) && item.services.length > 0 && (
//                         <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
//                           {item.services.map((s, idx) => (
//                             <span
//                               key={idx}
//                               style={{
//                                 fontSize: "11px",
//                                 background: "#eef2ff",
//                                 color: "#3730a3",
//                                 padding: "2px 6px",
//                                 borderRadius: "4px",
//                                 border: "1px solid #c7d2fe",
//                               }}
//                             >
//                               {s.serviceName || s.name} (₹{s.totalCost ?? (Number(s.partCost || 0) + Number(s.laborCost || 0))})
//                             </span>
//                           ))}
//                         </div>
//                       )}
//                     </td>

//                     <td>
//                       <span className="trh-turnaround-badge">
//                         <FiClock /> {calculateTurnaround(item.createdAt, item.updatedAt)}
//                       </span>
//                     </td>

//                     <td>
//                       <strong className="trh-cost-txt">
//                         ₹{Number(item.repairCost || 0).toFixed(2)}
//                       </strong>
//                     </td>

//                     <td>
//                       <span className={`trh-status-pill ${String(item.status || "completed").toLowerCase().replaceAll(" ", "-")}`}>
//                         {item.status || "Completed"}
//                       </span>
//                     </td>

//                     <td className="trh-td-right">
//                       <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
//                         <button
//                           type="button"
//                           className="trh-btn-edit"
//                           title="Add / Edit Work Services"
//                           onClick={() => handleOpenServiceModal(item)}
//                         >
//                           <FiEdit3 /> Services
//                         </button>
//                         <button
//                           type="button"
//                           className="trh-btn-print"
//                           onClick={() => setSelectedInvoice(item)}
//                         >
//                           <FiPrinter /> Receipt
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>

//       {/* Modal 1: Add/Edit Work Services & Billing Breakdown */}
//       {serviceModalItem && (
//         <div
//           className="trh-modal-overlay"
//           onMouseDown={(e) => e.target === e.currentTarget && setServiceModalItem(null)}
//         >
//           <div className="trh-modal-box" style={{ maxWidth: "650px" }}>
//             <div className="trh-modal-header">
//               <div>
//                 <span className="trh-eyebrow">BILLING & WORK BREAKDOWN</span>
//                 <h2>Add Completed Repair Work</h2>
//                 <small style={{ color: "#6b7280" }}>
//                   Ticket: {serviceModalItem.repairNumber || serviceModalItem._id}
//                 </small>
//               </div>
//               <button
//                 type="button"
//                 className="trh-btn-close"
//                 onClick={() => setServiceModalItem(null)}
//               >
//                 <FiX />
//               </button>
//             </div>

//             <div style={{ padding: "16px 20px" }}>
//               {/* Option A: Select Predefined Service */}
//               <div style={{ marginBottom: "16px" }}>
//                 <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
//                   Select Standard Service:
//                 </label>
//                 <div style={{ display: "flex", gap: "8px" }}>
//                   <select
//                     className="trh-select"
//                     style={{ flex: 1 }}
//                     value={selectedServiceId}
//                     onChange={(e) => setSelectedServiceId(e.target.value)}
//                   >
//                     <option value="">-- Choose Standard Service --</option>
//                     {availableServices.map((srv) => (
//                       <option key={srv._id} value={srv._id}>
//                         {srv.serviceName} ({srv.category}) — Part: ₹{srv.partCost} + Labor: ₹{srv.laborCost} = ₹{srv.totalCost}
//                       </option>
//                     ))}
//                   </select>
//                   <button
//                     type="button"
//                     className="btn-modal-pri"
//                     onClick={handleAddPredefinedService}
//                     disabled={!selectedServiceId}
//                   >
//                     <FiPlus /> Add
//                   </button>
//                 </div>
//               </div>

//               {/* Option B: Add Custom Work */}
//               <div style={{ marginBottom: "20px" }}>
//                 <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
//                   Or Add Custom Service / Component:
//                 </label>
//                 <div style={{ display: "flex", gap: "8px" }}>
//                   <input
//                     type="text"
//                     placeholder="e.g. BIOS Chip Programming"
//                     value={customServiceName}
//                     onChange={(e) => setCustomServiceName(e.target.value)}
//                     style={{ flex: 2, padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: "6px" }}
//                   />
//                   <input
//                     type="number"
//                     placeholder="Part (₹)"
//                     value={customPartCost}
//                     onChange={(e) => setCustomPartCost(e.target.value)}
//                     style={{ width: "90px", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: "6px" }}
//                   />
//                   <input
//                     type="number"
//                     placeholder="Labor (₹)"
//                     value={customLaborCost}
//                     onChange={(e) => setCustomLaborCost(e.target.value)}
//                     style={{ width: "90px", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: "6px" }}
//                   />
//                   <button
//                     type="button"
//                     className="btn-modal-sec"
//                     onClick={handleAddCustomService}
//                   >
//                     <FiPlus /> Add
//                   </button>
//                 </div>
//               </div>

//               {/* Applied Services List */}
//               <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
//                 <h4 style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
//                   Applied Services Breakdown ({appliedServices.length})
//                 </h4>

//                 {appliedServices.length === 0 ? (
//                   <p style={{ fontSize: "12px", color: "#9ca3af" }}>
//                     No services attached. Add services above to calculate the final repair cost.
//                   </p>
//                 ) : (
//                   <div style={{ maxHeight: "180px", overflowY: "auto" }}>
//                     {appliedServices.map((srv, idx) => (
//                       <div
//                         key={idx}
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           padding: "8px 0",
//                           borderBottom: "1px dashed #f3f4f6",
//                         }}
//                       >
//                         <div>
//                           <strong style={{ fontSize: "13px", color: "#1f2937" }}>
//                             {srv.serviceName || srv.name}
//                           </strong>
//                           <div style={{ fontSize: "11px", color: "#6b7280" }}>
//                             Part: ₹{srv.partCost || 0} | Labor: ₹{srv.laborCost || 0}
//                           </div>
//                         </div>

//                         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//                           <strong style={{ fontSize: "13px", color: "#059669" }}>
//                             ₹{Number(srv.totalCost ?? (Number(srv.partCost || 0) + Number(srv.laborCost || 0))).toFixed(2)}
//                           </strong>
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveService(idx)}
//                             style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
//                           >
//                             <FiTrash2 />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     paddingTop: "12px",
//                     marginTop: "8px",
//                     borderTop: "2px solid #e5e7eb",
//                     fontWeight: "bold",
//                     fontSize: "15px",
//                   }}
//                 >
//                   <span>Grand Total Cost:</span>
//                   <span style={{ color: "#059669" }}>₹{calculatedModalTotal.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="trh-modal-actions">
//               <button
//                 type="button"
//                 className="btn-modal-sec"
//                 onClick={() => setServiceModalItem(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 className="btn-modal-pri"
//                 onClick={handleSaveServices}
//                 disabled={savingServices}
//               >
//                 {savingServices ? "Updating..." : "Save & Update Bill"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal 2: Printable Voucher / Invoice */}
//       {selectedInvoice && (
//         <div
//           className="trh-modal-overlay"
//           onMouseDown={(e) => e.target === e.currentTarget && setSelectedInvoice(null)}
//         >
//           <div className="trh-modal-box">
//             <div className="trh-modal-header no-print">
//               <div>
//                 <span className="trh-eyebrow">RECEIPT PREVIEW</span>
//                 <h2>Service Delivery Voucher</h2>
//               </div>
//               <button
//                 type="button"
//                 className="trh-btn-close"
//                 onClick={() => setSelectedInvoice(null)}
//               >
//                 <FiX />
//               </button>
//             </div>

//             <div className="trh-invoice-sheet" id="printable-receipt">
//               <div className="invoice-head">
//                 <div>
//                   <h1 className="brand-name">ZAID INFOTECH</h1>
//                   <p className="brand-sub">Premium Hardware Repairs & IT Services</p>
//                 </div>
//                 <div className="invoice-meta">
//                   <h3>SERVICE RECEIPT</h3>
//                   <span>Ticket: {selectedInvoice.repairNumber || selectedInvoice._id.slice(-6).toUpperCase()}</span>
//                   <span>Date: {new Date(selectedInvoice.updatedAt || Date.now()).toLocaleDateString()}</span>
//                 </div>
//               </div>

//               <hr className="divider" />

//               <div className="invoice-grid">
//                 <div>
//                   <span className="meta-head">CUSTOMER DETAILS</span>
//                   <strong>{selectedInvoice.customerName}</strong>
//                   <div>Phone: {selectedInvoice.customerPhone}</div>
//                   {selectedInvoice.customerEmail && <div>Email: {selectedInvoice.customerEmail}</div>}
//                 </div>
//                 <div>
//                   <span className="meta-head">HARDWARE REPAIRED</span>
//                   <strong>{selectedInvoice.deviceModel || selectedInvoice.laptopModel}</strong>
//                   <div>Technician: {selectedInvoice.technicianName || "Assigned Technician"}</div>
//                   <div>Status: {selectedInvoice.status || "Delivered"}</div>
//                 </div>
//               </div>

//               <div className="invoice-table-section">
//                 <table className="invoice-table">
//                   <thead>
//                     <tr>
//                       <th>Service / Problem Description</th>
//                       <th className="text-right">Part (₹)</th>
//                       <th className="text-right">Labor (₹)</th>
//                       <th className="text-right">Total (₹)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Array.isArray(selectedInvoice.services) && selectedInvoice.services.length > 0 ? (
//                       selectedInvoice.services.map((srv, idx) => (
//                         <tr key={idx}>
//                           <td>
//                             <strong>{srv.serviceName || srv.name}</strong>
//                             {idx === 0 && selectedInvoice.issueDescription && (
//                               <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#6b7280" }}>
//                                 Issue: {selectedInvoice.issueDescription}
//                               </p>
//                             )}
//                           </td>
//                           <td className="text-right">{Number(srv.partCost || 0).toFixed(2)}</td>
//                           <td className="text-right">{Number(srv.laborCost || 0).toFixed(2)}</td>
//                           <td className="text-right">
//                             ₹{Number(srv.totalCost ?? (Number(srv.partCost || 0) + Number(srv.laborCost || 0))).toFixed(2)}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td>
//                           <strong>Repair Diagnostic & Labor</strong>
//                           <p>{selectedInvoice.issueDescription}</p>
//                         </td>
//                         <td className="text-right">—</td>
//                         <td className="text-right">—</td>
//                         <td className="text-right">
//                           ₹{Number(selectedInvoice.repairCost || 0).toFixed(2)}
//                         </td>
//                       </tr>
//                     )}
//                     {selectedInvoice.remarks && (
//                       <tr>
//                         <td colSpan={3}>
//                           <em>Intake Remarks: {selectedInvoice.remarks}</em>
//                         </td>
//                         <td className="text-right">—</td>
//                       </tr>
//                     )}
//                   </tbody>
//                   <tfoot>
//                     <tr>
//                       <th colSpan={3}>Total Amount Due / Paid:</th>
//                       <th className="text-right total-cell">
//                         ₹{Number(selectedInvoice.repairCost || 0).toFixed(2)}
//                       </th>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>

//               <div className="invoice-footer-notes">
//                 <p>Thank you for choosing Zaid Infotech. 30 Days service warranty applies on replaced components.</p>
//               </div>
//             </div>

//             <div className="trh-modal-actions no-print">
//               <button
//                 type="button"
//                 className="btn-modal-sec"
//                 onClick={() => setSelectedInvoice(null)}
//               >
//                 Close
//               </button>
//               <button
//                 type="button"
//                 className="btn-modal-pri"
//                 onClick={() => window.print()}
//               >
//                 <FiPrinter /> Print Voucher
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiPrinter,
  FiClock,
  FiDollarSign,
  FiRefreshCw,
  FiInbox,
  FiX,
  FiPlus,
  FiTrash2,
  FiEdit3
} from "react-icons/fi";
import { toast } from "react-toastify";
import "./TechnicianRepairHistory.css";

// const BASE_URL = "http://localhost:5000/api/newRepair";
// const SERVICES_API = "http://localhost:5000/api/repair-service/get-services";

const API_URL = import.meta.env.VITE_API_URL;

const BASE_URL = `${API_URL}/newRepair`;
const SERVICES_API = `${API_URL}/repair-service/get-services`;


export default function TechnicianRepairHistory() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [availableServices, setAvailableServices] = useState([]);
  const [serviceModalItem, setServiceModalItem] = useState(null);
  const [appliedServices, setAppliedServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [customServiceName, setCustomServiceName] = useState("");
  const [customPartCost, setCustomPartCost] = useState("");
  const [customLaborCost, setCustomLaborCost] = useState("");
  const [savingServices, setSavingServices] = useState(false);

  const token = localStorage.getItem("token");

  const loggedInUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const techId = loggedInUser._id || loggedInUser.id || "";
  const techName = (
    loggedInUser.name ||
    loggedInUser.fullName ||
    `${loggedInUser.firstName || ""} ${loggedInUser.lastName || ""}`
  ).trim().toLowerCase();

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${token}` }
  });

  // Fetch master services
  const fetchAvailableServices = async () => {
    try {
      const res = await axios.get(SERVICES_API, getAuthConfig());
      const data = res.data?.services || (Array.isArray(res.data) ? res.data : []);
      setAvailableServices(data);
    } catch (err) {
      console.error("Failed to load services:", err);
    }
  };

  // Fetch repair history
  const fetchHistory = async () => {
    try {
      setLoading(true);
      let res;

      try {
        res = await axios.get(`${BASE_URL}/my-assigned-repairs`, getAuthConfig());
      } catch {
        res = await axios.get(`${BASE_URL}/`, getAuthConfig());
      }

      const raw =
        res.data?.repairs ||
        res.data?.data ||
        (Array.isArray(res.data) ? res.data : []);

      setRepairs(raw);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load repair history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchAvailableServices();
  }, []);

  // Filter technician history
  const historyRecords = useMemo(() => {
    return repairs.filter((r) => {
      const assigned = r.assignedTechnician;
      const assignedId =
        typeof assigned === "object"
          ? assigned?._id || assigned?.id
          : assigned;

      const matchesTech =
        (techId &&
          assignedId &&
          String(assignedId) === String(techId)) ||
        (techName &&
          r.technicianName &&
          (r.technicianName.toLowerCase() === techName ||
            r.technicianName.toLowerCase().includes(techName) ||
            techName.includes(r.technicianName.toLowerCase())));

      if (!matchesTech) return false;

      const status = String(r.status || "").toLowerCase();

      return (
        ["completed", "delivered", "ready for delivery", "cancelled"].includes(status) ||
        r.isDelivered === true
      );
    });
  }, [repairs, techId, techName]);

  // Search and date filters
  const filteredRecords = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    const now = new Date();

    return historyRecords.filter((item) => {
      const model = item.deviceModel || item.laptopModel || "";

      const matchesSearch =
        !q ||
        item.customerName?.toLowerCase().includes(q) ||
        item.customerPhone?.includes(q) ||
        item.repairNumber?.toLowerCase().includes(q) ||
        model.toLowerCase().includes(q);

      let matchesDate = true;
      const recordDate = new Date(
        item.updatedAt || item.createdAt || Date.now()
      );

      if (dateFilter === "30_DAYS") {
        const past30 = new Date(
          now.getTime() - 30 * 24 * 60 * 60 * 1000
        );
        matchesDate = recordDate >= past30;
      } else if (dateFilter === "THIS_MONTH") {
        matchesDate =
          recordDate.getMonth() === now.getMonth() &&
          recordDate.getFullYear() === now.getFullYear();
      }

      return matchesSearch && matchesDate;
    });
  }, [historyRecords, searchTerm, dateFilter]);

  // Calculate turnaround
  const calculateTurnaround = (createdAt, updatedAt) => {
    if (!createdAt) return "1 Day";

    const start = new Date(createdAt);
    const end = updatedAt ? new Date(updatedAt) : new Date();
    const diffDays = Math.ceil(
      Math.abs(end - start) / (1000 * 60 * 60 * 24)
    );

    return `${diffDays} Day${diffDays > 1 ? "s" : ""}`;
  };

  const totalDelivered = filteredRecords.filter((r) =>
    ["completed", "delivered"].includes(
      String(r.status || "").toLowerCase()
    )
  ).length;

  const totalHistoricalRevenue = filteredRecords.reduce(
    (sum, r) => sum + (Number(r.repairCost) || 0),
    0
  );

  // Open service modal
  const handleOpenServiceModal = (item) => {
    setServiceModalItem(item);

    setAppliedServices(
      Array.isArray(item.services)
        ? item.services.map((s) => ({
            serviceId: s.serviceId || s._id || null,
            serviceName: s.serviceName || s.name || "",
            category: s.category || "Custom Repair",
            partCost: Number(s.partCost || 0),
            laborCost: Number(s.laborCost || 0),
            totalCost: Number(
              s.totalCost ??
                (Number(s.partCost || 0) + Number(s.laborCost || 0))
            ),
            isCustom: s.isCustom ?? !s.serviceId
          }))
        : []
    );

    setSelectedServiceId("");
    setCustomServiceName("");
    setCustomPartCost("");
    setCustomLaborCost("");
  };

  // Add predefined service
  const handleAddPredefinedService = () => {
    if (!selectedServiceId) return;

    const found = availableServices.find(
      (s) => String(s._id) === String(selectedServiceId)
    );

    if (!found) return;

    const part = Number(found.partCost || 0);
    const labor = Number(found.laborCost || 0);
    const total = Number(found.totalCost ?? part + labor);

    setAppliedServices((prev) => [
      ...prev,
      {
        serviceId: found._id,
        serviceName: found.serviceName,
        category: found.category || "General Repair",
        partCost: part,
        laborCost: labor,
        totalCost: total,
        isCustom: false
      }
    ]);

    setSelectedServiceId("");
  };

  // Add custom service
  const handleAddCustomService = () => {
    if (!customServiceName.trim()) {
      toast.warn("Please enter a service name");
      return;
    }

    const part = Number(customPartCost) || 0;
    const labor = Number(customLaborCost) || 0;
    const total = part + labor;

    setAppliedServices((prev) => [
      ...prev,
      {
        serviceId: null,
        serviceName: customServiceName.trim(),
        category: "Custom Repair",
        partCost: part,
        laborCost: labor,
        totalCost: total,
        isCustom: true
      }
    ]);

    setCustomServiceName("");
    setCustomPartCost("");
    setCustomLaborCost("");
  };

  // Remove service
  const handleRemoveService = (index) => {
    setAppliedServices((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const calculatedModalTotal = useMemo(() => {
    return appliedServices.reduce(
      (sum, s) => sum + (Number(s.totalCost) || 0),
      0
    );
  }, [appliedServices]);

  // Save services
  const handleSaveServices = async () => {
    if (!serviceModalItem) return;

    try {
      setSavingServices(true);

      const repairId =
        serviceModalItem._id || serviceModalItem.id;

      const services = appliedServices.map((s) => ({
        serviceId: s.serviceId || null,
        serviceName: s.serviceName || "",
        category: s.category || "Custom Repair",
        partCost: Number(s.partCost) || 0,
        laborCost: Number(s.laborCost) || 0,
        totalCost: Number(
          s.totalCost ??
            ((Number(s.partCost) || 0) +
              (Number(s.laborCost) || 0))
        ),
        isCustom: s.isCustom ?? !s.serviceId
      }));

      const payload = {
        services,
        repairCost: calculatedModalTotal
      };

      const res = await axios.put(
        `${BASE_URL}/${repairId}`,
        payload,
        getAuthConfig()
      );

      toast.success("Services and repair cost updated successfully");

      const updatedRecord =
        res.data?.repair ||
        res.data?.data || {
          ...serviceModalItem,
          ...payload
        };

      setRepairs((prev) =>
        prev.map((r) =>
          r._id === repairId
            ? { ...r, ...updatedRecord }
            : r
        )
      );

      if (
        selectedInvoice &&
        selectedInvoice._id === repairId
      ) {
        setSelectedInvoice({
          ...selectedInvoice,
          ...updatedRecord
        });
      }

      setServiceModalItem(null);
    } catch (err) {
      console.error(
        "Update services error:",
        err.response?.data || err
      );

      toast.error(
        err.response?.data?.message ||
          "Failed to update repair services"
      );
    } finally {
      setSavingServices(false);
    }
  };

  return (
    <div className="trh-container">
      <header className="trh-header">
        <div>
          <span className="trh-eyebrow">ARCHIVE & AUDIT</span>
          <h1>Technician Repair History</h1>
          <p>
            Historical records, customer delivery receipts, and resolved service tickets.
          </p>
        </div>

        <button
          type="button"
          className="trh-sync-btn"
          onClick={fetchHistory}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? "trh-spin" : ""} />
          <span>Sync Archive</span>
        </button>
      </header>

      <section className="trh-metrics">
        <div className="trh-metric-card">
          <div className="trh-metric-ico icon-blue">
            <FiCheckCircle />
          </div>
          <div>
            <span className="trh-lbl">Delivered / Completed</span>
            <strong className="trh-val">
              {totalDelivered} Jobs
            </strong>
          </div>
        </div>

        <div className="trh-metric-card">
          <div className="trh-metric-ico icon-purple">
            <FiDollarSign />
          </div>
          <div>
            <span className="trh-lbl">Total Completed Value</span>
            <strong className="trh-val">
              ₹{totalHistoricalRevenue.toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="trh-metric-card">
          <div className="trh-metric-ico icon-amber">
            <FiClock />
          </div>
          <div>
            <span className="trh-lbl">Avg Resolution Speed</span>
            <strong className="trh-val">~1.5 Days</strong>
          </div>
        </div>
      </section>

      <section className="trh-card">
        <div className="trh-toolbar">
          <div className="trh-search-wrap">
            <FiSearch className="trh-search-ico" />
            <input
              type="text"
              placeholder="Search by ticket, customer, phone, model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="trh-filter-group">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="trh-select"
            >
              <option value="ALL">All Time History</option>
              <option value="THIS_MONTH">This Month</option>
              <option value="30_DAYS">Last 30 Days</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="trh-state-box">
            <div className="trh-spinner"></div>
            <p>Loading historical records...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="trh-state-box">
            <div className="trh-empty-ico">
              <FiInbox />
            </div>
            <h3>No Completed History Found</h3>
            <p>
              Closed and delivered repair tickets will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="trh-table-wrap">
            <table className="trh-table">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Customer Info</th>
                  <th>Device Model</th>
                  <th>Diagnostic & Applied Services</th>
                  <th>Turnaround</th>
                  <th>Final Cost</th>
                  <th>Status</th>
                  <th className="trh-th-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <span className="trh-ticket-code">
                        {item.repairNumber ||
                          item._id?.slice(-6).toUpperCase()}
                      </span>
                    </td>

                    <td>
                      <div className="trh-cust-cell">
                        <strong>{item.customerName}</strong>

                        <span className="trh-sub-txt">
                          <FiPhone /> {item.customerPhone}
                        </span>

                        {item.customerEmail && (
                          <span className="trh-sub-txt">
                            <FiMail /> {item.customerEmail}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <strong className="trh-device-txt">
                        {item.deviceModel ||
                          item.laptopModel ||
                          "Device Unspecified"}
                      </strong>
                    </td>

                    <td className="trh-issue-cell">
                      <p className="trh-issue-p">
                        {item.issueDescription}
                      </p>

                      {item.remarks && (
                        <span className="trh-remark-tag">
                          Note: {item.remarks}
                        </span>
                      )}

                      {Array.isArray(item.services) &&
                        item.services.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "4px",
                              marginTop: "6px"
                            }}
                          >
                            {item.services.map((s, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: "11px",
                                  background: "#eef2ff",
                                  color: "#3730a3",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  border: "1px solid #c7d2fe"
                                }}
                              >
                                {s.serviceName || s.name} (₹
                                {s.totalCost ??
                                  Number(s.partCost || 0) +
                                    Number(s.laborCost || 0)}
                                )
                              </span>
                            ))}
                          </div>
                        )}
                    </td>

                    <td>
                      <span className="trh-turnaround-badge">
                        <FiClock />
                        {calculateTurnaround(
                          item.createdAt,
                          item.updatedAt
                        )}
                      </span>
                    </td>

                    <td>
                      <strong className="trh-cost-txt">
                        ₹
                        {Number(
                          item.repairCost || 0
                        ).toFixed(2)}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`trh-status-pill ${String(
                          item.status || "completed"
                        )
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {item.status || "Completed"}
                      </span>
                    </td>

                    <td className="trh-td-right">
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          justifyContent: "flex-end"
                        }}
                      >
                        <button
                          type="button"
                          className="trh-btn-edit"
                          title="Add / Edit Work Services"
                          onClick={() =>
                            handleOpenServiceModal(item)
                          }
                        >
                          <FiEdit3 /> Services
                        </button>

                        <button
                          type="button"
                          className="trh-btn-print"
                          onClick={() =>
                            setSelectedInvoice(item)
                          }
                        >
                          <FiPrinter /> Receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {serviceModalItem && (
        <div
          className="trh-modal-overlay"
          onMouseDown={(e) =>
            e.target === e.currentTarget &&
            setServiceModalItem(null)
          }
        >
          <div
            className="trh-modal-box"
            style={{ maxWidth: "650px" }}
          >
            <div className="trh-modal-header">
              <div>
                <span className="trh-eyebrow">
                  BILLING & WORK BREAKDOWN
                </span>
                <h2>Add Completed Repair Work</h2>
                <small style={{ color: "#6b7280" }}>
                  Ticket:{" "}
                  {serviceModalItem.repairNumber ||
                    serviceModalItem._id}
                </small>
              </div>

              <button
                type="button"
                className="trh-btn-close"
                onClick={() =>
                  setServiceModalItem(null)
                }
              >
                <FiX />
              </button>
            </div>

            <div style={{ padding: "16px 20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "6px"
                  }}
                >
                  Select Standard Service:
                </label>

                <div
                  style={{
                    display: "flex",
                    gap: "8px"
                  }}
                >
                  <select
                    className="trh-select"
                    style={{ flex: 1 }}
                    value={selectedServiceId}
                    onChange={(e) =>
                      setSelectedServiceId(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      -- Choose Standard Service --
                    </option>

                    {availableServices.map((srv) => (
                      <option
                        key={srv._id}
                        value={srv._id}
                      >
                        {srv.serviceName} (
                        {srv.category}) — Part: ₹
                        {srv.partCost} + Labor: ₹
                        {srv.laborCost} = ₹
                        {srv.totalCost}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="btn-modal-pri"
                    onClick={
                      handleAddPredefinedService
                    }
                    disabled={!selectedServiceId}
                  >
                    <FiPlus /> Add
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "6px"
                  }}
                >
                  Or Add Custom Service / Component:
                </label>

                <div
                  style={{
                    display: "flex",
                    gap: "8px"
                  }}
                >
                  <input
                    type="text"
                    placeholder="e.g. BIOS Chip Programming"
                    value={customServiceName}
                    onChange={(e) =>
                      setCustomServiceName(
                        e.target.value
                      )
                    }
                    style={{
                      flex: 2,
                      padding: "8px 10px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px"
                    }}
                  />

                  <input
                    type="number"
                    placeholder="Part (₹)"
                    value={customPartCost}
                    onChange={(e) =>
                      setCustomPartCost(
                        e.target.value
                      )
                    }
                    style={{
                      width: "90px",
                      padding: "8px 10px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px"
                    }}
                  />

                  <input
                    type="number"
                    placeholder="Labor (₹)"
                    value={customLaborCost}
                    onChange={(e) =>
                      setCustomLaborCost(
                        e.target.value
                      )
                    }
                    style={{
                      width: "90px",
                      padding: "8px 10px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px"
                    }}
                  />

                  <button
                    type="button"
                    className="btn-modal-sec"
                    onClick={handleAddCustomService}
                  >
                    <FiPlus /> Add
                  </button>
                </div>
              </div>

              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "12px"
                }}
              >
                <h4
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "8px"
                  }}
                >
                  Applied Services Breakdown (
                  {appliedServices.length})
                </h4>

                {appliedServices.length === 0 ? (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af"
                    }}
                  >
                    No services attached. Add services above to calculate the final repair cost.
                  </p>
                ) : (
                  <div
                    style={{
                      maxHeight: "180px",
                      overflowY: "auto"
                    }}
                  >
                    {appliedServices.map((srv, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 0",
                          borderBottom:
                            "1px dashed #f3f4f6"
                        }}
                      >
                        <div>
                          <strong
                            style={{
                              fontSize: "13px",
                              color: "#1f2937"
                            }}
                          >
                            {srv.serviceName ||
                              srv.name}
                          </strong>

                          <div
                            style={{
                              fontSize: "11px",
                              color: "#6b7280"
                            }}
                          >
                            {srv.category} | Part: ₹
                            {srv.partCost || 0} | Labor:
                            ₹{srv.laborCost || 0}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px"
                          }}
                        >
                          <strong
                            style={{
                              fontSize: "13px",
                              color: "#059669"
                            }}
                          >
                            ₹
                            {Number(
                              srv.totalCost ??
                                Number(
                                  srv.partCost || 0
                                ) +
                                  Number(
                                    srv.laborCost || 0
                                  )
                            ).toFixed(2)}
                          </strong>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveService(idx)
                            }
                            style={{
                              background: "none",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer"
                            }}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "12px",
                    marginTop: "8px",
                    borderTop: "2px solid #e5e7eb",
                    fontWeight: "bold",
                    fontSize: "15px"
                  }}
                >
                  <span>Grand Total Cost:</span>
                  <span style={{ color: "#059669" }}>
                    ₹{calculatedModalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="trh-modal-actions">
              <button
                type="button"
                className="btn-modal-sec"
                onClick={() =>
                  setServiceModalItem(null)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-modal-pri"
                onClick={handleSaveServices}
                disabled={savingServices}
              >
                {savingServices
                  ? "Updating..."
                  : "Save & Update Bill"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedInvoice && (
        <div
          className="trh-modal-overlay"
          onMouseDown={(e) =>
            e.target === e.currentTarget &&
            setSelectedInvoice(null)
          }
        >
          <div className="trh-modal-box">
            <div className="trh-modal-header no-print">
              <div>
                <span className="trh-eyebrow">
                  RECEIPT PREVIEW
                </span>
                <h2>Service Delivery Voucher</h2>
              </div>

              <button
                type="button"
                className="trh-btn-close"
                onClick={() =>
                  setSelectedInvoice(null)
                }
              >
                <FiX />
              </button>
            </div>

            <div
              className="trh-invoice-sheet"
              id="printable-receipt"
            >
              <div className="invoice-head">
                <div>
                  <h1 className="brand-name">
                    ZAID INFOTECH
                  </h1>
                  <p className="brand-sub">
                    Premium Hardware Repairs & IT Services
                  </p>
                </div>

                <div className="invoice-meta">
                  <h3>SERVICE RECEIPT</h3>
                  <span>
                    Ticket:{" "}
                    {selectedInvoice.repairNumber ||
                      selectedInvoice._id
                        ?.slice(-6)
                        .toUpperCase()}
                  </span>
                  <span>
                    Date:{" "}
                    {new Date(
                      selectedInvoice.updatedAt ||
                        Date.now()
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <hr className="divider" />

              <div className="invoice-grid">
                <div>
                  <span className="meta-head">
                    CUSTOMER DETAILS
                  </span>
                  <strong>
                    {selectedInvoice.customerName}
                  </strong>
                  <div>
                    Phone:{" "}
                    {selectedInvoice.customerPhone}
                  </div>

                  {selectedInvoice.customerEmail && (
                    <div>
                      Email:{" "}
                      {selectedInvoice.customerEmail}
                    </div>
                  )}
                </div>

                <div>
                  <span className="meta-head">
                    HARDWARE REPAIRED
                  </span>

                  <strong>
                    {selectedInvoice.deviceModel ||
                      selectedInvoice.laptopModel}
                  </strong>

                  <div>
                    Technician:{" "}
                    {selectedInvoice.technicianName ||
                      "Assigned Technician"}
                  </div>

                  <div>
                    Status:{" "}
                    {selectedInvoice.status ||
                      "Delivered"}
                  </div>
                </div>
              </div>

              <div className="invoice-table-section">
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>
                        Service / Problem Description
                      </th>
                      <th className="text-right">
                        Part (₹)
                      </th>
                      <th className="text-right">
                        Labor (₹)
                      </th>
                      <th className="text-right">
                        Total (₹)
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {Array.isArray(
                      selectedInvoice.services
                    ) &&
                    selectedInvoice.services.length > 0 ? (
                      selectedInvoice.services.map(
                        (srv, idx) => (
                          <tr key={idx}>
                            <td>
                              <strong>
                                {srv.serviceName ||
                                  srv.name}
                              </strong>

                              {idx === 0 &&
                                selectedInvoice.issueDescription && (
                                  <p
                                    style={{
                                      margin:
                                        "2px 0 0",
                                      fontSize: "11px",
                                      color: "#6b7280"
                                    }}
                                  >
                                    Issue:{" "}
                                    {
                                      selectedInvoice.issueDescription
                                    }
                                  </p>
                                )}

                              {srv.category && (
                                <small
                                  style={{
                                    display: "block",
                                    fontSize: "10px",
                                    color: "#6b7280"
                                  }}
                                >
                                  {srv.category}
                                </small>
                              )}
                            </td>

                            <td className="text-right">
                              {Number(
                                srv.partCost || 0
                              ).toFixed(2)}
                            </td>

                            <td className="text-right">
                              {Number(
                                srv.laborCost || 0
                              ).toFixed(2)}
                            </td>

                            <td className="text-right">
                              ₹
                              {Number(
                                srv.totalCost ??
                                  Number(
                                    srv.partCost || 0
                                  ) +
                                    Number(
                                      srv.laborCost || 0
                                    )
                              ).toFixed(2)}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td>
                          <strong>
                            Repair Diagnostic & Labor
                          </strong>
                          <p>
                            {
                              selectedInvoice.issueDescription
                            }
                          </p>
                        </td>

                        <td className="text-right">
                          —
                        </td>

                        <td className="text-right">
                          —
                        </td>

                        <td className="text-right">
                          ₹
                          {Number(
                            selectedInvoice.repairCost ||
                              0
                          ).toFixed(2)}
                        </td>
                      </tr>
                    )}

                    {selectedInvoice.remarks && (
                      <tr>
                        <td colSpan={3}>
                          <em>
                            Intake Remarks:{" "}
                            {selectedInvoice.remarks}
                          </em>
                        </td>

                        <td className="text-right">
                          —
                        </td>
                      </tr>
                    )}
                  </tbody>

                  <tfoot>
                    <tr>
                      <th colSpan={3}>
                        Total Amount Due / Paid:
                      </th>

                      <th className="text-right total-cell">
                        ₹
                        {Number(
                          selectedInvoice.repairCost ||
                            0
                        ).toFixed(2)}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="invoice-footer-notes">
                <p>
                  Thank you for choosing Zaid Infotech. 30 Days service warranty applies on replaced components.
                </p>
              </div>
            </div>

            <div className="trh-modal-actions no-print">
              <button
                type="button"
                className="btn-modal-sec"
                onClick={() =>
                  setSelectedInvoice(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="btn-modal-pri"
                onClick={() => window.print()}
              >
                <FiPrinter /> Print Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}