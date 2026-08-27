
// import React, { useState, useEffect } from 'react';
// import './Repair.css';
// import repairImage from "../../assets/images/hero-repair.jpg";

// // Component Imports
// // import Topbar from '../../components/TopBar/TopBar';
// // import Header from '../../components/Header/Header';
// import Footer from '../../components/Footer/Footer';

// export default function Repair() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
  
//   // Form State
//   const [formData, setFormData] = useState({
//     fullName: '',
//     phone: '',
//     email: '',
//     brand: '',
//     model: '',
//     issue: '',
//     description: '',
//     serviceType: 'Pickup & Repair'
//   });

//   // Scroll lock when modal drawer is active
//   useEffect(() => {
//     if (isModalOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isModalOpen]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleServiceTypeSelect = (type) => {
//     setFormData((prev) => ({ ...prev, serviceType: type }));
//   };

//   const handleOpenModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setTimeout(() => {
//       setIsSubmitted(false);
//     }, 350);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsSubmitted(true);
//   };

//   return (
//     <div className="repair-page-wrapper">
//       {/* 1. TOPBAR AT THE VERY TOP */}
//       {/* <Topbar /> */}

//       {/* 2. HEADER DIRECTLY BELOW TOPBAR */}
//       {/* <Header /> */}

//       {/* 3. MAIN REPAIR PAGE CONTENT */}
//       <div className="repair-page">
//         {/* 1. DARK HERO SECTION WITH DIRECT TECHNICIAN REPAIR BACKGROUND */}
//         <section className="repair-hero">
//           <div className="repair-container hero-container">
//             <div className="repair-hero-content">
//               <div className="repair-eyebrow">
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
//                 </svg>
//                 PROFESSIONAL LAPTOP REPAIR
//               </div>

//               <h1 className="repair-hero-title">
//                 We Fix Laptops.<br />
//                 <span className="text-blue">You Stay Productive.</span>
//               </h1>

//               <p className="repair-hero-description">
//                 Fast, reliable and affordable laptop repair services by expert technicians.
//               </p>

//               {/* CTA Group with Helper Arrow */}
//               <div className="repair-cta-group">
//                 <button className="repair-cta-btn" onClick={handleOpenModal}>
//                   BOOK A REPAIR →
//                 </button>

//                 <div className="cta-helper-wrapper">
//                   <svg className="cta-arrow-svg" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//                     <path d="M 10 35 Q 25 10 40 25" />
//                     <path d="M 32 26 L 40 25 L 38 17" />
//                   </svg>
//                   <span className="cta-helper-text">
//                     Click here to<br />book a repair
//                   </span>
//                 </div>
//               </div>

//               {/* Hero Trust Points */}
//               <div className="hero-trust-bar">
//                 <div className="hero-trust-item">
//                   <span className="hero-trust-icon">✓</span> Genuine Parts
//                 </div>
//                 <div className="hero-trust-item">
//                   <span className="hero-trust-icon">✓</span> 90 Days Warranty
//                 </div>
//                 <div className="hero-trust-item">
//                   <span className="hero-trust-icon">◷</span> Quick Turnaround
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* 2. STATISTICS SECTION */}
//         <section className="repair-stats-section">
//           <div className="repair-container">
//             <div className="repair-stats-card">
//               <div className="stat-item">
//                 <div className="stat-number">15K<span>+</span></div>
//                 <div className="stat-label">Happy Customers</div>
//               </div>
//               <div className="stat-item">
//                 <div className="stat-number">10K<span>+</span></div>
//                 <div className="stat-label">Laptops Repaired</div>
//               </div>
//               <div className="stat-item">
//                 <div className="stat-number">4.8</div>
//                 <div className="stat-label">Google Rating</div>
//               </div>
//               <div className="stat-item">
//                 <div className="stat-number">15<span>+</span></div>
//                 <div className="stat-label">Years of Service</div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* 3. WHAT WE FIX SECTION */}
//         <section className="repair-services-section">
//           <div className="repair-container services-container">
//             <div className="section-header">
//               <div className="repair-eyebrow eyebrow-light">OUR REPAIR SERVICES</div>
//               <h2 className="section-title">What We Fix</h2>
//             </div>

//             <div className="repair-services-grid">
//               {/* Card 1 */}
//               <div className="repair-card">
//                 <div className="repair-card-icon">
//                   <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
//                     <line x1="8" y1="21" x2="16" y2="21"></line>
//                     <line x1="12" y1="17" x2="12" y2="21"></line>
//                   </svg>
//                 </div>
//                 <h3 className="repair-card-title">Screen Replacement</h3>
//                 <p className="repair-card-desc">Cracked or broken screen? We'll replace it quickly.</p>
//               </div>

//               {/* Card 2 */}
//               <div className="repair-card">
//                 <div className="repair-card-icon">
//                   <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect>
//                     <line x1="23" y1="10" x2="23" y2="14"></line>
//                     <polyline points="11 9 8 12 11 15"></polyline>
//                   </svg>
//                 </div>
//                 <h3 className="repair-card-title">Battery Replacement</h3>
//                 <p className="repair-card-desc">Get longer backup with genuine batteries.</p>
//               </div>

//               {/* Card 3 */}
//               <div className="repair-card">
//                 <div className="repair-card-icon">
//                   <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
//                     <line x1="6" y1="8" x2="6.01" y2="8"></line>
//                     <line x1="10" y1="8" x2="10.01" y2="8"></line>
//                     <line x1="14" y1="8" x2="14.01" y2="8"></line>
//                     <line x1="18" y1="8" x2="18.01" y2="8"></line>
//                     <line x1="6" y1="12" x2="6.01" y2="12"></line>
//                     <line x1="18" y1="12" x2="18.01" y2="12"></line>
//                     <line x1="8" y1="16" x2="16" y2="16"></line>
//                   </svg>
//                 </div>
//                 <h3 className="repair-card-title">Keyboard Repair</h3>
//                 <p className="repair-card-desc">Keys not working? We've got it covered.</p>
//               </div>

//               {/* Card 4 */}
//               <div className="repair-card">
//                 <div className="repair-card-icon">
//                   <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
//                   </svg>
//                 </div>
//                 <h3 className="repair-card-title">Overheating Issues</h3>
//                 <p className="repair-card-desc">Laptop overheating? We'll keep it cool.</p>
//               </div>

//               {/* Card 5 */}
//               <div className="repair-card">
//                 <div className="repair-card-icon">
//                   <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <polyline points="16 18 22 12 16 6"></polyline>
//                     <polyline points="8 6 2 12 8 18"></polyline>
//                   </svg>
//                 </div>
//                 <h3 className="repair-card-title">Software Problems</h3>
//                 <p className="repair-card-desc">From slow performance to OS issues, we fix all.</p>
//               </div>

//               {/* Card 6 */}
//               <div className="repair-card">
//                 <div className="repair-card-icon">
//                   <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
//                     <rect x="9" y="9" width="6" height="6"></rect>
//                     <line x1="9" y1="1" x2="9" y2="4"></line>
//                     <line x1="15" y1="1" x2="15" y2="4"></line>
//                     <line x1="9" y1="20" x2="9" y2="23"></line>
//                     <line x1="15" y1="20" x2="15" y2="23"></line>
//                     <line x1="20" y1="9" x2="23" y2="9"></line>
//                     <line x1="20" y1="15" x2="23" y2="15"></line>
//                     <line x1="1" y1="9" x2="4" y2="9"></line>
//                     <line x1="1" y1="15" x2="4" y2="15"></line>
//                   </svg>
//                 </div>
//                 <h3 className="repair-card-title">Hardware Repair</h3>
//                 <p className="repair-card-desc">Motherboard, RAM, SSD & more – we repair it all.</p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* 4. QUALITY / TRUST SECTION */}
//         <section className="repair-trust-section">
//           <div className="repair-container trust-container">
//             <div className="trust-box-container">
//               <div className="trust-grid">
//                 {/* Left Side Visual */}
//                 <div className="trust-left-visual">
//                   <div className="trust-img-wrapper">
//                     <img 
//                       src={repairImage}
//                       alt="Technician Repairing Laptop Motherboard" 
//                     />
//                     <div className="trust-badge-overlay">
//                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
//                       </svg>
//                       <span>100% Genuine Quality Guaranteed</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Side Trust Content */}
//                 <div className="trust-content-right">
//                   <div className="repair-eyebrow eyebrow-trust">QUALITY REPAIR YOU CAN TRUST</div>
//                   <h2 className="trust-title">Expert Care for Your Laptop</h2>

//                   <div className="trust-points-grid">
//                     <div className="trust-point-card">
//                       <div className="trust-point-icon">
//                         <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
//                           <circle cx="12" cy="7" r="4"></circle>
//                         </svg>
//                       </div>
//                       <div>
//                         <h4 className="trust-point-title">Expert & Certified Technicians</h4>
//                         <p className="trust-point-desc">Highly skilled professionals you can trust.</p>
//                       </div>
//                     </div>

//                     <div className="trust-point-card">
//                       <div className="trust-point-icon">
//                         <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
//                         </svg>
//                       </div>
//                       <div>
//                         <h4 className="trust-point-title">Genuine Parts & Tools</h4>
//                         <p className="trust-point-desc">We use 100% original parts for every repair.</p>
//                       </div>
//                     </div>

//                     <div className="trust-point-card">
//                       <div className="trust-point-icon">
//                         <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <circle cx="12" cy="12" r="10"></circle>
//                           <polyline points="12 6 12 12 16 14"></polyline>
//                         </svg>
//                       </div>
//                       <div>
//                         <h4 className="trust-point-title">90 Days Service Warranty</h4>
//                         <p className="trust-point-desc">We stand by our work with warranty.</p>
//                       </div>
//                     </div>

//                     <div className="trust-point-card">
//                       <div className="trust-point-icon">
//                         <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <line x1="12" y1="1" x2="12" y2="23"></line>
//                           <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
//                         </svg>
//                       </div>
//                       <div>
//                         <h4 className="trust-point-title">Transparent Pricing</h4>
//                         <p className="trust-point-desc">No hidden charges. What we quote, you pay.</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* 5. BOOK A REPAIR MODAL / RIGHT-SIDE SLIDE-IN PANEL */}
//         <div 
//           className={`repair-modal-overlay ${isModalOpen ? 'active' : ''}`}
//           onClick={handleCloseModal}
//         >
//           <div 
//             className="repair-modal-drawer"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="modal-header">
//               <div className="modal-header-title-box">
//                 <div className="modal-header-icon">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="modal-title">Book a Repair</h3>
//                   <p className="modal-subtitle">Fill in the details below and our team will contact you shortly.</p>
//                 </div>
//               </div>

//               <button 
//                 className="modal-close-btn"
//                 onClick={handleCloseModal}
//                 aria-label="Close form"
//               >
//                 ×
//               </button>
//             </div>

//             {/* Modal Body / Form */}
//             <div className="modal-body">
//               {isSubmitted ? (
//                 <div className="modal-success-box">
//                   <div className="success-icon-badge">
//                     <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
//                       <polyline points="20 6 9 17 4 12"></polyline>
//                     </svg>
//                   </div>
//                   <h4 className="success-title">Repair request submitted successfully!</h4>
//                   <p className="success-desc">
//                     Thank you for booking with us. Our technical support expert will call you shortly to confirm your service details.
//                   </p>
//                   <button 
//                     className="repair-cta-btn btn-full" 
//                     onClick={handleCloseModal}
//                   >
//                     Close Panel
//                   </button>
//                 </div>
//               ) : (
//                 <form className="repair-form" onSubmit={handleSubmit}>
//                   {/* Customer Name */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Customer Name <span className="required">*</span>
//                     </label>
//                     <input 
//                       type="text"
//                       name="fullName"
//                       required
//                       placeholder="Enter your full name"
//                       className="form-input"
//                       value={formData.fullName}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   {/* Phone Number */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Phone Number <span className="required">*</span>
//                     </label>
//                     <input 
//                       type="tel"
//                       name="phone"
//                       required
//                       placeholder="Enter your phone number"
//                       className="form-input"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   {/* Email Address */}
//                   <div className="form-group">
//                     <label className="form-label">Email Address</label>
//                     <input 
//                       type="email"
//                       name="email"
//                       placeholder="Enter your email address"
//                       className="form-input"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   {/* Laptop Brand */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Laptop Brand <span className="required">*</span>
//                     </label>
//                     <select 
//                       name="brand"
//                       required
//                       className="form-select"
//                       value={formData.brand}
//                       onChange={handleInputChange}
//                     >
//                       <option value="" disabled>Select brand</option>
//                       <option value="Dell">Dell</option>
//                       <option value="HP">HP</option>
//                       <option value="Lenovo">Lenovo</option>
//                       <option value="ASUS">ASUS</option>
//                       <option value="Acer">Acer</option>
//                       <option value="Apple">Apple</option>
//                       <option value="MSI">MSI</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>

