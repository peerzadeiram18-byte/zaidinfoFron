import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./WalkInOrders.css";

const WalkInOrders = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    // =====================================
    // DEMO ORDERS
    // Later API se aayenge
    // =====================================

    const [orders] = useState([
        {
            id: "WO001",
            customerName: "Rahul Sharma",
            phone: "9876543210",
            items: 2,
            amount: 51500,
            paymentMethod: "CASH",
            status: "COMPLETED",
            date: "Today",
        },
        {
            id: "WO002",
            customerName: "Amit Patil",
            phone: "9876543211",
            items: 1,
            amount: 1500,
            paymentMethod: "UPI",
            status: "COMPLETED",
            date: "Today",
        },
        {
            id: "WO003",
            customerName: "Priya Jagtap",
            phone: "9876543212",
            items: 3,
            amount: 12800,
            paymentMethod: "CARD",
            status: "PENDING",
            date: "Today",
        },
    ]);

    // =====================================
    // SEARCH
    // =====================================

    const filteredOrders = orders.filter((order) => {
        const searchValue = search.toLowerCase().trim();

        return (
            order.id.toLowerCase().includes(searchValue) ||
            order.customerName
                .toLowerCase()
                .includes(searchValue) ||
            order.phone.includes(searchValue)
        );
    });

    // =====================================
    // NEW ORDER
    // =====================================

    const handleNewOrder = () => {
        navigate("/receptionist/walk-in-order/new");
    };

    return (
        <div className="walkin-orders-page">

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="walkin-orders-header">

                <div>
                    <h1>
                        Walk-in Orders
                    </h1>

                    <p>
                        View and manage receptionist POS orders
                    </p>
                </div>

                <button
                    type="button"
                    className="walkin-new-order-btn"
                    onClick={handleNewOrder}
                >
                    + New Walk-in Order
                </button>

            </div>


            {/* =====================================
                SUMMARY CARDS
            ===================================== */}

            <div className="walkin-order-stats">

                <div className="walkin-order-stat-card">

                    <span className="walkin-stat-icon">
                        🛒
                    </span>

                    <div>
                        <p>
                            Total Orders
                        </p>

                        <h2>
                            {orders.length}
                        </h2>
                    </div>

                </div>


                <div className="walkin-order-stat-card">

                    <span className="walkin-stat-icon">
                        ✅
                    </span>

                    <div>
                        <p>
                            Completed
                        </p>

                        <h2>
                            {
                                orders.filter(
                                    (order) =>
                                        order.status === "COMPLETED"
                                ).length
                            }
                        </h2>
                    </div>

                </div>


                <div className="walkin-order-stat-card">

                    <span className="walkin-stat-icon">
                        ⏳
                    </span>

                    <div>
                        <p>
                            Pending
                        </p>

                        <h2>
                            {
                                orders.filter(
                                    (order) =>
                                        order.status === "PENDING"
                                ).length
                            }
                        </h2>
                    </div>

                </div>


                <div className="walkin-order-stat-card">

                    <span className="walkin-stat-icon">
                        💰
                    </span>

                    <div>
                        <p>
                            Total Sales
                        </p>

                        <h2>
                            ₹{" "}
                            {orders
                                .reduce(
                                    (total, order) =>
                                        total + order.amount,
                                    0
                                )
                                .toLocaleString("en-IN")}
                        </h2>
                    </div>

                </div>

            </div>


            {/* =====================================
                ORDERS CARD
            ===================================== */}

            <div className="walkin-orders-card">

                {/* TOP BAR */}

                <div className="walkin-orders-toolbar">

                    <div>
                        <h2>
                            Today's Walk-in Orders
                        </h2>

                        <p>
                            {filteredOrders.length} orders found
                        </p>
                    </div>

                    <div className="walkin-orders-search">

                        <input
                            type="text"
                            placeholder="Search order, customer or phone..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </div>


                {/* =====================================
                    TABLE
                ===================================== */}

                {filteredOrders.length === 0 ? (

                    <div className="walkin-orders-empty">

                        <div>
                            📋
                        </div>

                        <h3>
                            No Orders Found
                        </h3>

                        <p>
                            No walk-in orders match your search.
                        </p>

                    </div>

                ) : (

                    <div className="walkin-orders-table-wrapper">

                        <table className="walkin-orders-table">

                            <thead>

                                <tr>

                                    <th>
                                        Order ID
                                    </th>

                                    <th>
                                        Customer
                                    </th>

                                    <th>
                                        Items
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Payment
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredOrders.map(
                                    (order) => (

                                        <tr key={order.id}>

                                            <td>

                                                <strong>
                                                    {order.id}
                                                </strong>

                                            </td>


                                            <td>

                                                <div className="walkin-customer-cell">

                                                    <strong>
                                                        {order.customerName}
                                                    </strong>

                                                    <span>
                                                        {order.phone}
                                                    </span>

                                                </div>

                                            </td>


                                            <td>
                                                {order.items}
                                            </td>


                                            <td>

                                                <strong>
                                                    ₹{" "}
                                                    {order.amount.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </td>


                                            <td>

                                                <span className="walkin-payment-badge">

                                                    {order.paymentMethod}

                                                </span>

                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        order.status ===
                                                        "COMPLETED"
                                                            ? "walkin-status completed"
                                                            : "walkin-status pending"
                                                    }
                                                >

                                                    {order.status}

                                                </span>

                                            </td>


                                            <td>
                                                {order.date}
                                            </td>


                                            <td>

                                                <button
                                                    type="button"
                                                    className="walkin-view-btn"
                                                    onClick={() =>
                                                        alert(
                                                            `Order ${order.id}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
};

export default WalkInOrders;