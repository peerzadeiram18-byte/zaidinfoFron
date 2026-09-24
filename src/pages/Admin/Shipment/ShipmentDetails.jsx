import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    RefreshCw,
    Package,
    Truck,
    MapPin,
    Clock,
    CheckCircle2,
    Circle,
    Weight,
    Box,
} from "lucide-react";

import {
    getShipment,
    getShipmentTracking,
} from "../../../services/shipmentApi";

import "./ShipmentDetails.css";


const ShipmentDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();


    const [shipment, setShipment] =
        useState(null);

    const [tracking, setTracking] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD SHIPMENT
    // =====================================================

    const loadShipment = useCallback(
        async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await getShipment(id);


                console.log(
                    "SHIPMENT DETAILS RESPONSE:",
                    response
                );


                const data =
                    response?.shipment ||
                    response?.data?.shipment ||
                    response?.data ||
                    response ||
                    null;


                setShipment(data);


            } catch (err) {

                console.error(
                    "SHIPMENT DETAILS ERROR:",
                    err
                );


                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load shipment"
                );


                setShipment(null);

            } finally {

                setLoading(false);

            }

        },
        [id]
    );


    // =====================================================
    // LOAD LIVE TRACKING
    // =====================================================

    const loadTracking = useCallback(
        async (
            showRefreshLoader = false
        ) => {

            try {

                if (showRefreshLoader) {

                    setRefreshing(true);

                }


                setError("");


                const response =
                    await getShipmentTracking(id);


                console.log(
                    "SHIPMENT TRACKING RESPONSE:",
                    response
                );


                const data =
                    response?.tracking ||
                    response?.data?.tracking ||
                    response?.shipment ||
                    response?.data ||
                    response ||
                    null;


                setTracking(data);


            } catch (err) {

                console.error(
                    "SHIPMENT TRACKING ERROR:",
                    err
                );


                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load tracking"
                );

            } finally {

                setRefreshing(false);

            }

        },
        [id]
    );


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        if (!id) {
            return;
        }


        const load = async () => {

            await loadShipment();

            await loadTracking();

        };


        load();

    }, [
        id,
        loadShipment,
        loadTracking,
    ]);


    // =====================================================
    // REFRESH TRACKING
    // =====================================================

    const handleRefreshTracking =
        async () => {

            await loadTracking(true);

        };


    // =====================================================
    // BACK
    // =====================================================

    const handleBack = () => {

        navigate(-1);

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="shipment-details-page">

                <div className="shipment-loading">

                    <RefreshCw
                        size={24}
                        className="shipment-spin"
                    />

                    <p>
                        Loading shipment...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // NOT FOUND
    // =====================================================

    if (!shipment) {

        return (

            <div className="shipment-details-page">

                <div className="shipment-error-page">

                    <h2>
                        Shipment Not Found
                    </h2>

                    <p>
                        {error ||
                            "Shipment information is not available."}
                    </p>


                    <button
                        type="button"
                        onClick={handleBack}
                    >
                        <ArrowLeft
                            size={18}
                        />

                        Back

                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // NORMALIZED VALUES
    // =====================================================

    const trackingNumber =
        shipment?.trackingNumber ||
        shipment?.awbNumber ||
        shipment?.awb ||
        "-";


    const courier =
        shipment?.courierPartner ||
        shipment?.courier ||
        "BLUE_DART";


    const product =
        shipment?.blueDartProduct ||
        shipment?.service ||
        shipment?.product ||
        "-";


    const shipmentStatus =
        shipment?.shipmentStatus ||
        shipment?.status ||
        tracking?.currentStatus ||
        tracking?.status ||
        "CREATED";


    const currentStatus =
        tracking?.currentStatus ||
        tracking?.status ||
        shipment?.currentStatus ||
        shipmentStatus ||
        "-";


    const currentLocation =
        tracking?.currentLocation ||
        tracking?.location ||
        shipment?.currentLocation ||
        "-";


    const lastUpdated =
        tracking?.lastUpdated ||
        tracking?.updatedAt ||
        shipment?.lastTrackedAt ||
        shipment?.updatedAt ||
        null;


    const packageDetails =
        shipment?.packageDetails ||
        {};


    const pieceCount =
        packageDetails?.pieceCount ||
        shipment?.pieceCount ||
        0;


    const actualWeight =
        packageDetails?.actualWeight ??
        shipment?.actualWeight ??
        0;


    const length =
        packageDetails?.length ??
        shipment?.length ??
        0;


    const breadth =
        packageDetails?.breadth ??
        shipment?.breadth ??
        0;


    const height =
        packageDetails?.height ??
        shipment?.height ??
        0;


    // =====================================================
    // TRACKING HISTORY
    // =====================================================

    const trackingHistory =
        tracking?.history ||
        tracking?.trackingHistory ||
        shipment?.trackingHistory ||
        [];


    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        try {

            return new Date(
                date
            ).toLocaleString(
                "en-IN",
                {
                    dateStyle: "medium",
                    timeStyle: "short",
                }
            );

        } catch {

            return "-";

        }

    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (
        status
    ) => {

        const value =
            String(status || "")
                .toLowerCase();


        if (
            value.includes("deliver")
        ) {
            return "status-delivered";
        }


        if (
            value.includes("transit") ||
            value.includes("picked") ||
            value.includes("shipped")
        ) {
            return "status-transit";
        }


        if (
            value.includes("cancel") ||
            value.includes("fail")
        ) {
            return "status-failed";
        }


        return "status-created";

    };


    return (

        <div className="shipment-details-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="shipment-page-header">

                <div className="shipment-header-left">

                    <button
                        type="button"
                        className="shipment-back-btn"
                        onClick={handleBack}
                    >

                        <ArrowLeft
                            size={19}
                        />

                        Back

                    </button>


                    <div>

                        <h1>
                            Shipment Details
                        </h1>

                        <p>
                            Blue Dart shipment
                            information
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="shipment-refresh-btn"
                    onClick={
                        handleRefreshTracking
                    }
                    disabled={refreshing}
                >

                    <RefreshCw
                        size={17}
                        className={
                            refreshing
                                ? "shipment-spin"
                                : ""
                        }
                    />

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh Tracking"}

                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="shipment-warning">

                    {error}

                </div>

            )}


            {/* =================================================
                MAIN SUMMARY
            ================================================= */}

            <div className="shipment-summary-grid">


                {/* COURIER */}

                <div className="shipment-summary-card">

                    <div className="shipment-card-icon">

                        <Truck
                            size={22}
                        />

                    </div>


                    <div>

                        <span>
                            Courier
                        </span>

                        <strong>
                            Blue Dart
                        </strong>

                    </div>

                </div>


                {/* AWB */}

                <div className="shipment-summary-card">

                    <div className="shipment-card-icon">

                        <Package
                            size={22}
                        />

                    </div>


                    <div>

                        <span>
                            AWB / Tracking Number
                        </span>

                        <strong>
                            {trackingNumber}
                        </strong>

                    </div>

                </div>


                {/* STATUS */}

                <div className="shipment-summary-card">

                    <div className="shipment-card-icon">

                        <CheckCircle2
                            size={22}
                        />

                    </div>


                    <div>

                        <span>
                            Shipment Status
                        </span>

                        <strong
                            className={
                                getStatusClass(
                                    shipmentStatus
                                )
                            }
                        >
                            {shipmentStatus}
                        </strong>

                    </div>

                </div>


                {/* LOCATION */}

                <div className="shipment-summary-card">

                    <div className="shipment-card-icon">

                        <MapPin
                            size={22}
                        />

                    </div>


                    <div>

                        <span>
                            Current Location
                        </span>

                        <strong>
                            {currentLocation}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                SHIPMENT INFORMATION
            ================================================= */}

            <div className="shipment-content-grid">


                {/* =================================================
                    LEFT
                ================================================= */}

                <div className="shipment-main-column">


                    {/* SHIPMENT INFORMATION */}

                    <div className="shipment-panel">

                        <div className="shipment-panel-header">

                            <div>

                                <h2>
                                    Shipment Information
                                </h2>

                                <p>
                                    Blue Dart dispatch
                                    details
                                </p>

                            </div>

                        </div>


                        <div className="shipment-info-grid">


                            <div className="shipment-info-item">

                                <span>
                                    Courier Partner
                                </span>

                                <strong>
                                    {courier ===
                                    "BLUE_DART"
                                        ? "Blue Dart"
                                        : courier}
                                </strong>

                            </div>


                            <div className="shipment-info-item">

                                <span>
                                    Blue Dart Product
                                </span>

                                <strong>
                                    {product}
                                </strong>

                            </div>


                            <div className="shipment-info-item">

                                <span>
                                    AWB Number
                                </span>

                                <strong>
                                    {trackingNumber}
                                </strong>

                            </div>


                            <div className="shipment-info-item">

                                <span>
                                    Shipment Status
                                </span>

                                <strong
                                    className={
                                        getStatusClass(
                                            shipmentStatus
                                        )
                                    }
                                >
                                    {shipmentStatus}
                                </strong>

                            </div>


                            <div className="shipment-info-item">

                                <span>
                                    Current Status
                                </span>

                                <strong>
                                    {currentStatus}
                                </strong>

                            </div>


                            <div className="shipment-info-item">

                                <span>
                                    Current Location
                                </span>

                                <strong>
                                    {currentLocation}
                                </strong>

                            </div>


                            <div className="shipment-info-item">

                                <span>
                                    Last Updated
                                </span>

                                <strong>
                                    {formatDate(
                                        lastUpdated
                                    )}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* PACKAGE DETAILS */}

                    <div className="shipment-panel">

                        <div className="shipment-panel-header">

                            <div>

                                <h2>
                                    Package Details
                                </h2>

                                <p>
                                    Package information
                                </p>

                            </div>

                        </div>


                        <div className="package-grid">


                            <div className="package-item">

                                <Box
                                    size={20}
                                />

                                <div>

                                    <span>
                                        Pieces
                                    </span>

                                    <strong>
                                        {pieceCount}
                                    </strong>

                                </div>

                            </div>


                            <div className="package-item">

                                <Weight
                                    size={20}
                                />

                                <div>

                                    <span>
                                        Actual Weight
                                    </span>

                                    <strong>
                                        {actualWeight}
                                        {" "}KG
                                    </strong>

                                </div>

                            </div>


                            <div className="package-item">

                                <div>

                                    <span>
                                        Length
                                    </span>

                                    <strong>
                                        {length}
                                        {" "}CM
                                    </strong>

                                </div>

                            </div>


                            <div className="package-item">

                                <div>

                                    <span>
                                        Breadth
                                    </span>

                                    <strong>
                                        {breadth}
                                        {" "}CM
                                    </strong>

                                </div>

                            </div>


                            <div className="package-item">

                                <div>

                                    <span>
                                        Height
                                    </span>

                                    <strong>
                                        {height}
                                        {" "}CM
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* TRACKING HISTORY */}

                    <div className="shipment-panel">

                        <div className="shipment-panel-header">

                            <div>

                                <h2>
                                    Tracking History
                                </h2>

                                <p>
                                    Latest Blue Dart
                                    shipment updates
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    handleRefreshTracking
                                }
                                disabled={
                                    refreshing
                                }
                                className="small-refresh-btn"
                            >

                                <RefreshCw
                                    size={15}
                                    className={
                                        refreshing
                                            ? "shipment-spin"
                                            : ""
                                    }
                                />

                                Refresh

                            </button>

                        </div>


                        {trackingHistory.length >
                        0 ? (

                            <div className="tracking-timeline">

                                {trackingHistory.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <div
                                            className="tracking-timeline-item"
                                            key={
                                                item?._id ||
                                                item?.id ||
                                                index
                                            }
                                        >

                                            <div className="timeline-icon">

                                                {index ===
                                                0 ? (

                                                    <CheckCircle2
                                                        size={18}
                                                    />

                                                ) : (

                                                    <Circle
                                                        size={15}
                                                    />

                                                )}

                                            </div>


                                            <div className="timeline-content">

                                                <div className="timeline-top">

                                                    <strong>
                                                        {
                                                            item?.status ||
                                                            item?.description ||
                                                            "Shipment Update"
                                                        }
                                                    </strong>


                                                    <span>
                                                        {formatDate(
                                                            item?.timestamp ||
                                                            item?.date ||
                                                            item?.updatedAt
                                                        )}
                                                    </span>

                                                </div>


                                                {(
                                                    item?.location ||
                                                    item?.city
                                                ) && (

                                                    <p>

                                                        <MapPin
                                                            size={14}
                                                        />

                                                        {
                                                            item?.location ||
                                                            item?.city
                                                        }

                                                    </p>

                                                )}


                                                {item?.description &&
                                                item?.status &&
                                                item.description !==
                                                    item.status && (

                                                    <small>
                                                        {
                                                            item.description
                                                        }
                                                    </small>

                                                )}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <div className="empty-tracking">

                                <Clock
                                    size={30}
                                />

                                <h3>
                                    No Tracking History
                                </h3>

                                <p>
                                    Blue Dart tracking
                                    history is not
                                    available yet.
                                </p>

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                    RIGHT SIDEBAR
                ================================================= */}

                <div className="shipment-side-column">


                    {/* CURRENT STATUS */}

                    <div className="shipment-panel status-panel">

                        <h2>
                            Current Shipment Status
                        </h2>


                        <div className="current-status-icon">

                            <Truck
                                size={28}
                            />

                        </div>


                        <h3>
                            {currentStatus}
                        </h3>


                        <p>

                            <MapPin
                                size={15}
                            />

                            {currentLocation}

                        </p>


                        <span className="last-updated">

                            <Clock
                                size={14}
                            />

                            Last updated:

                            {" "}

                            {formatDate(
                                lastUpdated
                            )}

                        </span>

                    </div>


                    {/* ORDER */}

                    <div className="shipment-panel">

                        <h2>
                            Order
                        </h2>


                        <div className="order-reference">

                            <Package
                                size={19}
                            />


                            <div>

                                <span>
                                    Order ID
                                </span>

                                <strong>
                                    {shipment?.orderId?._id ||
                                        shipment?.orderId ||
                                        shipment?.order?._id ||
                                        "-"}
                                </strong>

                            </div>

                        </div>


                        {(
                            shipment?.orderId?._id ||
                            shipment?.order?._id
                        ) && (

                            <button
                                type="button"
                                className="view-order-btn"
                                onClick={() => {

                                    const orderId =
                                        shipment?.orderId?._id ||
                                        shipment?.order?._id;

                                    navigate(
                                        `/order/${orderId}`
                                    );

                                }}
                            >

                                View Order

                            </button>

                        )}

                    </div>


                    {/* TRACKING NOTE */}

                    <div className="shipment-panel shipment-note">

                        <h3>
                            Blue Dart Tracking
                        </h3>

                        <p>
                            Tracking information
                            is fetched from the
                            backend and updated
                            from Blue Dart.
                        </p>


                        <button
                            type="button"
                            onClick={
                                handleRefreshTracking
                            }
                            disabled={
                                refreshing
                            }
                        >

                            <RefreshCw
                                size={16}
                                className={
                                    refreshing
                                        ? "shipment-spin"
                                        : ""
                                }
                            />

                            {refreshing
                                ? "Updating..."
                                : "Update Tracking"}

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

};


export default ShipmentDetails;