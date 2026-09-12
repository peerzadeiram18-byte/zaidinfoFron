// import { useEffect, useState } from "react";

// import {
//     getInvoices,
// } from "../../../services/invoiceService";
// import { toast } from "react-toastify";

// import WalkInInvoice from "../../Receptionist/WalkInOrders/WalkInInvoice/WalkInInvoice";

// import "./AdminInvoices.css";

// function AdminInvoices() {

//     const [invoices, setInvoices] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedInvoice, setSelectedInvoice] = useState(null);

//     // ==========================================
//     // LOAD INVOICES
//     // ==========================================

//     useEffect(() => {
//         loadInvoices();
//     }, []);

//     const loadInvoices = async () => {

//         try {

//             setLoading(true);

//             const response = await getInvoices();

//             console.log(
//                 "ADMIN INVOICES FULL:",
//                 JSON.stringify(response, null, 2)
//             );

//             const invoiceList =
//                 response?.invoices ||
//                 response?.data?.invoices ||
//                 response?.data ||
//                 [];

//             console.log(
//                 "FINAL INVOICE LIST:",
//                 invoiceList
//             );

//             if (Array.isArray(invoiceList)) {

//                 invoiceList.forEach((invoice, index) => {

//                     console.log(
//                         `INVOICE ${index + 1}:`,
//                         {
//                             invoiceId: invoice?._id,
//                             invoiceNumber:
//                                 invoice?.invoiceNumber,

//                             invoiceFor:
//                                 invoice?.invoiceFor,

//                             orderSource:
//                                 invoice?.orderSource,

//                             nestedOrderSource:
//                                 invoice?.order?.orderSource,

//                             orderId:
//                                 invoice?.order?._id,

//                             totalAmount:
//                                 invoice?.totalAmount,

//                             invoiceItems:
//                                 invoice?.items?.length,

//                             orderItems:
//                                 invoice?.order?.orderItems?.length,

//                             paymentStatus:
//                                 invoice?.paymentStatus,

//                             paymentMethod:
//                                 invoice?.paymentMethod,
//                         }
//                     );

//                 });

//             }

//             setInvoices(
//                 Array.isArray(invoiceList)
//                     ? invoiceList
//                     : []
//             );

//         }

//         catch (error) {

//             console.error(
//                 "LOAD ADMIN INVOICES ERROR:",
//                 error
//             );

//             console.error(
//                 "BACKEND ERROR:",
//                 error?.response?.data
//             );

//             toast.error(
//                 error?.response?.data?.message ||
//                 "Unable to load invoices"
//             );

//         }

//         finally {

//             setLoading(false);

//         }

//     };

//     // ==========================================
//     // GET CUSTOMER NAME
//     // ==========================================

//     const getCustomerName = (invoice) => {

//         return (
//             invoice?.billingAddress?.fullName ||

//             invoice?.billingAddress?.name ||

//             invoice?.shippingAddress?.fullName ||

//             invoice?.shippingAddress?.name ||

//             invoice?.order?.shippingAddress?.fullName ||

//             invoice?.order?.shippingAddress?.name ||

//             invoice?.user?.fullName ||

//             invoice?.user?.name ||

//             "Walk-In Customer"
//         );

//     };

//     // ==========================================
//     // GET ORDER SOURCE
//     // ==========================================

//     const getOrderSource = (invoice) => {

//         const source =
//             invoice?.orderSource ||
//             invoice?.order?.orderSource ||
//             invoice?.orderSourceType ||
//             invoice?.order?.orderSourceType ||
//             "WALK_IN";

//         return String(source).toUpperCase();

//     };

//     // ==========================================
//     // GET AMOUNT
//     // ==========================================

//     const getAmount = (invoice) => {

//         return Number(
//             invoice?.totalAmount ??
//             invoice?.grandTotal ??
//             invoice?.order?.totalAmount ??
//             0
//         );

//     };

//     // ==========================================
//     // CONVERT INVOICE TO ORDER FORMAT
//     //
//     // IMPORTANT:
//     //
//     // WalkInInvoice component expects ORDER
//     // object, not INVOICE object.
//     //
//     // So we convert invoice -> order.
//     // ==========================================

//     const invoiceToOrder = (invoice) => {

//         if (!invoice) {
//             return null;
//         }

//         // --------------------------------------
//         // If backend already populated order,
//         // use that as the base.
//         // --------------------------------------

//         const originalOrder =
//             invoice?.order &&
//             typeof invoice.order === "object"
//                 ? invoice.order
//                 : {};

//         // --------------------------------------
//         // Convert invoice.items -> orderItems
//         // --------------------------------------

//         const invoiceItems =
//             Array.isArray(invoice?.items)
//                 ? invoice.items
//                 : [];

//         const originalOrderItems =
//             Array.isArray(originalOrder?.orderItems)
//                 ? originalOrder.orderItems
//                 : [];

//         const sourceItems =
//             originalOrderItems.length > 0
//                 ? originalOrderItems
//                 : invoiceItems;

//         const orderItems = sourceItems.map(
//             (item) => {

//                 const product =
//                     item?.product &&
//                     typeof item.product === "object"
//                         ? item.product
//                         : null;

//                 return {

//                     // Product ID
//                     product:
//                         item?.product?._id ||
//                         item?.product ||
//                         null,

//                     // Product object for UI
//                     productData:
//                         product,

//                     title:
//                         item?.title ||
//                         product?.name ||
//                         product?.title ||
//                         "Product",

//                     name:
//                         item?.name ||
//                         item?.title ||
//                         product?.name ||
//                         product?.title ||
//                         "Product",

//                     quantity:
//                         Number(
//                             item?.quantity || 1
//                         ),

//                     originalPrice:
//                         Number(
//                             item?.originalPrice ??
//                             item?.price ??
//                             0
//                         ),

//                     discountAmount:
//                         Number(
//                             item?.discountAmount || 0
//                         ),

//                     price:
//                         Number(
//                             item?.price ??
//                             item?.originalPrice ??
//                             0
//                         ),

//                     total:
//                         Number(
//                             item?.total ??
//                             (
//                                 Number(
//                                     item?.price ??
//                                     item?.originalPrice ??
//                                     0
//                                 ) *
//                                 Number(
//                                     item?.quantity || 1
//                                 )
//                             )
//                         ),

//                     imageUrl:
//                         item?.imageUrl ||
//                         product?.imageUrl ||
//                         product?.images?.[0] ||
//                         "",

//                 };

//             }
//         );

//         // --------------------------------------
//         // ADDRESS
//         // --------------------------------------

//         const shippingAddress =
//             originalOrder?.shippingAddress ||
//             invoice?.billingAddress ||
//             invoice?.shippingAddress ||
//             {};

//         // --------------------------------------
//         // RETURN ORDER FORMAT
//         // --------------------------------------

//         const convertedOrder = {

//             // Original order data first
//             ...originalOrder,

//             // ----------------------------------
//             // IDs
//             // ----------------------------------

//             _id:
//                 originalOrder?._id ||
//                 invoice?.order?._id ||
//                 invoice?.order ||
//                 invoice?._id,

//             orderId:
//                 originalOrder?._id ||
//                 invoice?.order?._id ||
//                 invoice?.order ||
//                 invoice?._id,

//             // ----------------------------------
//             // Customer
//             // ----------------------------------

//             user:
//                 originalOrder?.user ||
//                 invoice?.user ||
//                 null,

//             // ----------------------------------
//             // Items
//             // ----------------------------------

//             orderItems,

//             items: invoiceItems,

//             // ----------------------------------
//             // Amounts
//             // ----------------------------------

//             subtotal:
//                 Number(
//                     originalOrder?.subtotal ??
//                     invoice?.subtotal ??
//                     0
//                 ),

//             discount:
//                 Number(
//                     originalOrder?.discount ??
//                     invoice?.discount ??
//                     0
//                 ),

//             totalAmount:
//                 Number(
//                     originalOrder?.totalAmount ??
//                     invoice?.totalAmount ??
//                     0
//                 ),

//             paidAmount:
//                 Number(
//                     originalOrder?.paidAmount ??
//                     invoice?.paidAmount ??
//                     invoice?.totalAmount ??
//                     0
//                 ),

//             balanceAmount:
//                 Number(
//                     originalOrder?.balanceAmount ??
//                     invoice?.balanceAmount ??
//                     0
//                 ),

//             // ----------------------------------
//             // Status
//             // ----------------------------------

//             paymentStatus:
//                 originalOrder?.paymentStatus ||
//                 invoice?.paymentStatus ||
//                 "PAID",

//             orderStatus:
//                 originalOrder?.orderStatus ||
//                 "DELIVERED",

//             // ----------------------------------
//             // Payment
//             // ----------------------------------

//             paymentMethod:
//                 originalOrder?.paymentMethod ||
//                 invoice?.paymentMethod ||
//                 invoice?.payment?.paymentMethod ||
//                 "UPI",

//             payment:
//                 originalOrder?.payment ||
//                 invoice?.payment ||
//                 null,

//             // ----------------------------------
//             // Source
//             // ----------------------------------

//             orderSource:
//                 originalOrder?.orderSource ||
//                 invoice?.orderSource ||
//                 "WALK_IN",

//             // ----------------------------------
//             // Address
//             // ----------------------------------

//             shippingAddress,

//             billingAddress:
//                 invoice?.billingAddress ||
//                 originalOrder?.billingAddress ||
//                 shippingAddress,

//             // ----------------------------------
//             // Invoice information
//             // ----------------------------------

//             invoiceNumber:
//                 invoice?.invoiceNumber,

//             invoiceId:
//                 invoice?._id,

//             invoiceDate:
//                 invoice?.invoiceDate,

//             invoiceFor:
//                 invoice?.invoiceFor ||
//                 "ORDER",

//         };

//         console.log(
//             "CONVERTED INVOICE -> ORDER:",
//             convertedOrder
//         );

//         return convertedOrder;

//     };

//     // ==========================================
//     // OPEN INVOICE
//     // ==========================================

//     const openInvoice = (invoice) => {

//         console.log(
//             "SELECTED INVOICE:",
//             invoice
//         );

//         const convertedOrder =
//             invoiceToOrder(invoice);

//         console.log(
//             "ORDER SENT TO WALKIN INVOICE:",
//             convertedOrder
//         );

//         setSelectedInvoice(
//             convertedOrder
//         );

//     };

//     // ==========================================
//     // CLOSE INVOICE
//     // ==========================================

