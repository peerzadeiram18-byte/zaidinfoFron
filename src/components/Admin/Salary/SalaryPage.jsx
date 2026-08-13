import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./SalaryPage.css";

import {
  getAllSalaryData,
  exportSalaryExcel,
} from "../../../services/salary.api";

import { toast } from "react-toastify";

import SalaryModal from "./SalaryModal.jsx";

const SalaryPage = () => {
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedEmployeeId, setSelectedEmployeeId] =
    useState(null);

  // ==========================================
  // LOAD SALARY DATA
  // ==========================================

  const loadSalaryData = async () => {
    try {
      setLoading(true);

      const res = await getAllSalaryData();

      console.log(
        "Salary API Response:",
        res
      );

      if (res?.success) {
        setEmployees(
          Array.isArray(res?.data)
            ? res.data
            : []
        );

        return;
      }

      setEmployees([]);

      toast.error(
        res?.message ||
          "Unable to load salary data"
      );
    } catch (error) {
      console.error(
        "Salary loading error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to load salary data";

      toast.error(message);

      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadSalaryData();
  }, []);

  // ==========================================
  // FILTER EMPLOYEES
  // ==========================================

  const filteredEmployees = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    if (!searchValue) {
      return employees;
    }

    return employees.filter((item) => {
      const employeeName = String(
        item?.employeeName || ""
      ).toLowerCase();

      const email = String(
        item?.email || ""
      ).toLowerCase();

      const department = String(
        item?.department || ""
      ).toLowerCase();

      const designation = String(
        item?.designation || ""
      ).toLowerCase();

      const employeeId = String(
        item?.employeeId || ""
      ).toLowerCase();

      return (
        employeeName.includes(searchValue) ||
        email.includes(searchValue) ||
        department.includes(searchValue) ||
        designation.includes(searchValue) ||
        employeeId.includes(searchValue)
      );
    });
  }, [employees, search]);

  // ==========================================
  // SUMMARY
  // ==========================================

  const totalEmployees =
    filteredEmployees.length;

  const totalSalary =
    filteredEmployees.reduce(
      (sum, item) =>
        sum +
        Number(
          item?.baseSalary || 0
        ),
      0
    );

  const totalPaid =
    filteredEmployees.reduce(
      (sum, item) =>
        sum +
        Number(
          item?.totalPaidAmount || 0
        ),
      0
    );

  // ==========================================
  // PRINT
  // ==========================================

  const printSalaryReport = () => {
    window.print();
  };

  // ==========================================
  // EXPORT EXCEL
  // ==========================================

  const handleExport = async () => {
    try {
      await exportSalaryExcel();

      toast.success(
        "Salary Excel exported successfully"
      );
    } catch (error) {
      console.error(
        "Excel export error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to export salary Excel"
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="salary-loading">
        Loading Salary Details...
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="salary-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="salary-header">

        <div>
          <h1>
            Employee Salary Management
          </h1>

          <p>
            Manage Salary Configuration,
            Salary Payment,
            History & Reports
          </p>
        </div>

        <div className="salary-actions">

          <button
            type="button"
            onClick={loadSalaryData}
            className="refresh-btn"
          >
            Refresh
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="excel-btn"
          >
            Export Excel
          </button>

          <button
            type="button"
            onClick={printSalaryReport}
            className="print-btn"
          >
            Print Report
          </button>

        </div>

      </div>

      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <div className="salary-cards">

        <div className="salary-card">

          <span>
            Total Employees
          </span>

          <h2>
            {totalEmployees}
          </h2>

        </div>

        <div className="salary-card">

          <span>
            Grand Salary
          </span>

          <h2>
            ₹
            {totalSalary.toLocaleString(
              "en-IN"
            )}
          </h2>

        </div>

        <div className="salary-card">

          <span>
            Total Paid
          </span>

          <h2>
            ₹
            {totalPaid.toLocaleString(
              "en-IN"
            )}
          </h2>

        </div>

      </div>

      {/* ======================================
          SEARCH
      ====================================== */}

      <div className="salary-search">

        <input
          type="text"
          placeholder="Search Employee..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

      </div>

      {/* ======================================
          TABLE
      ====================================== */}

      <div className="overflow-x-auto bg-white rounded-lg shadow border">

        <table className="min-w-full">

          <thead className="bg-slate-800 text-white">

            <tr>

              <th className="px-4 py-3 text-left">
                Employee ID
              </th>

              <th className="px-4 py-3 text-left">
                Employee Name
              </th>

              <th className="px-4 py-3 text-left">
                Department
              </th>

              <th className="px-4 py-3 text-left">
                Designation
              </th>

              <th className="px-4 py-3 text-center">
                Salary
              </th>

              <th className="px-4 py-3 text-center">
                Type
              </th>

              <th className="px-4 py-3 text-center">
                Status
              </th>

              <th className="px-4 py-3 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredEmployees.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  className="text-center py-10 text-gray-500"
                >
                  No Employee Found
                </td>

              </tr>

            ) : (

              filteredEmployees.map((emp) => (

                <tr
                  key={emp?._id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  {/* Employee ID */}

                  <td className="px-4 py-3 font-semibold">
                    {emp?.employeeId || "-"}
                  </td>

                  {/* Employee */}

                  <td className="px-4 py-3">

                    <div className="font-semibold">
                      {emp?.employeeName || "-"}
                    </div>

                    <div className="text-xs text-gray-500">
                      {emp?.email || "-"}
                    </div>

                  </td>

                  {/* Department */}

                  <td className="px-4 py-3">
                    {emp?.department || "-"}
                  </td>

                  {/* Designation */}

                  <td className="px-4 py-3">
                    {emp?.designation || "-"}
                  </td>

                  {/* Salary */}

                  <td className="px-4 py-3 text-center">

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">

                      ₹
                      {Number(
                        emp?.baseSalary || 0
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </span>

                  </td>

                  {/* Salary Type */}

                  <td className="px-4 py-3 text-center">

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">

                      {emp?.salaryType || "-"}

                    </span>

                  </td>

                  {/* Status */}

                  <td className="px-4 py-3 text-center">

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-white
                        text-xs
                        font-semibold
                        ${
                          emp?.status ===
                          "ACTIVE"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }
                      `}
                    >
                      {emp?.status ||
                        "UNKNOWN"}
                    </span>

                  </td>

                  {/* Action */}

                  <td className="px-4 py-3 text-center">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedEmployeeId(
                          emp?._id
                        )
                      }
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                    >
                      Pay / Manage
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* ======================================
          BOTTOM SUMMARY
      ====================================== */}

      <div className="mt-6 flex justify-between items-center bg-gray-100 p-5 rounded-lg">

        <div>

          <h3 className="text-lg font-bold">
            Total Employees
          </h3>

          <p className="text-2xl text-blue-600">
            {filteredEmployees.length}
          </p>

        </div>

        <div className="text-right">

          <h3 className="text-lg font-bold">
            Grand Total Salary
          </h3>

          <p className="text-2xl text-green-600">

            ₹
            {filteredEmployees
              .reduce(
                (sum, item) =>
                  sum +
                  Number(
                    item?.baseSalary || 0
                  ),
                0
              )
              .toLocaleString("en-IN")}

          </p>

        </div>

      </div>

      {/* ======================================
          SALARY MODAL
      ====================================== */}

      {selectedEmployeeId && (

        <SalaryModal
          employeeId={selectedEmployeeId}
          onClose={() => {
            setSelectedEmployeeId(null);
            loadSalaryData();
          }}
        />

      )}

    </div>
  );
};

export default SalaryPage;