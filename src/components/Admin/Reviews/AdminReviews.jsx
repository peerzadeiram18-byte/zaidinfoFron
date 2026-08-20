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

import "./AdminReviews.css";


const AdminReviews = () => {

  // =======================================
  // STATES
  // =======================================

  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(null);

  const [filter, setFilter] =
    useState("ALL");

  const [rejectModal, setRejectModal] =
    useState(null);

  const [rejectionReason, setRejectionReason] =
    useState("");


  // =======================================
  // LOAD REVIEWS
  // =======================================

  const loadReviews = async () => {

    try {

      setLoading(true);

      const response =
        await getAllReviews();

      console.log(
        "ADMIN REVIEWS RESPONSE:",
        response
      );

      const reviewList =
        response?.data?.reviews || [];

      setReviews(reviewList);

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


  // =======================================
  // INITIAL LOAD
  // =======================================

  useEffect(() => {

    loadReviews();

  }, []);


  // =======================================
  // APPROVE REVIEW
  // =======================================

  const handleApprove = async (
    reviewId
  ) => {

    try {

      setActionLoading(reviewId);

      const response =
        await approveReview(reviewId);

      toast.success(
        response?.data?.message ||
        "Review approved successfully."
      );

      // Update locally
      setReviews((previous) =>

        previous.map((review) =>

          review._id === reviewId

            ? {
                ...review,
                status: "APPROVED"
              }

            : review

        )

      );

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

      setActionLoading(null);

    }

  };


  // =======================================
  // OPEN REJECT MODAL
  // =======================================

  const openRejectModal = (
    review
  ) => {

    setRejectModal(review);

    setRejectionReason("");

  };


  // =======================================
  // CLOSE REJECT MODAL
  // =======================================

  const closeRejectModal = () => {

    setRejectModal(null);

    setRejectionReason("");

  };


  // =======================================
  // REJECT REVIEW
  // =======================================

  const handleReject = async () => {

    if (!rejectModal?._id) {
      return;
    }


    try {

      setActionLoading(
        rejectModal._id
      );


      const response =
        await rejectReview(

          rejectModal._id,

          rejectionReason.trim()

        );


      toast.success(
        response?.data?.message ||
        "Review rejected successfully."
      );


      // Update locally
      setReviews((previous) =>

        previous.map((review) =>

          review._id ===
          rejectModal._id

            ? {
                ...review,

                status: "REJECTED",

                rejectionReason:
                  rejectionReason.trim()
              }

            : review

        )

      );


      closeRejectModal();

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

      setActionLoading(null);

    }

  };


  // =======================================
  // FILTER REVIEWS
  // =======================================

  const filteredReviews =
    reviews.filter((review) => {

      if (filter === "ALL") {
        return true;
      }

      return review.status === filter;

    });


  // =======================================
  // COUNTS
  // =======================================

  const totalReviews =
    reviews.length;

  const pendingReviews =
    reviews.filter(
      (review) =>
        review.status === "PENDING"
    ).length;

  const approvedReviews =
    reviews.filter(
      (review) =>
        review.status === "APPROVED"
    ).length;

  const rejectedReviews =
    reviews.filter(
      (review) =>
        review.status === "REJECTED"
    ).length;


  // =======================================
  // RENDER
  // =======================================

  return (

    <div className="admin-reviews-page">


      {/* =================================
          HEADER
      ================================= */}

      <div className="admin-reviews-header">

        <div>

          <h1>
            Product Reviews
          </h1>

          <p>
            Manage customer product reviews
            and approve or reject them.
          </p>

        </div>

      </div>


      {/* =================================
          SUMMARY
      ================================= */}

      <div className="review-summary">


        <div className="review-summary-card">

          <span>
            Total Reviews
          </span>

          <strong>
            {totalReviews}
          </strong>

        </div>


        <div className="review-summary-card pending">

          <span>
            Pending
          </span>

          <strong>
            {pendingReviews}
          </strong>

        </div>


        <div className="review-summary-card approved">

          <span>
            Approved
          </span>

          <strong>
            {approvedReviews}
          </strong>

        </div>


        <div className="review-summary-card rejected">

          <span>
            Rejected
          </span>

          <strong>
            {rejectedReviews}
          </strong>

        </div>


      </div>


      {/* =================================
          FILTER
      ================================= */}

      <div className="review-filter-bar">

        <button
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


      {/* =================================
          REVIEWS
      ================================= */}

      {loading ? (

        <div className="reviews-loading">

          Loading reviews...

        </div>

      ) : filteredReviews.length === 0 ? (

        <div className="reviews-empty">

          <h3>
            No reviews found
          </h3>

          <p>
            There are no reviews in this category.
          </p>

        </div>

      ) : (

        <div className="reviews-table-wrapper">

          <table className="reviews-table">

            <thead>

              <tr>

                <th>
                  Customer
                </th>

                <th>
                  Product
                </th>

                <th>
                  Rating
                </th>

                <th>
                  Review
                </th>

                <th>
                  Purchase
                </th>

                <th>
                  Status
                </th>

                <th>
                  Date
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredReviews.map(
                (review) => (

                  <tr
                    key={review._id}
                  >


                    {/* CUSTOMER */}

                    <td>

                      <div className="review-customer">

                        <strong>

                          {review.user?.firstName ||
                            ""}

                          {" "}

                          {review.user?.lastName ||
                            ""}

                        </strong>

                        <small>

                          {review.user?.email ||
                            "N/A"}

                        </small>

                      </div>

                    </td>


                    {/* PRODUCT */}

                    <td>

                      <strong>

                        {review.product?.name ||
                          "Product unavailable"}

                      </strong>

                    </td>


                    {/* RATING */}

                    <td>

                      <div className="review-stars">

                        {[1, 2, 3, 4, 5].map(
                          (star) => (

                            <span
                              key={star}
                              className={
                                star <=
                                review.rating
                                  ? "filled"
                                  : ""
                              }
                            >
                              ★
                            </span>

                          )
                        )}

                      </div>

                      <small>

                        {review.rating}/5

                      </small>

                    </td>


                    {/* COMMENT */}

                    <td>

                      <div className="review-comment">

                        {review.comment}

                      </div>

                    </td>


                    {/* PURCHASE */}

                    <td>

                      {review.verifiedPurchase ? (

                        <span className="verified-badge">

                          ✓ Verified

                        </span>

                      ) : (

                        <span className="not-verified">

                          Not Verified

                        </span>

                      )}

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`
                          review-status
                          ${String(
                            review.status || ""
                          ).toLowerCase()}
                        `}
                      >

                        {review.status}

                      </span>

                    </td>


                    {/* DATE */}

                    <td>

                      {review.createdAt
                        ? new Date(
                            review.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "N/A"}

                    </td>


                    {/* ACTION */}

                    <td>

                      <div className="review-actions">


                        {review.status !==
                          "APPROVED" && (

                          <button
                            className="approve-btn"
                            disabled={
                              actionLoading ===
                              review._id
                            }
                            onClick={() =>
                              handleApprove(
                                review._id
                              )
                            }
                          >

                            {actionLoading ===
                            review._id
                              ? "..."
                              : "Approve"}

                          </button>

                        )}


                        {review.status !==
                          "REJECTED" && (

                          <button
                            className="reject-btn"
                            disabled={
                              actionLoading ===
                              review._id
                            }
                            onClick={() =>
                              openRejectModal(
                                review
                              )
                            }
                          >

                            Reject

                          </button>

                        )}

                      </div>

                    </td>


                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}


      {/* =================================
          REJECT MODAL
      ================================= */}

      {rejectModal && (

        <div className="reject-modal-overlay">

          <div className="reject-modal">

            <div className="reject-modal-header">

              <h2>
                Reject Review
              </h2>

              <button
                type="button"
                onClick={
                  closeRejectModal
                }
              >
                ×
              </button>

            </div>


            <div className="reject-modal-body">

              <p>
                Please provide a reason
                for rejecting this review.
              </p>


              <textarea
                value={
                  rejectionReason
                }
                onChange={(e) =>
                  setRejectionReason(
                    e.target.value
                  )
                }
                placeholder="Enter rejection reason..."
                maxLength={500}
                rows={5}
              />

              <small>
                {rejectionReason.length}/500
              </small>

            </div>


            <div className="reject-modal-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={
                  closeRejectModal
                }
              >
                Cancel
              </button>


              <button
                type="button"
                className="confirm-reject-btn"
                disabled={
                  actionLoading ===
                  rejectModal._id
                }
                onClick={
                  handleReject
                }
              >

                {actionLoading ===
                rejectModal._id
                  ? "Rejecting..."
                  : "Reject Review"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};


export default AdminReviews;