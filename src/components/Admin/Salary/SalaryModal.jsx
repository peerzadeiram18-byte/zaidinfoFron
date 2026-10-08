// import React, {
//   useEffect,
//   useState,
// } from "react";

// import {
//   getEmployeeSalary,
//   configSalaryDetails,
//   updateSalaryPayment,
// } from "../../../services/salary.api";

// import "./SalaryModal.css";

// import { toast } from "react-toastify";

// const SalaryModal = ({
//   employeeId,
//   onClose,
// }) => {

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   const [activeTab, setActiveTab] =
//     useState("overview");

//   const [salaryData, setSalaryData] =
//     useState(null);

//   // ==========================================
//   // SALARY CONFIG FORM
//   // ==========================================

//   const [configForm, setConfigForm] =
//     useState({
//       salaryType: "MONTHLY",
//       amount: "",
//       joiningDate: "",
//     });

//   // ==========================================
//   // PAYMENT FORM
//   // ==========================================

//   const [payForm, setPayForm] =
//     useState({
//       month: new Date().toLocaleString(
//         "default",
//         {
//           month: "long",
//           year: "numeric",
//         }
//       ),

//       amount: "",

//       paymentDate:
//         new Date()
//           .toISOString()
//           .split("T")[0],

//       paymentMode: "BANK",

//       status: "PAID",

//       remark: "",
//     });

//   // ==========================================
//   // FETCH SALARY
//   // ==========================================

//   const fetchSalary = async () => {
//     if (!employeeId) {
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const res =
//         await getEmployeeSalary(
//           employeeId
//         );

//       console.log(
//         "Employee Salary:",
//         res
//       );

//       if (!res?.success) {
//         throw new Error(
//           res?.message ||
//             "Unable to load salary"
//         );
//       }

//       const data = res?.data || {};

//       setSalaryData(data);

//       // ======================================
//       // CONFIG FORM
//       // ======================================

//       setConfigForm({
//         salaryType:
//           data?.salaryDetails
//             ?.salaryType ||
//           "MONTHLY",

//         amount:
//           data?.salaryDetails
//             ?.amount ?? "",

//         joiningDate:
//           data?.salaryDetails
//             ?.joiningDate
//             ? new Date(
//                 data.salaryDetails
//                   .joiningDate
//               )
//                 .toISOString()
//                 .split("T")[0]
//             : "",
//       });

//       // ======================================
//       // PAYMENT FORM
//       // ======================================

//       setPayForm((prev) => ({
//         ...prev,

//         amount:
//           data?.salaryDetails
//             ?.amount ?? "",
//       }));

//     } catch (err) {

//       console.error(
//         "Fetch salary error:",
//         err
//       );

//       const message =
//         err?.response?.data?.message ||
//         err?.response?.data?.error ||
//         err?.message ||
//         "Unable to load salary.";

//       setError(message);

//       toast.error(message);

//     } finally {

//       setLoading(false);

//     }
//   };

//   // ==========================================
//   // EFFECT
//   // ==========================================

//   useEffect(() => {
//     if (employeeId) {
//       fetchSalary();
//     }
//   }, [employeeId]);

//   // ==========================================
//   // SALARY CONFIG
//   // ==========================================

//   const handleSalaryConfig = async (
//     event
//   ) => {

//     event.preventDefault();

//     try {

//       const amount = Number(
//         configForm.amount || 0
//       );

//       if (amount <= 0) {
//         toast.error(
//           "Please enter valid salary amount"
//         );

//         return;
//       }

//       await configSalaryDetails(
//         employeeId,
//         {
//           salaryType:
//             configForm.salaryType,

//           amount,

//           joiningDate:
//             configForm.joiningDate,
//         }
//       );

//       toast.success(
//         "Salary Updated Successfully"
//       );

//       await fetchSalary();

//       setActiveTab("overview");

//     } catch (err) {

//       console.error(
//         "Salary config error:",
//         err
//       );

//       toast.error(
//         err?.response?.data?.message ||
//           err?.response?.data?.error ||
//           err?.message ||
//           "Update Failed"
//       );

//     }
//   };

//   // ==========================================
//   // SALARY PAYMENT
//   // ==========================================

//   const handleSalaryPayment = async (
//     event
//   ) => {

//     event.preventDefault();

//     try {

//       const amount = Number(
//         payForm.amount || 0
//       );

//       if (amount <= 0) {

//         toast.error(
//           "Please enter valid salary amount"
//         );

//         return;
//       }

//       if (!payForm.month?.trim()) {

//         toast.error(
//           "Please enter salary month"
//         );

//         return;
//       }

//       if (!payForm.paymentDate) {

//         toast.error(
//           "Please select payment date"
//         );

//         return;
//       }

//       await updateSalaryPayment(
//         employeeId,
//         {
//           month:
//             payForm.month.trim(),

//           amount,

//           paymentDate:
//             payForm.paymentDate,

//           paymentMode:
//             payForm.paymentMode,

//           status:
//             payForm.status,

//           remark:
//             payForm.remark?.trim() || "",
//         }
//       );

//       toast.success(
//         "Salary Paid Successfully"
//       );

//       await fetchSalary();

//       setActiveTab("overview");

//     } catch (err) {

//       console.error(
//         "Salary payment error:",
//         err
//       );

//       toast.error(
//         err?.response?.data?.message ||
//           err?.response?.data?.error ||
//           err?.message ||
//           "Payment Failed"
//       );

//     }
//   };

//   // ==========================================
//   // LOADING
//   // ==========================================

//   if (loading) {

//     return (
//       <div className="salary-modal-overlay">

//         <div className="salary-modal">

//           <div className="salary-loading">
//             Loading Salary...
//           </div>

//         </div>

//       </div>
//     );
//   }

//   // ==========================================
//   // EMPLOYEE DATA
//   // ==========================================

//   const employeeName =
//     salaryData?.name ||
//     salaryData?.employeeName ||
//     salaryData?.employee?.name ||
//     "N/A";

//   const email =
//     salaryData?.email ||
//     salaryData?.employee?.email ||
//     "N/A";

//   const salaryType =
//     salaryData?.salaryDetails
//       ?.salaryType ||
//     "MONTHLY";

//   const amount =
//     Number(
//       salaryData?.salaryDetails
//         ?.amount || 0
//     );

//   const joiningDate =
//     salaryData?.salaryDetails
//       ?.joiningDate
//       ? new Date(
//           salaryData.salaryDetails
//             .joiningDate
//         ).toLocaleDateString(
//           "en-IN"
//         )
//       : "-";

//   // ==========================================
//   // RENDER
//   // ==========================================

//   return (
//     <div className="salary-modal-overlay">

//       <div className="salary-modal">

//         {/* ====================================
//             HEADER
//         ==================================== */}

//         <div className="salary-header">

//           <h2>
//             Employee Salary Management
//           </h2>

//           <button
//             type="button"
//             onClick={onClose}
//             className="close-btn"
//           >
//             ✕
//           </button>

//         </div>

//         {/* ====================================
//             EMPLOYEE CARD
//         ==================================== */}

//         <div className="employee-card">

//           <h3>
//             {employeeName}
//           </h3>

//           <p>
//             {email}
//           </p>

//           <p>
//             Joining: {joiningDate}
//           </p>

//           <p>
//             Salary: ₹
//             {amount.toLocaleString(
//               "en-IN"
//             )}
//           </p>

//           <p>
//             Type: {salaryType}
//           </p>

//         </div>

//         {/* ====================================
//             TABS
//         ==================================== */}

//         <div className="salary-tabs">

//           <button
//             type="button"
//             className={
//               activeTab === "overview"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setActiveTab(
//                 "overview"
//               )
//             }
//           >
//             Overview
//           </button>

//           <button
//             type="button"
//             className={
//               activeTab === "payment"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setActiveTab(
//                 "payment"
//               )
//             }
//           >
//             Add Payment
//           </button>

//           <button
//             type="button"
//             className={
//               activeTab === "config"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setActiveTab(
//                 "config"
//               )
//             }
//           >
//             Salary Structure
//           </button>

//         </div>

//         {/* ====================================
//             ERROR
//         ==================================== */}

//         {error && (

//           <div className="salary-error">

//             {error}

//           </div>

//         )}

//         {/* ====================================
//             OVERVIEW
//         ==================================== */}

//         {activeTab === "overview" && (

//           <div className="overview-section">

//             <div className="summary-grid">

//               <div className="summary-card">

//                 <h4>
//                   Salary Type
//                 </h4>

//                 <h2>
//                   {salaryType}
//                 </h2>

//               </div>

//               <div className="summary-card">

//                 <h4>
//                   Base Salary
//                 </h4>

//                 <h2>
//                   ₹
//                   {amount.toLocaleString(
//                     "en-IN"
//                   )}
//                 </h2>

//               </div>

//               <div className="summary-card">

//                 <h4>
//                   Total Paid
//                 </h4>

//                 <h2 className="greeen">

//                   ₹
//                   {Number(
//                     salaryData?.totalPaidAmount ||
//                       0
//                   ).toLocaleString(
//                     "en-IN"
//                   )}

//                 </h2>

//               </div>

//             </div>

//             {/* ================================
//                 PAYMENT HISTORY
//             ================================= */}

//             <div className="history-title">
//               Payment History
//             </div>

//             <div className="salary-history-wrapper">

//               <table className="salary-history-table">

//                 <thead>

//                   <tr>

//                     <th>
//                       Month
//                     </th>

//                     <th>
//                       Amount
//                     </th>

//                     <th>
//                       Mode
//                     </th>

//                     <th>
//                       Date
//                     </th>

//                     <th>
//                       Status
//                     </th>

//                     <th>
//                       Review 
//                     </th>

//                   </tr>

//                 </thead>

//                 <tbody>

//                   {Array.isArray(
//                     salaryData?.salaryHistory
//                   ) &&
//                   salaryData
//                     .salaryHistory
//                     .length > 0 ? (

