// import React, {
//   useEffect,
//   useState
// } from "react";

// import {
//   Building2,
//   CreditCard,
//   User,
//   Hash,
//   Landmark,
//   WalletCards
// } from "lucide-react";

// import {
//   getEmployeeSalary
// } from "../../../services/salaryService";

// import "./BankDetails.css";


// // =====================================================
// // COMPONENT
// // =====================================================

// const BankDetails = ({
//   employeeId,
//   bankDetails: initialBankDetails = null
// }) => {

//   const [
//     bankDetails,
//     setBankDetails
//   ] = useState(
//     initialBankDetails
//   );

//   const [
//     loading,
//     setLoading
//   ] = useState(false);


//   // =====================================================
//   // LOAD BANK DETAILS
//   // =====================================================

//   useEffect(() => {

//     if (
//       initialBankDetails
//     ) {

//       setBankDetails(
//         initialBankDetails
//       );

//       return;

//     }


//     if (!employeeId) {
//       return;
//     }


//     loadBankDetails();

//   }, [
//     employeeId,
//     initialBankDetails
//   ]);


//   // =====================================================
//   // API
//   // =====================================================

//   const loadBankDetails = async () => {

//     try {

//       setLoading(true);

//       const response =
//         await getEmployeeSalary(
//           employeeId
//         );


//       console.log(
//         "EMPLOYEE SALARY RESPONSE:",
//         response
//       );


//       const details =
//         response?.data?.bankDetails ||
//         response?.bankDetails ||
//         null;


//       setBankDetails(
//         details
//       );

//     }

//     catch (error) {

//       console.error(
//         "BANK DETAILS LOAD ERROR:",
//         error
//       );

//       setBankDetails(
//         null
//       );

//     }

//     finally {

//       setLoading(false);

//     }

//   };


//   // =====================================================
//   // LOADING
//   // =====================================================

//   if (loading) {

//     return (

//       <div className="bank-details-card">

//         <div className="bank-details-header">

//           <div className="bank-details-title">

//             <div className="bank-details-icon">

//               <Landmark size={20} />

//             </div>

//             <div>

//               <h3>
//                 Bank Details
//               </h3>

//               <p>
//                 Employee salary bank information
//               </p>

//             </div>

//           </div>

//         </div>


//         <div className="bank-loading">

//           Loading bank details...

//         </div>

//       </div>

//     );

//   }


//   // =====================================================
//   // EMPTY
//   // =====================================================

//   if (!bankDetails) {

//     return (

//       <div className="bank-details-card">

//         <div className="bank-details-header">

//           <div className="bank-details-title">

//             <div className="bank-details-icon">

//               <Landmark size={20} />

//             </div>

//             <div>

//               <h3>
//                 Bank Details
//               </h3>

//               <p>
//                 Employee salary bank information
//               </p>

//             </div>

//           </div>

//         </div>


//         <div className="bank-empty">

//           <div className="bank-empty-icon">

//             <CreditCard size={28} />

//           </div>


//           <h4>
//             Bank Details Not Available
//           </h4>


//           <p>
//             No bank account information
//             has been added for this employee.
//           </p>

//         </div>

//       </div>

//     );

//   }


//   // =====================================================
//   // VALUES
//   // =====================================================

//   const accountHolderName =
//     bankDetails?.accountHolderName ||
//     "-";


//   const bankName =
//     bankDetails?.bankName ||
//     "-";


//   const accountNumber =
//     bankDetails?.accountNumber ||
//     "-";


//   const ifscCode =
//     bankDetails?.ifscCode ||
//     "-";


//   const accountType =
//     bankDetails?.accountType ||
//     "-";


//   // =====================================================
//   // RENDER
//   // =====================================================

//   return (

//     <div className="bank-details-card">


//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div className="bank-details-header">

//         <div className="bank-details-title">

//           <div className="bank-details-icon">

//             <Landmark size={20} />

//           </div>


//           <div>

//             <h3>
//               Bank Details
//             </h3>

//             <p>
//               Employee salary bank information
//             </p>

//           </div>

//         </div>


//         <span className="bank-status">

//           Available

//         </span>

//       </div>


//       {/* =================================================
//           DETAILS
//       ================================================= */}

//       <div className="bank-details-grid">


//         {/* ACCOUNT HOLDER */}

//         <div className="bank-detail-item">

//           <div className="bank-detail-icon">

//             <User size={18} />

//           </div>


//           <div className="bank-detail-content">

//             <span>
//               Account Holder Name
//             </span>

//             <strong>
//               {accountHolderName}
//             </strong>

//           </div>

//         </div>


//         {/* BANK NAME */}

//         <div className="bank-detail-item">

//           <div className="bank-detail-icon">

//             <Building2 size={18} />

//           </div>


//           <div className="bank-detail-content">

//             <span>
//               Bank Name
//             </span>

