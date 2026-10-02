// // import React, { useEffect, useState, useCallback } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import ReviewModal from "../../../components/Reviews/ReviewModal";
// // import { getMyOrders } from "../../../services/orderService";
// // import "./MyOrders.css";

// // // const API_BASE_URL = "http://localhost:5000/api";
// // const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// // const MyOrders = () => {
// //   const navigate = useNavigate();

// //   const [orders, setOrders] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const [returningOrder, setReturningOrder] = useState(null);
// //   const [returnReason, setReturnReason] = useState("");
// //   const [otherReasonText, setOtherReasonText] = useState("");
// //   const [selectedItems, setSelectedItems] = useState([]);
// //   const [returnLoading, setReturnLoading] = useState(false);
// //   const [returnMessage, setReturnMessage] = useState("");

// //   const [returnDetails, setReturnDetails] = useState({});
// //   const [refundDetails, setRefundDetails] = useState({});

// //   const [reviewProduct, setReviewProduct] = useState(null);
// //   const [reviewOrder, setReviewOrder] = useState(null);

// //   // Auth Header helper
// //   const getAuthHeaders = () => {
// //     const token =
// //       localStorage.getItem("token") ||
// //       localStorage.getItem("userToken") ||
// //       localStorage.getItem("accessToken") ||
// //       "";

// //     return {
// //       headers: {
// //         Authorization: token ? `Bearer ${token}` : "",
// //         "Content-Type": "application/json",
// //       },
// //     };
// //   };

// //   // Safe Item Identification
// //   const extractProductId = (item) => {
// //     if (!item) return "";
// //     if (typeof item.product === "object" && item.product !== null) {
// //       return item.product._id || item.product.id || "";
// //     }
// //     return item.product || item.productId || item._id || "";
// //   };

// //   // Return & Refund Details
// //   const loadReturnRefundDetails = async (orderList) => {
// //     if (!Array.isArray(orderList) || orderList.length === 0) return;

// //     const returns = {};
// //     const refunds = {};

// //     await Promise.all(
// //       orderList.map(async (order) => {
// //         const orderId = order?._id || order?.id;
// //         if (!orderId) return;

// //         try {
// //           const res = await axios.get(
// //             `${API_BASE_URL}/returns/order/${orderId}`,
// //             getAuthHeaders(),
// //           );
// //           const data =
// //             res?.data?.returns ||
// //             res?.data?.return ||
// //             res?.data?.data ||
// //             res?.data;

// //           if (Array.isArray(data) && data.length > 0) {
// //             returns[orderId] = data[data.length - 1];
// //           } else if (data && typeof data === "object" && data._id) {
// //             returns[orderId] = data;
// //           }
// //         } catch (e) {}

// //         try {
// //           const res = await axios.get(
// //             `${API_BASE_URL}/refunds/order/${orderId}`,
// //             getAuthHeaders(),
// //           );
// //           const data =
// //             res?.data?.refunds ||
// //             res?.data?.refund ||
// //             res?.data?.data ||
// //             res?.data;

// //           if (Array.isArray(data) && data.length > 0) {
// //             refunds[orderId] = data[data.length - 1];
// //           } else if (data && typeof data === "object" && data._id) {
// //             refunds[orderId] = data;
// //           }
// //         } catch (e) {}
// //       }),
// //     );

// //     setReturnDetails(returns);
// //     setRefundDetails(refunds);
// //   };

// //   // Fetch Orders using your project's tested orderService
// //   const fetchOrders = useCallback(async () => {
// //     try {
// //       setLoading(true);
// //       const res = await getMyOrders();

// //       const orderData =
// //         res?.orders ||
// //         res?.data?.orders ||
// //         res?.data?.data ||
// //         res?.data ||
// //         (Array.isArray(res) ? res : []);

// //       const validOrders = Array.isArray(orderData) ? orderData : [];
// //       setOrders(validOrders);
// //       await loadReturnRefundDetails(validOrders);
// //     } catch (error) {
// //       console.error("MY ORDERS FETCH ERROR:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

// //   useEffect(() => {
// //     fetchOrders();
// //   }, [fetchOrders]);

// //   // Modal Controls
// //   const openReturnModal = (order) => {
// //     if (
// //       order?.orderStatus !== "DELIVERED" &&
// //       order?.orderStatus !== "COMPLETED"
// //     ) {
// //       alert("Only delivered orders can be returned.");
// //       return;
// //     }

// //     const orderId = order?._id || order?.id;
// //     const existing = orderId ? returnDetails[orderId] : null;

// //     if (
// //       existing &&
// //       existing._id &&
// //       !["REJECTED", "CANCELLED"].includes(existing.status)
// //     ) {
// //       alert("Return request already exists for this order.");
// //       return;
// //     }

// //     setReturningOrder(order);
// //     setReturnReason("");
// //     setOtherReasonText("");
// //     setSelectedItems([]);
// //     setReturnMessage("");
// //   };

// //   const closeReturnModal = () => {
// //     if (returnLoading) return;
// //     setReturningOrder(null);
// //     setReturnReason("");
// //     setOtherReasonText("");
// //     setSelectedItems([]);
// //     setReturnMessage("");
// //   };

// //   // Item Selection
// //   const toggleItem = (item, index) => {
// //     const prodId = String(extractProductId(item) || index);

// //     setSelectedItems((prev) => {
// //       const exists = prev.find((s) => s.itemId === prodId);
// //       if (exists) {
// //         return prev.filter((s) => s.itemId !== prodId);
// //       }
// //       return [
// //         ...prev,
// //         {
// //           itemId: item?.product?._id || item?.product || item?._id,
// //           productId: item?.product?._id || item?.product || item?._id,
// //           productName:
// //             item?.title ||
// //             item?.product?.name ||
// //             item?.productName ||
// //             item?.name ||
// //             "Product",
// //           quantity: Number(item?.quantity) || 1,
// //         },
// //       ];
// //     });
// //   };

// //   const isItemSelected = (item, index) => {
// //     const prodId = String(extractProductId(item) || index);
// //     return selectedItems.some((s) => s.itemId === prodId);
// //   };

// //   // Submit Return with exact Schema Enums
// //   const handleReturn = async () => {
// //     const orderId = returningOrder?._id || returningOrder?.id;
// //     if (!orderId) {
// //       setReturnMessage("Order ID not found.");
// //       return;
// //     }

// //     if (!returnReason.trim()) {
// //       setReturnMessage("Please select a return reason.");
// //       return;
// //     }

// //     if (!selectedItems.length) {
// //       setReturnMessage("Please select at least one product.");
// //       return;
// //     }

// //     try {
// //       setReturnLoading(true);
// //       setReturnMessage("");

// //       const finalNote =
// //         returnReason === "OTHER" ? otherReasonText.trim() : returnReason;

// //       // Matches returnSchema & return.service.js exactly
// //       const payload = {
// //         orderId: String(orderId),
// //         pickupRequired: true,
// //         customerNote: finalNote,
// //         items: selectedItems.map((item) => ({
// //           productId: String(item.productId),
// //           quantity: Number(item.quantity) || 1,
// //           reason: returnReason, // Exact ENUM from schema
// //           reasonNote: finalNote,
// //         })),
// //       };

// //       const response = await axios.post(
// //         `${API_BASE_URL}/returns`,
// //         payload,
// //         getAuthHeaders(),
// //       );

// //       setReturnMessage(
// //         response?.data?.message || "Return request created successfully!",
// //       );

// //       setTimeout(async () => {
// //         closeReturnModal();
// //         await fetchOrders();
// //       }, 1500);
// //     } catch (error) {
// //       console.error("RETURN SUBMIT ERROR:", error);
// //       setReturnMessage(
// //         error?.response?.data?.message ||
// //           error?.message ||
// //           "Failed to create return request.",
// //       );
// //     } finally {
// //       setReturnLoading(false);
// //     }
// //   };

// //   const getReturnStatus = (order) => {
// //     const orderId = order?._id || order?.id;
// //     const returnData = orderId ? returnDetails[orderId] : null;
// //     return (
// //       returnData?.status || order?.returnStatus || order?.return?.status || null
// //     );
// //   };

// //   const getRefundStatus = (order) => {
// //     const orderId = order?._id || order?.id;
// //     const refundData = orderId ? refundDetails[orderId] : null;
// //     return (
// //       refundData?.status || order?.refundStatus || order?.refund?.status || null
// //     );
// //   };

// //   if (loading) {
// //     return <div className="myorders-loading">Loading Orders...</div>;
// //   }

// //   return (
// //     <div className="myorders-container">
// //       <h1 className="myorders-title">My Orders</h1>

// //       {orders.length === 0 ? (
// //         <div className="no-orders">
// //           <h3>No Orders Found</h3>
// //           <button onClick={() => navigate("/shop")}>Continue Shopping</button>
// //         </div>
// //       ) : (
// //         orders.map((order, idx) => {
// //           const orderId = order?._id || order?.id || `order-${idx}`;
// //           const returnStatus = getReturnStatus(order);
// //           const refundStatus = getRefundStatus(order);

// //           return (
// //             <div className="order-card" key={orderId}>
// //               <div className="order-row">
// //                 <span>Order ID</span>
// //                 <p>{orderId}</p>
// //               </div>

// //               <div className="order-row">
// //                 <span>Total Amount</span>
// //                 <p>₹ {order?.totalAmount ?? 0}</p>
// //               </div>

// //               <div className="order-row">
// //                 <span>Order Status</span>
// //                 <p>{order?.orderStatus || "PENDING"}</p>
// //               </div>

// //               <div className="order-row">
// //                 <span>Payment Status</span>
// //                 <p>{order?.paymentStatus || "PENDING"}</p>
// //               </div>

// //               {returnStatus && (
// //                 <div className="order-row">
// //                   <span>Return Status</span>
// //                   <p>{returnStatus}</p>
// //                 </div>
// //               )}

// //               {refundStatus && (
// //                 <div className="order-row">
// //                   <span>Refund Status</span>
// //                   <p>{refundStatus}</p>
// //                 </div>
// //               )}

// //               <div className="order-row">
// //                 <span>Items</span>
// //                 <p>{order?.orderItems?.length || 0}</p>
// //               </div>

// //               <div className="order-row">
// //                 <span>Date</span>
// //                 <p>
// //                   {order?.createdAt
// //                     ? new Date(order.createdAt).toLocaleDateString("en-IN")
// //                     : "N/A"}
// //                 </p>
// //               </div>

// //               <div className="order-actions">
// //                 <button
// //                   className="view-btn"
// //                   onClick={() => navigate(`/order/${orderId}`)}
// //                 >
// //                   View Details
// //                 </button>

// //                 <button
// //                   className="track-order-btn"
// //                   onClick={() => navigate(`/order/${orderId}/track`)}
// //                 >
// //                   🚚 Track Order
// //                 </button>

// //                 {(order?.orderStatus === "DELIVERED" ||
// //                   order?.orderStatus === "COMPLETED") && (
// //                   <button
// //                     className="return-order-btn"
// //                     onClick={() => openReturnModal(order)}
// //                     disabled={
// //                       !!returnStatus &&
// //                       !["REJECTED", "CANCELLED"].includes(returnStatus)
// //                     }
// //                   >
// //                     {returnStatus
// //                       ? `↩️ Return: ${returnStatus}`
// //                       : "↩️ Return Product"}
// //                   </button>
// //                 )}

// //                 {refundStatus && (
// //                   <button className="refund-status-btn" type="button">
// //                     💰 Refund: {refundStatus}
// //                   </button>
// //                 )}
// //               </div>

// //               {(returnStatus || refundStatus) && (
// //                 <div className="return-refund-timeline">
// //                   <h4>Return & Refund Progress</h4>
// //                   <div className="timeline">
// //                     <div
// //                       className={
// //                         returnStatus ? "timeline-step active" : "timeline-step"
// //                       }
// //                     >
// //                       <span>1</span>
// //                       <p>Return Requested</p>
// //                     </div>
// //                     <div
// //                       className={
// //                         [
// //                           "APPROVED",
// //                           "PICKUP_REQUESTED",
// //                           "PICKED_UP",
// //                           "RECEIVED",
// //                           "INSPECTED",
// //                           "COMPLETED",
// //                         ].includes(returnStatus)
// //                           ? "timeline-step active"
// //                           : "timeline-step"
// //                       }
// //                     >
// //                       <span>2</span>
// //                       <p>Return Approved</p>
// //                     </div>
// //                     <div
// //                       className={
// //                         [
// //                           "PICKUP_REQUESTED",
// //                           "PICKED_UP",
// //                           "RECEIVED",
// //                           "INSPECTED",
// //                           "COMPLETED",
// //                         ].includes(returnStatus)
// //                           ? "timeline-step active"
// //                           : "timeline-step"
// //                       }
// //                     >
// //                       <span>3</span>
// //                       <p>Pickup</p>
// //                     </div>
// //                     <div
// //                       className={
// //                         ["RECEIVED", "INSPECTED", "COMPLETED"].includes(
// //                           returnStatus,
// //                         )
// //                           ? "timeline-step active"
// //                           : "timeline-step"
// //                       }
// //                     >
// //                       <span>4</span>
// //                       <p>Product Received</p>
// //                     </div>
// //                     <div
// //                       className={
// //                         ["INSPECTED", "COMPLETED"].includes(returnStatus)
// //                           ? "timeline-step active"
// //                           : "timeline-step"
// //                       }
// //                     >
// //                       <span>5</span>
// //                       <p>Inspection</p>
// //                     </div>
// //                     <div
// //                       className={
// //                         refundStatus ? "timeline-step active" : "timeline-step"
// //                       }
// //                     >
// //                       <span>6</span>
// //                       <p>Refund</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}

// //               {/* PRODUCTS LIST */}
// //               {order?.orderItems?.length > 0 && (
// //                 <div className="order-products-review">
// //                   <h4>Products</h4>
// //                   {order.orderItems.map((item, index) => {
// //                     const prodId = String(extractProductId(item) || index);
// //                     return (
// //                       <div className="review-product-row" key={prodId}>
// //                         <div className="review-product-info">
// //                           <span className="review-product-name">
// //                             {item?.title ||
// //                               item?.product?.name ||
// //                               item?.productName ||
// //                               item?.name ||
// //                               "Product"}
// //                           </span>
// //                           <span className="review-product-quantity">
// //                             Qty: {item?.quantity || 1}
// //                           </span>
// //                         </div>
// //                         {(order?.orderStatus === "DELIVERED" ||
// //                           order?.orderStatus === "COMPLETED") && (
// //                           <button
// //                             type="button"
// //                             className="review-btn"
// //                             onClick={() => {
// //                               setReviewProduct(item?.product || item);
// //                               setReviewOrder(order);
// //                             }}
// //                           >
// //                             ⭐ Review Product
// //                           </button>
// //                         )}
// //                       </div>
// //                     );
// //                   })}
// //                 </div>
// //               )}
// //             </div>
// //           );
// //         })
// //       )}

// //       {/* RETURN MODAL */}
// //       {returningOrder && (
// //         <div className="return-modal-overlay" onClick={closeReturnModal}>
// //           <div className="return-modal" onClick={(e) => e.stopPropagation()}>
// //             <div className="return-modal-header">
// //               <h2>Return Product</h2>
// //               <button
// //                 type="button"
// //                 onClick={closeReturnModal}
// //                 disabled={returnLoading}
// //               >
// //                 ×
// //               </button>
// //             </div>

// //             <div className="return-modal-body">
// //               <p>
// //                 Order ID:{" "}
// //                 <strong>{returningOrder?._id || returningOrder?.id}</strong>
// //               </p>
// //               <p>
// //                 Total Amount:{" "}
// //                 <strong>₹ {returningOrder?.totalAmount ?? 0}</strong>
// //               </p>

// //               <label>Select Products</label>
// //               <div className="return-items">
// //                 {returningOrder?.orderItems?.map((item, index) => {
// //                   const prodId = String(extractProductId(item) || index);
// //                   return (
// //                     <label className="return-item" key={prodId}>
// //                       <input
// //                         type="checkbox"
// //                         checked={isItemSelected(item, index)}
// //                         onChange={() => toggleItem(item, index)}
// //                         disabled={returnLoading}
// //                       />
// //                       <div>
// //                         <strong>
// //                           {item?.title ||
// //                             item?.product?.name ||
// //                             item?.productName ||
// //                             item?.name ||
// //                             "Product"}
// //                         </strong>
// //                         <span>Qty: {item?.quantity || 1}</span>
// //                       </div>
// //                     </label>
// //                   );
// //                 })}
// //               </div>

// //               <label>Reason for Return</label>
// //               <select
// //                 value={returnReason}
// //                 onChange={(e) => setReturnReason(e.target.value)}
// //                 disabled={returnLoading}
// //               >
// //                 <option value="">Select Return Reason</option>
// //                 <option value="WRONG_PRODUCT">Wrong product received</option>
// //                 <option value="DAMAGED">Product damaged</option>
// //                 <option value="DEFECTIVE">Product is defective</option>
// //                 <option value="NOT_AS_EXPECTED">Product not as expected</option>
// //                 <option value="SIZE_ISSUE">Size or fit issue</option>
// //                 <option value="CHANGE_OF_MIND">Change of mind</option>
// //                 <option value="OTHER">Other</option>
// //               </select>

// //               {returnReason === "OTHER" && (
// //                 <textarea
// //                   value={otherReasonText}
// //                   onChange={(e) => setOtherReasonText(e.target.value)}
// //                   placeholder="Please describe your return reason..."
// //                   rows="4"
// //                   disabled={returnLoading}
// //                 />
// //               )}

// //               {returnMessage && (
// //                 <div className="return-message">{returnMessage}</div>
// //               )}

// //               <div className="return-modal-actions">
// //                 <button
// //                   type="button"
// //                   className="cancel-return-btn"
// //                   onClick={closeReturnModal}
// //                   disabled={returnLoading}
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="button"
// //                   className="submit-return-btn"
// //                   onClick={handleReturn}
// //                   disabled={returnLoading}
// //                 >
// //                   {returnLoading ? "Submitting..." : "Submit Return"}
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* REVIEW MODAL */}
// //       {reviewProduct && reviewOrder && (
// //         <ReviewModal
// //           product={reviewProduct}
// //           order={reviewOrder}
// //           onClose={() => {
// //             setReviewProduct(null);
// //             setReviewOrder(null);
// //           }}
// //           onSuccess={() => {
// //             setReviewProduct(null);
// //             setReviewOrder(null);
// //           }}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default MyOrders;



// import React, {
//   useEffect,
//   useState,
//   useCallback,
// } from "react";

// import {
//   useNavigate,
// } from "react-router-dom";

// import axios from "axios";

// import ReviewModal
//   from "../../../components/Reviews/ReviewModal";

// import {
//   getMyOrders,
// } from "../../../services/orderService";

// import "./MyOrders.css";


// // =====================================================
// // API BASE URL
// // =====================================================

// const API_BASE_URL =
//   import.meta.env.VITE_API_URL ||
//   "http://localhost:5000/api";


// // =====================================================
// // PAYMENT SUMMARY STORAGE KEY
// // =====================================================

// const getPaymentSummaryKey = (orderId) =>
//   `order_payment_summary_${orderId}`;


// // =====================================================
// // NUMBER HELPER
// // =====================================================

// const toNumber = (
//   value,
//   fallback = 0
// ) => {

//   const number = Number(value);

//   return Number.isFinite(number)
//     ? number
//     : fallback;
// };


// // =====================================================
// // ROUND MONEY
// // =====================================================

// const roundMoney = (value) => {

//   return Math.round(
//     (
//       toNumber(value) +
//       Number.EPSILON
//     ) * 100
//   ) / 100;

// };


// // =====================================================
// // MONEY FORMAT - INDIAN RUPEES
// // =====================================================

// const money = (value) => {

//   return toNumber(value)
//     .toLocaleString(
//       "en-IN",
//       {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       }
//     );

// };


// // =====================================================
// // STATUS FORMAT
// // =====================================================

// const formatStatus = (value) => {

//   if (!value) {

//     return "Pending";

//   }

//   return String(value)
//     .replace(/_/g, " ")
//     .toLowerCase()
//     .replace(
//       /\b\w/g,
//       (char) =>
//         char.toUpperCase()
//     );

// };


// // =====================================================
// // STATUS CLASS
// // =====================================================

// const getStatusClass = (value) => {

//   const status =
//     String(value || "")
//       .toUpperCase();

//   if (
//     status === "DELIVERED" ||
//     status === "COMPLETED" ||
//     status === "PAID" ||
//     status === "SUCCESS"
//   ) {

//     return "success";

//   }

//   if (
//     status === "CANCELLED" ||
//     status === "FAILED" ||
//     status === "REJECTED"
//   ) {

//     return "danger";

//   }

//   if (
//     status === "SHIPPED" ||
//     status === "OUT_FOR_DELIVERY" ||
//     status === "PROCESSING" ||
//     status === "CONFIRMED"
//   ) {

//     return "info";

//   }

//   return "pending";

// };


// // =====================================================
// // AUTH HEADERS
// // =====================================================

// const getAuthHeaders = () => {

//   const token =
//     localStorage.getItem("token") ||
//     localStorage.getItem("userToken") ||
//     localStorage.getItem("accessToken") ||
//     "";

//   return {

//     headers: {

//       Authorization:
//         token
//           ? `Bearer ${token}`
//           : "",

//       "Content-Type":
//         "application/json",

//     },

//   };

// };


// // =====================================================
// // EXTRACT PRODUCT ID
// // =====================================================

// const extractProductId = (item) => {

//   if (!item) {

//     return "";

//   }

//   if (
//     typeof item.product === "object" &&
//     item.product !== null
//   ) {

//     return (
//       item.product._id ||
//       item.product.id ||
//       ""
//     );

//   }

//   return (
//     item.product ||
//     item.productId ||
//     item._id ||
//     ""
//   );

// };


// // =====================================================
// // LOAD SAVED PAYMENT SUMMARY
// // =====================================================

// const getSavedPaymentSummary = (
//   orderId
// ) => {

//   if (!orderId) {

//     return null;

//   }

//   try {

//     const raw =
//       localStorage.getItem(
//         getPaymentSummaryKey(
//           orderId
//         )
//       );

//     if (!raw) {

//       return null;

//     }

//     const parsed =
//       JSON.parse(raw);

//     if (
//       !parsed ||
//       typeof parsed !== "object"
//     ) {

//       return null;

//     }

//     return parsed;

//   }
//   catch (error) {

//     console.error(
//       "PAYMENT SUMMARY STORAGE READ ERROR:",
//       error
//     );

//     return null;

//   }

// };


// // =====================================================
// // BUILD ORDER PAYMENT BREAKDOWN
// // =====================================================
// //
// // Priority:
// // 1. Exact paymentSummary saved during payment
// // 2. Values already saved in Order
// // 3. Calculate from orderItems
// //
// // This prevents MyOrders from showing only
// // product price.
// // =====================================================

// const getOrderBreakdown = (
//   order
// ) => {

//   const orderId =
//     order?._id ||
//     order?.id ||
//     order?.orderId ||
//     "";

//   const savedSummary =
//     getSavedPaymentSummary(
//       orderId
//     );


//   // ===================================================
//   // PRODUCT ITEMS
//   // ===================================================

//   const items =
//     Array.isArray(
//       order?.orderItems
//     )
//       ? order.orderItems
//       : [];


//   // ===================================================
//   // CALCULATE ITEM VALUES
//   // ===================================================

//   let calculatedOriginalSubtotal = 0;

//   let calculatedSellingSubtotal = 0;

//   let calculatedOfferDiscount = 0;


//   items.forEach((item) => {

//     const quantity =
//       Math.max(
//         toNumber(
//           item?.quantity,
//           1
//         ),
//         1
//       );


//     const price =
//       toNumber(
//         item?.price ??
//         item?.sellingPrice ??
//         item?.unitPrice,
//         0
//       );


//     const originalPrice =
//       toNumber(
//         item?.originalPrice,
//         price
//       );


