// import React, { useState } from "react";
// import "./NewWalkInOrder.css";

// const NewWalkInOrder = () => {
//     // =====================================
//     // CUSTOMER
//     // =====================================

//     const [customer, setCustomer] = useState({
//         name: "",
//         phone: "",
//         email: "",
//     });

//     // =====================================
//     // PRODUCT SEARCH
//     // =====================================

//     const [productSearch, setProductSearch] = useState("");

//     // =====================================
//     // CART
//     // =====================================

//     const [cart, setCart] = useState([]);

//     // =====================================
//     // PAYMENT
//     // =====================================

//     const [paymentMethod, setPaymentMethod] = useState("CASH");

//     // =====================================
//     // DISCOUNT
//     // =====================================

//     const [discount, setDiscount] = useState(0);

//     // =====================================
//     // DEMO PRODUCTS
//     // Later API se aayenge
//     // =====================================

//     const products = [
//         {
//             id: "1",
//             name: "Laptop",
//             sku: "LAP001",
//             price: 50000,
//             stock: 10,
//         },
//         {
//             id: "2",
//             name: "Keyboard",
//             sku: "KEY001",
//             price: 1500,
//             stock: 20,
//         },
//         {
//             id: "3",
//             name: "Mouse",
//             sku: "MOU001",
//             price: 800,
//             stock: 30,
//         },
//         {
//             id: "4",
//             name: "Monitor",
//             sku: "MON001",
//             price: 12000,
//             stock: 8,
//         },
//     ];

//     // =====================================
//     // FILTER PRODUCTS
//     // =====================================

//     const filteredProducts = products.filter((product) => {
//         const search = productSearch.toLowerCase().trim();

//         return (
//             product.name.toLowerCase().includes(search) ||
//             product.sku.toLowerCase().includes(search)
//         );
//     });

//     // =====================================
//     // ADD PRODUCT TO CART
//     // =====================================

//     const addToCart = (product) => {
//         const existingProduct = cart.find(
//             (item) => item.id === product.id
//         );

//         if (existingProduct) {
//             if (existingProduct.quantity >= product.stock) {
//                 alert("Product stock limit reached");
//                 return;
//             }

//             setCart(
//                 cart.map((item) =>
//                     item.id === product.id
//                         ? {
//                               ...item,
//                               quantity: item.quantity + 1,
//                           }
//                         : item
//                 )
//             );

//             return;
//         }

//         setCart([
//             ...cart,
//             {
//                 ...product,
//                 quantity: 1,
//             },
//         ]);
//     };

//     // =====================================
//     // INCREASE QUANTITY
//     // =====================================

//     const increaseQuantity = (id) => {
//         setCart(
//             cart.map((item) => {
//                 if (item.id === id) {
//                     if (item.quantity >= item.stock) {
//                         alert("Maximum available stock reached");
//                         return item;
//                     }

//                     return {
//                         ...item,
//                         quantity: item.quantity + 1,
//                     };
//                 }

//                 return item;
//             })
//         );
//     };

//     // =====================================
//     // DECREASE QUANTITY
//     // =====================================

//     const decreaseQuantity = (id) => {
//         setCart(
//             cart
//                 .map((item) => {
//                     if (item.id === id) {
//                         return {
//                             ...item,
//                             quantity: item.quantity - 1,
//                         };
//                     }

//                     return item;
//                 })
//                 .filter((item) => item.quantity > 0)
//         );
//     };

//     // =====================================
//     // REMOVE PRODUCT
//     // =====================================

//     const removeProduct = (id) => {
//         setCart(cart.filter((item) => item.id !== id));
//     };

//     // =====================================
//     // SUBTOTAL
//     // =====================================

//     const subtotal = cart.reduce((total, item) => {
//         return total + item.price * item.quantity;
//     }, 0);

//     // =====================================
//     // DISCOUNT VALUE
//     // =====================================

//     const discountAmount = Math.max(
//         Number(discount) || 0,
//         0
//     );

//     // =====================================
//     // FINAL TOTAL
//     // =====================================

//     const totalAmount = Math.max(
//         subtotal - discountAmount,
//         0
//     );

//     // =====================================
//     // RESET ORDER
//     // =====================================

//     const clearOrder = () => {
//         setCustomer({
//             name: "",
//             phone: "",
//             email: "",
//         });

//         setProductSearch("");
//         setCart([]);
//         setDiscount(0);
//         setPaymentMethod("CASH");
//     };

//     // =====================================
//     // CREATE WALK-IN ORDER
//     // =====================================

//     const handleCompleteOrder = () => {
//         if (!customer.name.trim()) {
//             alert("Please enter customer name");
//             return;
//         }

//         if (!customer.phone.trim()) {
//             alert("Please enter customer phone");
//             return;
//         }

//         if (cart.length === 0) {
//             alert("Please add at least one product");
//             return;
//         }

//         const orderData = {
//             customer,
//             items: cart,
//             subtotal,
//             discount: discountAmount,
//             totalAmount,
//             paymentMethod,
//             orderType: "WALK_IN",
//         };

//         console.log("WALK-IN ORDER:", orderData);

//         alert("Walk-in order created successfully!");

//         clearOrder();
//     };

//     return (
//         <div className="walkin-page">

//             {/* =================================
//                 HEADER
//             ================================= */}

//             <div className="walkin-header">

//                 <div>
//                     <h1>New Walk-in Order</h1>

//                     <p>Receptionist POS</p>
//                 </div>

//                 <div className="walkin-order-type">
//                     WALK-IN / POS
//                 </div>

//             </div>

//             {/* =================================
//                 MAIN CONTENT
//             ================================= */}

//             <div className="walkin-layout">

//                 {/* =================================
//                     LEFT SIDE
//                 ================================= */}

//                 <div className="walkin-left">

//                     {/* CUSTOMER SECTION */}

//                     <div className="walkin-card">

//                         <div className="walkin-card-title">

//                             <h2>Customer Details</h2>

//                         </div>

//                         <div className="customer-grid">

//                             {/* NAME */}

//                             <div className="walkin-input-group">

//                                 <label>
//                                     Customer Name
//                                 </label>

//                                 <input
//                                     type="text"
//                                     placeholder="Enter customer name"
//                                     value={customer.name}
//                                     onChange={(e) =>
//                                         setCustomer({
//                                             ...customer,
//                                             name: e.target.value,
//                                         })
//                                     }
//                                 />

//                             </div>

//                             {/* PHONE */}

//                             <div className="walkin-input-group">

//                                 <label>
//                                     Phone Number
//                                 </label>

//                                 <input
//                                     type="text"
//                                     placeholder="Enter phone number"
//                                     value={customer.phone}
//                                     onChange={(e) =>
//                                         setCustomer({
//                                             ...customer,
//                                             phone: e.target.value,
//                                         })
//                                     }
//                                 />

//                             </div>

//                             {/* EMAIL */}

//                             <div className="walkin-input-group">

//                                 <label>
//                                     Email
//                                 </label>

//                                 <input
//                                     type="email"
//                                     placeholder="Enter email"
//                                     value={customer.email}
//                                     onChange={(e) =>
//                                         setCustomer({
//                                             ...customer,
//                                             email: e.target.value,
//                                         })
//                                     }
//                                 />

//                             </div>

//                         </div>

//                         <button
//                             className="new-customer-btn"
//                             type="button"
//                             onClick={() =>
//                                 setCustomer({
//                                     name: "",
//                                     phone: "",
//                                     email: "",
//                                 })
//                             }
//                         >
//                             + New Customer
//                         </button>

//                     </div>

//                     {/* =================================
//                         PRODUCT SEARCH
//                     ================================= */}

//                     <div className="walkin-card">

//                         <div className="walkin-card-title">

//                             <h2>Product Search</h2>

//                         </div>

//                         <div className="product-search-box">

//                             <input
//                                 type="text"
//                                 placeholder="Search product by name or SKU..."
//                                 value={productSearch}
//                                 onChange={(e) =>
//                                     setProductSearch(
//                                         e.target.value
//                                     )
//                                 }
//                             />

//                         </div>

//                         <div className="product-list">

//                             {filteredProducts.length === 0 ? (

//                                 <div className="no-products">
//                                     No products found
//                                 </div>

//                             ) : (

//                                 filteredProducts.map(
//                                     (product) => (

//                                         <div
//                                             className="product-row"
//                                             key={product.id}
//                                         >

//                                             <div className="product-info">

//                                                 <h3>
//                                                     {product.name}
//                                                 </h3>

//                                                 <p>
//                                                     SKU: {product.sku}
//                                                 </p>

//                                             </div>

//                                             <div className="product-stock">

//                                                 Stock:{" "}
//                                                 {product.stock}

//                                             </div>

//                                             <div className="product-price">

//                                                 ₹{" "}
//                                                 {product.price.toLocaleString(
//                                                     "en-IN"
//                                                 )}

//                                             </div>

//                                             <button
//                                                 className="add-product-btn"
//                                                 type="button"
//                                                 onClick={() =>
//                                                     addToCart(product)
//                                                 }
//                                             >
//                                                 + Add
//                                             </button>

