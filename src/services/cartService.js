import axios from "axios";


// const API_URL =
//     "http://localhost:5000/api/cart";


const API_URL =
    `${import.meta.env.VITE_API_URL}/cart`;

// ======================================================
// AUTH HEADER
// ======================================================

const getAuthConfig = () => {

    const token =
        localStorage.getItem(
            "token"
        );


    return {

        headers: {

            Authorization:
                `Bearer ${token}`,

            "Content-Type":
                "application/json"

        }

    };

};



// ======================================================
// ADD TO CART
// ======================================================

export const addToCart = async (
    data
) => {

    return axios.post(

        `${API_URL}/add`,

        data,

        getAuthConfig()

    );

};



// ======================================================
// GET CART
// ======================================================

export const getCart = async () => {

    return axios.get(

        `${API_URL}`,

        getAuthConfig()

    );

};



// ======================================================
// UPDATE CART QUANTITY
// ======================================================

export const updateCartQuantity = async (

    productId,

    quantity

) => {

    return axios.put(

        `${API_URL}/item/${productId}`,

        {

            quantity:
                Number(quantity)

        },

        getAuthConfig()

    );

};



// ======================================================
// REMOVE CART ITEM
// ======================================================

export const removeCartItem = async (
    productId
) => {

    return axios.delete(

        `${API_URL}/item/${productId}`,

        getAuthConfig()

    );

};



// ======================================================
// CLEAR CART
// ======================================================

export const clearCart = async () => {

    return axios.delete(

        `${API_URL}/clear`,

        getAuthConfig()

    );

};