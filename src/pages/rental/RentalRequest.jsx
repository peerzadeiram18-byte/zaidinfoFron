import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";

import { getRentalProduct, createRentalRequest } from "../../services/rentalApi";

import "./RentalRequest.css";

const getResponseData = (response) => {
  return (
    response?.data?.data ??
    response?.data?.rentalProduct ??
    response?.data?.product ??
    response?.data ??
    null
  );
};

const getProductData = (data) => {
  if (!data) return null;

  // Sometimes API may return:
  // { product: {...}, ...rentalConfig }
  // or directly rental config
  return data;
};

const getProductName = (rentalProduct) => {
  return (
    rentalProduct?.product?.name ||
    rentalProduct?.product?.title ||
    rentalProduct?.name ||
    "Rental Product"
  );
};

const getImage = (rentalProduct) => {
  const images = rentalProduct?.product?.images;

  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];

    if (typeof first === "string") {
      return first;
    }

    if (typeof first === "object") {
      return (
        first?.url ||
        first?.imageUrl ||
        first?.path ||
        first?.src ||
        ""
      );
    }
  }

  return (
    rentalProduct?.product?.image ||
    rentalProduct?.product?.primaryImage ||
    rentalProduct?.product?.thumbnail ||
    rentalProduct?.image ||
    ""
  );
};

const buildImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "";

  return `${apiUrl.replace(/\/+$/, "")}/${String(image).replace(
    /^\/+/,
    ""
  )}`;
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

