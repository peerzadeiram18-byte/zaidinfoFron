import React from "react";
import "./AboutHeroSection.css";

const AboutHeroSection = () => {
  return (
    <>
      {/* INNER BANNER SECTION */}
      <section className="inn-ban">
        <img
          src="https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets-new/images/abt-ban-img.webp"
          alt="About Us"
          width="1400"
          height="425"
        />
        <div className="inn-cap">
          <div className="row2">
            <div className="inn-cap-txt">
              <div className="breadcrumb">
                <ul id="breadcrumbs">
                  <li>
                    <a href="https://www.laptopstoreindia.in" className="home">
                      Home
                    </a>
                  </li>
                  <li>About Us</li>
                </ul>
              </div>
              <h1>About Our Zaid Infotech</h1>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="trust-sec">
        <div className="row2">
          <ul>
            <li>
              <img
                src="https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets-new/images/quality-ico.svg"
                alt="Trusted for Quality"
                width="56"
                height="56"
              />
              <h3>Trusted for Quality.</h3>
            </li>
            <li>
              <img
                src="https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets-new/images/service-ico.svg"
                alt="Trusted for Service"
                width="56"
                height="56"
              />
              <h3>Trusted for Service.</h3>
            </li>
            <li>
              <img
                src="https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets-new/images/core-value-ico.svg"
                alt="Trusted for Value"
                width="56"
                height="56"
              />
              <h3>Trusted for Value.</h3>
            </li>
          </ul>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="abt-sec">
        <div className="row2">
          <div className="abt-lft">
            <h4>Who We are</h4>
            <h2>About Our Zaid Infotech</h2>
          </div>
          <div className="abt-rht">
            <h3>
              Zaid Infotech is a reliable laptop store offering a wide range of
              branded laptops and accessories for personal, professional, and
              business needs.
            </h3>
            <p>
              We focus on providing quality products at competitive prices with
              expert guidance to help customers choose the right device. Along
              with laptop sales, we offer basic setup and after-sales support
              to ensure a smooth and satisfying buying experience.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutHeroSection;