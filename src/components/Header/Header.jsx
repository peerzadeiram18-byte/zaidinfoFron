// import React, { useState, useEffect } from "react";
// import { useNavigate, Link, NavLink, useLocation } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// import zaidInfotechLogoDark from "../../assets/images/zaidinfotechlogo-white.png";

// // Context & API Services
// import { useTheme } from "../../context/ThemeContext";
// import { getWishlist } from "../../services/wishlistService";
// import { getCart } from "../../services/cartService";
// import {
//   getMyNotifications,
//   markNotificationAsRead,
//   markAllNotificationsAsRead,
// } from "../../services/notificationService";

// // Lucide Icons
// import {
//   BriefcaseBusiness,
//   ChevronDown,
//   GraduationCap,
//   Heart,
//   Home,
//   Info,
//   Laptop,
//   Moon,
//   Search,
//   ShoppingCart,
//   SlidersHorizontal,
//   Sun,
//   Wrench,
//   LogOut,
//   UserRound,
//   Menu,
//   X,
//   Bell,
//   LayoutDashboard,
//   CircleUserRound,
// } from "lucide-react";

// import zaidInfotechLogo from "../../assets/images/zaidinfotechlogo.png";
// import "./Header.css";

// const categories = ["All Categories", "Laptops", "Accessories", "Services"];

// const navigationItems = [
//   { label: "HOME", subtitle: "Back to Homepage", icon: Home, path: "/" },
//   { label: "BUY", subtitle: "Laptops & Accessories", icon: Laptop, path: "/shop" },
//   { label: "RENT", subtitle: "Laptops on Rent", icon: GraduationCap, path: "/rental" },
//   { label: "REPAIRS", subtitle: "Service & Support", icon: Wrench, path: "/repair" },
//   { label: "REFURBISHED", subtitle: "Certified Laptops", icon: ShoppingCart, path: "/shop" },
//   { label: "ABOUT US", subtitle: "Why Choose Us?", icon: Info, path: "/about-us" },
//   { label: "CONTACT", subtitle: "Solutions for Business", icon: BriefcaseBusiness, path: "/contact" },
// ];

// const iconVariants = {
//   hover: { scale: 1.12 },
//   tap: { scale: 0.94 },
// };

// const desktopAuthVariants = {
//   hover: { scale: 1.05 },
//   tap: { scale: 0.95 },
// };

// const mobileAuthVariants = {
//   hover: { scale: 1.02 },
//   tap: { scale: 0.97 },
// };

// function HeaderAction({ icon: Icon, label, badge, onClick }) {
//   return (
//     <button className="header-action" type="button" onClick={onClick}>
//       <span className="action-icon-wrap">
//         <Icon aria-hidden="true" />
//         {badge !== undefined && <span className="cart-badge">{badge}</span>}
//       </span>
//       <span>{label}</span>
//     </button>
//   );
// }

// export default function Header() {
//   const [category, setCategory] = useState(categories[0]);
//   const [query, setQuery] = useState("");
//   const [wishlistCount, setWishlistCount] = useState(0);
//   const [cartCount, setCartCount] = useState(0);

//   const [isLoggedIn, setIsLoggedIn] = useState(() => {
//     const token = localStorage.getItem("token");
//     const loggedInStatus = localStorage.getItem("isLoggedIn");
//     return Boolean(token) || loggedInStatus === "true";
//   });

//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // --- NOTIFICATION STATE ---
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [notificationOpen, setNotificationOpen] = useState(false);
//   const [notificationLoading, setNotificationLoading] = useState(false);

//   const { theme, toggleTheme } = useTheme();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // ---------------------------------------------------------------------------
//   // AUTH LOGIC
//   // ---------------------------------------------------------------------------

//   const checkAuthStatus = () => {
//     const token = localStorage.getItem("token");
//     const loggedInStatus = localStorage.getItem("isLoggedIn");
//     setIsLoggedIn(Boolean(token) || loggedInStatus === "true");
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("user");
//     setIsLoggedIn(false);
//     setWishlistCount(0);
//     setCartCount(0);
//     setNotifications([]);
//     setUnreadCount(0);
//     setNotificationOpen(false);
//     setMobileMenuOpen(false);
//     navigate("/");
//   };

//   // ---------------------------------------------------------------------------
//   // ROLE BASED DASHBOARD LOGIC
//   // ---------------------------------------------------------------------------
//   const getDashboardPath = () => {
//     try {
//       const userData = localStorage.getItem("user");

//       if (!userData) {
//         return "/customer-dashboard";
//       }

//       const user = JSON.parse(userData);

//       const role = String(
//         user?.role || user?.userRole || user?.type || ""
//       ).toUpperCase();

//       switch (role) {
//         case "ADMIN":
//           return "/admin-dashboard";
//         case "INVENTORY":
//         case "INVENTORY_MANAGER":
//           return "/inventory-dashboard";
//         case "RECEPTIONIST":
//           return "/receptionist-dashboard";
//         case "TECHNICIAN":
//           return "/technician-dashboard";
//         case "ACCOUNTANT":
//           return "/accountant-dashboard";
//         case "CUSTOMER":
//         default:
//           return "/customer-dashboard";
//       }
//     } catch (error) {
//       console.error("DASHBOARD ROLE ERROR:", error);
//       return "/customer-dashboard";
//     }
//   };

// //ROLE CHECK: HIDE CART/WISHLIST FOR INVENTORY ROLE
// // Cart and Wishlist are customer-only shopping features.
// // Inventory staff should not see these icons in the header.
//   const isInventoryRole = () => {
//   try {
//     const userData = localStorage.getItem("user");
//     if (!userData) return false; // guests → show cart/wishlist

//     const user = JSON.parse(userData);
//     const role = String(user?.role || user?.userRole || user?.type || "").toUpperCase();

//     return role === "INVENTORY" || role === "INVENTORY_MANAGER";
//   } catch (error) {
//     console.error("ROLE CHECK ERROR:", error);
//     return false;
//   }
// };

//   const loadHeaderCounts = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setWishlistCount(0);
//       setCartCount(0);
//       return;
//     }

//     try {
//       const [wishlistResponse, cartResponse] = await Promise.all([
//         getWishlist(),
//         getCart(),
//       ]);

//       const wishlistData =
//         wishlistResponse?.data || wishlistResponse?.wishlist || wishlistResponse;

//         console.log("wishlistData is printed below")
//         console.log(wishlistData)

//       const wishlistItems = Array.isArray(wishlistData?.wishlist?.products)
//         ? wishlistData.wishlist.products
//         : Array.isArray(wishlistData?.products)
//         ? wishlistData.products
//         : Array.isArray(wishlistData?.items)
//         ? wishlistData.items
//         : Array.isArray(wishlistData)
//         ? wishlistData
//         : [];

//       setWishlistCount(wishlistItems.length);

//       const cartData = cartResponse?.data || cartResponse?.cart || cartResponse;

//       const cartItems = Array.isArray(cartData?.data?.items)
//         ? cartData.data.items
//         : Array.isArray(cartData?.items)
//         ? cartData.items
//         : Array.isArray(cartData?.cartItems)
//         ? cartData.cartItems
//         : Array.isArray(cartData)
//         ? cartData
//         : [];

//       setCartCount(cartItems.length);
//     } catch (error) {
//       console.error("HEADER CART/WISHLIST COUNT ERROR:", error);
//     }
//   };

//   // ---------------------------------------------------------------------------
//   // NOTIFICATION LOGIC
//   // ---------------------------------------------------------------------------

//   const loadNotifications = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setNotifications([]);
//       setUnreadCount(0);
//       return;
//     }

//     try {
//       setNotificationLoading(true);

//       const response = await getMyNotifications();

//       setNotifications(
//         Array.isArray(response?.notifications) ? response.notifications : []
//       );

//       setUnreadCount(Number(response?.unreadCount || 0));
//     } catch (error) {
//       console.error("HEADER NOTIFICATION ERROR:", error);

//       if (
//         error?.message?.toLowerCase()?.includes("token") ||
//         error?.message?.toLowerCase()?.includes("unauthorized")
//       ) {
//         setNotifications([]);
//         setUnreadCount(0);
//       }
//     } finally {
//       setNotificationLoading(false);
//     }
//   };

//   const handleNotificationClick = async (notification) => {
//     try {
//       if (!notification.isRead) {
//         await markNotificationAsRead(notification._id);

//         setNotifications((prev) =>
//           prev.map((item) =>
//             item._id === notification._id ? { ...item, isRead: true } : item
//           )
//         );

//         setUnreadCount((prev) => Math.max(prev - 1, 0));
//       }
//     } catch (error) {
//       console.error("MARK NOTIFICATION ERROR:", error);
//     }

//     setNotificationOpen(false);

//     if (notification.relatedModel === "Order" && notification.relatedId) {
//       navigate(`/order/${notification.relatedId}`);
//       return;
//     }

//     navigate("/notifications");
//   };

//   const handleMarkAllRead = async () => {
//     try {
//       await markAllNotificationsAsRead();

//       setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));

//       setUnreadCount(0);
//     } catch (error) {
//       console.error("MARK ALL READ ERROR:", error);
//     }
//   };

//   // ---------------------------------------------------------------------------
//   // MAIN AUTH + NOTIFICATION EFFECT (reruns on route change / authChanged)
//   // ---------------------------------------------------------------------------
//   useEffect(() => {
//     checkAuthStatus();
//     loadHeaderCounts();

//     const handleCartWishlistUpdate = () => {
//       checkAuthStatus();
//       loadHeaderCounts();
//     };

//     window.addEventListener("cart-updated", handleCartWishlistUpdate);
//     window.addEventListener("wishlist-updated", handleCartWishlistUpdate);
//     window.addEventListener("authChanged", handleCartWishlistUpdate);

//     return () => {
//       window.removeEventListener("cart-updated", handleCartWishlistUpdate);
//       window.removeEventListener("wishlist-updated", handleCartWishlistUpdate);
//       window.removeEventListener("authChanged", handleCartWishlistUpdate);
//     };
//   }, [location.pathname]);

//   // Load notifications whenever auth state flips to logged-in
//   useEffect(() => {
//     if (isLoggedIn) {
//       loadNotifications();
//     } else {
//       setNotifications([]);
//       setUnreadCount(0);
//     }
//   }, [isLoggedIn]);

//   // Poll for new notifications every 15s while logged in
//   useEffect(() => {
//     if (!isLoggedIn) {
//       return;
//     }
//     const interval = setInterval(() => {
//       loadNotifications();
//     }, 15000);
//     return () => {
//       clearInterval(interval);
//     };
//   }, [isLoggedIn]);

//   const announce = (label) => {
//     if (typeof window !== "undefined") {
//       window.dispatchEvent(new CustomEvent("zaid-header-action", { detail: label }));
//     }
//   };

//   const submitSearch = (event) => {
//     event.preventDefault();
//     if (query.trim()) {
//       navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
//     } else {
//       navigate("/shop");
//     }
//   };

//   // ---------------------------------------------------------------------------
//   // RENDER
//   // ---------------------------------------------------------------------------
//   return (
//     <header className="site-header">
//       <div className="header-main">
//         <Link to="/" aria-label="Zaid Infotech home">
//          <img
//     src={theme === "dark" ? zaidInfotechLogoDark : zaidInfotechLogo}
//     alt="Zaid Infotech"
//     className="header-logo"
//   />
//         </Link>

//         <form className="header-search" onSubmit={submitSearch} role="search">
//           <label className="sr-only" htmlFor="header-category">Search category</label>
//           <div className="category-select">
//             <select
//               id="header-category"
//               value={category}
//               onChange={(event) => setCategory(event.target.value)}
//               aria-label="Search category"
//             >
//               {categories.map((item) => (
//                 <option key={item}>{item}</option>
//               ))}
//             </select>
//             <ChevronDown aria-hidden="true" />
//           </div>
//           <label className="sr-only" htmlFor="header-query">Search laptops, brands, services</label>
//           <input
//             id="header-query"
//             type="search"
//             value={query}
//             onChange={(event) => setQuery(event.target.value)}
//             placeholder="Search laptops, brands, services..."
//           />
//           <button className="search-button" type="submit" aria-label="Search">
//             <Search aria-hidden="true" />
//           </button>
//         </form>

//         <div className="header-actions">
//           <motion.button
//             variants={iconVariants}
//             whileHover="hover"
//             whileTap="tap"
//             onClick={toggleTheme}
//             className="theme-toggle-btn"
//             aria-label="Toggle theme"
//           >
//             {theme === "dark" ? (
//               <Sun size={22} className="sun-icon" strokeWidth={2} />
//             ) : (
//               <Moon size={22} strokeWidth={2} />
//             )}
//           </motion.button>

//           {/* --- NOTIFICATION BELL (Desktop) --- */}
//           {isLoggedIn && (
//             <div className="notification-wrap">
//               <motion.button
//                 variants={iconVariants}
//                 whileHover="hover"
//                 whileTap="tap"
//                 onClick={() => setNotificationOpen(!notificationOpen)}
//                 className="header-icon-btn notification-bell-btn"
//                 aria-label="Notifications"
//               >
//                 <Bell size={22} strokeWidth={2} />
//                 {unreadCount > 0 && (
//                   <span className="notification-badge">
//                     {unreadCount > 99 ? "99+" : unreadCount}
//                   </span>
//                 )}
//               </motion.button>

//               <AnimatePresence>
//                 {notificationOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10, scale: 0.98 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, y: -10, scale: 0.98 }}
//                     className="notification-dropdown"
//                   >
//                     <div className="notification-dropdown-header">
//                       <div>
//                         <h3>Notifications</h3>
//                         <p>
//                           {unreadCount > 0
//                             ? `${unreadCount} unread`
//                             : "You're all caught up"}
//                         </p>
//                       </div>
//                       {unreadCount > 0 && (
//                         <button
//                           className="mark-all-read-btn"
//                           onClick={handleMarkAllRead}
//                           type="button"
//                         >
//                           Mark all read
//                         </button>
//                       )}
//                     </div>

//                     <div className="notification-list">
//                       {notificationLoading ? (
//                         <div className="notification-status">
//                           Loading notifications...
//                         </div>
//                       ) : notifications.length === 0 ? (
//                         <div className="notification-empty">
//                           <Bell size={35} />
//                           <p className="notification-empty-title">No notifications</p>
//                           <p className="notification-empty-sub">
//                             New order updates will appear here.
//                           </p>
//                         </div>
//                       ) : (
//                         notifications.map((notification) => (
//                           <button
//                             key={notification._id}
//                             type="button"
//                             onClick={() => handleNotificationClick(notification)}
//                             className={`notification-item${
//                               !notification.isRead ? " notification-item-unread" : ""
//                             }`}
//                           >
//                             <div className="notification-item-row">
//                               <div className="notification-item-icon">
//                                 <Bell size={17} />
//                               </div>
//                               <div className="notification-item-body">
//                                 <div className="notification-item-heading">
//                                   <h4>{notification.title}</h4>
//                                   {!notification.isRead && (
//                                     <span className="notification-dot" />
//                                   )}
//                                 </div>
//                                 <p className="notification-item-message">
//                                   {notification.message}
//                                 </p>
//                                 {notification.createdAt && (
//                                   <p className="notification-item-time">
//                                     {new Date(notification.createdAt).toLocaleString(
//                                       "en-IN"
//                                     )}
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                           </button>
//                         ))
//                       )}
//                     </div>

//                     {notifications.length > 0 && (
//                       <div className="notification-dropdown-footer">
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setNotificationOpen(false);
//                             navigate("/notifications");
//                           }}
//                         >
//                           View All Notifications
//                         </button>
//                       </div>
//                     )}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           )}

//           <HeaderAction icon={SlidersHorizontal} label="Compare" onClick={() => announce("Compare")} />

//           {!isInventoryRole() && (
//             <>
//           <motion.button
//             variants={iconVariants}
//             whileHover="hover"
//             whileTap="tap"
//             onClick={() => navigate("/wishlist")}
//             className="header-icon-btn"
//             aria-label="Wishlist"
//           >
//             <Heart size={22} strokeWidth={2} />
//             {wishlistCount > 0 && (
//               <span className="header-badge">{wishlistCount > 99 ? "99+" : wishlistCount}</span>
//             )}
//           </motion.button>

//           <motion.button
//             variants={iconVariants}
//             whileHover="hover"
//             whileTap="tap"
//             onClick={() => navigate("/cart")}
//             className="header-icon-btn"
//             aria-label="Cart"
//           >
//             <ShoppingCart size={22} strokeWidth={2} />
//             {cartCount > 0 && (
//               <span className="header-badge">{cartCount > 99 ? "99+" : cartCount}</span>
//             )}
//           </motion.button>

//           <button className="quote-button" type="button" onClick={() => announce("Request a Quote")}>
//             <span>Request a Quote</span>
//             <small>For Business</small>
//           </button>
//           </>
//           )}

//           {/* --- ROLE BASED DASHBOARD (Desktop) --- */}
//           {isLoggedIn && (
//             <motion.button
//               variants={iconVariants}
//               whileHover="hover"
//               whileTap="tap"
//               onClick={() => navigate(getDashboardPath())}
//               className="header-icon-btn"
//               aria-label="Dashboard"
//               title="Dashboard"
//             >
//               <CircleUserRound size={22} strokeWidth={2} />
//             </motion.button>
//           )}

//           {/* DESKTOP LOGIN / LOGOUT */}
//           {isLoggedIn ? (
//             <motion.button
//               variants={desktopAuthVariants}
//               whileHover="hover"
//               whileTap="tap"
//               onClick={handleLogout}
//               className="desktop-logout-btn"
//               aria-label="Logout"
//               title="Logout"
//             >
//               <LogOut size={22} strokeWidth={2} />
//             </motion.button>
//           ) : (
//             <motion.button
//               variants={desktopAuthVariants}
//               whileHover="hover"
//               whileTap="tap"
//               onClick={() => navigate("/login")}
//               className="desktop-login-btn"
//             >
//               <UserRound size={19} strokeWidth={2} />
//               Login
//             </motion.button>
//           )}

//           <button
//             className="mobile-menu-toggle"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             aria-label="Toggle mobile menu"
//           >
//             {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
//           </button>
//         </div>
//       </div>

//       {/* --- MAIN NAV WITH ACTIVE LINK STYLING --- */}
//       <nav className="category-nav" aria-label="Main navigation">
//         {navigationItems.map(({ label, subtitle, icon: Icon, path }) => (
//           <NavLink
//             className={({ isActive }) =>
//               `nav-item${isActive ? " nav-item-active" : ""}`
//             }
//             to={path}
//             key={label}
//             onClick={() => announce(label)}
//             end={path === "/"}
//           >
//             <Icon aria-hidden="true" />
//             <span className="nav-copy">
//               <strong>{label}</strong>
//               <small>{subtitle}</small>
//             </span>
//           </NavLink>
//         ))}
//       </nav>

//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <motion.div
//             className="mobile-drawer"
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//           >
//             <nav className="mobile-nav">
//               {navigationItems.map(({ label, subtitle, icon: Icon, path }) => (
//                 <NavLink
//                   className={({ isActive }) =>
//                     `mobile-nav-item${isActive ? " mobile-nav-item-active" : ""}`
//                   }
//                   to={path}
//                   key={label}
//                   onClick={() => setMobileMenuOpen(false)}
//                   end={path === "/"}
//                 >
//                   <Icon size={20} />
//                   <div>
//                     <strong>{label}</strong>
//                     <small>{subtitle}</small>
//                   </div>
//                 </NavLink>
//               ))}

//               {/* --- NOTIFICATION (Mobile) --- */}
//               {isLoggedIn && (
//                 <button
//                   type="button"
//                   className="mobile-notification-item"
//                   onClick={() => {
//                     setMobileMenuOpen(false);
//                     setNotificationOpen(false);
//                     navigate("/notifications");
//                   }}
//                 >
//                   <div className="mobile-notification-left">
//                     <Bell size={20} strokeWidth={2} />
//                     <span>Notifications</span>
//                   </div>
//                   {unreadCount > 0 && (
//                     <span className="mobile-notification-badge">
//                       {unreadCount > 99 ? "99+" : unreadCount}
//                     </span>
//                   )}
//                 </button>
//               )}

//               {/* --- ROLE BASED DASHBOARD (Mobile) --- */}
//               {isLoggedIn && (
//                 <button
//                   type="button"
//                   className="mobile-dashboard-item"
//                   onClick={() => {
//                     setMobileMenuOpen(false);
//                     navigate(getDashboardPath());
//                   }}
//                 >
//                   <LayoutDashboard size={20} strokeWidth={2} />
//                   <span>Dashboard</span>
//                 </button>
//               )}

//               {isLoggedIn ? (
//                 <motion.button
//                   variants={mobileAuthVariants}
//                   whileHover="hover"
//                   whileTap="tap"
//                   onClick={handleLogout}
//                   className="mobile-logout-btn"
//                 >
//                   <LogOut size={20} strokeWidth={2} />
//                   Logout
//                 </motion.button>
//               ) : (
//                 <motion.button
//                   variants={mobileAuthVariants}
//                   whileHover="hover"
//                   whileTap="tap"
//                   onClick={() => {
//                     setMobileMenuOpen(false);
//                     navigate("/login");
//                   }}
//                   className="mobile-login-btn"
//                 >
//                   <UserRound size={22} strokeWidth={2} />
//                   Login
//                 </motion.button>
//               )}
//             </nav>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }




import React, { useState, useEffect } from "react";
import { useNavigate, Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import zaidInfotechLogoDark from "../../assets/images/zaidinfotechlogo-white.png";

// Context & API Services
import { useTheme } from "../../context/ThemeContext";
import { useCompare } from "../../context/CompareContext";
import { getWishlist } from "../../services/wishlistService";
import { getCart } from "../../services/cartService";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationService";

// Lucide Icons
import {
  BriefcaseBusiness,
  ChevronDown,
  GraduationCap,
  Heart,
  Home,
  Info,
  Laptop,
  Moon,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sun,
  Wrench,
  LogOut,
  UserRound,
  Menu,
  X,
  Bell,
  LayoutDashboard,
  CircleUserRound,
} from "lucide-react";

import zaidInfotechLogo from "../../assets/images/zaidinfotechlogo.png";
import "./Header.css";

const categories = ["All Categories", "Laptops", "Accessories", "Services"];

const navigationItems = [
  { label: "HOME", subtitle: "Back to Homepage", icon: Home, path: "/" },
  { label: "BUY", subtitle: "Laptops & Accessories", icon: Laptop, path: "/shop" },
  { label: "RENT", subtitle: "Laptops on Rent", icon: GraduationCap, path: "/rental" },
  { label: "REPAIRS", subtitle: "Service & Support", icon: Wrench, path: "/repair" },
 { label: "REFURBISHED", subtitle: "Certified Laptops", icon: ShoppingCart, path: "/shop?condition=refurbished" },
  { label: "ABOUT US", subtitle: "Why Choose Us?", icon: Info, path: "/about-us" },
  { label: "CONTACT", subtitle: "Solutions for Business", icon: BriefcaseBusiness, path: "/contact" },
];

const iconVariants = {
  hover: { scale: 1.12 },
  tap: { scale: 0.94 },
};

const desktopAuthVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const mobileAuthVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.97 },
};

function HeaderAction({ icon: Icon, label, badge, onClick }) {
  return (
    <button className="header-action" type="button" onClick={onClick}>
      <span className="action-icon-wrap">
        <Icon aria-hidden="true" />
        {badge !== undefined && <span className="cart-badge">{badge}</span>}
      </span>
      <span>{label}</span>
    </button>
  );
}

