import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  Eye,
  IndianRupee,
  CreditCard,
  Wallet,
  Building2,
  Smartphone,
  X,
} from "lucide-react";

import {
  getAllPayments,
  markPaymentSuccess,
  markPaymentFailed,
  refundPayment,
} from "../../services/accountantPaymentService";

import { toast } from "react-toastify";

const SalesPaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [typeFilter, setTypeFilter] =
    useState("ALL");

  const [selectedPayment, setSelectedPayment] =
    useState(null);

  const [showRefund, setShowRefund] =
    useState(false);

  const [refundAmount, setRefundAmount] =
    useState("");

  const [refundReason, setRefundReason] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(false);

  // ============================================
  // LOAD PAYMENTS
  // ============================================

  const loadPayments = async () => {
    try {
      setLoading(true);

      const response =
        await getAllPayments();

      const data =
        response?.data ||
        response?.payments ||
        response ||
        [];

      setPayments(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load payments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // ============================================
  // HELPERS
  // ============================================

  const getStatus = (payment) => {
    return (
      payment?.paymentStatus ||
      payment?.status ||
      "PENDING"
    ).toUpperCase();
  };

  const getPaymentFor = (payment) => {
    return (
      payment?.paymentFor ||
      "ORDER"
    ).toUpperCase();
  };

  const getCustomerName = (payment) => {
    if (payment?.user) {
      if (
        typeof payment.user === "object"
      ) {
        return (
          `${payment.user.firstName || ""} ${
            payment.user.lastName || ""
          }`.trim() ||
          payment.user.name ||
          payment.user.email ||
          "Customer"
        );
      }
    }

    return "Customer";
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(Number(amount || 0));
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const statusClass = (status) => {
    switch (status) {
      case "SUCCESS":
      case "PAID":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      case "REFUNDED":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const paymentIcon = (method) => {
    const value =
      String(method || "").toUpperCase();

    if (value.includes("CASH")) {
      return <Wallet size={17} />;
    }

    if (
      value.includes("BANK") ||
      value.includes("NEFT") ||
      value.includes("RTGS") ||
      value.includes("IMPS")
    ) {
      return <Building2 size={17} />;
    }

    if (
      value.includes("UPI") ||
      value.includes("PHONE") ||
      value.includes("GPAY")
    ) {
      return <Smartphone size={17} />;
    }

    return <CreditCard size={17} />;
  };

  // ============================================
  // FILTER
  // ============================================

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const status =
        getStatus(payment);

      const paymentFor =
        getPaymentFor(payment);

      const customer =
        getCustomerName(payment);

      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        !search ||
        customer
          .toLowerCase()
          .includes(searchValue) ||
        String(
          payment?.receiptNumber || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          payment?.transactionId || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(
          payment?.referenceId || ""
        )
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        status === statusFilter;

      const matchesType =
        typeFilter === "ALL" ||
        paymentFor === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    payments,
    search,
    statusFilter,
    typeFilter,
  ]);

  // ============================================
  // SUMMARY
  // ============================================

  const summary = useMemo(() => {
    const success = payments.filter(
      (p) =>
        getStatus(p) === "SUCCESS" ||
        getStatus(p) === "PAID"
    );

    const pending = payments.filter(
      (p) => getStatus(p) === "PENDING"
    );

    const refunded = payments.filter(
      (p) => getStatus(p) === "REFUNDED"
    );

    return {
      total: payments.reduce(
        (sum, p) =>
          sum + Number(p.amount || 0),
        0
      ),

      collected: success.reduce(
        (sum, p) =>
          sum + Number(p.amount || 0),
        0
      ),

      pending: pending.reduce(
        (sum, p) =>
          sum + Number(p.amount || 0),
        0
      ),

      refunded: refunded.reduce(
        (sum, p) =>
          sum +
          Number(
            p.refundedAmount || 0
          ),
        0
      ),
    };
  }, [payments]);

  // ============================================
  // MARK SUCCESS
  // ============================================

  const handleSuccess = async (payment) => {
    try {
      setActionLoading(true);

      await markPaymentSuccess(
        payment._id,
        {
          transactionId:
            payment.transactionId || "",
          gatewayPaymentId:
            payment.gatewayPaymentId || "",
          gateway:
            payment.gateway || "MANUAL",
          gatewayResponse: {},
        }
      );

      toast.success(
        "Payment marked as successful"
      );

      setSelectedPayment(null);

      await loadPayments();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to update payment"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================
  // MARK FAILED
  // ============================================

  const handleFailed = async (payment) => {
    const reason =
      window.prompt(
        "Enter failure reason:"
      );

    if (!reason) return;

    try {
      setActionLoading(true);

      await markPaymentFailed(
        payment._id,
        {
          reason,
        }
      );

      toast.success(
        "Payment marked as failed"
      );

      setSelectedPayment(null);

      await loadPayments();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to update payment"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================
  // REFUND
  // ============================================

  const handleRefund = async () => {
    if (!selectedPayment) return;

    const amount =
      Number(refundAmount);

    if (!amount || amount <= 0) {
      toast.error(
        "Enter valid refund amount"
      );
      return;
    }

    if (
      amount >
      Number(selectedPayment.amount || 0)
    ) {
      toast.error(
        "Refund amount cannot exceed payment amount"
      );
      return;
    }

    if (!refundReason.trim()) {
      toast.error(
        "Refund reason is required"
      );
      return;
    }

    try {
      setActionLoading(true);

      await refundPayment(
        selectedPayment._id,
        {
          refundReason,
          refundedAmount: amount,
        }
      );

      toast.success(
        "Refund record updated successfully"
      );

      setShowRefund(false);
      setRefundAmount("");
      setRefundReason("");
      setSelectedPayment(null);

      await loadPayments();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Refund failed"
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Sales & Payment Management
          </h1>

          <p className="text-gray-500 mt-1">
            Verify payments, track pending
            collections and maintain refund records.
          </p>
        </div>

        <button
          onClick={loadPayments}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Total Collection"
          value={formatMoney(
            summary.total
          )}
          icon={
            <IndianRupee size={22} />
          }
        />

        <SummaryCard
          title="Collected"
          value={formatMoney(
            summary.collected
          )}
          icon={
            <CheckCircle size={22} />
          }
        />

        <SummaryCard
          title="Pending"
          value={formatMoney(
            summary.pending
          )}
          icon={<Clock size={22} />}
        />

        <SummaryCard
          title="Refunded"
          value={formatMoney(
            summary.refunded
          )}
          icon={
            <RotateCcw size={22} />
          }
        />
      </div>

      {/* FILTER */}

      <div className="bg-white rounded-xl shadow-sm border p-4 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search receipt, customer, transaction..."
              className="w-full border rounded-lg pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="border rounded-lg px-3 py-2.5 outline-none"
          >
            <option value="ALL">
              All Payment Status
            </option>
            <option value="PENDING">
              Pending
            </option>
            <option value="SUCCESS">
              Success
            </option>
            <option value="FAILED">
              Failed
            </option>
            <option value="REFUNDED">
              Refunded
            </option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(
                e.target.value
              )
            }
            className="border rounded-lg px-3 py-2.5 outline-none"
          >
            <option value="ALL">
              All Modules
            </option>
            <option value="ORDER">
              Sales
            </option>
            <option value="REPAIR">
              Repair
            </option>
            <option value="RENTAL">
              Rental
            </option>
          </select>
        </div>
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm">
                  Receipt
                </th>

                <th className="text-left px-4 py-3 text-sm">
                  Customer
                </th>

                <th className="text-left px-4 py-3 text-sm">
                  For
                </th>

                <th className="text-left px-4 py-3 text-sm">
                  Amount
                </th>

                <th className="text-left px-4 py-3 text-sm">
                  Method
                </th>

                <th className="text-left px-4 py-3 text-sm">
                  Status
                </th>

                <th className="text-left px-4 py-3 text-sm">
                  Date
                </th>

                <th className="text-right px-4 py-3 text-sm">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-12"
                  >
                    Loading payments...
                  </td>
                </tr>
              ) : filteredPayments.length ===
                0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-12 text-gray-500"
                  >
                    No payments found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(
                  (payment) => {
                    const status =
                      getStatus(payment);

                    return (
                      <tr
                        key={payment._id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="px-4 py-4 font-medium">
                          {payment.receiptNumber ||
                            "-"}
                        </td>

                        <td className="px-4 py-4">
                          <div className="font-medium">
                            {getCustomerName(
                              payment
                            )}
                          </div>

                          <div className="text-xs text-gray-500">
                            {payment?.user?.email ||
                              "-"}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium">
                            {getPaymentFor(
                              payment
                            )}
                          </span>
                        </td>

                        <td className="px-4 py-4 font-semibold">
                          {formatMoney(
                            payment.amount
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {paymentIcon(
                              payment.paymentMethod
                            )}

                            <span>
                              {payment.paymentMethod ||
                                "-"}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          {formatDate(
                            payment.paymentDate ||
                              payment.createdAt
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                setSelectedPayment(
                                  payment
                                )
                              }
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                              title="View"
                            >
                              <Eye
                                size={17}
                              />
                            </button>

                            {status ===
                              "PENDING" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleSuccess(
                                      payment
                                    )
                                  }
                                  className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                                  title="Mark Success"
                                >
                                  <CheckCircle
                                    size={17}
                                  />
                                </button>

                                <button
                                  onClick={() =>
                                    handleFailed(
                                      payment
                                    )
                                  }
                                  className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                                  title="Mark Failed"
                                >
                                  <XCircle
                                    size={17}
                                  />
                                </button>
                              </>
                            )}

                            {(status ===
                              "SUCCESS" ||
                              status === "PAID") && (
                              <button
                                onClick={() => {
                                  setSelectedPayment(
                                    payment
                                  );

                                  setRefundAmount(
                                    String(
                                      payment.amount ||
                                        ""
                                    )
                                  );

                                  setShowRefund(
                                    true
                                  );
                                }}
                                className="p-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200"
                                title="Refund"
                              >
                                <RotateCcw
                                  size={17}
                                />
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

      {/* DETAILS MODAL */}

      {selectedPayment &&
        !showRefund && (
          <div className="fixed inset-0 z-[2000] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b">
                <h2 className="text-xl font-bold">
                  Payment Details
                </h2>

                <button
                  onClick={() =>
                    setSelectedPayment(null)
                  }
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Detail
                  label="Receipt Number"
                  value={
                    selectedPayment.receiptNumber
                  }
                />

                <Detail
                  label="Payment For"
                  value={
                    selectedPayment.paymentFor
                  }
                />

                <Detail
                  label="Amount"
                  value={formatMoney(
                    selectedPayment.amount
                  )}
                />

                <Detail
                  label="Payment Method"
                  value={
                    selectedPayment.paymentMethod
                  }
                />

                <Detail
                  label="Status"
                  value={
                    selectedPayment.paymentStatus
                  }
                />

                <Detail
                  label="Transaction ID"
                  value={
                    selectedPayment.transactionId ||
                    "-"
                  }
                />

                <Detail
                  label="Gateway"
                  value={
                    selectedPayment.gateway ||
                    "-"
                  }
                />

                <Detail
                  label="Payment Date"
                  value={formatDate(
                    selectedPayment.paymentDate
                  )}
                />

                <div className="md:col-span-2">
                  <Detail
                    label="Reference ID"
                    value={
                      selectedPayment.referenceId
                    }
                  />
                </div>

                {selectedPayment.refundedAmount >
                  0 && (
                  <div className="md:col-span-2">
                    <Detail
                      label="Refunded Amount"
                      value={formatMoney(
                        selectedPayment.refundedAmount
                      )}
                    />
                  </div>
                )}

                {selectedPayment.refundReason && (
                  <div className="md:col-span-2">
                    <Detail
                      label="Refund Reason"
                      value={
                        selectedPayment.refundReason
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* REFUND MODAL */}

      {showRefund &&
        selectedPayment && (
          <div className="fixed inset-0 z-[2100] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md">
              <div className="flex items-center justify-between p-5 border-b">
                <h2 className="text-xl font-bold">
                  Record Refund
                </h2>

                <button
                  onClick={() =>
                    setShowRefund(false)
                  }
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Original Amount
                  </label>

                  <div className="p-3 rounded-lg bg-gray-100 font-semibold">
                    {formatMoney(
                      selectedPayment.amount
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Refund Amount
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={refundAmount}
                    onChange={(e) =>
                      setRefundAmount(
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Refund Reason
                  </label>

                  <textarea
                    value={refundReason}
                    onChange={(e) =>
                      setRefundReason(
                        e.target.value
                      )
                    }
                    rows="4"
                    placeholder="Enter refund reason..."
                    className="w-full border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  onClick={handleRefund}
                  disabled={actionLoading}
                  className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50"
                >
                  {actionLoading
                    ? "Processing..."
                    : "Record Refund"}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

const SummaryCard = ({
  title,
  value,
  icon,
}) => (
  <div className="bg-white rounded-xl border shadow-sm p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">
          {title}
        </p>

        <h3 className="text-xl font-bold mt-2 text-gray-800">
          {value}
        </h3>
      </div>

      <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center">
        {icon}
      </div>
    </div>
  </div>
);

const Detail = ({
  label,
  value,
}) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">
      {label}
    </p>

    <p className="font-medium text-gray-800 break-words">
      {value || "-"}
    </p>
  </div>
);

export default SalesPaymentManagement;

