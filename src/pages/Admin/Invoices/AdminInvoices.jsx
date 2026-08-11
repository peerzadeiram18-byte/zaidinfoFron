import { useEffect, useState } from "react";

import {
    getInvoices,
} from "../../../services/invoiceService";
import { toast } from "react-toastify";

import WalkInInvoice from "../../Receptionist/WalkInOrders/WalkInInvoice/WalkInInvoice";

import "./AdminInvoices.css";

function AdminInvoices() {

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // ==========================================
    // LOAD INVOICES
    // ==========================================

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {

        try {

            setLoading(true);

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

                            invoiceItems:
                                invoice?.items?.length,

                            orderItems:
                                invoice?.order?.orderItems?.length,

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

        }

        catch (error) {

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

        }

        finally {

            setLoading(false);

        }

    };

    // ==========================================
    // GET CUSTOMER NAME
    // ==========================================

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

    // ==========================================
    // GET ORDER SOURCE
    // ==========================================

    const getOrderSource = (invoice) => {

        const source =
            invoice?.orderSource ||
            invoice?.order?.orderSource ||
            invoice?.orderSourceType ||
            invoice?.order?.orderSourceType ||
            "WALK_IN";

        return String(source).toUpperCase();

    };

    // ==========================================
    // GET AMOUNT
    // ==========================================

    const getAmount = (invoice) => {

        return Number(
            invoice?.totalAmount ??
            invoice?.grandTotal ??
            invoice?.order?.totalAmount ??
            0
        );

    };

    // ==========================================
    // CONVERT INVOICE TO ORDER FORMAT
    //
    // IMPORTANT:
    //
    // WalkInInvoice component expects ORDER
    // object, not INVOICE object.
    //
    // So we convert invoice -> order.
    // ==========================================

    const invoiceToOrder = (invoice) => {

        if (!invoice) {
            return null;
        }

        // --------------------------------------
        // If backend already populated order,
        // use that as the base.
        // --------------------------------------

        const originalOrder =
            invoice?.order &&
            typeof invoice.order === "object"
                ? invoice.order
                : {};

        // --------------------------------------
        // Convert invoice.items -> orderItems
        // --------------------------------------

        const invoiceItems =
            Array.isArray(invoice?.items)
                ? invoice.items
                : [];

        const originalOrderItems =
            Array.isArray(originalOrder?.orderItems)
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

                    // Product ID
                    product:
                        item?.product?._id ||
                        item?.product ||
                        null,

                    // Product object for UI
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

        // --------------------------------------
        // ADDRESS
        // --------------------------------------

        const shippingAddress =
            originalOrder?.shippingAddress ||
            invoice?.billingAddress ||
            invoice?.shippingAddress ||
            {};

        // --------------------------------------
        // RETURN ORDER FORMAT
        // --------------------------------------

        const convertedOrder = {

            // Original order data first
            ...originalOrder,

            // ----------------------------------
            // IDs
            // ----------------------------------

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

            // ----------------------------------
            // Customer
            // ----------------------------------

            user:
                originalOrder?.user ||
                invoice?.user ||
                null,

            // ----------------------------------
            // Items
            // ----------------------------------

            orderItems,

            items: invoiceItems,

            // ----------------------------------
            // Amounts
            // ----------------------------------

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

            // ----------------------------------
            // Status
            // ----------------------------------

            paymentStatus:
                originalOrder?.paymentStatus ||
                invoice?.paymentStatus ||
                "PAID",

            orderStatus:
                originalOrder?.orderStatus ||
                "DELIVERED",

            // ----------------------------------
            // Payment
            // ----------------------------------

            paymentMethod:
                originalOrder?.paymentMethod ||
                invoice?.paymentMethod ||
                invoice?.payment?.paymentMethod ||
                "UPI",

            payment:
                originalOrder?.payment ||
                invoice?.payment ||
                null,

            // ----------------------------------
            // Source
            // ----------------------------------

            orderSource:
                originalOrder?.orderSource ||
                invoice?.orderSource ||
                "WALK_IN",

            // ----------------------------------
            // Address
            // ----------------------------------

            shippingAddress,

            billingAddress:
                invoice?.billingAddress ||
                originalOrder?.billingAddress ||
                shippingAddress,

            // ----------------------------------
            // Invoice information
            // ----------------------------------

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

        console.log(
            "CONVERTED INVOICE -> ORDER:",
            convertedOrder
        );

        return convertedOrder;

    };

    // ==========================================
    // OPEN INVOICE
    // ==========================================

    const openInvoice = (invoice) => {

        console.log(
            "SELECTED INVOICE:",
            invoice
        );

        const convertedOrder =
            invoiceToOrder(invoice);

        console.log(
            "ORDER SENT TO WALKIN INVOICE:",
            convertedOrder
        );

        setSelectedInvoice(
            convertedOrder
        );

    };

    // ==========================================
    // CLOSE INVOICE
    // ==========================================

    const closeInvoice = () => {

        setSelectedInvoice(null);

    };

    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="admin-invoices-page">

            {/* ==================================
                HEADER
            ================================== */}

            <div className="admin-invoices-header">

                <div>

                    <h1>
                        Invoices
                    </h1>

                    <p>
                        All online and walk-in invoices
                    </p>

                </div>

                <button
                    type="button"
                    onClick={loadInvoices}
                    disabled={loading}
                >

                    {loading
                        ? "Loading..."
                        : "Refresh"
                    }

                </button>

            </div>

            {/* ==================================
                LOADING
            ================================== */}

            {loading ? (

                <div className="empty-invoices">

                    <p>
                        Loading invoices...
                    </p>

                </div>

            ) : invoices.length === 0 ? (

                /* ==================================
                   EMPTY
                ================================== */

                <div className="empty-invoices">

                    <h3>
                        No invoices found
                    </h3>

                    <p>
                        Online or Walk-In invoices
                        will appear here after payment.
                    </p>

                </div>

            ) : (

                /* ==================================
                   INVOICE LIST
                ================================== */

                <div className="invoice-list">

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
                                        invoice?._id
                                    }
                                >

                                    {/* ==========================
                                        LEFT
                                    ========================== */}

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

                                                {source === "ONLINE"
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

                                    {/* ==========================
                                        RIGHT
                                    ========================== */}

                                    <button
                                        type="button"
                                        className="view-invoice-btn"
                                        onClick={() =>
                                            openInvoice(
                                                invoice
                                            )
                                        }
                                    >

                                        View Invoice

                                    </button>

                                </div>

                            );

                        }
                    )}

                </div>

            )}

            {/* ==================================
                INVOICE MODAL
            ================================== */}

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

        </div>

    );

}

export default AdminInvoices;