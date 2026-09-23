
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./PurchaseOrderEdit.css";

// ======================================================
// API BASE
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

const toList = (result) => {
  if (Array.isArray(result)) return result;

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  const nested =
    result?.data && typeof result.data === "object"
      ? result.data
      : result;

  for (const value of Object.values(nested || {})) {
    if (Array.isArray(value)) {
      return value;
    }
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

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${now.getFullYear()}-${month}-${day}`;
};

const formatDateForInput = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

let rowCounter = 0;

const createRowId = () => {
  rowCounter += 1;
  return rowCounter;
};

// ======================================================
// COMPONENT
// ======================================================

function PurchaseOrderEdit() {
  const { purchaseOrderId } = useParams();
  const navigate = useNavigate();

  // ====================================================
  // STATE
  // ====================================================

  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [repairParts, setRepairParts] = useState([]);

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [loadWarning, setLoadWarning] = useState("");

  const [vendor, setVendor] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] =
    useState("");

  const [notes, setNotes] = useState("");

  const [rows, setRows] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // ====================================================
  // LOAD PURCHASE ORDER + VENDORS + PRODUCTS + PARTS
  // ====================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setLoadError("");
        setLoadWarning("");

        const [
          purchaseOrderResult,
          vendorResult,
          productResult,
          partResult,
        ] = await Promise.allSettled([
          fetchJson(
            `/api/procurement/purchase-orders/${purchaseOrderId}`
          ),

          fetchJson(
            "/api/procurement/vendors"
          ),

          fetchJson(
            "/api/products"
          ),

          fetchJson(
            "/api/repairInventory"
          ),
        ]);

        // ------------------------------------------------
        // PURCHASE ORDER
        // ------------------------------------------------

        if (
          purchaseOrderResult.status !==
          "fulfilled"
        ) {
          throw new Error(
            purchaseOrderResult.reason?.message ||
              "Could not load purchase order"
          );
        }

        const purchaseOrder =
          purchaseOrderResult.value.data;

        if (!purchaseOrder) {
          throw new Error(
            "Purchase order not found"
          );
        }

        // ------------------------------------------------
        // ONLY DRAFT CAN BE EDITED
        // ------------------------------------------------

        if (
          purchaseOrder.status !==
          "DRAFT"
        ) {
          throw new Error(
            `Only a draft purchase order can be edited. Current status: ${purchaseOrder.status}`
          );
        }

        setOrder(purchaseOrder);

        // ------------------------------------------------
        // VENDOR
        // ------------------------------------------------

        setVendor(
          purchaseOrder.vendor?._id ||
            purchaseOrder.vendor ||
            ""
        );

        // ------------------------------------------------
        // DELIVERY DATE
        // ------------------------------------------------

        setExpectedDeliveryDate(
          formatDateForInput(
            purchaseOrder.expectedDeliveryDate
          )
        );

        // ------------------------------------------------
        // NOTES
        // ------------------------------------------------

        setNotes(
          purchaseOrder.notes || ""
        );

        // ------------------------------------------------
        // EXISTING ITEMS
        // ------------------------------------------------

        const existingRows =
          (purchaseOrder.items || []).map(
            (item) => ({
              rowId: createRowId(),

              itemModel:
                item.itemModel ||
                "Product",

              product:
                item.product?._id ||
                item.product ||
                "",

              quantity:
                item.quantity ?? 1,

              price:
                item.price ?? "",

              gstRate:
                item.gstRate ?? "",

              hsnCode:
                item.hsnCode || "",
            })
          );

        setRows(existingRows);

        // ------------------------------------------------
        // VENDORS
        // ------------------------------------------------

        if (
          vendorResult.status ===
          "fulfilled"
        ) {
          setVendors(
            toList(
              vendorResult.value
            ).filter(
              (item) =>
                item.isActive !== false
            )
          );
        } else {
          setLoadWarning(
            "Could not load vendors."
          );
        }

        // ------------------------------------------------
        // PRODUCTS
        // ------------------------------------------------

        if (
          productResult.status ===
          "fulfilled"
        ) {
          setProducts(
            toList(
              productResult.value
            )
          );
        } else {
          setLoadWarning(
            (previous) =>
              previous
                ? `${previous} Products will not appear in the dropdown.`
                : "Could not load products. Products will not appear in the dropdown."
          );
        }

        // ------------------------------------------------
        // REPAIR PARTS
        // ------------------------------------------------

        if (
          partResult.status ===
          "fulfilled"
        ) {
          setRepairParts(
            toList(
              partResult.value
            )
          );
        } else {
          setLoadWarning(
            (previous) =>
              previous
                ? `${previous} Repair parts will not appear in the dropdown.`
                : "Could not load repair parts. Repair parts will not appear in the dropdown."
          );
        }
      } catch (error) {
        setLoadError(
          error.message ||
            "Could not load purchase order."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [purchaseOrderId]);

  // ====================================================
  // ITEM OPTIONS
  // ====================================================

  const optionsFor = (itemModel) =>
    itemModel === "RepairPart"
      ? repairParts
      : products;

  // ====================================================
  // ROW HANDLERS
  // ====================================================

  const updateRow = (
    rowId,
    changes
  ) => {
    setRows((previous) =>
      previous.map((row) =>
        row.rowId === rowId
          ? {
              ...row,
              ...changes,
            }
          : row
      )
    );
  };

  const handleTypeChange = (
    rowId,
    itemModel
  ) => {
    updateRow(rowId, {
      itemModel,
      product: "",
      price: "",
      gstRate: "",
      hsnCode: "",
    });
  };

  const handleItemChange = (
    rowId,
    itemModel,
    productId
  ) => {
    const changes = {
      product: productId,
    };

    const found =
      optionsFor(itemModel).find(
        (item) =>
          item._id === productId
      );

    if (found) {
      if (
        found.purchaseCost !==
        undefined
      ) {
        changes.price =
          found.purchaseCost;
      }

      if (
        found.gstRate !==
        undefined
      ) {
        changes.gstRate =
          found.gstRate;
      }

      if (
        found.hsnCode !==
        undefined
      ) {
        changes.hsnCode =
          found.hsnCode;
      }
    }

    updateRow(
      rowId,
      changes
    );
  };

  const addRow = () => {
    setRows((previous) => [
      ...previous,
      {
        rowId: createRowId(),
        itemModel: "Product",
        product: "",
        quantity: 1,
        price: "",
        gstRate: "",
        hsnCode: "",
      },
    ]);
  };

  const removeRow = (
    rowId
  ) => {
    setRows((previous) =>
      previous.length === 1
        ? previous
        : previous.filter(
            (row) =>
              row.rowId !== rowId
          )
    );
  };

  // ====================================================
  // PREVENT DUPLICATE ITEMS
  // ====================================================

  const pickedKeys = (
    exceptRowId
  ) =>
    new Set(
      rows
        .filter(
          (row) =>
            row.rowId !==
              exceptRowId &&
            row.product
        )
        .map(
          (row) =>
            `${row.itemModel}:${row.product}`
        )
    );

  // ====================================================
  // TOTALS
  // ====================================================

  const {
    subtotal,
    gstAmount,
    grandTotal,
  } = useMemo(() => {
    let sub = 0;
    let gst = 0;

    rows.forEach((row) => {
      const lineSubtotal =
        Number(row.quantity || 0) *
        Number(row.price || 0);

      const lineGst =
        lineSubtotal *
        (Number(row.gstRate || 0) /
          100);

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

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setFormError("");

    // --------------------------------------------------
    // VENDOR
    // --------------------------------------------------

    if (!vendor) {
      setFormError(
        "Select a vendor"
      );
      return;
    }

    // --------------------------------------------------
    // DELIVERY DATE
    // --------------------------------------------------

    if (!expectedDeliveryDate) {
      setFormError(
        "Choose the expected delivery date"
      );
      return;
    }

    // --------------------------------------------------
    // ITEMS
    // --------------------------------------------------

    if (rows.length === 0) {
      setFormError(
        "Add at least one item"
      );
      return;
    }

    const seenItems =
      new Set();

    for (
      const [index, row]
      of rows.entries()
    ) {
      const line =
        `Item ${index + 1}`;

      // ----------------------------------------------
      // PRODUCT
      // ----------------------------------------------

      if (!row.product) {
        setFormError(
          `${line}: select an item`
        );
        return;
      }

      // ----------------------------------------------
      // DUPLICATE
      // ----------------------------------------------

      const itemKey =
        `${row.itemModel}:${row.product}`;

      if (
        seenItems.has(itemKey)
      ) {
        setFormError(
          `${line}: the same item cannot be added twice`
        );
        return;
      }

      seenItems.add(itemKey);

      // ----------------------------------------------
      // QUANTITY
      // ----------------------------------------------

      const quantity =
        Number(row.quantity);

      if (
        !Number.isInteger(
          quantity
        ) ||
        quantity < 1
      ) {
        setFormError(
          `${line}: quantity must be a whole number, 1 or more`
        );
        return;
      }

      // ----------------------------------------------
      // PRICE
      // ----------------------------------------------

      const price =
        Number(row.price);

      if (
        row.price === "" ||
        !Number.isFinite(
          price
        ) ||
        price < 0
      ) {
        setFormError(
          `${line}: enter a price of 0 or more`
        );
        return;
      }

      // ----------------------------------------------
      // GST
      // ----------------------------------------------

      if (
        row.gstRate !== ""
      ) {
        const gstRate =
          Number(row.gstRate);

        if (
          !Number.isFinite(
            gstRate
          ) ||
          gstRate < 0
        ) {
          setFormError(
            `${line}: enter a GST rate of 0 or more`
          );
          return;
        }
      }
    }

    // =================================================
    // SAVE
    // =================================================

    try {
      setSubmitting(true);

      await fetchJson(
        `/api/procurement/purchase-orders/${purchaseOrderId}`,
        {
          method: "PUT",

          body: JSON.stringify({
            vendor,

            expectedDeliveryDate,

            notes:
              notes.trim(),

            items:
              rows.map(
                (row) => ({
                  itemModel:
                    row.itemModel,

                  product:
                    row.product,

                  quantity:
                    Number(
                      row.quantity
                    ),

                  price:
                    Number(
                      row.price
                    ),

                  gstRate:
                    row.gstRate === ""
                      ? 0
                      : Number(
                          row.gstRate
                        ),

                  hsnCode:
                    row.hsnCode.trim(),
                })
              ),
          }),
        }
      );

      navigate(
        `/purchase-orders/${purchaseOrderId}`
      );
    } catch (error) {
      setFormError(
        error.message ||
          "Failed to update purchase order"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="po-edit-page">
        <p className="po-state">
          Loading purchase order...
        </p>
      </div>
    );
  }

  // ====================================================
  // LOAD ERROR
  // ====================================================

  if (loadError) {
    return (
      <div className="po-edit-page">

        <button
          type="button"
          className="po-back"
          onClick={() =>
            navigate(
              `/purchase-orders/${purchaseOrderId}`
            )
          }
        >
          ← Back to purchase order
        </button>

        <p className="po-state po-state-error">
          {loadError}
        </p>

      </div>
    );
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="po-edit-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="po-edit-header">

        <button
          type="button"
          className="po-back"
          onClick={() =>
            navigate(
              `/purchase-orders/${purchaseOrderId}`
            )
          }
        >
          ← Back to purchase order
        </button>

        <h1>
          Edit purchase order
        </h1>

        <p>
          Update the draft purchase order
          before it is marked as ordered.
        </p>

        {order?.poNumber && (
          <div className="po-edit-number">
            PO Number:{" "}
            <strong>
              {order.poNumber}
            </strong>
          </div>
        )}

      </div>

      {/* =================================================
          WARNING
      ================================================= */}

      {loadWarning && (
        <div className="po-alert po-alert-warning">
          {loadWarning}
        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        noValidate
      >

        {/* =================================================
            ORDER DETAILS
        ================================================= */}

        <section className="po-card">

          <h2 className="po-card-title">
            Order details
          </h2>

          <div className="po-fields">

            {/* Vendor */}

            <label className="po-field">

              <span>
                Vendor
              </span>

              <select
                value={vendor}
                onChange={(event) =>
                  setVendor(
                    event.target.value
                  )
                }
                disabled={
                  submitting
                }
              >

                <option value="">
                  Select a vendor
                </option>

                {vendors.map(
                  (item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.vendorName}
                    </option>
                  )
                )}

              </select>

            </label>

            {/* Delivery date */}

            <label className="po-field">

              <span>
                Expected delivery date
              </span>

              <input
                type="date"
                min={todayString()}
                value={
                  expectedDeliveryDate
                }
                onChange={(event) =>
                  setExpectedDeliveryDate(
                    event.target.value
                  )
                }
                disabled={
                  submitting
                }
              />

            </label>

          </div>

          {/* Notes */}

          <label className="po-field">

            <span>
              Notes (optional)
            </span>

            <textarea
              rows={3}
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
              placeholder="Anything the vendor or your team should know"
              disabled={
                submitting
              }
            />

          </label>

        </section>

        {/* =================================================
            ITEMS
        ================================================= */}

        <section className="po-card">

          <div className="po-edit-items-header">

            <h2 className="po-card-title">
              Items
            </h2>

            <button
              type="button"
              className="po-add-row"
              onClick={addRow}
              disabled={
                submitting
              }
            >
              + Add item
            </button>

          </div>

          <div className="po-rows">

            <div className="po-row po-row-head">

              <span>
                Type
              </span>

              <span>
                Item
              </span>

              <span>
                HSN
              </span>

              <span>
                Quantity
              </span>

              <span>
                Price (each)
              </span>

              <span>
                GST %
              </span>

              <span>
                Line total
              </span>

              <span />

            </div>

            {rows.map((row) => {

              const taken =
                pickedKeys(
                  row.rowId
                );

              return (
                <div
                  className="po-row"
                  key={row.rowId}
                >

                  {/* TYPE */}

                  <select
                    aria-label="Item type"
                    value={
                      row.itemModel
                    }
                    onChange={(
                      event
                    ) =>
                      handleTypeChange(
                        row.rowId,
                        event.target.value
                      )
                    }
                    disabled={
                      submitting
                    }
                  >

                    <option value="Product">
                      Product
                    </option>

                    <option value="RepairPart">
                      Repair part
                    </option>

                  </select>

                  {/* ITEM */}

                  <select
                    aria-label="Item"
                    value={
                      row.product
                    }
                    onChange={(
                      event
                    ) =>
                      handleItemChange(
                        row.rowId,
                        row.itemModel,
                        event.target.value
                      )
                    }
                    disabled={
                      submitting
                    }
                  >

                    <option value="">
                      Select an item
                    </option>

                    {optionsFor(
                      row.itemModel
                    ).map(
                      (item) => (
                        <option
                          key={
                            item._id
                          }
                          value={
                            item._id
                          }
                          disabled={
                            taken.has(
                              `${row.itemModel}:${item._id}`
                            )
                          }
                        >
                          {itemLabel(
                            item,
                            row.itemModel
                          )}
                        </option>
                      )
                    )}

                  </select>

                  {/* HSN */}

                  <input
                    type="text"
                    aria-label="HSN code"
                    placeholder="HSN"
                    value={
                      row.hsnCode
                    }
                    onChange={(
                      event
                    ) =>
                      updateRow(
                        row.rowId,
                        {
                          hsnCode:
                            event.target
                              .value,
                        }
                      )
                    }
                    disabled={
                      submitting
                    }
                  />

                  {/* QUANTITY */}

                  <input
                    type="number"
                    aria-label="Quantity"
                    min="1"
                    step="1"
                    value={
                      row.quantity
                    }
                    onChange={(
                      event
                    ) =>
                      updateRow(
                        row.rowId,
                        {
                          quantity:
                            event.target
                              .value,
                        }
                      )
                    }
                    disabled={
                      submitting
                    }
                  />

                  {/* PRICE */}

                  <input
                    type="number"
                    aria-label="Price"
                    min="0"
                    step="0.01"
                    value={
                      row.price
                    }
                    onChange={(
                      event
                    ) =>
                      updateRow(
                        row.rowId,
                        {
                          price:
                            event.target
                              .value,
                        }
                      )
                    }
                    disabled={
                      submitting
                    }
                  />

                  {/* GST */}

                  <input
                    type="number"
                    aria-label="GST rate"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    value={
                      row.gstRate
                    }
                    onChange={(
                      event
                    ) =>
                      updateRow(
                        row.rowId,
                        {
                          gstRate:
                            event.target
                              .value,
                        }
                      )
                    }
                    disabled={
                      submitting
                    }
                  />

                  {/* LINE TOTAL */}

                  <span className="po-line-total">

                    {formatMoney(
                      Number(
                        row.quantity ||
                          0
                      ) *
                        Number(
                          row.price ||
                            0
                        ) +
                        Number(
                          row.quantity ||
                            0
                        ) *
                          Number(
                            row.price ||
                              0
                          ) *
                          (Number(
                            row.gstRate ||
                              0
                          ) /
                            100)
                    )}

                  </span>

                  {/* REMOVE */}

                  <button
                    type="button"
                    className="po-remove"
                    onClick={() =>
                      removeRow(
                        row.rowId
                      )
                    }
                    disabled={
                      rows.length ===
                        1 ||
                      submitting
                    }
                    aria-label="Remove item"
                  >
                    Remove
                  </button>

                </div>
              );
            })}

          </div>

          {/* =================================================
              TOTALS
          ================================================= */}

          <div className="po-total-breakdown">

            <div className="po-total-row">

              <span>
                Subtotal
              </span>

              <span>
                {formatMoney(
                  subtotal
                )}
              </span>

            </div>

            <div className="po-total-row">

              <span>
                GST
              </span>

              <span>
                {formatMoney(
                  gstAmount
                )}
              </span>

            </div>

            <div className="po-total-row po-total-row-grand">

              <span>
                Total
              </span>

              <strong>
                {formatMoney(
                  grandTotal
                )}
              </strong>

            </div>

          </div>

        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {formError && (
          <div
            className="po-alert po-alert-error"
            role="alert"
          >
            {formError}
          </div>
        )}

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="po-actions">

          <button
            type="button"
            className="po-btn po-btn-secondary"
            onClick={() =>
              navigate(
                `/purchase-orders/${purchaseOrderId}`
              )
            }
            disabled={
              submitting
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="po-btn po-btn-primary"
            disabled={
              submitting
            }
          >
            {submitting
              ? "Saving..."
              : "Save changes"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default PurchaseOrderEdit;

