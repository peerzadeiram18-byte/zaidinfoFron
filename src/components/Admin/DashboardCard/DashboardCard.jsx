// import "./DashboardCard.css";

// function DashboardCard({title,total}){

// return(

// <div className="dashboard-card">

// <h4>{title}</h4>

// <h2>{total}</h2>

// </div>

// );

// }

// export default DashboardCard;


import React from "react";

export default function DashboardCard({
  title,
  total,
  delta,
  up,
  accent,
  iconType,
  sparkPoints,
  onClick,
}) {
  const getIcon = () => {
    switch (iconType) {
      case "customers":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="9" cy="8" r="3.2" />
            <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            <path d="M16 9a2.6 2.6 0 1 0 0-5.2M20 20c0-2.6-1.7-4.8-4-5.6" />
          </svg>
        );
      case "orders":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7l1.5-3h13L20 7" />
            <rect x="4" y="7" width="16" height="13" rx="1.5" />
            <path d="M9 11a3 3 0 0 0 6 0" />
          </svg>
        );
      case "employees":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <circle cx="12" cy="10" r="3" />
            <path d="M8 17c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5" />
          </svg>
        );
      case "products":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="5" width="18" height="12" rx="1.5" />
            <path d="M2 19h20" />
          </svg>
        );
      case "revenue":
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`stat stat-${accent}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="stat-top">
        <div className="stat-label">{title}</div>
        <div className="stat-icon">{getIcon()}</div>
      </div>

      <div className="stat-bottom">
        <div>
          <div className="stat-value">{total}</div>
          <div className={`stat-delta ${up ? "up" : ""}`}>
            {up && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 15l6-6 6 6" />
              </svg>
            )}
            {delta}
          </div>
        </div>

        {/* Sparkline Chart */}
        <svg className="spark" width="60" height="28" viewBox="0 0 60 28">
          <polyline
            points={sparkPoints}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="spark-line"
          />
        </svg>
      </div>
    </div>
  );
}