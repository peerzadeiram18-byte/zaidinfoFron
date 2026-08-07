import React, { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import zaidinfotechVideo from "../../assets/vedio/zaidinfotech.mp4";

const CompanyVideo = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoElement?.play().catch((error) => {
            console.log("Autoplay blocked or interrupted:", error);
          });
        } else {
          videoElement?.pause();
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (videoElement) {
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, []);

  return (
    <section className="w-full bg-white dark:bg-slate-950 transition-colors duration-300 pt-8 sm:pt-10 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left Side */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
                <span className="text-orange-600 dark:text-orange-500">
                  One-Stop Destination
                </span>{" "}
                for the Best Laptops
              </h2>

              <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-slate-300 leading-relaxed">
                Choose <span className="font-semibold text-gray-900 dark:text-white">Zaid Infotech</span> for
                convenience, quality, and unbeatable prices. Your perfect laptop
                is just a click away!
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center flex-shrink-0">
                    <Check className="text-orange-600 dark:text-orange-400" size={18} />
                  </div>
                  <p className="text-base text-gray-700 dark:text-slate-300 leading-snug">
                    <span className="font-semibold text-gray-900 dark:text-white">Trusted Brands:</span> Find
                    top laptops from Dell, Apple MacBook, Lenovo, ASUS, HP, and
                    more.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center flex-shrink-0">
                    <Check className="text-orange-600 dark:text-orange-400" size={18} />
                  </div>
                  <p className="text-base text-gray-700 dark:text-slate-300 leading-snug">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Laptops for Every Need:
                    </span>{" "}
                    Wide range of options for work, study, gaming, and business.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center flex-shrink-0">
                    <Check className="text-orange-600 dark:text-orange-400" size={18} />
                  </div>
                  <p className="text-base text-gray-700 dark:text-slate-300 leading-snug">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Fast & Safe Delivery:
                    </span>{" "}
                    Experience quick and reliable delivery to your doorstep.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center flex-shrink-0">
                    <Check className="text-orange-600 dark:text-orange-400" size={18} />
                  </div>
                  <p className="text-base text-gray-700 dark:text-slate-300 leading-snug">
                    <span className="font-semibold text-gray-900 dark:text-white">Expert Support:</span> Get
                    personalized recommendations and after-sales assistance.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white text-base font-semibold rounded-full shadow-lg transition-all duration-300">
                CONTACT NOW
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="h-full">
            <div className="rounded-3xl overflow-hidden shadow-2xl h-full border border-transparent dark:border-slate-800">
             <video
  ref={videoRef}
  src={zaidinfotechVideo}
  autoPlay
  muted
  playsInline
  loop
  disablePictureInPicture
  controls={false}
  controlsList="nodownload nofullscreen noremoteplayback"
  className="w-full h-[450px] lg:h-[500px] object-cover pointer-events-none"
>
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyVideo;