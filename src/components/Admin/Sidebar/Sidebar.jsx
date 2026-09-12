// import "./Sidebar.css";

// import {
//   useState,
//   useEffect,
//   useMemo,
// } from "react";

// import {
//   useNavigate,
//   useLocation,
// } from "react-router-dom";

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
//   MdMenu,
//   MdClose,
//   MdChevronRight,
//   MdReceipt,
//   MdLocalOffer,
//   MdNotifications,
//   MdRateReview,
//   MdEventNote,
//   MdEvent,
//   MdPolicy,
//   MdSearch,
//   MdDoneAll,
//   MdCircle,
//   MdRefresh,
//   MdLogout,
// } from "react-icons/md";

// import {
//   getMyNotifications,
//   markNotificationAsRead,
//   markAllNotificationsAsRead,
// } from "../../../services/notificationService";

// function Sidebar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // =====================================================
//   // DRAWER
//   // =====================================================

//   const [isDrawerOpen, setIsDrawerOpen] =
//     useState(false);

//   // =====================================================
//   // SIDEBAR SEARCH
//   // =====================================================

//   const [sidebarSearch, setSidebarSearch] =
//     useState("");

//   // =====================================================
//   // NOTIFICATIONS
//   // =====================================================

//   const [notifications, setNotifications] =
//     useState([]);

//   const [unreadCount, setUnreadCount] =
//     useState(0);

//   const [notificationOpen, setNotificationOpen] =
//     useState(false);

//   const [notificationLoading, setNotificationLoading] =
//     useState(false);

//   const [notificationSearch, setNotificationSearch] =
//     useState("");

//   // =====================================================
//   // LOAD NOTIFICATIONS
//   // =====================================================

//   const loadNotifications = async () => {
//     const token =
//       localStorage.getItem("token");

//     if (!token) {
//       setNotifications([]);
//       setUnreadCount(0);
//       return;
//     }

//     try {
//       setNotificationLoading(true);

//       const response =
//         await getMyNotifications();

//       console.log(
//         "SIDEBAR NOTIFICATIONS:",
//         response
//       );

//       let notificationList = [];

//       if (Array.isArray(response)) {
//         notificationList = response;
//       } else if (
//         Array.isArray(
//           response?.notifications
//         )
//       ) {
//         notificationList =
//           response.notifications;
//       } else if (
//         Array.isArray(response?.data)
//       ) {
//         notificationList =
//           response.data;
//       } else if (
//         Array.isArray(
//           response?.data?.notifications
//         )
//       ) {
//         notificationList =
//           response.data.notifications;
//       }

//       setNotifications(notificationList);

//       const backendUnreadCount =
//         Number(
//           response?.unreadCount ??
//             response?.data?.unreadCount
//         );

//       if (
//         Number.isFinite(
//           backendUnreadCount
//         )
//       ) {
//         setUnreadCount(
//           backendUnreadCount
//         );
//       } else {
//         const localUnread =
//           notificationList.filter(
//             (notification) =>
//               !notification?.isRead
//           ).length;

//         setUnreadCount(localUnread);
//       }
//     } catch (error) {
//       console.error(
//         "SIDEBAR NOTIFICATION ERROR:",
//         error
//       );
//     } finally {
//       setNotificationLoading(false);
//     }
//   };

//   // =====================================================
//   // INITIAL NOTIFICATION LOAD
//   // =====================================================

//   useEffect(() => {
//     loadNotifications();
//   }, []);

//   // =====================================================
//   // AUTO REFRESH
//   // =====================================================

//   useEffect(() => {
//     const token =
//       localStorage.getItem("token");

//     if (!token) return;

//     const interval =
//       setInterval(() => {
//         loadNotifications();
//       }, 15000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   // =====================================================
//   // MENU
//   // =====================================================

//   const menu = [
//     {
//       title: "MAIN",

//       links: [
//         {
//           name: "Dashboard",
//           icon: <MdDashboard />,
//           path: "/admin-dashboard",
//         },

//         {
//           name: "Notifications",
//           icon: <MdNotifications />,
//           path: "/notifications",
//           notification: true,
//         },

//         {
//           name: "Reviews",
//           icon: <MdRateReview />,
//           path: "/admin/reviews",
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

//         {
//           name: "Offers",
//           icon: <MdLocalOffer />,
//           path: "/admin/offers",
//         },

//         {
//           name: "Add Offer",
//           icon: <MdLocalOffer />,
//           path: "/admin/add-offer",
//         },
//       ],
//     },

//     {
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
//           name: "Leave Requests",
//           icon: <MdEventNote />,
//           path: "/admin/leaves",
//         },

//         {
//           name: "Leave Policies",
//           icon: <MdPolicy />,
//           path: "/admin/leaves/policies",
//         },

//         {
//           name: "Holidays",
//           icon: <MdEvent />,
//           path: "/admin/holidays",
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

//         {
//           name: "Invoices",
//           icon: <MdReceipt />,
//           path: "/admin/invoices",
//         },

//         {
//           name: "Availability Requests",
//           icon: <MdInventory />,
//           path: "/admin/availability-requests",
//         },

//         {
//           name: "Stock History",
//           icon: <MdInventory />,
//           path: "/stock-history",
//         },

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
//         // {
//         //   name: "Blogs",
//         //   icon: <MdArticle />,
//         //   path: "/blogs",
//         // },

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

//   // =====================================================
//   // FILTER MENU
//   // =====================================================

//   const filteredMenu = useMemo(() => {
//     const search =
//       sidebarSearch
//         .trim()
//         .toLowerCase();

//     if (!search) {
//       return menu;
//     }

//     return menu
//       .map((section) => {
//         const filteredLinks =
//           section.links.filter(
//             (item) =>
//               item.name
//                 .toLowerCase()
//                 .includes(search)
//           );

//         return {
//           ...section,
//           links: filteredLinks,
//         };
//       })
//       .filter(
//         (section) =>
//           section.links.length > 0
//       );
//   }, [sidebarSearch]);

//   // =====================================================
//   // FILTER NOTIFICATIONS
//   // =====================================================

//   const filteredNotifications =
//     useMemo(() => {
//       const search =
//         notificationSearch
//           .trim()
//           .toLowerCase();

//       if (!search) {
//         return notifications;
//       }

//       return notifications.filter(
//         (notification) => {
//           const title =
//             String(
//               notification?.title || ""
//             ).toLowerCase();

//           const message =
//             String(
//               notification?.message || ""
//             ).toLowerCase();

//           const type =
//             String(
//               notification?.type || ""
//             ).toLowerCase();

//           return (
//             title.includes(search) ||
//             message.includes(search) ||
//             type.includes(search)
//           );
//         }
//       );
//     }, [
//       notifications,
//       notificationSearch,
//     ]);

//   // =====================================================
//   // NOTIFICATION CLICK
//   // =====================================================

//   const handleNotificationClick =
//     async (notification) => {
//       if (!notification) return;

//       try {
//         if (
//           !notification.isRead &&
//           notification._id
//         ) {
//           await markNotificationAsRead(
//             notification._id
//           );

//           setNotifications(
//             (previous) =>
//               previous.map((item) =>
//                 item._id ===
//                 notification._id
//                   ? {
//                       ...item,
//                       isRead: true,
//                     }
//                   : item
//               )
//           );

//           setUnreadCount(
//             (previous) =>
//               Math.max(
//                 previous - 1,
//                 0
//               )
//           );
//         }
//       } catch (error) {
//         console.error(
//           "MARK NOTIFICATION ERROR:",
//           error
//         );
//       }

//       setNotificationOpen(false);
//       setIsDrawerOpen(false);

//       // ORDER
//       if (
//         notification?.relatedModel ===
//           "Order" &&
//         notification?.relatedId
//       ) {
//         navigate(
//           `/admin/orders/${notification.relatedId}`
//         );
//         return;
//       }

//       // STOCK
//       if (
//         (
//           notification?.type ===
//             "STOCK_LOW" ||
//           notification?.type ===
//             "STOCK_OUT"
//         ) &&
//         notification?.relatedId
//       ) {
//         navigate(
//           `/inventory-dashboard?product=${notification.relatedId}`
//         );
//         return;
//       }

//       // RESTOCK
//       if (
//         notification?.type ===
//           "PRODUCT_RESTOCKED" &&
//         notification?.relatedId
//       ) {
//         navigate(
//           `/admin/products/${notification.relatedId}`
//         );
//         return;
//       }

//       navigate("/notifications");
//     };

//   // =====================================================
//   // MARK ALL READ
//   // =====================================================

//   const handleMarkAllRead =
//     async () => {
//       try {
//         await markAllNotificationsAsRead();

//         setNotifications(
//           (previous) =>
//             previous.map((item) => ({
//               ...item,
//               isRead: true,
//             }))
//         );

//         setUnreadCount(0);
//       } catch (error) {
//         console.error(
//           "MARK ALL READ ERROR:",
//           error
//         );
//       }
//     };

//   // =====================================================
//   // NAVIGATION
//   // =====================================================

