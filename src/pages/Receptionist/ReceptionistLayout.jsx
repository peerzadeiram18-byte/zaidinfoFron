// import React, { useState } from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import {
//   FaCashRegister,
//   FaTools,
//   FaReceipt,
//   FaUserFriends,
//   FaSignOutAlt,
//   FaBars,
//   FaTimes,
//   FaHeadset,
//   FaPeopleCarry
// } from "react-icons/fa";
// import "./ReceptionistLayout.css";

// export default function ReceptionistLayout() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
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
//       <aside className={`rep-sidebar ${isSidebarOpen ? "rep-sidebar-open" : "rep-sidebar-collapsed"}`}>
//         <div className="rep-sidebar-brand">
//           <div className="rep-brand-avatar">
//             <FaHeadset />
//           </div>
//           <div className="rep-brand-text">
//             <h3>ZAID INFOTECH</h3>
//             <span>Front Desk & POS</span>
//           </div>
//         </div>

//         <nav className="rep-nav-section">
//           <span className="rep-nav-heading">POS COUNTER</span>
         
//           <span className="rep-nav-heading">REPAIR & SERVICES</span>
//           <NavLink
//             to="/receptionist-dashboard" end={true}
//             className={({ isActive }) =>
//               `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
//             }
//           >
//             <FaTools className="rep-nav-icon" />
//             <span>Receptionist Dashboard</span>
//           </NavLink>
//           <NavLink
//             to="/receptionist-dashboard/repair-customers"
//             className={({ isActive }) =>
//               `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
//             }
//           >
//             <FaPeopleCarry className="rep-nav-icon" />
//             <span>Repair Customers</span>
//           </NavLink>

//           <NavLink
//             to="/receptionist-dashboard/repair-rates"
//             className={({ isActive }) =>
//               `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
//             }
//           >
//             <FaReceipt className="rep-nav-icon" />
//             <span>Repair Rate Cards</span>
//           </NavLink>

//           <span className="rep-nav-heading">STAFF & ADMIN</span>
//           <NavLink
//             to="/receptionist-dashboard/staff-list"
//             className={({ isActive }) =>
//               `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
//             }
//           >
//             <FaUserFriends className="rep-nav-icon" />
//             <span>Receptionist Staff</span>
//           </NavLink>
//         </nav>

//         {/* Sidebar Footer Info */}
//         <div className="rep-sidebar-footer">
//           <div className="rep-user-profile">
//             <div className="rep-user-badge">R</div>
//             <div className="rep-user-meta">
//               <strong>Reception Desk</strong>
//               <small>Online Session</small>
//             </div>
//           </div>
//           <button type="button" className="rep-logout-btn" onClick={handleLogout} title="Logout">
//             <FaSignOutAlt />
//           </button>
//         </div>
//       </aside>

//       {/* Main Outlet Window */}
//       <main className="rep-main-canvas">
//         <Outlet />
//       </main>
//     </div>
//   );
// }


import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaCashRegister,
  FaTools,
  FaReceipt,
  FaUserFriends,
  FaLaptop,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHeadset,
  FaPeopleCarry,
  FaPlusCircle,
  FaListAlt,
  FaCalendarPlus,
  FaCalendarCheck,
  FaClipboardList
} from "react-icons/fa";
import "./ReceptionistLayout.css";