//                   {/* Laptop Model */}
//                   <div className="form-group">
//                     <label className="form-label">Laptop Model</label>
//                     <input 
//                       type="text"
//                       name="model"
//                       placeholder="Enter laptop model"
//                       className="form-input"
//                       value={formData.model}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   {/* Issue Selection */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       What is the issue? <span className="required">*</span>
//                     </label>
//                     <select 
//                       name="issue"
//                       required
//                       className="form-select"
//                       value={formData.issue}
//                       onChange={handleInputChange}
//                     >
//                       <option value="" disabled>Select issue</option>
//                       <option value="Screen Problem">Screen Problem</option>
//                       <option value="Battery Problem">Battery Problem</option>
//                       <option value="Keyboard Problem">Keyboard Problem</option>
//                       <option value="Laptop Not Turning On">Laptop Not Turning On</option>
//                       <option value="Overheating">Overheating</option>
//                       <option value="Slow Performance">Slow Performance</option>
//                       <option value="Software Problem">Software Problem</option>
//                       <option value="Charging Problem">Charging Problem</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>

//                   {/* Description */}
//                   <div className="form-group">
//                     <label className="form-label">Describe the Issue</label>
//                     <textarea 
//                       name="description"
//                       placeholder="Briefly describe the problem"
//                       className="form-textarea"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   {/* Preferred Service Type */}
//                   <div className="form-group">
//                     <label className="form-label">
//                       Preferred Service Type <span className="required">*</span>
//                     </label>
//                     <div className="service-type-grid">
//                       <div 
//                         className={`service-card ${formData.serviceType === 'Pickup & Repair' ? 'selected' : ''}`}
//                         onClick={() => handleServiceTypeSelect('Pickup & Repair')}
//                       >
//                         <div className="service-card-title">
//                           Pickup & Repair
//                           {formData.serviceType === 'Pickup & Repair' && (
//                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
//                               <polyline points="20 6 9 17 4 12"></polyline>
//                             </svg>
//                           )}
//                         </div>
//                         <div className="service-card-desc">We'll pick up & deliver</div>
//                       </div>

//                       <div 
//                         className={`service-card ${formData.serviceType === 'Drop at Store' ? 'selected' : ''}`}
//                         onClick={() => handleServiceTypeSelect('Drop at Store')}
//                       >
//                         <div className="service-card-title">
//                           Drop at Store
//                           {formData.serviceType === 'Drop at Store' && (
//                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
//                               <polyline points="20 6 9 17 4 12"></polyline>
//                             </svg>
//                           )}
//                         </div>
//                         <div className="service-card-desc">I'll drop off at your store</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Submit Button */}
//                   <button type="submit" className="form-submit-btn">
//                     ✈ SUBMIT REQUEST
//                   </button>

//                   {/* Privacy note */}
//                   <div className="form-trust-footer">
//                     🔒 Your information is safe with us.
//                   </div>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 4. FOOTER AT THE VERY BOTTOM */}
//       <Footer />
//     </div>
//   );
// }

import React, { useState } from 'react';
import BookAppointment from './BookAppointment';
import './Repair.css';
// import Footer from "../../components/Footer/Footer";

/* =========================================================
   DATA
   ========================================================= */

const repairServices = [
  { title: "Screen Replacement", price: "₹4,499", duration: "24 hours" },
  { title: "Battery Replacement", price: "₹2,999", duration: "3 hours" },
  { title: "Keyboard Replacement", price: "₹1,999", duration: "6 hours" },
  { title: "SSD / RAM Upgrade", price: "₹1,499", duration: "2 hours" },
  { title: "Hinge Repair", price: "₹1,799", duration: "24 hours" },
  { title: "Motherboard Repair", price: "₹4,999", duration: "48–72 hours" },
  { title: "Liquid Damage Repair", price: "₹2,999", duration: "48 hours" },
  { title: "OS / Software Fix", price: "₹799", duration: "Same day" },
  { title: "Fan & Overheating", price: "₹1,299", duration: "4 hours" },
  { title: "Charging Port Repair", price: "₹1,499", duration: "4 hours" }
];

const brands = [
  { name: 'Apple MacBook', logo: 'https://cdn.simpleicons.org/apple/000000', href: '/repair-laptop-online/', isLive: true },
  { name: 'Dell', logo: 'https://cdn.simpleicons.org/dell/0076CE', isLive: false },
  { name: 'HP', logo: 'https://cdn.simpleicons.org/hp/0096D6', isLive: false },
  { name: 'Lenovo', logo: 'https://cdn.simpleicons.org/lenovo/E2231A', isLive: false },
  { name: 'ASUS', logo: 'https://cdn.simpleicons.org/asus/00539B', isLive: false },
  { name: 'Acer', logo: 'https://cdn.simpleicons.org/acer/83B81A', isLive: false },
  { name: 'MSI', logo: 'https://cdn.simpleicons.org/msi/FF0000', isLive: false },
  { name: 'Microsoft Surface', logo: 'https://cdn.simpleicons.org/microsoft/5E5E5E', isLive: false }
];

const features = [
  {
    color: 'blue',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      />
    ),
    title: 'Experienced Expert Technicians',
    description:
      'Brand-experienced engineers with 5+ years of experience repairing laptops, desktops, all-in-ones and Apple Macs. Ongoing training for new models.',
  },
  {
    color: 'purple',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    ),
    title: 'Genuine OEM Parts',
    description:
      'OEM-grade or certified parts used in every repair. Parts sourced from authorized distributors. Never substandard components.',
  },
  {
    color: 'green',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
    title: '90-Day Industry Warranty',
    description:
      "Chennai's best warranty — 90 days on all parts and labour. If the same issue recurs within 90 days, we fix it completely free.",
  },
  {
    color: 'yellow',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
    title: 'Same-Day Repair Service',
    description:
      'Most repairs completed within 2–4 hours. Screen replacements and battery changes often done in under 1 hour. We respect your time.',
  },
  {
    color: 'blue',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
      />
    ),
    title: 'Free Pickup & Drop',
    description:
      'Free pickup & drop across all Chennai, Thane and Palghar. Available all 7 days, 9 AM to 9 PM.',
  },
  {
    color: 'green',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    title: 'Transparent, Honest Pricing',
    description:
      '₹350 inspection fee — refunded if you proceed with repair. Exact fixed price before work starts. No hidden charges, no surprises.',
  },
];

const steps = [
  {
    number: 1,
    emoji: '📞',
    hasFreeTag: true,
    title: 'Get In Touch with Our Chennai Team',
    description:
      "Call, WhatsApp, or fill out our online form. Share your product type (laptop, desktop, all-in-one PC, printer) and the issue you're experiencing. We respond within minutes with repair availability.",
  },
  {
    number: 2,
    emoji: '🚗',
    hasFreeTag: false,
    title: 'Doorstep Service or Free Pickup',
    description:
      'For part replacements (battery, keyboard, screen, SSD, RAM), our technician visits your Chennai doorstep. For chip-level and body repairs, free pickup and drop from your Chennai address. Safe handling and padded transport guaranteed.',
  },
  {
    number: 3,
    emoji: '📋',
    hasFreeTag: false,
    title: 'Transparent Diagnosis & Quote',
    description:
      'Our certified engineer diagnoses your laptop or computer at our lab. ₹350 inspection fee applies (fully refunded if you proceed with the repair). You receive a clear, itemised written quote before any repair work begins. No surprises, no hidden fees. Our 4.9★ rating across 44,883+ reviews reflects our commitment to thorough quality assurance.',
  },
  {
    number: 4,
    emoji: '🔧',
    hasFreeTag: false,
    title: 'Professional Repair with Genuine Parts',
    description: (
      <>
        Using OEM-grade components and manufacturer-approved techniques, our
        technicians repair your laptop or computer to factory-level quality. Most
        common repairs are completed the <strong>same day</strong>.
      </>
    ),
  },
  {
    number: 5,
    emoji: '🎯',
    hasFreeTag: false,
    title: 'Free Delivery + 90-Day Warranty',
    description: (
      <>
        Your repaired laptop or computer is delivered back to your Chennai doorstep
        at zero cost. Every repair includes a{' '}
        <strong>90-day written warranty</strong> covering parts and labour.
      </>
    ),
  },
];

const faqData = [
  {
    id: 0,
    question: 'Does Zaid Infotech offer a warranty on laptop and computer repairs?',
    answer:
      'Yes — every repair at Zaid Infotech carries a 90-day warranty on the repaired component and all parts used. If the same problem returns within 90 days, we rectify it at no additional cost. Warranty is valid across Mumbai MMR.',
  },
  {
    id: 1,
    question: 'Does Zaid Infotech offer free doorstep pickup for repairs?',
    answer:
      'Absolutely. Zaid Infotech provides completely free doorstep pickup and delivery across Mumbai, Thane, Vasai-Virar, and Palghar. A technician comes to you, collects your laptop or computer, repairs it, and delivers it back — no travel required.',
  },
  {
    id: 2,
    question: 'What areas does Zaid Infotech serve?',
    answer:
      'Zaid Infotech serves 50+ locations across Chennai including Andheri, Bandra, and more. Check our Locations page for the full list.',
  },
  {
    id: 3,
    question: 'What payment methods does Zaid Infotech accept?',
    answer:
      'Zaid Infotech accepts all major payment options: UPI (Google Pay, PhonePe, Paytm), debit/credit cards, net banking, and cash. Payment is collected only after the repair is complete and you are satisfied — we never charge upfront without your agreement.',
  },
  {
    id: 4,
    question: 'How experienced are Zaid Infotech technicians?',
    answer:
      'Our technicians are certified professionals with 3–15 years of hands-on experience in laptop, computer, and MacBook repair. They undergo regular training on new laptop and computer models and repair techniques, ensuring consistent, high-quality results for every customer.',
  },
  {
    id: 5,
    question: 'Can Zaid Infotech repair all laptop and computer brands?',
    answer:
      'Yes! Zaid Infotech repairs laptops and computers from all major brands — Apple (MacBook, iMac), Dell, HP, Lenovo, Asus, Acer, MSI, Microsoft Surface, Samsung, Toshiba, Sony, and 30+ more. No brand or model is too complex for our experienced team.',
  },
  {
    id: 6,
    question: 'Is my data safe when I send my laptop or computer for repair?',
    answer:
      'Data security is our top priority. Our technicians strictly follow protocols that ensure your personal files are never accessed or modified. We inform you before any procedure that carries a risk of data loss and always recommend a backup beforehand. Your privacy is fully protected.',
  },
  {
    id: 7,
    question: 'How do I contact Zaid Infotech for laptop or computer repair?',
    answer:
      'You can reach Zaid Infotech via WhatsApp or call on +91 74997 61196 (9 AM–9 PM, 7 days a week), or email info@xigox.com. WhatsApp is the fastest channel — share a photo of your laptop or computer issue and get an instant quote.',
    hasContactLinks: true,
  },
];

/* =========================================================
   ICONS (renamed where names clashed across components)
   ========================================================= */

const WrenchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="card-icon"
    aria-hidden="true"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"></path>
  </svg>
);

// was BadgeIcon in LaptopRepairs.jsx
const RepairsBadgeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 10v6m11-7h-6M7 12H1m17.36-6.36-4.24 4.24m-8.24 0L1.64 5.64m14.72 12.72-4.24-4.24m-8.24 0-4.24 4.24"></path>
  </svg>
);

// was BadgeIcon in LaptopBrands.jsx
const BrandsBadgeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="4" width="20" height="14" rx="2"></rect>
    <path d="M8 21h8M12 18v3"></path>
  </svg>
);

// was BadgeIcon in ChooseUs.jsx
const ChooseUsBadgeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 2l2.4 7.4H22l-6.2 4.5L18.2 21 12 16.5 5.8 21l2.4-7.1L2 9.4h7.6z" />
  </svg>
);

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

const Repair = () => {
  // Hero "Book Now" modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // FAQ accordion state
  const [openIndex, setOpenIndex] = useState(0);
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="repair-page">
      {/* ============================================================
          SECTION 1: Hero
          ============================================================ */}
      <section className="repair-hero-section">
        <div className="repair-hero-container">
          <div className="hero-left-content">
            <div className="trust-badge">
              <span className="badge-icon">⚙</span>
              <span>Chennai's Most Trusted Repair Center</span>
             
            </div>

            <h1 className="hero-main-title">
              Professional Laptop &<br />
              Computer Repair<br />
              <span className="text-highlight">Services</span> in Chennai
            </h1>

            <p className="hero-description">
              Expert technicians, genuine OEM parts, and a 90-day warranty on every repair. Covering Chennai with free pickup & drop.
            </p>

            <div className="cta-button-group">
              <button className="btn-quote" onClick={handleOpenModal}>
                Book Now
              </button>
              <button className="btn-whatsapp">
                <span>💬</span> WhatsApp
              </button>
            </div>

            <div className="review-stats-bar">
              <div className="rating-box">
                <span className="star-icon">☆</span>
                <span className="rating-score">4.9/5 Rating</span>
              </div>
              <span className="dot-separator">•</span>
              <span>44,883+ Reviews</span>
              <span className="dot-separator">•</span>
              <span>Since 2011</span>
            </div>
          </div>

          <div className="hero-stats-grid">
            <div className="stat-card">
              <div className="stat-icon">⚙</div>
              <div className="stat-value">1,568+</div>
              <div className="stat-label">Repair Services</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚙</div>
              <div className="stat-value">1,00,000+</div>
              <div className="stat-label">Laptops Fixed</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-value">Same Day</div>
              <div className="stat-label">Fast Turnaround</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🛡</div>
              <div className="stat-value">90 Days</div>
              <div className="stat-label">Warranty</div>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <BookAppointment onClose={handleCloseModal} />
            </div>
          </div>
        )}
      </section>

      {/* ============================================================
          SECTION 2: Laptop Repairs
          ============================================================ */}
      <section className="laptop-repairs-container">
        <div className="repairs-inner">
          <div className="repairs-badge">
            <RepairsBadgeIcon />
            <span>Our Services</span>
          </div>

          <h2 className="repairs-heading">Laptop repairs we do</h2>
          <p className="repairs-subtitle">
            Board-level expertise. Genuine-grade parts. 6-month warranty on every repair.
          </p>

          <div className="repairs-grid">
            {repairServices.map((service, index) => (
              <div key={index} className="repair-card">
                <div className="card-icon-badge">
                  <WrenchIcon />
                </div>
                <p className="card-title">{service.title}</p>
                <p className="card-meta">
                  From {service.price} · {service.duration}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: Laptop Brands
          ============================================================ */}
      <section className="laptop-brands-section">
        <div className="brands-inner">
          <div className="brands-badge">
            <BrandsBadgeIcon />
            <span>Brands We Support</span>
          </div>

          <h2 className="brands-title">Laptop brands we repair</h2>
          <p className="brands-subtitle">
            MacBook repair is live now. Dell, HP, Lenovo and more are coming soon.
          </p>

          <div className="brands-grid">
            {brands.map((brand, idx) =>
              brand.isLive ? (
                <a key={idx} href={brand.href} className="brand-card brand-card-active">
                  <div className="brand-logo-badge brand-logo-badge-live">
                    <img
                      src={brand.logo}
                      alt={`Repair ${brand.name}`}
                      loading="lazy"
                      className="brand-img"
                    />
                  </div>
                  <div className="brand-details">
                    <span className="brand-name">{brand.name}</span>
                    <span className="brand-badge brand-badge-live">Available now</span>
                  </div>
                </a>
              ) : (
                <div key={idx} className="brand-card brand-card-disabled" aria-disabled="true">
                  <div className="brand-logo-badge">
                    <img
                      src={brand.logo}
                      alt={`Repair ${brand.name}`}
                      loading="lazy"
                      className="brand-img"
                    />
                  </div>
                  <div className="brand-details">
                    <span className="brand-name">{brand.name}</span>
                    <span className="brand-badge">Coming soon</span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: Choose Us
          ============================================================ */}
      <section className="choose-us-section">
        <div className="choose-us-inner">
          <div className="choose-us-header">
            <div className="choose-us-badge">
              <ChooseUsBadgeIcon />
              <span>Why Choose Us</span>
            </div>
            <h2 className="choose-us-title">
              Why Thousands Choose Zaid Infotech for Laptop &amp; Computer Repair
            </h2>
            <p className="choose-us-subtitle">
              Every advantage that makes Zaid Infotech Chennai's highest-rated repair center
            </p>
          </div>

          <div className="choose-us-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg
                    className="feature-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: Process
          ============================================================ */}
      <section className="process-section" id="how-it-works">
        <div className="process-container">
          <div className="process-header">
            <span className="process-badge">⚙️ Our Process</span>
            <h2 className="process-title">
              How Our Laptop, Computer &amp; MacBook Repair Process Works in Chennai
            </h2>
            <p className="process-subtitle">
              From your Chennai doorstep to our certified repair lab and back — completely
              hassle-free. Here's our proven process.
            </p>
          </div>

          <div className="process-timeline">
            <div className="process-timeline-line" aria-hidden="true"></div>

            <div className="process-steps-list">
              {steps.map((step) => (
                <div key={step.number} className="process-step-item">
                  <div className="process-step-icon-wrapper">
                    <div className="process-step-icon">
                      <span className="process-step-emoji" aria-hidden="true">
                        {step.emoji}
                      </span>
                    </div>
                    <span className="process-step-number">{step.number}</span>
                  </div>

                  <div className="process-step-card">
                    <div className="process-card-header">
                      <span className="process-step-label">Step {step.number}</span>
                      <span className="sr-only">
                        Step {step.number}: {step.title}
                      </span>
                      {step.hasFreeTag && (
                        <span className="process-free-tag">FREE</span>
                      )}
                    </div>
                    <h3 className="process-card-title">{step.title}</h3>
                    <p className="process-card-text">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="process-cta-box">
            <div className="process-cta-content">
              <div className="process-cta-icon-circle">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="process-cta-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  ></path>
                </svg>
              </div>
              <p className="process-cta-text">
                Rated 4.9★ by 44,883+ customers in Chennai.{' '}
                <strong>Free pickup, OEM parts, 90-day warranty</strong> — book your
                repair now.
              </p>
              <div className="process-cta-actions">
                <a href="tel:+917499761196" className="process-btn process-btn-phone">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    style={{ width: '1.25rem', height: '1.25rem' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    ></path>
                  </svg>
                  Call Now for Pickup
                </a>
                <a
                  href="https://wa.me/917499761196?text=Hi%2C+I+need+Laptop+%26+Computer+Repair+in+Chennai"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="process-btn process-btn-whatsapp"
                >
                  <svg
                    aria-hidden="true"
                    style={{ width: '1.25rem', height: '1.25rem' }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                  </svg>
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 6: FAQs
          ============================================================ */}
      <section className="faq-section" id="faq" aria-label="Frequently Asked Questions">
        <div className="faq-container">
          <div className="faq-header">
            <div className="faq-badge">
              <svg
                aria-hidden="true"
                style={{ width: '1rem', height: '1rem' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              FAQs
            </div>
            <h2 className="faq-title">Laptop and computer repair FAQs</h2>
            <p className="faq-subtitle">
              Everything you need to know about our repair services
            </p>
          </div>

          <div className="faq-status-bar">
            <span>8 questions answered</span>
            <span className="faq-status-verified">
              <svg
                aria-hidden="true"
                className="faq-status-icon"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Verified &amp; updated
            </span>
          </div>

          <div className="faq-list" role="list">
            {faqData.map((item, idx) => {
              const isOpen = openIndex === item.id;
              const itemNum = String(idx + 1).padStart(2, '0');

              return (
                <div
                  key={item.id}
                  className={`faq-item ${isOpen ? 'active' : ''}`}
                  role="listitem"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.id)}
                    className="faq-button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                  >
                    <span className="faq-number">{itemNum}</span>
                    <span className="faq-question">{item.question}</span>
                    <span className="faq-chevron-wrapper">
                      <svg
                        aria-hidden="true"
                        className="faq-chevron-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </span>
                  </button>

                  <div
                    id={`faq-answer-${item.id}`}
                    className={`faq-answer-wrapper ${isOpen ? 'open' : ''}`}
                    role="region"
                  >
                    <div className="faq-answer-inner">
                      <div className="faq-answer-content">
                        <div className="faq-answer-border">
                          <div className="faq-answer-text">{item.answer}</div>
                          {item.hasContactLinks && (
                            <div className="faq-action-buttons">
                              <a
                                href="https://wa.me/917499761196?text=Hi+Xigox%2C+I+have+a+question%3A+How+do+I+contact+Xigox+for+laptop+or+computer+repair%3F"
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                className="faq-btn-sub faq-btn-whatsapp-sub"
                              >
                                <svg
                                  aria-hidden="true"
                                  style={{ width: '0.875rem', height: '0.875rem' }}
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
                                </svg>
                                Ask on WhatsApp
                              </a>
                              <a
                                href="tel:+917499761196"
                                className="faq-btn-sub faq-btn-call-sub"
                              >
                                <svg
                                  aria-hidden="true"
                                  style={{ width: '0.875rem', height: '0.875rem' }}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  ></path>
                                </svg>
                                Call Now
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="faq-support-box">
            <div className="faq-support-header">
              <div className="faq-support-icon-circle">
                <svg
                  aria-hidden="true"
                  className="faq-support-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
              </div>
            </div>
            <h3 className="faq-support-heading">Still have questions?</h3>
            <p className="faq-support-text">
              Our team responds within 15 minutes on WhatsApp. Send us your question and
              get expert advice instantly.
            </p>
            <div className="faq-support-actions">
              <a
                href="https://wa.me/917499761196?text=Hi%20Xigox%2C%20I%20have%20a%20question"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="faq-btn-main faq-btn-whatsapp-main"
              >
                <svg
                  aria-hidden="true"
                  style={{ width: '1.25rem', height: '1.25rem' }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
                </svg>
                Ask on WhatsApp
              </a>
              <a href="tel:+917499761196" className="faq-btn-main faq-btn-call-main">
                <svg
                  aria-hidden="true"
                  style={{ width: '1rem', height: '1rem' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                Call +91 74997 61196
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default Repair;