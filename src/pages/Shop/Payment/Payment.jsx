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

//         if (window.Razorpay) {

//             console.log(
//                 "Razorpay SDK Already Loaded"
//             );

//             setRazorpayLoaded(true);

//             return;

//         }

//         const script =
//             document.createElement("script");

//         script.src =
//             "https://checkout.razorpay.com/v1/checkout.js";

//         script.async = true;

//         script.onload = () => {

//             console.log(
//                 "Razorpay SDK Loaded Successfully"
//             );

//             setRazorpayLoaded(true);

//         };

//         script.onerror = () => {

//             console.error(
//                 "Razorpay SDK Failed To Load"
//             );

//             setRazorpayLoaded(false);

//             toast.error(
//                 "Unable to load Razorpay. Please refresh the page."
//             );

//         };

//         document.body.appendChild(script);

//     }, []);


//     // ==========================================
//     // NO ORDER
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
//                     type="button"
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
//                 "ONLINE PAYMENT STARTED"
//             );

//             console.log(
//                 "ORDER:",
//                 order
//             );

//             console.log(
//                 "PAYMENT FROM CHECKOUT:",
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
//             // 2. PAYMENT AMOUNT
//             // ==========================================

//             // const amount = Number(
//             //     order.totalAmount ??
//             //     payment?.amount ??
//             //     0
//             // );

// const amount = Number(
//     order.finalAmount ??
//     payment?.amount ??
//     order.totalAmount ??
//     0
// );

//             if (
//                 !Number.isFinite(amount) ||
//                 amount <= 0
//             ) {

//                 throw new Error(
//                     "Invalid payment amount"
//                 );

//             }

//             console.log(
//                 "ONLINE PAYMENT AMOUNT:",
//                 amount
//             );


//             // ==========================================
//             // 3. RAZORPAY KEY
//             // ==========================================

//             const razorpayKey =
//                 import.meta.env.VITE_RAZORPAY_KEY_ID;

//             if (!razorpayKey) {

//                 throw new Error(
//                     "VITE_RAZORPAY_KEY_ID is missing in frontend .env"
//                 );

//             }


//             // ==========================================
//             // 4. RAZORPAY SDK CHECK
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

//             // const paymentData = {

//             //     paymentFor:
//             //         "ORDER",

//             //     referenceId:
//             //         order._id,

//             //     amount:
//             //         amount,

//             //     paymentMethod:
//             //         "UPI"

//             // };

//             const paymentData = {

//     paymentFor: "ORDER",

//     referenceId: order._id,

//     amount: Number(
//         order.finalAmount ??
//         order.totalAmount
//     ),

//     paymentMethod: "UPI"

// };

//             console.log(
//                 "DATABASE PAYMENT DATA:",
//                 paymentData
//             );


//             const paymentResponse =
//                 await createPayment(
//                     paymentData
//                 );

//             console.log(
//                 "CREATE PAYMENT RESPONSE:",
//                 paymentResponse
//             );


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
//                 "CREATED DATABASE PAYMENT:",
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
//                 "RAZORPAY BACKEND RESPONSE:",
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
//             // 7. GET RAZORPAY ORDER
//             // ==========================================

//             const razorpayOrder =
//                 razorpayResponse.order ||
//                 razorpayResponse.data;


//             console.log(
//                 "RAZORPAY ORDER:",
//                 razorpayOrder
//             );


//             if (!razorpayOrder) {

//                 throw new Error(
//                     "Razorpay order response is missing"
//                 );

//             }


//             const razorpayOrderId =
//                 razorpayOrder.id;


//             if (!razorpayOrderId) {

//                 throw new Error(
//                     "Razorpay Order ID not received from backend"
//                 );

//             }


//             console.log(
//                 "RAZORPAY ORDER ID:",
//                 razorpayOrderId
//             );


//             // ==========================================
//             // 8. RAZORPAY OPTIONS
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
//                 // SUCCESS
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
//                             "RAZORPAY RESPONSE:",
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

