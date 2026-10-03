// import { FaWhatsapp } from "react-icons/fa";

// import "./Corporatequotes.css";

// // =====================================================
// // WHATSAPP LINK
// // Change the phone number or the message here.
// // =====================================================

// const WHATSAPP_URL =
//   "https://api.whatsapp.com/send/?phone=919876543210&text=Hi+Zaid+Infotech%2C+I+have+a+query%21&type=phone_number&app_absent=0";

// // =====================================================
// // PAGE
// // =====================================================

// export default function CorporateQuotes() {
//   return (
//     <div className="corpq-page">
//       <div className="corpq-header">
//         <div>
//           <h1>Quotes</h1>
//           <p>Get a bulk price for your company's laptop order</p>
//         </div>

//         <a
//           className="corpq-button"
//           href={WHATSAPP_URL}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <FaWhatsapp />
//           Request a quote
//         </a>
//       </div>

//       <div className="corpq-card">
//         <h3>How it works</h3>
//         <p>
//           Tell us which laptops you need and how many. Our team will reply on
//           WhatsApp with a price for your company.
//         </p>
//       </div>
//     </div>
//   );
// }



// pages/corporate/Corporatequotes.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaFileInvoiceDollar } from "react-icons/fa";

import { createQuoteOrder } from "../../services/orderService";
import { createPayment } from "../../services/paymentService";

import "./Corporatequotes.css";

const API = import.meta.env.VITE_API_URL;
const QUOTATIONS_API = `${API}/quotations`;

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
      return "corpq-badge corpq-badge-pending";

    case "Countered":
      return "corpq-badge corpq-badge-countered";

    case "Approved":
      return "corpq-badge corpq-badge-approved";

    case "Rejected":
      return "corpq-badge corpq-badge-rejected";

    case "Used":
      return "corpq-badge corpq-badge-used";

    default:
      return "corpq-badge";

  }

};


// =====================================================
// PAGE — MY QUOTES
// =====================================================

