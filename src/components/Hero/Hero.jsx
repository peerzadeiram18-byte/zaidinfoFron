import "./Hero.css";

import heroImage from "../../assets/images/hero.png";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-left">

        <h1>
          ZAID <br />
          <span>INFOTECH</span>
        </h1>

        <p>
          Certified premium refurbished laptops from top brands.
          Trusted, Tested, Delivered and Priced to save your money.
        </p>

        <div className="hero-buttons">

          <button className="shop-btn">
            Shop Now
          </button>

          <button className="service-btn">
            Book Service
          </button>

        </div>

      </div>

      <div className="hero-right">
<img
  src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"
  alt="Laptop"
  width="500"
/>
      </div>

    </section>
  );
}

export default Hero;