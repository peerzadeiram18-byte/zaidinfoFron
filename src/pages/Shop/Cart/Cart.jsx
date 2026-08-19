import React, {
    useEffect,
    useState
} from "react";

import { toast } from "react-toastify";

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

import {
    applyCoupon
} from "../../../services/couponService";


const API_URL =
    import.meta.env.VITE_API_URL;

const BASE_URL =
    API_URL.replace("/api", "");


const Cart = () => {

    const navigate =
        useNavigate();


    // ==================================================
    // CART STATES
    // ==================================================

    const [cartItems, setCartItems] =
        useState([]);

    const [subtotal, setSubtotal] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [updatingProduct, setUpdatingProduct] =
        useState(null);


    // ==================================================
    // COUPON STATES
    // ==================================================

    const [couponCode, setCouponCode] =
        useState("");

    const [appliedCoupon, setAppliedCoupon] =
        useState(null);

    const [couponLoading, setCouponLoading] =
        useState(false);

    const [couponDiscount, setCouponDiscount] =
        useState(0);


    // ==================================================
    // CONSTANTS
    // ==================================================

    const shippingCharge = 100;

    const gst = 18;


    // ==================================================
    // LOAD CART
    // ==================================================

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


    // ==================================================
    // CALCULATE SUBTOTAL
    // ==================================================

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


    // ==================================================
    // RESET COUPON
    // ==================================================

    const resetCoupon = () => {

        setCouponCode("");

        setAppliedCoupon(null);

        setCouponDiscount(0);

    };


    // ==================================================
    // UPDATE QUANTITY
    // ==================================================

    const handleUpdateQuantity = async (
        item,
        change
    ) => {

        const productId =
            item.product?._id;


        if (!productId) {

            toast.error(
                "Product information missing"
            );

            return;

        }


        const currentQuantity =
            Number(
                item.quantity || 1
            );


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


            // ==================================================
            // IMPORTANT
            // Cart total changed, so old coupon discount
            // should not remain active.
            // ==================================================

            if (appliedCoupon) {

                resetCoupon();

                toast.info(
                    "Cart changed. Please apply coupon again."
                );

            }

        }
        catch (error) {

            console.error(
                "UPDATE QUANTITY ERROR:",
                error
            );


            toast.error(

                error.response?.data?.message ||

                "Failed to update quantity"

            );

        }
        finally {

            setUpdatingProduct(null);

        }

    };


    // ==================================================
    // REMOVE ITEM
    // ==================================================

    const handleRemoveItem = async (
        item
    ) => {

        const productId =
            item.product?._id;


        if (!productId) {

            toast.error(
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


            // ==================================================
            // IMPORTANT
            // Cart changed, reset coupon.
            // ==================================================

            if (appliedCoupon) {

                resetCoupon();

                toast.info(
                    "Cart changed. Coupon removed."
                );

            }

        }
        catch (error) {

            console.error(
                "REMOVE ITEM ERROR:",
                error
            );


            toast.error(

                error.response?.data?.message ||

                "Failed to remove product"

            );

        }
        finally {

            setUpdatingProduct(null);

        }

    };


    // ==================================================
    // COUPON CALCULATIONS
    // ==================================================

    const discountedSubtotal =
        Math.max(

            subtotal -
            couponDiscount,

            0

        );


    const discountedGstAmount =
        Math.round(

            discountedSubtotal *
            gst /
            100

        );


    const grandTotal =
        discountedSubtotal +
        shippingCharge +
        discountedGstAmount;


    // ==================================================
    // APPLY COUPON
    // ==================================================

    const handleApplyCoupon = async () => {

        const code =
            couponCode
                .trim()
                .toUpperCase();


        // --------------------------------------------------
        // EMPTY CODE
        // --------------------------------------------------

        if (!code) {

            toast.error(
                "Please enter coupon code"
            );

            return;

        }


        // --------------------------------------------------
        // EMPTY CART
        // --------------------------------------------------

        if (subtotal <= 0) {

            toast.error(
                "Your cart is empty"
            );

            return;

        }


        try {

            setCouponLoading(true);


            console.log(
                "APPLYING COUPON:",
                {
                    code,
                    cartTotal: subtotal
                }
            );


            const res =
                await applyCoupon(

                    code,

                    subtotal

                );


            console.log(
                "APPLY COUPON RESPONSE:",
                res.data
            );


            // ==================================================
            // SUCCESS
            // ==================================================

            if (
                res.data?.success
            ) {

                const discount =
                    Number(
                        res.data?.discountAmount || 0
                    );


                const coupon =
                    res.data?.coupon;


                setAppliedCoupon(
                    coupon || null
                );


                setCouponCode(
                    coupon?.code ||
                    code
                );


                setCouponDiscount(
                    discount
                );


                toast.success(
                    "Coupon applied successfully"
                );


                return;

            }


            // ==================================================
            // UNEXPECTED RESPONSE
            // ==================================================

            resetCoupon();


            toast.error(
                res.data?.message ||
                "Unable to apply coupon"
            );

        }
        catch (error) {

            console.error(
                "APPLY COUPON ERROR:",
                error
            );


            resetCoupon();


            toast.error(

                error.response?.data?.message ||

                "Invalid or unavailable coupon"

            );

        }
        finally {

            setCouponLoading(false);

        }

    };


    // ==================================================
    // REMOVE COUPON
    // ==================================================

    const handleRemoveCoupon = () => {

        resetCoupon();


        toast.success(
            "Coupon removed"
        );

    };


    // ==================================================
    // PROCEED TO CHECKOUT
    // ==================================================

    const handleProceedCheckout = () => {

        // ==================================================
        // NO COUPON
        // ==================================================

        if (!appliedCoupon) {

            navigate(
                "/checkout"
            );

            return;

        }


        // ==================================================
        // WITH COUPON
        // ==================================================

        navigate(
            "/checkout",
            {

                state: {

                    coupon:
                        appliedCoupon,

                    couponCode:
                        appliedCoupon.code ||
                        couponCode,

                    couponDiscount:
                        couponDiscount

                }

            }

        );

    };


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (

            <div className="cart-page">

                <div className="cart-loading">

                    Loading Cart...

                </div>

            </div>

        );

    }


    // ==================================================
    // UI
    // ==================================================

    return (

        <div className="cart-page">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="cart-header">

                <h2>
                    Shopping Cart
                </h2>

                <p>
                    Review Your Selected Products
                </p>

            </div>


            {/* ==================================================
                EMPTY CART
            ================================================== */}

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


                    {/* ==================================================
                        CART TABLE
                    ================================================== */}

                    <div className="cart-table">


                        {/* --------------------------------------------------
                            HEADER
                        -------------------------------------------------- */}

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


                        {/* --------------------------------------------------
                            ITEMS
                        -------------------------------------------------- */}

                        {cartItems.map(
                            (
                                item,
                                index
                            ) => {

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


                                        {/* --------------------------------------------------
                                            PRODUCT
                                        -------------------------------------------------- */}

                                        <div className="cart-product">

                                            <img
                                                src={
                                                    product?.images?.length
                                                        ? (

                                                            product.images[0]?.url?.startsWith("http")

                                                                ? product.images[0].url

                                                                : `${BASE_URL}${product.images[0].url}`

                                                        )

                                                        : "/no-image.png"
                                                }

                                                alt={
                                                    product?.name ||
                                                    "Product"
                                                }

                                                onError={(
                                                    e
                                                ) => {

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


                                        {/* --------------------------------------------------
                                            PRICE
                                        -------------------------------------------------- */}

                                        <div className="cart-price">

                                            ₹ {price}

                                        </div>


                                        {/* --------------------------------------------------
                                            QUANTITY
                                        -------------------------------------------------- */}

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


                                        {/* --------------------------------------------------
                                            TOTAL
                                        -------------------------------------------------- */}

                                        <div className="cart-item-total">

                                            ₹ {itemTotal}

                                        </div>


                                        {/* --------------------------------------------------
                                            REMOVE
                                        -------------------------------------------------- */}

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


                    {/* ==================================================
                        SUMMARY
                    ================================================== */}

                    <div className="cart-summary">

                        <h3>
                            Order Summary
                        </h3>


                        {/* ==================================================
                            COUPON SECTION
                        ================================================== */}

                        <div className="coupon-section">

                            <h4>
                                Have a Coupon?
                            </h4>


                            {!appliedCoupon ? (

                                <div className="coupon-input-row">

                                    <input
                                        type="text"

                                        placeholder="Enter coupon code"

                                        value={
                                            couponCode
                                        }

                                        onChange={(
                                            e
                                        ) =>
                                            setCouponCode(
                                                e.target.value.toUpperCase()
                                            )
                                        }

                                        disabled={
                                            couponLoading
                                        }

                                    />


                                    <button
                                        type="button"

                                        onClick={
                                            handleApplyCoupon
                                        }

                                        disabled={
                                            couponLoading ||
                                            !couponCode.trim()
                                        }
                                    >

                                        {
                                            couponLoading
                                                ? "Applying..."
                                                : "Apply"
                                        }

                                    </button>

                                </div>

                            ) : (

                                <div className="applied-coupon">

                                    <div>

                                        <strong>

                                            {
                                                appliedCoupon.code
                                            }

                                        </strong>


                                        <p>
                                            Coupon applied
                                        </p>

                                    </div>


                                    <button
                                        type="button"

                                        onClick={
                                            handleRemoveCoupon
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            )}

                        </div>


                        {/* ==================================================
                            SUBTOTAL
                        ================================================== */}

                        <div className="summary-row">

                            <span>
                                Subtotal
                            </span>

                            <span>
                                ₹ {subtotal}
                            </span>

                        </div>


                        {/* ==================================================
                            COUPON DISCOUNT
                        ================================================== */}

                        {couponDiscount > 0 && (

                            <div className="summary-row">

                                <span>
                                    Coupon Discount
                                </span>

                                <span>
                                    - ₹ {couponDiscount}
                                </span>

                            </div>

                        )}


                        {/* ==================================================
                            SHIPPING
                        ================================================== */}

                        <div className="summary-row">

                            <span>
                                Shipping
                            </span>

                            <span>
                                ₹ {shippingCharge}
                            </span>

                        </div>


                        {/* ==================================================
                            GST
                        ================================================== */}

                        <div className="summary-row">

                            <span>
                                GST ({gst}%)
                            </span>

                            <span>
                                ₹ {discountedGstAmount}
                            </span>

                        </div>


                        <hr />


                        {/* ==================================================
                            GRAND TOTAL
                        ================================================== */}

                        <div className="summary-total">

                            <span>
                                Grand Total
                            </span>

                            <span>
                                ₹ {grandTotal}
                            </span>

                        </div>


                        {/* ==================================================
                            CHECKOUT
                        ================================================== */}

                        <button
                            type="button"

                            className="checkout-btn"

                            onClick={
                                handleProceedCheckout
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