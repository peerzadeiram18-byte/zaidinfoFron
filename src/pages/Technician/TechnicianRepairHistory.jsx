// import React, { useCallback, useEffect, useMemo, useState } from "react";
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
//   FiCalendar,
//   FiAlertCircle,
// } from "react-icons/fi";
// import { FaRupeeSign } from "react-icons/fa";
// import { toast } from "react-toastify";
// import "./TechnicianRepairHistory.css";

// // ======================================================
// // API CONFIGURATION
// // .env: VITE_API_URL=http://localhost:5000/api
// // Production: VITE_API_URL=https://your-domain.com/api
// // ======================================================

// const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
// const BASE_URL = `${API_URL}/newRepair`;
// const SERVICES_API = `${API_URL}/repair-service/get-services`;

// const STATUS_HISTORY = [
//   "completed",
//   "delivered",
//   "ready for delivery",
//   "cancelled",
// ];

// const formatINR = (amount) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(Number(amount) || 0);

// const getErrorMessage = (error, fallback) =>
//   error?.response?.data?.message ||
//   error?.response?.data?.error ||
//   error?.message ||
//   fallback;

// const getResponseArray = (response, keys = []) => {
//   const data = response?.data;

//   if (Array.isArray(data)) return data;

//   for (const key of keys) {
//     if (Array.isArray(data?.[key])) return data[key];
//   }

//   return [];
// };

// const getPersonName = (user = {}) =>
//   String(
//     user.name ||
//       user.fullName ||
//       `${user.firstName || ""} ${user.lastName || ""}`
//   )
//     .trim()
//     .toLowerCase();

// const getAssignedId = (assigned) => {
//   if (assigned && typeof assigned === "object") {
//     return String(assigned._id || assigned.id || "");
//   }

//   return String(assigned || "");
// };

// const getServiceTotal = (service) => {
//   const part = Number(service?.partCost) || 0;
//   const labor = Number(service?.laborCost) || 0;

//   return Number.isFinite(Number(service?.totalCost))
//     ? Number(service.totalCost)
//     : part + labor;
// };

// const getRepairDate = (item) =>
//   item?.jobDate || item?.createdAt || item?.updatedAt || null;

// const formatDate = (date) => {
//   if (!date) return "Not Set";

//   const parsed = new Date(date);

//   if (Number.isNaN(parsed.getTime())) return "Not Set";

//   return parsed.toLocaleDateString("en-IN");
// };

// const normalizeService = (service = {}) => {
//   const serviceId =
//     typeof service.serviceId === "object"
//       ? service.serviceId?._id || service.serviceId?.id || null
//       : service.serviceId || service._id || null;

//   const partCost = Number(service.partCost) || 0;
//   const laborCost = Number(service.laborCost) || 0;

//   return {
//     serviceId,
//     serviceName: String(
//       service.serviceName || service.name || ""
//     ),
//     category: String(service.category || "Custom Repair"),
//     partCost,
//     laborCost,
//     totalCost: getServiceTotal(service),
//     isCustom: service.isCustom ?? !serviceId,
//   };
// };

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
//   // LOGIN USER + TOKEN
//   // ======================================================

//   const token =
//     localStorage.getItem("token") ||
//     localStorage.getItem("accessToken") ||
//     "";

//   const loggedInUser = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user") || "{}") || {};
//     } catch {
//       return {};
//     }
//   }, []);

//   const techId = String(
//     loggedInUser._id || loggedInUser.id || ""
//   );

//   const techName = getPersonName(loggedInUser);

//   const getAuthConfig = useCallback(() => {
//     const currentToken =
//       localStorage.getItem("token") ||
//       localStorage.getItem("accessToken") ||
//       "";

//     return {
//       headers: {
//         ...(currentToken
//           ? { Authorization: `Bearer ${currentToken}` }
//           : {}),
//       },
//     };
//   }, []);

//   // ======================================================
//   // FETCH REPAIR HISTORY
//   // ======================================================

//   const fetchHistory = useCallback(async () => {
//     if (!API_URL) {
//       toast.error("VITE_API_URL is missing in your frontend .env file.");
//       setRepairs([]);
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);

//       let response;

//       // First try the technician-specific endpoint.
//       try {
//         response = await axios.get(
//           `${BASE_URL}/my-assigned-repairs`,
//           getAuthConfig()
//         );
//       } catch (firstError) {
//         // Fall back to the existing repair list route.
//         // This fallback only helps if the list endpoint is supported
//         // and the logged-in user has permission to access it.
//         if (
//           firstError?.response?.status !== 404 &&
//           firstError?.response?.status !== 405
//         ) {
//           throw firstError;
//         }

//         response = await axios.get(
//           `${BASE_URL}/`,
//           getAuthConfig()
//         );
//       }

//       const records = getResponseArray(response, [
//         "repairs",
//         "data",
//         "results",
//       ]);

//       setRepairs(records);
//     } catch (error) {
//       console.error(
//         "Fetch repair history error:",
//         error?.response?.data || error
//       );

//       setRepairs([]);
//       toast.error(
//         getErrorMessage(error, "Failed to load repair history")
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [getAuthConfig]);

//   // ======================================================
//   // FETCH AVAILABLE STANDARD SERVICES
//   // ======================================================

//   const fetchAvailableServices = useCallback(async () => {
//     if (!API_URL) return;

//     try {
//       const response = await axios.get(
//         SERVICES_API,
//         getAuthConfig()
//       );

//       const records = getResponseArray(response, [
//         "services",
//         "data",
//         "results",
//       ]);

//       setAvailableServices(records);
//     } catch (error) {
//       console.error(
//         "Fetch services error:",
//         error?.response?.data || error
//       );

//       setAvailableServices([]);
//       toast.error(
//         getErrorMessage(error, "Could not load standard services")
//       );
//     }
//   }, [getAuthConfig]);

//   useEffect(() => {
//     fetchHistory();
//     fetchAvailableServices();
//   }, [fetchHistory, fetchAvailableServices]);

//   // ======================================================
//   // FILTER CURRENT TECHNICIAN'S COMPLETED HISTORY
//   // ======================================================

//   const historyRecords = useMemo(() => {
//     return repairs.filter((repair) => {
//       const assignedId = getAssignedId(
//         repair.assignedTechnician
//       );

//       const recordTechName = String(
//         repair.technicianName || ""
//       )
//         .trim()
//         .toLowerCase();

//       const matchesId =
//         Boolean(techId) &&
//         Boolean(assignedId) &&
//         assignedId === techId;

//       const matchesName =
//         Boolean(techName) &&
//         Boolean(recordTechName) &&
//         (
//           recordTechName === techName ||
//           recordTechName.includes(techName) ||
//           techName.includes(recordTechName)
//         );

//       const matchesTechnician = matchesId || matchesName;

//       const status = String(repair.status || "")
//         .trim()
//         .toLowerCase();

//       const isClosed =
//         STATUS_HISTORY.includes(status) ||
//         repair.isDelivered === true;

//       return matchesTechnician && isClosed;
//     });
//   }, [repairs, techId, techName]);

//   // ======================================================
//   // SEARCH + DATE FILTER
//   // ======================================================

//   const filteredRecords = useMemo(() => {
//     const query = searchTerm.trim().toLowerCase();
//     const now = new Date();

//     return historyRecords.filter((item) => {
//       const model = String(
//         item.deviceModel || item.laptopModel || ""
//       ).toLowerCase();

//       const deviceType = String(item.deviceType || "").toLowerCase();

//       const ticket = String(item.repairNumber || "").toLowerCase();

//       const customerName = String(
//         item.customerName || ""
//       ).toLowerCase();

//       const customerPhone = String(
//         item.customerPhone || ""
//       ).toLowerCase();

//       const issue = String(
//         item.issueDescription || ""
//       ).toLowerCase();

//       const matchesSearch =
//         !query ||
//         customerName.includes(query) ||
//         customerPhone.includes(query) ||
//         ticket.includes(query) ||
//         model.includes(query) ||
//         deviceType.includes(query) ||
//         issue.includes(query);

//       const recordDateValue =
//         item.jobDate || item.updatedAt || item.createdAt;

//       const recordDate = recordDateValue
//         ? new Date(recordDateValue)
//         : null;

//       let matchesDate = true;

//       if (dateFilter !== "ALL") {
//         if (!recordDate || Number.isNaN(recordDate.getTime())) {
//           matchesDate = false;
//         } else if (dateFilter === "30_DAYS") {
//           const past30Days = new Date(
//             now.getTime() - 30 * 24 * 60 * 60 * 1000
//           );

//           matchesDate =
//             recordDate >= past30Days &&
//             recordDate <= now;
//         } else if (dateFilter === "THIS_MONTH") {
//           matchesDate =
//             recordDate.getMonth() === now.getMonth() &&
//             recordDate.getFullYear() === now.getFullYear();
//         }
//       }

