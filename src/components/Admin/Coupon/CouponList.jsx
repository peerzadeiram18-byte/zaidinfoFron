import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    toast
} from "react-toastify";

import {
    MdAdd,
    MdEdit,
    MdDelete,
    MdRefresh,
    MdSearch,
    MdLocalOffer
} from "react-icons/md";

import {
    getCoupons,
    deleteCoupon
} from "../../../services/couponService";

import "./CouponList.css";


// ======================================================
// COUPON LIST
// ======================================================

const CouponList = () => {

    const navigate = useNavigate();


    // ==================================================
    // STATES
    // ==================================================

    const [coupons, setCoupons] =
        useState([]);

    const [filteredCoupons, setFilteredCoupons] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [deletingId, setDeletingId] =
        useState(null);

    const [search, setSearch] =
        useState("");


    // ==================================================
    // LOAD COUPONS
    // ==================================================

    const loadCoupons = async () => {

        try {

            setLoading(true);

            const response =
                await getCoupons();

            console.log(
                "GET COUPONS RESPONSE:",
                response
            );


            /*
             * Backend response:
             *
             * {
             *   success: true,
             *   coupons: [...]
             * }
             */

            const couponData =
                Array.isArray(
                    response?.coupons
                )
                    ? response.coupons
                    : Array.isArray(response)
                        ? response
                        : [];


            setCoupons(couponData);

            setFilteredCoupons(
                couponData
            );

        }
        catch (error) {

            console.error(
                "GET COUPONS ERROR:",
                error
            );


            toast.error(

                error?.response?.data?.message ||

                error?.message ||

                "Failed to load coupons"

            );

            setCoupons([]);

            setFilteredCoupons([]);

        }
        finally {

            setLoading(false);

        }

    };


    // ==================================================
    // INITIAL LOAD
    // ==================================================

    useEffect(() => {

        loadCoupons();

    }, []);


    // ==================================================
    // SEARCH
    // ==================================================

    useEffect(() => {

        const searchValue =
            search
                .trim()
                .toLowerCase();


        if (!searchValue) {

            setFilteredCoupons(
                coupons
            );

            return;

        }


        const result =
            coupons.filter(
                (coupon) => {

                    const code =
                        String(
                            coupon?.code || ""
                        ).toLowerCase();


                    const description =
                        String(
                            coupon?.description || ""
                        ).toLowerCase();


                    return (

                        code.includes(
                            searchValue
                        )

                        ||

                        description.includes(
                            searchValue
                        )

                    );

                }
            );


        setFilteredCoupons(
            result
        );

    }, [
        search,
        coupons
    ]);


    // ==================================================
    // FORMAT DATE
    // ==================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return "-";

        }


        return parsedDate.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // ==================================================
    // DISCOUNT DISPLAY
    // ==================================================

    const getDiscountText = (
        coupon
    ) => {

        if (
            coupon?.discountType ===
            "PERCENTAGE"
        ) {

            return `${coupon.discountValue}%`;

        }


        if (
            coupon?.discountType ===
            "FIXED"
        ) {

            return `₹${Number(
                coupon.discountValue || 0
            ).toLocaleString("en-IN")}`;

        }


        return "-";

    };


    // ==================================================
    // STATUS
    // ==================================================

    const getStatus = (
        coupon
    ) => {

        const now =
            new Date();

        const startDate =
            coupon?.startDate
                ? new Date(
                    coupon.startDate
                )
                : null;

        const endDate =
            coupon?.endDate
                ? new Date(
                    coupon.endDate
                )
                : null;


        /*
         * Backend status has priority.
         */

        if (
            coupon?.status ===
            "INACTIVE"
        ) {

            return "INACTIVE";

        }


        if (
            coupon?.status ===
            "EXPIRED"
        ) {

            return "EXPIRED";

        }


        /*
         * If ACTIVE but date expired
         */

        if (
            endDate &&
            now > endDate
        ) {

            return "EXPIRED";

        }


        /*
         * If start date is future
         */

        if (
            startDate &&
            now < startDate
        ) {

            return "UPCOMING";

        }


        return "ACTIVE";

    };


    // ==================================================
    // DELETE COUPON
    // ==================================================

    const handleDelete = async (
        coupon
    ) => {

        if (!coupon?._id) {

            toast.error(
                "Coupon ID not found"
            );

            return;

        }


        const confirmed =
            window.confirm(

                `Are you sure you want to delete coupon "${coupon.code}"?`

            );


        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(
                coupon._id
            );


            await deleteCoupon(
                coupon._id
            );


            toast.success(
                "Coupon deleted successfully"
            );


            /*
             * Remove from local state
             * immediately.
             */

            setCoupons(
                (prev) =>
                    prev.filter(
                        (item) =>
                            item._id !==
                            coupon._id
                    )
            );

        }
        catch (error) {

            console.error(
                "DELETE COUPON ERROR:",
                error
            );


            toast.error(

                error?.response?.data?.message ||

                error?.message ||

                "Failed to delete coupon"

            );

        }
        finally {

            setDeletingId(null);

        }

    };


    // ==================================================
    // EDIT
    // ==================================================

    const handleEdit = (
        coupon
    ) => {

        if (!coupon?._id) {

            toast.error(
                "Coupon ID not found"
            );

            return;

        }


        /*
         * Your App.jsx should have:
         *
         * /admin/coupons/edit/:id
         *
         * when EditCoupon page is created.
         */

        navigate(
            `/admin/coupons/edit/${coupon._id}`
        );

    };


    // ==================================================
    // ADD COUPON
    // ==================================================

    const handleAddCoupon = () => {

        navigate(
            "/admin/add-coupon"
        );

    };


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div className="coupon-list-page">


            {/* =========================================
                HEADER
            ========================================== */}

            <div className="coupon-list-header">

                <div className="coupon-heading">

                    <div className="coupon-heading-icon">
                        <MdLocalOffer />
                    </div>


                    <div>

                        <h2>
                            Coupons
                        </h2>

                        <p>
                            Manage discount coupons
                        </p>

                    </div>

                </div>


                <div className="coupon-header-actions">

                    <button
                        type="button"
                        className="coupon-refresh-btn"
                        onClick={loadCoupons}
                        disabled={loading}
                    >

                        <MdRefresh />

                        {loading
                            ? "Loading..."
                            : "Refresh"
                        }

                    </button>


                    <button
                        type="button"
                        className="coupon-add-btn"
                        onClick={
                            handleAddCoupon
                        }
                    >

                        <MdAdd />

                        Add Coupon

                    </button>

                </div>

            </div>


            {/* =========================================
                SEARCH
            ========================================== */}

            <div className="coupon-toolbar">

                <div className="coupon-search">

                    <MdSearch />

                    <input
                        type="text"
                        placeholder="Search coupon code or description..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>


                <div className="coupon-count">

                    Total Coupons:
                    <strong>
                        {" "}
                        {coupons.length}
                    </strong>

                </div>

            </div>


            {/* =========================================
                CONTENT
            ========================================== */}

            <div className="coupon-table-card">


                {/* =====================================
                    LOADING
                ====================================== */}

                {loading ? (

                    <div className="coupon-loading">

                        <div className="coupon-spinner" />

                        <p>
                            Loading coupons...
                        </p>

                    </div>

                ) : filteredCoupons.length === 0 ? (

                    /* =================================
                       EMPTY
                    ================================= */

                    <div className="coupon-empty">

                        <div className="coupon-empty-icon">

                            <MdLocalOffer />

                        </div>


                        {search ? (

                            <>

                                <h3>
                                    No coupons found
                                </h3>

                                <p>
                                    No coupon matches
                                    your search.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                >
                                    Clear Search
                                </button>

                            </>

                        ) : (

                            <>

                                <h3>
                                    No coupons yet
                                </h3>

                                <p>
                                    Create your first
                                    coupon to offer
                                    discounts to customers.
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        handleAddCoupon
                                    }
                                >

                                    <MdAdd />

                                    Create Coupon

                                </button>

                            </>

                        )}

                    </div>

                ) : (

                    /* =================================
                       TABLE
                    ================================= */

                    <div className="coupon-table-wrapper">

                        <table className="coupon-table">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Coupon
                                    </th>

                                    <th>
                                        Discount
                                    </th>

                                    <th>
                                        Min Cart
                                    </th>

                                    <th>
                                        Usage
                                    </th>

                                    <th>
                                        Per User
                                    </th>

                                    <th>
                                        Validity
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredCoupons.map(
                                    (
                                        coupon,
                                        index
                                    ) => {

                                        const status =
                                            getStatus(
                                                coupon
                                            );


                                        const usedCount =
                                            Number(
                                                coupon?.usedCount ||
                                                0
                                            );


                                        const usageLimit =
                                            coupon?.usageLimit;


                                        return (

                                            <tr
                                                key={
                                                    coupon?._id ||
                                                    index
                                                }
                                            >


                                                {/* ==================
                                                    NUMBER
                                                =================== */}

                                                <td>

                                                    <span className="coupon-number">

                                                        {index + 1}

                                                    </span>

                                                </td>


                                                {/* ==================
                                                    COUPON
                                                =================== */}

                                                <td>

                                                    <div className="coupon-code-wrapper">

                                                        <strong>
                                                            {coupon?.code ||
                                                                "-"}
                                                        </strong>


                                                        {coupon?.description && (

                                                            <span>

                                                                {
                                                                    coupon.description
                                                                }

                                                            </span>

                                                        )}

                                                    </div>

                                                </td>


                                                {/* ==================
                                                    DISCOUNT
                                                =================== */}

                                                <td>

                                                    <div className="coupon-discount">

                                                        <strong>
                                                            {
                                                                getDiscountText(
                                                                    coupon
                                                                )
                                                            }
                                                        </strong>


                                                        {coupon?.discountType ===
                                                            "PERCENTAGE" &&
                                                            coupon?.maxDiscountAmount !==
                                                            null &&
                                                            coupon?.maxDiscountAmount !==
                                                            undefined && (

                                                                <small>

                                                                    Max ₹
                                                                    {Number(
                                                                        coupon.maxDiscountAmount ||
                                                                        0
                                                                    ).toLocaleString(
                                                                        "en-IN"
                                                                    )}

                                                                </small>

                                                            )}

                                                    </div>

                                                </td>


                                                {/* ==================
                                                    MIN CART
                                                =================== */}

                                                <td>

                                                    ₹
                                                    {Number(
                                                        coupon?.minCartValue ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}

                                                </td>


                                                {/* ==================
                                                    USAGE
                                                =================== */}

                                                <td>

                                                    <div className="usage-cell">

                                                        <strong>
                                                            {
                                                                usedCount
                                                            }
                                                        </strong>

                                                        <span>
                                                            /
                                                            {usageLimit ===
                                                                null ||
                                                                usageLimit ===
                                                                undefined
                                                                ? "∞"
                                                                : usageLimit}
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* ==================
                                                    PER USER
                                                =================== */}

                                                <td>

                                                    {
                                                        coupon?.usageLimitPerUser ??
                                                        1
                                                    }

                                                </td>


                                                {/* ==================
                                                    VALIDITY
                                                =================== */}

                                                <td>

                                                    <div className="validity-cell">

                                                        <span>
                                                            <b>
                                                                Start:
                                                            </b>{" "}

                                                            {
                                                                formatDate(
                                                                    coupon?.startDate
                                                                )
                                                            }
                                                        </span>


                                                        <span>
                                                            <b>
                                                                End:
                                                            </b>{" "}

                                                            {
                                                                formatDate(
                                                                    coupon?.endDate
                                                                )
                                                            }
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* ==================
                                                    STATUS
                                                =================== */}

                                                <td>

                                                    <span
                                                        className={
                                                            `coupon-status status-${status.toLowerCase()}`
                                                        }
                                                    >

                                                        {status}

                                                    </span>

                                                </td>


                                                {/* ==================
                                                    ACTIONS
                                                =================== */}

                                                <td>

                                                    <div className="coupon-actions">


                                                        <button
                                                            type="button"
                                                            className="coupon-edit-btn"
                                                            title="Edit Coupon"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    coupon
                                                                )
                                                            }
                                                        >

                                                            <MdEdit />

                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="coupon-delete-btn"
                                                            title="Delete Coupon"
                                                            disabled={
                                                                deletingId ===
                                                                coupon?._id
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    coupon
                                                                )
                                                            }
                                                        >

                                                            {deletingId ===
                                                            coupon?._id ? (

                                                                <span className="mini-spinner" />

                                                            ) : (

                                                                <MdDelete />

                                                            )}

                                                        </button>


                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

};


export default CouponList;