// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   FaUser,
//   FaHeart,
//   FaShoppingCart,
//   FaMapMarkerAlt,
//   FaLock,
//   FaBoxOpen,
//   FaBell,
//   FaHome,
//   FaSignOutAlt,
//   FaCheck,
//   FaBars,
//   FaTimes,
// } from "react-icons/fa";

// import {
//   useLocation,
//   useNavigate,
// } from "react-router-dom";

// import "./CustomerDashboard.css";

// import Password from "../ChangePassword";
// import MyProfile from "../MyProfile";
// import Wishlist from "../../../Shop/Wishlist/Wishlist";
// import Cart from "../../../Shop/Cart/Cart";
// import MyAddress from "../../../Profile/MyAddress/MyAddress";
// import MyOrders from "../../../Shop/MyOrders/MyOrders";

// import {
//   getMyNotifications,
//   markNotificationAsRead,
//   markAllNotificationsAsRead,
// } from "../../../../services/notificationService";

// // =====================================================
// // API
// // =====================================================

// const API =
//   import.meta.env.VITE_API_URL ||
//   "http://localhost:5000/api";

// // =====================================================
// // SERVER URL
// // =====================================================

// const SERVER_URL = API.replace(/\/api\/?$/, "");

// // =====================================================
// // CUSTOMER DASHBOARD
// // =====================================================

// const CustomerDashboard = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // ===================================================
//   // ACTIVE MENU
//   // ===================================================

//   const [activeMenu, setActiveMenu] = useState(
//     location.state?.activeMenu || "profile"
//   );

//   // ===================================================
//   // MOBILE SIDEBAR
//   // ===================================================

//   const [customerSidebarOpen, setCustomerSidebarOpen] =
//     useState(false);

//   // ===================================================
//   // USER
//   // ===================================================

//   const [user, setUser] = useState({
//     fullName: "Customer",
//     role: "Customer",
//     profileImage: "",
//   });

//   // ===================================================
//   // TOKEN
//   // ===================================================

//   const token =
//     localStorage.getItem("token") ||
//     localStorage.getItem("userToken") ||
//     localStorage.getItem("accessToken") ||
//     "";

//   // ===================================================
//   // NOTIFICATIONS
//   // ===================================================

//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [notificationLoading, setNotificationLoading] =
//     useState(false);

//   // ===================================================
//   // LOAD NOTIFICATIONS
//   // ===================================================

//   const loadNotifications = async () => {
//     if (!token) {
//       setNotifications([]);
//       setUnreadCount(0);
//       return;
//     }

//     try {
//       setNotificationLoading(true);

//       const response = await getMyNotifications();

//       setNotifications(
//         Array.isArray(response?.notifications)
//           ? response.notifications
//           : []
//       );

//       setUnreadCount(
//         Number(response?.unreadCount || 0)
//       );
//     } catch (error) {
//       console.error(
//         "CUSTOMER DASHBOARD NOTIFICATION ERROR:",
//         error
//       );
//     } finally {
//       setNotificationLoading(false);
//     }
//   };

//   // ===================================================
//   // NOTIFICATION CLICK
//   // ===================================================

//   const handleNotificationClick = async (
//     notification
//   ) => {
//     if (
//       notification?.isRead ||
//       !notification?._id
//     ) {
//       return;
//     }

//     try {
//       await markNotificationAsRead(
//         notification._id
//       );

//       setNotifications((previous) =>
//         previous.map((item) =>
//           item._id === notification._id
//             ? {
//                 ...item,
//                 isRead: true,
//               }
//             : item
//         )
//       );

//       setUnreadCount((previous) =>
//         Math.max(previous - 1, 0)
//       );
//     } catch (error) {
//       console.error(
//         "CUSTOMER DASHBOARD MARK NOTIFICATION ERROR:",
//         error
//       );
//     }
//   };

//   // ===================================================
//   // MARK ALL NOTIFICATIONS READ
//   // ===================================================

//   const handleMarkAllRead = async () => {
//     try {
//       await markAllNotificationsAsRead();

//       setNotifications((previous) =>
//         previous.map((item) => ({
//           ...item,
//           isRead: true,
//         }))
//       );

//       setUnreadCount(0);
//     } catch (error) {
//       console.error(
//         "CUSTOMER DASHBOARD MARK ALL READ ERROR:",
//         error
//       );
//     }
//   };

//   // ===================================================
//   // FETCH USER
//   // ===================================================

