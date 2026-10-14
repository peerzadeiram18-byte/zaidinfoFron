// src/pages/Technician/LeaveBalance.jsx
import React from "react";
import "./LeaveBalance.css";

const LABELS = {
  CASUAL: "Casual",
  SICK: "Sick",
  EARNED: "Earned",
  UNPAID: "Unpaid",
  OTHER: "Other",
};

// Mirrors the backend rule in leave.service.js:
// month of fromDate, PENDING + APPROVED only, monthlyLimit minus used.
const calculateBalances = (policies, leaves) => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  return policies
    .filter((policy) => policy.isActive !== false)
    .map((policy) => {
      if (policy.leaveType === "UNPAID") {
        return { type: "UNPAID", unlimited: true };
      }

      const used = leaves
        .filter((leave) => {
          const d = new Date(leave.fromDate);
          return (
            leave.leaveType === policy.leaveType &&
            ["PENDING", "APPROVED"].includes(leave.status) &&
            d.getMonth() === month &&
            d.getFullYear() === year
          );
        })
        .reduce((sum, leave) => sum + Number(leave.totalDays || 0), 0);

      const limit = Number(policy.monthlyLimit || 0);
      const remaining = Math.max(limit - used, 0);
      const percentUsed =
        limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 100;

      return {
        type: policy.leaveType,
        limit,
        used,
        remaining,
        percentUsed,
        exhausted: remaining === 0,
      };
    });
};

export default function LeaveBalance({ leaves = [], policies = [] }) {
  const balances = calculateBalances(policies, leaves);

  if (balances.length === 0) return null;

  const monthName = new Date().toLocaleString("en-IN", { month: "long" });

  return (
    <div className="lb-section">
      <h3 className="lb-title">Leave balance ({monthName})</h3>

      <div className="lb-grid">
        {balances.map((b) => (
          <div
            key={b.type}
            className={`lb-card${b.exhausted ? " lb-card-exhausted" : ""}`}
          >
            <span className="lb-type">{LABELS[b.type] || b.type}</span>

            {b.unlimited ? (
              <strong className="lb-value">No limit</strong>
            ) : (
              <>
                <strong className="lb-value">
                  {b.remaining}
                  <small> of {b.limit} left</small>
                </strong>

                <div className="lb-bar">
                  <div
                    className="lb-bar-fill"
                    style={{ width: `${b.percentUsed}%` }}
                  />
                </div>

                <span className="lb-used">{b.used} used or pending</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}