

// import axios from "axios";

// const API =
//     `${import.meta.env.VITE_API_URL}/products`;


// const getConfig = () => ({

//     headers: {

//         Authorization:
//             `Bearer ${localStorage.getItem("token")}`

//     }

// });


// // =====================================================
// // CREATE PRODUCT
// // =====================================================

// export const createProduct = async (data) => {

//     return await axios.post(

//         API,

//         data,

//         {

//             headers: {

//                 Authorization:
//                     `Bearer ${localStorage.getItem("token")}`

//             }

//         }

//     );

// };


// // =====================================================
// // GET PRODUCTS
// // =====================================================

// export const getProducts = async () => {

//     return await axios.get(

//         API,

//         getConfig()

//     );

// };


// // =====================================================
// // GET SINGLE PRODUCT
// // =====================================================

// export const getProduct = async (id) => {

//     return await axios.get(

//         `${API}/${id}`,

//         getConfig()

//     );

// };


// // =====================================================
// // UPDATE PRODUCT
// // =====================================================

// export const updateProduct = async (
//     id,
//     data
// ) => {

//     return await axios.put(

//         `${API}/${id}`,

//         data,

//         {

//             headers: {

//                 Authorization:
//                     `Bearer ${localStorage.getItem("token")}`

//             }

//         }

//     );

// };


// // =====================================================
// // DELETE PRODUCT
// // =====================================================

// export const deleteProduct = async (id) => {

//     return await axios.delete(

//         `${API}/${id}`,

//         getConfig()

//     );

// };


// // =====================================================
// // SEARCH PRODUCTS
// // =====================================================

// export const searchProducts = async (
//     keyword
// ) => {

//     return await axios.get(

//         `${API}/search?keyword=${encodeURIComponent(keyword)}`,

//         getConfig()

//     );

// };



// // =====================================================
// // CUSTOMER SHOP PRODUCTS
// // =====================================================

// export const getShopProducts = async () => {

//     return await axios.get(

//         `${API}/shop`,

//         getConfig()   // ← ADD THIS

//     );

// };


// import axios from "axios";

// const API =
//     `${import.meta.env.VITE_API_URL}/products`;


// const getConfig = () => ({

//     headers: {

//         Authorization:
//             `Bearer ${localStorage.getItem("token")}`

//     }

// });


// // =====================================================
// // CREATE PRODUCT
// // =====================================================

// export const createProduct = async (data) => {

//     return await axios.post(

//         API,

//         data,

//         {

//             headers: {

//                 Authorization:
//                     `Bearer ${localStorage.getItem("token")}`

//             }

//         }

//     );

// };


// // =====================================================
// // GET PRODUCTS
// // =====================================================

// export const getProducts = async () => {

//     return await axios.get(

//         API,

//         getConfig()

//     );

// };


// // =====================================================
// // GET SINGLE PRODUCT
// // =====================================================

// export const getProduct = async (id) => {

//     return await axios.get(

//         `${API}/${id}`,

//         getConfig()

//     );

// };


// // =====================================================
// // UPDATE PRODUCT
// // =====================================================

// export const updateProduct = async (
//     id,
//     data
// ) => {

//     return await axios.put(

//         `${API}/${id}`,

//         data,

//         {

//             headers: {

//                 Authorization:
//                     `Bearer ${localStorage.getItem("token")}`

//             }

//         }

//     );

// };


// // =====================================================
// // DELETE PRODUCT
// // =====================================================

// export const deleteProduct = async (id) => {

//     return await axios.delete(

//         `${API}/${id}`,

//         getConfig()

//     );

// };


// // =====================================================
// // SEARCH PRODUCTS
// // =====================================================

// export const searchProducts = async (
//     keyword
// ) => {

//     return await axios.get(

//         `${API}/search?keyword=${encodeURIComponent(keyword)}`,

//         getConfig()

//     );

// };


// // =====================================================
// // CUSTOMER SHOP PRODUCTS
// // =====================================================

// export const getShopProducts = async () => {

//     return await axios.get(

//         `${API}/shop`

//     );

// };





import axios from "axios";

const API =
    `${import.meta.env.VITE_API_URL}/products`;


const getConfig = () => ({

    headers: {

        Authorization:
            `Bearer ${localStorage.getItem("token")}`

    }

});


// =====================================================
// CREATE PRODUCT
// =====================================================

export const createProduct = async (data) => {

    return await axios.post(

        API,

        data,

        {

            headers: {

                Authorization:
                    `Bearer ${localStorage.getItem("token")}`

            }

        }

    );

};


// =====================================================
// GET PRODUCTS
// =====================================================

export const getProducts = async () => {

    return await axios.get(

        API,

        getConfig()

    );

};


// =====================================================
// GET SINGLE PRODUCT
// =====================================================

export const getProduct = async (id) => {

    return await axios.get(

        `${API}/${id}`,

        getConfig()

    );

};



// =====================================================
// GET SINGLE PRODUCT BY SLUG (NEW)
// =====================================================
//
// Calls: GET /products/slug/:slug
//
// Used by the product details page, because the URL
// now contains the slug (asus-expertbook-0808)
// instead of the Mongo _id.
//
// encodeURIComponent keeps the URL safe if a slug
// ever contains unusual characters.
//
// =====================================================

export const getProductBySlug = async (slug) => {

    return await axios.get(

        `${API}/slug/${encodeURIComponent(slug)}`,

        getConfig()

    );

};


// =====================================================
// UPDATE PRODUCT
// =====================================================

export const updateProduct = async (
    id,
    data
) => {

    return await axios.put(

        `${API}/${id}`,

        data,

        {

            headers: {

                Authorization:
                    `Bearer ${localStorage.getItem("token")}`

            }

        }

    );

};


// =====================================================
// DELETE PRODUCT
// =====================================================

export const deleteProduct = async (id) => {

    return await axios.delete(

        `${API}/${id}`,

        getConfig()

    );

};


// =====================================================
// SEARCH PRODUCTS
// =====================================================

export const searchProducts = async (
    keyword
) => {

    return await axios.get(

        `${API}/search?keyword=${encodeURIComponent(keyword)}`,

        getConfig()

    );

};



// =====================================================
// CUSTOMER SHOP PRODUCTS
// =====================================================

export const getShopProducts = async () => {

    return await axios.get(

        `${API}/shop`,

        getConfig()   // ← ADD THIS

    );

};