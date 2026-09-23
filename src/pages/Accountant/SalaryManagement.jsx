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

    return `${firstName} ${lastName}`.trim() || "Employee";
};


const getEmployeeId = (employee) => {
    return (
        employee?.employeeId ||
        employee?.employeeCode ||
        employee?.user?.employeeId ||
        "-"
    );
};


const getDepartment = (employee) => {
    return (
        employee?.department ||
        employee?.departmentName ||
        "-"
    );
};


const getDesignation = (employee) => {
    return (
        employee?.designation ||
        employee?.role ||
        "-"
    );
};


const getSalaryType = (employee) => {
    return (
        employee?.salaryType ||
        employee?.salaryMode ||
        "MONTHLY"
    );
};


const getBaseSalary = (employee) => {
    return Number(
        employee?.baseSalary ||
        employee?.monthlySalary ||
        employee?.salary ||
        0
    );
};


const getPaidAmount = (employee) => {
    return Number(
        employee?.totalPaidAmount ||
        employee?.paidAmount ||
        0
    );
};


const getPendingAmount = (employee) => {
    const salary = getBaseSalary(employee);
    const paid = getPaidAmount(employee);

    return Math.max(
        salary - paid,
        0
    );
};


const getStatus = (employee) => {
    return String(
        employee?.status ||
        "ACTIVE"
    ).toUpperCase();
};


const getInitials = (name) => {
    const value = String(
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
// PAYMENT METHOD ICON
// ======================================================

const PaymentMethodIcon = ({
    method,
}) => {

    const value = String(
        method || ""
    ).toUpperCase();

    if (value.includes("CASH")) {
        return <Wallet size={16} />;
    }

    if (
        value.includes("BANK") ||
        value.includes("NEFT") ||
        value.includes("RTGS") ||
        value.includes("IMPS")
    ) {
        return <Building2 size={16} />;
    }

    if (
        value.includes("UPI") ||
        value.includes("GPAY") ||
        value.includes("PHONE")
    ) {
        return <Smartphone size={16} />;
    }

    return <CreditCard size={16} />;
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
    // LOAD EMPLOYEES
    // ==================================================

    const loadSalaryData = async () => {

        try {

            setLoading(true);

            const response =
                await getAllSalaryData();

            console.log(
                "ACCOUNTANT SALARY RESPONSE:",
                response
            );

            let list = [];

            if (
                Array.isArray(
                    response?.data
                )
            ) {

                list =
                    response.data;

            } else if (
                Array.isArray(response)
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
                    response?.employees
                )
            ) {

                list =
                    response.employees;

            }

            setEmployees(list);

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


    useEffect(() => {

        loadSalaryData();

    }, []);


    // ==================================================
    // DEPARTMENTS
    // ==================================================

    const departments = useMemo(() => {

        const values =
            employees
                .map(
                    (employee) =>
                        getDepartment(employee)
                )
                .filter(
                    (value) =>
                        value &&
                        value !== "-"
                );

        return [
            ...new Set(values),
        ];

    }, [employees]);


    // ==================================================
    // SALARY TYPES
    // ==================================================

    const salaryTypes = useMemo(() => {

        const values =
            employees
                .map(
                    (employee) =>
                        getSalaryType(employee)
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

                    const name =
                        getEmployeeName(
                            employee
                        ).toLowerCase();

                    const employeeId =
                        getEmployeeId(
                            employee
                        ).toLowerCase();

                    const department =
                        getDepartment(
                            employee
                        ).toLowerCase();

                    const designation =
                        getDesignation(
                            employee
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
                        name.includes(keyword) ||
                        employeeId.includes(keyword) ||
                        department.includes(keyword) ||
                        designation.includes(keyword) ||
                        salaryType.includes(keyword);


                    const matchesStatus =
                        statusFilter === "ALL" ||
                        status === statusFilter;


                    const matchesDepartment =
                        departmentFilter === "ALL" ||
                        getDepartment(employee) ===
                            departmentFilter;


                    const matchesSalaryType =
                        salaryTypeFilter === "ALL" ||
                        getSalaryType(employee) ===
                            salaryTypeFilter;


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

    const summary = useMemo(() => {

        const totalEmployees =
            employees.length;


        const activeEmployees =
            employees.filter(
                (employee) =>
                    getStatus(employee) ===
                    "ACTIVE"
            ).length;


        const totalSalary =
            employees.reduce(
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
            employees.reduce(
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
            employees.reduce(
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

    const handleExport = async () => {

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
                            <IndianRupee size={24} />
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
                        <Users size={22} />
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
                        <Wallet size={22} />
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
                        <Clock3 size={22} />
                    }
                    type="orange"
                />

            </div>


            {/* ==========================================
                FILTERS
            ========================================== */}

            <div className="salary-filter-box">

                <div className="salary-search-box">

                    <Search size={18} />

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
                                key={type}
                                value={type}
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
                            {filteredEmployees.length}
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
                                                    getEmployeeId(
                                                        employee
                                                    )
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


                                                {/* TYPE */}

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
                        {filteredEmployees.length}
                    </strong>

                    <span>
                        of
                    </span>

                    <strong>
                        {employees.length}
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
                EMPLOYEE DETAILS MODAL
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

                        <X size={20} />

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
                        value={name}
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

                            /*
                             * IMPORTANT:
                             *
                             * If you already have SalaryModal.jsx
                             * from HR page, open that component
                             * here instead of creating another
                             * payment system.
                             *
                             * For now we refresh the salary list.
                             */

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
// DETAIL
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