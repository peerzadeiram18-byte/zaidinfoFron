// import axios from "axios";

// const API =
//     `${import.meta.env.VITE_API_URL}/payments`;


// // =====================================================
// // GET TOKEN
// // =====================================================

// const getToken = () => {

//     return (
//         localStorage.getItem("token") ||
//         localStorage.getItem("accessToken") ||
//         ""
//     );

// };


// // =====================================================
// // GET HEADERS
// // =====================================================

// const getHeaders = () => {

//     const token =
//         getToken();

//     return {

//         ...(token
//             ? {
//                 Authorization:
//                     `Bearer ${token}`,
//             }
//             : {}),

//         "Content-Type":
//             "application/json",

//     };

// };


// // =====================================================
// // CREATE DATABASE PAYMENT
// // =====================================================

// export const createPayment = async (paymentData) => {

//     try {

//         // =================================================
//         // VALIDATION
//         // =================================================

//         if (!paymentData) {

//             throw new Error(
//                 "Payment data is required"
//             );

//         }


//         if (!paymentData.paymentFor) {

//             throw new Error(
//                 "Payment For is required"
//             );

//         }


//         if (!paymentData.referenceId) {

//             throw new Error(
//                 "Reference ID is required"
//             );

//         }


//         if (
//             paymentData.amount === undefined ||
//             paymentData.amount === null ||
//             !Number.isFinite(
//                 Number(paymentData.amount)
//             ) ||
//             Number(paymentData.amount) <= 0
//         ) {

//             throw new Error(
//                 "Valid payment amount is required"
//             );

//         }


//         if (!paymentData.paymentMethod) {

//             throw new Error(
//                 "Payment method is required"
//             );

//         }


//         // =================================================
//         // CLEAN PAYMENT DATA
//         // =================================================

//         const cleanPaymentData = {

//             ...paymentData,

//             amount:
//                 Math.round(
//                     Number(paymentData.amount) * 100
//                 ) / 100,

//             currency:
//                 paymentData.currency || "INR"

//         };


//         // =================================================
//         // DEBUG
//         // =================================================

//         console.log(
//             "================================"
//         );

//         console.log(
//             "CREATE PAYMENT REQUEST"
//         );

//         console.log(
//             "PAYMENT API:",
//             API
//         );

//         console.log(
//             "PAYLOAD:",
//             cleanPaymentData
//         );

//         console.log(
//             "HEADERS:",
//             {
//                 hasToken: Boolean(getToken())
//             }
//         );

//         console.log(
//             "================================"
//         );


//         // =================================================
//         // CREATE PAYMENT
//         // =================================================

//         const response =
//             await axios.post(

//                 API,

//                 cleanPaymentData,

//                 {
//                     headers:
//                         getHeaders()
//                 }

//             );


//         // =================================================
//         // RESPONSE
//         // =================================================

//         console.log(
//             "================================"
//         );

//         console.log(
//             "CREATE PAYMENT RESPONSE"
//         );

//         console.log(
//             response.data
//         );

//         console.log(
//             "================================"
//         );


//         if (!response?.data) {

//             throw new Error(
//                 "Empty payment response from server"
//             );

//         }


//         if (
//             response.data.success === false
//         ) {

//             throw new Error(
//                 response.data.message ||
//                 "Payment creation failed"
//             );

//         }


//         return response.data;

//     }

//     catch (error) {

//         console.error(
//             "================================"
//         );

//         console.error(
//             "CREATE PAYMENT ERROR"
//         );

//         console.error(
//             "STATUS:",
//             error?.response?.status
//         );

//         console.error(
//             "BACKEND RESPONSE:",
//             error?.response?.data
//         );

//         console.error(
//             "BACKEND MESSAGE:",
//             error?.response?.data?.message
//         );

//         console.error(
//             "BACKEND ERRORS:",
//             error?.response?.data?.errors
//         );

//         console.error(
//             "AXIOS MESSAGE:",
//             error?.message
//         );

//         console.error(
//             "================================"
//         );


//         if (
//             error?.response?.data
//         ) {

//             throw error.response.data;

//         }


//         throw {

//             success: false,

//             message:
//                 error?.message ||
//                 "Unable to create payment"

//         };

//     }

// };


// // =====================================================
// // CREATE RENTAL SECURITY DEPOSIT PAYMENT
// // =====================================================

// export const createRentalDepositPayment = async ({
//     rentalId,
//     amount,
//     paymentMethod = "CASH",
// }) => {

//     try {

//         if (!rentalId) {

//             throw new Error(
//                 "Rental ID is required"
//             );

//         }


//         if (
//             amount === undefined ||
//             amount === null ||
//             Number(amount) <= 0
//         ) {

//             throw new Error(
//                 "Valid deposit amount is required"
//             );

//         }


//         const paymentData = {

//             paymentFor:
//                 "RENTAL",

//             paymentType:
//                 "SECURITY_DEPOSIT",

//             referenceId:
//                 rentalId,

//             amount:
//                 Number(amount),

//             currency:
//                 "INR",

//             paymentMethod:
//                 paymentMethod,

//             paymentStatus:
//                 "SUCCESS",

//             paymentDate:
//                 new Date(),

//             paidAt:
//                 new Date(),

//         };


//         console.log(
//             "================================"
//         );

//         console.log(
//             "CREATE RENTAL DEPOSIT PAYMENT"
//         );

//         console.log(
//             "PAYMENT DATA:",
//             paymentData
//         );

//         console.log(
//             "================================"
//         );


//         const response =
//             await createPayment(
//                 paymentData
//             );


//         return response;

//     }

//     catch (error) {

//         console.error(
//             "RENTAL DEPOSIT PAYMENT ERROR:",
//             error
//         );


//         throw (
//             error?.response?.data || {

//                 success: false,

//                 message:
//                     error?.message ||
//                     "Rental deposit payment failed",

//             }
//         );

//     }

// };


// // =====================================================
// // CREATE RAZORPAY ORDER
// // =====================================================

// export const createRazorpayOrder = async (
//     orderId,
//     finalAmount
// ) => {

//     try {

//         if (!orderId) {

//             throw new Error(
//                 "Order ID is required"
//             );

//         }


//         if (
//             finalAmount === undefined ||
//             finalAmount === null
//         ) {

//             throw new Error(
//                 "Final payment amount is required"
//             );

//         }


//         const amount =
//             Number(finalAmount);


//         if (
//             !Number.isFinite(amount) ||
//             amount <= 0
//         ) {

//             throw new Error(
//                 "Invalid final payment amount"
//             );

//         }


//         const cleanAmount =
//             Math.round(
//                 amount * 100
//             ) / 100;


//         console.log(
//             "=========================================="
//         );

//         console.log(
//             "CREATE RAZORPAY ORDER"
//         );

//         console.log(
//             "ORDER ID:",
//             orderId
//         );

//         console.log(
//             "FINAL PAYMENT AMOUNT:",
//             cleanAmount
//         );

//         console.log(
//             "FINAL PAYMENT PAISE:",
//             Math.round(
//                 cleanAmount * 100
//             )
//         );

//         console.log(
//             "=========================================="
//         );


//         const response =
//             await axios.post(

//                 `${API}/razorpay/order`,

//                 {

//                     orderId:
//                         orderId,

//                     amount:
//                         cleanAmount,

//                     finalAmount:
//                         cleanAmount,

//                 },

//                 {

//                     headers:
//                         getHeaders(),

//                 }

//             );


//         console.log(
//             "CREATE RAZORPAY ORDER RESPONSE:",
//             response.data
//         );


//         if (
//             !response?.data
//         ) {

//             throw new Error(
//                 "Empty Razorpay order response"
//             );

//         }


//         if (
//             response.data.success === false
//         ) {

//             throw new Error(
//                 response.data.message ||
//                 "Unable to create Razorpay order"
//             );

//         }


//         return response.data;

//     }

//     catch (error) {

//         console.error(
//             "CREATE RAZORPAY ORDER ERROR:",
//             error?.response?.data ||
//             error?.message
//         );


