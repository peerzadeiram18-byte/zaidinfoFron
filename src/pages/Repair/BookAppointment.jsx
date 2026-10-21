// import React, { useState } from "react";
// import "./BookAppointment.css";

// const BookAppointment = ({ onClose }) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedDevice, setSelectedDevice] = useState("");

//   const [selectedCenter, setSelectedCenter] = useState("");
//   const [serviceType, setServiceType] = useState("");
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

//   const [formData, setFormData] = useState({
//     brand: "",
//     model: "",
//     problem: "",
//     serial: "",
//     issue: "",
//     name: "",
//     email: "",
//     mobile: "",
//     date: "",
//   });

//   // ==========================================
//   // UPDATED CHENNAI BRANCHES
//   // ==========================================
//   const centers = ["ALANDUR", "MOUNT ROAD"];

//   // ==========================================
//   // CHARGES
//   // Pickup & Drop is FREE across Chennai
//   // ==========================================
//   const PICKUP_DROP_CHARGE = 0;
//   const DIAGNOSTIC_CHARGE = 1770;

//   const visitTimeSlots = [
//     "10:00 AM - 11:00 AM",
//     "11:00 AM - 12:00 PM",
//     "12:00 PM - 01:00 PM",
//     "01:00 PM - 02:00 PM",
//     "02:00 PM - 03:00 PM",
//     "03:00 PM - 04:00 PM",
//     "04:00 PM - 05:00 PM",
//     "05:00 PM - 06:00 PM",
//     "06:00 PM - 07:00 PM",
//   ];

