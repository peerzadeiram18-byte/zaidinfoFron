// import React, {

//     useEffect,

//     useState

// } from "react";

// import "./Dashboard.css";

// import { Link } from "react-router-dom";

// import {

//     getAllOrders

// } from "../../../services/orderService";

// const Dashboard = () => {

//     const [

//         orders,

//         setOrders

//     ] = useState([]);

//     const [

//         loading,

//         setLoading

//     ] = useState(true);

//     useEffect(()=>{

//         fetchDashboard();

//     },[]);

//     const fetchDashboard = async()=>{

//         try{

//             const res = await getAllOrders();

//             setOrders(

//                 res.orders || []

//             );

//         }

//         catch(error){

//             console.log(error);

//         }

//         finally{

//             setLoading(false);

//         }

//     };



//     const totalOrders =

//         orders.length;



//     const totalRevenue =

//         orders.reduce(

//             (sum,item)=>

//                 sum + item.totalAmount,

//             0

//         );



//     const pendingOrders =

//         orders.filter(

//             item=>

//                 item.orderStatus==="PENDING"

//         ).length;



//     const deliveredOrders =

//         orders.filter(

//             item=>

//                 item.orderStatus==="DELIVERED"

//         ).length;



//     if(loading){

//         return <h2>Loading...</h2>;

//     }



//     return(

//         <div className="dashboard">

//             <h1>

//                 Admin Dashboard

//             </h1>



//             <div className="dashboard-cards">

//                 <div className="card">

//                     <h2>

//                         {totalOrders}

//                     </h2>

//                     <p>

//                         Total Orders

//                     </p>

//                 </div>



//                 <div className="card">

//                     <h2>

//                         ₹ {totalRevenue}

//                     </h2>

//                     <p>

//                         Revenue

//                     </p>

//                 </div>



//                 <div className="card">

//                     <h2>

//                         {pendingOrders}

//                     </h2>

//                     <p>

//                         Pending Orders

//                     </p>

//                 </div>



//                 <div className="card">

//                     <h2>

//                         {deliveredOrders}

//                     </h2>

//                     <p>

//                         Delivered

//                     </p>

//                 </div>

//             </div>



//             <div className="recent-orders">

//                 <h2>

//                     Recent Orders

//                 </h2>

//                 <table>

//                     <thead>

//                         <tr>

//                             <th>ID</th>

//                             <th>Customer</th>

//                             <th>Amount</th>

//                             <th>Status</th>

//                             <th>Action</th>

//                         </tr>

//                     </thead>

//                     <tbody>

//                         {

//                             orders

//                             .slice(0,5)

//                             .map(order=>(

//                                 <tr

//                                     key={order._id}

//                                 >

//                                     <td>

//                                         {order._id.slice(-6)}

//                                     </td>

//                                     <td>

//                                         {

//                                             order.user

//                                             ?

//                                             `${order.user.firstName} ${order.user.lastName}`

//                                             :

//                                             "N/A"

//                                         }

//                                     </td>

//                                     <td>

//                                         ₹ {order.totalAmount}

//                                     </td>

//                                     <td>

//                                         {order.orderStatus}

//                                     </td>

//                                     <td>

//                                         <Link

//                                             to={`/admin/orders/${order._id}`}

//                                         >

//                                             View

//                                         </Link>

//                                     </td>

//                                 </tr>

//                             ))

//                         }

//                     </tbody>

//                 </table>

//             </div>

//         </div>

//     );

// };

// export default Dashboard;


import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import { getAllOrders } from "../../../services/orderService";
import {
  ShoppingCart,
  IndianRupee,
  Clock,
  Truck,
  Bell,
} from "lucide-react";

function StatusBadge({ status }) {
  const statusClass =
    status === "PROCESSING"
      ? "badge-processing"
      : status === "PENDING"
      ? "badge-pending"
      : status === "DELIVERED"
      ? "badge-delivered"
      : "badge-default";

  return <span className={`status-badge ${statusClass}`}>{status}</span>;
}

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );

  const pendingOrders = orders.filter(
    (item) => item.orderStatus === "PENDING"
  ).length;

  const deliveredOrders = orders.filter(
    (item) => item.orderStatus === "DELIVERED"
  ).length;

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      iconBg: "icon-blue",
    },
    {
      label: "Revenue",
      value: `\u20B9${totalRevenue}`,
      icon: IndianRupee,
      iconBg: "icon-green",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      iconBg: "icon-amber",
    },
    {
      label: "Delivered",
      value: deliveredOrders,
      icon: Truck,
      iconBg: "icon-gray",
    },
  ];

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-header-actions">
          <Bell size={19} className="bell-icon" />
          <div className="avatar">AD</div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="stat-card" key={stat.label}>
              <div className="stat-card-content">
                <div>
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
                <div className={`stat-icon-wrap ${stat.iconBg}`}>
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="orders-card">
        <div className="orders-card-header">
          <h2>Recent Orders</h2>
          <Link to="/admin/orders" className="view-all-link">
            View all
          </Link>
        </div>

        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id}>
                  <td className="order-id">
                    #{order._id.slice(-6)}
                  </td>
                  <td>
                    {order.user && order.user.firstName
                      ? `${order.user.firstName} ${order.user.lastName || ""}`
                      : "N/A"}
                  </td>
                  <td>{`\u20B9${order.totalAmount}`}</td>
                  <td>
                    <StatusBadge status={order.orderStatus} />
                  </td>
                  <td>
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="view-link"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}