//         throw (
//             error?.response?.data || {

//                 success: false,

//                 message:
//                     error?.message ||
//                     "Unable to create Razorpay order",

//             }
//         );

//     }

// };


// // =====================================================
// // VERIFY RAZORPAY PAYMENT
// // =====================================================

// export const verifyRazorpayPayment = async (
//     data
// ) => {

//     try {

//         if (!data) {

//             throw new Error(
//                 "Razorpay verification data is required"
//             );

//         }


//         const res =
//             await axios.post(

//                 `${API}/razorpay/verify`,

//                 data,

//                 {
//                     headers:
//                         getHeaders(),
//                 }

//             );


//         return res.data;

//     }

//     catch (error) {

//         console.error(
//             "VERIFY RAZORPAY PAYMENT ERROR:",
//             error?.response?.data ||
//             error?.message
//         );


//         throw (
//             error?.response?.data || {

//                 success: false,

//                 message:
//                     error?.message ||
//                     "Razorpay verification failed",

//             }
//         );

//     }

// };


// // =====================================================
// // GET MY PAYMENTS
// // =====================================================

// export const getMyPayments = async () => {

//     try {

//         const res =
//             await axios.get(

//                 `${API}/my`,

//                 {
//                     headers:
//                         getHeaders(),
//                 }

//             );


//         return res.data;

//     }

//     catch (error) {

//         throw (
//             error?.response?.data || {

//                 success: false,

//                 message:
//                     error?.message ||
//                     "Failed to load payments",

//             }
//         );

//     }

// };


// // =====================================================
// // GET SINGLE PAYMENT
// // =====================================================

// export const getPayment = async (
//     id
// ) => {

//     try {

//         if (!id) {

//             throw new Error(
//                 "Payment ID is required"
//             );

//         }


//         const res =
//             await axios.get(

//                 `${API}/${id}`,

//                 {
//                     headers:
//                         getHeaders(),
//                 }

//             );


//         return res.data;

//     }

//     catch (error) {

//         throw (
//             error?.response?.data || {

//                 success: false,

//                 message:
//                     error?.message ||
//                     "Failed to load payment",

//             }
//         );

//     }

// };


// // =====================================================
// // GET PAYMENTS FOR RENTAL
// // =====================================================

// export const getRentalPayments = async (
//     rentalId
// ) => {

//     try {

//         if (!rentalId) {

//             throw new Error(
//                 "Rental ID is required"
//             );

//         }


//         throw new Error(
//             "Rental payment reference API is not available in the current backend routes"
//         );

//     }

//     catch (error) {

//         console.error(
//             "GET RENTAL PAYMENTS ERROR:",
//             error
//         );


//         throw {

//             success: false,

//             message:
//                 error?.message ||
//                 "Failed to load rental payments",

//         };

//     }

// };


// // =====================================================
// // PAYMENT SUCCESS
// // =====================================================

// export const paymentSuccess = async (
//     id,
//     data
// ) => {

//     try {

//         if (!id) {

//             throw new Error(
//                 "Payment ID is required"
//             );

//         }


//         const res =
//             await axios.patch(

//                 `${API}/${id}/success`,

//                 data,

//                 {
//                     headers:
//                         getHeaders(),
//                 }

//             );


//         return res.data;

//     }

//     catch (error) {

//         throw (
//             error?.response?.data || {

//                 success: false,

//                 message:
//                     error?.message ||
//                     "Payment success update failed",

//             }
//         );

//     }

// };


// // =====================================================
// // PAYMENT FAILED
// // =====================================================

// export const paymentFailed = async (
//     id,
//     data
// ) => {

//     try {

//         if (!id) {

//             throw new Error(
//                 "Payment ID is required"
//             );

//         }


//         const res =
//             await axios.patch(

//                 `${API}/${id}/failed`,

//                 data,

//                 {
//                     headers:
//                         getHeaders(),
//                 }

//             );


//         return res.data;

//     }

//     catch (error) {

//         throw (
//             error?.response?.data || {

//                 success: false,

//                 message:
//                     error?.message ||
//                     "Payment failed update failed",

//             }
//         );

//     }

// };


// // =====================================================
// // REFUND PAYMENT
// // =====================================================

// export const refundPayment = async (
//     id,
//     data
// ) => {

//     try {

//         if (!id) {

//             throw new Error(
//                 "Payment ID is required"
//             );

//         }


//         const res =
//             await axios.patch(

//                 `${API}/${id}/refund`,

//                 data,

//                 {
//                     headers:
//                         getHeaders(),
//                 }

//             );


//         return res.data;

//     }

//     catch (error) {

//         throw (
//             error?.response?.data || {

//                 success: false,

//                 message:
//                     error?.message ||
//                     "Refund failed",

//             }
//         );

//     }

// };


// // =====================================================
// // DEFAULT EXPORT
// // =====================================================

// const paymentApi = {

//     createPayment,

//     createRentalDepositPayment,

//     createRazorpayOrder,

//     verifyRazorpayPayment,

//     getMyPayments,

//     getPayment,

//     getRentalPayments,

//     paymentSuccess,

//     paymentFailed,

//     refundPayment,

// };


// export default paymentApi;



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
// (unchanged)
// =====================================================

export const createPayment = async (paymentData) => {

    try {

        // =================================================
        // VALIDATION
        // =================================================

        if (!paymentData) {

            throw new Error(
                "Payment data is required"
            );

        }


        if (!paymentData.paymentFor) {

            throw new Error(
                "Payment For is required"
            );

        }


        if (!paymentData.referenceId) {

            throw new Error(
                "Reference ID is required"
            );

        }


        if (
            paymentData.amount === undefined ||
            paymentData.amount === null ||
            !Number.isFinite(
                Number(paymentData.amount)
            ) ||
            Number(paymentData.amount) <= 0
        ) {

            throw new Error(
                "Valid payment amount is required"
            );

        }


        if (!paymentData.paymentMethod) {

            throw new Error(
                "Payment method is required"
            );

        }


        // =================================================
        // CLEAN PAYMENT DATA
        // =================================================

        const cleanPaymentData = {

            ...paymentData,

            amount:
                Math.round(
                    Number(paymentData.amount) * 100
                ) / 100,

            currency:
                paymentData.currency || "INR"

        };


        // =================================================
        // DEBUG
        // =================================================

        console.log(
            "================================"
        );

        console.log(
            "CREATE PAYMENT REQUEST"
        );

        console.log(
            "PAYMENT API:",
            API
        );

        console.log(
            "PAYLOAD:",
            cleanPaymentData
        );

        console.log(
            "HEADERS:",
            {
                hasToken: Boolean(getToken())
            }
        );

        console.log(
            "================================"
        );


        // =================================================
        // CREATE PAYMENT
        // =================================================

        const response =
            await axios.post(

                API,

                cleanPaymentData,

                {
                    headers:
                        getHeaders()
                }

            );


        // =================================================
        // RESPONSE
        // =================================================

        console.log(
            "================================"
        );

        console.log(
            "CREATE PAYMENT RESPONSE"
        );

        console.log(
            response.data
        );

        console.log(
            "================================"
        );


        if (!response?.data) {

            throw new Error(
                "Empty payment response from server"
            );

        }


        if (
            response.data.success === false
        ) {

            throw new Error(
                response.data.message ||
                "Payment creation failed"
            );

        }


        return response.data;

    }

    catch (error) {

        console.error(
            "================================"
        );

        console.error(
            "CREATE PAYMENT ERROR"
        );

        console.error(
            "STATUS:",
            error?.response?.status
        );

        console.error(
            "BACKEND RESPONSE:",
            error?.response?.data
        );

        console.error(
            "BACKEND MESSAGE:",
            error?.response?.data?.message
        );

        console.error(
            "BACKEND ERRORS:",
            error?.response?.data?.errors
        );

        console.error(
            "AXIOS MESSAGE:",
            error?.message
        );

        console.error(
            "================================"
        );


        if (
            error?.response?.data
        ) {

            throw error.response.data;

        }


        throw {

            success: false,

            message:
                error?.message ||
                "Unable to create payment"

        };

    }

};