//     calculatedOriginalSubtotal +=
//       originalPrice *
//       quantity;


//     calculatedSellingSubtotal +=
//       price *
//       quantity;


//     // -------------------------------------------------
//     // OFFER DISCOUNT
//     // -------------------------------------------------

//     const itemDiscount =
//       toNumber(
//         item?.discountAmount,
//         Math.max(
//           originalPrice -
//           price,
//           0
//         )
//       );


//     calculatedOfferDiscount +=
//       Math.max(
//         itemDiscount,
//         0
//       ) * quantity;

//   });


//   // ===================================================
//   // PRODUCT SUBTOTAL
//   // ===================================================
//   //
//   // Payment Summary has highest priority.
//   //
//   // Then backend subtotal fields.
//   //
//   // Then original item subtotal.
//   // ===================================================

//   const productSubtotal =
//     roundMoney(
//       savedSummary?.subtotal ??
//       order?.subtotal ??
//       order?.subTotal ??
//       order?.itemsSubtotal ??
//       order?.productSubtotal ??
//       calculatedOriginalSubtotal ??
//       calculatedSellingSubtotal
//     );


//   // ===================================================
//   // OFFER DISCOUNT
//   // ===================================================

//   const offerDiscount =
//     roundMoney(
//       savedSummary?.offerDiscount ??
//       savedSummary?.productDiscount ??
//       order?.offerDiscount ??
//       order?.productDiscount ??
//       order?.discountFromOffers ??
//       calculatedOfferDiscount
//     );


//   // ===================================================
//   // COUPON DISCOUNT
//   // ===================================================

//   const couponDiscount =
//     roundMoney(
//       savedSummary?.couponDiscount ??
//       savedSummary?.couponDiscountAmount ??
//       order?.couponDiscount ??
//       order?.couponDiscountAmount ??
//       order?.coupon?.discountAmount ??
//       0
//     );


//   // ===================================================
//   // TOTAL DISCOUNT
//   // ===================================================

//   const totalDiscount =
//     Math.min(
//       Math.max(
//         offerDiscount +
//         couponDiscount,
//         0
//       ),
//       Math.max(
//         productSubtotal,
//         0
//       )
//     );


//   // ===================================================
//   // TAXABLE AMOUNT
//   // ===================================================

//   const calculatedTaxableAmount =
//     Math.max(
//       productSubtotal -
//       totalDiscount,
//       0
//     );


//   const taxableAmount =
//     roundMoney(
//       savedSummary?.taxableAmount ??
//       order?.taxableAmount ??
//       calculatedTaxableAmount
//     );


//   // ===================================================
//   // GST PERCENTAGE
//   // ===================================================

//   const gstPercentage =
//     Math.max(
//       toNumber(
//         savedSummary?.gstPercentage ??
//         order?.gstPercentage ??
//         order?.gstRate ??
//         18,
//         18
//       ),
//       0
//     );


//   // ===================================================
//   // GST AMOUNT
//   // ===================================================

//   const calculatedGST =
//     roundMoney(
//       taxableAmount *
//       gstPercentage /
//       100
//     );


//   const gstAmount =
//     Math.max(
//       roundMoney(
//         savedSummary?.gstAmount ??
//         order?.gstAmount ??
//         order?.gst ??
//         order?.totalGST ??
//         order?.taxAmount ??
//         order?.tax ??
//         order?.gstDetails?.totalGST ??
//         order?.gstDetails?.gstAmount ??
//         calculatedGST
//       ),
//       0
//     );


//   // ===================================================
//   // SHIPPING
//   // ===================================================

//   const shippingCharge =
//     Math.max(
//       roundMoney(
//         savedSummary?.shippingCharge ??
//         savedSummary?.shipping ??
//         order?.shippingCharge ??
//         order?.shippingAmount ??
//         order?.shippingCost ??
//         order?.shippingCharges ??
//         order?.deliveryCharge ??
//         order?.deliveryCharges ??
//         order?.shipping?.amount ??
//         0
//       ),
//       0
//     );


//   // ===================================================
//   // OTHER CHARGES
//   // ===================================================

//   const otherCharges =
//     Math.max(
//       roundMoney(
//         savedSummary?.otherCharges ??
//         order?.otherCharges ??
//         order?.additionalCharges ??
//         order?.handlingCharges ??
//         0
//       ),
//       0
//     );


//   // ===================================================
//   // CALCULATED FINAL TOTAL
//   // ===================================================

//   const calculatedFinalAmount =
//     Math.max(
//       roundMoney(
//         taxableAmount +
//         shippingCharge +
//         gstAmount +
//         otherCharges
//       ),
//       0
//     );


//   // ===================================================
//   // PAYMENT AMOUNT
//   // ===================================================
//   //
//   // If the actual payment amount exists, use it
//   // only when it is explicitly available.
//   // ===================================================

//   const paymentAmount =
//     toNumber(
//       savedSummary?.total ??
//       savedSummary?.finalAmount ??
//       savedSummary?.payableAmount ??
//       order?.paidAmount ??
//       order?.paymentAmount ??
//       0
//     );


//   // ===================================================
//   // FINAL AMOUNT
//   // ===================================================
//   //
//   // IMPORTANT:
//   //
//   // Do NOT blindly use order.finalAmount because
//   // current backend may contain product/coupon amount
//   // without the payment page GST/shipping calculation.
//   //
//   // Exact saved payment summary gets first priority.
//   // ===================================================

//   let finalAmount =
//     calculatedFinalAmount;


//   if (
//     savedSummary?.total !==
//       undefined &&
//     savedSummary?.total !==
//       null &&
//     Number.isFinite(
//       Number(
//         savedSummary.total
//       )
//     )
//   ) {

//     finalAmount =
//       Math.max(
//         roundMoney(
//           Number(
//             savedSummary.total
//           )
//         ),
//         0
//       );

//   }
//   else if (
//     savedSummary?.finalAmount !==
//       undefined &&
//     savedSummary?.finalAmount !==
//       null &&
//     Number.isFinite(
//       Number(
//         savedSummary.finalAmount
//       )
//     )
//   ) {

//     finalAmount =
//       Math.max(
//         roundMoney(
//           Number(
//             savedSummary.finalAmount
//           )
//         ),
//         0
//       );

//   }
//   else if (
//     paymentAmount > 0
//   ) {

//     finalAmount =
//       roundMoney(
//         paymentAmount
//       );

//   }
//   else if (
//     order?.grandTotal !==
//       undefined
//   ) {

//     finalAmount =
//       roundMoney(
//         order.grandTotal
//       );

//   }
//   else if (
//     order?.payableAmount !==
//       undefined
//   ) {

//     finalAmount =
//       roundMoney(
//         order.payableAmount
//       );

//   }


//   // ===================================================
//   // COUPON CODE
//   // ===================================================

//   const couponCode =
//     order?.couponCode ||
//     order?.coupon?.code ||
//     savedSummary?.couponCode ||
//     "";


//   // ===================================================
//   // PAYMENT METHOD
//   // ===================================================

//   const paymentMethod =
//     order?.paymentMethod ||
//     order?.payment?.paymentMethod ||
//     order?.payment?.method ||
//     savedSummary?.paymentMethod ||
//     "ONLINE";


//   // ===================================================
//   // PAYMENT STATUS
//   // ===================================================

//   const paymentStatus =
//     order?.paymentStatus ||
//     order?.payment?.status ||
//     savedSummary?.paymentStatus ||
//     "PENDING";


//   return {

//     productSubtotal,

//     offerDiscount,

//     couponDiscount,

//     totalDiscount,

//     taxableAmount,

//     gstPercentage,

//     gstAmount,

//     shippingCharge,

//     otherCharges,

//     finalAmount,

//     couponCode,

//     paymentMethod,

//     paymentStatus,

//     hasSavedPaymentSummary:
//       !!savedSummary,

//   };

// };


// // =====================================================
// // COMPONENT
// // =====================================================

// const MyOrders = () => {

//   const navigate =
//     useNavigate();


//   // ===================================================
//   // ORDERS
//   // ===================================================

//   const [
//     orders,
//     setOrders
//   ] = useState([]);


//   const [
//     loading,
//     setLoading
//   ] = useState(true);


//   // ===================================================
//   // RETURN
//   // ===================================================

//   const [
//     returningOrder,
//     setReturningOrder
//   ] = useState(null);


//   const [
//     returnReason,
//     setReturnReason
//   ] = useState("");


//   const [
//     otherReasonText,
//     setOtherReasonText
//   ] = useState("");


//   const [
//     selectedItems,
//     setSelectedItems
//   ] = useState([]);


//   const [
//     returnLoading,
//     setReturnLoading
//   ] = useState(false);


//   const [
//     returnMessage,
//     setReturnMessage
//   ] = useState("");


//   // ===================================================
//   // RETURN / REFUND DETAILS
//   // ===================================================

//   const [
//     returnDetails,
//     setReturnDetails
//   ] = useState({});


//   const [
//     refundDetails,
//     setRefundDetails
//   ] = useState({});


//   // ===================================================
//   // REVIEW
//   // ===================================================

//   const [
//     reviewProduct,
//     setReviewProduct
//   ] = useState(null);


//   const [
//     reviewOrder,
//     setReviewOrder
//   ] = useState(null);


//   // ===================================================
//   // LOAD RETURN / REFUND
//   // ===================================================

//   const loadReturnRefundDetails =
//     async (orderList) => {

//       if (
//         !Array.isArray(orderList) ||
//         orderList.length === 0
//       ) {

//         return;

//       }


//       const returns = {};

//       const refunds = {};


//       await Promise.all(

//         orderList.map(
//           async (order) => {

//             const orderId =
//               order?._id ||
//               order?.id;


//             if (!orderId) {

//               return;

//             }


//             // =========================================
//             // RETURN
//             // =========================================

//             try {

//               const response =
//                 await axios.get(
//                   `${API_BASE_URL}/returns/order/${orderId}`,
//                   getAuthHeaders()
//                 );


//               const data =
//                 response?.data?.returns ||
//                 response?.data?.return ||
//                 response?.data?.data ||
//                 response?.data;


//               if (
//                 Array.isArray(data) &&
//                 data.length > 0
//               ) {

//                 returns[orderId] =
//                   data[
//                     data.length - 1
//                   ];

//               }
//               else if (
//                 data &&
//                 typeof data === "object" &&
//                 data._id
//               ) {

//                 returns[orderId] =
//                   data;

//               }

//             }
//             catch (error) {

//               console.warn(
//                 "RETURN DETAILS LOAD ERROR:",
//                 orderId,
//                 error?.response?.data ||
//                 error?.message
//               );

//             }


//             // =========================================
//             // REFUND
//             // =========================================

//             try {

//               const response =
//                 await axios.get(
//                   `${API_BASE_URL}/refunds/order/${orderId}`,
//                   getAuthHeaders()
//                 );


//               const data =
//                 response?.data?.refunds ||
//                 response?.data?.refund ||
//                 response?.data?.data ||
//                 response?.data;


//               if (
//                 Array.isArray(data) &&
//                 data.length > 0
//               ) {

//                 refunds[orderId] =
//                   data[
//                     data.length - 1
//                   ];

//               }
//               else if (
//                 data &&
//                 typeof data === "object" &&
//                 data._id
//               ) {

//                 refunds[orderId] =
//                   data;

//               }

//             }
//             catch (error) {

//               console.warn(
//                 "REFUND DETAILS LOAD ERROR:",
//                 orderId,
//                 error?.response?.data ||
//                 error?.message
//               );

//             }

//           }
//         )

//       );


//       setReturnDetails(
//         returns
//       );

//       setRefundDetails(
//         refunds
//       );

//     };


//   // ===================================================
//   // FETCH ORDERS
//   // ===================================================

//   const fetchOrders =
//     useCallback(
//       async () => {

//         try {

//           setLoading(true);


//           const response =
//             await getMyOrders();


//           const orderData =
//             response?.orders ||
//             response?.data?.orders ||
//             response?.data?.data ||
//             response?.data ||
//             (
//               Array.isArray(response)
//                 ? response
//                 : []
//             );


//           const validOrders =
//             Array.isArray(
//               orderData
//             )
//               ? orderData
//               : [];


//           setOrders(
//             validOrders
//           );


//           await loadReturnRefundDetails(
//             validOrders
//           );

//         }
//         catch (error) {

//           console.error(
//             "MY ORDERS FETCH ERROR:",
//             error
//           );

//           setOrders([]);

//         }
//         finally {

//           setLoading(false);

//         }

//       },
//       []
//     );


//   // ===================================================
//   // INITIAL LOAD
//   // ===================================================

//   useEffect(() => {

//     fetchOrders();

//   }, [
//     fetchOrders
//   ]);


//   // ===================================================
//   // RETURN MODAL
//   // ===================================================

//   const openReturnModal =
//     (order) => {

//       if (
//         order?.orderStatus !==
//           "DELIVERED" &&
//         order?.orderStatus !==
//           "COMPLETED"
//       ) {

//         alert(
//           "Only delivered orders can be returned."
//         );

//         return;

//       }


//       const orderId =
//         order?._id ||
//         order?.id;


//       const existing =
//         orderId
//           ? returnDetails[orderId]
//           : null;


//       if (
//         existing &&
//         existing._id &&
//         ![
//           "REJECTED",
//           "CANCELLED"
//         ].includes(
//           existing.status
//         )
//       ) {

//         alert(
//           "Return request already exists for this order."
//         );

//         return;

//       }


//       setReturningOrder(
//         order
//       );

//       setReturnReason("");

//       setOtherReasonText("");

//       setSelectedItems([]);

//       setReturnMessage("");

//     };


//   // ===================================================
//   // CLOSE RETURN MODAL
//   // ===================================================

//   const closeReturnModal =
//     () => {

//       if (
//         returnLoading
//       ) {

//         return;

//       }


//       setReturningOrder(
//         null
//       );

//       setReturnReason("");

//       setOtherReasonText("");

//       setSelectedItems([]);

//       setReturnMessage("");

//     };


//   // ===================================================
//   // TOGGLE ITEM
//   // ===================================================

//   const toggleItem =
//     (
//       item,
//       index
//     ) => {

//       const productId =
//         String(
//           extractProductId(
//             item
//           ) ||
//           index
//         );


//       setSelectedItems(
//         (previous) => {

//           const exists =
//             previous.find(
//               (selected) =>
//                 selected.itemId ===
//                 productId
//             );


//           if (exists) {

//             return previous.filter(
//               (selected) =>
//                 selected.itemId !==
//                 productId
//             );

//           }


//           return [

//             ...previous,

//             {

//               itemId:
//                 item?.product?._id ||
//                 item?.product ||
//                 item?._id,

//               productId:
//                 item?.product?._id ||
//                 item?.product ||
//                 item?._id,

//               productName:
//                 item?.title ||
//                 item?.product?.name ||
//                 item?.productName ||
//                 item?.name ||
//                 "Product",

//               quantity:
//                 Number(
//                   item?.quantity
//                 ) || 1,

//             },

//           ];

//         }
//       );

//     };


//   // ===================================================
//   // IS ITEM SELECTED
//   // ===================================================

//   const isItemSelected =
//     (
//       item,
//       index
//     ) => {

//       const productId =
//         String(
//           extractProductId(
//             item
//           ) ||
//           index
//         );


//       return selectedItems.some(
//         (selected) =>
//           selected.itemId ===
//           productId
//       );

//     };


//   // ===================================================
//   // SUBMIT RETURN
//   // ===================================================

//   const handleReturn =
//     async () => {

//       const orderId =
//         returningOrder?._id ||
//         returningOrder?.id;


//       if (!orderId) {

//         setReturnMessage(
//           "Order ID not found."
//         );

//         return;

//       }


//       if (
//         !returnReason.trim()
//       ) {

//         setReturnMessage(
//           "Please select a return reason."
//         );

//         return;

//       }


//       if (
//         !selectedItems.length
//       ) {

//         setReturnMessage(
//           "Please select at least one product."
//         );

//         return;

//       }


//       if (
//         returnReason ===
//           "OTHER" &&
//         !otherReasonText.trim()
//       ) {

//         setReturnMessage(
//           "Please describe your return reason."
//         );

//         return;

//       }


//       try {

//         setReturnLoading(true);

//         setReturnMessage("");


//         const finalNote =
//           returnReason ===
//             "OTHER"
//             ? otherReasonText.trim()
//             : returnReason;


//         const payload = {

//           orderId:
//             String(orderId),

//           pickupRequired:
//             true,

//           customerNote:
//             finalNote,

//           items:
//             selectedItems.map(
//               (item) => ({

//                 productId:
//                   String(
//                     item.productId
//                   ),

//                 quantity:
//                   Number(
//                     item.quantity
//                   ) || 1,

//                 reason:
//                   returnReason,

//                 reasonNote:
//                   finalNote,

//               })
//             ),

//         };


//         const response =
//           await axios.post(
//             `${API_BASE_URL}/returns`,
//             payload,
//             getAuthHeaders()
//           );


//         setReturnMessage(
//           response?.data?.message ||
//           "Return request created successfully!"
//         );


//         setTimeout(
//           async () => {

//             closeReturnModal();

//             await fetchOrders();

//           },
//           1200
//         );

//       }
//       catch (error) {

//         console.error(
//           "RETURN SUBMIT ERROR:",
//           error
//         );


//         setReturnMessage(
//           error?.response?.data?.message ||
//           error?.message ||
//           "Failed to create return request."
//         );

//       }
//       finally {

//         setReturnLoading(
//           false
//         );

//       }

//     };


//   // ===================================================
//   // RETURN STATUS
//   // ===================================================

//   const getReturnStatus =
//     (order) => {

//       const orderId =
//         order?._id ||
//         order?.id;


//       const returnData =
//         orderId
//           ? returnDetails[orderId]
//           : null;


//       return (
//         returnData?.status ||
//         order?.returnStatus ||
//         order?.return?.status ||
//         null
//       );

//     };


//   // ===================================================
//   // REFUND STATUS
//   // ===================================================

//   const getRefundStatus =
//     (order) => {

//       const orderId =
//         order?._id ||
//         order?.id;


//       const refundData =
//         orderId
//           ? refundDetails[orderId]
//           : null;


//       return (
//         refundData?.status ||
//         order?.refundStatus ||
//         order?.refund?.status ||
//         null
//       );

//     };


//   // ===================================================
//   // LOADING
//   // ===================================================

//   if (loading) {

//     return (

//       <div className="myorders-loading">

//         Loading Orders...

//       </div>

//     );

//   }


//   // ===================================================
//   // UI
//   // ===================================================

//   return (

//     <div className="myorders-container">

//       <h1 className="myorders-title">
//         My Orders
//       </h1>


//       {orders.length === 0 ? (

//         <div className="no-orders">

//           <h3>
//             No Orders Found
//           </h3>

//           <button
//             onClick={() =>
//               navigate("/shop")
//             }
//           >
//             Continue Shopping
//           </button>

//         </div>

//       ) : (

//         orders.map(
//           (
//             order,
//             index
//           ) => {

//             const orderId =
//               order?._id ||
//               order?.id ||
//               order?.orderId ||
//               `order-${index}`;


//             const returnStatus =
//               getReturnStatus(
//                 order
//               );


//             const refundStatus =
//               getRefundStatus(
//                 order
//               );


//             const breakdown =
//               getOrderBreakdown(
//                 order
//               );


//             return (

//               <div
//                 className="order-card"
//                 key={orderId}
//               >

//                 {/* =====================================
//                     ORDER ID
//                 ====================================== */}

//                 <div className="order-row">

//                   <span>
//                     Order ID
//                   </span>

//                   <p>
//                     {orderId}
//                   </p>

//                 </div>


//                 {/* =====================================
//                     PRODUCT SUBTOTAL
//                 ====================================== */}

//                 <div className="order-row">

//                   <span>
//                     Product Subtotal
//                   </span>

//                   <p>
//                     ₹{" "}
//                     {money(
//                       breakdown.productSubtotal
//                     )}
//                   </p>

//                 </div>


//                 {/* =====================================
//                     OFFER DISCOUNT
//                 ====================================== */}

//                 {breakdown.offerDiscount > 0 && (

//                   <div
//                     className="order-row"
//                     style={{
//                       color: "#198754",
//                     }}
//                   >

//                     <span>
//                       Offer Discount
//                     </span>

//                     <p>
//                       - ₹{" "}
//                       {money(
//                         breakdown.offerDiscount
//                       )}
//                     </p>

//                   </div>

//                 )}


//                 {/* =====================================
//                     COUPON DISCOUNT
//                 ====================================== */}

//                 {breakdown.couponDiscount > 0 && (

//                   <div
//                     className="order-row"
//                     style={{
//                       color: "#198754",
//                     }}
//                   >

//                     <span>

//                       Coupon Discount

//                       {breakdown.couponCode && (

//                         <small
//                           style={{
//                             display: "block",
//                             fontWeight: 400,
//                             fontSize: "11px",
//                             marginTop: "2px",
//                           }}
//                         >
//                           {breakdown.couponCode}
//                         </small>

//                       )}

//                     </span>

//                     <p>
//                       - ₹{" "}
//                       {money(
//                         breakdown.couponDiscount
//                       )}
//                     </p>

//                   </div>

//                 )}


//                 {/* =====================================
//                     TAXABLE AMOUNT
//                 ====================================== */}

//                 <div className="order-row">

//                   <span>
//                     Taxable Amount
//                   </span>

//                   <p>
//                     ₹{" "}
//                     {money(
//                       breakdown.taxableAmount
//                     )}
//                   </p>

//                 </div>


//                 {/* =====================================
//                     GST
//                 ====================================== */}

//                 <div className="order-row">

//                   <span>
//                     GST (
//                     {money(
//                       breakdown.gstPercentage
//                     )}
//                     %)
//                   </span>

//                   <p>
//                     ₹{" "}
//                     {money(
//                       breakdown.gstAmount
//                     )}
//                   </p>

//                 </div>


//                 {/* =====================================
//                     SHIPPING
//                 ====================================== */}

//                 <div className="order-row">

//                   <span>
//                     Shipping
//                   </span>

//                   <p>

//                     {breakdown.shippingCharge >
//                     0

//                       ? `₹ ${money(
//                           breakdown.shippingCharge
//                         )}`

//                       : "Free"}

//                   </p>

//                 </div>


//                 {/* =====================================
//                     OTHER CHARGES
//                 ====================================== */}

//                 {breakdown.otherCharges > 0 && (

//                   <div className="order-row">

//                     <span>
//                       Other Charges
//                     </span>

//                     <p>
//                       ₹{" "}
//                       {money(
//                         breakdown.otherCharges
//                       )}
//                     </p>

//                   </div>

//                 )}


//                 {/* =====================================
//                     FINAL TOTAL
//                 ====================================== */}

//                 <div
//                   className="order-row"
//                   style={{
//                     borderTop:
//                       "1px solid #ddd",
//                     marginTop: "10px",
//                     paddingTop: "12px",
//                     fontSize: "16px",
//                     fontWeight: 700,
//                   }}
//                 >

//                   <span>
//                     Total Amount
//                   </span>

//                   <p>
//                     ₹{" "}
//                     {money(
//                       breakdown.finalAmount
//                     )}
//                   </p>

//                 </div>


//                 {/* =====================================
//                     PAYMENT METHOD
//                 ====================================== */}

//                 <div className="order-row">

//                   <span>
//                     Payment Method
//                   </span>

//                   <p>
//                     {formatStatus(
//                       breakdown.paymentMethod
//                     )}
//                   </p>

//                 </div>


//                 {/* =====================================
//                     PAYMENT STATUS
//                 ====================================== */}

//                 <div className="order-row">

//                   <span>
//                     Payment Status
//                   </span>

//                   <p>

//                     <span
//                       className={`order-status-badge ${getStatusClass(
//                         breakdown.paymentStatus
//                       )}`}
//                     >
//                       {formatStatus(
//                         breakdown.paymentStatus
//                       )}
//                     </span>

//                   </p>

//                 </div>


//                 {/* =====================================
//                     ORDER STATUS
//                 ====================================== */}

//                 <div className="order-row">

//                   <span>
//                     Order Status
//                   </span>

//                   <p>

//                     <span
//                       className={`order-status-badge ${getStatusClass(
//                         order?.orderStatus
//                       )}`}
//                     >
//                       {formatStatus(
//                         order?.orderStatus ||
//                         "PENDING"
//                       )}
//                     </span>

//                   </p>

//                 </div>


//                 {/* =====================================
//                     RETURN STATUS
//                 ====================================== */}

//                 {returnStatus && (

//                   <div className="order-row">

//                     <span>
//                       Return Status
//                     </span>

//                     <p>
//                       {formatStatus(
//                         returnStatus
//                       )}
//                     </p>

//                   </div>

//                 )}


//                 {/* =====================================
//                     REFUND STATUS
//                 ====================================== */}

//                 {refundStatus && (

//                   <div className="order-row">

//                     <span>
//                       Refund Status
//                     </span>

//                     <p>
//                       {formatStatus(
//                         refundStatus
//                       )}
//                     </p>

//                   </div>

//                 )}


//                 {/* =====================================
//                     ITEMS
//                 ====================================== */}

//                 <div className="order-row">

//                   <span>
//                     Items
//                   </span>

//                   <p>
//                     {
//                       order?.orderItems
//                         ?.length || 0
//                     }
//                   </p>

//                 </div>


//                 {/* =====================================
//                     DATE
//                 ====================================== */}

//                 <div className="order-row">

//                   <span>
//                     Date
//                   </span>

//                   <p>

//                     {order?.createdAt

//                       ? new Date(
//                           order.createdAt
//                         ).toLocaleDateString(
//                           "en-IN"
//                         )

//                       : "N/A"}

//                   </p>

//                 </div>


//                 {/* =====================================
//                     ACTIONS
//                 ====================================== */}

//                 <div className="order-actions">

//                   <button
//                     className="view-btn"
//                     onClick={() =>
//                       navigate(
//                         `/order/${orderId}`
//                       )
//                     }
//                   >
//                     View Details
//                   </button>


//                   <button
//                     className="track-order-btn"
//                     onClick={() =>
//                       navigate(
//                         `/order/${orderId}/track`
//                       )
//                     }
//                   >
//                     🚚 Track Order
//                   </button>


//                   {(order?.orderStatus ===
//                     "DELIVERED" ||
//                     order?.orderStatus ===
//                       "COMPLETED") && (

//                     <button
//                       className="return-order-btn"
//                       onClick={() =>
//                         openReturnModal(
//                           order
//                         )
//                       }
//                       disabled={
//                         !!returnStatus &&
//                         ![
//                           "REJECTED",
//                           "CANCELLED",
//                         ].includes(
//                           returnStatus
//                         )
//                       }
//                     >

//                       {returnStatus

//                         ? `↩️ Return: ${formatStatus(
//                             returnStatus
//                           )}`

//                         : "↩️ Return Product"}

//                     </button>

//                   )}


//                   {refundStatus && (

//                     <button
//                       className="refund-status-btn"
//                       type="button"
//                     >
//                       💰 Refund:{" "}
//                       {formatStatus(
//                         refundStatus
//                       )}
//                     </button>

//                   )}

//                 </div>


//                 {/* =====================================
//                     RETURN / REFUND TIMELINE
//                 ====================================== */}

//                 {(returnStatus ||
//                   refundStatus) && (

//                   <div className="return-refund-timeline">

//                     <h4>
//                       Return & Refund Progress
//                     </h4>


//                     <div className="timeline">

//                       <div
//                         className={
//                           returnStatus
//                             ? "timeline-step active"
//                             : "timeline-step"
//                         }
//                       >
//                         <span>1</span>
//                         <p>
//                           Return Requested
//                         </p>
//                       </div>


//                       <div
//                         className={
//                           [
//                             "APPROVED",
//                             "PICKUP_REQUESTED",
//                             "PICKED_UP",
//                             "RECEIVED",
//                             "INSPECTED",
//                             "COMPLETED",
//                           ].includes(
//                             returnStatus
//                           )
//                             ? "timeline-step active"
//                             : "timeline-step"
//                         }
//                       >
//                         <span>2</span>
//                         <p>
//                           Return Approved
//                         </p>
//                       </div>


//                       <div
//                         className={
//                           [
//                             "PICKUP_REQUESTED",
//                             "PICKED_UP",
//                             "RECEIVED",
//                             "INSPECTED",
//                             "COMPLETED",
//                           ].includes(
//                             returnStatus
//                           )
//                             ? "timeline-step active"
//                             : "timeline-step"
//                         }
//                       >
//                         <span>3</span>
//                         <p>
//                           Pickup
//                         </p>
//                       </div>


//                       <div
//                         className={
//                           [
//                             "RECEIVED",
//                             "INSPECTED",
//                             "COMPLETED",
//                           ].includes(
//                             returnStatus
//                           )
//                             ? "timeline-step active"
//                             : "timeline-step"
//                         }
//                       >
//                         <span>4</span>
//                         <p>
//                           Product Received
//                         </p>
//                       </div>


//                       <div
//                         className={
//                           [
//                             "INSPECTED",
//                             "COMPLETED",
//                           ].includes(
//                             returnStatus
//                           )
//                             ? "timeline-step active"
//                             : "timeline-step"
//                         }
//                       >
//                         <span>5</span>
//                         <p>
//                           Inspection
//                         </p>
//                       </div>


//                       <div
//                         className={
//                           refundStatus
//                             ? "timeline-step active"
//                             : "timeline-step"
//                         }
//                       >
//                         <span>6</span>
//                         <p>
//                           Refund
//                         </p>
//                       </div>

//                     </div>

//                   </div>

//                 )}


//                 {/* =====================================
//                     PRODUCTS
//                 ====================================== */}

//                 {order?.orderItems?.length > 0 && (

//                   <div className="order-products-review">

//                     <h4>
//                       Products
//                     </h4>


//                     {order.orderItems.map(
//                       (
//                         item,
//                         itemIndex
//                       ) => {

//                         const productId =
//                           String(
//                             extractProductId(
//                               item
//                             ) ||
//                             itemIndex
//                           );


//                         const quantity =
//                           Number(
//                             item?.quantity
//                           ) || 1;


//                         const itemPrice =
//                           toNumber(
//                             item?.price,
//                             0
//                           );


//                         return (

//                           <div
//                             className="review-product-row"
//                             key={productId}
//                           >

//                             <div className="review-product-info">

//                               <span className="review-product-name">

//                                 {item?.title ||
//                                   item?.product?.name ||
//                                   item?.productName ||
//                                   item?.name ||
//                                   "Product"}

//                               </span>


//                               <span className="review-product-quantity">

//                                 Qty:{" "}
//                                 {quantity}

//                                 {" • "}

//                                 ₹{" "}
//                                 {money(
//                                   itemPrice *
//                                   quantity
//                                 )}

//                               </span>

//                             </div>


//                             {(order?.orderStatus ===
//                               "DELIVERED" ||
//                               order?.orderStatus ===
//                                 "COMPLETED") && (

//                               <button
//                                 type="button"
//                                 className="review-btn"
//                                 onClick={() => {

//                                   setReviewProduct(
//                                     item?.product ||
//                                     item
//                                   );

//                                   setReviewOrder(
//                                     order
//                                   );

//                                 }}
//                               >
//                                 ⭐ Review Product
//                               </button>

//                             )}

//                           </div>

//                         );

//                       }
//                     )}

//                   </div>

//                 )}

//               </div>

//             );

//           }
//         )

//       )}


//       {/* =================================================
//           RETURN MODAL
//       ================================================= */}

//       {returningOrder && (

//         <div
//           className="return-modal-overlay"
//           onClick={
//             closeReturnModal
//           }
//         >

//           <div
//             className="return-modal"
//             onClick={(event) =>
//               event.stopPropagation()
//             }
//           >

//             <div className="return-modal-header">

//               <h2>
//                 Return Product
//               </h2>


//               <button
//                 type="button"
//                 onClick={
//                   closeReturnModal
//                 }
//                 disabled={
//                   returnLoading
//                 }
//               >
//                 ×
//               </button>

//             </div>


//             <div className="return-modal-body">

//               <p>

//                 Order ID:{" "}

//                 <strong>
//                   {
//                     returningOrder?._id ||
//                     returningOrder?.id
//                   }
//                 </strong>

//               </p>


//               <p>

//                 Total Amount:{" "}

//                 <strong>

//                   ₹{" "}
//                   {money(
//                     getOrderBreakdown(
//                       returningOrder
//                     ).finalAmount
//                   )}

//                 </strong>

//               </p>


//               <label>
//                 Select Products
//               </label>


//               <div className="return-items">

//                 {returningOrder?.orderItems?.map(
//                   (
//                     item,
//                     index
//                   ) => {

//                     const productId =
//                       String(
//                         extractProductId(
//                           item
//                         ) ||
//                         index
//                       );


//                     return (

//                       <label
//                         className="return-item"
//                         key={productId}
//                       >

//                         <input
//                           type="checkbox"
//                           checked={
//                             isItemSelected(
//                               item,
//                               index
//                             )
//                           }
//                           onChange={() =>
//                             toggleItem(
//                               item,
//                               index
//                             )
//                           }
//                           disabled={
//                             returnLoading
//                           }
//                         />


//                         <div>

//                           <strong>

//                             {item?.title ||
//                               item?.product?.name ||
//                               item?.productName ||
//                               item?.name ||
//                               "Product"}

//                           </strong>


//                           <span>

//                             Qty:{" "}
//                             {
//                               item?.quantity ||
//                               1
//                             }

//                           </span>

//                         </div>

//                       </label>

//                     );

//                   }
//                 )}

//               </div>


//               <label>
//                 Reason for Return
//               </label>


//               <select
//                 value={
//                   returnReason
//                 }
//                 onChange={(event) =>
//                   setReturnReason(
//                     event.target.value
//                   )
//                 }
//                 disabled={
//                   returnLoading
//                 }
//               >

//                 <option value="">
//                   Select Return Reason
//                 </option>

//                 <option value="WRONG_PRODUCT">
//                   Wrong product received
//                 </option>

//                 <option value="DAMAGED">
//                   Product damaged
//                 </option>

//                 <option value="DEFECTIVE">
//                   Product is defective
//                 </option>

//                 <option value="NOT_AS_EXPECTED">
//                   Product not as expected
//                 </option>

//                 <option value="SIZE_ISSUE">
//                   Size or fit issue
//                 </option>

//                 <option value="CHANGE_OF_MIND">
//                   Change of mind
//                 </option>

//                 <option value="OTHER">
//                   Other
//                 </option>

//               </select>


//               {returnReason ===
//                 "OTHER" && (

//                 <textarea
//                   value={
//                     otherReasonText
//                   }
//                   onChange={(event) =>
//                     setOtherReasonText(
//                       event.target.value
//                     )
//                   }
//                   placeholder="Please describe your return reason..."
//                   rows="4"
//                   disabled={
//                     returnLoading
//                   }
//                 />

//               )}


//               {returnMessage && (

//                 <div className="return-message">

//                   {returnMessage}

//                 </div>

//               )}


//               <div className="return-modal-actions">

//                 <button
//                   type="button"
//                   className="cancel-return-btn"
//                   onClick={
//                     closeReturnModal
//                   }
//                   disabled={
//                     returnLoading
//                   }
//                 >
//                   Cancel
//                 </button>


//                 <button
//                   type="button"
//                   className="submit-return-btn"
//                   onClick={
//                     handleReturn
//                   }
//                   disabled={
//                     returnLoading
//                   }
//                 >

//                   {returnLoading
//                     ? "Submitting..."
//                     : "Submit Return"}

//                 </button>

//               </div>

//             </div>

//           </div>

//         </div>

//       )}


//       {/* =================================================
//           REVIEW MODAL
//       ================================================= */}

//       {reviewProduct &&
//         reviewOrder && (

//         <ReviewModal
//           product={
//             reviewProduct
//           }
//           order={
//             reviewOrder
//           }
//           onClose={() => {

