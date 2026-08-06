import React, { useEffect, useRef, useState } from 'react';
import './KeyDifferentiators.css';

const keyDifferentiators = [
  {
    id: 1,
    imgSrc: "https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets-new/images/keydiff-ico-1.svg",
    title: "18+ Years Experience",
    description: "Specialized expertise in enterprise laptop servicing",
    bgClass: "key-1",
    itemClass: "key-item-left"
  },
  {
    id: 2,
    imgSrc: "https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets-new/images/keydiff-ico-2.svg",
    title: "100% Genuine Parts",
    description: "Certified OEM components with official warranty",
    bgClass: "key-2",
    itemClass: "key-item-center"
  },
  {
    id: 3,
    imgSrc: "https://www.laptopstoreindia.in/wp-content/themes/laptopstore/assets-new/images/keydiff-ico-3.svg",
    title: "20 Lakh+ Customers",
    description: "Satisfied Customers",
    bgClass: "key-3",
    itemClass: "key-item-right"
  }
];

export default function Differentiator() {
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="key-sec" ref={sectionRef}>
      <div className="row2">
        <h2>Key Differentiators</h2>
        <div className="key-main">
          <ul className={`key-lst ${isRevealed ? 'revealed' : ''}`}>
            {keyDifferentiators.map((item) => (
              <li key={item.id} className={`key-item ${item.itemClass}`}>
                <div className={`key-div ${item.bgClass}`}>
                  <div className="key-content">
                    <img src={item.imgSrc} alt={item.title} width="80" height="80" />
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}