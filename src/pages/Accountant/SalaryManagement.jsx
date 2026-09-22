// import React, {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   Search,
//   RefreshCw,
//   IndianRupee,
//   Clock,
//   CheckCircle,
//   Eye,
//   X,
//   Wallet,
//   Building2,
//   Smartphone,
//   Calculator,
//   CreditCard,
//   Download,
// } from "lucide-react";

// import {
//   getAllEmployeesSalary,
//   getSalary,
//   calculateSalary,
//   paySalary,
//   exportSalary,
// } from "../../services/accountantSalaryService";

// import { toast } from "react-toastify";

// const SalaryManagement = () => {
//   const [employees, setEmployees] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [search, setSearch] =
//     useState("");

//   const [statusFilter, setStatusFilter] =
//     useState("ALL");

//   const now = new Date();

//   const [month, setMonth] =
//     useState(now.getMonth() + 1);

//   const [year, setYear] =
//     useState(now.getFullYear());

//   const [selectedEmployee, setSelectedEmployee] =
//     useState(null);

//   const [salaryDetail, setSalaryDetail] =
//     useState(null);

//   const [showPayModal, setShowPayModal] =
//     useState(false);

//   const [payMethod, setPayMethod] =
//     useState("CASH");

//   const [payReference, setPayReference] =
//     useState("");

//   const [actionLoading, setActionLoading] =
//     useState(false);

//   // ============================================
//   // LOAD
//   // ============================================

//   const loadEmployees = async () => {
//     try {
//       setLoading(true);

//       const response =
//         await getAllEmployeesSalary();

//       const data =
//         response?.data ||
//         response?.employees ||
//         response ||
//         [];

//       setEmployees(
//         Array.isArray(data)
//           ? data
//           : []
//       );
//     } catch (error) {
//       console.error(error);

//       toast.error(
//         error?.response?.data?.message ||
//           "Failed to load salary data"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadEmployees();
//   }, []);

//   // ============================================
//   // HELPERS
//   // ============================================

//   const money = (value) =>
//     new Intl.NumberFormat(
//       "en-IN",
//       {
//         style: "currency",
//         currency: "INR",
//         maximumFractionDigits: 2,
//       }
//     ).format(Number(value || 0));

//   const employeeName =
//     (employee) => {
//       return (
//         `${employee?.firstName || ""} ${
//           employee?.lastName || ""
//         }`.trim() ||
//         employee?.name ||
//         "Employee"
//       );
//     };

//   const getHistory =
//     (employee) =>
//       Array.isArray(
//         employee?.salaryHistory
//       )
//         ? employee.salaryHistory
//         : [];

//   const getCurrentHistory =
//     (employee) => {
//       const history =
//         getHistory(employee);

//       const monthNumber =
//         Number(month);

//       const current = history
//         .filter((item) => {
//           const itemMonth =
//             Number(
//               item.month
//             );

//           const itemYear =
//             Number(item.year);

//           return (
//             itemMonth ===
//               monthNumber &&
//             itemYear ===
//               Number(year)
//           );
//         })
//         .sort(
//           (a, b) =>
//             new Date(
//               b.createdAt || 0
//             ) -
//             new Date(
//               a.createdAt || 0
//             )
//         );

//       return current[0] || null;
//     };

//   const getSalaryStatus =
//     (employee) => {
//       const current =
//         getCurrentHistory(
//           employee
//         );

//       if (current) {
//         return String(
//           current.status ||
//             current.paymentStatus ||
//             "PENDING"
//         ).toUpperCase();
//       }

//       return "NOT_CALCULATED";
//     };

//   const getSalaryAmount =
//     (employee) => {
//       const current =
//         getCurrentHistory(
//           employee
//         );

//       if (!current) {
//         return (
//           employee?.salaryDetails
//             ?.netSalary ||
//           employee?.salaryDetails
//             ?.monthlySalary ||
//           employee?.salaryDetails
//             ?.basicSalary ||
//           0
//         );
//       }

//       return (
//         current.netSalary ||
//         current.salary ||
//         current.amount ||
//         current.netAmount ||
//         0
//       );
//     };

//   // ============================================
//   // FILTER
//   // ============================================

//   const filteredEmployees =
//     useMemo(() => {
//       return employees.filter(
//         (employee) => {
//           const name =
//             employeeName(
//               employee
//             ).toLowerCase();

//           const email =
//             String(
//               employee?.email || ""
//             ).toLowerCase();

//           const employeeId =
//             String(
//               employee?.employeeId ||
//                 ""
//             ).toLowerCase();

//           const searchValue =
//             search.toLowerCase();

//           const status =
//             getSalaryStatus(
//               employee
//             );

//           return (
//             (!search ||
//               name.includes(
//                 searchValue
//               ) ||
//               email.includes(
//                 searchValue
//               ) ||
//               employeeId.includes(
//                 searchValue
//               )) &&
//             (statusFilter ===
//               "ALL" ||
//               status ===
//                 statusFilter)
//           );
//         }
//       );
//     }, [
//       employees,
//       search,
//       statusFilter,
//       month,
//       year,
//     ]);

//   // ============================================
//   // SUMMARY
//   // ============================================

//   const summary =
//     useMemo(() => {
//       const pending =
//         employees.filter(
//           (e) =>
//             getSalaryStatus(e) ===
//             "PENDING"
//         );

//       const paid =
//         employees.filter(
//           (e) =>
//             getSalaryStatus(e) ===
//             "PAID"
//         );

//       const pendingAmount =
//         pending.reduce(
//           (sum, e) =>
//             sum +
//             Number(
//               getSalaryAmount(e)
//             ),
//           0
//         );

//       const paidAmount =
//         paid.reduce(
//           (sum, e) =>
//             sum +
//             Number(
//               getSalaryAmount(e)
//             ),
//           0
//         );

//       return {
//         employees:
//           employees.length,

//         pending:
//           pending.length,

//         paid:
//           paid.length,

//         pendingAmount,

//         paidAmount,
//       };
//     }, [
//       employees,
//       month,
//       year,
//     ]);

//   // ============================================
//   // CALCULATE
//   // ============================================

//   const handleCalculate =
//     async (employee) => {
//       try {
//         setActionLoading(true);

//         await calculateSalary(
//           employee._id,
//           Number(month),
//           Number(year)
//         );

//         toast.success(
//           `Salary calculated for ${employeeName(
//             employee
//           )}`
//         );

//         await loadEmployees();
//       } catch (error) {
//         toast.error(
//           error?.response?.data?.message ||
//             "Salary calculation failed"
//         );
//       } finally {
//         setActionLoading(false);
//       }
//     };

//   // ============================================
//   // VIEW
//   // ============================================

//   const handleView =
//     async (employee) => {
//       try {
//         setSelectedEmployee(
//           employee
//         );

//         setActionLoading(true);

//         const response =
//           await getSalary(
//             employee._id
//           );

