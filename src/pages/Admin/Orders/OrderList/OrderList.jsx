import React, { useEffect, useState } from "react";

import "./OrderList.css";

import { useNavigate } from "react-router-dom";

import {

    getAllOrders

} from "../../../../services/orderService";

const OrderList = () => {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchOrders();

    }, []);

    const fetchOrders = async () => {

        try {

            const res = await getAllOrders();

            console.log("All Orders :", res);

            setOrders(res.orders || []);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="admin-orders">

            <h1>All Orders</h1>

            <table>

                <thead>

                    <tr>

                        <th>Order ID</th>

                        <th>Customer</th>

                        <th>Total</th>

                        <th>Order Status</th>

                        <th>Payment</th>

                        <th>Date</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        orders.length === 0 ?

                            (

                                <tr>

                                    <td colSpan="7">

                                        No Orders Found

                                    </td>

                                </tr>

                            )

                            :

                            (

                                orders.map(order => (

                                    <tr key={order._id}>

                                        <td>

                                            {order._id}

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

                                            {order.paymentStatus}

                                        </td>

                                        <td>

                                            {

                                                new Date(

                                                    order.createdAt

                                                ).toLocaleDateString()

                                            }

                                        </td>

                                        <td>

                                            <button

                                                className="view-btn"

                                                onClick={() =>

                                                    navigate(

                                                        `/admin/orders/${order._id}`

                                                    )

                                                }

                                            >

                                                View

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )

                    }

                </tbody>

            </table>

        </div>

    );

};

export default OrderList;