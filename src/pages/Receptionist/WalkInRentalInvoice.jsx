import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Printer,
    RefreshCw,
} from "lucide-react";

import { getRentalById } from "../../services/rentalApi";
import "./WalkInRentalInvoice.css";

function WalkInRentalInvoice() {
    const { rentalId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [rental, setRental] = useState(
        location.state?.rental || null
    );

    const [loading, setLoading] = useState(!location.state?.rental);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD RENTAL
    // =====================================================

    useEffect(() => {
        if (!rentalId) {
            setError("Rental ID is missing");
            setLoading(false);
            return;
        }

        loadRental();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rentalId]);

    const loadRental = async () => {
        try {
            setLoading(true);
            setError("");

            console.log("================================");
            console.log("LOADING RENTAL INVOICE");
            console.log("RENTAL ID:", rentalId);
            console.log("================================");

            const response = await getRentalById(rentalId);

            console.log("RENTAL INVOICE RESPONSE:", response);

            let rentalData = null;

            /*
             * Support all common backend response structures.
             */

            if (response?.data?.data?.rental) {
                rentalData = response.data.data.rental;
            } else if (response?.data?.data) {
                rentalData = response.data.data;
            } else if (response?.data?.rental) {
                rentalData = response.data.rental;
            } else if (response?.rental) {
                rentalData = response.rental;
            } else if (response?.data) {
                rentalData = response.data;
            } else if (response?._id) {
                rentalData = response;
            }

            /*
             * Axios can sometimes return:
             *
             * {
             *   data: {
             *      success: true,
             *      rental: {...}
             *   }
             * }
             */

            if (
                rentalData &&
                rentalData.rental &&
                typeof rentalData.rental === "object"
            ) {
                rentalData = rentalData.rental;
            }

            if (!rentalData) {
                throw new Error(
                    "Rental details could not be found"
                );
            }

            console.log("FINAL RENTAL:", rentalData);

            setRental(rentalData);
        } catch (err) {
            console.error(
                "RENTAL INVOICE ERROR:",
                err
            );

            /*
             * If rental was already passed through navigate state,
             * keep using it when API fails.
             */

            if (location.state?.rental) {
                setRental(location.state.rental);
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
    // HELPERS
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
            rental?.customerName ||
            "Walk-In Customer"
        );
    };

    const getCompanyName = () => {
        return (
            rental?.companyDetails?.companyName ||
            ""
        );
    };

    const getPhone = () => {
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
            rental?.phone ||
            "-"
        );
    };

    const getEmail = () => {
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
            rental?.email ||
            "-"
        );
    };

    const getAddress = () => {
        if (getCustomerType() === "COMPANY") {
            return (
                rental?.companyDetails?.address ||
                rental?.customer?.address ||
                "-"
            );
        }

        return (
            rental?.individualDetails?.address ||
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
            "Rental Laptop"
        );
    };

    const getBrandName = () => {
        const product = getProduct();

        const brand =
            product?.brand ||
            rental?.brand;

        if (typeof brand === "object") {
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
    // AMOUNTS
    // =====================================================

    const getMonthlyRent = () => {
        return Number(
            rental?.monthlyRent ??
            rental?.rentalProduct?.monthlyRent ??
            rental?.rentPerMonth ??
            rental?.pricing?.monthlyRent ??
            0
        );
    };

    const getRentalMonths = () => {
        return Number(
            rental?.rentalMonths ??
            rental?.durationMonths ??
            rental?.months ??
            1
        );
    };

    const getSecurityDeposit = () => {
        return Number(
            rental?.securityDeposit ??
            rental?.depositAmount ??
            rental?.securityDepositAmount ??
            0
        );
    };

    const getGSTPercentage = () => {
        return Number(
            rental?.gstPercentage ??
            rental?.gst ??
            rental?.taxPercentage ??
            rental?.pricing?.gstPercentage ??
            0
        );
    };

    const getRentalAmount = () => {
        return (
            getMonthlyRent() *
            getRentalMonths()
        );
    };

    const getGSTAmount = () => {
        return (
            getRentalAmount() *
            getGSTPercentage()
        ) / 100;
    };

    const getGrandTotal = () => {
        return (
            getRentalAmount() +
            getGSTAmount()
        );
    };

    // =====================================================
    // STATUS / PAYMENT
    // =====================================================

    const getStatus = () => {
        return String(
            rental?.status ||
            "PENDING"
        ).toUpperCase();
    };

    const getPaymentMethod = () => {
        return (
            rental?.paymentMethod ||
            rental?.depositPaymentMethod ||
            rental?.payment?.method ||
            "-"
        );
    };

    // =====================================================
    // FORMATTERS
    // =====================================================

    const formatMoney = (value) => {
        const number = Number(value || 0);

        return number.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
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

    const invoiceNumber = useMemo(() => {
        const existingInvoice =
            rental?.invoiceNumber ||
            rental?.invoiceNo ||
            rental?.invoice?.invoiceNumber;

        if (existingInvoice) {
            return String(existingInvoice);
        }

        const id = String(
            getRentalId() || ""
        );

        return `RENT-${id.slice(-8).toUpperCase()}`;
    }, [rental, rentalId]);

    // =====================================================
    // PRINT
    // =====================================================

   const handlePrint = () => {
    // Make sure browser finishes rendering invoice
    requestAnimationFrame(() => {
        setTimeout(() => {
            window.print();
        }, 300);
    });
};

    // =====================================================
    // BACK
    // =====================================================

    const handleBack = () => {
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
                    Please wait while rental details
                    are being loaded.
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

                <p>
                    {error}
                </p>

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
                        Back to Rentals
                    </button>
                </div>
            </div>
        );
    }

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
                    Back to Rentals
                </button>
            </div>
        );
    }

    // =====================================================
    // CALCULATIONS
    // =====================================================

    const rentalAmount = getRentalAmount();
    const gstAmount = getGSTAmount();
    const grandTotal = getGrandTotal();
    const securityDeposit = getSecurityDeposit();

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
                    <ArrowLeft size={18} />
                    Back to Rentals
                </button>

                <div className="invoice-top-actions">

                    <button
                        type="button"
                        className="invoice-refresh-btn"
                        onClick={loadRental}
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>

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

                    {/* HEADER */}

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

                    {/* CUSTOMER + RENTAL */}

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
                                #{String(
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
                                <b>Status:</b>{" "}
                                <span
                                    className={`invoice-status ${getStatus().toLowerCase()}`}
                                >
                                    {getStatus()}
                                </span>
                            </p>

                            <p>
                                <b>Payment:</b>{" "}
                                {getPaymentMethod()}
                            </p>

                        </div>

                    </div>

                    {/* PRODUCT */}

                    <div className="invoice-section-title">
                        RENTAL PRODUCT
                    </div>

                    <div className="invoice-table-wrapper">

                        <table className="invoice-table">

                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Description</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Duration</th>
                                    <th>Monthly Rent</th>
                                    <th>Amount</th>
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
                                        {getRentalMonths()}{" "}
                                        {getRentalMonths() === 1
                                            ? "Month"
                                            : "Months"}
                                    </td>

                                    <td>
                                        ₹{" "}
                                        {formatMoney(
                                            getMonthlyRent()
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

                    {/* SUMMARY */}

                    <div className="invoice-summary-area">

                        <div className="invoice-notes">

                            <h3>
                                NOTES
                            </h3>

                            <p>
                                This invoice is generated
                                for the above walk-in rental
                                transaction.
                            </p>

                            <p>
                                Security deposit is
                                refundable subject to rental
                                return conditions and
                                applicable deductions.
                            </p>

                        </div>

                        <div className="invoice-total-box">

                            <div className="invoice-total-row">

                                <span>
                                    Rental Amount
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        rentalAmount
                                    )}
                                </strong>

                            </div>

                            <div className="invoice-total-row">

                                <span>
                                    GST ({getGSTPercentage()}%)
                                </span>

                                <strong>
                                    ₹{" "}
                                    {formatMoney(
                                        gstAmount
                                    )}
                                </strong>

                            </div>

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

                            <div className="invoice-deposit-note">
                                Security deposit is shown
                                separately and is not included
                                in Total Rent.
                            </div>

                        </div>

                    </div>

                    {/* FOOTER */}

                    <div className="invoice-footer">

                        <div>

                            <strong>
                                Thank you for choosing
                                Zaid Infotech.
                            </strong>

                            <p>
                                Please keep this invoice
                                for your records.
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

