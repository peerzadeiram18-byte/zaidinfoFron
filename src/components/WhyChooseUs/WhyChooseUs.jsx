// WhyChooseUs

import React from 'react';
import { 
  UserCheck, 
  Settings, 
  Clock, 
  Truck, 
  ShieldCheck, 
  DollarSign 
} from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      title: 'Expert Engineers',
      subtitle: 'Certified & Experienced',
      icon: UserCheck,
    },
    {
      id: 2,
      title: 'Genuine Parts',
      subtitle: '100% Original Parts',
      icon: Settings,
    },
    {
      id: 3,
      title: 'Quick Turnaround',
      subtitle: 'Fast & Reliable Service',
      icon: Clock,
    },
    {
      id: 4,
      title: 'Doorstep Service',
      subtitle: 'Pickup & Drop',
      icon: Truck,
    },
    {
      id: 5,
      title: 'Warranty Assured',
      subtitle: 'Up to 1 Year Warranty',
      icon: ShieldCheck,
    },
    {
      id: 6,
      title: 'Transparent Pricing',
      subtitle: 'No Hidden Charges',
      icon: DollarSign,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 pt-8 sm:pt-10 pb-3 sm:pb-4">
      {/* Header with Dark Mode Text & Accent Underline */}
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wide inline-block relative">
          WHY CHOOSE ZAID INFOTECH?
          <span className="block h-1 w-10 bg-[#22c55e] mx-auto mt-2 rounded-full" />
        </h2>
      </div>

      {/* Grid Features Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4 items-center">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={feature.id}
              className="flex items-center space-x-3 p-2 transition-transform duration-200 hover:-translate-y-1"
            >
              {/* Circular Icon Container */}
              <div className="w-12 h-12 rounded-full border-2 border-gray-800 dark:border-slate-200 flex items-center justify-center shrink-0">
                <IconComponent className="w-6 h-6 text-gray-800 dark:text-slate-100 stroke-[1.75]" />
              </div>

              {/* Text Info */}
              <div className="text-left">
                <h3 className="text-xs md:text-sm font-bold text-gray-900 dark:text-slate-100 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium leading-tight">
                  {feature.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhyChooseUs;