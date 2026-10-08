// import { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import {
//   FiSearch,
//   FiPlus,
//   FiUser,
//   FiPhone,
//   FiTool,
//   FiClock,
//   FiCheckCircle,
//   FiX,
//   FiRefreshCw,
//   FiEye,
//   FiMonitor,
//   FiMessageSquare,
//   FiUserCheck,
//   FiInbox,
//   FiDollarSign,
//   FiCalendar,
//   FiPrinter,
//   FiCreditCard,
//   FiSave,
// } from "react-icons/fi";
// import { toast } from "react-toastify";
// import "./RepairCustomer.css";

// // =====================================================
// // API
// // =====================================================

// const API_URL = import.meta.env.VITE_API_URL;

// const BASE_URL = `${API_URL}/newRepair`;
// const TECHNICIAN_URL = `${API_URL}/newRepair/technicians`;

// // =====================================================
// // INITIAL FORM
// // =====================================================

// const initialForm = {
//   customerName: "",
//   customerPhone: "",
//   customerEmail: "",
//   deviceModel: "",
//   issueDescription: "",
//   estimatedCompletionDate: "",
//   repairCost: "",
//   technicianName: "",
//   assignedTechnician: "",
//   remarks: "",
// };

// // =====================================================
// // PAYMENT FORM
// // =====================================================

// const initialPaymentForm = {
//   paidAmount: "",
//   paymentMethod: "CASH",
//   paymentId: "",
// };

// // =====================================================
// // COMPONENT
// // =====================================================

// const RepairCustomer = () => {
//   const [repairs, setRepairs] = useState([]);
//   const [technicians, setTechnicians] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [paymentSubmitting, setPaymentSubmitting] = useState(false);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");

//   const [showAddForm, setShowAddForm] = useState(false);

//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);

//   const [selectedPaymentRepair, setSelectedPaymentRepair] = useState(null);

//   const [form, setForm] = useState(initialForm);
//   const [paymentForm, setPaymentForm] = useState(initialPaymentForm);

//   // ===================================================
//   // AUTH CONFIG
//   // ===================================================

//   const getAuthConfig = () => {
//     const token =
//       localStorage.getItem("token") ||
//       localStorage.getItem("accessToken");

//     return {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     };
//   };

//   // ===================================================
//   // TECHNICIAN NAME
//   // ===================================================

//   const resolveTechName = (techOrId) => {
//     if (!techOrId) return "Unassigned";

//     if (
//       typeof techOrId === "string" &&
//       !techOrId.match(/^[0-9a-fA-F]{24}$/)
//     ) {
//       return techOrId;
//     }

//     const techObj =
//       typeof techOrId === "object"
//         ? techOrId
//         : technicians.find((t) => t._id === techOrId);

//     if (!techObj) return "Unassigned";

//     const full =
//       `${techObj.firstName || ""} ${techObj.lastName || ""}`.trim();

//     return (
//       full ||
//       techObj.name ||
//       techObj.fullName ||
//       techObj.username ||
//       "Technician"
//     );
//   };

//   const getTechnicianName = (repair) =>
//     resolveTechName(
//       repair?.assignedTechnician || repair?.technicianName
//     );

//   // ===================================================
//   // PAYMENT HELPERS
//   // ===================================================

//   const getRepairCost = (repair) => {
//     return Math.max(Number(repair?.repairCost || 0), 0);
//   };

//   const getPaidAmount = (repair) => {
//     const paid = Number(repair?.paidAmount || 0);
//     const total = getRepairCost(repair);

//     return Math.min(Math.max(paid, 0), total);
//   };

//   const getBalanceAmount = (repair) => {
//     const total = getRepairCost(repair);
//     const paid = getPaidAmount(repair);

//     if (
//       repair?.balanceAmount !== undefined &&
//       repair?.balanceAmount !== null
//     ) {
//       return Math.max(Number(repair.balanceAmount || 0), 0);
//     }

//     return Math.max(total - paid, 0);
//   };

//   const getPaymentStatus = (repair) => {
//     const total = getRepairCost(repair);
//     const paid = getPaidAmount(repair);

//     const rawStatus = String(
//       repair?.paymentStatus || ""
//     ).toUpperCase();

//     if (rawStatus === "REFUNDED") return "REFUNDED";
//     if (rawStatus === "FAILED") return "FAILED";

//     if (total <= 0) {
//       return rawStatus || "PENDING";
//     }

//     if (paid >= total) {
//       return "PAID";
//     }

//     if (paid > 0) {
//       return "PARTIAL";
//     }

//     return "PENDING";
//   };

//   const getPaymentStatusClass = (status) => {
//     switch (String(status || "").toUpperCase()) {
//       case "PAID":
//         return "rc-payment-paid";

//       case "PARTIAL":
//         return "rc-payment-partial";

//       case "FAILED":
//         return "rc-payment-failed";

//       case "REFUNDED":
//         return "rc-payment-refunded";

//       default:
//         return "rc-payment-pending";
//     }
//   };

//   const getPaymentStatusLabel = (status) => {
//     return String(status || "PENDING")
//       .replaceAll("_", " ")
//       .replace(/\b\w/g, (letter) => letter.toUpperCase());
//   };

//   // ===================================================
//   // FETCH REPAIRS
//   // ===================================================

//   const fetchRepairs = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.get(
//         `${BASE_URL}/`,
//         getAuthConfig()
//       );

//       const data =
//         res.data?.repairs ||
//         res.data?.data ||
//         (Array.isArray(res.data) ? res.data : []);

//       setRepairs(Array.isArray(data) ? data : []);
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//           "Failed to load repairs"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ===================================================
//   // FETCH TECHNICIANS
//   // ===================================================

//   const fetchTechnicians = async () => {
//     try {
//       const res = await axios.get(
//         TECHNICIAN_URL,
//         getAuthConfig()
//       );

//       const data =
//         res.data?.technicians ||
//         res.data?.data ||
//         (Array.isArray(res.data) ? res.data : []);

//       setTechnicians(Array.isArray(data) ? data : []);
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//           "Failed to load technicians"
//       );
//     }
//   };

//   // ===================================================
//   // INITIAL LOAD
//   // ===================================================

//   useEffect(() => {
//     fetchRepairs();
//     fetchTechnicians();
//   }, []);

//   // ===================================================
//   // FORM CHANGE
//   // ===================================================

//   const handleChange = (e) => {
//     setForm((previous) => ({
//       ...previous,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   // ===================================================
//   // TECHNICIAN CHANGE
//   // ===================================================

//   const handleTechnicianChange = (e) => {
//     const id = e.target.value;

//     setForm((previous) => ({
//       ...previous,
//       assignedTechnician: id,
//       technicianName: id
//         ? resolveTechName(id)
//         : "",
//     }));
//   };

//   // ===================================================
//   // CREATE REPAIR
//   // ===================================================

//   const handleCreateRepair = async (e) => {
//     e.preventDefault();

//     if (
//       !form.customerName.trim() ||
//       !form.customerPhone.trim() ||
//       !form.customerEmail.trim() ||
//       !form.deviceModel.trim() ||
//       !form.issueDescription.trim()
//     ) {
//       return toast.error(
//         "Please fill in all mandatory fields."
//       );
//     }

//     try {
//       setSubmitting(true);

//       const payload = {
//         customerName: form.customerName.trim(),
//         customerPhone: form.customerPhone.trim(),
//         customerEmail: form.customerEmail.trim(),
//         deviceModel: form.deviceModel.trim(),
//         issueDescription: form.issueDescription.trim(),

//         estimatedCompletionDate:
//           form.estimatedCompletionDate || undefined,

//         repairCost: form.repairCost
//           ? Number(form.repairCost)
//           : 0,

//         technicianName:
//           form.technicianName.trim(),

//         assignedTechnician:
//           form.assignedTechnician || null,

//         remarks: form.remarks.trim(),
//       };

//       const res = await axios.post(
//         `${BASE_URL}/request`,
//         payload,
//         getAuthConfig()
//       );

//       toast.success(
//         res.data?.message ||
//           "Repair created successfully"
//       );

//       setShowAddForm(false);
//       setForm(initialForm);

//       await fetchRepairs();
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.errors?.[0] ||
//         err.response?.data?.message ||
//         "Failed to create repair ticket";

//       toast.error(errorMsg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ===================================================
//   // CUSTOMERS GROUPING
//   // ===================================================

//   const customers = useMemo(() => {
//     const map = new Map();

//     repairs.forEach((repair) => {
//       if (!repair.customerPhone) return;

//       if (!map.has(repair.customerPhone)) {
//         map.set(repair.customerPhone, {
//           customerName:
//             repair.customerName ||
//             "Unknown Customer",

//           customerPhone:
//             repair.customerPhone,

//           customerEmail:
//             repair.customerEmail || "",

//           repairs: [],
//         });
//       }

//       map
//         .get(repair.customerPhone)
//         .repairs.push(repair);
//     });

//     return Array.from(map.values());
//   }, [repairs]);

//   // ===================================================
//   // FILTERED CUSTOMERS
//   // ===================================================

//   const filteredCustomers = useMemo(() => {
//     const q = search.toLowerCase().trim();

//     return customers.filter((customer) => {
//       const matchSearch =
//         !q ||
//         customer.customerName
//           .toLowerCase()
//           .includes(q) ||
//         customer.customerPhone
//           .toLowerCase()
//           .includes(q) ||
//         (customer.customerEmail &&
//           customer.customerEmail
//             .toLowerCase()
//             .includes(q)) ||
//         customer.repairs.some((repair) =>
//           [
//             repair.repairNumber,
//             repair.deviceModel,
//             getTechnicianName(repair),
//           ].some((value) =>
//             String(value || "")
//               .toLowerCase()
//               .includes(q)
//           )
//         );

//       const matchStatus =
//         statusFilter === "ALL" ||
//         customer.repairs.some(
//           (repair) =>
//             String(repair.status || "")
//               .toLowerCase() ===
//             statusFilter.toLowerCase()
//         );

//       return matchSearch && matchStatus;
//     });
//   }, [
//     customers,
//     search,
//     statusFilter,
//     technicians,
//   ]);

//   // ===================================================
//   // LATEST REPAIR
//   // ===================================================

//   const getLatestRepair = (customer) =>
//     customer.repairs.length
//       ? [...customer.repairs].sort(
//           (a, b) =>
//             new Date(b.createdAt || 0) -
//             new Date(a.createdAt || 0)
//         )[0]
//       : null;

//   // ===================================================
//   // STATUS HELPERS
//   // ===================================================

//   const getStatusClass = (status) =>
//     status
//       ? `rc-status-${String(status)
//           .toLowerCase()
//           .replaceAll(" ", "-")}`
//       : "rc-status-default";

//   const getStatusLabel = (status) =>
//     status
//       ? String(status)
//           .replaceAll("_", " ")
//           .replace(
//             /\b\w/g,
//             (letter) => letter.toUpperCase()
//           )
//       : "Received";

//   // ===================================================
//   // OPEN RECEIPT
//   // ===================================================

//   const openReceipt = (
//     repairItem,
//     fallbackCustomer = {}
//   ) => {
//     if (!repairItem) return;

//     setSelectedInvoice({
//       ...repairItem,

//       customerName:
//         repairItem.customerName ||
//         fallbackCustomer.customerName ||
//         "Customer",

//       customerPhone:
//         repairItem.customerPhone ||
//         fallbackCustomer.customerPhone ||
//         "N/A",

//       customerEmail:
//         repairItem.customerEmail ||
//         fallbackCustomer.customerEmail ||
//         "",

//       technicianName:
//         getTechnicianName(repairItem),
//     });
//   };

//   // ===================================================
//   // OPEN PAYMENT MODAL
//   // ===================================================

//   const openPaymentModal = (repair) => {
//     if (!repair) return;

//     const total = getRepairCost(repair);
//     const paid = getPaidAmount(repair);
//     const balance = getBalanceAmount(repair);

//     setSelectedPaymentRepair(repair);

//     setPaymentForm({
//       paidAmount:
//         balance > 0
//           ? String(balance)
//           : String(paid),

//       paymentMethod:
//         repair.paymentMethod || "CASH",

//       paymentId:
//         repair.paymentId || "",
//     });
//   };

//   // ===================================================
//   // PAYMENT FORM CHANGE
//   // ===================================================

//   const handlePaymentChange = (e) => {
//     setPaymentForm((previous) => ({
//       ...previous,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   // ===================================================
//   // SAVE PAYMENT
//   // ===================================================

//   const handleSavePayment = async (e) => {
//     e.preventDefault();

//     if (!selectedPaymentRepair?._id) {
//       toast.error("Repair ID is missing.");
//       return;
//     }

//     const total = getRepairCost(
//       selectedPaymentRepair
//     );

//     const paidAmount = Number(
//       paymentForm.paidAmount
//     );

//     if (!Number.isFinite(paidAmount)) {
//       toast.error("Please enter a valid paid amount.");
//       return;
//     }

//     if (paidAmount < 0) {
//       toast.error(
//         "Paid amount cannot be negative."
//       );
//       return;
//     }

//     if (paidAmount > total) {
//       toast.error(
//         `Paid amount cannot exceed repair cost ₹${total.toFixed(
//           2
//         )}.`
//       );
//       return;
//     }

//     try {
//       setPaymentSubmitting(true);

//       const res = await axios.patch(
//         `${BASE_URL}/${selectedPaymentRepair._id}/payment`,
//         {
//           paidAmount,
//           paymentMethod:
//             paymentForm.paymentMethod,
//           paymentId:
//             paymentForm.paymentId.trim(),
//         },
//         getAuthConfig()
//       );

//       toast.success(
//         res.data?.message ||
//           "Repair payment updated successfully."
//       );

//       setSelectedPaymentRepair(null);
//       setPaymentForm(initialPaymentForm);

//       await fetchRepairs();

//       // Refresh selected invoice if it is open
//       if (
//         selectedInvoice?._id ===
//         selectedPaymentRepair._id
//       ) {
//         setSelectedInvoice(null);
//       }
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//           "Failed to update repair payment."
//       );
//     } finally {
//       setPaymentSubmitting(false);
//     }
//   };

//   // ===================================================
//   // PRINT
//   // ===================================================

//   const handlePrint = () => {
//     window.print();
//   };

//   // ===================================================
//   // RENDER
//   // ===================================================

//   return (
//     <div className="rc-dashboard">

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <header className="rc-header no-print">
//         <div className="rc-header-titles">
//           <span className="rc-eyebrow">
//             Repair Operations
//           </span>

//           <h1>Repair Service Registry</h1>

//           <p>
//             Monitor customer equipment intake,
//             workshop assignments, and job tickets.
//           </p>
//         </div>

//         <button
//           type="button"
//           className="rc-btn rc-btn-primary"
//           onClick={() => setShowAddForm(true)}
//         >
//           <FiPlus />
//           <span>New Repair Job</span>
//         </button>
//       </header>

//       {/* =================================================
//           STATS
//       ================================================= */}

//       <section className="rc-stats-grid no-print">

//         <div className="rc-stat-card">
//           <div className="rc-stat-icon rc-icon-blue">
//             <FiUser />
//           </div>

//           <div className="rc-stat-info">
//             <span className="rc-stat-label">
//               Total Customers
//             </span>

//             <strong className="rc-stat-val">
//               {customers.length}
//             </strong>
//           </div>
//         </div>

//         <div className="rc-stat-card">
//           <div className="rc-stat-icon rc-icon-purple">
//             <FiTool />
//           </div>

//           <div className="rc-stat-info">
//             <span className="rc-stat-label">
//               Total Repairs
//             </span>

//             <strong className="rc-stat-val">
//               {repairs.length}
//             </strong>
//           </div>
//         </div>

//         <div className="rc-stat-card">
//           <div className="rc-stat-icon rc-icon-amber">
//             <FiClock />
//           </div>

//           <div className="rc-stat-info">
//             <span className="rc-stat-label">
//               Pending / Received
//             </span>

//             <strong className="rc-stat-val">
//               {
//                 repairs.filter(
//                   (repair) =>
//                     !repair.status ||
//                     String(repair.status).toLowerCase() ===
//                       "received"
//                 ).length
//               }
//             </strong>
//           </div>
//         </div>

//         <div className="rc-stat-card">
//           <div className="rc-stat-icon rc-icon-emerald">
//             <FiCheckCircle />
//           </div>

//           <div className="rc-stat-info">
//             <span className="rc-stat-label">
//               Delivered & Closed
//             </span>

//             <strong className="rc-stat-val">
//               {
//                 repairs.filter((repair) =>
//                   [
//                     "delivered",
//                     "completed",
//                   ].includes(
//                     String(
//                       repair.status
//                     ).toLowerCase()
//                   )
//                 ).length
//               }
//             </strong>
//           </div>
//         </div>

//       </section>

//       {/* =================================================
//           DIRECTORY
//       ================================================= */}

//       <section className="rc-main-card no-print">

//         <div className="rc-card-toolbar">

//           <div className="rc-search-wrap">
//             <FiSearch className="rc-search-ico" />

//             <input
//               type="text"
//               placeholder="Search customer, phone, device, ticket..."
//               value={search}
//               onChange={(e) =>
//                 setSearch(e.target.value)
//               }
//             />

//             {search && (
//               <button
//                 type="button"
//                 className="rc-btn-clear"
//                 onClick={() => setSearch("")}
//               >
//                 <FiX />
//               </button>
//             )}
//           </div>

//           <div className="rc-toolbar-actions">

//             <select
//               value={statusFilter}
//               onChange={(e) =>
//                 setStatusFilter(e.target.value)
//               }
//               className="rc-select"
//             >
//               <option value="ALL">
//                 All Statuses
//               </option>

//               <option value="Received">
//                 Received
//               </option>

//               <option value="Assigned">
//                 Assigned
//               </option>

//               <option value="In Progress">
//                 In Progress
//               </option>

//               <option value="Waiting for Parts">
//                 Waiting for Parts
//               </option>

//               <option value="Ready for Delivery">
//                 Ready for Delivery
//               </option>

//               <option value="Completed">
//                 Completed
//               </option>

//               <option value="Cancelled">
//                 Cancelled
//               </option>
//             </select>

//             <button
//               type="button"
//               className="rc-btn rc-btn-secondary"
//               onClick={fetchRepairs}
//               disabled={loading}
//             >
//               <FiRefreshCw
//                 className={
//                   loading ? "rc-spin" : ""
//                 }
//               />

//               <span>Sync</span>
//             </button>

//           </div>
//         </div>

//         {loading ? (
//           <div className="rc-state-box">
//             <div className="rc-spinner"></div>
//             <p>
//               Loading database records...
//             </p>
//           </div>
//         ) : filteredCustomers.length === 0 ? (
//           <div className="rc-state-box">
//             <div className="rc-empty-ico">
//               <FiInbox />
//             </div>

//             <h3>
//               No Customer Records Found
//             </h3>

//             <p>
//               Adjust your search filters or
//               register a new repair ticket.
//             </p>

//             <button
//               type="button"
//               className="rc-btn rc-btn-primary"
//               onClick={() =>
//                 setShowAddForm(true)
//               }
//             >
//               <FiPlus />
//               New Ticket
//             </button>
//           </div>
//         ) : (
//           <div className="rc-table-scroll">

//             <table className="rc-table">

//               <thead>
//                 <tr>
//                   <th>Customer</th>
//                   <th>Contact Info</th>
//                   <th>Workloads</th>
//                   <th>Latest Ticket</th>
//                   <th>Assigned Tech</th>
//                   <th>Status</th>
//                   <th>Payment</th>
//                   <th className="rc-th-right">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>

//                 {filteredCustomers.map(
//                   (customer) => {

//                     const latestRepair =
//                       getLatestRepair(
//                         customer
//                       );

//                     const paymentStatus =
//                       getPaymentStatus(
//                         latestRepair
//                       );

//                     return (
//                       <tr
//                         key={
//                           customer.customerPhone
//                         }
//                       >

//                         {/* CUSTOMER */}

//                         <td>
//                           <div className="rc-cell-user">

//                             <div className="rc-avatar">
//                               {customer.customerName
//                                 .charAt(0)
//                                 .toUpperCase()}
//                             </div>

//                             <div>
//                               <strong>
//                                 {
//                                   customer.customerName
//                                 }
//                               </strong>

//                               <span>
//                                 Client ID:{" "}
//                                 {customer.customerPhone.slice(
//                                   -4
//                                 )}
//                               </span>
//                             </div>

//                           </div>
//                         </td>

//                         {/* CONTACT */}

//                         <td>
//                           <div className="rc-contact-block">

//                             <span className="rc-phone-chip">
//                               <FiPhone />
//                               {
//                                 customer.customerPhone
//                               }
//                             </span>

//                             {customer.customerEmail && (
//                               <span className="rc-email-sub">
//                                 {
//                                   customer.customerEmail
//                                 }
//                               </span>
//                             )}

//                           </div>
//                         </td>

//                         {/* WORKLOAD */}

//                         <td>
//                           <span className="rc-badge-count">
//                             {
//                               customer.repairs.length
//                             }{" "}
//                             {
//                               customer.repairs.length ===
//                               1
//                                 ? "Job"
//                                 : "Jobs"
//                             }
//                           </span>
//                         </td>

//                         {/* TICKET */}

//                         <td>
//                           <div className="rc-ticket-col">

//                             <span className="rc-ticket-id">
//                               {
//                                 latestRepair?.repairNumber ||
//                                 "TICKET-NEW"
//                               }
//                             </span>

//                             <span className="rc-device-tag">
//                               {
//                                 latestRepair?.deviceModel ||
//                                 latestRepair?.laptopModel ||
//                                 "Standard Device"
//                               }
//                             </span>

//                           </div>
//                         </td>

//                         {/* TECHNICIAN */}

//                         <td>
//                           <span className="rc-tech-tag">
//                             <FiUserCheck />
//                             {getTechnicianName(
//                               latestRepair
//                             )}
//                           </span>
//                         </td>

//                         {/* STATUS */}

//                         <td>
//                           <span
//                             className={`rc-status-pill ${getStatusClass(
//                               latestRepair?.status
//                             )}`}
//                           >
//                             {getStatusLabel(
//                               latestRepair?.status
//                             )}
//                           </span>
//                         </td>

//                         {/* PAYMENT */}

//                         <td>

//                           <div
//                             style={{
//                               display: "flex",
//                               flexDirection: "column",
//                               gap: "5px",
//                               minWidth: "100px",
//                             }}
//                           >

//                             <span
//                               className={`rc-payment-badge ${getPaymentStatusClass(
//                                 paymentStatus
//                               )}`}
//                               style={{
//                                 display:
//                                   "inline-flex",
//                                 alignItems:
//                                   "center",
//                                 justifyContent:
//                                   "center",
//                                 padding:
//                                   "5px 8px",
//                                 borderRadius:
//                                   "999px",
//                                 fontSize:
//                                   "11px",
//                                 fontWeight: 700,
//                               }}
//                             >
//                               {
//                                 getPaymentStatusLabel(
//                                   paymentStatus
//                                 )
//                               }
//                             </span>

//                             <small
//                               style={{
//                                 fontSize:
//                                   "11px",
//                                 color:
//                                   "#64748b",
//                               }}
//                             >
//                               Paid ₹
//                               {getPaidAmount(
//                                 latestRepair
//                               ).toFixed(2)}
//                             </small>

//                             <small
//                               style={{
//                                 fontSize:
//                                   "11px",
//                                 color:
//                                   "#64748b",
//                               }}
//                             >
//                               Due ₹
//                               {getBalanceAmount(
//                                 latestRepair
//                               ).toFixed(2)}
//                             </small>

//                           </div>

//                         </td>

//                         {/* ACTION */}

//                         <td className="rc-td-right">

//                           <div className="rc-table-actions-group">

//                             <button
//                               type="button"
//                               className="rc-btn-action"
//                               onClick={() =>
//                                 setSelectedCustomer(
//                                   customer
//                                 )
//                               }
//                               title="View customer timeline & history"
//                             >
//                               <FiEye />
//                               <span>View</span>
//                             </button>

//                             <button
//                               type="button"
//                               className="rc-btn-action rc-btn-receipt"
//                               onClick={() =>
//                                 openReceipt(
//                                   latestRepair,
//                                   customer
//                                 )
//                               }
//                               title="View and print invoice receipt"
//                             >
//                               <FiPrinter />
//                               <span>Receipt</span>
//                             </button>

//                             <button
//                               type="button"
//                               className="rc-btn-action"
//                               onClick={() =>
//                                 openPaymentModal(
//                                   latestRepair
//                                 )
//                               }
//                               title="Update repair payment"
//                             >
//                               <FiCreditCard />
//                               <span>Payment</span>
//                             </button>

//                           </div>

//                         </td>

//                       </tr>
//                     );
//                   }
//                 )}

//               </tbody>

//             </table>

//           </div>
//         )}
//       </section>

//       {/* =================================================
//           NEW REPAIR INTAKE MODAL
//       ================================================= */}

//       {showAddForm && (
//         <div
//           className="rc-modal-overlay no-print"
//           onMouseDown={(e) =>
//             e.target === e.currentTarget &&
//             setShowAddForm(false)
//           }
//         >
//           <div className="rc-modal-box">

//             <div className="rc-modal-top">

//               <div>
//                 <span className="rc-eyebrow">
//                   Intake Form
//                 </span>

//                 <h2>
//                   New Repair Intake
//                 </h2>

//                 <p>
//                   Register client details,
//                   hardware model, and issue
//                   diagnosis.
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 className="rc-btn-close"
//                 onClick={() =>
//                   setShowAddForm(false)
//                 }
//               >
//                 <FiX />
//               </button>

//             </div>

//             <form
//               onSubmit={handleCreateRepair}
//               className="rc-form-stack"
//             >

//               <div className="rc-field-group">

//                 <span className="rc-group-title">
//                   Client Details
//                 </span>

//                 <div className="rc-grid-2">

//                   <div className="rc-input-field">
//                     <label>
//                       Customer Full Name{" "}
//                       <span>*</span>
//                     </label>

//                     <input
//                       type="text"
//                       name="customerName"
//                       value={form.customerName}
//                       onChange={handleChange}
//                       placeholder="e.g. Aarav Sharma"
//                       required
//                     />
//                   </div>

//                   <div className="rc-input-field">
//                     <label>
//                       Phone Number{" "}
//                       <span>*</span>
//                     </label>

//                     <input
//                       type="tel"
//                       name="customerPhone"
//                       value={form.customerPhone}
//                       onChange={handleChange}
//                       placeholder="e.g. 9876543210"
//                       required
//                     />
//                   </div>

//                 </div>

//                 <div
//                   className="rc-grid-2"
//                   style={{
//                     marginTop: "1rem",
//                   }}
//                 >

//                   <div className="rc-input-field">
//                     <label>
//                       Customer Email{" "}
//                       <span>*</span>
//                     </label>

//                     <input
//                       type="email"
//                       name="customerEmail"
//                       value={form.customerEmail}
//                       onChange={handleChange}
//                       placeholder="e.g. aarav@example.com"
//                       required
//                     />
//                   </div>

//                   <div className="rc-input-field">
//                     <label>
//                       Estimated Completion Date
//                     </label>

//                     <input
//                       type="date"
//                       name="estimatedCompletionDate"
//                       value={
//                         form.estimatedCompletionDate
//                       }
//                       onChange={handleChange}
//                     />
//                   </div>

//                 </div>

//               </div>

//               <div className="rc-field-group">

//                 <span className="rc-group-title">
//                   Device & Service Details
//                 </span>

//                 <div className="rc-grid-3">

//                   <div className="rc-input-field">
//                     <label>
//                       Device / Hardware Model{" "}
//                       <span>*</span>
//                     </label>

//                     <input
//                       type="text"
//                       name="deviceModel"
//                       value={form.deviceModel}
//                       onChange={handleChange}
//                       placeholder="e.g. ThinkPad E14 Gen 4"
//                       required
//                     />
//                   </div>

//                   <div className="rc-input-field">
//                     <label>
//                       Estimated Cost (₹)
//                     </label>

//                     <input
//                       type="number"
//                       name="repairCost"
//                       value={form.repairCost}
//                       onChange={handleChange}
//                       placeholder="0.00"
//                       min="0"
//                     />
//                   </div>

//                   <div className="rc-input-field">

//                     <label>
//                       Assign Workshop Tech
//                     </label>

//                     <select
//                       name="assignedTechnician"
//                       value={
//                         form.assignedTechnician
//                       }
//                       onChange={
//                         handleTechnicianChange
//                       }
//                       className="rc-select"
//                     >

//                       <option value="">
//                         -- Unassigned --
//                       </option>

//                       {technicians.map(
//                         (tech) => (
//                           <option
//                             key={tech._id}
//                             value={tech._id}
//                           >
//                             {resolveTechName(
//                               tech
//                             )}

//                             {tech.email
//                               ? ` (${tech.email})`
//                               : ""}
//                           </option>
//                         )
//                       )}

//                     </select>

//                   </div>

//                 </div>

//                 <div
//                   className="rc-input-field"
//                   style={{
//                     marginTop: "1rem",
//                   }}
//                 >

//                   <label>
//                     Reported Issue Description{" "}
//                     <span>*</span>
//                   </label>

//                   <textarea
//                     name="issueDescription"
//                     rows="3"
//                     value={
//                       form.issueDescription
//                     }
//                     onChange={handleChange}
//                     placeholder="Describe failure symptoms, errors, liquid contact, etc."
//                     required
//                   />

//                 </div>

//                 <div
//                   className="rc-input-field"
//                   style={{
//                     marginTop: "1rem",
//                   }}
//                 >

//                   <label>
//                     Front-Desk / Physical Remarks
//                   </label>

//                   <textarea
//                     name="remarks"
//                     rows="2"
//                     value={form.remarks}
//                     onChange={handleChange}
//                     placeholder="Physical scratches, original power adapter included, password received..."
//                   />

//                 </div>

//               </div>

//               <div className="rc-modal-footer">

//                 <button
//                   type="button"
//                   className="rc-btn rc-btn-secondary"
//                   onClick={() =>
//                     setShowAddForm(false)
//                   }
//                   disabled={submitting}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="rc-btn rc-btn-primary"
//                   disabled={submitting}
//                 >
//                   {submitting
//                     ? "Registering Job..."
//                     : "Register Repair Ticket"}
//                 </button>

//               </div>

//             </form>

//           </div>
//         </div>
//       )}

//       {/* =================================================
//           CUSTOMER TIMELINE MODAL
//       ================================================= */}

//       {selectedCustomer && (
//         <div
//           className="rc-modal-overlay no-print"
//           onMouseDown={(e) =>
//             e.target === e.currentTarget &&
//             setSelectedCustomer(null)
//           }
//         >

//           <div className="rc-modal-box rc-modal-large">

//             <div className="rc-modal-top">

//               <div>

//                 <span className="rc-eyebrow">
//                   Customer History
//                 </span>

//                 <h2>
//                   {selectedCustomer.customerName}
//                 </h2>

//                 <p>
//                   <FiPhone
//                     style={{
//                       verticalAlign:
//                         "middle",
//                     }}
//                   />{" "}
//                   {
//                     selectedCustomer.customerPhone
//                   }

//                   {selectedCustomer.customerEmail &&
//                     ` • ${selectedCustomer.customerEmail}`}
//                 </p>

//               </div>

//               <button
//                 type="button"
//                 className="rc-btn-close"
//                 onClick={() =>
//                   setSelectedCustomer(null)
//                 }
//               >
//                 <FiX />
//               </button>

//             </div>

//             <div className="rc-history-content">

//               <div className="rc-profile-badge">

//                 <div className="rc-avatar rc-avatar-lg">
//                   {selectedCustomer.customerName
//                     .charAt(0)
//                     .toUpperCase()}
//                 </div>

//                 <div>

//                   <h3>
//                     {
//                       selectedCustomer.customerName
//                     }
//                   </h3>

//                   <span>
//                     Total Repair History:{" "}
//                     {
//                       selectedCustomer.repairs
//                         .length
//                     }{" "}
//                     Job(s)
//                   </span>

//                 </div>

//               </div>

//               <h4 className="rc-timeline-heading">
//                 <FiClock />
//                 Workshop History Timeline
//               </h4>

//               <div className="rc-timeline-list">

//                 {selectedCustomer.repairs.map(
//                   (repair) => {

//                     const paymentStatus =
//                       getPaymentStatus(
//                         repair
//                       );

//                     return (
//                       <div
//                         className="rc-timeline-card"
//                         key={
//                           repair._id ||
//                           Math.random()
//                         }
//                       >

//                         <div className="rc-card-head">

//                           <strong className="rc-badge-ref">
//                             {
//                               repair.repairNumber ||
//                               "Ticket"
//                             }
//                           </strong>

//                           <div
//                             style={{
//                               display:
//                                 "flex",
//                               gap: "8px",
//                               alignItems:
//                                 "center",
//                               flexWrap:
//                                 "wrap",
//                             }}
//                           >

//                             <span
//                               className={`rc-status-pill ${getStatusClass(
//                                 repair.status
//                               )}`}
//                             >
//                               {getStatusLabel(
//                                 repair.status
//                               )}
//                             </span>

//                             <span
//                               className={`rc-payment-badge ${getPaymentStatusClass(
//                                 paymentStatus
//                               )}`}
//                               style={{
//                                 padding:
//                                   "5px 9px",
//                                 borderRadius:
//                                   "999px",
//                                 fontSize:
//                                   "11px",
//                                 fontWeight:
//                                   700,
//                               }}
//                             >
//                               {
//                                 getPaymentStatusLabel(
//                                   paymentStatus
//                                 )
//                               }
//                             </span>

//                           </div>

//                         </div>

//                         <div className="rc-grid-3 rc-meta-row">

//                           <div>
//                             <span className="rc-meta-lbl">
//                               <FiMonitor />
//                               Hardware
//                             </span>

//                             <strong className="rc-meta-txt">
//                               {
//                                 repair.deviceModel ||
//                                 repair.laptopModel ||
//                                 "N/A"
//                               }
//                             </strong>
//                           </div>

//                           <div>
//                             <span className="rc-meta-lbl">
//                               <FiUserCheck />
//                               Technician
//                             </span>

//                             <strong className="rc-meta-txt">
//                               {getTechnicianName(
//                                 repair
//                               )}
//                             </strong>
//                           </div>

//                           <div>
//                             <span className="rc-meta-lbl">
//                               {/* <FiDollarSign /> */}
//                               Repair Cost
//                             </span>

//                             <strong className="rc-meta-txt">
//                               ₹
//                               {getRepairCost(
//                                 repair
//                               ).toFixed(2)}
//                             </strong>
//                           </div>

//                         </div>

//                         {/* PAYMENT SUMMARY */}

//                         <div
//                           style={{
//                             display:
//                               "grid",
//                             gridTemplateColumns:
//                               "repeat(3, minmax(0, 1fr))",
//                             gap: "10px",
//                             marginTop:
//                               "12px",
//                             padding:
//                               "12px",
//                             borderRadius:
//                               "10px",
//                             background:
//                               "#f8fafc",
//                             border:
//                               "1px solid #e2e8f0",
//                           }}
//                         >

//                           <div>
//                             <small
//                               style={{
//                                 display:
//                                   "block",
//                                 color:
//                                   "#64748b",
//                               }}
//                             >
//                               Total
//                             </small>

//                             <strong>
//                               ₹
//                               {getRepairCost(
//                                 repair
//                               ).toFixed(2)}
//                             </strong>
//                           </div>

//                           <div>
//                             <small
//                               style={{
//                                 display:
//                                   "block",
//                                 color:
//                                   "#64748b",
//                               }}
//                             >
//                               Paid
//                             </small>

//                             <strong>
//                               ₹
//                               {getPaidAmount(
//                                 repair
//                               ).toFixed(2)}
//                             </strong>
//                           </div>

//                           <div>
//                             <small
//                               style={{
//                                 display:
//                                   "block",
//                                 color:
//                                   "#64748b",
//                               }}
//                             >
//                               Balance
//                             </small>

//                             <strong>
//                               ₹
//                               {getBalanceAmount(
//                                 repair
//                               ).toFixed(2)}
//                             </strong>
//                           </div>

//                         </div>

//                         {repair.paymentMethod && (
//                           <div
//                             style={{
//                               marginTop:
//                                 "8px",
//                               fontSize:
//                                 "12px",
//                               color:
//                                 "#475569",
//                             }}
//                           >
//                             Payment Method:{" "}
//                             <strong>
//                               {
//                                 repair.paymentMethod
//                               }
//                             </strong>

//                             {repair.paymentId
//                               ? ` • ${repair.paymentId}`
//                               : ""}
//                           </div>
//                         )}

//                         {repair.estimatedCompletionDate && (
//                           <div className="rc-date-row">
//                             <FiCalendar />
//                             Estimated Completion:{" "}
//                             {new Date(
//                               repair.estimatedCompletionDate
//                             ).toLocaleDateString()}
//                           </div>
//                         )}

//                         <div className="rc-note-card">

//                           <FiMessageSquare className="rc-note-ico" />

//                           <div>
//                             <strong>
//                               Problem Reported:
//                             </strong>

//                             <p>
//                               {
//                                 repair.issueDescription ||
//                                 "No issue details registered."
//                               }
//                             </p>
//                           </div>

//                         </div>

//                         {repair.remarks && (
//                           <div className="rc-note-card rc-note-muted">

//                             <div>
//                               <strong>
//                                 Intake Remarks:
//                               </strong>

//                               <p>
//                                 {
//                                   repair.remarks
//                                 }
//                               </p>
//                             </div>

//                           </div>
//                         )}

//                       </div>
//                     );
//                   }
//                 )}

//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* =================================================
//           PAYMENT MODAL
//       ================================================= */}

//       {selectedPaymentRepair && (
//         <div
//           className="rc-modal-overlay no-print"
//           style={{
//             zIndex: 1400,
//           }}
//           onMouseDown={(e) =>
//             e.target === e.currentTarget &&
//             setSelectedPaymentRepair(null)
//           }
//         >

//           <div
//             className="rc-modal-box"
//             style={{
//               maxWidth:
//                 "520px",
//             }}
//           >

//             <div className="rc-modal-top">

//               <div>

//                 <span className="rc-eyebrow">
//                   Repair Billing
//                 </span>

//                 <h2>
//                   Update Payment
//                 </h2>

//                 <p>
//                   {
//                     selectedPaymentRepair.repairNumber ||
//                     "Repair Ticket"
//                   }
//                 </p>

//               </div>

//               <button
//                 type="button"
//                 className="rc-btn-close"
//                 onClick={() =>
//                   setSelectedPaymentRepair(
//                     null
//                   )
//                 }
//               >
//                 <FiX />
//               </button>

//             </div>

//             <form
//               onSubmit={handleSavePayment}
//               className="rc-form-stack"
//             >

//               {/* BILL SUMMARY */}

//               <div
//                 style={{
//                   display:
//                     "grid",
//                   gridTemplateColumns:
//                     "repeat(3, 1fr)",
//                   gap: "10px",
//                 }}
//               >

//                 <div
//                   style={{
//                     padding:
//                       "12px",
//                     border:
//                       "1px solid #e2e8f0",
//                     borderRadius:
//                       "10px",
//                   }}
//                 >
//                   <small>
//                     Total
//                   </small>

//                   <strong
//                     style={{
//                       display:
//                         "block",
//                       marginTop:
//                         "4px",
//                     }}
//                   >
//                     ₹
//                     {getRepairCost(
//                       selectedPaymentRepair
//                     ).toFixed(2)}
//                   </strong>
//                 </div>

//                 <div
//                   style={{
//                     padding:
//                       "12px",
//                     border:
//                       "1px solid #e2e8f0",
//                     borderRadius:
//                       "10px",
//                   }}
//                 >
//                   <small>
//                     Already Paid
//                   </small>

//                   <strong
//                     style={{
//                       display:
//                         "block",
//                       marginTop:
//                         "4px",
//                     }}
//                   >
//                     ₹
//                     {getPaidAmount(
//                       selectedPaymentRepair
//                     ).toFixed(2)}
//                   </strong>
//                 </div>

//                 <div
//                   style={{
//                     padding:
//                       "12px",
//                     border:
//                       "1px solid #e2e8f0",
//                     borderRadius:
//                       "10px",
//                   }}
//                 >
//                   <small>
//                     Balance
//                   </small>

//                   <strong
//                     style={{
//                       display:
//                         "block",
//                       marginTop:
//                         "4px",
//                     }}
//                   >
//                     ₹
//                     {getBalanceAmount(
//                       selectedPaymentRepair
//                     ).toFixed(2)}
//                   </strong>
//                 </div>

//               </div>

//               {/* PAID AMOUNT */}

//               <div className="rc-input-field">

//                 <label>
//                   Paid Amount (₹){" "}
//                   <span>*</span>
//                 </label>

//                 <input
//                   type="number"
//                   name="paidAmount"
//                   value={
//                     paymentForm.paidAmount
//                   }
//                   onChange={
//                     handlePaymentChange
//                   }
//                   min="0"
//                   max={getRepairCost(
//                     selectedPaymentRepair
//                   )}
//                   step="0.01"
//                   placeholder="Enter paid amount"
//                   required
//                 />

//               </div>

//               {/* PAYMENT METHOD */}

//               <div className="rc-input-field">

//                 <label>
//                   Payment Method
//                 </label>

//                 <select
//                   name="paymentMethod"
//                   value={
//                     paymentForm.paymentMethod
//                   }
//                   onChange={
//                     handlePaymentChange
//                   }
//                   className="rc-select"
//                 >

//                   <option value="CASH">
//                     Cash
//                   </option>

//                   <option value="UPI">
//                     UPI
//                   </option>

//                   <option value="CARD">
//                     Card
//                   </option>

//                   <option value="BANK_TRANSFER">
//                     Bank Transfer
//                   </option>

//                   <option value="RAZORPAY">
//                     Razorpay
//                   </option>

//                   <option value="OTHER">
//                     Other
//                   </option>

//                 </select>

//               </div>

//               {/* PAYMENT ID */}

//               <div className="rc-input-field">

//                 <label>
//                   Payment / Transaction ID
//                 </label>

//                 <input
//                   type="text"
//                   name="paymentId"
//                   value={
//                     paymentForm.paymentId
//                   }
//                   onChange={
//                     handlePaymentChange
//                   }
//                   placeholder="UPI / transaction / reference ID"
//                 />

//               </div>

//               <div className="rc-modal-footer">

//                 <button
//                   type="button"
//                   className="rc-btn rc-btn-secondary"
//                   onClick={() =>
//                     setSelectedPaymentRepair(
//                       null
//                     )
//                   }
//                   disabled={
//                     paymentSubmitting
//                   }
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="rc-btn rc-btn-primary"
//                   disabled={
//                     paymentSubmitting
//                   }
//                 >
//                   <FiSave />

//                   {paymentSubmitting
//                     ? "Saving..."
//                     : "Save Payment"}
//                 </button>

//               </div>

//             </form>

//           </div>
//         </div>
//       )}

//       {/* =================================================
//           SERVICE DELIVERY INVOICE
//       ================================================= */}

//       {selectedInvoice && (
//         <div
//           className="rc-modal-overlay"
//           style={{
//             zIndex: 1250,
//           }}
//           onMouseDown={(e) =>
//             e.target === e.currentTarget &&
//             setSelectedInvoice(null)
//           }
//         >

//           <div className="rc-modal-box rc-receipt-modal-box">

//             <div className="rc-modal-top no-print">

//               <div>

//                 <span className="rc-eyebrow">
//                   Billing & Deliveries
//                 </span>

//                 <h2>
//                   Service Delivery Voucher
//                 </h2>

//                 <p>
//                   Official workshop repair
//                   diagnosis and bill summary
//                 </p>

//               </div>

//               <button
//                 type="button"
//                 className="rc-btn-close"
//                 onClick={() =>
//                   setSelectedInvoice(null)
//                 }
//               >
//                 <FiX />
//               </button>

//             </div>

//             <div
//               className="trh-invoice-sheet"
//               id="printable-receipt"
//             >

//               {/* INVOICE HEADER */}

//               <div className="invoice-header">

//                 <div>

//                   <h1 className="brand-title">
//                     ZAID INFOTECH
//                   </h1>

//                   <p className="brand-tagline">
//                     Premium Hardware Repairs,
//                     Micro-Soldering & IT
//                     Solutions
//                   </p>

//                 </div>

//                 <div className="invoice-badge-block">

//                   <h3>
//                     SERVICE RECEIPT
//                   </h3>

//                   <div>
//                     Ticket:{" "}
//                     <strong>
//                       {
//                         selectedInvoice.repairNumber ||
//                         selectedInvoice._id
//                           ?.slice(-6)
//                           .toUpperCase()
//                       }
//                     </strong>
//                   </div>

//                   <div>
//                     Date:{" "}
//                     {new Date(
//                       selectedInvoice.updatedAt ||
//                         selectedInvoice.createdAt ||
//                         Date.now()
//                     ).toLocaleDateString()}
//                   </div>

//                 </div>

//               </div>

//               {/* PARTIES */}

//               <div className="invoice-parties-grid">

//                 <div className="party-card">

//                   <span className="party-title">
//                     CUSTOMER DETAILS
//                   </span>

//                   <strong className="party-name">
//                     {
//                       selectedInvoice.customerName
//                     }
//                   </strong>

//                   <div className="party-sub">
//                     Phone:{" "}
//                     {
//                       selectedInvoice.customerPhone
//                     }
//                   </div>

//                   {selectedInvoice.customerEmail && (
//                     <div className="party-sub">
//                       Email:{" "}
//                       {
//                         selectedInvoice.customerEmail
//                       }
//                     </div>
//                   )}

//                 </div>

//                 <div className="party-card">

//                   <span className="party-title">
//                     HARDWARE REPAIRED
//                   </span>

//                   <strong className="party-name">
//                     {
//                       selectedInvoice.deviceModel ||
//                       selectedInvoice.laptopModel ||
//                       "Standard Device"
//                     }
//                   </strong>

//                   <div className="party-sub">
//                     Technician:{" "}
//                     {
//                       selectedInvoice.technicianName ||
//                       "Assigned Specialist"
//                     }
//                   </div>

//                   <div className="party-sub">
//                     Status:{" "}
//                     <span className="status-highlight">
//                       {
//                         selectedInvoice.status ||
//                         "Delivered"
//                       }
//                     </span>
//                   </div>

//                   <div className="party-sub">

//                     Payment:{" "}

//                     <strong>
//                       {getPaymentStatusLabel(
//                         getPaymentStatus(
//                           selectedInvoice
//                         )
//                       )}
//                     </strong>

//                   </div>

//                 </div>

//               </div>

//               {/* SERVICE TABLE */}

//               <div className="invoice-table-wrapper">

//                 <table className="invoice-data-table">

//                   <thead>

//                     <tr>

//                       <th>
//                         Service / Problem Breakdown
//                       </th>

//                       <th className="cell-right">
//                         Part (₹)
//                       </th>

//                       <th className="cell-right">
//                         Labor (₹)
//                       </th>

//                       <th className="cell-right">
//                         Total (₹)
//                       </th>

//                     </tr>

//                   </thead>

//                   <tbody>

//                     {Array.isArray(
//                       selectedInvoice.services
//                     ) &&
//                     selectedInvoice.services.length >
//                       0 ? (

//                       selectedInvoice.services.map(
//                         (srv, idx) => {

//                           const part =
//                             Number(
//                               srv.partCost || 0
//                             );

//                           const labor =
//                             Number(
//                               srv.laborCost || 0
//                             );

//                           const itemTotal =
//                             Number(
//                               srv.totalCost ??
//                                 part + labor
//                             );

//                           return (
//                             <tr key={idx}>

//                               <td>

//                                 <strong>
//                                   {
//                                     srv.serviceName ||
//                                     srv.name
//                                   }
//                                 </strong>

//                                 {srv.category && (
//                                   <span className="service-category-tag">
//                                     {
//                                       srv.category
//                                     }
//                                   </span>
//                                 )}

//                                 {idx === 0 &&
//                                   selectedInvoice.issueDescription && (
//                                     <p className="invoice-service-note">
//                                       Intake Issue:{" "}
//                                       {
//                                         selectedInvoice.issueDescription
//                                       }
//                                     </p>
//                                   )}

//                               </td>

//                               <td className="cell-right">
//                                 {part.toFixed(2)}
//                               </td>

//                               <td className="cell-right">
//                                 {labor.toFixed(2)}
//                               </td>

//                               <td className="cell-right">
//                                 {itemTotal.toFixed(
//                                   2
//                                 )}
//                               </td>

