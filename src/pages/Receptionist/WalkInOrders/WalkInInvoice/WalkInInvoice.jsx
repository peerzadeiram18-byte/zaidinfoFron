// import React, {
//   useEffect,
//   useState,
// } from "react";

// import {
//   useNavigate,
//   useParams,
// } from "react-router-dom";

// import {
//   getInvoiceById,
//   getInvoiceByOrderId,
// } from "../../../../services/invoiceService.js";

// import "./WalkInInvoice.css";

// function WalkInInvoice({
//   invoice: invoiceProp,
//   order: orderProp,
//   onClose,
// }) {

//   const {
//     invoiceId,
//     orderId,
//   } = useParams();

//   const navigate = useNavigate();

//   const [invoice, setInvoice] =
//     useState(invoiceProp || null);

//   const [loading, setLoading] =
//     useState(!invoiceProp);

//   const [error, setError] =
//     useState("");

//   // ==========================================
//   // FETCH INVOICE
//   // ==========================================

//   useEffect(() => {

//     if (invoiceProp) {
//       setInvoice(invoiceProp);
//       setLoading(false);
//       return;
//     }

//     const loadInvoice =
//       async () => {

//         try {

//           setLoading(true);
//           setError("");

//           let response;

//           if (invoiceId) {

//             response =
//               await getInvoiceById(
//                 invoiceId
//               );

//           } else if (orderId) {

//             response =
//               await getInvoiceByOrderId(
//                 orderId
//               );

//           } else if (orderProp?._id) {

//             response =
//               await getInvoiceByOrderId(
//                 orderProp._id
//               );

//           } else {

//             throw new Error(
//               "Invoice ID or Order ID is missing"
//             );

//           }

//           setInvoice(
//             response?.data || null
//           );

//         } catch (err) {

//           console.error(
//             "Invoice loading error:",
//             err
//           );

//           setError(
//             err?.response?.data?.message ||
//             err.message ||
//             "Failed to load invoice"
//           );

//         } finally {

//           setLoading(false);

//         }
//       };

//     loadInvoice();

//   }, [
//     invoiceProp,
//     invoiceId,
//     orderId,
//     orderProp,
//   ]);

//   // ==========================================
//   // PRINT
//   // ==========================================

//   const printInvoice = () => {

//     window.print();

//   };

//   // ==========================================
//   // CLOSE
//   // ==========================================

//   const handleClose = () => {

//     if (onClose) {

//       onClose();
//       return;

//     }

//     navigate(-1);

//   };

//   // ==========================================
//   // LOADING
//   // ==========================================

//   if (loading) {

//     return (
//       <div className="invoice-loading">

//         <div className="invoice-loading-card">

//           <div className="invoice-spinner" />

//           <h3>
//             Loading Invoice...
//           </h3>

//           <p>
//             Please wait while we fetch
//             your invoice.
//           </p>

//         </div>

//       </div>
//     );

//   }

//   // ==========================================
//   // ERROR
//   // ==========================================

//   if (error) {

//     return (
//       <div className="invoice-error">

//         <div className="invoice-error-card">

//           <h2>
//             Unable to Load Invoice
//           </h2>

//           <p>
//             {error}
//           </p>

//           <div className="invoice-error-actions">

//             <button
//               onClick={() =>
//                 navigate(-1)
//               }
//             >
//               Go Back
//             </button>

//           </div>

//         </div>

//       </div>
//     );

//   }

//   // ==========================================
//   // NO INVOICE
//   // ==========================================

//   if (!invoice) {

//     return (
//       <div className="invoice-error">

//         <div className="invoice-error-card">

//           <h2>
//             Invoice Not Found
//           </h2>

//           <button
//             onClick={() =>
//               navigate(-1)
//             }
//           >
//             Go Back
//           </button>

//         </div>

//       </div>
//     );

//   }

//   // ==========================================
//   // DATA
//   // ==========================================

//   const customer =
//     invoice.billingAddress || {};

//   const items =
//     invoice.items || [];

//   const invoiceDate =
//     invoice.invoiceDate ||
//     invoice.createdAt;

//   const formatCurrency =
//     (value) => {

//       return new Intl.NumberFormat(
//         "en-IN",
//         {
//           style: "currency",
//           currency: "INR",
//           maximumFractionDigits: 2,
//         }
//       ).format(
//         Number(value || 0)
//       );

