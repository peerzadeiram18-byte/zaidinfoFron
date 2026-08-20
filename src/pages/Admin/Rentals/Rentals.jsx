


import React, { useState, useEffect } from 'react';
import './Rental.css';

// Component Imports
import TopBar from '../components/TopBar/TopBar.jsx';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';

function Rental() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    laptopType: 'i5',
    duration: '1 Month',
    quantity: 1,
    city: 'Pune',
    notes: '',
  });

  const slides = [
    {
      bgImage: 'https://www.punecomputeronrent.com/assets/img/slide/slide-1.webp',
      title: 'Laptop On Rent Near you?',
      description:
        'Looking for a laptop on rent in Chennai? Branded i3, i5, i7 laptops for students & business. Low price, quick delivery and service. Call to book today.',
      link: '#about',
    },
    {
      bgImage: 'https://www.punecomputeronrent.com/assets/img/slide/slide-2.webp',
      title: 'Affordable Laptop on Rent Near Me | Chennai | Fast Delivery',
      description:
        'Affordable laptop rental in Chennai with fast delivery. Ideal for students, offices, WFH & startups. Branded laptops on monthly rent with service. Get the best desktop rental deals today—call now!',
      link: '#about',
    },
    {
      bgImage: 'https://www.punecomputeronrent.com/assets/img/slide/slide-3.webp',
      title: 'Laptop for Students on Rent Near Me | Chennai | Low Price & Free Delivery',
      description:
        'Laptop on rent near me – Chennai. Latest i3/i5/i7 laptops for office, study & work from home. Monthly rental service & fast doorstep delivery.',
      link: '#about',
    },
  ];

  const rentalProducts = [
    {
      id: 1058,
      title: 'Lenovo ThinkPad L460 i5 / 8 GB / 256 GB SSD / Ubantu / 14 Inch /',
      link: 'https://abcom.in/product-details/1058/lenovo-thinkpad-l460-i5-8-gb-256-gb-ssd-ubantu-14-inch--available-on-rental',
      imgSrc: 'https://abcom.in/images/products/1775573232_69d518f067498.jpg',
      brand: 'Lenovo',
    },
    {
      id: 311,
      title: 'MacBook Air A2337 M1 CHIP / 8 GB / 256 GB SSD / Mac OS / 13 Inch /',
      link: 'https://abcom.in/product-details/311/macbook-air-a2337-m1-chip-8-gb-256-gb-ssd-mac-os-13-inch--available-on-rental',
      imgSrc: 'https://abcom.in/images/products/1688558869_MacBook-Pro-M2-Pro-Chip-16-silver-select-202301.png',
      brand: 'Apple',
    },
    {
      id: 477,
      title: 'MacBook Pro A2338 M2 CHIP / 8 GB / 256 GB SSD / Mac OS / 13 Inch /',
      link: 'https://abcom.in/product-details/477/macbook-pro-a2338-m2-chip-8-gb-256-gb-ssd-mac-os-13-inch--available-on-rental',
      imgSrc: 'https://abcom.in/images/products/1694242463_71a0bMsxeLL._SX679_.jpg',
      brand: 'Apple',
    },
    {
      id: 611,
      title: 'MacBook Air M3 M3 CHIP / 8 GB / 512 GB SSD / Mac OS / 13 Inch /',
      link: 'https://abcom.in/product-details/611/macbook-air-m3-m3-chip-8-gb-512-gb-ssd-mac-os-13-inch--available-on-rental',
      imgSrc: 'https://abcom.in/images/products/1769952763_697f55fbb6365.jpg',
      brand: 'Apple',
    },
    {
      id: 887,
      title: 'MacBook Max A3185 M4 CHIP / 36 GB / 512 GB SSD / Mac OS / 14 Inch /',
      link: 'https://abcom.in/product-details/887/macbook-max-a3185-m4-chip-36-gb-512-gb-ssd-mac-os-14-inch--available-on-rental',
      imgSrc: 'https://abcom.in/images/products/1733899250_9.png',
      brand: 'Apple',
    },
    {
      id: 885,
      title: 'MacBook Max A3186 M4 CHIP / 48 GB / 1 TB SSD / Mac OS / 16 Inch /',
      link: 'https://abcom.in/product-details/885/macbook-max-a3186-m4-chip-48-gb-1-tb-ssd-mac-os-16-inch--available-on-rental',
      imgSrc: 'https://abcom.in/images/products/1733896841_2.jpg',
      brand: 'Apple',
    },
    {
      id: 1054,
      title: 'HP 845 G7 Ryzen 5 / 16 GB / 256 GB SSD / Windows 11 Pro / 14 Inch /',
      link: 'https://abcom.in/product-details/1054/hp-845-g7-ryzen-5-16-gb-256-gb-ssd-windows-11-pro-14-inch--available-on-rental',
      imgSrc: 'https://abcom.in/images/products/1772863336_69abbf68b2d9f.jpg',
      brand: 'HP',
    },
    {
      id: 551,
      title: 'ASUS ROG Strix G15 Ryzen 7 / 16 GB / 512 GB SSD / Windows 11 Pro / 16 Inch',
      link: 'https://abcom.in/product-details/551/asus-rog-strix-g15-ryzen-7-16-gb-512-gb-ssd-windows-11-pro-16-inch-available-on-rental',
      imgSrc: 'https://abcom.in/images/products/1693219348_ASUS ROG Strix G15 1.jpg',
      brand: 'ASUS',
    },
  ];

  const requiredDocuments = [
    'Aadhaar Card',
    'PAN Card',
    'Voter ID Card',
    'Company ID Card',
    'Rent Agreement',
    'Light Bill Photo',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = (e) => {
    e.preventDefault();
    setActiveIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Rental enquiry submitted for ${formData.fullName}!`);
    setIsDrawerOpen(false);
  };

  return (
    <div>
      <TopBar />
      <Header />

      {/* Hero Carousel Section */}
      <section id="hero">
        <div className="hero-container">
          <div id="heroCarousel" className="carousel slide carousel-fade">
            <ol className="carousel-indicators" id="hero-carousel-indicators">
              {slides.map((_, index) => (
                <li
                  key={index}
                  className={index === activeIndex ? 'active' : ''}
                  onClick={() => setActiveIndex(index)}
                ></li>
              ))}
            </ol>

            <div className="carousel-inner">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${slide.bgImage})` }}
                >
                  <div className="carousel-container container">
                    <div className="carousel-content">
                      <h2 className="animate__animated animate__fadeInDown">
                        {slide.title}
                      </h2>
                      <p className="animate__animated animate__fadeInUp">
                        {slide.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsDrawerOpen(true)}
                        className="btn-get-started animate__animated animate__fadeInUp"
                        style={{ border: 'none', cursor: 'pointer' }}
                      >
                        Rent Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <a
              className="carousel-control-prev"
              href="#heroCarousel"
              role="button"
              onClick={handlePrev}
              aria-label="Previous Slide"
            >
              <span className="carousel-control-prev-icon ri-arrow-left-line" aria-hidden="true"></span>
            </a>

            <a
              className="carousel-control-next"
              href="#heroCarousel"
              role="button"
              onClick={handleNext}
              aria-label="Next Slide"
            >
              <span className="carousel-control-next-icon ri-arrow-right-line" aria-hidden="true"></span>
            </a>
          </div>
        </div>
      </section>

      {/* Banner Grid Section */}
      {/* <div className="slider-area slider-style-two pt-40 pb-10">
        <div className="container-fluid px-3 px-md-4">
          <div className="row align-items-stretch">
            <div className="col-lg-7 col-md-7 mb-sm-30 d-flex">
              <div className="single-banner zoom main-left-banner w-100">
                <a href="rental/103/109" onClick={(e) => { e.preventDefault(); setIsDrawerOpen(true); }}>
                  <img
                    src="https://abcom.in/images/1776931777.webp"
                    alt="banner-img"
                    className="img-fluid w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </a>
              </div>
            </div>
            <div className="col-lg-5 col-md-5 d-flex">
              <div className="dual-banner d-flex flex-column justify-content-between w-100 gap-3">
                <div className="single-banner zoom side-banner-item">
                  <a href="rental/103/146" onClick={(e) => { e.preventDefault(); setIsDrawerOpen(true); }}>
                    <img
                      src="https://abcom.in/images/1775394989.webp"
                      alt="banner-img"
                      className="img-fluid w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </a>
                </div>
                <div className="single-banner zoom side-banner-item">
                  <a href="rental/103/574" onClick={(e) => { e.preventDefault(); setIsDrawerOpen(true); }}>
                    <img
                      src="https://abcom.in/images/1776931944.webp"
                      alt="banner-img"
                      className="img-fluid w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Heading */}
      <h1
        className="after-before-separator text-center mt-3"
        style={{ textTransform: 'capitalize', color: '#0438a1', fontSize: '20px' }}
      >
        Best Deals Rental Laptop
      </h1>

      {/* Product Cards Grid Section */}
      <div className="product-grid-wrapper">
        <div className="product-grid-container mt-3">
          {rentalProducts.map((prd) => (
            <div key={prd.id} className="product-card">
              <div className="pro-img text-center">
                <a href={prd.link}>
                  <img
                    className="primary-img img-fluid"
                    src={prd.imgSrc}
                    alt={prd.title}
                  />
                </a>
              </div>

              <div className="pro-content">
                <div className="pro-info">
                  <h4>
                    <a href={prd.link}>{prd.title}</a>
                  </h4>
                </div>
                <div>
                  <h6 style={{ marginTop: '15px', textTransform: 'none', fontWeight: 100 }}>
                    {prd.brand} <span style={{ color: 'red' }}>|</span>{' '}
                    <a style={{ color: 'black' }}>
                      Laptop on Rent{' '}
                      <b
                        role="button"
                        onClick={() => setIsDrawerOpen(true)}
                        style={{ color: 'red', cursor: 'pointer' }}
                      >
                        Click Now
                      </b>
                    </a>
                  </h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Verification Section */}
      <div className="container-fluid px-3 px-md-4">
        <section id="documents" className="docs-section">
          <div
            className="docs-panel"
            style={{
              backgroundImage:
                'linear-gradient(rgba(18, 37, 46, 0.88), rgba(10, 21, 26, 0.92))',
              width: '100%',
              maxWidth: '100%',
            }}
          >
            <div className="docs-grid">
              <div className="docs-content">
                <p className="docs-subtitle">Simple rental process</p>
                <h2 className="docs-title">
                  Bring these documents and get started faster.
                </h2>
                <p className="docs-description">
                  For smooth verification and quick approval, please carry the following documents when you visit our store.
                </p>

                <div className="docs-list">
                  {requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="docs-item">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="check-icon-svg"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>

                <p className="docs-footer-note">
                  Final approval and rental eligibility depend on document verification and selected system configuration.
                </p>
              </div>

              <div className="docs-image-wrapper">
                <img
                  loading="lazy"
                  className="docs-image"
                  alt="A close-up of documents, tickets, and a mobile phone on a table."
                  src="https://images.pexels.com/photos/32642491/pexels-photo-32642491.jpeg"
                />
                <div className="docs-image-overlay"></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Backdrop for Side Form */}
      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)} />
      )}

      {/* Right Side Drawer / Rental Form */}
      <div className={`side-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>Laptop Rental Request</h3>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsDrawerOpen(false)}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-body">
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your mobile number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="laptopType">Laptop Specification Required</label>
            <select
              id="laptopType"
              name="laptopType"
              value={formData.laptopType}
              onChange={handleInputChange}
            >
              <option value="i3">Intel Core i3 (Basic / Study)</option>
              <option value="i5">Intel Core i5 (Office / Work)</option>
              <option value="i7">Intel Core i7 (High Performance)</option>
              <option value="macbook">Apple MacBook (Air / Pro)</option>
              <option value="gaming">Gaming Laptop (Ryzen / Dedicated GPU)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Rental Duration</label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
            >
              <option value="1 Week">1 Week</option>
              <option value="1 Month">1 Month</option>
              <option value="3 Months">3 Months</option>
              <option value="6+ Months">6+ Months</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity Required</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">Delivery City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="e.g. Pune"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Requirements</label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="RAM, SSD, OS specs or specific requirements..."
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit Rental Request
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default Rental;