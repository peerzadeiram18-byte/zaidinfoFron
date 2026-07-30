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


const API =
    "http://localhost:5000";


const Checkout = () => {

    const navigate =
        useNavigate();


    const token =
        localStorage.getItem("token");


    // =================================
    // STATES
    // =================================

    const [cart, setCart] =
        useState([]);


    const [addresses, setAddresses] =
        useState([]);


    const [selectedAddress, setSelectedAddress] =
        useState("");


    const [loading, setLoading] =
        useState(false);


    const [cartLoading, setCartLoading] =
        useState(true);


    const shippingCharge = 100;

    const gst = 18;



    // =================================
    // LOAD DATA
    // =================================

    useEffect(() => {

        loadCart();

        getAddresses();

    }, []);



    // =================================
    // GET CART
    // =================================

    const loadCart = async () => {

        try {

            setCartLoading(true);


            const res =
                await axios.get(

                    `${API}/api/cart`,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );


            console.log(
                "CHECKOUT CART:",
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

            console.error(
                "GET CART ERROR:",
                err.response?.data || err
            );


            setCart([]);

        }

        finally {

            setCartLoading(false);

        }

    };



    // =================================
    // GET ADDRESSES
    // =================================

    const getAddresses = async () => {

        try {

            const res =
                await axios.get(

                    `${API}/api/addresses`,

                    {

                        headers: {

                            Authorization:
                                `Bearer ${token}`

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

            console.error(
                "GET ADDRESS ERROR:",
                err.response?.data || err
            );

        }

    };



    // =================================
    // SUBTOTAL
    // =================================

    const subtotal =
        cart.reduce(

            (sum, item) => {

                const price =
                    Number(
                        item.product?.pricing?.sellingPrice || 0
                    );


                const quantity =
                    Number(
                        item.quantity || 0
                    );


                return (
                    sum +
                    price * quantity
                );

            },

            0

        );



    // =================================
    // GST
    // =================================

    const gstAmount =
        Math.round(

            subtotal *
            gst /
            100

        );



    // =================================
    // GRAND TOTAL
    // =================================

    const grandTotal =
        subtotal +
        shippingCharge +
        gstAmount;



    // =================================
    // PLACE ORDER
    // =================================

    const placeOrder = async () => {

        if (loading) {

            return;

        }


        // -------------------------------
        // ADDRESS CHECK
        // -------------------------------

        if (!selectedAddress) {

            alert(
                "Please select delivery address"
            );

            return;

        }


        const address =
            addresses.find(

                item =>
                    item._id ===
                    selectedAddress

            );


        if (!address) {

            alert(
                "Address not found"
            );

            return;

        }


        // -------------------------------
        // CART CHECK
        // -------------------------------

        if (!cart.length) {

            alert(
                "Your cart is empty"
            );

            return;

        }


        // =================================
        // SHIPPING ADDRESS
        // =================================

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



        // =================================
        // VALIDATION
        // =================================

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



        // =================================
        // ORDER ITEMS
        // =================================

        const orderItems =
            cart.map(

                item => ({

                    product:
                        item.product?._id,


                    title:
                        item.product?.name ||
                        "",


                    quantity:
                        Number(
                            item.quantity || 1
                        ),


                    price:
                        Number(
                            item.product?.pricing?.sellingPrice || 0
                        ),


                    imageUrl:
                        item.product?.images?.[0]?.url ||
                        ""

                })

            );



        // =================================
        // CHECK PRODUCT IDS
        // =================================

        const invalidProduct =
            orderItems.some(

                item =>
                    !item.product

            );


        if (invalidProduct) {

            alert(
                "Product information is missing"
            );

            return;

        }



        // =================================
        // ORDER DATA
        // =================================

        // const orderData = {

        //     orderItems,

        //     shippingAddress,

        //     // Same total as checkout UI
        //     totalAmount:
        //         Number(grandTotal)

        // };

        // =================================
        // ORDER DATA
        // =================================
        // IMPORTANT:
        // Backend Joi validation requires:
        // originalPrice, price, quantity, product, title
        // and shippingAddress must be the COMPLETE address object.

        const orderData = {
            orderItems: cart.map((item) => {
                const sellingPrice = Number(
                    item.product?.pricing?.sellingPrice ?? 0
                );

                const originalPrice = Number(
                    item.product?.pricing?.originalPrice ??
                    item.originalPrice ??
                    sellingPrice
                );

                const quantity = Number(item.quantity ?? 1);

                const discountAmount = Number(
                    item.discountAmount ??
                    Math.max(originalPrice - sellingPrice, 0)
                );

                return {
                    product:
                        item.product?._id ||
                        item.product ||
                        "",

                    title:
                        item.product?.name ||
                        item.title ||
                        "",

                    quantity,

                    originalPrice,

                    discountAmount,

                    price: sellingPrice,

                    offer:
                        item.offer ||
                        null,

                    imageUrl:
                        item.product?.images?.[0]?.url ||
                        item.imageUrl ||
                        "",
                };
            }),

            shippingAddress,

            totalAmount:
                Number(grandTotal),

            orderSource:
                "ONLINE",
        };

        // Extra frontend safety check before API call
        const invalidOrderItem = orderData.orderItems.some(
            (item) =>
                !item.product ||
                !item.title ||
                !Number.isFinite(item.quantity) ||
                item.quantity < 1 ||
                !Number.isFinite(item.originalPrice) ||
                !Number.isFinite(item.price)
        );

        if (invalidOrderItem) {
            alert(
                "Some product information is missing. Please refresh the cart and try again."
            );
            return;
        }

        console.log(
            "FINAL ORDER DATA:",
            orderData
        );

        


        try {

            setLoading(true);


            // =================================
            // CREATE ORDER
            // =================================

            const orderRes =
                await axios.post(

                    `${API}/api/orders`,

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



            // =================================
            // CREATE PAYMENT
            // =================================

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



            // =================================
            // SUCCESS
            // =================================

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

            console.error(
                "ORDER / PAYMENT ERROR:",
                err
            );


            console.log(
                "BACKEND ERROR:",
                JSON.stringify(
                    err.response?.data,
                    null,
                    2
                )
            );

            console.log(
                "VALIDATION ERRORS:",
                err.response?.data?.errors
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



    // =================================
    // LOADING
    // =================================

    if (cartLoading) {

        return (

            <div className="checkout">

                <div className="checkout-right">

                    <h2>
                        Loading Cart...
                    </h2>

                </div>

            </div>

        );

    }



    // =================================
    // UI
    // =================================

    return (

        <div className="checkout">


            {/* =================================
                LEFT
            ================================= */}

            <div className="checkout-left">

                <h2>
                    Select Delivery Address
                </h2>


                {addresses.length === 0 ? (

                    <p>
                        No Address Found
                    </p>

                ) : (

                    addresses.map(

                        address => (

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

                )}

            </div>



            {/* =================================
                RIGHT
            ================================= */}

            <div className="checkout-right">

                <h2>
                    Order Summary
                </h2>


                {cart.length === 0 ? (

                    <div>

                        <p>
                            Cart is empty
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/shop")
                            }
                        >

                            Continue Shopping

                        </button>

                    </div>

                ) : (

                    cart.map(

                        (item, index) => {

                            const productId =
                                item.product?._id ||
                                item._id;


                            const price =
                                Number(
                                    item.product?.pricing?.sellingPrice || 0
                                );


                            const quantity =
                                Number(
                                    item.quantity || 0
                                );


                            const itemTotal =
                                price *
                                quantity;


                            return (

                                <div
                                    className="summary-item"
                                    key={
                                        productId ||
                                        index
                                    }
                                >

                                    <p>

                                        {
                                            item.product?.name
                                        }

                                    </p>


                                    <p>

                                        Qty:{" "}

                                        {
                                            quantity
                                        }

                                    </p>


                                    <p>

                                        ₹ {price}

                                    </p>


                                    <p>

                                        Item Total: ₹{" "}

                                        {
                                            itemTotal
                                        }

                                    </p>

                                </div>

                            );

                        }

                    )

                )}



                {cart.length > 0 && (

                    <>

                        <hr />


                        {/* Subtotal */}

                        <div className="summary-row">

                            <span>
                                Subtotal
                            </span>

                            <span>
                                ₹ {subtotal}
                            </span>

                        </div>


                        {/* Shipping */}

                        <div className="summary-row">

                            <span>
                                Shipping
                            </span>

                            <span>
                                ₹ {shippingCharge}
                            </span>

                        </div>


                        {/* GST */}

                        <div className="summary-row">

                            <span>
                                GST ({gst}%)
                            </span>

                            <span>
                                ₹ {gstAmount}
                            </span>

                        </div>


                        <hr />


                        <h2>

                            Total : ₹ {grandTotal}

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

                    </>

                )}

            </div>

        </div>

    );

};


export default Checkout;