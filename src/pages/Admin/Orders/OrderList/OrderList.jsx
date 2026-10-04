// import React, { useEffect, useState } from "react";

// import "./OrderList.css";

// import { useNavigate } from "react-router-dom";

// import {

//     getAllOrders

// } from "../../../../services/orderService";

// const OrderList = () => {

//     const navigate = useNavigate();

//     const [orders, setOrders] = useState([]);

//     const [loading, setLoading] = useState(true);

//     useEffect(() => {

//         fetchOrders();

//     }, []);

//     const fetchOrders = async () => {

//         try {

//             const res = await getAllOrders();

//             console.log("All Orders :", res);

//             setOrders(res.orders || []);

//         }

//         catch (error) {

//             console.log(error);

//         }

//         finally {

//             setLoading(false);

//         }

//     };

//     if (loading) {

//         return <h2>Loading...</h2>;

//     }

//     return (

//         <div className="admin-orders">

//             <h1>All Orders</h1>

//             <table>

//                 <thead>

//                     <tr>

//                         {/* <th>Order ID</th> */}

//                         <th>Customer</th>

//                         <th>Total</th>

//                         <th>Order Status</th>

//                         <th>Payment</th>

//                         <th>Date</th>

//                         <th>Action</th>

//                     </tr>

//                 </thead>

//                 <tbody>

//                     {

//                         orders.length === 0 ?

//                             (

//                                 <tr>

//                                     <td colSpan="7">

//                                         No Orders Found

//                                     </td>

//                                 </tr>

//                             )

//                             :

//                             (

//                                 orders.map(order => (

//                                     <tr key={order._id}>

//                                         {/* <td>

//                                             {order._id}

//                                         </td> */}

//                                         <td>

//                                             {

//                                                 order.user

//                                                     ?

//                                                     `${order.user.firstName} ${order.user.lastName}`

//                                                     :

//                                                     "N/A"

//                                             }

//                                         </td>

//                                         <td>

//                                             ₹ {order.totalAmount}

//                                         </td>

//                                         <td>

//                                             {order.orderStatus}

//                                         </td>

//                                         <td>

//                                             {order.paymentStatus}

//                                         </td>

//                                         <td>

//                                             {

//                                                 new Date(

//                                                     order.createdAt

//                                                 ).toLocaleDateString()

//                                             }

//                                         </td>

//                                         <td>

//                                             <button

//                                                 className="view-btn"

//                                                 onClick={() =>

//                                                     navigate(

//                                                         `/admin/orders/${order._id}`

//                                                     )

//                                                 }

//                                             >

//                                                 View

//                                             </button>

//                                         </td>

//                                     </tr>

//                                 ))

//                             )

//                     }

//                 </tbody>

//             </table>

//         </div>

//     );

// };

// export default OrderList;


import React, { useEffect, useState } from "react";

import "./OrderList.css";

import { useNavigate } from "react-router-dom";

import {

    getAllOrders

} from "../../../../services/orderService";


// =====================================================
// HELPERS
// =====================================================

const DEFAULT_GST_PERCENTAGE = 18; // purane orders ke liye fallback

const toNumber = (value, fallback = 0) => {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;

};

const round2 = (value) =>

    Math.round(
        (toNumber(value) + Number.EPSILON) * 100
    ) / 100;

const money = (value) =>

    toNumber(value).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );


// =====================================================
// FINAL TOTAL
// offer + coupon + GST + shipping ke baad ka amount
//
// Naye order  -> DB me saved finalAmount
// Purane order -> totalAmount se calculate
// =====================================================

const getFinalTotal = (order) => {

    const isNewOrder =
        order?.gstAmount !== undefined &&
        order?.gstAmount !== null &&
        order?.finalAmount !== undefined &&
        order?.finalAmount !== null;

    if (isNewOrder) {

        return round2(order.finalAmount);

    }

    // ---------- purane orders ----------

    const productAmount =
        toNumber(order?.totalAmount);

    const couponDiscount =
        toNumber(order?.couponDiscount);

    const taxableAmount =
        Math.max(
            productAmount - couponDiscount,
            0
        );

    const gstPercentage =
        toNumber(
            order?.gstPercentage,
            DEFAULT_GST_PERCENTAGE
        );

    const gstAmount =
        round2(
            (taxableAmount * gstPercentage) / 100
        );

    const shippingCharge =
        toNumber(order?.shippingCharge);

    const otherCharges =
        toNumber(order?.otherCharges);

    return round2(
        taxableAmount +
        gstAmount +
        shippingCharge +
        otherCharges
    );

};


const OrderList = () => {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchOrders();

    }, []);

    const fetchOrders = async () => {

        try {

            const res = await getAllOrders();

            console.log("All Orders :", res);

            setOrders(res.orders || []);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="admin-orders">

            <h1>All Orders</h1>

            <table>

                <thead>

                    <tr>

                        {/* <th>Order ID</th> */}

                        <th>Customer</th>

                        <th>Total</th>

                        <th>Order Status</th>

                        <th>Payment</th>

                        <th>Date</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        orders.length === 0 ?

                            (

                                <tr>

                                    <td colSpan="6">

                                        No Orders Found

                                    </td>

                                </tr>

                            )

                            :

                            (

                                orders.map(order => (

                                    <tr key={order._id}>

                                        {/* <td>

                                            {order._id}

                                        </td> */}

                                        <td>

                                            {

                                                order.user

                                                    ?

                                                    `${order.user.firstName} ${order.user.lastName}`

                                                    :

                                                    "N/A"

                                            }

                                        </td>

                                        <td>

                                            ₹ {money(getFinalTotal(order))}

                                        </td>

                                        <td>

                                            {order.orderStatus}

                                        </td>

                                        <td>

                                            {order.paymentStatus}

                                        </td>

                                        <td>

                                            {

                                                new Date(

                                                    order.createdAt

                                                ).toLocaleDateString()

                                            }

                                        </td>

                                        <td>

                                            <button

                                                className="view-btn"

                                                onClick={() =>

                                                    navigate(

                                                        `/admin/orders/${order._id}`

                                                    )

                                                }

                                            >

                                                View

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )

                    }

                </tbody>

            </table>

        </div>

    );

};

export default OrderList;