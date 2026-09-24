import api from "../api/axios.js";

export const createRefund = (data) =>
    api.post("/refunds", data);

export const getAllRefunds = () =>
    api.get("/refunds");

export const getRefundById = (id) =>
    api.get(`/refunds/${id}`);

export const getOrderRefunds = (orderId) =>
    api.get(`/refunds/order/${orderId}`);

export const approveRefund = (id) =>
    api.patch(`/refunds/${id}/approve`);

export const rejectRefund = (id, notes) =>
    api.patch(`/refunds/${id}/reject`, {
        notes,
    });

export const processRefund = (id) =>
    api.patch(`/refunds/${id}/process`);