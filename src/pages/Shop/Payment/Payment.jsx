import React, { useEffect, useState } from "react";
import "./Payment.css";

import { useLocation, useNavigate } from "react-router-dom";

import {
    createPayment,
    paymentSuccess,
    paymentFailed,
} from "../../../services/paymentService";

const Payment = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { order, payment } = location.state || {};

    const [loading, setLoading] = useState(false);

    // =====================================================
    // RAZORPAY SCRIPT LOAD
    // =====================================================

    useEffect(() => {

        const loadRazorpay = () => {

            return new Promise((resolve) => {

                if (window.Razorpay) {
                    resolve(true);
                    return;
                }

                const script = document.createElement("script");

                script.src =
                    "https://checkout.razorpay.com/v1/checkout.js";

                script.onload = () => {
                    resolve(true);
                };

                script.onerror = () => {
                    resolve(false);
                };

                document.body.appendChild(script);

            });

        };

        loadRazorpay();

    }, []);


    // =====================================================
    // NO PAYMENT DATA
    // =====================================================

    if (!order || !payment) {

        return (

            <div className="payment-error">

                <h2>No Payment Found</h2>

                <button
                    onClick={() => navigate("/cart")}
                >
                    Go To Cart
                </button>

            </div>

        );

    }


    // =====================================================
    // PAY NOW
    // =====================================================

    const handlePayment = async () => {

        try {

            setLoading(true);

            console.log(
                "================================="
            );

            console.log(
                "PAYMENT STARTED"
            );

            console.log(
                "ORDER =",
                order
            );

            console.log(
                "PAYMENT =",
                payment
            );


            // =================================================
            // CHECK RAZORPAY
            // =================================================

            if (!window.Razorpay) {

                alert(
                    "Razorpay SDK is not loaded. Please refresh the page."
                );

                setLoading(false);

                return;

            }


            // =================================================
            // CREATE PAYMENT
            // =================================================

            const paymentData = {

                paymentFor: "ORDER",

                referenceId: order._id,

                amount:
                    Number(order.totalAmount) ||
                    Number(payment.amount),

                paymentMethod:
                    payment.paymentMethod || "ONLINE",

            };


            console.log(
                "PAYMENT DATA =",
                paymentData
            );


            const response =
                await createPayment(paymentData);


            console.log(
                "CREATE PAYMENT RESPONSE =",
                response
            );


            // =================================================
            // GET PAYMENT FROM RESPONSE
            // =================================================

            const createdPayment =
                response?.data ||
                response?.payment;


            if (!createdPayment) {

                console.error(
                    "Payment response missing:",
                    response
                );

                throw new Error(
                    "Payment could not be created"
                );

            }


            console.log(
                "CREATED PAYMENT =",
                createdPayment
            );


            // =================================================
            // PAYMENT ID
            // =================================================

            const paymentId =
                createdPayment._id ||
                createdPayment.id;


            if (!paymentId) {

                throw new Error(
                    "Payment ID not received from backend"
                );

            }


            // =================================================
            // RAZORPAY ORDER ID
            // =================================================

            const razorpayOrderId =
                createdPayment.razorpayOrderId ||
                createdPayment.razorpay_order_id ||
                createdPayment.orderId;


            // =================================================
            // RAZORPAY KEY
            // =================================================

            const razorpayKey =
                import.meta.env.VITE_RAZORPAY_KEY_ID;


            console.log(
                "RAZORPAY KEY =",
                razorpayKey
            );

            console.log(
                "RAZORPAY ORDER ID =",
                razorpayOrderId
            );


            if (!razorpayKey) {

                throw new Error(
                    "VITE_RAZORPAY_KEY_ID is missing in frontend .env"
                );

            }


            if (!razorpayOrderId) {

                throw new Error(
                    "Razorpay Order ID not received from backend"
                );

            }


            // =================================================
            // RAZORPAY OPTIONS
            // =================================================

            const options = {

                key: razorpayKey,

                amount:
                    Number(
                        createdPayment.amount ||
                        payment.amount ||
                        order.totalAmount
                    ) * 100,

                currency: "INR",

                name: "Zaid Infotech",

                description:
                    `Payment for Order #${order._id}`,

                order_id:
                    razorpayOrderId,


                // =================================================
                // SUCCESS
                // =================================================

                handler: async function (razorpayResponse) {

                    try {

                        console.log(
                            "RAZORPAY SUCCESS =",
                            razorpayResponse
                        );


                        // ==========================================
                        // VERIFY PAYMENT
                        // ==========================================

                        const verifyData = {

                            orderId: order._id,

                            razorpayOrderId:
                                razorpayResponse.razorpay_order_id,

                            razorpayPaymentId:
                                razorpayResponse.razorpay_payment_id,

                            razorpaySignature:
                                razorpayResponse.razorpay_signature,

                        };


                        console.log(
                            "VERIFY DATA =",
                            verifyData
                        );


                        await paymentSuccess(
                            paymentId,
                            verifyData
                        );


                        // ==========================================
                        // SUCCESS PAGE
                        // ==========================================

                        navigate(
                            "/payment-success",
                            {
                                state: {

                                    order: order,

                                    payment: {
                                        ...createdPayment,

                                        paymentStatus:
                                            "PAID",

                                    },

                                },

                            }
                        );

                    }

                    catch (error) {

                        console.error(
                            "PAYMENT VERIFICATION ERROR =",
                            error
                        );

                        alert(
                            error?.response?.data?.message ||
                            error?.message ||
                            "Payment verification failed"
                        );

                    }

                    finally {

                        setLoading(false);

                    }

                },


                // =================================================
                // PREFILL
                // =================================================

                prefill: {

                    name:
                        order.shippingAddress?.fullName ||
                        "",

                    contact:
                        order.shippingAddress?.phone ||
                        "",

                    email:
                        order.email ||
                        "",

                },


                // =================================================
                // THEME
                // =================================================

                theme: {

                    color: "#2563eb",

                },


                // =================================================
                // MODAL CLOSE
                // =================================================

                modal: {

                    ondismiss: function () {

                        console.log(
                            "Razorpay popup closed"
                        );

                        setLoading(false);

                    },

                },

            };


            console.log(
                "RAZORPAY OPTIONS =",
                options
            );


            // =================================================
            // OPEN RAZORPAY
            // =================================================

            const razorpay =
                new window.Razorpay(options);


            // =================================================
            // PAYMENT FAILED
            // =================================================

            razorpay.on(
                "payment.failed",
                async function (response) {

                    console.error(
                        "RAZORPAY PAYMENT FAILED =",
                        response
                    );


                    try {

                        await paymentFailed(
                            paymentId,
                            {

                                failureReason:
                                    response?.error?.description ||
                                    "Razorpay Payment Failed",

                            }
                        );

                    }

                    catch (error) {

                        console.error(
                            "FAILED PAYMENT UPDATE ERROR =",
                            error
                        );

                    }

                    finally {

                        setLoading(false);

                    }

                }
            );


            razorpay.open();

        }

        catch (error) {

            console.error(
                "PAYMENT ERROR =",
                error
            );


            console.error(
                "BACKEND RESPONSE =",
                error?.response?.data
            );


            alert(

                error?.response?.data?.message ||

                error?.response?.data?.errors?.join(
                    "\n"
                ) ||

                error?.message ||

                "Unable to start payment"

            );


            setLoading(false);

        }

    };


    // =====================================================
    // CANCEL PAYMENT
    // =====================================================

    const cancelPayment = async () => {

        try {

            setLoading(true);


            await paymentFailed(

                payment._id,

                {

                    failureReason:
                        "Cancelled By User",

                }

            );


            navigate("/cart");

        }

        catch (error) {

            console.error(
                "CANCEL PAYMENT ERROR =",
                error
            );

            navigate("/cart");

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // UI
    // =====================================================

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

                        ₹{" "}

                        {
                            order.totalAmount ||
                            payment.amount
                        }

                    </p>


                    <p>

                        <strong>
                            Payment Method :
                        </strong>

                        {
                            payment.paymentMethod
                        }

                    </p>


                    <p>

                        <strong>
                            Status :
                        </strong>

                        {
                            payment.paymentStatus
                        }

                    </p>


                </div>


                {/* PAY NOW */}

                <button

                    className="pay-btn"

                    onClick={handlePayment}

                    disabled={loading}

                >

                    {loading
                        ? "Processing..."
                        : "Pay Now"
                    }

                </button>


                {/* CANCEL */}

                <button

                    className="cancel-btn"

                    onClick={cancelPayment}

                    disabled={loading}

                >

                    Cancel

                </button>


            </div>

        </div>

    );

};

export default Payment;