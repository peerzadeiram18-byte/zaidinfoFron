import { FaWhatsapp } from "react-icons/fa";

import "./Corporatequotes.css";

// =====================================================
// WHATSAPP LINK
// Change the phone number or the message here.
// =====================================================

const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=919876543210&text=Hi+Zaid+Infotech%2C+I+have+a+query%21&type=phone_number&app_absent=0";

// =====================================================
// PAGE
// =====================================================

export default function CorporateQuotes() {
  return (
    <div className="corpq-page">
      <div className="corpq-header">
        <div>
          <h1>Quotes</h1>
          <p>Get a bulk price for your company's laptop order</p>
        </div>

        <a
          className="corpq-button"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp />
          Request a quote
        </a>
      </div>

      <div className="corpq-card">
        <h3>How it works</h3>
        <p>
          Tell us which laptops you need and how many. Our team will reply on
          WhatsApp with a price for your company.
        </p>
      </div>
    </div>
  );
}
