// import React from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";

// import {
//   FaBriefcase,
//   FaUserPlus,
//   FaClock,
//   FaUserClock,
//   FaCalendarCheck,
//   FaClipboardList,
//   FaFileAlt,
//   FaCalendarAlt,
//   FaMoneyBillWave,
//   FaHome,
//   FaSignOutAlt,
// } from "react-icons/fa";

// import "./HRLayout.css";

// // =====================================================
// // HR MENU
// // =====================================================

// const hrMenu = [
//   {
//     label: "Employees",
//     path: "/hr-dashboard/employees",
//     icon: <FaBriefcase />,
//   },

//   {
//     label: "Add Employee",
//     path: "/hr-dashboard/employees/add",
//     icon: <FaUserPlus />,
//   },

//   {
//     label: "Add Shifting",
//     path: "/hr-dashboard/shifting/add",
//     icon: <FaClock />,
//   },

//   {
//     label: "Employee Shift",
//     path: "/hr-dashboard/employee-shift",
//     icon: <FaUserClock />,
//   },

//   {
//     label: "Attendance",
//     path: "/hr-dashboard/attendance",
//     icon: <FaCalendarCheck />,
//   },

//   {
//     label: "Leave Requests",
//     path: "/hr-dashboard/leave/requests",
//     icon: <FaClipboardList />,
//   },

//   {
//     label: "Leave Policies",
//     path: "/hr-dashboard/leave/policies",
//     icon: <FaFileAlt />,
//   },

//   {
//     label: "Holidays",
//     path: "/hr-dashboard/holidays",
//     icon: <FaCalendarAlt />,
//   },

//   {
//     label: "Salary",
//     path: "/hr-dashboard/salary",
//     icon: <FaMoneyBillWave />,
//   },
// ];

// // =====================================================
// // HR LAYOUT
// // =====================================================

// export default function HRLayout() {
//   const navigate = useNavigate();

//   // ===================================================
//   // LOGOUT
//   // ===================================================

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("user");

//     navigate("/login", {
//       replace: true,
//     });
//   };

//   // ===================================================
//   // RENDER
//   // ===================================================

//   return (
//     <div className="hr-layout">
//       {/* =================================================
//           SIDEBAR
//       ================================================= */}

//       <aside className="hr-sidebar">
//         {/* =================================================
//             SIDEBAR HEADER
//         ================================================= */}

//         <div className="hr-sidebar-header">
//           <button
//             type="button"
//             className="hr-brand"
//             onClick={() =>
//               navigate("/hr-dashboard")
//             }
//           >
//             HR
//           </button>
//         </div>

//         {/* =================================================
//             MENU TITLE
//         ================================================= */}

//         <div className="hr-menu-title">
//           EMPLOYEE
//         </div>

//         {/* =================================================
//             MENU
//         ================================================= */}

//         <nav className="hr-sidebar-menu">
//           {/* DASHBOARD */}

//           <NavLink
//             to="/hr-dashboard"
//             end
//             className={({ isActive }) =>
//               `hr-menu-item ${
//                 isActive ? "active" : ""
//               }`
//             }
//           >
//             <span className="hr-menu-icon">
//               <FaHome />
//             </span>

//             <span className="hr-menu-label">
//               Dashboard
//             </span>
//           </NavLink>

//           {/* ALL HR MODULES */}

//           {hrMenu.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               className={({ isActive }) =>
//                 `hr-menu-item ${
//                   isActive ? "active" : ""
//                 }`
//               }
//             >
//               <span className="hr-menu-icon">
//                 {item.icon}
//               </span>

//               <span className="hr-menu-label">
//                 {item.label}
//               </span>
//             </NavLink>
//           ))}
//         </nav>

//         {/* =================================================
//             LOGOUT
//         ================================================= */}

//         <div className="hr-sidebar-footer">
//           <button
//             type="button"
//             className="hr-logout-btn"
//             onClick={handleLogout}
//           >
//             <FaSignOutAlt />

//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* =================================================
//           MAIN
//       ================================================= */}

//       <main className="hr-main">
//         <div className="hr-main-content">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }


import React, { useState, useEffect, useCallback } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";

import {
  FaBriefcase,
  FaUserPlus,
  FaClock,
  FaUserClock,
  FaCalendarCheck,
  FaClipboardList,
  FaFileAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaHome,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import "./HRLayout.css";

// =====================================================
// HR MENU
// =====================================================

const hrMenu = [
  { label: "Employees", path: "/hr-dashboard/employees", icon: <FaBriefcase />, end: true },
  { label: "Add Employee", path: "/hr-dashboard/employees/add", icon: <FaUserPlus /> },
  { label: "Add Shifting", path: "/hr-dashboard/shifting/add", icon: <FaClock /> },
  { label: "Employee Shift", path: "/hr-dashboard/employee-shift", icon: <FaUserClock /> },
  { label: "Attendance", path: "/hr-dashboard/attendance", icon: <FaCalendarCheck /> },
  { label: "Leave Requests", path: "/hr-dashboard/leave/requests", icon: <FaClipboardList /> },
  { label: "Leave Policies", path: "/hr-dashboard/leave/policies", icon: <FaFileAlt /> },
  { label: "Holidays", path: "/hr-dashboard/holidays", icon: <FaCalendarAlt /> },
  { label: "Salary", path: "/hr-dashboard/salary", icon: <FaMoneyBillWave /> },
];

// =====================================================
// HR LAYOUT
// =====================================================

export default function HRLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Drawer state (only matters on tablet / mobile)
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = useCallback(() => setIsOpen(false), []);

  // Close the drawer whenever the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close on Escape + lock body scroll while the drawer is open
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.classList.toggle("hr-no-scroll", isOpen);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("hr-no-scroll");
    };
  }, [isOpen]);

  // If the screen grows to desktop size, reset the drawer
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1025px)");
    const onChange = (e) => {
      if (e.matches) setIsOpen(false);
    };

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `hr-menu-item ${isActive ? "active" : ""}`;

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="hr-layout">
      {/* MOBILE / TABLET TOPBAR */}
      <header className="hr-topbar">
        <button
          type="button"
          className="hr-menu-toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          aria-expanded={isOpen}
          aria-controls="hr-sidebar"
        >
          <FaBars />
        </button>

        <span className="hr-topbar-title">HR</span>
      </header>

      {/* OVERLAY */}
      <div
        className={`hr-overlay ${isOpen ? "is-open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* SIDEBAR */}
      <aside
        id="hr-sidebar"
        className={`hr-sidebar ${isOpen ? "is-open" : ""}`}
      >
        <div className="hr-sidebar-header">
          <button
            type="button"
            className="hr-brand"
            onClick={() => navigate("/hr-dashboard")}
          >
            HR
          </button>

          <button
            type="button"
            className="hr-sidebar-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <div className="hr-menu-title">EMPLOYEE</div>

        <nav className="hr-sidebar-menu">
          <NavLink to="/hr-dashboard" end className={linkClass}>
            <span className="hr-menu-icon">
              <FaHome />
            </span>
            <span className="hr-menu-label">Dashboard</span>
          </NavLink>

          {hrMenu.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.end} className={linkClass}>
              <span className="hr-menu-icon">{item.icon}</span>
              <span className="hr-menu-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="hr-sidebar-footer">
          <button
            type="button"
            className="hr-logout-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="hr-main">
        <div className="hr-main-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}