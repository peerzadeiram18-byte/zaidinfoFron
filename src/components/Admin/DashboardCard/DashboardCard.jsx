import "./DashboardCard.css";

function DashboardCard({title,total}){

return(

<div className="dashboard-card">

<h4>{title}</h4>

<h2>{total}</h2>

</div>

);

}

export default DashboardCard;