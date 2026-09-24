import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./AdminReturn.css";

const API_BASE_URL = "http://localhost:5000/api/returns";

const AdminReturn = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Picked up tracking state
  const [trackingNumber, setTrackingNumber] = useState("");
  const [activeTrackingId, setActiveTrackingId] = useState(null);

  // Inspection modal state
  const [inspectingReturn, setInspectingReturn] = useState(null);
  const [inspectionData, setInspectionData] = useState([]);

  // Auth Headers
  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("userToken") ||
      "";

    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json"
      }
    };
  };

  // ==================================================
  // FETCH ALL RETURNS
  // ==================================================
  const fetchReturns = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE_URL, getAuthHeaders());
      const list =
        res?.data?.returns ||
        res?.data?.data ||
        (Array.isArray(res?.data) ? res?.data : []);

      setReturns(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load returns:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  // ==================================================
  // COMMON ACTION HANDLER (PATCH)
  // ==================================================
  const handleApiAction = async (endpoint, payload = {}) => {
    try {
      setActionLoading(true);
      await axios.patch(endpoint, payload, getAuthHeaders());
      await fetchReturns();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Action failed"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // 1. Approve
  const handleApprove = (id) => {
    handleApiAction(`${API_BASE_URL}/${id}/approve`);
  };

  // 2. Reject
  const handleReject = (id) => {
    const reason = prompt("Enter rejection reason:");
    if (reason && reason.trim()) {
      handleApiAction(`${API_BASE_URL}/${id}/reject`, {
        rejectionReason: reason.trim()
      });
    }
  };

  // 3. Request Pickup
  const handleRequestPickup = (id) => {
    handleApiAction(`${API_BASE_URL}/${id}/pickup-request`);
  };

  // 4. Mark Picked Up with Courier Tracking
  const handlePickedUpSubmit = (id) => {
    if (!trackingNumber.trim()) {
      alert("Please provide a tracking number");
      return;
    }
    handleApiAction(`${API_BASE_URL}/${id}/picked-up`, {
      trackingNumber: trackingNumber.trim()
    });
    setActiveTrackingId(null);
    setTrackingNumber("");
  };

  // 5. Receive Product at Warehouse
  const handleReceive = (id) => {
    handleApiAction(`${API_BASE_URL}/${id}/receive`);
  };

  // 6. Open Inspection Modal
  const openInspectModal = (ret) => {
    setInspectingReturn(ret);
    // Initialize inspection form for each item in the return
    const initialItems = (ret?.items || []).map((item) => ({
      productId: item?.product?._id || item?.product || item?._id,
      title: item?.title || item?.productName || "Product",
      condition: "GOOD", // Default enum allowed in schema
      inspectionNote: ""
    }));
    setInspectionData(initialItems);
  };

  // 7. Submit Inspection
  const submitInspection = async () => {
    if (!inspectingReturn) return;

    // Backend inspectReturnService expects array: inspectedItems
    const payload = {
      inspectedItems: inspectionData.map((item) => ({
        productId: String(item.productId),
        condition: item.condition, // "GOOD" | "DAMAGED" | "DEFECTIVE" | "MISSING_PARTS"
        inspectionNote: item.inspectionNote
      }))
    };

    const id = inspectingReturn?._id || inspectingReturn?.id;
    await handleApiAction(`${API_BASE_URL}/${id}/inspect`, payload);
    setInspectingReturn(null);
  };

  // 8. Complete Return (Restocks inventory if condition is GOOD)
  const handleComplete = (id) => {
    if (window.confirm("Complete this return and update warehouse inventory?")) {
      handleApiAction(`${API_BASE_URL}/${id}/complete`);
    }
  };

  if (loading) {
    return (
      <div className="admin-return-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading return requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-return-page">
      {/* Header */}
      <div className="admin-return-header">
        <div>
          <h2>Return Management</h2>
        </div>
        <span className="stats-badge">Total Requests: {returns.length}</span>
      </div>

      {/* Table Card */}
      <div className="return-table-card">
        <div className="return-table-wrapper">
          <table className="modern-return-table">
            <thead>
              <tr>
                <th>Return No. / ID</th>
                <th>Order ID</th>
                <th>Customer Note</th>
                <th>Items (Reason)</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Procedure Actions</th>
              </tr>
            </thead>
            <tbody>
              {returns.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">No return requests found.</div>
                  </td>
                </tr>
              ) : (
                returns.map((ret) => {
                  const retId = ret?._id || ret?.id;
                  const returnNumber = ret?.returnNumber || retId.slice(-8);
                  const orderId =
                    ret?.order?._id || ret?.orderId || ret?.order || "N/A";
                  const status = (ret?.status || "REQUESTED").toUpperCase();

                  return (
                    <tr key={retId}>
                      <td data-label="Return Number">
                        <span className="return-code" title={retId}>
                          {returnNumber}
                        </span>
                      </td>

                      <td data-label="Order ID">
                        <span className="return-code">
                          {typeof orderId === "string"
                            ? orderId.slice(-8)
                            : "N/A"}
                        </span>
                      </td>

                      <td data-label="Note">
                        <span style={{ fontSize: "0.9rem" }}>
                          {ret?.customerNote || "—"}
                        </span>
                      </td>

                      <td data-label="Items">
                        <div className="items-list">
                          {ret?.items && ret.items.length > 0 ? (
                            ret.items.map((item, i) => (
                              <div key={i} className="item-chip" style={{ display: "inline-block", margin: "2px" }}>
                                <strong>{item?.title || "Item"}</strong> (x
                                {item?.quantity || 1})
                                <br />
                                <small style={{ color: "#d9534f" }}>
                                  [{item?.reason || "NO_REASON"}]
                                </small>
                              </div>
                            ))
                          ) : (
                            <span style={{ color: "var(--text-muted)" }}>—</span>
                          )}
                        </div>
                      </td>

                      <td data-label="Status">
                        <span
                          className={`status-badge status-${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td data-label="Actions">
                        <div className="action-group" style={{ justifyContent: "flex-end", gap: "6px" }}>
                          {/* 1. REQUESTED */}
                          {status === "REQUESTED" && (
                            <>
                              <button
                                className="btn btn-approve"
                                disabled={actionLoading}
                                onClick={() => handleApprove(retId)}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-reject"
                                disabled={actionLoading}
                                onClick={() => handleReject(retId)}
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {/* 2. APPROVED */}
                          {status === "APPROVED" && (
                            <button
                              className="btn btn-pickup"
                              disabled={actionLoading}
                              onClick={() => handleRequestPickup(retId)}
                            >
                              Request Pickup
                            </button>
                          )}

                          {/* 3. PICKUP_REQUESTED */}
                          {status === "PICKUP_REQUESTED" && (
                            <div className="tracking-input-group">
                              {activeTrackingId === retId ? (
                                <>
                                  <input
                                    className="tracking-input"
                                    type="text"
                                    placeholder="Courier AWB / Tracking #"
                                    value={trackingNumber}
                                    onChange={(e) =>
                                      setTrackingNumber(e.target.value)
                                    }
                                  />
                                  <button
                                    className="btn btn-approve"
                                    disabled={actionLoading}
                                    onClick={() => handlePickedUpSubmit(retId)}
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    className="btn btn-cancel"
                                    onClick={() => {
                                      setActiveTrackingId(null);
                                      setTrackingNumber("");
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button
                                  className="btn btn-info"
                                  onClick={() => setActiveTrackingId(retId)}
                                >
                                  Mark Picked Up
                                </button>
                              )}
                            </div>
                          )}

                          {/* 4. PICKED_UP */}
                          {status === "PICKED_UP" && (
                            <button
                              className="btn btn-purple"
                              disabled={actionLoading}
                              onClick={() => handleReceive(retId)}
                            >
                              Mark Received
                            </button>
                          )}

                          {/* 5. RECEIVED */}
                          {status === "RECEIVED" && (
                            <button
                              className="btn btn-info"
                              disabled={actionLoading}
                              onClick={() => openInspectModal(ret)}
                            >
                              Inspect Products
                            </button>
                          )}

                          {/* 6. INSPECTED */}
                          {status === "INSPECTED" && (
                            <button
                              className="btn btn-approve"
                              disabled={actionLoading}
                              onClick={() => handleComplete(retId)}
                            >
                              Complete Return
                            </button>
                          )}

                          {/* FINAL STATES */}
                          {["COMPLETED", "REJECTED", "CANCELLED"].includes(status) && (
                            <span
                              style={{
                                fontSize: "0.85rem",
                                color: "var(--text-muted)"
                              }}
                            >
                              Closed ({status})
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================================================== */}
      {/* INSPECTION MODAL */}
      {/* ====================================================== */}
      {inspectingReturn && (
        <div
          className="admin-modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
        >
          <div
            className="admin-modal"
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "8px",
              width: "550px",
              maxWidth: "90%"
            }}
          >
            <h3>Inspect Return Items</h3>
            <p style={{ color: "#666", marginBottom: "16px" }}>
              Return: <strong>{inspectingReturn.returnNumber || inspectingReturn._id}</strong>
            </p>

            <div style={{ maxHeight: "320px", overflowY: "auto" }}>
              {inspectionData.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    borderRadius: "6px",
                    marginBottom: "12px"
                  }}
                >
                  <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
                    {item.title}
                  </p>

                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
                    Condition:
                  </label>
                  <select
                    value={item.condition}
                    onChange={(e) => {
                      const val = e.target.value;
                      setInspectionData((prev) =>
                        prev.map((it, i) =>
                          i === idx ? { ...it, condition: val } : it
                        )
                      );
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginBottom: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc"
                    }}
                  >
                    <option value="GOOD">GOOD (Can restock to Inventory)</option>
                    <option value="DAMAGED">DAMAGED (Will not restock)</option>
                    <option value="DEFECTIVE">DEFECTIVE (Will not restock)</option>
                    <option value="MISSING_PARTS">MISSING_PARTS</option>
                  </select>

                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "4px" }}>
                    Inspection Note:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Box seal intact or scratches found"
                    value={item.inspectionNote}
                    onChange={(e) => {
                      const val = e.target.value;
                      setInspectionData((prev) =>
                        prev.map((it, i) =>
                          i === idx ? { ...it, inspectionNote: val } : it
                        )
                      );
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                      borderRadius: "4px",
                      border: "1px solid #ccc"
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
              <button
                className="btn btn-cancel"
                onClick={() => setInspectingReturn(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-approve"
                onClick={submitInspection}
                disabled={actionLoading}
              >
                {actionLoading ? "Submitting..." : "Save Inspection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReturn;