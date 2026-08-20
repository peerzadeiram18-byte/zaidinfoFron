// import React, {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import "./SalaryPage.css";

// import {
//   getAllSalaryData,
//   exportSalaryExcel,
// } from "../../../services/salary.api";

// import { toast } from "react-toastify";

// import SalaryModal from "./SalaryModal.jsx";

// const SalaryPage = () => {
//   const [employees, setEmployees] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");

//   const [selectedEmployeeId, setSelectedEmployeeId] =
//     useState(null);

//   // ==========================================
//   // LOAD SALARY DATA
//   // ==========================================

//   const loadSalaryData = async () => {
//     try {
//       setLoading(true);

//       const res = await getAllSalaryData();

//       console.log(
//         "Salary API Response:",
//         res
//       );

//       if (res?.success) {
//         setEmployees(
//           Array.isArray(res?.data)
//             ? res.data
//             : []
//         );

//         return;
//       }

//       setEmployees([]);

//       toast.error(
//         res?.message ||
//           "Unable to load salary data"
//       );
//     } catch (error) {
//       console.error(
//         "Salary loading error:",
//         error
//       );

//       const message =
//         error?.response?.data?.message ||
//         error?.response?.data?.error ||
//         error?.message ||
//         "Unable to load salary data";

//       toast.error(message);

//       setEmployees([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // INITIAL LOAD
//   // ==========================================

//   useEffect(() => {
//     loadSalaryData();
//   }, []);

//   // ==========================================
//   // FILTER EMPLOYEES
//   // ==========================================

//   const filteredEmployees = useMemo(() => {
//     const searchValue = search
//       .trim()
//       .toLowerCase();

//     if (!searchValue) {
//       return employees;
//     }

//     return employees.filter((item) => {
//       const employeeName = String(
//         item?.employeeName || ""
//       ).toLowerCase();

//       const email = String(
//         item?.email || ""
//       ).toLowerCase();

//       const department = String(
//         item?.department || ""
//       ).toLowerCase();

//       const designation = String(
//         item?.designation || ""
//       ).toLowerCase();

//       const employeeId = String(
//         item?.employeeId || ""
//       ).toLowerCase();

//       return (
//         employeeName.includes(searchValue) ||
//         email.includes(searchValue) ||
//         department.includes(searchValue) ||
//         designation.includes(searchValue) ||
//         employeeId.includes(searchValue)
//       );
//     });
//   }, [employees, search]);

//   // ==========================================
//   // SUMMARY
//   // ==========================================

//   const totalEmployees =
//     filteredEmployees.length;

//   const totalSalary =
//     filteredEmployees.reduce(
//       (sum, item) =>
//         sum +
//         Number(
//           item?.baseSalary || 0
//         ),
//       0
//     );

//   const totalPaid =
//     filteredEmployees.reduce(
//       (sum, item) =>
//         sum +
//         Number(
//           item?.totalPaidAmount || 0
//         ),
//       0
//     );

//   // ==========================================
//   // PRINT
//   // ==========================================

//   const printSalaryReport = () => {
//     window.print();
//   };

//   // ==========================================
//   // EXPORT EXCEL
//   // ==========================================

//   const handleExport = async () => {
//     try {
//       await exportSalaryExcel();

//       toast.success(
//         "Salary Excel exported successfully"
//       );
//     } catch (error) {
//       console.error(
//         "Excel export error:",
//         error
//       );

//       toast.error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Unable to export salary Excel"
//       );
//     }
//   };

//   // ==========================================
//   // LOADING
//   // ==========================================

//   if (loading) {
//     return (
//       <div className="salary-loading">
//         Loading Salary Details...
//       </div>
//     );
//   }

//   // ==========================================
//   // UI
//   // ==========================================

//   return (
//     <div className="salary-page">

//       {/* ======================================
//           HEADER
//       ====================================== */}

//       <div className="salary-header">

//         <div>
//           <h1>
//             Employee Salary Management
//           </h1>

//           <p>
//             Manage Salary Configuration,
//             Salary Payment,
//             History & Reports
//           </p>
//         </div>

//         <div className="salary-actions">

//           <button
//             type="button"
//             onClick={loadSalaryData}
//             className="refresh-btn"
//           >
//             Refresh
//           </button>

//           <button
//             type="button"
//             onClick={handleExport}
//             className="excel-btn"
//           >
//             Export Excel
//           </button>

//           <button
//             type="button"
//             onClick={printSalaryReport}
//             className="print-btn"
//           >
//             Print Report
//           </button>

//         </div>

//       </div>

//       {/* ======================================
//           SUMMARY CARDS
//       ====================================== */}

//       <div className="salary-cards">

//         <div className="salary-card2">

//           <span>
//             Total Employees
//           </span>