//         setSalaryDetail(
//           response?.data ||
//             response
//         );
//       } catch (error) {
//         toast.error(
//           error?.response?.data?.message ||
//             "Unable to load salary details"
//         );
//       } finally {
//         setActionLoading(false);
//       }
//     };

//   // ============================================
//   // PAY
//   // ============================================

//   const handlePay =
//     async () => {
//       if (!selectedEmployee) {
//         return;
//       }

//       try {
//         setActionLoading(true);

//         await paySalary(
//           selectedEmployee._id,
//           {
//             paymentMethod:
//               payMethod,

//             paymentMode:
//               payMethod,

//             transactionId:
//               payReference,

//             month: Number(month),

//             year: Number(year),
//           }
//         );

//         toast.success(
//           "Salary marked as PAID successfully"
//         );

//         setShowPayModal(false);

//         setPayReference("");

//         setSelectedEmployee(
//           null
//         );

//         setSalaryDetail(
//           null
//         );

//         await loadEmployees();
//       } catch (error) {
//         toast.error(
//           error?.response?.data?.message ||
//             "Salary payment failed"
//         );
//       } finally {
//         setActionLoading(false);
//       }
//     };

//   // ============================================
//   // EXPORT
//   // ============================================

//   const handleExport =
//     async () => {
//       try {
//         const blob =
//           await exportSalary();

//         const url =
//           window.URL.createObjectURL(
//             new Blob([blob])
//           );

//         const link =
//           document.createElement(
//             "a"
//           );

//         link.href = url;

//         link.download =
//           "Employee_Salary_List.xlsx";

//         document.body.appendChild(
//           link
//         );

//         link.click();

//         link.remove();

//         window.URL.revokeObjectURL(
//           url
//         );

//         toast.success(
//           "Salary Excel exported"
//         );
//       } catch (error) {
//         toast.error(
//           "Unable to export salary"
//         );
//       }
//     };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       {/* HEADER */}

//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//             Salary Management
//           </h1>

//           <p className="text-gray-500 mt-1">
//             Review, calculate and pay employee monthly salaries.
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           <button
//             onClick={handleExport}
//             className="flex items-center gap-2 px-4 py-2.5 rounded-lg border bg-white hover:bg-gray-50"
//           >
//             <Download
//               size={17}
//             />

//             Export Excel
//           </button>

//           <button
//             onClick={loadEmployees}
//             className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
//           >
//             <RefreshCw
//               size={17}
//               className={
//                 loading
//                   ? "animate-spin"
//                   : ""
//               }
//             />

//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* MONTH SELECT */}

//       <div className="bg-white border rounded-xl shadow-sm p-4 mb-5">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Salary Month
//             </label>

//             <select
//               value={month}
//               onChange={(e) =>
//                 setMonth(
//                   Number(
//                     e.target.value
//                   )
//                 )
//               }
//               className="w-full border rounded-lg px-3 py-2.5"
//             >
//               {[
//                 "January",
//                 "February",
//                 "March",
//                 "April",
//                 "May",
//                 "June",
//                 "July",
//                 "August",
//                 "September",
//                 "October",
//                 "November",
//                 "December",
//               ].map(
//                 (name, index) => (
//                   <option
//                     key={name}
//                     value={
//                       index + 1
//                     }
//                   >
//                     {name}
//                   </option>
//                 )
//               )}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Year
//             </label>

//             <select
//               value={year}
//               onChange={(e) =>
//                 setYear(
//                   Number(
//                     e.target.value
//                   )
//                 )
//               }
//               className="w-full border rounded-lg px-3 py-2.5"
//             >
//               {[2026, 2027, 2028]
//                 .map(
//                   (value) => (
//                     <option
//                       key={value}
//                       value={value}
//                     >
//                       {value}
//                     </option>
//                   )
//                 )}
//             </select>
//           </div>

//           <div className="relative">
//             <label className="block text-sm font-medium mb-1">
//               Search
//             </label>

//             <Search
//               size={18}
//               className="absolute left-3 top-[38px] text-gray-400"
//             />

//             <input
//               value={search}
//               onChange={(e) =>
//                 setSearch(
//                   e.target.value
//                 )
//               }
//               placeholder="Employee name / ID / email"
//               className="w-full border rounded-lg pl-10 pr-3 py-2.5"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Status
//             </label>

//             <select
//               value={statusFilter}
//               onChange={(e) =>
//                 setStatusFilter(
//                   e.target.value
//                 )
//               }
//               className="w-full border rounded-lg px-3 py-2.5"
//             >
//               <option value="ALL">
//                 All
//               </option>

//               <option value="NOT_CALCULATED">
//                 Not Calculated
//               </option>

//               <option value="PENDING">
//                 Pending
//               </option>

//               <option value="PAID">
//                 Paid
//               </option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* SUMMARY */}

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
//         <SalaryCard
//           title="Employees"
//           value={
//             summary.employees
//           }
//           icon={
//             <CreditCard
//               size={21}
//             />
//           }
//         />

//         <SalaryCard
//           title="Pending Salary"
//           value={
//             summary.pending
//           }
//           amount={
//             summary.pendingAmount
//           }
//           icon={
//             <Clock size={21} />
//           }
//         />

//         <SalaryCard
//           title="Paid Salary"
//           value={
//             summary.paid
//           }
//           amount={
//             summary.paidAmount
//           }
//           icon={
//             <CheckCircle
//               size={21}
//             />
//           }
//         />

//         <SalaryCard
//           title="Pending Amount"
//           value={new Intl.NumberFormat(
//             "en-IN",
//             {
//               style: "currency",
//               currency: "INR",
//               maximumFractionDigits: 0,
//             }
//           ).format(
//             summary.pendingAmount
//           )}
//           icon={
//             <IndianRupee
//               size={21}
//             />
//           }
//         />
//       </div>

//       {/* TABLE */}

//       <div className="bg-white border shadow-sm rounded-xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[1100px]">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="text-left px-4 py-3">
//                   Employee
//                 </th>

//                 <th className="text-left px-4 py-3">
//                   Department
//                 </th>

//                 <th className="text-left px-4 py-3">
//                   Designation
//                 </th>

//                 <th className="text-left px-4 py-3">
//                   Salary
//                 </th>

//                 <th className="text-left px-4 py-3">
//                   Status
//                 </th>

//                 <th className="text-right px-4 py-3">
//                   Action
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td
//                     colSpan="6"
//                     className="text-center py-12"
//                   >
//                     Loading salary data...
//                   </td>
//                 </tr>
//               ) : filteredEmployees.length ===
//                 0 ? (
//                 <tr>
//                   <td
//                     colSpan="6"
//                     className="text-center py-12 text-gray-500"
//                   >
//                     No employees found.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredEmployees.map(
//                   (employee) => {
//                     const status =
//                       getSalaryStatus(
//                         employee
//                       );

//                     const amount =
//                       getSalaryAmount(
//                         employee
//                       );

//                     return (
//                       <tr
//                         key={
//                           employee._id
//                         }
//                         className="border-t hover:bg-gray-50"
//                       >
//                         <td className="px-4 py-4">
//                           <div className="font-semibold">
//                             {employeeName(
//                               employee
//                             )}
//                           </div>

//                           <div className="text-xs text-gray-500">
//                             {employee.employeeId ||
//                               employee.email ||
//                               "-"}
//                           </div>
//                         </td>

//                         <td className="px-4 py-4">
//                           {employee.department ||
//                             "-"}
//                         </td>

//                         <td className="px-4 py-4">
//                           {employee.designation ||
//                             "-"}
//                         </td>

//                         <td className="px-4 py-4 font-semibold">
//                           {money(amount)}
//                         </td>

//                         <td className="px-4 py-4">
//                           <StatusBadge
//                             status={
//                               status
//                             }
//                           />
//                         </td>

//                         <td className="px-4 py-4">
//                           <div className="flex justify-end gap-2">
//                             {status ===
//                               "NOT_CALCULATED" && (
//                               <button
//                                 onClick={() =>
//                                   handleCalculate(
//                                     employee
//                                   )
//                                 }
//                                 disabled={
//                                   actionLoading
//                                 }
//                                 className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
//                               >
//                                 <Calculator
//                                   size={
//                                     16
//                                   }
//                                 />

//                                 Calculate
//                               </button>
//                             )}

//                             {status ===
//                               "PENDING" && (
//                               <>
//                                 <button
//                                   onClick={() =>
//                                     handleView(
//                                       employee
//                                     )
//                                   }
//                                   className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
//                                 >
//                                   <Eye
//                                     size={
//                                       17
//                                     }
//                                   />
//                                 </button>

//                                 <button
//                                   onClick={() => {
//                                     setSelectedEmployee(
//                                       employee
//                                     );

//                                     setShowPayModal(
//                                       true
//                                     );
//                                   }}
//                                   className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
//                                 >
//                                   <IndianRupee
//                                     size={
//                                       16
//                                     }
//                                   />

//                                   Pay
//                                 </button>
//                               </>
//                             )}

//                             {status ===
//                               "PAID" && (
//                               <button
//                                 onClick={() =>
//                                   handleView(
//                                     employee
//                                   )
//                                 }
//                                 className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
//                               >
//                                 <Eye
//                                   size={
//                                     17
//                                   }
//                                 />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   }
//                 )
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* SALARY DETAIL */}

//       {selectedEmployee &&
//         salaryDetail &&
//         !showPayModal && (
//           <div className="fixed inset-0 z-[2000] bg-black/50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//               <div className="flex items-center justify-between p-5 border-b">
//                 <div>
//                   <h2 className="text-xl font-bold">
//                     Salary Details
//                   </h2>

