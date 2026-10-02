import React, { useCallback, useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FaHome,
  FaShoppingCart,
  FaBoxOpen,
  FaReceipt,
  FaHeadset,
  FaBuilding,
  FaMapMarkerAlt,
  FaBell,
  FaSignOutAlt,
  FaHeart,
  FaLock,
} from "react-icons/fa";

import { getMyNotifications } from "../../services/notificationService";

import "./CorporateLayout.css";

// =====================================================
// CORPORATE MENU
//
// badge: true  -> shows the unread notification count
// =====================================================

const corporateMenu = [
  {
    label: "Home",
    path: "/",
    icon: <FaHome />,
    end: true,
  },
  {
    label: "Overview",
    path: "/corporate-dashboard",
    icon: <FaHome />,
    end: true,
  },
  {
    label: "Notifications",
    path: "/corporate-dashboard/notifications",
    icon: <FaBell />,
    badge: true,
  },
  {
    label: "Add Address",
    path: "/corporate-dashboard/add-address",
    icon: <FaMapMarkerAlt />,
  },
  {
    label: "New Order",
    path: "/shop",
    icon: <FaShoppingCart />,
  },
  {
    label: "My Orders",
    path: "/corporate-dashboard/orders",
    icon: <FaBoxOpen />,
  },
  {
    label: "Wishlist",
    path: "/corporate-dashboard/wishlist",
    icon: <FaHeart />,
  },
  {
    label: "Cart",
    path: "/corporate-dashboard/cart",
    icon: <FaShoppingCart />,
  },
  {
    label: "Invoices",
    path: "/corporate-dashboard/invoices",
    icon: <FaReceipt />,
  },
  {
    label: "Support",
    path: "/corporate-dashboard/support",
    icon: <FaHeadset />,
  },
  {
    label: "Company Profile",
    path: "/corporate-dashboard/profile",
    icon: <FaBuilding />,
  },
  {
    label: "Change Password",
    path: "/corporate-dashboard/change-password",
    icon: <FaLock />,
  },
];

// =====================================================
// CORPORATE LAYOUT (sidebar + child page)
// =====================================================

export default function CorporateLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);

  // ---------------------------------------------------
  // UNREAD COUNT (sidebar badge)
  // ---------------------------------------------------

  const loadUnreadCount = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await getMyNotifications();

      setUnreadCount(Number(response?.unreadCount || 0));
    } catch (error) {
      console.error("CORPORATE UNREAD COUNT ERROR:", error);
    }
  }, []);

  // Load on mount and whenever the user moves between pages
  useEffect(() => {
    loadUnreadCount();
  }, [location.pathname, loadUnreadCount]);

  // CorporateNotifications fires this after marking items read
  useEffect(() => {
    const handleUpdated = () => loadUnreadCount();

    window.addEventListener("notifications-updated", handleUpdated);

    return () => {
      window.removeEventListener(
        "notifications-updated",
        handleUpdated
      );
    };
  }, [loadUnreadCount]);

  // ---------------------------------------------------
  // LOGOUT (same keys the customer dashboard clears)
  // ---------------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="corp-layout">
      {/* SIDEBAR */}

      <aside className="corp-sidebar">
        <nav className="corp-sidebar-menu">
          {corporateMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `corp-menu-item ${isActive ? "active" : ""}`
              }
            >
              <span className="corp-menu-icon">{item.icon}</span>
              <span className="corp-menu-label">{item.label}</span>

              {item.badge && unreadCount > 0 && (
                <span
                  className="corp-menu-badge"
                  aria-label={`${unreadCount} unread notifications`}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT (pinned to the bottom of the sidebar) */}

        <div className="corp-sidebar-footer">
          <button
            type="button"
            className="corp-logout-btn"
            onClick={handleLogout}
          >
            <span className="corp-menu-icon">
              <FaSignOutAlt />
            </span>
            <span className="corp-menu-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* CHILD PAGE */}

      <main className="corp-main">
        <Outlet />
      </main>
    </div>
  );
}