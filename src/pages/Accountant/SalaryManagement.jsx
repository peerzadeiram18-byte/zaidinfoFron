// import React, {
//     useEffect,
//     useMemo,
//     useState,
// } from "react";

// import {
//     Search,
//     RefreshCw,
//     Download,
//     Printer,
//     Eye,
//     IndianRupee,
//     Users,
//     CheckCircle2,
//     Clock3,
//     X,
//     Wallet,
//     Building2,
//     Smartphone,
//     CreditCard,
//     CalendarDays,
//     UserRound,
//     BriefcaseBusiness,
//     FileText,
// } from "lucide-react";

// import { toast } from "react-toastify";

// import {
//     getAllSalaryData,
//     exportSalaryExcel,
// } from "../../services/salary.api";

// import "./SalaryManagement.css";

// // ======================================================
// // HELPERS
// // ======================================================

// const getEmployeeName = (employee) => {
//     if (employee?.employeeName) {
//         return employee.employeeName;
//     }

//     if (employee?.name) {
//         return employee.name;
//     }

//     const firstName =
//         employee?.firstName ||
//         employee?.user?.firstName ||
//         "";

//     const lastName =
//         employee?.lastName ||
//         employee?.user?.lastName ||
//         "";

//     return `${firstName} ${lastName}`.trim() || "Employee";
// };


// const getEmployeeId = (employee) => {
//     return (
//         employee?.employeeId ||
//         employee?.employeeCode ||
//         employee?.user?.employeeId ||
//         "-"
//     );
// };


// const getDepartment = (employee) => {
//     return (
//         employee?.department ||
//         employee?.departmentName ||
//         "-"
//     );
// };


// const getDesignation = (employee) => {
//     return (
//         employee?.designation ||
//         employee?.role ||
//         "-"
//     );
// };


// const getSalaryType = (employee) => {
//     return (
//         employee?.salaryType ||
//         employee?.salaryMode ||
//         "MONTHLY"
//     );
// };


// const getBaseSalary = (employee) => {
//     return Number(
//         employee?.baseSalary ||
//         employee?.monthlySalary ||
//         employee?.salary ||
//         0
//     );
// };


// const getPaidAmount = (employee) => {
//     return Number(
//         employee?.totalPaidAmount ||
//         employee?.paidAmount ||
//         0
//     );
// };


// const getPendingAmount = (employee) => {
//     const salary = getBaseSalary(employee);
//     const paid = getPaidAmount(employee);

//     return Math.max(
//         salary - paid,
//         0
//     );
// };


// const getStatus = (employee) => {
//     return String(
//         employee?.status ||
//         "ACTIVE"
//     ).toUpperCase();
// };


// const getInitials = (name) => {
//     const value = String(
//         name || ""
//     ).trim();

//     if (!value) {
//         return "E";
//     }

//     const parts =
//         value.split(/\s+/);

//     if (parts.length === 1) {
//         return parts[0]
//             .substring(0, 2)
//             .toUpperCase();
//     }

//     return (
//         `${parts[0][0] || ""}${
//             parts[parts.length - 1][0] || ""
//         }`
//     ).toUpperCase();
// };


// const formatMoney = (amount) => {
//     return new Intl.NumberFormat(
//         "en-IN",
//         {
//             style: "currency",
//             currency: "INR",
//             maximumFractionDigits: 2,
//         }
//     ).format(
//         Number(amount || 0)
//     );
// };


// // ======================================================
// // PAYMENT METHOD ICON
// // ======================================================

// const PaymentMethodIcon = ({
//     method,
// }) => {

//     const value = String(
//         method || ""
//     ).toUpperCase();

//     if (value.includes("CASH")) {
//         return <Wallet size={16} />;
//     }

//     if (
//         value.includes("BANK") ||
//         value.includes("NEFT") ||
//         value.includes("RTGS") ||
//         value.includes("IMPS")
//     ) {
//         return <Building2 size={16} />;
//     }

//     if (
//         value.includes("UPI") ||
//         value.includes("GPAY") ||
//         value.includes("PHONE")
//     ) {
//         return <Smartphone size={16} />;
//     }

//     return <CreditCard size={16} />;
// };


// // ======================================================
// // SUMMARY CARD
// // ======================================================

// const SummaryCard = ({
//     title,
//     value,
//     icon,
//     type = "",
// }) => {

//     return (
//         <div
//             className={`salary-summary-card ${
//                 type
//                     ? `salary-summary-${type}`
//                     : ""
//             }`}
//         >

//             <div className="salary-summary-content">

//                 <span className="salary-summary-title">
//                     {title}
//                 </span>

//                 <strong className="salary-summary-value">
//                     {value}
//                 </strong>

//             </div>

//             <div className="salary-summary-icon">
//                 {icon}
//             </div>

//         </div>
//     );
// };


// // ======================================================
// // MAIN COMPONENT
// // ======================================================

// const SalaryManagement = () => {

//     const [employees, setEmployees] =
//         useState([]);

//     const [loading, setLoading] =
//         useState(true);

//     const [search, setSearch] =
//         useState("");

//     const [statusFilter, setStatusFilter] =
//         useState("ALL");

//     const [departmentFilter, setDepartmentFilter] =
//         useState("ALL");

//     const [salaryTypeFilter, setSalaryTypeFilter] =
//         useState("ALL");

//     const [selectedEmployee, setSelectedEmployee] =
//         useState(null);

//     const [showDetails, setShowDetails] =
//         useState(false);


//     // ==================================================
//     // LOAD EMPLOYEES
//     // ==================================================

//     const loadSalaryData = async () => {

//         try {

//             setLoading(true);

//             const response =
//                 await getAllSalaryData();

//             console.log(
//                 "ACCOUNTANT SALARY RESPONSE:",
//                 response
//             );

//             let list = [];

//             if (
//                 Array.isArray(
//                     response?.data
//                 )
//             ) {

//                 list =
//                     response.data;

//             } else if (
//                 Array.isArray(response)
//             ) {

//                 list =
//                     response;

//             } else if (
//                 Array.isArray(
//                     response?.data?.data
//                 )
//             ) {

//                 list =
//                     response.data.data;

//             } else if (
//                 Array.isArray(
//                     response?.employees
//                 )
//             ) {

//                 list =
//                     response.employees;

//             }

//             setEmployees(list);

//         } catch (error) {

//             console.error(
//                 "ACCOUNTANT SALARY ERROR:",
//                 error
//             );

//             setEmployees([]);

//             toast.error(
//                 error?.response?.data?.message ||
//                 error?.response?.data?.error ||
//                 error?.message ||
//                 "Unable to load employee salary data"
//             );

//         } finally {

//             setLoading(false);

//         }
//     };


//     useEffect(() => {

//         loadSalaryData();

//     }, []);


//     // ==================================================
//     // DEPARTMENTS
//     // ==================================================

//     const departments = useMemo(() => {

//         const values =
//             employees
//                 .map(
//                     (employee) =>
//                         getDepartment(employee)
//                 )
//                 .filter(
//                     (value) =>
//                         value &&
//                         value !== "-"
//                 );

//         return [
//             ...new Set(values),
//         ];

//     }, [employees]);


//     // ==================================================
//     // SALARY TYPES
//     // ==================================================

//     const salaryTypes = useMemo(() => {

//         const values =
//             employees
//                 .map(
//                     (employee) =>
//                         getSalaryType(employee)
//                 )
//                 .filter(Boolean);

//         return [
//             ...new Set(values),
//         ];

//     }, [employees]);


//     // ==================================================
//     // FILTER
//     // ==================================================

//     const filteredEmployees =
//         useMemo(() => {

//             const keyword =
//                 search
//                     .trim()
//                     .toLowerCase();

//             return employees.filter(
//                 (employee) => {

//                     const name =
//                         getEmployeeName(
//                             employee
//                         ).toLowerCase();

