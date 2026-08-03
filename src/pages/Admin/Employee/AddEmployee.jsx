// import { useState } from "react";
// import { createEmployee } from "../../../services/authService";
// import "./AddEmployee.css";

// function AddEmployee() {

//     const [employee, setEmployee] = useState({

//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         password: "",

//         role: "RECEPTIONIST",

//         department: "FRONT_DESK",

//         designation: "",

//         joiningDate: ""

//     });

//     const handleChange = (e) => {

//         setEmployee({

//             ...employee,

//             [e.target.name]: e.target.value

//         });

//     };

//     const handleSubmit = async (e) => {

//         e.preventDefault();

//         try {

//             const res = await createEmployee(employee);

//             alert(res.data.message);

//             setEmployee({

//                 firstName: "",
//                 lastName: "",
//                 email: "",
//                 phone: "",
//                 password: "",

//                 role: "RECEPTIONIST",

//                 department: "FRONT_DESK",

//                 designation: "",

//                 joiningDate: ""

//             });

//         }

//         catch (error) {

//             alert(

//                 error.response?.data?.message ||

//                 "Unable To Create Employee"

//             );

//         }

//     };

//     return (

//         <div className="add-employee-page">

//             <div className="employee-box">

//                 <h2>Create Employee</h2>

//                 <form onSubmit={handleSubmit}>

//                     <input
//                         type="text"
//                         name="firstName"
//                         placeholder="First Name"
//                         value={employee.firstName}
//                         onChange={handleChange}
//                         required
//                     />

//                     <input
//                         type="text"
//                         name="lastName"
//                         placeholder="Last Name"
//                         value={employee.lastName}
//                         onChange={handleChange}
//                         required
//                     />

//                     <input
//                         type="email"
//                         name="email"
//                         placeholder="Email"
//                         value={employee.email}
//                         onChange={handleChange}
//                         required
//                     />

//                     <input
//                         type="text"
//                         name="phone"
//                         placeholder="Phone"
//                         value={employee.phone}
//                         onChange={handleChange}
//                         required
//                     />

//                     <input
//                         type="password"
//                         name="password"
//                         placeholder="Password"
//                         value={employee.password}
//                         onChange={handleChange}
//                         required
//                     />

//                     <select
//                         name="role"
//                         value={employee.role}
//                         onChange={handleChange}
//                     >

//                         <option value="RECEPTIONIST">
//                             Receptionist
//                         </option>

//                         <option value="TECHNICIAN">
//                             Technician
//                         </option>

//                         <option value="INVENTORY">
//                             Inventory
//                         </option>

//                         <option value="ACCOUNTANT">
//                             Accountant
//                         </option>

//                     </select>

//                     <select
//                         name="department"
//                         value={employee.department}
//                         onChange={handleChange}
//                     >

//                         <option value="FRONT_DESK">
//                             Front Desk
//                         </option>

//                         <option value="REPAIR">
//                             Repair
//                         </option>

//                         <option value="INVENTORY">
//                             Inventory
//                         </option>

//                         <option value="ACCOUNTS">
//                             Accounts
//                         </option>

//                         <option value="ADMINISTRATION">
//                             Administration
//                         </option>

//                     </select>

//                     <input
//                         type="text"
//                         name="designation"
//                         placeholder="Designation"
//                         value={employee.designation}
//                         onChange={handleChange}
//                         required
//                     />

//                     <label>

//                         Joining Date

//                     </label>

//                     <input
//                         type="date"
//                         name="joiningDate"
//                         value={employee.joiningDate}
//                         onChange={handleChange}
//                         required
//                     />

//                     <button>

//                         Create Employee

//                     </button>

//                 </form>

//             </div>

//         </div>

//     );

// }

// export default AddEmployee;



import { useState } from "react";
import { createEmployee } from "../../../services/authService";
import "./AddEmployee.css";

