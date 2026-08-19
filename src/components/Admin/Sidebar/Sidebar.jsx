// import "./Sidebar.css";
// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// import {
//   MdDashboard,
//   MdPeople,
//   MdCategory,
//   MdInventory,
//   MdBuild,
//   MdShoppingCart,
//   MdWork,
//   MdStore,
//   MdPayments,
//   MdArticle,
//   MdSettings,
//   MdLogout,
//   MdMenu,
//   MdClose,
//   MdChevronRight,
//   MdReceipt,
//   MdLocalOffer, // ✅ ADD THIS
//   MdNotifications,
// } from "react-icons/md";

// function Sidebar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Drawer state
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   const menu = [
//     {
//       title: "MAIN",
//       links: [
//         {
//           name: "Dashboard",
//           icon: <MdDashboard />,
//           path: "/admin-dashboard",
//         },
//       ],
//     },

//     {
//       title: "CUSTOMER",
//       links: [
//         {
//           name: "Customer List",
//           icon: <MdPeople />,
//           path: "/customers",
//         },
//       ],
//     },

//     {
//       title: "PRODUCTS",
//       links: [
//         {
//           name: "Categories",
//           icon: <MdCategory />,
//           path: "/categories",
//         },
//         {
//           name: "Add Categories",
//           icon: <MdCategory />,
//           path: "/add-category",
//         },
//         {
//           name: "Brands",
//           icon: <MdCategory />,
//           path: "/brands",
//         },
//         {
//           name: "Add Brands",
//           icon: <MdCategory />,
//           path: "/add-brand",
//         },
//         {
//           name: "Products",
//           icon: <MdInventory />,
//           path: "/admin/products",
//         },
//         {
//           name: "Add Product",
//           icon: <MdInventory />,
//           path: "/add-product",
//         },


//     // =====================================
//     // OFFERS
//     // =====================================

//     {
//       name: "Offers",
//       icon: <MdLocalOffer />,
//       path: "/admin/offers",
//     },

//     {
//       name: "Add Offer",
//       icon: <MdLocalOffer />,
//       path: "/admin/add-offer",
//     },
    
//       ],
//     },


//      {
//       title: "COUPONS",
//       links: [
//         {
//           name: "Coupons",
//           icon: <MdLocalOffer />,
//           path: "/admin/coupons",
//         },

//         {
//           name: "Add Coupon",
//           icon: <MdLocalOffer />,
//           path: "/admin/add-coupon",
//         },
//       ],
//     },

//     {
//       title: "SERVICE",
//       links: [
//         {
//           name: "Repairs",
//           icon: <MdBuild />,
//           path: "/repairs",
//         },
//         {
//           name: "Add Repairs",
//           icon: <MdBuild />,
//           path: "/add-repair",
//         },
//         {
//           name: "Rentals",
//           icon: <MdBuild />,
//           path: "/rentals",
//         },
//         {
//           name: "Add Rentals",
//           icon: <MdBuild />,
//           path: "/add-rental",
//         },
//       ],
//     },

//     {
//       title: "EMPLOYEE",
//       links: [
//         {
//           name: "Employees",
//           icon: <MdWork />,
//           path: "/employees",
//         },
//         {
//           name: "Add Employee",
//           icon: <MdPeople />,
//           path: "/add-employee",
//         },
//         {
//           name: "Add Shifting",
//           icon: <MdWork />,
//           path: "/add-shift",
//         },
//         {
//           name: "Employee Shift",
//           icon: <MdWork />,
//           path: "/employee-shift",
//         },
//         {
//           name: "Attendance",
//           icon: <MdWork />,
//           path: "/attendance",
//         },
//         {
//           name: "Salary",
//           icon: <MdPayments />,
//           path: "/salary",
//         },
//       ],
//     },

//     {
//       title: "STORE",
//       links: [
//         {
//           name: "Orders",
//           icon: <MdShoppingCart />,
//           path: "/admin/orders",
//         },


//                   {
//      name: "Invoices",
//       icon: <MdReceipt />,     
//        path: "/admin/invoices",
//     },
//             {
//       name: "Stock History",
//       icon: <MdInventory />,
//       path: "/stock-history",
//     },


//         {
//           name: "Suppliers",
//           icon: <MdStore />,
//           path: "/suppliers",
//         },
//         {
//           name: "Purchase",
//           icon: <MdStore />,
//           path: "/purchase-orders",
//         },
//       ],
//     },

//     {
//       title: "OTHERS",
//       links: [



//         {
//             name: "Notifications",
//             icon: <MdNotifications />,
//             path: "/notifications",
//         },
//         {
//           name: "Blogs",
//           icon: <MdArticle />,
//           path: "/blogs",
//         },
//         {
//           name: "Reports",
//           icon: <MdArticle />,
//           path: "/reports",
//         },
//         {
//           name: "Settings",
//           icon: <MdSettings />,
//           path: "/settings",
//         },
//       ],
//     },
//   ];

//   // ============================================
//   // NAVIGATION
//   // ============================================

//   const handleNavigation = (path) => {
//     navigate(path);

//     // Close drawer after selecting menu item
//     setIsDrawerOpen(false);
//   };

//   // ============================================
//   // LOGOUT
//   // ============================================

//   const handleLogout = () => {
//     localStorage.removeItem("token");

//     setIsDrawerOpen(false);

//     navigate("/");
//   };

//   return (
//     <>
//       {/* =========================================
//           MOBILE DRAWER BUTTON
//       ========================================== */}

//       <button
//         className="sidebar-drawer-toggle"
//         onClick={() =>
//           setIsDrawerOpen((prev) => !prev)
//         }
//         aria-label="Open navigation menu"
//       >
//         {isDrawerOpen ? <MdClose /> : <MdMenu />}
//       </button>


//       {/* =========================================
//           OVERLAY
//       ========================================== */}

//       {isDrawerOpen && (
//         <div
//           className="sidebar-overlay"
//           onClick={() => setIsDrawerOpen(false)}
//         />
//       )}


//       {/* =========================================
//           SIDEBAR
//       ========================================== */}

//       <aside
//         className={`sidebar ${
//           isDrawerOpen ? "sidebar-open" : ""
//         }`}
//       >

//         {/* =======================================
//             MOBILE CLOSE BUTTON
//         ======================================== */}

//         <button
//           className="sidebar-mobile-close"
//           onClick={() => setIsDrawerOpen(false)}
//           aria-label="Close navigation menu"
//         >
//           <MdClose />
//         </button>


//         {/* =======================================
//             PROFILE
//         ======================================== */}

//         <div className="sidebar-profile">

//           <div className="profile-image-wrapper">

//             <img
//               src="https://ui-avatars.com/api/?name=Admin&background=22c55e&color=fff"
//               alt="Admin"
//             />

//             <span className="profile-online-dot" />

//           </div>

//           <div className="sidebar-profile-info">

//             <h3>Admin</h3>

//             <span>
//               System Administrator
//             </span>

//           </div>

//         </div>


//         {/* =======================================
//             MENU
//         ======================================== */}

//         <div className="sidebar-menu">

//           {menu.map((section) => (
//             <div
//               key={section.title}
//               className="menu-section"
//             >

//               <p className="menu-title">
//                 {section.title}
//               </p>


//               {section.links.map((item) => (

//                 <button
//                   key={item.path}
//                   className={`menu-item ${
//                     location.pathname === item.path
//                       ? "active"
//                       : ""
//                   }`}
//                   onClick={() =>
//                     handleNavigation(item.path)
//                   }
//                 >

//                   <span className="icon">
//                     {item.icon}
//                   </span>

//                   <span className="menu-text">
//                     {item.name}
//                   </span>

//                   <span className="menu-arrow">
//                     <MdChevronRight />
//                   </span>

//                 </button>

//               ))}

//             </div>
//           ))}

//         </div>


//         {/* =======================================
//             LOGOUT
//         ======================================== */}

//         <div className="sidebar-footer">

//           <button
//             className="logout-btn"
//             onClick={handleLogout}
//           >
//             <span className="logout-icon">
//               <MdLogout />
//             </span>

//             <span>
//               Logout
//             </span>
//           </button>

//         </div>

//       </aside>
//     </>
//   );
// }

// export default Sidebar;


import "./Sidebar.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  MdDashboard,
  MdPeople,
  MdCategory,
  MdInventory,
  MdBuild,
  MdShoppingCart,
  MdWork,
  MdStore,
  MdPayments,
  MdArticle,
  MdSettings,
  MdLogout,
  MdMenu,
  MdClose,
  MdChevronRight,
  MdReceipt,
  MdLocalOffer,
  MdNotifications,
} from "react-icons/md";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "../../../services/notificationService";
function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  // ============================================
  // DRAWER STATE
  // ============================================

  const [isDrawerOpen, setIsDrawerOpen] =
    useState(false);


  // ============================================
  // NOTIFICATION STATES
  // ============================================

  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [notificationLoading, setNotificationLoading] =
    useState(false);


  // ============================================
  // LOAD NOTIFICATIONS
  // ============================================

  const loadNotifications = async () => {

    const token =
      localStorage.getItem("token");

    if (!token) {

      setNotifications([]);
      setUnreadCount(0);

      return;
    }


    try {

      setNotificationLoading(true);


      const response =
        await getMyNotifications();


      const notificationList =
        Array.isArray(response?.notifications)
          ? response.notifications
          : [];


      setNotifications(
        notificationList
      );


      /*
       * Prefer backend unreadCount.
       * Fallback to local calculation if backend
       * doesn't send unreadCount.
       */

      const backendUnreadCount =
        Number(response?.unreadCount);


      if (
        Number.isFinite(backendUnreadCount)
      ) {

        setUnreadCount(
          backendUnreadCount
        );

      } else {

        const localUnread =
          notificationList.filter(
            (notification) =>
              !notification.isRead
          ).length;

        setUnreadCount(
          localUnread
        );

      }

    }
    catch (error) {

      console.error(
        "SIDEBAR NOTIFICATION ERROR:",
        error
      );

    }
    finally {

      setNotificationLoading(false);

    }

  };


  // ============================================
  // INITIAL NOTIFICATION LOAD
  // ============================================

  useEffect(() => {

    loadNotifications();

  }, []);


  // ============================================
  // AUTO REFRESH NOTIFICATIONS
  // EVERY 15 SECONDS
  // ============================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (!token) {
      return;
    }


    const interval =
      setInterval(() => {

        loadNotifications();

      }, 15000);


    return () => {

      clearInterval(interval);

    };

  }, []);


  // ============================================
  // MENU
  // ============================================

  const menu = [

    {
      title: "MAIN",

      links: [

        {
          name: "Dashboard",
          icon: <MdDashboard />,
          path: "/dashboard",
        },

        // =====================================
        // NOTIFICATIONS AT TOP
        // =====================================

        {
          name: "Notifications",
          icon: <MdNotifications />,
          path: "/notifications",
          notification: true,
        },

      ],
    },


    {
      title: "CUSTOMER",

      links: [

        {
          name: "Customer List",
          icon: <MdPeople />,
          path: "/customers",
        },

      ],
    },


    {
      title: "PRODUCTS",

      links: [

        {
          name: "Categories",
          icon: <MdCategory />,
          path: "/categories",
        },

        {
          name: "Add Categories",
          icon: <MdCategory />,
          path: "/add-category",
        },

        {
          name: "Brands",
          icon: <MdCategory />,
          path: "/brands",
        },

        {
          name: "Add Brands",
          icon: <MdCategory />,
          path: "/add-brand",
        },

        {
          name: "Products",
          icon: <MdInventory />,
          path: "/admin/products",
        },

        {
          name: "Add Product",
          icon: <MdInventory />,
          path: "/add-product",
        },


        // =====================================
        // OFFERS
        // =====================================

        {
          name: "Offers",
          icon: <MdLocalOffer />,
          path: "/admin/offers",
        },

        {
          name: "Add Offer",
          icon: <MdLocalOffer />,
          path: "/admin/add-offer",
        },

      ],
    },


    {
      title: "COUPONS",

      links: [

        {
          name: "Coupons",
          icon: <MdLocalOffer />,
          path: "/admin/coupons",
        },

        {
          name: "Add Coupon",
          icon: <MdLocalOffer />,
          path: "/admin/add-coupon",
        },

      ],
    },


    {
      title: "SERVICE",

      links: [

        {
          name: "Repairs",
          icon: <MdBuild />,
          path: "/repairs",
        },

        {
          name: "Add Repairs",
          icon: <MdBuild />,
          path: "/add-repair",
        },

        {
          name: "Rentals",
          icon: <MdBuild />,
          path: "/rentals",
        },

        {
          name: "Add Rentals",
          icon: <MdBuild />,
          path: "/add-rental",
        },

      ],
    },


    {
      title: "EMPLOYEE",

      links: [

        {
          name: "Employees",
          icon: <MdWork />,
          path: "/employees",
        },

        {
          name: "Add Employee",
          icon: <MdPeople />,
          path: "/add-employee",
        },

        {
          name: "Add Shifting",
          icon: <MdWork />,
          path: "/add-shift",
        },

        {
          name: "Employee Shift",
          icon: <MdWork />,
          path: "/employee-shift",
        },

        {
          name: "Attendance",
          icon: <MdWork />,
          path: "/attendance",
        },

        {
          name: "Salary",
          icon: <MdPayments />,
          path: "/salary",
        },

      ],
    },


    {
      title: "STORE",

      links: [

        {
          name: "Orders",
          icon: <MdShoppingCart />,
          path: "/admin/orders",
        },

        {
          name: "Invoices",
          icon: <MdReceipt />,
          path: "/admin/invoices",
        },

        {
          name: "Stock History",
          icon: <MdInventory />,
          path: "/stock-history",
        },

        {
          name: "Suppliers",
          icon: <MdStore />,
          path: "/suppliers",
        },

        {
          name: "Purchase",
          icon: <MdStore />,
          path: "/purchase-orders",
        },

      ],
    },


    {
      title: "OTHERS",

      links: [

        {
          name: "Blogs",
          icon: <MdArticle />,
          path: "/blogs",
        },

        {
          name: "Reports",
          icon: <MdArticle />,
          path: "/reports",
        },

        {
          name: "Settings",
          icon: <MdSettings />,
          path: "/settings",
        },

      ],
    },

  ];


  // ============================================
  // NOTIFICATION CLICK
  // ============================================

  const handleNotificationClick =
    async (notification) => {

      try {

        if (!notification?.isRead) {

          await markNotificationAsRead(
            notification._id
          );


          setNotifications((previous) =>

            previous.map((item) =>

              item._id === notification._id

                ? {
                    ...item,
                    isRead: true,
                  }

                : item

            )

          );


          setUnreadCount((previous) =>
            Math.max(previous - 1, 0)
          );

        }

      }
      catch (error) {

        console.error(
          "MARK NOTIFICATION ERROR:",
          error
        );

      }


      setNotificationOpen(false);

      setIsDrawerOpen(false);


      // ======================================
      // ORDER NOTIFICATION
      // ======================================

      if (
        notification?.relatedModel ===
          "Order" &&
        notification?.relatedId
      ) {

        navigate(
          `/admin/orders/${notification.relatedId}`
        );

        return;
      }


      // ======================================
      // INVENTORY NOTIFICATION
      // ======================================

      if (
        (
          notification?.type ===
            "STOCK_LOW" ||

          notification?.type ===
            "STOCK_OUT"
        ) &&
        notification?.relatedId
      ) {

        navigate(
          `/inventory-dashboard?product=${notification.relatedId}`
        );

        return;
      }


      // ======================================
      // DEFAULT
      // ======================================

      navigate("/notifications");

    };


  // ============================================
  // MARK ALL AS READ
  // ============================================

  const handleMarkAllRead =
    async () => {

      try {

        await markAllNotificationsAsRead();


        setNotifications((previous) =>

          previous.map((item) => ({
            ...item,
            isRead: true,
          }))

        );


        setUnreadCount(0);

      }
      catch (error) {

        console.error(
          "MARK ALL READ ERROR:",
          error
        );

      }

    };


  // ============================================
  // NAVIGATION
  // ============================================

  const handleNavigation = (path) => {

    navigate(path);

    setIsDrawerOpen(false);

  };


  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("isLoggedIn");

    localStorage.removeItem("user");

    setIsDrawerOpen(false);

    navigate("/");

  };


  // ============================================
  // RENDER
  // ============================================

  return (

    <>

      {/* =========================================
          MOBILE DRAWER BUTTON
      ========================================== */}

      <button
        className="sidebar-drawer-toggle"
        onClick={() =>
          setIsDrawerOpen(
            (previous) => !previous
          )
        }
        aria-label="Open navigation menu"
      >

        {isDrawerOpen
          ? <MdClose />
          : <MdMenu />
        }

      </button>


      {/* =========================================
          OVERLAY
      ========================================== */}

      {isDrawerOpen && (

        <div
          className="sidebar-overlay"
          onClick={() =>
            setIsDrawerOpen(false)
          }
        />

      )}


      {/* =========================================
          SIDEBAR
      ========================================== */}

      <aside
        className={`sidebar ${
          isDrawerOpen
            ? "sidebar-open"
            : ""
        }`}
      >


        {/* =======================================
            MOBILE CLOSE BUTTON
        ======================================== */}

        <button
          className="sidebar-mobile-close"
          onClick={() =>
            setIsDrawerOpen(false)
          }
          aria-label="Close navigation menu"
        >

          <MdClose />

        </button>


        {/* =======================================
            PROFILE
        ======================================== */}

        <div className="sidebar-profile">

          <div className="profile-image-wrapper">

            <img
              src="https://ui-avatars.com/api/?name=Admin&background=22c55e&color=fff"
              alt="Admin"
            />

            <span
              className="profile-online-dot"
            />

          </div>


          <div className="sidebar-profile-info">

            <h3>
              Admin
            </h3>

            <span>
              System Administrator
            </span>

          </div>

        </div>


        {/* =======================================
            NOTIFICATION PANEL
        ======================================== */}

        <div className="sidebar-notification-area">

          <button
            className={`sidebar-notification-button ${
              location.pathname ===
              "/notifications"
                ? "active"
                : ""
            }`}
            onClick={() => {

              setNotificationOpen(
                (previous) => !previous
              );

            }}
          >

            <span
              className="sidebar-notification-icon"
            >

              <MdNotifications />

              {unreadCount > 0 && (

                <span
                  className="
                    sidebar-notification-badge
                  "
                >

                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}

                </span>

              )}

            </span>


            <span className="menu-text">
              Notifications
            </span>


            <span className="menu-arrow">
              <MdChevronRight />
            </span>

          </button>


          {/* =====================================
              NOTIFICATION DROPDOWN
          ===================================== */}

          {notificationOpen && (

            <div
              className="
                sidebar-notification-dropdown
              "
            >

              {/* HEADER */}

              <div
                className="
                  sidebar-notification-header
                "
              >

                <div>

                  <strong>
                    Notifications
                  </strong>

                  <small>

                    {unreadCount > 0
                      ? `${unreadCount} unread`
                      : "You're all caught up"}

                  </small>

                </div>


                {unreadCount > 0 && (

                  <button
                    onClick={
                      handleMarkAllRead
                    }
                    className="
                      sidebar-mark-read
                    "
                  >

                    Mark all

                  </button>

                )}

              </div>


              {/* BODY */}

              <div
                className="
                  sidebar-notification-list
                "
              >

                {notificationLoading ? (

                  <div
                    className="
                      sidebar-notification-empty
                    "
                  >

                    Loading notifications...

                  </div>

                ) : notifications.length === 0 ? (

                  <div
                    className="
                      sidebar-notification-empty
                    "
                  >

                    <MdNotifications />

                    <span>
                      No notifications
                    </span>

                  </div>

                ) : (

                  notifications
                    .slice(0, 8)
                    .map(
                      (notification) => (

                        <button
                          key={
                            notification._id
                          }
                          onClick={() =>
                            handleNotificationClick(
                              notification
                            )
                          }
                          className={`
                            sidebar-notification-item
                            ${
                              !notification.isRead
                                ? "unread"
                                : ""
                            }
                          `}
                        >

                          <span
                            className="
                              sidebar-small-bell
                            "
                          >

                            <MdNotifications />

                          </span>


                          <span
                            className="
                              sidebar-notification-content
                            "
                          >

                            <strong>

                              {
                                notification.title ||
                                "Notification"
                              }

                            </strong>


                            <span>

                              {
                                notification.message ||
                                ""
                              }

                            </span>


                            {notification.createdAt && (

                              <small>

                                {new Date(
                                  notification.createdAt
                                ).toLocaleString(
                                  "en-IN"
                                )}

                              </small>

                            )}

                          </span>


                          {!notification.isRead && (

                            <span
                              className="
                                sidebar-unread-dot
                              "
                            />

                          )}

                        </button>

                      )
                    )

                )}

              </div>


              {/* FOOTER */}

              <button
                className="
                  sidebar-view-all
                "
                onClick={() => {

                  setNotificationOpen(
                    false
                  );

                  setIsDrawerOpen(
                    false
                  );

                  navigate(
                    "/notifications"
                  );

                }}
              >

                View All Notifications

              </button>

            </div>

          )}

        </div>


        {/* =======================================
            MENU
        ======================================== */}

        <div className="sidebar-menu">

          {menu.map((section) => (

            <div
              key={section.title}
              className="menu-section"
            >

              <p className="menu-title">
                {section.title}
              </p>


              {section.links.map((item) => (

                <button
                  key={item.path}
                  className={`menu-item ${
                    location.pathname ===
                    item.path
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleNavigation(
                      item.path
                    )
                  }
                >

                  <span className="icon">
                    {item.icon}
                  </span>


                  <span className="menu-text">
                    {item.name}
                  </span>


                  <span className="menu-arrow">
                    <MdChevronRight />
                  </span>

                </button>

              ))}

            </div>

          ))}

        </div>


        {/* =======================================
            LOGOUT
        ======================================== */}

        <div className="sidebar-footer">

          <button
            className="logout-btn"
            onClick={handleLogout}
          >

            <span className="logout-icon">
              <MdLogout />
            </span>


            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>

    </>

  );

}

export default Sidebar;