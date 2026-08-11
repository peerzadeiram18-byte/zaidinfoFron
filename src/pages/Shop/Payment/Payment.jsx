// import React, { useEffect, useState } from "react";
// import "./Payment.css";

// import {
//     useLocation,
//     useNavigate
// } from "react-router-dom";
// import { toast } from "react-toastify";

// import {
//     createPayment,
//     createRazorpayOrder,
//     verifyRazorpayPayment,
//     paymentFailed
// } from "../../../services/paymentService";
// import {
//     createInvoice
// } from "../../../services/invoiceService";


// const Payment = () => {

//     const location = useLocation();
//     const navigate = useNavigate();

//     const {
//         order,
//         payment
//     } = location.state || {};

//     // ==========================================
//     // STATES
//     // ==========================================

//     const [loading, setLoading] = useState(false);

//     const [razorpayLoaded, setRazorpayLoaded] =
//         useState(false);

//     // ==========================================
//     // LOAD RAZORPAY SDK
//     // ==========================================

//     useEffect(() => {

//         const loadRazorpay = () => {

//             // Already loaded
//             if (window.Razorpay) {

//                 console.log(
//                     "Razorpay SDK Already Loaded"
//                 );

//                 setRazorpayLoaded(true);

//                 return;
//             }

//             const script =
//                 document.createElement("script");

//             script.src =
//                 "https://checkout.razorpay.com/v1/checkout.js";

//             script.async = true;

//             script.onload = () => {

//                 console.log(
//                     "Razorpay SDK Loaded Successfully"
//                 );

//                 setRazorpayLoaded(true);

//             };

//             script.onerror = () => {

//                 console.error(
//                     "Razorpay SDK Failed To Load"
//                 );

//                 setRazorpayLoaded(false);

//             };

//             document.body.appendChild(script);

//         };

//         loadRazorpay();

//     }, []);

//     // ==========================================
//     // NO ORDER / PAYMENT DATA
//     // ==========================================

//     if (!order) {

//         return (

//             <div className="payment-error">

//                 <h2>
//                     No Order Found
//                 </h2>

//                 <p>
//                     Please go back to cart and try again.
//                 </p>

//                 <button
//                     onClick={() => navigate("/cart")}
//                 >
//                     Go To Cart
//                 </button>

//             </div>

//         );

//     }

//     // ==========================================
//     // HANDLE PAYMENT
//     // ==========================================

//     const handlePayment = async () => {

//         if (loading) {
//             return;
//         }

//         try {

//             setLoading(true);

//             console.log(
//                 "================================="
//             );

//             console.log(
//                 "PAYMENT STARTED"
//             );

//             console.log(
//                 "ORDER =",
//                 order
//             );

//             console.log(
//                 "PAYMENT FROM CHECKOUT =",
//                 payment
//             );

//             // ==========================================
//             // 1. VALIDATE ORDER
//             // ==========================================

//             if (!order?._id) {

//                 throw new Error(
//                     "Order ID is missing"
//                 );

//             }

//             // ==========================================
//             // 2. GET PAYMENT AMOUNT
//             // ==========================================

//             const amount = Number(
//                 order.totalAmount ??
//                 payment?.amount ??
//                 0
//             );

//             if (
//                 !Number.isFinite(amount) ||
//                 amount <= 0
//             ) {

//                 throw new Error(
//                     "Invalid payment amount"
//                 );

//             }

//             console.log(
//                 "PAYMENT AMOUNT =",
//                 amount
//             );

//             // ==========================================
//             // 3. RAZORPAY KEY
//             // ==========================================

//             const razorpayKey =
//                 import.meta.env.VITE_RAZORPAY_KEY_ID;

//             console.log(
//                 "RAZORPAY KEY =",
//                 razorpayKey
//             );

//             if (!razorpayKey) {

//                 throw new Error(
//                     "VITE_RAZORPAY_KEY_ID is missing in frontend .env"
//                 );

//             }

//             // ==========================================
//             // 4. CHECK RAZORPAY SDK
//             // ==========================================

//             if (
//                 !window.Razorpay ||
//                 !razorpayLoaded
//             ) {

//                 throw new Error(
//                     "Razorpay SDK is not loaded. Please refresh the page."
//                 );

//             }

//             // ==========================================
//             // 5. CREATE DATABASE PAYMENT
//             // ==========================================
//             //
//             // IMPORTANT:
//             //
//             // Backend allows only:
//             //
//             // UPI
//             // CARD
//             // NET_BANKING
//             // CASH
//             //
//             // DO NOT USE:
//             //
//             // COD
//             // ONLINE
//             // WALLET
//             //
//             // ==========================================

//             const paymentData = {

//                 paymentFor:
//                     "ORDER",

//                 referenceId:
//                     order._id,

//                 amount:
//                     amount,

//                 paymentMethod:
//                     "UPI"

//             };

//             console.log(
//                 "DATABASE PAYMENT DATA =",
//                 paymentData
//             );

//             const paymentResponse =
//                 await createPayment(
//                     paymentData
//                 );

//             console.log(
//                 "CREATE PAYMENT RESPONSE =",
//                 paymentResponse
//             );

//             // ==========================================
//             // VALIDATE PAYMENT RESPONSE
//             // ==========================================

//             if (
//                 !paymentResponse ||
//                 !paymentResponse.success ||
//                 !paymentResponse.payment
//             ) {

//                 throw new Error(
//                     paymentResponse?.message ||
//                     "Payment creation failed"
//                 );

//             }

//             const createdPayment =
//                 paymentResponse.payment;

//             console.log(
//                 "CREATED DATABASE PAYMENT =",
//                 createdPayment
//             );

//             // ==========================================
//             // 6. CREATE RAZORPAY ORDER
//             // ==========================================

//             const razorpayResponse =
//                 await createRazorpayOrder(
//                     order._id
//                 );

//             console.log(
//                 "RAZORPAY BACKEND RESPONSE =",
//                 razorpayResponse
//             );

//             if (
//                 !razorpayResponse ||
//                 !razorpayResponse.success
//             ) {

//                 throw new Error(
//                     razorpayResponse?.message ||
//                     "Unable to create Razorpay order"
//                 );

//             }

//             // ==========================================
//             // GET RAZORPAY ORDER
//             // ==========================================

//             const razorpayOrder =
//                 razorpayResponse.order ||
//                 razorpayResponse.data;

//             console.log(
//                 "RAZORPAY ORDER =",
//                 razorpayOrder
//             );

//             if (!razorpayOrder) {

//                 throw new Error(
//                     "Razorpay order response is missing"
//                 );

//             }

//             // ==========================================
//             // RAZORPAY ORDER ID
//             // ==========================================

//             const razorpayOrderId =
//                 razorpayOrder.id;

//             console.log(
//                 "RAZORPAY ORDER ID =",
//                 razorpayOrderId
//             );

//             if (!razorpayOrderId) {

//                 throw new Error(
//                     "Razorpay Order ID not received from backend"
//                 );

//             }

//             // ==========================================
//             // 7. RAZORPAY OPTIONS
//             // ==========================================

//             const options = {

//                 key:
//                     razorpayKey,

//                 amount:
//                     razorpayOrder.amount,

//                 currency:
//                     razorpayOrder.currency ||
//                     "INR",

//                 name:
//                     "Zaid Infotech",

//                 description:
//                     `Payment for Order #${order._id}`,

//                 order_id:
//                     razorpayOrderId,

//                 // ======================================
//                 // SUCCESS HANDLER
//                 // ======================================

//                 handler:
//                     async function (
//                         razorpayResponse
//                     ) {

//                         console.log(
//                             "================================="
//                         );

//                         console.log(
//                             "RAZORPAY PAYMENT SUCCESS"
//                         );

//                         console.log(
//                             "RAZORPAY RESPONSE =",
//                             razorpayResponse
//                         );

//                         try {

//                             setLoading(true);

//                             // ==================================
//                             // VALIDATE RAZORPAY RESPONSE
//                             // ==================================

//                             if (
//                                 !razorpayResponse?.razorpay_order_id ||
//                                 !razorpayResponse?.razorpay_payment_id ||
//                                 !razorpayResponse?.razorpay_signature
//                             ) {

//                                 throw new Error(
//                                     "Invalid Razorpay payment response"
//                                 );

//                             }

//                             // ==================================
//                             // VERIFY PAYMENT
//                             // ==================================

//                             const verifyResponse =
//                                 await verifyRazorpayPayment({

//                                     paymentId:
//                                         createdPayment._id,

//                                     razorpayOrderId:
//                                         razorpayResponse
//                                             .razorpay_order_id,

//                                     razorpayPaymentId:
//                                         razorpayResponse
//                                             .razorpay_payment_id,

//                                     razorpaySignature:
//                                         razorpayResponse
//                                             .razorpay_signature

//                                 });

//                             console.log(
//                                 "VERIFY RESPONSE =",
//                                 verifyResponse
//                             );

//                             // ==================================
//                             // CHECK VERIFY RESPONSE
//                             // ==================================

//                             if (
//                                 !verifyResponse ||
//                                 !verifyResponse.success
//                             ) {

//                                 throw new Error(
//                                     verifyResponse?.message ||
//                                     "Payment verification failed"
//                                 );

//                             }

//                             // ==================================
//                             // FINAL PAYMENT
//                             // ==================================

//                             // const finalPayment =
//                             //     verifyResponse.payment ||
//                             //     createdPayment;

//                             // console.log(
//                             //     "FINAL PAYMENT =",
//                             //     finalPayment
//                             // );

//                             // ==================================
//                             // SUCCESS
//                             // ==================================

//                         //    toast.success(
//                         //         "Payment successful!"
//                         //     );

//                         //     navigate(
//                         //         "/order-success",
//                         //         {
//                         //             state: {

//                         //                 order:
//                         //                     order,

//                         //                 payment:
//                         //                     finalPayment

//                         //             }
//                         //         }
//                         //     );


// const finalPayment =
//     verifyResponse.payment ||
//     createdPayment;

// console.log(
//     "FINAL PAYMENT =",
//     finalPayment
// );

// // ==========================================
// // CREATE INVOICE
// // ==========================================

// // let createdInvoice = null;// ==========================================
// // CREATE ONLINE INVOICE
// // ==========================================

// console.log("=================================");
// console.log("CREATING ONLINE INVOICE");
// console.log("ORDER ID:", order._id);
// console.log("ORDER PAYMENT STATUS:", order.paymentStatus);
// console.log("FINAL PAYMENT:", finalPayment);

// const invoiceResponse =
//     await createInvoice(order._id);

// console.log(
//     "ONLINE INVOICE RESPONSE:",
//     invoiceResponse
// );

// if (!invoiceResponse?.success) {

//     throw new Error(
//         invoiceResponse?.message ||
//         "Online invoice creation failed"
//     );

// }

// const createdInvoice =
//     invoiceResponse.data;

// console.log(
//     "ONLINE INVOICE CREATED SUCCESSFULLY:",
//     createdInvoice
// );




// // try {

// //     console.log(
// //         "CREATING ONLINE INVOICE FOR ORDER:",
// //         order._id
// //     );

// //     const invoiceResponse =
// //         await createInvoice(order._id);

// //     console.log(
// //         "ONLINE INVOICE RESPONSE:",
// //         invoiceResponse
// //     );

// //     if (
// //         invoiceResponse?.success
// //     ) {

// //         createdInvoice =
// //             invoiceResponse.data;

// //         console.log(
// //             "ONLINE INVOICE CREATED:",
// //             createdInvoice
// //         );

// //     } else {

// //         console.warn(
// //             "Invoice was not created:",
// //             invoiceResponse
// //         );

// //     }

// // } catch (invoiceError) {

// //     console.error(
// //         "ONLINE INVOICE CREATION ERROR:",
// //         invoiceError
// //     );

// //     console.error(
// //         "INVOICE BACKEND RESPONSE:",
// //         invoiceError?.response?.data
// //     );

// //     // Don't fail the payment because
// //     // invoice creation failed.
// // }

// // ==========================================
// // SUCCESS
// // ==========================================

// toast.success(
//     "Payment successful!"
// );

// navigate(
//     "/order-success",
//     {
//         state: {

//             order:
//                 order,

//             payment:
//                 finalPayment,

//             invoice:
//                 createdInvoice

//         }
//     }
// );

//                         }

//                         catch (error) {

//                             console.error(
//                                 "PAYMENT VERIFICATION ERROR =",
//                                 error
//                             );

//                             console.error(
//                                 "BACKEND RESPONSE =",
//                                 error.response?.data
//                             );

//                             const backendData =
//                                 error.response?.data;

//                             let message =
//                                 backendData?.message ||
//                                 error.message ||
//                                 "Payment verification failed";

//                             if (
//                                 Array.isArray(
//                                     backendData?.errors
//                                 ) &&
//                                 backendData.errors.length > 0
//                             ) {

//                                 message =
//                                     backendData.errors.join(
//                                         "\n"
//                                     );

//                             }

//                             toast.error(
//                                 message
//                             );

//                         }

//                         finally {

//                             setLoading(false);

//                         }

//                     },

//                 // ======================================
//                 // PAYMENT MODAL
//                 // ======================================

//                 modal: {

//                     ondismiss:
//                         function () {

//                             console.log(
//                                 "Razorpay payment popup closed"
//                             );

//                             setLoading(false);

//                         }

//                 },

//                 // ======================================
//                 // PREFILL
//                 // ======================================

//                 prefill: {

//                     name:
//                         order.shippingAddress?.fullName ||
//                         order.shippingAddress?.name ||
//                         "",

//                     email:
//                         order.shippingAddress?.email ||
//                         "",

//                     contact:
//                         order.shippingAddress?.phone ||
//                         order.shippingAddress?.mobile ||
//                         ""

//                 },

//                 // ======================================
//                 // NOTES
//                 // ======================================

//                 notes: {

//                     orderId:
//                         order._id

//                 },

//                 // ======================================
//                 // THEME
//                 // ======================================

//                 theme: {

//                     color:
//                         "#2563eb"

//                 }

//             };

//             console.log(
//                 "RAZORPAY OPTIONS =",
//                 options
//             );

//             // ==========================================
//             // 8. CREATE RAZORPAY INSTANCE
//             // ==========================================

//             const razorpay =
//                 new window.Razorpay(
//                     options
//                 );

//             // ==========================================
//             // PAYMENT FAILED
//             // ==========================================

//             razorpay.on(
//                 "payment.failed",
//                 async function (
//                     response
//                 ) {

//                     console.error(
//                         "RAZORPAY PAYMENT FAILED =",
//                         response
//                     );

//                     try {

//                         if (
//                             createdPayment?._id
//                         ) {

//                             await paymentFailed(

//                                 createdPayment._id,

//                                 {

//                                     failureReason:
//                                         response?.error
//                                             ?.description ||
//                                         "Razorpay payment failed"

//                                 }

//                             );

//                         }

//                     }

//                     catch (error) {

//                         console.error(
//                             "FAILED PAYMENT UPDATE ERROR =",
//                             error
//                         );

//                     }

//                     finally {

//                         setLoading(false);

//                     }

//                 }
//             );

//             // ==========================================
//             // 9. OPEN RAZORPAY
//             // ==========================================

//             razorpay.open();

//         }

//         catch (error) {

//             console.error(
//                 "================================="
//             );

//             console.error(
//                 "PAYMENT ERROR =",
//                 error
//             );

//             console.error(
//                 "BACKEND RESPONSE =",
//                 error.response?.data
//             );

//             const backendData =
//                 error.response?.data;

//             let message =
//                 backendData?.message ||
//                 error.message ||
//                 "Unable to start payment";

//             // ==========================================
//             // SHOW JOI VALIDATION ERRORS
//             // ==========================================

