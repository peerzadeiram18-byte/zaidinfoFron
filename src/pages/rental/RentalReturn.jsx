// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   CheckCircle,
//   Clock,
//   PackageCheck,
//   AlertCircle,
//   RefreshCw,
// } from "lucide-react";

// import { getRentalById } from "../../services/rentalApi";
// import "./RentalReturn.css";

// const getApiError = (error) => {
//   return (
//     error?.response?.data?.message ||
//     error?.response?.data?.error ||
//     error?.message ||
//     "Something went wrong"
//   );
// };

// const getStatusText = (status) => {
//   if (!status) return "Unknown";

//   return String(status)
//     .replaceAll("_", " ")
//     .replace(/\b\w/g, (char) => char.toUpperCase());
// };

// const getReturnMessage = (status) => {
//   switch (status) {
//     case "ACTIVE":
//       return {
//         title: "Rental Is Active",
//         message:
//           "Your rental is currently active. Please contact the rental team when you are ready to return the equipment.",
//         type: "active",
//       };

//     case "RETURN_REQUESTED":
//       return {
//         title: "Return Requested",
//         message:
//           "Your return request has been received. The rental team will inspect the equipment and process the return.",
//         type: "requested",
//       };

//     case "RETURNED":
//       return {
//         title: "Equipment Returned",
//         message:
//           "The equipment has been marked as returned and is currently being processed for settlement.",
//         type: "returned",
//       };

//     case "SETTLEMENT_PENDING":
//       return {
//         title: "Settlement Pending",
//         message:
//           "Your equipment has been returned. The security deposit settlement is now being processed.",
//         type: "settlement",
//       };

//     case "COMPLETED":
//       return {
//         title: "Rental Completed",
//         message:
//           "Your rental has been completed successfully.",
//         type: "completed",
//       };

//     case "REJECTED":
//       return {
//         title: "Rental Rejected",
//         message:
//           "This rental request was rejected.",
//         type: "rejected",
//       };

//     case "CANCELLED":
//       return {
//         title: "Rental Cancelled",
//         message:
//           "This rental has been cancelled.",
//         type: "cancelled",
//       };

//     default:
//       return {
//         title: "Return Information",
//         message:
//           "Return information for this rental is shown below.",
//         type: "default",
//       };
//   }
// };

// function RentalReturn() {
//   const { rentalId } = useParams();
//   const navigate = useNavigate();

//   const [rental, setRental] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState("");

//   const loadRental = async (showRefresh = false) => {
//     try {
//       if (showRefresh) {
//         setRefreshing(true);
//       } else {
//         setLoading(true);
//       }

//       setError("");

//       const response = await getRentalById(rentalId);

//       const rentalData =
//         response?.data?.data ||
//         response?.data?.rental ||
//         response?.data ||
//         response?.rental ||
//         null;

//       setRental(rentalData);
//     } catch (err) {
//       console.error("Rental return load error:", err);

