// // import React, { useEffect, useState } from "react";
// // import { getOffers } from "../../services/offerService";
// // import "./HomeOffers.css";

// // const HomeOffers = () => {

// //   const [offers, setOffers] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     loadOffers();
// //   }, []);

// //   const loadOffers = async () => {

// //     try {

// //       setLoading(true);

// //       const response = await getOffers();

// //       console.log("HOME OFFERS RESPONSE:", response);

// //       const data = response?.data;

// //       const offerData =
// //         Array.isArray(data?.offers)
// //           ? data.offers
// //           : Array.isArray(data?.data)
// //           ? data.data
// //           : Array.isArray(data)
// //           ? data
// //           : [];

// //       const now = new Date();

// //       // ==========================================
// //       // ONLY ACTIVE + CURRENT OFFERS
// //       // ==========================================

// //       const activeOffers = offerData.filter((offer) => {

// //         if (offer.status !== "ACTIVE") {
// //           return false;
// //         }

// //         if (!offer.startDate || !offer.endDate) {
// //           return false;
// //         }

// //         const startDate = new Date(offer.startDate);
// //         const endDate = new Date(offer.endDate);

// //         return now >= startDate && now <= endDate;

// //       });

// //       setOffers(activeOffers);

// //     } catch (error) {

// //       console.error("HOME OFFERS ERROR:", error);

// //       setOffers([]);

// //     } finally {

// //       setLoading(false);

// //     }

// //   };

// //   // ==========================================
// //   // LOADING
// //   // ==========================================

// //   if (loading) {
// //     return null;
// //   }

// //   // ==========================================
// //   // NO ACTIVE OFFER
// //   // ==========================================

// //   if (offers.length === 0) {
// //     return null;
// //   }

// //   // ==========================================
// //   // SHOW OFFERS
// //   // ==========================================

// //   return (
// //     <section className="home-offers-section">

// //       <div className="home-offers-container">

// //         <div className="home-offers-heading">

// //           <span className="home-offers-label">
// //             SPECIAL OFFER
// //           </span>

// //           <h2>
// //             Don't Miss Our Offers
// //           </h2>

// //           <p>
// //             Grab these limited-time deals before they expire.
// //           </p>

// //         </div>

// //         <div className="home-offers-grid">

// //           {offers.map((offer) => (

// //             <div
// //               className="home-offer-card"
// //               key={offer._id}
// //             >

// //               <div className="home-offer-content">

// //                 <div className="home-offer-icon">
// //                   🎁
// //                 </div>

// //                 <div>

// //                   <h3>
// //                     {offer.title || "Special Offer"}
// //                   </h3>

// //                   <p>
// //                     Get{" "}
// //                     <strong>
// //                       {offer.discountType === "PERCENTAGE"
// //                         ? `${offer.discountValue}% OFF`
// //                         : `₹${offer.discountValue} OFF`}
// //                     </strong>
// //                   </p>

// //                 </div>

// //               </div>

// //               <div className="home-offer-dates">

// //                 <span>
// //                   Valid until{" "}
// //                   {new Date(
// //                     offer.endDate
// //                   ).toLocaleDateString("en-IN")}
// //                 </span>

// //               </div>

// //             </div>

// //           ))}

// //         </div>

// //       </div>

// //     </section>
// //   );
// // };

// // export default HomeOffers;
// import React, {
//     useEffect,
//     useState
// } from "react";

// import {
//     getActiveOffers
// } from "../../services/offerService";

// import "./HomeOffers.css";


// const HomeOffers = () => {

//     const [offers, setOffers] =
//         useState([]);

//     const [loading, setLoading] =
//         useState(true);


//     // =====================================================
//     // LOAD OFFERS
//     // =====================================================

//     useEffect(() => {

//         loadOffers();

//     }, []);


//     const loadOffers = async () => {

//         try {

//             setLoading(true);

//             const response =
//                 await getActiveOffers();


//             console.log(
//                 "HOME ACTIVE OFFERS RESPONSE:",
//                 response?.data
//             );


//             const responseData =
//                 response?.data;


//             let offerData = [];


//             // API:
//             // { success:true, data:[...] }

//             if (
//                 Array.isArray(
//                     responseData?.data
//                 )
//             ) {

//                 offerData =
//                     responseData.data;

//             }


//             // API:
//             // { success:true, offers:[...] }

//             else if (
//                 Array.isArray(
//                     responseData?.offers
//                 )
//             ) {

//                 offerData =
//                     responseData.offers;

//             }


//             // API:
//             // [...]

//             else if (
//                 Array.isArray(
//                     responseData
//                 )
//             ) {

//                 offerData =
//                     responseData;

//             }


//             console.log(
//                 "HOME OFFERS:",
//                 offerData
//             );