//                   <p className="text-sm text-gray-500">
//                     {employeeName(
//                       selectedEmployee
//                     )}
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => {
//                     setSelectedEmployee(
//                       null
//                     );

//                     setSalaryDetail(
//                       null
//                     );
//                   }}
//                   className="p-2 hover:bg-gray-100 rounded-lg"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="p-5">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                   <Detail
//                     label="Employee"
//                     value={employeeName(
//                       selectedEmployee
//                     )}
//                   />

//                   <Detail
//                     label="Employee ID"
//                     value={
//                       selectedEmployee.employeeId
//                     }
//                   />

//                   <Detail
//                     label="Department"
//                     value={
//                       selectedEmployee.department
//                     }
//                   />
//                 </div>

//                 <div className="border rounded-xl overflow-hidden">
//                   <div className="bg-gray-100 px-4 py-3 font-semibold">
//                     Salary History
//                   </div>

//                   <div className="overflow-x-auto">
//                     <table className="w-full min-w-[800px]">
//                       <thead>
//                         <tr className="border-b">
//                           <th className="text-left px-4 py-3">
//                             Month
//                           </th>

//                           <th className="text-left px-4 py-3">
//                             Amount
//                           </th>

//                           <th className="text-left px-4 py-3">
//                             Status
//                           </th>

//                           <th className="text-left px-4 py-3">
//                             Payment
//                           </th>

//                           <th className="text-left px-4 py-3">
//                             Date
//                           </th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {(
//                           salaryDetail
//                             ?.salaryHistory ||
//                           selectedEmployee
//                             ?.salaryHistory ||
//                           []
//                         ).map(
//                           (
//                             item,
//                             index
//                           ) => (
//                             <tr
//                               key={
//                                 item._id ||
//                                 index
//                               }
//                               className="border-b"
//                             >
//                               <td className="px-4 py-3">
//                                 {
//                                   item.month
//                                 } /{" "}
//                                 {
//                                   item.year
//                                 }
//                               </td>

//                               <td className="px-4 py-3 font-semibold">
//                                 {money(
//                                   item.netSalary ||
//                                     item.salary ||
//                                     item.amount ||
//                                     item.netAmount
//                                 )}
//                               </td>

//                               <td className="px-4 py-3">
//                                 <StatusBadge
//                                   status={
//                                     item.status ||
//                                     item.paymentStatus ||
//                                     "PENDING"
//                                   }
//                                 />
//                               </td>

//                               <td className="px-4 py-3">
//                                 {item.paymentMethod ||
//                                   item.paymentMode ||
//                                   "-"}
//                               </td>

//                               <td className="px-4 py-3">
//                                 {item.paidAt
//                                   ? new Date(
//                                       item.paidAt
//                                     ).toLocaleDateString(
//                                       "en-IN"
//                                     )
//                                   : "-"}
//                               </td>
//                             </tr>
//                           )
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//       {/* PAY MODAL */}

//       {showPayModal &&
//         selectedEmployee && (
//           <div className="fixed inset-0 z-[2100] bg-black/50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-xl w-full max-w-md">
//               <div className="flex justify-between items-center p-5 border-b">
//                 <div>
//                   <h2 className="text-xl font-bold">
//                     Pay Salary
//                   </h2>

//                   <p className="text-sm text-gray-500">
//                     {employeeName(
//                       selectedEmployee
//                     )}
//                   </p>
//                 </div>

//                 <button
//                   onClick={() =>
//                     setShowPayModal(
//                       false
//                     )
//                   }
//                   className="p-2 rounded-lg hover:bg-gray-100"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="p-5 space-y-5">
//                 <div className="bg-gray-50 rounded-xl p-4">
//                   <p className="text-sm text-gray-500">
//                     Salary Amount
//                   </p>

//                   <p className="text-2xl font-bold mt-1">
//                     {money(
//                       getSalaryAmount(
//                         selectedEmployee
//                       )
//                     )}
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Payment Method
//                   </label>

//                   <div className="grid grid-cols-3 gap-2">
//                     <MethodButton
//                       active={
//                         payMethod ===
//                         "CASH"
//                       }
//                       icon={
//                         <Wallet
//                           size={
//                             18
//                           }
//                         />
//                       }
//                       label="Cash"
//                       onClick={() =>
//                         setPayMethod(
//                           "CASH"
//                         )
//                       }
//                     />

//                     <MethodButton
//                       active={
//                         payMethod ===
//                         "BANK"
//                       }
//                       icon={
//                         <Building2
//                           size={
//                             18
//                           }
//                         />
//                       }
//                       label="Bank"
//                       onClick={() =>
//                         setPayMethod(
//                           "BANK"
//                         )
//                       }
//                     />

//                     <MethodButton
//                       active={
//                         payMethod ===
//                         "UPI"
//                       }
//                       icon={
//                         <Smartphone
//                           size={
//                             18
//                           }
//                         />
//                       }
//                       label="UPI"
//                       onClick={() =>
//                         setPayMethod(
//                           "UPI"
//                         )
//                       }
//                     />
//                   </div>
//                 </div>

//                 {payMethod !==
//                   "CASH" && (
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Transaction / Reference ID
//                     </label>

//                     <input
//                       value={
//                         payReference
//                       }
//                       onChange={(e) =>
//                         setPayReference(
//                           e.target
//                             .value
//                         )
//                       }
//                       placeholder="Enter transaction/reference number"
//                       className="w-full border rounded-lg px-3 py-2.5"
//                     />
//                   </div>
//                 )}

//                 <button
//                   onClick={handlePay}
//                   disabled={
//                     actionLoading
//                   }
//                   className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
//                 >
//                   {actionLoading
//                     ? "Processing..."
//                     : "Confirm Salary Payment"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//     </div>
//   );
// };

// const SalaryCard = ({
//   title,
//   value,
//   amount,
//   icon,
// }) => (
//   <div className="bg-white border rounded-xl shadow-sm p-4">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-sm text-gray-500">
//           {title}
//         </p>

//         <p className="text-2xl font-bold mt-1">
//           {value}
//         </p>

//         {amount !== undefined && (
//           <p className="text-xs text-gray-500 mt-1">
//             {new Intl.NumberFormat(
//               "en-IN",
//               {
//                 style: "currency",
//                 currency: "INR",
//                 maximumFractionDigits: 0,
//               }
//             ).format(
//               Number(amount || 0)
//             )}
//           </p>
//         )}
//       </div>

//       <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
//         {icon}
//       </div>
//     </div>
//   </div>
// );

// const StatusBadge = ({
//   status,
// }) => {
//   const value =
//     String(
//       status || "PENDING"
//     ).toUpperCase();

//   let classes =
//     "bg-gray-100 text-gray-700";

//   if (
//     value === "PAID" ||
//     value === "SUCCESS"
//   ) {
//     classes =
//       "bg-green-100 text-green-700";
//   }

//   if (value === "PENDING") {
//     classes =
//       "bg-yellow-100 text-yellow-700";
//   }

//   if (
//     value === "NOT_CALCULATED"
//   ) {
//     classes =
//       "bg-gray-100 text-gray-600";
//   }

//   return (
//     <span
//       className={`px-2.5 py-1 rounded-full text-xs font-semibold ${classes}`}
//     >
//       {value}
//     </span>
//   );
// };

// const Detail = ({
//   label,
//   value,
// }) => (
//   <div>
//     <p className="text-xs text-gray-500">
//       {label}
//     </p>

//     <p className="font-medium mt-1">
//       {value || "-"}
//     </p>
//   </div>
// );

// const MethodButton = ({
//   active,
//   icon,
//   label,
//   onClick,
// }) => (
//   <button
//     onClick={onClick}
//     className={`border rounded-lg p-3 flex flex-col items-center justify-center gap-1 text-sm ${
//       active
//         ? "border-green-600 bg-green-50 text-green-700"
//         : "hover:bg-gray-50"
//     }`}
//   >
//     {icon}
//     {label}
//   </button>
// );

// export default SalaryManagement;






import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Search,
    RefreshCw,
    CheckCircle,
    Clock,
    XCircle,
    RotateCcw,
    Eye,
    IndianRupee,
    CreditCard,
    Wallet,
    Building2,
    Smartphone,
    Wrench,
    Laptop,
    ShoppingCart,
    CalendarDays,
    X,
    ArrowUpRight,
} from "lucide-react";

import {
    getAllPayments,
    markPaymentSuccess,
    markPaymentFailed,
    refundPayment,
} from "../../services/accountantPaymentService";

import { toast } from "react-toastify";


