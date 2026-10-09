// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";

// import {
//   FiSearch,
//   FiPhone,
//   FiMail,
//   FiCheckCircle,
//   FiPrinter,
//   FiClock,
//   FiRefreshCw,
//   FiInbox,
//   FiX,
//   FiPlus,
//   FiTrash2,
//   FiEdit3,
// } from "react-icons/fi";

// import { FaRupeeSign } from "react-icons/fa";

// import { toast } from "react-toastify";

// import "./TechnicianRepairHistory.css";

// // ======================================================
// // API
// // ======================================================

// // VITE_API_URL already contains /api
// // .env:
// // VITE_API_URL=http://localhost:5000/api

// const API_URL = import.meta.env.VITE_API_URL;

// const BASE_URL = `${API_URL}/newRepair`;
// const SERVICES_API = `${API_URL}/repair-service/get-services`;

// // ======================================================
// // INDIAN RUPEE FORMATTER
// // ======================================================

// const formatINR = (amount) => {
//   const value = Number(amount) || 0;

//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(value);
// };

// // ======================================================
// // COMPONENT
// // ======================================================

// export default function TechnicianRepairHistory() {
//   const [repairs, setRepairs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [dateFilter, setDateFilter] = useState("ALL");

//   const [selectedInvoice, setSelectedInvoice] = useState(null);

//   const [availableServices, setAvailableServices] = useState([]);
//   const [serviceModalItem, setServiceModalItem] = useState(null);

//   const [appliedServices, setAppliedServices] = useState([]);
//   const [selectedServiceId, setSelectedServiceId] = useState("");

//   const [customServiceName, setCustomServiceName] = useState("");
//   const [customPartCost, setCustomPartCost] = useState("");
//   const [customLaborCost, setCustomLaborCost] = useState("");

//   const [savingServices, setSavingServices] = useState(false);

//   // ======================================================
//   // TOKEN
//   // ======================================================

//   const token =
//     localStorage.getItem("token") ||
//     localStorage.getItem("accessToken");

//   // ======================================================
//   // LOGGED IN USER
//   // ======================================================

//   const loggedInUser = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user")) || {};
//     } catch {
//       return {};
//     }
//   }, []);

//   const techId =
//     loggedInUser._id ||
//     loggedInUser.id ||
//     "";

//   const techName = (
//     loggedInUser.name ||
//     loggedInUser.fullName ||
//     `${loggedInUser.firstName || ""} ${
//       loggedInUser.lastName || ""
//     }`
//   )
//     .trim()
//     .toLowerCase();

//   // ======================================================
//   // AUTH CONFIG
//   // ======================================================

//   const getAuthConfig = () => ({
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   // ======================================================
//   // FETCH MASTER SERVICES
//   // ======================================================

//   const fetchAvailableServices = async () => {
//     try {
//       const res = await axios.get(
//         SERVICES_API,
//         getAuthConfig()
//       );

//       const data =
//         res.data?.services ||
//         res.data?.data ||
//         (Array.isArray(res.data)
//           ? res.data
//           : []);

//       setAvailableServices(
//         Array.isArray(data) ? data : []
//       );
//     } catch (err) {
//       console.error(
//         "Failed to load services:",
//         err
//       );
//     }
//   };

//   // ======================================================
//   // FETCH REPAIR HISTORY
//   // ======================================================

//   const fetchHistory = async () => {
//     try {
//       setLoading(true);

//       let res;

//       try {
//         res = await axios.get(
//           `${BASE_URL}/my-assigned-repairs`,
//           getAuthConfig()
//         );
//       } catch {
//         res = await axios.get(
//           `${BASE_URL}/`,
//           getAuthConfig()
//         );
//       }

//       const raw =
//         res.data?.repairs ||
//         res.data?.data ||
//         (Array.isArray(res.data)
//           ? res.data
//           : []);

//       setRepairs(
//         Array.isArray(raw) ? raw : []
//       );
//     } catch (err) {
//       console.error(
//         "Fetch Repair History Error:",
//         err
//       );

//       toast.error(
//         err.response?.data?.message ||
//           "Failed to load repair history"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ======================================================
//   // INITIAL LOAD
//   // ======================================================

//   useEffect(() => {
//     fetchHistory();
//     fetchAvailableServices();
//   }, []);

//   // ======================================================
//   // FILTER TECHNICIAN HISTORY
//   // ======================================================

//   const historyRecords = useMemo(() => {
//     return repairs.filter((r) => {
//       const assigned =
//         r.assignedTechnician;

//       const assignedId =
//         typeof assigned === "object"
//           ? assigned?._id ||
//             assigned?.id
//           : assigned;

//       const matchesTech =
//         (techId &&
//           assignedId &&
//           String(assignedId) ===
//             String(techId)) ||
//         (techName &&
//           r.technicianName &&
//           (r.technicianName
//             .toLowerCase() === techName ||
//             r.technicianName
//               .toLowerCase()
//               .includes(techName) ||
//             techName.includes(
//               r.technicianName
//                 .toLowerCase()
//             )));

//       if (!matchesTech) {
//         return false;
//       }

//       const status = String(
//         r.status || ""
//       ).toLowerCase();

//       return (
//         [
//           "completed",
//           "delivered",
//           "ready for delivery",
//           "cancelled",
//         ].includes(status) ||
//         r.isDelivered === true
//       );
//     });
//   }, [
//     repairs,
//     techId,
//     techName,
//   ]);

//   // ======================================================
//   // SEARCH + DATE FILTER
//   // ======================================================

//   const filteredRecords = useMemo(() => {
//     const q = searchTerm
//       .toLowerCase()
//       .trim();

//     const now = new Date();

//     return historyRecords.filter(
//       (item) => {
//         const model =
//           item.deviceModel ||
//           item.laptopModel ||
//           "";

//         const matchesSearch =
//           !q ||
//           item.customerName
//             ?.toLowerCase()
//             .includes(q) ||
//           item.customerPhone?.includes(q) ||
//           item.repairNumber
//             ?.toLowerCase()
//             .includes(q) ||
//           model.toLowerCase().includes(q);

//         let matchesDate = true;

//         const recordDate = new Date(
//           item.updatedAt ||
//             item.createdAt ||
//             Date.now()
//         );

//         if (dateFilter === "30_DAYS") {
//           const past30 = new Date(
//             now.getTime() -
//               30 *
//                 24 *
//                 60 *
//                 60 *
//                 1000
//           );

//           matchesDate =
//             recordDate >= past30;
//         } else if (
//           dateFilter === "THIS_MONTH"
//         ) {
//           matchesDate =
//             recordDate.getMonth() ===
//               now.getMonth() &&
//             recordDate.getFullYear() ===
//               now.getFullYear();
//         }

//         return (
//           matchesSearch &&
//           matchesDate
//         );
//       }
//     );
//   }, [
//     historyRecords,
//     searchTerm,
//     dateFilter,
//   ]);

//   // ======================================================
//   // CALCULATE TURNAROUND
//   // ======================================================

//   const calculateTurnaround = (
//     createdAt,
//     updatedAt
//   ) => {
//     if (!createdAt) {
//       return "1 Day";
//     }

//     const start = new Date(createdAt);

//     const end = updatedAt
//       ? new Date(updatedAt)
//       : new Date();

//     const diffDays = Math.ceil(
//       Math.abs(end - start) /
//         (1000 * 60 * 60 * 24)
//     );

//     return `${diffDays} Day${
//       diffDays > 1 ? "s" : ""
//     }`;
//   };

//   // ======================================================
//   // METRICS
//   // ======================================================

//   const totalDelivered =
//     filteredRecords.filter((r) =>
//       [
//         "completed",
//         "delivered",
//       ].includes(
//         String(
//           r.status || ""
//         ).toLowerCase()
//       )
//     ).length;

//   const totalHistoricalRevenue =
//     filteredRecords.reduce(
//       (sum, r) =>
//         sum +
//         (Number(r.repairCost) || 0),
//       0
//     );

//   // ======================================================
//   // OPEN SERVICE MODAL
//   // ======================================================

//   const handleOpenServiceModal = (
//     item
//   ) => {
//     setServiceModalItem(item);

//     setAppliedServices(
//       Array.isArray(item.services)
//         ? item.services.map((s) => ({
//             serviceId:
//               s.serviceId ||
//               s._id ||
//               null,

//             serviceName:
//               s.serviceName ||
//               s.name ||
//               "",