//   const handleNavigation = (
//     path
//   ) => {
//     navigate(path);

//     setIsDrawerOpen(false);
//     setNotificationOpen(false);
//   };

//   // =====================================================
//   // LOGOUT
//   // =====================================================

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem(
//       "isLoggedIn"
//     );
//     localStorage.removeItem("user");

//     setIsDrawerOpen(false);
//     setNotificationOpen(false);

//     navigate("/");
//   };

//   // =====================================================
//   // DATE
//   // =====================================================

//   const formatNotificationDate = (
//     date
//   ) => {
//     if (!date) return "";

//     const notificationDate =
//       new Date(date);

//     if (
//       Number.isNaN(
//         notificationDate.getTime()
//       )
//     ) {
//       return "";
//     }

//     return notificationDate.toLocaleString(
//       "en-IN",
//       {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       }
//     );
//   };

//   // =====================================================
//   // NOTIFICATION TYPE
//   // =====================================================

//   const getNotificationType = (
//     notification
//   ) => {
//     if (!notification?.type) {
//       return "Notification";
//     }

//     return String(
//       notification.type
//     )
//       .replaceAll("_", " ")
//       .replace(
//         /\b\w/g,
//         (letter) =>
//           letter.toUpperCase()
//       );
//   };

//   // =====================================================
//   // RENDER
//   // =====================================================

//   return (
//     <>
//       {/* MOBILE TOGGLE */}

//       <button
//         className="sidebar-drawer-toggle"
//         onClick={() =>
//           setIsDrawerOpen(
//             (previous) =>
//               !previous
//           )
//         }
//         aria-label="Open navigation menu"
//       >
//         {isDrawerOpen ? (
//           <MdClose />
//         ) : (
//           <MdMenu />
//         )}
//       </button>

//       {/* OVERLAY */}

//       {isDrawerOpen && (
//         <div
//           className="sidebar-overlay"
//           onClick={() =>
//             setIsDrawerOpen(false)
//           }
//         />
//       )}

//       {/* SIDEBAR */}

//       <aside
//         className={`sidebar ${
//           isDrawerOpen
//             ? "sidebar-open"
//             : ""
//         }`}
//       >
//         {/* MOBILE CLOSE */}

//         <button
//           className="sidebar-mobile-close"
//           onClick={() =>
//             setIsDrawerOpen(false)
//           }
//           aria-label="Close navigation menu"
//         >
//           <MdClose />
//         </button>

//         {/* SEARCH */}

//         <div className="sidebar-global-search">
//           <MdSearch className="sidebar-search-icon" />

//           <input
//             type="text"
//             placeholder="Search menu..."
//             value={sidebarSearch}
//             onChange={(event) =>
//               setSidebarSearch(
//                 event.target.value
//               )
//             }
//           />

//           {sidebarSearch && (
//             <button
//               type="button"
//               className="sidebar-search-clear"
//               onClick={() =>
//                 setSidebarSearch("")
//               }
//               aria-label="Clear sidebar search"
//             >
//               <MdClose />
//             </button>
//           )}
//         </div>

//         {/* MENU */}

//         <div className="sidebar-menu">
//           {filteredMenu.length === 0 ? (
//             <div className="sidebar-no-results">
//               <MdSearch />

//               <p>
//                 No menu found
//               </p>

//               <span>
//                 Try another search
//               </span>
//             </div>
//           ) : (
//             filteredMenu.map(
//               (section) => (
//                 <div
//                   key={
//                     section.title
//                   }
//                   className="menu-section"
//                 >
//                   <p className="menu-title">
//                     {
//                       section.title
//                     }
//                   </p>

//                   {section.links.map(
//                     (item) => {
//                       const isActive =
//                         location.pathname ===
//                         item.path ||
//                         (
//                           item.path !==
//                             "/admin-dashboard" &&
//                           location.pathname.startsWith(
//                             `${item.path}/`
//                           )
//                         );

//                       return (
//                         <div
//                           key={
//                             item.path
//                           }
//                           className="sidebar-menu-wrapper"
//                         >
//                           <button
//                             className={`menu-item ${
//                               isActive
//                                 ? "active"
//                                 : ""
//                             }`}
//                             onClick={() => {
//                               if (
//                                 item.notification
//                               ) {
//                                 setNotificationOpen(
//                                   (
//                                     previous
//                                   ) =>
//                                     !previous
//                                 );

//                                 setNotificationSearch(
//                                   ""
//                                 );

//                                 return;
//                               }

//                               handleNavigation(
//                                 item.path
//                               );
//                             }}
//                           >
//                             <span className="icon">
//                               {
//                                 item.icon
//                               }
//                             </span>

//                             <span className="menu-text">
//                               {
//                                 item.name
//                               }
//                             </span>

//                             {item.notification &&
//                               unreadCount >
//                                 0 && (
//                                 <span className="notification-count-badge">
//                                   {unreadCount >
//                                   99
//                                     ? "99+"
//                                     : unreadCount}
//                                 </span>
//                               )}

//                             <span className="menu-arrow">
//                               <MdChevronRight
//                                 className={
//                                   item.notification &&
//                                   notificationOpen
//                                     ? "notification-arrow-open"
//                                     : ""
//                                 }
//                               />
//                             </span>
//                           </button>

//                           {/* NOTIFICATION PANEL */}

//                           {item.notification &&
//                             notificationOpen && (
//                               <div className="sidebar-notification-panel">
//                                 <div className="notification-panel-header">
//                                   <div>
//                                     <h4>
//                                       Notifications
//                                     </h4>

//                                     <span>
//                                       {
//                                         unreadCount
//                                       }{" "}
//                                       unread
//                                     </span>
//                                   </div>

//                                   <button
//                                     type="button"
//                                     className="notification-refresh-btn"
//                                     onClick={
//                                       loadNotifications
//                                     }
//                                     title="Refresh notifications"
//                                   >
//                                     <MdRefresh
//                                       className={
//                                         notificationLoading
//                                           ? "notification-refresh-spin"
//                                           : ""
//                                       }
//                                     />
//                                   </button>
//                                 </div>

//                                 <div className="notification-search-box">
//                                   <MdSearch />

//                                   <input
//                                     type="text"
//                                     placeholder="Search notifications..."
//                                     value={
//                                       notificationSearch
//                                     }
//                                     onChange={(
//                                       event
//                                     ) =>
//                                       setNotificationSearch(
//                                         event
//                                           .target
//                                           .value
//                                       )
//                                     }
//                                   />

//                                   {notificationSearch && (
//                                     <button
//                                       type="button"
//                                       className="notification-search-clear"
//                                       onClick={() =>
//                                         setNotificationSearch(
//                                           ""
//                                         )
//                                       }
//                                     >
//                                       <MdClose />
//                                     </button>
//                                   )}
//                                 </div>

//                                 {notifications.length >
//                                   0 && (
//                                   <div className="notification-panel-actions">
//                                     <span>
//                                       {
//                                         filteredNotifications.length
//                                       }{" "}
//                                       notification
//                                       {filteredNotifications.length !==
//                                       1
//                                         ? "s"
//                                         : ""}
//                                     </span>

//                                     {unreadCount >
//                                       0 && (
//                                       <button
//                                         type="button"
//                                         onClick={
//                                           handleMarkAllRead
//                                         }
//                                       >
//                                         <MdDoneAll />

//                                         Mark all
//                                         read
//                                       </button>
//                                     )}
//                                   </div>
//                                 )}

//                                 {notificationLoading &&
//                                   notifications.length ===
//                                     0 && (
//                                     <div className="notification-empty-state">
//                                       <div className="notification-loader" />

//                                       <p>
//                                         Loading
//                                         notifications...
//                                       </p>
//                                     </div>
//                                   )}

//                                 {!notificationLoading &&
//                                   filteredNotifications.length ===
//                                     0 && (
//                                     <div className="notification-empty-state">
//                                       <MdNotifications />

//                                       <p>
//                                         {notificationSearch
//                                           ? "No notifications found"
//                                           : "No notifications"}
//                                       </p>

//                                       {notificationSearch && (
//                                         <span>
//                                           Try another
//                                           search
//                                         </span>
//                                       )}
//                                     </div>
//                                   )}

//                                 {filteredNotifications.length >
//                                   0 && (
//                                   <div className="notification-list">
//                                     {filteredNotifications.map(
//                                       (
//                                         notification
//                                       ) => (
//                                         <button
//                                           type="button"
//                                           key={
//                                             notification._id
//                                           }
//                                           className={`notification-item ${
//                                             notification.isRead
//                                               ? "notification-read"
//                                               : "notification-unread"
//                                           }`}
//                                           onClick={() =>
//                                             handleNotificationClick(
//                                               notification
//                                             )
//                                           }
//                                         >
//                                           <div className="notification-item-icon">
//                                             <MdNotifications />

//                                             {!notification.isRead && (
//                                               <span className="notification-unread-dot" />
//                                             )}
//                                           </div>

//                                           <div className="notification-item-content">
//                                             <div className="notification-item-top">
//                                               <strong>
//                                                 {notification.title ||
//                                                   getNotificationType(
//                                                     notification
//                                                   )}
//                                               </strong>

//                                               {!notification.isRead && (
//                                                 <MdCircle className="notification-small-dot" />
//                                               )}
//                                             </div>

//                                             <p>
//                                               {notification.message ||
//                                                 "You have a new notification."}
//                                             </p>

//                                             <div className="notification-item-bottom">
//                                               <span>
//                                                 {getNotificationType(
//                                                   notification
//                                                 )}
//                                               </span>

//                                               <time>
//                                                 {formatNotificationDate(
//                                                   notification.createdAt ||
//                                                     notification.updatedAt
//                                                 )}
//                                               </time>
//                                             </div>
//                                           </div>
//                                         </button>
//                                       )
//                                     )}
//                                   </div>
//                                 )}

//                                 <button
//                                   type="button"
//                                   className="notification-view-all"
//                                   onClick={() => {
//                                     setNotificationOpen(
//                                       false
//                                     );

//                                     setIsDrawerOpen(
//                                       false
//                                     );

//                                     navigate(
//                                       "/notifications"
//                                     );
//                                   }}
//                                 >
//                                   View all
//                                   notifications

//                                   <MdChevronRight />
//                                 </button>
//                               </div>
//                             )}
//                         </div>
//                       );
//                     }
//                   )}
//                 </div>
//               )
//             )
//           )}
//         </div>

//                 {/* =====================================================
//             LOGOUT
//         ===================================================== */}

//         <div className="sidebar-logout-wrapper">
//           <button
//             type="button"
//             className="sidebar-logout-button"
//             onClick={handleLogout}
//           >
//             <span className="sidebar-logout-icon">
//               <MdLogout />
//             </span>

//             <span className="sidebar-logout-text">
//               Logout
//             </span>

//             <span className="sidebar-logout-arrow">
//               <MdChevronRight />
//             </span>
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }

// export default Sidebar;


import "./Sidebar.css";

import {
  useState,
  useEffect,
  useMemo,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

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
  MdMenu,
  MdClose,
  MdChevronRight,
  MdReceipt,
  MdLocalOffer,
  MdNotifications,
  MdRateReview,
  MdEventNote,
  MdEvent,
  MdPolicy,
  MdSearch,
  MdDoneAll,
  MdCircle,
  MdRefresh,
  MdLogout,
} from "react-icons/md";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../../services/notificationService";


function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {

  const navigate = useNavigate();
  const location = useLocation();


  // =====================================================
  // DRAWER
  // =====================================================

  const [isDrawerOpen, setIsDrawerOpen] =
    useState(false);


  // =====================================================
  // SIDEBAR SEARCH
  // =====================================================

  const [sidebarSearch, setSidebarSearch] =
    useState("");


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [notificationLoading, setNotificationLoading] =
    useState(false);

  const [notificationSearch, setNotificationSearch] =
    useState("");


  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

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

      console.log(
        "SIDEBAR NOTIFICATIONS:",
        response
      );

      let notificationList = [];

      if (Array.isArray(response)) {

        notificationList = response;

      } else if (
        Array.isArray(
          response?.notifications
        )
      ) {

        notificationList =
          response.notifications;

      } else if (
        Array.isArray(response?.data)
      ) {

        notificationList =
          response.data;

      } else if (
        Array.isArray(
          response?.data?.notifications
        )
      ) {

        notificationList =
          response.data.notifications;
      }


      setNotifications(notificationList);


      const backendUnreadCount =
        Number(
          response?.unreadCount ??
          response?.data?.unreadCount
        );


      if (
        Number.isFinite(
          backendUnreadCount
        )
      ) {

        setUnreadCount(
          backendUnreadCount
        );

      } else {

        const localUnread =
          notificationList.filter(
            (notification) =>
              !notification?.isRead
          ).length;

        setUnreadCount(localUnread);
      }

    } catch (error) {

      console.error(
        "SIDEBAR NOTIFICATION ERROR:",
        error
      );

    } finally {

      setNotificationLoading(false);

    }
  };


  // =====================================================
  // INITIAL NOTIFICATION LOAD
  // =====================================================

  useEffect(() => {

    loadNotifications();

  }, []);


  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (!token) return;


    const interval =
      setInterval(() => {

        loadNotifications();

      }, 15000);


    return () => {

      clearInterval(interval);

    };

  }, []);


  // =====================================================
  // MENU
  // =====================================================

  const menu = [

    {
      title: "MAIN",

      links: [

        {
          name: "Dashboard",
          icon: <MdDashboard />,
          path: "/admin-dashboard",
        },

        {
          name: "Notifications",
          icon: <MdNotifications />,
          path: "/notifications",
          notification: true,
        },

        {
          name: "Reviews",
          icon: <MdRateReview />,
          path: "/admin/reviews",
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
          name: "Leave Requests",
          icon: <MdEventNote />,
          path: "/admin/leaves",
        },

        {
          name: "Leave Policies",
          icon: <MdPolicy />,
          path: "/admin/leaves/policies",
        },

        {
          name: "Holidays",
          icon: <MdEvent />,
          path: "/admin/holidays",
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
          name: "Availability Requests",
          icon: <MdInventory />,
          path: "/admin/availability-requests",
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


  // =====================================================
  // FILTER MENU
  // =====================================================

  const filteredMenu = useMemo(() => {

    const search =
      sidebarSearch
        .trim()
        .toLowerCase();


    if (!search) {

      return menu;

    }


    return menu

      .map((section) => {

        const filteredLinks =
          section.links.filter(
            (item) =>
              item.name
                .toLowerCase()
                .includes(search)
          );


        return {
          ...section,
          links: filteredLinks,
        };

      })

      .filter(
        (section) =>
          section.links.length > 0
      );

  }, [sidebarSearch]);


  // =====================================================
  // FILTER NOTIFICATIONS
  // =====================================================

  const filteredNotifications =
    useMemo(() => {

      const search =
        notificationSearch
          .trim()
          .toLowerCase();


      if (!search) {

        return notifications;

      }


      return notifications.filter(
        (notification) => {

          const title =
            String(
              notification?.title || ""
            ).toLowerCase();


          const message =
            String(
              notification?.message || ""
            ).toLowerCase();


          const type =
            String(
              notification?.type || ""
            ).toLowerCase();


          return (
            title.includes(search) ||
            message.includes(search) ||
            type.includes(search)
          );

        }
      );

    }, [
      notifications,
      notificationSearch,
    ]);


  // =====================================================
  // NOTIFICATION CLICK
  // =====================================================

  const handleNotificationClick =
    async (notification) => {

      if (!notification) return;


      try {

        if (
          !notification.isRead &&
          notification._id
        ) {

          await markNotificationAsRead(
            notification._id
          );


          setNotifications(
            (previous) =>
              previous.map((item) =>
                item._id ===
                notification._id
                  ? {
                      ...item,
                      isRead: true,
                    }
                  : item
              )
          );


          setUnreadCount(
            (previous) =>
              Math.max(
                previous - 1,
                0
              )
          );

        }

      } catch (error) {

        console.error(
          "MARK NOTIFICATION ERROR:",
          error
        );

      }


      setNotificationOpen(false);
      setIsDrawerOpen(false);


      // ORDER

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


      // STOCK

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


      // RESTOCK

      if (
        notification?.type ===
          "PRODUCT_RESTOCKED" &&
        notification?.relatedId
      ) {

        navigate(
          `/admin/products/${notification.relatedId}`
        );

        return;
      }


      navigate("/notifications");

    };


  // =====================================================
  // MARK ALL READ
  // =====================================================

  const handleMarkAllRead =
    async () => {

      try {

        await markAllNotificationsAsRead();


        setNotifications(
          (previous) =>
            previous.map((item) => ({
              ...item,
              isRead: true,
            }))
        );


        setUnreadCount(0);

      } catch (error) {

        console.error(
          "MARK ALL READ ERROR:",
          error
        );

      }

    };


  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleNavigation = (
    path
  ) => {

    navigate(path);

    setIsDrawerOpen(false);
    setNotificationOpen(false);

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem("user");


    setIsDrawerOpen(false);
    setNotificationOpen(false);


    navigate("/");

  };


  // =====================================================
  // DATE
  // =====================================================

  const formatNotificationDate = (
    date
  ) => {

    if (!date) return "";


    const notificationDate =
      new Date(date);


    if (
      Number.isNaN(
        notificationDate.getTime()
      )
    ) {

      return "";

    }


    return notificationDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  };


  // =====================================================
  // NOTIFICATION TYPE
  // =====================================================

  const getNotificationType = (
    notification
  ) => {

    if (!notification?.type) {

      return "Notification";

    }


    return String(
      notification.type
    )

      .replaceAll("_", " ")

      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );

  };


  // =====================================================
  // DESKTOP SIDEBAR TOGGLE
  // =====================================================

  const handleDesktopToggle = () => {

    if (setSidebarOpen) {

      setSidebarOpen(
        (previous) => !previous
      );

    }

    setNotificationOpen(false);

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>

      {/* =================================================
          DESKTOP SIDEBAR TOGGLE
      ================================================= */}

      <button
        type="button"
        className={`sidebar-desktop-toggle ${
          sidebarOpen
            ? "sidebar-desktop-toggle-open"
            : "sidebar-desktop-toggle-closed"
        }`}
        onClick={handleDesktopToggle}
        aria-label={
          sidebarOpen
            ? "Close sidebar"
            : "Open sidebar"
        }
        title={
          sidebarOpen
            ? "Close sidebar"
            : "Open sidebar"
        }
      >

        {sidebarOpen ? (
          <MdClose />
        ) : (
          <MdMenu />
        )}

      </button>


      {/* =================================================
          MOBILE TOGGLE
      ================================================= */}

      <button
        className="sidebar-drawer-toggle"
        onClick={() =>
          setIsDrawerOpen(
            (previous) =>
              !previous
          )
        }
        aria-label="Open navigation menu"
      >

        {isDrawerOpen ? (
          <MdClose />
        ) : (
          <MdMenu />
        )}

      </button>


      {/* =================================================
          OVERLAY
      ================================================= */}

      {isDrawerOpen && (

        <div
          className="sidebar-overlay"
          onClick={() =>
            setIsDrawerOpen(false)
          }
        />

      )}


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`sidebar ${
          isDrawerOpen
            ? "sidebar-open"
            : ""
        } ${
          sidebarOpen
            ? "desktop-sidebar-open"
            : "desktop-sidebar-closed"
        }`}
      >

        {/* =================================================
            MOBILE CLOSE
        ================================================= */}

        <button
          className="sidebar-mobile-close"
          onClick={() =>
            setIsDrawerOpen(false)
          }
          aria-label="Close navigation menu"
        >

          <MdClose />

        </button>


        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="sidebar-global-search">

          <MdSearch className="sidebar-search-icon" />


          <input
            type="text"
            placeholder="Search menu..."
            value={sidebarSearch}
            onChange={(event) =>
              setSidebarSearch(
                event.target.value
              )
            }
          />


          {sidebarSearch && (

            <button
              type="button"
              className="sidebar-search-clear"
              onClick={() =>
                setSidebarSearch("")
              }
              aria-label="Clear sidebar search"
            >

              <MdClose />

            </button>

          )}

        </div>


        {/* =================================================
            MENU
        ================================================= */}

        <div className="sidebar-menu">

          {filteredMenu.length === 0 ? (

            <div className="sidebar-no-results">

              <MdSearch />

              <p>
                No menu found
              </p>

              <span>
                Try another search
              </span>

            </div>

          ) : (

            filteredMenu.map(
              (section) => (

                <div
                  key={
                    section.title
                  }
                  className="menu-section"
                >

                  <p className="menu-title">
                    {
                      section.title
                    }
                  </p>


                  {section.links.map(
                    (item) => {

                      const isActive =
                        location.pathname ===
                        item.path ||
                        (
                          item.path !==
                            "/admin-dashboard" &&
                          location.pathname.startsWith(
                            `${item.path}/`
                          )
                        );


                      return (

                        <div
                          key={
                            item.path
                          }
                          className="sidebar-menu-wrapper"
                        >

                          <button
                            className={`menu-item ${
                              isActive
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {

                              if (
                                item.notification
                              ) {

                                setNotificationOpen(
                                  (previous) =>
                                    !previous
                                );

                                setNotificationSearch(
                                  ""
                                );

                                return;
                              }


                              handleNavigation(
                                item.path
                              );

                            }}
                          >

                            <span className="icon">

                              {
                                item.icon
                              }

                            </span>


                            <span className="menu-text">

                              {
                                item.name
                              }

                            </span>


                            {item.notification &&
                              unreadCount >
                                0 && (

                                <span className="notification-count-badge">

                                  {
                                    unreadCount >
                                    99
                                      ? "99+"
                                      : unreadCount
                                  }

                                </span>

                              )}


                            <span className="menu-arrow">

                              <MdChevronRight
                                className={
                                  item.notification &&
                                  notificationOpen
                                    ? "notification-arrow-open"
                                    : ""
                                }
                              />

                            </span>

                          </button>


                          {/* =================================================
                              NOTIFICATION PANEL
                          ================================================= */}

                          {item.notification &&
                            notificationOpen && (

                            <div className="sidebar-notification-panel">

                              <div className="notification-panel-header">

                                <div>

                                  <h4>
                                    Notifications
                                  </h4>

                                  <span>
                                    {
                                      unreadCount
                                    }{" "}
                                    unread
                                  </span>

                                </div>


                                <button
                                  type="button"
                                  className="notification-refresh-btn"
                                  onClick={
                                    loadNotifications
                                  }
                                  title="Refresh notifications"
                                >

                                  <MdRefresh
                                    className={
                                      notificationLoading
                                        ? "notification-refresh-spin"
                                        : ""
                                    }
                                  />

                                </button>

                              </div>


                              <div className="notification-search-box">

                                <MdSearch />

                                <input
                                  type="text"
                                  placeholder="Search notifications..."
                                  value={
                                    notificationSearch
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    setNotificationSearch(
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                />


                                {notificationSearch && (

                                  <button
                                    type="button"
                                    className="notification-search-clear"
                                    onClick={() =>
                                      setNotificationSearch(
                                        ""
                                      )
                                    }
                                  >

                                    <MdClose />

                                  </button>

                                )}

                              </div>


                              {notifications.length >
                                0 && (

                                <div className="notification-panel-actions">

                                  <span>

                                    {
                                      filteredNotifications.length
                                    }{" "}
                                    notification
                                    {
                                      filteredNotifications.length !==
                                      1
                                        ? "s"
                                        : ""
                                    }

                                  </span>


                                  {unreadCount >
                                    0 && (

                                    <button
                                      type="button"
                                      onClick={
                                        handleMarkAllRead
                                      }
                                    >

                                      <MdDoneAll />

                                      Mark all
                                      read

                                    </button>

                                  )}

                                </div>

                              )}


                              {notificationLoading &&
                                notifications.length ===
                                  0 && (

                                <div className="notification-empty-state">

                                  <div className="notification-loader" />

                                  <p>
                                    Loading
                                    notifications...
                                  </p>

                                </div>

                              )}


                              {!notificationLoading &&
                                filteredNotifications.length ===
                                  0 && (

                                <div className="notification-empty-state">

                                  <MdNotifications />

                                  <p>

                                    {
                                      notificationSearch
                                        ? "No notifications found"
                                        : "No notifications"
                                    }

                                  </p>


                                  {notificationSearch && (

                                    <span>
                                      Try another
                                      search
                                    </span>

                                  )}

                                </div>

                              )}


                              {filteredNotifications.length >
                                0 && (

                                <div className="notification-list">

                                  {filteredNotifications.map(
                                    (
                                      notification
                                    ) => (

                                      <button
                                        type="button"
                                        key={
                                          notification._id
                                        }
                                        className={`notification-item ${
                                          notification.isRead
                                            ? "notification-read"
                                            : "notification-unread"
                                        }`}
                                        onClick={() =>
                                          handleNotificationClick(
                                            notification
                                          )
                                        }
                                      >

                                        <div className="notification-item-icon">

                                          <MdNotifications />

                                          {!notification.isRead && (

                                            <span className="notification-unread-dot" />

                                          )}

                                        </div>


                                        <div className="notification-item-content">

                                          <div className="notification-item-top">

                                            <strong>

                                              {
                                                notification.title ||
                                                getNotificationType(
                                                  notification
                                                )
                                              }

                                            </strong>


                                            {!notification.isRead && (

                                              <MdCircle className="notification-small-dot" />

                                            )}

                                          </div>


                                          <p>

                                            {
                                              notification.message ||
                                              "You have a new notification."
                                            }

                                          </p>


                                          <div className="notification-item-bottom">

                                            <span>

                                              {
                                                getNotificationType(
                                                  notification
                                                )
                                              }

                                            </span>


                                            <time>

                                              {
                                                formatNotificationDate(
                                                  notification.createdAt ||
                                                  notification.updatedAt
                                                )
                                              }

                                            </time>

                                          </div>

                                        </div>

                                      </button>

                                    )
                                  )}

                                </div>

                              )}


                              <button
                                type="button"
                                className="notification-view-all"
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

                                View all
                                notifications

                                <MdChevronRight />

                              </button>

                            </div>

                          )}

                        </div>

                      );

                    }
                  )}

                </div>

              )

            )

          )}

        </div>


        {/* =====================================================
            LOGOUT
        ===================================================== */}

        <div className="sidebar-logout-wrapper">

          <button
            type="button"
            className="sidebar-logout-button"
            onClick={handleLogout}
          >

            <span className="sidebar-logout-icon">

              <MdLogout />

            </span>


            <span className="sidebar-logout-text">

              Logout

            </span>


            <span className="sidebar-logout-arrow">

              <MdChevronRight />

            </span>

          </button>

        </div>

      </aside>

    </>
  );
}


export default Sidebar;
