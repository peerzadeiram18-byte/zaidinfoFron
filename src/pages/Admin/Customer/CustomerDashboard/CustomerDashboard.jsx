// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   FaUser,
//   FaHeart,
//   FaShoppingCart,
//   FaMapMarkerAlt,
//   FaLock,
//   FaBoxOpen,
//   FaBell,
//   FaSearch,
//   FaCog,
// } from "react-icons/fa";
// import { useLocation } from "react-router-dom";
// import "./CustomerDashboard.css";

// import MyProfile from "../MyProfile";
// import Wishlist from "../../../Shop/Wishlist/Wishlist";
// import Cart from "../../../Shop/Cart/Cart";
// import MyAddress from "../../../Profile/MyAddress/MyAddress";
// import MyOrders from "../../../Shop/MyOrders/MyOrders";


// const API = import.meta.env.VITE_API_URL;
// const SERVER_URL = API.replace("/api", "");

// const CustomerDashboard = () => {
// const location = useLocation();

// const [activeMenu, setActiveMenu] = useState(
//   location.state?.activeMenu || "profile"
// );

// const [user, setUser] = useState({
//     fullName: "Customer",
//     role: "Customer",
//     profileImage: "",
//   });

//   const token = localStorage.getItem("token");

//   // =================================
//   // FETCH USER DATA FROM DATABASE
//   // =================================
//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       if (!token) return;

//     //   const res = await axios.get(
//     //     "http://localhost:5000/api/users/profile",
//     const res = await axios.get(
//   `${API}/users/profile`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const userData = res.data?.data || res.data?.user || res.data || {};

//       setUser({
//         fullName:
//           userData.fullName ||
//           `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
//           "Customer",
//         role: userData.role || "Customer",
//         profileImage: userData.profileImage || "",
//       });
//     } catch (error) {
//       console.error("Failed to load user profile in dashboard:", error);
//     }
//   };

