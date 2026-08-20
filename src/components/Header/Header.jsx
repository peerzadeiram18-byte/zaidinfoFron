import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingCart,
  UserRound,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  CircleUserRound,
  LayoutDashboard
} from "lucide-react";
// import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  Link,
  NavLink,
  useNavigate,
  useLocation
} from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";

import logoImg from "../../assets/images/zaidinfotechlogo.png";
import logoDark from "../../assets/images/zaidinfotechlogo-white.png";

// import {
//   Bell,
//   LayoutDashboard
// } from "lucide-react";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "../../services/notificationService";
import { getWishlist } from "../../services/wishlistService";
import { getCart } from "../../services/cartService";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Rental", href: "/rental" },
  { name: "Repair Services", href: "/repair" },
  { name: "About Us", href: "/about-us" },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const [wishlistCount] = useState(0);
  // const [cartCount] = useState(0);

const [wishlistCount, setWishlistCount] = useState(0);
const [cartCount, setCartCount] = useState(0);

  const [isScrolled, setIsScrolled] = useState(false);

  // --- LOGGED-IN STATUS STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [notifications, setNotifications] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);
const [notificationOpen, setNotificationOpen] = useState(false);
const [notificationLoading, setNotificationLoading] = useState(false);


const getDashboardPath = () => {

  try {

    const userData = localStorage.getItem("user");

    if (!userData) {
      return "/customer-dashboard";
    }

    const user = JSON.parse(userData);

    const role = String(
      user?.role ||
      user?.userRole ||
      user?.type ||
      ""
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

    console.error(
      "DASHBOARD ROLE ERROR:",
      error
    );

    return "/customer-dashboard";

  }

};

  // useEffect(() => {
  //   // Check localStorage for logged-in status
  //   const token = localStorage.getItem("token");
  //   const loggedInStatus = localStorage.getItem("isLoggedIn");

  //   if (token || loggedInStatus === "true") {
  //     setIsLoggedIn(true);
  //   } else {
  //     setIsLoggedIn(false);
  //   }

  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 30);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  // --- LOGOUT HANDLER ---
  
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
 

// useEffect(() => {

//   const token =
//     localStorage.getItem("token");

//   const loggedInStatus =
//     localStorage.getItem("isLoggedIn");


//   const loggedIn =
//     Boolean(token) ||
//     loggedInStatus === "true";


//   setIsLoggedIn(loggedIn);


//   if (loggedIn && token) {

//     loadNotifications();

//   } else {

//     setNotifications([]);
//     setUnreadCount(0);

//   }


//   const handleScroll = () => {

//     setIsScrolled(
//       window.scrollY > 30
//     );

//   };


//   window.addEventListener(
//     "scroll",
//     handleScroll
//   );


//   return () => {

//     window.removeEventListener(
//       "scroll",
//       handleScroll
//     );

//   };


// }, []);
  
  
// useEffect(() => {

//   const checkLoginStatus = () => {

//     const token = localStorage.getItem("token");

//     const loggedInStatus =
//       localStorage.getItem("isLoggedIn");

//     const loggedIn =
//       Boolean(token) ||
//       loggedInStatus === "true";

//     setIsLoggedIn(loggedIn);

//     if (loggedIn && token) {

//       loadNotifications();
//        loadHeaderCounts();

//     } else {

//       setNotifications([]);
//       setUnreadCount(0);

//     }

//   };

//   // Initial check
//   checkLoginStatus();

//   // Login/logout ke baad same tab me update
//   window.addEventListener(
//     "authChanged",
//     checkLoginStatus
//   );

//   // Route change ke baad bhi check
//   checkLoginStatus();

//   return () => {

//     window.removeEventListener(
//       "authChanged",
//       checkLoginStatus
//     );

//   };

// }, [location.pathname]);
  
useEffect(() => {

  const checkLoginStatus = () => {

    const token = localStorage.getItem("token");

    const loggedInStatus =
      localStorage.getItem("isLoggedIn");

    const loggedIn =
      Boolean(token) ||
      loggedInStatus === "true";

    setIsLoggedIn(loggedIn);

    if (loggedIn && token) {

      loadNotifications();
      loadHeaderCounts();

    } else {

      setNotifications([]);
      setUnreadCount(0);

      setWishlistCount(0);
      setCartCount(0);

    }

  };

  checkLoginStatus();

  window.addEventListener(
    "authChanged",
    checkLoginStatus
  );

  checkLoginStatus();

  return () => {

    window.removeEventListener(
      "authChanged",
      checkLoginStatus
    );

  };

}, [location.pathname]);

  
  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("isLoggedIn");
  //   localStorage.removeItem("user");
  //   setIsLoggedIn(false);
  //   setMobileMenuOpen(false);
  //   navigate("/login");
  // };

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");

  setIsLoggedIn(false);
  setNotifications([]);
  setUnreadCount(0);
  setWishlistCount(0);
  setCartCount(0);
  setNotificationOpen(false);
  setMobileMenuOpen(false);

  navigate("/login");
};

  const iconVariants = {
    hover: { scale: 1.12 },
    tap: { scale: 0.94 },
  };

  const loginButtonVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px rgba(22,163,74,.2)",
    },
    tap: { scale: 0.97 },
  };

  const logoutButtonVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px rgba(239,68,68,.15)",
    },
    tap: { scale: 0.97 },
  };

  const mobileMenuVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.3 },
  };
  

const loadNotifications = async () => {

  const token = localStorage.getItem("token");

  if (!token) {

    setNotifications([]);
    setUnreadCount(0);

    return;
  }


  try {

    setNotificationLoading(true);


    const response =
      await getMyNotifications();


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
      "HEADER NOTIFICATION ERROR:",
      error
    );


    // Token invalid / expired
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

const handleNotificationClick = async (
  notification
) => {

  try {

    if (!notification.isRead) {

      await markNotificationAsRead(
        notification._id
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id
            ? {
                ...item,
                isRead: true
              }
            : item
        )
      );

      setUnreadCount((prev) =>
        Math.max(prev - 1, 0)
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


  if (
    notification.relatedModel ===
      "Order" &&
    notification.relatedId
  ) {

    navigate(
      `/order/${notification.relatedId}`
    );

    return;

  }


  navigate("/notifications");

};


const handleMarkAllRead = async () => {

  try {

    await markAllNotificationsAsRead();

    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true
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


// =====================================================
// LOAD CART + WISHLIST COUNTS
// =====================================================

const loadHeaderCounts = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    setWishlistCount(0);
    setCartCount(0);
    return;
  }

  try {
    const [wishlistResponse, cartResponse] =
      await Promise.all([
        getWishlist(),
        getCart(),
      ]);

    // ================================================
    // WISHLIST
    // ================================================

    const wishlistData =
      wishlistResponse?.data ||
      wishlistResponse?.wishlist ||
      wishlistResponse;

    const wishlistItems =
      Array.isArray(wishlistData?.items)
        ? wishlistData.items
        : Array.isArray(wishlistData?.wishlist)
        ? wishlistData.wishlist
        : Array.isArray(wishlistData)
        ? wishlistData
        : [];

    setWishlistCount(wishlistItems.length);

    // ================================================
    // CART
    // ================================================

    const cartData =
      cartResponse?.data ||
      cartResponse?.cart ||
      cartResponse;

    const cartItems =
      Array.isArray(cartData?.items)
        ? cartData.items
        : Array.isArray(cartData?.cartItems)
        ? cartData.cartItems
        : Array.isArray(cartData)
        ? cartData
        : [];

    setCartCount(cartItems.length);

  } catch (error) {

    console.error(
      "HEADER CART/WISHLIST COUNT ERROR:",
      error
    );

  }
};
  return (
  <header
  className={`relative w-full bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-all duration-300 ${
    isScrolled
      ? "shadow-[0_6px_25px_rgba(0,0,0,.08)]"
      : "shadow-sm"
  }`}
>
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div
          className={`flex items-center justify-between gap-4 transition-all duration-300 ${
            isScrolled ? "h-[90px]" : "h-[120px]"
          }`}
        >
          {/* Prominent Logo Container */}
          <Link
            to="/"
            className="flex items-center flex-shrink-0 py-2 max-w-[280px] sm:max-w-[340px]"
          >
  <motion.img
  whileHover={{ scale: 1.03 }}
  transition={{ duration: 0.25 }}
  src={theme === "dark" ? logoDark : logoImg}
  alt="ZAID INFOTECH"
  draggable="false"
  className={`w-auto object-contain transition-all duration-300 ${
    isScrolled
      ? "h-16 sm:h-20"
      : "h-20 sm:h-24 lg:h-28"
  }`}
/>
          </Link>

          {/* Centered Desktop Navigation */}
          <nav className="hidden xl:flex flex-1 justify-center items-center gap-8 xl:gap-10 2xl:gap-14 px-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) => `
                  relative
                  text-[16px]
                  font-semibold
                  whitespace-nowrap
                  transition-all
                  duration-300

                  after:absolute
                  after:left-0
                  after:-bottom-2
                  after:h-[2px]
                  after:bg-green-600
                  dark:after:bg-green-400
                  after:transition-all
                  after:duration-300

                  ${
                    isActive
                      ? "text-green-600 dark:text-green-400 after:w-full"
                      : "text-gray-800 dark:text-slate-100 after:w-0 hover:text-green-600 dark:hover:text-green-400 hover:after:w-full"
                  }
                `}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3 xl:gap-4 flex-shrink-0">
            {/* Theme Toggle Switcher (Desktop) */}
            <motion.button
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={toggleTheme}
              className="hidden lg:flex h-11 w-11 items-center justify-center rounded-full text-gray-700 dark:text-slate-200 transition-all hover:bg-green-50 dark:hover:bg-slate-800 hover:text-green-600 dark:hover:text-green-400"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={22} className="text-amber-400" strokeWidth={2} />
              ) : (
                <Moon size={22} strokeWidth={2} />
              )}
            </motion.button>

            {/* ==================================================
    CUSTOMER NOTIFICATIONS
================================================== */}

{isLoggedIn && (

  <div className="relative">

    <motion.button
      variants={iconVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={() =>
        setNotificationOpen(
          !notificationOpen
        )
      }
      className="
        hidden
        lg:flex
        relative
        h-11
        w-11
        items-center
        justify-center
        rounded-full
        text-gray-700
        dark:text-slate-200
        transition-all
        hover:bg-green-50
        dark:hover:bg-slate-800
        hover:text-green-600
        dark:hover:text-green-400
      "
      aria-label="Notifications"
    >

      <Bell
        size={22}
        strokeWidth={2}
      />

      {unreadCount > 0 && (

        <span
          className="
            absolute
            -top-1
            -right-1
            min-w-[20px]
            h-5
            px-1
            flex
            items-center
            justify-center
            rounded-full
            bg-red-600
            text-[10px]
            font-bold
            text-white
          "
        >
          {unreadCount > 99
            ? "99+"
            : unreadCount}
        </span>

      )}

    </motion.button>


    {/* ==================================================
        NOTIFICATION DROPDOWN
    ================================================== */}

    <AnimatePresence>

      {notificationOpen && (

        <motion.div

          initial={{
            opacity: 0,
            y: -10,
            scale: 0.98
          }}

          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}

          exit={{
            opacity: 0,
            y: -10,
            scale: 0.98
          }}

          className="
            absolute
            right-0
            top-14
            w-[360px]
            max-w-[90vw]
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-2xl
            dark:border-slate-700
            dark:bg-slate-900
            z-[100]
          "
        >

          {/* HEADER */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-gray-100
              px-4
              py-4
              dark:border-slate-700
            "
          >

            <div>

              <h3
                className="
                  text-base
                  font-bold
                  text-gray-900
                  dark:text-white
                "
              >
                Notifications
              </h3>

              <p
                className="
                  text-xs
                  text-gray-500
                  dark:text-slate-400
                "
              >
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You're all caught up"}
              </p>

            </div>


            {unreadCount > 0 && (

              <button
                onClick={
                  handleMarkAllRead
                }
                className="
                  text-xs
                  font-semibold
                  text-green-600
                  hover:text-green-700
                "
              >
                Mark all read
              </button>

            )}

          </div>


          {/* NOTIFICATIONS */}

          <div
            className="
              max-h-[420px]
              overflow-y-auto
            "
          >

            {notificationLoading ? (

              <div
                className="
                  px-5
                  py-10
                  text-center
                  text-sm
                  text-gray-500
                "
              >
                Loading notifications...
              </div>

            ) : notifications.length === 0 ? (

              <div
                className="
                  px-5
                  py-10
                  text-center
                "
              >

                <Bell
                  size={35}
                  className="
                    mx-auto
                    mb-3
                    text-gray-300
                  "
                />

                <p
                  className="
                    text-sm
                    font-medium
                    text-gray-600
                    dark:text-slate-300
                  "
                >
                  No notifications
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-400
                  "
                >
                  New order updates will appear here.
                </p>

              </div>

            ) : (

              notifications.map(
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
                      w-full
                      border-b
                      border-gray-100
                      px-4
                      py-4
                      text-left
                      transition
                      hover:bg-gray-50
                      dark:border-slate-800
                      dark:hover:bg-slate-800

                      ${
                        !notification.isRead
                          ? "bg-green-50/70 dark:bg-green-950/20"
                          : ""
                      }
                    `}
                  >

                    <div
                      className="
                        flex
                        gap-3
                      "
                    >

                      <div
                        className="
                          flex
                          h-9
                          w-9
                          min-w-[36px]
                          items-center
                          justify-center
                          rounded-full
                          bg-green-100
                          text-green-600
                          dark:bg-green-900/40
                          dark:text-green-400
                        "
                      >

                        <Bell
                          size={17}
                        />

                      </div>


                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-2
                          "
                        >

                          <h4
                            className="
                              text-sm
                              font-bold
                              text-gray-900
                              dark:text-white
                            "
                          >
                            {
                              notification.title
                            }
                          </h4>

                          {!notification.isRead && (

                            <span
                              className="
                                mt-1
                                h-2
                                w-2
                                min-w-[8px]
                                rounded-full
                                bg-green-600
                              "
                            />

                          )}

                        </div>


                        <p
                          className="
                            mt-1
                            line-clamp-2
                            text-xs
                            leading-5
                            text-gray-600
                            dark:text-slate-400
                          "
                        >
                          {
                            notification.message
                          }
                        </p>


                        {notification.createdAt && (

                          <p
                            className="
                              mt-2
                              text-[10px]
                              text-gray-400
                            "
                          >
                            {new Date(
                              notification.createdAt
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>

                        )}

                      </div>

                    </div>

                  </button>

                )
              )

            )}

          </div>


          {/* FOOTER */}

          {notifications.length > 0 && (

            <div
              className="
                border-t
                border-gray-100
                p-3
                dark:border-slate-700
              "
            >

              <button
                onClick={() => {

                  setNotificationOpen(
                    false
                  );

                  navigate(
                    "/notifications"
                  );

                }}
                className="
                  w-full
                  rounded-xl
                  bg-green-50
                  py-2.5
                  text-sm
                  font-semibold
                  text-green-700
                  hover:bg-green-100
                  dark:bg-green-950/30
                  dark:text-green-400
                "
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

            {/* Search */}
            <motion.button
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate("/shop")}
              className="hidden lg:flex h-11 w-11 items-center justify-center rounded-full text-gray-700 dark:text-slate-200 transition-all hover:bg-green-50 dark:hover:bg-slate-800 hover:text-green-600 dark:hover:text-green-400"
            >
              <Search size={22} strokeWidth={2} />
            </motion.button>

            {/* Wishlist */}
            <motion.button
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate("/wishlist")}
              className="hidden lg:flex relative h-11 w-11 items-center justify-center rounded-full text-gray-700 dark:text-slate-200 transition-all hover:bg-green-50 dark:hover:bg-slate-800 hover:text-green-600 dark:hover:text-green-400"
            >
              <Heart size={22} strokeWidth={2} />
              {/* <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">
                {wishlistCount}
              </span> */}
              {wishlistCount > 0 && (
  <span className="absolute -top-1 -right-1 flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">
    {wishlistCount > 99 ? "99+" : wishlistCount}
  </span>
)}
            </motion.button>

            {/* Cart */}
            <motion.button
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate("/cart")}
              className="hidden lg:flex relative h-11 w-11 items-center justify-center rounded-full text-gray-700 dark:text-slate-200 transition-all hover:bg-green-50 dark:hover:bg-slate-800 hover:text-green-600 dark:hover:text-green-400"
            >
              <ShoppingCart size={22} strokeWidth={2} />
              {/* <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">
                {cartCount}
              </span> */}
              {cartCount > 0 && (
  <span className="absolute -top-1 -right-1 flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">
    {cartCount > 99 ? "99+" : cartCount}
  </span>
)}
            </motion.button>



{isLoggedIn && (

  <motion.button
    variants={iconVariants}
    whileHover="hover"
    whileTap="tap"
onClick={() => navigate(getDashboardPath())}
    className="
      hidden
      lg:flex
      h-11
      w-11
      items-center
      justify-center
      rounded-full
      text-gray-700
      dark:text-slate-200
      transition-all
      hover:bg-green-50
      dark:hover:bg-slate-800
      hover:text-green-600
      dark:hover:text-green-400
    "
    aria-label="Dashboard"
    title="Dashboard"
  >

    <CircleUserRound
      size={22}
      strokeWidth={2}
    />

  </motion.button>

)}

            {/* --- CONDITIONAL DESKTOP AUTH BUTTON --- */}
{isLoggedIn ? (
  <motion.button
    variants={logoutButtonVariants}
    whileHover="hover"
    whileTap="tap"
    onClick={handleLogout}
    className="
      hidden
      lg:flex
      h-11
      w-11
      items-center
      justify-center
      rounded-full
      border
      border-red-200
      dark:border-red-900/40
      bg-red-50/50
      dark:bg-red-950/20
      text-red-600
      dark:text-red-400
      transition-all
      hover:bg-red-100
      dark:hover:bg-red-900/40
    "
    aria-label="Logout"
    title="Logout"
  >
    <LogOut
      size={22}
      strokeWidth={2}
    />
  </motion.button>
) : (
              <motion.button
                variants={loginButtonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => navigate("/login")}
                className="
                hidden
                lg:flex
                items-center
                gap-2.5
                rounded-2xl
                bg-green-600
                px-6
                py-2.5
                text-[15px]
                font-semibold
                text-white
                shadow-md
                transition-all
                hover:bg-green-700
                "
              >
                <UserRound size={19} strokeWidth={2} />
                Login
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2 text-gray-700 dark:text-slate-200 transition-all hover:bg-green-50 dark:hover:bg-slate-800 hover:text-green-600 dark:hover:text-green-400 xl:hidden"
            >
              {mobileMenuOpen ? (
                <X size={28} />
              ) : (
                <Menu size={28} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="xl:hidden overflow-hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl"
          >
            <div className="px-6 py-6">
              {/* Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      block rounded-xl px-4 py-3 text-base font-semibold transition-all duration-300
                      ${
                        isActive
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-700 dark:text-slate-200 hover:bg-green-50 dark:hover:bg-slate-800 hover:text-green-600 dark:hover:text-green-400"
                      }
                    `}
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>

              {/* Divider */}
              <div className="my-4 border-t border-gray-200 dark:border-slate-800"></div>

              {/* Theme Toggle Button (Mobile) */}
              <button
                onClick={toggleTheme}
                className="mb-2 flex w-full items-center gap-4 rounded-xl px-4 py-3 text-gray-700 dark:text-slate-200 transition-all duration-300 hover:bg-green-50 dark:hover:bg-slate-800 hover:text-green-600 dark:hover:text-green-400"
              >
                {theme === "dark" ? (
                  <>
                    <Sun size={22} className="text-amber-400" strokeWidth={2} />
                    <span className="font-medium">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={22} strokeWidth={2} />
                    <span className="font-medium">Dark Mode</span>
                  </>
                )}
              </button>

              {/* Search */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/shop");
                }}
                className="mb-2 flex w-full items-center gap-4 rounded-xl px-4 py-3 text-gray-700 dark:text-slate-200 transition-all duration-300 hover:bg-green-50 dark:hover:bg-slate-800 hover:text-green-600 dark:hover:text-green-400"
              >
                <Search size={22} strokeWidth={2} />
                <span className="font-medium">Search</span>
              </button>

              {isLoggedIn && (

  <button
    onClick={() => {

      setMobileMenuOpen(false);

      setNotificationOpen(false);

      navigate("/notifications");

    }}
    className="
      mb-2
      flex
      w-full
      items-center
      justify-between
      rounded-xl
      px-4
      py-3
      text-gray-700
      dark:text-slate-200
      transition-all
      hover:bg-green-50
      dark:hover:bg-slate-800
      hover:text-green-600
    "
  >

    <div className="flex items-center gap-4">

      <Bell
        size={22}
        strokeWidth={2}
      />

      <span className="font-medium">
        Notifications
      </span>

    </div>


    {unreadCount > 0 && (

      <span
        className="
          flex
          h-6
          min-w-6
          px-1
          items-center
          justify-center
          rounded-full
          bg-red-600
          text-xs
          font-bold
          text-white
        "
      >
        {unreadCount}
      </span>

    )}

  </button>

)}

{isLoggedIn && (

  <button
    onClick={() => {

      setMobileMenuOpen(false);

     navigate(getDashboardPath());

    }}
    className="
      mb-2
      flex
      w-full
      items-center
      gap-4
      rounded-xl
      px-4
      py-3
      text-gray-700
      dark:text-slate-200
      transition-all
      hover:bg-green-50
      dark:hover:bg-slate-800
      hover:text-green-600
    "
  >

    <LayoutDashboard
      size={22}
    />

    <span className="font-medium">
      Dashboard
    </span>

  </button>

)}

              {/* Wishlist */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/wishlist");
                }}
                className="mb-2 flex w-full items-center justify-between rounded-xl px-4 py-3 text-gray-700 dark:text-slate-200 transition-all duration-300 hover:bg-green-50 dark:hover:bg-slate-800 hover:text-green-600 dark:hover:text-green-400"
              >
                <div className="flex items-center gap-4">
                  <Heart size={22} strokeWidth={2} />
                  <span className="font-medium">Wishlist</span>
                </div>

                {/* <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                  {wishlistCount}
                </span> */}
                {wishlistCount > 0 && (
  <span className="flex h-6 min-w-6 px-1 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
    {wishlistCount > 99 ? "99+" : wishlistCount}
  </span>
)}
              </button>

              {/* Cart */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/cart");
                }}
                className="mb-2 flex w-full items-center justify-between rounded-xl px-4 py-3 text-gray-700 dark:text-slate-200 transition-all duration-300 hover:bg-green-50 dark:hover:bg-slate-800 hover:text-green-600 dark:hover:text-green-400"
              >
                <div className="flex items-center gap-4">
                  <ShoppingCart size={22} strokeWidth={2} />
                  <span className="font-medium">Cart</span>
                </div>

                {/* <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                  {cartCount}
                </span> */}
                {cartCount > 0 && (
  <span className="flex h-6 min-w-6 px-1 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
    {cartCount > 99 ? "99+" : cartCount}
  </span>
)}
              </button>

              {/* --- CONDITIONAL MOBILE AUTH BUTTON --- */}
              {isLoggedIn ? (
                <motion.button
                  variants={logoutButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleLogout}
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 px-5 py-3.5 text-base font-semibold text-red-600 dark:text-red-400 shadow-sm transition-all hover:bg-red-100/70 dark:hover:bg-red-900/40"
                >
                  <LogOut size={20} strokeWidth={2} />
                  Logout
                </motion.button>
              ) : (
                <motion.button
                  variants={loginButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/login");
                  }}
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-green-600 px-5 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-green-700"
                >
                  <UserRound size={22} strokeWidth={2} />
                  Login
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;