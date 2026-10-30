// import React, { useState, useEffect, useRef } from "react";
// import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
// import {
//   FaHome,
//   FaClipboardList,
//   FaTicketAlt,
//   FaCalendarAlt,
//   FaCog,
//   FaSignOutAlt,
//   FaBell,
//   FaSearch,
//   FaBars,
//   FaTimes,
//   FaChevronDown,
//   FaChevronUp,
//   FaMoon,
//   FaHeadset,
//   FaShieldAlt,
//   FaSlidersH,
// } from "react-icons/fa";
// import { useNotifications } from "../../context/NotificationContext";
// import "./It-support.css";

// const BASE_PATH = "/itsupport-dashboard";

// export default function ItSupport() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { unreadCount = 3 } = useNotifications?.() || {};

//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const [menuExpanded, setMenuExpanded] = useState(true);
//   const dropdownRef = useRef(null);

//   // Auto-close drawer on mobile route change
//   useEffect(() => {
//     setSidebarOpen(false);
//   }, [location.pathname]);

//   // Click outside to dismiss user modal
//   useEffect(() => {
//     const handleOutsideClick = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setUserDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, []);

//   const user = (() => {
//     try {
//       return JSON.parse(localStorage.getItem("user")) || {};
//     } catch {
//       return {};
//     }
//   })();

//   const fullName = `${user.firstName || "Emirhan"} ${user.lastName || "Boruch"}`.trim();
//   const profileImage =
//     user.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80";

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/");
//   };

//   const PRIMARY_NAV = [
//     { label: "Dashboard", path: `${BASE_PATH}`, icon: <FaHome />, end: true },
//     { label: "Tickets & Queue", path: `${BASE_PATH}/add-new-ticket`, icon: <FaTicketAlt />, badge: "NEW" },
//     { label: "Billing & Rates", path: `${BASE_PATH}/charges`, icon: <FaClipboardList /> },
//     { label: "Leave", path: `${BASE_PATH}/leave`, icon: <FaCalendarAlt /> },
//   ];

//   const SECONDARY_NAV = [
//     { label: "System Config", path: `${BASE_PATH}/settings`, icon: <FaCog /> },
//     { label: "Help Desk", path: `${BASE_PATH}/support`, icon: <FaHeadset /> },
//   ];

//   return (
//     <div className="tail-wrapper">
//       {/* Mobile Backdrop */}
//       {sidebarOpen && (
//         <div 
//           className="tail-backdrop" 
//           onClick={() => setSidebarOpen(false)} 
//         />
//       )}

//       {/* Premium Sidebar */}
//       <aside className={`tail-sidebar ${sidebarOpen ? "open" : ""}`}>
//         {/* Brand Header */}
//         <div className="tail-brand">
//           <div className="brand-logo-gem">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//               <path d="M4 6C4 4.89543 4.89543 4 6 4H8C9.10457 4 10 4.89543 10 6V18C10 19.1046 9.10457 20 8 20H6C4.89543 20 4 19.1046 4 18V6Z" fill="white"/>
//               <path d="M14 6C14 4.89543 14.8954 4 16 4H18C19.1046 4 20 4.89543 20 6V10C20 11.1046 19.1046 12 18 12H16C14.8954 12 14 11.1046 14 10V6Z" fill="white"/>
//               <path d="M14 15C14 14.4477 14.4477 14 15 14H19C19.5523 14 20 14.4477 20 15V19C20 19.5523 19.5523 20 19 20H15C14.4477 20 14 19.5523 14 19V15Z" fill="white" fillOpacity="0.8"/>
//             </svg>
//           </div>
//           <div className="brand-title">
//             IT<span>Support</span>
//           </div>
          
//           <button 
//             className="tail-sidebar-close" 
//             onClick={() => setSidebarOpen(false)}
//             aria-label="Close menu"
//           >
//             <FaTimes />
//           </button>
//         </div>

//         {/* Navigation Categories */}
//         <div className="tail-nav-container">
//           <div className="tail-nav-group">
//             <div 
//               className="tail-group-header" 
//               onClick={() => setMenuExpanded(!menuExpanded)}
//             >
//               <span className="tail-group-title">MENU</span>
//               <span className="tail-group-caret">
//                 {menuExpanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
//               </span>
//             </div>

//             {menuExpanded && (
//               <nav className="tail-nav-links">
//                 {PRIMARY_NAV.map((item) => (
//                   <NavLink
//                     key={item.path}
//                     to={item.path}
//                     end={item.end}
//                     className={({ isActive }) => `tail-nav-link ${isActive ? "active" : ""}`}
//                   >
//                     <span className="nav-item-icon">{item.icon}</span>
//                     <span className="nav-item-text">{item.label}</span>
//                     {item.badge && <span className="tail-chip">{item.badge}</span>}
//                   </NavLink>
//                 ))}
//               </nav>
//             )}
//           </div>

//           <div className="tail-nav-group">
//             <div className="tail-group-header">
//               <span className="tail-group-title">SETTINGS & SUPPORT</span>
//             </div>
//             <nav className="tail-nav-links">
//               {SECONDARY_NAV.map((item) => (
//                 <NavLink
//                   key={item.path}
//                   to={item.path}
//                   className={({ isActive }) => `tail-nav-link ${isActive ? "active" : ""}`}
//                 >
//                   <span className="nav-item-icon">{item.icon}</span>
//                   <span className="nav-item-text">{item.label}</span>
//                 </NavLink>
//               ))}
//             </nav>
//           </div>
//         </div>

//         {/* Sidebar Mini Profile Footnote */}
//         <div className="tail-sidebar-footer">
//           <div className="footer-card">
//             <img src={profileImage} alt={fullName} className="footer-avatar" />
//             <div className="footer-info">
//               <p className="footer-name">{fullName}</p>
//               <span className="footer-role">{user.role || "Technician"}</span>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* Main View Area */}
//       <div className="tail-content-area">
//         {/* Top Navbar */}
//         <header className="tail-navbar">
//           <div className="navbar-left">
//             <button
//               className="navbar-toggle-btn"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               aria-label="Toggle navigation"
//             >
//               <FaBars />
//             </button>

//             {/* Omni Search Bar */}
//             <div className="tail-search-bar">
//               <FaSearch className="search-icon" />
//               <input 
//                 type="text" 
//                 placeholder="Search or type command..." 
//               />
//               <span className="search-shortcut">⌘K</span>
//             </div>
//           </div>

//           <div className="navbar-right">
//             {/* Theme Toggle Button */}
//             {/* <button className="nav-icon-action" title="Toggle Theme">
//               <FaMoon />
//             </button> */}

//             {/* Notification Bell */}
//             {/* <button
//               className="nav-icon-action"
//               onClick={() => navigate(`${BASE_PATH}/notifications`)}
//               title="Notifications"
//             >
//               <FaBell />
//               {unreadCount > 0 && <span className="bell-glow-indicator" />}
//             </button> */}

//             {/* Modern User Profile Menu */}
//             <div className="user-profile-menu" ref={dropdownRef}>
//               <button 
//                 className="user-btn-trigger" 
//                 onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//               >
//                 <div className="avatar-wrapper">
//                   <img src={profileImage} alt={fullName} className="user-nav-avatar" />
//                   <span className="status-online" />
//                 </div>
//                 <span className="user-nav-name">{fullName}</span>
//                 <FaChevronDown className={`chevron ${userDropdownOpen ? "rotated" : ""}`} />
//               </button>

//               {userDropdownOpen && (
//                 <div className="tail-dropdown-modal">
//                   <div className="dropdown-meta">
//                     <p className="meta-name">{fullName}</p>
//                     <p className="meta-email">{user.email || "support@zaidinfotech.com"}</p>
//                   </div>
//                   <div className="dropdown-divider" />
//                   <button 
//                     className="dropdown-link" 
//                     onClick={() => { navigate(`${BASE_PATH}/settings`); setUserDropdownOpen(false); }}
//                   >
//                     <FaSlidersH /> Account Settings
//                   </button>
//                   <button 
//                     className="dropdown-link" 
//                     onClick={() => { navigate(`${BASE_PATH}/support`); setUserDropdownOpen(false); }}
//                   >
//                     <FaShieldAlt /> Security & Logs
//                   </button>
//                   <div className="dropdown-divider" />
//                   <button className="dropdown-link text-danger" onClick={handleLogout}>
//                     <FaSignOutAlt /> Sign Out
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* Nested Content Body */}
//         <main className="tail-viewport">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  FaHome,
  FaClipboardList,
  FaTicketAlt,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaSlidersH,
  FaShieldAlt,
  FaHeadset,
  FaUserCircle,
} from "react-icons/fa";