//   // Helper for Profile Image Source
//   const getAvatarUrl = () => {
//     if (user.profileImage) {
//       return user.profileImage.startsWith("http")
//         ? user.profileImage
//         // : `http://localhost:5000${user.profileImage}`;
//         : `${SERVER_URL}${user.profileImage}`;
//     }
//     // Fallback UI Avatar if no image found in DB
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(
//       user.fullName
//     )}&background=ff6b00&color=fff&bold=true`;
//   };

//   const renderPage = () => {
//     switch (activeMenu) {
//       case "profile":
//         return <MyProfile />;

//       case "orders":
//         return <MyOrders />;

//       case "wishlist":
//         return <Wishlist />;

//       case "cart":
//         return <Cart />;

//       case "address":
//         return <MyAddress />;

//       case "password":
//         return (
//           <div className="coming-soon-card">
//             <h2>Change Password</h2>
//             <p>Coming Soon...</p>
//           </div>
//         );

//       default:
//         return <MyProfile />;
//     }
//   };

//   useEffect(() => {
//   if (location.state?.activeMenu) {
//     setActiveMenu(location.state.activeMenu);
//   }
// }, [location]);

//   return (
//     <div className="customer-dashboard">
//       {/* Sidebar */}
//       <aside className="dashboard-sidebar">
//         <div className="logo">
//           <h2>Zaid Infotech</h2>
//         </div>

//         <div className="customer-box">
//           <img
//             src={getAvatarUrl()}
//             alt={user.fullName}
//             className="customer-image"
//             onError={(e) => {
//               // Fallback on image loading failure
//               e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                 user.fullName
//               )}&background=ff6b00&color=fff&bold=true`;
//             }}
//           />

//           <h3>{user.fullName}</h3>

//           <p>{user.role}</p>
//         </div>

//         <div className="sidebar-title">My Account</div>

//         <button
//           className={activeMenu === "profile" ? "active" : ""}
//           onClick={() => setActiveMenu("profile")}
//         >
//           <FaUser />
//           <span>My Profile</span>
//         </button>

//         <button
//           className={activeMenu === "orders" ? "active" : ""}
//           onClick={() => setActiveMenu("orders")}
//         >
//           <FaBoxOpen />
//           <span>My Orders</span>
//         </button>

//         <button
//           className={activeMenu === "wishlist" ? "active" : ""}
//           onClick={() => setActiveMenu("wishlist")}
//         >
//           <FaHeart />
//           <span>Wishlist</span>
//         </button>

//         <button
//           className={activeMenu === "cart" ? "active" : ""}
//           onClick={() => setActiveMenu("cart")}
//         >
//           <FaShoppingCart />
//           <span>Cart</span>
//         </button>

//         <button
//           className={activeMenu === "address" ? "active" : ""}
//           onClick={() => setActiveMenu("address")}
//         >
//           <FaMapMarkerAlt />
//           <span>My Address</span>
//         </button>

//         <button
//           className={activeMenu === "password" ? "active" : ""}
//           onClick={() => setActiveMenu("password")}
//         >
//           <FaLock />
//           <span>Change Password</span>
//         </button>
//       </aside>

//       {/* Right Section */}
//       <div className="dashboard-wrapper">
//         {/* Top Header */}
//         <header className="dashboard-header">
//           <div className="breadcrumb">
//             Home
//             <span>›</span>
//             Dashboard
//           </div>

//           <div className="header-right">
//             <div className="search-box">
//               <FaSearch />
//               <input type="text" placeholder="Search here..." />
//             </div>

//             <div className="header-icon">
//               <FaBell />
//             </div>

//             <div className="header-icon">
//               <FaCog />
//             </div>

//             <div className="header-user">
//               <img
//                 src={getAvatarUrl()}
//                 alt={user.fullName}
//                 onError={(e) => {
//                   e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                     user.fullName
//                   )}&background=ff6b00&color=fff&bold=true`;
//                 }}
//               />

//               <div>
//                 <h4>{user.fullName}</h4>
//                 <small>{user.role}</small>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Dashboard Body */}
//         <div className="dashboard-body">
//           <div className="welcome-card">
//             <div>
//               <h2>Welcome Back 👋</h2>
//               <p>
//                 Manage your profile, orders, wishlist and account settings
//                 from one place.
//               </p>
//             </div>
//           </div>

//           {/* Dynamic Content */}
//           <div className="dashboard-content-card">{renderPage()}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerDashboard;


import React, { useState, useEffect } from "react";
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
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";

import Password from "../ChangePassword"
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

const API = import.meta.env.VITE_API_URL;
const SERVER_URL = API.replace("/api", "");

const CustomerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState(
    location.state?.activeMenu || "profile"
  );

  const [user, setUser] = useState({
    fullName: "Customer",
    role: "Customer",
    profileImage: "",
  });

  const token = localStorage.getItem("token");

  // =================================
  // NOTIFICATIONS
  // =================================
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationLoading, setNotificationLoading] = useState(false);

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

      setUnreadCount(Number(response?.unreadCount || 0));
    } catch (error) {
      console.error("DASHBOARD NOTIFICATION ERROR:", error);
    } finally {
      setNotificationLoading(false);
    }
  };

  // Clicking a notification just marks it read
  const handleNotificationClick = async (notification) => {
    if (notification.isRead) return;

    try {
      await markNotificationAsRead(notification._id);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id
            ? { ...item, isRead: true }
            : item
        )
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("MARK NOTIFICATION ERROR:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("MARK ALL READ ERROR:", error);
    }
  };

  // =================================
  // FETCH USER DATA FROM DATABASE
  // =================================
  useEffect(() => {
    fetchUserData();
    loadNotifications();
  }, []);

  const fetchUserData = async () => {
    try {
      if (!token) return;

      const res = await axios.get(`${API}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData =
        res.data?.data || res.data?.user || res.data || {};

      setUser({
        fullName:
          userData.fullName ||
          `${userData.firstName || ""} ${
            userData.lastName || ""
          }`.trim() ||
          "Customer",
        role: userData.role || "Customer",
        profileImage: userData.profileImage || "",
      });
    } catch (error) {
      console.error(
        "Failed to load user profile in dashboard:",
        error
      );
    }
  };

  // Helper for Profile Image Source
  const getAvatarUrl = () => {
    if (user.profileImage) {
      return user.profileImage.startsWith("http")
        ? user.profileImage
        : `${SERVER_URL}${user.profileImage}`;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.fullName
    )}&background=ff6b00&color=fff&bold=true`;
  };

  // =================================
  // HOME NAVIGATION
  // =================================
  const handleHome = () => {
    navigate("/");
  };

  // =================================
  // LOGOUT
  // =================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/");
  };

  const renderPage = () => {
    switch (activeMenu) {
      case "profile":
        return <MyProfile />;

      case "orders":
        return <MyOrders />;

      case "wishlist":
        return <Wishlist />;

      case "cart":
        return <Cart />;

      case "address":
        return <MyAddress />;

      case "notifications":
        return (
          <div className="notifications-panel">
            <div className="notifications-panel-header">
              <div>
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
                  className="mark-all-read-btn"
                  onClick={handleMarkAllRead}
                >
                  <FaCheck />
                  Mark all read
                </button>
              )}
            </div>

            <div className="notifications-panel-list">
              {notificationLoading ? (
                <div className="notification-status">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="notification-empty">
                  <FaBell />

                  <p className="notification-empty-title">
                    No notifications
                  </p>

                  <p className="notification-empty-sub">
                    New order updates will appear here.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification._id}
                    type="button"
                    onClick={() =>
                      handleNotificationClick(notification)
                    }
                    className={`notification-row${
                      !notification.isRead
                        ? " notification-row-unread"
                        : ""
                    }`}
                  >
                    <div className="notification-row-icon">
                      <FaBell />
                    </div>

                    <div className="notification-row-body">
                      <div className="notification-row-heading">
                        <h4>{notification.title}</h4>

                        {!notification.isRead && (
                          <span className="notification-dot" />
                        )}
                      </div>

                      <p className="notification-row-message">
                        {notification.message}
                      </p>

                      {notification.createdAt && (
                        <p className="notification-row-time">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        );

      case "password":
        return <Password/>

      default:
        return <MyProfile />;
    }
  };

  useEffect(() => {
    if (location.state?.activeMenu) {
      setActiveMenu(location.state.activeMenu);
    }
  }, [location]);

  return (
    <div className="customer-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="logo">
          <h2>Zaid Infotech</h2>
        </div>

        <div className="customer-box">
          <img
            src={getAvatarUrl()}
            alt={user.fullName}
            className="customer-image"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.fullName
              )}&background=ff6b00&color=fff&bold=true`;
            }}
          />

          <h3>{user.fullName}</h3>

          <p>{user.role}</p>
        </div>

        <div className="sidebar-title">My Account</div>

        <button
          className="home-btn"
          onClick={handleHome}
        >
          <FaHome />
          <span>Home</span>
        </button>

        <button
          className={
            activeMenu === "notifications" ? "active" : ""
          }
          onClick={() => setActiveMenu("notifications")}
        >
          <span className="sidebar-icon-wrap">
            <FaBell />

            {unreadCount > 0 && (
              <span className="sidebar-notification-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </span>

          <span>Notifications</span>
        </button>

        <button
          className={activeMenu === "profile" ? "active" : ""}
          onClick={() => setActiveMenu("profile")}
        >
          <FaUser />
          <span>My Profile</span>
        </button>

        <button
          className={activeMenu === "orders" ? "active" : ""}
          onClick={() => setActiveMenu("orders")}
        >
          <FaBoxOpen />
          <span>My Orders</span>
        </button>

        <button
          className={activeMenu === "wishlist" ? "active" : ""}
          onClick={() => setActiveMenu("wishlist")}
        >
          <FaHeart />
          <span>Wishlist</span>
        </button>

        <button
          className={activeMenu === "cart" ? "active" : ""}
          onClick={() => setActiveMenu("cart")}
        >
          <FaShoppingCart />
          <span>Cart</span>
        </button>

        <button
          className={activeMenu === "address" ? "active" : ""}
          onClick={() => setActiveMenu("address")}
        >
          <FaMapMarkerAlt />
          <span>My Address</span>
        </button>

        <button
          className={activeMenu === "password" ? "active" : ""}
          onClick={() => setActiveMenu("password")}
        >
          <FaLock />
          <span>Change Password</span>
        </button>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </aside>

      {/* Right Section */}
      <div className="dashboard-wrapper">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="breadcrumb">
            Home
            <span>›</span>
            Dashboard
          </div>

          <div className="header-user">
            <img
              src={getAvatarUrl()}
              alt={user.fullName}
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.fullName
                )}&background=ff6b00&color=fff&bold=true`;
              }}
            />

            <div>
              <h4>{user.fullName}</h4>
              <small>{user.role}</small>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="dashboard-body">
          <div className="welcome-card">
            <div>
              <h2>Welcome Back 👋</h2>

              <p>
                Manage your profile, orders, wishlist and account
                settings from one place.
              </p>
            </div>
          </div>

          {/* Dynamic Content */}
          <div className="dashboard-content-card">
            {renderPage()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;