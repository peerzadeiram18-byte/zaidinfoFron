// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// import {
//   FiHome,
//   FiBell,
//   FiCheckCircle,
//   FiX,
//   FiRefreshCw,
// } from "react-icons/fi";

// import DashboardCard from "../../components/Admin/DashboardCard/DashboardCard";
// import DashboardTable from "../../components/Admin/DashboardTable/DashboardTable";
// import { getUsers } from "../../services/userService";
// import {
//   getMyNotifications,
//   markNotificationAsRead,
//   markAllNotificationsAsRead,
// } from "../../services/notificationService";

// import "./AdminDashboard.css";

// const API_URL = import.meta.env.VITE_API_URL;

// const initialCustomers = [
//   {
//     name: "Ali",
//     email: "ali@gmail.com",
//     status: "Active",
//   },
//   {
//     name: "John",
//     email: "john@gmail.com",
//     status: "Active",
//   },
//   {
//     name: "Sara",
//     email: "sara@gmail.com",
//     status: "Inactive",
//   },
// ];

// export default function AdminDashboard() {
//   const navigate = useNavigate();

//   // =========================================================
//   // EXISTING CUSTOMER DATA
//   // =========================================================

//   const [customers] = useState(initialCustomers);

//   const [customerCount, setCustomerCount] = useState(0);

//   // =========================================================
//   // EXISTING COUNTS
//   // =========================================================

//   const [counts, setCounts] = useState({
//     orderCount: 0,
//     employeeCount: 0,
//   });

//   // =========================================================
//   // NOTIFICATIONS
//   // =========================================================

//   const [notifications, setNotifications] = useState([]);

//   const [notificationLoading, setNotificationLoading] =
//     useState(false);

//   const [showNotificationPanel, setShowNotificationPanel] =
//     useState(false);

//   // =========================================================
//   // GET AUTH TOKEN
//   // =========================================================

//   const getToken = () => {
//     return localStorage.getItem("token");
//   };

//   // =========================================================
//   // LOAD CUSTOMERS
//   // EXISTING LOGIC PRESERVED
//   // =========================================================

//   const getCustomers = async () => {
//     const token = getToken();

//     if (!token) {
//       setCustomerCount(0);
//       return;
//     }

//     try {
//       const res = await axios.get(`${API_URL}/users`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const users = Array.isArray(res.data?.users)
//         ? res.data.users
//         : [];

//       const customers = users.filter(
//         (user) => user.role === "CUSTOMER"
//       );

//       setCustomerCount(customers.length);
//     } catch (error) {
//       console.error(
//         "Failed to fetch customers:",
//         error
//       );

//       setCustomerCount(0);
//     }
//   };

//   // =========================================================
//   // LOAD ORDERS
//   // EXISTING LOGIC PRESERVED
//   // =========================================================

//   const getOrders = async () => {
//     try {
//       const token = getToken();

//       if (!token) {
//         return;
//       }

//       const res = await axios.get(`${API_URL}/orders`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const ordersLength =
//         res?.data?.orders?.length ||
//         res?.data?.data?.orders?.length ||
//         res?.data?.data?.length ||
//         0;

//       setCounts((prev) => ({
//         ...prev,
//         orderCount: ordersLength,
//       }));
//     } catch (error) {
//       console.error(
//         "Dashboard orders error:",
//         error
//       );
//     }
//   };

//   // =========================================================
//   // LOAD EMPLOYEES
//   // EXISTING LOGIC PRESERVED
//   // =========================================================

//   const getEmployees = async () => {
//     try {
//       const token = getToken();

//       if (!token) {
//         return;
//       }

//       const res = await axios.get(
//         `${API_URL}/users/employees`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const employeeLength =
//         res?.data?.data?.length || 0;

//       setCounts((prev) => ({
//         ...prev,
//         employeeCount: employeeLength,
//       }));
//     } catch (error) {
//       console.error(
//         "Cant get the employees :",
//         error
//       );
//     }
//   };

//   // =========================================================
//   // NORMALIZE NOTIFICATION RESPONSE
//   // =========================================================

//   const normalizeNotifications = (response) => {
//     const notificationList =
//       response?.notifications ||
//       response?.data?.notifications ||
//       response?.data?.data ||
//       response?.data ||
//       [];

//     if (!Array.isArray(notificationList)) {
//       return [];
//     }

//     return notificationList;
//   };

//   // =========================================================
//   // GET UNREAD STATUS
//   // =========================================================

//   const isNotificationRead = (notification) => {
//     return (
//       notification?.isRead === true ||
//       notification?.read === true ||
//       notification?.status === "READ"
//     );
//   };

//   // =========================================================
//   // LOAD NOTIFICATIONS
//   // =========================================================

//   const loadNotifications = useCallback(
//     async (silent = false) => {
//       const token = getToken();