export default function CorporateQuotes() {

  const navigate = useNavigate();

  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  // which item is currently being accepted/rejected (disable buttons)
  const [actingItemId, setActingItemId] = useState(null);

  // =================================================
  // NEW — SELECTED ITEMS FOR BULK "PLACE ORDER"
  //
  // Shape: { [quotationId]: { [itemId]: true } }
  // Only Approved items can be selected.
  // =================================================

  const [selectedItemIds, setSelectedItemIds] = useState({});

  const toggleItemSelection = (quotationId, itemId) => {

    setSelectedItemIds((prev) => {

      const quotationSelections = { ...(prev[quotationId] || {}) };

      if (quotationSelections[itemId]) {
        delete quotationSelections[itemId];
      } else {
        quotationSelections[itemId] = true;
      }

      return {
        ...prev,
        [quotationId]: quotationSelections,
      };

    });

  };

  const isItemSelected = (quotationId, itemId) => {

    return Boolean(selectedItemIds[quotationId]?.[itemId]);

  };

  const getSelectedItemsForQuotation = (quotation) => {

    const selections = selectedItemIds[quotation._id] || {};

    return (quotation.items || []).filter(
      (item) => item.status === "Approved" && selections[item._id]
    );

  };

  const getSelectedTotalForQuotation = (quotation) => {

    return getSelectedItemsForQuotation(quotation).reduce(
      (sum, item) =>
        sum + Number(item.finalPrice) * (Number(item.quantity) || 1),
      0
    );

  };


  // =================================================
  // ADDRESS MODAL STATE
  // (opened when user clicks "Place Order for Selected")
  // =================================================

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  // the quotation + array of items currently being ordered together
  const [activeOrderContext, setActiveOrderContext] = useState(null);


  // =================================================
  // LOAD QUOTATIONS
  // =================================================

  useEffect(() => {

    loadQuotations();

  }, []);

  const loadQuotations = async () => {

    try {

      setLoading(true);

      const res = await axios.get(QUOTATIONS_API, config());

      const data = res.data?.data || [];

      setQuotations(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error("GET MY QUOTATIONS ERROR:", err.response?.data || err);

      toast.error(
        err.response?.data?.message ||
        "Failed to load your quotes"
      );

      setQuotations([]);

    } finally {

      setLoading(false);

    }

  };


  // =================================================
  // ACCEPT / REJECT A COUNTER OFFER
  // =================================================

  const handleCounterResponse = async (quotationId, itemId, accept) => {

    try {

      setActingItemId(itemId);

      const res = await axios.patch(
        `${QUOTATIONS_API}/${quotationId}/items/${itemId}/accept-counter`,
        { accept },
        config()
      );

      toast.success(
        accept
          ? "Counter offer accepted"
          : "Counter offer rejected"
      );

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

      console.error("ACCEPT COUNTER ERROR:", err.response?.data || err);

      toast.error(
        err.response?.data?.message ||
        "Failed to respond to counter offer"
      );

    } finally {

      setActingItemId(null);

    }

  };


  // =================================================
  // OPEN ADDRESS MODAL FOR "PLACE ORDER FOR SELECTED"
  //
  // NEW — now takes the whole array of selected items
  // for this quotation, instead of a single item.
  // =================================================

  const openPlaceOrder = async (quotation) => {

    const selectedItems = getSelectedItemsForQuotation(quotation);

    if (selectedItems.length === 0) {
      toast.error("Select at least one item to order");
      return;
    }

    setActiveOrderContext({ quotation, items: selectedItems });
    setSelectedAddressId("");
    setAddressModalOpen(true);

    try {

      setAddressesLoading(true);

      const res = await axios.get(`${API}/addresses`, config());

      const addressData = res.data?.data || [];

      setAddresses(Array.isArray(addressData) ? addressData : []);

    } catch (err) {

      console.error("GET ADDRESSES ERROR:", err.response?.data || err);

      toast.error("Failed to load your addresses");

      setAddresses([]);

    } finally {

      setAddressesLoading(false);

    }

  };

  const closeAddressModal = () => {

    setAddressModalOpen(false);
    setActiveOrderContext(null);
    setSelectedAddressId("");

  };


  // =================================================
  // CONFIRM PLACE ORDER
  //
  // NEW — builds orderItems from EVERY selected item,
  // not just one. Each item still carries its own
  // quotationId + itemId so order.service.js resolves
  // pricing independently per line, exactly as before.
  // =================================================

  const handleConfirmPlaceOrder = async () => {

    if (placingOrder) {
      return;
    }

    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!activeOrderContext || !activeOrderContext.items?.length) {
      return;
    }

    const { quotation, items } = activeOrderContext;

    const address = addresses.find(
      (a) => a._id === selectedAddressId
    );

    if (!address) {
      toast.error("Address not found");
      return;
    }

    const shippingAddress = {
      fullName: address.fullName || address.name || "",
      phone: address.phone || address.mobile || "",
      addressLine:
        address.addressLine ||
        address.address ||
        address.streetAddress ||
        "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      country: address.country || "India",
      landmark: address.landmark || "",
    };

    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      toast.error("Selected address is incomplete");
      return;
    }

    // NEW — build one orderItems entry per selected item

    const orderItems = items.map((item) => {

      const product = item.product || {};
      const finalPrice = Number(item.finalPrice);
      const quantity = Number(item.quantity) || 1;

      return {
        product: product._id || product.id || item.product,
        title: product.name || "",
        quantity,
        originalPrice: finalPrice,
        discountAmount: 0,
        price: finalPrice,
        offer: null,
        imageUrl: product.images?.[0]?.url || "",

        // These two fields are what order.service.js checks for
        // to trigger the quote-based pricing branch, per item.
        quotationId: quotation._id,
        itemId: item._id,
      };

    });

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderData = {
      orderItems,
      shippingAddress,
      totalAmount,
      orderSource: "ONLINE",
    };

    try {

      setPlacingOrder(true);

      // 1. CREATE ORDER (single order, multiple line items)

      const orderRes = await createQuoteOrder(orderData);

      const order = orderRes?.order || orderRes?.data?.order;

      if (!order) {
        throw new Error("Order was not created");
      }

      // 2. CREATE DATABASE PAYMENT
      //
      // Same as normal checkout — Razorpay uses UPI here.
      // ONE payment record for the whole combined order.

      const paymentData = {
        paymentFor: "ORDER",
        referenceId: order._id,
        amount: Number(order.totalAmount),
        paymentMethod: "UPI",
      };

      const paymentRes = await createPayment(paymentData);

      if (
        !paymentRes ||
        !paymentRes.success ||
        !paymentRes.payment
      ) {
        throw new Error(
          paymentRes?.message ||
          "Payment creation failed"
        );
      }

      const createdPayment = paymentRes.payment;

      toast.success("Order placed successfully");

      closeAddressModal();

      // clear selection for this quotation now that it's ordered
      setSelectedItemIds((prev) => {
        const updated = { ...prev };
        delete updated[quotation._id];
        return updated;
      });

      loadQuotations();

      // 3. GO TO PAYMENT PAGE — same as normal checkout

      navigate("/payment", {
        state: {
          order: order,
          payment: createdPayment,
        },
      });

    } catch (err) {

      console.error("PLACE QUOTE ORDER ERROR:", err.response?.data || err);

      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Failed to place order"
      );

    } finally {

      setPlacingOrder(false);

    }

  };


  // =================================================
  // LOADING
  // =================================================

  if (loading) {

    return (

      <div className="corpq-page">
        <div className="corpq-header">
          <div>
            <h1>My Quotes</h1>
          </div>
        </div>

        <p className="corpq-loading">Loading your quotes...</p>
      </div>

    );

  }


  // =================================================
  // UI
  // =================================================

  return (

    <div className="corpq-page">

      <div className="corpq-header">

        <div>
          <h1>My Quotes</h1>
          <p>Track your quote requests and place orders on approved items</p>
        </div>

        <Link
          className="corpq-button"
          to="/corporate-dashboard/request-quote"
        >
          <FaFileInvoiceDollar />
          Request New Quote
        </Link>

      </div>

      {quotations.length === 0 ? (

        <div className="corpq-card">
          <h3>No quotes yet</h3>
          <p>
            Browse the shop, click "Request Quote" on the products you
            need, and submit your quote request here.
          </p>
        </div>

      ) : (

        <div className="corpq-list">

          {quotations.map((quotation) => {

            const selectedItems = getSelectedItemsForQuotation(quotation);
            const selectedTotal = getSelectedTotalForQuotation(quotation);
            const hasApprovedItems = (quotation.items || []).some(
              (item) => item.status === "Approved"
            );

            return (

              <div className="corpq-quote-card" key={quotation._id}>

                <div className="corpq-quote-card-header">
                  <span>
                    Submitted on{" "}
                    {new Date(quotation.createdAt).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "short", year: "numeric" }
                    )}
                  </span>
                </div>

                {(quotation.items || []).map((item) => {

                  const product = item.product || {};
                  const isActing = actingItemId === item._id;

                  return (

                    <div className="corpq-item" key={item._id}>

                      <div className="corpq-item-info">

                        {/* NEW — checkbox, only for Approved items */}
                        {item.status === "Approved" && (

                          <label className="corpq-item-checkbox">
                            <input
                              type="checkbox"
                              checked={isItemSelected(quotation._id, item._id)}
                              onChange={() =>
                                toggleItemSelection(quotation._id, item._id)
                              }
                            />
                          </label>

                        )}

                        <div>

                          <h4>{product.name}</h4>

                          <p>
                            Qty: {item.quantity} · Your price: ₹
                            {Number(item.proposedPrice).toLocaleString("en-IN")}

                            {item.status === "Countered" && item.counterPrice ? (
                              <> · Admin offered: ₹{Number(item.counterPrice).toLocaleString("en-IN")}</>
                            ) : null}

                            {(item.status === "Approved" || item.status === "Used") && item.finalPrice ? (
                              <> · Final price: ₹{Number(item.finalPrice).toLocaleString("en-IN")}</>
                            ) : null}
                          </p>

                          <span className={getStatusClass(item.status)}>
                            {item.status}
                          </span>

                        </div>

                      </div>

                      <div className="corpq-item-actions">

                        {item.status === "Countered" && (

                          <>
                            <button
                              type="button"
                              className="corpq-btn corpq-btn-accept"
                              disabled={isActing}
                              onClick={() =>
                                handleCounterResponse(quotation._id, item._id, true)
                              }
                            >
                              Accept
                            </button>

                            <button
                              type="button"
                              className="corpq-btn corpq-btn-reject"
                              disabled={isActing}
                              onClick={() =>
                                handleCounterResponse(quotation._id, item._id, false)
                              }
                            >
                              Reject
                            </button>
                          </>

                        )}

                        {item.status === "Pending" && (
                          <span className="corpq-waiting-note">
                            Waiting for review
                          </span>
                        )}

                        {item.status === "Used" && (
                          <span className="corpq-waiting-note">
                            Order already placed
                          </span>
                        )}

                        {/* NOTE: individual "Place Order" button per item
                            removed — replaced by the single bulk button
                            below the item list for this quotation. */}

                      </div>

                    </div>

                  );

                })}

                {/* =================================================
                    NEW — SINGLE "PLACE ORDER FOR SELECTED" BUTTON
                    Shown once per quotation, whenever it has at
                    least one Approved item.
                ================================================= */}

                {hasApprovedItems && (

                  <div className="corpq-bulk-order-bar">

                    <span className="corpq-bulk-order-summary">
                      {selectedItems.length > 0
                        ? `${selectedItems.length} item${selectedItems.length !== 1 ? "s" : ""} selected · ₹${selectedTotal.toLocaleString("en-IN")}`
                        : "Select approved items above to order"}
                    </span>

                    <button
                      type="button"
                      className="corpq-btn corpq-btn-place-order"
                      disabled={selectedItems.length === 0}
                      onClick={() => openPlaceOrder(quotation)}
                    >
                      Place Order for Selected
                    </button>

                  </div>

                )}

              </div>

            );

          })}

        </div>

      )}


      {/* =================================================
          ADDRESS SELECTION MODAL
      ================================================= */}

      {addressModalOpen && (

        <div className="corpq-modal-overlay" onClick={closeAddressModal}>

          <div
            className="corpq-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <h3>Select Delivery Address</h3>

            {/* NEW — quick summary of what's being ordered */}
            {activeOrderContext && (

              <p className="corpq-modal-order-summary">
                Ordering {activeOrderContext.items.length} item
                {activeOrderContext.items.length !== 1 ? "s" : ""} · ₹
                {activeOrderContext.items
                  .reduce(
                    (sum, item) =>
                      sum + Number(item.finalPrice) * (Number(item.quantity) || 1),
                    0
                  )
                  .toLocaleString("en-IN")}
              </p>

            )}

            {addressesLoading ? (

              <p className="corpq-loading">Loading addresses...</p>

            ) : addresses.length === 0 ? (

              <div>
                <p>No saved addresses found.</p>

                <Link
                  className="corpq-btn corpq-btn-place-order"
                  to="/corporate-dashboard/add-address"
                >
                  Add Address
                </Link>
              </div>

            ) : (

              <div className="corpq-address-list">

                {addresses.map((address) => (

                  <label
                    className="corpq-address-option"
                    key={address._id}
                  >

                    <input
                      type="radio"
                      name="deliveryAddress"
                      checked={selectedAddressId === address._id}
                      onChange={() => setSelectedAddressId(address._id)}
                    />

                    <div>

                      <h4>
                        {address.fullName || address.name || "Address"}
                      </h4>

                      <p>{address.phone || address.mobile || ""}</p>

                      <p>
                        {address.addressLine ||
                          address.address ||
                          address.streetAddress ||
                          ""}
                        , {address.city}, {address.state} - {address.pincode}
                      </p>

                    </div>

                  </label>

                ))}

              </div>

            )}

            <div className="corpq-modal-footer">

              <button
                type="button"
                className="corpq-btn corpq-btn-reject"
                onClick={closeAddressModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="corpq-btn corpq-btn-place-order"
                disabled={placingOrder || !selectedAddressId}
                onClick={handleConfirmPlaceOrder}
              >
                {placingOrder ? "Placing Order..." : "Confirm & Place Order"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}