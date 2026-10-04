// import React from "react";
// import "./WalkInInvoice.css";

// // ============================================================
// // WALK-IN INVOICE
// // ============================================================
// // Existing props/API behavior is preserved:
// //   <WalkInInvoice order={order} onClose={onClose} />
// //
// // This version only improves the invoice UI:
// // - Zaid Infotech logo on the left
// // - Tax-invoice style header
// // - Bill To / Ship To
// // - Product table
// // - Totals
// // - Optional CGST / SGST / IGST values when present in the order
// // - Amount in words
// // - Company bank details at the bottom
// // - Print-friendly layout
// // - All CSS classes are uniquely prefixed with "wkinv-"
// // ============================================================

// import zaidInfotechLogo from "../../../../assets/images/zaidinfotechlogo.png";

// // ============================================================
// // HELPERS
// // ============================================================

// const safeNumber = (value, fallback = 0) => {
//     const number = Number(value);
//     return Number.isFinite(number) ? number : fallback;
// };

// const formatCurrency = (value) => {
//     return `₹ ${safeNumber(value).toLocaleString("en-IN", {
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 2,
//     })}`;
// };

// const formatDate = (value) => {
//     if (!value) return "-";

//     const date = new Date(value);

//     if (Number.isNaN(date.getTime())) {
//         return String(value);
//     }

//     return date.toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//     });
// };

// const formatDateTime = (value) => {
//     if (!value) return "-";

//     const date = new Date(value);

//     if (Number.isNaN(date.getTime())) {
//         return String(value);
//     }

//     return date.toLocaleString("en-IN", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//     });
// };

// // ============================================================
// // INDIAN RUPEE AMOUNT IN WORDS
// // ============================================================

// const numberToWordsBelow100 = (number) => {
//     const ones = [
//         "",
//         "One",
//         "Two",
//         "Three",
//         "Four",
//         "Five",
//         "Six",
//         "Seven",
//         "Eight",
//         "Nine",
//         "Ten",
//         "Eleven",
//         "Twelve",
//         "Thirteen",
//         "Fourteen",
//         "Fifteen",
//         "Sixteen",
//         "Seventeen",
//         "Eighteen",
//         "Nineteen",
//     ];

//     const tens = [
//         "",
//         "",
//         "Twenty",
//         "Thirty",
//         "Forty",
//         "Fifty",
//         "Sixty",
//         "Seventy",
//         "Eighty",
//         "Ninety",
//     ];

//     if (number < 20) {
//         return ones[number];
//     }

//     const ten = Math.floor(number / 10);
//     const one = number % 10;

//     return `${tens[ten]}${one ? ` ${ones[one]}` : ""}`;
// };

// const numberToIndianWords = (number) => {
//     const value = Math.floor(Math.abs(safeNumber(number)));

//     if (value === 0) {
//         return "Zero";
//     }

//     const parts = [];

//     const crore = Math.floor(value / 10000000);
//     const lakh = Math.floor((value % 10000000) / 100000);
//     const thousand = Math.floor((value % 100000) / 1000);
//     const hundred = Math.floor((value % 1000) / 100);
//     const remainder = value % 100;

//     if (crore) {
//         parts.push(`${numberToIndianWords(crore)} Crore`);
//     }

//     if (lakh) {
//         parts.push(`${numberToIndianWords(lakh)} Lakh`);
//     }

//     if (thousand) {
//         parts.push(`${numberToIndianWords(thousand)} Thousand`);
//     }

//     if (hundred) {
//         parts.push(`${numberToIndianWords(hundred)} Hundred`);
//     }

//     if (remainder) {
//         parts.push(numberToWordsBelow100(remainder));
//     }

//     return parts.join(" ");
// };

// const amountInWords = (amount) => {
//     const value = safeNumber(amount);
//     const rupees = Math.floor(value);
//     const paise = Math.round((value - rupees) * 100);

//     if (paise > 0) {
//         return `${numberToIndianWords(rupees)} Rupees and ${numberToIndianWords(
//             paise
//         )} Paise Only`;
//     }

//     return `${numberToIndianWords(rupees)} Rupees Only`;
// };

// // ============================================================
// // GENERIC FIELD HELPER
// // ============================================================

// const firstValue = (...values) => {
//     return values.find(
//         (value) =>
//             value !== undefined &&
//             value !== null &&
//             String(value).trim() !== ""
//     );
// };

// const getFullName = (person = {}) => {
//     if (!person) return "";

//     return (
//         firstValue(
//             person.fullName,
//             person.name,
//             [person.firstName, person.lastName].filter(Boolean).join(" ")
//         ) || ""
//     );
// };

// const getAddressText = (address = {}) => {
//     if (!address) return "-";

//     const parts = [
//         address.addressLine,
//         address.address,
//         address.address1,
//         address.address2,
//         address.street,
//         address.locality,
//         address.area,
//         address.city,
//         address.state,
//         address.pincode,
//         address.postalCode,
//         address.zipCode,
//     ].filter(Boolean);

//     if (parts.length === 0) {
//         return "-";
//     }

//     return parts.join(", ");
// };

// // ============================================================
// // COMPONENT
// // ============================================================

// function WalkInInvoice({ order, onClose }) {
//     if (!order) {
//         return null;
//     }

//     // ========================================================
//     // PRINT
//     // ========================================================

// const printInvoice = () => {
//     try {
//         // =====================================================
//         // FIND ONLY THE INVOICE
//         // =====================================================

//         const invoiceElement =
//             document.querySelector(".wkinv-container");

//         if (!invoiceElement) {
//             alert("Invoice not found. Please try again.");
//             return;
//         }

//         // =====================================================
//         // CREATE HIDDEN PRINT IFRAME
//         // =====================================================

//         const printFrame =
//             document.createElement("iframe");

//         printFrame.setAttribute(
//             "title",
//             "Walk-In Invoice Print"
//         );

//         printFrame.style.position = "fixed";
//         printFrame.style.right = "0";
//         printFrame.style.bottom = "0";
//         printFrame.style.width = "0";
//         printFrame.style.height = "0";
//         printFrame.style.border = "0";
//         printFrame.style.opacity = "0";
//         printFrame.style.pointerEvents = "none";

//         document.body.appendChild(printFrame);

//         const printDocument =
//             printFrame.contentDocument ||
//             printFrame.contentWindow.document;

//         // =====================================================
//         // OPEN PRINT DOCUMENT
//         // =====================================================

//         printDocument.open();

//         printDocument.write(`
//             <!DOCTYPE html>
//             <html>
//             <head>

//                 <meta charset="UTF-8" />

//                 <meta
//                     name="viewport"
//                     content="width=device-width, initial-scale=1.0"
//                 />

//                 <title>
//                     Walk-In Invoice - ${invoiceNumber}
//                 </title>

//                 <style>

//                     /* =================================================
//                        BASIC PAGE RESET
//                     ================================================= */

//                     html,
//                     body {
//                         margin: 0 !important;
//                         padding: 0 !important;
//                         width: 100% !important;
//                         min-height: 100% !important;

//                         background: #ffffff !important;

//                         color: #111111 !important;

//                         font-family:
//                             Arial,
//                             Helvetica,
//                             sans-serif !important;
//                     }


//                     /* =================================================
//                        IMPORTANT VISIBILITY FIX
//                     ================================================= */

//                     body,
//                     body * {
//                         visibility: visible !important;
//                         opacity: 1 !important;
//                     }


//                     /* =================================================
//                        INVOICE
//                     ================================================= */

//                     .wkinv-container {

//                         display: block !important;

//                         visibility: visible !important;

//                         opacity: 1 !important;

//                         width: 100% !important;

//                         max-width: 190mm !important;

//                         min-width: 0 !important;

//                         margin: 0 auto !important;

//                         padding: 5mm !important;

//                         box-sizing: border-box !important;

//                         background: #ffffff !important;

//                         color: #111111 !important;

//                         border: 0 !important;

//                         border-radius: 0 !important;

//                         box-shadow: none !important;

//                         overflow: visible !important;

//                     }


//                     /* =================================================
//                        ALL CHILDREN
//                     ================================================= */

//                     .wkinv-container,
//                     .wkinv-container *,
//                     .wkinv-container *::before,
//                     .wkinv-container *::after {

//                         visibility: visible !important;

//                         opacity: 1 !important;

//                     }


//                     /* =================================================
//                        TEXT
//                     ================================================= */

//                     .wkinv-container h1,
//                     .wkinv-container h2,
//                     .wkinv-container h3,
//                     .wkinv-container h4,
//                     .wkinv-container h5,
//                     .wkinv-container h6,
//                     .wkinv-container p,
//                     .wkinv-container span,
//                     .wkinv-container strong,
//                     .wkinv-container div,
//                     .wkinv-container td,
//                     .wkinv-container th {

//                         color: #111111 !important;

//                     }


//                     /* =================================================
//                        LOGO
//                     ================================================= */

//                     .wkinv-company-logo,
//                     .wkinv-sign-logo {

//                         display: block !important;

//                         visibility: visible !important;

//                         opacity: 1 !important;

//                         max-width: 100% !important;

//                         object-fit: contain !important;

//                     }


//                     /* =================================================
//                        BUTTONS NEVER PRINT
//                     ================================================= */

//                     .wkinv-buttons {

//                         display: none !important;

//                         visibility: hidden !important;

//                     }


//                     /* =================================================
//                        TABLES
//                     ================================================= */

//                     .wkinv-table-wrap,
//                     .wkinv-tax-summary {

//                         width: 100% !important;

//                         overflow: visible !important;

//                     }


//                     .wkinv-items-table,
//                     .wkinv-tax-table {

//                         width: 100% !important;

//                         border-collapse: collapse !important;

//                         border-spacing: 0 !important;

//                     }


//                     .wkinv-items-table th,
//                     .wkinv-items-table td,
//                     .wkinv-tax-table th,
//                     .wkinv-tax-table td {

//                         visibility: visible !important;

//                         opacity: 1 !important;

//                     }


//                     /* =================================================
//                        KEEP INVOICE SECTIONS TOGETHER
//                     ================================================= */

