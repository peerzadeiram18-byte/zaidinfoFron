import React, { useState } from "react";

import "./LeaveManagement.css";

import LeaveRequests from "./LeaveRequests";
import LeavePolicies from "./LeavePolicies";
import HolidaysManagement from "./HolidaysManagement";

const LeaveManagement = () => {
  // ======================================================
  // ACTIVE TAB
  // ======================================================

  const [activeTab, setActiveTab] = useState("requests");

  // ======================================================
  // TAB CHANGE
  // ======================================================

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="leave-management">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="leave-header">

        <div>
          <h1>Leave Management</h1>

          <p>
            Manage employee leaves, policies and holidays.
          </p>
        </div>

        <div className="leave-header-icon">
          📅
        </div>

      </div>


      {/* ==================================================
          SUMMARY
      ================================================== */}

      <div className="leave-summary">

        {/* PENDING */}

        <div className="leave-summary-card">

          <div className="summary-icon pending">
            ⏳
          </div>

          <div>
            <span>
              Pending Requests
            </span>

            <strong>
              —
            </strong>
          </div>

        </div>


        {/* APPROVED */}

        <div className="leave-summary-card">

          <div className="summary-icon approved">
            ✓
          </div>

          <div>
            <span>
              Approved
            </span>

            <strong>
              —
            </strong>
          </div>

        </div>


        {/* REJECTED */}

        <div className="leave-summary-card">

          <div className="summary-icon rejected">
            ✕
          </div>

          <div>
            <span>
              Rejected
            </span>

            <strong>
              —
            </strong>
          </div>

        </div>


        {/* HOLIDAYS */}

        <div className="leave-summary-card">

          <div className="summary-icon holiday">
            📅
          </div>

          <div>
            <span>
              Upcoming Holidays
            </span>

            <strong>
              —
            </strong>
          </div>

        </div>

      </div>


      {/* ==================================================
          TABS
      ================================================== */}

      <div className="leave-tabs">

        {/* REQUESTS */}

        <button
          type="button"
          className={
            activeTab === "requests"
              ? "leave-tab active"
              : "leave-tab"
          }
          onClick={() =>
            handleTabChange("requests")
          }
        >
          📋 Leave Requests
        </button>


        {/* POLICIES */}

        <button
          type="button"
          className={
            activeTab === "policies"
              ? "leave-tab active"
              : "leave-tab"
          }
          onClick={() =>
            handleTabChange("policies")
          }
        >
          ⚙️ Leave Policies
        </button>


        {/* HOLIDAYS */}

        <button
          type="button"
          className={
            activeTab === "holidays"
              ? "leave-tab active"
              : "leave-tab"
          }
          onClick={() =>
            handleTabChange("holidays")
          }
        >
          📅 Holidays
        </button>

      </div>


      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="leave-content">


        {/* ==================================================
            LEAVE REQUESTS
        ================================================== */}

        {activeTab === "requests" && (
          <div className="leave-section">

            <LeaveRequests />

          </div>
        )}


        {/* ==================================================
            LEAVE POLICIES
        ================================================== */}

        {activeTab === "policies" && (
          <div className="leave-section">

            <LeavePolicies />

          </div>
        )}


        {/* ==================================================
            HOLIDAYS
        ================================================== */}

        {activeTab === "holidays" && (
          <div className="leave-section">

            <HolidaysManagement />

          </div>
        )}

      </div>

    </div>
  );
};

export default LeaveManagement;