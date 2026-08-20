import React from "react";

// =====================================================
// LAYOUT
// =====================================================

import Footer from "../../components/Footer/Footer";
import WhatsAppWidget from "../../components/WhatsAppWidget/WhatsAppWidget";

// =====================================================
// SECTIONS
// =====================================================

import Hero from "../../components/Hero/Hero";
import ShopByPurpose from "../../components/ShopByPurpose/ShopByPurpose";
import ServicesSection from "../../components/ServeciesSection/ServiceSection";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import FeaturedLaptops from "../../components/FeaturedLaptops/FeaturedLaptops";
import CompanyVideo from "../../components/CompanyVedio/CompanyVedio";
import ReviewsSection from "../../components/ReviewsSection/ReviewsSection";
import Brands from "../../components/Brands/Brands";

// =====================================================
// OFFERS
// =====================================================

import HomeOffers from "../../components/HomeOffers/HomeOffers";


function Home() {

    return (

        <div className="min-h-screen bg-white dark:bg-slate-950">

            <main>

                {/* ================================
                    HERO
                ================================= */}

                <Hero />


                {/* ================================
                    ACTIVE OFFERS

                    PUBLIC OFFER SECTION

                    Login ho ya na ho,
                    active offer show hoga.
                ================================= */}

                <HomeOffers />


                {/* ================================
                    SHOP BY PURPOSE
                ================================= */}

                <ShopByPurpose />


                {/* ================================
                    SERVICES
                ================================= */}

                <ServicesSection />


                {/* ================================
                    WHY CHOOSE US
                ================================= */}

                <WhyChooseUs />


                {/* ================================
                    FEATURED PRODUCTS
                ================================= */}

                <FeaturedLaptops />


                {/* ================================
                    COMPANY VIDEO
                ================================= */}

                <CompanyVideo />


                {/* ================================
                    REVIEWS
                ================================= */}

                <ReviewsSection />


                {/* ================================
                    BRANDS
                ================================= */}

                <Brands />

            </main>


            {/* ================================
                WHATSAPP
            ================================= */}

            <WhatsAppWidget />


            {/* ================================
                FOOTER
            ================================= */}

            <Footer />

        </div>

    );

}


export default Home;