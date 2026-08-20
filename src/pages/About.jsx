// import React from "react";
// import "./About.css";
// import TopBar from "../components/TopBar/TopBar";
// import Header from "../components/Header/Header";
// import AboutSection from "../components/AboutSection/AboutSection";
// import AboutServices from "../components/AboutServices/AboutServices";
// import AdvantagesSection from "../components/AdvantageSection/AdvantageSection";
// import CTASection from "../components/CTASection/CTASection";
// import Footer from "../components/Footer/Footer";
// import AboutHeroSection from "../components/AboutHeroSection/AboutHeroSection"
// import KeyDifferentiators from "../components/KeyDifferentiator/KeyDifferentiators"
// import ServicePortfolio from "../components/ServicePortfolio/ServicePortfolio"

// const About = () => {
//   return (
//     <div className="about-page-wrapper">
//       {/* Header / Navigation */}
//       {/* <TopBar />
//       <Header /> */}

//       {/* Main Page Content */}
//       <main className="about-main-content">
//         {/* Main About Text & Image Section */}
//         <AboutHeroSection />

//         {/* Services List Section */}
//         <AboutServices />


//         <KeyDifferentiators/>

//         <ServicePortfolio/>

        

//         {/* Advantages Section */}
//         <AdvantagesSection />

//         {/* Call to Action Section */}
//         <CTASection />
//       </main>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// };

// export default About;




import React from "react";
// import TopBar from "../components/TopBar/TopBar";
// import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./About.css";

/* ---------- Inline icon components ---------- */

const IconLaptop = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="12" rx="1.5" />
    <path d="M2 19h20l-1.5 -3h-17z" />
    <line x1="9" y1="19" x2="15" y2="19" />
  </svg>
);

const IconSparkles = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6 -4.4L6 9l4.4 -1.6z" />
    <path d="M18 15l0.8 2.2L21 18l-2.2 0.8L18 21l-0.8 -2.2L15 18l2.2 -0.8z" />
  </svg>
);

const IconRecycle = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3l3 3l-3 3" />
    <path d="M15 6h-6a4 4 0 0 0 -4 4v1" />
    <path d="M7.5 21l-3 -3l3 -3" />
    <path d="M4.5 18h6a4 4 0 0 0 4 -4v-1" />
  </svg>
);

const IconHeadset = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 13a8 8 0 0 1 16 0" />
    <path d="M18 15v3a2 2 0 0 1 -2 2h-2" />
    <rect x="15" y="13" width="3" height="5" rx="1" />
    <rect x="3" y="13" width="3" height="5" rx="1" transform="rotate(180 4.5 15.5)" />
  </svg>
);

const IconShieldCheck = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3l7 3v6c0 4.5 -3 7.5 -7 9c-4 -1.5 -7 -4.5 -7 -9v-6z" />
    <path d="M9 12l2 2l4 -4" />
  </svg>
);

const IconAward = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="8" r="5" />
    <path d="M9 12.5l-1.5 6.5l4.5 -2l4.5 2l-1.5 -6.5" />
  </svg>
);

const IconCreditCard = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconFileInvoice = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 3h9l3 3v15h-12z" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="12" y2="16" />
  </svg>
);

const IconClock = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 15" />
  </svg>
);

const IconBolt = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="13 2 4 14 12 14 11 22 20 10 12 10 13 2" />
  </svg>
);

const IconDiscount = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="9" />
    <line x1="9" y1="15" x2="15" y2="9" />
    <circle cx="9.5" cy="9.5" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="14.5" r="0.7" fill="currentColor" stroke="none" />
  </svg>
);

/* ---------- Content data ---------- */

const services = [
  {
    icon: IconLaptop,
    title: "Laptop Sales",
    desc: "Wide range of laptops for students, professionals and businesses at competitive prices.",
  },
  {
    icon: IconSparkles,
    title: "New Laptops",
    desc: "Latest models from leading brands with full manufacturer warranty.",
  },
  {
    icon: IconRecycle,
    title: "Refurbished Laptops",
    desc: "Quality-tested, budget-friendly refurbished laptops with assured performance.",
  },
  {
    icon: IconHeadset,
    title: "Services & Support",
    desc: "Setup, software installation, upgrades and reliable after-sales support.",
  },
];

const advantages = [
  {
    icon: IconHeadset,
    title: "Best Support",
    desc: "Best technical support for our products.",
  },
  {
    icon: IconClock,
    title: "Time Saving",
    desc: "We value your time and respond promptly.",
  },
  {
    icon: IconBolt,
    title: "Quick Response",
    desc: "Good, honest and quick response.",
  },
  {
    icon: IconDiscount,
    title: "Great Offer",
    desc: "We offer great deals to our clients.",
  },
];

const journey = [
  { title: "15+ Years Ago", desc: "Started as a local laptop repair shop" },
  { title: "50,000+ Sold", desc: "Grew into a trusted laptop retailer" },
  { title: "18,000+ Repairs", desc: "Expanded into expert repair services" },
  { title: "Today", desc: "Laptops, rentals and repairs under one roof" },
];