function RentalRequest() {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [rentalProduct, setRentalProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [customerType, setCustomerType] = useState("INDIVIDUAL");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",

    companyName: "",
    contactPerson: "",
    companyPhone: "",
    companyEmail: "",
    officeAddress: "",
    gstNumber: "",

    rentalMonths: 3,
    notes: "",
  });

  const [errors, setErrors] = useState({});

  // ==========================================
  // LOAD RENTAL PRODUCT
  // ==========================================

  useEffect(() => {
    let mounted = true;

    const loadRentalProduct = async () => {
      if (!productId) {
        toast.error("Rental product ID missing");
        navigate("/rentals");
        return;
      }

      try {
        setLoadingProduct(true);

        const response = await getRentalProduct(productId);

        console.log("Rental product response:", response);

        const data = getResponseData(response);

        if (!data) {
          throw new Error("Rental product not found");
        }

        if (mounted) {
          const normalized = getProductData(data);

          setRentalProduct(normalized);

          const backendMinimum = Number(
            normalized?.minimumRentalMonths || 3
          );

          setForm((previous) => ({
            ...previous,
            rentalMonths: Math.max(3, backendMinimum),
          }));
        }
      } catch (error) {
        console.error("Load rental product error:", error);

        if (mounted) {
          toast.error(
            error?.response?.data?.message ||
              error?.message ||
              "Unable to load rental product"
          );

          setRentalProduct(null);
        }
      } finally {
        if (mounted) {
          setLoadingProduct(false);
        }
      }
    };

    loadRentalProduct();

    return () => {
      mounted = false;
    };
  }, [productId, navigate]);

  // ==========================================
  // RENTAL CONFIG
  // ==========================================

  const minimumRentalMonths = useMemo(() => {
    return Math.max(
      3,
      Number(rentalProduct?.minimumRentalMonths || 3)
    );
  }, [rentalProduct]);

  const monthlyRent = Number(rentalProduct?.monthlyRent || 0);
  const securityDeposit = Number(
    rentalProduct?.securityDeposit || 0
  );
  const gstPercentage = Number(rentalProduct?.gst || 0);

  const monthlyGST = (monthlyRent * gstPercentage) / 100;

  const monthlyTotal = monthlyRent + monthlyGST;

  const selectedMonths = Math.max(
    minimumRentalMonths,
    Number(form.rentalMonths || minimumRentalMonths)
  );

  const rentalAmount = monthlyTotal * selectedMonths;

  const initialAmount = rentalAmount + securityDeposit;

  // ==========================================
  // INPUT HANDLER
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // ==========================================
  // CUSTOMER TYPE
  // ==========================================

  const handleCustomerTypeChange = (type) => {
    setCustomerType(type);

    setErrors({});
  };

  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    const newErrors = {};

    if (!customerType) {
      newErrors.customerType = "Please select customer type";
    }

    const months = Number(form.rentalMonths);

    if (!Number.isInteger(months)) {
      newErrors.rentalMonths = "Rental months must be a whole number";
    } else if (months < minimumRentalMonths) {
      newErrors.rentalMonths = `Minimum rental period is ${minimumRentalMonths} months`;
    }

    if (customerType === "INDIVIDUAL") {
      if (!form.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }

      if (!form.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone.trim())) {
        newErrors.phone = "Enter a valid phone number";
      }

      if (!form.email.trim()) {
        newErrors.email = "Email is required";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
      ) {
        newErrors.email = "Enter a valid email";
      }

      if (!form.address.trim()) {
        newErrors.address = "Address is required";
      }
    }

    if (customerType === "COMPANY") {
      if (!form.companyName.trim()) {
        newErrors.companyName = "Company name is required";
      }

      if (!form.contactPerson.trim()) {
        newErrors.contactPerson = "Contact person is required";
      }

      if (!form.companyPhone.trim()) {
        newErrors.companyPhone = "Company phone is required";
      } else if (
        !/^[0-9+\-\s()]{7,20}$/.test(form.companyPhone.trim())
      ) {
        newErrors.companyPhone = "Enter a valid phone number";
      }

      if (!form.companyEmail.trim()) {
        newErrors.companyEmail = "Company email is required";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.companyEmail.trim())
      ) {
        newErrors.companyEmail = "Enter a valid email";
      }

      if (!form.officeAddress.trim()) {
        newErrors.officeAddress = "Office address is required";
      }

      // GST is collected but backend schema does not make it required.
      // So we don't force GST here.
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // SUBMIT RENTAL REQUEST
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    if (!rentalProduct) {
      toast.error("Rental product information is not available");
      return;
    }

    if (!rentalProduct?.isAvailableForRent) {
      toast.error("This product is currently unavailable for rent");
      return;
    }

    if (
      Number(rentalProduct?.availableQuantity || 0) <= 0
    ) {
      toast.error("No rental unit is currently available");
      return;
    }

    if (!validateForm()) {
      toast.error("Please complete the required fields");
      return;
    }

    const months = Number(form.rentalMonths);

    // ==========================================
    // EXACT BACKEND REQUEST BODY
    // ==========================================

    const payload = {
      rentalProductId:
        rentalProduct?._id ||
        rentalProduct?.rentalProductId,

      customerType,

      individualDetails:
        customerType === "INDIVIDUAL"
          ? {
              fullName: form.fullName.trim(),
              phone: form.phone.trim(),
              email: form.email.trim().toLowerCase(),
              address: form.address.trim(),
            }
          : {},

      companyDetails:
        customerType === "COMPANY"
          ? {
              companyName: form.companyName.trim(),
              contactPerson: form.contactPerson.trim(),
              phone: form.companyPhone.trim(),
              email: form.companyEmail.trim().toLowerCase(),
              officeAddress: form.officeAddress.trim(),
              gstNumber: form.gstNumber.trim().toUpperCase(),
            }
          : {},

      rentalMonths: months,

      notes: form.notes.trim(),
    };

    console.log("Creating rental request:", payload);

    if (!payload.rentalProductId) {
      toast.error("Rental product configuration ID is missing");
      return;
    }

    try {
      setSubmitting(true);

      const response = await createRentalRequest(payload);

      console.log("Create rental response:", response);

      toast.success(
        response?.data?.message ||
          "Rental request created successfully"
      );

      /*
       * We will build RentalSummary in the next step.
       *
       * For now navigate to My Rentals.
       */
      navigate("/my-rentals");
    } catch (error) {
      console.error("Create rental request error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to create rental request";

      if (error?.response?.status === 401) {
        toast.error("Please login before submitting a rental request");
      } else {
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loadingProduct) {
    return (
      <div className="rental-request-page">
        <div className="rental-request-loading">
          <Loader2 className="rental-spinner" size={36} />
          <p>Loading rental details...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!rentalProduct) {
    return (
      <div className="rental-request-page">
        <div className="rental-request-empty">
          <h2>Rental product not found</h2>

          <p>
            We couldn't load the selected rental product.
          </p>

          <button
            type="button"
            onClick={() => navigate("/rentals")}
            className="rental-back-button"
          >
            <ArrowLeft size={18} />
            Back to Rentals
          </button>
        </div>
      </div>
    );
  }

  const productName = getProductName(rentalProduct);
  const imageUrl = buildImageUrl(getImage(rentalProduct));

  return (
    <div className="rental-request-page">
      <div className="rental-request-container">
        {/* ======================================
            TOP
        ====================================== */}

        <div className="rental-request-top">
          <button
            type="button"
            className="rental-back-link"
            onClick={() =>
              navigate(`/rental/${productId}`)
            }
          >
            <ArrowLeft size={18} />
            Back to Rental Details
          </button>

          <div>
            <span className="rental-request-eyebrow">
              RENTAL APPLICATION
            </span>

            <h1>Apply for Rental</h1>

            <p>
              Enter your details to submit a rental request.
            </p>
          </div>
        </div>

        <form
          className="rental-request-layout"
          onSubmit={handleSubmit}
        >
          {/* ======================================
              LEFT FORM
          ====================================== */}

          <div className="rental-request-form-card">
            {/* CUSTOMER TYPE */}

            <section className="rental-form-section">
              <div className="rental-section-heading">
                <div className="rental-section-icon">
                  <User size={20} />
                </div>

                <div>
                  <h2>Customer Type</h2>
                  <p>Select whether you are renting personally or for a company.</p>
                </div>
              </div>

              <div className="customer-type-grid">
                <button
                  type="button"
                  className={`customer-type-card ${
                    customerType === "INDIVIDUAL"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleCustomerTypeChange("INDIVIDUAL")
                  }
                >
                  <User size={25} />

                  <div>
                    <strong>Individual</strong>
                    <span>Personal rental</span>
                  </div>

                  {customerType === "INDIVIDUAL" && (
                    <CheckCircle
                      className="customer-type-check"
                      size={20}
                    />
                  )}
                </button>

                <button
                  type="button"
                  className={`customer-type-card ${
                    customerType === "COMPANY"
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleCustomerTypeChange("COMPANY")
                  }
                >
                  <Building2 size={25} />

                  <div>
                    <strong>Company</strong>
                    <span>Business rental</span>
                  </div>

                  {customerType === "COMPANY" && (
                    <CheckCircle
                      className="customer-type-check"
                      size={20}
                    />
                  )}
                </button>
              </div>
            </section>

            {/* ======================================
                INDIVIDUAL
            ====================================== */}

            {customerType === "INDIVIDUAL" && (
              <section className="rental-form-section">
                <div className="rental-section-heading">
                  <div className="rental-section-icon">
                    <User size={20} />
                  </div>

                  <div>
                    <h2>Personal Details</h2>
                    <p>Enter your contact information.</p>
                  </div>
                </div>

                <div className="rental-form-grid">
                  <div className="rental-field full">
                    <label>
                      Full Name <span>*</span>
                    </label>

                    <div className="input-with-icon">
                      <User size={18} />

                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                      />
                    </div>

                    {errors.fullName && (
                      <small className="field-error">
                        {errors.fullName}
                      </small>
                    )}
                  </div>

                  <div className="rental-field">
                    <label>
                      Phone Number <span>*</span>
                    </label>

                    <div className="input-with-icon">
                      <Phone size={18} />

                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                      />
                    </div>

                    {errors.phone && (
                      <small className="field-error">
                        {errors.phone}
                      </small>
                    )}
                  </div>

                  <div className="rental-field">
                    <label>
                      Email <span>*</span>
                    </label>

                    <div className="input-with-icon">
                      <Mail size={18} />

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                      />
                    </div>

                    {errors.email && (
                      <small className="field-error">
                        {errors.email}
                      </small>
                    )}
                  </div>

                  <div className="rental-field full">
                    <label>
                      Address <span>*</span>
                    </label>

                    <div className="input-with-icon textarea-icon">
                      <MapPin size={18} />

                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Enter your complete address"
                        rows={4}
                      />
                    </div>

                    {errors.address && (
                      <small className="field-error">
                        {errors.address}
                      </small>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* ======================================
                COMPANY
            ====================================== */}

            {customerType === "COMPANY" && (
              <section className="rental-form-section">
                <div className="rental-section-heading">
                  <div className="rental-section-icon">
                    <Building2 size={20} />
                  </div>

                  <div>
                    <h2>Company Details</h2>
                    <p>Enter your business information.</p>
                  </div>
                </div>

                <div className="rental-form-grid">
                  <div className="rental-field full">
                    <label>
                      Company Name <span>*</span>
                    </label>

                    <div className="input-with-icon">
                      <Building2 size={18} />

                      <input
                        type="text"
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="Enter company name"
                      />
                    </div>

                    {errors.companyName && (
                      <small className="field-error">
                        {errors.companyName}
                      </small>
                    )}
                  </div>

                  <div className="rental-field">
                    <label>
                      Contact Person <span>*</span>
                    </label>

                    <div className="input-with-icon">
                      <User size={18} />

                      <input
                        type="text"
                        name="contactPerson"
                        value={form.contactPerson}
                        onChange={handleChange}
                        placeholder="Contact person name"
                      />
                    </div>

                    {errors.contactPerson && (
                      <small className="field-error">
                        {errors.contactPerson}
                      </small>
                    )}
                  </div>

                  <div className="rental-field">
                    <label>
                      Phone Number <span>*</span>
                    </label>

                    <div className="input-with-icon">
                      <Phone size={18} />

                      <input
                        type="tel"
                        name="companyPhone"
                        value={form.companyPhone}
                        onChange={handleChange}
                        placeholder="Company phone"
                      />
                    </div>

                    {errors.companyPhone && (
                      <small className="field-error">
                        {errors.companyPhone}
                      </small>
                    )}
                  </div>

                  <div className="rental-field">
                    <label>
                      Company Email <span>*</span>
                    </label>

                    <div className="input-with-icon">
                      <Mail size={18} />

                      <input
                        type="email"
                        name="companyEmail"
                        value={form.companyEmail}
                        onChange={handleChange}
                        placeholder="Company email"
                      />
                    </div>

                    {errors.companyEmail && (
                      <small className="field-error">
                        {errors.companyEmail}
                      </small>
                    )}
                  </div>

                  <div className="rental-field">
                    <label>GST Number</label>

                    <div className="input-with-icon">
                      <FileText size={18} />

                      <input
                        type="text"
                        name="gstNumber"
                        value={form.gstNumber}
                        onChange={handleChange}
                        placeholder="Enter GST number"
                      />
                    </div>
                  </div>

                  <div className="rental-field full">
                    <label>
                      Office Address <span>*</span>
                    </label>

                    <div className="input-with-icon textarea-icon">
                      <MapPin size={18} />

                      <textarea
                        name="officeAddress"
                        value={form.officeAddress}
                        onChange={handleChange}
                        placeholder="Enter complete office address"
                        rows={4}
                      />
                    </div>

                    {errors.officeAddress && (
                      <small className="field-error">
                        {errors.officeAddress}
                      </small>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* ======================================
                RENTAL PERIOD
            ====================================== */}

            <section className="rental-form-section">
              <div className="rental-section-heading">
                <div className="rental-section-icon">
                  <FileText size={20} />
                </div>

                <div>
                  <h2>Rental Period</h2>
                  <p>
                    Choose how many months you want to rent the laptop.
                  </p>
                </div>
              </div>

              <div className="rental-form-grid">
                <div className="rental-field">
                  <label>
                    Rental Months <span>*</span>
                  </label>

                  <input
                    className="normal-input"
                    type="number"
                    name="rentalMonths"
                    min={minimumRentalMonths}
                    step="1"
                    value={form.rentalMonths}
                    onChange={handleChange}
                  />

                  <small className="field-help">
                    Minimum rental period:{" "}
                    <strong>
                      {minimumRentalMonths} months
                    </strong>
                  </small>

                  {errors.rentalMonths && (
                    <small className="field-error">
                      {errors.rentalMonths}
                    </small>
                  )}
                </div>

                <div className="rental-field">
                  <label>Notes</label>

                  <textarea
                    className="normal-input"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Any additional information..."
                    rows={4}
                  />
                </div>
              </div>
            </section>

            {/* ======================================
                SUBMIT
            ====================================== */}

            <div className="rental-submit-area">
              <button
                type="submit"
                className="rental-submit-button"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2
                      size={20}
                      className="rental-button-spinner"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Submit Rental Request
                  </>
                )}
              </button>

              <p>
                Your request will be reviewed before the rental is approved.
              </p>
            </div>
          </div>

          {/* ======================================
              RIGHT SUMMARY
          ====================================== */}

          <aside className="rental-request-sidebar">
            <div className="request-product-card">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={productName}
                  className="request-product-image"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="request-product-image-placeholder">
                  No Image
                </div>
              )}

              <div className="request-product-content">
                <span>RENTING</span>

                <h3>{productName}</h3>

                {rentalProduct?.product?.brand?.name && (
                  <p>
                    {rentalProduct.product.brand.name}
                  </p>
                )}
              </div>
            </div>

            <div className="rental-cost-card">
              <div className="cost-card-header">
                <h3>Rental Summary</h3>
              </div>

              <div className="cost-row">
                <span>Monthly Rent</span>
                <strong>
                  {formatCurrency(monthlyRent)}
                </strong>
              </div>

              {gstPercentage > 0 && (
                <div className="cost-row">
                  <span>
                    GST ({gstPercentage}%)
                  </span>

                  <strong>
                    {formatCurrency(monthlyGST)}
                  </strong>
                </div>
              )}

              <div className="cost-row">
                <span>Monthly Total</span>

                <strong>
                  {formatCurrency(monthlyTotal)}
                </strong>
              </div>

              <div className="cost-row">
                <span>Rental Period</span>

                <strong>
                  {selectedMonths} months
                </strong>
              </div>

              <div className="cost-divider" />

              <div className="cost-row">
                <span>Rental Amount</span>

                <strong>
                  {formatCurrency(rentalAmount)}
                </strong>
              </div>

              <div className="cost-row">
                <span>Security Deposit</span>

                <strong>
                  {formatCurrency(securityDeposit)}
                </strong>
              </div>

              <div className="cost-total">
                <span>Initial Estimate</span>

                <strong>
                  {formatCurrency(initialAmount)}
                </strong>
              </div>

              <p className="cost-note">
                This is an estimate based on the current rental
                configuration. Final charges are determined by the
                rental process.
              </p>
            </div>

            <div className="rental-request-info-box">
              <CheckCircle size={20} />

              <div>
                <strong>What happens next?</strong>

                <ol>
                  <li>Submit rental request</li>
                  <li>Document verification</li>
                  <li>Rental approval</li>
                  <li>Security deposit</li>
                  <li>Laptop allocation</li>
                </ol>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default RentalRequest;