//       if (!token) {
//         setNotifications([]);
//         return;
//       }

//       try {
//         if (!silent) {
//           setNotificationLoading(true);
//         }

//         const response =
//           await getMyNotifications();

//         const list =
//           normalizeNotifications(response);

//         setNotifications(list);
//       } catch (error) {
//         console.error(
//           "DASHBOARD NOTIFICATIONS ERROR:",
//           error
//         );

//         /*
//          * Important:
//          * Notification API fail hone par dashboard
//          * crash nahi hoga.
//          */
//         setNotifications([]);
//       } finally {
//         if (!silent) {
//           setNotificationLoading(false);
//         }
//       }
//     },
//     []
//   );

//   // =========================================================
//   // UNREAD COUNT
//   // =========================================================

//   const unreadNotifications =
//     notifications.filter(
//       (notification) =>
//         !isNotificationRead(notification)
//     );

//   const unreadCount =
//     unreadNotifications.length;

//   // =========================================================
//   // OPEN NOTIFICATION
//   // =========================================================

//   const handleNotificationClick = async (
//     notification
//   ) => {
//     if (!notification) {
//       return;
//     }

//     try {
//       if (
//         !isNotificationRead(notification) &&
//         notification?._id
//       ) {
//         await markNotificationAsRead(
//           notification._id
//         );

//         setNotifications((prev) =>
//           prev.map((item) =>
//             item._id === notification._id
//               ? {
//                   ...item,
//                   isRead: true,
//                   read: true,
//                   status: "READ",
//                 }
//               : item
//           )
//         );
//       }
//     } catch (error) {
//       console.error(
//         "MARK NOTIFICATION READ ERROR:",
//         error
//       );
//     }

//     // =====================================================
//     // SAME NAVIGATION STYLE AS EXISTING SIDEBAR
//     // =====================================================

//     const relatedId =
//       notification?.relatedId ||
//       notification?.orderId ||
//       notification?.relatedOrderId;

//     const type = String(
//       notification?.type ||
//         notification?.notificationType ||
//         ""
//     ).toUpperCase();

//     setShowNotificationPanel(false);

//     if (
//       type.includes("ORDER") &&
//       relatedId
//     ) {
//       navigate(
//         `/admin/orders/${relatedId}`
//       );

//       return;
//     }

//     if (
//       type.includes("STOCK") ||
//       type.includes("INVENTORY")
//     ) {
//       navigate(
//         `/inventory-dashboard?product=${
//           notification?.productId || ""
//         }`
//       );

//       return;
//     }

//     navigate("/notifications");
//   };

//   // =========================================================
//   // MARK ALL AS READ
//   // =========================================================

//   const handleMarkAllRead = async () => {
//     if (unreadCount === 0) {
//       return;
//     }

//     try {
//       await markAllNotificationsAsRead();

//       setNotifications((prev) =>
//         prev.map((notification) => ({
//           ...notification,
//           isRead: true,
//           read: true,
//           status: "READ",
//         }))
//       );
//     } catch (error) {
//       console.error(
//         "MARK ALL NOTIFICATIONS ERROR:",
//         error
//       );
//     }
//   };

//   // =========================================================
//   // FORMAT NOTIFICATION DATE
//   // =========================================================

//   const formatNotificationDate = (value) => {
//     if (!value) {
//       return "";
//     }

//     const date = new Date(value);

//     if (Number.isNaN(date.getTime())) {
//       return "";
//     }

//     return date.toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // =========================================================
//   // NOTIFICATION TITLE
//   // =========================================================

//   const getNotificationTitle = (
//     notification
//   ) => {
//     return (
//       notification?.title ||
//       notification?.subject ||
//       notification?.notificationTitle ||
//       notification?.type ||
//       "Notification"
//     );
//   };

//   // =========================================================
//   // NOTIFICATION MESSAGE
//   // =========================================================

//   const getNotificationMessage = (
//     notification
//   ) => {
//     return (
//       notification?.message ||
//       notification?.description ||
//       notification?.body ||
//       "You have a new notification."
//     );
//   };

//   // =========================================================
//   // INITIAL LOAD
//   // =========================================================

//   useEffect(() => {
//     getOrders();
//     getEmployees();
//     getCustomers();

//     loadNotifications();
//   }, [loadNotifications]);

//   // =========================================================
//   // AUTO REFRESH NOTIFICATIONS
//   // EVERY 15 SECONDS
//   // =========================================================

//   useEffect(() => {
//     const token = getToken();

//     if (!token) {
//       return undefined;
//     }

//     const interval = setInterval(() => {
//       loadNotifications(true);
//     }, 15000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, [loadNotifications]);

//   // =========================================================
//   // REFRESH ALL
//   // =========================================================

