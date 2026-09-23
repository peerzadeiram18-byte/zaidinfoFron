
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./PurchaseBillDetails.css";

// ======================================================
// API BASE
// ======================================================

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000";

// ======================================================
// HELPERS
// ======================================================

const formatMoney = (value) => {
    const amount = Number(value || 0);

    return `₹${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatDateTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getUserName = (user) => {
    if (!user) return "-";

    const name = [user.firstName, user.lastName]
        .filter(Boolean)
        .join(" ");

    return name || user.name || user.email || "-";
};

const formatPaymentMode = (mode) => {
    const modes = {
        CASH: "Cash",
        UPI: "UPI",
        BANK_TRANSFER: "Bank Transfer",
        CHEQUE: "Cheque",
        CARD: "Card",
        OTHER: "Other",
    };

    return modes[mode] || mode || "-";
};

const formatUpiApp = (app) => {
    const apps = {
        PHONEPE: "PhonePe",
        GOOGLE_PAY: "Google Pay",
        PAYTM: "Paytm",
        OTHER: "Other UPI",
    };

    return apps[app] || app || "-";
};

const formatTransferType = (type) => {
    const types = {
        NEFT: "NEFT",
        RTGS: "RTGS",
        IMPS: "IMPS",
        OTHER: "Other",
    };

    return types[type] || type || "-";
};

// ======================================================
// COMPONENT
// ======================================================

const PurchaseBillDetails = () => {
    const { purchaseId } = useParams();
    const navigate = useNavigate();

    const [purchase, setPurchase] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [verifying, setVerifying] = useState(false);

    // ======================================================
    // PAYMENT FORM
    // ======================================================

    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMode, setPaymentMode] = useState("CASH");

    const [paymentDate, setPaymentDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [upiApp, setUpiApp] = useState("");
    const [utrNumber, setUtrNumber] = useState("");
    const [transactionReference, setTransactionReference] =
        useState("");

    const [bankName, setBankName] = useState("");
    const [bankReference, setBankReference] = useState("");
    const [transferType, setTransferType] = useState("");

    const [chequeNumber, setChequeNumber] = useState("");
    const [chequeDate, setChequeDate] = useState("");

    const [receiptNumber, setReceiptNumber] = useState("");

    const [transactionStatus, setTransactionStatus] =
        useState("SUCCESS");

    const [paymentNotes, setPaymentNotes] = useState("");

    const [paymentSlip, setPaymentSlip] = useState(null);

    const [recordingPayment, setRecordingPayment] =
        useState(false);

    // ======================================================
    // AUTH HEADERS
    // ======================================================

    const authHeaders = () => {
        const token = localStorage.getItem("token");

        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
    };

    // ======================================================
    // FETCH PURCHASE BILL
    // ======================================================

    const fetchPurchaseBill = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_BASE_URL}/api/purchase/${purchaseId}`,
                {
                    method: "GET",
                    headers: authHeaders(),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.message ||
                    "Failed to fetch purchase bill"
                );
            }

            setPurchase(result?.data || null);
        } catch (err) {
            console.error(
                "Purchase bill details error:",
                err
            );

            setError(
                err.message ||
                "Failed to load purchase bill"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (purchaseId) {
            fetchPurchaseBill();
        }
    }, [purchaseId]);

    // ======================================================
    // VERIFY PURCHASE BILL
    // ======================================================

    const handleVerify = async () => {
        if (!purchase) return;

        const confirmed = window.confirm(
            `Are you sure you want to verify purchase bill ${purchase.purchaseNumber}?`
        );

        if (!confirmed) return;

        try {
            setVerifying(true);

            const response = await fetch(
                `${API_BASE_URL}/api/purchase/${purchaseId}/verify`,
                {
                    method: "PUT",
                    headers: authHeaders(),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.message ||
                    "Failed to verify purchase bill"
                );
            }

            await fetchPurchaseBill();
        } catch (err) {
            console.error(
                "Verify purchase bill error:",
                err
            );

            alert(
                err.message ||
                "Failed to verify purchase bill"
            );
        } finally {
            setVerifying(false);
        }
    };

    // ======================================================
    // RESET PAYMENT FORM
    // ======================================================

    const resetPaymentForm = () => {
        setPaymentAmount("");
        setPaymentMode("CASH");

        setPaymentDate(
            new Date().toISOString().split("T")[0]
        );

        setUpiApp("");
        setUtrNumber("");
        setTransactionReference("");

        setBankName("");
        setBankReference("");
        setTransferType("");

        setChequeNumber("");
        setChequeDate("");

        setReceiptNumber("");

        setTransactionStatus("SUCCESS");

        setPaymentNotes("");

        setPaymentSlip(null);
    };

    // ======================================================
    // RECORD PAYMENT
    // ======================================================

    const handleRecordPayment = async (event) => {
        event.preventDefault();

        if (!purchase) return;

        const amount = Number(paymentAmount);

        if (!amount || amount <= 0) {
            alert(
                "Please enter a valid payment amount."
            );
            return;
        }

        const pendingAmount =
            Number(purchase.pendingAmount || 0);

        if (amount > pendingAmount) {
            alert(
                `Payment cannot be greater than pending amount ${formatMoney(
                    pendingAmount
                )}.`
            );

            return;
        }

        // --------------------------------------------------
        // UPI VALIDATION
        // --------------------------------------------------

        if (paymentMode === "UPI") {
            if (!upiApp) {
                alert("Please select the UPI app.");
                return;
            }

            if (!utrNumber.trim()) {
                alert("Please enter the UTR number.");
                return;
            }

            if (!paymentSlip) {
                alert("Please upload the payment slip.");
                return;
            }
        }

        // --------------------------------------------------
        // BANK TRANSFER VALIDATION
        // --------------------------------------------------

        if (paymentMode === "BANK_TRANSFER") {
            if (!transferType) {
                alert("Please select the transfer type.");
                return;
            }

            if (!utrNumber.trim()) {
                alert("Please enter the UTR number.");
                return;
            }

            if (!paymentSlip) {
                alert("Please upload the payment slip.");
                return;
            }
        }

        // --------------------------------------------------
        // CHEQUE VALIDATION
        // --------------------------------------------------

        if (paymentMode === "CHEQUE") {
            if (!chequeNumber.trim()) {
                alert("Please enter the cheque number.");
                return;
            }

            if (!chequeDate) {
                alert("Please select the cheque date.");
                return;
            }
        }

        try {
            setRecordingPayment(true);

            // ==================================================
            // FORM DATA
            // ==================================================

            const formData = new FormData();

            formData.append(
                "amount",
                amount
            );

            formData.append(
                "paymentMode",
                paymentMode
            );

            formData.append(
                "paymentDate",
                paymentDate
            );

            formData.append(
                "upiApp",
                paymentMode === "UPI"
                    ? upiApp
                    : ""
            );

            formData.append(
                "utrNumber",
                paymentMode === "UPI" ||
                    paymentMode === "BANK_TRANSFER"
                    ? utrNumber.trim()
                    : ""
            );

            formData.append(
                "transactionReference",
                transactionReference.trim()
            );

            formData.append(
                "bankName",
                paymentMode === "BANK_TRANSFER" ||
                    paymentMode === "CHEQUE"
                    ? bankName.trim()
                    : ""
            );

            formData.append(
                "bankReference",
                paymentMode === "BANK_TRANSFER"
                    ? bankReference.trim()
                    : ""
            );

            formData.append(
                "transferType",
                paymentMode === "BANK_TRANSFER"
                    ? transferType
                    : ""
            );

            formData.append(
                "chequeNumber",
                paymentMode === "CHEQUE"
                    ? chequeNumber.trim()
                    : ""
            );

            formData.append(
                "chequeDate",
                paymentMode === "CHEQUE"
                    ? chequeDate
                    : ""
            );

            formData.append(
                "receiptNumber",
                paymentMode === "CASH"
                    ? receiptNumber.trim()
                    : ""
            );

            formData.append(
                "transactionStatus",
                transactionStatus
            );

            formData.append(
                "notes",
                paymentNotes.trim()
            );

            // --------------------------------------------------
            // PAYMENT SLIP
            // --------------------------------------------------

            if (paymentSlip) {
                formData.append(
                    "paymentSlip",
                    paymentSlip
                );
            }

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `${API_BASE_URL}/api/purchase/${purchaseId}/payment`,
                {
                    method: "PUT",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: formData,
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.message ||
                    "Failed to record payment"
                );
            }

            resetPaymentForm();

            await fetchPurchaseBill();

            alert(
                "Vendor payment recorded successfully."
            );

        } catch (err) {

            console.error(
                "Record payment error:",
                err
            );

            alert(
                err.message ||
                "Failed to record payment"
            );

        } finally {

            setRecordingPayment(false);

        }
    };

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <div className="purchase-bill-details-page">
                <div className="purchase-bill-details-loading">
                    Loading purchase bill...
                </div>
            </div>
        );
    }

    // ======================================================
    // ERROR
    // ======================================================

    if (error) {
        return (
            <div className="purchase-bill-details-page">
                <div className="purchase-bill-details-error">

                    <h2>
                        Unable to load purchase bill
                    </h2>

                    <p>{error}</p>

                    <button
                        type="button"
                        className="purchase-bill-details-secondary-btn"
                        onClick={() =>
                            navigate("/purchase-bills")
                        }
                    >
                        Back to Purchase Bills
                    </button>

                </div>
            </div>
        );
    }

    // ======================================================
    // NOT FOUND
    // ======================================================

    if (!purchase) {
        return (
            <div className="purchase-bill-details-page">
                <div className="purchase-bill-details-error">

                    <h2>
                        Purchase bill not found
                    </h2>

                    <button
                        type="button"
                        className="purchase-bill-details-secondary-btn"
                        onClick={() =>
                            navigate("/purchase-bills")
                        }
                    >
                        Back to Purchase Bills
                    </button>

                </div>
            </div>
        );
    }

    // ======================================================
    // VALUES
    // ======================================================

    const items = Array.isArray(
        purchase.items
    )
        ? purchase.items
        : [];

    const payments = Array.isArray(
        purchase.payments
    )
        ? purchase.payments
        : [];

    const isPending =
        Number(purchase.pendingAmount || 0) > 0;

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="purchase-bill-details-page">

            {/* ==================================================
          HEADER
      ================================================== */}

            <button onClick={() => navigate(`/purchase-bills/${purchaseId}/invoice`)}>
                View Invoice
            </button>

            <div className="purchase-bill-details-header">

                <div>

                    <button
                        type="button"
                        className="purchase-bill-details-back-btn"
                        onClick={() =>
                            navigate("/purchase-bills")
                        }
                    >
                        ← Back to Purchase Bills
                    </button>

                    <h1>
                        Purchase Bill Details
                    </h1>

                    <p className="purchase-bill-details-subtitle">
                        View purchase bill, verification and vendor
                        payment details.
                    </p>

                </div>

                <div className="purchase-bill-details-header-actions">

                    {!purchase.verified && (

                        <button
                            type="button"
                            className="purchase-bill-details-verify-btn"
                            onClick={handleVerify}
                            disabled={verifying}
                        >
                            {verifying
                                ? "Verifying..."
                                : "Verify Bill"}
                        </button>

                    )}

                </div>

            </div>


            {/* ==================================================
          BILL SUMMARY
      ================================================== */}

            <div className="purchase-bill-details-card">

                <div className="purchase-bill-details-card-header">

                    <h2>
                        Bill Information
                    </h2>

                    <div className="purchase-bill-details-status-group">

                        <span
                            className={`purchase-bill-details-badge ${purchase.verified
                                    ? "purchase-bill-details-badge-success"
                                    : "purchase-bill-details-badge-warning"
                                }`}
                        >
                            {purchase.verified
                                ? "VERIFIED"
                                : "NOT VERIFIED"}
                        </span>

                        <span
                            className={`purchase-bill-details-badge purchase-bill-details-payment-${String(
                                purchase.paymentStatus ||
                                "PENDING"
                            ).toLowerCase()}`}
                        >
                            {purchase.paymentStatus ||
                                "PENDING"}
                        </span>

                    </div>

                </div>


                <div className="purchase-bill-details-info-grid">

                    <div className="purchase-bill-details-info-item">

                        <span>
                            Purchase Number
                        </span>

                        <strong>
                            {purchase.purchaseNumber || "-"}
                        </strong>

                    </div>


                    <div className="purchase-bill-details-info-item">

                        <span>
                            Vendor Invoice Number
                        </span>

                        <strong>
                            {purchase.vendorInvoiceNumber ||
                                "-"}
                        </strong>

                    </div>


                    <div className="purchase-bill-details-info-item">

                        <span>
                            Invoice Date
                        </span>

                        <strong>
                            {formatDate(
                                purchase.invoiceDate
                            )}
                        </strong>

                    </div>


                    <div className="purchase-bill-details-info-item">

                        <span>
                            Purchase Order
                        </span>

                        <strong>
                            {purchase.purchaseOrder ||
                                "Manual Purchase"}
                        </strong>

                    </div>


                    <div className="purchase-bill-details-info-item">

                        <span>
                            Created By
                        </span>

                        <strong>
                            {getUserName(
                                purchase.createdBy
                            )}
                        </strong>

                    </div>


                    <div className="purchase-bill-details-info-item">

                        <span>
                            Created At
                        </span>

                        <strong>
                            {formatDateTime(
                                purchase.createdAt
                            )}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ==================================================
          VENDOR INFORMATION
      ================================================== */}

            <div className="purchase-bill-details-card">

                <div className="purchase-bill-details-card-header">

                    <h2>
                        Vendor Information
                    </h2>

                </div>


                <div className="purchase-bill-details-info-grid">

                    <div className="purchase-bill-details-info-item">

                        <span>
                            Vendor Name
                        </span>

                        <strong>
                            {purchase.vendorName || "-"}
                        </strong>

                    </div>


                    <div className="purchase-bill-details-info-item">

                        <span>
                            Phone
                        </span>

                        <strong>
                            {purchase.vendorPhone || "-"}
                        </strong>

                    </div>


                    <div className="purchase-bill-details-info-item">

                        <span>
                            Email
                        </span>

                        <strong>
                            {purchase.vendorEmail || "-"}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ==================================================
          ITEMS
      ================================================== */}

            <div className="purchase-bill-details-card">

                <div className="purchase-bill-details-card-header">

                    <h2>
                        Purchase Items
                    </h2>

                    <span className="purchase-bill-details-item-count">

                        {items.length} item
                        {items.length !== 1
                            ? "s"
                            : ""}

                    </span>

                </div>


                {items.length === 0 ? (

                    <div className="purchase-bill-details-empty">
                        No items found in this purchase bill.
                    </div>

                ) : (

                    <div className="purchase-bill-details-table-wrapper">

                        <table className="purchase-bill-details-table">

                            <thead>

                                <tr>
                                    <th>#</th>
                                    <th>Item</th>
                                    <th>Type</th>
                                    <th>Quantity</th>
                                    <th>Purchase Price</th>
                                    <th>GST</th>
                                    <th>Total</th>
                                </tr>

                            </thead>


                            <tbody>

                                {items.map(
                                    (item, index) => (

                                        <tr
                                            key={
                                                item._id ||
                                                index
                                            }
                                        >

                                            <td>
                                                {index + 1}
                                            </td>


                                            <td>

                                                <div className="purchase-bill-details-item-name">

                                                    {item.productName ||
                                                        "-"}

                                                </div>
                                            </td>


                                            <td>

                                                <span className="purchase-bill-details-type">

                                                    {item.itemModel ||
                                                        "Product"}

                                                </span>

                                            </td>


                                            <td>
                                                {item.quantity ||
                                                    0}
                                            </td>


                                            <td>
                                                {formatMoney(
                                                    item.purchasePrice
                                                )}
                                            </td>


                                            <td>

                                                {Number(
                                                    item.gst || 0
                                                )}
                                                %

                                            </td>


                                            <td className="purchase-bill-details-total-cell">

                                                {formatMoney(
                                                    item.totalAmount
                                                )}

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* ==================================================
          PAYMENT HISTORY
      ================================================== */}

            <div className="purchase-bill-details-card">

                <div className="purchase-bill-details-card-header">

                    <div>

                        <h2>
                            Payment History
                        </h2>

                        <p className="purchase-bill-details-section-description">

                            Complete payment records against this
                            purchase bill.

                        </p>

                    </div>

                    <span className="purchase-bill-details-item-count">

                        {payments.length} payment
                        {payments.length !== 1
                            ? "s"
                            : ""}

                    </span>

                </div>


                {payments.length === 0 ? (

                    <div className="purchase-bill-details-empty">

                        No payments have been recorded for this
                        purchase bill.

                    </div>

                ) : (

                    <div className="purchase-bill-details-table-wrapper">

                        <table className="purchase-bill-details-table">

                            <thead>

                                <tr>

                                    <th>#</th>
                                    <th>Amount</th>
                                    <th>Payment Mode</th>
                                    <th>Transaction Details</th>
                                    <th>Payment Date</th>
                                    <th>Recorded By</th>
                                    <th>Status</th>

                                </tr>

                            </thead>


                            <tbody>

                                {payments.map(
                                    (payment, index) => (

                                        <tr
                                            key={
                                                payment._id ||
                                                index
                                            }
                                        >

                                            <td>
                                                {index + 1}
                                            </td>


                                            <td className="purchase-bill-details-total-cell">

                                                {formatMoney(
                                                    payment.amount
                                                )}

                                            </td>


                                            <td>

                                                <span className="purchase-bill-details-type">

                                                    {formatPaymentMode(
                                                        payment.paymentMode
                                                    )}

                                                </span>

                                            </td>


                                            <td>

                                                <div className="purchase-bill-details-payment-history-details">

                                                    {payment.upiApp && (

                                                        <div>

                                                            <span>
                                                                UPI App
                                                            </span>

                                                            <strong>
                                                                {formatUpiApp(
                                                                    payment.upiApp
                                                                )}
                                                            </strong>

                                                        </div>

                                                    )}


                                                    {payment.utrNumber && (

                                                        <div>

                                                            <span>
                                                                UTR
                                                            </span>

                                                            <strong>
                                                                {payment.utrNumber}
                                                            </strong>

                                                        </div>

                                                    )}


                                                    {payment.transactionReference && (

                                                        <div>

                                                            <span>
                                                                Transaction Ref.
                                                            </span>

                                                            <strong>
                                                                {
                                                                    payment.transactionReference
                                                                }
                                                            </strong>

                                                        </div>

                                                    )}


                                                    {payment.bankName && (

                                                        <div>

                                                            <span>
                                                                Bank
                                                            </span>

                                                            <strong>
                                                                {payment.bankName}
                                                            </strong>

                                                        </div>

                                                    )}


                                                    {payment.bankReference && (

                                                        <div>

                                                            <span>
                                                                Bank Ref.
                                                            </span>

                                                            <strong>
                                                                {payment.bankReference}
                                                            </strong>

                                                        </div>

                                                    )}


                                                    {payment.transferType && (

                                                        <div>

                                                            <span>
                                                                Transfer
                                                            </span>

                                                            <strong>
                                                                {formatTransferType(
                                                                    payment.transferType
                                                                )}
                                                            </strong>

                                                        </div>

                                                    )}


                                                    {payment.chequeNumber && (

                                                        <div>

                                                            <span>
                                                                Cheque No.
                                                            </span>

                                                            <strong>
                                                                {payment.chequeNumber}
                                                            </strong>

                                                        </div>

                                                    )}


                                                    {payment.receiptNumber && (

                                                        <div>

                                                            <span>
                                                                Receipt No.
                                                            </span>

                                                            <strong>
                                                                {payment.receiptNumber}
                                                            </strong>

                                                        </div>

                                                    )}


                                                    {payment.paymentSlip?.fileUrl && (

                                                        <div>

                                                            <span>
                                                                Payment Slip
                                                            </span>

                                                            <strong>

                                                                <a
                                                                    href={`${API_BASE_URL}${payment.paymentSlip.fileUrl}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    View Slip
                                                                </a>

                                                            </strong>

                                                        </div>

                                                    )}


                                                    {!payment.upiApp &&
                                                        !payment.utrNumber &&
                                                        !payment.transactionReference &&
                                                        !payment.bankName &&
                                                        !payment.bankReference &&
                                                        !payment.transferType &&
                                                        !payment.chequeNumber &&
                                                        !payment.receiptNumber &&
                                                        !payment.paymentSlip?.fileUrl && (

                                                            <span>
                                                                No additional
                                                                transaction details
                                                            </span>

                                                        )}

                                                </div>

                                            </td>


                                            <td>

                                                {formatDate(
                                                    payment.paymentDate
                                                )}

                                            </td>


                                            <td>

                                                {getUserName(
                                                    payment.recordedBy
                                                )}

                                            </td>


                                            <td>

                                                <span
                                                    className={`purchase-bill-details-badge purchase-bill-details-payment-${String(
                                                        payment.transactionStatus ||
                                                        "SUCCESS"
                                                    ).toLowerCase()}`}
                                                >

                                                    {payment.transactionStatus ||
                                                        "SUCCESS"}

                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* ==================================================
          AMOUNT SUMMARY
      ================================================== */}

            <div className="purchase-bill-details-summary-layout">

                <div className="purchase-bill-details-card purchase-bill-details-notes-card">

                    <div className="purchase-bill-details-card-header">

                        <h2>
                            Bill Notes
                        </h2>

                    </div>


                    <div className="purchase-bill-details-notes">

                        {purchase.notes ? (

                            purchase.notes

                        ) : (

                            <span className="purchase-bill-details-muted">

                                No notes available.

                            </span>

                        )}

                    </div>

                </div>


                <div className="purchase-bill-details-card">

                    <div className="purchase-bill-details-card-header">

                        <h2>
                            Amount Summary
                        </h2>

                    </div>


                    <div className="purchase-bill-details-amount-list">

                        <div>

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                {formatMoney(
                                    purchase.subtotal
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                GST Amount
                            </span>

                            <strong>
                                {formatMoney(
                                    purchase.gstAmount
                                )}
                            </strong>

                        </div>


                        <div className="purchase-bill-details-amount-total">

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                {formatMoney(
                                    purchase.totalAmount
                                )}
                            </strong>

                        </div>


                        <div className="purchase-bill-details-amount-paid">

                            <span>
                                Paid Amount
                            </span>

                            <strong>
                                {formatMoney(
                                    purchase.paidAmount
                                )}
                            </strong>

                        </div>


                        <div className="purchase-bill-details-amount-pending">

                            <span>
                                Pending Amount
                            </span>

                            <strong>
                                {formatMoney(
                                    purchase.pendingAmount
                                )}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
          VERIFICATION INFORMATION
      ================================================== */}

            {purchase.verified && (

                <div className="purchase-bill-details-card">

                    <div className="purchase-bill-details-card-header">

                        <h2>
                            Verification Information
                        </h2>

                    </div>


                    <div className="purchase-bill-details-info-grid">

                        <div className="purchase-bill-details-info-item">

                            <span>
                                Verified By
                            </span>

                            <strong>
                                {getUserName(
                                    purchase.verifiedBy
                                )}
                            </strong>

                        </div>


                        <div className="purchase-bill-details-info-item">

                            <span>
                                Verified At
                            </span>

                            <strong>
                                {formatDateTime(
                                    purchase.verifiedAt
                                )}
                            </strong>

                        </div>

                    </div>

                </div>

            )}


            {/* ==================================================
          RECORD PAYMENT
      ================================================== */}

            <div className="purchase-bill-details-card">

                <div className="purchase-bill-details-card-header">

                    <div>

                        <h2>
                            Vendor Payment
                        </h2>

                        <p className="purchase-bill-details-section-description">

                            Record a payment against this purchase
                            bill.

                        </p>

                    </div>

                </div>


                {!purchase.verified ? (

                    <div className="purchase-bill-details-payment-warning">

                        <strong>
                            Bill verification required
                        </strong>

                        <span>

                            This purchase bill must be verified
                            before a vendor payment can be
                            recorded.

                        </span>

                    </div>

                ) : !isPending ? (

                    <div className="purchase-bill-details-payment-success">

                        <strong>
                            Payment completed
                        </strong>

                        <span>

                            There is no pending amount for this
                            purchase bill.

                        </span>

                    </div>

                ) : (

                    <form
                        className="purchase-bill-details-payment-form"
                        onSubmit={handleRecordPayment}
                    >

                        {/* ==========================================
                PAYMENT SUMMARY
            ========================================== */}

                        <div className="purchase-bill-details-payment-info">

                            <div>

                                <span>
                                    Total Amount
                                </span>

                                <strong>
                                    {formatMoney(
                                        purchase.totalAmount
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Already Paid
                                </span>

                                <strong>
                                    {formatMoney(
                                        purchase.paidAmount
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Pending
                                </span>

                                <strong>
                                    {formatMoney(
                                        purchase.pendingAmount
                                    )}
                                </strong>

                            </div>

                        </div>


                        {/* ==========================================
                BASIC PAYMENT DETAILS
            ========================================== */}

                        <div className="purchase-bill-details-form-grid">

                            <div className="purchase-bill-details-form-group">

                                <label htmlFor="paymentAmount">
                                    Payment Amount
                                </label>

                                <input
                                    id="paymentAmount"
                                    type="number"
                                    min="0.01"
                                    max={Number(
                                        purchase.pendingAmount || 0
                                    )}
                                    step="0.01"
                                    value={paymentAmount}
                                    onChange={(event) =>
                                        setPaymentAmount(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter payment amount"
                                    required
                                />

                            </div>


                            <div className="purchase-bill-details-form-group">

                                <label htmlFor="paymentMode">
                                    Payment Mode
                                </label>

                                <select
                                    id="paymentMode"
                                    value={paymentMode}
                                    onChange={(event) => {
                                        const mode =
                                            event.target.value;

                                        setPaymentMode(mode);

                                        /*
                                          Clear electronic-payment
                                          fields when switching away.
                                        */

                                        if (
                                            mode !== "UPI" &&
                                            mode !== "BANK_TRANSFER"
                                        ) {
                                            setUtrNumber("");
                                            setPaymentSlip(null);
                                        }

                                        if (mode !== "UPI") {
                                            setUpiApp("");
                                        }

                                        if (mode !== "BANK_TRANSFER") {
                                            setTransferType("");
                                            setBankReference("");
                                        }

                                        if (mode !== "CHEQUE") {
                                            setChequeNumber("");
                                            setChequeDate("");
                                        }

                                        if (mode !== "CASH") {
                                            setReceiptNumber("");
                                        }
                                    }}
                                >

                                    <option value="CASH">
                                        Cash
                                    </option>

                                    <option value="UPI">
                                        UPI
                                    </option>

                                    <option value="BANK_TRANSFER">
                                        Bank Transfer
                                    </option>

                                    <option value="CHEQUE">
                                        Cheque
                                    </option>

                                    <option value="CARD">
                                        Card
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>

                                </select>

                            </div>


                            <div className="purchase-bill-details-form-group">

                                <label htmlFor="paymentDate">
                                    Payment Date
                                </label>

                                <input
                                    id="paymentDate"
                                    type="date"
                                    value={paymentDate}
                                    onChange={(event) =>
                                        setPaymentDate(
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            <div className="purchase-bill-details-form-group">

                                <label htmlFor="transactionStatus">
                                    Transaction Status
                                </label>

                                <select
                                    id="transactionStatus"
                                    value={transactionStatus}
                                    onChange={(event) =>
                                        setTransactionStatus(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="SUCCESS">
                                        Success
                                    </option>

                                    <option value="PENDING">
                                        Pending
                                    </option>

                                    <option value="FAILED">
                                        Failed
                                    </option>

                                    <option value="REVERSED">
                                        Reversed
                                    </option>

                                </select>

                            </div>


                            {/* ========================================
                  PAYMENT SLIP
              ======================================== */}

                            {(paymentMode === "UPI" ||
                                paymentMode === "BANK_TRANSFER") && (

                                    <div className="purchase-bill-details-form-group">

                                        <label htmlFor="paymentSlip">
                                            Payment Slip
                                        </label>

                                        <input
                                            id="paymentSlip"
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                                            onChange={(event) => {

                                                const file =
                                                    event.target.files?.[0] ||
                                                    null;

                                                setPaymentSlip(file);

                                            }}
                                            required
                                        />

                                        <small>
                                            JPG, JPEG, PNG, WEBP or PDF.
                                            Maximum size: 10 MB.
                                        </small>

                                        {paymentSlip && (
                                            <small>
                                                Selected: {paymentSlip.name}
                                            </small>
                                        )}

                                    </div>

                                )}

                        </div>


                        {/* ==========================================
                UPI DETAILS
            ========================================== */}

                        {paymentMode === "UPI" && (

                            <div className="purchase-bill-details-payment-extra-section">

                                <h3>
                                    UPI Details
                                </h3>

                                <div className="purchase-bill-details-form-grid">

                                    <div className="purchase-bill-details-form-group">

                                        <label htmlFor="upiApp">
                                            UPI App
                                        </label>

                                        <select
                                            id="upiApp"
                                            value={upiApp}
                                            onChange={(event) =>
                                                setUpiApp(
                                                    event.target.value
                                                )
                                            }
                                            required
                                        >

                                            <option value="">
                                                Select UPI App
                                            </option>

                                            <option value="PHONEPE">
                                                PhonePe
                                            </option>

                                            <option value="GOOGLE_PAY">
                                                Google Pay
                                            </option>

                                            <option value="PAYTM">
                                                Paytm
                                            </option>

                                            <option value="OTHER">
                                                Other UPI
                                            </option>

                                        </select>

                                    </div>


                                    <div className="purchase-bill-details-form-group">

                                        <label htmlFor="utrNumber">
                                            UTR Number
                                        </label>

                                        <input
                                            id="utrNumber"
                                            type="text"
                                            value={utrNumber}
                                            onChange={(event) =>
                                                setUtrNumber(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter UTR number"
                                            required
                                        />

                                    </div>


                                    <div className="purchase-bill-details-form-group">

                                        <label htmlFor="transactionReference">
                                            Transaction Reference
                                        </label>

                                        <input
                                            id="transactionReference"
                                            type="text"
                                            value={
                                                transactionReference
                                            }
                                            onChange={(event) =>
                                                setTransactionReference(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter transaction reference"
                                        />

                                    </div>

                                </div>

                            </div>

                        )}


                        {/* ==========================================
                BANK TRANSFER DETAILS
            ========================================== */}

                        {paymentMode ===
                            "BANK_TRANSFER" && (

                                <div className="purchase-bill-details-payment-extra-section">

                                    <h3>
                                        Bank Transfer Details
                                    </h3>

                                    <div className="purchase-bill-details-form-grid">

                                        <div className="purchase-bill-details-form-group">

                                            <label htmlFor="transferType">
                                                Transfer Type
                                            </label>

                                            <select
                                                id="transferType"
                                                value={transferType}
                                                onChange={(event) =>
                                                    setTransferType(
                                                        event.target.value
                                                    )
                                                }
                                                required
                                            >

                                                <option value="">
                                                    Select Transfer Type
                                                </option>

                                                <option value="NEFT">
                                                    NEFT
                                                </option>

                                                <option value="RTGS">
                                                    RTGS
                                                </option>

                                                <option value="IMPS">
                                                    IMPS
                                                </option>

                                                <option value="OTHER">
                                                    Other
                                                </option>

                                            </select>

                                        </div>


                                        <div className="purchase-bill-details-form-group">

                                            <label htmlFor="bankName">
                                                Bank Name
                                            </label>

                                            <input
                                                id="bankName"
                                                type="text"
                                                value={bankName}
                                                onChange={(event) =>
                                                    setBankName(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Enter bank name"
                                            />

                                        </div>


                                        <div className="purchase-bill-details-form-group">

                                            <label htmlFor="utrNumberBank">
                                                UTR Number
                                            </label>

                                            <input
                                                id="utrNumberBank"
                                                type="text"
                                                value={utrNumber}
                                                onChange={(event) =>
                                                    setUtrNumber(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Enter UTR number"
                                                required
                                            />

                                        </div>


                                        <div className="purchase-bill-details-form-group">

                                            <label htmlFor="bankReference">
                                                Bank Reference
                                            </label>

                                            <input
                                                id="bankReference"
                                                type="text"
                                                value={bankReference}
                                                onChange={(event) =>
                                                    setBankReference(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Enter bank reference"
                                            />

                                        </div>


                                        <div className="purchase-bill-details-form-group">

                                            <label htmlFor="transactionReferenceBank">
                                                Transaction Reference
                                            </label>

                                            <input
                                                id="transactionReferenceBank"
                                                type="text"
                                                value={
                                                    transactionReference
                                                }
                                                onChange={(event) =>
                                                    setTransactionReference(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Enter transaction reference"
                                            />

                                        </div>

                                    </div>

                                </div>

                            )}


                        {/* ==========================================
                CHEQUE DETAILS
            ========================================== */}

                        {paymentMode === "CHEQUE" && (

                            <div className="purchase-bill-details-payment-extra-section">

                                <h3>
                                    Cheque Details
                                </h3>

                                <div className="purchase-bill-details-form-grid">

                                    <div className="purchase-bill-details-form-group">

                                        <label htmlFor="chequeNumber">
                                            Cheque Number
                                        </label>

                                        <input
                                            id="chequeNumber"
                                            type="text"
                                            value={chequeNumber}
                                            onChange={(event) =>
                                                setChequeNumber(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter cheque number"
                                            required
                                        />

                                    </div>


                                    <div className="purchase-bill-details-form-group">

                                        <label htmlFor="chequeDate">
                                            Cheque Date
                                        </label>

                                        <input
                                            id="chequeDate"
                                            type="date"
                                            value={chequeDate}
                                            onChange={(event) =>
                                                setChequeDate(
                                                    event.target.value
                                                )
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="purchase-bill-details-form-group">

                                        <label htmlFor="bankNameCheque">
                                            Bank Name
                                        </label>

                                        <input
                                            id="bankNameCheque"
                                            type="text"
                                            value={bankName}
                                            onChange={(event) =>
                                                setBankName(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter bank name"
                                        />

                                    </div>

                                </div>

                            </div>

                        )}


                        {/* ==========================================
                CASH DETAILS
            ========================================== */}

                        {paymentMode === "CASH" && (

                            <div className="purchase-bill-details-payment-extra-section">

                                <h3>
                                    Cash Details
                                </h3>

                                <div className="purchase-bill-details-form-grid">

                                    <div className="purchase-bill-details-form-group">

                                        <label htmlFor="receiptNumber">
                                            Receipt Number
                                        </label>

                                        <input
                                            id="receiptNumber"
                                            type="text"
                                            value={receiptNumber}
                                            onChange={(event) =>
                                                setReceiptNumber(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter receipt number"
                                        />

                                    </div>

                                </div>

                            </div>

                        )}


                        {/* ==========================================
                PAYMENT NOTES
            ========================================== */}

                        <div className="purchase-bill-details-form-group purchase-bill-details-form-group-full">

                            <label htmlFor="paymentNotes">
                                Payment Notes
                            </label>

                            <textarea
                                id="paymentNotes"
                                value={paymentNotes}
                                onChange={(event) =>
                                    setPaymentNotes(
                                        event.target.value
                                    )
                                }
                                placeholder="Add any notes about this payment"
                                rows="3"
                            />

                        </div>


                        {/* ==========================================
                ACTION
            ========================================== */}

                        <div className="purchase-bill-details-payment-actions">

                            <button
                                type="submit"
                                className="purchase-bill-details-payment-btn"
                                disabled={recordingPayment}
                            >

                                {recordingPayment
                                    ? "Recording..."
                                    : "Record Payment"}

                            </button>

                        </div>

                    </form>

                )}

            </div>

        </div>
    );
};

export default PurchaseBillDetails;
