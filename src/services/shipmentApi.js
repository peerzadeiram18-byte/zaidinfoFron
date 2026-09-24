import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


// =====================================================
// AUTH CONFIG
// =====================================================

const getAuthConfig = () => ({
    headers: {
        Authorization:
            `Bearer ${localStorage.getItem("token")}`,

        "Content-Type":
            "application/json",
    },
});


// =====================================================
// DISPATCH THROUGH BLUE DART
// =====================================================

export const dispatchViaBlueDart = async ({
    orderId,
    blueDartProduct,
    packageDetails,
}) => {

    const response = await axios.post(
        `${API_URL}/api/shipment/dispatch`,
        {
            orderId,
            blueDartProduct,
            packageDetails,
        },
        getAuthConfig()
    );

    return response.data;
};


// =====================================================
// GET SHIPMENT
// =====================================================

export const getShipment = async (
    shipmentId
) => {

    const response = await axios.get(
        `${API_URL}/api/shipment/${shipmentId}`,
        getAuthConfig()
    );

    return response.data;
};


// =====================================================
// GET LIVE BLUE DART TRACKING
// =====================================================

export const getShipmentTracking = async (
    shipmentId
) => {

    const response = await axios.get(
        `${API_URL}/api/shipment/${shipmentId}/tracking`,
        getAuthConfig()
    );

    return response.data;
};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
    dispatchViaBlueDart,
    getShipment,
    getShipmentTracking,
};