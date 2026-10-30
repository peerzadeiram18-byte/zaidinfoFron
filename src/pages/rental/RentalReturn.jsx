// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import {
//     ArrowLeft,
//     CalendarDays,
//     CheckCircle2,
//     CircleAlert,
//     FileText,
//     IndianRupee,
//     Laptop,
//     Loader2,
//     Phone,
//     RefreshCw,
//     ShieldCheck,
//     User,
//     Wallet,
// } from "lucide-react";

// import {
//     getRentalById,
//     markRentalReturned,
//     completeRentalSettlement,
//     getRentalReturnPreview,
// } from "../../services/rentalApi";

// import RentalPaymentSchedule from "./RentalPaymentSchedule";

// import "./RentalReturn.css";

// function RentalReturn() {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { rentalId } = useParams();

//     const [rental, setRental] = useState(
//         location.state?.rental || null
//     );

//     const [loading, setLoading] = useState(!location.state?.rental);
//     const [submittingReturn, setSubmittingReturn] = useState(false);
//     const [submittingSettlement, setSubmittingSettlement] =
//         useState(false);

//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     // ============================================
//     // RETURN FORM
//     // ============================================

//     const [returnCondition, setReturnCondition] =
//         useState("GOOD");

//     const [pendingRent, setPendingRent] = useState("");
//     const [damageCharges, setDamageCharges] = useState("");
//     const [otherDeductions, setOtherDeductions] = useState("");
//     const [settlementNotes, setSettlementNotes] = useState("");

//     // ============================================
//     // SETTLEMENT
//     // ============================================

//     const [settlementPaymentMethod, setSettlementPaymentMethod] =
//         useState("CASH");

//     const [settlementAmountReceived, setSettlementAmountReceived] =
//         useState("");

//     const [settlementReference, setSettlementReference] =
//         useState("");

//     const [settlement, setSettlement] = useState(null);

//     // ============================================
//     // RETURN PREVIEW (rent schedule se auto pending rent)
//     // ============================================

//     const [preview, setPreview] = useState(null);

//     // ============================================
//     // HELPERS
//     // ============================================

//     const unwrapResponse = (response) => {
//         return (
//             response?.data?.data ||
//             response?.data?.rental ||
//             response?.data ||
//             response?.rental ||
//             response
//         );
//     };

//     const getCustomerType = () => {
//         return String(
//             rental?.customerType || "INDIVIDUAL"
//         ).toUpperCase();
//     };

//     const getCustomerName = () => {
//         if (getCustomerType() === "COMPANY") {
//             return (
//                 rental?.companyDetails?.contactPerson ||
//                 rental?.companyDetails?.companyName ||
//                 rental?.customer?.name ||
//                 "Company Customer"
//             );
//         }

//         return (
//             rental?.individualDetails?.fullName ||
//             rental?.customer?.name ||
//             rental?.customer?.fullName ||
//             "Walk-In Customer"
//         );
//     };

//     const getCustomerPhone = () => {
//         if (getCustomerType() === "COMPANY") {
//             return (
//                 rental?.companyDetails?.phone ||
//                 rental?.customer?.phone ||
//                 "-"
//             );
//         }

//         return (
//             rental?.individualDetails?.phone ||
//             rental?.customer?.phone ||
//             "-"
//         );
//     };

//     const getCustomerEmail = () => {
//         if (getCustomerType() === "COMPANY") {
//             return (
//                 rental?.companyDetails?.email ||
//                 rental?.customer?.email ||
//                 "-"
//             );
//         }

//         return (
//             rental?.individualDetails?.email ||
//             rental?.customer?.email ||
//             "-"
//         );
//     };

//     const getProductName = () => {
//         return (
//             rental?.product?.name ||
//             rental?.product?.title ||
//             rental?.productId?.name ||
//             rental?.productId?.title ||
//             rental?.rentalProduct?.product?.name ||
//             rental?.rentalProduct?.name ||
//             rental?.rentalProduct?.title ||
//             "Rental Laptop"
//         );
//     };

//     const getProductBrand = () => {
//         const brand =
//             rental?.product?.brand ||
//             rental?.productId?.brand ||
//             rental?.rentalProduct?.product?.brand;

//         if (typeof brand === "object") {
//             return (
//                 brand?.name ||
//                 brand?.title ||
//                 ""
//             );
//         }

//         return brand || "";
//     };

//     const getMonthlyRent = () => {
//         return Number(
//             rental?.monthlyRent ||
//             rental?.rentalProduct?.monthlyRent ||
//             0
//         );
//     };

//     const getSecurityDeposit = () => {
//         return Number(
//             rental?.securityDeposit || 0
//         );
//     };

//     // Deposit jo customer ne asal me diya (preview se). Preview na mile to full deposit.
//     const getHeldDeposit = () => {
//         if (preview && Number.isFinite(Number(preview.heldDeposit))) {
//             return Number(preview.heldDeposit);
//         }

//         return getSecurityDeposit();
//     };

//     const getGSTPercentage = () => {
//         return Number(
//             rental?.gstPercentage ||
//             rental?.gst ||
//             0
//         );
//     };

//     const getRentalDurationType = () => {
//         return String(
//             rental?.rentalDurationType ||
//             "MONTHS"
//         ).toUpperCase();
//     };

//     const getRentalDuration = () => {
//         return Number(
//             rental?.rentalDuration ||
//             rental?.rentalMonths ||
//             1
//         );
//     };

//     const getDailyRent = () => {
//         const monthlyRent = getMonthlyRent();

//         return monthlyRent / 30;
//     };

//     const formatMoney = (value) => {
//         return Number(value || 0).toLocaleString(
//             "en-IN",
//             {
//                 maximumFractionDigits: 2,
//             }
//         );
//     };

//     const formatDate = (value) => {
//         if (!value) {
//             return "-";
//         }

//         const date = new Date(value);

//         if (Number.isNaN(date.getTime())) {
//             return "-";
//         }

//         return date.toLocaleDateString("en-IN", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//         });
//     };

//     // ============================================
//     // LOAD RENTAL
//     // ============================================

//     const loadRental = async () => {
//         try {
//             setLoading(true);
//             setError("");

//             if (!rentalId) {
//                 throw new Error(
//                     "Rental ID is missing"
//                 );
//             }

//             const response =
//                 await getRentalById(rentalId);

//             console.log(
//                 "RENTAL RETURN DETAILS:",
//                 response
//             );

//             const data =
//                 unwrapResponse(response);

//             if (!data) {
//                 throw new Error(
//                     "Rental details not found"
//                 );
//             }

//             setRental(data);
//         } catch (err) {
//             console.error(
//                 "LOAD RENTAL RETURN ERROR:",
//                 err
//             );

//             setError(
//                 err?.response?.data?.message ||
//                 err?.message ||
//                 "Failed to load rental details"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (!rentalId) {
//             setError("Rental ID is missing");
//             setLoading(false);
//             return;
//         }

//         if (!location.state?.rental) {
//             loadRental();
//         }
//     }, [rentalId]);

//     // ============================================
//     // LOAD RETURN PREVIEW
//     // Rent schedule me jo months unpaid/due hain unka rent
//     // ============================================

//     const loadPreview = useCallback(async () => {
//         if (!rentalId) return;

//         try {
//             const response = await getRentalReturnPreview(rentalId);

//             const data =
//                 response?.data?.pendingRent !== undefined
//                     ? response.data
//                     : response?.data?.data || response?.data || response;

//             setPreview(data || null);
//         } catch (err) {
//             // Preview na mile to bhi return form chalega (backend final hisaab khud karta hai)
//             console.error("LOAD RETURN PREVIEW ERROR:", err);
//             setPreview(null);
//         }
//     }, [rentalId]);

//     useEffect(() => {
//         if (String(rental?.status || "ACTIVE").toUpperCase() === "ACTIVE") {
//             loadPreview();
//         }
//     }, [rental?.status, loadPreview]);

//     // Schedule se rent receive hone ke baad preview dobara
//     const handleSchedulePaid = () => {
//         loadPreview();
//     };

//     // ============================================
//     // CALCULATIONS
//     // ============================================

//     const autoPendingRent = Number(preview?.pendingRent) || 0;

//     const calculated = useMemo(() => {
//         const entered =
//             Number(pendingRent) || 0;

//         // Backend bhi yahi karta hai: schedule ka rent aur likha hua rent, jo bada ho
//         const pending =
//             Math.max(entered, autoPendingRent);

//         const damage =
//             Number(damageCharges) || 0;

//         const other =
//             Number(otherDeductions) || 0;

//         const deposit =
//             getHeldDeposit();

//         const gstPercentage =
//             getGSTPercentage();

//         const pendingRentGST =
//             pending * gstPercentage / 100;

//         const totalPendingRent =
//             pending + pendingRentGST;

//         const totalDeductions =
//             totalPendingRent +
//             damage +
//             other;

//         const depositBalance =
//             deposit - totalDeductions;

//         const refundAmount =
//             depositBalance > 0
//                 ? depositBalance
//                 : 0;

//         const extraPayableAmount =
//             depositBalance < 0
//                 ? Math.abs(depositBalance)
//                 : 0;

//         return {
//             pending,
//             damage,
//             other,
//             deposit,
//             gstPercentage,
//             pendingRentGST,
//             totalPendingRent,
//             totalDeductions,
//             depositBalance,
//             refundAmount,
//             extraPayableAmount,
//         };
//     }, [
//         pendingRent,
//         damageCharges,
//         otherDeductions,
//         rental,
//         preview,
//     ]);

//     // ============================================
//     // RETURN API
//     // ============================================

//     const handleReturn = async (event) => {
//         event.preventDefault();

//         try {
//             setSubmittingReturn(true);
//             setError("");
//             setSuccess("");

//             if (!rentalId) {
//                 throw new Error(
//                     "Rental ID is missing"
//                 );
//             }

//             const pending =
//                 Number(pendingRent) || 0;

//             const damage =
//                 Number(damageCharges) || 0;

//             const other =
//                 Number(otherDeductions) || 0;

//             if (pending < 0) {
//                 throw new Error(
//                     "Pending rent cannot be negative"
//                 );
//             }

//             if (damage < 0) {
//                 throw new Error(
//                     "Damage charges cannot be negative"
//                 );
//             }

//             if (other < 0) {
//                 throw new Error(
//                     "Other deductions cannot be negative"
//                 );
//             }

//             const payload = {
//                 returnCondition,
//                 pendingRent: pending,
//                 damageCharges: damage,
//                 otherDeductions: other,
//                 settlementNotes:
//                     settlementNotes.trim(),
//             };

//             console.log(
//                 "MARK RENTAL RETURN PAYLOAD:",
//                 payload
//             );

//             const response =
//                 await markRentalReturned(
//                     rentalId,
//                     payload
//                 );

//             console.log(
//                 "MARK RENTAL RETURN RESPONSE:",
//                 response
//             );

//             const result =
//                 unwrapResponse(response);

//             const returnedRental =
//                 result?.rental ||
//                 result?.data ||
//                 result ||
//                 rental;

//             setRental(returnedRental);

//             const settlementData =
//                 result?.settlement ||
//                 returnedRental?.settlement ||
//                 {
//                     securityDeposit:
//                         calculated.deposit,

//                     pendingRent:
//                         calculated.pending,

//                     pendingRentGST:
//                         calculated.pendingRentGST,

//                     totalPendingRent:
//                         calculated.totalPendingRent,

//                     totalDeductions:
//                         calculated.totalDeductions,

//                     depositBalance:
//                         calculated.depositBalance,

//                     depositRefundAmount:
//                         calculated.refundAmount,

//                     extraPayableAmount:
//                         calculated.extraPayableAmount,
//                 };

//             setSettlement(
//                 settlementData
//             );

//             if (
//                 Number(
//                     settlementData?.extraPayableAmount
//                 ) > 0
//             ) {
//                 setSettlementAmountReceived(
//                     String(
//                         settlementData.extraPayableAmount
//                     )
//                 );
//             } else {
//                 setSettlementAmountReceived("0");
//             }

//             setSuccess(
//                 "Laptop returned successfully. Please complete the customer settlement."
//             );

//             window.scrollTo({
//                 top: 0,
//                 behavior: "smooth",
//             });
//         } catch (err) {
//             console.error(
//                 "MARK RETURN ERROR:",
//                 err
//             );

//             setError(
//                 err?.response?.data?.message ||
//                 err?.response?.data?.error ||
//                 err?.message ||
//                 "Failed to process rental return"
//             );
//         } finally {
//             setSubmittingReturn(false);
//         }
//     };

//     // ============================================
//     // SETTLEMENT API
//     // ============================================

//     const handleSettlement = async () => {
//         try {
//             setSubmittingSettlement(true);
//             setError("");
//             setSuccess("");

//             if (!rentalId) {
//                 throw new Error(
//                     "Rental ID is missing"
//                 );
//             }

//             const refundAmount =
//                 Number(
//                     settlement?.depositRefundAmount ??
//                     settlement?.refundAmount ??
//                     calculated.refundAmount
//                 ) || 0;

//             const extraPayableAmount =
//                 Number(
//                     settlement?.extraPayableAmount ??
//                     calculated.extraPayableAmount
//                 ) || 0;

//             const amountReceived =
//                 Number(
//                     settlementAmountReceived
//                 ) || 0;

//             if (
//                 extraPayableAmount > 0 &&
//                 amountReceived < extraPayableAmount
//             ) {
//                 throw new Error(
//                     `Customer must pay ₹${formatMoney(
//                         extraPayableAmount
//                     )}`
//                 );
//             }

//             if (
//                 extraPayableAmount > 0 &&
//                 settlementPaymentMethod === "NONE"
//             ) {
//                 throw new Error(
//                     "Please select a payment method"
//                 );
//             }

//             const payload = {
//                 settlementPaymentMethod:
//                     extraPayableAmount > 0
//                         ? settlementPaymentMethod
//                         : "NONE",

//                 settlementAmountReceived:
//                     amountReceived,

//                 settlementReference:
//                     settlementReference.trim(),

//                 settlementNotes:
//                     settlementNotes.trim(),
//             };

//             console.log(
//                 "COMPLETE SETTLEMENT PAYLOAD:",
//                 payload
//             );

//             const response =
//                 await completeRentalSettlement(
//                     rentalId,
//                     payload
//                 );

//             console.log(
//                 "COMPLETE SETTLEMENT RESPONSE:",
//                 response
//             );

//             const result =
//                 unwrapResponse(response);

//             setRental(
//                 result?.rental ||
//                 result
//             );

//             setSuccess(
//                 refundAmount > 0
//                     ? `Rental completed successfully. Refund ₹${formatMoney(
//                         refundAmount
//                     )} to customer.`
//                     : "Rental settlement completed successfully."
//             );

//             setSettlement({
//                 ...(settlement || {}),
//                 ...(result?.settlement || {}),
//                 settlementStatus: "SETTLED",
//             });

//             window.scrollTo({
//                 top: 0,
//                 behavior: "smooth",
//             });
//         } catch (err) {
//             console.error(
//                 "COMPLETE SETTLEMENT ERROR:",
//                 err
//             );

//             setError(
//                 err?.response?.data?.message ||
//                 err?.response?.data?.error ||
//                 err?.message ||
//                 "Failed to complete settlement"
//             );
//         } finally {
//             setSubmittingSettlement(false);
//         }
//     };

//     // ============================================
//     // BACK
//     // ============================================

//     const handleBack = () => {
//         navigate(
//             `/receptionist-dashboard/rental/orders/${rentalId}`
//         );
//     };

//     // ============================================
//     // LOADING
//     // ============================================

//     if (loading) {
//         return (
//             <div className="rental-return-page">
//                 <div className="rental-return-loading">
//                     <Loader2
//                         size={35}
//                         className="spin"
//                     />

//                     <p>
//                         Loading rental details...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     // ============================================
//     // NO RENTAL
//     // ============================================

//     if (!rental) {
//         return (
//             <div className="rental-return-page">
//                 <div className="rental-return-error">
//                     <CircleAlert size={30} />

//                     <h3>
//                         Rental Not Found
//                     </h3>

//                     <p>
//                         {error ||
//                             "Unable to load rental details."}
//                     </p>

//                     <button
//                         onClick={loadRental}
//                         className="return-secondary-btn"
//                     >
//                         <RefreshCw size={17} />
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     // ============================================
//     // STATUS
//     // ============================================

//     const status = String(
//         rental?.status || "ACTIVE"
//     ).toUpperCase();

//     const isSettlementPending =
//         status === "SETTLEMENT_PENDING" ||
//         Boolean(settlement);

//     const isCompleted =
//         status === "COMPLETED" ||
//         String(
//             settlement?.settlementStatus || ""
//         ).toUpperCase() === "SETTLED";

//     // ============================================
//     // SETTLEMENT VALUES
//     // ============================================

//     const settlementDeposit =
//         Number(
//             settlement?.securityDeposit ??
//             calculated.deposit
//         ) || 0;

//     const settlementPendingRent =
//         Number(
//             settlement?.pendingRent ??
//             calculated.pending
//         ) || 0;

//     const settlementGST =
//         Number(
//             settlement?.pendingRentGST ??
//             calculated.pendingRentGST
//         ) || 0;

//     const settlementTotalRent =
//         Number(
//             settlement?.totalPendingRent ??
//             calculated.totalPendingRent
//         ) || 0;

//     const settlementDamage =
//         Number(
//             settlement?.damageCharges ??
//             calculated.damage
//         ) || 0;

//     const settlementOther =
//         Number(
//             settlement?.otherDeductions ??
//             calculated.other
//         ) || 0;

//     const settlementDeductions =
//         Number(
//             settlement?.totalDeductions ??
//             calculated.totalDeductions
//         ) || 0;

//     const settlementRefund =
//         Number(
//             settlement?.depositRefundAmount ??
//             settlement?.refundAmount ??
//             calculated.refundAmount
//         ) || 0;

//     const settlementExtra =
//         Number(
//             settlement?.extraPayableAmount ??
//             calculated.extraPayableAmount
//         ) || 0;

//     // ============================================
//     // RENDER
//     // ============================================

//     return (
//         <div className="rental-return-page">

//             {/* ======================================
//                 TOP HEADER
//             ====================================== */}

//             <div className="rental-return-header">

//                 <div>
//                     <button
//                         className="back-button"
//                         onClick={handleBack}
//                     >
//                         <ArrowLeft size={18} />
//                         Back
//                     </button>

//                     <h1>
//                         Rental Return & Settlement
//                     </h1>

//                     <p>
//                         Collect monthly rent, receive laptop,
//                         calculate deductions and complete
//                         customer settlement.
//                     </p>
//                 </div>

//                 <div
//                     className={`return-status-badge ${status.toLowerCase()}`}
//                 >
//                     {status}
//                 </div>

//             </div>

//             {/* ======================================
//                 ALERTS
//             ====================================== */}

//             {error && (
//                 <div className="return-alert error">
//                     <CircleAlert size={20} />

//                     <div>
//                         <strong>
//                             Error
//                         </strong>

//                         <p>
//                             {error}
//                         </p>
//                     </div>
//                 </div>
//             )}

//             {success && (
//                 <div className="return-alert success">
//                     <CheckCircle2 size={20} />

//                     <div>
//                         <strong>
//                             Success
//                         </strong>

//                         <p>
//                             {success}
//                         </p>
//                     </div>
//                 </div>
//             )}

//             {/* ======================================
//                 COMPLETED
//             ====================================== */}

//             {isCompleted && (
//                 <div className="completed-banner">

//                     <CheckCircle2 size={32} />

//                     <div>
//                         <h2>
//                             Rental Completed
//                         </h2>

//                         <p>
//                             Settlement has been completed
//                             and the laptop is now released
//                             back to rental inventory.
//                         </p>
//                     </div>

//                 </div>
//             )}

//             {/* ======================================
//                 CUSTOMER + PRODUCT
//             ====================================== */}

//             <div className="return-grid">

//                 {/* CUSTOMER */}

//                 <div className="return-card">

//                     <div className="return-card-header">
//                         <div className="return-card-icon">
//                             <User size={20} />
//                         </div>

//                         <div>
//                             <h2>
//                                 Customer Details
//                             </h2>

//                             <span>
//                                 {getCustomerType()}
//                             </span>
//                         </div>
//                     </div>

//                     <div className="details-list">

//                         <div className="detail-row">
//                             <span>
//                                 Name
//                             </span>

//                             <strong>
//                                 {getCustomerName()}
//                             </strong>
//                         </div>

//                         <div className="detail-row">
//                             <span>
//                                 Phone
//                             </span>

//                             <strong>
//                                 <Phone size={15} />
//                                 {getCustomerPhone()}
//                             </strong>
//                         </div>

//                         <div className="detail-row">
//                             <span>
//                                 Email
//                             </span>

//                             <strong>
//                                 {getCustomerEmail()}
//                             </strong>
//                         </div>

//                         {getCustomerType() ===
//                             "COMPANY" && (
//                             <div className="detail-row">
//                                 <span>
//                                     Company
//                                 </span>

//                                 <strong>
//                                     {rental
//                                         ?.companyDetails
//                                         ?.companyName ||
//                                         "-"}
//                                 </strong>
//                             </div>
//                         )}

//                     </div>

//                 </div>

//                 {/* PRODUCT */}

//                 <div className="return-card">

//                     <div className="return-card-header">
//                         <div className="return-card-icon">
//                             <Laptop size={20} />
//                         </div>

//                         <div>
//                             <h2>
//                                 Rental Laptop
//                             </h2>

//                             <span>
//                                 Rental ID: #
//                                 {String(
//                                     rentalId
//                                 ).slice(-8)}
//                             </span>
//                         </div>
//                     </div>

//                     <div className="details-list">

//                         <div className="detail-row">
//                             <span>
//                                 Laptop
//                             </span>

//                             <strong>
//                                 {getProductName()}
//                             </strong>
//                         </div>

//                         <div className="detail-row">
//                             <span>
//                                 Brand
//                             </span>

//                             <strong>
//                                 {getProductBrand() ||
//                                     "-"}
//                             </strong>
//                         </div>

//                         <div className="detail-row">
//                             <span>
//                                 Start Date
//                             </span>

//                             <strong>
//                                 <CalendarDays
//                                     size={15}
//                                 />
//                                 {formatDate(
//                                     rental?.startDate
//                                 )}
//                             </strong>
//                         </div>

//                         <div className="detail-row">
//                             <span>
//                                 Expected End
//                             </span>

//                             <strong>
//                                 {formatDate(
//                                     rental?.expectedEndDate
//                                 )}
//                             </strong>
//                         </div>

//                     </div>

//                 </div>

//             </div>

//             {/* ======================================
//                 RENTAL FINANCIAL DETAILS
//             ====================================== */}

//             <div className="return-card financial-card">

//                 <div className="return-card-header">

//                     <div className="return-card-icon">
//                         <IndianRupee size={20} />
//                     </div>

//                     <div>
//                         <h2>
//                             Rental Financial Details
//                         </h2>

//                         <span>
//                             Current rental agreement
//                         </span>
//                     </div>

//                 </div>

//                 <div className="financial-grid">

//                     <div className="financial-item">
//                         <span>
//                             Rent Basis
//                         </span>

//                         <strong>
//                             {getRentalDurationType() ===
//                                 "DAYS"
//                                 ? "Daily"
//                                 : "Monthly"}
//                         </strong>
//                     </div>

//                     <div className="financial-item">
//                         <span>
//                             Duration
//                         </span>

//                         <strong>
//                             {getRentalDuration()}{" "}
//                             {getRentalDurationType() ===
//                             "DAYS"
//                                 ? "Day(s)"
//                                 : "Month(s)"}
//                         </strong>
//                     </div>

//                     <div className="financial-item">
//                         <span>
//                             Monthly Rent
//                         </span>

//                         <strong>
//                             ₹{" "}
//                             {formatMoney(
//                                 getMonthlyRent()
//                             )}
//                         </strong>
//                     </div>

//                     {getRentalDurationType() ===
//                         "DAYS" && (
//                         <div className="financial-item">
//                             <span>
//                                 Approx. Daily Rent
//                             </span>

//                             <strong>
//                                 ₹{" "}
//                                 {formatMoney(
//                                     getDailyRent()
//                                 )}
//                             </strong>
//                         </div>
//                     )}

//                     <div className="financial-item">
//                         <span>
//                             GST
//                         </span>

//                         <strong>
//                             {getGSTPercentage()}%
//                         </strong>
//                     </div>

//                     <div className="financial-item deposit">
//                         <span>
//                             Security Deposit
//                         </span>

//                         <strong>
//                             ₹{" "}
//                             {formatMoney(
//                                 getSecurityDeposit()
//                             )}
//                         </strong>
//                     </div>

//                     {preview && (
//                         <div className="financial-item deposit">
//                             <span>
//                                 Deposit Received
//                             </span>

//                             <strong>
//                                 ₹{" "}
//                                 {formatMoney(
//                                     getHeldDeposit()
//                                 )}
//                             </strong>
//                         </div>
//                     )}

//                 </div>

//             </div>

//             {/* ======================================
//                 MONTHLY RENT PAYMENTS
//                 Har month ka rent yahin se tick karke receive karo
//             ====================================== */}

//             <RentalPaymentSchedule
//                 rentalId={rentalId}
//                 reloadKey={status}
//                 onPaid={handleSchedulePaid}
//             />

//             {/* ======================================
//                 RETURN FORM
//             ====================================== */}

//             {!isSettlementPending &&
//                 !isCompleted && (
//                     <form
//                         className="return-card return-form-card"
//                         onSubmit={handleReturn}
//                     >

//                         <div className="return-card-header">

//                             <div className="return-card-icon">
//                                 <RefreshCw size={20} />
//                             </div>

//                             <div>
//                                 <h2>
//                                     Receive Laptop
//                                 </h2>

//                                 <span>
//                                     Check physical condition
//                                     before completing return.
//                                 </span>
//                             </div>

//                         </div>

//                         {/* CONDITION */}

//                         <div className="form-section">

//                             <label>
//                                 Laptop Condition
//                             </label>

//                             <div className="condition-grid">

//                                 <button
//                                     type="button"
//                                     className={
//                                         `condition-option ${
//                                             returnCondition ===
//                                             "GOOD"
//                                                 ? "selected good"
//                                                 : ""
//                                         }`
//                                     }
//                                     onClick={() =>
//                                         setReturnCondition(
//                                             "GOOD"
//                                         )
//                                     }
//                                 >
//                                     <CheckCircle2
//                                         size={23}
//                                     />

//                                     <span>
//                                         GOOD
//                                     </span>

//                                     <small>
//                                         No damage
//                                     </small>
//                                 </button>

//                                 <button
//                                     type="button"
//                                     className={
//                                         `condition-option ${
//                                             returnCondition ===
//                                             "DAMAGED"
//                                                 ? "selected damaged"
//                                                 : ""
//                                         }`
//                                     }
//                                     onClick={() =>
//                                         setReturnCondition(
//                                             "DAMAGED"
//                                         )
//                                     }
//                                 >
//                                     <CircleAlert
//                                         size={23}
//                                     />

//                                     <span>
//                                         DAMAGED
//                                     </span>

//                                     <small>
//                                         Minor damage
//                                     </small>
//                                 </button>

//                                 <button
//                                     type="button"
//                                     className={
//                                         `condition-option ${
//                                             returnCondition ===
//                                             "HEAVILY_DAMAGED"
//                                                 ? "selected heavy"
//                                                 : ""
//                                         }`
//                                     }
//                                     onClick={() =>
//                                         setReturnCondition(
//                                             "HEAVILY_DAMAGED"
//                                         )
//                                     }
//                                 >
//                                     <CircleAlert
//                                         size={23}
//                                     />

//                                     <span>
//                                         HEAVILY DAMAGED
//                                     </span>

//                                     <small>
//                                         Major damage
//                                     </small>
//                                 </button>

//                                 <button
//                                     type="button"
//                                     className={
//                                         `condition-option ${
//                                             returnCondition ===
//                                             "MISSING"
//                                                 ? "selected missing"
//                                                 : ""
//                                         }`
//                                     }
//                                     onClick={() =>
//                                         setReturnCondition(
//                                             "MISSING"
//                                         )
//                                     }
//                                 >
//                                     <CircleAlert
//                                         size={23}
//                                     />

//                                     <span>
//                                         MISSING
//                                     </span>

//                                     <small>
//                                         Laptop not returned
//                                     </small>
//                                 </button>

//                             </div>

//                         </div>

//                         {/* CHARGES */}

//                         <div className="form-section">

//                             <div className="section-title">
//                                 <Wallet size={19} />

//                                 <span>
//                                     Charges & Deductions
//                                 </span>
//                             </div>

//                             <div className="charges-grid">

//                                 <div className="input-group">

//                                     <label>
//                                         Pending Rent
//                                     </label>

//                                     <div className="money-input">
//                                         <span>₹</span>

//                                         <input
//                                             type="number"
//                                             min="0"
//                                             step="0.01"
//                                             value={
//                                                 pendingRent
//                                             }
//                                             onChange={(e) =>
//                                                 setPendingRent(
//                                                     e.target.value
//                                                 )
//                                             }
//                                             placeholder={
//                                                 autoPendingRent > 0
//                                                     ? String(autoPendingRent)
//                                                     : "0"
//                                             }
//                                         />
//                                     </div>

//                                     <small>
//                                         {autoPendingRent > 0
//                                             ? `Rent schedule ke hisaab se ₹${formatMoney(
//                                                 autoPendingRent
//                                             )} (GST se pehle) apne aap judega. Isse zyada tabhi likho jab extra chahiye.`
//                                             : "Rent schedule me koi unpaid due month nahi. Extra rent ho to likho."}
//                                     </small>

//                                 </div>

//                                 <div className="input-group">

//                                     <label>
//                                         Damage Charges
//                                     </label>

//                                     <div className="money-input">
//                                         <span>₹</span>

//                                         <input
//                                             type="number"
//                                             min="0"
//                                             step="0.01"
//                                             value={
//                                                 damageCharges
//                                             }
//                                             onChange={(e) =>
//                                                 setDamageCharges(
//                                                     e.target.value
//                                                 )
//                                             }
//                                             placeholder="0"
//                                         />
//                                     </div>

//                                     <small>
//                                         Repair / damage
//                                         deduction.
//                                     </small>

//                                 </div>

//                                 <div className="input-group">

//                                     <label>
//                                         Other Deductions
//                                     </label>

//                                     <div className="money-input">
//                                         <span>₹</span>

//                                         <input
//                                             type="number"
//                                             min="0"
//                                             step="0.01"
//                                             value={
//                                                 otherDeductions
//                                             }
//                                             onChange={(e) =>
//                                                 setOtherDeductions(
//                                                     e.target.value
//                                                 )
//                                             }
//                                             placeholder="0"
//                                         />
//                                     </div>

//                                     <small>
//                                         Any other deduction.
//                                     </small>

//                                 </div>

//                             </div>

//                         </div>

//                         {/* NOTES */}

//                         <div className="form-section">

//                             <label>
//                                 Settlement Notes
//                             </label>

//                             <textarea
//                                 value={
//                                     settlementNotes
//                                 }
//                                 onChange={(e) =>
//                                     setSettlementNotes(
//                                         e.target.value
//                                     )
//                                 }
//                                 rows={4}
//                                 placeholder="Enter return condition notes, damage details or any other information..."
//                             />

//                         </div>

//                         {/* LIVE CALCULATION */}

//                         <div className="calculation-box">

//                             <div className="calculation-row">
//                                 <span>
//                                     Security Deposit (received)
//                                 </span>

//                                 <strong>
//                                     ₹{" "}
//                                     {formatMoney(
//                                         calculated.deposit
//                                     )}
//                                 </strong>
//                             </div>

//                             <div className="calculation-row">
//                                 <span>
//                                     Pending Rent
//                                 </span>

//                                 <strong>
//                                     ₹{" "}
//                                     {formatMoney(
//                                         calculated.pending
//                                     )}
//                                 </strong>
//                             </div>

//                             <div className="calculation-row">
//                                 <span>
//                                     Rent GST
//                                 </span>

//                                 <strong>
//                                     ₹{" "}
//                                     {formatMoney(
//                                         calculated.pendingRentGST
//                                     )}
//                                 </strong>
//                             </div>

//                             <div className="calculation-row">
//                                 <span>
//                                     Damage Charges
//                                 </span>

//                                 <strong>
//                                     ₹{" "}
//                                     {formatMoney(
//                                         calculated.damage
//                                     )}
//                                 </strong>
//                             </div>

//                             <div className="calculation-row">
//                                 <span>
//                                     Other Deductions
//                                 </span>

//                                 <strong>
//                                     ₹{" "}
//                                     {formatMoney(
//                                         calculated.other
//                                     )}
//                                 </strong>
//                             </div>

//                             <div className="calculation-divider" />

//                             <div className="calculation-row total">
//                                 <span>
//                                     Total Deductions
//                                 </span>

//                                 <strong>
//                                     ₹{" "}
//                                     {formatMoney(
//                                         calculated.totalDeductions
//                                     )}
//                                 </strong>
//                             </div>

//                             {calculated.refundAmount >
//                                 0 ? (
//                                 <div className="settlement-result refund">

//                                     <CheckCircle2
//                                         size={25}
//                                     />

//                                     <div>
//                                         <span>
//                                             Customer Refund
//                                         </span>

//                                         <strong>
//                                             ₹{" "}
//                                             {formatMoney(
//                                                 calculated.refundAmount
//                                             )}
//                                         </strong>
//                                     </div>

//                                 </div>
//                             ) : calculated.extraPayableAmount >
//                               0 ? (
//                                 <div className="settlement-result payable">

