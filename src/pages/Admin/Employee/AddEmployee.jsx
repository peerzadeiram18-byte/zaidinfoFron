// // // import { useState } from "react";
// // // import { createEmployee } from "../../../services/authService";
// // // import "./AddEmployee.css";

// // // function AddEmployee() {

// // //     const [employee, setEmployee] = useState({

// // //         firstName: "",
// // //         lastName: "",
// // //         email: "",
// // //         phone: "",
// // //         password: "",

// // //         role: "RECEPTIONIST",

// // //         department: "FRONT_DESK",

// // //         designation: "",

// // //         joiningDate: ""

// // //     });

// // //     const handleChange = (e) => {

// // //         setEmployee({

// // //             ...employee,

// // //             [e.target.name]: e.target.value

// // //         });

// // //     };

// // //     const handleSubmit = async (e) => {

// // //         e.preventDefault();

// // //         try {

// // //             const res = await createEmployee(employee);

// // //             alert(res.data.message);

// // //             setEmployee({

// // //                 firstName: "",
// // //                 lastName: "",
// // //                 email: "",
// // //                 phone: "",
// // //                 password: "",

// // //                 role: "RECEPTIONIST",

// // //                 department: "FRONT_DESK",

// // //                 designation: "",

// // //                 joiningDate: ""

// // //             });

// // //         }

// // //         catch (error) {

// // //             alert(

// // //                 error.response?.data?.message ||

// // //                 "Unable To Create Employee"

// // //             );

// // //         }

// // //     };

// // //     return (

// // //         <div className="add-employee-page">

// // //             <div className="employee-box">

// // //                 <h2>Create Employee</h2>

// // //                 <form onSubmit={handleSubmit}>

// // //                     <input
// // //                         type="text"
// // //                         name="firstName"
// // //                         placeholder="First Name"
// // //                         value={employee.firstName}
// // //                         onChange={handleChange}
// // //                         required
// // //                     />

// // //                     <input
// // //                         type="text"
// // //                         name="lastName"
// // //                         placeholder="Last Name"
// // //                         value={employee.lastName}
// // //                         onChange={handleChange}
// // //                         required
// // //                     />

// // //                     <input
// // //                         type="email"
// // //                         name="email"
// // //                         placeholder="Email"
// // //                         value={employee.email}
// // //                         onChange={handleChange}
// // //                         required
// // //                     />

// // //                     <input
// // //                         type="text"
// // //                         name="phone"
// // //                         placeholder="Phone"
// // //                         value={employee.phone}
// // //                         onChange={handleChange}
// // //                         required
// // //                     />

// // //                     <input
// // //                         type="password"
// // //                         name="password"
// // //                         placeholder="Password"
// // //                         value={employee.password}
// // //                         onChange={handleChange}
// // //                         required
// // //                     />

// // //                     <select
// // //                         name="role"
// // //                         value={employee.role}
// // //                         onChange={handleChange}
// // //                     >

// // //                         <option value="RECEPTIONIST">
// // //                             Receptionist
// // //                         </option>

// // //                         <option value="TECHNICIAN">
// // //                             Technician
// // //                         </option>

// // //                         <option value="INVENTORY">
// // //                             Inventory
// // //                         </option>

// // //                         <option value="ACCOUNTANT">
// // //                             Accountant
// // //                         </option>

// // //                     </select>

// // //                     <select
// // //                         name="department"
// // //                         value={employee.department}
// // //                         onChange={handleChange}
// // //                     >

// // //                         <option value="FRONT_DESK">
// // //                             Front Desk
// // //                         </option>

// // //                         <option value="REPAIR">
// // //                             Repair
// // //                         </option>

// // //                         <option value="INVENTORY">
// // //                             Inventory
// // //                         </option>

// // //                         <option value="ACCOUNTS">
// // //                             Accounts
// // //                         </option>

// // //                         <option value="ADMINISTRATION">
// // //                             Administration
// // //                         </option>

// // //                     </select>

// // //                     <input
// // //                         type="text"
// // //                         name="designation"
// // //                         placeholder="Designation"
// // //                         value={employee.designation}
// // //                         onChange={handleChange}
// // //                         required
// // //                     />

// // //                     <label>

// // //                         Joining Date

// // //                     </label>

// // //                     <input
// // //                         type="date"
// // //                         name="joiningDate"
// // //                         value={employee.joiningDate}
// // //                         onChange={handleChange}
// // //                         required
// // //                     />

// // //                     <button>

// // //                         Create Employee

// // //                     </button>

// // //                 </form>

// // //             </div>

// // //         </div>

// // //     );

// // // }

// // // export default AddEmployee;



// // import { useState, useEffect } from "react";
// // import { createEmployee } from "../../../services/authService";
// // import "./AddEmployee.css";
// // import { toast } from "react-toastify";

// // function AddEmployee() {

// //     const [employee, setEmployee] = useState({

// //         hasSystemAccess: true,

// //         firstName: "",
// //         lastName: "",

// //         email: "",
// //         phone: "",
// //         password: "",

// //         role: "RECEPTIONIST",

// //         department: "FRONT_DESK",

// //         designation: "",

// //         salaryType: "MONTHLY",
// //         amount: "",
// //         joiningDate: ""
// //     });

// //     const handleChange = (e) => {

// //         const { name, value, type, checked } = e.target;

// //         setEmployee((prev) => ({

// //             ...prev,

// //             [name]:
// //                 type === "checkbox"
// //                     ? checked
// //                     : value

// //         }));

// //     };

// //     const handleSubmit = async (e) => {

// //         e.preventDefault();

// //         const payload = {

// //             hasSystemAccess: employee.hasSystemAccess,

// //             firstName: employee.firstName,

// //             lastName: employee.lastName,

// //             phone: employee.phone,

// //             designation: employee.designation,

// //             department: employee.department,

// //             salaryDetails: {

// //                 salaryType: employee.salaryType,

// //                 amount: Number(employee.amount),

// //                 joiningDate: employee.joiningDate

// //             }

// //         };

// //         // Only system users need login credentials

// //         // if (employee.hasSystemAccess) {

// //         //     payload.email = employee.email;

// //         //     payload.password = employee.password;

// //         //     payload.role = employee.role;

// //         // }

// // payload.email = employee.email;

// // if (employee.hasSystemAccess) {

// //     payload.password = employee.password;
// //     payload.role = employee.role;

// // }

// //         try {

// //             const res = await createEmployee(payload);

// //             toast.error(res.data.message);

// //             setEmployee({

// //                 hasSystemAccess: true,

// //                 firstName: "",
// //                 lastName: "",

// //                 email: "",
// //                 phone: "",
// //                 password: "",

// //                 role: "RECEPTIONIST",

// //                 department: "FRONT_DESK",

// //                 designation: "",

// //                 salaryType: "MONTHLY",

// //                 amount: "",

// //                 joiningDate: ""

// //             });

// //         }

// //         catch (error) {

// //             console.log(error.response);

// //             toast.error(

// //                 error.response?.data?.message ||

// //                 "Unable To Create Employee"

// //             );

// //         }

// //     };

// //     useEffect(() => {
// //     if (employee.hasSystemAccess) {
// //         setEmployee((prev) => ({
// //             ...prev,
// //             department: "FRONT_DESK",
// //         }));
// //     } else {
// //         setEmployee((prev) => ({
// //             ...prev,
// //             department: "OTHER",
// //         }));
// //     }
// // }, [employee.hasSystemAccess]);

// //     return (

// //         <div className="add-employee-page">

// //             <div className="employee-box">

// //                 <h2>Create Employee</h2>

// //                 <form onSubmit={handleSubmit}>


// //                     <div className="form-row">

// //                         <label>

// //                             <input

// //                                 type="checkbox"

// //                                 name="hasSystemAccess"