//       return matchesSearch && matchesDate;
//     });
//   }, [historyRecords, searchTerm, dateFilter]);

//   // ======================================================
//   // TURNAROUND
//   // ======================================================

//   const calculateTurnaround = (createdAt, updatedAt) => {
//     if (!createdAt) return "N/A";

//     const start = new Date(createdAt);
//     const end = updatedAt ? new Date(updatedAt) : new Date();

//     if (
//       Number.isNaN(start.getTime()) ||
//       Number.isNaN(end.getTime())
//     ) {
//       return "N/A";
//     }

//     const diffDays = Math.max(
//       1,
//       Math.ceil((end.getTime() - start.getTime()) / 86400000)
//     );

//     return `${diffDays} Day${diffDays === 1 ? "" : "s"}`;
//   };

//   // ======================================================
//   // SUMMARY METRICS
//   // ======================================================

//   const totalDelivered = filteredRecords.filter((repair) =>
//     ["completed", "delivered"].includes(
//       String(repair.status || "").toLowerCase()
//     )
//   ).length;

//   const totalHistoricalRevenue = filteredRecords.reduce(
//     (sum, repair) => sum + (Number(repair.repairCost) || 0),
//     0
//   );

//   const averageResolutionDays = useMemo(() => {
//     const durations = filteredRecords
//       .map((repair) => {
//         if (!repair.createdAt || !repair.updatedAt) return null;

//         const start = new Date(repair.createdAt).getTime();
//         const end = new Date(repair.updatedAt).getTime();

//         if (!Number.isFinite(start) || !Number.isFinite(end)) {
//           return null;
//         }

//         return Math.max(1, Math.ceil((end - start) / 86400000));
//       })
//       .filter((days) => days !== null);

//     if (!durations.length) return "N/A";

//     const average =
//       durations.reduce((sum, days) => sum + days, 0) /
//       durations.length;

//     return `${average.toFixed(1)} Days`;
//   }, [filteredRecords]);

//   // ======================================================
//   // OPEN SERVICE MODAL
//   // ======================================================

//   const handleOpenServiceModal = (item) => {
//     setServiceModalItem(item);

//     setAppliedServices(
//       Array.isArray(item.services)
//         ? item.services.map(normalizeService)
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

//   const handleAddPredefinedService = () => {
//     if (!selectedServiceId) {
//       toast.warn("Please select a standard service.");
//       return;
//     }

//     const found = availableServices.find(
//       (service) => String(service._id) === String(selectedServiceId)
//     );

//     if (!found) {
//       toast.error("Selected service was not found.");
//       return;
//     }

//     const exists = appliedServices.some(
//       (service) =>
//         !service.isCustom &&
//         String(service.serviceId) === String(found._id)
//     );

//     if (exists) {
//       toast.warn("This service is already added.");
//       return;
//     }

//     const partCost = Number(found.partCost) || 0;
//     const laborCost = Number(found.laborCost) || 0;

//     setAppliedServices((previous) => [
//       ...previous,
//       {
//         serviceId: found._id,
//         serviceName: found.serviceName || found.name || "",
//         category: found.category || "General Repair",
//         partCost,
//         laborCost,
//         totalCost: getServiceTotal({
//           ...found,
//           partCost,
//           laborCost,
//         }),
//         isCustom: false,
//       },
//     ]);

//     setSelectedServiceId("");
//   };

//   // ======================================================
//   // ADD CUSTOM SERVICE
//   // ======================================================

//   const handleAddCustomService = () => {
//     if (!customServiceName.trim()) {
//       toast.warn("Please enter a service name.");
//       return;
//     }

//     const partCost = Number(customPartCost) || 0;
//     const laborCost = Number(customLaborCost) || 0;

//     if (partCost < 0 || laborCost < 0) {
//       toast.warn("Part and labour costs cannot be negative.");
//       return;
//     }

//     setAppliedServices((previous) => [
//       ...previous,
//       {
//         serviceId: null,
//         serviceName: customServiceName.trim(),
//         category: "Custom Repair",
//         partCost,
//         laborCost,
//         totalCost: partCost + laborCost,
//         isCustom: true,
//       },
//     ]);

//     setCustomServiceName("");
//     setCustomPartCost("");
//     setCustomLaborCost("");
//   };

//   // ======================================================
//   // REMOVE SERVICE
//   // ======================================================

//   const handleRemoveService = (index) => {
//     setAppliedServices((previous) =>
//       previous.filter((_, currentIndex) => currentIndex !== index)
//     );
//   };

//   // ======================================================
//   // CALCULATE SERVICES TOTAL
//   // ======================================================

//   const calculatedModalTotal = useMemo(
//     () =>
//       appliedServices.reduce(
//         (sum, service) => sum + getServiceTotal(service),
//         0
//       ),
//     [appliedServices]
//   );

//   // ======================================================
//   // SAVE SERVICES AND UPDATE REPAIR COST
//   // ======================================================

//   const handleSaveServices = async () => {
//     if (!serviceModalItem) return;

//     const repairId =
//       serviceModalItem._id || serviceModalItem.id;

//     if (!repairId) {
//       toast.error("Repair ticket ID is missing.");
//       return;
//     }

//     try {
//       setSavingServices(true);

//       const services = appliedServices.map((service) => ({
//         serviceId: service.serviceId || null,
//         serviceName: service.serviceName.trim(),
//         category: service.category || "Custom Repair",
//         partCost: Number(service.partCost) || 0,
//         laborCost: Number(service.laborCost) || 0,
//         totalCost: getServiceTotal(service),
//         isCustom: Boolean(service.isCustom),
//       }));

//       const payload = {
//         services,
//         repairCost: calculatedModalTotal,
//       };

//       // Keep the existing backend route.
//       const response = await axios.put(
//         `${BASE_URL}/${repairId}`,
//         payload,
//         getAuthConfig()
//       );

//       const responseRepair =
//         response.data?.repair ||
//         response.data?.data?.repair ||
//         response.data?.data;

//       const updatedRecord = {
//         ...serviceModalItem,
//         ...(responseRepair &&
//         typeof responseRepair === "object"
//           ? responseRepair
//           : {}),
//         ...payload,
//       };

//       setRepairs((previous) =>
//         previous.map((repair) =>
//           String(repair._id || repair.id) === String(repairId)
//             ? { ...repair, ...updatedRecord }
//             : repair
//         )
//       );

//       setSelectedInvoice((previous) =>
//         previous &&
//         String(previous._id || previous.id) === String(repairId)
//           ? { ...previous, ...updatedRecord }
//           : previous
//       );

//       toast.success("Services and repair cost updated successfully.");
//       setServiceModalItem(null);
//     } catch (error) {
//       console.error(
//         "Save services error:",
//         error?.response?.data || error
//       );

//       toast.error(
//         getErrorMessage(
//           error,
//           "Failed to update repair services. Check the backend PUT route."
//         )
//       );
//     } finally {
//       setSavingServices(false);
//     }
//   };

//   // ======================================================
//   // RENDER
//   // ======================================================

//   return (
//     <div className="trh-container">
//       <header className="trh-header">
//         <div>
//           <span className="trh-eyebrow">ARCHIVE &amp; AUDIT</span>
//           <h1>Technician Repair History</h1>
//           <p>
//             Historical records, customer delivery receipts, and resolved
//             service tickets.
//           </p>
//           <p>
//             Logged in as: <strong>{loggedInUser.name ||
//               `${loggedInUser.firstName || ""} ${loggedInUser.lastName || ""}`.trim() ||
//               "Technician"}</strong>
//           </p>
//         </div>

//         <button
//           type="button"
//           className="trh-sync-btn"
//           onClick={() => {
//             fetchHistory();
//             fetchAvailableServices();
//           }}
//           disabled={loading}
//         >
//           <FiRefreshCw className={loading ? "trh-spin" : ""} />
//           <span>{loading ? "Syncing..." : "Sync Archive"}</span>
//         </button>
//       </header>

//       <section className="trh-metrics">
//         <div className="trh-metric-card">
//           <div className="trh-metric-ico icon-blue">
//             <FiCheckCircle />
//           </div>
//           <div>
//             <span className="trh-lbl">Delivered / Completed</span>
//             <strong className="trh-val">{totalDelivered} Jobs</strong>
//           </div>
//         </div>

//         <div className="trh-metric-card">
//           <div className="trh-metric-ico icon-purple">
//             <FaRupeeSign />
//           </div>
//           <div>
//             <span className="trh-lbl">Total Completed Value</span>
//             <strong className="trh-val">
//               {formatINR(totalHistoricalRevenue)}
//             </strong>
//           </div>
//         </div>

//         <div className="trh-metric-card">
//           <div className="trh-metric-ico icon-amber">
//             <FiClock />
//           </div>
//           <div>
//             <span className="trh-lbl">Avg Resolution Speed</span>
//             <strong className="trh-val">{averageResolutionDays}</strong>
//           </div>
//         </div>
//       </section>

