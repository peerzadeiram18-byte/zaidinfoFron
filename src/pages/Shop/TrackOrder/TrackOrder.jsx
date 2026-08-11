
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./TrackOrder.css";

import { getOrderById } from "../../../services/orderService";


// ======================================================
// TRACKING STATUS
// ======================================================

const TRACKING_STEPS = [
    {
        key: "PENDING",
        title: "Order Placed",
        description: "Your order has been successfully placed.",
        icon: "🛒",
    },
    {
        key: "CONFIRMED",
        title: "Order Confirmed",
        description: "Your order has been confirmed by our team.",
        icon: "✓",
    },
    {
        key: "PROCESSING",
        title: "Processing",
        description: "Your order is being prepared.",
        icon: "📦",
    },
    {
        key: "SHIPPED",
        title: "Shipped",
        description: "Your order has been handed over for delivery.",
        icon: "🚚",
    },
    {
        key: "DELIVERED",
        title: "Delivered",
        description: "Your order has been delivered successfully.",
        icon: "🏠",
    },
];


// ======================================================
// STATUS ORDER
// ======================================================

const STATUS_INDEX = {
    PENDING: 0,
    CONFIRMED: 1,
    PROCESSING: 2,
    SHIPPED: 3,
    DELIVERED: 4,
};


// ======================================================
// FORMAT DATE
// ======================================================

const formatDate = (date) => {

    if (!date) {
        return "Not available";
    }

    try {

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    } catch (error) {

        return "Not available";

    }
};


// ======================================================
// FORMAT TIME
// ======================================================

const formatTime = (date) => {

    if (!date) {
        return "";
    }

    try {

        return new Date(date).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });

    } catch (error) {

        return "";

    }
};


// ======================================================
// NORMALIZE STATUS
// ======================================================

const normalizeStatus = (status) => {

    if (!status) {
        return "PENDING";
    }

    return String(status).toUpperCase().trim();

};


// ======================================================
// TRACK ORDER
// ======================================================

const TrackOrder = () => {

    const { id } = useParams();

    const navigate = useNavigate();


    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [lastUpdated, setLastUpdated] = useState(null);


    // ==================================================
    // LOAD ORDER
    // ==================================================

    const loadOrder = useCallback(async () => {

        if (!id) {

            setError("Order ID is missing.");

            setLoading(false);

            return;

        }


        try {

            setError("");

            const res = await getOrderById(id);

            console.log("Tracking Order Response :", res);


            const data =
                res?.order ||
                res?.data?.order ||
                res?.data ||
                null;


            if (!data) {

                setError("Order not found.");

                setOrder(null);

                return;

            }


            setOrder(data);

            setLastUpdated(new Date());

        }

        catch (err) {

            console.error(
                "TRACK ORDER ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load order tracking."
            );

        }

        finally {

            setLoading(false);

        }

    }, [id]);


    // ==================================================
    // INITIAL LOAD
    // ==================================================

    useEffect(() => {

        loadOrder();

    }, [loadOrder]);


    // ==================================================
    // AUTO REFRESH
    //
    // Admin status change karega to customer tracking
    // page automatically update ho jayega.
    // ==================================================

    useEffect(() => {

        if (!id) {
            return;
        }


        const interval = setInterval(() => {

            loadOrder();

        }, 15000);


        return () => {

            clearInterval(interval);

        };

    }, [id, loadOrder]);


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (

            <div className="track-order-page">

                <div className="track-loading">

                    <div className="track-spinner"></div>

                    <h2>
                        Loading Order Tracking...
                    </h2>

                    <p>
                        Please wait while we fetch your order.
                    </p>

                </div>

            </div>

        );

    }


    // ==================================================
    // ERROR
    // ==================================================

    if (error || !order) {

        return (

            <div className="track-order-page">

                <div className="track-error-card">

                    <div className="track-error-icon">
                        !
                    </div>

                    <h2>
                        Order Not Found
                    </h2>

                    <p>
                        {error || "We could not find this order."}
                    </p>

                    <button
                        className="track-back-button"
                        onClick={() => navigate("/my-orders")}
                    >
                        ← Back to My Orders
                    </button>

                </div>

            </div>

        );

    }


    // ==================================================
    // CURRENT STATUS
    // ==================================================

    const currentStatus =
        normalizeStatus(order.orderStatus);


    const currentIndex =
        STATUS_INDEX[currentStatus] ?? 0;


    const isCancelled =
        currentStatus === "CANCELLED";


    const isDelivered =
        currentStatus === "DELIVERED";


    // ==================================================
    // PAYMENT
    // ==================================================

    const paymentStatus =
        normalizeStatus(order.paymentStatus);


    return (

        <div className="track-order-page">


            {/* =========================================
                TOP
            ========================================= */}

            <div className="track-order-header">

                <button
                    className="track-back-button"
                    onClick={() => navigate(`/order/${order._id}`)}
                >
                    ← Back to Order
                </button>

                <div>

                    <h1>
                        Track Your Order
                    </h1>

                    <p>
                        Follow your order from placement to delivery.
                    </p>

                </div>

            </div>


            {/* =========================================
                ORDER SUMMARY
            ========================================= */}

            <div className="track-summary-card">

                <div className="track-summary-item">

                    <span className="summary-label">
                        Order ID
                    </span>

                    <strong className="summary-value">
                        #{order._id}
                    </strong>

                </div>


                <div className="track-summary-item">

                    <span className="summary-label">
                        Order Date
                    </span>

                    <strong className="summary-value">
                        {formatDate(order.createdAt)}
                    </strong>

                </div>


                <div className="track-summary-item">

                    <span className="summary-label">
                        Total
                    </span>

                    <strong className="summary-value">
                        ₹ {Number(order.totalAmount || 0).toLocaleString("en-IN")}
                    </strong>

                </div>


                <div className="track-summary-item">

                    <span className="summary-label">
                        Payment
                    </span>

                    <strong
                        className={`summary-payment payment-${paymentStatus.toLowerCase()}`}
                    >
                        {paymentStatus}
                    </strong>

                </div>

            </div>


            {/* =========================================
                CURRENT STATUS
            ========================================= */}

            <div className="current-status-card">

                <div className="current-status-left">

                    <span className="current-status-label">
                        CURRENT STATUS
                    </span>

                    <h2>

                        {isCancelled
                            ? "Order Cancelled"
                            : isDelivered
                                ? "Order Delivered"
                                : TRACKING_STEPS[currentIndex]?.title
                        }

                    </h2>

                    <p>

                        {isCancelled
                            ? "Unfortunately, this order has been cancelled."
                            : TRACKING_STEPS[currentIndex]?.description
                        }

                    </p>

                </div>


                <div
                    className={`current-status-badge ${
                        isCancelled
                            ? "cancelled"
                            : isDelivered
                                ? "delivered"
                                : "active"
                    }`}
                >

                    {isCancelled
                        ? "CANCELLED"
                        : currentStatus
                    }

                </div>

            </div>


            {/* =========================================
                CANCELLED
            ========================================= */}

            {isCancelled && (

                <div className="cancelled-card">

                    <div className="cancelled-icon">
                        ✕
                    </div>

                    <div>

                        <h3>
                            Order Cancelled
                        </h3>

                        <p>
                            This order is no longer being processed.
                        </p>

                    </div>

                </div>

            )}


            {/* =========================================
                TRACKING TIMELINE
            ========================================= */}

            {!isCancelled && (

                <div className="tracking-card">

                    <div className="tracking-card-header">

                        <div>

                            <h2>
                                Order Tracking
                            </h2>

                            <p>
                                Your order progress
                            </p>

                        </div>


                        {lastUpdated && (

                            <span className="last-updated">

                                Updated{" "}
                                {formatTime(lastUpdated)}

                            </span>

                        )}

                    </div>


                    <div className="tracking-timeline">

                        {TRACKING_STEPS.map((step, index) => {

                            const completed =
                                index < currentIndex;

                            const active =
                                index === currentIndex;

                            const pending =
                                index > currentIndex;


                            return (

                                <div
                                    className={`tracking-step ${
                                        completed
                                            ? "completed"
                                            : active
                                                ? "active"
                                                : "pending"
                                    }`}
                                    key={step.key}
                                >


                                    {/* CONNECTOR */}

                                    {index > 0 && (

                                        <div
                                            className={`timeline-line ${
                                                index <= currentIndex
                                                    ? "line-completed"
                                                    : ""
                                            }`}
                                        ></div>

                                    )}


                                    {/* ICON */}

                                    <div className="timeline-icon">

                                        {completed
                                            ? "✓"
                                            : step.icon
                                        }

                                    </div>


                                    {/* CONTENT */}

                                    <div className="timeline-content">

                                        <h3>
                                            {step.title}
                                        </h3>

                                        <p>
                                            {step.description}
                                        </p>


                                        {active && (

                                            <span className="timeline-current">

                                                Current Status

                                            </span>

                                        )}


                                        {completed && (

                                            <span className="timeline-completed">

                                                Completed

                                            </span>

                                        )}


                                        {pending && (

                                            <span className="timeline-pending">

                                                Pending

                                            </span>

                                        )}

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                </div>

            )}


            {/* =========================================
                DELIVERY INFORMATION
            ========================================= */}

            {!isCancelled && (

                <div className="delivery-information">

                    <div className="delivery-info-card">

                        <div className="delivery-info-icon">
                            📦
                        </div>

                        <div>

                            <span>
                                ORDERED ON
                            </span>

                            <strong>
                                {formatDate(order.createdAt)}
                            </strong>

                        </div>

                    </div>


                    <div className="delivery-info-card">

                        <div className="delivery-info-icon">
                            🚚
                        </div>

                        <div>

                            <span>
                                DELIVERY STATUS
                            </span>

                            <strong>
                                {currentStatus}
                            </strong>

                        </div>

                    </div>


                    <div className="delivery-info-card">

                        <div className="delivery-info-icon">
                            🏠
                        </div>

                        <div>

                            <span>
                                DELIVERY CITY
                            </span>

                            <strong>
                                {order.shippingAddress?.city || "N/A"}
                            </strong>

                        </div>

                    </div>

                </div>

            )}


            {/* =========================================
                SHIPPING ADDRESS
            ========================================= */}

            <div className="tracking-address-card">

                <div className="tracking-section-title">

                    <span>
                        📍
                    </span>

                    <h2>
                        Delivery Address
                    </h2>

                </div>


                <div className="tracking-address">

                    <h3>
                        {order.shippingAddress?.fullName ||
                            order.shippingAddress?.name ||
                            "Customer"}
                    </h3>

                    <p>
                        {order.shippingAddress?.phone ||
                            order.shippingAddress?.mobile ||
                            ""}
                    </p>

                    <p>
                        {order.shippingAddress?.addressLine ||
                            order.shippingAddress?.streetAddress ||
                            ""}
                    </p>

                    <p>

                        {order.shippingAddress?.city || ""}

                        {order.shippingAddress?.city &&
                            order.shippingAddress?.state
                            ? ", "
                            : ""}

                        {order.shippingAddress?.state || ""}

                        {order.shippingAddress?.pincode
                            ? ` - ${order.shippingAddress.pincode}`
                            : ""}

                    </p>

                    {order.shippingAddress?.landmark && (

                        <p>
                            Landmark: {order.shippingAddress.landmark}
                        </p>

                    )}

                </div>

            </div>


            {/* =========================================
                PRODUCTS
            ========================================= */}

            <div className="tracking-products-card">

                <div className="tracking-section-title">

                    <span>
                        🛍️
                    </span>

                    <h2>
                        Order Items
                    </h2>

                </div>


                <div className="tracking-products">

                    {order.orderItems?.map((item, index) => (

                        <div
                            className="tracking-product"
                            key={item._id || `${item.product}-${index}`}
                        >

                            <div className="tracking-product-image">

                                <img
                                    src={
                                        item.imageUrl ||
                                        "https://via.placeholder.com/100"
                                    }
                                    alt={item.title || "Product"}
                                />

                            </div>


                            <div className="tracking-product-info">

                                <h3>
                                    {item.title}
                                </h3>

                                <p>
                                    Quantity: {item.quantity}
                                </p>

                            </div>


                            <div className="tracking-product-price">

                                <span>
                                    ₹ {Number(item.price || 0).toLocaleString("en-IN")}
                                </span>

                                <small>
                                    × {item.quantity}
                                </small>

                            </div>

                        </div>

                    ))}

                </div>

            </div>


            {/* =========================================
                REFRESH
            ========================================= */}

            <div className="tracking-refresh">

                <p>
                    Tracking automatically refreshes every 15 seconds.
                </p>

                <button
                    onClick={loadOrder}
                >
                    ↻ Refresh Status
                </button>

            </div>


        </div>

    );

};


export default TrackOrder;
