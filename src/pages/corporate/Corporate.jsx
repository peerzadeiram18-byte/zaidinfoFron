import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  FileText,
  BadgeCheck,
  Headset,
  Wallet,
  ArrowRight,
  ClipboardCheck,
  ThumbsUp,
  PackageCheck,
} from "lucide-react";

import Footer from "../../components/Footer/Footer";

import "./Corporate.css";

const benefits = [
  {
    icon: Wallet,
    title: "Wholesale Pricing",
    desc: "Get special bulk pricing tailored for business orders.",
  },
  {
    icon: FileText,
    title: "GST Invoicing",
    desc: "Receive proper GST invoices for all your purchases.",
  },
  {
    icon: Headset,
    title: "Dedicated Support",
    desc: "A dedicated point of contact for your business needs.",
  },
  {
    icon: BadgeCheck,
    title: "Flexible Payment Terms",
    desc: "Custom payment terms for approved business accounts.",
  },
];

const steps = [
  {
    icon: Building2,
    title: "Browse & Request Quote",
    desc: "Pick the laptops you need and click Request Quote.",
  },
  {
    icon: ClipboardCheck,
    title: "We Review & Respond",
    desc: "Our team reviews your proposed price and quantity.",
  },
  {
    icon: ThumbsUp,
    title: "You Approve & Order",
    desc: "Once approved, place your order from your dashboard.",
  },
  {
    icon: PackageCheck,
    title: "Fast Business Delivery",
    desc: "Get your bulk order delivered with GST invoicing.",
  },
];

const isBusinessCustomer = () => {
  try {
    const userData = localStorage.getItem("user");
    if (!userData) return false;
    const user = JSON.parse(userData);
    return (
      String(user?.role).toUpperCase() === "CUSTOMER" &&
      String(user?.customerType).toUpperCase() === "BUSINESS"
    );
  } catch {
    return false;
  }
};

const isLoggedIn = () => Boolean(localStorage.getItem("token"));

const Corporate = () => {
  const navigate = useNavigate();

  const handlePrimaryCta = () => {
    if (isLoggedIn() && isBusinessCustomer()) {
      navigate("/corporate-dashboard");
    } else {
      navigate("/register");
    }
  };

  const primaryCtaLabel =
    isLoggedIn() && isBusinessCustomer()
      ? "Go to Dashboard"
      : "Register as Business Customer";

  return (
    <div className="corp-page">
      <main className="corp-main">

        {/* ================= HERO ================= */}
        <section className="corp-hero">
          <div className="corp-hero-bg" />

          <div className="corp-container corp-hero-inner">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="corp-hero-eyebrow"
            >
              Solutions For Business
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="corp-hero-title"
            >
              Bulk Laptop Procurement.{" "}
              <span className="corp-hero-title-accent">
                Built For Your Business.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="corp-hero-desc"
            >
              Partner with Zaid Infotech for wholesale pricing, GST
              invoicing, and dedicated support on every bulk order —
              with a simple quote-based buying process built just for
              businesses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="corp-hero-actions"
            >
              <button onClick={handlePrimaryCta} className="corp-btn corp-btn-primary">
                {primaryCtaLabel}
                <ArrowRight className="corp-icon-sm" />
              </button>

              <button onClick={() => navigate("/contact")} className="corp-btn corp-btn-outline">
                Talk to Sales
              </button>
            </motion.div>

            {/* trust strip */}
            <div className="corp-trust-strip">
              <span className="corp-trust-item">
                <Wallet className="corp-icon-sm corp-icon-accent" />
                Wholesale Pricing
              </span>
              <span className="corp-trust-item">
                <FileText className="corp-icon-sm corp-icon-accent" />
                GST Invoicing
              </span>
              <span className="corp-trust-item">
                <Headset className="corp-icon-sm corp-icon-accent" />
                Dedicated Support
              </span>
              <span className="corp-trust-item">
                <BadgeCheck className="corp-icon-sm corp-icon-accent" />
                Flexible Terms
              </span>
            </div>
          </div>
        </section>

        {/* ================= WHY BUY FROM US ================= */}
        <section className="corp-container corp-section">
          <div className="corp-section-heading-wrap">
            <motion.h2
              initial={{ opacity: 0.6, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="corp-section-heading"
            >
              Why Businesses Choose Zaid Infotech
            </motion.h2>
          </div>

          <div className="corp-benefits-grid">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="corp-benefit-card">
                <div className="corp-benefit-icon-circle">
                  <Icon className="corp-icon-md corp-icon-accent" />
                </div>
                <h3 className="corp-benefit-title">{title}</h3>
                <p className="corp-benefit-desc">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="corp-how-section">
          <div className="corp-container">
            <div className="corp-section-heading-wrap corp-how-heading-wrap">
              <motion.h2
                initial={{ opacity: 0.6, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="corp-section-heading"
              >
                How The Quote Process Works
              </motion.h2>
            </div>

            <div className="corp-steps-grid">
              {steps.map(({ icon: Icon, title, desc }, index) => (
                <div key={title} className="corp-step">
                  <div className="corp-step-number">{index + 1}</div>

                  <Icon className="corp-icon-md corp-icon-accent corp-step-icon" />

                  <h3 className="corp-step-title">{title}</h3>

                  <p className="corp-step-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA CARD ================= */}
        <section className="corp-container corp-section">
          <div className="corp-cta-card">
            <div className="corp-cta-card-bg" />

            <div className="corp-cta-inner">
              <div>
                <h3 className="corp-cta-title">Ready to get started?</h3>
                <p className="corp-cta-desc">
                  Register your business with Zaid Infotech today and
                  start requesting quotes on bulk laptop orders.
                </p>
              </div>

              <button onClick={handlePrimaryCta} className="corp-btn corp-btn-primary corp-cta-btn">
                {primaryCtaLabel}
                <ArrowRight className="corp-icon-sm" />
              </button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Corporate;