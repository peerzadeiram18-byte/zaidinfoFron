import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "./EditVendor.css";


// ======================================================
// API BASE
// Same pattern as AddVendor.jsx / VendorDetails.jsx
// ======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});


function EditVendor() {

  const { vendorId } = useParams();
  const navigate = useNavigate();


  // ====================================================
  // FORM STATE
  // ====================================================

  const [formData, setFormData] = useState({
    vendorName: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    panNumber: "",
    bankDetails: {
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");


  // ====================================================
  // FETCH EXISTING VENDOR
  // ====================================================

  useEffect(() => {

    const fetchVendor = async () => {

      try {

        setLoading(true);
        setLoadError("");

        const res = await axios.get(
          `${API_BASE_URL}/api/procurement/vendors/${vendorId}`,
          { headers: authHeaders() }
        );

        const vendor = res.data.data || res.data.vendor || res.data;

        setFormData({
          vendorName: vendor.vendorName || "",
          contactPerson: vendor.contactPerson || "",
          phone: vendor.phone || "",
          email: vendor.email || "",
          address: vendor.address || "",
          city: vendor.city || "",
          state: vendor.state || "",
          pincode: vendor.pincode || "",
          gstNumber: vendor.gstNumber || "",
          panNumber: vendor.panNumber || "",
          bankDetails: {
            accountHolderName: vendor.bankDetails?.accountHolderName || "",
            bankName: vendor.bankDetails?.bankName || "",
            accountNumber: vendor.bankDetails?.accountNumber || "",
            ifscCode: vendor.bankDetails?.ifscCode || "",
          },
        });

      } catch (err) {

        setLoadError(
          err.response?.data?.message ||
          "Could not load this vendor. Please try again."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchVendor();

  }, [vendorId]);


  // ====================================================
  // CHANGE HANDLER (top-level fields)
  // ====================================================

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };


  // ====================================================
  // CHANGE HANDLER (nested bankDetails fields)
  // ====================================================

  const handleBankDetailsChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      bankDetails: {
        ...previous.bankDetails,
        [name]: value,
      },
    }));
  };


  // ====================================================
  // VALIDATION
  // Matches vendor.model.js: vendorName + phone required
  // ====================================================

  const validate = () => {

    const nextErrors = {};

    if (!formData.vendorName.trim()) {
      nextErrors.vendorName = "Vendor name is required";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      nextErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address";
    }

    if (
      formData.pincode.trim() &&
      !/^\d{6}$/.test(formData.pincode.trim())
    ) {
      nextErrors.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };


  // ====================================================
  // SUBMIT (PUT instead of POST)
  // ====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setSuccessMessage("");
    setServerError("");

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {

      const response = await axios.put(
        `${API_BASE_URL}/api/procurement/vendors/${vendorId}`,
        {
          vendorName: formData.vendorName.trim(),
          contactPerson: formData.contactPerson.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          gstNumber: formData.gstNumber.trim(),
          panNumber: formData.panNumber.trim(),
          bankDetails: {
            accountHolderName:
              formData.bankDetails.accountHolderName.trim(),
            bankName: formData.bankDetails.bankName.trim(),
            accountNumber: formData.bankDetails.accountNumber.trim(),
            ifscCode: formData.bankDetails.ifscCode.trim(),
          },
        },
        { headers: authHeaders() }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to update vendor"
        );
      }

      setSuccessMessage("Vendor updated successfully");

      // send them back to the vendor's details page after a short pause
      setTimeout(() => {
        navigate(`/vendors/${vendorId}`);
      }, 1200);

    } catch (error) {

      setServerError(
        error.response?.data?.message ||
        error.message ||
        "Failed to update vendor"
      );

    } finally {

      setSubmitting(false);

    }
  };


  // ====================================================
  // RENDER — LOADING / LOAD ERROR STATES
  // ====================================================

  if (loading) {
    return (
      <div className="edit-vendor-page">
        <p className="ev-state">Loading vendor...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="edit-vendor-page">
        <button
          type="button"
          className="ev-back"
          onClick={() => navigate("/vendors")}
        >
          ← Back to vendors
        </button>
        <p className="ev-state ev-state-error">{loadError}</p>
      </div>
    );
  }


  // ====================================================
  // RENDER — FORM
  // ====================================================

  return (
    <div className="edit-vendor-page">

      <div className="edit-vendor-header">
        <h2>Edit Vendor</h2>
        <p>Update this vendor's details</p>
      </div>

      {successMessage && (
        <div className="edit-vendor-alert success">
          {successMessage}
        </div>
      )}

      {serverError && (
        <div className="edit-vendor-alert error">
          {serverError}
        </div>
      )}

      <form className="edit-vendor-form" onSubmit={handleSubmit}>

        <div className="form-grid">

          {/* ---------- VENDOR NAME ---------- */}

          <div className="form-group">
            <label htmlFor="vendorName">
              Vendor Name <span className="required">*</span>
            </label>
            <input
              id="vendorName"
              name="vendorName"
              type="text"
              value={formData.vendorName}
              onChange={handleChange}
              placeholder="e.g. ABC Laptops Pvt Ltd"
            />
            {errors.vendorName && (
              <span className="field-error">{errors.vendorName}</span>
            )}
          </div>

          {/* ---------- CONTACT PERSON ---------- */}

          <div className="form-group">
            <label htmlFor="contactPerson">Contact Person</label>
            <input
              id="contactPerson"
              name="contactPerson"
              type="text"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
            />
          </div>

          {/* ---------- PHONE ---------- */}

          <div className="form-group">
            <label htmlFor="phone">
              Phone <span className="required">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
            />
            {errors.phone && (
              <span className="field-error">{errors.phone}</span>
            )}
          </div>

          {/* ---------- EMAIL ---------- */}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="vendor@example.com"
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          {/* ---------- ADDRESS ---------- */}

          <div className="form-group full-width">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street / area"
            />
          </div>

          {/* ---------- CITY ---------- */}

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          {/* ---------- STATE ---------- */}

          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              id="state"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          {/* ---------- PINCODE ---------- */}

          <div className="form-group">
            <label htmlFor="pincode">Pincode</label>
            <input
              id="pincode"
              name="pincode"
              type="text"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="6-digit pincode"
            />
            {errors.pincode && (
              <span className="field-error">{errors.pincode}</span>
            )}
          </div>

          {/* ---------- GST NUMBER ---------- */}

          <div className="form-group">
            <label htmlFor="gstNumber">GST Number</label>
            <input
              id="gstNumber"
              name="gstNumber"
              type="text"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="e.g. 27AAAAA0000A1Z5"
            />
          </div>

          {/* ---------- PAN NUMBER ---------- */}

          <div className="form-group">
            <label htmlFor="panNumber">PAN Number</label>
            <input
              id="panNumber"
              name="panNumber"
              type="text"
              value={formData.panNumber}
              onChange={handleChange}
              placeholder="e.g. ABPCS7374G"
            />
          </div>

        </div>

        {/* ---------- BANK DETAILS SECTION ---------- */}

        <div className="form-section-divider">
          <span>Bank Details</span>
        </div>

        <div className="form-grid">

          <div className="form-group">
            <label htmlFor="accountHolderName">Account Holder Name</label>
            <input
              id="accountHolderName"
              name="accountHolderName"
              type="text"
              value={formData.bankDetails.accountHolderName}
              onChange={handleBankDetailsChange}
              placeholder="e.g. ABC Laptops Pvt Ltd"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bankName">Bank Name</label>
            <input
              id="bankName"
              name="bankName"
              type="text"
              value={formData.bankDetails.bankName}
              onChange={handleBankDetailsChange}
              placeholder="e.g. Kotak Mahindra Bank"
            />
          </div>

          <div className="form-group">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              id="accountNumber"
              name="accountNumber"
              type="text"
              value={formData.bankDetails.accountNumber}
              onChange={handleBankDetailsChange}
              placeholder="e.g. 6146514098"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ifscCode">IFSC Code</label>
            <input
              id="ifscCode"
              name="ifscCode"
              type="text"
              value={formData.bankDetails.ifscCode}
              onChange={handleBankDetailsChange}
              placeholder="e.g. KKBK0008513"
            />
          </div>

        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(`/vendors/${vendorId}`)}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </form>

    </div>
  );
}


export default EditVendor;