//                     .wkinv-document-top,
//                     .wkinv-company-header,
//                     .wkinv-address-grid,
//                     .wkinv-table-wrap,
//                     .wkinv-tax-summary,
//                     .wkinv-summary-grid,
//                     .wkinv-bottom-grid,
//                     .wkinv-footer {

//                         break-inside: avoid !important;

//                         page-break-inside: avoid !important;

//                     }


//                     /* =================================================
//                        PAGE BREAK
//                     ================================================= */

//                     tr {

//                         break-inside: avoid !important;

//                         page-break-inside: avoid !important;

//                     }


//                     /* =================================================
//                        A4
//                     ================================================= */

//                     @page {

//                         size: A4 portrait;

//                         margin: 7mm;

//                     }

//                 </style>

//             </head>

//             <body>

//                 <div id="print-root"></div>

//             </body>

//             </html>
//         `);

//         printDocument.close();

//         // =====================================================
//         // COPY ALL CURRENT STYLES
//         // =====================================================

//         const currentStyles =
//             Array.from(
//                 document.querySelectorAll(
//                     'style, link[rel="stylesheet"]'
//                 )
//             );

//         currentStyles.forEach((styleNode) => {

//             try {

//                 const clonedStyle =
//                     styleNode.cloneNode(true);

//                 printDocument.head.appendChild(
//                     clonedStyle
//                 );

//             } catch (error) {

//                 console.warn(
//                     "Unable to copy stylesheet:",
//                     error
//                 );

//             }

//         });

//         // =====================================================
//         // CLONE ONLY INVOICE
//         // =====================================================

//         const invoiceClone =
//             invoiceElement.cloneNode(true);


//         // =====================================================
//         // REMOVE BUTTONS
//         // =====================================================

//         invoiceClone
//             .querySelectorAll(
//                 ".wkinv-buttons"
//             )
//             .forEach((element) => {

//                 element.remove();

//             });


//         // =====================================================
//         // FORCE PRINT VISIBILITY
//         // =====================================================

//         invoiceClone
//             .querySelectorAll("*")
//             .forEach((element) => {

//                 element.style.visibility =
//                     "visible";

//                 element.style.opacity =
//                     "1";

//             });


//         // =====================================================
//         // ADD INVOICE TO PRINT DOCUMENT
//         // =====================================================

//         const printRoot =
//             printDocument.getElementById(
//                 "print-root"
//             );

//         printRoot.appendChild(
//             invoiceClone
//         );


//         // =====================================================
//         // FINAL PRINT CSS
//         // =====================================================

//         const finalPrintStyle =
//             printDocument.createElement(
//                 "style"
//             );

//         finalPrintStyle.textContent = `

//             html,
//             body {

//                 margin: 0 !important;

//                 padding: 0 !important;

//                 width: 100% !important;

//                 min-height: 100% !important;

//                 background: #ffffff !important;

//                 color: #111111 !important;

//             }


//             body,
//             body * {

//                 visibility: visible !important;

//                 opacity: 1 !important;

//             }


//             #print-root {

//                 display: block !important;

//                 width: 100% !important;

//                 margin: 0 !important;

//                 padding: 0 !important;

//                 background: #ffffff !important;

//             }


//             .wkinv-container {

//                 display: block !important;

//                 visibility: visible !important;

//                 opacity: 1 !important;

//                 width: 100% !important;

//                 max-width: 190mm !important;

//                 margin: 0 auto !important;

//                 padding: 5mm !important;

//                 box-sizing: border-box !important;

//                 background: #ffffff !important;

//                 color: #111111 !important;

//                 border: none !important;

//                 border-radius: 0 !important;

//                 box-shadow: none !important;

//                 overflow: visible !important;

//             }


//             .wkinv-container * {

//                 visibility: visible !important;

//                 opacity: 1 !important;

//             }


//             .wkinv-buttons {

//                 display: none !important;

//                 visibility: hidden !important;

//             }


//             .wkinv-company-logo,
//             .wkinv-sign-logo {

//                 display: block !important;

//                 visibility: visible !important;

//                 opacity: 1 !important;

//             }


//             .wkinv-items-table,
//             .wkinv-tax-table {

//                 width: 100% !important;

//                 border-collapse: collapse !important;

//             }


//             .wkinv-items-table thead,
//             .wkinv-tax-table thead {

//                 display: table-header-group !important;

//             }


//             .wkinv-items-table tr,
//             .wkinv-tax-table tr {

//                 break-inside: avoid !important;

//                 page-break-inside: avoid !important;

//             }


//             @page {

//                 size: A4 portrait;

//                 margin: 7mm;

//             }

//         `;

//         printDocument.head.appendChild(
//             finalPrintStyle
//         );


//         // =====================================================
//         // WAIT FOR IMAGES
//         // =====================================================

//         const images =
//             Array.from(
//                 printDocument.images
//             );


//         const waitForImages =
//             images.map((image) => {

//                 return new Promise((resolve) => {

//                     if (image.complete) {

//                         resolve();

//                         return;

//                     }


//                     image.onload = resolve;

//                     image.onerror = resolve;

//                 });

//             });


//         // =====================================================
//         // WAIT FOR FONTS + IMAGES
//         // =====================================================

//         const waitForFonts =
//             printDocument.fonts &&
//             printDocument.fonts.ready
//                 ? printDocument.fonts.ready
//                 : Promise.resolve();


//         Promise.all([
//             ...waitForImages,
//             waitForFonts
//         ]).then(() => {

//             setTimeout(() => {

//                 try {

//                     printFrame.contentWindow
//                         .focus();

//                     printFrame.contentWindow
//                         .print();

//                 } finally {

//                     /*
//                      * Do NOT immediately remove iframe.
//                      * Some browsers need it during printing.
//                      */

//                     setTimeout(() => {

//                         if (
//                             printFrame &&
//                             printFrame.parentNode
//                         ) {

//                             printFrame.parentNode
//                                 .removeChild(
//                                     printFrame
//                                 );

//                         }

//                     }, 1500);

//                 }

//             }, 500);

//         });

//     } catch (error) {

//         console.error(
//             "WALK-IN INVOICE PRINT ERROR:",
//             error
//         );

//         alert(
//             "Unable to print invoice. Please try again."
//         );

//     }
// };
//     // ========================================================
//     // SUPPORT BOTH:
//     // 1. CREATED ORDER
//     // 2. CREATED INVOICE
//     // ========================================================

//     const isInvoice = Boolean(
//         order.invoiceNumber ||
//         order.invoiceFor
//     );

//     // Keep this variable intentionally available because the
//     // original component supported both order and invoice data.
//     void isInvoice;

//     // ========================================================
//     // CUSTOMER / BILLING / SHIPPING
//     // ========================================================

//     const customer =
//         order.billingAddress ||
//         order.shippingAddress ||
//         order.customer ||
//         {};

//     const shippingAddress =
//         order.shippingAddress ||
//         order.billingAddress ||
//         order.customer ||
//         {};

//     const customerName =
//         firstValue(
//             customer.fullName,
//             customer.name,
//             getFullName(order.customer),
//             getFullName(order.user),
//             order.customerName,
//             order.userName
//         ) || "Walk-In Customer";

//     const customerPhone =
//         firstValue(
//             customer.phone,
//             customer.mobile,
//             customer.phoneNumber,
//             order.customerPhone,
//             order.phone,
//             order.mobile
//         ) || "-";

//     const customerEmail =
//         firstValue(
//             customer.email,
//             order.customerEmail,
//             order.email
//         ) || "";

//     // ========================================================
//     // ITEMS
//     // ========================================================

//     const items = Array.isArray(order.items)
//         ? order.items
//         : Array.isArray(order.orderItems)
//         ? order.orderItems
//         : [];

//     // ========================================================
//     // INVOICE DETAILS
//     // ========================================================

//     const invoiceNumber =
//         firstValue(
//             order.invoiceNumber,
//             order.invoiceNo,
//             order.invoice_id,
//             order._id
//         ) || "N/A";

//     const invoiceDate =
//         order.invoiceDate ||
//         order.createdAt ||
//         new Date();

//     const dueDate =
//         order.dueDate ||
//         order.paymentDueDate ||
//         invoiceDate;

//     const orderSource =
//         order.orderSource ||
//         order.source ||
//         "WALK_IN";

//     const paymentMethod =
//         order.paymentMethod ||
//         order.payment_mode ||
//         "CASH";

//     const paymentStatus =
//         order.paymentStatus ||
//         order.payment_status ||
//         "PAID";

//     // ========================================================
//     // TOTALS
//     // ========================================================

//     const subtotal = safeNumber(
//         order.subtotal ??
//         order.subTotal ??
//         order.totalBeforeDiscount ??
//         order.totalAmount ??
//         0
//     );

//     const discount = safeNumber(
//         order.discount ??
//         order.discountAmount ??
//         0
//     );

//     const taxableAmount = safeNumber(
//         order.taxableAmount ??
//         order.taxableValue ??
//         Math.max(subtotal - discount, 0)
//     );

//     const cgst = safeNumber(
//         order.cgst ??
//         order.cgstAmount ??
//         order.taxDetails?.cgstAmount ??
//         0
//     );

//     const sgst = safeNumber(
//         order.sgst ??
//         order.sgstAmount ??
//         order.taxDetails?.sgstAmount ??
//         0
//     );

//     const igst = safeNumber(
//         order.igst ??
//         order.igstAmount ??
//         order.taxDetails?.igstAmount ??
//         0
//     );

//     const totalTax = safeNumber(
//         order.totalTax ??
//         order.taxAmount ??
//         cgst + sgst + igst
//     );

//     const totalAmount = safeNumber(
//         order.totalAmount ??
//         order.grandTotal ??
//         order.finalAmount ??
//         taxableAmount + totalTax
//     );

//     const paidAmount = safeNumber(
//         order.paidAmount ??
//         (
//             paymentStatus === "PAID"
//                 ? totalAmount
//                 : 0
//         )
//     );

//     const balanceAmount = safeNumber(
//         order.balanceAmount ??
//         Math.max(totalAmount - paidAmount, 0)
//     );

//     // ========================================================
//     // COMPANY DETAILS
//     // ========================================================
//     // These values are displayed in the invoice design shown
//     // by the user. They can be changed later without touching
//     // the order/API logic.
//     // ========================================================

//     const company = {
//         name: "ZAID INFOTECH",
//         address:
//             "No 232, 1st Floor, M.K.N. Road, Alandur, Chennai, Tamil Nadu, 600016",
//         gstin: "33AIOPFB710C1ZL",
//         pan: "AIOPFB710C",
//         mobile: "9092590725",
//         email: "info@zaidinfotech.in",
//         website: "www.zaidinfotech.in",
//         tagline: "Affordable Tech for Everyone",
//     };

//     const bankDetails = {
//         name: "ZAID INFOTECH",
//         ifsc: "KVBL0001104",
//         account: "1104011000000054",
//         bank:
//             "Karur Vysya Bank, CHENNAI ALANDUR",
//     };

//     // ========================================================
//     // OPTIONAL HSN/SAC
//     // ========================================================

//     const getItemName = (item) => {
//         return (
//             firstValue(
//                 item.title,
//                 item.name,
//                 item.productName,
//                 item.product?.title,
//                 item.product?.name,
//                 item.product?.productName
//             ) || "Product"
//         );
//     };

//     const getItemDescription = (item) => {
//         return firstValue(
//             item.description,
//             item.product?.description
//         ) || "";
//     };

//     const getItemHsn = (item) => {
//         return firstValue(
//             item.hsnSac,
//             item.hsn,
//             item.sac,
//             item.hsnCode,
//             item.product?.hsnSac,
//             item.product?.hsn,
//             item.product?.sac
//         ) || "-";
//     };

//     const getItemQuantity = (item) => {
//         return safeNumber(
//             item.quantity ??
//             item.qty ??
//             1,
//             1
//         );
//     };

//     const getItemPrice = (item) => {
//         return safeNumber(
//             item.price ??
//             item.originalPrice ??
//             item.unitPrice ??
//             item.rate ??
//             item.product?.price ??
//             0
//         );
//     };

//     const getItemTotal = (item) => {
//         const quantity = getItemQuantity(item);
//         const price = getItemPrice(item);

//         return safeNumber(
//             item.total ??
//             item.itemTotal ??
//             item.amount ??
//             price * quantity
//         );
//     };

//     // ========================================================
//     // RETURN
//     // ========================================================

//     return (
//         <div
//             className="wkinv-overlay"
//             role="dialog"
//             aria-modal="true"
//             aria-label="Walk-in invoice"
//         >
//             <div className="wkinv-container">

//                 {/* ==================================================
//                     TOP LABEL
//                 ================================================== */}

//                 <div className="wkinv-document-top">
//                     <span className="wkinv-document-title">
//                         TAX INVOICE
//                     </span>

//                     <span className="wkinv-recipient-label">
//                         ORIGINAL FOR RECIPIENT
//                     </span>

//                     <span className="wkinv-tagline">
//                         “{company.tagline}”
//                     </span>
//                 </div>

//                 {/* ==================================================
//                     COMPANY HEADER
//                 ================================================== */}

//                 <div className="wkinv-company-header">

//                     <div className="wkinv-company-left">

//                         <div className="wkinv-logo-wrap">
//                             <img
//                                 src={zaidInfotechLogo}
//                                 alt="Zaid Infotech Logo"
//                                 className="wkinv-company-logo"
//                             />
//                         </div>

//                         <div className="wkinv-company-details">

//                             <h1 className="wkinv-company-name">
//                                 {company.name}
//                             </h1>

//                             <p className="wkinv-company-address">
//                                 {company.address}
//                             </p>

//                             <div className="wkinv-company-meta-grid">

//                                 <p>
//                                     <strong>GSTIN:</strong>{" "}
//                                     {company.gstin}
//                                 </p>

//                                 <p>
//                                     <strong>Mobile:</strong>{" "}
//                                     {company.mobile}
//                                 </p>

//                                 <p>
//                                     <strong>PAN:</strong>{" "}
//                                     {company.pan}
//                                 </p>

//                                 <p>
//                                     <strong>Email:</strong>{" "}
//                                     {company.email}
//                                 </p>

//                                 <p className="wkinv-company-website">
//                                     <strong>Website:</strong>{" "}
//                                     {company.website}
//                                 </p>

//                             </div>

//                         </div>

//                     </div>

//                     <div className="wkinv-invoice-meta">

//                         <div className="wkinv-meta-row">
//                             <span>Invoice No.</span>
//                             <strong>{invoiceNumber}</strong>
//                         </div>

//                         <div className="wkinv-meta-row">
//                             <span>Invoice Date</span>
//                             <strong>
//                                 {formatDate(invoiceDate)}
//                             </strong>
//                         </div>

//                         <div className="wkinv-meta-row">
//                             <span>Due Date</span>
//                             <strong>
//                                 {formatDate(dueDate)}
//                             </strong>
//                         </div>

//                         <div className="wkinv-meta-row">
//                             <span>Invoice Type</span>
//                             <strong>
//                                 {String(orderSource).replaceAll("_", " ")}
//                             </strong>
//                         </div>

//                     </div>

//                 </div>

//                 {/* ==================================================
//                     BILL TO / SHIP TO
//                 ================================================== */}

//                 <div className="wkinv-address-grid">

//                     <div className="wkinv-address-box">

//                         <div className="wkinv-box-title">
//                             BILL TO
//                         </div>

//                         <h3 className="wkinv-customer-name">
//                             {customerName}
//                         </h3>

//                         <p>
//                             <strong>Address:</strong>{" "}
//                             {getAddressText(customer)}
//                         </p>

//                         <p>
//                             <strong>Mobile:</strong>{" "}
//                             {customerPhone}
//                         </p>

//                         {customerEmail && (
//                             <p>
//                                 <strong>Email:</strong>{" "}
//                                 {customerEmail}
//                             </p>
//                         )}

//                         {customer.gstin && (
//                             <p>
//                                 <strong>GSTIN:</strong>{" "}
//                                 {customer.gstin}
//                             </p>
//                         )}

//                     </div>

//                     <div className="wkinv-address-box">

//                         <div className="wkinv-box-title">
//                             SHIP TO
//                         </div>

//                         <h3 className="wkinv-customer-name">
//                             {firstValue(
//                                 shippingAddress.fullName,
//                                 shippingAddress.name,
//                                 customerName
//                             )}
//                         </h3>

//                         <p>
//                             <strong>Address:</strong>{" "}
//                             {getAddressText(shippingAddress)}
//                         </p>

//                         <p>
//                             <strong>Mobile:</strong>{" "}
//                             {firstValue(
//                                 shippingAddress.phone,
//                                 shippingAddress.mobile,
//                                 customerPhone
//                             )}
//                         </p>

//                         {shippingAddress.gstin && (
//                             <p>
//                                 <strong>GSTIN:</strong>{" "}
//                                 {shippingAddress.gstin}
//                             </p>
//                         )}

//                     </div>

//                 </div>

//                 {/* ==================================================
//                     PRODUCT TABLE
//                 ================================================== */}

//                 <div className="wkinv-table-wrap">

//                     <table className="wkinv-items-table">

//                         <thead>
//                             <tr>
//                                 <th className="wkinv-col-sno">
//                                     S.NO.
//                                 </th>

//                                 <th className="wkinv-col-product">
//                                     PRODUCT / DESCRIPTION
//                                 </th>

//                                 <th className="wkinv-col-hsn">
//                                     HSN/SAC
//                                 </th>

//                                 <th className="wkinv-col-qty">
//                                     QTY.
//                                 </th>

//                                 <th className="wkinv-col-rate">
//                                     RATE
//                                 </th>

//                                 <th className="wkinv-col-amount">
//                                     AMOUNT
//                                 </th>
//                             </tr>
//                         </thead>

//                         <tbody>

