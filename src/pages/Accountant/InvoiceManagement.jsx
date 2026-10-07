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
//   CalendarDays,
//   Receipt,
//   Package,
//   ClipboardList,
// } from "lucide-react";

// import {
//   getAllInvoices,
//   getInvoiceById,
// } from "../../services/accountantInvoiceService";

// import { getAllRentals } from "../../services/rentalApi";

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
//   // LOAD ALL INVOICES
//   // =========================================================

//   const loadInvoices = async () => {
//     try {
//       setLoading(true);

//       // =====================================================
//       // LOAD NORMAL INVOICES + RENTALS IN PARALLEL
//       // =====================================================

//       const [invoiceResult, rentalResult] =
//         await Promise.allSettled([
//           getAllInvoices(),
//           getAllRentals(),
//         ]);

//       // -----------------------------------------------------
//       // NORMAL INVOICES
//       // -----------------------------------------------------

//       let invoiceList = [];

//       if (invoiceResult.status === "fulfilled") {
//         const response = invoiceResult.value;

//         console.log(
//           "ACCOUNTANT INVOICES RESPONSE:",
//           response
//         );

//         const data =
//           response?.data?.invoices ||
//           response?.data?.data ||
//           response?.data ||
//           response?.invoices ||
//           response?.results ||
//           response ||
//           [];

//         invoiceList = Array.isArray(data)
//           ? data
//           : [];
//       } else {
//         console.error(
//           "Load normal invoices error:",
//           invoiceResult.reason
//         );
//       }

//       // -----------------------------------------------------
//       // RENTALS
//       //
//       // IMPORTANT:
//       // Rental records are not always stored in the Invoice
//       // collection. Therefore we also load /rentals and turn
//       // each rental into an invoice-shaped object for this
//       // Accountant Invoice Management screen.
//       // -----------------------------------------------------

//       let rentalList = [];

//       if (rentalResult.status === "fulfilled") {
//         const response = rentalResult.value;

//         console.log(
//           "ACCOUNTANT RENTALS RESPONSE:",
//           response
//         );

//         if (Array.isArray(response)) {
//           rentalList = response;
//         } else if (Array.isArray(response?.rentals)) {
//           rentalList = response.rentals;
//         } else if (Array.isArray(response?.data)) {
//           rentalList = response.data;
//         } else if (
//           Array.isArray(response?.data?.rentals)
//         ) {
//           rentalList = response.data.rentals;
//         } else if (
//           Array.isArray(response?.data?.data)
//         ) {
//           rentalList = response.data.data;
//         } else if (Array.isArray(response?.result)) {
//           rentalList = response.result;
//         } else if (
//           Array.isArray(response?.data?.result)
//         ) {
//           rentalList = response.data.result;
//         }
//       } else {
//         console.error(
//           "Load rentals error:",
//           rentalResult.reason
//         );
//       }

//       // -----------------------------------------------------
//       // HELPERS FOR RENTAL -> INVOICE CONVERSION
//       // -----------------------------------------------------

//       const numberValue = (value) => {
//         const parsed = Number(value);
//         return Number.isFinite(parsed)
//           ? parsed
//           : 0;
//       };

//       const rentalIdOf = (rental) =>
//         rental?._id ||
//         rental?.id ||
//         rental?.rentalId ||
//         "";

//       const rentalNumberOf = (rental) =>
//         rental?.rentalNumber ||
//         rental?.rentalNo ||
//         rental?.rental_number ||
//         rentalIdOf(rental);

//       const rentalDurationTypeOf = (rental) =>
//         normalize(
//           rental?.rentalDurationType ||
//           "MONTHS"
//         ) === "DAYS"
//           ? "DAYS"
//           : "MONTHS";

//       const rentalDurationOf = (rental) => {
//         const value = numberValue(
//           rental?.rentalDuration ??
//           rental?.rentalMonths ??
//           1
//         );

//         return value > 0 ? value : 1;
//       };

//       const monthlyRentOf = (rental) =>
//         numberValue(
//           rental?.monthlyRent ??
//           rental?.rentalProduct?.monthlyRent ??
//           rental?.rentalProduct?.price ??
//           rental?.product?.monthlyRent ??
//           0
//         );

//       const rentalBaseAmountOf = (rental) => {
//         const monthlyRent =
//           monthlyRentOf(rental);

//         const duration =
//           rentalDurationOf(rental);

//         const type =
//           rentalDurationTypeOf(rental);

//         if (type === "DAYS") {
//           return (monthlyRent / 30) * duration;
//         }

//         return monthlyRent * duration;
//       };

//       const gstPercentageOf = (rental) =>
//         numberValue(
//           rental?.gstPercentage ??
//           rental?.gst ??
//           0
//         );

//       const rentalGstAmountOf = (rental) => {
//         const base =
//           rentalBaseAmountOf(rental);

//         const gst =
//           gstPercentageOf(rental);

//         return (base * gst) / 100;
//       };

//       const rentalTotalOf = (rental) => {
//         return (
//           rentalBaseAmountOf(rental) +
//           rentalGstAmountOf(rental)
//         );
//       };

//       const rentalCustomerNameOf = (rental) => {
//         if (
//           normalize(
//             rental?.customerType
//           ) === "COMPANY"
//         ) {
//           return (
//             rental?.companyDetails
//               ?.contactPerson ||
//             rental?.companyDetails
//               ?.companyName ||
//             "Company Customer"
//           );
//         }

//         return (
//           rental?.individualDetails
//             ?.fullName ||
//           rental?.individualDetails?.name ||
//           rental?.customer?.name ||
//           rental?.customer?.fullName ||
//           "Walk-In Customer"
//         );
//       };

//       const rentalCustomerPhoneOf = (rental) => {
//         if (
//           normalize(
//             rental?.customerType
//           ) === "COMPANY"
//         ) {
//           return (
//             rental?.companyDetails?.phone ||
//             "-"
//           );
//         }

//         return (
//           rental?.individualDetails?.phone ||
//           rental?.customer?.phone ||
//           "-"
//         );
//       };

//       const rentalCustomerEmailOf = (rental) => {
//         if (
//           normalize(
//             rental?.customerType
//           ) === "COMPANY"
//         ) {
//           return (
//             rental?.companyDetails?.email ||
//             ""
//           );
//         }

//         return (
//           rental?.individualDetails?.email ||
//           rental?.customer?.email ||
//           ""
//         );
//       };

//       const rentalProductNameOf = (rental) =>
//         rental?.product?.name ||
//         rental?.product?.title ||
//         rental?.rentalProduct?.product?.name ||
//         rental?.rentalProduct?.product?.title ||
//         rental?.rentalProduct?.name ||
//         "Rental Product";

//       const rentalProductBrandOf = (rental) => {
//         const brand =
//           rental?.product?.brand ||
//           rental?.rentalProduct?.product?.brand;

//         if (
//           typeof brand === "object" &&
//           brand !== null
//         ) {
//           return (
//             brand?.name ||
//             brand?.title ||
//             ""
//           );
//         }

//         return brand || "";
//       };

//       const rentalSourceOf = (rental) => {
//         const source =
//           normalize(
//             rental?.rentalSource ||
//             rental?.source ||
//             rental?.orderSource ||
//             ""
//           );

//         return source === "WALK_IN"
//           ? "WALK_IN_RENTAL"
//           : "RENTAL";
//       };

//       // -----------------------------------------------------
//       // FIND RENTALS THAT ALREADY HAVE A REAL INVOICE
//       // -----------------------------------------------------
//       //
//       // If Invoice collection already contains a rental
//       // invoice, do not create a duplicate from /rentals.
//       // -----------------------------------------------------

//       const existingRentalIds =
//         new Set(
//           invoiceList
//             .map(
//               (invoice) =>
//                 invoice?.rentalId
//             )
//             .filter(Boolean)
//             .map((id) =>
//               String(id)
//             )
//         );

//       // -----------------------------------------------------
//       // CONVERT RENTALS INTO INVOICE-SHAPED RECORDS
//       // -----------------------------------------------------

//       const rentalInvoices =
//         rentalList
//           .filter((rental) => {
//             const rentalId =
//               rentalIdOf(rental);

//             if (!rentalId) {
//               return false;
//             }

//             return !existingRentalIds.has(
//               String(rentalId)
//             );
//           })
//           .map((rental) => {
//             const rentalId =
//               rentalIdOf(rental);

//             const rentalNumber =
//               rentalNumberOf(rental);

//             const baseAmount =
//               rentalBaseAmountOf(rental);

//             const gstAmount =
//               rentalGstAmountOf(rental);

//             const totalAmount =
//               rentalTotalOf(rental);

//             const durationType =
//               rentalDurationTypeOf(rental);

//             const duration =
//               rentalDurationOf(rental);

//             const monthlyRent =
//               monthlyRentOf(rental);

//             const gstPercentage =
//               gstPercentageOf(rental);

//             const customerName =
//               rentalCustomerNameOf(rental);

//             const customerPhone =
//               rentalCustomerPhoneOf(rental);

//             const customerEmail =
//               rentalCustomerEmailOf(rental);

//             const productName =
//               rentalProductNameOf(rental);

//             const brand =
//               rentalProductBrandOf(rental);

//             const paymentStatus =
//               normalize(
//                 rental?.paymentStatus ||
//                 rental?.paymentState ||
//                 (
//                   rental?.status === "ACTIVE"
//                     ? "PAID"
//                     : "PENDING"
//                 )
//               );

//             const depositPaid = numberValue(
//               rental?.depositAmountPaid ??
//               rental?.depositPaid ??
//               rental?.securityDepositPaid ??
//               rental?.paidDeposit ??
//               rental?.deposit?.paidAmount ??
//               rental?.deposit?.amountPaid ??
//               0
//             );

//             const billingAddress = {
//               fullName: customerName,
//               phone: customerPhone,
//               email: customerEmail,
//               ...(rental?.billingAddress || {}),
//             };

//             return {
//               // -------------------------------------------------
//               // MARK THIS RECORD AS A FRONTEND-GENERATED RENTAL
//               // -------------------------------------------------
//               __isRentalInvoice: true,
//               __rentalRecord: rental,

//               // A unique local key is used only by React.
//               // It is NOT sent to backend.
//               _id:
//                 `rental-invoice-${String(
//                   rentalId
//                 )}`,

//               invoiceNumber:
//                 `RENTAL-${String(
//                   rentalNumber
//                 )}`,

//               invoiceFor:
//                 "Rental",

//               invoiceDate:
//                 rental?.invoiceDate ||
//                 rental?.startDate ||
//                 rental?.createdAt,

//               createdAt:
//                 rental?.createdAt,

//               // -------------------------------------------------
//               // SOURCE
//               // -------------------------------------------------
//               source:
//                 rentalSourceOf(rental),

//               invoiceSource:
//                 rentalSourceOf(rental),

//               rentalSource:
//                 normalize(
//                   rental?.rentalSource ||
//                   rental?.source ||
//                   ""
//                 ) || "ONLINE",

//               rentalId:
//                 rentalId,

//               rentalNumber:
//                 rentalNumber,

//               // -------------------------------------------------
//               // CUSTOMER
//               // -------------------------------------------------
//               customerName:
//                 customerName,

//               customerPhone:
//                 customerPhone,

//               customerEmail:
//                 customerEmail,

//               customerType:
//                 rental?.customerType ||
//                 "INDIVIDUAL",

//               individualDetails:
//                 rental?.individualDetails,

//               companyDetails:
//                 rental?.companyDetails,

//               billingAddress:
//                 billingAddress,

//               shippingAddress:
//                 rental?.shippingAddress,

//               // -------------------------------------------------
//               // RENTAL INFORMATION
//               // -------------------------------------------------
//               product:
//                 rental?.product,

//               rentalProduct:
//                 rental?.rentalProduct,

//               rentalDurationType:
//                 durationType,

//               rentalDuration:
//                 duration,

//               rentalMonths:
//                 rental?.rentalMonths,

//               monthlyRent:
//                 monthlyRent,

//               securityDeposit:
//                 numberValue(
//                   rental?.securityDeposit
//                 ),

//               depositAmountPaid:
//                 depositPaid,

//               gstPercentage:
//                 gstPercentage,

//               gstAmount:
//                 gstAmount,

//               subtotal:
//                 baseAmount,

//               tax:
//                 gstAmount,

//               taxAmount:
//                 gstAmount,

//               discount:
//                 0,

//               discountAmount:
//                 0,

//               totalAmount:
//                 totalAmount,

//               // Keep deposit separate from rental invoice
//               // total to avoid double-counting.
//               paidAmount:
//                 numberValue(
//                   rental?.rentPaidAmount ??
//                   rental?.rentalPaidAmount ??
//                   rental?.paidAmount ??
//                   rental?.amountPaid ??
//                   0
//                 ),

//               balanceAmount:
//                 Math.max(
//                   totalAmount -
//                     numberValue(
//                       rental?.rentPaidAmount ??
//                       rental?.rentalPaidAmount ??
//                       rental?.paidAmount ??
//                       rental?.amountPaid ??
//                       0
//                     ),
//                   0
//                 ),

//               paymentStatus:
//                 paymentStatus,

//               status:
//                 rental?.status ||
//                 paymentStatus,

//               paymentMethod:
//                 rental?.paymentMethod ||
//                 rental?.payment?.method,

//               paymentSource:
//                 rental?.paymentSource ||
//                 rental?.rentalSource ||
//                 "RENTAL",

//               referenceId:
//                 rentalId,

//               transactionId:
//                 rental?.transactionId ||
//                 rental?.payment?.transactionId,

//               // -------------------------------------------------
//               // ITEMS
//               // -------------------------------------------------
//               items: [
//                 {
//                   _id:
//                     `rental-item-${String(
//                       rentalId
//                     )}`,
//                   title:
//                     productName,
//                   description:
//                     [
//                       brand,
//                       `${duration} ${durationType.toLowerCase()}`,
//                       `₹${monthlyRent.toLocaleString(
//                         "en-IN",
//                         {
//                           maximumFractionDigits: 2,
//                         }
//                       )}/month`,
//                     ]
//                       .filter(Boolean)
//                       .join(" • "),
//                   quantity: 1,
//                   price: baseAmount,
//                   unitPrice: baseAmount,
//                   discountAmount: 0,
//                   discount: 0,
//                   total: baseAmount,
//                   totalAmount: baseAmount,
//                 },
//               ],

//               // -------------------------------------------------
//               // EXTRA RENTAL DATA
//               // -------------------------------------------------
//               rentalStatus:
//                 rental?.status,

//               expectedEndDate:
//                 rental?.expectedEndDate,

//               nextPaymentDate:
//                 rental?.nextPaymentDate,

//               notes:
//                 rental?.notes ||
//                 rental?.handOverNotes,
//             };
//           });

//       // -----------------------------------------------------
//       // MERGE
//       // -----------------------------------------------------

//       const mergedInvoices = [
//         ...invoiceList,
//         ...rentalInvoices,
//       ];

//       console.log(
//         "NORMAL INVOICES:",
//         invoiceList
//       );

//       console.log(
//         "RENTAL INVOICES GENERATED FROM /rentals:",
//         rentalInvoices
//       );

//       console.log(
//         "FINAL ACCOUNTANT INVOICES:",
//         mergedInvoices
//       );

//       setInvoices(
//         Array.isArray(mergedInvoices)
//           ? mergedInvoices
//           : []
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
//     ).format(
//       Number(amount || 0)
//     );
//   };

//   // =========================================================
//   // DATE
//   // =========================================================

//   const formatDate = (value) => {
//     if (!value) return "-";

//     const parsed =
//       new Date(value);

//     if (
//       Number.isNaN(
//         parsed.getTime()
//       )
//     ) {
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
//   // NORMALIZE STRING
//   // =========================================================

//   const normalize = (value) => {
//     return String(
//       value || ""
//     )
//       .trim()
//       .toUpperCase()
//       .replace(/[\s-]+/g, "_");
//   };

//   // =========================================================
//   // GET ALL POSSIBLE SOURCE VALUES
//   //
//   // IMPORTANT:
//   // We check MANY backend fields because invoices can
//   // come from different modules.
//   // =========================================================

//   const getSourceValues = (invoice) => {
//     return [
//       invoice?.source,
//       invoice?.invoiceSource,
//       invoice?.orderType,
//       invoice?.orderSource,
//       invoice?.saleSource,
//       invoice?.salesSource,
//       invoice?.rentalSource,
//       invoice?.transactionType,
//       invoice?.type,
//       invoice?.invoiceType,
//       invoice?.invoiceFor,
//       invoice?.paymentSource,
//     ]
//       .filter(Boolean)
//       .map(normalize);
//   };

//   // =========================================================
//   // INVOICE SOURCE
//   //
//   // ALL TYPES:
//   //
//   // ONLINE
//   // WALK_IN
//   // WALK_IN_ORDER
//   // RENTAL
//   // WALK_IN_RENTAL
//   // REPAIR
//   // OTHER
//   // =========================================================

//   const getInvoiceSource = (invoice) => {
//     if (!invoice) {
//       return {
//         type: "OTHER",
//         label: "OTHER",
//         subLabel: "Invoice",
//       };
//     }

//     const values =
//       getSourceValues(invoice);

//     const has =
//       (list) =>
//         list.some(
//           (item) =>
//             values.includes(
//               normalize(item)
//             )
//         );

//     // =====================================================
//     // DIRECT IDS
//     // =====================================================

//     const hasRental =
//       Boolean(
//         invoice?.rentalId ||
//           invoice?.rentalProductId
//       );

//     const hasRepair =
//       Boolean(
//         invoice?.repairId ||
//           invoice?.repairRequestId
//       );

//     const hasOrder =
//       Boolean(
//         invoice?.orderId
//       );

//     // =====================================================
//     // WALK-IN RENTAL
//     //
//     // Check BEFORE normal RENTAL.
//     // =====================================================

//     if (
//       has([
//         "WALK_IN_RENTAL",
//         "WALKIN_RENTAL",
//         "WALK_IN_RENTAL_INVOICE",
//         "WALKINRENTAL",
//         "WALK_IN_RENTAL_ORDER",
//         "WALKIN_RENTAL_ORDER",
//         "OFFLINE_RENTAL",
//         "COUNTER_RENTAL",
//       ]) ||
//       (
//         hasRental &&
//         (
//           normalize(
//             invoice?.rentalSource
//           ) === "WALK_IN" ||
//           normalize(
//             invoice?.source
//           ) === "WALK_IN" ||
//           invoice?.walkInRental === true ||
//           invoice?.isWalkInRental === true ||
//           invoice?.walkIn === true
//         )
//       )
//     ) {
//       return {
//         type: "WALK_IN_RENTAL",
//         label: "WALK-IN RENTAL",
//         subLabel:
//           "Counter / Walk-In Rental",
//       };
//     }

//     // =====================================================
//     // NORMAL RENTAL
//     // =====================================================

//     if (
//       has([
//         "RENTAL",
//         "RENTAL_INVOICE",
//         "RENTAL_ORDER",
//         "ONLINE_RENTAL",
//         "CUSTOMER_RENTAL",
//       ]) ||
//       (
//         hasRental &&
//         !invoice?.walkInRental &&
//         !invoice?.isWalkInRental &&
//         normalize(
//           invoice?.rentalSource
//         ) !== "WALK_IN"
//       )
//     ) {
//       return {
//         type: "RENTAL",
//         label: "RENTAL",
//         subLabel:
//           "Rental Invoice",
//       };
//     }

//     // =====================================================
//     // REPAIR
//     // =====================================================

//     if (
//       has([
//         "REPAIR",
//         "REPAIR_INVOICE",
//         "REPAIR_ORDER",
//         "SERVICE",
//         "SERVICE_REPAIR",
//       ]) ||
//       hasRepair
//     ) {
//       return {
//         type: "REPAIR",
//         label: "REPAIR",
//         subLabel:
//           "Repair / Service Invoice",
//       };
//     }

//     // =====================================================
//     // WALK-IN ORDER
//     //
//     // IMPORTANT:
//     // Check before generic WALK_IN.
//     // =====================================================

//     if (
//       has([
//         "WALK_IN_ORDER",
//         "WALKIN_ORDER",
//         "WALK_IN_SALE_ORDER",
//         "WALKIN_SALE_ORDER",
//         "COUNTER_ORDER",
//         "OFFLINE_ORDER",
//         "POS_ORDER",
//         "STORE_ORDER",
//       ]) ||
//       (
//         hasOrder &&
//         (
//           invoice?.walkInOrder === true ||
//           invoice?.isWalkInOrder === true ||
//           normalize(
//             invoice?.orderSource
//           ) === "WALK_IN" ||
//           normalize(
//             invoice?.saleSource
//           ) === "WALK_IN"
//         )
//       )
//     ) {
//       return {
//         type: "WALK_IN_ORDER",
//         label: "WALK-IN ORDER",
//         subLabel:
//           "Counter / Store Order",
//       };
//     }

//     // =====================================================
//     // WALK-IN SALE
//     // =====================================================

//     if (
//       has([
//         "WALK_IN",
//         "WALKIN",
//         "OFFLINE",
//         "COUNTER",
//         "POS",
//         "STORE",
//         "IN_STORE",
//         "INSTORE",
//         "WALK_IN_SALE",
//         "WALKIN_SALE",
//         "COUNTER_SALE",
//         "OFFLINE_SALE",
//         "POS_SALE",
//       ]) ||
//       invoice?.walkIn === true ||
//       invoice?.isWalkIn === true ||
//       invoice?.walkInSale === true
//     ) {
//       return {
//         type: "WALK_IN",
//         label: "WALK-IN SALE",
//         subLabel:
//           "Counter / Store Sale",
//       };
//     }

//     // =====================================================
//     // ONLINE / E-COMMERCE ORDER
//     // =====================================================

//     if (
//       has([
//         "ONLINE",
//         "ECOMMERCE",
//         "E_COMMERCE",
//         "E-COMMERCE",
//         "ONLINE_ORDER",
//         "ECOMMERCE_ORDER",
//         "E_COMMERCE_ORDER",
//         "ONLINE_SALE",
//         "ECOMMERCE_SALE",
//         "WEB",
//         "WEBSITE",
//       ]) ||
//       normalize(
//         invoice?.paymentSource
//       ) === "ONLINE" ||
//       (
//         hasOrder &&
//         !invoice?.walkIn &&
//         !invoice?.isWalkIn &&
//         !invoice?.walkInOrder &&
//         !invoice?.isWalkInOrder
//       )
//     ) {
//       return {
//         type: "ONLINE",
//         label: "ONLINE ORDER",
//         subLabel:
//           "E-Commerce Order",
//       };
//     }

//     // =====================================================
//     // ORDER / SALE FALLBACK
//     // =====================================================

//     if (
//       has([
//         "ORDER",
//         "SALE",
//         "ECOMMERCE_ORDER",
//         "E_COMMERCE_ORDER",
//       ])
//     ) {
//       return {
//         type: "ONLINE",
//         label: "ONLINE ORDER",
//         subLabel:
//           "E-Commerce Order",
//       };
//     }

//     // =====================================================
//     // OTHER
//     // =====================================================

//     return {
//       type: "OTHER",
//       label:
//         invoice?.invoiceFor ||
//         invoice?.source ||
//         invoice?.invoiceType ||
//         "OTHER",
//       subLabel:
//         "Other Invoice",
//     };
//   };

//   // =========================================================
//   // PAYMENT STATUS
//   // =========================================================

//   const getInvoiceStatus = (
//     invoice
//   ) => {
//     return normalize(
//       invoice?.paymentStatus ||
//         invoice?.status ||
//         invoice?.paymentState ||
//         "PENDING"
//     );
//   };

//   // =========================================================
//   // CUSTOMER NAME
//   // =========================================================

//   const customerName = (
//     invoice
//   ) => {
//     if (
//       invoice?.billingAddress
//         ?.fullName
//     ) {
//       return invoice
//         .billingAddress
//         .fullName;
//     }

//     if (
//       invoice?.shippingAddress
//         ?.fullName
//     ) {
//       return invoice
//         .shippingAddress
//         .fullName;
//     }

//     if (
//       invoice?.customerName
//     ) {
//       return invoice.customerName;
//     }

//     if (
//       invoice?.name
//     ) {
//       return invoice.name;
//     }

//     if (
//       invoice?.user &&
//       typeof invoice.user ===
//         "object"
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
//       typeof invoice.customer ===
//         "object"
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

//     if (
//       invoice?.individualDetails
//     ) {
//       return (
//         invoice.individualDetails
//           ?.fullName ||
//         invoice.individualDetails
//           ?.name ||
//         "Customer"
//       );
//     }

//     if (
//       invoice?.companyDetails
//     ) {
//       return (
//         invoice.companyDetails
//           ?.companyName ||
//         invoice.companyDetails
//           ?.name ||
//         "Company"
//       );
//     }

//     return "Customer";
//   };

//   // =========================================================
//   // CUSTOMER PHONE
//   // =========================================================

//   const customerPhone = (
//     invoice
//   ) => {
//     return (
//       invoice?.billingAddress
//         ?.phone ||
//       invoice?.shippingAddress
//         ?.phone ||
//       invoice?.customerPhone ||
//       invoice?.phone ||
//       invoice?.user?.phone ||
//       invoice?.customer?.phone ||
//       invoice?.individualDetails
//         ?.phone ||
//       invoice?.companyDetails
//         ?.phone ||
//       "-"
//     );
//   };

//   // =========================================================
//   // SOURCE ICON
//   // =========================================================

//   const sourceIcon = (
//     type
//   ) => {
//     switch (type) {
//       case "ONLINE":
//         return (
//           <Globe
//             size={19}
//             className="text-green-600"
//           />
//         );

