import React from 'react';
import { motion } from 'framer-motion';
import ServiceCard from './ServiceCard';

import rentlaptop from '../../assets/images/rentlaptop.jpg';
import laptoprepair from '../../assets/images/laptoprepair.jpg';
import coorporatesolutions from '../../assets/images/coorporatesolutions.jpg';
import { toast } from "react-toastify";

const refurbishedLaptopUrl =
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: 'RENT LAPTOPS',
      subtitle: 'Flexible Rental Solutions for Every Need',
      points: [
        'Daily / Weekly / Monthly',
        'Corporate Rentals',
        'Events & Exhibitions',
        'Students & Developers',
        'Bulk Rentals Available',
      ],
      buttonText: 'Explore Rentals',
      bgImage: rentlaptop,
      bgPosition: 'center',
    },
    {
      id: 2,
      title: 'REPAIRS & SUPPORT',
      subtitle: 'Expert Repairs with Warranty',
      points: [
        'All Brands Supported',
        'RMA & Warranty Repairs',
        'AMC Services',
        'Pickup & Delivery',
        'Live Repair Tracking',
      ],
      buttonText: 'Book a Repair',
      bgImage: laptoprepair,
      bgPosition: '75% 15%',
    },
    {
      id: 3,
      title: 'CERTIFIED REFURBISHED',
      subtitle: 'Best Quality. Best Price. Best Value.',
      points: [
        '100+ Point Quality Check',
        'Battery & SSD Tested',
        '1 Year Warranty',
        'Best Prices in Chennai',
        'Easy Return Policy',
      ],
      buttonText: 'View Collection',
      bgImage: refurbishedLaptopUrl,
      bgPosition: 'center',
    },
    {
      id: 4,
      title: 'CORPORATE SOLUTIONS',
      subtitle: 'Complete IT Solutions for Businesses',
      points: [
        'Bulk Laptop Supply',
        'IT Asset Management',
        'AMC & Support',
        'GST Billing & PO Support',
        'Dedicated Account Manager',
      ],
      buttonText: 'Get a Quote',
      bgImage: coorporatesolutions,
      bgPosition: 'center',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  return (
    /* Changed pb-12 to pb-2 to prevent double-padding stack with the next section */
    <section className="w-full px-2 sm:px-4 lg:px-6 pt-2 pb-2">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            subtitle={service.subtitle}
            points={service.points}
            buttonText={service.buttonText}
            bgImage={service.bgImage}
            bgPosition={service.bgPosition}
            onButtonClick={() => toast.error(`Clicked: ${service.buttonText}`)}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default ServicesSection;