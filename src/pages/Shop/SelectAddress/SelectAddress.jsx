import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SelectAddress.css";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

const SelectAddress = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [addresses, setAddresses] = useState([]);

    const [selectedAddress, setSelectedAddress] = useState("");

    useEffect(() => {

        getAddresses();

    }, []);

    const getAddresses = async () => {

        try {

         const res = await axios.get(
    `${API}/addresses`,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);

            setAddresses(res.data.data);

        } catch (err) {

            console.log(err);

        }

    };

    const continueCheckout = () => {

        if (!selectedAddress) {

            toast.error("Please Select Address");

            return;

        }

        localStorage.setItem(
            "selectedAddress",
            selectedAddress
        );

        navigate("/place-order");

    };

    return (

        <div className="address-page">

            <h2>Select Delivery Address</h2>

            {

                addresses.map((address) => (

                    <div
                        key={address._id}
                        className="address-card"
                    >

                        <input
                            type="radio"
                            checked={
                                selectedAddress === address._id
                            }
                            onChange={() =>
                                setSelectedAddress(address._id)
                            }
                        />

                        <h3>{address.fullName}</h3>

                        <p>{address.phone}</p>

                        <p>{address.address}</p>

                        <p>
                            {address.city},
                            {address.state}
                        </p>

                        <p>{address.pincode}</p>

                    </div>

                ))

            }

            <button
                onClick={continueCheckout}
            >
                Continue
            </button>

        </div>

    );

};

export default SelectAddress;