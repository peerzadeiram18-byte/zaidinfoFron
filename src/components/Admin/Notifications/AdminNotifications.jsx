import React, {
    useEffect,
    useState
} from "react";

import {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from "../../../services/notificationService";

import {
    FaBell,
    FaCheck,
    FaTrash
} from "react-icons/fa";

import {
    useNavigate
} from "react-router-dom";

import "./AdminNotifications.css";


const AdminNotifications = () => {

    const navigate = useNavigate();

    const [
        notifications,
        setNotifications
    ] = useState([]);

    const [
        unreadCount,
        setUnreadCount
    ] = useState(0);

    const [
        loading,
        setLoading
    ] = useState(true);


    // =========================================
    // LOAD
    // =========================================

    const loadNotifications = async () => {

        try {

            const res =
                await getMyNotifications();

            setNotifications(
                res.notifications || []
            );

            setUnreadCount(
                res.unreadCount || 0
            );

        }
        catch (error) {

            console.error(
                "NOTIFICATION LOAD ERROR:",
                error
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =========================================
    // INITIAL LOAD
    // =========================================

    useEffect(() => {

        loadNotifications();

    }, []);


    // =========================================
    // MARK READ
    // =========================================

    const handleRead = async (
        notification
    ) => {

        try {

            if (!notification.isRead) {

                await markNotificationAsRead(
                    notification._id
                );

            }

         if (
    notification.relatedModel ===
        "Order" &&
    notification.relatedId
) {

    navigate(
        `/admin/orders/${notification.relatedId}`
    );

    loadNotifications();

    return;

}


if (
    notification.relatedModel ===
        "Product" &&
    notification.relatedId
) {

    navigate(
        `/admin/inventory?product=${notification.relatedId}`
    );

    loadNotifications();

    return;

}

loadNotifications();

          

        }
        catch (error) {

            console.error(error);

        }

    };


    // =========================================
    // MARK ALL
    // =========================================

    const handleMarkAll = async () => {

        try {

            await markAllNotificationsAsRead();

            loadNotifications();

        }
        catch (error) {

            console.error(error);

        }

    };


    // =========================================
    // DELETE
    // =========================================

    const handleDelete = async (
        id
    ) => {

        try {

            await deleteNotification(id);

            loadNotifications();

        }
        catch (error) {

            console.error(error);

        }

    };


    if (loading) {

        return (
            <div className="admin-notifications">
                Loading notifications...
            </div>
        );

    }


    return (

        <div className="admin-notifications">

            <div className="notifications-header">

                <div>

                    <h1>
                        Notifications
                    </h1>

                    <p>
                        {unreadCount} unread
                        notifications
                    </p>

                </div>


                {unreadCount > 0 && (

                    <button
                        onClick={handleMarkAll}
                        className="mark-all-btn"
                    >
                        <FaCheck />

                        Mark all as read

                    </button>

                )}

            </div>


            <div className="notification-list">

                {notifications.length === 0 ? (

                    <div className="empty-notifications">

                        <FaBell />

                        <h3>
                            No Notifications
                        </h3>

                        <p>
                            You are all caught up.
                        </p>

                    </div>

                ) : (

                    notifications.map(
                        (notification) => (

                            <div
                                key={
                                    notification._id
                                }
                                className={
                                    `notification-card ${
                                        !notification.isRead
                                            ? "unread"
                                            : ""
                                    }`
                                }
                            >

                                <div
                                    className="notification-icon"
                                >
                                    <FaBell />
                                </div>


                                <div
                                    className="notification-content"
                                    onClick={() =>
                                        handleRead(
                                            notification
                                        )
                                    }
                                >

                                    <h3>
                                        {
                                            notification.title
                                        }
                                    </h3>

                                    <p>
                                        {
                                            notification.message
                                        }
                                    </p>

                                    <small>
                                        {
                                            new Date(
                                                notification.createdAt
                                            ).toLocaleString()
                                        }
                                    </small>

                                </div>


                                <button
                                    className="delete-notification"
                                    onClick={() =>
                                        handleDelete(
                                            notification._id
                                        )
                                    }
                                >
                                    <FaTrash />
                                </button>

                            </div>

                        )
                    )

                )}

            </div>

        </div>

    );

};

export default AdminNotifications;