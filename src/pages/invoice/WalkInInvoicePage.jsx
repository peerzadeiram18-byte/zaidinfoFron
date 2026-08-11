import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    getInvoiceByOrderId,
    createInvoice,
} from "../../services/invoiceService";

import "./WalkInInvoicePage.css";


function WalkInInvoicePage() {

    const { orderId } = useParams();

    const navigate = useNavigate();

    const invoiceRef = useRef(null);

    const [invoice, setInvoice] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // LOAD INVOICE
    // ==========================================

    useEffect(() => {

        const loadInvoice = async () => {

            try {

                setLoading(true);

                setError("");


                // First try existing invoice

                const response =
                    await getInvoiceByOrderId(orderId);


                if (response?.data) {

                    setInvoice(response.data);

                    return;

                }

            } catch (error) {

                // Invoice doesn't exist yet.
                // We will create it below.

                console.log(
                    "Invoice not found, creating invoice..."
                );

            } finally {

                setLoading(false);

            }

        };


        if (orderId) {

            loadInvoice();

        }

    }, [orderId]);


    // ==========================================
    // CREATE INVOICE IF NOT FOUND
    // ==========================================

    useEffect(() => {

        const generateInvoice = async () => {

            if (!orderId || invoice) {
                return;
            }

            try {

                setLoading(true);

                const response =
                    await createInvoice(orderId);


                if (response?.data) {

                    setInvoice(response.data);

                }

            } catch (error) {

                console.error(
                    "Invoice creation failed:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    "Unable to create invoice."
                );

            } finally {

                setLoading(false);

            }

        };


        generateInvoice();

    }, [orderId, invoice]);


    // ==========================================
    // PRINT
    // ==========================================

    const handlePrint = () => {

        window.print();

    };


    // ==========================================
    // BACK
    // ==========================================

    const handleBack = () => {

        navigate(-1);

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="invoice-loading">

                <h2>
                    Loading Invoice...
                </h2>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div className="invoice-error">

                <h2>
                    Invoice Error
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={handleBack}
                >
                    Go Back
                </button>

            </div>

        );

    }


    if (!invoice) {

        return (

            <div className="invoice-error">

                <h2>
                    Invoice not available
                </h2>

                <button
                    onClick={handleBack}
                >
                    Go Back
                </button>

            </div>

        );

    }


    // ==========================================
    // DATA
    // ==========================================

    const customer =
        invoice.billingAddress || {};

    const items =
        invoice.items || [];


    const order =
        invoice.order || {};


    const payment =
        invoice.payment || {};


    return (

        <div className="invoice-page">


            {/* =================================
                ACTION BUTTONS
            ================================= */}

            <div className="invoice-actions no-print">

                <button
                    className="invoice-back-btn"
                    onClick={handleBack}
                >
                    ← Back
                </button>


                <button
                    className="invoice-print-btn"
                    onClick={handlePrint}
                >
                    🖨 Print Invoice
                </button>

            </div>



            {/* =================================
                INVOICE
            ================================= */}

            <div
                ref={invoiceRef}
                className="invoice-paper"
            >


                {/* HEADER */}

                <div className="invoice-header">

                    <div>

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

                    </div>


                    <div className="invoice-title">

                        <h2>
                            INVOICE
                        </h2>

                        <p>
                            {invoice.orderSource === "WALK_IN"
                                ? "WALK-IN TAX INVOICE"
                                : "TAX INVOICE"}
                        </p>

                    </div>

                </div>


                <hr />



                {/* INVOICE INFORMATION */}

                <div className="invoice-info-grid">


                    <div>

                        <strong>
                            Invoice No
                        </strong>

                        <span>
                            {invoice.invoiceNumber}
                        </span>

                    </div>


                    <div>

                        <strong>
                            Order No
                        </strong>

                        <span>
                            #{order._id || invoice.referenceId}
                        </span>

                    </div>


                    <div>

                        <strong>
                            Date
                        </strong>

                        <span>

                            {invoice.invoiceDate
                                ? new Date(
                                    invoice.invoiceDate
                                ).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )
                                : "-"
                            }

                        </span>

                    </div>


                    <div>

                        <strong>
                            Order Type
                        </strong>

                        <span>
                            {invoice.orderSource}
                        </span>

                    </div>


                </div>



                <hr />



                {/* CUSTOMER */}

                <div className="customer-section">


                    <div className="customer-column">

                        <h3>
                            BILL TO
                        </h3>

                        <p>
                            <strong>
                                {customer.fullName ||
                                    invoice.user?.firstName ||
                                    "Customer"}
                            </strong>
                        </p>

                        <p>
                            Phone:{" "}
                            {customer.phone ||
                                invoice.user?.phone ||
                                "-"}
                        </p>

                        <p>
                            Email:{" "}
                            {invoice.user?.email ||
                                "-"}
                        </p>

                    </div>



                    <div className="customer-column">

                        <h3>
                            ADDRESS
                        </h3>

                        <p>
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

                        <p>
                            {customer.country ||
                                "India"}
                        </p>

                    </div>


                </div>



                <hr />



                {/* ITEMS */}

                <h3 className="section-title">
                    ITEMS
                </h3>


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
                                Discount
                            </th>

                            <th>
                                Total
                            </th>

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

                                        <strong>
                                            {item.title}
                                        </strong>

                                        {item.description && (

                                            <small>
                                                {
                                                    item.description
                                                }
                                            </small>

                                        )}

                                    </td>

                                    <td>
                                        {item.quantity}
                                    </td>

                                    <td>
                                        ₹{" "}
                                        {Number(
                                            item.price || 0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </td>

                                    <td>
                                        ₹{" "}
                                        {Number(
                                            item.discountAmount ||
                                            0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </td>

                                    <td>

                                        ₹{" "}
                                        {Number(
                                            item.total ||
                                            (
                                                item.price *
                                                item.quantity
                                            ) ||
                                            0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>



                <hr />



                {/* TOTAL */}

                <div className="invoice-summary">


                    <div className="summary-row">

                        <span>
                            Subtotal
                        </span>

                        <span>
                            ₹{" "}
                            {Number(
                                invoice.subtotal || 0
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </span>

                    </div>


                    <div className="summary-row">

                        <span>
                            Discount
                        </span>

                        <span>
                            ₹{" "}
                            {Number(
                                invoice.discount || 0
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </span>

                    </div>


                    <div className="summary-row grand">

                        <strong>
                            TOTAL
                        </strong>

                        <strong>
                            ₹{" "}
                            {Number(
                                invoice.totalAmount || 0
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>


                    <div className="summary-row">

                        <span>
                            Paid
                        </span>

                        <span>
                            ₹{" "}
                            {Number(
                                invoice.paidAmount || 0
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </span>

                    </div>


                    <div className="summary-row balance">

                        <strong>
                            Balance
                        </strong>

                        <strong>
                            ₹{" "}
                            {Number(
                                invoice.balanceAmount || 0
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>


                </div>



                <hr />



                {/* PAYMENT */}

                <div className="payment-section">


                    <h3>
                        PAYMENT INFORMATION
                    </h3>


                    <p>

                        <strong>
                            Payment Status:
                        </strong>{" "}

                        <span className="paid-status">

                            {invoice.paymentStatus}

                        </span>

                    </p>


                    <p>

                        <strong>
                            Payment Method:
                        </strong>{" "}

                        {invoice.paymentMethod ||
                            "CASH"}

                    </p>


                    {payment?._id && (

                        <p>

                            <strong>
                                Transaction ID:
                            </strong>{" "}

                            {payment.paymentId ||
                                payment._id}

                        </p>

                    )}


                </div>



                {/* WALK-IN */}

                {invoice.orderSource ===
                    "WALK_IN" && (

                    <div className="walkin-badge">

                        WALK-IN ORDER

                    </div>

                )}



                {/* FOOTER */}

                <div className="invoice-footer">

                    <p>
                        Thank you for shopping with
                        Zaid Infotech!
                    </p>

                    <p>
                        This is a computer-generated
                        invoice.
                    </p>


                    <div className="signature">

                        ______________________

                        <br />

                        Authorized Signature

                    </div>

                </div>


            </div>

        </div>

    );

}


export default WalkInInvoicePage;