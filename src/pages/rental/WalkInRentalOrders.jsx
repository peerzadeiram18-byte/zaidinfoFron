import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WalkInRentalOrders.css";

import { getAllRentals } from "../../services/rentalApi";

function WalkInRentalOrders() {
    const navigate = useNavigate();

    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // =====================================================
    // LOAD RENTALS
    // =====================================================

    useEffect(() => {
        loadWalkInRentals();
    }, []);

    const loadWalkInRentals = async () => {
        try {
            setLoading(true);
            setError("");

            console.log("================================");
            console.log("LOADING WALK-IN RENTALS");
            console.log("================================");

            const response = await getAllRentals();

            console.log("ALL RENTALS RESPONSE:", response);

            let list = [];

            // ---------------------------------------------
            // SUPPORT MULTIPLE RESPONSE STRUCTURES
            // ---------------------------------------------

            if (Array.isArray(response)) {
                list = response;
            } else if (Array.isArray(response?.rentals)) {
                list = response.rentals;
            } else if (Array.isArray(response?.data)) {
                list = response.data;
            } else if (Array.isArray(response?.data?.rentals)) {
                list = response.data.rentals;
            } else if (Array.isArray(response?.data?.data)) {
                list = response.data.data;
            }

            console.log("ALL RENTALS:", list);

            // ---------------------------------------------
            // ONLY WALK-IN RENTALS
            // ---------------------------------------------

            const walkInRentals = list.filter((rental) => {
                return (
                    String(rental?.rentalSource || "")
                        .trim()
                        .toUpperCase() === "WALK_IN"
                );
            });

            console.log(
                "ONLY WALK-IN RENTALS:",
                walkInRentals
            );

            setRentals(walkInRentals);
        } catch (err) {
            console.error(
                "WALK-IN RENTALS ERROR:",
                err
            );

            setError(
                err?.message ||
                "Failed to load walk-in rental orders"
            );

            setRentals([]);
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // CUSTOMER NAME
    // =====================================================

    const getCustomerName = (rental) => {
        if (
            String(rental?.customerType || "")
                .toUpperCase() === "COMPANY"
        ) {
            return (
                rental?.companyDetails?.contactPerson ||
                rental?.companyDetails?.companyName ||
                "Company Customer"
            );
        }

        return (
            rental?.individualDetails?.fullName ||
            rental?.customer?.name ||
            rental?.customer?.fullName ||
            "Walk-In Customer"
        );
    };

    // =====================================================
    // PHONE
    // =====================================================

    const getCustomerPhone = (rental) => {
        if (
            String(rental?.customerType || "")
                .toUpperCase() === "COMPANY"
        ) {
            return (
                rental?.companyDetails?.phone ||
                "-"
            );
        }

        return (
            rental?.individualDetails?.phone ||
            rental?.customer?.phone ||
            "-"
        );
    };

    // =====================================================
    // EMAIL
    // =====================================================

    const getCustomerEmail = (rental) => {
        if (
            String(rental?.customerType || "")
                .toUpperCase() === "COMPANY"
        ) {
            return (
                rental?.companyDetails?.email ||
                "-"
            );
        }

        return (
            rental?.individualDetails?.email ||
            rental?.customer?.email ||
            "-"
        );
    };

    // =====================================================
    // PRODUCT NAME
    // =====================================================

    const getProductName = (rental) => {
        return (
            rental?.product?.name ||
            rental?.product?.title ||
            rental?.rentalProduct?.product?.name ||
            rental?.rentalProduct?.name ||
            "Rental Product"
        );
    };

    // =====================================================
    // BRAND
    // =====================================================

    const getBrandName = (rental) => {
        const brand =
            rental?.product?.brand ||
            rental?.rentalProduct?.product?.brand;

        if (typeof brand === "object") {
            return (
                brand?.name ||
                brand?.title ||
                ""
            );
        }

        return brand || "";
    };

    // =====================================================
    // RENTAL ID
    // =====================================================

    const getRentalId = (rental) => {
        return (
            rental?._id ||
            rental?.id ||
            rental?.rentalId ||
            ""
        );
    };

    // =====================================================
    // MONTHLY RENT
    // =====================================================

    const getMonthlyRent = (rental) => {
        return Number(
            rental?.monthlyRent ||
            rental?.rentalProduct?.monthlyRent ||
            0
        );
    };

    // =====================================================
    // RENTAL MONTHS
    // =====================================================

    const getRentalMonths = (rental) => {
        return Number(
            rental?.rentalMonths || 1
        );
    };

    // =====================================================
    // SECURITY DEPOSIT
    // =====================================================

    const getSecurityDeposit = (rental) => {
        return Number(
            rental?.securityDeposit || 0
        );
    };

    // =====================================================
    // GST
    // =====================================================

    const getGSTPercentage = (rental) => {
        return Number(
            rental?.gstPercentage ||
            rental?.gst ||
            0
        );
    };

    // =====================================================
    // TOTAL RENT
    // =====================================================

    const getTotalRent = (rental) => {
        const monthlyRent =
            getMonthlyRent(rental);

        const months =
            getRentalMonths(rental);

        return monthlyRent * months;
    };

    // =====================================================
    // TOTAL WITH GST
    // =====================================================

    const getTotalWithGST = (rental) => {
        const totalRent =
            getTotalRent(rental);

        const gstPercentage =
            getGSTPercentage(rental);

        const gstAmount =
            totalRent * gstPercentage / 100;

        return totalRent + gstAmount;
    };

    // =====================================================
    // STATUS
    // =====================================================

    const getStatus = (rental) => {
        return String(
            rental?.status || "PENDING"
        ).toUpperCase();
    };

    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {
        switch (
            String(status || "")
                .toUpperCase()
        ) {
            case "ACTIVE":
                return "active";

            case "RETURNED":
                return "returned";

            case "PENDING":
                return "pending";

            case "REJECTED":
            case "CANCELLED":
                return "cancelled";

            default:
                return "default";
        }
    };

    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (value) => {
        return Number(value || 0).toLocaleString(
            "en-IN"
        );
    };

    // =====================================================
    // FILTER RENTALS
    // =====================================================

    const filteredRentals = useMemo(() => {
        let result = [...rentals];

        // ---------------------------------------------
        // SEARCH
        // ---------------------------------------------

        if (search.trim()) {
            const keyword =
                search.trim().toLowerCase();

            result = result.filter((rental) => {
                const rentalId =
                    String(
                        getRentalId(rental)
                    ).toLowerCase();

                const customer =
                    getCustomerName(
                        rental
                    ).toLowerCase();

                const phone =
                    getCustomerPhone(
                        rental
                    ).toLowerCase();

                const email =
                    getCustomerEmail(
                        rental
                    ).toLowerCase();

                const product =
                    getProductName(
                        rental
                    ).toLowerCase();

                return (
                    rentalId.includes(keyword) ||
                    customer.includes(keyword) ||
                    phone.includes(keyword) ||
                    email.includes(keyword) ||
                    product.includes(keyword)
                );
            });
        }

        // ---------------------------------------------
        // DATE
        // ---------------------------------------------

        if (selectedDate) {
            result = result.filter((rental) => {
                if (!rental?.createdAt) {
                    return false;
                }

                const rentalDate =
                    new Date(
                        rental.createdAt
                    )
                        .toISOString()
                        .split("T")[0];

                return rentalDate === selectedDate;
            });
        }

        // ---------------------------------------------
        // STATUS
        // ---------------------------------------------

        if (statusFilter !== "ALL") {
            result = result.filter((rental) => {
                return (
                    getStatus(rental) ===
                    statusFilter
                );
            });
        }

        return result;
    }, [
        rentals,
        search,
        selectedDate,
        statusFilter
    ]);

    // =====================================================
    // SUMMARY
    // =====================================================

    const totalRent = filteredRentals.reduce(
        (sum, rental) =>
            sum + getTotalWithGST(rental),
        0
    );

    const totalDeposit =
        filteredRentals.reduce(
            (sum, rental) =>
                sum +
                getSecurityDeposit(rental),
            0
        );

    const activeRentals =
        filteredRentals.filter(
            (rental) =>
                getStatus(rental) === "ACTIVE"
        ).length;

    // =====================================================
    // VIEW
    // =====================================================
const viewRental = (rental) => {
    const rentalId = getRentalId(rental);

    if (!rentalId) {
        console.error("Rental ID missing:", rental);
        return;
    }

    navigate(
        `/receptionist-dashboard/rental/orders/${rentalId}`,
        {
            state: {
                rental
            }
        }
    );
};
    // =====================================================
    // NEW RENTAL
    // =====================================================

  const createNewRental = () => {
    navigate("/receptionist-dashboard/rental/new");
};

const printInvoice = (rental) => {
    const rentalId = getRentalId(rental);

    if (!rentalId) {
        alert("Rental ID not found");
        return;
    }

    navigate(
        `/receptionist-dashboard/walk-in-invoice/${rentalId}`,
        {
            state: { rental },
        }
    );
};
    // =====================================================
    // INVOICE
    // =====================================================

    // const printInvoice = (rental) => {
    //     const rentalId =
    //         getRentalId(rental);

    //     if (!rentalId) {
    //         console.error(
    //             "Rental ID missing"
    //         );

    //         return;
    //     }

    //     navigate(
    //         `/receptionist/rental/walkin-invoice/${rentalId}`,
    //         {
    //             state: {
    //                 rental
    //             }
    //         }
    //     );
    // };

    // =====================================================
    // RETURN
    // =====================================================

  const returnRental = (rental) => {
    const rentalId = getRentalId(rental);

    if (!rentalId) {
        console.error("Rental ID missing:", rental);
        return;
    }

    console.log("Opening rental return page:", rentalId);

    navigate(
        `/receptionist-dashboard/rental/orders/${rentalId}/return`,
        {
            state: {
                rental
            }
        }
    );
};

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="walkin-rental-orders-page">

            {/* =========================================
                HEADER
            ========================================== */}

            <div className="rental-orders-header">

                <div>
                    <h2>
                        Walk-In Rental Orders
                    </h2>

                    <p>
                        Manage all walk-in laptop
                        rental customers
                    </p>
                </div>

                <button
                    className="new-rental-btn"
                    onClick={createNewRental}
                >
                    + New Walk-In Rental
                </button>

            </div>

            {/* =========================================
                ERROR
            ========================================== */}

            {error && (
                <div className="rental-error-box">
                    {error}
                </div>
            )}

            {/* =========================================
                FILTERS
            ========================================== */}

            <div className="rental-filter-section">

                <input
                    type="text"
                    placeholder="Search customer / phone / rental ID / laptop"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) =>
                        setSelectedDate(
                            e.target.value
                        )
                    }
                />

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
                    }
                >
                    <option value="ALL">
                        All Status
                    </option>

                    <option value="ACTIVE">
                        Active
                    </option>

                    <option value="PENDING">
                        Pending
                    </option>

                    <option value="RETURNED">
                        Returned
                    </option>

                    <option value="REJECTED">
                        Rejected
                    </option>

                    <option value="CANCELLED">
                        Cancelled
                    </option>
                </select>

                <button
                    className="refresh-btn"
                    onClick={loadWalkInRentals}
                >
                    Refresh
                </button>

            </div>

            {/* =========================================
                SUMMARY
            ========================================== */}

            <div className="rental-summary-box">

                <div className="rental-summary-card">

                    <h3>
                        {filteredRentals.length}
                    </h3>

                    <p>
                        Total Rentals
                    </p>

                </div>

                <div className="rental-summary-card">

                    <h3>
                        {activeRentals}
                    </h3>

                    <p>
                        Active Rentals
                    </p>

                </div>

                <div className="rental-summary-card">

                    <h3>
                        ₹ {formatMoney(totalRent)}
                    </h3>

                    <p>
                        Rental Amount
                    </p>

                </div>

                <div className="rental-summary-card">

                    <h3>
                        ₹ {formatMoney(totalDeposit)}
                    </h3>

                    <p>
                        Security Deposit
                    </p>

                </div>

            </div>

            {/* =========================================
                TABLE
            ========================================== */}

            <div className="rental-orders-table-wrapper">

                <table className="rental-orders-table">

                    <thead>

                        <tr>

                            <th>
                                Rental ID
                            </th>

                            <th>
                                Date
                            </th>

                            <th>
                                Customer
                            </th>

                            <th>
                                Phone
                            </th>

                            <th>
                                Laptop
                            </th>

                            <th>
                                Duration
                            </th>

                            <th>
                                Monthly Rent
                            </th>

                            <th>
                                Deposit
                            </th>

                            <th>
                                Total
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>
                                <td
                                    colSpan="11"
                                    className="table-message"
                                >
                                    Loading Walk-In
                                    Rentals...
                                </td>
                            </tr>

                        ) : filteredRentals.length === 0 ? (

                            <tr>
                                <td
                                    colSpan="11"
                                    className="table-message"
                                >
                                    No Walk-In Rental
                                    Orders Found
                                </td>
                            </tr>

                        ) : (

                            filteredRentals.map(
                                (rental) => {

                                    const rentalId =
                                        getRentalId(
                                            rental
                                        );

                                    const status =
                                        getStatus(
                                            rental
                                        );

                                    return (
                                        <tr
                                            key={
                                                rentalId
                                            }
                                        >

                                            {/* ID */}

                                            <td>
                                                <strong>
                                                    #
                                                    {String(
                                                        rentalId
                                                    ).slice(-8)}
                                                </strong>
                                            </td>

                                            {/* DATE */}

                                            <td>
                                                {rental?.createdAt
                                                    ? new Date(
                                                        rental.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN"
                                                    )
                                                    : "-"}
                                            </td>

                                            {/* CUSTOMER */}

                                            <td>

                                                <div className="customer-cell">

                                                    <strong>
                                                        {
                                                            getCustomerName(
                                                                rental
                                                            )
                                                        }
                                                    </strong>

                                                    <small>
                                                        {
                                                            rental?.customerType ||
                                                            "INDIVIDUAL"
                                                        }
                                                    </small>

                                                </div>

                                            </td>

                                            {/* PHONE */}

                                            <td>
                                                {
                                                    getCustomerPhone(
                                                        rental
                                                    )
                                                }
                                            </td>

                                            {/* PRODUCT */}

                                            <td>

                                                <div className="product-cell">

                                                    <strong>
                                                        {
                                                            getProductName(
                                                                rental
                                                            )
                                                        }
                                                    </strong>

                                                    {getBrandName(
                                                        rental
                                                    ) && (

                                                        <small>
                                                            {
                                                                getBrandName(
                                                                    rental
                                                                )
                                                            }
                                                        </small>

                                                    )}

                                                </div>

                                            </td>

                                            {/* MONTHS */}

                                            <td>
                                                {
                                                    getRentalMonths(
                                                        rental
                                                    )
                                                }{" "}
                                                month
                                            </td>

                                            {/* MONTHLY RENT */}

                                            <td>
                                                ₹{" "}
                                                {formatMoney(
                                                    getMonthlyRent(
                                                        rental
                                                    )
                                                )}
                                            </td>

                                            {/* DEPOSIT */}

                                            <td>
                                                ₹{" "}
                                                {formatMoney(
                                                    getSecurityDeposit(
                                                        rental
                                                    )
                                                )}
                                            </td>

                                            {/* TOTAL */}

                                            <td>
                                                <strong>
                                                    ₹{" "}
                                                    {formatMoney(
                                                        getTotalWithGST(
                                                            rental
                                                        )
                                                    )}
                                                </strong>
                                            </td>

                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        `rental-status ${getStatusClass(
                                                            status
                                                        )}`
                                                    }
                                                >
                                                    {status}
                                                </span>

                                            </td>

                                            {/* ACTION */}

                                            <td>

                                                <div className="rental-action-buttons">

                                                    <button
                                                        className="view-btn"
                                                        onClick={() =>
                                                            viewRental(
                                                                rental
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        className="print-btn"
                                                        onClick={() =>
                                                            printInvoice(
                                                                rental
                                                            )
                                                        }
                                                    >
                                                        Invoice
                                                    </button>

                                                    {status ===
                                                        "ACTIVE" && (

                                                        <button
                                                            className="return-btn"
                                                            onClick={() =>
                                                                returnRental(
                                                                    rental
                                                                )
                                                            }
                                                        >
                                                            Return
                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                }
                            )

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default WalkInRentalOrders;