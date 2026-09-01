import { useNavigate } from "react-router-dom";
import { MdClose, MdDoneAll } from "react-icons/md";

import {
  useNotifications,
} from "../../context/NotificationContext";

const NotificationDropdown = ({
  onClose,
}) => {
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();

  const handleNotificationClick = async (
    notification
  ) => {
    if (!notification.isRead) {
      await markAsRead(
        notification._id
      );
    }

    if (
      notification.relatedModel ===
        "Repair" &&
      notification.relatedId
    ) {
      navigate(
        `/admin/repairs/${notification.relatedId}`
      );

      onClose?.();
    }
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <div>
          <h3>Notifications</h3>

          {unreadCount > 0 && (
            <span>
              {unreadCount} unread
            </span>
          )}
        </div>

        <div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              title="Mark all as read"
            >
              <MdDoneAll />
            </button>
          )}

          <button onClick={onClose}>
            <MdClose />
          </button>
        </div>
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="notification-empty">
            No notifications
          </div>
        ) : (
          notifications.map(
            (notification) => (
              <div
                key={notification._id}
                className={`notification-item ${
                  !notification.isRead
                    ? "unread"
                    : ""
                }`}
                onClick={() =>
                  handleNotificationClick(
                    notification
                  )
                }
              >
                <div className="notification-content">
                  <strong>
                    {notification.title}
                  </strong>

                  <p>
                    {notification.message}
                  </p>

                  <small>
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </small>
                </div>

                <button
                  onClick={(event) => {
                    event.stopPropagation();

                    removeNotification(
                      notification._id
                    );
                  }}
                >
                  <MdClose />
                </button>
              </div>
            )
          )
        )}
      </div>

      <div className="notification-footer">
        <button
          onClick={() => {
            navigate("/notifications");
            onClose?.();
          }}
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;