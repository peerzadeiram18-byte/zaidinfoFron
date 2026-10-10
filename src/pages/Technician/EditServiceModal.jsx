// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaTimes, FaSave } from "react-icons/fa";

// const CATEGORIES = [
//   "Hardware Repair",
//   "Hardware Replacement",
//   "Software & OS",
//   "Maintenance",
//   "Diagnostics",
// ];

// // const API_BASE = "http://localhost:5000/api/repair-service";

// const API_BASE = `${import.meta.env.VITE_API_URL}/repair-service`;


// export default function EditServiceModal({ isOpen, service, onClose, onServiceUpdated }) {
//   const [formData, setFormData] = useState({
//     serviceName: "",
//     category: "Hardware Repair",
//     partCost: "",
//     laborCost: "",
//     estimatedTime: "",
//     description: "",
//   });
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     if (service) {
//       setFormData({
//         serviceName: service.serviceName || "",
//         category: service.category || "Hardware Repair",
//         partCost: service.partCost !== undefined ? service.partCost : "",
//         laborCost: service.laborCost !== undefined ? service.laborCost : "",
//         estimatedTime: service.estimatedTime || "1-2 hours",
//         description: service.description || "",
//       });
//     }
//   }, [service]);

//   if (!isOpen || !service) return null;

//   const getHeaders = () => {
//     const token = localStorage.getItem("token");
//     return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       setSubmitting(true);
//       const payload = {
//         ...formData,
//         partCost: Number(formData.partCost) || 0,
//         laborCost: Number(formData.laborCost) || 0,
//       };

//       const res = await axios.put(
//         `${API_BASE}/update-service/${service._id}`,
//         payload,
//         getHeaders()
//       );

//       const updatedService = res.data?.service || res.data;
//       onServiceUpdated(updatedService);
//       onClose();
//     } catch (err) {
//       console.error("Update Error:", err);
//       alert(err.response?.data?.message || "Failed to update service rate.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="sr-modal-overlay">
//       <div className="sr-modal-card">
//         <div className="sr-modal-header">
//           <h3>Edit Service Rate</h3>
//           <button type="button" className="sr-btn-close" onClick={onClose}>
//             <FaTimes />
//           </button>
//         </div>

//         <form onSubmit={handleUpdate} className="sr-form-grid">
//           <div className="sr-form-group">
//             <label>Service Title</label>
//             <input
//               type="text"
//               name="serviceName"
//               value={formData.serviceName}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="sr-form-group">
//             <label>Category</label>
//             <select name="category" value={formData.category} onChange={handleChange}>
//               {CATEGORIES.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="sr-form-group">
//             <label>Part Cost ($)</label>
//             <input
//               type="number"
//               name="partCost"
//               min="0"
//               step="0.01"
//               value={formData.partCost}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="sr-form-group">
//             <label>Labour Cost ($)</label>
//             <input
//               type="number"
//               name="laborCost"
//               min="0"
//               step="0.01"
//               value={formData.laborCost}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="sr-form-group">
//             <label>Estimated Time</label>
//             <input
//               type="text"
//               name="estimatedTime"
//               value={formData.estimatedTime}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="sr-form-group sr-col-span-full">
//             <label>Description / Technical Scope</label>
//             <input
//               type="text"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="sr-modal-actions sr-col-span-full">
//             <button type="button" className="sr-btn-secondary" onClick={onClose}>
//               Cancel
//             </button>
//             <button type="submit" className="sr-btn-primary" disabled={submitting}>
//               <FaSave /> {submitting ? "Updating..." : "Save Changes"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes, FaSave } from "react-icons/fa";

const CATEGORIES = [
  "Hardware Repair",
  "Hardware Replacement",
  "Software & OS",
  "Maintenance",
  "Diagnostics",
];

// ======================================================
// API CONFIGURATION
// .env example:
// VITE_API_URL=http://localhost:5000/api
// ======================================================

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
  .replace(/\/+$/, "");

const API_BASE = `${API_URL}/repair-service`;

// ======================================================
// EDIT SERVICE MODAL
// ======================================================

export default function EditServiceModal({
  isOpen,
  service,
  onClose,
  onServiceUpdated,
}) {
  const [formData, setFormData] = useState({
    serviceName: "",
    category: "Hardware Repair",
    partCost: "",
    laborCost: "",
    estimatedTime: "1-2 hours",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Populate the form whenever a different service is selected.
  useEffect(() => {
    if (!service) return;

    setFormData({
      serviceName: service.serviceName || "",
      category: service.category || "Hardware Repair",
      partCost: service.partCost ?? 0,
      laborCost: service.laborCost ?? 0,
      estimatedTime: service.estimatedTime || "1-2 hours",
      description: service.description || "",
    });

    setErrorMessage("");
  }, [service]);

  // Don't render the modal when closed.
  if (!isOpen || !service) return null;

  // ======================================================
  // AUTH HEADERS
  // ======================================================

  const getHeaders = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    if (!token) {
      throw new Error(
        "Login token nahi mila. Please dobara login karke try karein."
      );
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // ======================================================
  // INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  // ======================================================
  // UPDATE SERVICE
  // ======================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (submitting) return;

    const serviceId = service?._id;

    if (!serviceId) {
      setErrorMessage("Service ID nahi mila. Please modal dobara open karein.");
      return;
    }

    const serviceName = formData.serviceName.trim();
    const partCost = Number(formData.partCost);
    const laborCost = Number(formData.laborCost);

    if (!serviceName) {
      setErrorMessage("Service title required hai.");
      return;
    }

    if (
      formData.partCost === "" ||
      !Number.isFinite(partCost) ||
      partCost < 0
    ) {
      setErrorMessage("Please valid Part Cost enter karein.");
      return;
    }

    if (
      formData.laborCost === "" ||
      !Number.isFinite(laborCost) ||
      laborCost < 0
    ) {
      setErrorMessage("Please valid Labour Cost enter karein.");
      return;
    }

    if (!CATEGORIES.includes(formData.category)) {
      setErrorMessage("Please valid service category select karein.");
      return;
    }

    const payload = {
      serviceName,
      category: formData.category,
      partCost,
      laborCost,
      totalCost: partCost + laborCost,
      estimatedTime: formData.estimatedTime.trim() || "1-2 hours",
      description: formData.description.trim(),
    };

    try {
      setSubmitting(true);
      setErrorMessage("");

      const response = await axios.put(
        `${API_BASE}/update-service/${serviceId}`,
        payload,
        getHeaders()
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "Service update nahi hui."
        );
      }

      const updatedService =
        response.data?.service || response.data?.data || response.data;

      if (!updatedService || !updatedService._id) {
        throw new Error(
          "Server response mein updated service nahi mili. Backend response check karein."
        );
      }

      // Update the service in the parent component.
      if (typeof onServiceUpdated === "function") {
        onServiceUpdated(updatedService);
      }

      // Close modal only after a successful update.
      if (typeof onClose === "function") {
        onClose();
      }
    } catch (error) {
      console.error(
        "Update Service Error:",
        error.response?.data || error
      );

      let message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update service rate.";

      if (error.response?.status === 401) {
        message = "Session expire ho gaya hai. Please dobara login karein.";
      } else if (error.response?.status === 403) {
        message = "Aapko service rate update karne ki permission nahi hai.";
      } else if (error.response?.status === 404) {
        message = "Service ya API route nahi mila. Backend route check karein.";
      } else if (error.response?.status === 500) {
        message = "Backend server error. Backend terminal mein error check karein.";
      } else if (!error.response && !(error instanceof Error)) {
        message = "Server se connection nahi ho pa raha hai.";
      }

      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div
      className="sr-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) {
          onClose?.();
        }
      }}
    >
      <div
        className="sr-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sr-edit-service-title"
      >
        {/* Header */}
        <div className="sr-modal-header">
          <h3 id="sr-edit-service-title">Edit Service Rate</h3>

          <button
            type="button"
            className="sr-btn-close"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="sr-form-grid">
          <div className="sr-form-group">
            <label htmlFor="sr-serviceName">Service Title</label>

            <input
              id="sr-serviceName"
              type="text"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              placeholder="Enter service title"
              maxLength={150}
              required
            />
          </div>

          <div className="sr-form-group">
            <label htmlFor="sr-category">Category</label>

            <select
              id="sr-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="sr-form-group">
            <label htmlFor="sr-partCost">Part Cost (₹)</label>

            <input
              id="sr-partCost"
              type="number"
              name="partCost"
              min="0"
              step="0.01"
              value={formData.partCost}
              onChange={handleChange}
              placeholder="Enter part cost"
              required
            />
          </div>

          <div className="sr-form-group">
            <label htmlFor="sr-laborCost">Labour Cost (₹)</label>

            <input
              id="sr-laborCost"
              type="number"
              name="laborCost"
              min="0"
              step="0.01"
              value={formData.laborCost}
              onChange={handleChange}
              placeholder="Enter labour cost"
              required
            />
          </div>

          <div className="sr-form-group">
            <label htmlFor="sr-estimatedTime">Estimated Time</label>

            <input
              id="sr-estimatedTime"
              type="text"
              name="estimatedTime"
              value={formData.estimatedTime}
              onChange={handleChange}
              placeholder="Example: 1-2 hours"
            />
          </div>

          <div className="sr-form-group sr-col-span-full">
            <label htmlFor="sr-description">
              Description / Technical Scope
            </label>

            <input
              id="sr-description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter service description"
              maxLength={1000}
            />
          </div>

          {/* Total Cost Preview */}
          <div className="sr-form-group sr-col-span-full">
            <label>Total Service Cost</label>

            <input
              type="text"
              value={`₹${(
                (Number(formData.partCost) || 0) +
                (Number(formData.laborCost) || 0)
              ).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              readOnly
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              className="sr-col-span-full"
              role="alert"
              style={{
                color: "#b42318",
                background: "#fef3f2",
                border: "1px solid #fecdca",
                borderRadius: "6px",
                padding: "10px 12px",
                fontSize: "14px",
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Actions */}
          <div className="sr-modal-actions sr-col-span-full">
            <button
              type="button"
              className="sr-btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="sr-btn-primary"
              disabled={submitting}
            >
              <FaSave />
              {submitting ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

