import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import {
  FaHome,
  FaShoppingCart,
  FaFileInvoiceDollar,
  FaBoxOpen,
  FaReceipt,
  FaLaptop,
  FaHeadset,
  FaBuilding,
  FaMapMarkerAlt,
} from "react-icons/fa";

import "./CorporateLayout.css";

// =====================================================
// CORPORATE MENU
// =====================================================

const corporateMenu = [
  {
    label: "Overview",
    path: "/corporate-dashboard",
    icon: <FaHome />,
    end: true,
  },
  {
    label: "Add Address",
    path: "/corporate-dashboard/add-address",
    icon: <FaMapMarkerAlt />,
  },
  {
    label: "New Order",
    path: "/shop", // goes to the shop page
    icon: <FaShoppingCart />,
  },
  {
    label: "Quotes",
    path: "/corporate-dashboard/quotes",
    icon: <FaFileInvoiceDollar />,
  },
  {
    label: "My Orders",
    path: "/corporate-dashboard/orders",
    icon: <FaBoxOpen />,
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
];

// =====================================================
// CORPORATE LAYOUT (sidebar + child page)
// =====================================================

export default function CorporateLayout() {
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
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* CHILD PAGE */}

      <main className="corp-main">
        <Outlet />
      </main>
    </div>
  );
}
