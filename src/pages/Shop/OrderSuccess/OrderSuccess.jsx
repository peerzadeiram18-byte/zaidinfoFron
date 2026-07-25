import React from "react";

import "./OrderSuccess.css";

import {

    useLocation,

    useNavigate

} from "react-router-dom";

const OrderSuccess = () => {

    const location = useLocation();

    const navigate = useNavigate();

    const {

        order

    } = location.state || {};

    if (!order) {

        return (

            <div className="order-success-empty">

                <h2>

                    No Order Found

                </h2>

            </div>

        );

    }

    return (

        <div className="order-success-container">

            <div className="order-success-card">

                <div className="success-icon">

                    ✔

                </div>

                <h1>

                    Order Placed Successfully

                </h1>

                <p>

                    Thank you for shopping with us.

                </p>

                <hr />

                <div className="order-details">

                    <p>

                        <strong>

                            Order ID

                        </strong>

                    </p>

                    <span>

                        {order._id}

                    </span>

                    <p>

                        <strong>

                            Total Amount

                        </strong>

                    </p>

                    <span>

                        ₹ {order.totalAmount}

                    </span>

                    <p>

                        <strong>

                            Order Status

                        </strong>

                    </p>

                    <span>

                        {order.orderStatus}

                    </span>

                </div>

                <button

                    className="orders-btn"

                    onClick={() =>

                        navigate("/my-orders")

                    }

                >

                    View My Orders

                </button>

                <button

                    className="shop-btn"

                    onClick={() =>

                        navigate("/shop")

                    }

                >

                    Continue Shopping

                </button>

            </div>

        </div>

    );

};

export default OrderSuccess;