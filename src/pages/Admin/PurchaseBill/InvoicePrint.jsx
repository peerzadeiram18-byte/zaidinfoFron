
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../../../api/axios";
import { COMPANY } from "./companyDetails.js";
import { amountInWords } from "./amountInWords.js";

import "./InvoicePrint.css";

// ==========================================================
// DATE FORMAT: dd-Mon-yy
// ==========================================================

function formatInvoiceDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "-";

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-IN", {
    month: "short",
  });
  const year = String(date.getFullYear()).slice(-2);

  return `${day}-${month}-${year}`;
}

// ==========================================================
// NUMBER FORMAT
// ==========================================================

function formatAmount(value) {
  const number = Number(value) || 0;

  return number.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ==========================================================
// SAFE EMPLOYEE NAME
// ==========================================================

function getEmployeeDetails(person) {
  if (!person) {
    return {
      name: "Employee details unavailable",
      role: "Not Available",
      email: "",
    };
  }

  if (typeof person === "string") {
    return {
      name: /^[a-f\d]{24}$/i.test(person)
        ? "Employee details unavailable"
        : person,
      role: "Not Available",
      email: "",
    };
  }

  const fullName = [
    person.firstName,
    person.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    name:
      person.name ||
      person.fullName ||
      fullName ||
      person.username ||
      person.email ||
      "Employee details unavailable",

    role: person.role
      ? String(person.role)
          .replace(/_/g, " ")
          .toUpperCase()
      : person.dashboard
      ? String(person.dashboard)
          .replace(/_/g, " ")
          .toUpperCase()
      : "Not Available",

    email: person.email || "",
  };
}

// ==========================================================
// SALE SOURCE DETECTION
// ==========================================================

function getSaleSource(bill) {
  const rawSource =
    bill?.orderSource ||
    bill?.saleSource ||
    bill?.purchaseSource ||
    bill?.source ||
    bill?.saleType ||
    bill?.purchaseType ||
    bill?.orderType ||
    "";

  return String(rawSource)
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}

function isWalkInBill(bill) {
  const source = getSaleSource(bill);

  return [
    "WALK_IN",
    "WALKIN",
    "WALK_IN_SALE",
    "WALKIN_SALE",
    "COUNTER_SALE",
    "IN_STORE",
  ].includes(source);
}

function getSalesperson(bill) {
  const person =
    bill?.soldBy ||
    bill?.salesperson ||
    bill?.createdBy ||
    bill?.employee ||
    bill?.handledBy ||
    bill?.user ||
    null;

  return getEmployeeDetails(person);
}

// ==========================================================
// COMPONENT
// ==========================================================

function InvoicePrint() {
  const { purchaseId } = useParams();
  const navigate = useNavigate();

  // ========================================================
  // STATE
  // ========================================================

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================================
  // LOAD BILL
  // ========================================================

  useEffect(() => {
    let mounted = true;

    const loadBill = async () => {
      if (!purchaseId) {
        setError("Purchase ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await api.get(
          `/purchase/${purchaseId}`
        );

        const result = response?.data;

        if (!result?.success) {
          throw new Error(
            result?.message || "Failed to load bill"
          );
        }

        const billData =
          result.data?.purchase ||
          result.data?.bill ||
          result.data;

        if (!billData) {
          throw new Error("Bill data not found.");
        }

        if (mounted) {
          setBill(billData);
        }
      } catch (err) {
        console.error("Invoice loading error:", err);

        if (mounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load bill"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadBill();

    return () => {
      mounted = false;
    };
  }, [purchaseId]);

  // ========================================================
  // LOADING STATE
  // ========================================================

  if (loading) {
    return (
      <div className="invoice-print-page">
        <div className="invoice-toolbar">
          <button
            type="button"
            onClick={() => navigate(-1)}
          >
            ← Back to bill
          </button>
        </div>

        <p className="invoice-state">
          Loading invoice...
        </p>
      </div>
    );
  }

  // ========================================================
  // ERROR STATE
  // ========================================================

  if (error || !bill) {
    return (
      <div className="invoice-print-page">
        <div className="invoice-toolbar">
          <button
            type="button"
            onClick={() => navigate(-1)}
          >
            ← Back to bill
          </button>
        </div>

        <p className="invoice-state error">
          {error || "Bill not found"}
        </p>
      </div>
    );
  }

  // ========================================================
  // BILL DATA
  // ========================================================

  const items = Array.isArray(bill.items)
    ? bill.items
    : [];

  const bank = bill.vendorBankDetails || {};

  // ========================================================
  // WALK-IN / ONLINE DETECTION
  // ========================================================

  const saleSource = getSaleSource(bill);

  const isWalkIn = isWalkInBill(bill);

  const isOnline =
    saleSource === "ONLINE";

  const salesperson = getSalesperson(bill);

  // ========================================================
  // COMPUTE ITEM ROWS
  // ========================================================

  const rows = items.map((item) => {
    const quantity = Number(item.quantity) || 0;
    const rateExcl = Number(item.purchasePrice) || 0;
    const gstRate = Number(item.gst) || 0;

    const rateIncl =
      rateExcl * (1 + gstRate / 100);

    const amount = quantity * rateExcl;

    return {
      hsnCode: item.hsnCode || "-",
      unit: item.unit || "NOS",
      description: item.productName || "Item",
      quantity,
      rateExcl,
      rateIncl,
      gstRate,
      amount,
    };
  });

  // ========================================================
  // SAME STATE vs INTER-STATE
  // ========================================================

  const vendorStateNormalized = String(
    bill.vendorState || ""
  )
    .trim()
    .toLowerCase();

  const companyStateNormalized = String(
    COMPANY.state || ""
  )
    .trim()
    .toLowerCase();

  const isSameState =
    !vendorStateNormalized ||
    vendorStateNormalized === companyStateNormalized;

  // ========================================================
  // TOTALS
  // ========================================================

  const taxableSubtotal = rows.reduce(
    (sum, row) => sum + row.amount,
    0
  );

  const totalQuantity = rows.reduce(
    (sum, row) => sum + row.quantity,
    0
  );

  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;

  rows.forEach((row) => {
    const taxOnRow =
      (row.amount * row.gstRate) / 100;

    if (isSameState) {
      totalCgst += taxOnRow / 2;
      totalSgst += taxOnRow / 2;
    } else {
      totalIgst += taxOnRow;
    }
  });

  totalCgst = Number(totalCgst.toFixed(2));
  totalSgst = Number(totalSgst.toFixed(2));
  totalIgst = Number(totalIgst.toFixed(2));

  const totalTax =
    totalCgst + totalSgst + totalIgst;

  const totalBeforeRound =
    taxableSubtotal + totalTax;

  const roundedTotal = Math.round(totalBeforeRound);

  const roundOff = Number(
    (roundedTotal - totalBeforeRound).toFixed(2)
  );

  // ========================================================
  // HSN / SAC TAX SUMMARY
  // ========================================================

  const hsnSummaryMap = new Map();

  rows.forEach((row) => {
    const key = `${row.hsnCode}__${row.gstRate}`;

    const taxOnRow =
      (row.amount * row.gstRate) / 100;

    const cgstOnRow = isSameState
      ? taxOnRow / 2
      : 0;

    const sgstOnRow = isSameState
      ? taxOnRow / 2
      : 0;

    const igstOnRow = isSameState
      ? 0
      : taxOnRow;

    if (!hsnSummaryMap.has(key)) {
      hsnSummaryMap.set(key, {
        hsnCode: row.hsnCode,
        gstRate: row.gstRate,
        taxableValue: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
      });
    }

    const entry = hsnSummaryMap.get(key);

    entry.taxableValue += row.amount;
    entry.cgst += cgstOnRow;
    entry.sgst += sgstOnRow;
    entry.igst += igstOnRow;
  });

  const hsnSummaryRows = Array.from(
    hsnSummaryMap.values()
  );

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <div className="invoice-print-page">

      {/* TOOLBAR */}

      <div className="invoice-toolbar no-print">

        <button
          type="button"
          onClick={() => navigate(-1)}
        >
          ← Back to bill
        </button>

        <button
          type="button"
          className="print-btn"
          onClick={() => window.print()}
        >
          Print / Save as PDF
        </button>

      </div>

      {/* INVOICE SHEET */}

      <div className="invoice-sheet">

        <h1 className="invoice-title">
          INVOICE
        </h1>

        {/* SELLER / BUYER / INVOICE META */}

        <div className="invoice-meta-grid">

          <div className="invoice-meta-left">

            {/* VENDOR */}

            <div className="party-box">

              <strong>
                {bill.vendorName || "-"}
              </strong>

              {bill.vendorAddress && (
                <p>{bill.vendorAddress}</p>
              )}

              <p>
                GSTIN/UIN: {bill.vendorGstNumber || "-"}
              </p>

              <p>
                State Name: {bill.vendorState || "-"}
              </p>

              {bill.vendorEmail && (
                <p>E-Mail: {bill.vendorEmail}</p>
              )}

              {bill.vendorPhone && (
                <p>Phone: {bill.vendorPhone}</p>
              )}

            </div>

            {/* BUYER */}

            <div className="party-box">

              <p className="buyer-label">
                Buyer (Bill to)
              </p>

              <strong>{COMPANY.name}</strong>

              {COMPANY.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}

              <p>
                GSTIN/UIN: {COMPANY.gstin}
              </p>

              <p>
                State Name: {COMPANY.state},
                Code: {COMPANY.stateCode}
              </p>

            </div>

          </div>

          <div className="invoice-meta-right">

            <table className="meta-table">

              <colgroup>
                <col style={{ width: "40%" }} />
                <col style={{ width: "60%" }} />
              </colgroup>

              <tbody>

                <tr>
                  <td>Invoice No.</td>
                  <td>
                    {bill.vendorInvoiceNumber ||
                      bill.invoiceNumber ||
                      bill.billNumber ||
                      "-"}
                  </td>
                </tr>

                <tr>
                  <td>Dated</td>
                  <td>
                    {formatInvoiceDate(
                      bill.invoiceDate ||
                        bill.date ||
                        bill.createdAt
                    )}
                  </td>
                </tr>

                <tr>
                  <td>Purchase No.</td>
                  <td>
                    {bill.purchaseNumber ||
                      bill.purchaseNo ||
                      bill._id ||
                      "-"}
                  </td>
                </tr>

                <tr>
                  <td>PO No.</td>
                  <td>
                    {bill.purchaseOrderNumber ||
                      bill.poNumber ||
                      bill.poNo ||
                      "-"}
                  </td>
                </tr>

                {/* WALK-IN SALESPERSON ONLY */}

                {isWalkIn && (
                  <>
                    <tr className="walkin-employee-row">
                      <td>Sold By</td>
                      <td className="walkin-employee-name">
                        {salesperson.name}
                      </td>
                    </tr>

                    <tr className="walkin-employee-row">
                      <td>Employee Role</td>
                      <td>
                        {salesperson.role}
                      </td>
                    </tr>

                    {salesperson.email && (
                      <tr className="walkin-employee-row">
                        <td>Employee Email</td>
                        <td className="employee-email">
                          {salesperson.email}
                        </td>
                      </tr>
                    )}
                  </>
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* ITEMS TABLE */}

        <table className="items-table">

          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Description of Goods</th>
              <th>HSN/SAC</th>
              <th>Quantity</th>
              <th>Rate (Incl. of Tax)</th>
              <th>Rate</th>
              <th>per</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>

            {rows.length > 0 ? (
              rows.map((row, index) => (
                <tr key={index}>

                  <td className="center">
                    {index + 1}
                  </td>

                  <td>
                    {row.description}
                  </td>

                  <td className="center">
                    {row.hsnCode}
                  </td>

                  <td className="center">
                    {row.quantity} {row.unit}
                  </td>

                  <td className="right">
                    {formatAmount(row.rateIncl)}
                  </td>

                  <td className="right">
                    {formatAmount(row.rateExcl)}
                  </td>

                  <td className="center">
                    {row.unit}
                  </td>

                  <td className="right">
                    {formatAmount(row.amount)}
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="center">
                  No items found
                </td>
              </tr>
            )}

          </tbody>

        </table>

        {/* TAX + TOTAL SUMMARY */}

        <table className="totals-table">

          <tbody>

            <tr>
              <td className="right label-cell">
                Taxable Subtotal
              </td>

              <td className="right">
                {formatAmount(taxableSubtotal)}
              </td>
            </tr>

            {isSameState ? (
              <>
                <tr>
                  <td className="right label-cell">
                    CGST
                  </td>

                  <td className="right">
                    {formatAmount(totalCgst)}
                  </td>
                </tr>

                <tr>
                  <td className="right label-cell">
                    SGST
                  </td>

                  <td className="right">
                    {formatAmount(totalSgst)}
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td className="right label-cell">
                  IGST
                </td>

                <td className="right">
                  {formatAmount(totalIgst)}
                </td>
              </tr>
            )}

            <tr>
              <td className="right label-cell">
                ROUND OFF
              </td>

              <td className="right">
                {roundOff >= 0 ? "" : "-"}
                {formatAmount(Math.abs(roundOff))}
              </td>
            </tr>

            <tr className="total-row">
              <td className="right label-cell">
                Total ({totalQuantity} qty)
              </td>

              <td className="right">
                ₹ {formatAmount(roundedTotal)}
              </td>
            </tr>

          </tbody>

        </table>

        {/* AMOUNT IN WORDS */}

        <p className="amount-words">

          <strong>
            Amount Chargeable (in words)
          </strong>

          <span className="eoe">
            E. &amp; O.E
          </span>

          <br />

          {amountInWords(roundedTotal)}

        </p>

        {/* HSN / SAC TAX SUMMARY */}

        <table className="hsn-summary-table">

          <thead>

            <tr>

              <th rowSpan={2}>
                HSN/SAC
              </th>

              <th rowSpan={2}>
                Taxable Value
              </th>

              {isSameState ? (
                <>
                  <th colSpan={2}>CGST</th>
                  <th colSpan={2}>SGST/UTGST</th>
                </>
              ) : (
                <th colSpan={2}>IGST</th>
              )}

              <th rowSpan={2}>
                Total Tax Amount
              </th>

            </tr>

            <tr>

              {isSameState ? (
                <>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </>
              ) : (
                <>
                  <th>Rate</th>
                  <th>Amount</th>
                </>
              )}

            </tr>

          </thead>

          <tbody>

            {hsnSummaryRows.map((entry, index) => (
              <tr key={index}>

                <td className="center">
                  {entry.hsnCode}
                </td>

                <td className="right">
                  {formatAmount(entry.taxableValue)}
                </td>

                {isSameState ? (
                  <>
                    <td className="center">
                      {(entry.gstRate / 2).toFixed(2)}%
                    </td>

                    <td className="right">
                      {formatAmount(entry.cgst)}
                    </td>

                    <td className="center">
                      {(entry.gstRate / 2).toFixed(2)}%
                    </td>

                    <td className="right">
                      {formatAmount(entry.sgst)}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="center">
                      {entry.gstRate}%
                    </td>

                    <td className="right">
                      {formatAmount(entry.igst)}
                    </td>
                  </>
                )}

                <td className="right">
                  {formatAmount(
                    entry.cgst +
                      entry.sgst +
                      entry.igst
                  )}
                </td>

              </tr>
            ))}

            <tr className="total-row">

              <td className="center">
                Total
              </td>

              <td className="right">
                {formatAmount(taxableSubtotal)}
              </td>

              {isSameState ? (
                <>
                  <td></td>

                  <td className="right">
                    {formatAmount(totalCgst)}
                  </td>

                  <td></td>

                  <td className="right">
                    {formatAmount(totalSgst)}
                  </td>
                </>
              ) : (
                <>
                  <td></td>

                  <td className="right">
                    {formatAmount(totalIgst)}
                  </td>
                </>
              )}

              <td className="right">
                {formatAmount(totalTax)}
              </td>

            </tr>

          </tbody>

        </table>

        {/* TAX AMOUNT IN WORDS */}

        <p className="tax-words">
          Tax Amount (in words): {amountInWords(totalTax)}
        </p>

        {/* DECLARATION / BANK DETAILS / SIGNATURE */}

        <div className="declaration-signature-grid">

          <div className="declaration-box">

            <p className="section-heading">
              Declaration
            </p>

            <p>
              We declare that this invoice shows the actual
              price of the goods described and that all
              particulars are true and correct.
            </p>

          </div>

          <div className="bank-signature-box">

            <div className="bank-details">

              <p className="section-heading">
                Company's Bank Details
              </p>

              <p>
                A/c Holder's Name:{" "}
                {bank.accountHolderName || "-"}
              </p>

              <p>
                Bank Name: {bank.bankName || "-"}
              </p>

              <p>
                A/c No.: {bank.accountNumber || "-"}
              </p>

              <p>
                IFS Code: {bank.ifscCode || "-"}
              </p>

            </div>

            <div className="signature-box">

              <p>
                for {bill.vendorName || COMPANY.name}
              </p>

              <div className="signature-space"></div>

              <p>
                Authorised Signatory
              </p>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <p className="computer-generated">
          This is a Computer Generated Invoice
        </p>

      </div>
    </div>
  );
}

export default InvoicePrint;
