import axios from "axios";

// const API =
//     "http://localhost:5000/api/inventory";

const API =
    `${import.meta.env.VITE_API_URL}/inventory`;

// ======================================================
// AUTH CONFIG
// ======================================================

const getConfig = () => {

    const token =
        localStorage.getItem("token");

    return {

        headers: {

            Authorization:
                `Bearer ${token}`

        }

    };

};


// ======================================================
// ADMIN INVENTORY
// Protected API
// ======================================================

export const getInventory = async () => {

    return await axios.get(
        API,
        getConfig()
    );

};


// ======================================================
// SHOP INVENTORY
// PUBLIC API
// Customer ke liye
// ======================================================

export const getShopInventory = async () => {

    return await axios.get(
        `${API}/shop`
    );

};


// ======================================================
// ADD STOCK
// ======================================================

export const addStock = async (data) => {

    return await axios.patch(

        `${API}/add-stock`,

        data,

        getConfig()

    );

};


// ======================================================
// REMOVE STOCK
// ======================================================

export const removeStock = async (data) => {

    return await axios.patch(

        `${API}/remove-stock`,

        data,

        getConfig()

    );

};


// ======================================================
// RETURN STOCK
// ======================================================

export const returnStock = async (data) => {

    return await axios.patch(

        `${API}/return-stock`,

        data,

        getConfig()

    );

};


// ======================================================
// STOCK HISTORY
// ======================================================

export const getStockHistory = async (productId) => {

    // return await axios.get(

    //     `http://localhost:5000/api/stock-transactions/product/${productId}`,

    //     getConfig()

    // );

    return await axios.get(

    `${import.meta.env.VITE_API_URL}/stock-transactions/product/${productId}`,

    getConfig()

);

};