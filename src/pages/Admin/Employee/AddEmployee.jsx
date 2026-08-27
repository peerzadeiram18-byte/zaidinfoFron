// // import { useState } from "react";
// // import { createEmployee } from "../../../services/authService";
// // import "./AddEmployee.css";

// // function AddEmployee() {

// //     const [employee, setEmployee] = useState({

// //         firstName: "",
// //         lastName: "",
// //         email: "",
// //         phone: "",
// //         password: "",

// //         role: "RECEPTIONIST",

// //         department: "FRONT_DESK",

// //         designation: "",

// //         joiningDate: ""

// //     });

// //     const handleChange = (e) => {

// //         setEmployee({

// //             ...employee,

// //             [e.target.name]: e.target.value

// //         });

// //     };

// //     const handleSubmit = async (e) => {

// //         e.preventDefault();

// //         try {

// //             const res = await createEmployee(employee);

// //             alert(res.data.message);

// //             setEmployee({

// //                 firstName: "",
// //                 lastName: "",
// //                 email: "",
// //                 phone: "",
// //                 password: "",

// //                 role: "RECEPTIONIST",

// //                 department: "FRONT_DESK",

// //                 designation: "",

// //                 joiningDate: ""

// //             });

// //         }

// //         catch (error) {

// //             alert(

// //                 error.response?.data?.message ||

// //                 "Unable To Create Employee"

// //             );

// //         }

// //     };

// //     return (

// //         <div className="add-employee-page">

// //             <div className="employee-box">

// //                 <h2>Create Employee</h2>

// //                 <form onSubmit={handleSubmit}>

// //                     <input
// //                         type="text"
// //                         name="firstName"
// //                         placeholder="First Name"
// //                         value={employee.firstName}
// //                         onChange={handleChange}
// //                         required
// //                     />

// //                     <input
// //                         type="text"
// //                         name="lastName"
// //                         placeholder="Last Name"
// //                         value={employee.lastName}
// //                         onChange={handleChange}
// //                         required
// //                     />

// //                     <input
// //                         type="email"
// //                         name="email"
// //                         placeholder="Email"
// //                         value={employee.email}
// //                         onChange={handleChange}
// //                         required
// //                     />

// //                     <input
// //                         type="text"
// //                         name="phone"
// //                         placeholder="Phone"
// //                         value={employee.phone}
// //                         onChange={handleChange}
// //                         required
// //                     />

// //                     <input
// //                         type="password"
// //                         name="password"
// //                         placeholder="Password"
// //                         value={employee.password}
// //                         onChange={handleChange}
// //                         required
// //                     />

// //                     <select
// //                         name="role"
// //                         value={employee.role}
// //                         onChange={handleChange}
// //                     >

// //                         <option value="RECEPTIONIST">
// //                             Receptionist
// //                         </option>

// //                         <option value="TECHNICIAN">
// //                             Technician
// //                         </option>

// //                         <option value="INVENTORY">
// //                             Inventory
// //                         </option>

// //                         <option value="ACCOUNTANT">
// //                             Accountant
// //                         </option>

// //                     </select>

// //                     <select
// //                         name="department"
// //                         value={employee.department}
// //                         onChange={handleChange}
// //                     >

// //                         <option value="FRONT_DESK">
// //                             Front Desk
// //                         </option>

// //                         <option value="REPAIR">
// //                             Repair
// //                         </option>

// //                         <option value="INVENTORY">
// //                             Inventory
// //                         </option>

// //                         <option value="ACCOUNTS">
// //                             Accounts
// //                         </option>

// //                         <option value="ADMINISTRATION">
// //                             Administration
// //                         </option>

// //                     </select>

// //                     <input
// //                         type="text"
// //                         name="designation"
// //                         placeholder="Designation"
// //                         value={employee.designation}
// //                         onChange={handleChange}
// //                         required
// //                     />

// //                     <label>

// //                         Joining Date

// //                     </label>

// //                     <input
// //                         type="date"
// //                         name="joiningDate"
// //                         value={employee.joiningDate}
// //                         onChange={handleChange}
// //                         required
// //                     />

// //                     <button>

// //                         Create Employee

// //                     </button>

// //                 </form>

// //             </div>

// //         </div>

// //     );

// // }

// // export default AddEmployee;



// import { useState, useEffect } from "react";
// import { createEmployee } from "../../../services/authService";
// import "./AddEmployee.css";
// import { toast } from "react-toastify";

// function AddEmployee() {

//     const [employee, setEmployee] = useState({

//         hasSystemAccess: true,

//         firstName: "",
//         lastName: "",

//         email: "",
//         phone: "",
//         password: "",

//         role: "RECEPTIONIST",

//         department: "FRONT_DESK",

//         designation: "",

//         salaryType: "MONTHLY",
//         amount: "",
//         joiningDate: ""
//     });

//     const handleChange = (e) => {

//         const { name, value, type, checked } = e.target;

//         setEmployee((prev) => ({

