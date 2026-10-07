// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaCheck,
//   FaDownload,
//   FaEye,
//   FaFileInvoice,
//   FaPlus,
//   FaRupeeSign,
//   FaSearch,
//   FaSyncAlt,
//   FaTimes,
// } from "react-icons/fa";

// // ======================================================
// // API
// // ======================================================

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// const token = () => localStorage.getItem("token");

// const jsonHeaders = () => ({
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${token()}`,
// });

// const request = async (path, options = {}) => {
//   const response = await fetch(`${API_BASE_URL}${path}`, options);
//   const result = await response.json();

//   if (!response.ok || result.success === false) {
//     throw new Error(result.message || "Request failed");
//   }

//   return result;
// };

// // ======================================================
// // HELPERS
// // ======================================================

// const money = (value) =>
//   `₹${Number(value || 0).toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })}`;

// const formatDate = (value) => {
//   if (!value) return "—";
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return "—";
//   return date.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const formatDateTime = (value) => {
//   if (!value) return "—";
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return "—";
//   return date.toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// const todayISO = () => new Date().toISOString().slice(0, 10);

// const userName = (user) => {
//   if (!user) return "—";
//   return (
//     [user.firstName, user.lastName].filter(Boolean).join(" ") ||
//     user.name ||
//     user.email ||
//     "—"
//   );
// };

// const poNumberOf = (purchase) => {
//   const po = purchase?.purchaseOrder;
//   if (!po) return "Manual";
//   if (typeof po === "object") return po.poNumber || po._id || "PO";
//   return purchase.purchaseOrderNumber || purchase.poNumber || po;
// };

// const MODE_LABELS = {
//   CASH: "Cash",
//   UPI: "UPI",
//   BANK_TRANSFER: "Bank Transfer",
//   CHEQUE: "Cheque",
//   CARD: "Card",
//   OTHER: "Other",
// };

// const UPI_LABELS = {
//   PHONEPE: "PhonePe",
//   GOOGLE_PAY: "Google Pay",
//   PAYTM: "Paytm",
//   OTHER: "Other UPI",
// };

// const invoiceDateOf = (p) => p.invoiceDate || p.createdAt;

// const isPayable = (p) =>
//   p.verified && Number(p.pendingAmount || 0) > 0;

// const TABS = [
//   { value: "ALL", label: "All", test: () => true },
//   { value: "UNVERIFIED", label: "Unverified", test: (p) => !p.verified },
//   { value: "PAYABLE", label: "Payable", test: isPayable },
//   {
//     value: "PARTIAL",
//     label: "Partial",
//     test: (p) => p.paymentStatus === "PARTIAL",
//   },
//   { value: "PAID", label: "Paid", test: (p) => p.paymentStatus === "PAID" },
// ];

// const emptyPayment = (pending) => ({
//   amount: pending ? String(pending) : "",
//   paymentMode: "CASH",
//   paymentDate: todayISO(),
//   transactionStatus: "SUCCESS",
//   upiApp: "",
//   utrNumber: "",
//   transactionReference: "",
//   bankName: "",
//   bankReference: "",
//   transferType: "",
//   chequeNumber: "",
//   chequeDate: "",
//   receiptNumber: "",
//   notes: "",
// });

// // ======================================================
// // COMPONENT
// // ======================================================

// export default function PurchaseManagement() {
//   const navigate = useNavigate();

//   const [purchases, setPurchases] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [view, setView] = useState("BILLS"); // BILLS | VENDORS
//   const [tab, setTab] = useState("ALL");
//   const [search, setSearch] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const [detail, setDetail] = useState(null);
//   const [detailLoading, setDetailLoading] = useState(false);

//   const [paying, setPaying] = useState(null);
//   const [pay, setPay] = useState(emptyPayment());
//   const [slip, setSlip] = useState(null);
//   const [payError, setPayError] = useState("");

//   const [processingId, setProcessingId] = useState(null);

//   // ====================================================
//   // LOAD
//   // ====================================================

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const result = await request("/api/purchase", {
//         headers: jsonHeaders(),
//       });

//       setPurchases(Array.isArray(result.data) ? result.data : []);
//     } catch (err) {
//       setError(err.message || "Unable to load purchase bills");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   useEffect(() => {
//     if (!success) return;
//     const timer = setTimeout(() => setSuccess(""), 3500);
//     return () => clearTimeout(timer);
//   }, [success]);

//   // ====================================================
//   // FILTERS
//   // ====================================================

//   const inDateRange = useCallback(
//     (purchase) => {
//       const value = invoiceDateOf(purchase);
//       if (!fromDate && !toDate) return true;
//       if (!value) return false;
//       const day = new Date(value).toISOString().slice(0, 10);
//       if (fromDate && day < fromDate) return false;
//       if (toDate && day > toDate) return false;
//       return true;
//     },
//     [fromDate, toDate]
//   );

//   // date + search filtered (before tab) — used for counts & summary
//   const scoped = useMemo(() => {
//     const term = search.trim().toLowerCase();

//     return purchases.filter((p) => {
//       if (!inDateRange(p)) return false;
//       if (!term) return true;

//       return [
//         p.purchaseNumber,
//         p.vendorName,
//         p.vendorInvoiceNumber,
//         p.vendorGstNumber,
//         poNumberOf(p),
//       ].some((value) => String(value || "").toLowerCase().includes(term));
//     });
//   }, [purchases, search, inDateRange]);

//   const counts = useMemo(() => {
//     const result = {};
//     TABS.forEach((t) => {
//       result[t.value] = scoped.filter(t.test).length;
//     });
//     return result;
//   }, [scoped]);

//   const filtered = useMemo(() => {
//     const current = TABS.find((t) => t.value === tab) || TABS[0];
//     return scoped.filter(current.test);
//   }, [scoped, tab]);

//   // ====================================================
//   // SUMMARY (based on date + search filtered bills)
//   // ====================================================

//   const summary = useMemo(() => {
//     const sum = (list, key) =>
//       list.reduce((total, item) => total + Number(item[key] || 0), 0);

//     const payable = scoped.filter(isPayable);

//     return {
//       count: scoped.length,
//       subtotal: sum(scoped, "subtotal"),
//       gst: sum(scoped, "gstAmount"),
//       total: sum(scoped, "totalAmount"),
//       paid: sum(scoped, "paidAmount"),
//       pending: sum(scoped, "pendingAmount"),
//       payableAmount: sum(payable, "pendingAmount"),
//       payableCount: payable.length,
//       unverified: scoped.filter((p) => !p.verified).length,
//     };
//   }, [scoped]);

//   // ====================================================
//   // VENDOR-WISE HISAB
//   // ====================================================

//   const vendorRows = useMemo(() => {
//     const map = new Map();

//     scoped.forEach((p) => {
//       const key = (p.vendorName || "Unknown").trim();

//       if (!map.has(key)) {
//         map.set(key, {
//           vendor: key,
//           gstin: p.vendorGstNumber || "",
//           bills: 0,
//           total: 0,
//           paid: 0,
//           pending: 0,
//         });
//       }

//       const row = map.get(key);
//       row.bills += 1;
//       row.total += Number(p.totalAmount || 0);
//       row.paid += Number(p.paidAmount || 0);
//       row.pending += Number(p.pendingAmount || 0);
//     });

//     return Array.from(map.values()).sort((a, b) => b.pending - a.pending);
//   }, [scoped]);

//   // ====================================================
//   // DETAIL
//   // ====================================================

//   const openDetail = async (purchaseId) => {
//     setDetailLoading(true);
//     setDetail({ _id: purchaseId });

//     try {
//       const result = await request(`/api/purchase/${purchaseId}`, {
//         headers: jsonHeaders(),
//       });
//       setDetail(result.data);
//     } catch (err) {
//       setDetail(null);
//       setError(err.message || "Unable to load bill details");
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   const refreshDetail = async (purchaseId) => {
//     try {
//       const result = await request(`/api/purchase/${purchaseId}`, {
//         headers: jsonHeaders(),
//       });
//       setDetail((current) =>
//         current && current._id === purchaseId ? result.data : current
//       );
//     } catch {
//       /* ignore */
//     }
//   };

//   // ====================================================
//   // VERIFY
//   // ====================================================

//   const verify = async (purchase) => {
//     const confirmed = window.confirm(
//       `Verify purchase bill ${purchase.purchaseNumber}?\n\nVerify karne ke baad hi vendor payment record hoga.`
//     );

//     if (!confirmed) return;

//     setError("");
//     setProcessingId(purchase._id);

//     try {
//       await request(`/api/purchase/${purchase._id}/verify`, {
//         method: "PUT",
//         headers: jsonHeaders(),
//       });

//       setSuccess(`${purchase.purchaseNumber} verified successfully.`);
//       await load();
//       await refreshDetail(purchase._id);
//     } catch (err) {
//       setError(err.message || "Unable to verify bill");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   // ====================================================
//   // PAYMENT
//   // ====================================================

//   const openPayment = (purchase) => {
//     setPay(emptyPayment(Number(purchase.pendingAmount || 0)));
//     setSlip(null);
//     setPayError("");
//     setPaying(purchase);
//   };

//   const closePayment = () => {
//     setPaying(null);
//     setSlip(null);
//     setPayError("");
//   };

//   const setPayField = (field, value) =>
//     setPay((previous) => ({ ...previous, [field]: value }));

//   const changeMode = (mode) => {
//     setPay((previous) => ({
//       ...previous,
//       paymentMode: mode,
//       upiApp: "",
//       utrNumber: "",
//       bankName: "",
//       bankReference: "",
//       transferType: "",
//       chequeNumber: "",
//       chequeDate: "",
//       receiptNumber: "",
//     }));

//     if (mode !== "UPI" && mode !== "BANK_TRANSFER") setSlip(null);
//   };

//   const submitPayment = async (event) => {
//     event.preventDefault();
//     setPayError("");

//     const amount = Number(pay.amount);
//     const pending = Number(paying.pendingAmount || 0);
//     const mode = pay.paymentMode;

//     if (!Number.isFinite(amount) || amount <= 0) {
//       return setPayError("Please enter a valid payment amount.");
//     }

//     if (amount > pending) {
//       return setPayError(
//         `Payment cannot be greater than pending amount ${money(pending)}.`
//       );
//     }

//     if (mode === "UPI") {
//       if (!pay.upiApp) return setPayError("Please select the UPI app.");
//       if (!pay.utrNumber.trim()) return setPayError("Please enter the UTR number.");
//       if (!slip) return setPayError("Please upload the payment slip.");
//     }

//     if (mode === "BANK_TRANSFER") {
//       if (!pay.transferType) return setPayError("Please select the transfer type.");
//       if (!pay.utrNumber.trim()) return setPayError("Please enter the UTR number.");
//       if (!slip) return setPayError("Please upload the payment slip.");
//     }

//     if (mode === "CHEQUE") {
//       if (!pay.chequeNumber.trim()) return setPayError("Please enter the cheque number.");
//       if (!pay.chequeDate) return setPayError("Please select the cheque date.");
//     }

//     const formData = new FormData();
//     formData.append("amount", amount);
//     formData.append("paymentMode", mode);
//     formData.append("paymentDate", pay.paymentDate);
//     formData.append("transactionStatus", pay.transactionStatus);
//     formData.append("notes", pay.notes.trim());
//     formData.append("transactionReference", pay.transactionReference.trim());
//     formData.append("upiApp", mode === "UPI" ? pay.upiApp : "");
//     formData.append(
//       "utrNumber",
//       mode === "UPI" || mode === "BANK_TRANSFER" ? pay.utrNumber.trim() : ""
//     );
//     formData.append(
//       "bankName",
//       mode === "BANK_TRANSFER" || mode === "CHEQUE" ? pay.bankName.trim() : ""
//     );
//     formData.append(
//       "bankReference",
//       mode === "BANK_TRANSFER" ? pay.bankReference.trim() : ""
//     );
//     formData.append(
//       "transferType",
//       mode === "BANK_TRANSFER" ? pay.transferType : ""
//     );
//     formData.append("chequeNumber", mode === "CHEQUE" ? pay.chequeNumber.trim() : "");
//     formData.append("chequeDate", mode === "CHEQUE" ? pay.chequeDate : "");
//     formData.append("receiptNumber", mode === "CASH" ? pay.receiptNumber.trim() : "");

//     if (slip) formData.append("paymentSlip", slip);

//     setProcessingId(paying._id);

//     try {
//       await request(`/api/purchase/${paying._id}/payment`, {
//         method: "PUT",
//         // no Content-Type: browser sets multipart boundary
//         headers: { Authorization: `Bearer ${token()}` },
//         body: formData,
//       });

//       setSuccess(
//         `Payment of ${money(amount)} recorded for ${paying.purchaseNumber}.`
//       );

//       const id = paying._id;
//       closePayment();
//       await load();
//       await refreshDetail(id);
//     } catch (err) {
//       setPayError(err.message || "Unable to record payment");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   // ====================================================
//   // CSV EXPORT
//   // ====================================================

//   const exportCsv = () => {
//     const header = [
//       "Purchase No",
//       "Invoice Date",
//       "Vendor",
//       "Vendor GSTIN",
//       "Vendor Invoice No",
//       "PO",
//       "Subtotal",
//       "GST",
//       "Total",
//       "Paid",
//       "Pending",
//       "Payment Status",
//       "Verified",
//     ];

//     const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

//     const lines = filtered.map((p) =>
//       [
//         p.purchaseNumber,
//         formatDate(invoiceDateOf(p)),
//         p.vendorName,
//         p.vendorGstNumber,
//         p.vendorInvoiceNumber,
//         poNumberOf(p),
//         Number(p.subtotal || 0).toFixed(2),
//         Number(p.gstAmount || 0).toFixed(2),
//         Number(p.totalAmount || 0).toFixed(2),
//         Number(p.paidAmount || 0).toFixed(2),
//         Number(p.pendingAmount || 0).toFixed(2),
//         p.paymentStatus,
//         p.verified ? "Yes" : "No",
//       ]
//         .map(escape)
//         .join(",")
//     );

//     const blob = new Blob([[header.map(escape).join(","), ...lines].join("\n")], {
//       type: "text/csv;charset=utf-8;",
//     });

//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `purchase-bills-${todayISO()}.csv`;
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   // ====================================================
//   // RENDER
//   // ====================================================

//   const clearFilters = () => {
//     setSearch("");
//     setFromDate("");
//     setToDate("");
//     setTab("ALL");
//   };

//   const hasFilters = search || fromDate || toDate;

//   return (
//     <div className="pm-page">
//       <style>{css}</style>

//       {/* HEADER */}
//       <div className="pm-head">
//         <div>
//           <h1>Purchase &amp; Vendor Payments</h1>
//           <p>Vendor bills verify karein, payment record karein aur poora hisab dekhein.</p>
//         </div>

//         <div className="pm-head-actions">
//           <button className="pm-btn pm-ghost" onClick={exportCsv} disabled={!filtered.length}>
//             <FaDownload /> Export CSV
//           </button>
//           <button className="pm-btn pm-ghost" onClick={load} disabled={loading}>
//             <FaSyncAlt className={loading ? "pm-spin" : ""} /> Refresh
//           </button>
//           <button className="pm-btn pm-primary" onClick={() => navigate("/add-purchase-bill")}>
//             <FaPlus /> Add purchase bill
//           </button>
//         </div>
//       </div>

//       {/* ALERTS */}
//       {success && (
//         <div className="pm-alert pm-alert-success">
//           <span><FaCheck /> {success}</span>
//           <button onClick={() => setSuccess("")}><FaTimes /></button>
//         </div>
//       )}

//       {error && (
//         <div className="pm-alert pm-alert-error">
//           <span>{error}</span>
//           <button onClick={() => setError("")}><FaTimes /></button>
//         </div>
//       )}

//       {/* SUMMARY */}
//       <div className="pm-summary">
//         <div className="pm-card">
//           <span>Total bills</span>
//           <strong>{summary.count}</strong>
//           <small>{summary.unverified} unverified</small>
//         </div>
//         <div className="pm-card">
//           <span>Taxable value</span>
//           <strong>{money(summary.subtotal)}</strong>
//           <small>GST: {money(summary.gst)}</small>
//         </div>
//         <div className="pm-card">
//           <span>Total purchase</span>
//           <strong>{money(summary.total)}</strong>
//           <small>GST included</small>
//         </div>
//         <div className="pm-card pm-green">
//           <span>Paid to vendors</span>
//           <strong>{money(summary.paid)}</strong>
//         </div>
//         <div className="pm-card pm-amber">
//           <span>Total pending</span>
//           <strong>{money(summary.pending)}</strong>
//           <small>Sab bills ka baaki</small>
//         </div>
//         <div className="pm-card pm-red">
//           <span>Payable now</span>
//           <strong>{money(summary.payableAmount)}</strong>
//           <small>{summary.payableCount} verified bill(s)</small>
//         </div>
//       </div>

//       {/* FILTERS */}
//       <div className="pm-panel">
//         <div className="pm-toolbar">
//           <div className="pm-search">
//             <FaSearch />
//             <input
//               type="text"
//               placeholder="Purchase no, vendor, invoice no, GSTIN, PO..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>

//           <label className="pm-date">
//             <span>From</span>
//             <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//           </label>

//           <label className="pm-date">
//             <span>To</span>
//             <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
//           </label>

//           {hasFilters && (
//             <button className="pm-btn pm-ghost" onClick={clearFilters}>
//               <FaTimes /> Clear
//             </button>
//           )}
//         </div>

//         <div className="pm-switch">
//           <button
//             className={view === "BILLS" ? "active" : ""}
//             onClick={() => setView("BILLS")}
//           >
//             Bill-wise
//           </button>
//           <button
//             className={view === "VENDORS" ? "active" : ""}
//             onClick={() => setView("VENDORS")}
//           >
//             Vendor-wise hisab
//           </button>
//         </div>

//         {/* ================= BILL-WISE ================= */}
//         {view === "BILLS" && (
//           <>
//             <div className="pm-tabs">
//               {TABS.map((t) => (
//                 <button
//                   key={t.value}
//                   className={`pm-tab ${tab === t.value ? "active" : ""}`}
//                   onClick={() => setTab(t.value)}
//                 >
//                   {t.label}
//                   <span>{counts[t.value] || 0}</span>
//                 </button>
//               ))}
//             </div>

//             {loading ? (
//               <div className="pm-state">Loading purchase bills...</div>
//             ) : filtered.length === 0 ? (
//               <div className="pm-state">
//                 {purchases.length === 0
//                   ? "Abhi koi purchase bill nahi hai."
//                   : "Filters se koi bill match nahi hua."}
//               </div>
//             ) : (
//               <div className="pm-table-wrap">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Purchase</th>
//                       <th>Vendor</th>
//                       <th>Invoice / PO</th>
//                       <th className="num">GST</th>
//                       <th className="num">Total</th>
//                       <th className="num">Paid</th>
//                       <th className="num">Pending</th>
//                       <th>Payment</th>
//                       <th>Verified</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filtered.map((p) => {
//                       const busy = processingId === p._id;

//                       return (
//                         <tr key={p._id}>
//                           <td>
//                             <b>{p.purchaseNumber || "—"}</b>
//                             <small>{formatDate(invoiceDateOf(p))}</small>
//                           </td>
//                           <td>
//                             <b>{p.vendorName || "—"}</b>
//                             {p.vendorGstNumber && <small>{p.vendorGstNumber}</small>}
//                           </td>
//                           <td>
//                             {p.vendorInvoiceNumber || "—"}
//                             <small>{poNumberOf(p)}</small>
//                           </td>
//                           <td className="num">{money(p.gstAmount)}</td>
//                           <td className="num"><b>{money(p.totalAmount)}</b></td>
//                           <td className="num pm-paid">{money(p.paidAmount)}</td>
//                           <td className="num pm-pend">{money(p.pendingAmount)}</td>
//                           <td>
//                             <span className={`pm-badge pm-${String(p.paymentStatus || "PENDING").toLowerCase()}`}>
//                               {p.paymentStatus || "PENDING"}
//                             </span>
//                           </td>
//                           <td>
//                             {p.verified ? (
//                               <span className="pm-badge pm-verified">Verified</span>
//                             ) : (
//                               <span className="pm-badge pm-unverified">Unverified</span>
//                             )}
//                           </td>
//                           <td>
//                             <div className="pm-actions">
//                               <button className="pm-mini pm-view" onClick={() => openDetail(p._id)}>
//                                 <FaEye /> View
//                               </button>

//                               {!p.verified && (
//                                 <button
//                                   className="pm-mini pm-ok"
//                                   disabled={busy}
//                                   onClick={() => verify(p)}
//                                 >
//                                   <FaCheck /> {busy ? "..." : "Verify"}
//                                 </button>
//                               )}

//                               {isPayable(p) && (
//                                 <button
//                                   className="pm-mini pm-pay"
//                                   disabled={busy}
//                                   onClick={() => openPayment(p)}
//                                 >
//                                   <FaRupeeSign /> Pay
//                                 </button>
//                               )}

//                               <button
//                                 className="pm-mini pm-view"
//                                 title="Vendor invoice"
//                                 onClick={() => navigate(`/purchase-bills/${p._id}/invoice`)}
//                               >
//                                 <FaFileInvoice />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                   <tfoot>
//                     <tr>
//                       <td colSpan={3}><b>Total ({filtered.length} bills)</b></td>
//                       <td className="num">
//                         <b>{money(filtered.reduce((s, p) => s + Number(p.gstAmount || 0), 0))}</b>
//                       </td>
//                       <td className="num">
//                         <b>{money(filtered.reduce((s, p) => s + Number(p.totalAmount || 0), 0))}</b>
//                       </td>
//                       <td className="num pm-paid">
//                         <b>{money(filtered.reduce((s, p) => s + Number(p.paidAmount || 0), 0))}</b>
//                       </td>
//                       <td className="num pm-pend">
//                         <b>{money(filtered.reduce((s, p) => s + Number(p.pendingAmount || 0), 0))}</b>
//                       </td>
//                       <td colSpan={3} />
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             )}
//           </>
//         )}

//         {/* ================= VENDOR-WISE ================= */}
//         {view === "VENDORS" &&
//           (loading ? (
//             <div className="pm-state">Loading...</div>
//           ) : vendorRows.length === 0 ? (
//             <div className="pm-state">Koi data nahi.</div>
//           ) : (
//             <div className="pm-table-wrap">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Vendor</th>
//                     <th>GSTIN</th>
//                     <th className="num">Bills</th>
//                     <th className="num">Total purchase</th>
//                     <th className="num">Paid</th>
//                     <th className="num">Baaki (pending)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {vendorRows.map((row) => (
//                     <tr
//                       key={row.vendor}
//                       className="pm-click"
//                       onClick={() => {
//                         setSearch(row.vendor);
//                         setView("BILLS");
//                       }}
//                     >
//                       <td><b>{row.vendor}</b></td>
//                       <td>{row.gstin || "—"}</td>
//                       <td className="num">{row.bills}</td>
//                       <td className="num">{money(row.total)}</td>
//                       <td className="num pm-paid">{money(row.paid)}</td>
//                       <td className="num pm-pend"><b>{money(row.pending)}</b></td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td colSpan={2}><b>Total</b></td>
//                     <td className="num"><b>{summary.count}</b></td>
//                     <td className="num"><b>{money(summary.total)}</b></td>
//                     <td className="num pm-paid"><b>{money(summary.paid)}</b></td>
//                     <td className="num pm-pend"><b>{money(summary.pending)}</b></td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           ))}
//       </div>

//       {/* ====================================================
//           PAYMENT MODAL
//       ==================================================== */}
//       {paying && (
//         <div
//           className="pm-backdrop"
//           onMouseDown={(e) => e.target === e.currentTarget && closePayment()}
//         >
//           <form className="pm-modal" onSubmit={submitPayment}>
//             <div className="pm-modal-head">
//               <div>
//                 <h2>Record vendor payment</h2>
//                 <p>{paying.purchaseNumber} — {paying.vendorName}</p>
//               </div>
//               <button type="button" className="pm-x" onClick={closePayment}>
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="pm-pay-summary">
//               <div><span>Total</span><strong>{money(paying.totalAmount)}</strong></div>
//               <div><span>Already paid</span><strong>{money(paying.paidAmount)}</strong></div>
//               <div><span>Pending</span><strong className="pm-pend">{money(paying.pendingAmount)}</strong></div>
//             </div>

//             <div className="pm-grid">
//               <label>
//                 <span>Payment amount *</span>
//                 <input
//                   type="number"
//                   min="0.01"
//                   step="0.01"
//                   max={Number(paying.pendingAmount || 0)}
//                   value={pay.amount}
//                   onChange={(e) => setPayField("amount", e.target.value)}
//                 />
//               </label>

//               <label>
//                 <span>Payment mode</span>
//                 <select value={pay.paymentMode} onChange={(e) => changeMode(e.target.value)}>
//                   {Object.entries(MODE_LABELS).map(([value, label]) => (
//                     <option key={value} value={value}>{label}</option>
//                   ))}
//                 </select>
//               </label>

//               <label>
//                 <span>Payment date</span>
//                 <input
//                   type="date"
//                   value={pay.paymentDate}
//                   onChange={(e) => setPayField("paymentDate", e.target.value)}
//                 />
//               </label>

//               <label>
//                 <span>Transaction status</span>
//                 <select
//                   value={pay.transactionStatus}
//                   onChange={(e) => setPayField("transactionStatus", e.target.value)}
//                 >
//                   <option value="SUCCESS">Success</option>
//                   <option value="PENDING">Pending</option>
//                   <option value="FAILED">Failed</option>
//                   <option value="REVERSED">Reversed</option>
//                 </select>
//               </label>

//               {pay.paymentMode === "UPI" && (
//                 <label>
//                   <span>UPI app *</span>
//                   <select value={pay.upiApp} onChange={(e) => setPayField("upiApp", e.target.value)}>
//                     <option value="">Select UPI app</option>
//                     {Object.entries(UPI_LABELS).map(([value, label]) => (
//                       <option key={value} value={value}>{label}</option>
//                     ))}
//                   </select>
//                 </label>
//               )}

//               {pay.paymentMode === "BANK_TRANSFER" && (
//                 <>
//                   <label>
//                     <span>Transfer type *</span>
//                     <select
//                       value={pay.transferType}
//                       onChange={(e) => setPayField("transferType", e.target.value)}
//                     >
//                       <option value="">Select type</option>
//                       <option value="NEFT">NEFT</option>
//                       <option value="RTGS">RTGS</option>
//                       <option value="IMPS">IMPS</option>
//                       <option value="OTHER">Other</option>
//                     </select>
//                   </label>
//                   <label>
//                     <span>Bank reference</span>
//                     <input
//                       type="text"
//                       value={pay.bankReference}
//                       onChange={(e) => setPayField("bankReference", e.target.value)}
//                     />
//                   </label>
//                 </>
//               )}

//               {(pay.paymentMode === "UPI" || pay.paymentMode === "BANK_TRANSFER") && (
//                 <label>
//                   <span>UTR number *</span>
//                   <input
//                     type="text"
//                     value={pay.utrNumber}
//                     onChange={(e) => setPayField("utrNumber", e.target.value)}
//                   />
//                 </label>
//               )}

//               {(pay.paymentMode === "BANK_TRANSFER" || pay.paymentMode === "CHEQUE") && (
//                 <label>
//                   <span>Bank name</span>
//                   <input
//                     type="text"
//                     value={pay.bankName}
//                     onChange={(e) => setPayField("bankName", e.target.value)}
//                   />
//                 </label>
//               )}

//               {pay.paymentMode === "CHEQUE" && (
//                 <>
//                   <label>
//                     <span>Cheque number *</span>
//                     <input
//                       type="text"
//                       value={pay.chequeNumber}
//                       onChange={(e) => setPayField("chequeNumber", e.target.value)}
//                     />
//                   </label>
//                   <label>
//                     <span>Cheque date *</span>
//                     <input
//                       type="date"
//                       value={pay.chequeDate}
//                       onChange={(e) => setPayField("chequeDate", e.target.value)}
//                     />
//                   </label>
//                 </>
//               )}

//               {pay.paymentMode === "CASH" && (
//                 <label>
//                   <span>Receipt number</span>
//                   <input
//                     type="text"
//                     value={pay.receiptNumber}
//                     onChange={(e) => setPayField("receiptNumber", e.target.value)}
//                   />
//                 </label>
//               )}

//               {(pay.paymentMode === "UPI" || pay.paymentMode === "BANK_TRANSFER") && (
//                 <label className="pm-wide">
//                   <span>Payment slip * (JPG, PNG, WEBP, PDF — max 10 MB)</span>
//                   <input
//                     type="file"
//                     accept=".jpg,.jpeg,.png,.webp,.pdf"
//                     onChange={(e) => setSlip(e.target.files?.[0] || null)}
//                   />
//                   {slip && <small>Selected: {slip.name}</small>}
//                 </label>
//               )}

//               <label className="pm-wide">
//                 <span>Transaction reference (optional)</span>
//                 <input
//                   type="text"
//                   value={pay.transactionReference}
//                   onChange={(e) => setPayField("transactionReference", e.target.value)}
//                 />
//               </label>

//               <label className="pm-wide">
//                 <span>Notes</span>
//                 <textarea
//                   rows={2}
//                   value={pay.notes}
//                   onChange={(e) => setPayField("notes", e.target.value)}
//                 />
//               </label>
//             </div>

//             {payError && <div className="pm-alert pm-alert-error"><span>{payError}</span></div>}

//             <div className="pm-modal-actions">
//               <button type="button" className="pm-btn pm-ghost" onClick={closePayment}>
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="pm-btn pm-primary"
//                 disabled={processingId === paying._id}
//               >
//                 <FaRupeeSign /> {processingId === paying._id ? "Recording..." : "Record payment"}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* ====================================================
//           DETAIL MODAL
//       ==================================================== */}
//       {detail && (
//         <div
//           className="pm-backdrop"
//           onMouseDown={(e) => e.target === e.currentTarget && setDetail(null)}
//         >
//           <div className="pm-modal pm-modal-lg">
//             <div className="pm-modal-head">
//               <div>
//                 <h2>Purchase bill details</h2>
//                 <p>{detail.purchaseNumber || ""}</p>
//               </div>
//               <button type="button" className="pm-x" onClick={() => setDetail(null)}>
//                 <FaTimes />
//               </button>
//             </div>

//             {detailLoading || !detail.purchaseNumber ? (
//               <div className="pm-state">Loading...</div>
//             ) : (
//               <>
//                 <div className="pm-info">
//                   <div><span>Vendor</span><strong>{detail.vendorName || "—"}</strong></div>
//                   <div><span>GSTIN</span><strong>{detail.vendorGstNumber || "—"}</strong></div>
//                   <div><span>State</span><strong>{detail.vendorState || "—"}</strong></div>
//                   <div><span>Phone</span><strong>{detail.vendorPhone || "—"}</strong></div>
//                   <div><span>Email</span><strong>{detail.vendorEmail || "—"}</strong></div>
//                   <div><span>Address</span><strong>{detail.vendorAddress || "—"}</strong></div>
//                   <div><span>Vendor invoice no.</span><strong>{detail.vendorInvoiceNumber || "—"}</strong></div>
//                   <div><span>Invoice date</span><strong>{formatDate(detail.invoiceDate)}</strong></div>
//                   <div><span>Purchase order</span><strong>{poNumberOf(detail)}</strong></div>
//                   <div><span>Created by</span><strong>{userName(detail.createdBy)}</strong></div>
//                   <div><span>Created at</span><strong>{formatDateTime(detail.createdAt)}</strong></div>
//                   <div>
//                     <span>Verification</span>
//                     <strong>
//                       {detail.verified
//                         ? `Verified by ${userName(detail.verifiedBy)} (${formatDateTime(detail.verifiedAt)})`
//                         : "Not verified"}
//                     </strong>
//                   </div>
//                 </div>

//                 <h3>Items</h3>
//                 <div className="pm-table-wrap">
//                   <table className="pm-small-table">
//                     <thead>
//                       <tr>
//                         <th>#</th>
//                         <th>Item</th>
//                         <th>HSN</th>
//                         <th className="num">Qty</th>
//                         <th className="num">Price</th>
//                         <th className="num">GST</th>
//                         <th className="num">Total</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {(detail.items || []).map((item, index) => (
//                         <tr key={item._id || index}>
//                           <td>{index + 1}</td>
//                           <td>
//                             {item.productName || item.product?.name || "—"}
//                             <small>{item.itemModel === "RepairPart" ? "Repair part" : "Product"}</small>
//                           </td>
//                           <td>{item.hsnCode || "—"}</td>
//                           <td className="num">{item.quantity}</td>
//                           <td className="num">{money(item.purchasePrice)}</td>
//                           <td className="num">{Number(item.gst || 0)}%</td>
//                           <td className="num">{money(item.totalAmount)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 <div className="pm-totals">
//                   <div><span>Subtotal</span><strong>{money(detail.subtotal)}</strong></div>
//                   <div><span>GST</span><strong>{money(detail.gstAmount)}</strong></div>
//                   <div className="pm-grand"><span>Total</span><strong>{money(detail.totalAmount)}</strong></div>
//                   <div><span>Paid</span><strong className="pm-paid">{money(detail.paidAmount)}</strong></div>
//                   <div><span>Pending</span><strong className="pm-pend">{money(detail.pendingAmount)}</strong></div>
//                 </div>

//                 <h3>Payment history ({(detail.payments || []).length})</h3>
//                 {(detail.payments || []).length === 0 ? (
//                   <div className="pm-state">Koi payment record nahi hui.</div>
//                 ) : (
//                   <div className="pm-table-wrap">
//                     <table className="pm-small-table">
//                       <thead>
//                         <tr>
//                           <th>Date</th>
//                           <th className="num">Amount</th>
//                           <th>Mode</th>
//                           <th>Details</th>
//                           <th>Recorded by</th>
//                           <th>Status</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {detail.payments.map((payment, index) => (
//                           <tr key={payment._id || index}>
//                             <td>{formatDate(payment.paymentDate)}</td>
//                             <td className="num"><b>{money(payment.amount)}</b></td>
//                             <td>{MODE_LABELS[payment.paymentMode] || payment.paymentMode}</td>
//                             <td>
//                               {payment.upiApp && <small>UPI: {UPI_LABELS[payment.upiApp] || payment.upiApp}</small>}
//                               {payment.transferType && <small>Type: {payment.transferType}</small>}
//                               {payment.utrNumber && <small>UTR: {payment.utrNumber}</small>}
//                               {payment.bankName && <small>Bank: {payment.bankName}</small>}
//                               {payment.bankReference && <small>Bank ref: {payment.bankReference}</small>}
//                               {payment.chequeNumber && <small>Cheque: {payment.chequeNumber} ({formatDate(payment.chequeDate)})</small>}
//                               {payment.receiptNumber && <small>Receipt: {payment.receiptNumber}</small>}
//                               {payment.transactionReference && <small>Ref: {payment.transactionReference}</small>}
//                               {payment.notes && <small>Note: {payment.notes}</small>}
//                               {payment.paymentSlip?.fileUrl && (
//                                 <small>
//                                   <a
//                                     href={`${API_BASE_URL}${payment.paymentSlip.fileUrl}`}
//                                     target="_blank"
//                                     rel="noreferrer"
//                                   >
//                                     View slip
//                                   </a>
//                                 </small>
//                               )}
//                             </td>
//                             <td>{userName(payment.recordedBy)}</td>
//                             <td>
//                               <span className={`pm-badge pm-tx-${String(payment.transactionStatus || "SUCCESS").toLowerCase()}`}>
//                                 {payment.transactionStatus || "SUCCESS"}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}

//                 {detail.notes && (
//                   <div className="pm-notes">
//                     <b>Notes:</b> {detail.notes}
//                   </div>
//                 )}

//                 <div className="pm-modal-actions">
//                   <button
//                     className="pm-btn pm-ghost"
//                     onClick={() => navigate(`/purchase-bills/${detail._id}/invoice`)}
//                   >
//                     <FaFileInvoice /> Invoice
//                   </button>

//                   {!detail.verified && (
//                     <button
//                       className="pm-btn pm-ok-solid"
//                       disabled={processingId === detail._id}
//                       onClick={() => verify(detail)}
//                     >
//                       <FaCheck /> Verify bill
//                     </button>
//                   )}

//                   {isPayable(detail) && (
//                     <button
//                       className="pm-btn pm-primary"
//                       onClick={() => {
//                         const bill = detail;
//                         setDetail(null);
//                         openPayment(bill);
//                       }}
//                     >
//                       <FaRupeeSign /> Record payment
//                     </button>
//                   )}
//                 </div>
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
// .pm-page{width:100%;min-height:100vh;padding:24px;background:#f7f9fc;color:#172033;font-family:Poppins,Arial,sans-serif}
// .pm-page *{box-sizing:border-box}
// .pm-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:20px;flex-wrap:wrap}
// .pm-head h1{margin:0;font-size:26px}
// .pm-head p{margin:6px 0 0;color:#718096;font-size:14px}
// .pm-head-actions{display:flex;gap:8px;flex-wrap:wrap}
// .pm-btn{border:0;border-radius:9px;min-height:40px;padding:8px 14px;font-weight:600;font-size:13px;cursor:pointer;display:inline-flex;align-items:center;gap:7px}
// .pm-btn:disabled,.pm-mini:disabled{opacity:.55;cursor:not-allowed}
// .pm-primary{background:#167c5a;color:#fff}.pm-primary:hover{background:#126b4d}
// .pm-ghost{background:#fff;color:#273444;border:1px solid #dce3eb}.pm-ghost:hover{background:#f1f5f9}
// .pm-ok-solid{background:#2458a6;color:#fff}
// .pm-spin{animation:pmspin .8s linear infinite}
// @keyframes pmspin{to{transform:rotate(360deg)}}
// .pm-alert{display:flex;justify-content:space-between;align-items:center;gap:10px;border-radius:10px;padding:11px 14px;margin-bottom:14px;font-size:13px}
// .pm-alert button{border:0;background:transparent;color:inherit;cursor:pointer}
// .pm-alert-success{background:#eaf8f0;color:#157347;border:1px solid #c9ead8}
// .pm-alert-error{background:#fff0f0;color:#b42318;border:1px solid #ffd2d2}
// .pm-summary{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;margin-bottom:18px}
// .pm-card{background:#fff;border:1px solid #e6eaf0;border-radius:13px;padding:15px 16px}
// .pm-card span{display:block;font-size:12px;color:#718096;margin-bottom:6px}
// .pm-card strong{display:block;font-size:19px}
// .pm-card small{display:block;margin-top:5px;font-size:11px;color:#8490a2}
// .pm-green strong{color:#157347}.pm-amber strong{color:#946200}.pm-red strong{color:#b42318}
// .pm-panel{background:#fff;border:1px solid #e6eaf0;border-radius:14px;padding:18px}
// .pm-toolbar{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:14px}
// .pm-search{flex:1;min-width:240px;display:flex;align-items:center;gap:8px;border:1px solid #d9dee7;border-radius:9px;padding:0 11px;color:#718096;min-height:42px}
// .pm-search input{border:0;outline:0;width:100%;font:inherit;color:#172033;background:transparent}
// .pm-date{display:flex;flex-direction:column;gap:4px;font-size:11px;color:#718096;font-weight:600}
// .pm-date input{border:1px solid #d9dee7;border-radius:9px;padding:9px 10px;font:inherit;color:#172033}
// .pm-switch{display:inline-flex;background:#f1f5f9;border-radius:10px;padding:3px;margin-bottom:14px}
// .pm-switch button{border:0;background:transparent;padding:8px 14px;border-radius:8px;font-weight:600;font-size:13px;cursor:pointer;color:#5b6575}
// .pm-switch button.active{background:#fff;color:#167c5a;box-shadow:0 1px 4px rgba(0,0,0,.08)}
// .pm-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
// .pm-tab{border:1px solid #dce3eb;background:#fff;border-radius:999px;padding:7px 14px;font-size:13px;font-weight:600;cursor:pointer;color:#445;display:inline-flex;gap:7px;align-items:center}
// .pm-tab span{background:#eef3f7;border-radius:999px;padding:1px 8px;font-size:11px}
// .pm-tab.active{background:#167c5a;border-color:#167c5a;color:#fff}
// .pm-tab.active span{background:rgba(255,255,255,.25)}
// .pm-state{padding:32px;text-align:center;color:#718096;font-size:14px}
// .pm-table-wrap{width:100%;overflow-x:auto;border:1px solid #edf0f4;border-radius:10px;margin-bottom:6px}
// .pm-page table{width:100%;min-width:980px;border-collapse:collapse}
// .pm-small-table{min-width:640px!important}
// .pm-page th,.pm-page td{padding:11px 12px;border-bottom:1px solid #edf0f4;text-align:left;font-size:13px;vertical-align:middle}
// .pm-page th{background:#fafbfc;color:#5b6575;font-weight:700;white-space:nowrap}
// .pm-page tbody tr:hover{background:#fafcfd}
// .pm-page tfoot td{background:#fafbfc;border-bottom:0}
// .pm-page .num{text-align:right;white-space:nowrap}
// .pm-page td small{display:block;margin-top:3px;color:#8490a2;font-size:11px}
// .pm-click{cursor:pointer}
// .pm-paid{color:#157347}.pm-pend{color:#946200}
// .pm-badge{display:inline-block;padding:4px 9px;border-radius:999px;font-size:11px;font-weight:700;white-space:nowrap}
// .pm-paid.pm-badge,.pm-badge.pm-paid{background:#e7f7ee;color:#157347}
// .pm-badge.pm-partial,.pm-badge.pm-pending{background:#fff4db;color:#946200}
// .pm-verified,.pm-tx-success{background:#e7f7ee;color:#157347}
// .pm-unverified,.pm-tx-failed,.pm-tx-reversed{background:#fee9e7;color:#b42318}
// .pm-tx-pending{background:#fff4db;color:#946200}
// .pm-actions{display:flex;gap:5px;flex-wrap:wrap}
// .pm-mini{border:0;border-radius:8px;padding:6px 9px;font-size:11px;font-weight:700;cursor:pointer;display:inline-flex;gap:5px;align-items:center}
// .pm-view{background:#edf4ff;color:#2458a6}
// .pm-ok{background:#fff4db;color:#946200}
// .pm-pay{background:#eaf4ef;color:#126344}
// .pm-backdrop{position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,.5);padding:20px;display:flex;justify-content:center;align-items:flex-start;overflow-y:auto}
// .pm-modal{width:min(640px,100%);background:#fff;border-radius:15px;padding:22px;display:grid;gap:14px;margin:auto;box-shadow:0 20px 60px rgba(0,0,0,.2)}
// .pm-modal-lg{width:min(920px,100%)}
// .pm-modal-head{display:flex;justify-content:space-between;gap:14px}
// .pm-modal-head h2{margin:0;font-size:20px}
// .pm-modal-head p{margin:5px 0 0;color:#718096;font-size:13px}
// .pm-modal h3{margin:6px 0 0;font-size:15px}
// .pm-x{width:34px;height:34px;border:0;border-radius:8px;background:#f1f5f9;cursor:pointer;color:#475569}
// .pm-pay-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;background:#f8fafc;border-radius:10px;padding:12px}
// .pm-pay-summary span{display:block;font-size:11px;color:#718096;margin-bottom:4px}
// .pm-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
// .pm-grid label{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:600;color:#445}
// .pm-grid .pm-wide{grid-column:1/-1}
// .pm-grid input,.pm-grid select,.pm-grid textarea{width:100%;border:1px solid #d9dee7;border-radius:9px;padding:9px 10px;font:inherit;color:#172033;outline:0;background:#fff}
// .pm-grid input:focus,.pm-grid select:focus,.pm-grid textarea:focus{border-color:#167c5a;box-shadow:0 0 0 3px rgba(22,124,90,.1)}
// .pm-modal-actions{display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap;margin-top:4px}
// .pm-info{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
// .pm-info div{border:1px solid #edf0f4;border-radius:9px;padding:10px;min-width:0}
// .pm-info span{display:block;font-size:11px;color:#718096;margin-bottom:4px}
// .pm-info strong{font-size:13px;overflow-wrap:anywhere}
// .pm-totals{margin-left:auto;width:min(320px,100%);display:grid;gap:6px}
// .pm-totals div{display:flex;justify-content:space-between;font-size:13px}
// .pm-grand{border-top:1px solid #edf0f4;padding-top:6px;font-size:15px!important;font-weight:700}
// .pm-notes{background:#f8fafc;border-radius:9px;padding:11px;font-size:13px;color:#5b6575;white-space:pre-wrap}
// @media(max-width:1200px){.pm-summary{grid-template-columns:repeat(3,minmax(0,1fr))}}
// @media(max-width:800px){.pm-info{grid-template-columns:repeat(2,1fr)}}
// @media(max-width:600px){
//  .pm-page{padding:12px}
//  .pm-summary{grid-template-columns:1fr 1fr}
//  .pm-grid,.pm-info,.pm-pay-summary{grid-template-columns:1fr}
//  .pm-modal{padding:15px}
//  .pm-head-actions .pm-btn{flex:1}
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
// API CONFIGURATION
// ======================================================
// IMPORTANT:
// API URL ONLY comes from VITE_API_URL in .env
//
// Local:
// VITE_API_URL=http://localhost:5000/api
//
// Production:
// VITE_API_URL=https://zaid.kashichem.com/api
// ======================================================

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error(
    "VITE_API_URL is not configured. Please add VITE_API_URL in your .env file."
  );
}

const token = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  "";

const jsonHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

const request = async (path, options = {}) => {
  if (!API_BASE_URL) {
    throw new Error(
      "API URL is not configured. Please check your VITE_API_URL environment variable."
    );
  }

  const response = await fetch(`${API_BASE_URL}${path}`, options);

  let result = {};

  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message ||
        result.error ||
        `Request failed with status ${response.status}`
    );
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

  if (typeof po === "object") {
    return po.poNumber || po._id || "PO";
  }

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

const invoiceDateOf = (purchase) =>
  purchase.invoiceDate || purchase.createdAt;

const isPayable = (purchase) =>
  purchase.verified &&
  Number(purchase.pendingAmount || 0) > 0;

const TABS = [
  {
    value: "ALL",
    label: "All",
    test: () => true,
  },

  {
    value: "UNVERIFIED",
    label: "Unverified",
    test: (purchase) => !purchase.verified,
  },

  {
    value: "PAYABLE",
    label: "Payable",
    test: isPayable,
  },

  {
    value: "PARTIAL",
    label: "Partial",
    test: (purchase) =>
      purchase.paymentStatus === "PARTIAL",
  },

  {
    value: "PAID",
    label: "Paid",
    test: (purchase) =>
      purchase.paymentStatus === "PAID",
  },
];

const emptyPayment = (pending = 0) => ({
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

  const [view, setView] = useState("BILLS");

  const [tab, setTab] = useState("ALL");

  const [search, setSearch] = useState("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const [detail, setDetail] = useState(null);

  const [detailLoading, setDetailLoading] =
    useState(false);

  const [paying, setPaying] = useState(null);

  const [pay, setPay] = useState(emptyPayment());

  const [slip, setSlip] = useState(null);

  const [payError, setPayError] = useState("");

  const [processingId, setProcessingId] =
    useState(null);

  // ====================================================
  // LOAD PURCHASE BILLS
  // ====================================================

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await request("/purchase", {
        headers: jsonHeaders(),
      });

      setPurchases(
        Array.isArray(result.data)
          ? result.data
          : []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to load purchase bills"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ====================================================
  // SUCCESS MESSAGE TIMER
  // ====================================================

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [success]);

  // ====================================================
  // DATE FILTER
  // ====================================================

  const inDateRange = useCallback(
    (purchase) => {
      const value = invoiceDateOf(purchase);

      if (!fromDate && !toDate) {
        return true;
      }

      if (!value) {
        return false;
      }

      const day = new Date(value)
        .toISOString()
        .slice(0, 10);

      if (fromDate && day < fromDate) {
        return false;
      }

      if (toDate && day > toDate) {
        return false;
      }

      return true;
    },
    [fromDate, toDate]
  );

  // ====================================================
  // SEARCH + DATE FILTER
  // ====================================================

  const scoped = useMemo(() => {
    const term = search.trim().toLowerCase();

    return purchases.filter((purchase) => {
      if (!inDateRange(purchase)) {
        return false;
      }

      if (!term) {
        return true;
      }

      return [
        purchase.purchaseNumber,
        purchase.vendorName,
        purchase.vendorInvoiceNumber,
        purchase.vendorGstNumber,
        poNumberOf(purchase),
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(term)
      );
    });
  }, [
    purchases,
    search,
    inDateRange,
  ]);

  // ====================================================
  // TAB COUNTS
  // ====================================================

  const counts = useMemo(() => {
    const result = {};

    TABS.forEach((tabItem) => {
      result[tabItem.value] =
        scoped.filter(tabItem.test).length;
    });

    return result;
  }, [scoped]);

  // ====================================================
  // CURRENT FILTERED DATA
  // ====================================================

  const filtered = useMemo(() => {
    const current =
      TABS.find(
        (tabItem) =>
          tabItem.value === tab
      ) || TABS[0];

    return scoped.filter(current.test);
  }, [scoped, tab]);

  // ====================================================
  // SUMMARY
  // ====================================================

  const summary = useMemo(() => {
    const sum = (list, key) =>
      list.reduce(
        (total, item) =>
          total + Number(item[key] || 0),
        0
      );

    const payable = scoped.filter(isPayable);

    return {
      count: scoped.length,

      subtotal: sum(
        scoped,
        "subtotal"
      ),

      gst: sum(
        scoped,
        "gstAmount"
      ),

      total: sum(
        scoped,
        "totalAmount"
      ),

      paid: sum(
        scoped,
        "paidAmount"
      ),

      pending: sum(
        scoped,
        "pendingAmount"
      ),

      payableAmount: sum(
        payable,
        "pendingAmount"
      ),

      payableCount: payable.length,

      unverified: scoped.filter(
        (purchase) => !purchase.verified
      ).length,
    };
  }, [scoped]);

  // ====================================================
  // VENDOR-WISE HISAB
  // ====================================================

  const vendorRows = useMemo(() => {
    const map = new Map();

    scoped.forEach((purchase) => {
      const key =
        (purchase.vendorName || "Unknown").trim();

      if (!map.has(key)) {
        map.set(key, {
          vendor: key,
          gstin:
            purchase.vendorGstNumber || "",
          bills: 0,
          total: 0,
          paid: 0,
          pending: 0,
        });
      }

      const row = map.get(key);

      row.bills += 1;

      row.total += Number(
        purchase.totalAmount || 0
      );

      row.paid += Number(
        purchase.paidAmount || 0
      );

      row.pending += Number(
        purchase.pendingAmount || 0
      );
    });

    return Array.from(map.values()).sort(
      (a, b) =>
        b.pending - a.pending
    );
  }, [scoped]);

  // ====================================================
  // OPEN DETAIL
  // ====================================================

  const openDetail = async (purchaseId) => {
    setDetailLoading(true);

    setDetail({
      _id: purchaseId,
    });

    setError("");

    try {
      const result = await request(
        `/purchase/${purchaseId}`,
        {
          headers: jsonHeaders(),
        }
      );

      setDetail(result.data);
    } catch (err) {
      setDetail(null);

      setError(
        err.message ||
          "Unable to load bill details"
      );
    } finally {
      setDetailLoading(false);
    }
  };

  // ====================================================
  // REFRESH DETAIL
  // ====================================================

  const refreshDetail = async (purchaseId) => {
    try {
      const result = await request(
        `/purchase/${purchaseId}`,
        {
          headers: jsonHeaders(),
        }
      );

      setDetail((current) =>
        current &&
        current._id === purchaseId
          ? result.data
          : current
      );
    } catch {
      // intentionally ignored
    }
  };

  // ====================================================
  // VERIFY BILL
  // ====================================================

  const verify = async (purchase) => {
    const confirmed =
      window.confirm(
        `Verify purchase bill ${purchase.purchaseNumber}?\n\nVerify karne ke baad hi vendor payment record hoga.`
      );

    if (!confirmed) {
      return;
    }

    setError("");

    setProcessingId(
      purchase._id
    );

    try {
      await request(
        `/purchase/${purchase._id}/verify`,
        {
          method: "PUT",
          headers: jsonHeaders(),
        }
      );

      setSuccess(
        `${purchase.purchaseNumber} verified successfully.`
      );

      await load();

      await refreshDetail(
        purchase._id
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to verify bill"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ====================================================
  // OPEN PAYMENT
  // ====================================================

  const openPayment = (purchase) => {
    setPay(
      emptyPayment(
        Number(
          purchase.pendingAmount || 0
        )
      )
    );

    setSlip(null);

    setPayError("");

    setPaying(purchase);
  };

  // ====================================================
  // CLOSE PAYMENT
  // ====================================================

  const closePayment = () => {
    setPaying(null);

    setSlip(null);

    setPayError("");
  };

  // ====================================================
  // PAYMENT FIELD
  // ====================================================

  const setPayField = (
    field,
    value
  ) => {
    setPay((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ====================================================
  // PAYMENT MODE
  // ====================================================

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

    if (
      mode !== "UPI" &&
      mode !== "BANK_TRANSFER"
    ) {
      setSlip(null);
    }
  };

  // ====================================================
  // SUBMIT PAYMENT
  // ====================================================

  const submitPayment = async (event) => {
    event.preventDefault();

    setPayError("");

    if (!paying) {
      return;
    }

    const amount =
      Number(pay.amount);

    const pending =
      Number(
        paying.pendingAmount || 0
      );

    const mode =
      pay.paymentMode;

    // ------------------------------
    // Amount validation
    // ------------------------------

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setPayError(
        "Please enter a valid payment amount."
      );

      return;
    }

    if (amount > pending) {
      setPayError(
        `Payment cannot be greater than pending amount ${money(
          pending
        )}.`
      );

      return;
    }

    // ------------------------------
    // UPI validation
    // ------------------------------

    if (mode === "UPI") {
      if (!pay.upiApp) {
        setPayError(
          "Please select the UPI app."
        );

        return;
      }

      if (!pay.utrNumber.trim()) {
        setPayError(
          "Please enter the UTR number."
        );

        return;
      }

      if (!slip) {
        setPayError(
          "Please upload the payment slip."
        );

        return;
      }
    }

    // ------------------------------
    // Bank transfer validation
    // ------------------------------

    if (
      mode === "BANK_TRANSFER"
    ) {
      if (!pay.transferType) {
        setPayError(
          "Please select the transfer type."
        );

        return;
      }

      if (!pay.utrNumber.trim()) {
        setPayError(
          "Please enter the UTR number."
        );

        return;
      }

      if (!slip) {
        setPayError(
          "Please upload the payment slip."
        );

        return;
      }
    }

    // ------------------------------
    // Cheque validation
    // ------------------------------

    if (mode === "CHEQUE") {
      if (!pay.chequeNumber.trim()) {
        setPayError(
          "Please enter the cheque number."
        );

        return;
      }

      if (!pay.chequeDate) {
        setPayError(
          "Please select the cheque date."
        );

        return;
      }
    }

    // ==================================================
    // FORM DATA
    // ==================================================

    const formData =
      new FormData();

    formData.append(
      "amount",
      amount
    );

    formData.append(
      "paymentMode",
      mode
    );

    formData.append(
      "paymentDate",
      pay.paymentDate
    );

    formData.append(
      "transactionStatus",
      pay.transactionStatus
    );

    formData.append(
      "notes",
      pay.notes.trim()
    );

    formData.append(
      "transactionReference",
      pay.transactionReference.trim()
    );

    formData.append(
      "upiApp",
      mode === "UPI"
        ? pay.upiApp
        : ""
    );

    formData.append(
      "utrNumber",
      mode === "UPI" ||
        mode === "BANK_TRANSFER"
        ? pay.utrNumber.trim()
        : ""
    );

    formData.append(
      "bankName",
      mode === "BANK_TRANSFER" ||
        mode === "CHEQUE"
        ? pay.bankName.trim()
        : ""
    );

    formData.append(
      "bankReference",
      mode === "BANK_TRANSFER"
        ? pay.bankReference.trim()
        : ""
    );

    formData.append(
      "transferType",
      mode === "BANK_TRANSFER"
        ? pay.transferType
        : ""
    );

    formData.append(
      "chequeNumber",
      mode === "CHEQUE"
        ? pay.chequeNumber.trim()
        : ""
    );

    formData.append(
      "chequeDate",
      mode === "CHEQUE"
        ? pay.chequeDate
        : ""
    );

    formData.append(
      "receiptNumber",
      mode === "CASH"
        ? pay.receiptNumber.trim()
        : ""
    );

    if (slip) {
      formData.append(
        "paymentSlip",
        slip
      );
    }

    // ==================================================
    // PAYMENT REQUEST
    // ==================================================

    setProcessingId(
      paying._id
    );

    try {
      await request(
        `/purchase/${paying._id}/payment`,
        {
          method: "PUT",

          // IMPORTANT:
          // Do NOT set Content-Type here.
          // Browser automatically creates multipart/form-data
          // boundary when body is FormData.

          headers: {
            Authorization: `Bearer ${token()}`,
          },

          body: formData,
        }
      );

      setSuccess(
        `Payment of ${money(
          amount
        )} recorded for ${
          paying.purchaseNumber
        }.`
      );

      const id =
        paying._id;

      closePayment();

      await load();

      await refreshDetail(id);
    } catch (err) {
      setPayError(
        err.message ||
          "Unable to record payment"
      );
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

    const escape = (value) =>
      `"${String(
        value ?? ""
      ).replace(/"/g, '""')}"`;

    const lines = filtered.map(
      (purchase) =>
        [
          purchase.purchaseNumber,

          formatDate(
            invoiceDateOf(purchase)
          ),

          purchase.vendorName,

          purchase.vendorGstNumber,

          purchase.vendorInvoiceNumber,

          poNumberOf(purchase),

          Number(
            purchase.subtotal || 0
          ).toFixed(2),

          Number(
            purchase.gstAmount || 0
          ).toFixed(2),

          Number(
            purchase.totalAmount || 0
          ).toFixed(2),

          Number(
            purchase.paidAmount || 0
          ).toFixed(2),

          Number(
            purchase.pendingAmount || 0
          ).toFixed(2),

          purchase.paymentStatus,

          purchase.verified
            ? "Yes"
            : "No",
        ]
          .map(escape)
          .join(",")
    );

    const blob = new Blob(
      [
        [
          header
            .map(escape)
            .join(","),
          ...lines,
        ].join("\n"),
      ],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `purchase-bills-${todayISO()}.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(url);
  };

  // ====================================================
  // FILTER CLEAR
  // ====================================================

  const clearFilters = () => {
    setSearch("");

    setFromDate("");

    setToDate("");

    setTab("ALL");
  };

  const hasFilters =
    Boolean(
      search ||
        fromDate ||
        toDate
    );

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="pm-page">
      <style>{css}</style>

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="pm-head">
        <div>
          <h1>
            Purchase &amp;
            Vendor Payments
          </h1>

          <p>
            Vendor bills verify karein,
            payment record karein aur
            poora hisab dekhein.
          </p>
        </div>

        <div className="pm-head-actions">
          <button
            className="pm-btn pm-ghost"
            onClick={exportCsv}
            disabled={!filtered.length}
          >
            <FaDownload />

            Export CSV
          </button>

          <button
            className="pm-btn pm-ghost"
            onClick={load}
            disabled={loading}
          >
            <FaSyncAlt
              className={
                loading
                  ? "pm-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            className="pm-btn pm-primary"
            onClick={() =>
              navigate(
                "/add-purchase-bill"
              )
            }
          >
            <FaPlus />

            Add purchase bill
          </button>
        </div>
      </div>

      {/* ==================================================
          ALERTS
      ================================================== */}

      {success && (
        <div className="pm-alert pm-alert-success">
          <span>
            <FaCheck />{" "}
            {success}
          </span>

          <button
            onClick={() =>
              setSuccess("")
            }
          >
            <FaTimes />
          </button>
        </div>
      )}

      {error && (
        <div className="pm-alert pm-alert-error">
          <span>{error}</span>

          <button
            onClick={() =>
              setError("")
            }
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* ==================================================
          SUMMARY
      ================================================== */}

      <div className="pm-summary">
        <div className="pm-card">
          <span>
            Total bills
          </span>

          <strong>
            {summary.count}
          </strong>

          <small>
            {summary.unverified}{" "}
            unverified
          </small>
        </div>

        <div className="pm-card">
          <span>
            Taxable value
          </span>

          <strong>
            {money(
              summary.subtotal
            )}
          </strong>

          <small>
            GST:{" "}
            {money(
              summary.gst
            )}
          </small>
        </div>

        <div className="pm-card">
          <span>
            Total purchase
          </span>

          <strong>
            {money(
              summary.total
            )}
          </strong>

          <small>
            GST included
          </small>
        </div>

        <div className="pm-card pm-green">
          <span>
            Paid to vendors
          </span>

          <strong>
            {money(
              summary.paid
            )}
          </strong>
        </div>

        <div className="pm-card pm-amber">
          <span>
            Total pending
          </span>

          <strong>
            {money(
              summary.pending
            )}
          </strong>

          <small>
            Sab bills ka baaki
          </small>
        </div>

        <div className="pm-card pm-red">
          <span>
            Payable now
          </span>

          <strong>
            {money(
              summary.payableAmount
            )}
          </strong>

          <small>
            {summary.payableCount}{" "}
            verified bill(s)
          </small>
        </div>
      </div>

      {/* ==================================================
          FILTER PANEL
      ================================================== */}

      <div className="pm-panel">
        <div className="pm-toolbar">
          <div className="pm-search">
            <FaSearch />

            <input
              type="text"
              placeholder="Purchase no, vendor, invoice no, GSTIN, PO..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>

          <label className="pm-date">
            <span>From</span>

            <input
              type="date"
              value={fromDate}
              onChange={(event) =>
                setFromDate(
                  event.target.value
                )
              }
            />
          </label>

          <label className="pm-date">
            <span>To</span>

            <input
              type="date"
              value={toDate}
              onChange={(event) =>
                setToDate(
                  event.target.value
                )
              }
            />
          </label>

          {hasFilters && (
            <button
              className="pm-btn pm-ghost"
              onClick={
                clearFilters
              }
            >
              <FaTimes />

              Clear
            </button>
          )}
        </div>

        {/* ==================================================
            BILL / VENDOR SWITCH
        ================================================== */}

        <div className="pm-switch">
          <button
            className={
              view === "BILLS"
                ? "active"
                : ""
            }
            onClick={() =>
              setView("BILLS")
            }
          >
            Bill-wise
          </button>

          <button
            className={
              view === "VENDORS"
                ? "active"
                : ""
            }
            onClick={() =>
              setView("VENDORS")
            }
          >
            Vendor-wise hisab
          </button>
        </div>

        {/* ==================================================
            BILL-WISE
        ================================================== */}

        {view === "BILLS" && (
          <>
            <div className="pm-tabs">
              {TABS.map(
                (tabItem) => (
                  <button
                    key={
                      tabItem.value
                    }
                    className={`pm-tab ${
                      tab ===
                      tabItem.value
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setTab(
                        tabItem.value
                      )
                    }
                  >
                    {tabItem.label}

                    <span>
                      {counts[
                        tabItem.value
                      ] || 0}
                    </span>
                  </button>
                )
              )}
            </div>

            {loading ? (
              <div className="pm-state">
                Loading purchase
                bills...
              </div>
            ) : filtered.length ===
              0 ? (
              <div className="pm-state">
                {purchases.length ===
                0
                  ? "Abhi koi purchase bill nahi hai."
                  : "Filters se koi bill match nahi hua."}
              </div>
            ) : (
              <div className="pm-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>
                        Purchase
                      </th>

                      <th>
                        Vendor
                      </th>

                      <th>
                        Invoice / PO
                      </th>

                      <th className="num">
                        GST
                      </th>

                      <th className="num">
                        Total
                      </th>

                      <th className="num">
                        Paid
                      </th>

                      <th className="num">
                        Pending
                      </th>

                      <th>
                        Payment
                      </th>

                      <th>
                        Verified
                      </th>

                      <th>
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map(
                      (purchase) => {
                        const busy =
                          processingId ===
                          purchase._id;

                        return (
                          <tr
                            key={
                              purchase._id
                            }
                          >
                            <td>
                              <b>
                                {
                                  purchase.purchaseNumber ||
                                  "—"
                                }
                              </b>

                              <small>
                                {formatDate(
                                  invoiceDateOf(
                                    purchase
                                  )
                                )}
                              </small>
                            </td>

                            <td>
                              <b>
                                {
                                  purchase.vendorName ||
                                  "—"
                                }
                              </b>

                              {purchase.vendorGstNumber && (
                                <small>
                                  {
                                    purchase.vendorGstNumber
                                  }
                                </small>
                              )}
                            </td>

                            <td>
                              {
                                purchase.vendorInvoiceNumber ||
                                "—"
                              }

                              <small>
                                {poNumberOf(
                                  purchase
                                )}
                              </small>
                            </td>

                            <td className="num">
                              {money(
                                purchase.gstAmount
                              )}
                            </td>

                            <td className="num">
                              <b>
                                {money(
                                  purchase.totalAmount
                                )}
                              </b>
                            </td>

                            <td className="num pm-paid">
                              {money(
                                purchase.paidAmount
                              )}
                            </td>

                            <td className="num pm-pend">
                              {money(
                                purchase.pendingAmount
                              )}
                            </td>

                            <td>
                              <span
                                className={`pm-badge pm-${String(
                                  purchase.paymentStatus ||
                                    "PENDING"
                                ).toLowerCase()}`}
                              >
                                {
                                  purchase.paymentStatus ||
                                  "PENDING"
                                }
                              </span>
                            </td>

                            <td>
                              {purchase.verified ? (
                                <span className="pm-badge pm-verified">
                                  Verified
                                </span>
                              ) : (
                                <span className="pm-badge pm-unverified">
                                  Unverified
                                </span>
                              )}
                            </td>

                            <td>
                              <div className="pm-actions">
                                <button
                                  className="pm-mini pm-view"
                                  onClick={() =>
                                    openDetail(
                                      purchase._id
                                    )
                                  }
                                >
                                  <FaEye />

                                  View
                                </button>

                                {!purchase.verified && (
                                  <button
                                    className="pm-mini pm-ok"
                                    disabled={
                                      busy
                                    }
                                    onClick={() =>
                                      verify(
                                        purchase
                                      )
                                    }
                                  >
                                    <FaCheck />

                                    {busy
                                      ? "..."
                                      : "Verify"}
                                  </button>
                                )}

                                {isPayable(
                                  purchase
                                ) && (
                                  <button
                                    className="pm-mini pm-pay"
                                    disabled={
                                      busy
                                    }
                                    onClick={() =>
                                      openPayment(
                                        purchase
                                      )
                                    }
                                  >
                                    <FaRupeeSign />

                                    Pay
                                  </button>
                                )}

                                <button
                                  className="pm-mini pm-view"
                                  title="Vendor invoice"
                                  onClick={() =>
                                    navigate(
                                      `/purchase-bills/${purchase._id}/invoice`
                                    )
                                  }
                                >
                                  <FaFileInvoice />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>

                  <tfoot>
                    <tr>
                      <td
                        colSpan={3}
                      >
                        <b>
                          Total (
                          {
                            filtered.length
                          }{" "}
                          bills)
                        </b>
                      </td>

                      <td className="num">
                        <b>
                          {money(
                            filtered.reduce(
                              (
                                total,
                                purchase
                              ) =>
                                total +
                                Number(
                                  purchase.gstAmount ||
                                    0
                                ),
                              0
                            )
                          )}
                        </b>
                      </td>

                      <td className="num">
                        <b>
                          {money(
                            filtered.reduce(
                              (
                                total,
                                purchase
                              ) =>
                                total +
                                Number(
                                  purchase.totalAmount ||
                                    0
                                ),
                              0
                            )
                          )}
                        </b>
                      </td>

                      <td className="num pm-paid">
                        <b>
                          {money(
                            filtered.reduce(
                              (
                                total,
                                purchase
                              ) =>
                                total +
                                Number(
                                  purchase.paidAmount ||
                                    0
                                ),
                              0
                            )
                          )}
                        </b>
                      </td>

                      <td className="num pm-pend">
                        <b>
                          {money(
                            filtered.reduce(
                              (
                                total,
                                purchase
                              ) =>
                                total +
                                Number(
                                  purchase.pendingAmount ||
                                    0
                                ),
                              0
                            )
                          )}
                        </b>
                      </td>

                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </>
        )}

        {/* ==================================================
            VENDOR-WISE
        ================================================== */}

        {view === "VENDORS" &&
          (loading ? (
            <div className="pm-state">
              Loading...
            </div>
          ) : vendorRows.length ===
            0 ? (
            <div className="pm-state">
              Koi data nahi.
            </div>
          ) : (
            <div className="pm-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>
                      Vendor
                    </th>

                    <th>
                      GSTIN
                    </th>

                    <th className="num">
                      Bills
                    </th>

                    <th className="num">
                      Total purchase
                    </th>

                    <th className="num">
                      Paid
                    </th>

                    <th className="num">
                      Baaki (pending)
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {vendorRows.map(
                    (row) => (
                      <tr
                        key={
                          row.vendor
                        }
                        className="pm-click"
                        onClick={() => {
                          setSearch(
                            row.vendor
                          );

                          setView(
                            "BILLS"
                          );
                        }}
                      >
                        <td>
                          <b>
                            {
                              row.vendor
                            }
                          </b>
                        </td>

                        <td>
                          {
                            row.gstin ||
                            "—"
                          }
                        </td>

                        <td className="num">
                          {row.bills}
                        </td>

                        <td className="num">
                          {money(
                            row.total
                          )}
                        </td>

                        <td className="num pm-paid">
                          {money(
                            row.paid
                          )}
                        </td>

                        <td className="num pm-pend">
                          <b>
                            {money(
                              row.pending
                            )}
                          </b>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

                <tfoot>
                  <tr>
                    <td colSpan={2}>
                      <b>
                        Total
                      </b>
                    </td>

                    <td className="num">
                      <b>
                        {
                          summary.count
                        }
                      </b>
                    </td>

                    <td className="num">
                      <b>
                        {money(
                          summary.total
                        )}
                      </b>
                    </td>

                    <td className="num pm-paid">
                      <b>
                        {money(
                          summary.paid
                        )}
                      </b>
                    </td>

                    <td className="num pm-pend">
                      <b>
                        {money(
                          summary.pending
                        )}
                      </b>
                    </td>
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
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closePayment();
            }
          }}
        >
          <form
            className="pm-modal"
            onSubmit={
              submitPayment
            }
          >
            <div className="pm-modal-head">
              <div>
                <h2>
                  Record vendor
                  payment
                </h2>

                <p>
                  {
                    paying.purchaseNumber
                  }{" "}
                  —{" "}
                  {
                    paying.vendorName
                  }
                </p>
              </div>

              <button
                type="button"
                className="pm-x"
                onClick={
                  closePayment
                }
              >
                <FaTimes />
              </button>
            </div>

            <div className="pm-pay-summary">
              <div>
                <span>
                  Total
                </span>

                <strong>
                  {money(
                    paying.totalAmount
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Already paid
                </span>

                <strong>
                  {money(
                    paying.paidAmount
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Pending
                </span>

                <strong className="pm-pend">
                  {money(
                    paying.pendingAmount
                  )}
                </strong>
              </div>
            </div>

            <div className="pm-grid">
              <label>
                <span>
                  Payment amount *
                </span>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={Number(
                    paying.pendingAmount ||
                      0
                  )}
                  value={
                    pay.amount
                  }
                  onChange={(
                    event
                  ) =>
                    setPayField(
                      "amount",
                      event.target
                        .value
                    )
                  }
                />
              </label>

              <label>
                <span>
                  Payment mode
                </span>

                <select
                  value={
                    pay.paymentMode
                  }
                  onChange={(
                    event
                  ) =>
                    changeMode(
                      event.target
                        .value
                    )
                  }
                >
                  {Object.entries(
                    MODE_LABELS
                  ).map(
                    ([
                      value,
                      label,
                    ]) => (
                      <option
                        key={
                          value
                        }
                        value={
                          value
                        }
                      >
                        {
                          label
                        }
                      </option>
                    )
                  )}
                </select>
              </label>

              <label>
                <span>
                  Payment date
                </span>

                <input
                  type="date"
                  value={
                    pay.paymentDate
                  }
                  onChange={(
                    event
                  ) =>
                    setPayField(
                      "paymentDate",
                      event.target
                        .value
                    )
                  }
                />
              </label>

              <label>
                <span>
                  Transaction status
                </span>

                <select
                  value={
                    pay.transactionStatus
                  }
                  onChange={(
                    event
                  ) =>
                    setPayField(
                      "transactionStatus",
                      event.target
                        .value
                    )
                  }
                >
                  <option value="SUCCESS">
                    Success
                  </option>

                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="FAILED">
                    Failed
                  </option>

                  <option value="REVERSED">
                    Reversed
                  </option>
                </select>
              </label>

              {pay.paymentMode ===
                "UPI" && (
                <label>
                  <span>
                    UPI app *
                  </span>

                  <select
                    value={
                      pay.upiApp
                    }
                    onChange={(
                      event
                    ) =>
                      setPayField(
                        "upiApp",
                        event.target
                          .value
                      )
                    }
                  >
                    <option value="">
                      Select UPI app
                    </option>

                    {Object.entries(
                      UPI_LABELS
                    ).map(
                      ([
                        value,
                        label,
                      ]) => (
                        <option
                          key={
                            value
                          }
                          value={
                            value
                          }
                        >
                          {
                            label
                          }
                        </option>
                      )
                    )}
                  </select>
                </label>
              )}

              {pay.paymentMode ===
                "BANK_TRANSFER" && (
                <>
                  <label>
                    <span>
                      Transfer type *
                    </span>

                    <select
                      value={
                        pay.transferType
                      }
                      onChange={(
                        event
                      ) =>
                        setPayField(
                          "transferType",
                          event.target
                            .value
                        )
                      }
                    >
                      <option value="">
                        Select type
                      </option>

                      <option value="NEFT">
                        NEFT
                      </option>

                      <option value="RTGS">
                        RTGS
                      </option>

                      <option value="IMPS">
                        IMPS
                      </option>

                      <option value="OTHER">
                        Other
                      </option>
                    </select>
                  </label>

                  <label>
                    <span>
                      Bank reference
                    </span>

                    <input
                      type="text"
                      value={
                        pay.bankReference
                      }
                      onChange={(
                        event
                      ) =>
                        setPayField(
                          "bankReference",
                          event.target
                            .value
                        )
                      }
                    />
                  </label>
                </>
              )}

              {(pay.paymentMode ===
                "UPI" ||
                pay.paymentMode ===
                  "BANK_TRANSFER") && (
                <label>
                  <span>
                    UTR number *
                  </span>

                  <input
                    type="text"
                    value={
                      pay.utrNumber
                    }
                    onChange={(
                      event
                    ) =>
                      setPayField(
                        "utrNumber",
                        event.target
                          .value
                      )
                    }
                  />
                </label>
              )}

              {(pay.paymentMode ===
                "BANK_TRANSFER" ||
                pay.paymentMode ===
                  "CHEQUE") && (
                <label>
                  <span>
                    Bank name
                  </span>

                  <input
                    type="text"
                    value={
                      pay.bankName
                    }
                    onChange={(
                      event
                    ) =>
                      setPayField(
                        "bankName",
                        event.target
                          .value
                      )
                    }
                  />
                </label>
              )}

              {pay.paymentMode ===
                "CHEQUE" && (
                <>
                  <label>
                    <span>
                      Cheque number *
                    </span>

                    <input
                      type="text"
                      value={
                        pay.chequeNumber
                      }
                      onChange={(
                        event
                      ) =>
                        setPayField(
                          "chequeNumber",
                          event.target
                            .value
                        )
                      }
                    />
                  </label>

                  <label>
                    <span>
                      Cheque date *
                    </span>

                    <input
                      type="date"
                      value={
                        pay.chequeDate
                      }
                      onChange={(
                        event
                      ) =>
                        setPayField(
                          "chequeDate",
                          event.target
                            .value
                        )
                      }
                    />
                  </label>
                </>
              )}

              {pay.paymentMode ===
                "CASH" && (
                <label>
                  <span>
                    Receipt number
                  </span>

                  <input
                    type="text"
                    value={
                      pay.receiptNumber
                    }
                    onChange={(
                      event
                    ) =>
                      setPayField(
                        "receiptNumber",
                        event.target
                          .value
                      )
                    }
                  />
                </label>
              )}

              {(pay.paymentMode ===
                "UPI" ||
                pay.paymentMode ===
                  "BANK_TRANSFER") && (
                <label className="pm-wide">
                  <span>
                    Payment slip * (JPG,
                    PNG, WEBP, PDF —
                    max 10 MB)
                  </span>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={(
                      event
                    ) =>
                      setSlip(
                        event.target
                          .files?.[0] ||
                          null
                      )
                    }
                  />

                  {slip && (
                    <small>
                      Selected:{" "}
                      {slip.name}
                    </small>
                  )}
                </label>
              )}

              <label className="pm-wide">
                <span>
                  Transaction reference
                  (optional)
                </span>

                <input
                  type="text"
                  value={
                    pay.transactionReference
                  }
                  onChange={(
                    event
                  ) =>
                    setPayField(
                      "transactionReference",
                      event.target
                        .value
                    )
                  }
                />
              </label>

              <label className="pm-wide">
                <span>
                  Notes
                </span>

                <textarea
                  rows={2}
                  value={
                    pay.notes
                  }
                  onChange={(
                    event
                  ) =>
                    setPayField(
                      "notes",
                      event.target
                        .value
                    )
                  }
                />
              </label>
            </div>

            {payError && (
              <div className="pm-alert pm-alert-error">
                <span>
                  {payError}
                </span>
              </div>
            )}

            <div className="pm-modal-actions">
              <button
                type="button"
                className="pm-btn pm-ghost"
                onClick={
                  closePayment
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="pm-btn pm-primary"
                disabled={
                  processingId ===
                  paying._id
                }
              >
                <FaRupeeSign />

                {processingId ===
                paying._id
                  ? "Recording..."
                  : "Record payment"}
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
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setDetail(null);
            }
          }}
        >
          <div className="pm-modal pm-modal-lg">
            <div className="pm-modal-head">
              <div>
                <h2>
                  Purchase bill
                  details
                </h2>

                <p>
                  {
                    detail.purchaseNumber ||
                    ""
                  }
                </p>
              </div>

              <button
                type="button"
                className="pm-x"
                onClick={() =>
                  setDetail(null)
                }
              >
                <FaTimes />
              </button>
            </div>

            {detailLoading ||
            !detail.purchaseNumber ? (
              <div className="pm-state">
                Loading...
              </div>
            ) : (
              <>
                <div className="pm-info">
                  <div>
                    <span>
                      Vendor
                    </span>

                    <strong>
                      {
                        detail.vendorName ||
                        "—"
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      GSTIN
                    </span>

                    <strong>
                      {
                        detail.vendorGstNumber ||
                        "—"
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      State
                    </span>

                    <strong>
                      {
                        detail.vendorState ||
                        "—"
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Phone
                    </span>

                    <strong>
                      {
                        detail.vendorPhone ||
                        "—"
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Email
                    </span>

                    <strong>
                      {
                        detail.vendorEmail ||
                        "—"
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Address
                    </span>

                    <strong>
                      {
                        detail.vendorAddress ||
                        "—"
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Vendor invoice
                      no.
                    </span>

                    <strong>
                      {
                        detail.vendorInvoiceNumber ||
                        "—"
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Invoice date
                    </span>

                    <strong>
                      {formatDate(
                        detail.invoiceDate
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Purchase order
                    </span>

                    <strong>
                      {poNumberOf(
                        detail
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Created by
                    </span>

                    <strong>
                      {userName(
                        detail.createdBy
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Created at
                    </span>

                    <strong>
                      {formatDateTime(
                        detail.createdAt
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Verification
                    </span>

                    <strong>
                      {detail.verified
                        ? `Verified by ${userName(
                            detail.verifiedBy
                          )} (${formatDateTime(
                            detail.verifiedAt
                          )})`
                        : "Not verified"}
                    </strong>
                  </div>
                </div>

                <h3>
                  Items
                </h3>

                <div className="pm-table-wrap">
                  <table className="pm-small-table">
                    <thead>
                      <tr>
                        <th>
                          #
                        </th>

                        <th>
                          Item
                        </th>

                        <th>
                          HSN
                        </th>

                        <th className="num">
                          Qty
                        </th>

                        <th className="num">
                          Price
                        </th>

                        <th className="num">
                          GST
                        </th>

                        <th className="num">
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {(detail.items ||
                        []).map(
                        (
                          item,
                          index
                        ) => (
                          <tr
                            key={
                              item._id ||
                              index
                            }
                          >
                            <td>
                              {index +
                                1}
                            </td>

                            <td>
                              {
                                item.productName ||
                                item
                                  .product
                                  ?.name ||
                                "—"
                              }

                              <small>
                                {item.itemModel ===
                                "RepairPart"
                                  ? "Repair part"
                                  : "Product"}
                              </small>
                            </td>

                            <td>
                              {
                                item.hsnCode ||
                                "—"
                              }
                            </td>

                            <td className="num">
                              {
                                item.quantity
                              }
                            </td>

                            <td className="num">
                              {money(
                                item.purchasePrice
                              )}
                            </td>

                            <td className="num">
                              {Number(
                                item.gst ||
                                  0
                              )}
                              %
                            </td>

                            <td className="num">
                              {money(
                                item.totalAmount
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="pm-totals">
                  <div>
                    <span>
                      Subtotal
                    </span>

                    <strong>
                      {money(
                        detail.subtotal
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      GST
                    </span>

                    <strong>
                      {money(
                        detail.gstAmount
                      )}
                    </strong>
                  </div>

                  <div className="pm-grand">
                    <span>
                      Total
                    </span>

                    <strong>
                      {money(
                        detail.totalAmount
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Paid
                    </span>

                    <strong className="pm-paid">
                      {money(
                        detail.paidAmount
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Pending
                    </span>

                    <strong className="pm-pend">
                      {money(
                        detail.pendingAmount
                      )}
                    </strong>
                  </div>
                </div>

                <h3>
                  Payment history (
                  {
                    (
                      detail.payments ||
                      []
                    ).length
                  }
                  )
                </h3>

                {(
                  detail.payments ||
                  []
                ).length === 0 ? (
                  <div className="pm-state">
                    Koi payment
                    record nahi
                    hui.
                  </div>
                ) : (
                  <div className="pm-table-wrap">
                    <table className="pm-small-table">
                      <thead>
                        <tr>
                          <th>
                            Date
                          </th>

                          <th className="num">
                            Amount
                          </th>

                          <th>
                            Mode
                          </th>

                          <th>
                            Details
                          </th>

                          <th>
                            Recorded by
                          </th>

                          <th>
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {detail.payments.map(
                          (
                            payment,
                            index
                          ) => (
                            <tr
                              key={
                                payment._id ||
                                index
                              }
                            >
                              <td>
                                {formatDate(
                                  payment.paymentDate
                                )}
                              </td>

                              <td className="num">
                                <b>
                                  {money(
                                    payment.amount
                                  )}
                                </b>
                              </td>

                              <td>
                                {
                                  MODE_LABELS[
                                    payment
                                      .paymentMode
                                  ] ||
                                  payment.paymentMode
                                }
                              </td>

                              <td>
                                {payment.upiApp && (
                                  <small>
                                    UPI:{" "}
                                    {UPI_LABELS[
                                      payment.upiApp
                                    ] ||
                                      payment.upiApp}
                                  </small>
                                )}

                                {payment.transferType && (
                                  <small>
                                    Type:{" "}
                                    {
                                      payment.transferType
                                    }
                                  </small>
                                )}

                                {payment.utrNumber && (
                                  <small>
                                    UTR:{" "}
                                    {
                                      payment.utrNumber
                                    }
                                  </small>
                                )}

                                {payment.bankName && (
                                  <small>
                                    Bank:{" "}
                                    {
                                      payment.bankName
                                    }
                                  </small>
                                )}

                                {payment.bankReference && (
                                  <small>
                                    Bank ref:{" "}
                                    {
                                      payment.bankReference
                                    }
                                  </small>
                                )}

                                {payment.chequeNumber && (
                                  <small>
                                    Cheque:{" "}
                                    {
                                      payment.chequeNumber
                                    }{" "}
                                    (
                                    {formatDate(
                                      payment.chequeDate
                                    )}
                                    )
                                  </small>
                                )}

                                {payment.receiptNumber && (
                                  <small>
                                    Receipt:{" "}
                                    {
                                      payment.receiptNumber
                                    }
                                  </small>
                                )}

                                {payment.transactionReference && (
                                  <small>
                                    Ref:{" "}
                                    {
                                      payment.transactionReference
                                    }
                                  </small>
                                )}

                                {payment.notes && (
                                  <small>
                                    Note:{" "}
                                    {
                                      payment.notes
                                    }
                                  </small>
                                )}

                                {payment
                                  .paymentSlip
                                  ?.fileUrl && (
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

                              <td>
                                {userName(
                                  payment.recordedBy
                                )}
                              </td>

                              <td>
                                <span
                                  className={`pm-badge pm-tx-${String(
                                    payment.transactionStatus ||
                                      "SUCCESS"
                                  ).toLowerCase()}`}
                                >
                                  {
                                    payment.transactionStatus ||
                                    "SUCCESS"
                                  }
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {detail.notes && (
                  <div className="pm-notes">
                    <b>
                      Notes:
                    </b>{" "}
                    {detail.notes}
                  </div>
                )}

                <div className="pm-modal-actions">
                  <button
                    className="pm-btn pm-ghost"
                    onClick={() =>
                      navigate(
                        `/purchase-bills/${detail._id}/invoice`
                      )
                    }
                  >
                    <FaFileInvoice />

                    Invoice
                  </button>

                  {!detail.verified && (
                    <button
                      className="pm-btn pm-ok-solid"
                      disabled={
                        processingId ===
                        detail._id
                      }
                      onClick={() =>
                        verify(
                          detail
                        )
                      }
                    >
                      <FaCheck />

                      Verify bill
                    </button>
                  )}

                  {isPayable(
                    detail
                  ) && (
                    <button
                      className="pm-btn pm-primary"
                      onClick={() => {
                        const bill =
                          detail;

                        setDetail(
                          null
                        );

                        openPayment(
                          bill
                        );
                      }}
                    >
                      <FaRupeeSign />

                      Record payment
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
.pm-page{
  width:100%;
  min-height:100vh;
  padding:24px;
  background:#f7f9fc;
  color:#172033;
  font-family:Poppins,Arial,sans-serif;
}

.pm-page *{
  box-sizing:border-box;
}

.pm-head{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:16px;
  margin-bottom:20px;
  flex-wrap:wrap;
}

.pm-head h1{
  margin:0;
  font-size:26px;
}

.pm-head p{
  margin:6px 0 0;
  color:#718096;
  font-size:14px;
}

.pm-head-actions{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
}

.pm-btn{
  border:0;
  border-radius:9px;
  min-height:40px;
  padding:8px 14px;
  font-weight:600;
  font-size:13px;
  cursor:pointer;
  display:inline-flex;
  align-items:center;
  gap:7px;
}

.pm-btn:disabled,
.pm-mini:disabled{
  opacity:.55;
  cursor:not-allowed;
}

.pm-primary{
  background:#167c5a;
  color:#fff;
}

.pm-primary:hover{
  background:#126b4d;
}

.pm-ghost{
  background:#fff;
  color:#273444;
  border:1px solid #dce3eb;
}

.pm-ghost:hover{
  background:#f1f5f9;
}

.pm-ok-solid{
  background:#2458a6;
  color:#fff;
}

.pm-spin{
  animation:pmspin .8s linear infinite;
}

@keyframes pmspin{
  to{
    transform:rotate(360deg);
  }
}

.pm-alert{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
  border-radius:10px;
  padding:11px 14px;
  margin-bottom:14px;
  font-size:13px;
}

.pm-alert button{
  border:0;
  background:transparent;
  color:inherit;
  cursor:pointer;
}

.pm-alert-success{
  background:#eaf8f0;
  color:#157347;
  border:1px solid #c9ead8;
}

.pm-alert-error{
  background:#fff0f0;
  color:#b42318;
  border:1px solid #ffd2d2;
}

.pm-summary{
  display:grid;
  grid-template-columns:repeat(6,minmax(0,1fr));
  gap:12px;
  margin-bottom:18px;
}

.pm-card{
  background:#fff;
  border:1px solid #e6eaf0;
  border-radius:13px;
  padding:15px 16px;
}

.pm-card span{
  display:block;
  font-size:12px;
  color:#718096;
  margin-bottom:6px;
}

.pm-card strong{
  display:block;
  font-size:19px;
}

.pm-card small{
  display:block;
  margin-top:5px;
  font-size:11px;
  color:#8490a2;
}

.pm-green strong{
  color:#157347;
}

.pm-amber strong{
  color:#946200;
}

.pm-red strong{
  color:#b42318;
}

.pm-panel{
  background:#fff;
  border:1px solid #e6eaf0;
  border-radius:14px;
  padding:18px;
}

.pm-toolbar{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  align-items:flex-end;
  margin-bottom:14px;
}

.pm-search{
  flex:1;
  min-width:240px;
  display:flex;
  align-items:center;
  gap:8px;
  border:1px solid #d9dee7;
  border-radius:9px;
  padding:0 11px;
  color:#718096;
  min-height:42px;
}

.pm-search input{
  border:0;
  outline:0;
  width:100%;
  font:inherit;
  color:#172033;
  background:transparent;
}

.pm-date{
  display:flex;
  flex-direction:column;
  gap:4px;
  font-size:11px;
  color:#718096;
  font-weight:600;
}

.pm-date input{
  border:1px solid #d9dee7;
  border-radius:9px;
  padding:9px 10px;
  font:inherit;
  color:#172033;
}

.pm-switch{
  display:inline-flex;
  background:#f1f5f9;
  border-radius:10px;
  padding:3px;
  margin-bottom:14px;
}

.pm-switch button{
  border:0;
  background:transparent;
  padding:8px 14px;
  border-radius:8px;
  font-weight:600;
  font-size:13px;
  cursor:pointer;
  color:#5b6575;
}

.pm-switch button.active{
  background:#fff;
  color:#167c5a;
  box-shadow:0 1px 4px rgba(0,0,0,.08);
}

.pm-tabs{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  margin-bottom:14px;
}

.pm-tab{
  border:1px solid #dce3eb;
  background:#fff;
  border-radius:999px;
  padding:7px 14px;
  font-size:13px;
  font-weight:600;
  cursor:pointer;
  color:#445;
  display:inline-flex;
  gap:7px;
  align-items:center;
}

.pm-tab span{
  background:#eef3f7;
  border-radius:999px;
  padding:1px 8px;
  font-size:11px;
}

.pm-tab.active{
  background:#167c5a;
  border-color:#167c5a;
  color:#fff;
}

.pm-tab.active span{
  background:rgba(255,255,255,.25);
}

.pm-state{
  padding:32px;
  text-align:center;
  color:#718096;
  font-size:14px;
}

.pm-table-wrap{
  width:100%;
  overflow-x:auto;
  border:1px solid #edf0f4;
  border-radius:10px;
  margin-bottom:6px;
}

.pm-page table{
  width:100%;
  min-width:980px;
  border-collapse:collapse;
}

.pm-small-table{
  min-width:640px!important;
}

.pm-page th,
.pm-page td{
  padding:11px 12px;
  border-bottom:1px solid #edf0f4;
  text-align:left;
  font-size:13px;
  vertical-align:middle;
}

.pm-page th{
  background:#fafbfc;
  color:#5b6575;
  font-weight:700;
  white-space:nowrap;
}

.pm-page tbody tr:hover{
  background:#fafcfd;
}

.pm-page tfoot td{
  background:#fafbfc;
  border-bottom:0;
}

.pm-page .num{
  text-align:right;
  white-space:nowrap;
}

.pm-page td small{
  display:block;
  margin-top:3px;
  color:#8490a2;
  font-size:11px;
}

.pm-click{
  cursor:pointer;
}

.pm-paid{
  color:#157347;
}

.pm-pend{
  color:#946200;
}

.pm-badge{
  display:inline-block;
  padding:4px 9px;
  border-radius:999px;
  font-size:11px;
  font-weight:700;
  white-space:nowrap;
}

.pm-paid.pm-badge,
.pm-badge.pm-paid{
  background:#e7f7ee;
  color:#157347;
}

.pm-badge.pm-partial,
.pm-badge.pm-pending{
  background:#fff4db;
  color:#946200;
}

.pm-verified,
.pm-tx-success{
  background:#e7f7ee;
  color:#157347;
}

.pm-unverified,
.pm-tx-failed,
.pm-tx-reversed{
  background:#fee9e7;
  color:#b42318;
}

.pm-tx-pending{
  background:#fff4db;
  color:#946200;
}

.pm-actions{
  display:flex;
  gap:5px;
  flex-wrap:wrap;
}

.pm-mini{
  border:0;
  border-radius:8px;
  padding:6px 9px;
  font-size:11px;
  font-weight:700;
  cursor:pointer;
  display:inline-flex;
  gap:5px;
  align-items:center;
}

.pm-view{
  background:#edf4ff;
  color:#2458a6;
}

.pm-ok{
  background:#fff4db;
  color:#946200;
}

.pm-pay{
  background:#eaf4ef;
  color:#126344;
}

.pm-backdrop{
  position:fixed;
  inset:0;
  z-index:9999;
  background:rgba(15,23,42,.5);
  padding:20px;
  display:flex;
  justify-content:center;
  align-items:flex-start;
  overflow-y:auto;
}

.pm-modal{
  width:min(640px,100%);
  background:#fff;
  border-radius:15px;
  padding:22px;
  display:grid;
  gap:14px;
  margin:auto;
  box-shadow:0 20px 60px rgba(0,0,0,.2);
}

.pm-modal-lg{
  width:min(920px,100%);
}

.pm-modal-head{
  display:flex;
  justify-content:space-between;
  gap:14px;
}

.pm-modal-head h2{
  margin:0;
  font-size:20px;
}

.pm-modal-head p{
  margin:5px 0 0;
  color:#718096;
  font-size:13px;
}

.pm-modal h3{
  margin:6px 0 0;
  font-size:15px;
}

.pm-x{
  width:34px;
  height:34px;
  border:0;
  border-radius:8px;
  background:#f1f5f9;
  cursor:pointer;
  color:#475569;
}

.pm-pay-summary{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:10px;
  background:#f8fafc;
  border-radius:10px;
  padding:12px;
}

.pm-pay-summary span{
  display:block;
  font-size:11px;
  color:#718096;
  margin-bottom:4px;
}

.pm-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:12px;
}

.pm-grid label{
  display:flex;
  flex-direction:column;
  gap:6px;
  font-size:12px;
  font-weight:600;
  color:#445;
}

.pm-grid .pm-wide{
  grid-column:1/-1;
}

.pm-grid input,
.pm-grid select,
.pm-grid textarea{
  width:100%;
  border:1px solid #d9dee7;
  border-radius:9px;
  padding:9px 10px;
  font:inherit;
  color:#172033;
  outline:0;
  background:#fff;
}

.pm-grid input:focus,
.pm-grid select:focus,
.pm-grid textarea:focus{
  border-color:#167c5a;
  box-shadow:0 0 0 3px rgba(22,124,90,.1);
}

.pm-modal-actions{
  display:flex;
  justify-content:flex-end;
  gap:10px;
  flex-wrap:wrap;
  margin-top:4px;
}

.pm-info{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:10px;
}

.pm-info div{
  border:1px solid #edf0f4;
  border-radius:9px;
  padding:10px;
  min-width:0;
}

.pm-info span{
  display:block;
  font-size:11px;
  color:#718096;
  margin-bottom:4px;
}

.pm-info strong{
  font-size:13px;
  overflow-wrap:anywhere;
}

.pm-totals{
  margin-left:auto;
  width:min(320px,100%);
  display:grid;
  gap:6px;
}

.pm-totals div{
  display:flex;
  justify-content:space-between;
  font-size:13px;
}

.pm-grand{
  border-top:1px solid #edf0f4;
  padding-top:6px;
  font-size:15px!important;
  font-weight:700;
}

.pm-notes{
  background:#f8fafc;
  border-radius:9px;
  padding:11px;
  font-size:13px;
  color:#5b6575;
  white-space:pre-wrap;
}

@media(max-width:1200px){
  .pm-summary{
    grid-template-columns:repeat(3,minmax(0,1fr));
  }
}

@media(max-width:800px){
  .pm-info{
    grid-template-columns:repeat(2,1fr);
  }
}

@media(max-width:600px){
  .pm-page{
    padding:12px;
  }

  .pm-summary{
    grid-template-columns:1fr 1fr;
  }

  .pm-grid,
  .pm-info,
  .pm-pay-summary{
    grid-template-columns:1fr;
  }

  .pm-modal{
    padding:15px;
  }

  .pm-head-actions .pm-btn{
    flex:1;
  }
}
`;