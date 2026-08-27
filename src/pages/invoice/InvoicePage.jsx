// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import {
//   ArrowLeft,
//   Download,
//   Printer,
//   FileText,
//   Loader2,
// } from "lucide-react";
// import { toast } from "react-toastify";

// import { getInvoiceById } from "../../services/invoiceService.js";

// const InvoicePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const invoiceRef = useRef(null);

//   const [invoice, setInvoice] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // ==========================================
//   // LOAD INVOICE
//   // ==========================================

//   useEffect(() => {
//     const loadInvoice = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await getInvoiceById(id);

//         setInvoice(
//           response?.data || response?.invoice || response
//         );
//       } catch (err) {
//         console.error("Invoice loading error:", err);

//         setError(
//           err?.response?.data?.message ||
//           "Unable to load invoice."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       loadInvoice();
//     }
//   }, [id]);


//   // ==========================================
//   // PRINT
//   // ==========================================

//   const handlePrint = () => {
//     window.print();
//   };


//   // ==========================================
//   // DOWNLOAD PDF
//   // ==========================================

//   const handleDownloadPDF = async () => {
//     if (!invoiceRef.current) return;

//     try {
//       const element = invoiceRef.current;

//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: "#ffffff",
//       });

//       const imageData = canvas.toDataURL(
//         "image/png"
//       );

//       const pdf = new jsPDF(
//         "p",
//         "mm",
//         "a4"
//       );

//       const pdfWidth = 210;

//       const pdfHeight =
//         (canvas.height * pdfWidth) /
//         canvas.width;

//       pdf.addImage(
//         imageData,
//         "PNG",
//         0,
//         0,
//         pdfWidth,
//         pdfHeight
//       );

//       pdf.save(
//         `${invoice?.invoiceNumber || "invoice"}.pdf`
//       );
//     } catch (err) {
//       console.error(
//         "PDF generation error:",
//         err
//       );

//       toast.error(
//         "Unable to generate PDF."
//       );
//     }
//   };


