// // import axios from "axios";

// // const API = "http://localhost:5000/api/orders";


// // // =====================================
// // // GET CONFIG WITH TOKEN
// // // =====================================

// // const getConfig = () => ({
// //     headers: {
// //         Authorization:
// //             `Bearer ${localStorage.getItem("token")}`
// //     }
// // });


// // // =====================================
// // // CREATE WALK-IN ORDER
// // // =====================================

// // export const createWalkInOrder = async (data) => {

// //     const payload = {

// //         ...data,

// //         orderSource: "WALK_IN"

// //     };


// //     const res = await axios.post(

// //         API,

// //         payload,

// //         getConfig()

// //     );


// //     return res.data;

// // };


// // // =====================================
// // // GET ALL PRODUCTS
// // // =====================================

// // export const getProducts = async () => {


// //     const res = await axios.get(

// //         "http://localhost:5000/api/products",

// //         getConfig()

// //     );


// //     return res.data.data || [];

// // };


// // // =====================================
// // // SEARCH PRODUCT
// // // =====================================

// // export const searchProducts = async (keyword) => {


// //     const res = await axios.get(

// //         `http://localhost:5000/api/products/search?keyword=${keyword}`,

// //         getConfig()

// //     );


// //     return res.data.data || [];

// // };


// import axios from "axios";

// // const API = "http://localhost:5000/api/orders";

// // const PRODUCT_API = "http://localhost:5000/api/products";

// const API = import.meta.env.VITE_API_URL;

// // const PRODUCT_API = `${import.meta.env.VITE_API_URL}/products`;


// // =====================================
// // AUTH CONFIG
// // =====================================

// const getConfig = () => {

//     const token = localStorage.getItem("token");

//     return {

//         headers: {

//             Authorization: `Bearer ${token}`

//         }

//     };

// };


// // =====================================
// // CREATE WALK IN ORDER
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
// // GET PRODUCTS
// // =====================================

// export const getProducts = async () => {


//     const res = await axios.get(

//         PRODUCT_API,

//         getConfig()

//     );


//     return res.data.data || [];

// };



// // =====================================
// // SEARCH PRODUCTS
// // =====================================

// export const searchProducts = async(keyword)=>{


//     const res = await axios.get(

//         `${PRODUCT_API}/search?keyword=${keyword}`,

//         getConfig()

//     );


//     return res.data.data || [];

// };





import axios from "axios";

// =====================================
// API
// =====================================

const API = `${import.meta.env.VITE_API_URL}/orders`;

const PRODUCT_API =
    `${import.meta.env.VITE_API_URL}/products`;

// =====================================
// AUTH CONFIG
// =====================================

const getConfig = () => {

    const token =
        localStorage.getItem("token");

    return {
        headers: {
            Authorization:
                `Bearer ${token}`,
        },
    };
};

// =====================================
// CREATE WALK-IN ORDER
// =====================================

// export const createWalkInOrder = async (data) => {

//     // const payload = {
//     //     ...data,
//     //     orderSource: "WALK_IN",
//     // };

// const payload = {
//     customerName: data.customerName,
//     customerPhone: data.customerPhone,
//     paymentMethod: data.paymentMethod,

//     products: data.products.map((item) => ({
//         product: item._id,
//         quantity: item.quantity,
//     })),

//     discount: 0,
//     notes: "",
// };

//     const res = await axios.post(
//         API,
//         payload,
//         getConfig()
//     );

//     return res.data;
// };

export const createWalkInOrder = async (data) => {

    const payload = {
        orderItems: data.orderItems,

        shippingAddress: data.shippingAddress,

        totalAmount: data.totalAmount,

        paymentMethod: data.paymentMethod,

        orderSource: "WALK_IN",
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

    console.log(
        "WALK-IN PRODUCT RESPONSE:",
        res.data
    );

    if (Array.isArray(res.data)) {
        return res.data;
    }

    if (Array.isArray(res.data.data)) {
        return res.data.data;
    }

    if (Array.isArray(res.data.products)) {
        return res.data.products;
    }

    return [];
};

// =====================================
// SEARCH PRODUCTS
// =====================================

export const searchProducts = async (keyword) => {

    const res = await axios.get(
        `${PRODUCT_API}/search?keyword=${encodeURIComponent(keyword)}`,
        getConfig()
    );

    if (Array.isArray(res.data)) {
        return res.data;
    }

    if (Array.isArray(res.data.data)) {
        return res.data.data;
    }

    if (Array.isArray(res.data.products)) {
        return res.data.products;
    }

    return [];
};