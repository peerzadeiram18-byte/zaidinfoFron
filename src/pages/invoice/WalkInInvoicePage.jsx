// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// import {
//     getInvoiceByOrderId,
//     createInvoice,
// } from "../../services/invoiceService";

// import "./WalkInInvoicePage.css";


// function WalkInInvoicePage() {

//     const { orderId } = useParams();

//     const navigate = useNavigate();

//     const invoiceRef = useRef(null);

//     const [invoice, setInvoice] = useState(null);

//     const [loading, setLoading] = useState(true);

//     const [error, setError] = useState("");


//     // ==========================================
//     // LOAD INVOICE
//     // ==========================================

//     useEffect(() => {

//         const loadInvoice = async () => {

//             try {

//                 setLoading(true);

//                 setError("");


//                 // First try existing invoice

//                 const response =
//                     await getInvoiceByOrderId(orderId);


//                 if (response?.data) {

//                     setInvoice(response.data);

//                     return;

//                 }

//             } catch (error) {

//                 // Invoice doesn't exist yet.
//                 // We will create it below.

//                 console.log(
//                     "Invoice not found, creating invoice..."
//                 );

//             } finally {

//                 setLoading(false);

//             }

//         };


//         if (orderId) {

//             loadInvoice();

//         }

//     }, [orderId]);


//     // ==========================================
//     // CREATE INVOICE IF NOT FOUND
//     // ==========================================

//     useEffect(() => {

//         const generateInvoice = async () => {

//             if (!orderId || invoice) {
//                 return;
//             }

//             try {

//                 setLoading(true);

//                 const response =
//                     await createInvoice(orderId);


//                 if (response?.data) {

//                     setInvoice(response.data);

//                 }

//             } catch (error) {

//                 console.error(
//                     "Invoice creation failed:",
//                     error
//                 );

//                 setError(
//                     error?.response?.data?.message ||
//                     "Unable to create invoice."
//                 );

//             } finally {

//                 setLoading(false);

//             }

//         };


//         generateInvoice();

//     }, [orderId, invoice]);


//     // ==========================================
//     // PRINT
//     // ==========================================

//     const handlePrint = () => {

//         window.print();

//     };


//     // ==========================================
//     // BACK
//     // ==========================================

//     const handleBack = () => {

//         navigate(-1);

//     };


//     // ==========================================
//     // LOADING
//     // ==========================================

//     if (loading) {

//         return (

//             <div className="invoice-loading">

//                 <h2>
//                     Loading Invoice...
//                 </h2>

//             </div>

//         );

//     }


//     // ==========================================
//     // ERROR
//     // ==========================================

//     if (error) {

//         return (

//             <div className="invoice-error">

//                 <h2>
//                     Invoice Error
//                 </h2>

//                 <p>
//                     {error}
//                 </p>

//                 <button
//                     onClick={handleBack}
//                 >
//                     Go Back
//                 </button>

//             </div>

//         );

//     }


//     if (!invoice) {

//         return (

//             <div className="invoice-error">

//                 <h2>
//                     Invoice not available
//                 </h2>

//                 <button
//                     onClick={handleBack}
//                 >
//                     Go Back
//                 </button>

//             </div>

//         );

//     }


//     // ==========================================
//     // DATA
//     // ==========================================

//     const customer =
//         invoice.billingAddress || {};

//     const items =
//         invoice.items || [];


//     const order =
//         invoice.order || {};


//     const payment =
//         invoice.payment || {};


//     return (

//         <div className="invoice-page">


//             {/* =================================
//                 ACTION BUTTONS
//             ================================= */}

//             <div className="invoice-actions no-print">

//                 <button
//                     className="invoice-back-btn"
//                     onClick={handleBack}
//                 >
//                     ← Back
//                 </button>


//                 <button
//                     className="invoice-print-btn"
//                     onClick={handlePrint}
//                 >
//                     🖨 Print Invoice
//                 </button>

//             </div>



//             {/* =================================
//                 INVOICE
//             ================================= */}

//             <div
//                 ref={invoiceRef}
//                 className="invoice-paper"
//             >


//                 {/* HEADER */}

//                 <div className="invoice-header">

//                     <div>

//                         <h1>
//                             ZAID INFOTECH
//                         </h1>

//                         <p>
//                             Sales & Service Center
//                         </p>

//                         <p>
//                             Srinagar, Jammu & Kashmir
//                         </p>

//                         <p>
//                             Phone: +91 XXXXX XXXXX
//                         </p>

//                     </div>


//                     <div className="invoice-title">

//                         <h2>
//                             INVOICE
//                         </h2>

//                         <p>
//                             {invoice.orderSource === "WALK_IN"
//                                 ? "WALK-IN TAX INVOICE"
//                                 : "TAX INVOICE"}
//                         </p>

//                     </div>

//                 </div>


//                 <hr />



//                 {/* INVOICE INFORMATION */}

//                 <div className="invoice-info-grid">


//                     <div>

//                         <strong>
//                             Invoice No
//                         </strong>

//                         <span>
//                             {invoice.invoiceNumber}
//                         </span>

//                     </div>