// =====================================================
// CREATE RENTAL SECURITY DEPOSIT PAYMENT
// (unchanged)
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


        const paymentData = {

            paymentFor:
                "RENTAL",

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


        return response;

    }

    catch (error) {

        console.error(
            "RENTAL DEPOSIT PAYMENT ERROR:",
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
// CHANGE: REPLACED FUNCTION
// CREATE RAZORPAY ORDER
//
// Before: took (orderId, finalAmount) and sent
// orderId, amount and finalAmount to the backend.
//
// Now: takes only orderId and sends only orderId.
// The backend reads the amount from the order in
// the database, so the browser can't change it.
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
            "=========================================="
        );

        console.log(
            "CREATE RAZORPAY ORDER"
        );

        console.log(
            "ORDER ID:",
            orderId
        );

        console.log(
            "=========================================="
        );


        // CHANGE: only orderId is sent
        const response =
            await axios.post(

                `${API}/razorpay/order`,

                {

                    orderId:
                        orderId,

                },

                {

                    headers:
                        getHeaders(),

                }

            );


        console.log(
            "CREATE RAZORPAY ORDER RESPONSE:",
            response.data
        );


        if (
            !response?.data
        ) {

            throw new Error(
                "Empty Razorpay order response"
            );

        }


        if (
            response.data.success === false
        ) {

            throw new Error(
                response.data.message ||
                "Unable to create Razorpay order"
            );

        }


        return response.data;

    }

    catch (error) {

        console.error(
            "CREATE RAZORPAY ORDER ERROR:",
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
// CHANGE: REPLACED FUNCTION
// VERIFY RAZORPAY PAYMENT
//
// Before: sent whatever object it was given
// (including paymentId).
//
// Now: sends only the 3 Razorpay values, even if
// the caller passes extra fields.
// =====================================================

export const verifyRazorpayPayment = async ({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
}) => {

    try {

        if (
            !razorpayOrderId ||
            !razorpayPaymentId ||
            !razorpaySignature
        ) {

            throw new Error(
                "Razorpay order id, payment id and signature are required"
            );

        }


        // CHANGE: only the 3 Razorpay values are sent
        const res =
            await axios.post(

                `${API}/razorpay/verify`,

                {

                    razorpayOrderId,

                    razorpayPaymentId,

                    razorpaySignature

                },

                {
                    headers:
                        getHeaders(),
                }

            );


        return res.data;

    }

    catch (error) {

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
// (unchanged)
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

    }

    catch (error) {

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
// (unchanged)
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

    }

    catch (error) {

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
// (unchanged)
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


        throw new Error(
            "Rental payment reference API is not available in the current backend routes"
        );

    }

    catch (error) {

        console.error(
            "GET RENTAL PAYMENTS ERROR:",
            error
        );


        throw {

            success: false,

            message:
                error?.message ||
                "Failed to load rental payments",

        };

    }

};


// =====================================================
// PAYMENT SUCCESS
// (unchanged; locking the backend route is tomorrow's task)
// =====================================================

export const paymentSuccess = async (
    id,
    data
) => {

    try {

        if (!id) {

            throw new Error(
                "Payment ID is required"
            );

        }


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

    }

    catch (error) {

        throw (
            error?.response?.data || {

                success: false,

                message:
                    error?.message ||
                    "Payment success update failed",

            }
        );

    }

};


// =====================================================
// PAYMENT FAILED
// (unchanged)
// =====================================================

export const paymentFailed = async (
    id,
    data
) => {

    try {

        if (!id) {

            throw new Error(
                "Payment ID is required"
            );

        }


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

    }

    catch (error) {

        throw (
            error?.response?.data || {

                success: false,

                message:
                    error?.message ||
                    "Payment failed update failed",

            }
        );

    }

};


// =====================================================
// REFUND PAYMENT
// (unchanged)
// =====================================================

export const refundPayment = async (
    id,
    data
) => {

    try {

        if (!id) {

            throw new Error(
                "Payment ID is required"
            );

        }


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

    }

    catch (error) {

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