//             setReviewProduct(
//               null
//             );

//             setReviewOrder(
//               null
//             );

//           }}
//           onSuccess={() => {

//             setReviewProduct(
//               null
//             );

//             setReviewOrder(
//               null
//             );

//           }}
//         />

//       )}

//     </div>

//   );

// };


// export default MyOrders;


import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import ReviewModal
  from "../../../components/Reviews/ReviewModal";

import {
  getMyOrders,
} from "../../../services/orderService";

import "./MyOrders.css";


// =====================================================
// API BASE URL
// Sirf .env se aayega (VITE_API_URL). Yaha koi
// localhost / hardcoded URL nahi hai.
// =====================================================

const API_BASE_URL =
  String(
    import.meta.env.VITE_API_URL || ""
  ).replace(/\/+$/, "");

if (!API_BASE_URL) {

  console.error(
    "VITE_API_URL .env file me set nahi hai. " +
    "Project root ki .env me VITE_API_URL=... add karke " +
    "dev server restart karo."
  );

}


// =====================================================
// PAYMENT SUMMARY STORAGE KEY
// =====================================================

const getPaymentSummaryKey = (orderId) =>
  `order_payment_summary_${orderId}`;


// =====================================================
// NUMBER HELPER
// =====================================================

const toNumber = (
  value,
  fallback = 0
) => {

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};


// =====================================================
// ROUND MONEY
// =====================================================

const roundMoney = (value) => {

  return Math.round(
    (
      toNumber(value) +
      Number.EPSILON
    ) * 100
  ) / 100;

};


// =====================================================
// MONEY FORMAT - INDIAN RUPEES
// =====================================================

const money = (value) => {

  return toNumber(value)
    .toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

};


// =====================================================
// STATUS FORMAT
// =====================================================

const formatStatus = (value) => {

  if (!value) {

    return "Pending";

  }

  return String(value)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );

};


// =====================================================
// STATUS CLASS
// =====================================================

const getStatusClass = (value) => {

  const status =
    String(value || "")
      .toUpperCase();

  if (
    status === "DELIVERED" ||
    status === "COMPLETED" ||
    status === "PAID" ||
    status === "SUCCESS"
  ) {

    return "success";

  }

  if (
    status === "CANCELLED" ||
    status === "FAILED" ||
    status === "REJECTED"
  ) {

    return "danger";

  }

  if (
    status === "SHIPPED" ||
    status === "OUT_FOR_DELIVERY" ||
    status === "PROCESSING" ||
    status === "CONFIRMED"
  ) {

    return "info";

  }

  return "pending";

};


// =====================================================
// AUTH HEADERS
// =====================================================

const getAuthHeaders = () => {

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("accessToken") ||
    "";

  return {

    headers: {

      Authorization:
        token
          ? `Bearer ${token}`
          : "",

      "Content-Type":
        "application/json",

    },

  };

};


// =====================================================
// EXTRACT PRODUCT ID
// =====================================================

const extractProductId = (item) => {

  if (!item) {

    return "";

  }

  if (
    typeof item.product === "object" &&
    item.product !== null
  ) {

    return (
      item.product._id ||
      item.product.id ||
      ""
    );

  }

  return (
    item.product ||
    item.productId ||
    item._id ||
    ""
  );

};


// =====================================================
// LOAD SAVED PAYMENT SUMMARY
// =====================================================

const getSavedPaymentSummary = (
  orderId
) => {

  if (!orderId) {

    return null;

  }

  try {

    const raw =
      localStorage.getItem(
        getPaymentSummaryKey(
          orderId
        )
      );

    if (!raw) {

      return null;

    }

    const parsed =
      JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object"
    ) {

      return null;

    }

    return parsed;

  }
  catch (error) {

    console.error(
      "PAYMENT SUMMARY STORAGE READ ERROR:",
      error
    );

    return null;

  }

};


// =====================================================
// BUILD ORDER PAYMENT BREAKDOWN
// =====================================================
//
// Priority:
// 1. Exact paymentSummary saved during payment
// 2. Values already saved in Order
// 3. Calculate from orderItems
//
// This prevents MyOrders from showing only
// product price.
// =====================================================

const getOrderBreakdown = (
  order
) => {

  const orderId =
    order?._id ||
    order?.id ||
    order?.orderId ||
    "";

  const savedSummary =
    getSavedPaymentSummary(
      orderId
    );


  // ===================================================
  // PRODUCT ITEMS
  // ===================================================

  const items =
    Array.isArray(
      order?.orderItems
    )
      ? order.orderItems
      : [];


  // ===================================================
  // CALCULATE ITEM VALUES
  // ===================================================

  let calculatedOriginalSubtotal = 0;

  let calculatedSellingSubtotal = 0;

  let calculatedOfferDiscount = 0;


  items.forEach((item) => {

    const quantity =
      Math.max(
        toNumber(
          item?.quantity,
          1
        ),
        1
      );


    const price =
      toNumber(
        item?.price ??
        item?.sellingPrice ??
        item?.unitPrice,
        0
      );


    const originalPrice =
      toNumber(
        item?.originalPrice,
        price
      );


    calculatedOriginalSubtotal +=
      originalPrice *
      quantity;


    calculatedSellingSubtotal +=
      price *
      quantity;


    // -------------------------------------------------
    // OFFER DISCOUNT
    // -------------------------------------------------

    const itemDiscount =
      toNumber(
        item?.discountAmount,
        Math.max(
          originalPrice -
          price,
          0
        )
      );


    calculatedOfferDiscount +=
      Math.max(
        itemDiscount,
        0
      ) * quantity;

  });


  // ===================================================
  // PRODUCT SUBTOTAL
  // ===================================================
  //
  // Payment Summary has highest priority.
  //
  // Then backend subtotal fields.
  //
  // Then original item subtotal.
  // ===================================================

  const productSubtotal =
    roundMoney(
      savedSummary?.subtotal ??
      order?.subtotal ??
      order?.subTotal ??
      order?.itemsSubtotal ??
      order?.productSubtotal ??
      calculatedOriginalSubtotal ??
      calculatedSellingSubtotal
    );


  // ===================================================
  // OFFER DISCOUNT
  // ===================================================

  const offerDiscount =
    roundMoney(
      savedSummary?.offerDiscount ??
      savedSummary?.productDiscount ??
      order?.offerDiscount ??
      order?.productDiscount ??
      order?.discountFromOffers ??
      calculatedOfferDiscount
    );


  // ===================================================
  // COUPON DISCOUNT
  // ===================================================

  const couponDiscount =
    roundMoney(
      savedSummary?.couponDiscount ??
      savedSummary?.couponDiscountAmount ??
      order?.couponDiscount ??
      order?.couponDiscountAmount ??
      order?.coupon?.discountAmount ??
      0
    );


  // ===================================================
  // TOTAL DISCOUNT
  // ===================================================

  const totalDiscount =
    Math.min(
      Math.max(
        offerDiscount +
        couponDiscount,
        0
      ),
      Math.max(
        productSubtotal,
        0
      )
    );


  // ===================================================
  // TAXABLE AMOUNT
  // ===================================================

  const calculatedTaxableAmount =
    Math.max(
      productSubtotal -
      totalDiscount,
      0
    );


  const taxableAmount =
    roundMoney(
      savedSummary?.taxableAmount ??
      order?.taxableAmount ??
      calculatedTaxableAmount
    );


  // ===================================================
  // GST PERCENTAGE
  // ===================================================

  const gstPercentage =
    Math.max(
      toNumber(
        savedSummary?.gstPercentage ??
        order?.gstPercentage ??
        order?.gstRate ??
        18,
        18
      ),
      0
    );


  // ===================================================
  // GST AMOUNT
  // ===================================================

  const calculatedGST =
    roundMoney(
      taxableAmount *
      gstPercentage /
      100
    );


  const gstAmount =
    Math.max(
      roundMoney(
        savedSummary?.gstAmount ??
        order?.gstAmount ??
        order?.gst ??
        order?.totalGST ??
        order?.taxAmount ??
        order?.tax ??
        order?.gstDetails?.totalGST ??
        order?.gstDetails?.gstAmount ??
        calculatedGST
      ),
      0
    );


  // ===================================================
  // SHIPPING
  // ===================================================

  const shippingCharge =
    Math.max(
      roundMoney(
        savedSummary?.shippingCharge ??
        savedSummary?.shipping ??
        order?.shippingCharge ??
        order?.shippingAmount ??
        order?.shippingCost ??
        order?.shippingCharges ??
        order?.deliveryCharge ??
        order?.deliveryCharges ??
        order?.shipping?.amount ??
        0
      ),
      0
    );


  // ===================================================
  // OTHER CHARGES
  // ===================================================

  const otherCharges =
    Math.max(
      roundMoney(
        savedSummary?.otherCharges ??
        order?.otherCharges ??
        order?.additionalCharges ??
        order?.handlingCharges ??
        0
      ),
      0
    );


  // ===================================================
  // CALCULATED FINAL TOTAL
  // ===================================================

  const calculatedFinalAmount =
    Math.max(
      roundMoney(
        taxableAmount +
        shippingCharge +
        gstAmount +
        otherCharges
      ),
      0
    );


  // ===================================================
  // PAYMENT AMOUNT
  // ===================================================
  //
  // If the actual payment amount exists, use it
  // only when it is explicitly available.
  // ===================================================

  const paymentAmount =
    toNumber(
      savedSummary?.total ??
      savedSummary?.finalAmount ??
      savedSummary?.payableAmount ??
      order?.paidAmount ??
      order?.paymentAmount ??
      0
    );


  // ===================================================
  // FINAL AMOUNT
  // ===================================================
  //
  // IMPORTANT:
  //
  // Do NOT blindly use order.finalAmount because
  // current backend may contain product/coupon amount
  // without the payment page GST/shipping calculation.
  //
  // Exact saved payment summary gets first priority.
  // ===================================================

  let finalAmount =
    calculatedFinalAmount;


  if (
    savedSummary?.total !==
      undefined &&
    savedSummary?.total !==
      null &&
    Number.isFinite(
      Number(
        savedSummary.total
      )
    )
  ) {

    finalAmount =
      Math.max(
        roundMoney(
          Number(
            savedSummary.total
          )
        ),
        0
      );

  }
  else if (
    savedSummary?.finalAmount !==
      undefined &&
    savedSummary?.finalAmount !==
      null &&
    Number.isFinite(
      Number(
        savedSummary.finalAmount
      )
    )
  ) {

    finalAmount =
      Math.max(
        roundMoney(
          Number(
            savedSummary.finalAmount
          )
        ),
        0
      );

  }
  else if (
    paymentAmount > 0
  ) {

    finalAmount =
      roundMoney(
        paymentAmount
      );

  }
  else if (
    order?.grandTotal !==
      undefined
  ) {

    finalAmount =
      roundMoney(
        order.grandTotal
      );

  }
  else if (
    order?.payableAmount !==
      undefined
  ) {

    finalAmount =
      roundMoney(
        order.payableAmount
      );

  }


  // ===================================================
  // COUPON CODE
  // ===================================================

  const couponCode =
    order?.couponCode ||
    order?.coupon?.code ||
    savedSummary?.couponCode ||
    "";


  // ===================================================
  // PAYMENT METHOD
  // ===================================================

  const paymentMethod =
    order?.paymentMethod ||
    order?.payment?.paymentMethod ||
    order?.payment?.method ||
    savedSummary?.paymentMethod ||
    "ONLINE";


  // ===================================================
  // PAYMENT STATUS
  // ===================================================

  const paymentStatus =
    order?.paymentStatus ||
    order?.payment?.status ||
    savedSummary?.paymentStatus ||
    "PENDING";


  return {

    productSubtotal,

    offerDiscount,

    couponDiscount,

    totalDiscount,

    taxableAmount,

    gstPercentage,

    gstAmount,

    shippingCharge,

    otherCharges,

    finalAmount,

    couponCode,

    paymentMethod,

    paymentStatus,

    hasSavedPaymentSummary:
      !!savedSummary,

  };

};


// =====================================================
// COMPONENT
// =====================================================