//   const handleRefreshDashboard = async () => {
//     await Promise.all([
//       getOrders(),
//       getEmployees(),
//       getCustomers(),
//       loadNotifications(),
//     ]);
//   };

//   // =========================================================
//   // UI
//   // =========================================================

//   return (
//     <div className="app admin-app">
//       <main className="admin-main">
//         <div className="content">

//           {/* =================================================
//               DASHBOARD HEADER
//           ================================================= */}

//           <div className="dashboard-header">

//             {/* ===============================================
//                 LEFT SIDE
//             =============================================== */}

//             <div className="dashboard-header-left">

//               <h1 className="dashboard-title">
//                 Dashboard
//               </h1>

//               <p className="dashboard-subtitle">
//                 Welcome back, here's what's happening today
//               </p>

//             </div>

//             {/* ===============================================
//                 RIGHT SIDE ICONS
//             =============================================== */}

//             <div className="dashboard-header-actions">

//               {/* =============================================
//                   HOME BUTTON
//               ============================================= */}

//               <button
//                 type="button"
//                 className="dashboard-header-icon dashboard-home-button"
//                 onClick={() => navigate("/")}
//                 title="Go to Home"
//                 aria-label="Go to Home"
//               >
//                 <FiHome size={21} />
//               </button>

//               {/* =============================================
//                   NOTIFICATION WRAPPER
//               ============================================= */}

//               <div className="dashboard-notification-wrapper">

//                 <button
//                   type="button"
//                   className={`dashboard-header-icon dashboard-bell-button ${
//                     unreadCount > 0
//                       ? "dashboard-bell-has-notification"
//                       : ""
//                   }`}
//                   onClick={() =>
//                     setShowNotificationPanel(
//                       (prev) => !prev
//                     )
//                   }
//                   title="Notifications"
//                   aria-label="Notifications"
//                 >

//                   <FiBell size={21} />

//                   {/* =========================================
//                       UNREAD BADGE
//                   ========================================= */}

//                   {unreadCount > 0 && (
//                     <span className="dashboard-notification-badge">
//                       {unreadCount > 99
//                         ? "99+"
//                         : unreadCount}
//                     </span>
//                   )}

//                 </button>

//                 {/* =========================================
//                     NOTIFICATION DROPDOWN
//                 ========================================= */}

//                 {showNotificationPanel && (
//                   <div className="dashboard-notification-panel">

//                     {/* =======================================
//                         PANEL HEADER
//                     ======================================= */}

//                     <div className="dashboard-notification-panel-header">

//                       <div>
//                         <h3>
//                           Notifications
//                         </h3>

//                         <span>
//                           {unreadCount > 0
//                             ? `${unreadCount} unread`
//                             : "All caught up"}
//                         </span>
//                       </div>

//                       <button
//                         type="button"
//                         className="dashboard-notification-close"
//                         onClick={() =>
//                           setShowNotificationPanel(
//                             false
//                           )
//                         }
//                         aria-label="Close notifications"
//                       >
//                         <FiX size={18} />
//                       </button>

//                     </div>

//                     {/* =======================================
//                         MARK ALL READ
//                     ======================================= */}

//                     {unreadCount > 0 && (
//                       <button
//                         type="button"
//                         className="dashboard-mark-all-read"
//                         onClick={handleMarkAllRead}
//                       >
//                         <FiCheckCircle size={15} />
//                         Mark all as read
//                       </button>
//                     )}

//                     {/* =======================================
//                         LOADING
//                     ======================================= */}

//                     {notificationLoading ? (
//                       <div className="dashboard-notification-empty">

//                         <FiRefreshCw
//                           className="dashboard-notification-loading-icon"
//                           size={22}
//                         />

//                         <span>
//                           Loading notifications...
//                         </span>

//                       </div>
//                     ) : notifications.length === 0 ? (
//                       /* =====================================
//                          EMPTY
//                       ===================================== */

//                       <div className="dashboard-notification-empty">

//                         <FiBell size={26} />

//                         <strong>
//                           No notifications
//                         </strong>

//                         <span>
//                           You're all caught up.
//                         </span>

//                       </div>
//                     ) : (
//                       /* =====================================
//                          NOTIFICATION LIST
//                       ===================================== */

//                       <div className="dashboard-notification-list">

//                         {notifications
//                           .slice(0, 10)
//                           .map(
//                             (
//                               notification,
//                               index
//                             ) => {

//                               const unread =
//                                 !isNotificationRead(
//                                   notification
//                                 );

//                               return (
//                                 <button
//                                   type="button"
//                                   key={
//                                     notification?._id ||
//                                     notification?.id ||
//                                     index
//                                   }
//                                   className={`dashboard-notification-item ${
//                                     unread
//                                       ? "dashboard-notification-unread"
//                                       : ""
//                                   }`}
//                                   onClick={() =>
//                                     handleNotificationClick(
//                                       notification
//                                     )
//                                   }
//                                 >

