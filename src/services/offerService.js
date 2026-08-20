// // import axios from "axios";

// // const API = `${import.meta.env.VITE_API_URL}/offers`;

// // const getConfig = () => ({
// //   headers: {
// //     Authorization: `Bearer ${localStorage.getItem("token")}`,
// //   },
// // });


// // // =====================================================
// // // GET ALL OFFERS
// // // =====================================================

// // export const getOffers = async () => {
// //   return await axios.get(API, getConfig());
// // };


// // // =====================================================
// // // GET SINGLE OFFER
// // // =====================================================

// // export const getOffer = async (id) => {
// //   return await axios.get(
// //     `${API}/${id}`,
// //     getConfig()
// //   );
// // };


// // // =====================================================
// // // CREATE OFFER
// // // =====================================================

// // export const createOffer = async (data) => {
// //   return await axios.post(
// //     API,
// //     data,
// //     getConfig()
// //   );
// // };


// // // =====================================================
// // // UPDATE OFFER
// // // =====================================================

// // export const updateOffer = async (id, data) => {
// //   return await axios.put(
// //     `${API}/${id}`,
// //     data,
// //     getConfig()
// //   );
// // };


// // // =====================================================
// // // ACTIVATE / DEACTIVATE OFFER
// // // =====================================================

// // export const updateOfferStatus = async (
// //   id,
// //   status
// // ) => {
// //   return await axios.patch(
// //     `${API}/${id}/status`,
// //     { status },
// //     getConfig()
// //   );
// // };


// // // =====================================================
// // // DELETE OFFER
// // // =====================================================

// // export const deleteOffer = async (id) => {
// //   return await axios.delete(
// //     `${API}/${id}`,
// //     getConfig()
// //   );
// // };

// import axios from "axios";

// const API = `${import.meta.env.VITE_API_URL}/offers`;

// // =====================================================
// // AUTH CONFIG
// // =====================================================

// const getConfig = () => ({
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
// });

// // =====================================================
// // GET ALL OFFERS
// // ADMIN ONLY
// // GET /api/offers
// // =====================================================

// export const getOffers = async () => {
//   return await axios.get(API, getConfig());
// };

// // =====================================================
// // GET ACTIVE OFFERS
// // PUBLIC
// // GET /api/offers/active
// //
// // IMPORTANT:
// // Shop page isi function ko use karega.
// // Isme token required nahi hai.
// // =====================================================

// export const getActiveOffers = async () => {
//   return await axios.get(`${API}/active`);
// };

// // =====================================================
// // GET SINGLE OFFER
// // ADMIN ONLY
// // GET /api/offers/:id
// // =====================================================

// export const getOffer = async (id) => {
//   return await axios.get(`${API}/${id}`, getConfig());
// };

// // =====================================================
// // CREATE OFFER
// // ADMIN ONLY
// // =====================================================

// export const createOffer = async (data) => {
//   return await axios.post(API, data, getConfig());
// };

// // =====================================================
// // UPDATE OFFER
// // ADMIN ONLY
// // =====================================================

// export const updateOffer = async (id, data) => {
//   return await axios.put(`${API}/${id}`, data, getConfig());
// };

// // =====================================================
// // ACTIVATE / DEACTIVATE OFFER
// // ADMIN ONLY
// // =====================================================

// export const updateOfferStatus = async (id, status) => {
//   return await axios.patch(
//     `${API}/${id}/status`,
//     { status },
//     getConfig()
//   );
// };

// // =====================================================
// // DELETE OFFER
// // ADMIN ONLY
// // =====================================================

// export const deleteOffer = async (id) => {
//   return await axios.delete(`${API}/${id}`, getConfig());
// };




import axios from "axios";


// =====================================================
// BASE API
// =====================================================

const API =
    `${import.meta.env.VITE_API_URL}/offers`;



// =====================================================
// ADMIN AUTH CONFIG
// =====================================================

const getConfig = () => ({

    headers: {

        Authorization:
            `Bearer ${localStorage.getItem("token")}`

    }

});



// =====================================================
// PUBLIC ACTIVE OFFERS
// NO LOGIN REQUIRED
//
// GET /api/offers/active
// =====================================================

export const getActiveOffers = async () => {

    return await axios.get(
        `${API}/active`
    );

};



// =====================================================
// ADMIN - GET ALL OFFERS
// =====================================================

export const getOffers = async () => {

    return await axios.get(
        API,
        getConfig()
    );

};



// =====================================================
// ADMIN - GET SINGLE OFFER
// =====================================================

export const getOffer = async (
    id
) => {

    return await axios.get(
        `${API}/${id}`,
        getConfig()
    );

};



// =====================================================
// ADMIN - CREATE OFFER
// =====================================================

export const createOffer = async (
    data
) => {

    return await axios.post(

        API,

        data,

        getConfig()

    );

};



// =====================================================
// ADMIN - UPDATE OFFER
// =====================================================

export const updateOffer = async (
    id,
    data
) => {

    return await axios.put(

        `${API}/${id}`,

        data,

        getConfig()

    );

};



// =====================================================
// ADMIN - UPDATE STATUS
// =====================================================

export const updateOfferStatus = async (
    id,
    status
) => {

    return await axios.patch(

        `${API}/${id}/status`,

        {
            status
        },

        getConfig()

    );

};



// =====================================================
// ADMIN - DELETE OFFER
// =====================================================

export const deleteOffer = async (
    id
) => {

    return await axios.delete(

        `${API}/${id}`,

        getConfig()

    );

};