//   // ==========================================
//   // FORMAT CURRENCY
//   // ==========================================

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat(
//       "en-IN",
//       {
//         style: "currency",
//         currency: "INR",
//         maximumFractionDigits: 2,
//       }
//     ).format(Number(value || 0));
//   };


//   // ==========================================
//   // FORMAT DATE
//   // ==========================================

//   const formatDate = (date) => {
//     if (!date) return "-";

//     return new Date(date).toLocaleDateString(
//       "en-IN",
//       {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       }
//     );
//   };


//   // ==========================================
//   // LOADING
//   // ==========================================

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="flex items-center gap-3">
//           <Loader2 className="animate-spin" size={24} />
//           <span>Loading invoice...</span>
//         </div>
//       </div>
//     );
//   }


//   // ==========================================
//   // ERROR
//   // ==========================================

//   if (error || !invoice) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center px-4">
//         <FileText size={50} />

//         <h2 className="text-xl font-semibold mt-4">
//           Invoice not found
//         </h2>

//         <p className="text-gray-500 mt-2">
//           {error || "Unable to find this invoice."}
//         </p>

//         <button
//           onClick={() => navigate(-1)}
//           className="mt-6 px-5 py-2 rounded-lg bg-black text-white"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }


//   const customer =
//     invoice.user || {};

//   const order =
//     invoice.order || {};

//   const payment =
//     invoice.payment || {};


//   const billing =
//     invoice.billingAddress || {};


//   return (
//     <>
//       {/* ==========================================
//           ACTION BAR
//       ========================================== */}

//       <div className="invoice-actions bg-gray-100 border-b px-4 py-4">
//         <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">

//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
//           >
//             <ArrowLeft size={18} />
//             Back
//           </button>


//           <div className="flex flex-wrap gap-2">

//             <button
//               onClick={handlePrint}
//               className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
//             >
//               <Printer size={18} />
//               Print
//             </button>


//             <button
//               onClick={handleDownloadPDF}
//               className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//             >
//               <Download size={18} />
//               Download PDF
//             </button>

//           </div>
//         </div>
//       </div>


//       {/* ==========================================
//           INVOICE
//       ========================================== */}

//       <div className="bg-gray-200 min-h-screen py-8 px-4">

//         <div
//           ref={invoiceRef}
//           className="invoice-document max-w-4xl mx-auto bg-white shadow-lg"
//         >

//           {/* ======================================
//               HEADER
//           ====================================== */}

//           <div className="p-8 border-b">

//             <div className="flex flex-col sm:flex-row justify-between gap-6">

//               <div>

//                 <h1 className="text-3xl font-bold tracking-wide">
//                   FIXFLOW
//                 </h1>

//                 <p className="text-gray-500 mt-1">
//                   ZAID INFOTECH
//                 </p>

//               </div>


//               <div className="text-left sm:text-right">

//                 <h2 className="text-2xl font-bold">
//                   TAX INVOICE
//                 </h2>

//                 <p className="text-gray-500 mt-1">
//                   INVOICE
//                 </p>

//               </div>

//             </div>

//           </div>


//           {/* ======================================
//               INVOICE INFORMATION
//           ====================================== */}

//           <div className="p-8 border-b">

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

//               <div>

//                 <p className="text-sm text-gray-500">
//                   Invoice No
//                 </p>

//                 <p className="font-semibold">
//                   {invoice.invoiceNumber || "-"}
//                 </p>

//               </div>


//               <div>

//                 <p className="text-sm text-gray-500">
//                   Order No
//                 </p>

//                 <p className="font-semibold">
//                   {order._id
//                     ? `#${order._id}`
//                     : invoice.referenceId
//                       ? `#${invoice.referenceId}`
//                       : "-"
//                   }
//                 </p>

//               </div>


//               <div>

//                 <p className="text-sm text-gray-500">
//                   Invoice Date
//                 </p>

//                 <p className="font-semibold">
//                   {formatDate(invoice.invoiceDate)}
//                 </p>

//               </div>


//               <div>

//                 <p className="text-sm text-gray-500">
//                   Order Type
//                 </p>

//                 <p className="font-semibold">
//                   {invoice.orderSource === "WALK_IN"
//                     ? "WALK-IN ORDER"
//                     : "ONLINE ORDER"
//                   }
//                 </p>

//               </div>

//             </div>

//           </div>


//           {/* ======================================
//               BILL TO
//           ====================================== */}

//           <div className="p-8 border-b">

//             <h3 className="font-bold text-lg mb-4">
//               BILL TO / SHIP TO
//             </h3>


//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

//               <div>

//                 <p className="font-semibold">
//                   {billing.fullName ||
//                     customer.firstName
//                       ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
//                       : "Customer"
//                   }
//                 </p>

//                 <p className="text-gray-600 mt-1">
//                   Phone:{" "}
//                   {billing.phone ||
//                     customer.phone ||
//                     "-"
//                   }
//                 </p>

//                 <p className="text-gray-600">
//                   Email:{" "}
//                   {customer.email || "-"}
//                 </p>

//               </div>


//               <div>

//                 <p className="text-gray-600">
//                   {billing.addressLine || ""}
//                 </p>

//                 <p className="text-gray-600">
//                   {billing.city || ""}
//                   {billing.city && billing.state
//                     ? ", "
//                     : ""}
//                   {billing.state || ""}
//                 </p>

//                 <p className="text-gray-600">
//                   {billing.pincode || ""}
//                 </p>

//                 <p className="text-gray-600">
//                   {billing.country || "India"}
//                 </p>

//               </div>

//             </div>

//           </div>


//           {/* ======================================
//               ITEMS
//           ====================================== */}

//           <div className="p-8 border-b">

//             <h3 className="font-bold text-lg mb-4">
//               ITEMS
//             </h3>


//             <div className="overflow-x-auto">

//               <table className="w-full border-collapse">

//                 <thead>

//                   <tr className="bg-gray-100 border">

//                     <th className="text-left p-3 border">
//                       Item
//                     </th>

//                     <th className="text-center p-3 border">
//                       Qty
//                     </th>

//                     <th className="text-right p-3 border">
//                       Price
//                     </th>

//                     <th className="text-right p-3 border">
//                       Discount
//                     </th>

//                     <th className="text-right p-3 border">
//                       Total
//                     </th>

//                   </tr>

//                 </thead>


//                 <tbody>

//                   {invoice.items?.map(
//                     (item, index) => (

//                       <tr
//                         key={
//                           item._id ||
//                           index
//                         }
//                         className="border"
//                       >

//                         <td className="p-3 border">

//                           <div className="font-medium">
//                             {item.title ||
//                               item.description ||
//                               "Item"
//                             }
//                           </div>

//                           {item.description && (
//                             <div className="text-xs text-gray-500 mt-1">
//                               {item.description}
//                             </div>
//                           )}

//                         </td>


//                         <td className="p-3 border text-center">
//                           {item.quantity}
//                         </td>


//                         <td className="p-3 border text-right">
//                           {formatCurrency(
//                             item.price
//                           )}
//                         </td>


//                         <td className="p-3 border text-right">
//                           {formatCurrency(
//                             item.discountAmount
//                           )}
//                         </td>


//                         <td className="p-3 border text-right font-medium">
//                           {formatCurrency(
//                             item.total
//                           )}
//                         </td>

//                       </tr>

//                     )
//                   )}

//                 </tbody>

//               </table>

//             </div>

//           </div>


//           {/* ======================================
//               TOTALS
//           ====================================== */}

//           <div className="p-8 border-b">

//             <div className="ml-auto max-w-sm space-y-3">

//               <div className="flex justify-between">

//                 <span className="text-gray-600">
//                   Subtotal
//                 </span>

//                 <span className="font-medium">
//                   {formatCurrency(
//                     invoice.subtotal
//                   )}
//                 </span>

//               </div>


//               <div className="flex justify-between">

//                 <span className="text-gray-600">
//                   Discount
//                 </span>

//                 <span className="font-medium">
//                   -{" "}
//                   {formatCurrency(
//                     invoice.discount
//                   )}
//                 </span>

//               </div>


//               <div className="border-t pt-3 flex justify-between text-lg font-bold">

//                 <span>
//                   Total
//                 </span>

//                 <span>
//                   {formatCurrency(
//                     invoice.totalAmount
//                   )}
//                 </span>

//               </div>


//               <div className="flex justify-between">

//                 <span className="text-gray-600">
//                   Amount Paid
//                 </span>

//                 <span>
//                   {formatCurrency(
//                     invoice.paidAmount
//                   )}
//                 </span>

//               </div>


//               <div className="flex justify-between font-semibold">

//                 <span>
//                   Amount Due
//                 </span>

//                 <span>
//                   {formatCurrency(
//                     invoice.balanceAmount
//                   )}
//                 </span>

//               </div>

//             </div>

//           </div>


//           {/* ======================================
//               PAYMENT
//           ====================================== */}

//           <div className="p-8 border-b">

//             <h3 className="font-bold text-lg mb-4">
//               PAYMENT INFORMATION
//             </h3>


//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

//               <div>
//                 <p className="text-sm text-gray-500">
//                   Payment Status
//                 </p>

//                 <p className="font-semibold">
//                   {invoice.paymentStatus || "-"}
//                 </p>
//               </div>


//               <div>
//                 <p className="text-sm text-gray-500">
//                   Payment Method
//                 </p>

//                 <p className="font-semibold">
//                   {invoice.paymentMethod || "-"}
//                 </p>
//               </div>


//               {payment.transactionId && (
//                 <div>
//                   <p className="text-sm text-gray-500">
//                     Transaction ID
//                   </p>

//                   <p className="font-semibold break-all">
//                     {payment.transactionId}
//                   </p>
//                 </div>
//               )}


//               {payment.createdAt && (
//                 <div>
//                   <p className="text-sm text-gray-500">
//                     Payment Date
//                   </p>

//                   <p className="font-semibold">
//                     {formatDate(
//                       payment.createdAt
//                     )}
//                   </p>
//                 </div>
//               )}

//             </div>

//           </div>


//           {/* ======================================
//               DELIVERY
//           ====================================== */}

//           {order && (
//             <div className="p-8 border-b">

//               <h3 className="font-bold text-lg mb-4">
//                 DELIVERY INFORMATION
//               </h3>


//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

//                 <div>

//                   <p className="text-sm text-gray-500">
//                     Delivery Status
//                   </p>

//                   <p className="font-semibold">
//                     {order.orderStatus ||
//                       order.status ||
//                       "PROCESSING"
//                     }
//                   </p>

//                 </div>


//                 <div>

//                   <p className="text-sm text-gray-500">
//                     Expected Delivery
//                   </p>

//                   <p className="font-semibold">
//                     {formatDate(
//                       order.expectedDeliveryDate
//                     )}
//                   </p>

//                 </div>

//               </div>

//             </div>
//           )}


//           {/* ======================================
//               FOOTER
//           ====================================== */}

//           <div className="p-8 text-center">

//             <p className="font-semibold">
//               Thank you for shopping with FixFlow!
//             </p>

//             <p className="text-sm text-gray-500 mt-2">
//               This is a computer-generated invoice.
//             </p>

//           </div>

//         </div>

//       </div>


//       {/* ==========================================
//           PRINT CSS
//       ========================================== */}

//       <style>
//         {`
//           @media print {

//             body {
//               background: white !important;
//             }

//             .invoice-actions {
//               display: none !important;
//             }

//             .invoice-document {
//               box-shadow: none !important;
//               max-width: none !important;
//               width: 100% !important;
//             }

//             .bg-gray-200 {
//               background: white !important;
//               padding: 0 !important;
//             }

//             @page {
//               size: A4;
//               margin: 10mm;
//             }
//           }
//         `}
//       </style>
//     </>
//   );
// };

// export default InvoicePage;

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  ArrowLeft,
  Download,
  Printer,
  FileText,
  Loader2,
  User,
  CreditCard,
  Smartphone,
  Banknote,
  Receipt,
} from "lucide-react";

import { toast } from "react-toastify";

import { getInvoiceById } from "../../services/invoiceService.js";

import logo from "../../assets/images/zaidinfotechlogo.png";


// ======================================================
// INVOICE PAGE
// ======================================================

const InvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const invoiceRef = useRef(null);

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ======================================================
  // LOAD INVOICE
  // ======================================================

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getInvoiceById(id);

        console.log(
          "================================================"
        );

        console.log("INVOICE RESPONSE:", response);

        console.log(
          "INVOICE DATA:",
          response?.data || response?.invoice || response
        );

        console.log(
          "================================================"
        );

        setInvoice(
          response?.data ||
          response?.invoice ||
          response
        );

      } catch (err) {
        console.error(
          "Invoice loading error:",
          err
        );

        setError(
          err?.response?.data?.message ||
          "Unable to load invoice."
        );

      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadInvoice();
    }

  }, [id]);


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
      return;
    }

    try {
      toast.info("Generating PDF...");

      const element = invoiceRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
      });

      const imageData =
        canvas.toDataURL("image/png");

      const pdf = new jsPDF(
        "p",
        "mm",
        "a4"
      );

      const pdfWidth = 210;

      const pageHeight = 297;

      const pdfHeight =
        (canvas.height * pdfWidth) /
        canvas.width;

      /*
       * If invoice is longer than one A4 page,
       * split it into multiple pages.
       */

      let heightLeft = pdfHeight;

      let position = 0;

      pdf.addImage(
        imageData,
        "PNG",
        0,
        position,
        pdfWidth,
        pdfHeight
      );

      heightLeft -= pageHeight;

      while (heightLeft > 0) {

        position =
          heightLeft -
          pdfHeight;

        pdf.addPage();

        pdf.addImage(
          imageData,
          "PNG",
          0,
          position,
          pdfWidth,
          pdfHeight
        );

        heightLeft -= pageHeight;
      }

      pdf.save(
        `${
          invoice?.invoiceNumber ||
          "invoice"
        }.pdf`
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
    }
  };


  // ======================================================
  // CURRENCY
  // ======================================================

  const formatCurrency = (value) => {

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(
      Number(value || 0)
    );
  };


  // ======================================================
  // DATE
  // ======================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ======================================================
  // TIME
  // ======================================================

  const formatTime = (date) => {

    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "-";
    }

    return parsedDate.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="flex items-center gap-3 bg-white px-6 py-5 rounded-xl shadow">

          <Loader2
            className="animate-spin"
            size={25}
          />

          <span className="font-medium">
            Loading invoice...
          </span>

        </div>

      </div>
    );
  }


  // ======================================================
  // ERROR
  // ======================================================

  if (error || !invoice) {

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-100">

        <FileText size={55} />

        <h2 className="text-xl font-semibold mt-4">
          Invoice not found
        </h2>

        <p className="text-gray-500 mt-2 text-center">
          {error ||
            "Unable to find this invoice."}
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-5 py-2 rounded-lg bg-black text-white"
        >
          Go Back
        </button>

      </div>
    );
  }


  // ======================================================
  // BASIC DATA
  // ======================================================

  const customer =
    invoice.user || {};

  const order =
    invoice.order || {};

  const payment =
    invoice.payment || {};

  const billing =
    invoice.billingAddress || {};

  const items =
    Array.isArray(invoice.items)
      ? invoice.items
      : [];


  // ======================================================
  // CUSTOMER NAME
  // ======================================================

  const customerName =
    billing.fullName ||
    [
      customer.firstName,
      customer.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    customer.name ||
    "Customer";


  // ======================================================
  // EMPLOYEE / CASHIER DATA
  //
  // We check multiple common backend fields so
  // existing backend structure does not break.
  // ======================================================

  const employee =
    invoice.employee ||
    invoice.cashier ||
    invoice.staff ||
    invoice.createdBy ||
    invoice.processedBy ||
    invoice.salesPerson ||
    order.employee ||
    order.cashier ||
    order.staff ||
    order.createdBy ||
    order.processedBy ||
    {};


  // ======================================================
  // EMPLOYEE NAME
  // ======================================================

  const employeeName =
    employee.fullName ||
    employee.name ||
    [
      employee.firstName,
      employee.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    employee.username ||
    employee.employeeName ||
    invoice.employeeName ||
    invoice.cashierName ||
    invoice.createdByName ||
    order.employeeName ||
    order.cashierName ||
    "Staff / Cashier";


  // ======================================================
  // EMPLOYEE ID
  // ======================================================

  const employeeId =
    employee.employeeId ||
    employee.employeeID ||
    employee.empId ||
    employee.staffId ||
    employee.userId ||
    employee._id ||
    invoice.employeeId ||
    invoice.employeeID ||
    invoice.cashierId ||
    invoice.createdById ||
    order.employeeId ||
    order.employeeID ||
    order.cashierId ||
    order.createdById ||
    "-";


  // ======================================================
  // PAYMENT METHOD
  // ======================================================

  const paymentMethod = String(
    invoice.paymentMethod ||
    payment.method ||
    payment.paymentMethod ||
    order.paymentMethod ||
    "CASH"
  ).toUpperCase();


  // ======================================================
  // TRANSACTION / REFERENCE ID
  // ======================================================

  const transactionId =
    payment.transactionId ||
    payment.transactionID ||
    payment.paymentId ||
    payment.referenceId ||
    payment.referenceID ||
    payment.razorpayPaymentId ||
    payment.razorpay_payment_id ||
    payment.upiTransactionId ||
    payment.upiReferenceId ||
    invoice.transactionId ||
    invoice.referenceId ||
    invoice.paymentReferenceId ||
    order.transactionId ||
    order.referenceId ||
    "";


  // ======================================================
  // UPI ID
  // ======================================================

  const upiId =
    payment.upiId ||
    payment.upiID ||
    payment.vpa ||
    payment.vpaId ||
    invoice.upiId ||
    invoice.upiID ||
    "";


  // ======================================================
  // CARD DETAILS
  //
  // We intentionally do NOT display full card number.
  // Only safe last 4 digits / card reference.
  // ======================================================

  const cardLast4 =
    payment.cardLast4 ||
    payment.last4 ||
    payment.cardLastFour ||
    invoice.cardLast4 ||
    "";


  // ======================================================
  // PAYMENT ICON
  // ======================================================

  const getPaymentIcon = () => {

    if (
      paymentMethod.includes("UPI")
    ) {
      return (
        <Smartphone
          size={20}
        />
      );
    }

    if (
      paymentMethod.includes("CARD") ||
      paymentMethod.includes("DEBIT") ||
      paymentMethod.includes("CREDIT")
    ) {
      return (
        <CreditCard
          size={20}
        />
      );
    }

    if (
      paymentMethod.includes("CASH")
    ) {
      return (
        <Banknote
          size={20}
        />
      );
    }

    return (
      <Receipt
        size={20}
      />
    );
  };


  // ======================================================
  // PAYMENT METHOD DISPLAY
  // ======================================================

  const getPaymentMethodLabel = () => {

    if (
      paymentMethod.includes("UPI")
    ) {
      return "UPI";
    }

    if (
      paymentMethod.includes("CARD")
    ) {
      return "CARD";
    }

    if (
      paymentMethod.includes("DEBIT")
    ) {
      return "DEBIT CARD";
    }

    if (
      paymentMethod.includes("CREDIT")
    ) {
      return "CREDIT CARD";
    }

    if (
      paymentMethod.includes("CASH")
    ) {
      return "CASH";
    }

    return paymentMethod;
  };


  // ======================================================
  // ORDER ID
  // ======================================================

  const orderId =
    order._id ||
    order.orderId ||
    invoice.referenceId ||
    invoice.orderId ||
    "-";


  // ======================================================
  // PAYMENT DATE
  // ======================================================

  const paymentDate =
    payment.createdAt ||
    payment.paymentDate ||
    invoice.paidAt ||
    invoice.paymentDate ||
    "";


  // ======================================================
  // PAYMENT STATUS
  // ======================================================

  const paymentStatus =
    invoice.paymentStatus ||
    payment.status ||
    order.paymentStatus ||
    "PENDING";


  // ======================================================
  // ORDER STATUS
  // ======================================================

  const orderStatus =
    order.orderStatus ||
    order.status ||
    invoice.orderStatus ||
    "PROCESSING";


  // ======================================================
  // TOTALS
  // ======================================================

  const subtotal =
    Number(invoice.subtotal || 0);

  const discount =
    Number(invoice.discount || 0);

  const totalAmount =
    Number(invoice.totalAmount || 0);

  const paidAmount =
    Number(invoice.paidAmount || 0);

  const balanceAmount =
    Number(invoice.balanceAmount || 0);


  // ======================================================
  // RETURN
  // ======================================================

  return (
    <>
      {/* ==================================================
          ACTION BAR
      ================================================== */}

      <div className="invoice-actions bg-gray-100 border-b px-4 py-4 no-print">

        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">

          <button
            onClick={() =>
              navigate(-1)
            }
            className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 transition"
          >
            <ArrowLeft size={18} />

            Back
          </button>


          <div className="flex flex-wrap gap-2">

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 transition"
            >
              <Printer size={18} />

              Print
            </button>


            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <Download size={18} />

              Download PDF
            </button>

          </div>

        </div>

      </div>


      {/* ==================================================
          PAGE BACKGROUND
      ================================================== */}

      <div className="bg-gray-200 min-h-screen py-8 px-4 invoice-wrapper">


        {/* ==================================================
            INVOICE DOCUMENT
        ================================================== */}

        <div
          ref={invoiceRef}
          className="invoice-document max-w-4xl mx-auto bg-white shadow-xl"
        >


          {/* ==================================================
              TOP BRAND HEADER
          ================================================== */}

          <div className="px-8 pt-8 pb-6 border-b">

            <div className="flex flex-col sm:flex-row justify-between gap-6">


              {/* COMPANY */}

              <div className="flex items-center gap-4">

                <img
                  src={logo}
                  alt="Zaid Infotech"
                  className="w-20 h-20 object-contain"
                  crossOrigin="anonymous"
                />

                <div>

                  <h1 className="text-2xl sm:text-3xl font-bold tracking-wide text-gray-900">
                    ZAID INFOTECH
                  </h1>

                  <p className="text-gray-600 mt-1">
                    Sales & Service Center
                  </p>

                  <p className="text-gray-500 text-sm">
                    Srinagar, Jammu & Kashmir
                  </p>

                  <p className="text-gray-500 text-sm">
                    Sales • Service • Repair • Rental
                  </p>

                </div>

              </div>


              {/* INVOICE TITLE */}

              <div className="text-left sm:text-right">

                <h2 className="text-3xl font-bold text-gray-900">
                  TAX INVOICE
                </h2>

                <p className="text-gray-500 mt-1">
                  {invoice.orderSource ===
                  "WALK_IN"
                    ? "WALK-IN ORDER"
                    : "ONLINE ORDER"}
                </p>

                {invoice.orderSource ===
                  "WALK_IN" && (
                  <div className="inline-block mt-3 px-3 py-1 rounded-full bg-black text-white text-xs font-semibold">
                    WALK-IN
                  </div>
                )}

              </div>

            </div>

          </div>


          {/* ==================================================
              INVOICE INFORMATION
          ================================================== */}

          <div className="px-8 py-6 border-b">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">


              {/* INVOICE NUMBER */}

              <div>

                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Invoice No
                </p>

                <p className="font-bold mt-1 break-all">
                  {invoice.invoiceNumber ||
                    "-"}

                </p>

              </div>


              {/* ORDER NUMBER */}

              <div>

                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Order ID
                </p>

                <p className="font-semibold mt-1 break-all">
                  #{orderId}
                </p>

              </div>


              {/* DATE */}

              <div>

                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Invoice Date
                </p>

                <p className="font-semibold mt-1">
                  {formatDate(
                    invoice.invoiceDate ||
                    invoice.createdAt
                  )}
                </p>

              </div>


              {/* TIME */}

              <div>

                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Time
                </p>

                <p className="font-semibold mt-1">
                  {formatTime(
                    invoice.invoiceDate ||
                    invoice.createdAt
                  )}
                </p>

              </div>

            </div>

          </div>


          {/* ==================================================
              CUSTOMER + EMPLOYEE
          ================================================== */}

          <div className="px-8 py-6 border-b">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


              {/* ==================================================
                  CUSTOMER
              ================================================== */}

              <div>

                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">

                  <User
                    size={20}
                  />

                  CUSTOMER

                </h3>


                <div className="space-y-1">

                  <p className="font-semibold text-lg">
                    {customerName}
                  </p>

                  <p className="text-gray-600">
                    Phone:{" "}
                    {billing.phone ||
                      customer.phone ||
                      "-"}
                  </p>

                  <p className="text-gray-600 break-all">
                    Email:{" "}
                    {customer.email ||
                      "-"}
                  </p>

                </div>


                <div className="mt-4">

                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Billing Address
                  </p>

                  <p className="text-gray-700 mt-1">
                    {billing.addressLine ||
                      "-"}
                  </p>

                  <p className="text-gray-700">

                    {billing.city ||
                      ""}

                    {billing.city &&
                      billing.state
                      ? ", "
                      : ""}

                    {billing.state ||
                      ""}

                  </p>

                  <p className="text-gray-700">

                    {billing.pincode ||
                      ""}

                  </p>

                  <p className="text-gray-700">

                    {billing.country ||
                      "India"}

                  </p>

                </div>

              </div>


              {/* ==================================================
                  EMPLOYEE / CASHIER
              ================================================== */}

              <div>

                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">

                  <User
                    size={20}
                  />

                  SERVED BY

                </h3>


                <div className="bg-gray-50 border rounded-xl p-4">

                  <div className="mb-4">

                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Employee / Cashier Name
                    </p>

                    <p className="font-bold text-lg mt-1">
                      {employeeName}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Employee ID
                    </p>

                    <p className="font-semibold mt-1 break-all">
                      {employeeId}
                    </p>

                  </div>


                  <div className="mt-4 pt-4 border-t">

                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Order Type
                    </p>

                    <p className="font-semibold mt-1">

                      {invoice.orderSource ===
                      "WALK_IN"
                        ? "Walk-In Sale"
                        : "Online Sale"}

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              ITEMS
          ================================================== */}

          <div className="px-8 py-6 border-b">

            <h3 className="font-bold text-lg mb-4">
              ITEMS
            </h3>


            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>

                  <tr className="bg-gray-100 border">

                    <th className="text-center p-3 border text-sm">
                      #
                    </th>

                    <th className="text-left p-3 border text-sm">
                      Product
                    </th>

                    <th className="text-center p-3 border text-sm">
                      Qty
                    </th>

                    <th className="text-right p-3 border text-sm">
                      Price
                    </th>

                    <th className="text-right p-3 border text-sm">
                      Discount
                    </th>

                    <th className="text-right p-3 border text-sm">
                      Total
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {items.length > 0 ? (

                    items.map(
                      (item, index) => {

                        const itemPrice =
                          Number(
                            item.price || 0
                          );

                        const itemQty =
                          Number(
                            item.quantity ||
                            1
                          );

                        const itemDiscount =
                          Number(
                            item.discountAmount ||
                            0
                          );

                        const itemTotal =
                          Number(
                            item.total ??
                            (
                              itemPrice *
                              itemQty
                            ) -
                            itemDiscount
                          );

                        return (
                          <tr
                            key={
                              item._id ||
                              index
                            }
                            className="border"
                          >

                            <td className="p-3 border text-center">
                              {index + 1}
                            </td>


                            <td className="p-3 border">

                              <div className="font-semibold">
                                {item.title ||
                                  item.name ||
                                  item.productName ||
                                  "Item"}
                              </div>

                              {item.description && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {
                                    item.description
                                  }
                                </div>
                              )}

                              {item.sku && (
                                <div className="text-xs text-gray-400 mt-1">
                                  SKU:{" "}
                                  {item.sku}
                                </div>
                              )}

                            </td>


                            <td className="p-3 border text-center">
                              {itemQty}
                            </td>


                            <td className="p-3 border text-right">
                              {formatCurrency(
                                itemPrice
                              )}
                            </td>


                            <td className="p-3 border text-right">
                              {formatCurrency(
                                itemDiscount
                              )}
                            </td>


                            <td className="p-3 border text-right font-semibold">
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
                        colSpan="6"
                        className="p-6 text-center text-gray-500"
                      >
                        No items found
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>


          {/* ==================================================
              TOTALS
          ================================================== */}

          <div className="px-8 py-6 border-b">

            <div className="ml-auto max-w-sm space-y-3">


              <div className="flex justify-between">

                <span className="text-gray-600">
                  Subtotal
                </span>

                <span className="font-medium">
                  {formatCurrency(
                    subtotal
                  )}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-gray-600">
                  Discount
                </span>

                <span className="font-medium">
                  -{" "}
                  {formatCurrency(
                    discount
                  )}
                </span>

              </div>


              <div className="border-t pt-3 flex justify-between text-xl font-bold">

                <span>
                  TOTAL
                </span>

                <span>
                  {formatCurrency(
                    totalAmount
                  )}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-gray-600">
                  Amount Paid
                </span>

                <span className="font-semibold">
                  {formatCurrency(
                    paidAmount
                  )}
                </span>

              </div>


              <div className="flex justify-between font-bold">

                <span>
                  Amount Due
                </span>

                <span>
                  {formatCurrency(
                    balanceAmount
                  )}
                </span>

              </div>

            </div>

          </div>


          {/* ==================================================
              PAYMENT INFORMATION
          ================================================== */}

          <div className="px-8 py-6 border-b">

            <h3 className="font-bold text-lg mb-5 flex items-center gap-2">

              <Receipt
                size={21}
              />

              PAYMENT INFORMATION

            </h3>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


              {/* PAYMENT METHOD */}

              <div className="border rounded-xl p-4 bg-gray-50">

                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Payment Method
                </p>

                <div className="flex items-center gap-2 mt-2">

                  {getPaymentIcon()}

                  <span className="font-bold text-lg">
                    {getPaymentMethodLabel()}
                  </span>

                </div>

              </div>


              {/* PAYMENT STATUS */}

              <div className="border rounded-xl p-4 bg-gray-50">

                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Payment Status
                </p>

                <p className="font-bold text-lg mt-2">
                  {String(
                    paymentStatus
                  ).toUpperCase()}
                </p>

              </div>


              {/* UPI DETAILS */}

              {paymentMethod.includes(
                "UPI"
              ) && (

                <div className="border rounded-xl p-4">

                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    UPI Payment
                  </p>


                  {upiId && (

                    <p className="mt-2">

                      <span className="text-gray-500">
                        UPI ID:
                      </span>{" "}

                      <strong>
                        {upiId}
                      </strong>

                    </p>

                  )}


                  {transactionId && (

                    <p className="mt-1 break-all">

                      <span className="text-gray-500">
                        Transaction ID:
                      </span>{" "}

                      <strong>
                        {transactionId}
                      </strong>

                    </p>

                  )}

                </div>

              )}


              {/* CARD DETAILS */}

              {(
                paymentMethod.includes(
                  "CARD"
                ) ||
                paymentMethod.includes(
                  "DEBIT"
                ) ||
                paymentMethod.includes(
                  "CREDIT"
                )
              ) && (

                <div className="border rounded-xl p-4">

                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Card Payment
                  </p>


                  {cardLast4 ? (

                    <p className="mt-2">

                      <span className="text-gray-500">
                        Card:
                      </span>{" "}

                      <strong>
                        **** **** ****{" "}
                        {cardLast4}
                      </strong>

                    </p>

                  ) : (

                    <p className="mt-2 text-gray-600">
                      Card payment
                    </p>

                  )}


                  {transactionId && (

                    <p className="mt-1 break-all">

                      <span className="text-gray-500">
                        Transaction ID:
                      </span>{" "}

                      <strong>
                        {transactionId}
                      </strong>

                    </p>

                  )}

                </div>

              )}


              {/* CASH */}

              {paymentMethod.includes(
                "CASH"
              ) && (

                <div className="border rounded-xl p-4">

                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Cash Payment
                  </p>

                  <p className="font-semibold mt-2">
                    Paid in Cash
                  </p>

                </div>

              )}


              {/* PAYMENT DATE */}

              {paymentDate && (

                <div className="border rounded-xl p-4">

                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Payment Date
                  </p>

                  <p className="font-semibold mt-2">
                    {formatDate(
                      paymentDate
                    )}
                  </p>

                  <p className="text-sm text-gray-500">
                    {formatTime(
                      paymentDate
                    )}
                  </p>

                </div>

              )}

            </div>

          </div>


          {/* ==================================================
              DELIVERY / ORDER INFORMATION
          ================================================== */}

          <div className="px-8 py-6 border-b">

            <h3 className="font-bold text-lg mb-5">
              ORDER INFORMATION
            </h3>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


              <div>

                <p className="text-sm text-gray-500">
                  Order Status
                </p>

                <p className="font-semibold mt-1">
                  {orderStatus}
                </p>

              </div>


              <div>

                <p className="text-sm text-gray-500">
                  Order Type
                </p>

                <p className="font-semibold mt-1">
                  {invoice.orderSource ===
                  "WALK_IN"
                    ? "WALK-IN SALE"
                    : "ONLINE SALE"}
                </p>

              </div>


              {order.expectedDeliveryDate && (

                <div>

                  <p className="text-sm text-gray-500">
                    Expected Delivery
                  </p>

                  <p className="font-semibold mt-1">
                    {formatDate(
                      order.expectedDeliveryDate
                    )}
                  </p>

                </div>

              )}

            </div>

          </div>


          {/* ==================================================
              WALK-IN BADGE
          ================================================== */}

          {invoice.orderSource ===
            "WALK_IN" && (

            <div className="px-8 pt-6">

              <div className="border-2 border-dashed rounded-xl p-4 text-center">

                <p className="font-bold tracking-wide">
                  WALK-IN SALE
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  This order was processed at
                  Zaid Infotech Sales &
                  Service Center.
                </p>

              </div>

            </div>

          )}


          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="px-8 py-8 text-center">

            <p className="font-bold text-lg">
              Thank you for shopping with
              Zaid Infotech!
            </p>

            <p className="text-sm text-gray-500 mt-2">
              We appreciate your business.
            </p>

            <p className="text-xs text-gray-400 mt-2">
              This is a computer-generated
              invoice and does not require a
              physical signature.
            </p>


            <div className="mt-6">

              <p className="text-sm font-semibold">
                Authorized Signature
              </p>

              <div className="mt-8 border-b w-48 mx-auto"></div>

            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          PRINT CSS
      ================================================== */}

      <style>
        {`

          @media print {

            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            body {
              background: white !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            .no-print,
            .invoice-actions {
              display: none !important;
            }

            .invoice-wrapper {
              background: white !important;
              min-height: auto !important;
              padding: 0 !important;
              margin: 0 !important;
            }

            .invoice-document {
              box-shadow: none !important;
              max-width: none !important;
              width: 100% !important;
              margin: 0 !important;
            }

            @page {
              size: A4;
              margin: 8mm;
            }

            table {
              page-break-inside: auto;
            }

            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }

            thead {
              display: table-header-group;
            }

            .invoice-document img {
              max-width: 90px !important;
            }

          }

        `}
      </style>

    </>
  );
};


export default InvoicePage;