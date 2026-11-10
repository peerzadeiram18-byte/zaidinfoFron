import { useEffect, useState } from "react";
import "./WalkInOrders.css";
import { toast } from "react-toastify";

import {
    getAllOrders
} from "../../../services/orderService";

import {
    getInvoiceByOrderId,
    createInvoice
} from "../../../services/invoiceService";

import WalkInInvoice from "./WalkInInvoice/WalkInInvoice";


// ======================================
// CUSTOMER SOURCE LABELS
// "How did you come to know about ZAID Infotech?"
// key = value saved in database, label = shown in table
// ======================================

const CUSTOMER_SOURCE_LABELS = {
    GOOGLE: "Google Search / Google Maps",
    INSTAGRAM_FACEBOOK: "Instagram / Facebook",
    YOUTUBE: "YouTube",
    REFERRAL: "Friends or Family Referral",
    EXISTING_CUSTOMER: "Existing Customer",
    SHOP_BOARD: "Walk-in / Shop Board",
    ONLINE_AD: "Online Advertisement",
    INFLUENCER: "Influencer / Blogger Recommendation",
    WHATSAPP: "WhatsApp",
    OTHER: "Other",
};


// Returns { label, detail }
// - label  = readable source name
// - detail = free text, only when source is OTHER
const getCustomerSource = (order) => {

    const key = String(
        order?.customerSource || ""
    )
        .trim()
        .toUpperCase();

    if (!key) {

        return {
            label: "",
            detail: ""
        };

    }

    const label =
        CUSTOMER_SOURCE_LABELS[key] ||
        key;

    const detail =
        key === "OTHER"
            ? String(
                order?.customerSourceOther || ""
            ).trim()
            : "";

    return {
        label,
        detail
    };

};


// ======================================
// INVOICE RESPONSE -> INVOICE OBJECT
// Backend: { success, data: invoice }
// ======================================

const extractInvoice = (response) => {

    const invoice =
        response?.data?.invoice ||
        response?.data ||
        response?.invoice ||
        null;

    if (
        invoice &&
        typeof invoice === "object" &&
        !Array.isArray(invoice)
    ) {

        return invoice;

    }

    return null;

};


