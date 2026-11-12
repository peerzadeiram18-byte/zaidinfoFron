import React from "react";

import {
  WARRANTY_OPTIONS,
  getWarrantyInfo,
  formatShortDate,
  getPersonLabel,
  getReasonLabel,
  calcRepairAmounts,
} from "./repairHelpers";

import "./repairJobShared.css";

// ======================================================
// FORM FIELDS
// Warranty + Salesperson
//
// form keys: warrantyStatus, warrantyProvider,
// warrantyExpiryDate, warrantyDetails, salespersonName
// ======================================================

export default function JobExtraFields({
  form,
  onChange,
  salespersons = [],
}) {
  const status = form.warrantyStatus || "";

  const showDetails =
    status === "IN_WARRANTY" ||
    status === "OUT_OF_WARRANTY";

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const expiredWarning =
    status === "IN_WARRANTY" &&
    form.warrantyExpiryDate &&
    new Date(form.warrantyExpiryDate) < startOfToday;

  return (
    <div className="rjx-fields">
              {/* INVOICE TYPE (GST / NON-GST) */}

      <div className="rjx-field">
        <label htmlFor="rjxInvoiceType">
          Invoice Type <span className="rjx-req">*</span>
        </label>

        <select
          id="rjxInvoiceType"
          name="invoiceType"
          value={form.invoiceType || ""}
          onChange={onChange}
          required
        >
          <option value="">-- Select Invoice Type --</option>
          <option value="GST">GST Invoice (Tax Invoice)</option>
          <option value="NON_GST">Non-GST Invoice</option>
        </select>

        <span className="rjx-hint">
          Estimated Cost base amount hai. GST invoice me GST upar se judega.
        </span>
      </div>

      {form.invoiceType === "GST" && (
        <div className="rjx-field">
          <label htmlFor="rjxGstPercentage">
            GST Percentage (%) <span className="rjx-req">*</span>
          </label>

          <input
            id="rjxGstPercentage"
            type="number"
            name="gstPercentage"
            min="0"
            max="100"
            step="0.01"
            value={form.gstPercentage ?? ""}
            onChange={onChange}
            required
          />
        </div>
      )}
      {/* WARRANTY STATUS */}

      <div className="rjx-field">
        <label htmlFor="rjxWarrantyStatus">
          Warranty Status <span className="rjx-req">*</span>
        </label>

        <select
          id="rjxWarrantyStatus"
          name="warrantyStatus"
          value={status}
          onChange={onChange}
          required
        >
          <option value="">-- Select Warranty --</option>

          {WARRANTY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* SALESPERSON */}

      <div className="rjx-field">
        <label htmlFor="rjxSalesperson">
          Salesperson Name{" "}
          <span className="rjx-hint">(select or type)</span>
        </label>

        <input
          id="rjxSalesperson"
          type="text"
          name="salespersonName"
          list="rjx-salesperson-list"
          value={form.salespersonName || ""}
          onChange={onChange}
          placeholder="Select or enter salesperson name"
          maxLength={100}
          autoComplete="off"
        />

        <datalist id="rjx-salesperson-list">
          {salespersons.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </div>

      {/* WARRANTY DETAILS */}

      {showDetails && (
        <>
          <div className="rjx-field">
            <label htmlFor="rjxWarrantyProvider">
              Warranty Provider / Type{" "}
              <span className="rjx-hint">(optional)</span>
            </label>

            <input
              id="rjxWarrantyProvider"
              type="text"
              name="warrantyProvider"
              value={form.warrantyProvider || ""}
              onChange={onChange}
              placeholder="e.g. HP Manufacturer, Extended, Shop warranty"
              maxLength={100}
            />
          </div>

          <div className="rjx-field">
            <label htmlFor="rjxWarrantyExpiry">
              {status === "IN_WARRANTY"
                ? "Warranty Expiry Date"
                : "Warranty Expiry Date (if known)"}
            </label>

            <input
              id="rjxWarrantyExpiry"
              type="date"
              name="warrantyExpiryDate"
              value={form.warrantyExpiryDate || ""}
              onChange={onChange}
            />

            {expiredWarning && (
              <span className="rjx-warn">
                Ye date nikal chuki hai. Warranty Status check kar lein.
              </span>
            )}
          </div>

          <div className="rjx-field rjx-full">
            <label htmlFor="rjxWarrantyDetails">
              Warranty Details{" "}
              <span className="rjx-hint">(optional)</span>
            </label>

            <textarea
              id="rjxWarrantyDetails"
              name="warrantyDetails"
              rows={2}
              value={form.warrantyDetails || ""}
              onChange={onChange}
              placeholder="Warranty card no., invoice no., coverage, terms..."
              maxLength={500}
            />
          </div>
        </>
      )}
    </div>
  );
}

// ======================================================
// WARRANTY BADGE
// ======================================================

const TONES = {
  success: {
    background: "#dcfce7",
    color: "#166534",
    border: "1px solid #bbf7d0",
  },
  danger: {
    background: "#fee2e2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
  },
  muted: {
    background: "#f3f4f6",
    color: "#374151",
    border: "1px solid #e5e7eb",
  },
};

export function WarrantyBadge({ repair }) {
  const info = getWarrantyInfo(repair);

  const expiryText = info.expiry
    ? ` • ${info.expired ? "Expired" : "Expires"} ${formatShortDate(
        info.expiry
      )}`
    : "";

  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        ...TONES[info.tone],
      }}
    >
      {info.label}
      {expiryText}
    </span>
  );
}

