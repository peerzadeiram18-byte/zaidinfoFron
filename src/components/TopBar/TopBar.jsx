// import "./TopBar.css";

// function TopBar() {
//   return (
//     <div className="topbar">

//       <div className="topbar-left">
//         ENGINEERING LIVES THROUGH TECHNOLOGY
//       </div>

//       <div className="topbar-center">
//         GET A FREE CONSULTATION
//       </div>

//       <div className="topbar-right">
//         ZAID INFOTECH
//       </div>

//     </div>
//   );
// }

// export default TopBar;


// TopBar.jsx
import React from "react";
import { FaArrowRight } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="hidden xl:block bg-[#111827] text-white border-b border-white/10">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-6">

        {/* Left */}
        <p className="text-xs uppercase tracking-[0.18em] text-gray-300">
          Engineering Lives Through Technology
        </p>

        {/* Center */}
        <div className="flex items-center gap-3 text-sm">
          <span>Premium Laptops</span>

          <span className="h-1 w-1 rounded-full bg-gray-500"></span>

          <span className="text-emerald-400 font-semibold">
            Expert Repairs
          </span>

          <span className="h-1 w-1 rounded-full bg-gray-500"></span>

          <span>Flexible Rentals</span>
        </div>

        {/* Right */}
        <button className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400">
          Get Consultation
          <FaArrowRight size={12} />
        </button>

      </div>
    </div>
  );
}