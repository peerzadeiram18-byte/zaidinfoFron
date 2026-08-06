import React from "react";
import "./OurAchievement.css";

export default function OurAchievements() {
  const achievements = [
    {
      number: "800,000+",
      title: "Epic Deals Delivered",
      desc: "That's over 800,000 moments of tech joy unboxed.",
    },
    {
      number: "6000+",
      title: "Happy Shoppers Served",
      desc: "Thousands of customers, one unbeatable experience.",
    },
    {
      number: "100,000+",
      title: "Tech Fans Visit Monthly",
      desc: "That's over 100,000+ reasons to keep bringing the heat.",
    },
    {
      number: "98%",
      title: "Customer Satisfaction",
      desc: "Because “almost perfect” just isn't good enough for us.",
    },
    {
      number: "5000+",
      title: "Awesome Products",
      desc: "From laptops to gadgets, we've got the ultimate line-up ready for you.",
    },
  ];

  return (
    <section className="achievements-section">
      {/* Header */}
      <div className="achievements-header">
        <img
          alt="Our Achievement"
          loading="lazy"
          src="https://static-media.laptopoutlet.co.uk/wysiwyg/upgrade_2/page/2025/about-us/achievements.gif"
        />
        <h2>Our Achievements</h2>
      </div>

      {/* Grid Cards */}
      <div className="achievements-grid">
        {achievements.map((item, index) => (
          <div key={index} className="achievement-card">
            <span className="achievement-number">{item.number}</span>
            <span className="achievement-title">{item.title}</span>
            <p className="achievement-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}