//                            const verifyResponse =
//     await verifyRazorpayPayment({
//         paymentId:
//             createdPayment._id,

//         razorpayOrderId:
//             razorpayResponse.razorpay_order_id,

//         razorpayPaymentId:
//             razorpayResponse.razorpay_payment_id,

//         razorpaySignature:
//             razorpayResponse.razorpay_signature,
//     });

// console.log(
//     "VERIFY RESPONSE =",
//     verifyResponse
// );

// if (
//     !verifyResponse ||
//     !verifyResponse.success
// ) {
//     throw new Error(
//         verifyResponse?.message ||
//         "Payment verification failed"
//     );
// }

// // ==========================================
// // FINAL PAYMENT
// // ==========================================

// const finalPayment =
//     verifyResponse.payment ||
//     createdPayment;

// console.log(
//     "FINAL PAYMENT:",
//     finalPayment
// );

// // ==========================================
// // CREATE ONLINE INVOICE
// // ==========================================

// console.log(
//     "================================="
// );

// console.log(
//     "CREATING ONLINE INVOICE"
// );

// console.log(
//     "ORDER ID:",
//     order._id
// );

// const invoiceResponse =
//     await createInvoice(order._id);

// console.log(
//     "ONLINE INVOICE RESPONSE:",
//     invoiceResponse
// );

// if (
//     !invoiceResponse ||
//     !invoiceResponse.success
// ) {
//     throw new Error(
//         invoiceResponse?.message ||
//         "Online invoice creation failed"
//     );
// }

// const createdInvoice =
//     invoiceResponse.data;

// console.log(
//     "ONLINE INVOICE CREATED:",
//     createdInvoice
// );

// // ==========================================
// // SUCCESS
// // ==========================================

// toast.success(
//     "Payment successful and invoice generated!"
// );

// navigate(
//     "/order-success",
//     {
//         state: {
//             order,
//             payment: finalPayment,
//             invoice: createdInvoice,
//         },
//     }
// );
//                         }

//                         catch (error) {

//                             console.error(
//                                 "================================="
//                             );

//                             console.error(
//                                 "PAYMENT VERIFICATION ERROR:",
//                                 error
//                             );

//                             console.error(
//                                 "BACKEND RESPONSE:",
//                                 error?.response?.data
//                             );


//                             const backendData =
//                                 error?.response?.data;


//                             let message =
//                                 backendData?.message ||
//                                 error?.message ||
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
//                         order._id,

//                     orderSource:
//                         "ONLINE"

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
//                 "RAZORPAY OPTIONS:",
//                 options
//             );


//             // ==========================================
//             // 9. CREATE RAZORPAY INSTANCE
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
//                         "RAZORPAY PAYMENT FAILED:",
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
//                                         response?.error?.description ||
//                                         "Razorpay payment failed"

//                                 }

//                             );

//                         }

//                     }

//                     catch (error) {

//                         console.error(
//                             "FAILED PAYMENT UPDATE ERROR:",
//                             error
//                         );

//                     }

//                     finally {

//                         setLoading(false);

//                     }

//                 }
//             );


//             // ==========================================
//             // 10. OPEN RAZORPAY
//             // ==========================================

//             razorpay.open();

//         }

//         catch (error) {

//             console.error(
//                 "================================="
//             );

//             console.error(
//                 "PAYMENT ERROR:",
//                 error
//             );

//             console.error(
//                 "BACKEND RESPONSE:",
//                 error?.response?.data
//             );


//             const backendData =
//                 error?.response?.data;


//             let message =
//                 backendData?.message ||
//                 error?.message ||
//                 "Unable to start payment";


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
//                 "CANCEL PAYMENT ERROR:",
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

//                     {/* <p>

//                         <strong>
//                             Order ID :
//                         </strong>{" "}

//                         {order?._id || "-"}

//                     </p> */}


//                     <p>

//                         <strong>
//                             Receipt :
//                         </strong>{" "}

//                         {payment?.receiptNumber || "-"}

//                     </p>


//                     <p>

//                         <strong>
//                             Amount :
//                         </strong>{" "}

//                         ₹{" "}

//                         {Number(
//                             order?.totalAmount ??
//                             payment?.amount ??
//                             0
//                         ).toLocaleString("en-IN")}

//                     </p>


//                     <p>

//                         <strong>
//                             Payment Method :
//                         </strong>{" "}

//                         UPI

//                     </p>


//                     <p>

//                         <strong>
//                             Status :
//                         </strong>{" "}

//                         {payment?.paymentStatus ||
//                             "PENDING"}

//                     </p>

//                 </div>


//                 <button
//                     type="button"
//                     className="pay-btn"
//                     onClick={handlePayment}
//                     disabled={loading}
//                 >

//                     {loading
//                         ? "Processing..."
//                         : "Pay Now"}

//                 </button>


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



import React, {
    useEffect,
    useMemo,
    useState
} from "react";

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
        payment,
        paymentSummary
    } = location.state || {};


    const [loading, setLoading] = useState(false);

    const [razorpayLoaded, setRazorpayLoaded] =
        useState(false);


    // =====================================================
    // NUMBER HELPER
    // =====================================================

    const number = (
        value,
        fallback = 0
    ) => {

        const n = Number(value);

        return Number.isFinite(n)
            ? n
            : fallback;

    };


    // =====================================================
    // MONEY ROUNDING
    // =====================================================

    const roundMoney = (value) => {

        return Math.round(
            (Number(value) + Number.EPSILON) * 100
        ) / 100;

    };


    // =====================================================
    // PRODUCT SUBTOTAL
    // =====================================================

    const subtotal = useMemo(() => {

        const value =
            paymentSummary?.subtotal ??
            order?.subtotal ??
            order?.subTotal ??
            order?.itemsSubtotal ??
            order?.productSubtotal ??
            0;

        return Math.max(
            roundMoney(number(value)),
            0
        );

    }, [
        paymentSummary,
        order
    ]);


    // =====================================================
    // OFFER DISCOUNT
    // =====================================================

    const offerDiscount = useMemo(() => {

        const value =
            paymentSummary?.offerDiscount ??
            paymentSummary?.productDiscount ??
            paymentSummary?.discountFromOffers ??
            order?.offerDiscount ??
            order?.productDiscount ??
            order?.discountFromOffers ??
            0;

        return Math.max(
            roundMoney(number(value)),
            0
        );

    }, [
        paymentSummary,
        order
    ]);


    // =====================================================
    // COUPON DISCOUNT
    // =====================================================

    const couponDiscount = useMemo(() => {

        const value =
            paymentSummary?.couponDiscount ??
            paymentSummary?.couponDiscountAmount ??
            order?.couponDiscount ??
            order?.couponDiscountAmount ??
            0;

        return Math.max(
            roundMoney(number(value)),
            0
        );

    }, [
        paymentSummary,
        order
    ]);


    // =====================================================
    // TOTAL DISCOUNT
    // =====================================================

    const totalDiscount = useMemo(() => {

        return Math.min(
            roundMoney(
                offerDiscount +
                couponDiscount
            ),
            subtotal
        );

    }, [
        offerDiscount,
        couponDiscount,
        subtotal
    ]);


    // =====================================================
    // TAXABLE AMOUNT
    // =====================================================

    const taxableAmount = useMemo(() => {

        /*
         * Checkout se exact taxable amount aaye
         * to usko priority denge.
         */

        const checkoutTaxable =
            paymentSummary?.taxableAmount ??
            order?.taxableAmount;

        if (
            checkoutTaxable !== undefined &&
            checkoutTaxable !== null &&
            Number.isFinite(
                Number(checkoutTaxable)
            )
        ) {

            return Math.max(
                roundMoney(
                    number(checkoutTaxable)
                ),
                0
            );

        }


        /*
         * Fallback:
         *
         * Subtotal
         * - Offer Discount
         * - Coupon Discount
         */

        return Math.max(
            roundMoney(
                subtotal -
                totalDiscount
            ),
            0
        );

    }, [
        paymentSummary,
        order,
        subtotal,
        totalDiscount
    ]);


    // =====================================================
    // SHIPPING
    // =====================================================

    const shippingCharge = useMemo(() => {

        const value =
            paymentSummary?.shippingCharge ??
            paymentSummary?.shipping ??
            order?.shippingCharge ??
            order?.shippingCost ??
            order?.deliveryCharge ??
            0;

        return Math.max(
            roundMoney(number(value)),
            0
        );

    }, [
        paymentSummary,
        order
    ]);


    // =====================================================
    // GST %
    // =====================================================

    const gstPercentage = useMemo(() => {

        const value =
            paymentSummary?.gstPercentage ??
            order?.gstPercentage ??
            order?.gstRate ??
            18;

        return Math.max(
            number(value, 18),
            0
        );

    }, [
        paymentSummary,
        order
    ]);


    // =====================================================
    // GST AMOUNT
    // =====================================================

    const gstAmount = useMemo(() => {

        /*
         * Checkout ka exact GST priority hai.
         */

        const checkoutGST =
            paymentSummary?.gstAmount ??
            order?.gstAmount;

        if (
            checkoutGST !== undefined &&
            checkoutGST !== null &&
            Number.isFinite(
                Number(checkoutGST)
            )
        ) {

            return Math.max(
                roundMoney(
                    number(checkoutGST)
                ),
                0
            );

        }


        /*
         * Fallback GST calculation.
         */

        return Math.max(
            roundMoney(
                taxableAmount *
                gstPercentage /
                100
            ),
            0
        );

    }, [
        paymentSummary,
        order,
        taxableAmount,
        gstPercentage
    ]);


    // =====================================================
    // CALCULATED GRAND TOTAL
    //
    // THIS IS THE IMPORTANT VALUE
    //
    // Taxable
    // + Shipping
    // + GST
    // =====================================================

    const calculatedGrandTotal = useMemo(() => {

        return Math.max(
            roundMoney(
                taxableAmount +
                shippingCharge +
                gstAmount
            ),
            0
        );

    }, [
        taxableAmount,
        shippingCharge,
        gstAmount
    ]);


    // =====================================================
    // CHECKOUT FINAL TOTAL
    // =====================================================

    const checkoutFinalTotal = useMemo(() => {

        const value =
            paymentSummary?.total ??
            paymentSummary?.grandTotal ??
            paymentSummary?.finalAmount;

        if (
            value !== undefined &&
            value !== null &&
            Number.isFinite(Number(value))
        ) {

            return Math.max(
                roundMoney(number(value)),
                0
            );

        }

        return 0;

    }, [
        paymentSummary
    ]);


    // =====================================================
    // FINAL PAYABLE AMOUNT
    //
    // IMPORTANT:
    //
    // First use the exact checkout total.
    // If unavailable, calculate it.
    //
    // DO NOT USE PRODUCT SUBTOTAL HERE.
    // =====================================================

    const payableAmount = useMemo(() => {

        if (
            checkoutFinalTotal > 0
        ) {

            return checkoutFinalTotal;

        }


        return calculatedGrandTotal;

    }, [
        checkoutFinalTotal,
        calculatedGrandTotal
    ]);


    // =====================================================
    // PAYMENT BREAKDOWN VALIDATION
    // =====================================================

    const breakdownTotal = useMemo(() => {

        return roundMoney(
            taxableAmount +
            shippingCharge +
            gstAmount
        );

    }, [
        taxableAmount,
        shippingCharge,
        gstAmount
    ]);


    // =====================================================
    // LOAD RAZORPAY
    // =====================================================

    useEffect(() => {

        if (window.Razorpay) {

            setRazorpayLoaded(true);

            return;

        }


        const script =
            document.createElement("script");

        script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

        script.async = true;


        script.onload = () => {

            setRazorpayLoaded(true);

        };


        script.onerror = () => {

            setRazorpayLoaded(false);

            toast.error(
                "Unable to load Razorpay. Please refresh the page."
            );

        };


        document.body.appendChild(script);


        return () => {

            if (
                document.body.contains(script)
            ) {

                document.body.removeChild(script);

            }

        };

    }, []);


    // =====================================================
    // DEBUG
    // =====================================================

    useEffect(() => {

        console.log(
            "=========================================="
        );

        console.log(
            "PAYMENT PAGE FINAL CALCULATION"
        );

        console.log(
            "Product Subtotal:",
            subtotal
        );

        console.log(
            "Offer Discount:",
            offerDiscount
        );

        console.log(
            "Coupon Discount:",
            couponDiscount
        );

        console.log(
            "Total Discount:",
            totalDiscount
        );

        console.log(
            "Taxable Amount:",
            taxableAmount
        );

        console.log(
            "Shipping:",
            shippingCharge
        );

        console.log(
            "GST Percentage:",
            gstPercentage
        );

        console.log(
            "GST Amount:",
            gstAmount
        );

        console.log(
            "Calculated Grand Total:",
            calculatedGrandTotal
        );

        console.log(
            "Checkout Final Total:",
            checkoutFinalTotal
        );

        console.log(
            "FINAL PAYABLE AMOUNT:",
            payableAmount
        );

        console.log(
            "BREAKDOWN TOTAL:",
            breakdownTotal
        );

        console.log(
            "=========================================="
        );

    }, [
        subtotal,
        offerDiscount,
        couponDiscount,
        totalDiscount,
        taxableAmount,
        shippingCharge,
        gstPercentage,
        gstAmount,
        calculatedGrandTotal,
        checkoutFinalTotal,
        payableAmount,
        breakdownTotal
    ]);


    // =====================================================
    // NO ORDER
    // =====================================================

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
                    onClick={() =>
                        navigate("/cart")
                    }
                >
                    Go To Cart
                </button>

            </div>

        );

    }


    // =====================================================
    // HANDLE PAYMENT
    // =====================================================

    const handlePayment = async () => {

        if (loading) {
            return;
        }


        try {

            setLoading(true);


            // =================================================
            // FINAL AMOUNT
            // =================================================

            const finalAmount =
                roundMoney(
                    payableAmount
                );


            if (
                !Number.isFinite(finalAmount) ||
                finalAmount <= 0
            ) {

                throw new Error(
                    "Invalid final payment amount"
                );

            }


            // =================================================
            // IMPORTANT VALIDATION
            // =================================================

            const calculatedAmount =
                roundMoney(
                    taxableAmount +
                    shippingCharge +
                    gstAmount
                );


            /*
             * If checkout total exists and there is a small
             * rounding difference, use checkout's exact total.
             */

            if (
                checkoutFinalTotal > 0 &&
                Math.abs(
                    checkoutFinalTotal -
                    calculatedAmount
                ) > 1
            ) {

                console.warn(
                    "CHECKOUT TOTAL AND BREAKDOWN DIFFER",
                    {
                        checkoutFinalTotal,
                        calculatedAmount
                    }
                );

            }


            // =================================================
            // RAZORPAY KEY
            // =================================================

            const razorpayKey =
                import.meta.env.VITE_RAZORPAY_KEY_ID;


            if (!razorpayKey) {

                throw new Error(
                    "VITE_RAZORPAY_KEY_ID is missing in frontend .env"
                );

            }


            if (
                !window.Razorpay ||
                !razorpayLoaded
            ) {

                throw new Error(
                    "Razorpay SDK is not loaded. Please refresh the page."
                );

            }


            // =================================================
            // FINAL LOG
            // =================================================

            console.log(
                "=========================================="
            );

            console.log(
                "CREATING FINAL PAYMENT"
            );

            console.log(
                "Order ID:",
                order._id
            );

            console.log(
                "Product Subtotal:",
                subtotal
            );

            console.log(
                "Offer Discount:",
                offerDiscount
            );

            console.log(
                "Coupon Discount:",
                couponDiscount
            );

            console.log(
                "Taxable Amount:",
                taxableAmount
            );

            console.log(
                "Shipping:",
                shippingCharge
            );

            console.log(
                "GST:",
                gstAmount
            );

            console.log(
                "FINAL AMOUNT:",
                finalAmount
            );

            console.log(
                "=========================================="
            );


            // =================================================
            // CREATE DATABASE PAYMENT
            // =================================================

            const paymentResponse =
                await createPayment({

                    paymentFor:
                        "ORDER",

                    referenceId:
                        order._id,

                    amount:
                        finalAmount,

                    currency:
                        "INR",

                    paymentMethod:
                        "UPI"

                });


            console.log(
                "DATABASE PAYMENT RESPONSE:",
                paymentResponse
            );


            if (
                !paymentResponse?.success ||
                !paymentResponse?.payment
            ) {

                throw new Error(
                    paymentResponse?.message ||
                    "Payment creation failed"
                );

            }


            const createdPayment =
                paymentResponse.payment;


            // =================================================
            // CREATE RAZORPAY ORDER
            //
            // IMPORTANT:
            // finalAmount is explicitly sent.
            // =================================================

            const razorpayResponse =
                await createRazorpayOrder(
                    order._id,
                    finalAmount
                );


            console.log(
                "RAZORPAY RESPONSE:",
                razorpayResponse
            );


            if (
                !razorpayResponse?.success
            ) {

                throw new Error(
                    razorpayResponse?.message ||
                    "Unable to create Razorpay order"
                );

            }


            const razorpayOrder =
                razorpayResponse.order ||
                razorpayResponse.data;


            if (!razorpayOrder?.id) {

                throw new Error(
                    "Razorpay Order ID not received"
                );

            }


            // =================================================
            // RAZORPAY AMOUNT
            // =================================================

            const razorpayAmount =
                Number(
                    razorpayOrder.amount
                );


            const expectedPaise =
                Math.round(
                    finalAmount * 100
                );


            console.log(
                "EXPECTED RAZORPAY PAISE:",
                expectedPaise
            );

            console.log(
                "ACTUAL RAZORPAY PAISE:",
                razorpayAmount
            );


            // =================================================
            // HARD VALIDATION
            // =================================================

            if (
                razorpayAmount !==
                expectedPaise
            ) {

                throw new Error(
                    `Razorpay amount mismatch. Expected ₹${finalAmount.toFixed(
                        2
                    )}, but Razorpay received ₹${(
                        razorpayAmount / 100
                    ).toFixed(2)}`
                );

            }


            // =================================================
            // RAZORPAY OPTIONS
            // =================================================

            const options = {

                key:
                    razorpayKey,

                amount:
                    expectedPaise,

                currency:
                    razorpayOrder.currency ||
                    "INR",

                name:
                    "Zaid Infotech",

                description:
                    `Payment for Order #${order._id}`,

                order_id:
                    razorpayOrder.id,


                // =================================================
                // SUCCESS
                // =================================================

                handler:
                    async function (
                        response
                    ) {

                        try {

                            setLoading(true);


                            if (
                                !response?.razorpay_order_id ||
                                !response?.razorpay_payment_id ||
                                !response?.razorpay_signature
                            ) {

                                throw new Error(
                                    "Invalid Razorpay payment response"
                                );

                            }


                            // =========================================
                            // VERIFY PAYMENT
                            // =========================================

                            const verifyResponse =
                                await verifyRazorpayPayment({

                                    paymentId:
                                        createdPayment._id,

                                    razorpayOrderId:
                                        response.razorpay_order_id,

                                    razorpayPaymentId:
                                        response.razorpay_payment_id,

                                    razorpaySignature:
                                        response.razorpay_signature

                                });


                            console.log(
                                "VERIFY RESPONSE:",
                                verifyResponse
                            );


                            if (
                                !verifyResponse?.success
                            ) {

                                throw new Error(
                                    verifyResponse?.message ||
                                    "Payment verification failed"
                                );

                            }


                            const finalPayment =
                                verifyResponse.payment ||
                                createdPayment;


                            // =========================================
                            // CREATE INVOICE
                            // =========================================

                            const invoiceResponse =
                                await createInvoice(
                                    order._id
                                );


                            console.log(
                                "INVOICE RESPONSE:",
                                invoiceResponse
                            );


                            if (
                                !invoiceResponse?.success
                            ) {

                                throw new Error(
                                    invoiceResponse?.message ||
                                    "Invoice creation failed"
                                );

                            }


                            const createdInvoice =
                                invoiceResponse.data;


                            toast.success(
                                "Payment successful and invoice generated!"
                            );


                            // =========================================
                            // ORDER SUCCESS
                            // =========================================

                            navigate(
                                "/order-success",
                                {
                                    state: {

                                        order,

                                        payment:
                                            finalPayment,

                                        invoice:
                                            createdInvoice,

                                        paymentSummary: {

                                            subtotal:
                                                subtotal,

                                            offerDiscount:
                                                offerDiscount,

                                            couponDiscount:
                                                couponDiscount,

                                            taxableAmount:
                                                taxableAmount,

                                            shippingCharge:
                                                shippingCharge,

                                            gstPercentage:
                                                gstPercentage,

                                            gstAmount:
                                                gstAmount,

                                            total:
                                                finalAmount

                                        }

                                    }

                                }
                            );

                        }
                        catch (error) {

                            console.error(
                                "PAYMENT VERIFICATION ERROR:",
                                error
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
                                )
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


                // =================================================
                // MODAL
                // =================================================

                modal: {

                    ondismiss: () => {

                        setLoading(false);

                    }

                },


                // =================================================
                // PREFILL
                // =================================================

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


                // =================================================
                // NOTES
                // =================================================

                notes: {

                    orderId:
                        String(order._id),

                    orderSource:
                        "ONLINE",

                    subtotal:
                        String(subtotal),

                    offerDiscount:
                        String(offerDiscount),

                    couponDiscount:
                        String(couponDiscount),

                    taxableAmount:
                        String(taxableAmount),

                    shippingCharge:
                        String(shippingCharge),

                    gstPercentage:
                        String(gstPercentage),

                    gstAmount:
                        String(gstAmount),

                    totalAmount:
                        String(finalAmount)

                },


                theme: {

                    color:
                        "#2563eb"

                }

            };


            // =================================================
            // RAZORPAY
            // =================================================

            const razorpay =
                new window.Razorpay(
                    options
                );


            // =================================================
            // PAYMENT FAILED
            // =================================================

            razorpay.on(
                "payment.failed",
                async (
                    response
                ) => {

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


            // =================================================
            // OPEN RAZORPAY
            // =================================================

            razorpay.open();

        }
        catch (error) {

            console.error(
                "=========================================="
            );

            console.error(
                "PAYMENT ERROR:",
                error
            );

            console.error(
                "BACKEND ERROR:",
                error?.response?.data
            );


            toast.error(
                error?.response?.data?.message ||
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


            navigate("/cart");

        }
        catch (error) {

            console.error(
                "CANCEL PAYMENT ERROR:",
                error
            );

            navigate("/cart");

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // MONEY FORMAT
    // =====================================================

    const money = (
        value
    ) => {

        return Number(
            value || 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits:
                    2,

                maximumFractionDigits:
                    2
            }
        );

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


                {/* ==========================================
                    ORDER SUMMARY
                ========================================== */}

                <div className="payment-summary">

                    <h3>
                        Order Summary
                    </h3>


                    {/* PRODUCT SUBTOTAL */}

                    <div className="payment-summary-row">

                        <span>
                            Product Subtotal
                        </span>

                        <span>
                            ₹ {money(subtotal)}
                        </span>

                    </div>


                    {/* OFFER DISCOUNT */}

                    {offerDiscount > 0 && (

                        <div className="payment-summary-row">

                            <span>
                                Offer Discount
                            </span>

                            <span>
                                - ₹ {
                                    money(
                                        offerDiscount
                                    )
                                }
                            </span>

                        </div>

                    )}


                    {/* COUPON DISCOUNT */}

                    {couponDiscount > 0 && (

                        <div className="payment-summary-row">

                            <span>
                                Coupon Discount
                            </span>

                            <span>
                                - ₹ {
                                    money(
                                        couponDiscount
                                    )
                                }
                            </span>

                        </div>

                    )}


                    {/* TAXABLE */}

                    <div className="payment-summary-row">

                        <span>
                            Taxable Amount
                        </span>

                        <span>
                            ₹ {
                                money(
                                    taxableAmount
                                )
                            }
                        </span>

                    </div>


                    {/* SHIPPING */}

                    <div className="payment-summary-row">

                        <span>
                            Shipping
                        </span>

                        <span>

                            {
                                shippingCharge === 0
                                    ? "FREE"
                                    : `₹ ${money(
                                        shippingCharge
                                    )}`
                            }

                        </span>

                    </div>


                    {/* GST */}

                    <div className="payment-summary-row gst-row">

                        <span>
                            GST ({gstPercentage}%)
                        </span>

                        <span>
                            ₹ {
                                money(
                                    gstAmount
                                )
                            }
                        </span>

                    </div>


                    <hr />


                    {/* TOTAL PAYABLE */}

                    <div className="payment-summary-total">

                        <strong>
                            Total Payable
                        </strong>

                        <strong>
                            ₹ {
                                money(
                                    payableAmount
                                )
                            }
                        </strong>

                    </div>

                </div>


                {/* ==========================================
                    PAYMENT INFO
                ========================================== */}

                <div className="payment-info">

                    <p>
                        <strong>
                            Product Amount:
                        </strong>{" "}
                        ₹ {
                            money(
                                subtotal
                            )
                        }
                    </p>


                    {offerDiscount > 0 && (

                        <p>
                            <strong>
                                Offer:
                            </strong>{" "}
                            - ₹ {
                                money(
                                    offerDiscount
                                )
                            }
                        </p>

                    )}


                    {couponDiscount > 0 && (

                        <p>
                            <strong>
                                Coupon:
                            </strong>{" "}
                            - ₹ {
                                money(
                                    couponDiscount
                                )
                            }
                        </p>

                    )}


                    <p>
                        <strong>
                            Taxable:
                        </strong>{" "}
                        ₹ {
                            money(
                                taxableAmount
                            )
                        }
                    </p>


                    <p>
                        <strong>
                            Shipping:
                        </strong>{" "}

                        {
                            shippingCharge === 0
                                ? "FREE"
                                : `₹ ${money(
                                    shippingCharge
                                )}`
                        }

                    </p>


                    <p>
                        <strong>
                            GST:
                        </strong>{" "}
                        ₹ {
                            money(
                                gstAmount
                            )
                        }
                    </p>


                    <p>
                        <strong>
                            Final Payment:
                        </strong>{" "}
                        ₹ {
                            money(
                                payableAmount
                            )
                        }
                    </p>

                </div>


                {/* ==========================================
                    PAY BUTTON
                ========================================== */}

                <button
                    type="button"
                    className="pay-btn"
                    onClick={handlePayment}
                    disabled={
                        loading ||
                        payableAmount <= 0
                    }
                >

                    {
                        loading
                            ? "Processing..."
                            : `Pay ₹ ${money(
                                payableAmount
                            )}`
                    }

                </button>


                {/* ==========================================
                    CANCEL
                ========================================== */}

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

