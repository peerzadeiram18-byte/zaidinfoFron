// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   CalendarDays,
//   CheckCircle2,
//   Clock3,
//   FileText,
//   Loader2,
//   Package,
//   Phone,
//   Mail,
//   MapPin,
//   User,
//   Building2,
//   IndianRupee,
//   RefreshCw,
//   ShieldCheck,
//   AlertCircle,
// } from "lucide-react";

// import {
//   getRentalById,
//   markDepositReceived,
//   allocateRental,
//   markRentalReturned,
// } from "../../services/rentalApi";

// import "./WalkInRentalDetails.css";


// // ============================================================
// // HELPERS
// // ============================================================

// const getId = (value) => {
//   if (!value) return "";

//   if (typeof value === "string") return value;

//   return (
//     value?._id ||
//     value?.id ||
//     value?.$oid ||
//     ""
//   );
// };

// const getName = (value) => {
//   if (!value) return "";

//   if (typeof value === "string") return value;

//   return (
//     value?.name ||
//     value?.title ||
//     value?.productName ||
//     value?.label ||
//     ""
//   );
// };

// const getNumber = (...values) => {
//   for (const value of values) {
//     if (
//       value !== undefined &&
//       value !== null &&
//       value !== "" &&
//       !Number.isNaN(Number(value))
//     ) {
//       return Number(value);
//     }
//   }

//   return 0;
// };

// const formatMoney = (value) => {
//   const number = Number(value || 0);

//   return `₹${number.toLocaleString("en-IN")}`;
// };

// const formatDate = (value) => {
//   if (!value) return "—";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return "—";
//   }

//   return date.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const formatDateTime = (value) => {
//   if (!value) return "—";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return "—";
//   }

//   return date.toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// const getStatusClass = (status) => {
//   const value = String(status || "").toUpperCase();

//   if (
//     value === "ACTIVE" ||
//     value === "ALLOCATED" ||
//     value === "APPROVED" ||
//     value === "COMPLETED"
//   ) {
//     return "success";
//   }

//   if (
//     value === "PENDING" ||
//     value === "REQUESTED"
//   ) {
//     return "warning";
//   }

//   if (
//     value === "REJECTED" ||
//     value === "CANCELLED"
//   ) {
//     return "danger";
//   }

//   if (
//     value === "RETURNED" ||
//     value === "CLOSED"
//   ) {
//     return "info";
//   }

//   return "neutral";
// };

// const extractRental = (response) => {
//   if (!response) return null;

//   // axios response
//   const data = response?.data;

//   if (data?.rental) {
//     return data.rental;
//   }

//   if (data?.data?.rental) {
//     return data.data.rental;
//   }

//   if (data?.data) {
//     return data.data;
//   }

//   if (response?.rental) {
//     return response.rental;
//   }

//   return data || response;
// };


// // ============================================================
// // COMPONENT
// // ============================================================

// function WalkInRentalDetails() {
//   const navigate = useNavigate();
//   const { rentalId } = useParams();

//   const [rental, setRental] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);

//   const [error, setError] = useState("");
//   const [actionError, setActionError] = useState("");
//   const [actionSuccess, setActionSuccess] = useState("");

//   // ==========================================================
//   // LOAD RENTAL
//   // ==========================================================

//   const loadRental = useCallback(async () => {
//     if (!rentalId) {
//       setError("Rental ID is missing.");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       console.log(
//         "========== WALK-IN RENTAL DETAILS =========="
//       );

//       console.log("Rental ID:", rentalId);

//       const response = await getRentalById(rentalId);

//       console.log("Rental Details Response:", response);

//       const rentalData = extractRental(response);

//       console.log("Normalized Rental:", rentalData);

//       if (!rentalData) {
//         throw new Error("Rental details not found.");
//       }

//       setRental(rentalData);
//     } catch (err) {
//       console.error(
//         "GET WALK-IN RENTAL DETAILS ERROR:",
//         err
//       );

//       setError(
//         err?.message ||
//           err?.response?.data?.message ||
//           "Failed to load rental details."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [rentalId]);

//   useEffect(() => {
//     loadRental();
//   }, [loadRental]);

//   // ==========================================================
//   // NORMALIZED DATA
//   // ==========================================================

//   const details = useMemo(() => {
//     if (!rental) return null;

//     const individual =
//       rental?.individualDetails || {};

//     const company =
//       rental?.companyDetails || {};

//     const customerType =
//       String(
//         rental?.customerType || "INDIVIDUAL"
//       ).toUpperCase();

//     const customer =
//       customerType === "COMPANY"
//         ? {
//             name:
//               company?.companyName ||
//               company?.contactPerson ||
//               "Company Customer",

//             contactPerson:
//               company?.contactPerson || "",

//             phone:
//               company?.phone ||
//               "",

//             email:
//               company?.email ||
//               "",

//             address:
//               company?.officeAddress ||
//               "",

//             gstNumber:
//               company?.gstNumber ||
//               "",
//           }
//         : {
//             name:
//               individual?.fullName ||
//               rental?.customer?.name ||
//               rental?.customerId?.name ||
//               "Individual Customer",

//             contactPerson: "",

//             phone:
//               individual?.phone ||
//               rental?.customer?.phone ||
//               "",

//             email:
//               individual?.email ||
//               rental?.customer?.email ||
//               "",

//             address:
//               individual?.address ||
//               "",

//             gstNumber: "",
//           };

//     const product =
//       rental?.productId || {};

//     const rentalProduct =
//       rental?.rentalProductId || {};

//     const monthlyRent = getNumber(
//       rental?.monthlyRent,
//       rental?.pricing?.monthlyRent,
//       rentalProduct?.monthlyRent,
//       rentalProduct?.pricing?.monthlyRent
//     );

//     const securityDeposit = getNumber(
//       rental?.securityDeposit,
//       rental?.pricing?.securityDeposit,
//       rentalProduct?.securityDeposit,
//       rentalProduct?.pricing?.securityDeposit
//     );

//     const gstPercentage = getNumber(
//       rental?.gstPercentage,
//       rental?.pricing?.gstPercentage,
//       rentalProduct?.gstPercentage,
//       rentalProduct?.pricing?.gstPercentage
//     );

//     const rentalMonths = getNumber(
//       rental?.rentalMonths,
//       rental?.durationMonths,
//       rental?.months,
//       1
//     );

//     const rentSubtotal =
//       monthlyRent * rentalMonths;

//     const gstAmount =
//       rentSubtotal * (gstPercentage / 100);

//     const totalRent =
//       rentSubtotal + gstAmount;

//     const image =
//       product?.primaryImage ||
//       product?.image ||
//       product?.thumbnail ||
//       product?.images?.[0] ||
//       rentalProduct?.image ||
//       rentalProduct?.images?.[0] ||
//       "";

//     return {
//       customerType,
//       customer,

//       product,
//       rentalProduct,

//       productName:
//         getName(product) ||
//         getName(rentalProduct) ||
//         "Rental Product",

//       productBrand:
//         product?.brand?.name ||
//         product?.brand ||
//         "",

//       productModel:
//         product?.model ||
//         product?.modelNumber ||
//         "",

//       image,

//       monthlyRent,
//       securityDeposit,
//       gstPercentage,
//       gstAmount,

//       rentalMonths,

//       rentSubtotal,
//       totalRent,

//       startDate:
//         rental?.startDate,

//       expectedEndDate:
//         rental?.expectedEndDate,

//       nextPaymentDate:
//         rental?.nextPaymentDate,

//       lastPaymentDate:
//         rental?.lastPaymentDate,

//       status:
//         rental?.status || "—",

//       rentalSource:
//         rental?.rentalSource || "WALK_IN",

//       depositReceived:
//         Boolean(
//           rental?.depositReceived ||
//           rental?.isDepositReceived
//         ),

//       allocatedAt:
//         rental?.allocatedAt,

//       returnedAt:
//         rental?.returnedAt,

//       notes:
//         rental?.notes ||
//         rental?.handoverDescription ||
//         rental?.handoverNotes ||
//         "",

//       createdAt:
//         rental?.createdAt,

//       updatedAt:
//         rental?.updatedAt,
//     };
//   }, [rental]);

//   // ==========================================================
//   // ACTION HANDLER
//   // ==========================================================

//   const runAction = async (action, successMessage) => {
//     if (!rentalId) return;

//     try {
//       setActionLoading(true);
//       setActionError("");
//       setActionSuccess("");

//       console.log(
//         "Rental Action:",
//         action,
//         rentalId
//       );

//       let response;

//       if (action === "deposit") {
//         response =
//           await markDepositReceived(rentalId);
//       }

//       if (action === "allocate") {
//         response =
//           await allocateRental(rentalId);
//       }

//       if (action === "return") {
//         response =
//           await markRentalReturned(rentalId);
//       }

//       console.log(
//         "Rental Action Response:",
//         response
//       );

//       setActionSuccess(
//         successMessage ||
//           "Rental updated successfully."
//       );

//       await loadRental();
//     } catch (err) {
//       console.error(
//         "RENTAL ACTION ERROR:",
//         err
//       );

//       setActionError(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Unable to update rental."
//       );
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ==========================================================
//   // BUTTON ACTIONS
//   // ==========================================================

//   const handleDeposit = () => {
//     if (
//       !window.confirm(
//         "Mark security deposit as received?"
//       )
//     ) {
//       return;
//     }

//     runAction(
//       "deposit",
//       "Security deposit marked as received."
//     );
//   };

//   const handleAllocate = () => {
//     if (
//       !window.confirm(
//         "Allocate this rental?"
//       )
//     ) {
//       return;
//     }

//     runAction(
//       "allocate",
//       "Rental allocated successfully."
//     );
//   };

//   const handleReturn = () => {
//     if (
//       !window.confirm(
//         "Mark this rental as returned?"
//       )
//     ) {
//       return;
//     }

//     runAction(
//       "return",
//       "Rental marked as returned."
//     );
//   };

//   // ==========================================================
//   // LOADING
//   // ==========================================================

//   if (loading) {
//     return (
//       <div className="wir-details-page">
//         <div className="wir-details-loading">
//           <Loader2
//             size={40}
//             className="wir-spin"
//           />

//           <h3>
//             Loading rental details...
//           </h3>

//           <p>
//             Please wait while we fetch the
//             rental information.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ==========================================================
//   // ERROR
//   // ==========================================================

//   if (error || !rental || !details) {
//     return (
//       <div className="wir-details-page">
//         <div className="wir-details-error">
//           <div className="wir-error-icon">
//             <AlertCircle size={34} />
//           </div>

//           <h2>
//             Unable to load rental
//           </h2>

//           <p>
//             {error ||
//               "Rental details were not found."}
//           </p>

//           <div className="wir-error-actions">
//             <button
//               className="wir-btn wir-btn-secondary"
//               onClick={() => navigate(-1)}
//             >
//               <ArrowLeft size={18} />
//               Back
//             </button>

//             <button
//               className="wir-btn wir-btn-primary"
//               onClick={loadRental}
//             >
//               <RefreshCw size={18} />
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ==========================================================
//   // RENDER
//   // ==========================================================

//   return (
//     <div className="wir-details-page">

//       {/* ======================================================
//           HEADER
//       ====================================================== */}

//       <div className="wir-details-header">

//         <div className="wir-header-left">

//           <button
//             className="wir-back-btn"
//             onClick={() => navigate(-1)}
//             title="Go Back"
//           >
//             <ArrowLeft size={20} />
//           </button>

//           <div>
//             <div className="wir-breadcrumb">
//               Receptionist
//               <span>/</span>
//               Rental
//               <span>/</span>
//               Rental Details
//             </div>

//             <h1>
//               Walk-In Rental Details
//             </h1>

//             <p>
//               Rental ID:{" "}
//               <strong>
//                 {getId(rental)}
//               </strong>
//             </p>
//           </div>

//         </div>

//         <div className="wir-header-actions">

//           <button
//             className="wir-btn wir-btn-secondary"
//             onClick={loadRental}
//             disabled={actionLoading}
//           >
//             <RefreshCw size={17} />
//             Refresh
//           </button>

//           <button
//             className="wir-btn wir-btn-secondary"
//             onClick={() =>
//               navigate(
//                 "/receptionist/rental/walkin-orders"
//               )
//             }
//           >
//             <FileText size={17} />
//             All Rentals
//           </button>

//         </div>
//       </div>


//       {/* ======================================================
//           ALERTS
//       ====================================================== */}

//       {actionSuccess && (
//         <div className="wir-alert wir-alert-success">
//           <CheckCircle2 size={20} />
//           <span>{actionSuccess}</span>
//         </div>
//       )}

//       {actionError && (
//         <div className="wir-alert wir-alert-danger">
//           <AlertCircle size={20} />
//           <span>{actionError}</span>
//         </div>
//       )}


//       {/* ======================================================
//           STATUS BAR
//       ====================================================== */}

//       <div className="wir-status-card">

//         <div className="wir-status-main">

//           <div className="wir-status-icon">
//             <Package size={24} />
//           </div>

//           <div>
//             <span className="wir-label">
//               Rental Status
//             </span>

//             <div className="wir-status-row">

//               <span
//                 className={`wir-status-badge ${getStatusClass(
//                   details.status
//                 )}`}
//               >
//                 {String(
//                   details.status || "UNKNOWN"
//                 ).replaceAll("_", " ")}
//               </span>

//               <span className="wir-source-badge">
//                 WALK-IN
//               </span>

//             </div>
//           </div>

//         </div>

//         <div className="wir-status-meta">

//           <div>
//             <span className="wir-label">
//               Created
//             </span>

//             <strong>
//               {formatDateTime(
//                 details.createdAt
//               )}
//             </strong>
//           </div>

//           <div>
//             <span className="wir-label">
//               Rental Period
//             </span>

//             <strong>
//               {details.rentalMonths} month
//               {details.rentalMonths !== 1
//                 ? "s"
//                 : ""}
//             </strong>
//           </div>

//           <div>
//             <span className="wir-label">
//               Security Deposit
//             </span>

//             <strong>
//               {details.depositReceived
//                 ? "Received"
//                 : "Pending"}
//             </strong>
//           </div>

//         </div>

//       </div>


//       {/* ======================================================
//           ACTION BUTTONS
//       ====================================================== */}

//       <div className="wir-action-card">

//         <div>
//           <h3>
//             Rental Actions
//           </h3>

//           <p>
//             Manage deposit, allocation and
//             return status from here.
//           </p>
//         </div>

//         <div className="wir-action-buttons">

//           {/* {!details.depositReceived && (
//             // <button
//             //   className="wir-btn wir-btn-warning"
//             //   onClick={handleDeposit}
//             //   disabled={actionLoading}
//             // >
//             //   {actionLoading ? (
//             //     <Loader2
//             //       size={17}
//             //       className="wir-spin"
//             //     />
//             //   ) : (
//             //     <ShieldCheck size={17} />
//             //   )}

//             //   Mark Deposit Received
//             // </button>
//           )} */}

//           {!details.allocatedAt &&
//             String(details.status).toUpperCase() !==
//               "RETURNED" && (
//               <button
//                 className="wir-btn wir-btn-primary"
//                 onClick={handleAllocate}
//                 disabled={actionLoading}
//               >
//                 {actionLoading ? (
//                   <Loader2
//                     size={17}
//                     className="wir-spin"
//                   />
//                 ) : (
//                   <CheckCircle2 size={17} />
//                 )}

//                 Allocate Rental
//               </button>
//             )}

//           {String(details.status).toUpperCase() ===
//             "ACTIVE" && (
//             <button
//               className="wir-btn wir-btn-danger"
//               onClick={handleReturn}
//               disabled={actionLoading}
//             >
//               {actionLoading ? (
//                 <Loader2
//                   size={17}
//                   className="wir-spin"
//                 />
//               ) : (
//                 <RefreshCw size={17} />
//               )}

//               Mark Returned
//             </button>
//           )}

//         </div>

//       </div>


//       {/* ======================================================
//           MAIN GRID
//       ====================================================== */}

//       <div className="wir-details-grid">

//         {/* ====================================================
//             CUSTOMER
//         ==================================================== */}

//         <section className="wir-card">

//           <div className="wir-card-header">

//             <div className="wir-card-title-icon">
//               {details.customerType ===
//               "COMPANY" ? (
//                 <Building2 size={20} />
//               ) : (
//                 <User size={20} />
//               )}
//             </div>

//             <div>
//               <h2>
//                 Customer Information
//               </h2>

//               <p>
//                 {details.customerType ===
//                 "COMPANY"
//                   ? "Company customer"
//                   : "Individual customer"}
//               </p>
//             </div>

//           </div>

//           <div className="wir-info-list">