//                                         </div>

//                                     )
//                                 )

//                             )}

//                         </div>

//                     </div>

//                     {/* =================================
//                         CART
//                     ================================= */}

//                     <div className="walkin-card">

//                         <div className="walkin-card-title">

//                             <h2>Order Items</h2>

//                             <span>
//                                 {cart.length} Products
//                             </span>

//                         </div>

//                         {cart.length === 0 ? (

//                             <div className="empty-cart">

//                                 <h3>
//                                     Cart is empty
//                                 </h3>

//                                 <p>
//                                     Search and add products above
//                                 </p>

//                             </div>

//                         ) : (

//                             <div className="cart-table">

//                                 <div className="cart-header">

//                                     <span>Product</span>

//                                     <span>Price</span>

//                                     <span>Quantity</span>

//                                     <span>Total</span>

//                                     <span>Action</span>

//                                 </div>

//                                 {cart.map((item) => (

//                                     <div
//                                         className="cart-row"
//                                         key={item.id}
//                                     >

//                                         <div className="cart-product-name">

//                                             <strong>
//                                                 {item.name}
//                                             </strong>

//                                             <small>
//                                                 {item.sku}
//                                             </small>

//                                         </div>

//                                         <div>

//                                             ₹{" "}
//                                             {item.price.toLocaleString(
//                                                 "en-IN"
//                                             )}

//                                         </div>

//                                         <div className="quantity-control">

//                                             <button
//                                                 type="button"
//                                                 onClick={() =>
//                                                     decreaseQuantity(
//                                                         item.id
//                                                     )
//                                                 }
//                                             >
//                                                 -
//                                             </button>

//                                             <span>
//                                                 {item.quantity}
//                                             </span>

//                                             <button
//                                                 type="button"
//                                                 onClick={() =>
//                                                     increaseQuantity(
//                                                         item.id
//                                                     )
//                                                 }
//                                             >
//                                                 +
//                                             </button>

//                                         </div>

//                                         <div>

//                                             ₹{" "}
//                                             {(
//                                                 item.price *
//                                                 item.quantity
//                                             ).toLocaleString(
//                                                 "en-IN"
//                                             )}

//                                         </div>

//                                         <button
//                                             className="remove-btn"
//                                             type="button"
//                                             onClick={() =>
//                                                 removeProduct(
//                                                     item.id
//                                                 )
//                                             }
//                                         >
//                                             Remove
//                                         </button>

//                                     </div>

//                                 ))}

//                             </div>

//                         )}

//                     </div>

//                 </div>

//                 {/* =================================
//                     RIGHT SIDE
//                 ================================= */}

//                 <div className="walkin-right">

//                     {/* ORDER SUMMARY */}

//                     <div className="walkin-card summary-card">

//                         <h2>
//                             Order Summary
//                         </h2>

//                         <div className="summary-line">

//                             <span>
//                                 Subtotal
//                             </span>

//                             <strong>
//                                 ₹{" "}
//                                 {subtotal.toLocaleString(
//                                     "en-IN"
//                                 )}
//                             </strong>

//                         </div>

//                         <div className="discount-box">

//                             <label>
//                                 Discount
//                             </label>

//                             <input
//                                 type="number"
//                                 min="0"
//                                 max={subtotal}
//                                 value={discount}
//                                 onChange={(e) =>
//                                     setDiscount(
//                                         e.target.value
//                                     )
//                                 }
//                             />

//                         </div>

//                         <div className="summary-line">

//                             <span>
//                                 Discount
//                             </span>

//                             <strong>
//                                 - ₹{" "}
//                                 {discountAmount.toLocaleString(
//                                     "en-IN"
//                                 )}
//                             </strong>

//                         </div>

//                         <div className="summary-total">

//                             <span>
//                                 Total
//                             </span>

//                             <strong>
//                                 ₹{" "}
//                                 {totalAmount.toLocaleString(
//                                     "en-IN"
//                                 )}
//                             </strong>

//                         </div>

//                     </div>

//                     {/* PAYMENT METHOD */}

//                     <div className="walkin-card">

//                         <h2>
//                             Payment Method
//                         </h2>

//                         <div className="payment-methods">

//                             <button
//                                 type="button"
//                                 className={
//                                     paymentMethod === "CASH"
//                                         ? "payment-method active"
//                                         : "payment-method"
//                                 }
//                                 onClick={() =>
//                                     setPaymentMethod(
//                                         "CASH"
//                                     )
//                                 }
//                             >
//                                 💵 Cash
//                             </button>

//                             <button
//                                 type="button"
//                                 className={
//                                     paymentMethod === "UPI"
//                                         ? "payment-method active"
//                                         : "payment-method"
//                                 }
//                                 onClick={() =>
//                                     setPaymentMethod(
//                                         "UPI"
//                                     )
//                                 }
//                             >
//                                 📱 UPI
//                             </button>

//                             <button
//                                 type="button"
//                                 className={
//                                     paymentMethod === "CARD"
//                                         ? "payment-method active"
//                                         : "payment-method"
//                                 }
//                                 onClick={() =>
//                                     setPaymentMethod(
//                                         "CARD"
//                                     )
//                                 }
//                             >
//                                 💳 Card
//                             </button>

//                         </div>

//                     </div>

//                     {/* COMPLETE ORDER */}

//                     <div className="walkin-card complete-card">

//                         <button
//                             className="complete-order-btn"
//                             type="button"
//                             onClick={
//                                 handleCompleteOrder
//                             }
//                         >
//                             Complete Order
//                         </button>

//                         <button
//                             className="cancel-order-btn"
//                             type="button"
//                             onClick={clearOrder}
//                         >
//                             Clear Order
//                         </button>

//                     </div>

//                 </div>

//             </div>

//         </div>
//     );
// };

// export default NewWalkInOrder;


import { useEffect, useState } from "react";
import "./NewWalkInOrder.css";

import {
    getProducts,
    createWalkInOrder
} from "../../../../services/walkInOrderService";
import WalkInInvoice from "../WalkInInvoice/WalkInInvoice";
import { toast } from "react-toastify";


