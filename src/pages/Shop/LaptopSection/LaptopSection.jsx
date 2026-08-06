import React from "react";
import { motion } from "framer-motion";
import ProductCard from "../../../components/ProductCard/ProductCard";

const LaptopSection = ({
  title,
  items,
  icon,
  theme,
  onAddToCart,
  onAddToWishlist,
}) => {
  return (
    <section className="space-y-4">
      {/* Section Title */}
      <div className="pt-2 overflow-hidden py-1">
        <motion.h2
          initial={{
            fontWeight: 300,
            scale: 0.92,
            opacity: 0.6,
          }}
          whileInView={{
            fontWeight: 800,
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 1.1,
            ease: [0.25, 1, 0.5, 1],
          }}
          viewport={{
            once: false,
            amount: 0.3,
          }}
          className="text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight origin-left transition-colors duration-300"
        >
          {title}
        </motion.h2>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((product, index) => (
          <ProductCard
            key={product._id}
            product={product}
            index={index}
            theme={theme}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
          />
        ))}
      </div>
    </section>
  );
};

export default LaptopSection;