//       <section className="trh-card">
//         <div className="trh-toolbar">
//           <div className="trh-search-wrap">
//             <FiSearch className="trh-search-ico" />
//             <input
//               type="text"
//               placeholder="Search ticket, customer, phone, device, issue..."
//               value={searchTerm}
//               onChange={(event) => setSearchTerm(event.target.value)}
//             />
//           </div>

//           <div className="trh-filter-group">
//             <select
//               value={dateFilter}
//               onChange={(event) => setDateFilter(event.target.value)}
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
//             <div className="trh-spinner" />
//             <p>Loading historical records...</p>
//           </div>
//         ) : filteredRecords.length === 0 ? (
//           <div className="trh-state-box">
//             <div className="trh-empty-ico">
//               <FiInbox />
//             </div>
//             <h3>No Completed History Found</h3>
//             <p>
//               Closed and delivered repair tickets assigned to your technician
//               profile will appear here.
//             </p>
//           </div>
//         ) : (
//           <div className="trh-table-wrap">
//             <table className="trh-table">
//               <thead>
//                 <tr>
//                   <th>Ticket #</th>
//                   <th>Customer Info</th>
//                   <th>Device / Job Date</th>
//                   <th>Diagnostic &amp; Applied Services</th>
//                   <th>Turnaround</th>
//                   <th>Final Cost</th>
//                   <th>Status</th>
//                   <th className="trh-th-right">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredRecords.map((item) => (
//                   <tr key={item._id || item.id}>
//                     <td>
//                       <span className="trh-ticket-code">
//                         {item.repairNumber ||
//                           String(item._id || item.id || "")
//                             .slice(-6)
//                             .toUpperCase()}
//                       </span>
//                     </td>

//                     <td>
//                       <div className="trh-cust-cell">
//                         <strong>{item.customerName || "Walk-in Customer"}</strong>
//                         <span className="trh-sub-txt">
//                           <FiPhone /> {item.customerPhone || "N/A"}
//                         </span>
//                         {item.customerEmail && (
//                           <span className="trh-sub-txt">
//                             <FiMail /> {item.customerEmail}
//                           </span>
//                         )}
//                       </div>
//                     </td>

//                     <td>
//                       <strong className="trh-device-txt">
//                         {item.deviceType || "Device"}
//                         {" — "}
//                         {item.deviceModel ||
//                           item.laptopModel ||
//                           "Model unspecified"}
//                       </strong>
//                       <span className="trh-sub-txt">
//                         <FiCalendar /> Job: {formatDate(getRepairDate(item))}
//                       </span>
//                     </td>

//                     <td className="trh-issue-cell">
//                       <p className="trh-issue-p">
//                         <FiAlertCircle /> {item.issueDescription || "No issue description"}
//                       </p>

//                       {item.remarks && (
//                         <span className="trh-remark-tag">
//                           Note: {item.remarks}
//                         </span>
//                       )}

//                       {Array.isArray(item.services) &&
//                         item.services.length > 0 && (
//                           <div
//                             style={{
//                               display: "flex",
//                               flexWrap: "wrap",
//                               gap: "4px",
//                               marginTop: "6px",
//                             }}
//                           >
//                             {item.services.map((service, index) => (
//                               <span
//                                 key={`${service.serviceId || service.serviceName || "service"}-${index}`}
//                                 style={{
//                                   fontSize: "11px",
//                                   background: "#eef2ff",
//                                   color: "#3730a3",
//                                   padding: "2px 6px",
//                                   borderRadius: "4px",
//                                   border: "1px solid #c7d2fe",
//                                 }}
//                               >
//                                 {service.serviceName || service.name || "Service"}{" "}
//                                 ({formatINR(getServiceTotal(service))})
//                               </span>
//                             ))}
//                           </div>
//                         )}
//                     </td>

//                     <td>
//                       <span className="trh-turnaround-badge">
//                         <FiClock />
//                         {calculateTurnaround(item.createdAt, item.updatedAt)}
//                       </span>
//                     </td>

//                     <td>
//                       <strong className="trh-cost-txt">
//                         {formatINR(item.repairCost)}
//                       </strong>
//                     </td>

//                     <td>
//                       <span
//                         className={`trh-status-pill ${String(
//                           item.status || "completed"
//                         )
//                           .toLowerCase()
//                           .replaceAll(" ", "-")}`}
//                       >
//                         {item.status || "Completed"}
//                       </span>
//                     </td>

//                     <td className="trh-td-right">
//                       <div
//                         style={{
//                           display: "flex",
//                           gap: "6px",
//                           justifyContent: "flex-end",
//                           flexWrap: "wrap",
//                         }}
//                       >
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

//       {/* ======================================================
//           SERVICES MODAL
//       ====================================================== */}

//       {serviceModalItem && (
//         <div
//           className="trh-modal-overlay"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget && !savingServices) {
//               setServiceModalItem(null);
//             }
//           }}
//         >
//           <div className="trh-modal-box" style={{ maxWidth: "700px" }}>
//             <div className="trh-modal-header">
//               <div>
//                 <span className="trh-eyebrow">BILLING &amp; WORK BREAKDOWN</span>
//                 <h2>Add Completed Repair Work</h2>
//                 <small style={{ color: "#6b7280" }}>
//                   Ticket: {serviceModalItem.repairNumber || serviceModalItem._id}
//                 </small>
//               </div>

//               <button
//                 type="button"
//                 className="trh-btn-close"
//                 onClick={() => !savingServices && setServiceModalItem(null)}
//                 disabled={savingServices}
//               >
//                 <FiX />
//               </button>
//             </div>

//             <div style={{ padding: "16px 20px" }}>
//               <div style={{ marginBottom: "16px" }}>
//                 <label
//                   style={{
//                     display: "block",
//                     fontSize: "12px",
//                     fontWeight: 600,
//                     marginBottom: "6px",
//                   }}
//                 >
//                   Select Standard Service
//                 </label>

//                 <div style={{ display: "flex", gap: "8px" }}>
//                   <select
//                     className="trh-select"
//                     style={{ flex: 1, minWidth: 0 }}
//                     value={selectedServiceId}
//                     onChange={(event) => setSelectedServiceId(event.target.value)}
//                   >
//                     <option value="">-- Choose Standard Service --</option>
//                     {availableServices.map((service) => (
//                       <option key={service._id} value={service._id}>
//                         {service.serviceName || service.name}
//                         {service.category ? ` (${service.category})` : ""}
//                         {" — Part: "}
//                         {formatINR(service.partCost)}
//                         {" + Labour: "}
//                         {formatINR(service.laborCost)}
//                         {" = "}
//                         {formatINR(getServiceTotal(service))}
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

//                 {availableServices.length === 0 && (
//                   <small style={{ color: "#b45309" }}>
//                     No standard services loaded. You can still add a custom service.
//                   </small>
//                 )}
//               </div>

//               <div style={{ marginBottom: "20px" }}>
//                 <label
//                   style={{
//                     display: "block",
//                     fontSize: "12px",
//                     fontWeight: 600,
//                     marginBottom: "6px",
//                   }}
//                 >
//                   Or Add Custom Service / Component
//                 </label>

//                 <div
//                   style={{
//                     display: "flex",
//                     gap: "8px",
//                     flexWrap: "wrap",
//                   }}
//                 >
//                   <input
//                     type="text"
//                     placeholder="Service / component name"
//                     value={customServiceName}
//                     onChange={(event) => setCustomServiceName(event.target.value)}
//                     style={{
//                       flex: "2 1 180px",
//                       minWidth: 0,
//                       padding: "8px 10px",
//                       border: "1px solid #e5e7eb",
//                       borderRadius: "6px",
//                     }}
//                   />

//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     placeholder="Part (₹)"
//                     value={customPartCost}
//                     onChange={(event) => setCustomPartCost(event.target.value)}
//                     style={{
//                       flex: "1 1 90px",
//                       width: "90px",
//                       minWidth: 0,
//                       padding: "8px 10px",
//                       border: "1px solid #e5e7eb",
//                       borderRadius: "6px",
//                     }}
//                   />

//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     placeholder="Labour (₹)"
//                     value={customLaborCost}
//                     onChange={(event) => setCustomLaborCost(event.target.value)}
//                     style={{
//                       flex: "1 1 90px",
//                       width: "90px",
//                       minWidth: 0,
//                       padding: "8px 10px",
//                       border: "1px solid #e5e7eb",
//                       borderRadius: "6px",
//                     }}
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

//               <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
//                 <h4 style={{ fontSize: "13px", marginBottom: "8px" }}>
//                   Applied Services Breakdown ({appliedServices.length})
//                 </h4>

