import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./PurchaseOrderList.css";


// ======================================================
// API BASE (same pattern as VendorList.jsx)
// ======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";


// ======================================================
// HELPERS
// ======================================================

const STATUS_TABS = [
  { value: "ALL", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "ORDERED", label: "Ordered" },
  { value: "RECEIVED", label: "Received" },
  { value: "CANCELLED", label: "Cancelled" },
];

const STATUS_LABELS = {
  DRAFT: "Draft",
  ORDERED: "Ordered",
  RECEIVED: "Received",
  CANCELLED: "Cancelled",
};

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

// GST-inclusive total for a PO.
// Older POs saved before GST existed have grandTotal at its schema
// default (0), so fall back to totalAmount (pre-GST) for those.
const orderGrandTotal = (order) => {

  if (order.grandTotal) return Number(order.grandTotal);

  return Number(order.totalAmount || 0);
};

// An ordered PO whose delivery date has passed
const isOverdue = (order) => {

  if (order.status !== "ORDERED" || !order.expectedDeliveryDate) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(order.expectedDeliveryDate) < today;
};


function PurchaseOrderList() {

  const navigate = useNavigate();


  // ====================================================
  // STATE
  // ====================================================

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("ALL");


  // ====================================================
  // LOAD PURCHASE ORDERS
  // ====================================================

  const loadOrders = async () => {

    setLoading(true);
    setError("");

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/procurement/purchase-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load purchase orders"
        );
      }

      setOrders(result.data || []);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);


  // ====================================================
  // TAB COUNTS + FILTER
  // ====================================================

  const counts = useMemo(() => {

    const result = { ALL: orders.length };

    orders.forEach((order) => {
      result[order.status] = (result[order.status] || 0) + 1;
    });

    return result;

  }, [orders]);

  const filteredOrders = useMemo(() => {

    const term = search.trim().toLowerCase();

    return orders.filter((order) => {

      if (statusTab !== "ALL" && order.status !== statusTab) {
        return false;
      }

      if (!term) return true;

      return (
        order.poNumber?.toLowerCase().includes(term) ||
        order.vendor?.vendorName?.toLowerCase().includes(term)
      );
    });

  }, [orders, statusTab, search]);


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="po-list-page">

      <div className="po-list-header">
        <div>
          <h1>Purchase orders</h1>
          <p>Orders placed with your vendors</p>
        </div>

        <button
          type="button"
          className="po-list-create"
          onClick={() => navigate("/add-purchase-order")}
        >
          + Create purchase order
        </button>
      </div>

      <div className="po-list-tabs" role="tablist">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={statusTab === tab.value}
            className={`po-list-tab ${
              statusTab === tab.value ? "active" : ""
            }`}
            onClick={() => setStatusTab(tab.value)}
          >
            {tab.label}
            <span className="po-list-tab-count">
              {counts[tab.value] || 0}
            </span>
          </button>
        ))}
      </div>

      <div className="po-list-toolbar">
        <input
          type="text"
          placeholder="Search by PO number or vendor..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading && (
        <div className="po-list-state">Loading purchase orders...</div>
      )}

      {!loading && error && (
        <div className="po-list-state error">{error}</div>
      )}

      {!loading && !error && filteredOrders.length === 0 && (
        <div className="po-list-state">
          {orders.length === 0
            ? "No purchase orders yet. Create one to get started."
            : "No purchase orders match your filters."}
        </div>
      )}

      {!loading && !error && filteredOrders.length > 0 && (
        <div className="po-list-table-wrapper">
          <table className="po-list-table">
            <thead>
              <tr>
                <th>PO number</th>
                <th>Vendor</th>
                <th>Items</th>
                <th className="num">Total</th>
                <th>Expected delivery</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() =>
                    navigate(`/purchase-orders/${order._id}`)
                  }
                >
                  <td className="po-list-number">{order.poNumber}</td>
                  <td>{order.vendor?.vendorName || "—"}</td>
                  <td>{order.items?.length || 0}</td>
                  <td className="num">
                    {formatMoney(orderGrandTotal(order))}
                  </td>
                  <td>
                    {formatDate(order.expectedDeliveryDate)}
                    {isOverdue(order) && (
                      <span className="po-list-overdue">Overdue</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`po-list-badge po-list-badge-${order.status.toLowerCase()}`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}


export default PurchaseOrderList;