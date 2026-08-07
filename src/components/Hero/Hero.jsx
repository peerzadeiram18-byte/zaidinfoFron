// import "./Hero.css";

// import heroImage from "../../assets/images/hero.png";

// function Hero() {
//   return (
//     <section className="hero">

//       <div className="hero-left">

//         <h1>
//           ZAID <br />
//           <span>INFOTECH</span>
//         </h1>

//         <p>
//           Certified premium refurbished laptops from top brands.
//           Trusted, Tested, Delivered and Priced to save your money.
//         </p>

//         <div className="hero-buttons">

//           <button className="shop-btn">
//             Shop Now
//           </button>

//           <button className="service-btn">
//             Book Service
//           </button>

//         </div>

//       </div>

//       <div className="hero-right">
// <img
//   src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"
//   alt="Laptop"
//   width="500"
// />
//       </div>

//     </section>
//   );
// }

// export default Hero;
import React, { useState } from "react";
import {
  Award,
  ArrowRight,
  CreditCard,
  Laptop,
  Receipt,
  Search,
  ShieldCheck,
  MessageCircle,
  CheckCircle2,
  Clock,
  Star,
  Truck,
  Wrench,
  X,
} from "lucide-react";

import bgImage from "../../assets/images/blank1.jpg";
import { useNavigate } from "react-router-dom";
export default function Hero() {

  const navigate = useNavigate();

  const [invoiceId, setInvoiceId] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!invoiceId.trim()) return;

    setIsSearching(true);

    setTimeout(() => {
      setTrackingResult({
        id: invoiceId.toUpperCase(),
        status: "In Progress",
        device: "HP EliteBook 840 G9",
        technician: "Rajesh Kumar",
        estimatedCompletion: "Today • 5:30 PM",
      });
      setIsSearching(false);
    }, 800);
  };

  const closeTrackingModal = () => {
    setTrackingResult(null);
  };

  return (
    <div className="w-full">

      {/* ================= HERO SECTION ================= */}

      <section className="relative h-auto min-h-[500px] lg:h-[520px] flex flex-col justify-between bg-[#060b11]">

        {/* Background photo positioned to frame laptop in middle */}
        <img
          src={bgImage}
          alt="Hero Background"
          className="absolute inset-0 h-full w-full object-cover object-center lg:object-[35%_center]"
        />

        {/* Gradient overlays tuned for high visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"></div>

        {/* Content Container */}
        <div className="relative z-20 w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col justify-center">

          {/* ================= HERO CONTENT ================= */}

          <div className="grid items-center gap-8 lg:grid-cols-12 my-auto">

            {/* LEFT COLUMN: Text Copy */}
            <div className="lg:col-span-7 z-10 max-w-xl">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-300/90 mb-3">
                YOUR TRUSTED PARTNER FOR
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.2] text-white tracking-normal">
                Laptops. Rentals. Repairs.
                <span className="mt-1 block text-emerald-400 font-extrabold">
                  All Under One Roof.
                </span>
              </h1>

              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-gray-300 max-w-lg">
                Buy new & certified refurbished laptops, rent for short or long term, or get expert repairs with warranty.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
  onClick={() => navigate("/shop")}
  className="flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-xs font-bold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
>
  Shop Laptops
  <ArrowRight size={15} />
</button>

                <button className="flex h-10 items-center justify-center rounded-xl border border-white/25 bg-black/20 px-5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-[0.98]">
                  Rent Now
                </button>

                <button className="flex h-10 items-center justify-center rounded-xl bg-white px-5 text-xs font-semibold text-gray-900 transition-all hover:bg-gray-100 active:scale-[0.98]">
                  Book a Repair
                </button>
              </div>

              {/* Feature Tags */}
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-medium text-gray-300/90">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                  100% Genuine Products
                </div>
                <div className="flex items-center gap-1.5">
                  <Award size={15} className="text-emerald-400 shrink-0" />
                  1 Year Warranty
                </div>
                <div className="flex items-center gap-1.5">
                  <CreditCard size={15} className="text-emerald-400 shrink-0" />
                  EMI Available
                </div>
                <div className="flex items-center gap-1.5">
                  <Receipt size={15} className="text-emerald-400 shrink-0" />
                  GST Invoice
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Track Repair Card */}
            <div className="relative z-30 flex justify-start lg:justify-end lg:col-span-5">

              <div className="w-full max-w-[270px] sm:max-w-[280px] rounded-2xl border border-white/15 bg-[#0a111a]/85 backdrop-blur-md p-5 shadow-2xl shadow-black/50">

                <h3 className="text-xs font-bold tracking-wider text-white uppercase">
                  TRACK YOUR REPAIR
                </h3>

                <p className="mt-1 text-[11px] text-gray-400 leading-normal">
                  Get real-time updates of your repair status
                </p>

                <form onSubmit={handleTrackSubmit} className="mt-4 space-y-3">
                  <input
                    type="text"
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
                    placeholder="Enter Job/Invoice ID"
                    className="h-9 w-full rounded-lg bg-white px-3.5 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 font-medium"
                  />

                  <button
                    type="submit"
                    disabled={isSearching}
                    className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 font-bold text-black text-xs transition hover:bg-emerald-400 active:scale-[0.99] shadow-sm shadow-emerald-500/20"
                  >
                    {isSearching ? (
                      <>
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search size={14} />
                        Track Now
                      </>
                    )}
                  </button>
                </form>

                <div className="my-3 flex items-center gap-2">
                  <div className="h-px flex-1 bg-white/10"></div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">or</span>
                  <div className="h-px flex-1 bg-white/10"></div>
                </div>

                <button className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 text-xs font-semibold text-white transition hover:bg-white/10 active:scale-[0.99]">
                  <MessageCircle size={14} className="text-emerald-400" />
                  WhatsApp Us
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= GROUNDED WHITE STATS BAR ================= */}

      {/* ================= GROUNDED WHITE STATS BAR ================= */}
      {/* ================= GROUNDED WHITE STATS BAR ================= */}
<section className="relative z-30 -translate-y-1/2 -mb-10 sm:-mb-12">
  <div className="mx-auto max-w-[1550px] px-4 sm:px-6 lg:px-8">
    <div className="rounded-3xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">

        {/* Years */}
        <div className="flex items-center gap-3.5 border-b border-gray-100 py-5 px-5 lg:border-b-0 lg:border-r">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-gray-700 shrink-0">
            <Award size={22} />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">15+</h4>
            <p className="text-xs text-gray-500 mt-0.5">Years in Business</p>
          </div>
        </div>

        {/* Laptops Sold */}
        <div className="flex items-center gap-3.5 border-b border-gray-100 py-5 px-5 lg:border-b-0 lg:border-r">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-gray-700 shrink-0">
            <Laptop size={22} />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">50,000+</h4>
            <p className="text-xs text-gray-500 mt-0.5">Laptops Sold</p>
          </div>
        </div>

        {/* Repairs */}
        <div className="flex items-center gap-3.5 border-b border-gray-100 py-5 px-5 md:border-b-0 lg:border-r">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-gray-700 shrink-0">
            <Wrench size={22} />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">18,000+</h4>
            <p className="text-xs text-gray-500 mt-0.5">Repairs Completed</p>
          </div>
        </div>

        {/* Rentals */}
        <div className="flex items-center gap-3.5 border-b border-gray-100 py-5 px-5 lg:border-b-0 lg:border-r">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-gray-700 shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">3,000+</h4>
            <p className="text-xs text-gray-500 mt-0.5">Laptops on Rent</p>
          </div>
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-3.5 border-b border-gray-100 py-5 px-5 lg:border-b-0 lg:border-r">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-gray-700 shrink-0">
            <Star size={22} />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">4.9/5</h4>
            <p className="text-xs text-gray-500 mt-0.5">Google Ratings</p>
          </div>
        </div>

        {/* Pickup */}
        <div className="flex items-center gap-3.5 py-5 px-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-gray-700 shrink-0">
            <Truck size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-tight">Pickup & Drop</h4>
            <p className="text-xs text-gray-500 mt-0.5">Available Across City</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

      {/* ================= REPAIR STATUS MODAL ================= */}

      {trackingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#111827] shadow-2xl">
            <div className="h-1.5 w-full bg-emerald-500"></div>
            <div className="p-8">
              <button
                onClick={closeTrackingModal}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10 text-white"
              >
                <X size={18} />
              </button>

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                <CheckCircle2 size={34} className="text-emerald-400" />
              </div>

              <h2 className="mt-6 text-3xl font-bold text-white">Repair Status</h2>
              <p className="mt-2 text-gray-400">Your repair request has been found.</p>

              <div className="mt-8 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Job ID</span>
                  <span className="font-semibold text-white">{trackingResult.id}</span>
                </div>
                <div className="border-t border-white/10"></div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="font-semibold text-emerald-400">{trackingResult.status}</span>
                </div>
                <div className="border-t border-white/10"></div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Device</span>
                  <span className="text-white">{trackingResult.device}</span>
                </div>
                <div className="border-t border-white/10"></div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Technician</span>
                  <span className="text-white">{trackingResult.technician}</span>
                </div>
                <div className="border-t border-white/10"></div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Completion</span>
                  <span className="text-white">{trackingResult.estimatedCompletion}</span>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Repair Progress</span>
                  <span className="text-emerald-400">70%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[70%] rounded-full bg-emerald-500"></div>
                </div>
              </div>

              <button
                onClick={closeTrackingModal}
                className="mt-8 h-12 w-full rounded-xl bg-emerald-500 font-bold text-black transition hover:bg-emerald-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}