//           <h2>
//             {totalEmployees}
//           </h2>

//         </div>

//         <div className="salary-card">

//           <span>
//             Grand Salary
//           </span>

//           <h2>
//             ₹
//             {totalSalary.toLocaleString(
//               "en-IN"
//             )}
//           </h2>

//         </div>

//         <div className="salary-card">

//           <span>
//             Total Paid
//           </span>

//           <h2>
//             ₹
//             {totalPaid.toLocaleString(
//               "en-IN"
//             )}
//           </h2>

//         </div>

//       </div>

//       {/* ======================================
//           SEARCH
//       ====================================== */}

//       <div className="salary-search">

//         <input
//           type="text"
//           placeholder="Search Employee..."
//           value={search}
//           onChange={(event) =>
//             setSearch(event.target.value)
//           }
//         />

//       </div>

//       {/* ======================================
//           TABLE
//       ====================================== */}

//       <div className="overflow-x-auto bg-white rounded-lg shadow border">

//         <table className="min-w-full">

//           <thead className="bg-slate-800 text-white">

//             <tr>

//               <th className="px-4 py-3 text-left">
//                 Employee ID
//               </th>

//               <th className="px-4 py-3 text-left">
//                 Employee Name
//               </th>

//               <th className="px-4 py-3 text-left">
//                 Department
//               </th>

//               <th className="px-4 py-3 text-left">
//                 Designation
//               </th>

//               <th className="px-4 py-3 text-center">
//                 Salary
//               </th>

//               <th className="px-4 py-3 text-center">
//                 Type
//               </th>

//               <th className="px-4 py-3 text-center">
//                 Status
//               </th>

//               <th className="px-4 py-3 text-center">
//                 Action
//               </th>

//             </tr>

//           </thead>

//           <tbody>

//             {filteredEmployees.length === 0 ? (

//               <tr>

//                 <td
//                   colSpan="8"
//                   className="text-center py-10 text-gray-500"
//                 >
//                   No Employee Found
//                 </td>

//               </tr>

//             ) : (

//               filteredEmployees.map((emp) => (

//                 <tr
//                   key={emp?._id}
//                   className="border-b hover:bg-gray-50 transition"
//                 >

//                   {/* Employee ID */}

//                   <td className="px-4 py-3 font-semibold">
//                     {emp?.employeeId || "-"}
//                   </td>

//                   {/* Employee */}

//                   <td className="px-4 py-3">

//                     <div className="font-semibold">
//                       {emp?.employeeName || "-"}
//                     </div>

//                     <div className="text-xs text-gray-500">
//                       {emp?.email || "-"}
//                     </div>

//                   </td>

//                   {/* Department */}

//                   <td className="px-4 py-3">
//                     {emp?.department || "-"}
//                   </td>

//                   {/* Designation */}

//                   <td className="px-4 py-3">
//                     {emp?.designation || "-"}
//                   </td>

//                   {/* Salary */}

//                   <td className="px-4 py-3 text-center">

//                     <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">

//                       ₹
//                       {Number(
//                         emp?.baseSalary || 0
//                       ).toLocaleString(
//                         "en-IN"
//                       )}

//                     </span>

//                   </td>

//                   {/* Salary Type */}

//                   <td className="px-4 py-3 text-center">

//                     <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">

//                       {emp?.salaryType || "-"}

//                     </span>

//                   </td>

//                   {/* Status */}

//                   <td className="px-4 py-3 text-center">

//                     <span
//                       className={`
//                         px-3
//                         py-1
//                         rounded-full
//                         text-white
//                         text-xs
//                         font-semibold
//                         ${
//                           emp?.status ===
//                           "ACTIVE"
//                             ? "bg-green-600"
//                             : "bg-red-600"
//                         }
//                       `}
//                     >
//                       {emp?.status ||
//                         "UNKNOWN"}
//                     </span>

//                   </td>

//                   {/* Action */}

//                   <td className="px-4 py-3 text-center">

//                     <button
//                       type="button"
//                       onClick={() =>
//                         setSelectedEmployeeId(
//                           emp?._id
//                         )
//                       }
//                       className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
//                     >
//                       Pay / Manage
//                     </button>

//                   </td>

//                 </tr>

//               ))

//             )}

//           </tbody>

//         </table>

//       </div>

//       {/* ======================================
//           BOTTOM SUMMARY
//       ====================================== */}

//       <div className="mt-6 flex justify-between items-center bg-gray-100 p-5 rounded-lg">

//         <div>

//           <h3 className="text-lg font-bold">
//             Total Employees
//           </h3>

//           <p className="text-2xl text-blue-600">
//             {filteredEmployees.length}
//           </p>

//         </div>

//         <div className="text-right">

