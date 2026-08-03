// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import "./WalkInOrders.css";

// const WalkInOrders = () => {
//     const navigate = useNavigate();

//     const [search, setSearch] = useState("");

//     // =====================================
//     // DEMO ORDERS
//     // Later API se aayenge
//     // =====================================

//     const [orders] = useState([
//         {
//             id: "WO001",
//             customerName: "Rahul Sharma",
//             phone: "9876543210",
//             items: 2,
//             amount: 51500,
//             paymentMethod: "CASH",
//             status: "COMPLETED",
//             date: "Today",
//         },
//         {
//             id: "WO002",
//             customerName: "Amit Patil",
//             phone: "9876543211",
//             items: 1,
//             amount: 1500,
//             paymentMethod: "UPI",
//             status: "COMPLETED",
//             date: "Today",
//         },
//         {
//             id: "WO003",
//             customerName: "Priya Jagtap",
//             phone: "9876543212",
//             items: 3,
//             amount: 12800,
//             paymentMethod: "CARD",
//             status: "PENDING",
//             date: "Today",
//         },
//     ]);

//     // =====================================
//     // SEARCH
//     // =====================================

//     const filteredOrders = orders.filter((order) => {
//         const searchValue = search.toLowerCase().trim();

//         return (
//             order.id.toLowerCase().includes(searchValue) ||
//             order.customerName
//                 .toLowerCase()
//                 .includes(searchValue) ||
//             order.phone.includes(searchValue)
//         );
//     });

//     // =====================================
//     // NEW ORDER
//     // =====================================

//     const handleNewOrder = () => {
//         navigate("/receptionist/walk-in-order/new");
//     };

//     return (
//         <div className="walkin-orders-page">

//             {/* =====================================
//                 HEADER
//             ===================================== */}

//             <div className="walkin-orders-header">

//                 <div>
//                     <h1>
//                         Walk-in Orders
//                     </h1>

//                     <p>
//                         View and manage receptionist POS orders
//                     </p>
//                 </div>

//                 <button
//                     type="button"
//                     className="walkin-new-order-btn"
//                     onClick={handleNewOrder}
//                 >
//                     + New Walk-in Order
//                 </button>

//             </div>


//             {/* =====================================
//                 SUMMARY CARDS
//             ===================================== */}

//             <div className="walkin-order-stats">

//                 <div className="walkin-order-stat-card">

//                     <span className="walkin-stat-icon">
//                         🛒
//                     </span>

//                     <div>
//                         <p>
//                             Total Orders
//                         </p>

//                         <h2>
//                             {orders.length}
//                         </h2>
//                     </div>

//                 </div>


//                 <div className="walkin-order-stat-card">

//                     <span className="walkin-stat-icon">
//                         ✅
//                     </span>

//                     <div>
//                         <p>
//                             Completed
//                         </p>

//                         <h2>
//                             {
//                                 orders.filter(
//                                     (order) =>
//                                         order.status === "COMPLETED"
//                                 ).length
//                             }
//                         </h2>
//                     </div>

//                 </div>


//                 <div className="walkin-order-stat-card">

//                     <span className="walkin-stat-icon">
//                         ⏳
//                     </span>

//                     <div>
//                         <p>
//                             Pending
//                         </p>

//                         <h2>
//                             {
//                                 orders.filter(
//                                     (order) =>
//                                         order.status === "PENDING"
//                                 ).length
//                             }
//                         </h2>
//                     </div>

//                 </div>


//                 <div className="walkin-order-stat-card">

//                     <span className="walkin-stat-icon">
//                         💰
//                     </span>

//                     <div>
//                         <p>
//                             Total Sales
//                         </p>

//                         <h2>
//                             ₹{" "}
//                             {orders
//                                 .reduce(
//                                     (total, order) =>
//                                         total + order.amount,
//                                     0
//                                 )
//                                 .toLocaleString("en-IN")}
//                         </h2>
//                     </div>

//                 </div>

//             </div>


//             {/* =====================================
//                 ORDERS CARD
//             ===================================== */}

//             <div className="walkin-orders-card">

//                 {/* TOP BAR */}

//                 <div className="walkin-orders-toolbar">

//                     <div>
//                         <h2>
//                             Today's Walk-in Orders
//                         </h2>

//                         <p>
//                             {filteredOrders.length} orders found
//                         </p>
//                     </div>

//                     <div className="walkin-orders-search">

//                         <input
//                             type="text"
//                             placeholder="Search order, customer or phone..."
//                             value={search}
//                             onChange={(e) =>
//                                 setSearch(e.target.value)
//                             }
//                         />

//                     </div>

//                 </div>


//                 {/* =====================================
//                     TABLE
//                 ===================================== */}

//                 {filteredOrders.length === 0 ? (

//                     <div className="walkin-orders-empty">

//                         <div>
//                             📋
//                         </div>

//                         <h3>
//                             No Orders Found
//                         </h3>

//                         <p>
//                             No walk-in orders match your search.
//                         </p>

//                     </div>

//                 ) : (

//                     <div className="walkin-orders-table-wrapper">

//                         <table className="walkin-orders-table">

//                             <thead>

//                                 <tr>

//                                     <th>
//                                         Order ID
//                                     </th>

//                                     <th>
//                                         Customer
//                                     </th>

//                                     <th>
//                                         Items
//                                     </th>

//                                     <th>
//                                         Amount
//                                     </th>

//                                     <th>
//                                         Payment
//                                     </th>

//                                     <th>
//                                         Status
//                                     </th>

//                                     <th>
//                                         Date
//                                     </th>

//                                     <th>
//                                         Action
//                                     </th>

//                                 </tr>

//                             </thead>

//                             <tbody>

//                                 {filteredOrders.map(
//                                     (order) => (

//                                         <tr key={order.id}>

//                                             <td>

//                                                 <strong>
//                                                     {order.id}
//                                                 </strong>

//                                             </td>


//                                             <td>

//                                                 <div className="walkin-customer-cell">

//                                                     <strong>
//                                                         {order.customerName}
//                                                     </strong>

//                                                     <span>
//                                                         {order.phone}
//                                                     </span>

//                                                 </div>

//                                             </td>


//                                             <td>
//                                                 {order.items}
//                                             </td>


//                                             <td>

//                                                 <strong>
//                                                     ₹{" "}
//                                                     {order.amount.toLocaleString(
//                                                         "en-IN"
//                                                     )}
//                                                 </strong>

//                                             </td>


//                                             <td>

//                                                 <span className="walkin-payment-badge">

//                                                     {order.paymentMethod}

//                                                 </span>

//                                             </td>


//                                             <td>

//                                                 <span
//                                                     className={
//                                                         order.status ===
//                                                         "COMPLETED"
//                                                             ? "walkin-status completed"
//                                                             : "walkin-status pending"
//                                                     }
//                                                 >

//                                                     {order.status}

//                                                 </span>

//                                             </td>


//                                             <td>
//                                                 {order.date}
//                                             </td>


//                                             <td>

//                                                 <button
//                                                     type="button"
//                                                     className="walkin-view-btn"
//                                                     onClick={() =>
//                                                         alert(
//                                                             `Order ${order.id}`
//                                                         )
//                                                     }
//                                                 >
//                                                     View
//                                                 </button>

//                                             </td>

//                                         </tr>

//                                     )
//                                 )}

//                             </tbody>

//                         </table>

//                     </div>

//                 )}

//             </div>

//         </div>
//     );
// };

// export default WalkInOrders;


import { useEffect, useState } from "react";
import "./WalkInOrders.css";
import {
    getAllOrders
} from "../../../services/orderService";

function WalkInOrders() {

    const [orders, setOrders] = useState([]);

    const [filteredOrders, setFilteredOrders] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadOrders();

    }, []);

    const loadOrders = async () => {

        try {

            setLoading(true);

            const res = await getAllOrders();

            console.log("ALL ORDERS :", res);

            const list =
                res.orders ||
                res.data ||
                [];

            // Only Walk-In Orders

            const walkInOrders = list.filter(

                (order) =>

                    order.orderSource === "WALK_IN"

            );

            setOrders(walkInOrders);

            setFilteredOrders(walkInOrders);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    // ======================================
    // SEARCH
    // ======================================

    const handleSearch = (value) => {

        setSearch(value);

        if (!value) {

            setFilteredOrders(orders);

            return;

        }

        const keyword = value.toLowerCase();

        const result = orders.filter(

            (order) =>

                order._id.toLowerCase().includes(keyword)

                ||

                order.shippingAddress?.fullName

                    ?.toLowerCase()

                    .includes(keyword)

                ||

                order.shippingAddress?.phone

                    ?.includes(keyword)

        );

        setFilteredOrders(result);

    };

        // ======================================
    // DATE FILTER
    // ======================================

    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {

        if (!selectedDate) {

            setFilteredOrders(orders);

            return;

        }

        const result = orders.filter((order) => {

            const orderDate = new Date(order.createdAt)
                .toISOString()
                .split("T")[0];

            return orderDate === selectedDate;

        });

        setFilteredOrders(result);

    }, [selectedDate, orders]);

    // ======================================
    // TOTAL SALES
    // ======================================

    const totalSales = filteredOrders.reduce(

        (sum, order) =>

            sum + Number(order.totalAmount || 0),

        0

    );

    // ======================================
    // TOTAL ORDERS
    // ======================================

    const totalOrders = filteredOrders.length;

    // ======================================
    // VIEW ORDER
    // ======================================

    const viewOrder = (order) => {

        console.log(order);

        // Next Part me Invoice Modal open hoga

    };

    // ======================================
    // PRINT INVOICE
    // ======================================

    const printInvoice = (order) => {

        window.open(

            `/walkin-invoice/${order._id}`,

            "_blank"

        );

    };

    // ======================================
    // RETURN JSX
    // ======================================

    return (

        <div className="walkin-orders-page">

            <div className="page-header">

                <h2>

                    Walk-In Orders

                </h2>

            </div>

            <div className="filter-section">

                <input

                    type="text"

                    placeholder="Search Customer / Phone / Order ID"

                    value={search}

                    onChange={(e)=>

                        handleSearch(e.target.value)

                    }

                />

                <input

                    type="date"

                    value={selectedDate}

                    onChange={(e)=>

                        setSelectedDate(e.target.value)

                    }

                />

            </div>

            <div className="summary-box">

                <div className="summary-card">

                    <h3>

                        {totalOrders}

                    </h3>

                    <p>

                        Total Orders

                    </p>

                </div>

                <div className="summary-card">

                    <h3>

                        ₹ {totalSales}

                    </h3>

                    <p>

                        Total Sales

                    </p>

                </div>

            </div>

                        <div className="orders-table">

                <table>

                    <thead>

                        <tr>

                            <th>Order ID</th>

                            <th>Date</th>

                            <th>Customer</th>

                            <th>Phone</th>

                            <th>Products</th>

                            <th>Qty</th>

                            <th>Total</th>

                            <th>Payment</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ?

                            (

                                <tr>

                                    <td colSpan="10">

                                        Loading...

                                    </td>

                                </tr>

                            )

                            :

                            filteredOrders.length===0 ?

                            (

                                <tr>

                                    <td colSpan="10">

                                        No Walk-In Orders Found

                                    </td>

                                </tr>

                            )

                            :

                            filteredOrders.map((order)=>(

                                <tr key={order._id}>

                                    <td>

                                        {order._id.slice(-8)}

                                    </td>

                                    <td>

                                        {

                                            new Date(

                                                order.createdAt

                                            ).toLocaleDateString()

                                        }

                                    </td>

                                    <td>

                                        {

                                            order.shippingAddress

                                                ?.fullName

                                        }

                                    </td>

                                    <td>

                                        {

                                            order.shippingAddress

                                                ?.phone

                                        }

                                    </td>

                                    <td>

                                        {

                                            order.orderItems.length

                                        }

                                    </td>

                                    <td>

                                        {

                                            order.orderItems.reduce(

                                                (sum,item)=>

                                                sum+

                                                item.quantity,

                                                0

                                            )

                                        }

                                    </td>

                                    <td>

                                        ₹

                                        {

                                            order.totalAmount

                                        }

                                    </td>

                                    <td>

                                        <span
                                            className={
                                                order.paymentStatus==="PAID"
                                                ?
                                                "paid"
                                                :
                                                "pending"
                                            }
                                        >

                                            {

                                                order.paymentStatus

                                            }

                                        </span>

                                    </td>

                                    <td>

                                        <span
                                            className="order-status"
                                        >

                                            {

                                                order.orderStatus

                                            }

                                        </span>

                                    </td>

                                    <td>

                                        <div
                                            className="action-buttons"
                                        >

                                            <button

                                                className="view-btn"

                                                onClick={()=>

                                                    viewOrder(order)

                                                }

                                            >

                                                View

                                            </button>

                                            <button

                                                className="print-btn"

                                                onClick={()=>

                                                    printInvoice(order)

                                                }

                                            >

                                                Print

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default WalkInOrders;