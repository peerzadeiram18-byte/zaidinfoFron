import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VendorDetails.css";

// ------------------------------------------------------------------
// API SETUP
// Same base URL and token pattern as VendorList.jsx / AddVendor.jsx.
// ------------------------------------------------------------------
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Show "-" for empty values
const show = (value) =>
    value === undefined || value === null || String(value).trim() === ""
        ? "-"
        : value;

const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

function VendorDetails() {
    const { vendorId } = useParams();
    const navigate = useNavigate();

    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await axios.get(
                    `${API_BASE_URL}/api/procurement/vendors/${vendorId}`,
                    { headers: authHeaders() }
                );

                // Works whether backend returns { data }, { vendor } or the vendor directly
                const body = res.data;
                setVendor(body.data || body.vendor || body);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        "Could not load this vendor. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchVendor();
    }, [vendorId]);

    // ---------------- DELETE HANDLER ----------------

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${vendor.vendorName}"? This vendor will no longer be available for new purchase orders.`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setDeleteError("");

            const res = await axios.delete(
                `${API_BASE_URL}/api/procurement/vendors/${vendorId}`,
                { headers: authHeaders() }
            );

            if (!res.data.success) {
                throw new Error(res.data.message || "Failed to delete vendor");
            }

            navigate("/vendors");
        } catch (err) {
            setDeleteError(
                err.response?.data?.message ||
                    err.message ||
                    "Failed to delete vendor"
            );
        } finally {
            setDeleting(false);
        }
    };

    // ---------------- STATES ----------------

    if (loading) {
        return (
            <div className="vendor-details-page">
                <p className="vd-state">Loading vendor...</p>
            </div>
        );
    }

    if (error || !vendor) {
        return (
            <div className="vendor-details-page">
                <button
                    type="button"
                    className="vd-back"
                    onClick={() => navigate("/vendors")}
                >
                    ← Back to vendors
                </button>
                <p className="vd-state vd-state-error">
                    {error || "Vendor not found."}
                </p>
            </div>
        );
    }

    // ---------------- PAGE ----------------

    return (
        <div className="vendor-details-page">
            <button
                type="button"
                className="vd-back"
                onClick={() => navigate("/vendors")}
            >
                ← Back to vendors
            </button>

            {/* Header */}
            <div className="vd-header">
                <div>
                    <h1 className="vd-title">{vendor.vendorName}</h1>
                    <span
                        className={`vd-badge ${
                            vendor.isActive === false
                                ? "vd-badge-inactive"
                                : "vd-badge-active"
                        }`}
                    >
                        {vendor.isActive === false ? "Inactive" : "Active"}
                    </span>
                </div>

                <div className="vd-header-actions">
                    <button
                        type="button"
                        className="vd-edit-btn"
                        onClick={() => navigate(`/vendors/${vendorId}/edit`)}
                    >
                        Edit vendor
                    </button>

                    <button
                        type="button"
                        className="vd-delete-btn"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Delete vendor"}
                    </button>
                </div>
            </div>

            {deleteError && (
                <p className="vd-state vd-state-error">{deleteError}</p>
            )}

            {/* Details */}
            <div className="vd-grid">
                <section className="vd-card">
                    <h2 className="vd-card-title">Contact</h2>
                    <dl className="vd-list">
                        <div className="vd-row">
                            <dt>Contact person</dt>
                            <dd>{show(vendor.contactPerson)}</dd>
                        </div>
                        <div className="vd-row">
                            <dt>Phone</dt>
                            <dd>{show(vendor.phone)}</dd>
                        </div>
                        <div className="vd-row">
                            <dt>Email</dt>
                            <dd>{show(vendor.email)}</dd>
                        </div>
                    </dl>
                </section>

                <section className="vd-card">
                    <h2 className="vd-card-title">Address</h2>
                    <dl className="vd-list">
                        <div className="vd-row">
                            <dt>Address</dt>
                            <dd>{show(vendor.address)}</dd>
                        </div>
                        <div className="vd-row">
                            <dt>City</dt>
                            <dd>{show(vendor.city)}</dd>
                        </div>
                        <div className="vd-row">
                            <dt>State</dt>
                            <dd>{show(vendor.state)}</dd>
                        </div>
                        <div className="vd-row">
                            <dt>Pincode</dt>
                            <dd>{show(vendor.pincode)}</dd>
                        </div>
                    </dl>
                </section>

                <section className="vd-card">
                    <h2 className="vd-card-title">Business</h2>
                    <dl className="vd-list">
                        <div className="vd-row">
                            <dt>GST number</dt>
                            <dd>{show(vendor.gstNumber)}</dd>
                        </div>
                        <div className="vd-row">
                            <dt>PAN number</dt>
                            <dd>{show(vendor.panNumber)}</dd>
                        </div>
                        <div className="vd-row">
                            <dt>Added on</dt>
                            <dd>{formatDate(vendor.createdAt)}</dd>
                        </div>
                    </dl>
                </section>

                <section className="vd-card">
                    <h2 className="vd-card-title">Bank Details</h2>
                    <dl className="vd-list">
                        <div className="vd-row">
                            <dt>Account holder name</dt>
                            <dd>{show(vendor.bankDetails?.accountHolderName)}</dd>
                        </div>
                        <div className="vd-row">
                            <dt>Bank name</dt>
                            <dd>{show(vendor.bankDetails?.bankName)}</dd>
                        </div>
                        <div className="vd-row">
                            <dt>Account number</dt>
                            <dd>{show(vendor.bankDetails?.accountNumber)}</dd>
                        </div>
                        <div className="vd-row">
                            <dt>IFSC code</dt>
                            <dd>{show(vendor.bankDetails?.ifscCode)}</dd>
                        </div>
                    </dl>
                </section>
            </div>
        </div>
    );
}

export default VendorDetails;
