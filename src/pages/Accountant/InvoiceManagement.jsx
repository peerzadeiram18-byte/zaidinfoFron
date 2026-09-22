// import React, {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   Search,
//   RefreshCw,
//   Eye,
//   FileText,
//   ShoppingBag,
//   Wrench,
//   Laptop,
//   X,
//   IndianRupee,
//   Store,
//   Globe,
// } from "lucide-react";

// import {
//   getAllInvoices,
//   getInvoiceById,
// } from "../../services/accountantInvoiceService";

// import { toast } from "react-toastify";

// const InvoiceManagement = () => {
//   // =========================================================
//   // STATE
//   // =========================================================

//   const [invoices, setInvoices] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");

//   const [typeFilter, setTypeFilter] = useState("ALL");

//   const [statusFilter, setStatusFilter] = useState("ALL");

//   const [selectedInvoice, setSelectedInvoice] =
//     useState(null);

//   const [detailLoading, setDetailLoading] =
//     useState(false);

//   // =========================================================
//   // LOAD INVOICES
//   // =========================================================

//   const loadInvoices = async () => {
//     try {
//       setLoading(true);

//       const response = await getAllInvoices();

//       /*
//        * Supports different API response structures:
//        *
//        * {
//        *   data: [...]
//        * }
//        *
//        * {
//        *   invoices: [...]
//        * }
//        *
//        * [...]
//        */

//       const data =
//         response?.data ||
//         response?.invoices ||
//         response ||
//         [];

//       setInvoices(
//         Array.isArray(data) ? data : []
//       );
//     } catch (error) {
//       console.error(
//         "Load invoices error:",
//         error
//       );

//       toast.error(
//         error?.response?.data?.message ||
//           "Failed to load invoices"
//       );

//       setInvoices([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadInvoices();
//   }, []);

//   // =========================================================
//   // MONEY
//   // =========================================================

//   const money = (amount) => {
//     return new Intl.NumberFormat(
//       "en-IN",
//       {
//         style: "currency",
//         currency: "INR",
//         maximumFractionDigits: 2,
//       }
//     ).format(Number(amount || 0));
//   };

//   // =========================================================
//   // DATE
//   // =========================================================

//   const formatDate = (value) => {
//     if (!value) return "-";

//     const parsed = new Date(value);

//     if (Number.isNaN(parsed.getTime())) {
//       return "-";
//     }

//     return parsed.toLocaleDateString(
//       "en-IN",
//       {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       }
//     );
//   };

//   // =========================================================
//   // INVOICE SOURCE
//   //
//   // This is the important part.
//   //
//   // It tries multiple possible backend fields so that
//   // existing invoices also work.
//   // =========================================================

//   const getInvoiceSource = (invoice) => {
//     if (!invoice) {
//       return {
//         type: "OTHER",
//         label: "OTHER",
//         subLabel: "Invoice",
//       };
//     }

//     const invoiceFor = String(
//       invoice?.invoiceFor || ""
//     )
//       .trim()
//       .toUpperCase();

//     const source = String(
//       invoice?.source ||
//         invoice?.invoiceSource ||
//         invoice?.orderType ||
//         invoice?.saleSource ||
//         invoice?.salesSource ||
//         ""
//     )
//       .trim()
//       .toUpperCase();

//     const paymentSource = String(
//       invoice?.paymentSource || ""
//     )
//       .trim()
//       .toUpperCase();

//     // =====================================================
//     // RENTAL
//     // =====================================================

//     if (
//       invoiceFor === "RENTAL" ||
//       source === "RENTAL" ||
//       invoice?.rentalId ||
//       invoice?.rentalProductId
//     ) {
//       return {
//         type: "RENTAL",
//         label: "RENTAL",
//         subLabel: "Rental Invoice",
//       };
//     }

//     // =====================================================
//     // REPAIR
//     // =====================================================

//     if (
//       invoiceFor === "REPAIR" ||
//       source === "REPAIR" ||
//       invoice?.repairId ||
//       invoice?.repairRequestId
//     ) {
//       return {
//         type: "REPAIR",
//         label: "REPAIR",
//         subLabel: "Repair Invoice",
//       };
//     }

//     // =====================================================
//     // WALK-IN / OFFLINE / COUNTER SALE
//     // =====================================================

//     if (
//       source === "WALK_IN" ||
//       source === "WALKIN" ||
//       source === "OFFLINE" ||
//       source === "COUNTER" ||
//       source === "POS" ||
//       source === "STORE" ||
//       source === "IN_STORE" ||
//       source === "INSTORE" ||
//       invoice?.walkIn === true ||
//       invoice?.isWalkIn === true ||
//       invoice?.walkInSale === true
//     ) {
//       return {
//         type: "WALK_IN",
//         label: "WALK-IN SALE",
//         subLabel: "Counter / Store Sale",
//       };
//     }

//     // =====================================================
//     // ONLINE / E-COMMERCE SALE
//     // =====================================================

//     if (
//       source === "ONLINE" ||
//       source === "ECOMMERCE" ||
//       source === "E_COMMERCE" ||
//       source === "E-COMMERCE" ||
//       paymentSource === "ONLINE" ||
//       invoice?.orderId
//     ) {
//       return {
//         type: "ONLINE",
//         label: "ONLINE SALE",
//         subLabel: "E-Commerce Order",
//       };
//     }

//     // =====================================================
//     // invoiceFor ORDER / SALE
//     //
//     // If there is no source information but invoiceFor is
//     // ORDER/SALE, don't incorrectly call it walk-in.
//     // Treat it as ONLINE because these are normally
//     // e-commerce/order invoices in your current structure.
//     // =====================================================

//     if (
//       invoiceFor === "ORDER" ||
//       invoiceFor === "SALE" ||
//       invoiceFor === "ECOMMERCE" ||
//       invoiceFor === "E_COMMERCE"
//     ) {
//       return {
//         type: "ONLINE",
//         label: "ONLINE SALE",
//         subLabel: "E-Commerce Order",
//       };
//     }

//     // =====================================================
//     // FALLBACK
//     // =====================================================

//     return {
//       type: "OTHER",
//       label:
//         invoiceFor ||
//         source ||
//         "OTHER",
//       subLabel: "Invoice",
//     };
//   };

//   // =========================================================
//   // PAYMENT STATUS
//   // =========================================================

//   const getInvoiceStatus = (invoice) => {
//     return String(
//       invoice?.paymentStatus ||
//         invoice?.status ||
//         "PENDING"
//     )
//       .trim()
//       .toUpperCase();
//   };

//   // =========================================================
//   // CUSTOMER NAME
//   // =========================================================

//   const customerName = (invoice) => {
//     if (
//       invoice?.billingAddress
//         ?.fullName
//     ) {
//       return invoice.billingAddress.fullName;
//     }

//     if (
//       invoice?.customerName
//     ) {
//       return invoice.customerName;
//     }

//     if (
//       invoice?.user &&
//       typeof invoice.user === "object"
//     ) {
//       return (
//         `${invoice.user.firstName || ""} ${
//           invoice.user.lastName || ""
//         }`.trim() ||
//         invoice.user.name ||
//         invoice.user.email ||
//         "Customer"
//       );
//     }

//     if (
//       invoice?.customer &&
//       typeof invoice.customer === "object"
//     ) {
//       return (
//         `${invoice.customer.firstName || ""} ${
//           invoice.customer.lastName || ""
//         }`.trim() ||
//         invoice.customer.name ||
//         invoice.customer.email ||
//         "Customer"
//       );
//     }

//     return "Customer";
//   };

//   // =========================================================
//   // PHONE
//   // =========================================================

//   const customerPhone = (invoice) => {
//     return (
//       invoice?.billingAddress?.phone ||
//       invoice?.customerPhone ||
//       invoice?.user?.phone ||
//       invoice?.customer?.phone ||
//       "-"
//     );
//   };

//   // =========================================================
//   // SOURCE ICON
//   // =========================================================

//   const sourceIcon = (type) => {
//     switch (type) {
//       case "RENTAL":
//         return (
//           <Laptop
//             size={18}
//             className="text-purple-600"
//           />
//         );

//       case "REPAIR":
//         return (
//           <Wrench
//             size={18}
//             className="text-orange-600"
//           />
//         );

//       case "WALK_IN":
//         return (
//           <Store
//             size={18}
//             className="text-blue-600"
//           />
//         );

//       case "ONLINE":
//         return (
//           <Globe
//             size={18}
//             className="text-green-600"
//           />
//         );

//       default:
//         return (
//           <ShoppingBag size={18} />
//         );
//     }
//   };

//   // =========================================================
//   // SOURCE BADGE
//   // =========================================================

//   const sourceClass = (type) => {
//     switch (type) {
//       case "RENTAL":
//         return "bg-purple-100 text-purple-700";

//       case "REPAIR":
//         return "bg-orange-100 text-orange-700";

//       case "WALK_IN":
//         return "bg-blue-100 text-blue-700";

//       case "ONLINE":
//         return "bg-green-100 text-green-700";

//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   // =========================================================
//   // STATUS CLASS
//   // =========================================================

//   const statusClass = (status) => {
//     if (
//       status === "PAID" ||
//       status === "SUCCESS" ||
//       status === "COMPLETED"
//     ) {
//       return "bg-green-100 text-green-700";
//     }

//     if (status === "PARTIAL") {
//       return "bg-blue-100 text-blue-700";
//     }

//     if (status === "REFUNDED") {
//       return "bg-purple-100 text-purple-700";
//     }

//     if (
//       status === "CANCELLED" ||
//       status === "FAILED"
//     ) {
//       return "bg-red-100 text-red-700";
//     }

//     return "bg-yellow-100 text-yellow-700";
//   };

//   // =========================================================
//   // FILTERED INVOICES
//   // =========================================================

//   const filteredInvoices = useMemo(() => {
//     return invoices.filter((invoice) => {
//       const invoiceSource =
//         getInvoiceSource(invoice);

//       const type =
//         invoiceSource.type;

//       const status =
//         getInvoiceStatus(invoice);

//       const customer =
//         customerName(invoice);

//       const searchText =
//         search.trim().toLowerCase();

//       const invoiceNumber =
//         String(
//           invoice?.invoiceNumber || ""
//         ).toLowerCase();

//       const referenceId =
//         String(
//           invoice?.referenceId || ""
//         ).toLowerCase();

//       const orderId =
//         String(
//           invoice?.orderId || ""
//         ).toLowerCase();

//       const rentalId =
//         String(
//           invoice?.rentalId || ""
//         ).toLowerCase();

//       const matchesSearch =
//         !searchText ||
//         invoiceNumber.includes(
//           searchText
//         ) ||
//         customer
//           .toLowerCase()
//           .includes(searchText) ||
//         referenceId.includes(
//           searchText
//         ) ||
//         orderId.includes(searchText) ||
//         rentalId.includes(searchText);

//       return (
//         matchesSearch &&
//         (typeFilter === "ALL" ||
//           type === typeFilter) &&
//         (statusFilter === "ALL" ||
//           status === statusFilter)
//       );
//     });
//   }, [
//     invoices,
//     search,
//     typeFilter,
//     statusFilter,
//   ]);

//   // =========================================================
//   // SUMMARY
//   // =========================================================

//   const summary = useMemo(() => {
//     return {
//       total: invoices.length,

//       online: invoices.filter(
//         (invoice) =>
//           getInvoiceSource(invoice)
//             .type === "ONLINE"
//       ).length,

//       walkIn: invoices.filter(
//         (invoice) =>
//           getInvoiceSource(invoice)
//             .type === "WALK_IN"
//       ).length,

//       repair: invoices.filter(
//         (invoice) =>
//           getInvoiceSource(invoice)
//             .type === "REPAIR"
//       ).length,

//       rental: invoices.filter(
//         (invoice) =>
//           getInvoiceSource(invoice)
//             .type === "RENTAL"
//       ).length,

//       unpaid: invoices.filter(
//         (invoice) =>
//           getInvoiceStatus(invoice) ===
//           "PENDING"
//       ).length,
//     };
//   }, [invoices]);

//   // =========================================================
//   // OPEN INVOICE
//   // =========================================================

//   const openInvoice = async (invoice) => {
//     try {
//       setDetailLoading(true);

//       const response =
//         await getInvoiceById(
//           invoice._id
//         );

//       const data =
//         response?.data ||
//         response?.invoice ||
//         response;

//       setSelectedInvoice(data);
//     } catch (error) {
//       console.error(
//         "Open invoice error:",
//         error
//       );

//       toast.error(
//         error?.response?.data?.message ||
//           "Unable to load invoice"
//       );
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   // =========================================================
//   // RENDER
//   // =========================================================

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">

//       {/* =====================================================
//           HEADER
//       ===================================================== */}

//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//             Invoice Management
//           </h1>

//           <p className="text-gray-500 mt-1">
//             Manage online, walk-in, repair and rental invoices.
//           </p>
//         </div>

//         <button
//           onClick={loadInvoices}
//           disabled={loading}
//           className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-60"
//         >
//           <RefreshCw
//             size={17}
//             className={
//               loading
//                 ? "animate-spin"
//                 : ""
//             }
//           />

//           Refresh
//         </button>
//       </div>

//       {/* =====================================================
//           SUMMARY
//       ===================================================== */}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">

//         <Card
//           title="Total Invoices"
//           value={summary.total}
//           icon={
//             <FileText size={21} />
//           }
//         />

//         <Card
//           title="Online Sales"
//           value={summary.online}
//           icon={
//             <Globe
//               size={21}
//               className="text-green-600"
//             />
//           }
//         />

//         <Card
//           title="Walk-In Sales"
//           value={summary.walkIn}
//           icon={
//             <Store
//               size={21}
//               className="text-blue-600"
//             />
//           }
//         />

//         <Card
//           title="Repair"
//           value={summary.repair}
//           icon={
//             <Wrench
//               size={21}
//               className="text-orange-600"
//             />
//           }
//         />

//         <Card
//           title="Rental"
//           value={summary.rental}
//           icon={
//             <Laptop
//               size={21}
//               className="text-purple-600"
//             />
//           }
//         />

//         <Card
//           title="Unpaid"
//           value={summary.unpaid}
//           icon={
//             <IndianRupee
//               size={21}
//             />
//           }
//         />

//       </div>

//       {/* =====================================================
//           FILTERS
//       ===================================================== */}

//       <div className="bg-white border shadow-sm rounded-xl p-4 mb-5">

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

//           {/* SEARCH */}

//           <div className="relative">

//             <Search
//               size={18}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />

//             <input
//               value={search}
//               onChange={(e) =>
//                 setSearch(
//                   e.target.value
//                 )
//               }
//               placeholder="Search invoice/customer/order..."
//               className="w-full border rounded-lg pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
//             />

//           </div>

//           {/* TYPE */}

//           <select
//             value={typeFilter}
//             onChange={(e) =>
//               setTypeFilter(
//                 e.target.value
//               )
//             }
//             className="border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
//           >

//             <option value="ALL">
//               All Invoice Sources
//             </option>

//             <option value="ONLINE">
//               Online Sales
//             </option>

//             <option value="WALK_IN">
//               Walk-In Sales
//             </option>

//             <option value="REPAIR">
//               Repair
//             </option>

//             <option value="RENTAL">
//               Rental
//             </option>

//             <option value="OTHER">
//               Other
//             </option>

//           </select>

//           {/* STATUS */}

//           <select
//             value={statusFilter}
//             onChange={(e) =>
//               setStatusFilter(
//                 e.target.value
//               )
//             }
//             className="border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
//           >

//             <option value="ALL">
//               All Payment Status
//             </option>

//             <option value="PAID">
//               Paid
//             </option>

//             <option value="PENDING">
//               Pending
//             </option>

//             <option value="PARTIAL">
//               Partial
//             </option>

//             <option value="REFUNDED">
//               Refunded
//             </option>

//             <option value="FAILED">
//               Failed
//             </option>

//           </select>

//         </div>
//       </div>

//       {/* =====================================================
//           TABLE
//       ===================================================== */}

//       <div className="bg-white border shadow-sm rounded-xl overflow-hidden">

//         <div className="overflow-x-auto">

//           <table className="w-full min-w-[1250px]">

//             <thead className="bg-gray-100">

//               <tr>

//                 <th className="text-left px-4 py-3">
//                   Invoice
//                 </th>

//                 <th className="text-left px-4 py-3">
//                   Customer
//                 </th>

//                 <th className="text-left px-4 py-3">
//                   Source
//                 </th>

//                 <th className="text-left px-4 py-3">
//                   Reference
//                 </th>

//                 <th className="text-left px-4 py-3">
//                   Total
//                 </th>

//                 <th className="text-left px-4 py-3">
//                   Paid
//                 </th>

