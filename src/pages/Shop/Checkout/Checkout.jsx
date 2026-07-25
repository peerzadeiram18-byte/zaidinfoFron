import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    useNavigate
} from "react-router-dom";

import "./Checkout.css";

import {
    createPayment
} from "../../../services/paymentService";


const Checkout = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");


    // ==========================
    // STATES
    // ==========================

    const [cart, setCart] = useState([]);

    const [addresses, setAddresses] = useState([]);

    const [selectedAddress, setSelectedAddress] = useState("");

    const [loading, setLoading] = useState(false);


    // ==========================
    // LOAD DATA
    // ==========================

    useEffect(() => {

        getCart();

        getAddresses();

    }, []);


    // ==========================
    // GET CART
    // ==========================

    const getCart = async () => {

        try {

            const res = await axios.get(

                "http://localhost:5000/api/cart",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );


            console.log(
                "FULL CART RESPONSE",
                res.data
            );


            const items =
                res.data?.data?.items || [];


            setCart(

                Array.isArray(items)
                    ? items
                    : []

            );

        }

        catch (err) {

            console.log(
                "GET CART ERROR:",
                err.response?.data || err
            );

        }

    };


    // ==========================
    // GET ADDRESSES
    // ==========================

    const getAddresses = async () => {

        try {

            const res = await axios.get(

                "http://localhost:5000/api/addresses",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );


            console.log(
                "ADDRESS RESPONSE:",
                res.data
            );


            const addressData =
                res.data?.data || [];


            setAddresses(

                Array.isArray(addressData)
                    ? addressData
                    : []

            );

        }

        catch (err) {

            console.log(
                "GET ADDRESS ERROR:",
                err.response?.data || err
            );

        }

    };


    // ==========================
    // TOTAL
    // ==========================

    const total = cart.reduce(

        (sum, item) => {

            const price =
                Number(
                    item.product?.pricing?.sellingPrice || 0
                );

            const quantity =
                Number(
                    item.quantity || 0
                );


            return sum + (
                price * quantity
            );

        },

        0

    );


    // ==========================
    // PLACE ORDER
    // ==========================

    const placeOrder = async () => {

        if (loading) {

            return;

        }


        // --------------------------
        // CHECK ADDRESS
        // --------------------------

        if (!selectedAddress) {

            alert(
                "Please select delivery address"
            );

            return;

        }


        const address = addresses.find(

            (item) =>
                item._id === selectedAddress

        );


        if (!address) {

            alert(
                "Address not found"
            );

            return;

        }


        // --------------------------
        // CHECK CART
        // --------------------------

        if (!cart.length) {

            alert(
                "Your cart is empty"
            );

            return;

        }


        // ==========================
        // IMPORTANT
        // BACKEND EXPECTS THESE NAMES
        // ==========================

        const shippingAddress = {

            fullName:
                address.fullName ||
                address.name ||
                "",


            phone:
                address.phone ||
                address.mobile ||
                "",


            addressLine:
                address.addressLine ||
                address.address ||
                address.streetAddress ||
                "",


            city:
                address.city ||
                "",


            state:
                address.state ||
                "",


            pincode:
                address.pincode ||
                "",


            country:
                address.country ||
                "India",


            landmark:
                address.landmark ||
                ""

        };


        // ==========================
        // FRONTEND VALIDATION
        // ==========================

        if (!shippingAddress.fullName) {

            alert(
                "Address name is missing"
            );

            return;

        }


        if (!shippingAddress.phone) {

            alert(
                "Phone number is missing"
            );

            return;

        }


        if (!shippingAddress.addressLine) {

            alert(
                "Address is missing"
            );

            return;

        }


        if (!shippingAddress.city) {

            alert(
                "City is missing"
            );

            return;

        }


        if (!shippingAddress.state) {

            alert(
                "State is missing"
            );

            return;

        }


        if (!shippingAddress.pincode) {

            alert(
                "Pincode is missing"
            );

            return;

        }


        // ==========================
        // ORDER ITEMS
        // ==========================

        const orderItems = cart.map(

            (item) => ({

                product:
                    item.product?._id,


                title:
                    item.product?.name || "",


                quantity:
                    Number(item.quantity || 1),


                price:
                    Number(
                        item.product?.pricing?.sellingPrice || 0
                    ),


                imageUrl:
                    item.product?.images?.[0]?.url || ""

            })

        );


        // ==========================
        // CHECK PRODUCT IDS
        // ==========================

        const invalidProduct =
            orderItems.some(

                (item) =>
                    !item.product

            );


        if (invalidProduct) {

            alert(
                "Product information is missing"
            );

            return;

        }


        // ==========================
        // FINAL ORDER DATA
        // ==========================

        const orderData = {

            orderItems,

            shippingAddress,

            totalAmount: Number(total)

        };


        console.log(
            "FINAL ORDER DATA:",
            orderData
        );


        try {

            setLoading(true);


            // ==========================
            // CREATE ORDER
            // ==========================

            const orderRes =
                await axios.post(

                    "http://localhost:5000/api/orders",

                    orderData,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"

                        }

                    }

                );


            console.log(
                "ORDER RESPONSE:",
                orderRes.data
            );


            const order =
                orderRes.data?.order;


            if (!order) {

                throw new Error(
                    "Order was not created"
                );

            }


            // ==========================
            // CREATE PAYMENT
            // ==========================

            const paymentRes =
                await createPayment({

                    paymentFor:
                        "ORDER",


                    referenceId:
                        order._id,


                    amount:
                        order.totalAmount,


                    paymentMethod:
                        "COD"

                });


            console.log(
                "PAYMENT RESPONSE:",
                paymentRes
            );


            // ==========================
            // SUCCESS
            // ==========================

            alert(
                "Order placed successfully!"
            );


            navigate(

                "/payment",

                {

                    state: {

                        order,

                        payment:
                            paymentRes?.payment

                    }

                }

            );

        }

        catch (err) {

            console.log(
                "ORDER / PAYMENT ERROR:",
                err
            );


            console.log(
                "BACKEND ERROR:",
                err.response?.data
            );


            alert(

                err.response?.data?.message ||

                "Order failed"

            );

        }

        finally {

            setLoading(false);

        }

    };


    // ==========================
    // UI
    // ==========================

    return (

        <div className="checkout">


            {/* ==========================
                LEFT
            ========================== */}

            <div className="checkout-left">

                <h2>
                    Select Delivery Address
                </h2>


                {

                    addresses.length === 0 ? (

                        <p>
                            No Address Found
                        </p>

                    ) : (

                        addresses.map(

                            (address) => (

                                <div

                                    className="address-card"

                                    key={
                                        address._id
                                    }

                                >

                                    <input

                                        type="radio"

                                        name="deliveryAddress"

                                        checked={

                                            selectedAddress ===
                                            address._id

                                        }

                                        onChange={() =>

                                            setSelectedAddress(
                                                address._id
                                            )

                                        }

                                    />


                                    <div>

                                        <h4>

                                            {
                                                address.fullName ||
                                                address.name ||
                                                "Customer"
                                            }

                                        </h4>


                                        <p>

                                            {
                                                address.phone ||
                                                address.mobile ||
                                                ""
                                            }

                                        </p>


                                        <p>

                                            {
                                                address.addressLine ||
                                                address.address ||
                                                address.streetAddress ||
                                                ""
                                            }

                                        </p>


                                        <p>

                                            {
                                                address.city ||
                                                ""
                                            }

                                            ,{" "}

                                            {
                                                address.state ||
                                                ""
                                            }

                                        </p>


                                        <p>

                                            {
                                                address.pincode ||
                                                ""
                                            }

                                        </p>

                                    </div>

                                </div>

                            )

                        )

                    )

                }

            </div>


            {/* ==========================
                RIGHT
            ========================== */}

            <div className="checkout-right">

                <h2>
                    Order Summary
                </h2>


                {

                    cart.length === 0 ? (

                        <p>
                            Cart is empty
                        </p>

                    ) : (

                        cart.map(

                            (item) => {

                                const productId =
                                    item.product?._id ||
                                    item._id;


                                const price =
                                    Number(
                                        item.product?.pricing?.sellingPrice || 0
                                    );


                                return (

                                    <div

                                        className="summary-item"

                                        key={
                                            `${productId}-${item.quantity}`
                                        }

                                    >

                                        <p>

                                            {
                                                item.product?.name
                                            }

                                        </p>


                                        <p>

                                            Qty :{" "}

                                            {
                                                item.quantity
                                            }

                                        </p>


                                        <p>

                                            ₹{" "}

                                            {
                                                price
                                            }

                                        </p>

                                    </div>

                                );

                            }

                        )

                    )

                }


                <hr />


                <h2>

                    Total : ₹ {total}

                </h2>


                <button

                    type="button"

                    onClick={placeOrder}

                    disabled={loading}

                >

                    {

                        loading

                            ? "Placing Order..."

                            : "Place Order"

                    }

                </button>

            </div>

        </div>

    );

};


export default Checkout;