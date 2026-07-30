import React, {
    useEffect,
    useState
} from "react";


import "./Cart.css";


import {
    Link,
    useNavigate
} from "react-router-dom";


import {

    getCart,
    updateCartQuantity,
    removeCartItem

} from "../../../services/cartService";



const Cart = () => {

    const navigate = useNavigate();


    const [cartItems, setCartItems] =
        useState([]);


    const [subtotal, setSubtotal] =
        useState(0);


    const [loading, setLoading] =
        useState(true);


    const [updatingProduct, setUpdatingProduct] =
        useState(null);


    const shippingCharge = 100;

    const gst = 18;



    // =================================
    // LOAD CART
    // =================================

    useEffect(() => {

        loadCart();

    }, []);



    const loadCart = async () => {

        try {

            setLoading(true);


            const res =
                await getCart();


            console.log(
                "CART RESPONSE:",
                res.data
            );


            const items =
                res.data?.data?.items || [];


            setCartItems(

                Array.isArray(items)
                    ? items
                    : []

            );

        }

        catch (error) {

            console.error(
                "GET CART ERROR:",
                error
            );


            setCartItems([]);

        }

        finally {

            setLoading(false);

        }

    };



    // =================================
    // CALCULATE SUBTOTAL
    // =================================

    useEffect(() => {

        const total =
            cartItems.reduce(

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


        setSubtotal(total);

    }, [cartItems]);



    // =================================
    // UPDATE QUANTITY
    // =================================

    const handleUpdateQuantity = async (
        item,
        change
    ) => {

        const productId =
            item.product?._id;


        if (!productId) {

            alert(
                "Product information missing"
            );

            return;

        }


        const currentQuantity =
            Number(item.quantity || 1);


        const newQuantity =
            currentQuantity + change;


        if (newQuantity < 1) {

            return;

        }


        try {

            setUpdatingProduct(
                productId
            );


            console.log(
                "Updating quantity:",
                {
                    productId,
                    newQuantity
                }
            );


            const res =
                await updateCartQuantity(

                    productId,

                    newQuantity

                );


            console.log(
                "UPDATED CART:",
                res.data
            );


            const updatedItems =
                res.data?.data?.items || [];


            setCartItems(

                Array.isArray(updatedItems)
                    ? updatedItems
                    : []

            );

        }

        catch (error) {

            console.error(
                "UPDATE QUANTITY ERROR:",
                error
            );


            alert(

                error.response?.data?.message ||

                "Failed to update quantity"

            );

        }

        finally {

            setUpdatingProduct(null);

        }

    };



    // =================================
    // REMOVE ITEM
    // =================================

    const handleRemoveItem = async (
        item
    ) => {

        const productId =
            item.product?._id;


        if (!productId) {

            alert(
                "Product information missing"
            );

            return;

        }


        const confirmRemove =
            window.confirm(

                "Are you sure you want to remove this product?"

            );


        if (!confirmRemove) {

            return;

        }


        try {

            setUpdatingProduct(
                productId
            );


            const res =
                await removeCartItem(

                    productId

                );


            console.log(
                "REMOVE CART RESPONSE:",
                res.data
            );


            const updatedItems =
                res.data?.data?.items || [];


            setCartItems(

                Array.isArray(updatedItems)
                    ? updatedItems
                    : []

            );

        }

        catch (error) {

            console.error(
                "REMOVE ITEM ERROR:",
                error
            );


            alert(

                error.response?.data?.message ||

                "Failed to remove product"

            );

        }

        finally {

            setUpdatingProduct(null);

        }

    };



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
    // LOADING
    // =================================

    if (loading) {

        return (

            <div className="cart-page">

                <div className="cart-loading">

                    Loading Cart...

                </div>

            </div>

        );

    }



    // =================================
    // UI
    // =================================

    return (

        <div className="cart-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="cart-header">

                <h2>
                    Shopping Cart
                </h2>

                <p>
                    Review Your Selected Products
                </p>

            </div>



            {/* =================================
                EMPTY CART
            ================================= */}

            {cartItems.length === 0 ? (

                <div className="empty-cart">

                    <h3>
                        Your Cart Is Empty
                    </h3>

                    <p>
                        Add some products to continue shopping.
                    </p>

                    <Link
                        to="/shop"
                        className="continue-shopping"
                    >

                        Continue Shopping

                    </Link>

                </div>

            ) : (

                <>


                    {/* =================================
                        CART TABLE
                    ================================= */}

                    <div className="cart-table">


                        {/* Header */}

                        <div className="cart-head">

                            <div>
                                Product
                            </div>

                            <div>
                                Price
                            </div>

                            <div>
                                Quantity
                            </div>

                            <div>
                                Total
                            </div>

                            <div>
                                Action
                            </div>

                        </div>



                        {/* Cart Items */}

                        {cartItems.map(
                            (item, index) => {

                                const product =
                                    item.product;


                                const price =
                                    Number(
                                        product?.pricing?.sellingPrice || 0
                                    );


                                const quantity =
                                    Number(
                                        item.quantity || 1
                                    );


                                const itemTotal =
                                    price *
                                    quantity;


                                const productId =
                                    product?._id;


                                const isUpdating =
                                    updatingProduct ===
                                    productId;



                                return (

                                    <div
                                        className="cart-row"
                                        key={
                                            productId ||
                                            index
                                        }
                                    >


                                        {/* Product */}

                                        <div className="cart-product">

                                            <img
                                                src={
                                                    product?.images?.length
                                                        ? (
                                                            product.images[0]?.url?.startsWith("http")
                                                                ? product.images[0].url
                                                                : `http://localhost:5000${product.images[0].url}`
                                                        )
                                                        : "/no-image.png"
                                                }
                                                alt={
                                                    product?.name ||
                                                    "Product"
                                                }
                                                onError={(e) => {

                                                    e.currentTarget.src =
                                                        "/no-image.png";

                                                }}
                                            />


                                            <div>

                                                <h4>

                                                    {
                                                        product?.name ||
                                                        "Product"
                                                    }

                                                </h4>


                                                <p>

                                                    {
                                                        product?.brand?.name ||
                                                        "No Brand"
                                                    }

                                                </p>

                                            </div>

                                        </div>



                                        {/* Price */}

                                        <div className="cart-price">

                                            ₹ {price}

                                        </div>



                                        {/* Quantity */}

                                        <div className="cart-quantity">


                                            <button
                                                type="button"
                                                disabled={
                                                    isUpdating ||
                                                    quantity <= 1
                                                }
                                                onClick={() =>
                                                    handleUpdateQuantity(
                                                        item,
                                                        -1
                                                    )
                                                }
                                            >

                                                −

                                            </button>


                                            <span>

                                                {
                                                    isUpdating
                                                        ? "..."
                                                        : quantity
                                                }

                                            </span>


                                            <button
                                                type="button"
                                                disabled={
                                                    isUpdating
                                                }
                                                onClick={() =>
                                                    handleUpdateQuantity(
                                                        item,
                                                        1
                                                    )
                                                }
                                            >

                                                +

                                            </button>


                                        </div>



                                        {/* Total */}

                                        <div className="cart-item-total">

                                            ₹ {itemTotal}

                                        </div>



                                        {/* Remove */}

                                        <div>

                                            <button
                                                type="button"
                                                className="remove-btn"
                                                disabled={
                                                    isUpdating
                                                }
                                                onClick={() =>
                                                    handleRemoveItem(
                                                        item
                                                    )
                                                }
                                            >

                                                {
                                                    isUpdating
                                                        ? "Please Wait..."
                                                        : "Remove"
                                                }

                                            </button>

                                        </div>


                                    </div>

                                );

                            }

                        )}

                    </div>



                    {/* =================================
                        SUMMARY
                    ================================= */}

                    <div className="cart-summary">

                        <h3>
                            Order Summary
                        </h3>


                        <div className="summary-row">

                            <span>
                                Subtotal
                            </span>

                            <span>
                                ₹ {subtotal}
                            </span>

                        </div>


                        <div className="summary-row">

                            <span>
                                Shipping
                            </span>

                            <span>
                                ₹ {shippingCharge}
                            </span>

                        </div>


                        <div className="summary-row">

                            <span>
                                GST ({gst}%)
                            </span>

                            <span>
                                ₹ {gstAmount}
                            </span>

                        </div>


                        <hr />


                        <div className="summary-total">

                            <span>
                                Grand Total
                            </span>

                            <span>
                                ₹ {grandTotal}
                            </span>

                        </div>


                        <button
                            type="button"
                            className="checkout-btn"
                            onClick={() =>
                                navigate("/checkout")
                            }
                        >

                            Proceed Checkout

                        </button>

                    </div>


                </>

            )}

        </div>

    );

};


export default Cart;