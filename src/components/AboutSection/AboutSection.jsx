import React from "react";
import { CheckCircle2, MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import storeImage from "../../assets/images/store.png";

import "./AboutSection.css";
import OurMission from "../OurMission/OurMission";
import OurAchievements from "./OurAchievements.jsx"; // <-- 1. IMPORT ADDED HERE

const AboutSection = () => {
  return (
    <section className="about-section-container">
      {/* --- FULL-WIDTH CENTERED BANNER SECTION --- */}
      <div className="banner-full-width text-center">
        <p className="banner-subtext">
          We are Zaid Infotech and we do one thing, and that epically good
        </p>
        <img 
          alt="We Deliver unbeatable laptop deals" 
          loading="lazy" 
          width="600" 
          height="310" 
          decoding="async" 
          className="w-600 mx-auto h-auto mt-5 mb-5" 
          style={{ color: "transparent" }} 
          src="https://static-media.laptopoutlet.co.uk/wysiwyg/upgrade_2/page/2025/about-us/we-deliver.gif" 
        />
      </div>

      {/* --- TWO-COLUMN GRID LAYOUT (TOP SECTION) --- */}
      <div className="about-grid">
        
        {/* LEFT CONTENT COLUMN */}
        <motion.div 
          className="about-left-col"
          initial={{ opacity: 0, x: -250 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 1.1, 
            ease: [0.25, 1, 0.5, 1] 
          }}
        >
          {/* Tagline / Experience */}
          <span className="about-experience-tag">
            10+ Years Experience
          </span>

          {/* Main Headline */}
          <h2 className="about-main-title">
            ABOUT Zaid Infotech
          </h2>

          {/* Subheading */}
          <h3 className="about-subtitle">
            Your Trusted Refurbished Laptop &amp; Computer Store in Chennai
          </h3>

          {/* Main About Paragraph */}
          <p className="about-paragraph">
            India’s largest seller of premium quality imported laptops with light used machine with manufacturer warranty. We bring nearly new laptops for you to pick as your first choice. We do potential research about our customer’s needs and make the best choice for them by providing the best laptops with all the necessary specifications expected by the buyer. We succeeded in selling more than thousands of laptops per year and keep succeeding. Our rise is like a rocket every year by providing top-notch quality products without compromise. We don’t simply deliver the laptops instead we examine every laptop so all our laptops are <strong className="text-highlight">TESTED &amp; TRUSTED</strong> by thousands of buyers. We follow our unique way of choosing and testing all the laptops to fulfil your exact requirements, we don’t stop there, we achieve trusted customers only through our <strong className="text-highlight">Committed &amp; Dedicated Services</strong>. We specialize and deal with all the high-end laptops of the brands including Apple, Lenovo, ThinkPad, Dell and so on. And our service allows you to avail of our products anywhere in the world.
          </p>
        </motion.div>

        {/* RIGHT IMAGE COLUMN */}
        <motion.div 
          className="about-right-col"
          initial={{ opacity: 0, x: 250 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 1.1, 
            ease: [0.25, 1, 0.5, 1] 
          }}
        >
          <div className="store-image-wrapper">
            <img
              src={storeImage}
              alt="Zaid Infotech Store Display"
              className="store-image"
            />
          </div>
        </motion.div>

      </div>

      {/* --- OUR MISSION COMPONENT (FULL WIDTH BANNER) --- */}
      <OurMission />

      {/* --- OUR ACHIEVEMENTS COMPONENT --- */}
      <OurAchievements /> {/* <-- 2. COMPONENT ADDED HERE */}

      {/* --- LOWER CONTENT SECTION --- */}
      <div className="about-grid margin-top-large">
        <motion.div className="about-left-col full-width-col">

          {/* --- WHAT WE OFFER SECTION --- */}
          <div className="about-block gap-medium">
            <h3 className="about-section-heading">
              What We Offer
            </h3>
            <p className="about-paragraph">
              Zaid Infotech specializes in a wide range of computer products and hardware components including:
            </p>

            {/* 1. Refurbished Laptops */}
            <div className="offer-item">
              <h4 className="offer-title">
                Refurbished Laptops
              </h4>
              <p className="about-paragraph">
                We offer high-quality refurbished laptops from leading brands such as:
              </p>
              <ul className="offer-list">
                <li>Dell Business Laptops</li>
                <li>HP EliteBook Series</li>
                <li>Lenovo ThinkPad Series</li>
              </ul>
              <p className="about-paragraph margin-top-tiny">
                Our refurbished laptops are ideal for office work, online classes, business use, and everyday computing.
              </p>
            </div>

            {/* 2. Refurbished Desktop Computers */}
            <div className="offer-item">
              <h4 className="offer-title">
                Refurbished Desktop Computers
              </h4>
              <p className="about-paragraph">
                We also provide reliable desktop systems including:
              </p>
              <ul className="offer-list">
                <li>Dell Optiplex Desktops</li>
                <li>HP EliteDesk Series</li>
                <li>Lenovo ThinkCentre Systems</li>
              </ul>
              <p className="about-paragraph margin-top-tiny">
                These desktops are perfect for offices, educational institutes, call centers, and business setups.
              </p>
            </div>

            {/* 3. Workstation Computers */}
            <div className="offer-item">
              <h4 className="offer-title">
                Workstation Computers
              </h4>
              <p className="about-paragraph">
                For professionals who need high performance systems, we provide powerful workstation computers suitable for:
              </p>
              <ul className="offer-list">
                <li>Graphic Design</li>
                <li>Video Editing</li>
                <li>CAD / Engineering Software</li>
                <li>3D Rendering</li>
                <li>Professional Workloads</li>
              </ul>
            </div>

            {/* 4. Laptop Spare Parts & Components */}
            <div className="offer-item">
              <h4 className="offer-title">
                Laptop Spare Parts &amp; Components
              </h4>
              <p className="about-paragraph">
                Zaid Infotech also supplies genuine laptop parts and replacement components, including:
              </p>
              <ul className="offer-list">
                <li>Laptop SSD (Solid State Drives)</li>
                <li>Laptop RAM upgrades</li>
                <li>Laptop Screens / Display Panels</li>
                <li>Laptop Batteries</li>
                <li>Laptop Keyboards</li>
                <li>Laptop Body Panels</li>
                <li>Laptop Chargers</li>
              </ul>
              <p className="about-paragraph margin-top-tiny">
                All spare parts are carefully selected to ensure reliability and compatibility.
              </p>
            </div>

            {/* 5. Gaming PC Components */}
            <div className="offer-item">
              <h4 className="offer-title">
                Gaming PC Components
              </h4>
              <p className="about-paragraph">
                For gaming enthusiasts and PC builders, we also provide gaming hardware such as:
              </p>
              <ul className="offer-list">
                <li>Processors</li>
                <li>Gaming RAM</li>
                <li>Graphics Cards</li>
                <li>Gaming Cabinets</li>
                <li>SSD Storage</li>
                <li>Monitors</li>
                <li>Gaming Keyboard and Mouse</li>
              </ul>
            </div>
          </div>

          {/* --- WHY CHOOSE ZAID INFOTECH SECTION --- */}
          <div className="about-block gap-small">
            <h3 className="about-section-heading">
              Why Choose Zaid Infotech
            </h3>
            <p className="about-paragraph">
              Customers trust Zaid Infotech because we focus on quality, reliability, and customer satisfaction.
            </p>

            <ul className="why-choose-list">
              {[
                "Professionally Tested Refurbished Systems",
                "Genuine Laptop Spare Parts",
                "Affordable Prices",
                "1 Year Warranty on Selected Products",
                "Expert Technical Support",
                "Fast Delivery & Installation Assistance"
              ].map((item, index) => (
                <li key={index} className="why-choose-item">
                  <CheckCircle2 className="icon-orange" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="about-paragraph margin-top-small">
              Our goal is to provide long-lasting and reliable computing solutions for every customer.
            </p>
          </div>

          {/* --- SERVING CHENNAI AND BEYOND SECTION --- */}
          <div className="about-block gap-small">
            <h3 className="about-section-heading">
              Serving Chennai and Beyond
            </h3>
            <p className="about-paragraph">
              Zaid Infotech proudly serves customers across <strong className="text-highlight">Chennai and surrounding areas</strong>, especially in nearby business zones. We also support <strong className="text-highlight">online orders through our website</strong>, making it easier for customers to explore and purchase computer products online.
            </p>
            <p className="about-paragraph">
              Whether you need a <strong className="text-highlight">refurbished laptop, desktop computer, laptop upgrade parts, or gaming components</strong>, Zaid Infotech is committed to delivering <strong className="text-highlight">quality technology at the best value</strong>.
            </p>
          </div>

          {/* --- CONTACT ZAID INFOTECH SECTION --- */}
          <div className="contact-block">
            <h3 className="about-section-heading">
              Contact Zaid Infotech
            </h3>

            <div className="contact-details">
              {/* Address */}
              <div className="contact-item align-top">
                <MapPin className="icon-orange icon-top-adjust" />
                <span>
                  Shop No.232, 1st Floor, M.K.N Road, Alandur, Chennai, Tamil Nadu-600016
                </span>
              </div>

              {/* Phone */}
              <div className="contact-item align-center">
                <Phone className="icon-orange" />
                <a 
                  href="tel:+919092590725" 
                  className="contact-link"
                >
                  Phone / WhatsApp: +91 9092590725
                </a>
              </div>

              {/* Email */}
              <div className="contact-item align-center">
                <Mail className="icon-orange" />
                <a 
                  href="mailto:info@zaidinfotech.in" 
                  className="contact-link"
                >
                  Email: info@zaidinfotech.in
                </a>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;