//           <h3 className="text-lg font-bold">
//             Grand Total Salary
//           </h3>

//           <p className="text-2xl text-green-600">

//             ₹
//             {filteredEmployees
//               .reduce(
//                 (sum, item) =>
//                   sum +
//                   Number(
//                     item?.baseSalary || 0
//                   ),
//                 0
//               )
//               .toLocaleString("en-IN")}

//           </p>

//         </div>

//       </div>

//       {/* ======================================
//           SALARY MODAL
//       ====================================== */}

//       {selectedEmployeeId && (

//         <SalaryModal
//           employeeId={selectedEmployeeId}
//           onClose={() => {
//             setSelectedEmployeeId(null);
//             loadSalaryData();
//           }}
//         />

//       )}

//     </div>
//   );
// };

// export default SalaryPage;


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

// ==========================================
// SMALL PRESENTATIONAL HELPERS (UI ONLY)
// ==========================================

const getInitials = (name) => {
  const value = String(name || "").trim();

  if (!value) return "-";

  const parts = value.split(/\s+/);

  const first = parts[0]?.[0] || "";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] || "" : "";

  return (first + second).toUpperCase();
};

const IconRefresh = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <polyline points="21 3 21 9 15 9" />
  </svg>
);

const IconExport = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 13h8M8 17h5" />
  </svg>
);

const IconPrint = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

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
      console.log("Date fetched successfully")
      console.log(typeof res)
      console.log(res)

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

  const pendingAmount = totalSalary - totalPaid;

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
        <span className="salary-loading-spinner" />
        Loading salary details...
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
            className="salary-btn salary-btn-ghost"
          >
            <IconRefresh />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="salary-btn salary-btn-ghost"
          >
            <IconExport />
            Export Excel
          </button>

          <button
            type="button"
            onClick={printSalaryReport}
            className="salary-btn salary-btn-primary"
          >
            <IconPrint />
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

        <div className="salary-card salary-card-accent">

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

        <IconSearch />

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

      <div className="salary-table-wrap">

        <table className="salary-table">

          <thead>

            <tr>

              <th>
                Employee ID
              </th>

              <th>
                Employee Name
              </th>

              <th>
                Department
              </th>

              <th>
                Designation
              </th>

              <th className="col-center">
                Salary
              </th>

              <th className="col-center">
                Type
              </th>

              <th className="col-center">
                Status
              </th>

              <th className="col-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredEmployees.length === 0 ? (

              <tr className="salary-empty-row">

                <td
                  colSpan="8"
                  className="salary-empty"
                >
                  No Employee Found
                </td>

              </tr>

            ) : (

              filteredEmployees.map((emp) => (

                <tr
                  key={emp?._id}
                >

                  {/* Employee ID */}

                  <td data-label="Employee ID" className="salary-id">
                    {emp?.employeeId || "-"}
                  </td>

                  {/* Employee */}

                  <td data-label="Employee Name">

                    <div className="salary-employee">

                      <span className="salary-avatar">
                        {getInitials(emp?.employeeName)}
                      </span>

                      <div>
                        <div className="salary-employee-name">
                          {emp?.employeeName || "-"}
                        </div>

                        <div className="salary-employee-email">
                          {emp?.email || "-"}
                        </div>
                      </div>

                    </div>

                  </td>

                  {/* Department */}

                  <td data-label="Department">
                    {emp?.department || "-"}
                  </td>

                  {/* Designation */}

                  <td data-label="Designation">
                    {emp?.designation || "-"}
                  </td>

                  {/* Salary */}

                  <td data-label="Salary" className="col-center">

                    <span className="salary-amount">
                      ₹
                      {Number(
                        emp?.baseSalary || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </td>

                  {/* Salary Type */}

                  <td data-label="Type" className="col-center">

                    <span className="salary-type-badge">
                      {emp?.salaryType || "-"}
                    </span>

                  </td>

                  {/* Status */}

                  <td data-label="Status" className="col-center">

                    <span
                      className={`salary-status ${
                        emp?.status === "ACTIVE"
                          ? "is-active"
                          : "is-inactive"
                      }`}
                    >
                      <span className="salary-status-dot" />
                      {emp?.status ||
                        "UNKNOWN"}
                    </span>

                  </td>

                  {/* Action */}

                  <td data-label="Action" className="col-center">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedEmployeeId(
                          emp?._id
                        )
                      }
                      className="salary-manage-btn"
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

      <div className="salary-footer">

        <div>

          <h3>
            Total Employees
          </h3>

          <p className="salary-footer-count">
            {filteredEmployees.length}
          </p>

        </div>

        <div className="salary-footer-total">

          <h3>
            Pending Amount
          </h3>

          <p className="salary-footer-amount">

            ₹
            {pendingAmount.toLocaleString("en-IN")}

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