export default function Header() {
  const [category, setCategory] = useState(categories[0]);
  const [query, setQuery] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("token");
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    return Boolean(token) || loggedInStatus === "true";
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- NOTIFICATION STATE ---
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  // --- COMPARE STATE ---
  const { compareList } = useCompare();
  const [comparePopup, setComparePopup] = useState(null);
  // null = hidden, "empty" = 0 products selected, "single" = 1 product selected

  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // ---------------------------------------------------------------------------
  // AUTH LOGIC
  // ---------------------------------------------------------------------------

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(Boolean(token) || loggedInStatus === "true");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setWishlistCount(0);
    setCartCount(0);
    setNotifications([]);
    setUnreadCount(0);
    setNotificationOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  // ---------------------------------------------------------------------------
  // ROLE BASED DASHBOARD LOGIC
  // ---------------------------------------------------------------------------
  const getDashboardPath = () => {
    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        return "/customer-dashboard";
      }

      const user = JSON.parse(userData);

      const role = String(
        user?.role || user?.userRole || user?.type || ""
      ).toUpperCase();

      switch (role) {
        case "ADMIN":
          return "/admin-dashboard";
        case "INVENTORY":
        case "INVENTORY_MANAGER":
          return "/inventory-dashboard";
        case "RECEPTIONIST":
          return "/receptionist-dashboard";
        case "TECHNICIAN":
          return "/technician-dashboard";
        case "ACCOUNTANT":
          return "/accountant-dashboard";
        case "CUSTOMER":
        default:
          return "/customer-dashboard";
      }
    } catch (error) {
      console.error("DASHBOARD ROLE ERROR:", error);
      return "/customer-dashboard";
    }
  };

