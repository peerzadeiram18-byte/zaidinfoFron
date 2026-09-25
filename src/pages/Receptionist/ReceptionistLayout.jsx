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
  FaClipboardList,

  // ACCOUNTANT
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaUserTie,
  FaWallet,
  FaShoppingCart,
  FaChartLine,
} from "react-icons/fa";

import "./ReceptionistLayout.css";

export default function ReceptionistLayout() {
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

  // =====================================================
  // CLOSE MOBILE SIDEBAR AFTER NAVIGATION
  // =====================================================

  const handleNavClick = () => {
    if (window.innerWidth <= 992) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="rep-layout-root">

      {/* =====================================================
          MOBILE TOPBAR
      ===================================================== */}

      <header className="rep-mobile-topbar">

        <div className="rep-brand-badge">
          <FaHeadset className="rep-brand-icon" />

          <span>ZAID INFOTECH</span>
        </div>

        <button
          type="button"
          className="rep-menu-toggle-btn"
          onClick={() => {
            setIsSidebarOpen((prev) => !prev);
          }}
          aria-label="Toggle receptionist menu"
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

      </header>


      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {isSidebarOpen && (
        <div
          className="rep-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`rep-sidebar ${
          isSidebarOpen
            ? "rep-sidebar-open"
            : "rep-sidebar-collapsed"
        }`}
      >

        {/* =================================================
            SIDEBAR BRAND
        ================================================= */}

        <div className="rep-sidebar-brand">

          <div className="rep-brand-avatar">
            <FaHeadset />
          </div>

          <div className="rep-brand-text">

            <h3>ZAID INFOTECH</h3>

            <span>Front Desk &amp; POS</span>

          </div>

        </div>


        {/* =================================================
            SCROLLABLE NAVIGATION ONLY
            IMPORTANT:
            Footer is OUTSIDE this section.
            Therefore footer will NOT scroll.
        ================================================= */}

        <nav className="rep-nav-section">

          {/* =================================================
              POS COUNTER
          ================================================= */}

          <span className="rep-nav-heading">
            POS COUNTER
          </span>


          {/* SALES DASHBOARD */}

          <NavLink
            to="/receptionist-dashboard"
            end
            onClick={handleNavClick}
            className={({ isActive }) =>
              `rep-nav-item ${
                isActive ? "rep-nav-item-active" : ""
              }`
            }
          >
            <FaCashRegister className="rep-nav-icon" />

            <span>Sales Dashboard</span>
          </NavLink>


          {/* NEW WALK-IN ORDER */}

          <NavLink
            to="/receptionist-dashboard/walk-in-order/new"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `rep-nav-item ${
                isActive ? "rep-nav-item-active" : ""
              }`
            }
          >
            <FaPlusCircle className="rep-nav-icon" />

            <span>New Walk-in Order</span>
          </NavLink>


          {/* NEW WALK-IN RENTAL */}

          <NavLink
            to="/receptionist-dashboard/rental/new"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `rep-nav-item ${
                isActive ? "rep-nav-item-active" : ""
              }`
            }
          >
            <FaLaptop className="rep-nav-icon" />

            <span>New Walk-in Rental</span>
          </NavLink>


          {/* RENTAL LIST */}

          <NavLink
            to="/receptionist-dashboard/rental/orders"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `rep-nav-item ${
                isActive ? "rep-nav-item-active" : ""
              }`
            }
          >
            <FaClipboardList className="rep-nav-icon" />

            <span>Rental List</span>
          </NavLink>


          {/* WALK-IN ORDERS */}

          <NavLink
            to="/receptionist-dashboard/walk-in-orders"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `rep-nav-item ${
                isActive ? "rep-nav-item-active" : ""
              }`
            }
          >
            <FaListAlt className="rep-nav-icon" />

            <span>Walk-in Orders List</span>
          </NavLink>


          {/* CUSTOMERS */}

          <NavLink
            to="/receptionist-dashboard/customers"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `rep-nav-item ${
                isActive ? "rep-nav-item-active" : ""
              }`
            }
          >
            <FaUserFriends className="rep-nav-icon" />

            <span>Customers</span>
          </NavLink>


          {/* =================================================
              REPAIR & SERVICES
          ================================================= */}

          <span className="rep-nav-heading">
            REPAIR &amp; SERVICES
          </span>


          {/* REPAIR CUSTOMERS */}

          <NavLink
            to="/receptionist-dashboard/repair-customers"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `rep-nav-item ${
                isActive ? "rep-nav-item-active" : ""
              }`
            }
          >
            <FaPeopleCarry className="rep-nav-icon" />

            <span>Repair Customers</span>
          </NavLink>


          {/* REPAIR RATE CARDS */}

          <NavLink
            to="/receptionist-dashboard/repair-rates"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `rep-nav-item ${
                isActive ? "rep-nav-item-active" : ""
              }`
            }
          >
            <FaReceipt className="rep-nav-icon" />

            <span>Repair Rate Cards</span>
          </NavLink>


          {/* =================================================
              STAFF & LEAVES
          ================================================= */}

          <span className="rep-nav-heading">
            STAFF &amp; LEAVES
          </span>


          {/* STAFF */}

          <NavLink
            to="/receptionist-dashboard/staff-list"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `rep-nav-item ${
                isActive ? "rep-nav-item-active" : ""
              }`
            }
          >
            <FaTools className="rep-nav-icon" />

            <span>Receptionist Staff</span>
          </NavLink>


          {/* APPLY LEAVE */}

          <NavLink
            to="/receptionist-dashboard/leave/apply"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `rep-nav-item ${
                isActive ? "rep-nav-item-active" : ""
              }`
            }
          >
            <FaCalendarPlus className="rep-nav-icon" />

            <span>Apply Leave</span>
          </NavLink>


          {/* MY LEAVES */}

          <NavLink
            to="/receptionist-dashboard/leaves"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `rep-nav-item ${
                isActive ? "rep-nav-item-active" : ""
              }`
            }
          >
            <FaCalendarCheck className="rep-nav-icon" />

            <span>My Leaves</span>
          </NavLink>


          {/* =================================================
              ACCOUNTANT
              
              IMPORTANT:
              These routes remain INSIDE
              ReceptionistLayout.

              AccountantLayout is NOT used here.
          ================================================= */}

          <span className="rep-nav-heading">
            ACCOUNTANT
          </span>


          {/* SALES & PAYMENTS */}

          <NavLink
            to="/receptionist-dashboard/accountant/sales-payments"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `rep-nav-item ${
                isActive ? "rep-nav-item-active" : ""
              }`
            }
          >
            <FaMoneyBillWave className="rep-nav-icon" />

            <span>Sales &amp; Payments</span>
          </NavLink>


          {/* INVOICES */}

          <NavLink
            to="/receptionist-dashboard/accountant/invoices"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `rep-nav-item ${
                isActive ? "rep-nav-item-active" : ""
              }`
            }
          >
            <FaFileInvoiceDollar className="rep-nav-icon" />

            <span>Invoices</span>
          </NavLink>


          {/* SALARY */}

          <NavLink
            to="/receptionist-dashboard/accountant/salary"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `rep-nav-item ${
                isActive ? "rep-nav-item-active" : ""
              }`
            }
          >
            <FaUserTie className="rep-nav-icon" />

            <span>Salary</span>
          </NavLink>


          {/* EXPENSES */}

          <NavLink
            to="/receptionist-dashboard/accountant/expenses"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `rep-nav-item ${
                isActive ? "rep-nav-item-active" : ""
              }`
            }
          >
            <FaWallet className="rep-nav-icon" />

            <span>Expenses</span>
          </NavLink>


          {/* PURCHASE / PROCUREMENT */}

          <NavLink
            to="/receptionist-dashboard/accountant/purchases"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `rep-nav-item ${
                isActive ? "rep-nav-item-active" : ""
              }`
            }
          >
            <FaShoppingCart className="rep-nav-icon" />

            <span>Purchase / Procurement</span>
          </NavLink>


          {/* FINANCIAL REPORTS */}

          <NavLink
            to="/receptionist-dashboard/accountant/financial-reports"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `rep-nav-item ${
                isActive ? "rep-nav-item-active" : ""
              }`
            }
          >
            <FaChartLine className="rep-nav-icon" />

            <span>Financial Reports</span>
          </NavLink>

        </nav>


        {/* =====================================================
            FIXED SIDEBAR FOOTER

            IMPORTANT:
            This is outside .rep-nav-section.
            Therefore it will NOT scroll.
        ===================================================== */}

        <div className="rep-sidebar-footer">

          <div className="rep-user-profile">

            <div className="rep-user-badge">
              R
            </div>

            <div className="rep-user-meta">

              <strong>
                Reception Desk
              </strong>

              <small>
                Online Session
              </small>

            </div>

          </div>


          {/* LOGOUT */}

          <button
            type="button"
            className="rep-logout-btn"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
          >
            <FaSignOutAlt />
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT

          ReceptionistLayout FIXED.
          Only Outlet content changes.
      ===================================================== */}

      <main className="rep-main-canvas">

        <Outlet />

      </main>

    </div>
  );
}