const SalesPaymentManagement = () => {

    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [moduleFilter, setModuleFilter] =
        useState("ALL");

    const [sourceFilter, setSourceFilter] =
        useState("ALL");

    const [selectedPayment, setSelectedPayment] =
        useState(null);

    const [showRefund, setShowRefund] =
        useState(false);

    const [refundAmount, setRefundAmount] =
        useState("");

    const [refundReason, setRefundReason] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState(false);


    // =========================================================
    // LOAD
    // =========================================================

    const loadPayments = async () => {

        try {

            setLoading(true);

            const response =
                await getAllPayments();

            const data =
                response?.data ||
                response?.payments ||
                response?.data?.payments ||
                response ||
                [];

            const list =
                Array.isArray(data)
                    ? data
                    : [];

            setPayments(list);

        } catch (error) {

            console.error(
                "LOAD SALES PAYMENTS ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to load sales records"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadPayments();

    }, []);


    // =========================================================
    // HELPERS
    // =========================================================

    const getStatus = (payment) => {

        return String(
            payment?.paymentStatus ||
            payment?.status ||
            "PENDING"
        ).toUpperCase();

    };


    const getModule = (payment) => {

        return String(
            payment?.saleModule ||
            payment?.paymentFor ||
            "ORDER"
        ).toUpperCase();

    };


    const getSource = (payment) => {

        const source =
            String(
                payment?.saleSource ||
                payment?.source ||
                payment?.orderSource ||
                payment?.rentalSource ||
                ""
            ).toUpperCase();

        if (
            source === "WALK_IN" ||
            source === "WALKIN" ||
            source === "WALK-IN"
        ) {
            return "WALK_IN";
        }

        if (
            source === "ONLINE"
        ) {
            return "ONLINE";
        }

        /*
         * If backend has not yet added saleSource,
         * do not falsely call unknown data ONLINE.
         */

        return "UNKNOWN";
    };


    const getReferenceNumber = (payment) => {

        return (
            payment?.referenceNumber ||
            payment?.orderNumber ||
            payment?.repairNumber ||
            payment?.rentalNumber ||
            payment?.invoiceNumber ||
            payment?.referenceId ||
            "-"
        );

    };


    const getCustomerName = (payment) => {

        if (
            payment?.customerName
        ) {
            return payment.customerName;
        }

        if (
            payment?.companyName
        ) {
            return payment.companyName;
        }

        if (
            payment?.user &&
            typeof payment.user === "object"
        ) {

            return (
                `${payment.user.firstName || ""} ${
                    payment.user.lastName || ""
                }`
            ).trim() ||
            payment.user.name ||
            payment.user.email ||
            "Customer";

        }

        return "Customer";
    };


    const getCustomerPhone = (payment) => {

        return (
            payment?.customerPhone ||
            payment?.user?.phone ||
            payment?.phone ||
            "-"
        );

    };


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


    const formatDate = (date) => {

        if (!date) return "-";

        const parsed =
            new Date(date);

        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return "-";
        }

        return parsed.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );

    };


    // =========================================================
    // MODULE LABEL
    // =========================================================

    const moduleLabel = (module) => {

        switch (module) {

            case "ORDER":
                return "SALE";

            case "REPAIR":
                return "REPAIR";

            case "RENTAL":
                return "RENTAL";

            default:
                return module || "OTHER";

        }

    };


    const moduleIcon = (module) => {

        switch (module) {

            case "ORDER":
                return (
                    <ShoppingCart size={16} />
                );

            case "REPAIR":
                return (
                    <Wrench size={16} />
                );

            case "RENTAL":
                return (
                    <Laptop size={16} />
                );

            default:
                return (
                    <IndianRupee size={16} />
                );

        }

    };


    // =========================================================
    // STATUS
    // =========================================================

    const statusClass = (status) => {

        switch (status) {

            case "SUCCESS":
            case "PAID":
                return "bg-green-100 text-green-700";

            case "PENDING":
                return "bg-yellow-100 text-yellow-700";

            case "FAILED":
                return "bg-red-100 text-red-700";

            case "REFUNDED":
                return "bg-purple-100 text-purple-700";

            default:
                return "bg-gray-100 text-gray-700";

        }

    };


    // =========================================================
    // SOURCE
    // =========================================================

    const sourceClass = (source) => {

        if (
            source === "ONLINE"
        ) {
            return "bg-blue-100 text-blue-700";
        }

        if (
            source === "WALK_IN"
        ) {
            return "bg-orange-100 text-orange-700";
        }

        return "bg-gray-100 text-gray-600";

    };


    const sourceLabel = (source) => {

        if (
            source === "WALK_IN"
        ) {
            return "WALK-IN";
        }

        if (
            source === "ONLINE"
        ) {
            return "ONLINE";
        }

        return "UNKNOWN";

    };


    // =========================================================
    // PAYMENT ICON
    // =========================================================

    const paymentIcon = (method) => {

        const value =
            String(
                method || ""
            ).toUpperCase();

        if (
            value.includes("CASH")
        ) {
            return (
                <Wallet size={17} />
            );
        }

        if (
            value.includes("BANK") ||
            value.includes("NEFT") ||
            value.includes("RTGS") ||
            value.includes("IMPS") ||
            value.includes("NET_BANKING")
        ) {
            return (
                <Building2 size={17} />
            );
        }

        if (
            value.includes("UPI") ||
            value.includes("PHONE") ||
            value.includes("GPAY")
        ) {
            return (
                <Smartphone size={17} />
            );
        }

        return (
            <CreditCard size={17} />
        );

    };


    // =========================================================
    // FILTER
    // =========================================================

    const filteredPayments = useMemo(() => {

        const keyword =
            search
                .trim()
                .toLowerCase();

        return payments.filter(
            (payment) => {

                const module =
                    getModule(payment);

                const source =
                    getSource(payment);

                const status =
                    getStatus(payment);

                const customer =
                    getCustomerName(payment);

                const reference =
                    getReferenceNumber(payment);

                const phone =
                    getCustomerPhone(payment);

                const matchesSearch =
                    !keyword ||
                    customer
                        .toLowerCase()
                        .includes(keyword) ||
                    reference
                        .toLowerCase()
                        .includes(keyword) ||
                    phone
                        .toLowerCase()
                        .includes(keyword) ||
                    String(
                        payment?.transactionId || ""
                    )
                        .toLowerCase()
                        .includes(keyword) ||
                    String(
                        payment?.receiptNumber || ""
                    )
                        .toLowerCase()
                        .includes(keyword);

                const matchesModule =
                    moduleFilter === "ALL" ||
                    module === moduleFilter;

                const matchesSource =
                    sourceFilter === "ALL" ||
                    source === sourceFilter;

                const matchesStatus =
                    statusFilter === "ALL" ||
                    status === statusFilter;

                return (
                    matchesSearch &&
                    matchesModule &&
                    matchesSource &&
                    matchesStatus
                );

            }
        );

    }, [
        payments,
        search,
        moduleFilter,
        sourceFilter,
        statusFilter,
    ]);


    // =========================================================
    // SUMMARY
    // =========================================================

    const summary = useMemo(() => {

        const successful =
            payments.filter(
                (payment) => {

                    const status =
                        getStatus(payment);

                    return (
                        status === "SUCCESS" ||
                        status === "PAID"
                    );

                }
            );


        const pending =
            payments.filter(
                (payment) =>
                    getStatus(payment) ===
                    "PENDING"
            );


        const online =
            successful.filter(
                (payment) =>
                    getSource(payment) ===
                    "ONLINE"
            );


        const walkIn =
            successful.filter(
                (payment) =>
                    getSource(payment) ===
                    "WALK_IN"
            );


        const repair =
            successful.filter(
                (payment) =>
                    getModule(payment) ===
                    "REPAIR"
            );


        const rental =
            successful.filter(
                (payment) =>
                    getModule(payment) ===
                    "RENTAL"
            );


        const sales =
            successful.filter(
                (payment) =>
                    getModule(payment) ===
                    "ORDER"
            );


        const total =
            successful.reduce(
                (sum, payment) =>
                    sum +
                    Number(
                        payment.amount || 0
                    ),
                0
            );


        const pendingAmount =
            pending.reduce(
                (sum, payment) =>
                    sum +
                    Number(
                        payment.amount || 0
                    ),
                0
            );


        const totalOf = (list) =>
            list.reduce(
                (sum, payment) =>
                    sum +
                    Number(
                        payment.amount || 0
                    ),
                0
            );


        return {

            total,

            pending:
                pendingAmount,

            online:
                totalOf(online),

            walkIn:
                totalOf(walkIn),

            repair:
                totalOf(repair),

            rental:
                totalOf(rental),

            sales:
                totalOf(sales),

        };

    }, [payments]);


    // =========================================================
    // SUCCESS
    // =========================================================

    const handleSuccess = async (
        payment
    ) => {

        try {

            setActionLoading(true);

            await markPaymentSuccess(
                payment._id,
                {
                    transactionId:
                        payment.transactionId ||
                        "",

                    gatewayPaymentId:
                        payment.gatewayPaymentId ||
                        "",

                    gateway:
                        payment.gateway ||
                        "MANUAL",

                    gatewayResponse:
                        {},
                }
            );

            toast.success(
                "Payment marked as successful"
            );

            setSelectedPayment(
                null
            );

            await loadPayments();

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Unable to update payment"
            );

        } finally {

            setActionLoading(false);

        }

    };


    // =========================================================
    // FAILED
    // =========================================================

    const handleFailed = async (
        payment
    ) => {

        const reason =
            window.prompt(
                "Enter failure reason:"
            );

        if (!reason) {
            return;
        }

        try {

            setActionLoading(true);

            await markPaymentFailed(
                payment._id,
                {
                    reason,
                }
            );

            toast.success(
                "Payment marked as failed"
            );

            setSelectedPayment(
                null
            );

            await loadPayments();

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Unable to update payment"
            );

        } finally {

            setActionLoading(false);

        }

    };


    // =========================================================
    // REFUND
    // =========================================================

    const handleRefund = async () => {

        if (!selectedPayment) {
            return;
        }

        const amount =
            Number(refundAmount);


        if (
            !amount ||
            amount <= 0
        ) {

            toast.error(
                "Enter valid refund amount"
            );

            return;
        }


        if (
            amount >
            Number(
                selectedPayment.amount ||
                0
            )
        ) {

            toast.error(
                "Refund amount cannot exceed payment amount"
            );

            return;
        }


        if (
            !refundReason.trim()
        ) {

            toast.error(
                "Refund reason is required"
            );

            return;
        }


        try {

            setActionLoading(true);

            await refundPayment(
                selectedPayment._id,
                {
                    refundReason,
                    refundedAmount:
                        amount,
                }
            );


            toast.success(
                "Refund recorded successfully"
            );


            setShowRefund(
                false
            );

            setRefundAmount(
                ""
            );

            setRefundReason(
                ""
            );

            setSelectedPayment(
                null
            );


            await loadPayments();

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Refund failed"
            );

        } finally {

            setActionLoading(
                false
            );

        }

    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="min-h-screen bg-gray-50 p-4 md:p-6">

            {/* HEADER */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

                <div>

                    <div className="flex items-center gap-2">

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Sales & Payment Management
                        </h1>

                    </div>

                    <p className="text-gray-500 mt-1">
                        Online sales, walk-in sales,
                        repairs and rentals in one place.
                    </p>

                </div>


                <button
                    onClick={loadPayments}
                    disabled={loading}
                    className="
                        flex items-center justify-center
                        gap-2 px-4 py-2.5 rounded-lg
                        bg-gray-800 text-white
                        hover:bg-gray-700
                        disabled:opacity-50
                    "
                >

                    <RefreshCw
                        size={17}
                        className={
                            loading
                                ? "animate-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* SUMMARY */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">

                <SummaryCard
                    title="Total Collected"
                    value={formatMoney(
                        summary.total
                    )}
                    icon={
                        <IndianRupee size={22} />
                    }
                />


                <SummaryCard
                    title="Online"
                    value={formatMoney(
                        summary.online
                    )}
                    icon={
                        <ShoppingCart size={22} />
                    }
                />


                <SummaryCard
                    title="Walk-In"
                    value={formatMoney(
                        summary.walkIn
                    )}
                    icon={
                        <Wallet size={22} />
                    }
                />


                <SummaryCard
                    title="Pending"
                    value={formatMoney(
                        summary.pending
                    )}
                    icon={
                        <Clock size={22} />
                    }
                />

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

                <SummaryCard
                    title="Product Sales"
                    value={formatMoney(
                        summary.sales
                    )}
                    icon={
                        <ShoppingCart size={22} />
                    }
                />


                <SummaryCard
                    title="Repair Sales"
                    value={formatMoney(
                        summary.repair
                    )}
                    icon={
                        <Wrench size={22} />
                    }
                />


                <SummaryCard
                    title="Rental Sales"
                    value={formatMoney(
                        summary.rental
                    )}
                    icon={
                        <Laptop size={22} />
                    }
                />

            </div>


            {/* FILTERS */}

            <div className="bg-white rounded-xl shadow-sm border p-4 mb-5">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

                    <div className="relative">

                        <Search
                            size={18}
                            className="
                                absolute left-3
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                            "
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="
                                Search customer,
                                invoice, transaction...
                            "
                            className="
                                w-full border
                                rounded-lg
                                pl-10 pr-3 py-2.5
                                outline-none
                                focus:ring-2
                                focus:ring-blue-500
                            "
                        />

                    </div>


                    <select
                        value={moduleFilter}
                        onChange={(e) =>
                            setModuleFilter(
                                e.target.value
                            )
                        }
                        className="
                            border rounded-lg
                            px-3 py-2.5
                            outline-none
                        "
                    >

                        <option value="ALL">
                            All Modules
                        </option>

                        <option value="ORDER">
                            Product Sales
                        </option>

                        <option value="REPAIR">
                            Repair
                        </option>

                        <option value="RENTAL">
                            Rental
                        </option>

                    </select>


                    <select
                        value={sourceFilter}
                        onChange={(e) =>
                            setSourceFilter(
                                e.target.value
                            )
                        }
                        className="
                            border rounded-lg
                            px-3 py-2.5
                            outline-none
                        "
                    >

                        <option value="ALL">
                            All Sources
                        </option>

                        <option value="ONLINE">
                            Online
                        </option>

                        <option value="WALK_IN">
                            Walk-In
                        </option>

                        <option value="UNKNOWN">
                            Unknown
                        </option>

                    </select>


                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                        className="
                            border rounded-lg
                            px-3 py-2.5
                            outline-none
                        "
                    >

                        <option value="ALL">
                            All Payment Status
                        </option>

                        <option value="PENDING">
                            Pending
                        </option>

                        <option value="SUCCESS">
                            Success
                        </option>

                        <option value="PAID">
                            Paid
                        </option>

                        <option value="FAILED">
                            Failed
                        </option>

                        <option value="REFUNDED">
                            Refunded
                        </option>

                    </select>

                </div>

            </div>


            {/* TABLE */}

            <div className="
                bg-white rounded-xl
                shadow-sm border
                overflow-hidden
            ">

                <div className="overflow-x-auto">

                    <table className="
                        w-full
                        min-w-[1250px]
                    ">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="text-left px-4 py-3 text-sm">
                                    Date
                                </th>

                                <th className="text-left px-4 py-3 text-sm">
                                    Customer
                                </th>

                                <th className="text-left px-4 py-3 text-sm">
                                    Module
                                </th>

                                <th className="text-left px-4 py-3 text-sm">
                                    Source
                                </th>

                                <th className="text-left px-4 py-3 text-sm">
                                    Reference
                                </th>

                                <th className="text-left px-4 py-3 text-sm">
                                    Amount
                                </th>

                                <th className="text-left px-4 py-3 text-sm">
                                    Method
                                </th>

                                <th className="text-left px-4 py-3 text-sm">
                                    Status
                                </th>

                                <th className="text-right px-4 py-3 text-sm">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="
                                            text-center
                                            py-12
                                            text-gray-500
                                        "
                                    >
                                        Loading sales...
                                    </td>

                                </tr>

                            ) : filteredPayments.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="
                                            text-center
                                            py-12
                                            text-gray-500
                                        "
                                    >
                                        No sales/payment records found.
                                    </td>

                                </tr>

                            ) : (

                                filteredPayments.map(
                                    (payment) => {

                                        const module =
                                            getModule(
                                                payment
                                            );

                                        const source =
                                            getSource(
                                                payment
                                            );

                                        const status =
                                            getStatus(
                                                payment
                                            );

                                        return (

                                            <tr
                                                key={
                                                    payment._id
                                                }
                                                className="
                                                    border-t
                                                    hover:bg-gray-50
                                                "
                                            >

                                                {/* DATE */}

                                                <td className="
                                                    px-4 py-4
                                                    text-sm
                                                    text-gray-600
                                                ">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    ">

                                                        <CalendarDays
                                                            size={15}
                                                        />

                                                        {formatDate(
                                                            payment.paymentDate ||
                                                            payment.createdAt
                                                        )}

                                                    </div>

                                                </td>


                                                {/* CUSTOMER */}

                                                <td className="px-4 py-4">

                                                    <div className="font-medium">

                                                        {
                                                            getCustomerName(
                                                                payment
                                                            )
                                                        }

                                                    </div>

                                                    <div className="
                                                        text-xs
                                                        text-gray-500
                                                    ">

                                                        {
                                                            getCustomerPhone(
                                                                payment
                                                            )
                                                        }

                                                    </div>

                                                </td>


                                                {/* MODULE */}

                                                <td className="px-4 py-4">

                                                    <span className="
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        px-2.5 py-1
                                                        rounded-full
                                                        bg-gray-100
                                                        text-gray-700
                                                        text-xs
                                                        font-semibold
                                                    ">

                                                        {
                                                            moduleIcon(
                                                                module
                                                            )
                                                        }

                                                        {
                                                            moduleLabel(
                                                                module
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* SOURCE */}

                                                <td className="px-4 py-4">

                                                    <span className={`
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        px-2.5 py-1
                                                        rounded-full
                                                        text-xs
                                                        font-semibold
                                                        ${sourceClass(
                                                            source
                                                        )}
                                                    `}>

                                                        <ArrowUpRight
                                                            size={14}
                                                        />

                                                        {
                                                            sourceLabel(
                                                                source
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* REFERENCE */}

                                                <td className="
                                                    px-4 py-4
                                                    font-medium
                                                ">

                                                    {
                                                        getReferenceNumber(
                                                            payment
                                                        )
                                                    }

                                                    <div className="
                                                        text-xs
                                                        text-gray-400
                                                        mt-1
                                                    ">

                                                        Receipt:{" "}

                                                        {
                                                            payment.receiptNumber ||
                                                            "-"
                                                        }

                                                    </div>

                                                </td>


                                                {/* AMOUNT */}

                                                <td className="
                                                    px-4 py-4
                                                    font-semibold
                                                ">

                                                    {
                                                        formatMoney(
                                                            payment.amount
                                                        )
                                                    }

                                                </td>


                                                {/* METHOD */}

                                                <td className="px-4 py-4">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                    ">

                                                        {
                                                            paymentIcon(
                                                                payment.paymentMethod
                                                            )
                                                        }

                                                        <span>
                                                            {
                                                                payment.paymentMethod ||
                                                                "-"
                                                            }
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* STATUS */}

                                                <td className="px-4 py-4">

                                                    <span className={`
                                                        px-2.5 py-1
                                                        rounded-full
                                                        text-xs
                                                        font-semibold
                                                        ${statusClass(
                                                            status
                                                        )}
                                                    `}>

                                                        {
                                                            status
                                                        }

                                                    </span>

                                                </td>


                                                {/* ACTION */}

                                                <td className="px-4 py-4">

                                                    <div className="
                                                        flex
                                                        justify-end
                                                        gap-2
                                                    ">

                                                        <button
                                                            onClick={() =>
                                                                setSelectedPayment(
                                                                    payment
                                                                )
                                                            }
                                                            className="
                                                                p-2
                                                                rounded-lg
                                                                bg-gray-100
                                                                hover:bg-gray-200
                                                            "
                                                            title="View"
                                                        >

                                                            <Eye
                                                                size={17}
                                                            />

                                                        </button>


                                                        {
                                                            status ===
                                                            "PENDING" && (

                                                                <>

                                                                    <button
                                                                        onClick={() =>
                                                                            handleSuccess(
                                                                                payment
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            actionLoading
                                                                        }
                                                                        className="
                                                                            p-2
                                                                            rounded-lg
                                                                            bg-green-100
                                                                            text-green-700
                                                                            hover:bg-green-200
                                                                        "
                                                                        title="Mark Success"
                                                                    >

                                                                        <CheckCircle
                                                                            size={17}
                                                                        />

                                                                    </button>


                                                                    <button
                                                                        onClick={() =>
                                                                            handleFailed(
                                                                                payment
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            actionLoading
                                                                        }
                                                                        className="
                                                                            p-2
                                                                            rounded-lg
                                                                            bg-red-100
                                                                            text-red-700
                                                                            hover:bg-red-200
                                                                        "
                                                                        title="Mark Failed"
                                                                    >

                                                                        <XCircle
                                                                            size={17}
                                                                        />

                                                                    </button>

                                                                </>

                                                            )
                                                        }


                                                        {
                                                            (
                                                                status ===
                                                                "SUCCESS" ||
                                                                status ===
                                                                "PAID"
                                                            ) && (

                                                                <button
                                                                    onClick={() => {

                                                                        setSelectedPayment(
                                                                            payment
                                                                        );

                                                                        setRefundAmount(
                                                                            String(
                                                                                payment.amount ||
                                                                                ""
                                                                            )
                                                                        );

                                                                        setShowRefund(
                                                                            true
                                                                        );

                                                                    }}
                                                                    className="
                                                                        p-2
                                                                        rounded-lg
                                                                        bg-purple-100
                                                                        text-purple-700
                                                                        hover:bg-purple-200
                                                                    "
                                                                    title="Refund"
                                                                >

                                                                    <RotateCcw
                                                                        size={17}
                                                                    />

                                                                </button>

                                                            )
                                                        }

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


            {/* =====================================================
                DETAILS MODAL
            ===================================================== */}

            {
                selectedPayment &&
                !showRefund && (

                    <div className="
                        fixed inset-0
                        z-[2000]
                        bg-black/50
                        flex items-center
                        justify-center
                        p-4
                    ">

                        <div className="
                            bg-white
                            rounded-xl
                            w-full
                            max-w-2xl
                            max-h-[90vh]
                            overflow-y-auto
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                                p-5
                                border-b
                            ">

                                <h2 className="
                                    text-xl
                                    font-bold
                                ">
                                    Sales Details
                                </h2>

                                <button
                                    onClick={() =>
                                        setSelectedPayment(
                                            null
                                        )
                                    }
                                    className="
                                        p-2
                                        rounded-lg
                                        hover:bg-gray-100
                                    "
                                >

                                    <X size={20} />

                                </button>

                            </div>


                            <div className="
                                p-5
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-4
                            ">

                                <Detail
                                    label="Module"
                                    value={moduleLabel(
                                        getModule(
                                            selectedPayment
                                        )
                                    )}
                                />

                                <Detail
                                    label="Source"
                                    value={sourceLabel(
                                        getSource(
                                            selectedPayment
                                        )
                                    )}
                                />

                                <Detail
                                    label="Reference"
                                    value={getReferenceNumber(
                                        selectedPayment
                                    )}
                                />

                                <Detail
                                    label="Customer"
                                    value={getCustomerName(
                                        selectedPayment
                                    )}
                                />

                                <Detail
                                    label="Phone"
                                    value={getCustomerPhone(
                                        selectedPayment
                                    )}
                                />

                                <Detail
                                    label="Amount"
                                    value={formatMoney(
                                        selectedPayment.amount
                                    )}
                                />

                                <Detail
                                    label="Payment For"
                                    value={
                                        selectedPayment.paymentFor ||
                                        "-"
                                    }
                                />

                                <Detail
                                    label="Payment Type"
                                    value={
                                        selectedPayment.paymentType ||
                                        "-"
                                    }
                                />

                                <Detail
                                    label="Payment Method"
                                    value={
                                        selectedPayment.paymentMethod ||
                                        "-"
                                    }
                                />

                                <Detail
                                    label="Status"
                                    value={
                                        selectedPayment.paymentStatus ||
                                        selectedPayment.status ||
                                        "-"
                                    }
                                />

                                <Detail
                                    label="Transaction ID"
                                    value={
                                        selectedPayment.transactionId ||
                                        "-"
                                    }
                                />

                                <Detail
                                    label="Receipt Number"
                                    value={
                                        selectedPayment.receiptNumber ||
                                        "-"
                                    }
                                />

                                <Detail
                                    label="Payment Date"
                                    value={formatDate(
                                        selectedPayment.paymentDate ||
                                        selectedPayment.createdAt
                                    )}
                                />

                                <div className="md:col-span-2">

                                    <Detail
                                        label="Reference ID"
                                        value={
                                            selectedPayment.referenceId ||
                                            "-"
                                        }
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                )
            }


            {/* =====================================================
                REFUND MODAL
            ===================================================== */}

            {
                showRefund &&
                selectedPayment && (

                    <div className="
                        fixed inset-0
                        z-[2100]
                        bg-black/50
                        flex items-center
                        justify-center
                        p-4
                    ">

                        <div className="
                            bg-white
                            rounded-xl
                            w-full
                            max-w-md
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                                p-5
                                border-b
                            ">

                                <h2 className="
                                    text-xl
                                    font-bold
                                ">
                                    Record Refund
                                </h2>

                                <button
                                    onClick={() =>
                                        setShowRefund(
                                            false
                                        )
                                    }
                                    className="
                                        p-2
                                        rounded-lg
                                        hover:bg-gray-100
                                    "
                                >

                                    <X size={20} />

                                </button>

                            </div>


                            <div className="
                                p-5
                                space-y-4
                            ">

                                <div>

                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        mb-1
                                    ">
                                        Sale
                                    </label>

                                    <div className="
                                        p-3
                                        rounded-lg
                                        bg-gray-100
                                        font-semibold
                                    ">

                                        {
                                            moduleLabel(
                                                getModule(
                                                    selectedPayment
                                                )
                                            )
                                        }

                                        {" / "}

                                        {
                                            sourceLabel(
                                                getSource(
                                                    selectedPayment
                                                )
                                            )
                                        }

                                    </div>

                                </div>


                                <div>

                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        mb-1
                                    ">
                                        Original Amount
                                    </label>

                                    <div className="
                                        p-3
                                        rounded-lg
                                        bg-gray-100
                                        font-semibold
                                    ">

                                        {
                                            formatMoney(
                                                selectedPayment.amount
                                            )
                                        }

                                    </div>

                                </div>


                                <div>

                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        mb-1
                                    ">
                                        Refund Amount
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={
                                            refundAmount
                                        }
                                        onChange={(e) =>
                                            setRefundAmount(
                                                e.target.value
                                            )
                                        }
                                        className="
                                            w-full
                                            border
                                            rounded-lg
                                            px-3
                                            py-2.5
                                            outline-none
                                            focus:ring-2
                                            focus:ring-purple-500
                                        "
                                    />

                                </div>


                                <div>

                                    <label className="
                                        block
                                        text-sm
                                        font-medium
                                        mb-1
                                    ">
                                        Refund Reason
                                    </label>

                                    <textarea
                                        value={
                                            refundReason
                                        }
                                        onChange={(e) =>
                                            setRefundReason(
                                                e.target.value
                                            )
                                        }
                                        rows="4"
                                        placeholder="
                                            Enter refund reason...
                                        "
                                        className="
                                            w-full
                                            border
                                            rounded-lg
                                            px-3
                                            py-2.5
                                            outline-none
                                            focus:ring-2
                                            focus:ring-purple-500
                                        "
                                    />

                                </div>


                                <button
                                    onClick={
                                        handleRefund
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                    className="
                                        w-full
                                        py-3
                                        rounded-lg
                                        bg-purple-600
                                        text-white
                                        font-semibold
                                        hover:bg-purple-700
                                        disabled:opacity-50
                                    "
                                >

                                    {
                                        actionLoading
                                            ? "Processing..."
                                            : "Record Refund"
                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>

    );
};


// =========================================================
// SUMMARY CARD
// =========================================================

const SummaryCard = ({
    title,
    value,
    icon,
}) => (

    <div className="
        bg-white
        rounded-xl
        border
        shadow-sm
        p-5
    ">

        <div className="
            flex
            items-center
            justify-between
        ">

            <div>

                <p className="
                    text-sm
                    text-gray-500
                ">
                    {title}
                </p>

                <h3 className="
                    text-xl
                    font-bold
                    mt-2
                    text-gray-800
                ">
                    {value}
                </h3>

            </div>

            <div className="
                w-11
                h-11
                rounded-lg
                bg-gray-100
                flex
                items-center
                justify-center
                text-gray-700
            ">

                {icon}

            </div>

        </div>

    </div>

);


// =========================================================
// DETAIL
// =========================================================

const Detail = ({
    label,
    value,
}) => (

    <div className="
        border
        rounded-lg
        p-3
        bg-gray-50
    ">

        <p className="
            text-xs
            text-gray-500
            mb-1
        ">
            {label}
        </p>

        <p className="
            font-semibold
            text-gray-800
            break-words
        ">
            {value || "-"}
        </p>

    </div>

);


export default SalesPaymentManagement;
