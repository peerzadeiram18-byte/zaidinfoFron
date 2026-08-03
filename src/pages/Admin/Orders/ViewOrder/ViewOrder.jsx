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

//             alert("Order Status Updated");

//             fetchOrder();

//         }

//         catch (error) {

//             console.log(error);

//             alert("Failed");

//         }

//     };




//     const handlePaymentStatus = async () => {

//         try {

//             await updatePaymentStatus(

//                 order._id,

//                 paymentStatus

//             );

//             alert("Payment Status Updated");

//             fetchOrder();

//         }

//         catch (error) {

//             console.log(error);

//             alert("Failed");

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

//                             <img

//                                 src={item.imageUrl}

//                                 alt={item.title}

//                             />

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




import React, {

    useEffect,

    useState

} from "react";

import "./ViewOrder.css";

import {

    useParams

} from "react-router-dom";

import {

    getOrderById,

    updateOrderStatus,

    updatePaymentStatus

} from "../../../../services/orderService";

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

            console.log(res);

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

            await updateOrderStatus(

                order._id,

                orderStatus

            );

            alert("Order Status Updated");

            fetchOrder();

        }

        catch (error) {

            console.log(error);

            alert("Failed");

        }

    };




    const handlePaymentStatus = async () => {

        try {

            await updatePaymentStatus(

                order._id,

                paymentStatus

            );

            alert("Payment Status Updated");

            fetchOrder();

        }

        catch (error) {

            console.log(error);

            alert("Failed");

        }

    };




    if (loading) {

        return <h2>Loading...</h2>;

    }




    return (

        <div className="view-order">

            <h1>

                Order Details

            </h1>

            <div className="order-section">

                <h2>

                    Customer Information

                </h2>

                <p>

                    <strong>Name :</strong>

                    {

                        order.user

                        ?

                        `${order.user.firstName} ${order.user.lastName}`

                        :

                        "N/A"

                    }

                </p>

                <p>

                    <strong>Email :</strong>

                    {

                        order.user?.email

                    }

                </p>

            </div>




            <div className="order-section">

                <h2>

                    Shipping Address

                </h2>

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

                    {

                        order.shippingAddress?.city

                    },

                    {

                        order.shippingAddress?.state

                    }

                </p>

                <p>

                    {

                        order.shippingAddress?.pincode

                    }

                </p>

            </div>




            <div className="order-section">

                <h2>

                    Products

                </h2>

                {

                    order.orderItems.map(item => (

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

                                <h3>

                                    {item.title}

                                </h3>

                                <p>

                                    Quantity :

                                    {item.quantity}

                                </p>

                                <p>

                                    Price :

                                    ₹ {item.price}

                                </p>

                            </div>

                        </div>

                    ))

                }

            </div>

                        <div className="order-summary">

                <h2>

                    Order Summary

                </h2>

                <p>

                    <strong>

                        Total Amount :

                    </strong>

                    ₹ {order.totalAmount}

                </p>

                <p>

                    <strong>

                        Order Status :

                    </strong>

                    {order.orderStatus}

                </p>

                <p>

                    <strong>

                        Payment Status :

                    </strong>

                    {order.paymentStatus}

                </p>

            </div>




            <div className="status-section">

                <div className="status-box">

                    <h3>

                        Update Order Status

                    </h3>

                    <select

                        value={orderStatus}

                        onChange={(e)=>

                            setOrderStatus(

                                e.target.value

                            )

                        }

                    >

                        <option value="PENDING">

                            PENDING

                        </option>

                        <option value="CONFIRMED">

                            CONFIRMED

                        </option>

                        <option value="PROCESSING">

                            PROCESSING

                        </option>

                        <option value="SHIPPED">

                            SHIPPED

                        </option>

                        <option value="DELIVERED">

                            DELIVERED

                        </option>

                        <option value="CANCELLED">

                            CANCELLED

                        </option>

                    </select>

                    <button

                        onClick={handleOrderStatus}

                    >

                        Update Order

                    </button>

                </div>




                <div className="status-box">

                    <h3>

                        Update Payment Status

                    </h3>

                    <select

                        value={paymentStatus}

                        onChange={(e)=>

                            setPaymentStatus(

                                e.target.value

                            )

                        }

                    >

                        <option value="PENDING">

                            PENDING

                        </option>

                        <option value="PAID">

                            PAID

                        </option>

                        <option value="FAILED">

                            FAILED

                        </option>

                        <option value="REFUNDED">

                            REFUNDED

                        </option>

                    </select>

                    <button

                        onClick={handlePaymentStatus}

                    >

                        Update Payment

                    </button>

                </div>

            </div>

        </div>

    );

};

export default ViewOrder;

