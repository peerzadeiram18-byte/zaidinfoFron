import React, { useEffect, useState } from "react";

import "./Cart.css";

import { Link } from "react-router-dom";

const Cart = () => {

    const [cartItems, setCartItems] = useState([]);

    const [subtotal, setSubtotal] = useState(0);

    const shippingCharge = 100;

    const gst = 18;

    useEffect(() => {

    const items = JSON.parse(

        localStorage.getItem("cart")

    ) || [];

    setCartItems(items);

}, []);

useEffect(() => {

    let total = 0;

    cartItems.forEach((item) => {

        total += item.sellingPrice * item.quantity;

    });

    setSubtotal(total);

}, [cartItems]);


const updateQuantity = (index, change) => {

    const updatedCart = [...cartItems];

    const newQty = updatedCart[index].quantity + change;

    if (newQty < 1) return;

    updatedCart[index].quantity = newQty;

    setCartItems(updatedCart);

    localStorage.setItem(

        "cart",

        JSON.stringify(updatedCart)

    );

};

const removeItem = (index) => {

    const updatedCart = [...cartItems];

    updatedCart.splice(index, 1);

    setCartItems(updatedCart);

    localStorage.setItem(

        "cart",

        JSON.stringify(updatedCart)

    );

};


return (

<div className="cart-page">

<div className="cart-header">

<h2>

Shopping Cart

</h2>

<p>

Review Your Selected Products

</p>

</div>

{

cartItems.length === 0 ?

(

<div className="empty-cart">

<h3>

Your Cart Is Empty

</h3>

<Link

to="/shop"

className="continue-shopping"

>

Continue Shopping

</Link>

</div>

)

:

(

<>

<div className="cart-table">

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

{

cartItems.map(

(item,index)=>(

<div

className="cart-row"

key={index}

>

<div className="cart-product">

<img

src={

item.images?.length

?

item.images[0]

:

"/no-image.png"

}

alt={item.name}

/>

<div>

<h4>

{item.name}

</h4>

<p>

{item.brand?.name}

</p>

</div>

</div>

<div>

₹ {item.sellingPrice}

</div>

<div className="cart-quantity">

    <button

        type="button"

        onClick={() => updateQuantity(index, -1)}

    >

        -

    </button>

    <span>

        {item.quantity}

    </span>

    <button

        type="button"

        onClick={() => updateQuantity(index, 1)}

    >

        +

    </button>

</div>

<div>

    ₹ {item.sellingPrice * item.quantity}

</div>

<div>

    <button

        className="remove-btn"

        onClick={() => removeItem(index)}

    >

        Remove

    </button>

</div>

</div>

))

}

</div>

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

₹ {Math.round(subtotal * gst / 100)}

</span>

</div>

<hr />

<div className="summary-total">

<span>

Grand Total

</span>

<span>

₹ {

subtotal +

shippingCharge +

Math.round(subtotal * gst / 100)

}

</span>

</div>

<button

className="checkout-btn"

>

Proceed To Checkout

</button>

</div>

</>

)

}

</div>

);

};

export default Cart;