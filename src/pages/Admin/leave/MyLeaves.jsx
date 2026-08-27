import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyLeaves } from "../../../services/leaveService";
import "./MyLeaves.css";

const MyLeaves = () => {
    const navigate = useNavigate();

    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMyLeaves();
    }, []);

    const fetchMyLeaves = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getMyLeaves();

            console.log(
                "MY LEAVES RESPONSE:",
                response
            );

            if (Array.isArray(response)) {
                setLeaves(response);
            } else if (Array.isArray(response?.data)) {
                setLeaves(response.data);
            } else if (Array.isArray(response?.leaves)) {
                setLeaves(response.leaves);
            } else if (
                Array.isArray(response?.data?.leaves)
            ) {
                setLeaves(response.data.leaves);
            } else {
                setLeaves([]);
            }

        } catch (error) {
            console.error(
                "MY LEAVES ERROR:",
                error
            );

            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load leaves"
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const getStatusClass = (status) => {
        switch (
            String(status || "").toLowerCase()
        ) {
            case "approved":
                return "approved";

            case "rejected":
                return "rejected";

            case "cancelled":
                return "cancelled";

            default:
                return "pending";
        }
    };

    const handleView = (id) => {
        navigate(
            `/receptionist/leaves/${id}`
        );
    };

    if (loading) {
        return (
            <div className="my-leaves-page">
                <div className="my-leaves-loading">
                    Loading your leaves...
                </div>
            </div>
        );
    }

    return (
        <div className="my-leaves-page">

            {/* HEADER */}

            <div className="my-leaves-header">

                <div>
                    <h1>
                        My Leaves
                    </h1>

                    <p>
                        View and track your leave requests
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/receptionist/leave/apply"
                        )
                    }
                    className="apply-leave-btn"
                >
                    + Apply Leave
                </button>

            </div>


            {/* ERROR */}

            {error && (
                <div className="my-leaves-error">
                    {error}
                </div>
            )}


            {/* EMPTY */}

            {!error &&
                leaves.length === 0 && (
                    <div className="my-leaves-empty">

                        <div className="empty-icon">
                            📝
                        </div>

                        <h2>
                            No Leave Requests
                        </h2>

                        <p>
                            You have not applied
                            for any leave yet.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/receptionist/leave/apply"
                                )
                            }
                        >
                            Apply Leave
                        </button>

                    </div>
                )}


            {/* LEAVE LIST */}

            {leaves.length > 0 && (
                <div className="my-leaves-list">

                    {leaves.map((leave) => (

                        <div
                            className="my-leave-card"
                            key={leave._id}
                        >

                            <div className="my-leave-top">

                                <div>
                                    <h2>
                                        {typeof leave.leaveType ===
                                        "object"
                                            ? leave.leaveType?.name
                                            : leave.leaveType ||
                                              "Leave"}
                                    </h2>

                                    <span>
                                        ID:{" "}
                                        {leave._id}
                                    </span>
                                </div>

                                <span
                                    className={`leave-status ${getStatusClass(
                                        leave.status
                                    )}`}
                                >
                                    {leave.status ||
                                        "PENDING"}
                                </span>

                            </div>


                            <div className="my-leave-info">

                                <div>
                                    <span>
                                        From
                                    </span>

                                    <strong>
                                        {formatDate(
                                            leave.fromDate ||
                                            leave.startDate
                                        )}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        To
                                    </span>

                                    <strong>
                                        {formatDate(
                                            leave.toDate ||
                                            leave.endDate
                                        )}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Days
                                    </span>

                                    <strong>
                                        {leave.totalDays ??
                                            leave.numberOfDays ??
                                            "-"}
                                    </strong>
                                </div>

                            </div>


                            <div className="my-leave-reason">

                                <span>
                                    Reason
                                </span>

                                <p>
                                    {leave.reason ||
                                        "No reason provided"}
                                </p>

                            </div>


                            <button
                                type="button"
                                className="view-leave-btn"
                                onClick={() =>
                                    handleView(
                                        leave._id
                                    )
                                }
                            >
                                View Details →
                            </button>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
};

export default MyLeaves;