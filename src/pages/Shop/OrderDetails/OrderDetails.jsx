// import React, {
//     useCallback,
//     useEffect,
//     useState
// } from "react";

// import "./OrderDetails.css";

// import {
//     useNavigate,
//     useParams
// } from "react-router-dom";

// import {
//     getOrderById
// } from "../../../services/orderService";


// const OrderDetails = () => {

//     const navigate = useNavigate();

//     const { id } = useParams();


//     const [order, setOrder] = useState(null);

//     const [loading, setLoading] = useState(true);


//     // ==================================================
//     // LOAD ORDER
//     // ==================================================

//     const loadOrder = useCallback(async () => {

//         try {

//             setLoading(true);


//             const res =
//                 await getOrderById(id);


//             console.log(
//                 "Order Details Response:",
//                 res
//             );


//             const data =
//                 res?.order ||
//                 res?.data?.order ||
//                 res?.data ||
//                 null;


//             setOrder(data);

//         }

//         catch (err) {

//             console.error(
//                 "ORDER DETAILS ERROR:",
//                 err
//             );

//             setOrder(null);

//         }

//         finally {

//             setLoading(false);

//         }

//     }, [id]);


//     useEffect(() => {

//         loadOrder();

//     }, [loadOrder]);


//     // ==================================================
//     // LOADING
//     // ==================================================

//     if (loading) {

//         return (

//             <div className="order-details-page">

//                 <h2>
//                     Loading Order...
//                 </h2>

//             </div>

//         );

//     }


//     // ==================================================
//     // NOT FOUND
//     // ==================================================

//     if (!order) {

//         return (

//             <div className="order-details-page">

//                 <h2>
//                     Order Not Found
//                 </h2>

//                 <button
//                     onClick={() =>
//                         navigate("/my-orders")
//                     }
//                 >
//                     ← Back to My Orders
//                 </button>

//             </div>

//         );

//     }


//     return (

//         <div className="order-details-page">


//             {/* ==========================================
//                 HEADER
//             ========================================== */}

//             <div className="order-details-header">

//                 <div>

//                     <h1>
//                         Order Details
//                     </h1>

//                     <p>
//                         Order #{order._id}
//                     </p>

//                 </div>


//                 {/* ======================================
//                     TRACK BUTTON
//                 ====================================== */}

//                 {/* <button
//                     className="track-order-button"
//                     onClick={() =>
//                         navigate(
//                             `/order/${order._id}/track`
//                         )
//                     }
//                 >
//                     🚚 Track Order
//                 </button> */}


//                 {order.shipmentId && (
//     <button
//         className="track-order-button"
//         onClick={() =>
//             navigate(
//                 `/shipment/${order.shipmentId}/tracking`
//             )
//         }
//     >
//         🚚 Track Shipment
//     </button>
// )}

//             </div>


//             {/* ==========================================
//                 ORDER INFORMATION
//             ========================================== */}

//             <div className="order-info">

//                 <p>
//                     <strong>
//                         Order ID :
//                     </strong>{" "}
//                     {order._id}
//                 </p>


//                 <p>
//                     <strong>
//                         Status :
//                     </strong>{" "}
//                     {order.orderStatus}
//                 </p>


//                 <p>
//                     <strong>
//                         Payment :
//                     </strong>{" "}
//                     {order.paymentStatus}
//                 </p>


//                 <p>
//                     <strong>
//                         Total :
//                     </strong>{" "}
//                     ₹ {order.totalAmount}
//                 </p>


//                 <p>
//                     <strong>
//                         Date :
//                     </strong>{" "}
//                     {order.createdAt
//                         ? new Date(
//                             order.createdAt
//                         ).toLocaleDateString("en-IN")
//                         : "N/A"
//                     }
//                 </p>

//             </div>


//             {/* ==========================================
//                 SHIPPING ADDRESS
//             ========================================== */}

//             <h2>
//                 Shipping Address
//             </h2>


//             <div className="address-box">

//                 <p>

//                     <strong>
//                         Name :
//                     </strong>{" "}

//                     {
//                         order.shippingAddress?.fullName ||
//                         order.shippingAddress?.name ||
//                         "N/A"
//                     }

//                 </p>


//                 <p>

