// import axios from "axios";

// const API =
//     `${import.meta.env.VITE_API_URL}/payments`;


// // =====================================================
// // GET TOKEN
// // =====================================================

// const getToken = () => {

//     return localStorage.getItem("token");

// };


// // =====================================================
// // GET HEADERS
// // =====================================================

// const getHeaders = () => {

//     const token =
//         getToken();

//     return {

//         Authorization:
//             `Bearer ${token}`,

//         "Content-Type":
//             "application/json",

//     };

// };


// // =====================================================
// // CREATE DATABASE PAYMENT
// // =====================================================

// export const createPayment = async (data) => {

//     const res =
//         await axios.post(

//             API,

//             data,

//             {
//                 headers:
//                     getHeaders(),
//             }

//         );

//     return res.data;

// };


// // =====================================================
// // CREATE RAZORPAY ORDER
// // =====================================================

// export const createRazorpayOrder = async (
//     orderId
// ) => {

//     try {

//         // ==========================================
//         // VALIDATE ORDER ID
//         // ==========================================

//         if (!orderId) {

//             throw new Error(
//                 "Order ID is required"
//             );

//         }

//         console.log(
//             "CREATE RAZORPAY ORDER - ORDER ID =",
//             orderId
//         );


//         // ==========================================
//         // API REQUEST
//         // ==========================================

//         const response =
//             await axios.post(

//                 `${API}/razorpay/order`,

//                 {
//                     orderId:
//                         orderId
//                 },

//                 {
//                     headers:
//                         getHeaders(),
//                 }

//             );


//         console.log(
//             "CREATE RAZORPAY ORDER RESPONSE =",
//             response.data
//         );


//         return response.data;

//     }

//     catch (error) {

//         console.error(
//             "CREATE RAZORPAY ORDER ERROR =",
//             error.response?.data ||
//             error.message
//         );

//         throw error;

//     }

// };


// // =====================================================
// // VERIFY RAZORPAY PAYMENT
// // =====================================================

// export const verifyRazorpayPayment = async (
//     data
// ) => {

//     const res =
//         await axios.post(

//             `${API}/razorpay/verify`,

//             data,

//             {
//                 headers:
//                     getHeaders(),
//             }

//         );

//     return res.data;

// };


// // =====================================================
// // GET MY PAYMENTS
// // =====================================================

// export const getMyPayments = async () => {

//     const res =
//         await axios.get(

//             `${API}/my`,

//             {
//                 headers:
//                     getHeaders(),
//             }

//         );

//     return res.data;

// };


// // =====================================================
// // GET SINGLE PAYMENT
// // =====================================================

// export const getPayment = async (
//     id
// ) => {

//     const res =
//         await axios.get(

//             `${API}/${id}`,

//             {
//                 headers:
//                     getHeaders(),
//             }

//         );

//     return res.data;

// };


// // =====================================================
// // PAYMENT SUCCESS
// // =====================================================

// export const paymentSuccess = async (
//     id,
//     data
// ) => {

//     const res =
//         await axios.patch(

//             `${API}/${id}/success`,

//             data,

//             {
//                 headers:
//                     getHeaders(),
//             }

//         );

//     return res.data;

// };


// // =====================================================
// // PAYMENT FAILED
// // =====================================================

// export const paymentFailed = async (
//     id,
//     data
// ) => {

//     const res =
//         await axios.patch(

//             `${API}/${id}/failed`,

//             data,

//             {
//                 headers:
//                     getHeaders(),
//             }

//         );

//     return res.data;

// };



import axios from "axios";

const API =
    `${import.meta.env.VITE_API_URL}/payments`;


// =====================================================
// GET TOKEN
// =====================================================

const getToken = () => {

    return (
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        ""
    );

};


// =====================================================
// GET HEADERS
// =====================================================

const getHeaders = () => {

    const token =
        getToken();

    return {

        ...(token
            ? {
                Authorization:
                    `Bearer ${token}`,
            }
            : {}),

        "Content-Type":
            "application/json",

    };

};


