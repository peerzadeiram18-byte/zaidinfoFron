// import React from "react";
// import "./WalkInInvoice.css";

// function WalkInInvoice({ order, onClose }) {

//     if (!order) return null;

//     const printInvoice = () => {
//         window.print();
//     };

//     const customer = order.shippingAddress || {};

//     const items = order.orderItems || [];

//     return (

//         <div className="invoice-overlay">

//             <div className="invoice-container">

//                 {/* HEADER */}

//                 <div className="invoice-header">

//                     <h1>Zaid Infotech</h1>

//                     <p>
//                         Sales & Service Center
//                     </p>

//                     <p>
//                         Srinagar, Jammu & Kashmir
//                     </p>

//                     <p>
//                         Phone : +91 XXXXX XXXXX
//                     </p>

//                     <h2>
//                         WALK-IN TAX INVOICE
//                     </h2>

//                 </div>

//                 <hr />

//                 {/* ORDER DETAILS */}

//                 <div className="invoice-top">

//                     <div>

//                         <h4>Invoice No</h4>

//                         <p>

//                             {order._id}

//                         </p>

//                     </div>

//                     <div>

//                         <h4>Date</h4>

//                         <p>

//                             {

//                                 new Date(

//                                     order.createdAt

//                                 ).toLocaleString()

//                             }

//                         </p>

//                     </div>

//                 </div>

//                 <hr />

//                 {/* CUSTOMER */}

//                 <div className="customer-box">

//                     <h3>

//                         Customer Details

//                     </h3>

//                     <p>

//                         <strong>Name :</strong>

//                         {customer.fullName}

//                     </p>

//                     <p>

//                         <strong>Phone :</strong>

//                         {customer.phone}

//                     </p>

//                     <p>

//                         <strong>Address :</strong>

//                         {customer.addressLine}

//                     </p>

//                     <p>

//                         {customer.city},

//                         {customer.state}

//                     </p>

//                 </div>

//                 <hr />

//                 {/* PRODUCT TABLE */}

//                 <table className="invoice-table">

//                     <thead>

//                         <tr>

//                             <th>#</th>

//                             <th>Product</th>

//                             <th>Qty</th>

//                             <th>Price</th>

//                             <th>Total</th>

//                         </tr>

//                     </thead>

//                     <tbody>

//                         {

//                             items.map(

//                                 (

//                                     item,

//                                     index

//                                 ) => (

//                                     <tr key={index}>

//                                         <td>

//                                             {index + 1}

//                                         </td>

//                                         <td>

//                                             {item.title}

//                                         </td>

//                                         <td>

//                                             {item.quantity}

//                                         </td>

//                                         <td>

//                                             ₹ {item.price}

//                                         </td>

//                                         <td>

//                                             ₹ {

//                                                 item.price *

//                                                 item.quantity

//                                             }

//                                         </td>

//                                     </tr>

//                                 )

//                             )

//                         }

//                     </tbody>

//                 </table>

//                 <hr />

//                                 {/* TOTAL SECTION */}

//                 <div className="invoice-total">

//                     <div className="total-row">

//                         <span>Subtotal</span>

//                         <span>

//                             ₹ {order.totalAmount?.toFixed(2)}

//                         </span>

//                     </div>

//                     <div className="total-row">

//                         <span>Discount</span>

//                         <span>

//                             ₹ 0.00

//                         </span>

//                     </div>

//                     <div className="total-row">

//                         <span>GST</span>

//                         <span>

//                             Included

//                         </span>

//                     </div>

//                     <hr />

//                     <div className="grand-total">

//                         <strong>

//                             Grand Total

//                         </strong>

//                         <strong>

//                             ₹ {order.totalAmount?.toFixed(2)}

//                         </strong>

//                     </div>

//                 </div>

//                 <hr />

//                 {/* PAYMENT DETAILS */}

//                 <div className="payment-box">

//                     <p>

//                         <strong>

//                             Payment Method :

//                         </strong>

//                         {

//                             order.paymentMethod ||

//                             "CASH"

//                         }

//                     </p>

//                     <p>

//                         <strong>

//                             Payment Status :

//                         </strong>

//                         {

//                             order.paymentStatus ||

//                             "PAID"

//                         }

//                     </p>

//                     <p>

//                         <strong>

//                             Order Source :

//                         </strong>

//                         {

//                             order.orderSource ||

//                             "WALK_IN"

//                         }

//                     </p>

//                 </div>

//                 <hr />

//                 {/* FOOTER */}

//                 <div className="invoice-footer">

//                     <p>

//                         Thank You For Shopping With Us

//                     </p>

//                     <p>

//                         Zaid Infotech

//                     </p>

//                     <br />

//                     <div className="signature">

//                         ______________________

//                         <br />

//                         Authorized Signature

//                     </div>

//                 </div>

//                 {/* BUTTONS */}

