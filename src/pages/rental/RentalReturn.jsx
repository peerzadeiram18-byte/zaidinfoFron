import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  PackageCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { getRentalById } from "../../services/rentalApi";
import "./RentalReturn.css";

const getApiError = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong"
  );
};

const getStatusText = (status) => {
  if (!status) return "Unknown";

  return String(status)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getReturnMessage = (status) => {
  switch (status) {
    case "ACTIVE":
      return {
        title: "Rental Is Active",
        message:
          "Your rental is currently active. Please contact the rental team when you are ready to return the equipment.",
        type: "active",
      };

    case "RETURN_REQUESTED":
      return {
        title: "Return Requested",
        message:
          "Your return request has been received. The rental team will inspect the equipment and process the return.",
        type: "requested",
      };

    case "RETURNED":
      return {
        title: "Equipment Returned",
        message:
          "The equipment has been marked as returned and is currently being processed for settlement.",
        type: "returned",
      };

    case "SETTLEMENT_PENDING":
      return {
        title: "Settlement Pending",
        message:
          "Your equipment has been returned. The security deposit settlement is now being processed.",
        type: "settlement",
      };

    case "COMPLETED":
      return {
        title: "Rental Completed",
        message:
          "Your rental has been completed successfully.",
        type: "completed",
      };

    case "REJECTED":
      return {
        title: "Rental Rejected",
        message:
          "This rental request was rejected.",
        type: "rejected",
      };

    case "CANCELLED":
      return {
        title: "Rental Cancelled",
        message:
          "This rental has been cancelled.",
        type: "cancelled",
      };

    default:
      return {
        title: "Return Information",
        message:
          "Return information for this rental is shown below.",
        type: "default",
      };
  }
};

function RentalReturn() {
  const { rentalId } = useParams();
  const navigate = useNavigate();

  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadRental = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getRentalById(rentalId);

      const rentalData =
        response?.data?.data ||
        response?.data?.rental ||
        response?.data ||
        response?.rental ||
        null;

      setRental(rentalData);
    } catch (err) {
      console.error("Rental return load error:", err);

      setError(getApiError(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!rentalId) {
      setError("Rental ID is missing.");
      setLoading(false);
      return;
    }

    loadRental();
  }, [rentalId]);

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  if (loading) {
    return (
      <div className="rental-return-page">
        <div className="rental-return-loading">
          <div className="rental-return-spinner"></div>
          <p>Loading return information...</p>
        </div>
      </div>
    );
  }

  if (error && !rental) {
    return (
      <div className="rental-return-page">
        <div className="rental-return-container">
          <button
            type="button"
            className="rental-return-back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="rental-return-error">
            <AlertCircle size={42} />

            <h2>Unable to load rental</h2>

            <p>{error}</p>

            <button
              type="button"
              onClick={() => loadRental()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = rental?.status || "PENDING";
  const returnInfo = getReturnMessage(status);

  return (
    <div className="rental-return-page">
      <div className="rental-return-container">

        {/* HEADER */}
        <div className="rental-return-header">
          <div>
            <button
              type="button"
              className="rental-return-back-btn"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <h1>Rental Return</h1>

            <p>
              Return and settlement information for your rental.
            </p>
          </div>

          <button
            type="button"
            className="rental-return-refresh-btn"
            onClick={() => loadRental(true)}
            disabled={refreshing}
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "rental-return-refresh-icon"
                  : ""
              }
            />
            Refresh
          </button>
        </div>

        {/* ERROR */}
        {error && rental && (
          <div className="rental-return-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* STATUS CARD */}
        <div
          className={`rental-return-status-card ${returnInfo.type}`}
        >
          <div className="rental-return-status-icon">
            {returnInfo.type === "returned" ||
            returnInfo.type === "completed" ? (
              <CheckCircle size={30} />
            ) : returnInfo.type === "requested" ||
              returnInfo.type === "settlement" ? (
              <Clock size={30} />
            ) : (
              <PackageCheck size={30} />
            )}
          </div>

          <div className="rental-return-status-content">
            <span className="rental-return-status-label">
              Current Status
            </span>

            <h2>{returnInfo.title}</h2>

            <p>{returnInfo.message}</p>
          </div>
        </div>

        {/* RENTAL INFORMATION */}
        <div className="rental-return-card">
          <div className="rental-return-card-header">
            <div>
              <h2>Rental Information</h2>
              <p>Your rental details</p>
            </div>

            <span className="rental-return-number">
              {rental?.rentalNumber ||
                `#${rental?._id || rentalId}`}
            </span>
          </div>

          <div className="rental-return-info-grid">
            <div className="rental-return-info-item">
              <span>Rental Status</span>

              <strong>
                {getStatusText(status)}
              </strong>
            </div>

            <div className="rental-return-info-item">
              <span>Monthly Rent</span>

              <strong>
                ₹{formatCurrency(rental?.monthlyRent)}
              </strong>
            </div>

            <div className="rental-return-info-item">
              <span>Security Deposit</span>

              <strong>
                ₹{formatCurrency(rental?.securityDeposit)}
              </strong>
            </div>

            <div className="rental-return-info-item">
              <span>Rental Months</span>

              <strong>
                {rental?.rentalMonths || "-"} Months
              </strong>
            </div>

            <div className="rental-return-info-item">
              <span>Start Date</span>

              <strong>
                {formatDate(rental?.startDate)}
              </strong>
            </div>

            <div className="rental-return-info-item">
              <span>Expected End Date</span>

              <strong>
                {formatDate(rental?.expectedEndDate)}
              </strong>
            </div>

            <div className="rental-return-info-item">
              <span>Actual Return Date</span>

              <strong>
                {formatDate(rental?.actualReturnDate)}
              </strong>
            </div>

            <div className="rental-return-info-item">
              <span>Next Payment Date</span>

              <strong>
                {formatDate(rental?.nextPaymentDate)}
              </strong>
            </div>
          </div>
        </div>

        {/* RETURN DETAILS */}
        {(status === "RETURNED" ||
          status === "SETTLEMENT_PENDING" ||
          status === "COMPLETED") && (
          <div className="rental-return-card">
            <div className="rental-return-card-header">
              <div>
                <h2>Return & Settlement</h2>
                <p>Equipment return details</p>
              </div>
            </div>

            <div className="rental-return-info-grid">
              <div className="rental-return-info-item">
                <span>Return Condition</span>

                <strong>
                  {getStatusText(
                    rental?.returnCondition
                  )}
                </strong>
              </div>

              <div className="rental-return-info-item">
                <span>Damage Charges</span>

                <strong>
                  ₹
                  {formatCurrency(
                    rental?.damageCharges
                  )}
                </strong>
              </div>

              <div className="rental-return-info-item">
                <span>Other Deductions</span>

                <strong>
                  ₹
                  {formatCurrency(
                    rental?.otherDeductions
                  )}
                </strong>
              </div>

              <div className="rental-return-info-item highlight">
                <span>Deposit Refund</span>

                <strong>
                  ₹
                  {formatCurrency(
                    rental?.depositRefundAmount
                  )}
                </strong>
              </div>

              <div className="rental-return-info-item">
                <span>Refund Status</span>

                <strong>
                  {getStatusText(
                    rental?.depositRefundStatus ||
                      "PENDING"
                  )}
                </strong>
              </div>

              <div className="rental-return-info-item">
                <span>Actual Return Date</span>

                <strong>
                  {formatDate(
                    rental?.actualReturnDate
                  )}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* WHAT TO DO */}
        {status === "ACTIVE" && (
          <div className="rental-return-instructions">
            <div className="rental-return-instruction-icon">
              <PackageCheck size={22} />
            </div>

            <div>
              <h3>Ready to return?</h3>

              <p>
                Please contact the rental team and hand over
                the rented equipment. The team will inspect
                the equipment and update the return status.
              </p>
            </div>
          </div>
        )}

        {status === "RETURN_REQUESTED" && (
          <div className="rental-return-instructions">
            <div className="rental-return-instruction-icon">
              <Clock size={22} />
            </div>

            <div>
              <h3>Return is being processed</h3>

              <p>
                Please wait while the rental team completes
                the physical inspection and return process.
              </p>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="rental-return-actions">
          <button
            type="button"
            className="rental-return-secondary-btn"
            onClick={() => navigate("/rentals")}
          >
            Browse Rentals
          </button>

          <button
            type="button"
            className="rental-return-primary-btn"
            onClick={() =>
              navigate(`/rental/${rental?.productId?._id || rental?.productId}`)
            }
          >
            View Rental Details
          </button>
        </div>

      </div>
    </div>
  );
}

export default RentalReturn;