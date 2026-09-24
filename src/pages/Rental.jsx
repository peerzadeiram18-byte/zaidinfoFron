

// import React, { useState, useEffect } from 'react';
// import './Rental.css';
// import "react-toastify/dist/ReactToastify.css";

// // Component Imports
// // import TopBar from '../components/TopBar/TopBar.jsx';
// // import Header from '../components/Header/Header.jsx';
// import Footer from '../components/Footer/Footer.jsx';

// function Rental() {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     laptopType: 'i5',
//     duration: '1 Month',
//     quantity: 1,
//     city: 'Pune',
//     notes: '',
//   });

//   const slides = [
//     {
//       bgImage: 'https://www.punecomputeronrent.com/assets/img/slide/slide-1.webp',
//       title: 'Laptop On Rent Near you?',
//       description:
//         'Looking for a laptop on rent in Chennai? Branded i3, i5, i7 laptops for students & business. Low price, quick delivery and service. Call to book today.',
//       link: '#about',
//     },
//     {
//       bgImage: 'https://www.punecomputeronrent.com/assets/img/slide/slide-2.webp',
//       title: 'Affordable Laptop on Rent Near Me | Chennai | Fast Delivery',
//       description:
//         'Affordable laptop rental in Chennai with fast delivery. Ideal for students, offices, WFH & startups. Branded laptops on monthly rent with service. Get the best desktop rental deals today—call now!',
//       link: '#about',
//     },
//     {
//       bgImage: 'https://www.punecomputeronrent.com/assets/img/slide/slide-3.webp',
//       title: 'Laptop for Students on Rent Near Me | Chennai | Low Price & Free Delivery',
//       description:
//         'Laptop on rent near me – Chennai. Latest i3/i5/i7 laptops for office, study & work from home. Monthly rental service & fast doorstep delivery.',
//       link: '#about',
//     },
//   ];

//   const rentalProducts = [
//     {
//       id: 1058,
//       title: 'Lenovo ThinkPad L460 i5 / 8 GB / 256 GB SSD / Ubantu / 14 Inch /',
//       link: 'https://abcom.in/product-details/1058/lenovo-thinkpad-l460-i5-8-gb-256-gb-ssd-ubantu-14-inch--available-on-rental',
//       imgSrc: 'https://abcom.in/images/products/1775573232_69d518f067498.jpg',
//       brand: 'Lenovo',
//     },
//     {
//       id: 311,
//       title: 'MacBook Air A2337 M1 CHIP / 8 GB / 256 GB SSD / Mac OS / 13 Inch /',
//       link: 'https://abcom.in/product-details/311/macbook-air-a2337-m1-chip-8-gb-256-gb-ssd-mac-os-13-inch--available-on-rental',
//       imgSrc: 'https://abcom.in/images/products/1688558869_MacBook-Pro-M2-Pro-Chip-16-silver-select-202301.png',
//       brand: 'Apple',
//     },
//     {
//       id: 477,
//       title: 'MacBook Pro A2338 M2 CHIP / 8 GB / 256 GB SSD / Mac OS / 13 Inch /',
//       link: 'https://abcom.in/product-details/477/macbook-pro-a2338-m2-chip-8-gb-256-gb-ssd-mac-os-13-inch--available-on-rental',
//       imgSrc: 'https://abcom.in/images/products/1694242463_71a0bMsxeLL._SX679_.jpg',
//       brand: 'Apple',
//     },
//     {
//       id: 611,
//       title: 'MacBook Air M3 M3 CHIP / 8 GB / 512 GB SSD / Mac OS / 13 Inch /',
//       link: 'https://abcom.in/product-details/611/macbook-air-m3-m3-chip-8-gb-512-gb-ssd-mac-os-13-inch--available-on-rental',
//       imgSrc: 'https://abcom.in/images/products/1769952763_697f55fbb6365.jpg',
//       brand: 'Apple',
//     },
//     {
//       id: 887,
//       title: 'MacBook Max A3185 M4 CHIP / 36 GB / 512 GB SSD / Mac OS / 14 Inch /',
//       link: 'https://abcom.in/product-details/887/macbook-max-a3185-m4-chip-36-gb-512-gb-ssd-mac-os-14-inch--available-on-rental',
//       imgSrc: 'https://abcom.in/images/products/1733899250_9.png',
//       brand: 'Apple',
//     },
//     {
//       id: 885,
//       title: 'MacBook Max A3186 M4 CHIP / 48 GB / 1 TB SSD / Mac OS / 16 Inch /',
//       link: 'https://abcom.in/product-details/885/macbook-max-a3186-m4-chip-48-gb-1-tb-ssd-mac-os-16-inch--available-on-rental',
//       imgSrc: 'https://abcom.in/images/products/1733896841_2.jpg',
//       brand: 'Apple',
//     },
//     {
//       id: 1054,
//       title: 'HP 845 G7 Ryzen 5 / 16 GB / 256 GB SSD / Windows 11 Pro / 14 Inch /',
//       link: 'https://abcom.in/product-details/1054/hp-845-g7-ryzen-5-16-gb-256-gb-ssd-windows-11-pro-14-inch--available-on-rental',
//       imgSrc: 'https://abcom.in/images/products/1772863336_69abbf68b2d9f.jpg',
//       brand: 'HP',
//     },
//     {
//       id: 551,
//       title: 'ASUS ROG Strix G15 Ryzen 7 / 16 GB / 512 GB SSD / Windows 11 Pro / 16 Inch',
//       link: 'https://abcom.in/product-details/551/asus-rog-strix-g15-ryzen-7-16-gb-512-gb-ssd-windows-11-pro-16-inch-available-on-rental',
//       imgSrc: 'https://abcom.in/images/products/1693219348_ASUS ROG Strix G15 1.jpg',
//       brand: 'ASUS',
//     },
//   ];