function WalkInOrders() {

    const [orders, setOrders] = useState([]);

    const [filteredOrders, setFilteredOrders] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    // ======================================
    // INVOICE POPUP STATES
    // ======================================

    const [invoiceData, setInvoiceData] = useState(null);

    const [autoPrint, setAutoPrint] = useState(false);

    const [openingId, setOpeningId] = useState("");

    useEffect(() => {

        loadOrders();

    }, []);

    const loadOrders = async () => {

        try {

            setLoading(true);

            const res = await getAllOrders();

            console.log("ALL ORDERS :", res);

            const list =
                res.orders ||
                res.data ||
                [];

            // Only Walk-In Orders

            const walkInOrders = list.filter(

                (order) =>

                    order.orderSource === "WALK_IN"

            );

            setOrders(walkInOrders);

            setFilteredOrders(walkInOrders);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    // ======================================
    // SEARCH
    // ======================================

    const handleSearch = (value) => {

        setSearch(value);

        if (!value) {

            setFilteredOrders(orders);

            return;

        }

        const keyword = value.toLowerCase();

        const result = orders.filter((order) => {

            const source = getCustomerSource(order);

            const sourceText =
                `${source.label} ${source.detail}`
                    .toLowerCase();

            return (

                order._id.toLowerCase().includes(keyword)

                ||

                order.shippingAddress?.fullName

                    ?.toLowerCase()

                    .includes(keyword)

                ||

                order.shippingAddress?.phone

                    ?.includes(keyword)

                ||

                sourceText.includes(keyword)

            );

        });

        setFilteredOrders(result);

    };

    // ======================================
    // DATE FILTER
    // ======================================

    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {

        if (!selectedDate) {

            setFilteredOrders(orders);

            return;

        }

        const result = orders.filter((order) => {

            const orderDate = new Date(order.createdAt)
                .toISOString()
                .split("T")[0];

            return orderDate === selectedDate;

        });

        setFilteredOrders(result);

    }, [selectedDate, orders]);

    // ======================================
    // AUTO PRINT
    //
    // Print button dabane par invoice popup khulta hai,
    // phir popup ka "PRINT INVOICE" button apne aap
    // click ho jata hai.
    // ======================================

    useEffect(() => {

        if (!invoiceData || !autoPrint) {

            return;

        }

        const timer = setTimeout(() => {

            const printButton =
                document.querySelector(
                    ".wkinv-print-btn"
                );

            if (printButton) {

                printButton.click();

            }
            else {

                toast.error(
                    "Print button not found. Please use PRINT INVOICE in the popup."
                );

            }

            setAutoPrint(false);

        }, 600);

        return () => clearTimeout(timer);

    }, [invoiceData, autoPrint]);

    // ======================================
    // TOTAL SALES
    // ======================================

    const totalSales = filteredOrders.reduce(

        (sum, order) =>

            sum + Number(order.totalAmount || 0),

        0

    );

    // ======================================
    // TOTAL ORDERS
    // ======================================

    const totalOrders = filteredOrders.length;

    // ======================================
    // OPEN INVOICE (VIEW / PRINT)
    //
    // 1. Order ka invoice backend se lao
    // 2. Invoice na ho aur order PAID ho
    //    to poochkar naya invoice banao
    // 3. Kuch bhi fail ho to order ki details
    //    dikha do (blank screen kabhi nahi)
    // ======================================

    const openInvoice = async (
        order,
        shouldPrint = false
    ) => {

        if (!order?._id) {

            toast.error("Order ID not found");

            return;

        }

        try {

            setOpeningId(order._id);

            let invoice = null;

            try {

                const response =
                    await getInvoiceByOrderId(
                        order._id
                    );

                invoice = extractInvoice(response);

            }

            catch (error) {

                // 404 = invoice abhi bana hi nahi
                if (error?.response?.status !== 404) {

                    throw error;

                }

                const isPaid =
                    String(
                        order.paymentStatus || ""
                    ).toUpperCase() === "PAID";

                if (!isPaid) {

                    toast.warning(
                        "Invoice sirf paid order ka banta hai. Order details dikha rahe hain."
                    );

                }
                else if (
                    window.confirm(
                        "Is order ka invoice abhi bana nahi hai. Abhi bana dein?"
                    )
                ) {

                    const created =
                        await createInvoice(
                            order._id
                        );

                    invoice = extractInvoice(created);

                    toast.success(
                        "Invoice created successfully"
                    );

                }

            }

            setInvoiceData(invoice || order);

            setAutoPrint(shouldPrint);

        }

        catch (error) {

            console.error(
                "OPEN INVOICE ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load invoice. Showing order details."
            );

            // Fallback: order ki details dikhao
            setInvoiceData(order);

            setAutoPrint(shouldPrint);

        }

        finally {

            setOpeningId("");

        }

    };

    // ======================================
    // VIEW ORDER
    // ======================================

    const viewOrder = (order) => {

        openInvoice(order, false);

    };

    // ======================================
    // PRINT INVOICE
    // ======================================

    const printInvoice = (order) => {

        openInvoice(order, true);

    };

    // ======================================
    // CLOSE INVOICE
    // ======================================

    const closeInvoice = () => {

        setInvoiceData(null);

        setAutoPrint(false);

    };

    // ======================================
    // RETURN JSX
    // ======================================

    return (

        <div className="walkin-orders-page">

            <div className="page-header">

                <h2>

                    Walk-In Orders

                </h2>

            </div>

            <div className="filter-section">

                <input

                    type="text"

                    placeholder="Search Customer / Phone / Order ID / Source"

                    value={search}

                    onChange={(e)=>

                        handleSearch(e.target.value)

                    }

                />

                <input

                    type="date"

                    value={selectedDate}

                    onChange={(e)=>

                        setSelectedDate(e.target.value)

                    }

                />

            </div>

            <div className="summary-box">

                <div className="summary-card">

                    <h3>

                        {totalOrders}

                    </h3>

                    <p>

                        Total Orders

                    </p>

                </div>

                <div className="summary-card">

                    <h3>

                        ₹ {totalSales}

                    </h3>

                    <p>

                        Total Sales

                    </p>

                </div>

            </div>

            <div className="orders-table">

                <table>

                    <thead>

                        <tr>

                            <th>Order ID</th>

                            <th>Date</th>

                            <th>Customer</th>

                            <th>Phone</th>

                            <th>Customer Source</th>

                            <th>Products</th>

                            <th>Qty</th>

                            <th>Total</th>

                            <th>Payment</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ?

                            (

                                <tr>

                                    <td colSpan="11">

                                        Loading...

                                    </td>

                                </tr>

                            )

                            :

                            filteredOrders.length===0 ?

                            (

                                <tr>

                                    <td colSpan="11">

                                        No Walk-In Orders Found

                                    </td>

                                </tr>

                            )

                            :

                            filteredOrders.map((order)=>{

                                const source =
                                    getCustomerSource(order);

                                const isOpening =
                                    openingId === order._id;

                                return (

                                <tr key={order._id}>

                                    <td>

                                        {order._id.slice(-8)}

                                    </td>

                                    <td>

                                        {

                                            new Date(

                                                order.createdAt

                                            ).toLocaleDateString()

                                        }

                                    </td>

                                    <td>

                                        {

                                            order.shippingAddress

                                                ?.fullName

                                        }

                                    </td>

                                    <td>

                                        {

                                            order.shippingAddress

                                                ?.phone

                                        }

                                    </td>

                                    <td>

                                        {

                                            source.label ?

                                            (

                                                <div
                                                    className="source-cell"
                                                >

                                                    <span
                                                        className="source-badge"
                                                    >

                                                        {source.label}

                                                    </span>

                                                    {

                                                        source.detail && (

                                                            <small>

                                                                {source.detail}

                                                            </small>

                                                        )

                                                    }

                                                </div>

                                            )

                                            :

                                            (

                                                <span
                                                    className="source-empty"
                                                >

                                                    -

                                                </span>

                                            )

                                        }

                                    </td>

                                    <td>

                                        {

                                            order.orderItems.length

                                        }

                                    </td>

                                    <td>

                                        {

                                            order.orderItems.reduce(

                                                (sum,item)=>

                                                sum+

                                                item.quantity,

                                                0

                                            )

                                        }

                                    </td>

                                    <td>

                                        ₹

                                        {

                                            order.totalAmount

                                        }

                                    </td>

                                    <td>

                                        <span
                                            className={
                                                order.paymentStatus==="PAID"
                                                ?
                                                "paid"
                                                :
                                                "pending"
                                            }
                                        >

                                            {

                                                order.paymentStatus

                                            }

                                        </span>

                                    </td>

                                    <td>

                                        <span
                                            className="order-status"
                                        >

                                            {

                                                order.orderStatus

                                            }

                                        </span>

                                    </td>

                                    <td>

                                        <div
                                            className="action-buttons"
                                        >

                                            <button

                                                type="button"

                                                className="view-btn"

                                                disabled={isOpening}

                                                onClick={()=>

                                                    viewOrder(order)

                                                }

                                            >

                                                {

                                                    isOpening ?

                                                    "Opening..."

                                                    :

                                                    "View"

                                                }

                                            </button>

                                            <button

                                                type="button"

                                                className="print-btn"

                                                disabled={isOpening}

                                                onClick={()=>

                                                    printInvoice(order)

                                                }

                                            >

                                                Print

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                                );

                            })

                        }

                    </tbody>

                </table>

            </div>

            {/* INVOICE POPUP */}

            {

                invoiceData && (

                    <WalkInInvoice

                        order={invoiceData}

                        onClose={closeInvoice}

                    />

                )

            }

        </div>

    );

}

export default WalkInOrders;