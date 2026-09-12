import React from "react";
import {
  CheckCircle2,
  Clock3,
  XCircle,
  FileCheck2,
  WalletCards,
  PackageCheck,
  Laptop,
  RotateCcw,
  Receipt,
} from "lucide-react";

import "./RentalStatus.css";

const STATUS_CONFIG = {
  PENDING: {
    label: "Request Pending",
    description: "Your rental request has been submitted and is waiting for review.",
    icon: Clock3,
    className: "pending",
  },

  DOCUMENT_VERIFICATION: {
    label: "Document Verification",
    description: "Your documents are being reviewed.",
    icon: FileCheck2,
    className: "verification",
  },

  APPROVED: {
    label: "Approved",
    description: "Your rental request has been approved.",
    icon: CheckCircle2,
    className: "approved",
  },

  DEPOSIT_PENDING: {
    label: "Deposit Pending",
    description: "Security deposit payment is required.",
    icon: WalletCards,
    className: "deposit",
  },

  READY_FOR_ALLOCATION: {
    label: "Ready for Allocation",
    description: "Your rental is ready for laptop allocation.",
    icon: PackageCheck,
    className: "ready",
  },

  ACTIVE: {
    label: "Rental Active",
    description: "The laptop has been allocated and your rental is active.",
    icon: Laptop,
    className: "active",
  },

  RETURN_REQUESTED: {
    label: "Return Requested",
    description: "Your return request is being processed.",
    icon: RotateCcw,
    className: "return",
  },

  RETURNED: {
    label: "Returned",
    description: "The rented laptop has been returned.",
    icon: RotateCcw,
    className: "returned",
  },

  SETTLEMENT_PENDING: {
    label: "Settlement Pending",
    description: "Final settlement and deposit refund are being processed.",
    icon: Receipt,
    className: "settlement",
  },

  COMPLETED: {
    label: "Rental Completed",
    description: "Your rental has been completed successfully.",
    icon: CheckCircle2,
    className: "completed",
  },

  REJECTED: {
    label: "Request Rejected",
    description: "Your rental request was rejected.",
    icon: XCircle,
    className: "rejected",
  },

  CANCELLED: {
    label: "Cancelled",
    description: "This rental has been cancelled.",
    icon: XCircle,
    className: "cancelled",
  },
};

const FLOW = [
  "PENDING",
  "DOCUMENT_VERIFICATION",
  "APPROVED",
  "DEPOSIT_PENDING",
  "READY_FOR_ALLOCATION",
  "ACTIVE",
  "RETURNED",
  "SETTLEMENT_PENDING",
  "COMPLETED",
];

function RentalStatus({ status }) {
  const normalizedStatus = String(status || "PENDING").toUpperCase();

  const current =
    STATUS_CONFIG[normalizedStatus] ||
    STATUS_CONFIG.PENDING;

  const CurrentIcon = current.icon;

  const currentIndex = FLOW.indexOf(normalizedStatus);

  return (
    <div className="rental-status-wrapper">
      {/* Current status */}

      <div
        className={`rental-current-status ${current.className}`}
      >
        <div className="rental-current-status-icon">
          <CurrentIcon size={22} />
        </div>

        <div className="rental-current-status-content">
          <span>Current Status</span>

          <strong>{current.label}</strong>

          <p>{current.description}</p>
        </div>
      </div>

      {/* Timeline */}

      <div className="rental-status-timeline">
        {FLOW.map((flowStatus, index) => {
          const config = STATUS_CONFIG[flowStatus];

          const Icon = config.icon;

          const isCurrent =
            flowStatus === normalizedStatus;

          const isCompleted =
            currentIndex >= 0 &&
            index < currentIndex;

          const isFuture =
            currentIndex >= 0 &&
            index > currentIndex;

          return (
            <div
              key={flowStatus}
              className={`rental-status-step ${
                isCurrent ? "current" : ""
              } ${isCompleted ? "completed" : ""} ${
                isFuture ? "future" : ""
              }`}
            >
              <div className="rental-status-step-marker">
                {isCompleted ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Icon size={17} />
                )}
              </div>

              <div className="rental-status-step-text">
                <strong>{config.label}</strong>

                {isCurrent && (
                  <span>Current stage</span>
                )}
              </div>

              {index < FLOW.length - 1 && (
                <div className="rental-status-line" />
              )}
            </div>
          );
        })}
      </div>

      {/* Rejected / cancelled message */}

      {(normalizedStatus === "REJECTED" ||
        normalizedStatus === "CANCELLED") && (
        <div
          className={`rental-final-status ${current.className}`}
        >
          <CurrentIcon size={19} />

          <div>
            <strong>{current.label}</strong>

            <p>{current.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RentalStatus;