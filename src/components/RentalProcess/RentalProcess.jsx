import React from 'react';
import './RentalProcess.css';

const RentalProcess = () => {
  return (
    <div className="kb-row-layout-wrap wp-block-kadence-rowlayout kb-row-layout-id6_b53826-bd">
      <div className="kt-row-column-wrap">
        
        {/* Left Column: Info & Call Button */}
        <div className="wp-block-kadence-column kadence-column6_f90978-0e">
          <div className="kt-inside-inner-col">
            
            {/* Info Box / Header */}
            <div className="wp-block-kadence-infobox kt-info-box6_b5c0b8-30">
              <div className="kt-blocks-info-box-link-wrap kt-blocks-info-box-media-align-left">
                <div className="kt-blocks-info-box-media">
                  <div className="kadence-info-box-image-inner-intrisic-container">
                    <div className="kadence-info-box-image-intrisic">
                      <img 
                        src="https://kickstartbiz.in/wp-content/uploads/2024/08/Customer-Care.webp" 
                        alt="Customer Care" 
                      />
                    </div>
                  </div>
                </div>
                <div className="kt-infobox-textcontent">
                  <h3 className="kt-blocks-info-box-title">How It Works:</h3>
                  <div className="kt-blocks-info-box-text">
                    <p>Quick, Simple, and Hassle-Free</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="rental-description-text">
              Rent laptops, desktops, MacBooks, and more for your business or personal needs. 
              Enjoy fast delivery, ongoing support, and easy returns anywhere in India.
            </p>

            {/* Call Now Button */}
            <div className="wp-block-kadence-advancedbtn kb-btns6_d131aa-df kb-buttons-wrap">
              <a 
                href="tel:+918080900888" 
                className="button kb-button kb-btn6_b004be-65 kb-btn-global-fill kt-btn-has-svg-true"
              >
                <span className="kb-svg-icon-wrap">
                  <svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
                    <path d="M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM94 416c-7.033 0-13.057-4.873-14.616-11.627l-14.998-65a15 15 0 0 1 8.707-17.16l69.998-29.999a15 15 0 0 1 17.518 4.289l30.997 37.885c48.944-22.963 88.297-62.858 110.781-110.78l-37.886-30.997a15.001 15.001 0 0 1-4.289-17.518l30-69.998a15 15 0 0 1 17.16-8.707l65 14.998A14.997 14.997 0 0 1 384 126c0 160.292-129.945 290-290 290z"></path>
                  </svg>
                </span>
                <span className="kt-btn-inner-text">8080900888</span>
              </a>
            </div>

          </div>
        </div>

        {/* Right Column: 4-Step Grid Layout */}
        <div className="wp-block-kadence-column kadence-column6_e6da6b-22">
          <div className="kt-inside-inner-col">
            <div className="kb-row-layout-wrap wp-block-kadence-rowlayout kb-row-layout-id6_aa7558-1e">
              <div className="kt-row-column-wrap">
                
                {/* Step 1 */}
                <div className="wp-block-kadence-column kadence-column6_14701a-e1">
                  <div className="kt-inside-inner-col">
                    <figure className="wp-block-image size-full">
                      <img 
                        src="https://rentopay.in/wp-content/uploads/2024/11/Explore.webp" 
                        alt="Browse Our Products" 
                      />
                    </figure>
                    <h3 className="wp-block-kadence-advancedheading kt-adv-heading6_e2a3fc-95">Browse Our Products</h3>
                    <p>Explore our wide range of laptops, desktops, MacBooks, and more to find the perfect match for your needs.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="wp-block-kadence-column kadence-column6_254ca4-a1">
                  <div className="kt-inside-inner-col">
                    <figure className="wp-block-image size-full">
                      <img 
                        src="https://rentopay.in/wp-content/uploads/2024/11/Quotation.webp" 
                        alt="Request a Quote" 
                      />
                    </figure>
                    <h3 className="wp-block-kadence-advancedheading kt-adv-heading6_cb0e04-64">Request a Quote</h3>
                    <p>Fill out our simple form, we will get back to you and we’ll provide a custom quote based on your requirements.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="wp-block-kadence-column kadence-column6_66f841-3b">
                  <div className="kt-inside-inner-col">
                    <figure className="wp-block-image size-full">
                      <img 
                        src="https://rentopay.in/wp-content/uploads/2024/11/Delivery.webp" 
                        alt="Fastest Delivery" 
                      />
                    </figure>
                    <h3 className="wp-block-kadence-advancedheading kt-adv-heading6_e04589-9e">Fastest Delivery</h3>
                    <p>Once you approve the quote, we’ll deliver the equipment right to your door step anywhere you are in India.</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="wp-block-kadence-column kadence-column6_458a2b-6e">
                  <div className="kt-inside-inner-col">
                    <figure className="wp-block-image size-full">
                      <img 
                        src="https://rentopay.in/wp-content/uploads/2024/11/Technical-Support.webp" 
                        alt="Ongoing Support" 
                      />
                    </figure>
                    <h3 className="wp-block-kadence-advancedheading kt-adv-heading6_994365-d7">Ongoing Support</h3>
                    <p>Our team is available 24/7 for any technical support or assistance you might need during your rental period.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RentalProcess;