//                 <th className="text-left px-4 py-3">
//                   Balance
//                 </th>

//                 <th className="text-left px-4 py-3">
//                   Status
//                 </th>

//                 <th className="text-left px-4 py-3">
//                   Date
//                 </th>

//                 <th className="text-right px-4 py-3">
//                   Action
//                 </th>

//               </tr>

//             </thead>

//             <tbody>

//               {loading ? (

//                 <tr>

//                   <td
//                     colSpan="10"
//                     className="text-center py-12 text-gray-500"
//                   >
//                     Loading invoices...
//                   </td>

//                 </tr>

//               ) : filteredInvoices.length === 0 ? (

//                 <tr>

//                   <td
//                     colSpan="10"
//                     className="text-center py-12 text-gray-500"
//                   >
//                     No invoices found.
//                   </td>

//                 </tr>

//               ) : (

//                 filteredInvoices.map(
//                   (invoice) => {

//                     // IMPORTANT:
//                     // source is calculated INSIDE map
//                     // so it is available for this row.

//                     const invoiceSource =
//                       getInvoiceSource(
//                         invoice
//                       );

//                     const type =
//                       invoiceSource.type;

//                     const status =
//                       getInvoiceStatus(
//                         invoice
//                       );

//                     const reference =
//                       invoice?.orderId ||
//                       invoice?.rentalId ||
//                       invoice?.repairId ||
//                       invoice?.referenceId ||
//                       "-";

//                     return (

//                       <tr
//                         key={
//                           invoice._id
//                         }
//                         className="border-t hover:bg-gray-50"
//                       >

//                         {/* INVOICE */}

//                         <td className="px-4 py-4">

//                           <div className="font-semibold text-gray-800">
//                             {
//                               invoice.invoiceNumber ||
//                               "-"
//                             }
//                           </div>

//                           <div className="text-xs text-gray-500 mt-1">
//                             ID:{" "}
//                             {
//                               invoice._id
//                             }
//                           </div>

//                         </td>

//                         {/* CUSTOMER */}

//                         <td className="px-4 py-4">

//                           <div className="font-medium">
//                             {
//                               customerName(
//                                 invoice
//                               )
//                             }
//                           </div>

//                           <div className="text-xs text-gray-500 mt-1">
//                             {
//                               customerPhone(
//                                 invoice
//                               )
//                             }
//                           </div>

//                         </td>

//                         {/* SOURCE */}

//                         <td className="px-4 py-4">

//                           <div className="flex items-center gap-3">

//                             <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">

//                               {
//                                 sourceIcon(
//                                   type
//                                 )
//                               }

//                             </div>

//                             <div>

//                               <span
//                                 className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${sourceClass(
//                                   type
//                                 )}`}
//                               >
//                                 {
//                                   invoiceSource.label
//                                 }
//                               </span>

//                               <div className="text-xs text-gray-500 mt-1">
//                                 {
//                                   invoiceSource.subLabel
//                                 }
//                               </div>

//                             </div>

//                           </div>

//                         </td>

//                         {/* REFERENCE */}

//                         <td className="px-4 py-4">

//                           <div className="text-sm font-medium break-all">
//                             {
//                               String(
//                                 reference
//                               )
//                             }
//                           </div>

//                           {invoice?.invoiceFor && (
//                             <div className="text-xs text-gray-500 mt-1">
//                               For:{" "}
//                               {
//                                 invoice.invoiceFor
//                               }
//                             </div>
//                           )}

//                         </td>

//                         {/* TOTAL */}

//                         <td className="px-4 py-4 font-semibold">
//                           {
//                             money(
//                               invoice.totalAmount
//                             )
//                           }
//                         </td>

//                         {/* PAID */}

//                         <td className="px-4 py-4 text-green-700 font-medium">
//                           {
//                             money(
//                               invoice.paidAmount
//                             )
//                           }
//                         </td>

//                         {/* BALANCE */}

//                         <td className="px-4 py-4 text-red-600 font-medium">
//                           {
//                             money(
//                               invoice.balanceAmount
//                             )
//                           }
//                         </td>

//                         {/* STATUS */}

//                         <td className="px-4 py-4">

//                           <span
//                             className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass(
//                               status
//                             )}`}
//                           >
//                             {
//                               status
//                             }
//                           </span>

//                         </td>

//                         {/* DATE */}

//                         <td className="px-4 py-4 text-sm text-gray-600">

//                           {
//                             formatDate(
//                               invoice.invoiceDate ||
//                                 invoice.createdAt
//                             )
//                           }

//                         </td>

//                         {/* ACTION */}

//                         <td className="px-4 py-4 text-right">

//                           <button
//                             onClick={() =>
//                               openInvoice(
//                                 invoice
//                               )
//                             }
//                             className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
//                           >

//                             <Eye size={16} />

//                             View

//                           </button>

//                         </td>

//                       </tr>

//                     );
//                   }
//                 )

//               )}

//             </tbody>

//           </table>

//         </div>

//       </div>

//       {/* =====================================================
//           DETAIL MODAL
//       ===================================================== */}

//       {selectedInvoice && (

//         <div className="fixed inset-0 z-[2000] bg-black/50 flex items-center justify-center p-4">

//           <div className="bg-white rounded-xl w-full max-w-5xl max-h-[92vh] overflow-y-auto">

//             {/* MODAL HEADER */}

//             <div className="flex justify-between items-center p-5 border-b">

//               <div>

//                 <h2 className="text-xl font-bold">
//                   Invoice Details
//                 </h2>

//                 <p className="text-sm text-gray-500">
//                   {
//                     selectedInvoice.invoiceNumber ||
//                     "-"
//                   }
//                 </p>

//               </div>

//               <button
//                 onClick={() =>
//                   setSelectedInvoice(
//                     null
//                   )
//                 }
//                 className="p-2 rounded-lg hover:bg-gray-100"
//               >
//                 <X size={20} />
//               </button>

//             </div>

//             {/* MODAL CONTENT */}

//             {detailLoading ? (

//               <div className="p-10 text-center">
//                 Loading invoice details...
//               </div>

//             ) : (

//               <div className="p-5">

//                 {/* SOURCE HIGHLIGHT */}

//                 {(() => {

//                   const source =
//                     getInvoiceSource(
//                       selectedInvoice
//                     );

//                   return (

//                     <div className="mb-6 border rounded-xl p-4 bg-gray-50">

//                       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

//                         <div>

//                           <p className="text-xs text-gray-500">
//                             Invoice Source
//                           </p>

//                           <div className="flex items-center gap-2 mt-1">

//                             {
//                               sourceIcon(
//                                 source.type
//                               )
//                             }

//                             <span
//                               className={`px-3 py-1 rounded-full text-sm font-bold ${sourceClass(
//                                 source.type
//                               )}`}
//                             >
//                               {
//                                 source.label
//                               }
//                             </span>

//                           </div>

//                           <p className="text-xs text-gray-500 mt-1">
//                             {
//                               source.subLabel
//                             }
//                           </p>

//                         </div>

//                         <div className="text-sm">

//                           <span className="text-gray-500">
//                             Invoice For:{" "}
//                           </span>

//                           <strong>
//                             {
//                               selectedInvoice.invoiceFor ||
//                               "-"
//                             }
//                           </strong>

//                         </div>

//                       </div>

//                     </div>

//                   );

//                 })()}

//                 {/* BASIC INFORMATION */}

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

//                   <Info
//                     label="Invoice Number"
//                     value={
//                       selectedInvoice.invoiceNumber
//                     }
//                   />

//                   <Info
//                     label="Invoice For"
//                     value={
//                       selectedInvoice.invoiceFor
//                     }
//                   />

//                   <Info
//                     label="Invoice Date"
//                     value={formatDate(
//                       selectedInvoice.invoiceDate
//                     )}
//                   />

//                   <Info
//                     label="Customer"
//                     value={customerName(
//                       selectedInvoice
//                     )}
//                   />

//                   <Info
//                     label="Phone"
//                     value={customerPhone(
//                       selectedInvoice
//                     )}
//                   />

//                   <Info
//                     label="Payment Status"
//                     value={
//                       selectedInvoice.paymentStatus ||
//                       "-"
//                     }
//                   />

//                   <Info
//                     label="Payment Method"
//                     value={
//                       selectedInvoice.paymentMethod ||
//                       "-"
//                     }
//                   />