// ======================================================
// JOB EXTRA SUMMARY
// Inline styles (print window me bhi sahi dikhe)
//
// showNotes     = technician notes dikhao (internal view)
// showTransfers = transfer history dikhao (internal view)
// ======================================================

export function JobExtraSummary({
  repair,
  showNotes = false,
  showTransfers = false,
}) {
  if (!repair) return null;

  const info = getWarrantyInfo(repair);

  const history = Array.isArray(repair.transferHistory)
    ? repair.transferHistory
    : [];

  const box = {
    margin: "12px 0",
    padding: 12,
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    background: "#f8fafc",
    fontSize: 13,
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  };

  const lineStyle = { margin: "2px 0" };

  return (
    <div style={box}>
      <strong style={{ display: "block", marginBottom: 6 }}>
        WARRANTY & SALES DETAILS
      </strong>

      <div style={lineStyle}>
        <strong>Warranty:</strong> <WarrantyBadge repair={repair} />
      </div>

      {info.provider && (
        <div style={lineStyle}>
          <strong>Warranty Provider:</strong> {info.provider}
        </div>
      )}

      {info.expiry && (
        <div style={lineStyle}>
          <strong>Warranty Expiry:</strong>{" "}
          {formatShortDate(info.expiry)}
          {info.daysLeft !== null &&
            !info.expired &&
            ` (${info.daysLeft} day${
              info.daysLeft === 1 ? "" : "s"
            } left)`}
        </div>
      )}

      {info.details && (
        <div style={lineStyle}>
          <strong>Warranty Details:</strong> {info.details}
        </div>
      )}

      <div style={lineStyle}>
        <strong>Salesperson:</strong>{" "}
        {repair.salespersonName || "Not recorded"}
      </div>

      
      <div style={lineStyle}>
        <strong>Invoice Type:</strong>{" "}
        {(() => {
          const amounts = calcRepairAmounts(repair);

          return amounts.isGst
            ? `GST Invoice (${amounts.pct}%)`
            : "Non-GST";
        })()}
      </div>

      {showNotes && (
        <div style={{ ...lineStyle, whiteSpace: "pre-wrap" }}>
          <strong>Technician Notes:</strong>{" "}
          {repair.technicianNotes || "No notes added yet."}
        </div>
      )}

      {showTransfers && history.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <strong>Technician Transfer History:</strong>

          {history.map((item, index) => (
            <div
              key={item._id || index}
              style={{
                ...lineStyle,
                paddingLeft: 8,
                borderLeft: "3px solid #93c5fd",
                marginTop: 6,
              }}
            >
              {formatShortDate(item.transferredAt)}:{" "}
              {getPersonLabel(item.fromTechnician) ||
                "Unassigned"}{" "}
              → {getPersonLabel(item.toTechnician) || "Technician"}{" "}
              ({getReasonLabel(item.reason)})
              {item.note ? ` — ${item.note}` : ""}
              {getPersonLabel(item.transferredBy)
                ? ` [by ${getPersonLabel(item.transferredBy)}]`
                : ""}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ======================================================
// REPAIR GST SUMMARY
// Receipt me base amount, CGST, SGST aur total payable.
// Inline styles: print window me bhi sahi dikhta hai.
// ======================================================

export function RepairGstSummary({ repair }) {
  if (!repair) return null;

  const amounts = calcRepairAmounts(repair);

  const rupee = (value) =>
    `₹ ${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const box = {
    margin: "14px 0",
    padding: 12,
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    fontSize: 13,
    lineHeight: 1.5,
  };

  const row = {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    margin: "3px 0",
  };

  return (
    <div style={box}>
      <strong style={{ display: "block", marginBottom: 6 }}>
        {amounts.isGst
          ? `TAX INVOICE - GST BREAKUP (${amounts.pct}%)`
          : "NON-GST BILL"}
      </strong>

      <div style={row}>
        <span>
          {amounts.isGst
            ? "Taxable Value (Service Amount)"
            : "Service Amount"}
        </span>

        <strong>{rupee(amounts.base)}</strong>
      </div>

      {amounts.isGst ? (
        <>
          <div style={row}>
            <span>CGST ({amounts.pct / 2}%)</span>
            <strong>{rupee(amounts.cgst)}</strong>
          </div>

          <div style={row}>
            <span>SGST ({amounts.pct / 2}%)</span>
            <strong>{rupee(amounts.sgst)}</strong>
          </div>
        </>
      ) : (
        <div style={row}>
          <span>GST</span>
          <strong>Not applicable</strong>
        </div>
      )}

      <div
        style={{
          ...row,
          borderTop: "1px solid #cbd5e1",
          paddingTop: 6,
          marginTop: 6,
          fontSize: 14,
        }}
      >
        <strong>Total Payable</strong>
        <strong>{rupee(amounts.total)}</strong>
      </div>
    </div>
  );
}