//     const closeInvoice = () => {

//         setSelectedInvoice(null);

//     };

//     // ==========================================
//     // UI
//     // ==========================================

//     return (

//         <div className="admin-invoices-page">

//             {/* ==================================
//                 HEADER
//             ================================== */}

//             <div className="admin-invoices-header">

//                 <div>

//                     <h1>
//                         Invoices
//                     </h1>

//                     <p>
//                         All online and walk-in invoices
//                     </p>

//                 </div>

//                 <button
//                     type="button"
//                     onClick={loadInvoices}
//                     disabled={loading}
//                 >

//                     {loading
//                         ? "Loading..."
//                         : "Refresh"
//                     }

//                 </button>

//             </div>

//             {/* ==================================
//                 LOADING
//             ================================== */}

//             {loading ? (

//                 <div className="empty-invoices">

//                     <p>
//                         Loading invoices...
//                     </p>

//                 </div>

//             ) : invoices.length === 0 ? (

//                 /* ==================================
//                    EMPTY
//                 ================================== */

//                 <div className="empty-invoices">

//                     <h3>
//                         No invoices found
//                     </h3>

//                     <p>
//                         Online or Walk-In invoices
//                         will appear here after payment.
//                     </p>

//                 </div>

//             ) : (

//                 /* ==================================
//                    INVOICE LIST
//                 ================================== */

//                 <div className="invoice-list">

//                     {invoices.map(
//                         (invoice) => {

//                             const source =
//                                 getOrderSource(
//                                     invoice
//                                 );

//                             const customer =
//                                 getCustomerName(
//                                     invoice
//                                 );

//                             const amount =
//                                 getAmount(
//                                     invoice
//                                 );

//                             return (

//                                 <div
//                                     className="invoice-card"
//                                     key={
//                                         invoice?._id
//                                     }
//                                 >

//                                     {/* ==========================
//                                         LEFT
//                                     ========================== */}

//                                     <div className="invoice-card-info">

//                                         <h3>

//                                             {
//                                                 invoice?.invoiceNumber ||
//                                                 invoice?._id ||
//                                                 "Invoice"
//                                             }

//                                         </h3>

//                                         <p>

//                                             <strong>
//                                                 Customer:
//                                             </strong>{" "}

//                                             {customer}

//                                         </p>

//                                         <p>

//                                             <strong>
//                                                 Source:
//                                             </strong>{" "}

//                                             <span
//                                                 className={
//                                                     source === "ONLINE"
//                                                         ? "invoice-source online"
//                                                         : "invoice-source walkin"
//                                                 }
//                                             >

//                                                 {source === "ONLINE"
//                                                     ? "ONLINE"
//                                                     : "WALK-IN"
//                                                 }

//                                             </span>

//                                         </p>

//                                         <p>

//                                             <strong>
//                                                 Amount:
//                                             </strong>{" "}

//                                             ₹{" "}

//                                             {amount.toLocaleString(
//                                                 "en-IN"
//                                             )}

//                                         </p>

//                                         <p>

//                                             <strong>
//                                                 Payment:
//                                             </strong>{" "}

//                                             {
//                                                 invoice?.paymentMethod ||
//                                                 invoice?.payment?.paymentMethod ||
//                                                 "UPI"
//                                             }

//                                         </p>

//                                         <p>

//                                             <strong>
//                                                 Status:
//                                             </strong>{" "}

//                                             {
//                                                 invoice?.paymentStatus ||
//                                                 "PAID"
//                                             }

//                                         </p>

//                                     </div>

//                                     {/* ==========================
//                                         RIGHT
//                                     ========================== */}

//                                     <button
//                                         type="button"
//                                         className="view-invoice-btn"
//                                         onClick={() =>
//                                             openInvoice(
//                                                 invoice
//                                             )
//                                         }
//                                     >

//                                         View Invoice

//                                     </button>

//                                 </div>

//                             );

//                         }
//                     )}

//                 </div>

//             )}

//             {/* ==================================
//                 INVOICE MODAL
//             ================================== */}

//             {selectedInvoice && (

//                 <WalkInInvoice

//                     order={
//                         selectedInvoice
//                     }

//                     onClose={
//                         closeInvoice
//                     }

//                 />

//             )}

//         </div>

//     );

// }

// export default AdminInvoices;





import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiRefreshCw,
  FiEye,
  FiPrinter,
  FiX,
  FiTool,
  FiUser,
  FiMonitor,
  FiPhone,
  FiMail,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
} from "react-icons/fi";

import {
  getInvoices,
} from "../../../services/invoiceService";

import { toast } from "react-toastify";

import WalkInInvoice from "../../Receptionist/WalkInOrders/WalkInInvoice/WalkInInvoice";

import "./AdminInvoices.css";


// =====================================================
// API
// =====================================================

const API_URL = import.meta.env.VITE_API_URL;


// =====================================================
// ADMIN INVOICES
// =====================================================

