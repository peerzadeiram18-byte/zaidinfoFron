

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./PurchaseBillList.css";


// ======================================================
// API BASE
// ======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";


// ======================================================
// HELPERS
// ======================================================

const PAYMENT_TABS = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "PARTIAL", label: "Partial" },
  { value: "PAID", label: "Paid" },
];

const PAYMENT_LABELS = {
  PENDING: "Pending",
  PARTIAL: "Partial",
  PAID: "Paid",
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


// ======================================================
// COMPONENT
// ======================================================

function PurchaseBillList() {

  const navigate = useNavigate();


  // ====================================================
  // STATE
  // ====================================================

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [paymentTab, setPaymentTab] = useState("ALL");


  // ====================================================
  // LOAD PURCHASE BILLS
  // ====================================================

  const loadPurchases = async () => {

    setLoading(true);
    setError("");

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/purchase`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load purchase bills"
        );
      }

      setPurchases(result.data || []);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {
    loadPurchases();
  }, []);


  // ====================================================
  // TAB COUNTS
  // ====================================================

  const counts = useMemo(() => {

    const result = {
      ALL: purchases.length,
    };

    purchases.forEach((purchase) => {

      result[purchase.paymentStatus] =
        (result[purchase.paymentStatus] || 0) + 1;

    });

    return result;

  }, [purchases]);


  // ====================================================
  // FILTER
  // ====================================================

  const filteredPurchases = useMemo(() => {

    const term = search.trim().toLowerCase();

    return purchases.filter((purchase) => {

      // Payment status filter
      if (
        paymentTab !== "ALL" &&
        purchase.paymentStatus !== paymentTab
      ) {
        return false;
      }


      // Search filter
      if (!term) return true;

      return (
        purchase.purchaseNumber
          ?.toLowerCase()
          .includes(term) ||

        purchase.vendorName
          ?.toLowerCase()
          .includes(term) ||

        purchase.vendorInvoiceNumber
          ?.toLowerCase()
          .includes(term)
      );

    });

  }, [purchases, paymentTab, search]);


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="pb-list-page">

      {/* ================= HEADER ================= */}

      <div className="pb-list-header">

        <div>
          <h1>Purchase bills</h1>

          <p>
            Vendor invoices recorded in the procurement system
          </p>
        </div>


        <button
          type="button"
          className="pb-list-create"
          onClick={() => navigate("/add-purchase-bill")}
        >
          + Add purchase bill
        </button>

      </div>


      {/* ================= PAYMENT TABS ================= */}

      <div
        className="pb-list-tabs"
        role="tablist"
      >

        {PAYMENT_TABS.map((tab) => (

          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={paymentTab === tab.value}
            className={`pb-list-tab ${
              paymentTab === tab.value ? "active" : ""
            }`}
            onClick={() => setPaymentTab(tab.value)}
          >

            {tab.label}

            <span className="pb-list-tab-count">
              {counts[tab.value] || 0}
            </span>

          </button>

        ))}

      </div>


      {/* ================= SEARCH ================= */}

      <div className="pb-list-toolbar">

        <input
          type="text"
          placeholder="Search by purchase number, vendor or invoice number..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

      </div>


      {/* ================= LOADING ================= */}

      {loading && (
        <div className="pb-list-state">
          Loading purchase bills...
        </div>
      )}


      {/* ================= ERROR ================= */}

      {!loading && error && (
        <div className="pb-list-state error">
          {error}
        </div>
      )}


      {/* ================= EMPTY ================= */}

      {!loading &&
        !error &&
        filteredPurchases.length === 0 && (

          <div className="pb-list-state">

            {purchases.length === 0
              ? "No purchase bills yet. Add one to get started."
              : "No purchase bills match your filters."}

          </div>

        )}


      {/* ================= TABLE ================= */}

      {!loading &&
        !error &&
        filteredPurchases.length > 0 && (

          <div className="pb-list-table-wrapper">

            <table className="pb-list-table">

              <thead>

                <tr>

                  <th>Purchase number</th>

                  <th>Vendor</th>

                  <th>Invoice number</th>

                  <th>Items</th>

                  <th className="num">
                    Total
                  </th>

                  <th>Verification</th>

                  <th>Payment</th>

                  <th>Created</th>

                </tr>

              </thead>


              <tbody>

                {filteredPurchases.map((purchase) => (

                  <tr
                    key={purchase._id}
                    onClick={() =>
                      navigate(
                        `/purchase-bills/${purchase._id}`
                      )
                    }
                  >

                    <td className="pb-list-number">
                      {purchase.purchaseNumber || "—"}
                    </td>


                    <td>
                      {purchase.vendorName || "—"}
                    </td>


                    <td>
                      {purchase.vendorInvoiceNumber || "—"}
                    </td>


                    <td>
                      {purchase.items?.length || 0}
                    </td>


                    <td className="num">
                      {formatMoney(
                        purchase.totalAmount
                      )}
                    </td>


                    <td>

                      <span
                        className={`pb-list-badge ${
                          purchase.verified
                            ? "pb-list-badge-verified"
                            : "pb-list-badge-unverified"
                        }`}
                      >
                        {purchase.verified
                          ? "Verified"
                          : "Unverified"}
                      </span>

                    </td>


                    <td>

                      <span
                        className={`pb-list-badge pb-list-badge-${(
                          purchase.paymentStatus || "PENDING"
                        ).toLowerCase()}`}
                      >
                        {
                          PAYMENT_LABELS[
                            purchase.paymentStatus
                          ] ||
                          purchase.paymentStatus ||
                          "Pending"
                        }
                      </span>

                    </td>


                    <td>
                      {formatDate(
                        purchase.createdAt
                      )}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

    </div>
  );
}


export default PurchaseBillList;