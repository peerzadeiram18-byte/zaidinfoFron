import React, { useState } from 'react';
import './ServicePortfolio.css';

const portfolioData = [
  {
    id: '01',
    title: 'Laptop Repair & Maintenance',
    icon: 'https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets-new/images/service-ico-1.svg',
    items: [
      'Advanced diagnostics and hardware repairs',
      'System optimization & BIOS troubleshooting',
      'Preventive maintenance services',
    ],
  },
  {
    id: '02',
    title: 'Enterprise Spare Parts Supply',
    icon: 'https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets-new/images/service-ico-2.svg',
    items: [
      'Verified OEM and certified refurbished components',
      'Bulk parts procurement and logistics management',
    ],
  },
  {
    id: '03',
    title: 'Component Replacement & Upgrades',
    icon: 'https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets-new/images/service-ico-3.svg',
    items: [
      'Keyboard, screen, motherboard, and adapter replacement',
      'RAM, SSD, and internal component upgrades',
      'Thermal and fan servicing for performance optimization',
    ],
  },
  {
    id: '04',
    title: 'Annual Maintenance Contracts (AMC)',
    icon: 'https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets-new/images/service-ico-4.svg',
    items: [
      'Customizable SLAs with committed response times',
      'On-site engineers and centralized ticketing support',
    ],
  },
  {
    id: '05',
    title: 'Priority Corporate Support',
    icon: 'https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets-new/images/service-ico-5.svg',
    items: [
      'Same-day diagnosis and resolution for critical devices',
      'Device pickup, delivery, and inventory tracking',
    ],
  },
];

export default function ServicePortfolio() {
  const [activeId, setActiveId] = useState('01');

  const toggleAccordion = (id) => {
    setActiveId((prevId) => (prevId === id ? null : id));
  };

  return (
    <section className="portfolio-sec">
      <div className="row2">
        <div className="portfolio-pad">
          {/* Left Column */}
          <div className="portfolio-lft">
            <h4>Zaid Infotech</h4>
            <h2>Our Service Portfolio</h2>
            <p>
              Specialized B2B/B2C laptop services supporting enterprise IT
              infrastructure across India
            </p>
            <img
              src="https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets-new/images/abt-portfolio-img.webp"
              alt="Laptop Store Portfolio"
              width="300"
              height="200"
            />
          </div>

          {/* Right Accordion Column */}
          <div className="portfolio-rht">
            <div className="acc-pad">
              {portfolioData.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`acc-li ${isActive ? 'active' : ''}`}
                  >
                    <div
                      className="acc-head"
                      onClick={() => toggleAccordion(item.id)}
                    >
                      <img
                        src={item.icon}
                        alt={item.title}
                        width="45"
                        height="45"
                      />
                      <h3>
                        {item.title} <span>{item.id}</span>
                      </h3>
                    </div>

                    {isActive && (
                      <div className="acc-cont" style={{ display: 'block' }}>
                        <ul>
                          {item.items.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}