import React from "react";
import "./About.css";
import TopBar from "../components/TopBar/TopBar";
import Header from "../components/Header/Header";
import AboutSection from "../components/AboutSection/AboutSection";
import AboutServices from "../components/AboutServices/AboutServices";
import AdvantagesSection from "../components/AdvantageSection/AdvantageSection";
import CTASection from "../components/CTASection/CTASection";
import Footer from "../components/Footer/Footer";
import AboutHeroSection from "../components/AboutHeroSection/AboutHeroSection"
import KeyDifferentiators from "../components/KeyDifferentiator/KeyDifferentiators"
import ServicePortfolio from "../components/ServicePortfolio/ServicePortfolio"

const About = () => {
  return (
    <div className="about-page-wrapper">
      {/* Header / Navigation */}
      <TopBar />
      <Header />

      {/* Main Page Content */}
      <main className="about-main-content">
        {/* Main About Text & Image Section */}
        <AboutHeroSection />

        {/* Services List Section */}
        <AboutServices />


        <KeyDifferentiators/>

        <ServicePortfolio/>

        

        {/* Advantages Section */}
        <AdvantagesSection />

        {/* Call to Action Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;