//                     const employeeId =
//                         getEmployeeId(
//                             employee
//                         ).toLowerCase();

//                     const department =
//                         getDepartment(
//                             employee
//                         ).toLowerCase();

//                     const designation =
//                         getDesignation(
//                             employee
//                         ).toLowerCase();

//                     const salaryType =
//                         String(
//                             getSalaryType(
//                                 employee
//                             )
//                         ).toLowerCase();

//                     const status =
//                         getStatus(
//                             employee
//                         );


//                     const matchesSearch =
//                         !keyword ||
//                         name.includes(keyword) ||
//                         employeeId.includes(keyword) ||
//                         department.includes(keyword) ||
//                         designation.includes(keyword) ||
//                         salaryType.includes(keyword);


//                     const matchesStatus =
//                         statusFilter === "ALL" ||
//                         status === statusFilter;


//                     const matchesDepartment =
//                         departmentFilter === "ALL" ||
//                         getDepartment(employee) ===
//                             departmentFilter;


//                     const matchesSalaryType =
//                         salaryTypeFilter === "ALL" ||
//                         getSalaryType(employee) ===
//                             salaryTypeFilter;


//                     return (
//                         matchesSearch &&
//                         matchesStatus &&
//                         matchesDepartment &&
//                         matchesSalaryType
//                     );

//                 }
//             );

//         }, [
//             employees,
//             search,
//             statusFilter,
//             departmentFilter,
//             salaryTypeFilter,
//         ]);


//     // ==================================================
//     // SUMMARY
//     // ==================================================

//     const summary = useMemo(() => {

//         const totalEmployees =
//             employees.length;


//         const activeEmployees =
//             employees.filter(
//                 (employee) =>
//                     getStatus(employee) ===
//                     "ACTIVE"
//             ).length;


//         const totalSalary =
//             employees.reduce(
//                 (
//                     total,
//                     employee
//                 ) =>
//                     total +
//                     getBaseSalary(
//                         employee
//                     ),
//                 0
//             );


//         const totalPaid =
//             employees.reduce(
//                 (
//                     total,
//                     employee
//                 ) =>
//                     total +
//                     getPaidAmount(
//                         employee
//                     ),
//                 0
//             );


//         const totalPending =
//             employees.reduce(
//                 (
//                     total,
//                     employee
//                 ) =>
//                     total +
//                     getPendingAmount(
//                         employee
//                     ),
//                 0
//             );


//         return {
//             totalEmployees,
//             activeEmployees,
//             totalSalary,
//             totalPaid,
//             totalPending,
//         };

//     }, [employees]);


//     // ==================================================
//     // EXPORT
//     // ==================================================

//     const handleExport = async () => {

//         try {

//             await exportSalaryExcel();

//             toast.success(
//                 "Salary Excel exported successfully"
//             );

//         } catch (error) {

//             console.error(
//                 "SALARY EXPORT ERROR:",
//                 error
//             );

//             toast.error(
//                 error?.response?.data?.message ||
//                 "Unable to export salary Excel"
//             );

//         }
//     };


//     // ==================================================
//     // PRINT
//     // ==================================================

//     const handlePrint = () => {

//         window.print();

//     };


//     // ==================================================
//     // VIEW
//     // ==================================================

//     const handleView = (
//         employee
//     ) => {

//         setSelectedEmployee(
//             employee
//         );

//         setShowDetails(
//             true
//         );

//     };


//     // ==================================================
//     // MANAGE
//     // ==================================================

//     const handleManage = (
//         employee
//     ) => {

//         setSelectedEmployee(
//             employee
//         );

//         setShowDetails(
//             true
//         );

//     };


//     // ==================================================
//     // LOADING
//     // ==================================================

//     if (loading) {

//         return (

//             <div className="salary-management-page">

//                 <div className="salary-loading">

//                     <RefreshCw
//                         size={22}
//                         className="salary-spin"
//                     />

//                     <span>
//                         Loading employee salary data...
//                     </span>

//                 </div>

//             </div>

//         );

//     }


//     // ==================================================
//     // UI
//     // ==================================================

//     return (

//         <div className="salary-management-page">

//             {/* ==========================================
//                 HEADER
//             ========================================== */}

//             <div className="salary-management-header">

//                 <div>

//                     <div className="salary-title-row">

//                         <div className="salary-title-icon">
//                             <IndianRupee size={24} />
//                         </div>

//                         <div>

//                             <h1>
//                                 Employee Salary Management
//                             </h1>

//                             <p>
//                                 Manage employee salary,
//                                 payments, pending amounts
//                                 and salary records.
//                             </p>

//                         </div>

//                     </div>

//                 </div>


//                 <div className="salary-header-actions">

//                     <button
//                         type="button"
//                         onClick={
//                             loadSalaryData
//                         }
//                         className="salary-action-btn"
//                     >

//                         <RefreshCw
//                             size={16}
//                         />

//                         Refresh

//                     </button>


//                     <button
//                         type="button"
//                         onClick={
//                             handleExport
//                         }
//                         className="salary-action-btn"
//                     >

//                         <Download
//                             size={16}
//                         />

//                         Export Excel

//                     </button>


//                     <button
//                         type="button"
//                         onClick={
//                             handlePrint
//                         }
//                         className="salary-action-btn salary-print-btn"
//                     >

//                         <Printer
//                             size={16}
//                         />

//                         Print

//                     </button>

//                 </div>

//             </div>


//             {/* ==========================================
//                 SUMMARY
//             ========================================== */}

//             <div className="salary-summary-grid">

//                 <SummaryCard
//                     title="Total Employees"
//                     value={
//                         summary.totalEmployees
//                     }
//                     icon={
//                         <Users size={22} />
//                     }
//                 />


//                 <SummaryCard
//                     title="Active Employees"
//                     value={
//                         summary.activeEmployees
//                     }
//                     icon={
//                         <CheckCircle2
//                             size={22}
//                         />
//                     }
//                     type="green"
//                 />


//                 <SummaryCard
//                     title="Monthly Salary"
//                     value={
//                         formatMoney(
//                             summary.totalSalary
//                         )
//                     }
//                     icon={
//                         <IndianRupee
//                             size={22}
//                         />
//                     }
//                     type="blue"
//                 />


//                 <SummaryCard
//                     title="Total Paid"
//                     value={
//                         formatMoney(
//                             summary.totalPaid
//                         )
//                     }
//                     icon={
//                         <Wallet size={22} />
//                     }
//                     type="purple"
//                 />


//                 <SummaryCard
//                     title="Pending Salary"
//                     value={
//                         formatMoney(
//                             summary.totalPending
//                         )
//                     }
//                     icon={
//                         <Clock3 size={22} />
//                     }
//                     type="orange"
//                 />

//             </div>


//             {/* ==========================================
//                 FILTERS
//             ========================================== */}

//             <div className="salary-filter-box">

//                 <div className="salary-search-box">

//                     <Search size={18} />

//                     <input
//                         type="text"
//                         placeholder="Search employee, ID, department..."
//                         value={search}
//                         onChange={(event) =>
//                             setSearch(
//                                 event.target.value
//                             )
//                         }
//                     />

//                 </div>


//                 <select
//                     value={
//                         departmentFilter
//                     }
//                     onChange={(event) =>
//                         setDepartmentFilter(
//                             event.target.value
//                         )
//                     }
//                 >

//                     <option value="ALL">
//                         All Departments
//                     </option>

//                     {departments.map(
//                         (department) => (

//                             <option
//                                 key={
//                                     department
//                                 }
//                                 value={
//                                     department
//                                 }
//                             >
//                                 {department}
//                             </option>

//                         )
//                     )}

//                 </select>


//                 <select
//                     value={
//                         salaryTypeFilter
//                     }
//                     onChange={(event) =>
//                         setSalaryTypeFilter(
//                             event.target.value
//                         )
//                     }
//                 >

//                     <option value="ALL">
//                         All Salary Types
//                     </option>