const MyOrders = () => {

  const navigate =
    useNavigate();


  // ===================================================
  // ORDERS
  // ===================================================

  const [
    orders,
    setOrders
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  // ===================================================
  // RETURN
  // ===================================================

  const [
    returningOrder,
    setReturningOrder
  ] = useState(null);


  const [
    returnReason,
    setReturnReason
  ] = useState("");


  const [
    otherReasonText,
    setOtherReasonText
  ] = useState("");


  const [
    selectedItems,
    setSelectedItems
  ] = useState([]);


  const [
    returnLoading,
    setReturnLoading
  ] = useState(false);


  const [
    returnMessage,
    setReturnMessage
  ] = useState("");


  // ===================================================
  // RETURN / REFUND DETAILS
  // ===================================================

  const [
    returnDetails,
    setReturnDetails
  ] = useState({});


  const [
    refundDetails,
    setRefundDetails
  ] = useState({});


  // ===================================================
  // REVIEW
  // ===================================================

  const [
    reviewProduct,
    setReviewProduct
  ] = useState(null);


  const [
    reviewOrder,
    setReviewOrder
  ] = useState(null);


  // ===================================================
  // LOAD RETURN / REFUND
  // ===================================================

  const loadReturnRefundDetails =
    async (orderList) => {

      if (
        !Array.isArray(orderList) ||
        orderList.length === 0
      ) {

        return;

      }


      const returns = {};

      const refunds = {};


      await Promise.all(

        orderList.map(
          async (order) => {

            const orderId =
              order?._id ||
              order?.id;


            if (!orderId) {

              return;

            }


            // =========================================
            // RETURN
            // =========================================

            try {

              const response =
                await axios.get(
                  `${API_BASE_URL}/returns/order/${orderId}`,
                  getAuthHeaders()
                );


              const data =
                response?.data?.returns ||
                response?.data?.return ||
                response?.data?.data ||
                response?.data;


              if (
                Array.isArray(data) &&
                data.length > 0
              ) {

                returns[orderId] =
                  data[
                    data.length - 1
                  ];

              }
              else if (
                data &&
                typeof data === "object" &&
                data._id
              ) {

                returns[orderId] =
                  data;

              }

            }
            catch (error) {

              console.warn(
                "RETURN DETAILS LOAD ERROR:",
                orderId,
                error?.response?.data ||
                error?.message
              );

            }


            // =========================================
            // REFUND
            // =========================================

            try {

              const response =
                await axios.get(
                  `${API_BASE_URL}/refunds/order/${orderId}`,
                  getAuthHeaders()
                );


              const data =
                response?.data?.refunds ||
                response?.data?.refund ||
                response?.data?.data ||
                response?.data;


              if (
                Array.isArray(data) &&
                data.length > 0
              ) {

                refunds[orderId] =
                  data[
                    data.length - 1
                  ];

              }
              else if (
                data &&
                typeof data === "object" &&
                data._id
              ) {

                refunds[orderId] =
                  data;

              }

            }
            catch (error) {

              console.warn(
                "REFUND DETAILS LOAD ERROR:",
                orderId,
                error?.response?.data ||
                error?.message
              );

            }

          }
        )

      );


      setReturnDetails(
        returns
      );

      setRefundDetails(
        refunds
      );

    };


  // ===================================================
  // FETCH ORDERS
  // ===================================================

  const fetchOrders =
    useCallback(
      async () => {

        try {

          setLoading(true);


          const response =
            await getMyOrders();


          const orderData =
            response?.orders ||
            response?.data?.orders ||
            response?.data?.data ||
            response?.data ||
            (
              Array.isArray(response)
                ? response
                : []
            );


          const validOrders =
            Array.isArray(
              orderData
            )
              ? orderData
              : [];


          setOrders(
            validOrders
          );


          await loadReturnRefundDetails(
            validOrders
          );

        }
        catch (error) {

          console.error(
            "MY ORDERS FETCH ERROR:",
            error
          );

          setOrders([]);

        }
        finally {

          setLoading(false);

        }

      },
      []
    );


  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {

    fetchOrders();

  }, [
    fetchOrders
  ]);


  // ===================================================
  // RETURN MODAL
  // ===================================================

  const openReturnModal =
    (order) => {

      if (
        order?.orderStatus !==
          "DELIVERED" &&
        order?.orderStatus !==
          "COMPLETED"
      ) {

        alert(
          "Only delivered orders can be returned."
        );

        return;

      }


      const orderId =
        order?._id ||
        order?.id;


      const existing =
        orderId
          ? returnDetails[orderId]
          : null;


      if (
        existing &&
        existing._id &&
        ![
          "REJECTED",
          "CANCELLED"
        ].includes(
          existing.status
        )
      ) {

        alert(
          "Return request already exists for this order."
        );

        return;

      }


      setReturningOrder(
        order
      );

      setReturnReason("");

      setOtherReasonText("");

      setSelectedItems([]);

      setReturnMessage("");

    };


  // ===================================================
  // CLOSE RETURN MODAL
  // ===================================================

  const closeReturnModal =
    () => {

      if (
        returnLoading
      ) {

        return;

      }


      setReturningOrder(
        null
      );

      setReturnReason("");

      setOtherReasonText("");

      setSelectedItems([]);

      setReturnMessage("");

    };


  // ===================================================
  // TOGGLE ITEM
  // ===================================================

  const toggleItem =
    (
      item,
      index
    ) => {

      const productId =
        String(
          extractProductId(
            item
          ) ||
          index
        );


      setSelectedItems(
        (previous) => {

          const exists =
            previous.find(
              (selected) =>
                selected.itemId ===
                productId
            );


          if (exists) {

            return previous.filter(
              (selected) =>
                selected.itemId !==
                productId
            );

          }


          return [

            ...previous,

            {

              itemId:
                item?.product?._id ||
                item?.product ||
                item?._id,

              productId:
                item?.product?._id ||
                item?.product ||
                item?._id,

              productName:
                item?.title ||
                item?.product?.name ||
                item?.productName ||
                item?.name ||
                "Product",

              quantity:
                Number(
                  item?.quantity
                ) || 1,

            },

          ];

        }
      );

    };


  // ===================================================
  // IS ITEM SELECTED
  // ===================================================

  const isItemSelected =
    (
      item,
      index
    ) => {

      const productId =
        String(
          extractProductId(
            item
          ) ||
          index
        );


      return selectedItems.some(
        (selected) =>
          selected.itemId ===
          productId
      );

    };


  // ===================================================
  // SUBMIT RETURN
  // ===================================================

  const handleReturn =
    async () => {

      const orderId =
        returningOrder?._id ||
        returningOrder?.id;


      if (!orderId) {

        setReturnMessage(
          "Order ID not found."
        );

        return;

      }


      if (
        !returnReason.trim()
      ) {

        setReturnMessage(
          "Please select a return reason."
        );

        return;

      }


      if (
        !selectedItems.length
      ) {

        setReturnMessage(
          "Please select at least one product."
        );

        return;

      }


      if (
        returnReason ===
          "OTHER" &&
        !otherReasonText.trim()
      ) {

        setReturnMessage(
          "Please describe your return reason."
        );

        return;

      }


      try {

        setReturnLoading(true);

        setReturnMessage("");


        const finalNote =
          returnReason ===
            "OTHER"
            ? otherReasonText.trim()
            : returnReason;


        const payload = {

          orderId:
            String(orderId),

          pickupRequired:
            true,

          customerNote:
            finalNote,

          items:
            selectedItems.map(
              (item) => ({

                productId:
                  String(
                    item.productId
                  ),

                quantity:
                  Number(
                    item.quantity
                  ) || 1,

                reason:
                  returnReason,

                reasonNote:
                  finalNote,

              })
            ),

        };


        const response =
          await axios.post(
            `${API_BASE_URL}/returns`,
            payload,
            getAuthHeaders()
          );


        setReturnMessage(
          response?.data?.message ||
          "Return request created successfully!"
        );


        setTimeout(
          async () => {

            closeReturnModal();

            await fetchOrders();

          },
          1200
        );

      }
      catch (error) {

        console.error(
          "RETURN SUBMIT ERROR:",
          error
        );


        setReturnMessage(
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create return request."
        );

      }
      finally {

        setReturnLoading(
          false
        );

      }

    };


  // ===================================================
  // RETURN STATUS
  // ===================================================

  const getReturnStatus =
    (order) => {

      const orderId =
        order?._id ||
        order?.id;


      const returnData =
        orderId
          ? returnDetails[orderId]
          : null;


      return (
        returnData?.status ||
        order?.returnStatus ||
        order?.return?.status ||
        null
      );

    };


  // ===================================================
  // REFUND STATUS
  // ===================================================

  const getRefundStatus =
    (order) => {

      const orderId =
        order?._id ||
        order?.id;


      const refundData =
        orderId
          ? refundDetails[orderId]
          : null;


      return (
        refundData?.status ||
        order?.refundStatus ||
        order?.refund?.status ||
        null
      );

    };


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (

      <div className="myorders-loading">

        Loading Orders...

      </div>

    );

  }


  // ===================================================
  // UI
  // ===================================================

  return (

    <div className="myorders-container">

      <h1 className="myorders-title">
        My Orders
      </h1>


      {orders.length === 0 ? (

        <div className="no-orders">

          <h3>
            No Orders Found
          </h3>

          <button
            onClick={() =>
              navigate("/shop")
            }
          >
            Continue Shopping
          </button>

        </div>

      ) : (

        orders.map(
          (
            order,
            index
          ) => {

            const orderId =
              order?._id ||
              order?.id ||
              order?.orderId ||
              `order-${index}`;


            const returnStatus =
              getReturnStatus(
                order
              );


            const refundStatus =
              getRefundStatus(
                order
              );


            const breakdown =
              getOrderBreakdown(
                order
              );


            return (

              <div
                className="order-card"
                key={orderId}
              >

                {/* =====================================
                    ORDER ID
                ====================================== */}

                <div className="order-row">

                  <span>
                    Order ID
                  </span>

                  <p>
                    {orderId}
                  </p>

                </div>


                {/* =====================================
                    PRODUCT SUBTOTAL
                ====================================== */}

                <div className="order-row">

                  <span>
                    Product Subtotal
                  </span>

                  <p>
                    ₹{" "}
                    {money(
                      breakdown.productSubtotal
                    )}
                  </p>

                </div>


                {/* =====================================
                    OFFER DISCOUNT
                ====================================== */}

                {breakdown.offerDiscount > 0 && (

                  <div
                    className="order-row"
                    style={{
                      color: "#198754",
                    }}
                  >

                    <span>
                      Offer Discount
                    </span>

                    <p>
                      - ₹{" "}
                      {money(
                        breakdown.offerDiscount
                      )}
                    </p>

                  </div>

                )}


                {/* =====================================
                    COUPON DISCOUNT
                ====================================== */}

                {breakdown.couponDiscount > 0 && (

                  <div
                    className="order-row"
                    style={{
                      color: "#198754",
                    }}
                  >

                    <span>

                      Coupon Discount

                      {breakdown.couponCode && (

                        <small
                          style={{
                            display: "block",
                            fontWeight: 400,
                            fontSize: "11px",
                            marginTop: "2px",
                          }}
                        >
                          {breakdown.couponCode}
                        </small>

                      )}

                    </span>

                    <p>
                      - ₹{" "}
                      {money(
                        breakdown.couponDiscount
                      )}
                    </p>

                  </div>

                )}


                {/* =====================================
                    TAXABLE AMOUNT
                ====================================== */}

                <div className="order-row">

                  <span>
                    Taxable Amount
                  </span>

                  <p>
                    ₹{" "}
                    {money(
                      breakdown.taxableAmount
                    )}
                  </p>

                </div>


                {/* =====================================
                    GST
                ====================================== */}

                <div className="order-row">

                  <span>
                    GST (
                    {money(
                      breakdown.gstPercentage
                    )}
                    %)
                  </span>

                  <p>
                    ₹{" "}
                    {money(
                      breakdown.gstAmount
                    )}
                  </p>

                </div>


                {/* =====================================
                    SHIPPING
                ====================================== */}

                <div className="order-row">

                  <span>
                    Shipping
                  </span>

                  <p>

                    {breakdown.shippingCharge >
                    0

                      ? `₹ ${money(
                          breakdown.shippingCharge
                        )}`

                      : "Free"}

                  </p>

                </div>


                {/* =====================================
                    OTHER CHARGES
                ====================================== */}

                {breakdown.otherCharges > 0 && (

                  <div className="order-row">

                    <span>
                      Other Charges
                    </span>

                    <p>
                      ₹{" "}
                      {money(
                        breakdown.otherCharges
                      )}
                    </p>

                  </div>

                )}


                {/* =====================================
                    FINAL TOTAL
                ====================================== */}

                <div
                  className="order-row"
                  style={{
                    borderTop:
                      "1px solid #ddd",
                    marginTop: "10px",
                    paddingTop: "12px",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                >

                  <span>
                    Total Amount
                  </span>

                  <p>
                    ₹{" "}
                    {money(
                      breakdown.finalAmount
                    )}
                  </p>

                </div>


                {/* =====================================
                    PAYMENT METHOD
                ====================================== */}

                <div className="order-row">

                  <span>
                    Payment Method
                  </span>

                  <p>
                    {formatStatus(
                      breakdown.paymentMethod
                    )}
                  </p>

                </div>


                {/* =====================================
                    PAYMENT STATUS
                ====================================== */}

                <div className="order-row">

                  <span>
                    Payment Status
                  </span>

                  <p>

                    <span
                      className={`order-status-badge ${getStatusClass(
                        breakdown.paymentStatus
                      )}`}
                    >
                      {formatStatus(
                        breakdown.paymentStatus
                      )}
                    </span>

                  </p>

                </div>


                {/* =====================================
                    ORDER STATUS
                ====================================== */}

                <div className="order-row">

                  <span>
                    Order Status
                  </span>

                  <p>

                    <span
                      className={`order-status-badge ${getStatusClass(
                        order?.orderStatus
                      )}`}
                    >
                      {formatStatus(
                        order?.orderStatus ||
                        "PENDING"
                      )}
                    </span>

                  </p>

                </div>


                {/* =====================================
                    RETURN STATUS
                ====================================== */}

                {returnStatus && (

                  <div className="order-row">

                    <span>
                      Return Status
                    </span>

                    <p>
                      {formatStatus(
                        returnStatus
                      )}
                    </p>

                  </div>

                )}


                {/* =====================================
                    REFUND STATUS
                ====================================== */}

                {refundStatus && (

                  <div className="order-row">

                    <span>
                      Refund Status
                    </span>

                    <p>
                      {formatStatus(
                        refundStatus
                      )}
                    </p>

                  </div>

                )}


                {/* =====================================
                    ITEMS
                ====================================== */}

                <div className="order-row">

                  <span>
                    Items
                  </span>

                  <p>
                    {
                      order?.orderItems
                        ?.length || 0
                    }
                  </p>

                </div>


                {/* =====================================
                    DATE
                ====================================== */}

                <div className="order-row">

                  <span>
                    Date
                  </span>

                  <p>

                    {order?.createdAt

                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )

                      : "N/A"}

                  </p>

                </div>


                {/* =====================================
                    ACTIONS
                ====================================== */}

                <div className="order-actions">

                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate(
                        `/order/${orderId}`
                      )
                    }
                  >
                    View Details
                  </button>


                  <button
                    className="track-order-btn"
                    onClick={() =>
                      navigate(
                        `/order/${orderId}/track`
                      )
                    }
                  >
                    🚚 Track Order
                  </button>


                  {(order?.orderStatus ===
                    "DELIVERED" ||
                    order?.orderStatus ===
                      "COMPLETED") && (

                    <button
                      className="return-order-btn"
                      onClick={() =>
                        openReturnModal(
                          order
                        )
                      }
                      disabled={
                        !!returnStatus &&
                        ![
                          "REJECTED",
                          "CANCELLED",
                        ].includes(
                          returnStatus
                        )
                      }
                    >

                      {returnStatus

                        ? `↩️ Return: ${formatStatus(
                            returnStatus
                          )}`

                        : "↩️ Return Product"}

                    </button>

                  )}


                  {refundStatus && (

                    <button
                      className="refund-status-btn"
                      type="button"
                    >
                      💰 Refund:{" "}
                      {formatStatus(
                        refundStatus
                      )}
                    </button>

                  )}

                </div>


                {/* =====================================
                    RETURN / REFUND TIMELINE
                ====================================== */}

                {(returnStatus ||
                  refundStatus) && (

                  <div className="return-refund-timeline">

                    <h4>
                      Return & Refund Progress
                    </h4>


                    <div className="timeline">

                      <div
                        className={
                          returnStatus
                            ? "timeline-step active"
                            : "timeline-step"
                        }
                      >
                        <span>1</span>
                        <p>
                          Return Requested
                        </p>
                      </div>


                      <div
                        className={
                          [
                            "APPROVED",
                            "PICKUP_REQUESTED",
                            "PICKED_UP",
                            "RECEIVED",
                            "INSPECTED",
                            "COMPLETED",
                          ].includes(
                            returnStatus
                          )
                            ? "timeline-step active"
                            : "timeline-step"
                        }
                      >
                        <span>2</span>
                        <p>
                          Return Approved
                        </p>
                      </div>


                      <div
                        className={
                          [
                            "PICKUP_REQUESTED",
                            "PICKED_UP",
                            "RECEIVED",
                            "INSPECTED",
                            "COMPLETED",
                          ].includes(
                            returnStatus
                          )
                            ? "timeline-step active"
                            : "timeline-step"
                        }
                      >
                        <span>3</span>
                        <p>
                          Pickup
                        </p>
                      </div>


                      <div
                        className={
                          [
                            "RECEIVED",
                            "INSPECTED",
                            "COMPLETED",
                          ].includes(
                            returnStatus
                          )
                            ? "timeline-step active"
                            : "timeline-step"
                        }
                      >
                        <span>4</span>
                        <p>
                          Product Received
                        </p>
                      </div>


                      <div
                        className={
                          [
                            "INSPECTED",
                            "COMPLETED",
                          ].includes(
                            returnStatus
                          )
                            ? "timeline-step active"
                            : "timeline-step"
                        }
                      >
                        <span>5</span>
                        <p>
                          Inspection
                        </p>
                      </div>


                      <div
                        className={
                          refundStatus
                            ? "timeline-step active"
                            : "timeline-step"
                        }
                      >
                        <span>6</span>
                        <p>
                          Refund
                        </p>
                      </div>

                    </div>

                  </div>

                )}


                {/* =====================================
                    PRODUCTS
                ====================================== */}

                {order?.orderItems?.length > 0 && (

                  <div className="order-products-review">

                    <h4>
                      Products
                    </h4>


                    {order.orderItems.map(
                      (
                        item,
                        itemIndex
                      ) => {

                        const productId =
                          String(
                            extractProductId(
                              item
                            ) ||
                            itemIndex
                          );


                        const quantity =
                          Number(
                            item?.quantity
                          ) || 1;


                        const itemPrice =
                          toNumber(
                            item?.price,
                            0
                          );


                        return (

                          <div
                            className="review-product-row"
                            key={productId}
                          >

                            <div className="review-product-info">

                              <span className="review-product-name">

                                {item?.title ||
                                  item?.product?.name ||
                                  item?.productName ||
                                  item?.name ||
                                  "Product"}

                              </span>


                              <span className="review-product-quantity">

                                Qty:{" "}
                                {quantity}

                                {" • "}

                                ₹{" "}
                                {money(
                                  itemPrice *
                                  quantity
                                )}

                              </span>

                            </div>


                            {(order?.orderStatus ===
                              "DELIVERED" ||
                              order?.orderStatus ===
                                "COMPLETED") && (

                              <button
                                type="button"
                                className="review-btn"
                                onClick={() => {

                                  setReviewProduct(
                                    item?.product ||
                                    item
                                  );

                                  setReviewOrder(
                                    order
                                  );

                                }}
                              >
                                ⭐ Review Product
                              </button>

                            )}

                          </div>

                        );

                      }
                    )}

                  </div>

                )}

              </div>

            );

          }
        )

      )}


      {/* =================================================
          RETURN MODAL
      ================================================= */}

      {returningOrder && (

        <div
          className="return-modal-overlay"
          onClick={
            closeReturnModal
          }
        >

          <div
            className="return-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="return-modal-header">

              <h2>
                Return Product
              </h2>


              <button
                type="button"
                onClick={
                  closeReturnModal
                }
                disabled={
                  returnLoading
                }
              >
                ×
              </button>

            </div>


            <div className="return-modal-body">

              <p>

                Order ID:{" "}

                <strong>
                  {
                    returningOrder?._id ||
                    returningOrder?.id
                  }
                </strong>

              </p>


              <p>

                Total Amount:{" "}

                <strong>

                  ₹{" "}
                  {money(
                    getOrderBreakdown(
                      returningOrder
                    ).finalAmount
                  )}

                </strong>

              </p>


              <label>
                Select Products
              </label>


              <div className="return-items">

                {returningOrder?.orderItems?.map(
                  (
                    item,
                    index
                  ) => {

                    const productId =
                      String(
                        extractProductId(
                          item
                        ) ||
                        index
                      );


                    return (

                      <label
                        className="return-item"
                        key={productId}
                      >

                        <input
                          type="checkbox"
                          checked={
                            isItemSelected(
                              item,
                              index
                            )
                          }
                          onChange={() =>
                            toggleItem(
                              item,
                              index
                            )
                          }
                          disabled={
                            returnLoading
                          }
                        />


                        <div>

                          <strong>

                            {item?.title ||
                              item?.product?.name ||
                              item?.productName ||
                              item?.name ||
                              "Product"}

                          </strong>


                          <span>

                            Qty:{" "}
                            {
                              item?.quantity ||
                              1
                            }

                          </span>

                        </div>

                      </label>

                    );

                  }
                )}

              </div>


              <label>
                Reason for Return
              </label>


              <select
                value={
                  returnReason
                }
                onChange={(event) =>
                  setReturnReason(
                    event.target.value
                  )
                }
                disabled={
                  returnLoading
                }
              >

                <option value="">
                  Select Return Reason
                </option>

                <option value="WRONG_PRODUCT">
                  Wrong product received
                </option>

                <option value="DAMAGED">
                  Product damaged
                </option>

                <option value="DEFECTIVE">
                  Product is defective
                </option>

                <option value="NOT_AS_EXPECTED">
                  Product not as expected
                </option>

                <option value="SIZE_ISSUE">
                  Size or fit issue
                </option>

                <option value="CHANGE_OF_MIND">
                  Change of mind
                </option>

                <option value="OTHER">
                  Other
                </option>

              </select>


              {returnReason ===
                "OTHER" && (

                <textarea
                  value={
                    otherReasonText
                  }
                  onChange={(event) =>
                    setOtherReasonText(
                      event.target.value
                    )
                  }
                  placeholder="Please describe your return reason..."
                  rows="4"
                  disabled={
                    returnLoading
                  }
                />

              )}


              {returnMessage && (

                <div className="return-message">

                  {returnMessage}

                </div>

              )}


              <div className="return-modal-actions">

                <button
                  type="button"
                  className="cancel-return-btn"
                  onClick={
                    closeReturnModal
                  }
                  disabled={
                    returnLoading
                  }
                >
                  Cancel
                </button>


                <button
                  type="button"
                  className="submit-return-btn"
                  onClick={
                    handleReturn
                  }
                  disabled={
                    returnLoading
                  }
                >

                  {returnLoading
                    ? "Submitting..."
                    : "Submit Return"}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}


      {/* =================================================
          REVIEW MODAL
      ================================================= */}

      {reviewProduct &&
        reviewOrder && (

        <ReviewModal
          product={
            reviewProduct
          }
          order={
            reviewOrder
          }
          onClose={() => {

            setReviewProduct(
              null
            );

            setReviewOrder(
              null
            );

          }}
          onSuccess={() => {

            setReviewProduct(
              null
            );

            setReviewOrder(
              null
            );

          }}
        />

      )}

    </div>

  );

};


export default MyOrders;