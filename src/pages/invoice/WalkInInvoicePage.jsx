// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// import {
//   ArrowLeft,
//   Download,
//   Printer,
//   Loader2,
//   FileText,
// } from "lucide-react";

// import { toast } from "react-toastify";

// import {
//   getInvoiceByOrderId,
//   createInvoice,
// } from "../../services/invoiceService";

// import "./WalkInInvoicePage.css";

// // ======================================================
// // LOGO
// // ======================================================

// import zaidInfotechLogo from "../../assets/images/zaidinfotechlogo.png";


// // ======================================================
// // COMPANY INFORMATION
// // ======================================================

// const COMPANY = {
//   name: "ZAID INFOTECH",

//   addressLine1: "No 232, 1st Floor, M.K.N. Road, Alandur",

//   addressLine2: "Chennai, Tamil Nadu, 600016",

//   gstin: "33AIOPF8710C1ZL",

//   mobile: "9092590725",

//   pan: "AIOPF8710C",

//   email: "info@zaidinfotech.in",

//   website: "www.zaidinfotech.in",

//   tagline: "Affordable Tech for Everyone",

//   bankName: "ZAIDINFOTECH",

//   bank: "Karur Vysya Bank, CHENNAI ALANDUR",

//   ifsc: "KVBL0001104",

//   accountNo: "1104011000000054",
// };


// // ======================================================
// // COMPONENT
// // ======================================================

// const WalkInInvoicePage = () => {
//   const { orderId } = useParams();

//   const navigate = useNavigate();

//   const invoiceRef = useRef(null);

//   const [invoice, setInvoice] = useState(null);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState("");

//   const [pdfLoading, setPdfLoading] = useState(false);


//   // ======================================================
//   // LOAD / CREATE INVOICE
//   // ======================================================

//   useEffect(() => {
//     let mounted = true;

//     const loadInvoice = async () => {
//       if (!orderId) {
//         setError("Order ID is missing.");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError("");

//         // ------------------------------------------------
//         // FIRST: TRY EXISTING INVOICE
//         // ------------------------------------------------

//         try {
//           const response = await getInvoiceByOrderId(orderId);

//           const existingInvoice =
//             response?.data ||
//             response?.invoice ||
//             response;

//           if (existingInvoice && mounted) {
//             setInvoice(existingInvoice);
//             setLoading(false);
//             return;
//           }
//         } catch (existingError) {
//           console.log(
//             "Invoice not found. Creating new invoice..."
//           );
//         }


//         // ------------------------------------------------
//         // CREATE INVOICE
//         // ------------------------------------------------

//         const createResponse =
//           await createInvoice(orderId);

//         const createdInvoice =
//           createResponse?.data ||
//           createResponse?.invoice ||
//           createResponse;

//         if (!createdInvoice) {
//           throw new Error(
//             "Invoice was created but no invoice data was returned."
//           );
//         }

//         if (mounted) {
//           setInvoice(createdInvoice);
//         }

//       } catch (err) {
//         console.error(
//           "Walk-in invoice loading/creation error:",
//           err
//         );

//         if (mounted) {
//           setError(
//             err?.response?.data?.message ||
//               err?.message ||
//               "Unable to load or create invoice."
//           );
//         }
//       } finally {
//         if (mounted) {
//           setLoading(false);
//         }
//       }
//     };

//     loadInvoice();

//     return () => {
//       mounted = false;
//     };
//   }, [orderId]);


//   // ======================================================
//   // PRINT
//   // ======================================================

//   const handlePrint = () => {
//     window.print();
//   };


//   // ======================================================
//   // DOWNLOAD PDF
//   // ======================================================

//   const handleDownloadPDF = async () => {
//     if (!invoiceRef.current) {
//       toast.error("Invoice is not ready.");
//       return;
//     }

//     try {
//       setPdfLoading(true);

//       const element = invoiceRef.current;

//       // Wait for images/fonts
//       await new Promise((resolve) =>
//         setTimeout(resolve, 300)
//       );

//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         allowTaint: false,
//         backgroundColor: "#ffffff",
//         logging: false,
//       });

//       const imageData =
//         canvas.toDataURL("image/png", 1.0);

//       const pdf = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//       });

//       const pageWidth =
//         pdf.internal.pageSize.getWidth();

//       const pageHeight =
//         pdf.internal.pageSize.getHeight();

//       const imageWidth = pageWidth;

//       const imageHeight =
//         (canvas.height * imageWidth) /
//         canvas.width;


//       // ------------------------------------------------
//       // SINGLE PAGE
//       // ------------------------------------------------

//       if (imageHeight <= pageHeight) {
//         pdf.addImage(
//           imageData,
//           "PNG",
//           0,
//           0,
//           imageWidth,
//           imageHeight
//         );
//       } else {

//         // ------------------------------------------------
//         // MULTI PAGE SUPPORT
//         // ------------------------------------------------

//         let remainingHeight =
//           imageHeight;

//         let position = 0;

//         pdf.addImage(
//           imageData,
//           "PNG",
//           0,
//           position,
//           imageWidth,
//           imageHeight
//         );

//         remainingHeight -= pageHeight;

//         while (remainingHeight > 0) {

//           position =
//             position - pageHeight;

//           pdf.addPage();

//           pdf.addImage(
//             imageData,
//             "PNG",
//             0,
//             position,
//             imageWidth,
//             imageHeight
//           );

//           remainingHeight -= pageHeight;
//         }
//       }


//       const invoiceNumber =
//         invoice?.invoiceNumber ||
//         `WALK-IN-${orderId}`;

//       pdf.save(
//         `${invoiceNumber}.pdf`
//       );

//       toast.success(
//         "Invoice PDF downloaded successfully."
//       );

//     } catch (err) {

//       console.error(
//         "PDF generation error:",
//         err
//       );

//       toast.error(
//         "Unable to generate PDF."
//       );

//     } finally {
//       setPdfLoading(false);
//     }
//   };


//   // ======================================================
//   // CURRENCY
//   // ======================================================

//   const formatCurrency = (value) => {
//     const number = Number(value || 0);

//     return `₹ ${number.toLocaleString(
//       "en-IN",
//       {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       }
//     )}`;
//   };


//   // ======================================================
//   // NUMBER ONLY
//   // ======================================================

//   const numberValue = (value) => {
//     return Number(value || 0);
//   };


//   // ======================================================
//   // DATE
//   // ======================================================

//   const formatDate = (date) => {
//     if (!date) return "-";

//     const parsedDate = new Date(date);

//     if (Number.isNaN(parsedDate.getTime())) {
//       return "-";
//     }

//     return parsedDate.toLocaleDateString(
//       "en-IN",
//       {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       }
//     );
//   };


//   // ======================================================
//   // GET CUSTOMER
//   // ======================================================

//   const getCustomerName = () => {
//     const billing =
//       invoice?.billingAddress || {};

//     const user =
//       invoice?.user || {};

//     if (billing.fullName) {
//       return billing.fullName;
//     }

//     const fullName =
//       `${user.firstName || ""} ${
//         user.lastName || ""
//       }`.trim();

//     return fullName || "Customer";
//   };


//   // ======================================================
//   // LOADING
//   // ======================================================

//   if (loading) {
//     return (
//       <div className="walkin-invoice-loading">

//         <div className="walkin-loading-box">

//           <Loader2
//             size={38}
//             className="walkin-spin"
//           />

//           <h2>
//             Loading Invoice...
//           </h2>

//           <p>
//             Please wait while we prepare your
//             invoice.
//           </p>

//         </div>

//       </div>
//     );
//   }


//   // ======================================================
//   // ERROR
//   // ======================================================

//   if (error || !invoice) {
//     return (
//       <div className="walkin-invoice-error">

//         <div className="walkin-error-box">

//           <FileText size={52} />

//           <h2>
//             Invoice Not Available
//           </h2>

//           <p>
//             {error ||
//               "Unable to load invoice."}
//           </p>

//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//           >
//             <ArrowLeft size={18} />
//             Go Back
//           </button>

//         </div>

//       </div>
//     );
//   }


//   // ======================================================
//   // DATA
//   // ======================================================

//   const customer =
//     invoice.user || {};

//   const billing =
//     invoice.billingAddress || {};

//   const shipping =
//     invoice.shippingAddress ||
//     invoice.billingAddress ||
//     {};

//   const order =
//     invoice.order || {};

//   const payment =
//     invoice.payment || {};

//   const items =
//     Array.isArray(invoice.items)
//       ? invoice.items
//       : [];


//   // ======================================================
//   // TOTALS
//   // ======================================================

//   const subtotal =
//     numberValue(invoice.subtotal);

//   const discount =
//     numberValue(invoice.discount);

//   const totalAmount =
//     numberValue(invoice.totalAmount);

//   const paidAmount =
//     numberValue(invoice.paidAmount);

//   const balanceAmount =
//     numberValue(invoice.balanceAmount);


//   // ======================================================
//   // TAX
//   // ======================================================

//   let cgstAmount =
//     numberValue(
//       invoice.cgstAmount ||
//       invoice.cgst ||
//       invoice.tax?.cgstAmount
//     );

//   let sgstAmount =
//     numberValue(
//       invoice.sgstAmount ||
//       invoice.sgst ||
//       invoice.tax?.sgstAmount
//     );

//   let taxAmount =
//     numberValue(
//       invoice.taxAmount ||
//       invoice.totalTax ||
//       invoice.tax?.totalTax
//     );


//   // If total tax exists but CGST/SGST don't
//   if (
//     taxAmount > 0 &&
//     cgstAmount === 0 &&
//     sgstAmount === 0
//   ) {
//     cgstAmount = taxAmount / 2;
//     sgstAmount = taxAmount / 2;
//   }

//   // If CGST/SGST exist but total tax doesn't
//   if (
//     taxAmount === 0 &&
//     (cgstAmount > 0 ||
//       sgstAmount > 0)
//   ) {
//     taxAmount =
//       cgstAmount + sgstAmount;
//   }


//   // ======================================================
//   // TAX RATES
//   // ======================================================

//   const cgstRate =
//     invoice.cgstRate ||
//     invoice.tax?.cgstRate ||
//     9;

//   const sgstRate =
//     invoice.sgstRate ||
//     invoice.tax?.sgstRate ||
//     9;


//   // ======================================================
//   // RENDER
//   // ======================================================

//   return (
//     <div className="walkin-invoice-page">

//       {/* ==================================================
//           ACTION BAR
//       ================================================== */}

//       <div className="walkin-invoice-actions no-print">

//         <div className="walkin-actions-inner">

//           <button
//             type="button"
//             className="walkin-back-button"
//             onClick={() => navigate(-1)}
//           >
//             <ArrowLeft size={18} />
//             Back
//           </button>


//           <div className="walkin-action-right">

//             <button
//               type="button"
//               className="walkin-print-button"
//               onClick={handlePrint}
//             >
//               <Printer size={18} />
//               Print
//             </button>


//             <button
//               type="button"
//               className="walkin-pdf-button"
//               onClick={handleDownloadPDF}
//               disabled={pdfLoading}
//             >

//               {pdfLoading ? (
//                 <>
//                   <Loader2
//                     size={18}
//                     className="walkin-spin"
//                   />
//                   Creating PDF...
//                 </>
//               ) : (
//                 <>
//                   <Download size={18} />
//                   Download PDF
//                 </>
//               )}

//             </button>

//           </div>

//         </div>

//       </div>


//       {/* ==================================================
//           INVOICE WRAPPER
//       ================================================== */}

//       <div className="walkin-invoice-container">

//         <div
//           ref={invoiceRef}
//           className="walkin-invoice-paper"
//         >

//           {/* ==================================================
//               COMPANY HEADER
//           ================================================== */}

//           <div className="invoice-company-header">

//             <div className="company-left">

//               <img
//                 src={zaidInfotechLogo}
//                 alt="Zaid Infotech"
//                 className="invoice-logo"
//               />

//               <div className="company-details">

//                 <h1>
//                   {COMPANY.name}
//                 </h1>

//                 <p>
//                   {COMPANY.addressLine1}
//                 </p>

//                 <p>
//                   {COMPANY.addressLine2}
//                 </p>

//                 <p>
//                   <strong>GSTIN:</strong>{" "}
//                   {COMPANY.gstin}
//                 </p>

//                 <p>
//                   <strong>Mobile:</strong>{" "}
//                   {COMPANY.mobile}
//                 </p>

//               </div>

//             </div>


//             <div className="company-right">

//               <div className="invoice-main-title">
//                 TAX INVOICE
//               </div>

//               <div className="invoice-original">
//                 ORIGINAL FOR RECIPIENT
//               </div>

//               <div className="invoice-badge">
//                 WALK-IN
//               </div>

//             </div>

//           </div>


//           {/* ==================================================
//               COMPANY CONTACT
//           ================================================== */}

//           <div className="company-contact-row">

//             <span>
//               <strong>PAN:</strong>{" "}
//               {COMPANY.pan}
//             </span>

//             <span>
//               <strong>Email:</strong>{" "}
//               {COMPANY.email}
//             </span>

//             <span>
//               <strong>Website:</strong>{" "}
//               {COMPANY.website}
//             </span>

//           </div>


//           {/* ==================================================
//               INVOICE INFO
//           ================================================== */}

//           <div className="invoice-info-section">

//             <div className="invoice-info-box">

//               <div className="invoice-info-label">
//                 Invoice No.
//               </div>

//               <div className="invoice-info-value">
//                 {invoice.invoiceNumber ||
//                   "-"}
//               </div>

//             </div>


//             <div className="invoice-info-box">

//               <div className="invoice-info-label">
//                 Invoice Date
//               </div>

//               <div className="invoice-info-value">
//                 {formatDate(
//                   invoice.invoiceDate ||
//                     invoice.createdAt
//                 )}
//               </div>

//             </div>


//             <div className="invoice-info-box">

//               <div className="invoice-info-label">
//                 Due Date
//               </div>

//               <div className="invoice-info-value">
//                 {formatDate(
//                   invoice.dueDate ||
//                     invoice.invoiceDate ||
//                     invoice.createdAt
//                 )}
//               </div>

//             </div>


//             <div className="invoice-info-box">

//               <div className="invoice-info-label">
//                 Order No.
//               </div>

//               <div className="invoice-info-value invoice-break">
//                 {order?._id
//                   ? `#${order._id}`
//                   : invoice.referenceId
//                     ? `#${invoice.referenceId}`
//                     : "-"}
//               </div>

//             </div>

//           </div>


//           {/* ==================================================
//               BILL TO / SHIP TO
//           ================================================== */}

//           <div className="customer-grid">

//             {/* BILL TO */}

//             <div className="customer-card">

//               <div className="customer-heading">
//                 BILL TO
//               </div>

//               <div className="customer-content">

//                 <strong className="customer-name">
//                   {getCustomerName()}
//                 </strong>

//                 <p>
//                   Address:{" "}
//                   {billing.addressLine ||
//                     billing.address ||
//                     "-"}
//                 </p>

//                 <p>
//                   {billing.city || ""}
//                   {billing.city &&
//                   billing.state
//                     ? ", "
//                     : ""}
//                   {billing.state || ""}
//                   {billing.pincode
//                     ? ` - ${billing.pincode}`
//                     : ""}
//                 </p>

//                 <p>
//                   {billing.country ||
//                     "India"}
//                 </p>

//                 <p>
//                   <strong>GSTIN:</strong>{" "}
//                   {billing.gstin ||
//                     billing.GSTIN ||
//                     customer.gstin ||
//                     "-"}
//                 </p>

//                 <p>
//                   <strong>Mobile:</strong>{" "}
//                   {billing.phone ||
//                     customer.phone ||
//                     "-"}
//                 </p>

//                 {customer.email && (
//                   <p>
//                     <strong>Email:</strong>{" "}
//                     {customer.email}
//                   </p>
//                 )}

//               </div>

//             </div>


//             {/* SHIP TO */}

//             <div className="customer-card">

//               <div className="customer-heading">
//                 SHIP TO
//               </div>

//               <div className="customer-content">

//                 <strong className="customer-name">
//                   {getCustomerName()}
//                 </strong>

//                 <p>
//                   Address:{" "}
//                   {shipping.addressLine ||
//                     shipping.address ||
//                     "-"}
//                 </p>

//                 <p>
//                   {shipping.city || ""}
//                   {shipping.city &&
//                   shipping.state
//                     ? ", "
//                     : ""}
//                   {shipping.state || ""}
//                   {shipping.pincode
//                     ? ` - ${shipping.pincode}`
//                     : ""}
//                 </p>

//                 <p>
//                   {shipping.country ||
//                     "India"}
//                 </p>

//                 {shipping.phone && (
//                   <p>
//                     <strong>Mobile:</strong>{" "}
//                     {shipping.phone}
//                   </p>
//                 )}

//               </div>

//             </div>

//           </div>


//           {/* ==================================================
//               ITEMS TABLE
//           ================================================== */}

//           <div className="items-section">

//             <table className="invoice-items-table">

//               <thead>

//                 <tr>

//                   <th className="col-no">
//                     S.NO.
//                   </th>

//                   <th className="col-item">
//                     ITEMS / SERVICES
//                   </th>

//                   <th className="col-hsn">
//                     HSN / SAC
//                   </th>

//                   <th className="col-qty">
//                     QTY.
//                   </th>

//                   <th className="col-rate">
//                     RATE
//                   </th>

//                   <th className="col-discount">
//                     DISCOUNT
//                   </th>

//                   <th className="col-amount">
//                     AMOUNT
//                   </th>

//                 </tr>

//               </thead>


//               <tbody>

//                 {items.length > 0 ? (
//                   items.map(
//                     (item, index) => {

//                       const quantity =
//                         numberValue(
//                           item.quantity
//                         );

//                       const price =
//                         numberValue(
//                           item.price
//                         );

//                       const discountAmount =
//                         numberValue(
//                           item.discountAmount
//                         );

//                       const calculatedTotal =
//                         price * quantity -
//                         discountAmount;

//                       const itemTotal =
//                         item.total !==
//                           undefined &&
//                         item.total !== null
//                           ? numberValue(
//                               item.total
//                             )
//                           : calculatedTotal;

//                       return (
//                         <tr
//                           key={
//                             item._id ||
//                             item.product ||
//                             index
//                           }
//                         >

//                           <td className="text-center">
//                             {index + 1}
//                           </td>


//                           <td className="item-name-cell">

//                             <strong>
//                               {item.title ||
//                                 item.name ||
//                                 "Product / Service"}
//                             </strong>

//                             {item.description && (
//                               <span className="item-description">
//                                 {item.description}
//                               </span>
//                             )}

//                             {item.productType && (
//                               <span className="item-type">
//                                 Type:{" "}
//                                 {item.productType}
//                               </span>
//                             )}

//                           </td>


//                           <td className="text-center">

//                             {item.hsnSac ||
//                               item.hsn ||
//                               item.sac ||
//                               item.hsnCode ||
//                               "-"}

//                           </td>


//                           <td className="text-center">

//                             {quantity || 1}

//                             <span className="qty-unit">
//                               PCS
//                             </span>

//                           </td>


//                           <td className="text-right">

//                             {formatCurrency(
//                               price
//                             )}

//                           </td>


//                           <td className="text-right">

//                             {formatCurrency(
//                               discountAmount
//                             )}

//                           </td>


//                           <td className="text-right amount-bold">

//                             {formatCurrency(
//                               itemTotal
//                             )}

//                           </td>

//                         </tr>
//                       );
//                     }
//                   )
//                 ) : (

//                   <tr>

//                     <td
//                       colSpan="7"
//                       className="empty-items"
//                     >
//                       No items found
//                     </td>

//                   </tr>

//                 )}


//                 {/* Empty spacing rows */}

//                 {items.length < 4 &&
//                   Array.from({
//                     length:
//                       4 - items.length,
//                   }).map(
//                     (_, index) => (
//                       <tr
//                         key={`empty-${index}`}
//                         className="empty-row"
//                       >
//                         <td></td>
//                         <td></td>
//                         <td></td>
//                         <td></td>
//                         <td></td>
//                         <td></td>
//                         <td></td>
//                       </tr>
//                     )
//                   )}

//               </tbody>


//               <tfoot>

//                 <tr className="subtotal-row">

//                   <td
//                     colSpan="6"
//                     className="subtotal-label"
//                   >
//                     SUBTOTAL
//                   </td>

//                   <td className="text-right">
//                     {formatCurrency(
//                       subtotal
//                     )}
//                   </td>

//                 </tr>


//                 {discount > 0 && (
//                   <tr>

//                     <td
//                       colSpan="6"
//                       className="subtotal-label"
//                     >
//                       DISCOUNT
//                     </td>

//                     <td className="text-right">
//                       {formatCurrency(
//                         discount
//                       )}
//                     </td>

//                   </tr>
//                 )}


//                 {cgstAmount > 0 && (
//                   <tr>

//                     <td
//                       colSpan="6"
//                       className="subtotal-label"
//                     >
//                       CGST @ {cgstRate}%
//                     </td>

//                     <td className="text-right">
//                       {formatCurrency(
//                         cgstAmount
//                       )}
//                     </td>

//                   </tr>
//                 )}


//                 {sgstAmount > 0 && (
//                   <tr>

//                     <td
//                       colSpan="6"
//                       className="subtotal-label"
//                     >
//                       SGST @ {sgstRate}%
//                     </td>

//                     <td className="text-right">
//                       {formatCurrency(
//                         sgstAmount
//                       )}
//                     </td>

//                   </tr>
//                 )}


//                 <tr className="grand-total-row">

//                   <td
//                     colSpan="6"
//                     className="grand-total-label"
//                   >
//                     TOTAL
//                   </td>

//                   <td className="text-right grand-total-value">
//                     {formatCurrency(
//                       totalAmount
//                     )}
//                   </td>

//                 </tr>

//               </tfoot>

//             </table>

//           </div>


//           {/* ==================================================
//               TAX SUMMARY
//           ================================================== */}

//           {(taxAmount > 0 ||
//             cgstAmount > 0 ||
//             sgstAmount > 0) && (

//             <div className="tax-summary-section">

//               <div className="tax-summary-title">
//                 TAX SUMMARY
//               </div>

//               <table className="tax-summary-table">

//                 <thead>

//                   <tr>

//                     <th rowSpan="2">
//                       HSN / SAC
//                     </th>

//                     <th rowSpan="2">
//                       Taxable Value
//                     </th>

//                     <th colSpan="2">
//                       CGST
//                     </th>

//                     <th colSpan="2">
//                       SGST
//                     </th>

//                     <th rowSpan="2">
//                       Total Tax
//                     </th>

//                   </tr>

//                   <tr>

//                     <th>
//                       Rate
//                     </th>

//                     <th>
//                       Amount
//                     </th>

//                     <th>
//                       Rate
//                     </th>

//                     <th>
//                       Amount
//                     </th>

//                   </tr>

//                 </thead>


//                 <tbody>

//                   {items.map(
//                     (item, index) => {

//                       const itemAmount =
//                         numberValue(
//                           item.total
//                         ) ||
//                         (
//                           numberValue(
//                             item.price
//                           ) *
//                           numberValue(
//                             item.quantity
//                           )
//                         );

//                       const itemTax =
//                         numberValue(
//                           item.taxAmount ||
//                           item.tax
//                         );

//                       const itemCGST =
//                         numberValue(
//                           item.cgstAmount
//                         ) ||
//                         (
//                           itemTax > 0
//                             ? itemTax / 2
//                             : 0
//                         );

//                       const itemSGST =
//                         numberValue(
//                           item.sgstAmount
//                         ) ||
//                         (
//                           itemTax > 0
//                             ? itemTax / 2
//                             : 0
//                         );

//                       return (
//                         <tr
//                           key={`tax-${index}`}
//                         >

//                           <td>
//                             {item.hsnSac ||
//                               item.hsn ||
//                               item.sac ||
//                               item.hsnCode ||
//                               "-"}
//                           </td>

//                           <td className="text-right">
//                             {formatCurrency(
//                               itemAmount
//                             )}
//                           </td>

//                           <td className="text-center">
//                             {item.cgstRate ||
//                               cgstRate}
//                             %
//                           </td>

//                           <td className="text-right">
//                             {formatCurrency(
//                               itemCGST
//                             )}
//                           </td>

//                           <td className="text-center">
//                             {item.sgstRate ||
//                               sgstRate}
//                             %
//                           </td>

//                           <td className="text-right">
//                             {formatCurrency(
//                               itemSGST
//                             )}
//                           </td>

//                           <td className="text-right">
//                             {formatCurrency(
//                               itemTax ||
//                               itemCGST +
//                                 itemSGST
//                             )}
//                           </td>

//                         </tr>
//                       );
//                     }
//                   )}


//                   <tr className="tax-total-row">

//                     <td>
//                       <strong>
//                         Total
//                       </strong>
//                     </td>

//                     <td className="text-right">
//                       <strong>
//                         {formatCurrency(
//                           subtotal -
//                             discount
//                         )}
//                       </strong>
//                     </td>

//                     <td></td>

//                     <td className="text-right">
//                       <strong>
//                         {formatCurrency(
//                           cgstAmount
//                         )}
//                       </strong>
//                     </td>

//                     <td></td>

//                     <td className="text-right">
//                       <strong>
//                         {formatCurrency(
//                           sgstAmount
//                         )}
//                       </strong>
//                     </td>

//                     <td className="text-right">
//                       <strong>
//                         {formatCurrency(
//                           taxAmount
//                         )}
//                       </strong>
//                     </td>

//                   </tr>

//                 </tbody>

//               </table>

//             </div>
//           )}


//           {/* ==================================================
//               BOTTOM INFORMATION
//           ================================================== */}

//           <div className="invoice-bottom-grid">

//             {/* AMOUNT WORDS */}

//             <div className="amount-words-box">

//               <div className="bottom-section-title">
//                 Total Amount (in words)
//               </div>

//               <p>
//                 {invoice.amountInWords ||
//                   invoice.totalInWords ||
//                   "Amount as per invoice"}
//               </p>


//               <div className="payment-small-info">

//                 <div className="bottom-section-title">
//                   Payment Information
//                 </div>

//                 <p>
//                   <strong>
//                     Payment Status:
//                   </strong>{" "}
//                   {invoice.paymentStatus ||
//                     "PAID"}
//                 </p>

//                 <p>
//                   <strong>
//                     Payment Method:
//                   </strong>{" "}
//                   {invoice.paymentMethod ||
//                     payment.method ||
//                     "CASH"}
//                 </p>

//                 {(payment.paymentId ||
//                   payment.transactionId ||
//                   payment._id) && (
//                   <p>
//                     <strong>
//                       Transaction ID:
//                     </strong>{" "}
//                     {payment.paymentId ||
//                       payment.transactionId ||
//                       payment._id}
//                   </p>
//                 )}

//               </div>

//             </div>


//             {/* TOTAL BOX */}

//             <div className="final-total-box">

//               <div className="final-total-row">

//                 <span>
//                   Taxable Amount
//                 </span>

//                 <strong>
//                   {formatCurrency(
//                     subtotal - discount
//                   )}
//                 </strong>

//               </div>


//               {cgstAmount > 0 && (
//                 <div className="final-total-row">

//                   <span>
//                     CGST
//                   </span>

//                   <strong>
//                     {formatCurrency(
//                       cgstAmount
//                     )}
//                   </strong>

//                 </div>
//               )}


//               {sgstAmount > 0 && (
//                 <div className="final-total-row">

//                   <span>
//                     SGST
//                   </span>

//                   <strong>
//                     {formatCurrency(
//                       sgstAmount
//                     )}
//                   </strong>

//                 </div>
//               )}


//               <div className="final-grand-row">

//                 <span>
//                   TOTAL AMOUNT
//                 </span>

//                 <strong>
//                   {formatCurrency(
//                     totalAmount
//                   )}
//                 </strong>

//               </div>


//               <div className="final-total-row">

//                 <span>
//                   Amount Paid
//                 </span>

//                 <strong>
//                   {formatCurrency(
//                     paidAmount
//                   )}
//                 </strong>

//               </div>


//               <div className="final-due-row">

//                 <span>
//                   Amount Due
//                 </span>

//                 <strong>
//                   {formatCurrency(
//                     balanceAmount
//                   )}
//                 </strong>

//               </div>

//             </div>

//           </div>


//           {/* ==================================================
//               BANK DETAILS
//           ================================================== */}

//           <div className="bank-signature-grid">

//             <div className="bank-details">

//               <div className="bottom-section-title">
//                 Bank Details
//               </div>

//               <p>
//                 <strong>
//                   Name:
//                 </strong>{" "}
//                 {COMPANY.bankName}
//               </p>

//               <p>
//                 <strong>
//                   IFSC Code:
//                 </strong>{" "}
//                 {COMPANY.ifsc}
//               </p>

//               <p>
//                 <strong>
//                   Account No:
//                 </strong>{" "}
//                 {COMPANY.accountNo}
//               </p>

//               <p>
//                 <strong>
//                   Bank:
//                 </strong>{" "}
//                 {COMPANY.bank}
//               </p>

//             </div>


//             <div className="signature-box">

//               <p className="signature-label">
//                 Authorised Signatory For
//               </p>

//               <div className="signature-space">
//                 __________________________
//               </div>

//               <strong>
//                 ZAID INFOTECH
//               </strong>

//             </div>

//           </div>


//           {/* ==================================================
//               FOOTER
//           ================================================== */}

//           <div className="invoice-footer">

//             <div className="footer-thank-you">
//               Thank you for shopping with
//               <strong>
//                 {" "}ZAID INFOTECH!
//               </strong>
//             </div>

//             <div className="footer-tagline">
//               “{COMPANY.tagline}”
//             </div>

//             <div className="footer-original">
//               TAX INVOICE ORIGINAL FOR RECIPIENT
//             </div>

//             <div className="footer-generated">
//               This is a computer-generated invoice.
//             </div>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// };


// export default WalkInInvoicePage;


import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  ArrowLeft,
  Download,
  Printer,
  Loader2,
  FileText,
} from "lucide-react";

import { toast } from "react-toastify";

import {
  getInvoiceByOrderId,
  createInvoice,
} from "../../services/invoiceService";

import "./WalkInInvoicePage.css";

// ======================================================
// LOGO
// ======================================================

import zaidInfotechLogo from "../../assets/images/zaidinfotechlogo.png";


// ======================================================
// COMPANY INFORMATION
// ======================================================

const COMPANY = {
  name: "ZAID INFOTECH",

  addressLine1: "No 232, 1st Floor, M.K.N. Road, Alandur",

  addressLine2: "Chennai, Tamil Nadu, 600016",

  gstin: "33AIOPF8710C1ZL",

  mobile: "9092590725",

  pan: "AIOPF8710C",

  email: "info@zaidinfotech.in",

  website: "www.zaidinfotech.in",

  tagline: "Affordable Tech for Everyone",

  bankName: "ZAIDINFOTECH",

  bank: "Karur Vysya Bank, CHENNAI ALANDUR",

  ifsc: "KVBL0001104",

  accountNo: "1104011000000054",
};

// Company ka state (GST split ke liye).
// Customer ka state yahi ho ya khali ho -> CGST + SGST
// Alag state ho -> IGST
const COMPANY_STATE = "Tamil Nadu";


// ======================================================
// HELPERS
// ======================================================

const toNum = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const round2 = (value) =>
  Math.round((toNum(value) + Number.EPSILON) * 100) / 100;

// Naye pricing breakdown wala order/invoice hai ya nahi
const hasBreakdown = (source) =>
  Boolean(source) &&
  typeof source === "object" &&
  source.gstAmount !== undefined &&
  source.gstAmount !== null;

const wordsBelow100 = (number) => {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
    "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  if (number < 20) {
    return ones[number];
  }

  const ten = Math.floor(number / 10);
  const one = number % 10;

  return `${tens[ten]}${one ? ` ${ones[one]}` : ""}`;
};

const indianWords = (number) => {
  const value = Math.floor(Math.abs(toNum(number)));

  if (value === 0) {
    return "Zero";
  }

  const parts = [];

  const crore = Math.floor(value / 10000000);
  const lakh = Math.floor((value % 10000000) / 100000);
  const thousand = Math.floor((value % 100000) / 1000);
  const hundred = Math.floor((value % 1000) / 100);
  const remainder = value % 100;

  if (crore) parts.push(`${indianWords(crore)} Crore`);
  if (lakh) parts.push(`${indianWords(lakh)} Lakh`);
  if (thousand) parts.push(`${indianWords(thousand)} Thousand`);
  if (hundred) parts.push(`${indianWords(hundred)} Hundred`);
  if (remainder) parts.push(wordsBelow100(remainder));

  return parts.join(" ");
};

