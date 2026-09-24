import React, { useState } from "react";

import { getShipmentTracking } from "../../../services/shipmentApi";


const DispatchBlueDart = ({
    order,
    onSuccess,
}) => {

    const [open, setOpen] = useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const [form, setForm] = useState({

        shipmentType: "B2C",

        blueDartProduct: "ECOM_AIR",

        pieceCount: 1,

        actualWeight: "",

        length: "",

        breadth: "",

        height: "",

    });


    // =================================================
    // HANDLE INPUT
    // =================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setForm((prev) => ({

            ...prev,

            [name]: value,

        }));

    };


    // =================================================
    // B2B / B2C
    // =================================================

    const handleShipmentTypeChange = (
        type
    ) => {

        setForm((prev) => ({

            ...prev,

            shipmentType: type,

            blueDartProduct:
                type === "B2B"
                    ? "APEX"
                    : "ECOM_AIR",

        }));

    };


    // =================================================
    // DISPATCH
    // =================================================

    const handleDispatch = async () => {

        setError("");


        if (!order?._id) {

            setError(
                "Order ID is missing"
            );

            return;

        }


        if (!form.actualWeight) {

            setError(
                "Please enter actual weight"
            );

            return;

        }


        if (!form.length) {

            setError(
                "Please enter package length"
            );

            return;

        }


        if (!form.breadth) {

            setError(
                "Please enter package breadth"
            );

            return;

        }


        if (!form.height) {

            setError(
                "Please enter package height"
            );

            return;

        }


        try {

            setLoading(true);


            const response =
                await dispatchViaBlueDart({

                    orderId:
                        order._id,

                    blueDartProduct:
                        form.blueDartProduct,

                    packageDetails: {

                        pieceCount:
                            Number(
                                form.pieceCount
                            ),

                        actualWeight:
                            Number(
                                form.actualWeight
                            ),

                        length:
                            Number(
                                form.length
                            ),

                        breadth:
                            Number(
                                form.breadth
                            ),

                        height:
                            Number(
                                form.height
                            ),

                    },

                });


            console.log(
                "BLUE DART DISPATCH RESPONSE:",
                response
            );


            if (
                response?.success
            ) {

                setOpen(false);


                if (onSuccess) {

                    onSuccess(
                        response
                    );

                }


                alert(
                    `Shipment Created Successfully\n\n` +
                    `Courier: Blue Dart\n` +
                    `AWB: ${
                        response?.shipment
                            ?.trackingNumber ||
                        "N/A"
                    }\n` +
                    `Status: ${
                        response?.shipment
                            ?.shipmentStatus ||
                        "SHIPPED"
                    }`
                );


            } else {

                setError(

                    response?.message ||

                    "Unable to create shipment"

                );

            }


        } catch (err) {

            console.error(
                "BLUE DART DISPATCH ERROR:",
                err
            );


            setError(

                err?.response?.data?.message ||

                err?.message ||

                "Unable to dispatch shipment"

            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <>

            {/* ======================================
                DISPATCH BUTTON
            ====================================== */}

            <button

                type="button"

                onClick={() => {

                    setError("");

                    setOpen(true);

                }}

            >

                🚚 Dispatch via Blue Dart

            </button>


            {/* ======================================
                MODAL
            ====================================== */}

            {open && (

                <div
                    className="shipment-modal"
                >

                    <div
                        className="shipment-modal-card"
                    >

                        <h2>
                            Dispatch via Blue Dart
                        </h2>


                        {error && (

                            <div
                                className="shipment-error"
                            >

                                {error}

                            </div>

                        )}


                        {/* =========================
                            B2B / B2C
                        ========================= */}

                        <div>

                            <label>
                                Shipment Type
                            </label>


                            <div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleShipmentTypeChange(
                                            "B2B"
                                        )
                                    }
                                >
                                    B2B
                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        handleShipmentTypeChange(
                                            "B2C"
                                        )
                                    }
                                >
                                    B2C
                                </button>

                            </div>

                        </div>


                        {/* =========================
                            SERVICE
                        ========================= */}

                        <div>

                            <label>
                                Blue Dart Service
                            </label>


                            <select

                                name="blueDartProduct"

                                value={
                                    form.blueDartProduct
                                }

                                onChange={
                                    handleChange
                                }

                            >

                                {form.shipmentType ===
                                "B2B" ? (

                                    <>

                                        <option value="APEX">
                                            APEX
                                        </option>

                                        <option value="SURFACE">
                                            SURFACE
                                        </option>

                                    </>

                                ) : (

                                    <>

                                        <option value="ECOM_AIR">
                                            ECOM AIR
                                        </option>

                                        <option value="ECOM_LITE_SURFACE">
                                            ECOM LITE SURFACE
                                        </option>

                                    </>

                                )}

                            </select>

                        </div>


                        {/* =========================
                            PIECES
                        ========================= */}

                        <div>

                            <label>
                                Pieces
                            </label>


                            <input

                                type="number"

                                min="1"

                                name="pieceCount"

                                value={
                                    form.pieceCount
                                }

                                onChange={
                                    handleChange
                                }

                            />

                        </div>


                        {/* =========================
                            WEIGHT
                        ========================= */}

                        <div>

                            <label>
                                Actual Weight (KG)
                            </label>


                            <input

                                type="number"

                                step="0.01"

                                min="0"

                                name="actualWeight"

                                value={
                                    form.actualWeight
                                }

                                onChange={
                                    handleChange
                                }

                                placeholder="Example: 0.5"

                            />

                        </div>


                        {/* =========================
                            LENGTH
                        ========================= */}

                        <div>

                            <label>
                                Length (CM)
                            </label>


                            <input

                                type="number"

                                min="0"

                                name="length"

                                value={
                                    form.length
                                }

                                onChange={
                                    handleChange
                                }

                            />

                        </div>


                        {/* =========================
                            BREADTH
                        ========================= */}

                        <div>

                            <label>
                                Breadth (CM)
                            </label>


                            <input

                                type="number"

                                min="0"

                                name="breadth"

                                value={
                                    form.breadth
                                }

                                onChange={
                                    handleChange
                                }

                            />

                        </div>


                        {/* =========================
                            HEIGHT
                        ========================= */}

                        <div>

                            <label>
                                Height (CM)
                            </label>


                            <input

                                type="number"

                                min="0"

                                name="height"

                                value={
                                    form.height
                                }

                                onChange={
                                    handleChange
                                }

                            />

                        </div>


                        {/* =========================
                            ACTIONS
                        ========================= */}

                        <div>

                            <button

                                type="button"

                                onClick={() =>
                                    setOpen(false)
                                }

                                disabled={
                                    loading
                                }

                            >

                                Cancel

                            </button>


                            <button

                                type="button"

                                onClick={
                                    handleDispatch
                                }

                                disabled={
                                    loading
                                }

                            >

                                {loading

                                    ? "Dispatching..."

                                    : "Dispatch"

                                }

                            </button>

                        </div>


                    </div>

                </div>

            )}

        </>

    );

};


export default DispatchBlueDart;