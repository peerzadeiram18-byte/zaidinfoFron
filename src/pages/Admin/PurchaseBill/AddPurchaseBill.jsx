import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Addpurchasebill.css";


// ======================================================
// API BASE (same pattern as VendorList.jsx)
// ======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});


// ======================================================
// HELPERS
// ======================================================

// Returns the parsed JSON, or throws the backend's own message
const fetchJson = async (path, options = {}) => {

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: authHeaders(),
    ...options,
  });

  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Request failed");
  }

  return result;
};

// Finds the list inside a response, whatever its shape
const toList = (result) => {

  if (Array.isArray(result)) return result;

  if (Array.isArray(result?.data)) return result.data;

  const nested =
    result?.data && typeof result.data === "object"
      ? result.data
      : result;

  for (const value of Object.values(nested || {})) {
    if (Array.isArray(value)) return value;
  }

  return [];
};

const itemLabel = (item, itemModel) => {

  const name =
    itemModel === "RepairPart"
      ? item.partName || item.name
      : item.name;

  const sku = item.sku || item.partSku;

  return sku ? `${name} (${sku})` : name;
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

const todayString = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};

// Joins the vendor's address, city and pincode into one line
const buildAddress = (vendor) =>
  [vendor?.address, vendor?.city, vendor?.pincode]
    .filter(Boolean)
    .join(", ");

let rowCounter = 0;

const newRow = () => ({
  rowId: ++rowCounter,
  itemModel: "Product",
  product: "",
  label: "",
  quantity: 1,
  purchasePrice: "",
  gst: "",
  hsnCode: "",
});

// Price and GST to prefill when an item is picked
const defaultsFor = (item, itemModel) =>
  itemModel === "RepairPart"
    ? { purchasePrice: item.purchaseCost ?? "", gst: 0 }
    : {
        purchasePrice: item.pricing?.purchasePrice ?? "",
        gst: item.pricing?.gst ?? "",
      };

const lineBase = (row) =>
  Number(row.quantity || 0) * Number(row.purchasePrice || 0);

const lineGst = (row) =>
  (lineBase(row) * Number(row.gst || 0)) / 100;


