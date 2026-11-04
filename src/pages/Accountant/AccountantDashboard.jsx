
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FiHome,
  FiBell,
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiFileText,
  FiCreditCard,
  FiShoppingBag,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiArrowRight,
  FiCalendar,
  FiBarChart2,
  FiX,
} from "react-icons/fi";

import { FaRupeeSign } from "react-icons/fa";

import { getMyNotifications } from "../../services/notificationService";

import "./AccountantDashboard.css";

const AccountantDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  // =====================================================
  // USER DETAILS
  // =====================================================

  useEffect(() => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      setUser(storedUser || {});
    } catch (error) {
      console.error("Accountant user details error:", error);
      setUser({});
    }
  }, []);

  const fullName = useMemo(() => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";

    return (
      `${firstName} ${lastName}`.trim() ||
      user.name ||
      user.fullName ||
      "Accountant"
    );
  }, [user]);

  const initials = useMemo(() => {
    return fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }, [fullName]);

  // =====================================================
  // CURRENCY FORMAT - INDIAN RUPEES ONLY
  // =====================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  // =====================================================
  // ACCOUNTANT MODULES
  // =====================================================

  const modules = [
    {
      title: "Sales & Payments",
      description: "View sales records and payment transactions.",
      icon: <FiCreditCard />,
      path: "/accountant-dashboard/accountant/sales-payments",
      color: "blue",
      label: "SALES & PAYMENT",
    },
    {
      title: "Invoice Management",
      description: "View customer invoices and billing records.",
      icon: <FiFileText />,
      path: "/accountant-dashboard/accountant/invoices",
      color: "purple",
      label: "INVOICES",
    },
    {
      title: "Salary Management",
      description: "View employee salary and payroll records.",
      icon: <FiUser />,
      path: "/accountant-dashboard/accountant/salary",
      color: "pink",
      label: "SALARY",
    },
    {
      title: "Expense Management",
      description: "Track and review business expenses.",
      icon: <FaRupeeSign />,
      path: "/accountant-dashboard/accountant/expenses",
      color: "orange",
      label: "EXPENSES",
    },
    {
      title: "Purchase Management",
      description: "Review purchase and procurement records.",
      icon: <FiShoppingBag />,
      path: "/accountant-dashboard/accountant/purchases",
      color: "green",
      label: "PURCHASE",
    },
    {
      title: "Financial Reports",
      description: "Review financial summaries and reports.",
      icon: <FiBarChart2 />,
      path: "/accountant-dashboard/accountant/financial-reports",
      color: "cyan",
      label: "REPORTS",
    },
  ];

  // =====================================================
  // NAVIGATION
  // =====================================================

  const goHome = () => {
    setShowNotifications(false);
    navigate("/accountant-dashboard");
  };

  const openModule = (path) => {
    setShowNotifications(false);
    navigate(path);
  };

  // =====================================================
  // NOTIFICATION FETCH
  // =====================================================

  const fetchNotifications = useCallback(async () => {
    try {
      setLoadingNotifications(true);
      setNotificationError("");

      const response = await getMyNotifications();

      const root = response?.data ?? response;
      const data = root?.data ?? root;

      const list =
        data?.notifications ||
        data?.data?.notifications ||
        [];

      const count =
        data?.unreadCount ??
        data?.data?.unreadCount;

      setNotifications(
        Array.isArray(list) ? list : []
      );

      setUnreadCount(
        Number(
          count ??
          list.filter(
            (item) =>
              item.isRead !== true &&
              item.read !== true
          ).length
        )
      );
    } catch (error) {
      console.error("Accountant notifications error:", error);

      setNotificationError(
        error?.response?.data?.message ||
        "Unable to load notifications. Please try again."
      );
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // =====================================================
  // NOTIFICATION HELPERS
  // =====================================================

  const isNotificationRead = (item) => {
    return (
      item?.isRead === true ||
      item?.read === true
    );
  };

  const getNotificationTitle = (item) => {
    return (
      item?.title ||
      item?.subject ||
      "New Notification"
    );
  };

  const getNotificationMessage = (item) => {
    return (
      item?.message ||
      item?.description ||
      item?.body ||
      ""
    );
  };

  const getNotificationDate = (item) => {
    const date = item?.createdAt || item?.date;

    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // CLOSE NOTIFICATION PANEL
  // =====================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowNotifications(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="accountant-dashboard-page">

      {/* HEADER */}

      <header className="accountant-dashboard-header">

        <div className="accountant-dashboard-heading">
          <h1>Dashboard</h1>
          <p>Welcome back, {fullName}</p>
        </div>

        <div className="accountant-dashboard-header-actions">

          <button
            type="button"
            className="accountant-dashboard-home-btn"
            onClick={goHome}
          >
            <FiHome />
            <span>Home</span>
          </button>

          {/* NOTIFICATIONS */}

          <div className="accountant-dashboard-notification-wrap">

            <button
              type="button"
              className="accountant-dashboard-bell"
              onClick={() => {
                const nextState = !showNotifications;

                setShowNotifications(nextState);

                if (nextState) {
                  fetchNotifications();
                }
              }}
              aria-label="Open notifications"
              aria-expanded={showNotifications}
            >
              <FiBell />

              {unreadCount > 0 && (
                <span className="accountant-dashboard-badge">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>

                <button
                  type="button"
                  className="accountant-dashboard-notification-backdrop"
                  aria-label="Close notifications"
                  onClick={() => setShowNotifications(false)}
                />

                <div className="accountant-dashboard-notification-panel">

                  <div className="accountant-dashboard-notification-top">

                    <div>
                      <h3>Notifications</h3>
                      <p>
                        {unreadCount} unread notifications
                      </p>
                    </div>

                    <div className="accountant-dashboard-notification-actions">

                      <button
                        type="button"
                        onClick={fetchNotifications}
                        disabled={loadingNotifications}
                        title="Refresh notifications"
                      >
                        <FiRefreshCw
                          className={
                            loadingNotifications
                              ? "accountant-dashboard-spin"
                              : ""
                          }
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowNotifications(false)}
                        title="Close"
                      >
                        <FiX />
                      </button>

                    </div>

                  </div>

                  <div className="accountant-dashboard-notification-list">

                    {loadingNotifications && notifications.length === 0 ? (

                      <div className="accountant-dashboard-notification-empty">
                        <FiRefreshCw className="accountant-dashboard-spin" />
                        <span>Loading notifications...</span>
                      </div>

                    ) : notificationError ? (

                      <div className="accountant-dashboard-notification-empty">
                        <FiBell />
                        <span>{notificationError}</span>

                        <button
                          type="button"
                          onClick={fetchNotifications}
                        >
                          Try Again
                        </button>
                      </div>

                    ) : notifications.length === 0 ? (

                      <div className="accountant-dashboard-notification-empty">
                        <FiBell />
                        <strong>No notifications</strong>
                        <span>You are all caught up!</span>
                      </div>

                    ) : (

                      notifications.map((item, index) => {
                        const read = isNotificationRead(item);

                        return (
                          <div
                            key={item._id || item.id || index}
                            className={`accountant-dashboard-notification-item ${
                              !read ? "unread" : ""
                            }`}
                          >

                            <div className="accountant-dashboard-notification-icon">
                              <FiBell />
                            </div>

                            <div className="accountant-dashboard-notification-info">

                              <strong>
                                {getNotificationTitle(item)}
                              </strong>

                              {getNotificationMessage(item) && (
                                <p>
                                  {getNotificationMessage(item)}
                                </p>
                              )}

                              <span>
                                <FiClock />
                                {getNotificationDate(item)}
                              </span>

                              {read && (
                                <small className="accountant-dashboard-read-label">
                                  <FiCheckCircle />
                                  Read
                                </small>
                              )}

                            </div>

                            {!read && (
                              <span className="accountant-dashboard-unread-dot" />
                            )}

                          </div>
                        );
                      })

                    )}

                  </div>

                  <div className="accountant-dashboard-notification-bottom">
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                    >
                      Close
                    </button>
                  </div>

                </div>

              </>
            )}

          </div>

          {/* USER */}

          <div className="accountant-dashboard-header-user">

            <div className="accountant-dashboard-avatar">
              {initials}
            </div>

            <div className="accountant-dashboard-header-user-info">
              <strong>{fullName}</strong>
              <span>Accountant</span>
            </div>

          </div>

        </div>

      </header>

      {/* WELCOME BANNER */}

      <section className="accountant-dashboard-welcome">

        <div className="accountant-dashboard-welcome-content">

          <span className="accountant-dashboard-welcome-tag">
            ACCOUNTANT WORKSPACE
          </span>

          <h2>Welcome back, {fullName}!</h2>

          <p>
            Manage your financial operations, sales, payments,
            invoices, expenses and reports from one place.
          </p>

          <button
            type="button"
            onClick={() =>
              openModule(
                "/accountant-dashboard/accountant/financial-reports"
              )
            }
          >
            View Financial Reports
            <FiArrowRight />
          </button>

        </div>

        <div className="accountant-dashboard-welcome-graphic">

          <div className="accountant-dashboard-graphic-circle">
            <FiBarChart2 />
          </div>

          <div className="accountant-dashboard-rupee-circle">
            <FaRupeeSign />
          </div>

        </div>

      </section>

      {/* PROFILE */}

      <section className="accountant-dashboard-section">

        <div className="accountant-dashboard-section-heading">

          <div>
            <h2>My Profile</h2>
            <p>Your account information</p>
          </div>

          <span className="accountant-dashboard-status">
            <FiCheckCircle />
            Active Account
          </span>

        </div>

        <div className="accountant-dashboard-profile-card">

          <div className="accountant-dashboard-profile-main">

            <div className="accountant-dashboard-profile-avatar">
              {initials}
            </div>

            <div className="accountant-dashboard-profile-name">

              <h3>{fullName}</h3>

              <span>
                <FiShield />
                {user.role || "ACCOUNTANT"}
              </span>

            </div>

          </div>

          <div className="accountant-dashboard-profile-details">

            <div className="accountant-dashboard-detail">

              <div className="accountant-dashboard-detail-icon">
                <FiMail />
              </div>

              <div>
                <span>Email Address</span>
                <strong>{user.email || "Not available"}</strong>
              </div>

            </div>

            <div className="accountant-dashboard-detail">

              <div className="accountant-dashboard-detail-icon">
                <FiPhone />
              </div>

              <div>
                <span>Phone Number</span>
                <strong>
                  {user.phone || user.mobile || user.phoneNumber || "Not available"}
                </strong>
              </div>

            </div>

            <div className="accountant-dashboard-detail">

              <div className="accountant-dashboard-detail-icon">
                <FiUser />
              </div>

              <div>
                <span>Account Role</span>
                <strong>{user.role || "ACCOUNTANT"}</strong>
              </div>

            </div>

            <div className="accountant-dashboard-detail">

              <div className="accountant-dashboard-detail-icon">
                <FiCalendar />
              </div>

              <div>
                <span>Account Status</span>
                <strong className="accountant-dashboard-active-text">
                  Active
                </strong>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FINANCIAL MODULES */}

      {/*
      <section className="accountant-dashboard-section">

        <div className="accountant-dashboard-section-heading">
          <div>
            <h2>Financial Management</h2>
            <p>Quick access to your financial modules</p>
          </div>
        </div>

        <div className="accountant-dashboard-module-grid">

          {modules.map((module) => (
            <button
              type="button"
              key={module.path}
              className="accountant-dashboard-module-card"
              onClick={() => openModule(module.path)}
            >

              <div className={`accountant-dashboard-module-icon ${module.color}`}>
                {module.icon}
              </div>

              <div className="accountant-dashboard-module-content">
                <span>{module.label}</span>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </div>

              <div className="accountant-dashboard-module-arrow">
                <FiArrowRight />
              </div>

            </button>
          ))}

        </div>

      </section>
      */}

      {/* FOOTER */}

      <footer className="accountant-dashboard-footer">

        <span>
          © {new Date().getFullYear()} Zaid Infotech. All rights reserved.
        </span>

        <span>
          <FaRupeeSign />
          Accounts &amp; Finance
        </span>

      </footer>

    </div>
  );
};

export default AccountantDashboard;
