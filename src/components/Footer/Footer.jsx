// import "./Footer.css";

// function Footer() {
//   return (
//     <footer className="footer">
//       <h3>© 2026 Zaid Infotech. All Rights Reserved.</h3>
//     </footer>
//   );
// }

// export default Footer;


// Footer.jsx

import React from "react";
import { Link } from "react-router-dom";
// Standard Lucide UI icons
import { MapPin, Phone, Mail, ChevronRight } from "lucide-react";
// Social icons imported from react-icons/fa
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

// Import logo & background image
import logo from "../../assets/images/logo.png";
import bgkeyboard from "../../assets/images/bgimage.png";

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

  return (
    <footer 
      className="relative bg-cover bg-center text-gray-200 font-sans w-full overflow-hidden border-t border-slate-800/80"
      style={{ backgroundImage: `url(${bgkeyboard})` }}
    >
      {/* Optimized Dark Gradient Overlay (Keeps keyboard background crisp and visible) */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/65 to-slate-950/85"></div>

      {/* Main Footer Container */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 pt-12 pb-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Left Section - Logo & Description */}
          <div className="flex flex-col items-start text-left gap-4">
            <Link to="/" className="inline-block flex justify-start">
              <div className="p-2.5 bg-white/95 rounded-xl shadow-md border border-slate-100/20 flex items-center justify-center backdrop-blur-xs">
                <img
                  src={logo}
                  alt="Zaid Infotech Logo"
                  className="h-12 md:h-14 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs font-normal drop-shadow-xs">
              Your trusted partner for high-performance laptop sales, rentals,
              expert repairs, and comprehensive IT services. We deliver reliable
              technology solutions for individuals and businesses.
            </p>
            {/* Social Media Icons for Mobile */}
            <div className="flex items-center gap-3 mt-2 lg:hidden justify-start">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${social.name} page`}
                    className="group flex items-center justify-center w-9 h-9 bg-slate-900/90 text-slate-300 rounded-full border border-slate-700/80 hover:border-green-500 hover:text-green-400 hover:scale-105 transition-all duration-300 shadow-md"
                  >
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Center Section - Quick Links */}
          <div className="flex flex-col gap-4 md:col-span-1 lg:pl-2">
            <div className="pb-1 border-b-2 border-green-500/80 inline-block w-fit">
              <h3 className="text-white text-base md:text-lg font-semibold tracking-tight drop-shadow-xs">
                Quick Links
              </h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 pt-1">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-sm text-gray-300 hover:text-green-400 transition-all duration-300 whitespace-nowrap"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-green-500/80 group-hover:text-green-400 transform group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Section - Contact Us */}
          <div className="flex flex-col items-start text-left gap-4 lg:pl-2">
            <div className="pb-1 border-b-2 border-green-500/80 inline-block w-fit">
              <h3 className="text-white text-base md:text-lg font-semibold tracking-tight drop-shadow-xs">
                Contact Us
              </h3>
            </div>
            <div className="flex flex-col gap-3.5 text-gray-300 items-start text-left w-full text-sm pt-1">
              {/* Address */}
              <div className="flex items-start gap-3 text-left group">
                <div className="p-2 bg-slate-900/90 rounded-lg border border-slate-700/80 text-green-400 flex-shrink-0 mt-0.5 shadow-xs">
                  <MapPin className="w-4 h-4" strokeWidth={2} />
                </div>
                <p className="text-sm leading-relaxed text-gray-200">
                  Shop No.232, 1st Floor,
                  <br />
                  M.K.N Road, Alandur,
                  <br />
                  Chennai, Tamil Nadu-600016
                </p>
              </div>

              {/* Phone */}
              <a href="tel:+919092590725" className="flex items-center gap-3 group">
                <div className="p-2 bg-slate-900/90 rounded-lg border border-slate-700/80 text-green-400 flex-shrink-0 group-hover:border-green-500 transition-colors shadow-xs">
                  <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={2} />
                </div>
                <span className="text-sm font-medium tracking-wide text-gray-200 group-hover:text-green-400 transition-colors">
                  +91 9092590725
                </span>
              </a>

              {/* Email */}
              <a href="mailto:info@zaidinfotech.in" className="flex items-center gap-3 group">
                <div className="p-2 bg-slate-900/90 rounded-lg border border-slate-700/80 text-green-400 flex-shrink-0 group-hover:border-green-500 transition-colors shadow-xs">
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={2} />
                </div>
                <span className="text-sm text-gray-200 group-hover:text-green-400 transition-colors">
                  info@zaidinfotech.in
                </span>
              </a>
            </div>
          </div>

          {/* Social Media Section for Desktop */}
          <div className="hidden lg:flex flex-col gap-4 lg:pl-2">
            <div className="pb-1 border-b-2 border-green-500/80 inline-block w-fit">
              <h3 className="text-white text-base md:text-lg font-semibold tracking-tight drop-shadow-xs">
                Follow Us
              </h3>
            </div>
            <div className="flex flex-col gap-3 pt-1">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-sm text-gray-300 hover:text-green-400 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center w-9 h-9 bg-slate-900/90 text-slate-300 rounded-xl border border-slate-700/80 group-hover:border-green-500 group-hover:text-green-400 group-hover:scale-105 transition-all duration-300 shadow-xs flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm text-gray-200 group-hover:text-green-400 transition-colors">
                      {social.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright & Policies (Reduced spacing) */}
        <div className="mt-4 pt-4">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
            <p className="text-gray-400 text-xs md:text-sm text-center md:text-left font-normal">
              &copy; {currentYear} Zaid Infotech. All Rights Reserved.
            </p>
            <div className="flex gap-x-6 gap-y-2 flex-wrap justify-center md:justify-end text-xs md:text-sm text-gray-400">
              <Link to="/privacy-policy" className="hover:text-green-400 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-slate-700">|</span>
              <Link to="/terms-conditions" className="hover:text-green-400 transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;