//             ...prev,

//             [name]:
//                 type === "checkbox"
//                     ? checked
//                     : value

//         }));

//     };

//     const handleSubmit = async (e) => {

//         e.preventDefault();

//         const payload = {

//             hasSystemAccess: employee.hasSystemAccess,

//             firstName: employee.firstName,

//             lastName: employee.lastName,

//             phone: employee.phone,

//             designation: employee.designation,

//             department: employee.department,

//             salaryDetails: {

//                 salaryType: employee.salaryType,

//                 amount: Number(employee.amount),

//                 joiningDate: employee.joiningDate

//             }

//         };

//         // Only system users need login credentials

//         // if (employee.hasSystemAccess) {

//         //     payload.email = employee.email;

//         //     payload.password = employee.password;

//         //     payload.role = employee.role;

//         // }

// payload.email = employee.email;

// if (employee.hasSystemAccess) {

//     payload.password = employee.password;
//     payload.role = employee.role;

// }

//         try {

//             const res = await createEmployee(payload);

//             toast.error(res.data.message);

//             setEmployee({

//                 hasSystemAccess: true,

//                 firstName: "",
//                 lastName: "",

//                 email: "",
//                 phone: "",
//                 password: "",

//                 role: "RECEPTIONIST",

//                 department: "FRONT_DESK",

//                 designation: "",

//                 salaryType: "MONTHLY",

//                 amount: "",

//                 joiningDate: ""

//             });

//         }

//         catch (error) {

//             console.log(error.response);

//             toast.error(

//                 error.response?.data?.message ||

//                 "Unable To Create Employee"

//             );

//         }

//     };

//     useEffect(() => {
//     if (employee.hasSystemAccess) {
//         setEmployee((prev) => ({
//             ...prev,
//             department: "FRONT_DESK",
//         }));
//     } else {
//         setEmployee((prev) => ({
//             ...prev,
//             department: "OTHER",
//         }));
//     }
// }, [employee.hasSystemAccess]);

//     return (

//         <div className="add-employee-page">

//             <div className="employee-box">

//                 <h2>Create Employee</h2>

//                 <form onSubmit={handleSubmit}>


//                     <div className="form-row">

//                         <label>

//                             <input

//                                 type="checkbox"

//                                 name="hasSystemAccess"

//                                 checked={employee.hasSystemAccess}

//                                 onChange={handleChange}

//                             />

//                             &nbsp;Employee can Login

//                         </label>

//                     </div>


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

//                         type="text"

//                         name="phone"

//                         placeholder="Phone"

//                         value={employee.phone}

//                         onChange={handleChange}

//                         required

//                     />

//                     {/* {

//                         employee.hasSystemAccess &&

//                         <> */}

//                             <input

//                                 type="email"

//                                 name="email"

//                                 placeholder="Email"

//                                 value={employee.email}

//                                 onChange={handleChange}

//                                 required

//                             />
//                               {

//                         employee.hasSystemAccess &&

//                         <>

//                             <input

//                                 type="password"

//                                 name="password"

//                                 placeholder="Password"

//                                 value={employee.password}

//                                 onChange={handleChange}

//                                 required

//                             />

//                             <select

//                                 name="role"

//                                 value={employee.role}

//                                 onChange={handleChange}

//                             >

//                                 <option value="ADMIN">Admin</option>

//                                 <option value="RECEPTIONIST">Receptionist</option>

//                                 <option value="TECHNICIAN">Technician</option>

//                                 <option value="INVENTORY">Inventory</option>

//                                 <option value="ACCOUNTANT">Accountant</option>
                                 
//                                  <option value="OTHER">Other</option>
//                             </select>

//                         </>

//                     }

//                     {/* <select

//                         name="department"

//                         value={employee.department}

//                         onChange={handleChange}

//                     >

//                         <option value="ADMINISTRATION">Administration</option>

//                         <option value="FRONT_DESK">Front Desk</option>

//                         <option value="REPAIR">Repair</option>

//                         <option value="INVENTORY">Inventory</option>

//                         <option value="ACCOUNTS">Accounts</option>

//                     </select> */}


//    <select
//     name="department"
//     value={employee.department}
//     onChange={handleChange}
// >
//     {employee.hasSystemAccess ? (
//         <>
//             <option value="ADMINISTRATION">Administration</option>
//             <option value="FRONT_DESK">Front Desk</option>
//             <option value="REPAIR">Repair</option>
//             <option value="INVENTORY">Inventory</option>
//             <option value="ACCOUNTS">Accounts</option>
//         </>
//     ) : (
//         <option value="OTHER">Other</option>
//     )}
// </select>

//                     <input

//                         type="text"

//                         name="designation"

//                         placeholder="Designation"

//                         value={employee.designation}

//                         onChange={handleChange}

//                         required

//                     />

//                     <select

//                         name="salaryType"

//                         value={employee.salaryType}

//                         onChange={handleChange}

//                     >

//                         <option value="MONTHLY">

//                             Monthly

//                         </option>

//                         <option value="DAILY">

//                             Daily

//                         </option>

//                     </select>

//                     <input

//                         type="number"

//                         name="amount"

//                         placeholder="Salary Amount"

//                         value={employee.amount}

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

//                     <button type="submit">

//                         Create Employee

//                     </button>

//                 </form>

//             </div>

//         </div>

//     );

// }

// export default AddEmployee;






import { useState, useEffect } from "react";
import { createEmployee } from "../../../services/authService";
import { getShifts } from "../../../services/shiftService";
import "./AddEmployee.css";
import { toast } from "react-toastify";


const DEFAULT_SHIFTS = [
    { _id: "650000000000000000000001", name: "Morning Shift", startTime: "09:00 AM", endTime: "05:00 PM" },
    { _id: "650000000000000000000002", name: "Evening Shift", startTime: "02:00 PM", endTime: "10:00 PM" },
    { _id: "650000000000000000000003", name: "Night Shift", startTime: "10:00 PM", endTime: "06:00 AM" }
];

function AddEmployee() {
    const [shifts, setShifts] = useState([]);

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
        joiningDate: "",
        biometricId: "",
        shift: ""
    });

    // Fetch available shifts from backend
    useEffect(() => {
        const fetchShifts = async () => {
            try {
                const res = await getShifts();
                const shiftList = res.data?.data || res.data || [];
                setShifts(shiftList);
            } catch (error) {
                console.error("Failed to fetch shifts:", error);
            }
        };
        fetchShifts();
    }, []);

    // Use backend shifts if present; otherwise, use default fallback shifts
    const availableShifts = shifts.length > 0 ? shifts : DEFAULT_SHIFTS;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEmployee((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
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
            },
            email: employee.email,
            biometricId: employee.biometricId ? String(employee.biometricId) : undefined,
            // ✅ FIXED: Only attach shift if a valid non-empty ID is selected
            shift: employee.shift ? employee.shift : null
        };

        if (employee.hasSystemAccess) {
            payload.password = employee.password;
            payload.role = employee.role;
        }

        try {
            const res = await createEmployee(payload);
            toast.success(res.data?.message || "Employee created successfully!");

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
                joiningDate: "",
                biometricId: "",
                shift: ""
            });
        } catch (error) {
            console.error("Error creating employee:", error.response);
            toast.error(
                error.response?.data?.message || "Unable To Create Employee"
            );
        }
    };

    useEffect(() => {
        if (employee.hasSystemAccess) {
            setEmployee((prev) => ({
                ...prev,
                department: "FRONT_DESK"
            }));
        } else {
            setEmployee((prev) => ({
                ...prev,
                department: "OTHER"
            }));
        }
    }, [employee.hasSystemAccess]);

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

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={employee.email}
                        onChange={handleChange}
                        required
                    />

                    {employee.hasSystemAccess && (
                        <>
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
                                <option value="RECEPTIONIST">Sales </option>
                                <option value="TECHNICIAN">Technician</option>
                                <option value="INVENTORY">Inventory</option>
                                <option value="ACCOUNTANT">Accountant</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </>
                    )}

                    <select
                        name="department"
                        value={employee.department}
                        onChange={handleChange}
                    >
                        {employee.hasSystemAccess ? (
                            <>
                                <option value="ADMINISTRATION">Administration</option>
                                <option value="FRONT_DESK">Front Desk</option>
                                <option value="REPAIR">Repair</option>
                                <option value="INVENTORY">Inventory</option>
                                <option value="ACCOUNTS">Accounts</option>
                            </>
                        ) : (
                            <option value="OTHER">Other</option>
                        )}
                    </select>

                    <input
                        type="text"
                        name="designation"
                        placeholder="Designation"
                        value={employee.designation}
                        onChange={handleChange}
                        required
                    />

                    {/* Biometric ID Input */}
                    <input
                        type="number"
                        name="biometricId"
                        placeholder="Biometric ID"
                        value={employee.biometricId}
                        onChange={handleChange}
                    />

                    {/* Shift Selection */}
                    <select
                        name="shift"
                        value={employee.shift}
                        onChange={handleChange}
                    >
                        <option value="">Select Shift Time</option>
                        {availableShifts.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.name || "Shift"} ({s.startTime} - {s.endTime})
                            </option>
                        ))}
                    </select>

                    <select
                        name="salaryType"
                        value={employee.salaryType}
                        onChange={handleChange}
                    >
                        <option value="MONTHLY">Monthly</option>
                        <option value="DAILY">Daily</option>
                    </select>

                    <input
                        type="number"
                        name="amount"
                        placeholder="Salary Amount"
                        value={employee.amount}
                        onChange={handleChange}
                        required
                    />

                    <label>Joining Date</label>
                    <input
                        type="date"
                        name="joiningDate"
                        value={employee.joiningDate}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">Create Employee</button>
                </form>
            </div>
        </div>
    );
}

export default AddEmployee;
