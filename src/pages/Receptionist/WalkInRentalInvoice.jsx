// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { ArrowLeft, Printer, RefreshCw, X } from "lucide-react";

// import { getRentalById } from "../../services/rentalApi";
// import "./WalkInRentalInvoice.css";

// /*
//  * Props (all optional - used by Admin Invoices page):
//  *  rentalData     -> rental object already loaded by admin page
//  *  isAdminPreview -> true when shown inside admin modal
//  *  onAdminClose   -> function to close admin modal
//  */

// function WalkInRentalInvoice({
//     rentalData = null,
//     isAdminPreview = false,
//     onAdminClose = null,
// }) {
//     const { rentalId: routeRentalId } = useParams();
//     const navigate = useNavigate();
//     const location = useLocation();

//     const initialRental =
//         rentalData || location.state?.rental || null;

//     // id can come from route OR from admin passed data
//     const rentalId =
//         routeRentalId ||
//         rentalData?._id ||
//         rentalData?.id ||
//         rentalData?.rentalId ||
//         "";

//     const [rental, setRental] = useState(initialRental);
//     const [loading, setLoading] = useState(!initialRental);
//     const [error, setError] = useState("");

//     // =====================================================
//     // LOAD RENTAL
//     // =====================================================

//     useEffect(() => {
//         // Admin gave full data -> use it directly, no API call
//         if (rentalData) {
//             setRental(rentalData);
//             setLoading(false);
//             setError("");
//             return;
//         }

//         if (!rentalId) {
//             setError("Rental ID is missing");
//             setLoading(false);
//             return;
//         }

//         loadRental();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [rentalId, rentalData]);

//     const loadRental = async () => {
//         try {
//             setLoading(true);
//             setError("");

//             if (!rentalId) {
//                 throw new Error("Rental ID is missing");
//             }

//             const response = await getRentalById(rentalId);

//             let rentalObj = null;

//             if (response?.data?.data?.rental) {
//                 rentalObj = response.data.data.rental;
//             } else if (response?.data?.data) {
//                 rentalObj = response.data.data;
//             } else if (response?.data?.rental) {
//                 rentalObj = response.data.rental;
//             } else if (response?.rental) {
//                 rentalObj = response.rental;
//             } else if (response?.data) {
//                 rentalObj = response.data;
//             } else if (response?._id) {
//                 rentalObj = response;
//             }

//             if (
//                 rentalObj &&
//                 rentalObj.rental &&
//                 typeof rentalObj.rental === "object"
//             ) {
//                 rentalObj = rentalObj.rental;
//             }

//             if (!rentalObj) {
//                 throw new Error("Rental details could not be found");
//             }

//             setRental(rentalObj);
//         } catch (err) {
//             console.error("RENTAL INVOICE ERROR:", err);

//             // If data already available (state / admin), keep using it
//             const fallback = rentalData || location.state?.rental;

//             if (fallback) {
//                 setRental(fallback);
//                 setError("");
//             } else {
//                 setError(
//                     err?.response?.data?.message ||
//                     err?.message ||
//                     "Failed to load rental invoice"
//                 );
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // =====================================================
//     // HELPERS
//     // =====================================================

//     const getRentalId = () => {
//         return (
//             rental?._id ||
//             rental?.id ||
//             rental?.rentalId ||
//             rentalId ||
//             ""
//         );
//     };

//     const getCustomerType = () => {
//         return String(rental?.customerType || "INDIVIDUAL").toUpperCase();
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
//             rental?.customerName ||
//             "Walk-In Customer"
//         );
//     };

//     const getCompanyName = () => {
//         return rental?.companyDetails?.companyName || "";
//     };

//     const getPhone = () => {
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
//             rental?.phone ||
//             "-"
//         );
//     };

//     const getEmail = () => {
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
//             rental?.email ||
//             "-"
//         );
//     };

//     const getAddress = () => {
//         if (getCustomerType() === "COMPANY") {
//             return (
//                 rental?.companyDetails?.address ||
//                 rental?.customer?.address ||
//                 "-"
//             );
//         }

//         return (
//             rental?.individualDetails?.address ||
//             rental?.customer?.address ||
//             rental?.address ||
//             "-"
//         );
//     };

//     // =====================================================
//     // PRODUCT
//     // =====================================================

//     const getProduct = () => {
//         return (
//             rental?.product ||
//             rental?.rentalProduct?.product ||
//             rental?.rentalProduct ||
//             null
//         );
//     };

//     const getProductName = () => {
//         const product = getProduct();

//         if (typeof product === "string") {
//             return product;
//         }

//         return (
//             product?.name ||
//             product?.title ||
//             rental?.productName ||
//             "Rental Laptop"
//         );
//     };

//     const getBrandName = () => {
//         const product = getProduct();

//         const brand = product?.brand || rental?.brand;

//         if (brand && typeof brand === "object") {
//             return brand?.name || brand?.title || "-";
//         }

//         return brand || "-";
//     };

//     const getModelName = () => {
//         const product = getProduct();

//         return (
//             product?.model ||
//             product?.modelName ||
//             rental?.model ||
//             rental?.modelName ||
//             "-"
//         );
//     };

//     const getSerialNumber = () => {
//         const product = getProduct();

//         return (
//             rental?.serialNumber ||
//             rental?.serialNo ||
//             product?.serialNumber ||
//             product?.serialNo ||
//             "-"
//         );
//     };

//     // =====================================================
//     // AMOUNTS
//     // =====================================================

//     const getMonthlyRent = () => {
//         return Number(
//             rental?.monthlyRent ??
//             rental?.rentalProduct?.monthlyRent ??
//             rental?.rentPerMonth ??
//             rental?.pricing?.monthlyRent ??
//             0
//         );
//     };

//     const getDurationType = () => {
//         return String(
//             rental?.rentalDurationType || "MONTHS"
//         ).toUpperCase();
//     };

//     const getRentalMonths = () => {
//         return Number(
//             rental?.rentalDuration ??
//             rental?.rentalMonths ??
//             rental?.durationMonths ??
//             rental?.months ??
//             1
//         );
//     };

//     const getDurationLabel = () => {
//         const value = getRentalMonths();

//         if (getDurationType() === "DAYS") {
//             return `${value} ${value === 1 ? "Day" : "Days"}`;
//         }

//         return `${value} ${value === 1 ? "Month" : "Months"}`;
//     };

//     const getSecurityDeposit = () => {
//         return Number(
//             rental?.securityDeposit ??
//             rental?.depositAmount ??
//             rental?.securityDepositAmount ??
//             0
//         );
//     };

//     const getGSTPercentage = () => {
//         return Number(
//             rental?.gstPercentage ??
//             rental?.gst ??
//             rental?.taxPercentage ??
//             rental?.pricing?.gstPercentage ??
//             0
//         );
//     };

//     const getRentalAmount = () => {
//         if (getDurationType() === "DAYS") {
//             return (getMonthlyRent() / 30) * getRentalMonths();
//         }

//         return getMonthlyRent() * getRentalMonths();
//     };

//     const getGSTAmount = () =>
//         (getRentalAmount() * getGSTPercentage()) / 100;

//     const getGrandTotal = () => getRentalAmount() + getGSTAmount();

//     // =====================================================
//     // STATUS / PAYMENT
//     // =====================================================

//     const getStatus = () => {
//         return String(rental?.status || "PENDING").toUpperCase();
//     };

//     const getPaymentMethod = () => {
//         return (
//             rental?.paymentMethod ||
//             rental?.depositPaymentMethod ||
//             rental?.payment?.method ||
//             rental?.payment?.paymentMethod ||
//             "-"
//         );
//     };

//     // =====================================================
//     // FORMATTERS
//     // =====================================================

//     const formatMoney = (value) => {
//         const number = Number(value || 0);

//         return number.toLocaleString("en-IN", {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//         });
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
//             month: "2-digit",
//             year: "numeric",
//         });
//     };

//     // =====================================================
//     // INVOICE NUMBER
//     // =====================================================

//     const invoiceNumber = useMemo(() => {
//         const existingInvoice =
//             rental?.invoiceNumber ||
//             rental?.invoiceNo ||
//             rental?.invoice?.invoiceNumber;

//         if (existingInvoice) {
//             return String(existingInvoice);
//         }

//         const id = String(
//             rental?._id ||
//             rental?.id ||
//             rental?.rentalId ||
//             rentalId ||
//             ""
//         );

//         return `RENT-${id.slice(-8).toUpperCase()}`;
//     }, [rental, rentalId]);

//     // =====================================================
//     // PRINT
//     // =====================================================

//     const handlePrint = () => {
//         requestAnimationFrame(() => {
//             setTimeout(() => {
//                 window.print();
//             }, 300);
//         });
//     };

//     // =====================================================
//     // BACK / CLOSE
//     // =====================================================

//     const handleBack = () => {
//         if (isAdminPreview) {
//             if (typeof onAdminClose === "function") {
//                 onAdminClose();
//             }
//             return;
//         }

//         navigate("/receptionist-dashboard/rental/orders");
//     };

//     // =====================================================
//     // LOADING
//     // =====================================================

//     if (loading) {
//         return (
//             <div className="rental-invoice-loading">
//                 <div className="invoice-loading-spinner" />

//                 <h3>Loading Rental Invoice...</h3>

//                 <p>Please wait while rental details are being loaded.</p>
//             </div>
//         );
//     }

//     // =====================================================
//     // ERROR
//     // =====================================================

//     if (error && !rental) {
//         return (
//             <div className="rental-invoice-error">
//                 <h2>Unable to Load Invoice</h2>

//                 <p>{error}</p>

//                 <div className="invoice-error-actions">
//                     <button type="button" onClick={loadRental}>
//                         <RefreshCw size={17} />
//                         Retry
//                     </button>

//                     <button type="button" onClick={handleBack}>
//                         <ArrowLeft size={17} />
//                         {isAdminPreview ? "Close" : "Back to Rentals"}
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     if (!rental) {
//         return (
//             <div className="rental-invoice-error">
//                 <h2>Rental Not Found</h2>

//                 <button type="button" onClick={handleBack}>
//                     <ArrowLeft size={17} />
//                     {isAdminPreview ? "Close" : "Back to Rentals"}
//                 </button>
//             </div>
//         );
//     }

//     // =====================================================
//     // CALCULATIONS
//     // =====================================================

//     const rentalAmount = getRentalAmount();
//     const gstAmount = getGSTAmount();
//     const grandTotal = getGrandTotal();
//     const securityDeposit = getSecurityDeposit();

//     // =====================================================
//     // RENDER
//     // =====================================================

//     return (
//         <div className="rental-invoice-page">

//             {/* ACTION BAR */}

//             <div className="invoice-topbar no-print">

//                 <button
//                     type="button"
//                     className="invoice-back-btn"
//                     onClick={handleBack}
//                 >
//                     {isAdminPreview ? (
//                         <X size={18} />
//                     ) : (
//                         <ArrowLeft size={18} />
//                     )}
//                     {isAdminPreview ? "Close" : "Back to Rentals"}
//                 </button>

//                 <div className="invoice-top-actions">

//                     {!isAdminPreview && (
//                         <button
//                             type="button"
//                             className="invoice-refresh-btn"
//                             onClick={loadRental}
//                         >
//                             <RefreshCw size={17} />
//                             Refresh
//                         </button>
//                     )}

//                     <button
//                         type="button"
//                         className="invoice-print-btn"
//                         onClick={handlePrint}
//                     >
//                         <Printer size={18} />
//                         Print Invoice
//                     </button>

//                 </div>
//             </div>

//             {/* PRINT AREA */}

//             <main className="rental-invoice-print-area">

//                 <div className="rental-invoice-paper">

//                     {/* HEADER */}

//                     <div className="invoice-header">

//                         <div className="invoice-company">

//                             <h1>ZAID INFOTECH</h1>

//                             <p>Laptop Rental &amp; Technology Solutions</p>

//                             <p>Maharashtra, India</p>

//                         </div>

//                         <div className="invoice-title-box">

//                             <h2>RENTAL INVOICE</h2>

//                             <div className="invoice-number">
//                                 <span>Invoice No.</span>
//                                 <strong>{invoiceNumber}</strong>
//                             </div>

//                             <div className="invoice-date">
//                                 <span>Invoice Date</span>

//                                 <strong>
//                                     {formatDate(
//                                         rental?.createdAt ||
//                                         rental?.createdDate ||
//                                         rental?.date
//                                     )}
//                                 </strong>
//                             </div>

//                         </div>

//                     </div>

//                     <div className="invoice-divider" />

//                     {/* CUSTOMER + RENTAL */}

//                     <div className="invoice-info-grid">

//                         <div className="invoice-info-card">

//                             <h3>BILL TO</h3>

//                             <strong className="invoice-customer-name">
//                                 {getCustomerName()}
//                             </strong>

//                             {getCompanyName() && <p>{getCompanyName()}</p>}

//                             <p>
//                                 <b>Phone:</b> {getPhone()}
//                             </p>

//                             <p>
//                                 <b>Email:</b> {getEmail()}
//                             </p>

//                             <p>
//                                 <b>Address:</b> {getAddress()}
//                             </p>

//                         </div>

//                         <div className="invoice-info-card">

//                             <h3>RENTAL DETAILS</h3>

//                             <p>
//                                 <b>Rental ID:</b> #
//                                 {String(getRentalId()).slice(-8)}
//                             </p>

//                             <p>
//                                 <b>Source:</b>{" "}
//                                 {String(
//                                     rental?.rentalSource || "WALK_IN"
//                                 ).replace(/_/g, " ")}
//                             </p>

//                             <p>
//                                 <b>Status:</b>{" "}
//                                 <span
//                                     className={`invoice-status ${getStatus().toLowerCase()}`}
//                                 >
//                                     {getStatus()}
//                                 </span>
//                             </p>

//                             <p>
//                                 <b>Payment:</b> {getPaymentMethod()}
//                             </p>

//                         </div>

//                     </div>

//                     {/* PRODUCT */}

//                     <div className="invoice-section-title">
//                         RENTAL PRODUCT
//                     </div>

//                     <div className="invoice-table-wrapper">

//                         <table className="invoice-table">

//                             <thead>
//                                 <tr>
//                                     <th>#</th>
//                                     <th>Description</th>
//                                     <th>Brand</th>
//                                     <th>Model</th>
//                                     <th>Duration</th>
//                                     <th>Monthly Rent</th>
//                                     <th>Amount</th>
//                                 </tr>
//                             </thead>

//                             <tbody>

//                                 <tr>

//                                     <td>1</td>

//                                     <td>
//                                         <strong>{getProductName()}</strong>

//                                         <small className="invoice-product-sub">
//                                             Serial No: {getSerialNumber()}
//                                         </small>
//                                     </td>

//                                     <td>{getBrandName()}</td>

//                                     <td>{getModelName()}</td>

//                                     <td>
//                                         {getDurationLabel()}
//                                     </td>

//                                     <td>
//                                         ₹ {formatMoney(getMonthlyRent())}
//                                     </td>

//                                     <td>
//                                         <strong>
//                                             ₹ {formatMoney(rentalAmount)}
//                                         </strong>
//                                     </td>

//                                 </tr>

//                             </tbody>

//                         </table>

//                     </div>

//                     {/* SUMMARY */}

//                     <div className="invoice-summary-area">

//                         <div className="invoice-notes">

//                             <h3>NOTES</h3>

//                             <p>
//                                 This invoice is generated for the above
//                                 walk-in rental transaction.
//                             </p>

//                             <p>
//                                 Security deposit is refundable subject to
//                                 rental return conditions and applicable
//                                 deductions.
//                             </p>

//                         </div>

//                         <div className="invoice-total-box">

//                             <div className="invoice-total-row">
//                                 <span>Rental Amount</span>
//                                 <strong>₹ {formatMoney(rentalAmount)}</strong>
//                             </div>

//                             <div className="invoice-total-row">
//                                 <span>GST ({getGSTPercentage()}%)</span>
//                                 <strong>₹ {formatMoney(gstAmount)}</strong>
//                             </div>

//                             <div className="invoice-total-row deposit-row">
//                                 <span>Security Deposit</span>
//                                 <strong>₹ {formatMoney(securityDeposit)}</strong>
//                             </div>

//                             <div className="invoice-total-divider" />

//                             <div className="invoice-grand-total">
//                                 <span>TOTAL RENT</span>
//                                 <strong>₹ {formatMoney(grandTotal)}</strong>
//                             </div>

//                             <div className="invoice-deposit-note">
//                                 Security deposit is shown separately and is
//                                 not included in Total Rent.
//                             </div>

//                         </div>

//                     </div>

//                     {/* FOOTER */}

//                     <div className="invoice-footer">

//                         <div>

//                             <strong>
//                                 Thank you for choosing Zaid Infotech.
//                             </strong>

//                             <p>Please keep this invoice for your records.</p>

//                         </div>

//                         <div className="invoice-signature">

//                             <div className="signature-line" />

//                             <span>Authorized Signature</span>

//                         </div>

//                     </div>

//                 </div>

//             </main>
//         </div>
//     );
// }

// export default WalkInRentalInvoice;




import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Printer, RefreshCw, X } from "lucide-react";

import { getRentalById } from "../../services/rentalApi";
import "./WalkInRentalInvoice.css";

/*
 * Props:
 *
 * rentalData     -> rental object already loaded by admin page
 * isAdminPreview -> true when shown inside admin modal
 * onAdminClose   -> function to close admin modal
 */

function WalkInRentalInvoice({
    rentalData = null,
    isAdminPreview = false,
    onAdminClose = null,
}) {
    const { rentalId: routeRentalId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const initialRental =
        rentalData || location.state?.rental || null;

    // =====================================================
    // RENTAL ID
    // =====================================================

    const rentalId =
        routeRentalId ||
        rentalData?._id ||
        rentalData?.id ||
        rentalData?.rentalId ||
        "";

    const [rental, setRental] = useState(initialRental);
    const [loading, setLoading] = useState(!initialRental);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD RENTAL
    // =====================================================

    useEffect(() => {
        if (rentalData) {
            setRental(rentalData);
            setLoading(false);
            setError("");
            return;
        }

        if (!rentalId) {
            setError("Rental ID is missing");
            setLoading(false);
            return;
        }

        loadRental();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rentalId, rentalData]);

    const loadRental = async () => {
        try {
            setLoading(true);
            setError("");

            if (!rentalId) {
                throw new Error("Rental ID is missing");
            }

            const response = await getRentalById(rentalId);

            let rentalObj = null;

            if (response?.data?.data?.rental) {
                rentalObj = response.data.data.rental;
            } else if (response?.data?.data) {
                rentalObj = response.data.data;
            } else if (response?.data?.rental) {
                rentalObj = response.data.rental;
            } else if (response?.rental) {
                rentalObj = response.rental;
            } else if (response?.data) {
                rentalObj = response.data;
            } else if (response?._id) {
                rentalObj = response;
            }

            if (
                rentalObj &&
                rentalObj.rental &&
                typeof rentalObj.rental === "object"
            ) {
                rentalObj = rentalObj.rental;
            }

            if (!rentalObj) {
                throw new Error(
                    "Rental details could not be found"
                );
            }

            setRental(rentalObj);
        } catch (err) {
            console.error(
                "RENTAL INVOICE ERROR:",
                err
            );

            const fallback =
                rentalData ||
                location.state?.rental;

            if (fallback) {
                setRental(fallback);
                setError("");
            } else {
                setError(
                    err?.response?.data?.message ||
                        err?.message ||
                        "Failed to load rental invoice"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // BASIC HELPERS
    // =====================================================

    const getRentalId = () => {
        return (
            rental?._id ||
            rental?.id ||
            rental?.rentalId ||
            rentalId ||
            ""
        );
    };

    const getCustomerType = () => {
        return String(
            rental?.customerType ||
                "INDIVIDUAL"
        ).toUpperCase();
    };

    // =====================================================
    // CUSTOMER
    // =====================================================

    const getCustomerName = () => {
        if (
            getCustomerType() === "COMPANY"
        ) {
            return (
                rental?.companyDetails
                    ?.contactPerson ||
                rental?.companyDetails
                    ?.companyName ||
                rental?.customer?.name ||
                "Company Customer"
            );
        }

        return (
            rental?.individualDetails
                ?.fullName ||
            rental?.customer?.name ||
            rental?.customer?.fullName ||
            rental?.customerName ||
            "Walk-In Customer"
        );
    };

    const getCompanyName = () => {
        return (
            rental?.companyDetails
                ?.companyName || ""
        );
    };

    const getPhone = () => {
        if (
            getCustomerType() === "COMPANY"
        ) {
            return (
                rental?.companyDetails
                    ?.phone ||
                rental?.customer?.phone ||
                "-"
            );
        }

        return (
            rental?.individualDetails
                ?.phone ||
            rental?.customer?.phone ||
            rental?.phone ||
            "-"
        );
    };

    const getEmail = () => {
        if (
            getCustomerType() === "COMPANY"
        ) {
            return (
                rental?.companyDetails
                    ?.email ||
                rental?.customer?.email ||
                "-"
            );
        }

        return (
            rental?.individualDetails
                ?.email ||
            rental?.customer?.email ||
            rental?.email ||
            "-"
        );
    };

    const getAddress = () => {
        if (
            getCustomerType() === "COMPANY"
        ) {
            return (
                rental?.companyDetails
                    ?.address ||
                rental?.customer?.address ||
                "-"
            );
        }

        return (
            rental?.individualDetails
                ?.address ||
            rental?.customer?.address ||
            rental?.address ||
            "-"
        );
    };

    // =====================================================
    // PRODUCT
    // =====================================================

    const getProduct = () => {
        return (
            rental?.product ||
            rental?.rentalProduct?.product ||
            rental?.rentalProduct ||
            null
        );
    };

    const getProductName = () => {
        const product = getProduct();

        if (typeof product === "string") {
            return product;
        }

        return (
            product?.name ||
            product?.title ||
            rental?.productName ||
            "Rental Product"
        );
    };

    const getBrandName = () => {
        const product = getProduct();

        const brand =
            product?.brand ||
            rental?.brand;

        if (
            brand &&
            typeof brand === "object"
        ) {
            return (
                brand?.name ||
                brand?.title ||
                "-"
            );
        }

        return brand || "-";
    };

    const getModelName = () => {
        const product = getProduct();

        return (
            product?.model ||
            product?.modelName ||
            rental?.model ||
            rental?.modelName ||
            "-"
        );
    };

    const getSerialNumber = () => {
        const product = getProduct();

        return (
            rental?.serialNumber ||
            rental?.serialNo ||
            product?.serialNumber ||
            product?.serialNo ||
            "-"
        );
    };

    // =====================================================
    // RENTAL TYPE
    // =====================================================

    /*
     * IMPORTANT
     *
     * We check all possible backend field names.
     *
     * Examples:
     *
     * MONTH
     * MONTHLY
     * MONTHS
     * DAILY
     * DAY
     * DAYS
     *
     * Everything is normalized to:
     *
     * "MONTHS"
     * or
     * "DAYS"
     */

    const getDurationType = () => {
        const rawType =
            rental?.rentalDurationType ??
            rental?.durationType ??
            rental?.billingCycle ??
            rental?.rentalType ??
            rental?.rentType ??
            rental?.pricingType ??
            rental?.rateType ??
            "";

        const type = String(rawType)
            .trim()
            .toUpperCase()
            .replace(/[\s_-]+/g, "");

        if (
            [
                "DAY",
                "DAYS",
                "DAILY",
                "PERDAY",
                "DAILYRENT",
            ].includes(type)
        ) {
            return "DAYS";
        }

        if (
            [
                "MONTH",
                "MONTHS",
                "MONTHLY",
                "PERMONTH",
                "MONTHLYRENT",
            ].includes(type)
        ) {
            return "MONTHS";
        }

        /*
         * If backend has a direct boolean,
         * support that also.
         */

        if (
            rental?.isDaily === true ||
            rental?.dailyRental === true
        ) {
            return "DAYS";
        }

        if (
            rental?.isMonthly === true ||
            rental?.monthlyRental === true
        ) {
            return "MONTHS";
        }

        /*
         * DO NOT blindly assume 3 months.
         *
         * If backend doesn't provide type,
         * infer from available pricing fields.
         */

        const dailyRent = Number(
            rental?.dailyRent ??
                rental?.rentPerDay ??
                rental?.pricing?.dailyRent ??
                rental?.pricing?.rentPerDay ??
                rental?.dailyRate ??
                0
        );

        const monthlyRent = Number(
            rental?.monthlyRent ??
                rental?.rentPerMonth ??
                rental?.pricing?.monthlyRent ??
                rental?.pricing?.rentPerMonth ??
                rental?.monthlyRate ??
                0
        );

        if (
            dailyRent > 0 &&
            monthlyRent <= 0
        ) {
            return "DAYS";
        }

        /*
         * Existing monthly rent means monthly.
         */

        if (monthlyRent > 0) {
            return "MONTHS";
        }

        /*
         * Final safe default.
         *
         * This is only used if backend does not
         * send any duration/rate information.
         */

        return "DAYS";
    };

    // =====================================================
    // DURATION VALUE
    // =====================================================

    const getRentalDurationValue = () => {
        const duration = Number(
            rental?.rentalDuration ??
                rental?.duration ??
                rental?.rentalMonths ??
                rental?.durationMonths ??
                rental?.months ??
                rental?.rentalDays ??
                rental?.days ??
                1
        );

        if (
            !Number.isFinite(duration) ||
            duration <= 0
        ) {
            return 1;
        }

        return duration;
    };

    // =====================================================
    // MONTHLY RENT
    // =====================================================

    const getMonthlyRent = () => {
        const value =
            rental?.monthlyRent ??
            rental?.rentPerMonth ??
            rental?.pricing?.monthlyRent ??
            rental?.pricing?.rentPerMonth ??
            rental?.monthlyRate ??
            0;

        const number = Number(value);

        return Number.isFinite(number)
            ? Math.max(number, 0)
            : 0;
    };

    // =====================================================
    // DAILY RENT
    // =====================================================

    const getDailyRent = () => {
        const value =
            rental?.dailyRent ??
            rental?.rentPerDay ??
            rental?.pricing?.dailyRent ??
            rental?.pricing?.rentPerDay ??
            rental?.dailyRate ??
            0;

        const number = Number(value);

        if (
            Number.isFinite(number) &&
            number > 0
        ) {
            return number;
        }

        /*
         * IMPORTANT:
         *
         * Only calculate daily rent from monthly rent
         * when daily rent is not supplied.
         *
         * This keeps existing monthly rentals working.
         */

        const monthlyRent =
            getMonthlyRent();

        if (monthlyRent > 0) {
            return monthlyRent / 30;
        }

        return 0;
    };

    // =====================================================
    // DURATION LABEL
    // =====================================================

    const getDurationLabel = () => {
        const type =
            getDurationType();

        const value =
            getRentalDurationValue();

        if (type === "DAYS") {
            return `${value} ${
                value === 1
                    ? "Day"
                    : "Days"
            }`;
        }

        return `${value} ${
            value === 1
                ? "Month"
                : "Months"
        }`;
    };

    // =====================================================
    // SECURITY DEPOSIT
    // =====================================================

    const getSecurityDeposit = () => {
        const value =
            rental?.securityDeposit ??
            rental?.depositAmount ??
            rental?.securityDepositAmount ??
            0;

        const number = Number(value);

        return Number.isFinite(number)
            ? Math.max(number, 0)
            : 0;
    };

    // =====================================================
    // GST
    // =====================================================

    const getGSTPercentage = () => {
        const value =
            rental?.gstPercentage ??
            rental?.gst ??
            rental?.taxPercentage ??
            rental?.pricing?.gstPercentage ??
            rental?.pricing?.gst ??
            0;

        const number = Number(value);

        return Number.isFinite(number)
            ? Math.max(number, 0)
            : 0;
    };

    // =====================================================
    // RENTAL AMOUNT
    // =====================================================

    const getRentalAmount = () => {
        const type =
            getDurationType();

        const duration =
            getRentalDurationValue();

        /*
         * DAILY RENTAL
         *
         * Example:
         *
         * Daily rent = ₹500
         * Duration = 3 days
         *
         * 500 × 3 = ₹1500
         */

        if (type === "DAYS") {
            return (
                getDailyRent() *
                duration
            );
        }

        /*
         * MONTHLY RENTAL
         *
         * Example:
         *
         * Monthly rent = ₹10,000
         * Duration = 3 months
         *
         * 10,000 × 3 = ₹30,000
         */

        return (
            getMonthlyRent() *
            duration
        );
    };

    // =====================================================
    // GST AMOUNT
    // =====================================================

    const getGSTAmount = () => {
        const rentalAmount =
            getRentalAmount();

        const gstPercentage =
            getGSTPercentage();

        return (
            rentalAmount *
            gstPercentage
        ) / 100;
    };

    // =====================================================
    // GRAND TOTAL
    // =====================================================

    const getGrandTotal = () => {
        return (
            getRentalAmount() +
            getGSTAmount()
        );
    };

    // =====================================================
    // PAYMENT STATUS
    // =====================================================

    const getPaymentStatus = () => {
        const total =
            getGrandTotal();

        const paid = Number(
            rental?.paidAmount ??
                rental?.amountPaid ??
                rental?.paymentAmount ??
                rental?.payment?.amount ??
                rental?.payment?.paidAmount ??
                rental?.depositAmountPaid ??
                0
        );

        const rawStatus = String(
            rental?.paymentStatus ??
                rental?.paymentState ??
                rental?.payment?.status ??
                ""
        )
            .trim()
            .toUpperCase();

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

    // =====================================================
    // RENTAL STATUS
    // =====================================================

    const getStatus = () => {
        return String(
            rental?.status ||
                "PENDING"
        ).toUpperCase();
    };

    // =====================================================
    // PAYMENT METHOD
    // =====================================================

    const getPaymentMethod = () => {
        return (
            rental?.paymentMethod ||
            rental?.depositPaymentMethod ||
            rental?.payment?.method ||
            rental?.payment?.paymentMethod ||
            "-"
        );
    };

    // =====================================================
    // PAID AMOUNT
    // =====================================================

    const getPaidAmount = () => {
        const value =
            rental?.paidAmount ??
            rental?.amountPaid ??
            rental?.paymentAmount ??
            rental?.payment?.paidAmount ??
            rental?.payment?.amount ??
            0;

        const number = Number(value);

        return Number.isFinite(number)
            ? Math.max(number, 0)
            : 0;
    };

    // =====================================================
    // BALANCE
    // =====================================================

    const getBalanceAmount = () => {
        const total =
            getGrandTotal();

        const paid =
            getPaidAmount();

        return Math.max(
            total - paid,
            0
        );
    };

    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (value) => {
        const number =
            Number(value || 0);

        return number.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
    };

    // =====================================================
    // DATE
    // =====================================================

    const formatDate = (value) => {
        if (!value) {
            return "-";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        );
    };

    // =====================================================
    // INVOICE NUMBER
    // =====================================================

    const invoiceNumber =
        useMemo(() => {
            const existingInvoice =
                rental?.invoiceNumber ||
                rental?.invoiceNo ||
                rental?.invoice
                    ?.invoiceNumber;

            if (existingInvoice) {
                return String(
                    existingInvoice
                );
            }

            const id = String(
                rental?._id ||
                    rental?.id ||
                    rental?.rentalId ||
                    rentalId ||
                    ""
            );

            return `RENT-${id
                .slice(-8)
                .toUpperCase()}`;
        }, [rental, rentalId]);

    // =====================================================
    // PRINT
    // =====================================================

    const handlePrint = () => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                window.print();
            }, 300);
        });
    };

    // =====================================================
    // BACK / CLOSE
    // =====================================================

    const handleBack = () => {
        if (isAdminPreview) {
            if (
                typeof onAdminClose ===
                "function"
            ) {
                onAdminClose();
            }

            return;
        }

        navigate(
            "/receptionist-dashboard/rental/orders"
        );
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="rental-invoice-loading">
                <div className="invoice-loading-spinner" />

                <h3>
                    Loading Rental Invoice...
                </h3>

                <p>
                    Please wait while rental
                    details are being loaded.
                </p>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error && !rental) {
        return (
            <div className="rental-invoice-error">
                <h2>
                    Unable to Load Invoice
                </h2>

                <p>{error}</p>

                <div className="invoice-error-actions">
                    <button
                        type="button"
                        onClick={loadRental}
                    >
                        <RefreshCw size={17} />
                        Retry
                    </button>

                    <button
                        type="button"
                        onClick={handleBack}
                    >
                        <ArrowLeft size={17} />

                        {isAdminPreview
                            ? "Close"
                            : "Back to Rentals"}
                    </button>
                </div>
            </div>
        );
    }

    // =====================================================
    // RENTAL NOT FOUND
    // =====================================================

    if (!rental) {
        return (
            <div className="rental-invoice-error">
                <h2>
                    Rental Not Found
                </h2>

                <button
                    type="button"
                    onClick={handleBack}
                >
                    <ArrowLeft size={17} />

                    {isAdminPreview
                        ? "Close"
                        : "Back to Rentals"}
                </button>
            </div>
        );
    }

    // =====================================================
    // CALCULATIONS
    // =====================================================

    const durationType =
        getDurationType();

    const durationValue =
        getRentalDurationValue();

    const dailyRent =
        getDailyRent();

    const monthlyRent =
        getMonthlyRent();

    const rentalAmount =
        getRentalAmount();

    const gstPercentage =
        getGSTPercentage();

    const gstAmount =
        getGSTAmount();

    const grandTotal =
        getGrandTotal();

    const securityDeposit =
        getSecurityDeposit();

    const paidAmount =
        getPaidAmount();

    const balanceAmount =
        getBalanceAmount();

    const paymentStatus =
        getPaymentStatus();

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="rental-invoice-page">

            {/* =================================================
                ACTION BAR
            ================================================= */}

            <div className="invoice-topbar no-print">

                <button
                    type="button"
                    className="invoice-back-btn"
                    onClick={handleBack}
                >
                    {isAdminPreview ? (
                        <X size={18} />
                    ) : (
                        <ArrowLeft size={18} />
                    )}

                    {isAdminPreview
                        ? "Close"
                        : "Back to Rentals"}
                </button>

                <div className="invoice-top-actions">

                    {!isAdminPreview && (
                        <button
                            type="button"
                            className="invoice-refresh-btn"
                            onClick={loadRental}
                        >
                            <RefreshCw size={17} />
                            Refresh
                        </button>
                    )}

                    <button
                        type="button"
                        className="invoice-print-btn"
                        onClick={handlePrint}
                    >
                        <Printer size={18} />
                        Print Invoice
                    </button>

                </div>
            </div>

            {/* =================================================
                PRINT AREA
            ================================================= */}

            <main className="rental-invoice-print-area">

                <div className="rental-invoice-paper">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="invoice-header">

                        <div className="invoice-company">

                            <h1>
                                ZAID INFOTECH
                            </h1>

                            <p>
                                Laptop Rental &amp;
                                Technology Solutions
                            </p>

                            <p>
                                Maharashtra, India
                            </p>

                        </div>

                        <div className="invoice-title-box">

                            <h2>
                                RENTAL INVOICE
                            </h2>

                            <div className="invoice-number">
                                <span>
                                    Invoice No.
                                </span>

                                <strong>
                                    {invoiceNumber}
                                </strong>
                            </div>

                            <div className="invoice-date">
                                <span>
                                    Invoice Date
                                </span>

                                <strong>
                                    {formatDate(
                                        rental?.createdAt ||
                                            rental?.createdDate ||
                                            rental?.date
                                    )}
                                </strong>
                            </div>

                        </div>

                    </div>

                    <div className="invoice-divider" />

                    {/* =================================================
                        CUSTOMER + RENTAL
                    ================================================= */}

                    <div className="invoice-info-grid">

                        <div className="invoice-info-card">

                            <h3>
                                BILL TO
                            </h3>

                            <strong className="invoice-customer-name">
                                {getCustomerName()}
                            </strong>

                            {getCompanyName() && (
                                <p>
                                    {getCompanyName()}
                                </p>
                            )}

                            <p>
                                <b>Phone:</b>{" "}
                                {getPhone()}
                            </p>

                            <p>
                                <b>Email:</b>{" "}
                                {getEmail()}
                            </p>

                            <p>
                                <b>Address:</b>{" "}
                                {getAddress()}
                            </p>

                        </div>

                        <div className="invoice-info-card">

                            <h3>
                                RENTAL DETAILS
                            </h3>

                            <p>
                                <b>Rental ID:</b>{" "}
                                #
                                {String(
                                    getRentalId()
                                ).slice(-8)}
                            </p>

                            <p>
                                <b>Source:</b>{" "}
                                {String(
                                    rental?.rentalSource ||
                                        "WALK_IN"
                                ).replace(
                                    /_/g,
                                    " "
                                )}
                            </p>

                            <p>
                                <b>Rental Type:</b>{" "}
                                <strong>
                                    {durationType ===
                                    "DAYS"
                                        ? "DAILY"
                                        : "MONTHLY"}
                                </strong>
                            </p>

                            <p>
                                <b>Duration:</b>{" "}
                                {getDurationLabel()}
                            </p>

                            <p>
                                <b>Status:</b>{" "}

                                <span
                                    className={`invoice-status ${getStatus().toLowerCase()}`}
                                >
                                    {getStatus()}
                                </span>
                            </p>

                            <p>
                                <b>Payment Status:</b>{" "}

                                <span
                                    className={`invoice-status ${paymentStatus.toLowerCase()}`}
                                >
                                    {paymentStatus}
                                </span>
                            </p>

                            <p>
                                <b>Payment:</b>{" "}
                                {getPaymentMethod()}
                            </p>

                        </div>

                    </div>

                    {/* =================================================
                        PRODUCT
                    ================================================= */}

                    <div className="invoice-section-title">
                        RENTAL PRODUCT
                    </div>

                    <div className="invoice-table-wrapper">

                        <table className="invoice-table">

                            <thead>

                                <tr>

                                    <th>#</th>

                                    <th>
                                        Description
                                    </th>

                                    <th>
                                        Brand
                                    </th>

                                    <th>
                                        Model
                                    </th>

                                    <th>
                                        Duration
                                    </th>

                                    <th>
                                        {durationType ===
                                        "DAYS"
                                            ? "Daily Rent"
                                            : "Monthly Rent"}
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                <tr>

                                    <td>
                                        1
                                    </td>

                                    <td>

                                        <strong>
                                            {getProductName()}
                                        </strong>

                                        <small className="invoice-product-sub">
                                            Serial No:{" "}
                                            {getSerialNumber()}
                                        </small>

                                    </td>

                                    <td>
                                        {getBrandName()}
                                    </td>

                                    <td>
                                        {getModelName()}
                                    </td>

                                    <td>
                                        {getDurationLabel()}
                                    </td>

                                    <td>

                                        ₹{" "}
                                        {formatMoney(
                                            durationType ===
                                                "DAYS"
                                                ? dailyRent
                                                : monthlyRent
                                        )}

                                    </td>

                                    <td>

                                        <strong>
                                            ₹{" "}
                                            {formatMoney(
                                                rentalAmount
                                            )}
                                        </strong>

                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                    {/* =================================================
                        SUMMARY
                    ================================================= */}

                    <div className="invoice-summary-area">

                        <div className="invoice-notes">

                            <h3>
                                NOTES
                            </h3>

                            <p>
                                This invoice is
                                generated for the
                                above walk-in
                                rental transaction.
                            </p>

                            <p>
                                Security deposit is
                                refundable subject to
                                rental return
                                conditions and
                                applicable
                                deductions.
                            </p>

                        </div>

                        <div className="invoice-total-box">

                            {/* RENTAL AMOUNT */}

                            <div className="invoice-total-row">

                                <span>
                                    {durationType ===
                                    "DAYS"
                                        ? `Daily Rent × ${durationValue} ${
                                              durationValue ===
                                              1
                                                  ? "Day"
                                                  : "Days"
                                          }`
                                        : `Monthly Rent × ${durationValue} ${
                                              durationValue ===
                                              1
                                                  ? "Month"
                                                  : "Months"
                                          }`}
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        rentalAmount
                                    )}
                                </strong>

                            </div>

                            {/* GST */}

                            <div className="invoice-total-row">

                                <span>
                                    GST (
                                    {
                                        gstPercentage
                                    }
                                    %)
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        gstAmount
                                    )}
                                </strong>

                            </div>

                            {/* SECURITY DEPOSIT */}

                            <div className="invoice-total-row deposit-row">

                                <span>
                                    Security Deposit
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        securityDeposit
                                    )}
                                </strong>

                            </div>

                            <div className="invoice-total-divider" />

                            {/* GRAND TOTAL */}

                            <div className="invoice-grand-total">

                                <span>
                                    TOTAL RENT
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        grandTotal
                                    )}
                                </strong>

                            </div>

                            {/* PAID */}

                            <div className="invoice-total-row">

                                <span>
                                    Paid Amount
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        paidAmount
                                    )}
                                </strong>

                            </div>

                            {/* BALANCE */}

                            <div className="invoice-total-row">

                                <span>
                                    Balance Amount
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        balanceAmount
                                    )}
                                </strong>

                            </div>

                            <div className="invoice-deposit-note">

                                Security deposit is
                                shown separately
                                and is not included
                                in Total Rent.

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="invoice-footer">

                        <div>

                            <strong>
                                Thank you for choosing
                                Zaid Infotech.
                            </strong>

                            <p>
                                Please keep this
                                invoice for your
                                records.
                            </p>

                        </div>

                        <div className="invoice-signature">

                            <div className="signature-line" />

                            <span>
                                Authorized Signature
                            </span>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default WalkInRentalInvoice;