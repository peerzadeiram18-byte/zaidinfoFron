import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLeaveById } from "../../../services/leaveService";
import "./LeaveDetail.css";

const LeaveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // FETCH LEAVE DETAIL
  // ======================================================

  useEffect(() => {
    if (id) {
      fetchLeaveDetail();
    }
  }, [id]);

  const fetchLeaveDetail = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("FETCHING LEAVE ID:", id);

      const response = await getLeaveById(id);

      console.log(
        "LEAVE DETAIL RESPONSE:",
        response
      );

      /*
       * Backend response compatibility
       */

      if (response?.success) {
        setLeave(
          response.data?.leave ||
          response.data
        );
      } else if (response?.leave) {
        setLeave(response.leave);
      } else if (response?.data) {
        setLeave(response.data);
      } else {
        setLeave(response);
      }

    } catch (err) {
      console.error(
        "Leave detail error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load leave details"
      );

    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ======================================================
  // STATUS CLASS
  // ======================================================

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

      case "pending":
        return "pending";

      default:
        return "pending";
    }
  };

  // ======================================================
  // LEAVE TYPE
  // ======================================================

  const getLeaveType = () => {
    if (!leave?.leaveType) {
      return "Leave Request";
    }

    if (
      typeof leave.leaveType === "object"
    ) {
      return (
        leave.leaveType?.name ||
        leave.leaveType?.type ||
        "Leave Request"
      );
    }

    return leave.leaveType;
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="leave-detail-page">
        <div className="leave-detail-loading">
          Loading leave details...
        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <div className="leave-detail-page">
        <div className="leave-detail-error">

          <h3>
            Unable to load leave
          </h3>

          <p>
            {error}
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >

            <button
              type="button"
              onClick={fetchLeaveDetail}
            >
              Try Again
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ======================================================
  // NOT FOUND
  // ======================================================

  if (!leave) {
    return (
      <div className="leave-detail-page">

        <div className="leave-detail-error">

          <h3>
            Leave not found
          </h3>

          <button
            type="button"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>

        </div>

      </div>
    );
  }

  // ======================================================
  // DATA
  // ======================================================

  const fromDate =
    leave.fromDate ||
    leave.startDate;

  const toDate =
    leave.toDate ||
    leave.endDate;

  const totalDays =
    leave.totalDays ??
    leave.numberOfDays ??
    leave.days ??
    "-";

  const reason =
    leave.reason ||
    leave.description ||
    "No reason provided.";

  const adminRemark =
    leave.adminRemark ||
    leave.adminComment ||
    leave.adminRemarks;

  const rejectionReason =
    leave.rejectionReason;

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="leave-detail-page">

      {/* ================================================
          HEADER
      ================================================= */}

      <div className="leave-detail-header">

        <div>

          <h1>
            Leave Details
          </h1>

          <p>
            View your leave request information
          </p>

        </div>

        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

      </div>


      {/* ================================================
          MAIN CARD
      ================================================= */}

      <div className="leave-detail-card">

        {/* ==============================================
            TOP
        =============================================== */}

        <div className="leave-detail-top">

          <div>

            <h2>
              {getLeaveType()}
            </h2>

            <p className="leave-id">
              Leave ID:{" "}
              {leave._id || "-"}
            </p>

          </div>

          <span
            className={`status-badge ${getStatusClass(
              leave.status
            )}`}
          >
            {String(
              leave.status || "PENDING"
            ).toUpperCase()}
          </span>

        </div>


        {/* ==============================================
            BASIC DETAILS
        =============================================== */}

        <div className="leave-detail-grid">

          {/* FROM */}

          <div className="detail-item">

            <span>
              Start Date
            </span>

            <strong>
              {formatDate(fromDate)}
            </strong>

          </div>


          {/* TO */}

          <div className="detail-item">

            <span>
              End Date
            </span>

            <strong>
              {formatDate(toDate)}
            </strong>

          </div>


          {/* DAYS */}

          <div className="detail-item">

            <span>
              Number of Days
            </span>

            <strong>
              {totalDays}
            </strong>

          </div>


          {/* TYPE */}

          <div className="detail-item">

            <span>
              Leave Type
            </span>

            <strong>
              {getLeaveType()}
            </strong>

          </div>

        </div>


        {/* ==============================================
            REASON
        =============================================== */}

        <div className="detail-section">

          <h3>
            Reason
          </h3>

          <p>
            {reason}
          </p>

        </div>


        {/* ==============================================
            ADMIN REMARK
        =============================================== */}

        {adminRemark && (

          <div className="detail-section">

            <h3>
              Admin Remark
            </h3>

            <p>
              {adminRemark}
            </p>

          </div>

        )}


        {/* ==============================================
            REJECTION REASON
        =============================================== */}

        {rejectionReason && (

          <div className="detail-section rejection-section">

            <h3>
              Rejection Reason
            </h3>

            <p>
              {rejectionReason}
            </p>

          </div>

        )}


        {/* ==============================================
            FOOTER
        =============================================== */}

        <div className="leave-detail-footer">

          <span>
            Applied on:{" "}
            {formatDate(
              leave.createdAt
            )}
          </span>

          {leave.updatedAt && (

            <span>
              Updated on:{" "}
              {formatDate(
                leave.updatedAt
              )}
            </span>

          )}

        </div>

      </div>

    </div>
  );
};

export default LeaveDetails;