//       case "WALK_IN":
//         return (
//           <Store
//             size={19}
//             className="text-blue-600"
//           />
//         );

//       case "WALK_IN_ORDER":
//         return (
//           <ShoppingBag
//             size={19}
//             className="text-cyan-600"
//           />
//         );

//       case "RENTAL":
//         return (
//           <Laptop
//             size={19}
//             className="text-purple-600"
//           />
//         );

//       case "WALK_IN_RENTAL":
//         return (
//           <Package
//             size={19}
//             className="text-indigo-600"
//           />
//         );

//       case "REPAIR":
//         return (
//           <Wrench
//             size={19}
//             className="text-orange-600"
//           />
//         );

//       default:
//         return (
//           <FileText
//             size={19}
//             className="text-gray-600"
//           />
//         );
//     }
//   };

//   // =========================================================
//   // SOURCE CLASS
//   // =========================================================

//   const sourceClass = (
//     type
//   ) => {
//     switch (type) {
//       case "ONLINE":
//         return "bg-green-100 text-green-700";

//       case "WALK_IN":
//         return "bg-blue-100 text-blue-700";

//       case "WALK_IN_ORDER":
//         return "bg-cyan-100 text-cyan-700";

//       case "RENTAL":
//         return "bg-purple-100 text-purple-700";

//       case "WALK_IN_RENTAL":
//         return "bg-indigo-100 text-indigo-700";

//       case "REPAIR":
//         return "bg-orange-100 text-orange-700";

//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   // =========================================================
//   // STATUS CLASS
//   // =========================================================

//   const statusClass = (
//     status
//   ) => {
//     switch (status) {
//       case "PAID":
//       case "SUCCESS":
//       case "COMPLETED":
//         return "bg-green-100 text-green-700";

//       case "PARTIAL":
//         return "bg-blue-100 text-blue-700";

//       case "REFUNDED":
//         return "bg-purple-100 text-purple-700";

//       case "CANCELLED":
//       case "FAILED":
//         return "bg-red-100 text-red-700";

//       case "PENDING":
//       case "UNPAID":
//         return "bg-yellow-100 text-yellow-700";

//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   // =========================================================
//   // REFERENCE
//   // =========================================================

//   const getReference = (
//     invoice
//   ) => {
//     return (
//       invoice?.orderId ||
//       invoice?.rentalId ||
//       invoice?.repairId ||
//       invoice?.repairRequestId ||
//       invoice?.referenceId ||
//       invoice?.transactionId ||
//       "-"
//     );
//   };

//   // =========================================================
//   // FILTERED INVOICES
//   // =========================================================

//   const filteredInvoices =
//     useMemo(() => {
//       const searchText =
//         search
//           .trim()
//           .toLowerCase();

//       return invoices.filter(
//         (invoice) => {
//           const source =
//             getInvoiceSource(
//               invoice
//             );

//           const status =
//             getInvoiceStatus(
//               invoice
//             );

//           const customer =
//             customerName(
//               invoice
//             );

//           const searchable = [
//             invoice?.invoiceNumber,
//             invoice?._id,
//             invoice?.orderId,
//             invoice?.rentalId,
//             invoice?.repairId,
//             invoice?.repairRequestId,
//             invoice?.referenceId,
//             invoice?.transactionId,
//             invoice?.invoiceFor,
//             invoice?.source,
//             invoice?.invoiceSource,
//             source.label,
//             source.subLabel,
//             customer,
//             customerPhone(
//               invoice
//             ),
//           ]
//             .filter(Boolean)
//             .join(" ")
//             .toLowerCase();

//           const matchesSearch =
//             !searchText ||
//             searchable.includes(
//               searchText
//             );

//           const matchesType =
//             typeFilter === "ALL" ||
//             source.type ===
//               typeFilter;

//           const matchesStatus =
//             statusFilter === "ALL" ||
//             status ===
//               statusFilter;

//           return (
//             matchesSearch &&
//             matchesType &&
//             matchesStatus
//           );
//         }
//       );
//     }, [
//       invoices,
//       search,
//       typeFilter,
//       statusFilter,
//     ]);

//   // =========================================================
//   // SUMMARY
//   // =========================================================

//   const summary =
//     useMemo(() => {
//       const getCount =
//         (type) =>
//           invoices.filter(
//             (invoice) =>
//               getInvoiceSource(
//                 invoice
//               ).type === type
//           ).length;

//       return {
//         total:
//           invoices.length,

//         online:
//           getCount("ONLINE"),

//         walkIn:
//           getCount("WALK_IN"),

//         walkInOrder:
//           getCount(
//             "WALK_IN_ORDER"
//           ),

//         rental:
//           getCount("RENTAL"),

//         walkInRental:
//           getCount(
//             "WALK_IN_RENTAL"
//           ),

//         repair:
//           getCount("REPAIR"),

//         unpaid:
//           invoices.filter(
//             (invoice) => {
//               const status =
//                 getInvoiceStatus(
//                   invoice
//                 );

//               return (
//                 status ===
//                   "PENDING" ||
//                 status ===
//                   "UNPAID" ||
//                 status ===
//                   "PARTIAL"
//               );
//             }
//           ).length,
//       };
//     }, [invoices]);

//   // =========================================================
//   // OPEN INVOICE
//   // =========================================================

//   const openInvoice = async (
//     invoice
//   ) => {
//     try {
//       setDetailLoading(true);

//       // =====================================================
//       // RENTAL RECORD GENERATED FROM /rentals
//       //
//       // It does not exist in Invoice collection, so do NOT
//       // call getInvoiceById() with the frontend-generated ID.
//       // Open it directly.
//       // =====================================================

//       if (
//         invoice?.__isRentalInvoice === true
//       ) {
//         setSelectedInvoice(
//           invoice
//         );

//         return;
//       }

//       // =====================================================
//       // NORMAL INVOICE
//       // =====================================================

//       const response =
//         await getInvoiceById(
//           invoice?._id
//         );

//       console.log(
//         "INVOICE DETAIL:",
//         response
//       );

//       const data =
//         response?.data?.invoice ||
//         response?.data ||
//         response?.invoice ||
//         response;

//       setSelectedInvoice(
//         data
//       );
//     } catch (error) {
//       console.error(
//         "Open invoice error:",
//         error
//       );

//       toast.error(
//         error?.response?.data
//           ?.message ||
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

//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

//         <div>
//           <div className="flex items-center gap-3">

//             <div className="w-11 h-11 rounded-xl bg-gray-800 text-white flex items-center justify-center">
//               <Receipt
//                 size={22}
//               />
//             </div>

//             <div>

//               <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//                 Invoice Management
//               </h1>

//               <p className="text-gray-500 mt-1">
//                 Manage all online, walk-in, rental,
//                 repair and order invoices.
//               </p>

//             </div>

//           </div>
//         </div>

//         <button
//           onClick={
//             loadInvoices
//           }
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
//           SUMMARY CARDS
//       ===================================================== */}

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-8 gap-4 mb-6">

//         <Card
//           title="Total"
//           value={
//             summary.total
//           }
//           icon={
//             <FileText
//               size={21}
//             />
//           }
//         />

//         <Card
//           title="Online"
//           value={
//             summary.online
//           }
//           icon={
//             <Globe
//               size={21}
//               className="text-green-600"
//             />
//           }
//         />

//         <Card
//           title="Walk-In Sale"
//           value={
//             summary.walkIn
//           }
//           icon={
//             <Store
//               size={21}
//               className="text-blue-600"
//             />
//           }
//         />

//         <Card
//           title="Walk-In Order"
//           value={
//             summary.walkInOrder
//           }
//           icon={
//             <ShoppingBag
//               size={21}
//               className="text-cyan-600"
//             />
//           }
//         />

//         <Card
//           title="Rental"
//           value={
//             summary.rental
//           }
//           icon={
//             <Laptop
//               size={21}
//               className="text-purple-600"
//             />
//           }
//         />

//         <Card
//           title="Walk-In Rental"
//           value={
//             summary.walkInRental
//           }
//           icon={
//             <Package
//               size={21}
//               className="text-indigo-600"
//             />
//           }
//         />

//         <Card
//           title="Repair"
//           value={
//             summary.repair
//           }
//           icon={
//             <Wrench
//               size={21}
//               className="text-orange-600"
//             />
//           }
//         />

//         <Card
//           title="Unpaid"
//           value={
//             summary.unpaid
//           }
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
//               placeholder="Search invoice, customer, order, rental, repair..."
//               className="w-full border rounded-lg pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
//             />

//           </div>

//           {/* TYPE */}

//           <select
//             value={
//               typeFilter
//             }
//             onChange={(e) =>
//               setTypeFilter(
//                 e.target.value
//               )
//             }
//             className="border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
//           >

//             <option value="ALL">
//               All Invoice Types
//             </option>

//             <option value="ONLINE">
//               Online / E-Commerce
//             </option>

//             <option value="WALK_IN">
//               Walk-In Sale
//             </option>

//             <option value="WALK_IN_ORDER">
//               Walk-In Order
//             </option>

//             <option value="RENTAL">
//               Rental
//             </option>

//             <option value="WALK_IN_RENTAL">
//               Walk-In Rental
//             </option>

//             <option value="REPAIR">
//               Repair
//             </option>

//             <option value="OTHER">
//               Other
//             </option>

//           </select>

//           {/* STATUS */}

//           <select
//             value={
//               statusFilter
//             }
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

//             <option value="CANCELLED">
//               Cancelled
//             </option>

//             <option value="UNPAID">
//               Unpaid
//             </option>

//           </select>

//         </div>

//         {/* FILTER RESULT */}

//         <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
//           <ClipboardList
//             size={15}
//           />

//           Showing{" "}
//           <strong className="text-gray-800">
//             {
//               filteredInvoices.length
//             }
//           </strong>{" "}
//           of{" "}
//           <strong className="text-gray-800">
//             {invoices.length}
//           </strong>{" "}
//           invoices
//         </div>

//       </div>

//       {/* =====================================================
//           TABLE
//       ===================================================== */}

//       <div className="bg-white border shadow-sm rounded-xl overflow-hidden">

//         <div className="overflow-x-auto">

//           <table className="w-full min-w-[1450px]">

//             <thead className="bg-gray-100">

//               <tr>

//                 <th className="text-left px-4 py-3 text-sm font-semibold">
//                   Invoice
//                 </th>

//                 <th className="text-left px-4 py-3 text-sm font-semibold">
//                   Customer
//                 </th>

//                 <th className="text-left px-4 py-3 text-sm font-semibold">
//                   Type
//                 </th>

//                 <th className="text-left px-4 py-3 text-sm font-semibold">
//                   Reference
//                 </th>

//                 <th className="text-left px-4 py-3 text-sm font-semibold">
//                   Total
//                 </th>

//                 <th className="text-left px-4 py-3 text-sm font-semibold">
//                   Paid
//                 </th>

//                 <th className="text-left px-4 py-3 text-sm font-semibold">
//                   Balance
//                 </th>

//                 <th className="text-left px-4 py-3 text-sm font-semibold">
//                   Status
//                 </th>

//                 <th className="text-left px-4 py-3 text-sm font-semibold">
//                   Date
//                 </th>

//                 <th className="text-right px-4 py-3 text-sm font-semibold">
//                   Action
//                 </th>

//               </tr>

//             </thead>

//             <tbody>

//               {loading ? (

//                 <tr>

//                   <td
//                     colSpan="10"
//                     className="text-center py-16 text-gray-500"
//                   >

//                     <RefreshCw
//                       size={24}
//                       className="animate-spin mx-auto mb-3"
//                     />

//                     Loading invoices...

//                   </td>

//                 </tr>

//               ) : filteredInvoices.length ===
//                 0 ? (

//                 <tr>

//                   <td
//                     colSpan="10"
//                     className="text-center py-16 text-gray-500"
//                   >

//                     <FileText
//                       size={35}
//                       className="mx-auto mb-3 text-gray-300"
//                     />

//                     <p className="font-medium">
//                       No invoices found
//                     </p>

//                     <p className="text-sm mt-1">
//                       Try changing your search
//                       or filters.
//                     </p>

//                   </td>

//                 </tr>

//               ) : (

//                 filteredInvoices.map(
//                   (invoice) => {

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
//                       getReference(
//                         invoice
//                       );

//                     return (
//                       <tr
//                         key={
//                           invoice?._id
//                         }
//                         className="border-t hover:bg-gray-50 transition"
//                       >

//                         {/* INVOICE */}

//                         <td className="px-4 py-4">

//                           <div className="font-semibold text-gray-800">
//                             {
//                               invoice?.invoiceNumber ||
//                               "-"
//                             }
//                           </div>

//                           <div className="text-xs text-gray-400 mt-1 break-all max-w-[180px]">
//                             ID:{" "}
//                             {
//                               invoice?._id ||
//                               "-"
//                             }
//                           </div>

//                         </td>

//                         {/* CUSTOMER */}