//                 <div className="invoice-buttons">

//                     <button

//                         className="print-btn"

//                         onClick={printInvoice}

//                     >

//                         Print Invoice

//                     </button>

//                     <button

//                         className="close-btn"

//                         onClick={onClose}

//                     >

//                         Close

//                     </button>

//                 </div>

//             </div>

//         </div>

//     );

// }

// export default WalkInInvoice;


import React from "react";
import "./WalkInInvoice.css";

function WalkInInvoice({ order, onClose }) {

    if (!order) return null;

    const printInvoice = () => {
        window.print();
    };

    const customer = order.shippingAddress || {};

    const items = order.orderItems || [];

    return (

        <div className="invoice-overlay">

            <div className="invoice-container">

                {/* HEADER */}

                <div className="invoice-header">

                    <h1>Zaid Infotech</h1>

                    <p>
                        Sales & Service Center
                    </p>

                    <p>
                        Srinagar, Jammu & Kashmir
                    </p>

                    <p>
                        Phone : +91 XXXXX XXXXX
                    </p>

                    <h2>
                        WALK-IN TAX INVOICE
                    </h2>

                </div>

                <hr />

                {/* ORDER DETAILS */}

                <div className="invoice-top">

                    <div>

                        <h4>Invoice No</h4>

                        <p>

                            {order._id}

                        </p>

                    </div>

                    <div>

                        <h4>Date</h4>

                        <p>

                            {

                                new Date(

                                    order.createdAt

                                ).toLocaleString()

                            }

                        </p>

                    </div>

                </div>

                <hr />

                {/* CUSTOMER */}

                <div className="customer-box">

                    <h3>

                        Customer Details

                    </h3>

                    <p>

                        <strong>Name :</strong>

                        {customer.fullName}

                    </p>

                    <p>

                        <strong>Phone :</strong>

                        {customer.phone}

                    </p>

                    <p>

                        <strong>Address :</strong>

                        {customer.addressLine}

                    </p>

                    <p>

                        {customer.city},

                        {customer.state}

                    </p>

                </div>

                <hr />

                {/* PRODUCT TABLE */}

                <table className="invoice-table">

                    <thead>

                        <tr>

                            <th>#</th>

                            <th>Product</th>

                            <th>Qty</th>

                            <th>Price</th>

                            <th>Total</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            items.map(

                                (

                                    item,

                                    index

                                ) => (

                                    <tr key={index}>

                                        <td>

                                            {index + 1}

                                        </td>

                                        <td>

                                            {item.title}

                                        </td>

                                        <td>

                                            {item.quantity}

                                        </td>

                                        <td>

                                            ₹ {item.price}

                                        </td>

                                        <td>

                                            ₹ {

                                                item.price *

                                                item.quantity

                                            }

                                        </td>

                                    </tr>

                                )

                            )

                        }

                    </tbody>

                </table>

                <hr />

                                {/* TOTAL SECTION */}

                <div className="invoice-total">

                    <div className="total-row">

                        <span>Subtotal</span>

                        <span>

                            ₹ {order.totalAmount?.toFixed(2)}

                        </span>

                    </div>

                    <div className="total-row">

                        <span>Discount</span>

                        <span>

                            ₹ 0.00

                        </span>

                    </div>

                    <div className="total-row">

                        <span>GST</span>

                        <span>

                            Included

                        </span>

                    </div>

                    <hr />

                    <div className="grand-total">

                        <strong>

                            Grand Total

                        </strong>

                        <strong>

                            ₹ {order.totalAmount?.toFixed(2)}

                        </strong>

                    </div>

                </div>

                <hr />

                {/* PAYMENT DETAILS */}

                <div className="payment-box">

                    <p>

                        <strong>

                            Payment Method :

                        </strong>

                        {

                            order.paymentMethod ||

                            "CASH"

                        }

                    </p>

                    <p>

                        <strong>

                            Payment Status :

                        </strong>

                        {

                            order.paymentStatus ||

                            "PAID"

                        }

                    </p>

                    <p>

                        <strong>

                            Order Source :

                        </strong>

                        {

                            order.orderSource ||

                            "WALK_IN"

                        }

                    </p>

                </div>

                <hr />

                {/* FOOTER */}

                <div className="invoice-footer">

                    <p>

                        Thank You For Shopping With Us

                    </p>

                    <p>

                        Zaid Infotech

                    </p>

                    <br />

                    <div className="signature">

                        ______________________

                        <br />

                        Authorized Signature

                    </div>

                </div>

                {/* BUTTONS */}

                <div className="invoice-buttons">

                    <button

                        className="print-btn"

                        onClick={printInvoice}

                    >

                        Print Invoice

                    </button>

                    <button

                        className="close-btn"

                        onClick={onClose}

                    >

                        Close

                    </button>

                </div>

            </div>

        </div>

    );

}

export default WalkInInvoice;