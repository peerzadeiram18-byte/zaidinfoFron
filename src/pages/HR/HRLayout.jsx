// import React, { useState, useEffect, useRef } from "react";
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
//   FaSignOutAlt,
//   FaBars,
//   FaTimes,
//   FaHeadset,
//   FaHome,
//   FaBell,
//   FaCheck,
//   FaTrash,
//   FaTimesCircle,
// } from "react-icons/fa";

// import {
//   getMyNotifications,
//   markNotificationAsRead,
//   markAllNotificationsAsRead,
//   deleteNotification,
// } from "../../services/notificationService";

// import "./HRLayout.css";

// export default function HRLayout() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isNotifOpen, setIsNotifOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const navigate = useNavigate();
//   const notifRef = useRef(null);

//   // =========================================
//   // LOGOUT
//   // =========================================

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   // =========================================
//   // LOAD NOTIFICATIONS
//   // =========================================

//   const loadNotifications = async () => {
//     try {
//       const res = await getMyNotifications();
//       setNotifications(res.notifications || []);
//       setUnreadCount(res.unreadCount || 0);
//     } catch (error) {
//       console.error("NOTIFICATION LOAD ERROR:", error);
//     }
//   };

//   useEffect(() => {
//     loadNotifications();
//   }, []);

//   // =========================================
//   // CLOSE DROPDOWN ON OUTSIDE CLICK
//   // =========================================

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (notifRef.current && !notifRef.current.contains(e.target)) {
//         setIsNotifOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // =========================================
//   // MARK ONE AS READ
//   // =========================================

//   const handleRead = async (notification) => {
//     try {
//       if (!notification.isRead) {
//         await markNotificationAsRead(notification._id);
//       }

//       if (notification.relatedModel === "Leave" && notification.relatedId) {
//         navigate("/hr-dashboard/leave-requests");
//         setIsNotifOpen(false);
//         loadNotifications();
//         return;
//       }

//       if (notification.relatedModel === "Employee" && notification.relatedId) {
//         navigate("/hr-dashboard/employees");
//         setIsNotifOpen(false);
//         loadNotifications();
//         return;
//       }

//       if (notification.relatedModel === "Attendance" && notification.relatedId) {
//         navigate("/hr-dashboard/attendance");
//         setIsNotifOpen(false);
//         loadNotifications();
//         return;
//       }

//       loadNotifications();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // =========================================
//   // MARK ALL AS READ
//   // =========================================

//   const handleMarkAll = async () => {
//     try {
//       await markAllNotificationsAsRead();
//       loadNotifications();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // =========================================
//   // DELETE NOTIFICATION
//   // =========================================

//   const handleDelete = async (id, e) => {
//     e.stopPropagation();

//     try {
//       await deleteNotification(id);
//       loadNotifications();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="rep-layout-root">
//       {/* Mobile Topbar Toggle */}
//       <header className="rep-mobile-topbar">
//         <div className="rep-brand-badge">
//           <FaHeadset className="rep-brand-icon" />
//           <span>ZAID INFOTECH</span>
//         </div>
//         <button
//           type="button"
//           className="rep-menu-toggle-btn"
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//         >
//           {isSidebarOpen ? <FaTimes /> : <FaBars />}
//         </button>
//       </header>

//       {/* Sidebar Navigation */}
//       <aside
//         className={`rep-sidebar ${
//           isSidebarOpen ? "rep-sidebar-open" : "rep-sidebar-collapsed"
//         }`}
//       >
//         <div className="rep-sidebar-brand">
//           <div className="rep-brand-avatar">
//             <FaHeadset />
//           </div>
//           <div className="rep-brand-text">
//             <h3>ZAID INFOTECH</h3>
//             <span>HR</span>
//           </div>
//         </div>

//         <nav className="rep-nav-section">
//           <span className="rep-nav-heading">EMPLOYEE</span>

//           <NavLink
//             to="/hr-dashboard/employees"
//             end
//             className={({ isActive }) =>
//               `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
//             }
//           >
//             <FaBriefcase className="rep-nav-icon" />
//             <span>Employees</span>
//           </NavLink>

//           <NavLink
//             to="/hr-dashboard/employees/add"
//             className={({ isActive }) =>
//               `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
//             }
//           >
//             <FaUserPlus className="rep-nav-icon" />
//             <span>Add Employee</span>
//           </NavLink>

//           <NavLink
//             to="/hr-dashboard/shifting/add"
//             className={({ isActive }) =>
//               `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
//             }
//           >
//             <FaClock className="rep-nav-icon" />
//             <span>Add Shifting</span>
//           </NavLink>

//           <NavLink
//             to="/hr-dashboard/employee-shift"
//             className={({ isActive }) =>
//               `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
//             }
//           >
//             <FaUserClock className="rep-nav-icon" />
//             <span>Employee Shift</span>
//           </NavLink>

//           <NavLink
//             to="/hr-dashboard/attendance"
//             className={({ isActive }) =>
//               `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
//             }
//           >
//             <FaCalendarCheck className="rep-nav-icon" />
//             <span>Attendance</span>
//           </NavLink>

//           <NavLink
//             to="/hr-dashboard/leave-requests"
//             className={({ isActive }) =>
//               `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
//             }
//           >
//             <FaClipboardList className="rep-nav-icon" />
//             <span>Leave Requests</span>
//           </NavLink>

//           <NavLink
//             to="/hr-dashboard/leave-policies"
//             className={({ isActive }) =>
//               `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
//             }
//           >
//             <FaFileAlt className="rep-nav-icon" />
//             <span>Leave Policies</span>
//           </NavLink>

//           <NavLink
//             to="/hr-dashboard/holidays"
//             className={({ isActive }) =>
//               `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
//             }
//           >
//             <FaCalendarAlt className="rep-nav-icon" />
//             <span>Holidays</span>
//           </NavLink>

//           <NavLink
//             to="/hr-dashboard/salary"
//             className={({ isActive }) =>
//               `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
//             }
//           >
//             <FaMoneyBillWave className="rep-nav-icon" />
//             <span>Salary</span>
//           </NavLink>
//         </nav>

//         {/* Sidebar Footer Info */}
//         <div className="rep-sidebar-footer">
//           <div className="rep-user-profile">
//             <div className="rep-user-badge">H</div>
//             <div className="rep-user-meta">
//               <strong>HR Desk</strong>
//               <small>Online Session</small>
//             </div>
//           </div>
//           <button
//             type="button"
//             className="rep-logout-btn"
//             onClick={handleLogout}
//             title="Logout"
//           >
//             <FaSignOutAlt />
//           </button>
//         </div>
//       </aside>

//       {/* Main Content Area */}
//       <div className="rep-main-wrapper">
//         {/* ================================
//             HR TOPBAR — Home + Notifications
//             Fixed across ALL child pages
//         ================================ */}
//         <div className="hr-topbar">
//           <button
//             type="button"
//             className="hr-topbar-icon-btn"
//             onClick={() => navigate("/hr-dashboard")}
//             title="Home"
//           >
//             <FaHome />
//           </button>

//           <div className="hr-notif-wrapper" ref={notifRef}>
//             <button
//               type="button"
//               className="hr-topbar-icon-btn"
//               onClick={() => setIsNotifOpen(!isNotifOpen)}
//               title="Notifications"
//             >
//               <FaBell />
//               {unreadCount > 0 && (
//                 <span className="hr-notif-badge">{unreadCount}</span>
//               )}
//             </button>

//             {isNotifOpen && (
//               <div className="hr-notif-popover">
//                 <div className="hr-notif-popover-header">
//                   <div>
//                     <h3>Notifications</h3>
//                     <p>{unreadCount} unread</p>
//                   </div>
//                   <button
//                     className="hr-notif-close-btn"
//                     onClick={() => setIsNotifOpen(false)}
//                   >
//                     <FaTimesCircle />
//                   </button>
//                 </div>

//                 {unreadCount > 0 && (
//                   <button
//                     className="hr-notif-mark-all"
//                     onClick={handleMarkAll}
//                   >
//                     <FaCheck />
//                     Mark all as read
//                   </button>
//                 )}

//                 <div className="hr-notif-scroll">
//                   {notifications.length === 0 ? (
//                     <div className="hr-notif-empty-state">
//                       <FaBell />
//                       <p>No notifications</p>
//                     </div>
//                   ) : (
//                     notifications.slice(0, 6).map((n) => (
//                       <div
//                         key={n._id}
//                         className={`hr-notif-row ${
//                           !n.isRead ? "unread" : ""
//                         }`}
//                         onClick={() => handleRead(n)}
//                       >
//                         <span className="hr-notif-dot" />

//                         <div className="hr-notif-row-content">
//                           <strong>{n.title}</strong>
//                           <p>{n.message}</p>
//                           <small>
//                             {new Date(n.createdAt).toLocaleString()}
//                           </small>
//                         </div>

//                         <button
//                           className="hr-notif-delete-btn"
//                           onClick={(e) => handleDelete(n._id, e)}
//                           title="Delete"
//                         >
//                           <FaTrash />
//                         </button>
//                       </div>
//                     ))
//                   )}
//                 </div>

//                 {notifications.length > 0 && (
//                   <button
//                     className="hr-notif-view-all"
//                     onClick={() => {
//                       setIsNotifOpen(false);
//                       navigate("/hr-dashboard/notifications");
//                     }}
//                   >
//                     View all notifications
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Main Outlet Window */}
//         <main className="rep-main-canvas">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

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
} from "react-icons/fa";

