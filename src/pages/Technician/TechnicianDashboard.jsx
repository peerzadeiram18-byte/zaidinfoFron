// // TechnicianDashboard.jsx
// import React from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import {
//   FaHome,
//   FaTools,
//   FaClipboardList,
//   FaHistory,
//   FaBell,
//   FaCog,
//   FaSignOutAlt,
//   FaBoxOpen,
//   FaCalendarAlt,
// } from "react-icons/fa";
// import "./TechnicianDashboard.css";

// const BASE_PATH = "/technician-dashboard";

// const NAV_ITEMS = [
//   { label: "Dashboard", path: `${BASE_PATH}`, icon: <FaHome />, end: true },
//   { label: "charges", path: `${BASE_PATH}/charges`, icon: <FaClipboardList /> },
//   { label: "My Repairs", path: `${BASE_PATH}/my-repairs`, icon: <FaTools /> },
//   { label: "Repair History", path: `${BASE_PATH}/history`, icon: <FaHistory /> },
//   { label: "Inventory", path: `${BASE_PATH}/inventory`, icon: <FaBoxOpen /> },
//   { label: "Notifications", path: `${BASE_PATH}/notifications`, icon: <FaBell /> },
//   { label: "Settings", path: `${BASE_PATH}/settings`, icon: <FaCog /> },
// ];

// function TechnicianDashboard() {
//   const navigate = useNavigate();

//   const user = (() => {
//     try {
//       return JSON.parse(localStorage.getItem("user")) || {};
//     } catch {
//       return {};
//     }
//   })();

//   const profileImage =
//     user.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/");
//   };

//   return (
//     <div className="tech-container">
//       {/* Sidebar */}
//       <aside className="tech-sidebar">
//         <div className="tech-profile">
//           <img src={profileImage} alt="Profile" className="tech-profile-img" />
//           <h3>
//             {user.firstName || "Technician"} {user.lastName || ""}
//           </h3>
//           <span className="tech-badge">{user.role || "TECHNICIAN"}</span>
//         </div>

//         <nav className="tech-nav-list">
//           {NAV_ITEMS.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               end={item.end}
//               className={({ isActive }) =>
//                 `tech-nav-item ${isActive ? "active" : ""}`
//               }
//             >
//               <span className="nav-icon">{item.icon}</span>
//               <span className="nav-label">{item.label}</span>
//             </NavLink>
//           ))}

//           <button onClick={handleLogout} className="tech-nav-item logout-btn">
//             <span className="nav-icon">
//               <FaSignOutAlt />
//             </span>
//             <span className="nav-label">Logout</span>
//           </button>
//         </nav>
//       </aside>

//       {/* Main Content Area */}
//       <main className="tech-main-content">
//         <header className="tech-topbar">
//           <div>
//             <h2>Technician Workspace</h2>
//             <p>Welcome back, {user.firstName || "Technician"} 👋</p>
//           </div>
//           <div className="tech-topbar-info">
//             <span>
//               {new Date().toLocaleDateString("en-US", {
//                 weekday: "long",
//                 year: "numeric",
//                 month: "short",
//                 day: "numeric",
//               })}
//             </span>
//           </div>
//         </header>

//         {/* Dynamic Nested Route Content */}
//         <section className="tech-content-body">
//           <Outlet />
//         </section>
//       </main>
//     </div>
//   );
// }

// export default TechnicianDashboard;




import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaTools,
  FaClipboardList,
  FaHistory,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaBoxOpen,
  FaCalendarAlt,
} from "react-icons/fa";
import { useNotifications } from "../../context/NotificationContext";
import "./TechnicianDashboard.css";

const BASE_PATH = "/technician-dashboard";

function TechnicianDashboard() {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  const NAV_ITEMS = [
    { label: "Dashboard", path: `${BASE_PATH}`, icon: <FaHome />, end: true },
    { label: "Charges", path: `${BASE_PATH}/charges`, icon: <FaClipboardList /> },
    { label: "My Repairs", path: `${BASE_PATH}/my-repairs`, icon: <FaTools /> },
    { label: "Repair History", path: `${BASE_PATH}/history`, icon: <FaHistory /> },
    { label: "Inventory", path: `${BASE_PATH}/inventory`, icon: <FaBoxOpen /> },
    {
      label: "Notifications",
      path: `${BASE_PATH}/notifications`,
      icon: <FaBell />,
      badge: unreadCount,
    },
    { label: "Leave", path: `${BASE_PATH}/leave`, icon: <FaCalendarAlt /> },
    { label: "Settings", path: `${BASE_PATH}/settings`, icon: <FaCog /> },
  ];

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  const profileImage =
    user.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="tech-container">
      {/* Sidebar */}
      <aside className="tech-sidebar">
        <div className="tech-profile">
          <img src={profileImage} alt="Profile" className="tech-profile-img" />
          <div className="tech-profile-info">
            <h3>
              {user.firstName || "Technician"} {user.lastName || ""}
            </h3>
            <span className="tech-badge">{user.role || "TECHNICIAN"}</span>
          </div>
        </div>

        <nav className="tech-nav-list">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `tech-nav-item ${isActive ? "active" : ""}`
              }
            >
              <div className="nav-item-left">
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </div>

              {/* Sidebar Notification Counter Badge */}
              {Boolean(item.badge && item.badge > 0) && (
                <span className="nav-unread-badge">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="tech-main-content">
        <header className="tech-topbar">
          <div className="tech-topbar-left">
            <h2>Technician Workspace</h2>
            <p>Welcome back, {user.firstName || "Technician"} 👋</p>
          </div>

          <div className="tech-topbar-info">
            {/* Styled Notification Bell */}
            <button
              className="topbar-bell-btn"
              onClick={() => navigate(`${BASE_PATH}/notifications`)}
              aria-label="View notifications"
              title="Notifications"
            >
              <FaBell className="topbar-bell-icon" />
              {unreadCount > 0 && (
                <span className="topbar-bell-badge">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* Date Display */}
            <span className="tech-topbar-date">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>

            {/* Header Logout Button */}
            <button
              onClick={handleLogout}
              className="topbar-logout-btn"
              title="Logout"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Nested Route Content */}
        <section className="tech-content-body">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default TechnicianDashboard;