//   const fetchUserData = async () => {
//     try {
//       if (!token) {
//         return;
//       }

//       const response = await axios.get(
//         `${API}/users/profile`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const userData =
//         response?.data?.data ||
//         response?.data?.user ||
//         response?.data ||
//         {};

//       const fullName =
//         userData.fullName ||
//         `${userData.firstName || ""} ${
//           userData.lastName || ""
//         }`.trim() ||
//         "Customer";

//       setUser({
//         fullName,
//         role: userData.role || "Customer",
//         profileImage:
//           userData.profileImage || "",
//       });
//     } catch (error) {
//       console.error(
//         "CUSTOMER DASHBOARD PROFILE ERROR:",
//         error
//       );
//     }
//   };

//   // ===================================================
//   // INITIAL LOAD
//   // ===================================================

//   useEffect(() => {
//     fetchUserData();
//     loadNotifications();
//   }, []);

//   // ===================================================
//   // AVATAR URL
//   // ===================================================

//   const getAvatarUrl = () => {
//     if (user.profileImage) {
//       return user.profileImage.startsWith("http")
//         ? user.profileImage
//         : `${SERVER_URL}${user.profileImage}`;
//     }

//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(
//       user.fullName
//     )}&background=16a34a&color=fff&bold=true`;
//   };

//   // ===================================================
//   // HOME
//   // ===================================================

//   const handleHome = () => {
//     setCustomerSidebarOpen(false);
//     navigate("/");
//   };

//   // ===================================================
//   // MENU CHANGE
//   // ===================================================

//   const handleMenuChange = (menu) => {
//     setActiveMenu(menu);
//     setCustomerSidebarOpen(false);
//   };

//   // ===================================================
//   // LOGOUT
//   // ===================================================

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userToken");
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("user");

//     setCustomerSidebarOpen(false);

//     navigate("/");
//   };

//   // ===================================================
//   // RENDER PAGE
//   // ===================================================

//   const renderPage = () => {
//     switch (activeMenu) {
//       // -----------------------------------------------
//       // PROFILE
//       // -----------------------------------------------

//       case "profile":
//         return <MyProfile />;

//       // -----------------------------------------------
//       // ORDERS
//       // -----------------------------------------------

//       case "orders":
//         return <MyOrders />;

//       // -----------------------------------------------
//       // WISHLIST
//       // -----------------------------------------------

//       case "wishlist":
//         return <Wishlist />;

//       // -----------------------------------------------
//       // CART
//       // -----------------------------------------------

//       case "cart":
//         return <Cart />;

//       // -----------------------------------------------
//       // ADDRESS
//       // -----------------------------------------------

//       case "address":
//         return <MyAddress />;

//       // -----------------------------------------------
//       // NOTIFICATIONS
//       // -----------------------------------------------

//       case "notifications":
//         return (
//           <div className="customer-notifications-panel">
//             {/* Notification Header */}

//             <div className="customer-notifications-header">
//               <div>
//                 <span className="customer-section-label">
//                   ACCOUNT NOTIFICATIONS
//                 </span>

//                 <h2>Notifications</h2>

//                 <p>
//                   {unreadCount > 0
//                     ? `${unreadCount} unread notification${
//                         unreadCount > 1 ? "s" : ""
//                       }`
//                     : "You're all caught up"}
//                 </p>
//               </div>

//               {unreadCount > 0 && (
//                 <button
//                   type="button"
//                   className="customer-mark-all-btn"
//                   onClick={handleMarkAllRead}
//                 >
//                   <FaCheck />
//                   <span>Mark all read</span>
//                 </button>
//               )}
//             </div>

//             {/* Notification List */}

//             <div className="customer-notifications-list">
//               {notificationLoading ? (
//                 <div className="customer-notification-status">
//                   <div className="customer-loading-spinner" />
//                   <span>
//                     Loading notifications...
//                   </span>
//                 </div>
//               ) : notifications.length === 0 ? (
//                 <div className="customer-notification-empty">
//                   <div className="customer-empty-icon">
//                     <FaBell />
//                   </div>

//                   <h3>No notifications</h3>

//                   <p>
//                     New order updates will appear
//                     here.
//                   </p>
//                 </div>
//               ) : (
//                 notifications.map(
//                   (notification) => (
//                     <button
//                       key={notification._id}
//                       type="button"
//                       onClick={() =>
//                         handleNotificationClick(
//                           notification
//                         )
//                       }
//                       className={`customer-notification-row${
//                         !notification.isRead
//                           ? " customer-notification-unread"
//                           : ""
//                       }`}
//                     >
//                       <div className="customer-notification-icon">
//                         <FaBell />
//                       </div>

//                       <div className="customer-notification-body">
//                         <div className="customer-notification-heading">
//                           <h4>
//                             {notification.title}
//                           </h4>

//                           {!notification.isRead && (
//                             <span className="customer-notification-dot" />
//                           )}
//                         </div>

//                         <p className="customer-notification-message">
//                           {notification.message}
//                         </p>

//                         {notification.createdAt && (
//                           <p className="customer-notification-time">
//                             {new Date(
//                               notification.createdAt
//                             ).toLocaleString(
//                               "en-IN"
//                             )}
//                           </p>
//                         )}
//                       </div>
//                     </button>
//                   )
//                 )
//               )}
//             </div>
//           </div>
//         );

//       // -----------------------------------------------
//       // CHANGE PASSWORD
//       // -----------------------------------------------

//       case "password":
//         return <Password />;

//       // -----------------------------------------------
//       // DEFAULT
//       // -----------------------------------------------

//       default:
//         return <MyProfile />;
//     }
//   };

//   // ===================================================
//   // LOCATION ACTIVE MENU
//   // ===================================================

//   useEffect(() => {
//     if (location.state?.activeMenu) {
//       setActiveMenu(
//         location.state.activeMenu
//       );
//     }
//   }, [location]);

//   // ===================================================
//   // BODY SCROLL LOCK
//   // ===================================================

//   useEffect(() => {
//     if (customerSidebarOpen) {
//       document.body.classList.add(
//         "customer-dashboard-sidebar-open"
//       );
//     } else {
//       document.body.classList.remove(
//         "customer-dashboard-sidebar-open"
//       );
//     }

//     return () => {
//       document.body.classList.remove(
//         "customer-dashboard-sidebar-open"
//       );
//     };
//   }, [customerSidebarOpen]);

//   // ===================================================
//   // JSX
//   // ===================================================

//   return (
//     <div className="customer-dashboard-root">

//       {/* =================================================
//           MOBILE TOP BAR
//       ================================================= */}

//       <div className="customer-dashboard-mobile-topbar">
//         <button
//           type="button"
//           className="customer-dashboard-mobile-menu-btn"
//           onClick={() =>
//             setCustomerSidebarOpen(true)
//           }
//           aria-label="Open customer menu"
//         >
//           <FaBars />
//         </button>

//         <div className="customer-dashboard-mobile-brand">
//           <span className="customer-dashboard-mobile-logo">
//             Z
//           </span>

//           <span>
//             Zaid Infotech
//           </span>
//         </div>

//         <button
//           type="button"
//           className="customer-dashboard-mobile-home-btn"
//           onClick={handleHome}
//           aria-label="Home"
//         >
//           <FaHome />
//         </button>
//       </div>

//       {/* =================================================
//           MOBILE OVERLAY
//       ================================================= */}

//       {customerSidebarOpen && (
//         <div
//           className="customer-dashboard-sidebar-overlay"
//           onClick={() =>
//             setCustomerSidebarOpen(false)
//           }
//         />
//       )}

//       {/* =================================================
//           CUSTOMER SIDEBAR
//       ================================================= */}

//       <aside
//         className={`customer-dashboard-sidebar ${
//           customerSidebarOpen
//             ? "customer-dashboard-sidebar-open"
//             : ""
//         }`}
//       >
//         {/* =================================================
//             SIDEBAR HEADER
//         ================================================= */}

//         <div className="customer-dashboard-sidebar-header">

//           <div className="customer-dashboard-brand">
//             <div className="customer-dashboard-brand-mark">
//               Z
//             </div>

//             <div className="customer-dashboard-brand-content">
//               <h2>Zaid Infotech</h2>
//               <span>Customer Account</span>
//             </div>

//             <button
//               type="button"
//               className="customer-dashboard-sidebar-close"
//               onClick={() =>
//                 setCustomerSidebarOpen(false)
//               }
//               aria-label="Close customer menu"
//             >
//               <FaTimes />
//             </button>
//           </div>

//           {/* =================================================
//               CUSTOMER INFO
//           ================================================= */}

//           <div className="customer-dashboard-user-card">
//             <div className="customer-dashboard-avatar-wrapper">
//               <img
//                 src={getAvatarUrl()}
//                 alt={user.fullName}
//                 className="customer-dashboard-avatar"
//                 onError={(event) => {
//                   event.currentTarget.src =
//                     `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                       user.fullName
//                     )}&background=16a34a&color=fff&bold=true`;
//                 }}
//               />

//               <span className="customer-dashboard-online-dot" />
//             </div>

//             <div className="customer-dashboard-user-info">
//               <h3>{user.fullName}</h3>

//               <span>
//                 {user.role}
//               </span>
//             </div>
//           </div>

//           <div className="customer-dashboard-menu-title">
//             <span>ACCOUNT MENU</span>
//           </div>
//         </div>

//         {/* =================================================
//             SCROLLABLE MENU
//         ================================================= */}

//         <nav className="customer-dashboard-menu">

//           {/* HOME */}

//           <button
//             type="button"
//             className="customer-dashboard-menu-item customer-dashboard-home-item"
//             onClick={handleHome}
//           >
//             <span className="customer-dashboard-menu-icon">
//               <FaHome />
//             </span>

//             <span className="customer-dashboard-menu-text">
//               Home
//             </span>
//           </button>

//           {/* NOTIFICATIONS */}

//           <button
//             type="button"
//             className={`customer-dashboard-menu-item ${
//               activeMenu === "notifications"
//                 ? "customer-dashboard-menu-active"
//                 : ""
//             }`}
//             onClick={() =>
//               handleMenuChange(
//                 "notifications"
//               )
//             }
//           >
//             <span className="customer-dashboard-menu-icon customer-dashboard-notification-icon">
//               <FaBell />

//               {unreadCount > 0 && (
//                 <span className="customer-dashboard-notification-badge">
//                   {unreadCount > 99
//                     ? "99+"
//                     : unreadCount}
//                 </span>
//               )}
//             </span>

//             <span className="customer-dashboard-menu-text">
//               Notifications
//             </span>
//           </button>

//           {/* PROFILE */}

//           <button
//             type="button"
//             className={`customer-dashboard-menu-item ${
//               activeMenu === "profile"
//                 ? "customer-dashboard-menu-active"
//                 : ""
//             }`}
//             onClick={() =>
//               handleMenuChange("profile")
//             }
//           >
//             <span className="customer-dashboard-menu-icon">
//               <FaUser />
//             </span>

//             <span className="customer-dashboard-menu-text">
//               My Profile
//             </span>
//           </button>

//           {/* ORDERS */}

//           <button
//             type="button"
//             className={`customer-dashboard-menu-item ${
//               activeMenu === "orders"
//                 ? "customer-dashboard-menu-active"
//                 : ""
//             }`}
//             onClick={() =>
//               handleMenuChange("orders")
//             }
//           >
//             <span className="customer-dashboard-menu-icon">
//               <FaBoxOpen />
//             </span>

//             <span className="customer-dashboard-menu-text">
//               My Orders
//             </span>
//           </button>

//           {/* WISHLIST */}

//           <button
//             type="button"
//             className={`customer-dashboard-menu-item ${
//               activeMenu === "wishlist"
//                 ? "customer-dashboard-menu-active"
//                 : ""
//             }`}
//             onClick={() =>
//               handleMenuChange(
//                 "wishlist"
//               )
//             }
//           >
//             <span className="customer-dashboard-menu-icon">
//               <FaHeart />
//             </span>

//             <span className="customer-dashboard-menu-text">
//               Wishlist
//             </span>
//           </button>

//           {/* CART */}

//           <button
//             type="button"
//             className={`customer-dashboard-menu-item ${
//               activeMenu === "cart"
//                 ? "customer-dashboard-menu-active"
//                 : ""
//             }`}
//             onClick={() =>
//               handleMenuChange("cart")
//             }
//           >
//             <span className="customer-dashboard-menu-icon">
//               <FaShoppingCart />
//             </span>

//             <span className="customer-dashboard-menu-text">
//               Cart
//             </span>
//           </button>

//           {/* ADDRESS */}

//           <button
//             type="button"
//             className={`customer-dashboard-menu-item ${
//               activeMenu === "address"
//                 ? "customer-dashboard-menu-active"
//                 : ""
//             }`}
//             onClick={() =>
//               handleMenuChange("address")
//             }
//           >
//             <span className="customer-dashboard-menu-icon">
//               <FaMapMarkerAlt />
//             </span>

//             <span className="customer-dashboard-menu-text">
//               My Address
//             </span>
//           </button>

//           {/* PASSWORD */}