import "./HRLayout.css";

// =====================================================
// HR MENU
// =====================================================

const hrMenu = [
  {
    label: "Employees",
    path: "/hr-dashboard/employees",
    icon: <FaBriefcase />,
  },

  {
    label: "Add Employee",
    path: "/hr-dashboard/employees/add",
    icon: <FaUserPlus />,
  },

  {
    label: "Add Shifting",
    path: "/hr-dashboard/shifting/add",
    icon: <FaClock />,
  },

  {
    label: "Employee Shift",
    path: "/hr-dashboard/employee-shift",
    icon: <FaUserClock />,
  },

  {
    label: "Attendance",
    path: "/hr-dashboard/attendance",
    icon: <FaCalendarCheck />,
  },

  {
    label: "Leave Requests",
    path: "/hr-dashboard/leave/requests",
    icon: <FaClipboardList />,
  },

  {
    label: "Leave Policies",
    path: "/hr-dashboard/leave/policies",
    icon: <FaFileAlt />,
  },

  {
    label: "Holidays",
    path: "/hr-dashboard/holidays",
    icon: <FaCalendarAlt />,
  },

  {
    label: "Salary",
    path: "/hr-dashboard/salary",
    icon: <FaMoneyBillWave />,
  },
];

// =====================================================
// HR LAYOUT
// =====================================================

export default function HRLayout() {
  const navigate = useNavigate();

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="hr-layout">
      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="hr-sidebar">
        {/* =================================================
            SIDEBAR HEADER
        ================================================= */}

        <div className="hr-sidebar-header">
          <button
            type="button"
            className="hr-brand"
            onClick={() =>
              navigate("/hr-dashboard")
            }
          >
            HR
          </button>
        </div>

        {/* =================================================
            MENU TITLE
        ================================================= */}

        <div className="hr-menu-title">
          EMPLOYEE
        </div>

        {/* =================================================
            MENU
        ================================================= */}

        <nav className="hr-sidebar-menu">
          {/* DASHBOARD */}

          <NavLink
            to="/hr-dashboard"
            end
            className={({ isActive }) =>
              `hr-menu-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="hr-menu-icon">
              <FaHome />
            </span>

            <span className="hr-menu-label">
              Dashboard
            </span>
          </NavLink>

          {/* ALL HR MODULES */}

          {hrMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `hr-menu-item ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="hr-menu-icon">
                {item.icon}
              </span>

              <span className="hr-menu-label">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* =================================================
            LOGOUT
        ================================================= */}

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

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="hr-main">
        <div className="hr-main-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}