//                                     <CircleAlert
//                                         size={25}
//                                     />

//                                     <div>
//                                         <span>
//                                             Customer Has To Pay
//                                         </span>

//                                         <strong>
//                                             ₹{" "}
//                                             {formatMoney(
//                                                 calculated.extraPayableAmount
//                                             )}
//                                         </strong>
//                                     </div>

//                                 </div>
//                             ) : (
//                                 <div className="settlement-result settled">

//                                     <CheckCircle2
//                                         size={25}
//                                     />

//                                     <div>
//                                         <span>
//                                             Settlement Balance
//                                         </span>

//                                         <strong>
//                                             ₹ 0
//                                         </strong>
//                                     </div>

//                                 </div>
//                             )}

//                         </div>

//                         {/* SUBMIT */}

//                         <div className="form-actions">

//                             <button
//                                 type="button"
//                                 className="return-secondary-btn"
//                                 onClick={handleBack}
//                                 disabled={
//                                     submittingReturn
//                                 }
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 type="submit"
//                                 className="return-primary-btn"
//                                 disabled={
//                                     submittingReturn
//                                 }
//                             >
//                                 {submittingReturn ? (
//                                     <>
//                                         <Loader2
//                                             size={18}
//                                             className="spin"
//                                         />

//                                         Processing...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <RefreshCw
//                                             size={18}
//                                         />

//                                         Receive Laptop
//                                     </>
//                                 )}
//                             </button>

//                         </div>

//                     </form>
//                 )}

//             {/* ======================================
//                 SETTLEMENT CARD
//             ====================================== */}

//             {isSettlementPending &&
//                 !isCompleted && (
//                     <div className="return-card settlement-card">

//                         <div className="return-card-header">

//                             <div className="return-card-icon">
//                                 <ShieldCheck size={20} />
//                             </div>

//                             <div>
//                                 <h2>
//                                     Customer Settlement
//                                 </h2>

//                                 <span>
//                                     Complete payment/refund
//                                     before closing rental.
//                                 </span>
//                             </div>

//                         </div>

//                         {/* SETTLEMENT CALCULATION */}

//                         <div className="settlement-summary">

//                             <div className="settlement-summary-row">
//                                 <span>
//                                     Security Deposit (received)
//                                 </span>

//                                 <strong>
//                                     ₹{" "}
//                                     {formatMoney(
//                                         settlementDeposit
//                                     )}
//                                 </strong>
//                             </div>

//                             <div className="settlement-summary-row">
//                                 <span>
//                                     Pending Rent
//                                 </span>

//                                 <strong>
//                                     ₹{" "}
//                                     {formatMoney(
//                                         settlementPendingRent
//                                     )}
//                                 </strong>
//                             </div>

//                             <div className="settlement-summary-row">
//                                 <span>
//                                     Rent GST
//                                 </span>

//                                 <strong>
//                                     ₹{" "}
//                                     {formatMoney(
//                                         settlementGST
//                                     )}
//                                 </strong>
//                             </div>

//                             <div className="settlement-summary-row">
//                                 <span>
//                                     Total Rent Due
//                                 </span>

//                                 <strong>
//                                     ₹{" "}
//                                     {formatMoney(
//                                         settlementTotalRent
//                                     )}
//                                 </strong>
//                             </div>

//                             <div className="settlement-summary-row">
//                                 <span>
//                                     Damage Charges
//                                 </span>

//                                 <strong>
//                                     ₹{" "}
//                                     {formatMoney(
//                                         settlementDamage
//                                     )}
//                                 </strong>
//                             </div>

//                             <div className="settlement-summary-row">
//                                 <span>
//                                     Other Deductions
//                                 </span>

//                                 <strong>
//                                     ₹{" "}
//                                     {formatMoney(
//                                         settlementOther
//                                     )}
//                                 </strong>
//                             </div>

//                             <div className="settlement-summary-row total">
//                                 <span>
//                                     Total Deductions
//                                 </span>

//                                 <strong>
//                                     ₹{" "}
//                                     {formatMoney(
//                                         settlementDeductions
//                                     )}
//                                 </strong>
//                             </div>

//                         </div>

//                         {/* REFUND */}

//                         {settlementRefund > 0 && (
//                             <div className="refund-box">

//                                 <CheckCircle2
//                                     size={28}
//                                 />

//                                 <div>
//                                     <span>
//                                         Refund Customer
//                                     </span>

//                                     <strong>
//                                         ₹{" "}
//                                         {formatMoney(
//                                             settlementRefund
//                                         )}
//                                     </strong>

//                                     <small>
//                                         Security deposit
//                                         balance will be
//                                         refunded.
//                                     </small>
//                                 </div>

//                             </div>
//                         )}

//                         {/* EXTRA PAYMENT */}

//                         {settlementExtra > 0 && (
//                             <div className="extra-payment-box">

//                                 <CircleAlert
//                                     size={28}
//                                 />

//                                 <div>
//                                     <span>
//                                         Customer Payment Required
//                                     </span>

//                                     <strong>
//                                         ₹{" "}
//                                         {formatMoney(
//                                             settlementExtra
//                                         )}
//                                     </strong>

//                                     <small>
//                                         Customer must pay
//                                         this amount before
//                                         rental can be
//                                         completed.
//                                     </small>
//                                 </div>

//                             </div>
//                         )}

//                         {/* PAYMENT */}

//                         {settlementExtra > 0 && (
//                             <div className="settlement-payment-section">

//                                 <h3>
//                                     Payment Details
//                                 </h3>

//                                 <div className="charges-grid">

//                                     <div className="input-group">

//                                         <label>
//                                             Payment Method
//                                         </label>

//                                         <select
//                                             value={
//                                                 settlementPaymentMethod
//                                             }
//                                             onChange={(e) =>
//                                                 setSettlementPaymentMethod(
//                                                     e.target.value
//                                                 )
//                                             }
//                                         >
//                                             <option value="CASH">
//                                                 Cash
//                                             </option>

//                                             <option value="UPI">
//                                                 UPI
//                                             </option>

//                                             <option value="CARD">
//                                                 Card
//                                             </option>

//                                             <option value="BANK_TRANSFER">
//                                                 Bank Transfer
//                                             </option>

//                                             <option value="ONLINE">
//                                                 Online
//                                             </option>
//                                         </select>

//                                     </div>

//                                     <div className="input-group">

//                                         <label>
//                                             Amount Received
//                                         </label>

//                                         <div className="money-input">
//                                             <span>
//                                                 ₹
//                                             </span>

//                                             <input
//                                                 type="number"
//                                                 min="0"
//                                                 step="0.01"
//                                                 value={
//                                                     settlementAmountReceived
//                                                 }
//                                                 onChange={(e) =>
//                                                     setSettlementAmountReceived(
//                                                         e.target.value
//                                                     )
//                                                 }
//                                             />
//                                         </div>

//                                     </div>

//                                     <div className="input-group">

//                                         <label>
//                                             Reference / Transaction ID
//                                         </label>

//                                         <input
//                                             type="text"
//                                             value={
//                                                 settlementReference
//                                             }
//                                             onChange={(e) =>
//                                                 setSettlementReference(
//                                                     e.target.value
//                                                 )
//                                             }
//                                             placeholder="Optional"
//                                         />

//                                     </div>

//                                 </div>

//                             </div>
//                         )}

//                         {/* REFUND PAYMENT METHOD NOTE */}

//                         {settlementRefund > 0 && (
//                             <div className="refund-method-note">

//                                 <Wallet size={19} />

//                                 <span>
//                                     Refund ₹
//                                     {formatMoney(
//                                         settlementRefund
//                                     )}{" "}
//                                     to the customer according
//                                     to your store's refund
//                                     process.
//                                 </span>

//                             </div>
//                         )}

//                         {/* NOTES */}

//                         <div className="form-section">

//                             <label>
//                                 Settlement Notes
//                             </label>

//                             <textarea
//                                 value={
//                                     settlementNotes
//                                 }
//                                 onChange={(e) =>
//                                     setSettlementNotes(
//                                         e.target.value
//                                     )
//                                 }
//                                 rows={3}
//                                 placeholder="Settlement notes..."
//                             />

//                         </div>

//                         {/* COMPLETE */}

//                         <div className="form-actions">

//                             <button
//                                 type="button"
//                                 className="return-secondary-btn"
//                                 onClick={handleBack}
//                                 disabled={
//                                     submittingSettlement
//                                 }
//                             >
//                                 Back
//                             </button>

//                             <button
//                                 type="button"
//                                 className="return-primary-btn complete-btn"
//                                 onClick={
//                                     handleSettlement
//                                 }
//                                 disabled={
//                                     submittingSettlement
//                                 }
//                             >
//                                 {submittingSettlement ? (
//                                     <>
//                                         <Loader2
//                                             size={18}
//                                             className="spin"
//                                         />

//                                         Completing...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <CheckCircle2
//                                             size={18}
//                                         />

//                                         Complete Settlement
//                                     </>
//                                 )}
//                             </button>

//                         </div>

//                     </div>
//                 )}

//             {/* ======================================
//                 COMPLETED SUMMARY
//             ====================================== */}

//             {isCompleted && (
//                 <div className="return-card completed-card">

//                     <div className="completed-icon">
//                         <CheckCircle2
//                             size={45}
//                         />
//                     </div>

//                     <h2>
//                         Rental Successfully Completed
//                     </h2>

//                     <p>
//                         Customer settlement is complete.
//                         The rental has been closed and the
//                         laptop has been released back to
//                         available inventory.
//                     </p>

//                     {settlementRefund > 0 && (
//                         <div className="completed-amount refund">
//                             <span>
//                                 Customer Refund
//                             </span>

//                             <strong>
//                                 ₹{" "}
//                                 {formatMoney(
//                                     settlementRefund
//                                 )}
//                             </strong>
//                         </div>
//                     )}

//                     {settlementExtra > 0 && (
//                         <div className="completed-amount payable">
//                             <span>
//                                 Customer Paid
//                             </span>

//                             <strong>
//                                 ₹{" "}
//                                 {formatMoney(
//                                     settlementExtra
//                                 )}
//                             </strong>
//                         </div>
//                     )}

//                     <div className="completed-info">

//                         <div>
//                             <span>
//                                 Rental Status
//                             </span>

//                             <strong>
//                                 COMPLETED
//                             </strong>
//                         </div>

//                         <div>
//                             <span>
//                                 Customer
//                             </span>

//                             <strong>
//                                 {getCustomerName()}
//                             </strong>
//                         </div>

//                         <div>
//                             <span>
//                                 Laptop
//                             </span>

//                             <strong>
//                                 {getProductName()}
//                             </strong>
//                         </div>

//                     </div>

//                     <div className="form-actions">

//                         <button
//                             className="return-secondary-btn"
//                             onClick={handleBack}
//                         >
//                             <ArrowLeft size={18} />
//                             Rental Details
//                         </button>

//                         <button
//                             className="return-primary-btn"
//                             onClick={() =>
//                                 navigate(
//                                     "/receptionist-dashboard/rental/orders"
//                                 )
//                             }
//                         >
//                             <FileText size={18} />
//                             All Rental Orders
//                         </button>

//                     </div>

//                 </div>
//             )}

//         </div>
//     );
// }

// export default RentalReturn;




import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  FileText,
  IndianRupee,
  Laptop,
  Loader2,
  Phone,
  RefreshCw,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react";

import {
  getRentalById,
  markRentalReturned,
  completeRentalSettlement,
  getRentalReturnPreview,
} from "../../services/rentalApi";

import RentalPaymentSchedule from "./RentalPaymentSchedule";
import "./RentalReturn.css";

// =====================================================
// HELPERS
// =====================================================

const hasValue = (value) =>
  value !== undefined &&
  value !== null &&
  value !== "";

const firstValue = (...values) =>
  values.find(hasValue);

const num = (value) => {
  if (!hasValue(value)) return 0;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const round = (value) =>
  Math.round((num(value) + Number.EPSILON) * 100) / 100;

const money = (value) =>
  `₹${num(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const normalizeBilling = (value) => {
  const key = String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  if (
    [
      "NON_GST",
      "NONGST",
      "WITHOUT_GST",
      "NO_GST",
      "EXEMPT",
    ].includes(key)
  ) {
    return "NON_GST";
  }

  if (
    ["GST", "WITH_GST", "INCLUSIVE_GST"].includes(key)
  ) {
    return "GST";
  }

  return "";
};

const dateText = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const apiError = (error, fallback) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error?.message ||
    error?.response?.data?.error ||
    error?.message;

  return typeof message === "string"
    ? message
    : fallback;
};

const unwrap = (response) => {
  let node = response;

  for (let index = 0; index < 5; index++) {
    if (!node || typeof node !== "object") break;

    if (
      node._id ||
      node.rentalNumber ||
      node.rental ||
      node.settlement ||
      node.pendingRent !== undefined
    ) {
      return node;
    }

    if (!node.data || typeof node.data !== "object") {
      break;
    }

    node = node.data;
  }

  return node;
};

const extractRental = (response) => {
  const node = unwrap(response);

  if (node?.rental) return node.rental;

  if (node?.data?.rental) {
    return node.data.rental;
  }

  if (node?._id || node?.rentalNumber) {
    return node;
  }

  return null;
};

const extractSettlement = (response) => {
  const node = unwrap(response);

  return (
    node?.settlement ||
    node?.rental?.settlement ||
    node?.data?.settlement ||
    null
  );
};

const extractPreview = (response) => {
  const node = unwrap(response);

  if (node?.pendingRent !== undefined) {
    return node;
  }

  if (node?.preview?.pendingRent !== undefined) {
    return node.preview;
  }

  if (node?.returnPreview?.pendingRent !== undefined) {
    return node.returnPreview;
  }

  return null;
};

const rentalSettlement = (rental) => {
  if (!rental) return null;

  if (
    rental.settlement &&
    typeof rental.settlement === "object"
  ) {
    return rental.settlement;
  }

  const status = String(
    rental.status || ""
  ).toUpperCase();

  if (
    !["SETTLEMENT_PENDING", "COMPLETED"].includes(
      status
    )
  ) {
    return null;
  }

  const deposit = num(
    firstValue(
      rental.depositAmountPaid,
      rental.securityDepositAmountPaid,
      rental.depositPaid
        ? rental.securityDeposit
        : undefined,
      0
    )
  );

  const pendingRent = num(rental.pendingRent);
  const pendingRentGST = num(rental.pendingRentGST);

  const totalPendingRent = num(
    firstValue(
      rental.totalPendingRent,
      pendingRent + pendingRentGST
    )
  );

  const damageCharges = num(rental.damageCharges);
  const otherDeductions = num(rental.otherDeductions);

  const totalDeductions = num(
    firstValue(
      rental.totalDeductions,
      totalPendingRent +
        damageCharges +
        otherDeductions
    )
  );

  return {
    securityDeposit: deposit,
    pendingRent,
    pendingRentGST,
    totalPendingRent,
    damageCharges,
    otherDeductions,
    totalDeductions,

    depositRefundAmount: num(
      firstValue(
        rental.depositRefundAmount,
        rental.refundAmount,
        Math.max(0, deposit - totalDeductions)
      )
    ),

    extraPayableAmount: num(
      firstValue(
        rental.extraPayableAmount,
        Math.max(0, totalDeductions - deposit)
      )
    ),

    settlementStatus: rental.settlementStatus,
  };
};

// =====================================================
// REUSABLE COMPONENTS
// =====================================================

function Detail({ label, children }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{children}</strong>
    </div>
  );
}

function AmountRow({
  label,
  value,
  total = false,
}) {
  return (
    <div
      className={
        total
          ? "calculation-row total"
          : "calculation-row"
      }
    >
      <span>{label}</span>
      <strong>{money(value)}</strong>
    </div>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function RentalReturn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { rentalId } = useParams();

  const [rental, setRental] = useState(
    location.state?.rental || null
  );

  const [loading, setLoading] = useState(
    !location.state?.rental
  );

  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] =
    useState(false);
  const [previewError, setPreviewError] =
    useState("");

  const [settlement, setSettlement] =
    useState(null);

  const [submittingReturn, setSubmittingReturn] =
    useState(false);

  const [
    submittingSettlement,
    setSubmittingSettlement,
  ] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [returnCondition, setReturnCondition] =
    useState("GOOD");

  const [pendingRent, setPendingRent] =
    useState("");

  const [damageCharges, setDamageCharges] =
    useState("");

  const [otherDeductions, setOtherDeductions] =
    useState("");

  const [settlementNotes, setSettlementNotes] =
    useState("");

  const [
    settlementPaymentMethod,
    setSettlementPaymentMethod,
  ] = useState("CASH");

  const [
    settlementAmountReceived,
    setSettlementAmountReceived,
  ] = useState("");

  const [
    settlementReference,
    setSettlementReference,
  ] = useState("");

  const [
    scheduleRefreshKey,
    setScheduleRefreshKey,
  ] = useState(0);

  // =====================================================
  // STATUS
  // =====================================================

  const status = String(
    rental?.status || ""
  ).toUpperCase();

  const active = status === "ACTIVE";

  const settlementPending =
    status === "SETTLEMENT_PENDING";

  const completed = status === "COMPLETED";

  // =====================================================
  // CUSTOMER
  // =====================================================

  const customerType = String(
    rental?.customerType || "INDIVIDUAL"
  ).toUpperCase();

  const customerName =
    customerType === "COMPANY"
      ? rental?.companyDetails?.companyName ||
        rental?.companyDetails?.contactPerson ||
        rental?.customer?.name ||
        "Company Customer"
      : rental?.individualDetails?.fullName ||
        rental?.customer?.name ||
        rental?.customer?.fullName ||
        "Walk-In Customer";

  const customerPhone =
    customerType === "COMPANY"
      ? rental?.companyDetails?.phone ||
        rental?.customer?.phone ||
        "—"
      : rental?.individualDetails?.phone ||
        rental?.customer?.phone ||
        "—";

  const customerEmail =
    customerType === "COMPANY"
      ? rental?.companyDetails?.email ||
        rental?.customer?.email ||
        "—"
      : rental?.individualDetails?.email ||
        rental?.customer?.email ||
        "—";

  // =====================================================
  // PRODUCT
  // =====================================================

  const rentalProduct =
    rental?.rentalProductId ||
    rental?.rentalProduct ||
    {};

  const product =
    rental?.productId ||
    rental?.product ||
    rentalProduct?.product ||
    {};

  const productName =
    product?.name ||
    product?.title ||
    rentalProduct?.name ||
    rentalProduct?.title ||
    "Rental Laptop";

  const brandValue =
    product?.brand ||
    rentalProduct?.brand;

  const brand =
    typeof brandValue === "object"
      ? brandValue?.name ||
        brandValue?.title ||
        "—"
      : brandValue || "—";

  // =====================================================
  // RENTAL PRICING
  // =====================================================

  // Contract's negotiated price is preferred.
  // No product selling price is used.

  const negotiatedRentValue = firstValue(
    rental?.negotiatedMonthlyRent,
    rental?.pricing?.negotiatedMonthlyRent
  );

  const contractMonthlyRent = firstValue(
    rental?.monthlyRent,
    rental?.agreedMonthlyRent,
    rental?.pricing?.monthlyRent,
    rentalProduct?.monthlyRent,
    rentalProduct?.pricing?.monthlyRent,
    0
  );

  const monthlyRent = num(
    firstValue(
      negotiatedRentValue,
      contractMonthlyRent
    )
  );

  const originalRent = num(
    firstValue(
      rental?.originalMonthlyRent,
      rental?.pricing?.originalMonthlyRent,
      rentalProduct?.monthlyRent,
      monthlyRent
    )
  );

  const isNegotiated =
    hasValue(negotiatedRentValue) ||
    (
      hasValue(rental?.originalMonthlyRent) &&
      Math.abs(originalRent - monthlyRent) > 0.009
    ) ||
    String(
      rental?.pricingType || ""
    ).toUpperCase() === "NEGOTIATED";

  const pricingType = isNegotiated
    ? "NEGOTIATED"
    : "STANDARD";

  const negotiationReason =
    rental?.negotiationReason ||
    rental?.pricing?.negotiationReason ||
    "";

  // =====================================================
  // GST / NON GST
  // =====================================================

  const explicitBilling = normalizeBilling(
    firstValue(
      rental?.billingType,
      rental?.pricing?.billingType,
      rental?.invoiceType,
      rental?.taxType
    )
  );

  const savedGstPercentage = num(
    firstValue(
      rental?.gstPercentage,
      rental?.pricing?.gstPercentage,
      rental?.gst,
      0
    )
  );

  const billingType =
    explicitBilling ||
    (savedGstPercentage > 0
      ? "GST"
      : "NON_GST");

  const isNonGst = billingType === "NON_GST";

  const gstRate = isNonGst
    ? 0
    : savedGstPercentage;

  // =====================================================
  // DURATION
  // =====================================================

  const durationType = String(
    rental?.rentalDurationType ||
    rental?.durationType ||
    "MONTHS"
  ).toUpperCase();

  const duration = num(
    firstValue(
      rental?.rentalDuration,
      rental?.rentalMonths,
      rental?.duration,
      1
    )
  );

  const dailyRent = num(
    firstValue(
      rental?.dailyRent,
      rental?.pricing?.dailyRent,
      monthlyRent / 30
    )
  );

  // =====================================================
  // CONTRACT TOTALS
  // =====================================================

  const calculatedSubtotal = round(
    durationType === "DAYS"
      ? dailyRent * duration
      : monthlyRent * duration
  );

  const contractSubtotal = num(
    firstValue(
      rental?.rentSubtotal,
      rental?.pricing?.rentSubtotal,
      calculatedSubtotal
    )
  );

  const calculatedGST = isNonGst
    ? 0
    : round(
        (contractSubtotal * gstRate) / 100
      );

  const contractGST = isNonGst
    ? 0
    : num(
        firstValue(
          rental?.rentGstAmount,
          rental?.gstAmount,
          rental?.pricing?.gstAmount,
          calculatedGST
        )
      );

  const calculatedContractTotal = round(
    contractSubtotal + contractGST
  );

  const savedContractTotal = firstValue(
    rental?.rentTotalAmount,
    rental?.totalRent,
    rental?.totalRentalAmount,
    rental?.pricing?.totalRent
  );

  const contractTotal = isNonGst
    ? contractSubtotal
    : num(
        firstValue(
          savedContractTotal,
          calculatedContractTotal
        )
      );

  const contractPaid = num(
    rental?.rentPaidAmount
  );

  const contractBalance = round(
    Math.max(
      0,
      num(
        firstValue(
          rental?.rentBalanceAmount,
          contractTotal - contractPaid
        )
      )
    )
  );

  // =====================================================
  // SECURITY DEPOSIT
  // =====================================================

  const configuredDeposit = num(
    firstValue(
      rental?.securityDeposit,
      rental?.pricing?.securityDeposit,
      0
    )
  );

  const depositPaidFlag =
    rental?.depositPaid === true ||
    rental?.depositReceived === true ||
    rental?.isDepositReceived === true ||
    rental?.securityDepositPaid === true;

  const depositStatus = String(
    rental?.depositStatus || ""
  ).toUpperCase();

  const knownHeldDeposit = num(
    firstValue(
      rental?.depositAmountPaid,
      rental?.securityDepositAmountPaid,
      depositPaidFlag ||
      ["PAID", "RECEIVED"].includes(depositStatus)
        ? configuredDeposit
        : undefined,
      0
    )
  );

  const heldDeposit = round(
    Math.max(
      0,
      num(
        firstValue(
          preview?.heldDeposit,
          knownHeldDeposit
        )
      )
    )
  );

  // =====================================================
  // LOAD RENTAL
  // =====================================================

  const loadRental = useCallback(
    async (showLoader = true) => {
      if (!rentalId) {
        setError("Rental ID is missing.");
        setLoading(false);
        return null;
      }

      try {
        if (showLoader) {
          setLoading(true);
        }

        const response = await getRentalById(
          rentalId
        );

        const data = extractRental(response);

        if (!data) {
          throw new Error(
            "Rental details not found in API response."
          );
        }

        setRental(data);

        setSettlement(
          extractSettlement(response) ||
          rentalSettlement(data)
        );

        setError("");

        return data;
      } catch (err) {
        setError(
          apiError(
            err,
            "Failed to load rental details."
          )
        );

        return null;
      } finally {
        setLoading(false);
      }
    },
    [rentalId]
  );

  // =====================================================
  // LOAD RETURN PREVIEW
  // =====================================================

  const loadPreview = useCallback(
    async () => {
      if (!rentalId) return null;

      try {
        setPreviewLoading(true);
        setPreviewError("");

        const response =
          await getRentalReturnPreview(rentalId);

        const data = extractPreview(response);

        if (!data) {
          throw new Error(
            "Return preview does not contain pending rent."
          );
        }

        setPreview(data);
        return data;
      } catch (err) {
        setPreview(null);

        setPreviewError(
          apiError(
            err,
            "Unable to calculate pending rent."
          )
        );

        return null;
      } finally {
        setPreviewLoading(false);
      }
    },
    [rentalId]
  );

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    loadRental(!location.state?.rental);
  }, [loadRental]);

  useEffect(() => {
    if (active) {
      loadPreview();
    } else {
      setPreview(null);
    }
  }, [active, loadPreview]);

  // =====================================================
  // PAYMENT SCHEDULE REFRESH
  // =====================================================

  const onSchedulePaid = useCallback(
    async () => {
      await Promise.all([
        loadRental(false),
        loadPreview(),
      ]);

      setScheduleRefreshKey(
        (previous) => previous + 1
      );
    },
    [loadRental, loadPreview]
  );

  // =====================================================
  // RETURN CALCULATION
  // =====================================================

  const autoPendingRent = round(
    num(preview?.pendingRent)
  );

  const calculated = useMemo(() => {
    const enteredRent = hasValue(pendingRent)
      ? num(pendingRent)
      : autoPendingRent;

    const finalPendingRent = round(
      Math.max(
        autoPendingRent,
        enteredRent
      )
    );

    const scheduledGST = isNonGst
      ? 0
      : round(
          num(
            firstValue(
              preview?.pendingRentGST,
              (autoPendingRent * gstRate) / 100
            )
          )
        );

    const extraRent = round(
      Math.max(
        0,
        finalPendingRent - autoPendingRent
      )
    );

    const extraGST = isNonGst
      ? 0
      : round(
          (extraRent * gstRate) / 100
        );

    const pendingRentGST = isNonGst
      ? 0
      : round(
          scheduledGST + extraGST
        );

    const totalPendingRent = round(
      finalPendingRent + pendingRentGST
    );

    const damage = round(
      Math.max(0, num(damageCharges))
    );

    const other = round(
      Math.max(0, num(otherDeductions))
    );

    const totalDeductions = round(
      totalPendingRent + damage + other
    );

    const depositBalance = round(
      heldDeposit - totalDeductions
    );

    return {
      pending: finalPendingRent,
      pendingRentGST,
      totalPendingRent,
      damage,
      other,
      deposit: heldDeposit,
      totalDeductions,
      depositBalance,

      refundAmount: round(
        Math.max(0, depositBalance)
      ),

      extraPayableAmount: round(
        Math.max(0, -depositBalance)
      ),
    };
  }, [
    pendingRent,
    autoPendingRent,
    preview,
    gstRate,
    isNonGst,
    damageCharges,
    otherDeductions,
    heldDeposit,
  ]);

  // =====================================================
  // GST MISMATCH VALIDATION
  // =====================================================

  const previewTaxMismatch =
    isNonGst &&
    preview &&
    (
      num(preview.pendingRentGST) > 0.009 ||
      (
        hasValue(preview.totalPendingRent) &&
        num(preview.totalPendingRent) >
          num(preview.pendingRent) + 0.009
      )
    );

  const storedSettlement =
    settlement || rentalSettlement(rental);

  const settlementTaxMismatch =
    isNonGst &&
    storedSettlement &&
    (
      num(
        storedSettlement.pendingRentGST
      ) > 0.009 ||
      (
        hasValue(
          storedSettlement.totalPendingRent
        ) &&
        num(
          storedSettlement.totalPendingRent
        ) >
          num(
            storedSettlement.pendingRent
          ) + 0.009
      )
    );

  const contractTaxMismatch =
    isNonGst &&
    (
      num(rental?.rentGstAmount) > 0.009 ||
      num(rental?.gstAmount) > 0.009
    );

  const taxMismatch = Boolean(
    previewTaxMismatch ||
    settlementTaxMismatch ||
    contractTaxMismatch
  );

  const taxMismatchMessage =
    "NON-GST rental mein backend records mein GST amount saved hai. Rental payment schedule, contract totals aur settlement ko backend mein reconcile karna zaroori hai. Existing paid installments ko bina accounting adjustment ke modify nahi karna chahiye.";

  // =====================================================
  // SETTLEMENT SUMMARY
  // =====================================================

  const settled = useMemo(() => {
    const deposit = round(
      num(
        firstValue(
          storedSettlement?.securityDeposit,
          calculated.deposit
        )
      )
    );

    const pending = round(
      num(
        firstValue(
          storedSettlement?.pendingRent,
          calculated.pending
        )
      )
    );

    const gst = isNonGst
      ? 0
      : round(
          num(
            firstValue(
              storedSettlement?.pendingRentGST,
              calculated.pendingRentGST
            )
          )
        );

    const totalRent = round(
      pending + gst
    );

    const damage = round(
      num(
        firstValue(
          storedSettlement?.damageCharges,
          calculated.damage
        )
      )
    );

    const other = round(
      num(
        firstValue(
          storedSettlement?.otherDeductions,
          calculated.other
        )
      )
    );

    const deductions = round(
      totalRent + damage + other
    );

    const refund = round(
      Math.max(
        0,
        deposit - deductions
      )
    );

    const extra = round(
      Math.max(
        0,
        deductions - deposit
      )
    );

    return {
      deposit,
      pending,
      gst,
      totalRent,
      damage,
      other,
      deductions,
      refund,
      extra,
    };
  }, [
    storedSettlement,
    calculated,
    isNonGst,
  ]);

  // Detect inconsistent settlement arithmetic too.
  const settlementArithmeticMismatch = Boolean(
    storedSettlement &&
    (
      (
        hasValue(storedSettlement.totalDeductions) &&
        Math.abs(
          num(storedSettlement.totalDeductions) -
          settled.deductions
        ) > 0.02
      ) ||
      (
        hasValue(
          storedSettlement.depositRefundAmount
        ) &&
        Math.abs(
          num(
            storedSettlement.depositRefundAmount
          ) - settled.refund
        ) > 0.02
      ) ||
      (
        hasValue(
          storedSettlement.extraPayableAmount
        ) &&
        Math.abs(
          num(
            storedSettlement.extraPayableAmount
          ) - settled.extra
        ) > 0.02
      )
    )
  );

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateAmount = (value, label) => {
    if (!hasValue(value)) return "";

    const parsed = Number(value);

    if (
      !Number.isFinite(parsed) ||
      parsed < 0
    ) {
      return `${label} must be a valid non-negative amount.`;
    }

    return "";
  };

  // =====================================================
  // MARK RETURN
  // =====================================================

  const handleReturn = async (event) => {
    event.preventDefault();

    if (!active || submittingReturn) return;

    setError("");
    setSuccess("");

    if (taxMismatch) {
      setError(taxMismatchMessage);
      return;
    }

    if (
      !preview ||
      previewLoading ||
      previewError
    ) {
      setError(
        "Please refresh the pending rent preview first."
      );
      return;
    }

    const validations = [
      validateAmount(
        pendingRent,
        "Pending rent"
      ),
      validateAmount(
        damageCharges,
        "Damage charges"
      ),
      validateAmount(
        otherDeductions,
        "Other deductions"
      ),
    ];

    const validationError =
      validations.find(Boolean);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (
      hasValue(pendingRent) &&
      num(pendingRent) + 0.009 <
        autoPendingRent
    ) {
      setError(
        `Pending rent cannot be less than scheduled due ${money(
          autoPendingRent
        )}.`
      );
      return;
    }

    try {
      setSubmittingReturn(true);

      // Fetch fresh data before financial mutation.
      const freshPreview = await loadPreview();

      if (!freshPreview) {
        throw new Error(
          "Could not verify the latest pending rent."
        );
      }

      const freshRent = round(
        num(freshPreview.pendingRent)
      );

      if (
        isNonGst &&
        (
          num(
            freshPreview.pendingRentGST
          ) > 0.009 ||
          (
            hasValue(
              freshPreview.totalPendingRent
            ) &&
            num(
              freshPreview.totalPendingRent
            ) >
              freshRent + 0.009
          )
        )
      ) {
        throw new Error(taxMismatchMessage);
      }

      if (
        hasValue(pendingRent) &&
        num(pendingRent) + 0.009 <
          freshRent
      ) {
        throw new Error(
          `Outstanding rent has changed. Current due: ${money(
            freshRent
          )}. Refresh and review.`
        );
      }

      const finalPendingRent = round(
        Math.max(
          freshRent,
          hasValue(pendingRent)
            ? num(pendingRent)
            : freshRent
        )
      );

      const payload = {
        returnCondition,
        damageCharges: round(
          num(damageCharges)
        ),
        otherDeductions: round(
          num(otherDeductions)
        ),
        settlementNotes:
          settlementNotes.trim(),
      };

      // The field is intentionally included with
      // the actual due amount, never blank => 0.
      payload.pendingRent = finalPendingRent;

      const response =
        await markRentalReturned(
          rentalId,
          payload
        );

      const updated =
        extractRental(response);

      const responseSettlement =
        extractSettlement(response);

      if (updated) {
        setRental(updated);
      }

      if (responseSettlement) {
        setSettlement(responseSettlement);
      }

      const latest =
        await loadRental(false);

      const finalSettlement =
        responseSettlement ||
        rentalSettlement(
          latest || updated
        );

      if (finalSettlement) {
        setSettlement(finalSettlement);

        setSettlementAmountReceived(
          String(
            round(
              num(
                finalSettlement.extraPayableAmount
              )
            )
          )
        );
      }

      setSuccess(
        "Rental return recorded successfully. Verify final settlement before completing."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        apiError(
          err,
          "Failed to mark rental returned."
        )
      );
    } finally {
      setSubmittingReturn(false);
    }
  };

  // =====================================================
  // COMPLETE SETTLEMENT
  // =====================================================

  const handleSettlement = async () => {
    if (
      !settlementPending ||
      submittingSettlement
    ) {
      return;
    }

    setError("");
    setSuccess("");

    if (taxMismatch) {
      setError(taxMismatchMessage);
      return;
    }

    if (settlementArithmeticMismatch) {
      setError(
        "Backend settlement totals do not match their components. Please reconcile settlement before completion."
      );
      return;
    }

    if (!storedSettlement) {
      setError(
        "Settlement details are unavailable. Refresh rental details."
      );
      return;
    }

    const amount = num(
      settlementAmountReceived
    );

    if (
      settled.extra > 0 &&
      (
        !hasValue(
          settlementAmountReceived
        ) ||
        !Number.isFinite(
          Number(
            settlementAmountReceived
          )
        ) ||
        Math.abs(
          amount - settled.extra
        ) > 0.01
      )
    ) {
      setError(
        `Please collect exactly ${money(
          settled.extra
        )} to complete settlement.`
      );
      return;
    }

    if (
      settled.extra > 0 &&
      settlementPaymentMethod !== "CASH" &&
      !settlementReference.trim()
    ) {
      setError(
        "Transaction reference is required for non-cash payment."
      );
      return;
    }

    try {
      setSubmittingSettlement(true);

      const payload = {
        settlementPaymentMethod:
          settled.extra > 0
            ? settlementPaymentMethod
            : "NONE",

        settlementAmountReceived:
          settled.extra > 0
            ? round(amount)
            : 0,

        settlementReference:
          settled.extra > 0
            ? settlementReference.trim()
            : "",

        settlementNotes:
          settlementNotes.trim(),
      };

      const response =
        await completeRentalSettlement(
          rentalId,
          payload
        );

      const updated =
        extractRental(response);

      const responseSettlement =
        extractSettlement(response);

      if (updated) {
        setRental(updated);
      }

      if (responseSettlement) {
        setSettlement(responseSettlement);
      }

      await loadRental(false);

      setSuccess(
        "Rental settlement completed. Verify the corresponding payment and refund ledger entries."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        apiError(
          err,
          "Failed to complete rental settlement."
        )
      );
    } finally {
      setSubmittingSettlement(false);
    }
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const back = () => {
    navigate(
      `/receptionist-dashboard/rental/orders/${rentalId}`
    );
  };

  // =====================================================
  // LOADING / ERROR
  // =====================================================

  if (loading && !rental) {
    return (
      <div className="rental-return-page">
        <div className="rental-return-loading">
          <Loader2
            className="spin"
            size={35}
          />
          <p>Loading rental details...</p>
        </div>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="rental-return-page">
        <div className="rental-return-error">
          <CircleAlert size={30} />

          <h3>Rental Not Found</h3>

          <p>
            {error ||
              "Unable to load rental details."}
          </p>

          <button
            type="button"
            className="return-secondary-btn"
            onClick={() => loadRental()}
          >
            <RefreshCw size={17} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="rental-return-page">

      {/* HEADER */}

      <div className="rental-return-header">
        <div>
          <button
            type="button"
            className="back-button"
            onClick={back}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h1>
            Rental Return & Settlement
          </h1>

          <p>
            Verify rental pricing, receive the
            laptop, calculate outstanding charges
            and complete settlement.
          </p>
        </div>

        <div
          className={`return-status-badge ${status.toLowerCase()}`}
        >
          {status.replaceAll("_", " ")}
        </div>
      </div>

      {/* ALERTS */}

      {error && (
        <div className="return-alert error">
          <CircleAlert size={20} />

          <div>
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {taxMismatch && (
        <div className="return-alert error">
          <CircleAlert size={20} />

          <div>
            <strong>
              GST Mismatch — Action Blocked
            </strong>

            <p>{taxMismatchMessage}</p>
          </div>
        </div>
      )}

      {settlementArithmeticMismatch && (
        <div className="return-alert error">
          <CircleAlert size={20} />

          <div>
            <strong>
              Settlement Amount Mismatch
            </strong>

            <p>
              Saved settlement totals differ
              from calculated totals. Backend
              reconciliation is required.
            </p>
          </div>
        </div>
      )}

      {success && (
        <div className="return-alert success">
          <CheckCircle2 size={20} />

          <div>
            <strong>Success</strong>
            <p>{success}</p>
          </div>
        </div>
      )}

      {/* COMPLETED BANNER */}

      {completed && (
        <div className="completed-banner">
          <CheckCircle2 size={32} />

          <div>
            <h2>Rental Completed</h2>

            <p>
              Rental settlement is complete.
              Verify the payment/refund ledger
              and inventory status.
            </p>
          </div>
        </div>
      )}

      {/* CUSTOMER + PRODUCT */}

      <div className="return-grid">

        <div className="return-card">
          <div className="return-card-header">
            <div className="return-card-icon">
              <User size={20} />
            </div>

            <div>
              <h2>Customer Details</h2>
              <span>{customerType}</span>
            </div>
          </div>

          <div className="details-list">
            <Detail label="Name">
              {customerName}
            </Detail>

            <Detail label="Phone">
              <Phone size={15} />{" "}
              {customerPhone}
            </Detail>

            <Detail label="Email">
              {customerEmail}
            </Detail>

            {customerType === "COMPANY" && (
              <Detail label="Company">
                {rental?.companyDetails
                  ?.companyName || "—"}
              </Detail>
            )}
          </div>
        </div>

        <div className="return-card">
          <div className="return-card-header">
            <div className="return-card-icon">
              <Laptop size={20} />
            </div>

            <div>
              <h2>Rental Laptop</h2>

              <span>
                Rental #
                {rental?.rentalNumber ||
                  String(rentalId || "").slice(-8)}
              </span>
            </div>
          </div>

          <div className="details-list">
            <Detail label="Laptop">
              {productName}
            </Detail>

            <Detail label="Brand">
              {brand}
            </Detail>

            <Detail label="Start Date">
              <CalendarDays size={15} />{" "}
              {dateText(rental?.startDate)}
            </Detail>

            <Detail label="Expected End">
              {dateText(
                rental?.expectedEndDate
              )}
            </Detail>

            <Detail label="Actual Return">
              {dateText(
                rental?.actualReturnDate ||
                rental?.returnDate ||
                rental?.returnedAt
              )}
            </Detail>
          </div>
        </div>

      </div>

      {/* FINANCIAL DETAILS */}

      <div className="return-card financial-card">
        <div className="return-card-header">
          <div className="return-card-icon">
            <IndianRupee size={20} />
          </div>

          <div>
            <h2>Rental Financial Details</h2>

            <span>
              Contract pricing, GST and deposit
            </span>
          </div>
        </div>

        <div className="financial-grid">

          <div className="financial-item">
            <span>Rent Basis</span>

            <strong>
              {durationType === "DAYS"
                ? "Daily (Legacy)"
                : "Monthly"}
            </strong>
          </div>

          <div className="financial-item">
            <span>Duration</span>

            <strong>
              {duration}{" "}
              {durationType === "DAYS"
                ? "Day(s)"
                : "Month(s)"}
            </strong>
          </div>

          <div className="financial-item">
            <span>Pricing Type</span>

            <strong>
              {pricingType}
            </strong>
          </div>

          {isNegotiated && (
            <div className="financial-item">
              <span>Original Monthly Rent</span>

              <strong>
                {money(originalRent)}
              </strong>
            </div>
          )}

          <div className="financial-item">
            <span>
              {isNegotiated
                ? "Negotiated Monthly Rent"
                : "Monthly Rent"}
            </span>

            <strong>
              {money(monthlyRent)}
            </strong>
          </div>

          {isNegotiated && (
            <div className="financial-item">
              <span>Monthly Price Difference</span>

              <strong>
                {money(
                  originalRent - monthlyRent
                )}
              </strong>
            </div>
          )}

          {negotiationReason && (
            <div className="financial-item">
              <span>Negotiation Reason</span>

              <strong>
                {negotiationReason}
              </strong>
            </div>
          )}

          {durationType === "DAYS" && (
            <div className="financial-item">
              <span>Daily Rent</span>

              <strong>
                {money(dailyRent)}
              </strong>
            </div>
          )}

          <div className="financial-item">
            <span>Billing Type</span>

            <strong>
              {isNonGst ? "NON-GST" : "GST"}
            </strong>
          </div>

          <div className="financial-item">
            <span>GST Percentage</span>

            <strong>{gstRate}%</strong>
          </div>

          <div className="financial-item">
            <span>Rental Subtotal</span>

            <strong>
              {money(contractSubtotal)}
            </strong>
          </div>

          <div className="financial-item">
            <span>Rental GST</span>

            <strong>
              {money(contractGST)}
            </strong>
          </div>

          <div className="financial-item">
            <span>Total Rental Amount</span>

            <strong>
              {money(contractTotal)}
            </strong>
          </div>

          <div className="financial-item">
            <span>Rent Paid</span>

            <strong>
              {money(contractPaid)}
            </strong>
          </div>

          <div className="financial-item">
            <span>Rent Balance</span>

            <strong>
              {money(contractBalance)}
            </strong>
          </div>

          <div className="financial-item deposit">
            <span>Security Deposit Required</span>

            <strong>
              {money(configuredDeposit)}
            </strong>
          </div>

          <div className="financial-item deposit">
            <span>Security Deposit Received</span>

            <strong>
              {money(heldDeposit)}
            </strong>
          </div>

        </div>

        <p className="wir-pricing-note">
          Security deposit is refundable and is
          not included in rental revenue. NON-GST
          rentals must have zero GST in backend
          installments and accounting records.
        </p>
      </div>

      {/* PAYMENT SCHEDULE */}

      <RentalPaymentSchedule
        rentalId={rentalId}
        reloadKey={`${status}-${scheduleRefreshKey}`}
        onPaid={onSchedulePaid}
      />

      {/* RETURN FORM */}

      {active && (
        <form
          className="return-card return-form-card"
          onSubmit={handleReturn}
        >
          <div className="return-card-header">
            <div className="return-card-icon">
              <RefreshCw size={20} />
            </div>

            <div>
              <h2>Receive Laptop</h2>

              <span>
                Inspect device and calculate
                final outstanding charges.
              </span>
            </div>
          </div>

          {previewLoading && (
            <div className="return-alert">
              <Loader2
                className="spin"
                size={18}
              />

              <span>
                Calculating outstanding rent...
              </span>
            </div>
          )}

          {previewError && (
            <div className="return-alert error">
              <CircleAlert size={18} />

              <div>
                <strong>
                  Pending Rent Unavailable
                </strong>

                <p>{previewError}</p>

                <button
                  type="button"
                  className="return-secondary-btn"
                  onClick={loadPreview}
                >
                  Retry Preview
                </button>
              </div>
            </div>
          )}

          {/* CONDITION */}

          <div className="form-section">
            <label>Laptop Condition</label>

            <div className="condition-grid">
              {[
                ["GOOD", "No damage", "good"],
                ["DAMAGED", "Minor damage", "damaged"],
                [
                  "HEAVILY_DAMAGED",
                  "Major damage",
                  "heavy",
                ],
                [
                  "MISSING",
                  "Laptop not returned",
                  "missing",
                ],
              ].map(([value, hint, style]) => (
                <button
                  key={value}
                  type="button"
                  className={`condition-option ${
                    returnCondition === value
                      ? `selected ${style}`
                      : ""
                  }`}
                  onClick={() =>
                    setReturnCondition(value)
                  }
                >
                  {value === "GOOD" ? (
                    <CheckCircle2 size={23} />
                  ) : (
                    <CircleAlert size={23} />
                  )}

                  <span>
                    {value.replaceAll("_", " ")}
                  </span>

                  <small>{hint}</small>
                </button>
              ))}
            </div>
          </div>

          {/* CHARGES */}

          <div className="form-section">
            <div className="section-title">
              <Wallet size={19} />

              <span>
                Charges & Deductions
              </span>
            </div>

            <div className="charges-grid">

              <div className="input-group">
                <label>
                  {isNonGst
                    ? "Pending Rent (NON-GST)"
                    : "Pending Rent (Before GST)"}
                </label>

                <div className="money-input">
                  <span>₹</span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={pendingRent}
                    onChange={(event) =>
                      setPendingRent(
                        event.target.value
                      )
                    }
                    placeholder={String(
                      autoPendingRent
                    )}
                  />
                </div>

                <small>
                  Schedule outstanding:{" "}
                  {money(autoPendingRent)}.
                  Leave blank to use scheduled
                  due automatically.
                </small>
              </div>

              <div className="input-group">
                <label>Damage Charges</label>

                <div className="money-input">
                  <span>₹</span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={damageCharges}
                    onChange={(event) =>
                      setDamageCharges(
                        event.target.value
                      )
                    }
                    placeholder="0"
                  />
                </div>

                <small>
                  Approved repair or damage charges.
                </small>
              </div>

              <div className="input-group">
                <label>Other Deductions</label>

                <div className="money-input">
                  <span>₹</span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={otherDeductions}
                    onChange={(event) =>
                      setOtherDeductions(
                        event.target.value
                      )
                    }
                    placeholder="0"
                  />
                </div>

                <small>
                  Additional approved deductions.
                </small>
              </div>

            </div>
          </div>

          {/* NOTES */}

          <div className="form-section">
            <label>Settlement Notes</label>

            <textarea
              rows={4}
              value={settlementNotes}
              onChange={(event) =>
                setSettlementNotes(
                  event.target.value
                )
              }
              placeholder="Condition, accessories, damages, handover details..."
            />
          </div>

          {/* CALCULATION */}

          <div className="calculation-box">

            <AmountRow
              label="Security Deposit Received"
              value={calculated.deposit}
            />

            <AmountRow
              label="Pending Rent"
              value={calculated.pending}
            />

            <AmountRow
              label={
                isNonGst
                  ? "GST (NON-GST: 0%)"
                  : `Rent GST (${gstRate}%)`
              }
              value={
                calculated.pendingRentGST
              }
            />

            <AmountRow
              label="Total Rent Due"
              value={
                calculated.totalPendingRent
              }
            />

            <AmountRow
              label="Damage Charges"
              value={calculated.damage}
            />

            <AmountRow
              label="Other Deductions"
              value={calculated.other}
            />

            <div className="calculation-divider" />

            <AmountRow
              label="Total Deductions"
              value={
                calculated.totalDeductions
              }
              total
            />

            {calculated.refundAmount > 0 ? (
              <div className="settlement-result refund">
                <CheckCircle2 size={25} />

                <div>
                  <span>Customer Refund</span>

                  <strong>
                    {money(
                      calculated.refundAmount
                    )}
                  </strong>
                </div>
              </div>
            ) : calculated.extraPayableAmount > 0 ? (
              <div className="settlement-result payable">
                <CircleAlert size={25} />

                <div>
                  <span>Customer Has To Pay</span>

                  <strong>
                    {money(
                      calculated.extraPayableAmount
                    )}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="settlement-result settled">
                <CheckCircle2 size={25} />

                <div>
                  <span>Settlement Balance</span>
                  <strong>{money(0)}</strong>
                </div>
              </div>
            )}

          </div>

          {/* ACTIONS */}

          <div className="form-actions">
            <button
              type="button"
              className="return-secondary-btn"
              onClick={back}
              disabled={submittingReturn}
            >
              Cancel
            </button>

            <button
              type="button"
              className="return-secondary-btn"
              onClick={loadPreview}
              disabled={
                previewLoading ||
                submittingReturn
              }
            >
              <RefreshCw size={17} />
              Refresh Due
            </button>

            <button
              type="submit"
              className="return-primary-btn"
              disabled={
                submittingReturn ||
                previewLoading ||
                !preview ||
                taxMismatch
              }
            >
              {submittingReturn ? (
                <>
                  <Loader2
                    className="spin"
                    size={18}
                  />
                  Processing...
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  Receive Laptop
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* SETTLEMENT */}

      {settlementPending && (
        <div className="return-card settlement-card">

          <div className="return-card-header">
            <div className="return-card-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2>Customer Settlement</h2>

              <span>
                Verify final amounts before
                completing settlement.
              </span>
            </div>
          </div>

          <div className="settlement-summary">
            {[
              [
                "Security Deposit Received",
                settled.deposit,
              ],
              [
                "Pending Rent",
                settled.pending,
              ],
              [
                isNonGst
                  ? "Rent GST (NON-GST)"
                  : `Rent GST (${gstRate}%)`,
                settled.gst,
              ],
              [
                "Total Rent Due",
                settled.totalRent,
              ],
              [
                "Damage Charges",
                settled.damage,
              ],
              [
                "Other Deductions",
                settled.other,
              ],
              [
                "Total Deductions",
                settled.deductions,
              ],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={`settlement-summary-row ${
                  index === 6
                    ? "total"
                    : ""
                }`}
              >
                <span>{label}</span>
                <strong>{money(value)}</strong>
              </div>
            ))}
          </div>

          {/* REFUND */}

          {settled.refund > 0 && (
            <div className="refund-box">
              <CheckCircle2 size={28} />

              <div>
                <span>Refund Customer</span>

                <strong>
                  {money(settled.refund)}
                </strong>

                <small>
                  Refund must be processed
                  and recorded using your
                  refund workflow.
                </small>
              </div>
            </div>
          )}

          {/* EXTRA PAYMENT */}

          {settled.extra > 0 && (
            <>
              <div className="extra-payment-box">
                <CircleAlert size={28} />

                <div>
                  <span>
                    Customer Payment Required
                  </span>

                  <strong>
                    {money(settled.extra)}
                  </strong>

                  <small>
                    Collect outstanding amount
                    before completing settlement.
                  </small>
                </div>
              </div>

              <div className="settlement-payment-section">
                <h3>Payment Details</h3>

                <div className="charges-grid">

                  <div className="input-group">
                    <label>Payment Method</label>

                    <select
                      value={
                        settlementPaymentMethod
                      }
                      onChange={(event) =>
                        setSettlementPaymentMethod(
                          event.target.value
                        )
                      }
                    >
                      <option value="CASH">
                        Cash
                      </option>

                      <option value="UPI">
                        UPI
                      </option>

                      <option value="CARD">
                        Card
                      </option>

                      <option value="BANK_TRANSFER">
                        Bank Transfer
                      </option>

                      <option value="ONLINE">
                        Online
                      </option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Amount Received</label>

                    <div className="money-input">
                      <span>₹</span>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={
                          settlementAmountReceived
                        }
                        onChange={(event) =>
                          setSettlementAmountReceived(
                            event.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>
                      Reference / Transaction ID
                    </label>

                    <input
                      type="text"
                      value={
                        settlementReference
                      }
                      onChange={(event) =>
                        setSettlementReference(
                          event.target.value
                        )
                      }
                      placeholder={
                        settlementPaymentMethod ===
                        "CASH"
                          ? "Optional for cash"
                          : "Required"
                      }
                    />
                  </div>

                </div>
              </div>
            </>
          )}

          {/* REFUND NOTE */}

          {settled.refund > 0 && (
            <div className="refund-method-note">
              <Wallet size={19} />

              <span>
                Refund{" "}
                {money(settled.refund)}{" "}
                according to your store's
                refund process. Settlement
                completion does not itself
                confirm a bank refund.
              </span>
            </div>
          )}

          {/* NOTES */}

          <div className="form-section">
            <label>Settlement Notes</label>

            <textarea
              rows={3}
              value={settlementNotes}
              onChange={(event) =>
                setSettlementNotes(
                  event.target.value
                )
              }
              placeholder="Settlement notes..."
            />
          </div>

          {/* ACTIONS */}

          <div className="form-actions">

            <button
              type="button"
              className="return-secondary-btn"
              onClick={back}
              disabled={submittingSettlement}
            >
              Back
            </button>

            <button
              type="button"
              className="return-primary-btn complete-btn"
              onClick={handleSettlement}
              disabled={
                submittingSettlement ||
                taxMismatch ||
                settlementArithmeticMismatch ||
                !storedSettlement
              }
            >
              {submittingSettlement ? (
                <>
                  <Loader2
                    className="spin"
                    size={18}
                  />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Complete Settlement
                </>
              )}
            </button>

          </div>
        </div>
      )}

      {/* COMPLETED SUMMARY */}

      {completed && (
        <div className="return-card completed-card">

          <div className="completed-icon">
            <CheckCircle2 size={45} />
          </div>

          <h2>
            Rental Successfully Completed
          </h2>

          <p>
            Customer settlement is closed.
            Check the payment/refund ledger
            for transaction confirmation.
          </p>

          {settled.refund > 0 && (
            <div className="completed-amount refund">
              <span>
                Calculated Customer Refund
              </span>

              <strong>
                {money(settled.refund)}
              </strong>
            </div>
          )}

          {settled.extra > 0 && (
            <div className="completed-amount payable">
              <span>
                Settlement Amount Due
              </span>

              <strong>
                {money(settled.extra)}
              </strong>
            </div>
          )}

          <div className="completed-info">
            <div>
              <span>Rental Status</span>
              <strong>COMPLETED</strong>
            </div>

            <div>
              <span>Customer</span>
              <strong>{customerName}</strong>
            </div>

            <div>
              <span>Laptop</span>
              <strong>{productName}</strong>
            </div>

            <div>
              <span>Billing Type</span>

              <strong>
                {billingType}
              </strong>
            </div>

            <div>
              <span>Monthly Rent</span>

              <strong>
                {money(monthlyRent)}
              </strong>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="return-secondary-btn"
              onClick={back}
            >
              <ArrowLeft size={18} />
              Rental Details
            </button>

            <button
              type="button"
              className="return-primary-btn"
              onClick={() =>
                navigate(
                  "/receptionist-dashboard/rental/orders"
                )
              }
            >
              <FileText size={18} />
              All Rental Orders
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
