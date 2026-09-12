import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  FileText,
  Laptop,
  Loader2,
  RefreshCw,
  Search,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getMyRentals,
  getRentalById,
} from "../../services/rentalApi";

import RentalStatus from "../../components/rental/RentalStatus";

import "./MyRentals.css";

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getRentalsFromResponse = (response) => {
  const data = response?.data?.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(response?.data?.rentals)) {
    return response.data.rentals;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(data?.rentals)) {
    return data.rentals;
  }

  return [];
};

const getProductName = (rental) => {
  return (
    rental?.productId?.name ||
    rental?.productId?.title ||
    rental?.product?.name ||
    "Rental Laptop"
  );
};

const getProductImage = (rental) => {
  const product = rental?.productId || rental?.product;

  const images = product?.images;

  if (Array.isArray(images) && images.length) {
    const first = images[0];

    if (typeof first === "string") {
      return first;
    }

    if (typeof first === "object") {
      return (
        first?.url ||
        first?.imageUrl ||
        first?.path ||
        first?.src ||
        ""
      );
    }
  }

  return (
    product?.image ||
    product?.primaryImage ||
    product?.thumbnail ||
    ""
  );
};

const buildImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "";

  return `${apiUrl.replace(/\/+$/, "")}/${String(image).replace(
    /^\/+/,
    ""
  )}`;
};

const statusLabel = (status) => {
  const labels = {
    PENDING: "Pending",
    DOCUMENT_VERIFICATION: "Document Verification",
    APPROVED: "Approved",
    DEPOSIT_PENDING: "Deposit Pending",
    READY_FOR_ALLOCATION: "Ready for Allocation",
    ACTIVE: "Active",
    RETURN_REQUESTED: "Return Requested",
    RETURNED: "Returned",
    SETTLEMENT_PENDING: "Settlement Pending",
    COMPLETED: "Completed",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
  };

  return labels[status] || status || "Pending";
};

