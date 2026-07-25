import React from "react";

import "./Payment.css";

import { useLocation, useNavigate } from "react-router-dom";

import {

    paymentSuccess,

    paymentFailed

} from "../../../services/paymentService";

const Payment = () => {

    const location = useLocation();

    const navigate = useNavigate();

    const {

        order,

        payment

    } = location.state || {};

    if (!order || !payment) {

        return (

            <div className="payment-error">

                <h2>No Payment Found</h2>

            </div>

        );

    }

    // ===================================
    // PAY NOW
    // ===================================

    const handlePayment = async () => {

        try {

            await paymentSuccess(

                payment._id,

                {

                    transactionId:

                        "TXN" + Date.now(),

                    gatewayPaymentId:

                        "PAY" + Date.now(),

                    gateway:

                        "COD",

                    gatewayResponse: {}

                }

            );

            navigate(

                "/order-success",

                {

                    state: {

                        order

                    }

                }

            );

        }

        catch (err) {

            console.log(err);

            alert("Payment Failed");

        }

    };



    // ===================================
    // CANCEL
    // ===================================

    const cancelPayment = async () => {

        try {

            await paymentFailed(

                payment._id,

                {

                    failureReason:

                        "Cancelled By User"

                }

            );

            navigate("/cart");

        }

        catch (err) {

            console.log(err);

        }

    };



    return (

        <div className="payment-container">

            <div className="payment-card">

                <h1>

                    Payment

                </h1>



                <div className="payment-info">

                    <p>

                        <strong>

                            Order ID :

                        </strong>

                        {order._id}

                    </p>

                    <p>

                        <strong>

                            Receipt :

                        </strong>

                        {payment.receiptNumber}

                    </p>

                    <p>

                        <strong>

                            Amount :

                        </strong>

                        ₹ {payment.amount}

                    </p>

                    <p>

                        <strong>

                            Payment Method :

                        </strong>

                        {payment.paymentMethod}

                    </p>

                    <p>

                        <strong>

                            Status :

                        </strong>

                        {payment.paymentStatus}

                    </p>

                </div>



                <button

                    className="pay-btn"

                    onClick={handlePayment}

                >

                    Pay Now

                </button>



                <button

                    className="cancel-btn"

                    onClick={cancelPayment}

                >

                    Cancel

                </button>

            </div>

        </div>

    );

};

export default Payment;