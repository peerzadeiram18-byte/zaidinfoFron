// import React from "react";

// import "./OrderSuccess.css";

// import {

//     useLocation,

//     useNavigate

// } from "react-router-dom";

// const OrderSuccess = () => {

//     const location = useLocation();

//     const navigate = useNavigate();

//     const {

//         order

//     } = location.state || {};

//     if (!order) {

//         return (

//             <div className="order-success-empty">

//                 <h2>

//                     No Order Found

//                 </h2>

//             </div>

//         );

//     }

//     return (

//         <div className="order-success-container">

//             <div className="order-success-card">

//                 <div className="success-icon">

//                     ✔

//                 </div>

//                 <h1>

//                     Order Placed Successfully

//                 </h1>

//                 <p>

//                     Thank you for shopping with us.

//                 </p>

//                 <hr />

//                 <div className="order-details">

//                     {/* <p>

//                         <strong>

//                             Order ID

//                         </strong>

//                     </p>

//                     <span>

//                         {order._id}

//                     </span> */}

//                     <p>

//                         <strong>

//                             Total Amount

//                         </strong>

//                     </p>

//                     <span>

//                         ₹ {order.totalAmount}

//                     </span>

//                     <p>

//                         <strong>

//                             Order Status

//                         </strong>

//                     </p>

//                     <span>

//                         {order.orderStatus}

//                     </span>

//                 </div>

//                 <button

//                     className="orders-btn"

//                     onClick={() =>

//                         navigate("/my-orders")

//                     }

//                 >

//                     View My Orders

//                 </button>

//                 <button

//                     className="shop-btn"

//                     onClick={() =>

//                         navigate("/shop")

//                     }

//                 >

//                     Continue Shopping

//                 </button>

//             </div>

//         </div>

//     );

// };

// export default OrderSuccess;


import React from "react";

import "./OrderSuccess.css";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";


// =====================================================
// NUMBER HELPER
// =====================================================

const toNumber = (value, fallback = 0) => {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;

};


// =====================================================
// MONEY FORMAT
// =====================================================

const money = (value) => {

    return toNumber(value).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    );

};


// =====================================================
// STATUS FORMAT
// =====================================================

const formatStatus = (value) => {

    if (!value) {
        return "Pending";
    }

    return String(value)
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(
            /\b\w/g,
            (char) => char.toUpperCase()
        );

};


// =====================================================
// ORDER SUCCESS
// =====================================================

