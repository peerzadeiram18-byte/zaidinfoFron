import React from "react";
import AdvantageCard from "./AdvantageCard"; // Make sure file name matches (e.g. ./ShopCard if not renamed)

// 1. Image imports
import oneImg from "../../assets/images/one.png";
import twoImg from "../../assets/images/two.png";
import threeImg from "../../assets/images/three.png";
import fourImg from "../../assets/images/four.png";

const AdvantagesSection = () => {
  // 2. Data array
  const advantagesData = [
    {
      id: 1,
      imageSrc: oneImg,
      title: "BEST SUPPORT",
      description: "We provide the best technical support for our products.",
    },
    {
      id: 2,
      imageSrc: twoImg,
      title: "TIME SAVING",
      description: "We value your time. So we will give you response on time",
    },
    {
      id: 3,
      imageSrc: threeImg,
      title: "Quick Response",
      description: "Good Honest Quick Response",
    },
    {
      id: 4,
      imageSrc: fourImg,
      title: "Great Offer",
      description: "We are offering great deal to our clients",
    },
  ];

  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Section Header */}
        <span className="text-[#E5532A] text-base md:text-lg font-bold tracking-wide mb-2">
          Advantages
        </span>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0A1D37] tracking-tight mb-4">
          Why we are best
        </h2>

        <p className="text-[#666666] text-sm md:text-base max-w-2xl mb-12">
          Zaid Infotech leads with genuine IT products, ensuring unmatched quality and reliability.
        </p>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {advantagesData.map((item) => (
            <AdvantageCard
              key={item.id}
              imageSrc={item.imageSrc}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default AdvantagesSection;