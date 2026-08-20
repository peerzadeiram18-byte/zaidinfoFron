import React, {
    useEffect,
    useState
} from "react";

import {
    toast
} from "react-toastify";

import {
    getAllReviews,
    approveReview,
    rejectReview
} from "../../../services/reviewService";

import "./ReviewList.css";


const ReviewList = () => {

    // ==================================================
    // STATES
    // ==================================================

    const [reviews, setReviews] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [selectedReview, setSelectedReview] =
        useState(null);

    const [showRejectModal, setShowRejectModal] =
        useState(false);

    const [rejectionReason, setRejectionReason] =
        useState("");

    const [filter, setFilter] =
        useState("ALL");


    // ==================================================
    // LOAD REVIEWS
    // ==================================================

    const loadReviews = async () => {

        try {

            setLoading(true);

            const response =
                await getAllReviews();

            console.log(
                "ADMIN REVIEWS RESPONSE:",
                response.data
            );

            setReviews(
                response.data?.reviews || []
            );

        }
        catch (error) {

            console.error(
                "GET ADMIN REVIEWS ERROR:",
                error
            );

            toast.error(

                error.response?.data?.message ||
                "Failed to load reviews."

            );

        }
        finally {

            setLoading(false);

        }

    };


    // ==================================================
    // INITIAL LOAD
    // ==================================================

    useEffect(() => {

        loadReviews();

    }, []);


    // ==================================================
    // APPROVE REVIEW
    // ==================================================

    const handleApprove = async (
        review
    ) => {

        const confirmApprove =
            window.confirm(
                "Are you sure you want to approve this review?"
            );

        if (!confirmApprove) {

            return;

        }


        try {

            setActionLoading(true);

            const response =
                await approveReview(
                    review._id
                );

            toast.success(

                response.data?.message ||
                "Review approved successfully."

            );


            // ------------------------------------------
            // Update UI immediately
            // ------------------------------------------

            setReviews(
                (previousReviews) =>
                    previousReviews.map(
                        (item) =>
                            item._id === review._id
                                ? {
                                    ...item,
                                    status: "APPROVED",
                                    reviewedBy:
                                        response.data?.review?.reviewedBy ||
                                        item.reviewedBy
                                }
                                : item
                    )
            );


            setSelectedReview(null);

        }
        catch (error) {

            console.error(
                "APPROVE REVIEW ERROR:",
                error
            );

            toast.error(

                error.response?.data?.message ||
                "Failed to approve review."

            );

        }
        finally {

            setActionLoading(false);

        }

    };


    // ==================================================
    // OPEN REJECT MODAL
    // ==================================================

    const handleOpenReject = (
        review
    ) => {

        setSelectedReview(review);

        setRejectionReason(
            review.rejectionReason || ""
        );

        setShowRejectModal(true);

    };


    // ==================================================
    // CLOSE REJECT MODAL
    // ==================================================

    const handleCloseReject = () => {

        if (actionLoading) {

            return;

        }

        setShowRejectModal(false);

        setSelectedReview(null);

        setRejectionReason("");

    };


    // ==================================================
    // REJECT REVIEW
    // ==================================================

    const handleReject = async (
        e
    ) => {

        e.preventDefault();


        if (!selectedReview) {

            return;

        }


        if (!rejectionReason.trim()) {

            toast.error(
                "Please enter rejection reason."
            );

            return;

        }


        try {

            setActionLoading(true);


            const response =
                await rejectReview(

                    selectedReview._id,

                    rejectionReason.trim()

                );


            toast.success(

                response.data?.message ||
                "Review rejected successfully."

            );


            // ------------------------------------------
            // Update UI immediately
            // ------------------------------------------

            setReviews(
                (previousReviews) =>
                    previousReviews.map(
                        (item) =>
                            item._id ===
                            selectedReview._id
                                ? {
                                    ...item,
                                    status: "REJECTED",
                                    rejectionReason:
                                        rejectionReason.trim(),
                                    reviewedBy:
                                        response.data?.review?.reviewedBy ||
                                        item.reviewedBy
                                }
                                : item
                    )
            );


            handleCloseReject();

        }
        catch (error) {

            console.error(
                "REJECT REVIEW ERROR:",
                error
            );

            toast.error(

                error.response?.data?.message ||
                "Failed to reject review."

            );

        }
        finally {

            setActionLoading(false);

        }

    };


    // ==================================================
    // FILTER REVIEWS
    // ==================================================

    const filteredReviews =
        reviews.filter(
            (review) => {

                if (filter === "ALL") {

                    return true;

                }

                return (
                    review.status === filter
                );

            }
        );


    // ==================================================
    // STATUS CLASS
    // ==================================================

    const getStatusClass = (
        status
    ) => {

        switch (status) {

            case "APPROVED":

                return "status-approved";

            case "REJECTED":

                return "status-rejected";

            case "PENDING":

                return "status-pending";

            default:

                return "";

        }

    };


    // ==================================================
    // RATING STARS
    // ==================================================

    const renderStars = (
        rating
    ) => {

        return (

            <div className="review-stars">

                {[1, 2, 3, 4, 5].map(
                    (star) => (

                        <span
                            key={star}
                            className={
                                star <= rating
                                    ? "filled"
                                    : ""
                            }
                        >
                            ★
                        </span>

                    )
                )}

            </div>

        );

    };


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (

            <div className="review-page">

                <div className="review-loading">

                    Loading reviews...

                </div>

            </div>

        );

    }


    // ==================================================
    // UI
    // ==================================================

    return (

        <div className="review-page">


            {/* =========================================
                HEADER
            ========================================== */}

            <div className="review-page-header">

                <div>

                    <h1>
                        Product Reviews
                    </h1>

                    <p>
                        Manage customer product reviews
                        and approve or reject them.
                    </p>

                </div>


                <button
                    type="button"
                    className="refresh-btn"
                    onClick={loadReviews}
                    disabled={loading}
                >
                    ↻ Refresh
                </button>

            </div>


            {/* =========================================
                SUMMARY CARDS
            ========================================== */}

            <div className="review-summary">


                <div className="review-summary-card">

                    <span>
                        Total Reviews
                    </span>

                    <strong>
                        {reviews.length}
                    </strong>

                </div>


                <div className="review-summary-card pending">

                    <span>
                        Pending
                    </span>

                    <strong>
                        {
                            reviews.filter(
                                (review) =>
                                    review.status ===
                                    "PENDING"
                            ).length
                        }
                    </strong>

                </div>


                <div className="review-summary-card approved">

                    <span>
                        Approved
                    </span>

                    <strong>
                        {
                            reviews.filter(
                                (review) =>
                                    review.status ===
                                    "APPROVED"
                            ).length
                        }
                    </strong>

                </div>


                <div className="review-summary-card rejected">

                    <span>
                        Rejected
                    </span>

                    <strong>
                        {
                            reviews.filter(
                                (review) =>
                                    review.status ===
                                    "REJECTED"
                            ).length
                        }
                    </strong>

                </div>


            </div>


            {/* =========================================
                FILTER
            ========================================== */}

            <div className="review-filter">

                <button
                    type="button"
                    className={
                        filter === "ALL"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setFilter("ALL")
                    }
                >
                    All
                </button>


                <button
                    type="button"
                    className={
                        filter === "PENDING"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setFilter("PENDING")
                    }
                >
                    Pending
                </button>


                <button
                    type="button"
                    className={
                        filter === "APPROVED"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setFilter("APPROVED")
                    }
                >
                    Approved
                </button>


                <button
                    type="button"
                    className={
                        filter === "REJECTED"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setFilter("REJECTED")
                    }
                >
                    Rejected
                </button>

            </div>


            {/* =========================================
                REVIEW TABLE
            ========================================== */}

            <div className="review-table-wrapper">

                <table className="review-table">

                    <thead>

                        <tr>

                            <th>
                                Product
                            </th>

                            <th>
                                Customer
                            </th>

                            <th>
                                Rating
                            </th>

                            <th>
                                Review
                            </th>

                            <th>
                                Order
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Date
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {filteredReviews.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="8"
                                    className="no-reviews"
                                >
                                    No reviews found.
                                </td>

                            </tr>

                        ) : (

                            filteredReviews.map(
                                (review) => (

                                    <tr
                                        key={
                                            review._id
                                        }
                                    >


                                        {/* PRODUCT */}

                                        <td>

                                            <div className="product-info">

                                                <div>

                                                    <strong>
                                                        {
                                                            review.product?.name ||
                                                            "Product"
                                                        }
                                                    </strong>

                                                </div>

                                            </div>

                                        </td>


                                        {/* CUSTOMER */}

                                        <td>

                                            <div className="customer-info">

                                                <strong>

                                                    {
                                                        review.user?.firstName ||
                                                        ""
                                                    }

                                                    {" "}

                                                    {
                                                        review.user?.lastName ||
                                                        ""
                                                    }

                                                </strong>

                                                <small>

                                                    {
                                                        review.user?.email ||
                                                        "N/A"
                                                    }

                                                </small>

                                            </div>

                                        </td>


                                        {/* RATING */}

                                        <td>

                                            {renderStars(
                                                review.rating
                                            )}

                                            <span className="rating-number">

                                                {
                                                    review.rating
                                                }
                                                /5

                                            </span>

                                        </td>


                                        {/* COMMENT */}

                                        <td>

                                            <div className="review-comment">

                                                {
                                                    review.comment
                                                }

                                            </div>

                                        </td>


                                        {/* ORDER */}

                                        <td>

                                            <span className="order-number">

                                                {
                                                    review.order?.orderNumber ||
                                                    review.order?._id ||
                                                    "N/A"
                                                }

                                            </span>

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={
                                                    `review-status ${getStatusClass(
                                                        review.status
                                                    )}`
                                                }
                                            >

                                                {
                                                    review.status
                                                }

                                            </span>

                                        </td>


                                        {/* DATE */}

                                        <td>

                                            {
                                                review.createdAt
                                                    ? new Date(
                                                        review.createdAt
                                                    ).toLocaleDateString()
                                                    : "N/A"
                                            }

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            <div className="review-actions">


                                                <button
                                                    type="button"
                                                    className="view-btn"
                                                    onClick={() =>
                                                        setSelectedReview(
                                                            review
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>


                                                {review.status !==
                                                    "APPROVED" && (

                                                    <button
                                                        type="button"
                                                        className="approve-btn"
                                                        onClick={() =>
                                                            handleApprove(
                                                                review
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading
                                                        }
                                                    >
                                                        Approve
                                                    </button>

                                                )}


                                                {review.status !==
                                                    "REJECTED" && (

                                                    <button
                                                        type="button"
                                                        className="reject-btn"
                                                        onClick={() =>
                                                            handleOpenReject(
                                                                review
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading
                                                        }
                                                    >
                                                        Reject
                                                    </button>

                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                )

                            )

                        )}

                    </tbody>

                </table>

            </div>


            {/* =========================================
                VIEW REVIEW MODAL
            ========================================== */}

            {selectedReview &&
                !showRejectModal && (

                    <div
                        className="review-modal-overlay"
                        onClick={() =>
                            setSelectedReview(null)
                        }
                    >

                        <div
                            className="admin-review-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="modal-header">

                                <div>

                                    <h2>
                                        Review Details
                                    </h2>

                                    <p>
                                        Customer review information
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    className="modal-close"
                                    onClick={() =>
                                        setSelectedReview(null)
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            <div className="modal-content">


                                <div className="detail-row">

                                    <span>
                                        Product
                                    </span>

                                    <strong>
                                        {
                                            selectedReview.product?.name ||
                                            "N/A"
                                        }
                                    </strong>

                                </div>


                                <div className="detail-row">

                                    <span>
                                        Customer
                                    </span>

                                    <strong>

                                        {
                                            selectedReview.user?.firstName ||
                                            ""
                                        }

                                        {" "}

                                        {
                                            selectedReview.user?.lastName ||
                                            ""
                                        }

                                    </strong>

                                </div>


                                <div className="detail-row">

                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        {
                                            selectedReview.user?.email ||
                                            "N/A"
                                        }
                                    </strong>

                                </div>


                                <div className="detail-row">

                                    <span>
                                        Order
                                    </span>

                                    <strong>
                                        {
                                            selectedReview.order?.orderNumber ||
                                            selectedReview.order?._id ||
                                            "N/A"
                                        }
                                    </strong>

                                </div>


                                <div className="detail-row">

                                    <span>
                                        Rating
                                    </span>

                                    <div>

                                        {renderStars(
                                            selectedReview.rating
                                        )}

                                    </div>

                                </div>


                                <div className="detail-comment">

                                    <span>
                                        Customer Review
                                    </span>

                                    <p>
                                        {
                                            selectedReview.comment
                                        }
                                    </p>

                                </div>


                                <div className="detail-row">

                                    <span>
                                        Status
                                    </span>

                                    <span
                                        className={
                                            `review-status ${getStatusClass(
                                                selectedReview.status
                                            )}`
                                        }
                                    >
                                        {
                                            selectedReview.status
                                        }
                                    </span>

                                </div>


                                {selectedReview.rejectionReason && (

                                    <div className="detail-comment rejection-detail">

                                        <span>
                                            Rejection Reason
                                        </span>

                                        <p>
                                            {
                                                selectedReview.rejectionReason
                                            }
                                        </p>

                                    </div>

                                )}

                            </div>


                            {selectedReview.status !==
                                "APPROVED" && (

                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="approve-btn large"
                                        onClick={() =>
                                            handleApprove(
                                                selectedReview
                                            )
                                        }
                                        disabled={
                                            actionLoading
                                        }
                                    >
                                        ✓ Approve Review
                                    </button>


                                    <button
                                        type="button"
                                        className="reject-btn large"
                                        onClick={() =>
                                            handleOpenReject(
                                                selectedReview
                                            )
                                        }
                                        disabled={
                                            actionLoading
                                        }
                                    >
                                        ✕ Reject Review
                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                )}


            {/* =========================================
                REJECT MODAL
            ========================================== */}

            {showRejectModal &&
                selectedReview && (

                    <div
                        className="review-modal-overlay"
                        onClick={handleCloseReject}
                    >

                        <div
                            className="admin-review-modal reject-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="modal-header">

                                <div>

                                    <h2>
                                        Reject Review
                                    </h2>

                                    <p>
                                        Please provide a reason
                                        for rejecting this review.
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    className="modal-close"
                                    onClick={
                                        handleCloseReject
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            <form
                                onSubmit={
                                    handleReject
                                }
                            >

                                <div className="reject-form">

                                    <label>
                                        Rejection Reason
                                    </label>

                                    <textarea
                                        value={
                                            rejectionReason
                                        }
                                        onChange={(e) =>
                                            setRejectionReason(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter reason for rejecting this review..."
                                        maxLength={500}
                                        rows={5}
                                        disabled={
                                            actionLoading
                                        }
                                    />

                                    <small>
                                        {
                                            rejectionReason.length
                                        }/500
                                    </small>

                                </div>


                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={
                                            handleCloseReject
                                        }
                                        disabled={
                                            actionLoading
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        className="reject-btn large"
                                        disabled={
                                            actionLoading
                                        }
                                    >

                                        {
                                            actionLoading
                                                ? "Rejecting..."
                                                : "Reject Review"
                                        }

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

        </div>

    );

};


export default ReviewList;