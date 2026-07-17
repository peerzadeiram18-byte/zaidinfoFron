import "./DashboardTable.css";

function DashboardTable(){

return(

<table className="dashboard-table">

<thead>

<tr>

<th>Name</th>

<th>Email</th>

<th>Status</th>

</tr>

</thead>

<tbody>

<tr>

<td>Ali</td>

<td>ali@gmail.com</td>

<td>Active</td>

</tr>

<tr>

<td>John</td>

<td>john@gmail.com</td>

<td>Active</td>

</tr>

<tr>

<td>Sara</td>

<td>sara@gmail.com</td>

<td>Inactive</td>

</tr>

</tbody>

</table>

);

}

export default DashboardTable;