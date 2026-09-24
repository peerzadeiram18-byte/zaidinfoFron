// import React, {
//     useEffect,
//     useState
// } from "react";
// import ReviewModal from "../../../components/Reviews/ReviewModal";
// import {
//     useNavigate
// } from "react-router-dom";

// import "./MyOrders.css";

// import {
//     getMyOrders
// } from "../../../services/orderService";


// const MyOrders = () => {

//     const navigate = useNavigate();


//     const [orders, setOrders] = useState([]);

//     const [loading, setLoading] = useState(true);


//     const [reviewProduct, setReviewProduct] =
//   useState(null);

// const [reviewOrder, setReviewOrder] =
//   useState(null);
  
  
//     // ==================================================
//     // FETCH ORDERS
//     // ==================================================

//     const fetchOrders = async () => {

//         try {

//             const res =
//                 await getMyOrders();


//             console.log(
//                 "Orders Response :",
//                 res
//             );


//             setOrders(

//                 res?.orders ||

//                 res?.data?.orders ||

//                 res?.data ||

//                 []

//             );

//         }

//         catch (error) {

//             console.error(
//                 "MY ORDERS ERROR:",
//                 error
//             );

//         }

//         finally {

//             setLoading(false);

//         }

//     };


//     useEffect(() => {

//         fetchOrders();

//     }, []);


//     // ==================================================
//     // LOADING
//     // ==================================================

//     if (loading) {

//         return (

//             <div className="myorders-loading">

//                 Loading Orders...

//             </div>

//         );

//     }


//     return (

//         <div className="myorders-container">


//             <h1 className="myorders-title">

//                 My Orders

//             </h1>


//             {
//                 orders.length === 0

//                     ?

//                     (

//                         <div className="no-orders">

//                             <h3>
//                                 No Orders Found
//                             </h3>

//                             <button
//                                 onClick={() =>
//                                     navigate("/shop")
//                                 }
//                             >
//                                 Continue Shopping
//                             </button>

//                         </div>

//                     )

//                     :

//                     (

//                         orders.map((order) => (

//                             <div
//                                 className="order-card"
//                                 key={order._id}
//                             >


//                                 {/* =====================
//                                     ORDER ID
//                                 ===================== */}

//                                 <div className="order-row">

//                                     <span>
//                                         Order ID
//                                     </span>

//                                     <p>
//                                         {order._id}
//                                     </p>

//                                 </div>


//                                 {/* =====================
//                                     TOTAL
//                                 ===================== */}

//                                 <div className="order-row">

//                                     <span>
//                                         Total Amount
//                                     </span>

//                                     <p>
//                                         ₹ {order.totalAmount}
//                                     </p>

//                                 </div>


//                                 {/* =====================
//                                     ORDER STATUS
//                                 ===================== */}

//                                 <div className="order-row">

//                                     <span>
//                                         Order Status
//                                     </span>

//                                     <p>
//                                         {order.orderStatus}
//                                     </p>

//                                 </div>


//                                 {/* =====================
//                                     PAYMENT STATUS
//                                 ===================== */}

//                                 <div className="order-row">

//                                     <span>
//                                         Payment Status
//                                     </span>

//                                     <p>
//                                         {order.paymentStatus}
//                                     </p>

//                                 </div>


//                                 {/* =====================
//                                     ITEMS
//                                 ===================== */}

//                                 <div className="order-row">

//                                     <span>
//                                         Items
//                                     </span>

//                                     <p>
//                                         {order.orderItems?.length || 0}
//                                     </p>

//                                 </div>


//                                 {/* =====================
//                                     DATE
//                                 ===================== */}

//                                 <div className="order-row">

//                                     <span>
//                                         Date
//                                     </span>

//                                     <p>

//                                         {
//                                             order.createdAt

//                                                 ?

//                                                 new Date(
//                                                     order.createdAt
//                                                 ).toLocaleDateString(
//                                                     "en-IN"
//                                                 )

//                                                 :

//                                                 "N/A"
//                                         }

//                                     </p>

//                                 </div>


//                                 {/* =====================
//                                     ACTIONS
//                                 ===================== */}

//                                 <div
//                                     className="order-actions"
//                                 >