const OrderSuccess = () => {

    const location =
        useLocation();

    const navigate =
        useNavigate();


    // =================================================
    // GET ALL PAYMENT SUCCESS DATA
    // =================================================

    const {
        order = null,
        payment = null,
        invoice = null,
        paymentSummary = null,
    } = location.state || {};


    // =================================================
    // NO ORDER
    // =================================================

    if (!order) {

        return (

            <div className="order-success-container">

                <div className="order-success-card order-success-empty">

                    <div className="success-icon">
                        !
                    </div>

                    <h2>
                        No Order Found
                    </h2>

                    <p>
                        We could not find the order details.
                    </p>


                    <div className="order-success-actions">

                        <button
                            type="button"
                            className="orders-btn"
                            onClick={() =>
                                navigate("/my-orders")
                            }
                        >
                            View My Orders
                        </button>


                        <button
                            type="button"
                            className="shop-btn"
                            onClick={() =>
                                navigate("/shop")
                            }
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // =================================================
    // ORDER ID
    // =================================================

    const orderId =
        order?._id ||
        order?.id ||
        order?.orderId ||
        "";


    // =================================================
    // PRODUCT SUBTOTAL
    // =================================================
    //
    // PAYMENT SUMMARY HAS FIRST PRIORITY.
    //
    // This is important because Payment.jsx already
    // sends the exact checkout subtotal.
    //
    // =================================================

    let calculatedProductSubtotal = 0;


    if (
        Array.isArray(order?.orderItems)
    ) {

        calculatedProductSubtotal =
            order.orderItems.reduce(
                (total, item) => {

                    const quantity =
                        toNumber(
                            item?.quantity,
                            1
                        );


                    const price =
                        toNumber(
                            item?.price,
                            item?.sellingPrice ||
                            item?.unitPrice ||
                            0
                        );


                    return (
                        total +
                        (
                            price *
                            quantity
                        )
                    );

                },
                0
            );

    }


    const productSubtotal =
        toNumber(

            paymentSummary?.subtotal,

            toNumber(
                order?.subtotal,
                toNumber(
                    order?.subTotal,
                    toNumber(
                        order?.itemsSubtotal,
                        calculatedProductSubtotal
                    )
                )
            )

        );


    // =================================================
    // OFFER DISCOUNT
    // =================================================

    const offerDiscount =
        toNumber(

            paymentSummary?.offerDiscount,

            toNumber(
                paymentSummary?.productDiscount,
                toNumber(
                    order?.offerDiscount,
                    toNumber(
                        order?.productDiscount,
                        0
                    )
                )
            )

        );


    // =================================================
    // COUPON DISCOUNT
    // =================================================

    const couponDiscount =
        toNumber(

            paymentSummary?.couponDiscount,

            toNumber(
                paymentSummary?.couponDiscountAmount,
                toNumber(
                    order?.couponDiscount,
                    toNumber(
                        order?.couponDiscountAmount,
                        0
                    )
                )
            )

        );


    // =================================================
    // TOTAL DISCOUNT
    // =================================================

    const totalDiscount =
        Math.min(

            Math.max(
                offerDiscount +
                couponDiscount,
                0
            ),

            productSubtotal

        );


    // =================================================
    // TAXABLE AMOUNT
    // =================================================
    //
    // PAYMENT SUMMARY FIRST.
    //
    // This is the exact taxable amount used on
    // the payment screen.
    //
    // =================================================

    const calculatedTaxableAmount =
        Math.max(

            productSubtotal -
            totalDiscount,

            0

        );


    const taxableAmount =
        toNumber(

            paymentSummary?.taxableAmount,

            toNumber(
                order?.taxableAmount,
                calculatedTaxableAmount
            )

        );


    // =================================================
    // GST PERCENTAGE
    // =================================================

    const gstPercentage =
        toNumber(

            paymentSummary?.gstPercentage,

            toNumber(
                order?.gstPercentage,
                toNumber(
                    order?.gstRate,
                    18
                )
            )

        );


    // =================================================
    // GST AMOUNT
    // =================================================
    //
    // Again paymentSummary first.
    //
    // =================================================

    const calculatedGST =
        Math.max(

            (
                taxableAmount *
                gstPercentage
            ) / 100,

            0

        );


    const gstAmount =
        toNumber(

            paymentSummary?.gstAmount,

            toNumber(
                order?.gstAmount,
                toNumber(
                    order?.gst,
                    calculatedGST
                )
            )

        );


    // =================================================
    // SHIPPING
    // =================================================

    const shippingCharge =
        toNumber(

            paymentSummary?.shippingCharge,

            toNumber(
                order?.shippingCharge,
                toNumber(
                    order?.shippingAmount,
                    toNumber(
                        order?.shippingCharges,
                        0
                    )
                )
            )

        );


    // =================================================
    // OTHER CHARGES
    // =================================================

    const otherCharges =
        toNumber(

            paymentSummary?.otherCharges,

            toNumber(
                order?.otherCharges,
                toNumber(
                    order?.additionalCharges,
                    toNumber(
                        order?.handlingCharges,
                        0
                    )
                )
            )

        );


    // =================================================
    // CALCULATED TOTAL
    // =================================================

    const calculatedTotal =
        Math.max(

            taxableAmount +
            shippingCharge +
            gstAmount +
            otherCharges,

            0

        );


    // =================================================
    // FINAL TOTAL
    // =================================================
    //
    // VERY IMPORTANT:
    //
    // Payment.jsx already sends:
    //
    // paymentSummary.total = finalAmount
    //
    // Therefore paymentSummary.total gets FIRST
    // priority.
    //
    // This fixes the screenshot problem where:
    //
    // GST = ₹9,000
    // Total = ₹50,000
    //
    // =================================================

    const finalAmount =
        toNumber(

            paymentSummary?.total,

            toNumber(
                paymentSummary?.finalAmount,
                toNumber(
                    paymentSummary?.payableAmount,
                    toNumber(
                        payment?.amount,
                        toNumber(
                            order?.finalAmount,
                            toNumber(
                                order?.grandTotal,
                                calculatedTotal
                            )
                        )
                    )
                )
            )

        );


    // =================================================
    // PAYMENT METHOD
    // =================================================

    const paymentMethod =
        payment?.paymentMethod ||
        payment?.method ||
        order?.paymentMethod ||
        order?.payment?.paymentMethod ||
        order?.payment?.method ||
        "ONLINE";


    // =================================================
    // PAYMENT STATUS
    // =================================================

    const paymentStatus =
        payment?.paymentStatus ||
        payment?.status ||
        order?.paymentStatus ||
        order?.payment?.status ||
        "PAID";


    // =================================================
    // ORDER STATUS
    // =================================================

    const orderStatus =
        order?.orderStatus ||
        order?.status ||
        "CONFIRMED";


    // =================================================
    // COUPON CODE
    // =================================================

    const couponCode =
        order?.couponCode ||
        order?.coupon?.code ||
        "";


    // =================================================
    // DEBUG
    // =================================================

    console.log(
        "=========================================="
    );

    console.log(
        "ORDER SUCCESS - FINAL PAYMENT BREAKDOWN"
    );

    console.log(
        "Order:",
        order
    );

    console.log(
        "Payment:",
        payment
    );

    console.log(
        "Payment Summary:",
        paymentSummary
    );

    console.log(
        "Product Subtotal:",
        productSubtotal
    );

    console.log(
        "Offer Discount:",
        offerDiscount
    );

    console.log(
        "Coupon Discount:",
        couponDiscount
    );

    console.log(
        "Taxable Amount:",
        taxableAmount
    );

    console.log(
        "GST Percentage:",
        gstPercentage
    );

    console.log(
        "GST Amount:",
        gstAmount
    );

    console.log(
        "Shipping:",
        shippingCharge
    );

    console.log(
        "Other Charges:",
        otherCharges
    );

    console.log(
        "Calculated Total:",
        calculatedTotal
    );

    console.log(
        "PAYMENT SUMMARY TOTAL:",
        paymentSummary?.total
    );

    console.log(
        "FINAL AMOUNT SHOWN:",
        finalAmount
    );

    console.log(
        "=========================================="
    );


    // =================================================
    // BUTTONS
    // =================================================

    const handleViewOrders = () => {

        navigate("/my-orders");

    };


    const handleContinueShopping = () => {

        navigate("/shop");

    };


    // =================================================
    // RENDER
    // =================================================

    return (

        <div className="order-success-container">

            <div className="order-success-card">


                {/* =====================================
                    SUCCESS ICON
                ====================================== */}

                <div
                    className="success-icon"
                    aria-label="Order successful"
                >
                    ✓
                </div>


                {/* =====================================
                    TITLE
                ====================================== */}

                <h1>
                    Order Placed Successfully
                </h1>


                <p>
                    Thank you for shopping with us.
                </p>


                <hr />


                {/* =====================================
                    ORDER DETAILS
                ====================================== */}

                <div className="order-details">


                    {/* =================================
                        ORDER ID
                    ================================== */}

                    {orderId && (

                        <div className="order-detail-row">

                            <p>
                                <strong>
                                    Order ID
                                </strong>
                            </p>

                            <span className="order-id-value">
                                {orderId}
                            </span>

                        </div>

                    )}


                    {/* =================================
                        PRODUCT SUBTOTAL
                    ================================== */}

                    <div className="order-detail-row">

                        <p>
                            <strong>
                                Product Subtotal
                            </strong>
                        </p>

                        <span>
                            ₹ {money(
                                productSubtotal
                            )}
                        </span>

                    </div>


                    {/* =================================
                        OFFER DISCOUNT
                    ================================== */}

                    {offerDiscount > 0 && (

                        <div className="order-detail-row discount-row">

                            <p>
                                <strong>
                                    Offer Discount
                                </strong>
                            </p>

                            <span>
                                - ₹ {money(
                                    offerDiscount
                                )}
                            </span>

                        </div>

                    )}


                    {/* =================================
                        COUPON
                    ================================== */}

                    {couponDiscount > 0 && (

                        <div className="order-detail-row discount-row">

                            <p>
                                <strong>
                                    Coupon Discount
                                </strong>

                                {couponCode && (

                                    <small
                                        style={{
                                            display: "block",
                                            fontWeight: "normal",
                                        }}
                                    >
                                        {couponCode}
                                    </small>

                                )}

                            </p>

                            <span>
                                - ₹ {money(
                                    couponDiscount
                                )}
                            </span>

                        </div>

                    )}


                    {/* =================================
                        TOTAL DISCOUNT
                    ================================== */}

                    {totalDiscount > 0 && (

                        <div className="order-detail-row">

                            <p>
                                <strong>
                                    Total Discount
                                </strong>
                            </p>

                            <span>
                                - ₹ {money(
                                    totalDiscount
                                )}
                            </span>

                        </div>

                    )}


                    {/* =================================
                        TAXABLE AMOUNT
                    ================================== */}

                    <div className="order-detail-row">

                        <p>
                            <strong>
                                Taxable Amount
                            </strong>
                        </p>

                        <span>
                            ₹ {money(
                                taxableAmount
                            )}
                        </span>

                    </div>


                    {/* =================================
                        GST
                    ================================== */}

                    <div className="order-detail-row">

                        <p>
                            <strong>
                                GST ({money(
                                    gstPercentage
                                )}%)
                            </strong>
                        </p>

                        <span>
                            ₹ {money(
                                gstAmount
                            )}
                        </span>

                    </div>


                    {/* =================================
                        SHIPPING
                    ================================== */}

                    <div className="order-detail-row">

                        <p>
                            <strong>
                                Shipping
                            </strong>
                        </p>

                        <span>

                            {shippingCharge > 0

                                ? `₹ ${money(
                                    shippingCharge
                                )}`

                                : "Free"

                            }

                        </span>

                    </div>


                    {/* =================================
                        OTHER CHARGES
                    ================================== */}

                    {otherCharges > 0 && (

                        <div className="order-detail-row">

                            <p>
                                <strong>
                                    Other Charges
                                </strong>
                            </p>

                            <span>
                                ₹ {money(
                                    otherCharges
                                )}
                            </span>

                        </div>

                    )}


                    {/* =================================
                        FINAL AMOUNT
                    ================================== */}

                    <div className="order-detail-row order-final-total">

                        <p>
                            <strong>
                                Total Amount
                            </strong>
                        </p>

                        <span>
                            ₹ {money(
                                finalAmount
                            )}
                        </span>

                    </div>


                    {/* =================================
                        PAYMENT METHOD
                    ================================== */}

                    <div className="order-detail-row">

                        <p>
                            <strong>
                                Payment Method
                            </strong>
                        </p>

                        <span>
                            {formatStatus(
                                paymentMethod
                            )}
                        </span>

                    </div>


                    {/* =================================
                        PAYMENT STATUS
                    ================================== */}

                    <div className="order-detail-row">

                        <p>
                            <strong>
                                Payment Status
                            </strong>
                        </p>

                        <span>
                            {formatStatus(
                                paymentStatus
                            )}
                        </span>

                    </div>


                    {/* =================================
                        ORDER STATUS
                    ================================== */}

                    <div className="order-detail-row">

                        <p>
                            <strong>
                                Order Status
                            </strong>
                        </p>

                        <span>
                            {formatStatus(
                                orderStatus
                            )}
                        </span>

                    </div>


                </div>


                {/* =====================================
                    ACTION BUTTONS
                ====================================== */}

                <div className="order-success-actions">

                    <button
                        type="button"
                        className="orders-btn"
                        onClick={
                            handleViewOrders
                        }
                    >
                        View My Orders
                    </button>


                    <button
                        type="button"
                        className="shop-btn"
                        onClick={
                            handleContinueShopping
                        }
                    >
                        Continue Shopping
                    </button>

                </div>


            </div>

        </div>

    );

};


export default OrderSuccess;