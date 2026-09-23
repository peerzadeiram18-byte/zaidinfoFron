import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./PurchaseOrderDetails.css";

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

const STATUS_LABELS = {
  DRAFT: "Draft",
  ORDERED: "Ordered",
  RECEIVED: "Received",
  CANCELLED: "Cancelled",
};

const show = (value) =>
  value === undefined || value === null || String(value).trim() === ""
    ? "—"
    : value;

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// The populated product document, or null if it was removed
const itemDoc = (item) =>
  item.product && typeof item.product === "object"
    ? item.product
    : null;

const itemProductId = (item) =>
  itemDoc(item)?._id ||
  (typeof item.product === "string" ? item.product : "");

const itemName = (item) => {
  const doc = itemDoc(item);

  if (!doc) return "Item details unavailable";

  const name =
    item.itemModel === "RepairPart"
      ? doc.partName || doc.name
      : doc.name;

  const sku = doc.sku || doc.partSku;

  return sku ? `${name} (${sku})` : name;
};

const isOverdue = (order) => {
  if (order.status !== "ORDERED" || !order.expectedDeliveryDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(order.expectedDeliveryDate) < today;
};

const createdByName = (user) =>
  user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email
    : "";

// Older POs created before GST fields existed have gstAmount/grandTotal
// still at their schema default (0). Fall back to totalAmount so those
// orders keep showing their correct total instead of ₹0.00.
const lineGst = (item) =>
  item.quantity * item.price * (Number(item.gstRate || 0) / 100);

const orderSubtotal = (order) =>
  Number(order.totalAmount || 0);

const orderGstAmount = (order) => {
  if (order.gstAmount) return Number(order.gstAmount);

  // Fall back to recomputing from items, for older POs saved without it
  return (order.items || []).reduce(
    (sum, item) => sum + lineGst(item),
    0
  );
};

const orderGrandTotal = (order) => {
  if (order.grandTotal) return Number(order.grandTotal);

  const gst = orderGstAmount(order);

  return gst
    ? orderSubtotal(order) + gst
    : orderSubtotal(order);
};

function PurchaseOrderDetails() {
  const { purchaseOrderId } = useParams();
  const navigate = useNavigate();

  // ====================================================
  // STATE
  // ====================================================

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // which action panel is open:
  // null | "receive" | "cancel" | "delete"
  const [activePanel, setActivePanel] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [receivedQty, setReceivedQty] = useState({});
  const [cancelReason, setCancelReason] = useState("");

  // ====================================================
  // LOAD PURCHASE ORDER
  // ====================================================

  const loadOrder = useCallback(
    async (silent = false) => {
      try {
        if (!silent) {
          setLoading(true);
          setError("");
        }

        const result = await fetchJson(
          `/api/procurement/purchase-orders/${purchaseOrderId}`
        );

        setOrder(result.data);
      } catch (err) {
        if (silent) {
          setActionError(
            "Saved, but the page could not be refreshed. Reload to see the latest status."
          );
        } else {
          setError(err.message);
        }
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [purchaseOrderId]
  );

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  // ====================================================
  // ACTIONS
  // ====================================================

  const runAction = async (path, body, successText) => {
    setActionLoading(true);
    setActionError("");
    setSuccessMessage("");

    try {
      await fetchJson(
        `/api/procurement/purchase-orders/${purchaseOrderId}/${path}`,
        {
          method: "PUT",
          body: body ? JSON.stringify(body) : undefined,
        }
      );

      setActivePanel(null);
      setSuccessMessage(successText);

      await loadOrder(true);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // ====================================================
  // DELETE PURCHASE ORDER
  // ====================================================

  const handleDelete = async () => {
    setActionLoading(true);
    setActionError("");
    setSuccessMessage("");

    try {
      await fetchJson(
        `/api/procurement/purchase-orders/${purchaseOrderId}`,
        {
          method: "DELETE",
        }
      );

      navigate("/purchase-orders");
    } catch (err) {
      setActionError(err.message);
      setActionLoading(false);
    }
  };

  const openPanel = (panel) => {
    setActionError("");
    setSuccessMessage("");

    if (panel === "receive") {
      // Start with the full ordered quantity for every item
      const initial = {};

      order.items.forEach((item) => {
        initial[item._id] = String(item.quantity);
      });

      setReceivedQty(initial);
    }

    if (panel === "cancel") {
      setCancelReason("");
    }

    setActivePanel(panel);
  };

  const closePanel = () => {
    setActivePanel(null);
    setActionError("");
  };

  const handleMarkOrdered = () => {
    runAction(
      "order",
      null,
      "Purchase order marked as ordered."
    );
  };

  // ====================================================
  // PRINT PURCHASE ORDER
  // ====================================================

  const handlePrint = () => {
    window.print();
  };

  const handleReceive = () => {
    const items = [];
    let total = 0;

    for (const item of order.items) {
      const productId = itemProductId(item);

      if (!productId) {
        setActionError(
          "One of the items no longer exists, so this order cannot be received here."
        );
        return;
      }

      const quantity = Number(receivedQty[item._id]);

      if (!Number.isInteger(quantity) || quantity < 0) {
        setActionError(
          `${itemName(item)}: enter a whole number, 0 or more`
        );
        return;
      }

      if (quantity > item.quantity) {
        setActionError(
          `${itemName(item)}: cannot receive more than the ordered ${item.quantity}`
        );
        return;
      }

      total += quantity;

      items.push({
        product: productId,
        receivedQuantity: quantity,
      });
    }

    if (total === 0) {
      setActionError(
        "At least one item must be received"
      );
      return;
    }

    runAction(
      "receive",
      { items },
      "Purchase order marked as received and stock updated."
    );
  };

  const handleCancel = () => {
    const reason = cancelReason.trim();

    if (order.status === "ORDERED" && !reason) {
      setActionError(
        "Enter a reason. It is required once the order has been sent to the vendor."
      );
      return;
    }

    runAction(
      "cancel",
      { reason },
      "Purchase order cancelled."
    );
  };

  // ====================================================
  // LOADING / ERROR STATES
  // ====================================================

  if (loading) {
    return (
      <div className="pod-page">

        <p className="pod-state">
          Loading purchase order...
        </p>

      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="pod-page">

        <button
          type="button"
          className="pod-back"
          onClick={() => navigate("/purchase-orders")}
        >
          ← Back to purchase orders
        </button>

        <p className="pod-state pod-state-error">
          {error || "Purchase order not found."}
        </p>

      </div>
    );
  }

  // ====================================================
  // RENDER VARIABLES
  // ====================================================

  const canOrder =
    order.status === "DRAFT";

  const canReceive =
    order.status === "ORDERED";

  const canCancel =
    order.status === "DRAFT" ||
    order.status === "ORDERED";

  // Edit is allowed only while the PO is still a draft.
  const canEdit =
    order.status === "DRAFT";

  // Received POs cannot be deleted because
  // inventory has already been updated.
  const canDelete =
    order.status !== "RECEIVED";

  const showReceivedColumn =
    order.status === "RECEIVED";

  const vendor =
    order.vendor || {};

  const subtotal =
    orderSubtotal(order);

  const gstAmount =
    orderGstAmount(order);

  const grandTotal =
    orderGrandTotal(order);

  return (
    <div className="pod-page">


      <button
        type="button"
        className="pod-back no-print"
        onClick={() => navigate("/purchase-orders")}
      >
        ← Back to purchase orders
      </button>

      {/* ---------------- HEADER ---------------- */}

      <div className="pod-header">

        <div>

          <h1 className="pod-title">
            {order.poNumber}
          </h1>

          <span
            className={`pod-badge pod-badge-${order.status.toLowerCase()}`}
          >
            {STATUS_LABELS[order.status] || order.status}
          </span>

          {isOverdue(order) && (
            <span className="pod-overdue no-print">
              Overdue
            </span>
          )}

        </div>

        {activePanel === null &&
          (
            canEdit ||
            canOrder ||
            canReceive ||
            canCancel ||
            canDelete
          ) && (

            <div className="pod-actions no-print">

              {/* ---------------- EDIT PO ---------------- */}

              {canEdit && (

                <button
                  type="button"
                  className="pod-btn pod-btn-secondary"
                  onClick={() =>
                    navigate(
                      `/purchase-orders/${purchaseOrderId}/edit`
                    )
                  }
                  disabled={actionLoading}
                >
                  Edit PO
                </button>

              )}

              {/* ---------------- PRINT PO ---------------- */}

              <button
                type="button"
                className="pod-btn pod-btn-secondary pod-print-btn"
                onClick={handlePrint}
                disabled={actionLoading}
              >
                Print PO
              </button>

              {/* ---------------- MARK AS ORDERED ---------------- */}

              {canOrder && (

                <button
                  type="button"
                  className="pod-btn pod-btn-primary"
                  onClick={handleMarkOrdered}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Saving..."
                    : "Mark as ordered"}
                </button>

              )}

              {/* ---------------- MARK AS RECEIVED ---------------- */}

              {canReceive && (

                <button
                  type="button"
                  className="pod-btn pod-btn-primary"
                  onClick={() => openPanel("receive")}
                  disabled={actionLoading}
                >
                  Mark as received
                </button>

              )}

              {/* ---------------- CANCEL ---------------- */}

              {canCancel && (

                <button
                  type="button"
                  className="pod-btn pod-btn-danger"
                  onClick={() => openPanel("cancel")}
                  disabled={actionLoading}
                >
                  Cancel order
                </button>

              )}

              {/* ---------------- DELETE ---------------- */}

              {canDelete && (

                <button
                  type="button"
                  className="pod-btn pod-btn-danger"
                  onClick={() => openPanel("delete")}
                  disabled={actionLoading}
                >
                  Delete PO
                </button>

              )}

            </div>

          )}

      </div>

      {/* ---------------- SUCCESS MESSAGE ---------------- */}

      {successMessage && (

        <div
          className="pod-alert pod-alert-success no-print"
          role="status"
        >
          {successMessage}
        </div>

      )}

      {/* ---------------- ERROR MESSAGE ---------------- */}

      {actionError && activePanel === null && (

        <div
          className="pod-alert pod-alert-error no-print"
          role="alert"
        >
          {actionError}
        </div>

      )}

      {/* ---------------- DELETE PANEL ---------------- */}

      {activePanel === "delete" && (

        <section className="pod-card pod-panel no-print">

          <h2 className="pod-card-title">
            Delete this purchase order?
          </h2>

          <p className="pod-panel-text">

            Are you sure you want to delete{" "}
            <strong>{order.poNumber}</strong>?

            <br />

            This purchase order will be removed from the
            active purchase order list.

          </p>

          {actionError && (

            <div
              className="pod-alert pod-alert-error"
              role="alert"
            >
              {actionError}
            </div>

          )}

          <div className="pod-panel-actions">

            <button
              type="button"
              className="pod-btn pod-btn-secondary"
              onClick={closePanel}
              disabled={actionLoading}
            >
              Go back
            </button>

            <button
              type="button"
              className="pod-btn pod-btn-danger-solid"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              {actionLoading
                ? "Deleting..."
                : "Confirm delete"}
            </button>

          </div>

        </section>

      )}

      {/* ---------------- RECEIVE PANEL ---------------- */}

      {activePanel === "receive" && (

        <section className="pod-card pod-panel no-print">

          <h2 className="pod-card-title">
            Mark as received
          </h2>

          <p className="pod-panel-text">

            Enter the quantity that actually arrived for each
            item. This adds the received quantities to stock
            and cannot be undone.

          </p>

          <div className="pod-table-wrapper">

            <table className="pod-table">

              <thead>

                <tr>
                  <th>Item</th>
                  <th className="num">Ordered</th>
                  <th className="num">Received</th>
                </tr>

              </thead>

              <tbody>

                {order.items.map((item) => (

                  <tr key={item._id}>

                    <td>
                      {itemName(item)}
                    </td>

                    <td className="num">
                      {item.quantity}
                    </td>

                    <td className="num">

                      <input
                        type="number"
                        aria-label={`Received quantity for ${itemName(item)}`}
                        min="0"
                        max={item.quantity}
                        step="1"
                        value={receivedQty[item._id] ?? ""}
                        onChange={(event) =>
                          setReceivedQty((previous) => ({
                            ...previous,
                            [item._id]: event.target.value,
                          }))
                        }
                      />

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {actionError && (

            <div
              className="pod-alert pod-alert-error"
              role="alert"
            >
              {actionError}
            </div>

          )}

          <div className="pod-panel-actions">

            <button
              type="button"
              className="pod-btn pod-btn-secondary"
              onClick={closePanel}
              disabled={actionLoading}
            >
              Go back
            </button>

            <button
              type="button"
              className="pod-btn pod-btn-primary"
              onClick={handleReceive}
              disabled={actionLoading}
            >
              {actionLoading
                ? "Saving..."
                : "Confirm received"}
            </button>

          </div>

        </section>

      )}

      {/* ---------------- CANCEL PANEL ---------------- */}

      {activePanel === "cancel" && (

        <section className="pod-card pod-panel no-print">

          <h2 className="pod-card-title">
            Cancel this order
          </h2>

          <p className="pod-panel-text">

            {order.status === "ORDERED"
              ? "This order was already sent to the vendor, so a reason is required."
              : "This draft has not been sent to the vendor. A reason is optional."}

          </p>

          <label className="pod-field">

            <span>
              Reason
              {order.status === "ORDERED"
                ? ""
                : " (optional)"}
            </span>

            <textarea
              rows={3}
              value={cancelReason}
              onChange={(event) =>
                setCancelReason(event.target.value)
              }
              placeholder="Why is this order being cancelled?"
            />

          </label>

          {actionError && (

            <div
              className="pod-alert pod-alert-error"
              role="alert"
            >
              {actionError}
            </div>

          )}

          <div className="pod-panel-actions">

            <button
              type="button"
              className="pod-btn pod-btn-secondary"
              onClick={closePanel}
              disabled={actionLoading}
            >
              Go back
            </button>

            <button
              type="button"
              className="pod-btn pod-btn-danger-solid"
              onClick={handleCancel}
              disabled={actionLoading}
            >
              {actionLoading
                ? "Saving..."
                : "Confirm cancellation"}
            </button>

          </div>

        </section>

      )}

      {/* ---------------- VENDOR + ORDER INFO ---------------- */}

      <div className="pod-grid">

        <section className="pod-card">

          <h2 className="pod-card-title">
            Vendor
          </h2>

          <dl className="pod-list">

            <div className="pod-row">

              <dt>Name</dt>

              <dd>

                {vendor._id ? (

                  <button
                    type="button"
                    className="pod-link no-print"
                    onClick={() =>
                      navigate(`/vendors/${vendor._id}`)
                    }
                  >
                    {show(vendor.vendorName)}
                  </button>

                ) : (

                  show(vendor.vendorName)

                )}

              </dd>

            </div>

            <div className="pod-row">

              <dt>Contact person</dt>

              <dd>
                {show(vendor.contactPerson)}
              </dd>

            </div>

            <div className="pod-row">

              <dt>Phone</dt>

              <dd>
                {show(vendor.phone)}
              </dd>

            </div>

            <div className="pod-row">

              <dt>Email</dt>

              <dd>
                {show(vendor.email)}
              </dd>

            </div>

          </dl>

        </section>

        <section className="pod-card">

          <h2 className="pod-card-title">
            Order
          </h2>

          <dl className="pod-list">

            <div className="pod-row">

              <dt>Expected delivery</dt>

              <dd>
                {formatDate(order.expectedDeliveryDate)}
              </dd>

            </div>

            <div className="pod-row">

              <dt>Created</dt>

              <dd>
                {formatDate(order.createdAt)}
              </dd>

            </div>

            <div className="pod-row">

              <dt>Created by</dt>

              <dd>
                {show(createdByName(order.createdBy))}
              </dd>

            </div>

            <div className="pod-row">

              <dt>Ordered on</dt>

              <dd>
                {formatDate(order.orderedAt)}
              </dd>

            </div>

            <div className="pod-row">

              <dt>Received on</dt>

              <dd>
                {formatDate(order.receivedAt)}
              </dd>

            </div>

          </dl>

        </section>

      </div>

      {/* ---------------- ITEMS ---------------- */}

      <section className="pod-card">

        <h2 className="pod-card-title">
          Items
        </h2>

        <div className="pod-table-wrapper">

          <table className="pod-table">

            <thead>

              <tr>

                <th>Item</th>

                <th>Type</th>

                <th>HSN</th>

                <th className="num">
                  Quantity
                </th>

                <th className="num">
                  Price
                </th>

                <th className="num">
                  GST %
                </th>

                <th className="num">
                  Line total
                </th>

                {showReceivedColumn && (

                  <th className="num">
                    Received
                  </th>

                )}

              </tr>

            </thead>

            <tbody>

              {order.items.map((item) => (

                <tr key={item._id}>

                  <td>
                    {itemName(item)}
                  </td>

                  <td>

                    {item.itemModel === "RepairPart"
                      ? "Repair part"
                      : "Product"}

                  </td>

                  <td>
                    {show(item.hsnCode)}
                  </td>

                  <td className="num">
                    {item.quantity}
                  </td>

                  <td className="num">
                    {formatMoney(item.price)}
                  </td>

                  <td className="num">

                    {item.gstRate
                      ? `${item.gstRate}%`
                      : "—"}

                  </td>

                  <td className="num">

                    {formatMoney(
                      item.quantity * item.price +
                      lineGst(item)
                    )}

                  </td>

                  {showReceivedColumn && (

                    <td className="num">

                      {item.receivedQuantity} of{" "}
                      {item.quantity}

                    </td>

                  )}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        <div className="pod-total-breakdown">

          <div className="pod-total-row">

            <span>
              Subtotal
            </span>

            <span>
              {formatMoney(subtotal)}
            </span>

          </div>

          <div className="pod-total-row">

            <span>
              GST
            </span>

            <span>
              {formatMoney(gstAmount)}
            </span>

          </div>

          <div className="pod-total-row pod-total-row-grand">

            <span>
              Total
            </span>

            <strong>
              {formatMoney(grandTotal)}
            </strong>

          </div>

        </div>

      </section>

      {/* ---------------- NOTES ---------------- */}

      {order.notes && (

        <section className="pod-card">

          <h2 className="pod-card-title">
            Notes
          </h2>

          <p className="pod-notes">
            {order.notes}
          </p>

        </section>

      )}

    </div>
  );
}

export default PurchaseOrderDetails;