import "./It-support.css";

// CORRECT LOGO PATH
import zaidLogo from "../../assets/images/zaidlogo.png";

const BASE_PATH = "/itsupport-dashboard";

// ==============================================
// READ LOGGED-IN USER
// ==============================================

const getLoggedInUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) return {};

    const parsed = JSON.parse(storedUser);

    return (
      parsed?.user ||
      parsed?.data?.user ||
      parsed?.data ||
      parsed
    );
  } catch (error) {
    console.error("IT SUPPORT USER ERROR:", error);
    return {};
  }
};

// ==============================================
// IT SUPPORT LAYOUT
// ==============================================

export default function ItSupport() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] =
    useState(false);
  const [menuExpanded, setMenuExpanded] = useState(true);

  const [user, setUser] = useState(getLoggedInUser);

  const dropdownRef = useRef(null);

  // ==============================================
  // SYNC USER WHEN AUTH CHANGES
  // ==============================================

  useEffect(() => {
    const syncUser = () => {
      setUser(getLoggedInUser());
    };

    window.addEventListener("authChanged", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("authChanged", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  // ==============================================
  // CLOSE SIDEBAR ON ROUTE CHANGE
  // ==============================================

  useEffect(() => {
    setSidebarOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // ==============================================
  // CLOSE DROPDOWN ON OUTSIDE CLICK
  // ==============================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // ==============================================
  // USER DETAILS
  // ==============================================

  const fullName =
    [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    user?.name ||
    user?.fullName ||
    "IT Support User";

  const roleName = String(
    user?.role || "IT_SUPPORT"
  )
    .replace(/_/g, " ")
    .toUpperCase();

  const profileImage =
    typeof user?.profileImage === "string"
      ? user.profileImage.trim()
      : "";

  const userEmail = user?.email || "Not available";

  // ==============================================
  // LOGOUT
  // ==============================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    setSidebarOpen(false);
    setUserDropdownOpen(false);

    navigate("/", { replace: true });
  };

  // ==============================================
  // PRIMARY NAVIGATION
  // ==============================================

  const PRIMARY_NAV = [
    {
      label: "Dashboard",
      path: BASE_PATH,
      icon: <FaHome />,
      end: true,
    },
    {
      label: "Tickets & Queue",
      path: `${BASE_PATH}/add-new-ticket`,
      icon: <FaTicketAlt />,
      badge: "NEW",
    },
    {
      label: "Billing & Rates",
      path: `${BASE_PATH}/charges`,
      icon: <FaClipboardList />,
    },
    {
      label: "Leave",
      path: `${BASE_PATH}/leave`,
      icon: <FaCalendarAlt />,
    },
  ];

  // ==============================================
  // SECONDARY NAVIGATION
  // ==============================================

  const SECONDARY_NAV = [
    {
      label: "System Config",
      path: `${BASE_PATH}/settings`,
      icon: <FaCog />,
    },
    {
      label: "Help Desk",
      path: `${BASE_PATH}/support`,
      icon: <FaHeadset />,
    },
  ];

  // ==============================================
  // RENDER NAVIGATION LINKS
  // ==============================================

  const renderNavLinks = (items) =>
    items.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.end || false}
        className={({ isActive }) =>
          `tail-nav-link ${isActive ? "active" : ""}`
        }
        onClick={() => setSidebarOpen(false)}
      >
        <span className="nav-item-icon">
          {item.icon}
        </span>

        <span className="nav-item-text">
          {item.label}
        </span>

        {item.badge && (
          <span className="tail-nav-badge">
            {item.badge}
          </span>
        )}
      </NavLink>
    ));

  // ==============================================
  // USER AVATAR
  // ==============================================

  const renderAvatar = () =>
    profileImage ? (
      <img
        src={profileImage}
        alt={fullName}
        className="user-nav-avatar"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    ) : (
      <FaUserCircle
        size={36}
        className="user-nav-avatar-icon"
      />
    );

  // ==============================================
  // MAIN JSX
  // ==============================================

  return (
    <div className="tail-wrapper">

      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div
          className="tail-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside
        className={`tail-sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >

        {/* BRAND */}

        <div className="tail-brand">
          <div className="brand-title">
            <img
              src={zaidLogo}
              alt="Zaid Infotech Logo"
              className="brand-image"
            />
          </div>

          <button
            type="button"
            className="tail-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* SIDEBAR NAVIGATION */}

        <div className="tail-nav-container">

          {/* PRIMARY NAV */}

          <div className="tail-nav-group">

            <button
              type="button"
              className="tail-group-header"
              onClick={() =>
                setMenuExpanded((prev) => !prev)
              }
              aria-expanded={menuExpanded}
            >
              <span className="tail-group-title">
                IT SUPPORT
              </span>

              <span className="tail-group-caret">
                <FaChevronDown
                  size={10}
                  style={{
                    transform: menuExpanded
                      ? "rotate(0deg)"
                      : "rotate(-90deg)",
                  }}
                />
              </span>
            </button>

            {menuExpanded && (
              <nav
                className="tail-nav-links"
                aria-label="IT Support navigation"
              >
                {renderNavLinks(PRIMARY_NAV)}
              </nav>
            )}
          </div>

          {/* SECONDARY NAV */}

          <div className="tail-nav-group">

            <div className="tail-group-header">
              <span className="tail-group-title">
                SETTINGS & SUPPORT
              </span>
            </div>

            <nav
              className="tail-nav-links"
              aria-label="Settings and support"
            >
              {renderNavLinks(SECONDARY_NAV)}
            </nav>

          </div>

        </div>

        {/* SIDEBAR FOOTER */}

        <div className="tail-sidebar-footer">
          <button
            type="button"
            className="tail-nav-link tail-logout"
            onClick={handleLogout}
          >
            <span className="nav-item-icon">
              <FaSignOutAlt />
            </span>

            <span className="nav-item-text">
              Logout
            </span>
          </button>
        </div>

      </aside>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <div className="tail-content-area">

        {/* TOP NAVBAR */}

        <header className="tail-navbar">

          {/* LEFT */}

          <div className="navbar-left">

            <button
              type="button"
              className="navbar-toggle-btn"
              onClick={() =>
                setSidebarOpen((prev) => !prev)
              }
              aria-label="Toggle navigation"
              aria-expanded={sidebarOpen}
            >
              <FaBars />
            </button>

          </div>

          {/* RIGHT */}

          <div className="navbar-right">

            {/* USER PROFILE */}

            <div
              className="user-profile-menu"
              ref={dropdownRef}
            >

              <button
                type="button"
                className="user-btn-trigger"
                onClick={() =>
                  setUserDropdownOpen((prev) => !prev)
                }
                aria-expanded={userDropdownOpen}
                aria-label="Open user menu"
              >

                <div className="avatar-wrapper">
                  {renderAvatar()}

                  <span className="status-online" />
                </div>

                <div className="user-nav-info">
                  <span className="user-nav-name">
                    {fullName}
                  </span>

                  <span className="user-nav-role">
                    {roleName}
                  </span>
                </div>

                <FaChevronDown
                  className={`chevron ${
                    userDropdownOpen ? "rotated" : ""
                  }`}
                />

              </button>

              {/* DROPDOWN */}

              {userDropdownOpen && (
                <div className="tail-dropdown-modal">

                  <div className="dropdown-meta">
                    <p className="meta-name">
                      {fullName}
                    </p>

                    <p className="meta-email">
                      {userEmail}
                    </p>
                  </div>

                  <div className="dropdown-divider" />

                  {/* ACCOUNT SETTINGS */}

                  <button
                    type="button"
                    className="dropdown-link"
                    onClick={() => {
                      navigate(
                        `${BASE_PATH}/settings`
                      );

                      setUserDropdownOpen(false);
                    }}
                  >
                    <FaSlidersH />
                    Account Settings
                  </button>

                  {/* SECURITY */}

                  <button
                    type="button"
                    className="dropdown-link"
                    onClick={() => {
                      navigate(
                        `${BASE_PATH}/support`
                      );

                      setUserDropdownOpen(false);
                    }}
                  >
                    <FaShieldAlt />
                    Security & Logs
                  </button>

                  <div className="dropdown-divider" />

                  {/* SIGN OUT */}

                  <button
                    type="button"
                    className="dropdown-link text-danger"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />
                    Sign Out
                  </button>

                </div>
              )}

            </div>

          </div>

        </header>

        {/* ======================================
            PAGE CONTENT
        ====================================== */}

        <main className="tail-viewport">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