//ROLE CHECK: HIDE CART/WISHLIST FOR INVENTORY ROLE
// Cart and Wishlist are customer-only shopping features.
// Inventory staff should not see these icons in the header.
  const isInventoryRole = () => {
  try {
    const userData = localStorage.getItem("user");
    if (!userData) return false; // guests → show cart/wishlist

    const user = JSON.parse(userData);
    const role = String(user?.role || user?.userRole || user?.type || "").toUpperCase();

    return role === "INVENTORY" || role === "INVENTORY_MANAGER";
  } catch (error) {
    console.error("ROLE CHECK ERROR:", error);
    return false;
  }
};

  const loadHeaderCounts = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setWishlistCount(0);
      setCartCount(0);
      return;
    }

    try {
      const [wishlistResponse, cartResponse] = await Promise.all([
        getWishlist(),
        getCart(),
      ]);

      const wishlistData =
        wishlistResponse?.data || wishlistResponse?.wishlist || wishlistResponse;

        console.log("wishlistData is printed below")
        console.log(wishlistData)

      const wishlistItems = Array.isArray(wishlistData?.wishlist?.products)
        ? wishlistData.wishlist.products
        : Array.isArray(wishlistData?.products)
        ? wishlistData.products
        : Array.isArray(wishlistData?.items)
        ? wishlistData.items
        : Array.isArray(wishlistData)
        ? wishlistData
        : [];

      setWishlistCount(wishlistItems.length);

      const cartData = cartResponse?.data || cartResponse?.cart || cartResponse;

      const cartItems = Array.isArray(cartData?.data?.items)
        ? cartData.data.items
        : Array.isArray(cartData?.items)
        ? cartData.items
        : Array.isArray(cartData?.cartItems)
        ? cartData.cartItems
        : Array.isArray(cartData)
        ? cartData
        : [];

      setCartCount(cartItems.length);
    } catch (error) {
      console.error("HEADER CART/WISHLIST COUNT ERROR:", error);
    }
  };

  // ---------------------------------------------------------------------------
  // NOTIFICATION LOGIC
  // ---------------------------------------------------------------------------

  const loadNotifications = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setNotificationLoading(true);

      const response = await getMyNotifications();

      setNotifications(
        Array.isArray(response?.notifications) ? response.notifications : []
      );

      setUnreadCount(Number(response?.unreadCount || 0));
    } catch (error) {
      console.error("HEADER NOTIFICATION ERROR:", error);

      if (
        error?.message?.toLowerCase()?.includes("token") ||
        error?.message?.toLowerCase()?.includes("unauthorized")
      ) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);

        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id ? { ...item, isRead: true } : item
          )
        );

        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      console.error("MARK NOTIFICATION ERROR:", error);
    }

    setNotificationOpen(false);

    if (notification.relatedModel === "Order" && notification.relatedId) {
      navigate(`/order/${notification.relatedId}`);
      return;
    }

    navigate("/notifications");
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));

      setUnreadCount(0);
    } catch (error) {
      console.error("MARK ALL READ ERROR:", error);
    }
  };

  // ---------------------------------------------------------------------------
  // COMPARE LOGIC
  // ---------------------------------------------------------------------------

  const handleCompareClick = () => {
    if (compareList.length === 0) {
      setComparePopup("empty");
    } else if (compareList.length === 1) {
      setComparePopup("single");
    } else {
      navigate("/compare");
    }
  };

  // ---------------------------------------------------------------------------
  // MAIN AUTH + NOTIFICATION EFFECT (reruns on route change / authChanged)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    checkAuthStatus();
    loadHeaderCounts();

    const handleCartWishlistUpdate = () => {
      checkAuthStatus();
      loadHeaderCounts();
    };

    window.addEventListener("cart-updated", handleCartWishlistUpdate);
    window.addEventListener("wishlist-updated", handleCartWishlistUpdate);
    window.addEventListener("authChanged", handleCartWishlistUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartWishlistUpdate);
      window.removeEventListener("wishlist-updated", handleCartWishlistUpdate);
      window.removeEventListener("authChanged", handleCartWishlistUpdate);
    };
  }, [location.pathname]);

  // Load notifications whenever auth state flips to logged-in
  useEffect(() => {
    if (isLoggedIn) {
      loadNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isLoggedIn]);

  // Poll for new notifications every 15s while logged in
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    const interval = setInterval(() => {
      loadNotifications();
    }, 15000);
    return () => {
      clearInterval(interval);
    };
  }, [isLoggedIn]);

  const announce = (label) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("zaid-header-action", { detail: label }));
    }
  };

  const submitSearch = (event) => {
    event.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/shop");
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <header className="site-header">
      <div className="header-main">
        <Link to="/" aria-label="Zaid Infotech home">
         <img
    src={theme === "dark" ? zaidInfotechLogoDark : zaidInfotechLogo}
    alt="Zaid Infotech"
    className="header-logo"
  />
        </Link>

        <form className="header-search" onSubmit={submitSearch} role="search">
          <label className="sr-only" htmlFor="header-category">Search category</label>
          <div className="category-select">
            <select
              id="header-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Search category"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" />
          </div>
          <label className="sr-only" htmlFor="header-query">Search laptops, brands, services</label>
          <input
            id="header-query"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search laptops, brands, services..."
          />
          <button className="search-button" type="submit" aria-label="Search">
            <Search aria-hidden="true" />
          </button>
        </form>

        <div className="header-actions">
          <motion.button
            variants={iconVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={22} className="sun-icon" strokeWidth={2} />
            ) : (
              <Moon size={22} strokeWidth={2} />
            )}
          </motion.button>

          {/* --- NOTIFICATION BELL (Desktop) --- */}
          {isLoggedIn && (
            <div className="notification-wrap">
              <motion.button
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="header-icon-btn notification-bell-btn"
                aria-label="Notifications"
              >
                <Bell size={22} strokeWidth={2} />
                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {notificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    className="notification-dropdown"
                  >
                    <div className="notification-dropdown-header">
                      <div>
                        <h3>Notifications</h3>
                        <p>
                          {unreadCount > 0
                            ? `${unreadCount} unread`
                            : "You're all caught up"}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          className="mark-all-read-btn"
                          onClick={handleMarkAllRead}
                          type="button"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="notification-list">
                      {notificationLoading ? (
                        <div className="notification-status">
                          Loading notifications...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="notification-empty">
                          <Bell size={35} />
                          <p className="notification-empty-title">No notifications</p>
                          <p className="notification-empty-sub">
                            New order updates will appear here.
                          </p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <button
                            key={notification._id}
                            type="button"
                            onClick={() => handleNotificationClick(notification)}
                            className={`notification-item${
                              !notification.isRead ? " notification-item-unread" : ""
                            }`}
                          >
                            <div className="notification-item-row">
                              <div className="notification-item-icon">
                                <Bell size={17} />
                              </div>
                              <div className="notification-item-body">
                                <div className="notification-item-heading">
                                  <h4>{notification.title}</h4>
                                  {!notification.isRead && (
                                    <span className="notification-dot" />
                                  )}
                                </div>
                                <p className="notification-item-message">
                                  {notification.message}
                                </p>
                                {notification.createdAt && (
                                  <p className="notification-item-time">
                                    {new Date(notification.createdAt).toLocaleString(
                                      "en-IN"
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="notification-dropdown-footer">
                        <button
                          type="button"
                          onClick={() => {
                            setNotificationOpen(false);
                            navigate("/notifications");
                          }}
                        >
                          View All Notifications
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <HeaderAction
            icon={SlidersHorizontal}
            label="Compare"
            badge={compareList.length > 0 ? compareList.length : undefined}
            onClick={handleCompareClick}
          />

          {!isInventoryRole() && (
            <>
          <motion.button
            variants={iconVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate("/wishlist")}
            className="header-icon-btn"
            aria-label="Wishlist"
          >
            <Heart size={22} strokeWidth={2} />
            {wishlistCount > 0 && (
              <span className="header-badge">{wishlistCount > 99 ? "99+" : wishlistCount}</span>
            )}
          </motion.button>

          <motion.button
            variants={iconVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => navigate("/cart")}
            className="header-icon-btn"
            aria-label="Cart"
          >
            <ShoppingCart size={22} strokeWidth={2} />
            {cartCount > 0 && (
              <span className="header-badge">{cartCount > 99 ? "99+" : cartCount}</span>
            )}
          </motion.button>

          <button className="quote-button" type="button" onClick={() => announce("Request a Quote")}>
            <span>Request a Quote</span>
            <small>For Business</small>
          </button>
          </>
          )}

          {/* --- ROLE BASED DASHBOARD (Desktop) --- */}
          {isLoggedIn && (
            <motion.button
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate(getDashboardPath())}
              className="header-icon-btn"
              aria-label="Dashboard"
              title="Dashboard"
            >
              <CircleUserRound size={22} strokeWidth={2} />
            </motion.button>
          )}

          {/* DESKTOP LOGIN / LOGOUT */}
          {isLoggedIn ? (
            <motion.button
              variants={desktopAuthVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleLogout}
              className="desktop-logout-btn"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={22} strokeWidth={2} />
            </motion.button>
          ) : (
            <motion.button
              variants={desktopAuthVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate("/login")}
              className="desktop-login-btn"
            >
              <UserRound size={19} strokeWidth={2} />
              Login
            </motion.button>
          )}

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* --- MAIN NAV WITH ACTIVE LINK STYLING --- */}
      <nav className="category-nav" aria-label="Main navigation">
        {navigationItems.map(({ label, subtitle, icon: Icon, path }) => (
          <NavLink
            className={({ isActive }) =>
              `nav-item${isActive ? " nav-item-active" : ""}`
            }
            to={path}
            key={label}
            onClick={() => announce(label)}
            end={path === "/"}
          >
            <Icon aria-hidden="true" />
            <span className="nav-copy">
              <strong>{label}</strong>
              <small>{subtitle}</small>
            </span>
          </NavLink>
        ))}
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <nav className="mobile-nav">
              {navigationItems.map(({ label, subtitle, icon: Icon, path }) => (
                <NavLink
                  className={({ isActive }) =>
                    `mobile-nav-item${isActive ? " mobile-nav-item-active" : ""}`
                  }
                  to={path}
                  key={label}
                  onClick={() => setMobileMenuOpen(false)}
                  end={path === "/"}
                >
                  <Icon size={20} />
                  <div>
                    <strong>{label}</strong>
                    <small>{subtitle}</small>
                  </div>
                </NavLink>
              ))}

              {/* --- COMPARE (Mobile) --- */}
              <button
                type="button"
                className="mobile-nav-item"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleCompareClick();
                }}
              >
                <SlidersHorizontal size={20} />
                <div>
                  <strong>COMPARE</strong>
                  <small>
                    {compareList.length > 0
                      ? `${compareList.length} selected`
                      : "Compare products"}
                  </small>
                </div>
              </button>

              {/* --- NOTIFICATION (Mobile) --- */}
              {isLoggedIn && (
                <button
                  type="button"
                  className="mobile-notification-item"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setNotificationOpen(false);
                    navigate("/notifications");
                  }}
                >
                  <div className="mobile-notification-left">
                    <Bell size={20} strokeWidth={2} />
                    <span>Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="mobile-notification-badge">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* --- ROLE BASED DASHBOARD (Mobile) --- */}
              {isLoggedIn && (
                <button
                  type="button"
                  className="mobile-dashboard-item"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(getDashboardPath());
                  }}
                >
                  <LayoutDashboard size={20} strokeWidth={2} />
                  <span>Dashboard</span>
                </button>
              )}

              {isLoggedIn ? (
                <motion.button
                  variants={mobileAuthVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleLogout}
                  className="mobile-logout-btn"
                >
                  <LogOut size={20} strokeWidth={2} />
                  Logout
                </motion.button>
              ) : (
                <motion.button
                  variants={mobileAuthVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/login");
                  }}
                  className="mobile-login-btn"
                >
                  <UserRound size={22} strokeWidth={2} />
                  Login
                </motion.button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- COMPARE POPUP (0 or 1 product selected) --- */}
      <AnimatePresence>
        {comparePopup && (
          <motion.div
            className="compare-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setComparePopup(null)}
          >
            <motion.div
              className="compare-popup-box"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <p>
                {comparePopup === "empty"
                  ? "No products added to compare yet."
                  : "Add at least one more product to compare."}
              </p>

              <div className="compare-popup-actions">
                {comparePopup === "empty" && (
                  <button
                    type="button"
                    className="compare-popup-primary-btn"
                    onClick={() => {
                      setComparePopup(null);
                      navigate("/shop");
                    }}
                  >
                    Browse Laptops
                  </button>
                )}

                <button
                  type="button"
                  className="compare-popup-close-btn"
                  onClick={() => setComparePopup(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}