//                     salaryData.salaryHistory.map(
//                       (item) => (

//                         <tr
//                           key={
//                             item?._id ||
//                             `${item?.month}-${item?.paymentDate}`
//                           }
//                         >

//                           <td>
//                             {item?.month ||
//                               "-"}
//                           </td>

//                           <td>
//                             ₹
//                             {Number(
//                               item?.amount ||
//                                 0
//                             ).toLocaleString(
//                               "en-IN"
//                             )}
//                           </td>

//                           <td>
//                             {item?.paymentMode ||
//                               "-"}
//                           </td>

//                           <td>
//                             {item?.paymentDate
//                               ? new Date(
//                                   item.paymentDate
//                                 ).toLocaleDateString(
//                                   "en-IN"
//                                 )
//                               : "-"}
//                           </td>

//                           <td>

//                             <span
//                               className={
//                                 item?.status ===
//                                 "PAID"
//                                   ? "paid-badge"
//                                   : "pending-badge"
//                               }
//                             >
//                               {item?.status ||
//                                 "-"}
//                             </span>

//                           </td>

//                           <td>

//                             {item?.remark
//                               ?.trim()
//                               ? item.remark
//                               : "-"}

//                           </td>

//                         </tr>

//                       )
//                     )

//                   ) : (

//                     <tr>

//                       <td
//                         colSpan="6"
//                         style={{
//                           textAlign:
//                             "center",
//                           padding:
//                             "30px",
//                         }}
//                       >
//                         No Salary History Available
//                       </td>

//                     </tr>

//                   )}

//                 </tbody>

//               </table>

//             </div>

//           </div>

//         )}

//         {/* ====================================
//             PAYMENT
//         ==================================== */}

//         {activeTab === "payment" && (

//           <form
//             className="salary-form"
//             onSubmit={
//               handleSalaryPayment
//             }
//           >

//             <div className="form-row">

//               <div className="form-group">

//                 <label>
//                   Month
//                 </label>

//                 <input
//                   type="text"
//                   value={
//                     payForm.month
//                   }
//                   onChange={(event) =>
//                     setPayForm({
//                       ...payForm,
//                       month:
//                         event.target.value,
//                     })
//                   }
//                   placeholder="August 2026"
//                 />

//               </div>

//               <div className="form-group">

//                 <label>
//                   Salary Amount
//                 </label>

//                 <input
//                   type="number"
//                   min="0"
//                   value={
//                     payForm.amount
//                   }
//                   onChange={(event) =>
//                     setPayForm({
//                       ...payForm,
//                       amount:
//                         event.target.value,
//                     })
//                   }
//                 />

//               </div>

//             </div>

//             <div className="form-row">

//               <div className="form-group">

//                 <label>
//                   Payment Date
//                 </label>

//                 <input
//                   type="date"
//                   value={
//                     payForm.paymentDate
//                   }
//                   onChange={(event) =>
//                     setPayForm({
//                       ...payForm,
//                       paymentDate:
//                         event.target.value,
//                     })
//                   }
//                 />

//               </div>

//               <div className="form-group">

//                 <label>
//                   Payment Mode
//                 </label>

//                 <select
//                   value={
//                     payForm.paymentMode
//                   }
//                   onChange={(event) =>
//                     setPayForm({
//                       ...payForm,
//                       paymentMode:
//                         event.target.value,
//                     })
//                   }
//                 >

//                   <option value="BANK">
//                     Bank
//                   </option>

//                   <option value="UPI">
//                     UPI
//                   </option>

//                   <option value="CASH">
//                     Cash
//                   </option>

//                 </select>

//               </div>

//             </div>

//             <div className="form-row">

//               <div className="form-group">

//                 <label>
//                   Status
//                 </label>

//                 <select
//                   value={
//                     payForm.status
//                   }
//                   onChange={(event) =>
//                     setPayForm({
//                       ...payForm,
//                       status:
//                         event.target.value,
//                     })
//                   }
//                 >

//                   <option value="PAID">
//                     PAID
//                   </option>

//                   <option value="PENDING">
//                     PENDING
//                   </option>

//                 </select>

//               </div>

//             </div>

//             <div className="form-group">

//               <label>
//                 Review 
//               </label>

//               <textarea
//                 rows="3"
//                 value={
//                   payForm.remark
//                 }
//                 onChange={(event) =>
//                   setPayForm({
//                     ...payForm,
//                     remark:
//                       event.target.value,
//                   })
//                 }
//                 placeholder="Enter review ..."
//               />

//             </div>

//             <button
//               type="submit"
//               className="save-btn"
//             >
//               Record Salary Payment
//             </button>

//           </form>

//         )}

//         {/* ====================================
//             SALARY CONFIG
//         ==================================== */}

//         {activeTab === "config" && (

//           <form
//             className="salary-form"
//             onSubmit={
//               handleSalaryConfig
//             }
//           >

//             <div className="form-group">

//               <label>
//                 Salary Type
//               </label>

//               <select
//                 value={
//                   configForm.salaryType
//                 }
//                 onChange={(event) =>
//                   setConfigForm({
//                     ...configForm,
//                     salaryType:
//                       event.target.value,
//                   })
//                 }
//               >

//                 <option value="MONTHLY">
//                   MONTHLY
//                 </option>

//                 <option value="DAILY">
//                   DAILY
//                 </option>

//               </select>

//             </div>

//             <div className="form-group">

//               <label>
//                 Salary Amount
//               </label>

//               <input
//                 type="number"
//                 min="0"
//                 value={
//                   configForm.amount
//                 }
//                 onChange={(event) =>
//                   setConfigForm({
//                     ...configForm,
//                     amount:
//                       event.target.value,
//                   })
//                 }
//               />

//             </div>

//             <div className="form-group">

//               <label>
//                 Joining Date
//               </label>

//               <input
//                 type="date"
//                 value={
//                   configForm.joiningDate
//                 }
//                 onChange={(event) =>
//                   setConfigForm({
//                     ...configForm,
//                     joiningDate:
//                       event.target.value,
//                   })
//                 }
//               />

//             </div>

//             <button
//               type="submit"
//               className="save-btn"
//             >
//               Update Salary Structure
//             </button>

//           </form>

//         )}

//       </div>

//     </div>
//   );
// };

// export default SalaryModal;



import React, {
  useEffect,
  useState,
} from "react";

import {
  getEmployeeSalary,
  configSalaryDetails,
  updateSalaryPayment,
} from "../../../services/salary.api";

import "./SalaryModal.css";

import { toast } from "react-toastify";

import axios from "axios";

import BankDetails from "./BankDetails";
const API_BASE_URL =
  import.meta.env.VITE_API_URL;