//             <strong>
//               {bankName}
//             </strong>

//           </div>

//         </div>


//         {/* ACCOUNT NUMBER */}

//         <div className="bank-detail-item">

//           <div className="bank-detail-icon">

//             <CreditCard size={18} />

//           </div>


//           <div className="bank-detail-content">

//             <span>
//               Account Number
//             </span>

//             <strong className="account-number">

//               {accountNumber}

//             </strong>

//           </div>

//         </div>


//         {/* IFSC */}

//         <div className="bank-detail-item">

//           <div className="bank-detail-icon">

//             <Hash size={18} />

//           </div>


//           <div className="bank-detail-content">

//             <span>
//               IFSC Code
//             </span>

//             <strong>
//               {ifscCode}
//             </strong>

//           </div>

//         </div>


//         {/* ACCOUNT TYPE */}

//         <div className="bank-detail-item">

//           <div className="bank-detail-icon">

//             <WalletCards size={18} />

//           </div>


//           <div className="bank-detail-content">

//             <span>
//               Account Type
//             </span>

//             <strong>
//               {accountType}
//             </strong>

//           </div>

//         </div>


//       </div>

//     </div>

//   );

// };


// export default BankDetails;


import React from "react";

import "./BankDetails.css";

// ======================================================
// BANK DETAILS COMPONENT
// ======================================================

const BankDetails = ({ bankDetails }) => {
  // ====================================================
  // EMPTY STATE
  // ====================================================

  if (!bankDetails) {
    return (
      <div className="bank-details-card">

        <div className="bank-details-header">

          <div>
            <h3>Bank Details</h3>

            <p>
              Employee bank account information
            </p>
          </div>

          <span className="bank-status bank-status-missing">
            Not Available
          </span>

        </div>

        <div className="bank-empty">

          <div className="bank-empty-icon">
            🏦
          </div>

          <h4>
            Bank Details Not Available
          </h4>

          <p>
            Bank account details have not been added
            for this employee.
          </p>

        </div>

      </div>
    );
  }

  // ====================================================
  // VALUES
  // ====================================================

  const accountHolderName =
    bankDetails?.accountHolderName || "-";

  const accountNumber =
    bankDetails?.accountNumber || "-";

  const ifscCode =
    bankDetails?.ifscCode || "-";

  const bankName =
    bankDetails?.bankName || "-";

  const accountType =
    bankDetails?.accountType || "-";

  // ====================================================
  // CHECK COMPLETE DETAILS
  // ====================================================

  const isComplete =
    Boolean(
      bankDetails?.accountHolderName &&
      bankDetails?.accountNumber &&
      bankDetails?.ifscCode &&
      bankDetails?.bankName
    );

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="bank-details-card">

      {/* ================================================
          HEADER
      ================================================= */}

      <div className="bank-details-header">

        <div>

          <h3>
            Bank Details
          </h3>

          <p>
            Employee bank account information
          </p>

        </div>

        <span
          className={`bank-status ${
            isComplete
              ? "bank-status-complete"
              : "bank-status-incomplete"
          }`}
        >
          {isComplete
            ? "Complete"
            : "Incomplete"}
        </span>

      </div>


      {/* ================================================
          DETAILS GRID
      ================================================= */}

      <div className="bank-details-grid">

        {/* Account Holder */}

        <div className="bank-detail-item">

          <span className="bank-detail-label">
            Account Holder Name
          </span>

          <strong className="bank-detail-value">
            {accountHolderName}
          </strong>

        </div>


        {/* Bank Name */}

        <div className="bank-detail-item">

          <span className="bank-detail-label">
            Bank Name
          </span>

          <strong className="bank-detail-value">
            {bankName}
          </strong>

        </div>


        {/* Account Number */}

        <div className="bank-detail-item">

          <span className="bank-detail-label">
            Account Number
          </span>

          <strong className="bank-detail-value bank-account-number">
            {accountNumber}
          </strong>

        </div>


        {/* IFSC */}

        <div className="bank-detail-item">

          <span className="bank-detail-label">
            IFSC Code
          </span>

          <strong className="bank-detail-value bank-ifsc">
            {ifscCode}
          </strong>

        </div>


        {/* Account Type */}

        <div className="bank-detail-item">

          <span className="bank-detail-label">
            Account Type
          </span>

          <strong className="bank-detail-value">

            {accountType
              ? String(accountType).toUpperCase()
              : "-"}

          </strong>

        </div>

      </div>


      {/* ================================================
          BANK PAYMENT INFO
      ================================================= */}

      <div className="bank-payment-info">

        <div className="bank-info-icon">
          ✓
        </div>

        <div>

          <strong>
            Bank Payment
          </strong>

          <p>
            Salary can be paid through bank when
            complete bank details are available.
          </p>

        </div>

      </div>

    </div>
  );
};

export default BankDetails;