const amountInWordsText = (amount) => {
  const value = toNum(amount);
  const rupees = Math.floor(value);
  const paise = Math.round((value - rupees) * 100);

  if (paise > 0) {
    return `${indianWords(rupees)} Rupees and ${indianWords(
      paise
    )} Paise Only`;
  }

  return `${indianWords(rupees)} Rupees Only`;
};


// ======================================================
// COMPONENT
// ======================================================

const WalkInInvoicePage = () => {
  const { orderId } = useParams();

  const navigate = useNavigate();

  const invoiceRef = useRef(null);

  const [invoice, setInvoice] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [pdfLoading, setPdfLoading] = useState(false);


  // ======================================================
  // LOAD / CREATE INVOICE
  // ======================================================

  useEffect(() => {
    let mounted = true;

    const loadInvoice = async () => {
      if (!orderId) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // ------------------------------------------------
        // FIRST: TRY EXISTING INVOICE
        // ------------------------------------------------

        try {
          const response = await getInvoiceByOrderId(orderId);

          const existingInvoice =
            response?.data ||
            response?.invoice ||
            response;

          if (existingInvoice && mounted) {
            setInvoice(existingInvoice);
            setLoading(false);
            return;
          }
        } catch (existingError) {
          console.log(
            "Invoice not found. Creating new invoice..."
          );
        }


        // ------------------------------------------------
        // CREATE INVOICE
        // ------------------------------------------------

        const createResponse =
          await createInvoice(orderId);

        const createdInvoice =
          createResponse?.data ||
          createResponse?.invoice ||
          createResponse;

        if (!createdInvoice) {
          throw new Error(
            "Invoice was created but no invoice data was returned."
          );
        }

        if (mounted) {
          setInvoice(createdInvoice);
        }

      } catch (err) {
        console.error(
          "Walk-in invoice loading/creation error:",
          err
        );

        if (mounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to load or create invoice."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadInvoice();

    return () => {
      mounted = false;
    };
  }, [orderId]);


  // ======================================================
  // PRINT
  // ======================================================

  const handlePrint = () => {
    window.print();
  };


  // ======================================================
  // DOWNLOAD PDF
  // ======================================================

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) {
      toast.error("Invoice is not ready.");
      return;
    }

    try {
      setPdfLoading(true);

      const element = invoiceRef.current;

      // Wait for images/fonts
      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imageData =
        canvas.toDataURL("image/png", 1.0);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const imageWidth = pageWidth;

      const imageHeight =
        (canvas.height * imageWidth) /
        canvas.width;


      // ------------------------------------------------
      // SINGLE PAGE
      // ------------------------------------------------

      if (imageHeight <= pageHeight) {
        pdf.addImage(
          imageData,
          "PNG",
          0,
          0,
          imageWidth,
          imageHeight
        );
      } else {

        // ------------------------------------------------
        // MULTI PAGE SUPPORT
        // ------------------------------------------------

        let remainingHeight =
          imageHeight;

        let position = 0;

        pdf.addImage(
          imageData,
          "PNG",
          0,
          position,
          imageWidth,
          imageHeight
        );

        remainingHeight -= pageHeight;

        while (remainingHeight > 0) {

          position =
            position - pageHeight;

          pdf.addPage();

          pdf.addImage(
            imageData,
            "PNG",
            0,
            position,
            imageWidth,
            imageHeight
          );

          remainingHeight -= pageHeight;
        }
      }


      const invoiceNumber =
        invoice?.invoiceNumber ||
        `WALK-IN-${orderId}`;

      pdf.save(
        `${invoiceNumber}.pdf`
      );

      toast.success(
        "Invoice PDF downloaded successfully."
      );

    } catch (err) {

      console.error(
        "PDF generation error:",
        err
      );

      toast.error(
        "Unable to generate PDF."
      );

    } finally {
      setPdfLoading(false);
    }
  };


  // ======================================================
  // CURRENCY
  // ======================================================

  const formatCurrency = (value) => {
    const number = Number(value || 0);

    return `₹ ${number.toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };


  // ======================================================
  // NUMBER ONLY
  // ======================================================

  const numberValue = (value) => {
    return Number(value || 0);
  };


  // ======================================================
  // DATE
  // ======================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };


  // ======================================================
  // GET CUSTOMER
  // ======================================================

  const getCustomerName = () => {
    const billing =
      invoice?.billingAddress || {};

    const user =
      invoice?.user || {};

    if (billing.fullName) {
      return billing.fullName;
    }

    const fullName =
      `${user.firstName || ""} ${
        user.lastName || ""
      }`.trim();

    return fullName || "Customer";
  };


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="walkin-invoice-loading">

        <div className="walkin-loading-box">

          <Loader2
            size={38}
            className="walkin-spin"
          />

          <h2>
            Loading Invoice...
          </h2>

          <p>
            Please wait while we prepare your
            invoice.
          </p>

        </div>

      </div>
    );
  }


  // ======================================================
  // ERROR
  // ======================================================

  if (error || !invoice) {
    return (
      <div className="walkin-invoice-error">

        <div className="walkin-error-box">

          <FileText size={52} />

          <h2>
            Invoice Not Available
          </h2>

          <p>
            {error ||
              "Unable to load invoice."}
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

        </div>

      </div>
    );
  }


  // ======================================================
  // DATA
  // ======================================================

  const customer =
    invoice.user || {};

  const billing =
    invoice.billingAddress || {};

  const shipping =
    invoice.shippingAddress ||
    invoice.billingAddress ||
    {};

  const order =
    invoice.order || {};

  const payment =
    invoice.payment || {};

  const items =
    Array.isArray(invoice.items)
      ? invoice.items
      : [];

  const paymentStatusValue =
    invoice.paymentStatus ||
    order.paymentStatus ||
    payment.status ||
    "PAID";


  // ======================================================
  // PRICING
  //
  // Naye order  -> saved breakdown (invoice ya invoice.order)
  // Purane order -> original invoice calculation (unchanged)
  // ======================================================

  const priceSource = hasBreakdown(invoice)
    ? invoice
    : hasBreakdown(order)
    ? order
    : null;

  const isNewPricing = Boolean(priceSource);

  let subtotal = 0;
  let discount = 0;
  let offerDiscount = 0;
  let couponDiscount = 0;
  let couponCode = "";
  let taxableAmount = 0;
  let gstPercentage = 18;
  let shippingCharge = 0;
  let otherCharges = 0;
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;
  let taxAmount = 0;
  let cgstRate = 9;
  let sgstRate = 9;
  let totalAmount = 0;
  let paidAmount = 0;
  let balanceAmount = 0;
  let isIntraState = true;

  if (isNewPricing) {

    // ----------------------------------------------------
    // NEW ORDER: SAVED BREAKDOWN
    // ----------------------------------------------------

    subtotal = toNum(priceSource.subtotal);

    offerDiscount = toNum(priceSource.offerDiscount);

    couponDiscount = toNum(priceSource.couponDiscount);

    couponCode =
      priceSource.couponCode ||
      order.couponCode ||
      "";

    taxableAmount = toNum(priceSource.taxableAmount);

    gstPercentage = toNum(priceSource.gstPercentage, 18);

    shippingCharge = toNum(priceSource.shippingCharge);

    otherCharges = toNum(priceSource.otherCharges);

    const gstAmount = toNum(priceSource.gstAmount);

    // ----- CGST + SGST ya IGST -----

    const customerState = String(
      shipping.state ||
        billing.state ||
        ""
    )
      .trim()
      .toLowerCase();

    isIntraState =
      !customerState ||
      customerState.includes(
        COMPANY_STATE.toLowerCase()
      );

    if (isIntraState) {
      cgstAmount = round2(gstAmount / 2);
      sgstAmount = round2(gstAmount - cgstAmount);
      igstAmount = 0;
    } else {
      cgstAmount = 0;
      sgstAmount = 0;
      igstAmount = gstAmount;
    }

    taxAmount = gstAmount;

    cgstRate = gstPercentage / 2;

    sgstRate = gstPercentage / 2;

    totalAmount = toNum(
      priceSource.finalAmount,
      taxableAmount +
        gstAmount +
        shippingCharge +
        otherCharges
    );

    const isPaid = ["PAID", "SUCCESS", "COMPLETED"].includes(
      String(paymentStatusValue).toUpperCase()
    );

    paidAmount = isPaid
      ? totalAmount
      : toNum(invoice.paidAmount);

    balanceAmount = Math.max(
      round2(totalAmount - paidAmount),
      0
    );

  } else {

    // ----------------------------------------------------
    // OLD INVOICE: ORIGINAL CALCULATION
    // ----------------------------------------------------

    subtotal =
      numberValue(invoice.subtotal);

    discount =
      numberValue(invoice.discount);

    totalAmount =
      numberValue(invoice.totalAmount);

    paidAmount =
      numberValue(invoice.paidAmount);

    balanceAmount =
      numberValue(invoice.balanceAmount);

    taxableAmount = subtotal - discount;

    cgstAmount =
      numberValue(
        invoice.cgstAmount ||
        invoice.cgst ||
        invoice.tax?.cgstAmount
      );

    sgstAmount =
      numberValue(
        invoice.sgstAmount ||
        invoice.sgst ||
        invoice.tax?.sgstAmount
      );

    taxAmount =
      numberValue(
        invoice.taxAmount ||
        invoice.totalTax ||
        invoice.tax?.totalTax
      );

    // If total tax exists but CGST/SGST don't
    if (
      taxAmount > 0 &&
      cgstAmount === 0 &&
      sgstAmount === 0
    ) {
      cgstAmount = taxAmount / 2;
      sgstAmount = taxAmount / 2;
    }

    // If CGST/SGST exist but total tax doesn't
    if (
      taxAmount === 0 &&
      (cgstAmount > 0 ||
        sgstAmount > 0)
    ) {
      taxAmount =
        cgstAmount + sgstAmount;
    }

    cgstRate =
      invoice.cgstRate ||
      invoice.tax?.cgstRate ||
      9;

    sgstRate =
      invoice.sgstRate ||
      invoice.tax?.sgstRate ||
      9;
  }

  // IGST columns sirf naye order + dusre state ke liye
  const showIgst =
    isNewPricing && !isIntraState;


  // ======================================================
  // TAX TABLE ROWS
  // ======================================================

  const getItemHsn = (item) =>
    item.hsnSac ||
    item.hsn ||
    item.sac ||
    item.hsnCode ||
    "-";

  const getItemLine = (item) =>
    numberValue(item.total) ||
    numberValue(item.price) *
      numberValue(item.quantity);

  let taxRows = [];

  if (isNewPricing) {

    // taxable aur GST ko items me line amount ke hisaab se
    // baanto, phir paise ka farak last row me adjust karo

    const lines = items.map(getItemLine);

    const sumLines = lines.reduce(
      (sum, value) => sum + value,
      0
    );

    let rows = items.map((item, index) => {

      const ratio =
        sumLines > 0
          ? lines[index] / sumLines
          : items.length > 0
          ? 1 / items.length
          : 0;

      return {
        hsn: getItemHsn(item),
        taxable: round2(taxableAmount * ratio),
        gst: round2(taxAmount * ratio),
      };
    });

    if (rows.length > 0) {

      const sumTaxable = rows.reduce(
        (sum, row) => sum + row.taxable,
        0
      );

      const sumGst = rows.reduce(
        (sum, row) => sum + row.gst,
        0
      );

      const last = rows[rows.length - 1];

      last.taxable = Math.max(
        round2(last.taxable + (taxableAmount - sumTaxable)),
        0
      );

      last.gst = Math.max(
        round2(last.gst + (taxAmount - sumGst)),
        0
      );
    }

    taxRows = rows.map((row) => {

      const rowCgst = isIntraState
        ? round2(row.gst / 2)
        : 0;

      const rowSgst = isIntraState
        ? round2(row.gst - rowCgst)
        : 0;

      return {
        hsn: row.hsn,
        taxable: row.taxable,
        cgstRate: isIntraState ? gstPercentage / 2 : "",
        cgst: rowCgst,
        sgstRate: isIntraState ? gstPercentage / 2 : "",
        sgst: rowSgst,
        igstRate: isIntraState ? "" : gstPercentage,
        igst: isIntraState ? 0 : row.gst,
        totalTax: row.gst,
      };
    });

  } else {

    // ----- OLD: original per-item logic -----

    taxRows = items.map((item) => {

      const itemAmount = getItemLine(item);

      const itemTax =
        numberValue(
          item.taxAmount ||
          item.tax
        );

      const itemCGST =
        numberValue(
          item.cgstAmount
        ) ||
        (
          itemTax > 0
            ? itemTax / 2
            : 0
        );

      const itemSGST =
        numberValue(
          item.sgstAmount
        ) ||
        (
          itemTax > 0
            ? itemTax / 2
            : 0
        );

      return {
        hsn: getItemHsn(item),
        taxable: itemAmount,
        cgstRate: item.cgstRate || cgstRate,
        cgst: itemCGST,
        sgstRate: item.sgstRate || sgstRate,
        sgst: itemSGST,
        igstRate: "",
        igst: 0,
        totalTax: itemTax || itemCGST + itemSGST,
      };
    });
  }


  // ======================================================
  // AMOUNT IN WORDS
  // ======================================================

  const totalInWords = isNewPricing
    ? amountInWordsText(totalAmount)
    : invoice.amountInWords ||
      invoice.totalInWords ||
      "Amount as per invoice";


  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="walkin-invoice-page">

      {/* ==================================================
          ACTION BAR
      ================================================== */}

      <div className="walkin-invoice-actions no-print">

        <div className="walkin-actions-inner">

          <button
            type="button"
            className="walkin-back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Back
          </button>


          <div className="walkin-action-right">

            <button
              type="button"
              className="walkin-print-button"
              onClick={handlePrint}
            >
              <Printer size={18} />
              Print
            </button>


            <button
              type="button"
              className="walkin-pdf-button"
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
            >

              {pdfLoading ? (
                <>
                  <Loader2
                    size={18}
                    className="walkin-spin"
                  />
                  Creating PDF...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Download PDF
                </>
              )}

            </button>

          </div>

        </div>

      </div>


      {/* ==================================================
          INVOICE WRAPPER
      ================================================== */}

      <div className="walkin-invoice-container">

        <div
          ref={invoiceRef}
          className="walkin-invoice-paper"
        >

          {/* ==================================================
              COMPANY HEADER
          ================================================== */}

          <div className="invoice-company-header">

            <div className="company-left">

              <img
                src={zaidInfotechLogo}
                alt="Zaid Infotech"
                className="invoice-logo"
              />

              <div className="company-details">

                <h1>
                  {COMPANY.name}
                </h1>

                <p>
                  {COMPANY.addressLine1}
                </p>

                <p>
                  {COMPANY.addressLine2}
                </p>

                <p>
                  <strong>GSTIN:</strong>{" "}
                  {COMPANY.gstin}
                </p>

                <p>
                  <strong>Mobile:</strong>{" "}
                  {COMPANY.mobile}
                </p>

              </div>

            </div>


            <div className="company-right">

              <div className="invoice-main-title">
                TAX INVOICE
              </div>

              <div className="invoice-original">
                ORIGINAL FOR RECIPIENT
              </div>

              <div className="invoice-badge">
                WALK-IN
              </div>

            </div>

          </div>


          {/* ==================================================
              COMPANY CONTACT
          ================================================== */}

          <div className="company-contact-row">

            <span>
              <strong>PAN:</strong>{" "}
              {COMPANY.pan}
            </span>

            <span>
              <strong>Email:</strong>{" "}
              {COMPANY.email}
            </span>

            <span>
              <strong>Website:</strong>{" "}
              {COMPANY.website}
            </span>

          </div>


          {/* ==================================================
              INVOICE INFO
          ================================================== */}

          <div className="invoice-info-section">

            <div className="invoice-info-box">

              <div className="invoice-info-label">
                Invoice No.
              </div>

              <div className="invoice-info-value">
                {invoice.invoiceNumber ||
                  "-"}
              </div>

            </div>


            <div className="invoice-info-box">

              <div className="invoice-info-label">
                Invoice Date
              </div>

              <div className="invoice-info-value">
                {formatDate(
                  invoice.invoiceDate ||
                    invoice.createdAt
                )}
              </div>

            </div>


            <div className="invoice-info-box">

              <div className="invoice-info-label">
                Due Date
              </div>

              <div className="invoice-info-value">
                {formatDate(
                  invoice.dueDate ||
                    invoice.invoiceDate ||
                    invoice.createdAt
                )}
              </div>

            </div>


            <div className="invoice-info-box">

              <div className="invoice-info-label">
                Order No.
              </div>

              <div className="invoice-info-value invoice-break">
                {order?._id
                  ? `#${order._id}`
                  : invoice.referenceId
                    ? `#${invoice.referenceId}`
                    : "-"}
              </div>

            </div>

          </div>


          {/* ==================================================
              BILL TO / SHIP TO
          ================================================== */}

          <div className="customer-grid">

            {/* BILL TO */}

            <div className="customer-card">

              <div className="customer-heading">
                BILL TO
              </div>

              <div className="customer-content">

                <strong className="customer-name">
                  {getCustomerName()}
                </strong>

                <p>
                  Address:{" "}
                  {billing.addressLine ||
                    billing.address ||
                    "-"}
                </p>

                <p>
                  {billing.city || ""}
                  {billing.city &&
                  billing.state
                    ? ", "
                    : ""}
                  {billing.state || ""}
                  {billing.pincode
                    ? ` - ${billing.pincode}`
                    : ""}
                </p>

                <p>
                  {billing.country ||
                    "India"}
                </p>

                <p>
                  <strong>GSTIN:</strong>{" "}
                  {billing.gstin ||
                    billing.GSTIN ||
                    customer.gstin ||
                    "-"}
                </p>

                <p>
                  <strong>Mobile:</strong>{" "}
                  {billing.phone ||
                    customer.phone ||
                    "-"}
                </p>

                {customer.email && (
                  <p>
                    <strong>Email:</strong>{" "}
                    {customer.email}
                  </p>
                )}

              </div>

            </div>


            {/* SHIP TO */}

            <div className="customer-card">

              <div className="customer-heading">
                SHIP TO
              </div>

              <div className="customer-content">

                <strong className="customer-name">
                  {getCustomerName()}
                </strong>

                <p>
                  Address:{" "}
                  {shipping.addressLine ||
                    shipping.address ||
                    "-"}
                </p>

                <p>
                  {shipping.city || ""}
                  {shipping.city &&
                  shipping.state
                    ? ", "
                    : ""}
                  {shipping.state || ""}
                  {shipping.pincode
                    ? ` - ${shipping.pincode}`
                    : ""}
                </p>

                <p>
                  {shipping.country ||
                    "India"}
                </p>

                {shipping.phone && (
                  <p>
                    <strong>Mobile:</strong>{" "}
                    {shipping.phone}
                  </p>
                )}

              </div>

            </div>

          </div>


          {/* ==================================================
              ITEMS TABLE
          ================================================== */}

          <div className="items-section">

            <table className="invoice-items-table">

              <thead>

                <tr>

                  <th className="col-no">
                    S.NO.
                  </th>

                  <th className="col-item">
                    ITEMS / SERVICES
                  </th>

                  <th className="col-hsn">
                    HSN / SAC
                  </th>

                  <th className="col-qty">
                    QTY.
                  </th>

                  <th className="col-rate">
                    RATE
                  </th>

                  <th className="col-discount">
                    DISCOUNT
                  </th>

                  <th className="col-amount">
                    AMOUNT
                  </th>

                </tr>

              </thead>


              <tbody>

                {items.length > 0 ? (
                  items.map(
                    (item, index) => {

                      const quantity =
                        numberValue(
                          item.quantity
                        );

                      const price =
                        numberValue(
                          item.price
                        );

                      const discountAmount =
                        numberValue(
                          item.discountAmount
                        );

                      const calculatedTotal =
                        price * quantity -
                        discountAmount;

                      const itemTotal =
                        item.total !==
                          undefined &&
                        item.total !== null
                          ? numberValue(
                              item.total
                            )
                          : calculatedTotal;

                      return (
                        <tr
                          key={
                            item._id ||
                            item.product ||
                            index
                          }
                        >

                          <td className="text-center">
                            {index + 1}
                          </td>


                          <td className="item-name-cell">

                            <strong>
                              {item.title ||
                                item.name ||
                                "Product / Service"}
                            </strong>

                            {item.description && (
                              <span className="item-description">
                                {item.description}
                              </span>
                            )}

                            {item.productType && (
                              <span className="item-type">
                                Type:{" "}
                                {item.productType}
                              </span>
                            )}

                          </td>


                          <td className="text-center">

                            {item.hsnSac ||
                              item.hsn ||
                              item.sac ||
                              item.hsnCode ||
                              "-"}

                          </td>


                          <td className="text-center">

                            {quantity || 1}

                            <span className="qty-unit">
                              PCS
                            </span>

                          </td>


                          <td className="text-right">

                            {formatCurrency(
                              price
                            )}

                          </td>


                          <td className="text-right">

                            {formatCurrency(
                              discountAmount
                            )}

                          </td>


                          <td className="text-right amount-bold">

                            {formatCurrency(
                              itemTotal
                            )}

                          </td>

                        </tr>
                      );
                    }
                  )
                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="empty-items"
                    >
                      No items found
                    </td>

                  </tr>

                )}


                {/* Empty spacing rows */}

                {items.length < 4 &&
                  Array.from({
                    length:
                      4 - items.length,
                  }).map(
                    (_, index) => (
                      <tr
                        key={`empty-${index}`}
                        className="empty-row"
                      >
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    )
                  )}

              </tbody>


              <tfoot>

                <tr className="subtotal-row">

                  <td
                    colSpan="6"
                    className="subtotal-label"
                  >
                    SUBTOTAL
                  </td>

                  <td className="text-right">
                    {formatCurrency(
                      subtotal
                    )}
                  </td>

                </tr>


                {isNewPricing ? (
                  <>

                    {offerDiscount > 0 && (
                      <tr>

                        <td
                          colSpan="6"
                          className="subtotal-label"
                        >
                          OFFER DISCOUNT
                        </td>

                        <td className="text-right">
                          - {formatCurrency(
                            offerDiscount
                          )}
                        </td>

                      </tr>
                    )}


                    {couponDiscount > 0 && (
                      <tr>

                        <td
                          colSpan="6"
                          className="subtotal-label"
                        >
                          COUPON DISCOUNT
                          {couponCode
                            ? ` (${couponCode})`
                            : ""}
                        </td>

                        <td className="text-right">
                          - {formatCurrency(
                            couponDiscount
                          )}
                        </td>

                      </tr>
                    )}


                    <tr>

                      <td
                        colSpan="6"
                        className="subtotal-label"
                      >
                        TAXABLE VALUE
                      </td>

                      <td className="text-right">
                        {formatCurrency(
                          taxableAmount
                        )}
                      </td>

                    </tr>

                  </>
                ) : (
                  discount > 0 && (
                    <tr>

                      <td
                        colSpan="6"
                        className="subtotal-label"
                      >
                        DISCOUNT
                      </td>

                      <td className="text-right">
                        {formatCurrency(
                          discount
                        )}
                      </td>

                    </tr>
                  )
                )}


                {showIgst && igstAmount > 0 && (
                  <tr>

                    <td
                      colSpan="6"
                      className="subtotal-label"
                    >
                      IGST @ {gstPercentage}%
                    </td>

                    <td className="text-right">
                      {formatCurrency(
                        igstAmount
                      )}
                    </td>

                  </tr>
                )}


                {cgstAmount > 0 && (
                  <tr>

                    <td
                      colSpan="6"
                      className="subtotal-label"
                    >
                      CGST @ {cgstRate}%
                    </td>

                    <td className="text-right">
                      {formatCurrency(
                        cgstAmount
                      )}
                    </td>

                  </tr>
                )}


                {sgstAmount > 0 && (
                  <tr>

                    <td
                      colSpan="6"
                      className="subtotal-label"
                    >
                      SGST @ {sgstRate}%
                    </td>

                    <td className="text-right">
                      {formatCurrency(
                        sgstAmount
                      )}
                    </td>

                  </tr>
                )}


                {isNewPricing && shippingCharge > 0 && (
                  <tr>

                    <td
                      colSpan="6"
                      className="subtotal-label"
                    >
                      SHIPPING
                    </td>

                    <td className="text-right">
                      {formatCurrency(
                        shippingCharge
                      )}
                    </td>

                  </tr>
                )}


                {isNewPricing && otherCharges > 0 && (
                  <tr>

                    <td
                      colSpan="6"
                      className="subtotal-label"
                    >
                      OTHER CHARGES
                    </td>

                    <td className="text-right">
                      {formatCurrency(
                        otherCharges
                      )}
                    </td>

                  </tr>
                )}


                <tr className="grand-total-row">

                  <td
                    colSpan="6"
                    className="grand-total-label"
                  >
                    TOTAL
                  </td>

                  <td className="text-right grand-total-value">
                    {formatCurrency(
                      totalAmount
                    )}
                  </td>

                </tr>

              </tfoot>

            </table>

          </div>


          {/* ==================================================
              TAX SUMMARY
          ================================================== */}

          {(taxAmount > 0 ||
            cgstAmount > 0 ||
            sgstAmount > 0) && (

            <div className="tax-summary-section">

              <div className="tax-summary-title">
                TAX SUMMARY
              </div>

              <table className="tax-summary-table">

                <thead>

                  <tr>

                    <th rowSpan="2">
                      HSN / SAC
                    </th>

                    <th rowSpan="2">
                      Taxable Value
                    </th>

                    {showIgst ? (
                      <th colSpan="2">
                        IGST
                      </th>
                    ) : (
                      <>
                        <th colSpan="2">
                          CGST
                        </th>

                        <th colSpan="2">
                          SGST
                        </th>
                      </>
                    )}

                    <th rowSpan="2">
                      Total Tax
                    </th>

                  </tr>

                  <tr>

                    {showIgst ? (
                      <>
                        <th>
                          Rate
                        </th>

                        <th>
                          Amount
                        </th>
                      </>
                    ) : (
                      <>
                        <th>
                          Rate
                        </th>

                        <th>
                          Amount
                        </th>

                        <th>
                          Rate
                        </th>

                        <th>
                          Amount
                        </th>
                      </>
                    )}

                  </tr>

                </thead>


                <tbody>

                  {taxRows.map(
                    (row, index) => (
                      <tr
                        key={`tax-${index}`}
                      >

                        <td>
                          {row.hsn}
                        </td>

                        <td className="text-right">
                          {formatCurrency(
                            row.taxable
                          )}
                        </td>

                        {showIgst ? (
                          <>
                            <td className="text-center">
                              {row.igstRate}
                              %
                            </td>

                            <td className="text-right">
                              {formatCurrency(
                                row.igst
                              )}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="text-center">
                              {row.cgstRate}
                              %
                            </td>

                            <td className="text-right">
                              {formatCurrency(
                                row.cgst
                              )}
                            </td>

                            <td className="text-center">
                              {row.sgstRate}
                              %
                            </td>

                            <td className="text-right">
                              {formatCurrency(
                                row.sgst
                              )}
                            </td>
                          </>
                        )}

                        <td className="text-right">
                          {formatCurrency(
                            row.totalTax
                          )}
                        </td>

                      </tr>
                    )
                  )}


                  <tr className="tax-total-row">

                    <td>
                      <strong>
                        Total
                      </strong>
                    </td>

                    <td className="text-right">
                      <strong>
                        {formatCurrency(
                          taxableAmount
                        )}
                      </strong>
                    </td>

                    {showIgst ? (
                      <>
                        <td></td>

                        <td className="text-right">
                          <strong>
                            {formatCurrency(
                              igstAmount
                            )}
                          </strong>
                        </td>
                      </>
                    ) : (
                      <>
                        <td></td>

                        <td className="text-right">
                          <strong>
                            {formatCurrency(
                              cgstAmount
                            )}
                          </strong>
                        </td>

                        <td></td>

                        <td className="text-right">
                          <strong>
                            {formatCurrency(
                              sgstAmount
                            )}
                          </strong>
                        </td>
                      </>
                    )}

                    <td className="text-right">
                      <strong>
                        {formatCurrency(
                          taxAmount
                        )}
                      </strong>
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>
          )}


          {/* ==================================================
              BOTTOM INFORMATION
          ================================================== */}

          <div className="invoice-bottom-grid">

            {/* AMOUNT WORDS */}

            <div className="amount-words-box">

              <div className="bottom-section-title">
                Total Amount (in words)
              </div>

              <p>
                {totalInWords}
              </p>


              <div className="payment-small-info">

                <div className="bottom-section-title">
                  Payment Information
                </div>

                <p>
                  <strong>
                    Payment Status:
                  </strong>{" "}
                  {paymentStatusValue}
                </p>

                <p>
                  <strong>
                    Payment Method:
                  </strong>{" "}
                  {invoice.paymentMethod ||
                    payment.method ||
                    "CASH"}
                </p>

                {(payment.paymentId ||
                  payment.transactionId ||
                  payment._id) && (
                  <p>
                    <strong>
                      Transaction ID:
                    </strong>{" "}
                    {payment.paymentId ||
                      payment.transactionId ||
                      payment._id}
                  </p>
                )}

              </div>

            </div>


            {/* TOTAL BOX */}

            <div className="final-total-box">

              <div className="final-total-row">

                <span>
                  Taxable Amount
                </span>

                <strong>
                  {formatCurrency(
                    taxableAmount
                  )}
                </strong>

              </div>


              {showIgst && igstAmount > 0 && (
                <div className="final-total-row">

                  <span>
                    IGST
                  </span>

                  <strong>
                    {formatCurrency(
                      igstAmount
                    )}
                  </strong>

                </div>
              )}


              {cgstAmount > 0 && (
                <div className="final-total-row">

                  <span>
                    CGST
                  </span>

                  <strong>
                    {formatCurrency(
                      cgstAmount
                    )}
                  </strong>

                </div>
              )}


              {sgstAmount > 0 && (
                <div className="final-total-row">

                  <span>
                    SGST
                  </span>

                  <strong>
                    {formatCurrency(
                      sgstAmount
                    )}
                  </strong>

                </div>
              )}


              {isNewPricing && (
                <div className="final-total-row">

                  <span>
                    Shipping
                  </span>

                  <strong>
                    {shippingCharge > 0
                      ? formatCurrency(
                          shippingCharge
                        )
                      : "Free"}
                  </strong>

                </div>
              )}


              {isNewPricing && otherCharges > 0 && (
                <div className="final-total-row">

                  <span>
                    Other Charges
                  </span>

                  <strong>
                    {formatCurrency(
                      otherCharges
                    )}
                  </strong>

                </div>
              )}


              <div className="final-grand-row">

                <span>
                  TOTAL AMOUNT
                </span>

                <strong>
                  {formatCurrency(
                    totalAmount
                  )}
                </strong>

              </div>


              <div className="final-total-row">

                <span>
                  Amount Paid
                </span>

                <strong>
                  {formatCurrency(
                    paidAmount
                  )}
                </strong>

              </div>


              <div className="final-due-row">

                <span>
                  Amount Due
                </span>

                <strong>
                  {formatCurrency(
                    balanceAmount
                  )}
                </strong>

              </div>

            </div>

          </div>


          {/* ==================================================
              BANK DETAILS
          ================================================== */}

          <div className="bank-signature-grid">

            <div className="bank-details">

              <div className="bottom-section-title">
                Bank Details
              </div>

              <p>
                <strong>
                  Name:
                </strong>{" "}
                {COMPANY.bankName}
              </p>

              <p>
                <strong>
                  IFSC Code:
                </strong>{" "}
                {COMPANY.ifsc}
              </p>

              <p>
                <strong>
                  Account No:
                </strong>{" "}
                {COMPANY.accountNo}
              </p>

              <p>
                <strong>
                  Bank:
                </strong>{" "}
                {COMPANY.bank}
              </p>

            </div>


            <div className="signature-box">

              <p className="signature-label">
                Authorised Signatory For
              </p>

              <div className="signature-space">
                __________________________
              </div>

              <strong>
                ZAID INFOTECH
              </strong>

            </div>

          </div>


          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="invoice-footer">

            <div className="footer-thank-you">
              Thank you for shopping with
              <strong>
                {" "}ZAID INFOTECH!
              </strong>
            </div>

            <div className="footer-tagline">
              “{COMPANY.tagline}”
            </div>

            <div className="footer-original">
              TAX INVOICE ORIGINAL FOR RECIPIENT
            </div>

            <div className="footer-generated">
              This is a computer-generated invoice.
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


export default WalkInInvoicePage;