//             if (
//                 Array.isArray(
//                     backendData?.errors
//                 ) &&
//                 backendData.errors.length > 0
//             ) {

//                 message =
//                     backendData.errors.join(
//                         "\n"
//                     );

//             }

//             toast.error(
//                 message
//             );

//             setLoading(false);

//         }

//     };

//     // ==========================================
//     // CANCEL PAYMENT
//     // ==========================================

//     const cancelPayment = async () => {

//         if (loading) {
//             return;
//         }

//         try {

//             setLoading(true);

//             // ------------------------------------------
//             // If payment was created on this page,
//             // mark it failed/cancelled.
//             // ------------------------------------------

//             if (payment?._id) {

//                 await paymentFailed(

//                     payment._id,

//                     {

//                         failureReason:
//                             "Cancelled By User"

//                     }

//                 );

//             }

//             navigate(
//                 "/cart"
//             );

//         }

//         catch (error) {

//             console.error(
//                 "CANCEL PAYMENT ERROR =",
//                 error
//             );

//             navigate(
//                 "/cart"
//             );

//         }

//         finally {

//             setLoading(false);

//         }

//     };

//     // ==========================================
//     // UI
//     // ==========================================

//     return (

//         <div className="payment-container">

//             <div className="payment-card">

//                 <h1>
//                     Payment
//                 </h1>

//                 <div className="payment-info">

//                     {/* ORDER ID */}

//                     <p>

//                         <strong>
//                             Order ID :
//                         </strong>{" "}

//                         {order?._id || "-"}

//                     </p>

//                     {/* RECEIPT */}

//                     <p>

//                         <strong>
//                             Receipt :
//                         </strong>{" "}

//                         {payment?.receiptNumber || "-"}

//                     </p>

//                     {/* AMOUNT */}

//                     <p>

//                         <strong>
//                             Amount :
//                         </strong>{" "}

//                         ₹{" "}

//                         {
//                             Number(
//                                 order?.totalAmount ??
//                                 payment?.amount ??
//                                 0
//                             )
//                         }

//                     </p>

//                     {/* PAYMENT METHOD */}

//                     <p>

//                         <strong>
//                             Payment Method :
//                         </strong>{" "}

//                         UPI

//                     </p>

//                     {/* STATUS */}

//                     <p>

//                         <strong>
//                             Status :
//                         </strong>{" "}

//                         {
//                             payment?.paymentStatus ||
//                             "PENDING"
//                         }

//                     </p>

//                 </div>

//                 {/* ==================================
//                     PAY NOW
//                 ================================== */}

//                 <button
//                     type="button"
//                     className="pay-btn"
//                     onClick={handlePayment}
//                     disabled={loading}
//                 >

//                     {
//                         loading
//                             ? "Processing..."
//                             : "Pay Now"
//                     }

//                 </button>

//                 {/* ==================================
//                     CANCEL
//                 ================================== */}

//                 <button
//                     type="button"
//                     className="cancel-btn"
//                     onClick={cancelPayment}
//                     disabled={loading}
//                 >

//                     Cancel

//                 </button>

//             </div>

//         </div>

//     );

// };

// export default Payment;



import React, { useEffect, useState } from "react";
import "./Payment.css";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import { toast } from "react-toastify";

import {
    createPayment,
    createRazorpayOrder,
    verifyRazorpayPayment,
    paymentFailed
} from "../../../services/paymentService";

import {
    createInvoice
} from "../../../services/invoiceService";