const SalaryModal = ({
  employeeId,
  onClose,
}) => {

  // ======================================================
  // STATES
  // ======================================================

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [activeTab, setActiveTab] =
    useState("overview");

  const [salaryData, setSalaryData] =
    useState(null);


  // ======================================================
  // SALARY CONFIG FORM
  // ======================================================

  const [configForm, setConfigForm] =
    useState({
      salaryType: "MONTHLY",
      amount: "",
      joiningDate: "",
    });


  // ======================================================
  // PAYMENT FORM
  // ======================================================

  const [payForm, setPayForm] =
    useState({
      month: new Date().toLocaleString(
        "default",
        {
          month: "long",
          year: "numeric",
        }
      ),

      amount: "",

      paymentDate:
        new Date()
          .toISOString()
          .split("T")[0],

      paymentMode: "BANK",

      status: "PAID",

      remark: "",
    });


  // ======================================================
  // FETCH SALARY
  // ======================================================

  const fetchSalary = async () => {

    if (!employeeId) {
      return;
    }

    try {

      setLoading(true);

      setError("");

      const res =
        await getEmployeeSalary(
          employeeId
        );

      console.log(
        "Employee Salary:",
        res
      );


      if (!res?.success) {

        throw new Error(
          res?.message ||
          "Unable to load salary"
        );

      }


      const data =
        res?.data || {};


      console.log(
        "Salary Details:",
        data?.salaryDetails
      );

      console.log(
        "Bank Details:",
        data?.bankDetails
      );


      setSalaryData(data);


      // ==================================================
      // CONFIG FORM
      // ==================================================

      setConfigForm({

        salaryType:
          data?.salaryDetails
            ?.salaryType ||
          "MONTHLY",

        amount:
          data?.salaryDetails
            ?.amount ?? "",

        joiningDate:
          data?.salaryDetails
            ?.joiningDate
            ? new Date(
                data.salaryDetails
                  .joiningDate
              )
                .toISOString()
                .split("T")[0]
            : "",

      });


      // ==================================================
      // PAYMENT FORM
      // ==================================================

      setPayForm((prev) => ({

        ...prev,

        amount:
          data?.salaryDetails
            ?.amount ?? "",

      }));


    } catch (err) {

      console.error(
        "Fetch salary error:",
        err
      );


      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to load salary.";


      setError(message);

      toast.error(message);


    } finally {

      setLoading(false);

    }

  };


  // ======================================================
  // EFFECT
  // ======================================================

  useEffect(() => {

    if (employeeId) {

      fetchSalary();

    }

  }, [employeeId]);


  // ======================================================
  // SALARY CONFIG
  // ======================================================

  const handleSalaryConfig =
    async (event) => {

      event.preventDefault();

      try {

        const amount =
          Number(
            configForm.amount || 0
          );


        if (amount <= 0) {

          toast.error(
            "Please enter valid salary amount"
          );

          return;

        }


        await configSalaryDetails(
          employeeId,
          {
            salaryType:
              configForm.salaryType,

            amount,

            joiningDate:
              configForm.joiningDate,
          }
        );


        toast.success(
          "Salary Updated Successfully"
        );


        await fetchSalary();


        setActiveTab(
          "overview"
        );


      } catch (err) {

        console.error(
          "Salary config error:",
          err
        );


        toast.error(
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Update Failed"
        );

      }

    };


const getSalaryRecordId = () => {
  const history = Array.isArray(salaryData?.salaryHistory)
    ? salaryData.salaryHistory
    : [];

  console.log("====================================");
  console.log("SALARY HISTORY:", history);
  console.log("PAY FORM MONTH:", payForm.month);
  console.log("====================================");

  if (!history.length) {
    console.error("NO SALARY HISTORY FOUND");
    return null;
  }

  // --------------------------------------------------
  // 1. First try current month
  // --------------------------------------------------

  const now = new Date();

  const currentMonth =
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  console.log("CURRENT MONTH:", currentMonth);

  const currentPendingRecord = history.find((record) => {
    const recordMonth = String(record?.month || "").trim();
    const recordStatus = String(record?.status || "").toUpperCase();

    return (
      recordMonth === currentMonth &&
      recordStatus === "PENDING"
    );
  });

  if (currentPendingRecord?._id) {
    console.log(
      "CURRENT MONTH PENDING RECORD:",
      currentPendingRecord
    );

    return currentPendingRecord._id;
  }

  // --------------------------------------------------
  // 2. Convert "October 2026" -> "2026-10"
  // --------------------------------------------------

  const inputMonth = String(payForm.month || "").trim();

  if (inputMonth) {
    const parsedDate = new Date(`${inputMonth} 1`);

    if (!Number.isNaN(parsedDate.getTime())) {
      const normalizedMonth =
        `${parsedDate.getFullYear()}-${String(
          parsedDate.getMonth() + 1
        ).padStart(2, "0")}`;

      console.log(
        "NORMALIZED PAYMENT MONTH:",
        normalizedMonth
      );

      const matchedRecord = history.find((record) => {
        const recordMonth = String(record?.month || "").trim();
        const recordStatus =
          String(record?.status || "").toUpperCase();

        return (
          recordMonth === normalizedMonth &&
          recordStatus === "PENDING"
        );
      });

      if (matchedRecord?._id) {
        console.log(
          "MATCHED PENDING SALARY RECORD:",
          matchedRecord
        );

        return matchedRecord._id;
      }
    }
  }

  // --------------------------------------------------
  // 3. Last fallback: latest PENDING record
  // --------------------------------------------------

  const pendingRecords = history.filter(
    (record) =>
      String(record?.status || "").toUpperCase() === "PENDING"
  );

  console.log(
    "ALL PENDING RECORDS:",
    pendingRecords
  );

  if (pendingRecords.length > 0) {
    const latestPending =
      pendingRecords[pendingRecords.length - 1];

    console.log(
      "USING LATEST PENDING RECORD:",
      latestPending
    );

    return latestPending?._id || null;
  }

  console.error("NO PENDING SALARY RECORD FOUND");

  return null;
};

  // ======================================================
  // SALARY PAYMENT
  // ======================================================

  // const handleSalaryPayment =
  //   async (event) => {

  //     event.preventDefault();

  //     try {

  //       const amount =
  //         Number(
  //           payForm.amount || 0
  //         );


  //       if (amount <= 0) {

  //         toast.error(
  //           "Please enter valid salary amount"
  //         );

  //         return;

  //       }


  //       if (!payForm.month?.trim()) {

  //         toast.error(
  //           "Please enter salary month"
  //         );

  //         return;

  //       }


  //       if (!payForm.paymentDate) {

  //         toast.error(
  //           "Please select payment date"
  //         );

  //         return;

  //       }


  //       // ==================================================
  //       // BANK DETAILS CHECK
  //       // ==================================================

  //       if (
  //         payForm.paymentMode ===
  //         "BANK"
  //       ) {

  //         const bank =
  //           salaryData?.bankDetails;


  //         if (!bank) {

  //           toast.error(
  //             "Employee bank details are not available"
  //           );

  //           setActiveTab(
  //             "bank"
  //           );

  //           return;

  //         }


  //         if (
  //           !bank?.accountHolderName ||
  //           !bank?.accountNumber ||
  //           !bank?.ifscCode ||
  //           !bank?.bankName
  //         ) {

  //           toast.error(
  //             "Complete bank details are required for bank salary payment"
  //           );

  //           setActiveTab(
  //             "bank"
  //           );

  //           return;

  //         }

  //       }


  //       await updateSalaryPayment(
  //         employeeId,
  //         {

  //           month:
  //             payForm.month.trim(),

  //           amount,

  //           paymentDate:
  //             payForm.paymentDate,

  //           paymentMode:
  //             payForm.paymentMode,

  //           status:
  //             payForm.status,

  //           remark:
  //             payForm.remark?.trim() ||
  //             "",

  //         }
  //       );


  //       toast.success(
  //         "Salary Paid Successfully"
  //       );


  //       await fetchSalary();


  //       setActiveTab(
  //         "overview"
  //       );


  //     } catch (err) {

  //       console.error(
  //         "Salary payment error:",
  //         err
  //       );


  //       toast.error(
  //         err?.response?.data?.message ||
  //         err?.response?.data?.error ||
  //         err?.message ||
  //         "Payment Failed"
  //       );

  //     }

  //   };

const handleSalaryPayment = async (event) => {
  event.preventDefault();

  try {
    if (!employeeId) {
      toast.error("Employee ID is missing.");
      return;
    }

    if (!payForm.paymentDate) {
      toast.error("Please select payment date.");
      return;
    }

    if (!payForm.paymentMode) {
      toast.error("Please select payment mode.");
      return;
    }

    const allowedPaymentModes = [
      "BANK",
      "UPI",
      "CASH",
    ];

    if (
      !allowedPaymentModes.includes(
        payForm.paymentMode
      )
    ) {
      toast.error("Invalid payment mode.");
      return;
    }

    // =====================================================
    // FIND EXISTING PENDING RECORD
    // =====================================================

    let recordId = getSalaryRecordId();

    console.log(
      "INITIAL SALARY RECORD ID:",
      recordId
    );

    // =====================================================
    // IF NO PENDING RECORD -> AUTO CALCULATE
    // =====================================================

    if (!recordId) {
      console.log(
        "NO PENDING RECORD FOUND."
      );

      console.log(
        "AUTO CALCULATING SALARY..."
      );

      const now = new Date();

      const month =
        now.getMonth() + 1;

      const year =
        now.getFullYear();

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      if (!token) {
        toast.error(
          "Authentication token missing."
        );
        return;
      }

      const calculateResponse =
        await axios.post(
          `${API_BASE_URL}/salary/calculate/${employeeId}`,
          {
            month,
            year,
          },
          {
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      console.log(
        "AUTO CALCULATE SALARY RESPONSE:",
        calculateResponse.data
      );

      // =====================================================
      // REFRESH SALARY DATA
      // =====================================================

      await fetchSalary();

      // =====================================================
      // GET NEWLY CREATED PENDING RECORD
      // =====================================================

      const calculatedRecordId =
        calculateResponse?.data?.data
          ?.salaryRecordId ||
        calculateResponse?.data
          ?.salaryRecordId ||
        null;

      if (calculatedRecordId) {
        recordId =
          calculatedRecordId;
      } else {
        // Try again from refreshed salary data
        recordId =
          getSalaryRecordId();
      }

      console.log(
        "RECORD ID AFTER CALCULATION:",
        recordId
      );

      if (!recordId) {
        toast.error(
          "Salary was calculated, but pending salary record was not created."
        );
        return;
      }
    }

    // =====================================================
    // FIND SALARY HISTORY
    // =====================================================

    const salaryHistory =
      Array.isArray(
        salaryData?.salaryHistory
      )
        ? salaryData.salaryHistory
        : [];

    let salaryRecord =
      salaryHistory.find(
        (record) =>
          String(record?._id) ===
          String(recordId)
      );

    // =====================================================
    // IF FRONTEND DATA IS OLD, REFRESH AGAIN
    // =====================================================

    if (!salaryRecord) {
      console.log(
        "SALARY RECORD NOT FOUND IN OLD STATE."
      );

      await fetchSalary();

      const refreshedHistory =
        Array.isArray(
          salaryData?.salaryHistory
        )
          ? salaryData.salaryHistory
          : [];

      salaryRecord =
        refreshedHistory.find(
          (record) =>
            String(record?._id) ===
            String(recordId)
        );
    }

    // =====================================================
    // STILL NOT FOUND
    // =====================================================

    if (!salaryRecord) {
      toast.error(
        "Salary record not found. Please refresh the page."
      );
      return;
    }

    console.log(
      "FINAL SALARY RECORD:",
      salaryRecord
    );

    // =====================================================
    // ALREADY PAID
    // =====================================================

    if (
      String(
        salaryRecord.status || ""
      ).toUpperCase() === "PAID"
    ) {
      toast.error(
        "This salary is already paid."
      );
      return;
    }

    // =====================================================
    // SALARY AMOUNT
    // =====================================================

    const amount = Number(
      salaryRecord.amount ??
      payForm.amount ??
      0
    );

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      toast.error(
        "Invalid salary amount."
      );
      return;
    }

    // =====================================================
    // BANK VALIDATION
    // =====================================================

    if (
      payForm.paymentMode === "BANK"
    ) {
      const bank =
        salaryData?.bankDetails;

      if (!bank) {
        toast.error(
          "Employee bank details are not available."
        );

        setActiveTab("bank");
        return;
      }

      if (
        !bank.accountHolderName ||
        !bank.accountNumber ||
        !bank.ifscCode ||
        !bank.bankName
      ) {
        toast.error(
          "Complete bank details are required for bank salary payment."
        );

        setActiveTab("bank");
        return;
      }
    }

    // =====================================================
    // FINAL PAYMENT
    // =====================================================

    console.log(
      "===================================="
    );

    console.log(
      "PAYING SALARY"
    );

    console.log(
      "EMPLOYEE ID:",
      employeeId
    );

    console.log(
      "RECORD ID:",
      recordId
    );

    console.log(
      "MONTH:",
      salaryRecord.month
    );

    console.log(
      "AMOUNT:",
      amount
    );

    console.log(
      "PAYMENT MODE:",
      payForm.paymentMode
    );

    console.log(
      "===================================="
    );

    const response =
      await updateSalaryPayment(
        employeeId,
        {
          recordId,

          month:
            salaryRecord.month ||
            payForm.month?.trim() ||
            "",

          amount,

          paymentDate:
            payForm.paymentDate,

          paymentMode:
            payForm.paymentMode,

          status: "PAID",

          remark:
            payForm.remark?.trim() ||
            "",
        }
      );

    console.log(
      "SALARY PAYMENT RESPONSE:",
      response
    );

    toast.success(
      "Salary Paid Successfully"
    );

    // =====================================================
    // REFRESH
    // =====================================================

    await fetchSalary();

    setPayForm((prev) => ({
      ...prev,
      amount: "",
      remark: "",
    }));

    setActiveTab("overview");

  } catch (error) {

    console.error(
      "===================================="
    );

    console.error(
      "SALARY PAYMENT ERROR:",
      error
    );

    console.error(
      "BACKEND RESPONSE:",
      error?.response?.data
    );

    console.error(
      "===================================="
    );

    toast.error(
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Salary payment failed."
    );
  }
};

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (

      <div className="salary-modal-overlay">

        <div className="salary-modal">

          <div className="salary-loading">
            Loading Salary...
          </div>

        </div>

      </div>

    );

  }


  // ======================================================
  // EMPLOYEE DATA
  // ======================================================

  const employeeName =
    salaryData?.name ||
    salaryData?.employeeName ||
    salaryData?.employee?.name ||
    "N/A";


  const email =
    salaryData?.email ||
    salaryData?.employee?.email ||
    "N/A";


  const salaryType =
    salaryData?.salaryDetails
      ?.salaryType ||
    "MONTHLY";


  const amount =
    Number(
      salaryData?.salaryDetails
        ?.amount || 0
    );


  const joiningDate =
    salaryData?.salaryDetails
      ?.joiningDate
      ? new Date(
          salaryData.salaryDetails
            .joiningDate
        ).toLocaleDateString(
          "en-IN"
        )
      : "-";


  const bankDetails =
    salaryData?.bankDetails ||
    null;


  // ======================================================
  // RENDER
  // ======================================================

  return (

    <div className="salary-modal-overlay">

      <div className="salary-modal">

        {/* ================================================
            HEADER
        ================================================= */}

        <div className="salary-header">

          <h2>
            Employee Salary Management
          </h2>


          <button
            type="button"
            onClick={onClose}
            className="close-btn"
          >
            ✕
          </button>

        </div>


        {/* ================================================
            EMPLOYEE CARD
        ================================================= */}

        <div className="employee-card">

          <h3>
            {employeeName}
          </h3>


          <p>
            {email}
          </p>


          <p>
            Joining: {joiningDate}
          </p>


          <p>
            Salary: ₹
            {amount.toLocaleString(
              "en-IN"
            )}
          </p>


          <p>
            Type: {salaryType}
          </p>

        </div>


        {/* ================================================
            TABS
        ================================================= */}

        <div className="salary-tabs">

          <button
            type="button"
            className={
              activeTab === "overview"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "overview"
              )
            }
          >
            Overview
          </button>


          <button
            type="button"
            className={
              activeTab === "payment"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "payment"
              )
            }
          >
            Add Payment
          </button>


          <button
            type="button"
            className={
              activeTab === "config"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "config"
              )
            }
          >
            Salary Structure
          </button>


          {/* ============================================
              BANK DETAILS TAB
          ============================================ */}

          <button
            type="button"
            className={
              activeTab === "bank"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "bank"
              )
            }
          >
            Bank Details
          </button>

        </div>


        {/* ================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="salary-error">

            {error}

          </div>

        )}


        {/* ================================================
            OVERVIEW
        ================================================= */}

        {activeTab === "overview" && (

          <div className="overview-section">

            <div className="summary-grid">

              <div className="summary-card">

                <h4>
                  Salary Type
                </h4>

                <h2>
                  {salaryType}
                </h2>

              </div>


              <div className="summary-card">

                <h4>
                  Base Salary
                </h4>

                <h2>
                  ₹
                  {amount.toLocaleString(
                    "en-IN"
                  )}
                </h2>

              </div>


              <div className="summary-card">

                <h4>
                  Total Paid
                </h4>

                <h2 className="greeen">

                  ₹
                  {Number(
                    salaryData?.totalPaidAmount ||
                    0
                  ).toLocaleString(
                    "en-IN"
                  )}

                </h2>

              </div>

            </div>


            {/* ==========================================
                PAYMENT HISTORY
            ========================================== */}

            <div className="history-title">
              Payment History
            </div>


            <div className="salary-history-wrapper">

              <table className="salary-history-table">

                <thead>

                  <tr>

                    <th>
                      Month
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Mode
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Review
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {Array.isArray(
                    salaryData?.salaryHistory
                  ) &&
                  salaryData
                    .salaryHistory
                    .length > 0 ? (

                    salaryData.salaryHistory.map(
                      (item) => (

                        <tr
                          key={
                            item?._id ||
                            `${item?.month}-${item?.paymentDate}`
                          }
                        >

                          <td>
                            {item?.month ||
                              "-"}
                          </td>


                          <td>
                            ₹
                            {Number(
                              item?.amount ||
                              0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </td>


                          <td>
                            {item?.paymentMode ||
                              "-"}
                          </td>


                          <td>
                            {item?.paymentDate
                              ? new Date(
                                  item.paymentDate
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "-"}
                          </td>


                          <td>

                            <span
                              className={
                                item?.status ===
                                "PAID"
                                  ? "paid-badge"
                                  : "pending-badge"
                              }
                            >
                              {item?.status ||
                                "-"}
                            </span>

                          </td>


                          <td>

                            {item?.remark
                              ?.trim()
                              ? item.remark
                              : "-"}

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="6"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "30px",
                        }}
                      >
                        No Salary History Available
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}


        {/* ================================================
            BANK DETAILS
        ================================================= */}

        {activeTab === "bank" && (

          <div className="bank-tab-section">

            <BankDetails
              bankDetails={
                bankDetails
              }
            />

          </div>

        )}


        {/* ================================================
            PAYMENT
        ================================================= */}

        {activeTab === "payment" && (

          <form
            className="salary-form"
            onSubmit={
              handleSalaryPayment
            }
          >

            <div className="form-row">

              <div className="form-group">

                <label>
                  Month
                </label>

                <input
                  type="text"
                  value={
                    payForm.month
                  }
                  onChange={(event) =>
                    setPayForm({
                      ...payForm,
                      month:
                        event.target.value,
                    })
                  }
                  placeholder="August 2026"
                />

              </div>


              <div className="form-group">

                <label>
                  Salary Amount
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    payForm.amount
                  }
                  onChange={(event) =>
                    setPayForm({
                      ...payForm,
                      amount:
                        event.target.value,
                    })
                  }
                />

              </div>

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>
                  Payment Date
                </label>

                <input
                  type="date"
                  value={
                    payForm.paymentDate
                  }
                  onChange={(event) =>
                    setPayForm({
                      ...payForm,
                      paymentDate:
                        event.target.value,
                    })
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Payment Mode
                </label>

                <select
                  value={
                    payForm.paymentMode
                  }
                  onChange={(event) =>
                    setPayForm({
                      ...payForm,
                      paymentMode:
                        event.target.value,
                    })
                  }
                >

                  <option value="BANK">
                    Bank
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="CASH">
                    Cash
                  </option>

                </select>

              </div>

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  value={
                    payForm.status
                  }
                  onChange={(event) =>
                    setPayForm({
                      ...payForm,
                      status:
                        event.target.value,
                    })
                  }
                >

                  <option value="PAID">
                    PAID
                  </option>

                  <option value="PENDING">
                    PENDING
                  </option>

                </select>

              </div>

            </div>


            <div className="form-group">

              <label>
                Review
              </label>

              <textarea
                rows="3"
                value={
                  payForm.remark
                }
                onChange={(event) =>
                  setPayForm({
                    ...payForm,
                    remark:
                      event.target.value,
                  })
                }
                placeholder="Enter review ..."
              />

            </div>


            <button
              type="submit"
              className="save-btn"
            >
              Record Salary Payment
            </button>

          </form>

        )}


        {/* ================================================
            SALARY CONFIG
        ================================================= */}

        {activeTab === "config" && (

          <form
            className="salary-form"
            onSubmit={
              handleSalaryConfig
            }
          >

            <div className="form-group">

              <label>
                Salary Type
              </label>

              <select
                value={
                  configForm.salaryType
                }
                onChange={(event) =>
                  setConfigForm({
                    ...configForm,
                    salaryType:
                      event.target.value,
                  })
                }
              >

                <option value="MONTHLY">
                  MONTHLY
                </option>

                <option value="DAILY">
                  DAILY
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>
                Salary Amount
              </label>

              <input
                type="number"
                min="0"
                value={
                  configForm.amount
                }
                onChange={(event) =>
                  setConfigForm({
                    ...configForm,
                    amount:
                      event.target.value,
                  })
                }
              />

            </div>


            <div className="form-group">

              <label>
                Joining Date
              </label>

              <input
                type="date"
                value={
                  configForm.joiningDate
                }
                onChange={(event) =>
                  setConfigForm({
                    ...configForm,
                    joiningDate:
                      event.target.value,
                  })
                }
              />

            </div>


            <button
              type="submit"
              className="save-btn"
            >
              Update Salary Structure
            </button>

          </form>

        )}

      </div>

    </div>

  );
};

export default SalaryModal;