// import React, { useState } from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";

// import {
//   FaCashRegister,
//   FaTools,
//   FaReceipt,
//   FaUserFriends,
//   FaLaptop,
//   FaSignOutAlt,
//   FaBars,
//   FaTimes,
//   FaHeadset,
//   FaPeopleCarry,
//   FaPlusCircle,
//   FaListAlt,
//   FaCalendarPlus,
//   FaCalendarCheck,
//   FaClipboardList,

//   // ACCOUNTANT
//   FaMoneyBillWave,
//   FaFileInvoiceDollar,
//   FaUserTie,
//   FaWallet,
//   FaShoppingCart,
//   FaChartLine,

//   // PRODUCTS / COUPONS / STORE
//   FaLayerGroup,
//   FaTags,
//   FaBoxOpen,
//   FaPercent,
//   FaStar,
//   FaTicketAlt,
//   FaFileAlt,
//   FaFileInvoice,
//   FaQuestionCircle,
//   FaWarehouse,
//   FaHistory,
//   FaShoppingBag,
// } from "react-icons/fa";

// import "./ReceptionistLayout.css";

// // =====================================================
// // BASE PATH
// // =====================================================

// const BASE = "/receptionist-dashboard";

// // =====================================================
// // MENU CONFIG
// // Naya link add karna ho to bas yahan ek object add karo.
// // Har path App.jsx ke /receptionist-dashboard routes se match karta hai.
// // =====================================================

// const NAV_SECTIONS = [
//   // -----------------------------------------------------
//   // POS COUNTER
//   // -----------------------------------------------------
//   {
//     title: "POS COUNTER",
//     links: [
//       {
//         name: "Sales Dashboard",
//         icon: FaCashRegister,
//         path: `${BASE}`,
//         end: true,
//       },
//       {
//         name: "New Walk-in Order",
//         icon: FaPlusCircle,
//         path: `${BASE}/walk-in-order/new`,
//       },
//       {
//         name: "New Walk-in Rental",
//         icon: FaLaptop,
//         path: `${BASE}/rental/new`,
//       },
//       {
//         name: "Rental List",
//         icon: FaClipboardList,
//         path: `${BASE}/rental/orders`,
//       },
//       {
//         name: "Walk-in Orders List",
//         icon: FaListAlt,
//         path: `${BASE}/walk-in-orders`,
//       },
//       {
//         name: "Customers",
//         icon: FaUserFriends,
//         path: `${BASE}/customers`,
//       },
//     ],
//   },

//   // -----------------------------------------------------
//   // REPAIR & SERVICES
//   // -----------------------------------------------------
//   {
//     title: "REPAIR & SERVICES",
//     links: [
//       {
//         name: "Repair Customers",
//         icon: FaPeopleCarry,
//         path: `${BASE}/repair-customers`,
//       },
//       {
//         name: "Repair Rate Cards",
//         icon: FaReceipt,
//         path: `${BASE}/repair-rates`,
//       },
//     ],
//   },

//   // -----------------------------------------------------
//   // PRODUCTS  (NEW)
//   // -----------------------------------------------------
//   {
//     title: "PRODUCTS",
//     links: [
//       {
//         name: "Categories",
//         icon: FaLayerGroup,
//         path: `${BASE}/categories`,
//       },
//       {
//         name: "Add Categories",
//         icon: FaPlusCircle,
//         path: `${BASE}/add-category`,
//       },
//       {
//         name: "Brands",
//         icon: FaTags,
//         path: `${BASE}/brands`,
//       },
//       {
//         name: "Add Brands",
//         icon: FaPlusCircle,
//         path: `${BASE}/add-brand`,
//       },
//       {
//         name: "Products",
//         icon: FaBoxOpen,
//         path: `${BASE}/products`,
//       },
//       {
//         name: "Add Product",
//         icon: FaPlusCircle,
//         path: `${BASE}/add-product`,
//       },
//       {
//         name: "Offers",
//         icon: FaPercent,
//         path: `${BASE}/offers`,
//       },
//       {
//         name: "Add Offer",
//         icon: FaPlusCircle,
//         path: `${BASE}/add-offer`,
//       },
//       {
//         name: "Reviews",
//         icon: FaStar,
//         path: `${BASE}/reviews`,
//       },
//     ],
//   },

//   // -----------------------------------------------------
//   // COUPONS  (NEW)
//   // -----------------------------------------------------
//   {
//     title: "COUPONS",
//     links: [
//       {
//         name: "Coupons",
//         icon: FaTicketAlt,
//         path: `${BASE}/coupons`,
//       },
//       {
//         name: "Add Coupon",
//         icon: FaPlusCircle,
//         path: `${BASE}/add-coupon`,
//       },
//     ],
//   },

//   // -----------------------------------------------------
//   // STORE  (NEW)
//   // -----------------------------------------------------
//   {
//     title: "STORE",
//     links: [
//       {
//         name: "Orders",
//         icon: FaShoppingBag,
//         path: `${BASE}/orders`,
//       },
//       // {
//       //   name: "Quotations",
//       //   icon: FaFileAlt,
//       //   path: `${BASE}/quotations`,
//       // },
//       {
//         name: "Invoices",
//         icon: FaFileInvoice,
//         path: `${BASE}/invoices`,
//       },
//       {
//         name: "Availability Requests",
//         icon: FaQuestionCircle,
//         path: `${BASE}/availability-requests`,
//       },
//       {
//         name: "Inventory",
//         icon: FaWarehouse,
//         path: `${BASE}/inventory-dashboard`,
//       },
//       {
//         name: "Stock History",
//         icon: FaHistory,
//         path: `${BASE}/stock-history`,
//       },
//     ],
//   },

//   // -----------------------------------------------------
//   // STAFF & LEAVES
//   // -----------------------------------------------------
//   {
//     title: "STAFF & LEAVES",
//     links: [
//       {
//         name: "Receptionist Staff",
//         icon: FaTools,
//         path: `${BASE}/staff-list`,
//       },
//       {
//         name: "Apply Leave",
//         icon: FaCalendarPlus,
//         path: `${BASE}/leave/apply`,
//       },
//       {
//         name: "My Leaves",
//         icon: FaCalendarCheck,
//         path: `${BASE}/leaves`,
//       },
//     ],
//   },

//   // -----------------------------------------------------
//   // ACCOUNTANT
//   // Ye routes ReceptionistLayout ke andar hi rahte hain.
//   // AccountantLayout yahan use nahi hota.
//   // -----------------------------------------------------
//   {
//     title: "ACCOUNTANT",
//     links: [
//       {
//         name: "Sales & Payments",
//         icon: FaMoneyBillWave,
//         path: `${BASE}/accountant/sales-payments`,
//       },
//       {
//         name: "Invoices",
//         icon: FaFileInvoiceDollar,
//         path: `${BASE}/accountant/invoices`,
//       },
//       {
//         name: "Salary",
//         icon: FaUserTie,
//         path: `${BASE}/accountant/salary`,
//       },
//       {
//         name: "Expenses",
//         icon: FaWallet,
//         path: `${BASE}/accountant/expenses`,
//       },
//       {
//         name: "Purchase / Procurement",
//         icon: FaShoppingCart,
//         path: `${BASE}/accountant/purchases`,
//       },
//       {
//         name: "Financial Reports",
//         icon: FaChartLine,
//         path: `${BASE}/accountant/financial-reports`,
//       },
//     ],
//   },
// ];

// export default function ReceptionistLayout() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const navigate = useNavigate();

//   // =====================================================
//   // LOGOUT
//   // =====================================================

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("user");
//     localStorage.removeItem("isLoggedIn");

//     navigate("/login");
//   };

//   // =====================================================
//   // CLOSE MOBILE SIDEBAR AFTER NAVIGATION
//   // =====================================================

//   const handleNavClick = () => {
//     if (window.innerWidth <= 992) {
//       setIsSidebarOpen(false);
//     }
//   };

//   return (
//     <div className="rep-layout-root">
//       {/* =====================================================
//           MOBILE TOPBAR
//       ===================================================== */}

//       <header className="rep-mobile-topbar">
//         <div className="rep-brand-badge">
//           <FaHeadset className="rep-brand-icon" />
//           <span>ZAID INFOTECH</span>
//         </div>

//         <button
//           type="button"
//           className="rep-menu-toggle-btn"
//           onClick={() => setIsSidebarOpen((prev) => !prev)}
//           aria-label="Toggle receptionist menu"
//         >
//           {isSidebarOpen ? <FaTimes /> : <FaBars />}
//         </button>
//       </header>

//       {/* =====================================================
//           MOBILE OVERLAY
//       ===================================================== */}

//       {isSidebarOpen && (
//         <div
//           className="rep-sidebar-overlay"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* =====================================================
//           SIDEBAR
//       ===================================================== */}

//       <aside
//         className={`rep-sidebar ${
//           isSidebarOpen ? "rep-sidebar-open" : "rep-sidebar-collapsed"
//         }`}
//       >
//         {/* SIDEBAR BRAND */}

//         <div className="rep-sidebar-brand">
//           <div className="rep-brand-avatar">
//             <FaHeadset />
//           </div>

//           <div className="rep-brand-text">
//             <h3>ZAID INFOTECH</h3>
//             <span>Front Desk &amp; POS</span>
//           </div>
//         </div>

//         {/* =================================================
//             SCROLLABLE NAVIGATION ONLY
//             Footer is OUTSIDE this section (footer scroll nahi hoga).
//         ================================================= */}

//         <nav className="rep-nav-section">
//           {NAV_SECTIONS.map((section) => (
//             <React.Fragment key={section.title}>
//               <span className="rep-nav-heading">{section.title}</span>

//               {section.links.map((item) => {
//                 const Icon = item.icon;

//                 return (
//                   <NavLink
//                     key={item.path}
//                     to={item.path}
//                     end={item.end || false}
//                     onClick={handleNavClick}
//                     className={({ isActive }) =>
//                       `rep-nav-item ${isActive ? "rep-nav-item-active" : ""}`
//                     }
//                   >
//                     <Icon className="rep-nav-icon" />
//                     <span>{item.name}</span>
//                   </NavLink>
//                 );
//               })}
//             </React.Fragment>
//           ))}
//         </nav>

//         {/* =====================================================
//             FIXED SIDEBAR FOOTER
//         ===================================================== */}

//         <div className="rep-sidebar-footer">
//           <div className="rep-user-profile">
//             <div className="rep-user-badge">R</div>

//             <div className="rep-user-meta">
//               <strong>Reception Desk</strong>
//               <small>Online Session</small>
//             </div>
//           </div>

//           <button
//             type="button"
//             className="rep-logout-btn"
//             onClick={handleLogout}
//             title="Logout"
//             aria-label="Logout"
//           >
//             <FaSignOutAlt />
//           </button>
//         </div>
//       </aside>

//       {/* =====================================================
//           MAIN CONTENT
//           ReceptionistLayout FIXED. Only Outlet content changes.
//       ===================================================== */}

//       <main className="rep-main-canvas">
//         <Outlet />
//       </main>
//     </div>
//   );
// }



import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

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

  // PRODUCTS / COUPONS / STORE
  FaLayerGroup,
  FaTags,
  FaBoxOpen,
  FaPercent,
  FaStar,
  FaTicketAlt,
  FaFileInvoice,
  FaQuestionCircle,
  FaWarehouse,
  FaHistory,
  FaShoppingBag,
} from "react-icons/fa";

