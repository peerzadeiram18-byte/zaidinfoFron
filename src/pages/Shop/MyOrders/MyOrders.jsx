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




import React, {
    useEffect,
    useState
} from "react";
import ReviewModal from "../../../components/Reviews/ReviewModal";
import {
    useNavigate
} from "react-router-dom";

import "./MyOrders.css";

import {
    getMyOrders
} from "../../../services/orderService";


const MyOrders = () => {

    const navigate = useNavigate();


    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);


    const [reviewProduct, setReviewProduct] =
  useState(null);

const [reviewOrder, setReviewOrder] =
  useState(null);
  
  
    // ==================================================
    // FETCH ORDERS
    // ==================================================

    const fetchOrders = async () => {

        try {

            const res =
                await getMyOrders();


            console.log(
                "Orders Response :",
                res
            );


            setOrders(

                res?.orders ||

                res?.data?.orders ||

                res?.data ||

                []

            );

        }

        catch (error) {

            console.error(
                "MY ORDERS ERROR:",
                error
            );

        }

        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchOrders();

    }, []);


    // ==================================================
    // LOADING
    // ==================================================

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
                orders.length === 0

                    ?

                    (

                        <div className="no-orders">

                            <h3>
                                No Orders Found
                            </h3>

                            <button
                                onClick={() =>
                                    navigate("/shop")
                                }
                            >
                                Continue Shopping
                            </button>

                        </div>

                    )

                    :

                    (

                        orders.map((order) => (

                            <div
                                className="order-card"
                                key={order._id}
                            >


                                {/* =====================
                                    ORDER ID
                                ===================== */}

                                <div className="order-row">

                                    <span>
                                        Order ID
                                    </span>

                                    <p>
                                        {order._id}
                                    </p>

                                </div>


                                {/* =====================
                                    TOTAL
                                ===================== */}

                                <div className="order-row">

                                    <span>
                                        Total Amount
                                    </span>

                                    <p>
                                        ₹ {order.totalAmount}
                                    </p>

                                </div>


                                {/* =====================
                                    ORDER STATUS
                                ===================== */}

                                <div className="order-row">

                                    <span>
                                        Order Status
                                    </span>

                                    <p>
                                        {order.orderStatus}
                                    </p>

                                </div>


                                {/* =====================
                                    PAYMENT STATUS
                                ===================== */}

                                <div className="order-row">

                                    <span>
                                        Payment Status
                                    </span>

                                    <p>
                                        {order.paymentStatus}
                                    </p>

                                </div>


                                {/* =====================
                                    ITEMS
                                ===================== */}

                                <div className="order-row">

                                    <span>
                                        Items
                                    </span>

                                    <p>
                                        {order.orderItems?.length || 0}
                                    </p>

                                </div>


                                {/* =====================
                                    DATE
                                ===================== */}

                                <div className="order-row">

                                    <span>
                                        Date
                                    </span>

                                    <p>

                                        {
                                            order.createdAt

                                                ?

                                                new Date(
                                                    order.createdAt
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )

                                                :

                                                "N/A"
                                        }

                                    </p>

                                </div>


                                {/* =====================
                                    ACTIONS
                                ===================== */}

                                <div
                                    className="order-actions"
                                >


                                    <button
                                        className="view-btn"
                                        onClick={() =>
                                            navigate(
                                                `/order/${order._id}`
                                            )
                                        }
                                    >
                                        View Details
                                    </button>


                                    <button
                                        className="track-order-btn"
                                        onClick={() =>
                                            navigate(
                                                `/order/${order._id}/track`
                                            )
                                        }
                                    >
                                        🚚 Track Order
                                    </button>


    {/* REVIEW PRODUCT */}

  {/* ==============================
    DELIVERED ORDER - PRODUCTS
================================ */}

{order.orderStatus === "DELIVERED" &&
    order.orderItems?.length > 0 && (

        <div className="order-products-review">

            <h4>Products</h4>

            {order.orderItems.map((item, index) => (

                <div
                    className="review-product-row"
                    key={item.product?._id || index}
                >

                    <div className="review-product-info">

                        <span className="review-product-name">

                            {item.product?.name ||
                                item.productName ||
                                "Product"}

                        </span>

                        <span className="review-product-quantity">

                            Qty: {item.quantity}

                        </span>

                    </div>


                    <button
                        type="button"
                        className="review-btn"
                        onClick={() => {

                            setReviewProduct(
                                item.product
                            );

                            setReviewOrder(order);

                        }}
                    >
                        ⭐ Review Product
                    </button>

                </div>

            ))}

        </div>

)}

                                </div>


                            </div>

                        ))

                    )
            }

  {/* ============================
                REVIEW MODAL
            ============================ */}

            {reviewProduct && reviewOrder && (

                <ReviewModal

                    product={reviewProduct}

                    order={reviewOrder}

                    onClose={() => {

                        setReviewProduct(null);

                        setReviewOrder(null);

                    }}

                    onSuccess={() => {

                        setReviewProduct(null);

                        setReviewOrder(null);

                    }}

                />

            )}



        </div>

    );

};


export default MyOrders;

