import axios from "axios";

const API = "http://localhost:5000/api/products";

const token = localStorage.getItem("token");

const config = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
};

export const createProduct = async (data) => {
    return await axios.post(API, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getProducts = async () => {
    return await axios.get(API, config);
};

export const getProduct = async (id) => {
    return await axios.get(`${API}/${id}`, config);
};

export const updateProduct = async (id, data) => {
    return await axios.put(`${API}/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteProduct = async (id) => {
    return await axios.delete(`${API}/${id}`, config);
};

export const searchProducts = async (keyword) => {
    return await axios.get(
        `${API}/search?keyword=${keyword}`,
        config
    );
};

export const getShopProducts = async () => {
    return await axios.get(
        `${API}/shop`
    );
};