import "./ReceptionistLayout.css";

// =====================================================
// BASE PATH
// =====================================================

const BASE = "/receptionist-dashboard";

const MOBILE_BREAKPOINT = 992;

// =====================================================
// MENU CONFIG
// ALL EXISTING MENU LINKS PRESERVED
// =====================================================

const NAV_SECTIONS = [
  // ===================================================
  // POS COUNTER
  // ===================================================
  {
    title: "POS COUNTER",
    links: [
      {
        name: "Sales Dashboard",
        icon: FaCashRegister,
        path: `${BASE}`,
        end: true,
      },
      {
        name: "New Walk-in Order",
        icon: FaPlusCircle,
        path: `${BASE}/walk-in-order/new`,
      },
      {
        name: "New Walk-in Rental",
        icon: FaLaptop,
        path: `${BASE}/rental/new`,
      },
      {
        name: "Rental List",
        icon: FaClipboardList,
        path: `${BASE}/rental/orders`,
      },
      {
        name: "Walk-in Orders List",
        icon: FaListAlt,
        path: `${BASE}/walk-in-orders`,
      },
      {
        name: "Customers",
        icon: FaUserFriends,
        path: `${BASE}/customers`,
      },
    ],
  },

  // ===================================================
  // REPAIR & SERVICES
  // ===================================================
  {
    title: "REPAIR & SERVICES",
    links: [
      {
        name: "Repair Customers",
        icon: FaPeopleCarry,
        path: `${BASE}/repair-customers`,
      },
      {
        name: "Repair Rate Cards",
        icon: FaReceipt,
        path: `${BASE}/repair-rates`,
      },
    ],
  },

  // ===================================================
  // PRODUCTS
  // ===================================================
  {
    title: "PRODUCTS",
    links: [
      {
        name: "Categories",
        icon: FaLayerGroup,
        path: `${BASE}/categories`,
      },
      {
        name: "Add Categories",
        icon: FaPlusCircle,
        path: `${BASE}/add-category`,
      },
      {
        name: "Brands",
        icon: FaTags,
        path: `${BASE}/brands`,
      },
      {
        name: "Add Brands",
        icon: FaPlusCircle,
        path: `${BASE}/add-brand`,
      },
      {
        name: "Products",
        icon: FaBoxOpen,
        path: `${BASE}/products`,
      },
      {
        name: "Add Product",
        icon: FaPlusCircle,
        path: `${BASE}/add-product`,
      },
      {
        name: "Offers",
        icon: FaPercent,
        path: `${BASE}/offers`,
      },
      {
        name: "Add Offer",
        icon: FaPlusCircle,
        path: `${BASE}/add-offer`,
      },
      {
        name: "Reviews",
        icon: FaStar,
        path: `${BASE}/reviews`,
      },
    ],
  },

  // ===================================================
  // COUPONS
  // ===================================================
  {
    title: "COUPONS",
    links: [
      {
        name: "Coupons",
        icon: FaTicketAlt,
        path: `${BASE}/coupons`,
      },
      {
        name: "Add Coupon",
        icon: FaPlusCircle,
        path: `${BASE}/add-coupon`,
      },
    ],
  },

  // ===================================================
  // STORE
  // ===================================================
  {
    title: "STORE",
    links: [
      {
        name: "Orders",
        icon: FaShoppingBag,
        path: `${BASE}/orders`,
      },

      // Existing commented quotation route preserved.
      // {
      //   name: "Quotations",
      //   icon: FaFileAlt,
      //   path: `${BASE}/quotations`,
      // },

      {
        name: "Invoices",
        icon: FaFileInvoice,
        path: `${BASE}/invoices`,
      },
      {
        name: "Availability Requests",
        icon: FaQuestionCircle,
        path: `${BASE}/availability-requests`,
      },
      {
        name: "Inventory",
        icon: FaWarehouse,
        path: `${BASE}/inventory-dashboard`,
      },
      {
        name: "Stock History",
        icon: FaHistory,
        path: `${BASE}/stock-history`,
      },
    ],
  },

  // ===================================================
  // STAFF & LEAVES
  // ===================================================
  {
    title: "STAFF & LEAVES",
    links: [
      {
        name: "Receptionist Staff",
        icon: FaTools,
        path: `${BASE}/staff-list`,
      },
      {
        name: "Apply Leave",
        icon: FaCalendarPlus,
        path: `${BASE}/leave/apply`,
      },
      {
        name: "My Leaves",
        icon: FaCalendarCheck,
        path: `${BASE}/leaves`,
      },
    ],
  },

  // ===================================================
  // ACCOUNTANT
  // THESE ROUTES REMAIN INSIDE RECEPTIONIST LAYOUT
  // ===================================================
  {
    title: "ACCOUNTANT",
    links: [
      {
        name: "Sales & Payments",
        icon: FaMoneyBillWave,
        path: `${BASE}/accountant/sales-payments`,
      },
      {
        name: "Invoices",
        icon: FaFileInvoiceDollar,
        path: `${BASE}/accountant/invoices`,
      },
      {
        name: "Salary",
        icon: FaUserTie,
        path: `${BASE}/accountant/salary`,
      },
      {
        name: "Expenses",
        icon: FaWallet,
        path: `${BASE}/accountant/expenses`,
      },
      {
        name: "Purchase / Procurement",
        icon: FaShoppingCart,
        path: `${BASE}/accountant/purchases`,
      },
      {
        name: "Financial Reports",
        icon: FaChartLine,
        path: `${BASE}/accountant/financial-reports`,
      },
    ],
  },
];

