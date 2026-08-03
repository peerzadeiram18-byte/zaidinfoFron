import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "EMPLOYEE",
    department: "",
    designation: "",
    status: "ACTIVE",
    salaryDetails: {
      salaryType: "MONTHLY",
      amount: 0,
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const emp = res.data.data;
      setFormData({
        firstName: emp.firstName || "",
        lastName: emp.lastName || "",
        email: emp.email || "",
        phone: emp.phone || "",
        role: emp.role || "EMPLOYEE",
        department: emp.department || "",
        designation: emp.designation || "",
        status: emp.status || "ACTIVE",
        salaryDetails: {
          salaryType: emp.salaryDetails?.salaryType || "MONTHLY",
          amount: emp.salaryDetails?.amount || 0,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch employee details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      salaryDetails: {
        ...prev.salaryDetails,
        [name]: name === "amount" ? Number(value) : value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/employee/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Employee updated successfully!");
      navigate("/admin/employees");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update employee");
    }
  };

  if (loading) return <div>Loading details...</div>;

  return (
    <div className="edit-employee-page" style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>

        <div>
          <label>Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
        </div>

        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div>
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </div>

        <div>
          <label>Department:</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} />
        </div>

        <div>
          <label>Designation:</label>
          <input type="text" name="designation" value={formData.designation} onChange={handleChange} />
        </div>

        <hr />
        <h3>Salary Details</h3>
        <div>
          <label>Salary Type:</label>
          <select name="salaryType" value={formData.salaryDetails.salaryType} onChange={handleSalaryChange}>
            <option value="MONTHLY">MONTHLY</option>
            <option value="DAILY">DAILY</option>
          </select>
        </div>

        <div>
          <label>Base Salary Amount (₹):</label>
          <input type="number" name="amount" value={formData.salaryDetails.amount} onChange={handleSalaryChange} />
        </div>

        <button type="submit" style={{ padding: "10px", backgroundColor: "#2563eb", color: "#fff", border: "none" }}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditEmployee;
