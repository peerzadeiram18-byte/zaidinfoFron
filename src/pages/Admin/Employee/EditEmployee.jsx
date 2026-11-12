
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import "./EditEmployee.css";

const API = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "SALES",
  "TECHNICIAN",
  "INVENTORY",
  "IT_SUPPORT",
  "HR_EXECUTIVE",
  "CUSTOMER",
];

const DEPARTMENTS = [
  "ADMINISTRATION",
  "FRONT_DESK",
  "REPAIR",
  "IT_SUPPORT",
  "HR",
  "PROCUREMENT",
  "OFFICE_ASSISTANT",
  "CUSTOMER",
  "OTHER",
];

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "SALES",
  department: "OTHER",
  designation: "",
  status: "ACTIVE",
  hasSystemAccess: true,
  salaryDetails: {
    salaryType: "MONTHLY",
    amount: 0,
    joiningDate: "",
  },
};

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const formatDateForInput = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // FETCH EMPLOYEE DETAILS
  // GET /users/:id
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const fetchEmployeeDetails = async () => {
      if (!id) {
        toast.error("Employee ID is missing");
        navigate("/admin/employees");
        return;
      }

      try {
        setLoading(true);

        const res = await axios.get(
          `${API}/users/${id}`,
          {
            headers: getAuthHeaders(),
          }
        );

        const responseData = res?.data;

        const emp =
          responseData?.data?.user ||
          responseData?.data?.employee ||
          responseData?.data ||
          responseData?.user ||
          responseData?.employee ||
          responseData;

        if (!emp || !emp._id) {
          throw new Error("Employee details not found");
        }

        if (!isMounted) return;

        setFormData({
          firstName: emp.firstName || "",
          lastName: emp.lastName || "",
          email: emp.email || "",
          phone: emp.phone || "",
          role: emp.role || "SALES",
          department: emp.department || "OTHER",
          designation: emp.designation || "",
          status: emp.status || "ACTIVE",
          hasSystemAccess: emp.hasSystemAccess ?? true,

          salaryDetails: {
            salaryType:
              emp.salaryDetails?.salaryType || "MONTHLY",

            amount: emp.salaryDetails?.amount ?? 0,

            joiningDate: formatDateForInput(
              emp.salaryDetails?.joiningDate
            ),
          },
        });
      } catch (error) {
        console.error("FETCH EMPLOYEE ERROR:", error);

        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Failed to fetch employee details"
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEmployeeDetails();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE SYSTEM ACCESS
  // ==========================================

  const handleSystemAccessChange = (e) => {
    const checked = e.target.checked;

    setFormData((prev) => ({
      ...prev,
      hasSystemAccess: checked,
    }));
  };

  // ==========================================
  // HANDLE SALARY CHANGE
  // ==========================================

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      salaryDetails: {
        ...prev.salaryDetails,
        [name]: name === "amount" ? value : value,
      },
    }));
  };

  // ==========================================
  // FORM VALIDATION
  // ==========================================

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return false;
    }

    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      toast.error("Enter a valid 10 digit phone number");
      return false;
    }

    if (
      formData.hasSystemAccess &&
      !formData.email.trim()
    ) {
      toast.error("Email is required for system access");
      return false;
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      toast.error("Enter a valid email address");
      return false;
    }

    if (formData.hasSystemAccess && !formData.role) {
      toast.error("Please select employee role");
      return false;
    }

    if (
      formData.salaryDetails.amount === "" ||
      Number(formData.salaryDetails.amount) < 0
    ) {
      toast.error("Enter a valid salary amount");
      return false;
    }

    return true;
  };

  // ==========================================
  // UPDATE EMPLOYEE
  // PUT /users/:id
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        role: formData.role,
        department: formData.department,
        designation: formData.designation.trim(),
        status: formData.status,
        hasSystemAccess: formData.hasSystemAccess,

        salaryDetails: {
          salaryType: formData.salaryDetails.salaryType,
          amount: Number(formData.salaryDetails.amount),
          joiningDate:
            formData.salaryDetails.joiningDate || null,
        },
      };

      await axios.put(
        `${API}/users/${id}`,
        payload,
        {
          headers: getAuthHeaders(),
        }
      );

      toast.success("Employee updated successfully!");

      navigate("/admin/employees");
    } catch (error) {
      console.error("UPDATE EMPLOYEE ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to update employee"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="edit-employee-loading">
        <div className="edit-loader"></div>
        <p>Loading employee details...</p>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="edit-employee-page">
      <div className="edit-employee-box">

        {/* HEADER */}
        <div className="card-header">
          <div className="header-icon-box">
            <span className="header-icon">👤</span>
          </div>

          <div className="edit-header-content">
            <h2>Edit Employee</h2>
            <p>
              Update employee information and salary details
            </p>
          </div>

          <button
            type="button"
            className="edit-back-btn"
            onClick={() => navigate("/admin/employees")}
            disabled={saving}
          >
            Back to List
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* PERSONAL DETAILS */}
          <div className="edit-section">
            <h3>Personal Information</h3>

            <div className="form-grid">

              <div className="input-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  maxLength={30}
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  maxLength={30}
                  placeholder="Enter last name"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="10 digit mobile number"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="role">Role *</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required={formData.hasSystemAccess}
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  {DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {department.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="designation">Designation</label>
                <input
                  id="designation"
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Enter designation"
                />
              </div>

              <div className="input-group">
                <label htmlFor="status">Employee Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="BLOCKED">BLOCKED</option>
                </select>
              </div>

            </div>
          </div>

          {/* SYSTEM ACCESS */}
          <div className="edit-section">
            <h3>System Access</h3>

            <label className="system-access-toggle">
              <input
                type="checkbox"
                checked={formData.hasSystemAccess}
                onChange={handleSystemAccessChange}
              />

              <span className="system-access-checkmark"></span>

              <span className="system-access-text">
                <strong>Enable System Access</strong>
                <small>
                  Allow this employee to log in to the system.
                </small>
              </span>
            </label>
          </div>

          {/* SALARY DETAILS */}
          <div className="edit-section">
            <h3>Salary Details</h3>

            <div className="form-grid">

              <div className="input-group">
                <label htmlFor="salaryType">Salary Type</label>
                <select
                  id="salaryType"
                  name="salaryType"
                  value={formData.salaryDetails.salaryType}
                  onChange={handleSalaryChange}
                >
                  <option value="MONTHLY">MONTHLY</option>
                  <option value="DAILY">DAILY</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="amount">Salary Amount (₹)</label>
                <input
                  id="amount"
                  type="number"
                  name="amount"
                  min="0"
                  step="0.01"
                  value={formData.salaryDetails.amount}
                  onChange={handleSalaryChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="joiningDate">Joining Date</label>
                <input
                  id="joiningDate"
                  type="date"
                  name="joiningDate"
                  value={formData.salaryDetails.joiningDate}
                  onChange={handleSalaryChange}
                />
              </div>

            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="form-actions">

            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/admin/employees")}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-submit"
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Employee"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default EditEmployee;
