// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   FaPlus,
//   FaTrash,
//   FaEdit,
//   FaTools,
//   FaClock,
// } from "react-icons/fa";
// import EditServiceModal from "./EditServiceModal";
// import "./TechnicianServiceRates.css";

// const CATEGORIES = [
//   "Hardware Repair",
//   "Hardware Replacement",
//   "Software & OS",
//   "Maintenance",
//   "Diagnostics",
// ];

// // VITE_API_URL already contains /api
// // .env:
// // VITE_API_URL=http://localhost:5000/api

// const API_BASE = `${import.meta.env.VITE_API_URL}/repair-service`;

// export default function TechnicianServiceRates() {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [selectedService, setSelectedService] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const [formData, setFormData] = useState({
//     serviceName: "",
//     category: "Hardware Repair",
//     partCost: "",
//     laborCost: "",
//     estimatedTime: "1-2 hours",
//     description: "",
//   });

//   const getHeaders = () => {
//     const token = localStorage.getItem("token");

//     return token
//       ? {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       : {};
//   };

//   const fetchServices = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await axios.get(
//         `${API_BASE}/get-services`,
//         getHeaders()
//       );

//       const data =
//         res.data?.services ||
//         res.data?.data ||
//         (Array.isArray(res.data) ? res.data : []);

//       setServices(data);
//     } catch (err) {
//       console.error("Fetch Error:", err);

//       setError(
//         err.response?.data?.message ||
//           "Failed to load service charges."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const payload = {
//         ...formData,
//         partCost: Number(formData.partCost) || 0,
//         laborCost: Number(formData.laborCost) || 0,
//       };

//       const res = await axios.post(
//         `${API_BASE}/create-service`,
//         payload,
//         getHeaders()
//       );

//       const newService =
//         res.data?.service || res.data;

//       if (newService) {
//         setServices((prev) => [...prev, newService]);
//       } else {
//         fetchServices();
//       }

//       setFormData({
//         serviceName: "",
//         category: "Hardware Repair",
//         partCost: "",
//         laborCost: "",
//         estimatedTime: "1-2 hours",
//         description: "",
//       });

//       alert("Service rate saved successfully!");
//     } catch (err) {
//       console.error("Create Error:", err);

//       alert(
//         err.response?.data?.message ||
//           "Failed to add service rate."
//       );
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Remove this rate card item?")) {
//       return;
//     }

//     try {
//       await axios.delete(
//         `${API_BASE}/delete-service/${id}`,
//         getHeaders()
//       );

//       setServices((prev) =>
//         prev.filter((s) => s._id !== id)
//       );
//     } catch (err) {
//       console.error("Delete Error:", err);

//       alert(
//         err.response?.data?.message ||
//           "Failed to delete service rate."
//       );
//     }
//   };

//   const handleEditClick = (service) => {
//     setSelectedService(service);
//     setIsModalOpen(true);
//   };

//   const handleServiceUpdated = (updated) => {
//     setServices((prev) =>
//       prev.map((s) =>
//         s._id === updated._id ? updated : s
//       )
//     );
//   };





//   return (
//     <div className="sr-page-wrapper">
//       {/* Create Form Card */}
//       <div className="sr-card sr-form-container">
//         <div className="sr-card-header">
//           <div className="sr-icon-badge">
//             <FaTools />
//           </div>
//           <div>
//             <h3>Add Service Rate & Labour Charge</h3>
//             <p className="sr-subtitle">Configure standardized part & labor rates for front desk estimations</p>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="sr-form-grid">
//           <div className="sr-form-group">
//             <label>Service Title</label>
//             <input
//               type="text"
//               name="serviceName"
//               placeholder="e.g. Keyboard Replacement, RAM Upgrade"
//               value={formData.serviceName}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="sr-form-group">
//             <label>Category</label>
//             <select name="category" value={formData.category} onChange={handleChange}>
//               {CATEGORIES.map((c) => (
//                 <option key={c} value={c}>{c}</option>
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
//               placeholder="0.00"
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
//               placeholder="0.00"
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
//               placeholder="e.g. 45 mins, 1-2 hours"
//               value={formData.estimatedTime}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="sr-form-group sr-col-span-full">
//             <label>Description / Technical Scope</label>
//             <input
//               type="text"
//               name="description"
//               placeholder="e.g. Involves opening chassis and replacing unit"
//               value={formData.description}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="sr-col-span-full">
//             <button type="submit" className="sr-btn-primary">
//               <FaPlus /> Save Service Rate
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Table Card */}
//       <div className="sr-card sr-table-container">
//         <div className="sr-table-header">
//           <div>
//             <h3>Current Standard Rates</h3>
//             <p className="sr-subtitle">All active repair rates visible to reception</p>
//           </div>
//           <span className="sr-count-badge">{services.length} Services Active</span>
//         </div>

//         {error && <div className="sr-error-banner">{error}</div>}

//         {loading ? (
//           <div className="sr-loading-state">Loading service catalog...</div>
//         ) : (
//           <div className="sr-table-responsive">
//             <table className="sr-data-table">
//               <thead>
//                 <tr>
//                   <th>Service Details</th>
//                   <th>Category</th>
//                   <th>Part Cost</th>
//                   <th>Labour Cost</th>
//                   <th>Total Cost</th>
//                   <th>Est. Time</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {services.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="sr-empty-state">
//                       No standard service rates found. Add one above.
//                     </td>
//                   </tr>
//                 ) : (
//                   services.map((item) => {
//                     const total =
//                       item.totalCost !== undefined
//                         ? item.totalCost
//                         : (Number(item.partCost) || 0) + (Number(item.laborCost) || 0);

//                     return (
//                       <tr key={item._id}>
//                         <td>
//                           <div className="sr-service-title">{item.serviceName}</div>
//                           {item.description && (
//                             <div className="sr-service-desc">{item.description}</div>
//                           )}
//                         </td>
//                         <td>
//                           <span className="sr-category-chip">{item.category}</span>
//                         </td>
//                         <td className="sr-cost-dim">${Number(item.partCost || 0).toFixed(2)}</td>
//                         <td className="sr-cost-dim">${Number(item.laborCost || 0).toFixed(2)}</td>
//                         <td className="sr-cost-total">${Number(total).toFixed(2)}</td>
//                         <td>
//                           <span className="sr-time-indicator">
//                             <FaClock /> {item.estimatedTime || "1-2 hours"}
//                           </span>
//                         </td>
//                         <td className="sr-action-buttons">
//                           <button
//                             onClick={() => handleEditClick(item)}
//                             className="sr-btn-edit"
//                             title="Edit Service"
//                           >
//                             <FaEdit />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(item._id)}
//                             className="sr-btn-delete"
//                             title="Remove Service"
//                           >
//                             <FaTrash />
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Edit Modal Component */}
//       <EditServiceModal
//         isOpen={isModalOpen}
//         service={selectedService}
//         onClose={() => setIsModalOpen(false)}
//         onServiceUpdated={handleServiceUpdated}
//       />
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaTools,
  FaClock,
} from "react-icons/fa";
import EditServiceModal from "./EditServiceModal";
import "./TechnicianServiceRates.css";

const CATEGORIES = [
  "Hardware Repair",
  "Hardware Replacement",
  "Software & OS",
  "Maintenance",
  "Diagnostics",
];

// ======================================================
// API
// ======================================================
// .env:
// VITE_API_URL=http://localhost:5000/api
//
// VITE_API_URL already contains /api
// ======================================================

const API_BASE = `${import.meta.env.VITE_API_URL}/repair-service`;

// ======================================================
// INR FORMATTER
// ======================================================

