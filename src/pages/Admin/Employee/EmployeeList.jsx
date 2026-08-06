// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import "./EmployeeList.css";
// // import {

// // updateEmployeeStatus

// // } from "../../../services/authService";


// // function EmployeeList() {

// //   const token = localStorage.getItem("token");

// //   const [employees, setEmployees] = useState([]);

// //   useEffect(() => {
// //     fetchEmployees();
// //   }, []);

// //   const fetchEmployees = async () => {

// //     try {

// //       const res = await axios.get(
// //         "http://localhost:5000/api/users/employees",
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       console.log(res.data);

// //       setEmployees(res.data.data || []);

// //     } catch (err) {

// //       console.log(err);

// //     }

// //   };


// //   const changeStatus = async (

// // id,

// // status

// // )=>{

// // try{

// // await updateEmployeeStatus(

// // id,

// // status

// // );

// // fetchEmployees();

// // }

// // catch(error){

// // console.log(error);

// // alert("Unable To Update Status");

// // }

// // };

// //   return (

// //     <div className="employee-list-page">

// //       <h2>Employee List</h2>

// //       <table>

// //         <thead>

// //           <tr>

// //             <th>Name</th>
// //             <th>Email</th>
// //             <th>Phone</th>
// //             <th>Role</th>
// //             <th>Department</th>
// //             <th>Designation</th>
// //              <th>Joining Date</th>
// //             <th>Status</th>

// //           </tr>

// //         </thead>

// //         <tbody>

// //           {employees.length === 0 ? (

// //             <tr>

// //               <td colSpan="5">
// //                 No Employee Found
// //               </td>

// //             </tr>

// //           ) : (

// //             employees.map((employee) => (

// //               <tr key={employee._id}>

// //                 <td>
// //                   {employee.firstName} {employee.lastName}
// //                 </td>

// //                 <td>{employee.email}</td>

// //                 <td>{employee.phone}</td>

// //                 <td>{employee.role}</td>

// //                 <td>{employee.department}</td>

// // <td>{employee.designation}</td>

// // <td>
// //   {employee.joiningDate
// //     ? new Date(employee.joiningDate).toLocaleDateString()
// //     : "-"}
// // </td>

// //                 <td>

// // <select

// // value={employee.status}

// // onChange={(e)=>

// // changeStatus(

// // employee._id,

// // e.target.value

// // )

// // }

// // >

// // <option value="ACTIVE">

// // ACTIVE

// // </option>

// // <option value="INACTIVE">

// // INACTIVE

// // </option>

// // <option value="BLOCKED">

// // BLOCKED

// // </option>

// // <option value="DELETED">

// // DELETED

// // </option>

// // </select>

// // </td>

// //               </tr>

// //             ))

// //           )}

// //         </tbody>

// //       </table>

// //     </div>

// //   );

// // }

// // export default EmployeeList;



// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; // Added for routing
// import "./EmployeeList.css";
// import { updateEmployeeStatus } from "../../../services/authService";
// import SalaryModal from "../../../components/Admin/Salary/SalaryModal"; // Adjust relative path to SalaryModal

// function EmployeeList() {
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   const [employees, setEmployees] = useState([]);
//   const [selectedSalaryEmployeeId, setSelectedSalaryEmployeeId] = useState(null);

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/users/employees", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setEmployees(res.data.data || []);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const changeStatus = async (id, status) => {
//     try {
//       await updateEmployeeStatus(id, status);
//       fetchEmployees();
//     } catch (error) {
//       console.log(error);
//       alert("Unable To Update Status");
//     }
//   };

//   return (
//     <div className="employee-list-page">
//       <h2>Employee List</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>Role</th>
//             <th>Department</th>
//             <th>Designation</th>
//             <th>Joining Date</th>
//             <th>Status</th>
//             <th>Actions</th> {/* Added Action Column */}
//           </tr>
//         </thead>

//         <tbody>
//           {employees.length === 0 ? (
//             <tr>
//               <td colSpan="9">No Employee Found</td>
//             </tr>
//           ) : (
//             employees.map((employee) => (
//               <tr key={employee._id}>
//                 <td>{employee.firstName} {employee.lastName}</td>
//                 <td>{employee.email}</td>
//                 <td>{employee.phone}</td>
//                 <td>{employee.role}</td>
//                 <td>{employee.department}</td>
//                 <td>{employee.designation}</td>
//                 <td>
//                   {employee.joiningDate
//                     ? new Date(employee.joiningDate).toLocaleDateString()
//                     : "-"}
//                 </td>

//                 <td>
//                   <select
//                     value={employee.status}
//                     onChange={(e) => changeStatus(employee._id, e.target.value)}
//                   >
//                     <option value="ACTIVE">ACTIVE</option>
//                     <option value="INACTIVE">INACTIVE</option>
//                     <option value="BLOCKED">BLOCKED</option>
//                     <option value="DELETED">DELETED</option>
//                   </select>
//                 </td>

//                 {/* ACTION BUTTONS */}
//                 <td>
//                   <div style={{ display: "flex", gap: "8px" }}>
//                     <button
//                       onClick={() => navigate(`/admin/edit-employee/${employee._id}`)}
//                       className="btn-edit"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => setSelectedSalaryEmployeeId(employee._id)}
//                       className="btn-salary"
//                       style={{ backgroundColor: "#059669", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
//                     >
//                       Salary
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* Salary Modal Drawer */}
//       {selectedSalaryEmployeeId && (
//         <SalaryModal
//           employeeId={selectedSalaryEmployeeId}
//           onClose={() => setSelectedSalaryEmployeeId(null)}
//         />
//       )}
//     </div>
//   );
// }

// export default EmployeeList;



import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EmployeeList.css";
import { updateEmployeeStatus } from "../../../services/authService";
import SalaryModal from "../../../components/Admin/Salary/SalaryModal";
import { toast } from "react-toastify";

function EmployeeList() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSalaryEmployeeId, setSelectedSalaryEmployeeId] =
    useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/users/employees",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmployees(res.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Unable to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await updateEmployeeStatus(id, status);
      fetchEmployees();
    } catch (error) {
      console.log(error);
      toast.error("Unable To Update Status");
    }
  };

  return (
    <div className="employee-list-page">

      <h2>Employee List</h2>

      <table className="employee-table">

        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Joining Date</th>
            <th>System Access</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {loading ? (
            <tr>
              <td colSpan="11">Loading...</td>
            </tr>
          ) : employees.length === 0 ? (
            <tr>
              <td colSpan="11">No Employee Found</td>
            </tr>
          ) : (
            employees.map((employee) => (
              <tr key={employee._id}>

                {/* Employee ID */}
                <td>{employee.employeeId || "-"}</td>

                {/* Employee Name */}
                <td>
                  {employee.firstName} {employee.lastName}
                </td>

                {/* Email */}
                <td>{employee.email || "-"}</td>

                {/* Phone */}
                <td>{employee.phone || "-"}</td>

                {/* Role */}
                <td>{employee.role || "-"}</td>

                {/* Department */}
                <td>{employee.department || "-"}</td>

                {/* Designation */}
                <td>{employee.designation || "-"}</td>

                {/* Joining Date */}
                <td>
                  {employee.salaryDetails?.joiningDate
                    ? new Date(
                        employee.salaryDetails.joiningDate
                      ).toLocaleDateString()
                    : "-"}
                </td>

                {/* System Access */}
                <td>
                  {employee.hasSystemAccess ? "YES" : "NO"}
                </td>

                {/* Status */}
                <td>
                  <select
                    value={employee.status}
                    onChange={(e) =>
                      changeStatus(employee._id, e.target.value)
                    }
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="BLOCKED">BLOCKED</option>
                    <option value="DELETED">DELETED</option>
                  </select>
                </td>

                {/* Actions */}
                <td>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      className="btn-edit"
                      onClick={() =>
                        navigate(
                          `/admin/edit-employee/${employee._id}`
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn-salary"
                      onClick={() =>
                        setSelectedSalaryEmployeeId(employee._id)
                      }
                    >
                      Salary
                    </button>
                  </div>

                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>

      {selectedSalaryEmployeeId && (
        <SalaryModal
          employeeId={selectedSalaryEmployeeId}
          onClose={() => setSelectedSalaryEmployeeId(null)}
        />
      )}

    </div>
  );
}

export default EmployeeList;