//   const pickupTimeSlots = [
//     "10:00 AM - 12:00 PM",
//     "12:00 PM - 02:00 PM",
//     "02:00 PM - 04:00 PM",
//     "04:00 PM - 06:00 PM",
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const nextStep = (e) => {
//     if (e) e.preventDefault();
//     setCurrentStep((prev) => Math.min(prev + 1, 3));
//   };

//   const prevStep = (e) => {
//     if (e) e.preventDefault();
//     setCurrentStep((prev) => Math.max(prev - 1, 1));
//   };

//   const handleServiceTypeChange = (type) => {
//     setServiceType(type);
//     setSelectedTimeSlot("");
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const finalData = {
//       ...formData,
//       device: selectedDevice,
//       serviceCenter: selectedCenter,
//       serviceType,
//       timeSlot: selectedTimeSlot,

//       pickupDropCharges:
//         serviceType === "pickup"
//           ? PICKUP_DROP_CHARGE
//           : 0,

//       diagnosticCharges:
//         serviceType === "pickup"
//           ? DIAGNOSTIC_CHARGE
//           : 0,

//       totalCharges:
//         serviceType === "pickup"
//           ? PICKUP_DROP_CHARGE + DIAGNOSTIC_CHARGE
//           : 0,
//     };

//     console.log("Submitted Data:", finalData);

//     // Existing submit behavior preserved.
//     // Connect your booking/payment API here.
//     if (onClose) onClose();
//   };

//   return (
//     <div className="bokwrap-modal">
//       <div className="card-custom">
//         {onClose && (
//           <button
//             type="button"
//             className="btn-modal-close"
//             onClick={onClose}
//           >
//             &times;
//           </button>
//         )}

//         <div className="top-header-badge">
//           <span>📅</span> BOOK YOUR SERVICE
//         </div>

//         {/* ======================================
//             STEP 1: DEVICE INFORMATION
//         ====================================== */}
//         {currentStep === 1 && (
//           <div className="step-content">
//             <div className="step-header-bar">
//               STEP 1: DEVICE INFORMATION
//             </div>

//             <div className="form-group-block">
//               <label>Select your device</label>

//               <div className="device-tile-grid">
//                 <div
//                   className={`device-tile ${
//                     selectedDevice === "laptop"
//                       ? "active"
//                       : ""
//                   }`}
//                   onClick={() =>
//                     setSelectedDevice("laptop")
//                   }
//                 >
//                   <svg
//                     viewBox="0 0 24 24"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <rect
//                       x="2"
//                       y="3"
//                       width="20"
//                       height="14"
//                       rx="2"
//                       ry="2"
//                     />
//                     <line
//                       x1="2"
//                       y1="20"
//                       x2="22"
//                       y2="20"
//                     />
//                   </svg>
//                   <span>Laptop</span>
//                 </div>

//                 <div
//                   className={`device-tile ${
//                     selectedDevice === "desktop"
//                       ? "active"
//                       : ""
//                   }`}
//                   onClick={() =>
//                     setSelectedDevice("desktop")
//                   }
//                 >
//                   <svg
//                     viewBox="0 0 24 24"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <rect
//                       x="2"
//                       y="3"
//                       width="20"
//                       height="14"
//                       rx="2"
//                       ry="2"
//                     />
//                     <line
//                       x1="8"
//                       y1="21"
//                       x2="16"
//                       y2="21"
//                     />
//                     <line
//                       x1="12"
//                       y1="17"
//                       x2="12"
//                       y2="21"
//                     />
//                   </svg>
//                   <span>Desktop</span>
//                 </div>

//                 <div
//                   className={`device-tile ${
//                     selectedDevice === "allinone"
//                       ? "active"
//                       : ""
//                   }`}
//                   onClick={() =>
//                     setSelectedDevice("allinone")
//                   }
//                 >
//                   <svg
//                     viewBox="0 0 24 24"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <rect
//                       x="3"
//                       y="2"
//                       width="18"
//                       height="15"
//                       rx="2"
//                       ry="2"
//                     />
//                     <line
//                       x1="12"
//                       y1="17"
//                       x2="12"
//                       y2="21"
//                     />
//                     <line
//                       x1="6"
//                       y1="21"
//                       x2="18"
//                       y2="21"
//                     />
//                   </svg>
//                   <span>All in One</span>
//                 </div>

//                 <div
//                   className={`device-tile ${
//                     selectedDevice === "ipad"
//                       ? "active"
//                       : ""
//                   }`}
//                   onClick={() =>
//                     setSelectedDevice("ipad")
//                   }
//                 >
//                   <svg
//                     viewBox="0 0 24 24"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <rect
//                       x="4"
//                       y="2"
//                       width="16"
//                       height="20"
//                       rx="2"
//                       ry="2"
//                     />
//                     <line
//                       x1="12"
//                       y1="18"
//                       x2="12.01"
//                       y2="18"
//                     />
//                   </svg>
//                   <span>iPad</span>
//                 </div>
//               </div>
//             </div>

//             <div className="form-group-block">
//               <label htmlFor="brand">
//                 Select your Brand
//               </label>

//               <select
//                 id="brand"
//                 name="brand"
//                 className="input-soft-blue"
//                 value={formData.brand}
//                 onChange={handleChange}
//               >
//                 <option value="" disabled hidden>
//                   Select Brand
//                 </option>
//                 <option value="Asus">Asus</option>
//                 <option value="Dell">Dell</option>
//                 <option value="HP">HP</option>
//                 <option value="Lenovo">Lenovo</option>
//                 <option value="Apple">Apple</option>
//               </select>
//             </div>

//             <div className="form-group-block">
//               <label htmlFor="model">
//                 Select Your Model
//               </label>

//               <select
//                 id="model"
//                 name="model"
//                 className="input-soft-blue"
//                 value={formData.model}
//                 onChange={handleChange}
//               >
//                 <option value="" disabled hidden>
//                   Select Model
//                 </option>
//                 <option value="ExpertsBook">
//                   ExpertsBook
//                 </option>
//                 <option value="ROG">ROG</option>
//                 <option value="TUF">TUF</option>
//                 <option value="ZenBook">ZenBook</option>
//               </select>
//             </div>

//             <div className="form-group-block">
//               <label htmlFor="problem">
//                 Select your device problem
//               </label>

//               <select
//                 id="problem"
//                 name="problem"
//                 className="input-soft-blue"
//                 value={formData.problem}
//                 onChange={handleChange}
//               >
//                 <option value="" disabled hidden>
//                   Select Problem
//                 </option>
//                 <option value="Booting Problem">
//                   Booting Problem
//                 </option>
//                 <option value="Battery Issue">
//                   Battery Issue
//                 </option>
//                 <option value="Screen Damage">
//                   Screen Damage
//                 </option>
//                 <option value="Keyboard Malfunction">
//                   Keyboard Malfunction
//                 </option>
//               </select>
//             </div>

//             <div className="form-group-block">
//               <label htmlFor="serial">
//                 Serial Number (Optional)
//               </label>

//               <input
//                 type="text"
//                 id="serial"
//                 name="serial"
//                 className="input-soft-blue"
//                 placeholder="Enter Serial Number"
//                 value={formData.serial}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-group-block">
//               <label htmlFor="issue">
//                 Write Issue
//               </label>

//               <textarea
//                 id="issue"
//                 name="issue"
//                 rows="3"
//                 className="input-soft-blue"
//                 placeholder="Describe the issue..."
//                 value={formData.issue}
//                 onChange={handleChange}
//               />
//             </div>

//             <button
//               type="button"
//               className="btn-gradient-submit"
//               onClick={nextStep}
//             >
//               NEXT &rarr;
//             </button>
//           </div>
//         )}

//         {/* ======================================
//             STEP 2: PERSONAL INFORMATION
//         ====================================== */}
//         {currentStep === 2 && (
//           <div className="step-content">
//             <div className="step-header-bar">
//               STEP 2: PERSONAL INFORMATION
//             </div>

//             <div className="form-group-block">
//               <label>Name</label>

//               <input
//                 type="text"
//                 name="name"
//                 className="input-soft-blue"
//                 placeholder="Enter your name"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-group-block">
//               <label>Email</label>

//               <input
//                 type="email"
//                 name="email"
//                 className="input-soft-blue"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-group-block">
//               <label>Mobile</label>

//               <input
//                 type="tel"
//                 name="mobile"
//                 className="input-soft-blue"
//                 placeholder="Enter your mobile number"
//                 value={formData.mobile}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="action-button-group">
//               <button
//                 type="button"
//                 className="btn-gradient-submit"
//                 onClick={prevStep}
//               >
//                 &larr; PREV
//               </button>

//               <button
//                 type="button"
//                 className="btn-gradient-submit"
//                 onClick={nextStep}
//               >
//                 NEXT &rarr;
//               </button>
//             </div>
//           </div>
//         )}

//         {/* ======================================
//             STEP 3: SERVICE DETAILS
//         ====================================== */}
//         {currentStep === 3 && (
//           <div className="step-content">
//             <div className="step-header-bar">
//               STEP 3: SERVICE DETAILS
//             </div>

//             {/* UPDATED CHENNAI BRANCHES */}
//             <div className="form-group-block">
//               <label>Select Service Center</label>

//               <div className="options-row center-options">
//                 {centers.map((center) => (
//                   <label
//                     key={center}
//                     className={`custom-radio-card ${
//                       selectedCenter === center
//                         ? "selected"
//                         : ""
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name="serviceCenter"
//                       value={center}
//                       checked={selectedCenter === center}
//                       onChange={() =>
//                         setSelectedCenter(center)
//                       }
//                     />

//                     <span className="radio-circle"></span>
//                     {center}
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* UPDATED SERVICE TYPES */}
//             <div className="form-group-block">
//               <label>Select Service Type</label>

//               <div className="options-row type-options">
//                 <label
//                   className={`custom-radio-card wide ${
//                     serviceType === "visit"
//                       ? "selected dark"
//                       : ""
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="serviceType"
//                     value="visit"
//                     checked={serviceType === "visit"}
//                     onChange={() =>
//                       handleServiceTypeChange("visit")
//                     }
//                   />

//                   <span className="radio-circle"></span>
//                   Visit Service Center
//                 </label>

//                 <label
//                   className={`custom-radio-card wide ${
//                     serviceType === "pickup"
//                       ? "selected dark"
//                       : ""
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="serviceType"
//                     value="pickup"
//                     checked={serviceType === "pickup"}
//                     onChange={() =>
//                       handleServiceTypeChange("pickup")
//                     }
//                   />

//                   <span className="radio-circle"></span>
//                   Pickup & Drop (Free across Chennai)
//                 </label>
//               </div>
//             </div>

//             {serviceType && (
//               <div className="service-details-card">
//                 {/* PICKUP & DROP CHARGES */}
//                 {serviceType === "pickup" && (
//                   <div className="charges-table-container">
//                     <p
//                       style={{
//                         color: "#15803d",
//                         fontWeight: "700",
//                         marginBottom: "12px",
//                       }}
//                     >
//                       ✓ Free Pickup & Drop across Chennai
//                     </p>

//                     <table className="charges-table">
//                       <thead>
//                         <tr>
//                           <th>SERVICE</th>
//                           <th>CHARGES (₹)</th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         <tr>
//                           <td>Pickup & Drop Charges</td>
//                           <td
//                             style={{
//                               color: "#15803d",
//                               fontWeight: "700",
//                             }}
//                           >
//                             FREE
//                           </td>
//                         </tr>

//                         <tr>
//                           <td>Diagnostic Charges</td>
//                           <td>
//                             ₹{" "}
//                             {DIAGNOSTIC_CHARGE.toLocaleString(
//                               "en-IN"
//                             )}
//                             .00
//                           </td>
//                         </tr>

//                         <tr className="total-row">
//                           <td>TOTAL CHARGES</td>
//                           <td>
//                             ₹{" "}
//                             {(
//                               PICKUP_DROP_CHARGE +
//                               DIAGNOSTIC_CHARGE
//                             ).toLocaleString("en-IN")}
//                             .00
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 )}

