// import axios from "axios";

// const API = "http://localhost:5000/api/orders";


// // =====================================
// // GET CONFIG WITH TOKEN
// // =====================================

// const getConfig = () => ({
//     headers: {
//         Authorization:
//             `Bearer ${localStorage.getItem("token")}`
//     }
// });


// // =====================================
// // CREATE WALK-IN ORDER
// // =====================================

// export const createWalkInOrder = async (data) => {

//     const payload = {

//         ...data,

//         orderSource: "WALK_IN"

//     };


//     const res = await axios.post(

//         API,

//         payload,

//         getConfig()

//     );


//     return res.data;

// };


// // =====================================
// // GET ALL PRODUCTS
// // =====================================

// export const getProducts = async () => {


//     const res = await axios.get(

//         "http://localhost:5000/api/products",

//         getConfig()

//     );


//     return res.data.data || [];

// };


// // =====================================
// // SEARCH PRODUCT
// // =====================================

// export const searchProducts = async (keyword) => {


//     const res = await axios.get(

//         `http://localhost:5000/api/products/search?keyword=${keyword}`,

//         getConfig()

//     );


//     return res.data.data || [];

// };


import axios from "axios";

const API = "http://localhost:5000/api/orders";

const PRODUCT_API = "http://localhost:5000/api/products";


// =====================================
// AUTH CONFIG
// =====================================

const getConfig = () => {

    const token = localStorage.getItem("token");

    return {

        headers: {

            Authorization: `Bearer ${token}`

        }

    };

};


// =====================================
// CREATE WALK IN ORDER
// =====================================

export const createWalkInOrder = async (data) => {


    const payload = {

        ...data,

        orderSource: "WALK_IN"

    };


    const res = await axios.post(

        API,

        payload,

        getConfig()

    );


    return res.data;

};



// =====================================
// GET PRODUCTS
// =====================================

export const getProducts = async () => {


    const res = await axios.get(

        PRODUCT_API,

        getConfig()

    );


    return res.data.data || [];

};



// =====================================
// SEARCH PRODUCTS
// =====================================

export const searchProducts = async(keyword)=>{


    const res = await axios.get(

        `${PRODUCT_API}/search?keyword=${keyword}`,

        getConfig()

    );


    return res.data.data || [];

};