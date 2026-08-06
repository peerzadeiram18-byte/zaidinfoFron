import React, { useState } from 'react';
import TopBar from "../components/TopBar/TopBar"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    YourName: '',
    PhoneNumber: '',
    Email: '',
    City: '',
    Services: '',
    Message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
  };

  return (
    <div className="contact-page-container">
      {/* --- TOP HEADER NAVIGATION --- */}
      <TopBar />
      <Header />

      {/* --- HERO BANNER SECTION --- */}
      <section className="contact-hero-banner">
        <img 
          src="https://www.laptopstoreindia.in/wp-content/uploads/2022/01/contact-bg.jpg" 
          alt="Contact Us" 
          className="contact-hero-image"
        />    
        
        {/* Center Content: Title, Subtitle & Breadcrumbs */}
        <div className="contact-hero-center-content">
          {/* Breadcrumbs Centered Above Title */}
          <div className="contact-breadcrumb-wrapper">
            <ul className="contact-breadcrumb-list">
              <li>
                <a href="#">Home</a>
              </li>
              <li className="contact-breadcrumb-separator">»</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <h1>Contact Us</h1>
          <p className="contact-hero-subtitle">
            Presently Zaid Infotech is a notable organization in Chennai
          </p>
        </div>
      </section>

      {/* --- CONTACT DETAILS & FORM SECTION --- */}
      <section className="contact-main-section">
        <div className="contact-content-grid">
          
          {/* Left Column: Contact Details */}
          <div className="contact-info-column">
            <div className="contact-subtitle-container">
              <span className="contact-accent-line"></span>
              <span className="contact-subtitle">We would Love to help you</span>
            </div>
            
            <h2 className="contact-title">Get in Touch</h2>
            <p className="contact-description">
              Welcome to Zaid Infotech center. Chances are if you landed on our page you are looking for Laptops service. Good news is you are in the right place!
            </p>
            
            <ul className="contact-details-list">
              <li className="contact-detail-item">
                <div className="contact-detail-card">
                  <div className="contact-icon-box">
                    <img 
                      src="https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets/images/cntct-ico-1.png" 
                      alt="Customer Support" 
                    />
                  </div>
                  <div className="contact-detail-text">
                    <h3>Customer Support:</h3>
                    <p>
                      Sales : <a href="tel:+919003166661">+919003166661</a><br />
                      Service : <a href="tel:+919003166661">+919003166661</a>
                    </p>
                  </div>
                </div>
              </li>

              <li className="contact-detail-item">
                <div className="contact-detail-card">
                  <div className="contact-icon-box">
                    <img 
                      src="https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets/images/cntct-ico-2.png" 
                      alt="Phone" 
                    />
                  </div>
                  <div className="contact-detail-text">
                    <h3>Phone:</h3>
                    <p><a href="tel:+919500066668">+919500066668</a></p>
                  </div>
                </div>
              </li>

              <li className="contact-detail-item">
                <div className="contact-detail-card">
                  <div className="contact-icon-box">
                    <img 
                      src="https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets/images/cntct-ico-3.png" 
                      alt="E-mail" 
                    />
                  </div>
                  <div className="contact-detail-text">
                    <h3>E-mail:</h3>
                    <p><a href="mailto:info@zaidinfotech.in">info@zaidinfotech.in</a></p>
                  </div>
                </div>
              </li>

              <li className="contact-detail-item">
                <div className="contact-detail-card">
                  <div className="contact-icon-box">
                    <img 
                      src="https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets/images/cntct-ico-4.png" 
                      alt="WhatsApp" 
                    />
                  </div>
                  <div className="contact-detail-text">
                    <h3>WhatsApp:</h3>
                    <p><a href="https://wa.me/919092590725" target="_blank" rel="noopener noreferrer">+91 9092590725</a></p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Right Column: Callback Form */}
          <div className="contact-form-column">
            <div className="contact-form-wrapper">
              <h2 className="contact-form-heading">Request for call back</h2>
              <p className="contact-form-subheading">Please complete the form below, we will get back to you!</p>
              
              <form onSubmit={handleSubmit} className="contact-custom-form">
                <div className="contact-input-field">
                  <label className="contact-input-label">Name</label>
                  <input 
                    type="text" 
                    name="YourName" 
                    className="contact-text-input" 
                    value={formData.YourName}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="contact-input-group">
                  <div className="contact-input-field">
                    <label className="contact-input-label">Phone Number</label>
                    <input 
                      type="text" 
                      name="PhoneNumber" 
                      className="contact-text-input" 
                      value={formData.PhoneNumber}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="contact-input-field">
                    <label className="contact-input-label">Email</label>
                    <input 
                      type="email" 
                      name="Email" 
                      className="contact-text-input" 
                      value={formData.Email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="contact-input-group">
                  <div className="contact-input-field">
                    <label className="contact-input-label">City</label>
                    <input 
                      type="text" 
                      name="City" 
                      className="contact-text-input" 
                      value={formData.City}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="contact-input-field">
                    <label className="contact-input-label">Sales/Services</label>
                    <select 
                      name="Services" 
                      className="contact-select-input"
                      value={formData.Services}
                      onChange={handleChange}
                      required
                    >
                      <option value="">—Please choose an option—</option>
                      <option value="Sales">Sales</option>
                      <option value="Services">Services</option>
                    </select>
                  </div>
                </div>

                <div className="contact-input-field">
                  <label className="contact-input-label">Message</label>
                  <textarea 
                    name="Message" 
                    rows="4" 
                    className="contact-textarea-input" 
                    value={formData.Message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="contact-action-btn">
                  <span>Send Message</span>
                  <span className="contact-btn-arrow">&#129040;</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* --- FOOTER SECTION --- */}
      <Footer />
    </div>
  );
}

export default Contact;