//     };

//   const formatDate =
//     (value) => {

//       if (!value) {
//         return "-";
//       }

//       return new Date(
//         value
//       ).toLocaleDateString(
//         "en-IN",
//         {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//         }
//       );

//     };

//   const formatDateTime =
//     (value) => {

//       if (!value) {
//         return "-";
//       }

//       return new Date(
//         value
//       ).toLocaleString(
//         "en-IN",
//         {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         }
//       );

//     };

//   // ==========================================
//   // ORDER NUMBER
//   // ==========================================

//   const orderNumber =
//     invoice.order?._id ||
//     invoice.referenceId ||
//     "-";

//   // ==========================================
//   // PAYMENT
//   // ==========================================

//   const payment =
//     invoice.payment || {};

//   const transactionId =
//     payment.paymentId ||
//     payment.transactionId ||
//     payment.razorpayPaymentId ||
//     "-";

//   // ==========================================
//   // RENDER
//   // ==========================================

//   return (

//     <div className="walkin-invoice-page">

//       <div className="walkin-invoice-container">

//         {/* =====================================
//             TOP ACTIONS
//         ====================================== */}

//         <div className="invoice-actions no-print">

//           <button
//             className="invoice-action-btn print"
//             onClick={printInvoice}
//           >
//             🖨 Print Invoice
//           </button>

//           <button
//             className="invoice-action-btn close"
//             onClick={handleClose}
//           >
//             ✕ Close
//           </button>

//         </div>

//         {/* =====================================
//             INVOICE PAPER
//         ====================================== */}

//         <div
//           className="invoice-paper"
//           id="walkin-invoice"
//         >

//           {/* ===================================
//               HEADER
//           ==================================== */}

//           <div className="invoice-header">

//             <div className="company-info">

//               <h1>
//                 ZAID INFOTECH
//               </h1>

//               <p>
//                 Sales & Service Center
//               </p>

//               <p>
//                 Srinagar, Jammu & Kashmir
//               </p>

//               <p>
//                 Phone: +91 XXXXX XXXXX
//               </p>

//             </div>

//             <div className="invoice-title">

//               <h2>
//                 INVOICE
//               </h2>

//               <span>
//                 WALK-IN ORDER
//               </span>

//             </div>

//           </div>

//           <div className="invoice-line" />

//           {/* ===================================
//               INVOICE META
//           ==================================== */}

//           <div className="invoice-meta-grid">

//             <div>

//               <span>
//                 Invoice No
//               </span>

//               <strong>
//                 {invoice.invoiceNumber}
//               </strong>

//             </div>

//             <div>

//               <span>
//                 Order No
//               </span>

//               <strong>
//                 #{String(orderNumber)}
//               </strong>

//             </div>

//             <div>

//               <span>
//                 Invoice Date
//               </span>

//               <strong>
//                 {formatDate(
//                   invoiceDate
//                 )}
//               </strong>

//             </div>

//             <div>

//               <span>
//                 Order Type
//               </span>

//               <strong>
//                 {invoice.orderSource ||
//                   "WALK_IN"}
//               </strong>

//             </div>

//           </div>

//           <div className="invoice-line" />

//           {/* ===================================
//               CUSTOMER
//           ==================================== */}

//           <div className="customer-section">

//             <div className="customer-column">

//               <h3>
//                 BILL TO
//               </h3>

//               <p>
//                 <strong>
//                   {customer.fullName ||
//                     invoice.user?.firstName ||
//                     "Customer"}
//                 </strong>
//               </p>

//               {customer.phone && (
//                 <p>
//                   Phone:{" "}
//                   {customer.phone}
//                 </p>
//               )}

//               {invoice.user?.email && (
//                 <p>
//                   Email:{" "}
//                   {invoice.user.email}
//                 </p>
//               )}

//             </div>

//             <div className="customer-column">

//               <h3>
//                 ADDRESS
//               </h3>

//               {customer.addressLine && (
//                 <p>
//                   {customer.addressLine}
//                 </p>
//               )}

//               <p>
//                 {customer.city}
//                 {customer.city &&
//                   customer.state
//                   ? ", "
//                   : ""}
//                 {customer.state}
//               </p>

//               {customer.pincode && (
//                 <p>
//                   {customer.pincode}
//                 </p>
//               )}

//               <p>
//                 {customer.country ||
//                   "India"}
//               </p>