//                             {items.length === 0 ? (
//                                 <tr>
//                                     <td
//                                         colSpan="6"
//                                         className="wkinv-empty-cell"
//                                     >
//                                         No items found
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 items.map((item, index) => {

//                                     const quantity =
//                                         getItemQuantity(item);

//                                     const price =
//                                         getItemPrice(item);

//                                     const itemTotal =
//                                         getItemTotal(item);

//                                     const description =
//                                         getItemDescription(item);

//                                     return (
//                                         <tr
//                                             key={
//                                                 item._id ||
//                                                 item.product ||
//                                                 item.productId ||
//                                                 index
//                                             }
//                                         >

//                                             <td className="wkinv-center">
//                                                 {index + 1}
//                                             </td>

//                                             <td className="wkinv-product-cell">

//                                                 <strong>
//                                                     {getItemName(item)}
//                                                 </strong>

//                                                 {description && (
//                                                     <span className="wkinv-item-description">
//                                                         {description}
//                                                     </span>
//                                                 )}

//                                             </td>

//                                             <td className="wkinv-center">
//                                                 {getItemHsn(item)}
//                                             </td>

//                                             <td className="wkinv-center">
//                                                 {quantity}
//                                             </td>

//                                             <td className="wkinv-right">
//                                                 {formatCurrency(price)}
//                                             </td>

//                                             <td className="wkinv-right">
//                                                 {formatCurrency(itemTotal)}
//                                             </td>

//                                         </tr>
//                                     );
//                                 })
//                             )}

//                             {/* Keep a little writing/printing space,
//                                 similar to the requested invoice. */}
//                             {items.length > 0 && items.length < 5 && (
//                                 <tr className="wkinv-space-row">
//                                     <td colSpan="6">&nbsp;</td>
//                                 </tr>
//                             )}

//                         </tbody>

//                         <tfoot>

//                             <tr>
//                                 <td
//                                     colSpan="4"
//                                     className="wkinv-total-label"
//                                 >
//                                     TOTAL
//                                 </td>

//                                 <td className="wkinv-center">
//                                     {items.reduce(
//                                         (sum, item) =>
//                                             sum +
//                                             getItemQuantity(item),
//                                         0
//                                     )}
//                                 </td>

//                                 <td className="wkinv-right wkinv-total-value">
//                                     {formatCurrency(totalAmount)}
//                                 </td>
//                             </tr>

//                         </tfoot>

//                     </table>

//                 </div>

//                 {/* ==================================================
//                     TAX SUMMARY
//                 ================================================== */}

//                 <div className="wkinv-tax-summary">

//                     <table className="wkinv-tax-table">

//                         <thead>
//                             <tr>
//                                 <th rowSpan="2">HSN/SAC</th>
//                                 <th rowSpan="2">Taxable Value</th>
//                                 <th colSpan="2">CGST</th>
//                                 <th colSpan="2">SGST</th>
//                                 <th rowSpan="2">Total Tax</th>
//                             </tr>

//                             <tr>
//                                 <th>Rate</th>
//                                 <th>Amount</th>
//                                 <th>Rate</th>
//                                 <th>Amount</th>
//                             </tr>
//                         </thead>

//                         <tbody>

//                             {items.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="7">
//                                         -
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 items.map((item, index) => {

//                                     const itemTotal =
//                                         getItemTotal(item);

//                                     const itemTaxable =
//                                         safeNumber(
//                                             item.taxableValue ??
//                                             item.taxableAmount ??
//                                             itemTotal
//                                         );

//                                     const itemCgst =
//                                         safeNumber(
//                                             item.cgst ??
//                                             item.cgstAmount ??
//                                             0
//                                         );

//                                     const itemSgst =
//                                         safeNumber(
//                                             item.sgst ??
//                                             item.sgstAmount ??
//                                             0
//                                         );

//                                     const itemTotalTax =
//                                         safeNumber(
//                                             item.totalTax ??
//                                             item.taxAmount ??
//                                             itemCgst + itemSgst
//                                         );

//                                     const cgstRate =
//                                         firstValue(
//                                             item.cgstRate,
//                                             item.taxDetails?.cgstRate
//                                         );

//                                     const sgstRate =
//                                         firstValue(
//                                             item.sgstRate,
//                                             item.taxDetails?.sgstRate
//                                         );

//                                     return (
//                                         <tr
//                                             key={`tax-${item._id || index}`}
//                                         >
//                                             <td>
//                                                 {getItemHsn(item)}
//                                             </td>

//                                             <td>
//                                                 {formatCurrency(
//                                                     itemTaxable
//                                                 )}
//                                             </td>

//                                             <td>
//                                                 {cgstRate
//                                                     ? `${cgstRate}%`
//                                                     : "-"}
//                                             </td>

//                                             <td>
//                                                 {formatCurrency(
//                                                     itemCgst
//                                                 )}
//                                             </td>

//                                             <td>
//                                                 {sgstRate
//                                                     ? `${sgstRate}%`
//                                                     : "-"}
//                                             </td>

//                                             <td>
//                                                 {formatCurrency(
//                                                     itemSgst
//                                                 )}
//                                             </td>

//                                             <td>
//                                                 {formatCurrency(
//                                                     itemTotalTax
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     );
//                                 })
//                             )}

//                             <tr className="wkinv-tax-total-row">

//                                 <td>
//                                     <strong>Total</strong>
//                                 </td>

//                                 <td>
//                                     <strong>
//                                         {formatCurrency(
//                                             taxableAmount
//                                         )}
//                                     </strong>
//                                 </td>

//                                 <td>-</td>

//                                 <td>
//                                     <strong>
//                                         {formatCurrency(cgst)}
//                                     </strong>
//                                 </td>

//                                 <td>-</td>

//                                 <td>
//                                     <strong>
//                                         {formatCurrency(sgst)}
//                                     </strong>
//                                 </td>

//                                 <td>
//                                     <strong>
//                                         {formatCurrency(totalTax)}
//                                     </strong>
//                                 </td>

//                             </tr>

//                         </tbody>

//                     </table>

//                 </div>

//                 {/* ==================================================
//                     TOTALS
//                 ================================================== */}

//                 <div className="wkinv-summary-grid">

//                     <div className="wkinv-summary-left">

//                         <div className="wkinv-payment-card">

//                             <div className="wkinv-box-title">
//                                 PAYMENT DETAILS
//                             </div>

//                             <div className="wkinv-payment-row">
//                                 <span>Payment Method</span>
//                                 <strong>
//                                     {paymentMethod}
//                                 </strong>
//                             </div>

//                             <div className="wkinv-payment-row">
//                                 <span>Payment Status</span>
//                                 <strong>
//                                     {paymentStatus}
//                                 </strong>
//                             </div>

//                             <div className="wkinv-payment-row">
//                                 <span>Order Source</span>
//                                 <strong>
//                                     {String(orderSource).replaceAll(
//                                         "_",
//                                         " "
//                                     )}
//                                 </strong>
//                             </div>

//                         </div>

//                         <div className="wkinv-amount-words">

//                             <strong>
//                                 Total Amount (in words)
//                             </strong>

//                             <span>
//                                 {amountInWords(totalAmount)}
//                             </span>

//                         </div>

//                     </div>

//                     <div className="wkinv-grand-total-card">

//                         <div className="wkinv-grand-row">
//                             <span>Subtotal</span>
//                             <strong>
//                                 {formatCurrency(subtotal)}
//                             </strong>
//                         </div>

//                         <div className="wkinv-grand-row">
//                             <span>Discount</span>
//                             <strong>
//                                 {formatCurrency(discount)}
//                             </strong>
//                         </div>

//                         <div className="wkinv-grand-row">
//                             <span>Taxable Value</span>
//                             <strong>
//                                 {formatCurrency(taxableAmount)}
//                             </strong>
//                         </div>

//                         {igst > 0 && (
//                             <div className="wkinv-grand-row">
//                                 <span>IGST</span>
//                                 <strong>
//                                     {formatCurrency(igst)}
//                                 </strong>
//                             </div>
//                         )}

//                         <div className="wkinv-grand-row">
//                             <span>CGST</span>
//                             <strong>
//                                 {formatCurrency(cgst)}
//                             </strong>
//                         </div>

//                         <div className="wkinv-grand-row">
//                             <span>SGST</span>
//                             <strong>
//                                 {formatCurrency(sgst)}
//                             </strong>
//                         </div>

//                         <div className="wkinv-grand-divider" />

//                         <div className="wkinv-grand-row wkinv-final-row">
//                             <span>Grand Total</span>
//                             <strong>
//                                 {formatCurrency(totalAmount)}
//                             </strong>
//                         </div>

//                         <div className="wkinv-grand-row">
//                             <span>Paid</span>
//                             <strong>
//                                 {formatCurrency(paidAmount)}
//                             </strong>
//                         </div>

//                         <div className="wkinv-grand-row">
//                             <span>Balance</span>
//                             <strong>
//                                 {formatCurrency(balanceAmount)}
//                             </strong>
//                         </div>

//                     </div>

//                 </div>

//                 {/* ==================================================
//                     BANK + SIGNATURE
//                 ================================================== */}

//                 <div className="wkinv-bottom-grid">

//                     <div className="wkinv-bank-details">

//                         <div className="wkinv-bottom-title">
//                             Bank Details
//                         </div>

//                         <div className="wkinv-bank-row">
//                             <span>Name:</span>
//                             <strong>
//                                 {bankDetails.name}
//                             </strong>
//                         </div>

//                         <div className="wkinv-bank-row">
//                             <span>IFSC Code:</span>
//                             <strong>
//                                 {bankDetails.ifsc}
//                             </strong>
//                         </div>

//                         <div className="wkinv-bank-row">
//                             <span>Account No:</span>
//                             <strong>
//                                 {bankDetails.account}
//                             </strong>
//                         </div>

//                         <div className="wkinv-bank-row">
//                             <span>Bank:</span>
//                             <strong>
//                                 {bankDetails.bank}
//                             </strong>
//                         </div>

//                     </div>

//                     <div className="wkinv-authorized-sign">

//                         <div className="wkinv-sign-logo-box">
//                             {/* <img
//                                 src={zaidInfotechLogo}
//                                 alt="Zaid Infotech"
//                                 className="wkinv-sign-logo"
//                             /> */}
//                         </div>

//                         <div className="wkinv-sign-line">
//                             ______________________________
//                         </div>

//                         <strong>
//                             Authorised Signatory For
//                         </strong>

//                         <span>
//                             {company.name}
//                         </span>

//                     </div>

//                     <div className="wkinv-receiver-sign">

//                         <div className="wkinv-sign-line">
//                             ______________________________
//                         </div>

//                         <strong>
//                             Receiver's Signature
//                         </strong>

//                     </div>

//                 </div>

//                 {/* ==================================================
//                     FOOTER
//                 ================================================== */}

//                 <div className="wkinv-footer">

//                     <div>
//                         <strong>
//                             Thank You For Shopping With Us
//                         </strong>

//                         <span>
//                             {company.name}
//                         </span>
//                     </div>

//                     <div className="wkinv-footer-right">
//                         <span>
//                             This is a computer-generated invoice.
//                         </span>

//                         <span>
//                             {company.website}
//                         </span>
//                     </div>

//                 </div>

//                 {/* ==================================================
//                     BUTTONS
//                 ================================================== */}

//                 <div className="wkinv-buttons">

//                     <button
//                         type="button"
//                         className="wkinv-print-btn"
//                         onClick={printInvoice}
//                     >
//                         PRINT INVOICE
//                     </button>

//                     <button
//                         type="button"
//                         className="wkinv-close-btn"
//                         onClick={onClose}
//                     >
//                         CLOSE
//                     </button>

//                 </div>

//             </div>
//         </div>
//     );
// }

// export default WalkInInvoice;



import React from "react";
import "./WalkInInvoice.css";

// ============================================================
// WALK-IN INVOICE
// ============================================================
// Props/API behavior preserved:
//   <WalkInInvoice order={order} onClose={onClose} />
//
// Pricing:
// - New orders (order.gstAmount saved) -> saved breakdown
//   (subtotal, offer, coupon, taxable, GST, shipping, final)
// - Old orders/invoices -> original calculation (unchanged)
// ============================================================

import zaidInfotechLogo from "../../../../assets/images/zaidinfotechlogo.png";

// Company ka state (GST split ke liye).
// Customer ka state yahi ho ya khali ho -> CGST + SGST
// Alag state ho -> IGST
const COMPANY_STATE = "Tamil Nadu";

// ============================================================
// HELPERS
// ============================================================

const safeNumber = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
};

const round2 = (value) =>
    Math.round((safeNumber(value) + Number.EPSILON) * 100) / 100;

const formatCurrency = (value) => {
    return `₹ ${safeNumber(value).toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
};

const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const formatDateTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// ============================================================
// INDIAN RUPEE AMOUNT IN WORDS
// ============================================================

const numberToWordsBelow100 = (number) => {
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

const numberToIndianWords = (number) => {
    const value = Math.floor(Math.abs(safeNumber(number)));

    if (value === 0) {
        return "Zero";
    }

    const parts = [];

    const crore = Math.floor(value / 10000000);
    const lakh = Math.floor((value % 10000000) / 100000);
    const thousand = Math.floor((value % 100000) / 1000);
    const hundred = Math.floor((value % 1000) / 100);
    const remainder = value % 100;

    if (crore) {
        parts.push(`${numberToIndianWords(crore)} Crore`);
    }

    if (lakh) {
        parts.push(`${numberToIndianWords(lakh)} Lakh`);
    }

    if (thousand) {
        parts.push(`${numberToIndianWords(thousand)} Thousand`);
    }

    if (hundred) {
        parts.push(`${numberToIndianWords(hundred)} Hundred`);
    }

    if (remainder) {
        parts.push(numberToWordsBelow100(remainder));
    }

    return parts.join(" ");
};

const amountInWords = (amount) => {
    const value = safeNumber(amount);
    const rupees = Math.floor(value);
    const paise = Math.round((value - rupees) * 100);

    if (paise > 0) {
        return `${numberToIndianWords(rupees)} Rupees and ${numberToIndianWords(
            paise
        )} Paise Only`;
    }

    return `${numberToIndianWords(rupees)} Rupees Only`;
};

// ============================================================
// GENERIC FIELD HELPER
// ============================================================

const firstValue = (...values) => {
    return values.find(
        (value) =>
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
    );
};

const getFullName = (person = {}) => {
    if (!person) return "";

    return (
        firstValue(
            person.fullName,
            person.name,
            [person.firstName, person.lastName].filter(Boolean).join(" ")
        ) || ""
    );
};

const getAddressText = (address = {}) => {
    if (!address) return "-";

    const parts = [
        address.addressLine,
        address.address,
        address.address1,
        address.address2,
        address.street,
        address.locality,
        address.area,
        address.city,
        address.state,
        address.pincode,
        address.postalCode,
        address.zipCode,
    ].filter(Boolean);

    if (parts.length === 0) {
        return "-";
    }

    return parts.join(", ");
};

// Naye pricing breakdown wala order hai ya nahi
const hasBreakdown = (source) =>
    Boolean(source) &&
    typeof source === "object" &&
    source.gstAmount !== undefined &&
    source.gstAmount !== null;

// ============================================================
// COMPONENT
// ============================================================

function WalkInInvoice({ order, onClose }) {
    if (!order) {
        return null;
    }

    // ========================================================
    // PRINT
    // ========================================================

    const printInvoice = () => {
        try {
            const invoiceElement =
                document.querySelector(".wkinv-container");

            if (!invoiceElement) {
                alert("Invoice not found. Please try again.");
                return;
            }

            // -------------------------------------------------
            // HIDDEN PRINT IFRAME
            // -------------------------------------------------

            const printFrame = document.createElement("iframe");

            printFrame.setAttribute("title", "Walk-In Invoice Print");

            printFrame.style.position = "fixed";
            printFrame.style.right = "0";
            printFrame.style.bottom = "0";
            printFrame.style.width = "0";
            printFrame.style.height = "0";
            printFrame.style.border = "0";
            printFrame.style.opacity = "0";
            printFrame.style.pointerEvents = "none";

            document.body.appendChild(printFrame);

            const printDocument =
                printFrame.contentDocument ||
                printFrame.contentWindow.document;

            printDocument.open();

            printDocument.write(`
                <!DOCTYPE html>
                <html>
                <head>

                    <meta charset="UTF-8" />

                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />

                    <title>
                        Walk-In Invoice - ${invoiceNumber}
                    </title>

                    <style>

                        html,
                        body {
                            margin: 0 !important;
                            padding: 0 !important;
                            width: 100% !important;
                            min-height: 100% !important;
                            background: #ffffff !important;
                            color: #111111 !important;
                            font-family: Arial, Helvetica, sans-serif !important;
                        }

                        body,
                        body * {
                            visibility: visible !important;
                            opacity: 1 !important;
                        }

                        .wkinv-container {
                            display: block !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                            width: 100% !important;
                            max-width: 190mm !important;
                            min-width: 0 !important;
                            margin: 0 auto !important;
                            padding: 5mm !important;
                            box-sizing: border-box !important;
                            background: #ffffff !important;
                            color: #111111 !important;
                            border: 0 !important;
                            border-radius: 0 !important;
                            box-shadow: none !important;
                            overflow: visible !important;
                        }

                        .wkinv-container,
                        .wkinv-container *,
                        .wkinv-container *::before,
                        .wkinv-container *::after {
                            visibility: visible !important;
                            opacity: 1 !important;
                        }

                        .wkinv-container h1,
                        .wkinv-container h2,
                        .wkinv-container h3,
                        .wkinv-container h4,
                        .wkinv-container h5,
                        .wkinv-container h6,
                        .wkinv-container p,
                        .wkinv-container span,
                        .wkinv-container strong,
                        .wkinv-container div,
                        .wkinv-container td,
                        .wkinv-container th {
                            color: #111111 !important;
                        }

                        .wkinv-company-logo,
                        .wkinv-sign-logo {
                            display: block !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                            max-width: 100% !important;
                            object-fit: contain !important;
                        }

                        .wkinv-buttons {
                            display: none !important;
                            visibility: hidden !important;
                        }

                        .wkinv-table-wrap,
                        .wkinv-tax-summary {
                            width: 100% !important;
                            overflow: visible !important;
                        }

                        .wkinv-items-table,
                        .wkinv-tax-table {
                            width: 100% !important;
                            border-collapse: collapse !important;
                            border-spacing: 0 !important;
                        }

                        .wkinv-items-table th,
                        .wkinv-items-table td,
                        .wkinv-tax-table th,
                        .wkinv-tax-table td {
                            visibility: visible !important;
                            opacity: 1 !important;
                        }

                        .wkinv-document-top,
                        .wkinv-company-header,
                        .wkinv-address-grid,
                        .wkinv-table-wrap,
                        .wkinv-tax-summary,
                        .wkinv-summary-grid,
                        .wkinv-bottom-grid,
                        .wkinv-footer {
                            break-inside: avoid !important;
                            page-break-inside: avoid !important;
                        }

                        tr {
                            break-inside: avoid !important;
                            page-break-inside: avoid !important;
                        }

                        @page {
                            size: A4 portrait;
                            margin: 7mm;
                        }

                    </style>

                </head>

                <body>

                    <div id="print-root"></div>

                </body>

                </html>
            `);

            printDocument.close();

            // -------------------------------------------------
            // COPY ALL CURRENT STYLES
            // -------------------------------------------------

            const currentStyles = Array.from(
                document.querySelectorAll('style, link[rel="stylesheet"]')
            );

            currentStyles.forEach((styleNode) => {
                try {
                    const clonedStyle = styleNode.cloneNode(true);

                    printDocument.head.appendChild(clonedStyle);
                } catch (error) {
                    console.warn("Unable to copy stylesheet:", error);
                }
            });

            // -------------------------------------------------
            // CLONE ONLY INVOICE
            // -------------------------------------------------

            const invoiceClone = invoiceElement.cloneNode(true);

            invoiceClone
                .querySelectorAll(".wkinv-buttons")
                .forEach((element) => {
                    element.remove();
                });

            invoiceClone.querySelectorAll("*").forEach((element) => {
                element.style.visibility = "visible";
                element.style.opacity = "1";
            });

            const printRoot = printDocument.getElementById("print-root");

            printRoot.appendChild(invoiceClone);

            // -------------------------------------------------
            // FINAL PRINT CSS
            // -------------------------------------------------

            const finalPrintStyle = printDocument.createElement("style");

            finalPrintStyle.textContent = `

                html,
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                    min-height: 100% !important;
                    background: #ffffff !important;
                    color: #111111 !important;
                }

                body,
                body * {
                    visibility: visible !important;
                    opacity: 1 !important;
                }

                #print-root {
                    display: block !important;
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: #ffffff !important;
                }

                .wkinv-container {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    width: 100% !important;
                    max-width: 190mm !important;
                    margin: 0 auto !important;
                    padding: 5mm !important;
                    box-sizing: border-box !important;
                    background: #ffffff !important;
                    color: #111111 !important;
                    border: none !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                    overflow: visible !important;
                }

                .wkinv-container * {
                    visibility: visible !important;
                    opacity: 1 !important;
                }

                .wkinv-buttons {
                    display: none !important;
                    visibility: hidden !important;
                }

                .wkinv-company-logo,
                .wkinv-sign-logo {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                }

                .wkinv-items-table,
                .wkinv-tax-table {
                    width: 100% !important;
                    border-collapse: collapse !important;
                }

                .wkinv-items-table thead,
                .wkinv-tax-table thead {
                    display: table-header-group !important;
                }

                .wkinv-items-table tr,
                .wkinv-tax-table tr {
                    break-inside: avoid !important;
                    page-break-inside: avoid !important;
                }

                @page {
                    size: A4 portrait;
                    margin: 7mm;
                }

            `;

            printDocument.head.appendChild(finalPrintStyle);

            // -------------------------------------------------
            // WAIT FOR IMAGES + FONTS
            // -------------------------------------------------

            const images = Array.from(printDocument.images);

            const waitForImages = images.map((image) => {
                return new Promise((resolve) => {
                    if (image.complete) {
                        resolve();
                        return;
                    }

                    image.onload = resolve;
                    image.onerror = resolve;
                });
            });

            const waitForFonts =
                printDocument.fonts && printDocument.fonts.ready
                    ? printDocument.fonts.ready
                    : Promise.resolve();

            Promise.all([...waitForImages, waitForFonts]).then(() => {
                setTimeout(() => {
                    try {
                        printFrame.contentWindow.focus();
                        printFrame.contentWindow.print();
                    } finally {
                        /*
                         * Do NOT immediately remove iframe.
                         * Some browsers need it during printing.
                         */
                        setTimeout(() => {
                            if (printFrame && printFrame.parentNode) {
                                printFrame.parentNode.removeChild(printFrame);
                            }
                        }, 1500);
                    }
                }, 500);
            });

        } catch (error) {
            console.error("WALK-IN INVOICE PRINT ERROR:", error);

            alert("Unable to print invoice. Please try again.");
        }
    };

    // ========================================================
    // SUPPORT BOTH:
    // 1. CREATED ORDER
    // 2. CREATED INVOICE
    // ========================================================

    const isInvoice = Boolean(
        order.invoiceNumber ||
        order.invoiceFor
    );

    // Keep this variable intentionally available because the
    // original component supported both order and invoice data.
    void isInvoice;

    // ========================================================
    // CUSTOMER / BILLING / SHIPPING
    // ========================================================

    const customer =
        order.billingAddress ||
        order.shippingAddress ||
        order.customer ||
        {};

    const shippingAddress =
        order.shippingAddress ||
        order.billingAddress ||
        order.customer ||
        {};

    const customerName =
        firstValue(
            customer.fullName,
            customer.name,
            getFullName(order.customer),
            getFullName(order.user),
            order.customerName,
            order.userName
        ) || "Walk-In Customer";

    const customerPhone =
        firstValue(
            customer.phone,
            customer.mobile,
            customer.phoneNumber,
            order.customerPhone,
            order.phone,
            order.mobile
        ) || "-";

    const customerEmail =
        firstValue(
            customer.email,
            order.customerEmail,
            order.email
        ) || "";

    // ========================================================
    // ITEMS
    // ========================================================

    const items = Array.isArray(order.items)
        ? order.items
        : Array.isArray(order.orderItems)
        ? order.orderItems
        : [];

    // ========================================================
    // INVOICE DETAILS
    // ========================================================

    const invoiceNumber =
        firstValue(
            order.invoiceNumber,
            order.invoiceNo,
            order.invoice_id,
            order._id
        ) || "N/A";

    const invoiceDate =
        order.invoiceDate ||
        order.createdAt ||
        new Date();

    const dueDate =
        order.dueDate ||
        order.paymentDueDate ||
        invoiceDate;

    const orderSource =
        order.orderSource ||
        order.source ||
        "WALK_IN";

    const paymentMethod =
        order.paymentMethod ||
        order.payment_mode ||
        "CASH";

    const paymentStatus =
        order.paymentStatus ||
        order.payment_status ||
        "PAID";

    // ========================================================
    // ITEM HELPERS
    // ========================================================

    const getItemName = (item) => {
        return (
            firstValue(
                item.title,
                item.name,
                item.productName,
                item.product?.title,
                item.product?.name,
                item.product?.productName
            ) || "Product"
        );
    };

    const getItemDescription = (item) => {
        return firstValue(
            item.description,
            item.product?.description
        ) || "";
    };

    const getItemHsn = (item) => {
        return firstValue(
            item.hsnSac,
            item.hsn,
            item.sac,
            item.hsnCode,
            item.product?.hsnSac,
            item.product?.hsn,
            item.product?.sac
        ) || "-";
    };

    const getItemQuantity = (item) => {
        return safeNumber(
            item.quantity ??
            item.qty ??
            1,
            1
        );
    };

    const getItemPrice = (item) => {
        return safeNumber(
            item.price ??
            item.originalPrice ??
            item.unitPrice ??
            item.rate ??
            item.product?.price ??
            0
        );
    };

    const getItemTotal = (item) => {
        const quantity = getItemQuantity(item);
        const price = getItemPrice(item);

        return safeNumber(
            item.total ??
            item.itemTotal ??
            item.amount ??
            price * quantity
        );
    };

    // ========================================================
    // TOTALS
    //
    // Naye order  -> saved breakdown (order ya invoice.order me)
    // Purane order -> original calculation (unchanged)
    // ========================================================

    const priceSource = hasBreakdown(order)
        ? order
        : hasBreakdown(order.order)
        ? order.order
        : null;

    const isNewPricing = Boolean(priceSource);

    // ---------- common ----------

    let subtotal = 0;
    let discount = 0;
    let offerDiscount = 0;
    let couponDiscount = 0;
    let couponCode = "";
    let taxableAmount = 0;
    let gstPercentage = 18;
    let shippingCharge = 0;
    let otherCharges = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    let totalTax = 0;
    let totalAmount = 0;
    let paidAmount = 0;
    let balanceAmount = 0;
    let isIntraState = true;

    if (isNewPricing) {

        // ----------------------------------------------------
        // NEW ORDER: SAVED BREAKDOWN
        // ----------------------------------------------------

        subtotal = safeNumber(priceSource.subtotal);

        offerDiscount = safeNumber(priceSource.offerDiscount);

        couponDiscount = safeNumber(priceSource.couponDiscount);

        couponCode = priceSource.couponCode || "";

        taxableAmount = safeNumber(priceSource.taxableAmount);

        gstPercentage = safeNumber(priceSource.gstPercentage, 18);

        const gstAmount = safeNumber(priceSource.gstAmount);

        shippingCharge = safeNumber(priceSource.shippingCharge);

        otherCharges = safeNumber(priceSource.otherCharges);

        // ----- CGST+SGST ya IGST -----

        const customerState = String(
            firstValue(
                shippingAddress.state,
                customer.state
            ) || ""
        )
            .trim()
            .toLowerCase();

        isIntraState =
            !customerState ||
            customerState.includes(
                COMPANY_STATE.toLowerCase()
            );

        if (isIntraState) {
            cgst = round2(gstAmount / 2);
            sgst = round2(gstAmount - cgst);
            igst = 0;
        } else {
            cgst = 0;
            sgst = 0;
            igst = gstAmount;
        }

        totalTax = gstAmount;

        totalAmount = safeNumber(
            priceSource.finalAmount,
            taxableAmount +
            gstAmount +
            shippingCharge +
            otherCharges
        );

        const isPaid = ["PAID", "SUCCESS", "COMPLETED"].includes(
            String(paymentStatus).toUpperCase()
        );

        paidAmount = isPaid
            ? totalAmount
            : safeNumber(priceSource.paidAmount ?? order.paidAmount);

        balanceAmount = Math.max(
            round2(totalAmount - paidAmount),
            0
        );

    } else {

        // ----------------------------------------------------
        // OLD ORDER / INVOICE: ORIGINAL CALCULATION
        // ----------------------------------------------------

        subtotal = safeNumber(
            order.subtotal ??
            order.subTotal ??
            order.totalBeforeDiscount ??
            order.totalAmount ??
            0
        );

        discount = safeNumber(
            order.discount ??
            order.discountAmount ??
            0
        );

        taxableAmount = safeNumber(
            order.taxableAmount ??
            order.taxableValue ??
            Math.max(subtotal - discount, 0)
        );

        cgst = safeNumber(
            order.cgst ??
            order.cgstAmount ??
            order.taxDetails?.cgstAmount ??
            0
        );

        sgst = safeNumber(
            order.sgst ??
            order.sgstAmount ??
            order.taxDetails?.sgstAmount ??
            0
        );

        igst = safeNumber(
            order.igst ??
            order.igstAmount ??
            order.taxDetails?.igstAmount ??
            0
        );

        totalTax = safeNumber(
            order.totalTax ??
            order.taxAmount ??
            cgst + sgst + igst
        );

        totalAmount = safeNumber(
            order.totalAmount ??
            order.grandTotal ??
            order.finalAmount ??
            taxableAmount + totalTax
        );

        paidAmount = safeNumber(
            order.paidAmount ??
            (
                paymentStatus === "PAID"
                    ? totalAmount
                    : 0
            )
        );

        balanceAmount = safeNumber(
            order.balanceAmount ??
            Math.max(totalAmount - paidAmount, 0)
        );
    }

    // ========================================================
    // ITEMS TOTAL (table footer)
    // ========================================================

    const itemsTotal = round2(
        items.reduce(
            (sum, item) => sum + getItemTotal(item),
            0
        )
    );

    // ========================================================
    // TAX TABLE ROWS
    // ========================================================

    let taxRows = [];

    if (isNewPricing) {

        // coupon ko items me proportionally baanto,
        // phir har item par GST nikalo

        const lineAmounts = items.map((item) =>
            getItemTotal(item)
        );

        const sumLines = lineAmounts.reduce(
            (sum, value) => sum + value,
            0
        );

        taxRows = items.map((item, index) => {

            const line = lineAmounts[index];

            const couponShare =
                sumLines > 0
                    ? round2(
                        (couponDiscount * line) / sumLines
                    )
                    : 0;

            const taxable = Math.max(
                round2(line - couponShare),
                0
            );

            const gst = round2(
                (taxable * gstPercentage) / 100
            );

            return {
                hsn: getItemHsn(item),
                taxable,
                gst,
            };
        });

        // ----- paisa ka farak last row me adjust -----

        if (taxRows.length > 0) {

            const sumTaxable = taxRows.reduce(
                (sum, row) => sum + row.taxable,
                0
            );

            const sumGst = taxRows.reduce(
                (sum, row) => sum + row.gst,
                0
            );

            const last = taxRows[taxRows.length - 1];

            last.taxable = Math.max(
                round2(last.taxable + (taxableAmount - sumTaxable)),
                0
            );

            last.gst = Math.max(
                round2(last.gst + (totalTax - sumGst)),
                0
            );
        }

        taxRows = taxRows.map((row) => {

            const rowCgst = isIntraState
                ? round2(row.gst / 2)
                : 0;

            const rowSgst = isIntraState
                ? round2(row.gst - rowCgst)
                : 0;

            const rowIgst = isIntraState
                ? 0
                : row.gst;

            return {
                hsn: row.hsn,
                taxable: row.taxable,
                cgstRate: isIntraState ? gstPercentage / 2 : "",
                cgst: rowCgst,
                sgstRate: isIntraState ? gstPercentage / 2 : "",
                sgst: rowSgst,
                igstRate: isIntraState ? "" : gstPercentage,
                igst: rowIgst,
                totalTax: row.gst,
            };
        });

    } else {

        // ----- OLD: original per-item logic -----

        taxRows = items.map((item) => {

            const itemTotal = getItemTotal(item);

            const itemCgst = safeNumber(
                item.cgst ??
                item.cgstAmount ??
                0
            );

            const itemSgst = safeNumber(
                item.sgst ??
                item.sgstAmount ??
                0
            );

            return {
                hsn: getItemHsn(item),
                taxable: safeNumber(
                    item.taxableValue ??
                    item.taxableAmount ??
                    itemTotal
                ),
                cgstRate: firstValue(
                    item.cgstRate,
                    item.taxDetails?.cgstRate
                ) || "",
                cgst: itemCgst,
                sgstRate: firstValue(
                    item.sgstRate,
                    item.taxDetails?.sgstRate
                ) || "",
                sgst: itemSgst,
                igstRate: "",
                igst: 0,
                totalTax: safeNumber(
                    item.totalTax ??
                    item.taxAmount ??
                    itemCgst + itemSgst
                ),
            };
        });
    }

    // IGST columns sirf naye order + dusre state ke liye
    const showIgstColumns =
        isNewPricing && !isIntraState;

    // ========================================================
    // COMPANY DETAILS
    // ========================================================

    const company = {
        name: "ZAID INFOTECH",
        address:
            "No 232, 1st Floor, M.K.N. Road, Alandur, Chennai, Tamil Nadu, 600016",
        gstin: "33AIOPFB710C1ZL",
        pan: "AIOPFB710C",
        mobile: "9092590725",
        email: "info@zaidinfotech.in",
        website: "www.zaidinfotech.in",
        tagline: "Affordable Tech for Everyone",
    };

    const bankDetails = {
        name: "ZAID INFOTECH",
        ifsc: "KVBL0001104",
        account: "1104011000000054",
        bank:
            "Karur Vysya Bank, CHENNAI ALANDUR",
    };

    // ========================================================
    // RETURN
    // ========================================================

    return (
        <div
            className="wkinv-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Walk-in invoice"
        >
            <div className="wkinv-container">

                {/* ==================================================
                    TOP LABEL
                ================================================== */}

                <div className="wkinv-document-top">
                    <span className="wkinv-document-title">
                        TAX INVOICE
                    </span>

                    <span className="wkinv-recipient-label">
                        ORIGINAL FOR RECIPIENT
                    </span>

                    <span className="wkinv-tagline">
                        “{company.tagline}”
                    </span>
                </div>

                {/* ==================================================
                    COMPANY HEADER
                ================================================== */}

                <div className="wkinv-company-header">

                    <div className="wkinv-company-left">

                        <div className="wkinv-logo-wrap">
                            <img
                                src={zaidInfotechLogo}
                                alt="Zaid Infotech Logo"
                                className="wkinv-company-logo"
                            />
                        </div>

                        <div className="wkinv-company-details">

                            <h1 className="wkinv-company-name">
                                {company.name}
                            </h1>

                            <p className="wkinv-company-address">
                                {company.address}
                            </p>

                            <div className="wkinv-company-meta-grid">

                                <p>
                                    <strong>GSTIN:</strong>{" "}
                                    {company.gstin}
                                </p>

                                <p>
                                    <strong>Mobile:</strong>{" "}
                                    {company.mobile}
                                </p>

                                <p>
                                    <strong>PAN:</strong>{" "}
                                    {company.pan}
                                </p>

                                <p>
                                    <strong>Email:</strong>{" "}
                                    {company.email}
                                </p>

                                <p className="wkinv-company-website">
                                    <strong>Website:</strong>{" "}
                                    {company.website}
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="wkinv-invoice-meta">

                        <div className="wkinv-meta-row">
                            <span>Invoice No.</span>
                            <strong>{invoiceNumber}</strong>
                        </div>

                        <div className="wkinv-meta-row">
                            <span>Invoice Date</span>
                            <strong>
                                {formatDate(invoiceDate)}
                            </strong>
                        </div>

                        <div className="wkinv-meta-row">
                            <span>Due Date</span>
                            <strong>
                                {formatDate(dueDate)}
                            </strong>
                        </div>

                        <div className="wkinv-meta-row">
                            <span>Invoice Type</span>
                            <strong>
                                {String(orderSource).replaceAll("_", " ")}
                            </strong>
                        </div>

                    </div>

                </div>

                {/* ==================================================
                    BILL TO / SHIP TO
                ================================================== */}

                <div className="wkinv-address-grid">

                    <div className="wkinv-address-box">

                        <div className="wkinv-box-title">
                            BILL TO
                        </div>

                        <h3 className="wkinv-customer-name">
                            {customerName}
                        </h3>

                        <p>
                            <strong>Address:</strong>{" "}
                            {getAddressText(customer)}
                        </p>

                        <p>
                            <strong>Mobile:</strong>{" "}
                            {customerPhone}
                        </p>

                        {customerEmail && (
                            <p>
                                <strong>Email:</strong>{" "}
                                {customerEmail}
                            </p>
                        )}

                        {customer.gstin && (
                            <p>
                                <strong>GSTIN:</strong>{" "}
                                {customer.gstin}
                            </p>
                        )}

                    </div>

                    <div className="wkinv-address-box">

                        <div className="wkinv-box-title">
                            SHIP TO
                        </div>

                        <h3 className="wkinv-customer-name">
                            {firstValue(
                                shippingAddress.fullName,
                                shippingAddress.name,
                                customerName
                            )}
                        </h3>

                        <p>
                            <strong>Address:</strong>{" "}
                            {getAddressText(shippingAddress)}
                        </p>

                        <p>
                            <strong>Mobile:</strong>{" "}
                            {firstValue(
                                shippingAddress.phone,
                                shippingAddress.mobile,
                                customerPhone
                            )}
                        </p>

                        {shippingAddress.gstin && (
                            <p>
                                <strong>GSTIN:</strong>{" "}
                                {shippingAddress.gstin}
                            </p>
                        )}

                    </div>

                </div>

                {/* ==================================================
                    PRODUCT TABLE
                ================================================== */}

                <div className="wkinv-table-wrap">

                    <table className="wkinv-items-table">

                        <thead>
                            <tr>
                                <th className="wkinv-col-sno">
                                    S.NO.
                                </th>

                                <th className="wkinv-col-product">
                                    PRODUCT / DESCRIPTION
                                </th>

                                <th className="wkinv-col-hsn">
                                    HSN/SAC
                                </th>

                                <th className="wkinv-col-qty">
                                    QTY.
                                </th>

                                <th className="wkinv-col-rate">
                                    RATE
                                </th>

                                <th className="wkinv-col-amount">
                                    AMOUNT
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {items.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="wkinv-empty-cell"
                                    >
                                        No items found
                                    </td>
                                </tr>
                            ) : (
                                items.map((item, index) => {

                                    const quantity =
                                        getItemQuantity(item);

                                    const price =
                                        getItemPrice(item);

                                    const itemTotal =
                                        getItemTotal(item);

                                    const description =
                                        getItemDescription(item);

                                    return (
                                        <tr
                                            key={
                                                item._id ||
                                                item.product ||
                                                item.productId ||
                                                index
                                            }
                                        >

                                            <td className="wkinv-center">
                                                {index + 1}
                                            </td>

                                            <td className="wkinv-product-cell">

                                                <strong>
                                                    {getItemName(item)}
                                                </strong>

                                                {description && (
                                                    <span className="wkinv-item-description">
                                                        {description}
                                                    </span>
                                                )}

                                            </td>

                                            <td className="wkinv-center">
                                                {getItemHsn(item)}
                                            </td>

                                            <td className="wkinv-center">
                                                {quantity}
                                            </td>

                                            <td className="wkinv-right">
                                                {formatCurrency(price)}
                                            </td>

                                            <td className="wkinv-right">
                                                {formatCurrency(itemTotal)}
                                            </td>

                                        </tr>
                                    );
                                })
                            )}

                            {/* Keep a little writing/printing space,
                                similar to the requested invoice. */}
                            {items.length > 0 && items.length < 5 && (
                                <tr className="wkinv-space-row">
                                    <td colSpan="6">&nbsp;</td>
                                </tr>
                            )}

                        </tbody>

                        <tfoot>

                            <tr>
                                <td
                                    colSpan="4"
                                    className="wkinv-total-label"
                                >
                                    TOTAL
                                </td>

                                <td className="wkinv-center">
                                    {items.reduce(
                                        (sum, item) =>
                                            sum +
                                            getItemQuantity(item),
                                        0
                                    )}
                                </td>

                                <td className="wkinv-right wkinv-total-value">
                                    {formatCurrency(
                                        isNewPricing
                                            ? itemsTotal
                                            : totalAmount
                                    )}
                                </td>
                            </tr>

                        </tfoot>

                    </table>

                </div>

                {/* ==================================================
                    TAX SUMMARY
                ================================================== */}

                <div className="wkinv-tax-summary">

                    <table className="wkinv-tax-table">

                        <thead>
                            <tr>
                                <th rowSpan="2">HSN/SAC</th>
                                <th rowSpan="2">Taxable Value</th>

                                {showIgstColumns ? (
                                    <th colSpan="2">IGST</th>
                                ) : (
                                    <>
                                        <th colSpan="2">CGST</th>
                                        <th colSpan="2">SGST</th>
                                    </>
                                )}

                                <th rowSpan="2">Total Tax</th>
                            </tr>

                            <tr>
                                {showIgstColumns ? (
                                    <>
                                        <th>Rate</th>
                                        <th>Amount</th>
                                    </>
                                ) : (
                                    <>
                                        <th>Rate</th>
                                        <th>Amount</th>
                                        <th>Rate</th>
                                        <th>Amount</th>
                                    </>
                                )}
                            </tr>
                        </thead>

                        <tbody>

                            {taxRows.length === 0 ? (
                                <tr>
                                    <td colSpan={showIgstColumns ? 5 : 7}>
                                        -
                                    </td>
                                </tr>
                            ) : (
                                taxRows.map((row, index) => (
                                    <tr
                                        key={`tax-${items[index]?._id || index}`}
                                    >
                                        <td>
                                            {row.hsn}
                                        </td>

                                        <td>
                                            {formatCurrency(
                                                row.taxable
                                            )}
                                        </td>

                                        {showIgstColumns ? (
                                            <>
                                                <td>
                                                    {row.igstRate !== ""
                                                        ? `${row.igstRate}%`
                                                        : "-"}
                                                </td>

                                                <td>
                                                    {formatCurrency(
                                                        row.igst
                                                    )}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>
                                                    {row.cgstRate !== ""
                                                        ? `${row.cgstRate}%`
                                                        : "-"}
                                                </td>

                                                <td>
                                                    {formatCurrency(
                                                        row.cgst
                                                    )}
                                                </td>

                                                <td>
                                                    {row.sgstRate !== ""
                                                        ? `${row.sgstRate}%`
                                                        : "-"}
                                                </td>

                                                <td>
                                                    {formatCurrency(
                                                        row.sgst
                                                    )}
                                                </td>
                                            </>
                                        )}

                                        <td>
                                            {formatCurrency(
                                                row.totalTax
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}

                            <tr className="wkinv-tax-total-row">

                                <td>
                                    <strong>Total</strong>
                                </td>

                                <td>
                                    <strong>
                                        {formatCurrency(
                                            taxableAmount
                                        )}
                                    </strong>
                                </td>

                                {showIgstColumns ? (
                                    <>
                                        <td>-</td>

                                        <td>
                                            <strong>
                                                {formatCurrency(igst)}
                                            </strong>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>-</td>

                                        <td>
                                            <strong>
                                                {formatCurrency(cgst)}
                                            </strong>
                                        </td>

                                        <td>-</td>

                                        <td>
                                            <strong>
                                                {formatCurrency(sgst)}
                                            </strong>
                                        </td>
                                    </>
                                )}

                                <td>
                                    <strong>
                                        {formatCurrency(totalTax)}
                                    </strong>
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

                {/* ==================================================
                    TOTALS
                ================================================== */}

                <div className="wkinv-summary-grid">

                    <div className="wkinv-summary-left">

                        <div className="wkinv-payment-card">

                            <div className="wkinv-box-title">
                                PAYMENT DETAILS
                            </div>

                            <div className="wkinv-payment-row">
                                <span>Payment Method</span>
                                <strong>
                                    {paymentMethod}
                                </strong>
                            </div>

                            <div className="wkinv-payment-row">
                                <span>Payment Status</span>
                                <strong>
                                    {paymentStatus}
                                </strong>
                            </div>

                            <div className="wkinv-payment-row">
                                <span>Order Source</span>
                                <strong>
                                    {String(orderSource).replaceAll(
                                        "_",
                                        " "
                                    )}
                                </strong>
                            </div>

                        </div>

                        <div className="wkinv-amount-words">

                            <strong>
                                Total Amount (in words)
                            </strong>

                            <span>
                                {amountInWords(totalAmount)}
                            </span>

                        </div>

                    </div>

                    <div className="wkinv-grand-total-card">

                        <div className="wkinv-grand-row">
                            <span>Subtotal</span>
                            <strong>
                                {formatCurrency(subtotal)}
                            </strong>
                        </div>

                        {isNewPricing ? (
                            <>

                                {offerDiscount > 0 && (
                                    <div className="wkinv-grand-row">
                                        <span>Offer Discount</span>
                                        <strong>
                                            - {formatCurrency(offerDiscount)}
                                        </strong>
                                    </div>
                                )}

                                {couponDiscount > 0 && (
                                    <div className="wkinv-grand-row">
                                        <span>
                                            Coupon Discount
                                            {couponCode
                                                ? ` (${couponCode})`
                                                : ""}
                                        </span>
                                        <strong>
                                            - {formatCurrency(couponDiscount)}
                                        </strong>
                                    </div>
                                )}

                            </>
                        ) : (
                            <div className="wkinv-grand-row">
                                <span>Discount</span>
                                <strong>
                                    {formatCurrency(discount)}
                                </strong>
                            </div>
                        )}

                        <div className="wkinv-grand-row">
                            <span>Taxable Value</span>
                            <strong>
                                {formatCurrency(taxableAmount)}
                            </strong>
                        </div>

                        {isNewPricing ? (
                            <>

                                {showIgstColumns ? (
                                    <div className="wkinv-grand-row">
                                        <span>IGST ({gstPercentage}%)</span>
                                        <strong>
                                            {formatCurrency(igst)}
                                        </strong>
                                    </div>
                                ) : (
                                    <>
                                        <div className="wkinv-grand-row">
                                            <span>
                                                CGST ({gstPercentage / 2}%)
                                            </span>
                                            <strong>
                                                {formatCurrency(cgst)}
                                            </strong>
                                        </div>

                                        <div className="wkinv-grand-row">
                                            <span>
                                                SGST ({gstPercentage / 2}%)
                                            </span>
                                            <strong>
                                                {formatCurrency(sgst)}
                                            </strong>
                                        </div>
                                    </>
                                )}

                                <div className="wkinv-grand-row">
                                    <span>Shipping</span>
                                    <strong>
                                        {shippingCharge > 0
                                            ? formatCurrency(shippingCharge)
                                            : "Free"}
                                    </strong>
                                </div>

                                {otherCharges > 0 && (
                                    <div className="wkinv-grand-row">
                                        <span>Other Charges</span>
                                        <strong>
                                            {formatCurrency(otherCharges)}
                                        </strong>
                                    </div>
                                )}

                            </>
                        ) : (
                            <>

                                {igst > 0 && (
                                    <div className="wkinv-grand-row">
                                        <span>IGST</span>
                                        <strong>
                                            {formatCurrency(igst)}
                                        </strong>
                                    </div>
                                )}

                                <div className="wkinv-grand-row">
                                    <span>CGST</span>
                                    <strong>
                                        {formatCurrency(cgst)}
                                    </strong>
                                </div>

                                <div className="wkinv-grand-row">
                                    <span>SGST</span>
                                    <strong>
                                        {formatCurrency(sgst)}
                                    </strong>
                                </div>

                            </>
                        )}

                        <div className="wkinv-grand-divider" />

                        <div className="wkinv-grand-row wkinv-final-row">
                            <span>Grand Total</span>
                            <strong>
                                {formatCurrency(totalAmount)}
                            </strong>
                        </div>

                        <div className="wkinv-grand-row">
                            <span>Paid</span>
                            <strong>
                                {formatCurrency(paidAmount)}
                            </strong>
                        </div>

                        <div className="wkinv-grand-row">
                            <span>Balance</span>
                            <strong>
                                {formatCurrency(balanceAmount)}
                            </strong>
                        </div>

                    </div>

                </div>

                {/* ==================================================
                    BANK + SIGNATURE
                ================================================== */}

                <div className="wkinv-bottom-grid">

                    <div className="wkinv-bank-details">

                        <div className="wkinv-bottom-title">
                            Bank Details
                        </div>

                        <div className="wkinv-bank-row">
                            <span>Name:</span>
                            <strong>
                                {bankDetails.name}
                            </strong>
                        </div>

                        <div className="wkinv-bank-row">
                            <span>IFSC Code:</span>
                            <strong>
                                {bankDetails.ifsc}
                            </strong>
                        </div>

                        <div className="wkinv-bank-row">
                            <span>Account No:</span>
                            <strong>
                                {bankDetails.account}
                            </strong>
                        </div>

                        <div className="wkinv-bank-row">
                            <span>Bank:</span>
                            <strong>
                                {bankDetails.bank}
                            </strong>
                        </div>

                    </div>

                    <div className="wkinv-authorized-sign">

                        <div className="wkinv-sign-logo-box">
                            {/* <img
                                src={zaidInfotechLogo}
                                alt="Zaid Infotech"
                                className="wkinv-sign-logo"
                            /> */}
                        </div>

                        <div className="wkinv-sign-line">
                            ______________________________
                        </div>

                        <strong>
                            Authorised Signatory For
                        </strong>

                        <span>
                            {company.name}
                        </span>

                    </div>

                    <div className="wkinv-receiver-sign">

                        <div className="wkinv-sign-line">
                            ______________________________
                        </div>

                        <strong>
                            Receiver's Signature
                        </strong>

                    </div>

                </div>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div className="wkinv-footer">

                    <div>
                        <strong>
                            Thank You For Shopping With Us
                        </strong>

                        <span>
                            {company.name}
                        </span>
                    </div>

                    <div className="wkinv-footer-right">
                        <span>
                            This is a computer-generated invoice.
                        </span>

                        <span>
                            {company.website}
                        </span>
                    </div>

                </div>

                {/* ==================================================
                    BUTTONS
                ================================================== */}

                <div className="wkinv-buttons">

                    <button
                        type="button"
                        className="wkinv-print-btn"
                        onClick={printInvoice}
                    >
                        PRINT INVOICE
                    </button>

                    <button
                        type="button"
                        className="wkinv-close-btn"
                        onClick={onClose}
                    >
                        CLOSE
                    </button>

                </div>

            </div>
        </div>
    );
}

export default WalkInInvoice;