//                         <td className="px-4 py-4">

//                           <div className="font-medium text-gray-800">
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

//                         {/* TYPE */}

//                         <td className="px-4 py-4">

//                           <div className="flex items-center gap-3">

//                             <div
//                               className={`w-10 h-10 rounded-lg flex items-center justify-center ${sourceClass(
//                                 type
//                               )}`}
//                             >
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

//                           <div className="text-sm font-medium break-all max-w-[220px]">
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

//                         <td className="px-4 py-4 font-semibold text-gray-800">
//                           {
//                             money(
//                               invoice?.totalAmount
//                             )
//                           }
//                         </td>

//                         {/* PAID */}

//                         <td className="px-4 py-4 font-medium text-green-700">
//                           {
//                             money(
//                               invoice?.paidAmount
//                             )
//                           }
//                         </td>

//                         {/* BALANCE */}

//                         <td className="px-4 py-4 font-medium text-red-600">
//                           {
//                             money(
//                               invoice?.balanceAmount
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

//                           <div className="flex items-center gap-2">

//                             <CalendarDays
//                               size={15}
//                             />

//                             {
//                               formatDate(
//                                 invoice?.invoiceDate ||
//                                   invoice?.createdAt
//                               )
//                             }

//                           </div>

//                         </td>

//                         {/* ACTION */}

//                         <td className="px-4 py-4 text-right">

//                           <button
//                             onClick={() =>
//                               openInvoice(
//                                 invoice
//                               )
//                             }
//                             className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
//                           >

//                             <Eye
//                               size={16}
//                             />

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

//         <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

//           <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[94vh] overflow-y-auto shadow-2xl">

//             {/* MODAL HEADER */}

//             <div className="sticky top-0 z-10 bg-white flex justify-between items-center p-5 border-b">

//               <div>

//                 <div className="flex items-center gap-3">

//                   <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">

//                     <Receipt
//                       size={20}
//                     />

//                   </div>

//                   <div>

//                     <h2 className="text-xl font-bold text-gray-800">
//                       Invoice Details
//                     </h2>

//                     <p className="text-sm text-gray-500">
//                       {
//                         selectedInvoice.invoiceNumber ||
//                         "-"
//                       }
//                     </p>

//                   </div>

//                 </div>

//               </div>

//               <button
//                 onClick={() =>
//                   setSelectedInvoice(
//                     null
//                   )
//                 }
//                 className="p-2 rounded-lg hover:bg-gray-100"
//               >
//                 <X
//                   size={21}
//                 />
//               </button>

//             </div>

//             {/* MODAL CONTENT */}

//             {detailLoading ? (

//               <div className="p-16 text-center text-gray-500">

//                 <RefreshCw
//                   size={28}
//                   className="animate-spin mx-auto mb-3"
//                 />

//                 Loading invoice details...

//               </div>

//             ) : (

//               <div className="p-5">

//                 {/* SOURCE HEADER */}

//                 {(() => {

//                   const source =
//                     getInvoiceSource(
//                       selectedInvoice
//                     );

//                   const status =
//                     getInvoiceStatus(
//                       selectedInvoice
//                     );

//                   return (
//                     <div className="mb-6 border rounded-xl p-5 bg-gray-50">

//                       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

//                         <div>

//                           <p className="text-xs text-gray-500">
//                             Invoice Type
//                           </p>

//                           <div className="flex items-center gap-3 mt-2">

//                             <div
//                               className={`w-11 h-11 rounded-lg flex items-center justify-center ${sourceClass(
//                                 source.type
//                               )}`}
//                             >
//                               {
//                                 sourceIcon(
//                                   source.type
//                                 )
//                               }
//                             </div>

//                             <div>

//                               <span
//                                 className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${sourceClass(
//                                   source.type
//                                 )}`}
//                               >
//                                 {
//                                   source.label
//                                 }
//                               </span>

//                               <p className="text-xs text-gray-500 mt-1">
//                                 {
//                                   source.subLabel
//                                 }
//                               </p>

//                             </div>

//                           </div>

//                         </div>

//                         <div className="text-right">

//                           <p className="text-xs text-gray-500">
//                             Payment Status
//                           </p>

//                           <span
//                             className={`inline-flex mt-1 px-3 py-1 rounded-full text-sm font-bold ${statusClass(
//                               status
//                             )}`}
//                           >
//                             {
//                               status
//                             }
//                           </span>

//                         </div>

//                       </div>

//                     </div>
//                   );

//                 })()}

//                 {/* BASIC INFORMATION */}

//                 <SectionTitle>
//                   Basic Information
//                 </SectionTitle>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">

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
//                       selectedInvoice.invoiceDate ||
//                         selectedInvoice.createdAt
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
//                     label="Email"
//                     value={
//                       selectedInvoice
//                         ?.billingAddress
//                         ?.email ||
//                       selectedInvoice
//                         ?.customerEmail ||
//                       selectedInvoice
//                         ?.user
//                         ?.email ||
//                       selectedInvoice
//                         ?.customer
//                         ?.email
//                     }
//                   />

//                   <Info
//                     label="Payment Status"
//                     value={
//                       selectedInvoice.paymentStatus ||
//                       selectedInvoice.status
//                     }
//                   />

//                   <Info
//                     label="Payment Method"
//                     value={
//                       selectedInvoice.paymentMethod
//                     }
//                   />

//                   <Info
//                     label="Reference ID"
//                     value={
//                       getReference(
//                         selectedInvoice
//                       )
//                     }
//                   />

//                 </div>

//                 {/* TRANSACTION INFORMATION */}

//                 <SectionTitle>
//                   Transaction Information
//                 </SectionTitle>

//                 <div className="border rounded-xl p-5 mb-6 bg-white">

//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

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
//                       label="Order Source"
//                       value={
//                         selectedInvoice.orderSource
//                       }
//                     />

//                     <Info
//                       label="Rental Source"
//                       value={
//                         selectedInvoice.rentalSource
//                       }
//                     />

//                     <Info
//                       label="Rental Number"
//                       value={
//                         selectedInvoice.rentalNumber
//                       }
//                     />

//                     <Info
//                       label="Rental Duration"
//                       value={
//                         selectedInvoice.rentalDuration
//                           ? `${selectedInvoice.rentalDuration} ${
//                               normalize(
//                                 selectedInvoice.rentalDurationType ||
//                                   "MONTHS"
//                               ) === "DAYS"
//                                 ? "days"
//                                 : "months"
//                             }`
//                           : undefined
//                       }
//                     />

//                     <Info
//                       label="Monthly Rent"
//                       value={
//                         selectedInvoice.monthlyRent !==
//                         undefined
//                           ? money(
//                               selectedInvoice.monthlyRent
//                             )
//                           : undefined
//                       }
//                     />

//                     <Info
//                       label="Security Deposit"
//                       value={
//                         selectedInvoice.securityDeposit !==
//                         undefined
//                           ? money(
//                               selectedInvoice.securityDeposit
//                             )
//                           : undefined
//                       }
//                     />

//                     <Info
//                       label="GST %"
//                       value={
//                         selectedInvoice.gstPercentage !==
//                         undefined
//                           ? `${selectedInvoice.gstPercentage}%`
//                           : undefined
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

//                     <Info
//                       label="Transaction ID"
//                       value={
//                         selectedInvoice.transactionId
//                       }
//                     />

//                   </div>

//                 </div>

//                 {/* CUSTOMER ADDRESS */}

//                 {(selectedInvoice
//                   ?.billingAddress ||
//                   selectedInvoice
//                     ?.shippingAddress) && (

//                   <>
//                     <SectionTitle>
//                       Customer Address
//                     </SectionTitle>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

//                       <AddressCard
//                         title="Billing Address"
//                         address={
//                           selectedInvoice.billingAddress
//                         }
//                       />

//                       <AddressCard
//                         title="Shipping Address"
//                         address={
//                           selectedInvoice.shippingAddress
//                         }
//                       />

//                     </div>

//                   </>
//                 )}

//                 {/* ITEMS */}

//                 <SectionTitle>
//                   Invoice Items
//                 </SectionTitle>

//                 <div className="border rounded-xl overflow-hidden mb-6">

//                   <div className="overflow-x-auto">

//                     <table className="w-full min-w-[750px]">

//                       <thead className="bg-gray-100">

//                         <tr>

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
//                           selectedInvoice.products ||
//                           []
//                         ).length === 0 ? (

//                           <tr>

//                             <td
//                               colSpan="5"
//                               className="text-center py-10 text-gray-500"
//                             >
//                               No invoice items found.
//                             </td>

//                           </tr>

//                         ) : (

//                           (
//                             selectedInvoice.items ||
//                             selectedInvoice.products ||
//                             []
//                           ).map(
//                             (
//                               item,
//                               index
//                             ) => (

//                               <tr
//                                 key={
//                                   item?._id ||
//                                   index
//                                 }
//                                 className="border-t"
//                               >

//                                 <td className="px-4 py-4">

//                                   <div className="font-medium text-gray-800">

//                                     {
//                                       item?.title ||
//                                       item?.name ||
//                                       item?.productName ||
//                                       item?.product?.name ||
//                                       item?.description ||
//                                       "-"
//                                     }

//                                   </div>

//                                   {item?.description &&
//                                     item?.title && (
//                                       <div className="text-xs text-gray-500 mt-1">
//                                         {
//                                           item.description
//                                         }
//                                       </div>
//                                     )}

//                                 </td>

//                                 <td className="px-4 py-4">

//                                   {
//                                     item?.quantity ??
//                                     item?.qty ??
//                                     0
//                                   }

//                                 </td>

//                                 <td className="px-4 py-4">

//                                   {
//                                     money(
//                                       item?.price ??
//                                         item?.unitPrice
//                                     )
//                                   }

//                                 </td>

//                                 <td className="px-4 py-4">

//                                   {
//                                     money(
//                                       item?.discountAmount ??
//                                         item?.discount
//                                     )
//                                   }

//                                 </td>

//                                 <td className="px-4 py-4 text-right font-semibold">

//                                   {
//                                     money(
//                                       item?.total ??
//                                         item?.totalAmount
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

//                 <div className="flex justify-end">

//                   <div className="w-full max-w-md border rounded-xl p-5 bg-gray-50 space-y-3">

//                     <TotalRow
//                       label="Subtotal"
//                       value={money(
//                         selectedInvoice.subtotal
//                       )}
//                     />

//                     <TotalRow
//                       label="Discount"
//                       value={money(
//                         selectedInvoice.discount ||
//                           selectedInvoice.discountAmount
//                       )}
//                     />

//                     <TotalRow
//                       label="Tax"
//                       value={money(
//                         selectedInvoice.tax ||
//                           selectedInvoice.taxAmount ||
//                           selectedInvoice.gstAmount
//                       )}
//                     />

//                     <div className="border-t pt-3">

//                       <TotalRow
//                         label="Total Amount"
//                         value={money(
//                           selectedInvoice.totalAmount
//                         )}
//                         bold
//                       />

//                     </div>

//                     <TotalRow
//                       label="Paid Amount"
//                       value={money(
//                         selectedInvoice.paidAmount
//                       )}
//                     />

//                     <TotalRow
//                       label="Balance Amount"
//                       value={money(
//                         selectedInvoice.balanceAmount
//                       )}
//                       danger
//                       bold
//                     />

//                     {getInvoiceSource(
//                       selectedInvoice
//                     ).type.includes("RENTAL") &&
//                       selectedInvoice.securityDeposit !==
//                         undefined && (
//                         <div className="border-t pt-3 mt-3 text-sm">
//                           <TotalRow
//                             label="Security Deposit"
//                             value={money(
//                               selectedInvoice.securityDeposit
//                             )}
//                           />

//                           <TotalRow
//                             label="Deposit Paid"
//                             value={money(
//                               selectedInvoice.depositAmountPaid
//                             )}
//                           />
//                         </div>
//                       )}

//                   </div>

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

//       <div className="flex items-center justify-between gap-3">

//         <div>

//           <p className="text-sm text-gray-500">
//             {title}
//           </p>

//           <p className="text-2xl font-bold mt-1 text-gray-800">
//             {value}
//           </p>

//         </div>

//         <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
//           {icon}
//         </div>

//       </div>

//     </div>
//   );
// };

// // =========================================================
// // SECTION TITLE
// // =========================================================

// const SectionTitle = ({
//   children,
// }) => {
//   return (
//     <h3 className="font-semibold text-gray-800 mb-4">
//       {children}
//     </h3>
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

//       <p className="font-medium text-gray-800 mt-1 break-words">
//         {value || "-"}
//       </p>

//     </div>
//   );
// };

// // =========================================================
// // ADDRESS
// // =========================================================

// const AddressCard = ({
//   title,
//   address,
// }) => {
//   if (!address) {
//     return (
//       <div className="border rounded-xl p-4 bg-gray-50">

//         <h4 className="font-semibold mb-2">
//           {title}
//         </h4>

