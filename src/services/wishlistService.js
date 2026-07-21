import axios from "axios";

const API = "http://localhost:5000/api/wishlist";

const getToken = () => localStorage.getItem("token");

// ============================
// GET WISHLIST
// ============================

export const getWishlist = async () => {

    return await axios.get(API, {

        headers: {

            Authorization: `Bearer ${getToken()}`

        }

    });

};

// ============================
// ADD TO WISHLIST
// ============================

export const addToWishlist = async (productId) => {



    console.log("wishlistService Product =", productId);
    console.log("Type =", typeof productId);

    return await axios.post(

        `${API}/add`,

        {

            productId: productId

        },

        {

            headers: {

                Authorization: `Bearer ${getToken()}`

            }

        }

    );

};

// ============================
// REMOVE FROM WISHLIST
// ============================

export const removeFromWishlist = async (productId) => {

    return await axios.delete(

        `${API}/remove/${productId}`,

        {

            headers: {

                Authorization: `Bearer ${getToken()}`

            }

        }

    );

};