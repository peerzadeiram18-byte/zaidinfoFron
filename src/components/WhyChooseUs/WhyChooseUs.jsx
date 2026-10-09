// import React from 'react';
// import { 
//   UserCheck, 
//   Settings, 
//   Clock, 
//   Truck, 
//   ShieldCheck, 
//   DollarSign 
// } from 'lucide-react';

// const WhyChooseUs = () => {
//   const features = [
//     {
//       id: 1,
//       title: 'Expert Engineers',
//       subtitle: 'Certified & Experienced',
//       icon: UserCheck,
//     },
//     {
//       id: 2,
//       title: 'Genuine Parts',
//       subtitle: '100% Original Parts',
//       icon: Settings,
//     },
//     {
//       id: 3,
//       title: 'Quick Turnaround',
//       subtitle: 'Fast & Reliable Service',
//       icon: Clock,
//     },
//     {
//       id: 4,
//       title: 'Doorstep Service',
//       subtitle: 'Pickup & Drop',
//       icon: Truck,
//     },
//     {
//       id: 5,
//       title: 'Warranty Assured',
//       subtitle: 'Up to 1 Year Warranty',
//       icon: ShieldCheck,
//     },
//     {
//       id: 6,
//       title: 'Transparent Pricing',
//       subtitle: 'No Hidden Charges',
//       icon: DollarSign,
//     },
//   ];

//   return (
//     <section className="max-w-7xl mx-auto px-4 pt-8 sm:pt-10 pb-3 sm:pb-4">
//       {/* Header with Dark Mode Text & Accent Underline */}
//       <div className="text-center mb-6">
//         <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wide inline-block relative">
//           WHY CHOOSE ZAID INFOTECH?
//           <span className="block h-1 w-10 bg-[#22c55e] mx-auto mt-2 rounded-full" />
//         </h2>
//       </div>

//       {/* Grid Features Layout */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-4 items-center">
//         {features.map((feature) => {
//           const IconComponent = feature.icon;
//           return (
//             <div
//               key={feature.id}
//               className="flex items-start space-x-3 p-2 transition-transform duration-200 hover:-translate-y-1"
//             >
//               {/* Circular Icon Container */}
//               <div className="w-12 h-12 rounded-full border-2 border-gray-800 dark:border-slate-200 flex items-center justify-center shrink-0">
//                 <IconComponent className="w-6 h-6 text-gray-800 dark:text-slate-100 stroke-[1.75]" />
//               </div>

//               {/* Text Info */}
//               <div className="text-left">
//                 <h3 className="text-xs md:text-sm font-bold text-gray-900 dark:text-slate-100 leading-snug whitespace-nowrap">
//                   {feature.title}
//                 </h3>
//                 <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium leading-tight whitespace-nowrap">
//                   {feature.subtitle}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// };

// export default WhyChooseUs;


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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider inline-block relative">
          WHY CHOOSE ZAID INFOTECH?
          <span className="block h-1 w-10 sm:w-12 bg-[#22c55e] mx-auto mt-2 rounded-full" />
        </h2>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 min-[440px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-4 items-stretch">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={feature.id}
              className="group flex items-center sm:items-start p-3 sm:p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:bg-gray-50/70 dark:hover:bg-slate-800/40"
            >
              {/* Circular Icon Container */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border-2 border-gray-800 dark:border-slate-200 flex items-center justify-center shrink-0 group-hover:border-[#22c55e] transition-colors duration-200">
                <IconComponent className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-gray-800 dark:text-slate-100 stroke-[1.75] group-hover:text-[#22c55e] transition-colors duration-200" />
              </div>

              {/* Text Info (min-w-0 prevents flex overflow issues) */}
              <div className="ml-3 min-w-0 flex-1 text-left">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-slate-100 leading-snug line-clamp-1 xl:line-clamp-2">
                  {feature.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-slate-400 font-medium leading-tight mt-0.5 line-clamp-2">
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