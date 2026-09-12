import React from "react";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  Laptop,
  Mail,
  MapPin,
  Phone,
  Receipt,
  ShieldCheck,
  User,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import RentalStatus from "../../components/rental/RentalStatus";

import "./RentalSummary.css";

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getProductName = (rental) => {
  return (
    rental?.productId?.name ||
    rental?.productId?.title ||
    rental?.product?.name ||
    "Rental Laptop"
  );
};

const getProductImage = (rental) => {
  const product = rental?.productId || rental?.product;

  const images = product?.images;

  if (Array.isArray(images) && images.length) {
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
    product?.image ||
    product?.primaryImage ||
    product?.thumbnail ||
    ""
  );
};

const buildImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "";

  return `${apiUrl.replace(/\/+$/, "")}/${String(image).replace(
    /^\/+/,
    ""
  )}`;
};

function RentalSummary({ rental }) {
  const navigate = useNavigate();

  if (!rental) {
    return (
      <div className="rental-summary-empty">
        <h2>Rental not found</h2>

        <p>
          We could not find the rental information.
        </p>

        <button
          type="button"
          onClick={() => navigate("/my-rentals")}
        >
          <ArrowLeft size={18} />
          Back to My Rentals
        </button>
      </div>
    );
  }

  const productName = getProductName(rental);

  const imageUrl = buildImageUrl(
    getProductImage(rental)
  );

  const customerType =
    rental?.customerType || "INDIVIDUAL";

  const individual = rental?.individualDetails || {};
  const company = rental?.companyDetails || {};

  const monthlyRent = Number(rental?.monthlyRent || 0);

  const gstPercentage = Number(
    rental?.gstPercentage || 0
  );

  const monthlyGST =
    (monthlyRent * gstPercentage) / 100;

  const monthlyTotal = monthlyRent + monthlyGST;

  const months = Number(rental?.rentalMonths || 0);

  const rentalAmount = monthlyTotal * months;

  const securityDeposit = Number(
    rental?.securityDeposit || 0
  );

  return (
    <div className="rental-summary-page">
      <div className="rental-summary-container">
        {/* Header */}

        <div className="rental-summary-header">
          <button
            type="button"
            onClick={() => navigate("/my-rentals")}
            className="rental-summary-back"
          >
            <ArrowLeft size={18} />
            My Rentals
          </button>

          <div>
            <span>RENTAL SUMMARY</span>

            <h1>
              {rental.rentalNumber ||
                "Rental Request"}
            </h1>
          </div>
        </div>

        {/* Product */}

        <div className="rental-summary-product">
          <div className="summary-product-image">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={productName}
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />
            ) : (
              <Laptop size={45} />
            )}
          </div>

          <div className="summary-product-info">
            <span>RENTAL PRODUCT</span>

            <h2>{productName}</h2>

            <p>
              Rental ID:{" "}
              <strong>
                {rental.rentalNumber || rental._id}
              </strong>
            </p>
          </div>
        </div>

        {/* Status */}

        <section className="rental-summary-card">
          <div className="summary-card-heading">
            <div>
              <h2>Rental Status</h2>
              <p>Track your rental request progress.</p>
            </div>
          </div>

          <RentalStatus status={rental.status} />
        </section>

        <div className="rental-summary-grid">
          {/* Rental Details */}

          <section className="rental-summary-card">
            <div className="summary-card-heading">
              <div className="summary-heading-icon">
                <FileText size={19} />
              </div>

              <div>
                <h2>Rental Details</h2>
                <p>Important rental information.</p>
              </div>
            </div>

            <div className="summary-info-grid">
              <div className="summary-info-item">
                <span>Rental Months</span>
                <strong>
                  {months || "—"} months
                </strong>
              </div>

              <div className="summary-info-item">
                <span>Monthly Rent</span>
                <strong>
                  {formatCurrency(monthlyRent)}
                </strong>
              </div>

              <div className="summary-info-item">
                <span>GST</span>
                <strong>
                  {gstPercentage}%{" "}
                  {gstPercentage > 0
                    ? `(${formatCurrency(monthlyGST)})`
                    : ""}
                </strong>
              </div>

              <div className="summary-info-item">
                <span>Security Deposit</span>
                <strong>
                  {formatCurrency(securityDeposit)}
                </strong>
              </div>

              <div className="summary-info-item">
                <span>Start Date</span>
                <strong>
                  {formatDate(rental.startDate)}
                </strong>
              </div>

              <div className="summary-info-item">
                <span>Expected End</span>
                <strong>
                  {formatDate(
                    rental.expectedEndDate
                  )}
                </strong>
              </div>

              <div className="summary-info-item">
                <span>Next Payment</span>
                <strong>
                  {formatDate(
                    rental.nextPaymentDate
                  )}
                </strong>
              </div>

              <div className="summary-info-item">
                <span>Last Payment</span>
                <strong>
                  {formatDate(
                    rental.lastPaymentDate
                  )}
                </strong>
              </div>
            </div>
          </section>

          {/* Pricing */}

          <section className="rental-summary-card">
            <div className="summary-card-heading">
              <div className="summary-heading-icon">
                <WalletCards size={19} />
              </div>

              <div>
                <h2>Pricing</h2>
                <p>Rental cost overview.</p>
              </div>
            </div>

            <div className="summary-price-row">
              <span>Monthly Rent</span>
              <strong>
                {formatCurrency(monthlyRent)}
              </strong>
            </div>

            {gstPercentage > 0 && (
              <div className="summary-price-row">
                <span>Monthly GST</span>
                <strong>
                  {formatCurrency(monthlyGST)}
                </strong>
              </div>
            )}

            <div className="summary-price-row">
              <span>Monthly Total</span>
              <strong>
                {formatCurrency(monthlyTotal)}
              </strong>
            </div>

            <div className="summary-price-row">
              <span>
                Rental Amount ({months} months)
              </span>

              <strong>
                {formatCurrency(rentalAmount)}
              </strong>
            </div>

            <div className="summary-price-row">
              <span>Security Deposit</span>

              <strong>
                {formatCurrency(securityDeposit)}
              </strong>
            </div>

            <div className="summary-price-total">
              <span>Initial Amount</span>

              <strong>
                {formatCurrency(
                  rentalAmount + securityDeposit
                )}
              </strong>
            </div>
          </section>

          {/* Customer Details */}

          <section className="rental-summary-card">
            <div className="summary-card-heading">
              <div className="summary-heading-icon">
                {customerType === "COMPANY" ? (
                  <Building2 size={19} />
                ) : (
                  <User size={19} />
                )}
              </div>

              <div>
                <h2>Customer Details</h2>
                <p>
                  {customerType === "COMPANY"
                    ? "Company information"
                    : "Personal information"}
                </p>
              </div>
            </div>

            {customerType === "INDIVIDUAL" ? (
              <div className="customer-summary">
                <div>
                  <User size={17} />
                  <span>
                    {individual.fullName || "—"}
                  </span>
                </div>

                <div>
                  <Phone size={17} />
                  <span>
                    {individual.phone || "—"}
                  </span>
                </div>

                <div>
                  <Mail size={17} />
                  <span>
                    {individual.email || "—"}
                  </span>
                </div>

                <div>
                  <MapPin size={17} />
                  <span>
                    {individual.address || "—"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="customer-summary">
                <div>
                  <Building2 size={17} />
                  <span>
                    {company.companyName || "—"}
                  </span>
                </div>

                <div>
                  <User size={17} />
                  <span>
                    {company.contactPerson || "—"}
                  </span>
                </div>

                <div>
                  <Phone size={17} />
                  <span>
                    {company.phone || "—"}
                  </span>
                </div>

                <div>
                  <Mail size={17} />
                  <span>
                    {company.email || "—"}
                  </span>
                </div>

                <div>
                  <MapPin size={17} />
                  <span>
                    {company.officeAddress || "—"}
                  </span>
                </div>

                {company.gstNumber && (
                  <div>
                    <Receipt size={17} />
                    <span>
                      GST: {company.gstNumber}
                    </span>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Important dates */}

          <section className="rental-summary-card">
            <div className="summary-card-heading">
              <div className="summary-heading-icon">
                <CalendarDays size={19} />
              </div>

              <div>
                <h2>Rental Dates</h2>
                <p>Important rental schedule.</p>
              </div>
            </div>

            <div className="summary-date-list">
              <div>
                <span>Created</span>
                <strong>
                  {formatDate(rental.createdAt)}
                </strong>
              </div>

              <div>
                <span>Approved</span>
                <strong>
                  {formatDate(rental.approvedAt)}
                </strong>
              </div>

              <div>
                <span>Allocated</span>
                <strong>
                  {formatDate(rental.allocatedAt)}
                </strong>
              </div>

              <div>
                <span>Expected Return</span>
                <strong>
                  {formatDate(
                    rental.expectedEndDate
                  )}
                </strong>
              </div>

              <div>
                <span>Actual Return</span>
                <strong>
                  {formatDate(
                    rental.actualReturnDate
                  )}
                </strong>
              </div>
            </div>
          </section>
        </div>

        {/* Notes */}

        {rental.notes && (
          <section className="rental-summary-card rental-summary-notes">
            <div className="summary-card-heading">
              <div className="summary-heading-icon">
                <FileText size={19} />
              </div>

              <div>
                <h2>Notes</h2>
              </div>
            </div>

            <p>{rental.notes}</p>
          </section>
        )}

        {/* Security */}

        <div className="rental-summary-security">
          <ShieldCheck size={20} />

          <div>
            <strong>Your rental information is secure</strong>

            <p>
              Rental details and status are retrieved from your
              account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RentalSummary;