//                     {salaryTypes.map(
//                         (type) => (

//                             <option
//                                 key={type}
//                                 value={type}
//                             >
//                                 {type}
//                             </option>

//                         )
//                     )}

//                 </select>


//                 <select
//                     value={
//                         statusFilter
//                     }
//                     onChange={(event) =>
//                         setStatusFilter(
//                             event.target.value
//                         )
//                     }
//                 >

//                     <option value="ALL">
//                         All Status
//                     </option>

//                     <option value="ACTIVE">
//                         Active
//                     </option>

//                     <option value="INACTIVE">
//                         Inactive
//                     </option>

//                     <option value="SUSPENDED">
//                         Suspended
//                     </option>

//                 </select>

//             </div>


//             {/* ==========================================
//                 TABLE
//             ========================================== */}

//             <div className="salary-table-card">

//                 <div className="salary-table-header">

//                     <div>

//                         <h2>
//                             Employee Salary Records
//                         </h2>

//                         <p>
//                             {filteredEmployees.length}
//                             {" "}
//                             employee(s) found
//                         </p>

//                     </div>

//                 </div>


//                 <div className="salary-table-scroll">

//                     <table className="salary-management-table">

//                         <thead>

//                             <tr>

//                                 <th>
//                                     Employee
//                                 </th>

//                                 <th>
//                                     Department
//                                 </th>

//                                 <th>
//                                     Designation
//                                 </th>

//                                 <th>
//                                     Salary Type
//                                 </th>

//                                 <th>
//                                     Monthly Salary
//                                 </th>

//                                 <th>
//                                     Paid
//                                 </th>

//                                 <th>
//                                     Pending
//                                 </th>

//                                 <th>
//                                     Status
//                                 </th>

//                                 <th>
//                                     Action
//                                 </th>

//                             </tr>

//                         </thead>


//                         <tbody>

//                             {filteredEmployees.length === 0 ? (

//                                 <tr>

//                                     <td
//                                         colSpan="9"
//                                         className="salary-empty"
//                                     >

//                                         <Users
//                                             size={36}
//                                         />

//                                         <strong>
//                                             No employees found
//                                         </strong>

//                                         <span>
//                                             Try changing your
//                                             search or filters.
//                                         </span>

//                                     </td>

//                                 </tr>

//                             ) : (

//                                 filteredEmployees.map(
//                                     (
//                                         employee
//                                     ) => {

//                                         const name =
//                                             getEmployeeName(
//                                                 employee
//                                             );

//                                         const salary =
//                                             getBaseSalary(
//                                                 employee
//                                             );

//                                         const paid =
//                                             getPaidAmount(
//                                                 employee
//                                             );

//                                         const pending =
//                                             getPendingAmount(
//                                                 employee
//                                             );

//                                         const status =
//                                             getStatus(
//                                                 employee
//                                             );

//                                         return (

//                                             <tr
//                                                 key={
//                                                     employee?._id ||
//                                                     getEmployeeId(
//                                                         employee
//                                                     )
//                                                 }
//                                             >

//                                                 {/* EMPLOYEE */}

//                                                 <td>

//                                                     <div className="salary-employee-cell">

//                                                         <div className="salary-avatar">
//                                                             {
//                                                                 getInitials(
//                                                                     name
//                                                                 )
//                                                             }
//                                                         </div>

//                                                         <div>

//                                                             <strong>
//                                                                 {
//                                                                     name
//                                                                 }
//                                                             </strong>

//                                                             <span>
//                                                                 ID:{" "}
//                                                                 {
//                                                                     getEmployeeId(
//                                                                         employee
//                                                                     )
//                                                                 }
//                                                             </span>

//                                                         </div>

//                                                     </div>

//                                                 </td>


//                                                 {/* DEPARTMENT */}

//                                                 <td>

//                                                     <div className="salary-info-cell">

//                                                         <BriefcaseBusiness
//                                                             size={15}
//                                                         />

//                                                         {
//                                                             getDepartment(
//                                                                 employee
//                                                             )
//                                                         }

//                                                     </div>

//                                                 </td>


//                                                 {/* DESIGNATION */}

//                                                 <td>

//                                                     {
//                                                         getDesignation(
//                                                             employee
//                                                         )
//                                                     }

//                                                 </td>


//                                                 {/* TYPE */}

//                                                 <td>

//                                                     <span className="salary-type-badge">

//                                                         {
//                                                             getSalaryType(
//                                                                 employee
//                                                             )
//                                                         }

//                                                     </span>

//                                                 </td>


//                                                 {/* SALARY */}

//                                                 <td>

//                                                     <strong className="salary-money">

//                                                         {
//                                                             formatMoney(
//                                                                 salary
//                                                             )
//                                                         }

//                                                     </strong>

//                                                 </td>


//                                                 {/* PAID */}

//                                                 <td>

//                                                     <span className="salary-paid">

//                                                         {
//                                                             formatMoney(
//                                                                 paid
//                                                             )
//                                                         }

//                                                     </span>

//                                                 </td>


//                                                 {/* PENDING */}

//                                                 <td>

//                                                     <span
//                                                         className={
//                                                             pending > 0
//                                                                 ? "salary-pending"
//                                                                 : "salary-cleared"
//                                                         }
//                                                     >

//                                                         {
//                                                             formatMoney(
//                                                                 pending
//                                                             )
//                                                         }

//                                                     </span>

//                                                 </td>


//                                                 {/* STATUS */}

//                                                 <td>

//                                                     <span
//                                                         className={`salary-status-badge ${
//                                                             status ===
//                                                             "ACTIVE"
//                                                                 ? "active"
//                                                                 : "inactive"
//                                                         }`}
//                                                     >

//                                                         <span />

//                                                         {
//                                                             status
//                                                         }

//                                                     </span>

//                                                 </td>


//                                                 {/* ACTION */}

//                                                 <td>

//                                                     <div className="salary-row-actions">

//                                                         <button
//                                                             type="button"
//                                                             title="View salary"
//                                                             onClick={() =>
//                                                                 handleView(
//                                                                     employee
//                                                                 )
//                                                             }
//                                                             className="salary-icon-btn"
//                                                         >

//                                                             <Eye
//                                                                 size={17}
//                                                             />

//                                                         </button>


//                                                         <button
//                                                             type="button"
//                                                             onClick={() =>
//                                                                 handleManage(
//                                                                     employee
//                                                                 )
//                                                             }
//                                                             className="salary-manage-btn"
//                                                         >

//                                                             <IndianRupee
//                                                                 size={15}
//                                                             />

//                                                             Pay / Manage

//                                                         </button>

//                                                     </div>

//                                                 </td>

//                                             </tr>

//                                         );

//                                     }
//                                 )

//                             )}

//                         </tbody>

//                     </table>

//                 </div>

//             </div>


//             {/* ==========================================
//                 FOOTER
//             ========================================== */}

//             <div className="salary-footer-summary">

//                 <div>

//                     <span>
//                         Showing
//                     </span>

//                     <strong>
//                         {filteredEmployees.length}
//                     </strong>

//                     <span>
//                         of
//                     </span>

//                     <strong>
//                         {employees.length}
//                     </strong>

//                     <span>
//                         employees
//                     </span>

//                 </div>


//                 <div className="salary-footer-pending">

//                     <span>
//                         Total Pending
//                     </span>

//                     <strong>
//                         {
//                             formatMoney(
//                                 summary.totalPending
//                             )
//                         }
//                     </strong>

//                 </div>

//             </div>


//             {/* ==========================================
//                 EMPLOYEE DETAILS MODAL
//             ========================================== */}

//             {
//                 showDetails &&
//                 selectedEmployee && (

//                     <SalaryEmployeeModal
//                         employee={
//                             selectedEmployee
//                         }
//                         onClose={() => {

//                             setShowDetails(
//                                 false
//                             );

//                             setSelectedEmployee(
//                                 null
//                             );

//                         }}
//                         onRefresh={
//                             loadSalaryData
//                         }
//                     />

//                 )
//             }

//         </div>
//     );
// };


// // ======================================================
// // EMPLOYEE SALARY MODAL
// // ======================================================

// const SalaryEmployeeModal = ({
//     employee,
//     onClose,
//     onRefresh,
// }) => {

//     const name =
//         getEmployeeName(
//             employee
//         );

//     const salary =
//         getBaseSalary(
//             employee
//         );

//     const paid =
//         getPaidAmount(
//             employee
//         );

//     const pending =
//         getPendingAmount(
//             employee
//         );


//     return (

//         <div className="salary-modal-overlay">

//             <div className="salary-modal">

//                 {/* HEADER */}

//                 <div className="salary-modal-header">

//                     <div>

//                         <h2>
//                             Salary Management
//                         </h2>

//                         <p>
//                             Employee salary details
//                         </p>

//                     </div>

//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="salary-modal-close"
//                     >

//                         <X size={20} />

//                     </button>

//                 </div>


//                 {/* EMPLOYEE */}

//                 <div className="salary-modal-employee">

//                     <div className="salary-modal-avatar">

//                         {
//                             getInitials(
//                                 name
//                             )
//                         }

//                     </div>

//                     <div>

//                         <h3>
//                             {name}
//                         </h3>

//                         <p>
//                             Employee ID:{" "}
//                             {
//                                 getEmployeeId(
//                                     employee
//                                 )
//                             }
//                         </p>

//                     </div>

//                 </div>


//                 {/* DETAILS */}

//                 <div className="salary-modal-grid">

//                     <SalaryDetail
//                         icon={
//                             <UserRound
//                                 size={17}
//                             />
//                         }
//                         label="Employee"
//                         value={name}
//                     />

//                     <SalaryDetail
//                         icon={
//                             <BriefcaseBusiness
//                                 size={17}
//                             />
//                         }
//                         label="Department"
//                         value={
//                             getDepartment(
//                                 employee
//                             )
//                         }
//                     />

//                     <SalaryDetail
//                         icon={
//                             <FileText
//                                 size={17}
//                             />
//                         }
//                         label="Designation"
//                         value={
//                             getDesignation(
//                                 employee
//                             )
//                         }
//                     />

//                     <SalaryDetail
//                         icon={
//                             <CalendarDays
//                                 size={17}
//                             />
//                         }
//                         label="Salary Type"
//                         value={
//                             getSalaryType(
//                                 employee
//                             )
//                         }
//                     />

//                 </div>


//                 {/* MONEY */}

//                 <div className="salary-modal-money-grid">

//                     <div>

//                         <span>
//                             Monthly Salary
//                         </span>

//                         <strong>
//                             {
//                                 formatMoney(
//                                     salary
//                                 )
//                             }
//                         </strong>

//                     </div>


//                     <div className="paid-box">

//                         <span>
//                             Paid
//                         </span>

//                         <strong>
//                             {
//                                 formatMoney(
//                                     paid
//                                 )
//                             }
//                         </strong>

//                     </div>


//                     <div className="pending-box">

//                         <span>
//                             Pending
//                         </span>

//                         <strong>
//                             {
//                                 formatMoney(
//                                     pending
//                                 )
//                             }
//                         </strong>

//                     </div>

//                 </div>


//                 {/* PAYMENT INFO */}

//                 <div className="salary-modal-section">

//                     <h3>
//                         Salary Payment
//                     </h3>

//                     <p>
//                         Use your existing salary
//                         payment workflow here.
//                     </p>

//                     <div className="salary-payment-placeholder">

//                         <PaymentMethodIcon
//                             method={
//                                 employee?.paymentMethod
//                             }
//                         />

//                         <div>

//                             <strong>
//                                 {
//                                     employee?.paymentMethod ||
//                                     "Payment Method Not Available"
//                                 }
//                             </strong>

//                             <span>
//                                 {
//                                     employee?.lastPaymentDate
//                                         ? `Last payment: ${employee.lastPaymentDate}`
//                                         : "No last payment information"
//                                 }
//                             </span>

//                         </div>

//                     </div>

//                 </div>


//                 {/* ACTIONS */}

//                 <div className="salary-modal-actions">

//                     <button
//                         type="button"
//                         onClick={onClose}
//                         className="salary-modal-cancel"
//                     >
//                         Close
//                     </button>

//                     <button
//                         type="button"
//                         onClick={() => {

//                             /*
//                              * IMPORTANT:
//                              *
//                              * If you already have SalaryModal.jsx
//                              * from HR page, open that component
//                              * here instead of creating another
//                              * payment system.
//                              *
//                              * For now we refresh the salary list.
//                              */

//                             onRefresh();

//                             toast.info(
//                                 "Open the HR salary payment modal here to record payment."
//                             );

//                         }}
//                         className="salary-modal-pay"
//                     >

//                         <IndianRupee
//                             size={16}
//                         />

//                         Pay Salary

//                     </button>

//                 </div>

//             </div>

//         </div>

//     );
// };


// // ======================================================
// // DETAIL
// // ======================================================

// const SalaryDetail = ({
//     icon,
//     label,
//     value,
// }) => {

//     return (

//         <div className="salary-detail-box">

//             <div className="salary-detail-icon">
//                 {icon}
//             </div>

//             <div>

//                 <span>
//                     {label}
//                 </span>

//                 <strong>
//                     {value || "-"}
//                 </strong>

//             </div>

//         </div>

//     );
// };


// export default SalaryManagement;


import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Search,
    RefreshCw,
    Download,
    Printer,
    Eye,
    IndianRupee,
    Users,
    CheckCircle2,
    Clock3,
    X,
    Wallet,
    Building2,
    Smartphone,
    CreditCard,
    CalendarDays,
    UserRound,
    BriefcaseBusiness,
    FileText,
} from "lucide-react";

import { toast } from "react-toastify";

import {
    getAllSalaryData,
    exportSalaryExcel,
} from "../../services/salary.api";

import "./SalaryManagement.css";


// ======================================================
// HELPERS
// ======================================================

const cleanString = (value) => {
    return String(
        value ?? ""
    )
        .trim()
        .toUpperCase();
};


// ======================================================
// GET EMPLOYEE NAME
// ======================================================

const getEmployeeName = (employee) => {

    if (employee?.employeeName) {
        return employee.employeeName;
    }

    if (employee?.name) {
        return employee.name;
    }

    const firstName =
        employee?.firstName ||
        employee?.user?.firstName ||
        "";

    const lastName =
        employee?.lastName ||
        employee?.user?.lastName ||
        "";

    return (
        `${firstName} ${lastName}`.trim() ||
        "Employee"
    );
};


// ======================================================
// GET EMPLOYEE ID
// ======================================================

const getEmployeeId = (employee) => {

    return (
        employee?.employeeId ||
        employee?.employeeCode ||
        employee?.staffId ||
        employee?.staffCode ||
        employee?.user?.employeeId ||
        employee?.user?.employeeCode ||
        employee?.user?.staffId ||
        employee?.user?.staffCode ||
        "-"
    );
};


// ======================================================
// GET DEPARTMENT
// ======================================================

const getDepartment = (employee) => {

    return (
        employee?.department ||
        employee?.departmentName ||
        employee?.employeeDepartment ||
        employee?.user?.department ||
        employee?.user?.departmentName ||
        "-"
    );
};


// ======================================================
// GET DESIGNATION
// ======================================================

const getDesignation = (employee) => {

    return (
        employee?.designation ||
        employee?.jobTitle ||
        employee?.position ||
        employee?.roleName ||
        employee?.role ||
        employee?.user?.designation ||
        employee?.user?.roleName ||
        employee?.user?.role ||
        "-"
    );
};


// ======================================================
// GET SALARY TYPE
// ======================================================

const getSalaryType = (employee) => {

    return (
        employee?.salaryType ||
        employee?.salaryMode ||
        employee?.paymentType ||
        "MONTHLY"
    );
};


// ======================================================
// GET BASE SALARY
// ======================================================

const getBaseSalary = (employee) => {

    return Number(
        employee?.baseSalary ??
        employee?.monthlySalary ??
        employee?.salary ??
        employee?.grossSalary ??
        0
    );
};


// ======================================================
// GET PAID AMOUNT
// ======================================================

const getPaidAmount = (employee) => {

    return Number(
        employee?.totalPaidAmount ??
        employee?.paidAmount ??
        employee?.salaryPaid ??
        0
    );
};


// ======================================================
// GET PENDING AMOUNT
// ======================================================

const getPendingAmount = (employee) => {

    const salary =
        getBaseSalary(employee);

    const paid =
        getPaidAmount(employee);

    return Math.max(
        salary - paid,
        0
    );
};


// ======================================================
// GET STATUS
// ======================================================

const getStatus = (employee) => {

    return cleanString(
        employee?.status ||
        employee?.employmentStatus ||
        employee?.employeeStatus ||
        "ACTIVE"
    );
};


// ======================================================
// INITIALS
// ======================================================

const getInitials = (name) => {

    const value =
        String(
            name || ""
        ).trim();

    if (!value) {
        return "E";
    }

    const parts =
        value.split(/\s+/);

    if (parts.length === 1) {

        return parts[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        `${parts[0][0] || ""}${
            parts[parts.length - 1][0] || ""
        }`
    ).toUpperCase();
};


// ======================================================
// FORMAT MONEY
// ======================================================

const formatMoney = (amount) => {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }
    ).format(
        Number(amount || 0)
    );
};


// ======================================================
// STRICT CUSTOMER DETECTION
// ======================================================
//
// THIS IS THE MAIN FIX.
//
// CUSTOMER department is NEVER allowed.
// CUSTOMER role/type is NEVER allowed.
// CLIENT/USER records are NEVER allowed.
//
// ======================================================

const isCustomerRecord = (record) => {

    if (!record || typeof record !== "object") {
        return false;
    }


    // ----------------------------------------------
    // DEPARTMENT
    // ----------------------------------------------

    const department =
        cleanString(
            record?.department ||
            record?.departmentName ||
            record?.employeeDepartment ||
            record?.user?.department ||
            record?.user?.departmentName
        );


    // ----------------------------------------------
    // ROLE
    // ----------------------------------------------

    const role =
        cleanString(
            record?.role ||
            record?.roleName ||
            record?.user?.role ||
            record?.user?.roleName
        );


    // ----------------------------------------------
    // TYPE
    // ----------------------------------------------

    const type =
        cleanString(
            record?.type ||
            record?.userType ||
            record?.accountType ||
            record?.customerType ||
            record?.user?.type ||
            record?.user?.userType ||
            record?.user?.accountType ||
            record?.user?.customerType
        );


    // ----------------------------------------------
    // CUSTOMER FLAGS
    // ----------------------------------------------

    if (
        record?.isCustomer === true ||
        record?.user?.isCustomer === true
    ) {
        return true;
    }


    // ----------------------------------------------
    // CUSTOMER DEPARTMENT
    // ----------------------------------------------

    if (
        department === "CUSTOMER" ||
        department === "CLIENT" ||
        department === "USER" ||
        department === "CUSTOMERS" ||
        department === "CLIENTS" ||
        department === "USERS"
    ) {
        return true;
    }


    // ----------------------------------------------
    // CUSTOMER ROLE
    // ----------------------------------------------

    if (
        role === "CUSTOMER" ||
        role === "CLIENT" ||
        role === "USER"
    ) {
        return true;
    }


    // ----------------------------------------------
    // CUSTOMER TYPE
    // ----------------------------------------------

    if (
        type === "CUSTOMER" ||
        type === "CLIENT" ||
        type === "USER"
    ) {
        return true;
    }


    return false;
};


// ======================================================
// STRICT EMPLOYEE DETECTION
// ======================================================

const isEmployeeRecord = (record) => {

    if (!record || typeof record !== "object") {
        return false;
    }


    // ==================================================
    // FIRST RULE:
    // CUSTOMER = NEVER EMPLOYEE
    // ==================================================

    if (
        isCustomerRecord(
            record
        )
    ) {
        return false;
    }


    // ==================================================
    // EMPLOYEE ID
    // ==================================================

    const employeeId =
        record?.employeeId ||
        record?.employeeCode ||
        record?.staffId ||
        record?.staffCode ||
        record?.user?.employeeId ||
        record?.user?.employeeCode ||
        record?.user?.staffId ||
        record?.user?.staffCode;


    // ==================================================
    // EXPLICIT EMPLOYEE FLAG
    // ==================================================

    const explicitEmployee =
        record?.isEmployee === true ||
        record?.user?.isEmployee === true;


    // ==================================================
    // EMPLOYEE TYPE
    // ==================================================

    const employeeType =
        cleanString(
            record?.employeeType ||
            record?.employmentType ||
            record?.staffType ||
            record?.user?.employeeType ||
            record?.user?.employmentType ||
            record?.user?.staffType
        );


    // ==================================================
    // EMPLOYEE TYPE MATCH
    // ==================================================

    if (
        explicitEmployee ||
        employeeType === "EMPLOYEE" ||
        employeeType === "STAFF"
    ) {
        return true;
    }


    // ==================================================
    // EMPLOYEE ID MATCH
    // ==================================================

    if (
        employeeId &&
        String(
            employeeId
        ).trim() &&
        String(
            employeeId
        ).trim() !== "-"
    ) {
        return true;
    }


    // ==================================================
    // EMPLOYEE-SPECIFIC DATA
    // ==================================================

    const designation =
        cleanString(
            record?.designation ||
            record?.jobTitle ||
            record?.position ||
            record?.roleName ||
            record?.user?.designation ||
            record?.user?.roleName
        );


    const department =
        cleanString(
            record?.department ||
            record?.departmentName ||
            record?.employeeDepartment ||
            record?.user?.department ||
            record?.user?.departmentName
        );


    // ----------------------------------------------
    // If department exists and is NOT customer,
    // plus designation exists => employee
    // ----------------------------------------------

    if (
        department &&
        department !== "-" &&
        designation &&
        designation !== "-" &&
        designation !== "CUSTOMER" &&
        designation !== "CLIENT" &&
        designation !== "USER"
    ) {
        return true;
    }


    // ==================================================
    // EMPLOYEE SALARY DATA
    // ==================================================

    const hasSalaryField =
        record?.baseSalary !== undefined ||
        record?.monthlySalary !== undefined ||
        record?.grossSalary !== undefined ||
        record?.salary !== undefined;


    const hasEmployeeField =
        record?.department !== undefined ||
        record?.departmentName !== undefined ||
        record?.designation !== undefined ||
        record?.jobTitle !== undefined ||
        record?.position !== undefined ||
        record?.employmentStatus !== undefined ||
        record?.employeeStatus !== undefined;


    if (
        hasSalaryField &&
        hasEmployeeField
    ) {
        return true;
    }


    // ==================================================
    // OTHERWISE NOT AN EMPLOYEE
    // ==================================================

    return false;
};


// ======================================================
// PAYMENT METHOD ICON
// ======================================================

const PaymentMethodIcon = ({
    method,
}) => {

    const value = String(
        method || ""
    ).toUpperCase();


    if (
        value.includes("CASH")
    ) {

        return (
            <Wallet
                size={16}
            />
        );
    }


    if (
        value.includes("BANK") ||
        value.includes("NEFT") ||
        value.includes("RTGS") ||
        value.includes("IMPS")
    ) {

        return (
            <Building2
                size={16}
            />
        );
    }


    if (
        value.includes("UPI") ||
        value.includes("GPAY") ||
        value.includes("PHONE")
    ) {

        return (
            <Smartphone
                size={16}
            />
        );
    }


    return (
        <CreditCard
            size={16}
        />
    );
};


