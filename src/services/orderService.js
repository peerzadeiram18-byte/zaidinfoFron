import axios from "axios";

const API = "http://localhost:5000/api/orders";

const token = () => localStorage.getItem("token");

const config = () => ({
    headers: {
        Authorization: `Bearer ${token()}`
    }
});

// =======================================
// GET MY ORDERS
// =======================================

export const getMyOrders = async () => {

    const res = await axios.get(

        `${API}/my`,

        config()

    );

    return res.data;

};

// =======================================
// GET SINGLE ORDER
// =======================================

export const getOrderById = async (id) => {

    const res = await axios.get(

        `${API}/${id}`,

        config()

    );

    return res.data;

};

// =======================================
// GET ALL ORDERS (ADMIN)
// =======================================

export const getAllOrders = async () => {

    const res = await axios.get(

        API,

        config()

    );

    return res.data;

};

// =======================================
// UPDATE ORDER STATUS
// =======================================

export const updateOrderStatus = async (

    id,

    status

) => {

    const res = await axios.patch(

        `${API}/${id}/status`,

        {

            status

        },

        config()

    );

    return res.data;

};

// =======================================
// UPDATE PAYMENT STATUS
// =======================================

export const updatePaymentStatus = async (

    id,

    paymentStatus,

    paymentId = ""

) => {

    const res = await axios.patch(

        `${API}/${id}/payment`,

        {

            paymentStatus,

            paymentId

        },

        config()

    );

    return res.data;

};