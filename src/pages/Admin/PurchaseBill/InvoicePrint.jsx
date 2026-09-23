import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { COMPANY } from "./companyDetails.js";
import { amountInWords } from "./amountInWords.js";

import "./InvoicePrint.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// ==========================================================
// DATE FORMAT: dd-Mon-yy  (e.g. 17-Aug-26)
// ==========================================================

function formatInvoiceDate(dateString) {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-IN", { month: "short" });
  const year = String(date.getFullYear()).slice(-2);

  return `${day}-${month}-${year}`;
}

// ==========================================================
// NUMBER FORMAT: 2 decimals, Indian grouping
// ==========================================================

function formatAmount(value) {
  const number = Number(value) || 0;

  return number.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

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
    const loadBill = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/api/purchase/${purchaseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load bill");
        }

        setBill(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBill();
  }, [purchaseId]);

  // ========================================================
  // LOADING / ERROR STATES
  // ========================================================

  if (loading) {
    return (
      <div className="invoice-print-page">
        <div className="invoice-toolbar">
          <button onClick={() => navigate(-1)}>← Back to bill</button>
        </div>
        <p className="invoice-state">Loading invoice...</p>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="invoice-print-page">
        <div className="invoice-toolbar">
          <button onClick={() => navigate(-1)}>← Back to bill</button>
        </div>
        <p className="invoice-state error">{error || "Bill not found"}</p>
      </div>
    );
  }

  // ========================================================
  // COMPUTE ITEM ROWS
  // ========================================================

  const items = bill.items || [];

  const rows = items.map((item) => {
    const quantity = Number(item.quantity) || 0;
    const rateExcl = Number(item.purchasePrice) || 0;
    const gstRate = Number(item.gst) || 0;

    const rateIncl = rateExcl * (1 + gstRate / 100);
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

  const vendorStateNormalized = (bill.vendorState || "")
    .trim()
    .toLowerCase();

  const companyStateNormalized = COMPANY.state.trim().toLowerCase();

  const isSameState =
    !vendorStateNormalized ||
    vendorStateNormalized === companyStateNormalized;

  // ========================================================
  // TOTALS
  // ========================================================

  const taxableSubtotal = rows.reduce((sum, row) => sum + row.amount, 0);

  const totalQuantity = rows.reduce((sum, row) => sum + row.quantity, 0);

  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;

  rows.forEach((row) => {
    const taxOnRow = (row.amount * row.gstRate) / 100;

    if (isSameState) {
      totalCgst += taxOnRow / 2;
      totalSgst += taxOnRow / 2;
    } else {
      totalIgst += taxOnRow;
    }
  });

  const totalTax = totalCgst + totalSgst + totalIgst;
  const totalBeforeRound = taxableSubtotal + totalTax;
  const roundedTotal = Math.round(totalBeforeRound);
  const roundOff = roundedTotal - totalBeforeRound;

  // ========================================================
  // HSN/SAC TAX SUMMARY
  // ========================================================

  const hsnSummaryMap = new Map();

  rows.forEach((row) => {
    const key = `${row.hsnCode}__${row.gstRate}`;
    const taxOnRow = (row.amount * row.gstRate) / 100;

    const cgstOnRow = isSameState ? taxOnRow / 2 : 0;
    const sgstOnRow = isSameState ? taxOnRow / 2 : 0;
    const igstOnRow = isSameState ? 0 : taxOnRow;

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

  const hsnSummaryRows = Array.from(hsnSummaryMap.values());

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <div className="invoice-print-page">
      {/* TOOLBAR */}
      <div className="invoice-toolbar">
        <button onClick={() => navigate(-1)}>← Back to bill</button>
        <button className="print-btn" onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>

      {/* INVOICE SHEET */}
      <div className="invoice-sheet">
        <h1 className="invoice-title">INVOICE</h1>

        {/* SELLER / BUYER / INVOICE META */}
        <div className="invoice-meta-grid">
          <div className="invoice-meta-left">
            <div className="party-box">
              <strong>{bill.vendorName || "-"}</strong>
              {bill.vendorAddress && <p>{bill.vendorAddress}</p>}
              <p>GSTIN/UIN: {bill.vendorGstNumber || "-"}</p>
              <p>State Name: {bill.vendorState || "-"}</p>
              {bill.vendorEmail && <p>E-Mail: {bill.vendorEmail}</p>}
              {bill.vendorPhone && <p>Phone: {bill.vendorPhone}</p>}
            </div>

            <div className="party-box">
              <p className="buyer-label">Buyer (Bill to)</p>
              <strong>{COMPANY.name}</strong>
              {COMPANY.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <p>GSTIN/UIN: {COMPANY.gstin}</p>
              <p>
                State Name: {COMPANY.state}, Code: {COMPANY.stateCode}
              </p>
            </div>
          </div>

          <div className="invoice-meta-right">
            <table className="meta-table">
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
                      bill.invoiceDate || bill.date || bill.createdAt
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
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="center">{index + 1}</td>
                <td>{row.description}</td>
                <td className="center">{row.hsnCode}</td>
                <td className="center">
                  {row.quantity} {row.unit}
                </td>
                <td className="right">{formatAmount(row.rateIncl)}</td>
                <td className="right">{formatAmount(row.rateExcl)}</td>
                <td className="center">{row.unit}</td>
                <td className="right">{formatAmount(row.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TAX + TOTAL SUMMARY */}
        <table className="totals-table">
          <tbody>
            <tr>
              <td className="right label-cell">Taxable Subtotal</td>
              <td className="right">{formatAmount(taxableSubtotal)}</td>
            </tr>

            {isSameState ? (
              <>
                <tr>
                  <td className="right label-cell">CGST</td>
                  <td className="right">{formatAmount(totalCgst)}</td>
                </tr>
                <tr>
                  <td className="right label-cell">SGST</td>
                  <td className="right">{formatAmount(totalSgst)}</td>
                </tr>
              </>
            ) : (
              <tr>
                <td className="right label-cell">IGST</td>
                <td className="right">{formatAmount(totalIgst)}</td>
              </tr>
            )}

            <tr>
              <td className="right label-cell">ROUND OFF</td>
              <td className="right">
                {roundOff >= 0 ? "" : "-"}
                {formatAmount(Math.abs(roundOff))}
              </td>
            </tr>

            <tr className="total-row">
              <td className="right label-cell">
                Total ({totalQuantity} qty)
              </td>
              <td className="right">₹ {formatAmount(roundedTotal)}</td>
            </tr>
          </tbody>
        </table>

        <p className="amount-words">
          <strong>Amount Chargeable (in words)</strong>
          <span className="eoe">E. &amp; O.E</span>
          <br />
          {amountInWords(roundedTotal)}
        </p>

        {/* HSN/SAC TAX SUMMARY */}
        <table className="hsn-summary-table">
          <thead>
            <tr>
              <th rowSpan={2}>HSN/SAC</th>
              <th rowSpan={2}>Taxable Value</th>
              {isSameState ? (
                <>
                  <th colSpan={2}>CGST</th>
                  <th colSpan={2}>SGST/UTGST</th>
                </>
              ) : (
                <th colSpan={2}>IGST</th>
              )}
              <th rowSpan={2}>Total Tax Amount</th>
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
                <td className="center">{entry.hsnCode}</td>
                <td className="right">{formatAmount(entry.taxableValue)}</td>

                {isSameState ? (
                  <>
                    <td className="center">
                      {(entry.gstRate / 2).toFixed(0)}%
                    </td>
                    <td className="right">{formatAmount(entry.cgst)}</td>
                    <td className="center">
                      {(entry.gstRate / 2).toFixed(0)}%
                    </td>
                    <td className="right">{formatAmount(entry.sgst)}</td>
                  </>
                ) : (
                  <>
                    <td className="center">{entry.gstRate}%</td>
                    <td className="right">{formatAmount(entry.igst)}</td>
                  </>
                )}

                <td className="right">
                  {formatAmount(entry.cgst + entry.sgst + entry.igst)}
                </td>
              </tr>
            ))}

            <tr className="total-row">
              <td className="center">Total</td>
              <td className="right">{formatAmount(taxableSubtotal)}</td>

              {isSameState ? (
                <>
                  <td></td>
                  <td className="right">{formatAmount(totalCgst)}</td>
                  <td></td>
                  <td className="right">{formatAmount(totalSgst)}</td>
                </>
              ) : (
                <>
                  <td></td>
                  <td className="right">{formatAmount(totalIgst)}</td>
                </>
              )}

              <td className="right">{formatAmount(totalTax)}</td>
            </tr>
          </tbody>
        </table>

        <p className="tax-words">
          Tax Amount (in words): {amountInWords(totalTax)}
        </p>

        {/* DECLARATION / SIGNATURE */}
        <div className="declaration-signature-grid">
          <div className="declaration-box">
            <p className="section-heading">Declaration</p>
            <p>
              We declare that this invoice shows the actual price of the
              goods described and that all particulars are true and correct.
            </p>
          </div>

          <div className="signature-box">
            <p>for {bill.vendorName || COMPANY.name}</p>
            <div className="signature-space"></div>
            <p>Authorised Signatory</p>
          </div>
        </div>

        <p className="computer-generated">
          This is a Computer Generated Invoice
        </p>
      </div>
    </div>
  );
}

export default InvoicePrint;