import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Admin/Sidebar/Sidebar";

import "./AdminLayout.css";

const AdminLayout = () => {

    return (

        <div className="admin-layout">

            {/* =====================================
                ONLY ONE SIDEBAR
            ===================================== */}

            <Sidebar />


            {/* =====================================
                ADMIN PAGE CONTENT
            ===================================== */}

            <main className="admin-main">

                <Outlet />

            </main>

        </div>

    );

};

export default AdminLayout;