// import React, { useEffect, useState } from "react";
// import { getOffers } from "../../services/offerService";
// import "./HomeOffers.css";

// const HomeOffers = () => {

//   const [offers, setOffers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadOffers();
//   }, []);

//   const loadOffers = async () => {

//     try {

//       setLoading(true);

//       const response = await getOffers();

//       console.log("HOME OFFERS RESPONSE:", response);

//       const data = response?.data;

//       const offerData =
//         Array.isArray(data?.offers)
//           ? data.offers
//           : Array.isArray(data?.data)
//           ? data.data
//           : Array.isArray(data)
//           ? data
//           : [];

//       const now = new Date();

//       // ==========================================
//       // ONLY ACTIVE + CURRENT OFFERS
//       // ==========================================

//       const activeOffers = offerData.filter((offer) => {

//         if (offer.status !== "ACTIVE") {
//           return false;
//         }

//         if (!offer.startDate || !offer.endDate) {
//           return false;
//         }

//         const startDate = new Date(offer.startDate);
//         const endDate = new Date(offer.endDate);

//         return now >= startDate && now <= endDate;

//       });

//       setOffers(activeOffers);

//     } catch (error) {

//       console.error("HOME OFFERS ERROR:", error);

//       setOffers([]);

//     } finally {

//       setLoading(false);

//     }

//   };

//   // ==========================================
//   // LOADING
//   // ==========================================

//   if (loading) {
//     return null;
//   }

//   // ==========================================
//   // NO ACTIVE OFFER
//   // ==========================================

//   if (offers.length === 0) {
//     return null;
//   }

//   // ==========================================
//   // SHOW OFFERS
//   // ==========================================

//   return (
//     <section className="home-offers-section">

//       <div className="home-offers-container">

//         <div className="home-offers-heading">

//           <span className="home-offers-label">
//             SPECIAL OFFER
//           </span>

//           <h2>
//             Don't Miss Our Offers
//           </h2>

//           <p>
//             Grab these limited-time deals before they expire.
//           </p>

//         </div>

//         <div className="home-offers-grid">

//           {offers.map((offer) => (

//             <div
//               className="home-offer-card"
//               key={offer._id}
//             >

//               <div className="home-offer-content">

//                 <div className="home-offer-icon">
//                   🎁
//                 </div>

//                 <div>

//                   <h3>
//                     {offer.title || "Special Offer"}
//                   </h3>

//                   <p>
//                     Get{" "}
//                     <strong>
//                       {offer.discountType === "PERCENTAGE"
//                         ? `${offer.discountValue}% OFF`
//                         : `₹${offer.discountValue} OFF`}
//                     </strong>
//                   </p>

//                 </div>

//               </div>

//               <div className="home-offer-dates">

//                 <span>
//                   Valid until{" "}
//                   {new Date(
//                     offer.endDate
//                   ).toLocaleDateString("en-IN")}
//                 </span>

//               </div>

//             </div>

//           ))}

//         </div>

//       </div>

//     </section>
//   );
// };

// export default HomeOffers;
import React, {
    useEffect,
    useState
} from "react";

import {
    getActiveOffers
} from "../../services/offerService";

import "./HomeOffers.css";


const HomeOffers = () => {

    const [offers, setOffers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    // =====================================================
    // LOAD OFFERS
    // =====================================================

    useEffect(() => {

        loadOffers();

    }, []);


    const loadOffers = async () => {

        try {

            setLoading(true);

            const response =
                await getActiveOffers();


            console.log(
                "HOME ACTIVE OFFERS RESPONSE:",
                response?.data
            );


            const responseData =
                response?.data;


            let offerData = [];


            // API:
            // { success:true, data:[...] }

            if (
                Array.isArray(
                    responseData?.data
                )
            ) {

                offerData =
                    responseData.data;

            }


            // API:
            // { success:true, offers:[...] }

            else if (
                Array.isArray(
                    responseData?.offers
                )
            ) {

                offerData =
                    responseData.offers;

            }


            // API:
            // [...]

            else if (
                Array.isArray(
                    responseData
                )
            ) {

                offerData =
                    responseData;

            }


            console.log(
                "HOME OFFERS:",
                offerData
            );


            setOffers(
                offerData
            );


        } catch (error) {

            console.error(
                "HOME OFFERS ERROR:",
                error
            );

            console.error(
                "HOME OFFERS ERROR RESPONSE:",
                error?.response?.data
            );

            setOffers([]);


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return null;

    }


    // =====================================================
    // NO OFFER
    // =====================================================

    if (
        !offers ||
        offers.length === 0
    ) {

        return null;

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <section className="home-offers-section">

            <div className="home-offers-container">


                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="home-offers-heading">

                    <span className="home-offers-label">

                        SPECIAL OFFER

                    </span>


                    <h2>

                        Don't Miss Our Offers

                    </h2>


                    <p>

                        Grab these limited-time deals
                        before they expire.

                    </p>

                </div>


                {/* =========================================
                    OFFER GRID
                ========================================= */}

                <div className="home-offers-grid">

                    {offers.map(
                        (offer) => (

                            <div
                                className="home-offer-card"
                                key={offer._id}
                            >


                                <div className="home-offer-icon">

                                    🎁

                                </div>


                                <div className="home-offer-info">

                                    <span className="offer-small-title">

                                        LIMITED TIME

                                    </span>


                                    <h3>

                                        {
                                            offer.title ||
                                            "Special Offer"
                                        }

                                    </h3>


                                    <p>

                                        Get{" "}

                                        <strong>

                                            {
                                                offer.discountType ===
                                                "PERCENTAGE"

                                                    ? `${offer.discountValue}% OFF`

                                                    : `₹${offer.discountValue} OFF`
                                            }

                                        </strong>

                                    </p>


                                    <span className="home-offer-date">

                                        Valid until{" "}

                                        {
                                            offer.endDate
                                                ? new Date(
                                                    offer.endDate
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )
                                                : "-"
                                        }

                                    </span>

                                </div>


                                <div className="home-offer-badge">

                                    OFFER

                                </div>


                            </div>

                        )
                    )}

                </div>


            </div>

        </section>

    );

};


export default HomeOffers;