function AddEmployee() {

    const [employee, setEmployee] = useState({

        hasSystemAccess: true,

        firstName: "",
        lastName: "",

        email: "",
        phone: "",
        password: "",

        role: "RECEPTIONIST",

        department: "FRONT_DESK",

        designation: "",

        salaryType: "MONTHLY",
        amount: "",
        joiningDate: ""
    });

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setEmployee((prev) => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value

        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const payload = {

            hasSystemAccess: employee.hasSystemAccess,

            firstName: employee.firstName,

            lastName: employee.lastName,

            phone: employee.phone,

            designation: employee.designation,

            department: employee.department,

            salaryDetails: {

                salaryType: employee.salaryType,

                amount: Number(employee.amount),

                joiningDate: employee.joiningDate

            }

        };

        // Only system users need login credentials

        if (employee.hasSystemAccess) {

            payload.email = employee.email;

            payload.password = employee.password;

            payload.role = employee.role;

        }

        try {

            const res = await createEmployee(payload);

            alert(res.data.message);

            setEmployee({

                hasSystemAccess: true,

                firstName: "",
                lastName: "",

                email: "",
                phone: "",
                password: "",

                role: "RECEPTIONIST",

                department: "FRONT_DESK",

                designation: "",

                salaryType: "MONTHLY",

                amount: "",

                joiningDate: ""

            });

        }

        catch (error) {

            console.log(error.response);

            alert(

                error.response?.data?.message ||

                "Unable To Create Employee"

            );

        }

    };

    return (

        <div className="add-employee-page">

            <div className="employee-box">

                <h2>Create Employee</h2>

                <form onSubmit={handleSubmit}>


                    <div className="form-row">

                        <label>

                            <input

                                type="checkbox"

                                name="hasSystemAccess"

                                checked={employee.hasSystemAccess}

                                onChange={handleChange}

                            />

                            &nbsp;Employee can Login

                        </label>

                    </div>


                    <input

                        type="text"

                        name="firstName"

                        placeholder="First Name"

                        value={employee.firstName}

                        onChange={handleChange}

                        required

                    />

                    <input

                        type="text"

                        name="lastName"

                        placeholder="Last Name"

                        value={employee.lastName}

                        onChange={handleChange}

                        required

                    />

                    <input

                        type="text"

                        name="phone"

                        placeholder="Phone"

                        value={employee.phone}

                        onChange={handleChange}

                        required

                    />

                    {

                        employee.hasSystemAccess &&

                        <>

                            <input

                                type="email"

                                name="email"

                                placeholder="Email"

                                value={employee.email}

                                onChange={handleChange}

                                required

                            />

                            <input

                                type="password"

                                name="password"

                                placeholder="Password"

                                value={employee.password}

                                onChange={handleChange}

                                required

                            />

                            <select

                                name="role"

                                value={employee.role}

                                onChange={handleChange}

                            >

                                <option value="ADMIN">Admin</option>

                                <option value="RECEPTIONIST">Receptionist</option>

                                <option value="TECHNICIAN">Technician</option>

                                <option value="INVENTORY">Inventory</option>

                                <option value="ACCOUNTANT">Accountant</option>

                            </select>

                        </>

                    }

                    <select

                        name="department"

                        value={employee.department}

                        onChange={handleChange}

                    >

                        <option value="ADMINISTRATION">Administration</option>

                        <option value="FRONT_DESK">Front Desk</option>

                        <option value="REPAIR">Repair</option>

                        <option value="INVENTORY">Inventory</option>

                        <option value="ACCOUNTS">Accounts</option>

                    </select>

                    <input

                        type="text"

                        name="designation"

                        placeholder="Designation"

                        value={employee.designation}

                        onChange={handleChange}

                        required

                    />

                    <select

                        name="salaryType"

                        value={employee.salaryType}

                        onChange={handleChange}

                    >

                        <option value="MONTHLY">

                            Monthly

                        </option>

                        <option value="DAILY">

                            Daily

                        </option>

                    </select>

                    <input

                        type="number"

                        name="amount"

                        placeholder="Salary Amount"

                        value={employee.amount}

                        onChange={handleChange}

                        required

                    />

                    <label>

                        Joining Date

                    </label>

                    <input

                        type="date"

                        name="joiningDate"

                        value={employee.joiningDate}

                        onChange={handleChange}

                        required

                    />

                    <button type="submit">

                        Create Employee

                    </button>

                </form>

            </div>

        </div>

    );

}

export default AddEmployee;
