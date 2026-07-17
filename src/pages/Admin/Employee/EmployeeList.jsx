import { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeeList.css";
import {

updateEmployeeStatus

} from "../../../services/authService";


function EmployeeList() {

  const token = localStorage.getItem("token");

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/users/employees",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      setEmployees(res.data.data || []);

    } catch (err) {

      console.log(err);

    }

  };


  const changeStatus = async (

id,

status

)=>{

try{

await updateEmployeeStatus(

id,

status

);

fetchEmployees();

}

catch(error){

console.log(error);

alert("Unable To Update Status");

}

};

  return (

    <div className="employee-list-page">

      <h2>Employee List</h2>

      <table>

        <thead>

          <tr>

            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Department</th>
            <th>Designation</th>
             <th>Joining Date</th>
            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {employees.length === 0 ? (

            <tr>

              <td colSpan="5">
                No Employee Found
              </td>

            </tr>

          ) : (

            employees.map((employee) => (

              <tr key={employee._id}>

                <td>
                  {employee.firstName} {employee.lastName}
                </td>

                <td>{employee.email}</td>

                <td>{employee.phone}</td>

                <td>{employee.role}</td>

                <td>{employee.department}</td>

<td>{employee.designation}</td>

<td>
  {employee.joiningDate
    ? new Date(employee.joiningDate).toLocaleDateString()
    : "-"}
</td>

                <td>

<select

value={employee.status}

onChange={(e)=>

changeStatus(

employee._id,

e.target.value

)

}

>

<option value="ACTIVE">

ACTIVE

</option>

<option value="INACTIVE">

INACTIVE

</option>

<option value="BLOCKED">

BLOCKED

</option>

<option value="DELETED">

DELETED

</option>

</select>

</td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

}

export default EmployeeList;