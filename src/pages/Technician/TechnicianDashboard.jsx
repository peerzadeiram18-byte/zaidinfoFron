// import "./TechnicianDashboard.css";

// function TechnicianDashboard(){

// const user=JSON.parse(localStorage.getItem("user"));

// return(

// <div className="technician-dashboard">

// <h1>Technician Dashboard</h1>

// <div className="card">

// <h2>{user.firstName} {user.lastName}</h2>

// <p>{user.email}</p>

// <p>{user.phone}</p>

// <p>{user.role}</p>

// </div>

// </div>

// );

// }

// export default TechnicianDashboard;


import "./TechnicianDashboard.css";
import {
  FaHome,
  FaTools,
  FaClipboardList,
  FaHistory,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaBoxOpen,
  FaCalendarAlt,
} from "react-icons/fa";

function TechnicianDashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const profileImage =
    user.profileImage ||
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <div className="tech-dashboard">

      {/* Sidebar */}
      <aside className="tech-sidebar">

        <div className="tech-profile">

          <img
            src={profileImage}
            alt="Profile"
            className="tech-profile-img"
          />

          <h3>
            {user.firstName || "Technician"} {user.lastName}
          </h3>

          <p>{user.role || "Technician"}</p>

        </div>

        <nav className="tech-menu">

          <a href="#">
            <FaHome /> Dashboard
          </a>

          <a href="#">
            <FaClipboardList /> Assigned Jobs
          </a>

          <a href="#">
            <FaTools /> My Repairs
          </a>

          <a href="#">
            <FaHistory /> Repair History
          </a>

          <a href="#">
            <FaBoxOpen /> Inventory Request
          </a>

          <a href="#">
            <FaCalendarAlt /> Leave Request
          </a>

          <a href="#">
            <FaBell /> Notifications
          </a>

          <a href="#">
            <FaCog /> Settings
          </a>

          <a href="#">
            <FaSignOutAlt /> Logout
          </a>

        </nav>

      </aside>

      {/* Main Content */}

      <main className="tech-main">

        <header className="tech-header">

          <div>
            <h2>Technician Dashboard</h2>
            <p>Welcome back, {user.firstName || "Technician"} 👋</p>
          </div>

        </header>

        {/* Stats */}

        <section className="tech-cards">

          <div className="tech-card">
            <h3>18</h3>
            <span>Assigned Repairs</span>
          </div>

          <div className="tech-card">
            <h3>11</h3>
            <span>Completed</span>
          </div>

          <div className="tech-card">
            <h3>7</h3>
            <span>Pending</span>
          </div>

          <div className="tech-card">
            <h3>96%</h3>
            <span>Performance</span>
          </div>

        </section>

        {/* Bottom */}

        <section className="tech-grid">

          <div className="tech-box">

            <h3>Profile Information</h3>

            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Role:</strong> {user.role}</p>

          </div>

          <div className="tech-box">

            <h3>Today's Tasks</h3>

            <ul>
              <li>Dell Latitude Repair</li>
              <li>HP Laptop Screen Replacement</li>
              <li>Lenovo Motherboard Check</li>
              <li>MacBook SSD Upgrade</li>
            </ul>

          </div>

        </section>

      </main>

    </div>
  );
}

export default TechnicianDashboard;