function NewWalkInOrder() {

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState("");

    const [customer, setCustomer] = useState({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        landmark: ""
    });

    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [invoiceData, setInvoiceData] = useState(null);
    useEffect(() => {
        loadProducts();
    }, []);

  const loadProducts = async () => {

    try {

        const data = await getProducts();

        setProducts(data);

        setFilteredProducts(data);

    }

    catch (err) {

        console.log(err);

    }

};
    useEffect(() => {

        if (!search) {

            setFilteredProducts(products);

            return;

        }

        const value = search.toLowerCase();

        setFilteredProducts(

            products.filter((p) =>
                p.name.toLowerCase().includes(value) ||
                p.sku.toLowerCase().includes(value)
            )

        );

    }, [search, products]);

    const addProduct = (product) => {

        const exists = cart.find(

            item => item.product === product._id

        );

        if (exists) {

            setCart(

                cart.map(item =>
                    item.product === product._id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                )

            );

        } else {

            setCart([

                ...cart,

                {

                    product: product._id,

                    title: product.name,

                    quantity: 1,

                    originalPrice: product.pricing.sellingPrice,

                    price: product.pricing.sellingPrice,

                    discountAmount: 0,

                    imageUrl:
                        product.images?.[0]?.url || ""

                }

            ]);

        }

    };

    const increaseQty = (id) => {

        setCart(

            cart.map(item =>
                item.product === id
                    ? {
                        ...item,
                        quantity: item.quantity + 1
                    }
                    : item
            )

        );

    };

    const decreaseQty = (id) => {

        setCart(

            cart.map(item =>
                item.product === id
                    ? {
                        ...item,
                        quantity: item.quantity - 1
                    }
                    : item
            ).filter(item => item.quantity > 0)

        );

    };

    const removeItem = (id) => {

        setCart(

            cart.filter(

                item => item.product !== id

            )

        );

    };

    const total = cart.reduce(

        (sum, item) =>

            sum + item.price * item.quantity,

        0

    );

        // ============================================
    // CUSTOMER INPUT
    // ============================================

    const handleCustomerChange = (e) => {

        setCustomer({

            ...customer,

            [e.target.name]: e.target.value

        });

    };

    // ============================================
    // CREATE WALK-IN ORDER
    // ============================================

  const placeOrder = async () => {

    if (cart.length === 0) {

        toast.error("Please add at least one product");
        return;

    }


    if (!customer.fullName || !customer.phone) {

        toast.error("Customer Name and Phone are required");
        return;

    }


    const orderData = {


        orderItems: cart.map(item => ({

            product: item.product,

            title: item.title,

            quantity: Number(item.quantity),

            originalPrice: Number(item.originalPrice),

            price: Number(item.price),

            discountAmount: Number(item.discountAmount || 0),

            imageUrl: item.imageUrl || ""

        })),



        shippingAddress: {

            fullName: customer.fullName,

            phone: customer.phone,

            addressLine:
                customer.addressLine || "Walk In Customer",

            city: customer.city,

            state: customer.state,

            pincode: customer.pincode,

            country: "India",

            landmark: customer.landmark || ""

        },


        totalAmount: Number(total),


        paymentMethod: paymentMethod,


        orderSource: "WALK_IN"


    };



    try {


        const res = await createWalkInOrder(orderData);


        setInvoiceData(res.order);



       toast.success(
            "Walk-In Order Created Successfully"
        );


        setCart([]);



        setCustomer({

            fullName: "",

            phone: "",

            addressLine: "",

            city: "",

            state: "",

            pincode: "",

            country: "India",

            landmark: ""

        });



    }

    catch(err){


        console.log(err);


        toast.error(

            err.response?.data?.message ||

            "Unable to create order"

        );


    }


};

    // ============================================
    // JSX
    // ============================================

    return (

        <div className="walkin-page">

            <div className="left-side">

                <h2>

                    Product Search

                </h2>

                <input

                    type="text"

                    placeholder="Search product by Name or SKU..."

                    value={search}

                    onChange={(e)=>setSearch(e.target.value)}

                    className="search-box"

                />

                <div className="product-list">

                    {

                        filteredProducts.map(product=>(

                            <div

                                key={product._id}

                                className="product-card"

                            >

                                <img

                                    src={

                                        product.images?.length

                                        ?

                                        product.images[0].url

                                        :

                                        "/no-image.png"

                                    }

                                    alt={product.name}

                                />

                                <h4>

                                    {product.name}

                                </h4>

                                <p>

                                    SKU :

                                    {product.sku}

                                </p>

                                <p>

                                    Stock :

                                    {

                                        product.inventory?.currentStock ??

                                        0

                                    }

                                </p>

                                <h3>

                                    ₹

                                    {

                                        product.pricing?.sellingPrice

                                    }

                                </h3>

                                <button

                                    onClick={()=>addProduct(product)}

                                >

                                    + Add

                                </button>

                            </div>

                        ))

                    }

                </div>

            </div>

                        <div className="right-side">

                <h2>Cart</h2>

                {
                    cart.length === 0 ? (

                        <p>No Product Added</p>

                    ) : (

                        cart.map(item => (

                            <div
                                className="cart-item"
                                key={item.product}
                            >

                                <div>

                                    <h4>{item.title}</h4>

                                    <p>

                                        ₹ {item.price}

                                    </p>

                                </div>

                                <div className="qty-box">

                                    <button

                                        onClick={() => decreaseQty(item.product)}

                                    >

                                        -

                                    </button>

                                    <span>

                                        {item.quantity}

                                    </span>

                                    <button

                                        onClick={() => increaseQty(item.product)}

                                    >

                                        +

                                    </button>

                                </div>

                                <button

                                    className="remove-btn"

                                    onClick={() => removeItem(item.product)}

                                >

                                    Remove

                                </button>

                            </div>

                        ))

                    )
                }

                <hr />

                <h3>

                    Grand Total : ₹ {total}

                </h3>

                <hr />

                <h2>

                    Customer Details

                </h2>

                <input

                    type="text"

                    name="fullName"

                    placeholder="Customer Name"

                    value={customer.fullName}

                    onChange={handleCustomerChange}

                />

                <input

                    type="text"

                    name="phone"

                    placeholder="Phone Number"

                    value={customer.phone}

                    onChange={handleCustomerChange}

                />

                <input

                    type="text"

                    name="addressLine"

                    placeholder="Address"

                    value={customer.addressLine}

                    onChange={handleCustomerChange}

                />

                <input

                    type="text"

                    name="city"

                    placeholder="City"

                    value={customer.city}

                    onChange={handleCustomerChange}

                />

                <input

                    type="text"

                    name="state"

                    placeholder="State"

                    value={customer.state}

                    onChange={handleCustomerChange}

                />

                <input

                    type="text"

                    name="pincode"

                    placeholder="Pincode"

                    value={customer.pincode}

                    onChange={handleCustomerChange}

                />

                <select

                    value={paymentMethod}

                    onChange={(e)=>setPaymentMethod(e.target.value)}

                >

                    <option value="CASH">

                        Cash

                    </option>

                    <option value="CARD">

                        Card

                    </option>

                    <option value="UPI">

                        UPI

                    </option>

                </select>

                <button

                    className="place-order-btn"

                    onClick={placeOrder}

                >

                    Create Walk-In Order

                </button>

            </div>

        </div>

    );
 {invoiceData && (
            <WalkInInvoice
                order={invoiceData}
                onClose={() => setInvoiceData(null)}
            />
        )}
    

}


export default NewWalkInOrder;