//                 {appliedServices.length === 0 ? (
//                   <p style={{ fontSize: "12px", color: "#9ca3af" }}>
//                     No services attached. Add services above to calculate the
//                     repair cost. Saving an empty list sets the repair cost to ₹0.
//                   </p>
//                 ) : (
//                   <div style={{ maxHeight: "180px", overflowY: "auto" }}>
//                     {appliedServices.map((service, index) => (
//                       <div
//                         key={`${service.serviceId || service.serviceName}-${index}`}
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           gap: "12px",
//                           padding: "8px 0",
//                           borderBottom: "1px dashed #f3f4f6",
//                         }}
//                       >
//                         <div style={{ minWidth: 0 }}>
//                           <strong style={{ fontSize: "13px", color: "#1f2937" }}>
//                             {service.serviceName || service.name}
//                           </strong>
//                           <div style={{ fontSize: "11px", color: "#6b7280" }}>
//                             {service.category} | Part: {formatINR(service.partCost)}
//                             {" | Labour: "}
//                             {formatINR(service.laborCost)}
//                           </div>
//                         </div>

//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "12px",
//                             flexShrink: 0,
//                           }}
//                         >
//                           <strong style={{ fontSize: "13px", color: "#059669" }}>
//                             {formatINR(getServiceTotal(service))}
//                           </strong>

//                           <button
//                             type="button"
//                             title="Remove service"
//                             onClick={() => handleRemoveService(index)}
//                             style={{
//                               background: "none",
//                               border: "none",
//                               color: "#ef4444",
//                               cursor: "pointer",
//                             }}
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
//                     gap: "12px",
//                     paddingTop: "12px",
//                     marginTop: "8px",
//                     borderTop: "2px solid #e5e7eb",
//                     fontWeight: "bold",
//                     fontSize: "15px",
//                   }}
//                 >
//                   <span>Grand Total Cost:</span>
//                   <span style={{ color: "#059669" }}>
//                     {formatINR(calculatedModalTotal)}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="trh-modal-actions">
//               <button
//                 type="button"
//                 className="btn-modal-sec"
//                 onClick={() => setServiceModalItem(null)}
//                 disabled={savingServices}
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

//       {/* ======================================================
//           RECEIPT MODAL
//       ====================================================== */}

//       {selectedInvoice && (
//         <div
//           className="trh-modal-overlay"
//           onMouseDown={(event) => {
//             if (event.target === event.currentTarget) {
//               setSelectedInvoice(null);
//             }
//           }}
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
//                   <p className="brand-sub">
//                     Premium Hardware Repairs &amp; IT Services
//                   </p>
//                 </div>

//                 <div className="invoice-meta">
//                   <h3>SERVICE RECEIPT</h3>
//                   <span>
//                     Ticket: {selectedInvoice.repairNumber ||
//                       String(selectedInvoice._id || "").slice(-6).toUpperCase()}
//                   </span>
//                   <span>Date: {formatDate(selectedInvoice.updatedAt || new Date())}</span>
//                   <span>Job Date: {formatDate(getRepairDate(selectedInvoice))}</span>
//                 </div>
//               </div>

//               <hr className="divider" />

//               <div className="invoice-grid">
//                 <div>
//                   <span className="meta-head">CUSTOMER DETAILS</span>
//                   <strong>{selectedInvoice.customerName || "Walk-in Customer"}</strong>
//                   <div>Phone: {selectedInvoice.customerPhone || "N/A"}</div>

//                   {selectedInvoice.customerEmail && (
//                     <div>Email: {selectedInvoice.customerEmail}</div>
//                   )}
//                 </div>

//                 <div>
//                   <span className="meta-head">HARDWARE REPAIRED</span>
//                   <strong>
//                     {selectedInvoice.deviceType
//                       ? `${selectedInvoice.deviceType} — `
//                       : ""}
//                     {selectedInvoice.deviceModel ||
//                       selectedInvoice.laptopModel ||
//                       "Device unspecified"}
//                   </strong>
//                   <div>
//                     Technician: {selectedInvoice.technicianName || "Assigned Technician"}
//                   </div>
//                   <div>Status: {selectedInvoice.status || "Completed"}</div>
//                 </div>
//               </div>

//               <div className="invoice-table-section">
//                 <table className="invoice-table">
//                   <thead>
//                     <tr>
//                       <th>Service / Problem Description</th>
//                       <th className="text-right">Part (₹)</th>
//                       <th className="text-right">Labour (₹)</th>
//                       <th className="text-right">Total (₹)</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {Array.isArray(selectedInvoice.services) &&
//                     selectedInvoice.services.length > 0 ? (
//                       selectedInvoice.services.map((service, index) => (
//                         <tr key={`${service.serviceId || service.serviceName}-${index}`}>
//                           <td>
//                             <strong>
//                               {service.serviceName || service.name || "Repair Service"}
//                             </strong>

//                             {index === 0 && selectedInvoice.issueDescription && (
//                               <p style={{ margin: "2px 0 0", fontSize: "11px" }}>
//                                 Issue: {selectedInvoice.issueDescription}
//                               </p>
//                             )}

//                             {service.category && (
//                               <small style={{ display: "block", fontSize: "10px" }}>
//                                 {service.category}
//                               </small>
//                             )}
//                           </td>
//                           <td className="text-right">
//                             {formatINR(service.partCost)}
//                           </td>
//                           <td className="text-right">
//                             {formatINR(service.laborCost)}
//                           </td>
//                           <td className="text-right">
//                             {formatINR(getServiceTotal(service))}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td>
//                           <strong>Repair Diagnostic &amp; Labour</strong>
//                           <p>{selectedInvoice.issueDescription || "Repair service"}</p>
//                         </td>
//                         <td className="text-right">—</td>
//                         <td className="text-right">—</td>
//                         <td className="text-right">
//                           {formatINR(selectedInvoice.repairCost)}
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
//                         {formatINR(selectedInvoice.repairCost)}
//                       </th>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>

//               <div className="invoice-footer-notes">
//                 <p>
//                   Thank you for choosing Zaid Infotech. 30 Days service warranty
//                   applies on replaced components.
//                 </p>
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


import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiSearch, FiPhone, FiMail, FiCheckCircle, FiPrinter, FiClock, FiRefreshCw, FiInbox, FiX, FiPlus, FiTrash2, FiEdit3, FiCalendar, FiAlertCircle } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { toast } from "react-toastify";
import "./TechnicianRepairHistory.css";

const API_URL = String(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const BASE_URL = `${API_URL}/newRepair`;
const SERVICES_API = `${API_URL}/repair-service/get-services`;
const STATUS_HISTORY = ["completed", "delivered", "ready for delivery", "cancelled"];

// Same client-approved categories as RepairCustomer.jsx.
const LAPTOP_PROBLEMS = {
  "Power & Startup Issues": ["Laptop Not Powering On", "Laptop Not Charging", "Laptop Not Turning On With Charger", "Power Button Not Working", "No Power Indicator Light", "Laptop Turns On but No Display", "Laptop Shuts Down Automatically", "Laptop Restarts Repeatedly", "Laptop Stuck on Manufacturer Logo", "Laptop Stuck in Boot Loop"],
  "Display & Screen Issues": ["Laptop Screen Broken / Cracked", "Display Flickering", "No Display / Black Screen", "White Screen / Blank Screen", "Lines on Screen", "Dim Display / Backlight Issue", "External Monitor Not Working", "Display Cable Issue", "Screen Bezel Damaged", "Display Hinge Damage"],
  "Keyboard & Touchpad Issues": ["Keyboard Not Working", "Some Keyboard Keys Not Working", "Keyboard Replacement", "Touchpad Not Working", "Touchpad Buttons Not Working", "Laptop Mouse Not Detected", "Power Button / Keyboard Panel Issue"],
  "Battery & Charging Issues": ["Battery Draining Quickly", "Battery Not Detected", "Battery Not Charging", "Battery Replacement", "Battery Swelling", "Charger / Adapter Not Working", "Charging Port / DC Jack Damaged", "Intermittent Charging Issue"],
  "Motherboard & Hardware Issues": ["Motherboard Repair", "Motherboard Short Circuit", "RAM Not Detected", "RAM Upgrade / Replacement", "SSD / HDD Not Detected", "SSD / HDD Upgrade", "M.2 SSD Not Detected", "USB Port Not Working", "HDMI / DisplayPort Not Working", "Audio Jack Not Working", "Wi-Fi / Bluetooth Hardware Issue", "Fan Not Working", "Speaker Not Working", "Webcam Not Working", "Fingerprint Reader Not Working", "External Device Not Detected"],
  "Heating & Performance Issues": ["Laptop Overheating", "Fan Noise / Loud Fan", "Laptop Running Slowly", "Laptop Hanging / Freezing", "Automatic Shutdown Due to Overheating", "Thermal Paste Replacement", "Internal Cleaning / Dust Removal"],
  "Windows & Operating System Issues": ["Windows Installation", "Windows Activation Issue", "Windows Boot Error", "Blue Screen Error (BSOD)", "Windows Update Issue", "Driver Installation / Update", "BIOS Update / Configuration", "BIOS Password Issue", "Forgotten Windows Password", "Laptop Stuck on Automatic Repair", "Operating System Corrupted", "Sleep / Wake Issue"],
  "Software & Data Services": ["Software Installation", "Microsoft Office Installation", "Virus / Malware Removal", "Data Backup / Transfer", "Data Recovery"],
  "Network & Connectivity Issues": ["Wi-Fi Not Detected", "Wi-Fi Not Connecting", "Bluetooth Not Working", "LAN / Ethernet Not Working", "Internet Connectivity Issue", "Microphone Not Working", "No Sound / Audio Issue", "Camera Not Detected"],
  "Physical Damage & Body Issues": ["Liquid / Water Damage", "Accidental / Physical Damage", "Laptop Body / Casing Broken", "Hinge Broken / Tight Hinge", "Screw Thread / Mounting Damage"],
  "General Service & Maintenance": ["Full Laptop Servicing", "General Diagnosis / Inspection", "Preventive Maintenance", "Laptop Cleaning"],
  Other: ["Other / Problem Not Listed"],
};
const formatINR = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(Number(value) || 0);
const getErrorMessage = (e, fallback) => e?.response?.data?.message || e?.response?.data?.error || e?.message || fallback;
const getResponseArray = (response, keys = []) => {
  const data = response?.data;
  if (Array.isArray(data)) return data;
  for (const key of keys) if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data?.repairs)) return data.data.repairs;
  return [];
};
const getPersonName = (u = {}) => String(u.name || u.fullName || `${u.firstName || ""} ${u.lastName || ""}`).trim().toLowerCase();
const getAssignedId = (assigned) => String(assigned && typeof assigned === "object" ? assigned._id || assigned.id || "" : assigned || "");
const getServiceTotal = (s) => s?.totalCost != null && Number.isFinite(Number(s.totalCost)) ? Number(s.totalCost) : (Number(s?.partCost) || 0) + (Number(s?.laborCost) || 0);
const getRepairDate = (item) => item?.jobDate || item?.createdAt || item?.updatedAt || null;
const formatDate = (value) => { const d = value ? new Date(value) : null; return d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString("en-IN") : "Not Set"; };
const normalizeService = (s = {}) => {
  const serviceId = typeof s.serviceId === "object" ? s.serviceId?._id || s.serviceId?.id || null : s.serviceId || s._id || null;
  return { serviceId, serviceName: String(s.serviceName || s.name || ""), category: String(s.category || "Custom Repair"), partCost: Number(s.partCost) || 0, laborCost: Number(s.laborCost) || 0, totalCost: getServiceTotal(s), isCustom: s.isCustom ?? !serviceId };
};
// Old backend stores selected fields as labelled lines in issueDescription.
// New backend can instead return these as independent properties.
const getJobDetails = (repair = {}) => {
  const text = String(repair.issueDescription || "");
  const read = (label) => text.split(/\r?\n/).find((line) => line.startsWith(`${label}: `))?.slice(label.length + 2).trim() || "";
  return {
    problemCategory: repair.problemCategory || read("Problem Category"),
    specificProblem: repair.specificProblem || read("Specific Problem"),
    customerDescription: repair.customerDescription || read("Customer Description"),
    deviceBrand: repair.deviceBrand || read("Device Brand"),
    serialNumber: repair.serialNumber || read("Serial Number"),
    accessoriesReceived: repair.accessoriesReceived || read("Accessories Received"),
    physicalCondition: repair.physicalCondition || read("Physical Condition"),
  };
};
const replaceDetailsInIssue = (repair, details) => {
  const labels = ["Problem Category", "Specific Problem", "Customer Description", "Device Brand", "Serial Number", "Accessories Received", "Physical Condition"];
  const leftover = String(repair.issueDescription || "").split(/\r?\n/).filter((line) => !labels.some((label) => line.startsWith(`${label}: `))).join("\n").trim();
  const lines = [
    `Problem Category: ${details.problemCategory}`,
    `Specific Problem: ${details.specificProblem}`,
    details.customerDescription && `Customer Description: ${details.customerDescription}`,
    details.deviceBrand && `Device Brand: ${details.deviceBrand}`,
    details.serialNumber && `Serial Number: ${details.serialNumber}`,
    details.accessoriesReceived && `Accessories Received: ${details.accessoriesReceived}`,
    details.physicalCondition && `Physical Condition: ${details.physicalCondition}`,
    leftover && `Additional Notes: ${leftover}`,
  ].filter(Boolean);
  return lines.join("\n");
};
const ProblemDetails = ({ repair }) => {
  const info = getJobDetails(repair);
  if (!info.problemCategory && !info.specificProblem) return null;
  return <div className="trh-problem-details" style={{ padding: 12, marginTop: 10, border: "1px solid #cbd5e1", borderRadius: 8, background: "#f8fafc", overflowWrap: "anywhere" }}>
    <strong>REPORTED PROBLEM DETAILS</strong>
    <div><b>Problem Category:</b> {info.problemCategory || "N/A"}</div>
    <div><b>Specific Problem:</b> {info.specificProblem || "N/A"}</div>
    {info.customerDescription && <div><b>Customer Description:</b> {info.customerDescription}</div>}
    {info.deviceBrand && <div><b>Device Brand:</b> {info.deviceBrand}</div>}
    {info.serialNumber && <div><b>Serial Number:</b> {info.serialNumber}</div>}
    {info.accessoriesReceived && <div><b>Accessories Received:</b> {info.accessoriesReceived}</div>}
    {info.physicalCondition && <div><b>Physical Condition:</b> {info.physicalCondition}</div>}
  </div>;
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
  const [problemModalItem, setProblemModalItem] = useState(null);
  const [problemForm, setProblemForm] = useState({ problemCategory: "", specificProblem: "", customerDescription: "", deviceBrand: "", serialNumber: "", accessoriesReceived: "", physicalCondition: "" });
  const [savingProblem, setSavingProblem] = useState(false);
  const loggedInUser = useMemo(() => { try { return JSON.parse(localStorage.getItem("user") || "{}") || {}; } catch { return {}; } }, []);
  const techId = String(loggedInUser._id || loggedInUser.id || "");
  const techName = getPersonName(loggedInUser);
  const getAuthConfig = useCallback(() => { const t = localStorage.getItem("token") || localStorage.getItem("accessToken") || ""; return { headers: t ? { Authorization: `Bearer ${t}` } : {} }; }, []);

  const fetchHistory = useCallback(async () => {
    if (!API_URL) { toast.error("VITE_API_URL missing in frontend .env"); setLoading(false); return; }
    try {
      setLoading(true);
      let res;
      try { res = await axios.get(`${BASE_URL}/my-assigned-repairs`, getAuthConfig()); }
      catch (e) { if (![404, 405].includes(e?.response?.status)) throw e; res = await axios.get(`${BASE_URL}/`, getAuthConfig()); }
      setRepairs(getResponseArray(res, ["repairs", "data", "results"]));
    } catch (e) { console.error("Fetch history error:", e); toast.error(getErrorMessage(e, "Failed to load repair history")); setRepairs([]); }
    finally { setLoading(false); }
  }, [getAuthConfig]);
  const fetchAvailableServices = useCallback(async () => {
    if (!API_URL) return;
    try { const res = await axios.get(SERVICES_API, getAuthConfig()); setAvailableServices(getResponseArray(res, ["services", "data", "results"])); }
    catch (e) { console.error("Fetch service error:", e); toast.error(getErrorMessage(e, "Failed to load services")); setAvailableServices([]); }
  }, [getAuthConfig]);
  useEffect(() => { fetchHistory(); fetchAvailableServices(); }, [fetchHistory, fetchAvailableServices]);

  const historyRecords = useMemo(() => repairs.filter((r) => {
    const id = getAssignedId(r.assignedTechnician);
    const name = getPersonName(typeof r.assignedTechnician === "object" ? r.assignedTechnician : {} ) || String(r.technicianName || "").trim().toLowerCase();
    const matchTech = (techId && id === techId) || (techName && name && (name === techName || name.includes(techName) || techName.includes(name)));
    const status = String(r.status || "").trim().toLowerCase();
    return Boolean(matchTech && (STATUS_HISTORY.includes(status) || r.isDelivered === true));
  }), [repairs, techId, techName]);
  const filteredRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase(); const now = new Date();
    return historyRecords.filter((r) => {
      const info = getJobDetails(r);
      const haystack = [r.deviceModel, r.laptopModel, r.deviceType, r.repairNumber, r.customerName, r.customerPhone, r.issueDescription, info.problemCategory, info.specificProblem].join(" ").toLowerCase();
      if (query && !haystack.includes(query)) return false;
      if (dateFilter === "ALL") return true;
      const d = new Date(getRepairDate(r)); if (Number.isNaN(d.getTime())) return false;
      if (dateFilter === "THIS_MONTH") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (dateFilter === "30_DAYS") return d >= new Date(now.getTime() - 30 * 86400000) && d <= now;
      return true;
    });
  }, [historyRecords, searchTerm, dateFilter]);
  const calculateTurnaround = (startValue, endValue) => {
    if (!startValue) return "N/A";
    const start = new Date(startValue); const end = endValue ? new Date(endValue) : new Date();
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "N/A";
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));
    return `${days} Day${days === 1 ? "" : "s"}`;
  };
  const totalDelivered = filteredRecords.filter((r) => ["completed", "delivered"].includes(String(r.status || "").toLowerCase())).length;
  const totalHistoricalRevenue = filteredRecords.reduce((sum, r) => sum + (Number(r.repairCost) || 0), 0);
  const averageResolutionDays = useMemo(() => {
    const days = filteredRecords.map((r) => {
      const start = new Date(r.createdAt).getTime(); const end = new Date(r.updatedAt).getTime();
      return Number.isFinite(start) && Number.isFinite(end) ? Math.max(1, Math.ceil((end - start) / 86400000)) : null;
    }).filter((d) => d !== null);
    return days.length ? `${(days.reduce((a, b) => a + b, 0) / days.length).toFixed(1)} Days` : "N/A";
  }, [filteredRecords]);

  const handleOpenServiceModal = (r) => {
    setServiceModalItem(r); setAppliedServices(Array.isArray(r.services) ? r.services.map(normalizeService) : []);
    setSelectedServiceId(""); setCustomServiceName(""); setCustomPartCost(""); setCustomLaborCost("");
  };
  const handleAddPredefinedService = () => {
    const found = availableServices.find((s) => String(s._id) === String(selectedServiceId));
    if (!found) return toast.warn("Select a standard service.");
    if (appliedServices.some((s) => !s.isCustom && String(s.serviceId) === String(found._id))) return toast.warn("Already added.");
    setAppliedServices((p) => [...p, normalizeService({ ...found, serviceId: found._id, isCustom: false })]); setSelectedServiceId("");
  };
  const handleAddCustomService = () => {
    if (!customServiceName.trim()) return toast.warn("Enter a custom service name.");
    if ([customPartCost, customLaborCost].some((v) => v !== "" && (!Number.isFinite(Number(v)) || Number(v) < 0))) return toast.warn("Enter valid nonnegative costs.");
    const partCost = Number(customPartCost) || 0; const laborCost = Number(customLaborCost) || 0;
    setAppliedServices((p) => [...p, { serviceId: null, serviceName: customServiceName.trim(), category: "Custom Repair", partCost, laborCost, totalCost: partCost + laborCost, isCustom: true }]);
    setCustomServiceName(""); setCustomPartCost(""); setCustomLaborCost("");
  };
  const calculatedModalTotal = useMemo(() => appliedServices.reduce((sum, s) => sum + getServiceTotal(s), 0), [appliedServices]);
  const handleSaveServices = async () => {
    if (!serviceModalItem) return;
    const id = serviceModalItem._id || serviceModalItem.id; if (!id) return toast.error("Ticket ID missing");
    try {
      setSavingServices(true);
      const payload = { services: appliedServices.map((s) => ({ serviceId: s.serviceId || null, serviceName: s.serviceName.trim(), category: s.category || "Custom Repair", partCost: Number(s.partCost) || 0, laborCost: Number(s.laborCost) || 0, totalCost: getServiceTotal(s), isCustom: Boolean(s.isCustom) })), repairCost: calculatedModalTotal };
      const response = await axios.put(`${BASE_URL}/${id}`, payload, getAuthConfig());
      const returned = response.data?.repair || response.data?.data?.repair || response.data?.data;
      const updated = { ...serviceModalItem, ...(returned && typeof returned === "object" && !Array.isArray(returned) ? returned : {}), ...payload };
      setRepairs((p) => p.map((r) => String(r._id || r.id) === String(id) ? { ...r, ...updated } : r));
      setSelectedInvoice((p) => p && String(p._id || p.id) === String(id) ? { ...p, ...updated } : p);
      setServiceModalItem(null); toast.success("Repair services updated");
    } catch (e) { toast.error(getErrorMessage(e, "Could not save repair services")); }
    finally { setSavingServices(false); }
  };
  const openProblemModal = (repair) => { setProblemModalItem(repair); setProblemForm(getJobDetails(repair)); };
  const handleSaveProblem = async () => {
    if (!problemModalItem) return;
    if (!problemForm.problemCategory || !problemForm.specificProblem) return toast.warn("Select Problem Category and Specific Problem.");
    if (!(LAPTOP_PROBLEMS[problemForm.problemCategory] || []).includes(problemForm.specificProblem)) return toast.error("Specific Problem does not match category.");
    if (problemForm.specificProblem === "Other / Problem Not Listed" && !problemForm.customerDescription?.trim()) return toast.warn("Describe the other problem.");
    const id = problemModalItem._id || problemModalItem.id;
    if (!id) return toast.error("Repair ticket ID missing");
    const details = Object.fromEntries(Object.entries(problemForm).map(([k, v]) => [k, String(v || "").trim()]));
    const issueDescription = replaceDetailsInIssue(problemModalItem, details);
    try {
      setSavingProblem(true);
      // Use the existing PUT endpoint; avoid additional unknown schema fields.
      const res = await axios.put(`${BASE_URL}/${id}`, { issueDescription }, getAuthConfig());
      const returned = res.data?.repair || res.data?.data?.repair || res.data?.data;
      const updated = { ...problemModalItem, ...(returned && typeof returned === "object" && !Array.isArray(returned) ? returned : {}), issueDescription, ...details };
      setRepairs((p) => p.map((r) => String(r._id || r.id) === String(id) ? { ...r, ...updated } : r));
      setSelectedInvoice((p) => p && String(p._id || p.id) === String(id) ? { ...p, ...updated } : p);
      toast.success("Problem Category and Specific Problem updated."); setProblemModalItem(null);
    } catch (e) { toast.error(getErrorMessage(e, "Could not update problem. Confirm backend PUT /newRepair/:id accepts issueDescription.")); }
    finally { setSavingProblem(false); }
  };

