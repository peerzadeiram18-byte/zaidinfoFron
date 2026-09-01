// import React, { useEffect, useState } from "react";
// import { getOffers } from "../../services/offerService";
// import "./HomeOffers.css";

// const HomeOffers = () => {
//   const [offers, setOffers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     loadOffers();
//   }, []);

//   // Total pages needed (1 card per page)
//   const totalPages = offers.length;

//   // Automatic sliding logic - ONLY runs if there are more than 1 offer (more than 1 page)
//   useEffect(() => {
//     if (totalPages <= 1) return;

//     const timer = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex >= totalPages - 1 ? 0 : prevIndex + 1));
//     }, 6000);

//     return () => clearInterval(timer);
//   }, [totalPages]);

//   const loadOffers = async () => {
//     try {
//       setLoading(true);
//       const response = await getOffers();

//      //image url 
//       console.log(response.data.offers[0].products[0].images[0].url)


      



//       const responseData = response?.data;
//       let offerData = [];

//       if (Array.isArray(responseData?.data)) {
//         offerData = responseData.data;
//       } else if (Array.isArray(responseData?.offers)) {
//         offerData = responseData.offers;
//       } else if (Array.isArray(responseData)) {
//         offerData = responseData;
//       }

     

//       // ==========================================
//       // FILTER OUT EXPIRED OFFERS
//       // Only keep offers whose endDate has not
//       // passed yet (still valid as of now)
//       // ==========================================

//       const now = new Date();

//       const validOffers = offerData.filter((offer) => {
//         if (!offer.endDate) return true;
//         return new Date(offer.endDate) >= now;
//       });

//       console.log("validOffers (expired removed) is displayed below")
//       console.log(validOffers)

//       setOffers(validOffers);
//     } catch (error) {
//       console.error("HOME OFFERS ERROR:", error);
//       setOffers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading || !offers || offers.length === 0) {
//     return null;
//   }

//   return (
//     <section className="home-offers-section">
//       <div className="home-offers-container">
//         {/* SECTION HEADING */}
//         <div className="home-offers-heading">
//           <span className="home-offers-label">⚡ SPECIAL OFFERS</span>
//           <h2>Don't Miss Our Deals</h2>
//           <p>Grab these limited-time deals before they expire.</p>
//         </div>

//         {/* SLIDER WRAPPER */}
//         <div className="home-offers-slider-wrapper">
//           <div
//             className="home-offers-track"
//             style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//           >
//             {offers.map((offer) => {
//               const product = offer.products?.[0];
//               const rawImageUrl = product?.images?.[0]?.url;

//               const imageUrl = rawImageUrl
//                 ? rawImageUrl.startsWith("http")
//                   ? rawImageUrl
//                   : `http://localhost:5000${rawImageUrl.startsWith("/") ? "" : "/"}${rawImageUrl}`
//                 : null;

//                 console.log("FINAL IMAGE URL:", imageUrl);
//               const originalPrice = product?.price || 0;
//               let finalPrice = originalPrice;
//               if (originalPrice && offer.discountValue) {
//                 if (offer.discountType === "PERCENTAGE") {
//                   finalPrice = Math.round(originalPrice * (1 - offer.discountValue / 100));
//                 } else {
//                   finalPrice = Math.max(0, originalPrice - offer.discountValue);
//                 }
//               }

//               return (
//                 <div className="home-offer-slide" key={offer._id || offer.id}>
//                   <div className="home-offer-card">
//                     {/* TOP BADGES */}
//                     <div className="offer-badge-header">
//                       <span className="offer-small-title">
//                         {offer.title || "LIMITED TIME"}
//                       </span>
//                       <span className="home-offer-badge">
//                         {offer.discountType === "PERCENTAGE"
//                           ? `${offer.discountValue}% OFF`
//                           : `₹${offer.discountValue} OFF`}
//                       </span>
//                     </div>

//                     {/* TRANSPARENT PNG CONTAINER */}
//                     <div className="home-offer-image-container">
//                       {imageUrl ? (
//                         <img
//                           src={imageUrl}
//                           alt={product?.name || offer.title}
//                           className="home-offer-image"
//                         />
//                       ) : (
//                         <div className="home-offer-icon">🎁</div>
//                       )}
//                     </div>

//                     {/* BOTTOM DETAILS */}
//                     <div className="home-offer-info">
//                       {product?.name && (
//                         <h3 className="offer-product-name">{product.name}</h3>
//                       )}

//                       {originalPrice > 0 && (
//                         <div className="offer-price-container">
//                           <span className="offer-original-price">
//                             ₹{originalPrice.toLocaleString("en-IN")}
//                           </span>
//                           <span className="offer-final-price">
//                             ₹{finalPrice.toLocaleString("en-IN")}*
//                           </span>
//                         </div>
//                       )}

//                       <p className="offer-subtext">*Inclusive of all Offers</p>

//                       <button className="home-offer-cta">View Deal →</button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* DOT INDICATORS - Only render if more than 1 page (more than 1 item) */}
//         {totalPages > 1 && (
//           <div className="home-offers-dots">
//             {Array.from({ length: totalPages }).map((_, idx) => (
//               <button
//                 key={idx}
//                 className={`home-offer-dot ${currentIndex === idx ? "active" : ""}`}
//                 onClick={() => setCurrentIndex(idx)}
//                 aria-label={`Go to slide ${idx + 1}`}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default HomeOffers;



import React, { useEffect, useState } from "react";
import { getOffers } from "../../services/offerService";
import "./HomeOffers.css";
import { useNavigate } from "react-router-dom";

const HomeOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // How many cards we WANT to show at once on desktop.
  // If offers.length is less than this, we just show them all,
  // centered, with no sliding.
  const slidesToShow = 3;

  useEffect(() => {
    loadOffers();
  }, []);

  // How many cards are actually visible right now (capped at slidesToShow)
  const visibleCount = Math.min(offers.length, slidesToShow) || 1;

  // Only enable sliding if we have MORE offers than we can show at once
  const shouldSlide = offers.length > slidesToShow;

  // Special case: exactly one offer gets a wider "hero" style card
  // instead of the small card floating alone with empty space around it
  const isSingleOffer = offers.length === 1;

  // Number of "pages" the slider can move through
  const totalPages = shouldSlide ? offers.length : 1;

  // Width (%) each slide should take up inside the track
  const slideWidthPercent = 100 / visibleCount;

  // Automatic sliding - ONLY runs if we actually need to slide
  useEffect(() => {
    if (!shouldSlide) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex >= totalPages - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(timer);
  }, [totalPages, shouldSlide]);

  // Reset index whenever the offer list changes size, so we never
  // get stuck on an index that no longer exists
  useEffect(() => {
    setCurrentIndex(0);
  }, [offers.length]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const response = await getOffers();

      const responseData = response?.data;
      let offerData = [];

      if (Array.isArray(responseData?.data)) {
        offerData = responseData.data;
      } else if (Array.isArray(responseData?.offers)) {
        offerData = responseData.offers;
      } else if (Array.isArray(responseData)) {
        offerData = responseData;
      }

      // ==========================================
      // FILTER OUT EXPIRED OFFERS
      // Only keep offers whose endDate has not
      // passed yet (still valid as of now)
      // ==========================================

      const now = new Date();

      const validOffers = offerData.filter((offer) => {
        if (!offer.endDate) return true;
        return new Date(offer.endDate) >= now;
      });

      setOffers(validOffers);
    } catch (error) {
      console.error("HOME OFFERS ERROR:", error);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !offers || offers.length === 0) {
    return null;
  }

  return (
    <section className="home-offers-section">
      <div className="home-offers-container">
        {/* SECTION HEADING */}
        <div className="home-offers-heading">
          <span className="home-offers-label">⚡ SPECIAL OFFERS</span>
          <h2>Don't Miss Our Deals</h2>
          <p>Grab these limited-time deals before they expire.</p>
        </div>

        {/* SLIDER WRAPPER */}
        <div className="home-offers-slider-wrapper">
          <div
            className={`home-offers-track ${!shouldSlide ? "is-static" : ""}`}
            style={{
              transform: shouldSlide
                ? `translateX(-${currentIndex * slideWidthPercent}%)`
                : "none",
            }}
          >
            {offers.map((offer) => {
              const product = offer.products?.[0];
              const rawImageUrl = product?.images?.[0]?.url;

              const imageUrl = rawImageUrl
                ? rawImageUrl.startsWith("http")
                  ? rawImageUrl
                  : `http://localhost:5000${
                      rawImageUrl.startsWith("/") ? "" : "/"
                    }${rawImageUrl}`
                : null;

              const originalPrice = product?.price || 0;
              let finalPrice = originalPrice;
              if (originalPrice && offer.discountValue) {
                if (offer.discountType === "PERCENTAGE") {
                  finalPrice = Math.round(
                    originalPrice * (1 - offer.discountValue / 100)
                  );
                } else {
                  finalPrice = Math.max(0, originalPrice - offer.discountValue);
                }
              }

              return (
                <div
                  className={`home-offer-slide ${
                    isSingleOffer ? "single-offer-slide" : ""
                  }`}
                  key={offer._id || offer.id}
                  style={{
                    // When sliding, each slide takes an exact % width.
                    // When static (few offers), let CSS flex-basis handle sizing
                    // so the cards just sit at their natural/max width, centered.
                    minWidth: shouldSlide ? `${slideWidthPercent}%` : undefined,
                    flex: shouldSlide
                      ? `0 0 ${slideWidthPercent}%`
                      : isSingleOffer
                      ? "0 1 820px"
                      : "0 1 460px",
                  }}
                >
                  <div
                    className={`home-offer-card ${
                      isSingleOffer ? "single-offer-card" : ""
                    }`}
                  >
                    {/* TOP BADGES */}
                    <div className="offer-badge-header">
                      <span className="offer-small-title">
                        {offer.title || "LIMITED TIME"}
                      </span>
                      <span className="home-offer-badge">
                        {offer.discountType === "PERCENTAGE"
                          ? `${offer.discountValue}% OFF`
                          : `₹${offer.discountValue} OFF`}
                      </span>
                    </div>

                    {/* TRANSPARENT PNG CONTAINER */}
                    <div className="home-offer-image-container">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product?.name || offer.title}
                          className="home-offer-image"
                        />
                      ) : (
                        <div className="home-offer-icon">🎁</div>
                      )}
                    </div>

                    {/* BOTTOM DETAILS */}
                    <div className="home-offer-info">
                      {product?.name && (
                        <h3 className="offer-product-name">{product.name}</h3>
                      )}

                      {originalPrice > 0 && (
                        <div className="offer-price-container">
                          <span className="offer-original-price">
                            ₹{originalPrice.toLocaleString("en-IN")}
                          </span>
                          <span className="offer-final-price">
                            ₹{finalPrice.toLocaleString("en-IN")}*
                          </span>
                        </div>
                      )}

                      <p className="offer-subtext">*Inclusive of all Offers</p>

                      <button
                        onClick={() => {
                          navigate("/shop");
                        }}
                        className="home-offer-cta"
                      >
                        View Deal →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DOT INDICATORS - Only when actually sliding */}
        {shouldSlide && (
          <div className="home-offers-dots">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                className={`home-offer-dot ${
                  currentIndex === idx ? "active" : ""
                }`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeOffers;