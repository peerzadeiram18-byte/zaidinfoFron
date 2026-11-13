
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/Admin/Sidebar/Sidebar";

import "./AdminLayout.css";

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    // Hide sidebar ONLY on ViewOrder page
    // Example route: /admin/orders/ORDER_ID
    const isViewOrderPage = /^\/admin\/orders\/[^/]+\/?$/.test(
        location.pathname
    );

    return (
        <div
            className={`admin-layout ${
                sidebarOpen ? "sidebar-open" : "sidebar-closed"
            } ${isViewOrderPage ? "view-order-no-sidebar" : ""}`}
        >
            {/* ADMIN SIDEBAR - Hidden only on ViewOrder page */}
            {!isViewOrderPage && (
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
            )}

            {/* ADMIN PAGE CONTENT */}
            <main
                className={`admin-content ${
                    isViewOrderPage ? "view-order-full-width" : ""
                }`}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