//                                     <button
//                                         className="view-btn"
//                                         onClick={() =>
//                                             navigate(
//                                                 `/order/${order._id}`
//                                             )
//                                         }
//                                     >
//                                         View Details
//                                     </button>


//                                     <button
//                                         className="track-order-btn"
//                                         onClick={() =>
//                                             navigate(
//                                                 `/order/${order._id}/track`
//                                             )
//                                         }
//                                     >
//                                         🚚 Track Order
//                                     </button>


//     {/* REVIEW PRODUCT */}

//   {/* ==============================
//     DELIVERED ORDER - PRODUCTS
// ================================ */}

// {order.orderStatus === "DELIVERED" &&
//     order.orderItems?.length > 0 && (

//         <div className="order-products-review">

//             <h4>Products</h4>

//             {order.orderItems.map((item, index) => (

//                 <div
//                     className="review-product-row"
//                     key={item.product?._id || index}
//                 >

//                     <div className="review-product-info">

//                         <span className="review-product-name">

//                             {item.product?.name ||
//                                 item.productName ||
//                                 "Product"}

//                         </span>

//                         <span className="review-product-quantity">

//                             Qty: {item.quantity}

//                         </span>

//                     </div>


//                     <button
//                         type="button"
//                         className="review-btn"
//                         onClick={() => {

//                             setReviewProduct(
//                                 item.product
//                             );

//                             setReviewOrder(order);

//                         }}
//                     >
//                         ⭐ Review Product
//                     </button>

//                 </div>

//             ))}

//         </div>

// )}

//                                 </div>


//                             </div>

//                         ))

//                     )
//             }

//   {/* ============================
//                 REVIEW MODAL
//             ============================ */}

//             {reviewProduct && reviewOrder && (

//                 <ReviewModal

//                     product={reviewProduct}

//                     order={reviewOrder}

//                     onClose={() => {

//                         setReviewProduct(null);

//                         setReviewOrder(null);

//                     }}

//                     onSuccess={() => {

//                         setReviewProduct(null);

//                         setReviewOrder(null);

//                     }}

//                 />

//             )}



//         </div>

//     );

// };


// export default MyOrders;





import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReviewModal from "../../../components/Reviews/ReviewModal";
import { getMyOrders } from "../../../services/orderService";
import "./MyOrders.css";

const API_BASE_URL = "http://localhost:5000/api";

const MyOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [returningOrder, setReturningOrder] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [otherReasonText, setOtherReasonText] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnMessage, setReturnMessage] = useState("");

  const [returnDetails, setReturnDetails] = useState({});
  const [refundDetails, setRefundDetails] = useState({});

  const [reviewProduct, setReviewProduct] = useState(null);
  const [reviewOrder, setReviewOrder] = useState(null);

  // Auth Header helper
  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("userToken") ||
      localStorage.getItem("accessToken") ||
      "";

    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json"
      }
    };
  };

  // Safe Item Identification
  const extractProductId = (item) => {
    if (!item) return "";
    if (typeof item.product === "object" && item.product !== null) {
      return item.product._id || item.product.id || "";
    }
    return item.product || item.productId || item._id || "";
  };

  // Return & Refund Details
  const loadReturnRefundDetails = async (orderList) => {
    if (!Array.isArray(orderList) || orderList.length === 0) return;

    const returns = {};
    const refunds = {};

    await Promise.all(
      orderList.map(async (order) => {
        const orderId = order?._id || order?.id;
        if (!orderId) return;

        try {
          const res = await axios.get(
            `${API_BASE_URL}/returns/order/${orderId}`,
            getAuthHeaders()
          );
          const data =
            res?.data?.returns || res?.data?.return || res?.data?.data || res?.data;

          if (Array.isArray(data) && data.length > 0) {
            returns[orderId] = data[data.length - 1];
          } else if (data && typeof data === "object" && data._id) {
            returns[orderId] = data;
          }
        } catch (e) {}

        try {
          const res = await axios.get(
            `${API_BASE_URL}/refunds/order/${orderId}`,
            getAuthHeaders()
          );
          const data =
            res?.data?.refunds || res?.data?.refund || res?.data?.data || res?.data;

          if (Array.isArray(data) && data.length > 0) {
            refunds[orderId] = data[data.length - 1];
          } else if (data && typeof data === "object" && data._id) {
            refunds[orderId] = data;
          }
        } catch (e) {}
      })
    );

    setReturnDetails(returns);
    setRefundDetails(refunds);
  };

  // Fetch Orders using your project's tested orderService
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMyOrders();

      const orderData =
        res?.orders ||
        res?.data?.orders ||
        res?.data?.data ||
        res?.data ||
        (Array.isArray(res) ? res : []);

      const validOrders = Array.isArray(orderData) ? orderData : [];
      setOrders(validOrders);
      await loadReturnRefundDetails(validOrders);
    } catch (error) {
      console.error("MY ORDERS FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Modal Controls
  const openReturnModal = (order) => {
    if (order?.orderStatus !== "DELIVERED" && order?.orderStatus !== "COMPLETED") {
      alert("Only delivered orders can be returned.");
      return;
    }

    const orderId = order?._id || order?.id;
    const existing = orderId ? returnDetails[orderId] : null;

    if (
      existing &&
      existing._id &&
      !["REJECTED", "CANCELLED"].includes(existing.status)
    ) {
      alert("Return request already exists for this order.");
      return;
    }

    setReturningOrder(order);
    setReturnReason("");
    setOtherReasonText("");
    setSelectedItems([]);
    setReturnMessage("");
  };

  const closeReturnModal = () => {
    if (returnLoading) return;
    setReturningOrder(null);
    setReturnReason("");
    setOtherReasonText("");
    setSelectedItems([]);
    setReturnMessage("");
  };

  // Item Selection
  const toggleItem = (item, index) => {
    const prodId = String(extractProductId(item) || index);

    setSelectedItems((prev) => {
      const exists = prev.find((s) => s.itemId === prodId);
      if (exists) {
        return prev.filter((s) => s.itemId !== prodId);
      }
      return [
        ...prev,
        {
          itemId: prodId,
          productId: prodId,
          productName:
            item?.title ||
            item?.product?.name ||
            item?.productName ||
            item?.name ||
            "Product",
          quantity: Number(item?.quantity) || 1
        }
      ];
    });
  };

  const isItemSelected = (item, index) => {
    const prodId = String(extractProductId(item) || index);
    return selectedItems.some((s) => s.itemId === prodId);
  };

  // Submit Return with exact Schema Enums
  const handleReturn = async () => {
    const orderId = returningOrder?._id || returningOrder?.id;
    if (!orderId) {
      setReturnMessage("Order ID not found.");
      return;
    }

    if (!returnReason.trim()) {
      setReturnMessage("Please select a return reason.");
      return;
    }

    if (!selectedItems.length) {
      setReturnMessage("Please select at least one product.");
      return;
    }

    try {
      setReturnLoading(true);
      setReturnMessage("");

      const finalNote = returnReason === "OTHER" ? otherReasonText.trim() : returnReason;

      // Matches returnSchema & return.service.js exactly
      const payload = {
        orderId: String(orderId),
        pickupRequired: true,
        customerNote: finalNote,
        items: selectedItems.map((item) => ({
          productId: String(item.productId),
          quantity: Number(item.quantity) || 1,
          reason: returnReason, // Exact ENUM from schema
          reasonNote: finalNote
        }))
      };

      const response = await axios.post(
        `${API_BASE_URL}/returns`,
        payload,
        getAuthHeaders()
      );

      setReturnMessage(
        response?.data?.message || "Return request created successfully!"
      );

      setTimeout(async () => {
        closeReturnModal();
        await fetchOrders();
      }, 1500);
    } catch (error) {
      console.error("RETURN SUBMIT ERROR:", error);
      setReturnMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create return request."
      );
    } finally {
      setReturnLoading(false);
    }
  };

  const getReturnStatus = (order) => {
    const orderId = order?._id || order?.id;
    const returnData = orderId ? returnDetails[orderId] : null;
    return (
      returnData?.status ||
      order?.returnStatus ||
      order?.return?.status ||
      null
    );
  };

  const getRefundStatus = (order) => {
    const orderId = order?._id || order?.id;
    const refundData = orderId ? refundDetails[orderId] : null;
    return (
      refundData?.status ||
      order?.refundStatus ||
      order?.refund?.status ||
      null
    );
  };

  if (loading) {
    return <div className="myorders-loading">Loading Orders...</div>;
  }

  return (
    <div className="myorders-container">
      <h1 className="myorders-title">My Orders</h1>

      {orders.length === 0 ? (
        <div className="no-orders">
          <h3>No Orders Found</h3>
          <button onClick={() => navigate("/shop")}>Continue Shopping</button>
        </div>
      ) : (
        orders.map((order, idx) => {
          const orderId = order?._id || order?.id || `order-${idx}`;
          const returnStatus = getReturnStatus(order);
          const refundStatus = getRefundStatus(order);

          return (
            <div className="order-card" key={orderId}>
              <div className="order-row">
                <span>Order ID</span>
                <p>{orderId}</p>
              </div>

              <div className="order-row">
                <span>Total Amount</span>
                <p>₹ {order?.totalAmount ?? 0}</p>
              </div>

              <div className="order-row">
                <span>Order Status</span>
                <p>{order?.orderStatus || "PENDING"}</p>
              </div>

              <div className="order-row">
                <span>Payment Status</span>
                <p>{order?.paymentStatus || "PENDING"}</p>
              </div>

              {returnStatus && (
                <div className="order-row">
                  <span>Return Status</span>
                  <p>{returnStatus}</p>
                </div>
              )}

              {refundStatus && (
                <div className="order-row">
                  <span>Refund Status</span>
                  <p>{refundStatus}</p>
                </div>
              )}

              <div className="order-row">
                <span>Items</span>
                <p>{order?.orderItems?.length || 0}</p>
              </div>

              <div className="order-row">
                <span>Date</span>
                <p>
                  {order?.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN")
                    : "N/A"}
                </p>
              </div>

              <div className="order-actions">
                <button
                  className="view-btn"
                  onClick={() => navigate(`/order/${orderId}`)}
                >
                  View Details
                </button>

                <button
                  className="track-order-btn"
                  onClick={() => navigate(`/order/${orderId}/track`)}
                >
                  🚚 Track Order
                </button>

                {(order?.orderStatus === "DELIVERED" || order?.orderStatus === "COMPLETED") && (
                  <button
                    className="return-order-btn"
                    onClick={() => openReturnModal(order)}
                    disabled={
                      !!returnStatus &&
                      !["REJECTED", "CANCELLED"].includes(returnStatus)
                    }
                  >
                    {returnStatus ? `↩️ Return: ${returnStatus}` : "↩️ Return Product"}
                  </button>
                )}

                {refundStatus && (
                  <button className="refund-status-btn" type="button">
                    💰 Refund: {refundStatus}
                  </button>
                )}
              </div>

              {(returnStatus || refundStatus) && (
                <div className="return-refund-timeline">
                  <h4>Return & Refund Progress</h4>
                  <div className="timeline">
                    <div className={returnStatus ? "timeline-step active" : "timeline-step"}>
                      <span>1</span>
                      <p>Return Requested</p>
                    </div>
                    <div
                      className={
                        [
                          "APPROVED",
                          "PICKUP_REQUESTED",
                          "PICKED_UP",
                          "RECEIVED",
                          "INSPECTED",
                          "COMPLETED"
                        ].includes(returnStatus)
                          ? "timeline-step active"
                          : "timeline-step"
                      }
                    >
                      <span>2</span>
                      <p>Return Approved</p>
                    </div>
                    <div
                      className={
                        [
                          "PICKUP_REQUESTED",
                          "PICKED_UP",
                          "RECEIVED",
                          "INSPECTED",
                          "COMPLETED"
                        ].includes(returnStatus)
                          ? "timeline-step active"
                          : "timeline-step"
                      }
                    >
                      <span>3</span>
                      <p>Pickup</p>
                    </div>
                    <div
                      className={
                        ["RECEIVED", "INSPECTED", "COMPLETED"].includes(returnStatus)
                          ? "timeline-step active"
                          : "timeline-step"
                      }
                    >
                      <span>4</span>
                      <p>Product Received</p>
                    </div>
                    <div
                      className={
                        ["INSPECTED", "COMPLETED"].includes(returnStatus)
                          ? "timeline-step active"
                          : "timeline-step"
                      }
                    >
                      <span>5</span>
                      <p>Inspection</p>
                    </div>
                    <div className={refundStatus ? "timeline-step active" : "timeline-step"}>
                      <span>6</span>
                      <p>Refund</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PRODUCTS LIST */}
              {order?.orderItems?.length > 0 && (
                <div className="order-products-review">
                  <h4>Products</h4>
                  {order.orderItems.map((item, index) => {
                    const prodId = String(extractProductId(item) || index);
                    return (
                      <div className="review-product-row" key={prodId}>
                        <div className="review-product-info">
                          <span className="review-product-name">
                            {item?.title ||
                              item?.product?.name ||
                              item?.productName ||
                              item?.name ||
                              "Product"}
                          </span>
                          <span className="review-product-quantity">
                            Qty: {item?.quantity || 1}
                          </span>
                        </div>
                        {(order?.orderStatus === "DELIVERED" || order?.orderStatus === "COMPLETED") && (
                          <button
                            type="button"
                            className="review-btn"
                            onClick={() => {
                              setReviewProduct(item?.product || item);
                              setReviewOrder(order);
                            }}
                          >
                            ⭐ Review Product
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* RETURN MODAL */}
      {returningOrder && (
        <div className="return-modal-overlay" onClick={closeReturnModal}>
          <div className="return-modal" onClick={(e) => e.stopPropagation()}>
            <div className="return-modal-header">
              <h2>Return Product</h2>
              <button
                type="button"
                onClick={closeReturnModal}
                disabled={returnLoading}
              >
                ×
              </button>
            </div>

            <div className="return-modal-body">
              <p>
                Order ID: <strong>{returningOrder?._id || returningOrder?.id}</strong>
              </p>
              <p>
                Total Amount: <strong>₹ {returningOrder?.totalAmount ?? 0}</strong>
              </p>

              <label>Select Products</label>
              <div className="return-items">
                {returningOrder?.orderItems?.map((item, index) => {
                  const prodId = String(extractProductId(item) || index);
                  return (
                    <label className="return-item" key={prodId}>
                      <input
                        type="checkbox"
                        checked={isItemSelected(item, index)}
                        onChange={() => toggleItem(item, index)}
                        disabled={returnLoading}
                      />
                      <div>
                        <strong>
                          {item?.title ||
                            item?.product?.name ||
                            item?.productName ||
                            item?.name ||
                            "Product"}
                        </strong>
                        <span>Qty: {item?.quantity || 1}</span>
                      </div>
                    </label>
                  );
                })}
              </div>

              <label>Reason for Return</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                disabled={returnLoading}
              >
                <option value="">Select Return Reason</option>
                <option value="WRONG_PRODUCT">Wrong product received</option>
                <option value="DAMAGED">Product damaged</option>
                <option value="DEFECTIVE">Product is defective</option>
                <option value="NOT_AS_EXPECTED">Product not as expected</option>
                <option value="SIZE_ISSUE">Size or fit issue</option>
                <option value="CHANGE_OF_MIND">Change of mind</option>
                <option value="OTHER">Other</option>
              </select>

              {returnReason === "OTHER" && (
                <textarea
                  value={otherReasonText}
                  onChange={(e) => setOtherReasonText(e.target.value)}
                  placeholder="Please describe your return reason..."
                  rows="4"
                  disabled={returnLoading}
                />
              )}

              {returnMessage && (
                <div className="return-message">{returnMessage}</div>
              )}

              <div className="return-modal-actions">
                <button
                  type="button"
                  className="cancel-return-btn"
                  onClick={closeReturnModal}
                  disabled={returnLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="submit-return-btn"
                  onClick={handleReturn}
                  disabled={returnLoading}
                >
                  {returnLoading ? "Submitting..." : "Submit Return"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {reviewProduct && reviewOrder && (
        <ReviewModal
          product={reviewProduct}
          order={reviewOrder}
          onClose={() => {
            setReviewProduct(null);
            setReviewOrder(null);
          }}
          onSuccess={() => {
            setReviewProduct(null);
            setReviewOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default MyOrders;