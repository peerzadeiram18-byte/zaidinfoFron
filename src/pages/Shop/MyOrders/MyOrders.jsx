// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import "./MyOrders.css";

// import { getMyOrders } from "../../../services/orderService";

// const MyOrders = () => {

//     const navigate = useNavigate();

//     const [orders, setOrders] = useState([]);

//     const [loading, setLoading] = useState(true);

//     useEffect(() => {

//         fetchOrders();

//     }, []);

//     const fetchOrders = async () => {

//         try {

//             const res = await getMyOrders();

//             console.log("Orders Response :", res);

//             // Different backend response support
//             setOrders(
//                 res.orders ||
//                 res.data?.orders ||
//                 res.data ||
//                 []
//             );

//         }
//         catch (error) {

//             console.error(error);

//         }
//         finally {

//             setLoading(false);

//         }

//     };

//     if (loading) {

//         return (

//             <div className="myorders-loading">

//                 Loading Orders...

//             </div>

//         );

//     }

//     return (

//         <div className="myorders-container">

//             <h1 className="myorders-title">

//                 My Orders

//             </h1>

//             {
//                 orders.length === 0 ?

//                     (

//                         <div className="no-orders">

//                             <h3>No Orders Found</h3>

//                         </div>

//                     )

//                     :

//                     (

//                         orders.map((order) => (

//                             <div
//                                 className="order-card"
//                                 key={order._id}
//                             >

//                                 <div className="order-row">

//                                     <span>Order ID</span>

//                                     <p>{order._id}</p>

//                                 </div>

//                                 <div className="order-row">

//                                     <span>Total Amount</span>

//                                     <p>₹ {order.totalAmount}</p>

//                                 </div>

//                                 <div className="order-row">

//                                     <span>Order Status</span>

//                                     <p>{order.orderStatus}</p>

//                                 </div>

//                                 <div className="order-row">

//                                     <span>Payment Status</span>

//                                     <p>{order.paymentStatus}</p>

//                                 </div>

//                                 <div className="order-row">

//                                     <span>Items</span>

//                                     <p>

//                                         {order.orderItems?.length || 0}

//                                     </p>

//                                 </div>

//                                 <div className="order-row">

//                                     <span>Date</span>

//                                     <p>

//                                         {new Date(order.createdAt).toLocaleDateString()}

//                                     </p>

//                                 </div>

//                                 <button

//                                     className="view-btn"

//                                     onClick={() =>

//                                         navigate(`/order/${order._id}`)

//                                     }

//                                 >

//                                     View Details

//                                 </button>

//                             </div>

//                         ))

//                     )
//             }

//         </div>

//     );

// };

// export default MyOrders;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MyOrders.css";

import { getMyOrders } from "../../../services/orderService";

const MyOrders = () => {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchOrders();

    }, []);

    const fetchOrders = async () => {

        try {

            const res = await getMyOrders();

            console.log("Orders Response :", res);

            // Different backend response support
            setOrders(
                res.orders ||
                res.data?.orders ||
                res.data ||
                []
            );

        }
        catch (error) {

            console.error(error);

        }
        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="myorders-loading">

                Loading Orders...

            </div>

        );

    }

    return (

        <div className="myorders-container">

            <h1 className="myorders-title">

                My Orders

            </h1>

            {
                orders.length === 0 ?

                    (

                        <div className="no-orders">

                            <h3>No Orders Found</h3>

                        </div>

                    )

                    :

                    (

                        orders.map((order) => (

                            <div
                                className="order-card"
                                key={order._id}
                            >

                                <div className="order-row">

                                    <span>Order ID</span>

                                    <p>{order._id}</p>

                                </div>

                                <div className="order-row">

                                    <span>Total Amount</span>

                                    <p>₹ {order.totalAmount}</p>

                                </div>

                                <div className="order-row">

                                    <span>Order Status</span>

                                    <p>{order.orderStatus}</p>

                                </div>

                                <div className="order-row">

                                    <span>Payment Status</span>

                                    <p>{order.paymentStatus}</p>

                                </div>

                                <div className="order-row">

                                    <span>Items</span>

                                    <p>

                                        {order.orderItems?.length || 0}

                                    </p>

                                </div>

                                <div className="order-row">

                                    <span>Date</span>

                                    <p>

                                        {new Date(order.createdAt).toLocaleDateString()}

                                    </p>

                                </div>

                                <button

                                    className="view-btn"

                                    onClick={() =>

                                        navigate(`/order/${order._id}`)

                                    }

                                >

                                    View Details

                                </button>

                            </div>

                        ))

                    )
            }

        </div>

    );

};

export default MyOrders;