function AdminInvoices() {

  // ===================================================
  // EXISTING INVOICE STATES
  // ===================================================

  const [invoices, setInvoices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedInvoice, setSelectedInvoice] = useState(null);


  // ===================================================
  // TECHNICIAN / REPAIR RECEIPT STATES
  // ===================================================

  const [technicianRepairs, setTechnicianRepairs] = useState([]);

  const [selectedTechnicianReceipt, setSelectedTechnicianReceipt] =
    useState(null);

  const [technicianLoading, setTechnicianLoading] =
    useState(false);


  // ===================================================
  // LOAD EVERYTHING
  // ===================================================

  useEffect(() => {

    loadInvoices();

  }, []);


  // ===================================================
  // AUTH CONFIG
  // ===================================================

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });


  // ===================================================
  // LOAD NORMAL ONLINE / WALK-IN INVOICES
  // EXISTING FUNCTIONALITY
  // ===================================================

  const loadInvoices = async () => {

    try {

      setLoading(true);


      // -----------------------------------------------
      // EXISTING INVOICE API
      // -----------------------------------------------

      const response = await getInvoices();


      console.log(
        "ADMIN INVOICES FULL:",
        JSON.stringify(response, null, 2)
      );


      const invoiceList =
        response?.invoices ||
        response?.data?.invoices ||
        response?.data ||
        [];


      console.log(
        "FINAL INVOICE LIST:",
        invoiceList
      );


      if (Array.isArray(invoiceList)) {

        invoiceList.forEach((invoice, index) => {

          console.log(
            `INVOICE ${index + 1}:`,
            {
              invoiceId: invoice?._id,

              invoiceNumber:
                invoice?.invoiceNumber,

              invoiceFor:
                invoice?.invoiceFor,

              orderSource:
                invoice?.orderSource,

              nestedOrderSource:
                invoice?.order?.orderSource,

              orderId:
                invoice?.order?._id,

              totalAmount:
                invoice?.totalAmount,

              paymentStatus:
                invoice?.paymentStatus,

              paymentMethod:
                invoice?.paymentMethod,
            }
          );

        });

      }


      setInvoices(
        Array.isArray(invoiceList)
          ? invoiceList
          : []
      );


    } catch (error) {

      console.error(
        "LOAD ADMIN INVOICES ERROR:",
        error
      );

      console.error(
        "BACKEND ERROR:",
        error?.response?.data
      );


      toast.error(
        error?.response?.data?.message ||
        "Unable to load invoices"
      );


    } finally {

      setLoading(false);

    }


    // =================================================
    // IMPORTANT:
    // Technician receipts are loaded separately.
    // Failure here MUST NOT break normal invoices.
    // =================================================

    loadTechnicianReceipts();

  };


  // ===================================================
  // LOAD TECHNICIAN / REPAIR RECEIPTS
  // ===================================================

  const loadTechnicianReceipts = async () => {

    try {

      setTechnicianLoading(true);


      const response = await axios.get(
        `${API_URL}/newRepair/`,
        getAuthConfig()
      );


      console.log(
        "TECHNICIAN RECEIPTS FULL:",
        JSON.stringify(response, null, 2)
      );


      const repairList =
        response?.data?.repairs ||
        response?.data?.data ||
        (Array.isArray(response?.data)
          ? response.data
          : []);


      console.log(
        "TECHNICIAN RECEIPT LIST:",
        repairList
      );


      setTechnicianRepairs(
        Array.isArray(repairList)
          ? repairList
          : []
      );


    } catch (error) {

      console.error(
        "LOAD TECHNICIAN RECEIPTS ERROR:",
        error
      );

      console.error(
        "TECHNICIAN BACKEND ERROR:",
        error?.response?.data
      );

      // -----------------------------------------------
      // IMPORTANT:
      // Do NOT show error toast here.
      // Existing invoices should continue working.
      // -----------------------------------------------

      setTechnicianRepairs([]);

    } finally {

      setTechnicianLoading(false);

    }

  };


  // ===================================================
  // GET CUSTOMER NAME
  // ===================================================

  const getCustomerName = (invoice) => {

    return (

      invoice?.billingAddress?.fullName ||

      invoice?.billingAddress?.name ||

      invoice?.shippingAddress?.fullName ||

      invoice?.shippingAddress?.name ||

      invoice?.order?.shippingAddress?.fullName ||

      invoice?.order?.shippingAddress?.name ||

      invoice?.user?.fullName ||

      invoice?.user?.name ||

      "Walk-In Customer"

    );

  };


  // ===================================================
  // GET ORDER SOURCE
  // ===================================================

  const getOrderSource = (invoice) => {

    const source =

      invoice?.orderSource ||

      invoice?.order?.orderSource ||

      invoice?.orderSourceType ||

      invoice?.order?.orderSourceType ||

      "WALK_IN";


    return String(source).toUpperCase();

  };


  // ===================================================
  // GET NORMAL INVOICE AMOUNT
  // ===================================================

  const getAmount = (invoice) => {

    return Number(

      invoice?.totalAmount ??

      invoice?.grandTotal ??

      invoice?.order?.totalAmount ??

      0

    );

  };


  // ===================================================
  // GET TECHNICIAN CUSTOMER NAME
  // ===================================================

  const getTechnicianCustomerName = (repair) => {

    return (

      repair?.customerName ||

      repair?.customer?.fullName ||

      repair?.customer?.name ||

      repair?.user?.fullName ||

      repair?.user?.name ||

      "Customer"

    );

  };


  // ===================================================
  // GET TECHNICIAN NAME
  // ===================================================

  const getTechnicianName = (repair) => {

    const technician =
      repair?.assignedTechnician ||
      repair?.technicianName;


    if (!technician) {

      return "Assigned Specialist";

    }


    if (typeof technician === "string") {

      // If this is already a name
      if (
        !technician.match(
          /^[0-9a-fA-F]{24}$/
        )
      ) {

        return technician;

      }

      return "Assigned Specialist";

    }


    if (typeof technician === "object") {

      const fullName =
        `${technician?.firstName || ""} ${
          technician?.lastName || ""
        }`.trim();


      return (

        fullName ||

        technician?.name ||

        technician?.fullName ||

        technician?.username ||

        "Assigned Specialist"

      );

    }


    return "Assigned Specialist";

  };


  // ===================================================
  // GET TECHNICIAN AMOUNT
  // ===================================================

  const getTechnicianAmount = (repair) => {

    // -----------------------------------------------
    // repairCost is the main amount used by the
    // existing technician receipt.
    // -----------------------------------------------

    const repairCost =
      Number(repair?.repairCost || 0);


    if (repairCost > 0) {

      return repairCost;

    }


    // -----------------------------------------------
    // Fallback if services array exists
    // -----------------------------------------------

    if (
      Array.isArray(repair?.services)
    ) {

      return repair.services.reduce(
        (sum, service) => {

          const part =
            Number(service?.partCost || 0);

          const labor =
            Number(service?.laborCost || 0);

          const total =
            Number(
              service?.totalCost ??
              part + labor
            );


          return sum + total;

        },
        0
      );

    }


    return 0;

  };


  // ===================================================
  // GET TECHNICIAN STATUS
  // ===================================================

  const getTechnicianStatus = (repair) => {

    return (

      repair?.status ||

      "Completed"

    );

  };


  // ===================================================
  // GET TECHNICIAN TICKET NUMBER
  // ===================================================

  const getTechnicianTicket = (repair) => {

    return (

      repair?.repairNumber ||

      repair?.ticketNumber ||

      (
        repair?._id
          ? `TECH-${repair._id.slice(-6).toUpperCase()}`
          : "TECH-RECEIPT"
      )

    );

  };


  // ===================================================
  // CONVERT NORMAL INVOICE -> ORDER
  // EXISTING FUNCTIONALITY
  // ===================================================

  const invoiceToOrder = (invoice) => {

    if (!invoice) {

      return null;

    }


    const originalOrder =

      invoice?.order &&

      typeof invoice.order === "object"

        ? invoice.order

        : {};


    const invoiceItems =

      Array.isArray(invoice?.items)

        ? invoice.items

        : [];


    const originalOrderItems =

      Array.isArray(
        originalOrder?.orderItems
      )

        ? originalOrder.orderItems

        : [];


    const sourceItems =

      originalOrderItems.length > 0

        ? originalOrderItems

        : invoiceItems;


    const orderItems = sourceItems.map(
      (item) => {

        const product =

          item?.product &&

          typeof item.product === "object"

            ? item.product

            : null;


        return {

          product:
            item?.product?._id ||
            item?.product ||
            null,


          productData:
            product,


          title:
            item?.title ||
            product?.name ||
            product?.title ||
            "Product",


          name:
            item?.name ||
            item?.title ||
            product?.name ||
            product?.title ||
            "Product",


          quantity:
            Number(
              item?.quantity || 1
            ),


          originalPrice:
            Number(
              item?.originalPrice ??
              item?.price ??
              0
            ),


          discountAmount:
            Number(
              item?.discountAmount || 0
            ),


          price:
            Number(
              item?.price ??
              item?.originalPrice ??
              0
            ),


          total:
            Number(
              item?.total ??
              (
                Number(
                  item?.price ??
                  item?.originalPrice ??
                  0
                ) *
                Number(
                  item?.quantity || 1
                )
              )
            ),


          imageUrl:
            item?.imageUrl ||
            product?.imageUrl ||
            product?.images?.[0] ||
            "",

        };

      }
    );


    const shippingAddress =

      originalOrder?.shippingAddress ||

      invoice?.billingAddress ||

      invoice?.shippingAddress ||

      {};


    const convertedOrder = {

      ...originalOrder,


      _id:
        originalOrder?._id ||
        invoice?.order?._id ||
        invoice?.order ||
        invoice?._id,


      orderId:
        originalOrder?._id ||
        invoice?.order?._id ||
        invoice?.order ||
        invoice?._id,


      user:
        originalOrder?.user ||
        invoice?.user ||
        null,


      orderItems,


      items:
        invoiceItems,


      subtotal:
        Number(
          originalOrder?.subtotal ??
          invoice?.subtotal ??
          0
        ),


      discount:
        Number(
          originalOrder?.discount ??
          invoice?.discount ??
          0
        ),


      totalAmount:
        Number(
          originalOrder?.totalAmount ??
          invoice?.totalAmount ??
          0
        ),


      paidAmount:
        Number(
          originalOrder?.paidAmount ??
          invoice?.paidAmount ??
          invoice?.totalAmount ??
          0
        ),


      balanceAmount:
        Number(
          originalOrder?.balanceAmount ??
          invoice?.balanceAmount ??
          0
        ),


      paymentStatus:
        originalOrder?.paymentStatus ||
        invoice?.paymentStatus ||
        "PAID",


      orderStatus:
        originalOrder?.orderStatus ||
        "DELIVERED",


      paymentMethod:
        originalOrder?.paymentMethod ||
        invoice?.paymentMethod ||
        invoice?.payment?.paymentMethod ||
        "UPI",


      payment:
        originalOrder?.payment ||
        invoice?.payment ||
        null,


      orderSource:
        originalOrder?.orderSource ||
        invoice?.orderSource ||
        "WALK_IN",


      shippingAddress,


      billingAddress:
        invoice?.billingAddress ||
        originalOrder?.billingAddress ||
        shippingAddress,


      invoiceNumber:
        invoice?.invoiceNumber,


      invoiceId:
        invoice?._id,


      invoiceDate:
        invoice?.invoiceDate,


      invoiceFor:
        invoice?.invoiceFor ||
        "ORDER",

    };


    return convertedOrder;

  };


  // ===================================================
  // OPEN NORMAL INVOICE
  // EXISTING FUNCTIONALITY
  // ===================================================

  const openInvoice = (invoice) => {

    console.log(
      "SELECTED NORMAL INVOICE:",
      invoice
    );


    const convertedOrder =
      invoiceToOrder(invoice);


    setSelectedInvoice(
      convertedOrder
    );

  };


  // ===================================================
  // OPEN TECHNICIAN RECEIPT
  // ===================================================

  const openTechnicianReceipt = (repair) => {

    if (!repair) {

      return;

    }


    console.log(
      "SELECTED TECHNICIAN RECEIPT:",
      repair
    );


    setSelectedTechnicianReceipt(
      repair
    );

  };


  // ===================================================
  // CLOSE NORMAL INVOICE
  // ===================================================

  const closeInvoice = () => {

    setSelectedInvoice(null);

  };


  // ===================================================
  // CLOSE TECHNICIAN RECEIPT
  // ===================================================

  const closeTechnicianReceipt = () => {

    setSelectedTechnicianReceipt(null);

  };


  // ===================================================
  // PRINT TECHNICIAN RECEIPT
  // ===================================================

  const handleTechnicianPrint = () => {

    window.print();

  };


  // ===================================================
  // COMBINED RECORD COUNT
  // ===================================================

  const totalRecords = useMemo(() => {

    return (
      invoices.length +
      technicianRepairs.length
    );

  }, [
    invoices,
    technicianRepairs
  ]);


  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div className="admin-invoices-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-invoices-header">

        <div>

          <h1>
            Invoices & Receipts
          </h1>

          <p>
            Online, Walk-In & Technician
            service receipts
          </p>

        </div>


        <button
          type="button"
          onClick={() => {
            loadInvoices();
            loadTechnicianReceipts();
          }}
          disabled={
            loading &&
            technicianLoading
          }
        >

          <FiRefreshCw
            style={{
              marginRight: 6,
            }}
          />

          {loading || technicianLoading
            ? "Loading..."
            : "Refresh"
          }

        </button>

      </div>


      {/* =================================================
          LOADING
      ================================================= */}

      {loading && technicianLoading ? (

        <div className="empty-invoices">

          <p>
            Loading invoices & technician receipts...
          </p>

        </div>

      ) : totalRecords === 0 ? (

        /* =================================================
           EMPTY
        ================================================= */

        <div className="empty-invoices">

          <h3>
            No invoices or receipts found
          </h3>

          <p>
            Online, Walk-In or Technician
            receipts will appear here.
          </p>

        </div>

      ) : (

        <div className="invoice-list">

          {/* =================================================
              NORMAL ONLINE / WALK-IN INVOICES
          ================================================= */}

          {invoices.map(
            (invoice) => {

              const source =
                getOrderSource(
                  invoice
                );


              const customer =
                getCustomerName(
                  invoice
                );


              const amount =
                getAmount(
                  invoice
                );


              return (

                <div
                  className="invoice-card"
                  key={
                    `invoice-${invoice?._id}`
                  }
                >

                  <div className="invoice-card-info">

                    <h3>

                      {
                        invoice?.invoiceNumber ||
                        invoice?._id ||
                        "Invoice"
                      }

                    </h3>


                    <p>

                      <strong>
                        Customer:
                      </strong>{" "}

                      {customer}

                    </p>


                    <p>

                      <strong>
                        Source:
                      </strong>{" "}

                      <span
                        className={
                          source === "ONLINE"
                            ? "invoice-source online"
                            : "invoice-source walkin"
                        }
                      >

                        {
                          source === "ONLINE"
                            ? "ONLINE"
                            : "WALK-IN"
                        }

                      </span>

                    </p>


                    <p>

                      <strong>
                        Amount:
                      </strong>{" "}

                      ₹{" "}

                      {amount.toLocaleString(
                        "en-IN"
                      )}

                    </p>


                    <p>

                      <strong>
                        Payment:
                      </strong>{" "}

                      {
                        invoice?.paymentMethod ||
                        invoice?.payment?.paymentMethod ||
                        "UPI"
                      }

                    </p>


                    <p>

                      <strong>
                        Status:
                      </strong>{" "}

                      {
                        invoice?.paymentStatus ||
                        "PAID"
                      }

                    </p>

                  </div>


                  <button
                    type="button"
                    className="view-invoice-btn"
                    onClick={() =>
                      openInvoice(
                        invoice
                      )
                    }
                  >

                    <FiEye
                      style={{
                        marginRight: 6,
                      }}
                    />

                    View Invoice

                  </button>

                </div>

              );

            }
          )}


          {/* =================================================
              TECHNICIAN / REPAIR RECEIPTS
          ================================================= */}

          {technicianRepairs.map(
            (repair) => {

              const customer =
                getTechnicianCustomerName(
                  repair
                );


              const technician =
                getTechnicianName(
                  repair
                );


              const amount =
                getTechnicianAmount(
                  repair
                );


              const status =
                getTechnicianStatus(
                  repair
                );


              const ticket =
                getTechnicianTicket(
                  repair
                );


              return (

                <div
                  className="invoice-card technician-receipt-card"
                  key={
                    `technician-${repair?._id}`
                  }
                  style={{
                    borderLeft:
                      "4px solid #7c3aed",
                  }}
                >

                  <div className="invoice-card-info">

                    <h3>

                      {ticket}

                    </h3>


                    <p>

                      <strong>
                        Customer:
                      </strong>{" "}

                      {customer}

                    </p>


                    <p>

                      <strong>
                        Source:
                      </strong>{" "}

                      <span
                        className="invoice-source"
                        style={{
                          background:
                            "#f3e8ff",
                          color:
                            "#7c3aed",
                          border:
                            "1px solid #ddd6fe",
                        }}
                      >

                        TECHNICIAN

                      </span>

                    </p>


                    <p>

                      <strong>
                        Device:
                      </strong>{" "}

                      {
                        repair?.deviceModel ||
                        repair?.laptopModel ||
                        "Standard Device"
                      }

                    </p>


                    <p>

                      <strong>
                        Technician:
                      </strong>{" "}

                      {technician}

                    </p>


                    <p>

                      <strong>
                        Amount:
                      </strong>{" "}

                      ₹{" "}

                      {amount.toLocaleString(
                        "en-IN"
                      )}

                    </p>


                    <p>

                      <strong>
                        Status:
                      </strong>{" "}

                      {status}

                    </p>

                  </div>


                  <button
                    type="button"
                    className="view-invoice-btn"
                    style={{
                      background:
                        "#7c3aed",
                      color:
                        "#ffffff",
                    }}
                    onClick={() =>
                      openTechnicianReceipt(
                        repair
                      )
                    }
                  >

                    <FiPrinter
                      style={{
                        marginRight: 6,
                      }}
                    />

                    View Receipt

                  </button>

                </div>

              );

            }
          )}

        </div>

      )}


      {/* =================================================
          NORMAL ONLINE / WALK-IN INVOICE MODAL
          EXISTING FUNCTIONALITY
      ================================================= */}

      {selectedInvoice && (

        <WalkInInvoice

          order={
            selectedInvoice
          }

          onClose={
            closeInvoice
          }

        />

      )}


      {/* =================================================
          TECHNICIAN RECEIPT MODAL
      ================================================= */}

      {selectedTechnicianReceipt && (

        <div
          className="tech-receipt-overlay"
          onMouseDown={(e) => {

            if (
              e.target === e.currentTarget
            ) {

              closeTechnicianReceipt();

            }

          }}
        >

          <div className="tech-receipt-modal">

            {/* =================================================
                TOP BAR
            ================================================= */}

            <div className="tech-receipt-top no-print">

              <div>

                <span className="tech-receipt-eyebrow">
                  Billing & Deliveries
                </span>

                <h2>
                  Technician Service Receipt
                </h2>

                <p>
                  Official workshop repair
                  service receipt
                </p>

              </div>


              <button
                type="button"
                className="tech-receipt-close"
                onClick={
                  closeTechnicianReceipt
                }
              >

                <FiX />

              </button>

            </div>


            {/* =================================================
                PRINTABLE RECEIPT
            ================================================= */}

            <div
              className="tech-receipt-sheet"
              id="technician-printable-receipt"
            >

              {/* =================================================
                  RECEIPT HEADER
              ================================================= */}

              <div className="tech-receipt-header">

                <div>

                  <h1>
                    ZAID INFOTECH
                  </h1>

                  <p>
                    Premium Hardware Repairs,
                    Micro-Soldering & IT Solutions
                  </p>

                </div>


                <div className="tech-receipt-badge">

                  <h3>
                    SERVICE RECEIPT
                  </h3>


                  <div>

                    Ticket:{" "}

                    <strong>

                      {
                        getTechnicianTicket(
                          selectedTechnicianReceipt
                        )
                      }

                    </strong>

                  </div>


                  <div>

                    Date:{" "}

                    {new Date(
                      selectedTechnicianReceipt?.updatedAt ||
                      selectedTechnicianReceipt?.createdAt ||
                      Date.now()
                    ).toLocaleDateString(
                      "en-IN"
                    )}

                  </div>

                </div>

              </div>


              {/* =================================================
                  CUSTOMER + HARDWARE
              ================================================= */}

              <div className="tech-receipt-party-grid">

                <div className="tech-party-card">

                  <span>
                    CUSTOMER DETAILS
                  </span>


                  <strong>

                    {
                      getTechnicianCustomerName(
                        selectedTechnicianReceipt
                      )
                    }

                  </strong>


                  <div>

                    Phone:{" "}

                    {
                      selectedTechnicianReceipt?.customerPhone ||
                      "N/A"
                    }

                  </div>


                  {
                    selectedTechnicianReceipt?.customerEmail && (

                      <div>

                        Email:{" "}

                        {
                          selectedTechnicianReceipt.customerEmail
                        }

                      </div>

                    )
                  }

                </div>


                <div className="tech-party-card">

                  <span>
                    HARDWARE REPAIRED
                  </span>


                  <strong>

                    {
                      selectedTechnicianReceipt?.deviceModel ||
                      selectedTechnicianReceipt?.laptopModel ||
                      "Standard Device"
                    }

                  </strong>


                  <div>

                    Technician:{" "}

                    {
                      getTechnicianName(
                        selectedTechnicianReceipt
                      )
                    }

                  </div>


                  <div>

                    Status:{" "}

                    <strong>

                      {
                        getTechnicianStatus(
                          selectedTechnicianReceipt
                        )
                      }

                    </strong>

                  </div>

                </div>

              </div>


              {/* =================================================
                  SERVICE TABLE
              ================================================= */}

              <div className="tech-receipt-table-wrapper">

                <table className="tech-receipt-table">

                  <thead>

                    <tr>

                      <th>
                        Service / Problem Breakdown
                      </th>

                      <th>
                        Part (₹)
                      </th>

                      <th>
                        Labor (₹)
                      </th>

                      <th>
                        Total (₹)
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {
                      Array.isArray(
                        selectedTechnicianReceipt?.services
                      ) &&
                      selectedTechnicianReceipt.services.length > 0

                        ? (

                          selectedTechnicianReceipt.services.map(
                            (service, index) => {

                              const part =
                                Number(
                                  service?.partCost || 0
                                );


                              const labor =
                                Number(
                                  service?.laborCost || 0
                                );


                              const total =
                                Number(
                                  service?.totalCost ??
                                  part + labor
                                );


                              return (

                                <tr
                                  key={index}
                                >

                                  <td>

                                    <strong>

                                      {
                                        service?.serviceName ||
                                        service?.name ||
                                        "Repair Service"
                                      }

                                    </strong>


                                    {
                                      service?.category && (

                                        <small>

                                          {
                                            service.category
                                          }

                                        </small>

                                      )
                                    }


                                    {
                                      index === 0 &&
                                      selectedTechnicianReceipt?.issueDescription && (

                                        <p>

                                          Issue:{" "}

                                          {
                                            selectedTechnicianReceipt.issueDescription
                                          }

                                        </p>

                                      )
                                    }

                                  </td>


                                  <td>
                                    ₹{part.toFixed(2)}
                                  </td>


                                  <td>
                                    ₹{labor.toFixed(2)}
                                  </td>


                                  <td>
                                    ₹{total.toFixed(2)}
                                  </td>

                                </tr>

                              );

                            }
                          )

                        )

                        : (

                          <tr>

                            <td>

                              <strong>
                                Repair Diagnostics &
                                Technician Service
                              </strong>


                              <p>

                                {
                                  selectedTechnicianReceipt?.issueDescription ||
                                  "General Hardware Issue"
                                }

                              </p>

                            </td>


                            <td>

                              ₹
                              {Number(
                                selectedTechnicianReceipt?.partCost ||
                                0
                              ).toFixed(2)}

                            </td>


                            <td>

                              ₹
                              {Number(
                                selectedTechnicianReceipt?.laborCost ??
                                (
                                  Number(
                                    selectedTechnicianReceipt?.repairCost ||
                                    0
                                  ) -
                                  Number(
                                    selectedTechnicianReceipt?.partCost ||
                                    0
                                  )
                                )
                              ).toFixed(2)}

                            </td>


                            <td>

                              ₹
                              {Number(
                                selectedTechnicianReceipt?.repairCost ||
                                0
                              ).toFixed(2)}

                            </td>

                          </tr>

                        )
                    }


                    {
                      selectedTechnicianReceipt?.remarks && (

                        <tr>

                          <td colSpan={3}>

                            <em>

                              Remarks:{" "}

                              {
                                selectedTechnicianReceipt.remarks
                              }

                            </em>

                          </td>


                          <td>
                            —
                          </td>

                        </tr>

                      )
                    }

                  </tbody>


                  <tfoot>

                    <tr>

                      <th colSpan={3}>

                        Total Amount Due / Paid:

                      </th>


                      <th>

                        ₹
                        {
                          Number(
                            selectedTechnicianReceipt?.repairCost ||
                            getTechnicianAmount(
                              selectedTechnicianReceipt
                            )
                          ).toFixed(2)
                        }

                      </th>

                    </tr>

                  </tfoot>

                </table>

              </div>


              {/* =================================================
                  FOOTER
              ================================================= */}

              <div className="tech-receipt-footer">

                <p>
                  Thank you for choosing
                  Zaid Infotech.
                </p>

                <p>
                  30 Days service warranty
                  applies on replaced components
                  and verified service repairs.
                </p>

              </div>

            </div>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="tech-receipt-actions no-print">

              <button
                type="button"
                onClick={
                  closeTechnicianReceipt
                }
              >

                Close

              </button>


              <button
                type="button"
                onClick={
                  handleTechnicianPrint
                }
              >

                <FiPrinter />

                Print Receipt

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default AdminInvoices;