export default function ReceptionistLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="rep-layout-root">
      {/* Mobile Topbar Toggle */}
      <header className="rep-mobile-topbar">
        <div className="rep-brand-badge">
          <FaHeadset className="rep-brand-icon" />
          <span>ZAID INFOTECH</span>
        </div>
        <button
          type="button"
          className="rep-menu-toggle-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`rep-sidebar ${isSidebarOpen ? "rep-sidebar-open" : "rep-sidebar-collapsed"}`}>
        {/* Compact Header */}
        <div className="rep-sidebar-brand">
          <div className="rep-brand-avatar">
            <FaHeadset />
          </div>
          <div className="rep-brand-text">
            <h3>ZAID INFOTECH</h3>
            <span>Front Desk & POS</span>
          </div>
        </div>

        {/* Scrollable Navigation Menu */}
        <nav className="rep-nav-section">
          <span className="rep-nav-heading">POS COUNTER</span>
          <NavLink
            to="/receptionist-dashboard"
            end={true}
            className={({ isActive }) =>
              `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
            }
          >
            <FaCashRegister className="rep-nav-icon" />
            <span>Sales Dashboard</span>
          </NavLink>

          <NavLink
            to="/receptionist-dashboard/walk-in-order/new"
            className={({ isActive }) =>
              `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
            }
          >
            <FaPlusCircle className="rep-nav-icon" />
            <span>New Walk-in Order</span>
          </NavLink>

          {/* NEW — RENTAL */}
          {/* <NavLink
                 to="/receptionist-dashboard/rental/new"
                 className={({ isActive }) =>
                `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
                   }
              >
               <FaLaptop className="rep-nav-icon" />
               <span>New Walk-in Rental</span>
            </NavLink> */}

            {/* RENTAL LIST */}
{/* NEW — RENTAL */}
<NavLink
  to="/receptionist-dashboard/rental/new"
  className={({ isActive }) =>
    `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
  }
>
  <FaLaptop className="rep-nav-icon" />
  <span>New Walk-in Rental</span>
</NavLink>

{/* RENTAL LIST */}
<NavLink
  to="/receptionist-dashboard/rental/orders"
  className={({ isActive }) =>
    `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
  }
>
  <FaClipboardList className="rep-nav-icon" />
  <span>Rental List</span>
</NavLink>

{/* <NavLink
  to="/receptionist-dashboard/walk-in-orders"
  className={({ isActive }) =>
    `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
  }
>
  <FaListAlt className="rep-nav-icon" />
  <span>Walk-in Orders List</span>
</NavLink> */}

          <NavLink
            to="/receptionist-dashboard/walk-in-orders"
            className={({ isActive }) =>
              `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
            }
          >
            <FaListAlt className="rep-nav-icon" />
            <span>Walk-in Orders List</span>
          </NavLink>

          <NavLink
            to="/receptionist-dashboard/customers"
            className={({ isActive }) =>
              `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
            }
          >
            <FaUserFriends className="rep-nav-icon" />
            <span>Customers</span>
          </NavLink>

          <span className="rep-nav-heading">REPAIR & SERVICES</span>
          <NavLink
            to="/receptionist-dashboard/repair-customers"
            className={({ isActive }) =>
              `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
            }
          >
            <FaPeopleCarry className="rep-nav-icon" />
            <span>Repair Customers</span>
          </NavLink>

          <NavLink
            to="/receptionist-dashboard/repair-rates"
            className={({ isActive }) =>
              `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
            }
          >
            <FaReceipt className="rep-nav-icon" />
            <span>Repair Rate Cards</span>
          </NavLink>

          <span className="rep-nav-heading">STAFF & LEAVES</span>
          <NavLink
            to="/receptionist-dashboard/staff-list"
            className={({ isActive }) =>
              `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
            }
          >
            <FaTools className="rep-nav-icon" />
            <span>Receptionist Staff</span>
          </NavLink>

          <NavLink
            to="/receptionist-dashboard/leave/apply"
            className={({ isActive }) =>
              `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
            }
          >
            <FaCalendarPlus className="rep-nav-icon" />
            <span>Apply Leave</span>
          </NavLink>

          <NavLink
            to="/receptionist-dashboard/leaves"
            className={({ isActive }) =>
              `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
            }
          >
            <FaCalendarCheck className="rep-nav-icon" />
            <span>My Leaves</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer Info */}
        <div className="rep-sidebar-footer">
          <div className="rep-user-profile">
            <div className="rep-user-badge">R</div>
            <div className="rep-user-meta">
              <strong>Reception Desk</strong>
              <small>Online Session</small>
            </div>
          </div>
          <button
            type="button"
            className="rep-logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </aside>

      {/* Main Outlet Window */}
      <main className="rep-main-canvas">
        <Outlet />
      </main>
    </div>
  );
}