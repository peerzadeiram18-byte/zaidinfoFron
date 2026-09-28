
// pages/corporate/RequestQuote.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./RequestQuote.css";

const API = `${import.meta.env.VITE_API_URL}/quotations`;

const SERVER_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace("/api", "")
    : "";

const QUOTE_CART_KEY = "quoteCart";

const token = () => localStorage.getItem("token");

const config = () => ({
    headers: {
        Authorization: `Bearer ${token()}`,
    },
});


// =====================================================
// GET IMAGE URL
// =====================================================

const getImageUrl = (product) => {

    const raw =
        product?.images?.[0]?.url ||
        product?.images?.[0] ||
        product?.image ||
        "";

    if (!raw) {
        return "";
    }

    if (typeof raw === "string" && raw.startsWith("http")) {
        return raw;
    }

    return `${SERVER_URL}${raw.startsWith("/") ? "" : "/"}${raw}`;

};


// =====================================================
// GET REFERENCE PRICE (wholesale, for context only)
// =====================================================

const getReferencePrice = (product) => {

    return Number(
        product?.pricing?.wholesalePrice ??
        product?.finalPrice ??
        product?.pricing?.sellingPrice ??
        0
    );

};


// =====================================================
// REQUEST QUOTE PAGE
// =====================================================

const RequestQuote = () => {

    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [submitting, setSubmitting] = useState(false);


    // =================================================
    // LOAD QUOTE CART FROM LOCAL STORAGE
    // =================================================

    useEffect(() => {

        try {

            const raw = localStorage.getItem(QUOTE_CART_KEY);
            const parsed = raw ? JSON.parse(raw) : [];

            const normalized = Array.isArray(parsed)
                ? parsed.map((entry) => ({
                    product: entry.product,
                    quantity: Number(entry.quantity) || 1,
                    proposedPrice:
                        entry.proposedPrice !== undefined &&
                        entry.proposedPrice !== null
                            ? Number(entry.proposedPrice)
                            : "",
                }))
                : [];

            setItems(normalized);

        } catch (err) {

            console.error("QUOTE CART LOAD ERROR:", err);
            setItems([]);

        }

    }, []);


    // =================================================
    // SAVE QUOTE CART BACK TO LOCAL STORAGE
    // (keeps it in sync so items survive a refresh)
    // =================================================

    const persistCart = (updatedItems) => {

        localStorage.setItem(
            QUOTE_CART_KEY,
            JSON.stringify(updatedItems)
        );

    };


    // =================================================
    // UPDATE QUANTITY
    // =================================================

    const handleQuantityChange = (index, value) => {

        const updated = [...items];

        updated[index].quantity = value;

        setItems(updated);
        persistCart(updated);

    };


    // =================================================
    // UPDATE PROPOSED PRICE
    // =================================================

    const handlePriceChange = (index, value) => {

        const updated = [...items];

        updated[index].proposedPrice = value;

        setItems(updated);
        persistCart(updated);

    };


    // =================================================
    // REMOVE ITEM
    // =================================================

    const handleRemoveItem = (index) => {

        const updated = items.filter((_, i) => i !== index);

        setItems(updated);
        persistCart(updated);

        toast.info("Removed from quote request");

    };


    // =================================================
    // SUBMIT QUOTE
    // =================================================

    const handleSubmit = async () => {

        if (submitting) {
            return;
        }

        if (!items.length) {
            toast.error("Your quote request is empty");
            return;
        }

        // VALIDATION

        const invalidItem = items.find((item) => {

            const quantity = Number(item.quantity);
            const proposedPrice = Number(item.proposedPrice);

            return (
                !Number.isFinite(quantity) ||
                quantity < 1 ||
                !Number.isFinite(proposedPrice) ||
                proposedPrice <= 0
            );

        });

        if (invalidItem) {

            toast.error(
                "Please enter a valid quantity and proposed price for every item"
            );

            return;

        }

        const payload = {
            items: items.map((item) => ({
                product:
                    item.product?._id ||
                    item.product?.id ||
                    item.product,
                quantity: Number(item.quantity),
                proposedPrice: Number(item.proposedPrice),
            })),
        };

        try {

            setSubmitting(true);

            await axios.post(API, payload, config());

            toast.success("Quote request submitted");

            localStorage.removeItem(QUOTE_CART_KEY);
            setItems([]);

            navigate("/corporate-dashboard/quotes");

        } catch (err) {

            console.error("SUBMIT QUOTE ERROR:", err.response?.data || err);

            toast.error(
                err.response?.data?.message ||
                "Failed to submit quote request"
            );

        } finally {

            setSubmitting(false);

        }

    };


    // =================================================
    // EMPTY STATE
    // =================================================

    if (!items.length) {

        return (

            <div className="request-quote">

                <div className="request-quote-empty">

                    <h2>Your Quote Request Is Empty</h2>

                    <p>
                        Browse the shop and click "Request Quote" on a
                        product to add it here.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/shop")}
                    >
                        Go To Shop
                    </button>

                </div>

            </div>

        );

    }


    // =================================================
    // UI
    // =================================================

    return (

        <div className="request-quote">

            <h2>Request A Quote</h2>

            <p className="request-quote-subtitle">
                Set your proposed price and quantity for each product,
                then submit for review.
            </p>

            <div className="request-quote-list">

                {items.map((item, index) => {

                    const product = item.product || {};
                    const referencePrice = getReferencePrice(product);
                    const imageUrl = getImageUrl(product);

                    return (

                        <div
                            className="request-quote-item"
                            key={
                                product._id ||
                                product.id ||
                                `quote-item-${index}`
                            }
                        >

                            <div className="request-quote-item-image">

                                {imageUrl ? (
                                    <img src={imageUrl} alt={product.name} />
                                ) : (
                                    <div className="request-quote-no-image">
                                        No Image
                                    </div>
                                )}

                            </div>

                            <div className="request-quote-item-details">

                                <h4>{product.name}</h4>

                                {referencePrice > 0 && (

                                    <p className="request-quote-reference-price">
                                        Catalog Price: ₹{referencePrice.toLocaleString("en-IN")}
                                    </p>

                                )}

                                <div className="request-quote-item-fields">

                                    <div className="request-quote-field">

                                        <label>Quantity</label>

                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                    <div className="request-quote-field">

                                        <label>Your Proposed Price (per unit)</label>

                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Enter your price"
                                            value={item.proposedPrice}
                                            onChange={(e) =>
                                                handlePriceChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                            <button
                                type="button"
                                className="request-quote-remove-btn"
                                onClick={() => handleRemoveItem(index)}
                                aria-label="Remove item"
                            >
                                ✕
                            </button>

                        </div>

                    );

                })}

            </div>

            <div className="request-quote-footer">

                <button
                    type="button"
                    className="request-quote-add-more-btn"
                    onClick={() => navigate("/shop")}
                >
                    + Add More Products
                </button>

                <button
                    type="button"
                    className="request-quote-submit-btn"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? "Submitting..." : "Submit Quote Request"}
                </button>

            </div>

        </div>

    );

};

export default RequestQuote;