const Payment = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        order,
        payment
    } = location.state || {};

    // ==========================================
    // STATES
    // ==========================================

    const [loading, setLoading] = useState(false);

    const [razorpayLoaded, setRazorpayLoaded] =
        useState(false);


    // ==========================================
    // LOAD RAZORPAY SDK
    // ==========================================

    useEffect(() => {

        if (window.Razorpay) {

            console.log(
                "Razorpay SDK Already Loaded"
            );

            setRazorpayLoaded(true);

            return;

        }

        const script =
            document.createElement("script");

        script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

        script.async = true;

        script.onload = () => {

            console.log(
                "Razorpay SDK Loaded Successfully"
            );

            setRazorpayLoaded(true);

        };

        script.onerror = () => {

            console.error(
                "Razorpay SDK Failed To Load"
            );

            setRazorpayLoaded(false);

            toast.error(
                "Unable to load Razorpay. Please refresh the page."
            );

        };

        document.body.appendChild(script);

    }, []);


    // ==========================================
    // NO ORDER
    // ==========================================

    if (!order) {

        return (

            <div className="payment-error">

                <h2>
                    No Order Found
                </h2>

                <p>
                    Please go back to cart and try again.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/cart")}
                >
                    Go To Cart
                </button>

            </div>

        );

    }


    // ==========================================
    // HANDLE PAYMENT
    // ==========================================

    const handlePayment = async () => {

        if (loading) {
            return;
        }

        try {

            setLoading(true);

            console.log(
                "================================="
            );

            console.log(
                "ONLINE PAYMENT STARTED"
            );

            console.log(
                "ORDER:",
                order
            );

            console.log(
                "PAYMENT FROM CHECKOUT:",
                payment
            );


            // ==========================================
            // 1. VALIDATE ORDER
            // ==========================================

            if (!order?._id) {

                throw new Error(
                    "Order ID is missing"
                );

            }


            // ==========================================
            // 2. PAYMENT AMOUNT
            // ==========================================

            const amount = Number(
                order.totalAmount ??
                payment?.amount ??
                0
            );

            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                throw new Error(
                    "Invalid payment amount"
                );

            }

            console.log(
                "ONLINE PAYMENT AMOUNT:",
                amount
            );


            // ==========================================
            // 3. RAZORPAY KEY
            // ==========================================

            const razorpayKey =
                import.meta.env.VITE_RAZORPAY_KEY_ID;

            if (!razorpayKey) {

                throw new Error(
                    "VITE_RAZORPAY_KEY_ID is missing in frontend .env"
                );

            }


            // ==========================================
            // 4. RAZORPAY SDK CHECK
            // ==========================================

            if (
                !window.Razorpay ||
                !razorpayLoaded
            ) {

                throw new Error(
                    "Razorpay SDK is not loaded. Please refresh the page."
                );

            }


            // ==========================================
            // 5. CREATE DATABASE PAYMENT
            // ==========================================

            const paymentData = {

                paymentFor:
                    "ORDER",

                referenceId:
                    order._id,

                amount:
                    amount,

                paymentMethod:
                    "UPI"

            };

            console.log(
                "DATABASE PAYMENT DATA:",
                paymentData
            );


            const paymentResponse =
                await createPayment(
                    paymentData
                );

            console.log(
                "CREATE PAYMENT RESPONSE:",
                paymentResponse
            );


            if (
                !paymentResponse ||
                !paymentResponse.success ||
                !paymentResponse.payment
            ) {

                throw new Error(
                    paymentResponse?.message ||
                    "Payment creation failed"
                );

            }


            const createdPayment =
                paymentResponse.payment;


            console.log(
                "CREATED DATABASE PAYMENT:",
                createdPayment
            );


            // ==========================================
            // 6. CREATE RAZORPAY ORDER
            // ==========================================

            const razorpayResponse =
                await createRazorpayOrder(
                    order._id
                );


            console.log(
                "RAZORPAY BACKEND RESPONSE:",
                razorpayResponse
            );


            if (
                !razorpayResponse ||
                !razorpayResponse.success
            ) {

                throw new Error(
                    razorpayResponse?.message ||
                    "Unable to create Razorpay order"
                );

            }


            // ==========================================
            // 7. GET RAZORPAY ORDER
            // ==========================================

            const razorpayOrder =
                razorpayResponse.order ||
                razorpayResponse.data;


            console.log(
                "RAZORPAY ORDER:",
                razorpayOrder
            );


            if (!razorpayOrder) {

                throw new Error(
                    "Razorpay order response is missing"
                );

            }


            const razorpayOrderId =
                razorpayOrder.id;


            if (!razorpayOrderId) {

                throw new Error(
                    "Razorpay Order ID not received from backend"
                );

            }


            console.log(
                "RAZORPAY ORDER ID:",
                razorpayOrderId
            );


            // ==========================================
            // 8. RAZORPAY OPTIONS
            // ==========================================

            const options = {

                key:
                    razorpayKey,

                amount:
                    razorpayOrder.amount,

                currency:
                    razorpayOrder.currency ||
                    "INR",

                name:
                    "Zaid Infotech",

                description:
                    `Payment for Order #${order._id}`,

                order_id:
                    razorpayOrderId,


                // ======================================
                // SUCCESS
                // ======================================

                handler:
                    async function (
                        razorpayResponse
                    ) {

                        console.log(
                            "================================="
                        );

                        console.log(
                            "RAZORPAY PAYMENT SUCCESS"
                        );

                        console.log(
                            "RAZORPAY RESPONSE:",
                            razorpayResponse
                        );


                        try {

                            setLoading(true);


                            // ==================================
                            // VALIDATE RAZORPAY RESPONSE
                            // ==================================

                            if (
                                !razorpayResponse?.razorpay_order_id ||
                                !razorpayResponse?.razorpay_payment_id ||
                                !razorpayResponse?.razorpay_signature
                            ) {

                                throw new Error(
                                    "Invalid Razorpay payment response"
                                );

                            }


                            // ==================================
                            // VERIFY PAYMENT
                            // ==================================

                           const verifyResponse =
    await verifyRazorpayPayment({
        paymentId:
            createdPayment._id,

        razorpayOrderId:
            razorpayResponse.razorpay_order_id,

        razorpayPaymentId:
            razorpayResponse.razorpay_payment_id,

        razorpaySignature:
            razorpayResponse.razorpay_signature,
    });

console.log(
    "VERIFY RESPONSE =",
    verifyResponse
);

if (
    !verifyResponse ||
    !verifyResponse.success
) {
    throw new Error(
        verifyResponse?.message ||
        "Payment verification failed"
    );
}

// ==========================================
// FINAL PAYMENT
// ==========================================

const finalPayment =
    verifyResponse.payment ||
    createdPayment;

console.log(
    "FINAL PAYMENT:",
    finalPayment
);

// ==========================================
// CREATE ONLINE INVOICE
// ==========================================

console.log(
    "================================="
);

console.log(
    "CREATING ONLINE INVOICE"
);

console.log(
    "ORDER ID:",
    order._id
);

const invoiceResponse =
    await createInvoice(order._id);

console.log(
    "ONLINE INVOICE RESPONSE:",
    invoiceResponse
);

if (
    !invoiceResponse ||
    !invoiceResponse.success
) {
    throw new Error(
        invoiceResponse?.message ||
        "Online invoice creation failed"
    );
}

const createdInvoice =
    invoiceResponse.data;

console.log(
    "ONLINE INVOICE CREATED:",
    createdInvoice
);

// ==========================================
// SUCCESS
// ==========================================

toast.success(
    "Payment successful and invoice generated!"
);

navigate(
    "/order-success",
    {
        state: {
            order,
            payment: finalPayment,
            invoice: createdInvoice,
        },
    }
);
                        }

                        catch (error) {

                            console.error(
                                "================================="
                            );

                            console.error(
                                "PAYMENT VERIFICATION ERROR:",
                                error
                            );

                            console.error(
                                "BACKEND RESPONSE:",
                                error?.response?.data
                            );


                            const backendData =
                                error?.response?.data;


                            let message =
                                backendData?.message ||
                                error?.message ||
                                "Payment verification failed";


                            if (
                                Array.isArray(
                                    backendData?.errors
                                ) &&
                                backendData.errors.length > 0
                            ) {

                                message =
                                    backendData.errors.join(
                                        "\n"
                                    );

                            }


                            toast.error(
                                message
                            );

                        }

                        finally {

                            setLoading(false);

                        }

                    },


                // ======================================
                // PAYMENT MODAL
                // ======================================

                modal: {

                    ondismiss:
                        function () {

                            console.log(
                                "Razorpay payment popup closed"
                            );

                            setLoading(false);

                        }

                },


                // ======================================
                // PREFILL
                // ======================================

                prefill: {

                    name:
                        order.shippingAddress?.fullName ||
                        order.shippingAddress?.name ||
                        "",

                    email:
                        order.shippingAddress?.email ||
                        "",

                    contact:
                        order.shippingAddress?.phone ||
                        order.shippingAddress?.mobile ||
                        ""

                },


                // ======================================
                // NOTES
                // ======================================

                notes: {

                    orderId:
                        order._id,

                    orderSource:
                        "ONLINE"

                },


                // ======================================
                // THEME
                // ======================================

                theme: {

                    color:
                        "#2563eb"

                }

            };


            console.log(
                "RAZORPAY OPTIONS:",
                options
            );


            // ==========================================
            // 9. CREATE RAZORPAY INSTANCE
            // ==========================================

            const razorpay =
                new window.Razorpay(
                    options
                );


            // ==========================================
            // PAYMENT FAILED
            // ==========================================

            razorpay.on(
                "payment.failed",
                async function (
                    response
                ) {

                    console.error(
                        "RAZORPAY PAYMENT FAILED:",
                        response
                    );


                    try {

                        if (
                            createdPayment?._id
                        ) {

                            await paymentFailed(

                                createdPayment._id,

                                {

                                    failureReason:
                                        response?.error?.description ||
                                        "Razorpay payment failed"

                                }

                            );

                        }

                    }

                    catch (error) {

                        console.error(
                            "FAILED PAYMENT UPDATE ERROR:",
                            error
                        );

                    }

                    finally {

                        setLoading(false);

                    }

                }
            );


            // ==========================================
            // 10. OPEN RAZORPAY
            // ==========================================

            razorpay.open();

        }

        catch (error) {

            console.error(
                "================================="
            );

            console.error(
                "PAYMENT ERROR:",
                error
            );

            console.error(
                "BACKEND RESPONSE:",
                error?.response?.data
            );


            const backendData =
                error?.response?.data;


            let message =
                backendData?.message ||
                error?.message ||
                "Unable to start payment";


            if (
                Array.isArray(
                    backendData?.errors
                ) &&
                backendData.errors.length > 0
            ) {

                message =
                    backendData.errors.join(
                        "\n"
                    );

            }


            toast.error(
                message
            );


            setLoading(false);

        }

    };


    // ==========================================
    // CANCEL PAYMENT
    // ==========================================

    const cancelPayment = async () => {

        if (loading) {
            return;
        }


        try {

            setLoading(true);


            if (payment?._id) {

                await paymentFailed(

                    payment._id,

                    {

                        failureReason:
                            "Cancelled By User"

                    }

                );

            }


            navigate(
                "/cart"
            );

        }

        catch (error) {

            console.error(
                "CANCEL PAYMENT ERROR:",
                error
            );

            navigate(
                "/cart"
            );

        }

        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // UI
    // ==========================================

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
                        </strong>{" "}

                        {order?._id || "-"}

                    </p>


                    <p>

                        <strong>
                            Receipt :
                        </strong>{" "}

                        {payment?.receiptNumber || "-"}

                    </p>


                    <p>

                        <strong>
                            Amount :
                        </strong>{" "}

                        ₹{" "}

                        {Number(
                            order?.totalAmount ??
                            payment?.amount ??
                            0
                        ).toLocaleString("en-IN")}

                    </p>


                    <p>

                        <strong>
                            Payment Method :
                        </strong>{" "}

                        UPI

                    </p>


                    <p>

                        <strong>
                            Status :
                        </strong>{" "}

                        {payment?.paymentStatus ||
                            "PENDING"}

                    </p>

                </div>


                <button
                    type="button"
                    className="pay-btn"
                    onClick={handlePayment}
                    disabled={loading}
                >

                    {loading
                        ? "Processing..."
                        : "Pay Now"}

                </button>


                <button
                    type="button"
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