//             <div className="wir-info-item">

//               <span className="wir-info-icon">
//                 {details.customerType ===
//                 "COMPANY" ? (
//                   <Building2 size={18} />
//                 ) : (
//                   <User size={18} />
//                 )}
//               </span>

//               <div>
//                 <span>
//                   {details.customerType ===
//                   "COMPANY"
//                     ? "Company Name"
//                     : "Full Name"}
//                 </span>

//                 <strong>
//                   {details.customer.name ||
//                     "—"}
//                 </strong>
//               </div>

//             </div>


//             {details.customer.contactPerson && (
//               <div className="wir-info-item">

//                 <span className="wir-info-icon">
//                   <User size={18} />
//                 </span>

//                 <div>
//                   <span>
//                     Contact Person
//                   </span>

//                   <strong>
//                     {
//                       details.customer
//                         .contactPerson
//                     }
//                   </strong>
//                 </div>

//               </div>
//             )}


//             <div className="wir-info-item">

//               <span className="wir-info-icon">
//                 <Phone size={18} />
//               </span>

//               <div>
//                 <span>
//                   Phone
//                 </span>

//                 <strong>
//                   {details.customer.phone ||
//                     "—"}
//                 </strong>
//               </div>

//             </div>


//             <div className="wir-info-item">

//               <span className="wir-info-icon">
//                 <Mail size={18} />
//               </span>

//               <div>
//                 <span>
//                   Email
//                 </span>

//                 <strong>
//                   {details.customer.email ||
//                     "—"}
//                 </strong>
//               </div>

//             </div>


//             <div className="wir-info-item">

//               <span className="wir-info-icon">
//                 <MapPin size={18} />
//               </span>

//               <div>
//                 <span>
//                   Address
//                 </span>

//                 <strong>
//                   {details.customer.address ||
//                     "—"}
//                 </strong>
//               </div>

//             </div>


//             {details.customer.gstNumber && (
//               <div className="wir-info-item">

//                 <span className="wir-info-icon">
//                   <FileText size={18} />
//                 </span>

//                 <div>
//                   <span>
//                     GST Number
//                   </span>

//                   <strong>
//                     {
//                       details.customer
//                         .gstNumber
//                     }
//                   </strong>
//                 </div>

//               </div>
//             )}

//           </div>

//         </section>


//         {/* ====================================================
//             PRODUCT
//         ==================================================== */}

//         <section className="wir-card">

//           <div className="wir-card-header">

//             <div className="wir-card-title-icon">
//               <Package size={20} />
//             </div>

//             <div>
//               <h2>
//                 Product Information
//               </h2>

//               <p>
//                 Rented product details
//               </p>
//             </div>

//           </div>

//           <div className="wir-product">

//             {details.image ? (
//               <img
//                 src={details.image}
//                 alt={details.productName}
//                 className="wir-product-image"
//                 onError={(event) => {
//                   event.currentTarget.style.display =
//                     "none";
//                 }}
//               />
//             ) : (
//               <div className="wir-product-placeholder">
//                 <Package size={38} />
//               </div>
//             )}

//             <div className="wir-product-info">

//               <h3>
//                 {details.productName}
//               </h3>

//               {details.productBrand && (
//                 <p>
//                   Brand:{" "}
//                   <strong>
//                     {details.productBrand}
//                   </strong>
//                 </p>
//               )}

//               {details.productModel && (
//                 <p>
//                   Model:{" "}
//                   <strong>
//                     {details.productModel}
//                   </strong>
//                 </p>
//               )}

//               {getId(details.rentalProduct) && (
//                 <p className="wir-small-id">
//                   Rental Product ID:{" "}
//                   {getId(
//                     details.rentalProduct
//                   )}
//                 </p>
//               )}

//               {getId(details.product) && (
//                 <p className="wir-small-id">
//                   Product ID:{" "}
//                   {getId(details.product)}
//                 </p>
//               )}

//             </div>

//           </div>

//         </section>


//         {/* ====================================================
//             RENTAL PERIOD
//         ==================================================== */}

//         <section className="wir-card">

//           <div className="wir-card-header">

//             <div className="wir-card-title-icon">
//               <CalendarDays size={20} />
//             </div>

//             <div>
//               <h2>
//                 Rental Period
//               </h2>

//               <p>
//                 Start and expected return
//               </p>
//             </div>

//           </div>

//           <div className="wir-date-grid">

//             <div className="wir-date-box">

//               <span>
//                 <CalendarDays size={17} />
//                 Start Date
//               </span>

//               <strong>
//                 {formatDate(
//                   details.startDate
//                 )}
//               </strong>

//             </div>


//             <div className="wir-date-box">

//               <span>
//                 <Clock3 size={17} />
//                 Expected End Date
//               </span>

//               <strong>
//                 {formatDate(
//                   details.expectedEndDate
//                 )}
//               </strong>

//             </div>


//             <div className="wir-date-box">

//               <span>
//                 <IndianRupee size={17} />
//                 Next Payment
//               </span>

//               <strong>
//                 {formatDate(
//                   details.nextPaymentDate
//                 )}
//               </strong>

//             </div>


//             <div className="wir-date-box">

//               <span>
//                 <RefreshCw size={17} />
//                 Returned At
//               </span>

//               <strong>
//                 {formatDateTime(
//                   details.returnedAt
//                 )}
//               </strong>

//             </div>

//           </div>

//         </section>


//         {/* ====================================================
//             PRICING
//         ==================================================== */}

//         <section className="wir-card">

//           <div className="wir-card-header">

//             <div className="wir-card-title-icon">
//               <IndianRupee size={20} />
//             </div>

//             <div>
//               <h2>
//                 Rental Pricing
//               </h2>

//               <p>
//                 Complete rental calculation
//               </p>
//             </div>

//           </div>

//           <div className="wir-pricing">

//             <div className="wir-price-row">

//               <span>
//                 Monthly Rent
//               </span>

//               <strong>
//                 {formatMoney(
//                   details.monthlyRent
//                 )}
//               </strong>

//             </div>


//             <div className="wir-price-row">

//               <span>
//                 Rental Duration
//               </span>

//               <strong>
//                 {details.rentalMonths} month
//                 {details.rentalMonths !== 1
//                   ? "s"
//                   : ""}
//               </strong>

//             </div>


//             <div className="wir-price-row">

//               <span>
//                 Rent Subtotal
//               </span>

//               <strong>
//                 {formatMoney(
//                   details.rentSubtotal
//                 )}
//               </strong>

//             </div>


//             <div className="wir-price-row">

//               <span>
//                 GST ({details.gstPercentage}%)
//               </span>

//               <strong>
//                 {formatMoney(
//                   details.gstAmount
//                 )}
//               </strong>

//             </div>


//             <div className="wir-price-row">

//               <span>
//                 Security Deposit
//               </span>

//               <strong>
//                 {formatMoney(
//                   details.securityDeposit
//                 )}
//               </strong>

//             </div>


//             <div className="wir-price-total">

//               <span>
//                 Total Rental Amount
//               </span>

//               <strong>
//                 {formatMoney(
//                   details.totalRent
//                 )}
//               </strong>

//             </div>

//           </div>

//         </section>

//       </div>


//       {/* ======================================================
//           NOTES
//       ====================================================== */}

//       {details.notes && (
//         <section className="wir-card wir-notes-card">

//           <div className="wir-card-header">

//             <div className="wir-card-title-icon">
//               <FileText size={20} />
//             </div>

//             <div>
//               <h2>
//                 Handover / Rental Notes
//               </h2>

//               <p>
//                 Notes saved during rental creation
//               </p>
//             </div>

//           </div>

//           <div className="wir-notes">
//             {details.notes}
//           </div>

//         </section>
//       )}


//       {/* ======================================================
//           TIMELINE
//       ====================================================== */}

//       <section className="wir-card">

//         <div className="wir-card-header">

//           <div className="wir-card-title-icon">
//             <Clock3 size={20} />
//           </div>

//           <div>
//             <h2>
//               Rental Timeline
//             </h2>

//             <p>
//               Important rental events
//             </p>
//           </div>

//         </div>

//         <div className="wir-timeline">

//           <div className="wir-timeline-item completed">

//             <div className="wir-timeline-dot">
//               <CheckCircle2 size={16} />
//             </div>

//             <div>
//               <strong>
//                 Rental Created
//               </strong>

//               <span>
//                 {formatDateTime(
//                   details.createdAt
//                 )}
//               </span>
//             </div>

