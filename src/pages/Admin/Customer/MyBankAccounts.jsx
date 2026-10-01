import React, { useEffect, useState } from "react";
import {
  getCustomerBankAccounts,
  updateCustomerBankDetails,
} from "../../../services/bankAccountService";
import "./MyBankAccounts.css";

const emptyForm = {
  bankName: "",
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  branchName: "",
  accountType: "SAVINGS",
  isPrimaryForRefund: false,
};

const MyBankAccounts = ({ customerId }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  


  useEffect(() => {
    if (!customerId) {
      setAccounts([]);
      setLoading(false);
      return;
    }

    loadAccounts();
  }, [customerId]);

  const loadAccounts = async () => {
    try {
      setLoading(true);

      const response = await getCustomerBankAccounts(customerId);
      let bankAccounts = [];

      console.log(response.data , "All Banks")
      if (response?.data?.success) {
        bankAccounts = response.data.data || [];
        console.log(bankAccounts, "All Banks")
      } else if (Array.isArray(response?.data)) {
        bankAccounts = response.data;
      } else if (Array.isArray(response)) {
        bankAccounts = response;
      }

      setAccounts(Array.isArray(bankAccounts) ? bankAccounts : []);
    } catch (err) {
      console.error("Bank Account Error:", err);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (account) => {
    setEditingAccount(account);
    setFormData({
      bankName: account.bankName || "",
      accountHolderName: account.accountHolderName || "",
      accountNumber: account.accountNumber || "",
      ifscCode: account.ifscCode || "",
      branchName: account.branchName || "",
      accountType: account.accountType || "SAVINGS",
      isPrimaryForRefund: Boolean(account.isPrimaryForRefund),
    });
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingAccount(null);
    setFormData(emptyForm);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!editingAccount) return;

    try {
      setSaving(true);
      setError("");

      // Existing account ko update karein—naya account create nahi hota.
      await updateCustomerBankDetails(
        customerId,
        editingAccount._id,
        formData
      );

//       await updateCustomerBankDetails(customerId, {
//   ...formData,
//   _id: editingAccount._id,
// });

      await loadAccounts();

      setIsModalOpen(false);
      setEditingAccount(null);
      setFormData(emptyForm);
    } catch (err) {
      console.error("Bank Account Update Error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update bank account."
      );
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return <h3 className="bank-loading">Loading bank accounts...</h3>;
  }

  return (
    <div className="bank-account-container">
      <div className="bank-account-heading">
        <div>
          <span className="bank-eyebrow">ACCOUNT SETTINGS</span>
          <h2>My Bank Accounts</h2>
        </div>
      </div>

      {accounts.length === 0 ? (
        <div className="bank-empty-state">
          <h3>No Bank Accounts Found</h3>
        </div>
      ) : (
        <div className="bank-cards-grid">
          {accounts.map((account, index) => (
            <div
              key={account._id || account.accountNumber || index}
              className={`bank-card ${
                account.isPrimaryForRefund ? "bank-card-primary" : ""
              }`}
            >
              <div className="bank-card-header">
                <h3>{account.bankName || "Bank Account"}</h3>

                <div className="bank-card-actions">
                  {account.isPrimaryForRefund && (
                    <span className="bank-badge-primary">Primary</span>
                  )}

                  <button
                    type="button"
                    className="bank-update-button"
                    onClick={() => openEditModal(account)}
                  >
                    Update
                  </button>
                </div>
              </div>

              <div className="bank-details-grid">
                <div className="bank-detail">
                  <span>Account Holder</span>
                  <strong>{account.accountHolderName || "N/A"}</strong>
                </div>

                <div className="bank-detail">
                  <span>Account Number</span>
                  <strong>
                    {account.accountNumber
                      ? `•••• ${account.accountNumber.slice(-4)}`
                      : "N/A"}
                  </strong>
                </div>

                <div className="bank-detail">
                  <span>IFSC</span>
                  <strong>{account.ifscCode || "N/A"}</strong>
                </div>

                <div className="bank-detail">
                  <span>Branch</span>
                  <strong>{account.branchName || "N/A"}</strong>
                </div>

                <div className="bank-detail">
                  <span>Type</span>
                  <strong>{account.accountType || "N/A"}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && editingAccount && (
        <div className="bank-modal-backdrop">
          <div
            className="bank-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bank-modal-title"
          >
            <h2 id="bank-modal-title">Update Bank Account</h2>

            <form onSubmit={handleSubmit}>
              <input
                name="bankName"
                placeholder="Bank Name"
                value={formData.bankName}
                onChange={handleChange}
                required
              />

              <input
                name="accountHolderName"
                placeholder="Account Holder Name"
                value={formData.accountHolderName}
                onChange={handleChange}
                required
              />

              <input
                name="accountNumber"
                placeholder="Account Number"
                value={formData.accountNumber}
                onChange={handleChange}
                required
              />

              <input
                name="ifscCode"
                placeholder="IFSC Code"
                value={formData.ifscCode}
                onChange={handleChange}
                required
              />

              <input
                name="branchName"
                placeholder="Branch Name"
                value={formData.branchName}
                onChange={handleChange}
              />

              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
              >
                <option value="SAVINGS">Savings</option>
                <option value="CURRENT">Current</option>
              </select>

              <label>
                <input
                  type="checkbox"
                  name="isPrimaryForRefund"
                  checked={formData.isPrimaryForRefund}
                  onChange={handleChange}
                />
                Primary Refund Account
              </label>

              {error && <p className="bank-form-error">{error}</p>}

              <div className="bank-modal-actions">
                <button type="button" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>

                <button type="submit" disabled={saving}>
                  {saving ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBankAccounts;