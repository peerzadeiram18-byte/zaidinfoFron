import "./TechnicianDashboard.css";

function TechnicianDashboard(){

const user=JSON.parse(localStorage.getItem("user"));

return(

<div className="technician-dashboard">

<h1>Technician Dashboard</h1>

<div className="card">

<h2>{user.firstName} {user.lastName}</h2>

<p>{user.email}</p>

<p>{user.phone}</p>

<p>{user.role}</p>

</div>

</div>

);

}

export default TechnicianDashboard;