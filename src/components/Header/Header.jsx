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
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

import logoImg from "../../assets/images/zaidinfotechlogo.png";

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
  const { theme, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlistCount] = useState(0);
  const [cartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // --- LOGGED-IN STATUS STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check localStorage for logged-in status
    const token = localStorage.getItem("token");
    const loggedInStatus = localStorage.getItem("isLoggedIn");

    if (token || loggedInStatus === "true") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
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

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-all duration-300 ${
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
              src={logoImg}
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
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
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
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            </motion.button>

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
                items-center
                gap-2
                rounded-2xl
                border
                border-red-200
                dark:border-red-900/40
                bg-red-50/50
                dark:bg-red-950/20
                px-5
                py-2.5
                text-[15px]
                font-semibold
                text-red-600
                dark:text-red-400
                transition-all
                hover:bg-red-100/70
                dark:hover:bg-red-900/40
                "
              >
                <LogOut size={18} strokeWidth={2} />
                Logout
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

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                  {wishlistCount}
                </span>
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

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                  {cartCount}
                </span>
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