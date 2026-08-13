
import React, { useState, useEffect } from 'react';
import './Repair.css';
import repairImage from "../../assets/images/hero-repair.jpg";

// Component Imports
import Topbar from '../../components/Topbar/Topbar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export default function Repair() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    brand: '',
    model: '',
    issue: '',
    description: '',
    serviceType: 'Pickup & Repair'
  });

  // Scroll lock when modal drawer is active
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceTypeSelect = (type) => {
    setFormData((prev) => ({ ...prev, serviceType: type }));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 350);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="repair-page-wrapper">
      {/* 1. TOPBAR AT THE VERY TOP */}
      <Topbar />

      {/* 2. HEADER DIRECTLY BELOW TOPBAR */}
      <Header />

      {/* 3. MAIN REPAIR PAGE CONTENT */}
      <div className="repair-page">
        {/* 1. DARK HERO SECTION WITH DIRECT TECHNICIAN REPAIR BACKGROUND */}
        <section className="repair-hero">
          <div className="repair-container hero-container">
            <div className="repair-hero-content">
              <div className="repair-eyebrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                PROFESSIONAL LAPTOP REPAIR
              </div>

              <h1 className="repair-hero-title">
                We Fix Laptops.<br />
                <span className="text-blue">You Stay Productive.</span>
              </h1>

              <p className="repair-hero-description">
                Fast, reliable and affordable laptop repair services by expert technicians.
              </p>

              {/* CTA Group with Helper Arrow */}
              <div className="repair-cta-group">
                <button className="repair-cta-btn" onClick={handleOpenModal}>
                  BOOK A REPAIR →
                </button>

                <div className="cta-helper-wrapper">
                  <svg className="cta-arrow-svg" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M 10 35 Q 25 10 40 25" />
                    <path d="M 32 26 L 40 25 L 38 17" />
                  </svg>
                  <span className="cta-helper-text">
                    Click here to<br />book a repair
                  </span>
                </div>
              </div>

              {/* Hero Trust Points */}
              <div className="hero-trust-bar">
                <div className="hero-trust-item">
                  <span className="hero-trust-icon">✓</span> Genuine Parts
                </div>
                <div className="hero-trust-item">
                  <span className="hero-trust-icon">✓</span> 90 Days Warranty
                </div>
                <div className="hero-trust-item">
                  <span className="hero-trust-icon">◷</span> Quick Turnaround
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. STATISTICS SECTION */}
        <section className="repair-stats-section">
          <div className="repair-container">
            <div className="repair-stats-card">
              <div className="stat-item">
                <div className="stat-number">15K<span>+</span></div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10K<span>+</span></div>
                <div className="stat-label">Laptops Repaired</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.8</div>
                <div className="stat-label">Google Rating</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">15<span>+</span></div>
                <div className="stat-label">Years of Service</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WHAT WE FIX SECTION */}
        <section className="repair-services-section">
          <div className="repair-container services-container">
            <div className="section-header">
              <div className="repair-eyebrow eyebrow-light">OUR REPAIR SERVICES</div>
              <h2 className="section-title">What We Fix</h2>
            </div>

            <div className="repair-services-grid">
              {/* Card 1 */}
              <div className="repair-card">
                <div className="repair-card-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <h3 className="repair-card-title">Screen Replacement</h3>
                <p className="repair-card-desc">Cracked or broken screen? We'll replace it quickly.</p>
              </div>

              {/* Card 2 */}
              <div className="repair-card">
                <div className="repair-card-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect>
                    <line x1="23" y1="10" x2="23" y2="14"></line>
                    <polyline points="11 9 8 12 11 15"></polyline>
                  </svg>
                </div>
                <h3 className="repair-card-title">Battery Replacement</h3>
                <p className="repair-card-desc">Get longer backup with genuine batteries.</p>
              </div>

              {/* Card 3 */}
              <div className="repair-card">
                <div className="repair-card-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                    <line x1="6" y1="8" x2="6.01" y2="8"></line>
                    <line x1="10" y1="8" x2="10.01" y2="8"></line>
                    <line x1="14" y1="8" x2="14.01" y2="8"></line>
                    <line x1="18" y1="8" x2="18.01" y2="8"></line>
                    <line x1="6" y1="12" x2="6.01" y2="12"></line>
                    <line x1="18" y1="12" x2="18.01" y2="12"></line>
                    <line x1="8" y1="16" x2="16" y2="16"></line>
                  </svg>
                </div>
                <h3 className="repair-card-title">Keyboard Repair</h3>
                <p className="repair-card-desc">Keys not working? We've got it covered.</p>
              </div>

              {/* Card 4 */}
              <div className="repair-card">
                <div className="repair-card-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
                  </svg>
                </div>
                <h3 className="repair-card-title">Overheating Issues</h3>
                <p className="repair-card-desc">Laptop overheating? We'll keep it cool.</p>
              </div>

              {/* Card 5 */}
              <div className="repair-card">
                <div className="repair-card-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                </div>
                <h3 className="repair-card-title">Software Problems</h3>
                <p className="repair-card-desc">From slow performance to OS issues, we fix all.</p>
              </div>

              {/* Card 6 */}
              <div className="repair-card">
                <div className="repair-card-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                    <rect x="9" y="9" width="6" height="6"></rect>
                    <line x1="9" y1="1" x2="9" y2="4"></line>
                    <line x1="15" y1="1" x2="15" y2="4"></line>
                    <line x1="9" y1="20" x2="9" y2="23"></line>
                    <line x1="15" y1="20" x2="15" y2="23"></line>
                    <line x1="20" y1="9" x2="23" y2="9"></line>
                    <line x1="20" y1="15" x2="23" y2="15"></line>
                    <line x1="1" y1="9" x2="4" y2="9"></line>
                    <line x1="1" y1="15" x2="4" y2="15"></line>
                  </svg>
                </div>
                <h3 className="repair-card-title">Hardware Repair</h3>
                <p className="repair-card-desc">Motherboard, RAM, SSD & more – we repair it all.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. QUALITY / TRUST SECTION */}
        <section className="repair-trust-section">
          <div className="repair-container trust-container">
            <div className="trust-box-container">
              <div className="trust-grid">
                {/* Left Side Visual */}
                <div className="trust-left-visual">
                  <div className="trust-img-wrapper">
                    <img 
                      src={repairImage}
                      alt="Technician Repairing Laptop Motherboard" 
                    />
                    <div className="trust-badge-overlay">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      <span>100% Genuine Quality Guaranteed</span>
                    </div>
                  </div>
                </div>

                {/* Right Side Trust Content */}
                <div className="trust-content-right">
                  <div className="repair-eyebrow eyebrow-trust">QUALITY REPAIR YOU CAN TRUST</div>
                  <h2 className="trust-title">Expert Care for Your Laptop</h2>

                  <div className="trust-points-grid">
                    <div className="trust-point-card">
                      <div className="trust-point-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <div>
                        <h4 className="trust-point-title">Expert & Certified Technicians</h4>
                        <p className="trust-point-desc">Highly skilled professionals you can trust.</p>
                      </div>
                    </div>

                    <div className="trust-point-card">
                      <div className="trust-point-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="trust-point-title">Genuine Parts & Tools</h4>
                        <p className="trust-point-desc">We use 100% original parts for every repair.</p>
                      </div>
                    </div>

                    <div className="trust-point-card">
                      <div className="trust-point-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </div>
                      <div>
                        <h4 className="trust-point-title">90 Days Service Warranty</h4>
                        <p className="trust-point-desc">We stand by our work with warranty.</p>
                      </div>
                    </div>

                    <div className="trust-point-card">
                      <div className="trust-point-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="trust-point-title">Transparent Pricing</h4>
                        <p className="trust-point-desc">No hidden charges. What we quote, you pay.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. BOOK A REPAIR MODAL / RIGHT-SIDE SLIDE-IN PANEL */}
        <div 
          className={`repair-modal-overlay ${isModalOpen ? 'active' : ''}`}
          onClick={handleCloseModal}
        >
          <div 
            className="repair-modal-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-header-title-box">
                <div className="modal-header-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="modal-title">Book a Repair</h3>
                  <p className="modal-subtitle">Fill in the details below and our team will contact you shortly.</p>
                </div>
              </div>

              <button 
                className="modal-close-btn"
                onClick={handleCloseModal}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            {/* Modal Body / Form */}
            <div className="modal-body">
              {isSubmitted ? (
                <div className="modal-success-box">
                  <div className="success-icon-badge">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h4 className="success-title">Repair request submitted successfully!</h4>
                  <p className="success-desc">
                    Thank you for booking with us. Our technical support expert will call you shortly to confirm your service details.
                  </p>
                  <button 
                    className="repair-cta-btn btn-full" 
                    onClick={handleCloseModal}
                  >
                    Close Panel
                  </button>
                </div>
              ) : (
                <form className="repair-form" onSubmit={handleSubmit}>
                  {/* Customer Name */}
                  <div className="form-group">
                    <label className="form-label">
                      Customer Name <span className="required">*</span>
                    </label>
                    <input 
                      type="text"
                      name="fullName"
                      required
                      placeholder="Enter your full name"
                      className="form-input"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="form-group">
                    <label className="form-label">
                      Phone Number <span className="required">*</span>
                    </label>
                    <input 
                      type="tel"
                      name="phone"
                      required
                      placeholder="Enter your phone number"
                      className="form-input"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Email Address */}
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      className="form-input"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Laptop Brand */}
                  <div className="form-group">
                    <label className="form-label">
                      Laptop Brand <span className="required">*</span>
                    </label>
                    <select 
                      name="brand"
                      required
                      className="form-select"
                      value={formData.brand}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select brand</option>
                      <option value="Dell">Dell</option>
                      <option value="HP">HP</option>
                      <option value="Lenovo">Lenovo</option>
                      <option value="ASUS">ASUS</option>
                      <option value="Acer">Acer</option>
                      <option value="Apple">Apple</option>
                      <option value="MSI">MSI</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Laptop Model */}
                  <div className="form-group">
                    <label className="form-label">Laptop Model</label>
                    <input 
                      type="text"
                      name="model"
                      placeholder="Enter laptop model"
                      className="form-input"
                      value={formData.model}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Issue Selection */}
                  <div className="form-group">
                    <label className="form-label">
                      What is the issue? <span className="required">*</span>
                    </label>
                    <select 
                      name="issue"
                      required
                      className="form-select"
                      value={formData.issue}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select issue</option>
                      <option value="Screen Problem">Screen Problem</option>
                      <option value="Battery Problem">Battery Problem</option>
                      <option value="Keyboard Problem">Keyboard Problem</option>
                      <option value="Laptop Not Turning On">Laptop Not Turning On</option>
                      <option value="Overheating">Overheating</option>
                      <option value="Slow Performance">Slow Performance</option>
                      <option value="Software Problem">Software Problem</option>
                      <option value="Charging Problem">Charging Problem</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label className="form-label">Describe the Issue</label>
                    <textarea 
                      name="description"
                      placeholder="Briefly describe the problem"
                      className="form-textarea"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Preferred Service Type */}
                  <div className="form-group">
                    <label className="form-label">
                      Preferred Service Type <span className="required">*</span>
                    </label>
                    <div className="service-type-grid">
                      <div 
                        className={`service-card ${formData.serviceType === 'Pickup & Repair' ? 'selected' : ''}`}
                        onClick={() => handleServiceTypeSelect('Pickup & Repair')}
                      >
                        <div className="service-card-title">
                          Pickup & Repair
                          {formData.serviceType === 'Pickup & Repair' && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                        <div className="service-card-desc">We'll pick up & deliver</div>
                      </div>

                      <div 
                        className={`service-card ${formData.serviceType === 'Drop at Store' ? 'selected' : ''}`}
                        onClick={() => handleServiceTypeSelect('Drop at Store')}
                      >
                        <div className="service-card-title">
                          Drop at Store
                          {formData.serviceType === 'Drop at Store' && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                        <div className="service-card-desc">I'll drop off at your store</div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="form-submit-btn">
                    ✈ SUBMIT REQUEST
                  </button>

                  {/* Privacy note */}
                  <div className="form-trust-footer">
                    🔒 Your information is safe with us.
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. FOOTER AT THE VERY BOTTOM */}
      <Footer />
    </div>
  );
}