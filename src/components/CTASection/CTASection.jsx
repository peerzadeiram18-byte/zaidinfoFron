import React from "react";
import { Phone } from "lucide-react";
import { motion } from "framer-motion";

import lappyImg from "../../assets/images/lappy.png";
import skylineImg from "../../assets/images/skyline.jpg";

const CTASection = () => {
  return (
    /* Outer section container with overflow-hidden to avoid page scrollbars during animation */
    <section className="w-full bg-white pt-24 pb-12 px-4 md:px-8 lg:px-12 flex justify-center overflow-hidden">
      
      {/* Wrapper constrained to max banner width (1512px) */}
      <div className="w-full max-w-[1512px] relative">
        
        {/* MAIN DARK BANNER */}
        <div 
          className="relative w-full rounded-2xl md:rounded-3xl bg-cover bg-center flex items-center min-h-[380px] lg:min-h-[463px]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(8, 22, 45, 0.95) 0%, rgba(10, 28, 56, 0.85) 45%, rgba(10, 28, 56, 0.4) 100%), url(${skylineImg})`
          }}
        >
          {/* LEFT CONTENT ANIMATING FROM OUTSIDE THE TOP OF THE BOX */}
          <motion.div 
            initial={{ opacity: 0, y: -150 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1], // Smooth deceleration curve
            }}
            className="w-full lg:w-3/5 pl-8 md:pl-16 lg:pl-20 pr-6 py-10 z-10 flex flex-col items-start text-left gap-5 text-white relative"
          >
            
            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Looking for Laptop ?
            </h2>

            {/* Subtitle */}
            <p className="text-slate-200 text-sm md:text-base lg:text-lg font-normal max-w-xl leading-relaxed">
              Upgrade your performance with the – premium quality, unbeatable prices, and expert support.
            </p>

            {/* Phone Info Block */}
            <div className="flex items-center gap-4 mt-2">
              <a 
                href="tel:+919092590725"
                className="w-12 h-12 rounded-full bg-slate-500/30 hover:bg-[#E5532A] border border-white/20 flex items-center justify-center transition-colors duration-300 flex-shrink-0"
              >
                <Phone className="w-5 h-5 text-white fill-current" />
              </a>

              <div className="flex flex-col text-left">
                <span className="text-sm md:text-base font-bold text-white">
                  Main Office Mobile Number
                </span>
                <a 
                  href="tel:+919092590725" 
                  className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-wide hover:text-[#E5532A] transition-colors text-white"
                >
                  +91 9092590725
                </a>
              </div>
            </div>

          </motion.div>
        </div>

        {/* OVERLAPPING MAN IMAGE (500px x 583px) */}
        <div className="hidden lg:block absolute bottom-0 right-4 lg:right-12 z-20 pointer-events-none">
          <img
            src={lappyImg}
            alt="Person Holding Laptop"
            className="w-[500px] h-[583px] object-contain object-bottom drop-shadow-2xl"
          />
        </div>

        {/* Mobile / Tablet fallback image positioning */}
        <div className="block lg:hidden flex justify-center -mt-16 z-20 relative">
          <img
            src={lappyImg}
            alt="Person Holding Laptop"
            className="w-[300px] sm:w-[400px] h-auto object-contain"
          />
        </div>

      </div>
    </section>
  );
};

export default CTASection;