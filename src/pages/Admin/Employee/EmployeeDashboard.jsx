import React from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  // ======================================================
  // NAVIGATION
  // ======================================================

  // Apply new leave
  const handleApplyLeave = () => {
    navigate("/employee/leave/apply");
  };

  // View all employee leaves
  const handleMyLeaves = () => {
    navigate("/employee/leaves");
  };

  return (
    <div className="employee-dashboard">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="employee-dashboard-header">

        <div>
          <h1>
            Employee Dashboard
          </h1>

          <p>
            Manage your work, attendance and leave requests.
          </p>
        </div>

        <div className="employee-dashboard-user">

          <div className="employee-dashboard-avatar">
            E
          </div>

          <div>
            <strong>
              Employee
            </strong>

            <span>
              Staff Portal
            </span>
          </div>

        </div>

      </div>


      {/* ==================================================
          QUICK STATS
      ================================================== */}

      <div className="employee-dashboard-stats">

        {/* ATTENDANCE */}

        <div className="employee-stat-card">

          <div className="employee-stat-icon">
            📅
          </div>

          <div>
            <span>
              Attendance
            </span>

            <h2>
              0
            </h2>
          </div>

        </div>


        {/* TOTAL LEAVE REQUESTS */}

        <div className="employee-stat-card">

          <div className="employee-stat-icon">
            📝
          </div>

          <div>
            <span>
              Leave Requests
            </span>

            <h2>
              0
            </h2>
          </div>

        </div>


        {/* PENDING LEAVES */}

        <div className="employee-stat-card">

          <div className="employee-stat-icon">
            ⏳
          </div>

          <div>
            <span>
              Pending Leaves
            </span>

            <h2>
              0
            </h2>
          </div>

        </div>


        {/* APPROVED LEAVES */}

        <div className="employee-stat-card">

          <div className="employee-stat-icon">
            ✅
          </div>

          <div>
            <span>
              Approved Leaves
            </span>

            <h2>
              0
            </h2>
          </div>

        </div>

      </div>


      {/* ==================================================
          MAIN SECTION
      ================================================== */}

      <div className="employee-dashboard-main">


        {/* ==================================================
            LEAVE MANAGEMENT CARD
        ================================================== */}

        <div className="employee-leave-card">

          {/* CARD HEADER */}

          <div className="employee-card-header">

            <div>

              <h2>
                Leave Management
              </h2>

              <p>
                Apply for leave and check your leave requests.
              </p>

            </div>

          </div>


          {/* ==================================================
              APPLY LEAVE
          ================================================== */}

          <div className="employee-leave-action">

            <div className="employee-leave-action-icon">
              📝
            </div>

            <div className="employee-leave-action-content">

              <h3>
                Apply for Leave
              </h3>

              <p>
                Submit a new leave request for admin approval.
              </p>

            </div>

            <button
              type="button"
              className="employee-leave-primary-btn"
              onClick={handleApplyLeave}
            >
              Apply Leave →
            </button>

          </div>


          {/* ==================================================
              MY LEAVE REQUESTS
          ================================================== */}

          <div className="employee-leave-action">

            <div className="employee-leave-action-icon">
              📋
            </div>

            <div className="employee-leave-action-content">

              <h3>
                My Leave Requests
              </h3>

              <p>
                View your submitted leaves and their status.
              </p>

            </div>

            <button
              type="button"
              className="employee-leave-secondary-btn"
              onClick={handleMyLeaves}
            >
              View Leaves →
            </button>

          </div>

        </div>


        {/* ==================================================
            QUICK ACTIONS
        ================================================== */}

        <div className="employee-quick-actions-card">

          <h2>
            Quick Actions
          </h2>

          <p className="employee-quick-actions-subtitle">
            Common employee actions
          </p>


          {/* APPLY LEAVE */}

          <button
            type="button"
            className="employee-quick-action"
            onClick={handleApplyLeave}
          >

            <span className="employee-quick-action-icon">
              ➕
            </span>

            <span>
              <strong>
                Apply Leave
              </strong>

              <small>
                Submit a new leave request
              </small>
            </span>

            <span className="employee-action-arrow">
              →
            </span>

          </button>


          {/* MY LEAVES */}

          <button
            type="button"
            className="employee-quick-action"
            onClick={handleMyLeaves}
          >

            <span className="employee-quick-action-icon">
              📋
            </span>

            <span>
              <strong>
                My Leaves
              </strong>

              <small>
                Check leave request status
              </small>
            </span>

            <span className="employee-action-arrow">
              →
            </span>

          </button>

        </div>

      </div>


      {/* ==================================================
          LEAVE REQUEST FLOW
      ================================================== */}

      <div className="employee-leave-flow-card">

        {/* FLOW HEADER */}

        <div className="employee-flow-header">

          <div>

            <h2>
              Leave Request Flow
            </h2>

            <p>
              How your leave request is processed
            </p>

          </div>

          <span className="employee-flow-badge">
            EMPLOYEE
          </span>

        </div>


        {/* FLOW */}

        <div className="employee-leave-flow">


          {/* ==================================================
              STEP 1
          ================================================== */}

          <div className="employee-flow-step">

            <div className="employee-flow-number">
              1
            </div>

            <div>

              <strong>
                Apply
              </strong>

              <span>
                Submit Leave
              </span>

            </div>

          </div>


          <div className="employee-flow-arrow">
            →
          </div>


          {/* ==================================================
              STEP 2
          ================================================== */}

          <div className="employee-flow-step">

            <div className="employee-flow-number">
              2
            </div>

            <div>

              <strong>
                Admin
              </strong>

              <span>
                Reviews Request
              </span>

            </div>

          </div>


          <div className="employee-flow-arrow">
            →
          </div>


          {/* ==================================================
              STEP 3
          ================================================== */}

          <div className="employee-flow-step">

            <div className="employee-flow-number">
              3
            </div>

            <div>

              <strong>
                Decision
              </strong>

              <span>
                Approve / Reject
              </span>

            </div>

          </div>


          <div className="employee-flow-arrow">
            →
          </div>


          {/* ==================================================
              STEP 4
          ================================================== */}

          <div className="employee-flow-step">

            <div className="employee-flow-number">
              ✓
            </div>

            <div>

              <strong>
                Status
              </strong>

              <span>
                Employee Can View
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default EmployeeDashboard;