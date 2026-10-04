// import React, {

//     useEffect,

//     useState

// } from "react";

// import "./ViewOrder.css";

// import {

//     useParams

// } from "react-router-dom";

// import {

//     getOrderById,

//     updateOrderStatus,

//     updatePaymentStatus

// } from "../../../../services/orderService";
// import { toast } from "react-toastify";

// const ViewOrder = () => {

//     const { id } = useParams();

//     const [order, setOrder] = useState(null);

//     const [loading, setLoading] = useState(true);

//     const [orderStatus, setOrderStatus] = useState("");

//     const [paymentStatus, setPaymentStatus] = useState("");



//     useEffect(() => {

//         fetchOrder();

//     }, []);




//     const fetchOrder = async () => {

//         try {

//             const res = await getOrderById(id);

//             console.log(res);

//             const data = res.order;

//             setOrder(data);

//             setOrderStatus(data.orderStatus);

//             setPaymentStatus(data.paymentStatus);

//         }

//         catch (error) {

//             console.log(error);

//         }

//         finally {

//             setLoading(false);

//         }

//     };




//     const handleOrderStatus = async () => {

//         try {

//             await updateOrderStatus(

//                 order._id,

//                 orderStatus

//             );

//             toast.success("Order Status Updated");

//             fetchOrder();

//         }

//         catch (error) {

//             console.log(error);

//             toast.error("Failed");

//         }

//     };




//     const handlePaymentStatus = async () => {

//         try {

//             await updatePaymentStatus(

//                 order._id,

//                 paymentStatus

//             );

//            toast.success("Payment Status Updated");

//             fetchOrder();

//         }

//         catch (error) {

//             console.log(error);

//             toast.error("Failed");

//         }

//     };




//     if (loading) {

//         return <h2>Loading...</h2>;

//     }




//     return (

//         <div className="view-order">

//             <h1>

//                 Order Details

//             </h1>

//             <div className="order-section">

//                 <h2>

//                     Customer Information

//                 </h2>

//                 <p>

//                     <strong>Name :</strong>

//                     {

//                         order.user

//                         ?

//                         `${order.user.firstName} ${order.user.lastName}`

//                         :

//                         "N/A"

//                     }

//                 </p>

//                 <p>

//                     <strong>Email :</strong>

//                     {

//                         order.user?.email

//                     }

//                 </p>

//             </div>




//             <div className="order-section">

//                 <h2>

//                     Shipping Address

//                 </h2>

//                 <p>

//                     {

//                         order.shippingAddress?.fullName ||

//                         order.shippingAddress?.name

//                     }

//                 </p>

//                 <p>

//                     {

//                         order.shippingAddress?.phone ||

//                         order.shippingAddress?.mobile

//                     }

//                 </p>

//                 <p>

//                     {

//                         order.shippingAddress?.addressLine ||

//                         order.shippingAddress?.streetAddress

//                     }

//                 </p>

//                 <p>

//                     {

//                         order.shippingAddress?.city

//                     },

//                     {

//                         order.shippingAddress?.state

//                     }

//                 </p>

//                 <p>

//                     {

//                         order.shippingAddress?.pincode

//                     }

//                 </p>

//             </div>




//             <div className="order-section">

//                 <h2>

//                     Products

//                 </h2>

//                 {

//                     order.orderItems.map(item => (

//                         <div

//                             className="product-card"

//                             key={item._id}

//                         >

//                             {item.imageUrl ? (

//                                 <img

//                                     src={item.imageUrl}

//                                     alt={item.title}

//                                 />

//                             ) : null}

//                             <div>

//                                 <h3>

//                                     {item.title}

//                                 </h3>

//                                 <p>

//                                     Quantity :

//                                     {item.quantity}

//                                 </p>

//                                 <p>

//                                     Price :

//                                     ₹ {item.price}

//                                 </p>

//                             </div>

//                         </div>

//                     ))

//                 }

//             </div>

//                         <div className="order-summary">

//                 <h2>

//                     Order Summary

//                 </h2>

//                 <p>

//                     <strong>

//                         Total Amount :

//                     </strong>

//                     ₹ {order.totalAmount}

//                 </p>

//                 <p>

//                     <strong>

//                         Order Status :

//                     </strong>

//                     {order.orderStatus}

//                 </p>

//                 <p>

//                     <strong>

//                         Payment Status :

//                     </strong>

//                     {order.paymentStatus}

//                 </p>

//             </div>




//             <div className="status-section">

//                 <div className="status-box">

//                     <h3>

//                         Update Order Status

//                     </h3>

//                     <select

//                         value={orderStatus}

//                         onChange={(e)=>

//                             setOrderStatus(

//                                 e.target.value

//                             )

//                         }

//                     >

//                         <option value="PENDING">

//                             PENDING

//                         </option>

//                         <option value="CONFIRMED">

//                             CONFIRMED

//                         </option>

//                         <option value="PROCESSING">

//                             PROCESSING

//                         </option>

//                         <option value="SHIPPED">

//                             SHIPPED

//                         </option>

//                         <option value="OUT_FOR_DELIVERY">
//                               OUT FOR DELIVERY
//                        </option>

//                         <option value="DELIVERED">

//                             DELIVERED

//                         </option>

//                         <option value="CANCELLED">

//                             CANCELLED

//                         </option>

//                     </select>

//                     <button

//                         onClick={handleOrderStatus}

//                     >

//                         Update Order

//                     </button>

//                 </div>




//                 <div className="status-box">

//                     <h3>

//                         Update Payment Status

//                     </h3>

//                     <select

//                         value={paymentStatus}

//                         onChange={(e)=>

//                             setPaymentStatus(

//                                 e.target.value

//                             )

//                         }

//                     >

//                         <option value="PENDING">

//                             PENDING

//                         </option>

//                         <option value="PAID">

//                             PAID

//                         </option>

//                         <option value="FAILED">

//                             FAILED

//                         </option>

//                         <option value="REFUNDED">

//                             REFUNDED

//                         </option>

//                     </select>

//                     <button

//                         onClick={handlePaymentStatus}

//                     >

//                         Update Payment

//                     </button>

//                 </div>

//             </div>

//         </div>

//     );

// };

// export default ViewOrder;




import React, { useEffect, useState } from "react";
import "./ViewOrder.css";
import { useParams } from "react-router-dom";
import {
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus
} from "../../../../services/orderService";
import { toast } from "react-toastify";


// =====================================================
// HELPERS
// =====================================================

const toNumber = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
};

const round2 = (value) =>
    Math.round((toNumber(value) + Number.EPSILON) * 100) / 100;

const money = (value) =>
    toNumber(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

// pehli value jo undefined/null nahi hai
const pick = (...values) =>
    values.find((v) => v !== undefined && v !== null);


// =====================================================
// PRICE BREAKDOWN
// Naye order  -> DB me saved values
// Purane order -> items se calculate (GST default 18%)
// =====================================================

const getBreakdown = (order) => {

    const items = Array.isArray(order?.orderItems)
        ? order.orderItems
        : [];

    let calcOriginal = 0;
    let calcSelling = 0;

    items.forEach((item) => {
        const qty = Math.max(toNumber(item.quantity, 1), 1);
        const price = toNumber(item.price);
        const original = toNumber(item.originalPrice, price);

        calcOriginal += original * qty;
        calcSelling += price * qty;
    });

    const isNewOrder =
        order?.gstAmount !== undefined &&
        order?.gstAmount !== null;

    const subtotal = round2(
        pick(order?.subtotal, calcOriginal)
    );

    const offerDiscount = round2(
        pick(
            order?.offerDiscount,
            Math.max(subtotal - calcSelling, 0)
        )
    );

    const couponDiscount = round2(
        toNumber(order?.couponDiscount, 0)
    );

    const taxableAmount = round2(
        pick(
            order?.taxableAmount,
            Math.max(calcSelling - couponDiscount, 0)
        )
    );

    const gstPercentage = toNumber(
        pick(order?.gstPercentage, 18),
        18
    );

    const gstAmount = round2(
        pick(
            order?.gstAmount,
            (taxableAmount * gstPercentage) / 100
        )
    );

    const shippingCharge = round2(
        toNumber(order?.shippingCharge, 0)
    );

    const otherCharges = round2(
        toNumber(order?.otherCharges, 0)
    );

    const calculatedTotal = round2(
        taxableAmount + gstAmount + shippingCharge + otherCharges
    );

    const finalAmount =
        isNewOrder && order?.finalAmount !== undefined
            ? round2(order.finalAmount)
            : calculatedTotal;

    return {
        subtotal,
        offerDiscount,
        couponDiscount,
        couponCode: order?.couponCode || "",
        taxableAmount,
        gstPercentage,
        gstAmount,
        shippingCharge,
        otherCharges,
        finalAmount
    };
};


const ViewOrder = () => {

    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orderStatus, setOrderStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");


    useEffect(() => {
        fetchOrder();
    }, []);


    const fetchOrder = async () => {
        try {
            const res = await getOrderById(id);
            const data = res.order;

            setOrder(data);
            setOrderStatus(data.orderStatus);
            setPaymentStatus(data.paymentStatus);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };


    const handleOrderStatus = async () => {
        try {
            await updateOrderStatus(order._id, orderStatus);
            toast.success("Order Status Updated");
            fetchOrder();
        }
        catch (error) {
            console.log(error);
            toast.error("Failed");
        }
    };


    const handlePaymentStatus = async () => {
        try {
            await updatePaymentStatus(order._id, paymentStatus);
            toast.success("Payment Status Updated");
            fetchOrder();
        }
        catch (error) {
            console.log(error);
            toast.error("Failed");
        }
    };


    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (!order) {
        return <h2>Order not found</h2>;
    }


    const breakdown = getBreakdown(order);

    const rowStyle = {
        display: "flex",
        justifyContent: "space-between",
        margin: "8px 0"
    };

    const greenRow = {
        ...rowStyle,
        color: "#198754"
    };


    return (

        <div className="view-order">

            <h1>Order Details</h1>


            {/* ================= CUSTOMER ================= */}

            <div className="order-section">

                <h2>Customer Information</h2>

                <p>
                    <strong>Name : </strong>
                    {
                        order.user
                            ? `${order.user.firstName || ""} ${order.user.lastName || ""}`
                            : "N/A"
                    }
                </p>

                <p>
                    <strong>Email : </strong>
                    {order.user?.email}
                </p>

            </div>


            {/* ================= SHIPPING ================= */}

            <div className="order-section">

                <h2>Shipping Address</h2>

                <p>
                    {
                        order.shippingAddress?.fullName ||
                        order.shippingAddress?.name
                    }
                </p>

                <p>
                    {
                        order.shippingAddress?.phone ||
                        order.shippingAddress?.mobile
                    }
                </p>

                <p>
                    {
                        order.shippingAddress?.addressLine ||
                        order.shippingAddress?.streetAddress
                    }
                </p>

                <p>
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.state}
                </p>

                <p>{order.shippingAddress?.pincode}</p>

            </div>


            {/* ================= PRODUCTS ================= */}

            <div className="order-section">

                <h2>Products</h2>

                {
                    order.orderItems.map((item) => {

                        const qty = toNumber(item.quantity, 1);
                        const price = toNumber(item.price);
                        const original = toNumber(item.originalPrice, price);

                        return (

                            <div
                                className="product-card"
                                key={item._id}
                            >

                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                    />
                                ) : null}

                                <div>

                                    <h3>{item.title}</h3>

                                    <p>Quantity : {qty}</p>

                                    <p>
                                        Price : ₹ {money(price)}

                                        {original > price && (
                                            <span
                                                style={{
                                                    marginLeft: "8px",
                                                    textDecoration: "line-through",
                                                    color: "#888"
                                                }}
                                            >
                                                ₹ {money(original)}
                                            </span>
                                        )}
                                    </p>

                                    <p>
                                        Item Total : ₹ {money(price * qty)}
                                    </p>

                                </div>

                            </div>

                        );
                    })
                }

            </div>


            {/* ================= ORDER SUMMARY ================= */}

            <div className="order-summary">

                <h2>Order Summary</h2>

                <div style={rowStyle}>
                    <span>Product Subtotal</span>
                    <span>₹ {money(breakdown.subtotal)}</span>
                </div>

                {breakdown.offerDiscount > 0 && (
                    <div style={greenRow}>
                        <span>Offer Discount</span>
                        <span>- ₹ {money(breakdown.offerDiscount)}</span>
                    </div>
                )}

                {breakdown.couponDiscount > 0 && (
                    <div style={greenRow}>
                        <span>
                            Coupon Discount
                            {breakdown.couponCode
                                ? ` (${breakdown.couponCode})`
                                : ""}
                        </span>
                        <span>- ₹ {money(breakdown.couponDiscount)}</span>
                    </div>
                )}

                <div style={rowStyle}>
                    <span>Taxable Amount</span>
                    <span>₹ {money(breakdown.taxableAmount)}</span>
                </div>

                <div style={rowStyle}>
                    <span>GST ({breakdown.gstPercentage}%)</span>
                    <span>₹ {money(breakdown.gstAmount)}</span>
                </div>

                <div style={rowStyle}>
                    <span>Shipping</span>
                    <span>
                        {
                            breakdown.shippingCharge > 0
                                ? `₹ ${money(breakdown.shippingCharge)}`
                                : "Free"
                        }
                    </span>
                </div>

                {breakdown.otherCharges > 0 && (
                    <div style={rowStyle}>
                        <span>Other Charges</span>
                        <span>₹ {money(breakdown.otherCharges)}</span>
                    </div>
                )}

                <div
                    style={{
                        ...rowStyle,
                        borderTop: "1px solid #ddd",
                        marginTop: "12px",
                        paddingTop: "12px",
                        fontSize: "18px",
                        fontWeight: 700
                    }}
                >
                    <span>Total Amount</span>
                    <span>₹ {money(breakdown.finalAmount)}</span>
                </div>

                <p>
                    <strong>Order Status : </strong>
                    {order.orderStatus}
                </p>

                <p>
                    <strong>Payment Status : </strong>
                    {order.paymentStatus}
                </p>

            </div>


            {/* ================= STATUS UPDATE ================= */}

            <div className="status-section">

                <div className="status-box">

                    <h3>Update Order Status</h3>

                    <select
                        value={orderStatus}
                        onChange={(e) => setOrderStatus(e.target.value)}
                    >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                    </select>

                    <button onClick={handleOrderStatus}>
                        Update Order
                    </button>

                </div>


                <div className="status-box">

                    <h3>Update Payment Status</h3>

                    <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="FAILED">FAILED</option>
                        <option value="REFUNDED">REFUNDED</option>
                    </select>

                    <button onClick={handlePaymentStatus}>
                        Update Payment
                    </button>

                </div>

            </div>

        </div>

    );
};

export default ViewOrder;