//             </div>

//           </div>

//           <div className="invoice-line" />

//           {/* ===================================
//               ITEMS
//           ==================================== */}

//           <div className="items-section">

//             <h3>
//               ITEMS
//             </h3>

//             <table className="invoice-table">

//               <thead>

//                 <tr>

//                   <th>
//                     #
//                   </th>

//                   <th>
//                     ITEM
//                   </th>

//                   <th>
//                     QTY
//                   </th>

//                   <th>
//                     PRICE
//                   </th>

//                   <th>
//                     DISCOUNT
//                   </th>

//                   <th>
//                     TOTAL
//                   </th>

//                 </tr>

//               </thead>

//               <tbody>

//                 {items.length > 0 ? (

//                   items.map(
//                     (item, index) => (

//                       <tr
//                         key={
//                           item._id ||
//                           index
//                         }
//                       >

//                         <td>
//                           {index + 1}
//                         </td>

//                         <td>

//                           <div className="item-name">

//                             {item.title ||
//                               item.description ||
//                               "Product"}

//                           </div>

//                           {item.description && (
//                             <small>
//                               {
//                                 item.description
//                               }
//                             </small>
//                           )}

//                         </td>

//                         <td>
//                           {item.quantity}
//                         </td>

//                         <td>
//                           {formatCurrency(
//                             item.price
//                           )}
//                         </td>

//                         <td>
//                           {formatCurrency(
//                             item.discountAmount
//                           )}
//                         </td>

//                         <td>
//                           {formatCurrency(
//                             item.total ??
//                             (
//                               Number(
//                                 item.price ||
//                                 0
//                               ) *
//                               Number(
//                                 item.quantity ||
//                                 0
//                               )
//                             )
//                           )}
//                         </td>

//                       </tr>

//                     )
//                   )

//                 ) : (

//                   <tr>

//                     <td
//                       colSpan="6"
//                       className="empty-items"
//                     >
//                       No items found
//                     </td>

//                   </tr>

//                 )}

//               </tbody>

//             </table>

//           </div>

//           <div className="invoice-line" />

//           {/* ===================================
//               TOTALS
//           ==================================== */}

//           <div className="invoice-summary">

//             <div className="summary-spacer" />

//             <div className="summary-box">

//               <div className="summary-row">

//                 <span>
//                   Subtotal
//                 </span>

//                 <strong>
//                   {formatCurrency(
//                     invoice.subtotal
//                   )}
//                 </strong>

//               </div>

//               <div className="summary-row">

//                 <span>
//                   Discount
//                 </span>

//                 <strong>
//                   -{" "}
//                   {formatCurrency(
//                     invoice.discount
//                   )}
//                 </strong>

//               </div>

//               <div className="summary-row total">

//                 <span>
//                   TOTAL
//                 </span>

//                 <strong>
//                   {formatCurrency(
//                     invoice.totalAmount
//                   )}
//                 </strong>

//               </div>

//               <div className="summary-row paid">

//                 <span>
//                   Amount Paid
//                 </span>

//                 <strong>
//                   {formatCurrency(
//                     invoice.paidAmount
//                   )}
//                 </strong>

//               </div>

//               <div className="summary-row balance">

//                 <span>
//                   Balance Due
//                 </span>

//                 <strong>
//                   {formatCurrency(
//                     invoice.balanceAmount
//                   )}
//                 </strong>

//               </div>

//             </div>

//           </div>

//           <div className="invoice-line" />

//           {/* ===================================
//               PAYMENT
//           ==================================== */}

//           <div className="payment-section">

//             <h3>
//               PAYMENT INFORMATION
//             </h3>

//             <div className="payment-grid">

//               <div>

//                 <span>
//                   Payment Method
//                 </span>

//                 <strong>
//                   {invoice.paymentMethod ||
//                     "CASH"}
//                 </strong>

//               </div>

//               <div>

//                 <span>
//                   Payment Status
//                 </span>

//                 <strong
//                   className={
//                     invoice.paymentStatus ===
//                     "PAID"
//                       ? "status-paid"
//                       : "status-other"
//                   }
//                 >
//                   {invoice.paymentStatus ||
//                     "PAID"}
//                 </strong>

//               </div>

//               <div>

//                 <span>
//                   Transaction ID
//                 </span>

//                 <strong>
//                   {transactionId}
//                 </strong>