//         <p className="text-sm text-gray-400">
//           No address available
//         </p>

//       </div>
//     );
//   }

//   return (
//     <div className="border rounded-xl p-4 bg-gray-50">

//       <h4 className="font-semibold mb-3">
//         {title}
//       </h4>

//       <div className="text-sm text-gray-600 space-y-1">

//         {address.fullName && (
//           <div className="font-medium text-gray-800">
//             {address.fullName}
//           </div>
//         )}

//         {address.addressLine1 && (
//           <div>
//             {address.addressLine1}
//           </div>
//         )}

//         {address.addressLine2 && (
//           <div>
//             {address.addressLine2}
//           </div>
//         )}

//         {(address.city ||
//           address.state ||
//           address.pincode) && (

//           <div>
//             {[
//               address.city,
//               address.state,
//               address.pincode,
//             ]
//               .filter(Boolean)
//               .join(", ")}
//           </div>

//         )}

//         {address.phone && (
//           <div>
//             Phone:{" "}
//             {address.phone}
//           </div>
//         )}

//         {address.email && (
//           <div>
//             Email:{" "}
//             {address.email}
//           </div>
//         )}

//       </div>

//     </div>
//   );
// };

// // =========================================================
// // TOTAL ROW
// // =========================================================

// const TotalRow = ({
//   label,
//   value,
//   bold = false,
//   danger = false,
// }) => {
//   return (
//     <div
//       className={`flex justify-between gap-5 ${
//         bold
//           ? "font-bold"
//           : ""
//       } ${
//         danger
//           ? "text-red-600"
//           : "text-gray-800"
//       }`}
//     >

//       <span>
//         {label}
//       </span>

//       <span className="text-right">
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

import axios from "axios";

import {
  getAllInvoices,
  getInvoiceById,
} from "../../services/accountantInvoiceService";

import { getAllRentals } from "../../services/rentalApi";

import { toast } from "react-toastify";


// =========================================================
// API
// =========================================================

const API =
  import.meta.env.VITE_API_URL || "";


// =========================================================
// HELPERS
// =========================================================

const normalize = (value) => {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
};


const numberValue = (value) => {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
};


const moneyValue = (value) => {
  return numberValue(value);
};


// =========================================================
// COMPONENT
// =========================================================