//           </div>


//           <div
//             className={`wir-timeline-item ${
//               details.depositReceived
//                 ? "completed"
//                 : ""
//             }`}
//           >

//             <div className="wir-timeline-dot">
//               <ShieldCheck size={16} />
//             </div>

//             <div>
//               <strong>
//                 Security Deposit
//               </strong>

//               <span>
//                 {details.depositReceived
//                   ? "Deposit received"
//                   : "Deposit pending"}
//               </span>
//             </div>

//           </div>


//           <div
//             className={`wir-timeline-item ${
//               details.allocatedAt
//                 ? "completed"
//                 : ""
//             }`}
//           >

//             <div className="wir-timeline-dot">
//               <Package size={16} />
//             </div>

//             <div>
//               <strong>
//                 Rental Allocated
//               </strong>

//               <span>
//                 {details.allocatedAt
//                   ? formatDateTime(
//                       details.allocatedAt
//                     )
//                   : "Not allocated yet"}
//               </span>
//             </div>

//           </div>


//           <div
//             className={`wir-timeline-item ${
//               details.returnedAt
//                 ? "completed"
//                 : ""
//             }`}
//           >

//             <div className="wir-timeline-dot">
//               <RefreshCw size={16} />
//             </div>

//             <div>
//               <strong>
//                 Rental Returned
//               </strong>

//               <span>
//                 {details.returnedAt
//                   ? formatDateTime(
//                       details.returnedAt
//                     )
//                   : "Not returned yet"}
//               </span>
//             </div>

//           </div>

//         </div>

//       </section>


//       {/* ======================================================
//           FOOTER ACTIONS
//       ====================================================== */}

//       <div className="wir-footer-actions">

//         <button
//           className="wir-btn wir-btn-secondary"
//           onClick={() => navigate(-1)}
//         >
//           <ArrowLeft size={18} />
//           Back to Rentals
//         </button>

//         <button
//           className="wir-btn wir-btn-primary"
//           onClick={() =>
//             navigate(
//               "/receptionist/rental/walkin"
//             )
//           }
//         >
//           <Package size={18} />
//           Create New Walk-In Rental
//         </button>

//       </div>

//     </div>
//   );
// }

// export default WalkInRentalDetails;



import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Package,
  Phone,
  Mail,
  MapPin,
  User,
  Building2,
  IndianRupee,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Download,
  Eye,
  FileCheck2,
  XCircle,
} from "lucide-react";

import {
  getRentalById,
  getRentalDocuments,
  markDepositReceived,
  allocateRental,
  markRentalReturned,
} from "../../services/rentalApi";

import "./WalkInRentalDetails.css";

// ============================================================
// HELPERS
// ============================================================

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return (
    value?._id ||
    value?.id ||
    value?.$oid ||
    ""
  );
};

const getName = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return (
    value?.name ||
    value?.title ||
    value?.productName ||
    value?.label ||
    ""
  );
};

const getNumber = (...values) => {
  for (const value of values) {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !Number.isNaN(Number(value))
    ) {
      return Number(value);
    }
  }

  return 0;
};

const formatMoney = (value) => {
  const number = Number(value || 0);

  return `₹${number.toLocaleString("en-IN")}`;
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusClass = (status) => {
  const value = String(status || "").toUpperCase();

  if (
    value === "ACTIVE" ||
    value === "ALLOCATED" ||
    value === "APPROVED" ||
    value === "COMPLETED"
  ) {
    return "success";
  }

  if (
    value === "PENDING" ||
    value === "REQUESTED"
  ) {
    return "warning";
  }

  if (
    value === "REJECTED" ||
    value === "CANCELLED"
  ) {
    return "danger";
  }

  if (
    value === "RETURNED" ||
    value === "CLOSED"
  ) {
    return "info";
  }

  return "neutral";
};

// ============================================================
// EXTRACT RENTAL
// ============================================================

const extractRental = (response) => {
  if (!response) return null;

  const data = response?.data;

  if (data?.rental) {
    return data.rental;
  }

  if (data?.data?.rental) {
    return data.data.rental;
  }

  if (data?.data) {
    return data.data;
  }

  if (response?.rental) {
    return response.rental;
  }

  return data || response;
};

// ============================================================
// EXTRACT DOCUMENTS
// ============================================================

const extractDocuments = (response) => {
  if (!response) {
    return [];
  }

  // Axios response:
  // response.data
  const data = response?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.documents)) {
    return data.documents;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.data?.documents)) {
    return data.data.documents;
  }

  if (Array.isArray(response?.documents)) {
    return response.documents;
  }

  return [];
};

// ============================================================
// SERVER URL
// ============================================================

const getServerUrl = () => {
  const apiUrl =
    import.meta.env.VITE_API_URL || "";

  return apiUrl.replace(/\/api\/?$/, "");
};

// ============================================================
// NORMALIZE IMAGE / FILE URL
// ============================================================

const normalizeFileUrl = (file) => {
  if (!file) {
    return "";
  }

  if (typeof file === "object") {
    file =
      file?.url ||
      file?.fileUrl ||
      file?.imageUrl ||
      file?.path ||
      file?.src ||
      file?.secure_url ||
      "";

    if (!file) {
      return "";
    }
  }

  file = String(file).trim();

  if (!file) {
    return "";
  }

  // Already complete URL
  if (
    file.startsWith("http://") ||
    file.startsWith("https://") ||
    file.startsWith("data:")
  ) {
    return file;
  }

  const serverUrl = getServerUrl();

  // /uploads/rental-documents/file.jpg
  if (file.startsWith("/")) {
    return `${serverUrl}${file}`;
  }

  // uploads/rental-documents/file.jpg
  return `${serverUrl}/${file}`;
};

// ============================================================
// IMAGE HELPERS
// ============================================================

const normalizeImageUrl = (image) => {
  return normalizeFileUrl(image);
};

// ============================================================
// GET ALL PRODUCT IMAGES
// ============================================================

const getProductImages = (
  product = {},
  rentalProduct = {}
) => {
  const images = [];

  const addImage = (value) => {
    if (!value) return;

    // Array
    if (Array.isArray(value)) {
      value.forEach(addImage);
      return;
    }

    // Object
    if (typeof value === "object") {
      const objectImage =
        value?.url ||
        value?.imageUrl ||
        value?.fileUrl ||
        value?.path ||
        value?.src ||
        value?.secure_url ||
        "";

      if (objectImage) {
        addImage(objectImage);
      }

      return;
    }

    const normalized =
      normalizeImageUrl(value);

    if (
      normalized &&
      !images.includes(normalized)
    ) {
      images.push(normalized);
    }
  };

  // ----------------------------------------------------------
  // PRODUCT PRIMARY IMAGE
  // ----------------------------------------------------------

  addImage(product?.primaryImage);
  addImage(product?.image);
  addImage(product?.thumbnail);
  addImage(product?.imageUrl);
  addImage(product?.mainImage);

  // ----------------------------------------------------------
  // PRODUCT IMAGES ARRAY
  // ----------------------------------------------------------

  addImage(product?.images);
  addImage(product?.productImages);
  addImage(product?.gallery);

  // ----------------------------------------------------------
  // RENTAL PRODUCT IMAGES
  // ----------------------------------------------------------

  addImage(rentalProduct?.primaryImage);
  addImage(rentalProduct?.image);
  addImage(rentalProduct?.thumbnail);
  addImage(rentalProduct?.imageUrl);
  addImage(rentalProduct?.mainImage);
  addImage(rentalProduct?.images);
  addImage(rentalProduct?.productImages);
  addImage(rentalProduct?.gallery);

  return images;
};

// ============================================================
// DOCUMENT LABEL
// ============================================================

const getDocumentLabel = (documentType) => {
  const labels = {
    PASSPORT_PHOTO:
      "Passport Size Photograph",

    PAN_CARD:
      "PAN Card",

    AADHAAR_CARD:
      "Aadhaar Card",

    HOUSE_RENTAL_AGREEMENT:
      "House Rental Agreement",

    COLLEGE_ID:
      "College ID",

    OFFICE_ID:
      "Office ID",

    GST_REGISTRATION:
      "GST Registration",

    AUTHORIZATION_LETTER:
      "Authorization Letter",
  };

  const value = String(
    documentType || ""
  ).toUpperCase();

  return (
    labels[value] ||
    value
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      ) ||
    "Document"
  );
};

// ============================================================
// DOCUMENT FILE TYPE
// ============================================================

const getFileExtension = (
  fileUrl = "",
  fileName = ""
) => {
  const source =
    fileName || fileUrl || "";

  const cleanSource =
    String(source)
      .split("?")[0]
      .split("#")[0];

  const parts =
    cleanSource.split(".");

  if (parts.length < 2) {
    return "";
  }

  return parts[
    parts.length - 1
  ].toLowerCase();
};

const isPdfDocument = (document) => {
  const extension =
    getFileExtension(
      document?.fileUrl,
      document?.fileName
    );

  const mimeType = String(
    document?.mimeType ||
      document?.mimetype ||
      document?.fileType ||
      ""
  ).toLowerCase();

  return (
    extension === "pdf" ||
    mimeType === "application/pdf"
  );
};

const isImageDocument = (document) => {
  const extension =
    getFileExtension(
      document?.fileUrl,
      document?.fileName
    );

  const mimeType = String(
    document?.mimeType ||
      document?.mimetype ||
      document?.fileType ||
      ""
  ).toLowerCase();

  return (
    mimeType.startsWith("image/") ||
    [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
    ].includes(extension)
  );
};

// ============================================================
// DOCUMENT STATUS CLASS
// ============================================================

const getDocumentStatusClass = (
  status
) => {
  const value = String(
    status || "PENDING"
  ).toUpperCase();

  if (value === "APPROVED") {
    return "approved";
  }

  if (value === "REJECTED") {
    return "rejected";
  }

  return "pending";
};

// ============================================================
// COMPONENT
// ============================================================