//                   <Info
//                     label="Reference ID"
//                     value={
//                       selectedInvoice.referenceId ||
//                       selectedInvoice.orderId ||
//                       selectedInvoice.rentalId ||
//                       selectedInvoice.repairId ||
//                       "-"
//                     }
//                   />

//                   <Info
//                     label="Source"
//                     value={
//                       getInvoiceSource(
//                         selectedInvoice
//                       ).label
//                     }
//                   />

//                 </div>

//                 {/* SOURCE DATA */}

//                 <div className="border rounded-xl p-4 mb-6 bg-white">

//                   <h3 className="font-semibold mb-4">
//                     Transaction Information
//                   </h3>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//                     <Info
//                       label="Order ID"
//                       value={
//                         selectedInvoice.orderId
//                       }
//                     />

//                     <Info
//                       label="Rental ID"
//                       value={
//                         selectedInvoice.rentalId
//                       }
//                     />

//                     <Info
//                       label="Repair ID"
//                       value={
//                         selectedInvoice.repairId ||
//                         selectedInvoice.repairRequestId
//                       }
//                     />

//                     <Info
//                       label="Invoice Source"
//                       value={
//                         selectedInvoice.source ||
//                         selectedInvoice.invoiceSource ||
//                         selectedInvoice.orderType
//                       }
//                     />

//                     <Info
//                       label="Payment Source"
//                       value={
//                         selectedInvoice.paymentSource
//                       }
//                     />

//                     <Info
//                       label="Reference ID"
//                       value={
//                         selectedInvoice.referenceId
//                       }
//                     />

//                   </div>

//                 </div>

//                 {/* ITEMS */}

//                 <div className="border rounded-xl overflow-hidden mb-6">

//                   <div className="bg-gray-100 px-4 py-3 font-semibold">
//                     Invoice Items
//                   </div>

//                   <div className="overflow-x-auto">

//                     <table className="w-full min-w-[700px]">

//                       <thead>

//                         <tr className="border-b">

//                           <th className="text-left px-4 py-3">
//                             Item
//                           </th>

//                           <th className="text-left px-4 py-3">
//                             Qty
//                           </th>

//                           <th className="text-left px-4 py-3">
//                             Price
//                           </th>

//                           <th className="text-left px-4 py-3">
//                             Discount
//                           </th>

//                           <th className="text-right px-4 py-3">
//                             Total
//                           </th>

//                         </tr>

//                       </thead>

//                       <tbody>

//                         {(
//                           selectedInvoice.items ||
//                           []
//                         ).length === 0 ? (

//                           <tr>

//                             <td
//                               colSpan="5"
//                               className="text-center py-8 text-gray-500"
//                             >
//                               No invoice items found.
//                             </td>

//                           </tr>

//                         ) : (

//                           selectedInvoice.items.map(
//                             (
//                               item,
//                               index
//                             ) => (

//                               <tr
//                                 key={
//                                   item?._id ||
//                                   index
//                                 }
//                                 className="border-b"
//                               >

//                                 <td className="px-4 py-3">

//                                   <div className="font-medium">
//                                     {
//                                       item?.title ||
//                                       item?.name ||
//                                       "-"
//                                     }
//                                   </div>

//                                   <div className="text-xs text-gray-500">
//                                     {
//                                       item?.description ||
//                                       ""
//                                     }
//                                   </div>

//                                 </td>

//                                 <td className="px-4 py-3">
//                                   {
//                                     item?.quantity ||
//                                     0
//                                   }
//                                 </td>

//                                 <td className="px-4 py-3">
//                                   {
//                                     money(
//                                       item?.price
//                                     )
//                                   }
//                                 </td>

//                                 <td className="px-4 py-3">
//                                   {
//                                     money(
//                                       item?.discountAmount
//                                     )
//                                   }
//                                 </td>

//                                 <td className="px-4 py-3 text-right font-semibold">
//                                   {
//                                     money(
//                                       item?.total
//                                     )
//                                   }
//                                 </td>

//                               </tr>

//                             )
//                           )

//                         )}

//                       </tbody>

//                     </table>

//                   </div>

//                 </div>

//                 {/* TOTALS */}

//                 <div className="ml-auto max-w-sm space-y-2">

//                   <TotalRow
//                     label="Subtotal"
//                     value={money(
//                       selectedInvoice.subtotal
//                     )}
//                   />

//                   <TotalRow
//                     label="Discount"
//                     value={money(
//                       selectedInvoice.discount
//                     )}
//                   />

//                   <TotalRow
//                     label="Total Amount"
//                     value={money(
//                       selectedInvoice.totalAmount
//                     )}
//                     bold
//                   />

//                   <TotalRow
//                     label="Paid Amount"
//                     value={money(
//                       selectedInvoice.paidAmount
//                     )}
//                   />

//                   <TotalRow
//                     label="Balance Amount"
//                     value={money(
//                       selectedInvoice.balanceAmount
//                     )}
//                     danger
//                     bold
//                   />

//                 </div>

//               </div>

//             )}

//           </div>

//         </div>

//       )}

//     </div>
//   );
// };

// // =========================================================
// // CARD
// // =========================================================

// const Card = ({
//   title,
//   value,
//   icon,
// }) => {
//   return (
//     <div className="bg-white border rounded-xl shadow-sm p-4">

//       <div className="flex items-center justify-between">

//         <div>

//           <p className="text-sm text-gray-500">
//             {title}
//           </p>

//           <p className="text-2xl font-bold mt-1">
//             {value}
//           </p>

//         </div>

//         <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
//           {icon}
//         </div>

//       </div>

//     </div>
//   );
// };

// // =========================================================
// // INFO
// // =========================================================

// const Info = ({
//   label,
//   value,
// }) => {
//   return (
//     <div>

//       <p className="text-xs text-gray-500">
//         {label}
//       </p>

//       <p className="font-medium mt-1 break-words">
//         {value || "-"}
//       </p>

//     </div>
//   );
// };

// // =========================================================
// // TOTAL ROW
// // =========================================================

// const TotalRow = ({
//   label,
//   value,
//   bold,
//   danger,
// }) => {
//   return (
//     <div
//       className={`flex justify-between gap-4 ${
//         bold ? "font-bold" : ""
//       } ${
//         danger
//           ? "text-red-600"
//           : ""
//       }`}
//     >

//       <span>
//         {label}
//       </span>

//       <span>
//         {value}
//       </span>

//     </div>
//   );
// };

// export default InvoiceManagement;


import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  RefreshCw,
  Eye,
  FileText,
  ShoppingBag,
  Wrench,
  Laptop,
  X,
  IndianRupee,
  Store,
  Globe,
  CalendarDays,
  Receipt,
  Package,
  ClipboardList,
} from "lucide-react";

import {
  getAllInvoices,
  getInvoiceById,
} from "../../services/accountantInvoiceService";

import { toast } from "react-toastify";