//             category:
//               s.category ||
//               "Custom Repair",

//             partCost:
//               Number(
//                 s.partCost || 0
//               ),

//             laborCost:
//               Number(
//                 s.laborCost || 0
//               ),

//             totalCost: Number(
//               s.totalCost ??
//                 (Number(
//                   s.partCost || 0
//                 ) +
//                   Number(
//                     s.laborCost || 0
//                   ))
//             ),

//             isCustom:
//               s.isCustom ??
//               !s.serviceId,
//           }))
//         : []
//     );

//     setSelectedServiceId("");
//     setCustomServiceName("");
//     setCustomPartCost("");
//     setCustomLaborCost("");
//   };

//   // ======================================================
//   // ADD PREDEFINED SERVICE
//   // ======================================================

//   const handleAddPredefinedService =
//     () => {
//       if (!selectedServiceId) {
//         return;
//       }

//       const found =
//         availableServices.find(
//           (s) =>
//             String(s._id) ===
//             String(selectedServiceId)
//         );

//       if (!found) {
//         return;
//       }

//       const part =
//         Number(found.partCost || 0);

//       const labor =
//         Number(found.laborCost || 0);

//       const total = Number(
//         found.totalCost ??
//           part + labor
//       );

//       setAppliedServices((prev) => [
//         ...prev,
//         {
//           serviceId: found._id,

//           serviceName:
//             found.serviceName,

//           category:
//             found.category ||
//             "General Repair",

//           partCost: part,
//           laborCost: labor,
//           totalCost: total,

//           isCustom: false,
//         },
//       ]);

//       setSelectedServiceId("");
//     };

//   // ======================================================
//   // ADD CUSTOM SERVICE
//   // ======================================================

//   const handleAddCustomService =
//     () => {
//       if (
//         !customServiceName.trim()
//       ) {
//         toast.warn(
//           "Please enter a service name"
//         );

//         return;
//       }

//       const part =
//         Number(customPartCost) || 0;

//       const labor =
//         Number(customLaborCost) || 0;

//       const total =
//         part + labor;

//       setAppliedServices((prev) => [
//         ...prev,
//         {
//           serviceId: null,

//           serviceName:
//             customServiceName.trim(),

//           category:
//             "Custom Repair",

//           partCost: part,
//           laborCost: labor,
//           totalCost: total,

//           isCustom: true,
//         },
//       ]);

//       setCustomServiceName("");
//       setCustomPartCost("");
//       setCustomLaborCost("");
//     };

//   // ======================================================
//   // REMOVE SERVICE
//   // ======================================================

//   const handleRemoveService = (
//     index
//   ) => {
//     setAppliedServices((prev) =>
//       prev.filter(
//         (_, i) => i !== index
//       )
//     );
//   };

//   // ======================================================
//   // CALCULATED MODAL TOTAL
//   // ======================================================

//   const calculatedModalTotal =
//     useMemo(() => {
//       return appliedServices.reduce(
//         (sum, s) =>
//           sum +
//           (Number(s.totalCost) || 0),
//         0
//       );
//     }, [appliedServices]);

//   // ======================================================
//   // SAVE SERVICES
//   // ======================================================

//   const handleSaveServices =
//     async () => {
//       if (!serviceModalItem) {
//         return;
//       }

//       try {
//         setSavingServices(true);

//         const repairId =
//           serviceModalItem._id ||
//           serviceModalItem.id;

//         const services =
//           appliedServices.map((s) => ({
//             serviceId:
//               s.serviceId || null,

//             serviceName:
//               s.serviceName || "",

//             category:
//               s.category ||
//               "Custom Repair",

//             partCost:
//               Number(
//                 s.partCost
//               ) || 0,

//             laborCost:
//               Number(
//                 s.laborCost
//               ) || 0,

//             totalCost: Number(
//               s.totalCost ??
//                 ((Number(
//                   s.partCost
//                 ) || 0) +
//                   (Number(
//                     s.laborCost
//                   ) || 0))
//             ),

//             isCustom:
//               s.isCustom ??
//               !s.serviceId,
//           }));

//         const payload = {
//           services,
//           repairCost:
//             calculatedModalTotal,
//         };

//         const res =
//           await axios.put(
//             `${BASE_URL}/${repairId}`,
//             payload,
//             getAuthConfig()
//           );

//         toast.success(
//           "Services and repair cost updated successfully"
//         );

//         const updatedRecord =
//           res.data?.repair ||
//           res.data?.data || {
//             ...serviceModalItem,
//             ...payload,
//           };

//         setRepairs((prev) =>
//           prev.map((r) =>
//             r._id === repairId
//               ? {
//                   ...r,
//                   ...updatedRecord,
//                 }
//               : r
//           )
//         );

//         if (
//           selectedInvoice &&
//           selectedInvoice._id ===
//             repairId
//         ) {
//           setSelectedInvoice({
//             ...selectedInvoice,
//             ...updatedRecord,
//           });
//         }

//         setServiceModalItem(null);
//       } catch (err) {
//         console.error(
//           "Update services error:",
//           err.response?.data ||
//             err
//         );

//         toast.error(
//           err.response?.data?.message ||
//             "Failed to update repair services"
//         );
//       } finally {
//         setSavingServices(false);
//       }
//     };

//   // ======================================================
//   // RENDER
//   // ======================================================

//   return (
//     <div className="trh-container">

//       {/* ==================================================
//           HEADER
//       ================================================== */}

//       <header className="trh-header">

//         <div>
//           <span className="trh-eyebrow">
//             ARCHIVE & AUDIT
//           </span>

//           <h1>
//             Technician Repair History
//           </h1>

//           <p>
//             Historical records, customer
//             delivery receipts, and resolved
//             service tickets.
//           </p>
//         </div>

//         <button
//           type="button"
//           className="trh-sync-btn"
//           onClick={fetchHistory}
//           disabled={loading}
//         >
//           <FiRefreshCw
//             className={
//               loading
//                 ? "trh-spin"
//                 : ""
//             }
//           />

//           <span>
//             Sync Archive
//           </span>
//         </button>

//       </header>

//       {/* ==================================================
//           METRICS
//       ================================================== */}

//       <section className="trh-metrics">

//         <div className="trh-metric-card">

//           <div className="trh-metric-ico icon-blue">
//             <FiCheckCircle />
//           </div>

//           <div>
//             <span className="trh-lbl">
//               Delivered / Completed
//             </span>

//             <strong className="trh-val">
//               {totalDelivered} Jobs
//             </strong>
//           </div>

//         </div>

//         <div className="trh-metric-card">

//           <div className="trh-metric-ico icon-purple">
//             <FaRupeeSign />
//           </div>

//           <div>
//             <span className="trh-lbl">
//               Total Completed Value
//             </span>

//             <strong className="trh-val">
//               {formatINR(
//                 totalHistoricalRevenue
//               )}
//             </strong>
//           </div>

//         </div>

//         <div className="trh-metric-card">

//           <div className="trh-metric-ico icon-amber">
//             <FiClock />
//           </div>

//           <div>
//             <span className="trh-lbl">
//               Avg Resolution Speed
//             </span>

//             <strong className="trh-val">
//               ~1.5 Days
//             </strong>
//           </div>

//         </div>

//       </section>

//       {/* ==================================================
//           HISTORY CARD
//       ================================================== */}

//       <section className="trh-card">

//         <div className="trh-toolbar">

//           <div className="trh-search-wrap">

//             <FiSearch className="trh-search-ico" />

//             <input
//               type="text"
//               placeholder="Search by ticket, customer, phone, model..."
//               value={searchTerm}
//               onChange={(e) =>
//                 setSearchTerm(
//                   e.target.value
//                 )
//               }
//             />

//           </div>

//           <div className="trh-filter-group">

//             <select
//               value={dateFilter}
//               onChange={(e) =>
//                 setDateFilter(
//                   e.target.value
//                 )
//               }
//               className="trh-select"
//             >
//               <option value="ALL">
//                 All Time History
//               </option>

//               <option value="THIS_MONTH">
//                 This Month
//               </option>

//               <option value="30_DAYS">
//                 Last 30 Days
//               </option>
//             </select>

//           </div>

//         </div>

//         {/* ==================================================
//             LOADING
//         ================================================== */}

//         {loading ? (

//           <div className="trh-state-box">

//             <div className="trh-spinner"></div>

//             <p>
//               Loading historical records...
//             </p>

//           </div>

//         ) : filteredRecords.length ===
//           0 ? (

//           <div className="trh-state-box">

//             <div className="trh-empty-ico">
//               <FiInbox />
//             </div>

//             <h3>
//               No Completed History Found
//             </h3>

//             <p>
//               Closed and delivered repair
//               tickets will automatically
//               appear here.
//             </p>

//           </div>

//         ) : (

//           <div className="trh-table-wrap">

//             <table className="trh-table">

//               <thead>

//                 <tr>
//                   <th>Ticket #</th>
//                   <th>Customer Info</th>
//                   <th>Device Model</th>
//                   <th>
//                     Diagnostic & Applied
//                     Services
//                   </th>
//                   <th>Turnaround</th>
//                   <th>Final Cost</th>
//                   <th>Status</th>
//                   <th className="trh-th-right">
//                     Actions
//                   </th>
//                 </tr>

//               </thead>

//               <tbody>

//                 {filteredRecords.map(
//                   (item) => (

//                     <tr key={item._id}>

//                       {/* TICKET */}

//                       <td>

//                         <span className="trh-ticket-code">
//                           {item.repairNumber ||
//                             item._id
//                               ?.slice(-6)
//                               .toUpperCase()}
//                         </span>

//                       </td>

//                       {/* CUSTOMER */}

//                       <td>

//                         <div className="trh-cust-cell">

//                           <strong>
//                             {item.customerName}
//                           </strong>

//                           <span className="trh-sub-txt">
//                             <FiPhone />
//                             {item.customerPhone}
//                           </span>

//                           {item.customerEmail && (
//                             <span className="trh-sub-txt">
//                               <FiMail />
//                               {item.customerEmail}
//                             </span>
//                           )}

//                         </div>

//                       </td>

//                       {/* DEVICE */}

//                       <td>

//                         <strong className="trh-device-txt">
//                           {item.deviceModel ||
//                             item.laptopModel ||
//                             "Device Unspecified"}
//                         </strong>

//                       </td>

//                       {/* SERVICES */}

//                       <td className="trh-issue-cell">

//                         <p className="trh-issue-p">
//                           {item.issueDescription}
//                         </p>

//                         {item.remarks && (
//                           <span className="trh-remark-tag">
//                             Note: {item.remarks}
//                           </span>
//                         )}

//                         {Array.isArray(
//                           item.services
//                         ) &&
//                           item.services.length >
//                             0 && (

//                             <div
//                               style={{
//                                 display:
//                                   "flex",
//                                 flexWrap:
//                                   "wrap",
//                                 gap: "4px",
//                                 marginTop:
//                                   "6px",
//                               }}
//                             >

//                               {item.services.map(
//                                 (
//                                   s,
//                                   idx
//                                 ) => (

//                                   <span
//                                     key={idx}
//                                     style={{
//                                       fontSize:
//                                         "11px",
//                                       background:
//                                         "#eef2ff",
//                                       color:
//                                         "#3730a3",
//                                       padding:
//                                         "2px 6px",
//                                       borderRadius:
//                                         "4px",
//                                       border:
//                                         "1px solid #c7d2fe",
//                                     }}
//                                   >
//                                     {s.serviceName ||
//                                       s.name}{" "}
//                                     (
//                                     {formatINR(
//                                       s.totalCost ??
//                                         Number(
//                                           s.partCost ||
//                                             0
//                                         ) +
//                                           Number(
//                                             s.laborCost ||
//                                               0
//                                           )
//                                     )}
//                                     )
//                                   </span>

//                                 )
//                               )}

//                             </div>

//                           )}

//                       </td>

//                       {/* TURNAROUND */}

//                       <td>

//                         <span className="trh-turnaround-badge">

//                           <FiClock />

//                           {calculateTurnaround(
//                             item.createdAt,
//                             item.updatedAt
//                           )}

//                         </span>

//                       </td>

//                       {/* FINAL COST */}

//                       <td>

//                         <strong className="trh-cost-txt">
//                           {formatINR(
//                             item.repairCost
//                           )}
//                         </strong>

//                       </td>

//                       {/* STATUS */}

//                       <td>

//                         <span
//                           className={`trh-status-pill ${String(
//                             item.status ||
//                               "completed"
//                           )
//                             .toLowerCase()
//                             .replaceAll(
//                               " ",
//                               "-"
//                             )}`}
//                         >
//                           {item.status ||
//                             "Completed"}
//                         </span>

//                       </td>

//                       {/* ACTIONS */}

//                       <td className="trh-td-right">

//                         <div
//                           style={{
//                             display:
//                               "flex",
//                             gap: "6px",
//                             justifyContent:
//                               "flex-end",
//                           }}
//                         >

//                           <button
//                             type="button"
//                             className="trh-btn-edit"
//                             title="Add / Edit Work Services"
//                             onClick={() =>
//                               handleOpenServiceModal(
//                                 item
//                               )
//                             }
//                           >
//                             <FiEdit3 />
//                             Services
//                           </button>

//                           <button
//                             type="button"
//                             className="trh-btn-print"
//                             onClick={() =>
//                               setSelectedInvoice(
//                                 item
//                               )
//                             }
//                           >
//                             <FiPrinter />
//                             Receipt
//                           </button>

//                         </div>

//                       </td>

//                     </tr>

//                   )
//                 )}

//               </tbody>

//             </table>

//           </div>

//         )}

//       </section>

//       {/* ==================================================
//           SERVICE MODAL
//       ================================================== */}

//       {serviceModalItem && (

//         <div
//           className="trh-modal-overlay"
//           onMouseDown={(e) =>
//             e.target ===
//               e.currentTarget &&
//             setServiceModalItem(null)
//           }
//         >

//           <div
//             className="trh-modal-box"
//             style={{
//               maxWidth: "650px",
//             }}
//           >

//             {/* MODAL HEADER */}

//             <div className="trh-modal-header">

//               <div>

//                 <span className="trh-eyebrow">
//                   BILLING & WORK BREAKDOWN
//                 </span>

//                 <h2>
//                   Add Completed Repair Work
//                 </h2>

//                 <small
//                   style={{
//                     color: "#6b7280",
//                   }}
//                 >
//                   Ticket:{" "}
//                   {serviceModalItem.repairNumber ||
//                     serviceModalItem._id}
//                 </small>

//               </div>

//               <button
//                 type="button"
//                 className="trh-btn-close"
//                 onClick={() =>
//                   setServiceModalItem(null)
//                 }
//               >
//                 <FiX />
//               </button>

//             </div>

//             <div
//               style={{
//                 padding: "16px 20px",
//               }}
//             >

//               {/* STANDARD SERVICE */}

//               <div
//                 style={{
//                   marginBottom:
//                     "16px",
//                 }}
//               >

//                 <label
//                   style={{
//                     display: "block",
//                     fontSize: "12px",
//                     fontWeight: "600",
//                     marginBottom:
//                       "6px",
//                   }}
//                 >
//                   Select Standard Service:
//                 </label>

//                 <div
//                   style={{
//                     display:
//                       "flex",
//                     gap: "8px",
//                   }}
//                 >

//                   <select
//                     className="trh-select"
//                     style={{
//                       flex: 1,
//                     }}
//                     value={
//                       selectedServiceId
//                     }
//                     onChange={(e) =>
//                       setSelectedServiceId(
//                         e.target.value
//                       )
//                     }
//                   >

//                     <option value="">
//                       -- Choose Standard Service --
//                     </option>

//                     {availableServices.map(
//                       (srv) => (

//                         <option
//                           key={srv._id}
//                           value={srv._id}
//                         >
//                           {srv.serviceName} (
//                           {srv.category}) —
//                           Part:{" "}
//                           {formatINR(
//                             srv.partCost
//                           )}{" "}
//                           + Labor:{" "}
//                           {formatINR(
//                             srv.laborCost
//                           )}{" "}
//                           ={" "}
//                           {formatINR(
//                             srv.totalCost ??
//                               Number(
//                                 srv.partCost ||
//                                   0
//                               ) +
//                                 Number(
//                                   srv.laborCost ||
//                                     0
//                                 )
//                           )}
//                         </option>

//                       )
//                     )}

//                   </select>

//                   <button
//                     type="button"
//                     className="btn-modal-pri"
//                     onClick={
//                       handleAddPredefinedService
//                     }
//                     disabled={
//                       !selectedServiceId
//                     }
//                   >
//                     <FiPlus />
//                     Add
//                   </button>

//                 </div>

//               </div>

//               {/* CUSTOM SERVICE */}

//               <div
//                 style={{
//                   marginBottom:
//                     "20px",
//                 }}
//               >

//                 <label
//                   style={{
//                     display: "block",
//                     fontSize: "12px",
//                     fontWeight: "600",
//                     marginBottom:
//                       "6px",
//                   }}
//                 >
//                   Or Add Custom Service / Component:
//                 </label>

//                 <div
//                   style={{
//                     display:
//                       "flex",
//                     gap: "8px",
//                   }}
//                 >

//                   <input
//                     type="text"
//                     placeholder="e.g. BIOS Chip Programming"
//                     value={
//                       customServiceName
//                     }
//                     onChange={(e) =>
//                       setCustomServiceName(
//                         e.target.value
//                       )
//                     }
//                     style={{
//                       flex: 2,
//                       padding:
//                         "8px 10px",
//                       border:
//                         "1px solid #e5e7eb",
//                       borderRadius:
//                         "6px",
//                     }}
//                   />

//                   <input
//                     type="number"
//                     placeholder="Part (₹)"
//                     value={
//                       customPartCost
//                     }
//                     onChange={(e) =>
//                       setCustomPartCost(
//                         e.target.value
//                       )
//                     }
//                     style={{
//                       width: "90px",
//                       padding:
//                         "8px 10px",
//                       border:
//                         "1px solid #e5e7eb",
//                       borderRadius:
//                         "6px",
//                     }}
//                   />

//                   <input
//                     type="number"
//                     placeholder="Labor (₹)"
//                     value={
//                       customLaborCost
//                     }
//                     onChange={(e) =>
//                       setCustomLaborCost(
//                         e.target.value
//                       )
//                     }
//                     style={{
//                       width: "90px",
//                       padding:
//                         "8px 10px",
//                       border:
//                         "1px solid #e5e7eb",
//                       borderRadius:
//                         "6px",
//                     }}
//                   />

//                   <button
//                     type="button"
//                     className="btn-modal-sec"
//                     onClick={
//                       handleAddCustomService
//                     }
//                   >
//                     <FiPlus />
//                     Add
//                   </button>

//                 </div>

//               </div>

//               {/* APPLIED SERVICES */}

//               <div
//                 style={{
//                   borderTop:
//                     "1px solid #e5e7eb",
//                   paddingTop:
//                     "12px",
//                 }}
//               >

//                 <h4
//                   style={{
//                     fontSize: "13px",
//                     fontWeight: "600",
//                     marginBottom:
//                       "8px",
//                   }}
//                 >
//                   Applied Services Breakdown (
//                   {appliedServices.length})
//                 </h4>

//                 {appliedServices.length ===
//                 0 ? (

//                   <p
//                     style={{
//                       fontSize: "12px",
//                       color:
//                         "#9ca3af",
//                     }}
//                   >
//                     No services attached.
//                     Add services above to
//                     calculate the final
//                     repair cost.
//                   </p>

//                 ) : (

//                   <div
//                     style={{
//                       maxHeight:
//                         "180px",
//                       overflowY:
//                         "auto",
//                     }}
//                   >

//                     {appliedServices.map(
//                       (
//                         srv,
//                         idx
//                       ) => (

//                         <div
//                           key={idx}
//                           style={{
//                             display:
//                               "flex",
//                             justifyContent:
//                               "space-between",
//                             alignItems:
//                               "center",
//                             padding:
//                               "8px 0",
//                             borderBottom:
//                               "1px dashed #f3f4f6",
//                           }}
//                         >

//                           <div>

//                             <strong
//                               style={{
//                                 fontSize:
//                                   "13px",
//                                 color:
//                                   "#1f2937",
//                               }}
//                             >
//                               {srv.serviceName ||
//                                 srv.name}
//                             </strong>

//                             <div
//                               style={{
//                                 fontSize:
//                                   "11px",
//                                 color:
//                                   "#6b7280",
//                               }}
//                             >
//                               {srv.category} |
//                               Part:{" "}
//                               {formatINR(
//                                 srv.partCost
//                               )}{" "}
//                               | Labor:{" "}
//                               {formatINR(
//                                 srv.laborCost
//                               )}
//                             </div>

//                           </div>

//                           <div
//                             style={{
//                               display:
//                                 "flex",
//                               alignItems:
//                                 "center",
//                               gap: "12px",
//                             }}
//                           >

//                             <strong
//                               style={{
//                                 fontSize:
//                                   "13px",
//                                 color:
//                                   "#059669",
//                               }}
//                             >
//                               {formatINR(
//                                 srv.totalCost ??
//                                   Number(
//                                     srv.partCost ||
//                                       0
//                                   ) +
//                                     Number(
//                                       srv.laborCost ||
//                                         0
//                                     )
//                               )}
//                             </strong>

//                             <button
//                               type="button"
//                               onClick={() =>
//                                 handleRemoveService(
//                                   idx
//                                 )
//                               }
//                               style={{
//                                 background:
//                                   "none",
//                                 border:
//                                   "none",
//                                 color:
//                                   "#ef4444",
//                                 cursor:
//                                   "pointer",
//                               }}
//                             >
//                               <FiTrash2 />
//                             </button>

//                           </div>

//                         </div>

//                       )
//                     )}

//                   </div>

//                 )}

//                 {/* GRAND TOTAL */}

//                 <div
//                   style={{
//                     display:
//                       "flex",
//                     justifyContent:
//                       "space-between",
//                     paddingTop:
//                       "12px",
//                     marginTop:
//                       "8px",
//                     borderTop:
//                       "2px solid #e5e7eb",
//                     fontWeight:
//                       "bold",
//                     fontSize:
//                       "15px",
//                   }}
//                 >

//                   <span>
//                     Grand Total Cost:
//                   </span>

//                   <span
//                     style={{
//                       color:
//                         "#059669",
//                     }}
//                   >
//                     {formatINR(
//                       calculatedModalTotal
//                     )}
//                   </span>

//                 </div>

//               </div>

//             </div>

//             {/* MODAL ACTIONS */}

//             <div className="trh-modal-actions">

//               <button
//                 type="button"
//                 className="btn-modal-sec"
//                 onClick={() =>
//                   setServiceModalItem(
//                     null
//                   )
//                 }
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 className="btn-modal-pri"
//                 onClick={
//                   handleSaveServices
//                 }
//                 disabled={
//                   savingServices
//                 }
//               >
//                 {savingServices
//                   ? "Updating..."
//                   : "Save & Update Bill"}
//               </button>

//             </div>

//           </div>

//         </div>

//       )}

//       {/* ==================================================
//           RECEIPT MODAL
//       ================================================== */}

//       {selectedInvoice && (

//         <div
//           className="trh-modal-overlay"
//           onMouseDown={(e) =>
//             e.target ===
//               e.currentTarget &&
//             setSelectedInvoice(null)
//           }
//         >

//           <div className="trh-modal-box">

//             {/* RECEIPT MODAL HEADER */}

//             <div className="trh-modal-header no-print">

//               <div>

//                 <span className="trh-eyebrow">
//                   RECEIPT PREVIEW
//                 </span>

//                 <h2>
//                   Service Delivery Voucher
//                 </h2>

//               </div>

//               <button
//                 type="button"
//                 className="trh-btn-close"
//                 onClick={() =>
//                   setSelectedInvoice(
//                     null
//                   )
//                 }
//               >
//                 <FiX />
//               </button>

//             </div>

//             {/* PRINTABLE RECEIPT */}

//             <div
//               className="trh-invoice-sheet"
//               id="printable-receipt"
//             >

//               {/* INVOICE HEADER */}

//               <div className="invoice-head">

//                 <div>

//                   <h1 className="brand-name">
//                     ZAID INFOTECH
//                   </h1>

//                   <p className="brand-sub">
//                     Premium Hardware Repairs
//                     & IT Services
//                   </p>

//                 </div>

//                 <div className="invoice-meta">

//                   <h3>
//                     SERVICE RECEIPT
//                   </h3>

//                   <span>
//                     Ticket:{" "}
//                     {selectedInvoice.repairNumber ||
//                       selectedInvoice._id
//                         ?.slice(-6)
//                         .toUpperCase()}
//                   </span>

//                   <span>
//                     Date:{" "}
//                     {new Date(
//                       selectedInvoice.updatedAt ||
//                         Date.now()
//                     ).toLocaleDateString(
//                       "en-IN"
//                     )}
//                   </span>

//                 </div>

//               </div>

//               <hr className="divider" />

//               {/* CUSTOMER + DEVICE */}

//               <div className="invoice-grid">

//                 <div>

//                   <span className="meta-head">
//                     CUSTOMER DETAILS
//                   </span>

//                   <strong>
//                     {selectedInvoice.customerName}
//                   </strong>

//                   <div>
//                     Phone:{" "}
//                     {selectedInvoice.customerPhone}
//                   </div>

//                   {selectedInvoice.customerEmail && (
//                     <div>
//                       Email:{" "}
//                       {
//                         selectedInvoice.customerEmail
//                       }
//                     </div>
//                   )}

//                 </div>

//                 <div>

//                   <span className="meta-head">
//                     HARDWARE REPAIRED
//                   </span>

//                   <strong>
//                     {selectedInvoice.deviceModel ||
//                       selectedInvoice.laptopModel}
//                   </strong>

//                   <div>
//                     Technician:{" "}
//                     {selectedInvoice.technicianName ||
//                       "Assigned Technician"}
//                   </div>

//                   <div>
//                     Status:{" "}
//                     {selectedInvoice.status ||
//                       "Delivered"}
//                   </div>

//                 </div>

//               </div>

//               {/* INVOICE TABLE */}

//               <div className="invoice-table-section">

//                 <table className="invoice-table">

//                   <thead>

//                     <tr>

//                       <th>
//                         Service / Problem Description
//                       </th>

//                       <th className="text-right">
//                         Part (₹)
//                       </th>

//                       <th className="text-right">
//                         Labor (₹)
//                       </th>

//                       <th className="text-right">
//                         Total (₹)
//                       </th>

//                     </tr>

//                   </thead>

//                   <tbody>

//                     {Array.isArray(
//                       selectedInvoice.services
//                     ) &&
//                     selectedInvoice.services
//                       .length > 0 ? (

//                       selectedInvoice.services.map(
//                         (
//                           srv,
//                           idx
//                         ) => (

//                           <tr key={idx}>

//                             <td>

//                               <strong>
//                                 {srv.serviceName ||
//                                   srv.name}
//                               </strong>

//                               {idx === 0 &&
//                                 selectedInvoice.issueDescription && (
//                                   <p
//                                     style={{
//                                       margin:
//                                         "2px 0 0",
//                                       fontSize:
//                                         "11px",
//                                       color:
//                                         "#6b7280",
//                                     }}
//                                   >
//                                     Issue:{" "}
//                                     {
//                                       selectedInvoice.issueDescription
//                                     }
//                                   </p>
//                                 )}

//                               {srv.category && (
//                                 <small
//                                   style={{
//                                     display:
//                                       "block",
//                                     fontSize:
//                                       "10px",
//                                     color:
//                                       "#6b7280",
//                                   }}
//                                 >
//                                   {
//                                     srv.category
//                                   }
//                                 </small>
//                               )}

//                             </td>

//                             <td className="text-right">
//                               {formatINR(
//                                 srv.partCost
//                               )}
//                             </td>

//                             <td className="text-right">
//                               {formatINR(
//                                 srv.laborCost
//                               )}
//                             </td>

//                             <td className="text-right">
//                               {formatINR(
//                                 srv.totalCost ??
//                                   Number(
//                                     srv.partCost ||
//                                       0
//                                   ) +
//                                     Number(
//                                       srv.laborCost ||
//                                         0
//                                     )
//                               )}
//                             </td>

//                           </tr>

//                         )
//                       )

//                     ) : (

//                       <tr>

//                         <td>

//                           <strong>
//                             Repair Diagnostic &
//                             Labor
//                           </strong>

//                           <p>
//                             {
//                               selectedInvoice.issueDescription
//                             }
//                           </p>

//                         </td>

//                         <td className="text-right">
//                           —
//                         </td>

//                         <td className="text-right">
//                           —
//                         </td>

//                         <td className="text-right">
//                           {formatINR(
//                             selectedInvoice.repairCost
//                           )}
//                         </td>

//                       </tr>

//                     )}

//                     {/* REMARKS */}

//                     {selectedInvoice.remarks && (

//                       <tr>

//                         <td colSpan={3}>

//                           <em>
//                             Intake Remarks:{" "}
//                             {
//                               selectedInvoice.remarks
//                             }
//                           </em>

//                         </td>

//                         <td className="text-right">
//                           —
//                         </td>

//                       </tr>

//                     )}

//                   </tbody>

//                   {/* TOTAL */}

//                   <tfoot>

//                     <tr>

//                       <th colSpan={3}>
//                         Total Amount Due / Paid:
//                       </th>

//                       <th className="text-right total-cell">
//                         {formatINR(
//                           selectedInvoice.repairCost
//                         )}
//                       </th>

//                     </tr>

//                   </tfoot>

//                 </table>

//               </div>

//               {/* FOOTER */}

//               <div className="invoice-footer-notes">

//                 <p>
//                   Thank you for choosing Zaid
//                   Infotech. 30 Days service
//                   warranty applies on replaced
//                   components.
//                 </p>

//               </div>

//             </div>

//             {/* RECEIPT ACTIONS */}

//             <div className="trh-modal-actions no-print">

//               <button
//                 type="button"
//                 className="btn-modal-sec"
//                 onClick={() =>
//                   setSelectedInvoice(
//                     null
//                   )
//                 }
//               >
//                 Close
//               </button>

//               <button
//                 type="button"
//                 className="btn-modal-pri"
//                 onClick={() =>
//                   window.print()
//                 }
//               >
//                 <FiPrinter />
//                 Print Voucher
//               </button>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>
//   );
// }



import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiPrinter,
  FiClock,
  FiRefreshCw,
  FiInbox,
  FiX,
  FiPlus,
  FiTrash2,
  FiEdit3,
  FiCalendar,
  FiAlertCircle,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { toast } from "react-toastify";
import "./TechnicianRepairHistory.css";

// ======================================================
// API CONFIGURATION
// .env: VITE_API_URL=http://localhost:5000/api
// Production: VITE_API_URL=https://your-domain.com/api
// ======================================================

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const BASE_URL = `${API_URL}/newRepair`;
const SERVICES_API = `${API_URL}/repair-service/get-services`;

const STATUS_HISTORY = [
  "completed",
  "delivered",
  "ready for delivery",
  "cancelled",
];

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

const getResponseArray = (response, keys = []) => {
  const data = response?.data;

  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
};

const getPersonName = (user = {}) =>
  String(
    user.name ||
      user.fullName ||
      `${user.firstName || ""} ${user.lastName || ""}`
  )
    .trim()
    .toLowerCase();

const getAssignedId = (assigned) => {
  if (assigned && typeof assigned === "object") {
    return String(assigned._id || assigned.id || "");
  }

  return String(assigned || "");
};

const getServiceTotal = (service) => {
  const part = Number(service?.partCost) || 0;
  const labor = Number(service?.laborCost) || 0;

  return Number.isFinite(Number(service?.totalCost))
    ? Number(service.totalCost)
    : part + labor;
};

const getRepairDate = (item) =>
  item?.jobDate || item?.createdAt || item?.updatedAt || null;

const formatDate = (date) => {
  if (!date) return "Not Set";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Not Set";

  return parsed.toLocaleDateString("en-IN");
};

const normalizeService = (service = {}) => {
  const serviceId =
    typeof service.serviceId === "object"
      ? service.serviceId?._id || service.serviceId?.id || null
      : service.serviceId || service._id || null;

  const partCost = Number(service.partCost) || 0;
  const laborCost = Number(service.laborCost) || 0;

  return {
    serviceId,
    serviceName: String(
      service.serviceName || service.name || ""
    ),
    category: String(service.category || "Custom Repair"),
    partCost,
    laborCost,
    totalCost: getServiceTotal(service),
    isCustom: service.isCustom ?? !serviceId,
  };
};

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

  // ======================================================
  // LOGIN USER + TOKEN
  // ======================================================

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    "";

  const loggedInUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}") || {};
    } catch {
      return {};
    }
  }, []);

  const techId = String(
    loggedInUser._id || loggedInUser.id || ""
  );

  const techName = getPersonName(loggedInUser);

  const getAuthConfig = useCallback(() => {
    const currentToken =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      "";

    return {
      headers: {
        ...(currentToken
          ? { Authorization: `Bearer ${currentToken}` }
          : {}),
      },
    };
  }, []);

  // ======================================================
  // FETCH REPAIR HISTORY
  // ======================================================

  const fetchHistory = useCallback(async () => {
    if (!API_URL) {
      toast.error("VITE_API_URL is missing in your frontend .env file.");
      setRepairs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      let response;

      // First try the technician-specific endpoint.
      try {
        response = await axios.get(
          `${BASE_URL}/my-assigned-repairs`,
          getAuthConfig()
        );
      } catch (firstError) {
        // Fall back to the existing repair list route.
        // This fallback only helps if the list endpoint is supported
        // and the logged-in user has permission to access it.
        if (
          firstError?.response?.status !== 404 &&
          firstError?.response?.status !== 405
        ) {
          throw firstError;
        }

        response = await axios.get(
          `${BASE_URL}/`,
          getAuthConfig()
        );
      }

      const records = getResponseArray(response, [
        "repairs",
        "data",
        "results",
      ]);

      setRepairs(records);
    } catch (error) {
      console.error(
        "Fetch repair history error:",
        error?.response?.data || error
      );

      setRepairs([]);
      toast.error(
        getErrorMessage(error, "Failed to load repair history")
      );
    } finally {
      setLoading(false);
    }
  }, [getAuthConfig]);

  // ======================================================
  // FETCH AVAILABLE STANDARD SERVICES
  // ======================================================

  const fetchAvailableServices = useCallback(async () => {
    if (!API_URL) return;

    try {
      const response = await axios.get(
        SERVICES_API,
        getAuthConfig()
      );

      const records = getResponseArray(response, [
        "services",
        "data",
        "results",
      ]);

      setAvailableServices(records);
    } catch (error) {
      console.error(
        "Fetch services error:",
        error?.response?.data || error
      );

      setAvailableServices([]);
      toast.error(
        getErrorMessage(error, "Could not load standard services")
      );
    }
  }, [getAuthConfig]);

  useEffect(() => {
    fetchHistory();
    fetchAvailableServices();
  }, [fetchHistory, fetchAvailableServices]);

  // ======================================================
  // FILTER CURRENT TECHNICIAN'S COMPLETED HISTORY
  // ======================================================

  const historyRecords = useMemo(() => {
    return repairs.filter((repair) => {
      const assignedId = getAssignedId(
        repair.assignedTechnician
      );

      const recordTechName = String(
        repair.technicianName || ""
      )
        .trim()
        .toLowerCase();

      const matchesId =
        Boolean(techId) &&
        Boolean(assignedId) &&
        assignedId === techId;

      const matchesName =
        Boolean(techName) &&
        Boolean(recordTechName) &&
        (
          recordTechName === techName ||
          recordTechName.includes(techName) ||
          techName.includes(recordTechName)
        );

      const matchesTechnician = matchesId || matchesName;

      const status = String(repair.status || "")
        .trim()
        .toLowerCase();

      const isClosed =
        STATUS_HISTORY.includes(status) ||
        repair.isDelivered === true;

      return matchesTechnician && isClosed;
    });
  }, [repairs, techId, techName]);

  // ======================================================
  // SEARCH + DATE FILTER
  // ======================================================

  const filteredRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const now = new Date();

    return historyRecords.filter((item) => {
      const model = String(
        item.deviceModel || item.laptopModel || ""
      ).toLowerCase();

      const deviceType = String(item.deviceType || "").toLowerCase();

      const ticket = String(item.repairNumber || "").toLowerCase();

      const customerName = String(
        item.customerName || ""
      ).toLowerCase();

      const customerPhone = String(
        item.customerPhone || ""
      ).toLowerCase();

      const issue = String(
        item.issueDescription || ""
      ).toLowerCase();

      const matchesSearch =
        !query ||
        customerName.includes(query) ||
        customerPhone.includes(query) ||
        ticket.includes(query) ||
        model.includes(query) ||
        deviceType.includes(query) ||
        issue.includes(query);

      const recordDateValue =
        item.jobDate || item.updatedAt || item.createdAt;

      const recordDate = recordDateValue
        ? new Date(recordDateValue)
        : null;

      let matchesDate = true;

      if (dateFilter !== "ALL") {
        if (!recordDate || Number.isNaN(recordDate.getTime())) {
          matchesDate = false;
        } else if (dateFilter === "30_DAYS") {
          const past30Days = new Date(
            now.getTime() - 30 * 24 * 60 * 60 * 1000
          );

          matchesDate =
            recordDate >= past30Days &&
            recordDate <= now;
        } else if (dateFilter === "THIS_MONTH") {
          matchesDate =
            recordDate.getMonth() === now.getMonth() &&
            recordDate.getFullYear() === now.getFullYear();
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [historyRecords, searchTerm, dateFilter]);

  // ======================================================
  // TURNAROUND
  // ======================================================

  const calculateTurnaround = (createdAt, updatedAt) => {
    if (!createdAt) return "N/A";

    const start = new Date(createdAt);
    const end = updatedAt ? new Date(updatedAt) : new Date();

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return "N/A";
    }

    const diffDays = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / 86400000)
    );

    return `${diffDays} Day${diffDays === 1 ? "" : "s"}`;
  };

  // ======================================================
  // SUMMARY METRICS
  // ======================================================

  const totalDelivered = filteredRecords.filter((repair) =>
    ["completed", "delivered"].includes(
      String(repair.status || "").toLowerCase()
    )
  ).length;

  const totalHistoricalRevenue = filteredRecords.reduce(
    (sum, repair) => sum + (Number(repair.repairCost) || 0),
    0
  );

  const averageResolutionDays = useMemo(() => {
    const durations = filteredRecords
      .map((repair) => {
        if (!repair.createdAt || !repair.updatedAt) return null;

        const start = new Date(repair.createdAt).getTime();
        const end = new Date(repair.updatedAt).getTime();

        if (!Number.isFinite(start) || !Number.isFinite(end)) {
          return null;
        }

        return Math.max(1, Math.ceil((end - start) / 86400000));
      })
      .filter((days) => days !== null);

    if (!durations.length) return "N/A";

    const average =
      durations.reduce((sum, days) => sum + days, 0) /
      durations.length;

    return `${average.toFixed(1)} Days`;
  }, [filteredRecords]);

  // ======================================================
  // OPEN SERVICE MODAL
  // ======================================================

  const handleOpenServiceModal = (item) => {
    setServiceModalItem(item);

    setAppliedServices(
      Array.isArray(item.services)
        ? item.services.map(normalizeService)
        : []
    );

    setSelectedServiceId("");
    setCustomServiceName("");
    setCustomPartCost("");
    setCustomLaborCost("");
  };

  // ======================================================
  // ADD PREDEFINED SERVICE
  // ======================================================

  const handleAddPredefinedService = () => {
    if (!selectedServiceId) {
      toast.warn("Please select a standard service.");
      return;
    }

    const found = availableServices.find(
      (service) => String(service._id) === String(selectedServiceId)
    );

    if (!found) {
      toast.error("Selected service was not found.");
      return;
    }

    const exists = appliedServices.some(
      (service) =>
        !service.isCustom &&
        String(service.serviceId) === String(found._id)
    );

    if (exists) {
      toast.warn("This service is already added.");
      return;
    }

    const partCost = Number(found.partCost) || 0;
    const laborCost = Number(found.laborCost) || 0;

    setAppliedServices((previous) => [
      ...previous,
      {
        serviceId: found._id,
        serviceName: found.serviceName || found.name || "",
        category: found.category || "General Repair",
        partCost,
        laborCost,
        totalCost: getServiceTotal({
          ...found,
          partCost,
          laborCost,
        }),
        isCustom: false,
      },
    ]);

    setSelectedServiceId("");
  };

  // ======================================================
  // ADD CUSTOM SERVICE
  // ======================================================

  const handleAddCustomService = () => {
    if (!customServiceName.trim()) {
      toast.warn("Please enter a service name.");
      return;
    }

    const partCost = Number(customPartCost) || 0;
    const laborCost = Number(customLaborCost) || 0;

    if (partCost < 0 || laborCost < 0) {
      toast.warn("Part and labour costs cannot be negative.");
      return;
    }

    setAppliedServices((previous) => [
      ...previous,
      {
        serviceId: null,
        serviceName: customServiceName.trim(),
        category: "Custom Repair",
        partCost,
        laborCost,
        totalCost: partCost + laborCost,
        isCustom: true,
      },
    ]);

    setCustomServiceName("");
    setCustomPartCost("");
    setCustomLaborCost("");
  };

  // ======================================================
  // REMOVE SERVICE
  // ======================================================

  const handleRemoveService = (index) => {
    setAppliedServices((previous) =>
      previous.filter((_, currentIndex) => currentIndex !== index)
    );
  };

  // ======================================================
  // CALCULATE SERVICES TOTAL
  // ======================================================

  const calculatedModalTotal = useMemo(
    () =>
      appliedServices.reduce(
        (sum, service) => sum + getServiceTotal(service),
        0
      ),
    [appliedServices]
  );

  // ======================================================
  // SAVE SERVICES AND UPDATE REPAIR COST
  // ======================================================

  const handleSaveServices = async () => {
    if (!serviceModalItem) return;

    const repairId =
      serviceModalItem._id || serviceModalItem.id;

    if (!repairId) {
      toast.error("Repair ticket ID is missing.");
      return;
    }

    try {
      setSavingServices(true);

      const services = appliedServices.map((service) => ({
        serviceId: service.serviceId || null,
        serviceName: service.serviceName.trim(),
        category: service.category || "Custom Repair",
        partCost: Number(service.partCost) || 0,
        laborCost: Number(service.laborCost) || 0,
        totalCost: getServiceTotal(service),
        isCustom: Boolean(service.isCustom),
      }));

      const payload = {
        services,
        repairCost: calculatedModalTotal,
      };

      // Keep the existing backend route.
      const response = await axios.put(
        `${BASE_URL}/${repairId}`,
        payload,
        getAuthConfig()
      );

      const responseRepair =
        response.data?.repair ||
        response.data?.data?.repair ||
        response.data?.data;

      const updatedRecord = {
        ...serviceModalItem,
        ...(responseRepair &&
        typeof responseRepair === "object"
          ? responseRepair
          : {}),
        ...payload,
      };

      setRepairs((previous) =>
        previous.map((repair) =>
          String(repair._id || repair.id) === String(repairId)
            ? { ...repair, ...updatedRecord }
            : repair
        )
      );

      setSelectedInvoice((previous) =>
        previous &&
        String(previous._id || previous.id) === String(repairId)
          ? { ...previous, ...updatedRecord }
          : previous
      );

      toast.success("Services and repair cost updated successfully.");
      setServiceModalItem(null);
    } catch (error) {
      console.error(
        "Save services error:",
        error?.response?.data || error
      );

      toast.error(
        getErrorMessage(
          error,
          "Failed to update repair services. Check the backend PUT route."
        )
      );
    } finally {
      setSavingServices(false);
    }
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="trh-container">
      <header className="trh-header">
        <div>
          <span className="trh-eyebrow">ARCHIVE &amp; AUDIT</span>
          <h1>Technician Repair History</h1>
          <p>
            Historical records, customer delivery receipts, and resolved
            service tickets.
          </p>
          <p>
            Logged in as: <strong>{loggedInUser.name ||
              `${loggedInUser.firstName || ""} ${loggedInUser.lastName || ""}`.trim() ||
              "Technician"}</strong>
          </p>
        </div>

        <button
          type="button"
          className="trh-sync-btn"
          onClick={() => {
            fetchHistory();
            fetchAvailableServices();
          }}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? "trh-spin" : ""} />
          <span>{loading ? "Syncing..." : "Sync Archive"}</span>
        </button>
      </header>

      <section className="trh-metrics">
        <div className="trh-metric-card">
          <div className="trh-metric-ico icon-blue">
            <FiCheckCircle />
          </div>
          <div>
            <span className="trh-lbl">Delivered / Completed</span>
            <strong className="trh-val">{totalDelivered} Jobs</strong>
          </div>
        </div>

        <div className="trh-metric-card">
          <div className="trh-metric-ico icon-purple">
            <FaRupeeSign />
          </div>
          <div>
            <span className="trh-lbl">Total Completed Value</span>
            <strong className="trh-val">
              {formatINR(totalHistoricalRevenue)}
            </strong>
          </div>
        </div>

        <div className="trh-metric-card">
          <div className="trh-metric-ico icon-amber">
            <FiClock />
          </div>
          <div>
            <span className="trh-lbl">Avg Resolution Speed</span>
            <strong className="trh-val">{averageResolutionDays}</strong>
          </div>
        </div>
      </section>

      <section className="trh-card">
        <div className="trh-toolbar">
          <div className="trh-search-wrap">
            <FiSearch className="trh-search-ico" />
            <input
              type="text"
              placeholder="Search ticket, customer, phone, device, issue..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="trh-filter-group">
            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
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
            <div className="trh-spinner" />
            <p>Loading historical records...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="trh-state-box">
            <div className="trh-empty-ico">
              <FiInbox />
            </div>
            <h3>No Completed History Found</h3>
            <p>
              Closed and delivered repair tickets assigned to your technician
              profile will appear here.
            </p>
          </div>
        ) : (
          <div className="trh-table-wrap">
            <table className="trh-table">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Customer Info</th>
                  <th>Device / Job Date</th>
                  <th>Diagnostic &amp; Applied Services</th>
                  <th>Turnaround</th>
                  <th>Final Cost</th>
                  <th>Status</th>
                  <th className="trh-th-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((item) => (
                  <tr key={item._id || item.id}>
                    <td>
                      <span className="trh-ticket-code">
                        {item.repairNumber ||
                          String(item._id || item.id || "")
                            .slice(-6)
                            .toUpperCase()}
                      </span>
                    </td>

                    <td>
                      <div className="trh-cust-cell">
                        <strong>{item.customerName || "Walk-in Customer"}</strong>
                        <span className="trh-sub-txt">
                          <FiPhone /> {item.customerPhone || "N/A"}
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
                        {item.deviceType || "Device"}
                        {" — "}
                        {item.deviceModel ||
                          item.laptopModel ||
                          "Model unspecified"}
                      </strong>
                      <span className="trh-sub-txt">
                        <FiCalendar /> Job: {formatDate(getRepairDate(item))}
                      </span>
                    </td>

                    <td className="trh-issue-cell">
                      <p className="trh-issue-p">
                        <FiAlertCircle /> {item.issueDescription || "No issue description"}
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
                              marginTop: "6px",
                            }}
                          >
                            {item.services.map((service, index) => (
                              <span
                                key={`${service.serviceId || service.serviceName || "service"}-${index}`}
                                style={{
                                  fontSize: "11px",
                                  background: "#eef2ff",
                                  color: "#3730a3",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  border: "1px solid #c7d2fe",
                                }}
                              >
                                {service.serviceName || service.name || "Service"}{" "}
                                ({formatINR(getServiceTotal(service))})
                              </span>
                            ))}
                          </div>
                        )}
                    </td>

                    <td>
                      <span className="trh-turnaround-badge">
                        <FiClock />
                        {calculateTurnaround(item.createdAt, item.updatedAt)}
                      </span>
                    </td>

                    <td>
                      <strong className="trh-cost-txt">
                        {formatINR(item.repairCost)}
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
                          justifyContent: "flex-end",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          className="trh-btn-edit"
                          title="Add / Edit Work Services"
                          onClick={() => handleOpenServiceModal(item)}
                        >
                          <FiEdit3 /> Services
                        </button>

                        <button
                          type="button"
                          className="trh-btn-print"
                          onClick={() => setSelectedInvoice(item)}
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

      {/* ======================================================
          SERVICES MODAL
      ====================================================== */}

      {serviceModalItem && (
        <div
          className="trh-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !savingServices) {
              setServiceModalItem(null);
            }
          }}
        >
          <div className="trh-modal-box" style={{ maxWidth: "700px" }}>
            <div className="trh-modal-header">
              <div>
                <span className="trh-eyebrow">BILLING &amp; WORK BREAKDOWN</span>
                <h2>Add Completed Repair Work</h2>
                <small style={{ color: "#6b7280" }}>
                  Ticket: {serviceModalItem.repairNumber || serviceModalItem._id}
                </small>
              </div>

              <button
                type="button"
                className="trh-btn-close"
                onClick={() => !savingServices && setServiceModalItem(null)}
                disabled={savingServices}
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
                    fontWeight: 600,
                    marginBottom: "6px",
                  }}
                >
                  Select Standard Service
                </label>

                <div style={{ display: "flex", gap: "8px" }}>
                  <select
                    className="trh-select"
                    style={{ flex: 1, minWidth: 0 }}
                    value={selectedServiceId}
                    onChange={(event) => setSelectedServiceId(event.target.value)}
                  >
                    <option value="">-- Choose Standard Service --</option>
                    {availableServices.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.serviceName || service.name}
                        {service.category ? ` (${service.category})` : ""}
                        {" — Part: "}
                        {formatINR(service.partCost)}
                        {" + Labour: "}
                        {formatINR(service.laborCost)}
                        {" = "}
                        {formatINR(getServiceTotal(service))}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="btn-modal-pri"
                    onClick={handleAddPredefinedService}
                    disabled={!selectedServiceId}
                  >
                    <FiPlus /> Add
                  </button>
                </div>

                {availableServices.length === 0 && (
                  <small style={{ color: "#b45309" }}>
                    No standard services loaded. You can still add a custom service.
                  </small>
                )}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "6px",
                  }}
                >
                  Or Add Custom Service / Component
                </label>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Service / component name"
                    value={customServiceName}
                    onChange={(event) => setCustomServiceName(event.target.value)}
                    style={{
                      flex: "2 1 180px",
                      minWidth: 0,
                      padding: "8px 10px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                    }}
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Part (₹)"
                    value={customPartCost}
                    onChange={(event) => setCustomPartCost(event.target.value)}
                    style={{
                      flex: "1 1 90px",
                      width: "90px",
                      minWidth: 0,
                      padding: "8px 10px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                    }}
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Labour (₹)"
                    value={customLaborCost}
                    onChange={(event) => setCustomLaborCost(event.target.value)}
                    style={{
                      flex: "1 1 90px",
                      width: "90px",
                      minWidth: 0,
                      padding: "8px 10px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
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

              <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
                <h4 style={{ fontSize: "13px", marginBottom: "8px" }}>
                  Applied Services Breakdown ({appliedServices.length})
                </h4>

                {appliedServices.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                    No services attached. Add services above to calculate the
                    repair cost. Saving an empty list sets the repair cost to ₹0.
                  </p>
                ) : (
                  <div style={{ maxHeight: "180px", overflowY: "auto" }}>
                    {appliedServices.map((service, index) => (
                      <div
                        key={`${service.serviceId || service.serviceName}-${index}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "12px",
                          padding: "8px 0",
                          borderBottom: "1px dashed #f3f4f6",
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <strong style={{ fontSize: "13px", color: "#1f2937" }}>
                            {service.serviceName || service.name}
                          </strong>
                          <div style={{ fontSize: "11px", color: "#6b7280" }}>
                            {service.category} | Part: {formatINR(service.partCost)}
                            {" | Labour: "}
                            {formatINR(service.laborCost)}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            flexShrink: 0,
                          }}
                        >
                          <strong style={{ fontSize: "13px", color: "#059669" }}>
                            {formatINR(getServiceTotal(service))}
                          </strong>

                          <button
                            type="button"
                            title="Remove service"
                            onClick={() => handleRemoveService(index)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
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
                    gap: "12px",
                    paddingTop: "12px",
                    marginTop: "8px",
                    borderTop: "2px solid #e5e7eb",
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  <span>Grand Total Cost:</span>
                  <span style={{ color: "#059669" }}>
                    {formatINR(calculatedModalTotal)}
                  </span>
                </div>
              </div>
            </div>

            <div className="trh-modal-actions">
              <button
                type="button"
                className="btn-modal-sec"
                onClick={() => setServiceModalItem(null)}
                disabled={savingServices}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-modal-pri"
                onClick={handleSaveServices}
                disabled={savingServices}
              >
                {savingServices ? "Updating..." : "Save & Update Bill"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          RECEIPT MODAL
      ====================================================== */}

      {selectedInvoice && (
        <div
          className="trh-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedInvoice(null);
            }
          }}
        >
          <div className="trh-modal-box">
            <div className="trh-modal-header no-print">
              <div>
                <span className="trh-eyebrow">RECEIPT PREVIEW</span>
                <h2>Service Delivery Voucher</h2>
              </div>

              <button
                type="button"
                className="trh-btn-close"
                onClick={() => setSelectedInvoice(null)}
              >
                <FiX />
              </button>
            </div>

            <div className="trh-invoice-sheet" id="printable-receipt">
              <div className="invoice-head">
                <div>
                  <h1 className="brand-name">ZAID INFOTECH</h1>
                  <p className="brand-sub">
                    Premium Hardware Repairs &amp; IT Services
                  </p>
                </div>

                <div className="invoice-meta">
                  <h3>SERVICE RECEIPT</h3>
                  <span>
                    Ticket: {selectedInvoice.repairNumber ||
                      String(selectedInvoice._id || "").slice(-6).toUpperCase()}
                  </span>
                  <span>Date: {formatDate(selectedInvoice.updatedAt || new Date())}</span>
                  <span>Job Date: {formatDate(getRepairDate(selectedInvoice))}</span>
                </div>
              </div>

              <hr className="divider" />

              <div className="invoice-grid">
                <div>
                  <span className="meta-head">CUSTOMER DETAILS</span>
                  <strong>{selectedInvoice.customerName || "Walk-in Customer"}</strong>
                  <div>Phone: {selectedInvoice.customerPhone || "N/A"}</div>

                  {selectedInvoice.customerEmail && (
                    <div>Email: {selectedInvoice.customerEmail}</div>
                  )}
                </div>

                <div>
                  <span className="meta-head">HARDWARE REPAIRED</span>
                  <strong>
                    {selectedInvoice.deviceType
                      ? `${selectedInvoice.deviceType} — `
                      : ""}
                    {selectedInvoice.deviceModel ||
                      selectedInvoice.laptopModel ||
                      "Device unspecified"}
                  </strong>
                  <div>
                    Technician: {selectedInvoice.technicianName || "Assigned Technician"}
                  </div>
                  <div>Status: {selectedInvoice.status || "Completed"}</div>
                </div>
              </div>

              <div className="invoice-table-section">
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Service / Problem Description</th>
                      <th className="text-right">Part (₹)</th>
                      <th className="text-right">Labour (₹)</th>
                      <th className="text-right">Total (₹)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Array.isArray(selectedInvoice.services) &&
                    selectedInvoice.services.length > 0 ? (
                      selectedInvoice.services.map((service, index) => (
                        <tr key={`${service.serviceId || service.serviceName}-${index}`}>
                          <td>
                            <strong>
                              {service.serviceName || service.name || "Repair Service"}
                            </strong>

                            {index === 0 && selectedInvoice.issueDescription && (
                              <p style={{ margin: "2px 0 0", fontSize: "11px" }}>
                                Issue: {selectedInvoice.issueDescription}
                              </p>
                            )}

                            {service.category && (
                              <small style={{ display: "block", fontSize: "10px" }}>
                                {service.category}
                              </small>
                            )}
                          </td>
                          <td className="text-right">
                            {formatINR(service.partCost)}
                          </td>
                          <td className="text-right">
                            {formatINR(service.laborCost)}
                          </td>
                          <td className="text-right">
                            {formatINR(getServiceTotal(service))}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>
                          <strong>Repair Diagnostic &amp; Labour</strong>
                          <p>{selectedInvoice.issueDescription || "Repair service"}</p>
                        </td>
                        <td className="text-right">—</td>
                        <td className="text-right">—</td>
                        <td className="text-right">
                          {formatINR(selectedInvoice.repairCost)}
                        </td>
                      </tr>
                    )}

                    {selectedInvoice.remarks && (
                      <tr>
                        <td colSpan={3}>
                          <em>Intake Remarks: {selectedInvoice.remarks}</em>
                        </td>
                        <td className="text-right">—</td>
                      </tr>
                    )}
                  </tbody>

                  <tfoot>
                    <tr>
                      <th colSpan={3}>Total Amount Due / Paid:</th>
                      <th className="text-right total-cell">
                        {formatINR(selectedInvoice.repairCost)}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="invoice-footer-notes">
                <p>
                  Thank you for choosing Zaid Infotech. 30 Days service warranty
                  applies on replaced components.
                </p>
              </div>
            </div>

            <div className="trh-modal-actions no-print">
              <button
                type="button"
                className="btn-modal-sec"
                onClick={() => setSelectedInvoice(null)}
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