import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL;


// ======================================================
// CREATE COUPON
// ======================================================

export const createCoupon = async (
    couponData
) => {

    const token =
        localStorage.getItem("token");


    const response =
        await axios.post(

            `${API_URL}/coupons`,

            couponData,

            {
                headers: {

                    Authorization:
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"

                }

            }

        );


    return response.data;

};


// ======================================================
// GET ALL COUPONS
// ======================================================

export const getCoupons = async () => {

    const token =
        localStorage.getItem("token");


    const response =
        await axios.get(

            `${API_URL}/coupons`,

            {
                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }

        );


    return response.data;

};


// ======================================================
// GET SINGLE COUPON
// ======================================================

export const getCouponById = async (
    id
) => {

    const token =
        localStorage.getItem("token");


    const response =
        await axios.get(

            `${API_URL}/coupons/${id}`,

            {
                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }

        );


    return response.data;

};


// ======================================================
// UPDATE COUPON
// ======================================================

export const updateCoupon = async (
    id,
    couponData
) => {

    const token =
        localStorage.getItem("token");


    const response =
        await axios.put(

            `${API_URL}/coupons/${id}`,

            couponData,

            {
                headers: {

                    Authorization:
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"

                }

            }

        );


    return response.data;

};


// ======================================================
// DELETE COUPON
// ======================================================

export const deleteCoupon = async (
    id
) => {

    const token =
        localStorage.getItem("token");


    const response =
        await axios.delete(

            `${API_URL}/coupons/${id}`,

            {
                headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }

        );


    return response.data;

};


// ======================================================
// APPLY COUPON - CUSTOMER
// ======================================================

export const applyCoupon = async (
    code,
    cartTotal
) => {

    const token =
        localStorage.getItem("token");


    const response =
        await axios.post(

            `${API_URL}/coupons/apply`,

            {
                code: code.trim().toUpperCase(),

                // IMPORTANT:
                // Backend expects cartTotal
                cartTotal: Number(cartTotal)
            },

            {
                headers: {

                    Authorization:
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"

                }

            }

        );


    return response;

};