const InvoiceManagement = () => {

  // =======================================================
  // STATE
  // =======================================================

  const [invoices, setInvoices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [selectedInvoice, setSelectedInvoice] =
    useState(null);

  const [detailLoading, setDetailLoading] =
    useState(false);


  // =======================================================
  // AUTH HEADERS
  // =======================================================

  const getAuthHeaders = () => {

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  };


  // =======================================================
  // EXTRACT ARRAY
  // =======================================================

  const extractArray = (response) => {

    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.data?.data)) {
      return response.data.data;
    }

    if (Array.isArray(response?.data?.invoices)) {
      return response.data.invoices;
    }

    if (Array.isArray(response?.data?.rentals)) {
      return response.data.rentals;
    }

    if (Array.isArray(response?.data?.repairs)) {
      return response.data.repairs;
    }

    if (Array.isArray(response?.invoices)) {
      return response.invoices;
    }

    if (Array.isArray(response?.rentals)) {
      return response.rentals;
    }

    if (Array.isArray(response?.repairs)) {
      return response.repairs;
    }

    if (Array.isArray(response?.results)) {
      return response.results;
    }

    if (Array.isArray(response?.result)) {
      return response.result;
    }

    return [];
  };


  // =======================================================
  // LOAD REPAIR RECORDS
  //
  // IMPORTANT:
  // Repair API is separate from Invoice collection.
  // Existing project endpoint:
  //
  // GET /api/newRepair/
  // =======================================================

  const loadRepairs = async () => {

    try {

      const response = await axios.get(
        `${API}/newRepair/`,
        {
          headers: getAuthHeaders(),
        }
      );

      console.log(
        "ACCOUNTANT REPAIR RESPONSE:",
        response
      );

      return extractArray(response);

    } catch (error) {

      console.error(
        "Load repairs error:",
        error
      );

      return [];
    }
  };


  // =======================================================
  // REPAIR HELPERS
  // =======================================================

  const repairIdOf = (repair) => {

    return (
      repair?._id ||
      repair?.id ||
      repair?.repairId ||
      repair?.repairRequestId ||
      ""
    );
  };


  const repairNumberOf = (repair) => {

    return (
      repair?.repairNumber ||
      repair?.repairNo ||
      repair?.ticketNumber ||
      repair?.ticketNo ||
      repair?.jobCardNumber ||
      repair?.jobCardNo ||
      `REPAIR-${String(
        repairIdOf(repair)
      )}`
    );
  };


  const repairCustomerNameOf = (repair) => {

    if (
      repair?.customerName
    ) {
      return repair.customerName;
    }

    if (
      repair?.customer?.name
    ) {
      return repair.customer.name;
    }

    if (
      repair?.customer?.fullName
    ) {
      return repair.customer.fullName;
    }

    if (
      repair?.customer?.firstName ||
      repair?.customer?.lastName
    ) {

      return (
        `${repair.customer.firstName || ""} ${
          repair.customer.lastName || ""
        }`.trim()
      );
    }

    if (
      repair?.user?.name
    ) {
      return repair.user.name;
    }

    if (
      repair?.user?.fullName
    ) {
      return repair.user.fullName;
    }

    if (
      repair?.user?.firstName ||
      repair?.user?.lastName
    ) {

      return (
        `${repair.user.firstName || ""} ${
          repair.user.lastName || ""
        }`.trim()
      );
    }

    if (
      repair?.billingAddress?.fullName
    ) {
      return repair.billingAddress.fullName;
    }

    return "Repair Customer";
  };


  const repairCustomerPhoneOf = (repair) => {

    return (
      repair?.customerPhone ||
      repair?.customer?.phone ||
      repair?.user?.phone ||
      repair?.billingAddress?.phone ||
      repair?.phone ||
      "-"
    );
  };


  const repairCustomerEmailOf = (repair) => {

    return (
      repair?.customerEmail ||
      repair?.customer?.email ||
      repair?.user?.email ||
      repair?.billingAddress?.email ||
      ""
    );
  };


  const repairDeviceNameOf = (repair) => {

    return (
      repair?.deviceName ||
      repair?.device?.name ||
      repair?.device?.model ||
      repair?.product?.name ||
      repair?.product?.title ||
      repair?.itemName ||
      repair?.serviceName ||
      "Repair Service"
    );
  };


  const repairAmountOf = (repair) => {

    const directAmount =
      repair?.finalAmount ??
      repair?.totalAmount ??
      repair?.invoiceAmount ??
      repair?.repairTotal ??
      repair?.totalCost;

    if (
      directAmount !== undefined &&
      directAmount !== null &&
      Number.isFinite(Number(directAmount))
    ) {
      return numberValue(directAmount);
    }

    const repairCost =
      numberValue(
        repair?.repairCost
      );

    const partCost =
      numberValue(
        repair?.partCost
      );

    const laborCost =
      numberValue(
        repair?.laborCost
      );

    if (repairCost > 0) {
      return repairCost;
    }

    return partCost + laborCost;
  };


  const repairSubtotalOf = (repair) => {

    const direct =
      repair?.subtotal ??
      repair?.baseAmount;

    if (
      direct !== undefined &&
      direct !== null
    ) {
      return numberValue(direct);
    }

    return repairAmountOf(repair);
  };


  const repairGstPercentageOf = (repair) => {

    return numberValue(
      repair?.gstPercentage ??
      repair?.gstPercent ??
      repair?.gst ??
      0
    );
  };


  const repairGstAmountOf = (repair) => {

    const direct =
      repair?.gstAmount ??
      repair?.taxAmount ??
      repair?.tax;

    if (
      direct !== undefined &&
      direct !== null
    ) {
      return numberValue(direct);
    }

    const subtotal =
      repairSubtotalOf(repair);

    const gst =
      repairGstPercentageOf(repair);

    return (
      subtotal * gst
    ) / 100;
  };


  const repairPaidAmountOf = (repair) => {

    return numberValue(
      repair?.paidAmount ??
      repair?.amountPaid ??
      repair?.paymentAmount ??
      repair?.repairPaidAmount ??
      repair?.paid
    );
  };


  // const repairPaymentStatusOf = (repair) => {

  //   const status =
  //     normalize(
  //       repair?.paymentStatus ||
  //       repair?.paymentState ||
  //       repair?.payment?.status ||
  //       ""
  //     );

  //   if (status) {
  //     return status;
  //   }

  //   if (
  //     repairPaidAmountOf(repair) >=
  //     repairAmountOf(repair)
  //   ) {
  //     return "PAID";
  //   }

  //   return "PENDING";
  // };



  const repairPaymentStatusOf = (repair) => {

  const total =
    repairTotalOf(
      repair
    );

  const paid =
    repairPaidAmountOf(
      repair
    );

  const rawStatus =
    normalize(
      repair?.paymentStatus ||
      repair?.paymentState ||
      repair?.payment?.status ||
      ""
    );


  if (
    rawStatus === "REFUNDED"
  ) {
    return "REFUNDED";
  }


  if (
    rawStatus === "FAILED"
  ) {
    return "FAILED";
  }


  if (
    rawStatus === "CANCELLED"
  ) {
    return "CANCELLED";
  }


  if (
    total > 0 &&
    paid >= total
  ) {
    return "PAID";
  }


  if (
    paid > 0 &&
    paid < total
  ) {
    return "PARTIAL";
  }


  if (
    rawStatus === "PAID" ||
    rawStatus === "SUCCESS" ||
    rawStatus === "COMPLETED"
  ) {
    return "PAID";
  }


  return "PENDING";
};

  const repairTotalOf = (repair) => {

    const direct =
      repair?.finalAmount ??
      repair?.totalAmount ??
      repair?.invoiceAmount ??
      repair?.repairTotal;

    if (
      direct !== undefined &&
      direct !== null
    ) {
      return numberValue(direct);
    }

    const subtotal =
      repairSubtotalOf(repair);

    const gstAmount =
      repairGstAmountOf(repair);

    const shipping =
      numberValue(
        repair?.shippingCharge
      );

    const otherCharges =
      numberValue(
        repair?.otherCharges
      );

    return (
      subtotal +
      gstAmount +
      shipping +
      otherCharges
    );
  };


  // =======================================================
  // CONVERT REPAIR -> INVOICE SHAPE
  // =======================================================

  const convertRepairToInvoice = (
    repair
  ) => {

    const repairId =
      repairIdOf(repair);

    const repairNumber =
      repairNumberOf(repair);

    const customerName =
      repairCustomerNameOf(repair);

    const customerPhone =
      repairCustomerPhoneOf(repair);

    const customerEmail =
      repairCustomerEmailOf(repair);

    const subtotal =
      repairSubtotalOf(repair);

    const gstPercentage =
      repairGstPercentageOf(repair);

    const gstAmount =
      repairGstAmountOf(repair);

    const couponDiscount =
      numberValue(
        repair?.couponDiscount
      );

    const offerDiscount =
      numberValue(
        repair?.offerDiscount ??
        repair?.discount ??
        repair?.discountAmount
      );

    const taxableAmount =
      numberValue(
        repair?.taxableAmount ??
        Math.max(
          subtotal -
            offerDiscount -
            couponDiscount,
          0
        )
      );

    const shippingCharge =
      numberValue(
        repair?.shippingCharge
      );

    const otherCharges =
      numberValue(
        repair?.otherCharges
      );

    const totalAmount =
      repairTotalOf(repair);

    const paidAmount =
      repairPaidAmountOf(repair);

    const balanceAmount =
      numberValue(
        repair?.balanceAmount ??
        Math.max(
          totalAmount -
            paidAmount,
          0
        )
      );

    const deviceName =
      repairDeviceNameOf(repair);

    return {

      // ===================================================
      // FRONTEND GENERATED REPAIR INVOICE
      // ===================================================

      __isRepairInvoice: true,

      __repairRecord: repair,

      _id:
        `repair-invoice-${String(
          repairId
        )}`,

      invoiceNumber:
        `REPAIR-${String(
          repairNumber
        )}`,

      invoiceFor:
        "REPAIR",

      invoiceDate:
        repair?.invoiceDate ||
        repair?.completedAt ||
        repair?.createdAt ||
        repair?.updatedAt,

      createdAt:
        repair?.createdAt,

      // ===================================================
      // SOURCE
      // ===================================================

      source:
        "REPAIR",

      invoiceSource:
        "REPAIR",

      repairId:
        repairId,

      repairRequestId:
        repair?.repairRequestId ||
        repairId,

      repairNumber:
        repairNumber,

      repairNo:
        repairNumber,

      // ===================================================
      // CUSTOMER
      // ===================================================

      customerName:
        customerName,

      customerPhone:
        customerPhone,

      customerEmail:
        customerEmail,

      customer:
        repair?.customer,

      user:
        repair?.user,

      billingAddress:
        repair?.billingAddress ||
        {
          fullName:
            customerName,
          phone:
            customerPhone,
          email:
            customerEmail,
        },

      shippingAddress:
        repair?.shippingAddress,

      // ===================================================
      // REPAIR
      // ===================================================

      deviceName:
        deviceName,

      device:
        repair?.device,

      repairStatus:
        repair?.status ||
        repair?.repairStatus,

      assignedTechnician:
        repair?.assignedTechnician ||
        repair?.technician,

      // ===================================================
      // AMOUNTS
      // ===================================================

      subtotal:
        subtotal,

      discount:
        offerDiscount,

      discountAmount:
        offerDiscount,

      offerDiscount:
        offerDiscount,

      couponDiscount:
        couponDiscount,

      taxableAmount:
        taxableAmount,

      gstPercentage:
        gstPercentage,

      gstAmount:
        gstAmount,

      tax:
        gstAmount,

      taxAmount:
        gstAmount,

      shippingCharge:
        shippingCharge,

      otherCharges:
        otherCharges,

      totalAmount:
        totalAmount,

      finalAmount:
        totalAmount,

      paidAmount:
        paidAmount,

      balanceAmount:
        balanceAmount,

      // ===================================================
      // PAYMENT
      // ===================================================

      paymentStatus:
        repairPaymentStatusOf(repair),

      status:
        repair?.status ||
        repairPaymentStatusOf(repair),

      paymentMethod:
        repair?.paymentMethod ||
        repair?.payment?.method,

      paymentSource:
        "REPAIR",

      transactionId:
        repair?.transactionId ||
        repair?.payment?.transactionId,

      referenceId:
        repairId,

      // ===================================================
      // ITEMS
      // ===================================================

      items: [
        {
          _id:
            `repair-item-${String(
              repairId
            )}`,

          title:
            deviceName,

          description:
            repair?.problemDescription ||
            repair?.issue ||
            repair?.description ||
            repair?.serviceDescription ||
            "Repair / Service",

          quantity: 1,

          price:
            subtotal,

          unitPrice:
            subtotal,

          originalPrice:
            subtotal,

          discountAmount:
            offerDiscount,

          discount:
            offerDiscount,

          total:
            subtotal,

          totalAmount:
            subtotal,

          itemType:
            "REPAIR",

          referenceId:
            repairId,
        },
      ],

      notes:
        repair?.notes ||
        repair?.remarks ||
        repair?.description ||
        "",
    };
  };


  // =======================================================
  // LOAD ALL INVOICES
  // =======================================================

  const loadInvoices = async () => {

    try {

      setLoading(true);

      // ===================================================
      // LOAD:
      // 1. NORMAL INVOICES
      // 2. RENTALS
      // 3. REPAIRS
      // ===================================================

      const [
        invoiceResult,
        rentalResult,
        repairResult,
      ] = await Promise.allSettled([

        getAllInvoices(),

        getAllRentals(),

        loadRepairs(),

      ]);


      // ===================================================
      // NORMAL INVOICES
      // ===================================================

      let invoiceList = [];

      if (
        invoiceResult.status ===
        "fulfilled"
      ) {

        const response =
          invoiceResult.value;

        console.log(
          "ACCOUNTANT INVOICES RESPONSE:",
          response
        );

        invoiceList =
          extractArray(response);

      } else {

        console.error(
          "Load normal invoices error:",
          invoiceResult.reason
        );
      }


      // ===================================================
      // RENTALS
      // ===================================================

      let rentalList = [];

      if (
        rentalResult.status ===
        "fulfilled"
      ) {

        const response =
          rentalResult.value;

        console.log(
          "ACCOUNTANT RENTALS RESPONSE:",
          response
        );

        rentalList =
          extractArray(response);

      } else {

        console.error(
          "Load rentals error:",
          rentalResult.reason
        );
      }


      // ===================================================
      // REPAIRS
      // ===================================================

      let repairList = [];

      if (
        repairResult.status ===
        "fulfilled"
      ) {

        repairList =
          Array.isArray(
            repairResult.value
          )
            ? repairResult.value
            : [];

        console.log(
          "ACCOUNTANT REPAIRS:",
          repairList
        );

      } else {

        console.error(
          "Load repairs error:",
          repairResult.reason
        );
      }


      // ===================================================
      // RENTAL HELPERS
      // ===================================================

      const rentalIdOf = (rental) =>
        rental?._id ||
        rental?.id ||
        rental?.rentalId ||
        "";


      const rentalNumberOf = (rental) =>
        rental?.rentalNumber ||
        rental?.rentalNo ||
        rental?.rental_number ||
        rentalIdOf(rental);


      const rentalDurationTypeOf = (
        rental
      ) =>
        normalize(
          rental?.rentalDurationType ||
          "MONTHS"
        ) === "DAYS"
          ? "DAYS"
          : "MONTHS";


      const rentalDurationOf = (
        rental
      ) => {

        const value =
          numberValue(
            rental?.rentalDuration ??
            rental?.rentalMonths ??
            1
          );

        return value > 0
          ? value
          : 1;
      };


      const monthlyRentOf = (
        rental
      ) =>
        numberValue(
          rental?.monthlyRent ??
          rental?.rentalProduct
            ?.monthlyRent ??
          rental?.rentalProduct
            ?.price ??
          rental?.product
            ?.monthlyRent ??
          0
        );


      const rentalBaseAmountOf = (
        rental
      ) => {

        const monthlyRent =
          monthlyRentOf(rental);

        const duration =
          rentalDurationOf(rental);

        const type =
          rentalDurationTypeOf(
            rental
          );

        if (
          type === "DAYS"
        ) {
          return (
            (monthlyRent / 30) *
            duration
          );
        }

        return (
          monthlyRent *
          duration
        );
      };


      const gstPercentageOf = (
        rental
      ) =>
        numberValue(
          rental?.gstPercentage ??
          rental?.gst ??
          0
        );


      const rentalGstAmountOf = (
        rental
      ) => {

        const direct =
          rental?.gstAmount ??
          rental?.taxAmount;

        if (
          direct !== undefined &&
          direct !== null
        ) {
          return numberValue(
            direct
          );
        }

        const base =
          rentalBaseAmountOf(
            rental
          );

        const gst =
          gstPercentageOf(
            rental
          );

        return (
          base * gst
        ) / 100;
      };


      const rentalTotalOf = (
        rental
      ) => {

        const direct =
          rental?.finalAmount ??
          rental?.totalAmount;

        if (
          direct !== undefined &&
          direct !== null
        ) {
          return numberValue(
            direct
          );
        }

        return (
          rentalBaseAmountOf(
            rental
          ) +
          rentalGstAmountOf(
            rental
          )
        );
      };


      const rentalCustomerNameOf = (
        rental
      ) => {

        if (
          normalize(
            rental?.customerType
          ) === "COMPANY"
        ) {

          return (
            rental?.companyDetails
              ?.contactPerson ||
            rental?.companyDetails
              ?.companyName ||
            "Company Customer"
          );
        }

        return (
          rental?.individualDetails
            ?.fullName ||
          rental?.individualDetails
            ?.name ||
          rental?.customer?.name ||
          rental?.customer?.fullName ||
          "Walk-In Customer"
        );
      };


      const rentalCustomerPhoneOf = (
        rental
      ) => {

        if (
          normalize(
            rental?.customerType
          ) === "COMPANY"
        ) {

          return (
            rental?.companyDetails
              ?.phone ||
            "-"
          );
        }

        return (
          rental?.individualDetails
            ?.phone ||
          rental?.customer?.phone ||
          "-"
        );
      };


      const rentalCustomerEmailOf = (
        rental
      ) => {

        if (
          normalize(
            rental?.customerType
          ) === "COMPANY"
        ) {

          return (
            rental?.companyDetails
              ?.email ||
            ""
          );
        }

        return (
          rental?.individualDetails
            ?.email ||
          rental?.customer?.email ||
          ""
        );
      };


      const rentalProductNameOf = (
        rental
      ) =>
        rental?.product?.name ||
        rental?.product?.title ||
        rental?.rentalProduct
          ?.product?.name ||
        rental?.rentalProduct
          ?.product?.title ||
        rental?.rentalProduct?.name ||
        "Rental Product";


      const rentalProductBrandOf = (
        rental
      ) => {

        const brand =
          rental?.product?.brand ||
          rental?.rentalProduct
            ?.product?.brand;

        if (
          typeof brand ===
            "object" &&
          brand !== null
        ) {

          return (
            brand?.name ||
            brand?.title ||
            ""
          );
        }

        return brand || "";
      };


      const rentalSourceOf = (
        rental
      ) => {

        const source =
          normalize(
            rental?.rentalSource ||
            rental?.source ||
            rental?.orderSource ||
            ""
          );

        return source ===
          "WALK_IN"
          ? "WALK_IN_RENTAL"
          : "RENTAL";
      };


      // ===================================================
      // EXISTING RENTAL IDS
      // ===================================================

      const existingRentalIds =
        new Set(
          invoiceList
            .map(
              (invoice) =>
                invoice?.rentalId
            )
            .filter(Boolean)
            .map((id) =>
              String(id)
            )
        );


      // ===================================================
      // RENTAL -> INVOICE
      // ===================================================

      const rentalInvoices =
        rentalList
          .filter(
            (rental) => {

              const rentalId =
                rentalIdOf(
                  rental
                );

              if (!rentalId) {
                return false;
              }

              return !existingRentalIds.has(
                String(
                  rentalId
                )
              );
            }
          )
          .map(
            (rental) => {

              const rentalId =
                rentalIdOf(
                  rental
                );

              const rentalNumber =
                rentalNumberOf(
                  rental
                );

              const baseAmount =
                rentalBaseAmountOf(
                  rental
                );

              const gstAmount =
                rentalGstAmountOf(
                  rental
                );

              const totalAmount =
                rentalTotalOf(
                  rental
                );

              const durationType =
                rentalDurationTypeOf(
                  rental
                );

              const duration =
                rentalDurationOf(
                  rental
                );

              const monthlyRent =
                monthlyRentOf(
                  rental
                );

              const gstPercentage =
                gstPercentageOf(
                  rental
                );

              const customerName =
                rentalCustomerNameOf(
                  rental
                );

              const customerPhone =
                rentalCustomerPhoneOf(
                  rental
                );

              const customerEmail =
                rentalCustomerEmailOf(
                  rental
                );

              const productName =
                rentalProductNameOf(
                  rental
                );

              const brand =
                rentalProductBrandOf(
                  rental
                );

              const paymentStatus =
                normalize(
                  rental?.paymentStatus ||
                  rental?.paymentState ||
                  (
                    rental?.status ===
                    "ACTIVE"
                      ? "PAID"
                      : "PENDING"
                  )
                );

              const depositPaid =
                numberValue(
                  rental?.depositAmountPaid ??
                  rental?.depositPaid ??
                  rental?.securityDepositPaid ??
                  rental?.paidDeposit ??
                  rental?.deposit
                    ?.paidAmount ??
                  rental?.deposit
                    ?.amountPaid ??
                  0
                );

              const paidAmount =
                numberValue(
                  rental?.rentPaidAmount ??
                  rental?.rentalPaidAmount ??
                  rental?.paidAmount ??
                  rental?.amountPaid ??
                  0
                );

              return {

                __isRentalInvoice:
                  true,

                __rentalRecord:
                  rental,

                _id:
                  `rental-invoice-${String(
                    rentalId
                  )}`,

                invoiceNumber:
                  `RENTAL-${String(
                    rentalNumber
                  )}`,

                invoiceFor:
                  "Rental",

                invoiceDate:
                  rental?.invoiceDate ||
                  rental?.startDate ||
                  rental?.createdAt,

                createdAt:
                  rental?.createdAt,

                source:
                  rentalSourceOf(
                    rental
                  ),

                invoiceSource:
                  rentalSourceOf(
                    rental
                  ),

                rentalSource:
                  normalize(
                    rental?.rentalSource ||
                    rental?.source ||
                    ""
                  ) ||
                  "ONLINE",

                rentalId:
                  rentalId,

                rentalNumber:
                  rentalNumber,

                customerName:
                  customerName,

                customerPhone:
                  customerPhone,

                customerEmail:
                  customerEmail,

                customerType:
                  rental?.customerType ||
                  "INDIVIDUAL",

                individualDetails:
                  rental?.individualDetails,

                companyDetails:
                  rental?.companyDetails,

                billingAddress: {
                  fullName:
                    customerName,
                  phone:
                    customerPhone,
                  email:
                    customerEmail,
                  ...(rental?.billingAddress ||
                    {}),
                },

                shippingAddress:
                  rental?.shippingAddress,

                product:
                  rental?.product,

                rentalProduct:
                  rental?.rentalProduct,

                rentalDurationType:
                  durationType,

                rentalDuration:
                  duration,

                rentalMonths:
                  rental?.rentalMonths,

                monthlyRent:
                  monthlyRent,

                securityDeposit:
                  numberValue(
                    rental?.securityDeposit
                  ),

                depositAmountPaid:
                  depositPaid,

                gstPercentage:
                  gstPercentage,

                gstAmount:
                  gstAmount,

                subtotal:
                  baseAmount,

                tax:
                  gstAmount,

                taxAmount:
                  gstAmount,

                discount:
                  0,

                discountAmount:
                  0,

                couponDiscount:
                  numberValue(
                    rental?.couponDiscount
                  ),

                shippingCharge:
                  numberValue(
                    rental?.shippingCharge
                  ),

                otherCharges:
                  numberValue(
                    rental?.otherCharges
                  ),

                taxableAmount:
                  numberValue(
                    rental?.taxableAmount ??
                    baseAmount
                  ),

                totalAmount:
                  totalAmount,

                finalAmount:
                  totalAmount,

                paidAmount:
                  paidAmount,

                balanceAmount:
                  Math.max(
                    totalAmount -
                      paidAmount,
                    0
                  ),

                paymentStatus:
                  paymentStatus,

                status:
                  rental?.status ||
                  paymentStatus,

                paymentMethod:
                  rental?.paymentMethod ||
                  rental?.payment?.method,

                paymentSource:
                  rental?.paymentSource ||
                  rental?.rentalSource ||
                  "RENTAL",

                referenceId:
                  rentalId,

                transactionId:
                  rental?.transactionId ||
                  rental?.payment
                    ?.transactionId,

                items: [
                  {
                    _id:
                      `rental-item-${String(
                        rentalId
                      )}`,

                    title:
                      productName,

                    description:
                      [
                        brand,
                        `${duration} ${durationType.toLowerCase()}`,
                        `₹${monthlyRent.toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 2,
                          }
                        )}/month`,
                      ]
                        .filter(Boolean)
                        .join(" • "),

                    quantity: 1,

                    price:
                      baseAmount,

                    unitPrice:
                      baseAmount,

                    discountAmount:
                      0,

                    discount:
                      0,

                    total:
                      baseAmount,

                    totalAmount:
                      baseAmount,
                  },
                ],

                rentalStatus:
                  rental?.status,

                expectedEndDate:
                  rental?.expectedEndDate,

                nextPaymentDate:
                  rental?.nextPaymentDate,

                notes:
                  rental?.notes ||
                  rental?.handOverNotes,
              };
            }
          );


      // ===================================================
      // EXISTING REPAIR IDS
      // ===================================================

      const existingRepairIds =
        new Set(
          invoiceList
            .filter(
              (invoice) =>
                normalize(
                  invoice?.invoiceFor
                ) === "REPAIR" ||
                Boolean(
                  invoice?.repairId
                ) ||
                Boolean(
                  invoice?.repairRequestId
                )
            )
            .map(
              (invoice) =>
                invoice?.repairId ||
                invoice?.repairRequestId ||
                invoice?.referenceId
            )
            .filter(Boolean)
            .map((id) =>
              String(id)
            )
        );


      // ===================================================
      // REPAIR -> INVOICE
      // ===================================================

      const repairInvoices =
        repairList
          .filter(
            (repair) => {

              const repairId =
                repairIdOf(
                  repair
                );

              if (!repairId) {
                return false;
              }

              return !existingRepairIds.has(
                String(
                  repairId
                )
              );
            }
          )
          .map(
            convertRepairToInvoice
          );


      // ===================================================
      // MERGE EVERYTHING
      // ===================================================

      const mergedInvoices = [
        ...invoiceList,
        ...rentalInvoices,
        ...repairInvoices,
      ];


      console.log(
        "NORMAL INVOICES:",
        invoiceList
      );

      console.log(
        "RENTAL INVOICES:",
        rentalInvoices
      );

      console.log(
        "REPAIR INVOICES:",
        repairInvoices
      );

      console.log(
        "FINAL ACCOUNTANT INVOICES:",
        mergedInvoices
      );


      setInvoices(
        Array.isArray(
          mergedInvoices
        )
          ? mergedInvoices
          : []
      );

    } catch (error) {

      console.error(
        "Load invoices error:",
        error
      );

      toast.error(
        error?.response?.data
          ?.message ||
        "Failed to load invoices"
      );

      setInvoices([]);

    } finally {

      setLoading(false);

    }
  };


  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {

    loadInvoices();

  }, []);


  // =======================================================
  // MONEY
  // =======================================================

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


  // =======================================================
  // DATE
  // =======================================================

  const formatDate = (value) => {

    if (!value) {
      return "-";
    }

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


  // =======================================================
  // SOURCE VALUES
  // =======================================================

  const getSourceValues = (
    invoice
  ) => {

    return [
      invoice?.source,
      invoice?.invoiceSource,
      invoice?.orderType,
      invoice?.orderSource,
      invoice?.saleSource,
      invoice?.salesSource,
      invoice?.rentalSource,
      invoice?.repairSource,
      invoice?.transactionType,
      invoice?.type,
      invoice?.invoiceType,
      invoice?.invoiceFor,
      invoice?.paymentSource,
    ]
      .filter(Boolean)
      .map(normalize);
  };


  // =======================================================
  // INVOICE SOURCE
  // =======================================================

  const getInvoiceSource = (
    invoice
  ) => {

    if (!invoice) {

      return {
        type: "OTHER",
        label: "OTHER",
        subLabel: "Invoice",
      };
    }


    const values =
      getSourceValues(
        invoice
      );


    const has = (
      list
    ) =>
      list.some(
        (item) =>
          values.includes(
            normalize(item)
          )
      );


    const hasRental =
      Boolean(
        invoice?.rentalId ||
        invoice?.rentalProductId
      );


    const hasRepair =
      Boolean(
        invoice?.repairId ||
        invoice?.repairRequestId ||
        invoice?.__isRepairInvoice
      );


    const hasOrder =
      Boolean(
        invoice?.orderId
      );


    // ===================================================
    // REPAIR
    // IMPORTANT: check early
    // ===================================================

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


    // ===================================================
    // WALK-IN RENTAL
    // ===================================================

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
          invoice?.walkInRental ===
            true ||
          invoice?.isWalkInRental ===
            true ||
          invoice?.walkIn ===
            true
        )
      )
    ) {

      return {
        type:
          "WALK_IN_RENTAL",
        label:
          "WALK-IN RENTAL",
        subLabel:
          "Counter / Walk-In Rental",
      };
    }


    // ===================================================
    // RENTAL
    // ===================================================

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


    // ===================================================
    // WALK-IN ORDER
    // ===================================================

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
          invoice?.walkInOrder ===
            true ||
          invoice?.isWalkInOrder ===
            true ||
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
        type:
          "WALK_IN_ORDER",
        label:
          "WALK-IN ORDER",
        subLabel:
          "Counter / Store Order",
      };
    }


    // ===================================================
    // WALK-IN SALE
    // ===================================================

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
      invoice?.walkIn ===
        true ||
      invoice?.isWalkIn ===
        true ||
      invoice?.walkInSale ===
        true
    ) {

      return {
        type: "WALK_IN",
        label:
          "WALK-IN SALE",
        subLabel:
          "Counter / Store Sale",
      };
    }


    // ===================================================
    // ONLINE
    // ===================================================

    if (
      has([
        "ONLINE",
        "ECOMMERCE",
        "E_COMMERCE",
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
        label:
          "ONLINE ORDER",
        subLabel:
          "E-Commerce Order",
      };
    }


    // ===================================================
    // FALLBACK
    // ===================================================

    if (
      has([
        "ORDER",
        "SALE",
      ])
    ) {

      return {
        type: "ONLINE",
        label:
          "ONLINE ORDER",
        subLabel:
          "E-Commerce Order",
      };
    }


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


  // =======================================================
  // PAYMENT STATUS
  // =======================================================

  // const getInvoiceStatus = (
  //   invoice
  // ) => {

  //   return normalize(
  //     invoice?.paymentStatus ||
  //     invoice?.status ||
  //     invoice?.paymentState ||
  //     "PENDING"
  //   );
  // };


  // =======================================================
// PAYMENT HELPERS
// IMPORTANT:
// Paid amount is authoritative for invoice display.
// If paidAmount >= totalAmount => PAID
// =======================================================

const getInvoiceTotalAmount = (invoice) => {

  if (!invoice) {
    return 0;
  }

  const directTotal =
    invoice?.finalAmount ??
    invoice?.totalAmount ??
    invoice?.invoiceAmount ??
    invoice?.grandTotal ??
    invoice?.total;

  if (
    directTotal !== undefined &&
    directTotal !== null &&
    Number.isFinite(Number(directTotal))
  ) {
    return Math.max(
      numberValue(directTotal),
      0
    );
  }

  // Fallback calculation
  const subtotal =
    numberValue(
      invoice?.subtotal
    );

  const discount =
    numberValue(
      invoice?.discountAmount ??
      invoice?.discount
    );

  const couponDiscount =
    numberValue(
      invoice?.couponDiscount
    );

  const gstAmount =
    numberValue(
      invoice?.gstAmount ??
      invoice?.taxAmount ??
      invoice?.tax
    );

  const shippingCharge =
    numberValue(
      invoice?.shippingCharge
    );

  const otherCharges =
    numberValue(
      invoice?.otherCharges
    );

  return Math.max(
    subtotal -
      discount -
      couponDiscount +
      gstAmount +
      shippingCharge +
      otherCharges,
    0
  );
};


// =======================================================
// PAID AMOUNT
// =======================================================

// const getInvoicePaidAmount = (invoice) => {

//   if (!invoice) {
//     return 0;
//   }

//   const paid =
//     invoice?.paidAmount ??
//     invoice?.amountPaid ??
//     invoice?.paymentAmount ??
//     invoice?.paid ??
//     invoice?.payment?.paidAmount ??
//     invoice?.payment?.amountPaid ??
//     invoice?.payment?.amount ??
//     invoice?.transaction?.paidAmount ??
//     0;

//   return Math.max(
//     numberValue(paid),
//     0
//   );
// };


const getInvoicePaidAmount = (invoice) => {
  if (!invoice) {
    return 0;
  }

  const paid =
    invoice?.paidAmount ??
    invoice?.amountPaid ??
    invoice?.paymentAmount ??
    invoice?.paid ??
    invoice?.payment?.paidAmount ??
    invoice?.payment?.amountPaid ??
    invoice?.payment?.amount ??
    invoice?.transaction?.paidAmount ??
    invoice?.razorpayPayment?.amount ??
    invoice?.paymentDetails?.paidAmount ??
    0;

  return Math.max(numberValue(paid), 0);
};

// =======================================================
// BALANCE AMOUNT
// =======================================================

const getInvoiceBalanceAmount = (invoice) => {

  if (!invoice) {
    return 0;
  }

  const total =
    getInvoiceTotalAmount(
      invoice
    );

  const paid =
    getInvoicePaidAmount(
      invoice
    );

  // If backend already provides balance,
  // use it only when it is valid.
  const backendBalance =
    invoice?.balanceAmount ??
    invoice?.remainingAmount ??
    invoice?.dueAmount;

  if (
    backendBalance !== undefined &&
    backendBalance !== null &&
    Number.isFinite(
      Number(backendBalance)
    )
  ) {

    const calculatedBalance =
      Math.max(
        total - paid,
        0
      );

    // IMPORTANT:
    // If paid amount is full, balance MUST be zero.
    if (
      paid >= total &&
      total > 0
    ) {
      return 0;
    }

    return Math.max(
      numberValue(
        backendBalance
      ),
      calculatedBalance
    );
  }

  return Math.max(
    total - paid,
    0
  );
};


// =======================================================
// PAYMENT STATUS
// =======================================================

const getInvoiceStatus = (invoice) => {
  if (!invoice) {
    return "PENDING";
  }

  const total = getInvoiceTotalAmount(invoice);
  const paid = getInvoicePaidAmount(invoice);

  const rawStatus = normalize(
    invoice?.paymentStatus ||
    invoice?.paymentState ||
    invoice?.payment?.status ||
    invoice?.paymentDetails?.status ||
    invoice?.razorpayPayment?.status ||
    ""
  );

  // ---------------------------------------------
  // REFUNDED
  // ---------------------------------------------
  if (rawStatus === "REFUNDED") {
    return "REFUNDED";
  }

  // ---------------------------------------------
  // FAILED
  // ---------------------------------------------
  if (rawStatus === "FAILED") {
    return "FAILED";
  }

  // ---------------------------------------------
  // CANCELLED
  // ---------------------------------------------
  if (rawStatus === "CANCELLED") {
    return "CANCELLED";
  }

  // ---------------------------------------------
  // FULL PAYMENT
  // ---------------------------------------------
  if (
    total > 0 &&
    paid >= total
  ) {
    return "PAID";
  }

  // ---------------------------------------------
  // PARTIAL PAYMENT
  // ---------------------------------------------
  if (
    paid > 0 &&
    paid < total
  ) {
    return "PARTIAL";
  }

  // ---------------------------------------------
  // EXPLICIT SUCCESS
  // ---------------------------------------------
  if (
    rawStatus === "PAID" ||
    rawStatus === "SUCCESS" ||
    rawStatus === "COMPLETED"
  ) {
    return "PAID";
  }

  return "PENDING";
};

  // =======================================================
  // CUSTOMER NAME
  // =======================================================

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


  // =======================================================
  // CUSTOMER PHONE
  // =======================================================

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


  // =======================================================
  // SOURCE ICON
  // =======================================================

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


  // =======================================================
  // SOURCE CLASS
  // =======================================================

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


  // =======================================================
  // STATUS CLASS
  // =======================================================

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


  // =======================================================
  // REFERENCE
  // =======================================================

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


  // =======================================================
  // FILTER
  // =======================================================

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
            invoice?.repairNumber,
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


  // =======================================================
  // SUMMARY
  // =======================================================

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
                status === "PENDING" ||
                status === "UNPAID" ||
                status === "PARTIAL"
              );
            }
          ).length,
      };

    }, [invoices]);


  // =======================================================
  // OPEN INVOICE
  // =======================================================

  const openInvoice = async (
    invoice
  ) => {

    try {

      setDetailLoading(true);

      // ===================================================
      // GENERATED RENTAL
      // ===================================================

      if (
        invoice?.__isRentalInvoice ===
        true
      ) {

        setSelectedInvoice(
          invoice
        );

        return;
      }


      // ===================================================
      // GENERATED REPAIR
      // ===================================================

      if (
        invoice?.__isRepairInvoice ===
        true
      ) {

        setSelectedInvoice(
          invoice
        );

        return;
      }


      // ===================================================
      // REAL INVOICE
      // ===================================================

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


  // =======================================================
  // TOTAL HELPERS FOR MODAL
  // =======================================================

  const getSubtotal = (
    invoice
  ) => {

    if (
      invoice?.subtotal !==
      undefined
    ) {
      return numberValue(
        invoice.subtotal
      );
    }

    return 0;
  };


  const getOfferDiscount = (
    invoice
  ) => {

    return numberValue(
      invoice?.offerDiscount ??
      invoice?.discount ??
      invoice?.discountAmount
    );
  };


  const getCouponDiscount = (
    invoice
  ) => {

    return numberValue(
      invoice?.couponDiscount
    );
  };


  const getTaxableAmount = (
    invoice
  ) => {

    if (
      invoice?.taxableAmount !==
      undefined
    ) {

      return numberValue(
        invoice.taxableAmount
      );
    }

    return Math.max(
      getSubtotal(invoice) -
        getOfferDiscount(invoice) -
        getCouponDiscount(invoice),
      0
    );
  };


  const getGstPercentage = (
    invoice
  ) => {

    return numberValue(
      invoice?.gstPercentage ??
      invoice?.gstPercent ??
      0
    );
  };


  const getGstAmount = (
    invoice
  ) => {

    if (
      invoice?.gstAmount !==
      undefined
    ) {

      return numberValue(
        invoice.gstAmount
      );
    }

    return numberValue(
      invoice?.tax ??
      invoice?.taxAmount
    );
  };


  const getShippingCharge = (
    invoice
  ) => {

    return numberValue(
      invoice?.shippingCharge
    );
  };


  const getOtherCharges = (
    invoice
  ) => {

    return numberValue(
      invoice?.otherCharges
    );
  };


  const getFinalAmount = (
    invoice
  ) => {

    return numberValue(
      invoice?.finalAmount ??
      invoice?.totalAmount
    );
  };


  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-gray-800 text-white flex items-center justify-center">

              <Receipt size={22} />

            </div>

            <div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Invoice Management
              </h1>

              <p className="text-gray-500 mt-1">
                Manage online, walk-in, rental,
                repair and order invoices.
              </p>

            </div>

          </div>

        </div>


        <button
          onClick={loadInvoices}
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


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-8 gap-4 mb-6">

        <Card
          title="Total"
          value={summary.total}
          icon={<FileText size={21} />}
        />

        <Card
          title="Online"
          value={summary.online}
          icon={
            <Globe
              size={21}
              className="text-green-600"
            />
          }
        />

        <Card
          title="Walk-In Sale"
          value={summary.walkIn}
          icon={
            <Store
              size={21}
              className="text-blue-600"
            />
          }
        />

        <Card
          title="Walk-In Order"
          value={summary.walkInOrder}
          icon={
            <ShoppingBag
              size={21}
              className="text-cyan-600"
            />
          }
        />

        <Card
          title="Rental"
          value={summary.rental}
          icon={
            <Laptop
              size={21}
              className="text-purple-600"
            />
          }
        />

        <Card
          title="Walk-In Rental"
          value={summary.walkInRental}
          icon={
            <Package
              size={21}
              className="text-indigo-600"
            />
          }
        />

        <Card
          title="Repair"
          value={summary.repair}
          icon={
            <Wrench
              size={21}
              className="text-orange-600"
            />
          }
        />

        <Card
          title="Unpaid"
          value={summary.unpaid}
          icon={<IndianRupee size={21} />}
        />

      </div>


      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="bg-white border shadow-sm rounded-xl p-4 mb-5">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

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


          <select
            value={typeFilter}
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


          <select
            value={statusFilter}
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


        <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">

          <ClipboardList size={15} />

          Showing{" "}

          <strong className="text-gray-800">
            {filteredInvoices.length}
          </strong>

          {" "}of{" "}

          <strong className="text-gray-800">
            {invoices.length}
          </strong>

          {" "}invoices

        </div>

      </div>


      {/* =================================================
          TABLE
      ================================================= */}

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

              ) : filteredInvoices.length === 0 ? (

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


                        <td className="px-4 py-4 font-semibold text-gray-800">
  {money(
    getInvoiceTotalAmount(invoice)
  )}
</td>

<td className="px-4 py-4 font-medium text-green-700">
  {money(
    getInvoicePaidAmount(invoice)
  )}
</td>

<td className="px-4 py-4 font-medium text-red-600">
  {money(
    getInvoiceBalanceAmount(invoice)
  )}
</td>

{/* 
                        <td className="px-4 py-4 font-semibold text-gray-800">
                          {
                            money(
                              invoice?.finalAmount ??
                              invoice?.totalAmount
                            )
                          }
                        </td>


                        <td className="px-4 py-4 font-medium text-green-700">
                          {
                            money(
                              invoice?.paidAmount
                            )
                          }
                        </td>


                        <td className="px-4 py-4 font-medium text-red-600">
                          {
                            money(
                              invoice?.balanceAmount
                            )
                          }
                        </td> */}


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


                        <td className="px-4 py-4 text-right">

                          <button
                            onClick={() =>
                              openInvoice(
                                invoice
                              )
                            }
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
                          >

                            <Eye size={16} />

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


      {/* =================================================
          DETAIL MODAL
      ================================================= */}

      {selectedInvoice && (

        <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[94vh] overflow-y-auto shadow-2xl">

            {/* HEADER */}

            <div className="sticky top-0 z-10 bg-white flex justify-between items-center p-5 border-b">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">

                  <Receipt size={20} />

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


              <button
                onClick={() =>
                  setSelectedInvoice(
                    null
                  )
                }
                className="p-2 rounded-lg hover:bg-gray-100"
              >

                <X size={21} />

              </button>

            </div>


            {/* CONTENT */}

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

                {/* SOURCE */}

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


                {/* BASIC */}

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

                  {/* <Info
                    label="Payment Status"
                    value={
                      selectedInvoice.paymentStatus ||
                      selectedInvoice.status
                    }
                  /> */}


<Info
  label="Payment Status"
  value={
    getInvoiceStatus(
      selectedInvoice
    )
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


                {/* TRANSACTION */}

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
                      label="Repair Number"
                      value={
                        selectedInvoice.repairNumber
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
                      label="Rental Number"
                      value={
                        selectedInvoice.rentalNumber
                      }
                    />

                    <Info
                      label="Rental Duration"
                      value={
                        selectedInvoice.rentalDuration
                          ? `${selectedInvoice.rentalDuration} ${
                              normalize(
                                selectedInvoice.rentalDurationType ||
                                "MONTHS"
                              ) === "DAYS"
                                ? "days"
                                : "months"
                            }`
                          : undefined
                      }
                    />

                    <Info
                      label="Monthly Rent"
                      value={
                        selectedInvoice.monthlyRent !==
                        undefined
                          ? money(
                              selectedInvoice.monthlyRent
                            )
                          : undefined
                      }
                    />

                    <Info
                      label="Security Deposit"
                      value={
                        selectedInvoice.securityDeposit !==
                        undefined
                          ? money(
                              selectedInvoice.securityDeposit
                            )
                          : undefined
                      }
                    />

                    <Info
                      label="GST %"
                      value={
                        selectedInvoice.gstPercentage !==
                        undefined
                          ? `${selectedInvoice.gstPercentage}%`
                          : undefined
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


                {/* ADDRESS */}

                {(selectedInvoice?.billingAddress ||
                  selectedInvoice?.shippingAddress) && (

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


                {/* =================================================
                    COMPLETE TOTAL BREAKDOWN
                ================================================= */}

                <SectionTitle>
                  Amount Breakdown
                </SectionTitle>

                <div className="flex justify-end">

                  <div className="w-full max-w-md border rounded-xl p-5 bg-gray-50 space-y-3">

                    <TotalRow
                      label="Subtotal"
                      value={money(
                        getSubtotal(
                          selectedInvoice
                        )
                      )}
                    />


                    <TotalRow
                      label="Offer / Product Discount"
                      value={money(
                        getOfferDiscount(
                          selectedInvoice
                        )
                      )}
                    />


                    <TotalRow
                      label="Coupon Discount"
                      value={money(
                        getCouponDiscount(
                          selectedInvoice
                        )
                      )}
                    />


                    <div className="border-t pt-3">

                      <TotalRow
                        label="Taxable Amount"
                        value={money(
                          getTaxableAmount(
                            selectedInvoice
                          )
                        )}
                        bold
                      />

                    </div>


                    <TotalRow
                      label={`GST (${getGstPercentage(
                        selectedInvoice
                      )}%)`}
                      value={money(
                        getGstAmount(
                          selectedInvoice
                        )
                      )}
                    />


                    <TotalRow
                      label="Shipping Charge"
                      value={money(
                        getShippingCharge(
                          selectedInvoice
                        )
                      )}
                    />


                    <TotalRow
                      label="Other Charges"
                      value={money(
                        getOtherCharges(
                          selectedInvoice
                        )
                      )}
                    />


                    {/* <div className="border-t pt-3">

                      <TotalRow
                        label="Final / Total Amount"
                        value={money(
                          getFinalAmount(
                            selectedInvoice
                          )
                        )}
                        bold
                      />

                    </div> */}

                    <div className="border-t pt-3">

  {/* =========================================
      FINAL / TOTAL AMOUNT
  ========================================= */}
  <TotalRow
    label="Final / Total Amount"
    value={money(
      getInvoiceTotalAmount(selectedInvoice)
    )}
    bold
  />

  {/* =========================================
      PAID AMOUNT
  ========================================= */}
  <TotalRow
    label="Paid Amount"
    value={money(
      getInvoicePaidAmount(selectedInvoice)
    )}
  />

  {/* =========================================
      BALANCE AMOUNT
  ========================================= */}
  <TotalRow
    label="Balance Amount"
    value={money(
      getInvoiceBalanceAmount(selectedInvoice)
    )}
    danger={
      getInvoiceBalanceAmount(selectedInvoice) > 0
    }
    bold
  />

  {/* =========================================
      RENTAL DEPOSIT
  ========================================= */}
  {getInvoiceSource(selectedInvoice).type.includes(
    "RENTAL"
  ) &&
    selectedInvoice?.securityDeposit !== undefined && (
      <div className="border-t pt-3 mt-3 text-sm">

        {/* Security Deposit */}
        <TotalRow
          label="Security Deposit"
          value={money(
            selectedInvoice?.securityDeposit
          )}
        />

        {/* Deposit Paid */}
        <TotalRow
          label="Deposit Paid"
          value={money(
            selectedInvoice?.depositAmountPaid
          )}
        />

      </div>
    )}

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


                    {/* RENTAL DEPOSIT */}

                    {getInvoiceSource(
                      selectedInvoice
                    ).type.includes(
                      "RENTAL"
                    ) &&
                      selectedInvoice.securityDeposit !==
                        undefined && (

                        <div className="border-t pt-3 mt-3 text-sm">

                          <TotalRow
                            label="Security Deposit"
                            value={money(
                              selectedInvoice.securityDeposit
                            )}
                          />

                          <TotalRow
                            label="Deposit Paid"
                            value={money(
                              selectedInvoice.depositAmountPaid
                            )}
                          />

                        </div>

                    )}

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
            Phone: {address.phone}
          </div>
        )}

        {address.email && (
          <div>
            Email: {address.email}
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