//                                   <div className="dashboard-notification-dot-wrapper">

//                                     <span
//                                       className={`dashboard-notification-dot ${
//                                         unread
//                                           ? "dashboard-notification-dot-unread"
//                                           : ""
//                                       }`}
//                                     />

//                                   </div>

//                                   <div className="dashboard-notification-content">

//                                     <strong>
//                                       {getNotificationTitle(
//                                         notification
//                                       )}
//                                     </strong>

//                                     <p>
//                                       {getNotificationMessage(
//                                         notification
//                                       )}
//                                     </p>

//                                     <small>
//                                       {formatNotificationDate(
//                                         notification?.createdAt ||
//                                           notification?.updatedAt
//                                       )}
//                                     </small>

//                                   </div>

//                                 </button>
//                               );
//                             }
//                           )}

//                       </div>
//                     )}

//                     {/* =======================================
//                         VIEW ALL
//                     ======================================= */}

//                     {notifications.length > 0 && (
//                       <button
//                         type="button"
//                         className="dashboard-view-all-notifications"
//                         onClick={() => {
//                           setShowNotificationPanel(
//                             false
//                           );

//                           navigate(
//                             "/notifications"
//                           );
//                         }}
//                       >
//                         View all notifications
//                       </button>
//                     )}

//                   </div>
//                 )}

//               </div>

//               {/* =============================================
//                   REFRESH BUTTON
//               ============================================= */}

//               <button
//                 type="button"
//                 className="dashboard-header-icon dashboard-refresh-button"
//                 onClick={handleRefreshDashboard}
//                 title="Refresh Dashboard"
//                 aria-label="Refresh Dashboard"
//               >
//                 <FiRefreshCw size={19} />
//               </button>

//             </div>

//           </div>

//           {/* =================================================
//               STATS
//           ================================================= */}

//           <div className="stats">

//             <DashboardCard
//               title="Customers"
//               total={customerCount}
//               delta="8.2%"
//               up={true}
//               accent="accent"
//               iconType="customers"
//               sparkPoints="0,22 10,18 20,20 30,15 40,17 50,10 60,12"
//               onClick={() =>
//                 navigate("/customers")
//               }
//             />

//             <DashboardCard
//               title="Employees"
//               total={counts.employeeCount}
//               delta="8.2%"
//               up={true}
//               accent="accent"
//               iconType="employees"
//               sparkPoints="0,22 10,18 20,20 30,15 40,17 50,10 60,12"
//               onClick={() =>
//                 navigate("/employees")
//               }
//             />

//             <DashboardCard
//               title="Orders"
//               total={counts.orderCount}
//               delta="5 today"
//               up={true}
//               accent="blue"
//               iconType="orders"
//               sparkPoints="0,15 10,20 20,12 30,22 40,16 50,24 60,18"
//             />

//             <DashboardCard
//               title="Products"
//               total="75"
//               delta="3 categories"
//               up={false}
//               accent="violet"
//               iconType="products"
//               sparkPoints="0,20 15,20 30,19 45,18 60,17"
//             />

//             <DashboardCard
//               title="Revenue"
//               total="₹1.25L"
//               delta="12.4%"
//               up={true}
//               accent="warning"
//               iconType="revenue"
//               sparkPoints="0,22 10,22 20,20 30,18 40,21 50,15 60,16"
//             />

//           </div>

//           {/* =================================================
//               CHARTS
//           ================================================= */}

//           <div className="grid-2">

//             {/* ===============================================
//                 REVENUE
//             =============================================== */}

//             <div className="panel panel-pad">

//               <div className="panel-head">

//                 <div>

//                   <div className="panel-title">
//                     Revenue trend
//                   </div>

//                   <div className="panel-sub">
//                     Last 14 days
//                   </div>

//                 </div>

//                 <span className="pill">
//                   +12.4%
//                 </span>

//               </div>

//               <div className="chart-wrap">

//                 <svg
//                   viewBox="0 0 500 150"
//                   width="100%"
//                   height="100%"
//                   preserveAspectRatio="none"
//                 >

//                   <defs>

//                     <linearGradient
//                       id="areaFill"
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >

//                       <stop
//                         offset="0%"
//                         className="chart-fill-start"
//                       />

//                       <stop
//                         offset="100%"
//                         className="chart-fill-end"
//                       />

//                     </linearGradient>

//                   </defs>

//                   <line
//                     x1="0"
//                     y1="30"
//                     x2="500"
//                     y2="30"
//                     className="chart-grid-line"
//                   />

//                   <line
//                     x1="0"
//                     y1="75"
//                     x2="500"
//                     y2="75"
//                     className="chart-grid-line"
//                   />