/* ---------- Component ---------- */

export default function About() {
  return (
    <>
      {/* <TopBar />
      <Header /> */}
      <div className="about-page">
        {/* Hero */}
        <section className="about-hero">
          <div className="about-hero__grid">
            <div className="about-hero__content">
              <div className="about-breadcrumb">
                Home <span className="about-breadcrumb__sep">/</span>{" "}
                <span className="about-breadcrumb__active">About Us</span>
              </div>
              <span className="about-badge">Who We Are</span>
              <h1 className="about-hero__title">
                Engineering trust,
                <br />
                one laptop at a time.
              </h1>
              <p className="about-hero__subtitle">
                From new laptops to rentals and expert repairs, Zaid Infotech
                has been the tech partner people in Chennai count on.
              </p>
              <div className="about-hero__stats">
                <div className="about-hero__stat">
                  <span className="about-hero__stat-value">15+</span>
                  <span className="about-hero__stat-label">
                    Years in business
                  </span>
                </div>
                <div className="about-hero__stat">
                  <span className="about-hero__stat-value">50,000+</span>
                  <span className="about-hero__stat-label">Laptops sold</span>
                </div>
                <div className="about-hero__stat">
                  <span className="about-hero__stat-value">4.9/5</span>
                  <span className="about-hero__stat-label">Google rating</span>
                </div>
              </div>
            </div>

            <div className="about-hero__panel">
              <div className="about-hero__icon-circle">
                <IconLaptop className="about-icon about-icon--lg" />
              </div>
              <div className="about-hero__badges">
                <div className="about-hero__badge-item">
                  <IconShieldCheck className="about-icon about-icon--sm" />
                  <span>100% genuine</span>
                </div>
                <div className="about-hero__badge-item">
                  <IconAward className="about-icon about-icon--sm" />
                  <span>1 year warranty</span>
                </div>
                <div className="about-hero__badge-item">
                  <IconCreditCard className="about-icon about-icon--sm" />
                  <span>EMI available</span>
                </div>
                <div className="about-hero__badge-item">
                  <IconFileInvoice className="about-icon about-icon--sm" />
                  <span>GST invoice</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="about-story">
          <div className="about-story__container">
            <div className="about-story__header">
              <span className="about-eyebrow">Our Story</span>
              <h2 className="about-story__heading">About Zaid Infotech</h2>
              <div className="about-divider" />
            </div>

            <div className="about-story__content">
              <div className="about-story__text-col">
                <p className="about-story__lead">
                  Zaid Infotech is a reliable laptop store offering a wide range of
                  branded laptops and accessories for personal, professional, and business needs.
                </p>
                <p>
                  We focus on providing quality products at competitive prices with expert
                  guidance to help customers choose the right device, backed by setup and
                  after-sales support for a smooth buying experience.
                </p>
              </div>

              <div className="about-story__card">
                <div className="about-story__card-title">Our Commitment</div>
                <p className="about-story__card-text">
                  Delivering high-performance devices with genuine warranties and reliable repair services across Chennai.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="about-section">
          <h3 className="about-section__title about-section__title--center">
            What We Do
          </h3>
          <div className="about-divider about-divider--center" />
          <div className="about-cards-grid">
            {services.map(({ icon: Icon, title, desc }) => (
              <div className="about-card" key={title}>
                <div className="about-card__icon-circle">
                  <Icon className="about-icon about-icon--md" />
                </div>
                <h4 className="about-card__title">{title}</h4>
                <p className="about-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Advantages / Why We Are Best */}
        <section className="about-section about-section--muted">
          <div className="about-section__intro">
            <span className="about-eyebrow about-eyebrow--center">
              Advantages
            </span>
            <h3 className="about-section__title about-section__title--center">
              Why We Are Best
            </h3>
            <p className="about-section__subtitle">
              Zaid Infotech leads with genuine IT products, ensuring unmatched
              quality and reliability.
            </p>
          </div>
          <div className="about-advantages-grid">
            {advantages.map(({ icon: Icon, title, desc }) => (
              <div className="about-advantage-card" key={title}>
                <div className="about-advantage-card__icon-circle">
                  <Icon className="about-icon about-icon--lg" />
                </div>
                <h4 className="about-card__title">{title}</h4>
                <p className="about-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Journey */}
        <section className="about-section">
          <h3 className="about-section__title about-section__title--center">
            Our Journey
          </h3>
          <div className="about-divider about-divider--center" />
          <div className="about-journey-grid">
            {journey.map(({ title, desc }) => (
              <div className="about-journey-item" key={title}>
                <span className="about-journey-item__title">{title}</span>
                <span className="about-journey-item__desc">{desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <h3 className="about-cta__title">
            Ready to experience the difference?
          </h3>
          <p className="about-cta__subtitle">
            Buy, rent, or repair — all under one roof.
          </p>
          <div className="about-cta__actions">
            <a href="/shop" className="about-btn about-btn--primary">
              Shop Laptops
            </a>
            <a href="/repair" className="about-btn about-btn--outline">
              Book a Repair
            </a>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}