//   const requiredDocuments = [
//     'Aadhaar Card',
//     'PAN Card',
//     'Voter ID Card',
//     'Company ID Card',
//     'Rent Agreement',
//     'Light Bill Photo',
//   ];

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, [slides.length]);

//   const handlePrev = (e) => {
//     e.preventDefault();
//     setActiveIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
//   };

//   const handleNext = (e) => {
//     e.preventDefault();
//     setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert(`Rental enquiry submitted for ${formData.fullName}!`);
//     setIsDrawerOpen(false);
//   };

//   return (
//     <div>
//       {/* <TopBar />
//       <Header /> */}

//       {/* Hero Carousel Section */}
//       <section id="hero">
//         <div className="hero-container">
//           <div id="heroCarousel" className="carousel slide carousel-fade">
//             <ol className="carousel-indicators" id="hero-carousel-indicators">
//               {slides.map((_, index) => (
//                 <li
//                   key={index}
//                   className={index === activeIndex ? 'active' : ''}
//                   onClick={() => setActiveIndex(index)}
//                 ></li>
//               ))}
//             </ol>

//             <div className="carousel-inner">
//               {slides.map((slide, index) => (
//                 <div
//                   key={index}
//                   className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
//                   style={{ backgroundImage: `url(${slide.bgImage})` }}
//                 >
//                   <div className="carousel-container container">
//                     <div className="carousel-content">
//                       <h2 className="animate__animated animate__fadeInDown">
//                         {slide.title}
//                       </h2>
//                       <p className="animate__animated animate__fadeInUp">
//                         {slide.description}
//                       </p>
//                       <button
//                         type="button"
//                         onClick={() => setIsDrawerOpen(true)}
//                         className="btn-get-started animate__animated animate__fadeInUp"
//                         style={{ border: 'none', cursor: 'pointer' }}
//                       >
//                         Rent Now
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <a
//               className="carousel-control-prev"
//               href="#heroCarousel"
//               role="button"
//               onClick={handlePrev}
//               aria-label="Previous Slide"
//             >
//               <span className="carousel-control-prev-icon ri-arrow-left-line" aria-hidden="true"></span>
//             </a>

