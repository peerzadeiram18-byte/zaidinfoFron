// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   MapPin,
//   Phone,
//   Mail,
//   ChevronRight,
// } from "lucide-react";

// import {
//   FaFacebookF,
//   FaInstagram,
//   FaLinkedinIn,
// } from "react-icons/fa";

// import logo from "../../assets/images/logo.png";
// import "./Footer.css";

// const Footer = () => {
//   // =====================================================
//   // QUICK LINKS
//   // =====================================================

//   const quickLinks = [
//     {
//       name: "Home",
//       path: "/",
//     },
//     {
//       name: "Shop",
//       path: "/shop",
//     },
//     {
//       name: "Rental",
//       path: "/rental",
//     },
//     {
//       name: "Repair Service",
//       path: "/repair-service",
//     },
//     {
//       name: "Categories",
//       path: "/categories",
//     },
//     {
//       name: "Offers",
//       path: "/offers",
//     },
//     {
//       name: "About Us",
//       path: "/about-us",
//     },
//     {
//       name: "Contact",
//       path: "/contact",
//     },
//   ];

//   // =====================================================
//   // SOCIAL LINKS
//   // =====================================================

//   const socialLinks = [
//     {
//       name: "Facebook",
//       icon: FaFacebookF,
//       url: "https://facebook.com",
//     },
//     {
//       name: "Instagram",
//       icon: FaInstagram,
//       url: "https://instagram.com",
//     },
//     {
//       name: "LinkedIn",
//       icon: FaLinkedinIn,
//       url: "https://linkedin.com",
//     },
//   ];

//   // =====================================================
//   // CURRENT YEAR
//   // =====================================================

//   const currentYear = new Date().getFullYear();

//   // =====================================================
//   // RENDER
//   // =====================================================

//   return (
//     <footer className="footer-section">
//       <div className="footer-container">

//         {/* =================================================
//             MAIN FOOTER GRID
//         ================================================= */}

//         <div className="footer-grid">

//           {/* =================================================
//               LOGO & DESCRIPTION
//           ================================================= */}

//           <div className="footer-col">

//             <Link to="/" aria-label="Zaid Infotech Home">
//               <div className="footer-logo-card">

//                 <img
//                   src={logo}
//                   alt="Zaid Infotech Logo"
//                   className="footer-logo-img"
//                 />

//               </div>
//             </Link>

//             <p className="footer-desc">
//               Your trusted partner for high-performance laptop
//               sales, rentals, expert repairs, and comprehensive IT
//               services.
//             </p>

//           </div>

//           {/* =================================================
//               QUICK LINKS
//           ================================================= */}

//           <div className="footer-col">

//             <div className="footer-title-wrap">
//               <h3 className="footer-title">
//                 Quick Links
//               </h3>
//             </div>

//             <ul className="footer-links-grid">

//               {quickLinks.map((link) => (
//                 <li key={link.name}>

//                   <Link
//                     to={link.path}
//                     className="footer-link-item"
//                   >

//                     <ChevronRight
//                       className="footer-link-icon"
//                     />

//                     <span>
//                       {link.name}
//                     </span>

//                   </Link>

//                 </li>
//               ))}

//             </ul>

//           </div>

//           {/* =================================================
//               CONTACT US
//           ================================================= */}

//           <div className="footer-col">

//             <div className="footer-title-wrap">
//               <h3 className="footer-title">
//                 Contact Us
//               </h3>
//             </div>

//             <div className="contact-list">

//               {/* ADDRESS */}

//               <div className="contact-item">

//                 <div className="contact-icon-box">
//                   <MapPin
//                     size={16}
//                     strokeWidth={2}
//                   />
//                 </div>

//                 <span>
//                   Shop No.232, 1st Floor,
//                   <br />
//                   M.K.N Road, Alandur,
//                   <br />
//                   Chennai, Tamil Nadu-600016
//                 </span>

//               </div>

//               {/* PHONE */}

//               <a
//                 href="tel:+919092590725"
//                 className="contact-item"
//               >

//                 <div className="contact-icon-box">
//                   <Phone
//                     size={16}
//                     strokeWidth={2}
//                   />
//                 </div>

//                 <span>
//                   +91 9092590725
//                 </span>

//               </a>

//               {/* EMAIL */}

//               <a
//                 href="mailto:info@zaidinfotech.in"
//                 className="contact-item"
//               >

//                 <div className="contact-icon-box">
//                   <Mail
//                     size={16}
//                     strokeWidth={2}
//                   />
//                 </div>

//                 <span>
//                   info@zaidinfotech.in
//                 </span>

//               </a>

//             </div>

//           </div>

//           {/* =================================================
//               FOLLOW US
//           ================================================= */}

//           <div className="footer-col">

//             <div className="footer-title-wrap">
//               <h3 className="footer-title">
//                 Follow Us
//               </h3>
//             </div>

//             <div className="social-list">

//               {socialLinks.map((social) => {

//                 const Icon = social.icon;

//                 return (
//                   <a
//                     key={social.name}
//                     href={social.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="social-link-item"
//                   >

//                     <div className="social-icon-box">

//                       <Icon size={16} />

//                     </div>

//                     <span>
//                       {social.name}
//                     </span>

//                   </a>
//                 );

//               })}

//             </div>

//           </div>

//         </div>

//         {/* =================================================
//             BOTTOM BAR
//         ================================================= */}

//         <div className="footer-bottom">

//           <p className="copyright-text">
//             &copy; {currentYear} Zaid Infotech.
//             All Rights Reserved.
//           </p>

//           {/* =================================================
//               LEGAL LINKS
//           ================================================= */}

//           <div className="policy-links">

//             <Link to="/privacy-policy">
//               Privacy Policy
//             </Link>

//             <span className="policy-sep">
//               |
//             </span>

//             <Link to="/terms-conditions">
//               Terms &amp; Conditions
//             </Link>

//             <span className="policy-sep">
//               |
//             </span>

//             <Link to="/returns-refunds">
//               Returns &amp; Refunds
//             </Link>

//             <span className="policy-sep">
//               |
//             </span>

//             <Link to="/warranty">
//               Warranty
//             </Link>

//             <span className="policy-sep">
//               |
//             </span>

//             <Link to="/shipping">
//               Shipping
//             </Link>

//             <span className="policy-sep">
//               |
//             </span>

//             <Link to="/rental-terms">
//               Rental Terms
//             </Link>

//             <span className="policy-sep">
//               |
//             </span>

//             <Link to="/repair-terms">
//               Repair Terms
//             </Link>

//           </div>

//         </div>

//       </div>
//     </footer>
//   );
// };

// export default Footer;



import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import logo from "../../assets/images/logo.png";
import "./Footer.css";

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Rental", path: "/rental" },
    { name: "Repair Service", path: "/repair-service" },
    { name: "Categories", path: "/categories" },
    { name: "Offers", path: "/offers" },
    { name: "About Us", path: "/about-us" },
    { name: "Contact", path: "/contact" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: FaFacebookF, url: "https://facebook.com" },
    { name: "Instagram", icon: FaInstagram, url: "https://instagram.com" },
    { name: "LinkedIn", icon: FaLinkedinIn, url: "https://linkedin.com" },
  ];

  const currentYear = new Date().getFullYear();

  // Replace this URL with Kloudinnvisionz's official website URL.
  const designerUrl = "https://kloudinnvisionz.com";

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          {/* BRAND */}
          <div className="footer-col footer-brand-col">
            <Link to="/" aria-label="Zaid Infotech Home">
              <div className="footer-logo-card">
                <img
                  src={logo}
                  alt="Zaid Infotech Logo"
                  className="footer-logo-img"
                />
              </div>
            </Link>

            <p className="footer-desc">
              Your trusted partner for high-performance laptop sales,
              rentals, expert repairs, and comprehensive IT services.
            </p>

            <div className="footer-brand-tag">
              Technology. Service. Trust.
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-col">
            <div className="footer-title-wrap">
              <h3 className="footer-title">Quick Links</h3>
            </div>

            <ul className="footer-links-grid">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="footer-link-item">
                    <ChevronRight className="footer-link-icon" size={15} />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="footer-col">
            <div className="footer-title-wrap">
              <h3 className="footer-title">Contact Us</h3>
            </div>

            <div className="contact-list">
              <div className="contact-item">
                <div className="contact-icon-box">
                  <MapPin size={17} />
                </div>
                <span>
                  Shop No.232, 1st Floor,
                  <br />
                  M.K.N Road, Alandur,
                  <br />
                  Chennai, Tamil Nadu-600016
                </span>
              </div>

              <a href="tel:+919092590725" className="contact-item">
                <div className="contact-icon-box">
                  <Phone size={17} />
                </div>
                <span>+91 9092590725</span>
              </a>

              <a
                href="mailto:info@zaidinfotech.in"
                className="contact-item"
              >
                <div className="contact-icon-box">
                  <Mail size={17} />
                </div>
                <span>info@zaidinfotech.in</span>
              </a>
            </div>
          </div>

          {/* SOCIAL */}
          <div className="footer-col">
            <div className="footer-title-wrap">
              <h3 className="footer-title">Follow Us</h3>
            </div>

            <div className="social-list">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link-item"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <div className="social-icon-box">
                      <Icon size={16} />
                    </div>
                    <span>{social.name}</span>
                    <ArrowUpRight className="social-arrow" size={14} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="footer-bottom">
          <p className="copyright-text">
            © {currentYear} Zaid Infotech. All Rights Reserved.
          </p>

          <div className="policy-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span className="policy-sep">|</span>
            <Link to="/terms-conditions">Terms &amp; Conditions</Link>
            <span className="policy-sep">|</span>
            <Link to="/returns-refunds">Returns &amp; Refunds</Link>
            <span className="policy-sep">|</span>
            <Link to="/warranty">Warranty</Link>
            <span className="policy-sep">|</span>
            <Link to="/shipping">Shipping</Link>
            <span className="policy-sep">|</span>
            <Link to="/rental-terms">Rental Terms</Link>
            <span className="policy-sep">|</span>
            <Link to="/repair-terms">Repair Terms</Link>
          </div>
        </div>

        {/* DESIGN CREDIT */}
        

<div className="footer-design-credit">
  <p className="footer-design-text">
    © {new Date().getFullYear()} Zaid Infotech.{" "}
    Designed &amp; Developed by{" "}
    <a
      href="https://kloudinnovisionz.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Kloud Innovisionz
    </a>
    {/* . All rights reserved. */}
  </p>
</div>
      </div>
    </footer>
  );
};

export default Footer;

