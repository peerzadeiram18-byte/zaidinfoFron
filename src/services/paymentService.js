// import axios from "axios";

// const API = `${import.meta.env.VITE_API_URL}/payments`;

// // ============================================
// // GET TOKEN
// // ============================================

// const getToken = () => {

//     return localStorage.getItem("token");

// };


// // ============================================
// // GET CONFIG
// // ============================================

// const getConfig = () => {

//     return {

//         headers: {

//             Authorization:
//                 `Bearer ${getToken()}`

//         }

//     };

// };


// // ============================================
// // CREATE PAYMENT
// // ============================================

// export const createPayment = async (data) => {

//     const res = await axios.post(

//         API,

//         data,

//         getConfig()

//     );

//     return res.data;

// };



// // =======================================
// // CREATE RAZORPAY ORDER
// // =======================================

// export const createRazorpayOrder = async (orderId) => {

//     const res = await axios.post(
//         `${API}/razorpay/create-order`,
//         {
//             orderId
//         },
//         {
//             headers: getHeaders()
//         }
//     );

//     return res.data;
// };

// // =======================================
// // VERIFY RAZORPAY PAYMENT
// // =======================================

// export const verifyRazorpayPayment = async (data) => {

//     const res = await axios.post(
//         `${API}/razorpay/verify`,
//         data,
//         {
//             headers: getHeaders()
//         }
//     );

//     return res.data;
// };

// // ============================================
// // GET MY PAYMENTS
// // ============================================

// export const getMyPayments = async () => {

//     const res = await axios.get(

//         `${API}/my`,

//         getConfig()

//     );

//     return res.data;

// };


// // ============================================
// // GET SINGLE PAYMENT
// // ============================================

// export const getPayment = async (id) => {

//     const res = await axios.get(

//         `${API}/${id}`,

//         getConfig()

//     );

//     return res.data;

// };


// // ============================================
// // PAYMENT SUCCESS
// // ============================================

// export const paymentSuccess = async (
//     id,
//     data
// ) => {

//     const res = await axios.patch(

//         `${API}/${id}/success`,

//         data,

//         getConfig()

//     );

//     return res.data;

// };


// // ============================================
// // PAYMENT FAILED
// // ============================================

// export const paymentFailed = async (
//     id,
//     data
// ) => {

//     const res = await axios.patch(

//         `${API}/${id}/failed`,

//         data,

//         getConfig()

//     );

//     return res.data;

// };
import axios from "axios";

const API =
    `${import.meta.env.VITE_API_URL}/payments`;


// =====================================================
// GET TOKEN
// =====================================================

const getToken = () => {

    return localStorage.getItem("token");

};


// =====================================================
// GET HEADERS
// =====================================================

const getHeaders = () => {

    const token =
        getToken();

    return {

        Authorization:
            `Bearer ${token}`,

        "Content-Type":
            "application/json",

    };

};


// =====================================================
// CREATE DATABASE PAYMENT
// =====================================================

export const createPayment = async (data) => {

    const res =
        await axios.post(

            API,

            data,

            {
                headers:
                    getHeaders(),
            }

        );

    return res.data;

};


// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================

export const createRazorpayOrder = async (
    orderId
) => {

    try {

        // ==========================================
        // VALIDATE ORDER ID
        // ==========================================

        if (!orderId) {

            throw new Error(
                "Order ID is required"
            );

        }

        console.log(
            "CREATE RAZORPAY ORDER - ORDER ID =",
            orderId
        );


        // ==========================================
        // API REQUEST
        // ==========================================

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
            error.response?.data ||
            error.message
        );

        throw error;

    }

};


// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

export const verifyRazorpayPayment = async (
    data
) => {

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

};


// =====================================================
// GET MY PAYMENTS
// =====================================================

export const getMyPayments = async () => {

    const res =
        await axios.get(

            `${API}/my`,

            {
                headers:
                    getHeaders(),
            }

        );

    return res.data;

};


// =====================================================
// GET SINGLE PAYMENT
// =====================================================

export const getPayment = async (
    id
) => {

    const res =
        await axios.get(

            `${API}/${id}`,

            {
                headers:
                    getHeaders(),
            }

        );

    return res.data;

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