//                     <div>

//                         <strong>
//                             Order No
//                         </strong>

//                         <span>
//                             #{order._id || invoice.referenceId}
//                         </span>

//                     </div>


//                     <div>

//                         <strong>
//                             Date
//                         </strong>

//                         <span>

//                             {invoice.invoiceDate
//                                 ? new Date(
//                                     invoice.invoiceDate
//                                 ).toLocaleDateString(
//                                     "en-IN",
//                                     {
//                                         day: "2-digit",
//                                         month: "short",
//                                         year: "numeric",
//                                     }
//                                 )
//                                 : "-"
//                             }

//                         </span>

//                     </div>


//                     <div>

//                         <strong>
//                             Order Type
//                         </strong>

//                         <span>
//                             {invoice.orderSource}
//                         </span>

//                     </div>


//                 </div>



//                 <hr />



//                 {/* CUSTOMER */}

//                 <div className="customer-section">


//                     <div className="customer-column">

//                         <h3>
//                             BILL TO
//                         </h3>

//                         <p>
//                             <strong>
//                                 {customer.fullName ||
//                                     invoice.user?.firstName ||
//                                     "Customer"}
//                             </strong>
//                         </p>

//                         <p>
//                             Phone:{" "}
//                             {customer.phone ||
//                                 invoice.user?.phone ||
//                                 "-"}
//                         </p>

//                         <p>
//                             Email:{" "}
//                             {invoice.user?.email ||
//                                 "-"}
//                         </p>

//                     </div>



//                     <div className="customer-column">

//                         <h3>
//                             ADDRESS
//                         </h3>

//                         <p>
//                             {customer.addressLine ||
//                                 "-"}
//                         </p>

//                         <p>

//                             {customer.city || ""}

//                             {customer.city &&
//                                 customer.state
//                                 ? ", "
//                                 : ""}

//                             {customer.state || ""}

//                         </p>

//                         <p>
//                             {customer.pincode || ""}
//                         </p>

//                         <p>
//                             {customer.country ||
//                                 "India"}
//                         </p>

//                     </div>


//                 </div>



//                 <hr />



//                 {/* ITEMS */}

//                 <h3 className="section-title">
//                     ITEMS
//                 </h3>


//                 <table className="invoice-table">

//                     <thead>

//                         <tr>

//                             <th>
//                                 #
//                             </th>

//                             <th>
//                                 Product
//                             </th>

//                             <th>
//                                 Qty
//                             </th>

//                             <th>
//                                 Price
//                             </th>

//                             <th>
//                                 Discount
//                             </th>

//                             <th>
//                                 Total
//                             </th>

//                         </tr>

//                     </thead>


//                     <tbody>

//                         {items.map(
//                             (item, index) => (

//                                 <tr
//                                     key={
//                                         item._id ||
//                                         index
//                                     }
//                                 >

//                                     <td>
//                                         {index + 1}
//                                     </td>

//                                     <td>

//                                         <strong>
//                                             {item.title}
//                                         </strong>

//                                         {item.description && (

//                                             <small>
//                                                 {
//                                                     item.description
//                                                 }
//                                             </small>

//                                         )}

//                                     </td>

//                                     <td>
//                                         {item.quantity}
//                                     </td>

//                                     <td>
//                                         ₹{" "}
//                                         {Number(
//                                             item.price || 0
//                                         ).toLocaleString(
//                                             "en-IN"
//                                         )}
//                                     </td>

//                                     <td>
//                                         ₹{" "}
//                                         {Number(
//                                             item.discountAmount ||
//                                             0
//                                         ).toLocaleString(
//                                             "en-IN"
//                                         )}
//                                     </td>

//                                     <td>

//                                         ₹{" "}
//                                         {Number(
//                                             item.total ||
//                                             (
//                                                 item.price *
//                                                 item.quantity
//                                             ) ||
//                                             0
//                                         ).toLocaleString(
//                                             "en-IN"
//                                         )}

//                                     </td>

//                                 </tr>

//                             )
//                         )}

//                     </tbody>

//                 </table>



//                 <hr />



//                 {/* TOTAL */}

//                 <div className="invoice-summary">


//                     <div className="summary-row">

//                         <span>
//                             Subtotal
//                         </span>

//                         <span>
//                             ₹{" "}
//                             {Number(
//                                 invoice.subtotal || 0
//                             ).toLocaleString(
//                                 "en-IN"
//                             )}
//                         </span>

//                     </div>


//                     <div className="summary-row">

//                         <span>
//                             Discount
//                         </span>

//                         <span>
//                             ₹{" "}
//                             {Number(
//                                 invoice.discount || 0
//                             ).toLocaleString(
//                                 "en-IN"
//                             )}
//                         </span>

//                     </div>


//                     <div className="summary-row grand">

//                         <strong>
//                             TOTAL
//                         </strong>

//                         <strong>
//                             ₹{" "}
//                             {Number(
//                                 invoice.totalAmount || 0
//                             ).toLocaleString(
//                                 "en-IN"
//                             )}
//                         </strong>

//                     </div>


//                     <div className="summary-row">