const formatINR = (amount) => {
  const value = Number(amount) || 0;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export default function TechnicianServiceRates() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    serviceName: "",
    category: "Hardware Repair",
    partCost: "",
    laborCost: "",
    estimatedTime: "1-2 hours",
    description: "",
  });

  // ======================================================
  // AUTH HEADERS
  // ======================================================

  const getHeaders = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");

    return token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};
  };

  // ======================================================
  // FETCH SERVICES
  // ======================================================

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${API_BASE}/get-services`,
        getHeaders()
      );

      const data =
        res.data?.services ||
        res.data?.data ||
        (Array.isArray(res.data) ? res.data : []);

      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Service Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load service charges."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    fetchServices();
  }, []);

  // ======================================================
  // FORM CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // RESET FORM
  // ======================================================

  const resetForm = () => {
    setFormData({
      serviceName: "",
      category: "Hardware Repair",
      partCost: "",
      laborCost: "",
      estimatedTime: "1-2 hours",
      description: "",
    });
  };

  // ======================================================
  // CREATE SERVICE
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const payload = {
        serviceName: formData.serviceName.trim(),
        category: formData.category,
        partCost: Number(formData.partCost) || 0,
        laborCost: Number(formData.laborCost) || 0,
        estimatedTime:
          formData.estimatedTime?.trim() || "1-2 hours",
        description: formData.description.trim(),
      };

      const res = await axios.post(
        `${API_BASE}/create-service`,
        payload,
        getHeaders()
      );

      const newService =
        res.data?.service ||
        res.data?.data ||
        res.data;

      if (newService && newService._id) {
        setServices((prev) => [...prev, newService]);
      } else {
        await fetchServices();
      }

      resetForm();

      alert("Service rate saved successfully!");
    } catch (err) {
      console.error("Create Service Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to add service rate."
      );
    }
  };

  // ======================================================
  // DELETE SERVICE
  // ======================================================

  const handleDelete = async (id) => {
    if (!id) {
      alert("Invalid service ID.");
      return;
    }

    const confirmed = window.confirm(
      "Remove this rate card item?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await axios.delete(
        `${API_BASE}/delete-service/${id}`,
        getHeaders()
      );

      setServices((prev) =>
        prev.filter((service) => service._id !== id)
      );

      alert("Service rate deleted successfully!");
    } catch (err) {
      console.error("Delete Service Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to delete service rate."
      );
    }
  };

  // ======================================================
  // EDIT SERVICE
  // ======================================================

  const handleEditClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  // ======================================================
  // SERVICE UPDATED FROM MODAL
  // ======================================================

  const handleServiceUpdated = (updated) => {
    if (!updated?._id) {
      fetchServices();
      return;
    }

    setServices((prev) =>
      prev.map((service) =>
        service._id === updated._id
          ? updated
          : service
      )
    );

    setSelectedService(null);
    setIsModalOpen(false);
  };

  // ======================================================
  // CLOSE MODAL
  // ======================================================

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="sr-page-wrapper">

      {/* ==================================================
          CREATE FORM CARD
      ================================================== */}

      <div className="sr-card sr-form-container">

        <div className="sr-card-header">

          <div className="sr-icon-badge">
            <FaTools />
          </div>

          <div>
            <h3>Add Service Rate & Labour Charge</h3>

            <p className="sr-subtitle">
              Configure standardized part & labor rates
              for front desk estimations
            </p>
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="sr-form-grid"
        >

          {/* SERVICE TITLE */}

          <div className="sr-form-group">
            <label>Service Title</label>

            <input
              type="text"
              name="serviceName"
              placeholder="e.g. Keyboard Replacement, RAM Upgrade"
              value={formData.serviceName}
              onChange={handleChange}
              required
            />
          </div>

          {/* CATEGORY */}

          <div className="sr-form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* PART COST */}

          <div className="sr-form-group">
            <label>Part Cost (₹)</label>

            <input
              type="number"
              name="partCost"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.partCost}
              onChange={handleChange}
            />
          </div>

          {/* LABOUR COST */}

          <div className="sr-form-group">
            <label>Labour Cost (₹)</label>

            <input
              type="number"
              name="laborCost"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.laborCost}
              onChange={handleChange}
              required
            />
          </div>

          {/* ESTIMATED TIME */}

          <div className="sr-form-group">
            <label>Estimated Time</label>

            <input
              type="text"
              name="estimatedTime"
              placeholder="e.g. 45 mins, 1-2 hours"
              value={formData.estimatedTime}
              onChange={handleChange}
            />
          </div>

          {/* DESCRIPTION */}

          <div className="sr-form-group sr-col-span-full">

            <label>
              Description / Technical Scope
            </label>

            <input
              type="text"
              name="description"
              placeholder="e.g. Involves opening chassis and replacing unit"
              value={formData.description}
              onChange={handleChange}
            />

          </div>

          {/* SUBMIT */}

          <div className="sr-col-span-full">

            <button
              type="submit"
              className="sr-btn-primary"
            >
              <FaPlus />
              Save Service Rate
            </button>

          </div>

        </form>
      </div>

      {/* ==================================================
          TABLE CARD
      ================================================== */}

      <div className="sr-card sr-table-container">

        <div className="sr-table-header">

          <div>

            <h3>Current Standard Rates</h3>

            <p className="sr-subtitle">
              All active repair rates visible to reception
            </p>

          </div>

          <span className="sr-count-badge">
            {services.length} Services Active
          </span>

        </div>

        {/* ERROR */}

        {error && (
          <div className="sr-error-banner">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="sr-loading-state">
            Loading service catalog...
          </div>
        ) : (

          <div className="sr-table-responsive">

            <table className="sr-data-table">

              <thead>

                <tr>
                  <th>Service Details</th>
                  <th>Category</th>
                  <th>Part Cost</th>
                  <th>Labour Cost</th>
                  <th>Total Cost</th>
                  <th>Est. Time</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {services.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="sr-empty-state"
                    >
                      No standard service rates found.
                      Add one above.
                    </td>

                  </tr>

                ) : (

                  services.map((item) => {

                    const partCost =
                      Number(item.partCost) || 0;

                    const laborCost =
                      Number(item.laborCost) || 0;

                    const total =
                      item.totalCost !== undefined &&
                      item.totalCost !== null
                        ? Number(item.totalCost) || 0
                        : partCost + laborCost;

                    return (

                      <tr key={item._id}>

                        {/* SERVICE */}

                        <td>

                          <div className="sr-service-title">
                            {item.serviceName}
                          </div>

                          {item.description && (
                            <div className="sr-service-desc">
                              {item.description}
                            </div>
                          )}

                        </td>

                        {/* CATEGORY */}

                        <td>

                          <span className="sr-category-chip">
                            {item.category}
                          </span>

                        </td>

                        {/* PART COST */}

                        <td className="sr-cost-dim">
                          {formatINR(partCost)}
                        </td>

                        {/* LABOUR COST */}

                        <td className="sr-cost-dim">
                          {formatINR(laborCost)}
                        </td>

                        {/* TOTAL */}

                        <td className="sr-cost-total">
                          {formatINR(total)}
                        </td>

                        {/* TIME */}

                        <td>

                          <span className="sr-time-indicator">
                            <FaClock />
                            {item.estimatedTime ||
                              "1-2 hours"}
                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td className="sr-action-buttons">

                          <button
                            type="button"
                            onClick={() =>
                              handleEditClick(item)
                            }
                            className="sr-btn-edit"
                            title="Edit Service"
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(item._id)
                            }
                            className="sr-btn-delete"
                            title="Remove Service"
                          >
                            <FaTrash />
                          </button>

                        </td>

                      </tr>

                    );
                  })

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ==================================================
          EDIT MODAL
      ================================================== */}

      <EditServiceModal
        isOpen={isModalOpen}
        service={selectedService}
        onClose={handleCloseModal}
        onServiceUpdated={handleServiceUpdated}
      />

    </div>
  );
}