//             <a
//               className="carousel-control-next"
//               href="#heroCarousel"
//               role="button"
//               onClick={handleNext}
//               aria-label="Next Slide"
//             >
//               <span className="carousel-control-next-icon ri-arrow-right-line" aria-hidden="true"></span>
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Banner Grid Section */}
//       <div className="slider-area slider-style-two pt-40 pb-10">
//         <div className="container-fluid px-3 px-md-4">
//           <div className="row align-items-stretch">
//             <div className="col-lg-7 col-md-7 mb-sm-30 d-flex">
//               <div className="single-banner zoom main-left-banner w-100">
//                 <a href="rental/103/109" onClick={(e) => { e.preventDefault(); setIsDrawerOpen(true); }}>
//                   <img
//                     src="https://abcom.in/images/1776931777.webp"
//                     alt="banner-img"
//                     className="img-fluid w-100 h-100"
//                     style={{ objectFit: 'cover' }}
//                   />
//                 </a>
//               </div>
//             </div>
//             <div className="col-lg-5 col-md-5 d-flex">
//               <div className="dual-banner d-flex flex-column justify-content-between w-100 gap-3">
//                 <div className="single-banner zoom side-banner-item">
//                   <a href="rental/103/146" onClick={(e) => { e.preventDefault(); setIsDrawerOpen(true); }}>
//                     <img
//                       src="https://abcom.in/images/1775394989.webp"
//                       alt="banner-img"
//                       className="img-fluid w-100 h-100"
//                       style={{ objectFit: 'cover' }}
//                     />
//                   </a>
//                 </div>
//                 <div className="single-banner zoom side-banner-item">
//                   <a href="rental/103/574" onClick={(e) => { e.preventDefault(); setIsDrawerOpen(true); }}>
//                     <img
//                       src="https://abcom.in/images/1776931944.webp"
//                       alt="banner-img"
//                       className="img-fluid w-100 h-100"
//                       style={{ objectFit: 'cover' }}
//                     />
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Heading */}
//       <h1
//         className="after-before-separator text-center mt-3"
//         style={{ textTransform: 'capitalize', color: '#0438a1', fontSize: '20px' }}
//       >
//         Best Deals Rental Laptop
//       </h1>

//       {/* Product Cards Grid Section */}
//       <div className="product-grid-wrapper">
//         <div className="product-grid-container mt-3">
//           {rentalProducts.map((prd) => (
//             <div key={prd.id} className="product-card">
//               <div className="pro-img text-center">
//                 <a href={prd.link}>
//                   <img
//                     className="primary-img img-fluid"
//                     src={prd.imgSrc}
//                     alt={prd.title}
//                   />
//                 </a>
//               </div>

//               <div className="pro-content">
//                 <div className="pro-info">
//                   <h4>
//                     <a href={prd.link}>{prd.title}</a>
//                   </h4>
//                 </div>
//                 <div>
//                   <h6 style={{ marginTop: '15px', textTransform: 'none', fontWeight: 100 }}>
//                     {prd.brand} <span style={{ color: 'red' }}>|</span>{' '}
//                     <a style={{ color: 'black' }}>
//                       Laptop on Rent{' '}
//                       <b
//                         role="button"
//                         onClick={() => setIsDrawerOpen(true)}
//                         style={{ color: 'red', cursor: 'pointer' }}
//                       >
//                         Click Now
//                       </b>
//                     </a>
//                   </h6>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Documents Verification Section */}
//       <div className="container-fluid px-3 px-md-4">
//         <section id="documents" className="docs-section">
//           <div
//             className="docs-panel"
//             style={{
//               backgroundImage:
//                 'linear-gradient(rgba(18, 37, 46, 0.88), rgba(10, 21, 26, 0.92))',
//               width: '100%',
//               maxWidth: '100%',
//             }}
//           >
//             <div className="docs-grid">
//               <div className="docs-content">
//                 <p className="docs-subtitle">Simple rental process</p>
//                 <h2 className="docs-title">
//                   Bring these documents and get started faster.
//                 </h2>
//                 <p className="docs-description">
//                   For smooth verification and quick approval, please carry the following documents when you visit our store.
//                 </p>

//                 <div className="docs-list">
//                   {requiredDocuments.map((doc, idx) => (
//                     <div key={idx} className="docs-item">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         className="check-icon-svg"
//                       >
//                         <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
//                         <path d="m9 12 2 2 4-4"></path>
//                       </svg>
//                       <span>{doc}</span>
//                     </div>
//                   ))}
//                 </div>

//                 <p className="docs-footer-note">
//                   Final approval and rental eligibility depend on document verification and selected system configuration.
//                 </p>
//               </div>

//               <div className="docs-image-wrapper">
//                 <img
//                   loading="lazy"
//                   className="docs-image"
//                   alt="A close-up of documents, tickets, and a mobile phone on a table."
//                   src="https://images.pexels.com/photos/32642491/pexels-photo-32642491.jpeg"
//                 />
//                 <div className="docs-image-overlay"></div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>

//       {/* Backdrop for Side Form */}
//       {isDrawerOpen && (
//         <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)} />
//       )}

//       {/* Right Side Drawer / Rental Form */}
//       <div className={`side-drawer ${isDrawerOpen ? 'open' : ''}`}>
//         <div className="drawer-header">
//           <h3>Laptop Rental Request</h3>
//           <button
//             type="button"
//             className="drawer-close-btn"
//             onClick={() => setIsDrawerOpen(false)}
//           >
//             &times;
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="drawer-body">
//           <div className="form-group">
//             <label htmlFor="fullName">Full Name *</label>
//             <input
//               type="text"
//               id="fullName"
//               name="fullName"
//               required
//               value={formData.fullName}
//               onChange={handleInputChange}
//               placeholder="Enter your name"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="phone">Phone Number *</label>
//             <input
//               type="tel"
//               id="phone"
//               name="phone"
//               required
//               value={formData.phone}
//               onChange={handleInputChange}
//               placeholder="Enter your mobile number"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="email">Email Address</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               placeholder="Enter your email"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="laptopType">Laptop Specification Required</label>
//             <select
//               id="laptopType"
//               name="laptopType"
//               value={formData.laptopType}
//               onChange={handleInputChange}
//             >
//               <option value="i3">Intel Core i3 (Basic / Study)</option>
//               <option value="i5">Intel Core i5 (Office / Work)</option>
//               <option value="i7">Intel Core i7 (High Performance)</option>
//               <option value="macbook">Apple MacBook (Air / Pro)</option>
//               <option value="gaming">Gaming Laptop (Ryzen / Dedicated GPU)</option>
//             </select>
//           </div>

//           <div className="form-group">
//             <label htmlFor="duration">Rental Duration</label>
//             <select
//               id="duration"
//               name="duration"
//               value={formData.duration}
//               onChange={handleInputChange}
//             >
//               <option value="1 Week">1 Week</option>
//               <option value="1 Month">1 Month</option>
//               <option value="3 Months">3 Months</option>
//               <option value="6+ Months">6+ Months</option>
//             </select>
//           </div>

//           <div className="form-group">
//             <label htmlFor="quantity">Quantity Required</label>
//             <input
//               type="number"
//               id="quantity"
//               name="quantity"
//               min="1"
//               value={formData.quantity}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="city">Delivery City</label>
//             <input
//               type="text"
//               id="city"
//               name="city"
//               value={formData.city}
//               onChange={handleInputChange}
//               placeholder="e.g. Pune"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="notes">Additional Requirements</label>
//             <textarea
//               id="notes"
//               name="notes"
//               rows="3"
//               value={formData.notes}
//               onChange={handleInputChange}
//               placeholder="RAM, SSD, OS specs or specific requirements..."
//             />
//           </div>

//           <button type="submit" className="submit-btn">
//             Submit Rental Request
//           </button>
//         </form>
//       </div>

//       <Footer />
//     </div>
//   );
// }

// export default Rental;



import React from "react";
import "./Rental.css";
import b1 from "../assets/images/b1.jpeg";
import b2 from "../assets/images/b2.jpeg";
import b3 from "../assets/images/b3.jpeg";
import a1 from "../assets/images/a1.jpeg";
import a2 from "../assets/images/a2.jpeg";
import a3 from "../assets/images/a3.jpeg";
import p1 from "../assets/images/p1.jpeg";
import p2 from "../assets/images/p2.jpeg";
import Footer from "../components/Footer/Footer";

const products = [
  {
    id: "elitebook-840-g9",
    name: "HP EliteBook 840 G9",
    specs: "i7 • 16GB • 512GB • 14\"",
    price: 2650,
    mrp: 3100,
    stock: "Only 3 left",
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "thinkpad-t14",
    name: "Lenovo ThinkPad T14",
    specs: "i5 • 16GB • 512GB • 14\"",
    price: 2280,
    mrp: 2600,
    stock: "Only 5 left",
    image:
      "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "macbook-air-m2",
    name: "MacBook Air M2",
    specs: "M2 • 8GB • 256GB • 13\"",
    price: 3450,
    mrp: 3900,
    stock: "Only 2 left",
    image:
      "https://images.unsplash.com/photo-1539376248633-cf94fa8b7bd8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "dell-latitude-5420",
    name: "Dell Latitude 5420",
    specs: "i5 • 8GB • 256GB • 14\"",
    price: 1980,
    mrp: 2300,
    stock: "Only 6 left",
    image:
      "https://images.unsplash.com/photo-1575909812264-6902b55846ad?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "hp-probook-450",
    name: "HP ProBook 450 G8",
    specs: "i5 • 8GB • 512GB • 15.6\"",
    price: 2050,
    mrp: null,
    stock: "Only 4 left",
    image:
      "https://images.unsplash.com/photo-157024357670-2b5164f470c3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "dell-precision-3560",
    name: "Dell Precision 3560",
    specs: "i7 • 16GB • 512GB • 15.6\"",
    price: 2890,
    mrp: 3250,
    stock: "Only 3 left",
    image:
      "https://images.unsplash.com/photo-1593642633279-1796119d5482?auto=format&fit=crop&w=800&q=80",
  },
];

const categories = [
  {
    id: "Laptops",
    label: "Laptops",
    tag: "Bestseller",
    startingAt: "2,100.00",
    image: p1,
    link: "/products?category=Laptops",
  },
  {
    id: "Workstations",
    label: "Workstations",
    tag: null,
    startingAt: "2,890.00",
    image: p2,
    link: "/products?category=Workstations",
  },
];

const steps = [
  {
    title: "Pick Your Laptop",
    copy: "Browse through our collection and select the laptop that suits your needs.",
    image: b1,
  },
  {
    title: "Select Tenure Plan",
    copy: "Choose a flexible monthly rental duration that works best for you.",
    image: b2,
  },
  {
    title: "Get It Delivered",
    copy: "Complete verification and receive the laptop at your doorstep.",
    image: b3,
  },
];

const reasons = [
  {
    title: "Tested before it ships",
    copy: "Every unit is checked and benchmarked so it performs from day one.",
    image: a1,
  },
  {
    title: "Pricing you can read in one glance",
    copy: "One monthly number, deposit shown upfront, nothing added later.",
    image: a2,
  },
  {
    title: "Support through the whole term",
    copy: "Doorstep delivery, swaps, and help desk access while you rent.",
    image: a3,
  },
];

function LaptopGlyph() {
  return (
    <svg viewBox="0 0 64 44" className="rt-glyph" aria-hidden="true">
      <rect x="10" y="4" width="44" height="28" rx="2.5" className="rt-glyph-screen" />
      <rect x="14" y="8" width="36" height="20" rx="1" className="rt-glyph-panel" />
      <path d="M2 36h60l-5 6H7l-5-6z" className="rt-glyph-base" />
    </svg>
  );
}

export default function Rentall() {
  return (
    <div className="rentall-page">
      {/* Hero */}
      <section className="rt-hero">
        <div className="rt-container rt-hero-grid">
          <div className="rt-hero-copy">
            <div className="rt-hero-badge">
              <span className="rt-pill">Rentals</span>
              <span>Starting at &#8377;1,980/month</span>
            </div>
            <h1 className="rt-hero-title">
              Flexible laptop rentals for work and study.
            </h1>
            <p className="rt-hero-sub">
              Premium laptops on monthly plans, delivered to your door — swap
              or upgrade whenever your needs change.
            </p>
            <div className="rt-hero-actions">
              <a href="#products" className="rt-btn rt-btn-primary">
                Explore laptops
              </a>
              <a href="#business" className="rt-link-arrow">
                For business <span>&rarr;</span>
              </a>
            </div>
          </div>

          <div className="rt-hero-art" aria-hidden="true">
            <div className="rt-laptop-wrap">
              <div className="rt-laptop">
                <div className="rt-laptop-screen">
                  <span className="rt-laptop-cam" />
                  <div className="rt-laptop-wave" />
                </div>
                <div className="rt-laptop-body">
                  <span className="rt-laptop-hinge" />
                  <span className="rt-laptop-trackpad" />
                </div>
              </div>
              <div className="rt-laptop-shadow" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="rt-trust">
        <div className="rt-container">
          <p className="rt-trust-label">
            Trusted by teams and students across India
          </p>
          <div className="rt-trust-row">
            {[
              "Nimbus Labs",
              "Cursor Studio",
              "Bright Path Edu",
              "Forge & Co",
              "Nova Systems",
              "Kestrel Tech",
            ].map((name) => (
              <span className="rt-trust-item" key={name}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Popular products */}
      <section className="rt-products" id="products">
        <div className="rt-container">
          <div className="rt-section-head">
            <div>
              <h2 className="rt-h2">Most rented right now</h2>
              <p className="rt-section-sub">
                A wide range of laptops on flexible tenures, with fast
                delivery and support included.
              </p>
            </div>
            <a href="#all" className="rt-link-arrow rt-link-desktop">
              View all laptops <span>&rarr;</span>
            </a>
          </div>

          <div className="rt-product-grid">
            {products.map((p) => (
              <article className="rt-card" key={p.id}>
                <div className="rt-card-media">
                  <LaptopGlyph />
                  <img
                    src={p.image}
                    alt={p.name}
                    className="rt-card-img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="rt-card-body">
                  <h3 className="rt-card-title">{p.name}</h3>
                  <div className="rt-card-row">
                    <span className="rt-card-specs">{p.specs}</span>
                    <div className="rt-card-price">
                      {p.mrp && <span className="rt-badge-off">12% off</span>}
                      <div className="rt-price-now">
                        &#8377;{p.price.toLocaleString("en-IN")}
                        <span>/mo</span>
                      </div>
                      {p.mrp && (
                        <div className="rt-price-mrp">
                          &#8377;{p.mrp.toLocaleString("en-IN")}/mo
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="rt-card-stock">{p.stock}</p>
                </div>
                <div className="rt-card-actions">
                  <button type="button" className="rt-btn rt-btn-outline">
                    Add to cart
                  </button>
                  <a href={`#${p.id}`} className="rt-btn rt-btn-dark">
                    View details
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="rt-link-mobile">
            <a href="#all" className="rt-link-arrow">
              View all laptops <span>&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="rt-categories">
        <div className="rt-container">
          <div className="rt-section-head">
            <div>
              <h2 className="rt-h2">Browse by category</h2>
              <p className="rt-section-sub">
                Pick a device, complete quick verification, and get it
                delivered — no long-term commitment.
              </p>
            </div>
            <a href="#all" className="rt-link-arrow rt-link-desktop">
              View all laptops <span>&rarr;</span>
            </a>
          </div>

          <div className="rt-category-grid">
            {categories.map((c) => (
              <div
                key={c.id}
                className="relative overflow-hidden rounded-lg bg-[#E9E9E9] p-8 text-center"
              >
                {c.tag && (
                  <span className="absolute left-2 top-2 rounded-full bg-[#7CE0E6] px-3 py-1 text-xs font-light text-[#053436]">
                    {c.tag}
                  </span>
                )}
                <div className="flex justify-center">
                  <span className="rounded-full border border-slate-300 bg-white/40 px-4 py-1 text-xs text-slate-700">
                    {c.label}
                  </span>
                </div>
                <div className="mt-2 text-3xl font-semibold text-slate-950 md:text-[28px]">
                  {c.label}
                </div>
                <div className="mt-5 flex justify-center">
                  <img
                    alt={c.label}
                    loading="lazy"
                    className="h-40 w-auto object-contain"
                    src={c.image}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="mt-10 flex justify-center">
                  <a
                    className="inline-flex items-center justify-center rounded-full bg-[#003F43] px-8 py-2 text-sm font-normal !text-white shadow-sm transition-colors hover:bg-[#053f3f]"
                    href={c.link}
                  >
                    Rent Now
                  </a>
                </div>
                <div className="mt-4 text-sm font-normal text-[#053436]">
                  Starting at ₹{c.startingAt} per month
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="rt-steps">
        <div className="rt-container">
          <div className="rt-section-head rt-section-head-center">
            <h2 className="rt-h2">Renting takes three steps.</h2>
            <p className="rt-section-sub">
              Choose a device, select a plan, and get it delivered.
            </p>
          </div>

          <div className="rt-steps-grid">
            {steps.map((s) => (
              <div
                className="rt-step-card"
                key={s.title}
                style={{ backgroundImage: `url(${s.image})` }}
              >
                <div className="rt-step-overlay"></div>
                <div className="rt-step-content">
                  <div className="rt-step-text-wrapper">
                    <div className="rt-step-card-title">{s.title}</div>
                    <div className="rt-step-card-desc">{s.copy}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="rt-whyus">
        <div className="rt-container">
          <div className="rt-section-head rt-section-head-center">
            <h2 className="rt-h2">Why rent with Zaid Infotech</h2>
            <p className="rt-section-sub">
              Transparent pricing and support that stays with you for the
              whole rental term.
            </p>
          </div>

          <div className="rt-why-grid">
            {reasons.slice(0, 2).map((r) => (
              <div className="rt-why-card" key={r.title}>
                <div className="rt-why-media">
                  <img src={r.image} alt={r.title} loading="lazy" />
                </div>
                <div className="rt-why-body">
                  <h3 className="rt-why-title">{r.title}</h3>
                  <p className="rt-why-copy">{r.copy}</p>
                </div>
              </div>
            ))}
          </div>

          {reasons[2] && (
            <div className="rt-why-wide">
              <div className="rt-why-wide-media">
                <img src={reasons[2].image} alt={reasons[2].title} loading="lazy" />
              </div>
              <div className="rt-why-wide-body">
                <h3 className="rt-why-title">{reasons[2].title}</h3>
                <p className="rt-why-copy">{reasons[2].copy}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Business banner */}
      <section className="rt-business" id="business">
        <div className="rt-container rt-business-inner">
          <div className="rt-business-copy">
            <h2 className="rt-h2">Laptop rentals for growing teams</h2>
            <p className="rt-section-sub">
              Bulk plans for startups, corporates, and institutions, with one
              invoice and one point of contact.
            </p>
            <a href="/contact" className="rt-btn rt-btn-dark">
              Request a quote
            </a>
          </div>
          <div className="rt-business-art">
            <img
              src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80"
              alt="Laptop for business rentals"
              loading="lazy"
            />
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}