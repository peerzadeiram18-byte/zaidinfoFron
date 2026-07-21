import axios from "axios";

const API = "http://localhost:5000/api/cart";

const token = localStorage.getItem("token");

const config = {
    headers: {
        Authorization: `Bearer ${token}`
    }
};

export const addToCart = async (data) => {
    return await axios.post(
        `${API}/add`,
        data,
        config
    );
};

export const getCart = async () => {
    return await axios.get(
        API,
        config
    );
};

export const clearCart = async () => {
    return await axios.delete(
        `${API}/clear`,
        config
    );
};