//       setError(getApiError(err));
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     if (!rentalId) {
//       setError("Rental ID is missing.");
//       setLoading(false);
//       return;
//     }

//     loadRental();
//   }, [rentalId]);

//   const formatDate = (date) => {
//     if (!date) return "-";

//     try {
//       return new Date(date).toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       });
//     } catch {
//       return "-";
//     }
//   };

//   const formatCurrency = (amount) => {
//     return Number(amount || 0).toLocaleString("en-IN");
//   };

//   if (loading) {
//     return (
//       <div className="rental-return-page">
//         <div className="rental-return-loading">
//           <div className="rental-return-spinner"></div>
//           <p>Loading return information...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !rental) {
//     return (
//       <div className="rental-return-page">
//         <div className="rental-return-container">
//           <button
//             type="button"
//             className="rental-return-back-btn"
//             onClick={() => navigate(-1)}
//           >
//             <ArrowLeft size={18} />
//             Back
//           </button>

//           <div className="rental-return-error">
//             <AlertCircle size={42} />

//             <h2>Unable to load rental</h2>

//             <p>{error}</p>

//             <button
//               type="button"
//               onClick={() => loadRental()}
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const status = rental?.status || "PENDING";
//   const returnInfo = getReturnMessage(status);

//   return (
//     <div className="rental-return-page">
//       <div className="rental-return-container">

//         {/* HEADER */}
//         <div className="rental-return-header">
//           <div>
//             <button
//               type="button"
//               className="rental-return-back-btn"
//               onClick={() => navigate(-1)}
//             >
//               <ArrowLeft size={18} />
//               Back
//             </button>

//             <h1>Rental Return</h1>

//             <p>
//               Return and settlement information for your rental.
//             </p>
//           </div>

//           <button
//             type="button"
//             className="rental-return-refresh-btn"
//             onClick={() => loadRental(true)}
//             disabled={refreshing}
//           >
//             <RefreshCw
//               size={17}
//               className={
//                 refreshing
//                   ? "rental-return-refresh-icon"
//                   : ""
//               }
//             />
//             Refresh
//           </button>
//         </div>

//         {/* ERROR */}
//         {error && rental && (
//           <div className="rental-return-alert">
//             <AlertCircle size={18} />
//             <span>{error}</span>
//           </div>
//         )}

//         {/* STATUS CARD */}
//         <div
//           className={`rental-return-status-card ${returnInfo.type}`}
//         >
//           <div className="rental-return-status-icon">
//             {returnInfo.type === "returned" ||
//             returnInfo.type === "completed" ? (
//               <CheckCircle size={30} />
//             ) : returnInfo.type === "requested" ||
//               returnInfo.type === "settlement" ? (
//               <Clock size={30} />
//             ) : (
//               <PackageCheck size={30} />
//             )}
//           </div>

//           <div className="rental-return-status-content">
//             <span className="rental-return-status-label">
//               Current Status
//             </span>

//             <h2>{returnInfo.title}</h2>

//             <p>{returnInfo.message}</p>
//           </div>
//         </div>

//         {/* RENTAL INFORMATION */}
//         <div className="rental-return-card">
//           <div className="rental-return-card-header">
//             <div>
//               <h2>Rental Information</h2>
//               <p>Your rental details</p>
//             </div>

//             <span className="rental-return-number">
//               {rental?.rentalNumber ||
//                 `#${rental?._id || rentalId}`}
//             </span>
//           </div>

//           <div className="rental-return-info-grid">
//             <div className="rental-return-info-item">
//               <span>Rental Status</span>

//               <strong>
//                 {getStatusText(status)}
//               </strong>
//             </div>

//             <div className="rental-return-info-item">
//               <span>Monthly Rent</span>

//               <strong>
//                 ₹{formatCurrency(rental?.monthlyRent)}
//               </strong>
//             </div>

//             <div className="rental-return-info-item">
//               <span>Security Deposit</span>

//               <strong>
//                 ₹{formatCurrency(rental?.securityDeposit)}
//               </strong>
//             </div>

//             <div className="rental-return-info-item">
//               <span>Rental Months</span>

//               <strong>
//                 {rental?.rentalMonths || "-"} Months
//               </strong>
//             </div>

//             <div className="rental-return-info-item">
//               <span>Start Date</span>

//               <strong>
//                 {formatDate(rental?.startDate)}
//               </strong>
//             </div>

//             <div className="rental-return-info-item">
//               <span>Expected End Date</span>

//               <strong>
//                 {formatDate(rental?.expectedEndDate)}
//               </strong>
//             </div>

//             <div className="rental-return-info-item">
//               <span>Actual Return Date</span>

//               <strong>
//                 {formatDate(rental?.actualReturnDate)}
//               </strong>
//             </div>

//             <div className="rental-return-info-item">
//               <span>Next Payment Date</span>

//               <strong>
//                 {formatDate(rental?.nextPaymentDate)}
//               </strong>
//             </div>
//           </div>
//         </div>

//         {/* RETURN DETAILS */}
//         {(status === "RETURNED" ||
//           status === "SETTLEMENT_PENDING" ||
//           status === "COMPLETED") && (
//           <div className="rental-return-card">
//             <div className="rental-return-card-header">
//               <div>
//                 <h2>Return & Settlement</h2>
//                 <p>Equipment return details</p>
//               </div>
//             </div>

//             <div className="rental-return-info-grid">
//               <div className="rental-return-info-item">
//                 <span>Return Condition</span>

//                 <strong>
//                   {getStatusText(
//                     rental?.returnCondition
//                   )}
//                 </strong>
//               </div>

//               <div className="rental-return-info-item">
//                 <span>Damage Charges</span>

//                 <strong>
//                   ₹
//                   {formatCurrency(
//                     rental?.damageCharges
//                   )}
//                 </strong>
//               </div>

//               <div className="rental-return-info-item">
//                 <span>Other Deductions</span>

//                 <strong>
//                   ₹
//                   {formatCurrency(
//                     rental?.otherDeductions
//                   )}
//                 </strong>
//               </div>

//               <div className="rental-return-info-item highlight">
//                 <span>Deposit Refund</span>

//                 <strong>
//                   ₹
//                   {formatCurrency(
//                     rental?.depositRefundAmount
//                   )}
//                 </strong>
//               </div>

//               <div className="rental-return-info-item">
//                 <span>Refund Status</span>

//                 <strong>
//                   {getStatusText(
//                     rental?.depositRefundStatus ||
//                       "PENDING"
//                   )}
//                 </strong>
//               </div>

//               <div className="rental-return-info-item">
//                 <span>Actual Return Date</span>

//                 <strong>
//                   {formatDate(
//                     rental?.actualReturnDate
//                   )}
//                 </strong>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* WHAT TO DO */}
//         {status === "ACTIVE" && (
//           <div className="rental-return-instructions">
//             <div className="rental-return-instruction-icon">
//               <PackageCheck size={22} />
//             </div>

//             <div>
//               <h3>Ready to return?</h3>

//               <p>
//                 Please contact the rental team and hand over
//                 the rented equipment. The team will inspect
//                 the equipment and update the return status.
//               </p>
//             </div>
//           </div>
//         )}

//         {status === "RETURN_REQUESTED" && (
//           <div className="rental-return-instructions">
//             <div className="rental-return-instruction-icon">
//               <Clock size={22} />
//             </div>

//             <div>
//               <h3>Return is being processed</h3>

//               <p>
//                 Please wait while the rental team completes
//                 the physical inspection and return process.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* ACTIONS */}
//         <div className="rental-return-actions">
//           <button
//             type="button"
//             className="rental-return-secondary-btn"
//             onClick={() => navigate("/rentals")}
//           >
//             Browse Rentals
//           </button>

//           <button
//             type="button"
//             className="rental-return-primary-btn"
//             onClick={() =>
//               navigate(`/rental/${rental?.productId?._id || rental?.productId}`)
//             }
//           >
//             View Rental Details
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default RentalReturn;


import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
} from "../../services/rentalApi";

import "./RentalReturn.css";

