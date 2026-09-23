import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CreatePurchaseOrder.css";


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

// Calls the API and returns the parsed JSON.
// Throws the backend's own message when the call fails.
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

// Finds the list inside a response, whether it is
// [..], { data: [..] } or { data: { products: [..] } }
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

let rowCounter = 0;

const newRow = () => ({
  rowId: ++rowCounter,
  itemModel: "Product",
  product: "",
  quantity: 1,
  price: "",
  gstRate: "",
  hsnCode: "",
});


function CreatePurchaseOrder() {

  const navigate = useNavigate();


  // ====================================================
  // STATE
  // ====================================================

  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [repairParts, setRepairParts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [loadWarning, setLoadWarning] = useState("");

  const [vendor, setVendor] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [rows, setRows] = useState([newRow()]);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");


  // ====================================================
  // LOAD VENDORS + PRODUCTS + REPAIR PARTS
  // ====================================================

  useEffect(() => {

    const loadData = async () => {

      const [vendorResult, productResult, partResult] =
        await Promise.allSettled([
          fetchJson("/api/procurement/vendors"),
          fetchJson("/api/products"),
          fetchJson("/api/repairInventory"),
        ]);

      if (vendorResult.status === "fulfilled") {

        // only active vendors can receive a purchase order
        setVendors(
          toList(vendorResult.value).filter(
            (item) => item.isActive !== false
          )
        );

      } else {

        setLoadError(
          vendorResult.reason?.message ||
            "Could not load vendors"
        );
      }

      const warnings = [];

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
        setLoadWarning(
          `Could not load ${warnings.join(" and ")}. ` +
            "Those items will not appear in the dropdown."
        );
      }

      setLoading(false);
    };

    loadData();

  }, []);


  // ====================================================
  // ROW HANDLERS
  // ====================================================

  const optionsFor = (itemModel) =>
    itemModel === "RepairPart" ? repairParts : products;

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
      price: "",
      gstRate: "",
      hsnCode: "",
    });
  };

  const handleItemChange = (rowId, itemModel, productId) => {

    const changes = { product: productId };

    // fill the price / GST / HSN from the item's own record when it has them
    const found = optionsFor(itemModel).find(
      (item) => item._id === productId
    );

    if (found) {

      if (found.purchaseCost !== undefined) {
        changes.price = found.purchaseCost;
      }

      if (found.gstRate !== undefined) {
        changes.gstRate = found.gstRate;
      }

      if (found.hsnCode !== undefined) {
        changes.hsnCode = found.hsnCode;
      }
    }

    updateRow(rowId, changes);
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

  // "Product:123" keys already picked in other rows,
  // so the same item cannot be added twice
  const pickedKeys = (exceptRowId) =>
    new Set(
      rows
        .filter((row) => row.rowId !== exceptRowId && row.product)
        .map((row) => `${row.itemModel}:${row.product}`)
    );


  // ====================================================
  // TOTALS
  // ====================================================

  const { subtotal, gstAmount, grandTotal } = useMemo(() => {

    let sub = 0;
    let gst = 0;

    rows.forEach((row) => {
      const lineSubtotal = Number(row.quantity || 0) * Number(row.price || 0);
      const lineGst = lineSubtotal * (Number(row.gstRate || 0) / 100);

      sub += lineSubtotal;
      gst += lineGst;
    });

    return {
      subtotal: sub,
      gstAmount: gst,
      grandTotal: sub + gst,
    };

  }, [rows]);


  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();
    setFormError("");

    if (!vendor) {
      setFormError("Select a vendor");
      return;
    }

    if (!expectedDeliveryDate) {
      setFormError("Choose the expected delivery date");
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

      const price = Number(row.price);

      if (row.price === "" || !Number.isFinite(price) || price < 0) {
        setFormError(`${line}: enter a price of 0 or more`);
        return;
      }

      if (row.gstRate !== "") {

        const gstRate = Number(row.gstRate);

        if (!Number.isFinite(gstRate) || gstRate < 0) {
          setFormError(`${line}: enter a GST rate of 0 or more`);
          return;
        }
      }
    }

    try {

      setSubmitting(true);

      await fetchJson("/api/procurement/purchase-orders", {
        method: "POST",
        body: JSON.stringify({
          vendor,
          expectedDeliveryDate,
          notes: notes.trim(),
          items: rows.map((row) => ({
            itemModel: row.itemModel,
            product: row.product,
            quantity: Number(row.quantity),
            price: Number(row.price),
            gstRate: row.gstRate === "" ? 0 : Number(row.gstRate),
            hsnCode: row.hsnCode.trim(),
          })),
        }),
      });

      navigate("/purchase-orders");

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
      <div className="po-create-page">
        <p className="po-state">Loading...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="po-create-page">
        <p className="po-state po-state-error">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="po-create-page">

      <div className="po-header">
        <h1>Create purchase order</h1>
        <p>
          The order is saved as a draft. Mark it as ordered after you
          send it to the vendor.
        </p>
      </div>

      {loadWarning && (
        <div className="po-alert po-alert-warning">{loadWarning}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>

        {/* ---------------- ORDER DETAILS ---------------- */}

        <section className="po-card">

          <h2 className="po-card-title">Order details</h2>

          <div className="po-fields">

            <label className="po-field">
              <span>Vendor</span>
              <select
                value={vendor}
                onChange={(event) => setVendor(event.target.value)}
              >
                <option value="">Select a vendor</option>
                {vendors.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.vendorName}
                  </option>
                ))}
              </select>
            </label>

            <label className="po-field">
              <span>Expected delivery date</span>
              <input
                type="date"
                min={todayString()}
                value={expectedDeliveryDate}
                onChange={(event) =>
                  setExpectedDeliveryDate(event.target.value)
                }
              />
            </label>

          </div>

          <label className="po-field">
            <span>Notes (optional)</span>
            <textarea
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Anything the vendor or your team should know"
            />
          </label>

        </section>


        {/* ---------------- ITEMS ---------------- */}

        <section className="po-card">

          <h2 className="po-card-title">Items</h2>

          <div className="po-rows">

            <div className="po-row po-row-head">
              <span>Type</span>
              <span>Item</span>
              <span>HSN</span>
              <span>Quantity</span>
              <span>Price (each)</span>
              <span>GST %</span>
              <span>Line total</span>
              <span />
            </div>

            {rows.map((row) => {

              const taken = pickedKeys(row.rowId);

              return (
                <div className="po-row" key={row.rowId}>

                  <select
                    aria-label="Item type"
                    value={row.itemModel}
                    onChange={(event) =>
                      handleTypeChange(row.rowId, event.target.value)
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
                    type="text"
                    aria-label="HSN code"
                    placeholder="HSN"
                    value={row.hsnCode}
                    onChange={(event) =>
                      updateRow(row.rowId, {
                        hsnCode: event.target.value,
                      })
                    }
                  />

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

                  <input
                    type="number"
                    aria-label="Price"
                    min="0"
                    step="0.01"
                    value={row.price}
                    onChange={(event) =>
                      updateRow(row.rowId, {
                        price: event.target.value,
                      })
                    }
                  />

                  <input
                    type="number"
                    aria-label="GST rate"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    value={row.gstRate}
                    onChange={(event) =>
                      updateRow(row.rowId, {
                        gstRate: event.target.value,
                      })
                    }
                  />

                  <span className="po-line-total">
                    {formatMoney(
                      Number(row.quantity || 0) *
                        Number(row.price || 0)
                    )}
                  </span>

                  <button
                    type="button"
                    className="po-remove"
                    onClick={() => removeRow(row.rowId)}
                    disabled={rows.length === 1}
                    aria-label="Remove item"
                  >
                    Remove
                  </button>

                </div>
              );
            })}

          </div>

          <button
            type="button"
            className="po-add-row"
            onClick={addRow}
          >
            + Add item
          </button>

          <div className="po-total-breakdown">
            <div className="po-total-row">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="po-total-row">
              <span>GST</span>
              <span>{formatMoney(gstAmount)}</span>
            </div>
            <div className="po-total-row po-total-row-grand">
              <span>Total</span>
              <strong>{formatMoney(grandTotal)}</strong>
            </div>
          </div>

        </section>


        {formError && (
          <div className="po-alert po-alert-error" role="alert">
            {formError}
          </div>
        )}

        <div className="po-actions">
          <button
            type="button"
            className="po-btn po-btn-secondary"
            onClick={() => navigate("/purchase-orders")}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="po-btn po-btn-primary"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save as draft"}
          </button>
        </div>

      </form>

    </div>
  );
}


export default CreatePurchaseOrder;