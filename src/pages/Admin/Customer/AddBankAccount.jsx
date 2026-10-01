// import React, { useState } from "react";
// import "./AddBankAccount.css";

// const API_URL = import.meta.env.VITE_API_URL;

// const initialFormData = {
//   accountHolderName: "",
//   accountNumber: "",
//   confirmAccountNumber: "",
//   ifscCode: "",
//   bankName: "",
//   branchName: "",
//   accountType: "SAVINGS",
// };

// const AddBankAccount = ({ customerId, onSuccess }) => {
//   const [formData, setFormData] = useState(initialFormData);
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const resetForm = () => {
//     setFormData(initialFormData);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMsg("");
//     setSuccessMsg("");

//     if (!customerId) {
//       setErrorMsg("Customer ID is missing. Please refresh and try again.");
//       return;
//     }

//     const accountNumber = formData.accountNumber.trim();
//     const confirmAccountNumber = formData.confirmAccountNumber.trim();

//     if (accountNumber !== confirmAccountNumber) {
//       setErrorMsg("Account number and confirmation do not match.");
//       return;
//     }

//     if (!/^\d{6,20}$/.test(accountNumber)) {
//       setErrorMsg("Please enter a valid account number.");
//       return;
//     }

//     const ifscCode = formData.ifscCode.trim().toUpperCase();

//     if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
//       setErrorMsg("Please enter a valid IFSC code (e.g., SBIN0001234).");
//       return;
//     }

//     if (!formData.accountHolderName.trim()) {
//       setErrorMsg("Please enter the account holder name.");
//       return;
//     }

//     if (!formData.bankName.trim()) {
//       setErrorMsg("Please enter the bank name.");
//       return;
//     }

//     if (!API_URL) {
//       setErrorMsg("API URL is not configured.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         throw new Error("Authentication token is missing. Please log in again.");
//       }

//       const baseUrl = API_URL.replace(/\/+$/, "");
//       const response = await fetch(
//         `${baseUrl}/users/${customerId}/bank-accounts`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             accountHolderName: formData.accountHolderName.trim(),
//             accountNumber,
//             ifscCode,
//             bankName: formData.bankName.trim(),
//             branchName: formData.branchName.trim(),
//             accountType: formData.accountType,
//           }),
//         }
//       );

//       const result = await response.json().catch(() => ({}));

//       if (!response.ok) {
//         throw new Error(
//           result?.message || result?.error || "Failed to save bank details."
//         );
//       }

//       setSuccessMsg("Bank details saved successfully.");
//       resetForm();

//       if (onSuccess) {
//         onSuccess(result?.data ?? result);
//       }
//     } catch (error) {
//       console.error("SAVE BANK DETAILS ERROR:", error);
//       setErrorMsg(error.message || "Something went wrong while saving bank details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bank-card">
//       <div className="bank-header">
//         <span className="badge-tag">Refund Setup</span>

//         <h2 className="bank-title">Add Bank Account</h2>

//         <p className="bank-subtitle">
//           Enter verified bank account details to receive customer refunds
//           directly.
//         </p>
//       </div>

//       {errorMsg && (
//         <div className="bank-alert bank-alert-error" role="alert">
//           {errorMsg}
//         </div>
//       )}

//       {successMsg && (
//         <div className="bank-alert bank-alert-success" role="status">
//           {successMsg}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="form-grid">
//         <div className="form-group">
//           <label className="form-label" htmlFor="accountHolderName">
//             Account Holder Name <span>*</span>
//           </label>
//           <input
//             id="accountHolderName"
//             type="text"
//             name="accountHolderName"
//             value={formData.accountHolderName}
//             onChange={handleChange}
//             placeholder="As shown in passbook/cheque"
//             className="form-input"
//             autoComplete="name"
//             required
//           />
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label" htmlFor="accountNumber">
//               Account Number <span>*</span>
//             </label>
//             <input
//               id="accountNumber"
//               type="password"
//               name="accountNumber"
//               value={formData.accountNumber}
//               onChange={handleChange}
//               placeholder="Enter account number"
//               className="form-input"
//               inputMode="numeric"
//               autoComplete="off"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label" htmlFor="confirmAccountNumber">
//               Confirm Account Number <span>*</span>
//             </label>
//             <input
//               id="confirmAccountNumber"
//               type="text"
//               name="confirmAccountNumber"
//               value={formData.confirmAccountNumber}
//               onChange={handleChange}
//               placeholder="Re-enter account number"
//               className="form-input"
//               inputMode="numeric"
//               autoComplete="off"
//               required
//             />
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label" htmlFor="ifscCode">
//               IFSC Code <span>*</span>
//             </label>
//             <input
//               id="ifscCode"
//               type="text"
//               name="ifscCode"
//               value={formData.ifscCode}
//               onChange={handleChange}
//               placeholder="SBIN0001234"
//               className="form-input uppercase"
//               maxLength={11}
//               autoComplete="off"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label" htmlFor="accountType">
//               Account Type
//             </label>
//             <select
//               id="accountType"
//               name="accountType"
//               value={formData.accountType}
//               onChange={handleChange}
//               className="form-select"
//             >
//               <option value="SAVINGS">Savings Account</option>
//               <option value="CURRENT">Current Account</option>
//             </select>
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label" htmlFor="bankName">
//               Bank Name <span>*</span>
//             </label>
//             <input
//               id="bankName"
//               type="text"
//               name="bankName"
//               value={formData.bankName}
//               onChange={handleChange}
//               placeholder="State Bank of India, HDFC, etc."
//               className="form-input"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label className="form-label" htmlFor="branchName">
//               Branch Name
//             </label>
//             <input
//               id="branchName"
//               type="text"
//               name="branchName"
//               value={formData.branchName}
//               onChange={handleChange}
//               placeholder="Branch location (optional)"
//               className="form-input"
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={loading || !customerId}
//           className="btn-submit"
//         >
//           {loading ? "Saving Details..." : "Save Bank Details"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddBankAccount;

import React, { useState } from "react";
import "./AddBankAccount.css";

const API_URL = import.meta.env.VITE_API_URL;

const initialFormData = {
  accountHolderName: "",
  accountNumber: "",
  confirmAccountNumber: "",
  ifscCode: "",
  bankName: "",
  branchName: "",
  accountType: "SAVINGS",
  isPrimaryForRefund: false, // <-- Added for multiple accounts
};

const AddBankAccount = ({ customerId, onSuccess }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!customerId) {
      setErrorMsg("Customer ID is missing. Please refresh and try again.");
      return;
    }

    const accountNumber = formData.accountNumber.trim();
    const confirmAccountNumber = formData.confirmAccountNumber.trim();

    if (accountNumber !== confirmAccountNumber) {
      setErrorMsg("Account number and confirmation do not match.");
      return;
    }

    if (!/^\d{6,20}$/.test(accountNumber)) {
      setErrorMsg("Please enter a valid account number.");
      return;
    }

    const ifscCode = formData.ifscCode.trim().toUpperCase();

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      setErrorMsg("Please enter a valid IFSC code (e.g., SBIN0001234).");
      return;
    }

    if (!formData.accountHolderName.trim()) {
      setErrorMsg("Please enter the account holder name.");
      return;
    }

    if (!formData.bankName.trim()) {
      setErrorMsg("Please enter the bank name.");
      return;
    }

    if (!API_URL) {
      setErrorMsg("API URL is not configured.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }

      const baseUrl = API_URL.replace(/\/+$/, "");
      const response = await fetch(
        `${baseUrl}/users/${customerId}/bank-accounts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            accountHolderName: formData.accountHolderName.trim(),
            accountNumber,
            ifscCode,
            bankName: formData.bankName.trim(),
            branchName: formData.branchName.trim(),
            accountType: formData.accountType,
            isPrimaryForRefund: formData.isPrimaryForRefund, // <-- Included in request payload
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result?.message || result?.error || "Failed to add bank account."
        );
      }

      setSuccessMsg("Bank account added successfully.");
      resetForm();

      if (onSuccess) {
        onSuccess(result?.data ?? result);
      }
    } catch (error) {
      console.error("ADD BANK ACCOUNT ERROR:", error);
      setErrorMsg(
        error.message || "Something went wrong while adding the bank account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bank-card">
      <div className="bank-header">
        <span className="badge-tag">Refund Setup</span>
        <h2 className="bank-title">Add Bank Account</h2>
        <p className="bank-subtitle">
          Add a verified bank account to receive refunds and payouts.
        </p>
      </div>

      {errorMsg && (
        <div className="bank-alert bank-alert-error" role="alert">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bank-alert bank-alert-success" role="status">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label className="form-label" htmlFor="accountHolderName">
            Account Holder Name <span>*</span>
          </label>
          <input
            id="accountHolderName"
            type="text"
            name="accountHolderName"
            value={formData.accountHolderName}
            onChange={handleChange}
            placeholder="As shown in passbook/cheque"
            className="form-input"
            autoComplete="name"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="accountNumber">
              Account Number <span>*</span>
            </label>
            <input
              id="accountNumber"
              type="password"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Enter account number"
              className="form-input"
              inputMode="numeric"
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmAccountNumber">
              Confirm Account Number <span>*</span>
            </label>
            <input
              id="confirmAccountNumber"
              type="text"
              name="confirmAccountNumber"
              value={formData.confirmAccountNumber}
              onChange={handleChange}
              placeholder="Re-enter account number"
              className="form-input"
              inputMode="numeric"
              autoComplete="off"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="ifscCode">
              IFSC Code <span>*</span>
            </label>
            <input
              id="ifscCode"
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "ifscCode",
                    value: e.target.value.toUpperCase(),
                  },
                })
              }
              placeholder="SBIN0001234"
              className="form-input uppercase"
              maxLength={11}
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="accountType">
              Account Type
            </label>
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="SAVINGS">Savings Account</option>
              <option value="CURRENT">Current Account</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="bankName">
              Bank Name <span>*</span>
            </label>
            <input
              id="bankName"
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder="State Bank of India, HDFC, etc."
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="branchName">
              Branch Name
            </label>
            <input
              id="branchName"
              type="text"
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
              placeholder="Branch location (optional)"
              className="form-input"
            />
          </div>
        </div>

        {/* Primary Account Checkbox */}
        <div className="form-group form-checkbox-group">
          <label className="checkbox-label" htmlFor="isPrimaryForRefund">
            <input
              id="isPrimaryForRefund"
              type="checkbox"
              name="isPrimaryForRefund"
              checked={formData.isPrimaryForRefund}
              onChange={handleChange}
            />
            <span>Set as primary account for refunds</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !customerId}
          className="btn-submit"
        >
          {loading ? "Adding Account..." : "Add Bank Account"}
        </button>
      </form>
    </div>
  );
};

export default AddBankAccount;