//             setOffers(
//                 offerData
//             );


//         } catch (error) {

//             console.error(
//                 "HOME OFFERS ERROR:",
//                 error
//             );

//             console.error(
//                 "HOME OFFERS ERROR RESPONSE:",
//                 error?.response?.data
//             );

//             setOffers([]);


//         } finally {

//             setLoading(false);

//         }

//     };


//     // =====================================================
//     // LOADING
//     // =====================================================

//     if (loading) {

//         return null;

//     }


//     // =====================================================
//     // NO OFFER
//     // =====================================================

//     if (
//         !offers ||
//         offers.length === 0
//     ) {

//         return null;

//     }


//     // =====================================================
//     // UI
//     // =====================================================

//     return (

//         <section className="home-offers-section">

//             <div className="home-offers-container">


//                 {/* =========================================
//                     HEADER
//                 ========================================= */}

//                 <div className="home-offers-heading">

//                     <span className="home-offers-label">

//                         SPECIAL OFFER

//                     </span>


//                     <h2>

//                         Don't Miss Our Offers

//                     </h2>


//                     <p>

//                         Grab these limited-time deals
//                         before they expire.

//                     </p>

//                 </div>


//                 {/* =========================================
//                     OFFER GRID
//                 ========================================= */}

//                 <div className="home-offers-grid">

//                     {offers.map(
//                         (offer) => (

//                             <div
//                                 className="home-offer-card"
//                                 key={offer._id}
//                             >


//                                 <div className="home-offer-icon">

//                                     🎁

//                                 </div>


//                                 <div className="home-offer-info">

//                                     <span className="offer-small-title">

//                                         LIMITED TIME

//                                     </span>


//                                     <h3>

//                                         {
//                                             offer.title ||
//                                             "Special Offer"
//                                         }

//                                     </h3>


//                                     <p>

//                                         Get{" "}

//                                         <strong>

//                                             {
//                                                 offer.discountType ===
//                                                 "PERCENTAGE"

//                                                     ? `${offer.discountValue}% OFF`

//                                                     : `₹${offer.discountValue} OFF`
//                                             }

//                                         </strong>

//                                     </p>


//                                     <span className="home-offer-date">

//                                         Valid until{" "}

//                                         {
//                                             offer.endDate
//                                                 ? new Date(
//                                                     offer.endDate
//                                                 ).toLocaleDateString(
//                                                     "en-IN"
//                                                 )
//                                                 : "-"
//                                         }

//                                     </span>

//                                 </div>


//                                 <div className="home-offer-badge">

//                                     OFFER

//                                 </div>


//                             </div>

//                         )
//                     )}

//                 </div>


//             </div>

//         </section>

//     );

// };


// export default HomeOffers;


import React, { useEffect, useState } from "react";
import { getOffers } from "../../services/offerService";
import "./HomeOffers.css";

const HomeOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadOffers();
  }, []);

  // Total pages needed (1 card per page)
  const totalPages = offers.length;

  // Automatic sliding logic - ONLY runs if there are more than 1 offer (more than 1 page)
  useEffect(() => {
    if (totalPages <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex >= totalPages - 1 ? 0 : prevIndex + 1));
    }, 6000);

    return () => clearInterval(timer);
  }, [totalPages]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const response = await getOffers();

     //image url 
      console.log(response.data.offers[0].products[0].images[0].url)


      



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

      console.log("validOffers (expired removed) is displayed below")
      console.log(validOffers)

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
            className="home-offers-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {offers.map((offer) => {
              const product = offer.products?.[0];
              const rawImageUrl = product?.images?.[0]?.url;

              const imageUrl = rawImageUrl
                ? rawImageUrl.startsWith("http")
                  ? rawImageUrl
                  : `http://localhost:5000${rawImageUrl.startsWith("/") ? "" : "/"}${rawImageUrl}`
                : null;

                console.log("FINAL IMAGE URL:", imageUrl);
              const originalPrice = product?.price || 0;
              let finalPrice = originalPrice;
              if (originalPrice && offer.discountValue) {
                if (offer.discountType === "PERCENTAGE") {
                  finalPrice = Math.round(originalPrice * (1 - offer.discountValue / 100));
                } else {
                  finalPrice = Math.max(0, originalPrice - offer.discountValue);
                }
              }

              return (
                <div className="home-offer-slide" key={offer._id || offer.id}>
                  <div className="home-offer-card">
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

                      <button className="home-offer-cta">View Deal →</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DOT INDICATORS - Only render if more than 1 page (more than 1 item) */}
        {totalPages > 1 && (
          <div className="home-offers-dots">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                className={`home-offer-dot ${currentIndex === idx ? "active" : ""}`}
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