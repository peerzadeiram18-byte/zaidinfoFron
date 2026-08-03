import "./AdminDashboard.css";

// import Sidebar from "../../components/Admin/Sidebar/Sidebar";
import Topbar from "../../components/TopBar/Topbar";
import DashboardCard from "../../components/Admin/DashboardCard/DashboardCard";
import DashboardTable from "../../components/Admin/DashboardTable/DashboardTable";
import { useNavigate } from "react-router-dom";



function AdminDashboard() {


  const navigate = useNavigate();


  return (
    <div className="admin-dashboard">

      {/* <Sidebar /> */}

      <div className="admin-content">

        <Topbar />

        <div className="dashboard-cards">

          {/* <DashboardCard
            title="Customers"
            total="250"
          /> */}

          <div onClick={()=>navigate("/customers")}>

<DashboardCard
title="Customers"
total="250"
/>

</div>

<div
onClick={() => navigate("/employees")}
>

<DashboardCard

title="Employees"

total="0"

/>

</div>

<div onClick={()=>navigate("/add-employee")}>

<DashboardCard

title="Employees"

total="0"

/>

</div>

          <DashboardCard
            title="Orders"
            total="120"
          />

          <DashboardCard
            title="Products"
            total="75"
          />

          <DashboardCard
            title="Revenue"
            total="₹1,25,000"
          />

        </div>

        <DashboardTable />

      </div>

    </div>
  );
}

export default AdminDashboard;