//               </div>

//               <div>

//                 <span>
//                   Payment Date
//                 </span>

//                 <strong>
//                   {formatDateTime(
//                     payment.createdAt ||
//                     invoice.updatedAt
//                   )}
//                 </strong>

//               </div>

//             </div>

//           </div>

//           <div className="invoice-line" />

//           {/* ===================================
//               FOOTER
//           ==================================== */}

//           <div className="invoice-footer">

//             <h3>
//               Thank You For Shopping With Us!
//             </h3>

//             <p>
//               ZAID INFOTECH
//             </p>

//             <p>
//               This is a computer-generated
//               invoice.
//             </p>

//             <div className="signature">

//               <div>
//                 ____________________
//               </div>

//               <span>
//                 Authorized Signature
//               </span>

//             </div>

//           </div>

//         </div>

//       </div>

//     </div>

//   );
// }

// export default WalkInInvoice;





import React from "react";
import "./WalkInInvoice.css";

function WalkInInvoice({ order, onClose }) {

    if (!order) {
        return null;
    }

    const printInvoice = () => {
        window.print();
    };

    // ============================================
    // SUPPORT BOTH:
    // 1. CREATED ORDER
    // 2. CREATED INVOICE
    // ============================================

    const isInvoice =
        Boolean(
            order.invoiceNumber ||
            order.invoiceFor
        );

    // ============================================
    // CUSTOMER
    // ============================================

    const customer =
        order.billingAddress ||
        order.shippingAddress ||
        {};

    // ============================================
    // ITEMS
    // ============================================

    const items =
        order.items ||
        order.orderItems ||
        [];

    // ============================================
    // INVOICE NUMBER
    // ============================================

    const invoiceNumber =
        order.invoiceNumber ||
        order._id ||
        "N/A";

    // ============================================
    // DATE
    // ============================================

    const invoiceDate =
        order.invoiceDate ||
        order.createdAt ||
        new Date();

    // ============================================
    // TOTALS
    // ============================================

    const subtotal =
        Number(
            order.subtotal ??
            order.totalAmount ??
            0
        );

    const discount =
        Number(
            order.discount ??
            0
        );

    const totalAmount =
        Number(
            order.totalAmount ??
            0
        );

    const paidAmount =
        Number(
            order.paidAmount ??
            (
                order.paymentStatus === "PAID"
                    ? totalAmount
                    : 0
            )
        );

    const balanceAmount =
        Number(
            order.balanceAmount ??
            Math.max(
                totalAmount - paidAmount,
                0
            )
        );

    // ============================================
    // PAYMENT
    // ============================================

    const paymentMethod =
        order.paymentMethod ||
        "CASH";

    const paymentStatus =
        order.paymentStatus ||
        "PAID";

    const orderSource =
        order.orderSource ||
        "WALK_IN";

    return (
        <div className="invoice-overlay">

            <div className="invoice-container">

                {/* ====================================
                    HEADER
                ==================================== */}

                <div className="invoice-header">

                    <h1>
                        ZAID INFOTECH
                    </h1>

                    <p>
                        Sales & Service Center
                    </p>

                    <p>
                        Srinagar, Jammu & Kashmir
                    </p>

                    <p>
                        Phone: +91 XXXXX XXXXX
                    </p>

                    <h2>
                        INVOICE
                    </h2>

                </div>

                <hr />

                {/* ====================================
                    INVOICE DETAILS
                ==================================== */}

                <div className="invoice-top">

                    <div>

                        <h4>
                            Invoice No
                        </h4>

                        <p>
                            {invoiceNumber}
                        </p>

                    </div>

                    <div>

                        <h4>
                            Date
                        </h4>

                        <p>
                            {new Date(
                                invoiceDate
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </p>

                    </div>

                    <div>

                        <h4>
                            Type
                        </h4>

                        <p>
                            {orderSource}
                        </p>

                    </div>

                </div>

                <hr />

                {/* ====================================
                    CUSTOMER
                ==================================== */}

                <div className="customer-box">

                    <h3>
                        Customer Details
                    </h3>

                    <p>
                        <strong>
                            Name:
                        </strong>{" "}
                        {customer.fullName ||
                            "Walk-In Customer"}
                    </p>

                    <p>
                        <strong>
                            Phone:
                        </strong>{" "}
                        {customer.phone ||
                            "-"}
                    </p>

                    {customer.email && (
                        <p>
                            <strong>
                                Email:
                            </strong>{" "}
                            {customer.email}
                        </p>
                    )}

                    <p>
                        <strong>
                            Address:
                        </strong>{" "}
                        {customer.addressLine ||
                            "-"}
                    </p>

                    <p>
                        {customer.city || ""}
                        {customer.city &&
                            customer.state
                            ? ", "
                            : ""}
                        {customer.state || ""}
                    </p>

                    <p>
                        {customer.pincode || ""}
                    </p>

                </div>

                <hr />

                {/* ====================================
                    ITEMS
                ==================================== */}

                <table className="invoice-table">

                    <thead>

                        <tr>

                            <th>
                                #
                            </th>

                            <th>
                                Product
                            </th>

                            <th>
                                Qty
                            </th>

                            <th>
                                Price
                            </th>

                            <th>
                                Total
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {items.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    style={{
                                        textAlign:
                                            "center",
                                    }}
                                >
                                    No items found
                                </td>

                            </tr>

                        ) : (

                            items.map(
                                (item, index) => {

                                    const quantity =
                                        Number(
                                            item.quantity ||
                                            1
                                        );

                                    const price =
                                        Number(
                                            item.price ||
                                            item.originalPrice ||
                                            0
                                        );

                                    const itemTotal =
                                        Number(
                                            item.total ??
                                            price *
                                                quantity
                                        );

                                    return (
                                        <tr
                                            key={
                                                item._id ||
                                                item.product ||
                                                index
                                            }
                                        >

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                {item.title ||
                                                    item.name ||
                                                    "Product"}
                                            </td>

                                            <td>
                                                {quantity}
                                            </td>

                                            <td>
                                                ₹{" "}
                                                {price.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                            <td>
                                                ₹{" "}
                                                {itemTotal.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                        </tr>
                                    );
                                }
                            )

                        )}

                    </tbody>

                </table>

                <hr />

                {/* ====================================
                    TOTALS
                ==================================== */}

                <div className="invoice-total">

                    <div className="total-row">

                        <span>
                            Subtotal
                        </span>

                        <span>
                            ₹{" "}
                            {subtotal.toLocaleString(
                                "en-IN"
                            )}
                        </span>

                    </div>

                    <div className="total-row">

                        <span>
                            Discount
                        </span>

                        <span>
                            ₹{" "}
                            {discount.toLocaleString(
                                "en-IN"
                            )}
                        </span>

                    </div>

                    <hr />

                    <div className="grand-total">

                        <strong>
                            Grand Total
                        </strong>

                        <strong>
                            ₹{" "}
                            {totalAmount.toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>

                    <div className="total-row">

                        <span>
                            Paid
                        </span>

                        <span>
                            ₹{" "}
                            {paidAmount.toLocaleString(
                                "en-IN"
                            )}
                        </span>

                    </div>

                    <div className="total-row">

                        <span>
                            Balance
                        </span>

                        <span>
                            ₹{" "}
                            {balanceAmount.toLocaleString(
                                "en-IN"
                            )}
                        </span>

                    </div>

                </div>

                <hr />

                {/* ====================================
                    PAYMENT
                ==================================== */}

                <div className="payment-box">

                    <p>

                        <strong>
                            Payment Method:
                        </strong>{" "}

                        {paymentMethod}

                    </p>

                    <p>

                        <strong>
                            Payment Status:
                        </strong>{" "}

                        {paymentStatus}

                    </p>

                    <p>

                        <strong>
                            Order Source:
                        </strong>{" "}

                        {orderSource}

                    </p>

                </div>

                <hr />

                {/* ====================================
                    FOOTER
                ==================================== */}

                <div className="invoice-footer">

                    <p>
                        Thank You For Shopping
                        With Us
                    </p>

                    <p>
                        ZAID INFOTECH
                    </p>

                    <br />

                    <div className="signature">

                        ______________________

                        <br />

                        Authorized Signature

                    </div>

                    <br />

                    <small>
                        This is a computer-generated
                        invoice.
                    </small>

                </div>

                {/* ====================================
                    BUTTONS
                ==================================== */}

                <div className="invoice-buttons">

                    <button
                        className="print-btn"
                        onClick={printInvoice}
                    >
                        PRINT INVOICE
                    </button>

                    <button
                        className="close-btn"
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