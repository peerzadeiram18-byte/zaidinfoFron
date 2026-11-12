
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./EmployeeList.css";

import { updateEmployeeStatus } from "../../../services/authService";

import {
  getEmployees,
  deleteEmployee,
} from "../../../services/userService";

import SalaryModal from "../../../components/Admin/Salary/SalaryModal";

function EmployeeList() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [selectedSalaryEmployeeId, setSelectedSalaryEmployeeId] =
    useState(null);

  // =========================================
  // FETCH EMPLOYEES
  // =========================================

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getEmployees();

      const employeeData =
        res?.data?.data ??
        res?.data?.employees ??
        [];

      setEmployees(
        Array.isArray(employeeData) ? employeeData : []
      );
    } catch (error) {
      console.error("Fetch employees error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to fetch employees"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // =========================================
  // CHANGE EMPLOYEE STATUS
  // =========================================

  const changeStatus = async (id, status) => {
    try {
      setUpdatingStatusId(id);

      await updateEmployeeStatus(id, status);

      setEmployees((previous) =>
        previous.map((employee) =>
          employee._id === id
            ? { ...employee, status }
            : employee
        )
      );

      toast.success("Employee status updated successfully");
    } catch (error) {
      console.error("Status update error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to update employee status"
      );

      await fetchEmployees();
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // =========================================
  // EDIT EMPLOYEE
  // =========================================

  const handleEdit = (employeeId) => {
    if (!employeeId) {
      toast.error("Employee ID not found");
      return;
    }

    navigate(`/admin/edit-employee/${employeeId}`);
  };

  // =========================================
  // DELETE EMPLOYEE
  // =========================================

  const handleDelete = async (employee) => {
    if (!employee?._id) {
      toast.error("Employee ID not found");
      return;
    }

    const name = `${employee.firstName || ""} ${
      employee.lastName || ""
    }`.trim();

    const confirmed = window.confirm(
      `Delete "${name || "this employee"}"?\n\n` +
        "Employee list se hat jayega aur login access band ho jayega. " +
        "Salary history database mein safe rahegi."
    );

    if (!confirmed) return;

    try {
      setDeletingId(employee._id);

      await deleteEmployee(employee._id);

      setEmployees((previous) =>
        previous.filter(
          (item) => item._id !== employee._id
        )
      );

      toast.success("Employee deleted successfully");
    } catch (error) {
      console.error("Delete employee error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to delete employee"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================
  // GET EMPLOYEE NAME
  // =========================================

  const getEmployeeName = (employee) => {
    return (
      `${employee?.firstName || ""} ${
        employee?.lastName || ""
      }`.trim() ||
      employee?.name ||
      "-"
    );
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="employee-list-page">

      {/* PAGE HEADER */}
      <div className="employee-list-header">
        <div className="employee-heading">
          <h2>Employee List</h2>
          <p>
            Manage your employees, salary and system access.
          </p>
        </div>

        <div className="employee-header-actions">
          <span className="employee-total-count">
            Total Employees: {employees.length}
          </span>

          <button
            type="button"
            className="emp-refresh-btn"
            onClick={fetchEmployees}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* EMPLOYEE TABLE */}
      <div className="employee-table-container">
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
                <td colSpan={11} className="emp-state">
                  <div className="emp-loading">
                    <span className="emp-loader" />
                    Loading employees...
                  </div>
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={11} className="emp-state">
                  No Employee Found
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee._id}>

                  {/* EMPLOYEE ID */}
                  <td className="emp-id">
                    {employee.employeeId || "-"}
                  </td>

                  {/* NAME */}
                  <td className="emp-name">
                    {getEmployeeName(employee)}
                  </td>

                  {/* EMAIL */}
                  <td>{employee.email || "-"}</td>

                  {/* PHONE */}
                  <td>{employee.phone || "-"}</td>

                  {/* ROLE */}
                  <td>{employee.role || "-"}</td>

                  {/* DEPARTMENT */}
                  <td>{employee.department || "-"}</td>

                  {/* DESIGNATION */}
                  <td>{employee.designation || "-"}</td>

                  {/* JOINING DATE */}
                  <td>
                    {formatDate(
                      employee.salaryDetails?.joiningDate
                    )}
                  </td>

                  {/* SYSTEM ACCESS */}
                  <td>
                    <span
                      className={`emp-pill ${
                        employee.hasSystemAccess
                          ? "is-yes"
                          : "is-no"
                      }`}
                    >
                      {employee.hasSystemAccess ? "YES" : "NO"}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td>
                    <select
                      className={`emp-status-select status-${(
                        employee.status || "INACTIVE"
                      ).toLowerCase()}`}
                      value={employee.status || "INACTIVE"}
                      disabled={
                        updatingStatusId === employee._id ||
                        deletingId === employee._id
                      }
                      onChange={(e) =>
                        changeStatus(
                          employee._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="BLOCKED">BLOCKED</option>

                      {employee.status === "DELETED" && (
                        <option value="DELETED">
                          DELETED
                        </option>
                      )}
                    </select>

                    {updatingStatusId === employee._id && (
                      <span className="emp-status-saving">
                        Saving...
                      </span>
                    )}
                  </td>

                  {/* ACTION BUTTONS */}
                  <td>
                    <div className="emp-actions">

                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() =>
                          handleEdit(employee._id)
                        }
                        disabled={deletingId === employee._id}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn-salary"
                        onClick={() =>
                          setSelectedSalaryEmployeeId(
                            employee._id
                          )
                        }
                        disabled={deletingId === employee._id}
                      >
                        Salary
                      </button>

                      <button
                        type="button"
                        className="btn-delete"
                        disabled={
                          deletingId === employee._id
                        }
                        onClick={() =>
                          handleDelete(employee)
                        }
                      >
                        {deletingId === employee._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* SALARY MODAL */}
      {selectedSalaryEmployeeId && (
        <SalaryModal
          employeeId={selectedSalaryEmployeeId}
          onClose={() =>
            setSelectedSalaryEmployeeId(null)
          }
        />
      )}

    </div>
  );
}

export default EmployeeList;