//                 {/* BOOKING DATE */}
//                 <div className="form-group-block">
//                   <label>Select Booking Date</label>

//                   <input
//                     type="date"
//                     name="date"
//                     className="input-soft-blue"
//                     value={formData.date}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 {/* TIME SLOTS */}
//                 <div className="form-group-block">
//                   <label>Select Time Slot</label>

//                   <div className="slots-grid">
//                     {(
//                       serviceType === "visit"
//                         ? visitTimeSlots
//                         : pickupTimeSlots
//                     ).map((slot) => (
//                       <label
//                         key={slot}
//                         className={`custom-radio-card slot-card ${
//                           selectedTimeSlot === slot
//                             ? "selected"
//                             : ""
//                         }`}
//                       >
//                         <input
//                           type="radio"
//                           name="timeSlot"
//                           value={slot}
//                           checked={
//                             selectedTimeSlot === slot
//                           }
//                           onChange={() =>
//                             setSelectedTimeSlot(slot)
//                           }
//                         />

//                         <span className="radio-circle"></span>
//                         {slot}
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="action-button-group">
//               <button
//                 type="button"
//                 className="btn-gradient-submit"
//                 onClick={prevStep}
//               >
//                 &larr; PREV
//               </button>

//               <button
//                 type="button"
//                 className="btn-dark-submit"
//                 onClick={handleSubmit}
//               >
//                 {serviceType === "pickup"
//                   ? "PAY NOW"
//                   : "SUBMIT"}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BookAppointment;



import React, { useState } from "react";
import "./BookAppointment.css";

// Brand-wise series for the device/model dropdown.
const LAPTOP_SERIES = {
  HP: ["EliteBook", "ProBook", "ZBook", "Pavilion", "Envy", "Spectre", "OmniBook", "Chromebook"],
  Dell: ["Latitude", "Precision", "Vostro", "Inspiron", "XPS", "XPS 13", "XPS 14", "XPS 15", "XPS 16", "XPS 17", "Alienware", "G Series", "Dell Pro"],
  Lenovo: ["ThinkPad", "ThinkBook", "IdeaPad", "Yoga", "Legion", "LOQ"],
  Acer: ["TravelMate", "Aspire", "Swift", "Spin", "Predator", "Nitro"],
  ASUS: ["ExpertBook", "VivoBook", "ZenBook", "ProArt", "TUF Gaming", "ROG", "Chromebook"],
  Apple: ["MacBook Air", "MacBook Pro"],
  "Xiaomi (Mi)": ["Mi Notebook", "Mi Notebook Pro", "RedmiBook", "RedmiBook Pro"],
  Infinix: ["INBook X1", "INBook X1 Slim", "INBook X2", "INBook Y1 Plus", "INBook Air Pro"],
  Hasee: ["Z7", "Z8", "Z9", "T8", "T6", "God of War", "Ares"],
  Sony: ["VAIO", "VAIO E Series", "VAIO S Series", "VAIO Z Series", "VAIO Fit", "VAIO Pro"],
  Samsung: ["Galaxy Book", "Galaxy Book Pro", "Galaxy Book Ultra"],
  Microsoft: ["Surface Laptop", "Surface Pro"],
  Fujitsu: ["LIFEBOOK"],
  "Dynabook / Toshiba": ["Tecra", "Portégé", "Satellite"],

   // MSI LAPTOP SERIES
  MSI: [
    "Modern",
    "Prestige",
    "Summit",
    "Thin",
    "Cyborg",
    "Katana",
    "Raider",
    "Stealth",
  ],
};

// Printer brands/models can be expanded independently.
const PRINTER_SERIES = {
  HP: ["DeskJet", "ENVY", "OfficeJet", "LaserJet", "Smart Tank"],
  Canon: ["PIXMA", "imageCLASS", "MAXIFY", "imagePROGRAF"],
  Epson: ["EcoTank", "WorkForce", "Expression", "SureColor"],
  Brother: ["DCP Series", "MFC Series", "HL Series"],
  Samsung: ["Xpress", "ProXpress"],
  Xerox: ["VersaLink", "WorkCentre", "Phaser"],
  Ricoh: ["SP Series", "IM Series", "P Series"],
  Pantum: ["P Series", "M Series", "BM Series"],
};

const DEVICE_OPTIONS = [
  { value: "laptop", label: "Laptop" },
  { value: "desktop", label: "Desktop" },
  { value: "allinone", label: "All in One" },
  { value: "printer", label: "Printer" },
];

const BookAppointment = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDevice, setSelectedDevice] = useState("");

  const [selectedCenter, setSelectedCenter] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    problem: "",
    serial: "",
    issue: "",
    name: "",
    email: "",
    mobile: "",
    date: "",
  });

  // ==========================================
  // UPDATED CHENNAI BRANCHES
  // ==========================================
  const centers = ["ALANDUR", "MOUNT ROAD"];

  // ==========================================
  // CHARGES
  // Pickup & Drop is FREE across Chennai
  // ==========================================
  const PICKUP_DROP_CHARGE = 0;
  const DIAGNOSTIC_CHARGE = 1770;

  const visitTimeSlots = [
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
    "06:00 PM - 07:00 PM",
  ];

  const pickupTimeSlots = [
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
  ];

  const seriesByBrand = selectedDevice === "printer" ? PRINTER_SERIES : LAPTOP_SERIES;
  const brandOptions = Object.keys(seriesByBrand);
  const modelOptions = seriesByBrand[formData.brand] || [];

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
    setFormData((prev) => ({ ...prev, brand: "", model: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "brand" ? { model: "" } : {}),
    }));
  };

  const nextStep = (e) => {
    if (e) e.preventDefault();
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = (e) => {
    if (e) e.preventDefault();
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleServiceTypeChange = (type) => {
    setServiceType(type);
    setSelectedTimeSlot("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      device: selectedDevice,
      serviceCenter: selectedCenter,
      serviceType,
      timeSlot: selectedTimeSlot,

      pickupDropCharges:
        serviceType === "pickup"
          ? PICKUP_DROP_CHARGE
          : 0,

      diagnosticCharges:
        serviceType === "pickup"
          ? DIAGNOSTIC_CHARGE
          : 0,

      totalCharges:
        serviceType === "pickup"
          ? PICKUP_DROP_CHARGE + DIAGNOSTIC_CHARGE
          : 0,
    };

    console.log("Submitted Data:", finalData);

    // Existing submit behavior preserved.
    // Connect your booking/payment API here.
    if (onClose) onClose();
  };

  return (
    <div className="bokwrap-modal">
      <div className="card-custom">
        {onClose && (
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
          >
            &times;
          </button>
        )}

        <div className="top-header-badge">
          <span>📅</span> BOOK YOUR SERVICE
        </div>

        {/* ======================================
            STEP 1: DEVICE INFORMATION
        ====================================== */}
        {currentStep === 1 && (
          <div className="step-content">
            <div className="step-header-bar">
              STEP 1: DEVICE INFORMATION
            </div>

            <div className="form-group-block">
              <label>Select your device</label>

              <div className="device-tile-grid">
                {DEVICE_OPTIONS.map((device) => (
                  <div
                    key={device.value}
                    role="button"
                    tabIndex={0}
                    className={`device-tile ${selectedDevice === device.value ? "active" : ""}`}
                    onClick={() => handleDeviceSelect(device.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleDeviceSelect(device.value);
                      }
                    }}
                  >
                    {device.value === "printer" ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <path d="M6 14h12v7H6zM18 12h.01" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="14" rx="2" />
                        {device.value === "laptop" ? <path d="M2 20h20" /> : <path d="M12 17v4M7 21h10" />}
                      </svg>
                    )}
                    <span>{device.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group-block">
              <label htmlFor="brand">
                Select your Brand
              </label>

              <select
                id="brand"
                name="brand"
                className="input-soft-blue"
                value={formData.brand}
                onChange={handleChange}
                disabled={!selectedDevice}
              >
                <option value="" disabled hidden>
                  Select Brand
                </option>
                {brandOptions.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className="form-group-block">
              <label htmlFor="model">
                Select Your Model
              </label>

              <select
                id="model"
                name="model"
                className="input-soft-blue"
                value={formData.model}
                onChange={handleChange}
                disabled={!formData.brand}
              >
                <option value="" disabled hidden>
                  Select Model
                </option>
                {modelOptions.map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            <div className="form-group-block">
              <label htmlFor="problem">
                Select your device problem
              </label>

              <select
                id="problem"
                name="problem"
                className="input-soft-blue"
                value={formData.problem}
                onChange={handleChange}
              >
                <option value="" disabled hidden>
                  Select Problem
                </option>
                <option value="Booting Problem">
                  Booting Problem
                </option>
                <option value="Battery Issue">
                  Battery Issue
                </option>
                <option value="Screen Damage">
                  Screen Damage
                </option>
                <option value="Keyboard Malfunction">
                  Keyboard Malfunction
                </option>
              </select>
            </div>

            <div className="form-group-block">
              <label htmlFor="serial">
                Serial Number (Optional)
              </label>

              <input
                type="text"
                id="serial"
                name="serial"
                className="input-soft-blue"
                placeholder="Enter Serial Number"
                value={formData.serial}
                onChange={handleChange}
              />
            </div>

            <div className="form-group-block">
              <label htmlFor="issue">
                Write Issue
              </label>

              <textarea
                id="issue"
                name="issue"
                rows="3"
                className="input-soft-blue"
                placeholder="Describe the issue..."
                value={formData.issue}
                onChange={handleChange}
              />
            </div>

            <button
              type="button"
              className="btn-gradient-submit"
              onClick={nextStep}
            >
              NEXT &rarr;
            </button>
          </div>
        )}

        {/* ======================================
            STEP 2: PERSONAL INFORMATION
        ====================================== */}
        {currentStep === 2 && (
          <div className="step-content">
            <div className="step-header-bar">
              STEP 2: PERSONAL INFORMATION
            </div>

            <div className="form-group-block">
              <label>Name</label>

              <input
                type="text"
                name="name"
                className="input-soft-blue"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group-block">
              <label>Email</label>

              <input
                type="email"
                name="email"
                className="input-soft-blue"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group-block">
              <label>Mobile</label>

              <input
                type="tel"
                name="mobile"
                className="input-soft-blue"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>

            <div className="action-button-group">
              <button
                type="button"
                className="btn-gradient-submit"
                onClick={prevStep}
              >
                &larr; PREV
              </button>

              <button
                type="button"
                className="btn-gradient-submit"
                onClick={nextStep}
              >
                NEXT &rarr;
              </button>
            </div>
          </div>
        )}

        {/* ======================================
            STEP 3: SERVICE DETAILS
        ====================================== */}
        {currentStep === 3 && (
          <div className="step-content">
            <div className="step-header-bar">
              STEP 3: SERVICE DETAILS
            </div>

            {/* UPDATED CHENNAI BRANCHES */}
            <div className="form-group-block">
              <label>Select Service Center</label>

              <div className="options-row center-options">
                {centers.map((center) => (
                  <label
                    key={center}
                    className={`custom-radio-card ${
                      selectedCenter === center
                        ? "selected"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceCenter"
                      value={center}
                      checked={selectedCenter === center}
                      onChange={() =>
                        setSelectedCenter(center)
                      }
                    />

                    <span className="radio-circle"></span>
                    {center}
                  </label>
                ))}
              </div>
            </div>

            {/* UPDATED SERVICE TYPES */}
            <div className="form-group-block">
              <label>Select Service Type</label>

              <div className="options-row type-options">
                <label
                  className={`custom-radio-card wide ${
                    serviceType === "visit"
                      ? "selected dark"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="serviceType"
                    value="visit"
                    checked={serviceType === "visit"}
                    onChange={() =>
                      handleServiceTypeChange("visit")
                    }
                  />

                  <span className="radio-circle"></span>
                  Visit Service Center
                </label>

                <label
                  className={`custom-radio-card wide ${
                    serviceType === "pickup"
                      ? "selected dark"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="serviceType"
                    value="pickup"
                    checked={serviceType === "pickup"}
                    onChange={() =>
                      handleServiceTypeChange("pickup")
                    }
                  />

                  <span className="radio-circle"></span>
                  Pickup & Drop (Free across Chennai)
                </label>
              </div>
            </div>

            {serviceType && (
              <div className="service-details-card">
                {/* PICKUP & DROP CHARGES */}
                {serviceType === "pickup" && (
                  <div className="charges-table-container">
                    <p
                      style={{
                        color: "#15803d",
                        fontWeight: "700",
                        marginBottom: "12px",
                      }}
                    >
                      ✓ Free Pickup & Drop across Chennai
                    </p>

                    <table className="charges-table">
                      <thead>
                        <tr>
                          <th>SERVICE</th>
                          <th>CHARGES (₹)</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td>Pickup & Drop Charges</td>
                          <td
                            style={{
                              color: "#15803d",
                              fontWeight: "700",
                            }}
                          >
                            FREE
                          </td>
                        </tr>

                        <tr>
                          <td>Diagnostic Charges</td>
                          <td>
                            ₹{" "}
                            {DIAGNOSTIC_CHARGE.toLocaleString(
                              "en-IN"
                            )}
                            .00
                          </td>
                        </tr>

                        <tr className="total-row">
                          <td>TOTAL CHARGES</td>
                          <td>
                            ₹{" "}
                            {(
                              PICKUP_DROP_CHARGE +
                              DIAGNOSTIC_CHARGE
                            ).toLocaleString("en-IN")}
                            .00
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* BOOKING DATE */}
                <div className="form-group-block">
                  <label>Select Booking Date</label>

                  <input
                    type="date"
                    name="date"
                    className="input-soft-blue"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>

                {/* TIME SLOTS */}
                <div className="form-group-block">
                  <label>Select Time Slot</label>

                  <div className="slots-grid">
                    {(
                      serviceType === "visit"
                        ? visitTimeSlots
                        : pickupTimeSlots
                    ).map((slot) => (
                      <label
                        key={slot}
                        className={`custom-radio-card slot-card ${
                          selectedTimeSlot === slot
                            ? "selected"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="timeSlot"
                          value={slot}
                          checked={
                            selectedTimeSlot === slot
                          }
                          onChange={() =>
                            setSelectedTimeSlot(slot)
                          }
                        />

                        <span className="radio-circle"></span>
                        {slot}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="action-button-group">
              <button
                type="button"
                className="btn-gradient-submit"
                onClick={prevStep}
              >
                &larr; PREV
              </button>

              <button
                type="button"
                className="btn-dark-submit"
                onClick={handleSubmit}
              >
                {serviceType === "pickup"
                  ? "PAY NOW"
                  : "SUBMIT"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;