//           <button
//             type="button"
//             className={`customer-dashboard-menu-item ${
//               activeMenu === "password"
//                 ? "customer-dashboard-menu-active"
//                 : ""
//             }`}
//             onClick={() =>
//               handleMenuChange(
//                 "password"
//               )
//             }
//           >
//             <span className="customer-dashboard-menu-icon">
//               <FaLock />
//             </span>

//             <span className="customer-dashboard-menu-text">
//               Change Password
//             </span>
//           </button>
//         </nav>

//         {/* =================================================
//             FIXED BOTTOM LOGOUT
//         ================================================= */}

//         <div className="customer-dashboard-sidebar-footer">
//           <button
//             type="button"
//             className="customer-dashboard-logout-btn"
//             onClick={handleLogout}
//           >
//             <span className="customer-dashboard-logout-icon">
//               <FaSignOutAlt />
//             </span>

//             <span>
//               Logout
//             </span>
//           </button>
//         </div>
//       </aside>

//       {/* =================================================
//           RIGHT CONTENT
//           NO GLOBAL HEADER HERE
//       ================================================= */}

//       <main className="customer-dashboard-main">

//         <div className="customer-dashboard-content">

//           {/* =================================================
//               WELCOME CARD
//           ================================================= */}

//           <div className="customer-dashboard-welcome-card">

//             <div className="customer-dashboard-welcome-content">

//               <span className="customer-dashboard-welcome-label">
//                 CUSTOMER DASHBOARD
//               </span>

//               <h1>
//                 Welcome Back,{" "}
//                 {user.fullName.split(" ")[0]} 👋
//               </h1>

//               <p>
//                 Manage your profile, orders,
//                 wishlist and account settings
//                 from one place.
//               </p>
//             </div>

//             <div className="customer-dashboard-welcome-icon">
//               <FaUser />
//             </div>
//           </div>

//           {/* =================================================
//               DYNAMIC CONTENT
//           ================================================= */}

//           <div className="customer-dashboard-content-card">
//             {renderPage()}
//           </div>

//         </div>
//       </main>
//     </div>
//   );
// };

// export default CustomerDashboard;


import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaLock,
  FaBoxOpen,
  FaBell,
  FaHome,
  FaSignOutAlt,
  FaCheck,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./CustomerDashboard.css";

import Password from "../ChangePassword";
import MyProfile from "../MyProfile";
import Wishlist from "../../../Shop/Wishlist/Wishlist";
import Cart from "../../../Shop/Cart/Cart";
import MyAddress from "../../../Profile/MyAddress/MyAddress";
import MyOrders from "../../../Shop/MyOrders/MyOrders";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../../../services/notificationService";

// =====================================================
// API (sirf .env se: VITE_API_URL)
// =====================================================

const API = import.meta.env.VITE_API_URL || "";

// =====================================================
// SERVER URL
// =====================================================

const SERVER_URL = API.replace(/\/api\/?$/, "");

// =====================================================
// CUSTOMER DASHBOARD
// =====================================================

const CustomerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ===================================================
  // ACTIVE MENU
  // ===================================================

  const [activeMenu, setActiveMenu] = useState(
    location.state?.activeMenu || "profile"
  );

  // ===================================================
  // MOBILE SIDEBAR
  // ===================================================

  const [customerSidebarOpen, setCustomerSidebarOpen] =
    useState(false);

  // ===================================================
  // USER
  // ===================================================

  const [user, setUser] = useState({
    fullName: "Customer",
    role: "Customer",
    profileImage: "",
  });

  // ===================================================
  // TOKEN
  // ===================================================

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("accessToken") ||
    "";

  // ===================================================
  // NOTIFICATIONS
  // ===================================================

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationLoading, setNotificationLoading] =
    useState(false);

  // ===================================================
  // LOAD NOTIFICATIONS
  // ===================================================

  const loadNotifications = async () => {
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setNotificationLoading(true);

      const response = await getMyNotifications();

      setNotifications(
        Array.isArray(response?.notifications)
          ? response.notifications
          : []
      );

      setUnreadCount(
        Number(response?.unreadCount || 0)
      );
    } catch (error) {
      console.error(
        "CUSTOMER DASHBOARD NOTIFICATION ERROR:",
        error
      );
    } finally {
      setNotificationLoading(false);
    }
  };

  // ===================================================
  // NOTIFICATION CLICK
  // ===================================================

  const handleNotificationClick = async (
    notification
  ) => {
    if (
      notification?.isRead ||
      !notification?._id
    ) {
      return;
    }

    try {
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
    } catch (error) {
      console.error(
        "CUSTOMER DASHBOARD MARK NOTIFICATION ERROR:",
        error
      );
    }
  };

  // ===================================================
  // MARK ALL NOTIFICATIONS READ
  // ===================================================

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "CUSTOMER DASHBOARD MARK ALL READ ERROR:",
        error
      );
    }
  };

  // ===================================================
  // FETCH USER
  // ===================================================

  const fetchUserData = async () => {
    try {
      if (!token) {
        return;
      }

      const response = await axios.get(
        `${API}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData =
        response?.data?.data ||
        response?.data?.user ||
        response?.data ||
        {};

      const fullName =
        userData.fullName ||
        `${userData.firstName || ""} ${
          userData.lastName || ""
        }`.trim() ||
        "Customer";

      setUser({
        fullName,
        role: userData.role || "Customer",
        profileImage:
          userData.profileImage || "",
      });
    } catch (error) {
      console.error(
        "CUSTOMER DASHBOARD PROFILE ERROR:",
        error
      );
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchUserData();
    loadNotifications();
  }, []);

  // ===================================================
  // AVATAR URL
  // ===================================================

  const getAvatarUrl = () => {
    if (user.profileImage) {
      return user.profileImage.startsWith("http")
        ? user.profileImage
        : `${SERVER_URL}${user.profileImage}`;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.fullName
    )}&background=16a34a&color=fff&bold=true`;
  };

  // ===================================================
  // HOME
  // ===================================================

  const handleHome = () => {
    setCustomerSidebarOpen(false);
    navigate("/");
  };

  // ===================================================
  // MENU CHANGE
  // ===================================================

  const handleMenuChange = (menu) => {
    setActiveMenu(menu);
    setCustomerSidebarOpen(false);
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    setCustomerSidebarOpen(false);

    navigate("/");
  };

  // ===================================================
  // RENDER PAGE
  // ===================================================

  const renderPage = () => {
    switch (activeMenu) {
      // -----------------------------------------------
      // PROFILE
      // -----------------------------------------------

      case "profile":
        return <MyProfile />;

      // -----------------------------------------------
      // ORDERS
      // -----------------------------------------------

      case "orders":
        return <MyOrders />;

      // -----------------------------------------------
      // WISHLIST
      // -----------------------------------------------

      case "wishlist":
        return <Wishlist />;

      // -----------------------------------------------
      // CART
      // -----------------------------------------------

      case "cart":
        return <Cart />;

      // -----------------------------------------------
      // ADDRESS
      // -----------------------------------------------

      case "address":
        return <MyAddress />;

      // -----------------------------------------------
      // NOTIFICATIONS
      // -----------------------------------------------

      case "notifications":
        return (
          <div className="customer-notifications-panel">
            {/* Notification Header */}

            <div className="customer-notifications-header">
              <div>
                <span className="customer-section-label">
                  ACCOUNT NOTIFICATIONS
                </span>

                <h2>Notifications</h2>

                <p>
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${
                        unreadCount > 1 ? "s" : ""
                      }`
                    : "You're all caught up"}
                </p>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  className="customer-mark-all-btn"
                  onClick={handleMarkAllRead}
                >
                  <FaCheck />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Notification List */}

            <div className="customer-notifications-list">
              {notificationLoading ? (
                <div className="customer-notification-status">
                  <div className="customer-loading-spinner" />
                  <span>
                    Loading notifications...
                  </span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="customer-notification-empty">
                  <div className="customer-empty-icon">
                    <FaBell />
                  </div>

                  <h3>No notifications</h3>

                  <p>
                    New order updates will appear
                    here.
                  </p>
                </div>
              ) : (
                notifications.map(
                  (notification) => (
                    <button
                      key={notification._id}
                      type="button"
                      onClick={() =>
                        handleNotificationClick(
                          notification
                        )
                      }
                      className={`customer-notification-row${
                        !notification.isRead
                          ? " customer-notification-unread"
                          : ""
                      }`}
                    >
                      <div className="customer-notification-icon">
                        <FaBell />
                      </div>

                      <div className="customer-notification-body">
                        <div className="customer-notification-heading">
                          <h4>
                            {notification.title}
                          </h4>

                          {!notification.isRead && (
                            <span className="customer-notification-dot" />
                          )}
                        </div>

                        <p className="customer-notification-message">
                          {notification.message}
                        </p>

                        {notification.createdAt && (
                          <p className="customer-notification-time">
                            {new Date(
                              notification.createdAt
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        )}
                      </div>
                    </button>
                  )
                )
              )}
            </div>
          </div>
        );

      // -----------------------------------------------
      // CHANGE PASSWORD
      // -----------------------------------------------

      case "password":
        return <Password />;

      // -----------------------------------------------
      // DEFAULT
      // -----------------------------------------------

      default:
        return <MyProfile />;
    }
  };

  // ===================================================
  // LOCATION ACTIVE MENU
  // ===================================================

  useEffect(() => {
    if (location.state?.activeMenu) {
      setActiveMenu(
        location.state.activeMenu
      );
    }
  }, [location]);

  // ===================================================
  // BODY SCROLL LOCK
  // ===================================================

  useEffect(() => {
    if (customerSidebarOpen) {
      document.body.classList.add(
        "customer-dashboard-sidebar-open"
      );
    } else {
      document.body.classList.remove(
        "customer-dashboard-sidebar-open"
      );
    }

    return () => {
      document.body.classList.remove(
        "customer-dashboard-sidebar-open"
      );
    };
  }, [customerSidebarOpen]);

  // ===================================================
  // JSX
  // ===================================================

  return (
    <div className="customer-dashboard-root">

      {/* =================================================
          MOBILE TOP BAR
      ================================================= */}

      <div className="customer-dashboard-mobile-topbar">
        <button
          type="button"
          className="customer-dashboard-mobile-menu-btn"
          onClick={() =>
            setCustomerSidebarOpen(true)
          }
          aria-label="Open customer menu"
        >
          <FaBars />
        </button>

        <div className="customer-dashboard-mobile-brand">
          <span className="customer-dashboard-mobile-logo">
            Z
          </span>

          <span>
            Zaid Infotech
          </span>
        </div>

        <button
          type="button"
          className="customer-dashboard-mobile-home-btn"
          onClick={handleHome}
          aria-label="Home"
        >
          <FaHome />
        </button>
      </div>

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {customerSidebarOpen && (
        <div
          className="customer-dashboard-sidebar-overlay"
          onClick={() =>
            setCustomerSidebarOpen(false)
          }
        />
      )}

      {/* =================================================
          CUSTOMER SIDEBAR
      ================================================= */}

      <aside
        className={`customer-dashboard-sidebar ${
          customerSidebarOpen
            ? "customer-dashboard-sidebar-open"
            : ""
        }`}
      >
        {/* =================================================
            SIDEBAR HEADER
        ================================================= */}

        <div className="customer-dashboard-sidebar-header">

          <div className="customer-dashboard-brand">
            <div className="customer-dashboard-brand-mark">
              Z
            </div>

            <div className="customer-dashboard-brand-content">
              <h2>Zaid Infotech</h2>
              <span>Customer Account</span>
            </div>

            <button
              type="button"
              className="customer-dashboard-sidebar-close"
              onClick={() =>
                setCustomerSidebarOpen(false)
              }
              aria-label="Close customer menu"
            >
              <FaTimes />
            </button>
          </div>

          {/* =================================================
              CUSTOMER INFO
          ================================================= */}

          <div className="customer-dashboard-user-card">
            <div className="customer-dashboard-avatar-wrapper">
              <img
                src={getAvatarUrl()}
                alt={user.fullName}
                className="customer-dashboard-avatar"
                onError={(event) => {
                  event.currentTarget.src =
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.fullName
                    )}&background=16a34a&color=fff&bold=true`;
                }}
              />

              <span className="customer-dashboard-online-dot" />
            </div>

            <div className="customer-dashboard-user-info">
              <h3>{user.fullName}</h3>

              <span>
                {user.role}
              </span>
            </div>
          </div>

          <div className="customer-dashboard-menu-title">
            <span>ACCOUNT MENU</span>
          </div>
        </div>

        {/* =================================================
            SCROLLABLE MENU
        ================================================= */}

        <nav className="customer-dashboard-menu">

          {/* HOME */}

          <button
            type="button"
            className="customer-dashboard-menu-item customer-dashboard-home-item"
            onClick={handleHome}
          >
            <span className="customer-dashboard-menu-icon">
              <FaHome />
            </span>

            <span className="customer-dashboard-menu-text">
              Home
            </span>
          </button>

          {/* NOTIFICATIONS */}

          <button
            type="button"
            className={`customer-dashboard-menu-item ${
              activeMenu === "notifications"
                ? "customer-dashboard-menu-active"
                : ""
            }`}
            onClick={() =>
              handleMenuChange(
                "notifications"
              )
            }
          >
            <span className="customer-dashboard-menu-icon customer-dashboard-notification-icon">
              <FaBell />

              {unreadCount > 0 && (
                <span className="customer-dashboard-notification-badge">
                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}
                </span>
              )}
            </span>

            <span className="customer-dashboard-menu-text">
              Notifications
            </span>
          </button>

          {/* PROFILE */}

          <button
            type="button"
            className={`customer-dashboard-menu-item ${
              activeMenu === "profile"
                ? "customer-dashboard-menu-active"
                : ""
            }`}
            onClick={() =>
              handleMenuChange("profile")
            }
          >
            <span className="customer-dashboard-menu-icon">
              <FaUser />
            </span>

            <span className="customer-dashboard-menu-text">
              My Profile
            </span>
          </button>

          {/* ORDERS */}

          <button
            type="button"
            className={`customer-dashboard-menu-item ${
              activeMenu === "orders"
                ? "customer-dashboard-menu-active"
                : ""
            }`}
            onClick={() =>
              handleMenuChange("orders")
            }
          >
            <span className="customer-dashboard-menu-icon">
              <FaBoxOpen />
            </span>

            <span className="customer-dashboard-menu-text">
              My Orders
            </span>
          </button>

          {/* WISHLIST */}

          <button
            type="button"
            className={`customer-dashboard-menu-item ${
              activeMenu === "wishlist"
                ? "customer-dashboard-menu-active"
                : ""
            }`}
            onClick={() =>
              handleMenuChange(
                "wishlist"
              )
            }
          >
            <span className="customer-dashboard-menu-icon">
              <FaHeart />
            </span>

            <span className="customer-dashboard-menu-text">
              Wishlist
            </span>
          </button>

          {/* CART */}

          <button
            type="button"
            className={`customer-dashboard-menu-item ${
              activeMenu === "cart"
                ? "customer-dashboard-menu-active"
                : ""
            }`}
            onClick={() =>
              handleMenuChange("cart")
            }
          >
            <span className="customer-dashboard-menu-icon">
              <FaShoppingCart />
            </span>

            <span className="customer-dashboard-menu-text">
              Cart
            </span>
          </button>

          {/* ADDRESS */}

          <button
            type="button"
            className={`customer-dashboard-menu-item ${
              activeMenu === "address"
                ? "customer-dashboard-menu-active"
                : ""
            }`}
            onClick={() =>
              handleMenuChange("address")
            }
          >
            <span className="customer-dashboard-menu-icon">
              <FaMapMarkerAlt />
            </span>

            <span className="customer-dashboard-menu-text">
              My Address
            </span>
          </button>

          {/* PASSWORD */}

          <button
            type="button"
            className={`customer-dashboard-menu-item ${
              activeMenu === "password"
                ? "customer-dashboard-menu-active"
                : ""
            }`}
            onClick={() =>
              handleMenuChange(
                "password"
              )
            }
          >
            <span className="customer-dashboard-menu-icon">
              <FaLock />
            </span>

            <span className="customer-dashboard-menu-text">
              Change Password
            </span>
          </button>
        </nav>

        {/* =================================================
            FIXED BOTTOM LOGOUT
        ================================================= */}

        <div className="customer-dashboard-sidebar-footer">
          <button
            type="button"
            className="customer-dashboard-logout-btn"
            onClick={handleLogout}
          >
            <span className="customer-dashboard-logout-icon">
              <FaSignOutAlt />
            </span>

            <span>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* =================================================
          RIGHT CONTENT
          NO GLOBAL HEADER HERE
      ================================================= */}

      <main className="customer-dashboard-main">

        <div className="customer-dashboard-content">

          {/* =================================================
              WELCOME CARD
          ================================================= */}

          <div className="customer-dashboard-welcome-card">

            <div className="customer-dashboard-welcome-content">

              <span className="customer-dashboard-welcome-label">
                CUSTOMER DASHBOARD
              </span>

              <h1>
                Welcome Back,{" "}
                {user.fullName.split(" ")[0]} 👋
              </h1>

              <p>
                Manage your profile, orders,
                wishlist and account settings
                from one place.
              </p>
            </div>

            <div className="customer-dashboard-welcome-icon">
              <FaUser />
            </div>
          </div>

          {/* =================================================
              DYNAMIC CONTENT
          ================================================= */}

          <div className="customer-dashboard-content-card">
            {renderPage()}
          </div>

        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;