function WalkInRentalDetails() {
  const navigate = useNavigate();

  const { rentalId } = useParams();

  // ==========================================================
  // RENTAL STATE
  // ==========================================================

  const [rental, setRental] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [actionError, setActionError] =
    useState("");

  const [actionSuccess, setActionSuccess] =
    useState("");

  // ==========================================================
  // DOCUMENT STATE
  // ==========================================================

  const [documents, setDocuments] =
    useState([]);

  const [documentsLoading, setDocumentsLoading] =
    useState(false);

  const [documentsError, setDocumentsError] =
    useState("");

  const [documentImageErrors, setDocumentImageErrors] =
    useState({});

  // ==========================================================
  // PRODUCT IMAGE STATE
  // ==========================================================

  const [selectedImage, setSelectedImage] =
    useState("");

  const [imageErrors, setImageErrors] =
    useState({});

  // ==========================================================
  // LOAD RENTAL
  // ==========================================================

  const loadRental = useCallback(async () => {
    if (!rentalId) {
      setError("Rental ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log(
        "========== WALK-IN RENTAL DETAILS =========="
      );

      console.log(
        "Rental ID:",
        rentalId
      );

      const response =
        await getRentalById(rentalId);

      console.log(
        "Rental Details Response:",
        response
      );

      const rentalData =
        extractRental(response);

      console.log(
        "Normalized Rental:",
        rentalData
      );

      if (!rentalData) {
        throw new Error(
          "Rental details not found."
        );
      }

      setRental(rentalData);
    } catch (err) {
      console.error(
        "GET WALK-IN RENTAL DETAILS ERROR:",
        err
      );

      setError(
        err?.message ||
          err?.response?.data?.message ||
          "Failed to load rental details."
      );
    } finally {
      setLoading(false);
    }
  }, [rentalId]);

  // ==========================================================
  // LOAD CUSTOMER DOCUMENTS
  // ==========================================================

  const loadDocuments = useCallback(
    async () => {
      if (!rentalId) {
        setDocuments([]);
        return;
      }

      try {
        setDocumentsLoading(true);
        setDocumentsError("");

        console.log(
          "========== RENTAL DOCUMENTS =========="
        );

        console.log(
          "Loading documents for rental:",
          rentalId
        );

        const response =
          await getRentalDocuments(
            rentalId
          );

        console.log(
          "Rental Documents Response:",
          response
        );

        const documentList =
          extractDocuments(response);

        console.log(
          "Normalized Documents:",
          documentList
        );

        setDocuments(
          Array.isArray(documentList)
            ? documentList
            : []
        );
      } catch (err) {
        console.error(
          "GET RENTAL DOCUMENTS ERROR:",
          err
        );

        setDocumentsError(
          err?.message ||
            err?.response?.data?.message ||
            "Failed to load customer documents."
        );

        setDocuments([]);
      } finally {
        setDocumentsLoading(false);
      }
    },
    [rentalId]
  );

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadRental();
  }, [loadRental]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // ==========================================================
  // NORMALIZED DATA
  // ==========================================================

  const details = useMemo(() => {
    if (!rental) return null;

    const individual =
      rental?.individualDetails || {};

    const company =
      rental?.companyDetails || {};

    const customerType =
      String(
        rental?.customerType ||
          "INDIVIDUAL"
      ).toUpperCase();

    const customer =
      customerType === "COMPANY"
        ? {
            name:
              company?.companyName ||
              company?.contactPerson ||
              "Company Customer",

            contactPerson:
              company?.contactPerson ||
              "",

            phone:
              company?.phone ||
              "",

            email:
              company?.email ||
              "",

            address:
              company?.officeAddress ||
              "",

            gstNumber:
              company?.gstNumber ||
              "",
          }
        : {
            name:
              individual?.fullName ||
              rental?.customer?.name ||
              rental?.customerId?.name ||
              "Individual Customer",

            contactPerson: "",

            phone:
              individual?.phone ||
              rental?.customer?.phone ||
              "",

            email:
              individual?.email ||
              rental?.customer?.email ||
              "",

            address:
              individual?.address ||
              "",

            gstNumber: "",
          };

    const product =
      rental?.productId || {};

    const rentalProduct =
      rental?.rentalProductId || {};

    const monthlyRent =
      getNumber(
        rental?.monthlyRent,
        rental?.pricing?.monthlyRent,
        rentalProduct?.monthlyRent,
        rentalProduct?.pricing?.monthlyRent
      );

    const securityDeposit =
      getNumber(
        rental?.securityDeposit,
        rental?.pricing?.securityDeposit,
        rentalProduct?.securityDeposit,
        rentalProduct?.pricing?.securityDeposit
      );

    const gstPercentage =
      getNumber(
        rental?.gstPercentage,
        rental?.pricing?.gstPercentage,
        rentalProduct?.gstPercentage,
        rentalProduct?.pricing?.gstPercentage
      );

    const rentalMonths =
      getNumber(
        rental?.rentalMonths,
        rental?.durationMonths,
        rental?.months,
        1
      );

    const rentSubtotal =
      monthlyRent * rentalMonths;

    const gstAmount =
      rentSubtotal *
      (gstPercentage / 100);

    const totalRent =
      rentSubtotal + gstAmount;

    // ========================================================
    // PRODUCT IMAGE LIST
    // ========================================================

    const images =
      getProductImages(
        product,
        rentalProduct
      );

    return {
      customerType,

      customer,

      product,

      rentalProduct,

      productName:
        getName(product) ||
        getName(rentalProduct) ||
        "Rental Product",

      productBrand:
        product?.brand?.name ||
        product?.brand ||
        rentalProduct?.brand?.name ||
        rentalProduct?.brand ||
        "",

      productModel:
        product?.model ||
        product?.modelNumber ||
        rentalProduct?.model ||
        rentalProduct?.modelNumber ||
        "",

      image:
        images?.[0] || "",

      images,

      monthlyRent,

      securityDeposit,

      gstPercentage,

      gstAmount,

      rentalMonths,

      rentSubtotal,

      totalRent,

      startDate:
        rental?.startDate,

      expectedEndDate:
        rental?.expectedEndDate,

      nextPaymentDate:
        rental?.nextPaymentDate,

      lastPaymentDate:
        rental?.lastPaymentDate,

      status:
        rental?.status || "—",

      rentalSource:
        rental?.rentalSource ||
        "WALK_IN",

      depositReceived:
        Boolean(
          rental?.depositReceived ||
            rental?.isDepositReceived
        ),

      allocatedAt:
        rental?.allocatedAt,

      returnedAt:
        rental?.returnedAt,

      notes:
        rental?.notes ||
        rental?.handoverDescription ||
        rental?.handoverNotes ||
        "",

      createdAt:
        rental?.createdAt,

      updatedAt:
        rental?.updatedAt,
    };
  }, [rental]);

  // ==========================================================
  // SET FIRST PRODUCT IMAGE
  // ==========================================================

  useEffect(() => {
    if (
      details?.images?.length &&
      !selectedImage
    ) {
      setSelectedImage(
        details.images[0]
      );
    }
  }, [
    details?.images,
    selectedImage,
  ]);

  // ==========================================================
  // RESET PRODUCT IMAGE WHEN RENTAL CHANGES
  // ==========================================================

  useEffect(() => {
    if (!details?.images?.length) {
      setSelectedImage("");
      return;
    }

    if (
      selectedImage &&
      details.images.includes(
        selectedImage
      )
    ) {
      return;
    }

    setSelectedImage(
      details.images[0]
    );
  }, [
    rentalId,
    details?.images,
    selectedImage,
  ]);

  // ==========================================================
  // IMAGE ERROR HANDLER
  // ==========================================================

  const handleImageError = (
    imageUrl
  ) => {
    setImageErrors((previous) => ({
      ...previous,
      [imageUrl]: true,
    }));

    if (
      selectedImage === imageUrl &&
      details?.images?.length
    ) {
      const nextImage =
        details.images.find(
          (image) =>
            image !== imageUrl &&
            !imageErrors[image]
        );

      if (nextImage) {
        setSelectedImage(
          nextImage
        );
      }
    }
  };

  // ==========================================================
  // DOCUMENT IMAGE ERROR
  // ==========================================================

  const handleDocumentImageError = (
    documentId
  ) => {
    setDocumentImageErrors(
      (previous) => ({
        ...previous,
        [documentId]: true,
      })
    );
  };

  // ==========================================================
  // ACTION HANDLER
  // ==========================================================

  const runAction = async (
    action,
    successMessage
  ) => {
    if (!rentalId) return;

    try {
      setActionLoading(true);
      setActionError("");
      setActionSuccess("");

      console.log(
        "Rental Action:",
        action,
        rentalId
      );

      let response;

      if (action === "deposit") {
        response =
          await markDepositReceived(
            rentalId
          );
      }

      if (action === "allocate") {
        response =
          await allocateRental(
            rentalId
          );
      }

      if (action === "return") {
        response =
          await markRentalReturned(
            rentalId
          );
      }

      console.log(
        "Rental Action Response:",
        response
      );

      setActionSuccess(
        successMessage ||
          "Rental updated successfully."
      );

      await loadRental();
    } catch (err) {
      console.error(
        "RENTAL ACTION ERROR:",
        err
      );

      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update rental."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================================
  // BUTTON ACTIONS
  // ==========================================================

  const handleDeposit = () => {
    if (
      !window.confirm(
        "Mark security deposit as received?"
      )
    ) {
      return;
    }

    runAction(
      "deposit",
      "Security deposit marked as received."
    );
  };

  const handleAllocate = () => {
    if (
      !window.confirm(
        "Allocate this rental?"
      )
    ) {
      return;
    }

    runAction(
      "allocate",
      "Rental allocated successfully."
    );
  };

  const handleReturn = () => {
    if (
      !window.confirm(
        "Mark this rental as returned?"
      )
    ) {
      return;
    }

    runAction(
      "return",
      "Rental marked as returned."
    );
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="wir-details-page">
        <div className="wir-details-loading">
          <Loader2
            size={40}
            className="wir-spin"
          />

          <h3>
            Loading rental details...
          </h3>

          <p>
            Please wait while we fetch the
            rental information.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (
    error ||
    !rental ||
    !details
  ) {
    return (
      <div className="wir-details-page">
        <div className="wir-details-error">
          <div className="wir-error-icon">
            <AlertCircle size={34} />
          </div>

          <h2>
            Unable to load rental
          </h2>

          <p>
            {error ||
              "Rental details were not found."}
          </p>

          <div className="wir-error-actions">
            <button
              className="wir-btn wir-btn-secondary"
              onClick={() =>
                navigate(-1)
              }
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              className="wir-btn wir-btn-primary"
              onClick={loadRental}
            >
              <RefreshCw size={18} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="wir-details-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="wir-details-header">

        <div className="wir-header-left">

          <button
            className="wir-back-btn"
            onClick={() =>
              navigate(-1)
            }
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>

          <div>

            <div className="wir-breadcrumb">
              Receptionist
              <span>/</span>
              Rental
              <span>/</span>
              Rental Details
            </div>

            <h1>
              Walk-In Rental Details
            </h1>

            <p>
              Rental ID:{" "}
              <strong>
                {getId(rental)}
              </strong>
            </p>

          </div>

        </div>

        <div className="wir-header-actions">

          <button
            className="wir-btn wir-btn-secondary"
            onClick={() => {
              loadRental();
              loadDocuments();
            }}
            disabled={
              actionLoading ||
              documentsLoading
            }
          >
            <RefreshCw
              size={17}
              className={
                documentsLoading
                  ? "wir-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            className="wir-btn wir-btn-secondary"
            onClick={() =>
              navigate(
                "/receptionist/rental/walkin-orders"
              )
            }
          >
            <FileText size={17} />
            All Rentals
          </button>

        </div>
      </div>

      {/* ======================================================
          ALERTS
      ====================================================== */}

      {actionSuccess && (
        <div className="wir-alert wir-alert-success">
          <CheckCircle2 size={20} />

          <span>
            {actionSuccess}
          </span>
        </div>
      )}

      {actionError && (
        <div className="wir-alert wir-alert-danger">
          <AlertCircle size={20} />

          <span>
            {actionError}
          </span>
        </div>
      )}

      {/* ======================================================
          STATUS BAR
      ====================================================== */}

      <div className="wir-status-card">

        <div className="wir-status-main">

          <div className="wir-status-icon">
            <Package size={24} />
          </div>

          <div>

            <span className="wir-label">
              Rental Status
            </span>

            <div className="wir-status-row">

              <span
                className={`wir-status-badge ${getStatusClass(
                  details.status
                )}`}
              >
                {String(
                  details.status ||
                    "UNKNOWN"
                ).replaceAll(
                  "_",
                  " "
                )}
              </span>

              <span className="wir-source-badge">
                WALK-IN
              </span>

            </div>

          </div>

        </div>

        <div className="wir-status-meta">

          <div>
            <span className="wir-label">
              Created
            </span>

            <strong>
              {formatDateTime(
                details.createdAt
              )}
            </strong>
          </div>

          <div>
            <span className="wir-label">
              Rental Period
            </span>

            <strong>
              {details.rentalMonths} month
              {details.rentalMonths !== 1
                ? "s"
                : ""}
            </strong>
          </div>

          <div>
            <span className="wir-label">
              Security Deposit
            </span>

            <strong>
              {details.depositReceived
                ? "Received"
                : "Pending"}
            </strong>
          </div>

        </div>

      </div>

      {/* ======================================================
          ACTION BUTTONS
      ====================================================== */}

      <div className="wir-action-card">

        <div>
          <h3>
            Rental Actions
          </h3>

          <p>
            Manage deposit, allocation and
            return status from here.
          </p>
        </div>

        <div className="wir-action-buttons">

          {/* Deposit action intentionally kept
              as in your original code */}

          {/*
          {!details.depositReceived && (
            <button
              className="wir-btn wir-btn-warning"
              onClick={handleDeposit}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2
                  size={17}
                  className="wir-spin"
                />
              ) : (
                <ShieldCheck size={17} />
              )}

              Mark Deposit Received
            </button>
          )}
          */}

          {!details.allocatedAt &&
            String(
              details.status
            ).toUpperCase() !==
              "RETURNED" && (
              <button
                className="wir-btn wir-btn-primary"
                onClick={handleAllocate}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2
                    size={17}
                    className="wir-spin"
                  />
                ) : (
                  <CheckCircle2 size={17} />
                )}

                Allocate Rental
              </button>
            )}

          {String(
            details.status
          ).toUpperCase() ===
            "ACTIVE" && (
            <button
              className="wir-btn wir-btn-danger"
              onClick={handleReturn}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2
                  size={17}
                  className="wir-spin"
                />
              ) : (
                <RefreshCw size={17} />
              )}

              Mark Returned
            </button>
          )}

        </div>
      </div>

      {/* ======================================================
          MAIN GRID
      ====================================================== */}

      <div className="wir-details-grid">

        {/* ====================================================
            CUSTOMER
        ==================================================== */}

        <section className="wir-card">

          <div className="wir-card-header">

            <div className="wir-card-title-icon">

              {details.customerType ===
              "COMPANY" ? (
                <Building2 size={20} />
              ) : (
                <User size={20} />
              )}

            </div>

            <div>

              <h2>
                Customer Information
              </h2>

              <p>
                {details.customerType ===
                "COMPANY"
                  ? "Company customer"
                  : "Individual customer"}
              </p>

            </div>

          </div>

          <div className="wir-info-list">

            <div className="wir-info-item">

              <span className="wir-info-icon">
                {details.customerType ===
                "COMPANY" ? (
                  <Building2 size={18} />
                ) : (
                  <User size={18} />
                )}
              </span>

              <div>

                <span>
                  {details.customerType ===
                  "COMPANY"
                    ? "Company Name"
                    : "Full Name"}
                </span>

                <strong>
                  {details.customer.name ||
                    "—"}
                </strong>

              </div>

            </div>

            {details.customer
              .contactPerson && (
              <div className="wir-info-item">

                <span className="wir-info-icon">
                  <User size={18} />
                </span>

                <div>

                  <span>
                    Contact Person
                  </span>

                  <strong>
                    {
                      details.customer
                        .contactPerson
                    }
                  </strong>

                </div>

              </div>
            )}

            <div className="wir-info-item">

              <span className="wir-info-icon">
                <Phone size={18} />
              </span>

              <div>

                <span>
                  Phone
                </span>

                <strong>
                  {details.customer.phone ||
                    "—"}
                </strong>

              </div>

            </div>

            <div className="wir-info-item">

              <span className="wir-info-icon">
                <Mail size={18} />
              </span>

              <div>

                <span>
                  Email
                </span>

                <strong>
                  {details.customer.email ||
                    "—"}
                </strong>

              </div>

            </div>

            <div className="wir-info-item">

              <span className="wir-info-icon">
                <MapPin size={18} />
              </span>

              <div>

                <span>
                  Address
                </span>

                <strong>
                  {details.customer.address ||
                    "—"}
                </strong>

              </div>

            </div>

            {details.customer
              .gstNumber && (
              <div className="wir-info-item">

                <span className="wir-info-icon">
                  <FileText size={18} />
                </span>

                <div>

                  <span>
                    GST Number
                  </span>

                  <strong>
                    {
                      details.customer
                        .gstNumber
                    }
                  </strong>

                </div>

              </div>
            )}

          </div>

        </section>

        {/* ====================================================
            PRODUCT
        ==================================================== */}

        <section className="wir-card">

          <div className="wir-card-header">

            <div className="wir-card-title-icon">
              <Package size={20} />
            </div>

            <div>

              <h2>
                Product Information
              </h2>

              <p>
                Rented product details
              </p>

            </div>

          </div>

          {/* ==================================================
              PRODUCT IMAGE GALLERY
          ================================================== */}

          <div className="wir-product-gallery">

            {/* MAIN IMAGE */}

            <div className="wir-product-main-image">

              {selectedImage &&
              !imageErrors[
                selectedImage
              ] ? (
                <img
                  src={selectedImage}
                  alt={
                    details.productName
                  }
                  className="wir-product-image"
                  onError={() =>
                    handleImageError(
                      selectedImage
                    )
                  }
                />
              ) : (
                <div className="wir-product-placeholder">
                  <Package size={38} />

                  <span>
                    Product image
                    unavailable
                  </span>
                </div>
              )}

            </div>

            {/* SMALL THUMBNAILS */}

            {details.images?.length > 0 && (
              <div className="wir-product-thumbnails">

                {details.images.map(
                  (image, index) => {

                    const broken =
                      imageErrors[
                        image
                      ];

                    if (broken) {
                      return null;
                    }

                    return (
                      <button
                        type="button"
                        key={`${image}-${index}`}
                        className={`wir-product-thumbnail ${
                          selectedImage ===
                          image
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedImage(
                            image
                          )
                        }
                        title={`View image ${
                          index + 1
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${details.productName} ${
                            index + 1
                          }`}
                          onError={() =>
                            handleImageError(
                              image
                            )
                          }
                        />
                      </button>
                    );
                  }
                )}

              </div>
            )}

          </div>

          {/* PRODUCT DETAILS */}

          <div className="wir-product">

            <div className="wir-product-info">

              <h3>
                {details.productName}
              </h3>

              {details.productBrand && (
                <p>
                  Brand:{" "}
                  <strong>
                    {
                      details.productBrand
                    }
                  </strong>
                </p>
              )}

              {details.productModel && (
                <p>
                  Model:{" "}
                  <strong>
                    {
                      details.productModel
                    }
                  </strong>
                </p>
              )}

              {getId(
                details.rentalProduct
              ) && (
                <p className="wir-small-id">
                  Rental Product ID:{" "}
                  {getId(
                    details.rentalProduct
                  )}
                </p>
              )}

              {getId(
                details.product
              ) && (
                <p className="wir-small-id">
                  Product ID:{" "}
                  {getId(
                    details.product
                  )}
                </p>
              )}

            </div>

          </div>

        </section>

        {/* ====================================================
            RENTAL PERIOD
        ==================================================== */}

        <section className="wir-card">

          <div className="wir-card-header">

            <div className="wir-card-title-icon">
              <CalendarDays size={20} />
            </div>

            <div>

              <h2>
                Rental Period
              </h2>

              <p>
                Start and expected return
              </p>

            </div>

          </div>

          <div className="wir-date-grid">

            <div className="wir-date-box">

              <span>
                <CalendarDays size={17} />
                Start Date
              </span>

              <strong>
                {formatDate(
                  details.startDate
                )}
              </strong>

            </div>

            <div className="wir-date-box">

              <span>
                <Clock3 size={17} />
                Expected End Date
              </span>

              <strong>
                {formatDate(
                  details.expectedEndDate
                )}
              </strong>

            </div>

            <div className="wir-date-box">

              <span>
                <IndianRupee size={17} />
                Next Payment
              </span>

              <strong>
                {formatDate(
                  details.nextPaymentDate
                )}
              </strong>

            </div>

            <div className="wir-date-box">

              <span>
                <RefreshCw size={17} />
                Returned At
              </span>

              <strong>
                {formatDateTime(
                  details.returnedAt
                )}
              </strong>

            </div>

          </div>

        </section>

        {/* ====================================================
            PRICING
        ==================================================== */}

        <section className="wir-card">

          <div className="wir-card-header">

            <div className="wir-card-title-icon">
              <IndianRupee size={20} />
            </div>

            <div>

              <h2>
                Rental Pricing
              </h2>

              <p>
                Complete rental calculation
              </p>

            </div>

          </div>

          <div className="wir-pricing">

            <div className="wir-price-row">

              <span>
                Monthly Rent
              </span>

              <strong>
                {formatMoney(
                  details.monthlyRent
                )}
              </strong>

            </div>

            <div className="wir-price-row">

              <span>
                Rental Duration
              </span>

              <strong>
                {details.rentalMonths} month
                {details.rentalMonths !== 1
                  ? "s"
                  : ""}
              </strong>

            </div>

            <div className="wir-price-row">

              <span>
                Rent Subtotal
              </span>

              <strong>
                {formatMoney(
                  details.rentSubtotal
                )}
              </strong>

            </div>

            <div className="wir-price-row">

              <span>
                GST (
                {details.gstPercentage}
                %)
              </span>

              <strong>
                {formatMoney(
                  details.gstAmount
                )}
              </strong>

            </div>

            <div className="wir-price-row">

              <span>
                Security Deposit
              </span>

              <strong>
                {formatMoney(
                  details.securityDeposit
                )}
              </strong>

            </div>

            <div className="wir-price-total">

              <span>
                Total Rental Amount
              </span>

              <strong>
                {formatMoney(
                  details.totalRent
                )}
              </strong>

            </div>

          </div>

        </section>

      </div>

      {/* ======================================================
          CUSTOMER DOCUMENTS
      ====================================================== */}

      <section className="wir-card wir-documents-card">

        <div className="wir-card-header">

          <div className="wir-card-title-icon">
            <FileCheck2 size={20} />
          </div>

          <div>

            <h2>
              Customer Documents
            </h2>

            <p>
              Documents uploaded during rental creation
            </p>

          </div>

          <div className="wir-documents-count">
            {documents.length}{" "}
            {documents.length === 1
              ? "Document"
              : "Documents"}
          </div>

        </div>

        {/* DOCUMENT LOADING */}

        {documentsLoading && (
          <div className="wir-documents-loading">

            <Loader2
              size={26}
              className="wir-spin"
            />

            <span>
              Loading customer documents...
            </span>

          </div>
        )}

        {/* DOCUMENT ERROR */}

        {!documentsLoading &&
          documentsError && (
            <div className="wir-documents-error">

              <AlertCircle size={20} />

              <div>
                <strong>
                  Unable to load documents
                </strong>

                <p>
                  {documentsError}
                </p>
              </div>

              <button
                type="button"
                className="wir-btn wir-btn-secondary"
                onClick={loadDocuments}
              >
                <RefreshCw size={16} />
                Retry
              </button>

            </div>
          )}

        {/* NO DOCUMENTS */}

        {!documentsLoading &&
          !documentsError &&
          documents.length === 0 && (
            <div className="wir-documents-empty">

              <div className="wir-documents-empty-icon">
                <FileText size={34} />
              </div>

              <h3>
                No documents uploaded
              </h3>

              <p>
                Customer documents uploaded during
                rental creation will appear here.
              </p>

            </div>
          )}

        {/* DOCUMENT GRID */}

        {!documentsLoading &&
          !documentsError &&
          documents.length > 0 && (
            <div className="wir-documents-grid">

              {documents.map(
                (document, index) => {

                  const documentId =
                    getId(document) ||
                    `${document?.documentType}-${index}`;

                  const documentUrl =
                    normalizeFileUrl(
                      document?.fileUrl ||
                        document?.url ||
                        document?.path
                    );

                  const pdf =
                    isPdfDocument(
                      document
                    );

                  const image =
                    isImageDocument(
                      document
                    );

                  const imageBroken =
                    documentImageErrors[
                      documentId
                    ];

                  const status =
                    String(
                      document?.verificationStatus ||
                        "PENDING"
                    ).toUpperCase();

                  return (
                    <article
                      className="wir-document-card"
                      key={documentId}
                    >

                      {/* DOCUMENT PREVIEW */}

                      <div className="wir-document-preview">

                        {image &&
                        documentUrl &&
                        !imageBroken ? (
                          <img
                            src={documentUrl}
                            alt={getDocumentLabel(
                              document?.documentType
                            )}
                            className="wir-document-image"
                            onError={() =>
                              handleDocumentImageError(
                                documentId
                              )
                            }
                          />
                        ) : pdf &&
                          documentUrl ? (
                          <iframe
                            src={`${documentUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                            title={getDocumentLabel(
                              document?.documentType
                            )}
                            className="wir-document-pdf"
                          />
                        ) : (
                          <div className="wir-document-file-placeholder">

                            <FileText
                              size={48}
                            />

                            <span>
                              {pdf
                                ? "PDF Document"
                                : "Document File"}
                            </span>

                          </div>
                        )}

                        {/* FILE TYPE BADGE */}

                        <span className="wir-document-file-type">

                          {pdf
                            ? "PDF"
                            : image
                            ? "IMAGE"
                            : "FILE"}

                        </span>

                      </div>

                      {/* DOCUMENT INFORMATION */}

                      <div className="wir-document-content">

                        <div className="wir-document-title-row">

                          <div>

                            <h3>
                              {getDocumentLabel(
                                document?.documentType
                              )}
                            </h3>

                            <p>
                              {document?.fileName ||
                                "Uploaded document"}
                            </p>

                          </div>

                          <span
                            className={`wir-document-status ${getDocumentStatusClass(
                              status
                            )}`}
                          >

                            {status ===
                            "APPROVED" ? (
                              <CheckCircle2
                                size={14}
                              />
                            ) : status ===
                              "REJECTED" ? (
                              <XCircle
                                size={14}
                              />
                            ) : (
                              <Clock3
                                size={14}
                              />
                            )}

                            {status}

                          </span>

                        </div>

                        {/* UPLOADED DATE */}

                        {document?.createdAt && (
                          <div className="wir-document-meta">

                            <span>
                              Uploaded
                            </span>

                            <strong>
                              {formatDateTime(
                                document.createdAt
                              )}
                            </strong>

                          </div>
                        )}

                        {/* VERIFIED DATE */}

                        {document?.verifiedAt && (
                          <div className="wir-document-meta">

                            <span>
                              Verified
                            </span>

                            <strong>
                              {formatDateTime(
                                document.verifiedAt
                              )}
                            </strong>

                          </div>
                        )}

                        {/* REJECTION REASON */}

                        {status ===
                          "REJECTED" &&
                          document?.rejectionReason && (
                            <div className="wir-document-rejection">

                              <XCircle
                                size={16}
                              />

                              <div>

                                <strong>
                                  Rejection Reason
                                </strong>

                                <p>
                                  {
                                    document.rejectionReason
                                  }
                                </p>

                              </div>

                            </div>
                          )}

                        {/* DOCUMENT ACTIONS */}

                        <div className="wir-document-actions">

                          {documentUrl && (
                            <>

                              <a
                                href={
                                  documentUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="wir-document-action-btn primary"
                              >
                                <Eye
                                  size={16}
                                />
                                View
                              </a>

                              <a
                                href={
                                  documentUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                download={
                                  document?.fileName ||
                                  true
                                }
                                className="wir-document-action-btn secondary"
                              >
                                <Download
                                  size={16}
                                />
                                Download
                              </a>

                              <a
                                href={
                                  documentUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="wir-document-action-btn secondary"
                              >
                                <ExternalLink
                                  size={16}
                                />
                                Open
                              </a>

                            </>
                          )}

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

      </section>

      {/* ======================================================
          NOTES
      ====================================================== */}

      {details.notes && (
        <section className="wir-card wir-notes-card">

          <div className="wir-card-header">

            <div className="wir-card-title-icon">
              <FileText size={20} />
            </div>

            <div>

              <h2>
                Handover / Rental Notes
              </h2>

              <p>
                Notes saved during rental creation
              </p>

            </div>

          </div>

          <div className="wir-notes">
            {details.notes}
          </div>

        </section>
      )}

      {/* ======================================================
          TIMELINE
      ====================================================== */}

      <section className="wir-card">

        <div className="wir-card-header">

          <div className="wir-card-title-icon">
            <Clock3 size={20} />
          </div>

          <div>

            <h2>
              Rental Timeline
            </h2>

            <p>
              Important rental events
            </p>

          </div>

        </div>

        <div className="wir-timeline">

          <div className="wir-timeline-item completed">

            <div className="wir-timeline-dot">
              <CheckCircle2 size={16} />
            </div>

            <div>

              <strong>
                Rental Created
              </strong>

              <span>
                {formatDateTime(
                  details.createdAt
                )}
              </span>

            </div>

          </div>

          <div
            className={`wir-timeline-item ${
              details.depositReceived
                ? "completed"
                : ""
            }`}
          >

            <div className="wir-timeline-dot">
              <ShieldCheck size={16} />
            </div>

            <div>

              <strong>
                Security Deposit
              </strong>

              <span>
                {details.depositReceived
                  ? "Deposit received"
                  : "Deposit pending"}
              </span>

            </div>

          </div>

          <div
            className={`wir-timeline-item ${
              details.allocatedAt
                ? "completed"
                : ""
            }`}
          >

            <div className="wir-timeline-dot">
              <Package size={16} />
            </div>

            <div>

              <strong>
                Rental Allocated
              </strong>

              <span>
                {details.allocatedAt
                  ? formatDateTime(
                      details.allocatedAt
                    )
                  : "Not allocated yet"}
              </span>

            </div>

          </div>

          <div
            className={`wir-timeline-item ${
              details.returnedAt
                ? "completed"
                : ""
            }`}
          >

            <div className="wir-timeline-dot">
              <RefreshCw size={16} />
            </div>

            <div>

              <strong>
                Rental Returned
              </strong>

              <span>
                {details.returnedAt
                  ? formatDateTime(
                      details.returnedAt
                    )
                  : "Not returned yet"}
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          FOOTER ACTIONS
      ====================================================== */}

      <div className="wir-footer-actions">

        <button
          className="wir-btn wir-btn-secondary"
          onClick={() =>
            navigate(-1)
          }
        >
          <ArrowLeft size={18} />
          Back to Rentals
        </button>

        <button
          className="wir-btn wir-btn-primary"
          onClick={() =>
            navigate(
              "/receptionist/rental/walkin"
            )
          }
        >
          <Package size={18} />
          Create New Walk-In Rental
        </button>

      </div>

    </div>
  );
}

export default WalkInRentalDetails;