function AddPurchaseBill() {

  const navigate = useNavigate();


  // ====================================================
  // STATE
  // ====================================================

  const [vendors, setVendors] = useState([]);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [repairParts, setRepairParts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadWarning, setLoadWarning] = useState("");

  // "po" = bill for a received purchase order, "manual" = no PO
  const [mode, setMode] = useState("po");
  const [selectedPo, setSelectedPo] = useState("");

  const [vendorName, setVendorName] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorGstNumber, setVendorGstNumber] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [vendorState, setVendorState] = useState("");
  const [vendorInvoiceNumber, setVendorInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(todayString());
  const [notes, setNotes] = useState("");

  const [rows, setRows] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");


  // ====================================================
  // LOAD DROPDOWN DATA
  // ====================================================

  useEffect(() => {

    const loadData = async () => {

      const [vendorResult, poResult, productResult, partResult] =
        await Promise.allSettled([
          fetchJson("/api/procurement/vendors"),
          fetchJson("/api/procurement/purchase-orders/available-for-billing"),
          fetchJson("/api/products"),
          fetchJson("/api/repairInventory"),
        ]);

      const warnings = [];

      if (vendorResult.status === "fulfilled") {
        setVendors(toList(vendorResult.value));
      } else {
        warnings.push("vendors");
      }

      if (poResult.status === "fulfilled") {
        setAvailableOrders(toList(poResult.value));
      } else {
        warnings.push("received purchase orders");
      }

      if (productResult.status === "fulfilled") {
        setProducts(toList(productResult.value));
      } else {
        warnings.push("products");
      }

      if (partResult.status === "fulfilled") {
        setRepairParts(toList(partResult.value));
      } else {
        warnings.push("repair parts");
      }

      if (warnings.length > 0) {
        setLoadWarning(`Could not load ${warnings.join(", ")}.`);
      }

      setLoading(false);
    };

    loadData();

  }, []);


  // ====================================================
  // MODE + PURCHASE ORDER
  // ====================================================

  const optionsFor = (itemModel) =>
    itemModel === "RepairPart" ? repairParts : products;

  const clearVendorFields = () => {
    setVendorName("");
    setVendorPhone("");
    setVendorEmail("");
    setVendorGstNumber("");
    setVendorAddress("");
    setVendorState("");
  };

  const handleModeChange = (nextMode) => {

    if (nextMode === mode) return;

    setMode(nextMode);
    setSelectedPo("");
    setFormError("");
    clearVendorFields();
    setRows(nextMode === "manual" ? [newRow()] : []);
  };

  // Choosing a PO fills the vendor and the received items
  const handlePoChange = (poId) => {

    setSelectedPo(poId);
    setFormError("");

    const order = availableOrders.find((item) => item._id === poId);

    if (!order) {
      clearVendorFields();
      setRows([]);
      return;
    }

    setVendorName(order.vendor?.vendorName || "");
    setVendorPhone(order.vendor?.phone || "");
    setVendorEmail(order.vendor?.email || "");
    setVendorGstNumber(order.vendor?.gstNumber || "");
    setVendorAddress(buildAddress(order.vendor));
    setVendorState(order.vendor?.state || "");

    // bill only what was actually received
    const billRows = order.items
      .filter((item) => Number(item.receivedQuantity) > 0)
      .map((item) => {

        const itemModel = item.itemModel || "Product";

        const doc =
          item.product && typeof item.product === "object"
            ? item.product
            : null;

        const productId =
          doc?._id ||
          (typeof item.product === "string" ? item.product : "");

        const found = optionsFor(itemModel).find(
          (option) => option._id === productId
        );

        return {
          rowId: ++rowCounter,
          itemModel,
          product: productId,
          label: doc ? itemLabel(doc, itemModel) : "Item",
          quantity: item.receivedQuantity,
          purchasePrice: item.price,
          // CHANGED: the PO's own gstRate/hsnCode (entered when the PO
          // was created) are now the primary source for a bill made
          // from that PO. Falls back to the product's saved GST rate
          // when the PO item has no gstRate (e.g. an older PO created
          // before GST fields existed on purchase orders).
          gst:
            item.gstRate !== undefined && item.gstRate !== null
              ? item.gstRate
              : itemModel === "RepairPart"
              ? 0
              : found?.pricing?.gst ?? "",
          hsnCode: item.hsnCode || "",
        };
      });

    setRows(billRows);
  };

  // Manual mode: fill vendor fields from the vendor list
  const handleVendorPick = (vendorId) => {

    const found = vendors.find((item) => item._id === vendorId);

    if (!found) return;

    setVendorName(found.vendorName || "");
    setVendorPhone(found.phone || "");
    setVendorEmail(found.email || "");
    setVendorGstNumber(found.gstNumber || "");
    setVendorAddress(buildAddress(found));
    setVendorState(found.state || "");
  };


  // ====================================================
  // ROW HANDLERS
  // ====================================================

  const updateRow = (rowId, changes) => {
    setRows((previous) =>
      previous.map((row) =>
        row.rowId === rowId ? { ...row, ...changes } : row
      )
    );
  };

  const handleTypeChange = (rowId, itemModel) => {
    updateRow(rowId, {
      itemModel,
      product: "",
      purchasePrice: "",
      gst: "",
      hsnCode: "",
    });
  };

  const handleItemChange = (rowId, itemModel, productId) => {

    const found = optionsFor(itemModel).find(
      (item) => item._id === productId
    );

    updateRow(rowId, {
      product: productId,
      ...(found ? defaultsFor(found, itemModel) : {}),
    });
  };

  const addRow = () => {
    setRows((previous) => [...previous, newRow()]);
  };

  const removeRow = (rowId) => {
    setRows((previous) =>
      previous.length === 1
        ? previous
        : previous.filter((row) => row.rowId !== rowId)
    );
  };

  // items already picked in other rows cannot be picked again
  const pickedKeys = (exceptRowId) =>
    new Set(
      rows
        .filter((row) => row.rowId !== exceptRowId && row.product)
        .map((row) => `${row.itemModel}:${row.product}`)
    );


  // ====================================================
  // TOTALS
  // ====================================================

  const totals = useMemo(() => {

    const subtotal = rows.reduce((sum, row) => sum + lineBase(row), 0);
    const gstAmount = rows.reduce((sum, row) => sum + lineGst(row), 0);

    return {
      subtotal,
      gstAmount,
      total: subtotal + gstAmount,
    };

  }, [rows]);


  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();
    setFormError("");

    if (mode === "po" && !selectedPo) {
      setFormError("Select the purchase order this bill is for");
      return;
    }

    if (!vendorName.trim()) {
      setFormError("Vendor name is required");
      return;
    }

    if (rows.length === 0) {
      setFormError("Add at least one item");
      return;
    }

    for (const [index, row] of rows.entries()) {

      const line = `Item ${index + 1}`;

      if (!row.product) {
        setFormError(`${line}: select an item`);
        return;
      }

      const quantity = Number(row.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        setFormError(`${line}: quantity must be a whole number, 1 or more`);
        return;
      }

      const price = Number(row.purchasePrice);

      if (
        row.purchasePrice === "" ||
        !Number.isFinite(price) ||
        price < 0
      ) {
        setFormError(`${line}: enter a price of 0 or more`);
        return;
      }

      if (
        row.gst !== "" &&
        (!Number.isFinite(Number(row.gst)) || Number(row.gst) < 0)
      ) {
        setFormError(`${line}: GST must be 0 or more`);
        return;
      }
    }

    try {

      setSubmitting(true);

      await fetchJson("/api/purchase", {
        method: "POST",
        body: JSON.stringify({
          vendorName: vendorName.trim(),
          vendorPhone: vendorPhone.trim(),
          vendorEmail: vendorEmail.trim(),
          vendorGstNumber: vendorGstNumber.trim(),
          vendorAddress: vendorAddress.trim(),
          vendorState: vendorState.trim(),
          vendorInvoiceNumber: vendorInvoiceNumber.trim(),
          invoiceDate,
          notes: notes.trim(),
          purchaseOrder: mode === "po" ? selectedPo : undefined,
          items: rows.map((row) => ({
            itemModel: row.itemModel,
            product: row.product,
            quantity: Number(row.quantity),
            hsnCode: row.hsnCode.trim(),
            purchasePrice: Number(row.purchasePrice),
            // a blank GST lets the backend use the item's saved GST rate
            ...(row.gst !== "" && { gst: Number(row.gst) }),
          })),
        }),
      });

      navigate("/purchase-bills");

    } catch (error) {

      setFormError(error.message);

    } finally {

      setSubmitting(false);
    }
  };


  // ====================================================
  // RENDER
  // ====================================================

  if (loading) {
    return (
      <div className="apb-page">
        <p className="apb-state">Loading...</p>
      </div>
    );
  }

  return (
    <div className="apb-page">

      <div className="apb-header">
        <h1>Add purchase bill</h1>
        <p>
          Record the invoice you received from a vendor. It must be
          verified before a payment can be recorded.
        </p>
      </div>

      {loadWarning && (
        <div className="apb-alert apb-alert-warning">{loadWarning}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>

        {/* ---------------- BILL SOURCE ---------------- */}

        <section className="apb-card">

          <h2 className="apb-card-title">Bill for</h2>

          <div className="apb-modes" role="group" aria-label="Bill source">
            <button
              type="button"
              className={`apb-mode ${mode === "po" ? "active" : ""}`}
              aria-pressed={mode === "po"}
              onClick={() => handleModeChange("po")}
            >
              A received purchase order
            </button>
            <button
              type="button"
              className={`apb-mode ${mode === "manual" ? "active" : ""}`}
              aria-pressed={mode === "manual"}
              onClick={() => handleModeChange("manual")}
            >
              Manual bill (no purchase order)
            </button>
          </div>

          {mode === "po" && (
            availableOrders.length === 0 ? (
              <p className="apb-hint">
                No received purchase orders are waiting for a bill. An
                order appears here once it is marked as received and
                has no bill yet.
              </p>
            ) : (
              <label className="apb-field">
                <span>Purchase order</span>
                <select
                  value={selectedPo}
                  onChange={(event) => handlePoChange(event.target.value)}
                >
                  <option value="">Select a purchase order</option>
                  {availableOrders.map((order) => (
                    <option key={order._id} value={order._id}>
                      {order.poNumber} — {order.vendor?.vendorName} —{" "}
                      {formatMoney(order.totalAmount)}
                    </option>
                  ))}
                </select>
              </label>
            )
          )}

          {mode === "manual" && (
            <label className="apb-field">
              <span>Fill vendor details from your vendor list (optional)</span>
              <select
                value=""
                onChange={(event) => handleVendorPick(event.target.value)}
              >
                <option value="">Select a vendor</option>
                {vendors.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.vendorName}
                  </option>
                ))}
              </select>
            </label>
          )}

        </section>


        {/* ---------------- VENDOR + INVOICE ---------------- */}

        <section className="apb-card">

          <h2 className="apb-card-title">Vendor and invoice</h2>

          <div className="apb-fields">

            <label className="apb-field">
              <span>Vendor name</span>
              <input
                type="text"
                value={vendorName}
                onChange={(event) => setVendorName(event.target.value)}
              />
            </label>

            <label className="apb-field">
              <span>Vendor phone</span>
              <input
                type="text"
                value={vendorPhone}
                onChange={(event) => setVendorPhone(event.target.value)}
              />
            </label>

            <label className="apb-field">
              <span>Vendor email</span>
              <input
                type="email"
                value={vendorEmail}
                onChange={(event) => setVendorEmail(event.target.value)}
              />
            </label>

            <label className="apb-field">
              <span>Vendor invoice number</span>
              <input
                type="text"
                value={vendorInvoiceNumber}
                onChange={(event) =>
                  setVendorInvoiceNumber(event.target.value)
                }
              />
            </label>

            <label className="apb-field">
              <span>Vendor GSTIN</span>
              <input
                type="text"
                value={vendorGstNumber}
                onChange={(event) => setVendorGstNumber(event.target.value)}
              />
            </label>

            <label className="apb-field">
              <span>Vendor state</span>
              <input
                type="text"
                value={vendorState}
                onChange={(event) => setVendorState(event.target.value)}
              />
            </label>

            <label className="apb-field">
              <span>Vendor address</span>
              <input
                type="text"
                value={vendorAddress}
                onChange={(event) => setVendorAddress(event.target.value)}
              />
            </label>

            <label className="apb-field">
              <span>Invoice date</span>
              <input
                type="date"
                value={invoiceDate}
                onChange={(event) => setInvoiceDate(event.target.value)}
              />
            </label>

          </div>

        </section>


        {/* ---------------- ITEMS ---------------- */}

        <section className="apb-card">

          <h2 className="apb-card-title">Items</h2>

          {mode === "po" && rows.length === 0 ? (

            <p className="apb-hint">
              Select a purchase order to load the items that were
              received.
            </p>

          ) : (

            <>
              {mode === "po" && (
                <p className="apb-hint">
                  Quantities are what was received. GST and HSN are
                  filled in from the purchase order — adjust them here
                  if the vendor's actual invoice is different.
                </p>
              )}

              <div className="apb-rows">

                <div className="apb-row apb-row-head">
                  <span>Type</span>
                  <span>Item</span>
                  <span>Quantity</span>
                  <span>HSN</span>
                  <span>Price (each)</span>
                  <span>GST %</span>
                  <span>Line total</span>
                  <span />
                </div>

                {rows.map((row) => {

                  const taken = pickedKeys(row.rowId);

                  return (
                    <div className="apb-row" key={row.rowId}>

                      {mode === "po" ? (
                        <>
                          <span className="apb-text">
                            {row.itemModel === "RepairPart"
                              ? "Repair part"
                              : "Product"}
                          </span>
                          <span className="apb-text">{row.label}</span>
                          <span className="apb-text">{row.quantity}</span>
                        </>
                      ) : (
                        <>
                          <select
                            aria-label="Item type"
                            value={row.itemModel}
                            onChange={(event) =>
                              handleTypeChange(
                                row.rowId,
                                event.target.value
                              )
                            }
                          >
                            <option value="Product">Product</option>
                            <option value="RepairPart">Repair part</option>
                          </select>

                          <select
                            aria-label="Item"
                            value={row.product}
                            onChange={(event) =>
                              handleItemChange(
                                row.rowId,
                                row.itemModel,
                                event.target.value
                              )
                            }
                          >
                            <option value="">Select an item</option>
                            {optionsFor(row.itemModel).map((item) => (
                              <option
                                key={item._id}
                                value={item._id}
                                disabled={taken.has(
                                  `${row.itemModel}:${item._id}`
                                )}
                              >
                                {itemLabel(item, row.itemModel)}
                              </option>
                            ))}
                          </select>

                          <input
                            type="number"
                            aria-label="Quantity"
                            min="1"
                            step="1"
                            value={row.quantity}
                            onChange={(event) =>
                              updateRow(row.rowId, {
                                quantity: event.target.value,
                              })
                            }
                          />
                        </>
                      )}

                      <input
                        type="text"
                        aria-label="HSN code"
                        value={row.hsnCode}
                        placeholder="HSN"
                        onChange={(event) =>
                          updateRow(row.rowId, {
                            hsnCode: event.target.value,
                          })
                        }
                      />

                      <input
                        type="number"
                        aria-label="Price"
                        min="0"
                        step="0.01"
                        value={row.purchasePrice}
                        onChange={(event) =>
                          updateRow(row.rowId, {
                            purchasePrice: event.target.value,
                          })
                        }
                      />

                      <input
                        type="number"
                        aria-label="GST percent"
                        min="0"
                        step="0.01"
                        value={row.gst}
                        placeholder="Saved"
                        onChange={(event) =>
                          updateRow(row.rowId, {
                            gst: event.target.value,
                          })
                        }
                      />

                      <span className="apb-line-total">
                        {formatMoney(lineBase(row) + lineGst(row))}
                      </span>

                      {mode === "manual" ? (
                        <button
                          type="button"
                          className="apb-remove"
                          onClick={() => removeRow(row.rowId)}
                          disabled={rows.length === 1}
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      ) : (
                        <span />
                      )}

                    </div>
                  );
                })}

              </div>

              {mode === "manual" && (
                <button
                  type="button"
                  className="apb-add-row"
                  onClick={addRow}
                >
                  + Add item
                </button>
              )}

              <p className="apb-hint">
                A blank GST box uses the item's saved GST rate when the bill
                is saved. The totals below count a blank box as 0%.
              </p>

              <dl className="apb-totals">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatMoney(totals.subtotal)}</dd>
                </div>
                <div>
                  <dt>GST</dt>
                  <dd>{formatMoney(totals.gstAmount)}</dd>
                </div>
                <div className="apb-totals-grand">
                  <dt>Total</dt>
                  <dd>{formatMoney(totals.total)}</dd>
                </div>
              </dl>
            </>
          )}

        </section>


        {/* ---------------- NOTES ---------------- */}

        <section className="apb-card">

          <label className="apb-field">
            <span>Notes (optional)</span>
            <textarea
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>

        </section>


        {formError && (
          <div className="apb-alert apb-alert-error" role="alert">
            {formError}
          </div>
        )}

        <div className="apb-actions">
          <button
            type="button"
            className="apb-btn apb-btn-secondary"
            onClick={() => navigate("/purchase-bills")}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="apb-btn apb-btn-primary"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save bill"}
          </button>
        </div>

      </form>

    </div>
  );
}


export default AddPurchaseBill;