const handlePrintReceipt = () => {
  if (!selectedInvoice) {
    toast.error("Please select a receipt first.");
    return;
  }

  const receipt = document.getElementById("printable-receipt");

  if (!receipt) {
    toast.error("Receipt content not found.");
    return;
  }

  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=750"
  );

  if (!printWindow) {
    toast.error("Please allow pop-ups to print the receipt.");
    return;
  }

  const receiptHTML = receipt.outerHTML;

  const printCSS = `
    @page {
      size: A4 portrait;
      margin: 10mm;
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100%;
      background: white !important;
      color: #111827;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11px;
      line-height: 1.35;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .trh-invoice-sheet {
      width: 100% !important;
      max-width: 190mm !important;
      margin: 0 auto !important;
      padding: 0 !important;
      background: white !important;
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
      min-height: 0 !important;
      height: auto !important;
      overflow: visible !important;
    }

    .invoice-head {
      display: flex !important;
      justify-content: space-between;
      align-items: flex-start;
      gap: 15px;
      padding: 0 0 10px !important;
      margin: 0 !important;
    }

    .brand-name {
      font-size: 23px !important;
      font-weight: 800;
      color: #172554 !important;
      margin: 0 0 4px !important;
      line-height: 1.15;
    }

    .brand-sub {
      font-size: 10px;
      color: #475569;
      margin: 0 !important;
    }

    .invoice-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      text-align: right;
      gap: 3px;
      font-size: 10px;
    }

    .invoice-meta h3 {
      margin: 0 0 5px !important;
      font-size: 15px;
      color: #172554;
    }

    .invoice-meta span {
      display: block;
    }

    .divider {
      border: 0;
      border-top: 1px solid #cbd5e1;
      margin: 8px 0 12px !important;
    }

    .invoice-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin: 0 0 12px !important;
      padding: 0 !important;
    }

    .invoice-grid > div {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .invoice-grid strong {
      display: block;
      font-size: 11px;
      margin: 4px 0;
    }

    .meta-head {
      display: block;
      font-weight: 700;
      font-size: 10px;
      color: #334155;
      margin-bottom: 5px;
    }

    .trh-problem-details {
      padding: 9px !important;
      margin: 8px 0 12px !important;
      background: #f8fafc !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 4px !important;
      font-size: 10px !important;
      line-height: 1.4 !important;
      overflow-wrap: anywhere;
      break-inside: avoid;
    }

    .trh-problem-details strong {
      display: block;
      margin-bottom: 5px;
    }

    .trh-problem-details div {
      margin-bottom: 2px;
    }

    .invoice-table-section {
      width: 100% !important;
      margin: 10px 0 !important;
      padding: 0 !important;
      overflow: visible !important;
    }

    .invoice-table {
      width: 100% !important;
      border-collapse: collapse !important;
      table-layout: fixed;
      font-size: 10px !important;
    }

    .invoice-table th,
    .invoice-table td {
      padding: 7px 6px !important;
      border: 1px solid #cbd5e1 !important;
      vertical-align: top;
      overflow-wrap: anywhere;
      word-break: normal;
    }

    .invoice-table th:first-child,
    .invoice-table td:first-child {
      width: 46%;
    }

    .invoice-table th:not(:first-child),
    .invoice-table td:not(:first-child) {
      width: 18%;
    }

    .invoice-table thead th {
      background: #e2e8f0 !important;
      font-weight: 700;
      color: #0f172a;
    }

    .invoice-table td p {
      margin: 3px 0 !important;
      font-size: 9px;
    }

    .invoice-table td small {
      display: block;
      margin-top: 3px;
      color: #64748b;
      font-size: 9px;
    }

    .text-right {
      text-align: right !important;
    }

    .invoice-table tfoot th {
      background: #f1f5f9 !important;
      font-weight: 800;
      font-size: 11px;
    }

    .total-cell {
      color: #0f172a;
      font-size: 12px !important;
    }

    .invoice-footer-notes {
      border-top: 1px solid #cbd5e1;
      padding-top: 8px !important;
      margin-top: 12px !important;
      font-size: 9px;
      color: #475569;
      break-inside: avoid;
    }

    .invoice-footer-notes p {
      margin: 0 !important;
    }

    .no-print,
    button {
      display: none !important;
    }

    tr {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    @media print {
      html,
      body {
        width: 100% !important;
        height: auto !important;
        overflow: visible !important;
      }

      .trh-invoice-sheet {
        max-width: none !important;
      }
    }
  `;

  const escapeHTML = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[character]
    );

  printWindow.document.open();

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>
          Receipt - ${escapeHTML(
            selectedInvoice.repairNumber || "Repair"
          )}
        </title>
        <style>${printCSS}</style>
      </head>

      <body>
        ${receiptHTML}
      </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 350);
  };
};

  return <div className="trh-container">
    <header className="trh-header">
      <div><span className="trh-eyebrow">ARCHIVE &amp; AUDIT</span><h1>Technician Repair History</h1><p>Historical records, customer delivery receipts, and resolved service tickets.</p><p>Logged in as: <strong>{loggedInUser.name || `${loggedInUser.firstName || ""} ${loggedInUser.lastName || ""}`.trim() || "Technician"}</strong></p></div>
      <button className="trh-sync-btn" type="button" onClick={() => { fetchHistory(); fetchAvailableServices(); }} disabled={loading}><FiRefreshCw className={loading ? "trh-spin" : ""}/> {loading ? "Syncing..." : "Sync Archive"}</button>
    </header>
    <section className="trh-metrics">
      <div className="trh-metric-card"><div className="trh-metric-ico icon-blue"><FiCheckCircle/></div><div><span className="trh-lbl">Delivered / Completed</span><strong className="trh-val">{totalDelivered} Jobs</strong></div></div>
      <div className="trh-metric-card"><div className="trh-metric-ico icon-purple"><FaRupeeSign/></div><div><span className="trh-lbl">Total Completed Value</span><strong className="trh-val">{formatINR(totalHistoricalRevenue)}</strong></div></div>
      <div className="trh-metric-card"><div className="trh-metric-ico icon-amber"><FiClock/></div><div><span className="trh-lbl">Avg Resolution Speed</span><strong className="trh-val">{averageResolutionDays}</strong></div></div>
    </section>
    <section className="trh-card">
      <div className="trh-toolbar"><div className="trh-search-wrap"><FiSearch className="trh-search-ico"/><input placeholder="Search ticket, customer, device, category, problem..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/></div><div className="trh-filter-group"><select className="trh-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}><option value="ALL">All Time History</option><option value="THIS_MONTH">This Month</option><option value="30_DAYS">Last 30 Days</option></select></div></div>
      {loading ? <div className="trh-state-box"><div className="trh-spinner"/><p>Loading historical records...</p></div> : filteredRecords.length === 0 ? <div className="trh-state-box"><div className="trh-empty-ico"><FiInbox/></div><h3>No Completed History Found</h3><p>Closed and delivered repair tickets assigned to your technician profile will appear here.</p></div> :
      <div className="trh-table-wrap"><table className="trh-table"><thead><tr><th>Ticket #</th><th>Customer Info</th><th>Device / Job Date</th><th>Problem Category / Specific Problem</th><th>Diagnostic &amp; Applied Services</th><th>Turnaround</th><th>Final Cost</th><th>Status</th><th className="trh-th-right">Actions</th></tr></thead><tbody>
      {filteredRecords.map((item) => { const info = getJobDetails(item); return <tr key={item._id || item.id}>
        <td><span className="trh-ticket-code">{item.repairNumber || String(item._id || item.id || "").slice(-6).toUpperCase()}</span></td>
        <td><div className="trh-cust-cell"><strong>{item.customerName || "Walk-in Customer"}</strong><span className="trh-sub-txt"><FiPhone/> {item.customerPhone || "N/A"}</span>{item.customerEmail && <span className="trh-sub-txt"><FiMail/> {item.customerEmail}</span>}</div></td>
        <td><strong className="trh-device-txt">{item.deviceType || "Device"} — {item.deviceModel || item.laptopModel || "Model unspecified"}</strong><span className="trh-sub-txt"><FiCalendar/> Job: {formatDate(getRepairDate(item))}</span></td>
        <td><div style={{ minWidth: 180 }}><strong>Category:</strong><div>{info.problemCategory || "Not recorded"}</div><strong>Specific Problem:</strong><div>{info.specificProblem || "Not recorded"}</div></div></td>
        <td className="trh-issue-cell"><p className="trh-issue-p"><FiAlertCircle/> {info.customerDescription || item.issueDescription || "No issue description"}</p>{item.remarks && <span className="trh-remark-tag">Note: {item.remarks}</span>}{Array.isArray(item.services) && item.services.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>{item.services.map((s, i) => <span key={i} style={{ fontSize: 11, background: "#eef2ff", padding: "2px 6px", borderRadius: 4 }}>{s.serviceName || s.name || "Service"} ({formatINR(getServiceTotal(s))})</span>)}</div>}</td>
        <td><span className="trh-turnaround-badge"><FiClock/> {calculateTurnaround(item.createdAt, item.updatedAt)}</span></td>
        <td><strong className="trh-cost-txt">{formatINR(item.repairCost)}</strong></td>
        <td><span className={`trh-status-pill ${String(item.status || "completed").toLowerCase().replaceAll(" ", "-")}`}>{item.status || "Completed"}</span></td>
        <td className="trh-td-right"><div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}><button type="button" className="trh-btn-edit" onClick={() => openProblemModal(item)}><FiEdit3/> Problem</button><button type="button" className="trh-btn-edit" onClick={() => handleOpenServiceModal(item)}><FiEdit3/> Services</button><button type="button" className="trh-btn-print" onClick={() => setSelectedInvoice(item)}><FiPrinter/> Receipt</button></div></td>
      </tr>; })}</tbody></table></div>}
    </section>
    {problemModalItem && <div className="trh-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget && !savingProblem) setProblemModalItem(null); }}><div className="trh-modal-box" style={{ maxWidth: 650 }}>
      <div className="trh-modal-header"><div><span className="trh-eyebrow">REPAIR DIAGNOSIS</span><h2>Problem Category &amp; Specific Problem</h2><small>Ticket: {problemModalItem.repairNumber || problemModalItem._id}</small></div><button type="button" className="trh-btn-close" disabled={savingProblem} onClick={() => setProblemModalItem(null)}><FiX/></button></div>
      <div style={{ padding: 20, display: "grid", gap: 13 }}>
        <label>Problem Category *<select className="trh-select" style={{ display: "block", width: "100%", marginTop: 5 }} value={problemForm.problemCategory} onChange={(e) => setProblemForm((p) => ({ ...p, problemCategory: e.target.value, specificProblem: "" }))}><option value="">-- Select Category --</option>{Object.keys(LAPTOP_PROBLEMS).map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
        <label>Specific Problem *<select className="trh-select" style={{ display: "block", width: "100%", marginTop: 5 }} value={problemForm.specificProblem} disabled={!problemForm.problemCategory} onChange={(e) => setProblemForm((p) => ({ ...p, specificProblem: e.target.value }))}><option value="">-- Select Specific Problem --</option>{(LAPTOP_PROBLEMS[problemForm.problemCategory] || []).map((problem) => <option key={problem} value={problem}>{problem}</option>)}</select></label>
        <label>Customer Description {problemForm.specificProblem === "Other / Problem Not Listed" && "*"}<textarea rows="3" style={{ display: "block", width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 6 }} value={problemForm.customerDescription} onChange={(e) => setProblemForm((p) => ({ ...p, customerDescription: e.target.value }))}/></label>
        <label>Device Brand<input style={{ display: "block", width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 6 }} value={problemForm.deviceBrand} onChange={(e) => setProblemForm((p) => ({ ...p, deviceBrand: e.target.value }))}/></label>
        <label>Serial Number<input style={{ display: "block", width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 6 }} value={problemForm.serialNumber} onChange={(e) => setProblemForm((p) => ({ ...p, serialNumber: e.target.value }))}/></label>
        <label>Accessories Received<textarea rows="2" style={{ display: "block", width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 6 }} value={problemForm.accessoriesReceived} onChange={(e) => setProblemForm((p) => ({ ...p, accessoriesReceived: e.target.value }))}/></label>
        <label>Physical Condition<textarea rows="2" style={{ display: "block", width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 6 }} value={problemForm.physicalCondition} onChange={(e) => setProblemForm((p) => ({ ...p, physicalCondition: e.target.value }))}/></label>
      </div><div className="trh-modal-actions"><button type="button" className="btn-modal-sec" disabled={savingProblem} onClick={() => setProblemModalItem(null)}>Cancel</button><button type="button" className="btn-modal-pri" disabled={savingProblem} onClick={handleSaveProblem}>{savingProblem ? "Saving..." : "Save Problem Details"}</button></div>
    </div></div>}
    {serviceModalItem && <div className="trh-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget && !savingServices) setServiceModalItem(null); }}><div className="trh-modal-box" style={{ maxWidth: 700 }}>
      <div className="trh-modal-header"><div><span className="trh-eyebrow">BILLING &amp; WORK BREAKDOWN</span><h2>Add Completed Repair Work</h2><small>Ticket: {serviceModalItem.repairNumber || serviceModalItem._id}</small></div><button className="trh-btn-close" type="button" onClick={() => !savingServices && setServiceModalItem(null)} disabled={savingServices}><FiX/></button></div>
      <div style={{ padding: "16px 20px" }}><div style={{ marginBottom: 16 }}><label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Select Standard Service</label><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><select className="trh-select" style={{ flex: "1 1 230px", minWidth: 0 }} value={selectedServiceId} onChange={(e) => setSelectedServiceId(e.target.value)}><option value="">-- Choose Standard Service --</option>{availableServices.map((s) => <option key={s._id} value={s._id}>{s.serviceName || s.name} — {formatINR(getServiceTotal(s))}</option>)}</select><button className="btn-modal-pri" type="button" disabled={!selectedServiceId} onClick={handleAddPredefinedService}><FiPlus/> Add</button></div>{availableServices.length === 0 && <small>No standard services loaded. You may add custom services.</small>}</div>
        <div style={{ marginBottom: 20 }}><label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Or Add Custom Service / Component</label><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><input style={{ flex: "2 1 180px", minWidth: 0, padding: 8 }} placeholder="Service / component name" value={customServiceName} onChange={(e) => setCustomServiceName(e.target.value)}/><input style={{ flex: "1 1 90px", minWidth: 0, padding: 8 }} type="number" min="0" step="0.01" placeholder="Part (₹)" value={customPartCost} onChange={(e) => setCustomPartCost(e.target.value)}/><input style={{ flex: "1 1 90px", minWidth: 0, padding: 8 }} type="number" min="0" step="0.01" placeholder="Labour (₹)" value={customLaborCost} onChange={(e) => setCustomLaborCost(e.target.value)}/><button type="button" className="btn-modal-sec" onClick={handleAddCustomService}><FiPlus/> Add</button></div></div>
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12 }}><h4>Applied Services Breakdown ({appliedServices.length})</h4>{!appliedServices.length ? <p>No services attached. Saving an empty list sets the repair cost to ₹0.</p> : <div style={{ maxHeight: 180, overflowY: "auto" }}>{appliedServices.map((s, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", gap: 10, borderBottom: "1px dashed #ddd" }}><div><strong>{s.serviceName}</strong><div style={{ fontSize: 11 }}>Part: {formatINR(s.partCost)} | Labour: {formatINR(s.laborCost)}</div></div><div style={{ display: "flex", alignItems: "center", gap: 10 }}><strong>{formatINR(getServiceTotal(s))}</strong><button type="button" title="Remove service" onClick={() => setAppliedServices((p) => p.filter((_, index) => index !== i))}><FiTrash2/></button></div></div>)}</div>}<div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontWeight: "bold" }}><span>Grand Total Cost:</span><span>{formatINR(calculatedModalTotal)}</span></div></div>
      </div><div className="trh-modal-actions"><button type="button" className="btn-modal-sec" onClick={() => setServiceModalItem(null)} disabled={savingServices}>Cancel</button><button type="button" className="btn-modal-pri" onClick={handleSaveServices} disabled={savingServices}>{savingServices ? "Updating..." : "Save & Update Bill"}</button></div>
    </div></div>}
    {selectedInvoice && <div className="trh-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedInvoice(null); }}><div className="trh-modal-box"><div className="trh-modal-header no-print"><div><span className="trh-eyebrow">RECEIPT PREVIEW</span><h2>Service Delivery Voucher</h2></div><button type="button" className="trh-btn-close" onClick={() => setSelectedInvoice(null)}><FiX/></button></div>
      <div className="trh-invoice-sheet" id="printable-receipt"><div className="invoice-head"><div><h1 className="brand-name">ZAID INFOTECH</h1><p className="brand-sub">Premium Hardware Repairs &amp; IT Services</p></div><div className="invoice-meta"><h3>SERVICE RECEIPT</h3><span>Ticket: {selectedInvoice.repairNumber || String(selectedInvoice._id || "").slice(-6).toUpperCase()}</span><span>Date: {formatDate(selectedInvoice.updatedAt || new Date())}</span><span>Job Date: {formatDate(getRepairDate(selectedInvoice))}</span></div></div><hr className="divider"/><div className="invoice-grid"><div><span className="meta-head">CUSTOMER DETAILS</span><strong>{selectedInvoice.customerName || "Walk-in Customer"}</strong><div>Phone: {selectedInvoice.customerPhone || "N/A"}</div>{selectedInvoice.customerEmail && <div>Email: {selectedInvoice.customerEmail}</div>}</div><div><span className="meta-head">HARDWARE REPAIRED</span><strong>{selectedInvoice.deviceType || "Device"} — {selectedInvoice.deviceModel || selectedInvoice.laptopModel || "Device unspecified"}</strong><div>Technician: {selectedInvoice.technicianName || "Assigned Technician"}</div><div>Status: {selectedInvoice.status || "Completed"}</div></div></div>
      <ProblemDetails repair={selectedInvoice}/>
      <div className="invoice-table-section"><table className="invoice-table"><thead><tr><th>Service / Problem Description</th><th className="text-right">Part (₹)</th><th className="text-right">Labour (₹)</th><th className="text-right">Total (₹)</th></tr></thead><tbody>{Array.isArray(selectedInvoice.services) && selectedInvoice.services.length > 0 ? selectedInvoice.services.map((s, i) => <tr key={i}><td><strong>{s.serviceName || s.name || "Repair Service"}</strong>{i === 0 && getJobDetails(selectedInvoice).customerDescription && <p>Issue: {getJobDetails(selectedInvoice).customerDescription}</p>}{s.category && <small>{s.category}</small>}</td><td className="text-right">{formatINR(s.partCost)}</td><td className="text-right">{formatINR(s.laborCost)}</td><td className="text-right">{formatINR(getServiceTotal(s))}</td></tr>) : <tr><td><strong>Repair Diagnostic &amp; Labour</strong><p>{getJobDetails(selectedInvoice).customerDescription || selectedInvoice.issueDescription || "Repair service"}</p></td><td className="text-right">—</td><td className="text-right">—</td><td className="text-right">{formatINR(selectedInvoice.repairCost)}</td></tr>}{selectedInvoice.remarks && <tr><td colSpan={3}><em>Intake Remarks: {selectedInvoice.remarks}</em></td><td className="text-right">—</td></tr>}</tbody><tfoot><tr><th colSpan={3}>Total Amount Due / Paid:</th><th className="text-right total-cell">{formatINR(selectedInvoice.repairCost)}</th></tr></tfoot></table></div><div className="invoice-footer-notes"><p>Thank you for choosing Zaid Infotech. Service warranty, if applicable, is subject to your invoice terms and repair policy.</p></div></div>
      <div className="trh-modal-actions no-print"><button type="button" className="btn-modal-sec" onClick={() => setSelectedInvoice(null)}>Close</button><button
  type="button"
  className="btn-modal-pri"
  onClick={handlePrintReceipt}
>
  <FiPrinter /> Print Voucher
</button></div>
    </div></div>}
  </div>;
}
