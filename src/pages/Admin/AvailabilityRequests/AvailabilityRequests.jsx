import React, {
    useEffect,
    useState
} from "react";

import {
    getAllAvailabilityRequests,
    updateAvailabilityRequestStatus,
    deleteAvailabilityRequest
} from "../../../services/availabilityRequestService";

import "./AvailabilityRequests.css";


const AvailabilityRequests = () => {

    // ==================================================
    // STATE
    // ==================================================

    const [requests, setRequests] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [activeStatus, setActiveStatus] =
        useState("");

    const [updatingId, setUpdatingId] =
        useState(null);

    const [deletingId, setDeletingId] =
        useState(null);

    const [selectedRequest, setSelectedRequest] =
        useState(null);


    // ==================================================
    // LOAD REQUESTS
    // ==================================================

    const loadRequests = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getAllAvailabilityRequests(
                    activeStatus
                );

            /*
             * Backend successResponse usually returns:
             *
             * {
             *   success: true,
             *   message: "...",
             *   data: [...]
             * }
             */

            const data =
                response?.data;

            setRequests(
                Array.isArray(data)
                    ? data
                    : []
            );

        }
        catch (err) {

            console.error(
                "Availability requests load error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load availability requests."
            );

        }
        finally {

            setLoading(false);

        }
    };


    // ==================================================
    // LOAD ON FILTER CHANGE
    // ==================================================

    useEffect(() => {

        loadRequests();

    }, [activeStatus]);


    // ==================================================
    // STATUS UPDATE
    // ==================================================

    const handleStatusChange =
        async (
            id,
            status
        ) => {

            try {

                setUpdatingId(id);

                await updateAvailabilityRequestStatus(
                    id,
                    status
                );

                /*
                 * Local update first so UI feels instant.
                 */

                setRequests(prev =>
                    prev.map(request =>
                        request._id === id
                            ? {
                                ...request,
                                status
                            }
                            : request
                    )
                );


                /*
                 * Update selected request also.
                 */

                setSelectedRequest(prev => {

                    if (
                        !prev ||
                        prev._id !== id
                    ) {
                        return prev;
                    }

                    return {
                        ...prev,
                        status
                    };

                });

            }
            catch (err) {

                console.error(
                    "Status update error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Unable to update request status."
                );

            }
            finally {

                setUpdatingId(null);

            }
        };


    // ==================================================
    // DELETE
    // ==================================================

    const handleDelete =
        async (id) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this availability request?"
                );

            if (!confirmed) {
                return;
            }


            try {

                setDeletingId(id);

                await deleteAvailabilityRequest(id);


                setRequests(prev =>
                    prev.filter(
                        request =>
                            request._id !== id
                    )
                );


                if (
                    selectedRequest?._id === id
                ) {

                    setSelectedRequest(null);

                }

            }
            catch (err) {

                console.error(
                    "Delete availability request error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Unable to delete availability request."
                );

            }
            finally {

                setDeletingId(null);

            }
        };


    // ==================================================
    // FORMAT DATE
    // ==================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        try {

            return new Date(date)
                .toLocaleString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

        }
        catch {

            return "-";

        }
    };


    // ==================================================
    // STATUS CLASS
    // ==================================================

    const getStatusClass =
        (status) => {

            switch (status) {

                case "PENDING":
                    return "status-pending";

                case "CONTACTED":
                    return "status-contacted";

                case "RESOLVED":
                    return "status-resolved";

                default:
                    return "";

            }
        };


    // ==================================================
    // STATUS LABEL
    // ==================================================

    const getStatusLabel =
        (status) => {

            switch (status) {

                case "PENDING":
                    return "Pending";

                case "CONTACTED":
                    return "Contacted";

                case "RESOLVED":
                    return "Resolved";

                default:
                    return status || "-";

            }
        };


    // ==================================================
    // PRODUCT NAME
    // ==================================================

    const getProductName =
        (request) => {

            return (
                request?.product?.name ||
                "Unknown Product"
            );

        };


    // ==================================================
    // PRODUCT SKU
    // ==================================================

    const getProductSku =
        (request) => {

            return (
                request?.product?.sku ||
                "-"
            );

        };


    // ==================================================
    // EMPTY
    // ==================================================

    const renderEmptyState = () => {

        return (

            <div className="availability-empty">

                <div className="availability-empty-icon">
                    📦
                </div>

                <h3>
                    No availability requests
                </h3>

                <p>
                    There are no requests for this
                    status right now.
                </p>

            </div>

        );

    };


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (

            <div className="availability-page">

                <div className="availability-loading">

                    Loading availability requests...

                </div>

            </div>

        );

    }


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div className="availability-page">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="availability-page-header">

                <div>

                    <h1>
                        Availability Requests
                    </h1>

                    <p>
                        Manage customer requests for
                        currently unavailable products.
                    </p>

                </div>


                <button
                    type="button"
                    className="availability-refresh-btn"
                    onClick={loadRequests}
                    disabled={loading}
                >
                    ↻ Refresh
                </button>

            </div>


            {/* ==========================================
                ERROR
            ========================================== */}

            {error && (

                <div className="availability-error">

                    {error}

                    <button
                        type="button"
                        onClick={() =>
                            setError("")
                        }
                    >
                        ×
                    </button>

                </div>

            )}


            {/* ==========================================
                FILTERS
            ========================================== */}

            <div className="availability-filters">

                <button
                    type="button"
                    className={
                        activeStatus === ""
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveStatus("")
                    }
                >
                    All
                </button>


                <button
                    type="button"
                    className={
                        activeStatus === "PENDING"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveStatus("PENDING")
                    }
                >
                    Pending
                </button>


                <button
                    type="button"
                    className={
                        activeStatus === "CONTACTED"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveStatus("CONTACTED")
                    }
                >
                    Contacted
                </button>


                <button
                    type="button"
                    className={
                        activeStatus === "RESOLVED"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveStatus("RESOLVED")
                    }
                >
                    Resolved
                </button>

            </div>


            {/* ==========================================
                TABLE
            ========================================== */}

            <div className="availability-table-card">

                {requests.length === 0 ? (

                    renderEmptyState()

                ) : (

                    <div className="availability-table-wrapper">

                        <table className="availability-table">

                            <thead>

                                <tr>

                                    <th>
                                        Product
                                    </th>

                                    <th>
                                        Customer
                                    </th>

                                    <th>
                                        Mobile
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Requested
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {requests.map(
                                    (request) => (

                                        <tr
                                            key={
                                                request._id
                                            }
                                        >

                                            {/* PRODUCT */}

                                            <td>

                                                <div className="availability-product">

                                                    <strong>
                                                        {
                                                            getProductName(
                                                                request
                                                            )
                                                        }
                                                    </strong>

                                                    <span>
                                                        SKU: {
                                                            getProductSku(
                                                                request
                                                            )
                                                        }
                                                    </span>

                                                </div>

                                            </td>


                                            {/* CUSTOMER */}

                                            <td>

                                                <strong>
                                                    {
                                                        request.name
                                                    }
                                                </strong>

                                            </td>


                                            {/* MOBILE */}

                                            <td>

                                                <a
                                                    href={`tel:${request.mobile}`}
                                                    className="availability-mobile-link"
                                                >
                                                    {
                                                        request.mobile
                                                    }
                                                </a>

                                            </td>


                                            {/* EMAIL */}

                                            <td>

                                                {request.email ? (

                                                    <a
                                                        href={`mailto:${request.email}`}
                                                        className="availability-email-link"
                                                    >
                                                        {
                                                            request.email
                                                        }
                                                    </a>

                                                ) : (

                                                    <span className="availability-muted">
                                                        -
                                                    </span>

                                                )}

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        `availability-status ${getStatusClass(
                                                            request.status
                                                        )}`
                                                    }
                                                >
                                                    {
                                                        getStatusLabel(
                                                            request.status
                                                        )
                                                    }
                                                </span>

                                            </td>


                                            {/* DATE */}

                                            <td>

                                                <span className="availability-date">

                                                    {
                                                        formatDate(
                                                            request.createdAt
                                                        )
                                                    }

                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="availability-actions">

                                                    <button
                                                        type="button"
                                                        className="availability-view-btn"
                                                        onClick={() =>
                                                            setSelectedRequest(
                                                                request
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>


                                                    <select
                                                        value={
                                                            request.status ||
                                                            "PENDING"
                                                        }
                                                        disabled={
                                                            updatingId ===
                                                            request._id
                                                        }
                                                        onChange={(e) =>
                                                            handleStatusChange(
                                                                request._id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="availability-status-select"
                                                    >

                                                        <option value="PENDING">
                                                            Pending
                                                        </option>

                                                        <option value="CONTACTED">
                                                            Contacted
                                                        </option>

                                                        <option value="RESOLVED">
                                                            Resolved
                                                        </option>

                                                    </select>


                                                    <button
                                                        type="button"
                                                        className="availability-delete-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                request._id
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            request._id
                                                        }
                                                    >
                                                        {
                                                            deletingId ===
                                                            request._id
                                                                ? "..."
                                                                : "Delete"
                                                        }
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* ==========================================
                DETAILS MODAL
            ========================================== */}

            {selectedRequest && (

                <div
                    className="availability-details-overlay"
                    onClick={() =>
                        setSelectedRequest(null)
                    }
                >

                    <div
                        className="availability-details-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="availability-details-header">

                            <div>

                                <h2>
                                    Availability Request
                                </h2>

                                <p>
                                    Request details
                                </p>

                            </div>


                            <button
                                type="button"
                                className="availability-details-close"
                                onClick={() =>
                                    setSelectedRequest(null)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="availability-details-body">

                            <div className="availability-detail-row">

                                <span>
                                    Product
                                </span>

                                <strong>
                                    {
                                        getProductName(
                                            selectedRequest
                                        )
                                    }
                                </strong>

                            </div>


                            <div className="availability-detail-row">

                                <span>
                                    SKU
                                </span>

                                <strong>
                                    {
                                        getProductSku(
                                            selectedRequest
                                        )
                                    }
                                </strong>

                            </div>


                            <div className="availability-detail-row">

                                <span>
                                    Customer
                                </span>

                                <strong>
                                    {
                                        selectedRequest.name
                                    }
                                </strong>

                            </div>


                            <div className="availability-detail-row">

                                <span>
                                    Mobile
                                </span>

                                <a
                                    href={`tel:${selectedRequest.mobile}`}
                                >
                                    {
                                        selectedRequest.mobile
                                    }
                                </a>

                            </div>


                            <div className="availability-detail-row">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {
                                        selectedRequest.email ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div className="availability-detail-row">

                                <span>
                                    Status
                                </span>

                                <span
                                    className={
                                        `availability-status ${getStatusClass(
                                            selectedRequest.status
                                        )}`
                                    }
                                >
                                    {
                                        getStatusLabel(
                                            selectedRequest.status
                                        )
                                    }
                                </span>

                            </div>


                            <div className="availability-detail-row">

                                <span>
                                    Requested At
                                </span>

                                <strong>
                                    {
                                        formatDate(
                                            selectedRequest.createdAt
                                        )
                                    }
                                </strong>

                            </div>


                            <div className="availability-detail-message">

                                <span>
                                    Customer Message
                                </span>

                                <p>
                                    {
                                        selectedRequest.message ||
                                        "No message provided."
                                    }
                                </p>

                            </div>

                        </div>


                        <div className="availability-details-footer">

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedRequest(null)
                                }
                                className="availability-close-footer-btn"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
};


export default AvailabilityRequests;

