import React, { useState } from "react";

import "./AddAddress.css";

import { useNavigate } from "react-router-dom";

import { createAddress } from "../../../services/addressService";

const AddAddress = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        type: "HOME",

        fullName: "",

        phone: "",

        addressLine: "",

        city: "",

        state: "",

        pincode: "",

        country: "India",

        landmark: ""

    });

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await createAddress(formData);

            alert("Address Added Successfully");

            navigate("/my-address");

        }

        catch (error) {

            console.log(error);

            alert(error.response?.data?.message || "Something went wrong");

        }

    };

    return (

        <div className="add-address-page">

            <h2>Add New Address</h2>

            <form
                className="address-form"
                onSubmit={handleSubmit}
            >

                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                >

                    <option value="HOME">Home</option>

                    <option value="OFFICE">Office</option>

                    <option value="OTHER">Other</option>

                </select>

                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="addressLine"
                    placeholder="Address"
                    value={formData.addressLine}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="landmark"
                    placeholder="Landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                />

                <button type="submit">

                    Save Address

                </button>

            </form>

        </div>

    );

};

export default AddAddress;