// ======================================================
// SUMMARY CARD
// ======================================================

const SummaryCard = ({
    title,
    value,
    icon,
    type = "",
}) => {

    return (

        <div
            className={`salary-summary-card ${
                type
                    ? `salary-summary-${type}`
                    : ""
            }`}
        >

            <div className="salary-summary-content">

                <span className="salary-summary-title">
                    {title}
                </span>

                <strong className="salary-summary-value">
                    {value}
                </strong>

            </div>


            <div className="salary-summary-icon">
                {icon}
            </div>

        </div>
    );
};


// ======================================================
// MAIN COMPONENT
// ======================================================

const SalaryManagement = () => {

    const [employees, setEmployees] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [departmentFilter, setDepartmentFilter] =
        useState("ALL");

    const [salaryTypeFilter, setSalaryTypeFilter] =
        useState("ALL");

    const [selectedEmployee, setSelectedEmployee] =
        useState(null);

    const [showDetails, setShowDetails] =
        useState(false);


    // ==================================================
    // LOAD SALARY DATA
    // ==================================================

    const loadSalaryData = async () => {

        try {

            setLoading(true);


            const response =
                await getAllSalaryData();


            console.log(
                "===================================="
            );

            console.log(
                "ACCOUNTANT SALARY RAW RESPONSE:",
                response
            );

            console.log(
                "===================================="
            );


            // ==================================================
            // GET ARRAY FROM API RESPONSE
            // ==================================================

            let list = [];


            if (
                Array.isArray(
                    response?.data
                )
            ) {

                list =
                    response.data;

            } else if (
                Array.isArray(
                    response
                )
            ) {

                list =
                    response;

            } else if (
                Array.isArray(
                    response?.data?.data
                )
            ) {

                list =
                    response.data.data;

            } else if (
                Array.isArray(
                    response?.data?.employees
                )
            ) {

                list =
                    response.data.employees;

            } else if (
                Array.isArray(
                    response?.employees
                )
            ) {

                list =
                    response.employees;

            } else if (
                Array.isArray(
                    response?.result
                )
            ) {

                list =
                    response.result;

            } else if (
                Array.isArray(
                    response?.data?.result
                )
            ) {

                list =
                    response.data.result;
            }


            console.log(
                "TOTAL API RECORDS:",
                list.length
            );


            // ==================================================
            // REMOVE CUSTOMER RECORDS FIRST
            // ==================================================

            const withoutCustomers =
                list.filter(
                    (record) => {

                        const customer =
                            isCustomerRecord(
                                record
                            );

                        if (customer) {

                            console.log(
                                "REMOVED CUSTOMER FROM SALARY:",
                                {
                                    id:
                                        record?._id,

                                    name:
                                        record?.name ||
                                        record?.employeeName,

                                    department:
                                        record?.department ||
                                        record?.departmentName,

                                    role:
                                        record?.role,

                                    type:
                                        record?.type,
                                }
                            );

                            return false;
                        }

                        return true;
                    }
                );


            // ==================================================
            // KEEP ONLY EMPLOYEES
            // ==================================================

            const employeeOnlyList =
                withoutCustomers.filter(
                    (record) =>
                        isEmployeeRecord(
                            record
                        )
                );


            console.log(
                "CUSTOMERS REMOVED:",
                list.length -
                withoutCustomers.length
            );


            console.log(
                "EMPLOYEE RECORDS:",
                employeeOnlyList.length
            );


            console.log(
                "FINAL EMPLOYEE LIST:",
                employeeOnlyList
            );


            // ==================================================
            // SET FINAL LIST
            // ==================================================

            setEmployees(
                employeeOnlyList
            );

        } catch (error) {

            console.error(
                "ACCOUNTANT SALARY ERROR:",
                error
            );


            setEmployees([]);


            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Unable to load employee salary data"
            );

        } finally {

            setLoading(false);
        }
    };


    // ==================================================
    // INITIAL LOAD
    // ==================================================

    useEffect(() => {

        loadSalaryData();

    }, []);


    // ==================================================
    // DEPARTMENTS
    // ==================================================

    const departments =
        useMemo(() => {

            const values =
                employees
                    .map(
                        (employee) =>
                            getDepartment(
                                employee
                            )
                    )
                    .filter(
                        (value) => {

                            const department =
                                cleanString(
                                    value
                                );

                            return (
                                department &&
                                department !== "-" &&
                                department !== "CUSTOMER" &&
                                department !== "CUSTOMERS" &&
                                department !== "CLIENT" &&
                                department !== "CLIENTS" &&
                                department !== "USER" &&
                                department !== "USERS"
                            );
                        }
                    );


            return [
                ...new Set(values),
            ];

        }, [employees]);


    // ==================================================
    // SALARY TYPES
    // ==================================================

    const salaryTypes =
        useMemo(() => {

            const values =
                employees
                    .map(
                        (employee) =>
                            getSalaryType(
                                employee
                            )
                    )
                    .filter(Boolean);


            return [
                ...new Set(values),
            ];

        }, [employees]);


    // ==================================================
    // FILTER
    // ==================================================

    const filteredEmployees =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase();


            return employees.filter(
                (employee) => {

                    // ----------------------------------
                    // EXTRA SAFETY
                    // ----------------------------------

                    if (
                        !isEmployeeRecord(
                            employee
                        )
                    ) {
                        return false;
                    }


                    // ----------------------------------
                    // EXTRA CUSTOMER BLOCK
                    // ----------------------------------

                    if (
                        isCustomerRecord(
                            employee
                        )
                    ) {
                        return false;
                    }


                    const name =
                        getEmployeeName(
                            employee
                        ).toLowerCase();


                    const employeeId =
                        String(
                            getEmployeeId(
                                employee
                            )
                        ).toLowerCase();


                    const department =
                        String(
                            getDepartment(
                                employee
                            )
                        ).toLowerCase();


                    const designation =
                        String(
                            getDesignation(
                                employee
                            )
                        ).toLowerCase();


                    const salaryType =
                        String(
                            getSalaryType(
                                employee
                            )
                        ).toLowerCase();


                    const status =
                        getStatus(
                            employee
                        );


                    const matchesSearch =
                        !keyword ||
                        name.includes(
                            keyword
                        ) ||
                        employeeId.includes(
                            keyword
                        ) ||
                        department.includes(
                            keyword
                        ) ||
                        designation.includes(
                            keyword
                        ) ||
                        salaryType.includes(
                            keyword
                        );


                    const matchesStatus =
                        statusFilter === "ALL" ||
                        status === statusFilter;


                    const matchesDepartment =
                        departmentFilter === "ALL" ||
                        getDepartment(
                            employee
                        ) === departmentFilter;


                    const matchesSalaryType =
                        salaryTypeFilter === "ALL" ||
                        getSalaryType(
                            employee
                        ) === salaryTypeFilter;


                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesDepartment &&
                        matchesSalaryType
                    );
                }
            );

        }, [
            employees,
            search,
            statusFilter,
            departmentFilter,
            salaryTypeFilter,
        ]);


    // ==================================================
    // SUMMARY
    // ==================================================

    const summary =
        useMemo(() => {

            const employeeList =
                employees.filter(
                    (employee) =>
                        isEmployeeRecord(
                            employee
                        ) &&
                        !isCustomerRecord(
                            employee
                        )
                );


            const totalEmployees =
                employeeList.length;


            const activeEmployees =
                employeeList.filter(
                    (employee) =>
                        getStatus(
                            employee
                        ) === "ACTIVE"
                ).length;


            const totalSalary =
                employeeList.reduce(
                    (
                        total,
                        employee
                    ) =>
                        total +
                        getBaseSalary(
                            employee
                        ),
                    0
                );


            const totalPaid =
                employeeList.reduce(
                    (
                        total,
                        employee
                    ) =>
                        total +
                        getPaidAmount(
                            employee
                        ),
                    0
                );


            const totalPending =
                employeeList.reduce(
                    (
                        total,
                        employee
                    ) =>
                        total +
                        getPendingAmount(
                            employee
                        ),
                    0
                );


            return {
                totalEmployees,
                activeEmployees,
                totalSalary,
                totalPaid,
                totalPending,
            };

        }, [employees]);


    // ==================================================
    // EXPORT
    // ==================================================

    const handleExport =
        async () => {

            try {

                await exportSalaryExcel();


                toast.success(
                    "Salary Excel exported successfully"
                );

            } catch (error) {

                console.error(
                    "SALARY EXPORT ERROR:",
                    error
                );


                toast.error(
                    error?.response?.data?.message ||
                    "Unable to export salary Excel"
                );
            }
        };


    // ==================================================
    // PRINT
    // ==================================================

    const handlePrint = () => {

        window.print();

    };


    // ==================================================
    // VIEW
    // ==================================================

    const handleView = (
        employee
    ) => {

        if (
            !isEmployeeRecord(
                employee
            ) ||
            isCustomerRecord(
                employee
            )
        ) {

            toast.error(
                "Only employee records are allowed."
            );

            return;
        }


        setSelectedEmployee(
            employee
        );

        setShowDetails(
            true
        );
    };


    // ==================================================
    // MANAGE
    // ==================================================

    const handleManage = (
        employee
    ) => {

        if (
            !isEmployeeRecord(
                employee
            ) ||
            isCustomerRecord(
                employee
            )
        ) {

            toast.error(
                "Only employee salary can be managed."
            );

            return;
        }


        setSelectedEmployee(
            employee
        );

        setShowDetails(
            true
        );
    };


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (

            <div className="salary-management-page">

                <div className="salary-loading">

                    <RefreshCw
                        size={22}
                        className="salary-spin"
                    />

                    <span>
                        Loading employee salary data...
                    </span>

                </div>

            </div>
        );
    }


    // ==================================================
    // UI
    // ==================================================

    return (

        <div className="salary-management-page">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="salary-management-header">

                <div>

                    <div className="salary-title-row">

                        <div className="salary-title-icon">

                            <IndianRupee
                                size={24}
                            />

                        </div>


                        <div>

                            <h1>
                                Employee Salary Management
                            </h1>

                            <p>
                                Manage employee salary,
                                payments, pending amounts
                                and salary records.
                            </p>

                        </div>

                    </div>

                </div>


                <div className="salary-header-actions">

                    <button
                        type="button"
                        onClick={
                            loadSalaryData
                        }
                        className="salary-action-btn"
                    >

                        <RefreshCw
                            size={16}
                        />

                        Refresh

                    </button>


                    <button
                        type="button"
                        onClick={
                            handleExport
                        }
                        className="salary-action-btn"
                    >

                        <Download
                            size={16}
                        />

                        Export Excel

                    </button>


                    <button
                        type="button"
                        onClick={
                            handlePrint
                        }
                        className="salary-action-btn salary-print-btn"
                    >

                        <Printer
                            size={16}
                        />

                        Print

                    </button>

                </div>

            </div>


            {/* ==========================================
                SUMMARY
            ========================================== */}

            <div className="salary-summary-grid">

                <SummaryCard
                    title="Total Employees"
                    value={
                        summary.totalEmployees
                    }
                    icon={
                        <Users
                            size={22}
                        />
                    }
                />


                <SummaryCard
                    title="Active Employees"
                    value={
                        summary.activeEmployees
                    }
                    icon={
                        <CheckCircle2
                            size={22}
                        />
                    }
                    type="green"
                />


                <SummaryCard
                    title="Monthly Salary"
                    value={
                        formatMoney(
                            summary.totalSalary
                        )
                    }
                    icon={
                        <IndianRupee
                            size={22}
                        />
                    }
                    type="blue"
                />


                <SummaryCard
                    title="Total Paid"
                    value={
                        formatMoney(
                            summary.totalPaid
                        )
                    }
                    icon={
                        <Wallet
                            size={22}
                        />
                    }
                    type="purple"
                />


                <SummaryCard
                    title="Pending Salary"
                    value={
                        formatMoney(
                            summary.totalPending
                        )
                    }
                    icon={
                        <Clock3
                            size={22}
                        />
                    }
                    type="orange"
                />

            </div>


            {/* ==========================================
                FILTERS
            ========================================== */}

            <div className="salary-filter-box">

                <div className="salary-search-box">

                    <Search
                        size={18}
                    />

                    <input
                        type="text"
                        placeholder="Search employee, ID, department..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>


                <select
                    value={
                        departmentFilter
                    }
                    onChange={(event) =>
                        setDepartmentFilter(
                            event.target.value
                        )
                    }
                >

                    <option value="ALL">
                        All Departments
                    </option>


                    {departments.map(
                        (department) => (

                            <option
                                key={
                                    department
                                }
                                value={
                                    department
                                }
                            >
                                {department}
                            </option>

                        )
                    )}

                </select>


                <select
                    value={
                        salaryTypeFilter
                    }
                    onChange={(event) =>
                        setSalaryTypeFilter(
                            event.target.value
                        )
                    }
                >

                    <option value="ALL">
                        All Salary Types
                    </option>


                    {salaryTypes.map(
                        (type) => (

                            <option
                                key={
                                    type
                                }
                                value={
                                    type
                                }
                            >
                                {type}
                            </option>

                        )
                    )}

                </select>


                <select
                    value={
                        statusFilter
                    }
                    onChange={(event) =>
                        setStatusFilter(
                            event.target.value
                        )
                    }
                >

                    <option value="ALL">
                        All Status
                    </option>

                    <option value="ACTIVE">
                        Active
                    </option>

                    <option value="INACTIVE">
                        Inactive
                    </option>

                    <option value="SUSPENDED">
                        Suspended
                    </option>

                </select>

            </div>


            {/* ==========================================
                TABLE
            ========================================== */}

            <div className="salary-table-card">

                <div className="salary-table-header">

                    <div>

                        <h2>
                            Employee Salary Records
                        </h2>

                        <p>
                            {
                                filteredEmployees.length
                            }
                            {" "}
                            employee(s) found
                        </p>

                    </div>

                </div>


                <div className="salary-table-scroll">

                    <table className="salary-management-table">

                        <thead>

                            <tr>

                                <th>
                                    Employee
                                </th>

                                <th>
                                    Department
                                </th>

                                <th>
                                    Designation
                                </th>

                                <th>
                                    Salary Type
                                </th>

                                <th>
                                    Monthly Salary
                                </th>

                                <th>
                                    Paid
                                </th>

                                <th>
                                    Pending
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredEmployees.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="salary-empty"
                                    >

                                        <Users
                                            size={36}
                                        />

                                        <strong>
                                            No employees found
                                        </strong>

                                        <span>
                                            Try changing your
                                            search or filters.
                                        </span>

                                    </td>

                                </tr>

                            ) : (

                                filteredEmployees.map(
                                    (
                                        employee
                                    ) => {

                                        const name =
                                            getEmployeeName(
                                                employee
                                            );


                                        const salary =
                                            getBaseSalary(
                                                employee
                                            );


                                        const paid =
                                            getPaidAmount(
                                                employee
                                            );


                                        const pending =
                                            getPendingAmount(
                                                employee
                                            );


                                        const status =
                                            getStatus(
                                                employee
                                            );


                                        return (

                                            <tr
                                                key={
                                                    employee?._id ||
                                                    employee?.employeeId ||
                                                    employee?.employeeCode
                                                }
                                            >

                                                {/* EMPLOYEE */}

                                                <td>

                                                    <div className="salary-employee-cell">

                                                        <div className="salary-avatar">

                                                            {
                                                                getInitials(
                                                                    name
                                                                )
                                                            }

                                                        </div>


                                                        <div>

                                                            <strong>
                                                                {
                                                                    name
                                                                }
                                                            </strong>

                                                            <span>
                                                                ID:{" "}
                                                                {
                                                                    getEmployeeId(
                                                                        employee
                                                                    )
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* DEPARTMENT */}

                                                <td>

                                                    <div className="salary-info-cell">

                                                        <BriefcaseBusiness
                                                            size={15}
                                                        />

                                                        {
                                                            getDepartment(
                                                                employee
                                                            )
                                                        }

                                                    </div>

                                                </td>


                                                {/* DESIGNATION */}

                                                <td>

                                                    {
                                                        getDesignation(
                                                            employee
                                                        )
                                                    }

                                                </td>


                                                {/* SALARY TYPE */}

                                                <td>

                                                    <span className="salary-type-badge">

                                                        {
                                                            getSalaryType(
                                                                employee
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* SALARY */}

                                                <td>

                                                    <strong className="salary-money">

                                                        {
                                                            formatMoney(
                                                                salary
                                                            )
                                                        }

                                                    </strong>

                                                </td>


                                                {/* PAID */}

                                                <td>

                                                    <span className="salary-paid">

                                                        {
                                                            formatMoney(
                                                                paid
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* PENDING */}

                                                <td>

                                                    <span
                                                        className={
                                                            pending > 0
                                                                ? "salary-pending"
                                                                : "salary-cleared"
                                                        }
                                                    >

                                                        {
                                                            formatMoney(
                                                                pending
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={`salary-status-badge ${
                                                            status ===
                                                            "ACTIVE"
                                                                ? "active"
                                                                : "inactive"
                                                        }`}
                                                    >

                                                        <span />

                                                        {
                                                            status
                                                        }

                                                    </span>

                                                </td>


                                                {/* ACTION */}

                                                <td>

                                                    <div className="salary-row-actions">

                                                        <button
                                                            type="button"
                                                            title="View salary"
                                                            onClick={() =>
                                                                handleView(
                                                                    employee
                                                                )
                                                            }
                                                            className="salary-icon-btn"
                                                        >

                                                            <Eye
                                                                size={17}
                                                            />

                                                        </button>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleManage(
                                                                    employee
                                                                )
                                                            }
                                                            className="salary-manage-btn"
                                                        >

                                                            <IndianRupee
                                                                size={15}
                                                            />

                                                            Pay / Manage

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ==========================================
                FOOTER
            ========================================== */}

            <div className="salary-footer-summary">

                <div>

                    <span>
                        Showing
                    </span>

                    <strong>
                        {
                            filteredEmployees.length
                        }
                    </strong>

                    <span>
                        of
                    </span>

                    <strong>
                        {
                            employees.length
                        }
                    </strong>

                    <span>
                        employees
                    </span>

                </div>


                <div className="salary-footer-pending">

                    <span>
                        Total Pending
                    </span>

                    <strong>
                        {
                            formatMoney(
                                summary.totalPending
                            )
                        }
                    </strong>

                </div>

            </div>


            {/* ==========================================
                MODAL
            ========================================== */}

            {
                showDetails &&
                selectedEmployee && (

                    <SalaryEmployeeModal
                        employee={
                            selectedEmployee
                        }
                        onClose={() => {

                            setShowDetails(
                                false
                            );

                            setSelectedEmployee(
                                null
                            );

                        }}
                        onRefresh={
                            loadSalaryData
                        }
                    />

                )
            }

        </div>
    );
};


// ======================================================
// EMPLOYEE SALARY MODAL
// ======================================================

const SalaryEmployeeModal = ({
    employee,
    onClose,
    onRefresh,
}) => {

    if (
        !isEmployeeRecord(
            employee
        ) ||
        isCustomerRecord(
            employee
        )
    ) {
        return null;
    }


    const name =
        getEmployeeName(
            employee
        );


    const salary =
        getBaseSalary(
            employee
        );


    const paid =
        getPaidAmount(
            employee
        );


    const pending =
        getPendingAmount(
            employee
        );


    return (

        <div className="salary-modal-overlay">

            <div className="salary-modal">

                {/* HEADER */}

                <div className="salary-modal-header">

                    <div>

                        <h2>
                            Salary Management
                        </h2>

                        <p>
                            Employee salary details
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="salary-modal-close"
                    >

                        <X
                            size={20}
                        />

                    </button>

                </div>


                {/* EMPLOYEE */}

                <div className="salary-modal-employee">

                    <div className="salary-modal-avatar">

                        {
                            getInitials(
                                name
                            )
                        }

                    </div>


                    <div>

                        <h3>
                            {name}
                        </h3>

                        <p>
                            Employee ID:{" "}
                            {
                                getEmployeeId(
                                    employee
                                )
                            }
                        </p>

                    </div>

                </div>


                {/* DETAILS */}

                <div className="salary-modal-grid">

                    <SalaryDetail
                        icon={
                            <UserRound
                                size={17}
                            />
                        }
                        label="Employee"
                        value={
                            name
                        }
                    />


                    <SalaryDetail
                        icon={
                            <BriefcaseBusiness
                                size={17}
                            />
                        }
                        label="Department"
                        value={
                            getDepartment(
                                employee
                            )
                        }
                    />


                    <SalaryDetail
                        icon={
                            <FileText
                                size={17}
                            />
                        }
                        label="Designation"
                        value={
                            getDesignation(
                                employee
                            )
                        }
                    />


                    <SalaryDetail
                        icon={
                            <CalendarDays
                                size={17}
                            />
                        }
                        label="Salary Type"
                        value={
                            getSalaryType(
                                employee
                            )
                        }
                    />

                </div>


                {/* MONEY */}

                <div className="salary-modal-money-grid">

                    <div>

                        <span>
                            Monthly Salary
                        </span>

                        <strong>
                            {
                                formatMoney(
                                    salary
                                )
                            }
                        </strong>

                    </div>


                    <div className="paid-box">

                        <span>
                            Paid
                        </span>

                        <strong>
                            {
                                formatMoney(
                                    paid
                                )
                            }
                        </strong>

                    </div>


                    <div className="pending-box">

                        <span>
                            Pending
                        </span>

                        <strong>
                            {
                                formatMoney(
                                    pending
                                )
                            }
                        </strong>

                    </div>

                </div>


                {/* PAYMENT INFO */}

                <div className="salary-modal-section">

                    <h3>
                        Salary Payment
                    </h3>

                    <p>
                        Use your existing salary
                        payment workflow here.
                    </p>


                    <div className="salary-payment-placeholder">

                        <PaymentMethodIcon
                            method={
                                employee?.paymentMethod
                            }
                        />


                        <div>

                            <strong>
                                {
                                    employee?.paymentMethod ||
                                    "Payment Method Not Available"
                                }
                            </strong>


                            <span>
                                {
                                    employee?.lastPaymentDate
                                        ? `Last payment: ${employee.lastPaymentDate}`
                                        : "No last payment information"
                                }
                            </span>

                        </div>

                    </div>

                </div>


                {/* ACTIONS */}

                <div className="salary-modal-actions">

                    <button
                        type="button"
                        onClick={onClose}
                        className="salary-modal-cancel"
                    >
                        Close
                    </button>


                    <button
                        type="button"
                        onClick={() => {

                            onRefresh();

                            toast.info(
                                "Open the HR salary payment modal here to record payment."
                            );

                        }}
                        className="salary-modal-pay"
                    >

                        <IndianRupee
                            size={16}
                        />

                        Pay Salary

                    </button>

                </div>

            </div>

        </div>
    );
};


// ======================================================
// SALARY DETAIL
// ======================================================

const SalaryDetail = ({
    icon,
    label,
    value,
}) => {

    return (

        <div className="salary-detail-box">

            <div className="salary-detail-icon">
                {icon}
            </div>


            <div>

                <span>
                    {label}
                </span>

                <strong>
                    {value || "-"}
                </strong>

            </div>

        </div>
    );
};


export default SalaryManagement;