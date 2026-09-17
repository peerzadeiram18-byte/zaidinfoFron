// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// import {
//   getMyNotifications,
//   markNotificationAsRead,
//   markAllNotificationsAsRead,
//   deleteNotification,
// } from "../services/notificationService";

// const NotificationContext =
//   createContext(null);

// export const NotificationProvider = ({
//   children,
// }) => {
//   const [notifications, setNotifications] =
//     useState([]);

//   const [unreadCount, setUnreadCount] =
//     useState(0);

//   const [loading, setLoading] =
//     useState(false);

//   const loadNotifications = async () => {
//     const token = localStorage.getItem("token");

//     if (!token) return;

//     try {
//       setLoading(true);

//       const response =
//         await getMyNotifications();

//       if (response.success) {
//         setNotifications(
//           response.notifications || []
//         );

//         setUnreadCount(
//           response.unreadCount || 0
//         );
//       }
//     } catch (error) {
//       console.error(
//         "Notification load error:",
//         error
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadNotifications();

//     const interval = setInterval(() => {
//       loadNotifications();
//     }, 30000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   const markAsRead = async (id) => {
//     try {
//       const response =
//         await markNotificationAsRead(id);

//       if (response.success) {
//         setNotifications((prev) =>
//           prev.map((notification) =>
//             notification._id === id
//               ? {
//                   ...notification,
//                   isRead: true,
//                 }
//               : notification
//           )
//         );

//         setUnreadCount((prev) =>
//           Math.max(prev - 1, 0)
//         );
//       }
//     } catch (error) {
//       console.error(
//         "Mark notification read error:",
//         error
//       );
//     }
//   };

//   const markAllAsRead = async () => {
//     try {
//       const response =
//         await markAllNotificationsAsRead();

//       if (response.success) {
//         setNotifications((prev) =>
//           prev.map((notification) => ({
//             ...notification,
//             isRead: true,
//           }))
//         );

//         setUnreadCount(0);
//       }
//     } catch (error) {
//       console.error(
//         "Mark all read error:",
//         error
//       );
//     }
//   };

//   const removeNotification = async (id) => {
//     try {
//       const notification =
//         notifications.find(
//           (item) => item._id === id
//         );

//       await deleteNotification(id);

//       setNotifications((prev) =>
//         prev.filter(
//           (item) => item._id !== id
//         )
//       );

//       if (notification && !notification.isRead) {
//         setUnreadCount((prev) =>
//           Math.max(prev - 1, 0)
//         );
//       }
//     } catch (error) {
//       console.error(
//         "Delete notification error:",
//         error
//       );
//     }
//   };

//   return (
//     <NotificationContext.Provider
//       value={{
//         notifications,
//         unreadCount,
//         loading,
//         loadNotifications,
//         markAsRead,
//         markAllAsRead,
//         removeNotification,
//       }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => {
//   const context =
//     useContext(NotificationContext);

//   if (!context) {
//     throw new Error(
//       "useNotifications must be used inside NotificationProvider"
//     );
//   }

//   return context;
// };



import { createContext, useContext, useEffect, useState } from "react";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification as apiDeleteNotification,
  // clearAllNotifications as apiClearAllNotifications, // uncomment if backend endpoint exists
} from "../services/notificationService";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const response = await getMyNotifications();
      if (response.success) {
        setNotifications(response.notifications || []);
        setUnreadCount(response.unreadCount || 0);
      }
    } catch (error) {
      console.error("Notification load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      const response = await markNotificationAsRead(id);
      if (response.success) {
        setNotifications((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, isRead: true } : item
          )
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      console.error("Mark notification read error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await markAllNotificationsAsRead();
      if (response.success) {
        setNotifications((prev) =>
          prev.map((item) => ({ ...item, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Mark all read error:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const target = notifications.find((item) => item._id === id);
      await apiDeleteNotification(id);

      setNotifications((prev) => prev.filter((item) => item._id !== id));

      if (target && !target.isRead) {
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      // If your backend has a dedicated clearAll API, use:
      // await apiClearAllNotifications();

      // Fallback: delete current notifications via parallel requests
      await Promise.all(
        notifications.map((item) => apiDeleteNotification(item._id))
      );

      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Clear all notifications error:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        loadNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }
  return context;
};