//                   <line
//                     x1="0"
//                     y1="120"
//                     x2="500"
//                     y2="120"
//                     className="chart-grid-line"
//                   />

//                   <polygon
//                     points="
//                       0,110
//                       40,95
//                       80,100
//                       120,85
//                       160,92
//                       200,70
//                       240,80
//                       280,65
//                       320,72
//                       360,60
//                       400,45
//                       440,55
//                       480,62
//                       480,150
//                       0,150
//                     "
//                     className="revenue-area"
//                   />

//                   <polyline
//                     points="
//                       0,110
//                       40,95
//                       80,100
//                       120,85
//                       160,92
//                       200,70
//                       240,80
//                       280,65
//                       320,72
//                       360,60
//                       400,45
//                       440,55
//                       480,62
//                     "
//                     className="revenue-line"
//                   />

//                   <polyline
//                     points="
//                       0,135
//                       40,135
//                       80,130
//                       120,128
//                       160,133
//                       200,120
//                       240,122
//                       280,115
//                       320,117
//                       360,110
//                       400,102
//                       440,110
//                       480,112
//                     "
//                     className="orders-line"
//                   />

//                 </svg>

//               </div>

//               <div className="legend">

//                 <span>
//                   <i className="legend-revenue" />
//                   Revenue
//                 </span>

//                 <span>
//                   <i className="legend-orders" />
//                   Orders
//                 </span>

//               </div>

//             </div>

//             {/* ===============================================
//                 PRODUCT MIX
//             =============================================== */}

//             <div className="panel panel-pad">

//               <div className="panel-title">
//                 Product mix
//               </div>

//               <div className="panel-sub">
//                 By category
//               </div>

//               <div className="donut-wrap">

//                 <div className="donut" />

//                 <div className="donut-legend">

//                   <div className="donut-row">
//                     <span className="donut-dot donut-accent" />
//                     <span className="donut-label">
//                       Ultrabooks
//                     </span>
//                     <span className="donut-val">
//                       42%
//                     </span>
//                   </div>

//                   <div className="donut-row">
//                     <span className="donut-dot donut-blue" />
//                     <span className="donut-label">
//                       Business
//                     </span>
//                     <span className="donut-val">
//                       26%
//                     </span>
//                   </div>

//                   <div className="donut-row">
//                     <span className="donut-dot donut-violet" />
//                     <span className="donut-label">
//                       2-in-1
//                     </span>
//                     <span className="donut-val">
//                       18%
//                     </span>
//                   </div>

//                   <div className="donut-row">
//                     <span className="donut-dot donut-warning" />
//                     <span className="donut-label">
//                       Gaming
//                     </span>
//                     <span className="donut-val">
//                       14%
//                     </span>
//                   </div>

//                 </div>

//               </div>

//             </div>

//           </div>

//           {/* =================================================
//               CUSTOMER TABLE
//           ================================================= */}

//           <DashboardTable
//             customers={customers}
//           />

//         </div>
//       </main>
//     </div>
//   );
// }



import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiHome,
  FiBell,
  FiCheckCircle,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";

import DashboardCard from "../../components/Admin/DashboardCard/DashboardCard";
import DashboardTable from "../../components/Admin/DashboardTable/DashboardTable";
import { FaRupeeSign } from "react-icons/fa";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationService";

import "./AdminDashboard.css";

const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const getToken = () =>
  localStorage.getItem("token") || localStorage.getItem("accessToken");

const getAuthConfig = () => ({
  headers: getToken()
    ? { Authorization: `Bearer ${getToken()}` }
    : {},
});

const getArray = (response, keys = []) => {
  const data = response?.data;

  const candidates = [
    ...keys.map((key) => data?.[key]),
    ...keys.map((key) => data?.data?.[key]),
    data?.data,
    data,
  ];

  return candidates.find(Array.isArray) || [];
};

const getOrderAmount = (order) => {
  const candidates = [
    order?.totalAmount,
    order?.grandTotal,
    order?.total,
    order?.finalAmount,
    order?.payableAmount,
    order?.pricing?.totalAmount,
  ];

  for (const value of candidates) {
    if (value !== undefined && value !== null && value !== "") {
      const amount = Number(value);
      if (Number.isFinite(amount)) return amount;
    }
  }

  return 0;
};

const getNotificationList = (response) => {
  const candidates = [
    response?.notifications,
    response?.data?.notifications,
    response?.data?.data?.notifications,
    response?.data?.data,
    response?.data,
  ];

  return candidates.find(Array.isArray) || [];
};

const isRead = (notification) =>
  notification?.isRead === true ||
  notification?.read === true ||
  String(notification?.status || "").toUpperCase() === "READ";

