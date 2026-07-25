import React, {

    useEffect,

    useState

} from "react";

import "./Dashboard.css";

import { Link } from "react-router-dom";

import {

    getAllOrders

} from "../../../services/orderService";

const Dashboard = () => {

    const [

        orders,

        setOrders

    ] = useState([]);

    const [

        loading,

        setLoading

    ] = useState(true);

    useEffect(()=>{

        fetchDashboard();

    },[]);

    const fetchDashboard = async()=>{

        try{

            const res = await getAllOrders();

            setOrders(

                res.orders || []

            );

        }

        catch(error){

            console.log(error);

        }

        finally{

            setLoading(false);

        }

    };



    const totalOrders =

        orders.length;



    const totalRevenue =

        orders.reduce(

            (sum,item)=>

                sum + item.totalAmount,

            0

        );



    const pendingOrders =

        orders.filter(

            item=>

                item.orderStatus==="PENDING"

        ).length;



    const deliveredOrders =

        orders.filter(

            item=>

                item.orderStatus==="DELIVERED"

        ).length;



    if(loading){

        return <h2>Loading...</h2>;

    }



    return(

        <div className="dashboard">

            <h1>

                Admin Dashboard

            </h1>



            <div className="dashboard-cards">

                <div className="card">

                    <h2>

                        {totalOrders}

                    </h2>

                    <p>

                        Total Orders

                    </p>

                </div>



                <div className="card">

                    <h2>

                        ₹ {totalRevenue}

                    </h2>

                    <p>

                        Revenue

                    </p>

                </div>



                <div className="card">

                    <h2>

                        {pendingOrders}

                    </h2>

                    <p>

                        Pending Orders

                    </p>

                </div>



                <div className="card">

                    <h2>

                        {deliveredOrders}

                    </h2>

                    <p>

                        Delivered

                    </p>

                </div>

            </div>



            <div className="recent-orders">

                <h2>

                    Recent Orders

                </h2>

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Customer</th>

                            <th>Amount</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            orders

                            .slice(0,5)

                            .map(order=>(

                                <tr

                                    key={order._id}

                                >

                                    <td>

                                        {order._id.slice(-6)}

                                    </td>

                                    <td>

                                        {

                                            order.user

                                            ?

                                            `${order.user.firstName} ${order.user.lastName}`

                                            :

                                            "N/A"

                                        }

                                    </td>

                                    <td>

                                        ₹ {order.totalAmount}

                                    </td>

                                    <td>

                                        {order.orderStatus}

                                    </td>

                                    <td>

                                        <Link

                                            to={`/admin/orders/${order._id}`}

                                        >

                                            View

                                        </Link>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

};

export default Dashboard;