function MyRentals() {
  const navigate = useNavigate();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  // ==========================================
  // LOAD
  // ==========================================

  const loadRentals = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getMyRentals();

      console.log("My rentals response:", response);

      const list = getRentalsFromResponse(response);

      setRentals(list);
    } catch (error) {
      console.error("Get my rentals error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to load your rentals"
      );

      setRentals([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRentals();
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredRentals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rentals.filter((rental) => {
      const status = String(
        rental?.status || ""
      ).toUpperCase();

      if (
        statusFilter !== "ALL" &&
        status !== statusFilter
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      const productName =
        getProductName(rental).toLowerCase();

      const rentalNumber = String(
        rental?.rentalNumber || ""
      ).toLowerCase();

      return (
        productName.includes(query) ||
        rentalNumber.includes(query) ||
        status.toLowerCase().includes(query)
      );
    });
  }, [rentals, search, statusFilter]);

  // ==========================================
  // STATS
  // ==========================================

  const stats = useMemo(() => {
    const active = rentals.filter(
      (item) => item.status === "ACTIVE"
    ).length;

    const pending = rentals.filter((item) =>
      [
        "PENDING",
        "DOCUMENT_VERIFICATION",
        "APPROVED",
        "DEPOSIT_PENDING",
        "READY_FOR_ALLOCATION",
      ].includes(item.status)
    ).length;

    const completed = rentals.filter((item) =>
      ["COMPLETED", "RETURNED"].includes(
        item.status
      )
    ).length;

    return {
      total: rentals.length,
      active,
      pending,
      completed,
    };
  }, [rentals]);

  // ==========================================
  // DETAIL
  // ==========================================

  const handleOpenRental = async (rental) => {
    if (!rental?._id) {
      return;
    }

    /*
     * List API already populates product/rental product.
     * We still navigate using ID.
     */
    navigate(`/my-rentals/${rental._id}`);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="my-rentals-page">
        <div className="my-rentals-loading">
          <Loader2
            size={38}
            className="my-rentals-spinner"
          />

          <p>Loading your rentals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-rentals-page">
      <div className="my-rentals-container">
        {/* ======================================
            HEADER
        ====================================== */}

        <div className="my-rentals-header">
          <div>
            <span>MY RENTALS</span>

            <h1>Rental Dashboard</h1>

            <p>
              Track your laptop rental requests,
              payments and rental status.
            </p>
          </div>

          <button
            type="button"
            className="my-rentals-refresh"
            onClick={() => loadRentals(true)}
            disabled={refreshing}
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "refresh-spinning"
                  : ""
              }
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* ======================================
            STATS
        ====================================== */}

        <div className="my-rentals-stats">
          <div className="my-rental-stat">
            <div className="stat-icon">
              <FileText size={20} />
            </div>

            <div>
              <span>Total Rentals</span>
              <strong>{stats.total}</strong>
            </div>
          </div>

          <div className="my-rental-stat">
            <div className="stat-icon">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Pending</span>
              <strong>{stats.pending}</strong>
            </div>
          </div>

          <div className="my-rental-stat">
            <div className="stat-icon">
              <Laptop size={20} />
            </div>

            <div>
              <span>Active</span>
              <strong>{stats.active}</strong>
            </div>
          </div>

          <div className="my-rental-stat">
            <div className="stat-icon">
              <WalletCards size={20} />
            </div>

            <div>
              <span>Completed</span>
              <strong>{stats.completed}</strong>
            </div>
          </div>
        </div>

        {/* ======================================
            TOOLBAR
        ====================================== */}

        <div className="my-rentals-toolbar">
          <div className="rental-search-box">
            <Search size={18} />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search rental or laptop..."
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rental-status-filter"
          >
            <option value="ALL">
              All Statuses
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="DOCUMENT_VERIFICATION">
              Document Verification
            </option>

            <option value="APPROVED">
              Approved
            </option>

            <option value="DEPOSIT_PENDING">
              Deposit Pending
            </option>

            <option value="READY_FOR_ALLOCATION">
              Ready for Allocation
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="RETURNED">
              Returned
            </option>

            <option value="SETTLEMENT_PENDING">
              Settlement Pending
            </option>

            <option value="COMPLETED">
              Completed
            </option>

            <option value="REJECTED">
              Rejected
            </option>
          </select>
        </div>

        {/* ======================================
            EMPTY
        ====================================== */}

        {rentals.length === 0 ? (
          <div className="my-rentals-empty">
            <div className="empty-icon">
              <Laptop size={32} />
            </div>

            <h2>No rentals yet</h2>

            <p>
              You haven't submitted any laptop rental
              requests yet.
            </p>

            <button
              type="button"
              onClick={() => navigate("/rentals")}
            >
              Browse Rental Laptops
              <ArrowRight size={17} />
            </button>
          </div>
        ) : filteredRentals.length === 0 ? (
          <div className="my-rentals-empty">
            <div className="empty-icon">
              <Search size={30} />
            </div>

            <h2>No matching rentals</h2>

            <p>
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="my-rentals-list">
            {filteredRentals.map((rental) => {
              const imageUrl = buildImageUrl(
                getProductImage(rental)
              );

              return (
                <article
                  key={rental._id}
                  className="my-rental-card"
                >
                  {/* Product */}

                  <div className="my-rental-product">
                    <div className="my-rental-image">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={getProductName(rental)}
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <Laptop size={35} />
                      )}
                    </div>

                    <div className="my-rental-product-info">
                      <span>RENTAL</span>

                      <h2>
                        {getProductName(rental)}
                      </h2>

                      <p>
                        {rental.rentalNumber ||
                          rental._id}
                      </p>
                    </div>
                  </div>

                  {/* Status */}

                  <div className="my-rental-status">
                    <span>Status</span>

                    <strong
                      className={`status-pill ${String(
                        rental.status || ""
                      ).toLowerCase()}`}
                    >
                      {statusLabel(rental.status)}
                    </strong>
                  </div>

                  {/* Details */}

                  <div className="my-rental-details">
                    <div>
                      <span>Monthly Rent</span>

                      <strong>
                        {formatCurrency(
                          rental.monthlyRent
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Duration</span>

                      <strong>
                        {rental.rentalMonths || "—"}{" "}
                        months
                      </strong>
                    </div>

                    <div>
                      <span>Security Deposit</span>

                      <strong>
                        {formatCurrency(
                          rental.securityDeposit
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Created</span>

                      <strong>
                        {formatDate(
                          rental.createdAt
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Expected End</span>

                      <strong>
                        {formatDate(
                          rental.expectedEndDate
                        )}
                      </strong>
                    </div>
                  </div>

                  {/* Status mini */}

                  <div className="my-rental-status-preview">
                    <RentalStatus
                      status={rental.status}
                    />
                  </div>

                  {/* Button */}

                  <button
                    type="button"
                    className="my-rental-view-button"
                    onClick={() =>
                      handleOpenRental(rental)
                    }
                  >
                    View Rental
                    <ArrowRight size={17} />
                  </button>
                  <button
  type="button"
  onClick={() =>
    navigate(`/rental/documents/${rental._id}`)
  }
>
  Documents
</button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyRentals;