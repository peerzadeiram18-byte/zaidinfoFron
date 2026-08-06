// Brands.jsx

import React from "react";

// Import brand logos from assets
import dellLogo from "../../assets/images/Dell-Logo.png";
import lenovoLogo from "../../assets/images/Lenovo-Logo.png";
import toshibaLogo from "../../assets/images/Toshiba-Logo.png";
import samsungLogo from "../../assets/images/Samsung-Logo.png";
import appleLogo from "../../assets/images/Apple-Logo.png";
import hpLogo from "../../assets/images/Hp-logo.png";

const brands = [
  { name: "Dell", logo: dellLogo, heightClass: "max-h-10 sm:max-h-12" },
  { name: "Lenovo", logo: lenovoLogo, heightClass: "max-h-8 sm:max-h-10" },
  { name: "HP", logo: hpLogo, heightClass: "max-h-10 sm:max-h-12" },
  { name: "Apple", logo: appleLogo, heightClass: "max-h-9 sm:max-h-11" },
  { name: "Samsung", logo: samsungLogo, heightClass: "max-h-7 sm:max-h-9" },
  { name: "Toshiba", logo: toshibaLogo, heightClass: "max-h-10 sm:max-h-12" },
];

const BrowseByBrands = () => {
  return (
    <section className="w-full pt-4 md:pt-6 pb-12 md:pb-16 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Background Accent Blur matching Hero section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 dark:bg-green-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        {/* Heading Section */}
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-block text-xs md:text-sm font-semibold tracking-wider text-green-600 dark:text-green-400 uppercase bg-green-50 dark:bg-green-950/60 px-4 py-1.5 rounded-full border border-green-200/60 dark:border-green-800/60 mb-3 shadow-xs transition-colors duration-300">
            Trusted Quality
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
            Browse By <span className="text-green-600 dark:text-green-400">Brands</span>
          </h2>
          <div className="w-16 h-1 bg-green-500 dark:bg-green-400 mx-auto mt-3 rounded-full" />
        </div>

        {/* Brands Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-xl dark:hover:shadow-slate-950/50 hover:border-green-500/60 dark:hover:border-green-500/60 hover:-translate-y-1.5 transition-all duration-300 ease-out flex items-center justify-center h-28 sm:h-32 cursor-pointer"
            >
              {/* Card Accent Glow on Hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-green-50/0 via-green-50/20 to-green-100/30 dark:from-green-500/0 dark:via-green-500/5 dark:to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Brand Logo Container with rounded neutral chip so white logos don't clash */}
              <div className="relative w-full h-full flex items-center justify-center p-2 rounded-xl bg-white/90 dark:bg-white p-2">
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className={`${brand.heightClass} w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-105`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseByBrands;