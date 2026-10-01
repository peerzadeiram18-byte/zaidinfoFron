// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   FaCheck,
//   FaEye,
//   FaPlus,
//   FaRupeeSign,
//   FaSearch,
//   FaTrash,
//   FaTimes,
//   FaSyncAlt,
// } from "react-icons/fa";

// import {
//   purchaseApi,
//   getApiError,
// } from "../../services/accountingService";


// // ======================================================
// // EMPTY VALUES
// // ======================================================

// const createEmptyItem = () => ({
//   product: "",
//   quantity: 1,
//   purchasePrice: "",
//   gst: 0,
// });

// const createEmptyForm = () => ({
//   vendorName: "",
//   vendorPhone: "",
//   vendorEmail: "",
//   vendorInvoiceNumber: "",
//   invoiceDate: new Date().toISOString().slice(0, 10),
//   notes: "",
//   items: [createEmptyItem()],
// });

// const createEmptyPayment = () => ({
//   amount: "",
//   paymentMode: "CASH",
//   paymentDate: new Date().toISOString().slice(0, 10),
// });


// // ======================================================
// // HELPERS
// // ======================================================

// const money = (value) => {
//   const number = Number(value || 0);

//   return `₹${number.toLocaleString("en-IN", {
//     maximumFractionDigits: 2,
//   })}`;
// };


// const getResponseData = (response) => {
//   // Axios response
//   if (
//     response &&
//     typeof response === "object" &&
//     response.data !== undefined &&
//     response.status !== undefined
//   ) {
//     return response.data;
//   }

//   return response;
// };


// const extractArray = (response) => {
//   const data = getResponseData(response);

//   if (Array.isArray(data)) {
//     return data;
//   }

//   if (Array.isArray(data?.data)) {
//     return data.data;
//   }

//   if (Array.isArray(data?.purchases)) {
//     return data.purchases;
//   }

//   return [];
// };


// const getPendingTotal = (items) => {
//   if (!Array.isArray(items)) {
//     return 0;
//   }

//   return items.reduce(
//     (total, item) =>
//       total + Number(item?.pendingAmount || 0),
//     0
//   );
// };


// // ======================================================
// // COMPONENT
// // ======================================================

// export default function PurchaseManagement() {

//   // ----------------------------------------------------
//   // STATES
//   // ----------------------------------------------------

//   const [rows, setRows] = useState([]);

//   const [pendingPurchases, setPendingPurchases] = useState([]);

//   const [form, setForm] = useState(
//     createEmptyForm()
//   );

//   const [paying, setPaying] = useState(null);

//   const [payment, setPayment] = useState(
//     createEmptyPayment()
//   );

//   const [search, setSearch] = useState("");

//   const [loading, setLoading] = useState(true);

//   const [saving, setSaving] = useState(false);

//   const [processingId, setProcessingId] = useState(null);

//   const [error, setError] = useState("");

//   const [success, setSuccess] = useState("");

//   const [viewingPurchase, setViewingPurchase] =
//     useState(null);

//   const [loadingPurchase, setLoadingPurchase] =
//     useState(false);


//   // ====================================================
//   // LOAD PURCHASES
//   // ====================================================

//   const load = useCallback(async () => {

//     setLoading(true);
//     setError("");

//     try {

//       const [allResponse, pendingResponse] =
//         await Promise.all([
//           purchaseApi.list(),
//           purchaseApi.pendingPayments(),
//         ]);


//       // ------------------------------------------------
//       // BACKEND RESPONSE:
//       //
//       // {
//       //   success: true,
//       //   count: ...,
//       //   data: [...]
//       // }
//       // ------------------------------------------------

//       const allPurchases =
//         extractArray(allResponse);

//       const pending =
//         extractArray(pendingResponse);


//       setRows(allPurchases);

//       setPendingPurchases(pending);

//     } catch (err) {

//       console.error(
//         "Purchase load error:",
//         err
//       );

//       setError(
//         getApiError(err) ||
//         "Unable to load purchase data."
//       );

//     } finally {

//       setLoading(false);

//     }

//   }, []);


//   // ====================================================
//   // INITIAL LOAD
//   // ====================================================

//   useEffect(() => {

//     load();

//   }, [load]);


//   // ====================================================
//   // CLEAR MESSAGES
//   // ====================================================

//   useEffect(() => {

//     if (!success) {
//       return;
//     }

//     const timer = setTimeout(() => {
//       setSuccess("");
//     }, 3000);

//     return () => clearTimeout(timer);

//   }, [success]);


//   // ====================================================
//   // FILTER
//   // ====================================================

//   const filtered = useMemo(() => {

//     const query =
//       search.toLowerCase().trim();

//     if (!query) {
//       return rows;
//     }

//     return rows.filter((purchase) => {

//       const values = [
//         purchase?.purchaseNumber,
//         purchase?.vendorName,
//         purchase?.vendorInvoiceNumber,
//         purchase?.paymentStatus,
//         purchase?.vendorPhone,
//         purchase?.vendorEmail,
//       ];

//       return values.some((value) =>
//         String(value || "")
//           .toLowerCase()
//           .includes(query)
//       );

//     });

//   }, [rows, search]);


//   // ====================================================
//   // SUMMARY
//   // ====================================================

//   const totalPending =
//     useMemo(
//       () => getPendingTotal(pendingPurchases),
//       [pendingPurchases]
//     );


//   const totalPurchases =
//     rows.length;


//   const totalPurchaseValue =
//     useMemo(() => {

//       return rows.reduce(
//         (total, item) =>
//           total +
//           Number(item?.totalAmount || 0),
//         0
//       );

//     }, [rows]);


//   const totalPaid =
//     useMemo(() => {

//       return rows.reduce(
//         (total, item) =>
//           total +
//           Number(item?.paidAmount || 0),
//         0
//       );

//     }, [rows]);


//   // ====================================================
//   // FORM HANDLERS
//   // ====================================================

//   const handleFormChange = (
//     field,
//     value
//   ) => {

//     setForm((previous) => ({
//       ...previous,
//       [field]: value,
//     }));

//   };


//   const setItem = (
//     index,
//     key,
//     value
//   ) => {

//     setForm((previous) => ({
//       ...previous,

//       items: previous.items.map(
//         (item, itemIndex) => {

//           if (itemIndex !== index) {
//             return item;
//           }

//           return {
//             ...item,
//             [key]: value,
//           };

//         }
//       ),
//     }));

//   };


//   const addItem = () => {

//     setForm((previous) => ({
//       ...previous,

//       items: [
//         ...previous.items,
//         createEmptyItem(),
//       ],
//     }));

//   };


//   const removeItem = (index) => {

//     if (form.items.length === 1) {
//       return;
//     }

//     setForm((previous) => ({
//       ...previous,

//       items: previous.items.filter(
//         (_, itemIndex) =>
//           itemIndex !== index
//       ),
//     }));

//   };


//   // ====================================================
//   // CREATE PURCHASE
//   // ====================================================

//   const submit = async (event) => {

//     event.preventDefault();

//     setError("");
//     setSuccess("");

//     // -----------------------------------------------
//     // FRONTEND VALIDATION
//     // -----------------------------------------------

//     if (
//       !form.vendorName.trim()
//     ) {

//       setError(
//         "Vendor name is required."
//       );

//       return;
//     }


//     if (
//       !form.items.length
//     ) {

//       setError(
//         "At least one purchase item is required."
//       );

//       return;
//     }


//     for (
//       const item of form.items
//     ) {

//       if (
//         !item.product.trim()
//       ) {

//         setError(
//           "Product ID is required for every item."
//         );

//         return;
//       }


//       if (
//         !Number.isInteger(
//           Number(item.quantity)
//         ) ||
//         Number(item.quantity) <= 0
//       ) {

//         setError(
//           "Quantity must be a valid positive number."
//         );

//         return;
//       }


//       if (
//         item.purchasePrice === "" ||
//         !Number.isFinite(
//           Number(item.purchasePrice)
//         ) ||
//         Number(item.purchasePrice) < 0
//       ) {

//         setError(
//           "Please enter a valid purchase price."
//         );

//         return;
//       }

//     }


//     setSaving(true);

//     try {

//       const payload = {

//         vendorName:
//           form.vendorName.trim(),

//         vendorPhone:
//           form.vendorPhone.trim(),

//         vendorEmail:
//           form.vendorEmail.trim(),

//         vendorInvoiceNumber:
//           form.vendorInvoiceNumber.trim(),

//         invoiceDate:
//           form.invoiceDate,

//         notes:
//           form.notes.trim(),

//         items:
//           form.items.map((item) => ({
//             product:
//               item.product.trim(),

//             quantity:
//               Number(item.quantity),

//             purchasePrice:
//               Number(item.purchasePrice),

//             gst:
//               Number(item.gst || 0),
//           })),

//       };


//       await purchaseApi.create(
//         payload
//       );


//       setForm(
//         createEmptyForm()
//       );


//       setSuccess(
//         "Purchase created successfully."
//       );


//       await load();

//     } catch (err) {

//       console.error(
//         "Create purchase error:",
//         err
//       );

//       setError(
//         getApiError(err) ||
//         "Unable to create purchase."
//       );

//     } finally {

//       setSaving(false);

//     }

//   };


//   // ====================================================
//   // VERIFY PURCHASE
//   // ====================================================

//   const verify = async (
//     purchaseId
//   ) => {

//     if (!purchaseId) {
//       return;
//     }

//     setError("");
//     setSuccess("");
//     setProcessingId(purchaseId);

//     try {

//       await purchaseApi.verify(
//         purchaseId
//       );


//       setSuccess(
//         "Purchase verified successfully."
//       );


//       await load();

//     } catch (err) {

//       console.error(
//         "Verify purchase error:",
//         err
//       );

//       setError(
//         getApiError(err) ||
//         "Unable to verify purchase."
//       );

//     } finally {

//       setProcessingId(null);

//     }

//   };


//   // ====================================================
//   // OPEN PAYMENT MODAL
//   // ====================================================

//   const openPayment = (
//     purchase
//   ) => {

//     if (!purchase?._id) {
//       return;
//     }

//     setError("");

//     setPayment({
//       amount:
//         Number(
//           purchase.pendingAmount || 0
//         ),

//       paymentMode:
//         "CASH",

//       paymentDate:
//         new Date()
//           .toISOString()
//           .slice(0, 10),
//     });

//     setPaying(purchase);

//   };


//   // ====================================================
//   // RECORD PAYMENT
//   // ====================================================

//   const recordPayment = async (
//     event
//   ) => {

//     event.preventDefault();

//     if (!paying?._id) {
//       return;
//     }

//     setError("");
//     setSuccess("");

//     const amount =
//       Number(payment.amount);

//     const pending =
//       Number(
//         paying.pendingAmount || 0
//       );


//     if (
//       !Number.isFinite(amount) ||
//       amount <= 0
//     ) {

//       setError(
//         "Please enter a valid payment amount."
//       );

//       return;
//     }


//     if (
//       amount > pending
//     ) {

//       setError(
//         `Payment cannot exceed pending amount ${money(
//           pending
//         )}.`
//       );

//       return;
//     }


//     setProcessingId(
//       paying._id
//     );


//     try {

//       await purchaseApi.pay(
//         paying._id,
//         {
//           amount,
//           paymentMode:
//             payment.paymentMode,

//           paymentDate:
//             payment.paymentDate,
//         }
//       );


//       setPaying(null);

//       setPayment(
//         createEmptyPayment()
//       );


//       setSuccess(
//         "Vendor payment recorded successfully."
//       );


//       await load();

//     } catch (err) {

//       console.error(
//         "Vendor payment error:",
//         err
//       );

//       setError(
//         getApiError(err) ||
//         "Unable to record vendor payment."
//       );

//     } finally {

//       setProcessingId(null);

//     }

//   };


//   // ====================================================
//   // DELETE PURCHASE
//   // ====================================================

//   const remove = async (
//     purchaseId
//   ) => {

//     if (!purchaseId) {
//       return;
//     }


//     const confirmed =
//       window.confirm(
//         "Delete this purchase?"
//       );


//     if (!confirmed) {
//       return;
//     }


//     setError("");
//     setSuccess("");
//     setProcessingId(purchaseId);


//     try {

//       await purchaseApi.remove(
//         purchaseId
//       );


//       setSuccess(
//         "Purchase deleted successfully."
//       );


//       await load();

//     } catch (err) {

//       console.error(
//         "Delete purchase error:",
//         err
//       );

//       setError(
//         getApiError(err) ||
//         "Unable to delete purchase."
//       );

//     } finally {

//       setProcessingId(null);

//     }

//   };


//   // ====================================================
//   // VIEW PURCHASE
//   // ====================================================

//   const viewPurchase = async (
//     purchaseId
//   ) => {

//     if (!purchaseId) {
//       return;
//     }

//     setError("");
//     setLoadingPurchase(true);

//     try {

//       const response =
//         await purchaseApi.get(
//           purchaseId
//         );


//       const data =
//         getResponseData(response);


//       const purchase =
//         data?.data ||
//         data;


//       setViewingPurchase(
//         purchase
//       );

//     } catch (err) {

//       console.error(
//         "Get purchase error:",
//         err
//       );

//       setError(
//         getApiError(err) ||
//         "Unable to load purchase details."
//       );

//     } finally {

//       setLoadingPurchase(false);

//     }

//   };


//   // ====================================================
//   // STATUS CLASS
//   // ====================================================

//   const getStatusClass = (
//     status
//   ) => {

//     return String(
//       status || "PENDING"
//     )
//       .toLowerCase()
//       .replace(/\s+/g, "-");

//   };


//   // ====================================================
//   // RENDER
//   // ====================================================

//   return (

//     <div className="accounting-page">

//       <style>
//         {css}
//       </style>


//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div className="page-head">

//         <div className="page-title-area">

//           <h1>
//             Purchase & Vendor Payments
//           </h1>

//           <p>
//             Record purchases, verify invoices
//             and record vendor payments.
//           </p>

//         </div>


//         <button
//           type="button"
//           className="refresh-btn"
//           onClick={load}
//           disabled={loading}
//         >
//           <FaSyncAlt
//             className={
//               loading
//                 ? "spin"
//                 : ""
//             }
//           />

//           <span>
//             Refresh
//           </span>
//         </button>

//       </div>


//       {/* =================================================
//           SUMMARY CARDS
//       ================================================= */}

//       <div className="summary-grid">

//         <div className="summary-card">

//           <div className="summary-label">
//             Total Purchases
//           </div>

//           <strong>
//             {totalPurchases}
//           </strong>

//         </div>


//         <div className="summary-card">

//           <div className="summary-label">
//             Purchase Value
//           </div>

//           <strong>
//             {money(
//               totalPurchaseValue
//             )}
//           </strong>

//         </div>


//         <div className="summary-card">

//           <div className="summary-label">
//             Paid Amount
//           </div>

//           <strong>
//             {money(totalPaid)}
//           </strong>

//         </div>


//         <div className="summary-card pending-summary">

//           <div className="summary-label">
//             Pending Vendor Payments
//           </div>

//           <strong>
//             {money(totalPending)}
//           </strong>

//           <small>
//             {pendingPurchases.length} purchase(s)
//           </small>

//         </div>

//       </div>


//       {/* =================================================
//           SUCCESS
//       ================================================= */}

//       {success && (

//         <div className="success-alert">

//           <FaCheck />

//           <span>
//             {success}
//           </span>

//           <button
//             type="button"
//             onClick={() => setSuccess("")}
//           >
//             <FaTimes />
//           </button>

//         </div>

//       )}


//       {/* =================================================
//           ERROR
//       ================================================= */}

//       {error && (

//         <div className="alert">

//           <div className="alert-content">

//             <FaTimes />

//             <span>
//               {error}
//             </span>

//           </div>

//           <button
//             type="button"
//             onClick={() => setError("")}
//           >
//             <FaTimes />
//           </button>

//         </div>

//       )}


//       {/* =================================================
//           CREATE PURCHASE
//       ================================================= */}

//       <form
//         className="panel"
//         onSubmit={submit}
//       >

//         <div className="panel-header">

//           <div>

//             <h2>
//               Create Purchase
//             </h2>

//             <p>
//               Add vendor and purchase item details.
//             </p>

//           </div>

//         </div>


//         <div className="form-grid">

//           {/* Vendor Name */}

//           <label>

//             <span>
//               Vendor Name
//               <b>*</b>
//             </span>

//             <input
//               required
//               type="text"
//               value={form.vendorName}
//               onChange={(e) =>
//                 handleFormChange(
//                   "vendorName",
//                   e.target.value
//                 )
//               }
//               placeholder="Enter vendor name"
//             />

//           </label>


//           {/* Vendor Phone */}

//           <label>

//             <span>
//               Vendor Phone
//             </span>

//             <input
//               type="text"
//               value={form.vendorPhone}
//               onChange={(e) =>
//                 handleFormChange(
//                   "vendorPhone",
//                   e.target.value
//                 )
//               }
//               placeholder="Enter phone number"
//             />

//           </label>


//           {/* Vendor Email */}

//           <label>

//             <span>
//               Vendor Email
//             </span>

//             <input
//               type="email"
//               value={form.vendorEmail}
//               onChange={(e) =>
//                 handleFormChange(
//                   "vendorEmail",
//                   e.target.value
//                 )
//               }
//               placeholder="vendor@example.com"
//             />

//           </label>


//           {/* Invoice Number */}

//           <label>

//             <span>
//               Vendor Invoice No.
//             </span>

//             <input
//               type="text"
//               value={
//                 form.vendorInvoiceNumber
//               }
//               onChange={(e) =>
//                 handleFormChange(
//                   "vendorInvoiceNumber",
//                   e.target.value
//                 )
//               }
//               placeholder="Invoice number"
//             />

//           </label>


//           {/* Invoice Date */}

//           <label>

//             <span>
//               Invoice Date
//             </span>

//             <input
//               type="date"
//               value={form.invoiceDate}
//               onChange={(e) =>
//                 handleFormChange(
//                   "invoiceDate",
//                   e.target.value
//                 )
//               }
//             />

//           </label>


//           {/* Notes */}

//           <label className="wide">

//             <span>
//               Notes
//             </span>

//             <textarea
//               value={form.notes}
//               onChange={(e) =>
//                 handleFormChange(
//                   "notes",
//                   e.target.value
//                 )
//               }
//               placeholder="Optional notes..."
//             />

//           </label>

//         </div>


//         {/* =================================================
//             ITEMS HEADER
//         ================================================= */}

//         <div className="items-head">

//           <div>

//             <h3>
//               Purchase Items
//             </h3>

//             <p>
//               Add products included in this purchase.
//             </p>

//           </div>


//           <button
//             type="button"
//             className="btn ghost"
//             onClick={addItem}
//           >

//             <FaPlus />

//             Add Item

//           </button>

//         </div>


//         {/* =================================================
//             ITEMS
//         ================================================= */}

//         <div className="items-list">

//           {form.items.map(
//             (item, index) => (

//               <div
//                 className="item-row"
//                 key={index}
//               >

//                 <div className="item-number">
//                   {index + 1}
//                 </div>


//                 {/* Product ID */}

//                 <label>

//                   <span>
//                     Product ID
//                     <b>*</b>
//                   </span>

//                   <input
//                     required
//                     type="text"
//                     value={item.product}
//                     placeholder="MongoDB Product _id"
//                     onChange={(e) =>
//                       setItem(
//                         index,
//                         "product",
//                         e.target.value
//                       )
//                     }
//                   />

//                 </label>


//                 {/* Quantity */}

//                 <label>

//                   <span>
//                     Quantity
//                     <b>*</b>
//                   </span>

//                   <input
//                     required
//                     type="number"
//                     min="1"
//                     step="1"
//                     value={item.quantity}
//                     onChange={(e) =>
//                       setItem(
//                         index,
//                         "quantity",
//                         e.target.value
//                       )
//                     }
//                   />

//                 </label>


//                 {/* Purchase Price */}

//                 <label>

//                   <span>
//                     Purchase Price
//                     <b>*</b>
//                   </span>

//                   <input
//                     required
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     value={
//                       item.purchasePrice
//                     }
//                     placeholder="0.00"
//                     onChange={(e) =>
//                       setItem(
//                         index,
//                         "purchasePrice",
//                         e.target.value
//                       )
//                     }
//                   />

//                 </label>


//                 {/* GST */}

//                 <label>

//                   <span>
//                     GST %
//                   </span>

//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     value={item.gst}
//                     onChange={(e) =>
//                       setItem(
//                         index,
//                         "gst",
//                         e.target.value
//                       )
//                     }
//                   />

//                 </label>


//                 {/* Remove */}

//                 <button
//                   type="button"
//                   className="remove-item-btn"
//                   onClick={() =>
//                     removeItem(index)
//                   }
//                   disabled={
//                     form.items.length === 1
//                   }
//                   title="Remove item"
//                 >
//                   <FaTimes />
//                 </button>

//               </div>

//             )
//           )}

//         </div>


//         {/* =================================================
//             CREATE BUTTON
//         ================================================= */}

//         <div className="form-actions">

//           <button
//             type="submit"
//             className="btn primary create-btn"
//             disabled={saving}
//           >

//             {saving ? (

//               <>
//                 <span className="button-loader" />
//                 Saving...
//               </>

//             ) : (

//               <>
//                 <FaPlus />
//                 Create Purchase
//               </>

//             )}

//           </button>

//         </div>

//       </form>


//       {/* =================================================
//           PURCHASE LIST
//       ================================================= */}

//       <div className="panel">

//         <div className="toolbar">

//           <div>

//             <h2>
//               Purchases
//             </h2>

//             <p>
//               All active purchase records.
//             </p>

//           </div>


//           <div className="search">

//             <FaSearch />

//             <input
//               type="text"
//               placeholder="Search purchase, vendor..."
//               value={search}
//               onChange={(e) =>
//                 setSearch(e.target.value)
//               }
//             />

//             {search && (

//               <button
//                 type="button"
//                 onClick={() =>
//                   setSearch("")
//                 }
//               >
//                 <FaTimes />
//               </button>

//             )}

//           </div>

//         </div>


//         {/* =================================================
//             LOADING
//         ================================================= */}

//         {loading ? (

//           <div className="loading-box">

//             <div className="loader" />

//             <span>
//               Loading purchases...
//             </span>

//           </div>

//         ) : filtered.length === 0 ? (

//           <div className="empty">

//             <div className="empty-icon">
//               <FaEye />
//             </div>

//             <h3>
//               No purchases found
//             </h3>

//             <p>
//               {search
//                 ? "Try a different search."
//                 : "Create your first purchase using the form above."}
//             </p>

//           </div>

//         ) : (

//           <div className="table-wrap">

//             <table>

//               <thead>

//                 <tr>

//                   <th>
//                     Purchase
//                   </th>

//                   <th>
//                     Vendor
//                   </th>

//                   <th>
//                     Invoice
//                   </th>

//                   <th>
//                     Total
//                   </th>

//                   <th>
//                     Paid
//                   </th>

//                   <th>
//                     Pending
//                   </th>

//                   <th>
//                     Status
//                   </th>

//                   <th>
//                     Verified
//                   </th>

//                   <th>
//                     Actions
//                   </th>

//                 </tr>

//               </thead>


//               <tbody>

//                 {filtered.map(
//                   (purchase) => {

//                     const isProcessing =
//                       processingId ===
//                       purchase._id;

//                     return (

//                       <tr
//                         key={
//                           purchase._id
//                         }
//                       >

//                         <td>

//                           <div className="purchase-number">

//                             {purchase.purchaseNumber ||
//                               "-"}

//                           </div>

//                           <small>
//                             {purchase.invoiceDate
//                               ? new Date(
//                                   purchase.invoiceDate
//                                 ).toLocaleDateString(
//                                   "en-IN"
//                                 )
//                               : "-"}
//                           </small>

//                         </td>


//                         <td>

//                           <div className="vendor-name">
//                             {purchase.vendorName ||
//                               "-"}
//                           </div>

//                           {purchase.vendorPhone && (

//                             <small>
//                               {purchase.vendorPhone}
//                             </small>

//                           )}

//                         </td>


//                         <td>

//                           {purchase.vendorInvoiceNumber ||
//                             "-"}

//                         </td>


//                         <td className="amount-cell">

//                           {money(
//                             purchase.totalAmount
//                           )}

//                         </td>


//                         <td className="amount-cell paid-text">

//                           {money(
//                             purchase.paidAmount
//                           )}

//                         </td>


//                         <td className="amount-cell pending-text">

//                           {money(
//                             purchase.pendingAmount
//                           )}

//                         </td>


//                         <td>

//                           <span
//                             className={`badge ${getStatusClass(
//                               purchase.paymentStatus
//                             )}`}
//                           >

//                             {purchase.paymentStatus ||
//                               "PENDING"}

//                           </span>

//                         </td>


//                         <td>

//                           {purchase.verified ? (

//                             <span className="verified">

//                               <FaCheck />

//                               Yes

//                             </span>

//                           ) : (

//                             <span className="not-verified">
//                               No
//                             </span>

//                           )}

//                         </td>


//                         <td>

//                           <div className="action-buttons">

//                             {/* VIEW */}

//                             <button
//                               type="button"
//                               className="small-btn view-btn"
//                               onClick={() =>
//                                 viewPurchase(
//                                   purchase._id
//                                 )
//                               }
//                               title="View purchase"
//                             >

//                               <FaEye />

//                               <span>
//                                 View
//                               </span>

//                             </button>


//                             {/* VERIFY */}

//                             {!purchase.verified && (

//                               <button
//                                 type="button"
//                                 className="small-btn verify-btn"
//                                 onClick={() =>
//                                   verify(
//                                     purchase._id
//                                   )
//                                 }
//                                 disabled={
//                                   isProcessing
//                                 }
//                               >

//                                 <FaCheck />

//                                 <span>
//                                   {isProcessing
//                                     ? "..."
//                                     : "Verify"}
//                                 </span>

//                               </button>

//                             )}


//                             {/* PAY */}

//                             {purchase.verified &&
//                               Number(
//                                 purchase.pendingAmount
//                               ) > 0 && (

//                                 <button
//                                   type="button"
//                                   className="small-btn pay-btn"
//                                   onClick={() =>
//                                     openPayment(
//                                       purchase
//                                     )
//                                   }
//                                   disabled={
//                                     isProcessing
//                                   }
//                                 >

//                                   <FaRupeeSign />

//                                   <span>
//                                     Pay
//                                   </span>

//                                 </button>

//                               )}


//                             {/* DELETE */}

//                             <button
//                               type="button"
//                               className="icon-btn danger"
//                               onClick={() =>
//                                 remove(
//                                   purchase._id
//                                 )
//                               }
//                               disabled={
//                                 isProcessing
//                               }
//                               title="Delete purchase"
//                             >

//                               <FaTrash />

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

//       </div>


//       {/* =================================================
//           PAYMENT MODAL
//       ================================================= */}

//       {paying && (

//         <div
//           className="modal-backdrop"
//           onMouseDown={(event) => {

//             if (
//               event.target ===
//               event.currentTarget
//             ) {
//               setPaying(null);
//             }

//           }}
//         >

//           <form
//             className="modal"
//             onSubmit={recordPayment}
//           >

//             <div className="modal-header">

//               <div>

//                 <h2>
//                   Record Vendor Payment
//                 </h2>

//                 <p>
//                   {paying.purchaseNumber ||
//                     "Purchase"}
//                 </p>

//               </div>


//               <button
//                 type="button"
//                 className="modal-close"
//                 onClick={() =>
//                   setPaying(null)
//                 }
//               >
//                 <FaTimes />
//               </button>

//             </div>


//             <div className="payment-summary">

//               <div>

//                 <span>
//                   Purchase Total
//                 </span>

//                 <strong>
//                   {money(
//                     paying.totalAmount
//                   )}
//                 </strong>

//               </div>


//               <div>

//                 <span>
//                   Already Paid
//                 </span>

//                 <strong>
//                   {money(
//                     paying.paidAmount
//                   )}
//                 </strong>

//               </div>


//               <div>

//                 <span>
//                   Pending
//                 </span>

//                 <strong className="pending-text">
//                   {money(
//                     paying.pendingAmount
//                   )}
//                 </strong>

//               </div>

//             </div>


//             <label>

//               <span>
//                 Payment Amount
//                 <b>*</b>
//               </span>

//               <div className="money-input">

//                 <FaRupeeSign />

//                 <input
//                   autoFocus
//                   type="number"
//                   min="0.01"
//                   max={
//                     paying.pendingAmount
//                   }
//                   step="0.01"
//                   required
//                   value={
//                     payment.amount
//                   }
//                   onChange={(e) =>
//                     setPayment(
//                       (previous) => ({
//                         ...previous,
//                         amount:
//                           e.target.value,
//                       })
//                     )
//                   }
//                 />

//               </div>

//             </label>


//             <label>

//               <span>
//                 Payment Mode
//               </span>

//               <select
//                 value={
//                   payment.paymentMode
//                 }
//                 onChange={(e) =>
//                   setPayment(
//                     (previous) => ({
//                       ...previous,
//                       paymentMode:
//                         e.target.value,
//                     })
//                   )
//                 }
//               >

//                 <option value="CASH">
//                   CASH
//                 </option>

//                 <option value="BANK">
//                   BANK
//                 </option>

//                 <option value="UPI">
//                   UPI
//                 </option>

//               </select>

//             </label>


//             <label>

//               <span>
//                 Payment Date
//               </span>

//               <input
//                 type="date"
//                 value={
//                   payment.paymentDate
//                 }
//                 onChange={(e) =>
//                   setPayment(
//                     (previous) => ({
//                       ...previous,
//                       paymentDate:
//                         e.target.value,
//                     })
//                   )
//                 }
//               />

//             </label>


//             <div className="actions">

//               <button
//                 type="submit"
//                 className="btn primary"
//                 disabled={
//                   processingId ===
//                   paying._id
//                 }
//               >

//                 <FaRupeeSign />

//                 {processingId ===
//                 paying._id
//                   ? "Recording..."
//                   : "Record Payment"}

//               </button>


//               <button
//                 type="button"
//                 className="btn ghost"
//                 onClick={() =>
//                   setPaying(null)
//                 }
//               >

//                 Cancel

//               </button>

//             </div>

//           </form>

//         </div>

//       )}


//       {/* =================================================
//           VIEW PURCHASE MODAL
//       ================================================= */}

//       {viewingPurchase && (

//         <div
//           className="modal-backdrop"
//           onMouseDown={(event) => {

//             if (
//               event.target ===
//               event.currentTarget
//             ) {
//               setViewingPurchase(null);
//             }

//           }}
//         >

//           <div className="modal view-modal">

//             <div className="modal-header">

//               <div>

//                 <h2>
//                   Purchase Details
//                 </h2>

//                 <p>
//                   {
//                     viewingPurchase.purchaseNumber
//                   }
//                 </p>

//               </div>


//               <button
//                 type="button"
//                 className="modal-close"
//                 onClick={() =>
//                   setViewingPurchase(
//                     null
//                   )
//                 }
//               >

//                 <FaTimes />

//               </button>

//             </div>


//             {loadingPurchase ? (

//               <div className="loading-box">
//                 Loading...
//               </div>

//             ) : (

//               <>

//                 <div className="detail-grid">

//                   <div>
//                     <span>
//                       Vendor
//                     </span>

//                     <strong>
//                       {
//                         viewingPurchase.vendorName ||
//                         "-"
//                       }
//                     </strong>
//                   </div>


//                   <div>
//                     <span>
//                       Phone
//                     </span>

//                     <strong>
//                       {
//                         viewingPurchase.vendorPhone ||
//                         "-"
//                       }
//                     </strong>
//                   </div>


//                   <div>
//                     <span>
//                       Email
//                     </span>

//                     <strong>
//                       {
//                         viewingPurchase.vendorEmail ||
//                         "-"
//                       }
//                     </strong>
//                   </div>


//                   <div>
//                     <span>
//                       Invoice
//                     </span>

//                     <strong>
//                       {
//                         viewingPurchase.vendorInvoiceNumber ||
//                         "-"
//                       }
//                     </strong>
//                   </div>


//                   <div>
//                     <span>
//                       Subtotal
//                     </span>

//                     <strong>
//                       {money(
//                         viewingPurchase.subtotal
//                       )}
//                     </strong>
//                   </div>


//                   <div>
//                     <span>
//                       GST
//                     </span>

//                     <strong>
//                       {money(
//                         viewingPurchase.gstAmount
//                       )}
//                     </strong>
//                   </div>


//                   <div>
//                     <span>
//                       Total
//                     </span>

//                     <strong>
//                       {money(
//                         viewingPurchase.totalAmount
//                       )}
//                     </strong>
//                   </div>


//                   <div>
//                     <span>
//                       Payment Status
//                     </span>

//                     <strong>
//                       {
//                         viewingPurchase.paymentStatus ||
//                         "-"
//                       }
//                     </strong>
//                   </div>

//                 </div>


//                 <div className="details-items">

//                   <h3>
//                     Items
//                   </h3>


//                   <div className="details-table-wrap">

//                     <table>

//                       <thead>

//                         <tr>

//                           <th>
//                             Product
//                           </th>

//                           <th>
//                             Qty
//                           </th>

//                           <th>
//                             Price
//                           </th>

//                           <th>
//                             GST
//                           </th>

//                           <th>
//                             Total
//                           </th>

//                         </tr>

//                       </thead>


//                       <tbody>

//                         {Array.isArray(
//                           viewingPurchase.items
//                         ) &&
//                           viewingPurchase.items.map(
//                             (item, index) => (

//                               <tr
//                                 key={
//                                   item._id ||
//                                   index
//                                 }
//                               >

//                                 <td>
//                                   {
//                                     item.productName ||
//                                     item.product?.name ||
//                                     "-"
//                                   }
//                                 </td>

//                                 <td>
//                                   {
//                                     item.quantity
//                                   }
//                                 </td>

//                                 <td>
//                                   {money(
//                                     item.purchasePrice
//                                   )}
//                                 </td>

//                                 <td>
//                                   {
//                                     item.gst || 0
//                                   }%
//                                 </td>

//                                 <td>
//                                   {money(
//                                     item.totalAmount
//                                   )}
//                                 </td>

//                               </tr>

//                             )
//                           )}

//                       </tbody>

//                     </table>

//                   </div>

//                 </div>


//                 {viewingPurchase.notes && (

//                   <div className="notes-box">

//                     <strong>
//                       Notes
//                     </strong>

//                     <p>
//                       {
//                         viewingPurchase.notes
//                       }
//                     </p>

//                   </div>

//                 )}

//               </>

//             )}

//           </div>

//         </div>

//       )}

//     </div>

//   );

// }


// // ======================================================
// // CSS
// // ======================================================

// const css = `

// * {
//   box-sizing: border-box;
// }


// /* ======================================================
//    PAGE
// ====================================================== */

// .accounting-page {
//   width: 100%;
//   min-height: 100vh;
//   padding: 24px;
//   background: #f7f9fc;
//   color: #172033;
//   font-family: Poppins, Arial, sans-serif;
// }


// /* ======================================================
//    HEADER
// ====================================================== */

// .page-head {
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 20px;
//   margin-bottom: 22px;
// }

// .page-title-area h1 {
//   margin: 0;
//   font-size: 28px;
//   line-height: 1.25;
//   font-weight: 700;
//   color: #172033;
// }

// .page-title-area p {
//   margin: 7px 0 0;
//   color: #718096;
//   font-size: 14px;
// }

// .refresh-btn {
//   min-height: 42px;
//   border: 1px solid #dce3eb;
//   background: #ffffff;
//   color: #273444;
//   border-radius: 9px;
//   padding: 0 15px;
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   gap: 8px;
//   cursor: pointer;
//   font-weight: 600;
// }

// .refresh-btn:hover {
//   background: #f1f5f9;
// }

// .refresh-btn:disabled {
//   opacity: .6;
//   cursor: not-allowed;
// }


// /* ======================================================
//    SUMMARY
// ====================================================== */

// .summary-grid {
//   width: 100%;
//   display: grid;
//   grid-template-columns: repeat(4, minmax(0, 1fr));
//   gap: 16px;
//   margin-bottom: 20px;
// }

// .summary-card {
//   min-width: 0;
//   background: #ffffff;
//   border: 1px solid #e6eaf0;
//   border-radius: 14px;
//   padding: 18px 20px;
//   box-shadow: 0 3px 15px rgba(0,0,0,.03);
// }

// .summary-label {
//   color: #718096;
//   font-size: 12px;
//   margin-bottom: 8px;
// }

// .summary-card strong {
//   display: block;
//   font-size: 23px;
//   line-height: 1.2;
//   color: #172033;
// }

// .summary-card small {
//   display: block;
//   margin-top: 6px;
//   color: #718096;
//   font-size: 12px;
// }

// .pending-summary strong {
//   color: #946200;
// }


// /* ======================================================
//    ALERTS
// ====================================================== */

// .alert,
// .success-alert {
//   width: 100%;
//   border-radius: 10px;
//   padding: 12px 14px;
//   margin-bottom: 16px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 12px;
// }

// .alert {
//   background: #fff0f0;
//   color: #b42318;
//   border: 1px solid #ffd2d2;
// }

// .success-alert {
//   background: #eaf8f0;
//   color: #157347;
//   border: 1px solid #c9ead8;
// }

// .alert-content {
//   display: flex;
//   align-items: center;
//   gap: 9px;
// }

// .alert button,
// .success-alert button {
//   border: 0;
//   background: transparent;
//   color: inherit;
//   cursor: pointer;
//   padding: 4px;
// }


// /* ======================================================
//    PANEL
// ====================================================== */

// .panel {
//   width: 100%;
//   background: #ffffff;
//   border: 1px solid #e6eaf0;
//   border-radius: 14px;
//   padding: 20px;
//   margin-bottom: 20px;
//   box-shadow: 0 3px 15px rgba(0,0,0,.03);
// }

// .panel-header {
//   margin-bottom: 18px;
// }

// .panel-header h2,
// .toolbar h2 {
//   margin: 0;
//   font-size: 19px;
//   color: #172033;
// }

// .panel-header p,
// .toolbar p {
//   margin: 5px 0 0;
//   color: #718096;
//   font-size: 13px;
// }


// /* ======================================================
//    FORM
// ====================================================== */

// .form-grid {
//   display: grid;
//   grid-template-columns: repeat(4, minmax(0, 1fr));
//   gap: 15px;
// }

// .form-grid .wide {
//   grid-column: 1 / -1;
// }

// label {
//   min-width: 0;
//   display: flex;
//   flex-direction: column;
//   gap: 7px;
//   color: #445;
//   font-size: 13px;
//   font-weight: 600;
// }

// label span {
//   display: block;
// }

// label b {
//   color: #dc2626;
//   margin-left: 3px;
// }

// input,
// select,
// textarea {
//   width: 100%;
//   min-width: 0;
//   border: 1px solid #d9dee7;
//   border-radius: 9px;
//   background: #ffffff;
//   color: #172033;
//   padding: 10px 11px;
//   font: inherit;
//   outline: none;
//   transition: border-color .15s ease,
//               box-shadow .15s ease;
// }

// input:focus,
// select:focus,
// textarea:focus {
//   border-color: #167c5a;
//   box-shadow: 0 0 0 3px rgba(22,124,90,.10);
// }

// textarea {
//   min-height: 75px;
//   resize: vertical;
// }


// /* ======================================================
//    ITEMS
// ====================================================== */

// .items-head {
//   margin: 22px 0 12px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 15px;
// }

// .items-head h3 {
//   margin: 0;
//   font-size: 16px;
// }

// .items-head p {
//   margin: 4px 0 0;
//   color: #718096;
//   font-size: 12px;
// }

// .items-list {
//   width: 100%;
// }

// .item-row {
//   width: 100%;
//   display: grid;
//   grid-template-columns: 32px 2fr 1fr 1.25fr 1fr 40px;
//   gap: 10px;
//   align-items: end;
//   padding: 12px;
//   border: 1px solid #edf0f4;
//   border-radius: 10px;
//   margin-bottom: 9px;
//   background: #fcfdff;
// }

// .item-number {
//   width: 28px;
//   height: 28px;
//   border-radius: 50%;
//   background: #eaf4ef;
//   color: #167c5a;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 12px;
//   font-weight: 700;
//   margin-bottom: 5px;
// }

// .remove-item-btn {
//   width: 40px;
//   height: 40px;
//   border: 0;
//   border-radius: 8px;
//   background: #fff1f1;
//   color: #b42318;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }

// .remove-item-btn:hover {
//   background: #fee2e2;
// }

// .remove-item-btn:disabled {
//   opacity: .4;
//   cursor: not-allowed;
// }


// /* ======================================================
//    BUTTONS
// ====================================================== */

// .btn,
// .small-btn,
// .icon-btn {
//   border: 0;
//   border-radius: 8px;
//   cursor: pointer;
//   font-weight: 600;
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   gap: 7px;
//   transition: .15s ease;
// }

// .btn {
//   min-height: 40px;
//   padding: 9px 14px;
// }

// .primary {
//   background: #167c5a;
//   color: #ffffff;
// }

// .primary:hover {
//   background: #126b4d;
// }

// .primary:disabled {
//   opacity: .65;
//   cursor: not-allowed;
// }

// .ghost {
//   background: #edf1f5;
//   color: #273444;
// }

// .ghost:hover {
//   background: #e2e8f0;
// }

// .form-actions {
//   margin-top: 18px;
//   display: flex;
//   justify-content: flex-end;
// }

// .create-btn {
//   min-width: 165px;
// }


// /* ======================================================
//    TABLE TOOLBAR
// ====================================================== */

// .toolbar {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 20px;
//   margin-bottom: 16px;
// }

// .search {
//   width: min(350px, 100%);
//   min-height: 42px;
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   padding: 0 10px;
//   border: 1px solid #d9dee7;
//   border-radius: 9px;
//   background: #ffffff;
//   color: #718096;
// }

// .search input {
//   border: 0;
//   box-shadow: none;
//   padding: 9px 2px;
// }

// .search input:focus {
//   box-shadow: none;
// }

// .search button {
//   border: 0;
//   background: transparent;
//   color: #718096;
//   cursor: pointer;
//   padding: 4px;
// }


// /* ======================================================
//    TABLE
// ====================================================== */

// .table-wrap {
//   width: 100%;
//   overflow-x: auto;
//   overflow-y: hidden;
//   -webkit-overflow-scrolling: touch;
//   border: 1px solid #edf0f4;
//   border-radius: 10px;
// }

// table {
//   width: 100%;
//   min-width: 1120px;
//   border-collapse: collapse;
// }

// th,
// td {
//   padding: 13px 12px;
//   border-bottom: 1px solid #edf0f4;
//   text-align: left;
//   font-size: 13px;
//   vertical-align: middle;
// }

// th {
//   background: #fafbfc;
//   color: #5b6575;
//   font-weight: 700;
//   white-space: nowrap;
// }

// tbody tr:hover {
//   background: #fafcfd;
// }

// tbody tr:last-child td {
//   border-bottom: 0;
// }

// .purchase-number,
// .vendor-name {
//   font-weight: 700;
//   color: #172033;
// }

// td small {
//   display: block;
//   margin-top: 3px;
//   color: #8490a2;
//   font-size: 11px;
// }

// .amount-cell {
//   white-space: nowrap;
//   font-weight: 600;
// }

// .paid-text {
//   color: #157347;
// }

// .pending-text {
//   color: #946200;
// }


// /* ======================================================
//    BADGES
// ====================================================== */

// .badge {
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   padding: 5px 9px;
//   border-radius: 999px;
//   font-size: 11px;
//   font-weight: 700;
//   white-space: nowrap;
// }

// .badge.paid {
//   background: #e7f7ee;
//   color: #157347;
// }

// .badge.partial {
//   background: #fff4db;
//   color: #946200;
// }

// .badge.pending {
//   background: #fff4db;
//   color: #946200;
// }


// /* ======================================================
//    ACTIONS
// ====================================================== */

// .action-buttons {
//   display: flex;
//   align-items: center;
//   gap: 5px;
//   flex-wrap: wrap;
// }

// .small-btn {
//   min-height: 32px;
//   padding: 6px 9px;
//   font-size: 11px;
// }

// .view-btn {
//   background: #edf4ff;
//   color: #2458a6;
// }

// .verify-btn {
//   background: #eaf4ef;
//   color: #126344;
// }

// .pay-btn {
//   background: #eaf4ef;
//   color: #126344;
// }

// .small-btn:disabled {
//   opacity: .5;
//   cursor: not-allowed;
// }

// .icon-btn {
//   width: 32px;
//   height: 32px;
//   background: #eef3f7;
// }

// .danger {
//   color: #b42318;
// }

// .icon-btn:hover {
//   background: #fee2e2;
// }

// .verified {
//   color: #157347;
//   display: inline-flex;
//   align-items: center;
//   gap: 5px;
//   font-weight: 600;
// }

// .not-verified {
//   color: #8490a2;
// }


// /* ======================================================
//    EMPTY / LOADING
// ====================================================== */

// .loading-box {
//   min-height: 180px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   gap: 12px;
//   color: #718096;
// }

// .loader {
//   width: 30px;
//   height: 30px;
//   border: 3px solid #e5e7eb;
//   border-top-color: #167c5a;
//   border-radius: 50%;
//   animation: spin 0.8s linear infinite;
// }

// .button-loader {
//   width: 15px;
//   height: 15px;
//   border: 2px solid rgba(255,255,255,.4);
//   border-top-color: #ffffff;
//   border-radius: 50%;
//   animation: spin .7s linear infinite;
// }

// .spin {
//   animation: spin .8s linear infinite;
// }

// .empty {
//   min-height: 220px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   text-align: center;
//   color: #718096;
// }

// .empty-icon {
//   width: 45px;
//   height: 45px;
//   border-radius: 50%;
//   background: #eef3f7;
//   color: #718096;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin-bottom: 10px;
// }

// .empty h3 {
//   margin: 0;
//   color: #273444;
// }

// .empty p {
//   margin: 6px 0 0;
//   font-size: 13px;
// }


// /* ======================================================
//    MODAL
// ====================================================== */

// .modal-backdrop {
//   position: fixed;
//   inset: 0;
//   z-index: 9999;
//   background: rgba(15,23,42,.48);
//   padding: 20px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   overflow-y: auto;
// }

// .modal {
//   width: min(460px, 100%);
//   max-height: calc(100vh - 40px);
//   overflow-y: auto;
//   background: #ffffff;
//   border-radius: 15px;
//   padding: 22px;
//   display: grid;
//   gap: 15px;
//   box-shadow: 0 20px 60px rgba(0,0,0,.20);
// }

// .view-modal {
//   width: min(800px, 100%);
// }

// .modal-header {
//   display: flex;
//   align-items: flex-start;
//   justify-content: space-between;
//   gap: 15px;
// }

// .modal-header h2 {
//   margin: 0;
//   font-size: 20px;
// }

// .modal-header p {
//   margin: 5px 0 0;
//   color: #718096;
//   font-size: 13px;
// }

// .modal-close {
//   width: 34px;
//   height: 34px;
//   border: 0;
//   border-radius: 8px;
//   background: #f1f5f9;
//   color: #475569;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }

// .modal-close:hover {
//   background: #fee2e2;
//   color: #b42318;
// }


// /* ======================================================
//    PAYMENT
// ====================================================== */

// .payment-summary {
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 10px;
//   padding: 13px;
//   background: #f8fafc;
//   border-radius: 10px;
// }

// .payment-summary div {
//   min-width: 0;
// }

// .payment-summary span {
//   display: block;
//   font-size: 11px;
//   color: #718096;
//   margin-bottom: 4px;
// }

// .payment-summary strong {
//   font-size: 15px;
// }

// .money-input {
//   display: flex;
//   align-items: center;
//   border: 1px solid #d9dee7;
//   border-radius: 9px;
//   padding-left: 11px;
//   color: #64748b;
// }

// .money-input input {
//   border: 0;
//   box-shadow: none;
// }

// .money-input input:focus {
//   box-shadow: none;
// }

// .actions {
//   display: flex;
//   align-items: center;
//   justify-content: flex-end;
//   gap: 10px;
//   margin-top: 5px;
// }


// /* ======================================================
//    VIEW DETAILS
// ====================================================== */

// .detail-grid {
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 12px;
// }

// .detail-grid > div {
//   padding: 12px;
//   border: 1px solid #edf0f4;
//   border-radius: 9px;
//   min-width: 0;
// }

// .detail-grid span {
//   display: block;
//   color: #718096;
//   font-size: 11px;
//   margin-bottom: 5px;
// }

// .detail-grid strong {
//   display: block;
//   color: #172033;
//   font-size: 13px;
//   overflow-wrap: anywhere;
// }

// .details-items {
//   margin-top: 5px;
// }

// .details-items h3 {
//   margin: 0 0 10px;
//   font-size: 15px;
// }

// .details-table-wrap {
//   overflow-x: auto;
//   border: 1px solid #edf0f4;
//   border-radius: 9px;
// }

// .details-table-wrap table {
//   min-width: 620px;
// }

// .notes-box {
//   padding: 12px;
//   background: #f8fafc;
//   border-radius: 9px;
// }

// .notes-box strong {
//   font-size: 13px;
// }

// .notes-box p {
//   margin: 5px 0 0;
//   white-space: pre-wrap;
//   color: #5b6575;
//   font-size: 13px;
// }


// /* ======================================================
//    ANIMATION
// ====================================================== */

// @keyframes spin {
//   from {
//     transform: rotate(0deg);
//   }

//   to {
//     transform: rotate(360deg);
//   }
// }


// /* ======================================================
//    LARGE TABLET
// ====================================================== */

// @media (max-width: 1200px) {

//   .summary-grid {
//     grid-template-columns:
//       repeat(2, minmax(0, 1fr));
//   }

//   .form-grid {
//     grid-template-columns:
//       repeat(2, minmax(0, 1fr));
//   }

//   .item-row {
//     grid-template-columns:
//       32px
//       repeat(2, minmax(0, 1fr))
//       40px;
//   }

//   .item-row label:nth-of-type(1) {
//     grid-column: span 2;
//   }

//   .item-row label:nth-of-type(2),
//   .item-row label:nth-of-type(3),
//   .item-row label:nth-of-type(4) {
//     grid-column: span 1;
//   }

// }


// /* ======================================================
//    TABLET
// ====================================================== */

// @media (max-width: 900px) {

//   .accounting-page {
//     padding: 18px;
//   }

//   .page-head {
//     align-items: flex-start;
//   }

//   .detail-grid {
//     grid-template-columns:
//       repeat(2, minmax(0, 1fr));
//   }

//   .toolbar {
//     align-items: stretch;
//     flex-direction: column;
//   }

//   .search {
//     width: 100%;
//   }

// }


// /* ======================================================
//    MOBILE
// ====================================================== */

// @media (max-width: 600px) {

//   .accounting-page {
//     padding: 12px;
//   }

//   .page-head {
//     flex-direction: column;
//     gap: 12px;
//   }

//   .page-title-area h1 {
//     font-size: 22px;
//   }

//   .page-title-area p {
//     font-size: 12px;
//   }

//   .refresh-btn {
//     width: 100%;
//   }

//   .summary-grid {
//     grid-template-columns: 1fr;
//     gap: 10px;
//   }

//   .summary-card {
//     padding: 15px;
//   }

//   .panel {
//     padding: 14px;
//     border-radius: 11px;
//   }

//   .form-grid {
//     grid-template-columns: 1fr;
//     gap: 12px;
//   }

//   .form-grid .wide {
//     grid-column: auto;
//   }

//   .items-head {
//     align-items: flex-start;
//     flex-direction: column;
//   }

//   .items-head .btn {
//     width: 100%;
//   }

//   .item-row {
//     grid-template-columns: 1fr;
//     gap: 10px;
//     padding: 12px;
//   }

//   .item-number {
//     margin-bottom: 0;
//   }

//   .item-row label:nth-of-type(1),
//   .item-row label:nth-of-type(2),
//   .item-row label:nth-of-type(3),
//   .item-row label:nth-of-type(4) {
//     grid-column: auto;
//   }

//   .remove-item-btn {
//     width: 100%;
//   }

//   .form-actions {
//     width: 100%;
//   }

//   .create-btn {
//     width: 100%;
//   }

//   .table-wrap {
//     margin-left: 0;
//     margin-right: 0;
//   }

//   .action-buttons {
//     flex-direction: column;
//     align-items: stretch;
//   }

//   .small-btn {
//     width: 100%;
//   }

//   .icon-btn {
//     width: 100%;
//   }

//   .modal-backdrop {
//     padding: 10px;
//     align-items: flex-start;
//   }

//   .modal {
//     max-height: calc(100vh - 20px);
//     padding: 16px;
//     margin-top: 10px;
//   }

//   .payment-summary {
//     grid-template-columns: 1fr;
//   }

//   .detail-grid {
//     grid-template-columns: 1fr;
//   }

//   .actions {
//     flex-direction: column;
//   }

//   .actions .btn {
//     width: 100%;
//   }

// }


// /* ======================================================
//    VERY SMALL DEVICES
// ====================================================== */

// @media (max-width: 380px) {

//   .accounting-page {
//     padding: 9px;
//   }

//   .page-title-area h1 {
//     font-size: 20px;
//   }

//   .panel {
//     padding: 11px;
//   }

//   .summary-card strong {
//     font-size: 20px;
//   }

// }

// `;


import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheck,
  FaDownload,
  FaEye,
  FaFileInvoice,
  FaPlus,
  FaRupeeSign,
  FaSearch,
  FaSyncAlt,
  FaTimes,
} from "react-icons/fa";

// ======================================================
// API
// ======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const token = () => localStorage.getItem("token");

const jsonHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Request failed");
  }

  return result;
};

// ======================================================
// HELPERS
// ======================================================

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const userName = (user) => {
  if (!user) return "—";
  return (
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.name ||
    user.email ||
    "—"
  );
};

const poNumberOf = (purchase) => {
  const po = purchase?.purchaseOrder;
  if (!po) return "Manual";
  if (typeof po === "object") return po.poNumber || po._id || "PO";
  return purchase.purchaseOrderNumber || purchase.poNumber || po;
};

const MODE_LABELS = {
  CASH: "Cash",
  UPI: "UPI",
  BANK_TRANSFER: "Bank Transfer",
  CHEQUE: "Cheque",
  CARD: "Card",
  OTHER: "Other",
};

const UPI_LABELS = {
  PHONEPE: "PhonePe",
  GOOGLE_PAY: "Google Pay",
  PAYTM: "Paytm",
  OTHER: "Other UPI",
};

const invoiceDateOf = (p) => p.invoiceDate || p.createdAt;

const isPayable = (p) =>
  p.verified && Number(p.pendingAmount || 0) > 0;

const TABS = [
  { value: "ALL", label: "All", test: () => true },
  { value: "UNVERIFIED", label: "Unverified", test: (p) => !p.verified },
  { value: "PAYABLE", label: "Payable", test: isPayable },
  {
    value: "PARTIAL",
    label: "Partial",
    test: (p) => p.paymentStatus === "PARTIAL",
  },
  { value: "PAID", label: "Paid", test: (p) => p.paymentStatus === "PAID" },
];

const emptyPayment = (pending) => ({
  amount: pending ? String(pending) : "",
  paymentMode: "CASH",
  paymentDate: todayISO(),
  transactionStatus: "SUCCESS",
  upiApp: "",
  utrNumber: "",
  transactionReference: "",
  bankName: "",
  bankReference: "",
  transferType: "",
  chequeNumber: "",
  chequeDate: "",
  receiptNumber: "",
  notes: "",
});

// ======================================================
// COMPONENT
// ======================================================

export default function PurchaseManagement() {
  const navigate = useNavigate();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [view, setView] = useState("BILLS"); // BILLS | VENDORS
  const [tab, setTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [paying, setPaying] = useState(null);
  const [pay, setPay] = useState(emptyPayment());
  const [slip, setSlip] = useState(null);
  const [payError, setPayError] = useState("");

  const [processingId, setProcessingId] = useState(null);

  // ====================================================
  // LOAD
  // ====================================================

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await request("/api/purchase", {
        headers: jsonHeaders(),
      });

      setPurchases(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message || "Unable to load purchase bills");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 3500);
    return () => clearTimeout(timer);
  }, [success]);

  // ====================================================
  // FILTERS
  // ====================================================

  const inDateRange = useCallback(
    (purchase) => {
      const value = invoiceDateOf(purchase);
      if (!fromDate && !toDate) return true;
      if (!value) return false;
      const day = new Date(value).toISOString().slice(0, 10);
      if (fromDate && day < fromDate) return false;
      if (toDate && day > toDate) return false;
      return true;
    },
    [fromDate, toDate]
  );

  // date + search filtered (before tab) — used for counts & summary
  const scoped = useMemo(() => {
    const term = search.trim().toLowerCase();

    return purchases.filter((p) => {
      if (!inDateRange(p)) return false;
      if (!term) return true;

      return [
        p.purchaseNumber,
        p.vendorName,
        p.vendorInvoiceNumber,
        p.vendorGstNumber,
        poNumberOf(p),
      ].some((value) => String(value || "").toLowerCase().includes(term));
    });
  }, [purchases, search, inDateRange]);

  const counts = useMemo(() => {
    const result = {};
    TABS.forEach((t) => {
      result[t.value] = scoped.filter(t.test).length;
    });
    return result;
  }, [scoped]);

  const filtered = useMemo(() => {
    const current = TABS.find((t) => t.value === tab) || TABS[0];
    return scoped.filter(current.test);
  }, [scoped, tab]);

  // ====================================================
  // SUMMARY (based on date + search filtered bills)
  // ====================================================

  const summary = useMemo(() => {
    const sum = (list, key) =>
      list.reduce((total, item) => total + Number(item[key] || 0), 0);

    const payable = scoped.filter(isPayable);

    return {
      count: scoped.length,
      subtotal: sum(scoped, "subtotal"),
      gst: sum(scoped, "gstAmount"),
      total: sum(scoped, "totalAmount"),
      paid: sum(scoped, "paidAmount"),
      pending: sum(scoped, "pendingAmount"),
      payableAmount: sum(payable, "pendingAmount"),
      payableCount: payable.length,
      unverified: scoped.filter((p) => !p.verified).length,
    };
  }, [scoped]);

  // ====================================================
  // VENDOR-WISE HISAB
  // ====================================================

  const vendorRows = useMemo(() => {
    const map = new Map();

    scoped.forEach((p) => {
      const key = (p.vendorName || "Unknown").trim();

      if (!map.has(key)) {
        map.set(key, {
          vendor: key,
          gstin: p.vendorGstNumber || "",
          bills: 0,
          total: 0,
          paid: 0,
          pending: 0,
        });
      }

      const row = map.get(key);
      row.bills += 1;
      row.total += Number(p.totalAmount || 0);
      row.paid += Number(p.paidAmount || 0);
      row.pending += Number(p.pendingAmount || 0);
    });

    return Array.from(map.values()).sort((a, b) => b.pending - a.pending);
  }, [scoped]);

  // ====================================================
  // DETAIL
  // ====================================================

  const openDetail = async (purchaseId) => {
    setDetailLoading(true);
    setDetail({ _id: purchaseId });

    try {
      const result = await request(`/api/purchase/${purchaseId}`, {
        headers: jsonHeaders(),
      });
      setDetail(result.data);
    } catch (err) {
      setDetail(null);
      setError(err.message || "Unable to load bill details");
    } finally {
      setDetailLoading(false);
    }
  };

  const refreshDetail = async (purchaseId) => {
    try {
      const result = await request(`/api/purchase/${purchaseId}`, {
        headers: jsonHeaders(),
      });
      setDetail((current) =>
        current && current._id === purchaseId ? result.data : current
      );
    } catch {
      /* ignore */
    }
  };

  // ====================================================
  // VERIFY
  // ====================================================

  const verify = async (purchase) => {
    const confirmed = window.confirm(
      `Verify purchase bill ${purchase.purchaseNumber}?\n\nVerify karne ke baad hi vendor payment record hoga.`
    );

    if (!confirmed) return;

    setError("");
    setProcessingId(purchase._id);

    try {
      await request(`/api/purchase/${purchase._id}/verify`, {
        method: "PUT",
        headers: jsonHeaders(),
      });

      setSuccess(`${purchase.purchaseNumber} verified successfully.`);
      await load();
      await refreshDetail(purchase._id);
    } catch (err) {
      setError(err.message || "Unable to verify bill");
    } finally {
      setProcessingId(null);
    }
  };

  // ====================================================
  // PAYMENT
  // ====================================================

  const openPayment = (purchase) => {
    setPay(emptyPayment(Number(purchase.pendingAmount || 0)));
    setSlip(null);
    setPayError("");
    setPaying(purchase);
  };

  const closePayment = () => {
    setPaying(null);
    setSlip(null);
    setPayError("");
  };

  const setPayField = (field, value) =>
    setPay((previous) => ({ ...previous, [field]: value }));

  const changeMode = (mode) => {
    setPay((previous) => ({
      ...previous,
      paymentMode: mode,
      upiApp: "",
      utrNumber: "",
      bankName: "",
      bankReference: "",
      transferType: "",
      chequeNumber: "",
      chequeDate: "",
      receiptNumber: "",
    }));

    if (mode !== "UPI" && mode !== "BANK_TRANSFER") setSlip(null);
  };

  const submitPayment = async (event) => {
    event.preventDefault();
    setPayError("");

    const amount = Number(pay.amount);
    const pending = Number(paying.pendingAmount || 0);
    const mode = pay.paymentMode;

    if (!Number.isFinite(amount) || amount <= 0) {
      return setPayError("Please enter a valid payment amount.");
    }

    if (amount > pending) {
      return setPayError(
        `Payment cannot be greater than pending amount ${money(pending)}.`
      );
    }

    if (mode === "UPI") {
      if (!pay.upiApp) return setPayError("Please select the UPI app.");
      if (!pay.utrNumber.trim()) return setPayError("Please enter the UTR number.");
      if (!slip) return setPayError("Please upload the payment slip.");
    }

    if (mode === "BANK_TRANSFER") {
      if (!pay.transferType) return setPayError("Please select the transfer type.");
      if (!pay.utrNumber.trim()) return setPayError("Please enter the UTR number.");
      if (!slip) return setPayError("Please upload the payment slip.");
    }

    if (mode === "CHEQUE") {
      if (!pay.chequeNumber.trim()) return setPayError("Please enter the cheque number.");
      if (!pay.chequeDate) return setPayError("Please select the cheque date.");
    }

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("paymentMode", mode);
    formData.append("paymentDate", pay.paymentDate);
    formData.append("transactionStatus", pay.transactionStatus);
    formData.append("notes", pay.notes.trim());
    formData.append("transactionReference", pay.transactionReference.trim());
    formData.append("upiApp", mode === "UPI" ? pay.upiApp : "");
    formData.append(
      "utrNumber",
      mode === "UPI" || mode === "BANK_TRANSFER" ? pay.utrNumber.trim() : ""
    );
    formData.append(
      "bankName",
      mode === "BANK_TRANSFER" || mode === "CHEQUE" ? pay.bankName.trim() : ""
    );
    formData.append(
      "bankReference",
      mode === "BANK_TRANSFER" ? pay.bankReference.trim() : ""
    );
    formData.append(
      "transferType",
      mode === "BANK_TRANSFER" ? pay.transferType : ""
    );
    formData.append("chequeNumber", mode === "CHEQUE" ? pay.chequeNumber.trim() : "");
    formData.append("chequeDate", mode === "CHEQUE" ? pay.chequeDate : "");
    formData.append("receiptNumber", mode === "CASH" ? pay.receiptNumber.trim() : "");

    if (slip) formData.append("paymentSlip", slip);

    setProcessingId(paying._id);

    try {
      await request(`/api/purchase/${paying._id}/payment`, {
        method: "PUT",
        // no Content-Type: browser sets multipart boundary
        headers: { Authorization: `Bearer ${token()}` },
        body: formData,
      });

      setSuccess(
        `Payment of ${money(amount)} recorded for ${paying.purchaseNumber}.`
      );

      const id = paying._id;
      closePayment();
      await load();
      await refreshDetail(id);
    } catch (err) {
      setPayError(err.message || "Unable to record payment");
    } finally {
      setProcessingId(null);
    }
  };

  // ====================================================
  // CSV EXPORT
  // ====================================================

  const exportCsv = () => {
    const header = [
      "Purchase No",
      "Invoice Date",
      "Vendor",
      "Vendor GSTIN",
      "Vendor Invoice No",
      "PO",
      "Subtotal",
      "GST",
      "Total",
      "Paid",
      "Pending",
      "Payment Status",
      "Verified",
    ];

    const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const lines = filtered.map((p) =>
      [
        p.purchaseNumber,
        formatDate(invoiceDateOf(p)),
        p.vendorName,
        p.vendorGstNumber,
        p.vendorInvoiceNumber,
        poNumberOf(p),
        Number(p.subtotal || 0).toFixed(2),
        Number(p.gstAmount || 0).toFixed(2),
        Number(p.totalAmount || 0).toFixed(2),
        Number(p.paidAmount || 0).toFixed(2),
        Number(p.pendingAmount || 0).toFixed(2),
        p.paymentStatus,
        p.verified ? "Yes" : "No",
      ]
        .map(escape)
        .join(",")
    );

    const blob = new Blob([[header.map(escape).join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `purchase-bills-${todayISO()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ====================================================
  // RENDER
  // ====================================================

  const clearFilters = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    setTab("ALL");
  };

  const hasFilters = search || fromDate || toDate;

  return (
    <div className="pm-page">
      <style>{css}</style>

      {/* HEADER */}
      <div className="pm-head">
        <div>
          <h1>Purchase &amp; Vendor Payments</h1>
          <p>Vendor bills verify karein, payment record karein aur poora hisab dekhein.</p>
        </div>

        <div className="pm-head-actions">
          <button className="pm-btn pm-ghost" onClick={exportCsv} disabled={!filtered.length}>
            <FaDownload /> Export CSV
          </button>
          <button className="pm-btn pm-ghost" onClick={load} disabled={loading}>
            <FaSyncAlt className={loading ? "pm-spin" : ""} /> Refresh
          </button>
          <button className="pm-btn pm-primary" onClick={() => navigate("/add-purchase-bill")}>
            <FaPlus /> Add purchase bill
          </button>
        </div>
      </div>

      {/* ALERTS */}
      {success && (
        <div className="pm-alert pm-alert-success">
          <span><FaCheck /> {success}</span>
          <button onClick={() => setSuccess("")}><FaTimes /></button>
        </div>
      )}

      {error && (
        <div className="pm-alert pm-alert-error">
          <span>{error}</span>
          <button onClick={() => setError("")}><FaTimes /></button>
        </div>
      )}

      {/* SUMMARY */}
      <div className="pm-summary">
        <div className="pm-card">
          <span>Total bills</span>
          <strong>{summary.count}</strong>
          <small>{summary.unverified} unverified</small>
        </div>
        <div className="pm-card">
          <span>Taxable value</span>
          <strong>{money(summary.subtotal)}</strong>
          <small>GST: {money(summary.gst)}</small>
        </div>
        <div className="pm-card">
          <span>Total purchase</span>
          <strong>{money(summary.total)}</strong>
          <small>GST included</small>
        </div>
        <div className="pm-card pm-green">
          <span>Paid to vendors</span>
          <strong>{money(summary.paid)}</strong>
        </div>
        <div className="pm-card pm-amber">
          <span>Total pending</span>
          <strong>{money(summary.pending)}</strong>
          <small>Sab bills ka baaki</small>
        </div>
        <div className="pm-card pm-red">
          <span>Payable now</span>
          <strong>{money(summary.payableAmount)}</strong>
          <small>{summary.payableCount} verified bill(s)</small>
        </div>
      </div>

      {/* FILTERS */}
      <div className="pm-panel">
        <div className="pm-toolbar">
          <div className="pm-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Purchase no, vendor, invoice no, GSTIN, PO..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <label className="pm-date">
            <span>From</span>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </label>

          <label className="pm-date">
            <span>To</span>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </label>

          {hasFilters && (
            <button className="pm-btn pm-ghost" onClick={clearFilters}>
              <FaTimes /> Clear
            </button>
          )}
        </div>

        <div className="pm-switch">
          <button
            className={view === "BILLS" ? "active" : ""}
            onClick={() => setView("BILLS")}
          >
            Bill-wise
          </button>
          <button
            className={view === "VENDORS" ? "active" : ""}
            onClick={() => setView("VENDORS")}
          >
            Vendor-wise hisab
          </button>
        </div>

        {/* ================= BILL-WISE ================= */}
        {view === "BILLS" && (
          <>
            <div className="pm-tabs">
              {TABS.map((t) => (
                <button
                  key={t.value}
                  className={`pm-tab ${tab === t.value ? "active" : ""}`}
                  onClick={() => setTab(t.value)}
                >
                  {t.label}
                  <span>{counts[t.value] || 0}</span>
                </button>
              ))}
            </div>

            {loading ? (
              <div className="pm-state">Loading purchase bills...</div>
            ) : filtered.length === 0 ? (
              <div className="pm-state">
                {purchases.length === 0
                  ? "Abhi koi purchase bill nahi hai."
                  : "Filters se koi bill match nahi hua."}
              </div>
            ) : (
              <div className="pm-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Purchase</th>
                      <th>Vendor</th>
                      <th>Invoice / PO</th>
                      <th className="num">GST</th>
                      <th className="num">Total</th>
                      <th className="num">Paid</th>
                      <th className="num">Pending</th>
                      <th>Payment</th>
                      <th>Verified</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => {
                      const busy = processingId === p._id;

                      return (
                        <tr key={p._id}>
                          <td>
                            <b>{p.purchaseNumber || "—"}</b>
                            <small>{formatDate(invoiceDateOf(p))}</small>
                          </td>
                          <td>
                            <b>{p.vendorName || "—"}</b>
                            {p.vendorGstNumber && <small>{p.vendorGstNumber}</small>}
                          </td>
                          <td>
                            {p.vendorInvoiceNumber || "—"}
                            <small>{poNumberOf(p)}</small>
                          </td>
                          <td className="num">{money(p.gstAmount)}</td>
                          <td className="num"><b>{money(p.totalAmount)}</b></td>
                          <td className="num pm-paid">{money(p.paidAmount)}</td>
                          <td className="num pm-pend">{money(p.pendingAmount)}</td>
                          <td>
                            <span className={`pm-badge pm-${String(p.paymentStatus || "PENDING").toLowerCase()}`}>
                              {p.paymentStatus || "PENDING"}
                            </span>
                          </td>
                          <td>
                            {p.verified ? (
                              <span className="pm-badge pm-verified">Verified</span>
                            ) : (
                              <span className="pm-badge pm-unverified">Unverified</span>
                            )}
                          </td>
                          <td>
                            <div className="pm-actions">
                              <button className="pm-mini pm-view" onClick={() => openDetail(p._id)}>
                                <FaEye /> View
                              </button>

                              {!p.verified && (
                                <button
                                  className="pm-mini pm-ok"
                                  disabled={busy}
                                  onClick={() => verify(p)}
                                >
                                  <FaCheck /> {busy ? "..." : "Verify"}
                                </button>
                              )}

                              {isPayable(p) && (
                                <button
                                  className="pm-mini pm-pay"
                                  disabled={busy}
                                  onClick={() => openPayment(p)}
                                >
                                  <FaRupeeSign /> Pay
                                </button>
                              )}

                              <button
                                className="pm-mini pm-view"
                                title="Vendor invoice"
                                onClick={() => navigate(`/purchase-bills/${p._id}/invoice`)}
                              >
                                <FaFileInvoice />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3}><b>Total ({filtered.length} bills)</b></td>
                      <td className="num">
                        <b>{money(filtered.reduce((s, p) => s + Number(p.gstAmount || 0), 0))}</b>
                      </td>
                      <td className="num">
                        <b>{money(filtered.reduce((s, p) => s + Number(p.totalAmount || 0), 0))}</b>
                      </td>
                      <td className="num pm-paid">
                        <b>{money(filtered.reduce((s, p) => s + Number(p.paidAmount || 0), 0))}</b>
                      </td>
                      <td className="num pm-pend">
                        <b>{money(filtered.reduce((s, p) => s + Number(p.pendingAmount || 0), 0))}</b>
                      </td>
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </>
        )}

        {/* ================= VENDOR-WISE ================= */}
        {view === "VENDORS" &&
          (loading ? (
            <div className="pm-state">Loading...</div>
          ) : vendorRows.length === 0 ? (
            <div className="pm-state">Koi data nahi.</div>
          ) : (
            <div className="pm-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>GSTIN</th>
                    <th className="num">Bills</th>
                    <th className="num">Total purchase</th>
                    <th className="num">Paid</th>
                    <th className="num">Baaki (pending)</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorRows.map((row) => (
                    <tr
                      key={row.vendor}
                      className="pm-click"
                      onClick={() => {
                        setSearch(row.vendor);
                        setView("BILLS");
                      }}
                    >
                      <td><b>{row.vendor}</b></td>
                      <td>{row.gstin || "—"}</td>
                      <td className="num">{row.bills}</td>
                      <td className="num">{money(row.total)}</td>
                      <td className="num pm-paid">{money(row.paid)}</td>
                      <td className="num pm-pend"><b>{money(row.pending)}</b></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2}><b>Total</b></td>
                    <td className="num"><b>{summary.count}</b></td>
                    <td className="num"><b>{money(summary.total)}</b></td>
                    <td className="num pm-paid"><b>{money(summary.paid)}</b></td>
                    <td className="num pm-pend"><b>{money(summary.pending)}</b></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))}
      </div>

      {/* ====================================================
          PAYMENT MODAL
      ==================================================== */}
      {paying && (
        <div
          className="pm-backdrop"
          onMouseDown={(e) => e.target === e.currentTarget && closePayment()}
        >
          <form className="pm-modal" onSubmit={submitPayment}>
            <div className="pm-modal-head">
              <div>
                <h2>Record vendor payment</h2>
                <p>{paying.purchaseNumber} — {paying.vendorName}</p>
              </div>
              <button type="button" className="pm-x" onClick={closePayment}>
                <FaTimes />
              </button>
            </div>

            <div className="pm-pay-summary">
              <div><span>Total</span><strong>{money(paying.totalAmount)}</strong></div>
              <div><span>Already paid</span><strong>{money(paying.paidAmount)}</strong></div>
              <div><span>Pending</span><strong className="pm-pend">{money(paying.pendingAmount)}</strong></div>
            </div>

            <div className="pm-grid">
              <label>
                <span>Payment amount *</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={Number(paying.pendingAmount || 0)}
                  value={pay.amount}
                  onChange={(e) => setPayField("amount", e.target.value)}
                />
              </label>

              <label>
                <span>Payment mode</span>
                <select value={pay.paymentMode} onChange={(e) => changeMode(e.target.value)}>
                  {Object.entries(MODE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Payment date</span>
                <input
                  type="date"
                  value={pay.paymentDate}
                  onChange={(e) => setPayField("paymentDate", e.target.value)}
                />
              </label>

              <label>
                <span>Transaction status</span>
                <select
                  value={pay.transactionStatus}
                  onChange={(e) => setPayField("transactionStatus", e.target.value)}
                >
                  <option value="SUCCESS">Success</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                  <option value="REVERSED">Reversed</option>
                </select>
              </label>

              {pay.paymentMode === "UPI" && (
                <label>
                  <span>UPI app *</span>
                  <select value={pay.upiApp} onChange={(e) => setPayField("upiApp", e.target.value)}>
                    <option value="">Select UPI app</option>
                    {Object.entries(UPI_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
              )}

              {pay.paymentMode === "BANK_TRANSFER" && (
                <>
                  <label>
                    <span>Transfer type *</span>
                    <select
                      value={pay.transferType}
                      onChange={(e) => setPayField("transferType", e.target.value)}
                    >
                      <option value="">Select type</option>
                      <option value="NEFT">NEFT</option>
                      <option value="RTGS">RTGS</option>
                      <option value="IMPS">IMPS</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </label>
                  <label>
                    <span>Bank reference</span>
                    <input
                      type="text"
                      value={pay.bankReference}
                      onChange={(e) => setPayField("bankReference", e.target.value)}
                    />
                  </label>
                </>
              )}

              {(pay.paymentMode === "UPI" || pay.paymentMode === "BANK_TRANSFER") && (
                <label>
                  <span>UTR number *</span>
                  <input
                    type="text"
                    value={pay.utrNumber}
                    onChange={(e) => setPayField("utrNumber", e.target.value)}
                  />
                </label>
              )}

              {(pay.paymentMode === "BANK_TRANSFER" || pay.paymentMode === "CHEQUE") && (
                <label>
                  <span>Bank name</span>
                  <input
                    type="text"
                    value={pay.bankName}
                    onChange={(e) => setPayField("bankName", e.target.value)}
                  />
                </label>
              )}

              {pay.paymentMode === "CHEQUE" && (
                <>
                  <label>
                    <span>Cheque number *</span>
                    <input
                      type="text"
                      value={pay.chequeNumber}
                      onChange={(e) => setPayField("chequeNumber", e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Cheque date *</span>
                    <input
                      type="date"
                      value={pay.chequeDate}
                      onChange={(e) => setPayField("chequeDate", e.target.value)}
                    />
                  </label>
                </>
              )}

              {pay.paymentMode === "CASH" && (
                <label>
                  <span>Receipt number</span>
                  <input
                    type="text"
                    value={pay.receiptNumber}
                    onChange={(e) => setPayField("receiptNumber", e.target.value)}
                  />
                </label>
              )}

              {(pay.paymentMode === "UPI" || pay.paymentMode === "BANK_TRANSFER") && (
                <label className="pm-wide">
                  <span>Payment slip * (JPG, PNG, WEBP, PDF — max 10 MB)</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={(e) => setSlip(e.target.files?.[0] || null)}
                  />
                  {slip && <small>Selected: {slip.name}</small>}
                </label>
              )}

              <label className="pm-wide">
                <span>Transaction reference (optional)</span>
                <input
                  type="text"
                  value={pay.transactionReference}
                  onChange={(e) => setPayField("transactionReference", e.target.value)}
                />
              </label>

              <label className="pm-wide">
                <span>Notes</span>
                <textarea
                  rows={2}
                  value={pay.notes}
                  onChange={(e) => setPayField("notes", e.target.value)}
                />
              </label>
            </div>

            {payError && <div className="pm-alert pm-alert-error"><span>{payError}</span></div>}

            <div className="pm-modal-actions">
              <button type="button" className="pm-btn pm-ghost" onClick={closePayment}>
                Cancel
              </button>
              <button
                type="submit"
                className="pm-btn pm-primary"
                disabled={processingId === paying._id}
              >
                <FaRupeeSign /> {processingId === paying._id ? "Recording..." : "Record payment"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ====================================================
          DETAIL MODAL
      ==================================================== */}
      {detail && (
        <div
          className="pm-backdrop"
          onMouseDown={(e) => e.target === e.currentTarget && setDetail(null)}
        >
          <div className="pm-modal pm-modal-lg">
            <div className="pm-modal-head">
              <div>
                <h2>Purchase bill details</h2>
                <p>{detail.purchaseNumber || ""}</p>
              </div>
              <button type="button" className="pm-x" onClick={() => setDetail(null)}>
                <FaTimes />
              </button>
            </div>

            {detailLoading || !detail.purchaseNumber ? (
              <div className="pm-state">Loading...</div>
            ) : (
              <>
                <div className="pm-info">
                  <div><span>Vendor</span><strong>{detail.vendorName || "—"}</strong></div>
                  <div><span>GSTIN</span><strong>{detail.vendorGstNumber || "—"}</strong></div>
                  <div><span>State</span><strong>{detail.vendorState || "—"}</strong></div>
                  <div><span>Phone</span><strong>{detail.vendorPhone || "—"}</strong></div>
                  <div><span>Email</span><strong>{detail.vendorEmail || "—"}</strong></div>
                  <div><span>Address</span><strong>{detail.vendorAddress || "—"}</strong></div>
                  <div><span>Vendor invoice no.</span><strong>{detail.vendorInvoiceNumber || "—"}</strong></div>
                  <div><span>Invoice date</span><strong>{formatDate(detail.invoiceDate)}</strong></div>
                  <div><span>Purchase order</span><strong>{poNumberOf(detail)}</strong></div>
                  <div><span>Created by</span><strong>{userName(detail.createdBy)}</strong></div>
                  <div><span>Created at</span><strong>{formatDateTime(detail.createdAt)}</strong></div>
                  <div>
                    <span>Verification</span>
                    <strong>
                      {detail.verified
                        ? `Verified by ${userName(detail.verifiedBy)} (${formatDateTime(detail.verifiedAt)})`
                        : "Not verified"}
                    </strong>
                  </div>
                </div>

                <h3>Items</h3>
                <div className="pm-table-wrap">
                  <table className="pm-small-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Item</th>
                        <th>HSN</th>
                        <th className="num">Qty</th>
                        <th className="num">Price</th>
                        <th className="num">GST</th>
                        <th className="num">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(detail.items || []).map((item, index) => (
                        <tr key={item._id || index}>
                          <td>{index + 1}</td>
                          <td>
                            {item.productName || item.product?.name || "—"}
                            <small>{item.itemModel === "RepairPart" ? "Repair part" : "Product"}</small>
                          </td>
                          <td>{item.hsnCode || "—"}</td>
                          <td className="num">{item.quantity}</td>
                          <td className="num">{money(item.purchasePrice)}</td>
                          <td className="num">{Number(item.gst || 0)}%</td>
                          <td className="num">{money(item.totalAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pm-totals">
                  <div><span>Subtotal</span><strong>{money(detail.subtotal)}</strong></div>
                  <div><span>GST</span><strong>{money(detail.gstAmount)}</strong></div>
                  <div className="pm-grand"><span>Total</span><strong>{money(detail.totalAmount)}</strong></div>
                  <div><span>Paid</span><strong className="pm-paid">{money(detail.paidAmount)}</strong></div>
                  <div><span>Pending</span><strong className="pm-pend">{money(detail.pendingAmount)}</strong></div>
                </div>

                <h3>Payment history ({(detail.payments || []).length})</h3>
                {(detail.payments || []).length === 0 ? (
                  <div className="pm-state">Koi payment record nahi hui.</div>
                ) : (
                  <div className="pm-table-wrap">
                    <table className="pm-small-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th className="num">Amount</th>
                          <th>Mode</th>
                          <th>Details</th>
                          <th>Recorded by</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.payments.map((payment, index) => (
                          <tr key={payment._id || index}>
                            <td>{formatDate(payment.paymentDate)}</td>
                            <td className="num"><b>{money(payment.amount)}</b></td>
                            <td>{MODE_LABELS[payment.paymentMode] || payment.paymentMode}</td>
                            <td>
                              {payment.upiApp && <small>UPI: {UPI_LABELS[payment.upiApp] || payment.upiApp}</small>}
                              {payment.transferType && <small>Type: {payment.transferType}</small>}
                              {payment.utrNumber && <small>UTR: {payment.utrNumber}</small>}
                              {payment.bankName && <small>Bank: {payment.bankName}</small>}
                              {payment.bankReference && <small>Bank ref: {payment.bankReference}</small>}
                              {payment.chequeNumber && <small>Cheque: {payment.chequeNumber} ({formatDate(payment.chequeDate)})</small>}
                              {payment.receiptNumber && <small>Receipt: {payment.receiptNumber}</small>}
                              {payment.transactionReference && <small>Ref: {payment.transactionReference}</small>}
                              {payment.notes && <small>Note: {payment.notes}</small>}
                              {payment.paymentSlip?.fileUrl && (
                                <small>
                                  <a
                                    href={`${API_BASE_URL}${payment.paymentSlip.fileUrl}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    View slip
                                  </a>
                                </small>
                              )}
                            </td>
                            <td>{userName(payment.recordedBy)}</td>
                            <td>
                              <span className={`pm-badge pm-tx-${String(payment.transactionStatus || "SUCCESS").toLowerCase()}`}>
                                {payment.transactionStatus || "SUCCESS"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {detail.notes && (
                  <div className="pm-notes">
                    <b>Notes:</b> {detail.notes}
                  </div>
                )}

                <div className="pm-modal-actions">
                  <button
                    className="pm-btn pm-ghost"
                    onClick={() => navigate(`/purchase-bills/${detail._id}/invoice`)}
                  >
                    <FaFileInvoice /> Invoice
                  </button>

                  {!detail.verified && (
                    <button
                      className="pm-btn pm-ok-solid"
                      disabled={processingId === detail._id}
                      onClick={() => verify(detail)}
                    >
                      <FaCheck /> Verify bill
                    </button>
                  )}

                  {isPayable(detail) && (
                    <button
                      className="pm-btn pm-primary"
                      onClick={() => {
                        const bill = detail;
                        setDetail(null);
                        openPayment(bill);
                      }}
                    >
                      <FaRupeeSign /> Record payment
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ======================================================
// CSS
// ======================================================

const css = `
.pm-page{width:100%;min-height:100vh;padding:24px;background:#f7f9fc;color:#172033;font-family:Poppins,Arial,sans-serif}
.pm-page *{box-sizing:border-box}
.pm-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:20px;flex-wrap:wrap}
.pm-head h1{margin:0;font-size:26px}
.pm-head p{margin:6px 0 0;color:#718096;font-size:14px}
.pm-head-actions{display:flex;gap:8px;flex-wrap:wrap}
.pm-btn{border:0;border-radius:9px;min-height:40px;padding:8px 14px;font-weight:600;font-size:13px;cursor:pointer;display:inline-flex;align-items:center;gap:7px}
.pm-btn:disabled,.pm-mini:disabled{opacity:.55;cursor:not-allowed}
.pm-primary{background:#167c5a;color:#fff}.pm-primary:hover{background:#126b4d}
.pm-ghost{background:#fff;color:#273444;border:1px solid #dce3eb}.pm-ghost:hover{background:#f1f5f9}
.pm-ok-solid{background:#2458a6;color:#fff}
.pm-spin{animation:pmspin .8s linear infinite}
@keyframes pmspin{to{transform:rotate(360deg)}}
.pm-alert{display:flex;justify-content:space-between;align-items:center;gap:10px;border-radius:10px;padding:11px 14px;margin-bottom:14px;font-size:13px}
.pm-alert button{border:0;background:transparent;color:inherit;cursor:pointer}
.pm-alert-success{background:#eaf8f0;color:#157347;border:1px solid #c9ead8}
.pm-alert-error{background:#fff0f0;color:#b42318;border:1px solid #ffd2d2}
.pm-summary{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;margin-bottom:18px}
.pm-card{background:#fff;border:1px solid #e6eaf0;border-radius:13px;padding:15px 16px}
.pm-card span{display:block;font-size:12px;color:#718096;margin-bottom:6px}
.pm-card strong{display:block;font-size:19px}
.pm-card small{display:block;margin-top:5px;font-size:11px;color:#8490a2}
.pm-green strong{color:#157347}.pm-amber strong{color:#946200}.pm-red strong{color:#b42318}
.pm-panel{background:#fff;border:1px solid #e6eaf0;border-radius:14px;padding:18px}
.pm-toolbar{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:14px}
.pm-search{flex:1;min-width:240px;display:flex;align-items:center;gap:8px;border:1px solid #d9dee7;border-radius:9px;padding:0 11px;color:#718096;min-height:42px}
.pm-search input{border:0;outline:0;width:100%;font:inherit;color:#172033;background:transparent}
.pm-date{display:flex;flex-direction:column;gap:4px;font-size:11px;color:#718096;font-weight:600}
.pm-date input{border:1px solid #d9dee7;border-radius:9px;padding:9px 10px;font:inherit;color:#172033}
.pm-switch{display:inline-flex;background:#f1f5f9;border-radius:10px;padding:3px;margin-bottom:14px}
.pm-switch button{border:0;background:transparent;padding:8px 14px;border-radius:8px;font-weight:600;font-size:13px;cursor:pointer;color:#5b6575}
.pm-switch button.active{background:#fff;color:#167c5a;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.pm-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.pm-tab{border:1px solid #dce3eb;background:#fff;border-radius:999px;padding:7px 14px;font-size:13px;font-weight:600;cursor:pointer;color:#445;display:inline-flex;gap:7px;align-items:center}
.pm-tab span{background:#eef3f7;border-radius:999px;padding:1px 8px;font-size:11px}
.pm-tab.active{background:#167c5a;border-color:#167c5a;color:#fff}
.pm-tab.active span{background:rgba(255,255,255,.25)}
.pm-state{padding:32px;text-align:center;color:#718096;font-size:14px}
.pm-table-wrap{width:100%;overflow-x:auto;border:1px solid #edf0f4;border-radius:10px;margin-bottom:6px}
.pm-page table{width:100%;min-width:980px;border-collapse:collapse}
.pm-small-table{min-width:640px!important}
.pm-page th,.pm-page td{padding:11px 12px;border-bottom:1px solid #edf0f4;text-align:left;font-size:13px;vertical-align:middle}
.pm-page th{background:#fafbfc;color:#5b6575;font-weight:700;white-space:nowrap}
.pm-page tbody tr:hover{background:#fafcfd}
.pm-page tfoot td{background:#fafbfc;border-bottom:0}
.pm-page .num{text-align:right;white-space:nowrap}
.pm-page td small{display:block;margin-top:3px;color:#8490a2;font-size:11px}
.pm-click{cursor:pointer}
.pm-paid{color:#157347}.pm-pend{color:#946200}
.pm-badge{display:inline-block;padding:4px 9px;border-radius:999px;font-size:11px;font-weight:700;white-space:nowrap}
.pm-paid.pm-badge,.pm-badge.pm-paid{background:#e7f7ee;color:#157347}
.pm-badge.pm-partial,.pm-badge.pm-pending{background:#fff4db;color:#946200}
.pm-verified,.pm-tx-success{background:#e7f7ee;color:#157347}
.pm-unverified,.pm-tx-failed,.pm-tx-reversed{background:#fee9e7;color:#b42318}
.pm-tx-pending{background:#fff4db;color:#946200}
.pm-actions{display:flex;gap:5px;flex-wrap:wrap}
.pm-mini{border:0;border-radius:8px;padding:6px 9px;font-size:11px;font-weight:700;cursor:pointer;display:inline-flex;gap:5px;align-items:center}
.pm-view{background:#edf4ff;color:#2458a6}
.pm-ok{background:#fff4db;color:#946200}
.pm-pay{background:#eaf4ef;color:#126344}
.pm-backdrop{position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,.5);padding:20px;display:flex;justify-content:center;align-items:flex-start;overflow-y:auto}
.pm-modal{width:min(640px,100%);background:#fff;border-radius:15px;padding:22px;display:grid;gap:14px;margin:auto;box-shadow:0 20px 60px rgba(0,0,0,.2)}
.pm-modal-lg{width:min(920px,100%)}
.pm-modal-head{display:flex;justify-content:space-between;gap:14px}
.pm-modal-head h2{margin:0;font-size:20px}
.pm-modal-head p{margin:5px 0 0;color:#718096;font-size:13px}
.pm-modal h3{margin:6px 0 0;font-size:15px}
.pm-x{width:34px;height:34px;border:0;border-radius:8px;background:#f1f5f9;cursor:pointer;color:#475569}
.pm-pay-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;background:#f8fafc;border-radius:10px;padding:12px}
.pm-pay-summary span{display:block;font-size:11px;color:#718096;margin-bottom:4px}
.pm-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.pm-grid label{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:600;color:#445}
.pm-grid .pm-wide{grid-column:1/-1}
.pm-grid input,.pm-grid select,.pm-grid textarea{width:100%;border:1px solid #d9dee7;border-radius:9px;padding:9px 10px;font:inherit;color:#172033;outline:0;background:#fff}
.pm-grid input:focus,.pm-grid select:focus,.pm-grid textarea:focus{border-color:#167c5a;box-shadow:0 0 0 3px rgba(22,124,90,.1)}
.pm-modal-actions{display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap;margin-top:4px}
.pm-info{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.pm-info div{border:1px solid #edf0f4;border-radius:9px;padding:10px;min-width:0}
.pm-info span{display:block;font-size:11px;color:#718096;margin-bottom:4px}
.pm-info strong{font-size:13px;overflow-wrap:anywhere}
.pm-totals{margin-left:auto;width:min(320px,100%);display:grid;gap:6px}
.pm-totals div{display:flex;justify-content:space-between;font-size:13px}
.pm-grand{border-top:1px solid #edf0f4;padding-top:6px;font-size:15px!important;font-weight:700}
.pm-notes{background:#f8fafc;border-radius:9px;padding:11px;font-size:13px;color:#5b6575;white-space:pre-wrap}
@media(max-width:1200px){.pm-summary{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:800px){.pm-info{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){
 .pm-page{padding:12px}
 .pm-summary{grid-template-columns:1fr 1fr}
 .pm-grid,.pm-info,.pm-pay-summary{grid-template-columns:1fr}
 .pm-modal{padding:15px}
 .pm-head-actions .pm-btn{flex:1}
}
`;