const dateLabel = (date) =>
  date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [productCount, setProductCount] = useState(0);

  const [counts, setCounts] = useState({
    orderCount: 0,
    employeeCount: 0,
  });

  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const loadCustomers = useCallback(async () => {
    if (!getToken()) {
      setCustomers([]);
      setCustomerCount(0);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/users`, getAuthConfig());
      const users = getArray(response, ["users"]);

      const list = users.filter(
        (user) =>
          String(user?.role || user?.userRole || "").toUpperCase() ===
          "CUSTOMER"
      );

      setCustomerCount(list.length);

      setCustomers(
        [...list]
          .sort(
            (a, b) =>
              new Date(b?.createdAt || b?.updatedAt || 0).getTime() -
              new Date(a?.createdAt || a?.updatedAt || 0).getTime()
          )
          .slice(0, 10)
          .map((user) => ({
            ...user,
            _id: user?._id || user?.id,
            name:
              user?.name ||
              user?.fullName ||
              [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
              "N/A",
            email: user?.email || "N/A",
            status:
              user?.isActive === false ||
              String(user?.status || "").toUpperCase() === "INACTIVE"
                ? "Inactive"
                : user?.status || "Active",
          }))
      );
    } catch (error) {
      console.error("Customer loading error:", error?.response?.data || error);
      setCustomers([]);
      setCustomerCount(0);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    if (!getToken()) {
      setOrders([]);
      setCounts((previous) => ({ ...previous, orderCount: 0 }));
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/orders`, getAuthConfig());
      const list = getArray(response, ["orders"]);

      setOrders(list);
      setCounts((previous) => ({
        ...previous,
        orderCount: list.length,
      }));
    } catch (error) {
      console.error("Orders loading error:", error?.response?.data || error);
    }
  }, []);

  const loadEmployees = useCallback(async () => {
    if (!getToken()) {
      setCounts((previous) => ({ ...previous, employeeCount: 0 }));
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/users/employees`,
        getAuthConfig()
      );

      const list = getArray(response, ["employees"]);

      setCounts((previous) => ({
        ...previous,
        employeeCount: list.length,
      }));
    } catch (error) {
      console.error("Employees loading error:", error?.response?.data || error);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    if (!getToken()) {
      setProductCount(0);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/products`, getAuthConfig());
      const list = getArray(response, ["products", "items"]);
      setProductCount(list.length);
    } catch (error) {
      console.error("Products loading error:", error?.response?.data || error);
      // Keep unknown distinct from zero if the endpoint is unavailable.
      setProductCount(null);
    }
  }, []);

  const loadNotifications = useCallback(async (silent = false) => {
    if (!getToken()) {
      setNotifications([]);
      setNotificationLoading(false);
      return;
    }

    try {
      if (!silent) setNotificationLoading(true);
      const response = await getMyNotifications();
      setNotifications(getNotificationList(response));
    } catch (error) {
      console.error(
        "Notifications loading error:",
        error?.response?.data || error
      );
      setNotifications([]);
    } finally {
      if (!silent) setNotificationLoading(false);
    }
  }, []);

  const unreadCount = notifications.filter((item) => !isRead(item)).length;

  const revenue = useMemo(
    () => orders.reduce((sum, order) => sum + getOrderAmount(order), 0),
    [orders]
  );

  const revenueTrend = useMemo(() => {
    const today = new Date();
    const days = [];

    for (let offset = 13; offset >= 0; offset -= 1) {
      const date = new Date(today);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - offset);

      days.push({
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        date,
        label: dateLabel(date),
        revenue: 0,
        orders: 0,
      });
    }

    const byKey = new Map(days.map((day) => [day.key, day]));

    orders.forEach((order) => {
      const rawDate = order?.createdAt || order?.orderDate || order?.date;
      if (!rawDate) return;

      const date = new Date(rawDate);
      if (Number.isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const day = byKey.get(key);

      if (day) {
        day.revenue += getOrderAmount(order);
        day.orders += 1;
      }
    });

    return days;
  }, [orders]);

  const chartGeometry = useMemo(() => {
    const width = 500;
    const height = 150;
    const padding = 12;
    const maxRevenue = Math.max(
      1,
      ...revenueTrend.map((day) => day.revenue)
    );
    const maxOrders = Math.max(1, ...revenueTrend.map((day) => day.orders));

    const points = revenueTrend.map((day, index) => {
      const x = padding + (index * (width - padding * 2)) / 13;
      const y = height - padding - (day.revenue / maxRevenue) * (height - padding * 2);
      const orderY =
        height -
        padding -
        (day.orders / maxOrders) * (height - padding * 2);

      return { x, y, orderY };
    });

    return {
      revenuePoints: points.map((point) => `${point.x},${point.y}`).join(" "),
      orderPoints: points.map((point) => `${point.x},${point.orderY}`).join(" "),
      areaPoints: `${padding},${height - padding} ${points
        .map((point) => `${point.x},${point.y}`)
        .join(" ")} ${width - padding},${height - padding}`,
    };
  }, [revenueTrend]);

  useEffect(() => {
    loadCustomers();
    loadOrders();
    loadEmployees();
    loadProducts();
    loadNotifications();
  }, [
    loadCustomers,
    loadOrders,
    loadEmployees,
    loadProducts,
    loadNotifications,
  ]);

  useEffect(() => {
    if (!getToken()) return undefined;

    const interval = setInterval(() => {
      loadNotifications(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [loadNotifications]);

  const handleRefresh = async () => {
    setDashboardLoading(true);

    try {
      await Promise.allSettled([
        loadCustomers(),
        loadOrders(),
        loadEmployees(),
        loadProducts(),
        loadNotifications(),
      ]);
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    const id = notification?._id || notification?.id;

    try {
      if (id && !isRead(notification)) {
        await markNotificationAsRead(id);
        setNotifications((previous) =>
          previous.map((item) =>
            (item?._id || item?.id) === id
              ? { ...item, isRead: true, read: true, status: "READ" }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Mark notification read error:", error);
    }

    const relatedId =
      notification?.relatedId ||
      notification?.orderId ||
      notification?.relatedOrderId;

    const type = String(
      notification?.type || notification?.notificationType || ""
    ).toUpperCase();

    setShowNotificationPanel(false);

    if (type.includes("ORDER") && relatedId) {
      navigate(`/admin/orders/${relatedId}`);
    } else if (
      type.includes("STOCK") ||
      type.includes("INVENTORY")
    ) {
      navigate(
        `/inventory-dashboard?product=${encodeURIComponent(
          notification?.productId || ""
        )}`
      );
    } else {
      navigate("/notifications");
    }
  };

  const handleMarkAllRead = async () => {
    if (!unreadCount) return;

    try {
      await markAllNotificationsAsRead();
      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          isRead: true,
          read: true,
          status: "READ",
        }))
      );
    } catch (error) {
      console.error("Mark all notifications read error:", error);
    }
  };

  const notificationTitle = (item) =>
    item?.title ||
    item?.subject ||
    item?.notificationTitle ||
    item?.type ||
    "Notification";

  const notificationMessage = (item) =>
    item?.message ||
    item?.description ||
    item?.body ||
    "You have a new notification.";

  const formatNotificationDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="app admin-app">
      <main className="admin-main">
        <div className="content">
          <div className="dashboard-header">
            <div className="dashboard-header-left">
              <h1 className="dashboard-title">Dashboard</h1>
              <p className="dashboard-subtitle">
                Welcome back, here's what's happening today
              </p>
            </div>

            <div className="dashboard-header-actions">
              <button
                type="button"
                className="dashboard-header-icon dashboard-home-button"
                onClick={() => navigate("/")}
                title="Go to Home"
                aria-label="Go to Home"
              >
                <FiHome size={21} />
              </button>

              <div className="dashboard-notification-wrapper">
                <button
                  type="button"
                  className={`dashboard-header-icon dashboard-bell-button ${
                    unreadCount ? "dashboard-bell-has-notification" : ""
                  }`}
                  onClick={() =>
                    setShowNotificationPanel((previous) => !previous)
                  }
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <FiBell size={21} />
                  {unreadCount > 0 && (
                    <span className="dashboard-notification-badge">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {showNotificationPanel && (
                  <div className="dashboard-notification-panel">
                    <div className="dashboard-notification-panel-header">
                      <div>
                        <h3>Notifications</h3>
                        <span>
                          {unreadCount
                            ? `${unreadCount} unread`
                            : "All caught up"}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="dashboard-notification-close"
                        onClick={() => setShowNotificationPanel(false)}
                        aria-label="Close notifications"
                      >
                        <FiX size={18} />
                      </button>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        className="dashboard-mark-all-read"
                        onClick={handleMarkAllRead}
                      >
                        <FiCheckCircle size={15} />
                        Mark all as read
                      </button>
                    )}

                    {notificationLoading ? (
                      <div className="dashboard-notification-empty">
                        <FiRefreshCw
                          className="dashboard-notification-loading-icon"
                          size={22}
                        />
                        <span>Loading notifications...</span>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="dashboard-notification-empty">
                        <FiBell size={26} />
                        <strong>No notifications</strong>
                        <span>You're all caught up.</span>
                      </div>
                    ) : (
                      <div className="dashboard-notification-list">
                        {notifications.slice(0, 10).map((item, index) => {
                          const unread = !isRead(item);

                          return (
                            <button
                              type="button"
                              key={item?._id || item?.id || index}
                              className={`dashboard-notification-item ${
                                unread
                                  ? "dashboard-notification-unread"
                                  : ""
                              }`}
                              onClick={() => handleNotificationClick(item)}
                            >
                              <div className="dashboard-notification-dot-wrapper">
                                <span
                                  className={`dashboard-notification-dot ${
                                    unread
                                      ? "dashboard-notification-dot-unread"
                                      : ""
                                  }`}
                                />
                              </div>

                              <div className="dashboard-notification-content">
                                <strong>{notificationTitle(item)}</strong>
                                <p>{notificationMessage(item)}</p>
                                <small>
                                  {formatNotificationDate(
                                    item?.createdAt || item?.updatedAt
                                  )}
                                </small>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {notifications.length > 0 && (
                      <button
                        type="button"
                        className="dashboard-view-all-notifications"
                        onClick={() => {
                          setShowNotificationPanel(false);
                          navigate("/notifications");
                        }}
                      >
                        View all notifications
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="dashboard-header-icon dashboard-refresh-button"
                onClick={handleRefresh}
                disabled={dashboardLoading}
                title="Refresh Dashboard"
                aria-label="Refresh Dashboard"
              >
                <FiRefreshCw
                  size={19}
                  className={dashboardLoading ? "dashboard-refreshing" : ""}
                />
              </button>
            </div>
          </div>

          <div className="stats">
            <DashboardCard
              title="Customers"
              total={customerCount}
              delta="Registered customers"
              up={true}
              accent="accent"
              iconType="customers"
              sparkPoints="0,22 10,18 20,20 30,15 40,17 50,10 60,12"
              onClick={() => navigate("/customers")}
            />

            <DashboardCard
              title="Employees"
              total={counts.employeeCount}
              delta="Total employees"
              up={true}
              accent="accent"
              iconType="employees"
              sparkPoints="0,22 10,18 20,20 30,15 40,17 50,10 60,12"
              onClick={() => navigate("/employees")}
            />

            <DashboardCard
              title="Orders"
              total={counts.orderCount}
              delta="View all orders"
              up={true}
              accent="blue"
              iconType="orders"
              sparkPoints="0,15 10,20 20,12 30,22 40,16 50,24 60,18"
              onClick={() => navigate("/admin/orders")}
            />

            <DashboardCard
              title="Products"
              total={productCount === null ? "—" : productCount}
              delta="View all products"
              up={true}
              accent="violet"
              iconType="products"
              sparkPoints="0,20 15,20 30,19 45,18 60,17"
              onClick={() => navigate("/admin/products")}
            />

            <DashboardCard
              title="Revenue"
              total={money(revenue)}
              delta="Sum of returned order amounts"
              up={true}
              accent="warning"
              iconType="revenue"
              sparkPoints="0,22 10,22 20,20 30,18 40,21 50,15 60,16"
            />
          </div>

          <div className="grid-2">
            <div className="panel panel-pad">
              <div className="panel-head">
                <div>
                  <div className="panel-title">Revenue trend</div>
                  <div className="panel-sub">
                    Last 14 days · based on order dates
                  </div>
                </div>
              </div>

              <div className="chart-wrap">
                <svg
                  viewBox="0 0 500 150"
                  width="100%"
                  height="100%"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label="Revenue and order count trend for the last 14 days"
                >
                  {[30, 75, 120].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="500"
                      y2={y}
                      className="chart-grid-line"
                    />
                  ))}

                  <polygon
                    points={chartGeometry.areaPoints}
                    className="revenue-area"
                  />

                  <polyline
                    points={chartGeometry.revenuePoints}
                    className="revenue-line"
                    fill="none"
                  />

                  <polyline
                    points={chartGeometry.orderPoints}
                    className="orders-line"
                    fill="none"
                  />
                </svg>
              </div>

              <div className="legend">
                <span>
                  <i className="legend-revenue" />
                  Revenue ({money(
                    revenueTrend.reduce((sum, day) => sum + day.revenue, 0)
                  )} in chart period)
                </span>
                <span>
                  <i className="legend-orders" />
                  Orders
                </span>
              </div>

              <div className="dashboard-trend-labels">
                <span>{revenueTrend[0]?.label}</span>
                <span>{revenueTrend[6]?.label}</span>
                <span>{revenueTrend[13]?.label}</span>
              </div>
            </div>

            <div className="panel panel-pad">
              <div className="panel-title">Product mix</div>
              <div className="panel-sub">
                Category breakdown is not connected to a category report API yet.
              </div>

              <div className="dashboard-data-note">
                <p>
                  Product count: <strong>{productCount === null ? "Unavailable" : productCount}</strong>
                </p>
                <button
                  type="button"
                  className="dashboard-link-button"
                  onClick={() => navigate("/admin/products")}
                >
                  Open Product List
                </button>
              </div>
            </div>
          </div>

          <DashboardTable customers={customers} />
        </div>
      </main>
    </div>
  );
}