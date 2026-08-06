import React from "react";
import "./AboutServices.css";

const AboutServices = () => {
  return (
    <section className="abt-ser-sec">
      <div className="row2">
        <div className="abt-ser-pad">
          
          {/* LEFT LIST SECTION */}
          <div className="abt-ser-lft">
            <ul>
              <li>
                <strong>Laptop Sales:</strong> Wide range of laptops for students, professionals, and businesses at competitive prices.
              </li>
              <li>
                <strong>New Laptops:</strong> Latest models from leading brands with manufacturer warranty.
              </li>
              <li>
                <strong>Refurbished Laptops:</strong> Quality-tested, budget-friendly refurbished laptops with assured performance.
              </li>
              <li>
                <strong>Services &amp; Support:</strong> Laptop setup, software installation, upgrades, and reliable after-sales support.
              </li>
              <li>Enterprise-grade reliability</li>
              <li>Quick turnaround times</li>
              <li>OEM-compliant services</li>
              <li>Scalable service delivery model</li>
            </ul>
          </div>

          {/* RIGHT IMAGE SECTION */}
          <div className="abt-ser-rht">
            <div className="curve-arrow">
              <img
                src="https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets-new/images/arrow-shape.svg"
                alt="arrow"
                width="100"
                height="100"
              />
            </div>
            <div className="abt-ser-img">
              <img
                src="https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets-new/images/abt-serr-img.webp"
                alt="Service Support"
                width="300"
                height="500"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutServices;