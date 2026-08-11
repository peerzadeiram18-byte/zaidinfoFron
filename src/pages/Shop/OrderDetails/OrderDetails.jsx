// import React, {
//     useEffect,
//     useState
// } from "react";

// import "./OrderDetails.css";

// // import {
// //     useParams
// // } from "react-router-dom";

// import {
//     useNavigate,
//     useParams
// } from "react-router-dom";

// import {
//     getOrderById
// } from "../../../services/orderService";

// const OrderDetails = () => {


//     const navigate = useNavigate();

// const { id } = useParams();

//     const [order, setOrder] = useState(null);

//     const [loading, setLoading] = useState(true);

//     useEffect(() => {

//         loadOrder();

//     }, []);

//     const loadOrder = async () => {

//         try {

//             const res = await getOrderById(id);

//             setOrder(res.order);

//         }

//         catch (err) {

//             console.log(err);

//         }

//         finally {

//             setLoading(false);

//         }

//     };

//     if (loading) {

//         return <h2>Loading...</h2>;

//     }

//     if (!order) {

//         return <h2>Order Not Found</h2>;

//     }

//     return (

//         <div className="order-details-page">

//             <h1>Order Details</h1>

//             <div className="order-info">

//                 <p>
//                     <strong>Order ID :</strong> {order._id}
//                 </p>

//                 <p>
//                     <strong>Status :</strong> {order.orderStatus}
//                 </p>

//                 <button
//     className="track-order-button"
//     onClick={() =>
//         navigate(`/order/${order._id}/track`)
//     }
// >
//     🚚 Track Order
// </button>

//                 <p>
//                     <strong>Payment :</strong> {order.paymentStatus}
//                 </p>

//                 <p>
//                     <strong>Total :</strong> ₹ {order.totalAmount}
//                 </p>

//                 <p>
//                     <strong>Date :</strong>{" "}
//                     {new Date(order.createdAt).toLocaleDateString()}
//                 </p>

//             </div>

//             <h2>Shipping Address</h2>

//             <div className="address-box">

//                 <p>

//                     <strong>Name :</strong>{" "}

//                     {order.shippingAddress?.name}

//                 </p>

//                 <p>

//                     <strong>Mobile :</strong>{" "}

//                     {order.shippingAddress?.mobile}

//                 </p>

//                 <p>

//                     <strong>Address :</strong>{" "}

//                     {order.shippingAddress?.streetAddress}

//                 </p>

//                 <p>

//                     {order.shippingAddress?.city},{" "}

//                     {order.shippingAddress?.state}

//                 </p>

//                 <p>

//                     {order.shippingAddress?.pincode}

//                 </p>

//             </div>

//             <h2>Products</h2>

//             {

//                 order.orderItems?.map((item) => (

//                     <div

//                         className="product-box"

//                         key={item._id}

//                     >

//                         <img

//                             src={

//                                 item.imageUrl ||

//                                 "https://via.placeholder.com/120"

//                             }

//                             alt={item.title}

//                         />

//                         <div>

//                             <h3>{item.title}</h3>

//                             <p>

//                                 Quantity : {item.quantity}

//                             </p>

//                             <p>

//                                 Price : ₹ {item.price}

//                             </p>

//                             <p>

//                                 Total : ₹ {item.price * item.quantity}

//                             </p>

//                         </div>

//                     </div>

//                 ))

//             }

//         </div>

//     );

// };

// export default OrderDetails;













import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import "./OrderDetails.css";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getOrderById
} from "../../../services/orderService";


const OrderDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();


    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);


    // ==================================================
    // LOAD ORDER
    // ==================================================

    const loadOrder = useCallback(async () => {

        try {

            setLoading(true);


            const res =
                await getOrderById(id);


            console.log(
                "Order Details Response:",
                res
            );


            const data =
                res?.order ||
                res?.data?.order ||
                res?.data ||
                null;


            setOrder(data);

        }

        catch (err) {

            console.error(
                "ORDER DETAILS ERROR:",
                err
            );

            setOrder(null);

        }

        finally {

            setLoading(false);

        }

    }, [id]);


    useEffect(() => {

        loadOrder();

    }, [loadOrder]);


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (

            <div className="order-details-page">

                <h2>
                    Loading Order...
                </h2>

            </div>

        );

    }


    // ==================================================
    // NOT FOUND
    // ==================================================

    if (!order) {

        return (

            <div className="order-details-page">

                <h2>
                    Order Not Found
                </h2>

                <button
                    onClick={() =>
                        navigate("/my-orders")
                    }
                >
                    ← Back to My Orders
                </button>

            </div>

        );

    }


    return (

        <div className="order-details-page">


            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="order-details-header">

                <div>

                    <h1>
                        Order Details
                    </h1>

                    <p>
                        Order #{order._id}
                    </p>

                </div>


                {/* ======================================
                    TRACK BUTTON
                ====================================== */}

                <button
                    className="track-order-button"
                    onClick={() =>
                        navigate(
                            `/order/${order._id}/track`
                        )
                    }
                >
                    🚚 Track Order
                </button>

            </div>


            {/* ==========================================
                ORDER INFORMATION
            ========================================== */}

            <div className="order-info">

                <p>
                    <strong>
                        Order ID :
                    </strong>{" "}
                    {order._id}
                </p>


                <p>
                    <strong>
                        Status :
                    </strong>{" "}
                    {order.orderStatus}
                </p>


                <p>
                    <strong>
                        Payment :
                    </strong>{" "}
                    {order.paymentStatus}
                </p>


                <p>
                    <strong>
                        Total :
                    </strong>{" "}
                    ₹ {order.totalAmount}
                </p>


                <p>
                    <strong>
                        Date :
                    </strong>{" "}
                    {order.createdAt
                        ? new Date(
                            order.createdAt
                        ).toLocaleDateString("en-IN")
                        : "N/A"
                    }
                </p>

            </div>


            {/* ==========================================
                SHIPPING ADDRESS
            ========================================== */}

            <h2>
                Shipping Address
            </h2>


            <div className="address-box">

                <p>

                    <strong>
                        Name :
                    </strong>{" "}

                    {
                        order.shippingAddress?.fullName ||
                        order.shippingAddress?.name ||
                        "N/A"
                    }

                </p>


                <p>

                    <strong>
                        Mobile :
                    </strong>{" "}

                    {
                        order.shippingAddress?.phone ||
                        order.shippingAddress?.mobile ||
                        "N/A"
                    }

                </p>


                <p>

                    <strong>
                        Address :
                    </strong>{" "}

                    {
                        order.shippingAddress?.addressLine ||
                        order.shippingAddress?.streetAddress ||
                        "N/A"
                    }

                </p>


                <p>

                    {
                        order.shippingAddress?.city ||
                        ""
                    }

                    {
                        order.shippingAddress?.city &&
                        order.shippingAddress?.state
                            ? ", "
                            : ""
                    }

                    {
                        order.shippingAddress?.state ||
                        ""
                    }

                </p>


                <p>

                    {
                        order.shippingAddress?.pincode ||
                        ""
                    }

                </p>


                {
                    order.shippingAddress?.landmark && (

                        <p>

                            <strong>
                                Landmark :
                            </strong>{" "}

                            {
                                order.shippingAddress.landmark
                            }

                        </p>

                    )
                }

            </div>


            {/* ==========================================
                PRODUCTS
            ========================================== */}

            <h2>
                Products
            </h2>


            <div className="order-products">

                {
                    order.orderItems?.map(
                        (item, index) => (

                            <div
                                className="product-box"
                                key={
                                    item._id ||
                                    `${item.product}-${index}`
                                }
                            >

                                <img
                                    src={
                                        item.imageUrl ||
                                        "https://via.placeholder.com/120"
                                    }
                                    alt={
                                        item.title ||
                                        "Product"
                                    }
                                />


                                <div>

                                    <h3>
                                        {item.title}
                                    </h3>


                                    <p>
                                        Quantity :{" "}
                                        {item.quantity}
                                    </p>


                                    <p>
                                        Price : ₹{" "}
                                        {item.price}
                                    </p>


                                    <p>

                                        Total : ₹{" "}

                                        {
                                            Number(
                                                item.price || 0
                                            ) *
                                            Number(
                                                item.quantity || 0
                                            )
                                        }

                                    </p>

                                </div>

                            </div>

                        )
                    )
                }

            </div>


            {/* ==========================================
                ORDER TOTAL
            ========================================== */}

            <div className="order-total-box">

                <h2>
                    Order Summary
                </h2>


                <p>

                    <strong>
                        Total Amount :
                    </strong>{" "}

                    ₹ {order.totalAmount}

                </p>


                <p>

                    <strong>
                        Order Status :
                    </strong>{" "}

                    {order.orderStatus}

                </p>


                <p>

                    <strong>
                        Payment Status :
                    </strong>{" "}

                    {order.paymentStatus}

                </p>

            </div>


        </div>

    );

};


export default OrderDetails;

