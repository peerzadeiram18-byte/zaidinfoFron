
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import "./MyOrders.css";

// import { getMyOrders } from "../../../services/orderService";

// const MyOrders = () => {

//     const navigate = useNavigate();

//     const [orders, setOrders] = useState([]);

//     const [loading, setLoading] = useState(true);

//     useEffect(() => {

//         fetchOrders();

//     }, []);

//     const fetchOrders = async () => {

//         try {

//             const res = await getMyOrders();

//             console.log("Orders Response :", res);

//             // Different backend response support
//             setOrders(
//                 res.orders ||
//                 res.data?.orders ||
//                 res.data ||
//                 []
//             );

//         }
//         catch (error) {

//             console.error(error);

//         }
//         finally {

//             setLoading(false);

//         }

//     };

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
//                 orders.length === 0 ?

//                     (

//                         <div className="no-orders">

//                             <h3>No Orders Found</h3>

//                         </div>

//                     )

//                     :

//                     (

//                         orders.map((order) => (

//                             <div
//                                 className="order-card"
//                                 key={order._id}
//                             >

//                                 <div className="order-row">

//                                     <span>Order ID</span>

//                                     <p>{order._id}</p>

//                                 </div>

//                                 <div className="order-row">

//                                     <span>Total Amount</span>

//                                     <p>₹ {order.totalAmount}</p>

//                                 </div>

//                                 <div className="order-row">

//                                     <span>Order Status</span>

//                                     <p>{order.orderStatus}</p>

//                                 </div>

//                                 <div className="order-row">

//                                     <span>Payment Status</span>

//                                     <p>{order.paymentStatus}</p>

//                                 </div>

//                                 <div className="order-row">

//                                     <span>Items</span>

//                                     <p>

//                                         {order.orderItems?.length || 0}

//                                     </p>

//                                 </div>

//                                 <div className="order-row">

//                                     <span>Date</span>

//                                     <p>

//                                         {new Date(order.createdAt).toLocaleDateString()}

//                                     </p>

//                                 </div>

//                                 <button

//                                     className="view-btn"

//                                     onClick={() =>

//                                         navigate(`/order/${order._id}`)

//                                     }

//                                 >

//                                     View Details

//                                 </button>

//                             </div>

//                         ))

//                     )
//             }

//         </div>

//     );

// };

// export default MyOrders;


import React, { useState } from "react";
import { FaBox, FaChevronRight, FaClock, FaCheckCircle, FaTruck } from "react-icons/fa";
import "./MyOrders.css";

const ordersData = [
  {
    id: "ORD-94820",
    date: "Aug 02, 2026",
    total: "$240.00",
    status: "Delivered",
    itemsCount: 3,
    statusType: "success",
  },
  {
    id: "ORD-94711",
    date: "Jul 28, 2026",
    total: "$115.50",
    status: "In Transit",
    itemsCount: 1,
    statusType: "warning",
  },
  {
    id: "ORD-93504",
    date: "Jul 15, 2026",
    total: "$89.00",
    status: "Processing",
    itemsCount: 2,
    statusType: "info",
  },
];

const MyOrders = () => {
  const [filter, setFilter] = useState("all");

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div>
          <h2 className="orders-title">My Orders</h2>
          <p className="orders-subtitle">Track, manage, and view your purchase history</p>
        </div>

        {/* Filter Pills */}
        <div className="order-filters">
          <button 
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === "transit" ? "active" : ""}`}
            onClick={() => setFilter("transit")}
          >
            In Transit
          </button>
          <button 
            className={`filter-btn ${filter === "delivered" ? "active" : ""}`}
            onClick={() => setFilter("delivered")}
          >
            Delivered
          </button>
        </div>
      </div>

      <div className="orders-list">
        {ordersData.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-main">
              <div className="order-icon-box">
                <FaBox />
              </div>
              <div className="order-info">
                <div className="order-id-group">
                  <h4>{order.id}</h4>
                  <span className={`status-badge ${order.statusType}`}>
                    {order.status === "Delivered" && <FaCheckCircle />}
                    {order.status === "In Transit" && <FaTruck />}
                    {order.status === "Processing" && <FaClock />}
                    {order.status}
                  </span>
                </div>
                <p className="order-meta">
                  Placed on {order.date} • {order.itemsCount} {order.itemsCount > 1 ? "items" : "item"}
                </p>
              </div>
            </div>

            <div className="order-side">
              <div className="order-total">
                <span>Total Amount</span>
                <strong>{order.total}</strong>
              </div>
              <button className="btn-details">
                Details <FaChevronRight />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;