// //                                 checked={employee.hasSystemAccess}

// //                                 onChange={handleChange}

// //                             />

// //                             &nbsp;Employee can Login

// //                         </label>

// //                     </div>


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

// //                         type="text"

// //                         name="phone"

// //                         placeholder="Phone"

// //                         value={employee.phone}

// //                         onChange={handleChange}

// //                         required

// //                     />

// //                     {/* {

// //                         employee.hasSystemAccess &&

// //                         <> */}

// //                             <input

// //                                 type="email"

// //                                 name="email"

// //                                 placeholder="Email"

// //                                 value={employee.email}

// //                                 onChange={handleChange}

// //                                 required

// //                             />
// //                               {

// //                         employee.hasSystemAccess &&

// //                         <>

// //                             <input

// //                                 type="password"

// //                                 name="password"

// //                                 placeholder="Password"

// //                                 value={employee.password}

// //                                 onChange={handleChange}

// //                                 required

// //                             />

// //                             <select

// //                                 name="role"

// //                                 value={employee.role}

// //                                 onChange={handleChange}

// //                             >

// //                                 <option value="ADMIN">Admin</option>

// //                                 <option value="RECEPTIONIST">Receptionist</option>

// //                                 <option value="TECHNICIAN">Technician</option>

// //                                 <option value="INVENTORY">Inventory</option>

// //                                 <option value="ACCOUNTANT">Accountant</option>
                                 
// //                                  <option value="OTHER">Other</option>
// //                             </select>

// //                         </>

// //                     }

// //                     {/* <select

// //                         name="department"

// //                         value={employee.department}

// //                         onChange={handleChange}

// //                     >

// //                         <option value="ADMINISTRATION">Administration</option>

// //                         <option value="FRONT_DESK">Front Desk</option>

// //                         <option value="REPAIR">Repair</option>

// //                         <option value="INVENTORY">Inventory</option>

// //                         <option value="ACCOUNTS">Accounts</option>

// //                     </select> */}


// //    <select
// //     name="department"
// //     value={employee.department}
// //     onChange={handleChange}
// // >
// //     {employee.hasSystemAccess ? (
// //         <>
// //             <option value="ADMINISTRATION">Administration</option>
// //             <option value="FRONT_DESK">Front Desk</option>
// //             <option value="REPAIR">Repair</option>
// //             <option value="INVENTORY">Inventory</option>
// //             <option value="ACCOUNTS">Accounts</option>
// //         </>
// //     ) : (
// //         <option value="OTHER">Other</option>
// //     )}
// // </select>

// //                     <input

// //                         type="text"

// //                         name="designation"

// //                         placeholder="Designation"

// //                         value={employee.designation}

// //                         onChange={handleChange}

// //                         required

// //                     />

// //                     <select

// //                         name="salaryType"

// //                         value={employee.salaryType}

// //                         onChange={handleChange}

// //                     >

// //                         <option value="MONTHLY">

// //                             Monthly

// //                         </option>

// //                         <option value="DAILY">

// //                             Daily

// //                         </option>

// //                     </select>

// //                     <input

// //                         type="number"

// //                         name="amount"

// //                         placeholder="Salary Amount"

// //                         value={employee.amount}

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

// //                     <button type="submit">

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
// import { getShifts } from "../../../services/shiftService";
// import "./AddEmployee.css";
// import { toast } from "react-toastify";


// const DEFAULT_SHIFTS = [
//     { _id: "650000000000000000000001", name: "Morning Shift", startTime: "09:00 AM", endTime: "05:00 PM" },
//     { _id: "650000000000000000000002", name: "Evening Shift", startTime: "02:00 PM", endTime: "10:00 PM" },
//     { _id: "650000000000000000000003", name: "Night Shift", startTime: "10:00 PM", endTime: "06:00 AM" }
// ];

// function AddEmployee() {
//     const [shifts, setShifts] = useState([]);

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
//         joiningDate: "",
//         biometricId: "",
//         shift: ""
//     });

//     // Fetch available shifts from backend
//     useEffect(() => {
//         const fetchShifts = async () => {
//             try {
//                 const res = await getShifts();
//                 const shiftList = res.data?.data || res.data || [];
//                 setShifts(shiftList);
//             } catch (error) {
//                 console.error("Failed to fetch shifts:", error);
//             }
//         };
//         fetchShifts();
//     }, []);

//     // Use backend shifts if present; otherwise, use default fallback shifts
//     const availableShifts = shifts.length > 0 ? shifts : DEFAULT_SHIFTS;

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setEmployee((prev) => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value
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
//             },
//             email: employee.email,
//             biometricId: employee.biometricId ? String(employee.biometricId) : undefined,
//             // ✅ FIXED: Only attach shift if a valid non-empty ID is selected
//             shift: employee.shift ? employee.shift : null
//         };

//         if (employee.hasSystemAccess) {
//             payload.password = employee.password;
//             payload.role = employee.role;
//         }

//         try {
//             const res = await createEmployee(payload);
//             toast.success(res.data?.message || "Employee created successfully!");

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
//                 joiningDate: "",
//                 biometricId: "",
//                 shift: ""
//             });
//         } catch (error) {
//             console.error("Error creating employee:", error.response);
//             toast.error(
//                 error.response?.data?.message || "Unable To Create Employee"
//             );
//         }
//     };

//     useEffect(() => {
//         if (employee.hasSystemAccess) {
//             setEmployee((prev) => ({
//                 ...prev,
//                 department: "FRONT_DESK"
//             }));
//         } else {
//             setEmployee((prev) => ({
//                 ...prev,
//                 department: "OTHER"
//             }));
//         }
//     }, [employee.hasSystemAccess]);

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

//                     <input
//                         type="email"
//                         name="email"
//                         placeholder="Email"
//                         value={employee.email}
//                         onChange={handleChange}
//                         required
//                     />

//                     {employee.hasSystemAccess && (
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
//                                 <option value="RECEPTIONIST">Sales </option>
//                                 <option value="TECHNICIAN">Technician</option>
//                                 <option value="INVENTORY">Inventory</option>
//                                 <option value="ACCOUNTANT">Accountant</option>
//                                 <option value="OTHER">Other</option>
//                             </select>
//                         </>
//                     )}

//                     <select
//                         name="department"
//                         value={employee.department}
//                         onChange={handleChange}
//                     >
//                         {employee.hasSystemAccess ? (
//                             <>
//                                 <option value="ADMINISTRATION">Administration</option>
//                                 <option value="FRONT_DESK">Front Desk</option>
//                                 <option value="REPAIR">Repair</option>
//                                 <option value="INVENTORY">Inventory</option>
//                                 <option value="ACCOUNTS">Accounts</option>
//                             </>
//                         ) : (
//                             <option value="OTHER">Other</option>
//                         )}
//                     </select>

//                     <input
//                         type="text"
//                         name="designation"
//                         placeholder="Designation"
//                         value={employee.designation}
//                         onChange={handleChange}
//                         required
//                     />

//                     {/* Biometric ID Input */}
//                     <input
//                         type="number"
//                         name="biometricId"
//                         placeholder="Biometric ID"
//                         value={employee.biometricId}
//                         onChange={handleChange}
//                     />

//                     {/* Shift Selection */}
//                     <select
//                         name="shift"
//                         value={employee.shift}
//                         onChange={handleChange}
//                     >
//                         <option value="">Select Shift Time</option>
//                         {availableShifts.map((s) => (
//                             <option key={s._id} value={s._id}>
//                                 {s.name || "Shift"} ({s.startTime} - {s.endTime})
//                             </option>
//                         ))}
//                     </select>

//                     <select
//                         name="salaryType"
//                         value={employee.salaryType}
//                         onChange={handleChange}
//                     >
//                         <option value="MONTHLY">Monthly</option>
//                         <option value="DAILY">Daily</option>
//                     </select>

//                     <input
//                         type="number"
//                         name="amount"
//                         placeholder="Salary Amount"
//                         value={employee.amount}
//                         onChange={handleChange}
//                         required
//                     />

//                     <label>Joining Date</label>
//                     <input
//                         type="date"
//                         name="joiningDate"
//                         value={employee.joiningDate}
//                         onChange={handleChange}
//                         required
//                     />

//                     <button type="submit">Create Employee</button>
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

// ======================================================
// DEFAULT SHIFTS
// ======================================================

const DEFAULT_SHIFTS = [
    {
        _id: "650000000000000000000001",
        name: "Morning Shift",
        startTime: "09:00 AM",
        endTime: "05:00 PM",
    },
    {
        _id: "650000000000000000000002",
        name: "Evening Shift",
        startTime: "02:00 PM",
        endTime: "10:00 PM",
    },
    {
        _id: "650000000000000000000003",
        name: "Night Shift",
        startTime: "10:00 PM",
        endTime: "06:00 AM",
    },
];

const EMPTY_EMPLOYEE = {
    hasSystemAccess: true,

    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",

    // IMPORTANT:
    // Backend schema has SALES, not RECEPTIONIST
    role: "SALES",

    department: "FRONT_DESK",
    designation: "",

    salaryType: "MONTHLY",
    amount: "",
    joiningDate: "",

    biometricId: "",
    shift: "",

    // ==================================================
    // BANK DETAILS
    // ==================================================

    bankDetails: {
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
        branchName: "",
        accountType: "SAVINGS",
    },
};

function AddEmployee() {
    const [shifts, setShifts] = useState([]);

    const [employee, setEmployee] = useState(EMPTY_EMPLOYEE);

    const [submitting, setSubmitting] = useState(false);

    // ======================================================
    // FETCH SHIFTS
    // ======================================================

    useEffect(() => {
        const fetchShifts = async () => {
            try {
                const res = await getShifts();

                const shiftList =
                    res?.data?.data ||
                    res?.data ||
                    [];

                setShifts(
                    Array.isArray(shiftList)
                        ? shiftList
                        : []
                );
            } catch (error) {
                console.error(
                    "Failed to fetch shifts:",
                    error
                );

                setShifts([]);
            }
        };

        fetchShifts();
    }, []);

    // ======================================================
    // AVAILABLE SHIFTS
    // ======================================================

    const availableShifts =
        shifts.length > 0
            ? shifts
            : DEFAULT_SHIFTS;

    // ======================================================
    // NORMAL INPUT CHANGE
    // ======================================================

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setEmployee((prev) => ({
            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    // ======================================================
    // BANK DETAILS CHANGE
    // ======================================================

    const handleBankChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setEmployee((prev) => ({
            ...prev,

            bankDetails: {
                ...prev.bankDetails,

                [name]:
                    name === "ifscCode"
                        ? value.toUpperCase()
                        : value,
            },
        }));
    };

    // ======================================================
    // VALIDATE BANK DETAILS
    // ======================================================

    const validateBankDetails = () => {
        const bank =
            employee.bankDetails;

        const hasAnyBankValue =
            bank.accountHolderName.trim() ||
            bank.accountNumber.trim() ||
            bank.ifscCode.trim() ||
            bank.bankName.trim() ||
            bank.branchName.trim();

        // If nothing entered, allow empty bank details
        if (!hasAnyBankValue) {
            return true;
        }

        if (!bank.accountHolderName.trim()) {
            toast.error(
                "Please enter account holder name"
            );
            return false;
        }

        if (!bank.accountNumber.trim()) {
            toast.error(
                "Please enter account number"
            );
            return false;
        }

        if (!bank.ifscCode.trim()) {
            toast.error(
                "Please enter IFSC code"
            );
            return false;
        }

        if (!bank.bankName.trim()) {
            toast.error(
                "Please enter bank name"
            );
            return false;
        }

        return true;
    };

    // ======================================================
    // SUBMIT
    // ======================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submitting) {
            return;
        }

        // ==================================================
        // BASIC VALIDATION
        // ==================================================

        if (!employee.firstName.trim()) {
            toast.error(
                "Please enter first name"
            );
            return;
        }

        if (!employee.lastName.trim()) {
            toast.error(
                "Please enter last name"
            );
            return;
        }

        if (!employee.phone.trim()) {
            toast.error(
                "Please enter phone number"
            );
            return;
        }

        if (!employee.email.trim()) {
            toast.error(
                "Please enter email"
            );
            return;
        }

        if (
            employee.hasSystemAccess &&
            !employee.password.trim()
        ) {
            toast.error(
                "Please enter password"
            );
            return;
        }

        if (!employee.designation.trim()) {
            toast.error(
                "Please enter designation"
            );
            return;
        }

        if (!employee.amount) {
            toast.error(
                "Please enter salary amount"
            );
            return;
        }

        if (!employee.joiningDate) {
            toast.error(
                "Please select joining date"
            );
            return;
        }

        // ==================================================
        // BANK VALIDATION
        // ==================================================

        if (!validateBankDetails()) {
            return;
        }

        // ==================================================
        // BANK DETAILS
        // ==================================================

        const bank = employee.bankDetails;

        const hasBankDetails =
            bank.accountHolderName.trim() ||
            bank.accountNumber.trim() ||
            bank.ifscCode.trim() ||
            bank.bankName.trim() ||
            bank.branchName.trim();

        // ==================================================
        // PAYLOAD
        // ==================================================

        const payload = {
            hasSystemAccess:
                employee.hasSystemAccess,

            firstName:
                employee.firstName.trim(),

            lastName:
                employee.lastName.trim(),

            phone:
                employee.phone.trim(),

            email:
                employee.email.trim(),

            designation:
                employee.designation.trim(),

            department:
                employee.department,

            salaryDetails: {
                salaryType:
                    employee.salaryType,

                amount:
                    Number(employee.amount),

                joiningDate:
                    employee.joiningDate,
            },

            biometricId:
                employee.biometricId
                    ? String(
                          employee.biometricId
                      )
                    : undefined,

            shift:
                employee.shift
                    ? employee.shift
                    : null,

            // ==================================================
            // BANK DETAILS
            // ==================================================
            //
            // Send bankDetails only when user entered something.
            // Otherwise backend defaults remain available.
            //
            ...(hasBankDetails
                ? {
                      bankDetails: {
                          accountHolderName:
                              bank.accountHolderName.trim(),

                          accountNumber:
                              bank.accountNumber.trim(),

                          ifscCode:
                              bank.ifscCode
                                  .trim()
                                  .toUpperCase(),

                          bankName:
                              bank.bankName.trim(),

                          branchName:
                              bank.branchName.trim(),

                          accountType:
                              bank.accountType ||
                              "SAVINGS",
                      },
                  }
                : {}),
        };

        // ==================================================
        // SYSTEM ACCESS
        // ==================================================

        if (
            employee.hasSystemAccess
        ) {
            payload.password =
                employee.password;

            // IMPORTANT:
            // SALES instead of RECEPTIONIST
            payload.role =
                employee.role;
        }

        // ==================================================
        // API CALL
        // ==================================================

        try {
            setSubmitting(true);

            console.log(
                "Create Employee Payload:",
                payload
            );

            const res =
                await createEmployee(
                    payload
                );

            toast.success(
                res?.data?.message ||
                    "Employee created successfully!"
            );

            // ==================================================
            // RESET FORM
            // ==================================================

            setEmployee({
                ...EMPTY_EMPLOYEE,

                bankDetails: {
                    accountHolderName: "",
                    accountNumber: "",
                    ifscCode: "",
                    bankName: "",
                    branchName: "",
                    accountType: "SAVINGS",
                },
            });

        } catch (error) {
            console.error(
                "Error creating employee:",
                error?.response ||
                    error
            );

            toast.error(
                error?.response?.data
                    ?.message ||
                    error?.response?.data
                        ?.error ||
                    "Unable To Create Employee"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ======================================================
    // SYSTEM ACCESS / DEPARTMENT
    // ======================================================

    useEffect(() => {
        setEmployee((prev) => ({
            ...prev,

            department:
                prev.hasSystemAccess
                    ? prev.department ===
                      "OTHER"
                        ? "FRONT_DESK"
                        : prev.department
                    : "OTHER",
        }));
    }, [
        employee.hasSystemAccess,
    ]);

    // ======================================================
    // UI
    // ======================================================

    return (
        <div className="add-employee-page">

            <div className="employee-box">

                <h2>
                    Create Employee
                </h2>

                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    {/* =========================================
                        SYSTEM ACCESS
                    ========================================= */}

                    <div className="form-row">

                        <label>

                            <input
                                type="checkbox"
                                name="hasSystemAccess"
                                checked={
                                    employee.hasSystemAccess
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            &nbsp;
                            Employee can Login

                        </label>

                    </div>

                    {/* =========================================
                        BASIC DETAILS
                    ========================================= */}

                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={
                            employee.firstName
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />

                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={
                            employee.lastName
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={
                            employee.phone
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={
                            employee.email
                        }
                        onChange={
                            handleChange
                        }
                        required={
                            employee.hasSystemAccess
                        }
                    />

                    {/* =========================================
                        LOGIN DETAILS
                    ========================================= */}

                    {employee.hasSystemAccess && (
                        <>

                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={
                                    employee.password
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                            {/* =================================
                                ROLE
                            ================================= */}

                            <label>
                                Role
                            </label>

                            <select
                                name="role"
                                value={
                                    employee.role
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="ADMIN">
                                    Admin
                                </option>

                                <option value="SALES">
                                    Sales
                                </option>

                                <option value="TECHNICIAN">
                                    Technician
                                </option>

                                <option value="INVENTORY">
                                    Inventory
                                </option>

                                <option value="ACCOUNTANT">
                                    Accountant
                                </option>

                                <option value="OTHER">
                                    Other
                                </option>

                            </select>

                        </>
                    )}

                    {/* =========================================
                        DEPARTMENT
                    ========================================= */}

                    <label>
                        Department
                    </label>

                    <select
                        name="department"
                        value={
                            employee.department
                        }
                        onChange={
                            handleChange
                        }
                    >

                        {employee.hasSystemAccess ? (
                            <>
                                <option value="ADMINISTRATION">
                                    Administration
                                </option>

                                <option value="FRONT_DESK">
                                    Front Desk
                                </option>

                                <option value="REPAIR">
                                    Repair
                                </option>

                                <option value="INVENTORY">
                                    Inventory
                                </option>

                                <option value="ACCOUNTS">
                                    Accounts
                                </option>
                            </>
                        ) : (
                            <option value="OTHER">
                                Other
                            </option>
                        )}

                    </select>

                    {/* =========================================
                        DESIGNATION
                    ========================================= */}

                    <input
                        type="text"
                        name="designation"
                        placeholder="Designation"
                        value={
                            employee.designation
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />

                    {/* =========================================
                        BIOMETRIC
                    ========================================= */}

                    <input
                        type="text"
                        name="biometricId"
                        placeholder="Biometric ID"
                        value={
                            employee.biometricId
                        }
                        onChange={
                            handleChange
                        }
                    />

                    {/* =========================================
                        SHIFT
                    ========================================= */}

                    <label>
                        Shift
                    </label>

                    <select
                        name="shift"
                        value={
                            employee.shift
                        }
                        onChange={
                            handleChange
                        }
                    >

                        <option value="">
                            Select Shift Time
                        </option>

                        {availableShifts.map(
                            (s) => (
                                <option
                                    key={
                                        s._id
                                    }
                                    value={
                                        s._id
                                    }
                                >
                                    {s.name ||
                                        "Shift"}{" "}
                                    (
                                    {
                                        s.startTime
                                    }{" "}
                                    -
                                    {
                                        s.endTime
                                    }
                                    )
                                </option>
                            )
                        )}

                    </select>

                    {/* =========================================
                        SALARY
                    ========================================= */}

                    <label>
                        Salary Type
                    </label>

                    <select
                        name="salaryType"
                        value={
                            employee.salaryType
                        }
                        onChange={
                            handleChange
                        }
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
                        value={
                            employee.amount
                        }
                        onChange={
                            handleChange
                        }
                        min="0"
                        required
                    />

                    <label>
                        Joining Date
                    </label>

                    <input
                        type="date"
                        name="joiningDate"
                        value={
                            employee.joiningDate
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />

                    {/* =========================================
                        BANK DETAILS
                    ========================================= */}

                    <div
                        className="bank-details-section"
                        style={{
                            marginTop:
                                "25px",
                            padding:
                                "20px",
                            border:
                                "1px solid #e5e7eb",
                            borderRadius:
                                "12px",
                            background:
                                "#f8fafc",
                        }}
                    >

                        <h3
                            style={{
                                marginBottom:
                                    "6px",
                            }}
                        >
                            Bank Details
                        </h3>

                        <p
                            style={{
                                marginTop:
                                    "0",
                                marginBottom:
                                    "18px",
                                color:
                                    "#64748b",
                                fontSize:
                                    "14px",
                            }}
                        >
                            Add employee bank
                            account details for
                            salary payment.
                        </p>

                        {/* Account Holder */}

                        <input
                            type="text"
                            name="accountHolderName"
                            placeholder="Account Holder Name"
                            value={
                                employee
                                    .bankDetails
                                    .accountHolderName
                            }
                            onChange={
                                handleBankChange
                            }
                        />

                        {/* Bank Name */}

                        <input
                            type="text"
                            name="bankName"
                            placeholder="Bank Name"
                            value={
                                employee
                                    .bankDetails
                                    .bankName
                            }
                            onChange={
                                handleBankChange
                            }
                        />

                        {/* Account Number */}

                        <input
                            type="text"
                            name="accountNumber"
                            placeholder="Account Number"
                            value={
                                employee
                                    .bankDetails
                                    .accountNumber
                            }
                            onChange={
                                handleBankChange
                            }
                            inputMode="numeric"
                        />

                        {/* IFSC */}

                        <input
                            type="text"
                            name="ifscCode"
                            placeholder="IFSC Code"
                            value={
                                employee
                                    .bankDetails
                                    .ifscCode
                            }
                            onChange={
                                handleBankChange
                            }
                            style={{
                                textTransform:
                                    "uppercase",
                            }}
                        />

                        {/* Branch */}

                        <input
                            type="text"
                            name="branchName"
                            placeholder="Branch Name"
                            value={
                                employee
                                    .bankDetails
                                    .branchName
                            }
                            onChange={
                                handleBankChange
                            }
                        />

                        {/* Account Type */}

                        <select
                            name="accountType"
                            value={
                                employee
                                    .bankDetails
                                    .accountType
                            }
                            onChange={
                                handleBankChange
                            }
                        >

                            <option value="SAVINGS">
                                Savings Account
                            </option>

                            <option value="CURRENT">
                                Current Account
                            </option>

                        </select>

                    </div>

                    {/* =========================================
                        SUBMIT
                    ========================================= */}

                    <button
                        type="submit"
                        disabled={
                            submitting
                        }
                        style={{
                            opacity:
                                submitting
                                    ? 0.7
                                    : 1,
                            cursor:
                                submitting
                                    ? "not-allowed"
                                    : "pointer",
                        }}
                    >
                        {submitting
                            ? "Creating Employee..."
                            : "Create Employee"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AddEmployee;