import { useState } from "react";
import { createEmployee } from "../../../services/authService";
import "./AddEmployee.css";

function AddEmployee() {

    const [employee, setEmployee] = useState({

        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",

        role: "RECEPTIONIST",

        department: "FRONT_DESK",

        designation: "",

        joiningDate: ""

    });

    const handleChange = (e) => {

        setEmployee({

            ...employee,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await createEmployee(employee);

            alert(res.data.message);

            setEmployee({

                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                password: "",

                role: "RECEPTIONIST",

                department: "FRONT_DESK",

                designation: "",

                joiningDate: ""

            });

        }

        catch (error) {

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
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={employee.email}
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

                        <option value="RECEPTIONIST">
                            Receptionist
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

                    </select>

                    <select
                        name="department"
                        value={employee.department}
                        onChange={handleChange}
                    >

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

                        <option value="ADMINISTRATION">
                            Administration
                        </option>

                    </select>

                    <input
                        type="text"
                        name="designation"
                        placeholder="Designation"
                        value={employee.designation}
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

                    <button>

                        Create Employee

                    </button>

                </form>

            </div>

        </div>

    );

}

export default AddEmployee;