//                         <span>
//                             Paid
//                         </span>

//                         <span>
//                             ₹{" "}
//                             {Number(
//                                 invoice.paidAmount || 0
//                             ).toLocaleString(
//                                 "en-IN"
//                             )}
//                         </span>

//                     </div>


//                     <div className="summary-row balance">

//                         <strong>
//                             Balance
//                         </strong>

//                         <strong>
//                             ₹{" "}
//                             {Number(
//                                 invoice.balanceAmount || 0
//                             ).toLocaleString(
//                                 "en-IN"
//                             )}
//                         </strong>

//                     </div>


//                 </div>



//                 <hr />



//                 {/* PAYMENT */}

//                 <div className="payment-section">


//                     <h3>
//                         PAYMENT INFORMATION
//                     </h3>


//                     <p>

//                         <strong>
//                             Payment Status:
//                         </strong>{" "}

//                         <span className="paid-status">

//                             {invoice.paymentStatus}

//                         </span>

//                     </p>


//                     <p>

//                         <strong>
//                             Payment Method:
//                         </strong>{" "}

//                         {invoice.paymentMethod ||
//                             "CASH"}

//                     </p>


//                     {payment?._id && (

//                         <p>

//                             <strong>
//                                 Transaction ID:
//                             </strong>{" "}

//                             {payment.paymentId ||
//                                 payment._id}

//                         </p>

//                     )}


//                 </div>



//                 {/* WALK-IN */}

//                 {invoice.orderSource ===
//                     "WALK_IN" && (

//                     <div className="walkin-badge">

//                         WALK-IN ORDER

//                     </div>

//                 )}



//                 {/* FOOTER */}

//                 <div className="invoice-footer">

//                     <p>
//                         Thank you for shopping with
//                         Zaid Infotech!
//                     </p>

//                     <p>
//                         This is a computer-generated
//                         invoice.
//                     </p>


//                     <div className="signature">

//                         ______________________

//                         <br />

//                         Authorized Signature

//                     </div>

//                 </div>


//             </div>

//         </div>

//     );

// }


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


  // ======================================================
  // TOTALS
  // ======================================================

  const subtotal =
    numberValue(invoice.subtotal);

  const discount =
    numberValue(invoice.discount);

  const totalAmount =
    numberValue(invoice.totalAmount);

  const paidAmount =
    numberValue(invoice.paidAmount);

  const balanceAmount =
    numberValue(invoice.balanceAmount);


  // ======================================================
  // TAX
  // ======================================================

  let cgstAmount =
    numberValue(
      invoice.cgstAmount ||
      invoice.cgst ||
      invoice.tax?.cgstAmount
    );

  let sgstAmount =
    numberValue(
      invoice.sgstAmount ||
      invoice.sgst ||
      invoice.tax?.sgstAmount
    );

  let taxAmount =
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


  // ======================================================
  // TAX RATES
  // ======================================================

  const cgstRate =
    invoice.cgstRate ||
    invoice.tax?.cgstRate ||
    9;

  const sgstRate =
    invoice.sgstRate ||
    invoice.tax?.sgstRate ||
    9;


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


                {discount > 0 && (
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

                    <th colSpan="2">
                      CGST
                    </th>

                    <th colSpan="2">
                      SGST
                    </th>

                    <th rowSpan="2">
                      Total Tax
                    </th>

                  </tr>

                  <tr>

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

                  </tr>

                </thead>


                <tbody>

                  {items.map(
                    (item, index) => {

                      const itemAmount =
                        numberValue(
                          item.total
                        ) ||
                        (
                          numberValue(
                            item.price
                          ) *
                          numberValue(
                            item.quantity
                          )
                        );

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

                      return (
                        <tr
                          key={`tax-${index}`}
                        >

                          <td>
                            {item.hsnSac ||
                              item.hsn ||
                              item.sac ||
                              item.hsnCode ||
                              "-"}
                          </td>

                          <td className="text-right">
                            {formatCurrency(
                              itemAmount
                            )}
                          </td>

                          <td className="text-center">
                            {item.cgstRate ||
                              cgstRate}
                            %
                          </td>

                          <td className="text-right">
                            {formatCurrency(
                              itemCGST
                            )}
                          </td>

                          <td className="text-center">
                            {item.sgstRate ||
                              sgstRate}
                            %
                          </td>

                          <td className="text-right">
                            {formatCurrency(
                              itemSGST
                            )}
                          </td>

                          <td className="text-right">
                            {formatCurrency(
                              itemTax ||
                              itemCGST +
                                itemSGST
                            )}
                          </td>

                        </tr>
                      );
                    }
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
                          subtotal -
                            discount
                        )}
                      </strong>
                    </td>

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
                {invoice.amountInWords ||
                  invoice.totalInWords ||
                  "Amount as per invoice"}
              </p>


              <div className="payment-small-info">

                <div className="bottom-section-title">
                  Payment Information
                </div>

                <p>
                  <strong>
                    Payment Status:
                  </strong>{" "}
                  {invoice.paymentStatus ||
                    "PAID"}
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
                    subtotal - discount
                  )}
                </strong>

              </div>


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