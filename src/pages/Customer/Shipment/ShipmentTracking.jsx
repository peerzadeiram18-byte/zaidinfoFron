import React, {
    useEffect,
    useState,
} from "react";

import {
    useParams,
} from "react-router-dom";

import { getShipmentTracking } from "../../../services/shipmentApi";


const ShipmentTracking = () => {

    const {
        shipmentId,
    } = useParams();


    const [data, setData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");


    const loadTracking = async (
        isRefresh = false
    ) => {

        try {

            setError("");

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }


            const response =
                await getShipmentTracking(
                    shipmentId
                );

            setData(
                response?.tracking ||
                response?.shipment ||
                response
            );

        } catch (err) {

            console.error(
                "Tracking error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load shipment tracking"
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {

        if (shipmentId) {
            loadTracking();
        }

    }, [shipmentId]);


    if (loading) {
        return (
            <div>
                Loading shipment tracking...
            </div>
        );
    }


    if (error) {
        return (
            <div>
                <p>{error}</p>

                <button
                    onClick={() =>
                        loadTracking(true)
                    }
                >
                    Try Again
                </button>
            </div>
        );
    }


    if (!data) {
        return (
            <div>
                Shipment information not available.
            </div>
        );
    }


    return (

        <div className="shipment-tracking">

            <div className="shipment-header">

                <h1>
                    Track Shipment
                </h1>

                <button
                    onClick={() =>
                        loadTracking(true)
                    }
                    disabled={refreshing}
                >
                    {refreshing
                        ? "Refreshing..."
                        : "Refresh Tracking"}
                </button>

            </div>


            <div className="shipment-summary">

                <div>
                    <span>
                        Courier
                    </span>

                    <strong>
                        {data.courierPartner ||
                            "Blue Dart"}
                    </strong>
                </div>


                <div>
                    <span>
                        AWB
                    </span>

                    <strong>
                        {data.trackingNumber ||
                            data.awbNumber ||
                            "-"}
                    </strong>
                </div>


                <div>
                    <span>
                        Current Status
                    </span>

                    <strong>
                        {data.currentStatus ||
                            data.status ||
                            "-"}
                    </strong>
                </div>


                <div>
                    <span>
                        Current Location
                    </span>

                    <strong>
                        {data.currentLocation ||
                            data.location ||
                            "-"}
                    </strong>
                </div>


                <div>
                    <span>
                        Last Updated
                    </span>

                    <strong>
                        {data.lastUpdated
                            ? new Date(
                                data.lastUpdated
                            ).toLocaleString(
                                "en-IN"
                            )
                            : "-"}
                    </strong>
                </div>

            </div>


            <div className="tracking-history">

                <h2>
                    Tracking History
                </h2>


                {Array.isArray(
                    data.history
                ) &&
                data.history.length > 0 ? (

                    data.history.map(
                        (item, index) => (

                            <div
                                className="tracking-item"
                                key={
                                    item._id ||
                                    index
                                }
                            >

                                <div>
                                    <strong>
                                        {item.status ||
                                            item.description ||
                                            "-"}
                                    </strong>

                                    <p>
                                        {item.location ||
                                            "-"}
                                    </p>
                                </div>


                                <span>
                                    {item.timestamp
                                        ? new Date(
                                            item.timestamp
                                        ).toLocaleString(
                                            "en-IN"
                                        )
                                        : "-"}
                                </span>

                            </div>

                        )
                    )

                ) : (

                    <p>
                        No tracking history available.
                    </p>

                )}

            </div>

        </div>
    );
};


export default ShipmentTracking;