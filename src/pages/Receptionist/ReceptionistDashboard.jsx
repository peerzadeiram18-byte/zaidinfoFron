import React from "react";
import { useNavigate } from "react-router-dom";

import "./ReceptionistDashboard.css";

const ReceptionistDashboard = () => {
    const navigate = useNavigate();

    // =====================================
    // NAVIGATION
    // =====================================

    const handleNewWalkInOrder = () => {
        navigate("/receptionist/walk-in-order/new");
    };

    const handleViewOrders = () => {
        navigate("/receptionist/walk-in-orders");
    };

    const handleCustomers = () => {
        navigate("/receptionist/customers");
    };

    return (
        <div className="receptionist-dashboard">

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="receptionist-header">

                <div>
                    <h1>
                        Receptionist Dashboard
                    </h1>

                    <p>
                        Manage walk-in customers and offline orders
                    </p>
                </div>

                <div className="receptionist-user">

                    <div className="receptionist-avatar">
                        R
                    </div>

                    <div>
                        <strong>
                            Receptionist
                        </strong>

                        <span>
                            POS Counter
                        </span>
                    </div>

                </div>

            </div>


            {/* =====================================
                QUICK STATS
            ===================================== */}

            <div className="receptionist-stats">

                {/* TODAY'S ORDERS */}

                <div className="receptionist-stat-card">

                    <div className="stat-icon">
                        🛒
                    </div>

                    <div>
                        <span>
                            Today's Walk-in Orders
                        </span>

                        <h2>
                            0
                        </h2>
                    </div>

                </div>


                {/* TODAY'S SALES */}

                <div className="receptionist-stat-card">

                    <div className="stat-icon">
                        💰
                    </div>

                    <div>
                        <span>
                            Today's Sales
                        </span>

                        <h2>
                            ₹ 0
                        </h2>
                    </div>

                </div>


                {/* PENDING ORDERS */}

                <div className="receptionist-stat-card">

                    <div className="stat-icon">
                        ⏳
                    </div>

                    <div>
                        <span>
                            Pending Orders
                        </span>

                        <h2>
                            0
                        </h2>
                    </div>

                </div>


                {/* CUSTOMERS */}

                <div className="receptionist-stat-card">

                    <div className="stat-icon">
                        👥
                    </div>

                    <div>
                        <span>
                            Walk-in Customers
                        </span>

                        <h2>
                            0
                        </h2>
                    </div>

                </div>

            </div>


            {/* =====================================
                MAIN POS SECTION
            ===================================== */}

            <div className="receptionist-main-grid">

                {/* =================================
                    WALK-IN ORDERS
                ================================= */}

                <div className="walkin-main-card">

                    <div className="card-heading">

                        <div>
                            <h2>
                                Walk-in Orders
                            </h2>

                            <p>
                                Create and manage offline shop orders
                            </p>
                        </div>

                        <button
                            type="button"
                            className="new-walkin-btn"
                            onClick={handleNewWalkInOrder}
                        >
                            + New Walk-in Order
                        </button>

                    </div>


                    {/* EMPTY STATE */}

                    <div className="walkin-empty">

                        <div className="empty-icon">
                            🛍️
                        </div>

                        <h3>
                            No Walk-in Orders Yet
                        </h3>

                        <p>
                            Create a new order when a customer
                            visits your store.
                        </p>

                        <button
                            type="button"
                            onClick={handleNewWalkInOrder}
                        >
                            Create Walk-in Order
                        </button>

                    </div>

                </div>


                {/* =================================
                    QUICK ACTIONS
                ================================= */}

                <div className="quick-actions-card">

                    <h2>
                        Quick Actions
                    </h2>

                    <p className="quick-actions-subtitle">
                        Common receptionist actions
                    </p>


                    {/* NEW ORDER */}

                    <button
                        type="button"
                        className="quick-action"
                        onClick={handleNewWalkInOrder}
                    >

                        <span className="quick-action-icon">
                            ➕
                        </span>

                        <span>
                            <strong>
                                New Walk-in Order
                            </strong>

                            <small>
                                Create POS order
                            </small>
                        </span>

                        <span className="action-arrow">
                            →
                        </span>

                    </button>


                    {/* VIEW ORDERS */}

                    <button
                        type="button"
                        className="quick-action"
                        onClick={handleViewOrders}
                    >

                        <span className="quick-action-icon">
                            📋
                        </span>

                        <span>
                            <strong>
                                View Orders
                            </strong>

                            <small>
                                Check today's orders
                            </small>
                        </span>

                        <span className="action-arrow">
                            →
                        </span>

                    </button>


                    {/* CUSTOMERS */}

                    <button
                        type="button"
                        className="quick-action"
                        onClick={handleCustomers}
                    >

                        <span className="quick-action-icon">
                            👤
                        </span>

                        <span>
                            <strong>
                                Customers
                            </strong>

                            <small>
                                Search or create customer
                            </small>
                        </span>

                        <span className="action-arrow">
                            →
                        </span>

                    </button>

                </div>

            </div>


            {/* =====================================
                OFFLINE ORDER FLOW
            ===================================== */}

            <div className="offline-flow-card">

                <div className="flow-header">

                    <div>
                        <h2>
                            Walk-in Order Flow
                        </h2>

                        <p>
                            Complete offline POS order process
                        </p>
                    </div>

                    <span className="offline-badge">
                        OFFLINE POS
                    </span>

                </div>


                <div className="offline-flow">

                    {/* STEP 1 */}

                    <div className="flow-step">

                        <div className="flow-number">
                            1
                        </div>

                        <div>
                            <strong>
                                Customer
                            </strong>

                            <span>
                                Walks In
                            </span>
                        </div>

                    </div>


                    <div className="flow-arrow">
                        →
                    </div>


                    {/* STEP 2 */}

                    <div className="flow-step">

                        <div className="flow-number">
                            2
                        </div>

                        <div>
                            <strong>
                                Customer
                            </strong>

                            <span>
                                Search / Create
                            </span>
                        </div>

                    </div>


                    <div className="flow-arrow">
                        →
                    </div>


                    {/* STEP 3 */}

                    <div className="flow-step">

                        <div className="flow-number">
                            3
                        </div>

                        <div>
                            <strong>
                                Product
                            </strong>

                            <span>
                                Add To Cart
                            </span>
                        </div>

                    </div>


                    <div className="flow-arrow">
                        →
                    </div>


                    {/* STEP 4 */}

                    <div className="flow-step">

                        <div className="flow-number">
                            4
                        </div>

                        <div>
                            <strong>
                                Payment
                            </strong>

                            <span>
                                Cash / UPI / Card
                            </span>
                        </div>

                    </div>


                    <div className="flow-arrow">
                        →
                    </div>


                    {/* STEP 5 */}

                    <div className="flow-step">

                        <div className="flow-number">
                            5
                        </div>

                        <div>
                            <strong>
                                Invoice
                            </strong>

                            <span>
                                Print
                            </span>
                        </div>

                    </div>


                    <div className="flow-arrow">
                        →
                    </div>


                    {/* COMPLETE */}

                    <div className="flow-step flow-complete">

                        <div className="flow-number">
                            ✓
                        </div>

                        <div>
                            <strong>
                                Delivered
                            </strong>

                            <span>
                                Order Complete
                            </span>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ReceptionistDashboard;