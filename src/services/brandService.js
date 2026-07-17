import api from "../api/axios";

export const createBrand = async (formData) => {

    const token = localStorage.getItem("token");

    return await api.post(

        "/brands",

        formData,

        {

            headers: {

                Authorization: `Bearer ${token}`,

                "Content-Type":"multipart/form-data"

            }

        }

    );

};

export const getBrands = async () => {

    const token = localStorage.getItem("token");

    return await api.get(

        "/brands",

        {

            headers: {

                Authorization:`Bearer ${token}`

            }

        }

    );

};