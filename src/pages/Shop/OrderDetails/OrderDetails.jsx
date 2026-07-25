import React, {
    useEffect,
    useState
} from "react";

import "./OrderDetails.css";

import {
    useParams
} from "react-router-dom";

import {
    getOrderById
} from "../../../services/orderService";

const OrderDetails = () => {

    const { id } = useParams();

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadOrder();

    }, []);

    const loadOrder = async () => {

        try {

            const res = await getOrderById(id);

            setOrder(res.order);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <h2>Loading...</h2>;

    }

    if (!order) {

        return <h2>Order Not Found</h2>;

    }

    return (

        <div className="order-details-page">

            <h1>Order Details</h1>

            <div className="order-info">

                <p>
                    <strong>Order ID :</strong> {order._id}
                </p>

                <p>
                    <strong>Status :</strong> {order.orderStatus}
                </p>

                <p>
                    <strong>Payment :</strong> {order.paymentStatus}
                </p>

                <p>
                    <strong>Total :</strong> ₹ {order.totalAmount}
                </p>

                <p>
                    <strong>Date :</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                </p>

            </div>

            <h2>Shipping Address</h2>

            <div className="address-box">

                <p>

                    <strong>Name :</strong>{" "}

                    {order.shippingAddress?.name}

                </p>

                <p>

                    <strong>Mobile :</strong>{" "}

                    {order.shippingAddress?.mobile}

                </p>

                <p>

                    <strong>Address :</strong>{" "}

                    {order.shippingAddress?.streetAddress}

                </p>

                <p>

                    {order.shippingAddress?.city},{" "}

                    {order.shippingAddress?.state}

                </p>

                <p>

                    {order.shippingAddress?.pincode}

                </p>

            </div>

            <h2>Products</h2>

            {

                order.orderItems?.map((item) => (

                    <div

                        className="product-box"

                        key={item._id}

                    >

                        <img

                            src={

                                item.imageUrl ||

                                "https://via.placeholder.com/120"

                            }

                            alt={item.title}

                        />

                        <div>

                            <h3>{item.title}</h3>

                            <p>

                                Quantity : {item.quantity}

                            </p>

                            <p>

                                Price : ₹ {item.price}

                            </p>

                            <p>

                                Total : ₹ {item.price * item.quantity}

                            </p>

                        </div>

                    </div>

                ))

            }

        </div>

    );

};

export default OrderDetails;