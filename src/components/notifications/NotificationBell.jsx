import {
  MdNotifications,
} from "react-icons/md";

import {
  useNotifications,
} from "../../context/NotificationContext";

const NotificationBell = () => {
  const {
    unreadCount,
  } = useNotifications();

  return (
    <button
      className="notification-bell"
      type="button"
    >
      <MdNotifications size={25} />

      {unreadCount > 0 && (
        <span className="notification-badge">
          {unreadCount > 99
            ? "99+"
            : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;