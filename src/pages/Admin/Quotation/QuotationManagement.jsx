

// pages/Admin/Quotation/QuotationManagement.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import "./QuotationManagement.css";

const API = `${import.meta.env.VITE_API_URL}/quotations`;

const token = () => localStorage.getItem("token");

const config = () => ({
    headers: {
        Authorization: `Bearer ${token()}`,
    },
});


// =====================================================
// STATUS BADGE CLASS
// =====================================================

const getStatusClass = (status) => {

    switch (status) {

        case "Pending":
            return "qm-badge qm-badge-pending";

        case "Countered":
            return "qm-badge qm-badge-countered";

        case "Approved":
            return "qm-badge qm-badge-approved";

        case "Rejected":
            return "qm-badge qm-badge-rejected";

        case "Used":
            return "qm-badge qm-badge-used";

        default:
            return "qm-badge";

    }

};


// =====================================================
// QUOTATION MANAGEMENT (ADMIN)
// =====================================================

const QuotationManagement = () => {

    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    // counterPrice input state, keyed by itemId
    const [counterInputs, setCounterInputs] = useState({});

    // which item is currently being submitted (disable buttons)
    const [actingItemId, setActingItemId] = useState(null);


    // =================================================
    // LOAD QUOTATIONS
    // =================================================

    useEffect(() => {

        loadQuotations();

    }, []);

    const loadQuotations = async () => {

        try {

            setLoading(true);

            const res = await axios.get(API, config());

            const data = res.data?.data || [];

            setQuotations(Array.isArray(data) ? data : []);

        } catch (err) {

            console.error("GET QUOTATIONS ERROR:", err.response?.data || err);

            toast.error(
                err.response?.data?.message ||
                "Failed to load quotations"
            );

            setQuotations([]);

        } finally {

            setLoading(false);

        }

    };


    // =================================================
    // TOGGLE EXPAND
    // =================================================

    const toggleExpand = (quotationId) => {

        setExpandedId((prev) =>
            prev === quotationId ? null : quotationId
        );

    };


    // =================================================
    // RESPOND TO ITEM (approve / counter / reject)
    // =================================================

    const respondToItem = async (quotationId, itemId, body) => {

        try {

            setActingItemId(itemId);

            const res = await axios.patch(
                `${API}/${quotationId}/items/${itemId}/respond`,
                body,
                config()
            );

            toast.success("Item updated");

            const updatedQuotation = res.data?.data;

            if (updatedQuotation) {

                setQuotations((prev) =>
                    prev.map((q) =>
                        q._id === quotationId ? updatedQuotation : q
                    )
                );

            } else {

                loadQuotations();

            }

        } catch (err) {

            console.error("RESPOND ITEM ERROR:", err.response?.data || err);

            toast.error(
                err.response?.data?.message ||
                "Failed to update item"
            );

        } finally {

            setActingItemId(null);

        }

    };


    // =================================================
    // APPROVE
    // =================================================

    const handleApprove = (quotationId, item) => {

        respondToItem(quotationId, item._id, {
            status: "Approved",
            finalPrice: item.proposedPrice,
        });

    };


    // =================================================
    // REJECT
    // =================================================

    const handleReject = (quotationId, itemId) => {

        respondToItem(quotationId, itemId, {
            status: "Rejected",
        });

    };


    // =================================================
    // COUNTER
    // =================================================

    const handleCounterInputChange = (itemId, value) => {

        setCounterInputs((prev) => ({
            ...prev,
            [itemId]: value,
        }));

    };

    const handleSubmitCounter = (quotationId, itemId) => {

        const counterPrice = Number(counterInputs[itemId]);

        if (!Number.isFinite(counterPrice) || counterPrice <= 0) {

            toast.error("Enter a valid counter price");
            return;

        }

        respondToItem(quotationId, itemId, {
            status: "Countered",
            counterPrice,
        });

    };


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (

            <div className="qm-page">
                <h2>Quotations</h2>
                <p className="qm-loading">Loading quotations...</p>
            </div>

        );

    }


    // =================================================
    // EMPTY
    // =================================================

    if (!quotations.length) {

        return (

            <div className="qm-page">
                <h2>Quotations</h2>
                <p className="qm-empty">No quotations submitted yet.</p>
            </div>

        );

    }


    // =================================================
    // UI
    // =================================================

    return (

        <div className="qm-page">

            <h2>Quotations</h2>

            <p className="qm-subtitle">
                Review and respond to business customer quote requests.
            </p>

            <div className="qm-list">

                {quotations.map((quotation) => {

                    const isExpanded = expandedId === quotation._id;

                    const customer = quotation.corporateUser || {};

                    const companyName =
                        customer.businessDetails?.companyName || "";

                    const pendingCount = (quotation.items || []).filter(
                        (item) => item.status === "Pending"
                    ).length;

                    return (

                        <div className="qm-card" key={quotation._id}>

                            <div
                                className="qm-card-header"
                                onClick={() => toggleExpand(quotation._id)}
                            >

                                <div>

                                    <h3>
                                        {customer.firstName} {customer.lastName}
                                        {companyName ? ` — ${companyName}` : ""}
                                    </h3>

                                    <p className="qm-card-subtext">
                                        {customer.email} · {(quotation.items || []).length} item(s)
                                        {pendingCount > 0 && (
                                            <span className="qm-pending-count">
                                                {" "}· {pendingCount} pending
                                            </span>
                                        )}
                                    </p>

                                </div>

                                <span className="qm-expand-icon">
                                    {isExpanded ? "▲" : "▼"}
                                </span>

                            </div>

                            {isExpanded && (

                                <div className="qm-card-body">

                                    {(quotation.items || []).map((item) => {

                                        const product = item.product || {};

                                        const isActing =
                                            actingItemId === item._id;

                                        const showCounterInput =
                                            item.status === "Pending";

                                        return (

                                            <div
                                                className="qm-item"
                                                key={item._id}
                                            >

                                                <div className="qm-item-info">

                                                    <h4>{product.name}</h4>

                                                    <p>
                                                        Qty: {item.quantity} ·
                                                        {" "}Proposed: ₹{Number(item.proposedPrice).toLocaleString("en-IN")}

                                                        {item.counterPrice ? (
                                                            <> · Countered: ₹{Number(item.counterPrice).toLocaleString("en-IN")}</>
                                                        ) : null}

                                                        {item.finalPrice ? (
                                                            <> · Final: ₹{Number(item.finalPrice).toLocaleString("en-IN")}</>
                                                        ) : null}
                                                    </p>

                                                    <span className={getStatusClass(item.status)}>
                                                        {item.status}
                                                    </span>

                                                </div>

                                                {item.status === "Pending" && (

                                                    <div className="qm-item-actions">

                                                        <button
                                                            type="button"
                                                            className="qm-btn qm-btn-approve"
                                                            disabled={isActing}
                                                            onClick={() =>
                                                                handleApprove(quotation._id, item)
                                                            }
                                                        >
                                                            Approve
                                                        </button>

                                                        <div className="qm-counter-group">

                                                            <input
                                                                type="number"
                                                                placeholder="Counter price"
                                                                value={counterInputs[item._id] || ""}
                                                                onChange={(e) =>
                                                                    handleCounterInputChange(
                                                                        item._id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />

                                                            <button
                                                                type="button"
                                                                className="qm-btn qm-btn-counter"
                                                                disabled={isActing}
                                                                onClick={() =>
                                                                    handleSubmitCounter(
                                                                        quotation._id,
                                                                        item._id
                                                                    )
                                                                }
                                                            >
                                                                Counter
                                                            </button>

                                                        </div>

                                                        <button
                                                            type="button"
                                                            className="qm-btn qm-btn-reject"
                                                            disabled={isActing}
                                                            onClick={() =>
                                                                handleReject(quotation._id, item._id)
                                                            }
                                                        >
                                                            Reject
                                                        </button>

                                                    </div>

                                                )}

                                                {item.status === "Countered" && (

                                                    <p className="qm-waiting-note">
                                                        Waiting for customer response
                                                    </p>

                                                )}

                                            </div>

                                        );

                                    })}

                                </div>

                            )}

                        </div>

                    );

                })}

            </div>

        </div>

    );

};

export default QuotationManagement;