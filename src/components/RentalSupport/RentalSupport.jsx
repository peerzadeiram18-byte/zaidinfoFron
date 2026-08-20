import React from 'react';
import './RentalSupport.css';

const RentalSupport = () => {
  const industries = [
    {
      id: 'it-tech',
      title: 'IT & Tech Companies',
      image: 'https://rentopay.in/wp-content/uploads/2024/11/Interior-designer-using-a-laptop-and-reviewing-color-palettes-showcasing-the-convenience-of-Rentopays-laptop-rental-service-for-creative-professionals.webp',
      alt: "Interior designer using a laptop and reviewing color palettes, showcasing the convenience of Zaid Infotech's laptop rental service for creative professionals.",
      description: 'Setting up a temporary office? Need high-performance computers for a short-term or long-term project? Zaid Infotech’s flexible solutions help IT and tech companies manage their equipment needs without the high costs of purchasing.'
    },
    {
      id: 'startups',
      title: 'Startups & Entrepreneurs',
      image: 'https://rentopay.in/wp-content/uploads/2024/11/Rentopay-customer-relaxing-with-a-laptop-demonstrating-the-comfort-and-ease-of-using-Rentopays-laptop-rental-service-for-personal-or-professional-needs.webp',
      alt: "Zaid Infotech customer relaxing with a laptop, demonstrating the comfort and ease of using Zaid Infotech's laptop rental service for personal or professional needs.",
      description: 'As a startup, you need to save costs and stay flexible. Renting your tech allows you to scale up or down quickly, depending on your business needs. Zaid Infotech provides affordable rentals so you can focus on growing your company.'
    },
    {
      id: 'gaming',
      title: 'Gaming Industry',
      image: 'https://rentopay.in/wp-content/uploads/2024/11/Excited-Rentopay-customer-celebrating-while-holding-a-laptop-highlighting-the-joy-of-using-Rentopays-laptop-rental-services.webp',
      alt: 'Excited Zaid Infotech customer celebrating while holding a laptop, highlighting the joy of using Zaid Infotech’s laptop rental services.',
      description: 'Professional gamers and gaming events demand cutting-edge technology. We offer wide range of gaming laptops, desktops, and monitors with high-performance specifications to meet the demands of intense gaming sessions.'
    },
    {
      id: 'events',
      title: 'Event Organizers',
      image: 'https://rentopay.in/wp-content/uploads/2024/11/Stylish-Rentopay-customer-holding-a-laptop-and-flashing-a-peace-sign-highlighting-the-fun-and-satisfaction-of-renting-laptops-from-Rentopay.webp',
      alt: 'Stylish Zaid Infotech customer holding a laptop and flashing a peace sign, highlighting the fun and satisfaction of renting laptops from Zaid Infotech.',
      description: 'Whether you’re hosting a corporate conference or a trade show, Zaid Infotech provides tech rentals for events of all sizes. From laptops for registration desks to desktops for interactive exhibits, we ensure smooth operations at your event.'
    },
    {
      id: 'education',
      title: 'Education Sector',
      image: 'https://rentopay.in/wp-content/uploads/2024/11/Group-of-diverse-individuals-using-various-devices-including-a-laptop-and-tablet-while-showcasing-Rentopays-laptop-rental-services.webp',
      alt: 'Group of diverse individuals using various devices, including a laptop and tablet, while showcasing Zaid Infotech’s laptop rental services.',
      description: 'With the rise of digital learning, schools and universities need reliable, cost-effective technology. Zaid Infotech offers affordable rental solutions for educational institutions, helping students and teachers access the devices they need.'
    },
    {
      id: 'freelancers',
      title: 'Freelancers',
      image: 'https://rentopay.in/wp-content/uploads/2024/11/Rentopay-customer-relaxing-on-a-yellow-sofa-with-a-laptop-demonstrating-the-comfort-and-convenience-of-Rentopays-laptop-rental-services.webp',
      alt: "Zaid Infotech customer relaxing on a yellow sofa with a laptop, demonstrating the comfort and convenience of Zaid Infotech's laptop rental services.",
      description: 'Whether you’re working on a short-term project or need top-quality equipment, we offer flexible rental plans for freelancers. Get the tools you need without the long-term commitment, so you can focus on delivering your best work with ease.'
    }
  ];

  return (
    <div className="kb-row-layout-wrap kb-row-layout-id6_7ad194-ab alignnone has-theme-palette8-background-color kt-row-has-bg wp-block-kadence-rowlayout">
      <div className="kt-row-column-wrap kt-has-1-columns kt-row-layout-equal kt-tab-layout-inherit kt-mobile-layout-row kt-row-valign-top kb-theme-content-width">
        <div className="wp-block-kadence-column kadence-column6_338b88-d6">
          <div className="kt-inside-inner-col">
            
            {/* Header Section */}
            <div className="kt-adv-heading6_7799ba-32 wp-block-kadence-advancedheading has-theme-palette-5-color has-text-color">
              Industries We Serve
            </div>

            <h2 className="kt-adv-heading6_915775-13 wp-block-kadence-advancedheading">
              Zaid Infotech: The Solution for IT Companies, Startups, Gamers, and More
            </h2>

            <p className="kt-adv-heading6_70934a-c4 wp-block-kadence-advancedheading">
              At Zaid Infotech, we understand that different industries have different requirements. That’s why we offer tailored rental solutions for a variety of sectors.
            </p>

            {/* Divider Spacer */}
            <div className="wp-block-kadence-spacer aligncenter kt-block-spacer-6_8e452b-ca">
              <div className="kt-block-spacer kt-block-spacer-halign-center">
                <hr className="kt-divider" />
              </div>
            </div>

            {/* Grid Layout Cards */}
            <div className="industry-cards-grid">
              {industries.map((item) => (
                <div key={item.id} className="industry-card-wrapper">
                  <div className="kt-inside-inner-col">
                    <div className="wp-block-uagb-image wp-block-uagb-image--effect-zoomin">
                      <figure className="wp-block-uagb-image__figure">
                        <img 
                          src={item.image} 
                          alt={item.alt} 
                          loading="lazy" 
                        />
                      </figure>
                    </div>
                    <div className="industry-card-content">
                      <h3 className="wp-block-kadence-advancedheading">{item.title}</h3>
                      <p className="has-text-align-center wp-block-paragraph">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalSupport;