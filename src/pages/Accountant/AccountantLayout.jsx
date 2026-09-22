import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

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
  FaWallet,
} from "react-icons/fa";

import "./AccountantLayout.css";

export default function AccountantLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigate = useNavigate();

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    navigate("/login");
  };

  return (
    <div className="acc-layout-root">

      {/* =====================================================
          MOBILE TOPBAR
      ===================================================== */}

      <header className="acc-mobile-topbar">

        <div className="acc-brand-badge">

          <FaCalculator className="acc-brand-icon" />

          <span>ZAID INFOTECH</span>

        </div>

        <button
          type="button"
          className="acc-menu-toggle-btn"
          onClick={() =>
            setIsSidebarOpen((prev) => !prev)
          }
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

      </header>


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`acc-sidebar ${
          isSidebarOpen
            ? "acc-sidebar-open"
            : "acc-sidebar-collapsed"
        }`}
      >

        {/* =================================================
            BRAND
        ================================================= */}

        <div className="acc-sidebar-brand">

          <div className="acc-brand-avatar">
            <FaCalculator />
          </div>

          <div className="acc-brand-text">

            <h3>ZAID INFOTECH</h3>

            <span>Accounts & Finance</span>

          </div>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="acc-nav-section">

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <span className="acc-nav-heading">
            ACCOUNTANT
          </span>

          <NavLink
            to="/accountant-dashboard"
            end
            className={({ isActive }) =>
              `acc-nav-item ${
                isActive
                  ? "acc-nav-item-active"
                  : ""
              }`
            }
          >
            <FaTachometerAlt className="acc-nav-icon" />

            <span>Dashboard</span>

          </NavLink>


          {/* =================================================
              SALES & PAYMENT
          ================================================= */}

          <span className="acc-nav-heading">
            SALES & PAYMENT
          </span>

          <NavLink
            to="/accountant-dashboard/sales-payments"
            className={({ isActive }) =>
              `acc-nav-item ${
                isActive
                  ? "acc-nav-item-active"
                  : ""
              }`
            }
          >
            <FaCashRegister className="acc-nav-icon" />

            <span>Sales & Payments</span>

          </NavLink>


          {/* =================================================
              INVOICES
          ================================================= */}

          <span className="acc-nav-heading">
            INVOICES
          </span>

          <NavLink
            to="/accountant-dashboard/invoices"
            className={({ isActive }) =>
              `acc-nav-item ${
                isActive
                  ? "acc-nav-item-active"
                  : ""
              }`
            }
          >
            <FaFileInvoiceDollar className="acc-nav-icon" />

            <span>Invoices</span>

          </NavLink>


          {/* =================================================
              SALARY
          ================================================= */}

          <span className="acc-nav-heading">
            SALARY
          </span>

          <NavLink
            to="/accountant-dashboard/salary"
            className={({ isActive }) =>
              `acc-nav-item ${
                isActive
                  ? "acc-nav-item-active"
                  : ""
              }`
            }
          >
            <FaMoneyCheckAlt className="acc-nav-icon" />

            <span>Salary Management</span>

          </NavLink>


          {/* =================================================
              EXPENSES
          ================================================= */}

          <span className="acc-nav-heading">
            EXPENSES
          </span>

          <NavLink
            to="/accountant-dashboard/expenses"
            className={({ isActive }) =>
              `acc-nav-item ${
                isActive
                  ? "acc-nav-item-active"
                  : ""
              }`
            }
          >
            <FaWallet className="acc-nav-icon" />

            <span>Expense Management</span>

          </NavLink>


          {/* =================================================
              PURCHASE / PROCUREMENT
          ================================================= */}

          <span className="acc-nav-heading">
            PURCHASE / PROCUREMENT
          </span>

          <NavLink
            to="/accountant-dashboard/purchase-management"
            className={({ isActive }) =>
              `acc-nav-item ${
                isActive
                  ? "acc-nav-item-active"
                  : ""
              }`
            }
          >
            <FaShoppingCart className="acc-nav-icon" />

            <span>Purchase Management</span>

          </NavLink>


          {/* =================================================
              FINANCIAL REPORTS
          ================================================= */}

          <span className="acc-nav-heading">
            REPORTS
          </span>

          <NavLink
            to="/accountant-dashboard/financial-reports"
            className={({ isActive }) =>
              `acc-nav-item ${
                isActive
                  ? "acc-nav-item-active"
                  : ""
              }`
            }
          >
            <FaChartLine className="acc-nav-icon" />

            <span>Financial Reports</span>

          </NavLink>

        </nav>


        {/* =====================================================
            FOOTER
        ===================================================== */}

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
          >
            <FaSignOutAlt />
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
          IMPORTANT:
          Only this area changes when clicking sidebar.
      ===================================================== */}

      <main className="acc-main-canvas">

        <Outlet />

      </main>

    </div>
  );
}

