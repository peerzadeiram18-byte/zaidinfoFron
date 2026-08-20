// import "./DashboardTable.css";

// function DashboardTable(){

// return(

// <table className="dashboard-table">

// <thead>

// <tr>

// <th>Name</th>

// <th>Email</th>

// <th>Status</th>

// </tr>

// </thead>

// <tbody>

// <tr>

// <td>Ali</td>

// <td>ali@gmail.com</td>

// <td>Active</td>

// </tr>

// <tr>

// <td>John</td>

// <td>john@gmail.com</td>

// <td>Active</td>

// </tr>

// <tr>

// <td>Sara</td>

// <td>sara@gmail.com</td>

// <td>Inactive</td>

// </tr>

// </tbody>

// </table>

// );

// }

// export default DashboardTable;


import React from "react";

export default function DashboardTable({ customers = [] }) {
  return (
    <div className="panel">
      <div className="panel-head panel-pad table-header">
        <div>
          <div className="panel-title">Recent customers</div>
          <div className="panel-sub">Latest signups across all channels</div>
        </div>

        <button type="button" className="view-all">
          View all
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.email}>
                <td>
                  <div className="cust-cell">
                    <div className="cust-avatar">
                      {customer.name ? customer.name.charAt(0) : "U"}
                    </div>
                    <span className="cust-name">{customer.name}</span>
                  </div>
                </td>
                <td className="cust-email">{customer.email}</td>
                <td>
                  <span
                    className={`badge ${
                      customer.status === "Active" ? "ok" : "off"
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--ink-faint)" }}>
            No customers found.
          </div>
        )}
      </div>
    </div>
  );
}