//                             </tr>
//                           );
//                         }
//                       )

//                     ) : (

//                       <tr>

//                         <td>

//                           <strong>
//                             Repair Diagnostics &
//                             Technician Service
//                           </strong>

//                           <p className="invoice-service-note">
//                             {
//                               selectedInvoice.issueDescription ||
//                               "General Hardware Issue"
//                             }
//                           </p>

//                         </td>

//                         <td className="cell-right">
//                           {Number(
//                             selectedInvoice.partCost ||
//                               0
//                           ).toFixed(2)}
//                         </td>

//                         <td className="cell-right">
//                           {Number(
//                             selectedInvoice.laborCost ??
//                               (
//                                 Number(
//                                   selectedInvoice.repairCost ||
//                                     0
//                                 ) -
//                                 Number(
//                                   selectedInvoice.partCost ||
//                                     0
//                                 )
//                               )
//                           ).toFixed(2)}
//                         </td>

//                         <td className="cell-right">
//                           {Number(
//                             selectedInvoice.repairCost ||
//                               0
//                           ).toFixed(2)}
//                         </td>

//                       </tr>

//                     )}

//                     {selectedInvoice.remarks && (
//                       <tr className="remarks-row">

//                         <td colSpan={3}>
//                           <em>
//                             Intake Remarks:{" "}
//                             {
//                               selectedInvoice.remarks
//                             }
//                           </em>
//                         </td>

//                         <td className="cell-right">
//                           —
//                         </td>

//                       </tr>
//                     )}

//                   </tbody>

//                   {/* =================================================
//                       PAYMENT TOTALS
//                   ================================================= */}

//                   <tfoot>

//                     <tr>

//                       <th
//                         colSpan={3}
//                         className="cell-right grand-total-label"
//                       >
//                         Total Amount:
//                       </th>

//                       <th className="cell-right grand-total-val">
//                         ₹
//                         {getRepairCost(
//                           selectedInvoice
//                         ).toFixed(2)}
//                       </th>

//                     </tr>

//                     <tr>

//                       <th
//                         colSpan={3}
//                         className="cell-right"
//                       >
//                         Paid Amount:
//                       </th>

//                       <th className="cell-right">
//                         ₹
//                         {getPaidAmount(
//                           selectedInvoice
//                         ).toFixed(2)}
//                       </th>

//                     </tr>

//                     <tr>

//                       <th
//                         colSpan={3}
//                         className="cell-right"
//                       >
//                         Balance Due:
//                       </th>

//                       <th className="cell-right">
//                         ₹
//                         {getBalanceAmount(
//                           selectedInvoice
//                         ).toFixed(2)}
//                       </th>

//                     </tr>

//                     <tr>

//                       <th
//                         colSpan={3}
//                         className="cell-right"
//                       >
//                         Payment Status:
//                       </th>

//                       <th className="cell-right">

//                         {getPaymentStatusLabel(
//                           getPaymentStatus(
//                             selectedInvoice
//                           )
//                         )}

//                       </th>

//                     </tr>

//                   </tfoot>

//                 </table>

//               </div>

//               {/* PAYMENT INFORMATION */}

//               <div
//                 style={{
//                   marginTop: "18px",
//                   padding: "14px",
//                   border:
//                     "1px solid #e2e8f0",
//                   borderRadius: "8px",
//                 }}
//               >

//                 <strong>
//                   PAYMENT INFORMATION
//                 </strong>

//                 <div
//                   style={{
//                     display:
//                       "grid",
//                     gridTemplateColumns:
//                       "repeat(3, 1fr)",
//                     gap: "12px",
//                     marginTop:
//                       "10px",
//                   }}
//                 >

//                   <div>
//                     <small>
//                       Method
//                     </small>

//                     <div>
//                       {
//                         selectedInvoice.paymentMethod ||
//                         "Not Recorded"
//                       }
//                     </div>
//                   </div>

//                   <div>
//                     <small>
//                       Transaction ID
//                     </small>

//                     <div>
//                       {
//                         selectedInvoice.paymentId ||
//                         "N/A"
//                       }
//                     </div>
//                   </div>

//                   <div>
//                     <small>
//                       Paid At
//                     </small>

//                     <div>
//                       {selectedInvoice.paidAt
//                         ? new Date(
//                             selectedInvoice.paidAt
//                           ).toLocaleString()
//                         : "N/A"}
//                     </div>
//                   </div>

//                 </div>

//               </div>

//               {/* FOOTER */}

//               <div className="invoice-footer-clause">

//                 <p>
//                   Thank you for choosing
//                   Zaid Infotech.
//                 </p>

//                 <p>
//                   30 Days service warranty
//                   applies on replaced
//                   components and verified
//                   service repairs.
//                 </p>

//               </div>

//             </div>

//             <div className="rc-modal-footer no-print">

//               <button
//                 type="button"
//                 className="rc-btn rc-btn-secondary"
//                 onClick={() =>
//                   setSelectedInvoice(null)
//                 }
//               >
//                 Close
//               </button>

//               <button
//                 type="button"
//                 className="rc-btn rc-btn-primary"
//                 onClick={handlePrint}
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
// };

// export default RepairCustomer;


import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiPlus,
  FiUser,
  FiPhone,
  FiTool,
  FiClock,
  FiCheckCircle,
  FiX,
  FiRefreshCw,
  FiEye,
  FiMonitor,
  FiMessageSquare,
  FiUserCheck,
  FiInbox,
  FiCalendar,
  FiPrinter,
  FiCreditCard,
  FiSave,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { toast } from "react-toastify";
import "./RepairCustomer.css";

// =====================================================
// API
// =====================================================

const API_URL = import.meta.env.VITE_API_URL;

const BASE_URL = `${API_URL}/newRepair`;
const TECHNICIAN_URL = `${API_URL}/newRepair/technicians`;

// =====================================================
// RUPEE FORMATTER
// =====================================================

const formatRupees = (value) => {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// =====================================================
// INITIAL FORM
// =====================================================

const initialForm = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  deviceModel: "",
  issueDescription: "",
  estimatedCompletionDate: "",
  repairCost: "",
  technicianName: "",
  assignedTechnician: "",
  remarks: "",
};

// =====================================================
// PAYMENT FORM
// =====================================================

const initialPaymentForm = {
  paidAmount: "",
  paymentMethod: "CASH",
  paymentId: "",
};

// =====================================================
// COMPONENT
// =====================================================

const RepairCustomer = () => {
  const [repairs, setRepairs] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showAddForm, setShowAddForm] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [selectedPaymentRepair, setSelectedPaymentRepair] =
    useState(null);

  const [form, setForm] = useState(initialForm);
  const [paymentForm, setPaymentForm] =
    useState(initialPaymentForm);

  // ===================================================
  // AUTH CONFIG
  // ===================================================

  const getAuthConfig = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // ===================================================
  // TECHNICIAN NAME
  // ===================================================

  const resolveTechName = (techOrId) => {
    if (!techOrId) return "Unassigned";

    if (
      typeof techOrId === "string" &&
      !techOrId.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return techOrId;
    }

    const techObj =
      typeof techOrId === "object"
        ? techOrId
        : technicians.find((t) => t._id === techOrId);

    if (!techObj) return "Unassigned";

    const full =
      `${techObj.firstName || ""} ${techObj.lastName || ""}`.trim();

    return (
      full ||
      techObj.name ||
      techObj.fullName ||
      techObj.username ||
      "Technician"
    );
  };

  const getTechnicianName = (repair) =>
    resolveTechName(
      repair?.assignedTechnician || repair?.technicianName
    );

  // ===================================================
  // PAYMENT HELPERS
  // ===================================================

  const getRepairCost = (repair) => {
    return Math.max(Number(repair?.repairCost || 0), 0);
  };

  const getPaidAmount = (repair) => {
    const paid = Number(repair?.paidAmount || 0);
    const total = getRepairCost(repair);

    return Math.min(Math.max(paid, 0), total);
  };

  const getBalanceAmount = (repair) => {
    const total = getRepairCost(repair);
    const paid = getPaidAmount(repair);

    if (
      repair?.balanceAmount !== undefined &&
      repair?.balanceAmount !== null
    ) {
      return Math.max(
        Number(repair.balanceAmount || 0),
        0
      );
    }

    return Math.max(total - paid, 0);
  };

  const getPaymentStatus = (repair) => {
    const total = getRepairCost(repair);
    const paid = getPaidAmount(repair);

    const rawStatus = String(
      repair?.paymentStatus || ""
    ).toUpperCase();

    if (rawStatus === "REFUNDED") return "REFUNDED";
    if (rawStatus === "FAILED") return "FAILED";

    if (total <= 0) {
      return rawStatus || "PENDING";
    }

    if (paid >= total) {
      return "PAID";
    }

    if (paid > 0) {
      return "PARTIAL";
    }

    return "PENDING";
  };

  const getPaymentStatusClass = (status) => {
    switch (String(status || "").toUpperCase()) {
      case "PAID":
        return "rc-payment-paid";

      case "PARTIAL":
        return "rc-payment-partial";

      case "FAILED":
        return "rc-payment-failed";

      case "REFUNDED":
        return "rc-payment-refunded";

      default:
        return "rc-payment-pending";
    }
  };

  const getPaymentStatusLabel = (status) => {
    return String(status || "PENDING")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // ===================================================
  // FETCH REPAIRS
  // ===================================================

  const fetchRepairs = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/`,
        getAuthConfig()
      );

      const data =
        res.data?.repairs ||
        res.data?.data ||
        (Array.isArray(res.data) ? res.data : []);

      setRepairs(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to load repairs"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // FETCH TECHNICIANS
  // ===================================================

  const fetchTechnicians = async () => {
    try {
      const res = await axios.get(
        TECHNICIAN_URL,
        getAuthConfig()
      );

      const data =
        res.data?.technicians ||
        res.data?.data ||
        (Array.isArray(res.data) ? res.data : []);

      setTechnicians(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to load technicians"
      );
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchRepairs();
    fetchTechnicians();
  }, []);

  // ===================================================
  // FORM CHANGE
  // ===================================================

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // ===================================================
  // TECHNICIAN CHANGE
  // ===================================================

  const handleTechnicianChange = (e) => {
    const id = e.target.value;

    setForm((previous) => ({
      ...previous,
      assignedTechnician: id,
      technicianName: id
        ? resolveTechName(id)
        : "",
    }));
  };

  // ===================================================
  // CREATE REPAIR
  // ===================================================

  const handleCreateRepair = async (e) => {
    e.preventDefault();

    if (
      !form.customerName.trim() ||
      !form.customerPhone.trim() ||
      !form.customerEmail.trim() ||
      !form.deviceModel.trim() ||
      !form.issueDescription.trim()
    ) {
      return toast.error(
        "Please fill in all mandatory fields."
      );
    }

    try {
      setSubmitting(true);

      const payload = {
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        customerEmail: form.customerEmail.trim(),
        deviceModel: form.deviceModel.trim(),
        issueDescription:
          form.issueDescription.trim(),

        estimatedCompletionDate:
          form.estimatedCompletionDate || undefined,

        repairCost: form.repairCost
          ? Number(form.repairCost)
          : 0,

        technicianName:
          form.technicianName.trim(),

        assignedTechnician:
          form.assignedTechnician || null,

        remarks: form.remarks.trim(),
      };

      const res = await axios.post(
        `${BASE_URL}/request`,
        payload,
        getAuthConfig()
      );

      toast.success(
        res.data?.message ||
          "Repair created successfully"
      );

      setShowAddForm(false);
      setForm(initialForm);

      await fetchRepairs();
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        "Failed to create repair ticket";

      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // ===================================================
  // CUSTOMERS GROUPING
  // ===================================================

  const customers = useMemo(() => {
    const map = new Map();

    repairs.forEach((repair) => {
      if (!repair.customerPhone) return;

      if (!map.has(repair.customerPhone)) {
        map.set(repair.customerPhone, {
          customerName:
            repair.customerName ||
            "Unknown Customer",

          customerPhone:
            repair.customerPhone,

          customerEmail:
            repair.customerEmail || "",

          repairs: [],
        });
      }

      map
        .get(repair.customerPhone)
        .repairs.push(repair);
    });

    return Array.from(map.values());
  }, [repairs]);

  // ===================================================
  // FILTERED CUSTOMERS
  // ===================================================

  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase().trim();

    return customers.filter((customer) => {
      const matchSearch =
        !q ||
        customer.customerName
          .toLowerCase()
          .includes(q) ||
        customer.customerPhone
          .toLowerCase()
          .includes(q) ||
        (customer.customerEmail &&
          customer.customerEmail
            .toLowerCase()
            .includes(q)) ||
        customer.repairs.some((repair) =>
          [
            repair.repairNumber,
            repair.deviceModel,
            getTechnicianName(repair),
          ].some((value) =>
            String(value || "")
              .toLowerCase()
              .includes(q)
          )
        );

      const matchStatus =
        statusFilter === "ALL" ||
        customer.repairs.some(
          (repair) =>
            String(repair.status || "")
              .toLowerCase() ===
            statusFilter.toLowerCase()
        );

      return matchSearch && matchStatus;
    });
  }, [
    customers,
    search,
    statusFilter,
    technicians,
  ]);

  // ===================================================
  // LATEST REPAIR
  // ===================================================

  const getLatestRepair = (customer) =>
    customer.repairs.length
      ? [...customer.repairs].sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        )[0]
      : null;

  // ===================================================
  // STATUS HELPERS
  // ===================================================

  const getStatusClass = (status) =>
    status
      ? `rc-status-${String(status)
          .toLowerCase()
          .replaceAll(" ", "-")}`
      : "rc-status-default";

  const getStatusLabel = (status) =>
    status
      ? String(status)
          .replaceAll("_", " ")
          .replace(
            /\b\w/g,
            (letter) => letter.toUpperCase()
          )
      : "Received";

  // ===================================================
  // OPEN RECEIPT
  // ===================================================

  const openReceipt = (
    repairItem,
    fallbackCustomer = {}
  ) => {
    if (!repairItem) return;

    setSelectedInvoice({
      ...repairItem,

      customerName:
        repairItem.customerName ||
        fallbackCustomer.customerName ||
        "Customer",

      customerPhone:
        repairItem.customerPhone ||
        fallbackCustomer.customerPhone ||
        "N/A",

      customerEmail:
        repairItem.customerEmail ||
        fallbackCustomer.customerEmail ||
        "",

      technicianName:
        getTechnicianName(repairItem),
    });
  };

  // ===================================================
  // OPEN PAYMENT MODAL
  // ===================================================

  const openPaymentModal = (repair) => {
    if (!repair) return;

    const paid = getPaidAmount(repair);
    const balance = getBalanceAmount(repair);

    setSelectedPaymentRepair(repair);

    setPaymentForm({
      paidAmount:
        balance > 0
          ? String(balance)
          : String(paid),

      paymentMethod:
        repair.paymentMethod || "CASH",

      paymentId:
        repair.paymentId || "",
    });
  };

  // ===================================================
  // PAYMENT FORM CHANGE
  // ===================================================

  const handlePaymentChange = (e) => {
    setPaymentForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // ===================================================
  // SAVE PAYMENT
  // ===================================================

  const handleSavePayment = async (e) => {
    e.preventDefault();

    if (!selectedPaymentRepair?._id) {
      toast.error("Repair ID is missing.");
      return;
    }

    const total = getRepairCost(
      selectedPaymentRepair
    );

    const paidAmount = Number(
      paymentForm.paidAmount
    );

    if (!Number.isFinite(paidAmount)) {
      toast.error(
        "Please enter a valid paid amount."
      );
      return;
    }

    if (paidAmount < 0) {
      toast.error(
        "Paid amount cannot be negative."
      );
      return;
    }

    if (paidAmount > total) {
      toast.error(
        `Paid amount cannot exceed repair cost ${formatRupees(
          total
        )}.`
      );
      return;
    }

    try {
      setPaymentSubmitting(true);

      const res = await axios.patch(
        `${BASE_URL}/${selectedPaymentRepair._id}/payment`,
        {
          paidAmount,
          paymentMethod:
            paymentForm.paymentMethod,
          paymentId:
            paymentForm.paymentId.trim(),
        },
        getAuthConfig()
      );

      toast.success(
        res.data?.message ||
          "Repair payment updated successfully."
      );

      setSelectedPaymentRepair(null);
      setPaymentForm(initialPaymentForm);

      await fetchRepairs();

      // Refresh selected invoice if it is open
      if (
        selectedInvoice?._id ===
        selectedPaymentRepair._id
      ) {
        setSelectedInvoice(null);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update repair payment."
      );
    } finally {
      setPaymentSubmitting(false);
    }
  };

  // ===================================================
  // PRINT
  // ===================================================

  const handlePrint = () => {
    window.print();
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="rc-dashboard">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="rc-header no-print">
        <div className="rc-header-titles">
          <span className="rc-eyebrow">
            Repair Operations
          </span>

          <h1>Repair Service Registry</h1>

          <p>
            Monitor customer equipment intake,
            workshop assignments, and job tickets.
          </p>
        </div>

        <button
          type="button"
          className="rc-btn rc-btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <FiPlus />
          <span>New Repair Job</span>
        </button>
      </header>

      {/* =================================================
          STATS
      ================================================= */}

      <section className="rc-stats-grid no-print">

        <div className="rc-stat-card">
          <div className="rc-stat-icon rc-icon-blue">
            <FiUser />
          </div>

          <div className="rc-stat-info">
            <span className="rc-stat-label">
              Total Customers
            </span>

            <strong className="rc-stat-val">
              {customers.length}
            </strong>
          </div>
        </div>

        <div className="rc-stat-card">
          <div className="rc-stat-icon rc-icon-purple">
            <FiTool />
          </div>

          <div className="rc-stat-info">
            <span className="rc-stat-label">
              Total Repairs
            </span>

            <strong className="rc-stat-val">
              {repairs.length}
            </strong>
          </div>
        </div>

        <div className="rc-stat-card">
          <div className="rc-stat-icon rc-icon-amber">
            <FiClock />
          </div>

          <div className="rc-stat-info">
            <span className="rc-stat-label">
              Pending / Received
            </span>

            <strong className="rc-stat-val">
              {
                repairs.filter(
                  (repair) =>
                    !repair.status ||
                    String(
                      repair.status
                    ).toLowerCase() ===
                      "received"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="rc-stat-card">
          <div className="rc-stat-icon rc-icon-emerald">
            <FiCheckCircle />
          </div>

          <div className="rc-stat-info">
            <span className="rc-stat-label">
              Delivered & Closed
            </span>

            <strong className="rc-stat-val">
              {
                repairs.filter((repair) =>
                  [
                    "delivered",
                    "completed",
                  ].includes(
                    String(
                      repair.status
                    ).toLowerCase()
                  )
                ).length
              }
            </strong>
          </div>
        </div>

      </section>

      {/* =================================================
          DIRECTORY
      ================================================= */}

      <section className="rc-main-card no-print">

        <div className="rc-card-toolbar">

          <div className="rc-search-wrap">
            <FiSearch className="rc-search-ico" />

            <input
              type="text"
              placeholder="Search customer, phone, device, ticket..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="rc-btn-clear"
                onClick={() => setSearch("")}
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="rc-toolbar-actions">

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rc-select"
            >
              <option value="ALL">
                All Statuses
              </option>

              <option value="Received">
                Received
              </option>

              <option value="Assigned">
                Assigned
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Waiting for Parts">
                Waiting for Parts
              </option>

              <option value="Ready for Delivery">
                Ready for Delivery
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>

            <button
              type="button"
              className="rc-btn rc-btn-secondary"
              onClick={fetchRepairs}
              disabled={loading}
            >
              <FiRefreshCw
                className={
                  loading ? "rc-spin" : ""
                }
              />

              <span>Sync</span>
            </button>

          </div>
        </div>

        {loading ? (
          <div className="rc-state-box">
            <div className="rc-spinner"></div>
            <p>
              Loading database records...
            </p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="rc-state-box">
            <div className="rc-empty-ico">
              <FiInbox />
            </div>

            <h3>
              No Customer Records Found
            </h3>

            <p>
              Adjust your search filters or
              register a new repair ticket.
            </p>

            <button
              type="button"
              className="rc-btn rc-btn-primary"
              onClick={() =>
                setShowAddForm(true)
              }
            >
              <FiPlus />
              New Ticket
            </button>
          </div>
        ) : (
          <div className="rc-table-scroll">

            <table className="rc-table">

              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact Info</th>
                  <th>Workloads</th>
                  <th>Latest Ticket</th>
                  <th>Assigned Tech</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th className="rc-th-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

                {filteredCustomers.map(
                  (customer) => {

                    const latestRepair =
                      getLatestRepair(
                        customer
                      );

                    const paymentStatus =
                      getPaymentStatus(
                        latestRepair
                      );

                    return (
                      <tr
                        key={
                          customer.customerPhone
                        }
                      >

                        {/* CUSTOMER */}

                        <td>
                          <div className="rc-cell-user">

                            <div className="rc-avatar">
                              {customer.customerName
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {
                                  customer.customerName
                                }
                              </strong>

                              <span>
                                Client ID:{" "}
                                {customer.customerPhone.slice(
                                  -4
                                )}
                              </span>
                            </div>

                          </div>
                        </td>

                        {/* CONTACT */}

                        <td>
                          <div className="rc-contact-block">

                            <span className="rc-phone-chip">
                              <FiPhone />
                              {
                                customer.customerPhone
                              }
                            </span>

                            {customer.customerEmail && (
                              <span className="rc-email-sub">
                                {
                                  customer.customerEmail
                                }
                              </span>
                            )}

                          </div>
                        </td>

                        {/* WORKLOAD */}

                        <td>
                          <span className="rc-badge-count">
                            {
                              customer.repairs.length
                            }{" "}
                            {
                              customer.repairs.length ===
                              1
                                ? "Job"
                                : "Jobs"
                            }
                          </span>
                        </td>

                        {/* TICKET */}

                        <td>
                          <div className="rc-ticket-col">

                            <span className="rc-ticket-id">
                              {
                                latestRepair?.repairNumber ||
                                "TICKET-NEW"
                              }
                            </span>

                            <span className="rc-device-tag">
                              {
                                latestRepair?.deviceModel ||
                                latestRepair?.laptopModel ||
                                "Standard Device"
                              }
                            </span>

                          </div>
                        </td>

                        {/* TECHNICIAN */}

                        <td>
                          <span className="rc-tech-tag">
                            <FiUserCheck />
                            {getTechnicianName(
                              latestRepair
                            )}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className={`rc-status-pill ${getStatusClass(
                              latestRepair?.status
                            )}`}
                          >
                            {getStatusLabel(
                              latestRepair?.status
                            )}
                          </span>
                        </td>

                        {/* PAYMENT */}

                        <td>

                          <div
                            style={{
                              display: "flex",
                              flexDirection:
                                "column",
                              gap: "5px",
                              minWidth:
                                "100px",
                            }}
                          >

                            <span
                              className={`rc-payment-badge ${getPaymentStatusClass(
                                paymentStatus
                              )}`}
                              style={{
                                display:
                                  "inline-flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                                padding:
                                  "5px 8px",
                                borderRadius:
                                  "999px",
                                fontSize:
                                  "11px",
                                fontWeight: 700,
                              }}
                            >
                              {
                                getPaymentStatusLabel(
                                  paymentStatus
                                )
                              }
                            </span>

                            <small
                              style={{
                                fontSize:
                                  "11px",
                                color:
                                  "#64748b",
                              }}
                            >
                              Paid{" "}
                              {formatRupees(
                                getPaidAmount(
                                  latestRepair
                                )
                              )}
                            </small>

                            <small
                              style={{
                                fontSize:
                                  "11px",
                                color:
                                  "#64748b",
                              }}
                            >
                              Due{" "}
                              {formatRupees(
                                getBalanceAmount(
                                  latestRepair
                                )
                              )}
                            </small>

                          </div>

                        </td>

                        {/* ACTION */}

                        <td className="rc-td-right">

                          <div className="rc-table-actions-group">

                            <button
                              type="button"
                              className="rc-btn-action"
                              onClick={() =>
                                setSelectedCustomer(
                                  customer
                                )
                              }
                              title="View customer timeline & history"
                            >
                              <FiEye />
                              <span>View</span>
                            </button>

                            <button
                              type="button"
                              className="rc-btn-action rc-btn-receipt"
                              onClick={() =>
                                openReceipt(
                                  latestRepair,
                                  customer
                                )
                              }
                              title="View and print invoice receipt"
                            >
                              <FiPrinter />
                              <span>Receipt</span>
                            </button>

                            <button
                              type="button"
                              className="rc-btn-action"
                              onClick={() =>
                                openPaymentModal(
                                  latestRepair
                                )
                              }
                              title="Update repair payment"
                            >
                              <FiCreditCard />
                              <span>Payment</span>
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}
      </section>

      {/* =================================================
          NEW REPAIR INTAKE MODAL
      ================================================= */}

      {showAddForm && (
        <div
          className="rc-modal-overlay no-print"
          onMouseDown={(e) =>
            e.target === e.currentTarget &&
            setShowAddForm(false)
          }
        >
          <div className="rc-modal-box">

            <div className="rc-modal-top">

              <div>
                <span className="rc-eyebrow">
                  Intake Form
                </span>

                <h2>
                  New Repair Intake
                </h2>

                <p>
                  Register client details,
                  hardware model, and issue
                  diagnosis.
                </p>
              </div>

              <button
                type="button"
                className="rc-btn-close"
                onClick={() =>
                  setShowAddForm(false)
                }
              >
                <FiX />
              </button>

            </div>

            <form
              onSubmit={handleCreateRepair}
              className="rc-form-stack"
            >

              <div className="rc-field-group">

                <span className="rc-group-title">
                  Client Details
                </span>

                <div className="rc-grid-2">

                  <div className="rc-input-field">
                    <label>
                      Customer Full Name{" "}
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="customerName"
                      value={form.customerName}
                      onChange={handleChange}
                      placeholder="e.g. Aarav Sharma"
                      required
                    />
                  </div>

                  <div className="rc-input-field">
                    <label>
                      Phone Number{" "}
                      <span>*</span>
                    </label>

                    <input
                      type="tel"
                      name="customerPhone"
                      value={form.customerPhone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      required
                    />
                  </div>

                </div>

                <div
                  className="rc-grid-2"
                  style={{
                    marginTop: "1rem",
                  }}
                >

                  <div className="rc-input-field">
                    <label>
                      Customer Email{" "}
                      <span>*</span>
                    </label>

                    <input
                      type="email"
                      name="customerEmail"
                      value={form.customerEmail}
                      onChange={handleChange}
                      placeholder="e.g. aarav@example.com"
                      required
                    />
                  </div>

                  <div className="rc-input-field">
                    <label>
                      Estimated Completion Date
                    </label>

                    <input
                      type="date"
                      name="estimatedCompletionDate"
                      value={
                        form.estimatedCompletionDate
                      }
                      onChange={handleChange}
                    />
                  </div>

                </div>

              </div>

              <div className="rc-field-group">

                <span className="rc-group-title">
                  Device & Service Details
                </span>

                <div className="rc-grid-3">

                  <div className="rc-input-field">
                    <label>
                      Device / Hardware Model{" "}
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="deviceModel"
                      value={form.deviceModel}
                      onChange={handleChange}
                      placeholder="e.g. ThinkPad E14 Gen 4"
                      required
                    />
                  </div>

                  <div className="rc-input-field">
                    <label>
                      Estimated Cost (₹)
                    </label>

                    <input
                      type="number"
                      name="repairCost"
                      value={form.repairCost}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="rc-input-field">

                    <label>
                      Assign Workshop Tech
                    </label>

                    <select
                      name="assignedTechnician"
                      value={
                        form.assignedTechnician
                      }
                      onChange={
                        handleTechnicianChange
                      }
                      className="rc-select"
                    >

                      <option value="">
                        -- Unassigned --
                      </option>

                      {technicians.map(
                        (tech) => (
                          <option
                            key={tech._id}
                            value={tech._id}
                          >
                            {resolveTechName(
                              tech
                            )}

                            {tech.email
                              ? ` (${tech.email})`
                              : ""}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                </div>

                <div
                  className="rc-input-field"
                  style={{
                    marginTop: "1rem",
                  }}
                >

                  <label>
                    Reported Issue Description{" "}
                    <span>*</span>
                  </label>

                  <textarea
                    name="issueDescription"
                    rows="3"
                    value={
                      form.issueDescription
                    }
                    onChange={handleChange}
                    placeholder="Describe failure symptoms, errors, liquid contact, etc."
                    required
                  />

                </div>

                <div
                  className="rc-input-field"
                  style={{
                    marginTop: "1rem",
                  }}
                >

                  <label>
                    Front-Desk / Physical Remarks
                  </label>

                  <textarea
                    name="remarks"
                    rows="2"
                    value={form.remarks}
                    onChange={handleChange}
                    placeholder="Physical scratches, original power adapter included, password received..."
                  />

                </div>

              </div>

              <div className="rc-modal-footer">

                <button
                  type="button"
                  className="rc-btn rc-btn-secondary"
                  onClick={() =>
                    setShowAddForm(false)
                  }
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rc-btn rc-btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? "Registering Job..."
                    : "Register Repair Ticket"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* =================================================
          CUSTOMER TIMELINE MODAL
      ================================================= */}

      {selectedCustomer && (
        <div
          className="rc-modal-overlay no-print"
          onMouseDown={(e) =>
            e.target === e.currentTarget &&
            setSelectedCustomer(null)
          }
        >

          <div className="rc-modal-box rc-modal-large">

            <div className="rc-modal-top">

              <div>

                <span className="rc-eyebrow">
                  Customer History
                </span>

                <h2>
                  {selectedCustomer.customerName}
                </h2>

                <p>
                  <FiPhone
                    style={{
                      verticalAlign:
                        "middle",
                    }}
                  />{" "}
                  {
                    selectedCustomer.customerPhone
                  }

                  {selectedCustomer.customerEmail &&
                    ` • ${selectedCustomer.customerEmail}`}
                </p>

              </div>

              <button
                type="button"
                className="rc-btn-close"
                onClick={() =>
                  setSelectedCustomer(null)
                }
              >
                <FiX />
              </button>

            </div>

            <div className="rc-history-content">

              <div className="rc-profile-badge">

                <div className="rc-avatar rc-avatar-lg">
                  {selectedCustomer.customerName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>

                  <h3>
                    {
                      selectedCustomer.customerName
                    }
                  </h3>

                  <span>
                    Total Repair History:{" "}
                    {
                      selectedCustomer.repairs
                        .length
                    }{" "}
                    Job(s)
                  </span>

                </div>

              </div>

              <h4 className="rc-timeline-heading">
                <FiClock />
                Workshop History Timeline
              </h4>

              <div className="rc-timeline-list">

                {selectedCustomer.repairs.map(
                  (repair) => {

                    const paymentStatus =
                      getPaymentStatus(
                        repair
                      );

                    return (
                      <div
                        className="rc-timeline-card"
                        key={
                          repair._id ||
                          Math.random()
                        }
                      >

                        <div className="rc-card-head">

                          <strong className="rc-badge-ref">
                            {
                              repair.repairNumber ||
                              "Ticket"
                            }
                          </strong>

                          <div
                            style={{
                              display:
                                "flex",
                              gap: "8px",
                              alignItems:
                                "center",
                              flexWrap:
                                "wrap",
                            }}
                          >

                            <span
                              className={`rc-status-pill ${getStatusClass(
                                repair.status
                              )}`}
                            >
                              {getStatusLabel(
                                repair.status
                              )}
                            </span>

                            <span
                              className={`rc-payment-badge ${getPaymentStatusClass(
                                paymentStatus
                              )}`}
                              style={{
                                padding:
                                  "5px 9px",
                                borderRadius:
                                  "999px",
                                fontSize:
                                  "11px",
                                fontWeight:
                                  700,
                              }}
                            >
                              {
                                getPaymentStatusLabel(
                                  paymentStatus
                                )
                              }
                            </span>

                          </div>

                        </div>

                        <div className="rc-grid-3 rc-meta-row">

                          <div>
                            <span className="rc-meta-lbl">
                              <FiMonitor />
                              Hardware
                            </span>

                            <strong className="rc-meta-txt">
                              {
                                repair.deviceModel ||
                                repair.laptopModel ||
                                "N/A"
                              }
                            </strong>
                          </div>

                          <div>
                            <span className="rc-meta-lbl">
                              <FiUserCheck />
                              Technician
                            </span>

                            <strong className="rc-meta-txt">
                              {getTechnicianName(
                                repair
                              )}
                            </strong>
                          </div>

                          <div>
                            <span className="rc-meta-lbl">
                              <FaRupeeSign />
                              Repair Cost
                            </span>

                            <strong className="rc-meta-txt">
                              {formatRupees(
                                getRepairCost(
                                  repair
                                )
                              )}
                            </strong>
                          </div>

                        </div>

                        {/* PAYMENT SUMMARY */}

                        <div
                          style={{
                            display:
                              "grid",
                            gridTemplateColumns:
                              "repeat(3, minmax(0, 1fr))",
                            gap: "10px",
                            marginTop:
                              "12px",
                            padding:
                              "12px",
                            borderRadius:
                              "10px",
                            background:
                              "#f8fafc",
                            border:
                              "1px solid #e2e8f0",
                          }}
                        >

                          <div>
                            <small
                              style={{
                                display:
                                  "block",
                                color:
                                  "#64748b",
                              }}
                            >
                              Total
                            </small>

                            <strong>
                              {formatRupees(
                                getRepairCost(
                                  repair
                                )
                              )}
                            </strong>
                          </div>

                          <div>
                            <small
                              style={{
                                display:
                                  "block",
                                color:
                                  "#64748b",
                              }}
                            >
                              Paid
                            </small>

                            <strong>
                              {formatRupees(
                                getPaidAmount(
                                  repair
                                )
                              )}
                            </strong>
                          </div>

                          <div>
                            <small
                              style={{
                                display:
                                  "block",
                                color:
                                  "#64748b",
                              }}
                            >
                              Balance
                            </small>

                            <strong>
                              {formatRupees(
                                getBalanceAmount(
                                  repair
                                )
                              )}
                            </strong>
                          </div>

                        </div>

                        {repair.paymentMethod && (
                          <div
                            style={{
                              marginTop:
                                "8px",
                              fontSize:
                                "12px",
                              color:
                                "#475569",
                            }}
                          >
                            Payment Method:{" "}
                            <strong>
                              {
                                repair.paymentMethod
                              }
                            </strong>

                            {repair.paymentId
                              ? ` • ${repair.paymentId}`
                              : ""}
                          </div>
                        )}

                        {repair.estimatedCompletionDate && (
                          <div className="rc-date-row">
                            <FiCalendar />
                            Estimated Completion:{" "}
                            {new Date(
                              repair.estimatedCompletionDate
                            ).toLocaleDateString()}
                          </div>
                        )}

                        <div className="rc-note-card">

                          <FiMessageSquare className="rc-note-ico" />

                          <div>
                            <strong>
                              Problem Reported:
                            </strong>

                            <p>
                              {
                                repair.issueDescription ||
                                "No issue details registered."
                              }
                            </p>
                          </div>

                        </div>

                        {repair.remarks && (
                          <div className="rc-note-card rc-note-muted">

                            <div>
                              <strong>
                                Intake Remarks:
                              </strong>

                              <p>
                                {
                                  repair.remarks
                                }
                              </p>
                            </div>

                          </div>
                        )}

                      </div>
                    );
                  }
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          PAYMENT MODAL
      ================================================= */}

      {selectedPaymentRepair && (
        <div
          className="rc-modal-overlay no-print"
          style={{
            zIndex: 1400,
          }}
          onMouseDown={(e) =>
            e.target === e.currentTarget &&
            setSelectedPaymentRepair(null)
          }
        >

          <div
            className="rc-modal-box"
            style={{
              maxWidth:
                "520px",
            }}
          >

            <div className="rc-modal-top">

              <div>

                <span className="rc-eyebrow">
                  Repair Billing
                </span>

                <h2>
                  Update Payment
                </h2>

                <p>
                  {
                    selectedPaymentRepair.repairNumber ||
                    "Repair Ticket"
                  }
                </p>

              </div>

              <button
                type="button"
                className="rc-btn-close"
                onClick={() =>
                  setSelectedPaymentRepair(
                    null
                  )
                }
              >
                <FiX />
              </button>

            </div>

            <form
              onSubmit={handleSavePayment}
              className="rc-form-stack"
            >

              {/* BILL SUMMARY */}

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(3, 1fr)",
                  gap: "10px",
                }}
              >

                <div
                  style={{
                    padding:
                      "12px",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius:
                      "10px",
                  }}
                >
                  <small>
                    Total
                  </small>

                  <strong
                    style={{
                      display:
                        "block",
                      marginTop:
                        "4px",
                    }}
                  >
                    {formatRupees(
                      getRepairCost(
                        selectedPaymentRepair
                      )
                    )}
                  </strong>
                </div>

                <div
                  style={{
                    padding:
                      "12px",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius:
                      "10px",
                  }}
                >
                  <small>
                    Already Paid
                  </small>

                  <strong
                    style={{
                      display:
                        "block",
                      marginTop:
                        "4px",
                    }}
                  >
                    {formatRupees(
                      getPaidAmount(
                        selectedPaymentRepair
                      )
                    )}
                  </strong>
                </div>

                <div
                  style={{
                    padding:
                      "12px",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius:
                      "10px",
                  }}
                >
                  <small>
                    Balance
                  </small>

                  <strong
                    style={{
                      display:
                        "block",
                      marginTop:
                        "4px",
                    }}
                  >
                    {formatRupees(
                      getBalanceAmount(
                        selectedPaymentRepair
                      )
                    )}
                  </strong>
                </div>

              </div>

              {/* PAID AMOUNT */}

              <div className="rc-input-field">

                <label>
                  Paid Amount (₹){" "}
                  <span>*</span>
                </label>

                <input
                  type="number"
                  name="paidAmount"
                  value={
                    paymentForm.paidAmount
                  }
                  onChange={
                    handlePaymentChange
                  }
                  min="0"
                  max={getRepairCost(
                    selectedPaymentRepair
                  )}
                  step="0.01"
                  placeholder="Enter paid amount"
                  required
                />

              </div>

              {/* PAYMENT METHOD */}

              <div className="rc-input-field">

                <label>
                  Payment Method
                </label>

                <select
                  name="paymentMethod"
                  value={
                    paymentForm.paymentMethod
                  }
                  onChange={
                    handlePaymentChange
                  }
                  className="rc-select"
                >

                  <option value="CASH">
                    Cash
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="CARD">
                    Card
                  </option>

                  <option value="BANK_TRANSFER">
                    Bank Transfer
                  </option>

                  <option value="RAZORPAY">
                    Razorpay
                  </option>

                  <option value="OTHER">
                    Other
                  </option>

                </select>

              </div>

              {/* PAYMENT ID */}

              <div className="rc-input-field">

                <label>
                  Payment / Transaction ID
                </label>

                <input
                  type="text"
                  name="paymentId"
                  value={
                    paymentForm.paymentId
                  }
                  onChange={
                    handlePaymentChange
                  }
                  placeholder="UPI / transaction / reference ID"
                />

              </div>

              <div className="rc-modal-footer">

                <button
                  type="button"
                  className="rc-btn rc-btn-secondary"
                  onClick={() =>
                    setSelectedPaymentRepair(
                      null
                    )
                  }
                  disabled={
                    paymentSubmitting
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rc-btn rc-btn-primary"
                  disabled={
                    paymentSubmitting
                  }
                >
                  <FiSave />

                  {paymentSubmitting
                    ? "Saving..."
                    : "Save Payment"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* =================================================
          SERVICE DELIVERY INVOICE
      ================================================= */}

      {selectedInvoice && (
        <div
          className="rc-modal-overlay"
          style={{
            zIndex: 1250,
          }}
          onMouseDown={(e) =>
            e.target === e.currentTarget &&
            setSelectedInvoice(null)
          }
        >

          <div className="rc-modal-box rc-receipt-modal-box">

            <div className="rc-modal-top no-print">

              <div>

                <span className="rc-eyebrow">
                  Billing & Deliveries
                </span>

                <h2>
                  Service Delivery Voucher
                </h2>

                <p>
                  Official workshop repair
                  diagnosis and bill summary
                </p>

              </div>

              <button
                type="button"
                className="rc-btn-close"
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

              {/* INVOICE HEADER */}

              <div className="invoice-header">

                <div>

                  <h1 className="brand-title">
                    ZAID INFOTECH
                  </h1>

                  <p className="brand-tagline">
                    Premium Hardware Repairs,
                    Micro-Soldering & IT
                    Solutions
                  </p>

                </div>

                <div className="invoice-badge-block">

                  <h3>
                    SERVICE RECEIPT
                  </h3>

                  <div>
                    Ticket:{" "}
                    <strong>
                      {
                        selectedInvoice.repairNumber ||
                        selectedInvoice._id
                          ?.slice(-6)
                          .toUpperCase()
                      }
                    </strong>
                  </div>

                  <div>
                    Date:{" "}
                    {new Date(
                      selectedInvoice.updatedAt ||
                        selectedInvoice.createdAt ||
                        Date.now()
                    ).toLocaleDateString()}
                  </div>

                </div>

              </div>

              {/* PARTIES */}

              <div className="invoice-parties-grid">

                <div className="party-card">

                  <span className="party-title">
                    CUSTOMER DETAILS
                  </span>

                  <strong className="party-name">
                    {
                      selectedInvoice.customerName
                    }
                  </strong>

                  <div className="party-sub">
                    Phone:{" "}
                    {
                      selectedInvoice.customerPhone
                    }
                  </div>

                  {selectedInvoice.customerEmail && (
                    <div className="party-sub">
                      Email:{" "}
                      {
                        selectedInvoice.customerEmail
                      }
                    </div>
                  )}

                </div>

                <div className="party-card">

                  <span className="party-title">
                    HARDWARE REPAIRED
                  </span>

                  <strong className="party-name">
                    {
                      selectedInvoice.deviceModel ||
                      selectedInvoice.laptopModel ||
                      "Standard Device"
                    }
                  </strong>

                  <div className="party-sub">
                    Technician:{" "}
                    {
                      selectedInvoice.technicianName ||
                      "Assigned Specialist"
                    }
                  </div>

                  <div className="party-sub">
                    Status:{" "}
                    <span className="status-highlight">
                      {
                        selectedInvoice.status ||
                        "Delivered"
                      }
                    </span>
                  </div>

                  <div className="party-sub">

                    Payment:{" "}

                    <strong>
                      {getPaymentStatusLabel(
                        getPaymentStatus(
                          selectedInvoice
                        )
                      )}
                    </strong>

                  </div>

                </div>

              </div>

              {/* SERVICE TABLE */}

              <div className="invoice-table-wrapper">

                <table className="invoice-data-table">

                  <thead>

                    <tr>

                      <th>
                        Service / Problem Breakdown
                      </th>

                      <th className="cell-right">
                        Part (₹)
                      </th>

                      <th className="cell-right">
                        Labor (₹)
                      </th>

                      <th className="cell-right">
                        Total (₹)
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {Array.isArray(
                      selectedInvoice.services
                    ) &&
                    selectedInvoice.services.length >
                      0 ? (

                      selectedInvoice.services.map(
                        (srv, idx) => {

                          const part =
                            Number(
                              srv.partCost || 0
                            );

                          const labor =
                            Number(
                              srv.laborCost || 0
                            );

                          const itemTotal =
                            Number(
                              srv.totalCost ??
                                part + labor
                            );

                          return (
                            <tr key={idx}>

                              <td>

                                <strong>
                                  {
                                    srv.serviceName ||
                                    srv.name
                                  }
                                </strong>

                                {srv.category && (
                                  <span className="service-category-tag">
                                    {
                                      srv.category
                                    }
                                  </span>
                                )}

                                {idx === 0 &&
                                  selectedInvoice.issueDescription && (
                                    <p className="invoice-service-note">
                                      Intake Issue:{" "}
                                      {
                                        selectedInvoice.issueDescription
                                      }
                                    </p>
                                  )}

                              </td>

                              <td className="cell-right">
                                {formatRupees(part)}
                              </td>

                              <td className="cell-right">
                                {formatRupees(labor)}
                              </td>

                              <td className="cell-right">
                                {formatRupees(itemTotal)}
                              </td>

                            </tr>
                          );
                        }
                      )

                    ) : (

                      <tr>

                        <td>

                          <strong>
                            Repair Diagnostics &
                            Technician Service
                          </strong>

                          <p className="invoice-service-note">
                            {
                              selectedInvoice.issueDescription ||
                              "General Hardware Issue"
                            }
                          </p>

                        </td>

                        <td className="cell-right">
                          {formatRupees(
                            Number(
                              selectedInvoice.partCost ||
                                0
                            )
                          )}
                        </td>

                        <td className="cell-right">
                          {formatRupees(
                            Number(
                              selectedInvoice.laborCost ??
                                (
                                  Number(
                                    selectedInvoice.repairCost ||
                                      0
                                  ) -
                                  Number(
                                    selectedInvoice.partCost ||
                                      0
                                  )
                                )
                            )
                          )}
                        </td>

                        <td className="cell-right">
                          {formatRupees(
                            Number(
                              selectedInvoice.repairCost ||
                                0
                            )
                          )}
                        </td>

                      </tr>

                    )}

                    {selectedInvoice.remarks && (
                      <tr className="remarks-row">

                        <td colSpan={3}>
                          <em>
                            Intake Remarks:{" "}
                            {
                              selectedInvoice.remarks
                            }
                          </em>
                        </td>

                        <td className="cell-right">
                          —
                        </td>

                      </tr>
                    )}

                  </tbody>

                  {/* =================================================
                      PAYMENT TOTALS
                  ================================================= */}

                  <tfoot>

                    <tr>

                      <th
                        colSpan={3}
                        className="cell-right grand-total-label"
                      >
                        Total Amount:
                      </th>

                      <th className="cell-right grand-total-val">
                        {formatRupees(
                          getRepairCost(
                            selectedInvoice
                          )
                        )}
                      </th>

                    </tr>

                    <tr>

                      <th
                        colSpan={3}
                        className="cell-right"
                      >
                        Paid Amount:
                      </th>

                      <th className="cell-right">
                        {formatRupees(
                          getPaidAmount(
                            selectedInvoice
                          )
                        )}
                      </th>

                    </tr>

                    <tr>

                      <th
                        colSpan={3}
                        className="cell-right"
                      >
                        Balance Due:
                      </th>

                      <th className="cell-right">
                        {formatRupees(
                          getBalanceAmount(
                            selectedInvoice
                          )
                        )}
                      </th>

                    </tr>

                    <tr>

                      <th
                        colSpan={3}
                        className="cell-right"
                      >
                        Payment Status:
                      </th>

                      <th className="cell-right">

                        {getPaymentStatusLabel(
                          getPaymentStatus(
                            selectedInvoice
                          )
                        )}

                      </th>

                    </tr>

                  </tfoot>

                </table>

              </div>

              {/* PAYMENT INFORMATION */}

              <div
                style={{
                  marginTop: "18px",
                  padding: "14px",
                  border:
                    "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              >

                <strong>
                  PAYMENT INFORMATION
                </strong>

                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "repeat(3, 1fr)",
                    gap: "12px",
                    marginTop:
                      "10px",
                  }}
                >

                  <div>
                    <small>
                      Method
                    </small>

                    <div>
                      {
                        selectedInvoice.paymentMethod ||
                        "Not Recorded"
                      }
                    </div>
                  </div>

                  <div>
                    <small>
                      Transaction ID
                    </small>

                    <div>
                      {
                        selectedInvoice.paymentId ||
                        "N/A"
                      }
                    </div>
                  </div>

                  <div>
                    <small>
                      Paid At
                    </small>

                    <div>
                      {selectedInvoice.paidAt
                        ? new Date(
                            selectedInvoice.paidAt
                          ).toLocaleString()
                        : "N/A"}
                    </div>
                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="invoice-footer-clause">

                <p>
                  Thank you for choosing
                  Zaid Infotech.
                </p>

                <p>
                  30 Days service warranty
                  applies on replaced
                  components and verified
                  service repairs.
                </p>

              </div>

            </div>

            <div className="rc-modal-footer no-print">

              <button
                type="button"
                className="rc-btn rc-btn-secondary"
                onClick={() =>
                  setSelectedInvoice(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="rc-btn rc-btn-primary"
                onClick={handlePrint}
              >
                <FiPrinter />
                Print Voucher
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default RepairCustomer;