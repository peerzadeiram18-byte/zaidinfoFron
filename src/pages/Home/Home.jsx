// // import "./Home.css";

// // import TopBar from "../../components/TopBar/TopBar";
// // import Header from "../../components/Header/Header";
// // import Hero from "../../components/Hero/Hero";
// // import Footer from "../../components/Footer/Footer";

// // function Home() {
// //   return (
// //     <>
// //       <TopBar />
// //       <Header />

// //       <Hero />

// //       <Footer />
// //     </>
// //   );
// // }

// // export default Home;

// import React from "react";

// // Import layout components
// import TopBar from "../../components/TopBar/TopBar"
// import Header from "../../components/Header/Header";
// import Footer from "../../components/Footer/Footer";

// // Import section components
// import Hero from "../../components/Hero/Hero";
// import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
// import Features from "../../components/Features/Features";
// import Brands from "../../components/Brands/Brands";
// import LaptopCategories from "../../components/LaptopCategories/LaptopCategories";
// import Testimonials from "../../components/Testimonials/Testmonials";
// // import ShopByPurpose from "../../components/Shopbypurpose/Shopbypurpose";
// import ShopByPurpose from "../../components/ShopByPurpose/ShopByPurpose";
// import ServicesSection from "../../components/ServeciesSection/ServiceSection";
// import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
// import FeaturedLaptops from "../../components/FeaturedLaptops/FeaturedLaptops";
// import ReviewsSection from "../../components/ReviewsSection/ReviewsSection";
// import CompanyVideo from "../../components/CompanyVedio/CompanyVedio";

// function Home() {
//   return (
//     <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
//       <TopBar />
//       <Header />

//       <main>
//         <Hero />
//         <ShopByPurpose />
//         <ServicesSection />
//         <WhyChooseUs />
//         <FeaturedLaptops />
//         <CompanyVideo />
//         <ReviewsSection />
//         <Brands />




//       </main>

//       <Footer />
//     </div>
//   );
// }

// export default Home;


import React from "react";

// Layout
import TopBar from "../../components/TopBar/TopBar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import WhatsAppWidget from "../../components/WhatsAppWidget/WhatsAppWidget";

// Sections
import Hero from "../../components/Hero/Hero";
import ShopByPurpose from "../../components/ShopByPurpose/ShopByPurpose";
import ServicesSection from "../../components/ServeciesSection/ServiceSection";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import FeaturedLaptops from "../../components/FeaturedLaptops/FeaturedLaptops";
import CompanyVideo from "../../components/CompanyVedio/CompanyVedio";
import ReviewsSection from "../../components/ReviewsSection/ReviewsSection";
import Brands from "../../components/Brands/Brands";

function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <TopBar />
      <Header />

      <main>
        <Hero />
        <ShopByPurpose />
        <ServicesSection />
        <WhyChooseUs />
        <FeaturedLaptops />
        <CompanyVideo />
        <ReviewsSection />
        <Brands />
      </main>

      <WhatsAppWidget />

      <Footer />
    </div>
  );
}

export default Home;