//                     <strong>
//                         Mobile :
//                     </strong>{" "}

//                     {
//                         order.shippingAddress?.phone ||
//                         order.shippingAddress?.mobile ||
//                         "N/A"
//                     }

//                 </p>


//                 <p>

//                     <strong>
//                         Address :
//                     </strong>{" "}

//                     {
//                         order.shippingAddress?.addressLine ||
//                         order.shippingAddress?.streetAddress ||
//                         "N/A"
//                     }

//                 </p>


//                 <p>

//                     {
//                         order.shippingAddress?.city ||
//                         ""
//                     }

//                     {
//                         order.shippingAddress?.city &&
//                         order.shippingAddress?.state
//                             ? ", "
//                             : ""
//                     }

//                     {
//                         order.shippingAddress?.state ||
//                         ""
//                     }

//                 </p>


//                 <p>

//                     {
//                         order.shippingAddress?.pincode ||
//                         ""
//                     }

//                 </p>


//                 {
//                     order.shippingAddress?.landmark && (

//                         <p>

//                             <strong>
//                                 Landmark :
//                             </strong>{" "}

//                             {
//                                 order.shippingAddress.landmark
//                             }

//                         </p>

//                     )
//                 }

//             </div>


//             {/* ==========================================
//                 PRODUCTS
//             ========================================== */}

//             <h2>
//                 Products
//             </h2>


//             <div className="order-products">

//                 {
//                     order.orderItems?.map(
//                         (item, index) => (

//                             <div
//                                 className="product-box"
//                                 key={
//                                     item._id ||
//                                     `${item.product}-${index}`
//                                 }
//                             >

//                                 <img
//                                     src={
//                                         item.imageUrl ||
//                                         "https://via.placeholder.com/120"
//                                     }
//                                     alt={
//                                         item.title ||
//                                         "Product"
//                                     }
//                                 />


//                                 <div>

//                                     <h3>
//                                         {item.title}
//                                     </h3>


//                                     <p>
//                                         Quantity :{" "}
//                                         {item.quantity}
//                                     </p>


//                                     <p>
//                                         Price : ₹{" "}
//                                         {item.price}
//                                     </p>


//                                     <p>

//                                         Total : ₹{" "}

//                                         {
//                                             Number(
//                                                 item.price || 0
//                                             ) *
//                                             Number(
//                                                 item.quantity || 0
//                                             )
//                                         }

//                                     </p>

//                                 </div>

//                             </div>

//                         )
//                     )
//                 }

//             </div>


//             {/* ==========================================
//                 ORDER TOTAL
//             ========================================== */}

//             <div className="order-total-box">

//                 <h2>
//                     Order Summary
//                 </h2>


//                 <p>

//                     <strong>
//                         Total Amount :
//                     </strong>{" "}

//                     ₹ {order.totalAmount}

//                 </p>


//                 <p>

//                     <strong>
//                         Order Status :
//                     </strong>{" "}

//                     {order.orderStatus}

//                 </p>


//                 <p>

//                     <strong>
//                         Payment Status :
//                     </strong>{" "}

//                     {order.paymentStatus}

//                 </p>

//             </div>


//         </div>

//     );

// };


// export default OrderDetails;




import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import "./OrderDetails.css";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getOrderById,
} from "../../../services/orderService";


// ==================================================
// NUMBER HELPER
// ==================================================

const toNumber = (value, fallback = 0) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
};


// ==================================================
// ROUND MONEY
// ==================================================

const roundMoney = (value) => {
    return Math.round(
        (toNumber(value) + Number.EPSILON) * 100
    ) / 100;
};


// ==================================================
// MONEY FORMAT
// ==================================================

const money = (value) => {
    return toNumber(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};


// ==================================================
// FORMAT STATUS
// ==================================================

const formatStatus = (value) => {
    if (!value) {
        return "N/A";
    }

    return String(value)
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};


// ==================================================
// PAYMENT SUMMARY STORAGE
// ==================================================

const getPaymentSummaryKey = (orderId) => {
    return `order_payment_summary_${orderId}`;
};


const getSavedPaymentSummary = (orderId) => {
    if (!orderId) {
        return null;
    }

    try {
        const raw = localStorage.getItem(
            getPaymentSummaryKey(orderId)
        );

        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw);

        return parsed && typeof parsed === "object"
            ? parsed
            : null;
    } catch (error) {
        console.error(
            "PAYMENT SUMMARY STORAGE ERROR:",
            error
        );

        return null;
    }
};


// ==================================================
// READ FIRST AVAILABLE NUMERIC FIELD
// Preserves an explicitly saved value of zero.
// ==================================================

const firstNumber = (values, fallback = 0) => {
    for (const value of values) {
        if (
            value !== null &&
            value !== undefined &&
            value !== "" &&
            Number.isFinite(Number(value))
        ) {
            return Number(value);
        }
    }

    return fallback;
};


// ==================================================
// ORDER TOTAL CALCULATION
//
// Priority:
// 1. Saved payment summary for exact final total.
// 2. Persisted order breakdown fields.
// 3. Calculate from product prices and quantities.
//
// Do not use order.totalAmount as the calculated total:
// it may contain only the product amount.
// ==================================================

const calculateOrderBreakdown = (order) => {
    const orderId =
        order?._id ||
        order?.id ||
        order?.orderId ||
        "";

    const saved = getSavedPaymentSummary(orderId);

    const items = Array.isArray(order?.orderItems)
        ? order.orderItems
        : [];

    // ----------------------------------------------
    // 1. PRODUCT SUBTOTAL
    // ----------------------------------------------

    let calculatedOriginalSubtotal = 0;
    let calculatedSellingSubtotal = 0;
    let calculatedOfferDiscount = 0;

    items.forEach((item) => {
        const quantity = Math.max(
            toNumber(item?.quantity, 1),
            1
        );

        const price = Math.max(
            firstNumber([
                item?.price,
                item?.sellingPrice,
                item?.unitPrice,
                item?.product?.pricing?.sellingPrice,
            ]),
            0
        );

        const originalPrice = Math.max(
            firstNumber([
                item?.originalPrice,
                item?.mrp,
                item?.product?.pricing?.mrp,
            ], price),
            price
        );

        calculatedOriginalSubtotal +=
            originalPrice * quantity;

        calculatedSellingSubtotal +=
            price * quantity;

        const itemDiscount = Math.max(
            firstNumber([
                item?.discountAmount,
            ], originalPrice - price),
            0
        );

        calculatedOfferDiscount +=
            itemDiscount * quantity;
    });

    // Prefer saved subtotal, then backend subtotal,
    // then the calculated item subtotal.
    const productSubtotal = roundMoney(
        firstNumber([
            saved?.subtotal,
            order?.subtotal,
            order?.subTotal,
            order?.itemsSubtotal,
            order?.productSubtotal,
        ], calculatedOriginalSubtotal || calculatedSellingSubtotal)
    );

    // ----------------------------------------------
    // 2. OFFER DISCOUNT
    // ----------------------------------------------

    const offerDiscount = roundMoney(
        Math.max(
            firstNumber([
                saved?.offerDiscount,
                saved?.productDiscount,
                order?.offerDiscount,
                order?.productDiscount,
                order?.discountFromOffers,
            ], calculatedOfferDiscount),
            0
        )
    );

    // ----------------------------------------------
    // 3. COUPON DISCOUNT
    // ----------------------------------------------

    const couponDiscount = roundMoney(
        Math.max(
            firstNumber([
                saved?.couponDiscount,
                saved?.couponDiscountAmount,
                order?.couponDiscount,
                order?.couponDiscountAmount,
                order?.coupon?.discountAmount,
            ]),
            0
        )
    );

    // Never discount more than the subtotal.
    const totalDiscount = roundMoney(
        Math.min(
            offerDiscount + couponDiscount,
            Math.max(productSubtotal, 0)
        )
    );

    // ----------------------------------------------
    // 4. TAXABLE AMOUNT
    // ----------------------------------------------

    const calculatedTaxableAmount = Math.max(
        productSubtotal - totalDiscount,
        0
    );

    const taxableAmount = roundMoney(
        Math.max(
            firstNumber([
                saved?.taxableAmount,
                order?.taxableAmount,
            ], calculatedTaxableAmount),
            0
        )
    );

    // ----------------------------------------------
    // 5. GST PERCENTAGE
    // ----------------------------------------------

    const gstPercentage = Math.max(
        firstNumber([
            saved?.gstPercentage,
            order?.gstPercentage,
            order?.gstRate,
            order?.taxPercentage,
        ], 18),
        0
    );

    // ----------------------------------------------
    // 6. GST AMOUNT
    // ----------------------------------------------

    const calculatedGST = roundMoney(
        taxableAmount * gstPercentage / 100
    );

    const gstAmount = roundMoney(
        Math.max(
            firstNumber([
                saved?.gstAmount,
                order?.gstAmount,
                order?.gst,
                order?.totalGST,
                order?.taxAmount,
                order?.tax,
                order?.gstDetails?.totalGST,
                order?.gstDetails?.gstAmount,
            ], calculatedGST),
            0
        )
    );

    // ----------------------------------------------
    // 7. SHIPPING
    // ----------------------------------------------

    const shippingCharge = roundMoney(
        Math.max(
            firstNumber([
                saved?.shippingCharge,
                saved?.shipping,
                order?.shippingCharge,
                order?.shippingAmount,
                order?.shippingCost,
                order?.shippingCharges,
                order?.deliveryCharge,
                order?.deliveryCharges,
                order?.shipping?.amount,
            ]),
            0
        )
    );

    // ----------------------------------------------
    // 8. OTHER CHARGES
    // ----------------------------------------------

    const otherCharges = roundMoney(
        Math.max(
            firstNumber([
                saved?.otherCharges,
                order?.otherCharges,
                order?.additionalCharges,
                order?.handlingCharges,
            ]),
            0
        )
    );

    // ----------------------------------------------
    // 9. FINAL CALCULATED TOTAL
    //
    // Taxable Amount + GST + Shipping + Other Charges
    // ----------------------------------------------

    const calculatedFinalAmount = roundMoney(
        Math.max(
            taxableAmount +
            gstAmount +
            shippingCharge +
            otherCharges,
            0
        )
    );

    // Use an exact saved payment summary total only
    // when the stored field is a valid numeric value.
    const savedFinalAmount = firstNumber([
        saved?.total,
        saved?.finalAmount,
        saved?.payableAmount,
    ], NaN);

    const hasSavedFinalAmount =
        Number.isFinite(savedFinalAmount) &&
        savedFinalAmount >= 0;

    const finalAmount = roundMoney(
        hasSavedFinalAmount
            ? savedFinalAmount
            : calculatedFinalAmount
    );

    const couponCode =
        order?.couponCode ||
        order?.coupon?.code ||
        saved?.couponCode ||
        "";

    const paymentMethod =
        order?.paymentMethod ||
        order?.payment?.paymentMethod ||
        order?.payment?.method ||
        saved?.paymentMethod ||
        "ONLINE";

    const paymentStatus =
        order?.paymentStatus ||
        order?.payment?.status ||
        saved?.paymentStatus ||
        "PENDING";

    return {
        productSubtotal,
        calculatedSellingSubtotal: roundMoney(
            calculatedSellingSubtotal
        ),
        offerDiscount,
        couponDiscount,
        totalDiscount,
        taxableAmount,
        gstPercentage,
        gstAmount,
        shippingCharge,
        otherCharges,
        calculatedFinalAmount,
        finalAmount,
        couponCode,
        paymentMethod,
        paymentStatus,
        hasSavedPaymentSummary: Boolean(saved),
    };
};


// ==================================================
// COMPONENT
// ==================================================

const OrderDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // ----------------------------------------------
    // LOAD ORDER
    // ----------------------------------------------

    const loadOrder = useCallback(async () => {
        if (!id) {
            setOrder(null);
            setErrorMessage("Order ID not found.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");

            const res = await getOrderById(id);

            const data =
                res?.order ||
                res?.data?.order ||
                res?.data?.data ||
                res?.data ||
                res;

            if (!data || typeof data !== "object") {
                setOrder(null);
                setErrorMessage("Order not found.");
                return;
            }

            setOrder(data);
        } catch (error) {
            console.error("ORDER DETAILS ERROR:", error);

            setOrder(null);

            setErrorMessage(
                error?.response?.data?.message ||
                "Unable to load order details."
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadOrder();
    }, [loadOrder]);

    // ----------------------------------------------
    // CALCULATE SUMMARY
    // ----------------------------------------------

    const breakdown = useMemo(() => {
        if (!order) {
            return null;
        }

        return calculateOrderBreakdown(order);
    }, [order]);

    // ----------------------------------------------
    // LOADING
    // ----------------------------------------------

    if (loading) {
        return (
            <div className="order-details-page">
                <h2>Loading Order...</h2>
            </div>
        );
    }

    // ----------------------------------------------
    // NOT FOUND / ERROR
    // ----------------------------------------------

    if (!order) {
        return (
            <div className="order-details-page">
                <h2>Order Not Found</h2>

                <p>
                    {errorMessage || "Order could not be loaded."}
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/my-orders")}
                >
                    ← Back to My Orders
                </button>
            </div>
        );
    }

    // ----------------------------------------------
    // SAFE ORDER DATA
    // ----------------------------------------------

    const orderId =
        order?._id ||
        order?.id ||
        id;

    const shippingAddress =
        order?.shippingAddress || {};

    const orderItems = Array.isArray(order?.orderItems)
        ? order.orderItems
        : [];

    // ----------------------------------------------
    // UI
    // ----------------------------------------------

    return (
        <div className="order-details-page">

            {/* HEADER */}

            <div className="order-details-header">
                <div>
                    <h1>Order Details</h1>
                    <p>Order #{orderId}</p>
                </div>

                {order.shipmentId && (
                    <button
                        type="button"
                        className="track-order-button"
                        onClick={() =>
                            navigate(
                                `/shipment/${order.shipmentId}/tracking`
                            )
                        }
                    >
                        🚚 Track Shipment
                    </button>
                )}
            </div>

            {/* ORDER INFORMATION */}

            <div className="order-info">
                <p>
                    <strong>Order ID :</strong>{" "}
                    {orderId}
                </p>

                <p>
                    <strong>Status :</strong>{" "}
                    {formatStatus(order.orderStatus)}
                </p>

                <p>
                    <strong>Payment :</strong>{" "}
                    {formatStatus(breakdown.paymentStatus)}
                </p>

                <p>
                    <strong>Payment Method :</strong>{" "}
                    {formatStatus(breakdown.paymentMethod)}
                </p>

                <p>
                    <strong>Total :</strong>{" "}
                    ₹ {money(breakdown.finalAmount)}
                </p>

                <p>
                    <strong>Date :</strong>{" "}
                    {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                              "en-IN"
                          )
                        : "N/A"}
                </p>
            </div>

            {/* SHIPPING ADDRESS */}

            <h2>Shipping Address</h2>

            <div className="address-box">
                <p>
                    <strong>Name :</strong>{" "}
                    {shippingAddress.fullName ||
                        shippingAddress.name ||
                        "N/A"}
                </p>

                <p>
                    <strong>Mobile :</strong>{" "}
                    {shippingAddress.phone ||
                        shippingAddress.mobile ||
                        "N/A"}
                </p>

                <p>
                    <strong>Address :</strong>{" "}
                    {shippingAddress.addressLine ||
                        shippingAddress.streetAddress ||
                        shippingAddress.address ||
                        "N/A"}
                </p>

                <p>
                    {shippingAddress.city || ""}
                    {shippingAddress.city &&
                    shippingAddress.state
                        ? ", "
                        : ""}
                    {shippingAddress.state || ""}
                </p>

                <p>
                    {shippingAddress.pincode ||
                        shippingAddress.postalCode ||
                        ""}
                </p>

                {shippingAddress.landmark && (
                    <p>
                        <strong>Landmark :</strong>{" "}
                        {shippingAddress.landmark}
                    </p>
                )}
            </div>

            {/* PRODUCTS */}

            <h2>Products</h2>

            <div className="order-products">
                {orderItems.length > 0 ? (
                    orderItems.map((item, index) => {
                        const quantity = Math.max(
                            toNumber(item?.quantity, 1),
                            1
                        );

                        const price = Math.max(
                            firstNumber([
                                item?.price,
                                item?.sellingPrice,
                                item?.unitPrice,
                                item?.product?.pricing?.sellingPrice,
                            ]),
                            0
                        );

                        const originalPrice = Math.max(
                            firstNumber([
                                item?.originalPrice,
                                item?.mrp,
                                item?.product?.pricing?.mrp,
                            ], price),
                            price
                        );

                        const itemDiscount = Math.max(
                            firstNumber([
                                item?.discountAmount,
                            ], originalPrice - price),
                            0
                        );

                        const itemTotal = roundMoney(
                            price * quantity
                        );

                        return (
                            <div
                                className="product-box"
                                key={
                                    item?._id ||
                                    item?.product?._id ||
                                    `${item?.product || item?.title || "product"}-${index}`
                                }
                            >
                                <img
                                    src={
                                        item?.imageUrl ||
                                        item?.product?.imageUrl ||
                                        "https://via.placeholder.com/120"
                                    }
                                    alt={
                                        item?.title ||
                                        item?.product?.name ||
                                        "Product"
                                    }
                                />

                                <div>
                                    <h3>
                                        {item?.title ||
                                            item?.product?.name ||
                                            item?.productName ||
                                            item?.name ||
                                            "Product"}
                                    </h3>

                                    <p>
                                        <strong>Quantity :</strong>{" "}
                                        {quantity}
                                    </p>

                                    <p>
                                        <strong>Original Price :</strong>{" "}
                                        ₹ {money(originalPrice)}
                                    </p>

                                    {itemDiscount > 0 && (
                                        <p>
                                            <strong>Offer Discount :</strong>{" "}
                                            - ₹ {money(itemDiscount * quantity)}
                                        </p>
                                    )}

                                    <p>
                                        <strong>Selling Price :</strong>{" "}
                                        ₹ {money(price)}
                                    </p>

                                    <p>
                                        <strong>Item Total :</strong>{" "}
                                        ₹ {money(itemTotal)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No products found.</p>
                )}
            </div>

            {/* ORDER SUMMARY */}

            <div className="order-total-box">
                <h2>Order Summary</h2>

                <p>
                    <strong>Product Subtotal :</strong>{" "}
                    ₹ {money(breakdown.productSubtotal)}
                </p>

                {breakdown.offerDiscount > 0 && (
                    <p>
                        <strong>Offer Discount :</strong>{" "}
                        - ₹ {money(breakdown.offerDiscount)}
                    </p>
                )}

                {breakdown.couponDiscount > 0 && (
                    <p>
                        <strong>
                            Coupon Discount
                            {breakdown.couponCode
                                ? ` (${breakdown.couponCode})`
                                : ""}:
                        </strong>{" "}
                        - ₹ {money(breakdown.couponDiscount)}
                    </p>
                )}

                {breakdown.totalDiscount > 0 && (
                    <p>
                        <strong>Total Discount :</strong>{" "}
                        - ₹ {money(breakdown.totalDiscount)}
                    </p>
                )}

                <p>
                    <strong>Taxable Amount :</strong>{" "}
                    ₹ {money(breakdown.taxableAmount)}
                </p>

                <p>
                    <strong>
                        GST ({money(breakdown.gstPercentage)}%) :
                    </strong>{" "}
                    ₹ {money(breakdown.gstAmount)}
                </p>

                <p>
                    <strong>Shipping :</strong>{" "}
                    {breakdown.shippingCharge > 0
                        ? `₹ ${money(breakdown.shippingCharge)}`
                        : "Free"}
                </p>

                {breakdown.otherCharges > 0 && (
                    <p>
                        <strong>Other Charges :</strong>{" "}
                        ₹ {money(breakdown.otherCharges)}
                    </p>
                )}

                <p
                    style={{
                        borderTop: "1px solid #ddd",
                        marginTop: "12px",
                        paddingTop: "12px",
                        fontSize: "20px",
                        fontWeight: 700,
                    }}
                >
                    <strong>Final Total Amount :</strong>{" "}
                    ₹ {money(breakdown.finalAmount)}
                </p>

                <p>
                    <strong>Order Status :</strong>{" "}
                    {formatStatus(order.orderStatus)}
                </p>

                <p>
                    <strong>Payment Status :</strong>{" "}
                    {formatStatus(breakdown.paymentStatus)}
                </p>
            </div>

        </div>
    );
};

export default OrderDetails;