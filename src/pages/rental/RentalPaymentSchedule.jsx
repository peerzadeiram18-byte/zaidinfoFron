import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CheckCircle2, CircleAlert, Loader2, RefreshCw } from "lucide-react";

import {
    getRentalPaymentSchedule,
    payRentalInstallment,
} from "../../services/rentalApi";

import "./RentalPaymentSchedule.css";

/*
  Month-wise rent table.

    <RentalPaymentSchedule
        rentalId={rentalId}
        reloadKey={status}      // badalne par table dobara load hoti hai (optional)
        onPaid={() => {...}}    // payment save hone ke baad callback (optional)
        readOnly={false}        // true = sirf dekhna, payment nahi
    />

  Har month ke saamne ek TICK box hai. Tick karo -> amount (poora baaki),
  method aur payment date bharo -> "Save payment". Payment date default aaj ki hai,
  purani date bhi daal sakte ho (future date nahi).
*/

const METHODS = [
    { value: "CASH", label: "Cash" },
    { value: "UPI", label: "UPI" },
    { value: "CARD", label: "Card" },
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
    { value: "ONLINE", label: "Online" },
];

const STATUS_LABEL = {
    PAID: "Paid",
    PARTIAL: "Partly paid",
    UPCOMING: "Upcoming",
    DUE_TODAY: "Due today",
    OVERDUE: "Overdue",
    CANCELLED: "Cancelled",
    ADJUSTED: "Adjusted at return",
    PENDING: "Pending",
};

const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    })}`;

const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatDateTime = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// <input type="date"> ke liye local YYYY-MM-DD
const toInputDate = (date = new Date()) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
};

// Aaj ki date => abhi ka exact time; purani date => us din dopahar 12 baje
const toPaidAtIso = (inputDate) => {
    if (!inputDate || inputDate === toInputDate()) {
        return new Date().toISOString();
    }

    return new Date(`${inputDate}T12:00:00`).toISOString();
};

const unwrap = (response) =>
    response?.data?.installments
        ? response.data
        : response?.installments
            ? response
            : response?.data?.data || response?.data || response;

function RentalPaymentSchedule({
    rentalId,
    readOnly = false,
    reloadKey = "",
    onPaid,
}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [schedule, setSchedule] = useState(null);

    const [openId, setOpenId] = useState("");
    const [saving, setSaving] = useState(false);

    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("CASH");
    const [reference, setReference] = useState("");
    const [paidDate, setPaidDate] = useState(toInputDate());

    const load = useCallback(async () => {
        if (!rentalId) return;

        try {
            setLoading(true);
            setError("");

            const response = await getRentalPaymentSchedule(rentalId);

            setSchedule(unwrap(response));
        } catch (err) {
            console.error("LOAD RENT SCHEDULE ERROR:", err);

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load rent schedule"
            );
        } finally {
            setLoading(false);
        }
    }, [rentalId]);

    useEffect(() => {
        load();
    }, [load, reloadKey]);

    const openForm = (installment) => {
        setOpenId(installment._id);
        setAmount(String(installment.remainingAmount));
        setMethod("CASH");
        setReference("");
        setPaidDate(toInputDate());
    };

    const closeForm = () => {
        setOpenId("");
        setAmount("");
        setReference("");
        setPaidDate(toInputDate());
    };

    const handleTick = (installment, checked) => {
        if (checked) {
            openForm(installment);
        } else if (openId === installment._id) {
            closeForm();
        }
    };

    const handleSave = async (installment) => {
        const value = Number(amount);

        if (!Number.isFinite(value) || value <= 0) {
            toast.error("Enter a valid amount.");
            return;
        }

        if (value > installment.remainingAmount + 0.005) {
            toast.error(
                `Amount cannot be more than ${money(installment.remainingAmount)}.`
            );
            return;
        }

        if (method !== "CASH" && !reference.trim()) {
            toast.error("Enter payment reference / transaction number.");
            return;
        }

        if (!paidDate || paidDate > toInputDate()) {
            toast.error("Payment date cannot be in the future.");
            return;
        }

        try {
            setSaving(true);

            await payRentalInstallment(installment._id, {
                amount: value,
                paymentMethod: method,
                reference: reference.trim(),
                paidAt: toPaidAtIso(paidDate),
            });

            toast.success("Rent payment recorded.");

            closeForm();
            await load();

            if (typeof onPaid === "function") {
                onPaid();
            }
        } catch (err) {
            console.error("PAY INSTALLMENT ERROR:", err);

            toast.error(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to record rent payment"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading && !schedule) {
        return (
            <div className="rps-state">
                <Loader2 size={22} className="rps-spin" />
                <span>Loading rent schedule...</span>
            </div>
        );
    }

    if (error && !schedule) {
        return (
            <div className="rps-state rps-state-error">
                <CircleAlert size={22} />
                <span>{error}</span>
                <button type="button" onClick={load}>
                    Retry
                </button>
            </div>
        );
    }

    if (!schedule) return null;

    const { installments = [], summary = {}, rental = {} } = schedule;

    const canCollect = !readOnly && rental.status === "ACTIVE";
    const columnCount = canCollect ? 9 : 8;

    return (
        <section className="rps">
            <header className="rps-header">
                <div>
                    <h3>Monthly Rent Payments</h3>
                    <p>
                        {summary.paidCount || 0} of {summary.totalInstallments || 0}{" "}
                        installment(s) paid
                        {canCollect
                            ? " — month ke saamne tick karke rent receive karo"
                            : ""}
                    </p>
                </div>

                <button
                    type="button"
                    className="rps-refresh"
                    onClick={load}
                    disabled={loading}
                >
                    <RefreshCw size={16} className={loading ? "rps-spin" : ""} />
                    Refresh
                </button>
            </header>

            <div className="rps-summary">
                <div>
                    <span>Total rent</span>
                    <strong>{money(summary.totalRent)}</strong>
                </div>

                <div>
                    <span>Received</span>
                    <strong className="rps-ok">{money(summary.totalPaid)}</strong>
                </div>

                <div>
                    <span>Pending</span>
                    <strong>{money(summary.totalPending)}</strong>
                </div>

                <div>
                    <span>Overdue</span>
                    <strong className={summary.overdueAmount > 0 ? "rps-bad" : ""}>
                        {money(summary.overdueAmount)}
                        {summary.overdueCount > 0 ? ` (${summary.overdueCount})` : ""}
                    </strong>
                </div>
            </div>

            <div className="rps-table-wrap">
                <table className="rps-table">
                    <thead>
                        <tr>
                            {canCollect && <th>Paid?</th>}
                            <th>Month</th>
                            <th>Period</th>
                            <th>Due date</th>
                            <th>Amount</th>
                            <th>Paid</th>
                            <th>Remaining</th>
                            <th>Status</th>
                            <th>Paid on</th>
                        </tr>
                    </thead>

                    <tbody>
                        {installments.map((installment) => {
                            const isOpen = openId === installment._id;
                            const isPaid = installment.status === "PAID";

                            const canPay =
                                canCollect &&
                                ["PENDING", "PARTIAL"].includes(installment.status);

                            return (
                                <React.Fragment key={installment._id}>
                                    <tr>
                                        {canCollect && (
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    className="rps-check"
                                                    checked={isPaid || isOpen}
                                                    disabled={!canPay || saving}
                                                    onChange={(e) =>
                                                        handleTick(installment, e.target.checked)
                                                    }
                                                    title={
                                                        isPaid
                                                            ? "Paid"
                                                            : canPay
                                                                ? "Tick karke rent receive karo"
                                                                : ""
                                                    }
                                                />
                                            </td>
                                        )}

                                        <td>
                                            {installment.installmentNumber}/
                                            {installment.totalInstallments}
                                        </td>

                                        <td>
                                            {formatDate(installment.periodStart)} –{" "}
                                            {formatDate(installment.periodEnd)}
                                        </td>

                                        <td>{formatDate(installment.dueDate)}</td>

                                        <td>
                                            {money(installment.totalAmount)}
                                            {installment.gstAmount > 0 && (
                                                <small className="rps-sub">
                                                    incl. GST {money(installment.gstAmount)}
                                                </small>
                                            )}
                                        </td>

                                        <td>{money(installment.paidAmount)}</td>

                                        <td>
                                            {["PENDING", "PARTIAL"].includes(installment.status)
                                                ? money(installment.remainingAmount)
                                                : "-"}
                                        </td>

                                        <td>
                                            <span
                                                className={`rps-badge rps-badge-${String(
                                                    installment.displayStatus
                                                ).toLowerCase()}`}
                                            >
                                                {STATUS_LABEL[installment.displayStatus] ||
                                                    installment.displayStatus}
                                            </span>
                                        </td>

                                        <td>
                                            {isPaid
                                                ? formatDateTime(installment.paidAt)
                                                : "-"}
                                        </td>
                                    </tr>

                                    {isOpen && (
                                        <tr className="rps-form-row">
                                            <td colSpan={columnCount}>
                                                <div className="rps-form">
                                                    <label>
                                                        <span>
                                                            Amount (baaki{" "}
                                                            {money(installment.remainingAmount)})
                                                        </span>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={amount}
                                                            onChange={(e) => setAmount(e.target.value)}
                                                        />
                                                    </label>

                                                    <label>
                                                        <span>Payment date</span>
                                                        <input
                                                            type="date"
                                                            value={paidDate}
                                                            max={toInputDate()}
                                                            onChange={(e) => setPaidDate(e.target.value)}
                                                        />
                                                    </label>

                                                    <label>
                                                        <span>Method</span>
                                                        <select
                                                            value={method}
                                                            onChange={(e) => setMethod(e.target.value)}
                                                        >
                                                            {METHODS.map((m) => (
                                                                <option key={m.value} value={m.value}>
                                                                    {m.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </label>

                                                    <label className="rps-form-wide">
                                                        <span>
                                                            Reference
                                                            {method !== "CASH" ? " *" : " (optional)"}
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={reference}
                                                            onChange={(e) => setReference(e.target.value)}
                                                            placeholder="UPI / transaction number"
                                                        />
                                                    </label>

                                                    <div className="rps-form-actions">
                                                        <button
                                                            type="button"
                                                            className="rps-cancel"
                                                            onClick={closeForm}
                                                            disabled={saving}
                                                        >
                                                            Cancel
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="rps-save"
                                                            onClick={() => handleSave(installment)}
                                                            disabled={saving}
                                                        >
                                                            {saving ? (
                                                                <Loader2 size={16} className="rps-spin" />
                                                            ) : (
                                                                <CheckCircle2 size={16} />
                                                            )}
                                                            Save payment
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {installment.payments?.length > 0 && (
                                        <tr className="rps-history-row">
                                            <td colSpan={columnCount}>
                                                {installment.payments.map((p) => (
                                                    <div key={p._id} className="rps-history-item">
                                                        {money(p.amount)} •{" "}
                                                        {String(p.paymentMethod).replace("_", " ")} •{" "}
                                                        {formatDateTime(p.paidAt)}
                                                        {p.reference ? ` • Ref: ${p.reference}` : ""}
                                                        {p.receivedBy?.name
                                                            ? ` • by ${p.receivedBy.name}`
                                                            : ""}
                                                    </div>
                                                ))}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}

                        {installments.length === 0 && (
                            <tr>
                                <td colSpan={columnCount} className="rps-empty">
                                    No rent schedule found for this rental. (Rentals created before
                                    this update do not have a schedule.)
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default RentalPaymentSchedule;