// =====================================================
// CREATE DATABASE PAYMENT
// =====================================================

export const createPayment = async (data) => {

    try {

        if (!data) {

            throw new Error(
                "Payment data is required"
            );

        }

        console.log(
            "================================"
        );

        console.log(
            "CREATE PAYMENT REQUEST"
        );

        console.log(
            "PAYLOAD:",
            data
        );

        console.log(
            "================================"
        );

        const res =
            await axios.post(

                API,

                data,

                {
                    headers:
                        getHeaders(),
                }

            );

        console.log(
            "CREATE PAYMENT RESPONSE:",
            res.data
        );

        return res.data;

    } catch (error) {

        console.error(
            "CREATE PAYMENT ERROR:",
            error?.response?.data ||
            error?.message
        );

        throw (
            error?.response?.data || {
                success: false,
                message:
                    error?.message ||
                    "Payment creation failed",
            }
        );

    }

};


// =====================================================
// CREATE RENTAL SECURITY DEPOSIT PAYMENT
// =====================================================

export const createRentalDepositPayment = async ({
    rentalId,
    amount,
    paymentMethod = "CASH",
}) => {

    try {

        if (!rentalId) {

            throw new Error(
                "Rental ID is required"
            );

        }

        if (
            amount === undefined ||
            amount === null ||
            Number(amount) <= 0
        ) {

            throw new Error(
                "Valid deposit amount is required"
            );

        }

        /*
         * IMPORTANT
         *
         * paymentFor ki exact value tumhare backend
         * PAYMENT_FOR constant par depend karti hai.
         *
         * Agar tumhare PAYMENT_FOR mein RENTAL hai:
         *
         * paymentFor: "RENTAL"
         *
         * Agar tumhare constant mein RENTALS hai,
         * to wahi exact value use karna.
         */

        const paymentData = {

            paymentFor: "RENTAL",

            paymentType:
                "SECURITY_DEPOSIT",

            referenceId:
                rentalId,

            amount:
                Number(amount),

            currency:
                "INR",

            paymentMethod:
                paymentMethod,

            paymentStatus:
                "SUCCESS",

            paymentDate:
                new Date(),

            paidAt:
                new Date(),

        };


        console.log(
            "================================"
        );

        console.log(
            "CREATE RENTAL DEPOSIT PAYMENT"
        );

        console.log(
            "RENTAL ID:",
            rentalId
        );

        console.log(
            "AMOUNT:",
            amount
        );

        console.log(
            "PAYMENT METHOD:",
            paymentMethod
        );

        console.log(
            "PAYMENT DATA:",
            paymentData
        );

        console.log(
            "================================"
        );


        const response =
            await createPayment(
                paymentData
            );


        console.log(
            "RENTAL DEPOSIT PAYMENT RESPONSE:",
            response
        );


        return response;

    } catch (error) {

        console.error(
            "RENTAL DEPOSIT PAYMENT ERROR:",
            error?.response?.data ||
            error
        );

        throw (
            error?.response?.data || {
                success: false,
                message:
                    error?.message ||
                    "Rental deposit payment failed",
            }
        );

    }

};


// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================

export const createRazorpayOrder = async (
    orderId
) => {

    try {

        if (!orderId) {

            throw new Error(
                "Order ID is required"
            );

        }

        console.log(
            "CREATE RAZORPAY ORDER - ORDER ID =",
            orderId
        );


        const response =
            await axios.post(

                `${API}/razorpay/order`,

                {
                    orderId:
                        orderId
                },

                {
                    headers:
                        getHeaders(),
                }

            );


        console.log(
            "CREATE RAZORPAY ORDER RESPONSE =",
            response.data
        );


        return response.data;

    }

    catch (error) {

        console.error(
            "CREATE RAZORPAY ORDER ERROR =",
            error?.response?.data ||
            error?.message
        );

        throw (
            error?.response?.data || {
                success: false,
                message:
                    error?.message ||
                    "Unable to create Razorpay order",
            }
        );

    }

};


// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

export const verifyRazorpayPayment = async (
    data
) => {

    try {

        const res =
            await axios.post(

                `${API}/razorpay/verify`,

                data,

                {
                    headers:
                        getHeaders(),
                }

            );

        return res.data;

    } catch (error) {

        console.error(
            "VERIFY RAZORPAY PAYMENT ERROR:",
            error?.response?.data ||
            error?.message
        );

        throw (
            error?.response?.data || {
                success: false,
                message:
                    error?.message ||
                    "Razorpay verification failed",
            }
        );

    }

};


// =====================================================
// GET MY PAYMENTS
// =====================================================

export const getMyPayments = async () => {

    try {

        const res =
            await axios.get(

                `${API}/my`,

                {
                    headers:
                        getHeaders(),
                }

            );

        return res.data;

    } catch (error) {

        throw (
            error?.response?.data || {
                success: false,
                message:
                    error?.message ||
                    "Failed to load payments",
            }
        );

    }

};


// =====================================================
// GET SINGLE PAYMENT
// =====================================================

export const getPayment = async (
    id
) => {

    try {

        if (!id) {

            throw new Error(
                "Payment ID is required"
            );

        }

        const res =
            await axios.get(

                `${API}/${id}`,

                {
                    headers:
                        getHeaders(),
                }

            );

        return res.data;

    } catch (error) {

        throw (
            error?.response?.data || {
                success: false,
                message:
                    error?.message ||
                    "Failed to load payment",
            }
        );

    }

};


// =====================================================
// GET PAYMENTS FOR RENTAL
// =====================================================

export const getRentalPayments = async (
    rentalId
) => {

    try {

        if (!rentalId) {

            throw new Error(
                "Rental ID is required"
            );

        }

        /*
         * Existing backend getPaymentByReference()
         * service exists, but current controller/router
         * does not expose a dedicated rental-reference route.
         *
         * Therefore we intentionally do NOT invent
         * an endpoint here.
         *
         * This function is kept for future backend route:
         *
         * GET /payments/reference/RENTAL/:rentalId
         */

        throw new Error(
            "Rental payment reference API is not available in the current backend routes"
        );

    } catch (error) {

        console.error(
            "GET RENTAL PAYMENTS ERROR:",
            error
        );

        throw (
            error?.response?.data || {
                success: false,
                message:
                    error?.message ||
                    "Failed to load rental payments",
            }
        );

    }

};


// =====================================================
// PAYMENT SUCCESS
// =====================================================

export const paymentSuccess = async (
    id,
    data
) => {

    const res =
        await axios.patch(

            `${API}/${id}/success`,

            data,

            {
                headers:
                    getHeaders(),
            }

        );

    return res.data;

};


// =====================================================
// PAYMENT FAILED
// =====================================================

export const paymentFailed = async (
    id,
    data
) => {

    const res =
        await axios.patch(

            `${API}/${id}/failed`,

            data,

            {
                headers:
                    getHeaders(),
            }

        );

    return res.data;

};


// =====================================================
// REFUND PAYMENT
// =====================================================

export const refundPayment = async (
    id,
    data
) => {

    try {

        const res =
            await axios.patch(

                `${API}/${id}/refund`,

                data,

                {
                    headers:
                        getHeaders(),
                }

            );

        return res.data;

    } catch (error) {

        throw (
            error?.response?.data || {
                success: false,
                message:
                    error?.message ||
                    "Refund failed",
            }
        );

    }

};


// =====================================================
// DEFAULT EXPORT
// =====================================================

const paymentApi = {

    createPayment,

    createRentalDepositPayment,

    createRazorpayOrder,

    verifyRazorpayPayment,

    getMyPayments,

    getPayment,

    getRentalPayments,

    paymentSuccess,

    paymentFailed,

    refundPayment,

};

export default paymentApi;