// =====================================================
// RESPONSIVE HELPER
// =====================================================

const checkIsMobile = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.innerWidth <= MOBILE_BREAKPOINT;
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function ReceptionistLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // ===================================================
  // RESPONSIVE STATE
  // ===================================================

  const [isMobile, setIsMobile] = useState(
    checkIsMobile
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => !checkIsMobile()
  );

  // ===================================================
  // WINDOW RESIZE HANDLING
  // ===================================================

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT}px)`
    );

    const handleBreakpointChange = (event) => {
      const mobile = event.matches;

      setIsMobile(mobile);

      // Mobile -> closed
      // Desktop -> open
      setIsSidebarOpen(!mobile);
    };

    // Synchronize initial viewport
    const mobile = mediaQuery.matches;

    setIsMobile(mobile);
    setIsSidebarOpen(!mobile);

    mediaQuery.addEventListener(
      "change",
      handleBreakpointChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleBreakpointChange
      );
    };
  }, []);

  // ===================================================
  // CLOSE MOBILE SIDEBAR ON ROUTE CHANGE
  // ===================================================

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // ===================================================
  // LOCK BODY SCROLL WHEN MOBILE DRAWER IS OPEN
  // ===================================================

  useEffect(() => {
    if (!isMobile || !isSidebarOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isMobile, isSidebarOpen]);

  // ===================================================
  // CLOSE SIDEBAR USING ESCAPE KEY
  // ===================================================

  useEffect(() => {
    if (!isMobile || !isSidebarOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isMobile, isSidebarOpen]);

  // ===================================================
  // SIDEBAR TOGGLE
  // ===================================================

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // ===================================================
  // CLOSE SIDEBAR
  // ===================================================

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // ===================================================
  // NAVIGATION CLICK
  // ===================================================

  const handleNavClick = useCallback(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    navigate("/login", {
      replace: true,
    });
  }, [navigate]);

  // ===================================================
  // SIDEBAR CLASS
  // ===================================================

  const sidebarClassName = [
    "rep-sidebar",
    isSidebarOpen
      ? "rep-sidebar-open"
      : "rep-sidebar-collapsed",
  ].join(" ");

  // ===================================================
  // MAIN CLASS
  // ===================================================

  const mainClassName = [
    "rep-main-canvas",
    isSidebarOpen
      ? "rep-main-shifted"
      : "rep-main-full",
  ].join(" ");

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="rep-layout-root">

      {/* ================================================
          MOBILE TOPBAR
      ================================================ */}

      <header className="rep-mobile-topbar">
        <div className="rep-brand-badge">
          <FaHeadset className="rep-brand-icon" />

          <span>ZAID INFOTECH</span>
        </div>

        <button
          type="button"
          className="rep-menu-toggle-btn"
          onClick={toggleSidebar}
          aria-label={
            isSidebarOpen
              ? "Close receptionist menu"
              : "Open receptionist menu"
          }
          aria-expanded={isSidebarOpen}
          aria-controls="rep-sidebar-navigation"
        >
          {isSidebarOpen ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>
      </header>

      {/* ================================================
          DESKTOP SIDEBAR TOGGLE
      ================================================ */}

      <button
        type="button"
        className={`rep-desktop-toggle ${
          isSidebarOpen
            ? "rep-toggle-open"
            : "rep-toggle-closed"
        }`}
        onClick={toggleSidebar}
        aria-label={
          isSidebarOpen
            ? "Close receptionist sidebar"
            : "Open receptionist sidebar"
        }
        aria-expanded={isSidebarOpen}
        aria-controls="rep-sidebar-navigation"
        title={
          isSidebarOpen
            ? "Close Sidebar"
            : "Open Sidebar"
        }
      >
        {isSidebarOpen ? (
          <FaTimes />
        ) : (
          <FaBars />
        )}
      </button>

      {/* ================================================
          MOBILE SIDEBAR OVERLAY
      ================================================ */}

      {isMobile && isSidebarOpen && (
        <div
          className="rep-sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* ================================================
          SIDEBAR
      ================================================ */}

      <aside
        id="rep-sidebar-navigation"
        className={sidebarClassName}
        aria-label="Receptionist sidebar"
        aria-hidden={!isSidebarOpen}
        inert={!isSidebarOpen}
      >

        {/* ==============================================
            SIDEBAR BRAND
        ============================================== */}

        <div className="rep-sidebar-brand">
          <div className="rep-brand-avatar">
            <FaHeadset />
          </div>

          <div className="rep-brand-text">
            <h3>ZAID INFOTECH</h3>

            <span>
              Front Desk &amp; POS
            </span>
          </div>
        </div>

        {/* ==============================================
            SCROLLABLE NAVIGATION
        ============================================== */}

        <nav
          className="rep-nav-section"
          aria-label="Receptionist navigation"
        >
          {NAV_SECTIONS.map((section) => (
            <React.Fragment key={section.title}>

              {/* SECTION HEADING */}

              <span className="rep-nav-heading">
                {section.title}
              </span>

              {/* SECTION LINKS */}

              {section.links.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end || false}
                    onClick={handleNavClick}
                    title={item.name}
                    className={({ isActive }) =>
                      `rep-nav-item ${
                        isActive
                          ? "rep-nav-item-active"
                          : ""
                      }`
                    }
                  >
                    <Icon
                      className="rep-nav-icon"
                      aria-hidden="true"
                    />

                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </React.Fragment>
          ))}
        </nav>

        {/* ==============================================
            FIXED SIDEBAR FOOTER
        ============================================== */}

        <div className="rep-sidebar-footer">

          {/* USER PROFILE */}

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

          {/* LOGOUT BUTTON */}

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

      {/* ================================================
          MAIN CONTENT

          SIDEBAR OPEN:
          Main content shifted on desktop

          SIDEBAR CLOSED:
          Main content full width

          MOBILE:
          Main content always full width
      ================================================ */}

      <main className={mainClassName}>
        <Outlet />
      </main>
    </div>
  );
}