const InvoiceManagement = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [invoices, setInvoices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState("ALL");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedInvoice, setSelectedInvoice] =
    useState(null);

  const [detailLoading, setDetailLoading] =
    useState(false);

  // =========================================================
  // LOAD ALL INVOICES
  // =========================================================

  const loadInvoices = async () => {
    try {
      setLoading(true);

      const response = await getAllInvoices();

      console.log(
        "ACCOUNTANT INVOICES RESPONSE:",
        response
      );

      const data =
        response?.data?.invoices ||
        response?.data?.data ||
        response?.data ||
        response?.invoices ||
        response?.results ||
        response ||
        [];

      setInvoices(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Load invoices error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load invoices"
      );

      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  // =========================================================
  // MONEY
  // =========================================================

  const money = (amount) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(
      Number(amount || 0)
    );
  };

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (value) => {
    if (!value) return "-";

    const parsed =
      new Date(value);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "-";
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // NORMALIZE STRING
  // =========================================================

  const normalize = (value) => {
    return String(
      value || ""
    )
      .trim()
      .toUpperCase()
      .replace(/[\s-]+/g, "_");
  };

  // =========================================================
  // GET ALL POSSIBLE SOURCE VALUES
  //
  // IMPORTANT:
  // We check MANY backend fields because invoices can
  // come from different modules.
  // =========================================================

  const getSourceValues = (invoice) => {
    return [
      invoice?.source,
      invoice?.invoiceSource,
      invoice?.orderType,
      invoice?.orderSource,
      invoice?.saleSource,
      invoice?.salesSource,
      invoice?.rentalSource,
      invoice?.transactionType,
      invoice?.type,
      invoice?.invoiceType,
      invoice?.invoiceFor,
      invoice?.paymentSource,
    ]
      .filter(Boolean)
      .map(normalize);
  };

  // =========================================================
  // INVOICE SOURCE
  //
  // ALL TYPES:
  //
  // ONLINE
  // WALK_IN
  // WALK_IN_ORDER
  // RENTAL
  // WALK_IN_RENTAL
  // REPAIR
  // OTHER
  // =========================================================

  const getInvoiceSource = (invoice) => {
    if (!invoice) {
      return {
        type: "OTHER",
        label: "OTHER",
        subLabel: "Invoice",
      };
    }

    const values =
      getSourceValues(invoice);

    const has =
      (list) =>
        list.some(
          (item) =>
            values.includes(
              normalize(item)
            )
        );

    // =====================================================
    // DIRECT IDS
    // =====================================================

    const hasRental =
      Boolean(
        invoice?.rentalId ||
          invoice?.rentalProductId
      );

    const hasRepair =
      Boolean(
        invoice?.repairId ||
          invoice?.repairRequestId
      );

    const hasOrder =
      Boolean(
        invoice?.orderId
      );

    // =====================================================
    // WALK-IN RENTAL
    //
    // Check BEFORE normal RENTAL.
    // =====================================================

    if (
      has([
        "WALK_IN_RENTAL",
        "WALKIN_RENTAL",
        "WALK_IN_RENTAL_INVOICE",
        "WALKINRENTAL",
        "WALK_IN_RENTAL_ORDER",
        "WALKIN_RENTAL_ORDER",
        "OFFLINE_RENTAL",
        "COUNTER_RENTAL",
      ]) ||
      (
        hasRental &&
        (
          normalize(
            invoice?.rentalSource
          ) === "WALK_IN" ||
          normalize(
            invoice?.source
          ) === "WALK_IN" ||
          invoice?.walkInRental === true ||
          invoice?.isWalkInRental === true ||
          invoice?.walkIn === true
        )
      )
    ) {
      return {
        type: "WALK_IN_RENTAL",
        label: "WALK-IN RENTAL",
        subLabel:
          "Counter / Walk-In Rental",
      };
    }

    // =====================================================
    // NORMAL RENTAL
    // =====================================================

    if (
      has([
        "RENTAL",
        "RENTAL_INVOICE",
        "RENTAL_ORDER",
        "ONLINE_RENTAL",
        "CUSTOMER_RENTAL",
      ]) ||
      (
        hasRental &&
        !invoice?.walkInRental &&
        !invoice?.isWalkInRental &&
        normalize(
          invoice?.rentalSource
        ) !== "WALK_IN"
      )
    ) {
      return {
        type: "RENTAL",
        label: "RENTAL",
        subLabel:
          "Rental Invoice",
      };
    }

    // =====================================================
    // REPAIR
    // =====================================================

    if (
      has([
        "REPAIR",
        "REPAIR_INVOICE",
        "REPAIR_ORDER",
        "SERVICE",
        "SERVICE_REPAIR",
      ]) ||
      hasRepair
    ) {
      return {
        type: "REPAIR",
        label: "REPAIR",
        subLabel:
          "Repair / Service Invoice",
      };
    }

    // =====================================================
    // WALK-IN ORDER
    //
    // IMPORTANT:
    // Check before generic WALK_IN.
    // =====================================================

    if (
      has([
        "WALK_IN_ORDER",
        "WALKIN_ORDER",
        "WALK_IN_SALE_ORDER",
        "WALKIN_SALE_ORDER",
        "COUNTER_ORDER",
        "OFFLINE_ORDER",
        "POS_ORDER",
        "STORE_ORDER",
      ]) ||
      (
        hasOrder &&
        (
          invoice?.walkInOrder === true ||
          invoice?.isWalkInOrder === true ||
          normalize(
            invoice?.orderSource
          ) === "WALK_IN" ||
          normalize(
            invoice?.saleSource
          ) === "WALK_IN"
        )
      )
    ) {
      return {
        type: "WALK_IN_ORDER",
        label: "WALK-IN ORDER",
        subLabel:
          "Counter / Store Order",
      };
    }

    // =====================================================
    // WALK-IN SALE
    // =====================================================

    if (
      has([
        "WALK_IN",
        "WALKIN",
        "OFFLINE",
        "COUNTER",
        "POS",
        "STORE",
        "IN_STORE",
        "INSTORE",
        "WALK_IN_SALE",
        "WALKIN_SALE",
        "COUNTER_SALE",
        "OFFLINE_SALE",
        "POS_SALE",
      ]) ||
      invoice?.walkIn === true ||
      invoice?.isWalkIn === true ||
      invoice?.walkInSale === true
    ) {
      return {
        type: "WALK_IN",
        label: "WALK-IN SALE",
        subLabel:
          "Counter / Store Sale",
      };
    }

    // =====================================================
    // ONLINE / E-COMMERCE ORDER
    // =====================================================

    if (
      has([
        "ONLINE",
        "ECOMMERCE",
        "E_COMMERCE",
        "E-COMMERCE",
        "ONLINE_ORDER",
        "ECOMMERCE_ORDER",
        "E_COMMERCE_ORDER",
        "ONLINE_SALE",
        "ECOMMERCE_SALE",
        "WEB",
        "WEBSITE",
      ]) ||
      normalize(
        invoice?.paymentSource
      ) === "ONLINE" ||
      (
        hasOrder &&
        !invoice?.walkIn &&
        !invoice?.isWalkIn &&
        !invoice?.walkInOrder &&
        !invoice?.isWalkInOrder
      )
    ) {
      return {
        type: "ONLINE",
        label: "ONLINE ORDER",
        subLabel:
          "E-Commerce Order",
      };
    }

    // =====================================================
    // ORDER / SALE FALLBACK
    // =====================================================

    if (
      has([
        "ORDER",
        "SALE",
        "ECOMMERCE_ORDER",
        "E_COMMERCE_ORDER",
      ])
    ) {
      return {
        type: "ONLINE",
        label: "ONLINE ORDER",
        subLabel:
          "E-Commerce Order",
      };
    }

    // =====================================================
    // OTHER
    // =====================================================

    return {
      type: "OTHER",
      label:
        invoice?.invoiceFor ||
        invoice?.source ||
        invoice?.invoiceType ||
        "OTHER",
      subLabel:
        "Other Invoice",
    };
  };

  // =========================================================
  // PAYMENT STATUS
  // =========================================================

  const getInvoiceStatus = (
    invoice
  ) => {
    return normalize(
      invoice?.paymentStatus ||
        invoice?.status ||
        invoice?.paymentState ||
        "PENDING"
    );
  };

  // =========================================================
  // CUSTOMER NAME
  // =========================================================

  const customerName = (
    invoice
  ) => {
    if (
      invoice?.billingAddress
        ?.fullName
    ) {
      return invoice
        .billingAddress
        .fullName;
    }

    if (
      invoice?.shippingAddress
        ?.fullName
    ) {
      return invoice
        .shippingAddress
        .fullName;
    }

    if (
      invoice?.customerName
    ) {
      return invoice.customerName;
    }

    if (
      invoice?.name
    ) {
      return invoice.name;
    }

    if (
      invoice?.user &&
      typeof invoice.user ===
        "object"
    ) {
      return (
        `${invoice.user.firstName || ""} ${
          invoice.user.lastName || ""
        }`.trim() ||
        invoice.user.name ||
        invoice.user.email ||
        "Customer"
      );
    }

    if (
      invoice?.customer &&
      typeof invoice.customer ===
        "object"
    ) {
      return (
        `${invoice.customer.firstName || ""} ${
          invoice.customer.lastName || ""
        }`.trim() ||
        invoice.customer.name ||
        invoice.customer.email ||
        "Customer"
      );
    }

    if (
      invoice?.individualDetails
    ) {
      return (
        invoice.individualDetails
          ?.fullName ||
        invoice.individualDetails
          ?.name ||
        "Customer"
      );
    }

    if (
      invoice?.companyDetails
    ) {
      return (
        invoice.companyDetails
          ?.companyName ||
        invoice.companyDetails
          ?.name ||
        "Company"
      );
    }

    return "Customer";
  };

  // =========================================================
  // CUSTOMER PHONE
  // =========================================================

  const customerPhone = (
    invoice
  ) => {
    return (
      invoice?.billingAddress
        ?.phone ||
      invoice?.shippingAddress
        ?.phone ||
      invoice?.customerPhone ||
      invoice?.phone ||
      invoice?.user?.phone ||
      invoice?.customer?.phone ||
      invoice?.individualDetails
        ?.phone ||
      invoice?.companyDetails
        ?.phone ||
      "-"
    );
  };

  // =========================================================
  // SOURCE ICON
  // =========================================================

  const sourceIcon = (
    type
  ) => {
    switch (type) {
      case "ONLINE":
        return (
          <Globe
            size={19}
            className="text-green-600"
          />
        );

      case "WALK_IN":
        return (
          <Store
            size={19}
            className="text-blue-600"
          />
        );

      case "WALK_IN_ORDER":
        return (
          <ShoppingBag
            size={19}
            className="text-cyan-600"
          />
        );

      case "RENTAL":
        return (
          <Laptop
            size={19}
            className="text-purple-600"
          />
        );

      case "WALK_IN_RENTAL":
        return (
          <Package
            size={19}
            className="text-indigo-600"
          />
        );

      case "REPAIR":
        return (
          <Wrench
            size={19}
            className="text-orange-600"
          />
        );

      default:
        return (
          <FileText
            size={19}
            className="text-gray-600"
          />
        );
    }
  };

  // =========================================================
  // SOURCE CLASS
  // =========================================================

  const sourceClass = (
    type
  ) => {
    switch (type) {
      case "ONLINE":
        return "bg-green-100 text-green-700";

      case "WALK_IN":
        return "bg-blue-100 text-blue-700";

      case "WALK_IN_ORDER":
        return "bg-cyan-100 text-cyan-700";

      case "RENTAL":
        return "bg-purple-100 text-purple-700";

      case "WALK_IN_RENTAL":
        return "bg-indigo-100 text-indigo-700";

      case "REPAIR":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const statusClass = (
    status
  ) => {
    switch (status) {
      case "PAID":
      case "SUCCESS":
      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "PARTIAL":
        return "bg-blue-100 text-blue-700";

      case "REFUNDED":
        return "bg-purple-100 text-purple-700";

      case "CANCELLED":
      case "FAILED":
        return "bg-red-100 text-red-700";

      case "PENDING":
      case "UNPAID":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================================================
  // REFERENCE
  // =========================================================

  const getReference = (
    invoice
  ) => {
    return (
      invoice?.orderId ||
      invoice?.rentalId ||
      invoice?.repairId ||
      invoice?.repairRequestId ||
      invoice?.referenceId ||
      invoice?.transactionId ||
      "-"
    );
  };

  // =========================================================
  // FILTERED INVOICES
  // =========================================================

  const filteredInvoices =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase();

      return invoices.filter(
        (invoice) => {
          const source =
            getInvoiceSource(
              invoice
            );

          const status =
            getInvoiceStatus(
              invoice
            );

          const customer =
            customerName(
              invoice
            );

          const searchable = [
            invoice?.invoiceNumber,
            invoice?._id,
            invoice?.orderId,
            invoice?.rentalId,
            invoice?.repairId,
            invoice?.repairRequestId,
            invoice?.referenceId,
            invoice?.transactionId,
            invoice?.invoiceFor,
            invoice?.source,
            invoice?.invoiceSource,
            source.label,
            source.subLabel,
            customer,
            customerPhone(
              invoice
            ),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            !searchText ||
            searchable.includes(
              searchText
            );

          const matchesType =
            typeFilter === "ALL" ||
            source.type ===
              typeFilter;

          const matchesStatus =
            statusFilter === "ALL" ||
            status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesType &&
            matchesStatus
          );
        }
      );
    }, [
      invoices,
      search,
      typeFilter,
      statusFilter,
    ]);

  // =========================================================
  // SUMMARY
  // =========================================================

  const summary =
    useMemo(() => {
      const getCount =
        (type) =>
          invoices.filter(
            (invoice) =>
              getInvoiceSource(
                invoice
              ).type === type
          ).length;

      return {
        total:
          invoices.length,

        online:
          getCount("ONLINE"),

        walkIn:
          getCount("WALK_IN"),

        walkInOrder:
          getCount(
            "WALK_IN_ORDER"
          ),

        rental:
          getCount("RENTAL"),

        walkInRental:
          getCount(
            "WALK_IN_RENTAL"
          ),

        repair:
          getCount("REPAIR"),

        unpaid:
          invoices.filter(
            (invoice) => {
              const status =
                getInvoiceStatus(
                  invoice
                );

              return (
                status ===
                  "PENDING" ||
                status ===
                  "UNPAID" ||
                status ===
                  "PARTIAL"
              );
            }
          ).length,
      };
    }, [invoices]);

  // =========================================================
  // OPEN INVOICE
  // =========================================================

  const openInvoice = async (
    invoice
  ) => {
    try {
      setDetailLoading(true);

      const response =
        await getInvoiceById(
          invoice?._id
        );

      console.log(
        "INVOICE DETAIL:",
        response
      );

      const data =
        response?.data?.invoice ||
        response?.data ||
        response?.invoice ||
        response;

      setSelectedInvoice(
        data
      );
    } catch (error) {
      console.error(
        "Open invoice error:",
        error
      );

      toast.error(
        error?.response?.data
          ?.message ||
          "Unable to load invoice"
      );
    } finally {
      setDetailLoading(false);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-gray-800 text-white flex items-center justify-center">
              <Receipt
                size={22}
              />
            </div>

            <div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Invoice Management
              </h1>

              <p className="text-gray-500 mt-1">
                Manage all online, walk-in, rental,
                repair and order invoices.
              </p>

            </div>

          </div>
        </div>

        <button
          onClick={
            loadInvoices
          }
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-8 gap-4 mb-6">

        <Card
          title="Total"
          value={
            summary.total
          }
          icon={
            <FileText
              size={21}
            />
          }
        />

        <Card
          title="Online"
          value={
            summary.online
          }
          icon={
            <Globe
              size={21}
              className="text-green-600"
            />
          }
        />

        <Card
          title="Walk-In Sale"
          value={
            summary.walkIn
          }
          icon={
            <Store
              size={21}
              className="text-blue-600"
            />
          }
        />

        <Card
          title="Walk-In Order"
          value={
            summary.walkInOrder
          }
          icon={
            <ShoppingBag
              size={21}
              className="text-cyan-600"
            />
          }
        />

        <Card
          title="Rental"
          value={
            summary.rental
          }
          icon={
            <Laptop
              size={21}
              className="text-purple-600"
            />
          }
        />

        <Card
          title="Walk-In Rental"
          value={
            summary.walkInRental
          }
          icon={
            <Package
              size={21}
              className="text-indigo-600"
            />
          }
        />

        <Card
          title="Repair"
          value={
            summary.repair
          }
          icon={
            <Wrench
              size={21}
              className="text-orange-600"
            />
          }
        />

        <Card
          title="Unpaid"
          value={
            summary.unpaid
          }
          icon={
            <IndianRupee
              size={21}
            />
          }
        />

      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="bg-white border shadow-sm rounded-xl p-4 mb-5">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {/* SEARCH */}

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search invoice, customer, order, rental, repair..."
              className="w-full border rounded-lg pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* TYPE */}

          <select
            value={
              typeFilter
            }
            onChange={(e) =>
              setTypeFilter(
                e.target.value
              )
            }
            className="border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
          >

            <option value="ALL">
              All Invoice Types
            </option>

            <option value="ONLINE">
              Online / E-Commerce
            </option>

            <option value="WALK_IN">
              Walk-In Sale
            </option>

            <option value="WALK_IN_ORDER">
              Walk-In Order
            </option>

            <option value="RENTAL">
              Rental
            </option>

            <option value="WALK_IN_RENTAL">
              Walk-In Rental
            </option>

            <option value="REPAIR">
              Repair
            </option>

            <option value="OTHER">
              Other
            </option>

          </select>

          {/* STATUS */}

          <select
            value={
              statusFilter
            }
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
          >

            <option value="ALL">
              All Payment Status
            </option>

            <option value="PAID">
              Paid
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="PARTIAL">
              Partial
            </option>

            <option value="REFUNDED">
              Refunded
            </option>

            <option value="FAILED">
              Failed
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>

            <option value="UNPAID">
              Unpaid
            </option>

          </select>

        </div>

        {/* FILTER RESULT */}

        <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
          <ClipboardList
            size={15}
          />

          Showing{" "}
          <strong className="text-gray-800">
            {
              filteredInvoices.length
            }
          </strong>{" "}
          of{" "}
          <strong className="text-gray-800">
            {invoices.length}
          </strong>{" "}
          invoices
        </div>

      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="bg-white border shadow-sm rounded-xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1450px]">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left px-4 py-3 text-sm font-semibold">
                  Invoice
                </th>

                <th className="text-left px-4 py-3 text-sm font-semibold">
                  Customer
                </th>

                <th className="text-left px-4 py-3 text-sm font-semibold">
                  Type
                </th>

                <th className="text-left px-4 py-3 text-sm font-semibold">
                  Reference
                </th>

                <th className="text-left px-4 py-3 text-sm font-semibold">
                  Total
                </th>

                <th className="text-left px-4 py-3 text-sm font-semibold">
                  Paid
                </th>

                <th className="text-left px-4 py-3 text-sm font-semibold">
                  Balance
                </th>

                <th className="text-left px-4 py-3 text-sm font-semibold">
                  Status
                </th>

                <th className="text-left px-4 py-3 text-sm font-semibold">
                  Date
                </th>

                <th className="text-right px-4 py-3 text-sm font-semibold">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="10"
                    className="text-center py-16 text-gray-500"
                  >

                    <RefreshCw
                      size={24}
                      className="animate-spin mx-auto mb-3"
                    />

                    Loading invoices...

                  </td>

                </tr>

              ) : filteredInvoices.length ===
                0 ? (

                <tr>

                  <td
                    colSpan="10"
                    className="text-center py-16 text-gray-500"
                  >

                    <FileText
                      size={35}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <p className="font-medium">
                      No invoices found
                    </p>

                    <p className="text-sm mt-1">
                      Try changing your search
                      or filters.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredInvoices.map(
                  (invoice) => {

                    const invoiceSource =
                      getInvoiceSource(
                        invoice
                      );

                    const type =
                      invoiceSource.type;

                    const status =
                      getInvoiceStatus(
                        invoice
                      );

                    const reference =
                      getReference(
                        invoice
                      );

                    return (
                      <tr
                        key={
                          invoice?._id
                        }
                        className="border-t hover:bg-gray-50 transition"
                      >

                        {/* INVOICE */}

                        <td className="px-4 py-4">

                          <div className="font-semibold text-gray-800">
                            {
                              invoice?.invoiceNumber ||
                              "-"
                            }
                          </div>

                          <div className="text-xs text-gray-400 mt-1 break-all max-w-[180px]">
                            ID:{" "}
                            {
                              invoice?._id ||
                              "-"
                            }
                          </div>

                        </td>

                        {/* CUSTOMER */}

                        <td className="px-4 py-4">

                          <div className="font-medium text-gray-800">
                            {
                              customerName(
                                invoice
                              )
                            }
                          </div>

                          <div className="text-xs text-gray-500 mt-1">
                            {
                              customerPhone(
                                invoice
                              )
                            }
                          </div>

                        </td>

                        {/* TYPE */}

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-3">

                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${sourceClass(
                                type
                              )}`}
                            >
                              {
                                sourceIcon(
                                  type
                                )
                              }
                            </div>

                            <div>

                              <span
                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${sourceClass(
                                  type
                                )}`}
                              >
                                {
                                  invoiceSource.label
                                }
                              </span>

                              <div className="text-xs text-gray-500 mt-1">
                                {
                                  invoiceSource.subLabel
                                }
                              </div>

                            </div>

                          </div>

                        </td>

                        {/* REFERENCE */}

                        <td className="px-4 py-4">

                          <div className="text-sm font-medium break-all max-w-[220px]">
                            {
                              String(
                                reference
                              )
                            }
                          </div>

                          {invoice?.invoiceFor && (
                            <div className="text-xs text-gray-500 mt-1">
                              For:{" "}
                              {
                                invoice.invoiceFor
                              }
                            </div>
                          )}

                        </td>

                        {/* TOTAL */}

                        <td className="px-4 py-4 font-semibold text-gray-800">
                          {
                            money(
                              invoice?.totalAmount
                            )
                          }
                        </td>

                        {/* PAID */}

                        <td className="px-4 py-4 font-medium text-green-700">
                          {
                            money(
                              invoice?.paidAmount
                            )
                          }
                        </td>

                        {/* BALANCE */}

                        <td className="px-4 py-4 font-medium text-red-600">
                          {
                            money(
                              invoice?.balanceAmount
                            )
                          }
                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-4">

                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass(
                              status
                            )}`}
                          >
                            {
                              status
                            }
                          </span>

                        </td>

                        {/* DATE */}

                        <td className="px-4 py-4 text-sm text-gray-600">

                          <div className="flex items-center gap-2">

                            <CalendarDays
                              size={15}
                            />

                            {
                              formatDate(
                                invoice?.invoiceDate ||
                                  invoice?.createdAt
                              )
                            }

                          </div>

                        </td>

                        {/* ACTION */}

                        <td className="px-4 py-4 text-right">

                          <button
                            onClick={() =>
                              openInvoice(
                                invoice
                              )
                            }
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
                          >

                            <Eye
                              size={16}
                            />

                            View

                          </button>

                        </td>

                      </tr>
                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================================
          DETAIL MODAL
      ===================================================== */}

      {selectedInvoice && (

        <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[94vh] overflow-y-auto shadow-2xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 bg-white flex justify-between items-center p-5 border-b">

              <div>

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">

                    <Receipt
                      size={20}
                    />

                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-gray-800">
                      Invoice Details
                    </h2>

                    <p className="text-sm text-gray-500">
                      {
                        selectedInvoice.invoiceNumber ||
                        "-"
                      }
                    </p>

                  </div>

                </div>

              </div>

              <button
                onClick={() =>
                  setSelectedInvoice(
                    null
                  )
                }
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X
                  size={21}
                />
              </button>

            </div>

            {/* MODAL CONTENT */}

            {detailLoading ? (

              <div className="p-16 text-center text-gray-500">

                <RefreshCw
                  size={28}
                  className="animate-spin mx-auto mb-3"
                />

                Loading invoice details...

              </div>

            ) : (

              <div className="p-5">

                {/* SOURCE HEADER */}

                {(() => {

                  const source =
                    getInvoiceSource(
                      selectedInvoice
                    );

                  const status =
                    getInvoiceStatus(
                      selectedInvoice
                    );

                  return (
                    <div className="mb-6 border rounded-xl p-5 bg-gray-50">

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>

                          <p className="text-xs text-gray-500">
                            Invoice Type
                          </p>

                          <div className="flex items-center gap-3 mt-2">

                            <div
                              className={`w-11 h-11 rounded-lg flex items-center justify-center ${sourceClass(
                                source.type
                              )}`}
                            >
                              {
                                sourceIcon(
                                  source.type
                                )
                              }
                            </div>

                            <div>

                              <span
                                className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${sourceClass(
                                  source.type
                                )}`}
                              >
                                {
                                  source.label
                                }
                              </span>

                              <p className="text-xs text-gray-500 mt-1">
                                {
                                  source.subLabel
                                }
                              </p>

                            </div>

                          </div>

                        </div>

                        <div className="text-right">

                          <p className="text-xs text-gray-500">
                            Payment Status
                          </p>

                          <span
                            className={`inline-flex mt-1 px-3 py-1 rounded-full text-sm font-bold ${statusClass(
                              status
                            )}`}
                          >
                            {
                              status
                            }
                          </span>

                        </div>

                      </div>

                    </div>
                  );

                })()}

                {/* BASIC INFORMATION */}

                <SectionTitle>
                  Basic Information
                </SectionTitle>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">

                  <Info
                    label="Invoice Number"
                    value={
                      selectedInvoice.invoiceNumber
                    }
                  />

                  <Info
                    label="Invoice For"
                    value={
                      selectedInvoice.invoiceFor
                    }
                  />

                  <Info
                    label="Invoice Date"
                    value={formatDate(
                      selectedInvoice.invoiceDate ||
                        selectedInvoice.createdAt
                    )}
                  />

                  <Info
                    label="Customer"
                    value={customerName(
                      selectedInvoice
                    )}
                  />

                  <Info
                    label="Phone"
                    value={customerPhone(
                      selectedInvoice
                    )}
                  />

                  <Info
                    label="Email"
                    value={
                      selectedInvoice
                        ?.billingAddress
                        ?.email ||
                      selectedInvoice
                        ?.customerEmail ||
                      selectedInvoice
                        ?.user
                        ?.email ||
                      selectedInvoice
                        ?.customer
                        ?.email
                    }
                  />

                  <Info
                    label="Payment Status"
                    value={
                      selectedInvoice.paymentStatus ||
                      selectedInvoice.status
                    }
                  />

                  <Info
                    label="Payment Method"
                    value={
                      selectedInvoice.paymentMethod
                    }
                  />

                  <Info
                    label="Reference ID"
                    value={
                      getReference(
                        selectedInvoice
                      )
                    }
                  />

                </div>

                {/* TRANSACTION INFORMATION */}

                <SectionTitle>
                  Transaction Information
                </SectionTitle>

                <div className="border rounded-xl p-5 mb-6 bg-white">

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                    <Info
                      label="Order ID"
                      value={
                        selectedInvoice.orderId
                      }
                    />

                    <Info
                      label="Rental ID"
                      value={
                        selectedInvoice.rentalId
                      }
                    />

                    <Info
                      label="Repair ID"
                      value={
                        selectedInvoice.repairId ||
                        selectedInvoice.repairRequestId
                      }
                    />

                    <Info
                      label="Invoice Source"
                      value={
                        selectedInvoice.source ||
                        selectedInvoice.invoiceSource ||
                        selectedInvoice.orderType
                      }
                    />

                    <Info
                      label="Order Source"
                      value={
                        selectedInvoice.orderSource
                      }
                    />

                    <Info
                      label="Rental Source"
                      value={
                        selectedInvoice.rentalSource
                      }
                    />

                    <Info
                      label="Payment Source"
                      value={
                        selectedInvoice.paymentSource
                      }
                    />

                    <Info
                      label="Reference ID"
                      value={
                        selectedInvoice.referenceId
                      }
                    />

                    <Info
                      label="Transaction ID"
                      value={
                        selectedInvoice.transactionId
                      }
                    />

                  </div>

                </div>

                {/* CUSTOMER ADDRESS */}

                {(selectedInvoice
                  ?.billingAddress ||
                  selectedInvoice
                    ?.shippingAddress) && (

                  <>
                    <SectionTitle>
                      Customer Address
                    </SectionTitle>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

                      <AddressCard
                        title="Billing Address"
                        address={
                          selectedInvoice.billingAddress
                        }
                      />

                      <AddressCard
                        title="Shipping Address"
                        address={
                          selectedInvoice.shippingAddress
                        }
                      />

                    </div>

                  </>
                )}

                {/* ITEMS */}

                <SectionTitle>
                  Invoice Items
                </SectionTitle>

                <div className="border rounded-xl overflow-hidden mb-6">

                  <div className="overflow-x-auto">

                    <table className="w-full min-w-[750px]">

                      <thead className="bg-gray-100">

                        <tr>

                          <th className="text-left px-4 py-3">
                            Item
                          </th>

                          <th className="text-left px-4 py-3">
                            Qty
                          </th>

                          <th className="text-left px-4 py-3">
                            Price
                          </th>

                          <th className="text-left px-4 py-3">
                            Discount
                          </th>

                          <th className="text-right px-4 py-3">
                            Total
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {(
                          selectedInvoice.items ||
                          selectedInvoice.products ||
                          []
                        ).length === 0 ? (

                          <tr>

                            <td
                              colSpan="5"
                              className="text-center py-10 text-gray-500"
                            >
                              No invoice items found.
                            </td>

                          </tr>

                        ) : (

                          (
                            selectedInvoice.items ||
                            selectedInvoice.products ||
                            []
                          ).map(
                            (
                              item,
                              index
                            ) => (

                              <tr
                                key={
                                  item?._id ||
                                  index
                                }
                                className="border-t"
                              >

                                <td className="px-4 py-4">

                                  <div className="font-medium text-gray-800">

                                    {
                                      item?.title ||
                                      item?.name ||
                                      item?.productName ||
                                      item?.product?.name ||
                                      item?.description ||
                                      "-"
                                    }

                                  </div>

                                  {item?.description &&
                                    item?.title && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        {
                                          item.description
                                        }
                                      </div>
                                    )}

                                </td>

                                <td className="px-4 py-4">

                                  {
                                    item?.quantity ??
                                    item?.qty ??
                                    0
                                  }

                                </td>

                                <td className="px-4 py-4">

                                  {
                                    money(
                                      item?.price ??
                                        item?.unitPrice
                                    )
                                  }

                                </td>

                                <td className="px-4 py-4">

                                  {
                                    money(
                                      item?.discountAmount ??
                                        item?.discount
                                    )
                                  }

                                </td>

                                <td className="px-4 py-4 text-right font-semibold">

                                  {
                                    money(
                                      item?.total ??
                                        item?.totalAmount
                                    )
                                  }

                                </td>

                              </tr>

                            )
                          )

                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

                {/* TOTALS */}

                <div className="flex justify-end">

                  <div className="w-full max-w-md border rounded-xl p-5 bg-gray-50 space-y-3">

                    <TotalRow
                      label="Subtotal"
                      value={money(
                        selectedInvoice.subtotal
                      )}
                    />

                    <TotalRow
                      label="Discount"
                      value={money(
                        selectedInvoice.discount ||
                          selectedInvoice.discountAmount
                      )}
                    />

                    <TotalRow
                      label="Tax"
                      value={money(
                        selectedInvoice.tax ||
                          selectedInvoice.taxAmount ||
                          selectedInvoice.gstAmount
                      )}
                    />

                    <div className="border-t pt-3">

                      <TotalRow
                        label="Total Amount"
                        value={money(
                          selectedInvoice.totalAmount
                        )}
                        bold
                      />

                    </div>

                    <TotalRow
                      label="Paid Amount"
                      value={money(
                        selectedInvoice.paidAmount
                      )}
                    />

                    <TotalRow
                      label="Balance Amount"
                      value={money(
                        selectedInvoice.balanceAmount
                      )}
                      danger
                      bold
                    />

                  </div>

                </div>

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
};

// =========================================================
// CARD
// =========================================================

const Card = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-4">

      <div className="flex items-center justify-between gap-3">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="text-2xl font-bold mt-1 text-gray-800">
            {value}
          </p>

        </div>

        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
          {icon}
        </div>

      </div>

    </div>
  );
};

// =========================================================
// SECTION TITLE
// =========================================================

const SectionTitle = ({
  children,
}) => {
  return (
    <h3 className="font-semibold text-gray-800 mb-4">
      {children}
    </h3>
  );
};

// =========================================================
// INFO
// =========================================================

const Info = ({
  label,
  value,
}) => {
  return (
    <div>

      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="font-medium text-gray-800 mt-1 break-words">
        {value || "-"}
      </p>

    </div>
  );
};

// =========================================================
// ADDRESS
// =========================================================

const AddressCard = ({
  title,
  address,
}) => {
  if (!address) {
    return (
      <div className="border rounded-xl p-4 bg-gray-50">

        <h4 className="font-semibold mb-2">
          {title}
        </h4>

        <p className="text-sm text-gray-400">
          No address available
        </p>

      </div>
    );
  }

  return (
    <div className="border rounded-xl p-4 bg-gray-50">

      <h4 className="font-semibold mb-3">
        {title}
      </h4>

      <div className="text-sm text-gray-600 space-y-1">

        {address.fullName && (
          <div className="font-medium text-gray-800">
            {address.fullName}
          </div>
        )}

        {address.addressLine1 && (
          <div>
            {address.addressLine1}
          </div>
        )}

        {address.addressLine2 && (
          <div>
            {address.addressLine2}
          </div>
        )}

        {(address.city ||
          address.state ||
          address.pincode) && (

          <div>
            {[
              address.city,
              address.state,
              address.pincode,
            ]
              .filter(Boolean)
              .join(", ")}
          </div>

        )}

        {address.phone && (
          <div>
            Phone:{" "}
            {address.phone}
          </div>
        )}

        {address.email && (
          <div>
            Email:{" "}
            {address.email}
          </div>
        )}

      </div>

    </div>
  );
};

// =========================================================
// TOTAL ROW
// =========================================================

const TotalRow = ({
  label,
  value,
  bold = false,
  danger = false,
}) => {
  return (
    <div
      className={`flex justify-between gap-5 ${
        bold
          ? "font-bold"
          : ""
      } ${
        danger
          ? "text-red-600"
          : "text-gray-800"
      }`}
    >

      <span>
        {label}
      </span>

      <span className="text-right">
        {value}
      </span>

    </div>
  );
};

export default InvoiceManagement;