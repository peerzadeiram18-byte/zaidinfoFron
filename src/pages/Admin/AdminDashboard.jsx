// import "./AdminDashboard.css";

// // import Sidebar from "../../components/Admin/Sidebar/Sidebar";
// // import Topbar from "../../components/TopBar/Topbar";
// import Topbar from "../../components/TopBar/TopBar";
// import DashboardCard from "../../components/Admin/DashboardCard/DashboardCard";
// import DashboardTable from "../../components/Admin/DashboardTable/DashboardTable";
// import { useNavigate } from "react-router-dom";



// function AdminDashboard() {


//   const navigate = useNavigate();


//   return (
//     <div className="admin-dashboard">

//       {/* <Sidebar /> */}

//       <div className="admin-content">

//         <Topbar />

//         <div className="dashboard-cards">

//           {/* <DashboardCard
//             title="Customers"
//             total="250"
//           /> */}

//           <div onClick={()=>navigate("/customers")}>

// <DashboardCard
// title="Customers"
// total="250"
// />

// </div>

// <div
// onClick={() => navigate("/employees")}
// >

// <DashboardCard

// title="Employees"

// total="0"

// />

// </div>

// <div onClick={()=>navigate("/add-employee")}>

// <DashboardCard

// title="Employees"

// total="0"

// />

// </div>

//           <DashboardCard
//             title="Orders"
//             total="120"
//           />

//           <DashboardCard
//             title="Products"
//             total="75"
//           />

//           <DashboardCard
//             title="Revenue"
//             total="₹1,25,000"
//           />

//         </div>

//         <DashboardTable />

//       </div>

//     </div>
//   );
// }

// export default AdminDashboard;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardCard from "../../components/Admin/DashboardCard/DashboardCard";
import DashboardTable from "../../components/Admin/DashboardTable/DashboardTable";
import "./AdminDashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

const initialCustomers = [
  { name: "Ali", email: "ali@gmail.com", status: "Active" },
  { name: "John", email: "john@gmail.com", status: "Active" },
  { name: "Sara", email: "sara@gmail.com", status: "Inactive" },
];

export default function AdminDashboard() {
  const [customers] = useState(initialCustomers);
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    orderCount: 0,
    employeeCount: 10,
  });

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Safely access data using optional chaining with fallbacks
      const ordersLength = res?.data?.orders?.length || 0;

      console.log(res?.data?.success);
      console.log(ordersLength);

      setCounts((prev) => ({
        ...prev,
        orderCount: ordersLength,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="app">
      <main>
        {/* Top Header Navigation */}
        <header className="topbar">
          <div className="topbar-left">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-sub">
                Welcome back, here's what's happening today
              </p>
            </div>
          </div>

          <div className="topbar-right">
            {/* Search Input */}
            <div className="search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Search customers..." />
            </div>

            {/* Notification Bell */}
            <button type="button" className="icon-btn" aria-label="Notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="dot-badge" />
            </button>

            {/* User Avatar */}
            <div className="avatar-sm">AD</div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="content">
          {/* Top 4 Stat Cards */}
          <div className="stats">
            <DashboardCard
              title="Customers"
              total="250"
              delta="8.2%"
              up={true}
              accent="accent"
              iconType="customers"
              sparkPoints="0,22 10,18 20,20 30,15 40,17 50,10 60,12"
              onClick={() => navigate("/customers")}
            />
            <DashboardCard
              title="Employees"
              total="00"
              delta="8.2%"
              up={true}
              accent="accent"
              iconType="employees"
              sparkPoints="0,22 10,18 20,20 30,15 40,17 50,10 60,12"
              onClick={() => navigate("/employees")}
            />
            <DashboardCard
              title="Orders"
              total={counts.orderCount}
              delta="5 today"
              up={true}
              accent="blue"
              iconType="orders"
              sparkPoints="0,15 10,20 20,12 30,22 40,16 50,24 60,18"
            />
            <DashboardCard
              title="Products"
              total="75"
              delta="3 categories"
              up={false}
              accent="violet"
              iconType="products"
              sparkPoints="0,20 15,20 30,19 45,18 60,17"
            />
            <DashboardCard
              title="Revenue"
              total="₹1.25L"
              delta="12.4%"
              up={true}
              accent="warning"
              iconType="revenue"
              sparkPoints="0,22 10,22 20,20 30,18 40,21 50,15 60,16"
            />
          </div>

          {/* Middle Charts Grid */}
          <div className="grid-2">
            {/* Revenue Trend Line Chart */}
            <div className="panel panel-pad">
              <div className="panel-head">
                <div>
                  <div className="panel-title">Revenue trend</div>
                  <div className="panel-sub">Last 14 days</div>
                </div>
                <span className="pill">+12.4%</span>
              </div>

              <div className="chart-wrap">
                <svg viewBox="0 0 500 150" width="100%" height="100%" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" className="chart-fill-start" />
                      <stop offset="100%" className="chart-fill-end" />
                    </linearGradient>
                  </defs>

                  <line x1="0" y1="30" x2="500" y2="30" className="chart-grid-line" />
                  <line x1="0" y1="75" x2="500" y2="75" className="chart-grid-line" />
                  <line x1="0" y1="120" x2="500" y2="120" className="chart-grid-line" />

                  <polygon
                    points="0,110 40,95 80,100 120,85 160,92 200,70 240,80 280,65 320,72 360,60 400,45 440,55 480,62 480,150 0,150"
                    className="revenue-area"
                  />
                  <polyline
                    points="0,110 40,95 80,100 120,85 160,92 200,70 240,80 280,65 320,72 360,60 400,45 440,55 480,62"
                    fill="none"
                    strokeWidth="2.5"
                    className="revenue-line"
                  />
                  <polyline
                    points="0,135 40,135 80,130 120,128 160,133 200,120 240,122 280,115 320,117 360,110 400,102 440,110 480,112"
                    fill="none"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="orders-line"
                  />
                </svg>
              </div>

              <div className="legend">
                <span><i className="legend-revenue" /> Revenue</span>
                <span><i className="legend-orders" /> Orders</span>
              </div>
            </div>

            {/* Product Mix Pie/Donut Chart */}
            <div className="panel panel-pad">
              <div className="panel-title">Product mix</div>
              <div className="panel-sub">By category</div>

              <div className="donut-wrap">
                <div className="donut" />
                <div className="donut-legend">
                  <div className="donut-row">
                    <span className="donut-dot donut-accent" />
                    <span className="donut-label">Ultrabooks</span>
                    <span className="donut-val">42%</span>
                  </div>
                  <div className="donut-row">
                    <span className="donut-dot donut-blue" />
                    <span className="donut-label">Business</span>
                    <span className="donut-val">26%</span>
                  </div>
                  <div className="donut-row">
                    <span className="donut-dot donut-violet" />
                    <span className="donut-label">2-in-1</span>
                    <span className="donut-val">18%</span>
                  </div>
                  <div className="donut-row">
                    <span className="donut-dot donut-warning" />
                    <span className="donut-label">Gaming</span>
                    <span className="donut-val">14%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Customers Table */}
          <DashboardTable customers={customers} />
        </div>
      </main>
    </div>
  );
}