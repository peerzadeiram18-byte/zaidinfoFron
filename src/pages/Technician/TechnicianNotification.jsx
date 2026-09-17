import React from "react";
import {
  FiTool,
  FiClock,
  FiInbox,
  FiCheckCircle,
  FiRefreshCw,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import "./TechnicianNotifications.css";

const TechnicianNotification = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    loadNotifications,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const handleNotificationClick = async (n) => {
    if (!n.isRead) {
      await markAsRead(n._id);
    }
    navigate("/technician-dashboard/my-repairs");
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      await clearAllNotifications();
    }
  };

  if (loading && notifications.length === 0) {
    return <div className="tn-loading">Loading notifications...</div>;
  }

  return (
    <div className="tn-container">
      <div className="tn-header">
        <div className="tn-title-group">
          <h2 className="tn-title">Notifications</h2>
          {unreadCount > 0 && (
            <span className="tn-unread-pill">{unreadCount} unread</span>
          )}
        </div>

        <div className="tn-actions">
          {unreadCount > 0 && (
            <button className="tn-btn-secondary" onClick={markAllAsRead}>
              <FiCheckCircle /> Mark all as read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              className="tn-btn-danger"
              onClick={handleClearAll}
              title="Clear All"
            >
              <FiTrash2 /> Clear all
            </button>
          )}

          <button
            className="tn-btn-secondary"
            onClick={loadNotifications}
            title="Refresh"
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="tn-empty">
          <div className="tn-empty-icon">
            <FiInbox />
          </div>
          <p>No notifications at the moment.</p>
        </div>
      ) : (
        <div className="tn-list">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className={`tn-card ${n.isRead ? "read" : "unread"}`}
            >
              <div className="tn-icon-box">
                <FiTool />
              </div>

              <div className="tn-content">
                <div className="tn-content-top">
                  <h4 className="tn-item-title">{n.title}</h4>
                  <div className="tn-card-actions">
                    <span className="tn-time">
                      <FiClock />{" "}
                      {new Date(n.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <button
                      type="button"
                      className="tn-delete-btn"
                      onClick={(e) => handleDelete(e, n._id)}
                      title="Delete notification"
                      aria-label="Delete notification"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <p className="tn-message">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnicianNotification;


// import React from "react";
// import { FiTool, FiClock, FiInbox, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { useNotifications } from "../../context/NotificationContext";
// import "./TechnicianNotifications.css";

// const TechnicianNotification = () => {
//   const navigate = useNavigate();
//   const {
//     notifications,
//     unreadCount,
//     loading,
//     markAsRead,
//     markAllAsRead,
//     loadNotifications,
//   } = useNotifications();

//   const handleNotificationClick = async (n) => {
//     // if (!n.isRead) {
//     //   await markAsRead(n._id);
//     // }
//     // if (n.relatedId) {
//     //   navigate(`/technician-dashboard/my-repairs/${n.relatedId}`);
//     // } else {
//     //   navigate("/technician-dashboard/my-repairs");
//     // }

//      navigate("/technician-dashboard/my-repairs");
//   };

//   if (loading && notifications.length === 0) {
//     return <div className="tn-loading">Loading notifications...</div>;
//   }

//   return (
//     <div className="tn-container">
//       {/* Top Header */}
//       <div className="tn-header">
//         <div className="tn-title-group">
//           <h2 className="tn-title">Notifications</h2>
//           {unreadCount > 0 && (
//             <span className="tn-unread-pill">{unreadCount} unread</span>
//           )}
//         </div>

//         <div className="tn-actions">
//           {unreadCount > 0 && (
//             <button className="tn-btn-secondary" onClick={markAllAsRead}>
//               <FiCheckCircle /> Mark all as read
//             </button>
//           )}
//           <button className="tn-btn-secondary" onClick={loadNotifications} title="Refresh">
//             <FiRefreshCw /> Refresh
//           </button>
//         </div>
//       </div>

//       {/* List or Empty State */}
//       {notifications.length === 0 ? (
//         <div className="tn-empty">
//           <div className="tn-empty-icon"><FiInbox /></div>
//           <p>No notifications at the moment.</p>
//         </div>
//       ) : (
//         <div className="tn-list">
//           {notifications.map((n) => (
//             <div
//               key={n._id}
//               onClick={() => handleNotificationClick(n)}
//               className={`tn-card ${n.isRead ? "read" : "unread"}`}
//             >
//               <div className="tn-icon-box">
//                 <FiTool />
//               </div>
//               <div className="tn-content">
//                 <div className="tn-content-top">
//                   <h4 className="tn-item-title">{n.title}</h4>
//                   <span className="tn-time">
//                     <FiClock /> {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </span>
//                 </div>
//                 <p className="tn-message">{n.message}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TechnicianNotification;