// import React from "react";
// import { Outlet } from "react-router-dom";

// import Sidebar from "../components/Admin/Sidebar/Sidebar";

// import "./AdminLayout.css";

// const AdminLayout = () => {

//     return (

//         <div className="admin-layout">

//             {/* =====================================
//                 ONLY ONE SIDEBAR
//             ===================================== */}

//             <Sidebar />


//             {/* =====================================
//                 ADMIN PAGE CONTENT
//             ===================================== */}

//             <main className="admin-content">

//                 <Outlet />

//             </main>

//         </div>

//     );

// };

// export default AdminLayout;


import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Admin/Sidebar/Sidebar";

import "./AdminLayout.css";

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div
            className={`admin-layout ${
                sidebarOpen ? "sidebar-open" : "sidebar-closed"
            }`}
        >

            {/* =====================================
                ADMIN SIDEBAR
            ===================================== */}

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />


            {/* =====================================
                ADMIN PAGE CONTENT
            ===================================== */}

            <main className="admin-content">
                <Outlet />
            </main>

        </div>
    );
};

export default AdminLayout;