function RentalReturn() {
    const navigate = useNavigate();
    const location = useLocation();
    const { rentalId } = useParams();

    const [rental, setRental] = useState(
        location.state?.rental || null
    );

    const [loading, setLoading] = useState(!location.state?.rental);
    const [submittingReturn, setSubmittingReturn] = useState(false);
    const [submittingSettlement, setSubmittingSettlement] =
        useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ============================================
    // RETURN FORM
    // ============================================

    const [returnCondition, setReturnCondition] =
        useState("GOOD");

    const [pendingRent, setPendingRent] = useState("");
    const [damageCharges, setDamageCharges] = useState("");
    const [otherDeductions, setOtherDeductions] = useState("");
    const [settlementNotes, setSettlementNotes] = useState("");

    // ============================================
    // SETTLEMENT
    // ============================================

    const [settlementPaymentMethod, setSettlementPaymentMethod] =
        useState("CASH");

    const [settlementAmountReceived, setSettlementAmountReceived] =
        useState("");

    const [settlementReference, setSettlementReference] =
        useState("");

    const [settlement, setSettlement] = useState(null);

    // ============================================
    // HELPERS
    // ============================================

    const unwrapResponse = (response) => {
        return (
            response?.data?.data ||
            response?.data?.rental ||
            response?.data ||
            response?.rental ||
            response
        );
    };

    const getCustomerType = () => {
        return String(
            rental?.customerType || "INDIVIDUAL"
        ).toUpperCase();
    };

    const getCustomerName = () => {
        if (getCustomerType() === "COMPANY") {
            return (
                rental?.companyDetails?.contactPerson ||
                rental?.companyDetails?.companyName ||
                rental?.customer?.name ||
                "Company Customer"
            );
        }

        return (
            rental?.individualDetails?.fullName ||
            rental?.customer?.name ||
            rental?.customer?.fullName ||
            "Walk-In Customer"
        );
    };

    const getCustomerPhone = () => {
        if (getCustomerType() === "COMPANY") {
            return (
                rental?.companyDetails?.phone ||
                rental?.customer?.phone ||
                "-"
            );
        }

        return (
            rental?.individualDetails?.phone ||
            rental?.customer?.phone ||
            "-"
        );
    };

    const getCustomerEmail = () => {
        if (getCustomerType() === "COMPANY") {
            return (
                rental?.companyDetails?.email ||
                rental?.customer?.email ||
                "-"
            );
        }

        return (
            rental?.individualDetails?.email ||
            rental?.customer?.email ||
            "-"
        );
    };

    const getProductName = () => {
        return (
            rental?.product?.name ||
            rental?.product?.title ||
            rental?.productId?.name ||
            rental?.productId?.title ||
            rental?.rentalProduct?.product?.name ||
            rental?.rentalProduct?.name ||
            rental?.rentalProduct?.title ||
            "Rental Laptop"
        );
    };

    const getProductBrand = () => {
        const brand =
            rental?.product?.brand ||
            rental?.productId?.brand ||
            rental?.rentalProduct?.product?.brand;

        if (typeof brand === "object") {
            return (
                brand?.name ||
                brand?.title ||
                ""
            );
        }

        return brand || "";
    };

    const getMonthlyRent = () => {
        return Number(
            rental?.monthlyRent ||
            rental?.rentalProduct?.monthlyRent ||
            0
        );
    };

    const getSecurityDeposit = () => {
        return Number(
            rental?.securityDeposit || 0
        );
    };

    const getGSTPercentage = () => {
        return Number(
            rental?.gstPercentage ||
            rental?.gst ||
            0
        );
    };

    const getRentalDurationType = () => {
        return String(
            rental?.rentalDurationType ||
            "MONTHS"
        ).toUpperCase();
    };

    const getRentalDuration = () => {
        return Number(
            rental?.rentalDuration ||
            rental?.rentalMonths ||
            1
        );
    };

    const getDailyRent = () => {
        const monthlyRent = getMonthlyRent();

        return monthlyRent / 30;
    };

    const formatMoney = (value) => {
        return Number(value || 0).toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2,
            }
        );
    };

    const formatDate = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatDateTime = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleString("en-IN");
    };

    // ============================================
    // LOAD RENTAL
    // ============================================

    const loadRental = async () => {
        try {
            setLoading(true);
            setError("");

            if (!rentalId) {
                throw new Error(
                    "Rental ID is missing"
                );
            }

            const response =
                await getRentalById(rentalId);

            console.log(
                "RENTAL RETURN DETAILS:",
                response
            );

            const data =
                unwrapResponse(response);

            if (!data) {
                throw new Error(
                    "Rental details not found"
                );
            }

            setRental(data);
        } catch (err) {
            console.error(
                "LOAD RENTAL RETURN ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load rental details"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!rentalId) {
            setError("Rental ID is missing");
            setLoading(false);
            return;
        }

        if (!location.state?.rental) {
            loadRental();
        }
    }, [rentalId]);

    // ============================================
    // CALCULATIONS
    // ============================================

    const calculated = useMemo(() => {
        const pending =
            Number(pendingRent) || 0;

        const damage =
            Number(damageCharges) || 0;

        const other =
            Number(otherDeductions) || 0;

        const deposit =
            getSecurityDeposit();

        const gstPercentage =
            getGSTPercentage();

        const pendingRentGST =
            pending * gstPercentage / 100;

        const totalPendingRent =
            pending + pendingRentGST;

        const totalDeductions =
            totalPendingRent +
            damage +
            other;

        const depositBalance =
            deposit - totalDeductions;

        const refundAmount =
            depositBalance > 0
                ? depositBalance
                : 0;

        const extraPayableAmount =
            depositBalance < 0
                ? Math.abs(depositBalance)
                : 0;

        return {
            pending,
            damage,
            other,
            deposit,
            gstPercentage,
            pendingRentGST,
            totalPendingRent,
            totalDeductions,
            depositBalance,
            refundAmount,
            extraPayableAmount,
        };
    }, [
        pendingRent,
        damageCharges,
        otherDeductions,
        rental,
    ]);

    // ============================================
    // RETURN API
    // ============================================

    const handleReturn = async (event) => {
        event.preventDefault();

        try {
            setSubmittingReturn(true);
            setError("");
            setSuccess("");

            if (!rentalId) {
                throw new Error(
                    "Rental ID is missing"
                );
            }

            const pending =
                Number(pendingRent) || 0;

            const damage =
                Number(damageCharges) || 0;

            const other =
                Number(otherDeductions) || 0;

            if (pending < 0) {
                throw new Error(
                    "Pending rent cannot be negative"
                );
            }

            if (damage < 0) {
                throw new Error(
                    "Damage charges cannot be negative"
                );
            }

            if (other < 0) {
                throw new Error(
                    "Other deductions cannot be negative"
                );
            }

            const payload = {
                returnCondition,
                pendingRent: pending,
                damageCharges: damage,
                otherDeductions: other,
                settlementNotes:
                    settlementNotes.trim(),
            };

            console.log(
                "MARK RENTAL RETURN PAYLOAD:",
                payload
            );

            const response =
                await markRentalReturned(
                    rentalId,
                    payload
                );

            console.log(
                "MARK RENTAL RETURN RESPONSE:",
                response
            );

            const result =
                unwrapResponse(response);

            const returnedRental =
                result?.rental ||
                result?.data ||
                result ||
                rental;

            setRental(returnedRental);

            const settlementData =
                result?.settlement ||
                returnedRental?.settlement ||
                {
                    securityDeposit:
                        calculated.deposit,

                    pendingRent:
                        calculated.pending,

                    pendingRentGST:
                        calculated.pendingRentGST,

                    totalPendingRent:
                        calculated.totalPendingRent,

                    totalDeductions:
                        calculated.totalDeductions,

                    depositBalance:
                        calculated.depositBalance,

                    depositRefundAmount:
                        calculated.refundAmount,

                    extraPayableAmount:
                        calculated.extraPayableAmount,
                };

            setSettlement(
                settlementData
            );

            if (
                Number(
                    settlementData?.extraPayableAmount
                ) > 0
            ) {
                setSettlementAmountReceived(
                    String(
                        settlementData.extraPayableAmount
                    )
                );
            } else {
                setSettlementAmountReceived("0");
            }

            setSuccess(
                "Laptop returned successfully. Please complete the customer settlement."
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } catch (err) {
            console.error(
                "MARK RETURN ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Failed to process rental return"
            );
        } finally {
            setSubmittingReturn(false);
        }
    };

    // ============================================
    // SETTLEMENT API
    // ============================================

    const handleSettlement = async () => {
        try {
            setSubmittingSettlement(true);
            setError("");
            setSuccess("");

            if (!rentalId) {
                throw new Error(
                    "Rental ID is missing"
                );
            }

            const refundAmount =
                Number(
                    settlement?.depositRefundAmount ??
                    settlement?.refundAmount ??
                    calculated.refundAmount
                ) || 0;

            const extraPayableAmount =
                Number(
                    settlement?.extraPayableAmount ??
                    calculated.extraPayableAmount
                ) || 0;

            const amountReceived =
                Number(
                    settlementAmountReceived
                ) || 0;

            if (
                extraPayableAmount > 0 &&
                amountReceived < extraPayableAmount
            ) {
                throw new Error(
                    `Customer must pay ₹${formatMoney(
                        extraPayableAmount
                    )}`
                );
            }

            if (
                extraPayableAmount > 0 &&
                settlementPaymentMethod === "NONE"
            ) {
                throw new Error(
                    "Please select a payment method"
                );
            }

            const payload = {
                settlementPaymentMethod:
                    extraPayableAmount > 0
                        ? settlementPaymentMethod
                        : "NONE",

                settlementAmountReceived:
                    amountReceived,

                settlementReference:
                    settlementReference.trim(),

                settlementNotes:
                    settlementNotes.trim(),
            };

            console.log(
                "COMPLETE SETTLEMENT PAYLOAD:",
                payload
            );

            const response =
                await completeRentalSettlement(
                    rentalId,
                    payload
                );

            console.log(
                "COMPLETE SETTLEMENT RESPONSE:",
                response
            );

            const result =
                unwrapResponse(response);

            setRental(
                result?.rental ||
                result
            );

            setSuccess(
                refundAmount > 0
                    ? `Rental completed successfully. Refund ₹${formatMoney(
                        refundAmount
                    )} to customer.`
                    : "Rental settlement completed successfully."
            );

            setSettlement({
                ...(settlement || {}),
                ...(result?.settlement || {}),
                settlementStatus: "SETTLED",
            });

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } catch (err) {
            console.error(
                "COMPLETE SETTLEMENT ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Failed to complete settlement"
            );
        } finally {
            setSubmittingSettlement(false);
        }
    };

    // ============================================
    // BACK
    // ============================================

    const handleBack = () => {
        navigate(
            `/receptionist-dashboard/rental/orders/${rentalId}`
        );
    };

    // ============================================
    // LOADING
    // ============================================

    if (loading) {
        return (
            <div className="rental-return-page">
                <div className="rental-return-loading">
                    <Loader2
                        size={35}
                        className="spin"
                    />

                    <p>
                        Loading rental details...
                    </p>
                </div>
            </div>
        );
    }

    // ============================================
    // NO RENTAL
    // ============================================

    if (!rental) {
        return (
            <div className="rental-return-page">
                <div className="rental-return-error">
                    <CircleAlert size={30} />

                    <h3>
                        Rental Not Found
                    </h3>

                    <p>
                        {error ||
                            "Unable to load rental details."}
                    </p>

                    <button
                        onClick={loadRental}
                        className="return-secondary-btn"
                    >
                        <RefreshCw size={17} />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // ============================================
    // STATUS
    // ============================================

    const status = String(
        rental?.status || "ACTIVE"
    ).toUpperCase();

    const isSettlementPending =
        status === "SETTLEMENT_PENDING" ||
        Boolean(settlement);

    const isCompleted =
        status === "COMPLETED" ||
        String(
            settlement?.settlementStatus || ""
        ).toUpperCase() === "SETTLED";

    // ============================================
    // SETTLEMENT VALUES
    // ============================================

    const settlementDeposit =
        Number(
            settlement?.securityDeposit ??
            calculated.deposit
        ) || 0;

    const settlementPendingRent =
        Number(
            settlement?.pendingRent ??
            calculated.pending
        ) || 0;

    const settlementGST =
        Number(
            settlement?.pendingRentGST ??
            calculated.pendingRentGST
        ) || 0;

    const settlementTotalRent =
        Number(
            settlement?.totalPendingRent ??
            calculated.totalPendingRent
        ) || 0;

    const settlementDamage =
        Number(
            settlement?.damageCharges ??
            calculated.damage
        ) || 0;

    const settlementOther =
        Number(
            settlement?.otherDeductions ??
            calculated.other
        ) || 0;

    const settlementDeductions =
        Number(
            settlement?.totalDeductions ??
            calculated.totalDeductions
        ) || 0;

    const settlementRefund =
        Number(
            settlement?.depositRefundAmount ??
            settlement?.refundAmount ??
            calculated.refundAmount
        ) || 0;

    const settlementExtra =
        Number(
            settlement?.extraPayableAmount ??
            calculated.extraPayableAmount
        ) || 0;

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className="rental-return-page">

            {/* ======================================
                TOP HEADER
            ====================================== */}

            <div className="rental-return-header">

                <div>
                    <button
                        className="back-button"
                        onClick={handleBack}
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <h1>
                        Rental Return & Settlement
                    </h1>

                    <p>
                        Receive laptop, calculate
                        deductions and complete
                        customer settlement.
                    </p>
                </div>

                <div
                    className={`return-status-badge ${status.toLowerCase()}`}
                >
                    {status}
                </div>

            </div>

            {/* ======================================
                ALERTS
            ====================================== */}

            {error && (
                <div className="return-alert error">
                    <CircleAlert size={20} />

                    <div>
                        <strong>
                            Error
                        </strong>

                        <p>
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {success && (
                <div className="return-alert success">
                    <CheckCircle2 size={20} />

                    <div>
                        <strong>
                            Success
                        </strong>

                        <p>
                            {success}
                        </p>
                    </div>
                </div>
            )}

            {/* ======================================
                COMPLETED
            ====================================== */}

            {isCompleted && (
                <div className="completed-banner">

                    <CheckCircle2 size={32} />

                    <div>
                        <h2>
                            Rental Completed
                        </h2>

                        <p>
                            Settlement has been completed
                            and the laptop is now released
                            back to rental inventory.
                        </p>
                    </div>

                </div>
            )}

            {/* ======================================
                CUSTOMER + PRODUCT
            ====================================== */}

            <div className="return-grid">

                {/* CUSTOMER */}

                <div className="return-card">

                    <div className="return-card-header">
                        <div className="return-card-icon">
                            <User size={20} />
                        </div>

                        <div>
                            <h2>
                                Customer Details
                            </h2>

                            <span>
                                {getCustomerType()}
                            </span>
                        </div>
                    </div>

                    <div className="details-list">

                        <div className="detail-row">
                            <span>
                                Name
                            </span>

                            <strong>
                                {getCustomerName()}
                            </strong>
                        </div>

                        <div className="detail-row">
                            <span>
                                Phone
                            </span>

                            <strong>
                                <Phone size={15} />
                                {getCustomerPhone()}
                            </strong>
                        </div>

                        <div className="detail-row">
                            <span>
                                Email
                            </span>

                            <strong>
                                {getCustomerEmail()}
                            </strong>
                        </div>

                        {getCustomerType() ===
                            "COMPANY" && (
                            <div className="detail-row">
                                <span>
                                    Company
                                </span>

                                <strong>
                                    {rental
                                        ?.companyDetails
                                        ?.companyName ||
                                        "-"}
                                </strong>
                            </div>
                        )}

                    </div>

                </div>

                {/* PRODUCT */}

                <div className="return-card">

                    <div className="return-card-header">
                        <div className="return-card-icon">
                            <Laptop size={20} />
                        </div>

                        <div>
                            <h2>
                                Rental Laptop
                            </h2>

                            <span>
                                Rental ID: #
                                {String(
                                    rentalId
                                ).slice(-8)}
                            </span>
                        </div>
                    </div>

                    <div className="details-list">

                        <div className="detail-row">
                            <span>
                                Laptop
                            </span>

                            <strong>
                                {getProductName()}
                            </strong>
                        </div>

                        <div className="detail-row">
                            <span>
                                Brand
                            </span>

                            <strong>
                                {getProductBrand() ||
                                    "-"}
                            </strong>
                        </div>

                        <div className="detail-row">
                            <span>
                                Start Date
                            </span>

                            <strong>
                                <CalendarDays
                                    size={15}
                                />
                                {formatDate(
                                    rental?.startDate
                                )}
                            </strong>
                        </div>

                        <div className="detail-row">
                            <span>
                                Expected End
                            </span>

                            <strong>
                                {formatDate(
                                    rental?.expectedEndDate
                                )}
                            </strong>
                        </div>

                    </div>

                </div>

            </div>

            {/* ======================================
                RENTAL FINANCIAL DETAILS
            ====================================== */}

            <div className="return-card financial-card">

                <div className="return-card-header">

                    <div className="return-card-icon">
                        <IndianRupee size={20} />
                    </div>

                    <div>
                        <h2>
                            Rental Financial Details
                        </h2>

                        <span>
                            Current rental agreement
                        </span>
                    </div>

                </div>

                <div className="financial-grid">

                    <div className="financial-item">
                        <span>
                            Rent Basis
                        </span>

                        <strong>
                            {getRentalDurationType() ===
                                "DAYS"
                                ? "Daily"
                                : "Monthly"}
                        </strong>
                    </div>

                    <div className="financial-item">
                        <span>
                            Duration
                        </span>

                        <strong>
                            {getRentalDuration()}{" "}
                            {getRentalDurationType() ===
                            "DAYS"
                                ? "Day(s)"
                                : "Month(s)"}
                        </strong>
                    </div>

                    <div className="financial-item">
                        <span>
                            Monthly Rent
                        </span>

                        <strong>
                            ₹{" "}
                            {formatMoney(
                                getMonthlyRent()
                            )}
                        </strong>
                    </div>

                    {getRentalDurationType() ===
                        "DAYS" && (
                        <div className="financial-item">
                            <span>
                                Approx. Daily Rent
                            </span>

                            <strong>
                                ₹{" "}
                                {formatMoney(
                                    getDailyRent()
                                )}
                            </strong>
                        </div>
                    )}

                    <div className="financial-item">
                        <span>
                            GST
                        </span>

                        <strong>
                            {getGSTPercentage()}%
                        </strong>
                    </div>

                    <div className="financial-item deposit">
                        <span>
                            Security Deposit
                        </span>

                        <strong>
                            ₹{" "}
                            {formatMoney(
                                getSecurityDeposit()
                            )}
                        </strong>
                    </div>

                </div>

            </div>

            {/* ======================================
                RETURN FORM
            ====================================== */}

            {!isSettlementPending &&
                !isCompleted && (
                    <form
                        className="return-card return-form-card"
                        onSubmit={handleReturn}
                    >

                        <div className="return-card-header">

                            <div className="return-card-icon">
                                <RefreshCw size={20} />
                            </div>

                            <div>
                                <h2>
                                    Receive Laptop
                                </h2>

                                <span>
                                    Check physical condition
                                    before completing return.
                                </span>
                            </div>

                        </div>

                        {/* CONDITION */}

                        <div className="form-section">

                            <label>
                                Laptop Condition
                            </label>

                            <div className="condition-grid">

                                <button
                                    type="button"
                                    className={
                                        `condition-option ${
                                            returnCondition ===
                                            "GOOD"
                                                ? "selected good"
                                                : ""
                                        }`
                                    }
                                    onClick={() =>
                                        setReturnCondition(
                                            "GOOD"
                                        )
                                    }
                                >
                                    <CheckCircle2
                                        size={23}
                                    />

                                    <span>
                                        GOOD
                                    </span>

                                    <small>
                                        No damage
                                    </small>
                                </button>

                                <button
                                    type="button"
                                    className={
                                        `condition-option ${
                                            returnCondition ===
                                            "DAMAGED"
                                                ? "selected damaged"
                                                : ""
                                        }`
                                    }
                                    onClick={() =>
                                        setReturnCondition(
                                            "DAMAGED"
                                        )
                                    }
                                >
                                    <CircleAlert
                                        size={23}
                                    />

                                    <span>
                                        DAMAGED
                                    </span>

                                    <small>
                                        Minor damage
                                    </small>
                                </button>

                                <button
                                    type="button"
                                    className={
                                        `condition-option ${
                                            returnCondition ===
                                            "HEAVILY_DAMAGED"
                                                ? "selected heavy"
                                                : ""
                                        }`
                                    }
                                    onClick={() =>
                                        setReturnCondition(
                                            "HEAVILY_DAMAGED"
                                        )
                                    }
                                >
                                    <CircleAlert
                                        size={23}
                                    />

                                    <span>
                                        HEAVILY DAMAGED
                                    </span>

                                    <small>
                                        Major damage
                                    </small>
                                </button>

                                <button
                                    type="button"
                                    className={
                                        `condition-option ${
                                            returnCondition ===
                                            "MISSING"
                                                ? "selected missing"
                                                : ""
                                        }`
                                    }
                                    onClick={() =>
                                        setReturnCondition(
                                            "MISSING"
                                        )
                                    }
                                >
                                    <CircleAlert
                                        size={23}
                                    />

                                    <span>
                                        MISSING
                                    </span>

                                    <small>
                                        Laptop not returned
                                    </small>
                                </button>

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
                                        Pending Rent
                                    </label>

                                    <div className="money-input">
                                        <span>₹</span>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={
                                                pendingRent
                                            }
                                            onChange={(e) =>
                                                setPendingRent(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="0"
                                        />
                                    </div>

                                    <small>
                                        Enter unpaid rent
                                        amount.
                                    </small>

                                </div>

                                <div className="input-group">

                                    <label>
                                        Damage Charges
                                    </label>

                                    <div className="money-input">
                                        <span>₹</span>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={
                                                damageCharges
                                            }
                                            onChange={(e) =>
                                                setDamageCharges(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="0"
                                        />
                                    </div>

                                    <small>
                                        Repair / damage
                                        deduction.
                                    </small>

                                </div>

                                <div className="input-group">

                                    <label>
                                        Other Deductions
                                    </label>

                                    <div className="money-input">
                                        <span>₹</span>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={
                                                otherDeductions
                                            }
                                            onChange={(e) =>
                                                setOtherDeductions(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="0"
                                        />
                                    </div>

                                    <small>
                                        Any other deduction.
                                    </small>

                                </div>

                            </div>

                        </div>

                        {/* NOTES */}

                        <div className="form-section">

                            <label>
                                Settlement Notes
                            </label>

                            <textarea
                                value={
                                    settlementNotes
                                }
                                onChange={(e) =>
                                    setSettlementNotes(
                                        e.target.value
                                    )
                                }
                                rows={4}
                                placeholder="Enter return condition notes, damage details or any other information..."
                            />

                        </div>

                        {/* LIVE CALCULATION */}

                        <div className="calculation-box">

                            <div className="calculation-row">
                                <span>
                                    Security Deposit
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        calculated.deposit
                                    )}
                                </strong>
                            </div>

                            <div className="calculation-row">
                                <span>
                                    Pending Rent
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        calculated.pending
                                    )}
                                </strong>
                            </div>

                            <div className="calculation-row">
                                <span>
                                    Rent GST
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        calculated.pendingRentGST
                                    )}
                                </strong>
                            </div>

                            <div className="calculation-row">
                                <span>
                                    Damage Charges
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        calculated.damage
                                    )}
                                </strong>
                            </div>

                            <div className="calculation-row">
                                <span>
                                    Other Deductions
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        calculated.other
                                    )}
                                </strong>
                            </div>

                            <div className="calculation-divider" />

                            <div className="calculation-row total">
                                <span>
                                    Total Deductions
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        calculated.totalDeductions
                                    )}
                                </strong>
                            </div>

                            {calculated.refundAmount >
                                0 ? (
                                <div className="settlement-result refund">

                                    <CheckCircle2
                                        size={25}
                                    />

                                    <div>
                                        <span>
                                            Customer Refund
                                        </span>

                                        <strong>
                                            ₹{" "}
                                            {formatMoney(
                                                calculated.refundAmount
                                            )}
                                        </strong>
                                    </div>

                                </div>
                            ) : calculated.extraPayableAmount >
                              0 ? (
                                <div className="settlement-result payable">

                                    <CircleAlert
                                        size={25}
                                    />

                                    <div>
                                        <span>
                                            Customer Has To Pay
                                        </span>

                                        <strong>
                                            ₹{" "}
                                            {formatMoney(
                                                calculated.extraPayableAmount
                                            )}
                                        </strong>
                                    </div>

                                </div>
                            ) : (
                                <div className="settlement-result settled">

                                    <CheckCircle2
                                        size={25}
                                    />

                                    <div>
                                        <span>
                                            Settlement Balance
                                        </span>

                                        <strong>
                                            ₹ 0
                                        </strong>
                                    </div>

                                </div>
                            )}

                        </div>

                        {/* SUBMIT */}

                        <div className="form-actions">

                            <button
                                type="button"
                                className="return-secondary-btn"
                                onClick={handleBack}
                                disabled={
                                    submittingReturn
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="return-primary-btn"
                                disabled={
                                    submittingReturn
                                }
                            >
                                {submittingReturn ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="spin"
                                        />

                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw
                                            size={18}
                                        />

                                        Receive Laptop
                                    </>
                                )}
                            </button>

                        </div>

                    </form>
                )}

            {/* ======================================
                SETTLEMENT CARD
            ====================================== */}

            {isSettlementPending &&
                !isCompleted && (
                    <div className="return-card settlement-card">

                        <div className="return-card-header">

                            <div className="return-card-icon">
                                <ShieldCheck size={20} />
                            </div>

                            <div>
                                <h2>
                                    Customer Settlement
                                </h2>

                                <span>
                                    Complete payment/refund
                                    before closing rental.
                                </span>
                            </div>

                        </div>

                        {/* SETTLEMENT CALCULATION */}

                        <div className="settlement-summary">

                            <div className="settlement-summary-row">
                                <span>
                                    Security Deposit
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        settlementDeposit
                                    )}
                                </strong>
                            </div>

                            <div className="settlement-summary-row">
                                <span>
                                    Pending Rent
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        settlementPendingRent
                                    )}
                                </strong>
                            </div>

                            <div className="settlement-summary-row">
                                <span>
                                    Rent GST
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        settlementGST
                                    )}
                                </strong>
                            </div>

                            <div className="settlement-summary-row">
                                <span>
                                    Total Rent Due
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        settlementTotalRent
                                    )}
                                </strong>
                            </div>

                            <div className="settlement-summary-row">
                                <span>
                                    Damage Charges
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        settlementDamage
                                    )}
                                </strong>
                            </div>

                            <div className="settlement-summary-row">
                                <span>
                                    Other Deductions
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        settlementOther
                                    )}
                                </strong>
                            </div>

                            <div className="settlement-summary-row total">
                                <span>
                                    Total Deductions
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        settlementDeductions
                                    )}
                                </strong>
                            </div>

                        </div>

                        {/* REFUND */}

                        {settlementRefund > 0 && (
                            <div className="refund-box">

                                <CheckCircle2
                                    size={28}
                                />

                                <div>
                                    <span>
                                        Refund Customer
                                    </span>

                                    <strong>
                                        ₹{" "}
                                        {formatMoney(
                                            settlementRefund
                                        )}
                                    </strong>

                                    <small>
                                        Security deposit
                                        balance will be
                                        refunded.
                                    </small>
                                </div>

                            </div>
                        )}

                        {/* EXTRA PAYMENT */}

                        {settlementExtra > 0 && (
                            <div className="extra-payment-box">

                                <CircleAlert
                                    size={28}
                                />

                                <div>
                                    <span>
                                        Customer Payment Required
                                    </span>

                                    <strong>
                                        ₹{" "}
                                        {formatMoney(
                                            settlementExtra
                                        )}
                                    </strong>

                                    <small>
                                        Customer must pay
                                        this amount before
                                        rental can be
                                        completed.
                                    </small>
                                </div>

                            </div>
                        )}

                        {/* PAYMENT */}

                        {settlementExtra > 0 && (
                            <div className="settlement-payment-section">

                                <h3>
                                    Payment Details
                                </h3>

                                <div className="charges-grid">

                                    <div className="input-group">

                                        <label>
                                            Payment Method
                                        </label>

                                        <select
                                            value={
                                                settlementPaymentMethod
                                            }
                                            onChange={(e) =>
                                                setSettlementPaymentMethod(
                                                    e.target.value
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

                                        <label>
                                            Amount Received
                                        </label>

                                        <div className="money-input">
                                            <span>
                                                ₹
                                            </span>

                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={
                                                    settlementAmountReceived
                                                }
                                                onChange={(e) =>
                                                    setSettlementAmountReceived(
                                                        e.target.value
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
                                            onChange={(e) =>
                                                setSettlementReference(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Optional"
                                        />

                                    </div>

                                </div>

                            </div>
                        )}

                        {/* REFUND PAYMENT METHOD NOTE */}

                        {settlementRefund > 0 && (
                            <div className="refund-method-note">

                                <Wallet size={19} />

                                <span>
                                    Refund ₹
                                    {formatMoney(
                                        settlementRefund
                                    )}{" "}
                                    to the customer according
                                    to your store's refund
                                    process.
                                </span>

                            </div>
                        )}

                        {/* NOTES */}

                        <div className="form-section">

                            <label>
                                Settlement Notes
                            </label>

                            <textarea
                                value={
                                    settlementNotes
                                }
                                onChange={(e) =>
                                    setSettlementNotes(
                                        e.target.value
                                    )
                                }
                                rows={3}
                                placeholder="Settlement notes..."
                            />

                        </div>

                        {/* COMPLETE */}

                        <div className="form-actions">

                            <button
                                type="button"
                                className="return-secondary-btn"
                                onClick={handleBack}
                                disabled={
                                    submittingSettlement
                                }
                            >
                                Back
                            </button>

                            <button
                                type="button"
                                className="return-primary-btn complete-btn"
                                onClick={
                                    handleSettlement
                                }
                                disabled={
                                    submittingSettlement
                                }
                            >
                                {submittingSettlement ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="spin"
                                        />

                                        Completing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2
                                            size={18}
                                        />

                                        Complete Settlement
                                    </>
                                )}
                            </button>

                        </div>

                    </div>
                )}

            {/* ======================================
                COMPLETED SUMMARY
            ====================================== */}

            {isCompleted && (
                <div className="return-card completed-card">

                    <div className="completed-icon">
                        <CheckCircle2
                            size={45}
                        />
                    </div>

                    <h2>
                        Rental Successfully Completed
                    </h2>

                    <p>
                        Customer settlement is complete.
                        The rental has been closed and the
                        laptop has been released back to
                        available inventory.
                    </p>

                    {settlementRefund > 0 && (
                        <div className="completed-amount refund">
                            <span>
                                Customer Refund
                            </span>

                            <strong>
                                ₹{" "}
                                {formatMoney(
                                    settlementRefund
                                )}
                            </strong>
                        </div>
                    )}

                    {settlementExtra > 0 && (
                        <div className="completed-amount payable">
                            <span>
                                Customer Paid
                            </span>

                            <strong>
                                ₹{" "}
                                {formatMoney(
                                    settlementExtra
                                )}
                            </strong>
                        </div>
                    )}

                    <div className="completed-info">

                        <div>
                            <span>
                                Rental Status
                            </span>

                            <strong>
                                COMPLETED
                            </strong>
                        </div>

                        <div>
                            <span>
                                Customer
                            </span>

                            <strong>
                                {getCustomerName()}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Laptop
                            </span>

                            <strong>
                                {getProductName()}
                            </strong>
                        </div>

                    </div>

                    <div className="form-actions">

                        <button
                            className="return-secondary-btn"
                            onClick={handleBack}
                        >
                            <ArrowLeft size={18} />
                            Rental Details
                        </button>

                        <button
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

export default RentalReturn;

