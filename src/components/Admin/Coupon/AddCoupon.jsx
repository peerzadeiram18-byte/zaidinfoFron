import React, {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    toast
} from "react-toastify";

import {
    createCoupon
} from "../../../services/couponService";

import "./AddCoupon.css";


const AddCoupon = () => {

    const navigate =
        useNavigate();


    // ==================================================
    // STATES
    // ==================================================

    const [loading, setLoading] =
        useState(false);


    const [formData, setFormData] =
        useState({

            code: "",

            description: "",

            discountType:
                "PERCENTAGE",

            discountValue: "",

            maxDiscountAmount: "",

            minCartValue: "",

            usageLimit: "",

            usageLimitPerUser: "1",

            startDate: "",

            endDate: "",

            status: "ACTIVE"

        });


    // ==================================================
    // HANDLE INPUT
    // ==================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData(
            (prev) => ({

                ...prev,

                [name]:
                    name === "code"
                        ? value.toUpperCase()
                        : value

            })
        );

    };


    // ==================================================
    // SUBMIT
    // ==================================================

    const handleSubmit = async (
        e
    ) => {

        e.preventDefault();


        // ----------------------------------------------
        // CODE
        // ----------------------------------------------

        if (
            !formData.code.trim()
        ) {

            toast.error(
                "Coupon code is required"
            );

            return;

        }


        // ----------------------------------------------
        // DISCOUNT VALUE
        // ----------------------------------------------

        const discountValue =
            Number(
                formData.discountValue
            );


        if (
            !Number.isFinite(
                discountValue
            ) ||
            discountValue < 0
        ) {

            toast.error(
                "Enter valid discount value"
            );

            return;

        }


        // ----------------------------------------------
        // PERCENTAGE
        // ----------------------------------------------

        if (
            formData.discountType ===
            "PERCENTAGE" &&
            discountValue > 100
        ) {

            toast.error(
                "Percentage cannot be more than 100%"
            );

            return;

        }


        // ----------------------------------------------
        // DATES
        // ----------------------------------------------

        if (
            !formData.startDate
        ) {

            toast.error(
                "Start date is required"
            );

            return;

        }


        if (
            !formData.endDate
        ) {

            toast.error(
                "End date is required"
            );

            return;

        }


        if (
            new Date(
                formData.endDate
            ) <=
            new Date(
                formData.startDate
            )
        ) {

            toast.error(
                "End date must be after start date"
            );

            return;

        }


        // ----------------------------------------------
        // CREATE PAYLOAD
        // ----------------------------------------------

        const payload = {

            code:
                formData.code
                    .trim()
                    .toUpperCase(),

            description:
                formData.description
                    .trim(),

            discountType:
                formData.discountType,

            discountValue:
                discountValue,

            maxDiscountAmount:
                formData.maxDiscountAmount === ""
                    ? null
                    : Number(
                        formData.maxDiscountAmount
                    ),

            minCartValue:
                formData.minCartValue === ""
                    ? 0
                    : Number(
                        formData.minCartValue
                    ),

            usageLimit:
                formData.usageLimit === ""
                    ? null
                    : Number(
                        formData.usageLimit
                    ),

            usageLimitPerUser:
                formData.usageLimitPerUser === ""
                    ? 1
                    : Number(
                        formData.usageLimitPerUser
                    ),

            startDate:
                formData.startDate,

            endDate:
                formData.endDate,

            status:
                formData.status

        };


        console.log(
            "CREATE COUPON PAYLOAD:",
            payload
        );


        // ----------------------------------------------
        // API
        // ----------------------------------------------

        try {

            setLoading(true);


            const response =
                await createCoupon(
                    payload
                );


            console.log(
                "CREATE COUPON RESPONSE:",
                response
            );


            if (
                response?.success
            ) {

                toast.success(
                    "Coupon created successfully"
                );


                navigate(
                    "/admin/coupons"
                );

            }
            else {

                toast.error(
                    response?.message ||
                    "Failed to create coupon"
                );

            }

        }
        catch (error) {

            console.error(
                "CREATE COUPON ERROR:",
                error
            );


            toast.error(

                error.response?.data?.message ||

                error.message ||

                "Failed to create coupon"

            );

        }
        finally {

            setLoading(false);

        }

    };


    // ==================================================
    // UI
    // ==================================================

    return (

        <div className="add-coupon-page">

            <div className="add-coupon-card">

                <h2>
                    Create Coupon
                </h2>

                <p>
                    Create a discount coupon for customers
                </p>


                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    {/* =================================
                        CODE
                    ================================= */}

                    <div className="form-group">

                        <label>
                            Coupon Code
                        </label>

                        <input
                            type="text"
                            name="code"
                            value={
                                formData.code
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="e.g. SAVE20"
                        />

                    </div>


                    {/* =================================
                        DESCRIPTION
                    ================================= */}

                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter coupon description"
                            rows="3"
                        />

                    </div>


                    {/* =================================
                        DISCOUNT TYPE
                    ================================= */}

                    <div className="form-group">

                        <label>
                            Discount Type
                        </label>

                        <select
                            name="discountType"
                            value={
                                formData.discountType
                            }
                            onChange={
                                handleChange
                            }
                        >

                            <option value="PERCENTAGE">
                                Percentage
                            </option>

                            <option value="FIXED">
                                Fixed Amount
                            </option>

                        </select>

                    </div>


                    {/* =================================
                        DISCOUNT VALUE
                    ================================= */}

                    <div className="form-group">

                        <label>
                            Discount Value
                        </label>

                        <input
                            type="number"
                            name="discountValue"
                            value={
                                formData.discountValue
                            }
                            onChange={
                                handleChange
                            }
                            min="0"
                            max={
                                formData.discountType ===
                                "PERCENTAGE"
                                    ? "100"
                                    : undefined
                            }
                            placeholder={
                                formData.discountType ===
                                "PERCENTAGE"
                                    ? "20"
                                    : "500"
                            }
                        />

                    </div>


                    {/* =================================
                        MAX DISCOUNT
                    ================================= */}

                    {formData.discountType ===
                        "PERCENTAGE" && (

                        <div className="form-group">

                            <label>
                                Maximum Discount Amount
                            </label>

                            <input
                                type="number"
                                name="maxDiscountAmount"
                                value={
                                    formData.maxDiscountAmount
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                placeholder="e.g. 500"
                            />

                            <small>
                                Leave empty for no maximum limit.
                            </small>

                        </div>

                    )}


                    {/* =================================
                        MIN CART VALUE
                    ================================= */}

                    <div className="form-group">

                        <label>
                            Minimum Cart Value
                        </label>

                        <input
                            type="number"
                            name="minCartValue"
                            value={
                                formData.minCartValue
                            }
                            onChange={
                                handleChange
                            }
                            min="0"
                            placeholder="e.g. 1000"
                        />

                    </div>


                    {/* =================================
                        TOTAL USAGE LIMIT
                    ================================= */}

                    <div className="form-group">

                        <label>
                            Total Usage Limit
                        </label>

                        <input
                            type="number"
                            name="usageLimit"
                            value={
                                formData.usageLimit
                            }
                            onChange={
                                handleChange
                            }
                            min="1"
                            placeholder="Leave empty for unlimited"
                        />

                    </div>


                    {/* =================================
                        PER USER LIMIT
                    ================================= */}

                    <div className="form-group">

                        <label>
                            Usage Limit Per User
                        </label>

                        <input
                            type="number"
                            name="usageLimitPerUser"
                            value={
                                formData.usageLimitPerUser
                            }
                            onChange={
                                handleChange
                            }
                            min="1"
                        />

                    </div>


                    {/* =================================
                        START DATE
                    ================================= */}

                    <div className="form-group">

                        <label>
                            Start Date
                        </label>

                        <input
                            type="datetime-local"
                            name="startDate"
                            value={
                                formData.startDate
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>


                    {/* =================================
                        END DATE
                    ================================= */}

                    <div className="form-group">

                        <label>
                            End Date
                        </label>

                        <input
                            type="datetime-local"
                            name="endDate"
                            value={
                                formData.endDate
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>


                    {/* =================================
                        STATUS
                    ================================= */}

                    <div className="form-group">

                        <label>
                            Status
                        </label>

                        <select
                            name="status"
                            value={
                                formData.status
                            }
                            onChange={
                                handleChange
                            }
                        >

                            <option value="ACTIVE">
                                ACTIVE
                            </option>

                            <option value="INACTIVE">
                                INACTIVE
                            </option>

                        </select>

                    </div>


                    {/* =================================
                        BUTTONS
                    ================================= */}

                    <div className="coupon-actions">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/coupons"
                                )
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating..."
                                : "Create Coupon"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};


export default AddCoupon;