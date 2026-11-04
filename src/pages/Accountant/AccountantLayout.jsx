
import React, { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  FaCalculator,
  FaTachometerAlt,
  FaCashRegister,
  FaFileInvoiceDollar,
  FaMoneyCheckAlt,
  FaShoppingCart,
  FaChartLine,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaWallet
} from "react-icons/fa";

import "./AccountantLayout.css";

// =====================================================
// ACCOUNTANT LAYOUT
// =====================================================

export default function AccountantLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(
    typeof window !== "undefined" && window.innerWidth > 768
  );

  // =====================================================
  // CLOSE SIDEBAR AFTER MOBILE ROUTE CHANGE
  // =====================================================

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    navigate("/login", { replace: true });
  };

  // =====================================================
  // SIDEBAR NAVIGATION
  // PATHS MATCH APP.JSX ROUTES
  // =====================================================


const navigationSections = [
  {
    heading: "ACCOUNTANT",
    links: [
      {
        name: "Dashboard",
        path: "/accountant-dashboard",
        icon: FaTachometerAlt,
        end: true
      }
    ]
  },
  {
    heading: "SALES & PAYMENT",
    links: [
      {
        name: "Sales & Payments",
        path: "/accountant-dashboard/accountant/sales-payments",
        icon: FaCashRegister
      }
    ]
  },
  {
    heading: "INVOICES",
    links: [
      {
        name: "Invoices",
        path: "/accountant-dashboard/accountant/invoices",
        icon: FaFileInvoiceDollar
      }
    ]
  },
  {
    heading: "SALARY",
    links: [
      {
        name: "Salary Management",
        path: "/accountant-dashboard/accountant/salary",
        icon: FaMoneyCheckAlt
      }
    ]
  },
  {
    heading: "EXPENSES",
    links: [
      {
        name: "Expense Management",
        path: "/accountant-dashboard/accountant/expenses",
        icon: FaWallet
      }
    ]
  },
  {
    heading: "PURCHASE / PROCUREMENT",
    links: [
      {
        name: "Purchase Management",
        path: "/accountant-dashboard/accountant/purchases",
        icon: FaShoppingCart
      }
    ]
  },
  {
    heading: "REPORTS",
    links: [
      {
        name: "Financial Reports",
        path: "/accountant-dashboard/accountant/financial-reports",
        icon: FaChartLine
      }
    ]
  }
];


  // =====================================================
  // SIDEBAR TOGGLE
  // =====================================================

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="acc-layout-root">

      {/* MOBILE TOPBAR */}
      <header className="acc-mobile-topbar">

        <div className="acc-brand-badge">
          <FaCalculator className="acc-brand-icon" />
          <span>ZAID INFOTECH</span>
        </div>

        <button
          type="button"
          className="acc-menu-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle accountant menu"
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

      </header>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="acc-sidebar-overlay"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`acc-sidebar ${
          isSidebarOpen
            ? "acc-sidebar-open"
            : "acc-sidebar-collapsed"
        }`}
      >

        {/* BRAND */}
        <div className="acc-sidebar-brand">

          <div className="acc-brand-avatar">
            <FaCalculator />
          </div>

          <div className="acc-brand-text">
            <h3>ZAID INFOTECH</h3>
            <span>Accounts & Finance</span>
          </div>

        </div>

        {/* NAVIGATION */}
        <nav className="acc-nav-section">

          {navigationSections.map((section) => (
            <div
              className="acc-nav-group"
              key={section.heading}
            >

              <span className="acc-nav-heading">
                {section.heading}
              </span>

              {section.links.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.end || false}
                    onClick={closeMobileSidebar}
                    className={({ isActive }) =>
                      `acc-nav-item ${
                        isActive
                          ? "acc-nav-item-active"
                          : ""
                      }`
                    }
                  >

                    <Icon className="acc-nav-icon" />

                    <span>{link.name}</span>

                  </NavLink>
                );
              })}

            </div>
          ))}

        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="acc-sidebar-footer">

          <div className="acc-user-profile">

            <div className="acc-user-badge">
              A
            </div>

            <div className="acc-user-meta">
              <strong>Accountant</strong>
              <small>Finance Session</small>
            </div>

          </div>

          <button
            type="button"
            className="acc-logout-btn"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
          >
            <FaSignOutAlt />
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="acc-main-canvas">
        <Outlet />
      </main>

    </div>
  );
}
