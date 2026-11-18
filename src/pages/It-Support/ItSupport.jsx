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
} from "react-icons/fa";

// Official Zaid Infotech logo (same file as the HR layout).
// Original size: 1742 x 903 px (aspect ratio ~1.93). Never edit or recreate it.
import logo from "../../assets/images/zaidinfotechlogo.png";

import "./It-support.css";

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
  // UI only: if the profile image fails to load, show the initials avatar
  const [avatarFailed, setAvatarFailed] = useState(false);

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

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ==============================================
  // RESET AVATAR ERROR WHEN IMAGE CHANGES
  // ==============================================

  useEffect(() => {
    setAvatarFailed(false);
  }, [profileImage]);

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
          `it-menu-item ${isActive ? "active" : ""}`
        }
        onClick={() => setSidebarOpen(false)}
      >
        <span className="it-menu-icon">
          {item.icon}
        </span>

        <span className="it-menu-label">
          {item.label}
        </span>

        {item.badge && (
          <span className="it-menu-badge">
            {item.badge}
          </span>
        )}
      </NavLink>
    ));

  // ==============================================
  // USER AVATAR
  // ==============================================

  const renderAvatar = () =>
    profileImage && !avatarFailed ? (
      <img
        src={profileImage}
        alt={fullName}
        className="it-user-avatar"
        onError={() => setAvatarFailed(true)}
      />
    ) : (
      <span className="it-user-avatar it-user-initials">
        {initials}
      </span>
    );

  // ==============================================
  // MAIN JSX
  // ==============================================

  return (
    <div className="it-layout">

      {/* ======================================
          TOP NAVBAR
      ====================================== */}

      <header className="it-topbar">

        <button
          type="button"
          className="it-menu-toggle"
          onClick={() =>
            setSidebarOpen((prev) => !prev)
          }
          aria-label="Toggle navigation"
          aria-expanded={sidebarOpen}
          aria-controls="it-sidebar"
        >
          <FaBars />
        </button>

        <div className="it-topbar-right">

          {/* USER PROFILE */}

          <div
            className="it-user-menu"
            ref={dropdownRef}
          >

            <button
              type="button"
              className="it-user"
              onClick={() =>
                setUserDropdownOpen((prev) => !prev)
              }
              aria-expanded={userDropdownOpen}
              aria-label="Open user menu"
            >

              <span className="it-avatar-wrapper">
                {renderAvatar()}

                <span className="it-status-online" />
              </span>

              <span className="it-user-meta">
                <span className="it-user-name">
                  {fullName}
                </span>

                <span className="it-user-role">
                  {roleName}
                </span>
              </span>

              <FaChevronDown
                className={`it-user-chevron ${
                  userDropdownOpen ? "rotated" : ""
                }`}
              />

            </button>

            {/* DROPDOWN */}

            {userDropdownOpen && (
              <div className="it-dropdown">

                <div className="it-dropdown-meta">
                  <p className="it-meta-name">
                    {fullName}
                  </p>

                  <p className="it-meta-email">
                    {userEmail}
                  </p>
                </div>

                <div className="it-dropdown-divider" />

                {/* ACCOUNT SETTINGS */}

                <button
                  type="button"
                  className="it-dropdown-link"
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
                  className="it-dropdown-link"
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

                <div className="it-dropdown-divider" />

                {/* SIGN OUT */}

                <button
                  type="button"
                  className="it-dropdown-link text-danger"
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

      {/* MOBILE OVERLAY */}

      <div
        className={`it-overlay ${sidebarOpen ? "is-open" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside
        id="it-sidebar"
        className={`it-sidebar ${
          sidebarOpen ? "is-open" : ""
        }`}
      >

        {/* Decorative wave */}
        <svg
          className="it-sidebar-wave"
          viewBox="0 0 260 260"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <path
              key={i}
              d={`M-10 ${190 + i * 3} C 50 ${150 + i * 2}, 90 ${230 - i * 2}, 150 ${
                170 + i * 2
              } S 230 ${110 + i * 3}, 280 ${120 + i * 2}`}
              fill="none"
              stroke="#57a41d"
              strokeWidth="0.6"
              opacity={0.14 + i * 0.03}
            />
          ))}
        </svg>

        {/* BRAND */}

        <div className="it-sidebar-header">
          {/* Official logo on a light card. Size comes from CSS (width-driven,
              height: auto), so the original 1742x903 shape is preserved. */}
          <button
            type="button"
            className="it-brand"
            onClick={() => navigate(BASE_PATH)}
            aria-label="Zaid Infotech - IT Support Dashboard"
          >
            <img
              src={logo}
              alt="Zaid Infotech"
              className="it-logo"
              width="1742"
              height="903"
              decoding="async"
              draggable={false}
            />
          </button>

          <button
            type="button"
            className="it-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* SIDEBAR NAVIGATION */}

        <div className="it-nav-container">

          {/* PRIMARY NAV */}

          <div className="it-nav-group">

            <button
              type="button"
              className="it-menu-title it-menu-title-btn"
              onClick={() =>
                setMenuExpanded((prev) => !prev)
              }
              aria-expanded={menuExpanded}
            >
              <span>IT SUPPORT</span>

              <FaChevronDown
                size={10}
                className="it-menu-title-caret"
                style={{
                  transform: menuExpanded
                    ? "rotate(0deg)"
                    : "rotate(-90deg)",
                }}
              />
            </button>

            {menuExpanded && (
              <nav
                className="it-sidebar-menu"
                aria-label="IT Support navigation"
              >
                {renderNavLinks(PRIMARY_NAV)}
              </nav>
            )}
          </div>

          {/* SECONDARY NAV */}

          <div className="it-nav-group">

            <div className="it-menu-title">
              <span>SETTINGS & SUPPORT</span>
            </div>

            <nav
              className="it-sidebar-menu"
              aria-label="Settings and support"
            >
              {renderNavLinks(SECONDARY_NAV)}
            </nav>

          </div>

        </div>

        {/* SIDEBAR FOOTER */}

        <div className="it-sidebar-footer">
          <button
            type="button"
            className="it-logout-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* ======================================
          PAGE CONTENT
      ====================================== */}

      <main className="it-main">
        <div className="it-main-content">
          <Outlet />
        </div>
      </main>

    </div>
  );
}