import React, { useState } from "react";

import "./CustomerDashboard.css";

import MyProfile from "../MyProfile";

import Wishlist from "../../../Shop/Wishlist/Wishlist";

import Cart from "../../../Shop/Cart/Cart";

import MyAddress from "../../../Profile/MyAddress/MyAddress";
const CustomerDashboard = () => {

    const [activeMenu, setActiveMenu] = useState("profile");

    const renderPage = () => {

        switch (activeMenu) {

            case "profile":
                return <MyProfile />;

            case "wishlist":
                return <Wishlist />;

            case "cart":
                return <Cart />;

            case "address":
                return <MyAddress />;

            case "orders":
                return (
                    <div className="coming-soon">
                        <h2>My Orders</h2>
                        <p>Coming Soon...</p>
                    </div>
                );

            case "password":
                return (
                    <div className="coming-soon">
                        <h2>Change Password</h2>
                        <p>Coming Soon...</p>
                    </div>
                );

            default:
                return <MyProfile />;

        }

    };

    return (

        <div className="customer-dashboard">

            {/* Sidebar */}

            <div className="dashboard-sidebar">

                <div className="customer-box">

                    <img
                        src="/user.png"
                        alt="User"
                        className="customer-image"
                    />

                    <h3>My Account</h3>

                </div>

                <button
                    className={activeMenu === "profile" ? "active" : ""}
                    onClick={() => setActiveMenu("profile")}
                >
                    👤 My Profile
                </button>

                <button
                    className={activeMenu === "orders" ? "active" : ""}
                    onClick={() => setActiveMenu("orders")}
                >
                    📦 My Orders
                </button>

                <button
                    className={activeMenu === "wishlist" ? "active" : ""}
                    onClick={() => setActiveMenu("wishlist")}
                >
                    ❤️ Wishlist
                </button>

                <button
                    className={activeMenu === "cart" ? "active" : ""}
                    onClick={() => setActiveMenu("cart")}
                >
                    🛒 Cart
                </button>

                <button
                    className={activeMenu === "address" ? "active" : ""}
                    onClick={() => setActiveMenu("address")}
                >
                    📍 My Address
                </button>

                <button
                    className={activeMenu === "password" ? "active" : ""}
                    onClick={() => setActiveMenu("password")}
                >
                    🔒 Change Password
                </button>

            </div>

            {/* Content */}

            <div className="dashboard-content">

                {renderPage()}

            </div>

        </div>

    );

};

export default CustomerDashboard;